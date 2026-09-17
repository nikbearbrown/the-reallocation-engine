#!/usr/bin/env python3
"""unittest for greenhouse_watch.py — offline, fixture-driven. Run from the skill folder:

    python3 -m unittest tests/test_greenhouse_watch.py -v
"""
import json, os, shutil, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
SCRIPT = os.path.join(SKILL, "scripts", "greenhouse_watch.py")
FIXTURE = os.path.join(HERE, "fixture-board.json")
REPO = os.path.abspath(os.path.join(SKILL, "..", "..", ".."))
RESUME = os.path.join(REPO, "search", "examples", "aarav-patel", "resume.example.json")

sys.path.insert(0, os.path.join(SKILL, "scripts"))
import greenhouse_watch as gw  # noqa: E402


def _load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def _write(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def _dump(obj, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f)


def run(args, cwd=None):
    p = subprocess.run([sys.executable, SCRIPT] + args, capture_output=True, text=True, cwd=cwd)
    return p.returncode, p.stdout, p.stderr


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="gw-")
        self.state = os.path.join(self.tmp, "state.json")
        self.out = os.path.join(self.tmp, "out")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def common(self, extra=()):
        return ["--board", "airbnb", "--resume", RESUME, "--state", self.state, "--out", self.out,
                "--fixture", FIXTURE] + list(extra)

    def latest(self, prefix, suffix):
        files = sorted(f for f in os.listdir(self.out) if f.startswith(prefix) and f.endswith(suffix))
        return os.path.join(self.out, files[-1])


class TestBaselineAndDiff(Base):
    def test_baseline_records_all_reports_none(self):
        rc, out, err = run(self.common())
        self.assertEqual(rc, 0, err)
        self.assertIn("BASELINE", out)
        state = _load(self.state)
        fixture_ids = sorted(str(j["id"]) for j in _load(FIXTURE)["jobs"])
        self.assertEqual(sorted(state["seen_ids"]), fixture_ids)
        rec = _load(self.latest("run-", ".json"))
        self.assertTrue(rec["baseline"]); self.assertEqual(rec["jobs_new"], 0); self.assertEqual(rec["relevant"], [])

    def test_second_run_reports_only_unseen_ids(self):
        run(self.common())
        s = _load(self.state); dropped = s["seen_ids"].pop(0)
        _dump(s, self.state)
        rc, out, err = run(self.common())
        self.assertEqual(rc, 0, err)
        rec = _load(self.latest("run-", ".json"))
        self.assertFalse(rec["baseline"]); self.assertEqual(rec["jobs_new"], 1)
        new_ids = {str(r["id"]) for r in rec["relevant"] + rec["skipped"]}
        self.assertEqual(new_ids, {dropped})
        self.assertIn(dropped, _load(self.state)["seen_ids"])  # state re-includes it

    def test_two_runs_in_one_second_do_not_overwrite(self):
        run(self.common()); run(self.common())
        self.assertGreaterEqual(len([f for f in os.listdir(self.out) if f.startswith("run-")]), 2)

    def test_dry_run_leaves_state_untouched(self):
        rc, _, _ = run(self.common(["--dry-run"]))
        self.assertEqual(rc, 0); self.assertFalse(os.path.exists(self.state))


class TestInputs(Base):
    def test_malformed_resume_rejected(self):
        bad = os.path.join(self.tmp, "resume.json"); _write(bad, "{not json")
        rc, _, err = run(["--board", "airbnb", "--resume", bad, "--state", self.state, "--out", self.out, "--fixture", FIXTURE])
        self.assertEqual(rc, 2); self.assertIn("not valid JSON", err)

    def test_wrong_shape_resume_rejected(self):
        bad = os.path.join(self.tmp, "resume.json"); _dump({"name": "x", "skills": "python"}, bad)
        rc, _, err = run(["--board", "airbnb", "--resume", bad, "--state", self.state, "--out", self.out, "--fixture", FIXTURE])
        self.assertEqual(rc, 2); self.assertIn("resume.example.json shape", err)

    def test_corrupt_state_rejected_not_silently_rebaselined(self):
        _write(self.state, "{}")
        rc, _, err = run(self.common())
        self.assertEqual(rc, 2); self.assertIn("corrupt", err)

    def test_empty_jobs_list_is_a_run_not_a_crash(self):
        empty = os.path.join(self.tmp, "empty.json"); _dump({"jobs": []}, empty)
        rc, out, err = run(["--board", "airbnb", "--resume", RESUME, "--state", self.state, "--out", self.out, "--fixture", empty])
        self.assertEqual(rc, 0, err); self.assertIn("seen=0", out)

    def test_response_without_jobs_fails_and_keeps_state(self):
        run(self.common()); before = _read(self.state)
        broken = os.path.join(self.tmp, "broken.json"); _dump({"error": "rate limited"}, broken)
        rc, _, err = run(["--board", "airbnb", "--resume", RESUME, "--state", self.state, "--out", self.out, "--fixture", broken])
        self.assertEqual(rc, 3); self.assertEqual(_read(self.state), before)

    def test_bad_slug_and_bad_host_refused(self):
        rc, _, err = run(["--board", "Evil/../x", "--resume", RESUME, "--state", self.state, "--out", self.out, "--fixture", FIXTURE])
        self.assertEqual(rc, 2)
        with self.assertRaises(gw.InputError):
            gw.assert_allowed("https://example.com/v1/boards/airbnb/jobs")
        with self.assertRaises(gw.InputError):
            gw.assert_allowed("http://boards-api.greenhouse.io/v1/boards/airbnb/jobs")


class TestScheme(unittest.TestCase):
    def setUp(self):
        self.scheme = _load(os.path.join(SKILL, "scheme.default.json"))
        self.feats = gw.resume_features(_load(RESUME))

    def job(self, title, loc, content):
        return {"id": 1, "title": title, "location": {"name": loc}, "content": content, "absolute_url": "https://x"}

    def test_relevant_job_is_justified_with_field_paths(self):
        ok, score, why, reason = self.scheme and gw.judge(self.job("Software Engineer, Platform", "Remote", "<p>We use Python, Kubernetes and Kafka.</p>"), self.feats, self.scheme)
        self.assertTrue(ok, why)
        joined = "\n".join(why)
        self.assertIn("experience[0].title", joined); self.assertIn("skills.languages[1]", joined); self.assertIn("Remote", joined)

    def test_no_skill_hit_is_never_relevant(self):
        ok, score, why, reason = gw.judge(self.job("Software Engineer", "Boston, MA", "<p>Nothing technical listed.</p>"), self.feats, self.scheme)
        self.assertFalse(ok); self.assertIn("no résumé skill", reason)

    def test_exclude_pattern_skips_before_scoring(self):
        ok, score, why, reason = gw.judge(self.job("Software Engineer Intern", "Remote", "Python Kubernetes"), self.feats, self.scheme)
        self.assertFalse(ok); self.assertEqual(reason, "excluded-by-title")

    def test_hard_location_mode_is_a_gate(self):
        s = dict(self.scheme, location_mode="hard")
        ok, score, why, reason = gw.judge(self.job("Software Engineer", "Berlin, Germany", "Python Kubernetes Kafka"), self.feats, s)
        self.assertFalse(ok); self.assertEqual(reason, "location-hard-fail")

    def test_partial_title_needs_both_words_for_two_word_title(self):
        ok, score, why, reason = gw.judge(self.job("Machine Learning Engineer", "Remote", "Python Kubernetes Kafka"), self.feats, self.scheme)
        self.assertNotIn("shares most words", "\n".join(why))

    def test_unshipped_skill_weighted_low_and_labeled(self):
        ok, score, why, reason = gw.judge(self.job("Software Engineer", "Remote", "Rust and Terraform only"), self.feats, self.scheme)
        joined = "\n".join(why)
        self.assertIn("familiar_with_not_shipped", joined); self.assertIn("+0.25", joined)


if __name__ == "__main__":
    unittest.main()
