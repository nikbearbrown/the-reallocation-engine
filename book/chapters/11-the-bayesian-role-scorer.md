# Chapter 11 — The Bayesian Role Scorer
*The constraint unique to you dominates the factor everyone told you was supreme.*

Start with the sentence. "Google is a great company, so I should apply." It is the most natural sentence in a job search, and it is wrong in a specific, costly way. Great by what measure, and for whom? For a candidate who needs visa sponsorship, "great company" and "good target" are two different questions, and conflating them is how the eight-hour applicant from Chapter 2 spent a month applying to firms that would never sponsor the role. This chapter replaces that sentence with arithmetic. And the arithmetic, for a non-sponsor, says no — however great the company.

I want to be honest about what that arithmetic is going to cost you emotionally, because it will fight your instincts in a specific place. The chapter demotes *fit* — the thing you have been told your entire life is what matters in a job search — below a constraint most candidates never put in the equation at all. The demotion is not an error in the math. It is the math doing exactly what it should.

## What the scorer is and what it takes as input

The Bayesian Role Scorer is the decision core of the pipeline. Everything built in the preceding chapters converges here. Sponsorship probability and tier (Chapter 7), liveness (Chapter 8), role quality and occupation code (Chapter 9), your timeline and the start-date clock (Chapter 10) — each of those chapters produced a number. This chapter combines them.

The new ingredient is fit: the probability that you are actually a match for this specific role, estimated by comparing your CV against the job description. I want to name this clearly before we go further: fit is a model judgment. It is not a record. It is not a verified fact from a government database. It is a language model comparing two documents and returning a probability. That label — *model judgment* — matters, and it will appear attached to fit throughout this chapter, because a composite that hides where its components came from is exactly the fluent-but-ungrounded artifact Chapter 1 taught you to distrust.

With all four inputs in hand, the composite takes this form:

**Composite ≈ P(sponsorship) × 0.35 + P(fit | CV, JD) × 0.30 + [other weighted factors]**

— the whole expression multiplied by a liveness factor and by a timeline factor, with a decision threshold near 0.3 that maps the composite to one of three recommendations: **Apply**, **Consider**, or **Skip**.[^weights]

There are three design decisions baked into this expression that are worth understanding from first principles, because each one will produce a recommendation that surprises you until you see the reasoning underneath it.

## Why sponsorship is weighted highest

Sponsorship carries a weight of 0.35 — above fit at 0.30. The question is why.

Weights in a scoring system should reflect which constraint is most binding for the specific person the system is built for. For a domestic applicant, sponsorship isn't a question. Fit dominates, because fit is the thing that will determine whether you get the offer. But for an international student, sponsorship is the constraint that silently kills the most applications — not because the candidate was unqualified, but because the company never sponsored in the first place and the candidate never knew to check. The application went in, the résumé cleared the ATS, and then something in the process stopped moving. Sponsorship was the reason. It is never written on a rejection email.

So the weighting is not a claim that sponsorship matters more than competence in the world. It is a claim that, for you, it is the factor most likely to cause an invisible rejection — and invisible rejections are the ones most worth preventing at the top of the funnel, before time is spent.

## Why liveness and timeline are multipliers, not addends

Fit and sponsorship are *votes*. They contribute proportionally to the composite. A higher sponsorship probability raises the score; a lower one lowers it. The contribution is graduated.

Liveness and timeline are different in kind. They are *gates*. A ghost posting — liveness approaching zero — makes the composite approach zero regardless of how strong the sponsorship and fit scores are. A timeline you cannot meet — start date constraints that make the role impossible — does the same. No amount of fit or sponsorship can carry a role through a gate that is closed.

This is the math expressing a truth about the job search, not imposing a rule on top of it. A perfect role at a sponsoring company is worth nothing if the posting is fiction or you cannot start in time. The multiplicative structure is the honest description of that reality.

![Systems diagram of the composite: two weighted votes — a dominant sponsorship input and a lighter fit input — merge at a summing junction, then pass through two inline gates (liveness, then timeline) that can collapse the flow toward zero, before reaching a threshold node that branches into Apply, Consider, or Skip.](../images/11-the-bayesian-role-scorer-fig-01.png)
*Figure 11.1 — The composite: votes, gates, and threshold*

## The worked case — one posting, all four factors traced

Let me make the composite concrete. A live posting at the Cambridge biotech from Chapter 7 — Proven tier, data role, our STEM-eligible graduate.

P(sponsorship) ≈ 0.9. *Source: LCA and H-1B records from Chapter 7.* This is a record, not a judgment.

P(fit | CV, JD) ≈ 0.7. *Source: model judgment, CV compared to the job description.* This is a judgment, labeled as such.

Liveness ≈ 1. *Source: ATS signals from Chapter 8.* The posting passed all five checks.

Timeline factor ≈ 0.85. *Source: the reader's OPT expiration and estimated processing window from Chapter 10.*

High sponsorship — the dominant term — multiplied by reasonable fit, with a live posting and comfortable timeline. The composite lands well above threshold. The recommendation is **Apply**.

Now the contrast. The same graduate. The same fit of 0.7. The same liveness and timeline. Applied to the household-name non-sponsor: P(sponsorship) ≈ 0. The dominant term — sponsorship at 0.35 weight — contributes almost nothing. No amount of fit rescues it. The composite falls below threshold. The recommendation is **Skip**.

The candidate did not get worse. The company did not get less impressive. The binding constraint changed, and the weighting surfaced it. That is the scorer's job.

![Two parallel four-segment stacks for the same candidate. In the left stack (a sponsoring company) the sponsorship segment is large; in the right stack (a non-sponsor) it is nearly absent while fit, liveness, and timeline are identical. The composite bars below sit on a shared zero baseline: the left clears the threshold line and resolves to Apply, the right falls below and resolves to Skip.](../images/11-the-bayesian-role-scorer-fig-02.png)
*Figure 11.2 — Same candidate, same fit: sponsorship decides*

| Factor | Cambridge biotech (Proven) | Household-name non-sponsor |
|---|---|---|
| P(sponsorship) — weight 0.35 | 0.9 *(record)* | ~0.0 *(record)* |
| P(fit \| CV, JD) — weight 0.30 | 0.7 *(model judgment)* | 0.7 *(model judgment)* |
| Liveness (multiplier) | 1.0 *(ATS signals)* | 1.0 *(ATS signals)* |
| Timeline factor (multiplier) | 0.85 *(OPT clock)* | 0.85 *(OPT clock)* |
| **Composite** | **above threshold** | **below threshold** |
| **Recommendation** | **Apply** | **Skip** |

*Same candidate, same fit — the dominant term (sponsorship) determines the outcome.*

## The three-way recommendation and when to override

**Apply** means the composite is above threshold and sponsorship and timeline are both healthy. This is the role that earns the targeted two hours of focused application work from Chapter 2.

**Consider** means the composite is near threshold, or strong on most factors with one soft spot — a Likely sponsorship tier rather than Proven, for instance. Apply only if this role beats your other Considers and you have buffer in your timeline.

**Skip** means the composite is below threshold, or zeroed by liveness or timeline. The recommendation is not that the company is bad. It is that your time, on a finite clock, is better spent elsewhere.

And then there is **Override** — the recommendation the system will not give you, but that you can give yourself. If you hold private information the data cannot — the hiring manager is a contact who told you directly they're actively interviewing, or the company just quietly started sponsoring last month and the LCA record hasn't caught up — you can override the scorer. But the discipline is this: write down what you knew that the scorer didn't. An override with a documented reason is a legitimate correction. An override without one is just ignoring the math because you like the company.

![Two-axis decision map: sponsorship probability on the horizontal axis, fit score on the vertical. The high-sponsorship, high-fit corner is Apply; the two mixed corners are Consider; the low-sponsorship, low-fit corner is Skip. Two points at identical fit but different sponsorship land in the Apply and Skip regions respectively.](../images/11-the-bayesian-role-scorer-fig-03.png)
*Figure 11.3 — Apply / Consider / Skip decision regions*

<!-- → [INFOGRAPHIC: Four-quadrant grid. X-axis: sponsorship probability (low → high). Y-axis: fit score (low → high). Regions labeled: top-right = Apply, top-left and bottom-right = Consider, bottom-left = Skip. Overlay: two data points for the worked example (Cambridge biotech = Apply zone, non-sponsor = Skip zone despite identical Y position). Caption: "The Apply/Consider/Skip regions show why fit alone doesn't determine the recommendation — the sponsorship axis moves you horizontally, not vertically."] -->

## The cautionary mirror — when scoring goes wrong

A different company built a hiring-match score by training on real managers' past decisions. The system learned to replicate those decisions, including the biases embedded in them — treating "what we did before" as "what is correct." A lawsuit (*Kistler v. Eightfold*) now asks a court to require what good scoring should have demanded from the start: disclose the score, allow disputes, fix the audit.[^11-eightfold]

Notice what separates that system from this one. The Eightfold scorer learned from opaque history; its weights are unknown even to the company that built it. This scorer's weights are stated — sponsorship 0.35, fit 0.30 — and each factor traces back to a named source. You can look at a recommendation and see exactly why it said what it said.

A composite score is a powerful tool and a dangerous one. The safety is not the math. It is the auditability. If you ever cannot explain why a role scored what it did — tracing each term to its source — distrust the recommendation before you distrust your confusion.

![Two-column comparison. The left column (this scorer) shows stated weights as labeled contributors, each traced by a line back to a named source and terminating in a recommendation whose every term can be followed. The right column (an opaque scorer) shows weights sealed inside a box trained on a stack of past decisions, with no traceable lines from the recommendation back to any source.](../images/11-the-bayesian-role-scorer-fig-04.png)
*Figure 11.4 — Auditable vs. opaque scorer*

| Property | This scorer | Eightfold-style scorer |
|---|---|---|
| Weight source | Stated up front (0.35 / 0.30 …) | Learned from past manager decisions |
| Factor sourcing | Explicit — each term names its source | Opaque — internals unknown even to the builder |
| Auditability | Every term traceable to a record or labeled judgment | Recommendation cannot be traced |
| Failure mode | Bad input laundered into a confident output | Bias laundered into a confident output |

*The safety of a composite score is not the math — it's whether you can see why it said what it said.*

## What the machine could not know

The composite knows four numbers. It cannot know that the "0.7 fit" undersells you because your one unusual project is exactly what this team needs and no keyword in the job description captured it. It cannot know that a company scored Skip just began sponsoring last month. It cannot know that you would thrive at a lower-scored role and burn out at a higher one.

The scorer's gift is that it makes the usual case explicit and defensible. Its danger is that a single confident number invites you to stop thinking. The discipline from Chapter 1 returns here in full: don't ask whether the score is impressive. Ask what it could not know, and whether you hold any of that knowledge. The score reduces uncertainty. It does not eliminate it — and pretending otherwise is the specific error that makes composite scores harmful rather than useful.

## Where this leaves you

The score says Apply. You know why it says Apply, term by term, source by source. The posting is real, the company sponsors, the fit is reasonable, and the clock is not against you.

What the scorer cannot do is write the application. And for an international candidate, how you frame your work authorization is where strong candidates get rejected for reasons that have nothing to do with their ability. The chapter that follows is about that problem. You earned the application. Now you have to write it.

---

## Chapter 11 Exercises: The Bayesian Role Scorer

**Project:** Your Own Reallocation Engine

**This chapter adds:** the decision core — the four factors from Chapters 7–10 fused into one auditable composite that returns Apply / Consider / Skip per role, plus the Override discipline that lets your private knowledge correct the math without ignoring it.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Computing the composite from factors you supply.** — *Why AI works here:* the weighted-vote-times-multiplier arithmetic is checkable by hand in a minute.
- **Labeling each term by source type (record / model judgment / your input).** — *Why AI works here:* it's classification against definitions you hold; you verify each label against where the number actually came from.
- **Drafting the written Override note when you correct the score.** — *Why AI works here:* it helps you phrase what you knew that the data didn't; you supply the knowledge.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criteria are the formula and the source of every term.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Treating the fit score as a verified fact.** — *Why AI fails here:* fit is a model judgment (a CV-vs-JD comparison), not a record; laundering it into the composite as if it were sourced is the exact fluent-but-ungrounded move Chapter 1 warns against.
- **Deciding whether to override a recommendation.** — *Why AI fails here:* a legitimate override rests on private information the data cannot hold (a contact actively interviewing, a sponsorship policy the LCA record hasn't caught up to) — knowledge only you have.
- **Judging whether the weights fit your situation.** — *Why AI fails here:* the 0.35/0.30 weighting encodes a claim about your binding constraint; whether it's right for you is a values/stakes judgment, not a setting to accept on faith.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** with a **Tier 7** edge — auditability (tracing every term to its source) is metacognition made into a habit, and the override is where your stakes legitimately overrule the math.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** composite scores and Apply/Consider/Skip recommendations for your target roles, each term labeled by source, with the cases where fit is doing too much work flagged.

**Tool:** Claude (claude.ai chat). You paste your four real factors per role; chat fits.

**The Prompt:**

```
Help me compute a Bayesian composite score per role and recommend Apply /
Consider / Skip. The structure: sponsorship and fit are weighted VOTES
(sponsorship ~0.35, fit ~0.30, plus other weighted factors); liveness and
timeline are MULTIPLIERS (gates that drive the composite toward zero). Threshold
~0.3. Do NOT invent any factor value — use only what I paste.

For each role below I give: P(sponsorship) and its source, P(fit) and its source,
liveness, timeline factor.

1. Compute the composite and the recommendation, showing the arithmetic.
2. Label EVERY term by source type: record / model judgment / my input.
   Flag fit explicitly as a model judgment.
3. Flag any role where a HIGH fit is the main thing keeping a LOW-sponsorship role
   above threshold — i.e. where fit is "rescuing" a likely non-sponsor. Say so
   plainly; that's the chapter's central error.
4. For any role I mark for Override, draft the one-line note: what I know that the
   scorer doesn't. Do not invent the private fact — ask me for it.

--- PASTE ROLES + FOUR FACTORS EACH BELOW ---
[paste here]
```

**What this produces:** an auditable score sheet — recommendation, traced terms, and fit-rescue flags — that fills the `decision` column of your `targets.csv`.

**How to adapt this prompt:**
- *For your own project:* paste real factor values from Chapters 7–10. The "label by source" step only works if you tell it where each number came from.
- *For ChatGPT / Gemini:* works as-is; both may quietly treat fit as authoritative — keep the "flag fit as model judgment" instruction.
- *For a Claude Project:* store the weights, the gate/vote distinction, and the override rule in the instructions.

**Connection to previous chapters:** this consumes every prior number (sponsorship, liveness, role quality, timeline) and applies Chapter 5's verb discipline — the composite says exactly what its sources warrant.

**Preview of next chapter:** the score says Apply — Chapter 12 is about writing the application, specifically how to frame your work authorization without losing the role to a misunderstanding.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** composite scores for your whole target list via the scorer recipe, with every term traceable to its source and every override logged with a reason.

**Tool:** Claude Code. Running the scorer across the list, tracing terms, and logging is a code-plus-data workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] You have factor outputs from Chapters 7–10 for your targets.
- [ ] The scorer / `oferta` recipe exists in your repo.
- [ ] Your `CLAUDE.md` carries the verified-data contract.

**The Task:**

```
Run the Bayesian role scorer over my target list. Do not invent any factor;
every term must trace to a source (record, model judgment, or my input).

1. For each role, run the scorer and output: the composite, the recommendation
   (Apply/Consider/Skip), and EACH term labeled by source. Fit must be labeled
   "model judgment."
2. Verify the gate structure: confirm that for any role with timeline factor 0 or
   liveness ~0, the composite is ~0 regardless of sponsorship/fit. Show one such
   role as proof, or flag if a gate isn't behaving as a gate.
3. Save reports/scores.csv: role, composite, recommendation, each term + source.
4. For any role where I choose to Override, append a RUN_LOG.md entry with the
   override and the one-line reason (what I knew that the data didn't). Do not
   override on your own.
5. Show me scores.csv and the gate-check proof. Stop.
```

**Expected output:** `reports/scores.csv` with traced terms and recommendations, a proof that gates zero the composite, and any overrides logged with reasons.

**What to inspect in the output:** confirm the gate check actually zeroed a closed-gate role (the Chapter 16 build bug is a gate silently acting as a vote). Verify fit is labeled model judgment everywhere. Spot-check one Apply: does the arithmetic trace, term by term?

**If it goes wrong:** the highest-stakes failure is a timeline/liveness gate behaving as a weighted vote, letting an impossible role score "Consider." Recover by inspecting the composite formula directly and re-running the gate check; never trust a recommendation whose gate behavior you haven't verified.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"The scorer must label every term by source (fit = model judgment); liveness and timeline are multipliers, not votes; overrides require a logged reason naming the private fact."* This pins the chapter's auditability requirement into the repo.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** a composite recommendation that let high fit rescue a non-sponsor and hid where its numbers came from — the Eightfold-style opaque score the chapter warns against.

**Validation type:** Reasoning chain (over a composite).

**Risk level:** High — a confident "Apply" on a non-sponsor sends a day of effort into an invisible rejection.

**Setup (pre-generated artifact — option b):** This chapter names two errors — fit can't rescue a non-sponsor, and a score without provenance is just an opinion — so validate this pre-generated output:

> **Role recommendation — BrandCo (household name).** Composite: 0.61 → APPLY.
> This is a great company and you're a strong match — the fit is excellent (0.85),
> the role is live, and the timeline works. A well-known brand like this is always
> worth applying to. Recommendation: Apply with confidence.
> *(Not shown: P(sponsorship) for this role ≈ 0.05 — BrandCo has essentially no
> LCA history for roles like yours. The composite above weighted fit heavily and
> did not surface the sponsorship term or its source.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — The Bayesian Role Scorer

□ Correctness: Is each term traceable to a source, or is the composite an opinion
  in a formatted box?
□ Completeness: Is the sponsorship term shown at all? What is it, and what should
  a ~0.05 sponsorship do to a composite for an international candidate?
□ Scope: Did the recommendation lean on "great company / well-known brand" —
  reputation rather than the binding constraint?
□ Fit-rescue check (chapter-specific): Is a high fit (0.85) keeping a near-zero-
  sponsorship role above threshold? Can fit rescue a non-sponsor?
□ Auditability check (chapter-specific): Could you reconstruct why this scored
  0.61 from what's shown? If not, what should you trust first — the score or your
  confusion?
□ Failure mode check: Does this output exhibit any of the following?
  - Fit rescuing a non-sponsor (the chapter's central inversion)
  - Non-auditable composite (sources hidden)
  - Fluent but wrong (a confident Apply on an invisible-rejection role)
```

**What to do with your findings:**
- If the output passes all checks: apply. (It will not — fit is rescuing a ~0.05 sponsor.)
- If it fails one check: recompute with the sponsorship term surfaced and re-decide.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — distrust the recommendation before your confusion, and trace every term yourself.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — the auditability reflex that distinguishes a finding from a well-formatted guess. A composite you can't trace is exactly the fluent artifact the whole book teaches you to distrust.

[^weights]: Composite form and weights (sponsorship ×0.35, fit ×0.30, liveness and timeline as multipliers, decision threshold ≈0.3) from the system design document (Component 3, Bayesian Role Scorer). **[verify]** — confirm the exact composite expression and per-tier thresholds before publication.

[^11-eightfold]: Eightfold AI's match score learning manager bias, and *Kistler v. Eightfold* (FCRA: disclose the score, allow disputes, fix the audit), from "The Eightfold AI Match Score" (N. Bear Brown). **[verify]** the litigation specifics before publication.
