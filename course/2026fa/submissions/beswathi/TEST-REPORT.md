# TEST-REPORT — dataeng-sponsor-coverage

## Executive summary

**64 checks in 13 tests, 0 failed.** Offline, fixtures only, no network.

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py
```

The suite is built around one idea: **test the refusals, not the happy path.** Most
of these checks assert that the tool declines to produce a number — that an absent
ledger entry does not become "live," that a missing file raises instead of defaulting,
that a company with no record carries no probability at all.

A passing suite here does not mean the recommendations are right. It means the tool
fails in the ways it is supposed to fail.

---

## What is covered

| Area | Checks | What is actually asserted |
|---|---:|---|
| Three-state classification | 4 | blank → `no-record` with **no** `p`; approvals → `record-positive`; denials-only → `record-negative`; and that the last two are not the same state |
| G3 liveness | 8 | only `active` clears; `expired` and `uncertain` both gate to 0.0; a company absent from the ledger is **unscored**, not assumed live |
| G4 timeline | 3 | inside the window → positive factor; past the OPT start window → hard 0.0; hiring lag past the unemployment deadline → 0.0 |
| Exit codes | 4 | healthy → 0; G4 gate → **2**; missing ledger → 1; missing CSV → 1 |
| Stage base rates | 4 | computed from the rows given (60/100 = 0.6), a second stage gets its own rate, below-min-n gets **no** rate, and changing the rows changes the rate |
| Seniority filter | 9 | Senior/Staff/Lead/Manager/II are senior-coded; plain titles reachable; "Senior Associate" is senior not junior; no scored role carries a senior title; senior-only sponsors are **recorded, not dropped** |
| Requisition ids | 8 | three real malformed titles are stripped; four legitimate numeric titles survive untouched; a stripped title still matches the target pattern |
| Geography | 7 | `market_by_state` is reported; changing `--home-state` changes **no** scored row, **no** timeline gate and **no** scoring factor |
| Title parsing | 3 | stringified Python lists parse; malformed cells are reported not guessed; empty cells yield nothing and no false problem |
| Output contract | 4 | agent output parses; human report written; every evidence term carries a `source`; no private `_coverage` key leaks to the scorer |
| Date handling | 2 | a real date sorts above a missing one; an unparseable date does not raise |
| Network targets | 3 | every target carries a `stage_prior`; the prior states it is not a prediction; the list is sorted by base rate descending |

## The checks that exist because something broke

Each of these is a regression test for a real defect, documented in `FRICTIONAL.md`:

| Check | The defect it locks down |
|---|---|
| `G4 gate 0.0 exits 2 so a chained command halts` | the gate printed a warning and exited 0, so `&& npm run score` ran anyway on a zeroed role set |
| `past the OPT start window -> hard 0.0 gate` | the timeline formula returned **0.5** at zero slack — half credit for an impossible role |
| `data-title sponsor with no ledger entry is pending, not Apply` | unverified liveness was emitted as `1.0`, producing `Apply 258 · Skip 0` |
| `rates are not hardcoded — changing the rows changes the rate` | guards against the base-rate table silently drifting into constants |
| `no scored role carries a senior-coded title` | a "sponsor" whose only data title is *Staff Data Scientist* is not reachable at under a year |
| `kept intact: 'Data Engineer II' / 'Analyst 3'` | the req-id stripper must not eat numerals that belong to the title |
| `home state does not change any scoring factor` | stops a later revision turning the geography report into a location filter |

## Deliberate break attempts

A gate that never fires is decoration. Both were run against the real 30,369-row
file, and exit codes were read from the shell rather than assumed:

| Command | Expected | Observed |
|---|---|---|
| `--today 2027-03-01` | hard stop, non-zero exit | `GATE timeline=0.0 (opt-start-window-closed)` · **exit 2** |
| `--liveness-ledger /nope.json` | refuse rather than assume live | `FAIL missing liveness ledger: /nope.json (no verdict invented)` · **exit 1** |

## Repository checks

| Check | Result |
|---|---|
| `npm run verify` | conformance 167 files (88 md · 38 py · 31 js · 6 json · 4 sh) ✓; manifest ✓ (3 pre-existing warnings) |
| `npm run pii-scan` | 1 finding — an npm maintainer address in `package-lock.json`, pre-existing, not from this branch |
| `git status` | 4 untracked paths, all inside this student's namespaces; `package.json` / `package-lock.json` unmodified |

## How the suite is run

The `__main__` block **discovers** tests by name from the module namespace and prints
`N checks in M tests`. It previously called a hand-maintained list, which silently
skipped a newly added test and reported the same green count as before. A suite whose
newest test does not run is worse than no suite, because the green result gets cited
as evidence. The printed test count now moves when a test is added.

The file also runs under `pytest` (`pytest … -q` → 13 passed), which collects by
convention and was never affected by that bug — which is precisely why the bug
survived: the two runners disagreed and only the documented one was wrong.

## What the suite does not test

- **That any recommendation is correct.** The suite tests mechanism, not judgment.
  `Apply 2` is a property of a fixture ledger, not evidence that two jobs are open.
- **Live liveness.** Every verdict comes from a saved capture. Nothing exercises
  `npm run ats:liveness` against a real board, because that requires network access
  the suite deliberately does not have.
- **The 75-day hiring lag.** It is an assumption; a test can only check that it is
  applied consistently, not that it is right.
- **Whether the 80 Days file is representative.** Out of reach of any test here.
