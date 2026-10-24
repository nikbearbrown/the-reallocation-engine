# Run log — 2026fa-aditya-raj-sde-2

## Executive summary

This is the run record for a student's second course contribution: a screening procedure for an
experienced Java backend candidate who can start in early 2027. Read it to see which runs
happened, on what data, and with what result. Twelve real public postings were collected under a
rule fixed in advance and screened offline, and later six unseen postings were checked once with
frozen rules. Every rule correction is recorded, and the earlier counts below are kept as they
were. At the final rules (v0.4.1), two development postings are skipped for stated minimums above
everything the fictional test candidate has worked, and the other ten go to a person. No human
gate has been cleared yet.

Field layout from `recipes/_shared.md`. Per `CONTRIBUTING.md`, this file lives here and never in
`logs/RUN_LOG.md`.

## 2026-10-21 — java-backend-early2027 live collection + page observations

- **Recipe:** recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md (rules v0.1 at the time; collection code unchanged since)
- **Run by:** Claude (Claude Code), on Aditya Raj's instruction; branch `contrib/2026fa-aditya-raj-sde-java-backend-early2027`
- **Inputs:** sponsorship CSV sha256 `eccdee2addf472b1…`; `SAMPLE-PROTOCOL.md` (committed before collection); Greenhouse boards API
- **Commands:** `collect.mjs --private-dir private/a2 --public-dir …/real-sample` (00:01:47–00:01:55 EDT); `npm run ats:liveness -- <12 URLs>` (00:02:07–00:02:38); `page-probe.mjs` (00:02:55–00:03:46)
- **Outputs:** `…/assignment-2/real-sample/probe-log.json`, `selection.json`; raw responses in gitignored `private/a2/capture/`
- **Result:** 17 employers probed, 3 boards verified (Databricks, Pinterest, Stripe), 12 postings selected. Page checker: 8 active, 4 expired (all Pinterest; the probe saw HTTP 403 "Just a moment...", 272 chars)
- **Open issues:** the maintained checker reports a 403 challenge page as expired (proposed `[DEV]` patch in the recipe)

## 2026-10-21 — java-backend-early2027 runs on the real sample (v0.1 → v0.2 → v0.3)

- **Run by:** Claude
- **Inputs:** `…/real-sample/observations.json` (excerpts; v0.1 extraction preserved as `observations-v0.1-extraction.json`, sha256 `67ba0ec3…`); candidate `config/candidate.tariq-lindqvist.json` (fictional)
- **Outputs:** `…/assignment-2/runs/real-replay-v0.1/`, `real-replay-v0.2/`, `real-replay-v0.3/` (`triage.json` + `triage.md`); private full-text twins in `private/a2/runs/`
- **Result (v0.3):** 5 skip-application (G4), 4 human-liveness-review (G2), 1 human-eligibility-review (G3), 1 human-requirement-review (G4), 1 seek-vacancy-sponsorship-evidence; skip fraction 5/12 (this sample only); full-text vs replay differences **0**; v0.2 vs v0.3 decision differences 0
- **Corrections:** v0.1 misread heading-borne and conjunctive requirements (5 openings); fixed in v0.2. v0.3 fixed "plus N years" as a preference cue (synthetic S27)
- **Open issues:** rules corrected on this same sample (no held-out check yet); no sponsorship or start-date wording in any captured posting; application-form questions not captured

## 2026-10-21 — synthetic fixtures, tests, Assignment 1 comparison, break attempts

- **Run by:** Claude
- **Inputs:** `fixtures/synthetic-cases.json` (29 invented); the Assignment 1 tool on the same 12 real observations (`runs/a1-tool-on-real-sample/a1-input.json`, labelled placeholder fit/timeline)
- **Outputs:** `runs/synthetic-v0.3/`; `runs/a1-tool-on-real-sample/reality-check.{json,md}`; evidence 08–12
- **Result:** tests 45/45 (Assignment 1 suite 18/18). Assignment 1 vs this mode: 11/12 next steps differ. Break: 3/3 mutants caught; real decisions changed 4 (feed ignored), 0 (no preference distinction), 5 (stack overrides experience). Control on unmutated HEAD 45/45. Run 1 harness artifact (worktrees in the temp dir) preserved and corrected
- **Human gates:** none cleared. G8 adequacy review, co-op-silence DEFINE, and routine-value DEFINE are open for Aditya
- **Open issues:** see the recipe's typed TODOs (6 open)

## 2026-10-21 — java-backend-early2027 v0.4 corrections (development; after Aditya's co-op clarification)

- **Recipe:** v0.4.0 → frozen at `4910036`
- **Run by:** Claude
- **Inputs:** same 12 development observations; 40 synthetic cases; test-only candidate variants under `search/examples/tariq-lindqvist/test-variants/`
- **Commands:** regression tests first on v0.3 (evidence 15: 2/17 regression tests and 45/56 existing tests passed); `triage.mjs run` full-text + replay + `compare` (evidence 16, 17)
- **Outputs:** `…/assignment-2/runs/real-replay-v0.4/`, `runs/synthetic-v0.4/`
- **Result:** 2 skip, 5 G4 review, 4 G2 review, 1 G3 review; full-text vs replay 0 differences; tests 74/74
- **Open issues:** rules corrected on the same 12 postings

## 2026-10-21 — java-backend-early2027 UNSEEN-posting evaluation (frozen v0.4.0)

- **Run by:** Claude
- **Inputs:** `HOLDOUT-PROTOCOL.md` (committed after the freeze, before selection); 6 postings at protocol positions 5–6 from the same raw capture; fresh feed fetch, page check, and probe 11:25–11:27 EDT; Claude-reviewed expectations committed before the run
- **Outputs:** `…/assignment-2/holdout/`, `runs/holdout-v0.4-first/` (**the** holdout result)
- **Result:** 4 requirement review, 2 liveness review; 40/48 check fields and 4/6 final steps agree with the expectations; no wrong skip; export-control clause missed on 2 Databricks postings (heading line), plus 2 vocabulary/precedence differences
- **Open issues:** 6 same-board postings cannot establish accuracy; the expectations were written by the rules' author

## 2026-10-21 — java-backend-early2027 v0.4.1 repairs (development)

- **Run by:** Claude
- **Inputs:** 12 development + 6 holdout observations (holdout now development evidence); synthetic 40
- **Outputs:** `runs/real-replay-v0.4.1/`, `runs/holdout-v0.4.1-dev-rerun/`, `runs/synthetic-v0.4.1/`; evidence 23–31
- **Result:** development 12: 4 eligibility review, 4 liveness review, 2 requirement review, 2 skip; holdout rerun 47/48 and 6/6 (development); tests 77/77; Assignment 1 suite 18/18; break test 6/6 mutants caught (real-sample changes 0/0/0/1/4/0), control 77/77; conformance 78 files; doctor OK; history PII scan clean; scope check clean
- **Human gates:** none cleared
- **Open issues:** application-form capture and the shared 403 patch deferred (typed TODOs); no untouched test of v0.4.1

## 2026-10-21 — java-backend-early2027 verification of the student's review block (Claude)

- **Recipe:** v0.4.1 (feature scope frozen by Aditya, FRICTIONAL E26)
- **Run by:** Claude — a verification that the copy-paste block prepared for Aditya works. **Not Aditya's run.**
- **Inputs:** HEAD `6488aab`; committed excerpts `…/real-sample/observations.json`; fictional candidate
- **Outputs:** a temporary directory only; summary saved as `…/assignment-2/evidence/33-review-block-claude-verification.txt`
- **Result:** tests 77/77; replay 2 skip · 4 eligibility · 4 liveness · 2 requirement; compare 0 differences; break harness 6/6 caught (changes 0/0/0/1/4/0); control 77/77; all exit codes 0; no tracked file changed by the block
- **Human gates:** none cleared

## 2026-10-21 — java-backend-early2027 live-page cross-check at submission time (Claude)

- **Run by:** Claude (read-only, no challenge bypass). **Not Aditya's check.**
- **Inputs:** https://stripe.com/jobs/search?gh_jid=8230952; two committed excerpts
- **Outputs:** `…/assignment-2/evidence/34-crosscheck-claude-submission-time.txt`
- **Result:** HTTP 200; final URL `…/careers/listing/senior-software-engineer-backend/8230952`; both excerpts present at 17:32 UTC; body length changed 6,129 → 6,376 characters since 15:41 UTC (what changed was not examined; both excerpts still present)
- **Human gates:** none cleared

## 2026-10-21 — java-backend-early2027 gate decision: SPECIFIED → RUNNABLE-SAMPLE

- **Gate:** report adequacy (recipe `[TODO APPROVE]`, the "audits generated and read" condition)
- **Cleared by:** Aditya Raj, 2026-10-21 (FRICTIONAL E30, verbatim statement)
- **What was judged:** `runs/real-replay-v0.4.1/triage.md`, `runs/holdout-v0.4-first/triage.md`, `runs/holdout-v0.4.1-dev-rerun/triage.md`, `runs/synthetic-v0.4.1/triage.md` — adequate for the decisions they support
- **Evidence for the other conditions:** sample runs complete (evidence 24, 32, 33); conformance passes (31)
- **Not cleared:** no posting-level review gate; RUNNABLE-LIVE not claimed; frontmatter `attestation` stays null (VERIFIED only)
- **Attestation:** WORKED-RUN.md, signed by Aditya Raj; every run row executed by Claude; Aditya did not personally re-run the commands
