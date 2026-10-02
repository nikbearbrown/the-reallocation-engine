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

## Reflection

**What worked.** Making the gates refuse things. The design decision that paid off
most was treating an absent liveness entry as *unscored* rather than *live*: it cut
the output from 258 roles to 8 and turned a meaningless 0% skip rate into a 75% one.
The three-state classification did what it was supposed to — 94.9% of the file is
silence, and the recipe now says so instead of converting it into rejections. The
funding-stage base rates held up against the one test that mattered: they move when
the rows move, so they are a computation rather than a decoration.

**What it got wrong, or missed.** Three things, and all three were found by looking
at output I had already called finished:

1. The run reported `0 data problems` over 30,369 rows and I believed it. 21 title
   cells carried a requisition id. Worse, my first explanation of those ids — a
   salary spill — was a guess I had not checked, written inside a tool whose entire
   premise is not guessing.
2. The liveness ledger's two live postings belonged to companies the seniority filter
   removes, so the scorer returned `Apply 0 · Skip 5`. A 100% skip rate passes the
   course's own "healthy run" heuristic. Every automated check I had was green.
3. A test I added did not run at all, and the suite reported the same green count as
   before.

The pattern across all three is the same, and it is the thing I actually learned: a
number that looks healthy is not evidence, and the ones I liked were the ones I
checked last.

**What is still missing.** G3 is open. 126 reachable companies have nothing said
about them. The 75-day hiring lag is invented and drives a gate that can zero
everything. `fit` is a constant and carries no information.

**One concrete next improvement.** Run `npm run ats:liveness` against the real
postings for the 126 `pending_g3` companies and replace the fixture ledger with live
verdicts. That single change is what would move the recipe from `RUNNABLE-SAMPLE` to
`RUNNABLE-LIVE`, and it would also answer the open question in §8 of the domain
justification: if liveness clears for most of those 126, then G3 is costing more than
it protects and the gate's placement needs re-arguing. Either outcome is informative,
which is why it is the first thing to do rather than the easiest.

## Attestation

- Recipe: `dataeng-sponsor-coverage` v0.2.0
- By: Swathi Baba Eswarappa (GitHub `BESWATHI`) · 2026-10-02

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `node .../liveness_from_fixtures.mjs` | `8 postings → active 2 · expired 5 · uncertain 1` | a ledger built by the repo's own `classifyLiveness`, no network |
| `python3 .../sponsor_coverage.py --home-state MA --liveness-ledger … --out-dir …` | `rows read 30369 · apply 8 · pending G3 126 · senior-only 101 · data problems 21 · timeline 1.0`, exit 0 | a scored list far smaller than the 1,552 companies with a record |
| `npm run score -- …/dataeng-roles.json --out-dir …` | `8 roles → Apply 2 · Consider 0 · Skip 6 (skip 75%)` | skip rate ≥ 50%, every skip a closed gate not a low vote |
| `python3 .../test_sponsor_coverage.py` | `64 checks in 13 tests, 0 failed` | all pass, offline, no network |
| `npm run verify` | conformance 167 files ✓, manifest ✓ (3 pre-existing warnings) | green |
| `npm run doctor` | `environment: ✓ runnable · recipes 33/33 carry lifecycle frontmatter` | green |
| `node scripts/pii-scan.mjs` | 1 finding, pre-existing in `package-lock.json` | nothing introduced by this branch |
| `node scripts/pii-scan.mjs --diff main` | `pii-scan: clean ✓` | no personal data anywhere in this branch's history |
| **Break 1 (deliberate):** `--today 2027-03-01` | `GATE timeline=0.0 (opt-start-window-closed)` · **exit 2** | hard stop with a non-zero exit so a chained `&& npm run score` halts |
| **Break 2 (deliberate):** `--liveness-ledger /nope.json` | `FAIL missing liveness ledger: /nope.json (no verdict invented)` · **exit 1** | refuse rather than assume the posting is live |
| **Break 3 (deliberate):** ran with an empty ledger `{}` | all 134 reachable companies moved to `pending_g3`, 0 scored | absent evidence must mean unscored, never assumed live |

### Did not test

- **Live liveness.** `npm run ats:liveness` was never run against a real posting. All
  eight verdicts come from saved captures. **G3 is not cleared.**
- **That any `Apply` role is a real open job today.** `Apply 2` is a property of the
  fixture ledger.
- **The 75-day hiring lag.** It drives the G4 gate and nothing measured it.
- **Whether the 80 Days file is representative.** Someone chose which companies to
  map; I cannot check that selection and did not try.
- **The scorer itself.** I invoke `npm run score`; I did not test the repo's scorer.
- **Fresh-clone behaviour on another machine.** Run from a clean checkout of this
  branch on my own machine only.

### Broke during testing, fixed

| What failed | What changed | Where |
|---|---|---|
| `Apply 258 · Skip 0` — unverified liveness emitted as `1.0`, so the gate never closed and the scorer rubber-stamped a list I had pre-filtered | absent ledger entry now means **unscored**, not assumed live; 126 companies moved to `pending_g3` | `sponsor_coverage.py` · `classify_sponsorship` / routing |
| G4 printed its warning and returned **exit 0**, so a chained `&& npm run score` ran anyway on a zeroed role set | `return 2`, plus a regression test asserting the exit code rather than the message | `sponsor_coverage.py:main` · `test_exit_codes_enforce_the_gates` |
| Timeline factor `0.5 + slack/(2*90)` gave **half credit at zero slack** | `min(1.0, slack/90)`, `slack <= 0` → `0.0`, no floor | `timeline_factor` |
| Title pattern `a\.?i\.?` unanchored — matched "ai" inside *Supply Chain*, *Affairs*, *Liaison* | every alternative `\b`-anchored; the counts I had already written into the card were wrong and were corrected | `TARGET_TITLE_RE` |
| Run reported `0 data problems` while accepting `Data Engineer 20516.3745` | requisition ids stripped, row kept, every edit reported; my first fix called them a "salary spill", which was a wrong guess | `strip_req_id` |
| Scorer returned `Apply 0 · Skip 5 (100%)` — the ledger's only two `active` captures belonged to companies the seniority filter removes | captures retargeted to the first 8 companies in the pipeline's own reachable order, a stated rule rather than a hand-picked set | `fixtures/postings.fixture.json` |
| New geography test silently did not run; suite still reported the same count | `__main__` now discovers tests by name instead of calling a hand-written list | `test_sponsor_coverage.py` |
| Audit dump serialised all 26,337 network targets — an **18 MB JSON**, committed | capped at top 250 with a `network_targets_truncated` block stating shown vs total; 249 KB | `write_outputs` |
| My own run log quoted the pii-scan finding verbatim, creating a **second** finding | the finding is described without reproducing the address | this file |

### Statement

I ran every command in the Tested table on 2026-10-02 and the output quoted in this
log is what they printed, not a reconstruction. The three break attempts were run
with the intent of making the gates fail, and their exit codes were read from the
shell rather than assumed.

No host was contacted at any point. No liveness verdict came from a live page. G3 is
open. Nothing in this run authorises sending an application.
