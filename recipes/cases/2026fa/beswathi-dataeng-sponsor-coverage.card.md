# dataeng-sponsor-coverage — human card

**Audience:** an international student deciding where the next hour of a job search should go.
**Agent twin:** `recipes/cases/2026fa/beswathi-dataeng-sponsor-coverage.md`
**Layers:** 80 Days to Stay (funding + H-1B history) and The Cognitive Pivot (SOC role quality, report-only).

## Purpose

Answer, for a data/AI role: **is there a sponsorship record for this company, is there
no record at all, or is there a record that says no?** Those are three different
answers and most tools collapse them into two.

In `mapped_student_employment_targets_v3.csv` (30,369 companies) only **1,557 (5.1%)**
have a populated `Total Approvals` cell. Reading a blank cell as "does not sponsor"
throws away **94.9%** of the file for a reason the data never stated.

The sharper number is the other one: of those 1,557, exactly **5** record a zero.
So the file contains **5 actual "no" answers and 28,812 silences**. A two-state tool
turns 28,812 silences into 28,812 noes — it manufactures 28,807 rejections that
nobody wrote down. That is the entire reason this recipe exists.

## What it can verify

- A company row exists in the 80 Days CSV, and whether `Total Approvals` /
  `Total Denials` are populated. Populated-and-positive, populated-and-zero, and
  **absent** are three distinct states, reported as `record-positive`,
  `record-negative`, and `no-record`.
- The `Approval_Rate` the file records, when it records one. Range observed: 33.3 – 100.0,
  **median 100.0** — so among companies that have a record at all, the sponsorship
  signal is nearly constant and carries little discriminating power.
- That a sponsored job title in `top_job_titles_sponsored` matches one of six target
  titles (data engineer, data analyst, data scientist, machine learning engineer,
  AI engineer, BI engineer).
- A liveness verdict of `active` / `expired` / `uncertain`, produced by the
  repository's own `classifyLiveness` (`scripts/ats/liveness-core.mjs`) — not a
  reimplementation.
- That a SOC row exists for `15-1243.01` / `15-2051.00`, with its OEWS wage and
  O*NET ability levels.

## What it cannot verify

- **That a `no-record` company does not sponsor.** The file is silent, and silence is
  not a negative. This is the single most important limit here.
- **That a `record-positive` company will sponsor *you*, now, for *this* role.** The
  record is historical and title-level, not offer-level.
- **Whether a posting is live right now.** Liveness verdicts in the shipped run come
  from saved page captures in `fixtures/postings.fixture.json`, not a live fetch.
  Clearing G3 for real requires `npm run ats:liveness -- <job-url>`.
- **Whether the matched title is the job you'd actually be hired into.** Title strings
  are what the filing recorded, not job descriptions.
- **The hiring lag.** The 75-day assumption driving the timeline gate is `your-input`.
  Nothing measured it.
- **Wage suitability.** `median_salary_offered` is read but not scored; see fact 2.
- **That a company in the file is a plausible employer at all.** The CSV contains
  investment vehicles and holding companies that file Form D but do not hire data
  engineers — `CARLYLE TACTICAL PRIVATE CREDIT FUND`, `ARES ACQUISITION CORP II`,
  `AC HOLDCO LLC` all surface in the networking list. Ranking by funding recency
  pushed the dormant ones down but does not identify them. Filtering them is the
  next improvement.

## Facts about the engine that this recipe addresses

| Fact | How this recipe handles it |
|---|---|
| 1. `role-scorer.mjs` sets `role_quality: 0.0` `[VERIFY]` | SOC wage/ability rows are printed in the **human report only** and never fed to the scorer, because feeding them would change nothing. Stated in the report itself. |
| 3. Only samples of the SEC Form D data ship | This recipe reads funding from the **80 Days CSV**, not the Form D samples, so a fresh clone behaves identically. The Form D samples are not used. |
| 4. `data/raw/`, `data/verified/`, `logs/gate-decisions/` do not exist | Every gate test points at a path that exists. No gate references a planned directory. |
| 6. Every top-level recipe is DRAFT | This one claims `RUNNABLE-SAMPLE` and lists what it cannot do, rather than claiming more. |

## The finding this recipe adds

**Funding stage predicts sponsorship, and the spread is large.** Computed from the
shipped CSV at runtime, never hardcoded:

| Stage | Sponsors / companies | Base rate |
|---|---:|---:|
| Pre-Seed | 137 / 9,658 | **1.4%** |
| Seed | 188 / 6,325 | 3.0% |
| Series A | 329 / 6,196 | 5.3% |
| Series B | 364 / 3,300 | 11.0% |
| Series C | 265 / 1,421 | 18.6% |
| Series D+ | 249 / 974 | **25.6%** |

An 18x spread. Pre-Seed is 9,658 companies — nearly a third of the file — where
sponsorship essentially does not happen.

This is what the recipe does with the 94.9% silence: a company with **no**
sponsorship record still has a funding stage, and the stage carries a base rate.
So a silence becomes "unknown, and here is the prior" instead of "unknown". The
networking list is ranked by that prior, with funding recency as the tiebreak.

**What the base rate is not.** It is not a prediction about any single company. And
this file contains companies someone already chose to map, so the rates describe
*the file*, not the economy. Stages with fewer than 100 companies get no rate rather
than a noisy one.

## A negative result worth recording

**"AI Engineer" does not appear once in 30,369 rows.** The work is filed as
*Machine Learning Engineer*, which appears in 48 rows. Of the 235 companies with a
sponsorship record matching any of the six target titles, **194 match without
*Machine Learning Engineer* and 235 with it** — so a student who searches only
"AI Engineer" and "Data Engineer" misses 41 employers, 17.4% of the reachable set,
by using their own vocabulary instead of the filing's.

(An earlier draft of this card put the gap at 98 vs 143. Those numbers came from
the unanchored title pattern that also matched "ai" inside *Supply Chain* and
*Liaison*; they were wrong in both directions and are corrected here.)

## A second finding: the market is not where the student is

Counted from the shipped file, employers sponsoring a target title **at a level a
new grad could hold**:

| State | Any level | New-grad reachable | Share |
|---|---:|---:|---:|
| CA | 141 | **84** | 62.7% |
| NY | 49 | 24 | 17.9% |
| **MA** | 22 | **15** | **11.2%** |
| WA | 10 | 5 | 3.7% |
| TX | 8 | 4 | 3.0% |

CA + NY + WA hold 84.3% of the 134 reachable sponsors. Massachusetts — where this
student is — holds 11.2%.

**Geography is reported and never scored.** This student will relocate inside the US
and will take remote work, so a California role is a live option, not a dead end.
Encoding "near Boston" as a score would delete 89% of the reachable market and call
it a ranking. `--home-state` only flags rows and prints a local shortlist for the
13 reachable Massachusetts employers, which are cheap to pursue in person; they are
not ranked above anything. A test asserts that changing `--home-state` leaves the
scored population and every scoring factor identical.

## A data defect the first version did not see

The run reported **0 data problems** while silently accepting titles like
`Data Engineer 20516.3745` (Amgen), `Manager, Data Science (20639.33)` (Glassdoor)
and `Software Engineer (11525.2801.9)` (Palantir). The leading group is constant per
company and the tail increments per posting, so these are **requisition ids**, not
salaries and not part of the title.

21 cells across 3 companies carry one. They are now stripped — the row is kept,
because `Data Engineer 20516.3745` is a real Data Engineer posting and rejecting it
would lose a genuine sponsor over formatting — and every strip is reported in the
`Data problems` table so the edit is visible rather than silent. Numerals that
belong to a title (`Data Engineer II`, `Analyst 3`) are left alone, which is tested.

## Dependencies

- Python 3 (standard library only — no venv, no pip)
- Node 20+ for `liveness_from_fixtures.mjs` and `npm run score`
- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- `data/bls/compact/soc_occupation_compact.csv`
- `scripts/ats/liveness-core.mjs` (imported, not copied)
- `scripts/score/role-scorer.mjs` (invoked, not copied)

## Annotated commands

Offline test — 67 checks across 14 tests, fixtures only, no network:

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py
```

Rebuild the G3 liveness ledger from saved captures (hosts contacted: none):

```bash
node scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/liveness_from_fixtures.mjs
```

Full sample run against the real 30,369-row CSV:

```bash
python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
  --out-dir course/2026fa/submissions/beswathi/runs \
  --liveness-ledger scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/liveness-ledger.json \
  --home-state MA --today 2026-10-02
```

Score with the repository's scorer (always pass `--out-dir`):

```bash
npm run score -- course/2026fa/submissions/beswathi/runs/dataeng-roles.json \
  --out-dir course/2026fa/submissions/beswathi/runs
```

Expected on 2026-10-02: `8 roles → Apply 2 · Consider 0 · Skip 6 (skip 75%)`.

## Where the output goes in a 3-3-2 day

| Bucket | Hours it feeds |
|---|---|
| `Apply` after G3 clears | the **2** research-and-apply hours |
| `no-record` + recent funding | the **3** networking hours — these are conversations, not applications |
| `record-negative`, `expired`, `uncertain` | neither; skipped with a stated reason |

## Human gate

**G3 (liveness) is never cleared by the script.** The script emits the verdict it was
given and labels its source. A human runs `npm run ats:liveness` against the real
posting and records the result before any application is sent.
