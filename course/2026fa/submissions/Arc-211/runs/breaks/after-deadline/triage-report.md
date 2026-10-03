# Finance data-engineering triage — 2027-03-01

## Executive summary

This report sorts 13 employer(s) into what to do next for a STEM-OPT master's graduate targeting data-engineering and business-intelligence roles. Each employer was checked against past visa-sponsorship records, the job titles it actually sponsored, its recorded pay level, recent funding, and the visa calendar. Result: 0 worth tailoring an application to (after an E-Verify check where unknown), 0 where the posting itself may not be a target role, 0 to network into, 0 whose job posting still needs checking by hand, and 12 to skip. Nothing here is a hiring prediction; every number below says where it came from, and the final call is yours.

## Run record

- As of: 2027-03-01 · data mode: **sample** (Form D = shipped samples only)
- Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- Scorer: `node scripts/score/role-scorer.mjs course/2026fa/submissions/Arc-211/runs/breaks/after-deadline/roles.json --out-dir course/2026fa/submissions/Arc-211/runs/breaks/after-deadline`

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
- Hiring lag 60 days → earliest offer 2027-04-30; unemployment allowance 90 days
- **Factor 0** — OPT not filed and the filing window closed on 2027-02-18

### Target occupations (BLS national median, record)

- 15-1243.01 Data Warehousing Specialists: $135,980
- 15-1243.00 Database Architects: $135,980
- 15-2051.01 Business Intelligence Analysts: $112,590
- 15-1242.00 Database Administrators: $104,620

## Decisions

| Company | Next action | Score | Sponsorship [record → your-input tier] | Fit [model-judgment] | Liveness [label] | E-Verify [label] | Pay median, all titles [record] | Latest funding [record] |
|---|---|---|---|---|---|---|---|---|
| GEMINI SPACE STATION LLC | **skip** | 0.000 Skip | 24 appr, 100.0% → Proven | 0.8 | active [record] | confirmed [record] | $150,000 (meets-floor) | 2021-11-19 |
| GREEN DOT CORP | **skip** | 0.000 Skip | 92 appr, 100.0% → Proven | 0.8 | active [your-input] | confirmed [record] | $122,033 (meets-floor) | 2024-09-06 |
| GUARANTR INC | **skip** | — (timeline-closed) | 60 appr, 100.0% → Proven | 0.5 | — | unknown [your-input] | $110,500 (meets-floor) | 2017-09-01 |
| HOULIHAN LOKEY INC | **skip** | — (timeline-closed) | 84 appr, 93.3% → Proven | 0.5 | — | unknown [your-input] | $135,000 (meets-floor) | — |
| MULLIGAN FUNDING LLC | **skip** | — (timeline-closed) | 4 appr, 100.0% → Weak | 0.5 | — | unknown [your-input] | $100,000 (meets-floor) | 2023-04-24 |
| PROSPER MARKETPLACE INC | **skip** | — (timeline-closed) | 184 appr, 98.9% → Proven | 0.5 | — | unknown [your-input] | $131,498 (meets-floor) | 2015-04-07 |
| REMITLY INC | **skip** | 0.000 Skip | 344 appr, 98.9% → Proven | 0.8 | active [your-input] | confirmed [record] | $145,274 (meets-floor) | 2017-11-10 |
| RYAN SPECIALTY GROUP LLC | **skip** | — (timeline-closed) | 14 appr, 100.0% → Likely | 0.8 | — | unknown [your-input] | $92,000 (meets-floor) | 2020-09-01 |
| SIMPL INC | **skip** | — (timeline-closed) | 2 appr, 100.0% → Weak | 0.5 | — | unknown [your-input] | $117,187 (meets-floor) | 2021-09-30 |
| SOCIAL FINANCE INC | **skip** | 0.000 Skip | 182 appr, 100.0% → Proven | — | active [record] | confirmed [record] | $169,488 (meets-floor) | 2020-12-30 |
| SOLAR MOSAIC INC | **skip** | — (timeline-closed) | 10 appr, 100.0% → Likely | 0.8 | — | unknown [your-input] | $143,500 (meets-floor) | 2015-04-23 |
| UPSTART NETWORK INC | **skip** | — (timeline-closed) | 316 appr, 99.4% → Proven | 0.8 | — | unknown [your-input] | $160,000 (meets-floor) | 2013-01-17 |
| JPMORGAN CHASE & CO | **not-in-data** | — (not-found) | — | — | — | — | — | — |

## Why each row

- **GEMINI SPACE STATION LLC** (posting: Senior Data Engineer; liveness record) — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes); (0.9·0.35 + 0.8·0.3) × 1 × 0 = 0.000. Fit: rule-based strong match on posting title "Senior Data Engineer"
- **GREEN DOT CORP** (posting: Senior Data Analyst; liveness your-input) — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes); (0.9·0.35 + 0.8·0.3) × 1 × 0 = 0.000. Fit: rule-based strong match on posting title "Senior Data Analyst"
- **GUARANTR INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based weak match on fallback — company's sponsored titles (Technical Business Analyst)
- **HOULIHAN LOKEY INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based weak match on fallback — company's sponsored titles (Senior Business Analyst, HCG)
- **MULLIGAN FUNDING LLC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based weak match on fallback — company's sponsored titles (Data Scientist)
- **PROSPER MARKETPLACE INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based weak match on fallback — company's sponsored titles (Credit Risk Analytics Senior Manager | Operations Analytics Manager)
- **REMITLY INC** (posting: Data Analyst; liveness your-input) — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes); (0.9·0.35 + 0.8·0.3) × 1 × 0 = 0.000. Fit: rule-based strong match on posting title "Data Analyst"
- **RYAN SPECIALTY GROUP LLC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based strong match on fallback — company's sponsored titles (Data Analyst, Catastrophe Modeling)
- **SIMPL INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based weak match on fallback — company's sponsored titles (Data Scientist)
- **SOCIAL FINANCE INC** (posting: Fraud Model Analyst; liveness record) — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes); (0.9·0.35) × 1 × 0 = 0.000. Fit: no target-role match on posting title "Fraud Model Analyst" — no fit vote
- **SOLAR MOSAIC INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based strong match on fallback — company's sponsored titles (Customer Experience (CX) Ops Data Analyst)
- **UPSTART NETWORK INC** — timeline gate closed (OPT not filed and the filing window closed on 2027-02-18) — not worth checking the posting. Fit: rule-based strong match on fallback — company's sponsored titles (Data Engineer)
- **JPMORGAN CHASE & CO** — company not in the sponsorship CSV — no value invented

## What this run could not verify

- **E-Verify enrollment** — no data in the repo; every "unknown" must be looked up by hand before tailoring (gate G4).
- **Role-specific sponsorship** — the CSV lists only a company's top sponsored titles; a missing data-engineer title is not evidence they never sponsor one.
- **Pay for the actual role** — the company median covers all sponsored titles; the BLS figure is a national occupation median, not an offer.
- **Funding** — the latest-funding date comes from the 80 Days CSV; the Form D cross-check uses a 50-row-per-quarter sample, so "no hit" means "not in the sample".
- **Liveness** — read from a hand-transcribed `ats:liveness` result; this script never touches the network.

## Human gate

Before acting on any row: confirm the posting is still live, look up E-Verify, and read the sponsored titles yourself. Record the decision in the run log.
