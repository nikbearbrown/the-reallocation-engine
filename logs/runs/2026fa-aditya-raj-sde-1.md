# Run log — 2026fa-aditya-raj-sde-1

## Executive summary

This is the run record for one student's course contribution, "Sponsor & Posting Reality Check for
January 2027 Engineering Roles". The contribution checks whether a company has a record of visa
sponsorship and whether a specific job posting is still open. Read this entry to see which runs
happened, against what data, and with what result. So far only the setup baseline has run. The
existing role scorer and the job-board scan worked. The repository check, the privacy scan, and the
posting-liveness check did not pass, for environment reasons recorded below. The prototype has not
been built.

## Entries

Field layout from `recipes/_shared.md` (Logging Rules). Per the assignment and `CONTRIBUTING.md`,
these entries live here and never in `logs/RUN_LOG.md`.

## 2026-10-03 — Toolchain baseline (setup, before any prototype code)

- **Recipe:** manual (setup baseline; the case recipe
  `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md` does not exist yet)
- **Run by:** Claude (Claude Code) on Aditya Raj's instruction; branch
  `contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027`, cut from `015843d`
- **Inputs:** `data/examples/ch11-roles.json`; `data/ats/portals.example.yml` (via
  `REALLOCATION_ENGINE_PORTALS`); header of
  `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`; one read-only GET of
  the public Greenhouse board for Databricks
- **Commands:** `npm install`; `npm run doctor`; `npm run verify`; `node scripts/pii-scan.mjs`;
  `npm run ats:scan -- --dry-run` (twice); `npm run score -- data/examples/ch11-roles.json --out-dir
  course/2026fa/submissions/aditya-raj-sde/runs`; Playwright dependency check
- **Outputs:** `course/2026fa/submissions/aditya-raj-sde/evidence/00`–`11`;
  `course/2026fa/submissions/aditya-raj-sde/runs/role-scores.{json,md}`
- **Result:** doctor exit 0. Scorer exit 0 (5 example roles → Apply 2 · Consider 1 · Skip 2, skip
  40%). Scan dry-run with the example config exit 0 (1 company, 886 jobs found, 61 listed, nothing
  written).
- **Open issues:**
  - `npm run verify` exit 1: the manifest check needs PyYAML, which local `python3` lacks
    (conformance itself passed).
  - `pii-scan` exit 1: one email address in `package-lock.json` that is already present at upstream
    HEAD.
  - `ats:scan --dry-run` exit 1 without `portals.yml` (resolved by the documented env-var option).
  - `npm install` modified `package-lock.json` (36 `libc` metadata deletions); unstaged, disposition
    pending.
  - Liveness baseline pending: Playwright Chromium not installed; candidate URL awaiting human
    review.
  - Commit identity pending: noreply address not verifiable with the stored token's scopes.
  - Observed data limitation: the sponsorship CSV has no SOC codes and no per-year sponsorship
    columns.

## 2026-10-03 — Setup corrections and liveness baseline

- **Recipe:** manual (setup corrections; the case recipe does not exist yet)
- **Run by:** Claude (Claude Code) on Aditya Raj's instruction
- **Inputs:** Databricks posting gh_jid 8635225002
  (`https://databricks.com/company/careers/open-positions/job?gh_jid=8635225002`); Greenhouse public
  record for the same id; an unchanged worktree of `upstream/main` (`015843d`); upstream CI check runs
  and job steps (GitHub public API)
- **Commands:** `git restore package-lock.json`; `python3 -m venv .venv` + `pip install pyyaml`;
  `PATH="$PWD/.venv/bin:$PATH" npm run verify`; `npx playwright install chromium`;
  `npm run ats:liveness -- <URL>`; `curl -L` redirect trace; an inline Playwright probe;
  `node scripts/pii-scan.mjs` on the upstream worktree; `node scripts/test/gate-behavior-harness.mjs`
- **Outputs:** `course/2026fa/submissions/aditya-raj-sde/evidence/14`–`22`, `evidence/INDEX.md`
- **Result:**
  - `npm run verify` exit 0 with the venv (3 warnings).
  - Liveness: gh_jid 8635225002 `active` at 17:48 EDT (301 → 301 → 200; final URL carries the id).
    A point-in-time observation, not sponsorship evidence.
  - Lockfile identical to HEAD.
- **Open issues:**
  - **Confirmed upstream blocker 1:** `pii-scan` working-tree step fails on unchanged upstream (glob
    deprecation email in `package-lock.json`). Upstream CI `doctor-and-pii` failed on `015843d`.
  - **Confirmed upstream blocker 2:** upstream CI `harness-regression` failed on `015843d`; 4 of 6
    harness scripts named in the workflow are absent.
  - Both need maintainer action.
  - `npm install` will rewrite the lockfile again on every run.

## 2026-10-03 — sponsor-live-jan2027 sample run (prototype v1)

- **Recipe:** `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md` v0.2.0 (SPECIFIED)
- **Run by:** Claude (Claude Code) on Aditya Raj's instruction
- **Inputs:** `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json`
  (fictional persona Aarav Patel; 8/9 synthetic postings); sponsorship CSV sha256
  `eccdee2addf472b1…`
- **Outputs:** `course/2026fa/submissions/aditya-raj-sde/runs/sample/reality-check.json`,
  `reality-check.md`, scenario files `roles.json`, `role-scores.json`, `role-scores.md`
- **Result:**
  - 9 openings → 6 `seek-vacancy-sponsorship-evidence`, 2 `skip-application` (1 closed, 1 refuses
    sponsorship), 1 `review-offer-excerpt`.
  - 2 hypothetical scenario scores (Consider, 0.42), shown separately; they changed no next step.
  - Timing verified for 0.
  - Offline tests 18/18. The hypothesis probe: 9/9 predictions matched.
- **Open issues:**
  - The first report repeated the sample qualifier (fixed, re-run).
  - The skip fraction of 2/9 is below the engine's heuristic and is a design question for Aditya.
  - Human checks pending: a hand cross-check, a break attempt, a clean-checkout reproduction, and
    the attestation.
  - Upstream CI blockers 1 and 2 remain.

## 2026-10-03 — sponsor-live-jan2027 sample run 3 (provenance correction)

- **Recipe:** v0.3.0 (SPECIFIED)
- **Run by:** Claude, on Aditya Raj's direction
- **Inputs:** the same `fixtures/sample-run.json`
- **Outputs:** `runs/sample/` (overwritten); run 2 is preserved in evidence 31b
- **Result:** same decisions. Liveness labels: 1 `record` (the real Databricks observation), 8
  `your-input` / `synthetic-derived`. The new provenance test fails on the old code and passes on
  the fix.
- **Open issues:** human checks still pending

## 2026-10-03 — human review steps 1–4 and promotion to RUNNABLE-SAMPLE

- **Recipe:** v0.4.0
- **Run by:** Claude executed the extraction, the mutation runs, the clean-checkout setup and checks,
  and sample run 4. **Aditya executed** the sample prototype himself in the clean checkout
  (20:53:45 EDT, exit 0).
- **Inputs:** the sponsorship CSV (line 7249, via Python `csv`); a mutant worktree (G3 disabled); a
  clean clone at `a2db6a5`; `fixtures/sample-run.json`
- **Outputs:** evidence 34–40; `runs/aditya-clean-check/`; `runs/sample/` (run 4)
- **Result:**
  - Source values match (Aditya-reviewed).
  - The mutant was caught by test 7 (1 failure); after the second guard, by tests 7 and 18. The
    correct code passes 18/18.
  - Aditya's own run: exit 0, identical decisions.
  - The report was judged adequate by Aditya once the G4 legend was added. Recipe promoted to
    RUNNABLE-SAMPLE.
- **Open issues:**
  - The time estimate, reflection, and attestation are pending Aditya.
  - Upstream CI blockers 1 and 2 remain.

## 2026-10-03 — final checks and submission preparation

- **Recipe:** v0.4.0, RUNNABLE-SAMPLE. Attestation confirmed by Aditya Raj (in the worked run).
- **Run by:** Claude
- **Inputs:** branch at the reconciliation commit; an unchanged `015843d` checkout for comparison
- **Outputs:** `course/2026fa/submissions/aditya-raj-sde/evidence/44-final-checks.txt`; the
  finalized `PR-DESCRIPTION.md` and `SUBMISSION.md`
- **Result:**
  - All contribution checks pass.
  - The two inherited upstream failures are reproduced on the branch and on unchanged upstream.
  - No new failure was introduced by this contribution.
- **Open issues:**
  - The PR's CI is expected to show the two inherited failures.
  - A maintainer is needed for both.
