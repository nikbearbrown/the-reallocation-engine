# SOURCES — what this submission is built on, and who did what

## Executive summary

This file credits everything the submission uses: the engine and its governing documents, its data,
its code, the fictional personas and the tools. It also separates what the AI assistant (Claude Code)
contributed from what the student decided, checked and still has to do. Read it before asking
"who did this?" about any part of the work.

In short:
- **Claude Code** wrote the code, tests, recipe, card and documents, and ran the original commands. Codex performed the later review and reruns described below.
- **The student** chose the situation, the recipe direction, the persona approach and the permissions.
  On 2026-10-02 they read the audits, kept the title rules, held all eight postings, and wrote their
  reflection and Frictional entries. The same day they re-ran the tests, the sample, a break attempt and
  the CSV comparison in their own terminal, and signed the attestation. Later corrections to the recipe
  and card voided that signature. They then re-ran the checks from a fresh clone of the corrected commit,
  capturing the break's exit code (1), and their new signature is pending.

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

Claude Code (Anthropic; model Claude Opus 5.5) in the Claude desktop app · Codex (OpenAI), for the
2026-09-30 posting review · Node 22.11 · Python 3.12.7 (and 3.9.6 for a compatibility run) · Playwright
Chromium · git · GitHub CLI.

## Collaborators

AI assistance from Claude Code during the original work and Codex during the follow-up review.

---

## What Claude Code contributed

Unless dated otherwise, every item was done by Claude Code in one working session on 2026-09-29/30, on
the student's machine.
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
  from the v0.1.0 audit. *These were proposals. The student reviewed them on 2026-10-02 and kept all
  three.*
- **Recipe and card (`6410e7d`, updated in `c11999f`).** Wrote both, plus `PROPOSED-ADDITIONS.md`.
- **Worked run (`d3ef7be` and later).**
  - Wrote the discovery config and chose the eight postings across tiers.
  - Wrote the new persona.
  - **Proposed every fit and timeline number from the job titles only.**
  - Ran both live runs and the legal-name check.
- **Testing.** Ran the clean-checkout suite (`evidence/clean-checkout/`).
- **History rewrite.** Rewrote the unpushed branch history to remove a scanner false positive; see
  `TEST-REPORT.md`.
- **Documents.** Drafted `TEST-REPORT.md`, `WORKED-RUN.md` (including its run analysis and the
  attestation draft, which the student later signed), `DOMAIN-JUSTIFICATION.md` (including the
  time-saved *estimate*), this file, the run-log entry and the scaffold of `FRICTIONAL.md`.
- **Recording the student's work, 2026-10-02 (`7a45c7a`, `d1110ea`, `d9f9357` and the signing commit).**
  - Entered the student's decisions in the decision table, condensing their statement in chat into each row.
  - Placed their reflection, Frictional entries and SOURCES text verbatim.
  - Saved their re-run output, with shell prompts and personal CSV columns removed.
  - Typed their signature into the attestation when they asked for it.
- **Recipe and card corrections, 2026-10-02 (editorial).** Applied after a rubric review, with the student's
  approval:
  - the persona rows and the handoff condition for an all-held run;
  - a typed proposals table and the skip-norm and D9 notes;
  - the card trimmed to about one page, with "11 companies" corrected to 6.

  No code changed. The edit voided the attestation, as the repo's rules require.
- **No model at runtime.** No AI model is called by the prototype. Claude's role was authoring and
  operating, not being a data source.
  - **One exception.** The fit and timeline numbers in runs 1–2 were Claude's proposals. The prototype
    labeled them `your-input` because they were declared in the queue. By the weakest-label rule they are
    model judgments, and so are the composites built on them (defect D9 in `PROPOSED-ADDITIONS.md`).
  - Run 3 withdrew those numbers. Codex's later fit proposals are labeled `model-judgment` and were never
    scored.

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
| 2026-10-02 | reported reading the sample report, the title-rules audit (v0.2.0) and the posting review. Recorded as the gate that moves the recipe to RUNNABLE-SAMPLE. Later that day they confirmed it in their own words, naming what they noticed in each document (below) |
| 2026-10-02 | title rules: **kept all three v0.2.0 choices**, because “II/L2 titles do not establish new-grad sponsorship, non-engineering AI titles do not establish ML/AI engineering sponsorship, and Founding is a conservative seniority flag rather than proof of experience.” `rules.json` itself still says "the student has not yet reviewed it" and "declared_by: the student". Both notes are out of date: Claude Code drafted the rules, and the student reviewed and kept them on this date. The file is left byte-identical so that the rules hash every run recorded still matches |
| 2026-10-02 | the eight postings: **all held**, Scale AI investigated first: “Keep all eight postings held because the available evidence does not support defensible fit and timeline numbers; investigate Scale AI first because its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed.” Recorded row by row in the decision table |
| 2026-10-02 | re-ran four checks in their own terminal (`TEST-REPORT.md` → "Student re-run") and **signed the attestation** in `WORKED-RUN.md` |

## Still to be done by the student (before submission)

- ~~Review the change brief's predictions.~~ Done 2026-10-02: the student's revision is at the end of `CHANGE-BRIEF.md`.
- ~~Decide the title rules.~~ Done 2026-10-02: kept v0.2.0 (see the decisions above).
- ~~Review each fit and timeline number.~~ Done 2026-10-02: all eight kept held, so no run 4.
- ~~Read the sample report and the rules audit.~~ Done 2026-10-02, recorded in the run log and confirmed in the
  student's own words above. The recipe is now RUNNABLE-SAMPLE.
- ~~Fill in the decision table (gate G8).~~ Recorded 2026-10-02 from the student's decision. Refine any row for a posting-specific reason.
- ~~Re-run the tests and the sample run yourself, then sign the attestation.~~ Done 2026-10-02: the re-run is
  recorded in `TEST-REPORT.md`.
- ~~Re-run from a fresh clone of the corrected commit~~ (done 2026-10-02, `c7eb748`, exit code captured), **and
  sign again.** The recipe and card corrections of 2026-10-02 voided the first signature.
- ~~Write your own reflection in `WORKED-RUN.md` and your entries in `FRICTIONAL.md`.~~ Done 2026-10-02: a revised
  reflection and three Frictional entries.
- Prepare the five-minute presentation: run the prototype live and name one limitation.

## Codex follow-up contribution — 2026-09-30 UTC

Codex read the saved sample and rules audit, opened all eight original employer links, read seven Greenhouse postings through their public board API and OpenAI’s public embedded posting data, and prepared `POSTING-REVIEW.md`. Posting URLs, retrieval URLs, timestamps, brief excerpts and text hashes are in `evidence/codex-review-2026-09-30/posting-review.json`. These are employer sources; cached third-party job summaries were not used to assign the review proposals.

Codex recommended keeping the existing title rules, removed unsupported fit/timeline scorer inputs (Claude later moved its edited queue to `worked-run/queue-live-3-reviewed.json` and restored the original `queue-live-1.json`, so each run's recorded input still matches its file), and saved numeric fit proposals as **model judgments in review metadata only**. It executed the third run, 36 offline tests, the sample, a new rules audit and a deliberate wrong-hash break. It checked AppLovin’s source row and prepared a presentation rehearsal guide (kept outside this repository). The final verification files record the actual outcomes.

Codex also organized the factual Frictional follow-up and a reflection draft after Suketh requested a natural draft. The draft is kept outside this repository, and the reflection section is left for the student. These are disclosed AI contributions. The prototype itself still calls no AI model. Its `your-input` label identifies declared configuration and should not be read as proof that Suketh authored or approved the earlier Claude-drafted values. The later AI fit proposals are not scored.

## What the student checked, changed or rejected

**Status, 2026-09-30 UTC:** Suketh requested this review and a natural draft. No statement of personally reading the audits, checking the postings or CSV, running commands, or accepting specific rules or ratings was supplied in this task. No such actions are attributed to the student.

**Update, 2026-10-02:** the student reported reading the sample report, the rules audit and the posting
review, and gave these decisions in their own words:

- **Accepted** the title rules v0.2.0 as drafted: “II/L2 titles do not establish new-grad sponsorship, non-engineering AI titles do not establish ML/AI engineering sponsorship, and Founding is a conservative seniority flag rather than proof of experience.”
- **Rejected** scoring any of the eight postings for now: “Keep all eight postings held because the available evidence does not support defensible fit and timeline numbers; investigate Scale AI first because its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed.”

**In the student's words (2026-10-02):** I retained the three v0.2.0 title-rule choices and rejected supplying unsupported fit and timeline numbers for the eight postings. My contribution was reviewing the reasoning and selecting those decisions; file inspection and earlier technical checks were performed by AI assistants, and my own command rerun and CSV comparison remain pending.

**The student's later update (verbatim):** 2026-10-02 — I have now completed the command rerun and CSV comparison, so the earlier statements that these checks were pending are out of date.

**Reading confirmation, in the student's words (2026-10-02):**
- Sample report: I read the report and noticed that RESOLVE roles are held for missing evidence, while TAILOR, NETWORK-FIRST, CONSIDER and SKIP are suggestions; the evidence table also separates source records from declared inputs.
- Rules audit: I read the audit and noticed that II/L2 titles and non-engineering AI titles cannot establish the strict unmarked ML/AI sponsorship signal, while even an unmarked title does not prove a new-grad hire.
- Posting review: I read all eight rows and noticed that several relevant-looking titles concealed experience requirements or explicit new-grad exclusions, and none supplied a confirmed employment start date.

**Sources update, in the student's words (2026-10-02):** I checked the saved reports against my rerun output and compared AppLovin’s source line with the reported sponsorship fields. The tests passed, the sample reproduced its recorded counts and the broken authorization profile produced VOID; its process exit code was not captured in my transcript.

**Timing estimate, in the student's words (2026-10-02):** I have not timed individual H-1B lookups, so the time-saving figure remains an estimate rather than a measured result.

**To complete in the student’s own words:** Name one result you checked, describe what you compared it against, and state one rule or recommendation you accepted, changed or rejected with your reason and date. Record the actual command and result after your own rerun. The AI-authored reflection and factual work log are preparation material, not substitutes for these personal statements.

*Status, 2026-10-02 (Claude Code):* answered by the student's texts above:
- the rule decisions and their reasons;
- the reading confirmation;
- the sources update, which names the result they checked (AppLovin's CSV line) and what they compared it
  against (the report's sponsorship fields).

The commands and the raw output are in `TEST-REPORT.md` → "Student re-run" and in
`evidence/student-rerun-2026-10-02/terminal.txt`.
