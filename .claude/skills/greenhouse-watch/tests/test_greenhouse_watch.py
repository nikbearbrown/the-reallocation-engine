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

    def test_justification_lines_sum_to_score(self):
        # A reader who adds up the report lines must get the score. Aarav has two
        # "Software Engineer" titles: the title weight is credited once, and the
        # skill_any bonus is its own line (bug seen on Figma, 2026-09-23: lines said 6.0, score 3.5).
        import re
        for loc in ("Remote", "London, England"):
            ok, score, why, reason = gw.judge(self.job("Software Engineer, Platform", loc, "<p>Python, Kubernetes, Kafka.</p>"), self.feats, self.scheme)
            total = sum(float(m) for line in why for m in re.findall(r"([+-]\d+(?:\.\d+)?)$", line))
            self.assertAlmostEqual(total, score, msg="\n".join(why))


if __name__ == "__main__":
    unittest.main()


class AshbyBoard(unittest.TestCase):
    """--ats ashby: Ashby postings are normalised onto the Greenhouse-shaped fields; ignore_skills drops boilerplate."""
    FIX = os.path.join(os.path.dirname(__file__), "fixture-ashby-board.json")

    def _run(self, tmp, extra=()):
        import subprocess, sys
        state = os.path.join(tmp, "s.json")
        with open(state, "w") as f:
            json.dump({"board": "writer", "last_run_at": None, "seen_ids": []}, f)
        cmd = [sys.executable, SCRIPT, "--ats", "ashby", "--board", "writer", "--resume", RESUME, "--fixture", self.FIX,
               "--state", state, "--out", tmp, *extra]
        return subprocess.run(cmd, capture_output=True, text=True), tmp

    def test_normalises_and_reports(self):
        import tempfile, glob
        with tempfile.TemporaryDirectory() as tmp:
            r, out = self._run(tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            run = json.load(open(glob.glob(os.path.join(out, "run-*.json"))[0]))
            self.assertEqual(run["ats"], "ashby")
            self.assertEqual(run["jobs_seen"], 2)
            rows = run["relevant"] + run["skipped"]
            self.assertTrue(all(str(x["id"]).count("-") == 4 for x in rows), "Ashby uuids survive as ids")
            self.assertTrue(any("ashbyhq.com" in (x.get("url") or "") for x in run["relevant"]) or run["relevant"] == [])

    def test_ashby_url_and_host(self):
        sys.path.insert(0, os.path.dirname(SCRIPT))
        import greenhouse_watch as gw
        self.assertEqual(gw.board_url("Jasper AI", ats="ashby"),
                         "https://api.ashbyhq.com/posting-api/job-board/Jasper%20AI?includeCompensation=true")
        self.assertIn("api.ashbyhq.com", gw.ALLOWED_HOSTS)
        with self.assertRaises(gw.InputError):
            gw.board_url("../evil", ats="ashby")

    def test_ignore_skills_drops_boilerplate(self):
        sys.path.insert(0, os.path.dirname(SCRIPT))
        import greenhouse_watch as gw
        resume = json.load(open(RESUME))
        resume["skills"] = {"x": ["Python", "banana"]}
        feats = gw.resume_features(resume)
        job = {"title": "Cook", "location": {"name": "Remote"}, "content": "python banana"}
        scheme = {"scheme_version": "t", "threshold": 0.5, "weights": {"skill": 1.0, "skill_any": 0.5, "location": 1.0}, "ignore_skills": ["banana"]}
        ok, score, why, _ = gw.judge(job, feats, scheme)
        self.assertTrue(ok)
        self.assertFalse(any("banana" in w for w in why), why)


class SmartRecruitersBoard(unittest.TestCase):
    """--ats smartrecruiters: paged listing + detail records are normalised; ids, urls, contract flags survive."""
    FIX = os.path.join(os.path.dirname(__file__), "fixture-smartrecruiters-board.json")

    def test_normalises_detail_records(self):
        import tempfile, glob
        with tempfile.TemporaryDirectory() as tmp:
            state = os.path.join(tmp, "s.json")
            with open(state, "w") as f:
                json.dump({"board": "Canva", "last_run_at": None, "seen_ids": []}, f)
            r = subprocess.run([sys.executable, SCRIPT, "--ats", "smartrecruiters", "--board", "Canva", "--resume", RESUME,
                                "--fixture", self.FIX, "--state", state, "--out", tmp], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
            run = json.load(open(glob.glob(os.path.join(tmp, "run-*.json"))[0]))
            self.assertEqual(run["ats"], "smartrecruiters")
            self.assertEqual(run["jobs_seen"], 2)
            rows = run["relevant"] + run["skipped"]
            self.assertTrue(all(str(x["id"]).startswith("6000000") for x in rows))
            urls = [x.get("url") for x in run["relevant"]]
            self.assertTrue(all("jobs.smartrecruiters.com/Canva/" in u for u in urls), urls)

    def test_smartrecruiters_normaliser_fields(self):
        import greenhouse_watch as gw
        raw = json.load(open(self.FIX))
        norm = gw.normalize_jobs(raw["jobs"], "smartrecruiters")
        by = {n["title"].strip(): n for n in norm}
        pss = by["Product Support Specialist, Education Team  (Full time, 1-year contract)".strip()]
        self.assertIn("Remote", pss["location"]["name"])
        self.assertEqual(pss["smartrecruiters"]["typeOfEmployment"], "Contract")
        self.assertTrue(pss["content"])  # jobAd sections were joined into content
        self.assertTrue(any(d["name"] for d in pss["departments"]))

    def test_smartrecruiters_url_and_host(self):
        import greenhouse_watch as gw
        self.assertEqual(gw.board_url("Canva", ats="smartrecruiters"),
                         "https://api.smartrecruiters.com/v1/companies/Canva/postings?limit=100&offset=0")
        self.assertIn("api.smartrecruiters.com", gw.ALLOWED_HOSTS)
        with self.assertRaises(gw.InputError):
            gw.board_url("Canva/../x", ats="smartrecruiters")
