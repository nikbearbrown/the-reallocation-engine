# Data-Analyst Sponsor Check — 2026-10-02

## Executive summary

This report checks 6 job leads for a fictional international student on F-1 OPT who is looking for data analyst work in the Boston area. For each lead it asks three questions: has this company sponsored work visas for *data-analyst* jobs specifically, is the job posting still open, and can hiring finish before the student's work permission or allowed unemployment days run out?

**Result:** 0 lead(s) worth tailoring an application for, 1 to network into instead, 1 to skip, and 4 that need a person to look before anything else happens. The deadline that binds first is the **90-day unemployment limit**: 49 days of runway left on 2026-10-02.

Nothing here is legal advice. Questions about OPT or STEM-extension eligibility go to the DSO.

## Run record

- Prototype: `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs`
- Data: sponsors `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · wages `data/bls/compact/soc_occupation_compact.csv` · Form D `data/sec/form-d/processed/sample` (samples only)
- Liveness: live Playwright check this run (scripts/ats/liveness-browser.mjs)
- Scorer: `scripts/score/role-scorer.mjs` → ✓ scored 1 roles → Apply 0 · Consider 0 · Skip 1 (skip 100%)

## Leads and next actions

| Lead | Analyst-sponsor tier | Posting | Timeline | Scorer | Next action |
|---|---|---|---|---|---|
| EverQuote — Senior Analyst, SEM | Likely (p 0.6) | uncertain | 0.7 (inside-buffer) | not scored | **Human: open the posting** — liveness: uncertain |
| Abacus Insights — Growth Analytics Manager, Payment Integrity | Likely (p 0.6) | uncertain | 1 (clear) | not scored | **Human: open the posting** — liveness: uncertain |
| Klaviyo — Analytics Engineer | Unknown (p 0.15) | active | 0 (start-after-cliff) | Skip 0.000 | **Skip** — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Benefits Science LLC — Data Analyst (no open posting found) | Proven (p 0.9) | no-posting | 1 (clear) | not scored | **Network first (informational chat)** — Proven analyst sponsor with no posting to apply to |
| Writer — Posting from repo examples | — (no-h1b-record) | — | — | not scored | **Human: confirm the company** — company identity: no-h1b-record |
| HubSpot — Data Analyst | — (not-in-dataset) | — | — | not scored | **Human: confirm the company** — company identity: not-in-dataset |

## Evidence per lead (every value labeled)

### EverQuote — Senior Analyst, SEM

- Company match [record]: **found** → EVERQUOTE INC
- H-1B approvals / denials [record]: 56 / 0
- Sponsored titles [record] → my classification [your-input]: "Senior Cloud Engineer I" → non-analyst; "Senior Quantitative Analyst" → ambiguous-analyst (`quantitative analyst`); "Senior Engineer" → non-analyst; "Senior Quantitative Analyst (Business)" → ambiguous-analyst (`quantitative analyst`); "Product Manager" → non-analyst; "Quantitative Analyst" → ambiguous-analyst (`quantitative analyst`)
- Tier [your-input rule on record]: **Likely** · p = 0.6 [your-input mapping]
- Wage check 15-2051.01 Business Intelligence Analysts [record]: BLS median $112,590 (OEWS 2024) vs company median offered $117,640 → ratio 1.04 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Wage check 13-1161.00 Market Research Analysts and Marketing Specialists [record]: BLS median $76,950 (OEWS 2024) vs company median offered $117,640 → ratio 1.53 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Form D [record]: not-in-sample — absent from the SAMPLE — says nothing about whether it raised money (200 of 58329 companies across 4 sample quarter file(s))
- Timeline [your-input]: factor 0.7 (inside-buffer); slack = min(210, 49) − 35 = 14; factor = clamp(slack / 20, 0, 1)
- Posting [record]: uncertain — content present but no visible apply control found (checked 2026-10-02T17:47:59.825Z)
- Fit [your-input]: 0.75 (self-rated; no model was asked)

### Abacus Insights — Growth Analytics Manager, Payment Integrity

- Company match [record]: **found** → ABACUS INSIGHTS INC
- H-1B approvals / denials [record]: 22 / 0
- Sponsored titles [record] → my classification [your-input]: "Software Engineer" → non-analyst; "Business Analyst Manager - Data Distribution Team" → ambiguous-analyst (`business analyst`)
- Tier [your-input rule on record]: **Likely** · p = 0.6 [your-input mapping]
- Wage check 15-2051.01 Business Intelligence Analysts [record]: BLS median $112,590 (OEWS 2024) vs company median offered $110,510 → ratio 0.98 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Wage check 13-1161.00 Market Research Analysts and Marketing Specialists [record]: BLS median $76,950 (OEWS 2024) vs company median offered $110,510 → ratio 1.44 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Form D [record]: not-in-sample — absent from the SAMPLE — says nothing about whether it raised money (200 of 58329 companies across 4 sample quarter file(s))
- Timeline [your-input]: factor 1 (clear); slack = min(210, 49) − 28 = 21; factor = clamp(slack / 20, 0, 1)
- Posting [record]: uncertain — navigation error: page.goto: Timeout 15000ms exceeded. (checked 2026-10-02T17:48:14.828Z)
- Fit [your-input]: 0.7 (self-rated; no model was asked)

### Klaviyo — Analytics Engineer

- Company match [record]: **found** → KLAVIYO INC
- H-1B approvals / denials [record]: 154 / 4
- Sponsored titles [record] → my classification [your-input]: "Business Intelligence Engineer" → non-analyst; "Software Engineer II" → non-analyst; "Engineering Manager Data Exchange" → non-analyst; "Engineering Manager II- SMS" → non-analyst; "Senior Software Engineer" → non-analyst
- Tier [your-input rule on record]: **Unknown** · p = 0.15 [your-input mapping]
- Wage check 15-2051.01 Business Intelligence Analysts [record]: BLS median $112,590 (OEWS 2024) vs company median offered $126,000 → ratio 1.12 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Wage check 13-1161.00 Market Research Analysts and Marketing Specialists [record]: BLS median $76,950 (OEWS 2024) vs company median offered $126,000 → ratio 1.64 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Form D [record]: not-in-sample — absent from the SAMPLE — says nothing about whether it raised money (200 of 58329 companies across 4 sample quarter file(s))
- Timeline [your-input]: factor 0 (start-after-cliff); slack = min(210, 49) − 70 = -21; factor = clamp(slack / 20, 0, 1)
- Posting [record]: active — visible apply control detected (checked 2026-10-02T17:48:18.531Z)
- Fit [your-input]: 0.65 (self-rated; no model was asked)
- Scorer: **Skip** — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes); `(0.15·0.35 + 0.65·0.3) × 1 × 0 = 0.000`

### Benefits Science LLC — Data Analyst (no open posting found)

- Company match [record]: **found** → BENEFITS SCIENCE LLC
- H-1B approvals / denials [record]: 18 / 0
- Sponsored titles [record] → my classification [your-input]: "Data Engineer II (00049724)" → non-analyst; "Software Engineer" → non-analyst; "Data Analyst" → data-analyst-family (`data analyst`)
- Tier [your-input rule on record]: **Proven** · p = 0.9 [your-input mapping]
- Wage check 15-2051.01 Business Intelligence Analysts [record]: BLS median $112,590 (OEWS 2024) vs company median offered $82,535 → ratio 0.73 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Wage check 13-1161.00 Market Research Analysts and Marketing Specialists [record]: BLS median $76,950 (OEWS 2024) vs company median offered $82,535 → ratio 1.07 — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Form D [record]: not-in-sample — absent from the SAMPLE — says nothing about whether it raised money (200 of 58329 companies across 4 sample quarter file(s))
- Timeline [your-input]: factor 1 (clear); slack = min(210, 49) − 28 = 21; factor = clamp(slack / 20, 0, 1)
- Posting [your-input]: no-posting
- Fit [your-input]: 0.85 (self-rated; no model was asked)

### Writer — Posting from repo examples

- Company match [record]: **no-h1b-record** → WRITER INC
- Wage check 15-2051.01 Business Intelligence Analysts [record]: BLS median $112,590 (OEWS 2024) vs company median offered — → ratio — — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Wage check 13-1161.00 Market Research Analysts and Marketing Specialists [record]: BLS median $76,950 (OEWS 2024) vs company median offered — → ratio — — company median spans ALL its sponsored roles, not analyst roles only. *Not a scorer input.*
- Form D [record]: not-in-sample — absent from the SAMPLE — says nothing about whether it raised money (200 of 58329 companies across 4 sample quarter file(s))
- Fit [your-input]: 0.6 (self-rated; no model was asked)

### HubSpot — Data Analyst

- Company match [record]: **not-in-dataset**
- Fit [your-input]: 0.8 (self-rated; no model was asked)

## Gates a person must clear

- **G1 Company identity.** For every lead marked *not-in-dataset*, *no-h1b-record*, *ambiguous* or *near matches*: confirm the right company or accept "unknown". Missing from this dataset does not mean the company never sponsors.
- **G2 Posting.** Open every *active* posting yourself before tailoring. Open any *uncertain* one before it is scored.
- **G3 Timeline.** Check the dates in each timeline line. If you are unsure about STEM-extension eligibility, ask your DSO, not this tool.
- **G4 Title review.** For each Proven or Likely lead, read the matched titles below and confirm they are work you would do:
  - EverQuote: "Senior Quantitative Analyst" matched `quantitative analyst` → ambiguous-analyst
  - EverQuote: "Senior Quantitative Analyst (Business)" matched `quantitative analyst` → ambiguous-analyst
  - EverQuote: "Quantitative Analyst" matched `quantitative analyst` → ambiguous-analyst
  - Abacus Insights: "Business Analyst Manager - Data Distribution Team" matched `business analyst` → ambiguous-analyst
  - Benefits Science LLC: "Data Analyst" matched `data analyst` → data-analyst-family

## What this run could not verify

- Whether a company sponsored data analysts specifically: the sponsor CSV lists job titles, not SOC codes, and only a truncated "top" list of them.
- Whether the title keyword rules are right: they are the student's rules, and every match is shown for human review (G4).
- Funding: the shipped Form D files are 50-company samples per quarter, so "not-in-sample" means nothing either way.
- What a specific employer pays an analyst: the company median covers all its sponsored roles, and BLS OEWS is an occupation survey, not an offer.
- Hiring lag and fit: both are the student's own estimates.
- Visa law: the timeline factor is planning arithmetic. STEM-extension eligibility needs a DSO.
