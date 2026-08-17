# Cognitive Tier Composition of Funded Startup Labor Demand Across AI Development Milestones, 2017–2026

**[TO DO: Author list, affiliations, corresponding author]**

---

## Abstract

We examine how funded startup hiring patterns changed across key AI development milestones between 2017 and 2026, using the H-1B Labor Condition Application disclosure corpus as a longitudinal signal of international talent demand at venture-backed firms. We map SOC codes from certified LCA filings to a seven-tier cognitive taxonomy — the Irreducibly Human framework — distinguishing roles by the type of cognitive work they demand, from pattern recognition and routine processing (Tier 1) to metacognitive oversight, causal reasoning, and existential judgment (Tiers 4–7). We find that [TO DO: report the directional finding — whether cognitive tier composition shifted post-ChatGPT], with [TO DO: key SOC groups] showing the sharpest movements. The shift [TO DO: is/is not] accompanied by a corresponding change in wage level distribution: [TO DO: characterize]. Biotech and software startups show [TO DO: similar/divergent] patterns. These findings [TO DO: support/complicate/are neutral toward] the Irreducibly Human thesis that post-LLM labor demand is reorienting away from automatable cognitive tiers toward roles requiring judgment, oversight, and synthesis that current AI systems cannot reliably perform. All data are public domain; code and analytical outputs are released under open license.

**Keywords:** cognitive labor demand, startup hiring, H-1B, SOC classification, AI labor market effects, Irreducibly Human, cognitive tier, LCA data, venture-backed firms, workforce transformation

---

## 1. Introduction

The diffusion of large language models into production environments — marked by successive milestones from the Transformer architecture in 2017 through the public deployment of autonomous coding agents in 2025–2026 — has renewed empirical interest in how AI capability shifts translate into observable changes in labor demand. Much of the existing literature examines wage and employment effects in large, publicly traded firms or at the aggregate industry level [TO DO: cite relevant labor economics literature on AI and employment]. Venture-funded startups present a different case. They operate closer to the technical frontier, hire disproportionately in knowledge-intensive occupations, and face labor demand constraints that are less buffered by incumbent workforce composition than large enterprises. If the cognitive composition of labor demand is shifting in response to AI capability, it should be detectable earlier and more sharply in the startup hiring signal than in aggregate employment data.

The Irreducibly Human framework provides a structured theoretical lens for this question. It organizes occupations into seven cognitive tiers distinguishing the type of cognitive work each demands: from Tier 1, which covers pattern recognition, association, and routine processing — the capabilities most directly contested by current AI systems — to Tiers 4–7, which cover metacognitive oversight, causal and counterfactual reasoning, collective synthesis across distributed agents, and existential judgment in conditions of genuine uncertainty. The framework predicts that AI capability growth will suppress demand for Tier 1–2 roles while increasing demand for Tier 4–7 roles, as organizations require human workers to oversee, verify, and govern AI systems performing the lower-tier work [TO DO: cite Irreducibly Human framework documentation].

This paper asks whether that prediction is visible in the hiring data. We use the Department of Labor's LCA disclosure corpus — the most granular publicly available longitudinal record of U.S. employer occupational demand for international knowledge workers — to characterize the cognitive tier composition of startup hiring across nine fiscal years. We anchor the temporal analysis to a small set of documented AI milestones that mark genuine capability thresholds rather than commercial announcements: the 2017 Transformer publication, the 2020 GPT-3 release, the 2021 GitHub Copilot beta, the November 2022 ChatGPT release (our primary break point), and the 2025–2026 emergence of autonomous coding agents. Our analysis is explicitly descriptive and correlational. The milestone timeline is an interpretive scaffold — it provides temporal anchors for characterizing when changes occurred — not a causal mechanism.

The paper makes three contributions. First, it applies the Irreducibly Human cognitive tier taxonomy to a large empirical dataset for the first time, validating the taxonomy's coverage and internal consistency against observed hiring distributions. Second, it characterizes the pre-/post-ChatGPT shift in startup cognitive tier demand with sufficient resolution to distinguish sector-level heterogeneity (biotech vs. software) and wage-level dynamics. Third, it establishes a replicable pipeline — from Form D funding data through LCA matching to cognitive tier assignment — that can be updated as new LCA disclosure data becomes available.

[TO DO: Paper roadmap paragraph — one sentence per section.]

---

## 2. Background

### 2.1 AI Milestones and Labor Market Responses

[TO DO: 2–3 paragraphs on what is known empirically about how AI capability milestones affect labor demand. Suggested coverage: (a) task-based frameworks for AI substitution (Autor et al., Acemoglu, Brynjolfsson and McAfee lineage); (b) empirical evidence on post-LLM labor market effects — wage changes, occupational demand shifts, employment level effects; (c) the specific literature on startup hiring and AI adoption, if any. Mark all specific citations with [CITE]. Do not fabricate. Characterize the gap: aggregate studies exist, startup-specific cognitive tier analysis does not.]

### 2.2 The Irreducibly Human Cognitive Tier Taxonomy

The Irreducibly Human framework maps occupations to seven cognitive tiers based on the primary type of cognitive work they require. The tier structure is as follows:

- **Tier 1 — Pattern/Association:** Recognition, retrieval, classification, routine processing. Directly contested by current LLMs and narrow AI systems.
- **Tier 2 — Embodied/Sensorimotor:** Physical skill, haptic precision, spatial navigation, manual dexterity. Contested by robotics but not by purely cognitive AI.
- **Tier 3 — Social/Personal:** Empathy, interpersonal attunement, trust-building, emotional labor. Partially contestable by conversational AI but requires human relational presence for full execution.
- **Tier 4 — Metacognitive/Supervisory:** Monitoring and evaluating AI and human outputs, calibrating confidence, recognizing when to escalate. Directly demanded by AI deployment.
- **Tier 5 — Causal/Counterfactual:** Causal reasoning under uncertainty, generating and testing counterfactuals, planning under novel conditions.
- **Tier 6 — Collective/Distributed:** Synthesizing knowledge across heterogeneous agents and institutions, coordinating distributed sense-making, governing complex sociotechnical systems.
- **Tier 7 — Existential/Wisdom:** Judgment on questions of value, ethics, meaning, and long-term consequence in conditions of genuine uncertainty.

The framework assigns SOC codes to tiers based on the O*NET cognitive skill and ability profile of each occupation, with primary coverage of BLS major groups 11 (Management), 13 (Business/Financial Operations), 15 (Computer and Mathematical), and 17 (Architecture and Engineering). [TO DO: Describe the tier assignment procedure in more detail — is each SOC assigned to a single tier, or does it carry a weighted vector across tiers? Characterize any SOC codes in the LCA corpus that fall outside the taxonomy's coverage and how they are handled.]

### 2.3 H-1B LCA Data as a Hiring Signal

The DOL LCA disclosure corpus provides a uniquely granular longitudinal record of employer occupational demand, but it is not a general hiring measure. It captures only roles for which employers filed H-1B, H-1B1, or E-3 sponsorship, which represents a specific segment of the knowledge worker labor market: roles filled by international workers who require employer sponsorship to maintain work authorization. This population is concentrated in STEM occupations, overrepresents large technology employers relative to their share of total employment, and reflects employer willingness to bear the cost and delay of sponsorship in addition to the underlying demand for the role.

The use of LCA data as a proxy for total startup hiring requires two assumptions: (a) that the cognitive tier composition of sponsored roles is representative of total hiring at the same firms, and (b) that changes in tier composition over time reflect genuine demand shifts rather than shifts in the supply of sponsorship-eligible workers or changes in employers' sponsorship willingness. Both assumptions are contestable and we address them explicitly in the Limitations section. We treat LCA data as a signal about one segment of startup labor demand — the international knowledge worker pipeline — rather than as a complete account of startup hiring.

[TO DO: Add 1 paragraph on prior uses of LCA data in labor economics research, if any. Mark with [CITE].]

---

## 3. Data

### 3.1 SEC EDGAR Form D Filings

Venture-funded company data is drawn from SEC Form D filings via the EDGAR full-text search API (https://efts.sec.gov/LATEST/search-index). Form D is required for private offerings under Regulation D and provides company legal name, industry classification, total offering amount, filing date, and principal office address. We filter to companies filing between January 2017 and December 2026 with total offering amounts ≥ $5M, incorporated in the United States, and classified in STEM-adjacent NAICS codes covering biotechnology, software, engineering services, and medical devices. SEC EDGAR data is public domain.

[TO DO: Report the total number of Form D filings meeting these criteria, breakdown by sector and year, and distribution of offering amounts.]

### 3.2 DOL LCA Disclosure Data

The primary hiring corpus is drawn from OFLC public disclosure files (https://www.dol.gov/agencies/eta/foreign-labor/performance), covering fiscal years 2017–2026. Analysis is restricted to `CASE_STATUS = CERTIFIED` records. Key fields retained for analysis are employer name, FEIN, employer-submitted job title, employer-filed SOC code and title, offered wage, DOL-determined prevailing wage, employer-attested wage level (I–IV), worksite state, and case submission date. The multi-year corpus comprises approximately [TO DO: report count after FY2017 filter] certified records across all employers. The matched startup subset — LCA records linked to Form D filers — is characterized separately.

### 3.3 O*NET Occupational Database

O*NET (onetonline.org) provides the canonical 2018 SOC taxonomy with granular ratings of skills, abilities, and knowledge domains for each occupation. We use O*NET to extract cognitive ability and skill profiles for each SOC code appearing in the matched startup LCA corpus: specifically, ratings on information ordering, inductive and deductive reasoning, problem sensitivity, fluency of ideas, originality, social perceptiveness, and systems evaluation. These ratings provide the empirical basis for validating and extending cognitive tier assignments. O*NET data is released under CC BY 4.0.

### 3.4 Irreducibly Human Cognitive Tier Taxonomy

The cognitive tier taxonomy maps SOC codes in BLS major groups 11, 13, 15, and 17 to seven tiers based on the primary cognitive demands of each occupation. [TO DO: Describe the coverage of the taxonomy — how many unique SOC codes are assigned, what fraction of startup LCA filings fall within the covered SOC codes, and how out-of-coverage codes are handled (excluded, assigned to a residual category, or partially mapped based on O*NET profile similarity).]

---

## 4. Methods

### 4.1 Entity Resolution

#### 4.1.1 Matching Form D Filers to LCA Records

Matching Form D companies to LCA records requires bridging two datasets that share no common identifier. Form D filings do not include EINs; LCA records include `EMPLOYER_FEIN` where the employer provided it (coverage is [TO DO: report FEIN completion rate in LCA corpus]).

For LCA records with a valid FEIN, we apply a three-step resolution procedure. First, we attempt to recover the EIN for each Form D company through IRS or commercial registry data (D&B or equivalent). Second, we join matched Form D EINs to LCA FEIN values directly. Third, for Form D companies without a recoverable EIN, we apply fuzzy name matching using RapidFuzz token-set ratio (threshold ≥ 0.88) on normalized legal names (lowercase, stripped punctuation, expanded common abbreviations), followed by manual review of matches with confidence below 0.92.

The output is a matched population (Form D filers with at least one certified LCA record) and an unmatched population (Form D filers with no matched LCA record). Both populations are characterized separately. The unmatched population may reflect companies that do not sponsor international workers, companies too early-stage to have filed LCA applications, or entity resolution failures; we attempt to distinguish these cases using USCIS Employer Data Hub coverage as a partial check.

#### 4.1.2 Match Rate and Coverage

[TO DO: Report the overall match rate — what fraction of Form D filers (meeting filter criteria) have at least one matched LCA record. Report variation in match rate by funding amount, sector, geography, and filing year. Characterize the matched vs. unmatched populations on observable dimensions to assess selection bias.]

### 4.2 Cognitive Tier Assignment

#### 4.2.1 SOC-to-Tier Mapping

Each LCA record in the matched startup corpus carries an employer-filed SOC code. We map each SOC code to the Irreducibly Human cognitive tier taxonomy, producing a tier assignment for each filing. [TO DO: Specify whether tier assignment is a single primary tier or a weighted vector. Describe how ties or borderline cases are resolved. Report the fraction of filings assigned to each tier across the full corpus.]

#### 4.2.2 O*NET Validation of Tier Assignments

As a validation step, we compare the O*NET cognitive ability and skill profile of each SOC code to the expected profile of its assigned tier. Tier 1 occupations should score high on information ordering and low on originality and problem sensitivity; Tier 4–7 occupations should show the reverse pattern. [TO DO: Report the correlation between O*NET profile characteristics and tier assignments, and flag any SOC codes where the O*NET profile is inconsistent with the assigned tier.]

#### 4.2.3 Handling Out-of-Coverage SOC Codes

SOC codes outside BLS major groups 11, 13, 15, and 17 are not covered by the Irreducibly Human taxonomy as specified. For LCA filings in uncovered major groups (e.g., SOC 19 — Life, Physical, and Social Science, which is common in biotech startup hiring), we apply one of three approaches: [TO DO: specify — (a) exclude and report coverage loss; (b) assign to the nearest covered tier using O*NET profile similarity; (c) create a residual "uncovered" category and report it separately. The chosen approach should be stated explicitly and its implications for the biotech vs. software comparison addressed.]

### 4.3 Temporal Analysis

#### 4.3.1 Analysis Periods

We define three analysis periods based on documented AI capability milestones:

- **Pre-LLM baseline:** FY2018–FY2021 (post-Transformer publication, pre-GPT-3 mainstream adoption)
- **Transition:** FY2022 (GPT-3 in production use, GitHub Copilot in beta, ChatGPT released in November)
- **Post-LLM:** FY2023–FY2026 (GPT-4, Claude, Gemini, and autonomous coding agents in production)

FY2017 is retained for trend visualization but excluded from the primary pre/post comparison due to sparse Form D matching coverage in that year. [TO DO: Confirm FY2017 coverage and adjust this decision accordingly.]

#### 4.3.2 Milestone Anchors

The milestone timeline is used as an interpretive scaffold for temporal visualization, not as a causal mechanism. We plot cognitive tier composition as a time series and annotate milestone dates; we do not assert that any observed change was caused by the corresponding milestone. We use the ChatGPT public release (November 2022) as the primary period break point because it represents the most widely documented threshold for mainstream LLM diffusion into employer-facing workflows.

#### 4.3.3 Trend Estimation

For the primary EDA questions, we report tier composition as a fraction of total startup LCA filings within each analysis period. We use two-proportion z-tests to assess whether tier composition differences between periods are statistically significant at the filing level, with Bonferroni correction for multiple comparisons across seven tiers. We additionally fit a simple linear time trend within each period to characterize whether the shift — if observed — was gradual or concentrated around the break point.

### 4.4 Sector Comparison

We compare cognitive tier composition and temporal trends between biotech startups (NAICS 325411–325414, 541714–541715) and software startups (NAICS 511210, 519130, 541511–541512) as the two largest STEM-adjacent sectors in the Form D corpus. Comparisons are reported descriptively; we do not model the sector difference as a causal effect.

### 4.5 Wage Level Analysis

We characterize the distribution of employer-attested wage levels (I–IV) in the matched startup corpus across analysis periods. If cognitive tier composition is shifting toward higher-tier roles, we expect a corresponding shift toward higher wage levels (Level III–IV), since Tier 4–7 occupations should require more experienced workers. Absence of a corresponding wage level shift would constitute evidence against the cognitive tier shift interpretation.

---

## 5. Results

[TO DO: All numerical values and findings below are placeholders. Do not populate with estimated or illustrative figures.]

### 5.1 Corpus and Match Summary

[TO DO: Report:
- Total Form D filings meeting filter criteria, by sector and year
- Total certified LCA records in the matched startup corpus, by sector and year
- Match rate and its variation by funding amount, sector, geography, and year
- Characterization of matched vs. unmatched populations on observable dimensions
- Cognitive tier coverage: fraction of matched LCA filings assigned to a primary tier vs. uncovered]

**Table 1.** [TO DO: Corpus summary statistics — Form D filings, matched LCA records, match rate, by sector and analysis period]

### 5.2 EDA Question 1 — LCA Coverage of Form D Companies

[TO DO: Report:
- Fraction of Form D filers (overall and by sector) with at least one certified LCA record
- Variation by funding amount: do higher-funded companies show higher LCA coverage?
- Variation by geography: coastal concentration expected; characterize
- Variation by year: does LCA coverage of funded startups change across the timeline?]

**Figure 1.** [TO DO: LCA match rate by Form D offering amount bin and sector]

### 5.3 EDA Question 2 — SOC Distribution of Startup vs. Large-Employer LCA Filings

[TO DO: Report:
- SOC major group distribution in the matched startup corpus vs. full LCA corpus
- Which SOC codes are overrepresented in startup filings relative to all LCA filers?
- Top 20 SOC codes by filing volume in the startup corpus, with cognitive tier assignments]

**Table 2.** [TO DO: SOC major group shares — startup corpus vs. full LCA corpus]

**Figure 2.** [TO DO: SOC major group composition comparison, startup vs. large-employer, by analysis period]

### 5.4 EDA Question 3 — O*NET Skill and Ability Clusters

[TO DO: Report:
- Which O*NET skills and abilities are most prevalent in the startup corpus overall?
- Which are rising and declining across the timeline?
- Is there a detectable shift in cognitive skills — e.g., rising originality, problem sensitivity, systems evaluation — relative to declining information ordering, programming?
- Note: this is a descriptive characterization of the skill profile, not a causal claim about AI substitution]

**Figure 3.** [TO DO: Heatmap of O*NET skill/ability ratings by SOC major group and analysis period, startup corpus only]

### 5.5 EDA Question 4 — Cognitive Tier Composition Pre- vs. Post-ChatGPT

[TO DO: Report:
- Tier composition (T1–T7 shares) in pre-LLM baseline vs. post-LLM period
- Direction and magnitude of each tier's change
- Statistical significance of tier-level composition differences (z-test results with Bonferroni correction)
- Whether the shift — if observed — is gradual across years or concentrated around the ChatGPT break point
- This is the primary finding of the paper]

**Table 3.** [TO DO: Cognitive tier composition by analysis period — filing shares, period-over-period change, z-statistics]

**Figure 4.** [TO DO: Cognitive tier composition time series (2018–2026) with AI milestone annotations]

### 5.6 EDA Question 5 — Sector Heterogeneity: Biotech vs. Software

[TO DO: Report:
- Cognitive tier composition for biotech startups vs. software startups, baseline and post-LLM
- Do the two sectors show the same directional shift?
- Are there tier movements unique to one sector (e.g., Tier 2 embodied roles relevant to biotech lab work but not software)?
- Does the ChatGPT break point appear at the same time in both sectors, or is the software sector earlier?]

**Figure 5.** [TO DO: Cognitive tier composition over time, biotech vs. software, side-by-side]

### 5.7 EDA Question 6 — Wage Level Distribution Over Time

[TO DO: Report:
- Wage level (I–IV) distribution in startup corpus by analysis period
- Does startup hiring skew more senior (Level III–IV) post-2022?
- Does the wage level shift correlate with the cognitive tier shift directionally?
- Report the ratio of prevailing wage to offered wage across periods as a secondary check on wage level accuracy]

**Table 4.** [TO DO: Wage level distribution by analysis period and sector]

**Figure 6.** [TO DO: Wage level composition time series with milestone annotations]

---

## 6. Discussion

### 6.1 Does the Data Support the Irreducibly Human Thesis?

[TO DO: This is the paper's central interpretive question. Answer it directly, quantitatively, and without overclaiming. Three possible findings require different framings:

(a) Tier 4–7 shares rose significantly post-ChatGPT, Tier 1–2 shares fell: "The finding is consistent with the Irreducibly Human prediction. We cannot establish causation, but the timing and direction of the shift align with the thesis."

(b) No significant tier composition shift: "The thesis is not supported by the international hiring signal at funded startups over this period. This may reflect [lag, sectoral specificity, LCA data limitations — specify]."

(c) Mixed or heterogeneous results: "The aggregate signal is [weak/absent], but [specific sector or SOC group] shows a pattern consistent with the thesis. The overall signal is insufficient to confirm or refute the framework at this level of analysis."

Choose the framing appropriate to the actual results. Do not select framing before results are in hand.]

### 6.2 Interpreting the Temporal Pattern

[TO DO: Address the question of whether any observed shift is gradual across the full period or concentrated around specific milestones. A shift that begins in 2021 (Copilot beta) or earlier would suggest the cognitive composition of startup hiring was changing before ChatGPT became the dominant public narrative. A shift concentrated in 2023–2024 would suggest the ChatGPT public deployment was the operative threshold for employer behavior. A shift absent in the LCA data entirely would be consistent with either (a) no change in cognitive demand or (b) a change that is occurring in domestic hiring rather than international sponsorship.]

### 6.3 Sector Heterogeneity

[TO DO: Discuss what the biotech vs. software divergence — or convergence — implies. Software startups are more directly affected by coding AI; a stronger Tier 1 decline in software is expected and would be consistent with the thesis. Biotech has a larger Tier 2 (embodied/sensorimotor) component (lab work) that is not contestable by LLMs; Tier 4–7 growth in biotech may reflect different drivers (regulatory complexity, clinical oversight) than in software.]

### 6.4 The LCA-as-Proxy Assumption

The most significant interpretive constraint in this study is the gap between LCA data and total startup hiring. Several mechanisms could produce divergence between international sponsorship patterns and domestic hiring patterns:

**Substitution hypothesis.** If AI tools reduce the need for routine coding and data processing roles — Tier 1 occupations — employers may reduce sponsorship of those roles while maintaining or increasing domestic hiring. The LCA signal would show Tier 1 decline, but this would reflect international hiring specifically, not an overall demand reduction.

**Complementarity hypothesis.** Employers hiring more AI oversight and integration roles (Tier 4–7) may preferentially sponsor international workers for those roles if the supply of qualified domestic workers is insufficient. In this case, the LCA signal would overstate the overall Tier 4–7 shift relative to total hiring.

**Survivorship in the matched corpus.** The matched population consists of Form D filers that subsequently appeared in LCA data. These are not a random sample of funded startups; they are companies that grew to the point of H-1B sponsorship. Cognitive tier patterns in this population may differ systematically from the broader funded startup universe.

We cannot resolve these ambiguities with available data. We flag them explicitly and recommend that conclusions from this analysis be bounded to "the international knowledge worker hiring signal at funded startups" rather than extrapolated to total startup labor demand.

### 6.5 Cognitive Tier Taxonomy Validity

[TO DO: Address any SOC codes where the O*NET validation (Section 4.2.2) revealed inconsistency between the assigned tier and the O*NET profile. If the taxonomy has coverage gaps — particularly in SOC 19 (Life, Physical, and Social Science) relevant to biotech — characterize how this affects the sector comparison. A taxonomy that works well for software occupations but poorly for biotech occupations would systematically understate Tier 4–7 presence in biotech hiring.]

### 6.6 Limitations

**LCA data captures international hires only.** See Section 6.4. This is the primary scope condition and must be treated as a scope condition, not a weakness to minimize.

**Employer-filed SOC codes may be inaccurate.** The companion study on misclassification (this volume [TO DO: cross-reference if these papers are being published together]) found mismatch rates of [TO DO: cite finding] between employer-filed and LLM-predicted SOC codes. Cognitive tier assignments inherit this noise. If misclassification is systematic — e.g., employers consistently filing Tier 4–7 roles under Tier 1 SOC codes to minimize prevailing wage obligations — the observed tier distribution will understate actual cognitive demand.

**Cognitive tier assignment is deterministic given SOC code.** A single SOC code (e.g., 15-1252, Software Developer) covers roles that vary enormously in actual cognitive demand — from maintaining legacy pipelines (Tier 1) to designing AI oversight architectures (Tier 4). The taxonomy cannot distinguish these within-SOC-code variations. Full-text listing analysis, as described in the companion classification study (this volume), would resolve this at the cost of requiring matched listing data for the full LCA corpus.

**AI milestone timeline is not a causal design.** The before/after structure is descriptive. Any observed shift in cognitive tier composition between the pre-LLM and post-LLM periods is consistent with the AI capability hypothesis but is also consistent with any other secular trend operating over the same time window — including macroeconomic conditions affecting startup hiring, regulatory changes affecting H-1B sponsorship, and compositional shifts in the funded startup population.

**Fuzzy match error propagation.** [TO DO: Characterize false positive join rate from the match audit and its implications for the matched corpus composition.]

### 6.7 Future Directions

[TO DO: 2–3 directions grounded in specific limitations above. Suggested: (a) full-text listing analysis to distinguish within-SOC cognitive demand variation, building on the classification pipeline in the companion paper; (b) domestic hiring data integration — Burning Glass/Lightcast job posting data would allow comparison of sponsorship vs. total hiring tier composition; (c) longitudinal follow-up — this dataset can be updated annually as new LCA disclosure files are released, enabling prospective tracking of tier composition through the autonomous agent era.]

---

## 7. Conclusion

[TO DO: 1 paragraph. Answer the question stated in the one-thing-to-remember: does the post-ChatGPT startup hiring signal show a measurable shift toward higher cognitive tier roles — and does it confirm, complicate, or fail to engage with the Irreducibly Human thesis? Name the primary finding, bound it to the LCA international hiring signal, and close with what this implies for researchers tracking AI's effects on knowledge worker demand.]

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

## Appendix A: AI Milestone Timeline

| Date | Milestone | Relevance to Study |
|------|-----------|-------------------|
| June 2017 | "Attention Is All You Need" published | Transformer architecture; foundation for all subsequent LLMs |
| May 2020 | GPT-3 released (API access) | First general-purpose LLM at production scale |
| June 2021 | GitHub Copilot beta | First mainstream AI coding assistant; direct relevance to Tier 1 coding demand |
| November 2022 | ChatGPT public release | Primary break point; mainstream LLM diffusion into employer workflows |
| March 2023 | GPT-4 released | Multimodal capability; significantly improved reasoning |
| 2023–2024 | Claude, Gemini, agentic AI mainstream | Competitive multi-provider LLM market; agentic workflows in production |
| 2025–2026 | Claude Code, Gemini CLI, autonomous coding agents | Autonomous code generation at production scale |

*Note: This timeline is used as an interpretive scaffold for temporal visualization, not as a causal mechanism. No finding in this paper is interpreted as caused by a specific milestone.*

---

## Appendix B: Irreducibly Human Cognitive Tier Taxonomy — SOC Coverage

[TO DO: Full table of SOC codes covered by the taxonomy, with tier assignments, O*NET validation scores, and any codes flagged for inconsistency between assigned tier and O*NET profile]

---

## Appendix C: Entity Resolution Procedure and Match Audit

[TO DO: Detailed description of the EIN recovery procedure for Form D companies, fuzzy match algorithm parameters, false positive rate estimate from manual audit, and sensitivity analysis comparing main results between FEIN-matched and fuzzy-matched subpopulations]

---

## Appendix D: O*NET Skill and Ability Ratings by Cognitive Tier

[TO DO: Table showing mean O*NET ratings on key cognitive dimensions (information ordering, inductive reasoning, originality, problem sensitivity, social perceptiveness, systems evaluation) by assigned cognitive tier, used to validate tier assignments]

---

## Appendix E: Sector NAICS Code Classifications

| Sector | NAICS Codes Included |
|--------|---------------------|
| Biotechnology | 325411, 325412, 325413, 325414, 541714, 541715 |
| Software | 511210, 519130, 541511, 541512 |
| Engineering Services | 541330 |
| Medical Devices | 339112, 339113 |

[TO DO: Confirm NAICS code set against the Form D corpus — verify these codes appear in sufficient volume to support sector-level analysis]

---

*Code, analytical outputs, and intermediate datasets: https://github.com/nikbearbrown/80-Days-to-Stay*  
*DOL LCA disclosure data and SEC EDGAR: public domain. O*NET: CC BY 4.0.*
