# Chapter 14 — Recipes: Operating the Engine
*The fluent surface from Chapter 1 has come back, this time wearing the engine's own uniform.*

Here is a failure mode worth understanding before you run anything. You invoke a recipe called `oferta` to evaluate a role. It returns a confident assessment: sponsorship looks strong, fit is solid, the composite is above threshold, you should apply. The output reads exactly like the verified findings you've trusted all book — sourced factors, labeled judgments, a traceable recommendation. But under the hood, something has changed. This run never called the sponsorship pipeline. It never read an audit. It asked a language model what it thought and dressed the guess in the format of a finding. You can't tell from the output. That's the whole danger.

The difference between a recipe that *runs a script and reads an audit* and a recipe that *quietly becomes a chat prompt* is the difference between the entire method working and the entire method failing silently. This chapter is about telling them apart — not once, but every time you run the engine.

## What a recipe is

The engine's runtime lives in a directory called `recipes/`. A recipe is a named operation you invoke, and each one declares what scripts it calls, what data it reads, and what it logs. The declaration is not decorative. It is the thing you verify. A recipe that calls no scripts and reads no audits is producing model judgment, not findings — and the output format will not tell you which one you're looking at.

Every recipe opens by loading `recipes/_shared.md`, the contract from Chapter 3. The contract is supposed to make the runtime honest by construction: every output labeled, every source named, every judgment flagged. Your job is to confirm, run by run, that it actually is.

The recipes split into two groups, and understanding the split is the chapter's load-bearing insight.

**Active recipes** are the ones that do verified work. `scan` detects the ATS and pulls the company's current postings. `pipeline` runs the scoring pass — sponsorship, fit, liveness, timeline — against the pulled data. `oferta` assembles the four factors into the composite from Chapter 11 and returns a sourced Apply/Consider/Skip recommendation. `tracker` logs decisions across the search (Chapter 15). `pdf` renders the ATS-safe résumé (Chapter 13). These recipes call real scripts. They read real audits. Their outputs are findings.

**Draft and helper recipes** are scaffolds — `apply`, `contacto`, `deep`, `followup`, `interview-prep`, `ofertas`, `project`, `training`, and others. They can be useful. But until you have confirmed, on a specific run, that a given draft recipe calls scripts and writes a log, you treat its output as model judgment. Not worthless. Not a finding.

| Active recipes (call scripts, read audits) | Draft / helper recipes (verify before trusting) |
|---|---|
| `scan` — detects the ATS, pulls current postings | `apply` — verify before trusting |
| `pipeline` — scores sponsorship, fit, liveness, timeline | `contacto` — verify before trusting |
| `oferta` — assembles the composite, returns Apply/Consider/Skip | `deep` — verify before trusting |
| `tracker` — logs decisions across the search | `followup` — verify before trusting |
| `pdf` — renders the ATS-safe résumé | `interview-prep`, `ofertas`, `project`, `training` — verify before trusting |

*The split is not permanent — a draft recipe that you verify runs scripts becomes trustworthy. The taxonomy is about evidence, not hierarchy.*

The taxonomy is not a permanent ranking. A draft recipe you have verified is trustworthy for that run. An active recipe that has been edited without your knowledge might not be. The classification is always about what the recipe did on this run, not what it is named.

![Two columns of recipes. The active column — scan, pipeline, oferta, tracker, pdf — calls scripts and reads audits, producing findings. The draft and helper column — apply, contacto, deep, followup, interview-prep, ofertas, project, training — carries a "verify before trusting" label, treated as model judgment until confirmed. The split is about evidence, not hierarchy.](../images/14-skills-operating-the-engine-fig-01.png)
*Figure 14.1 — Active vs. draft recipes*

## The loop

Operating the engine is one loop, repeated:

1. **Run** an active recipe against a real target.
2. **Inspect** the output *and its provenance* — did it call the script? Is there an audit? Which numbers trace to records and which are labeled judgments?
3. **Record** the run in `RUN_LOG.md` — what you ran, what it returned, what you decided.

The loop is deliberately boring, and the boredom is the safety. Each pass leaves a trace. A decision made three weeks ago can be reconstructed, questioned, and updated when new information arrives. The moment you skip the inspect step — accepting a recipe's output because it looks right, because the format is familiar, because the recommendation matches what you hoped — you've reopened the fluency trap. The surface was the danger in Chapter 1. It is still the danger in Chapter 14.

![A three-step cycle drawn as a clockwise loop: Run an active recipe, Inspect the output and its provenance, Record the run in RUN_LOG.md, then back to Run. The inspect node is annotated as the only protection — skip it and the fluency trap reopens.](../images/14-skills-operating-the-engine-fig-02.png)
*Figure 14.2 — The run-inspect-record loop with provenance checkpoints*

## A full sequence, end to end

Take one role from URL to evaluation:

```bash
# 1. scan — detect the ATS and pull the company's current postings
npm run ats:scan

# 2. pipeline — score the pulled roles
#    (run via the pipeline recipe / auto-pipeline)

# 3. oferta — evaluate one role into a composite + Apply/Consider/Skip
#    (oferta recipe; returns the sourced composite from Chapter 11)

# 4. verify — confirm the pipeline's data is internally consistent
npm run ats:verify
```

Four commands. Four links in a chain. What you read is the chain — not just the final recommendation, but each link's provenance. The scan result tells you which ATS was detected and which postings were pulled. The pipeline pass shows the four scored factors with their source labels. The `oferta` composite traces each term to its origin. The verification audit confirms the underlying data is consistent. A recommendation without its provenance is just an opinion in a formatted box.

## One target, fully operated

Let me make the loop concrete. A single role URL at a Likely-tier startup.

`scan` detects Lever and pulls the current posting. The posting is nine days old, description is specific, company hiring count has changed since last week — the liveness signal from Chapter 8 is clean.

The `pipeline` pass scores the role. Sponsorship probability from the LCA and H-1B join: 0.65 — Likely tier, not Proven. Fit from CV-vs-JD comparison: 0.72 — a model judgment, labeled as such. Liveness: live. Timeline factor: 0.8, from the reader's OPT expiration and estimated processing window.

`oferta` assembles the composite. Sponsorship at Likely (0.65) carries less weight than Proven (0.9) would. Fit is reasonable. The multipliers hold. The composite lands above threshold but not comfortably — the recommendation is **Consider**, not Apply.

`ats:verify` runs. The data is internally consistent. No flag.

`RUN_LOG.md` gets one entry: the command sequence, the composite with each factor labeled by source, the recommendation, and a one-line decision: *Compare against other Considers before spending an application slot.*

That's the whole loop. What makes it different from just reading the recommendation is the inspect step — knowing that the sponsorship term is 0.65 not 0.9, knowing why the composite landed on Consider rather than Apply, knowing which factor would have to improve to push it across the threshold. The recommendation is the headline. The provenance is the argument.

![A flow diagram of scan → pipeline → oferta → verify as four sequential stages, each annotated with its provenance checkpoint: ATS detected and postings list; four factors with source labels; composite with traced terms; consistency audit. The chain feeds into RUN_LOG.md.](../images/14-skills-operating-the-engine-fig-03.png)
*Figure 14.3 — End-to-end chain: scan → pipeline → oferta → verify*

<!-- → [DIAGRAM: Flow diagram showing scan → pipeline → oferta → verify as four sequential boxes, each with a "provenance checkpoint" annotation (e.g., "ATS detected, postings list," "four factors with source labels," "composite with traced terms," "consistency audit"). Arrow at the end pointing to RUN_LOG.md. Caption: "The chain is only as trustworthy as its weakest provenance link — the verify step confirms consistency, not correctness."] -->

## The failure that looks like success

The error that ends the method quietly: trusting a recipe by its name rather than its behavior.

"It's called `oferta`, so it must be evaluating with real data." Names are labels. Behavior is evidence. A recipe can be edited — by you, by a collaborator, by a future version of the system — so that it stops calling its script and starts generating plausible-sounding output from the model's priors. The output format stays the same. The sourced-factors layout stays the same. The Apply/Consider/Skip recommendation stays the same. Nothing in the presentation tells you that the sponsorship probability now comes from the model's sense of what a good biotech sponsorship probability should be rather than from an LCA record.

The inspect step is the only protection. On every run of every recipe you plan to trust, you confirm: did it call the script? Is there an audit? Can I trace the sponsorship number to a record?

If you can't answer yes to those questions, the output is a model judgment. It may be useful. It may even be accurate. But it is not a finding, and you should not make a Skip or Apply decision on its basis.

| What you observed on this run | Treatment | Action |
|---|---|---|
| Active recipe, provenance visible (script called, audit present) | Finding | Record and act |
| Draft/helper recipe, or provenance absent | Model judgment | Useful for drafting, not for decisions |
| Any recipe whose output you can't trace | Distrust the output | Re-run with inspection |

*The recipe's name is not the evidence. The provenance is the evidence.*

## What the loop cannot do

The run-inspect-record loop guarantees you *can* see provenance. It cannot guarantee you will draw the right conclusion from what you see.

Today's scan might have hit a stale cache and returned a posting that closed yesterday — the data is real, but the world has moved. The fit score of 0.72 might be confidently wrong for a role where your unusual project background is exactly what the team needs and no keyword in the job description captured it. The timeline factor rests on an estimate of processing time that the system cannot verify against the actual adjudication queue.

The engine runs the components and surfaces the evidence. The decision about whether a given run is trustworthy enough to act on is yours, every time. Automation makes the loop fast. It does not make it self-policing. A method that runs itself without a human in the inspect step is not the method.

## The shape of what the book has built

This is the chapter where all five components run together for the first time. Sponsorship detection (Chapter 7), liveness classification (Chapter 8), role quality (Chapter 9), timeline (Chapter 10), the composite scorer (Chapter 11) — each one producing a number with a labeled source, each number flowing into the oferta composite, each composite going into the run log as a traceable decision.

The engine is not complicated. It is thorough. The sophistication is not in the architecture; it is in the habit of inspection. You can run the whole sequence in under ten minutes for a single role. What takes discipline is doing the inspect step every time instead of shortcutting to the recommendation because the format looks familiar.

Running the engine produces decisions. A decision you can't reconstruct is one you can't learn from — and learning from the search is the subject of what comes next.

---

## Key terms

**Recipe** — a named operation the engine runs (`scan`, `pipeline`, `oferta`, `tracker`, `pdf`), declared in a markdown file that states the scripts it calls, the data it reads, and what it logs; the runtime lives in `recipes/`. Elsewhere in agentic AI these are called **skills** (for example, Claude's Agent Skills). This book calls them *recipes* on purpose: a recipe is a procedure you can audit step by step, not a capacity — and the word "skill" is already spoken for here. In Chapters 9 and 13, "skill" means the O*NET / labour-market sense: the competencies a role demands and a résumé claims. One word with two meanings is exactly the silent ambiguity the engine exists to kill.

**Active recipe** — a recipe that calls real scripts and reads real audits, so its output is a finding.

**Draft / helper recipe** — a scaffold not yet verified, on a given run, to call scripts and write a log; treat its output as model judgment until you confirm otherwise.

## Chapter 14 Exercises: Recipes — Operating the Engine

**Project:** Your Own Reallocation Engine

**This chapter adds:** the operating discipline — the run-inspect-record loop and the provenance check that lets you tell a finding (a recipe that called a script and read an audit) from a fluent guess wearing the engine's uniform, every single run.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Summarizing a recipe's output and the provenance you observed.** — *Why AI works here:* reformatting what you inspected; checkable against the run.
- **Drafting the `RUN_LOG.md` entry from the command and output you paste.** — *Why AI works here:* structured reformatting of facts you supply.
- **Explaining what a recipe declares it calls and reads.** — *Why AI works here:* it reads the recipe file with you; you confirm by running it.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the provenance: did the script run, is there an audit, can the number be traced?

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Deciding whether a run is finding-grade or judgment-grade.** — *Why AI fails here:* this is the inspect step — confirming a script was called and a number traces to a record; the output format looks identical either way, so the model can't certify its own provenance.
- **Trusting a recipe by its name.** — *Why AI fails here:* names are labels, behavior is evidence; a recipe called `oferta` that quietly became a chat prompt still says "oferta," and only inspection reveals the drift.
- **Concluding from a recommendation without tracing it.** — *Why AI fails here:* acting on a confident output because it looks right is the fluency trap reopened; the trace is yours to demand.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** in its purest form — the habit of inspecting provenance every run, refusing to let a familiar format substitute for evidence that the work was actually done.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a provenance verdict for your recipe runs — finding-grade vs. judgment-grade — and a reusable inspect checklist you apply before trusting any output.

**Tool:** Claude (claude.ai chat). You paste a recipe's output plus what you observed about its execution; chat helps you classify.

**The Prompt:**

```
Help me decide whether a recipe run is FINDING-grade (it called a script and read
an audit; its numbers trace to records) or JUDGMENT-grade (model output dressed in
the finding format). Do NOT assume provenance I don't give you — if I don't tell
you a script was called or an audit exists, say "cannot determine provenance — re-
run with inspection."

I will paste: the recipe's output, AND what I observed about the run (was a script
invoked? is there an audit file? can any number be traced to a record?).

1. Classify the run: finding-grade or judgment-grade, citing the SPECIFIC
   provenance evidence (or its absence).
2. For each number in the output, say whether it traces to a record, is a labeled
   model judgment, or is unsourced (the dangerous case).
3. Write me a reusable 5-item inspect checklist I can run on any recipe output
   before trusting it.
4. If judgment-grade: state plainly that this output is fine for drafting but must
   NOT drive an Apply/Skip decision.

--- PASTE RECIPE OUTPUT + WHAT I OBSERVED ABOUT THE RUN ---
[paste here]
```

**What this produces:** a provenance classification per run plus a reusable inspect checklist — the safety habit the chapter is built around.

**How to adapt this prompt:**
- *For your own project:* always paste what you actually observed (script called? audit present?). Without it, the honest answer is "cannot determine" — and the prompt will say so.
- *For ChatGPT / Gemini:* works as-is; both tend to assume provenance from a confident format — keep the "do not assume provenance" instruction.
- *For a Claude Project:* store the finding-vs-judgment definitions and the inspect checklist in the instructions.

**Connection to previous chapters:** this is Chapter 3's verified-data contract enforced at runtime, and Chapter 1's interrogation reflex applied to your own tooling.

**Preview of next chapter:** Chapter 15 reads the decisions this loop produces — the skip rate that tells you whether the whole method is operating or has quietly collapsed.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** a full operated run on a real role — scan → pipeline → oferta → verify — with provenance inspected at each step and a drift check on one recipe.

**Tool:** Claude Code. Running the recipe chain and inspecting provenance is the engine's core workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] `recipes/_shared.md` loads and the active recipes (`scan`, `pipeline`, `oferta`, `verify`) run.
- [ ] You have a real target role to operate on.
- [ ] You understand the inspect step is mandatory, not optional.

**The Task:**

```
Operate the engine on ONE real role and inspect provenance at every step. Do not
accept any recipe's output without showing me its provenance.

1. Run the chain: npm run ats:scan → the pipeline pass → oferta → npm run ats:verify.
2. At EACH step, report provenance: which script was called, which audit/output
   file was written, and which numbers trace to records vs. are labeled model
   judgment (fit). If a step shows no script call or no audit, STOP and flag it.
3. Produce the oferta recommendation with all four factors labeled by source.
4. DRIFT CHECK: pick one active recipe and confirm it actually invoked its script
   this run (not just produced plausible output). Show the evidence.
5. Append a RUN_LOG.md entry: the command chain, the recommendation with sources,
   and your finding-grade/judgment-grade verdict. Stop.
```

**Expected output:** a logged operated run with per-step provenance, a sourced recommendation, and a drift-check confirming the recipe really called its script.

**What to inspect in the output:** for the oferta result, can you trace the sponsorship number to an LCA/USCIS record and see fit labeled as judgment? For the drift check, is there actual evidence of a script call (an audit file, a row count) — or just confident output? The latter is the chapter's opening failure.

**If it goes wrong:** the failure that matters is a recipe producing finding-shaped output with no script call behind it. Recover by re-running with provenance logging on and confirming the audit exists; treat any untraceable number as model judgment, not a finding.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"No Apply/Skip decision rests on a recipe output whose provenance wasn't inspected this run; a recipe is trusted by its behavior (script called, audit present), never by its name."* This pins the loop's safety into the repo.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an `oferta` recommendation that looks exactly like a finding but never called the sponsorship pipeline — the chapter's opening failure, fluency in the engine's own uniform.

**Validation type:** Agentic output (provenance).

**Risk level:** High — it's indistinguishable from a real finding by format alone, so it's the easiest dangerous output to trust.

**Setup (pre-generated artifact — option b):** This chapter opens on exactly this failure, so validate this pre-generated recipe output:

> **oferta — Role evaluation (Atlas Bio).** Sponsorship: 0.88 (strong). Fit: 0.74.
> Liveness: live. Timeline: 0.9. Composite: 0.71 → APPLY. Each factor sourced;
> recommendation traceable. A clean, confident evaluation — proceed.
> *(Run provenance, on inspection: no sponsorship script was invoked this run; no
> LCA/USCIS audit file was written or read; the 0.88 was produced by the model's
> sense of a plausible biotech sponsorship probability. The output format is
> identical to a real finding.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Recipes: Operating the Engine

□ Correctness: Does the output's claim "each factor sourced" match the actual
  provenance (no script called, no audit)?
□ Completeness: Is there an audit file or row count behind the 0.88 sponsorship
  number, or only a confident format?
□ Scope: Did the recipe do verified work, or generate plausible output from
  priors?
□ Provenance check (chapter-specific): For each factor, can you trace it to a
  record this run? Which can you NOT?
□ Name-vs-behavior check (chapter-specific): It's called "oferta" — does that make
  it a finding? What's the actual evidence?
□ Failure mode check: Does this output exhibit any of the following?
  - Finding-shaped output with no script behind it (the chapter's opening failure)
  - Trusting a recipe by name rather than behavior
  - Fluent but wrong (a confident Apply with no provenance)
```

**What to do with your findings:**
- If the output passes all checks: act on it. (It will not — no script was called; it's judgment-grade.)
- If it fails one check: re-run the recipe with provenance confirmed before making any decision.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — treat the output as model judgment, useful for drafting, never for an Apply/Skip call.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — the inspect-every-run habit that catches the most dangerous output in the whole engine: the one that looks exactly like a finding and is built on nothing.
