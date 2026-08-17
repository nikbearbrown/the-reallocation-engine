# Chapter 4 — Two Customers: Writing a Recipe for the AI and the Human

*A document that tries to serve everyone serves no one — the problem is older than software, and recipes are not exempt from it.*

There is a small confusion built into the word "recipe" that I want to name before it causes trouble. A recipe lives in a markdown file. Markdown is text you read. So naturally, when someone writes a recipe, they write it for a reader — they explain what it does, they describe its purpose, they use complete sentences and transitions. The file is readable and pleasant and almost entirely useless to the agent that has to execute it tonight.

I want to be precise about what I mean by "tonight." The F-1 clock is running. You have somewhere between sixty and ninety days to line up a job offer with a company willing to sponsor, file the paperwork, and get it processed. Every recipe in this engine either runs on verified data or it doesn't. And whether it runs on verified data is decided not by what you intended when you wrote it, but by what happens when an agent reads it at eleven PM and starts executing. The document that should have said "call `npm run ats:scan` first, before anything else" instead said "the recipe is designed to use the scan results" — and the agent, unable to locate the output it needed, quietly substituted something plausible. The recipe ran. Nothing in the output announced the substitution. The data was invented.

That failure has a cause, and the cause is a design error. The recipe was written for one customer and executed by another.

## The two customers

Every recipe has two customers with completely different needs.

The first customer is the AI executing it. It needs the recipe to be **complete, explicit, and unambiguous**. It needs to know — precisely, with nothing left to inference — what to read first, what commands to run in what order, what output files to inspect, what to log, and under what conditions to stop. What it does *not* need is narrative or rationale: prose explaining *why* is budget spent on something other than the task. But stripping the prose does not mean making the artifact short. Often the opposite — a serious agent contract can run to hundreds or thousands of lines of exact steps and structured JSON, because every case the agent might hit has to be specified rather than left to its judgment. Terse in prose, exhaustive in specification. The AI doesn't care that the scan recipe exists to enforce the verified-data contract — it cares that the first line says "Read `recipes/_shared.md`," that the next line names the file, and that nothing it needs is missing. The executable recipe is optimized for an agent to follow exactly, tonight.

The second customer is the human maintaining it. This is future-you, reading in March, who has forgotten what the recipe does, has no memory of why certain design choices were made, and needs to understand the recipe well enough to fix it when it breaks or extend it when your search changes. The human does *not* want the exhaustive specification the agent needs — handed a thousand lines of exact steps, a person skims and loses the thread. What the maintainer wants is orientation first: a high-level summary of what the recipe is and why it exists, and then the ability to drill into detail only on the question they actually have. So the human artifact is layered: a one- or two-sentence purpose and the big picture on top, then dependencies, how to run it, what it produces, and how it fails underneath — each there to expand when a specific question arises, not to be read end to end. Optimized for fast comprehension and selective depth rather than execution.

The problem is that these two needs are in tension. The agent contract is stripped of explanation so nothing is ambiguous and nothing is left to improvisation. The human card leads with the summary and keeps the detail a layer down, so the maintainer grasps the point before deciding how deep to go. A document that tries to do both splits the difference: too much prose to be clean and exact for the agent, too much exhaustive detail up front to make sense to a reader who has forgotten the context. A recipe written to serve both customers simultaneously serves neither.

So you write it twice.

![Two boxes side by side — an AI-artifact box that is complete and explicit (read-first order, verbatim commands, stop conditions, as long as precision requires) and a human-artifact box that leads with a summary and lets the reader drill into detail on demand — both resting on a single wide foundation bar labeled the verified-data contract, with arrows rising from the foundation into each box.](../images/04-two-customers-fig-01.png)
*Figure 4.1 — Two customers, one contract*

<!-- → [DIAGRAM: Two boxes side by side, labeled "AI Artifact (recipe)" and "Human Artifact (card)". AI box lists: complete, explicit, imperative, read-first order, commands verbatim, stop conditions (as long as precision requires). Human box lists: purpose statement, dependencies, how-to-run, what-it-produces, failure modes. Both boxes share a footer labeled "Verified-Data Contract (_shared.md)" with arrows pointing into both. Caption: "Same recipe, two documents. The contract is the one thing both artifacts must honor."] -->

## What each artifact contains

The AI artifact — the recipe an agent follows — has a predictable structure. It opens with what to read first, before anything else. This is not optional and it is not decorative: loading `recipes/_shared.md` first is what makes the runtime honest by construction. The shared contract states the prime directive, identifies the sources of truth, and defines the rules for when a number is verified and when it must be labeled as judgment. An agent that loads the shared contract before running the first command operates inside a defined constraint. An agent that skips it operates from its own priors.

After the read-first order, the recipe lists the commands — actual, verbatim, runnable commands, not descriptions of what commands could be run. Then it names what to inspect in the output and what counts as evidence of a successful run: not "the output looks reasonable" but "row count is nonzero, provider hits are listed by platform, no errors in stderr." Then it states the stop conditions: what halt execution. Then it names the log entry to write. That's the recipe. It should be readable at a glance without decoding.

The human artifact is structured differently. It opens with a purpose statement that tells the maintainer what the recipe is *for* in one or two sentences. Then it lists dependencies: which files the recipe reads, which scripts it calls, which other recipes it assumes have run first. Then it gives the commands — the same commands as the recipe, but here they're annotated: what each one does, what the output is, what to notice in the result. Then it describes what the recipe produces when everything works: which files are written, what an audit looks like, what a log entry should contain. Finally, and most importantly, it lists failure modes: specific, named ways the recipe can break. Not "something might go wrong" but "if `data/ats/portals.yml` doesn't exist, the scan will silently use the example config and produce output against the example companies, not your companies."

That last section is the one that gets skipped when someone writes a recipe fast. And it is the one you need most at eleven PM on a Thursday when the output looks wrong and you don't know why.

| Section | AI artifact | Human artifact |
|---|---|---|
| Opening | Read-first list | Purpose statement |
| Core content | Imperative commands, no commentary | Annotated commands with output descriptions |
| Evidence | Stop conditions and output checks | What success looks like, in full |
| Logging | Log-entry template | What the log should contain, and why |
| Failure | Not present | Named failure modes with specific causes |

*Table 4.1 — The structural difference between the two artifacts: the same commands appear in both, but their context is inverted.*

## Drift is a failure mode, not just inconvenience

There is a failure mode I have not named yet, and it is more damaging than either the missing rationale or the over-explained recipe. It is drift: the recipe changes, and the human doc doesn't.

Drift happens because updates feel minor. You change one command — you add a flag, rename an output file, change the order of two steps because the second one now depends on output from the first. You update the recipe because the recipe is what the agent runs, and the agent fails if the recipe is wrong. The human doc also needs updating, but you're in a hurry, and it's just documentation, and you'll do it later. Later doesn't come, because it never does when you're racing a clock.

Six weeks later, you read the human doc to understand why the scan recipe works the way it does. The human doc describes a workflow that no longer exists. It names a file the recipe no longer produces. It lists a command that now fails without a flag the recipe added. You can no longer trust the documentation, which means you now have to reverse-engineer the recipe to understand your own recipe, which costs more time than writing the human doc would have.

Drift is its own failure mode — not a consequence of forgetting to maintain the docs, but a structural property of having two artifacts with no enforcement binding them. The only enforcement is discipline: when you update one, you update both in the same commit, and the human doc's failure-modes section explicitly lists "human doc not updated when recipe changes" as one of the named failure modes. The system cannot automate this. The discipline is yours.

![Two parallel tracks — recipe and card — across three time positions: initially in sync, then the recipe is updated while the card stays unchanged and the connector between them breaks, then a reader follows the stale card down a wrong path diverging from the recipe's actual behavior.](../images/04-two-customers-fig-03.png)
*Figure 4.3 — Drift: when the map leaves the territory*

## Both artifacts honor the verified-data contract

The shared contract from Chapter 3 is the one thing both artifacts must honor, and each honors it differently.

The AI artifact honors it procedurally: `recipes/_shared.md` is the first item in the read-first list. The agent loads it, and the contract's prime directive is active for the entire run. The rules are live in context: use collected data and tested scripts first; never invent counts, rates, or coverage numbers; if a result comes from LLM judgment, label it as such.

The human artifact honors it structurally: the dependencies section lists which scripts the recipe calls and which audits it reads, making the data provenance visible to anyone reading the card. The failure modes section includes specific entries for contract violations — what happens if the script isn't called, what the output looks like when a model fills in a gap versus when a script ran. The maintainer who reads the human artifact should finish it knowing exactly which parts of the verified-data contract this recipe relies on and what breaks if that reliance is violated.

There is an additional fact here worth stating plainly. The F-1/OPT reader running this engine is both customers at different times. You author the recipe, sitting at your laptop with context about what the recipe is supposed to do, what scripts you built, what data you collected, what can go wrong. You are the human customer. Tonight, an agent runs the recipe you wrote. The agent is the AI customer. In March, you — or someone who is nearly a stranger to this codebase — reads the human doc to understand why something is behaving strangely. You are the human customer again, but with much less context than you had when you wrote it.

The reader who has forgotten everything is not a hypothetical. It is you in three months. The human artifact is a letter you are writing to that person. Write it like it is.

## The scan recipe, shown both ways

The best way to understand the two-artifact structure is to see it for one recipe. The `scan` recipe is the right choice: it is the first active recipe in the engine's chain, it calls real scripts, and it exists in the repository you are using, so the commands are not examples I've constructed for illustration.

Here is the recipe an AI would follow:

---

**scan — AI recipe**

Read first:
- `recipes/_shared.md`
- `scripts/ats/README.md`
- `data/ats/portals.example.yml`
- `data/ats/portals.yml` (if it exists)
- `data/ats/scan-history.tsv` (if it exists)
- `recipes/RUN_LOG.md`

Run:
```bash
cd scripts/ats
python3 detect-ats.py "Company Name" --output ../../data/ats/ats_detection_sample.csv
cd ../..
npm run ats:scan
npm run ats:liveness -- --file data/ats/job-urls.txt
npm run ats:verify
```

Inspect output: count rows; count provider hits by platform; record empty results separately from errors; note where output was written.

Deduplicate: prefer exact URL; then company plus normalized role title; record suspected duplicates, do not delete uncertain entries.

Stop conditions: if `data/ats/portals.yml` does not exist, copy `data/ats/portals.example.yml` and edit before proceeding. Do not run the provider scanner against the example config.

Log template:
```markdown
## YYYY-MM-DD -- ATS scan
- **Recipe:** scan
- **Input:** data/...
- **Command:** `...`
- **Output:** data/...
- **Worked:** ...
- **Did not work:** ...
- **Evidence:** row counts, provider counts, sample URLs
- **Next:** ...
```

Prompting rule: use LLM judgment only after script output has been inspected. The LLM may summarize patterns, explain likely failure causes, or propose the next test. It must not invent ATS hits, live job counts, or sponsorship claims.

---

Now here is the human card a maintainer reads:

---

**scan — human card**

**Purpose.** Detect which applicant-tracking system (ATS) a company uses and pull current job postings from configured portals. This is a data-collection step, not an analysis step. Its output feeds the pipeline recipe.

**What it can verify:** whether a company exposes Greenhouse, Lever, or Ashby jobs; whether a portal scan produced new URLs; whether a posting URL appears in scan history; whether a posting is probably live after a liveness check.

**What it cannot verify on its own:** sponsorship likelihood; role quality; whether a company is a good target. Those require SEC/H-1B and BLS/SOC data, handled by later recipes.

**Dependencies:**
- `recipes/_shared.md` — the verified-data contract; must be loaded first
- `scripts/ats/detect-ats.py` — detects ATS by company name or CSV input
- `scripts/ats/scan.mjs` (via `npm run ats:scan`) — runs configured portal scan
- `scripts/ats/` — liveness check and verify commands
- `data/ats/portals.yml` — your working portal config (not the example)
- `data/ats/scan-history.tsv` — deduplication history from prior runs

**How to run:**
```bash
# Detect ATS for specific companies:
cd scripts/ats
python3 detect-ats.py "Company A" "Company B" --output ../../data/ats/ats_detection_sample.csv

# Run full portal scan (requires portals.yml to be configured):
cd ../..
npm run ats:scan

# Check liveness of specific URLs:
npm run ats:liveness -- --file data/ats/job-urls.txt

# Verify pipeline consistency:
npm run ats:verify
```

**What it produces:** detection output CSV; scan output with provider hits by platform; liveness signals per URL; a verification audit. A log entry in `recipes/RUN_LOG.md` documenting what ran, what it found, and what failed.

**How it fails:**
1. `data/ats/portals.yml` missing — the scan will use the example config and return results for example companies, not your companies. The output will look plausible and be wrong. Check that `portals.yml` exists and is not identical to `portals.example.yml` before trusting any scan result.
2. ATS detection hits vs. live postings conflated — "ATS detected" means the provider is present. "Live posting" requires a liveness check. They are different facts. A recipe output that reports ATS hits as if they were open jobs has skipped the liveness step.
3. Recipe updated, human doc not updated — if the commands in the recipe diverge from the commands in this card, one of them is wrong. Check the recipe before troubleshooting.
4. LLM fills in missing data — if the scan produces no results and the recipe output contains confident sponsorship claims or ATS findings, the prompting rule was violated. No script output means no verified data. The output must say what it couldn't find, not invent a replacement.

---

The commands are identical between the two artifacts. What differs is the frame: the recipe assumes the reader will execute immediately; the human card assumes the reader is trying to understand. The same content, arranged for two different questions — "what do I run?" versus "what is this and how does it break?"

![A section-by-section matrix mapping the five recipe sections across the two artifacts — opening, core content, evidence, logging, failure — where the AI column carries exact, imperative chips and the human column fuller annotated chips, and the failure row shows an empty AI cell against the heaviest chip in the human column.](../images/04-two-customers-fig-02.png)
*Figure 4.2 — Same content, inverted context: section-by-section*

<!-- → [INFOGRAPHIC: Two annotated documents side by side — left labeled "AI Recipe (scan.md)" with callout arrows pointing to: read-first list, verbatim commands, stop condition, log template; right labeled "Human Card (scan — maintainer view)" with callout arrows pointing to: purpose statement, dependency list, annotated commands, failure modes numbered 1–4. Caption: "The recipe is optimized for execution. The card is optimized for comprehension. Neither does the other's job."] -->

## What writing them twice forces you to think about

There is an unexpected benefit to writing the recipe twice that I didn't anticipate when I designed this architecture. The discipline of writing the human card — especially the failure-modes section — forces you to think adversarially about your own recipe. When you sit down to write "how does this fail," you discover that you have not thought carefully about what happens when `portals.yml` is missing, or when the liveness check returns zero results, or when the output CSV is empty because none of the companies matched. Those are the moments you realize the recipe has a gap: it doesn't say what to do in those cases, which means the agent running it tonight will improvise. Improvisation in a verified-data system looks a lot like invention, which is what the contract prohibits.

Writing the failure modes is how you find the missing stop conditions. The human card is not just documentation — it is a test of the recipe.

## The bridge to Chapter 5

Writing a recipe well — two artifacts, shared contract loaded first, failure modes named, recipe and card maintained together — does not make the data the recipe reads trustworthy. The scan recipe can be structurally correct in every way this chapter describes and still return stale detection results, or miss a company because of a name-matching failure, or report a liveness signal on a posting that closed yesterday. The recipe follows the contract. The contract ensures the numbers aren't invented. Neither of those guarantees the numbers are the right numbers, measured the right way.

That question — are these the right numbers? — is the subject of Chapter 5. The verified-data contract set a floor: what you have is real. Chapter 5 asks whether real is enough.

---

## Chapter 4 Exercises: Two Customers

**Project:** Your Own Reallocation Engine

**This chapter adds:** the authoring discipline your engine is maintained with — for one recipe in your repo you write both artifacts, the complete-and-explicit AI recipe and the summary-first human card, bound by the shared contract, so tonight's agent can run it and March's you can fix it.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Drafting the human card's prose sections (purpose, how-to-run) from the recipe.** — *Why AI works here:* turning a command list into readable explanation is drafting against a source you hold; you check it against the actual recipe.
- **Generating a first list of candidate failure modes for a recipe.** — *Why AI works here:* this is adversarial brainstorming — the model proposes ways things break, you keep the ones that are real for your setup.
- **Diffing a recipe against its human card to flag mismatched commands.** — *Why AI works here:* spotting where two texts disagree is pattern-matching you can confirm line by line.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the recipe file: the card must describe what the recipe actually does.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Deciding the recipe's stop conditions — when an agent must halt rather than improvise.** — *Why AI fails here:* a missing stop condition is exactly where an agent invents data; deciding where the cliffs are requires knowing your data and your stakes, not generic caution.
- **Confirming the commands in the recipe actually run in your environment.** — *Why AI fails here:* the model can write a plausible command that doesn't exist in your repo; only running it proves it.
- **Judging whether a failure mode is complete enough to trust the recipe tonight.** — *Why AI fails here:* "have I thought of how this breaks for my companies?" is the adversarial judgment the chapter says writing the card forces — and it forces *you*, not the model.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** — writing the failure-modes section is a structured way of asking "what don't I yet understand about my own recipe?", which is metacognition made into a document.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** the human card for one recipe in your engine — purpose, dependencies, annotated commands, and named failure modes — the maintainer's letter to future-you.

**Tool:** Claude (claude.ai chat). Chat fits: you paste a recipe and have the model help draft its companion card, which you then verify against the file.

**The Prompt:**

```
I follow a "two customers" rule: every recipe has an AI version (complete,
explicit, and imperative — as long as precision requires, for an agent to
execute) and a human card (summary first, with detail to drill into, for the
maintainer who has forgotten the context). I will paste the AI recipe below.
Write its HUMAN CARD only. Do not invent commands, files, or behavior that are not in the recipe
— if something is unclear, list it under "Open questions for me to resolve"
rather than guessing.

Structure the card as:
1. Purpose — 1–2 sentences: what this recipe is FOR.
2. What it can verify / what it cannot verify on its own.
3. Dependencies — files it reads, scripts it calls, recipes it assumes ran first
   (only those named in the recipe).
4. How to run — the same commands, annotated with what each does and what to
   notice in the output.
5. What it produces — files written, what a good audit looks like, the log entry.
6. How it fails — at least 4 NAMED failure modes with specific causes, including
   one for "recipe updated but this card wasn't" (drift) and one for "script
   produced nothing and the model filled the gap" (contract violation).

--- PASTE YOUR AI RECIPE BELOW ---
[paste one recipe from your recipes/ directory here]
```

**What this produces:** a complete human card for a real recipe, with an explicit drift failure mode and a contract-violation failure mode — saved next to the recipe it documents.

**How to adapt this prompt:**
- *For your own project:* paste a recipe you actually have. If the model lists "open questions," that's the gap in your recipe surfacing — resolve those before trusting the card.
- *For ChatGPT / Gemini:* works as-is; both may pad the purpose section — append "purpose section max two sentences."
- *For a Claude Project:* keep the two-artifact structure in the project instructions so every card you draft has the same shape.

**Connection to previous chapters:** the card's "what it cannot verify" section is where Chapter 3's coverage-gap honesty becomes part of your documentation.

**Preview of next chapter:** Chapter 5 asks whether the data these recipes read is measuring the right thing — the card's "what it cannot verify" line is where that question first appears.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** a matched recipe + human card pair committed together, with a check that their commands agree — drift caught at write time, not at 11 PM.

**Tool:** Claude Code. Reading a recipe, writing a card, and diffing the two across files is a multi-file workflow suited to an agentic CLI.

**Skill level:** Intermediate — file editing plus a comparison step.

**Setup:**

Before running this exercise, confirm:
- [ ] Your forked repo has a `recipes/` directory with at least one recipe.
- [ ] You completed Chapter 3's run so `RUN_LOG.md` and the contract rule exist.
- [ ] You've picked which recipe to document (the `scan` recipe is a good first target).

**The Task:**

```
In my engine repo, create a maintainer card for one recipe and verify it matches.
Do not change the recipe's behavior; do not run any data-fetching scripts.

1. Read recipes/scan.md (or the recipe I name).
2. Write recipes/scan.card.md as the human card: purpose, can/cannot verify,
   dependencies, annotated commands, what it produces, and at least 4 named
   failure modes (include drift and contract-violation). Use ONLY commands and
   files that appear in the recipe.
3. Extract the list of shell/npm commands from the recipe and from the card and
   compare them. Print any command that appears in one but not the other — this
   is the drift check.
4. If the command lists differ, do NOT silently fix them; show me the difference
   and ask which is correct.
5. Show me both files and the drift-check result. Stop.
```

**Expected output:** a new `recipes/scan.card.md`, plus a printed drift-check confirming the recipe and card list the same commands (or flagging where they differ).

**What to inspect in the output:** read the failure-modes section — are they specific to your setup ("if `portals.yml` is missing, the scan runs against the example config") or generic ("errors may occur")? Generic failure modes mean the card isn't yet doing its job. Confirm the drift check actually compared commands rather than just asserting they match.

**If it goes wrong:** the likely failure is the card inventing a command the recipe doesn't have (or vice versa), which the drift check should catch. Recover by trusting the recipe as ground truth and correcting the card — never edit the recipe to match a card the model wrote.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Every recipe has a paired `.card.md`; when a recipe's commands change, update the card in the same commit and re-run the drift check. 'Card not updated' is itself a logged failure mode."* This is the lightweight enforcement the chapter's final question asks for.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI-written recipe/card pair that has drifted — the card describes a workflow the recipe no longer runs.

**Validation type:** Agentic output (documentation vs. executable instructions).

**Risk level:** High — a drifted card sends an agent down a path that silently produces wrong data, and nothing in the run announces it.

**Setup (pre-generated artifact — option b):** This chapter's lesson is drift, which your own freshly-written pair won't yet show, so validate this pre-generated mismatched pair:

> **AI recipe (refresh.md):**
> ```
> Read first: recipes/_shared.md
> Run:
>   npm run sec:refresh -- --since 2024-01-01
>   npm run sec:verify
> Stop if: sec:verify reports coverage below 90%.
> ```
> **Human card (refresh.card.md):**
> *Purpose.* Re-download SEC Form D data and verify it.
> *How to run:* `npm run sec:refresh` then `npm run sec:audit`.
> *What it produces:* a refreshed dataset and an audit; no stop conditions
> needed since the script handles errors automatically.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Two Customers

□ Correctness: Do the commands in the recipe and the card match?
  (recipe: sec:refresh --since ... + sec:verify;  card: sec:refresh + sec:audit)
□ Completeness: Does the card capture the recipe's stop condition?
  The recipe halts below 90% coverage — does the card mention it?
□ Scope: Does the card claim something the recipe contradicts?
  ("no stop conditions needed" vs. an explicit stop-if line)
□ Drift check (chapter-specific): List every command/condition present in one
  artifact but absent or different in the other.
□ Contract check (chapter-specific): The card says the script "handles errors
  automatically" — does anything in the recipe support that, or is it an
  unverified reassurance?
□ Failure mode check: Does this output exhibit any of the following?
  - Drift (recipe and card describe different workflows)
  - A dropped stop condition (the agent won't halt where it should)
  - Fluent but wrong (a confident card that misdescribes the recipe)
```

**What to do with your findings:**
- If the pair passes all checks: trust it. (It will not — the commands and stop conditions disagree.)
- If it fails one check: correct the card to match the recipe (the executable artifact is ground truth) and re-run the drift check.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — rewrite the card yourself against the recipe, line by line.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** applied to your own tooling — noticing when the map (the card) and the territory (the recipe) have quietly diverged, before an agent acts on the wrong one.
