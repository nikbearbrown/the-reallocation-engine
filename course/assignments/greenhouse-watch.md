# Assignment — Greenhouse Watch: New Jobs, Your Résumé, and What Claude Code Did

**Due:** Canvas · **Points:** 100 · **Course:** INFO 7375 · Fall 2026

Assignments follow the ten-day cadence published in Canvas. The syllabus's 10% daily late penalty applies.

Read the [course AI policy](../prerequisites/ai-policy.md) and watch [AI Policy for Professor Bear's Courses | Using AI Responsibly in Class](https://youtu.be/8Ut0Cdl6vMw?si=9w3aEpt1ZyAR4Kiz) before beginning graded work.

## Your task

Start with **the-reallocation-engine** (https://github.com/nikbearbrown/the-reallocation-engine). Build a recipe that watches one company's Greenhouse job board every day, reports only the jobs that are **new since the last check**, matches them against **your résumé as JSON**, shows **only the relevant ones**, and **justifies every job it shows**. Then explain the result in a rendered film using Brutalist's **cc-explainer** workflow: a film that shows not just what the recipe outputs, but exactly what Claude Code did to build it.

This is the **default recipe**. It is deliberately small. You may choose a more advanced non-default (see "Going beyond the default"), but every submission is graded on the same rubric, and the default done honestly beats an ambitious one that cannot be verified.

Work in your own fork or course-authorized repository, in the namespaces `CONTRIBUTING.md` assigns you. Your branch name must begin with `contrib/2026fa-`, for example `contrib/2026fa-maya-k-greenhouse-watch`. Do not push directly to the instructor's repository.

Claude Code assistance is expected. Use your Northeastern access; no purchased API credits or paid voice or media service is required (the film uses the free Kokoro voice, Liam in for Bear). You remain responsible for the implementation and must be able to explain the code, the matching scheme, the tests, the session, and the film.

## The default recipe

**Input.** One Greenhouse board, named by its slug. The public, unauthenticated endpoint is:

```
https://boards-api.greenhouse.io/v1/boards/<slug>/jobs               # id, title, location, absolute_url, first_published, updated_at
https://boards-api.greenhouse.io/v1/boards/<slug>/jobs?content=true  # adds the full posting text, departments, offices
```

Example: `airbnb`. Pick any company that posts on Greenhouse. The repo's `scripts/ats/providers/greenhouse.mjs` already resolves and allow-lists this URL; read it before writing your own fetch. This is the only network call the recipe makes. One fetch per run, and the raw response is saved as evidence.

**Daily check, new since last check.** The recipe keeps a small state file of the job ids it has already seen, with the timestamp of the last run. Each run reports the jobs whose `id` was not in the state file, then updates it. The first run is a baseline: it records every job and reports none as new. "Daily" means the command is idempotent and safe to run on a schedule; wiring it to cron, launchd, or a GitHub Action is optional and earns nothing on its own. You must demonstrate at least two runs with a real change between them (two calendar days, or a second run after seeding the state file from an earlier saved response, clearly labeled as such).

**Your résumé, as JSON.** The résumé MUST be JSON in the shape of `search/examples/<persona>/resume.example.json` (personal, education, experience with bullets, projects, skills). Your real résumé lives at `search/resume.json`, which is gitignored and must never be committed, force-added, or un-ignored. Everything on GitHub and everything on screen in the film uses one of the four fictional personas in `search/examples/` or a persona you invent with `@example.com` addresses and 555 phone numbers. Run it on your real résumé locally if you like; show a persona.

**The matching scheme is yours.** Design and document how a posting is judged relevant to a résumé. Rules over skills and titles, keyword overlap with weights, location and authorization filters, an embedding similarity, a bounded LLM judgment, or a combination. Whatever you choose, it must be written down before you build it, it must be explicit enough that a TA can predict its verdict on a given job, and any LLM judgment must be labeled as a judgment, never presented as a record (SNICKERDOODLE: never invent a count, rate, or confidence). Read `docs/search-profile-design.md` and `scripts/score/role-scorer.mjs` for how the engine already separates records, model judgments, and user inputs.

**Show only relevant jobs, and justify each one.** The human report lists only the new jobs your scheme judged relevant. Every listed job carries a justification that cites the specific résumé fields and the specific posting fields that produced the verdict. A job with no justification is a defect. The report also states how many new jobs were seen and how many were skipped, because skipping is the engine's point.

**Two outputs, two readers.** An agent-readable JSON run record (board, run time, jobs seen, new, relevant, skipped, state file path, raw response path, scheme version) and a human-readable Markdown report. One artifact cannot serve both readers.

**A reference implementation exists.** The repo ships the default as a Claude Code skill at `.claude/skills/greenhouse-watch/` (stored script, default scheme, tests, offline fixture). Say `greenhouse watch <slug>` in Claude Code and it runs. Watch the three-minute explainer of it first: [greenhouse-watch — Your Board, Your Call](https://youtu.be/Jr90_ldEH2A). You may build on it or start fresh, but the parts that are graded are the parts it deliberately leaves to you: your **scheme** replaces `scheme.default.json`, your **brief** documents it, your **justifications** come from your rules, and your **film** shows what Claude Code did when *you* directed it. Submitting the reference scheme unchanged earns nothing in the "Match and justify" row.

## 1. Predict

Before implementation, post your board slug and a one-line description of your matching scheme in the Canvas discussion thread. Then write a short brief in `CHANGE-BRIEF.md`:

- The board you chose and why. Roughly how many jobs it lists today and how often it changes (look at `first_published` and `updated_at`).
- Which persona you will demonstrate with, and the three or four résumé fields your scheme leans on most.
- Your matching scheme, written so a reader could apply it by hand to one posting: inputs, rules or weights, threshold, and what counts as a record versus a judgment.
- What "new since last check" means in your recipe: the key you diff on, how you treat a job whose `updated_at` changed but whose `id` did not, and what the first run does.
- At least two predicted failure cases (the API returns an error or an empty list, the state file is missing or corrupt, a posting has no content, a job is relevant by keywords but wrong by location or authorization) and how you will check each.
- At least one prediction about what Claude Code will do wrong or out of scope on the first pass.

Retain the original predictions. Add later revisions rather than rewriting the record to make every prediction look correct.

## 2. Build It

### Read the governing files first

`SNICKERDOODLE.md` (the constitution), `DOMAIN.md`, `CONTRIBUTING.md`, `DATA_CONTRACT.md` (Zero-Conditions), `search/examples/README.md`, `scripts/ats/providers/greenhouse.mjs`, and `docs/search-profile-design.md`. Confirm the toolchain with `npm install`, `npm run doctor`, and `npm run verify` before you touch anything.

### Implement the recipe

Your code lives at `scripts/contrib/2026fa/<handle>-greenhouse-watch/` in Python or JavaScript, with at least one test and any fixture it needs (a saved API response is a fine fixture). It must:

- fetch one board once per run, save the raw response under your folder, and refuse any host other than the Greenhouse allow-list;
- diff against the state file by job `id`, report new jobs, and update the state file only after a successful run;
- read the résumé from a path you pass in, validate that it is JSON in the example shape, and fail clearly if it is not;
- apply your documented scheme, emit the JSON run record and the Markdown report under your folder, and list only relevant jobs with a justification each;
- handle the failure cases in your brief without crashing and without inventing a value;
- pass `node scripts/conformance.mjs <your folder>`, your tests, and `npm run verify`.

Do not hardcode the expected verdicts. Do not weaken a rule to make a job you like pass. Do not scrape the company's website, fetch other ATS platforms, or call any endpoint outside the Greenhouse boards API.

### Write the recipe and card

Write `recipes/cases/2026fa/<handle>-greenhouse-watch.md` and its `.card.md` in the style of `recipes/scan.md`: purpose, source inventory, inputs, phase gates, steps, output contract, stop conditions, and a run-log template. The frontmatter `status` may not exceed `RUNNABLE-LIVE`, and `attestation` stays `null` unless a named human signed it. The gate that matters is the human one: the recipe produces a list, and a person decides whether any job is worth a day of their life.

### Work in inspectable increments, in a real session

The film is cut from the actual session, so run Claude Code headless with a locked tool list and keep every transcript in `evidence/`:

```
claude -p "<what you typed>" --output-format stream-json --verbose --max-turns 40 \
  --permission-mode acceptEdits \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(ls:*),Bash(cat:*),Bash(python3:*),Bash(node:*),Bash(npm:*),Bash(git:*),Bash(wc:*),Bash(curl:*)" \
  < /dev/null > evidence/turn1.jsonl
```

Use `--session-id` on the first turn and `--resume` on later ones. Ask Claude to propose a plan before editing, then implement one bounded change at a time. For example:

```
Read SNICKERDOODLE.md, DOMAIN.md, search/examples/README.md, and
scripts/ats/providers/greenhouse.mjs. Then read my CHANGE-BRIEF.md, which defines my
matching scheme. Propose the smallest plan for a script under
scripts/contrib/2026fa/<handle>-greenhouse-watch/ that fetches the <slug> board once,
diffs job ids against a state file, matches new jobs against a resume JSON in the
search/examples shape using my scheme exactly as written, and writes a JSON run record
plus a Markdown report listing only relevant jobs with a justification each. Include a
test that uses a saved API response as a fixture. Do not edit yet.
After I approve a step, implement only that step, show the diff, run the test and
node scripts/conformance.mjs on my folder, and tell me what a human still has to judge.
Do not touch any file outside my folder. Never read or write search/resume.json.
```

This is a prompt to Claude Code, not an installed shell command. You decide whether to accept the plan. After every run, verify with your own commands (`git diff --stat`, `wc`, your test, `cat` of the report) and keep those in the transcript. If Claude's scheme drifts from your brief, that is a correction cycle: record it, fix it, and keep the evidence.

## 3. Use It

Run the finished recipe yourself from a clean checkout of your branch. Record the actual result of each check in `TEST-REPORT.md`, with the commit hash, Node and Python versions, and operating system:

| Check | Evidence to collect |
|---|---|
| Toolchain baseline | `npm run doctor` and `npm run verify` output before and after your change. |
| Baseline run | First run on the board: jobs seen, zero reported as new, state file written. |
| Second run | A later run with a real change: which ids were new, and the raw responses that prove it. |
| Résumé validation | The persona résumé accepted; a malformed or non-JSON résumé rejected with a clear message. |
| Matching by hand | Three new jobs judged by you, by hand, from the brief; the script's verdicts agree, or you explain the disagreement. |
| Only relevant, all justified | The report lists only relevant jobs, each justification cites résumé and posting fields, and the skip count is stated. |
| Failure cases | Each predicted failure case exercised: the command, what happened, what the script emitted. |
| Scope and privacy | `git diff --stat` against `main` showing only your namespaced paths; `node scripts/pii-scan.mjs` clean. |
| Automated checks | Your tests and any failed or updated test, with an explanation. |

Do not delete a failing assertion or weaken an expected result merely to obtain a green report. Include at least one documented inspect-and-revise cycle based on an observation: a job your scheme got wrong, a diff that missed or double-counted, a justification that cited nothing. A session with no correction is a session you did not look at closely enough.

Write the run entry as `logs/runs/2026fa-<handle>-1.md` using the template in `recipes/_shared.md`. Never edit `logs/RUN_LOG.md`.

## 4. Ship It — source and explainer

### Make one required Brutalist cc-explainer

Use the course-provided Brutalist **cc-explainer** skill. Ask Claude Code to read the installed `SKILL.md` and follow it; do not assume the skill name is a standalone executable. If your checkout lacks the skill, request the course-provided version before proceeding.

Make one landscape film that:

- Identifies the repository, the board, the persona, and your matching scheme in one sentence each.
- Shows the actual session: what Claude read, what it wrote or changed, what it ran, and what **you** verified with your own command after each run. The VERIFY beat is your command, never Claude's own checkmark.
- Shows at least one correction cycle: a real failure and what changed to fix it.
- Shows the two runs and the diff: what was new, what was relevant, what was skipped, and one justification read aloud against the posting and the résumé.
- Ends its body on the human gate: the report is a list, and why the machine cannot decide which job is worth your day.
- Scores the agent's conduct (stayed in scope, followed the brief's scheme instead of inventing one, never touched `search/resume.json`) and states plainly what remained human work.
- States what you tested, what remains uncertain, and one concrete next improvement.
- Identifies human and AI contributions and the source revision being demonstrated.

Use the Claude cold open, the idea and definitions beats, the session loop, CONDUCT and HUMAN, then Verdict → Your Turn → regular outro. Liam, in for Bear, narrates; Teardown register; no model names, version numbers, or prices spoken. Every tool name, path, diff line, and output shown in the film must be traceable to `SESSION.md`, the trimmed verbatim transcript, and recorded in `FACTCHECK.md`. Label reconstructed views and held frames accurately. Do not invent output the session did not produce, and do not change the script solely to conceal a defect in the film.

Follow the skill's native rendering and quality checks, then watch the final export. Duration should follow the explanation; there is no minimum runtime to fill. A vertical Short, paid media generation, a paid voice, and public YouTube publication are not required.

The film is part of the 60-point implementation-and-explanation category below. It is not a fifth grading category and does not substitute for a working recipe.

### Post the version on GitHub

Your submitted branch includes:

- `scripts/contrib/2026fa/<handle>-greenhouse-watch/` — code, tests, fixtures (saved API responses), the state file from your demo runs, the JSON run records, and the Markdown reports.
- `recipes/cases/2026fa/<handle>-greenhouse-watch.md` and `.card.md`.
- `logs/runs/2026fa-<handle>-1.md`.
- `course/2026fa/submissions/<handle>/` — `README.md` (board, persona, scheme, run instructions, changes, known limitations, film link), `CHANGE-BRIEF.md`, `TEST-REPORT.md`, `FRICTIONAL.md`, `SOURCES.md`, and the film's `beat_sheet.json`, `SESSION.md`, `evidence/`, `FACTCHECK.md`, `BUILD-LOG.md`, and prompts.
- One open PR from `contrib/2026fa-<handle>-greenhouse-watch` with the PR template fully filled. CI checks every box.

Keep MP3, MP4, and files over 25 MB out of GitHub. Store them in the designated course media storage and link them from your README. Identify the exact film by filename and SHA-256 checksum so its version can be checked. Test reviewer access to the source and media.

No real résumé, email, phone, tracker, or contact anywhere in the branch's history. `search/resume.json` is never tracked. Fictional personas only. Deleting a file later does not remove it from history; the only fix is re-cutting the branch. CI scans the full branch diff.

Use commit messages that describe a meaningful change and its purpose or check. For example: `Diff by job id against state file; add empty-response test`. When useful, add a commit-body note distinguishing your decision from Claude's implementation. Commit count is not a measure of learning.

## 5. Verify and submit to Canvas

Run the recipe from a fresh clone of the revision you are submitting, against the saved fixture so the result is reproducible. Confirm the report, the tests, and `npm run verify` reproduce, and that the film depicts that revision. Do not treat a working local folder as proof that everything was posted.

Submit a source ZIP of that same GitHub revision, excluding caches, `node_modules`, credentials, `search/resume.json`, and large media, together with a short `SUBMISSION.md` containing:

```
Assignment: Greenhouse Watch — New Jobs, Your Résumé, and What Claude Code Did
Student:
GitHub handle:
Board slug:
Persona used on screen:
Matching scheme (one line):
Default or non-default (name it):
GitHub repository / branch / PR URL:
Submitted commit SHA:
Source revision shown in the film:
Node, Python, and operating system:
Final film URL and filename:
Final film SHA-256:
Summary of my changes:
Known limitations:
```

It is fine to render from a source commit and then make a final submission commit adding the film documentation. Identify both revisions and verify that the final commit does not change the demonstrated code. Put the final submitted SHA in the Canvas note; do not try to embed a commit's own SHA into that same commit.

Canvas, GitHub, and the film must refer to the same submitted work. Identify later changes as a new revision rather than silently replacing the submitted evidence.

## Going beyond the default

The default is the base example. You may substitute a non-default of equal or greater scope, graded on the same rubric. Say which one in your brief and in `SUBMISSION.md`. Examples:

- **Another ATS.** The same watch against a Lever or Ashby board using the repo's providers, or a board on Workday using `scripts/ats/scrapers/workday/`.
- **Several boards.** A `portals.yml` of five to ten companies, one state file per board, one combined report, with rate limiting and per-board failure isolation.
- **Liveness as a gate.** Run `npm run ats:liveness` on each relevant job and drop the dead ones before the report, with the gate logged.
- **A recipe step from the contract.** Implement one `[TODO: DEV]` step of an existing recipe in `recipes/` (for example `oferta` step 3, `scripts/gigo/oferta-validate-data-shape.py`) against `data/examples/` sample data, stopping at its phase gate. Claim the recipe and step number in the Canvas thread.
- **Scheme evaluation.** Two matching schemes on the same board and persona, a labeled set of thirty postings you judged by hand, and precision and recall for each scheme, honestly reported.

A non-default must still be runnable from a fresh clone, still use fictional personas on GitHub and on screen, still stay inside its declared network surface, and still end at a human gate.

## Rubric — 100 points

| Component | Points |
|---|---|
| Implementation and explanation | 60 |
| Frictional — honest log | 10 |
| GitHub version posting matching Canvas | 10 |
| Relative Quartile | 20 |
| **Total** | **100** |

### Implementation and explanation — 60 points

| Criterion | Points |
|---|---|
| Watch: fetches one board within the allow-list, saves the raw response, diffs by job id against a state file, baseline run reports nothing, second run reports the real change (10); state updated only on success, failure cases handled without crashing or inventing a value (5). | 15 |
| Match and justify: résumé is JSON in the example shape and validated (4); the scheme is written down before the build and applied as written, judgments labeled as judgments (6); the report shows only relevant jobs, every one justified by cited résumé and posting fields, skip count stated (10). | 20 |
| Verification: documented baseline and tests, `pii-scan` and `verify` clean (5); two real runs, three hand-judged jobs compared to the script, failure cases exercised with pasted output (5); evidence-based revision from the session and an honest limitation (5). | 15 |
| Brutalist cc-explainer: accurate account of what Claude Code did, traceable to `SESSION.md` (4); the session loop, a correction cycle, the two-run diff, and the human gate actually shown (3); conduct and human-work beats honest, limits stated (2); readable, audible final film using the required workflow (1). | 10 |
| **Subtotal** | **60** |

Award partial credit for demonstrated work within each criterion. Claims must be defensible; attractive presentation does not repair an incorrect explanation. A scheme that lists every job, or a justification that cites nothing, earns nothing in the second row.

### [Frictional](../prerequisites/frictional.md) — honest log — 10 points

In `FRICTIONAL.md`, record actual attempts, expectations, difficulties or checks, responses, and learning. Distinguish your work from the AI's work.

- 3 points: Specific, honest accounts of what you tried and what happened.
- 3 points: What you checked, changed, or learned in response, including unresolved questions.
- 2 points: Explicit human/AI contributions, including what you accepted, modified, or rejected.
- 2 points: Traceability to relevant commits, prompts, transcripts in `evidence/`, tests, or observations.

An unsuccessful attempt can earn full Frictional credit. More hours, more entries, or invented struggle do not earn extra credit. If something worked immediately, say so and explain how you checked it. Label retrospective notes honestly. AI may organize your notes; it must not manufacture experience or understanding.

### [GitHub version posting](../prerequisites/github-submission.md) matching Canvas — 10 points

- 4 points: Required, accessible source and documentation are actually posted in the assigned namespaces, with one open PR and CI green.
- 3 points: Canvas identifies the exact submitted commit and supplies the matching source files and clear run instructions.
- 3 points: Accessible film link, identified media version and checksum, and the film's beat sheet and `SESSION.md` correspond to the submitted source. No MP3, MP4, or `resume.json` in the repository.

### [Relative Quartile](../prerequisites/relative-quartile.md) — 20 points

Assigned after the instructor and TAs review the full comparison group. It compares specificity, the quality and honesty of the matching scheme, demonstrated understanding of the engine's record-versus-judgment rule, evidence, honesty about verification and about what the agent did, and professional communication. These are comparative considerations, not extra point categories.

Meeting the stated criteria can earn the other 80 points; it does not guarantee these 20 points. The course's announced comparison-group and tie/late-work rules govern placement. Production polish matters only as professional communication. A plain, precise explanation outranks a beautiful one that misrepresents the work. Choosing a non-default, paid-tool access, and simply using Brutalist earn no automatic comparative bonus.

## You must be able to explain it

Use `SOURCES.md` to credit the repository, its governing documents, the Greenhouse API, the persona data, collaborators, and tools. Describe what AI contributed to the code, the tests, the scheme, the recipe, the beat sheet, the visuals, and the narration, along with what you personally decided, checked, changed, or rejected.

The instructor or a TA may ask you to explain any part of your submission, including why any listed job was judged relevant and any beat of the film. Inability to explain reduces points under the relevant criteria. Misrepresenting authorship, verification, or what the agent actually did is an academic-integrity matter under the course AI policy video and the course/university policies.
