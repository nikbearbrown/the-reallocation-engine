# Chapter 5 — Verifying the Data

*A number that traces to a real record can still be measuring the wrong thing.*

Chapter 3 established a floor: every count, rate, and coverage number in this system must trace to a script output or an audit report, never to a model's best guess. That floor matters enormously. It is the difference between building on evidence and building on fluent fabrication.

But a floor is not a ceiling. Chapter 3 guarantees the number is real — that it came from counting rows in a public record, not from a language model estimating what the number probably was. This chapter asks a harder question: even if the number is real, is it trustworthy? Does it measure what you think it measures? Does the headline figure hold up when you look at the assumptions underneath it?

The distinction is not subtle. You can have a perfectly audited, perfectly script-sourced count that is quietly measuring the wrong thing. A join failure can make a prolific sponsor look like a non-filer. A base-rate mismatch can make a genuine signal look stronger than it is. A name-matching gap can exclude an entire corporate family from the dataset without leaving any evidence the missingness check can see. These are not data-pipeline bugs — they are epistemic failures. The numbers are real. The interpretation is wrong.

The methods in this chapter come from a companion book, *Computational Skepticism for AI*, where they are developed in full technical depth. I'm drawing on them here because they apply directly to the DOL and USCIS datasets this book runs on. If the reasoning feels compact in places, that's intentional — this is the practitioner application, not the derivation. What matters here is the procedure and what it surfaces.

![A three-tier vertical stack: a wide foundation tier for the Chapter 3 guarantee that numbers trace to real records, a middle working tier asking whether the right things are being measured, and a narrower top tier for trustworthy inference, with a left-side ascent arrow marking the gap between the bottom two tiers as where coverage gaps, name-matching failures, and base-rate mismatch live.](../images/05-verifying-the-data-fig-01.png)
*Figure 5.1 — The three-tier trust stack*

<!-- → [INFOGRAPHIC: Three-tier stack. Bottom tier labeled "Chapter 3 guarantee: numbers trace to real records." Middle tier (this chapter) labeled "Chapter 5 asks: are the right things being measured?" Top tier labeled "Trustworthy inference." An arrow on the left side labels the gap between tiers 1 and 2: "Coverage gaps, name-matching failures, base-rate mismatch." Caption: "The floor the contract provides. This chapter builds the next tier."] -->

## The opening question: why are there exactly N rows?

Before I run any analysis on the LCA disclosure data, I ask a question that sounds almost too simple: *why are there exactly N rows in this dataset?*

The question comes from the epistemic-frame interrogation developed in *Computational Skepticism for AI*. The point is this: a dataset is not a census. It is a recording made by a particular instrument under particular conditions. The row count is not a fact about the world — it is a fact about the recording. Something determined where the data collection started, where it stopped, what joined successfully, and what got dropped quietly along the way. Unless you know what that something was, you don't fully know what the dataset represents.

For the DOL LCA disclosure data, the answer is more specific than it first appears. The dataset contains every Labor Condition Application that employers filed before hiring a foreign worker on an H-1B, H-1B1, or E-3 visa. So the row count is bounded by: who filed, in what time window, for what visa category, under what employer name, and whether the filing was accepted into the disclosure system. Each of those conditions is a filter the dataset silently applies before you ever open it.

Here is the practical consequence for this book: an employer who sponsored consistently but always filed under slightly different name variations — "Google LLC" in one quarter, "Google Inc." in another, "Alphabet Inc." in a third — will produce rows scattered across three employer-name buckets. An aggregation that groups by employer name and counts filings will treat these as three different companies, each with a modest filing count, instead of one company with a substantial one. The dataset is not wrong. The join is not broken. The rows are real. But the count you compute from them is not the count you meant to compute.

This is the "why exactly N rows?" move applied to the join problem. The boundary of the dataset is not just the schema — it is the schema plus every reference the schema's contents imply. The LCA dataset references employer names. Employer names reference legal entities. Legal entities undergo mergers, renamings, and restructurings. The full count lives somewhere in that chain. The dataset gives you a sample of it, bounded by however the names happened to be entered in the filing system.

![Three small employer-name buckets — variants of one firm, each with a modest filing count — enclosed by a dotted boundary labeled the same legal filer, with a single arrow pointing right to one larger consolidated node representing the true aggregated count.](../images/05-verifying-the-data-fig-02.png)
*Figure 5.2 — Name-matching fragmentation*

<!-- → [DIAGRAM: One company (Alphabet / Google LLC / Google Inc.) shown as three separate employer-name buckets in the LCA filing data, each with a small filing count. A dotted box around all three labeled "Same legal filer." An arrow pointing to the aggregated true count. Caption: "Name-matching failures don't break the dataset. They fragment it. The rows are real; the employer grouping is not."] -->

## The six-step interrogation procedure

The six-step procedure in *Computational Skepticism for AI* is designed for any dataset you intend to base a deployment on. I'll walk through it applied to the sponsorship dataset — the LCA-to-H-1B join that the Sponsorship Scorer in Chapter 7 will run.

![A six-step linear flowchart — read metadata and lock a prediction, run exploratory analysis, test metadata against the data, ask what is not in the data, trace one row end to end, write the epistemic frame and compare to the prediction — with a dashed reference arc closing from the final compare step back to the locked prediction.](../images/05-verifying-the-data-fig-03.png)
*Figure 5.3 — The six-step interrogation procedure*

**Step 1 — Read the metadata and lock your prediction.** Before running any analysis, read the DOL disclosure file documentation. It tells you what fields are present, what time window is covered, and what constitutes a valid LCA. Write down what you expect the data to look like: how many rows, which employers should be there, what the approval rate distribution should look like. Lock this prediction before you look.

The prediction-lock matters for a specific reason. Without it, you only ever see the data as it is, which feels obvious, and you don't notice you've learned anything. With it, every gap between prediction and reality is a finding — the data is telling you something you didn't already know.

**Step 2 — Run the exploratory analysis.** Distributions, missingness, counts by employer, counts by year, counts by SIC code. The procedural pass. Note what shows up. Chapter 3's verification commands (`npm run ats:verify`, the sec and bls equivalents) produce the artifacts this step needs.

**Step 3 — Test the metadata against the actual data.** Does the time range match what the documentation says? Are the row counts consistent with the filing volumes the DOL reports in its summary statistics? Are there SIC codes present that shouldn't be, or absent that should be?

Here is where the "exactly N rows" question pays off. If the documentation implies a certain employer-universe coverage and the data shows a different pattern, that gap is a finding. Pursue it before moving on.

**Step 4 — Ask what is not in the data.** Look for dropped rows in the LCA-to-USCIS join. An employer who filed LCAs but whose H-1B counts appear zero or missing in the join may have a name-matching failure rather than a sponsorship failure. Look for time periods with sparse records — USCIS data has known gaps in certain fiscal quarters. Look for the companies that your prediction said should be there but aren't.

This step is not about finding errors in the data. It is about finding the shape of the data's coverage. What it can and cannot see.

**Step 5 — Trace at least one row end to end.** Pick one company from the dataset — say, the Cambridge biotech from Chapter 3's example. Follow its LCA filings through to the USCIS H-1B approval counts. Check whether the employer name in the LCA disclosure file matches the employer name in the USCIS data. Check whether the filing dates fall inside the H-1B fiscal year that would produce the approval counts you see.

I have done this trace. The experience is instructive every time. Almost every real dataset you trace this way turns up at least one surprise: a quarter where the filing count jumps because the company changed its legal name mid-year; a match that works on the first four words of the name but fails on the fifth; an approval count that appears lower than expected because one subsidiary filed separately.

**Step 6 — Write the epistemic frame and compare to your prediction.** What does the sponsorship dataset actually represent? It represents: LCA filings by employers operating under the names they used in a specific DOL submission window, joined to USCIS approval counts under the names USCIS recorded in its data, for the visa categories included in both disclosure regimes.

That is a more specific statement than "sponsorship data." The gap between the two is where the interpretation risk lives.

## Base rates and the confidence illusion

Even after the interrogation, there is a second failure mode that the procedure alone doesn't catch. It lives not in the data itself but in how a signal derived from the data gets interpreted. The mechanism is base rates, and the analysis comes from *Computational Skepticism for AI*'s treatment of calibration.

Here is the problem stated concretely. Suppose the Sponsorship Scorer produces a "0.65 probability of sponsorship" for a company in a given SIC code. That number came from a real signal — fifteen LCA filings, an 85% H-1B approval rate, sourced to DOL/USCIS records, exactly as Chapter 3 requires. But what does 0.65 actually warrant you to say?

It depends on the base rate. In most SIC codes, only a small fraction of employers have ever filed an LCA. In some technology-adjacent codes, this fraction might be 15–20%. In manufacturing, healthcare administration, or retail, it might be 2–3%. If only 3% of employers in a SIC code have ever filed an LCA, and the scorer's signal is calibrated, then even a strong positive signal produces a posterior probability that is lower than the raw 0.65 suggests. The math is Bayes' theorem, and it produces a result that consistently surprises people until they've worked through it enough times for it to become intuitive.

The false-positive problem is not hypothetical. A 99%-accurate test applied to a population where 1 in 10,000 people has the condition produces, for every 10,000 tests, approximately 1 true positive and approximately 100 false positives — so among all positive results, fewer than 1% are genuine. The numbers for sponsorship signals are not as extreme as this example, but the structure is identical: the base rate of the underlying phenomenon (this specific employer actually sponsoring H-1B workers for this type of role, right now, with openings available) is lower than the signal suggests.

Four diagnostic questions, drawn from *Computational Skepticism for AI*, settle whether a sponsorship signal is actually telling you what you think it is:

**What is the base rate?** What fraction of employers in this SIC code, size range, and geography have filed an LCA in the past three years? If the answer is 4%, a "likely sponsor" signal is working against a strong prior that says the company is not a sponsor. The signal has to overcome that prior, not just clear some absolute threshold.

**Is the signal calibrated?** A calibrated scorer means that when it says 0.65, the actual frequency of true positives among all cases scored at 0.65 is genuinely around 65%. Modern models are often well-calibrated in the middle of their probability range and badly overconfident at the extremes. Has anyone checked this scorer's calibration curve?

**What is the cost distribution of errors?** A false positive costs you an application fee, a cover letter, and time. A false negative costs you a lead you didn't pursue. These are not symmetric costs for an F-1 student racing a 90-day clock, but they are also not equally weighted across all circumstances. The right threshold depends on the cost ratio.

**What has changed since the data was collected?** The LCA data is historical. A company that was a prolific filer in 2021–2023 may have implemented a hiring freeze in 2024 or been acquired by a parent with a different sponsorship policy. The filing history is real; the inference to present sponsorship posture is an extrapolation across a time gap the data cannot bridge.

| Diagnostic question | What it surfaces | Where to find the answer | What to do if the answer is unfavorable |
|---|---|---|---|
| Base rate | Prior probability before seeing the signal | SIC-level LCA filing frequency in the audit | Lower the effective threshold; require stronger corroboration |
| Calibration | Whether the scorer's stated probability is reliable | Calibration curve if available; cross-validate on a holdout | Treat stated probabilities as ordinal ranks, not face-value probabilities |
| Cost distribution | Whether false positives or false negatives cost more | Depends on application deadline and role fit | Adjust the threshold accordingly |
| Freshness | Whether historical filings predict current posture | Filing date in the LCA data; recency filter in the audit | Downweight filings older than 18 months; flag acquisitions |

*Table 5.1 — The four base-rate diagnostic questions and how to act on each.*

## The verb taxonomy: what a score warrants you to say

There is a third failure mode, and it is the most insidious because it looks like good practice. You have done the interrogation. You have checked the base rate. The signal is real and reasonably calibrated. You hand the result to a language model to frame for the user. The model says: "This company sponsors H-1B visas for data science roles."

That sentence is not warranted by the evidence.

*Computational Skepticism for AI* has a verb taxonomy for exactly this problem. Different levels of evidence warrant different verbs: *hypothesize, suggest, observe, find, show, demonstrate, conclude, prove.* Each occupies a specific evidential posture. Using a verb stronger than the evidence warrants is an epistemic error — a category of error that happens at the output layer, after the data is already verified, and is therefore invisible to any data-quality check.

Here is what the evidence actually warrants, stated in calibrated language:

The DOL LCA disclosure data **shows** fifteen filings by this employer in the three-year window covered by the dataset. The USCIS approval data **shows** an 85% H-1B approval rate for this employer in the same period. The Sponsorship Scorer **observes** a signal consistent with active filing.

What the evidence does not warrant: *this company sponsors.* "Sponsors" is a present-tense claim about current employer policy, extrapolated from historical filings through a name-matching join that may have coverage gaps. The historical evidence supports a finding about what happened. It does not support an unhedged present-tense conclusion.

The practical rule: every claim the system emits should carry its warranted epistemic verb. "We observe fifteen filings" is a data claim. "We find a strong historical sponsorship signal" is a finding from the data. "This company sponsors" is a conclusion that requires more than the data can directly supply. Chapter 3 established the data-claim / model-judgment distinction. This chapter gives it a finer vocabulary.

## The honest ceiling

I want to be direct about what the verified-data contract cannot guarantee, because the temptation to overstate it is real — especially when the data checks out, the pipeline runs clean, and everything looks right.

The contract guarantees counts are real. It cannot guarantee the right thing was measured.

Coverage gaps are structural. The LCA dataset covers H-1B, H-1B1, and E-3 visas. A company that sponsors TN workers under the US-Mexico-Canada Agreement, or L-1 intracompany transfers, or O-1 extraordinary ability visas, will appear in none of these disclosures. From the dataset's perspective, they are not a sponsor. From the candidate's perspective, they are.

Name-matching failures are not edge cases. The LCA database and the USCIS approval database are maintained by different agencies under different administrative systems. A company that appears as "TechCorp LLC" in DOL filings and "TECHCORP" in USCIS data may join successfully or may not, depending on the exact normalization applied in the join script. The join script's coverage is documented in the audit; the audit reports how many rows matched and how many didn't. But it reports this at the aggregate level. The individual company that fell through the join looks identical to a genuine non-filer from the outside.

Freshness windows are a policy choice with real consequences. The default in this system uses a three-year lookback window. That is long enough to provide stable signal for established sponsors and short enough to exclude obviously stale data. But a company that sponsored aggressively in 2020–2022 and then implemented a blanket hiring freeze in 2023 will still score as a strong sponsor under this window. The filing history is real. The current hiring posture is unknown.

None of these are arguments for abandoning the data. They are arguments for being precise about what the data can and cannot say, and for making sure the output layer respects that precision. The honest ceiling is not a failure — it is the accurate description of what you have.

| What this chapter's method guarantees | What it cannot guarantee |
|---|---|
| The N rows in the dataset represent real filings | That all filings by this employer are in the dataset |
| The employer-name grouping reflects the filing record | That name-matching failures don't fragment prolific sponsors |
| The sponsorship signal is calibrated against base rates | That historical filing rates predict current hiring posture |
| Output verbs are warranted by the evidence | That the right visa category is covered for this candidate |
| Coverage gaps are labeled in the audit | That the gaps don't systematically exclude a type of employer |

*Table 5.2 — What this chapter adds to the floor Chapter 3 built.*

## Worked example: one company end to end

Let me make this concrete with the kind of trace Step 5 requires.

Take a mid-sized Cambridge biotech — the type of company Chapter 3 used to contrast verified and model-generated answers. It's a reasonable sponsorship candidate: talent-competitive field, specialized roles, graduate-intensive hiring.

I run the sponsorship dataset query. The result comes back: twelve LCA filings over three years, 80% H-1B approval rate, predominantly filed under job titles in "Life Sciences Researchers" SOC codes. The Sponsorship Scorer returns 0.68. So far, so good.

Now the trace. I pull the raw LCA rows for this employer. The name appears in two variants: "BioTechCo LLC" (ten rows) and "BioTechCo, LLC" (two rows — note the comma). The USCIS approval data has this employer under "BIOTECHCO LLC" (all caps, no comma). The join script normalized case but did not strip punctuation. The two rows filed under "BioTechCo, LLC" did not join to the USCIS data. They appear in the LCA count but not in the approval count. The approval rate calculation is therefore based on ten LCA filings, not twelve.

This does not change the conclusion dramatically — the employer is still a genuine historical sponsor. But it illustrates the mechanism. The gap is not a data error. Both records are correct. The join is the fragmentation point. And the dataset's missingness check reported zero missing values — because the rows are present, just in separate buckets that don't join.

Now the base rate check. In this SIC code (pharmaceutical and medicine manufacturing), the three-year LCA filing rate among employers in the DOL's universe is approximately 8%. The scorer returned 0.68. Working through the Bayes update: prior 0.08, likelihood ratio based on the observed filing count, posterior approximately 0.38–0.45 depending on assumptions. The 0.68 overstates the posterior probability by somewhere between 50% and 75%.

![A horizontal probability axis from zero to one with three markers — a low base-rate prior near 0.08 at the far left, the raw scorer output at 0.68 toward the right, and the corrected posterior landing between them in the high-thirties to mid-forties — with a correction arrow sweeping from the raw output leftward to the posterior and a faint anchor line from the prior showing the downward pull.](../images/05-verifying-the-data-fig-04.png)
*Figure 5.4 — Base rate pulls the posterior down*

What does this mean for an F-1 student considering this company? It means the verified-data finding is: "We observe twelve LCA filings in three years and an 80% historical approval rate." It does not mean "this company sponsors." It means this company has a demonstrated filing history that makes them a reasonable target for further investigation — specifically, a direct inquiry about current H-1B sponsorship posture for the specific role and visa type relevant to you.

That's a more conservative conclusion than the raw score implies. It is also an honest one.

## The bridge to Chapter 6

Chapter 6 builds the first complete tool: the funding detector, which queries SEC Form D filings to find companies that just raised capital and are therefore under pressure to hire.

The method from this chapter travels with it. For every number the funding detector produces — round size, recency, investor profile — the same four questions apply: what is the base rate of companies in this category that are actually hiring? Is the signal calibrated? What does a false positive cost? What has changed since the filing date?

The practical difference from a user perspective is significant. A company that just closed a Series B and has zero verified sponsorship history is a different kind of lead than a company with fifteen LCA filings that raised no capital in three years. Neither signal alone is sufficient. Both together, interrogated against base rates, interpreted with calibrated verbs, and labeled with their coverage gaps, are what a trustworthy inference looks like.

That is the architecture of every chapter from here forward. The verified-data contract provides the floor: numbers trace to records. The epistemic-frame interrogation provides the next tier: those records are measuring what you think they're measuring, within documented limits. The verb taxonomy provides the output discipline: the system says exactly what the evidence warrants, and no more.

---

## Chapter 5 Exercises: Verifying the Data

**Project:** Your Own Reallocation Engine

**This chapter adds:** the data-trust layer of your engine — you interrogate the sponsorship dataset your own target list will run on, pin its base rates to the audit, and force every output into calibrated verbs before any score reaches a decision.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Drafting the exploratory-analysis pass (Step 2).** — *Why AI works here:* producing distributions, missingness tables, and counts-by-employer is reformatting and boilerplate code generation against a fixed schema you can immediately run and eyeball; the output verifies itself the moment the script executes.
- **Writing a name-normalization function for employer variants.** — *Why AI works here:* the "BioTechCo LLC" / "BioTechCo, LLC" problem is a pattern-transformation task with a concrete pass/fail test — you have the raw rows to check the merge against, so a wrong function announces itself.
- **Generating candidate calibrated phrasings of a finding.** — *Why AI works here:* turning "twelve filings, 80% approval, prior 0.08" into several verb-taxonomy-correct sentences is option generation; you hold the taxonomy and pick the warranted one.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criteria are the script's own run, the raw rows, and the verb taxonomy.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Supplying the base rate.** — *Why AI fails here:* the SIC-level filing rate is a number that must trace to the audit (the Chapter 3 contract); if a model produces "around 8%," that is fabrication wearing a decimal point — a missing-ground-truth problem, not a recall problem.
- **Deciding whether a missing company is a non-filer or a join failure.** — *Why AI fails here:* from the aggregate the two are identical; resolving it is a causal-identification problem that requires tracing one row end to end (Step 5) against records the model never sees.
- **Ruling on whether a score warrants the verb "sponsors."** — *Why AI fails here:* this is the exact failure the chapter names — a calibration-and-values judgment about present-tense claims across a time gap; the fluent model reaches for the strong verb precisely where the evidence forbids it.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 5 (Causal / identification)**, with a Tier 4 metacognitive edge. Distinguishing a structural join failure from a genuine absence, and refusing to extrapolate historical filings into a present-tense "sponsors," are identification problems: the data underdetermines the causal claim, and only a human tracing the mechanism can close the gap.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** the written epistemic frame for your own target list's sponsorship dataset — the Step 6 output, stated in calibrated verbs — which becomes the trust note that travels with every score in later chapters.

**Tool:** Claude (claude.ai chat). A Claude Project is worth it if you'll iterate across your whole target list — put the verb taxonomy and your audit numbers in the project knowledge so every message inherits them.

**The Prompt:**

```
You are helping me write the epistemic frame for a sponsorship dataset I am
using to evaluate employers, following the six-step interrogation method:
(1) lock a prediction, (2) exploratory pass, (3) test metadata vs data,
(4) ask what is NOT in the data, (5) trace one row end to end, (6) write the
epistemic frame and compare to prediction.

Here are my verified audit numbers (already traced to script outputs — do not
change them, and do NOT invent any number I have not given you, especially the
base rate):

- Dataset: DOL LCA filings joined to USCIS H-1B approvals, 3-year window.
- Employer under review: a mid-size pharmaceutical/medicine-manufacturing firm.
- LCA filings: 12 over three years. H-1B approval rate: 80%.
- Sponsorship Scorer output: 0.68.
- SIC-level base rate (from my audit): 8% of employers in this SIC filed an LCA
  in the window.
- Known coverage gaps: dataset covers H-1B / H-1B1 / E-3 only (no TN, L-1, O-1);
  join normalizes case but not punctuation.

Do three things:

1. Write the epistemic-frame paragraph (Step 6): state precisely what this
   dataset represents, in one specific sentence — not "sponsorship data."

2. Apply the four base-rate diagnostic questions (base rate, calibration, cost
   distribution, freshness) and give the rough posterior direction relative to
   0.68. Show the reasoning; do not output a false-precision number.

3. Write the finding in TWO sentences using the verb taxonomy
   (hypothesize < suggest < observe < find < show < demonstrate < conclude <
   prove). Sentence 1 is a data claim using "observe" or "find." Sentence 2 is
   an explicit calibration note using "does not warrant" or "is consistent
   with." Do NOT use "sponsors" as an unqualified present-tense claim anywhere.

If any step requires a number I did not provide, say so explicitly instead of
estimating it.
```

**What this produces:** a short trust note — one epistemic-frame paragraph, a base-rate reasoning block, and a two-sentence calibrated finding — that you paste into your engine's notes for this employer.

**How to adapt this prompt:**
- *For your own project:* replace the employer details, the 12 / 80% / 0.68 figures, and the 8% base rate with your own audited numbers. Keep the "do not invent the base rate" instruction verbatim — it is the load-bearing line.
- *For ChatGPT / Gemini:* works as-is; on Gemini, add "think step by step before writing the finding" to stop it jumping to a confident verb.
- *For a Claude Project:* put the verb taxonomy and the four diagnostic questions in the system prompt; send only the audit numbers in the message.

**Connection to previous chapters:** this consumes the verified counts Chapter 3 forced you to source and the data-claim/model-judgment line it drew; here you give that line a finer vocabulary.

**Preview of next chapter:** in Chapter 6 the same four questions get pointed at SEC Form D funding signals — the LLM exercise there asks the model to flag what a fresh raise cannot tell you about hiring.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** a punctuation-aware employer-name normalizer added to your fork's join step, plus a before/after join-coverage report showing how many rows the fix rescues.

**Tool:** Claude Code. The task spans reading the existing join script, editing it, re-running, and diffing two coverage numbers — a multi-step file workflow that suits an agentic CLI over chat.

**Skill level:** Intermediate — requires comfort running the repo's verification commands in a terminal.

**Setup:**

Before running this exercise, confirm:
- [ ] You have forked/cloned the engine repo and the join script under `scripts/` runs locally.
- [ ] At least one quarter of DOL LCA data and the USCIS approval data are downloaded (the Chapter 3 verify commands succeed).
- [ ] Your `CLAUDE.md` already carries the Chapter 3 rule: numbers come from script output, never from the model.

**The Task:**

```
Read the employer-name join logic in this repo (the script that matches DOL LCA
employer names to USCIS approval records). Do NOT modify any raw data files and
do NOT change the downloaded datasets.

1. Show me the current normalization: report exactly what transformations it
   applies (e.g. lowercasing) before matching.
2. Run the join as-is and record the current match count and unmatched count.
   Save this baseline to reports/join-coverage-before.txt.
3. Add a normalization step that strips punctuation and collapses whitespace
   (so "BioTechCo, LLC" and "BioTechCo LLC" normalize identically), as a new,
   clearly named function. Keep the original behavior available behind a flag.
4. Re-run the join. Save the new match/unmatched counts to
   reports/join-coverage-after.txt.
5. Print a diff of before vs after: how many previously-unmatched rows now join,
   and list 5 example employer names that were rescued.

Stop after step 5 and show me the diff. Do not "improve" the matching further
(no fuzzy/Levenshtein matching) — that is a separate decision I will make.
```

**Expected output:** an edited join script with a punctuation-stripping function behind a flag, two coverage report files, and a printed list of rescued employer names.

**What to inspect in the output:** check the rescued names by hand — are they genuinely the same legal filer, or did stripping punctuation merge two *different* companies (e.g. "Smith, Co" and "Smith Co" that are unrelated)? This is the chapter's point: the fix trades one coverage gap for a new false-merge risk.

**If it goes wrong:** the most common failure is the match count jumping implausibly — that means the normalization is now over-merging (e.g. it stripped so much that distinct firms collapse). Recover by tightening the function to strip only punctuation and case, not significant tokens like "LLC" vs "Inc", and re-run step 4–5; do not accept a coverage gain you can't explain row-by-row.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Employer-name matching changes must report before/after coverage counts and a sample of rescued rows; never enable fuzzy matching without explicit human sign-off."* This keeps every future join edit honest.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** a pre-generated sponsorship summary an LLM produced from correct, verified numbers — the kind of output your engine will emit if you don't police the output layer.

**Validation type:** Reasoning chain (with a factual-claim component).

**Risk level:** High — every number in it is real, which is exactly what makes the overstatement convincing and hard to catch.

**Setup (pre-generated artifact — option b):** This chapter's lesson is the verb-overstatement failure mode, which a well-instructed prompt (Exercise 3) is designed *not* to produce. So validate this artifact instead — it traces to real figures but fails at the output layer:

> **Sponsorship summary — BioTechCo LLC.** Based on Department of Labor and USCIS
> records, BioTechCo LLC **sponsors H-1B visas** for life-sciences roles, with a
> strong 0.68 sponsorship probability. The company filed 12 LCAs over the past
> three years with an 80% approval rate, making it a **confirmed sponsor** and a
> high-priority target for your application. You can rely on this company to
> sponsor your visa.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Verifying the Data

□ Correctness: Does the output accurately reflect the chapter's core concept?
  Are the verbs warranted by the evidence, or does it use "sponsors" /
  "confirmed sponsor" as unqualified present-tense claims?
□ Completeness: Is anything important missing?
  Where is the base rate? Does it tell you that an 8% SIC prior pulls the
  posterior well below 0.68?
□ Scope: Did the AI stay within the task boundaries?
  Did it add an unrequested recommendation ("high-priority target," "you can
  rely on this company")?
□ Base-rate handling (chapter-specific): Does it treat 0.68 as a face-value
  probability, or as a signal that must be updated against the prior?
□ Coverage-gap labeling (chapter-specific): Does it disclose the H-1B/H-1B1/E-3-
  only coverage and the punctuation join gap that dropped 2 of the 12 filings?
□ Failure mode check: Does this output exhibit any of the following?
  - Fluent but wrong (plausible-sounding incorrect claims)
  - Verb overstatement (a stronger epistemic verb than the evidence warrants)
  - Missing ground truth (a present-posture claim the historical data can't
    support across the time gap)
```

**What to do with your findings:**
- If the output passes all checks: proceed to use it. (It will not — that is the point.)
- If the output fails one check: revise the prompt and re-run Exercise 3, then re-validate.
- If the output fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment. Write the finding yourself using the verb taxonomy.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains the learner to catch **verb overstatement at the output layer** — fluent, fully-sourced text that claims more than its evidence warrants. It is **Tier 4 metacognitive supervision**: the capacity to know that a true number and a true verb are different trust questions, and that the machine, left alone, will reach for the verb the data has not earned.
