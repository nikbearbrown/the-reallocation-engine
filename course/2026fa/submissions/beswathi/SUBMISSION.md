# Submission — Recipe Design Assignment

- **Assignment:** The Reallocation Engine — Recipe Design Assignment
- **Student:** Swathi Baba Eswarappa
- **GitHub handle:** `BESWATHI`
- **Domain / situation:** F-1 international master's student (Northeastern, Boston), under one year of experience, targeting data engineer / data analyst / data scientist / machine learning engineer / AI engineer / BI engineer roles. I-20 ends 2026-12-15; planned OPT start 2027-01-15; 90 days permitted unemployment. Open to relocation inside the US and to remote work.
- **Recipe path:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md` (card: `….card.md`)
- **Prototype command:**
  ```bash
  python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
    --home-state MA \
    --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
    --out-dir course/2026fa/submissions/beswathi/runs
  ```
- **GitHub repository:** `nikbearbrown/the-reallocation-engine`
- **Fork:** `BESWATHI/the-reallocation-engine`
- **Branch:** `contrib/2026fa-beswathi-dataeng-sponsor-coverage`
- **PR URL:** https://github.com/nikbearbrown/the-reallocation-engine/pull/6
- **Submitted commit SHA:** `75400d30df5cba83229fafcc72d16ca149f48566`
  <br>(This file records that SHA, so the commit that *contains* this line is its
  child — `git log -2` on the branch shows both. The ZIP is built from the child.)
- **Lifecycle stage claimed:** `RUNNABLE-SAMPLE` (v0.2.0) — G3 is **not** cleared, so `RUNNABLE-LIVE` is not claimed

## Summary of my changes

A recipe and prototype that classify sponsorship evidence into **three** states
instead of two, and turn the resulting silence into a usable prior.

- Three-state classification: `record-positive` / `record-negative` / `no-record`. A
  `no-record` company carries **no** probability at all.
- Funding-stage base rates computed over all 30,369 rows at runtime, never hardcoded
  (Pre-Seed 1.4% → Series D+ 25.6%); stages below n=100 get no rate rather than a
  noisy one.
- Seniority filter: 101 companies sponsor data titles only at senior/staff/lead level
  and are recorded with a reason rather than dropped.
- Geography reported and never scored, with a test asserting `--home-state` changes
  no scoring factor.
- Requisition ids stripped from 21 title cells, row kept, every edit reported.
- G3 liveness and G4 timeline as gates: absent evidence means **unscored**, and the
  G4 hard stop returns exit 2 so a chained `&& npm run score` halts.
- 67 checks in 14 tests, offline, fixtures only.

**Run result:** 30,369 rows → 8 scored → `Apply 2 · Consider 0 · Skip 6` (75% skip),
126 companies explicitly unscored for want of liveness evidence.

## Known limitations

- **G3 is not cleared for anything.** All 8 liveness verdicts come from saved page
  captures classified by the repo's own `classifyLiveness`, labelled
  `record (classifyLiveness) over fixture capture`. `Apply 2` is a property of a
  fixture ledger, not evidence that two jobs are open today.
- **A base rate is not a prediction** about any single company, and this file holds
  companies someone already chose to map — the rates describe the file, not the economy.
- **The 75-day hiring lag driving G4 is assumed.** Nothing measured it. It is the
  weakest input in the recipe and can zero every role.
- **`fit` is a constant 0.8 `model-judgment`** — it carries no information and is
  declared as such rather than dressed up.
- **The networking list contains entities that do not hire data engineers** —
  investment vehicles and holding companies that file Form D.
- **`role_quality` is 0.0 in the scorer** (`[VERIFY]`), so SOC wage and ability rows
  are printed for the human and never fed in. Feeding them would change no verdict.

## Where everything is

| Document | Path |
|---|---|
| Agent twin (the recipe) | `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md` |
| Human card | `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.card.md` |
| Domain justification | `course/2026fa/submissions/beswathi/DOMAIN.md` |
| Change brief (R1–R8) | `course/2026fa/submissions/beswathi/CHANGE-BRIEF.md` |
| Friction log | `course/2026fa/submissions/beswathi/FRICTIONAL.md` |
| Sources | `course/2026fa/submissions/beswathi/SOURCES.md` |
| Test report | `course/2026fa/submissions/beswathi/TEST-REPORT.md` |
| Worked run + attestation | `logs/runs/2026fa-beswathi-1.md` |
| Prototype | `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/` |
| Run outputs | `course/2026fa/submissions/beswathi/runs/` |

## Run it

No `pip install`, no virtualenv, no network. Python 3 standard library and Node 20+.

```bash
node scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/liveness_from_fixtures.mjs

python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
  --home-state MA \
  --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
  --out-dir course/2026fa/submissions/beswathi/runs

npm run score -- course/2026fa/submissions/beswathi/runs/dataeng-roles.json \
  --out-dir course/2026fa/submissions/beswathi/runs
```

Expected: `8 roles → Apply 2 · Consider 0 · Skip 6 (skip 75%)`.

Tests — offline, fixtures only:

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py
```

Expected: `67 checks in 14 tests, 0 failed`.

Break the gates on purpose:

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
  --today 2027-03-01 \
  --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
  --out-dir /tmp/brk; echo "exit=$?"
```

Expected: `GATE timeline=0.0 (opt-start-window-closed)` and `exit=2`.

## Scope of changes

Four paths, all inside this student's own namespaces:

- `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/`
- `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage{,.card}.md`
- `course/2026fa/submissions/beswathi/`
- `logs/runs/2026fa-beswathi-1.md`

`logs/RUN_LOG.md` is not modified. No file outside these paths is touched;
`package.json` and `package-lock.json` are unmodified. No network host is contacted
by any command in this submission.
