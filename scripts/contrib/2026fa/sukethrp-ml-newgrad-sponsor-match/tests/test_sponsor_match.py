"""Offline tests for sponsor_match.py.

No network. Every run sets SPONSOR_MATCH_FORBID_NETWORK=1, which makes any
attempted live check raise. The end-to-end tests use fictional companies from
fixtures/test-sponsorship.csv. The real-data tests only read the shipped
sponsorship file. The scorer is the engine's own scripts/score/role-scorer.mjs,
run through its CLI, so these tests exercise the real scorer rather than a copy.

Run from the repo root:
    python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

TOOL = Path(__file__).resolve().parent.parent
REPO = TOOL.parents[3]
SCRIPT = TOOL / "sponsor_match.py"
FIX = TOOL / "fixtures"
TEST_CSV = FIX / "test-sponsorship.csv"
TEST_ROLES = FIX / "test-roles.json"
RECIPE = REPO / "recipes" / "cases" / "2026fa" / "sukethrp-ml-newgrad-sponsor-match.md"

_spec = importlib.util.spec_from_file_location("sponsor_match", SCRIPT)
SM = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(SM)


def sha(path: Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def run(*args) -> subprocess.CompletedProcess:
    env = dict(os.environ, SPONSOR_MATCH_FORBID_NETWORK="1")
    return subprocess.run([sys.executable, str(SCRIPT), *map(str, args)], cwd=REPO, env=env,
                          capture_output=True, text=True)


def run_fixture(out_dir: Path, *extra) -> subprocess.CompletedProcess:
    return run("--roles", TEST_ROLES, "--csv", TEST_CSV, "--csv-sha256", sha(TEST_CSV), "--out-dir", out_dir, *extra)


class TitleRules(unittest.TestCase):
    """The declared title rules, one title at a time."""

    rules = SM.load_rules(SM.DEFAULT_RULES)

    def check(self, title, family, unmarked):
        got = SM.classify_title(title, self.rules)
        self.assertEqual((got["role_family"], got["unmarked"]), (family, unmarked), title)

    def test_ml_titles_with_no_marker_count_as_role_level_evidence(self):
        self.check("Machine Learning Engineer", True, True)
        self.check("Software Engineer, Machine Learning", True, True)
        self.check("NLP Engineer", True, True)

    def test_seniority_markers(self):
        self.check("Senior Machine Learning Engineer", True, False)
        self.check("Sr. Software Engineer, Machine Learning", True, False)
        self.check("Machine Learning Engineer III", True, False)
        self.check("Staff AI/ML Data Engineer", True, False)
        self.check("Founding ML Engineer", True, False)             # v0.2.0, from the v0.1.0 audit

    def test_level_markers_are_not_entry_level_evidence(self):     # v0.2.0, from the v0.1.0 audit
        self.check("Machine Learning Engineer II", True, False)
        self.check("Machine Learning Engineer (L2)", True, False)

    def test_not_ml(self):
        self.check("Software Engineer", False, False)
        self.check("HTML Developer", False, False)            # 'ml' inside a word is not ML
        self.check("Email Marketing Specialist", False, False)  # 'ai' inside a word is not AI

    def test_non_engineering_titles_are_excluded(self):        # v0.2.0, from the v0.1.0 audit
        self.check("AI DEVELOPER ADVOCATE", False, False)
        self.check("AI Success Manager", False, False)
        self.check("Principal Product Manager - Machine Learning", False, False)
        self.check("Enterprise Business Operations Manager - AI", False, False)


class EndToEnd(unittest.TestCase):
    """One run over the 18-role fixture queue: one role per gate branch."""

    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp(prefix="sponsor-match-test-"))
        cls.proc = run_fixture(cls.tmp)
        cls.log = json.loads((cls.tmp / "sponsor-match-log.json").read_text())
        cls.roles = {r["role_id"]: r for r in cls.log["roles"]}
        cls.sent = {r["role_id"]: r for r in json.loads((cls.tmp / "roles.json").read_text())}
        cls.scored = json.loads((cls.tmp / "role-scores.json").read_text())

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def test_run_completes_and_writes_both_outputs(self):
        self.assertEqual(self.proc.returncode, 0, self.proc.stderr)
        for name in ("sponsor-match-log.json", "sponsor-match-report.md", "roles.json",
                     "role-scores.json", "role-scores.md"):
            self.assertTrue((self.tmp / name).is_file(), name)
        self.assertEqual(self.log["status"], "complete")

    def test_each_role_lands_where_its_gates_send_it(self):
        expected = {  # role: (status, hold reason, next action)
            "t01": ("ready", None, "TAILOR"),                       # Proven, every gate open
            "t02": ("ready", None, "NETWORK-FIRST"),                # ML titles all senior
            "t03": ("ready", None, "NETWORK-FIRST"),                # no ML title at all
            "t04": ("ready", None, "NETWORK-FIRST"),                # ML title, but only 2 approvals
            "t05": ("held", "no-h1b-record", "RESOLVE"),            # Unknown is not Avoid
            "t06": ("held", "no-company-match", "RESOLVE"),         # no fuzzy guessing
            "t07": ("held", "ambiguous-company-match", "RESOLVE"),  # two rows, no pick
            "t08": ("ready", None, "SKIP"),                         # 404 closes the liveness gate
            "t09": ("held", "liveness-uncertain", "RESOLVE"),
            "t10": ("held", "no-timeline-factor", "RESOLVE"),       # never defaults to open
            "t11": ("held", "stale-liveness", "RESOLVE"),
            "t12": ("held", "no-approvals-on-record", "RESOLVE"),
            "t13": ("held", "unparseable-sponsored-titles", "RESOLVE"),
            "t14": ("ready", None, "TAILOR"),
            "t15": ("ready", None, "TAILOR"),
            "t16": ("ready", None, "CONSIDER"),                     # fit not rated
            "t17": ("ready", None, "TAILOR"),                       # human override with a reason
            "t18": ("ready", None, "NETWORK-FIRST"),                # row chosen by a person
        }
        got = {k: (r["status"], r["hold_reason"], r["next_action"]["action"]) for k, r in self.roles.items()}
        self.assertEqual(got, expected)

    def test_held_roles_never_reach_the_scorer(self):
        held = {k for k, r in self.roles.items() if r["status"] == "held"}
        self.assertEqual(held & set(self.sent), set())
        self.assertEqual(set(self.sent), {k for k, r in self.roles.items() if r["status"] == "ready"})

    def test_every_scorer_term_is_labeled_and_no_model_judgment(self):
        for role_id, role in self.sent.items():
            for term in ("sponsorship", "fit", "liveness", "timeline"):
                if term in role:
                    self.assertIn(role[term]["source"], ("record", "your-input"), f"{role_id}.{term}")
        self.assertNotIn("model-judgment", (self.tmp / "roles.json").read_text())

    def test_gates_reach_the_scorer_explicitly(self):
        for role_id, role in self.sent.items():
            self.assertIn("factor", role["liveness"], role_id)
            self.assertIn("factor", role["timeline"], role_id)
        self.assertEqual(self.sent["t08"]["liveness"]["factor"], 0.0)

    def test_liveness_is_a_record_only_when_saved_evidence_backs_it(self):
        self.assertEqual(self.roles["t14"]["liveness"]["source"], "record")
        self.assertTrue(self.roles["t14"]["liveness"]["evidence_verified"])
        self.assertEqual(self.roles["t15"]["liveness"]["source"], "your-input")
        self.assertEqual(self.roles["t01"]["liveness"]["source"], "your-input")  # synthetic snapshot

    def test_unrated_fit_is_dropped_and_flagged(self):
        self.assertNotIn("fit", self.sent["t16"])
        self.assertTrue(any("fit not rated" in f for f in self.roles["t16"]["flags"]))

    def test_override_passes_through_and_is_named_as_yours(self):
        t17 = self.roles["t17"]
        self.assertEqual(t17["scorer"]["machine_recommendation"], "Consider")
        self.assertEqual(t17["scorer"]["recommendation"], "Apply")
        self.assertIn("your override", t17["next_action"]["why"])

    def test_a_row_chosen_by_a_person_relabels_what_is_read_through_it(self):
        t18 = self.roles["t18"]
        self.assertEqual(t18["company_match"]["source"], "your-input")
        self.assertEqual(t18["sponsorship"]["approvals"]["source"], "your-input")

    def test_ambiguous_match_lists_candidates_and_picks_none(self):
        gate = self.roles["t07"]["gates"][-1]
        self.assertEqual(sorted(c["csv_row"] for c in gate["candidates"]), [6, 7])
        self.assertNotIn("company_match", self.roles["t07"])

    def test_personal_columns_never_reach_any_output(self):
        for path in self.tmp.iterdir():
            text = path.read_text()
            for secret in ("555-0100", "Pat Example", "Sam Placeholder"):
                self.assertNotIn(secret, text, f"{secret} leaked into {path.name}")

    def test_report_opens_with_an_executive_summary(self):
        lines = [l for l in (self.tmp / "sponsor-match-report.md").read_text().splitlines() if l.startswith("## ")]
        self.assertEqual(lines[0], "## Executive summary")

    def test_summary_counts_held_roles_separately(self):
        s = self.log["summary"]
        self.assertEqual((s["evaluated"], s["held"], s["scored"]), (18, 8, 10))
        self.assertEqual((s["apply"], s["consider"], s["skip"]), (4, 5, 1))
        self.assertEqual(s["skip_rate_of_scored"], "10%")


class RunLevelGates(unittest.TestCase):
    """Stops that end the run before anything is scored."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="sponsor-match-gate-"))

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def assert_stopped(self, proc, gate, fragment, code=2):
        self.assertEqual(proc.returncode, code, proc.stdout + proc.stderr)
        self.assertIn(f"STOP at the {gate} gate", proc.stderr)
        self.assertIn(fragment, proc.stderr)

    def test_source_gate_stops_on_an_unpinned_hash(self):
        out = self.tmp / "out"
        proc = run("--roles", TEST_ROLES, "--csv", TEST_CSV, "--csv-sha256", "0" * 64, "--out-dir", out)
        self.assert_stopped(proc, "source", "not the pinned")
        self.assertFalse(out.exists())

    def test_source_gate_needs_an_explicit_hash_for_another_file(self):
        self.assert_stopped(run("--roles", TEST_ROLES, "--csv", TEST_CSV, "--out-dir", self.tmp),
                            "source", "--csv-sha256")

    def test_input_gate_names_missing_fields(self):
        bad = self.tmp / "queue.json"
        bad.write_text(json.dumps({"as_of": "2026-09-30", "persona": "search/examples/priya-nair/profile.yml",
                                   "roles": [{"role_id": "x", "company": "Example Robotics"}]}))
        self.assert_stopped(run_fixture(self.tmp / "out", "--roles", bad), "input", "roles[0].title is required")

    def test_persona_must_say_it_needs_sponsorship(self):
        persona = self.tmp / "profile.yml"
        text = (REPO / "search/examples/priya-nair/profile.yml").read_text()
        persona.write_text(re.sub(r"(?m)^needs_sponsorship:.*\n", "", text))
        self.assert_stopped(run_fixture(self.tmp / "out", "--persona", persona), "input", "needs_sponsorship")

    def test_never_reads_a_profile_outside_the_fictional_personas(self):
        self.assert_stopped(run_fixture(self.tmp / "out", "--persona", "private/README.md"),
                            "input", "not a fictional persona")

    def test_never_writes_into_tracked_engine_folders(self):
        self.assert_stopped(run_fixture("data/examples/should-not-exist"), "input", "outside this contribution")
        self.assertFalse((REPO / "data/examples/should-not-exist").exists())

    def test_does_not_overwrite_committed_evidence_without_permission(self):
        guarded = REPO / "course/2026fa/submissions/sukethrp/.test-overwrite-guard"
        try:
            guarded.mkdir(parents=True)
            (guarded / "earlier-run.txt").write_text("an earlier run\n")
            self.assert_stopped(run_fixture(guarded), "input", "already holds a run")
        finally:
            shutil.rmtree(guarded, ignore_errors=True)


class BreakAttempts(unittest.TestCase):
    """Deliberate attempts to make the run lie."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="sponsor-match-break-"))

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_authorization_text_that_zeroes_sponsorship_voids_the_run(self):
        """The scorer reads 'work authorized' as 'no sponsorship needed'. The contract gate must catch it."""
        proc = run_fixture(self.tmp, "--scorer-profile", FIX / "BROKEN-authorization-profile.json")
        self.assertEqual(proc.returncode, 1, proc.stdout + proc.stderr)
        self.assertIn("STOP at the scorer-contract gate", proc.stderr)
        scored = json.loads((self.tmp / "role-scores.json").read_text())
        self.assertIs(scored["profile_needs_sponsorship"], False)  # the engine behaviour this guards against
        weights = {v["factor"]: v["weight"] for v in scored["roles"][0]["trace"]["votes"]}
        self.assertEqual(weights["sponsorship"], 0)
        log = json.loads((self.tmp / "sponsor-match-log.json").read_text())
        self.assertEqual(log["status"], "void")
        self.assertTrue(all("next_action" not in r for r in log["roles"]))
        self.assertIn("This run is VOID", (self.tmp / "sponsor-match-report.md").read_text())

    def test_live_mode_only_fetches_hosts_the_recipe_names(self):
        """The fixture URLs are on example.com. With the network forbidden, a fetch attempt would fail the run."""
        proc = run_fixture(self.tmp, "--live")
        self.assertEqual(proc.returncode, 0, proc.stdout + proc.stderr)
        log = json.loads((self.tmp / "sponsor-match-log.json").read_text())
        self.assertEqual(log["liveness_run"]["live_urls"], [])
        reached = [r for r in log["roles"] if any(g["gate"] == "liveness" for g in r["gates"])]
        self.assertTrue(reached)
        self.assertTrue(all(r["hold_reason"] == "host-not-allowed" for r in reached))


class RealDataContract(unittest.TestCase):
    """The shipped sponsorship file is the one the audits describe."""

    rules = SM.load_rules(SM.DEFAULT_RULES)
    csv_path = REPO / rules["source"]["csv"]

    def test_file_matches_the_pinned_hash(self):
        self.assertEqual(sha(self.csv_path), self.rules["source"]["sha256"])

    def test_counts_match_the_published_audit(self):
        _, by_row, rows = SM.load_sponsorship(self.csv_path, SM.load_normalizer())
        with_h1b = sum(1 for row in by_row.values() if row["Total Approvals"])
        self.assertEqual((rows, with_h1b), (30369, 1557))  # join-validation audit: 30,369 rows, 1,557 with H-1B

    def test_company_names_use_the_engines_own_normalizer(self):
        self.assertEqual(SM.load_normalizer().__module__, "entity_resolution")


class RecipeFrontmatter(unittest.TestCase):
    """The lifecycle claims in the recipe match its body (doctor does not scan recipes/cases/)."""

    def setUp(self):
        if not RECIPE.exists():
            self.skipTest("recipe not written yet")

    def test_status_and_todos_are_honest(self):
        text = RECIPE.read_text()
        fm = dict(re.findall(r"(?m)^([a-z_]+):\s*(.*?)\s*$", text.split("\n---", 1)[0]))
        self.assertIn(fm["status"], ("DRAFT", "SPECIFIED", "RUNNABLE-SAMPLE"))
        self.assertEqual(fm["attestation"], "null")
        self.assertEqual(int(fm["todos_open"]), text.count("[TODO"))


if __name__ == "__main__":
    unittest.main()
