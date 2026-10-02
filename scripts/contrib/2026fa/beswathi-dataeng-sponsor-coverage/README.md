# dataeng-sponsor-coverage — prototype

**Recipe:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md`
**Card:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.card.md`
**Lifecycle claimed:** `RUNNABLE-SAMPLE`

## One command (from the repo root)

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
  --out-dir course/2026fa/submissions/beswathi/runs \
  --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
  --home-state MA --today 2026-10-02
```

Then score with the repository's own scorer — this prototype does **not** contain a
copy of it:

```bash
npm run score -- course/2026fa/submissions/beswathi/runs/dataeng-roles.json \
  --out-dir course/2026fa/submissions/beswathi/runs
```

## Offline test (no network, fixtures only)

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py
```

64 checks across 13 tests. Reads only `fixtures/`, never the 6.4 MB repo CSV, and makes no
network calls.

## Regenerating the liveness ledger

Gate G3 needs a liveness verdict per posting. `npm run ats:liveness` gets one by
driving Playwright at a live board, which a test cannot do. This regenerates the
ledger offline by calling the repository's own pure classifier
(`classifyLiveness` in `scripts/ats/liveness-core.mjs`) over saved page captures:

```bash
node scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/liveness_from_fixtures.mjs
```

Hosts contacted: **none**.

## What this reads and writes

| | Path | Label |
|---|---|---|
| reads | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `record` |
| reads | `data/bls/compact/soc_occupation_compact.csv` | `record` |
| reads | `fixtures/liveness-ledger.json` | `record` over a fixture capture |
| writes | `<out-dir>/dataeng-roles.json` | agent output — scorer input |
| writes | `<out-dir>/dataeng-sponsor-coverage.md` | human report |
| writes | `<out-dir>/dataeng-coverage-full.json` | all four buckets, for audit |

Nothing is written outside `--out-dir`. No tracked repo file is overwritten.

## The one idea

A blank `Total Approvals` cell is **not** a zero. In the 30,369-row CSV only
1,552 companies (5.1%) carry any H-1B record at all, so a tool that reads blank
as "does not sponsor" discards 94.9% of the market for the wrong reason.

This prototype emits three sponsorship states, never two:

| State | Condition | What it means | Where it goes |
|---|---|---|---|
| `record-positive` | approvals > 0 | sponsored before, on record | the 2 applying hours |
| `record-negative` | approvals 0, denials > 0 | tried and was refused | skip, with a reason |
| `no-record` | both cells blank | **unknown**, not negative | the 3 networking hours |

A `no-record` company carries **no** `sponsorship.p` at all — it is routed out of
the scorer rather than given a fabricated number, because the scorer's input
contract has no way to express "unknown".

## Known limits

- Liveness verdicts come from fixture captures, not a live fetch. `RUNNABLE-SAMPLE`.
- `fit` is a fixed 0.8 `model-judgment` over a recorded title string; it is not a
  résumé match.
- Role quality is reported in the human report only. `role-scorer.mjs` sets
  `role_quality: 0.0` (`[VERIFY]`), so feeding SOC data to it would change nothing.
- The OPT dates and the 75-day hiring lag are `your-input` assumptions, not records.
