# Worked run — swe-title-sponsor-opt

## Executive summary

This is a worked example of the tool on a sample list of 12 job openings for a fictional international student. It shows the commands and their real output, then separates what the public records actually support from the student's own definitions. A person can therefore see which parts of each decision are evidence and which are assumptions. In the run:
- 11 openings were scored and 1 was rejected for a missing start date;
- 9 came out as "consider" and 2 as "skip";
- nothing reached "apply", because applying requires a person's check of government labor-filing records, which has not been done.

All 40 tests passed. My own hand checks and break attempt matched the tool's output.

## Inputs

All inputs are in `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/`.

- **`sample/persona.json`** (fictional, your-input): name "Ishani Morrow", `ishani.morrow@example.com`, MS in Software Engineering (STEM-designated), F-1, post-completion OPT, `graduation_date` 2026-12-18, `ead_start_date` 2027-01-22, `unemployment_allowance_days` 90, `priority_order` SWE > AI > Cloud.
- **`sample/candidate-roles.json`** (your-input): real company names and fictional postings at `jobs.example.com`.

  | role_id | Company | Family | start_date |
  |---|---|---|---|
  | databricks-swe | Databricks, Inc. | SWE | 2027-02-08 |
  | stripe-swe | Stripe, Inc. | SWE | 2027-01-11 |
  | toast-swe | Toast, Inc. | SWE | 2027-03-29 |
  | google-swe | Google | SWE | 2027-02-22 |
  | mongodb-swe | MongoDB, Inc. | SWE | TBD |
  | aiera-ai | Aiera, Inc. | AI | 2027-02-01 |
  | anyscale-ai | Anyscale, Inc. | AI | 2027-03-01 |
  | huggingface-ai | Hugging Face, Inc. | AI | 2027-02-01 |
  | datadog-cloud | Datadog, Inc. | Cloud | 2027-02-15 |
  | everquote-cloud | EverQuote, Inc. | Cloud | 2027-03-08 |
  | salesforce-cloud | Salesforce.com, Inc. | Cloud | 2027-02-16 |
  | coherehealth-cloud | Cohere Health, Inc. | Cloud | 2027-05-03 |
- **Also used:**
  - `sample/overrides.json`: empty, so no G4 evidence;
  - `crosswalk.json` and `mappings.json`: closed definitions, your-input;
  - the 80 Days sponsorship CSV and the BLS compact table (records).

## Commands and real output

Run from the repo root, on a fresh clone of the branch at pre-re-cut commit `0a27e32` (2026-10-02). The branch was then re-cut for privacy (`0a27e32` → `55ca2f4`). The re-cut changed only wording (the school name, and four lines moved to third person: 10 lines in 5 files, shown in TEST-REPORT §Toolchain baseline), so the code and data are identical. `clean-run.txt` captured the output but not the typed commands; these are the documented commands for those output sections.

```bash
python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py
python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v
```

Prototype output (`clean-run.txt` lines 86–89):

```text
  ! role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
✓ 12 roles · scored 11 · not scored 1 · scorer {'Consider': 9, 'not scored': 1, 'Skip': 2} · final {'Consider': 9, 'not scored': 1, 'Skip': 2} · G4 accepted 0 refused 0 · next actions {'tailor an application': 5, 'network into the company': 4, 'blocked: fix the input and re-run': 1, 'blocked: pick the right company row, then re-run': 1, 'skip': 1}
  report course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.md
  log    course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.json
```

Test output (`clean-run.txt` lines 90–159):

```text
test_BROKEN_gate_zero_off_is_caught (test_title_sponsor_opt.BrokenScorers.test_BROKEN_gate_zero_off_is_caught) ...   ! role 'f4-missing': start_date None is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-invalid': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-text': start_date 'next spring' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
ok
test_BROKEN_sponsorship_weight_zero_is_caught (test_title_sponsor_opt.BrokenScorers.test_BROKEN_sponsorship_weight_zero_is_caught) ...   ! role 'f4-missing': start_date None is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-invalid': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-text': start_date 'next spring' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
ok
test_BROKEN_timeline_ignored_is_caught (test_title_sponsor_opt.BrokenScorers.test_BROKEN_timeline_ignored_is_caught) ...   ! role 'f4-missing': start_date None is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-invalid': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-text': start_date 'next spring' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
ok
test_mutants_are_not_stale (test_title_sponsor_opt.BrokenScorers.test_mutants_are_not_stale) ... ok
test_P1_limitation_ai_filed_as_software_engineer_is_invisible (test_title_sponsor_opt.CrosswalkPrinciples.test_P1_limitation_ai_filed_as_software_engineer_is_invisible)
Known limitation, kept on purpose: an AI role filed as 'Software Engineer' shows only as SWE. ... ok
test_ambiguous_titles_map_to_no_family (test_title_sponsor_opt.CrosswalkPrinciples.test_ambiguous_titles_map_to_no_family) ... ok
test_clear_titles_map_to_their_families (test_title_sponsor_opt.CrosswalkPrinciples.test_clear_titles_map_to_their_families) ... ok
test_excluded_titles_are_reported (test_title_sponsor_opt.CrosswalkPrinciples.test_excluded_titles_are_reported) ... ok
test_non_ic_and_non_family_roles_map_to_no_family (test_title_sponsor_opt.CrosswalkPrinciples.test_non_ic_and_non_family_roles_map_to_no_family) ... ok
test_band_edges (test_title_sponsor_opt.G2Boundaries.test_band_edges) ... ok
test_no_default_for_bad_dates (test_title_sponsor_opt.G2Boundaries.test_no_default_for_bad_dates) ... ok
test_persona_without_ead_start_stops_the_run (test_title_sponsor_opt.G2Boundaries.test_persona_without_ead_start_stops_the_run) ... ok
  ! role 'f4-missing': start_date None is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-invalid': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-text': start_date 'next spring' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! G4 refused override for role 'matched-not-in': missing field(s) ['soc_code']
  ! G4 refused override for role 'f2-no-trace': the posting says it does not sponsor — evidence of past filings cannot override that
  ! G4 refused override for role 'f3-after': its timeline gate is 0 (more-than-90-days-after) — an override cannot reopen a closed gate
  ! G4 refused override for role 'g1-ambiguous': its company match is ambiguous — resolve which company this is before attaching LCA evidence to it
  ! G4 refused override for role 'f1-not-found': its company match is not-found — resolve which company this is before attaching LCA evidence to it
  ! G4 refused override for role 'f5-unreadable': posting_says_no_sponsorship must be true or false, got 'false'
  ! G4 refused override for role 'no-such-role': no such role in the candidate-roles file
test_every_value_labelled_with_overrides (test_title_sponsor_opt.G4HumanGate.test_every_value_labelled_with_overrides) ... ok
test_refusals_unit (test_title_sponsor_opt.G4HumanGate.test_refusals_unit) ... ok
test_refuse_entity_ambiguous (test_title_sponsor_opt.G4HumanGate.test_refuse_entity_ambiguous) ... ok
test_refuse_entity_not_found (test_title_sponsor_opt.G4HumanGate.test_refuse_entity_not_found) ... ok
test_refuse_missing_field (test_title_sponsor_opt.G4HumanGate.test_refuse_missing_field) ... ok
test_refuse_posting_says_no_sponsorship (test_title_sponsor_opt.G4HumanGate.test_refuse_posting_says_no_sponsorship) ... ok
test_refuse_timeline_gate_zero (test_title_sponsor_opt.G4HumanGate.test_refuse_timeline_gate_zero) ... ok
test_refuse_wrong_type_and_unknown_role (test_title_sponsor_opt.G4HumanGate.test_refuse_wrong_type_and_unknown_role) ... ok
test_valid_override_becomes_apply_in_real_scorer_output (test_title_sponsor_opt.G4HumanGate.test_valid_override_becomes_apply_in_real_scorer_output) ... ok
test_vacuous_output_trips_guard (test_title_sponsor_opt.GuardUnit.test_vacuous_output_trips_guard) ... ok
test_zero_weight_trips_guard (test_title_sponsor_opt.GuardUnit.test_zero_weight_trips_guard) ... ok
  ! role 'f4-missing': start_date None is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-invalid': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'f4-text': start_date 'next spring' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
test_F1_not_found_is_unknown_never_does_not_sponsor (test_title_sponsor_opt.RealScorerRun.test_F1_not_found_is_unknown_never_does_not_sponsor) ... ok
test_F2_no_h1b_trace_is_unknown_not_zero (test_title_sponsor_opt.RealScorerRun.test_F2_no_h1b_trace_is_unknown_not_zero) ... ok
test_F3_outside_window_is_gated_skip_by_real_scorer (test_title_sponsor_opt.RealScorerRun.test_F3_outside_window_is_gated_skip_by_real_scorer) ... ok
test_F4_missing_or_invalid_date_is_a_named_error_with_no_default (test_title_sponsor_opt.RealScorerRun.test_F4_missing_or_invalid_date_is_a_named_error_with_no_default) ... ok
test_F5_unparseable_titles_claim_no_family (test_title_sponsor_opt.RealScorerRun.test_F5_unparseable_titles_claim_no_family) ... ok
test_F6_guard_passes_on_real_scorer_and_weight_is_positive (test_title_sponsor_opt.RealScorerRun.test_F6_guard_passes_on_real_scorer_and_weight_is_positive) ... ok
test_F6_scorer_is_never_called_with_profile (test_title_sponsor_opt.RealScorerRun.test_F6_scorer_is_never_called_with_profile) ... ok
test_G1_break_no_fuzzy_match_no_namesake_no_guessing_between_rows (test_title_sponsor_opt.RealScorerRun.test_G1_break_no_fuzzy_match_no_namesake_no_guessing_between_rows) ... ok
test_G3_break_input_cannot_claim_liveness_was_checked (test_title_sponsor_opt.RealScorerRun.test_G3_break_input_cannot_claim_liveness_was_checked) ... ok
test_G3_every_apply_or_tailor_is_shown_blocked (test_title_sponsor_opt.RealScorerRun.test_G3_every_apply_or_tailor_is_shown_blocked) ... ok
test_every_term_sent_to_the_scorer_is_labelled (test_title_sponsor_opt.RealScorerRun.test_every_term_sent_to_the_scorer_is_labelled) ... ok
test_every_value_in_the_log_is_labelled (test_title_sponsor_opt.RealScorerRun.test_every_value_in_the_log_is_labelled) ... ok
test_next_action_rule (test_title_sponsor_opt.RealScorerRun.test_next_action_rule) ... ok
test_report_opens_with_executive_summary (test_title_sponsor_opt.RealScorerRun.test_report_opens_with_executive_summary) ... ok
test_soft_bands_are_scored_at_half_not_gated (test_title_sponsor_opt.RealScorerRun.test_soft_bands_are_scored_at_half_not_gated) ... ok
test_sample_overrides_ship_empty (test_title_sponsor_opt.SampleRunOnRealCsv.test_sample_overrides_ship_empty)
No real DOL check has been done: any sample entry would be an invented record. ... ok
test_sample_run (test_title_sponsor_opt.SampleRunOnRealCsv.test_sample_run) ...   ! role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
ok

----------------------------------------------------------------------
Ran 40 tests in 1.212s

OK
```

Per-role decisions, from the committed run report `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.md` (lines 20–33). It's the same code and inputs, and its counts are identical to the output above. After the privacy re-cut, that log's recorded hash for `mappings.json` (`c5fd01db…`) no longer matches the file (`a474aa5b…`), because one rationale string was reworded; no value the scorer reads changed.

| Role | Family | Company evidence (G1) | Family in top titles | Start vs EAD | Timeline factor (G2) | Liveness (G3) | G4 human evidence | Votes sent | Composite | Scorer (machine → final) | Shown decision | Next action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Databricks, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | 17 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.450 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Stripe, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | -11 days (1-30-days-before) [your-input] | 0.5 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.225 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input]; negotiate the start date to on or after the EAD start [your-input] |
| Toast, Inc. — Software Engineer I | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | 66 days (61-90-days-after) [your-input] | 0.5 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.225 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Google — Software Engineer, Early Career | SWE [your-input] | not-found [record] | not-applicable [your-input] | 31 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.8 [your-input] | 0.240 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| MongoDB, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | TBD [your-input] | **error** | — | none | — | — | not scored | not scored (input error) [your-input] | blocked: fix the input and re-run [your-input] |
| Aiera, Inc. — AI Engineer | AI [your-input] | matched-h1b [record] | in-top-titles [your-input] | 10 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.7 [your-input] | 0.420 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Anyscale, Inc. — Machine Learning Engineer | AI [your-input] | matched-h1b [record] | not-in-top-titles [your-input] | 38 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Possible p=0.4 [your-input]; fit p=0.7 [your-input] | 0.350 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| Hugging Face, Inc. — Machine Learning Engineer | AI [your-input] | no-h1b-trace [record] | not-applicable [your-input] | 10 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.7 [your-input] | 0.210 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| Datadog, Inc. — Site Reliability Engineer I | Cloud [your-input] | matched-h1b [record] | not-in-top-titles [your-input] | 24 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Possible p=0.4 [your-input]; fit p=0.6 [your-input] | 0.320 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| EverQuote, Inc. — Cloud Engineer | Cloud [your-input] | matched-h1b [record] | in-top-titles [your-input] | 45 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.6 [your-input] | 0.390 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Salesforce.com, Inc. — Infrastructure Engineer, Early Career | Cloud [your-input] | ambiguous [record] | not-applicable [your-input] | 25 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.6 [your-input] | 0.180 [record] | Skip [record] | Skip [your-input] | blocked: pick the right company row, then re-run [your-input] |
| Cohere Health, Inc. — Platform Engineer | Cloud [your-input] | matched-h1b [record] | in-top-titles [your-input] | 101 days (more-than-90-days-after) [your-input] | 0 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.6 [your-input] | 0.000 [record] | Skip [record] | Skip [your-input] | skip [your-input] |

## Verified vs. inferred

Each cell carries the label in its column header. The family check rests on record titles, but which titles count for a family is decided by the crosswalk, which is your-input. A match is a title match only.

| Role | Entity match `[record]` | Title-family presence `[record — title match only]` | Tier and p `[your-input]` | Fit `[your-input]` | Timeline dates `[your-input]` | Timeline mapping → factor `[your-input]` | Liveness `[your-input]` | Composite and decision `[record: the scorer's arithmetic on these inputs]`; next action `[your-input rule]` |
|---|---|---|---|---|---|---|---|---|
| databricks-swe | matched-h1b | in-top-titles: Software Engineer, Senior Software Engineer | Likely, p=0.6 | 0.8 | start 2027-02-08, EAD 2027-01-22 (17 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.450 → Consider → tailor an application |
| stripe-swe | matched-h1b | in-top-titles: Software Engineer, Backend Engineer | Likely, p=0.6 | 0.8 | start 2027-01-11, EAD 2027-01-22 (-11 days) | 1-30-days-before → 0.5 | 1.0 assumed, not checked | 0.225 → Consider → tailor an application |
| toast-swe | matched-h1b | in-top-titles: Senior Software Engineer, Staff Software Engineer - Payments Extensibility, Tech Lead | Likely, p=0.6 | 0.8 | start 2027-03-29, EAD 2027-01-22 (66 days) | 61-90-days-after → 0.5 | 1.0 assumed, not checked | 0.225 → Consider → tailor an application |
| google-swe | not-found | — (no titles to read; sponsorship unknown) | Unknown, p=none (no vote) | 0.8 | start 2027-02-22, EAD 2027-01-22 (31 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.240 → Consider → network into the company |
| mongodb-swe | matched-h1b | in-top-titles: Senior Software Engineer, Software Engineer, Senior Software Engineer | Likely, p=0.6 | 0.8 | start TBD — invalid | — (role not scored; no default) | — | not scored → blocked: fix the input and re-run |
| aiera-ai | matched-h1b | in-top-titles: AI/DS Engineer | Likely, p=0.6 | 0.7 | start 2027-02-01, EAD 2027-01-22 (10 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.420 → Consider → tailor an application |
| anyscale-ai | matched-h1b | not in top titles (unknown) | Possible, p=0.4 | 0.7 | start 2027-03-01, EAD 2027-01-22 (38 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.350 → Consider → network into the company |
| huggingface-ai | no-h1b-trace | — (no titles to read; sponsorship unknown) | Unknown, p=none (no vote) | 0.7 | start 2027-02-01, EAD 2027-01-22 (10 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.210 → Consider → network into the company |
| datadog-cloud | matched-h1b | not in top titles (unknown) | Possible, p=0.4 | 0.6 | start 2027-02-15, EAD 2027-01-22 (24 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.320 → Consider → network into the company |
| everquote-cloud | matched-h1b | in-top-titles: Senior Cloud Engineer I | Likely, p=0.6 | 0.6 | start 2027-03-08, EAD 2027-01-22 (45 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.390 → Consider → tailor an application |
| salesforce-cloud | ambiguous (2 rows) | — (no titles to read; sponsorship unknown) | Unknown, p=none (no vote) | 0.6 | start 2027-02-16, EAD 2027-01-22 (25 days) | 0-60-days-after → 1 | 1.0 assumed, not checked | 0.180 → Skip → blocked: pick the right company row, then re-run |
| coherehealth-cloud | matched-h1b | in-top-titles: Senior Machine Learning DevOps Engineer | Likely, p=0.6 | 0.6 | start 2027-05-03, EAD 2027-01-22 (101 days) | more-than-90-days-after → 0 | 1.0 assumed, not checked | 0.000 → Skip → skip |

### What no record supports

- **SOC filing category.** The data has no visa job category, so no role is known to be filed under any SOC code.
- **Current intent to sponsor.** The records show past filings only, with no filing year; "Likely" means past practice, not a present plan.
- **Liveness.** No posting was checked. The 1.0 factor is an assumption that lets the scorer run.
- **Approval counts as magnitudes.** Every approval and denial count is even, which suggests double counting, so counts are never used as sizes.

## Verification

**Hand check.** I read three raw CSV rows directly (`hand-check.txt`, pasted in full):

```text
--- ANYSCALE INC
  city: 'San Francisco'
  state: 'CA'
  Total Approvals: '92.0'
  Total Denials: '4.0'
  top_job_titles_sponsored: "['Software Engineer', 'Solutions Architect']"
--- DATABRICKS INC
  city: 'SAN FRANCISCO'
  state: 'CA'
  Total Approvals: '1640.0'
  Total Denials: '8.0'
  top_job_titles_sponsored: "['Software Engineer', 'Senior Software Engineer', 'Solutions Architect', 'Specialist Solutions Architect', 'Senior Solutions Engineer']"
--- HUGGING FACE INC
  city: 'BROOKLYN'
  state: 'NY'
  Total Approvals: ''
  Total Denials: ''
  top_job_titles_sponsored: ''
```

My conclusions:
- "Databricks: the raw top_job_titles_sponsored does contain SWE titles. Matches the report."
- "Anyscale: the raw list contains no AI/ML titles. Matches the report. This verifies the record, not whether Anyscale sponsors AI roles, which stays unknown."
- "Hugging Face: approval and denial fields are empty. Matches no-h1b-trace."

**Test suite.** `Ran 40 tests in 1.212s` / `OK` (`clean-run.txt` lines 157–159).

**Break attempt.** I set Databricks' `start_date` to `2027-02-30`, an impossible date, and wrote my prediction down before running. The tool rejected the role with `role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored`. Every count matched the prediction: 12 roles · scored 10 · not scored 2 · Consider 8 · Skip 2 · next actions blocked 2 / tailor 4 / network 4 / pick-row 1 / skip 1. The full Saw-vs-Expected table, and the limits of count-only evidence, are in `TEST-REPORT.md` §Break attempt.

## Reflection

**What worked.**
- **Unknowns are reported as unknown, never as "no".** A not-found, no-trace or ambiguous company gets no sponsorship vote and a "network" step, not a skip.
- **The gates are hard stops.**
  - A bad date leaves the role unscored, with no default.
  - A closed timeline gate zeroes the role.
  - A G4 entry that is incomplete or targets a closed gate is refused.
- **The real scorer is used, never a copy.** It runs through `npm run score`, and the mutant tests inject defects into the real scorer's source.

**What it got wrong or missed.**
- **P1 — partly confirmed, partly contradicted.** AI roles do show false-looking unknowns (Anyscale), but Cloud titles are rarer still in top-title lists.
- **P2 — the outcome partly right, the mechanism wrong.** Google is absent for coverage reasons (startup funding filings), not naming; the naming problem showed up as Salesforce's ambiguity instead.
- **P3 — confirmed.** The skip rate stayed below half, mostly because of the soft-tier mapping.
- **P4 — confirmed for this list, not across the dataset.** Every SWE company with a trace listed an SWE title, but only about a third of all sponsoring companies do.
- **The skip rate is 2/11**, against a healthy target of at least half.
- **Unknown roles reach Consider on fit alone.** Google scored 0.240 and Hugging Face 0.210, both in the 0.20–0.30 Consider band with no sponsorship vote.
- **Nothing reaches Apply without G4.** The best composite without a G4 entry is 0.450 (Databricks), which the scorer holds at Consider because "Likely" is a soft tier.

**Corrections made during the session.** All three landed in one commit, `5db51f6` (pre-re-cut `7fec110`; "review revisions (G4 gate, timeline bands, DEFINEs closed)"):
- **Timeline 0.6 → 0.5.** The scorer flags a timeline as weak only below 0.6, so a 0.6 band was treated as healthy (`mappings.json`).
- **The soft early-start band.** A start 1–30 days before the EAD start now scores 0.5 instead of 0 (`mappings.json`).
- **Crosswalk tightening.** Checked against all 1,988 distinct sponsored titles: precise patterns plus exclusions (`crosswalk.json`). AI coverage fell from 193 to 86 companies, mostly data-scientist titles.

**One concrete next improvement.** An LCA-by-SOC lookup from the DOL OFLC LCA disclosure data, which would turn the title proxy into a filing-category record. [TODO: DATA SOURCE]

## Attestation
- Recipe: tushar-patel28-swe-title-sponsor-opt v0.3.0
- By: Tushar Patel · 2026-10-02

### Tested
| Ran | Saw | Expected |
|---|---|---|
| `python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py` on a fresh clone at pre-re-cut `0a27e32` (now `55ca2f4`) | `✓ 12 roles · scored 11 · not scored 1 · scorer {'Consider': 9, 'not scored': 1, 'Skip': 2} · final {'Consider': 9, 'not scored': 1, 'Skip': 2} · G4 accepted 0 refused 0 · next actions {'tailor an application': 5, 'network into the company': 4, 'blocked: fix the input and re-run': 1, 'blocked: pick the right company row, then re-run': 1, 'skip': 1}` | the same counts as the committed sample run at `5db51f6`, with the MongoDB "TBD" error and no Apply |
| `python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v` | `Ran 40 tests in 1.212s` / `OK` | 40 tests pass, each end-to-end test calling the real scorer |
| `node scripts/conformance.mjs scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/` | `conformance: 17 files (2 md · 9 json · 4 js · 2 py)` / `✓ all conform` | every file in the folder conforms |
| Hand check: raw CSV row `DATABRICKS INC` | `top_job_titles_sponsored: "['Software Engineer', 'Senior Software Engineer', 'Solutions Architect', 'Specialist Solutions Architect', 'Senior Solutions Engineer']"` | SWE titles present, matching the report's `in-top-titles` |
| Hand check: raw CSV row `ANYSCALE INC` | `top_job_titles_sponsored: "['Software Engineer', 'Solutions Architect']"` | no AI/ML title, matching the report's `not-in-top-titles` (verifies the record only) |
| Hand check: raw CSV row `HUGGING FACE INC` | `Total Approvals: ''` · `Total Denials: ''` · `top_job_titles_sponsored: ''` | empty sponsorship fields, matching `no-h1b-trace` |
| **Break attempt:** Databricks `start_date` set to `2027-02-30` in the clean clone | `role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored` · `✓ 12 roles · scored 10 · not scored 2 · scorer {'not scored': 2, 'Consider': 8, 'Skip': 2} …` | a clear error naming Databricks, no default date, role unscored; 12 · 10 · 2; Consider 8, Skip 2, not scored 2; next actions blocked 2 / tailor 4 / network 4 / pick-row 1 / skip 1 (all matched) |

### Did not test
- Live postings (G3). `npm run ats:liveness` was not run, and the sample postings are fictional.
- Any real DOL LCA check (G4). The overrides file is empty.
- Role-by-role equality in the break run. Only counts were compared.
- Whether the matched CSV rows are current.
- Non-sample data: any role list other than the sample, or any data other than the shipped CSV and BLS table.
- The company alias table. It isn't built yet.
- Salesforce row selection. Both rows were confirmed as Salesforce in the G1 review, but the tool can't yet accept a chosen row.

### Broke during testing, fixed
- **The F3 fixture stopped testing F3.** Once the soft early-start band was added, the "before the EAD start" fixture at day −1 scored 0.5, so it no longer tested a closed gate. Commit `5db51f6` (pre-re-cut `7fec110`) moved `f3-before` in `fixtures/roles-cases.json` from 2027-01-21 (day −1) to 2026-12-22 (day −31), and added day −30 and day 61 cases.
- **G4: the override reason printed Python's `False` instead of `false`.** Claude saw this in a scratch run during the 2026-10-01 build session, and it was fixed before commit `5db51f6` (pre-re-cut `7fec110`). The committed test now asserts `posting_says_no_sponsorship=false` in the override reason. No other G4 failure appears in the commit history or the reports.
- **An email address was copied into the test report.** The first draft of `TEST-REPORT.md` quoted the pre-existing PII-scan finding verbatim. That copied a real email address into the report and the run log, and the scan reported 3 findings instead of 1. The address was replaced with a redaction marker before commit `a623e7d` (pre-re-cut `0681cf0`), and a search of the full history finds no commit under `course/` or `logs/` that contains it.
