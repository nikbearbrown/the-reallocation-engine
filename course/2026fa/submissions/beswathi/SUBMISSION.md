# Submission — Recipe Design Assignment

**Recipe:** `dataeng-sponsor-coverage`
**Branch:** `contrib/2026fa-beswathi-dataeng-sponsor-coverage`
**Date:** 2026-10-02

## Executive summary

**The question.** For an F-1 student with a hard OPT clock, which companies are worth
an application and which are worth a conversation?

**The finding.** The dataset everyone is using contains **5 recorded "no" answers and
28,812 silences**. A tool with two states — sponsors / does not sponsor — turns those
silences into 28,807 rejections that no employer ever issued. This recipe uses three
states instead, and converts the silence into a computed funding-stage base rate
(Pre-Seed 1.4% → Series D+ 25.6%, an 18x spread).

**The result.** 30,369 companies → 8 scored → `Apply 2 · Consider 0 · Skip 6` (75%
skip). 126 companies are explicitly **unscored** because no liveness evidence exists
for them, and 101 sponsor data roles only at senior level.

**What it does not do.** G3 is not cleared. The two `Apply` rows rest on saved page
captures, not on a live fetch, and nothing here authorises sending an application.

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

Expected: `64 checks in 13 tests, 0 failed`.

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
