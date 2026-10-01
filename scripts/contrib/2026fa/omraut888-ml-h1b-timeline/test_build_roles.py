#!/usr/bin/env python3
"""Self-running harness for build_roles.py; exits 0 on pass, 1 on failure.

    python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py

Uses the committed fixture CSV, never the real sponsorship data, and drives
the scorer through its CLI (it exports nothing, so importing it would run it).
"""

import csv
import datetime as dt
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build_roles as br  # noqa: E402

FIXTURE_CSV = HERE / "fixtures" / "sponsorship-sample.csv"
SCORER = br.REPO / "scripts/score/role-scorer.mjs"

PERSONA = {
    "visa": {"opt_end_date": dt.date(2027, 1, 31), "unemployment_ceiling": 90,
             "unemployment_days_used": 34, "buffer_target": 20},
    "skills": ["Python", "SQL", "MLflow"],
    "target_tokens": ["ai", "data", "engineer", "ml"],
}


class Timeline(unittest.TestCase):
    def test_usable_days_from_persona(self):
        self.assertEqual(br.usable_days(PERSONA["visa"], br.AS_OF), 36)

    def test_opt_window_closed_gives_zero_days(self):
        self.assertEqual(br.usable_days(PERSONA["visa"], dt.date(2027, 2, 1)), 0)

    def test_buffer_exhausted_never_goes_negative(self):
        visa = dict(PERSONA["visa"], unemployment_days_used=85)
        self.assertEqual(br.usable_days(visa, br.AS_OF), 0)

    def test_factor_is_ratio_capped_at_one(self):
        self.assertEqual(br.timeline_factor(36, 56), 0.6429)
        self.assertEqual(br.timeline_factor(36, 21), 1.0)
        self.assertEqual(br.timeline_factor(0, 56), 0.0)

    def test_stage_buckets(self):
        self.assertEqual(br.lag_for_stage("Series D+"), 56)
        self.assertEqual(br.lag_for_stage("Series C"), 56)
        self.assertEqual(br.lag_for_stage("Seed"), 21)
        self.assertEqual(br.lag_for_stage(""), 56)


class Sponsorship(unittest.TestCase):
    def test_shrinkage_pulls_small_samples_toward_prior(self):
        self.assertEqual(br.shrunk_p(2, 0, prior=0.5), round(4.5 / 7, 4))
        self.assertLess(br.shrunk_p(2, 0, prior=0.5), br.shrunk_p(200, 0, prior=0.5))

    def test_prior_is_volume_weighted_not_equal_weighted(self):
        # equal-weighted mean of rates would be (0.99 + 0.0) / 2 = 0.495
        subset = [{"Total Approvals": "99.0", "Total Denials": "1.0", "Approval_Rate": "99.0"},
                  {"Total Approvals": "0.0", "Total Denials": "1.0", "Approval_Rate": "0.0"}]
        self.assertEqual(round(br.sponsorship_prior(subset), 4), round(99 / 101, 4))

    def test_tier_boundaries(self):
        self.assertEqual(br.tier_for(5), "Proven")
        self.assertEqual(br.tier_for(4), "Likely")
        self.assertEqual(br.tier_for(1), "Likely")
        self.assertEqual(br.tier_for(0), "Unknown")


class Fit(unittest.TestCase):
    def test_target_tokens_from_profile(self):
        persona = br.load_persona(br.PERSONA_DIR)
        self.assertEqual(persona["target_tokens"], ["ai", "data", "engineer", "ml"])

    def test_whole_word_overlap(self):
        # "email" and "mlops" must not count as "ai" / "ml"
        p, hits = br.fit_p(["ai", "data", "engineer", "ml"], ["Email Marketing Engineer", "MLOps Lead"])
        self.assertEqual(hits, ["engineer"])
        self.assertEqual(p, 0.25)

    def test_full_overlap_is_one(self):
        p, _ = br.fit_p(["ai", "ml"], ["AI/ML Engineer", "ML Engineer"])
        self.assertEqual(p, 1.0)


class TitleKeywords(unittest.TestCase):
    def test_no_match_inside_other_words(self):
        for title in ["Fulfillment Operations Lead", "Fulfillment Shift Manager", "Email Specialist", "HTML Developer"]:
            self.assertIsNone(br.TITLE_KEYWORDS.search(title), title)

    def test_real_ml_titles_still_match(self):
        for title in ["Machine Learning Engineer III", "Sr. ML Engineer", "AI/ML Engineer", "NLP Scientist",
                      "LLM Engineer", "Research Data Scientist", "Applied Scientist II", "Data Science Manager"]:
            self.assertIsNotNone(br.TITLE_KEYWORDS.search(title), title)


class Build(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.roles, cls.audit = br.build(FIXTURE_CSV, PERSONA, br.AS_OF)
        cls.by_id = {r["role_id"]: r for r in cls.roles}

    def test_only_h1b_rows_with_ml_titles_become_roles(self):
        self.assertEqual(self.audit["rows_in_csv"], 6)
        self.assertEqual(self.audit["rows_with_h1b_data"], 5)
        self.assertEqual(sorted(self.by_id), ["late-ml-inc", "tiny-ai-labs"])

    def test_unparseable_titles_are_counted_not_dropped_silently(self):
        self.assertEqual(self.audit["skipped"]["unparseable-titles"]["companies"], ["BROKEN TITLES CO"])

    def test_every_role_is_labeled_unchecked_for_liveness(self):
        for r in self.roles:
            self.assertFalse(r["liveness_checked"])
            self.assertEqual(r["liveness"]["factor"], 1.0)

    def test_stage_drives_timeline(self):
        self.assertEqual(self.by_id["late-ml-inc"]["timeline"]["factor"], 0.6429)
        self.assertEqual(self.by_id["tiny-ai-labs"]["timeline"]["factor"], 1.0)

    def test_zero_approvals_use_fixed_prior_others_use_main(self):
        with FIXTURE_CSV.open(newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        late = next(r for r in rows if r["company_name"] == "LATE ML INC")
        late.update({"Total Approvals": "0.0", "Total Denials": "2.0", "Approval_Rate": "0.0"})
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "zero.csv"
            with path.open("w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
            roles, audit = br.build(path, PERSONA, br.AS_OF)
        by_id = {r["role_id"]: r for r in roles}
        zero, main = audit["assumptions"]["zero_approval_prior"], audit["assumptions"]["sponsorship_prior"]["value"]
        self.assertEqual(zero["value"], 0.3)
        self.assertTrue(zero["source"].startswith("your-input"))
        self.assertIn("your-input zero-approval prior 0.3", by_id["late-ml-inc"]["sponsorship"]["source"])
        self.assertEqual(by_id["late-ml-inc"]["sponsorship"]["p"], br.shrunk_p(0, 2, 0.3))  # (0 + 1.5) / 7
        self.assertIn("toward prior", by_id["tiny-ai-labs"]["sponsorship"]["source"])
        self.assertEqual(by_id["tiny-ai-labs"]["sponsorship"]["p"], br.shrunk_p(2, 0, main))

    def test_small_sample_is_likely_tier_and_below_raw_rate(self):
        tiny = self.by_id["tiny-ai-labs"]
        self.assertEqual(tiny["sponsorship"]["tier"], "Likely")
        self.assertLess(tiny["sponsorship"]["p"], 1.0)  # raw rate is 100%


def run_scorer(roles):
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "roles.json"
        path.write_text(json.dumps(roles))
        subprocess.run(["node", str(SCORER), str(path), "--out-dir", tmp], check=True, capture_output=True)
        return json.loads((Path(tmp) / "role-scores.json").read_text())["roles"]


class ScorerContract(unittest.TestCase):
    def test_scorer_accepts_built_roles(self):
        roles, _ = br.build(FIXTURE_CSV, PERSONA, br.AS_OF)
        scored = run_scorer(roles)
        self.assertEqual(len(scored), len(roles))
        for s in scored:
            self.assertEqual({v["factor"] for v in s["trace"]["votes"]}, {"sponsorship", "fit"})

    def test_closed_opt_window_is_a_gated_skip(self):
        roles, _ = br.build(FIXTURE_CSV, PERSONA, dt.date(2027, 3, 1))
        for s in run_scorer(roles):
            self.assertEqual(s["recommendation"], "Skip")
            self.assertTrue(s["reason"].startswith("gated: timeline"))


if __name__ == "__main__":
    result = unittest.main(exit=False, verbosity=2).result
    sys.exit(0 if result.wasSuccessful() else 1)
