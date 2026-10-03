# Test report — swe-title-sponsor-opt (tushar-patel28, 2026fa)

## Executive summary

This report records how I tested a small offline tool that checks, for each job opening on a student's list, whether the employer's public visa-sponsorship history lists a job title in the student's field and whether the start date fits the student's work-permit window. The tool, its 40 automated tests and the project's health checks were run on a fresh copy of my branch on 2 October 2026, and the health checks were compared with the same checks taken on a fresh copy of the main project before any work began. Every automated check passed, and a deliberate break (an impossible start date) was caught exactly as predicted in every count. What remains open is either a pre-existing project issue or one of two human checks nobody has done yet: whether the postings are still open, and the government labor-filing records.

## Toolchain baseline

### Before — fresh clone of main at `015843d`, 2026-10-01

From `baseline-before.txt` (lines 34–114). The file's own header says it was "copied here verbatim, not re-run".

```text
(base) tushar@Tushars-MacBook-Pro the-reallocation-engine % npm run doctor

> the-reallocation-engine@1.0.0 doctor
> node scripts/doctor.mjs

RECIPE DOCTOR — The Reallocation Engine
==========================================

ENVIRONMENT (required)
  ✓ node       v24.18.0
  ✓ python3    Python 3.12.10

ENVIRONMENT (optional — features degrade without these)
  ✓ pandoc     pandoc 3.8
  — libreoffice not found (PDF fallback)
  ✓ playwright installed

RUNNABLE COMMANDS (npm script → target file present?)
  ✓ verify         scripts/conformance.mjs
  ✓ manifest-check scripts/manifest-check.mjs
  ✓ eval:score     scripts/eval/score-run.mjs
  ✓ eval:report    scripts/eval/report.mjs
  ✓ doctor         scripts/doctor.mjs
  ✓ bls:local-wage scripts/bls/local-wage-adjustment.py
  ✓ build-instructions scripts/build-instructions.mjs
  ✓ to-markdown    scripts/to-markdown.mjs
  ✓ score          scripts/score/role-scorer.mjs
  ✓ score:gates    scripts/score/gate-harness.mjs
  ✓ ats:dedup      scripts/ats/dedup-tracker.mjs
  ✓ ats:liveness   scripts/ats/check-liveness.mjs
  ✓ ats:merge      scripts/ats/merge-tracker.mjs
  ✓ ats:normalize  scripts/ats/normalize-statuses.mjs
  ✓ ats:scan       scripts/ats/scan.mjs
  ✓ ats:verify     scripts/ats/verify-pipeline.mjs
  ✓ resumes:pdf    scripts/resumes/generate-pdf.mjs
  ✓ svg-to-png     scripts/svg-to-png.mjs
  ✓ audit:layout   scripts/svg-layout-audit.mjs
  ✓ postsvg-to-png scripts/svg-layout-audit.mjs
  ✓ skill-demand   scripts/score/skill-demand-monitor.mjs
  ✓ skill-demand:test scripts/score/skill-demand-monitor.test.mjs
  ✓ fetch-postings scripts/ats/fetch-real-postings.py
  ✓ pii-scan       scripts/pii-scan.mjs

DOMAIN DIRECTORIES
  ✓ data/sec
  ✓ data/bls
  ✓ data/ats
  ✓ data/80-days-to-stay
  ✓ scripts/sec
  ✓ scripts/bls
  ✓ scripts/ats
  ✓ scripts/resumes

PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

RECIPES (33)
  with lifecycle frontmatter: 33   missing: 0
  by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED 1
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies

SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
(base) tushar@Tushars-MacBook-Pro the-reallocation-engine % npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
```

### After — fresh clone of `contrib/2026fa-tushar-patel28-swe-title-sponsor-opt` at pre-re-cut commit `0a27e32` (now `55ca2f4`), 2026-10-02

**Re-cut note (2026-10-02).** This run was performed at pre-re-cut commit `0a27e32`. Afterwards the branch history was re-cut for privacy. The re-cut changed only wording: the school name was replaced in four files, and three lines of the change brief and one line of the card were moved to third person. The full diff is 10 changed lines in 5 files: `CHANGE-BRIEF.md`, the recipe, the card, `mappings.json` (one rationale string) and the committed 2026-10-01 run log (the same string, copied from `mappings.json`). The code and data are identical, so the results below hold for the re-cut history. The commit listing and diff-stat blocks are verbatim and show the pre-re-cut IDs; the diff-stat's line counts are unchanged because every reworded line was replaced one for one. Old → new commit IDs:

| Commit | Pre-re-cut | Re-cut |
|---|---|---|
| change brief (predictions before build) | `590ebea` | `5a49af7` |
| first build (DRAFT, 23 tests pass, before review) | `7d89ffe` | `cce6c00` |
| review revisions (G4 gate, timeline bands, DEFINEs closed) | `7fec110` | `5db51f6` |
| G1 entity review signed off by human | `0a27e32` | `55ca2f4` |
| test report and run log | `0681cf0` | `a623e7d` |

One side effect: the committed 2026-10-01 run log records the SHA-256 of `mappings.json` as it was at run time (`c5fd01db…`). The re-cut changed one rationale string in that file, so it now hashes to `a474aa5b…`. No value the scorer reads changed. The six other recorded input hashes still match.

From `clean-run.txt`. The commit listing is lines 1–6; doctor and verify are lines 8–85.

```text
=== Fri Oct  2 12:03:10 EDT 2026 ===
0a27e32 2026fa tushar-patel28: G1 entity review signed off by human
7fec110 2026fa tushar-patel28: review revisions (G4 gate, timeline bands, DEFINEs closed)
7d89ffe 2026fa tushar-patel28: first build (DRAFT, 23 tests pass, before review)
590ebea 2026fa tushar-patel28: change brief (predictions before build)
015843d fix(greenhouse-watch): justification lines now sum to the score

> the-reallocation-engine@1.0.0 doctor
> node scripts/doctor.mjs

RECIPE DOCTOR — The Reallocation Engine
==========================================

ENVIRONMENT (required)
  ✓ node       v24.18.0
  ✓ python3    Python 3.12.10

ENVIRONMENT (optional — features degrade without these)
  ✓ pandoc     pandoc 3.8
  — libreoffice not found (PDF fallback)
  ✓ playwright installed

RUNNABLE COMMANDS (npm script → target file present?)
  ✓ verify         scripts/conformance.mjs
  ✓ manifest-check scripts/manifest-check.mjs
  ✓ eval:score     scripts/eval/score-run.mjs
  ✓ eval:report    scripts/eval/report.mjs
  ✓ doctor         scripts/doctor.mjs
  ✓ bls:local-wage scripts/bls/local-wage-adjustment.py
  ✓ build-instructions scripts/build-instructions.mjs
  ✓ to-markdown    scripts/to-markdown.mjs
  ✓ score          scripts/score/role-scorer.mjs
  ✓ score:gates    scripts/score/gate-harness.mjs
  ✓ ats:dedup      scripts/ats/dedup-tracker.mjs
  ✓ ats:liveness   scripts/ats/check-liveness.mjs
  ✓ ats:merge      scripts/ats/merge-tracker.mjs
  ✓ ats:normalize  scripts/ats/normalize-statuses.mjs
  ✓ ats:scan       scripts/ats/scan.mjs
  ✓ ats:verify     scripts/ats/verify-pipeline.mjs
  ✓ resumes:pdf    scripts/resumes/generate-pdf.mjs
  ✓ svg-to-png     scripts/svg-to-png.mjs
  ✓ audit:layout   scripts/svg-layout-audit.mjs
  ✓ postsvg-to-png scripts/svg-layout-audit.mjs
  ✓ skill-demand   scripts/score/skill-demand-monitor.mjs
  ✓ skill-demand:test scripts/score/skill-demand-monitor.test.mjs
  ✓ fetch-postings scripts/ats/fetch-real-postings.py
  ✓ pii-scan       scripts/pii-scan.mjs

DOMAIN DIRECTORIES
  ✓ data/sec
  ✓ data/bls
  ✓ data/ats
  ✓ data/80-days-to-stay
  ✓ scripts/sec
  ✓ scripts/bls
  ✓ scripts/ats
  ✓ scripts/resumes

PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

RECIPES (33)
  with lifecycle frontmatter: 33   missing: 0
  by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED 1
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies

SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 177 files (89 md · 38 py · 34 js · 12 json · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
```

### Differences

| Item | Before | After | Reading |
|---|---|---|---|
| Conformance file count | `158 files (85 md · 36 py · 30 js · 4 sh · 3 json)` | `177 files (89 md · 38 py · 34 js · 12 json · 4 sh)` | +19 files, all mine: the recipe and card (+2 md), and from the prototype folder the two READMEs (+2 md), 2 py, 4 mjs and 9 json. `course/` is not among conformance's default paths, so the submission files are not in either count. |
| Manifest warnings | W1 `archive/`, W2 `private/`, W2 `data/ats/` | identical | Unchanged. None comes from my work (see *Known pre-existing findings*). |
| Doctor recipe count | `RECIPES (33)`, `318 declared … 318 [TODO markers` | identical | Doctor reads only top-level `recipes/*.md` (it lists `recipes/` and filters by file name). It does not scan `recipes/cases/`, so it never sees my recipe or checks its `todos_open: 2`. |
| Everything else in doctor | — | identical | Same environment, commands, directories and privacy result. |

## Clean-checkout run

### Commands

`clean-run.txt` records the **outputs** of the run, not the command lines as typed. The commands below are the documented command for each output section, in the order the outputs appear. The npm banners (`> node scripts/doctor.mjs`, `> node scripts/conformance.mjs && node scripts/manifest-check.mjs`) confirm the first two.

```bash
# commit listing                                   → clean-run.txt lines 1–6
npm run doctor                                     # lines 8–70
npm run verify                                     # lines 72–85
python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py   # lines 86–89
python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v   # lines 90–159
node scripts/conformance.mjs scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/  # lines 160–161
node scripts/pii-scan.mjs                          # lines 162–167
git diff --stat origin/main...HEAD                 # lines 168–195
```

### Prototype output (lines 86–89)

```text
  ! role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
✓ 12 roles · scored 11 · not scored 1 · scorer {'Consider': 9, 'not scored': 1, 'Skip': 2} · final {'Consider': 9, 'not scored': 1, 'Skip': 2} · G4 accepted 0 refused 0 · next actions {'tailor an application': 5, 'network into the company': 4, 'blocked: fix the input and re-run': 1, 'blocked: pick the right company row, then re-run': 1, 'skip': 1}
  report course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.md
  log    course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.json
```

### Test summary (lines 155–159)

```text

----------------------------------------------------------------------
Ran 40 tests in 1.212s

OK
```

### Conformance on the prototype folder and PII scan (lines 160–167)

```text
conformance: 17 files (2 md · 9 json · 4 js · 2 py)
✓ all conform (machine half of P4). Adequacy is still the human gate.
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions

  [email] package-lock.json — <npm maintainer's email address — redacted>

If a finding is a false positive (fictional data outside the sanctioned dirs),
move it under search/examples/ or resumes/ rather than allowlisting it here.
```

**One redaction in this block.** The email address on `clean-run.txt` line 164 is replaced by a marker; everything else is verbatim. Writing any real email address into a tracked file is itself a finding under the project's personal-data rules. A first draft of this report quoted it, and the PII scan flagged this file and the run log for it.

## Failure cases exercised

### In the test suite

Every test below printed `ok` in `clean-run.txt`. For the three `BROKEN-*` tests, `ok` lands on the line after the warnings those tests print to stderr.

| Case | What it checks | Test name in `clean-run.txt` | Line(s) | Result |
|---|---|---|---|---|
| F1 company not in data | `not-found` → tier Unknown, no sponsorship vote; never "does not sponsor" | `test_F1_not_found_is_unknown_never_does_not_sponsor` | 136 | ok |
| F2 no H-1B trace | `no-h1b-trace` → Unknown, `p` null, not zero | `test_F2_no_h1b_trace_is_unknown_not_zero` | 137 | ok |
| F3 outside the window | day −31 and day 91 → factor 0 → real scorer gated Skip | `test_F3_outside_window_is_gated_skip_by_real_scorer` | 138 | ok |
| F4 missing or invalid date | missing, `2027-02-30`, `next spring` → named error, no default, not sent to scorer | `test_F4_missing_or_invalid_date_is_a_named_error_with_no_default` | 139 | ok |
| F4 (unit) | `None`, `""`, `TBD`, `2027-13-01`, `2027/02/08`, `20270208`, an integer → error | `test_no_default_for_bad_dates` | 110 | ok |
| F5 unparseable titles | truncated list → `titles-unreadable`, no family claim | `test_F5_unparseable_titles_claim_no_family` | 140 | ok |
| F6 "authorized" bug guard | every sponsorship term in real scorer output has weight > 0 | `test_F6_guard_passes_on_real_scorer_and_weight_is_positive` | 141 | ok |
| F6 no `--profile` | scorer command starts `npm run score -- ` and never contains `--profile` | `test_F6_scorer_is_never_called_with_profile` | 142 | ok |
| F6 mutant | real scorer with sponsorship forced off is rejected by the guard | `test_BROKEN_sponsorship_weight_zero_is_caught` | 94–97 | ok |
| F6 guard (unit) | zero weight, and an output with no sponsorship term, both trip the guard | `test_zero_weight_trips_guard`, `test_vacuous_output_trips_guard` | 132, 131 | ok |
| G1 break | "Databricks Labs" and "Cohere" → `not-found` (no fuzzy, no namesake); Salesforce → `ambiguous`, no vote | `test_G1_break_no_fuzzy_match_no_namesake_no_guessing_between_rows` | 143 | ok |
| Family check (crosswalk) | ambiguous titles → no family; managers/QA/presales → no family; clear titles map; the P1 limitation is kept; exclusions reported | `test_ambiguous_titles_map_to_no_family`, `test_non_ic_and_non_family_roles_map_to_no_family`, `test_clear_titles_map_to_their_families`, `test_P1_limitation_ai_filed_as_software_engineer_is_invisible`, `test_excluded_titles_are_reported` | 105, 108, 106, 103–104, 107 | ok |
| G2 break: band edges | −400, −31, −30, −1, 0, 60, 61, 90, 91, 400 → 0, 0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, 0, 0 | `test_band_edges` | 109 | ok |
| G2 soft bands | day −30 and day 61 scored at 0.5 (below the scorer's 0.6), not gated; early-start note | `test_soft_bands_are_scored_at_half_not_gated` | 150 | ok |
| G2 stop | persona without a valid EAD start stops the whole run | `test_persona_without_ead_start_stops_the_run` | 111 | ok |
| G2 mutants | scorer ignoring the timeline, or not marking a closed gate "gated", is rejected | `test_BROKEN_timeline_ignored_is_caught`, `test_BROKEN_gate_zero_off_is_caught` | 98–101, 90–93 | ok |
| Mutants not stale | each mutant's anchor text still exists in the real scorer | `test_mutants_are_not_stale` | 102 | ok |
| G3 break | a role file claiming `liveness_checked: true` is ignored; liveness stays assumed | `test_G3_break_input_cannot_claim_liveness_was_checked` | 144 | ok |
| G3 display | every Apply not from G4, and every "tailor", is shown blocked at G3 | `test_G3_every_apply_or_tailor_is_shown_blocked` | 145 | ok |
| G4 refusals | missing field; `posting_says_no_sponsorship: true`; timeline 0; ambiguous; not-found; wrong type and unknown role | `test_refuse_missing_field`, `test_refuse_posting_says_no_sponsorship`, `test_refuse_timeline_gate_zero`, `test_refuse_entity_ambiguous`, `test_refuse_entity_not_found`, `test_refuse_wrong_type_and_unknown_role` | 126, 127, 128, 124, 125, 129 | ok |
| G4 refusals (unit) | each of the 8 fields missing; future date; duplicate; unscored role; malformed SOC | `test_refusals_unit` | 123 | ok |
| G4 valid entry | a fictional fixture entry turns the real scorer's Consider into Apply, with every evidence field in the reason | `test_valid_override_becomes_apply_in_real_scorer_output` | 130 | ok |
| G4 sample | the shipped overrides file is empty | `test_sample_overrides_ship_empty` | 151–152 | ok |
| Next-action rule | Likely→tailor, Possible→network, Unknown→network (even on a scorer Skip), gated→skip, both "blocked" outcomes | `test_next_action_rule` | 148 | ok |
| Labels | every value in the log, and every term sent to the scorer, is labelled | `test_every_value_in_the_log_is_labelled`, `test_every_term_sent_to_the_scorer_is_labelled`, `test_every_value_labelled_with_overrides` | 147, 146, 122 | ok |

The suite total is `Ran 40 tests in 1.212s` / `OK` (lines 157–159).

### In the sample run

The prototype output in `clean-run.txt` names only the MongoDB error (line 86); its counts line (line 87) shows the other outcomes in aggregate. The per-role rows below come from the committed run report `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.md` (same code and inputs; line numbers in that file), and the company matches from the signed `g1-entity-review.md`.

| Sample role | Case | Evidence | Outcome |
|---|---|---|---|
| MongoDB, start date "TBD" | F4 | `clean-run.txt` line 86: `role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored`; report line 26 | not scored; "blocked: fix the input and re-run" |
| Google | F1 | report line 25: `not-found [record]` · `sponsorship Unknown p=none (no vote)` · `0.240` · `network into the company`; G1 review: "No" | Unknown, no vote, network |
| Salesforce.com, Inc. | G1 ambiguous | report line 32: `ambiguous [record]` · `sponsorship Unknown p=none (no vote)` · `blocked: pick the right company row, then re-run`; G1 review rows 23115 and 23116 | no vote, blocked |
| Cohere Health, 101 days after EAD start | F3 | report line 33: `101 days (more-than-90-days-after)` · factor `0`; line 49: `Skip: gated: timeline ≈ 0.000` | gated Skip, "skip" |

## Break attempt

### What I changed

In the clean clone's `sample/candidate-roles.json`, I set the Databricks role's `start_date` to `2027-02-30`, a date that doesn't exist. Nothing else changed.

### What I expected (written before running)

> "The prototype should reject the impossible date with a clear error naming the Databricks role, assign no default date, and leave that role unscored. Nothing else in the run should change. Starting from the previous run's counts, exactly one role (Databricks) moves from Consider/tailor to not-scored/blocked. So I expected: 12 roles · scored 10 · not scored 2 · scorer {Consider 8, Skip 2, not scored 2} · next actions {blocked: fix the input 2, tailor 4, network 4, blocked: pick the right row 1, skip 1}. If any other role changed, or Databricks received a timeline factor, the date validation would be broken."

### What happened

The complete contents of `break-attempt.txt`:

```text
  ! role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
  ! role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored
✓ 12 roles · scored 10 · not scored 2 · scorer {'not scored': 2, 'Consider': 8, 'Skip': 2} · final {'not scored': 2, 'Consider': 8, 'Skip': 2} · G4 accepted 0 refused 0 · next actions {'blocked: fix the input and re-run': 2, 'tailor an application': 4, 'network into the company': 4, 'blocked: pick the right company row, then re-run': 1, 'skip': 1}
  report course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.md
  log    course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-02.json
```

### Comparison

| Item | Expected | Saw | Match |
|---|---|---|---|
| roles | 12 | 12 | yes |
| scored | 10 | 10 | yes |
| not scored | 2 | 2 | yes |
| scorer: Consider | 8 | 8 | yes |
| scorer: Skip | 2 | 2 | yes |
| scorer: not scored | 2 | 2 | yes |
| next action: blocked: fix the input and re-run | 2 | 2 | yes |
| next action: tailor an application | 4 | 4 | yes |
| next action: network into the company | 4 | 4 | yes |
| next action: blocked: pick the right company row, then re-run | 1 | 1 | yes |
| next action: skip | 1 | 1 | yes |
| error message | a clear error naming the Databricks role; no default date; role unscored | `role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored` | yes |

**Every row matched.**

Two lines of output were not in the prediction:
- `final {…}` equals the scorer counts;
- `G4 accepted 0 refused 0`.

Both are what an empty overrides file produces.

**Limits of this evidence:**
- **"Nothing else changed" is confirmed only in aggregate.** `break-attempt.txt` holds counts, not per-role rows. The counts fit exactly one role moving from Consider/tailor to not scored/blocked, but a swap between two other roles that cancels out can't be ruled out from counts alone. The per-role log written by that run (`…-2026-10-02.json` in the clean clone) was not captured.
- **"No timeline factor" rests on the message.** It says the role "is not scored", and in `title_sponsor_opt.py` `g2_timeline()` raises before any band or factor is computed.
- **The break run overwrote the clean run's files.** It reused the clean run's report and log paths (lines 4–5), so the clean clone's `2026-10-02` files now reflect the break run. Neither run's files are in this repository.

## Diff scope

`git diff --stat origin/main...HEAD` on the clean clone at pre-re-cut `0a27e32` (`clean-run.txt` lines 168–195). The re-cut leaves these counts unchanged; see the re-cut note above:

```text
 .../submissions/tushar-patel28/CHANGE-BRIEF.md     |   97 +
 .../submissions/tushar-patel28/g1-entity-review.md |   61 +
 .../tushar-patel28/runs/role-scores.json           |  475 +++
 .../submissions/tushar-patel28/runs/role-scores.md |   21 +
 .../submissions/tushar-patel28/runs/roles.json     |  489 +++
 .../runs/swe-title-sponsor-opt-2026-10-01.json     | 3285 ++++++++++++++++++++
 .../runs/swe-title-sponsor-opt-2026-10-01.md       |  135 +
 .../tushar-patel28-swe-title-sponsor-opt.card.md   |  140 +
 .../2026fa/tushar-patel28-swe-title-sponsor-opt.md |  370 +++
 .../tushar-patel28-swe-title-sponsor-opt/README.md |   88 +
 .../crosswalk.json                                 |   83 +
 .../fixtures/BROKEN-gate-zero-off.mjs              |   10 +
 .../fixtures/BROKEN-sponsorship-weight-zero.mjs    |   11 +
 .../fixtures/BROKEN-timeline-ignored.mjs           |   10 +
 .../fixtures/README.md                             |   30 +
 .../fixtures/mutant-runner.mjs                     |   30 +
 .../fixtures/overrides-cases.json                  |   53 +
 .../fixtures/overrides-empty.json                  |    5 +
 .../fixtures/persona.fixture.json                  |   13 +
 .../fixtures/roles-cases.json                      |   24 +
 .../fixtures/sponsorship-fixture.csv               |   10 +
 .../mappings.json                                  |   74 +
 .../sample/candidate-roles.json                    |   18 +
 .../sample/overrides.json                          |   16 +
 .../sample/persona.json                            |   13 +
 .../tests/test_title_sponsor_opt.py                |  440 +++
 .../title_sponsor_opt.py                           |  964 ++++++
 27 files changed, 6965 insertions(+)
```

What it shows:
- **27 files, 6,965 insertions, no deletions.** No existing file was modified, so no maintained file was patched.
- **Only namespaced paths.** Git shortens the leading directories to `...`, but every entry ends in a file under one of my namespaces: `course/2026fa/submissions/tushar-patel28/` (brief, G1 review, runs), `recipes/cases/2026fa/` (recipe and card), or `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/` (everything else).
- **No protected path.** `logs/RUN_LOG.md`, `package.json`, `SNICKERDOODLE.md`, `.github/` and the other protected paths are absent.
- **The run-log entry isn't in this diff.** `logs/runs/2026fa-tushar-patel28-1.md` was written after this run.
- **Full-path check not run.** The shortened form can't prove the prefixes on its own; `git diff --name-only origin/main...HEAD` would show them in full, and it was not run for this report.

## Known pre-existing findings (not mine)

| Finding | Evidence | Why it isn't mine |
|---|---|---|
| **PII scan flags an email address in `package-lock.json`** | `clean-run.txt` line 164: `[email] package-lock.json — <npm maintainer's email address — redacted>`. The same address appears in npm's own install output on main before any work: `baseline-before.txt` line 8, the `glob@10.5.0` deprecation notice, which gives the same address as its contact (not repeated here; see the redaction note above). | It belongs to npm's maintainer, inside a lockfile npm generated. `package-lock.json` is not in my diff (lines 168–195). |
| **Manifest check W2: "private path not gitignored" for `private/` and `data/ats/`** | Printed before and after (`baseline-before.txt` 111–112; `clean-run.txt` 82–83). `scripts/manifest-check.mjs` decides coverage by string-matching `.gitignore` lines (`giHas`, lines 74–80, used by the W2 check at 88–100), so `/private/*` and `/data/ats/*` (`.gitignore` lines 37 and 40) don't count as covering `private/` and `data/ats/`. Git itself ignores them: on 2026-10-01, `git check-ignore -v --no-index` reported `.gitignore:37:/private/*` for `private/x.json` and `.gitignore:40:/data/ats/*` for `data/ats/x.json`. Doctor's privacy check passes both times (`✓ no private/PII paths are tracked`, baseline line 88, clean line 60). | It's a false positive in a maintained script, present on main. |
| **Doctor prints a template comment in its status line** | `baseline-before.txt` line 92 and `clean-run.txt` line 64: `by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT \| SPECIFIED \| RUNNABLE-SAMPLE \| RUNNABLE-LIVE \| VERIFIED 1`. One top-level recipe's `status:` line still carries the inline comment from the frontmatter template (`SNICKERDOODLE.md` line 65), and doctor reads the comment as part of the status value. | Present on main. Doctor doesn't scan my recipe; but my recipe's status line also carries an inline comment, so the same display defect would appear if it were promoted to `recipes/`. |
| **Scorer `--profile` "authorized" bug** | `scripts/score/role-scorer.mjs` `applyProfile` (lines 56–63) treats any `authorization` text matching `/…\|authorized/` as not needing sponsorship and sets the sponsorship weight to 0. Reproduced 2026-10-01 with `--profile` `{"authorization":"F-1 STEM OPT — work authorized (EAD)"}`: `profile_needs_sponsorship: false`; the Ch.11 biotech role went from 0.446 Apply to 0.1785 Skip (documented in the prototype README). The mutant reproducing that effect is caught (`clean-run.txt` 94–97). | Scorer code on main. My tool never passes `--profile` (test at line 142) and checks the weight on every run (line 141). The scorer is not patched. |
| **Scorer has no exports, contrary to `CONTRIBUTING.md`** | `CONTRIBUTING.md` lines 46–49 say harnesses import `CONFIG`, `SRC`, `applyProfile`, `scoreRole`. `role-scorer.mjs` contains no `export` statement and calls `main()` at line 185 on load (checked 2026-10-01). | Scorer code on main. My tool and tests use the CLI instead (`npm run score -- …`, asserted at line 142). |

## What the gates require a human to judge

| Gate | Status | Evidence |
|---|---|---|
| G1: is each matched row the right company? | **Done by me.** | `g1-entity-review.md`, signed off in commit `55ca2f4` (pre-re-cut `0a27e32`): 12 rows "Yes", Google "No". Both Salesforce rows are marked "Yes", which fits one company duplicated in the data, but the side-by-side "This is the company" row is blank. The tool still reports Salesforce as `ambiguous`; it has no way to accept a chosen row until the proposed company alias table exists. |
| G3: is the posting still open? | **Not done.** `npm run ats:liveness` has not been run on any posting. | Every sample posting is a fictional `jobs.example.com` URL, so a liveness check on the sample would say nothing about a real job. Every "tailor" action is shown blocked at G3 (test at line 145). |
| G4: does a DOL LCA record back an application? | **Not done.** No DOL LCA check has been made, and `sample/overrides.json` is empty. | `G4 accepted 0 refused 0` (line 87); `test_sample_overrides_ship_empty` (lines 151–152). Writing evidence there without the check would be an invented record. |

## Sources

- `baseline-before.txt` (header lines 1–3; doctor and verify lines 34–114), `clean-run.txt` (lines 1–195) and `break-attempt.txt` (lines 1–5), kept by the author outside the repository. The blocks above are copied from them line for line, except for one email address redacted on `clean-run.txt` line 164 (see the note under the PII scan block).
- `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.md` and `g1-entity-review.md` at `55ca2f4` (pre-re-cut `0a27e32`), for per-role sample outcomes.
