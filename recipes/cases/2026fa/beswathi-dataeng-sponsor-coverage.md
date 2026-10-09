---
status: RUNNABLE-SAMPLE
todos_open: 4
last_gate: G3-open
attestation: logs/runs/2026fa-beswathi-1.md
recipe_version: 0.2.0
---

# dataeng-sponsor-coverage — sponsorship coverage for data/AI roles

## Executive summary

Take the 80 Days CSV and a set of target data/AI job titles, and return three
buckets plus a reason for each: companies with an H-1B record that sponsored one of
those titles, companies whose record says no, and companies with **no record at
all**. The third bucket is the contribution. In
`data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` only
1,552 of 30,369 companies (5.1%) carry any `Total Approvals` figure, so a tool that
reads a blank cell as "does not sponsor" discards 94.9% of the file on a claim the
data never made.

A `no-record` company is therefore **not** scored. It is routed to a networking list,
because `scripts/score/role-scorer.mjs` takes `sponsorship.p` as a number and has no
way to represent *unknown*; emitting a placeholder there would manufacture a fact.

Two customers: this file is for the agent; `beswathi-dataeng-sponsor-coverage.card.md`
is for the human.

**Handoff condition (done when):** a sample run is complete when stdout prints
`rows read`, the four bucket counts, and a timeline gate factor with a reason; the
agent output is a JSON array in which every evidence term carries a `source`; the
human report names the coverage split and the G3 state; and no role in the agent
output has a `liveness.factor` of 1.0 whose ledger entry is not `active`.
"Looks right" is not the condition; the bucket counts and the liveness invariant are.

## Required reads

- `SNICKERDOODLE.md` — prime directive: verified data and tested scripts first.
- `DATA_CONTRACT.md` §Zero-Conditions — every value labelled `record`,
  `model-judgment`, or `your-input`.
- `DOMAIN.md` → Known gaps — facts 1, 3, 4 and 6 apply here; see the card.
- `scripts/score/role-scorer.mjs` — the scorer's input contract, which this recipe
  feeds rather than replaces.
- `scripts/ats/liveness-core.mjs` — `classifyLiveness`, imported for G3.

## Phase gates

Each gate has a testable condition against a path that **exists today**.

1. **G1 source gate** — the 80 Days CSV and the SOC CSV are present.
   Test: `test -f data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv && test -f data/bls/compact/soc_occupation_compact.csv`
   On failure the script exits non-zero and invents nothing.
   Human capacity: confirm the CSV is the version named in the run log.

2. **G2 shape gate** — the agent output parses and every evidence term carries a source.
   Test: `python3 -m json.tool course/2026fa/submissions/beswathi/runs/dataeng-roles.json`
   Human capacity: confirm `sponsorship.source` is `record` on every scored role.

3. **G3 liveness gate — HARD STOP, human only.** No role may be treated as `Apply`
   until a liveness verdict of `active` exists for its posting. The script never
   produces this verdict itself; it consumes a ledger and reports the source.
   Test: `test -f scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json`
   Human capacity: run `npm run ats:liveness -- <job-url>` against the real posting
   and replace the fixture verdict with the live one before applying.
   **A missing ledger is not a pass.** The script raises rather than assuming live.

4. **G4 timeline gate — HARD STOP, multiplies to zero.** If a hire begun today cannot
   finish before the 90-day unemployment allowance runs out, the role scores zero
   regardless of sponsorship.
   Test: run with `--today 2027-03-01` and confirm the gate prints
   `0.0 (opt-start-window-closed)`.
   Human capacity: confirm the OPT dates in the script header are still current.

5. **G5 test gate** — the offline test passes before any run is reported.
   Test: `python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py`
   Human capacity: read the assertion names, not just the exit code.

## Primary stored tools

| Tool | Path | Role |
|---|---|---|
| coverage triage | `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py` | buckets, gates, both outputs |
| G3 ledger (offline) | `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/liveness_from_fixtures.mjs` | imports `classifyLiveness`; no network |
| offline test | `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py` | 64 checks / 13 tests, fixtures only |
| scorer | `scripts/score/role-scorer.mjs` (`npm run score`) | **existing**, not copied |

## Workflow

1. **Load the record.** Read the 80 Days CSV. Rows: 30,369. Label: `record`.
2. **Parse titles.** `top_job_titles_sponsored` stores a stringified Python list
   (`"['Data Scientist']"`). A cell that will not parse is reported as
   `unparseable-title-list`, never guessed.
3. **Match target titles.** Six titles; see the card. Alternatives are `\b`-anchored
   — an earlier unanchored pattern matched "ai" inside *Supply Chain*, *Affairs* and
   *Liaison*. Label: `your-input` (which titles), `record` (what the file says).
4. **Classify sponsorship into three states.** `record-positive` /
   `record-negative` / `no-record`. A `no-record` row carries **no** `p`.
5. **Compute G4 timeline.** From the I-20 end date, the planned OPT start, the 90-day
   unemployment allowance and a 75-day hiring-lag assumption. Label: `your-input`.
6. **Apply G3 liveness.** Only a ledger verdict of `active` yields
   `liveness.factor: 1.0`. `expired` and `uncertain` both yield `0.0` — unverified is
   not live. A company absent from the ledger is **not scored**; it lands in
   `pending_g3`.
7. **Compute stage base rates.** One pass over all 30,369 rows tallies, per
   `latest_funding_stage`, the share of companies carrying any `Total Approvals`
   figure. Stages below 100 companies get `rate: null` with reason
   `below-min-n-100`. Observed: Pre-Seed 1.4% → Series D+ 25.6%, an 18x spread.
   Label: `record (computed over the shipped CSV)`. **Never hardcoded** — a test
   asserts the rate changes when the rows change.
8. **Tally the market by state.** One pass counts, per state, employers with a
   sponsored target title, split by whether any such title sits at a reachable
   level. Observed: CA 84 reachable, NY 24, MA 15 — CA+NY+WA hold 84.3% of the
   134 reachable sponsors. **This is reporting, not routing.** The candidate is
   open to relocation inside the US and to remote work, so location does not
   filter, rank, or discount any role; `--home-state` only flags rows and prints
   a local shortlist. A test asserts that changing `--home-state` leaves the
   scored population and every scoring factor identical. Label: `record` for the
   counts, `your-input` for the home state. See `geography-is-not-a-gate` below.
9. **Route.** `record-positive` + ledgered → scorer input. `no-record` + recent
   funding → networking list, each entry carrying its stage base rate, ranked by
   that rate with funding recency as tiebreak. `record-negative` → skip with reason.
10. **Score with the existing scorer.** `npm run score -- <roles.json> --out-dir <dir>`.
11. **Write both outputs** and the run log.

## Output contract

One file cannot serve both customers, so there are two (plus an audit dump).

**Agent output** — `<out-dir>/dataeng-roles.json`: a JSON array in the shape of
`data/examples/ch11-roles.json`, one object per scored role, each of
`sponsorship` / `fit` / `liveness` / `timeline` carrying `source`. Private keys
(`_coverage`) are stripped. This is the scorer's input and nothing else reads it.

**Human report** — `<out-dir>/dataeng-sponsor-coverage.md`: the coverage split, the
timeline arithmetic with its assumptions named, the SOC rows loaded, the data problems
encountered, and the networking and apply tables. This is what a person reads before
deciding.

**Audit dump** — `<out-dir>/dataeng-coverage-full.json`: all buckets including
`pending_g3` and `senior_only_sponsors`, for checking a run after the fact. The
networking list is capped at its top **250** entries, because dumping all 26,337
produced an 18 MB file and the list is ranked — the tail carries nothing the head
does not. The cap writes its own `network_targets_truncated` block stating shown and
total, so a reader is never silently handed a partial list.

## Verification checks

- `rows read` equals the CSV's data-row count (30,369 on the shipped file).
- Every object in the agent output has four evidence terms, each with a `source`.
- No `liveness.factor == 1.0` whose ledger `result` is not `active`.
- Every `network_targets` entry has `sponsorship == null` and a `stage_prior` block.
- `stage_priors` recomputes from the rows given: a test feeds synthetic rows and
  asserts the rate follows them, so the table cannot drift into a constant.
- The networking list is sorted by base rate descending.
- The offline test reports `56 checks in 12 tests, 0 failed`.
- Changing `--home-state` changes no scored row and no scoring factor
  (`test_geography_is_reported_not_enforced`).
- `node scripts/conformance.mjs scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/`
  and `npm run verify` both pass.
- Deliberate break: `--today 2027-03-01` must print a `0.0` timeline gate, and a
  non-existent `--liveness-ledger` path must exit non-zero rather than assume live.

### geography-is-not-a-gate

The temptation here is to filter to the home state, because a local list looks
more actionable. That would be the scorer overriding a decision the human has
already made: this candidate will relocate within the US and will take remote
work, so a California role is a live option, not a dead end. Encoding "near
Boston" as a score would quietly delete 89% of the reachable market and call it
a ranking.

So geography is computed and printed and never consulted. The number it produces
— MA is 11.2% of the reachable market — is for the human to weigh against moving
costs, which is a judgment the data cannot make. The test exists to keep a later
revision from turning the report into a filter.

## Logging rules

Each run appends an entry to `logs/runs/2026fa-beswathi-<n>.md` using the template in
`recipes/_shared.md`. Never edit `logs/RUN_LOG.md`. The entry records the CSV filename,
the `--today` value, the ledger used, the four bucket counts, and the scorer's verdict
line verbatim.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | run completed; gates passed |
| 1 | a required input was missing (CSV or ledger) — nothing invented |
| 2 | **G4 timeline gate returned 0.0** — a hard stop, so a chained `&& npm run score` halts |

Exit 2 exists because a break attempt on 2026-09-30 found this branch printing its
warning and then returning 0, which meant the documented hard stop did not stop
anything. A test now asserts the code.

## Stop conditions

- **G1 fails** — a required CSV is missing. Stop; report the path.
- **G3 has no ledger** — stop. Do not assume a posting is live.
- **G4 returns 0.0** — stop and re-plan the window; every role scores zero, and that
  is the correct answer, not a bug.
- **A title cell will not parse** — record the company and the problem; continue with
  the remaining rows.
- **The scorer reports a 0% skip rate** — stop and inspect. A run that skips nothing
  is evidence the gates are not doing work, not evidence that every role is good.

## Open TODOs

- `[TODO: DATA SOURCE]` Replace the fixture liveness captures with verdicts from a
  live `npm run ats:liveness` run so G3 rests on a fetch rather than a saved capture.
  Required before this recipe could claim `RUNNABLE-LIVE`.
- `[TODO: DEV]` `fit` is a constant `0.8` `model-judgment`. It should compare the
  posting text against a résumé skill list; until it does, it carries no information
  and is declared as such rather than dressed up.
- `[TODO: DATA SOURCE]` The networking list contains entities that do not hire data
  engineers — investment vehicles and holding companies that file Form D. Ranking by
  funding recency pushes dormant ones down but does not identify them. An industry /
  SIC exclusion would, and has not been written.
- `[TODO: DEV]` The 75-day hiring lag driving G4 is assumed, not measured. It is the
  weakest input in the recipe and can zero every role. Measuring it against real
  application-to-offer intervals would replace a `your-input` with a `record`.
