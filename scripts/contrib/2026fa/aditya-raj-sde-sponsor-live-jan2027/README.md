---
owner: aditya-raj-sde
term: 2026fa
component: sponsor-live-jan2027
status: sample          # runs on the shipped sample data and fixtures only
promoted_to: null
---

# sponsor-live-jan2027 — Sponsor & Posting Reality Check (prototype)

## Executive summary

This folder holds a small program for one decision an international engineering candidate faces
before tailoring an application: is this posting still open, and is there real sponsorship evidence
for **this specific opening**, as opposed to the company's past record?

- It reads the repository's own sponsorship data and job-page snapshots.
- It reuses the repository's posting checker and role scorer without copying them.
- It ends every opening at a plain next step for a person: skip, check liveness, look for
  sponsorship evidence, read an offer excerpt, or supply timing.
- It never turns company history into a sponsorship score, never lets a score override an opening
  that refuses sponsorship, and never claims a start date was checked.

The public sample uses the fictional persona Aarav Patel and mostly synthetic postings.

## Contents

| File | What it is |
|---|---|
| `reality-check.mjs` | the prototype; implements the contract in `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md` |
| `hypothesis-probe.mjs` | records what the maintained scorer (F1a) and liveness classifier (F2a) actually do, next to the predictions; never fails on a wrong prediction |
| `reality-check.test.mjs` | offline tests of the prototype's intended behavior (F1b, F2b, F3, timing, labels, input validation) |
| `fixtures/` | sample input (`sample-run.json`) and test fixtures; `synthetic: true` marks invented postings (all on `example.com`) |

## Setup (from a clean clone, repository root)

```bash
npm install                      # Node 20+; installs the repo's dependencies
git restore package-lock.json    # npm install rewrites lockfile metadata; keep it out of any PR
```

The prototype, tests, and probe need no Python, no browser, and no network.

## Run (the one documented command)

```bash
node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs \
  --input scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json \
  --out-dir course/2026fa/submissions/aditya-raj-sde/runs/sample
```

This writes:

- `reality-check.json`, the agent log;
- `reality-check.md`, the human report.

On the scenario path it also writes the maintained scorer's `roles.json`, `role-scores.json`, and
`role-scores.md`.

`--out-dir` must be inside `course/2026fa/submissions/aditya-raj-sde/runs/` or the system temp
directory; anything else is refused. Exit codes:

- `0` = outputs written;
- `2` = invalid input, CSV, or output location, with nothing written.

## Test and probe

```bash
node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs
node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/hypothesis-probe.mjs
node scripts/conformance.mjs scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/
```

## Labels

Every output value carries one of three labels:

- `record`: from the sponsorship CSV, a recorded observation of a real posting with an evidence
  file, or the maintained classifier on a recorded snapshot of a real page.
- `model-judgment`: a rule applied to posting text (the sponsorship wording and closure wording
  rules).
- `your-input`: a stated sample value or assumption (fit, timing, scenario vote, pinned employer row,
  fixture liveness values), or anything derived from an invented posting, marked `synthetic-derived`.

## What it cannot do

- It cannot say whether an opening will be sponsored.
- It cannot say whether a posting is open now; snapshots are point-in-time.
- It cannot catch wording outside its vocabulary, or tell whether two similarly named employers are
  the same organization.
- It does not check start-date compatibility or fit.

See the recipe's "What it cannot verify".

## Credits

Built on `nikbearbrown/the-reallocation-engine`. It reuses `scripts/ats/liveness-core.mjs` (imported)
and `scripts/score/role-scorer.mjs` (CLI), and reads the shipped 80 Days to Stay sponsorship CSV.
Design decisions: Aditya Raj. Code drafted by Claude (Claude Code); see
`course/2026fa/submissions/aditya-raj-sde/SOURCES.md`.
