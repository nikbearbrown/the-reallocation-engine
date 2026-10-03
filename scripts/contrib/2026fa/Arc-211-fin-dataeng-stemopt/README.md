---
owner: Arc-211
term: 2026fa
component: fin-dataeng-stemopt
status: DRAFT
promoted_to: null
---

# Finance data-engineering triage (STEM-OPT) — prototype

## Executive summary

This is a small program that helps an international master's graduate on the STEM work
extension decide which finance employers are worth an application for a data-engineering
or business-intelligence job. It reads the repository's own records — past visa
sponsorship, the job titles each company sponsored, pay levels, and funding — checks them
against the student's visa calendar, and sorts each employer into "tailor an application",
"network into the company", "check the posting by hand first", or "skip". Every number it
prints says whether it came from a record, from a rule-based judgment, or from the
student's own settings. It never goes online, and it never invents a value for missing
data — missing stays missing.

## Run it

From the repo root (Node 20+; no install beyond the repo's `npm install`):

```bash
node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs
```

Optional flags: `--as-of YYYY-MM-DD` (default: today), `--config <file>` (default:
`config.json` in this folder), `--out-dir <dir>` (default from config:
`course/2026fa/submissions/Arc-211/runs/triage`).

Test (offline, fixtures only, uses the real scorer):

```bash
node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs
```

## What it reads and writes

| | Path | Label |
|---|---|---|
| reads | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | record |
| reads | `data/bls/compact/soc_occupation_compact.csv` | record |
| reads | `data/sec/form-d/processed/sample/*.sample.json` (50 rows/quarter only) | record |
| reads | `course/2026fa/submissions/Arc-211/inputs/liveness.json` — hand-transcribed `npm run ats:liveness` results | record (transcribed) |
| reads | `course/2026fa/submissions/Arc-211/inputs/everify.json` — manual E-Verify lookups | your-input |
| reads | `config.json` — dates, floor, filters, tier rule | your-input |
| runs | `scripts/score/role-scorer.mjs` (the existing scorer, unmodified) | — |
| writes | `<out-dir>/triage-log.json` (agent), `<out-dir>/triage-report.md` (person), `<out-dir>/roles.json`, `<out-dir>/role-scores.{json,md}` | — |

## Decisions built in

- **Unchecked liveness is never sent to the scorer.** The scorer treats a missing liveness
  as 1.0 labeled `record`; this tool routes those roles to `check-posting-by-hand` instead.
- **Blank H-1B fields mean unknown, not zero.** Those companies are counted, never scored.
- **The $90k floor is a pre-filter, not a vote**, because the scorer's role-quality weight is 0.
- **Funding is context only** — the scorer has no funding term.
- **E-Verify** has no data source in the repo (`[TODO: DATA SOURCE]`); `unknown` blocks
  `tailor-application` and becomes `verify-everify-then-tailor`.

## Exit codes

`0` ok · `2` missing/invalid input (nothing written) · `3` none of the target SOC codes exist in the BLS file.

## Fixtures

`fixtures/companies.csv` and `fixtures/*.json` are fictional companies. `fixtures/bls.csv`
holds two rows copied verbatim from the repo's BLS compact file.
