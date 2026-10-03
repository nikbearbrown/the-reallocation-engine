# Sponsored-title and OPT-timeline check — sample run 2026-10-01

## Executive summary

**What this is.** A check of 12 job openings for one fictional international student (MS in software engineering, work permit starting in January). For each opening it asks two things: does the company's public visa-sponsorship history list a job title in the student's field, and does the start date fall inside the student's work-permit window? It then runs the project's existing scoring tool and suggests a next step for each opening.

**Why read it.** It shows, opening by opening, which numbers come from public data and which come from the student's own definitions, so the student can see exactly why each opening was ranked the way it was and what they still have to check by hand.

**What it found.** 11 openings were scored and 1 could not be scored because the start date was missing or invalid. The scoring tool said: Consider 9, Skip 2, not scored 1. Suggested next steps: blocked: fix the input and re-run 1, blocked: pick the right company row, then re-run 1, network into the company 4, skip 1, tailor an application 5. For 3 openings the company's sponsorship history is simply unknown (no match, no trace, or more than one possible match). That is not evidence the company refuses to sponsor, so the next step there is a conversation, not a skip. An opening reaches "Apply" only when a person has checked public labor-filing records and the live posting, and written that evidence down; none was supplied in this run, so no opening is marked Apply. Openings whose start date is up to 30 days before the work permit begins, or 61 to 90 days after it, are kept but flagged as risky. Whether a posting is still open was not checked except where a person recorded it. The date arithmetic is for planning only and is not immigration advice.

## How to read the labels

- `[record]` came from a data file or from the scorer's own output, unchanged.
- `[your-input]` is the student's definition or input: the role list, the dates, the title keywords, and every mapping from evidence to a number.
- `[model-judgment]` would mark an AI judgment. None is used in this run.
- A value derived from a record by one of the student's definitions carries `[your-input]`, because the definition is the part a human must check.

## Decisions

| Role | Family | Company evidence (G1) | Family in top titles | Start vs EAD | Timeline factor (G2) | Liveness (G3) | G4 human evidence | Votes sent | Composite | Scorer (machine → final) | Shown decision | Next action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Databricks, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | 17 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.450 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Stripe, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | -11 days (1-30-days-before) [your-input] | 0.5 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.225 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input]; negotiate the start date to on or after the EAD start [your-input] |
| Toast, Inc. — Software Engineer I | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | 66 days (61-90-days-after) [your-input] | 0.5 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.8 [your-input] | 0.225 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Google — Software Engineer, Early Career | SWE [your-input] | not-found [record] | not-applicable [your-input] | 31 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.8 [your-input] | 0.240 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| MongoDB, Inc. — Software Engineer, New Grad | SWE [your-input] | matched-h1b [record] | in-top-titles [your-input] | TBD [your-input] | **error** | — | none | — | — | not scored | not scored (input error) [your-input] | blocked: fix the input and re-run [your-input] |
| Aiera, Inc. — AI Engineer | AI [your-input] | matched-h1b [record] | in-top-titles [your-input] | 10 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.7 [your-input] | 0.420 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Anyscale, Inc. — Machine Learning Engineer | AI [your-input] | matched-h1b [record] | not-in-top-titles [your-input] | 38 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Possible p=0.4 [your-input]; fit p=0.7 [your-input] | 0.350 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| Hugging Face, Inc. — Machine Learning Engineer | AI [your-input] | no-h1b-trace [record] | not-applicable [your-input] | 10 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.7 [your-input] | 0.210 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| Datadog, Inc. — Site Reliability Engineer I | Cloud [your-input] | matched-h1b [record] | not-in-top-titles [your-input] | 24 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Possible p=0.4 [your-input]; fit p=0.6 [your-input] | 0.320 [record] | Consider [record] | Consider [your-input] | network into the company [your-input] |
| EverQuote, Inc. — Cloud Engineer | Cloud [your-input] | matched-h1b [record] | in-top-titles [your-input] | 45 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.6 [your-input] | 0.390 [record] | Consider [record] | Consider — blocked at G3 until npm run ats:liveness is run by a human [your-input] | tailor an application [your-input] |
| Salesforce.com, Inc. — Infrastructure Engineer, Early Career | Cloud [your-input] | ambiguous [record] | not-applicable [your-input] | 25 days (0-60-days-after) [your-input] | 1 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Unknown p=none (no vote) [your-input]; fit p=0.6 [your-input] | 0.180 [record] | Skip [record] | Skip [your-input] | blocked: pick the right company row, then re-run [your-input] |
| Cohere Health, Inc. — Platform Engineer | Cloud [your-input] | matched-h1b [record] | in-top-titles [your-input] | 101 days (more-than-90-days-after) [your-input] | 0 [your-input] | 1 assumed, not checked [your-input] | none | sponsorship Likely p=0.6 [your-input]; fit p=0.6 [your-input] | 0.000 [record] | Skip [record] | Skip [your-input] | skip [your-input] |

## Audit trace per scored role

Arithmetic exactly as the scorer printed it `[record]`. Votes are added; liveness and timeline multiply.

- **databricks-swe** — `(0.6·0.35 + 0.8·0.3) × 1 × 1 = 0.450` → Consider: above threshold (0.450) but one soft spot: sponsorship tier "Likely"
- **stripe-swe** — `(0.6·0.35 + 0.8·0.3) × 1 × 0.5 = 0.225` → Consider: composite 0.225 in the Consider band [0.2, 0.3)
- **toast-swe** — `(0.6·0.35 + 0.8·0.3) × 1 × 0.5 = 0.225` → Consider: composite 0.225 in the Consider band [0.2, 0.3)
- **google-swe** — `(0.8·0.3) × 1 × 1 = 0.240` → Consider: composite 0.240 in the Consider band [0.2, 0.3)
- **aiera-ai** — `(0.6·0.35 + 0.7·0.3) × 1 × 1 = 0.420` → Consider: above threshold (0.420) but one soft spot: sponsorship tier "Likely"
- **anyscale-ai** — `(0.4·0.35 + 0.7·0.3) × 1 × 1 = 0.350` → Consider: above threshold (0.350) but one soft spot: sponsorship tier "Possible"
- **huggingface-ai** — `(0.7·0.3) × 1 × 1 = 0.210` → Consider: composite 0.210 in the Consider band [0.2, 0.3)
- **datadog-cloud** — `(0.4·0.35 + 0.6·0.3) × 1 × 1 = 0.320` → Consider: above threshold (0.320) but one soft spot: sponsorship tier "Possible"
- **everquote-cloud** — `(0.6·0.35 + 0.6·0.3) × 1 × 1 = 0.390` → Consider: above threshold (0.390) but one soft spot: sponsorship tier "Likely"
- **salesforce-cloud** — `(0.6·0.3) × 1 × 1 = 0.180` → Skip: composite 0.180 < 0.2 — time is better spent elsewhere
- **coherehealth-cloud** — `(0.6·0.35 + 0.6·0.3) × 1 × 0 = 0.000` → Skip: gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)

## Human evidence for Apply (G4)

An LCA is evidence of an intent to file, not an approved visa. [your-input] Entries in the overrides file: 0 [your-input].

No entries. No real labor-filing check has been done for this list, so no opening can be Apply. Writing evidence here without doing the check would be an invented record.

## Name matches a person must confirm (G1)

Exact name matching can attach a namesake. Confirm each matched row is the company you mean.

| Role | Your company name | Normalized key | Status | Matched row(s) `[record]` |
|---|---|---|---|---|
| databricks-swe | Databricks, Inc. [your-input] | databricks [your-input] | matched-h1b [record] | DATABRICKS INC (SAN FRANCISCO, CA; row 7249) |
| stripe-swe | Stripe, Inc. [your-input] | stripe [your-input] | matched-h1b [record] | STRIPE INC (South San Francisco, CA; row 25633) |
| toast-swe | Toast, Inc. [your-input] | toast [your-input] | matched-h1b [record] | TOAST INC (BOSTON, MA; row 27011) |
| google-swe | Google [your-input] | google [your-input] | not-found [record] | none |
| mongodb-swe | MongoDB, Inc. [your-input] | mongodb [your-input] | matched-h1b [record] | MONGODB INC (NEW YORK, NY; row 17197) |
| aiera-ai | Aiera, Inc. [your-input] | aiera [your-input] | matched-h1b [record] | AIERA INC (NEW YORK, NY; row 972) |
| anyscale-ai | Anyscale, Inc. [your-input] | anyscale [your-input] | matched-h1b [record] | ANYSCALE INC (San Francisco, CA; row 1808) |
| huggingface-ai | Hugging Face, Inc. [your-input] | huggingface [your-input] | no-h1b-trace [record] | HUGGING FACE INC (BROOKLYN, NY; row 12615) |
| datadog-cloud | Datadog, Inc. [your-input] | datadog [your-input] | matched-h1b [record] | DATADOG INC (NEW YORK, NY; row 7258) |
| everquote-cloud | EverQuote, Inc. [your-input] | everquote [your-input] | matched-h1b [record] | EVERQUOTE INC (CAMBRIDGE, MA; row 9170) |
| salesforce-cloud | Salesforce.com, Inc. [your-input] | salesforcecom [your-input] | ambiguous [record] | SALESFORCE COM INC (SAN FRANCISCO, CA; row 23115); SALESFORCECOM INC (SAN FRANCISCO, CA; row 23116) |
| coherehealth-cloud | Cohere Health, Inc. [your-input] | coherehealth [your-input] | matched-h1b [record] | COHERE HEALTH INC (BOSTON, MA; row 6084) |

## Top sponsored titles behind each family check

- **databricks-swe** (SWE): a title in the SWE family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Software Engineer', 'Senior Software Engineer', 'Solutions Architect', 'Specialist Solutions Architect', 'Senior Solutions Engineer']; matched [your-input]: ['Software Engineer', 'Senior Software Engineer']
- **stripe-swe** (SWE): a title in the SWE family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Software Engineer', 'Backend Engineer', 'Risk Strategist', 'Product Manager', 'Engineering Manager']; matched [your-input]: ['Software Engineer', 'Backend Engineer']
- **toast-swe** (SWE): a title in the SWE family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Senior Software Engineer', 'Senior Credit Risk Analyst', 'Staff Software Engineer/Team Lead Manager', 'Senior Systems Architect, Salesforce Engineering', 'Staff Software Engineer - Payments Extensibility, Tech Lead']; matched [your-input]: ['Senior Software Engineer', 'Staff Software Engineer - Payments Extensibility, Tech Lead']
- **mongodb-swe** (SWE): a title in the SWE family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Senior Software Engineer', 'Software Engineer ', 'Senior Product Manager', 'Marketing Analytics and Operations Manager', 'Senior Solutions Architect', 'Senior Software Engineer']; matched [your-input]: ['Senior Software Engineer', 'Software Engineer ', 'Senior Software Engineer']
- **aiera-ai** (AI): a title in the AI family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Product Manager', 'AI/DS Engineer', 'QA Automation Engineer']; matched [your-input]: ['AI/DS Engineer']
- **anyscale-ai** (AI): AI family not in top titles (unknown) — the list holds only a few titles, and ambiguous titles map to no family [your-input]. Top titles [record]: ['Software Engineer', 'Solutions Architect']; matched [your-input]: none
- **datadog-cloud** (Cloud): Cloud family not in top titles (unknown) — the list holds only a few titles, and ambiguous titles map to no family [your-input]. Top titles [record]: ['Software Engineer II', 'Senior Software Engineer', 'Software Engineer', 'Privacy Counsel', 'PRODUCT MANAGER']; matched [your-input]: none
- **everquote-cloud** (Cloud): a title in the Cloud family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Senior Cloud Engineer I', 'Senior Quantitative Analyst', 'Senior Engineer ', 'Senior Quantitative Analyst (Business) ', 'Product Manager', 'Quantitative Analyst ']; matched [your-input]: ['Senior Cloud Engineer I']
- **coherehealth-cloud** (Cloud): a title in the Cloud family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category) [your-input]. Top titles [record]: ['Engineering Manager ', 'Senior Software Engineer, Platform', 'Senior Machine Learning DevOps Engineer', 'Software Engineer II', 'Machine Learning Engineer']; matched [your-input]: ['Senior Machine Learning DevOps Engineer']

## Roles not scored

- role 'mongodb-swe': start_date 'TBD' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored [your-input]

## Wage context (BLS) — not part of the score

context only: role_quality weight is 0 in the scorer, so wages do not enter the score [record]. The family-to-occupation mapping is `[your-input]`; the wage figures are `[record]`.

| Family | SOC | Occupation | Median annual wage | OEWS year |
|---|---|---|---|---|
| SWE | 15-1252.00 (BLS 15-1252) | Software Developers [record] | $133,080 [record] | 2024 [record] |
| AI | 15-1221.00 (BLS 15-1221) | Computer and Information Research Scientists [record] | $140,910 [record] | 2024 [record] |
| AI | 15-2051.00 (BLS 15-2051) | Data Scientists [record] | $112,590 [record] | 2024 [record] |
| Cloud | 15-1241.00 (BLS 15-1241) | Computer Network Architects [record] | $130,390 [record] | 2024 [record] |
| Cloud | 15-1244.00 (BLS 15-1244) | Network and Computer Systems Administrators [record] | $96,800 [record] | 2024 [record] |
| Cloud | 15-1299.08 (BLS 15-1299) | Computer Systems Engineers/Architects [record] | $108,970 [record] | 2024 [record] |

Wages are published per BLS code. Where it is broader than the O*NET code (e.g. 15-1299 for 15-1299.08), the figure is for the whole broader occupation ("Computer Occupations, All Other"), not the detailed title.

## Does the title check separate companies?

Across all 1557 companies with sponsorship data `[record]`, a title in each family appears in the top titles of: SWE 511, AI 86, Cloud 68 companies; 967 show none of the three `[your-input]` (crosswalk applied to records). Unreadable title lists: 0 `[record]`.

## What this run cannot tell you

- Whether a company sponsors **this** occupation. The data has no SOC code, only a few top titles per company.
- How much a company sponsors, or how recently. There are no filing years, and the approval counts may be double-counted, so they are not used.
- Whether a posting is real or still open. Liveness was assumed, not checked (G3).
- Anything about a company that is not in the data, has no sponsorship trace, or matches more than one row. These are unknown, not "does not sponsor".
- Immigration eligibility. Timeline factors are planning arithmetic, not immigration advice. Confirm OPT dates and the unemployment allowance with your DSO.

## Run record

- Recipe: tushar-patel28-swe-title-sponsor-opt v0.1.0 [record] · run date 2026-10-01 [record] · mode sample (offline; no network calls) [your-input]
- Command: `python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py` [record]
- Input `csv`: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` [record] sha256 `eccdee2addf472b1…`
- Input `bls`: `data/bls/compact/soc_occupation_compact.csv` [record] sha256 `bac5acf77ca2d252…`
- Input `persona`: `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/persona.json` [your-input] sha256 `810ced8c1fef7115…`
- Input `roles`: `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/candidate-roles.json` [your-input] sha256 `ee13467af470e0a3…`
- Input `overrides`: `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/overrides.json` [your-input] sha256 `6c8f8f8f69073a37…`
- Input `crosswalk`: `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/crosswalk.json` [your-input] sha256 `0ec0579f29dc4545…`
- Input `mappings`: `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/mappings.json` [your-input] sha256 `c5fd01db96fa8a72…`
- Reused maintained code (normalizer): `scripts/sec/sec-all-quarters.py::normalize_company_name` [record]
- Reused maintained code (h1b_presence): `scripts/sec/validate-h1b-join-sample.py::h1b_present` [record]
- Scorer: `npm run score -- course/2026fa/submissions/tushar-patel28/runs/roles.json --out-dir course/2026fa/submissions/tushar-patel28/runs` exit 0 [record]; stdout: `✓ scored 11 roles → Apply 0 · Consider 9 · Skip 2 (skip 18%)`
- Guards: passed: 8 sponsorship term(s), all weight > 0; passed: scorer multiplied exactly the gates sent; every timeline=0 role is a gated Skip [record]
- Scorer outputs: `course/2026fa/submissions/tushar-patel28/runs/role-scores.json`, `course/2026fa/submissions/tushar-patel28/runs/role-scores.md` [record]
- Agent log: `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.json` [record]
