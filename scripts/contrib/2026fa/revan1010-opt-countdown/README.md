---
owner: revan1010
term: 2026fa
component: opt-countdown
status: DRAFT
promoted_to: null
---

# opt-countdown — prototype

## Executive summary

A small script that answers, for a student on year-1 OPT: *if a job takes this long to hire, does
it start before I run out of allowed unemployment days or OPT?* It computes a timeline number
from 0 to 1 from the student's own dates, puts it into each job on a list, and runs the engine's
existing scorer to get Apply / Consider / Skip, showing each job's decision before and after. It
runs on sample data only: a fictional persona and the book's example jobs. It is not legal advice.

Recipe: `recipes/cases/2026fa/revan1010-opt-countdown.md` (agent) and
`recipes/cases/2026fa/revan1010-opt-countdown.card.md` (human).

## Run it (from the repo root)

```bash
node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs --profile search/examples/priya-nair/profile.yml --roles data/examples/ch11-roles.json --as-of 2026-10-02 --lag-days 56 --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown --confirmed-by "<your name>"
```

Leave off `--confirmed-by` the first time: the script prints the inputs and stops (gate G-A, exit 3).
Check them, then rerun with your name.

Needs: Node 20+ and `npm install` (for `js-yaml`). No network, no Python, no `.venv`.

## Test it (offline)

```bash
node --test scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.test.mjs
```

14 tests: the formula against hand-worked dates, failure cases F-1 / F-2 / F-4, gate G-A, the
roles-folder overwrite guard, a full run through the real scorer (including F-3, the dead-link
role), gate G-B, and a `BROKEN-` fixture showing the scorer treats a missing timeline as 1.
Tests write only to the OS temp folder.

## Inputs and labels

| Input | From | Label |
|---|---|---|
| `--profile` | `visa.opt_end_date`, `unemployment_days_used`, `unemployment_ceiling`, `buffer_target` | record |
| `--roles` | a JSON array shaped like `data/examples/ch11-roles.json` | sponsorship/liveness: record · fit: model-judgment |
| `--as-of` | the date treated as today | your-input |
| `--lag-days` | days until a job would start (one value for every job) | your-input |
| computed timeline | the formula over the above | your-input |

## Outputs (all inside `--out-dir`)

| File | For |
|---|---|
| `opt-countdown-log.json` | agent: labeled inputs, dates, per-role before/after, gate states, scorer commands |
| `opt-countdown-report.md` | human: summary, input echo, dates, before/after table, pending checks |
| `roles-with-timeline.json` | the scorer input this script wrote |
| `role-scores.json`, `role-scores.md` | the existing scorer's output (after) |
| `before/role-scores.json`, `before/role-scores.md` | the existing scorer's output on the unmodified roles file |

## Exit codes

`0` ok · `2` invalid input (F-1 missing, F-2 wrong, F-4 no lag) · `3` stopped at G-A · `4` scorer failed

## Files

- `opt-countdown.mjs`: the script
- `opt-countdown.test.mjs`: offline tests
- `fixtures/roles-uncertain-liveness.json`: G-B case (liveness 0.5 and missing)
- `fixtures/BROKEN-roles-missing-timeline.json`: the role shape this script must never emit
