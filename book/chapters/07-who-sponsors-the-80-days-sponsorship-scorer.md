# Chapter 7 — Who Sponsors: The 80 Days Sponsorship Scorer
*Why the record always outranks the reputation.*

Here is something that bothers me every time I see a job seeker's target list: the names on it are chosen for how they feel, not for what they've done. A household brand — a logo you've worn on a t-shirt — sits at the top. Fifteen companies you've never heard of sit nowhere, because you've never heard of them. And that ranking is exactly backwards, in a way that is measurable, sourced, and correctable.

A Cambridge biotech with no consumer presence files fifteen Labor Condition Applications over three years and maintains an 85% H-1B approval rate. The household brand files essentially zero LCAs for roles like yours. For a candidate who needs sponsorship, the unknown biotech is a vastly better target — not by opinion, not by vibe, but by the public record. The whole problem is that prestige is loud and the visa record is quiet. This chapter makes the quiet record louder.

![A grouped horizontal bar chart comparing a famous brand against an unknown biotech across LCA count, approval rate, funding recency, and composite score; the unknown biotech wins on the record even though the famous brand wins on name recognition.](../images/07-who-sponsors-the-80-days-sponsorship-scorer-fig-05.png)
*Figure 7.1 — Famous brand versus unknown biotech: the ranking flip*

<!-- → [CHART: horizontal bar chart showing a hypothetical pair of companies — "Famous Brand" vs. "Unknown Biotech" — with bars for LCA count, approval rate, funding recency, and composite score; the visual should make the ranking flip visceral and immediate] -->

What I want you to notice before we go further: this is not about dismissing well-known companies. Some famous companies are prolific sponsors. Some unknown biotechs file nothing. The point is that you do not know which is which from the name alone — you only know from the record. Everything in this chapter is about reading the record correctly.

---

The record lives in three datasets, all public, all free.

The first is **SEC Form D**, which you met in Chapter 6. It tells you when a company raised money and how much. Funding recency matters because a company that raised $12 million eight weeks ago is a different entity than one whose last round was three years ago and whose runway is unclear.

The second is the **DOL LCA disclosure data** — every Labor Condition Application an employer files with the Department of Labor as a precondition for hiring a foreign worker. An LCA is not the visa itself; it is the step before. It says: this employer is willing, organized, and legally set up to go through the process. A company with a filing history has built the machinery. A company with no filings either has not built it or has decided not to use it for roles like yours. Both conclusions matter.

The third is the **USCIS H-1B Employer Data Hub** — actual approvals and denials by employer and year. This is not intent; it is outcome. An employer can file LCAs and still fail at the H-1B stage. The approval rate tells you how the filings resolve.

![A convergent pipeline diagram: three public datasets — SEC Form D, DOL LCA data, and the USCIS H-1B Hub — feed a single sponsorship scorer node, with a fourth, lighter company-size input joining from below.](../images/07-who-sponsors-the-80-days-sponsorship-scorer-fig-01.png)
*Figure 7.2 — Three records into one score*

<!-- → [DIAGRAM: three-node pipeline showing SEC Form D → DOL LCA Data → USCIS H-1B Hub flowing into a "Sponsorship Scorer" node, with arrows labeled "funding recency," "filing behavior," and "approval rate"; include a fourth node for "company-size signals" feeding in from below] -->

These three datasets are joined by the **80 Days pipeline** on resolved company names. That last phrase — resolved company names — is doing more work than it appears to. "Google LLC," "Google Inc.," and "Alphabet" must be recognized as one entity or a real sponsor looks like a stranger in the data. The join is the hard part. An "Unknown" tier caused by a failed name match is not the same as a true absence of filings, and I will return to that distinction because it is one of the two most important things in this chapter.

---

The scorer reduces those three datasets into a single number:

> **P(sponsorship) = LCA filing rate (3-yr) × 0.40 + H-1B approval rate × 0.30 + funding recency × 0.20 + company-size signals × 0.10**

Read those weights as a claim, and ask whether you agree with it.

The LCA filing rate carries 40% of the weight because filing is the most direct revealed action available in public data. A company that files LCAs has made a decision — to build the legal infrastructure, engage immigration counsel, pay the fees, and go through the process. That decision is load-bearing in a way that a company's reputation is not. You can be famous without ever filing an LCA. You can be unknown and file thirty.

The H-1B approval rate carries 30% because filings that don't succeed tell a different story than filings that do. An employer with a 40% approval rate and an employer with an 85% approval rate are both sponsors in name. In practice, they are different bets.

| Component (weight) | Employer A — high filing, low approval | Employer B — moderate filing, high approval |
|---|---|---|
| LCA filing rate (×0.40) | High — files often, ~0.90 | Moderate — files steadily, ~0.55 |
| H-1B approval rate (×0.30) | Low — ~0.40 | High — ~0.85 |
| Funding recency (×0.20) | Recent, ~0.80 | Recent, ~0.80 |
| Company-size signals (×0.10) | Neutral, ~0.60 | Neutral, ~0.60 |
| **Composite** | **≈ 0.66 → Likely** | **≈ 0.69 → Likely / Proven edge** |
| What the profile implies | Willing and organized, but filings resolve poorly — possible role mismatch, weak counsel, or aggressive over-filing | Selective filer whose filings actually convert — a cleaner process, even at lower volume |

*Two employers can reach a similar composite for opposite reasons. The filing rate says "they try"; the approval rate says "it works." Read both before you read the tier.*

Funding recency carries 20% because the question is not just whether a company has sponsored in the past but whether it has the resources and growth trajectory to do so now. A company that raised eight weeks ago is in a different hiring skill than one that is managing a quiet contraction.

Company-size signals carry 10% — not because size is unimportant, but because its effect is already partially captured by the other three. A fourteen-person lab and a ten-thousand-person firm behave differently on average, but the record is the record. A small lab with a strong filing history is better evidence than a large firm with none.

The composite probability then maps to a tier. **Proven** means strong, recent filing history and high approval — the evidence is unambiguous. **Likely** means some evidence: a few filings, or strong funding plus partial history. **Unknown** means no evidence either way. **Avoid** means evidence the company does *not* sponsor in your kind of role — a clear zero-history non-sponsor that the engine should actively skip rather than merely lack data on.

I should flag something here. The system design document underlying the 80 Days pipeline describes three tiers — Proven, Likely, Unknown. The plain-language summary of the same system adds Avoid as a fourth. This chapter uses four tiers because "Avoid" does real work: it lets the engine actively deprioritize known non-sponsors rather than merely lacking data on them. The tier set and exact probability thresholds for each boundary need to be reconciled against the SDD before this goes to print. I am being transparent about that because the tier labels and thresholds are the output a reader will act on, and the distinction between a system that has three skills and one that has four is not cosmetic.

![A horizontal spectrum running from Avoid through Unknown and Likely to Proven, with ascending evidence bands on the axis and a small action cue beneath each tier; Unknown is rendered distinct from Avoid.](../images/07-who-sponsors-the-80-days-sponsorship-scorer-fig-03.png)
*Figure 7.3 — The four-tier sponsorship spectrum*

<!-- → [INFOGRAPHIC: a horizontal spectrum from "Avoid" through "Unknown" through "Likely" to "Proven," with approximate probability ranges on the axis and brief action cues below each tier — what the engine does and what you do] -->

---

Now let me show you what this looks like on a real case — or rather, a case that is real in structure, with illustrative numbers, so you can see how the reasoning works before you run it on your own list.

Return to the Cambridge biotech. LCA filings: 15 over three years. That is a strong filing rate for a company of this size — they are not dabbling in sponsorship, they have built the process. H-1B approval rate: 85%. Funding: $12 million raised eight weeks ago, which puts the recency score near maximum. Size: roughly 40 employees, which is mid-small.

Running the weights: the LCA rate (×0.40) dominates because it is high and the weight is highest. The approval rate (×0.30) confirms the filings are not just optimistic paperwork. The funding recency (×0.20) says they have the resources to keep going. Size (×0.10) is neutral-to-positive — a 40-person lab is not so large that bureaucracy slows everything down and not so small that one departure breaks the immigration infrastructure. The composite lands well into Proven.

Now run the same logic on the household name. LCA rate: approximately zero for roles like yours. That ×0.40 term contributes nothing. No relevant H-1B approvals in your role category. The funding and size numbers are strong — they have the money, they have the infrastructure — but those terms together carry only 30% of the weight, and they cannot rescue a zero on the 70% that measures actual sponsorship behavior. The company lands in Avoid.

![Two side-by-side stacked bars showing the weighted composite score for each company; the unknown biotech builds to a high total from all four weighted segments while the famous brand's filing-rate and approval-rate segments — together seventy percent — are empty, collapsing its bar into the Avoid range.](../images/07-who-sponsors-the-80-days-sponsorship-scorer-fig-02.png)
*Figure 7.4 — Weighted score: the ranking flip*

<!-- → [CHART: two stacked bar charts side-by-side showing the weighted score breakdown for each company — each bar segment labeled with its component and weight, making visible how the "Avoid" company's 70% goes to zero while the Proven company builds from all four components] -->

The decision is not close. The unknown biotech goes to the top of the active application list. The household name gets skipped. That is the backwards ranking, now defended by four sourced numbers.

But I want to be careful here. The record is a rear-view mirror. A company that sponsored heavily for three years may have frozen sponsorship last month. The immigration attorney who drove those 85% approvals may have left in March and taken the process knowledge with them. The LCA data is published on a lag. A company that raises a new round and starts hiring aggressively may look Unknown today and Proven in six months — and the record will not tell you that yet.

This is not a reason to distrust the tier. It is a reason to hold the tier correctly: as a well-evidenced prior, not a guarantee. You are Bayesian here. The tier tells you where the evidence points. The conversation you have with the recruiter is where you update.

---

The most common misread of this system is treating Unknown as Avoid. I want to spend a moment on this because it is not a subtle error — it is the error that throws away exactly the companies Chapter 6 worked to surface.

*Avoid* means the record shows this company does not sponsor your kind of role. The evidence is there; it is just negative. *Unknown* means the record is silent. Silent is different from negative. A company is Unknown for one of two reasons: either there is genuinely no filing history (they have never sponsored, or they are so young that the data does not exist yet), or the name did not match when the pipeline joined the datasets.

Those two causes of Unknown require opposite responses. A true absence of filings on a three-year-old company with strong funding is a prompt to look for direct sponsorship signals — a careers page that says "visa sponsorship available," a LinkedIn post about a recent hire on an H-1B, a direct question to the recruiter. A failed name match is a data problem you fix by resolving the entity and re-running. You cannot tell which you are dealing with by looking at the tier alone. You tell by reading the join-coverage audit.

| | True Unknown | Name-Match Artifact Unknown |
|---|---|---|
| How to identify it | Company matched in the join, but no filings found; often young or never-sponsoring | Company failed to match in the join; flagged in low join-coverage runs |
| What the record shows | Genuine silence — no LCA or H-1B history exists yet | The history may exist under a different legal name ("Inc." vs "LLC" vs parent) |
| What action it requires | Look for direct signals — careers page, recruiter question, recent H-1B hire posts | Resolve the entity (map the name variants) and re-run the join |
| Cost of treating it as Avoid | You discard a young, well-funded company that may sponsor — exactly the lead Chapter 6 surfaced | You discard a proven sponsor because of a spelling mismatch — a pure data error |

*Both look identical from the tier alone. The join-coverage number is what tells them apart: low coverage raises the odds that an Unknown is an artifact, not a verdict.*

The pipeline exposes this. From the project root:

```bash
cd scripts/sec
python validate-h1b-join-sample.py
```

checks the company-name join against USCIS H-1B data, and:

```bash
python scripts/audit-sec-dol-h1b-data.py
```

audits the full SEC + DOL + H-1B join coverage. The output is a number: how many companies on your shortlist matched, how many failed to match, and therefore how much of your list the tier actually covers. You read that coverage number before trusting any Unknown. If 30% of your shortlist failed to match, a significant fraction of your Unknowns are artifacts, not verdicts.

---

Let me say what I actually cannot see from this data, because intellectual honesty requires it.

The pipeline knows a company filed fifteen LCAs. It cannot know those fifteen were all for senior principal scientists and the company has a quiet policy against sponsoring entry-level hires. It knows an 85% approval rate; it cannot know that the attorney who drove those approvals left in March. It cannot know that an Avoid company just hired a new VP of Engineering who is changing the sponsorship policy this quarter. It cannot know that a Proven company just went through a round of layoffs and has frozen all new sponsorship for six months.

The tier is what the public record supports. What the public record cannot support is inference about a specific role, a specific month, a specific team. That is not a flaw in the scorer — it is the honest boundary of what any retrospective dataset can tell you. The boundary matters because crossing it silently is how you make bad decisions with confident numbers.

What the record can tell you, reliably, is: has this company demonstrated that it is willing and able to sponsor? That is the question the tier answers. Whether this company will sponsor you, in this role, right now — that is the question the tier informs but cannot answer.

![A decision tree that resolves why a company landed in the Unknown tier and what to do: from an Unknown entry node, a join-coverage decision splits a likely name-match artifact (resolve the entity and re-run) from a true absence (seek direct sponsorship signals), making visible that Unknown is never read as Avoid.](../images/07-who-sponsors-the-80-days-sponsorship-scorer-fig-04.png)
*Figure 7.5 — Why a company is "Unknown": three causes, three responses*

<!-- → [DIAGRAM: a decision tree beginning at "Tier assigned" — branching from Proven/Likely to "Target actively" and then to "Verify role type matches filing history," from Unknown to "Check coverage / resolve name match" and "Look for direct signals," and from Avoid to "Skip — reallocate application time (see Chapter 2)"] -->

The last thing I want to leave you with is the decision rule, because knowing the tier is only useful if you know what to do with it.

Proven and Likely justify the targeted two hours of application effort from Chapter 2. These are companies where the evidence supports the investment. Unknown — if fit and funding are strong — stays on the list, but gets a different kind of attention: resolve the name match, find the direct signal, and only then decide. Avoid gets skipped. This is precisely the class of target the engine exists to let you skip. The hours you save on non-sponsors are the hours that fund the depth you put into Proven targets.

The puzzle the record cannot solve is one level up: a company that will sponsor is worthless to you if the posting they listed is a ghost. So before you spend the targeted application time a Proven tier earns — is the role even real?

---

## Chapter 7 Exercises: Who Sponsors

**Project:** Your Own Reallocation Engine

**This chapter adds:** the sponsorship tier for each company on your funded shortlist — computed from the SEC + DOL + USCIS join — and, just as important, the join-coverage number that tells you which "Unknown" tiers to trust and which to fix.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Computing the composite score from inputs you supply.** — *Why AI works here:* the weighted sum (LCA×0.40 + approval×0.30 + recency×0.20 + size×0.10) is arithmetic you can re-check by hand in seconds.
- **Summarizing the join-coverage audit into "how much of my list is actually covered."** — *Why AI works here:* it reformats a number the audit produced; you verify against the file.
- **Drafting the recruiter question for a true-Unknown company.** — *Why AI works here:* outreach drafting against your situation; you judge it before sending.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the coverage audit and the formula itself.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Producing the LCA counts, approval rates, or funding inputs.** — *Why AI fails here:* these are the scorer's raw materials and must come from DOL/USCIS/SEC records; a model's "this firm files a lot" is a guess, and the whole tier inherits its falseness.
- **Deciding whether an Unknown is a name-match artifact or a true absence of filings.** — *Why AI fails here:* this is a causal-identification problem — the two look identical from the tier alone; only the coverage audit plus an entity trace resolves it.
- **Treating a Proven tier as a guarantee this company will sponsor you, now, for this role.** — *Why AI fails here:* the record is a rear-view mirror; whether the attorney left in March or sponsorship froze last month is intent the data cannot see.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 5 (Causal / identification)** with a **Tier 4** edge — the Unknown≠Avoid distinction is precisely an identification problem (silence vs. negative evidence vs. broken join), and resolving it is what separates a real verdict from a data artifact.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a triage of your Unknown-tier companies into "fix the name match and re-run" vs. "true absence — go find a direct signal," each with a next action — the move that keeps Chapter 6's hard-won leads from being thrown away.

**Tool:** Claude (claude.ai chat). You paste real scorer output plus your coverage number; chat fits the interrogation.

**The Prompt:**

```
Below is output from my sponsorship scorer: a list of companies with their tier
(Proven / Likely / Unknown / Avoid) and the inputs behind each (LCA count,
approval rate, funding recency, size). I also paste my join-coverage number:
what % of my shortlist matched in the SEC+DOL+USCIS join. Do NOT invent any
tier, count, or rate — work only with what I paste.

1. For every UNKNOWN company, classify the most likely cause as either
   (a) "name-match artifact — re-resolve and re-run" or (b) "true absence —
   look for direct signals," using my coverage number as evidence (low coverage
   raises the odds of (a)). State which and why for each.
2. For each (a), tell me what to check (entity name variants to try).
   For each (b), draft a one-line recruiter question to confirm current
   sponsorship for my role and visa type.
3. Flag any PROVEN tier I should NOT treat as a present-tense guarantee, and
   write the one-sentence caveat I should attach (rear-view-mirror risk).

Do not tell me a company "sponsors" as an unqualified present-tense fact.

--- PASTE SCORER OUTPUT + COVERAGE NUMBER BELOW ---
[paste tiers, inputs, and your join-coverage %]
```

**What this produces:** an Unknown-triage list with concrete next actions and caveated Proven tiers — the reading discipline the chapter's "most common misread" warning demands.

**How to adapt this prompt:**
- *For your own project:* paste your real scorer rows and coverage number. The coverage number is the load-bearing input — without it, the (a)/(b) split is a guess.
- *For ChatGPT / Gemini:* works as-is; both may default to calling Unknowns "non-sponsors" — keep the explicit (a)/(b) framing.
- *For a Claude Project:* store the four-tier definitions and the Unknown≠Avoid rule in the instructions.

**Connection to previous chapters:** this fills the `sponsorship_status` column of your `targets.csv` and applies Chapter 5's verb taxonomy (no unqualified "sponsors").

**Preview of next chapter:** Chapter 8 asks whether the postings at your Proven companies are even real — a Proven sponsor with a ghost posting is still a dead end.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** sponsorship tiers for your shortlist plus a measured join-coverage number — and a worked fix of one name-match failure, so you can see an Unknown flip to a real tier.

**Tool:** Claude Code. Running the join validators, reading coverage, editing an entity map, and re-running is a multi-step terminal workflow.

**Skill level:** Intermediate to Advanced — touches entity resolution.

**Setup:**

Before running this exercise, confirm:
- [ ] You have a funded shortlist from Chapter 6 to score.
- [ ] `scripts/sec/validate-h1b-join-sample.py` and `scripts/audit-sec-dol-h1b-data.py` exist in your repo.
- [ ] The SEC/DOL/USCIS data the scorer needs is downloaded.

**The Task:**

```
Score my shortlist for sponsorship and measure join coverage. Do not invent
counts, rates, or tiers; every number must come from a script.

1. Run:  python scripts/sec/validate-h1b-join-sample.py
   and:   python scripts/audit-sec-dol-h1b-data.py
   Report the join-coverage number: how many shortlist companies matched, how
   many failed.
2. List my Unknown-tier companies and mark which fall in the unmatched set
   (likely name-match artifacts) vs. matched-but-no-filings (likely true
   absence).
3. Pick ONE unmatched company I care about. Show me its name variants across the
   SEC, DOL, and USCIS data. Propose an entity-resolution fix (a name mapping) —
   show it to me, do not apply it silently.
4. With my approval, apply the mapping and re-run the audit. Report whether the
   company's tier changed and the new coverage number.
5. Append a RUN_LOG.md entry: coverage before/after, the company fixed, the tier
   change. Stop.
```

**Expected output:** a coverage number for your shortlist, an Unknown list split by cause, and one entity-resolution fix with a before/after tier and coverage change logged.

**What to inspect in the output:** does the coverage number make the Unknowns interpretable (e.g. "30% unmatched → a third of my Unknowns are artifacts")? After the fix, did the tier change for the right reason (a real filing history surfaced), or did the mapping over-merge two different firms? Verify the rescued filings actually belong to your company.

**If it goes wrong:** the likely failure is an entity mapping that merges distinct companies, inflating a tier. Recover by tightening the mapping to the exact legal entity and re-running; never accept a tier jump you can't trace to specific filings.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Never read an Unknown tier without first reading the join-coverage number; entity-resolution mappings require human approval and a before/after coverage log."* This encodes the chapter's core discipline.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI tier summary that commits the chapter's most common misread — treating Unknown as Avoid and discarding a strong lead.

**Validation type:** Reasoning chain.

**Risk level:** High — this error silently deletes exactly the companies Chapter 6 worked to surface.

**Setup (pre-generated artifact — option b):** This chapter names Unknown-as-Avoid as the most common and most damaging misread, so validate this pre-generated summary:

> **Sponsorship triage.** Acme Bio (Proven) and Cortex Labs (Likely) are your
> targets — apply to both. The rest are Unknown, which means they don't sponsor,
> so skip them. Note: NovaGen is Unknown despite raising a $20M Series B two
> months ago and being three years old — no filing history found, so treat as a
> non-sponsor and remove from the list. (Join coverage for this run: 64%.)

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Who Sponsors

□ Correctness: Does the summary treat "Unknown" as "Avoid"? Is that the
  distinction the chapter draws?
□ Completeness: With 64% coverage, what does that imply about the ~36% of the
  list that didn't match — could some Unknowns be name-match artifacts?
□ Scope: Did it discard a young, well-funded company (NovaGen) on the basis of
  silence rather than negative evidence?
□ Unknown-cause check (chapter-specific): For NovaGen, are the two possible
  causes (no history yet vs. failed join) distinguished, or collapsed into
  "non-sponsor"?
□ Action check (chapter-specific): True-Unknowns with strong funding should
  trigger a direct-signal search, not removal — does the summary do that?
□ Failure mode check: Does this output exhibit any of the following?
  - Unknown-as-Avoid (the named most-common misread)
  - Ignoring the coverage number when interpreting Unknowns
  - Fluent but wrong (a confident triage that deletes a real lead)
```

**What to do with your findings:**
- If the output passes all checks: use it. (It will not — it removes NovaGen on silence and ignores 36% unmatched.)
- If it fails one check: re-triage the Unknowns by cause using the coverage number, and restore any wrongly-removed lead.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — read the coverage audit and decide each Unknown yourself.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 5 causal identification** — refusing to read silence as negative evidence, and using the coverage number to tell a broken join from a true absence. It is the single discipline that keeps the scorer from throwing away your best leads.
