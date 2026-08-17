# Chapter 10 — The Visa Timeline Manager
*The clock is a gate, not a tiebreaker.*

Here is a thing that happens, and it is quietly devastating when it does. A student has three months of work authorization left. They find a role that fits almost perfectly — the company sponsors, the posting is live, the occupation matches, the quality signals are strong. They apply. They make it through the screens, the take-homes, the panels. Four months later, an offer arrives. And it is worthless. The start date is past the day their authorization ended. They spent the scarcest months of their search — the months they had the least of — chasing an offer that the calendar had already ruled out before the first email went out.

No filter in Chapters 7 through 7 would have caught this. Sponsorship was real. The role was live. The quality was high. The thing that killed it was time, and time is the one constraint that is *yours specifically* — invisible to the company, invisible to every scorer that does not know your dates.

![A horizontal hiring timeline — application, phone screen, technical rounds, panel, offer — crossed by a single bold vertical line marking the end of work authorization; the line falls between the technical rounds and the offer, so the offer sits on the unreachable side of the cliff.](../images/10-the-visa-timeline-manager-fig-01.png)
*Figure 10.1 — The calendar gate: a process that runs past authorization*

<!-- → [DIAGRAM: a horizontal timeline showing: "Student applies" → "Phone screen" → "Technical rounds" → "Panel interview" → "Offer" — with a vertical red line labeled "Authorization ends" falling between "Technical rounds" and "Offer"; the visual makes visceral that everything after the red line is unreachable regardless of how good the news is] -->

What I want to sit with before we go further is the structure of this error. The student did not miscalculate. They did not misread a sponsorship tier. They made a decision that was perfectly rational given incomplete information: they applied to a high-quality role without first asking whether the calendar permitted it. The Visa Timeline Manager exists to make that omission impossible — to force the calendar question to the front, before the excitement of a good-looking posting makes it easy to postpone.

---

Three windows govern an international student's runway, and the way they interact is not obvious until you map them.

The first is **OPT** — post-completion Optional Practical Training. After you finish your degree, you have a window of authorized work, and inside that window you may accrue no more than 90 cumulative calendar days of unemployment.[^opt] That ceiling is not a soft guideline. Exceeding it terminates your status, with no grace period. The 90 days do not reset. They accumulate from the first day your OPT begins. Every day you are not employed or not in a valid application process counts against that ceiling whether you notice it or not.

The second is the **STEM OPT extension**. If your degree is in a qualifying STEM field, you are eligible for a 24-month extension beyond the standard OPT period — and critically, the unemployment ceiling rises to 150 days aggregate. Eligibility changes the math entirely. A student without STEM eligibility and four months of authorization has a fundamentally different runway than a STEM-eligible student with four months remaining and the extension not yet filed. The calendar says they are in the same situation. The law says they are not.

The third is the **H-1B lottery window** — the annual cycle of registration, selection, and petition that determines whether a path past OPT exists with a given employer in a given year. The lottery runs on a fixed annual schedule. If your authorization expires before the next window resolves, the H-1B path is not available to you regardless of how willing the employer is to sponsor. Sponsorship and the ability to act on sponsorship are different things, and the lottery timing is what separates them.

![Three stacked horizontal bars on a shared time axis: the standard OPT window with its 90-day unemployment ceiling, the longer STEM OPT extension with its 150-day ceiling, and the fixed annual H-1B lottery window with registration and cap-subject start markers; the true runway is the combination of all three, not just the first bar.](../images/10-the-visa-timeline-manager-fig-02.png)
*Figure 10.2 — Three windows of an international student's runway*

<!-- → [INFOGRAPHIC: three stacked horizontal bars representing OPT window, STEM OPT extension, and H-1B lottery window — annotated with key thresholds: 90-day unemployment ceiling, 150-day ceiling, lottery registration month, cap-subject start date — showing how a student's runway is the combination of all three, not just the first bar] -->

What the Visa Timeline Manager does is compress these three windows into a single number: a **timeline factor between 0 and 1** that gets multiplied into a role's composite score.

The design logic of a multiplier rather than an addend matters here. If the timeline factor were just another component that averaged in with sponsorship, fit, liveness, and quality, a strong-enough role could mathematically overcome a bad timeline. A 0.95 fit and a 0.9 quality score could dilute a 0 timeline to something that still looks actionable. That would be wrong — not just suboptimal, but wrong in a way that produces exactly the outcome from the opening case. The multiplier forecloses this. A factor of 0 zeroed into a composite of any magnitude produces 0. The clock is a gate.

---

The factor is computed from eight intake questions the system asks at setup: your visa type, your authorization end date, how many unemployment days you have already used, whether you are STEM-eligible, your field, your target buffer, and the estimated process length for the role being scored. These are first-class constraints, not profile decoration. They are what makes a score *yours* rather than generic.

Conceptually, the computation looks like this:

```text
factor = timeline_factor(
    auth_type              = "OPT",
    auth_end_date          = "2026-08-30",
    unemployment_days_used = 22,
    expected_time_to_start = "16 weeks",
    stem_eligible          = True,
    buffer_target          = "80 days"
)
# returns a value in [0, 1]; 0 = skip regardless
```

The output is always the factor *and* the dates that produced it. A timeline factor you cannot trace to specific dates is a number you cannot defend, and this is the one factor where a silent error costs you the whole search. If the factor says 0 and you cannot see why, you have a data entry problem, not a calendar problem — and those require different responses.

| Input parameter | What it measures | Consequence of error |
|---|---|---|
| `auth_end_date` | The hard cliff — the last day work authorization is valid | Too optimistic (a later date than real) lets a fatal role score as actionable — costs the whole search. Too conservative drops salvageable roles. |
| `unemployment_days_used` | How much of the 90/150-day ceiling is already spent | Undercounting makes the remaining buffer look larger than it is, encouraging slow processes that breach the ceiling — costs status. |
| `expected_time_to_start` | The role's likely process length, today to start date | Too short makes a doomed role look reachable; too long drops a role you could have landed — costs one opportunity. |
| `stem_eligible` | Whether the 24-month extension and 150-day ceiling apply | Asserting eligibility you don't have inflates the entire runway — the most dangerous error; this input belongs to your DSO, not a guess. |

*Each input has asymmetric costs. Being too optimistic costs the whole search; being too conservative costs one opportunity. When in doubt, err conservative — and route eligibility to a qualified human.*

The factor resolves into three cases. A **factor of 0** means the role is skip-regardless: the expected time-to-start exceeds your remaining authorization, and no other signal changes that. A **factor near 1** means comfortable buffer — the expected hiring timeline finishes well inside your authorization with room to spare. A **factor between 0 and 1** is where most of the interesting cases live: buffer-based scaling, where as the expected start date creeps toward the cliff, the factor falls — gently penalizing roles that are probably fine but cut it close, so that all else equal the engine prefers the role you can safely land.

---

Let me walk through three roles for a single student to show how these cases feel in practice.

The student is a STEM-eligible master's graduate. OPT ends in roughly five months. Twenty-two unemployment days already used. Self-imposed target: an 80-day buffer below the 90-day ceiling, which functions as a margin of safety — not a legal threshold, just a planning discipline built into the engine.

**Role A** is a large firm. Its hiring process historically runs about five months: multiple rounds, committee review, compensation negotiation, offer processing. The expected start date lands past the authorization end. Factor = 0. Skip regardless — and the reason it deserves that label, not just "low priority," is that applying does not just waste time. It consumes unemployment days while you wait, which erodes the buffer you need for the roles you *can* land.

**Role B** is a startup that can move in about six weeks when motivated. Expected start lands with months of buffer. Factor ≈ 1. No timeline objection — the other factors decide.

**Role C** is a mid-size firm, roughly twelve-week process. Expected start lands inside authorization but eats most of the buffer. Factor ≈ 0.6 — kept, but penalized relative to B. If Role C and Role B were otherwise equal, the engine prefers B, because the candidate who lands B does not spend the last weeks of their authorization anxiously waiting for Role C's offer.

![A horizontal bar chart of three roles, each bar running from today to its expected start date, against a solid vertical line for the authorization end and a dotted line for the 80-day buffer target: Role A extends past the authorization line (skip-regardless), Role B finishes well short of the buffer (comfortable), and Role C finishes between the buffer and the cliff (kept but penalized).](../images/10-the-visa-timeline-manager-fig-03.png)
*Figure 10.3 — Three roles against the authorization cliff*

<!-- → [CHART: a horizontal bar chart showing the three roles with their expected start dates plotted against the student's authorization end date — Role A's bar extends past the end date (red), Role B finishes well short (green), Role C finishes just inside (yellow); a vertical dotted line marks the 80-day buffer target] -->

The decision rule that follows from this is simple to state and genuinely hard to execute: drop Role A *now*, before you invest more time in it. Free those weeks for Role B and for the networking that surfaces roles like Role B. Keep Role C with eyes open. The hard part is executing the drop on a role that looks excellent in every other dimension. The factor is designed to make that drop automatic — not a judgment call you have to make while excited about a good-looking posting, but a mathematical output you read before the excitement has a chance to override the calendar.

---

Now let me tell you what this factor cannot do, because the honest limits of any tool are part of using it correctly.

The factor knows your dates and a company's typical pace. It does not know that this particular hiring manager will fast-track you because their team is on fire, collapsing a five-month process to three weeks. It does not know that you would be willing to accept a role in a different country if the U.S. clock runs out, which would change what "skip" means for you entirely. And it absolutely cannot practice immigration law.

The difference between eligible and ineligible for a STEM extension can hinge on a detail — the CIP code on your transcript, a filing timing question, a program classification — that only an immigration professional should rule on. The factor gates out the impossible. The negotiable edges and the legal specifics stay human. This is not a caveat to be skim-read; it is load-bearing. A student who treats a factor of 0.4 as authorization to apply to a borderline role without consulting their DSO has misread what the number is. It is a planning multiplier, not legal advice.

![A decision tree from a single "factor computed" root: a factor of 0 branches to skip-regardless and reallocate the freed time; a low-but-positive factor branches to apply only if strong on the other factors and an accelerated process is genuinely possible; a high factor branches to no timeline objection, let the other factors decide; an advisor-check node flags that uncertain eligibility goes to a qualified advisor, not the system.](../images/10-the-visa-timeline-manager-fig-04.png)
*Figure 10.4 — Timeline-factor decision tree*

<!-- → [DIAGRAM: a decision tree beginning at "Factor computed" — branch from 0 to "Skip regardless / reallocate time (Ch. 2)," branch from low but > 0 to "Apply only if strong on other factors AND accelerated process is possible," branch from high to "No timeline objection — let sponsorship, fit, liveness, quality decide"; each terminal node also shows a human-judgment check: "Verify with DSO if STEM eligibility is uncertain"] -->

There is one more error worth naming before this chapter closes. It is the error almost everyone makes at least once: finding a role that looks excellent in every other dimension and mentally filing the timeline question under "figure out later." Later is exactly when it is too late. The excitement of a good role is precisely the moment when the timeline question feels most like an interruption. That feeling is the signal to compute the factor first — because a factor of 0 means the excitement is a trap, and you want to know that before the four months, not after.

Five numbers now describe every role you are considering: sponsorship, fit, liveness, quality, and timeline. One of them can zero out all the others. The question is how the engine fuses them into a single decision — and why, in that fusion, sponsorship gets the loudest vote.

---

## Chapter 10 Exercises: The Visa Timeline Manager

**Project:** Your Own Reallocation Engine

**This chapter adds:** the gate — a timeline factor between 0 and 1, computed from your real dates, that multiplies into each role's score and zeroes out the ones the calendar has already ruled out, before excitement about a good posting can override it.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Computing date arithmetic — weeks between today, an expected start, and your auth-end date.** — *Why AI works here:* arithmetic over dates you supply, verifiable on a calendar.
- **Summarizing which of your roles got which factor and why.** — *Why AI works here:* reformatting the factor outputs you generated; checkable against them.
- **Drafting the question you'll take to your DSO or immigration attorney.** — *Why AI works here:* it helps you phrase the question; it does not answer it.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criteria are a calendar and a qualified human (DSO/attorney) for anything legal.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Ruling on STEM eligibility, CIP codes, or any immigration-law specific.** — *Why AI fails here:* eligibility can hinge on a transcript detail only an immigration professional should rule on; a confident model answer here is the most dangerous kind of wrong. This is not legal advice and a model cannot make it so.
- **Overriding a factor of 0 on an informal "we can move fast" signal.** — *Why AI fails here:* whether to act on intent the historical estimate can't see is a stakes judgment with your whole search on the line — yours, not the model's.
- **Deciding whether a 0.3–0.6 factor justifies applying.** — *Why AI fails here:* this depends on your risk tolerance, your other options, and whether you'd accept a role abroad — values the model doesn't hold.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 7 (Wisdom — values and accountability)** with a **Tier 4** edge. The timeline gate is where the binding constraint is your own stakes and the law; no scorer can own a decision whose consequence — losing status — only you bear.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** timeline factors for your target roles, each shown with the dates that produced it, and a drop list — with every legal-eligibility question routed to a human, not answered by the model.

**Tool:** Claude (claude.ai chat). You supply your dates; chat computes and explains.

**The Prompt:**

```
Help me compute a visa "timeline factor" for each role I'm considering. The
factor is in [0,1] and acts as a GATE: 0 means skip regardless (expected start
is past my authorization end); near 1 means comfortable buffer; in between means
the start eats into my buffer and the role is penalized but kept.

My inputs (use ONLY these; do not assume any I don't give):
- Visa type and authorization end date: [FILL IN]
- Unemployment days already used: [FILL IN]
- STEM-eligible? [FILL IN] (note: do NOT rule on my eligibility — if it's
  uncertain, tell me to confirm with my DSO)
- Buffer target: [FILL IN, e.g. 80 days]
- Roles, each with an expected time-to-start: [FILL IN list]

Do four things:
1. For each role, compute the factor (0, near 1, or in between) and SHOW THE
   DATES: today + expected-time-to-start vs. my auth-end and buffer target.
2. Produce a drop list: which roles are factor 0 and should be dropped now to
   free time (cite Chapter 2's reallocation).
3. For any role in the 0<factor<1 band, state what single fact (an accelerated
   process) would change the decision and how I'd verify it.
4. Flag every point where an answer depends on immigration law or my STEM
   status, and tell me to confirm it with my DSO or an attorney. Do NOT give me
   legal advice or assert my eligibility.
```

**What this produces:** a factor-per-role table with visible date math, a drop list, and explicit hand-offs to your DSO for anything legal.

**How to adapt this prompt:**
- *For your own project:* fill every `[FILL IN]` with your exact dates — an approximate auth-end date defeats the entire exercise.
- *For ChatGPT / Gemini:* works as-is; both are prone to confidently asserting STEM eligibility — keep the "do NOT rule on eligibility" instruction prominent.
- *For a Claude Project:* store your dates and buffer target in the instructions so every role you score inherits the gate.

**Connection to previous chapters:** the factor multiplies the sponsorship/liveness/quality work from Chapters 7–9; a 0 here overrides all of it, and the freed time flows into Chapter 2's networking and portfolio blocks.

**Preview of next chapter:** Chapter 11 fuses all five numbers — sponsorship, fit, liveness, quality, timeline — into one auditable composite score.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** your eight intake answers encoded into the engine, the timeline factor run across your whole target list, and the factor-plus-dates recorded per role so a 0 is a logged, traceable gate.

**Tool:** Claude Code. Wiring your intake into config and running the factor over the list is a code-plus-data workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] The timeline-factor code/config exists in your repo (the eight intake fields).
- [ ] You have your exact dates: auth type, auth-end date, unemployment days used, STEM status, buffer target.
- [ ] You have a target list with an expected time-to-start per role.

**The Task:**

```
Set up and run the visa timeline factor across my target list. Do not assume any
date or eligibility — use only the values I provide, and never assert my STEM
eligibility (flag it for my DSO instead).

1. Show me the eight timeline intake fields and where they're configured. Help me
   set them to the values I give you. Echo them back for confirmation BEFORE
   running anything — a wrong date here is the one error that costs the search.
2. Run the timeline factor over every role in my target list.
3. For each role, output the factor AND the dates that produced it (today +
   expected-time-to-start vs. auth-end and buffer). A factor with no dates is not
   acceptable.
4. Save reports/timeline.csv: role, factor, expected start, auth-end, buffer
   status. Separately list every factor-0 (skip-regardless) role.
5. Append a RUN_LOG.md entry noting the intake values used (dates) and the count
   of skip-regardless roles. Stop.
```

**Expected output:** `reports/timeline.csv` with a traceable factor-and-dates per role, plus an explicit skip-regardless list.

**What to inspect in the output:** re-check the echoed dates against your actual I-20/EAD before trusting any factor — the chapter's named catastrophic error is a mis-entered auth-end date producing a 0.7 instead of a 0. Confirm every factor shows its dates. Confirm no role asserts STEM eligibility as settled.

**If it goes wrong:** the highest-stakes failure is an optimistic factor from a wrong date (or the agent guessing a missing date). Recover by re-confirming every date from your official documents and re-running; never let the agent fill a missing date with a plausible one.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Timeline factors must display the dates that produced them; the engine never asserts STEM eligibility or gives immigration-law rulings — those are flagged for the DSO/attorney."* This is the load-bearing safety rule of the whole engine.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI recommendation that both gave immigration-law advice and let a strong role override a fatal timeline — the two errors that lose the search.

**Validation type:** Reasoning chain (with a high-stakes legal component).

**Risk level:** High — acting on this can terminate immigration status; there is no recovery.

**Setup (pre-generated artifact — option b):** This chapter's lessons are "the clock is a gate, not a tiebreaker" and "the factor is not legal advice," so validate this pre-generated recommendation:

> **Recommendation — Role A (MegaCorp).** This is an excellent role: Proven
> sponsor, strong fit, live posting, great wage band. The hiring process runs
> about 5 months and your OPT ends in 4 months, but the role scores so well
> overall that it averages out to a strong recommendation — apply. Also, since
> your degree is in a tech field, you're definitely STEM-eligible, so you'll have
> plenty of runway with the 24-month extension. No need to check with anyone;
> you're clear to proceed.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — The Visa Timeline Manager

□ Correctness: Is the timeline treated as a GATE (zeroes the score) or as an
  addend that strong other factors can "average out"?
□ Completeness: Does it acknowledge that a 5-month process past a 4-month
  authorization makes the offer unreachable regardless of quality?
□ Scope: Did it give an immigration-law ruling ("you're definitely
  STEM-eligible") it has no standing to give?
□ Gate check (chapter-specific): With expected start past auth-end, what should
  the factor be, and what does that do to the composite?
□ Legal-boundary check (chapter-specific): Should eligibility be asserted by a
  model, or confirmed by a DSO/attorney?
□ Failure mode check: Does this output exhibit any of the following?
  - Treating the timeline as a tiebreaker instead of a gate (additive dilution)
  - Giving immigration-law advice / asserting STEM eligibility
  - Fluent but wrong (a confident "proceed" on an unreachable, legally-uncertain
    role)
```

**What to do with your findings:**
- If the output passes all checks: proceed. (It will not — it makes both of the chapter's named errors.)
- If it fails one check: recompute the factor as a gate and strip any legal assertion.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — gate the role yourself and take eligibility to your DSO.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 7 wisdom and accountability** — recognizing that some decisions carry consequences (loss of status) and some questions (eligibility, the law) belong to qualified humans. The model can compute a date; it cannot bear the outcome of getting it wrong.
