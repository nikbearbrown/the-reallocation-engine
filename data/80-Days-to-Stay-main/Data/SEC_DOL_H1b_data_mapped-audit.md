# SEC_DOL_H1b_data_mapped Audit

**Audit date:** 2026-05-28
**Source file:** `SEC_DOL_H1b_data_mapped.csv`
**Source path:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/80-Days-to-Stay-main/Data/SEC_DOL_H1b_data_mapped.csv`
**File size:** 6.14 MB
**SHA-256:** `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270`

## Executive Summary

- The dataset contains **30,369 companies** and **20 columns**.
- **1,557 companies (5.1%)** have at least one H-1B sponsorship field populated; **28,812 (94.9%)** have null sponsorship fields.
- **17,752 companies (58.5%)** have a website value; **12,617 (41.5%)** are missing websites.
- **No ATS columns are present** in this CSV.
- **No SOC code columns are present** in this CSV.
- Funding dates are present for **27,874 rows (91.8%)** and missing for **2,495 rows (8.2%)**.
- The newest funding date is **2025-09-26**; the median funding age is **2,169 days (5.94 years)**.

## Column Inventory

| # | Column |
|---|---|
| 1 | `company_name` |
| 2 | `industry` |
| 3 | `website` |
| 4 | `city` |
| 5 | `state` |
| 6 | `zip_code` |
| 7 | `phone` |
| 8 | `year_incorporated` |
| 9 | `company_age_years` |
| 10 | `executive_officers` |
| 11 | `board_directors` |
| 12 | `total_funding` |
| 13 | `latest_funding_amount` |
| 14 | `latest_funding_stage` |
| 15 | `latest_funding_date` |
| 16 | `Total Approvals` |
| 17 | `Total Denials` |
| 18 | `Approval_Rate` |
| 19 | `median_salary_offered` |
| 20 | `top_job_titles_sponsored` |

## H-1B Coverage

| Metric | Companies | Share of dataset |
|---|---|---|
| Any H-1B field populated | 1,557 | 5.1% |
| All H-1B fields null | 28,812 | 94.9% |

| Column | Non-null rows | Share of dataset |
|---|---|---|
| Total Approvals | 1557 | 5.1% |
| Total Denials | 1557 | 5.1% |
| Approval_Rate | 1557 | 5.1% |
| median_salary_offered | 1557 | 5.1% |
| top_job_titles_sponsored | 1557 | 5.1% |

## Website Coverage

| Metric | Companies | Share of dataset |
|---|---|---|
| Website present | 17,752 | 58.5% |
| Website missing | 12,617 | 41.5% |

Note: this audit only checks whether the `website` field is populated. It does not re-verify that each website currently resolves.

## ATS and SOC Fields

| Question | Finding |
|---|---|
| ATS data present? | No ATS/platform/job-count columns found |
| SOC codes present? | No SOC columns found |

## Funding Date Distribution

| Metric | Value |
|---|---|
| Funding date present | 27,874 (91.8%) |
| Funding date missing | 2,495 (8.2%) |
| Unparseable funding dates | 0 |
| Oldest funding date | 1995-12-31 |
| Newest funding date | 2025-09-26 |
| Rows dated after audit date | 0 |
| Median funding age | 2,169 days (5.94 years) |

| Recency window | Companies | Share of dataset | Share of dated rows |
|---|---|---|---|
| 0-6 months | 0 | 0.0% | 0.0% |
| 0-12 months | 738 | 2.4% | 2.6% |
| 0-24 months | 3385 | 11.1% | 12.1% |
| 0-36 months | 5836 | 19.2% | 20.9% |

### Funding Dates by Year

| Year | Rows | Share of dated rows |
|---|---|---|
| 1995 | 1 | 0.0% |
| 2000 | 1 | 0.0% |
| 2002 | 1 | 0.0% |
| 2006 | 1 | 0.0% |
| 2007 | 2 | 0.0% |
| 2008 | 3 | 0.0% |
| 2009 | 9 | 0.0% |
| 2010 | 12 | 0.0% |
| 2011 | 39 | 0.1% |
| 2012 | 68 | 0.2% |
| 2013 | 386 | 1.4% |
| 2014 | 1938 | 7.0% |
| 2015 | 2191 | 7.9% |
| 2016 | 1899 | 6.8% |
| 2017 | 2064 | 7.4% |
| 2018 | 2292 | 8.2% |
| 2019 | 2192 | 7.9% |
| 2020 | 2009 | 7.2% |
| 2021 | 3138 | 11.3% |
| 2022 | 2862 | 10.3% |
| 2023 | 2357 | 8.5% |
| 2024 | 2620 | 9.4% |
| 2025 | 1789 | 6.4% |

### Most Recent 12 Quarters Present

| Quarter | Rows |
|---|---|
| 2022-Q4 | 700 |
| 2023-Q1 | 533 |
| 2023-Q2 | 656 |
| 2023-Q3 | 544 |
| 2023-Q4 | 624 |
| 2024-Q1 | 630 |
| 2024-Q2 | 635 |
| 2024-Q3 | 631 |
| 2024-Q4 | 724 |
| 2025-Q1 | 609 |
| 2025-Q2 | 707 |
| 2025-Q3 | 473 |

## Funding Amount Completeness

| Column | Numeric rows | Share of dataset | Minimum | Median | Maximum |
|---|---|---|---|---|---|
| total_funding | 27874 | 91.8% | $1,000,000 | $7,852,260 | $640,001,000,000 |
| latest_funding_amount | 27874 | 91.8% | $1,000,000 | $5,049,738 | $640,001,000,000 |

The maximum funding amount is extremely large and should be reviewed as a potential outlier before scoring uses raw funding amounts.

## Deduplication and Basic Shape

| Metric | Value |
|---|---|
| Unique company names | 30,369 |
| Duplicated company names | 0 |
| Rows in duplicated-name groups | 0 |

## Top States

| State | Rows |
|---|---|
| CA | 12,167 |
| NY | 6,657 |
| TX | 4,459 |
| MA | 3,319 |
| WA | 1,969 |
| IL | 1,798 |

## Top Industries

| Industry | Rows |
|---|---|
| Other Technology | 10,909 |
| Other | 9,730 |
| Other Health Care | 2,173 |
| Biotechnology | 1,911 |
| Investing | 1,494 |
| Other Banking and Financial Services | 750 |
| Manufacturing | 682 |
| Other Energy | 527 |
| Pharmaceuticals | 520 |
| Business Services | 432 |
| Computers | 360 |
| Telecommunications | 243 |

## Gaps for Phase 1 Decisions

- H-1B data is sparse: only about 5.1% of companies have sponsorship history populated.
- Website coverage is useful but incomplete: about 41.5% of companies lack a website value.
- ATS enrichment has not been merged into this master CSV yet.
- SOC codes are absent, so job-family analysis requires either raw LCA records, title-to-SOC mapping, or a new enrichment step.
- Funding recency is stale for many companies: no records are within 6 months of the audit date, and only about 2.4% of all rows are within 12 months.
- The dataset has no duplicate company names, which is good for browsing, but it does not prove entity resolution quality against DOL/USCIS records.

## Recommended Next Step

Proceed to FEIN extraction and normalized company-name capture in the SEC ingest pipeline, then validate a sample of the 1,557 H-1B-matched rows before trusting the existing entity-resolution join for ranking.
