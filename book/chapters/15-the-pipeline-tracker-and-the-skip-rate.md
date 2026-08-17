# Chapter 15 — The Pipeline Tracker and the Skip Rate

<!-- voice-anchored: root style/VOICE.md. Anatomy: TIKTOC Part 10.
     Sourced from SDD Component 5, plain-summary (skip rate ≥50%, 3-3-2), recipes/tracker.md,
     "The 3-3-2 Split" essay, CHAPTER-RESEARCH-MAP. Privacy note: data/ats/ files are private (DATA_CONTRACT). Draft. Never published. -->

Imagine running the entire engine — scanning, scoring, framing, applying — and keeping no record of any of it. You'd have no response rate. No way to know whether Proven-tier applications outperform Unknown-tier ones. No signal that three weeks in, you've quietly drifted back to eight hours of clicking Submit. You'd be flying with no instruments, feeling busy, learning nothing. The decisions would still happen; you just couldn't see whether any of them worked, or correct course when they didn't.

The tracker is the instrument panel. But the most important number on it is not the one most people expect.

---

The counterintuitive heart of this chapter is this: **the target is a skip rate of at least fifty percent.** Of the roles the engine evaluates, you should be deciding not to apply to at least half.

Sit with why that's the goal and not a failure. If you apply to nearly everything the engine surfaces, your filter is too loose — you've recreated spray-and-pray with extra steps, and the targeted two hours from Chapter 2 has swollen back toward eight. A high skip rate means the filter is doing real work: separating the few roles worth a day off your ninety-day clock from the many that aren't. The skip rate is the dial that tells you whether the reallocation principle is actually operating or has quietly collapsed.

The reflex to resist is feeling good about a low skip rate because "I'm applying to a lot of things." That feeling is the volume instinct wearing a tracker. Low skip rate is not productivity. It is the filter failing. If your skip rate is twenty percent and you feel busy and productive, that pairing is the warning sign — busy and unfiltered is exactly the state the whole book exists to end.

So the tracker reads in two directions. Skip rate well under fifty percent means the filter is too permissive, or you're overriding it constantly; you're back to volume. Skip rate close to a hundred percent means either your upstream targeting is bad — no good roles reaching the scorer — or your thresholds are set impossibly high; either way, the funnel needs attention upstream. Skip rate above fifty percent with a steady flow of applies and a rising per-tier response rate: the engine is working as designed.

The skip is not an absence in the log. It is a decision, and a tracker that logs only applications is missing half the data about how well the filter works.

![A horizontal dial for the skip rate marked with the decision bands: below 40% is too loose (filter too permissive); 40–50% is borderline; above 50% with steady applies is healthy; above roughly 85% is starved (funnel too tight). A pointer sits in the healthy band, with the 50% target marked as the line the filter must clear.](../images/15-the-pipeline-tracker-and-the-skip-rate-fig-01.png)
*Figure 15.1 — Reading the skip-rate dial*

---

The component that makes this legible is the Pipeline Tracker, the engine's fifth component, maintained through the `tracker` recipe and analyzed with the patterns script:

```bash
# Maintain / update the decision log (tracker recipe writes data/ats/applications.md)
npm run ats:scan        # feeds new postings into the pipeline for decisions
# tracker recipe: log each decision (company, role, score, tier, timeline flag, outcome incl. skip)

# Analyze tracker/scan/pipeline data for patterns and the allocation summary
python scripts/ats/analyze-patterns.py
```

For every decision the engine produces — apply or skip — the tracker records the company and role, the composite score and tier, the timeline flag, the recommendation, and the outcome. The output of `analyze-patterns.py` is the daily allocation summary plus your skip rate and per-tier response rates. You read the skip rate first. It is the fastest signal that the method is or isn't operating.

A privacy note that belongs here before anything else: your tracker files — `data/ats/applications.md`, `pipeline.md`, scan history — contain your real targets and real activity. They are private, never committed or shared without a privacy review. This is a hard rule that becomes load-bearing in Chapter 16.

---

Consider a week of actual tracker data: thirty roles evaluated, seventeen skipped, thirteen applied, nine of the thirteen in Proven or Likely tier. Skip rate is seventeen over thirty — fifty-seven percent. Healthy: the filter is doing real work. Early response data shows Proven-tier applications drawing replies at several times the rate of the few Unknown-tier ones, which is evidence that the tiering is predictive rather than decorative. The allocation summary, though, shows apply hours creeping to three and a half per day while networking has dipped — a drift warning that the tracker caught before a full week was gone.

The right response to that picture: keep the thresholds, because the skip rate is healthy, but reclaim an hour from applying back to networking next week. That is the 3-3-2 decision rule operating on real data rather than on principle.

![A week of thirty evaluated roles broken into seventeen skips and thirteen applies on a single zero-based bar, with skips drawn as a full segment rather than an empty space. The 57% skip rate sits above the 50% target line, showing the filter doing real work — the skips are counted as data, not absence.](../images/15-the-pipeline-tracker-and-the-skip-rate-fig-02.png)
*Figure 15.2 — A week of decisions: skips are data*

The limit is equally worth stating. Early in the search, per-tier response samples are tiny and noisy — a three-application "trend" is not a trend. And the skip rate is a process metric, not an outcome metric. A healthy skip rate with zero responses still means something is wrong; it just means something upstream is wrong — bad targeting, weak materials — not that the filter itself has failed. The tracker measures discipline and targeting quality. It cannot conjure offers, and it cannot tell the difference between a targeting failure and a sector-wide hiring freeze. The numbers look identical. You read them in the context of a market the tracker can't see.

---

The decision rules for reading your own skip rate are compact enough to state directly:

Below forty percent is too loose. Trust the scorer's skips; stop overriding to apply. Between forty and fifty percent is borderline; watch whether your overrides are justified or habitual. Above fifty percent with steady applies and rising per-tier response rates is healthy — hold. Above roughly eighty-five percent, nearly everything skipped, means the funnel is starved or over-tight; fix upstream targeting in Chapters 6 and 5 or loosen the thresholds slightly.

The allocation summary closes the other loop. It shows how your hours actually split across apply, network, and portfolio — so the tracker doesn't just measure targeting quality, it catches allocation drift before a week has gone sideways. The skip rate tells you the filter is working. The allocation summary tells you that you are. You need both readings to know that the search is actually running the way Chapter 2 designed it.

![Two side-by-side readings. The left panel is the skip rate read against its target — is the filter working? The right panel is the allocation split across apply, network, and portfolio read against 3-3-2 — are you working as designed? The skip rate measures targeting quality; the allocation summary measures discipline, and both are needed.](../images/15-the-pipeline-tracker-and-the-skip-rate-fig-03.png)
*Figure 15.3 — Two readings: skip rate and allocation*

## Chapter 15 Exercises: The Pipeline Tracker and the Skip Rate

**Project:** Your Own Reallocation Engine

**This chapter adds:** the instrument panel — a logged decision (Apply *and* Skip) for every role, a skip rate read against the ≥50% target, and an allocation summary that catches drift back toward volume before a week is lost.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Computing your skip rate and per-tier response rates from logged data.** — *Why AI works here:* arithmetic over a table you supply; checkable by hand.
- **Generating the daily allocation summary (apply/network/portfolio split).** — *Why AI works here:* reformatting your logged hours into a read-out.
- **Reformatting the tracker into a readable weekly view.** — *Why AI works here:* pure restructuring of your data.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is your own decision log.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Deciding that a low skip rate is "fine because I'm applying a lot."** — *Why AI fails here:* that's the volume instinct wearing a tracker; recognizing it as a warning sign rather than productivity is a judgment about your own behavior.
- **Interpreting a healthy skip rate with zero responses.** — *Why AI fails here:* the tracker can't see the market — it can't tell a targeting failure from a sector-wide freeze; that read requires context the data doesn't hold.
- **Judging whether your overrides were justified or habitual.** — *Why AI fails here:* only you know what private reason drove each override, and whether it was real.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** with a **Tier 7** edge — reading the skip rate as a mirror of your own discipline, and resisting the comfortable misread that busy equals effective.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a weekly diagnosis of your search — skip rate, per-tier response (with honest sample-size caveats), allocation split, and the single adjustment to make next week.

**Tool:** Claude (claude.ai chat). You paste a week of tracker decisions; chat computes and reads.

**The Prompt:**

```
Below is a week of my job-search decision log: each row is a role with its
composite score, tier, timeline flag, Apply/Skip decision, and any response.
Do NOT invent rows or responses — use only what I paste.

1. Compute my SKIP RATE (skips / total evaluated). State whether it's too low
   (<40%, filter too permissive / over-applying), borderline (40–50%), healthy
   (>50% with steady applies), or starved (>~85%, funnel too tight).
2. Compute per-tier response rates — BUT flag any tier with a small sample (say
   <8) as "too noisy to trust yet." Do not call a 3-application difference a
   trend.
3. Give my allocation split (apply/network/portfolio hours) and flag any drift
   from 3-3-2.
4. Name the ONE adjustment for next week, citing the decision rule that motivates
   it. If the skip rate is healthy but responses are zero, say explicitly that
   this points UPSTREAM (targeting/materials) or to the market — not to the
   filter.

--- PASTE A WEEK OF TRACKER ROWS BELOW ---
[paste here]
```

**What this produces:** a one-week diagnosis with a skip-rate verdict, caveated response rates, an allocation read, and a single next move — the steering signal for the search.

**How to adapt this prompt:**
- *For your own project:* paste your real tracker rows. Keep the sample-size caveat — early-search numbers are tiny and the temptation to over-read them is strong.
- *For ChatGPT / Gemini:* works as-is; both will happily declare trends from three data points — keep the noise flag.
- *For a Claude Project:* store the decision-rule thresholds (40/50/85%) and the 3-3-2 target.

**Connection to previous chapters:** the skip rate is Chapter 2's reallocation principle made measurable; the tiers come from Chapter 7, the scores from Chapter 11.

**Preview of next chapter:** Chapter 16 builds and runs the whole engine end to end — and this skip rate is one of the readouts of the first honest run.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** your tracker populated with real decisions and an analysis run producing skip rate, per-tier response, and allocation summary — kept private, never committed.

**Tool:** Claude Code. Running the tracker recipe and `analyze-patterns.py` over your decision log is a data workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] The `tracker` recipe and `scripts/ats/analyze-patterns.py` exist.
- [ ] You have real decisions (Apply and Skip) to log.
- [ ] You understand `data/ats/` files are PRIVATE (DATA_CONTRACT) — never committed.

**The Task:**

```
Maintain my decision tracker and analyze it. PRIVACY: data/ats/ files
(applications.md, pipeline.md, scan history) are private — never stage, commit,
or print them outside this session. Do not invent decisions or responses.

1. Log my decisions via the tracker recipe: each role's company, role, score,
   tier, timeline flag, recommendation, and outcome — INCLUDING skips (a skip is
   a logged decision, not an absence).
2. Run:  python scripts/ats/analyze-patterns.py
   Report: skip rate, per-tier response rates (with sample sizes), and the daily
   allocation summary.
3. Apply the decision rules: classify the skip rate (too low / borderline /
   healthy / starved) and the allocation (on or off 3-3-2).
4. Write a RUN_LOG.md entry (safe to keep) with the skip rate, allocation, and one
   adjustment — but do NOT copy private target names into it.
5. Confirm no data/ats/ file was staged for commit. Stop.
```

**Expected output:** an updated private tracker, an analysis printout (skip rate, response rates with sample sizes, allocation), and a privacy-safe run-log entry.

**What to inspect in the output:** is the skip rate computed over Applies *and* Skips (skips must be logged)? Are small per-tier samples flagged rather than read as trends? Confirm nothing under `data/ats/` got staged for commit — the privacy rule is load-bearing for Chapter 16's public build.

**If it goes wrong:** two failures to watch — skips not being logged (which inflates the apparent skip rate's denominator wrongly) and private files leaking into a commit or the run log. Recover by re-logging skips as decisions and scrubbing any private name from shareable files.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Every decision is logged including skips; `data/ats/` is private and never committed; skip rate and response rates are read with sample-size caveats and against market context, never as outcome guarantees."* This pins the chapter's discipline and the privacy rule.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI analysis that read a low skip rate as success and over-read a tiny sample — the volume instinct wearing a tracker.

**Validation type:** Reasoning chain (over metrics).

**Risk level:** Medium — a wrong read here quietly returns you to spray-and-pray while feeling productive.

**Setup (pre-generated artifact — option b):** This chapter's lesson is that a low skip rate is the filter failing, not productivity, so validate this pre-generated analysis:

> **Weekly tracker analysis.** Great week — you applied to 24 of 30 roles
> evaluated (80% apply rate, 20% skip rate), so you're being highly productive and
> covering lots of ground. Keep the momentum. Also, Unknown-tier roles got 1
> response out of 2 (50%) while Proven got 2 out of 9 (22%), so Unknown-tier
> companies are actually your best bet — shift effort toward them.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — The Pipeline Tracker and the Skip Rate

□ Correctness: Is a 20% skip rate "highly productive," or is it the filter being
  too permissive (the chapter's warning)?
□ Completeness: Does the analysis treat the skip rate as a process metric to be
  read against the target (≥50%), or as a vanity volume number?
□ Scope: Did it conflate "applied to a lot" with "doing well"?
□ Skip-rate check (chapter-specific): What does a 20% skip rate signal about the
  reallocation principle — is it operating or collapsed?
□ Sample-size check (chapter-specific): Is "Unknown beats Proven" based on 2
  applications? Is that a trend or noise?
□ Failure mode check: Does this output exhibit any of the following?
  - Reading a low skip rate as productivity (volume instinct)
  - Over-reading a 2-sample "trend"
  - Fluent but wrong (a confident, encouraging misread of the dial)
```

**What to do with your findings:**
- If the output passes all checks: follow it. (It will not — it praises a failing filter and trusts a 2-sample trend.)
- If it fails one check: re-read the skip rate against the ≥50% target and tighten the filter; ignore the tiny-sample tier claim.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — you read the dial against your own discipline and the market.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** with **Tier 7** stakes — catching the comfortable misread that turns an instrument panel into a productivity-theater dashboard. A low skip rate isn't ground covered; it's the filter failing.

---

## Key terms

- **Pipeline Tracker:** the component that logs every decision — score, tier, timeline flag, outcome, including skips.
- **Skip rate:** the share of evaluated roles you decide not to apply to; target ≥ 50% as evidence the filter works.
- **Daily allocation summary:** the read-out of how your hours split across apply / network / portfolio (3-3-2).
- **Process vs. outcome metric:** skip rate measures discipline and targeting quality; it must be read alongside response rate and market context.

## Run-log prompt

Record the week's skip rate, the per-tier response rates with sample sizes, the allocation summary, and the one adjustment you're making next week.
