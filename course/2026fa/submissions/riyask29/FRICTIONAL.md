# FRICTIONAL — honest log

## Executive summary

This is the honest record of how this submission was made: what was tried,
what went wrong, what was checked, and who did what. Most of the code and
writing was produced by an AI assistant (Claude, in Claude Code) working in my
terminal at my direction, in one session on 2026-10-02. I chose the domain and
the key settings, approved each step, re-ran the tool myself, and cleared every
human gate (I opened the postings and decided the title and timeline questions).
My own reflections are in *What I checked, changed or learned*; how that section
was written is stated there.

## Who did what

| Decision or artifact | Human (riyask29) | AI (Claude) |
|---|---|---|
| Domain: **Data Analyst**, not AI Engineer | **chose it.** The AI suggested AI/ML Engineer first | proposed the options |
| Persona name "Sneha Patil" | **chose it**, replacing the AI's "Neha Kulkarni" | made the rest of the persona: dates, days used, buffer |
| Recipe status DRAFT vs RUNNABLE-SAMPLE | **chose DRAFT** when asked | laid out the trade-off and recommended DRAFT |
| Go-ahead at each step (1–7) and the step-6 plan | **approved** | asked before each step |
| Fork, clone, branch, install, baseline runs | — | ran them |
| Finding the candidate postings | — | queried public Greenhouse/Lever/Ashby boards |
| CHANGE-BRIEF predictions | approved without changes | drafted them |
| All prototype code, tests, fixtures, README | — | wrote them |
| Recipe, card, TEST-REPORT, justification, worked run, run log, this file | — | drafted them |
| Keyword rules in `title-families.json` | **changed one rule** at G4 (`quantitative analyst` → other); accepted the rest | wrote the first version |
| Hiring-lag and fit estimates in `candidates.json` | **accepted the lags** as realistic at G3 | chose the first values |
| Re-running the tests and the prototype (runs 2, 3) | **ran them** in my own terminal | — |
| Opening EverQuote and Abacus postings (G2) | **checked both in Chrome**; spotted that EverQuote has a *form*, not a button | explained what to look for |
| G4 title decisions | **decided**: the Abacus title counts; Quantitative Analyst does not | changed the rule file as instructed; added a test |
| G3 hiring lags, G1 Writer/HubSpot | **decided**: lags realistic; Writer/HubSpot unknown, research by hand | asked the questions |
| Letting a person's G2 check into the tool | asked for help clearing the gates | added the `source: your-input` path + test |

## Attempts, expectations, what happened

Each entry: what was tried → what we expected → what happened → response.

1. **`npm run ats:scan -- --dry-run` on a fresh clone** → expected a scan →
   `Error: portals.yml not found. Run onboarding first.` → found in the archived
   Summer run log that it reads `REALLOCATION_ENGINE_PORTALS`; pointed it at
   `data/ats/portals.example.yml`. It worked: 879 Databricks jobs, 61 kept.
   *Learned:* the assignment's command does not run as written on a fresh clone.
2. **The scan's location filter** → expected US-only (config says US/Remote) →
   kept "Staff Forward Deployed Engineer | Remote - India" and a Europe-wide
   security role → **not fixed** (out of scope). Recorded as a repo defect.
3. **`npm run ats:liveness`** → expected a result → `browserType.launch:
   Executable doesn't exist` → ran `npx playwright install chromium`.
4. **Liveness on two repo URLs** → expected the old Figma link to be dead and
   the Writer link to be live → **the reverse**: Writer expired, Figma active →
   checked Figma through the public Greenhouse API, and it really is open.
   *Learned:* my "old means dead" assumption was wrong; check, don't assume.
5. **`npm run verify` warnings** → W2 said `private/` and `data/ats/` are not
   gitignored → `git check-ignore -v` showed they are (`/private/*`,
   `/data/ats/*`) → a false alarm in the manifest checker.
6. **`npm install` modified `package-lock.json`** → would have entered the PR →
   reverted with `git checkout -- package-lock.json`.
7. **Exploring the data for analysts** → expected Form D to help with funding →
   **0 of 166** analyst-titled sponsors are in the 4 Form D samples → recorded as
   prediction F3 *before* writing the brief, and said so in the brief, rather than
   presenting it as a lucky prediction.
8. **CONTRIBUTING.md says to import the scorer's exports** → `role-scorer.mjs`
   has no `export` and calls `main()` at load → the prototype calls the CLI with
   `spawnSync` and reads `role-scores.json`.
9. **Scorer sponsorship detection** → the persona README says the "work
   authorized" trap was fixed (PR #37) → reproduced it anyway: profile
   "F-1 STEM OPT — work authorized (EAD)" gave `profile_needs_sponsorship =
   False` → added a guard that refuses to report, plus a test. **Did not patch
   the scorer** (it is not in my namespace). *Unresolved:* was the fix lost in
   the Fall re-cut, or did it only ever exist in the Summer repo?
10. **All 8 tests passed on the first run** → that is suspicious → mutation
    check: made a missing company get `p = 0` → 3 tests failed → restored → 8/8.
11. **First full PII scan** → expected clean → it flagged phone numbers in my
    fixture, and the same rows held real executive and board names from the CSV
    → blanked those columns and removed `related_persons` from the Form D slice.
    *Learned:* copying "real data" into a fixture copies people's names too.
12. **Report wording** → "binding deadline is their **unemployment-days**" → fixed.
13. **Plan predicted `npm run doctor` would count one more recipe** → it does
    not; `doctor.mjs` reads only top-level `recipes/`. Wrong prediction, recorded.
14. **Recipe comment said the run "is logged"** before the log existed → reworded.
15. **Break attempt: typo "Abacus Insight"** → expected a near-match hint →
    `not-in-dataset`, no hints → **not fixed yet**; it is the next improvement in
    WORKED-RUN.
16. **The AI's own arithmetic** → first wrote that a 5-week lag moves Abacus to a
    different band → recomputed: 0.294 is still Consider; 6 weeks (0.147) is
    what flips it to Skip → corrected in WORKED-RUN and TEST-REPORT.
17. **Upstream CI** → expected green to be achievable → upstream `main`'s own
    Contrib Gate fails (`harness-regression`, `doctor-and-pii`, run 35913366020),
    and `pii-scan` flags `package-lock.json` on an untouched clone → documented
    in TEST-REPORT §8 so a red check on my PR is read against that baseline.
18. **My re-run (run 2)** → expected the same result as run 1 → **Abacus came back
    `uncertain`** (`Timeout 15000ms exceeded`), 25 minutes after run 1 said
    `active`. The Greenhouse API still had the job. *Learned:* the same check
    is not repeatable; one run's "uncertain" is not evidence that a job closed.
19. **Opening the postings myself (G2)** → I expected to confirm or reject the
    tool → both were open, and I noticed that **EverQuote has an "Apply for this
    job" form rather than a button**. That is why the checker said "no visible
    apply control". *Learned:* the tool was wrong for a reason I could see.
20. **Clearing G2** → there was no way to tell the tool what I saw: every
    liveness-file entry was labeled a machine record → the AI changed it so my
    check keeps a `your-input` label into `roles.json`, with a test.
21. **G4 title review** → I decided "Quantitative Analyst" is not my kind of work
    and moved the rule; EverQuote went from Likely to Possible. The AI first
    claimed the score "would have been 0.231 either way"; it rechecked, and the
    old rule gives 0.3045. Same Consider label, different reason. Corrected.

## What I checked, changed or learned (riyask29)

*How this section was written: the AI offered possible answers based on what
happened in the session; I picked the ones that are true for me, and the AI put
them into sentences. The choice of points is mine.*

**What surprised me**
- Big Boston companies like HubSpot and Wayfair are not in the sponsor data at
  all. If I had used this list alone, I might have crossed them off. "Not found"
  does not mean "does not sponsor."
- Klaviyo has 154 H-1B approvals, but every sponsored title is engineering or
  management, with none for analysts. A company can be a big sponsor and still
  tell me almost nothing about my kind of job.

**What I learned from checking things myself**
- The tool can be wrong. It said EverQuote's posting was "uncertain", but when I
  opened it I could see the job was open, with an application form.
- The same check can give a different answer a few minutes later. Abacus was
  "active" in the first run and "uncertain" in mine because the page loaded
  slowly. One run saying "uncertain" is not proof that a job closed.

**What I am still unsure about**
- Whether these companies really sponsored *data analysts*. The data only has
  job titles, not occupation codes, so I cannot know for sure without the DOL
  LCA files (recipe TODO 1).

**What I changed:** one keyword rule ("Quantitative Analyst" → other) and two
liveness results (both postings confirmed open by me). I accepted the hiring-lag
estimates.

## Accepted, modified, rejected

| AI output | Decision | Note |
|---|---|---|
| Suggested domain "AI/ML Engineer" | **rejected** → Data Analyst | riyask29's choice |
| Rule "quantitative analyst = ambiguous" | **rejected** → other-analyst | riyask29 at G4 |
| Hiring-lag estimates (4/5/10 weeks) | **accepted** | riyask29 at G3 |
| Machine liveness `uncertain` for EverQuote and Abacus | **overridden** → open, after a browser check | riyask29 at G2 |
| Persona name "Neha Kulkarni" | **modified** → "Sneha Patil" | riyask29's choice |
| Recommendation: status DRAFT | **accepted** | riyask29's choice |
| Step-6 plan (recipe + card) | **accepted** | approved in plan mode |
| Everything else | accepted after review | no other disagreements |

## Traceability

| Claim in this log | Evidence |
|---|---|
| baseline doctor/verify | TEST-REPORT §1 (captured before any change) |
| scan / liveness fixes (1–4) | the commands in TEST-REPORT and WORKED-RUN; `out/liveness.json` timestamps |
| scorer "authorized" bug (9) | test `break attempt: "work authorized" persona…` in `analyst_check.test.mjs`; `fixtures/persona.authorized-trap.json` |
| mutation check (10) | TEST-REPORT §2 |
| PII fixture fix (11) | `fixtures/sponsors.slice.csv` (`phone`, `executive_officers`, `board_directors` empty) |
| typo miss (15) | WORKED-RUN *Verification §3* |
| runs 2–3, gate decisions (18–21) | `logs/runs/2026fa-riyask29-2.md`; `runs/run-2-student/`; `inputs/liveness.gate-cleared.json`; `config/title-families.json` `_changelog` |
| CI baseline (17) | GitHub Actions run 35913366020 on `nikbearbrown/the-reallocation-engine` |
| commits | `398ccd7` (all work, tested from a clean clone, TEST-REPORT §9); later commits on the same branch only add the clean-clone results and the PR link (`git log origin/main..HEAD`) |
| pull request | https://github.com/nikbearbrown/the-reallocation-engine/pull/7 |
| AI session | Claude Code session on 2026-10-02 in the student's terminal (transcript available on request) |
