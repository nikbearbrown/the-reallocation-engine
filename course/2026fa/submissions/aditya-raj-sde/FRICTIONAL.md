# FRICTIONAL — Sponsor & Posting Reality Check (Aditya Raj, INFO 7375 Fall 2026)

## Executive summary

This is the honest process log for one course assignment: designing a small, evidence-checked
procedure that tells an international engineering student, for January 2027 roles, whether a
company has a record of visa sponsorship and whether a specific job posting is still open. The log
records what was attempted, what was expected, what actually happened, which decisions were made
and by whom, and what is still uncertain. Read it to see how the work was done and who did which
part, as opposed to what was produced. So far the work has set up the working branch and evidence
records; nothing has been built yet.

## How to read this log

- Entries are dated and append-only. Earlier entries are never rewritten; corrections are added as
  new entries.
- **Claude** = the AI coding agent (Claude Code, model `claude-opus-5-5`) running commands in this
  repository on Aditya's instruction. **Aditya** = the student. Each entry says who acted.
- Aditya's decisions are recorded from his own chat instructions. His reflections, checks, and
  understanding are written by him, or are marked *pending — Aditya to write*. Claude does not
  write them for him.
- Raw command output lives in `evidence/`; the command index is in `TEST-REPORT.md`.

---

## 2026-10-03 — Session 1: requirements reading and initial inspection (Claude, read-only)

*Retrospective entry, written at about 17:05 EDT about work done earlier in the same session.
The individual commands from this step were not timestamped; the only clock reading taken was
`date` → `Saturday 2026-10-03 16:48 EDT`, near the end of the inspection.*

- **What Claude did:** read the assignment PDF (13 pages, printed from Canvas on 2026-10-02),
  `AGENTS.md`, `CLAUDE.md`, `SNICKERDOODLE.md`, `DOMAIN.md`, `CONTRIBUTING.md`,
  `DATA_CONTRACT.md`, `PROJECT_RULES.md`, `_MANIFEST.md`, `recipes/README.md`,
  `recipes/cases/README.md`, `scripts/contrib/README.md`, `course/README.md`, the run-log section of
  `recipes/_shared.md`, `.github/workflows/contrib-gate.yml`, `.github/PULL_REQUEST_TEMPLATE.md`,
  `scripts/pii-scan.mjs`, the header of `scripts/conformance.mjs`, and parts of
  `scripts/score/role-scorer.mjs` and `scripts/ats/check-liveness.mjs`.
- **Git state observed (untimed):** branch `main`, working tree clean, up to date with
  `origin/main`; only the `origin` remote (the fork) was configured; `git ls-remote` showed upstream
  `main` at `015843d`, the same commit as the fork.
- **Friction (Claude):** the first attempt to download the course pages (`ai-policy.md`,
  `frictional.md`, `github-submission.md`, `relative-quartile.md`, and the assignment Markdown) into
  the session scratch directory failed. Every download returned HTTP 200 but curl exited 56
  ("Failure writing output to destination") and saved 0 bytes. **Likely cause (not confirmed):** the
  scratch directory did not exist yet; it was created later with `mkdir -p`. **Response:** fetched to
  stdout instead. `ai-policy.md`, `frictional.md`, and `github-submission.md` were read in full. The
  assignment Markdown was fetched (340 lines) and grepped for logging, lifecycle, ZIP, branch, and
  PII terms; those lines matched the PDF. **`relative-quartile.md` was not re-fetched and has not been
  read.** The quartile table in the PDF was used instead.
- **Environment observations (untimed):** `node_modules/` absent; Node v22.14.0; no `.venv/`; no
  `portals.yml` at repo root (only `data/ats/portals.example.yml`); the Playwright browser cache
  held no Chromium build. The repo's local `git config user.email` was an institutional address,
  not a GitHub noreply address. The address itself is deliberately not reproduced here.
- **Conflicts identified (Claude's reading; resolutions approved by Aditya in Session 1):**
  1. The constitution and `_shared.md` say to log runs and conflicts in `logs/RUN_LOG.md`; the
     assignment, `CONTRIBUTING.md`, and CI forbid student edits to it. → Use
     `logs/runs/2026fa-aditya-raj-sde-1.md` with the `_shared.md` field layout.
  2. The constitution's lifecycle reaches VERIFIED; the assignment caps it at RUNNABLE-SAMPLE, with
     `attestation: null` unless a named human signs. → Follow the cap.
  3. The generic course posting page names `fall-2025/<name>/assignment-XX/`; this assignment names
     its own namespaces. → Assignment namespaces govern.
  4. `package.json` is CI-protected and contrib tools get no npm script. → The prototype command
     will be `node scripts/contrib/...`.
  5. `npm run score` without `--out-dir` overwrites tracked example output. → Always pass `--out-dir`.
  6. `ats:liveness` needs Playwright Chromium and the network; the required test must be offline.
  7. "Your own situation" vs. the no-real-personal-data rule. → Generic situation + fictional persona.
  8. The sponsorship CSV and Form D samples contain company phone numbers; the PII scanner exempts
     them only under `data/`. → Evidence excerpts must omit phone and executive columns.
- **Observed evidence limitation (Claude, from the CSV header; re-captured in evidence file 03):**
  `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` has no SOC-code column
  and no per-year sponsorship columns. Sponsorship appears only as `Total Approvals`,
  `Total Denials`, `Approval_Rate`, `median_salary_offered`, and the free-text
  `top_job_titles_sponsored`. Free-text sponsored titles do **not** establish that a company sponsors
  a specific current vacancy.

## 2026-10-03 — Session 1: setup plan decisions (Aditya)

Recorded from Aditya's chat reply approving the setup plan. The reply's exact time was not
recorded; it arrived before the branch was created at 17:01:14 EDT.

- Approved the setup plan, with logging established **before** installation and baseline runs.
- Confirmed the Canvas deadline: **Saturday 2026-10-03 23:59**.
- Commit identity: use his verified GitHub noreply address **for this repository only**, retrieved
  from authenticated account information if possible, otherwise supplied by him. No guessing, no
  global Git change.
- Offline prototype tests; keep the assignment's separate baseline liveness check. Claude is to
  identify a public posting URL and host **for his review**, and record any blocking dependency as
  pending.
- Scope: sponsorship evidence and posting liveness only. Funding, wage, dashboards, broad scraping,
  and presentation extras are deferred.
- Record the missing SOC codes and year-by-year detail as an observed limitation; make no claim of
  vacancy-level sponsorship from free-text titles.
- Predictions stay pending until Claude asks the scenario questions and he answers.

*Aditya's own reflection on this stage: pending — Aditya to write.*

## 2026-10-03 — Session 1: branch creation (Claude)

- **Expected:** fork `main` == upstream `main`; branch created cleanly.
- **What happened:** at 17:01:14 EDT, added the `upstream` remote, fetched it, and confirmed
  `main`, `upstream/main`, and `origin/main` all resolve to
  `015843d5047dbadff05068495e4c5db5cd9945f4`. Created
  `contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027`; working tree clean. All exit codes 0.
  Evidence: `evidence/00-remote-branch.txt`. This output was captured to the scratch directory
  before `evidence/` existed, then moved in unchanged.

## 2026-10-03 — Session 1: log skeletons created before installation (Claude)

- Created `FRICTIONAL.md`, `TEST-REPORT.md`, `SOURCES.md`, `CHANGE-BRIEF.md` (all predictions
  pending), and `evidence/` after the branch existed and before any install or baseline command,
  as Aditya instructed. From this point, every command's output went straight into `evidence/` with
  start and end times and `[exit=N]`.

## 2026-10-03 — Session 1: GitHub noreply identity (Claude) — unresolved

- **Expected:** read the exact noreply address from authenticated account info.
- **Attempt 1 (17:02:58 EDT):** reported "no stored credential". **Claude's mistake:** the command
  was wrapped in `timeout`, which is not installed on macOS (`command -v timeout gtimeout` → exit 1),
  so the credential helper never ran. The attempt was kept in the evidence with a correction note
  rather than deleted.
- **Attempt 2 (17:03:17):** authenticated `GET /user` → 200 (login `aditya-raj-sde`, id
  `181499137`); `GET /user/emails` → 404.
- **Attempt 3 (17:03:35):** token scopes are `gist, repo, workflow`. Without a `user` or
  `user:email` scope, the emails endpoint is unavailable. That is why the 404 happened.
- **Decision:** the exact address could not be verified, so per Aditya's rule Claude did **not**
  construct one from the id and did **not** set `user.email`. No commit has been made, so nothing has
  used the institutional address yet. **Pending: Aditya to supply the address.**
- Evidence: `evidence/01-noreply-identity.txt`.

## 2026-10-03 — Session 1: install and baseline (Claude)

- **`npm install` (exit 0)** changed `package-lock.json`, which was not expected. The diff is 36
  deleted `"libc"` metadata lines and nothing else (evidence 02b), consistent with local npm 10
  rewriting a lockfile written by a newer npm. That cause is an inference, not checked. **The file was
  left unstaged; Claude did not revert it.** Disposition is pending Aditya.
- **Redaction:** npm's deprecation warning contains a real maintainer email address. Claude replaced
  it in `evidence/02-npm-install.txt` with a visible `[EMAIL REDACTED …]` marker. This is the only
  edit made to any raw output.
- **`npm run verify` (exit 1):** conformance passed, but the manifest check failed with
  `No module named 'yaml'`. Local `python3` (x86, `/usr/local/bin`) has no PyYAML; CI installs it.
  Claude did not install anything into Python; that is pending Aditya's approval.
- **`node scripts/pii-scan.mjs` (exit 1):** flagged the same maintainer email inside
  `package-lock.json`. Claude checked `git show HEAD:package-lock.json`, and the line is present at
  upstream HEAD, so this finding pre-dates the branch. Open question for the PR: CI runs the
  working-tree scan after `npm install`, so CI may fail the same way for every student. Not verified
  against an actual CI run.
- **`npm run ats:scan -- --dry-run` (exit 1):** `portals.yml not found`. Claude did not create the
  file, since it would sit outside the namespace and represent a private target list. The rerun used
  the repo's documented no-copy option `REALLOCATION_ENGINE_PORTALS=data/ats/portals.example.yml`
  (exit 0, nothing written).
- **`npm run score` on the Ch.11 example with `--out-dir` (exit 0):** 5 roles → Apply 2 ·
  Consider 1 · Skip 2 (skip 40%). The tracked example output was untouched.
- **Liveness baseline:** Claude found a candidate posting through the public Greenhouse board API
  (evidence 10). It did **not** open the posting. Playwright's Chromium is not installed (evidence
  11), so the check is **pending**: it needs Aditya's review of the URL and host, and approval to run
  `npx playwright install chromium`.

*Aditya's checks, reactions, and learning for this stage: pending — Aditya to write.*

## 2026-10-03 — Session 1: Claude's own evidence tripped the PII scan (Claude)

- **What happened (17:08 EDT, evidence 12):** the post-setup PII scan reported a **new** finding in
  `evidence/06-pii-scan-baseline.txt`. That file stores the scanner's raw output, and the scanner
  prints the email address it flags, so saving the evidence re-published the address in this folder.
  The earlier statement that the npm-install redaction was "the only edit made to any raw output"
  is therefore superseded by this entry.
- **Response:** redacted the address in `evidence/06` and `evidence/12` (which captured the same
  output) with a visible `[EMAIL REDACTED …]` marker, then re-ran the scan (evidence 13).
- **Lesson for the remaining stages (Claude):** any saved output from `pii-scan.mjs`, or from tools
  that echo package metadata, must be checked for addresses before it is kept in this folder.

## 2026-10-03 — Session 1: Aditya's decisions on the setup findings

Recorded from Aditya's chat reply (received before 17:46 EDT; exact time not recorded):

- Supplied his noreply address via a screenshot of his GitHub email settings; to be set for this
  repository only.
- Lockfile: confirm the diff came only from the install, keep a sanitized record, restore the file,
  and do not discard unrelated changes.
- PyYAML: isolated, untracked Python environment that `npm run verify` actually uses; no global
  Python changes and no bypassing package-manager protections.
- Install Playwright Chromium and run the liveness baseline on the specific posting, identified by
  URL and job id because the title is duplicated. This is a baseline demonstration, not an
  endorsement or a sponsorship claim.
- Investigate the upstream PII finding using the actual CI workflow, without assuming every PR fails,
  weakening the scanner, or hiding the finding.
- Keep original failures; append corrected runs. Commit only setup docs, logs, and permitted
  evidence; no push and no prototype yet.

## 2026-10-03 — Session 1: corrections pass (Claude), 17:46–17:54 EDT

- **Identity (17:46):** set the supplied noreply address in `.git/config` only (evidence 14).
  Claude checked that its `181499137` prefix matches the id from the authenticated API call in
  evidence 01.
- **Lockfile (17:46):** the diff matched 02b, and the tree was clean before `npm install`, so the
  change came only from the install. Saved the diff and restored the file (15).
  **Claude's mistake:** labeled a sanitization count "none expected" and got 12. Checked rather than
  assumed: all 12 were diff hunk headers (`@@ … @@`). A CORRECTION note was appended.
- **PyYAML (17:47):** created a gitignored `.venv` with PyYAML 6.0.3. `scripts/manifest-check.mjs`
  shells out to bare `python3`, so the venv only counts if `.venv/bin` comes first on `PATH`. Verify
  passed that way; a control run without it failed exactly like the original (16, 17).
  **Unexpected:** pip installed an arm64 wheel, so the Python described as "x86" is a universal
  binary running arm64 here.
- **Manifest warnings checked, not assumed:** "private/ and data/ats/ not gitignored" is a false
  alarm. Both are ignored via `/private/*` and `/data/ats/*`, and only scaffolding is tracked.
- **Chromium (17:47):** installed with the project's Playwright (18). The **liveness baseline
  (17:48)** reported gh_jid 8635225002 as `active`. Redirects went databricks.com → www → a slug URL
  carrying the id. The page body does not contain the id, so the id link relies on the URL and the
  Greenhouse record (19). Because the repo's liveness command prints no redirects, Claude used curl
  plus a small ad-hoc browser probe, recorded verbatim in the evidence.
- **Upstream PII investigation (17:48–17:54):**
  - An untouched upstream worktree reproduced the finding with upstream's own scanner (20).
  - GitHub's API errored twice. A third request hung for minutes; Claude documented the pending state
    in the report and then updated it when the request returned.
  - Upstream's real CI on `015843d` failed at "PII scan (working tree)" (21).
  - **Not looked for:** the same data showed `harness-regression` failing too. 4 of the 6 harness
    scripts it calls are absent upstream (22). Recorded as a second maintainer-side blocker.
- Nothing was changed in the scanner, the workflow, `package.json`, or the lockfile.

*Aditya's reasoning and learning for these decisions: pending — Claude will ask, and will not write
it for him.*

## 2026-10-03 — Session 1: first commit (Claude), 17:55 EDT

- Staged only the submission folder and the run-log entry (33 files, then 34 with evidence 23).
  The pattern scan of the staged diff found only the allowlisted noreply address, plus 8 local
  home-directory paths in raw tool output. Claude flagged those to Aditya rather than editing raw
  evidence.
- Committed `c002f78` with the noreply author (no push).
- The contribution-scoped scan that CI runs on PRs (`pii-scan --diff upstream/main`) came back
  **clean**. The working-tree scan still fails only on the upstream lockfile line.
- **Claude's mistake:** `git rev-parse --short HEAD upstream/main` is invalid syntax (exit 128).
  Corrected and re-run in the same evidence file.
- Evidence 24 and these record updates go into a second commit, so the recorded diff scan covers
  the first commit only.

## 2026-10-03 — Session 1: prediction discussion (Aditya and Claude)

- **Format (Aditya's request):** three situations, one at a time. Claude asked for his action and
  reason, and explained or challenged only after he answered. His answers are recorded verbatim in
  `CHANGE-BRIEF.md` §2.
- **Aditya's private planning context** was shared in chat only. It is deliberately **not** recorded
  in any tracked file; the public situation wording and the fictional persona (Aarav Patel) are in
  CHANGE-BRIEF §1.
- **A difference of approach:** when asked what a first prototype would get wrong, Aditya said he was
  unsure and suggested Claude draft the prototype first. Claude declined, because the assignment
  requires predictions before building and keeping the originals; a prediction made after the build
  would be hindsight. Claude instead offered predictions derived from his answers, attributed to
  Claude, for him to confirm. Aditya then accepted F1–F3 as hypotheses and L1 with narrower wording,
  and set seven scope decisions (CHANGE-BRIEF §3).
- **Claude's correction of its own proposal before execution:** on re-reading
  `scripts/ats/liveness-browser.mjs`, the browser layer drops Apply controls in nav, header, and
  footer. Claude's earlier F2 wording ("a page with a site-wide Apply button → active") was
  therefore inaccurate for the live path. It was refined in CHANGE-BRIEF §9, with the original wording
  kept beside it.
- **Source check (Claude):** no repository README states the time period covered by the sponsorship
  counts, so L1 calls them "aggregate counts with unspecified time coverage", per Aditya's wording.
- **Computed, not run (Claude):** F1's predicted composites (0.21 / 0.27 / 0.30) come from the
  scorer's CONFIG and have not been executed yet.

*Aditya's own reflection on this stage (for example, why he chose "apply" for C, or what changed in
his view): pending — Claude will ask, and will not write it for him.*

## 2026-10-03 — Session 1: Aditya's review of the brief (Aditya; recorded by Claude)

- **Aditya's reflection on situation C, in his words:** "I had initially chosen to apply for
  situation C because, if it doesn't say anywhere that the company does not sponsor, my instinct
  would be to apply for the job."
- **Aditya's decisions:**
  - accepted the revised F2 as a hypothesis, not a verified result;
  - asked that F2's tests separate the maintained classifier's predicted behavior from the
    prototype's intended behavior, with explicit fixture conditions;
  - asked that F1's assumptions be made explicit;
  - asked for the contribution-scoped PII check to be captured as a labeled rerun.
- **Claude's additions in response** (CHANGE-BRIEF Update 1):
  - **F1 assumption table.** Writing it surfaced two facts not stated before: the F1 prediction
    flips to Skip / Consider / Consider if the timeline gate is 0.85 instead of 1.0; and fit 1.0 sits
    exactly on the Apply threshold.
  - **Six F2 fixtures**, plus a proposed closure-wording check that only routes to a human. The
    check is pending Aditya's confirmation.

## 2026-10-03 — Session 1: evidence-contract stage (Claude, in plan mode then executing the approved plan), 18:40–18:54 EDT

- **Exploration findings that changed the design (Claude):**
  - `Total Approvals` is blank for 28,812 of 30,369 rows, so "blank" is the common case, not an edge
    case.
  - 198 company names collide once legal suffixes are removed.
  - No repository source maps approval counts to a sponsorship tier or score. The book's chapter 7
    says the tiers are unreconciled.
- **Aditya's decisions** (via plan questions; recorded in CHANGE-BRIEF Update 2):
  - counts stay context;
  - scoring only with an explicit uncalibrated scenario vote;
  - closure check included;
  - no networking in v1;
  - timing reported as unverified.
- **Claude's own errors caught in this stage:**
  1. The first fixture draft labeled fixture-only liveness values in a way the contract would have
     reported as `record`. Fixed by giving each recorded liveness an explicit `source`; only the
     Databricks observation backed by evidence 19 is `record`.
  2. A planned fictional employer name ("Northwind …") turned out to be a substring of a real
     company in the CSV. All fictional employers were switched to an `Example …` prefix (absent from
     the CSV, per evidence 27).
  3. The first path check failed (evidence 26). The recipe named the unbuilt script without a typed
     TODO, and a prohibition list mentioned an absent private path. The first was reworded. The
     checker now reports the second as a prohibited reference rather than treating it as existing.
     Both runs are kept.
- **Open for Aditya:** confirm the scenario-vote precedence default (the APPROVE item).

*Aditya's own reflection on this stage: pending; Claude will not write it.*

## 2026-10-03 — Session 1: precedence rule approved (Aditya), prototype stage begins (Claude)

- **Aditya** explicitly approved the scenario-precedence rule (verbatim in CHANGE-BRIEF Update 3):
  for silent postings the actionable result stays "seek sponsorship evidence", and any demonstration
  score is a separately labeled hypothetical. The recipe's APPROVE item is closed with that
  evidence; `todos_open` goes from 6 to 5.
- **Claude** found, before writing code, that `scripts/score/role-scorer.mjs` calls `main()` at module
  load. Importing it would execute the scorer, so the prototype reuses it through its CLI and reads
  `role-scores.json`, as `CONTRIBUTING.md` allows. Nothing from the scorer is copied.

## 2026-10-03 — Session 1: prototype built and run (Claude), 19:00–19:10 EDT

- **Built:** `reality-check.mjs`, `hypothesis-probe.mjs`, `reality-check.test.mjs`, and the README,
  following the committed contract. Before testing, one contract gap was found and written into the
  recipe: the order in which overlapping wording patterns win (contradictory > conditional >
  refusal > offer > silent).
- **Hypotheses first executed (evidence 29):** all 9 predictions matched. This is less impressive
  than it sounds: Claude wrote F1 and F2 after reading the source. The useful outcome is that the
  F2-2 limitation is now observed rather than predicted. The maintained classifier calls
  "We've filled this role" + a body Apply link `active`.
- **Tests:** 18/18 on the first run. Claude notes this means the suite has not yet been seen to
  fail; Aditya's break attempt is what will test the tests.
- **Defect Claude found by reading the first report:** the executive summary printed the sample
  qualifier twice. The line was kept in evidence 31, fixed, an assertion added, and the run repeated
  (30b, 31b).
- **Lifecycle:** with all typed TODOs closed with evidence, the recipe moved DRAFT → **SPECIFIED**
  (v0.2.0). The networking DEFINE item was closed by Aditya's plan-question choice ("never in v1");
  its reasoning sentence comes from option text Claude drafted. RUNNABLE-SAMPLE is held until Aditya
  has read the sample report, because the gate says outputs must be "generated and read".
- **Open questions for Aditya:**
  - Is a 2/9 skip fraction (most openings end at "seek evidence") the right behavior for a real
    search, given the engine's "healthy run skips at least half" heuristic?
  - Should synthetic snapshots keep the `record` label for the classifier's output?

*Aditya's own observations: pending his checks.*

## 2026-10-03 — Session 1: synthetic-liveness provenance corrected (Aditya-directed; Claude-executed), 19:30–19:33 EDT

- **Aditya's decision:** liveness derived from an invented posting must not look like a verified
  observation of a real employer posting. This resolves the open question Claude had logged.
- **Claude's change:**
  - Such values are now `your-input`, marked `synthetic-derived`, with a basis line saying no real
    posting was observed. Only real recorded observations stay `record`.
  - Invented vacancy text carries a basis note.
  - Recipe v0.2.0 → v0.3.0; README labels updated.
- **Test of the test (Claude):** the new assertion fails on the previous code (expected `your-input`,
  actual `record`) and passes on the fix (evidence 30c). This is the first time a test in this suite
  has been shown to fail on a real defect.
- **Preserved:** run 2's output with the old labels (31b). Run 3 (31c) is now the worked-run source.

## 2026-10-03 — Human review, step 1: source comparison (Aditya-reviewed; extraction Claude-executed)

- **Claude executed:** the independent extraction (Python `csv`) of CSV file line 7249 alongside the report values (evidence 34).
- **Aditya reviewed the comparison and wrote, verbatim:**

> Looking at the side-by-side comparison, the reported values match:
>
> The company name is DATABRICKS INC.
>
> Approvals are 1640.0 in the CSV and 1640 in the report.
>
> Denials are 8.0 in the CSV and 8 in the report.
>
> The approval rate retains its precision in JSON and is rounded to 99.51 in Markdown.
>
> The decimal formatting differences do not change the numerical values. Industry and sponsored job titles are not included in the report; that is an omission of fields, not a conflicting value.
>
> This comparison supports that the prototype extracted and represented these fields correctly for this CSV row, using an independent parser as a cross-check. It does not independently validate the original dataset’s accuracy, completeness, or currency, or establish that every other row is handled correctly.
>
> It also does not establish that Databricks job 8635225002 offers sponsorship, that I am eligible for it, or that its timing fits my availability. The 99.51 figure is not my probability of receiving sponsorship. This comparison does not verify posting liveness either.
>
> Because the vacancy’s sponsorship wording was not captured, “seek vacancy sponsorship evidence” remains the appropriate next step.

## 2026-10-03 — Human review, step 2: deliberate break — Aditya's PREDICTION (recorded at 19:43:47 EDT, before any execution)

- **Claude prepared** the mutation in an isolated worktree (evidence 35): the G3 refusal check is disabled with `false &&`. No tests had been run.
- **Aditya's prediction, verbatim:**

> My prediction :
>
> 1. I expect the F1b refusal-gate test to fail. It requires an explicitly refused vacancy to stop at G3 with skip-application, but the changed condition can never execute. A sample-output test might also fail if it asserts the original skip count or refusal outcome.
>
> 2. I expect the vacancy-text classification tests to keep passing because refusal wording should still produce explicit-refusal. Tests for company matching, liveness, and input validation should generally remain unaffected. I expect the unmodified version to continue passing all 18 tests.
>
> 3. For a refused opening with valid timing inputs, I expect the mutated version to continue to the sponsorship-evidence step and probably return seek-vacancy-sponsorship-evidence instead of skip-application.
>
> The role carrying a demonstration vote of 0.9 may now also receive a hypothetical score, depending on the later scenario-scoring conditions. That would show the refusal gate no longer prevents it from reaching that path. It would not establish genuine sponsorship eligibility.
>
> I am less certain about the exact number of failing tests and whether the later scoring filters admit that refused role. Please preserve these uncertainties in the prediction, run both versions, and show which expectations were supported or contradicted.

**Step 2 execution (Claude-executed, 19:44 EDT, evidence 36) compared with Aditya's prediction:**

| Prediction (Aditya) | Observed | Verdict |
|---|---|---|
| The F1b refusal-gate test fails | test 7 (F1b) fails: `expected 'skip-application'`, `actual 'seek-vacancy-sponsorship-evidence'` for `f1b-fit-0.7` | supported |
| A sample-output test *might* also fail | the sample-run test **passes**; it asserts no refusal outcome or skip count | not supported. Only one test guards the refusal gate. |
| Vacancy, company, liveness, and validation tests keep passing | 17 of 18 pass, including all of those | supported |
| The unmodified version passes all 18 | 18/18, exit 0 | supported |
| A refused opening goes to `seek-vacancy-sponsorship-evidence` | all 3 refused F1b roles: `seek-vacancy-sponsorship-evidence`; the gate trail shows G3 **pass** | supported (and the audit trail becomes misleading) |
| The 0.9-vote role *may* get a hypothetical score | it does: hypothetical **Apply**, composite 0.615 | supported. This is the F1 danger: a refused opening shown with "Apply". |
| Uncertain about the number of failing tests | exactly 1 | resolved: 1 |

**Aditya's interpretation of step 2, verbatim (Aditya-reviewed):**

> The comparison demonstrates that test 7 detects this specific refusal-gate mutation: the mutated version fails that test, while the unmodified version passes all 18. The other passing tests show that recognizing refusal wording and enforcing the refusal gate are separate behaviors.
>
> It does not prove that the entire implementation is correct, that every refusal wording is recognized, or that every possible gate defect would be detected.
>
> My uncertainty about the sample-output test is now resolved: it continued passing because it did not assert the refused opening’s outcome. Preserve that result alongside the original prediction.
>
> The mutated program also produces an inconsistent audit: it recognizes explicit-refusal but records G3 as passed. One refused role receives a hypothetical Apply label, although its actionable next step remains seek-vacancy-sponsorship-evidence. We should preserve that distinction when describing the failure.
>
> Please add a second guard by strengthening the existing end-to-end sample test. Assert from the generated output that Example Robotics is skipped and its refusal gate is recorded as stopped. Check consistency between the JSON result and the human-readable report.
>
> Record this as a refinement made after the experiment.

- **Decision (Aditya):** add a second guard by strengthening the existing end-to-end sample test. This is recorded as a **refinement made after the experiment**; evidence 36 stays as the original experiment.

**Refinement result (Claude-executed, evidence 37):**

- The strengthened test 18 asserts, from the generated output, that Example Robotics is
  `skip-application`, that G3 is `stop`, that there is no scenario, and that the JSON and the
  Markdown agree.
- **Mutant:** 2 tests fail (7 and 18), exit 1. **Correct code:** 18/18, exit 0.
- **Limitation of this check:** on the mutant, test 18 stops at its first failing assertion, so its
  report-agreement checks are exercised only on the correct code.

## 2026-10-03 — Human review, step 3: clean-checkout reproduction

- **Claude executed** (evidence 38): a fresh clone of the committed branch at `a2db6a5`, `npm install`,
  the lockfile restore, the PyYAML venv, tests 18/18, the probe 9/9, conformance, verify, doctor,
  both PII scans, and the scope check (0 outside the namespace). A correction is appended in that
  file: Claude's echoed command lines had shown absolute Desktop paths.
- **Aditya executed** the sample prototype himself at 20:53:45 EDT with the one-line command Claude
  provided, and reported the result: exit 0; 9 openings → 6 seek-vacancy-sponsorship-evidence,
  2 skip-application, 1 review-offer-excerpt; 2 hypothetical scores (evidence 39).
- **Claude verified** his saved output file and outputs; the per-role results are identical to
  Claude's sample run 3.

## 2026-10-03 — Human review, step 4: report adequacy (Aditya-reviewed)

- **Reviewed:** the report from Aditya's own clean-checkout run (`runs/aditya-clean-check/reality-check.md`).
- **Aditya's review, verbatim:**

> Yes—historical company evidence is separate from vacancy-specific evidence. Databricks’ recorded approvals do not establish sponsorship for this opening; its sponsorship wording was not captured.
>
> Yes—real observations and synthetic inputs are distinguishable. Databricks has a dated observation, while Example Robotics uses an invented snapshot whose derived liveness is labeled your-input.
>
> Yes—hypothetical scores are separate from actionable next steps. A scenario score of 0.42 does not establish eligibility or override “seek sponsorship evidence” or “review offer excerpt.”
>
> Yes—two applications are skipped, six require sponsorship evidence, and one requires review of an apparent offer. The seven unresolved/review cases are not confirmed rejections or verified application opportunities.
>
> One presentation detail could still mislead: “G4 pass” appears even though timing is unverified. Please clarify in the gate legend that this means the explicit sample assumption satisfied the sample rule, not that actual start-date compatibility was verified. No scoring-rule change is needed.
>
> With that clarification, I consider the report adequate for explaining this sample demonstration and its limitations. It does not establish real-world sponsorship, current hiring activity, or January start compatibility.

- **Requested change (Aditya):** a gate legend clarifying "G4 pass". This is presentation only; no scoring-rule change. Claude implements it next; it changes the report text after Aditya's clean-checkout run (`a2db6a5`).

**After step 4 (Claude-executed, evidence 40):** the gate legend was added to both outputs, with a test
assertion. Decisions are unchanged. With every lifecycle evidence item present, the recipe moved
SPECIFIED → **RUNNABLE-SAMPLE** (v0.4.0); `attestation` stays `null`. **Note:** Aditya's personal
clean-checkout run (step 3) was on `a2db6a5`, before the legend; the legend change is presentation
only.

**Claude's mistake (21:04, evidence 41):** Claude tried to fast-forward Aditya's clean checkout to the
final code, and the pull failed. Claude's own evidence-39 commit had placed copies of his run outputs
at the path where his checkout keeps the untracked originals. The commands that followed therefore
ran on the old code, which is recorded as such. His originals were left in place (byte-identical to
the committed copies). The final-code check was redone in a separate fresh clone (18/18, sample exit
0, legend present).

## 2026-10-03 — Step 5: Aditya's reflection and time estimate (Aditya's words, verbatim)

> 1. Learning
>
> My main takeaway is that a company’s sponsorship history and its policy for a particular opening are two different things. Initially, I said I would apply when the sponsorship data was missing. I now think the tool should leave that question open and tell me what evidence I still need.
>
> The break test also helped explain why recognizing a refusal is not enough. The program still recognized the wording after we disabled the gate, but it stopped enforcing the decision. The second test makes sense because it checks what actually appears in the final output.
>
> What remains uncertain is how reliably the wording rules would handle real postings beyond these examples.
>
> 2. Usefulness
>
> I think the output is useful as an initial screening step. It helps separate openings I should skip from ones that still need research before I spend time tailoring an application.
>
> It is not a complete job recommendation system. Most of this sample still needs evidence or review, and the tool has not confirmed sponsorship or January compatibility. The useful part is making those gaps visible rather than giving me a confident answer without enough support.
>
> 3. Time estimate
>
> - 20 openings screened per week
> - 20 minutes to tailor an application
> - 20% assumed to be closed or explicitly refusing sponsorship
> - 2 minutes per opening to review the tool’s output
>
> That gives 20 × 0.20 × 20 − 20 × 2 = 40 minutes saved per week.

- **Attestation request (Aditya):** keep the earlier run on `a2db6a5` in the record; Claude provides a one-line command so Aditya can re-run the final code himself; the final-code run is added only after he executes and reports it.
- **Claude's arithmetic check of the estimate:** 20 × 0.20 × 20 = 80 min of tailoring avoided; 20 × 2 = 40 min of review overhead; 80 − 40 = **40 min/week**, as Aditya computed. Break-even share s = o / t = 2 / 20 = 10%: if fewer than 10% of openings were closed or refusing, the review overhead would exceed the saving.

## 2026-10-03 — Step 3b: Aditya re-ran the final code; attestation drafted

- **Aditya executed** the sample prototype on the final code at 21:19:56 EDT (commit `5b813b6`):
  exit 0, same decisions, legend present (evidence 43). Claude verified the saved file and outputs.
- **Claude drafted** the attestation in `WORKED-RUN.md` from the evidence and Aditya's recorded
  responses. It is marked DRAFT and not signed until Aditya confirms it explicitly.

## 2026-10-03 — Attestation confirmed (Aditya)

- **Aditya's confirmation, verbatim:** "Confirmed: the attestation accurately distinguishes what I
  personally ran and reviewed from what Claude executed. Record my confirmation with today’s date."
- The attestation in `WORKED-RUN.md` is now marked confirmed: Aditya Raj, 2026-10-03.
- The recipe's `attestation:` frontmatter field stays `null`. `SNICKERDOODLE.md` reserves it for the
  VERIFIED stage, and this assignment caps the status at RUNNABLE-SAMPLE. The attestation record
  lives in the worked run.

## Status note (final reconciliation, 2026-10-03)

Earlier entries are kept as history. Their "pending" markers were resolved later: Aditya's
reflections are in the step 1–5 entries, his checks in steps 1–4, and the attestation above.

## 2026-10-03 — Final checks (Claude), 21:35–21:40 EDT

- All contribution checks passed (evidence 44, group A). The two inherited failures were reproduced
  on the branch and on unchanged upstream (group B). No new failure was found (group C).
- **Claude's capture mistakes, corrected in the file:**
  - Three `[exit=…]` values came from `tail` or `grep` rather than the harness. One `tail -3` hid
    the error line. These were re-run with complete output.
  - Echoed command lines showed absolute paths; they were sanitized.
- **New inherited observation:** the two existing harnesses don't print the strings CI greps for.
  This is reported in the PR as unverified on CI.
