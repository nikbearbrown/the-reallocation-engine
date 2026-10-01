---
owner: omraut888
term: 2026fa
component: ml-h1b-timeline
status: DRAFT
promoted_to: null
---

# ml-h1b-timeline — role builder for ML/RAG H-1B triage on an OPT clock

This folder turns the engine's sponsorship records and a student's own visa dates into role records the Bayesian Role Scorer can score. It is a working prototype: it runs, its tests pass, and on the real data it currently recommends skipping none of the 183 companies it scores. The card explains why, and why its rankings shouldn't be trusted yet.

## What's here

| File | What it is |
|---|---|
| `build_roles.py` | Reads the 80 Days to Stay sponsorship CSV and the Priya Nair persona; writes `roles.json` (scorer input) and `build-audit.json` (counts, skips, every assumption). No network access. |
| `test_build_roles.py` | Self-running harness, 19 tests, exits 0/1. Drives the scorer through its CLI, since `role-scorer.mjs` exports nothing. |
| `fixtures/sponsorship-sample.csv` | Six fictional companies covering each filter, skip and tier path. The tests never read the real CSV. |

## Run it

```bash
python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --out /tmp/ml-h1b
npm run score -- /tmp/ml-h1b/roles.json --out-dir /tmp/ml-h1b
python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py
```

Expected: `built 183 roles from 1557 H-1B rows`, then `Apply 87 · Consider 96 · Skip 0 (skip 0%)`, then `Ran 19 tests … OK`. Requires Python 3 with PyYAML and Node 18+. Contribution tools get no `package.json` script.

## Read next

- Human card: [`recipes/cases/2026fa/omraut888-ml-h1b-timeline.card.md`](../../../../recipes/cases/2026fa/omraut888-ml-h1b-timeline.card.md)
- Agent recipe: [`recipes/cases/2026fa/omraut888-ml-h1b-timeline.md`](../../../../recipes/cases/2026fa/omraut888-ml-h1b-timeline.md)
- Change brief and first-run finding: [`course/2026fa/submissions/omraut888/CHANGE-BRIEF.md`](../../../../course/2026fa/submissions/omraut888/CHANGE-BRIEF.md)
