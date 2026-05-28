# Detecting Occupational and Wage Level Misclassification in H-1B Filings Using LLM-Based Job Listing Classification

**[TO DO: Author list, affiliations, corresponding author]**

---

## Abstract

Employers filing H-1B Labor Condition Applications are required to self-report both the Standard Occupational Classification (SOC) code and wage level for each sponsored role. Neither is independently verified by the Department of Labor at the certification stage. We present an LLM-based pipeline that independently classifies job listings by SOC code and DOL wage level and measures divergence from employer-filed values across a corpus of certified LCA records matched to full job listing text. We find that [TO DO: report overall SOC mismatch rate]% of matched listings diverge from filed SOC codes at the major-group level, and [TO DO: report wage level mismatch rate]% show downward wage level mismatch — employer-filed level below LLM-predicted level. Mismatches cluster systematically by employer (employer-level variance component σ² = [TO DO]), are concentrated in [TO DO: industry/SOC groups], and predict USCIS initial petition denial rates in both contemporaneous (β = [TO DO], p = [TO DO]) and lagged (β = [TO DO], p = [TO DO]) specifications. These findings suggest that a non-trivial share of H-1B misclassification is systematic rather than random and that LLM-based classification of public listing text provides a viable external signal for detecting it. Code, validation data, and all intermediate outputs are released under open license.

**Keywords:** H-1B, Labor Condition Application, occupational misclassification, wage level gaming, Standard Occupational Classification, large language models, prevailing wage, USCIS, labor market compliance

---

## 1. Introduction

The H-1B visa program authorizes U.S. employers to hire foreign nationals in specialty occupations requiring at least a bachelor's degree in a specific field. Before filing an H-1B petition with USCIS, employers must first obtain certification of a Labor Condition Application from the Department of Labor, attesting that the sponsored worker will be paid at least the prevailing wage for the occupation and location. The prevailing wage is determined jointly by the SOC code and the wage level — a four-tier classification ranging from Level I (entry-level) to Level IV (fully independent, experienced specialist). Employers select both.

Neither selection is independently verified at the LCA certification stage. DOL's role in the LCA process is administrative: it reviews attestations for completeness and compliance with procedural requirements, not for the accuracy of occupational classification [TO DO: cite DOL LCA program description or relevant GAO/OIG reports]. This creates a structural opportunity for employers to minimize prevailing wage obligations by classifying roles into lower-wage SOC codes or lower wage levels than the actual job duties warrant — a practice that has been documented in enforcement actions and academic commentary but has not been systematically measured at scale [TO DO: cite relevant enforcement actions, GAO reports, or prior academic work on H-1B wage compliance].

The downstream consequences are twofold. For the sponsored worker, misclassification may mean suppressed wages relative to the U.S. workers performing equivalent duties — the core labor market distortion the LCA program is designed to prevent. For the integrity of the H-1B system, systematic misclassification inflates the number of certified positions while understating the wage floor, distorting prevailing wage calculations in subsequent determination cycles.

Prior research has documented wage suppression effects in H-1B-dependent industries [TO DO: cite Kerr, Bound, or relevant wage suppression literature], and anecdotal reporting has identified specific employers subject to DOL investigations for misclassification [TO DO: cite if available]. However, scalable methods for detecting misclassification from public data have not been established. The key barrier has been the absence of an independent classification signal: LCA records report only employer-filed values, and obtaining independent occupational assessments for millions of filings is not feasible through manual review.

Large language models trained on broad occupational knowledge offer a tractable solution. Given full job listing text, an LLM can independently predict both the appropriate SOC code and the appropriate wage level, providing a comparison point against employer-filed values at scale. Where the LLM and employer consistently agree, filed classifications are plausibly accurate. Where they consistently diverge — especially in the downward direction — the divergence pattern warrants scrutiny.

This paper makes three contributions. First, we develop and validate an LLM-based pipeline for joint SOC and wage level classification from job listing text. Second, we characterize the prevalence, direction, and systematic clustering of mismatches between LLM-predicted and employer-filed classifications across the multi-year LCA corpus. Third, we externally validate the mismatch signal by testing whether employer-level mismatch rates predict USCIS petition denial rates — the strongest available public signal that USCIS adjudicators found something wrong with a filing.

[TO DO: Paper roadmap paragraph — one sentence per section.]

---

## 2. Background

### 2.1 The LCA Program and Prevailing Wage Structure

[TO DO: 2–3 paragraphs on the regulatory mechanics of LCA certification. Cover: (a) what an LCA attests to; (b) how prevailing wages are determined (OES survey data, DOL wage library, employer surveys); (c) the four wage levels and the criteria that distinguish them. Do not fabricate regulatory citations — mark any specific regulatory text with [CITE].]

### 2.2 SOC Classification in H-1B Adjudication

[TO DO: 1–2 paragraphs on how SOC code affects H-1B adjudication. Cover: (a) specialty occupation determination and the SOC/degree nexus; (b) cases where USCIS has denied petitions on grounds that the filed SOC code does not reflect the actual duties described; (c) the role of SOC code in the STEM OPT eligibility determination for the extension petition, if relevant to the paper's scope.]

### 2.3 Prior Work on H-1B Wage and Classification Compliance

[TO DO: Literature review section. Suggested coverage: (a) wage suppression literature in H-1B-intensive industries; (b) prior empirical work on LCA filing patterns, if any; (c) DOL/OIG audit findings on LCA compliance; (d) automated job classification methods and their application to labor market research. Do not fabricate citations — mark all specific claims requiring citation with [CITE].]

### 2.4 LLMs as Classification Tools for Labor Market Research

[TO DO: Brief methodological section on the application of LLMs to structured classification tasks in labor economics and HR analytics contexts. Cover: (a) advantages over rule-based or keyword systems for occupational coding; (b) relevant prior work on automated SOC coding; (c) known limitations, including hallucination and calibration issues. Mark all specific citations with [CITE].]

---

## 3. Data

### 3.1 DOL LCA Disclosure Data

The primary dataset is drawn from OFLC public disclosure files (https://www.dol.gov/agencies/eta/foreign-labor/performance), covering fiscal years 2018–2026. Analysis is restricted to `CASE_STATUS = CERTIFIED` records. The multi-year corpus comprises approximately 3–5 million certified records. Each record provides employer identity (name, FEIN), employer-submitted job title, employer-filed SOC code and title, offered wage and wage range, DOL-determined prevailing wage, employer-attested wage level (I–IV), worksite location, and filing timeline.

### 3.2 USCIS H-1B Employer Data Hub

The USCIS H-1B Employer Data Hub provides annual employer-level counts of initial and continuing H-1B petition approvals and denials. We compute per-employer initial denial rates as `initial_denials / (initial_approvals + initial_denials)` for each fiscal year. This metric serves as the external validation outcome for RQ4 and is joined to LCA records by `EMPLOYER_FEIN`.

### 3.3 Job Listing Corpus

LCA records contain employer-submitted job titles but not full job descriptions. We construct a matched listing corpus using two approaches.

**Approach A — Prospective collection.** For employers in the LCA corpus with active or archival job postings, we collect full listing text from company career pages and public job boards. Listings are matched to LCA records by employer FEIN, approximate job title similarity (token-set ratio ≥ 0.80), worksite location, and posting date within ±6 months of the LCA filing date. [TO DO: report total number of listings collected, employer coverage, and match rate against the LCA corpus.]

**Approach B — Hand-labeled sample.** We manually source and annotate 200 job listings from employers present in both the LCA corpus and the USCIS Employer Data Hub. A human annotator independently assigns SOC code and wage level using the O*NET crosswalk and DOL wage level definitions. This subset provides ground truth for classifier validation independent of filed LCA data.

### 3.4 O*NET Occupational Database

O*NET (onetonline.org) provides canonical SOC taxonomy definitions with task, skill, and knowledge descriptors. We use O*NET to validate returned SOC codes against the 2018 taxonomy, construct few-shot prompt examples, and operationalize the STEM/non-STEM major-group boundary. O*NET data is released under CC BY 4.0.

---

## 4. Methods

### 4.1 LLM-Based SOC Classification

For each job listing in the corpus, we prompt Claude Sonnet (claude-sonnet-4-20250514) at temperature = 0 to predict the most appropriate 2018 SOC code from full listing text. The classification prompt instructs the model to consider required qualifications, technologies, degree requirements, and job duties rather than title alone, and to return a structured JSON object containing predicted SOC code, SOC title, confidence score (0–1), and a one-sentence reasoning statement. All returned codes are validated against the canonical 2018 taxonomy; records returning invalid codes are null-coded and excluded.

### 4.2 LLM-Based Wage Level Classification

Separately, we prompt the model to predict the appropriate DOL wage level (I–IV) from listing content. The prompt provides definitions of all four levels — distinguishing entry-level, limited-supervision work (Level I) from fully independent, experienced specialist work requiring broad technical judgment (Level IV) — and instructs the model to return a structured JSON object with predicted level, confidence, and key signals driving the classification.

### 4.3 Seniority Signal Extraction

As a robustness check independent of the wage level prompt, we extract explicit seniority signals from listing text using a structured extraction prompt: minimum years of experience required, degree level required (Bachelor's / Master's / PhD), whether the role involves managing others, and whether the role requires independent research or technical direction. These signals provide an interpretable intermediate layer between raw listing text and the final wage level prediction, enabling diagnostic analysis of classifier behavior and error modes.

### 4.4 Mismatch Definition

**SOC mismatch** is evaluated at three levels of granularity. *Exact mismatch* is defined as LLM-predicted 6-digit SOC code ≠ employer-filed SOC code. *Major group mismatch* (the primary measure) is defined as disagreement on the first two digits, capturing substantive cross-domain divergence while absorbing within-group uncertainty. *STEM boundary mismatch* is a binary indicator for cases where LLM and employer disagree on whether the role falls within SOC major groups 15 (Computer and Mathematical), 17 (Architecture and Engineering), or 19 (Life, Physical, and Social Science).

**Wage level mismatch** is defined as any disagreement between LLM-predicted level and employer-filed `PW_WAGE_LEVEL`. We distinguish *downward mismatch* (LLM predicts higher level than filed — the directional signal for potential wage minimization) from *upward mismatch* (LLM predicts lower level than filed). We record numeric distance (e.g., filed Level I vs. LLM-predicted Level III = distance 2) to distinguish minor from severe mismatches.

**Composite mismatch score** combines both dimensions:

```
mismatch_score = w1 × soc_major_group_mismatch 
               + w2 × wage_level_downward_distance
               + w3 × stem_boundary_mismatch
```

Weights are initialized equally (w1 = w2 = w3 = 1/3) and sensitivity-tested across alternative specifications.

### 4.5 Prevalence Analysis (RQ1, RQ2)

We report mismatch rates overall and stratified by SOC major group (filed), wage level (filed), employer size (LCA filing volume as proxy), industry (NAICS code where available), geographic region (worksite state), and fiscal year. We test whether mismatch rates differ significantly across strata using chi-square tests for binary outcomes and Mann-Whitney U for continuous mismatch scores.

### 4.6 Systematic Clustering Analysis (RQ3)

To assess whether mismatches cluster by employer beyond chance, we fit a multilevel logistic regression model with employer as a random effect:

```
mismatch_ij ~ Bernoulli(p_ij)
logit(p_ij) = β0 + β1(industry_i) + β2(filing_volume_i) 
            + β3(wage_level_i) + u_i
u_i ~ Normal(0, σ²_employer)
```

A significant employer-level variance component (σ²\_employer > 0) indicates that mismatch concentrates in specific employers rather than distributing randomly across filings — the empirical signature of systematic rather than inadvertent misclassification.

### 4.7 External Validation via USCIS Denial Rates (RQ4)

We join employer-level mismatch rates (from DOL LCA analysis) to USCIS initial denial rates (from the Employer Data Hub) using `EMPLOYER_FEIN`. We estimate the cross-sectional association:

```
denial_rate_i = α + β1(soc_mismatch_rate_i) 
              + β2(wage_mismatch_rate_i)
              + β3(log_filing_volume_i)
              + β4(industry_FE)
              + β5(year_FE)
              + ε_i
```

We additionally test a lagged specification — mismatch rate in year *t* predicting denial rate in year *t*+1 — to address reverse causality from denial-driven filing corrections. A positive and significant β1 or β2 in either specification would indicate that the LLM mismatch signal captures substantive filing problems detected by USCIS adjudicators, not classifier noise.

---

## 5. Classifier Validation

### 5.1 Internal Validation — Hand-Labeled Sample

Using the 200 hand-labeled listings from Approach B, we evaluate top-1 SOC accuracy (exact 6-digit match), major group accuracy (2-digit match), wage level accuracy (exact level match), and directional accuracy (correct direction of seniority even if level is off by one). Human annotation constitutes ground truth for this subset.

Inter-annotator agreement is assessed on a 20-listing overlap sample between two independent annotators using Cohen's kappa. [TO DO: Report kappa values for SOC code assignment and wage level assignment. A kappa < 0.6 on wage level should prompt discussion of whether human annotation itself is the right ground truth for this dimension.]

### 5.2 Confidence Calibration

We bin predictions by self-reported confidence and compute empirical accuracy within each bin (0.0–0.5, 0.5–0.7, 0.7–0.9, 0.9–1.0) against the hand-labeled sample. A calibration curve plots predicted confidence against observed accuracy; we report Expected Calibration Error (ECE) as a summary statistic. Calibration results determine whether confidence thresholding is a viable quality gate in production — particularly relevant for the mismatch detection application, where miscalibrated high-confidence errors would be systematically flagged as misclassifications.

### 5.3 Prompt Sensitivity Analysis

We test three prompt variants on the hand-labeled validation set: zero-shot, three-shot with O*NET examples, and chain-of-thought with explicit reasoning steps. Accuracy differences across variants characterize prompt sensitivity and justify the chosen formulation. [TO DO: Report accuracy table across prompt variants for both SOC and wage level tasks.]

---

## 6. Results

[TO DO: This section requires empirical results. All numerical values below are placeholders — do not populate with estimated or illustrative figures.]

### 6.1 Corpus and Match Summary

[TO DO: Report:
- Final count of LCA records after filtering (certified only, FY2018–FY2026)
- Total job listings collected (Approach A)
- Match rate: listings successfully matched to LCA records
- Match confidence distribution
- Breakdown of matched records by SOC major group, wage level, employer size, and fiscal year
- Employer Data Hub join rate (FEIN match coverage)]

**Table 1.** [TO DO: Corpus summary statistics]

### 6.2 Classifier Validation Results

[TO DO: Report:
- Top-1 SOC accuracy, major group accuracy, wage level accuracy, directional accuracy on hand-labeled set
- Inter-annotator kappa for SOC and wage level
- ECE and calibration curve description
- Accuracy by prompt variant (zero-shot vs. few-shot vs. chain-of-thought)
- Characterization of most common error types]

**Table 2.** [TO DO: Classifier accuracy by task and prompt variant]

**Figure 1.** [TO DO: Confidence calibration curves for SOC and wage level tasks]

### 6.3 RQ1 — SOC Mismatch Prevalence

[TO DO: Report:
- Overall exact mismatch rate and major group mismatch rate
- STEM boundary mismatch rate
- Stratified rates by SOC major group, industry, firm size, state, and fiscal year
- Direction of mismatches: when LLM and employer disagree on major group, which direction is more common?
- Chi-square test results for between-strata differences]

**Table 3.** [TO DO: SOC mismatch rates by stratum]

**Figure 2.** [TO DO: Heatmap or bar chart of major-group mismatch rates by filed SOC major group and LLM-predicted major group]

### 6.4 RQ2 — Wage Level Mismatch Prevalence

[TO DO: Report:
- Overall wage level mismatch rate
- Downward vs. upward mismatch breakdown
- Distance distribution (off by 1 vs. 2 vs. 3 levels)
- Stratified rates by filed wage level, SOC major group, industry, and firm size
- Relationship between downward wage mismatch and the gap between offered wage and prevailing wage — do employers who file lower wage levels also offer wages closer to the prevailing wage floor?]

**Table 4.** [TO DO: Wage level mismatch rates by stratum and direction]

**Figure 3.** [TO DO: Distribution of mismatch distance for downward vs. upward mismatches]

### 6.5 RQ3 — Systematic Clustering

[TO DO: Report:
- Employer-level variance component (σ²_employer) and statistical significance
- Intraclass correlation coefficient: what share of total mismatch variance is between-employer rather than within-employer?
- Fixed effects estimates for industry, filing volume, and wage level
- Identification of high-mismatch employer clusters — describe without naming individual employers unless data is clearly public and unambiguous]

**Table 5.** [TO DO: Multilevel logistic regression results]

**Figure 4.** [TO DO: Empirical Bayes estimates of employer-level random effects, ranked — caterpillar plot or equivalent]

### 6.6 RQ4 — Mismatch as Predictor of USCIS Denial

[TO DO: Report:
- Cross-sectional regression results (contemporaneous specification)
- Lagged specification results
- Robustness checks: high-confidence matches only; pre/post 2020 regulatory change subsamples; alternative mismatch score weight specifications
- Interpretation: what fraction of the between-employer variance in denial rates is explained by mismatch rates?]

**Table 6.** [TO DO: Regression results — denial rate on mismatch rates, contemporaneous and lagged]

---

## 7. Discussion

### 7.1 Principal Findings

[TO DO: Open with the two headline numbers — SOC mismatch rate and downward wage level mismatch rate — and the external validation result. Lead with what these numbers mean for the integrity of the LCA program before discussing methodological implications.]

### 7.2 Systematic vs. Random Misclassification

The multilevel model result is the finding most relevant to the question of intent. A large employer-level variance component indicates that mismatch is not distributed uniformly across filings — it concentrates. Employers in the upper tail of the mismatch distribution show rates far exceeding what would be expected from random classification error across the full SOC taxonomy. [TO DO: Characterize the upper tail quantitatively — e.g., "employers in the top decile of mismatch rate account for X% of all mismatches while representing Y% of filings."]

This pattern is consistent with — though not conclusive evidence of — deliberate misclassification strategy. Alternative explanations include systematic differences in how certain industries or job functions map onto the SOC taxonomy (genuine classification difficulty concentrated in specific domains) and firm-level HR consulting practices that apply consistent but incorrect classification heuristics. We return to the limits of causal inference from this design in Section 7.5.

### 7.3 Downward Wage Level Mismatch and Prevailing Wage Implications

[TO DO: Quantify the wage implications of observed downward mismatches. If Level I prevailing wages are [X]% below Level III wages for the same SOC code and location, what is the aggregate wage underpayment implied by the observed mismatch rate? This is a rough estimate, not a precise claim — frame it as an order-of-magnitude illustration and note the assumptions required.]

### 7.4 External Validation via USCIS Denial Rates

The RQ4 finding is this study's strongest evidence that the LLM mismatch signal captures substantive filing problems rather than classifier noise. USCIS adjudicators reviewing H-1B petitions — who have access to the full petition package, not just the LCA record — independently arrive at higher denial rates for the same employers our classifier flags. [TO DO: Report the magnitude and interpret it — a one-standard-deviation increase in mismatch rate corresponds to a [X] percentage point increase in denial rate.]

The lagged specification strengthens this interpretation: if denial rates predict subsequent mismatch corrections (reverse causality), the lagged coefficient should attenuate relative to the contemporaneous coefficient. [TO DO: Report whether this pattern holds.]

### 7.5 Limitations

**Self-report bias in LCA data.** Employer-filed SOC codes are not independently verified by DOL at the LCA certification stage. The LCA corpus therefore reflects employer classification decisions, some of which may already be incorrect. Our method detects divergence from employer filings; it cannot independently establish ground truth SOC codes at scale. The LLM classifier is a signal, not an auditor.

**Listing-to-LCA matching uncertainty.** Matching job listings to LCA records by employer, title, and date is imperfect. False matches introduce noise into the mismatch signal, biasing mismatch rates toward zero and attenuating our estimates conservatively. Sensitivity analyses restricted to high-confidence matches (token-set ratio ≥ 0.92) provide a partial check. [TO DO: Report whether sensitivity analysis results are materially different from main estimates.]

**LLM classification errors.** The classifier is not infallible. Novel job titles, highly specialized roles, and idiosyncratic listing language produce incorrect predictions at rates characterized in Section 6.2. Classification errors attenuate observed mismatch rates toward zero, again biasing estimates conservatively.

**Observational design and intent.** We characterize the prevalence and correlates of divergence between LLM-predicted and employer-filed classifications. We do not adjudicate intent. The systematic clustering result is consistent with deliberate misclassification, but it is also consistent with consistent errors introduced by third-party immigration counsel applying the same flawed heuristics across a firm's filing portfolio. Causal attribution requires enforcement-action or interview data beyond the scope of this study.

**USCIS denial as a noisy outcome.** Petition denials reflect a range of deficiencies beyond SOC/wage level misclassification, including specialty occupation determination, degree equivalency, and procedural issues. The denial rate is a plausibility check on the mismatch signal, not a direct measure of the behavior we study.

**Temporal scope and regulatory discontinuities.** SOC taxonomy revision (2010 → 2018) and prevailing wage methodology changes — particularly the 2020 Interim Final Rule and subsequent litigation — introduce discontinuities in longitudinal analyses. [TO DO: Identify specific fiscal years affected by major regulatory changes and describe the robustness checks performed on pre/post subsamples.]

### 7.6 Policy Implications

[TO DO: 2–3 paragraphs. Suggested framing: (a) what the scale of mismatch implies for the LCA program's self-attestation model; (b) what this method enables that manual audit cannot; (c) whether this approach could function as a targeting system for DOL compliance audits, with appropriate caveats about base rates and false positive consequences for employers.]

### 7.7 Future Directions

[TO DO: 2–3 directions grounded in the specific limitations above. Suggested: (a) prospective validation using DOL enforcement action data if obtainable; (b) extension to LCA-exempt employers using public job board data; (c) cross-validation against a second LLM to characterize inter-model disagreement as an additional uncertainty signal.]

---

## 8. Conclusion

[TO DO: 1 paragraph. Answer: what does this paper establish that was not established before? Name the headline mismatch rate, the clustering result, and the denial rate association. Close with what the method enables — a scalable, public-data approach to detecting a compliance problem that has been documented anecdotally but not measured systematically.]

---

## Acknowledgments

[TO DO]

## Funding

[TO DO]

## Conflicts of Interest

[TO DO]

## Author Contributions (CRediT)

[TO DO: Conceptualization, Methodology, Software, Formal Analysis, Data Curation, Writing (Original Draft), Writing (Review & Editing), Supervision]

---

## References

[TO DO: Full reference list. All inline claims marked [CITE] require resolution before submission. No references should appear here that are not cited inline. Recommended format: APA 7th or target journal style.]

---

## Appendix A: Prompt Templates

**A.1 SOC Classification Prompt**

[Full prompt as specified in Section 4.1]

**A.2 Wage Level Classification Prompt**

[Full prompt as specified in Section 4.2]

**A.3 Seniority Signal Extraction Prompt**

[TO DO: Paste exact prompt used for structured seniority signal extraction]

**A.4 Few-Shot Examples (if used in final prompt)**

[TO DO: Document all few-shot examples used in the three-shot prompt variant]

---

## Appendix B: Multilevel Model Specification Details

[TO DO: Full model specification, priors if Bayesian, software and package versions, convergence diagnostics, sensitivity to alternative random-effects structures (e.g., adding industry-level random effects)]

---

## Appendix C: Listing-to-LCA Match Procedure

[TO DO: Exact matching algorithm, token-set ratio threshold justification, false match rate estimate from manual audit of a random sample, sensitivity analysis results comparing main estimates to high-confidence match subset]

---

## Appendix D: Regulatory Change Timeline

[TO DO: Table of major LCA/H-1B regulatory events from FY2018–FY2026 with fiscal years affected, used to define subsamples for robustness checks]

---

*Code, prompt templates, and intermediate outputs: https://github.com/nikbearbrown/80-Days-to-Stay*  
*DOL LCA and USCIS Employer Data Hub: public domain. O*NET: CC BY 4.0.*
