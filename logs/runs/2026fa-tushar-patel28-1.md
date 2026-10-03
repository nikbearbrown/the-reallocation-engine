# Run log — tushar-patel28 · 2026fa · entry 1

## Executive summary

This is the run record for my contribution: a tool that checks whether an employer's visa-sponsorship history lists a job title in a student's field, and whether a role's start date fits the student's work-permit window. On a fresh copy of my branch, every automated check passed, and a deliberately impossible start date was rejected exactly as predicted. The recipe stays a draft because two project rules conflict with the student contribution rules. Two human checks are still undone: whether postings are live, and the government labor-filing records. Each open item is listed below with its evidence.

## 2026-10-02 — swe-title-sponsor-opt clean-checkout run and break test

- **Recipe:** `recipes/cases/2026fa/tushar-patel28-swe-title-sponsor-opt.md` v0.3.0 (status DRAFT, `todos_open: 2`), with card `….card.md`.
- **Inputs:**
  - **Checkout:** a fresh clone of `contrib/2026fa-tushar-patel28-swe-title-sponsor-opt` at pre-re-cut commit `0a27e32`. On 2026-10-02 the branch was re-cut for privacy (`0a27e32` → `55ca2f4`); the re-cut changed only wording, so the code and data are identical (see TEST-REPORT §Toolchain baseline, re-cut note).
  - **Sample inputs:** the fictional persona in `sample/persona.json`; `sample/candidate-roles.json` (real company names, fictional postings); `sample/overrides.json` (empty); `crosswalk.json` and `mappings.json`.
  - **Data:** `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` and `data/bls/compact/soc_occupation_compact.csv`.
  - **Break test:** the same clone, with the Databricks role's `start_date` changed to `2027-02-30`.
  - **Baseline:** doctor and verify on a fresh clone of main at `015843d` (2026-10-01).
  - **Evidence files** (kept outside the repo): `baseline-before.txt`, `clean-run.txt`, `break-attempt.txt`.
- **Outputs:**
  - **In this repo:** `course/2026fa/submissions/tushar-patel28/TEST-REPORT.md` and this entry.
  - **In the clean clone, not committed:** `course/2026fa/submissions/tushar-patel28/runs/` (`roles.json`, `role-scores.{json,md}`, `swe-title-sponsor-opt-2026-10-02.{json,md}`). The break run overwrote these.
  - **Committed sample-run artifacts:** `…/runs/swe-title-sponsor-opt-2026-10-01.{json,md}` at `55ca2f4`.
- **Result:**
  - **Clean run:** `✓ 12 roles · scored 11 · not scored 1 · scorer {'Consider': 9, 'not scored': 1, 'Skip': 2} · … · G4 accepted 0 refused 0 · next actions {'tailor an application': 5, 'network into the company': 4, 'blocked: fix the input and re-run': 1, 'blocked: pick the right company row, then re-run': 1, 'skip': 1}`.
  - **Tests:** `Ran 40 tests in 1.212s` · `OK`.
  - **Conformance on the prototype folder:** `17 files (2 md · 9 json · 4 js · 2 py)` ✓.
  - **Verify:** `177 files` ✓, `manifest check passed (3 warnings)`. Before any work it was 158 files with the same 3 warnings; the +19 files are mine.
  - **pii-scan:** 1 finding, the pre-existing email address in `package-lock.json` (npm's maintainer address; not repeated here, since writing it into a tracked file is itself a finding).
  - **Diff vs main:** 27 files, 6,965 insertions, 0 deletions, all under my namespaces.
  - **Break test:** `✓ 12 roles · scored 10 · not scored 2 · scorer {'not scored': 2, 'Consider': 8, 'Skip': 2} …`, with the error `role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored`. That matched every predicted count and the predicted error (12 of 12 rows; see TEST-REPORT §Break attempt).
  - **Gates:** G1 confirmed by tushar-patel28 in `g1-entity-review.md` (commit `55ca2f4`, pre-re-cut `0a27e32`: 12 rows yes, Google no). G3 and G4 not cleared.
  - **Predictions** (outcomes recorded in the change brief's 2026-10-01 revision):
    - P1 is partly confirmed. AI shows false unknowns, but Cloud titles are rarer still.
    - P2 got the outcome partly right and the mechanism wrong. Google is absent for coverage reasons, and Salesforce came back ambiguous.
    - P3 is confirmed (skip rate below half), mostly because of the soft-tier mapping.
    - P4 holds for my list but not across the dataset.
- **Open issues:**
  1. **Lifecycle conflict (a): SPECIFIED needs zero TODOs, but proposals must stay marked TODO.**
     - `SNICKERDOODLE.md` line 58: "| DRAFT → SPECIFIED | zero open `[TODO]` items; each closure has its required evidence (table below) | the closures themselves, in the recipe |".
     - `SNICKERDOODLE.md` line 75: "A `[TODO]` without evidence of closure is still open, whatever the text says."
     - `course/summer-2026/reallocation-engine-mode-build.md` line 71: "**Proposed additions** — any new data sources or commands, each with a justification for why it belongs, marked with a typed `[TODO]`."
     - This is the only assignment text in the repo; there is no Fall 2026 file.
     - My two `[TODO: DEV]` proposals (the liveness record for roles without a G4 entry, and the company alias table) therefore block SPECIFIED.
  2. **Lifecycle conflict (b): RUNNABLE-SAMPLE needs a RUN_LOG entry, but students may not edit `logs/RUN_LOG.md`.**
     - `SNICKERDOODLE.md` line 59: "| SPECIFIED → RUNNABLE-SAMPLE | full sample run completes; conformance checks pass; audits generated and read | RUN_LOG entry + audit files |".
     - `SNICKERDOODLE.md` line 111: "Record in `logs/RUN_LOG.md`: every script run against real data, …".
     - `CONTRIBUTING.md` line 13: "| Run-log entries | `logs/runs/<term>-<handle>-<n>.md` — **never** edit `logs/RUN_LOG.md` |".
     - `logs/RUN_LOG.md` line 3: "**Students: do NOT edit this file.**".
     - `.github/workflows/contrib-gate.yml` line 82 fails student PRs that touch it.
     - Whether this entry counts as the "RUN_LOG entry" is a maintainer decision.
  3. **Scorer "authorized" bug.** `scripts/score/role-scorer.mjs` `applyProfile` (lines 56–63) treats `authorization` text matching `/…|authorized/` as "no sponsorship needed" and sets the sponsorship weight to 0. An F-1 profile written as "F-1 STEM OPT — work authorized (EAD)" moved the Ch.11 biotech role from 0.446 Apply to 0.1785 Skip (reproduced 2026-10-01). This contradicts the `search/examples/aarav-patel/profile.yml` note that PR #37 fixed it. Not patched here; my tool never passes `--profile` and guards the weight.
  4. **Other defects found:**
     - **Scorer API:** the scorer has no exports, contrary to `CONTRIBUTING.md` lines 46–49, and calls `main()` at line 185 on load.
     - **Manifest check:** W2 is a false positive for `private/` and `data/ats/`. Its string match in `scripts/manifest-check.mjs` lines 74–80 doesn't treat `.gitignore` lines 37 and 40 as coverage, though `git check-ignore` confirms both are ignored.
     - **Doctor status line:** `doctor` prints a template comment in its status counts (`RUNNABLE-LIVE  # DRAFT | SPECIFIED | …`) because one top-level recipe's `status:` line keeps the template's inline comment (`SNICKERDOODLE.md` line 65). My recipe's status line also has an inline comment, so it would show the same defect if promoted.
     - **Doctor coverage:** `doctor` doesn't scan `recipes/cases/`. It reported 33 recipes before and after, so case recipes' `todos_open` is untracked.
     - **pii-scan:** flags an email address in `package-lock.json`: npm's maintainer address inside an npm-generated lockfile (`baseline-before.txt` line 8 shows it in the `glob@10.5.0` deprecation notice).
     - **Sponsorship CSV:**
       - every H-1B approval and denial count is even, suggesting double counting;
       - `SALESFORCE COM INC` and `SALESFORCECOM INC` are duplicate rows with identical sponsorship fields;
       - the `website` column looks name-derived (`salesforcecom.com`) — my judgment, not a record.
     - **H-1B join validator:** `scripts/sec/validate-h1b-join-sample.py` defaults to `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv`, which isn't in this cut.
     - **Scorer report:** `role-scores.md` has no executive summary (P9).
     - **Closure wording:** the brief's 2026-10-01 revision says the DEFINE rationales were drafted by Claude and approved by me, while the recipe labels read "rationale drafted by tushar-patel28". Both are recorded; to reconcile.
  5. **G1 Salesforce still ambiguous in the tool.** Both rows were marked "Yes" in the G1 review and the side-by-side pick was left blank. The role stays "blocked: pick the right company row" until the proposed alias table exists.
  6. **G3 liveness: not cleared.** `npm run ats:liveness` has not been run on any posting. The sample postings are fictional `jobs.example.com` URLs, so G3 can only be cleared on real postings.
  7. **G4 DOL LCA check: not cleared.** No DOL LCA check has been made and `sample/overrides.json` is empty, so no role is Apply. An LCA is evidence of an intent to file, not an approved visa.
