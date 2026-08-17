# LLM-Based Occupational Classification of Job Listings: Methods

## Abstract

We present a method for automatically classifying job listings to Standard Occupational Classification (SOC) codes using large language models (LLMs), validated against a ground-truth corpus derived from U.S. Department of Labor Labor Condition Application (LCA) disclosure data. The approach leverages the semantic richness of full job listing text to resolve occupational ambiguity that title-only classification systems cannot address. We apply this pipeline to identify STEM-relevant employment opportunities at venture-funded startups for international workers on F-1/OPT status.

---

## 1. Data Sources

### 1.1 DOL LCA Disclosure Data

The primary ground-truth corpus is drawn from the Office of Foreign Labor Certification (OFLC) public disclosure files, available at `https://www.dol.gov/agencies/eta/foreign-labor/performance`. These files are released quarterly, covering determinations issued under the LCA program (H-1B, H-1B1, E-3 visa categories).

Each record contains:
- `EMPLOYER_NAME` — free-text employer name as submitted
- `EMPLOYER_FEIN` — Federal Employer Identification Number
- `JOB_TITLE` — employer-submitted job title
- `SOC_CODE` — certified SOC code (2018 taxonomy)
- `SOC_TITLE` — corresponding SOC title
- `WORKSITE_CITY`, `WORKSITE_STATE` — geographic location
- `WAGE_RATE_OF_PAY_FROM` — offered wage
- `CASE_STATUS` — certification outcome (Certified / Denied / Withdrawn)
- `CASE_SUBMITTED`, `DECISION_DATE` — temporal markers

We filter to `CASE_STATUS = CERTIFIED` records only, as denied and withdrawn cases do not represent successful employer intent. The full multi-year corpus (FY2018–FY2026) comprises approximately 3–5 million certified records.

### 1.2 O*NET Occupational Database

The O*NET database (`onetonline.org`) provides the canonical SOC taxonomy with detailed task, skill, knowledge, and ability descriptors for each occupation. We use O*NET as a supplementary reference for:

- Mapping ambiguous SOC codes to human-readable descriptions
- Constructing few-shot prompt examples
- Filtering to STEM-relevant SOC major groups (15-xxxx, 17-xxxx, 19-xxxx)

### 1.3 SEC EDGAR Form D Filings

Venture-funded company data is drawn from SEC Form D filings via the EDGAR full-text search API (`https://efts.sec.gov/LATEST/search-index`). Form D is required for private offerings under Regulation D and provides:

- Company legal name
- Industry classification
- Total offering amount
- Filing date (proxy for funding date)
- Principal office address

We filter to companies filing within a rolling 24-month window with total offering amounts ≥ $5M, targeting active, recently-capitalized employers.

### 1.4 USCIS H-1B Employer Data Hub

The USCIS H-1B Employer Data Hub provides annual employer-level aggregates of initial and continuing H-1B petition approvals and denials. This serves as a secondary signal for historical sponsorship willingness, complementing the LCA filing frequency derived from DOL data.

---

## 2. Entity Resolution

### 2.1 The Employer Identity Problem

A critical methodological challenge is matching employer records across datasets. Employer names in LCA filings are free-text strings submitted by applicants and are not validated against any registry. Common issues include:

- Variant legal names ("Google LLC" vs. "Google Inc.")
- Subsidiary vs. parent company names
- Trade names vs. legal entity names
- Typographic errors

### 2.2 FEIN-Based Joining

Where available, `EMPLOYER_FEIN` provides a stable identifier that survives name variation. We prioritize FEIN-based joins between LCA records and any third-party company database that carries EIN data (e.g., IRS exempt organizations database, D&B commercial records).

For SEC Form D data, which does not include EINs, we apply a multi-step resolution process:

1. **Exact match** on normalized legal name (lowercase, stripped punctuation, expanded common abbreviations)
2. **Fuzzy match** using token-set ratio (RapidFuzz library, threshold ≥ 0.88) on remaining unmatched records
3. **Manual review** of fuzzy-matched pairs with confidence below 0.92

### 2.3 Sponsorship Signal Construction

For each resolved employer entity, we construct a sponsorship history vector:

- `lca_count_3yr` — number of certified LCA filings in the past 3 years
- `lca_count_5yr` — number of certified LCA filings in the past 5 years
- `h1b_approval_rate` — USCIS approval rate for initial petitions
- `unique_soc_codes` — breadth of occupational categories sponsored
- `first_lca_year` — year of first LCA filing (program tenure)

Employers with `lca_count_3yr ≥ 1` are classified as historically active sponsors. Those with `lca_count_5yr = 0` but `sec_funded = True` are the primary target population: companies with financial capacity but no demonstrated sponsorship history, where information-gap intervention is most likely to be effective.

---

## 3. SOC Classification of Job Listings

### 3.1 Problem Framing

Given a full job listing text `L`, we seek to estimate the posterior probability distribution over SOC codes:

```
P(SOC | L) ∝ P(L | SOC) × P(SOC)
```

Where:
- `P(SOC)` is the empirical prior derived from SOC code frequency in the LCA corpus
- `P(L | SOC)` captures how likely this listing's language is given the occupation

In practice, we operationalize this as a prompted LLM inference task rather than an explicit generative model, using the LCA corpus for validation rather than training.

### 3.2 LLM Inference Approach

Full listing text is submitted to a large language model with the following structured prompt:

```
You are an expert in U.S. occupational classification. Given the job listing below,
identify the most appropriate Standard Occupational Classification (SOC) code
from the 2018 SOC taxonomy.

Return ONLY a JSON object with no preamble:
{
  "soc_code": "XX-XXXX",
  "soc_title": "...",
  "confidence": 0.0–1.0,
  "reasoning": "one sentence"
}

If the role does not clearly map to a single code, return the best-fit code
and reduce confidence accordingly.

Job listing:
{listing_text}
```

We use Claude Sonnet (claude-sonnet-4-20250514) with temperature = 0 for deterministic output. Listings exceeding the context window are truncated to the first 2,000 tokens, which in practice captures the full description for >95% of listings in our corpus.

### 3.3 Rationale for Full-Text Over Title-Only Classification

Job titles alone are systematically ambiguous. The title "Senior Engineer" appears in the LCA corpus mapped to 47 distinct SOC codes. Full listing text resolves this ambiguity through:

- **Technology stack** (e.g., "CRISPR, cell culture, flow cytometry" → SOC 19-1042)
- **Regulatory context** (e.g., "FDA 510(k) submissions" → SOC 17-2112)
- **Degree requirements** (e.g., "PhD in Computer Science required" → SOC 15-2051)
- **Industry domain** (e.g., "Series A biotech" → narrows to life science SOC groups)

Title-only approaches would treat these as equivalent; full-text inference does not.

---

## 4. Validation

### 4.1 Ground-Truth Corpus Construction

We construct a validation set from LCA disclosure records using the following procedure:

1. Sample 2,000 certified LCA records stratified by SOC major group (15-xxxx, 17-xxxx, 19-xxxx, all others) from FY2023–FY2025 data
2. Filter to records where `JOB_TITLE` is unambiguous (single-token SOC match rate > 0.80 in O*NET crosswalk)
3. Treat the DOL-certified `SOC_CODE` as ground truth

This yields a validation set of approximately 1,800 usable records after filtering.

### 4.2 Validation Protocol — Title-Only Baseline

As a baseline, we submit only the `JOB_TITLE` field to the LLM using the same prompt structure. This isolates the marginal contribution of full listing text and establishes a lower bound on classification accuracy.

### 4.3 Validation Protocol — Full Listing (Primary)

For the primary validation, full listing text is required. Because LCA records do not contain full job descriptions, we use two approaches:

**Approach A — Synthetic listings:** For each validation record, we prompt the LLM to generate a plausible job listing consistent with the `JOB_TITLE`, `SOC_TITLE`, `WORKSITE_STATE`, and `WAGE_RATE_OF_PAY_FROM`. We then classify the synthetic listing and compare to the certified SOC. This tests whether the model can recover the correct code from listings constructed to match it — a soft upper bound.

**Approach B — Hand-labeled real listings:** We manually source 100–150 real job postings from company career pages and public job boards, selecting postings from employers present in both the LCA corpus and our funded startup database. A human annotator assigns the ground-truth SOC code using the O*NET crosswalk. This is a smaller but epistemically cleaner validation set.

### 4.4 Metrics

For each validation approach, we report:

- **Top-1 accuracy** — predicted SOC code matches ground truth exactly
- **Major group accuracy** — predicted SOC major group (first 2 digits) matches ground truth
- **STEM recall** — among ground-truth STEM records (SOC groups 15, 17, 19), what fraction are correctly identified as STEM
- **STEM precision** — among predicted STEM records, what fraction are truly STEM

For the application (qualifying companies as STEM-relevant), STEM recall is the primary metric. A false negative (missing a STEM role) is more costly than a false positive (misclassifying a non-STEM role as STEM).

### 4.5 Confidence Calibration

We evaluate calibration of the model's self-reported confidence scores against empirical accuracy within confidence bins. A well-calibrated model should achieve ~90% accuracy on records where it reports 0.9 confidence. Miscalibration informs whether confidence thresholding is a viable quality filter in production.

---

## 5. Application Pipeline

### 5.1 Target Population Definition

The intervention target is employers who:
- Filed a Form D with the SEC within the past 24 months
- Raised ≥ $5M in the offering
- Are classified in STEM-adjacent NAICS codes (biotechnology, software, engineering services, medical devices)
- Have `lca_count_5yr = 0` (no prior LCA filings) OR `lca_count_3yr ≥ 1` (active sponsors)

The first group represents the information-gap population; the second represents proven sponsors.

### 5.2 Job Listing Acquisition

We acquire active job listings for target employers via:
- Company career pages (direct scraping)
- Public job board APIs where available
- Manual collection for companies with no discoverable listings

Each listing is processed through the SOC classification pipeline and assigned a predicted SOC code and confidence score.

### 5.3 Sponsorship Likelihood Scoring

For each employer-listing pair, we compute a composite sponsorship likelihood score:

```
score = w1 × lca_signal + w2 × funding_signal + w3 × soc_stem_flag
```

Where:
- `lca_signal` = normalized LCA filing frequency (0–1)
- `funding_signal` = log(offering_amount) normalized to [0,1]
- `soc_stem_flag` = binary indicator for predicted STEM SOC major group
- Weights `w1, w2, w3` initialized equally; updated based on user outcome data

### 5.4 Output

The pipeline produces a ranked list of employer-listing pairs with associated metadata: predicted SOC, sponsorship likelihood score, funding amount, filing date, worksite location, and direct company contact where available. This is the primary input to the user-facing platform.

---

## 6. Limitations

**Name resolution error propagation.** Fuzzy matching introduces false joins. We estimate a false positive join rate of 3–8% based on manual audit of a random sample. Downstream sponsorship scores for falsely-joined entities will be incorrect.

**Temporal mismatch.** LCA filings and job listings are not contemporaneous. A company's sponsorship behavior may have changed between its most recent LCA filing and the current listing. We treat historical LCA data as a prior, not a guarantee.

**LLM hallucination.** The model may produce SOC codes not present in the 2018 taxonomy, particularly for novel job titles. We validate all output SOC codes against the canonical taxonomy and null-code records that fail this check.

**Validation corpus representativeness.** Hand-labeled listings are collected opportunistically and may not represent the full distribution of job titles at funded startups. In particular, early-stage company listings tend to be more idiosyncratic ("hacker in residence," "founding engineer") and may be systematically harder to classify.

**OPT/STEM OPT regulatory risk.** The sponsorship framework described assumes current F-1/OPT regulations. Proposed and enacted regulatory changes (e.g., OPT restrictions, fee increases) could affect the practical value of the sponsorship signal independent of the classification system.

---

## 7. Reproducibility

All code, validation datasets, and prompt templates are released under MIT license at `https://github.com/nikbearbrown/80-Days-to-Stay`. DOL LCA disclosure data is public domain. SEC EDGAR data is public domain. O*NET data is released under CC BY 4.0.
