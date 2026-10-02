# SOURCES — dataeng-sponsor-coverage

## Executive summary

Every number in this submission comes from one of four places, all of them shipped
inside this repository. **No external host was contacted at any point.** This file
says where each input came from, what it is labelled in the output, and what it does
not support.

Source labels follow `DATA_CONTRACT.md`: `record` (something a dataset states),
`model-judgment` (an inference), `your-input` (a human assumption).

---

## 1. `mapped_student_employment_targets_v3.csv`

| | |
|---|---|
| Path | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` |
| Rows used | 30,369 (all) |
| Label | `record` |
| Origin | The **80 Days to Stay** project, shipped with this repository under MIT (Copyright © 2025 Nik Bear Brown) |
| Retrieved | Not retrieved — read from the clone. No fetch, no API call. |

**What the project says it is.** Per `data/80-days-to-stay/README.md` (Day 08), it is
a master file built by mapping an SEC-derived startup list against two US government
datasets: **DOL LCA Disclosure Data** (H-1B, H-1B1, E-3 applications) and the
**USCIS H-1B Employer Data Hub** (approval and denial counts).

**Fields this recipe reads:** `company_name`, `industry`, `city`, `state`,
`latest_funding_stage`, `latest_funding_date`, `total_funding`,
`latest_funding_amount`, `Total Approvals`, `Total Denials`, `Approval_Rate`,
`top_job_titles_sponsored`, `median_salary_offered` (printed, never scored).

**Fields this recipe deliberately does not read.** The file also carries `phone`,
`executive_officers` and `board_directors`. These are named individuals and a
contact number; nothing in this recipe reads them, and no output file contains
them. This is checked, not assumed — `npm run pii-scan` is clean over the branch
apart from one pre-existing finding in `package-lock.json`.

**What it supports.** That a company row exists; whether its approval cells are
populated, positive, or blank; the funding stage and date it records; the job titles
it records as sponsored.

**What it does not support.**
- *That a blank `Total Approvals` means a company does not sponsor.* The file is
  silent. 28,812 of 30,369 rows are blank and exactly 5 record a zero.
- *That the mapped population is representative.* Someone chose which companies to
  map. Base rates computed here describe **this file**, not the US economy, and I
  cannot correct for that selection.
- *That a recorded title is the job you would be hired into.* Titles come from
  filings, not job descriptions, and 21 of them carry a requisition id.
- *Currency.* The file is a snapshot. Nothing in it says a company still sponsors.

## 2. `soc_occupation_compact.csv`

| | |
|---|---|
| Path | `data/bls/compact/soc_occupation_compact.csv` |
| Rows used | 2 — `15-1243.01` (Data Warehousing Specialists), `15-2051.00` (Data Scientists) |
| Label | `record` |
| Origin | BLS **OEWS** wage data (`oews_year` 2024) joined to **O\*NET** ability and skill levels; shipped with the repo |

**Used for:** the role-quality context block in the human report — median wage,
employment, and O\*NET ability levels.

**Explicitly not used for scoring.** `scripts/score/role-scorer.mjs` sets
`role_quality` weight to `0.0` and marks it `[VERIFY]` — the chapter does not pin it.
Feeding these rows to the scorer would change no verdict, so they are printed for the
human and never passed in. Saying this plainly is the point; a number that moves
nothing should not be dressed as a factor.

## 3. Liveness verdicts — `classifyLiveness` over saved captures

| | |
|---|---|
| Classifier | `scripts/ats/liveness-core.mjs` (this repository's own, **imported, not reimplemented**) |
| Captures | `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/fixtures/postings.fixture.json` |
| Ledger | `…/fixtures/liveness-ledger.json` — 8 postings → active 2, expired 5, uncertain 1 |
| Label | `record (classifyLiveness) over fixture capture` — **not** plain `record` |

**Why the compound label.** The verdict is produced by real repository logic, so it
is a record in that sense. But the page it ran against is a saved fixture, not a
live fetch. Both halves are true and the label states both, so a reader is never led
to believe a posting was checked today.

**Hosts contacted: none.** The URLs inside the fixtures are `example`-domain
placeholders (`boards.greenhouse.io/example/...`, `jobs.lever.co/example/...`). They
were never requested. `liveness_from_fixtures.mjs` makes no network call.

**Which companies the captures cover, and why those.** The eight captures cover the
first eight companies in the pipeline's own reachable order. That rule is stated so
it can be checked; an earlier set named companies the seniority filter removes, which
silently made every scored role fail G3. The rule exists to stop a hand-picked set
from passing as a sample.

**What this does not support.** That any posting is live right now. **G3 is not
cleared.** Clearing it requires `npm run ats:liveness -- <job-url>` against the real
posting, performed by a human, and that has not been done.

## 4. The OPT timeline — `your-input`

| Value | Source |
|---|---|
| I-20 end date 2026-12-15 | the student's own I-20 |
| OPT start requestable 2026-12-16 → 2027-02-13 | the same document |
| Planned OPT start 2027-01-15 | the student's choice |
| 90 days permitted unemployment | USCIS rule for post-completion OPT |
| **75-day hiring lag** | **assumed. Nothing measured it.** |

The first four are facts about one person's immigration paperwork. The fifth is an
invention, and it is the weakest input in the whole recipe: it drives the G4 gate
that can zero every role. It is labelled `your-input` in the output so a reader meets
the assumption rather than discovering it. Labelling an invented number does not make
it a better number — it only makes it visible.

**No personal document is committed to this branch.** The dates appear as constants
in the script; the I-20 itself is not in the repository, and never was.

## 5. Code reused rather than rewritten

| Component | Path | Why reused |
|---|---|---|
| Liveness classifier | `scripts/ats/liveness-core.mjs` | reimplementing it would let my copy drift from the repo's rules; importing means the ledger changes when the repo's rules change |
| Role scorer | `scripts/score/role-scorer.mjs` | invoked via `npm run score`, never copied or modified. The verdicts in this submission are the repository's, not mine. |
| Conformance / PII / manifest checks | `scripts/conformance.mjs`, `scripts/pii-scan.mjs`, `scripts/manifest-check.mjs` | run as-is |

Nothing in `scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/` modifies any
file outside that directory, `recipes/cases/2026fa/`, `course/2026fa/submissions/beswathi/`
and `logs/runs/`.

## 6. Course material

- Ch. 11, the Bayesian role scorer — votes versus gates, and the rule that a closed
  gate multiplies the composite to zero regardless of votes. This is the distinction
  the recipe's G3 and G4 are built on.
- `DATA_CONTRACT.md` — the `record` / `model-judgment` / `your-input` labels, used on
  every evidence term in the agent output.
- `recipes/_shared.md` — phase gates, logging rules, and the run-entry template that
  `logs/runs/2026fa-beswathi-1.md` follows.
- The 3-3-2 day — 3 hours networking, 3 learning, 2 applying — which is what the
  recipe's three output buckets are shaped to feed.

## 7. Dependencies

- **Python 3**, standard library only. No `pip install`, no virtualenv.
- **Node 20+**, for the fixture ledger and `npm run score`. No new npm dependency was
  added; `package.json` and `package-lock.json` are untouched by this branch.
