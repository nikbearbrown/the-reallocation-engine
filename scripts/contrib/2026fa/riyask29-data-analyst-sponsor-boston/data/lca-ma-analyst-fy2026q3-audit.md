# LCA slice audit

## Executive summary

This file counts what happened when one Department of Labor H-1B filing file was cut down to certified filings for analyst-type occupations at worksites in MA. It read 437,496 filings and kept 1,842, from 855 employers. It is a report for a person to read, not a pass/fail check: a high drop count is expected, because most filings are for other occupations and states.

## Run record

- Source: `LCA_Disclosure_Data_FY2026_Q3.xlsx` (DOL OFLC LCA disclosure data), read 2026-10-20
- Families: `lca-soc-families.json` — core ['13-1161.00', '15-2051.01'], adjacent ['13-1111.00', '15-1211.00', '15-2031.00', '15-2041.00', '15-2051.00']
- Output: `lca-ma-analyst-fy2026q3.csv` (1071 employer × SOC rows; no case numbers, no person's name or contact)

## Rows in, rows out

| step | rows |
|---|---|
| blank sheet rows skipped (not filings) | 595,239 |
| read | 437,496 |
| drop: SOC not in analyst families | 11,834 |
| drop: not H-1B | 10,544 |
| drop: status Certified - Withdrawn | 1,182 |
| drop: status Denied | 104 |
| drop: status Withdrawn | 239 |
| drop: worksite not in MA | 411,751 |
| **kept** | **1,842** |

## Kept, by SOC code

| SOC | title | family | certified LCAs |
|---|---|---|---|
| 15-2051.00 | Data Scientists | adjacent | 720 |
| 15-2051.01 | Business Intelligence Analysts | core | 263 |
| 15-2031.00 | Operations Research Analysts | adjacent | 230 |
| 15-1211.00 | Computer Systems Analysts | adjacent | 183 |
| 13-1111.00 | Management Analysts | adjacent | 180 |
| 13-1161.00 | Market Research Analysts and Marketing Specialists | core | 158 |
| 15-2041.00 | Statisticians | adjacent | 107 |
| 13-1161.00 | Marketing Research Analysts and Marketing Specialists | core | 1 |

## Top 15 employers (all kept SOCs)

| employer | certified LCAs |
|---|---|
| Wayfair LLC | 79 |
| Amazon.com Services LLC | 49 |
| Boston Consulting Group, Inc. | 39 |
| McKinsey & Company, Inc. United States | 22 |
| Staples, Inc. | 20 |
| State Street Bank and Trust Company | 20 |
| Fidelity Technology Group, LLC d/b/a Fidelity Investments | 19 |
| Fidelity Brokerage Services LLC d/b/a Fidelity Investments | 18 |
| Dana-Farber Cancer Institute | 18 |
| General Hospital Corporation | 17 |
| Takeda Development Center Americas, Inc. | 17 |
| FMR LLC d/b/a Fidelity Investments | 15 |
| Accenture LLP | 14 |
| MCKINSEY & COMPANY, INC. UNITED STATES | 13 |
| Ernst & Young U.S. LLP | 13 |

## Values seen (for a person to sanity-check the filters)

- CASE_STATUS: Certified 401,412, Certified - Withdrawn 26,303, Withdrawn 7,224, Denied 2,557
- VISA_CLASS: H-1B 426,952, E-3 Australian 7,671, H-1B1 Chile 1,654, H-1B1 Singapore 1,219

## What this cannot tell you

- An LCA is filed before a petition; it is not an approved H-1B, and one LCA can cover several workers.
- A count of zero means no certified analyst-family LCA under this exact employer name in this file and state, not that the employer never sponsors.
- Wages are the offered rate on the filing, annualised; not what any one person was paid.
