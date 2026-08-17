# Chapter 3 — The Verified-Data Contract
*The one rule that separates a filter you can trust from a guess wearing the costume of one.*

There is a particular kind of wrong answer that is worse than no answer at all, and it is this: an answer that sounds right. Not obviously wrong. Not hedged or uncertain. Fluent, confident, plausible — and untrue.

I want to be precise about what I mean, because the distinction matters more here than almost anywhere else I can think of. A language model asked whether a particular Cambridge biotech sponsors work visas will not say "I don't know." It will say something like: "as a mid-size biotech competing for specialized talent, this company likely sponsors visas for research-focused roles." Every word of that sentence is defensible. The reasoning is plausible. The conclusion is probably true for a lot of companies in that description. And it is not a finding. It is the most coherent-sounding sentence the model could assemble from patterns in its training data — which is a completely different operation from looking at a record.

The Department of Labor publishes every Labor Condition Application a U.S. employer files before hiring a foreign worker. The USCIS publishes H-1B approval and denial counts by employer. If you run a script against those records and ask the same question, you get a different kind of answer: this company filed fifteen LCAs in three years and had an 85% H-1B approval rate. Or you get zero filings, ever. The number is not the most plausible thing you could say — it is what actually happened, as far as the public record goes.

The whole architecture of this book is built on that distinction. One answer is fluent. The other is *true*. The discipline required to build on the second, and only the second, is what I mean by the verified-data contract.

![Two columns: on the left, a model's fluent prose answer floating with no source anchor; on the right, a verified answer — filing count, approval rate, year — tied by solid connectors down to two labeled record sources, the Department of Labor and USCIS.](../images/03-the-verified-data-contract-fig-01.png)
*Figure 3.1 — Same question, two kinds of answer*

<!-- → [INFOGRAPHIC: Two-column side-by-side: left column labeled "Model's answer" shows the fluent prose sentence with no source; right column labeled "Verified answer" shows the LCA count, approval rate, and year, traced to DOL and USCIS records. Caption: "Same question. One answer is plausible. One is checkable."] -->

## Why the contract is a single rule, not a set of guidelines

I've seen job-search systems — and empirical systems of all kinds — that try to manage the fluency problem with caveats: add a disclaimer, note that the model might be wrong, invite the user to verify. This doesn't work, and it doesn't work for a specific reason. A caveat lives outside the output. It is a warning label on a product, not a change to what the product contains. If the number inside the output was produced by a language model filling in a plausible-sounding value, the caveat is decoration on a fabrication.

The contract is different because it is a *prior constraint on what gets to enter the system at all*, not an advisory attached to what came out. The rule is stated once, in the shared configuration that every recipe in this system reads before doing anything else: **Run the script and read the audit before you prompt. Never invent a count, a rate, or a coverage number.**

That is it. One rule. The simplicity is intentional. Complex rules are negotiated; a one-rule contract is harder to quietly break. The model's role in this system is to help you *read* data — to frame a finding, identify what's interesting about a number, suggest what to look at next. It is not permitted to be the source of a number. Sources of truth in this system are specific things: script outputs, audit reports, logged runs. Not the model's best guess at what the number probably is.

## What the system actually measures, and where it lives

The verified-data contract is not a philosophy statement. It is enforced by the architecture. There are three subsystems that produce the numbers this book is built on, and each of them writes to auditable records you can read and question.

![A systems diagram: three source pipelines — funding, postings and liveness, role quality — each producing its own audit output, with all three audits converging into a single run log; small self-loops on each source mark a local-verified-data-first cache check.](../images/03-the-verified-data-contract-fig-02.png)
*Figure 3.2 — Three pipelines, three audits, one log*

<!-- → [DIAGRAM: Three boxes labeled scripts/sec/ (funding), scripts/ats/ (postings and liveness), scripts/bls/ (role quality), each with an arrow pointing to a corresponding *-audit.md output, all feeding into RUN_LOG.md. Caption: "The three pipelines and where their output lives — every number traces back through this graph."] -->

`scripts/sec/` pulls from SEC filings to measure company funding. When a company raises a round or files material financials, that event is in the public record. The script finds it; the audit reports what was found and what was dropped. `scripts/ats/` queries job-board data to measure whether a company is actively posting and whether particular openings are live. `scripts/bls/` draws on Bureau of Labor Statistics data to assess role quality — compensation, demand trajectory, geographic concentration. Each subsystem writes an audit: a record of what the pipeline did on a given run, how many rows it processed, what coverage it achieved, what it couldn't match.

`DATA_CONTRACT.md` defines what data exists and where it lives — including which files are private (your own application records, credentials, anything that identifies you personally) and how those are handled. `RUN_LOG.md` is the system's memory: every run leaves a trace, so a decision you make today on the strength of a number can be reconstructed and questioned tomorrow. This is the same practice good empirical work has always demanded — state your method, show your coverage, let a claim be checked.

## The tool prefers what it already trusts

There is a mechanism underneath the contract I haven't named yet, and it is the part people miss when they picture a verification tool. They imagine it reaching out to the network every time — hitting the Department of Labor server, re-downloading the disclosure file, re-counting from scratch. That is not what happens, and the difference is the whole reason the contract is cheap to keep.

Each of these tools checks for **local verified data first**. Once the DOL disclosure data has been downloaded and checked, it lives in a local store. When a script runs, it asks a prior question before it asks the network anything: *do I already have verified data for this, and is it still fresh?* If the answer is yes, the script reads the local copy and never touches the network. The audit says so plainly — *served from cache* — so you can see that this run rested on data already verified, not on a fresh pull nobody checked.

Only when the local answer is no — the data is missing, or older than the freshness window the contract defines — does the tool go and fetch. And fetching is not the same as trusting. The moment new data arrives it is **verified on arrival**: the schema is what was expected, the row counts are sane, the source is the one it claims to be. Only then is it written to the local store, and only then does a line go into the run log recording that a fetch happened and what it pulled. The network is the fallback, not the default.

This is not mainly an optimization for speed, though it is faster. It is what makes a run **reproducible**. A number you cited last Tuesday can be regenerated today from the same local verified data, because the tool did not silently re-pull a changed file underneath you. When the data genuinely changes — a new quarter of filings drops — the fetch is logged, visible, and dated, so the change is a recorded event instead of a mystery. Verified-once-then-cached is how "never invent a number" stays affordable: you are not re-earning trust on every run, you are reusing trust you already audited.

## The smallest honest thing you can do right now

Before you understand every component, before the sponsorship pipeline and the ATS scraper and the funding detector are fully built, there is one thing you can do that establishes the contract in practice rather than just in principle. Run a verification:

```bash
npm run ats:verify
```

This calls `scripts/ats/verify-pipeline.mjs`, which checks the tracker and scan data for internal consistency and prints what it found. The output is the audit. I want you to run this not because you need the result yet, but because there is a specific feeling I want you to have: the difference between being told the data is fine and *seeing the check pass*. One of those is someone's word. The other is evidence. The contract is the decision to require the second.

| Pipeline | What it verifies | What the audit reports |
|---|---|---|
| `ats:verify` | Tracker and scan-data consistency | Row counts, coverage, drop reasons |
| `sec:verify` | Filing-record completeness | Companies matched, date range, gaps |
| `bls:verify` | Role-quality data freshness | Series IDs, last update, missing occupations |

*Table 3.1 — The three verification commands and what each audit tells you.*

## The seam where fluency sneaks back in

Here is the error I want to warn you about specifically, because it is not obvious and it catches almost everyone, including me when I'm moving fast. You run the script. The script returns a real number — fifteen filings, 85% approval rate, sourced to DOL records. Now you hand that number to a language model and ask it to interpret the finding. The model says: "fifteen filings over three years is strong for a company of this size in this sector."

Did the model count anything? No. It estimated. It applied a pattern from its training data about what "strong" looks like for biotechs of similar size — a pattern it cannot actually show you, because it does not know what the pattern is, only that the output sounds reasonable. The moment an unsourced judgment re-enters through interpretation, the contract has been quietly broken. You ran the script, which was right. You then let the model paper over a gap in the reading, which was wrong.

The discipline required is to watch the seam between the data and the reading of the data. Data claim: fifteen filings, 85% approval rate, sourced to DOL/USCIS. Model judgment: this is strong for a company of this type. Both are present in that paragraph. Only the first can be defended against scrutiny. The second is permitted — it is genuinely useful — but it has to be *labeled as judgment*, not dressed as a fact derived from counting.

For any sentence in a system output, one question settles it: could this sentence have been produced by counting records? If yes, it must trace to a script output or an audit report. If it cannot be traced, it is not allowed to stand. If no — if it is a reading, a framing, a suggestion — it is model judgment, and it is allowed, but it must be visible as such.

![A decision tree: one question — could this sentence have been produced by counting records? — splits into a data-claim branch that must trace to a script output or audit and a model-judgment branch that is allowed but must be labeled, with both branches reconverging on a final check that the label is visible in the output.](../images/03-the-verified-data-contract-fig-03.png)
*Figure 3.3 — The one-question test for every sentence*

<!-- → [INFOGRAPHIC: Decision tree — "Could this sentence have been produced by counting records?" Yes branch leads to "Data claim: must trace to script output or audit." No branch leads to "Model judgment: allowed, but must be labeled." Both branches end at "Is the label visible in the output?" Caption: "The one-question test for every sentence in a mixed output."] -->

## What the data can't tell you

The contract guarantees that counts and rates are real. It does not guarantee that the right things were measured. This is a distinction the contract cannot collapse for you, and I want to be honest about where it leaves you.

The data knows a company filed fifteen LCAs. It does not know that all fifteen were for one senior scientist role that was filled and will not open again. It knows an approval rate; it does not know that the company was acquired last month and the sponsorship policy changed last week. A name-matching failure — "Google LLC," "Google Inc," "Alphabet" — can make a prolific sponsor look like a non-filer. A company can sponsor and stay below the detection threshold if they filed in a window your data doesn't cover.

The contract stops you from building on fiction. It does not give you omniscience. What it gives you is a floor: you know the numbers you have are real, and you know where the gaps are, because the audit reported them instead of hiding them. A 94%-accurate system can still harm someone systematically if no one asks what it failed to measure. The contract makes you the person who asks that question — not the model, not the system, you. The gaps it reports are your honest starting debt: claims you currently cannot source, labeled as such, waiting for better data.

| What the contract guarantees | What the contract cannot guarantee |
|---|---|
| Counts and rates are real | That the right things were measured |
| Gaps are labeled, not hidden | That coverage is complete |
| Decisions trace to auditable records | That the records captured the full picture |
| Model judgments are labeled | That those judgments are correct |

*Table 3.2 — The floor the contract provides and the ceiling it doesn't claim to reach.*

![A two-column matrix pairing each guarantee with its matching limit — counts are real versus the right thing was measured, gaps are labeled versus coverage is complete, decisions trace to records versus the records captured the full picture, judgments are labeled versus those judgments are correct — a wall of solid assurances facing a wall of honest caveats.](../images/03-the-verified-data-contract-fig-04.png)
*Figure 3.4 — The floor and the ceiling: guarantees vs. limits*

## The shape of everything that follows

Before any of those tools, two chapters finish the method this one began. Chapter 4 shows that every tool here is a *recipe* with two customers — the AI that runs it and the human who maintains it — and that you therefore write each one twice. Chapter 5 takes the floor this chapter laid down (the numbers are real) and asks the harder question the contract cannot answer on its own: are they the *right* numbers, measured the right way?

Then the building starts. Every chapter from there forward builds one of the three sources of truth or shows you how to read what they produce. Chapter 6 builds the funding detector — SEC filings, round size, recency, the money that forces companies to hire. Chapter 7 builds the sponsorship pipeline. Chapter 8 builds the posting liveness check. Each of them opens by reading the shared contract, each of them writes to an audit, each of them contributes a line to the run log.

The prime directive is already set: run the script and read the audit before you prompt. Never invent a count, a rate, or a coverage number. From here, the work is building the scripts worth running.

The one question I haven't fully answered yet: of all the companies in the world, which ones just got the money that forces them to hire? That's where we go next — and the answer, it turns out, is sitting in a federal filing database, waiting to be counted.

---

## Chapter 3 Exercises: The Verified-Data Contract

**Project:** Your Own Reallocation Engine

**This chapter adds:** the floor your engine stands on — you fork the repo, run your first verification, write your first `RUN_LOG.md` entry, and harden the `CLAUDE.md` rule from Chapter 1 into the full one-rule contract: run the script and read the audit before you prompt; never invent a count.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Summarizing what a verification audit reported, in plain language.** — *Why AI works here:* the audit is the ground truth; the model is reformatting numbers you can read for yourself — a checkable summary, not a source.
- **Drafting a `RUN_LOG.md` entry from the command you ran and the output you paste in.** — *Why AI works here:* this is structured reformatting of facts you supply; the log's accuracy is verifiable against the terminal output.
- **Explaining what a given script does by reading its README with you.** — *Why AI works here:* comprehension support you verify by running the script — the interrogation mode, not delegation.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the audit file itself: every claim the model makes must be checkable against it.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Producing any count, rate, or coverage number.** — *Why AI fails here:* this is the prime directive — a model asked "how many LCAs did this firm file?" returns a plausible number, not a counted one; that is fabrication, the exact failure the contract exists to stop.
- **Deciding whether a sentence in an output is a data claim or a model judgment.** — *Why AI fails here:* the model that wrote the fluent interpretation is the worst-placed to flag it; the seam where an estimate re-enters as fact is yours to police.
- **Judging whether a labeled coverage gap is acceptable for a given decision.** — *Why AI fails here:* whether a missing visa category matters depends on your situation — a stakes judgment the model cannot make.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** — the discipline of watching the seam between counted fact and fluent estimate, and refusing to let the second wear the costume of the first.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a clean separation, for one real audit output, of what is a data claim (must trace to a record) and what is model judgment (allowed, but labeled) — the reading discipline every later score depends on.

**Tool:** Claude (claude.ai chat). Chat is the right fit; you paste a real audit and interrogate it.

**The Prompt:**

```
I am enforcing a verified-data contract: any sentence that could have been
produced by counting records must trace to a script output or audit; any
sentence that is interpretation must be labeled as model judgment, never dressed
as a counted fact. You must NOT invent any number — if a number isn't in what I
paste, you do not have it.

Below is the output of a verification command from my job-search engine. Do four
things:

1. List every DATA CLAIM in the output (counts, rates, coverage, dates) and, for
   each, name the source it should trace to (which script or audit).
2. List every MODEL JUDGMENT or interpretation, and rewrite each so it is
   explicitly labeled as judgment (e.g. "Interpretation, not counted: ...").
3. Apply the one-question test to one borderline sentence: "Could this have been
   produced by counting records?" Show your reasoning for yes or no.
4. Draft a RUN_LOG.md entry: what I ran, what the audit reported, and one thing
   the output told me I would otherwise have assumed.

If any step needs a number not present below, say "not in the provided output"
instead of estimating.

--- PASTE YOUR AUDIT OUTPUT BELOW ---
[paste the printed output of your verify command here]
```

**What this produces:** a labeled breakdown of your own audit into data claims vs. judgments, plus a ready `RUN_LOG.md` entry — the habit that keeps fluency from sneaking back in at the reading layer.

**How to adapt this prompt:**
- *For your own project:* paste the real terminal output of whatever verify command you ran. The prompt is useless on an invented audit and sharp on a real one.
- *For ChatGPT / Gemini:* works as-is; both occasionally "helpfully" estimate a missing number — the "not in the provided output" instruction is the guardrail, keep it verbatim.
- *For a Claude Project:* put the one-question test and the data-claim/judgment definitions in the project instructions so every reading inherits them.

**Connection to previous chapters:** this operationalizes Chapter 1's interrogation reflex on real data and gives Chapter 2's "unverified" target columns a rule for how they get filled.

**Preview of next chapter:** Chapter 4 shows you how to write the recipes that produce these audits — twice, once for the agent and once for the human who maintains it.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** your first real run — you fork the engine, execute a verification command, and record it, turning the contract from principle into a logged event.

**Tool:** Claude Code. Cloning, running an `npm` command, reading an audit, and writing a log entry is a terminal workflow that suits an agentic CLI.

**Skill level:** Intermediate — requires cloning a repo and running commands; recoverable if a command fails.

**Setup:**

Before running this exercise, confirm:
- [ ] You have forked/cloned the engine repo and run its install step (e.g. `npm install`).
- [ ] `recipes/_shared.md`, `DATA_CONTRACT.md`, and `RUN_LOG.md` exist in the repo.
- [ ] Your `CLAUDE.md` from Chapter 1 is present (you'll extend it).

**The Task:**

```
Work inside my forked engine repo. Do not modify any data files or any script;
this is a read-and-run-and-record task only.

1. Read recipes/_shared.md and tell me, in two lines, what the prime directive
   is and which files are named as sources of truth.
2. Run the ATS verification command:  npm run ats:verify
   Paste the full output back to me. If it errors, show the error and stop.
3. From that output, append a dated entry to RUN_LOG.md using the repo's log
   format: what ran, what the audit reported (row counts / coverage / drops),
   what worked, what didn't, and one thing the output revealed.
4. Append one line to CLAUDE.md under a "Verified-data contract" heading:
   "Run the script and read the audit before prompting. Never invent a count, a
   rate, or a coverage number. Label model judgment as judgment."
5. Show me the diff of RUN_LOG.md and CLAUDE.md before saving.

Do not fetch from the network beyond what ats:verify does on its own. Stop after
step 5.
```

**Expected output:** the verify command's audit printed back, a new `RUN_LOG.md` entry, and the contract rule appended to `CLAUDE.md` — shown as a diff for your approval.

**What to inspect in the output:** read the audit — does it report *served from cache* or a fresh fetch? Are the row counts non-zero and sane? Confirm the `RUN_LOG.md` entry contains only numbers that appear in the actual output, not rounded or "approximately" values the model smoothed in.

**If it goes wrong:** the most likely failure is `npm run ats:verify` erroring because data hasn't been downloaded yet or `portals.yml` is missing. Recover by reading the error and the script's README (Chapter 4's scan recipe covers the missing-config case) — do not let the agent fabricate a plausible audit to "complete" the task.

**CLAUDE.md / AGENTS.md note:** this exercise writes the load-bearing rule of your whole repo into `CLAUDE.md`. Every later pipeline (Chapters 6–9) inherits it; if you add a data source, this rule is what it must satisfy before its numbers count.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** a mixed system output where a real, sourced number and an unsourced estimate sit in the same paragraph — the seam failure the chapter warns about.

**Validation type:** Reasoning chain (data-claim / judgment boundary).

**Risk level:** Medium — the data claim is true, which is what lends the smuggled judgment its credibility.

**Setup (pre-generated artifact — option b):** This chapter's lesson is the seam where fluency re-enters through interpretation, so validate this pre-generated output:

> **Sponsorship finding — Acme Bio.** Acme Bio filed 15 LCAs over the past three
> years with an 85% H-1B approval rate (source: DOL/USCIS records). This is a
> strong sponsorship signal for a company of this size, and Acme Bio is very
> likely to sponsor your visa for a research role. Given their Series B funding,
> they are also probably expanding their team and would be a great culture fit.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — The Verified-Data Contract

□ Correctness: Which sentences are counted facts and which are estimates?
  Apply the one-question test to each: could it have been produced by counting
  records?
□ Completeness: Do the data claims carry their source, and do the judgments
  carry a "this is interpretation" label?
□ Scope: Did the output stay within what the data supports, or did it add a
  culture-fit and expansion claim nothing measured?
□ Seam check (chapter-specific): Identify the exact sentence where a verified
  number ("15 filings") is used to launch an unsourced judgment ("strong
  signal," "very likely to sponsor"). Is that judgment labeled?
□ Coverage-gap check (chapter-specific): Does the output mention what it could
  NOT see (name-matching gaps, visa categories not covered, filing recency)?
□ Failure mode check: Does this output exhibit any of the following?
  - Fluent but wrong (a true number used to certify an untrue conclusion)
  - Unlabeled model judgment dressed as a counted fact
  - Missing ground truth ("probably expanding" — sourced to nothing)
```

**What to do with your findings:**
- If the output passes all checks: use it. (It will not — at least two judgments are unlabeled.)
- If the output fails one check: rewrite the paragraph so every counted fact carries its source and every judgment is labeled as judgment, then re-validate.
- If the output fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — write the finding yourself from the audit.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — catching the moment a fluent interpretation borrows the authority of a verified number. The contract gives you the floor; this skill keeps you standing on it.
