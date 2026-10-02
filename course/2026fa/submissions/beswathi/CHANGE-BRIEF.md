# CHANGE-BRIEF — dataeng-sponsor-coverage

**Student:** Swathi Baba Eswarappa · GitHub `BESWATHI`
**Recipe:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md`
**Written:** 2026-09-30

> **Honesty note on the timing of this file.** The assignment asks for predictions
> *before* building. The predictions in §4 and §5 below are the ones I actually
> held before the first run — they were stated when the domain was chosen, and they
> are transcribed here unchanged. But this file was typed up **after** the first
> prototype pass on 2026-09-30, not before it. I am recording that rather than
> backdating the file, and §6 keeps the revisions separate from the originals.
> See `FRICTIONAL.md` for what this cost.

## 1. The career situation

An international master's student in **Data Analytics Engineering** at Northeastern,
on F-1, looking for **data engineer, AI engineer, data analyst, machine learning
engineer, BI engineer, and data scientist** roles that will need H-1B sponsorship.

The visa arithmetic that constrains everything:

| | Date |
|---|---|
| I-20 program end | 2026-12-15 |
| OPT start requestable | 2026-12-16 – 2027-02-13 |
| OPT start planned (`your-input`) | 2027-01-15 |
| Unemployment allowance | 90 aggregate days |

**Engine layers drawn on:** 80 Days to Stay (funding + H-1B history) as the primary
record; The Cognitive Pivot (SOC wage and ability rows) in the human report only.

## 2. What I will reuse, with exact paths

| Path | Use |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | the record: 30,369 companies |
| `data/bls/compact/soc_occupation_compact.csv` | SOC rows `15-1243.01`, `15-2051.00` |
| `scripts/ats/liveness-core.mjs` → `classifyLiveness` | G3 verdicts, **imported not copied** |
| `scripts/score/role-scorer.mjs` (`npm run score`) | the decision, **invoked not copied** |
| `data/examples/ch11-roles.json` | the output shape my agent JSON must match |

**Not used:** `data/sec/form-d/processed/sample/*.json`. Funding comes from the 80 Days
CSV instead, so a fresh clone behaves identically (engine fact 3).

## 3. What I am proposing that the repo does not have

- **A three-state sponsorship classifier.** The scorer's input contract takes
  `sponsorship.p` as a number, so it can express *sponsors* and *does not sponsor*
  but not *no record exists*. In this file 94.9% of rows are the third case. It
  belongs in the engine because the alternative is to encode a silence as a zero.
- **An offline G3 ledger** that reuses the repo's own liveness classifier against
  saved captures, so a liveness gate can be tested without Playwright or network.

## 4. Gates, and what a human must see to clear each

| Gate | Hard stop | A human must see |
|---|---|---|
| G1 source | missing CSV | the CSV filename matches the one in the run log |
| G2 shape | unparseable agent JSON | `sponsorship.source == record` on every scored role |
| **G3 liveness** | **always — human only** | an `active` verdict from `npm run ats:liveness` against the real posting |
| **G4 timeline** | factor 0.0 | the OPT dates in the script header are still current |
| G5 test | test failure | the assertion names, not just the exit code |

## 5. Predicted failure cases, and how I will check each

These are the predictions as they stood before the first run.

1. **A company is absent from the CSV.** Check: look up a name that is not in the file
   and confirm the run reports it rather than scoring it. *Handled as `no-record`.*
2. **A SOC code has no row.** Check: request a code that does not exist and confirm
   `soc_problem: no-occupation-row` appears instead of a wage.
3. **A posting 404s.** Check: a fixture with `status: 404` must classify `expired` and
   drive the liveness factor to 0.0.
4. **An OPT date already past.** Check: `--today 2027-03-01` must return a 0.0 timeline
   gate with reason `opt-start-window-closed`.
5. **A malformed title cell.** Check: a fixture cell `"['Data Engineer'"` must be
   reported as `unparseable-title-list` and not parsed by guesswork.

### The one prediction about what I would get wrong

> "The first pass will treat the 95% of companies with no sponsorship record as
> non-sponsors, because that is what a single numeric `p` field invites, and I will
> only notice when the skip rate looks implausibly high."

**Outcome: half right, and wrong in a more interesting way.** The three-state design
was in from the start, so the 95% were never scored as zeros. What actually went wrong
is the mirror image: because I fed the scorer *only* pre-filtered record-positive
companies with an unverified `liveness: 1.0`, the first scored run returned
**Apply 258 · Skip 0 — a 0% skip rate.** The assignment's own standard is that a
healthy run skips at least half. I had not created false negatives; I had created a
rubber stamp. See `FRICTIONAL.md` 2026-09-30 for the fix.

## 6. Revisions (added, not substituted)

- **R1 (2026-09-30).** Target titles widened from four to six on the student's
  instruction: added machine learning engineer, BI engineer, data scientist.
  Matching companies: 98 → 235.
- **R2 (2026-09-30).** The title pattern was unanchored, so `a\.?i\.?` matched the
  letters "ai" inside *Supply Chain Planner*, *Regulatory Affairs* and *Medical
  Science Liaison*. All alternatives are now `\b`-anchored.
- **R3 (2026-09-30).** G3 changed from "emit `liveness: 1.0` with a warning note" to
  "consume a ledger; a company with no entry is not scored at all." This is what took
  the skip rate from 0% to 75%.
- **R4 (2026-09-30).** The timeline factor had an arbitrary floor
  (`0.5 + slack/180`), which gave half credit to a hire landing exactly on the
  unemployment deadline. Now `slack/90`, so zero margin fails the gate. Found by the
  offline test, not by reading the code.

- **R5 (2026-10-02).** Added a geographic layer after the student confirmed she is
  open to relocating inside the US and to remote work. Because of that confirmation
  it is **reporting, not routing**: location does not filter, rank or discount any
  role. The number it produces — Massachusetts holds 15 of the 134 new-grad-reachable
  sponsors, 11.2%, against 84.3% for CA+NY+WA — exists so the cost of choosing to
  stay put is a decision rather than a default. `test_geography_is_reported_not_enforced`
  asserts that changing `--home-state` leaves the scored population and every scoring
  factor identical, so a later revision cannot quietly turn the report into a filter.

- **R6 (2026-10-02).** The run reported `0 data problems` while accepting
  `Data Engineer 20516.3745`. The leading group is constant per company and the tail
  increments per posting, so these are requisition ids — 21 cells across Amgen,
  Glassdoor and Palantir. They are now stripped rather than rejected, because the
  posting is a real one, and every strip is reported so the edit is visible. An
  earlier draft of this fix described the number as a salary spill; that was wrong
  and the per-company prefix is what disproves it.

- **R7 (2026-10-02).** The liveness ledger's two `active` captures named companies
  the seniority filter removes, so no scored role could ever clear G3 and the run
  returned `Apply 0 · Skip 5 (100%)`. The captures now cover the first eight
  companies in the pipeline's own reachable order — a stated rule, not a hand-picked
  set — restoring `Apply 2 · Skip 6 (75%)`. This is the second time a fixture went
  stale behind the seniority filter; the selection rule is written down to stop a third.

- **R8 (2026-10-02).** The test file ran a hand-maintained list of test functions in
  `__main__`, so the geography test added in R5 silently did not run. The runner now
  discovers tests by name. A test file whose newest test does not execute is the one
  failure mode a test file must not have.
