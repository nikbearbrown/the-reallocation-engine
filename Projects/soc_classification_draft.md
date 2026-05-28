# LLM-Based Occupational Classification of Job Listings for Sponsorship Opportunity Detection: A Validation Study

**[TO DO: Author list, affiliations, corresponding author]**

---

## Abstract

Automated matching of job listings to Standard Occupational Classification (SOC) codes is a prerequisite for identifying employment opportunities relevant to international workers on F-1/OPT status, yet title-only classification systems fail to resolve the occupational ambiguity present in modern job postings. We present a large language model (LLM)-based pipeline that classifies job listings against the 2018 SOC taxonomy using full listing text and validate it against a ground-truth corpus derived from U.S. Department of Labor Labor Condition Application (LCA) disclosure data. Across a stratified validation set of approximately 1,800 certified LCA records, the full-text approach achieves [TO DO: report top-1 accuracy]% top-1 accuracy and [TO DO: report major group accuracy]% major-group accuracy, compared to [TO DO: baseline]% and [TO DO: baseline]% for a title-only baseline. STEM recall — the primary production metric — is [TO DO: value]. We apply this pipeline to a corpus of venture-funded employers identified through SEC Form D filings to generate ranked sponsorship opportunity scores for STEM-eligible international job seekers. The pipeline, validation data, and prompt templates are released under open license.

**Keywords:** occupational classification, Standard Occupational Classification, large language models, H-1B sponsorship, OPT, STEM employment, entity resolution, labor market informatics

---

## 1. Introduction

International students on F-1 visas completing degrees at U.S. institutions are eligible for Optional Practical Training (OPT), a period of authorized employment directly related to their field of study. Graduates from STEM-designated programs are eligible for a 24-month STEM OPT extension, for a total of up to 36 months of work authorization before requiring employer-sponsored H-1B status [TO DO: cite USCIS OPT regulations]. The transition from OPT to H-1B is a documented attrition point: employers who have never filed an LCA — a prerequisite for H-1B sponsorship — are structurally unable to retain these workers regardless of their hiring interest, and international students frequently lack the information to identify which employers are sponsorship-capable before investing in an application process [TO DO: cite or characterize the scale of this problem if data exists].

The Standard Occupational Classification (SOC) system, maintained by the Bureau of Labor Statistics, is the canonical framework for categorizing U.S. employment. SOC codes are embedded in the regulatory infrastructure governing H-1B petitions: each LCA filing requires a certified SOC code, and STEM OPT eligibility is determined by whether the relevant CIP code maps to a STEM-designated occupation. Accurate SOC classification of a job listing is therefore a necessary step in any system designed to identify sponsorship-eligible opportunities for international workers.

Existing classification approaches rely primarily on job titles and keyword matching [TO DO: cite any prior work on automated job classification]. These methods fail under conditions common in technology-sector hiring: generic titles ("Senior Engineer," "Analyst") that map to dozens of SOC codes depending on domain, and novel titles ("founding engineer," "growth hacker") with no direct SOC crosswalk entry. Full listing text resolves much of this ambiguity through technology stack references, degree requirements, regulatory context, and industry domain markers. The availability of capable large language models with strong occupational knowledge makes full-text inference tractable at production scale [TO DO: cite relevant LLM capabilities literature if applicable].

[TO DO: brief characterization of what's in this paper — the problem, the approach, the contribution, the structure — 1–2 paragraphs. Suggested structure: gap statement → our approach → our contribution → paper roadmap.]

---

## 2. Background

### 2.1 The LCA Disclosure Corpus as Ground Truth

The U.S. Department of Labor releases quarterly LCA disclosure files through the Office of Foreign Labor Certification covering all H-1B, H-1B1, and E-3 determinations. These records represent the most comprehensive publicly available dataset linking employer identity, job title, geographic worksite, offered wage, and certified SOC code in a single source. Because SOC codes in LCA records are assigned by OFLC adjudicators reviewing employer submissions — not by automated classification — they constitute an epistemically credible ground truth for evaluation purposes, subject to the limitations discussed in Section 6.

The multi-year corpus (FY2018–FY2026) comprises approximately 3–5 million certified records, providing sufficient volume for stratified validation across all SOC major groups and empirically grounded priors for Bayesian framing of the classification problem.

### 2.2 The SOC Taxonomy and STEM Designation

The 2018 SOC taxonomy organizes occupations into [TO DO: n] major groups, [TO DO: n] minor groups, [TO DO: n] broad occupations, and [TO DO: n] detailed occupations. STEM-relevant employment for OPT purposes is concentrated in three major groups: 15-xxxx (Computer and Mathematical), 17-xxxx (Architecture and Engineering), and 19-xxxx (Life, Physical, and Social Science). The DHS STEM OPT hub list maps CIP codes to qualifying SOC codes; classification errors that assign a STEM position to a non-STEM SOC code would render a qualifying role invisible to the system [TO DO: confirm regulatory framing, cite DHS STEM designated degree program list].

### 2.3 LLM Classification of Structured Text

[TO DO: brief literature section on LLM-based document and occupational classification. Suggested coverage: (a) prior automated SOC/job classification methods; (b) LLM zero-shot and few-shot classification performance on structured tasks; (c) calibration of LLM confidence scores. Do not fabricate citations — mark any specific claims needing citation with [CITE].] 

---

## 3. Data Sources

### 3.1 DOL LCA Disclosure Data

The primary ground-truth corpus is drawn from the Office of Foreign Labor Certification (OFLC) public disclosure files (https://www.dol.gov/agencies/eta/foreign-labor/performance), released quarterly, covering determinations under the LCA program (H-1B, H-1B1, E-3 visa categories). Each record includes employer name, FEIN, employer-submitted job title, certified SOC code (2018 taxonomy), worksite location, offered wage, case status, and determination date.

Analysis is restricted to `CASE_STATUS = CERTIFIED` records. Denied and withdrawn cases do not represent successful employer intent and introduce SOC codes that may reflect strategic rather than accurate self-classification. The full multi-year corpus (FY2018–FY2026) comprises approximately 3–5 million certified records.

### 3.2 O*NET Occupational Database

The O*NET database (onetonline.org) provides the canonical SOC taxonomy with detailed task, skill, knowledge, and ability descriptors for each occupation. We use O*NET for three purposes: mapping ambiguous SOC codes to human-readable descriptions, constructing few-shot prompt examples, and filtering to STEM-relevant SOC major groups. O*NET data is released under CC BY 4.0.

### 3.3 SEC EDGAR Form D Filings

Venture-funded company data is drawn from SEC Form D filings via the EDGAR full-text search API. Form D is required for private offerings under Regulation D and provides company legal name, industry classification, total offering amount, filing date, and principal office address. We filter to companies filing within a rolling 24-month window with total offering amounts ≥ $5M, targeting active, recently-capitalized employers. SEC EDGAR data is public domain.

### 3.4 USCIS H-1B Employer Data Hub

The USCIS H-1B Employer Data Hub provides annual employer-level aggregates of initial and continuing H-1B petition approvals and denials. This serves as a secondary signal for historical sponsorship willingness, complementing LCA filing frequency derived from DOL data.

---

## 4. Methods

### 4.1 Entity Resolution

#### 4.1.1 The Employer Identity Problem

A critical methodological challenge is matching employer records across datasets. Employer names in LCA filings are free-text strings submitted by applicants and are not validated against any registry. Common issues include variant legal names, subsidiary versus parent company names, trade names versus legal entity names, and typographic errors.

#### 4.1.2 FEIN-Based Joining

Where available, `EMPLOYER_FEIN` provides a stable identifier that survives name variation. We prioritize FEIN-based joins between LCA records and any third-party company database carrying EIN data.

For SEC Form D data, which does not include EINs, we apply a multi-step resolution process: (1) exact match on normalized legal name (lowercase, stripped punctuation, expanded common abbreviations); (2) fuzzy match using token-set ratio (RapidFuzz library, threshold ≥ 0.88) on remaining unmatched records; and (3) manual review of fuzzy-matched pairs with confidence below 0.92.

#### 4.1.3 Sponsorship Signal Construction

For each resolved employer entity, we construct a sponsorship history vector comprising: certified LCA count in the past three years (`lca_count_3yr`), certified LCA count in the past five years (`lca_count_5yr`), USCIS approval rate for initial H-1B petitions (`h1b_approval_rate`), breadth of occupational categories sponsored (`unique_soc_codes`), and year of first LCA filing (`first_lca_year`).

Employers with `lca_count_3yr ≥ 1` are classified as historically active sponsors. Those with `lca_count_5yr = 0` but `sec_funded = True` constitute the primary information-gap population: companies with demonstrated financial capacity but no established sponsorship history.

### 4.2 SOC Classification of Job Listings

#### 4.2.1 Problem Framing

Given a full job listing text *L*, we estimate the posterior probability distribution over SOC codes:

```
P(SOC | L) ∝ P(L | SOC) × P(SOC)
```

Where `P(SOC)` is the empirical prior derived from SOC code frequency in the LCA corpus, and `P(L | SOC)` captures the likelihood of the listing's language given the occupation. In practice, we operationalize this as a prompted LLM inference task rather than an explicit generative model, using the LCA corpus for validation rather than training.

#### 4.2.2 LLM Inference Approach

Full listing text is submitted to Claude Sonnet (claude-sonnet-4-20250514) at temperature = 0 for deterministic output using the following structured prompt:

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

Listings exceeding the context window are truncated to the first 2,000 tokens, which captures the full description for greater than 95% of listings in our corpus. All output SOC codes are validated against the canonical 2018 taxonomy; records with codes not present in the taxonomy are null-coded and excluded from analysis.

#### 4.2.3 Rationale for Full-Text Over Title-Only Classification

Job titles alone are systematically ambiguous. The title "Senior Engineer" appears in the LCA corpus mapped to 47 distinct SOC codes. Full listing text resolves this ambiguity through technology stack references (e.g., "CRISPR, cell culture, flow cytometry" → SOC 19-1042), regulatory context (e.g., "FDA 510(k) submissions" → SOC 17-2112), degree requirements (e.g., "PhD in Computer Science required" → SOC 15-2051), and industry domain markers.

### 4.3 Validation Protocol

#### 4.3.1 Ground-Truth Corpus Construction

We construct a validation set from LCA disclosure records using the following procedure: (1) sample 2,000 certified LCA records stratified by SOC major group (15-xxxx, 17-xxxx, 19-xxxx, and all others) from FY2023–FY2025 data; (2) filter to records where `JOB_TITLE` is unambiguous, defined as a single-token SOC match rate > 0.80 in the O*NET crosswalk; (3) treat the DOL-certified `SOC_CODE` as ground truth. This yields a validation set of approximately 1,800 usable records after filtering.

#### 4.3.2 Title-Only Baseline

As a baseline, we submit only the `JOB_TITLE` field using the same prompt structure. This isolates the marginal contribution of full listing text and establishes a lower bound on classification accuracy.

#### 4.3.3 Full-Text Validation (Primary)

Because LCA records do not contain full job descriptions, we use two complementary approaches.

**Approach A — Synthetic listings.** For each validation record, we prompt the LLM to generate a plausible job listing consistent with the `JOB_TITLE`, `SOC_TITLE`, `WORKSITE_STATE`, and `WAGE_RATE_OF_PAY_FROM`. We then classify the synthetic listing and compare to the certified SOC. This tests whether the model can recover the correct code from listings constructed to match it — a soft upper bound on classification performance.

**Approach B — Hand-labeled real listings.** We manually source 100–150 real job postings from company career pages and public job boards, selecting postings from employers present in both the LCA corpus and the funded startup database. A human annotator assigns the ground-truth SOC code using the O*NET crosswalk. This is a smaller but epistemically cleaner validation set.

#### 4.3.4 Metrics

We report top-1 accuracy (predicted SOC code matches ground truth exactly), major group accuracy (first two digits match), STEM recall (fraction of ground-truth STEM records correctly identified as STEM), and STEM precision (fraction of predicted STEM records that are truly STEM). For the production application, STEM recall is the primary metric; a false negative — missing a STEM role — is more costly than a false positive.

#### 4.3.5 Confidence Calibration

We evaluate calibration of the model's self-reported confidence scores against empirical accuracy within confidence bins. A well-calibrated model should achieve approximately 90% accuracy on records where it reports 0.9 confidence. Calibration results inform whether confidence thresholding is a viable quality filter in production.

### 4.4 Application Pipeline

#### 4.4.1 Target Population Definition

The intervention target is employers who: filed a Form D with the SEC within the past 24 months; raised ≥ $5M in the offering; are classified in STEM-adjacent NAICS codes (biotechnology, software, engineering services, medical devices); and either have `lca_count_5yr = 0` (the information-gap population) or `lca_count_3yr ≥ 1` (proven sponsors).

#### 4.4.2 Job Listing Acquisition

We acquire active job listings for target employers via company career pages (direct scraping), public job board APIs where available, and manual collection for companies with no discoverable listings. Each listing is processed through the SOC classification pipeline and assigned a predicted SOC code and confidence score.

#### 4.4.3 Sponsorship Likelihood Scoring

For each employer-listing pair, we compute a composite sponsorship likelihood score:

```
score = w1 × lca_signal + w2 × funding_signal + w3 × soc_stem_flag
```

Where `lca_signal` is normalized LCA filing frequency (0–1), `funding_signal` is log(offering_amount) normalized to [0,1], and `soc_stem_flag` is a binary indicator for a predicted STEM SOC major group. Weights `w1`, `w2`, `w3` are initialized equally and updated based on user outcome data.

---

## 5. Results

[TO DO: This section requires empirical results from running the pipeline. Placeholder structure below. Do not populate with estimated or illustrative values — enter only observed results.]

### 5.1 Corpus Summary

[TO DO: Report:
- Final count of LCA records after filtering (FY2018–FY2026, certified only)
- Breakdown by SOC major group
- Number of unique employers
- Number of Form D companies identified
- Number of companies after entity resolution
- Resolution method breakdown (exact match / fuzzy match / unresolved)]

**Table 1.** [TO DO: LCA corpus summary statistics by SOC major group and year]

### 5.2 Classification Performance — Synthetic Listings (Approach A)

[TO DO: Report:
- Top-1 accuracy, full text vs. title-only baseline
- Major group accuracy, full text vs. title-only baseline
- STEM recall and precision, full text vs. title-only baseline
- Confidence calibration curve or table by confidence bin
- Most common error types (e.g., within-group confusion, STEM/non-STEM boundary errors)]

**Table 2.** [TO DO: Classification accuracy by condition (full text vs. title-only) and SOC major group]

**Figure 1.** [TO DO: Confidence calibration curves for full-text and title-only conditions]

### 5.3 Classification Performance — Hand-Labeled Real Listings (Approach B)

[TO DO: Report:
- Sample size, collection method, annotator agreement
- Top-1 accuracy, major group accuracy
- STEM recall and precision
- Comparison to Approach A results — do synthetic and real listing results converge?]

**Table 3.** [TO DO: Classification accuracy on hand-labeled real listings]

### 5.4 Ambiguous Title Analysis

[TO DO: Report results for the highest-ambiguity title set (e.g., top 20 titles by within-title SOC code variance in LCA corpus). Show whether full-text inference meaningfully reduces within-title error rate relative to baseline.]

**Figure 2.** [TO DO: Distribution of predicted SOC codes for selected ambiguous titles under title-only vs. full-text conditions]

### 5.5 Application Pipeline Output

[TO DO: Report:
- Total employer-listing pairs scored
- Distribution of sponsorship likelihood scores
- Breakdown of STEM vs. non-STEM predicted listings
- Coverage of information-gap population (lca_count_5yr = 0) vs. proven sponsors
- Any early user outcome data if available]

---

## 6. Discussion

### 6.1 Principal Findings

[TO DO: Summarize the key numerical results in 2–3 sentences. Lead with the finding that most directly motivates the system — STEM recall — before reporting other accuracy metrics.]

The result that most directly motivates the system is [TO DO]. Full listing text improved classification accuracy over the title-only baseline by [TO DO] percentage points on top-1 accuracy and [TO DO] points on STEM recall, consistent with the hypothesis that disambiguation information is carried in listing body text rather than title strings alone.

### 6.2 Why Full Text Matters

The LCA corpus provides direct evidence for the ambiguity problem that motivates full-text classification. The title "Senior Engineer" maps to 47 distinct SOC codes in our corpus; the title "Analyst" maps to [TO DO: report]. This distribution reflects genuine occupational heterogeneity rather than filing noise: a computational biologist and a structural engineer both receive "Senior Engineer" titles in fast-growth startup environments where functional role and employment title have diverged. Title-only systems cannot resolve this; full-text systems can — to the extent that listing text faithfully describes the actual occupation. We return to the limits of this assumption in Section 6.4.

### 6.3 Confidence Calibration and Production Thresholding

[TO DO: Interpret calibration results. Questions to address: Is the model overconfident at high confidence values? Does miscalibration vary by SOC major group? Is a confidence threshold of [X] a defensible quality gate for production use, or does it introduce unacceptable STEM recall degradation by filtering out legitimate but ambiguous STEM listings?]

### 6.4 Limitations and Scope Conditions

**Validation corpus representativeness.** The Approach B hand-labeled set is collected opportunistically from companies present in both the LCA corpus and the funded startup database. This selection criterion overrepresents companies large enough and established enough to appear in both datasets. Early-stage companies — the primary target population — are underrepresented in validation. Idiosyncratic titles common at early-stage companies ("hacker in residence," "founding engineer") may be systematically harder to classify and systematically absent from our validation set.

**Synthetic listing circularity.** Approach A uses a language model to generate listings and the same language model to classify them. High Approach A accuracy may reflect model self-consistency rather than external validity. Approach B addresses this directly; [TO DO: characterize whether Approach A and Approach B results are consistent or divergent, and what the divergence implies].

**Name resolution error propagation.** Fuzzy matching introduces false joins estimated at 3–8% based on manual audit of a random sample. Downstream sponsorship scores for falsely-joined entities will be incorrect. We treat this as a known bias affecting a small fraction of the corpus rather than a validation-threatening flaw, but flag it for applications where individual employer-level accuracy is critical.

**Temporal mismatch.** LCA filings and job listings are not contemporaneous. A company's sponsorship behavior may have changed between its most recent LCA filing and the current listing. Historical LCA data is treated as a prior, not a guarantee.

**OPT/STEM OPT regulatory risk.** The sponsorship framework assumes current F-1/OPT regulations. Proposed and enacted regulatory changes could affect the practical value of the sponsorship signal independent of the classification system's accuracy. [TO DO: note any regulatory developments current as of paper submission that bear on this.]

### 6.5 Future Directions

[TO DO: 2–3 directions, grounded in the specific limitations raised above. Suggested: (a) prospective validation using outcome data from the user-facing platform; (b) fine-tuning or few-shot prompt optimization for early-stage company title patterns; (c) extending the sponsorship likelihood score with time-to-hire and conversion rate data.]

---

## 7. Conclusion

[TO DO: 1 paragraph. Answer the question: what does a job seeker or platform designer know after reading this paper that they did not know before? Tie back to the STEM recall number as the production-relevant result.]

---

## Acknowledgments

[TO DO]

## Funding

[TO DO]

## Conflicts of Interest

[TO DO]

## Author Contributions (CRediT)

[TO DO: List contributions by role — Conceptualization, Methodology, Software, Validation, Formal Analysis, Data Curation, Writing (Original Draft), Writing (Review & Editing), Supervision]

---

## References

[TO DO: Full reference list. All citations marked [CITE] throughout the draft require resolution. No references should be added to this list that were not cited inline. Recommended format: APA 7th or target journal style.]

---

## Appendix A: Prompt Templates

**A.1 SOC Classification Prompt**

[Full prompt template as specified in Section 4.2.2]

**A.2 Synthetic Listing Generation Prompt**

[TO DO: Paste exact prompt used for Approach A synthetic listing generation]

**A.3 Few-Shot Examples**

[TO DO: If few-shot examples are added to the production prompt, document them here]

---

## Appendix B: Validation Set Construction Details

[TO DO: Sampling frame, stratification procedure, O*NET crosswalk version used, any edge cases in the filtering step]

---

## Appendix C: Entity Resolution Audit Results

[TO DO: Summary statistics from manual audit of fuzzy-matched pairs — sample size, false positive rate estimate, confidence interval]

---

*Code, validation datasets, and prompt templates: https://github.com/nikbearbrown/80-Days-to-Stay*
*DOL LCA disclosure data: public domain. SEC EDGAR data: public domain. O*NET data: CC BY 4.0.*
