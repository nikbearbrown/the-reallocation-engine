# dataeng-sponsor-coverage — human report

**Recipe:** `beswathi-dataeng-sponsor-coverage` v0.1.0  
**Run date:** 2026-10-02  
**Input:** `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (30369 rows read)

## What this run found

| Bucket | Count | Next action in the 3-3-2 day |
|---|---:|---|
| Apply candidates (sponsorship **on record**) | 8 | the 2 applying hours — after G3 liveness |
| Network targets (**no** sponsorship record, funded) | 26337 | the 3 networking hours |
| Skips (record-negative: denials only) | 0 | skip, with a reason |
| **Senior-only sponsors** | 101 | **not reachable at <1 yr experience** |

Skip is a success. A company in the middle bucket is **not** a non-sponsor —
it is a company with no record either way, which is a different event.

### The seniority wall

This student has under a year of experience. In the shipped file, of the
sponsored data/AI titles: **47.5% are senior-coded** (Senior / Staff / Lead /
Principal / II+), **52.1% are unmarked**, and **exactly one title in 30,369
companies is explicitly junior**. Companies filing H-1B essentially do not
file for juniors.

So 235 companies sponsor *some* data/AI title, but only ~136 sponsor one a new
grad could hold. The 101 companies above are recorded, not silently dropped:
they sponsor, but only at a level this student cannot apply to yet. For a
job search that is a different fact from "does not sponsor", and it is the
second-largest bucket on this page.

## Timeline gate (your-input)

- I-20 end: `2026-12-15`
- OPT start planned: `2027-01-15`
- Hiring lag assumed: **75 days** (assumption, not a measurement)
- Unemployment allowance: 90 days
- Gate factor: **1.0** (ok)

## Role-quality rows loaded (record)

- SOC rows: `15-1243.01, 15-2051.00`
- Problem: `none`

> Role quality carries **zero weight** in `scripts/score/role-scorer.mjs`
> (`role_quality: 0.0`, tagged `[VERIFY]`). This recipe therefore reports the
> SOC wage/ability rows in this human report only, and does **not** feed them
> to the scorer. See DOMAIN.md → Known gaps, fact 1.

## Data problems encountered (21)

- `AMGEN INC` — title-carries-req-id:Data Engineer 20516.3745 -> Data Engineer
- `AMGEN INC` — title-carries-req-id:Strategy Sr. Manager 20516.2439 -> Strategy Sr. Manager
- `AMGEN INC` — title-carries-req-id:Commercial Leadership Program 20516.4093 -> Commercial Leadership Program
- `AMGEN INC` — title-carries-req-id:Principal IS Architect 20516.1936.14 -> Principal IS Architect
- `AMGEN INC` — title-carries-req-id:Sr. Associate IS Engineer 20516.3864.5 -> Sr. Associate IS Engineer
- `GLASSDOOR INC` — title-carries-req-id:Director of Engineering (Sr Engineering Manager) (20639.86) -> Director of Engineering (Sr Engineering Manager)
- `GLASSDOOR INC` — title-carries-req-id:Manager, Data Science (20639.33) -> Manager, Data Science
- `GLASSDOOR INC` — title-carries-req-id:Manager, Data Science (20639.60) -> Manager, Data Science
- `GLASSDOOR INC` — title-carries-req-id:Manager, Data Engineering (20639.22.16) -> Manager, Data Engineering
- `PALANTIR TECHNOLOGIES INC` — title-carries-req-id:Deployment Strategist (11525.3115) -> Deployment Strategist

## Sponsorship base rate by funding stage (computed from this file)

| Stage | Sponsors / companies | Base rate |
|---|---:|---:|
| Pre-Seed | 137 / 9658 | **1.4%** |
| Seed | 188 / 6325 | **3.0%** |
| Series A | 329 / 6196 | **5.3%** |
| Series B | 364 / 3300 | **11.0%** |
| Series C | 265 / 1421 | **18.6%** |
| Series D+ | 249 / 974 | **25.6%** |

This is the one number this recipe adds. A company with **no** sponsorship
record is not a dead end and not a yes — but its funding stage carries a
base rate, and the spread is large enough to triage on.

**What it is not.** A base rate over this file is not a prediction about any
single company, and this file contains companies someone already chose to
map — so these rates describe the file, not the economy. Stages with fewer
than 100 companies get no rate rather than a noisy one.

## Where the reachable market is (record)

Counted from the shipped file: employers with a sponsored target title,
split by whether any of those titles sits at a level a new grad could hold.

| State | Sponsors (any level) | New-grad reachable | Share of reachable |
| --- | ---: | ---: | ---: |
| CA | 141 | **84** | 62.7% |
| NY | 49 | **24** | 17.9% |
| MA (home) | 22 | **15** | 11.2% |
| WA | 10 | **5** | 3.7% |
| TX | 8 | **4** | 3.0% |
| IL | 5 | **2** | 1.5% |

**Read this as geography, not as a gate.** This run does not filter on
location and does not score a role down for being far away: the candidate
is open to relocation inside the US and to remote work, so a distant role
is a real option rather than a dead end. Adding a location filter here
would be the scorer deciding something the human already decided.

What the table is for is sizing the cost of *choosing* to stay put.
CA + NY + WA hold 113 of 134 new-grad-reachable sponsors (84.3%).
MA holds 15 (11.2%), so restricting the search to MA would discard about 89% of the employers that can hire this profile at this level. That is a decision worth making deliberately rather than by default.

### MA shortlist (13, unverified — still behind G3)

The home-state employers this pass reached. They are listed because
they are cheap to pursue in person, not because they scored better:
none has cleared the liveness gate, and none is ranked above a
candidate elsewhere.

| Company | City | Title |
| --- | --- | --- |
| BENEFITS SCIENCE LLC | Waltham | Data Analyst |
| COHERE HEALTH INC | Boston | Machine Learning Engineer |
| DATAROBOT INC | Boston | Pre-Sales Data Scientist |
| ECLINICAL SOLUTIONS LLC | Mansfield | DATA ENGINEER |
| KENSHO TECHNOLOGIES INC | Cambridge | Machine Learning Engineer |
| KLAVIYO INC | Boston | Business Intelligence Engineer |
| LENDBUZZ INC | Boston | Machine Learning Engineer |
| MOBI SYSTEMS INC | Somerville | Data Scientist |
| NFERENCE INC | Cambridge | Data Scientist |
| PERSIVIA INC | Marlborough | Business Intelligence Analyst |
| PRM SOLUTIONS INC | Cambridge | Backend Data Engineer |
| SOFAR SOUNDS LTD | Somerville | Data Analyst |
| WIREWHEEL INC | Boston | Data Engineer |

## Top network targets (no record + funded, ranked by stage base rate)

| Company | Industry | Stage | Base rate | Funded |
|---|---|---|---:|---|
| ARES ACQUISITION CORP II | Other | Series D+ | 25.6% | 2025-09-15 |
| FORWARD INDUSTRIES INC | Other | Series D+ | 25.6% | 2025-09-10 |
| CARLYLE TACTICAL PRIVATE CREDIT FUND | Investing | Series D+ | 25.6% | 2025-09-08 |
| ATS HOLDINGS LLC | Investing | Series D+ | 25.6% | 2025-08-29 |
| GLYDWAYS INC | Other Technology | Series D+ | 25.6% | 2025-08-29 |
| HERITAGE DISTILLING HOLDING COMPANY INC | Other | Series D+ | 25.6% | 2025-08-15 |
| GI ALLIANCE HOLDINGS LLC | Other | Series D+ | 25.6% | 2025-08-12 |
| ELISE AI TECHNOLOGIES CORP | Other Technology | Series D+ | 25.6% | 2025-08-05 |
| GENESYS CLOUD SERVICES TOPCO LLC | Other Technology | Series D+ | 25.6% | 2025-07-31 |
| ACUMERA HOLDINGS LLC | Other Technology | Series D+ | 25.6% | 2025-07-30 |
| INNOVATE CORP | Other | Series D+ | 25.6% | 2025-07-30 |
| RAMP BUSINESS CORP | Other Technology | Series D+ | 25.6% | 2025-07-28 |
| BLOCKRATIZE INC | Other Technology | Series D+ | 25.6% | 2025-07-18 |
| MAPLIGHT THERAPEUTICS INC | Biotechnology | Series D+ | 25.6% | 2025-07-18 |
| BASE BOY ENTERTAINMENT NETWORK INC | Other Technology | Series D+ | 25.6% | 2025-07-17 |

## Apply candidates

| Company | Title | Sponsorship p | Source |
|---|---|---:|---|
| ACE-UP INC | Business Intelligence Analyst | 1.0 | `record` |
| ADEPT ID INC | Research Data Scientist | 1.0 | `record` |
| AFFINITY SOLUTIONS INC | DATA SCIENTIST | 1.0 | `record` |
| AGENT TECHNOLOGIES INC | Machine Learning Engineer | 0.982 | `record` |
| AIM INTELLIGENT MACHINES INC | Machine Learning Engineer | 1.0 | `record` |
| AIRBNB INC | Data Scientist | 0.99 | `record` |
| ALLAKOS INC | Data Analyst | 1.0 | `record` |
| ALVEO TECHNOLOGIES INC | Data Scientist | 1.0 | `record` |

## Human gate

G3 (liveness) is **not cleared by this script**. Before any Apply,
a human runs `npm run ats:liveness -- <job-url>` and records the result.
This script emits `liveness.source: model-judgment` precisely so the
scorer's Apply cannot be mistaken for a verified live posting.
