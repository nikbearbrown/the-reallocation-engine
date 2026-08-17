/outline silent

**Research question:** How have funded startup hiring patterns changed across key AI development milestones (2017–2026), and what do those patterns reveal about the cognitive tier composition of startup labor demand?

**Working hypothesis:** Post-2022 (post-ChatGPT), funded startups shifted their H-1B filings away from Tier 1 cognitive roles (pattern recognition, routine coding, data processing) toward Tier 4–7 roles (metacognitive oversight, causal reasoning, collective synthesis, existential judgment), as measured by SOC code distribution mapped to the Irreducibly Human cognitive tier taxonomy.

**Study type:** Descriptive longitudinal EDA. No causal claims. Correlational findings only. The AI milestone timeline is an interpretive scaffold, not a causal test.

**Data sources:**

1. SEC EDGAR Form D filings (2017–2026) — identifies funded private companies. Filter: total offering ≥ $5M, US-based, STEM-adjacent NAICS (biotech, software, engineering services, medical devices). Access: EDGAR full-text search API, public domain.

2. DOL LCA Disclosure Data, FY2017–FY2026 — every certified H-1B, H-1B1, E-3 application. Key fields: EMPLOYER_NAME, EMPLOYER_FEIN, JOB_TITLE, SOC_CODE, SOC_TITLE, WAGE_RATE_OF_PAY_FROM, PREVAILING_WAGE, PW_WAGE_LEVEL (I/II/III/IV), WORKSITE_STATE, CASE_SUBMITTED. Filter: CASE_STATUS = CERTIFIED only. Access: OFLC public disclosure files, public domain.

3. O*NET database — canonical SOC taxonomy with granular skill, ability, and knowledge ratings per occupation. Key dimensions: skills (e.g., programming, inductive reasoning, social perceptiveness, originality), abilities (e.g., information ordering, fluency of ideas, problem sensitivity), knowledge domains. Access: O*NET OnLine, CC BY 4.0.

4. Irreducibly Human cognitive tier taxonomy — maps SOC codes to seven tiers: T1 (Pattern/Association), T2 (Embodied/Sensorimotor), T3 (Social/Personal), T4 (Metacognitive/Supervisory), T5 (Causal/Counterfactual), T6 (Collective/Distributed), T7 (Existential/Wisdom). BLS major groups covered: SOC 11 (Management), SOC 13 (Business/Financial), SOC 15 (Computer/Mathematical), SOC 17 (Architecture/Engineering). Source: Irreducibly Human framework documentation.

**Entity resolution:**
- Primary join: EMPLOYER_FEIN (Form D lacks EIN — join requires intermediate step via IRS/D&B or manual enrichment)
- Fallback: fuzzy name match (RapidFuzz token-set ratio ≥ 0.88) on normalized legal name
- Output: matched vs. unmatched population, both characterized separately

**Timeline anchors (to be used as period markers in temporal analysis):**
- 2017: Attention Is All You Need (Transformer architecture)
- 2020: GPT-3 public release
- 2021: GitHub Copilot beta
- 2022 Nov: ChatGPT public release (primary break point)
- 2023 Mar: GPT-4
- 2023–2024: Claude, Gemini, agentic AI mainstream
- 2025–2026: Autonomous coding agents (Claude Code, Gemini CLI)

**Analysis periods:**
- Pre-LLM baseline: 2018–2021
- Transition: 2022
- Post-LLM: 2023–2026

**Primary EDA questions:**
1. What fraction of Form D companies (funded startups) appear in LCA data? How does this vary by funding amount, sector, and geography?
2. What is the SOC distribution of startup LCA filings? How does it compare to large-employer LCA filings?
3. What O*NET skills and abilities cluster in startup hiring? Which are rising, which are declining across the timeline?
4. What is the cognitive tier distribution (T1–T7) of startup LCA filings pre- vs. post-ChatGPT?
5. Do biotech startups and software startups hire for different cognitive tiers?
6. Does the wage level distribution (I/II/III/IV) shift across the timeline? Does startup hiring skew more senior post-2022?

**Key limitation to address prominently:** LCA data captures international hires (H-1B, H-1B1, E-3) only — not total startup hiring. Findings describe the international talent pipeline specifically. The implicit assumption that this proxies total startup hiring requires explicit caveat and partial validation.

**Target audience:** Labor economists, workforce researchers, AI policy analysts. Target journals: Journal of Labor Economics, ILR Review, PNAS Nexus (open access option), or Labour Economics.

**One thing a reader should remember:** Whether the post-ChatGPT startup hiring signal shows a measurable shift toward higher cognitive tier roles — confirming or complicating the Irreducibly Human thesis with empirical hiring data rather than theoretical argument.
