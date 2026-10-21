# Data-Analyst Sponsor Check — 2026-10-20

## Executive summary

This report checks 2 job leads for a fictional international student on F-1 OPT who is looking for data analyst work in the Boston area. For each lead it asks three questions: has this company sponsored work visas for *data-analyst* jobs specifically, is the job posting still open, and can hiring finish before the student's work permission or allowed unemployment days run out?

**Result:** 0 lead(s) worth tailoring an application for, 0 to network into instead, 0 to skip, and 2 that need a person to look before anything else happens. The deadline that binds first is the **90-day unemployment limit**: 49 days of runway left on 2026-10-20.

Nothing here is legal advice. Questions about OPT or STEM-extension eligibility go to the DSO.

## Run record

- Prototype: `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs`
- Data: sponsors `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · wages `data/bls/compact/soc_occupation_compact.csv` · Form D `data/sec/form-d/processed` (full quarters, fetched locally)
- Liveness: recorded results from `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json`
- Scorer: `scripts/score/role-scorer.mjs` → no role reached the scorer

## Leads and next actions

| Lead | Analyst-sponsor tier | Posting | Timeline | Scorer | Next action |
|---|---|---|---|---|---|
| Abacus — Growth Analytics Manager, Payment Integrity | — (not-exact-near-matches) | — | — | not scored | **Human: confirm the company** — company identity: not-exact-near-matches |
| hubspot inc. — Data Analyst | — (not-in-dataset) | — | — | not scored | **Human: confirm the company** — company identity: not-in-dataset |

## Evidence per lead (every value labeled)

### Abacus — Growth Analytics Manager, Payment Integrity

- Company match [record]: **not-exact-near-matches**; near matches for a human: ABACUS BIOSCIENCE INC; ABACUS INSIGHTS INC; OREGON ABACUS MULTIFAMILY ASSOCIATES LP
- DOL LCA [record]: none-under-this-name — core 0, adjacent 0 — no certified analyst-family LCA under this exact employer name in this file; not evidence that it never sponsors
- Fit [your-input]: 0.7 (self-rated; no model was asked)

### hubspot inc. — Data Analyst

- Company match [record]: **not-in-dataset**
- DOL LCA [record]: found — core 0, adjacent 1 — filed certified LCAs only in adjacent analyst SOC codes: a person decides if that work fits (G4)
- Fit [your-input]: 0.8 (self-rated; no model was asked)

## Gates a person must clear

- **G1 Company identity.** For every lead marked *not-in-dataset*, *no-h1b-record*, *ambiguous* or *near matches*: confirm the right company or accept "unknown". Missing from this dataset does not mean the company never sponsors.
- **G2 Posting.** Open every *active* posting yourself before tailoring. Open any *uncertain* one before it is scored.
- **G3 Timeline.** Check the dates in each timeline line. If you are unsure about STEM-extension eligibility, ask your DSO, not this tool.
- **G4 Title review.** For each Proven or Likely lead, read the matched titles below and confirm they are work you would do:

  The same check by occupation code (DOL LCA records, certified H-1B, Massachusetts worksites):
  - hubspot inc.: 1 × 15-2041.00 Statisticians (adjacent) — e.g. Senior Statistical Analyst
  - Abacus: no certified analyst-family LCA under this name in the file

## What this run could not verify

- Sponsorship by SOC code (DOL LCA, one fiscal-year file, Massachusetts worksites, exact employer name): an LCA is filed before the H-1B petition, so it is not an approval, one LCA can cover several workers, and a company filing under another legal name, or outside Massachusetts, reads as "none".
- Whether the title keyword rules are right: they are the student's rules, and every match is shown for human review (G4).
- Funding: full Form D quarters were used, but only exact-name matches count, Form D covers private raises only, and the newest quarter available lags months behind.
- What a specific employer pays an analyst: the company median covers all its sponsored roles, and BLS OEWS is an occupation survey, not an offer.
- Hiring lag and fit: both are the student's own estimates.
- Visa law: the timeline factor is planning arithmetic. STEM-extension eligibility needs a DSO.
