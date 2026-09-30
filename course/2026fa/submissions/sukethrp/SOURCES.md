# SOURCES — what this submission is built on, and who did what

## Executive summary

This file credits everything the submission uses: the engine and its governing documents, its data,
its code, the fictional personas and the tools. It also separates what the AI assistant (Claude Code)
contributed from what the student decided, checked and still has to do. Read it before asking
"who did this?" about any part of the work.

In short:
- **Claude Code** wrote the code, tests, recipe, card and documents, and ran every command recorded so far.
- **The student** chose the situation, the recipe direction, the persona approach and the permissions.
  They still have to review the drafted rules and numbers, make the gate decisions, re-run the checks,
  and write their own reflection and Frictional entries.

---

## Repository and governing documents

- *The Reallocation Engine* by Nik Bear Brown: `https://github.com/nikbearbrown/the-reallocation-engine`,
  forked to `sukethrp/the-reallocation-engine` at upstream `015843d` (2026-09-23). Code MIT, book CC BY 4.0.
- Read and followed: `SNICKERDOODLE.md` (lifecycle, gates, attestation format, executive-summary-first
  rule), `DOMAIN.md` (known gaps), `CONTRIBUTING.md` and `DATA_CONTRACT.md` (namespaces,
  zero-conditions, fictional personas), and `recipes/_shared.md` (log template).
- Style models: `recipes/scan.md`, `recipes/local-wage-adjustment.md`, `recipes/local-wage-adjustment.card.md`.
- Book chapters: `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (tiers; "verify role
  type matches filing history"; Unknown is not Avoid), `10-the-visa-timeline-manager.md`,
  `11-the-bayesian-role-scorer.md`.
- The assignment: INFO 7375 "The Reallocation Engine — Recipe Design Assignment", from the course
  repository `assignments/assignment-reallocation-engine-recipe-design.md` (upstream `009c53a`). Also the
  course AI policy and the Frictional, GitHub-posting and Relative-Quartile prerequisites.

## Data

| Data | Used for | Notes |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (80 Days to Stay, Humanitarians AI) | all sponsorship evidence | SHA-256 `eccdee2a…6270`, identical to the file its audits describe. Only non-personal columns are read |
| `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-*audit.md` | coverage and join limits | cited, not modified |
| Public Greenhouse / Ashby job boards, 2026-09-30 | worked-run postings | found with the engine's scanner; liveness checked with the engine's checker |
| SEC Form D samples, BLS/O\*NET compact table | not used | why is in the recipe's "Facts that bite" |

## Engine code reused (not copied)

`scripts/sec/entity-resolution.py` (`normalize_company_name`, imported) · `scripts/ats/liveness-core.mjs`
(`classifyLiveness`) · `scripts/ats/check-liveness.mjs` (live checks) · `scripts/score/role-scorer.mjs`
(through its CLI) · `scripts/ats/scan.mjs` (worked-run discovery only) · `js-yaml`.

## Personas (fictional)

- `search/examples/priya-nair/profile.yml` (existing) for the sample queue.
- `search/examples/arjun-rao/profile.yml` (new, profile only) for the worked run. It was added because no
  existing persona is pre-OPT, which is the recipe's situation. It uses @example.com and 555 details, as
  `DATA_CONTRACT.md` requires. No real person's data appears anywhere in this branch.

## Tools

Claude Code (Anthropic; model Claude Opus 5.5) in the Claude desktop app · Node 22.11 · Python 3.12.7
(and 3.9.6 for a compatibility run) · Playwright Chromium · git · GitHub CLI.

## Collaborators

None other than the AI assistant.

---

## What Claude Code contributed

Every item was done by Claude Code in one working session on 2026-09-29/30, on the student's machine.
Commits are on branch `contrib/2026fa-sukethrp-ml-newgrad-sponsor-match`.

- **Exploration.** Read the assignment and the repository. Ran the getting-started commands
  (`evidence/getting-started/`). Profiled the sponsorship file. Found the engine defects D1–D8 in
  `PROPOSED-ADDITIONS.md`, including the scorer's "work authorized" parsing and the red CI.
- **Change brief (`abdb8bf`, 20:51, before any code).** Wrote the situation description, gates and
  every prediction.
- **Prototype (`9864112` … `fe07d1b`).** Wrote all code (`sponsor_match.py`, `node_bridge.mjs`), the
  declared rules (`rules.json` v0.1.0 and v0.2.0), the fixtures and the 36 tests. Found and fixed the
  defects listed under "Broke during testing, fixed" in `TEST-REPORT.md`.
- **Rules v0.2.0 (`d421abe`).** Proposed the exclusions, the `founding` marker and the II/L2 level rule,
  from the v0.1.0 audit. *These are proposals: the student has not yet reviewed them.*
- **Recipe and card (`6410e7d`, updated in `c11999f`).** Wrote both, plus `PROPOSED-ADDITIONS.md`.
- **Worked run (`d3ef7be` and later).**
  - Wrote the discovery config and chose the eight postings across tiers.
  - Wrote the new persona.
  - **Proposed every fit and timeline number from the job titles only.**
  - Ran both live runs and the legal-name check.
- **Testing.** Ran the clean-checkout suite (`evidence/clean-checkout/`).
- **History rewrite.** Rewrote the unpushed branch history to remove a scanner false positive; see
  `TEST-REPORT.md`.
- **Documents.** Drafted `TEST-REPORT.md`, `WORKED-RUN.md` (including its run analysis and the unsigned
  attestation draft), `DOMAIN-JUSTIFICATION.md` (including the time-saved *estimate*), this file, the
  run-log entry and the scaffold of `FRICTIONAL.md`.
- **No model at runtime.** No AI model is called by the prototype. Claude's role was authoring and
  operating, not being a data source. No value in any report is a model judgment.

## What the student decided (session of 2026-09-29, Eastern time)

Each was a choice among options Claude presented. Where Claude recommended an option, that is noted.

| When (approx.) | Decision |
|---|---|
| 20:30 | asked Claude to read the assignment, create `Assignment 3/`, and start |
| 20:45 | target role family: **ML/AI engineer**, and the situation the recipe is built for (described in the recipe; no personal details are recorded here) |
| 20:45 | recipe direction: **role-level sponsor match**. Claude recommended it over OPT countdown, a combined version, and cognitive fit |
| 20:45 | allowed: forking to `sukethrp`, installing Playwright Chromium, live posting checks. Pushes and the PR still need a separate yes |
| 20:50 | allowed local commits as work proceeds. Chose "build now, review the predictions later" over adding a prediction first |
| 21:25 | chose a **new matching persona** (Claude recommended it) over reusing Priya Nair |
| 21:25 | chose to use **Claude's proposed fit and timeline values, to review later**, over typing their own |

## Still to be done by the student (before submission)

- Review the change brief's predictions. Add a dated revision if you disagree or have your own.
- Decide the title rules. Keep, change or reject v0.2.0, especially the II/L2 rule.
- Review each fit and timeline number against the actual posting. If any changes, re-run.
- Read the sample report and the rules audit. That reading is what moves the recipe from SPECIFIED to
  RUNNABLE-SAMPLE, recorded in the run log.
- Fill in the decision table (gate G8) in `WORKED-RUN.md`.
- Re-run the tests and the sample run yourself, then sign the attestation.
- Write your own reflection in `WORKED-RUN.md` and your entries in `FRICTIONAL.md`.
- Prepare the five-minute presentation: run the prototype live and name one limitation.

## What the student checked, changed or rejected

*To be written by the student.*
