# 2026fa — beswathi — run 1

## Executive summary

**What this is.** The first worked run of the `dataeng-sponsor-coverage` recipe
against the real 30,369-row 80 Days CSV, scored by the repository's own
`role-scorer.mjs`.

**Why it exists.** To find out whether a company's *silence* about sponsorship can
be turned into a usable signal, and to check that the recipe's gates actually stop
things rather than decorating them.

**What it found.** 8 roles reached the scorer; 2 came back `Apply`, 6 `Skip`
(75%). 126 reachable companies were left **unscored** because no liveness evidence
exists for them. 101 companies sponsor a data title but only at senior level, so
they are not reachable at under a year of experience. 21 title cells across three
companies carry a requisition id that an earlier version silently accepted.

**What it did not do.** It did not contact a single host, did not verify that any
posting is live right now, and did not clear G3 for anything. Two `Apply` rows rest
on saved page captures, not on a live fetch.

---

- **Recipe:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md` (v0.2.0,
  status `RUNNABLE-SAMPLE`)
- **Date:** 2026-10-02
- **Hosts contacted:** none. No network call is made by any command below.

## Inputs

| Input | Label | Note |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `record` | 30,369 data rows, shipped with the repo |
| `data/bls/compact/soc_occupation_compact.csv` | `record` | SOC `15-1243.01`, `15-2051.00`; report-only |
| `fixtures/postings.fixture.json` → `fixtures/liveness-ledger.json` | `record over fixture capture` | 8 saved captures classified by the repo's own `classifyLiveness` |
| I-20 end 2026-12-15, planned OPT start 2027-01-15, 90-day unemployment allowance, 75-day hiring lag | `your-input` | the 75-day lag is an assumption; nothing measured it |
| home state `MA`; open to US relocation and to remote | `your-input` | used for reporting only, never for scoring |

## Commands

```bash
node scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/liveness_from_fixtures.mjs

python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
  --home-state MA \
  --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
  --out-dir course/2026fa/submissions/beswathi/runs

npm run score -- course/2026fa/submissions/beswathi/runs/dataeng-roles.json \
  --out-dir course/2026fa/submissions/beswathi/runs
```

## Result

```
rows read              : 30369
apply candidates       : 8 (sponsorship on record)
network targets        : 26337 (no sponsorship record + funded)
record-negative skips  : 0
pending G3 (unscored)  : 126
senior-only sponsors   : 101 (not reachable at <1 yr)
liveness ledger        : 8 entries
data problems          : 21
timeline gate          : 1.0 (ok)
exit 0

✓ scored 8 roles → Apply 2 · Consider 0 · Skip 6 (skip 75%)
```

Skip rate 75%. The scorer calls a run healthy when it skips at least half, and
every one of the six skips is a closed liveness gate — a gate multiplying the
composite to zero, not a low vote.

## Outputs

| File | Audience |
|---|---|
| `course/2026fa/submissions/beswathi/runs/dataeng-roles.json` | the scorer, and nothing else |
| `course/2026fa/submissions/beswathi/runs/dataeng-sponsor-coverage.md` | a human deciding where the next hour goes |
| `course/2026fa/submissions/beswathi/runs/dataeng-coverage-full.json` | audit dump, all buckets including the 126 unscored |
| `course/2026fa/submissions/beswathi/runs/role-scores.{json,md}` | the repository scorer's own verdict |

## Findings

1. **94.9% of the file says nothing about sponsorship.** 1,557 of 30,369 rows have
   a populated `Total Approvals` cell; 1,552 are positive and exactly **5** are a
   recorded zero. So the file holds 5 true "no" answers and 28,812 silences. Reading a blank cell as "does not sponsor" discards
   most of the file for a reason the data never gave.
2. **Funding stage carries a base rate, computed at runtime:** Pre-Seed 1.4% →
   Series D+ 25.6%, an 18x spread. That is what turns a silence into "unknown, and
   here is the prior." It is not a prediction about any single company, and it
   describes this file rather than the economy.
3. **"AI Engineer" appears zero times in 30,369 rows.** The work is filed as
   *Machine Learning Engineer* (48 rows). Of 235 companies whose record matches a
   target title, 194 match without *Machine Learning Engineer* — so searching with
   the student's own vocabulary instead of the filing's loses 41 employers, 17.4%.
4. **The reachable market is not where the student is.** 134 companies sponsor a
   target title at a level a new grad could hold: CA 84, NY 24, MA 15, WA 5.
   CA+NY+WA hold 84.3%; Massachusetts holds 11.2%. Reported, never scored — see
   the open issue below.
5. **101 companies sponsor data roles only at senior level.** They are recorded
   with a reason rather than dropped, because "they sponsor, but not you, not yet"
   is a different answer from "they do not sponsor."
6. **21 title cells carry a requisition id** (`Data Engineer 20516.3745`). The
   leading group is constant per company and the tail increments per posting. The
   previous run reported `0 data problems` while accepting them.

## Break attempts

A gate that never fires is decoration, so both were run deliberately:

| Attempt | Expected | Observed |
|---|---|---|
| `--today 2027-03-01` (past the OPT start window) | hard stop, non-zero exit | `GATE timeline=0.0 (opt-start-window-closed)`, **exit 2** |
| `--liveness-ledger /nope.json` | refuse rather than assume live | `FAIL missing liveness ledger: /nope.json (no verdict invented)`, **exit 1** |

Exit 2 matters specifically because `… && npm run score` would otherwise run on a
fully-zeroed role set. An earlier version printed the warning and exited 0; a
regression test now covers it.

## Verification

- `python3 …/test_sponsor_coverage.py` → **64 checks in 13 tests, 0 failed**, offline,
  fixtures only.
- `npm run verify` → conformance 167 files, ✓; manifest check ✓ (3 pre-existing warnings).
- `npm run pii-scan` → 1 finding, an npm maintainer address inside
  `package-lock.json`. Pre-existing, not introduced by this branch, and the address
  is deliberately not reproduced here — quoting a scanner finding verbatim turns the
  report into a second finding, which is exactly what happened on the first draft.
- `--home-state MA` vs `--home-state CA` produce an identical scored population and
  identical scoring factors (`test_geography_is_reported_not_enforced`).

## Open issues

- **G3 is not cleared for anything.** The two `Apply` rows rest on saved captures.
  Clearing G3 for real needs `npm run ats:liveness -- <job-url>` against the live
  posting, which is a human step and has not been done.
- **126 reachable companies are unscored** for want of liveness evidence. That is
  the honest state, not a failure, but it means the shortlist is a sample.
- **The 75-day hiring lag is invented.** It drives the G4 timeline gate and nothing
  measured it. If the real lag is longer, the gate should close earlier than it does.
- **Geography is reported but never scored**, deliberately: the student is open to
  US relocation and to remote work, so filtering on location would delete 89% of
  the reachable market and present it as a ranking. If that constraint ever changes,
  this becomes a modelling decision and must be re-argued rather than switched on.
- **The networking list contains entities that do not hire data engineers** —
  investment vehicles and holding companies that file Form D. Ranking by funding
  recency pushes dormant ones down but does not identify them.
- **`role_quality` is 0.0 in the scorer** (`[VERIFY]`, not pinned by the chapter),
  so the SOC wage and ability rows are printed for the human and never fed in.
  Feeding them would change no verdict.

## Attestation

I ran every command recorded above, on 2026-10-02, and the console output quoted
here is what they printed — not a reconstruction. The two break attempts were run
with the intent of making the gates fail, and their exit codes were read from the
shell rather than assumed.

No host was contacted at any point. No liveness verdict in this run came from a
live page; all eight came from `classifyLiveness` applied to saved captures, and
the output labels them `record (classifyLiveness) over fixture capture` rather than
`record`. G3 is open. Nothing here authorises sending an application.

The `Apply 2` result is a property of a fixture ledger, not evidence that two jobs
are open today.
