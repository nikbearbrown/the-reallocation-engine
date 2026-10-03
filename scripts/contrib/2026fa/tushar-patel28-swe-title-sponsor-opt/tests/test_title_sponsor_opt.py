"""Offline tests for title_sponsor_opt.py — one per failure case F1–F6, one deliberate break per gate,
the timeline bands and their exact boundaries, every G4 refusal case plus one valid G4 override,
the F-1 sponsorship-weight guard, and BROKEN-* mutant scorers.

Every end-to-end test runs the REAL scorer CLI (npm run score) — never a copy. Mutants are the real
scorer with one string replaced (fixtures/mutant-runner.mjs). All outputs go to temp dirs; nothing in the
repo is written. No network calls.

Run from the repo root:
    python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v
"""

from __future__ import annotations

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
PKG = HERE.parent
FIX = PKG / "fixtures"
sys.path.insert(0, str(PKG))

import title_sponsor_opt as tso  # noqa: E402

LABELS = set(tso.LABELS)


def fixture_args(out_dir: Path, **over):
    over.setdefault("overrides", FIX / "overrides-empty.json")
    argv = ["--persona", str(FIX / "persona.fixture.json"), "--roles", str(FIX / "roles-cases.json"),
            "--csv", str(FIX / "sponsorship-fixture.csv"), "--out-dir", str(out_dir)]
    for k, val in over.items():
        argv += [f"--{k.replace('_', '-')}", str(val)]
    return tso.parse_args(argv)


def unlabelled_leaves(obj, path="$", inside=False):
    """Every scalar must sit inside a dict carrying source ∈ LABELS. None marks an absent block."""
    bad = []
    if isinstance(obj, dict):
        labelled = inside or obj.get("source") in LABELS
        if "source" in obj and obj.get("source") not in LABELS and not inside:
            bad.append(f"{path}.source={obj.get('source')!r}")
        for k, val in obj.items():
            bad += unlabelled_leaves(val, f"{path}.{k}", labelled)
    elif isinstance(obj, list):
        for i, val in enumerate(obj):
            bad += unlabelled_leaves(val, f"{path}[{i}]", inside)
    elif obj is not None and not inside:
        bad.append(f"{path}={obj!r}")
    return bad


class RealScorerRun(unittest.TestCase):
    """One fixture run through the real scorer CLI, shared by the case tests."""

    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp(prefix="tspo-test-"))
        cls.res = tso.build(fixture_args(cls.tmp))
        cls.log = cls.res["log"]
        cls.by_id = {e["role_id"]["value"]: e for e in cls.log["roles"]}
        cls.sent = {r["role_id"]: r for r in json.loads(cls.res["roles_path"].read_text())}
        cls.scores = json.loads((cls.tmp / "role-scores.json").read_text())
        cls.scored = {r["role_id"]: r for r in cls.scores["roles"]}
        cls.report = cls.res["report_path"].read_text()

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    # ── F1–F6 ────────────────────────────────────────────────────────────────
    def test_F1_not_found_is_unknown_never_does_not_sponsor(self):
        e = self.by_id["f1-not-found"]
        self.assertEqual(e["g1_entity"]["status"]["value"], "not-found")
        self.assertEqual(e["sponsorship_vote"]["tier"]["value"], "Unknown")
        self.assertIsNone(e["sponsorship_vote"]["p"]["value"])
        self.assertNotIn(self.sent["f1-not-found"]["sponsorship"]["tier"], ("None", "Avoid"))
        votes = [x["factor"] for x in self.scored["f1-not-found"]["trace"]["votes"]]
        self.assertNotIn("sponsorship", votes, "an unknown company must not send a sponsorship vote (p=0 would claim non-sponsorship)")

    def test_F2_no_h1b_trace_is_unknown_not_zero(self):
        e = self.by_id["f2-no-trace"]
        self.assertEqual(e["g1_entity"]["status"]["value"], "no-h1b-trace")
        self.assertEqual(len(e["g1_entity"]["matched_rows"]), 1)
        self.assertEqual(e["sponsorship_vote"]["tier"]["value"], "Unknown")
        self.assertIsNone(self.sent["f2-no-trace"]["sponsorship"]["p"])

    def test_F3_outside_window_is_gated_skip_by_real_scorer(self):
        # revised 2026-10-01: 1–30 days early is now a soft 0.5 band, so the "before" case is day -31
        for rid, days in (("f3-before", -31), ("f3-after", 91)):
            with self.subTest(rid):
                self.assertEqual(self.by_id[rid]["g2_timeline"]["days_after_ead_start"]["value"], days)
                self.assertEqual(self.sent[rid]["timeline"]["factor"], 0.0)
                self.assertEqual(self.scored[rid]["machine_recommendation"], "Skip")
                self.assertTrue(self.scored[rid]["reason"].startswith("gated: timeline"), self.scored[rid]["reason"])

    def test_F4_missing_or_invalid_date_is_a_named_error_with_no_default(self):
        for rid in ("f4-missing", "f4-invalid", "f4-text"):
            with self.subTest(rid):
                e = self.by_id[rid]
                self.assertIsNotNone(e["error"])
                self.assertIn(rid, e["error"]["value"])
                self.assertIn("no default", e["error"]["value"])
                self.assertNotIn("g2_timeline", e)
                self.assertNotIn(rid, self.sent, "an errored role must not reach the scorer (it would default timeline to 1)")
                self.assertEqual(e["decision"]["next_action"]["value"], "blocked: fix the input and re-run")
        self.assertIn("matched-in", self.scored, "other roles must still be scored")

    def test_F5_unparseable_titles_claim_no_family(self):
        e = self.by_id["f5-unreadable"]
        self.assertEqual(e["g1_entity"]["status"]["value"], "matched-h1b")
        self.assertEqual(e["family_check"]["status"]["value"], "titles-unreadable")
        self.assertEqual(e["family_check"]["matched_titles"]["value"], [])
        self.assertIn("no family claim", e["family_check"]["claim"]["value"])
        self.assertEqual(self.sent["f5-unreadable"]["sponsorship"]["tier"], "Possible")

    def test_F6_guard_passes_on_real_scorer_and_weight_is_positive(self):
        n = tso.check_sponsorship_weights(self.scores)
        self.assertGreater(n, 0)
        self.assertTrue(self.scores["profile_needs_sponsorship"])
        for r in self.scores["roles"]:
            for vote in r["trace"]["votes"]:
                if vote["factor"] == "sponsorship":
                    self.assertGreater(vote["weight"], 0, r["role_id"])

    def test_F6_scorer_is_never_called_with_profile(self):
        cmd = self.log["scorer_run"]["command"]["value"]
        self.assertTrue(cmd.startswith("npm run score -- "), cmd)
        self.assertNotIn("--profile", cmd)
        self.assertEqual(self.scores["_scorer"], "bayesian-role-scorer")

    def test_soft_bands_are_scored_at_half_not_gated(self):
        for rid, days, band in (("early-30", -30, "1-30-days-before"), ("late-61", 61, "61-90-days-after")):
            with self.subTest(rid):
                t = self.by_id[rid]["g2_timeline"]
                self.assertEqual((t["days_after_ead_start"]["value"], t["band"]["value"]), (days, band))
                self.assertEqual(self.sent[rid]["timeline"]["factor"], 0.5)
                gates = {g["factor"]: g["multiplier"] for g in self.scored[rid]["trace"]["gates"]}
                self.assertEqual(gates["timeline"], 0.5)
                self.assertFalse(self.scored[rid]["reason"].startswith("gated"))
                self.assertLess(0.5, 0.6, "0.5 must sit below the scorer's 0.6 soft-timeline threshold")
        self.assertEqual(self.by_id["early-30"]["decision"]["note"]["value"],
                         "negotiate the start date to on or after the EAD start")
        self.assertIsNone(self.by_id["late-61"]["decision"]["note"])

    def test_next_action_rule(self):
        act = {rid: e["decision"]["next_action"]["value"] for rid, e in self.by_id.items()}
        self.assertEqual(act["matched-in"], "tailor an application")          # Likely
        self.assertEqual(act["matched-not-in"], "network into the company")   # Possible
        self.assertEqual(act["f1-not-found"], "network into the company")     # Unknown
        self.assertEqual(self.scored["unknown-skip"]["machine_recommendation"], "Skip")
        self.assertEqual(act["unknown-skip"], "network into the company", "unknown is not no: a scorer Skip on Unknown still networks")
        self.assertEqual(act["f3-before"], "skip")                            # gated
        self.assertEqual(act["f3-after"], "skip")
        self.assertEqual(act["g1-ambiguous"], "blocked: pick the right company row, then re-run")
        self.assertEqual(act["f4-missing"], "blocked: fix the input and re-run")

    # ── deliberate break per gate ────────────────────────────────────────────
    def test_G1_break_no_fuzzy_match_no_namesake_no_guessing_between_rows(self):
        self.assertEqual(self.by_id["g1-near-miss"]["g1_entity"]["status"]["value"], "not-found")
        self.assertEqual(self.by_id["g1-namesake"]["g1_entity"]["status"]["value"], "not-found",
                         "'Cohere' must not attach to 'COHERE HEALTH INC'")
        amb = self.by_id["g1-ambiguous"]
        self.assertEqual(amb["g1_entity"]["status"]["value"], "ambiguous")
        self.assertEqual(len(amb["g1_entity"]["matched_rows"]), 2)
        self.assertIsNone(self.sent["g1-ambiguous"]["sponsorship"]["p"])
        self.assertEqual(amb["decision"]["next_action"]["value"], "blocked: pick the right company row, then re-run")

    def test_G3_break_input_cannot_claim_liveness_was_checked(self):
        sent = self.sent["g3-tamper"]["liveness"]
        self.assertEqual(sent, {"factor": 1.0, "source": "your-input", "assumed": True, "checked": False})
        self.assertFalse(self.by_id["g3-tamper"]["g3_liveness"]["checked"]["value"])
        self.assertEqual(self.log["summary"]["g3_cleared"]["value"], 0)

    def test_G3_every_apply_or_tailor_is_shown_blocked(self):
        block = "blocked at G3 until npm run ats:liveness is run by a human"
        for e in self.log["roles"]:
            shown, action = e["decision"]["shown"]["value"], e["decision"]["next_action"]["value"]
            if (shown.startswith("Apply") and "G4 human override" not in shown) or action == "tailor an application":
                self.assertIn(block, shown, e["role_id"]["value"])
        self.assertEqual(self.log["summary"]["by_final_recommendation"]["value"].get("Apply", 0), 0,
                         "with no G4 entries nothing may be Apply")
        for line in self.report.splitlines():
            if "tailor an application [" in line:
                self.assertIn(block, line)
        mappings = tso.load_mappings(tso.DEFAULTS["mappings"])
        self.assertEqual(tso.shown_decision("Apply", "tailor an application", mappings), f"Apply — {block}")

    # ── labels ───────────────────────────────────────────────────────────────
    def test_every_value_in_the_log_is_labelled(self):
        bad = unlabelled_leaves(self.log)
        self.assertEqual(bad, [], f"unlabelled values: {bad[:10]}")

    def test_every_term_sent_to_the_scorer_is_labelled(self):
        for rid, r in self.sent.items():
            for term in ("sponsorship", "fit", "liveness", "timeline"):
                self.assertIn(r[term]["source"], LABELS, f"{rid}.{term}")

    def test_report_opens_with_executive_summary(self):
        lines = [ln for ln in self.report.splitlines() if ln.strip()]
        self.assertTrue(lines[1].startswith("## Executive summary"), lines[:2])
        self.assertIn("not immigration advice", self.report)


class G2Boundaries(unittest.TestCase):
    """Deliberate break of G2: probe every band edge; no date gets a default."""

    def setUp(self):
        self.tl = tso.load_mappings(tso.DEFAULTS["mappings"])["timeline"]
        self.ead = tso.parse_iso_date("2027-01-22")

    def test_band_edges(self):
        import datetime as dt
        # revised bands (2026-10-01): >30 early 0 · 1–30 early 0.5 · 0–60 after 1.0 · 61–90 after 0.5 · >90 after 0
        for days, factor in ((-400, 0.0), (-31, 0.0), (-30, 0.5), (-1, 0.5), (0, 1.0), (60, 1.0),
                             (61, 0.5), (90, 0.5), (91, 0.0), (400, 0.0)):
            with self.subTest(days=days):
                start = (self.ead + dt.timedelta(days=days)).isoformat()
                self.assertEqual(tso.g2_timeline("r", start, self.ead, self.tl)["factor"], factor)

    def test_no_default_for_bad_dates(self):
        for bad in (None, "", "TBD", "2027-13-01", "2027/02/08", "20270208", 20270208):
            with self.subTest(bad=bad), self.assertRaises(tso.RoleInputError):
                tso.g2_timeline("r", bad, self.ead, self.tl)

    def test_persona_without_ead_start_stops_the_run(self):
        tmp = Path(tempfile.mkdtemp(prefix="tspo-test-"))
        try:
            p = tmp / "persona.json"
            p.write_text(json.dumps({"name": "x", "ead_start_date": "January"}))
            with self.assertRaises(tso.ConfigError):
                tso.load_persona(p)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


class G4HumanGate(unittest.TestCase):
    """G4 — the only path to Apply. One valid (clearly fictional) entry and every refusal case."""

    @classmethod
    def setUpClass(cls):
        cls.tmp = Path(tempfile.mkdtemp(prefix="tspo-g4-"))
        cls.res = tso.build(fixture_args(cls.tmp, overrides=FIX / "overrides-cases.json"))
        cls.log = cls.res["log"]
        cls.results = {}
        for g in cls.log["g4_overrides"]["results"]:
            cls.results.setdefault(g["entry"]["value"].get("role_id"), []).append(g["result"])
        cls.scored = {r["role_id"]: r for r in json.loads((cls.tmp / "role-scores.json").read_text())["roles"]}
        cls.sent = {r["role_id"]: r for r in json.loads(cls.res["roles_path"].read_text())}
        cls.by_id = {e["role_id"]["value"]: e for e in cls.log["roles"]}

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def refused(self, rid, fragment):
        res = self.results[rid]
        self.assertEqual([r["value"] for r in res], ["refused"], rid)
        self.assertIn(fragment, res[0]["message"])
        self.assertIn(rid, res[0]["message"], "the refusal must name the role")
        self.assertNotIn("override", self.sent.get(rid, {}), f"{rid}: a refused entry must not reach the scorer")
        if rid in self.scored:
            self.assertNotEqual(self.scored[rid]["recommendation"], "Apply")

    def test_valid_override_becomes_apply_in_real_scorer_output(self):
        self.assertEqual([r["value"] for r in self.results["matched-in"]], ["accepted"])
        s = self.scored["matched-in"]
        self.assertEqual(s["machine_recommendation"], "Consider")
        self.assertEqual(s["recommendation"], "Apply")
        self.assertEqual(s["override"]["decision"], "Apply")
        for frag in ("lca_evidence_source=FICTIONAL TEST FIXTURE", "fiscal_year=2026", "soc_code=15-1252",
                     "posting_says_no_sponsorship=false", "liveness_checked_on=2026-09-30", "checked_on=2026-09-30",
                     "intent to file, not an approved visa"):
            self.assertIn(frag, s["override"]["reason"])
        self.assertEqual(self.sent["matched-in"]["liveness"]["checked_on"], "2026-09-30")
        e = self.by_id["matched-in"]
        self.assertTrue(e["decision"]["shown"]["value"].startswith("Apply — G4 human override"))
        self.assertEqual(e["decision"]["next_action"]["value"], "apply")
        self.assertEqual(self.log["summary"]["g4_accepted"]["value"], 1)

    def test_refuse_missing_field(self):
        self.refused("matched-not-in", "missing field(s) ['soc_code']")

    def test_refuse_posting_says_no_sponsorship(self):
        self.refused("f2-no-trace", "the posting says it does not sponsor")

    def test_refuse_timeline_gate_zero(self):
        self.refused("f3-after", "timeline gate is 0")

    def test_refuse_entity_ambiguous(self):
        self.refused("g1-ambiguous", "company match is ambiguous")

    def test_refuse_entity_not_found(self):
        self.refused("f1-not-found", "company match is not-found")

    def test_refuse_wrong_type_and_unknown_role(self):
        self.refused("f5-unreadable", "must be true or false")
        self.refused("no-such-role", "no such role")

    def test_refusals_unit(self):
        ctx = {"r": {"scored": True, "timeline_factor": 1.0, "band": "0-60-days-after", "g1_status": "matched-h1b"},
               "e": {"scored": False, "timeline_factor": None, "band": None, "g1_status": "matched-h1b"}}
        base = {"role_id": "r", "lca_evidence_source": "x", "fiscal_year": 2026, "soc_code": "15-1252",
                "posting_says_no_sponsorship": False, "liveness_checked_on": "2026-09-30", "checked_on": "2026-09-30",
                "reason": "x"}
        today = tso.dt.date(2026, 10, 1)
        self.assertIsNone(tso.validate_override(dict(base), ctx, set(), today))
        for field in tso.G4_FIELDS:
            with self.subTest(missing=field):
                bad = dict(base); bad.pop(field)
                self.assertIn("missing field", tso.validate_override(bad, ctx, set(), today))
        self.assertIn("in the future", tso.validate_override({**base, "checked_on": "2026-10-02"}, ctx, set(), today))
        self.assertIn("more than one entry", tso.validate_override(dict(base), ctx, {"r"}, today))
        self.assertIn("not scored", tso.validate_override({**base, "role_id": "e"}, ctx, set(), today))
        self.assertIn("soc_code", tso.validate_override({**base, "soc_code": "Software Developers"}, ctx, set(), today))

    def test_every_value_labelled_with_overrides(self):
        self.assertEqual(unlabelled_leaves(self.log), [])


class CrosswalkPrinciples(unittest.TestCase):
    """Closed crosswalk DEFINE: precision over recall; ambiguous titles map to no family; title match only."""

    @classmethod
    def setUpClass(cls):
        cls.cw = tso.load_crosswalk(tso.DEFAULTS["crosswalk"])

    def fam(self, title):
        return tso.title_families(title, self.cw)

    def test_ambiguous_titles_map_to_no_family(self):
        for title in ("Data Engineer", "Backend Data Engineer", "Solutions Architect", "Senior Solutions Engineer",
                      "Engineer", "Senior Engineer", "Member of Technical Staff", "Research Scientist",
                      "Data Scientist", "Applied Scientist II", "Senior Reliability Engineer"):
            with self.subTest(title):
                self.assertEqual(self.fam(title), set())

    def test_non_ic_and_non_family_roles_map_to_no_family(self):
        for title in ("Software Engineering Manager", "Director, Software Engineering", "Senior Software Engineer in Test",
                      "Principal QA Software Engineer", "AI Success Manager", "Director of AI",
                      "Engineering Manager, Site Reliability Engineering", "Presales Network Engineer",
                      "Principal Product Manager - Machine Learning", "Software Engineer, Sr. Analyst"):
            with self.subTest(title):
                self.assertEqual(self.fam(title), set())

    def test_clear_titles_map_to_their_families(self):
        for title, want in (("Software Engineer", {"SWE"}), ("Senior Software Engineer", {"SWE"}),
                            ("Full Stack Java Developer", {"SWE"}), ("Staff Engineer (Full Stack)", {"SWE"}),
                            ("Machine Learning Engineer", {"AI"}), ("AI/DS Engineer", {"AI"}),
                            ("Software Engineer, Machine Learning", {"SWE", "AI"}),
                            ("Senior Cloud Engineer I", {"Cloud"}), ("Site Reliability Engineer", {"Cloud"}),
                            ("Software Engineer - Infrastructure", {"SWE", "Cloud"}),
                            ("Senior Machine Learning DevOps Engineer", {"AI", "Cloud"})):
            with self.subTest(title):
                self.assertEqual(self.fam(title), want)

    def test_P1_limitation_ai_filed_as_software_engineer_is_invisible(self):
        """Known limitation, kept on purpose: an AI role filed as 'Software Engineer' shows only as SWE."""
        row = {"top_job_titles_sponsored": "['Software Engineer', 'Solutions Architect']"}
        present, _, _ = tso.load_h1b_helpers()
        fc = tso.family_check(row, "AI", self.cw, present)
        self.assertEqual(fc["status"], "not-in-top-titles")
        self.assertEqual(fc["matched"], [])

    def test_excluded_titles_are_reported(self):
        row = {"top_job_titles_sponsored": "['Software Engineering Manager', 'Senior Software Engineer in Test']"}
        present, _, _ = tso.load_h1b_helpers()
        fc = tso.family_check(row, "SWE", self.cw, present)
        self.assertEqual(fc["status"], "not-in-top-titles")
        self.assertEqual(fc["excluded"], ["Senior Software Engineer in Test"])  # hit 'software engineer', excluded by 'test'


class GuardUnit(unittest.TestCase):
    def test_zero_weight_trips_guard(self):
        scores = {"roles": [{"role_id": "x", "trace": {"votes": [{"factor": "sponsorship", "weight": 0, "value": 0.6}]}}]}
        with self.assertRaises(tso.GuardError):
            tso.check_sponsorship_weights(scores)

    def test_vacuous_output_trips_guard(self):
        with self.assertRaises(tso.GuardError):
            tso.check_sponsorship_weights({"roles": [{"role_id": "x", "trace": {"votes": []}}]})


class BrokenScorers(unittest.TestCase):
    """Each BROKEN-* mutant must be rejected by a guard (GuardError — not a crash, not a pass)."""

    def run_mutant(self, name):
        tmp = Path(tempfile.mkdtemp(prefix="tspo-mutant-"))
        try:
            with self.assertRaises(tso.GuardError) as cm:
                tso.build(fixture_args(tmp), scorer_cmd=["node", str(FIX / f"{name}.mjs")])
            return str(cm.exception)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    def test_mutants_are_not_stale(self):
        src = (tso.REPO / "scripts" / "score" / "role-scorer.mjs").read_text()
        for anchor in ("const needsSponsor = profile == null ? true",
                       "const timeline = num(role.timeline?.factor) ?? 1;", "gate_zero: 0.05,"):
            self.assertIn(anchor, src)

    def test_BROKEN_sponsorship_weight_zero_is_caught(self):
        self.assertIn("sponsorship weight is 0", self.run_mutant("BROKEN-sponsorship-weight-zero"))

    def test_BROKEN_timeline_ignored_is_caught(self):
        self.assertIn("scorer used gates", self.run_mutant("BROKEN-timeline-ignored"))

    def test_BROKEN_gate_zero_off_is_caught(self):
        self.assertIn("timeline factor 0 was sent", self.run_mutant("BROKEN-gate-zero-off"))


class SampleRunOnRealCsv(unittest.TestCase):
    """The shipped sample against the real 80 Days CSV, into a temp dir (regression, offline)."""

    def test_sample_run(self):
        tmp = Path(tempfile.mkdtemp(prefix="tspo-sample-"))
        try:
            res = tso.build(tso.parse_args(["--out-dir", str(tmp)]))
            s = res["log"]["summary"]
            self.assertEqual(s["roles_in"]["value"], 12)
            self.assertEqual(s["roles_not_scored"]["value"], 1)
            self.assertEqual(res["log"]["dataset_context"]["rows_with_h1b_fields"]["value"], 1557)
            self.assertEqual(unlabelled_leaves(res["log"]), [])
            self.assertEqual(res["log"]["g4_overrides"]["entries_in_file"]["value"], 0)
            self.assertEqual(s["by_final_recommendation"]["value"].get("Apply", 0), 0)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    def test_sample_overrides_ship_empty(self):
        """No real DOL check has been done: any sample entry would be an invented record."""
        self.assertEqual(tso.load_overrides(tso.DEFAULTS["overrides"]), [])


if __name__ == "__main__":
    unittest.main()
