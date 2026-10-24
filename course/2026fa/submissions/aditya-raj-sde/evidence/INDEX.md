# Evidence index

## Executive summary

This folder holds the raw output of every command run while setting up this assignment, saved as
it appeared. This page lists each file and says whether it records an **initial** problem or the
**corrected** state that followed. That way a reviewer can see what failed at first, what was
changed, and what the result was. Nothing that failed was deleted or rewritten; fixes appear as new
files or as appended sections. The setup now works end to end. Two problems cannot be fixed from this
contribution, and both also fail in the upstream project's own automated checks: the privacy scanner
flags an email address that ships with the upstream project, and one test job calls four test
scripts that are missing upstream.

## Conventions

- Each file records the command (`$ …`), start and end times, raw output, and `[exit=N]`.
- **Redactions:** a third party's email address that appears in npm and scanner output is replaced
  with a visible `[EMAIL REDACTED …]` marker so this folder passes the PII scan. No other content is
  altered. Sections headed `CORRECTION` are appended notes about mistakes in Claude's own capture
  commands; the original lines above them are kept.
- All commands were run by **Claude**. No check in this folder was performed by Aditya.

## Files

| File | Phase | What it records | Outcome |
|---|---|---|---|
| `00-remote-branch.txt` | setup | upstream remote, fetch, branch cut from `015843d` | ok |
| `01-noreply-identity.txt` | initial | authenticated GitHub lookup of the noreply address (3 attempts; attempt 1 invalid, see CORRECTION) | address **not** verifiable with the token's scopes |
| `02-npm-install.txt` | setup | `npm install` (one redaction) | ok; side effect: lockfile modified |
| `02b-package-lock-diff.txt` | initial | classification of the lockfile change | 36 `libc` deletions only |
| `03-sponsor-csv-columns.txt` | observation | sponsorship CSV header | no SOC column, no per-year sponsorship columns |
| `04-doctor-baseline.txt` | baseline | `npm run doctor` | ok |
| `05-verify-baseline.txt` | **initial failure** | `npm run verify` | exit 1 — PyYAML missing → corrected in 16–17 |
| `06-pii-scan-baseline.txt` | **initial failure** | `pii-scan` (redacted later, see 13) | exit 1 — upstream lockfile line → investigated in 20–21 |
| `07-ats-scan-dry-run.txt` | **initial failure** | `ats:scan --dry-run` | exit 1 — no `portals.yml` → corrected in 07b |
| `07b-ats-scan-dry-run-example-config.txt` | corrected | same, via `REALLOCATION_ENGINE_PORTALS` | ok, nothing written |
| `08-score-ch11-example.txt` | baseline | existing scorer on the book example | ok (Apply 2 · Consider 1 · Skip 2) |
| `09-git-status-after-baseline.txt` | baseline | tree state after the baseline | lockfile + namespace only |
| `10-liveness-candidate-url.txt` | baseline | public Greenhouse listing → candidate posting | 886 jobs; candidate gh_jid 8635225002 |
| `11-liveness-dependency-check.txt` | **initial failure** | Playwright Chromium present? | missing → corrected in 18 |
| `12-post-setup-checks.txt` | check | conformance, pii-scan, status (redacted) | conformance ok; scan caught Claude's own evidence leak |
| `13-pii-scan-after-redaction.txt` | corrected | pii-scan after redaction (CORRECTION: exit capture) | only the upstream lockfile finding remains |
| `14-commit-identity.txt` | corrected | repo-local noreply `user.email` (address supplied by Aditya) | set in `.git/config`; global unchanged |
| `15-package-lock-restore.txt` | corrected | provenance check, sanitized diff, `git restore` (CORRECTION: `@` count) | identical to HEAD |
| `16-python-venv-pyyaml.txt` | corrected | isolated `.venv` + PyYAML 6.0.3 | `python3` on adjusted PATH → venv |
| `17-verify-with-venv.txt` | corrected | `npm run verify` with venv vs. control | exit 0 with venv; control still exit 1 |
| `18-playwright-chromium-install.txt` | corrected | `npx playwright install chromium` | Chromium v1234 present |
| `19-liveness-baseline-8635225002.txt` | baseline | liveness of gh_jid 8635225002: repo command, curl redirects, browser probe, Greenhouse record | **active** at 17:48 EDT |
| `20-pii-upstream-revision.txt` | investigation | upstream's own scanner on an unchanged upstream checkout | exit 1 — finding is pre-existing |
| `21-pii-upstream-ci-runs.txt` | investigation | upstream's real CI results via GitHub API (2 API errors, then check runs + job steps) | upstream `doctor-and-pii` failed at "PII scan (working tree)"; `harness-regression` also failed |
| `22-harness-regression-upstream.txt` | investigation | the failing harness step run locally + existence of every harness CI calls | 4 of 6 harness scripts absent upstream |
| `23-pre-commit-sensitive-inspection.txt` | commit check | pattern scan of the staged diff | only the allowlisted noreply address; 8 local home paths flagged |
| `24-post-commit-scoped-scan.txt` | commit check | contribution-scoped `pii-scan --diff upstream/main`, scope, author, doctor (CORRECTION: rev-parse syntax) | diff scan clean; 0 files outside namespace |
| `25-pii-scan-scoped-rerun.txt` | commit check (rerun) | contribution-scoped `pii-scan --diff upstream/main` over `015843d..684e5b1` | clean, exit 0 |
| `26-contract-conformance-paths.txt` | contract check (run 1 failed, run 2 after fixes) | conformance, path existence, TODO count for recipe + card + fixtures | run 2: 0 untagged missing paths; todos 6 = 6 |
| `27-fixture-company-spot-check.txt` | contract check | fixture company names vs CSV under the matching rule | all F3 expectations match |
| `28-pii-scan-after-contract.txt` | commit check | contribution-scoped `pii-scan --diff upstream/main` over `015843d..d0c023d` | clean, exit 0 |
| `29-hypothesis-probe-f1a-f2a.txt` | prototype | first execution of F1a and F2(a) | 9/9 predictions matched; F2-2 limitation observed |
| `30-tests-run1.txt` | prototype | offline tests, run 1 | 18/18 pass |
| `31-sample-run.txt` | prototype (defect kept) | sample run 1 + the defect line Claude found in the report | exit 0; summary qualifier duplicated |
| `30b-tests-run2.txt` | corrected | tests after the fix | 18/18 pass |
| `31b-sample-run2.txt` | corrected | sample run 2 (outputs in `runs/sample/`) | exit 0; qualifier once |
| `32-checks-after-prototype.txt` | check | conformance, verify (venv), doctor, working-tree pii-scan | pass, pass, pass; pii only the upstream finding |
| `33-pii-scan-after-prototype.txt` | commit check | scoped pii-scan + scope after the prototype commit | clean; 0 outside namespace |
| `30c-provenance-fix-tests.txt` | corrected | new provenance assertion: fails on old code, passes on fix | exit 1 old · exit 0 fixed |
| `31c-sample-run3-provenance.txt` | corrected | sample run 3 after the provenance fix (outputs in `runs/sample/`) | 1 record observation, 8 synthetic-derived |
| `34-source-comparison-extraction.txt` | human review step 1 (Claude-executed extraction) | the Databricks CSV row via Python `csv` beside the report values | match; reviewed by Aditya |
| `35-break-mutation-prepared.txt` | human review step 2 (prep) | isolated worktree + refusal-gate mutation diff; main unchanged | mutation applied in the copy only |
| `36-break-mutation-run.txt` | human review step 2 (run) | mutated suite, mutated F1b run, unmodified suite (full outputs) | mutated: 17/18, exit 1 (test 7 fails); unmodified: 18/18, exit 0 |
| `37-second-guard-vs-mutant.txt` | refinement after the experiment | strengthened test 18 vs. a fresh mutant, then vs. correct code | mutant: 2 fail (7, 18), exit 1; correct: 18/18, exit 0 |
| `38-clean-checkout-prepared.txt` | human review step 3 (prep, Claude-executed) | fresh clone of `a2db6a5`; install, venv, tests, probe, conformance, verify, doctor, PII scans, scope (CORRECTION: echoed paths) | all pass; working-tree pii only the upstream line; 0 outside namespace |
| `39-aditya-clean-checkout-run.txt` | human review step 3 (**Aditya-executed** run; Claude-verified) | Aditya's own sample run in the clean checkout + Claude's checks of it | exit 0; identical decisions to run 3 |
| `40-gate-legend-run4.txt` | corrected (after Aditya's review) | gate legend; tests; sample run 4; conformance | all pass; legend present |
| `41-clean-checkout-final-code.txt` | check (failed pull kept; then a final-code clone) | update of the clean checkout failed (Claude's copy conflict); a separate clone of `e55ddcd` passes | pull exit 1; final clone 18/18, sample 0 |
| `42-final-checkout-prepared.txt` | step 3b prep (Claude-executed) | fresh final-code clone for Aditya's re-run | 18/18; clean |
| `43-aditya-final-code-run.txt` | human review step 3b (**Aditya-executed** run; Claude-verified) | Aditya's sample run on the final code | exit 0; identical decisions; legend present |
| `44-final-checks.txt` | final checks (with corrections) | A contribution checks; B inherited failures on branch + unchanged upstream; C new failures | A all pass; B reproduced on both; C none |
