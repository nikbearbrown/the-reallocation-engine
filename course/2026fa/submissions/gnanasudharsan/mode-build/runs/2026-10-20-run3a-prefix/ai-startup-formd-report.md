# AI-startup triage — funding and visa-timeline gates

## Executive summary

This report helps decide where to spend scarce application effort on AI Engineer roles at funded startups, for a student who will need H-1B sponsorship. A company is only considered if its last recorded funding round could plausibly carry it to the H-1B start date (2027-10-01); job postings are only scored if they are confirmed live. Of 107 sponsoring employers with AI job titles, 0 clear the funding and timeline checks outright, 4 cannot be verified (their runway reaches the petition window but not the start date), and the rest fail or lack data. Of 4 postings supplied, 1 were scored, 3 are on hold for a human, and 0 were excluded. Every funding conclusion is computed from funding snapshot dated 2025-09-26; rounds after that date are not visible; a failed check means "not supported by local data", not "the company has closed".

## Run record

- As of: 2026-10-20 · generated 2026-10-21T01:47:25.542Z
- Funding snapshot: 2025-09-26 — computed from funding snapshot dated 2025-09-26; rounds after that date are not visible
- Run gate: **OPEN** — snapshot 2025-09-26 is within the 24-month window (cutoff 2024-10-20)
- Inputs: CSV `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (30369 rows, sha256 eccdee2addf4…) · postings `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/postings.json` · liveness `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/ats-liveness-2026-10-20.txt` · clearance `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/clearance.json` · Form D `data/sec/form-d/processed/sample`

## Decisions in force (human, recorded)

| Decision | Value |
|---|---|
| Funding staleness window | 24 months before the as-of date |
| Minimum funding | latest round ≥ $5,000,000 (funding stage not used) |
| Runway assumption | 24 months after the latest round |
| Visa timeline | PASS if runway reaches 2027-10-01 · CANNOT-VERIFY if it reaches 2027-04-01 but not 2027-10-01 · FAIL if it ends before 2027-04-01 |
| Decided by | Gnanasudharsan Ashokumar, 2026-10-20 |

## Postings

| Posting | Company | Title | Status | Verdict | Reasons / warnings | Scorer (sample) |
|---|---|---|---|---|---|---|
| cohere-health-mle2 | COHERE HEALTH INC | Machine Learning Engineer II | scored | **HOLD — runway unverified** |  | Apply (0.523) |
| codametrix-mle2 | CODAMETRIX INC | Machine Learning Engineer II | held | **HOLD** | liveness-uncertain |  |
| aiera-none | AIERA INC |  | held | **HOLD** | title-not-ai; no-posting-supplied; fit-missing |  |
| membrion-none | MEMBRION INC |  | held | **HOLD** | title-not-ai; no-posting-supplied |  |

**Gate clearance in force (verbatim):** G-TIMELINE cleared by Gnanasudharsan Ashokumar on 2026-10-20. Condition: "A CANNOT-VERIFY company may be scored ONLY if ats:liveness confirms its AI/ML posting is live today. Live hiring is evidence the company is operating; it does NOT prove funding runway to 2027-10-01. Clearance is for sample scoring only: the human report verdict stays "HOLD — runway unverified", never "Apply". Companies that fail liveness or have no posting stay HELD and unscored." Covers: AIERA INC, CODAMETRIX INC, COHERE HEALTH INC, MEMBRION INC. A cleared posting's verdict stays **HOLD — runway unverified**; its scorer output is sample scoring only.

## Companies that reached the visa-timeline check

Each row: computed from funding snapshot dated 2025-09-26; rounds after that date are not visible.

| Company (CSV line) | Latest round | Effective date | Runway ends | Timeline | Approvals / denials | Approval rate | AI titles sponsored | Form D sample |
|---|---|---|---|---|---|---|---|---|
| AIERA INC (972) | 2025-05-15, $25,000,000 | 2025-05-15 | 2027-05-15 | **CANNOT-VERIFY** | 102 / 0 | 100 | AI/DS Engineer | 0 match(es), none newer |
| CODAMETRIX INC (6005) | 2025-04-16, $15,000,000 | 2025-04-16 | 2027-04-16 | **CANNOT-VERIFY** | 18 / 0 | 100 | NLP Scientist | 0 match(es), none newer |
| COHERE HEALTH INC (6084) | 2025-05-07, $89,999,876 | 2025-05-07 | 2027-05-07 | **CANNOT-VERIFY** | 104 / 2 | 98.1132075471698 | Senior Machine Learning DevOps Engineer; Machine Learning Engineer | 0 match(es), none newer |
| MEMBRION INC (16523) | 2025-06-16, $17,113,979 | 2025-06-16 | 2027-06-16 | **CANNOT-VERIFY** | 6 / 0 | 100 | Senior Research Engineer | 0 match(es), none newer |
| AIM INTELLIGENT MACHINES INC (982) | 2024-12-19, $41,069,962 | 2024-12-19 | 2026-12-19 | **FAIL** | 10 / 0 | 100 | Machine Learning Engineer | 0 match(es), none newer |
| BUTLR TECHNOLOGIES INC (4552) | 2024-12-19, $9,316,000 | 2024-12-19 | 2026-12-19 | **FAIL** | 14 / 0 | 100 | Applied Scientist II | 0 match(es), none newer |
| CELESTIAL AI INC (5182) | 2025-02-25, $152,935,067 | 2025-02-25 | 2027-02-25 | **FAIL** | 56 / 0 | 100 | Machine Learning Engineer; Machine Learning Engineer | 0 match(es), none newer |
| FEMTOSENSE INC (9574) | 2024-11-26, $14,500,000 | 2024-11-26 | 2026-11-26 | **FAIL** | 6 / 2 | 75 | Deep Learning Engineer | 0 match(es), none newer |
| UNDERDOG SPORTS HOLDINGS INC (27952) | 2025-01-28, $175,000,001 | 2025-01-28 | 2027-01-28 | **FAIL** | 4 / 0 | 100 | Senior Machine Learning Engineer | 0 match(es), none newer |
| VOUCH INC (29059) | 2024-11-07, $27,500,001 | 2024-11-07 | 2026-11-07 | **FAIL** | 12 / 0 | 100 | Enterprise Business Operations Manager - AI | 0 match(es), none newer |

Screened employers by outcome:

- CANNOT-VERIFY: 4
- FAIL:funding-below-minimum: 15
- FAIL:funding-stale: 82
- FAIL:runway-ends-before-filing: 6

## Occupation context (does not affect the score)

Shown for orientation only. The scorer gives role quality a weight of 0, so none of these numbers moves a verdict. Blank cells are blank in the source.

| O*NET code | Title | Job zone | Annual median wage | Cognitive pivot score |
|---|---|---|---|---|
| 15-1221.00 | Computer and Information Research Scientists | 5 | 140910.0 | 4.516 |
| 15-1252.00 | Software Developers | 4 | 133080.0 | 3.834 |
| 15-1299.00 | Computer Occupations, All Other |  | 108970.0 |  |
| 15-1299.01 | Web Administrators | 4 | 108970.0 | 3.697 |
| 15-1299.02 | Geographic Information Systems Technologists and Technicians | 3 | 108970.0 | 3.236 |
| 15-1299.03 | Document Management Specialists | 4 | 108970.0 | 3.471 |
| 15-1299.04 | Penetration Testers | 4 | 108970.0 |  |
| 15-1299.05 | Information Security Engineers | 4 | 108970.0 | 3.777 |
| 15-1299.06 | Digital Forensics Analysts | 4 | 108970.0 |  |
| 15-1299.07 | Blockchain Engineers | 4 | 108970.0 |  |
| 15-1299.08 | Computer Systems Engineers/Architects | 3 | 108970.0 | 4.027 |
| 15-1299.09 | Information Technology Project Managers | 4 | 108970.0 | 3.861 |
| 15-2051.00 | Data Scientists | 4 | 112590.0 |  |
| 15-2051.01 | Business Intelligence Analysts | 4 | 112590.0 | 3.903 |
| 15-2051.02 | Clinical Data Managers | 4 | 112590.0 | 3.738 |

## What this run cannot verify

- Funding after 2025-09-26: rounds after the snapshot are invisible unless a local Form D sample record shows a newer filing.
- Actual runway: the runway length is an assumption, not a record.
- Sponsorship volume: the approval rate measures petition outcomes, not how often a company sponsors (6 approvals and 102 approvals can both read 100%).
- Original postings: an aggregator page being live does not prove the employer's own posting is live.
- Fit: every fit value is the student's own judgment.
