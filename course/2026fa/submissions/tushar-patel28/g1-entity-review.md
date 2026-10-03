# G1 entity review — which CSV row is each company?

## Executive summary

**What this is.** A checklist of every company on the sample job list, next to the row the tool matched it to in the public sponsorship data.

**Why read it.** The tool matches company names exactly, so it can attach a company to a namesake, miss it, or find two candidates. Only a person can confirm that a matched row really is the company behind the job posting. Until you do, the company match is the tool's claim, not a fact.

**What it found.** Of 12 companies, 1 ambiguous, 9 matched-h1b, 1 no-h1b-trace, 1 not-found. One company (Salesforce) matched two rows that differ only in punctuation; they're shown side by side below so you can pick one. Fill in the last column with yes or no for each row.

## How this was made

- Rows come from the run log `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.json` (G1 results) and the sponsorship CSV `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2addf472b1…`), read on 2026-10-01. Every company, city, state and website value is `[record]`, copied unchanged.
- The company name as typed is `[your-input]`, from the candidate-roles file. The last column is yours to fill (`[your-input]`). Notes marked `[model-judgment]` are Claude's reading of the rows, not records.
- This file is **not regenerated** by the tool, so your answers won't be overwritten. If the role list changes, rebuild it by hand from the newest run log.

## Review list

| Role | Company as typed `[your-input]` | G1 result `[record]` | CSV row | Company name `[record]` | City `[record]` | State `[record]` | Website `[record]` | Confirmed by human (yes/no) |
|---|---|---|---|---|---|---|---|---|
| databricks-swe | Databricks, Inc. | matched-h1b | 7249 | DATABRICKS INC | SAN FRANCISCO | CA | databricks.com | Yes |
| stripe-swe | Stripe, Inc. | matched-h1b | 25633 | STRIPE INC | South San Francisco | CA | stripe.com | Yes |
| toast-swe | Toast, Inc. | matched-h1b | 27011 | TOAST INC | BOSTON | MA | toast.com | Yes |
| google-swe | Google | not-found | — | no row with this name | — | — | — | No |
| mongodb-swe | MongoDB, Inc. | matched-h1b | 17197 | MONGODB INC | NEW YORK | NY | mongodb.com | Yes |
| aiera-ai | Aiera, Inc. | matched-h1b | 972 | AIERA INC | NEW YORK | NY | aiera.com | Yes |
| anyscale-ai | Anyscale, Inc. | matched-h1b | 1808 | ANYSCALE INC | San Francisco | CA | anyscale.com | Yes |
| huggingface-ai | Hugging Face, Inc. | no-h1b-trace | 12615 | HUGGING FACE INC | BROOKLYN | NY | hugging-face.com | Yes |
| datadog-cloud | Datadog, Inc. | matched-h1b | 7258 | DATADOG INC | NEW YORK | NY | datadog.com | Yes |
| everquote-cloud | EverQuote, Inc. | matched-h1b | 9170 | EVERQUOTE INC | CAMBRIDGE | MA | everquote.com | Yes |
| salesforce-cloud | Salesforce.com, Inc. | ambiguous | 23115 | SALESFORCE COM INC | SAN FRANCISCO | CA | salesforcecom.com | Yes |
| salesforce-cloud | Salesforce.com, Inc. | ambiguous | 23116 | SALESFORCECOM INC | SAN FRANCISCO | CA | salesforcecom.com | Yes |
| coherehealth-cloud | Cohere Health, Inc. | matched-h1b | 6084 | COHERE HEALTH INC | BOSTON | MA | cohere-health.com | Yes |

Notes for the not-found and no-trace rows:
- **Google:** no CSV row starts with "GOOGLE". The dataset is built from startup funding filings; "ALPHABET INC" exists but has no H-1B trace. A "no" here means "not in this data", not "does not sponsor".
- **Hugging Face:** the matched row exists but has no sponsorship fields. Confirming the row is still useful, since it tells you the unknown is a data gap and not a name-match error.

## The two Salesforce candidates, side by side

Role `salesforce-cloud` (typed as "Salesforce.com, Inc.") normalizes to one key that matches both rows. Pick the one that is the company behind the posting, or neither. Until a row is chosen, the role stays "blocked: pick the right company row" and gets no sponsorship vote.

| Field `[record]` | Row 23115 | Row 23116 |
|---|---|---|
| `company_name` | SALESFORCE COM INC | SALESFORCECOM INC |
| `city` | SAN FRANCISCO | SAN FRANCISCO |
| `state` | CA | CA |
| `zip_code` | 94105 | 94105 |
| `website` | salesforcecom.com | salesforcecom.com |
| `industry` | Other Technology | Other Technology |
| `year_incorporated` | — | — |
| `latest_funding_date` | 2018-08-20 | 2019-10-01 |
| `Total Approvals` | 66.0 | 66.0 |
| `Total Denials` | 10.0 | 10.0 |
| `top_job_titles_sponsored` | ['Technical Program Manager'] | ['Technical Program Manager'] |
| **This is the company (yes/no)** `[your-input]` | | |

Approval and denial counts are shown only to help tell the rows apart; the tool never uses them as sizes, because every count in the sponsorship data is even, which suggests double counting upstream.

- `[model-judgment]` The two rows carry identical sponsorship fields (66 approvals, 10 denials, the same single title) and differ only in punctuation and funding date. They look like one entity duplicated upstream, not two companies. If so, either row gives the same answer. The only top title, "Technical Program Manager", maps to no family under the crosswalk.
- `[model-judgment]` The `website` value `salesforcecom.com` looks inferred from the company name rather than recorded, since Salesforce's own site is salesforce.com. Don't treat the website column as proof of identity anywhere in this list (e.g. `hugging-face.com` for Hugging Face). Use name, city and state, and your own knowledge of the company.
