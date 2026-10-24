# Sources and attribution — Assignment 2 (Mode Build)

## Executive summary

This page credits every starting point, reused component, and data source behind the Assignment 2
mode, and states plainly who did what: the student (Aditya Raj) or the AI coding agent (Claude).
Read it to judge whose decisions and whose work each part reflects. In short: Aditya set the
scope, made the design decisions, and supplied the prediction under test. Claude wrote and ran the
code, tests, protocols, documents, and evidence on Aditya's instruction. Aditya's own runs, review,
reflection, and attestation are recorded only where Aditya supplied them.

## Starting points and reused components

| Source | What was used | How |
|---|---|---|
| Assignment 1 by the same student: `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md`, `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs` (PR #45, graded commit `1a618e7`) | `companyKey`, `loadSponsorCsv`, `matchCompany`, `classifyVacancy`, `evaluateLiveness`, `ContractError` | imported unchanged; Assignment 1 files untouched |
| `nikbearbrown/the-reallocation-engine` maintainers | `.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py` (board capture), `scripts/ats/providers/_http.mjs` (`fetchJson`), `scripts/ats/check-liveness.mjs` / `liveness-core.mjs` (`npm run ats:liveness`), `scripts/pii-scan.mjs`, `scripts/conformance.mjs`, `scripts/doctor.mjs` | called or imported, never copied |
| 80 Days to Stay data (repository `data/80-days-to-stay/`) | `mapped_student_employment_targets_v3.csv`: company name and sponsorship count columns only | employer order for sampling; company context; phone/executive columns never loaded |
| Greenhouse public Job Board API | postings of Databricks, Pinterest, Stripe captured 2026-10-21 | raw responses kept in gitignored `private/`; only short quoted lines committed |
| Employer career pages | page checks and HTTP status/title/length | point-in-time observations; no challenge bypassed |
| Course materials (INFO 7375): the Assignment 2 PDF, `prerequisites/frictional.md`, `ai-policy.md`, `github-submission.md`, `relative-quartile.md` | requirements and logging rules | followed; conflicts with the repository contract documented in `README.md` |

## Who did what

| Part | Aditya Raj | Claude (Claude Code, `claude-opus-5-5`) |
|---|---|---|
| Scope, situation, persona parameters, co-op rule (E03, clarified E14), date/range/ASAP rules, sample and holdout requirements, deferrals, heuristics, lifecycle target, PR strategy | **decided** | proposed options and recorded the decisions |
| Prediction under test (E03) and replication prediction (E26) | **supplied** | recorded verbatim |
| Code (`collect`, `holdout`, `triage`, `checks`, `text`, probes, `break-test`), tests, fixtures, mutants | — | wrote and ran |
| Sample and holdout protocols, expectations for the unseen postings | requirements set by Aditya | wrote; the expectations are Claude-reviewed, not human-validated |
| Recipe, card, justification, worked run, review packet, README, demo plan, PR draft, Frictional entries for Claude's actions | — | drafted |
| Conservative heuristics and deferrals approved (E26, E28) | **approved** | recorded |
| Interpretation and learning (E28) | **supplied** (quoted verbatim in WORKED-RUN) | recorded |
| Live-page cross-check (evidence 29, 34), review-block execution (33), all verification runs | not performed by Aditya (optional) | **executed and checked** |
| Report adequacy, attestation signature, publication approval | **given 2026-10-21 (E30)** | — |
