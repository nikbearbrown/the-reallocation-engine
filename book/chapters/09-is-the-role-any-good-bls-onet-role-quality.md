# Chapter 9 — Is the Role Any Good: BLS / O\*NET Role Quality

<!-- voice-anchored: root style/VOICE.md. Anatomy: TIKTOC Part 10.
     Sourced from scripts/bls/README.md, projects/soc_classification_draft.md, CHAPTER-RESEARCH-MAP.
     Draft. Never published. -->

Two postings cross your screen on the same afternoon. Both say "Analyst." Same flattering word, same vague glamour. But one of them sits in an occupation where national employment has risen for four consecutive years and the wage band is strong and still widening; the other sits in an occupation that is quietly contracting, where median wages have stalled and headcount has fallen. The titles are identical. The futures are not. And the person reading only the title has no way to tell the difference.

This is the situation job titles were made for. Not yours — theirs. A title is a marketing artifact, written by whoever drafted the posting, calibrated to attract applicants rather than to describe the work. "Analyst" sounds important, versatile, valuable. Whether the underlying occupation is growing or shrinking, well-compensated or wage-stagnant, in demand or being automated away — none of that is in the title. The title was written to get you to apply, not to help you decide whether you should.

The U.S. labor statistics system does something the title doesn't. It classifies the actual occupation underneath the title — assigns it a code, measures it, tracks it over years. Once you can see the occupation, you can see the trajectory the title was hiding.

---

Every occupation in the American labor market has been assigned a Standard Occupational Classification code — a SOC code. It is a government taxonomy, stable and consistent across agencies. A "Data Analyst" at a startup and a "Data Analyst" at a bank might be doing very different things, but if both postings map to the same SOC, the same national employment count and wage distribution describes the occupation they are both part of. The SOC code is the hinge. Get it right, and everything useful follows from it.

Two federal data systems organize what follows from it:

**O\*NET** — the Occupational Information Network — describes what the occupation is. For each SOC code, it provides alternate titles (the many ways the same job gets marketed), job zones (how much preparation the occupation typically requires), and rated skill and ability levels. If you want to know whether the occupation your posting maps to is the same occupation you trained for, O\*NET's alternate-title list will tell you.

**BLS OEWS** — the Bureau of Labor Statistics' Occupational Employment and Wage Statistics — measures the occupation's footprint. National employment counts per year, wage distributions at the tenth, twenty-fifth, fiftieth, seventy-fifth, and ninetieth percentiles. If you want to know whether the field is growing and what it pays, OEWS supplies the numbers.

Both are organized by SOC code. The pipeline in `scripts/bls/` joins them into a compact table — one row per occupation — and that compact row is what turns a marketing title into a labor-market fact. Build the table once:

```bash
cd scripts/bls
python extract-soc-occupation-table.py     # builds the compact SOC/OEWS/O*NET table into data/bls/compact/
```

The output is a single flat table. Pull your target occupation's row. You get alternate titles confirming the match, job zone, skill and ability ratings, national employment over multiple OEWS survey years, and the full wage distribution. That is role quality — not a feeling about the posting, but a set of features measured by the people whose job it is to measure them.

---

The hardest part of this is the first step: correctly mapping the posting's title to the right SOC code. And this is worth slowing down on, because the whole chapter's value depends on getting it right. A wrong SOC match is silent. It doesn't error out. It just quietly attaches the wrong wages, the wrong employment trend, and the wrong skill profile to the role you're evaluating. You'll make a decision based on a different job than the one you're actually considering.

A language model is genuinely useful here, within limits. It has encountered thousands of job titles and their occupational descriptions, and it is good at proposing a plausible SOC match from a messy posting. But proposing is not confirming. The verification step is mandatory: take the model's proposed SOC, look at the alternate-title list in the compact row, and check whether your posting's title or description actually appears there. If it does, the match is confirmed. If it doesn't, you re-classify before you trust any number downstream. The model proposes; the data confirms; you judge. This is the same verified-data contract from Chapter 3, now applied to classification rather than company counts.[^soc]

![A horizontal process flowchart tracing a raw posting title through a model that proposes a candidate occupation code, a verification gate that checks the proposed code's alternate-title list against the posting, a confirmed path to the joined occupation row, and a rejected path that loops back to re-propose; three role-quality features are read from the confirmed row.](../images/09-is-the-role-any-good-bls-onet-role-quality-fig-01.png)
*Figure 9.1 — Title-to-occupation resolution pipeline*

Consider what it looks like when this goes wrong. A posting titled "Growth Analyst" gets mapped by the model to a SOC for market research analysts — reasonable enough on its face. The compact row for that SOC shows stable employment and a wage band that looks acceptable. But the alternate-title list doesn't contain anything close to "growth analyst" — the posting is actually describing a role closer to a data scientist, and that occupation's SOC has a completely different wage distribution and a steeper skill profile. If you skip the alternate-title check, you've just evaluated the wrong job. The title was ambiguous; the alternate-title list is not.

---

![A two-panel comparison: the left panel shows an ambiguous title mapped to a plausible-but-wrong occupation whose alternate-title list does not contain the work, with a lower wage band; the right panel shows the same posting correctly re-classified to the occupation whose alternate-title list does contain the work, with a higher wage band on a shared zero-based scale. The gap between the bands is the cost of skipping the check.](../images/09-is-the-role-any-good-bls-onet-role-quality-fig-03.png)
*Figure 9.2 — The silent wrong-SOC error*

Once the SOC is confirmed, the compact row gives you three features that matter for the decision:

**Employment trend.** Has national headcount in this occupation been rising or falling across the OEWS survey years in the data? Flat is not the same as falling, and rising is not the same as booming, but the direction over multiple years is about as reliable a signal as you can get about whether the occupation is healthy. Declining employment, in an occupation you plan to spend years in, is a structural headwind worth knowing about before you accept an offer.

**Wage band.** The OEWS wage distribution tells you what people in this occupation actually earn, at each percentile. This is not what this company offers — it's what the occupation pays across thousands of employers. If the median is well above your threshold, the occupation rewards the work. If the median has been flat for several survey years while others have risen, something is compressing wages in this field — and that compression will be your problem eventually.

**Job zone.** O\*NET's job zones run from one to five, describing the typical preparation each occupation requires — from jobs that need little beyond a few days of training to occupations requiring extensive graduate preparation and years of experience. A job zone four or five occupation with a posting that claims to want recent graduates is either mismapped or unusual; knowing the zone helps you calibrate how competitive the real candidate pool is likely to be.

![A structural schematic of one compact occupation row decomposed into three parallel feature panels: an employment-trend line across survey years, a wage band marked at five percentiles, and a five-step job-zone preparation ladder, with the alternate-title list attached above as the confirmation feed.](../images/09-is-the-role-any-good-bls-onet-role-quality-fig-02.png)
*Figure 9.3 — The compact row: three role-quality features*

These three features, read together from one compact row, tell you more about a role's quality than any amount of reading the posting itself. The posting was written to make the role sound desirable. The compact row was built from surveys of everyone actually employed in the occupation.

---

The limit of this read is worth being explicit about. National OEWS estimates are national and lagging — typically one to two years behind the survey. They don't capture what this specific company pays, what the local market pays in your city, or what's happening in the last eighteen months of a fast-moving field. A company that just raised a Series A may be paying at the top of the wage band for talent; a company burning through runway may be offering equity and a below-median salary. The compact row tells you the occupation's gravity; it cannot tell you the specific role's orbit around it.

The SOC taxonomy also lags genuinely new work. If a role is at the frontier of a field that didn't exist five years ago — some combinations of machine learning engineering and product work, for instance — the best available SOC code may be an imperfect match for something genuinely novel. The numbers you read off it will be real, but they'll describe a proxy occupation rather than the thing itself. This is not a reason to skip the lookup. It is a reason to hold the numbers as directional rather than definitive when the alternate-title match is weak even after careful checking.

Role quality, read this way, is a strong directional signal. It is not a salary quote. The occupation that is rising, well-compensated, and skill-intensive at the right level for your background belongs on your list. The one with three years of declining employment and a stalled wage band, regardless of its title, deserves serious skepticism. You now have the tool to tell the difference. What you do not yet have is the clock — whether the hiring process at these companies can actually move fast enough to matter for your timeline.

## Chapter 9 Exercises: Is the Role Any Good

**Project:** Your Own Reallocation Engine

**This chapter adds:** role quality for each target — the confirmed SOC code, employment trend, and wage band read from the BLS/O\*NET compact table — so a live, sponsoring role gets judged on the occupation underneath the title, not the title's marketing.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Proposing a candidate SOC code from a messy job title.** — *Why AI works here:* the model has seen thousands of titles and descriptions and is genuinely good at proposing a plausible match — proposing, which you then confirm.
- **Summarizing a compact-table row (trend, wage percentiles, job zone) in plain language.** — *Why AI works here:* reformatting numbers the pipeline produced; checkable against the row.
- **Reformatting wage distributions across roles into a comparison table.** — *Why AI works here:* pure restructuring of data you supply.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the alternate-title list and the compact row.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Confirming the SOC match.** — *Why AI fails here:* a wrong SOC is silent — it attaches the wrong wages and trend without erroring. Confirmation means checking the posting against the alternate-title list; the model proposes, the data confirms, you judge.
- **Producing the employment trend or wage numbers.** — *Why AI fails here:* these must come from BLS OEWS via the compact table; a model's "this field pays well and is growing" is a guess that will quietly misprice the role.
- **Treating national, lagging OEWS numbers as this company's salary.** — *Why AI fails here:* the compact row is the occupation's gravity, not the specific role's orbit; conflating them is a judgment error about scope.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** — the model-proposes/data-confirms discipline applied to classification, catching the silent wrong-SOC error before it misprices a role you'd commit years to.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** confirmed SOC matches for your target roles, each verified against the alternate-title list, with the trend and wage band attached — the role-quality column of your engine.

**Tool:** Claude (claude.ai chat). You paste a posting plus the alternate-title list from your compact row; chat fits the propose-then-confirm loop.

**The Prompt:**

```
I am classifying job postings to the right Standard Occupational Classification
(SOC) code, then reading occupation-level wage and employment data. The model
PROPOSES a SOC; the alternate-title list CONFIRMS it; I judge. Do NOT produce any
wage or employment number — those come from my compact table, which I paste.

For each posting below I give: the posting title + a description snippet, and the
alternate-title list from the compact row for your PROPOSED SOC.

1. Propose the single best SOC code for the posting and say why in one line.
2. CONFIRM or REJECT: does the posting's title or described work actually appear
   in the alternate-title list I pasted? Quote the matching alternate title, or
   state plainly "not in the list — re-classify."
3. If rejected, propose the next-best SOC and tell me which alternate-title list
   I should paste next to confirm it.
4. Once confirmed, summarize the role-quality read from the compact-row numbers I
   give you (employment trend direction, wage band) and label them "national,
   lagging — not this company's salary."

--- PASTE POSTING + ALTERNATE-TITLE LIST + COMPACT-ROW NUMBERS BELOW ---
[paste here]
```

**What this produces:** confirmed (or rejected-and-rerouted) SOC matches with a labeled role-quality read — filling the `role_quality` column without inventing a single number.

**How to adapt this prompt:**
- *For your own project:* paste the real alternate-title list from your compact table. Without it the "confirm" step is impossible and the SOC is just a guess.
- *For ChatGPT / Gemini:* works as-is; both will confidently assert a SOC without confirming — the alternate-title-list check is the guardrail, keep it mandatory.
- *For a Claude Project:* store the propose/confirm/judge rule and the "national, lagging" caveat in the instructions.

**Connection to previous chapters:** this is Chapter 3's verified-data contract applied to classification — the model's SOC proposal is judgment until the alternate-title list (the record) confirms it.

**Preview of next chapter:** Chapter 10 adds the one factor that can zero out a good role regardless of its quality — your visa timeline.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** the compact BLS/O\*NET table and confirmed role-quality rows for your targets — with at least one title re-classified after the alternate-title check fails.

**Tool:** Claude Code. Building the compact table and pulling/verifying rows is a Python-plus-inspection workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] `scripts/bls/extract-soc-occupation-table.py` exists and its O\*NET/OEWS source data is available.
- [ ] You have target role titles (from your live postings in Chapter 8).
- [ ] You understand the alternate-title check is the verification step.

**The Task:**

```
Build the role-quality table and verify SOC matches for my target roles. Do not
invent wages, trends, or SOC matches; every number comes from the compact table.

1. Run:  python scripts/bls/extract-soc-occupation-table.py
   Confirm it wrote the compact table to data/bls/compact/ and report the row
   count from the run's output.
2. For each of my target titles, pull the compact row for the SOC I name and
   print: alternate-title list, job zone, employment trend across survey years,
   and the wage distribution.
3. VERIFICATION: for each, check whether my posting title appears in that SOC's
   alternate-title list. Print "confirmed" or "NOT in list — re-classify" for
   each. Do not silently accept an unconfirmed match.
4. For one title that fails the check, find the SOC whose alternate-title list
   DOES contain it, and show the corrected row.
5. Save reports/role-quality.csv: title, confirmed SOC, trend, wage band,
   confirmed(yes/no). Append a RUN_LOG.md entry. Stop.
```

**Expected output:** `reports/role-quality.csv` with confirmed SOC matches, trends, and wage bands, plus one worked re-classification — all traceable to the compact table.

**What to inspect in the output:** for each "confirmed," verify the quoted alternate title actually matches the work, not just the title string. For the re-classified one, does the corrected SOC's wage band differ materially from the wrong one? (That gap is the cost of skipping the check.) Confirm no wage number was rounded or smoothed by the model.

**If it goes wrong:** the likely failure is the agent accepting the first plausible SOC without the alternate-title check — the silent wrong-job error. Recover by forcing the check for every row and re-pulling any unconfirmed match; treat an unconfirmed SOC's numbers as untrusted.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"A SOC match is unconfirmed until the posting appears in that SOC's O\*NET alternate-title list; OEWS numbers are national and lagging, never quoted as a specific company's salary."* This encodes the chapter's core discipline.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI role-quality summary that confirmed a SOC without checking the alternate-title list — the silent wrong-job error.

**Validation type:** Reasoning chain (classification + structured data).

**Risk level:** High — the numbers are real but describe a different occupation, so the error is invisible and you'd plan a career around the wrong wage band.

**Setup (pre-generated artifact — option b):** This chapter's lesson is that a wrong SOC fails silently, so validate this pre-generated summary:

> **Role quality — "Growth Analyst" at Helix Bio.** Mapped to SOC 13-1161 (Market
> Research Analysts). The compact row shows stable national employment and a
> median wage of $68,230 — a solid, stable occupation. Verdict: acceptable role
> quality, proceed. *(Alternate-title list for 13-1161, on file: "Market Research
> Analyst," "Market Researcher," "Consumer Insights Analyst," "Survey
> Researcher." The posting describes building and deploying predictive models on
> product usage data.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Is the Role Any Good

□ Correctness: Was the SOC CONFIRMED against the alternate-title list, or just
  proposed and assumed?
□ Completeness: Does "Growth Analyst" or "building/deploying predictive models"
  appear anywhere in the alternate-title list on file?
□ Scope: Does the described work (predictive modeling on usage data) match
  "Market Research Analyst," or a data-scientist occupation with a different
  wage band?
□ Silent-error check (chapter-specific): If the SOC is wrong, are the real
  numbers ($68,230, stable) describing the actual role or a proxy occupation?
□ Caveat check (chapter-specific): Are the OEWS numbers labeled national and
  lagging, or presented as the role's pay?
□ Failure mode check: Does this output exhibit any of the following?
  - Unconfirmed SOC accepted as confirmed (the silent wrong-job error)
  - Real numbers attached to the wrong occupation
  - Fluent but wrong (a confident "proceed" on a mismatch)
```

**What to do with your findings:**
- If the output passes all checks: use it. (It will not — the work described isn't in the alternate-title list.)
- If it fails one check: re-classify to the SOC whose alternate-title list matches the work, and compare wage bands.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — confirm the SOC against the list yourself before trusting any number.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — catching the silent classification error where real data describes the wrong thing. A number that traces to a record can still be measuring a different job; the alternate-title check is what catches it.
