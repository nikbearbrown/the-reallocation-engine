# Finance data-engineering triage — 2026-10-01

## Executive summary

This report sorts 2 employer(s) into what to do next for a STEM-OPT master's graduate targeting data-engineering and business-intelligence roles. Each employer was checked against past visa-sponsorship records, the job titles it actually sponsored, its recorded pay level, recent funding, and the visa calendar. Result: 0 worth tailoring an application to (after an E-Verify check where unknown), 1 where the posting itself may not be a target role, 0 to network into, 0 whose job posting still needs checking by hand, and 0 to skip. Nothing here is a hiring prediction; every number below says where it came from, and the final call is yours.

## Run record

- As of: 2026-10-01 · data mode: **sample** (Form D = shipped samples only)
- Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- Scorer: `node scripts/score/role-scorer.mjs course/2026fa/submissions/Arc-211/runs/breaks/typo-company/roles.json --out-dir course/2026fa/submissions/Arc-211/runs/breaks/typo-company`

### Visa-timeline gate (all your-input)

- Program end 2026-12-20; OPT filing deadline 2027-02-18; assumed OPT start 2026-12-21
- Hiring lag 60 days → earliest offer 2026-11-30; unemployment allowance 90 days
- **Factor 1** — offer lands before OPT starts — no unemployment days used

### Target occupations (BLS national median, record)

- 15-1243.01 Data Warehousing Specialists: $135,980
- 15-1243.00 Database Architects: $135,980
- 15-2051.01 Business Intelligence Analysts: $112,590
- 15-1242.00 Database Administrators: $104,620

## Decisions

| Company | Next action | Score | Sponsorship [record → your-input tier] | Fit [model-judgment] | Liveness [label] | E-Verify [label] | Pay median, all titles [record] | Latest funding [record] |
|---|---|---|---|---|---|---|---|---|
| SOCAIL FINANCE INC | **not-in-data** | — (not-found) | — | — | — | — | — | — |
| SOCIAL FINANCE INC | **review-role-fit** | 0.315 Apply | 182 appr, 100.0% → Proven | — | active [record] | confirmed [record] | $169,488 (meets-floor) | 2020-12-30 |

## Why each row

- **SOCAIL FINANCE INC** — company not in the sponsorship CSV — no value invented
- **SOCIAL FINANCE INC** (posting: Fraud Model Analyst; liveness record) — composite 0.315 ≥ 0.3, gates healthy; (0.9·0.35) × 1 × 1 = 0.315. Fit: no target-role match on posting title "Fraud Model Analyst" — no fit vote

## What this run could not verify

- **E-Verify enrollment** — no data in the repo; every "unknown" must be looked up by hand before tailoring (gate G4).
- **Role-specific sponsorship** — the CSV lists only a company's top sponsored titles; a missing data-engineer title is not evidence they never sponsor one.
- **Pay for the actual role** — the company median covers all sponsored titles; the BLS figure is a national occupation median, not an offer.
- **Funding** — the latest-funding date comes from the 80 Days CSV; the Form D cross-check uses a 50-row-per-quarter sample, so "no hit" means "not in the sample".
- **Liveness** — read from a hand-transcribed `ats:liveness` result; this script never touches the network.

## Human gate

Before acting on any row: confirm the posting is still live, look up E-Verify, and read the sponsored titles yourself. Record the decision in the run log.
