# Finance data-engineering triage — 2026-10-01

## Executive summary

This report sorts 13 employer(s) into what to do next for a STEM-OPT master's graduate targeting data-engineering and business-intelligence roles. Each employer was checked against past visa-sponsorship records, the job titles it actually sponsored, its recorded pay level, recent funding, and the visa calendar. Result: 3 worth tailoring an application to (after an E-Verify check where unknown), 1 where the posting itself may not be a target role, 0 to network into, 8 whose job posting still needs checking by hand, and 0 to skip. Nothing here is a hiring prediction; every number below says where it came from, and the final call is yours.

## Run record

- As of: 2026-10-01 · data mode: **sample** (Form D = shipped samples only)
- Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- Scorer: `node scripts/score/role-scorer.mjs course/2026fa/submissions/Arc-211/runs/triage/roles.json --out-dir course/2026fa/submissions/Arc-211/runs/triage`

### How the list was narrowed

| Step | Count | Label |
|---|---|---|
| Companies in CSV | 30369 | record |
| …with any H-1B data | 1557 | record |
| Industry matches `financ|bank|insur|invest|capital|fintech|payment` | 2425 | your-input filter on record |
| …with H-1B data | 34 | record |
| …H-1B blank (unknown, not scored) | 2391 | record |
| …sponsored a data/BI-type title | 12 | model-judgment (title rule) |

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
| GEMINI SPACE STATION LLC | **tailor-application** | 0.555 Apply | 24 appr, 100.0% → Proven | 0.8 | active [record] | confirmed [record] | $150,000 (meets-floor) | 2021-11-19 |
| GREEN DOT CORP | **tailor-application** | 0.555 Apply | 92 appr, 100.0% → Proven | 0.8 | active [your-input] | confirmed [record] | $122,033 (meets-floor) | 2024-09-06 |
| GUARANTR INC | **check-posting-by-hand** | — (needs-liveness-check) | 60 appr, 100.0% → Proven | 0.5 | — | unknown [your-input] | $110,500 (meets-floor) | 2017-09-01 |
| HOULIHAN LOKEY INC | **check-posting-by-hand** | — (needs-liveness-check) | 84 appr, 93.3% → Proven | 0.5 | — | unknown [your-input] | $135,000 (meets-floor) | — |
| MULLIGAN FUNDING LLC | **check-posting-by-hand** | — (needs-liveness-check) | 4 appr, 100.0% → Weak | 0.5 | — | unknown [your-input] | $100,000 (meets-floor) | 2023-04-24 |
| PROSPER MARKETPLACE INC | **check-posting-by-hand** | — (needs-liveness-check) | 184 appr, 98.9% → Proven | 0.5 | — | unknown [your-input] | $131,498 (meets-floor) | 2015-04-07 |
| REMITLY INC | **tailor-application** | 0.555 Apply | 344 appr, 98.9% → Proven | 0.8 | active [your-input] | confirmed [record] | $145,274 (meets-floor) | 2017-11-10 |
| RYAN SPECIALTY GROUP LLC | **check-posting-by-hand** | — (needs-liveness-check) | 14 appr, 100.0% → Likely | 0.8 | — | unknown [your-input] | $92,000 (meets-floor) | 2020-09-01 |
| SIMPL INC | **check-posting-by-hand** | — (needs-liveness-check) | 2 appr, 100.0% → Weak | 0.5 | — | unknown [your-input] | $117,187 (meets-floor) | 2021-09-30 |
| SOCIAL FINANCE INC | **review-role-fit** | 0.315 Apply | 182 appr, 100.0% → Proven | — | active [record] | confirmed [record] | $169,488 (meets-floor) | 2020-12-30 |
| SOLAR MOSAIC INC | **check-posting-by-hand** | — (needs-liveness-check) | 10 appr, 100.0% → Likely | 0.8 | — | unknown [your-input] | $143,500 (meets-floor) | 2015-04-23 |
| UPSTART NETWORK INC | **check-posting-by-hand** | — (needs-liveness-check) | 316 appr, 99.4% → Proven | 0.8 | — | unknown [your-input] | $160,000 (meets-floor) | 2013-01-17 |
| JPMORGAN CHASE & CO | **not-in-data** | — (not-found) | — | — | — | — | — | — |

## Why each row

- **GEMINI SPACE STATION LLC** (posting: Senior Data Engineer; liveness record) — composite 0.555 ≥ 0.3, gates healthy; (0.9·0.35 + 0.8·0.3) × 1 × 1 = 0.555. Fit: rule-based strong match on posting title "Senior Data Engineer"
- **GREEN DOT CORP** (posting: Senior Data Analyst; liveness your-input) — composite 0.555 ≥ 0.3, gates healthy; (0.9·0.35 + 0.8·0.3) × 1 × 1 = 0.555. Fit: rule-based strong match on posting title "Senior Data Analyst"
- **GUARANTR INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based weak match on fallback — company's sponsored titles (Technical Business Analyst)
- **HOULIHAN LOKEY INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based weak match on fallback — company's sponsored titles (Senior Business Analyst, HCG)
- **MULLIGAN FUNDING LLC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based weak match on fallback — company's sponsored titles (Data Scientist)
- **PROSPER MARKETPLACE INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based weak match on fallback — company's sponsored titles (Credit Risk Analytics Senior Manager | Operations Analytics Manager)
- **REMITLY INC** (posting: Data Analyst; liveness your-input) — composite 0.555 ≥ 0.3, gates healthy; (0.9·0.35 + 0.8·0.3) × 1 × 1 = 0.555. Fit: rule-based strong match on posting title "Data Analyst"
- **RYAN SPECIALTY GROUP LLC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based strong match on fallback — company's sponsored titles (Data Analyst, Catastrophe Modeling)
- **SIMPL INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based weak match on fallback — company's sponsored titles (Data Scientist)
- **SOCIAL FINANCE INC** (posting: Fraud Model Analyst; liveness record) — composite 0.315 ≥ 0.3, gates healthy; (0.9·0.35) × 1 × 1 = 0.315. Fit: no target-role match on posting title "Fraud Model Analyst" — no fit vote
- **SOLAR MOSAIC INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based strong match on fallback — company's sponsored titles (Customer Experience (CX) Ops Data Analyst)
- **UPSTART NETWORK INC** — no liveness check recorded — not sent to the scorer (it would default to 1.0). Fit: rule-based strong match on fallback — company's sponsored titles (Data Engineer)
- **JPMORGAN CHASE & CO** — company not in the sponsorship CSV — no value invented

## What this run could not verify

- **E-Verify enrollment** — no data in the repo; every "unknown" must be looked up by hand before tailoring (gate G4).
- **Role-specific sponsorship** — the CSV lists only a company's top sponsored titles; a missing data-engineer title is not evidence they never sponsor one.
- **Pay for the actual role** — the company median covers all sponsored titles; the BLS figure is a national occupation median, not an offer.
- **Funding** — the latest-funding date comes from the 80 Days CSV; the Form D cross-check uses a 50-row-per-quarter sample, so "no hit" means "not in the sample".
- **Liveness** — read from a hand-transcribed `ats:liveness` result; this script never touches the network.

## Human gate

Before acting on any row: confirm the posting is still live, look up E-Verify, and read the sponsored titles yourself. Record the decision in the run log.
