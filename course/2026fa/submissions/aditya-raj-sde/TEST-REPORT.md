# TEST-REPORT — Sponsor & Posting Reality Check

## Executive summary

This is the record of every check run for this assignment: the exact command, who ran it, its
input, its exit code, where its full output is saved, and what the result does and does not
establish. Read it to confirm that the claims elsewhere in the submission rest on real output, not
descriptions.

**Final state (2026-10-03):**

- The prototype runs with one command.
- Its 18 offline tests pass, and they are shown to catch a deliberately broken refusal gate.
- The student checked a value against the source, predicted the break before it was run, ran the
  prototype himself from two clean checkouts, and judged the report adequate.
- The contribution introduces **no** failing check.
- Two upstream CI jobs fail on the unchanged upstream project for reasons outside this
  contribution; see the two "Confirmed blocker" sections.

The sections below are kept as history, in order. Setup happened in two passes. In the first pass, three checks did not pass:

- the repository's structure check needed a Python library missing on this computer;
- the privacy scan flagged an email address;
- the posting-liveness check had no browser to run with.

In the second pass, after the student's decisions:

- the Python library was installed in an isolated, project-local environment, and the structure
  check passed;
- the browser was installed, and the liveness check reported the chosen Databricks posting as
  **active** at 17:48 EDT on 2026-10-03 (a point-in-time observation, not an endorsement and not
  evidence of visa sponsorship).

The privacy-scan finding was traced to a line that ships with the upstream project itself, and the
same failure was reproduced on an untouched upstream copy and confirmed in the upstream project's own
CI history. A second upstream CI job fails because four of its test scripts are missing from the
project. These are **two confirmed blockers to a green CI run that only the maintainer can resolve**. Both passes are kept below so the first failures
stay visible.

## Conventions

- **Ran by:** `Claude` = command executed by the AI agent; `Aditya` = check performed by the student.
- Every command's full output is saved under `evidence/`. Each file records the command, its start
  and end times, the raw output (stdout and stderr together), and `[exit=N]`.
- "Establishes" states only what the output shows. Anything beyond that is labeled as inference.
- Paths are relative to the repository root unless noted.

## Pass 1 — setup and baseline (2026-10-03, 17:01–17:09 EDT)

*Rows as written at the time. "Pending" statements in this table are resolved in Pass 2.*

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 00 | Claude | `git remote add upstream …` · `git fetch upstream` · `git rev-parse main upstream/main origin/main` · `git switch -c contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027` · `git status --short --branch` | 0 (all) | `evidence/00-remote-branch.txt` | Fork, upstream, and local `main` were identical (`015843d`) when the branch was cut; tree clean. |
| 01 | Claude | GitHub REST `GET /user`, `GET /user/emails`, `HEAD /user` scopes (token from the existing git credential helper; never printed) | attempt 1: invalid (see note) · attempt 2: `/user` 200, `/user/emails` 404 · attempt 3: 200 | `evidence/01-noreply-identity.txt` | Account login `aditya-raj-sde`, id `181499137`. The token's scopes are `gist, repo, workflow`; without `user`/`user:email`, the emails endpoint returns 404. **The exact noreply address was NOT verified.** `user.email` unchanged; pending Aditya. Attempt 1 was invalid because `timeout` is not installed on this Mac; kept with a correction note. |
| 02 | Claude | `npm install` | 0 | `evidence/02-npm-install.txt` (one email in npm's deprecation text redacted, marked inline) | 55 packages installed. npm reports 3 high-severity vulnerabilities (not addressed; out of scope). **Unexpected change outside the namespace:** `package-lock.json` modified; see 02b. Playwright Chromium was **not** installed by this step. |
| 02b | Claude | `git diff --stat package-lock.json` + line classification | 0 | `evidence/02b-package-lock-diff.txt` | 36 deletions, all `"libc"` metadata fields (12 fields); 0 other changed lines. **Not staged.** Disposition pending Aditya. |
| 03 | Claude | `head -1 <sponsorship CSV> \| tr ',' '\n' \| nl` + line count + grep for `soc\|year\|fiscal\|fy` | 0 | `evidence/03-sponsor-csv-columns.txt` | 20 columns; 30,369 lines after the header (a line count, which may differ from the record count if fields contain newlines). The grep's 2 hits are `year_incorporated` and `company_age_years`, both company-age fields. **No SOC column and no per-year sponsorship column** (observed limitation). No data rows were copied (the file has a `phone` column). |
| 04 | Claude | `npm run doctor` | 0 | `evidence/04-doctor-baseline.txt` | Environment runnable; no private/PII paths tracked. |
| 05 | Claude | `npm run verify` | **1** | `evidence/05-verify-baseline.txt` | Conformance passed (158 files). **The manifest check failed:** `ModuleNotFoundError: No module named 'yaml'`. Local `python3` lacks PyYAML; CI installs it (`pip install pyyaml`). This is an environment gap, not a repo defect. Fix pending Aditya's approval. |
| 06 | Claude | `node scripts/pii-scan.mjs` | **1** | `evidence/06-pii-scan-baseline.txt` | One finding: an email address in `package-lock.json` (glob's deprecation text). **Pre-existing:** the line is present in `HEAD:package-lock.json` (verified in 07b) and was not introduced by this branch. The submission folder produced no findings. |
| 07 | Claude | `npm run ats:scan -- --dry-run` | **1** | `evidence/07-ats-scan-dry-run.txt` | `Error: portals.yml not found`. The scanner needs a config file that does not exist on a fresh clone. |
| 07b | Claude | `REALLOCATION_ENGINE_PORTALS=data/ats/portals.example.yml npm run ats:scan -- --dry-run` (no-copy alternative from `docs/tutorials/01-first-scan.md`) | 0 | `evidence/07b-ats-scan-dry-run-example-config.txt` | 1 company (Databricks, Greenhouse): 886 jobs found, 393 filtered by title, 422 by location, 10 duplicates, 61 listed. Dry run; `git status` shows no new files. Also shows the origin of the 06 finding. |
| 08 | Claude | `npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/aditya-raj-sde/runs` | 0 | `evidence/08-score-ch11-example.txt`, `runs/role-scores.{json,md}` | The existing scorer runs: 5 example roles → Apply 2 · Consider 1 · Skip 2 (skip 40%). The tracked `data/examples/role-scores.*` was not modified (09). |
| 09 | Claude | `git status --short` + `ls runs/` | 0 | `evidence/09-git-status-after-baseline.txt` | Changes after the baseline: `package-lock.json` (02b) and the new `course/2026fa/` folder only. |
| 10 | Claude | `GET https://boards-api.greenhouse.io/v1/boards/databricks/jobs`, filtered to US non-senior "engineer" titles | 0 (HTTP 200) | `evidence/10-liveness-candidate-url.txt` | 886 jobs on the board, 11 matches; first 8 listed. Candidate for the liveness baseline: see below. **Board listing ≠ liveness;** the listing is what the API returned at 17:05 EDT. |
| 11 | Claude | `npx playwright --version`; `chromium.executablePath()` existence; Playwright cache listing | 0 | `evidence/11-liveness-dependency-check.txt` | Playwright 1.62.1 is installed, but its Chromium build is **missing** (`exists=false`). `npm run ats:liveness` cannot run yet. **The liveness baseline is pending.** |
| 12 | Claude | `npm -v`; `node scripts/conformance.mjs <submission folder> logs/runs/2026fa-aditya-raj-sde-1.md`; `node scripts/pii-scan.mjs`; `git status --short --untracked-files=all`; `git diff --stat` | 0, 0, **1**, 0, 0 | `evidence/12-post-setup-checks.txt` (address redacted) | npm 10.9.2. The 7 conformance-checked files (6 md, 1 json) conform; `.txt` evidence is not a conformance type. **The PII scan found a new finding that Claude created:** evidence 06 had saved the scanner's own printout of the address. All changes are in the namespace except `package-lock.json`. |
| 13 | Claude | `node scripts/pii-scan.mjs` after redacting 06 and 12 | **1** (first capture's exit blank due to a zsh/bash slip; re-run recorded `[exit=1]`) | `evidence/13-pii-scan-after-redaction.txt` | Only the pre-existing `package-lock.json` finding remains; the submission folder and run log are clean. `grep` confirms no raw address in the namespace. |

### Liveness candidate, as proposed at 17:05 EDT (resolved in Pass 2)

- **Candidate URL for Aditya's review:**
  `https://databricks.com/company/careers/open-positions/job?gh_jid=8635225002`
  (Databricks, "Software Engineer, Web Products", Mountain View, CA; Greenhouse `updated_at`
  2026-09-21). **Host:** `databricks.com`. The listing came from `boards-api.greenhouse.io`. Databricks
  has 1 matching row in the sponsorship CSV (company-name prefix match; not yet checked by hand).
- **Blocked by:** Playwright Chromium is not installed. Unblocking would need
  `npx playwright install chromium` (a browser download), which was not run.
- **Observation, not a finding:** the board lists two separate jobs (`8635225002`, `8560779002`) with
  the identical title "Software Engineer, Web Products". Why is unknown.

## Pass 2 — corrections after Aditya's decisions (2026-10-03, 17:46–17:54 EDT)

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 14 | Claude | `git config --local user.email <noreply>`; `git config --show-origin --get user.email` | 0 (the final `grep -c` exits 1 by design: global address is not noreply) | `evidence/14-commit-identity.txt` | Address supplied by Aditya (GitHub settings screenshot); its id prefix `181499137` matches authenticated `GET /user` (01). Set in `.git/config` only; global unchanged. |
| 15 | Claude | provenance check; sanitized `git diff package-lock.json`; `git restore package-lock.json` | 0 | `evidence/15-package-lock-restore.txt` | The diff equals 02b (36 `libc` deletions), and the tree was clean before `npm install` (00), so the change came only from the install. Diff saved; file restored; `identical-to-HEAD`. CORRECTION appended: the 12 `@` matches are diff hunk headers, not addresses. |
| 16 | Claude | `/usr/local/bin/python3 -m venv .venv`; `.venv/bin/python -m pip install pyyaml` | 0 | `evidence/16-python-venv-pyyaml.txt` | PyYAML 6.0.3 is installed in the gitignored `.venv/` only. `python3` on `PATH="$PWD/.venv/bin:$PATH"` resolves to the venv; the system `python3` still lacks yaml (unchanged). Side observation: pip picked an **arm64** wheel, so this "x86" Python is a universal binary running arm64. |
| 17 | Claude | `PATH="$PWD/.venv/bin:$PATH" npm run verify` + control without the PATH change | **0** with venv · 1 control | `evidence/17-verify-with-venv.txt` | Corrects 05. Conformance 158 files ok; manifest check passed with 3 warnings. The W2 warnings ("private/ and data/ats/ not gitignored") were checked: `git check-ignore` shows `/private/*` and `/data/ats/*` ignore them, and only scaffolding files are tracked. The warning comes from how the check reads `.gitignore`, not from a real exposure. |
| 18 | Claude | `npx playwright install chromium` | 0 | `evidence/18-playwright-chromium-install.txt` | Corrects 11. Chrome for Testing 151.0.7922.34 (Playwright chromium v1234) + headless shell + ffmpeg downloaded from `cdn.playwright.dev` into the user-level cache; `exists=true`; repo tree unchanged. |
| 19 | Claude | `npm run ats:liveness -- '<URL>'`; `curl -L` redirect trace; read-only Playwright probe (inline); Greenhouse `GET /jobs/8635225002` | 0 · 0 · 0 · 0 | `evidence/19-liveness-baseline-8635225002.txt` | See "Liveness baseline result" below. |
| 20 | Claude | `git worktree add --detach <scratch> upstream/main`; that revision's `node scripts/pii-scan.mjs`; `git worktree remove` | scanner **1** | `evidence/20-pii-upstream-revision.txt` | On an unchanged upstream checkout (`015843d`, 0 modified files), upstream's own scanner reports the same single finding: `package-lock.json` line 606, glob's deprecation text. The finding pre-dates this branch. |
| 21 | Claude | GitHub REST: workflow runs ×2 (API error both times), then `GET /commits/015843d/check-runs`, then `GET /actions/jobs/{id}` for the failed jobs | API errors, then HTTP 200 | `evidence/21-pii-upstream-ci-runs.txt` | **Upstream's real CI on `015843d`** (completed 2026-09-23): `doctor-and-pii` = **failure**, at step 6 "PII scan (working tree)", with step 7 (diff scan) skipped; `harness-regression` = **failure** at step 5; `conformance` and `verify` = success; `contrib-scope` = skipped (push event). *Row first written at about 17:52 while the request was still pending; updated at 17:54 when it returned.* |
| 22 | Claude | `node scripts/test/gate-behavior-harness.mjs` (CI's step 5) + existence check of every harness the job calls | **1** (MODULE_NOT_FOUND) | `evidence/22-harness-regression-upstream.txt` | At upstream `015843d`, 4 of the 6 harness scripts named in `contrib-gate.yml` are **absent**: `scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`, `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`. The job cannot pass for any branch based on this revision. |

## Pass 3 — commit checks (2026-10-03, from 17:55 EDT)

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 23 | Claude | `git add -- <submission folder> logs/runs/2026fa-aditya-raj-sde-1.md`; pattern scan of `git diff --cached` added lines (emails, phone shapes, secret shapes, institutional domain, home paths, private-path mentions); sizes | 0 | `evidence/23-pre-commit-sensitive-inspection.txt` | 33 staged files, all in the namespace; 1,782 insertions; largest file 19.5 KB. Emails: only the allowlisted noreply address (3×, in 14). Phone, secret, institutional-domain, and private-path matches: 0. **8 local home-directory paths** in raw tool output (16, 18, 20, 22) show the macOS username and folder layout. Low sensitivity, left unaltered, flagged to Aditya. |
| 24 | Claude | after commit `c002f78`: `node scripts/pii-scan.mjs --diff upstream/main`; `node scripts/pii-scan.mjs`; `git diff --stat/--name-only upstream/main...HEAD`; `git log --format='%h %ae'`; `npm run doctor` | **0** · 1 · 0 · 0 · 0 (plus one Claude syntax error, CORRECTION appended) | `evidence/24-post-commit-scoped-scan.txt` | **Contribution-scoped scan (the PR-only CI step): `clean ✓`.** The working-tree scan still reports only the pre-existing upstream lockfile line. 34 files / 1,825 insertions, 0 outside the namespace. Commit author is the noreply address. Doctor runnable. This row and file are committed in a follow-up commit, which this scan therefore does not cover; it is re-checked in the next stage. |
| 25 | Claude | **rerun:** `node scripts/pii-scan.mjs --diff upstream/main` over `015843d..684e5b1` (commits `c002f78`, `f8f3df8`, `bc9cc4a`, `684e5b1`) | **0** | `evidence/25-pii-scan-scoped-rerun.txt` | Contribution-scoped scan `clean ✓`. This is a new execution replacing the unsaved chat-only result from about 18:21 EDT; email-shaped strings would have been redacted in-stream (0 were present). The commit adding this file is not covered by it. |

## Evidence-contract stage (2026-10-03, 18:52–18:54 EDT; no prototype code yet)

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 26 | Claude | `node scripts/conformance.mjs <recipe> <card> <fixtures>`; an ad-hoc path-existence check over backticked repo paths; `todos_open` vs body `[TODO` markers | run 1: 0 · **1** · ok; run 2 (after fixes): 0 · 0 · ok | `evidence/26-contract-conformance-paths.txt` | 8 files conform. Run 1 found 2 untagged missing paths (an unbuilt script named without a TODO; a prohibited private path). After the fixes: 22 existing, 4 TODO-tagged, 2 prohibited references, **0 untagged missing**. `todos_open: 6` = 6 body markers (4 DEV, 1 DEFINE, 1 APPROVE). |
| 27 | Claude | an ad-hoc matching check of every fixture `company_query` against the CSV (company_name + count columns only) | 0 | `evidence/27-fixture-company-spot-check.txt` | All 7 F3 expected states match. Real companies: Databricks 1640/8; Axia 2 candidates (INC blank, LLC 2/0); Uplift Labs 0/4; Snowflake Computing blank. No CSV name contains the fictional stem "example". This is a check of the fixtures, **not** of the prototype. |
| 28 | Claude | `node scripts/pii-scan.mjs --diff upstream/main` over `015843d..d0c023d` (6 commits) | **0** | `evidence/28-pii-scan-after-contract.txt` | Contribution-scoped scan clean after the contract commit; all 6 commits authored by the noreply address. The commit adding this file is not covered by it. |

## Prototype stage (2026-10-03, 19:03–19:07 EDT)

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 29 | Claude | `node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/hypothesis-probe.mjs` (first execution of F1a, F2(a)) | 0 | `evidence/29-hypothesis-probe-f1a-f2a.txt` | **F1a observed:** the maintained scorer labels a refusal entered as p 0 with fit 0.7 / 0.9 / 1.0 as Consider 0.21 / Consider 0.27 / **Apply 0.30**, all matching the prediction. **F2(a) observed:** all 6 classifier outputs match. F2-2 ("We've filled this role" + body "Apply") → `active`, so the predicted limitation of the maintained classifier is observed on the fixture. The predictions were source-derived, so matches confirm the reading rather than foresight. |
| 30 | Claude | `node --test …/reality-check.test.mjs` (run 1) | 0 | `evidence/30-tests-run1.txt` | 18/18 pass on the first run. **The suite has not yet been shown to fail on a deliberate break** (Aditya's break attempt is pending). |
| 31 | Claude | the one documented command → `runs/sample/` (sample run 1) | 0 | `evidence/31-sample-run.txt` | 9 openings → 6 seek-vacancy-sponsorship-evidence, 2 skip-application, 1 review-offer-excerpt; 2 hypothetical scores. **Defect found by Claude reading the report:** the summary repeated "(sample of 9; not a general rate)". The exact line is preserved. |
| 30b | Claude | the same tests after the fix + a new assertion that the qualifier appears once | 0 | `evidence/30b-tests-run2.txt` | 18/18 pass (the assertion was added inside an existing test). |
| 31b | Claude | the same sample command (run 2) | 0 | `evidence/31b-sample-run2.txt`, `runs/sample/*` | Same decisions; the qualifier now appears once. These are the outputs used in `WORKED-RUN.md`. |
| 32 | Claude | conformance on namespace paths; `PATH="$PWD/.venv/bin:$PATH" npm run verify`; `npm run doctor`; working-tree `pii-scan` | 0 · 0 · 0 · 1 | `evidence/32-checks-after-prototype.txt` | 24 namespace files conform; verify passes (170 files; manifest 3 warnings, explained in row 17); doctor runnable. The working-tree scan shows only the pre-existing upstream lockfile finding (blocker 1); the new code and outputs add none. |
| 33 | Claude | after commit `265069e`: `node scripts/pii-scan.mjs --diff upstream/main`; `git diff --stat upstream/main...HEAD`; namespace check | **0** · 0 · 0 | `evidence/33-pii-scan-after-prototype.txt` | Contribution-scoped scan clean over `015843d..265069e`; 64 files, 5,806 insertions; **0 files outside the namespace**. |

## Provenance correction (Aditya-requested; Claude-executed), 2026-10-03 19:32 EDT

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 30c | Claude | the new test file run against the **previous** code (detached worktree of `b9d2ec3`), then against the fixed code | **1** (old) · 0 (fixed) | `evidence/30c-provenance-fix-tests.txt` | The new assertion detects the defect: on the old code, test 18 fails with `expected: 'your-input'`, `actual: 'record'` for a synthetic posting. On the fixed code, 18/18 pass. |
| 31c | Claude | the sample command, run 3 (recipe v0.3.0) | 0 | `evidence/31c-sample-run3-provenance.txt`, `runs/sample/*` | Same decisions. Liveness labels in the report: 1 `[record; recorded-observation]` (the Databricks observation) and 8 `[your-input; synthetic-derived]`. **These are now the outputs used in WORKED-RUN.md** (superseding 31b for that purpose; 31b is preserved). |

## Refinement after the break experiment (Aditya-decided; Claude-executed), 2026-10-03 19:5x EDT

| # | Ran by | Command | Exit | Evidence | Establishes |
|---|---|---|---|---|---|
| 37 | Claude | the strengthened suite (test 18 now also asserts that Example Robotics is skipped, that G3 is recorded as `stop`, no scenario, and that the JSON and Markdown agree) on a fresh mutant worktree of `1733dad`, then on the correct implementation | **1** (mutant) · 0 (correct) | `evidence/37-second-guard-vs-mutant.txt` | The mutant now fails **2** tests (7 and 18; 16/18 pass) instead of 1. The correct code passes 18/18. Test 18 stops at its first failing assertion (`next_action`), so on the mutant its report-agreement checks were not reached; on the correct code they pass. The original single-guard result is preserved in evidence 36. |
| 40 | Claude | after Aditya's step-4 review: tests; sample run 4; the report's gate legend; conformance | 0 · 0 · 0 · 0 | `evidence/40-gate-legend-run4.txt` | 18/18 (with legend assertions); same decisions; the legend states G4 "pass" = the sample assumption satisfied the sample rule, January compatibility NOT verified. Recipe v0.4.0 → **RUNNABLE-SAMPLE** (every SNICKERDOODLE evidence item cited in `last_gate`). |
| 41 | Claude | fast-forward Aditya's clean checkout to the final code → **failed**; then a final-code check in a separate fresh clone of `e55ddcd` | **1** (pull) · then 0 · 0 · 0 | `evidence/41-clean-checkout-final-code.txt` | The pull failed because Claude's evidence-39 commit had added copies of Aditya's run outputs where his checkout holds the untracked originals (byte-identical per `cmp`; not deleted or moved). The tests and sample run executed right after the failed pull were on the **old** code `a2db6a5`, as recorded. In the separate clone of `e55ddcd`: 18/18, sample exit 0, gate legend present. **Aditya's personal run remains on `a2db6a5`** (pre-legend; the legend is presentation only). |
| 42 | Claude | a fresh clone of the final branch (`5b813b6`; prototype code identical to `e55ddcd`) on the Desktop; `npm install`; lockfile restore; tests | 0 · 0 · 0 · 0 | `evidence/42-final-checkout-prepared.txt` | Ready for Aditya's final-code re-run: 18/18, a clean tree. The sample prototype is **not** run by Claude here. |
| 43 | **Aditya** (run); Claude (verification) | Aditya ran the sample prototype himself on the final code (`5b813b6`), 21:19:56 EDT | 0 | `evidence/43-aditya-final-code-run.txt` | Exit 0; same 9 decisions as run 4; G4 legend present (grep count 1, and in the JSON). Outputs remain in his checkout (not copied into the repo). |

## Final checks before the PR (Claude-executed), 2026-10-03 21:3x EDT

| # | Group | Result | Evidence |
|---|---|---|---|
| 44 | **A. Contribution checks** | tests 18/18; probe 9/9; `node scripts/conformance.mjs` pass; manifest check pass (PyYAML venv); `npm run verify` pass; doctor runnable; `pii-scan --diff upstream/main` clean; contrib-scope rules: protected paths none, outside namespaces none; 84 files, 8,549 insertions | `evidence/44-final-checks.txt` |
| 44 | **B. Inherited upstream failures**, reproduced on this branch **and** on an unchanged `015843d` checkout | B1: working-tree `pii-scan` exit 1 (lockfile line, both); B2: `scripts/test/gate-behavior-harness.mjs` `MODULE_NOT_FOUND`, exit 1 (both); 4 of 6 harness scripts absent | same; CORRECTION sections in that file for pipe-masked exit codes and echoed paths |
| 44 | **C. New failures introduced by this contribution** | **none found** | same |
| 44 | Inherited observation (steps CI never reaches) | existing harnesses pass their own checks (exit 0), but their output does not contain the strings CI greps for (`VALID` on the last line; `17/17 passed`); local Node 22; not verified on CI | same |

## Human review (Aditya), guided by Claude

| Step | Executed by | Reviewed by | Evidence | Aditya's finding (summary; verbatim in FRICTIONAL) |
|---|---|---|---|---|
| 1 Source comparison | Claude (independent Python `csv` extraction, CSV file line 7249) | **Aditya**, 2026-10-03 | `evidence/34-source-comparison-extraction.txt` | The values match: `DATABRICKS INC`; approvals 1640.0 → 1640; denials 8.0 → 8; the rate keeps full precision in the JSON and is rounded to 99.51 in the Markdown. The formatting differences don't change the values; the omitted fields (industry, titles) are omissions, not conflicts. This establishes correct extraction for this row only. It does **not** validate the dataset's accuracy, completeness or currency, or every other row. It does not show that job 8635225002 sponsors, that he is eligible, that timing fits, or that the posting is live. 99.51 is not his probability of sponsorship. "Seek vacancy sponsorship evidence" remains appropriate. |
| 2 Deliberate break | Claude (mutation in an isolated worktree, evidence 35; both suites and a mutated F1b run, evidence 36) | **Aditya**: prediction recorded before execution (commit `da180a2`, 19:43:47); interpretation pending | `evidence/35-…`, `36-break-mutation-run.txt` | Observed: the mutated suite **18 tests, 17 pass, 1 fail (test 7, F1b), exit 1**; the unmodified suite 18/18, exit 0. The mutated program sends all 3 refused roles to `seek-vacancy-sponsorship-evidence` with G3 reported as `pass`, and gives the 0.9-vote role a hypothetical **Apply**, composite 0.615. Prediction comparison is in the FRICTIONAL entry. **Aditya's interpretation recorded verbatim in FRICTIONAL**: test 7 detects *this* mutation; that does not prove the whole implementation correct, that every refusal wording is recognized, or that every gate defect is caught. The mutant's audit trail was inconsistent (refusal recognized, G3 recorded as passed; a hypothetical Apply while the actionable step was seek-evidence). Follow-up: a second guard was added after the experiment (row 37). |
| 3 Clean-checkout reproduction | Claude: clone of the committed branch at `a2db6a5`, install, venv, tests 18/18, probe 9/9, conformance, verify, doctor, both PII scans, scope (evidence 38). **The sample prototype run is reserved for Aditya.** | **Aditya executed** the sample prototype himself in the clean checkout, 2026-10-03 20:53:45 EDT, commit `a2db6a5`, and reported it (screenshot + saved file) | `evidence/38-…`, `39-aditya-clean-checkout-run.txt`, `runs/aditya-clean-check/` (copied from the checkout) | His run: exit 0; 9 openings → 6 seek-vacancy-sponsorship-evidence, 2 skip-application, 1 review-offer-excerpt; 2 hypothetical scores. Claude verified the saved file (mtime matches), the five outputs, and that per-role decisions, labels, and scenarios are identical to sample run 3. |
| 4 Report adequacy | Claude displayed the summary, a real-data example, a synthetic example, the scenario table, and the limitations from **Aditya's own run** | **Aditya**, 2026-10-03 | FRICTIONAL (verbatim); `evidence/40-gate-legend-run4.txt` | Yes on all four distinctions (company vs. vacancy evidence; real vs. synthetic; hypothetical vs. actionable; skipped vs. awaiting). One misleading detail: "G4 pass" despite unverified timing → he requested a legend (implemented, v0.4.0; no scoring change). With that clarification, he judges the report adequate for this sample demonstration; it does not establish real-world sponsorship, current hiring activity, or January compatibility. |

## Initial problems → resulting state

| Problem (Pass 1) | Cause (as established) | Action | Resulting state |
|---|---|---|---|
| `npm run verify` exit 1 (05) | local `python3` lacks PyYAML; CI installs it | isolated `.venv` + PyYAML (16) | exit 0 with `PATH="$PWD/.venv/bin:$PATH"` (17) |
| `ats:scan --dry-run` exit 1 (07) | no `portals.yml` on a fresh clone | documented env-var option, no file created (07b) | exit 0, nothing written |
| Liveness could not run (11) | Playwright Chromium not downloaded by `npm install` | `npx playwright install chromium` (18) | ran; gh_jid 8635225002 **active** (19) |
| `package-lock.json` modified (02b) | `npm install` dropped `libc` metadata | evidence saved, `git restore` (15) | identical to HEAD; recurs on every `npm install` (`npm ci` would not rewrite it; not tested) |
| Noreply address unverified (01) | token lacks `user:email` scope | Aditya supplied it (14) | set in `.git/config` |
| Claude's evidence leaked an address into the folder (12) | saved scanner output prints the address | redaction with marker (13) | folder clean |
| `pii-scan` exit 1 (06, 13) | pre-existing upstream lockfile line (20) | none possible inside the namespace | **open: confirmed blocker** (below) |

### Reproducible local setup (for the clean-checkout run later)

```bash
npm install
git restore package-lock.json            # npm install rewrites libc metadata; keep it out of the PR
/usr/local/bin/python3 -m venv .venv && .venv/bin/python -m pip install pyyaml   # 6.0.3 used here
npx playwright install chromium          # only needed for the live liveness check, not the offline tests
PATH="$PWD/.venv/bin:$PATH" npm run verify
```

## Liveness baseline result (evidence 19)

- **Target:** Databricks job **gh_jid 8635225002**,
  `https://databricks.com/company/careers/open-positions/job?gh_jid=8635225002`. The board also
  lists **8560779002** with the identical title, so the job is identified by id and URL, not by title.
- **Observed at:** 17:48:07 EDT (repo command), 17:48:12 (curl), 17:48:29 (browser probe), and 17:48:33
  (Greenhouse record), all on 2026-10-03.
- **Repo command result:** `✅ active`, `Results: 1 active 0 expired 0 uncertain`, exit 0.
- **Redirects (identical in curl and in the browser's main-frame chain):**
  1. `https://databricks.com/company/careers/open-positions/job?gh_jid=8635225002` → 301
  2. `https://www.databricks.com/company/careers/open-positions/job?gh_jid=8635225002` → 301
  3. `https://www.databricks.com/company/careers/integration-data-engineering-and-applications/software-engineer-web-products-8635225002?gh_jid=8635225002` → 200

  The final URL after a 3-second wait was unchanged; page title "Software Engineer, Web Products -
  Databricks".
- **Cross-check:** the Greenhouse record for 8635225002 → HTTP 200, same title, Mountain View, CA,
  `updated_at` 2026-09-21T13:22:12-04:00.
- **Limitations:**
  - This is a point-in-time observation.
  - "Active" is the repo classifier's judgment from the page's status, URL, text, and apply
    controls. It does not show that the role is being filled, that it fits a January 2027 start,
    or that Databricks would sponsor this vacancy.
  - The page body text does not contain the job id; the id is tied to the page only through the
    final URL and the Greenhouse record.
  - The browser probe is ad-hoc code (shown in full in the evidence file), not a maintained script.
  - curl cannot see JavaScript redirects; the browser chain covers main-frame navigations only.

## Confirmed blocker 1 — upstream PII-scan finding

- **What CI runs:** `.github/workflows/contrib-gate.yml`, job `doctor-and-pii`: `npm install`,
  then `node scripts/doctor.mjs`, then **`node scripts/pii-scan.mjs` (working tree)**, then, on pull
  requests only, `node scripts/pii-scan.mjs --diff origin/<base>`.
- **Established locally:** the working-tree command exits 1 on the unchanged upstream revision (20)
  and on this branch (13). The sole finding is `package-lock.json` line 606 (glob@10.5.0's npm
  deprecation text, which contains a maintainer email address).
- **Contribution-scoped scan:** `--diff` mode scans only lines **added** in `<base>..HEAD`. This
  branch restores `package-lock.json` (15), so the line is not in the diff. **Measured after commit
  `c002f78`: `pii-scan --diff upstream/main` → `clean ✓`, exit 0 (24).**
- **Observed in upstream's real CI (21):** on `015843d`, the step "PII scan (working tree)"
  failed after `npm install` and Doctor succeeded, so the Linux runner's `npm install` kept the line.
  That run was a push to `main`, so the diff step was skipped by its `if:` condition, not because of
  the failure.
- **Inferred, not observed:** on a pull request, the working-tree step runs before the diff step,
  and GitHub Actions skips later steps after a failure by default. The `doctor-and-pii` job on this PR
  is therefore expected to be red even if the contribution itself is clean. This applies to PRs whose
  head still contains that lockfile line under this workflow version. Not observed on an actual PR.
- **Not done:** no change to the scanner, the workflow, `package.json`, or `package-lock.json`.
- **Maintainer-resolution path:** the maintainer needs to decide one of the following. Each is a
  maintainer change outside the student namespace.
  1. Update `glob` (via `package.json`, CI-protected) and regenerate the lockfile so the deprecation
     text disappears.
  2. Make an explicit, reviewed scanner policy decision for npm registry metadata in
     `package-lock.json`.

  Until then, the student's PR body should cite evidence 06/13/20 and report the failure as
  pre-existing.

## Confirmed blocker 2 — upstream `harness-regression` job

- **Observed (21, 22):** upstream CI's `harness-regression` job failed on `015843d` at its first
  harness step. 4 of the 6 scripts the job calls do not exist at that revision, and running the first
  one locally gives `MODULE_NOT_FOUND`.
- **Consequence (inference):** any PR based on `015843d` will show this job red, whatever it
  contains.
- **Not done:** student harnesses belong to other students' namespaces; nothing was created or
  copied to fill the gap.
- **Maintainer-resolution path:** restore the four harnesses at the paths the workflow names, or
  update `contrib-gate.yml` (CI-protected) to the paths that exist. The PR body should cite
  evidence 21 and 22.

## Prototype tests

See rows 29–32. Commands are in the contribution README; real outputs are in `WORKED-RUN.md`.

## Failure cases exercised

| Case | Fixture | Observed (offline) |
|---|---|---|
| F1 refusal vs. high fit | `f1-refusal-roles.json` | maintained scorer: Consider / Consider / Apply (29); prototype: all three `skip-application` at G3, never scored, even with a 0.9 scenario vote (test 7) |
| F2 closed-but-200 and paraphrase | `f2-snapshots.json` | F2-1 skip; F2-2 classifier `active` → prototype `liveness-conflict` → human review; F2-3 human review; F2-4 skip "thin content, not an explicit closure"; F2-5 "closed-loop" → human review, not skip (tests 8–13) |
| F3 missing ≠ zero; no merges | `f3-states.json` | all 7 states as expected; blank counts stay `null`; zero approvals "not a refusal"; ambiguous rows listed, not merged; no `p` on company evidence (tests 14–15) |
| Timing missing | `timing-cases.json` | `blocked-timing-input`; not written to the scorer's `roles.json` (test 17) |
| Mislabeled input / unsafe out-dir | `invalid-timeline-label.json` | exit 2, named error, nothing written; out-dir over `data/examples` refused (tests 3–4) |

## Clean-checkout verification

See the human-review table (step 3): Claude prepared the clean checkouts (evidence 38, 42); Aditya
ran the sample prototype himself on `a2db6a5` (evidence 39) and on the final code `5b813b6`
(evidence 43).

## Scope check (`git diff --stat`)

Recorded per commit (evidence 24, 28, 33) and in the final checks (evidence 44): only namespaced
paths change.

## What the gate requires a human to judge

- **G2:** whether a "liveness-conflict" or "uncertain" posting is really open (open the page).
- **G3:** whether a refusal excerpt really applies to this opening.
- **G5:** what sponsorship evidence to seek for silent, not-captured, or ambiguous postings, and
  whether an offer excerpt is credible.
- **Ambiguous employers:** which CSV row, if any, is the right employer.
- **G6:** the final read of the report. The recipe's promotion to RUNNABLE-SAMPLE waits for this read
  by Aditya.

**Clean-checkout verification:** environment and checks prepared by Claude (evidence 38). **Aditya personally ran the sample prototype there (exit 0, evidence 39), and again on the final code in a fresh checkout (exit 0, evidence 43).**
