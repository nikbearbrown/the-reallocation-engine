# Chapter 16 — The Build and the Honest Run
*You built a machine that is superhuman at execution precisely so you could spend your scarce attention on the questions it cannot reach.*

Think of an orchestra. Each musician can execute passages no conductor could play. But the conductor never touches an instrument. The conductor decides what the piece *means*, hears the wrong note before the score confirms it, and holds a hundred separate parts toward one intention. Remove the musicians and nothing gets played. Remove the conductor and you get a hundred fluent parts that don't add up to music.

That is the shape of building this engine. There is a part that belongs to the AI — scaffolding, schemas, scoring formulas, boilerplate, glue code, the structural logic of five components wired into one system. The AI is superhuman at this. Left to itself it produces clean, confident, internally consistent code in minutes. And there is a part that belongs to you: what your visa situation actually requires, whether the probability math makes sense given what you know, the domain knowledge the model cannot have, and the integration of five components into one system you will stake your job search — and your immigration status — on.[^boondoggle]

The whole book has been preparing you to be the conductor. This chapter is where you pick up the baton.

## How you build it

You don't ask the AI to "build a job-search engine." You conduct it through phases, each with a handoff condition — the precisely stated thing that must be true before the next phase begins.

**Phase one: foundation.** The directory layout, the data contract, the intake questions, the environment. The AI scaffolds the structure; you decide what your eight intake answers from Chapter 10 must constrain. These are first-class inputs, not setup trivia. Your OPT expiration date, your STEM eligibility, your field — the system that doesn't have those pinned is a system that can produce a confident recommendation about a role you can never legally start.

**Phase two: core skeleton.** The data structures and the five component stubs. The AI writes the schemas; you confirm they encode your situation. A schema that doesn't distinguish Proven from Likely sponsorship tiers, or that treats your timeline as a preference rather than a gate, is wrong in a way the AI cannot detect from the inside.

**Phase three: integration.** Wiring the five components into the composite scorer from Chapter 11 and the recipes from Chapter 14. The AI connects the pieces; you verify that liveness and timeline act as multipliers — gates that zero the score — and not as weighted votes. This is the class of error that will look exactly like correct behavior. The code will run. The numbers will be in a plausible range. Only you know that a role expiring before you can start shouldn't score "Consider."

**Phase four: full feature build.** The pipelines — SEC, ATS, BLS — the framing generator, the résumé renderer. The AI builds each component; you verify each against its real dataset. "The SEC pipeline returns company funding records" is a verification you can run. "The SEC pipeline looks complete" is not.

**Phase five: hardening.** Error handling, the verification scripts, the audit trail. The AI implements; you decide what "correct" means for your search and what must never fail silently. A recipe that stops calling its script and starts generating plausible output from the model's priors — the failure Chapter 14 opens with — is the thing hardening is designed to catch.

**Phase six: release.** The first real run.

![Six build phases in a left-to-right sequence — foundation, core skeleton, integration, full feature build, hardening, release. Each phase is split into an "AI executes" row and a "you verify" row, with a handoff condition between phases that must be stated precisely before proceeding.](../images/16-the-build-and-the-honest-run-fig-01.png)
*Figure 16.1 — Six phases, two rows: AI executes, you verify*

<!-- → [DIAGRAM: Six build phases shown as a left-to-right sequence with labeled handoff conditions between phases. Each phase split into two rows: "AI executes" (top) and "You verify" (bottom). The gap between phases labeled "handoff condition — must be stated precisely before proceeding." Caption: "A handoff you can't state precisely is a phase you haven't actually finished."] -->

The handoff condition is the most important element of the whole build. "The scan returns real postings with provenance" is a handoff condition. "It looks done" is not. The places where builds go wrong are almost always places where a phase ended on a feeling rather than a test.

## The boundary, made operational

I want to be precise about where the line is, because this is where the abstract principle from Chapter 1 — execution versus judgment — becomes a checklist you can actually run.

The model can verify that code is internally consistent. It cannot verify that the code is grounded in the specific reality you are building it for. It will produce a sponsorship formula that compiles and a timeline factor that returns a number; it cannot know whether the weights match your binding constraint or whether the dates are yours. So the moves that remain irreducibly yours:

**Plausibility auditing** — reading the output and asking "could this be right?" before trusting the verification. The composite came back 0.7 for a non-sponsor. Chapter 11 says the dominant term should collapse to near zero when P(sponsorship) ≈ 0. Does 0.7 make sense? It doesn't. Catch it before it propagates.

**Problem formulation** — deciding what the engine is for, and re-engaging it when an audit finding changes the shape of the problem. The model builds what you specify; you remain responsible for whether the specification was right.

**Interpretive judgment** — supplying the meaning the model can't. An "Unknown" sponsorship tier is a coverage gap in the dataset, not a verdict on the company. A skipped role had a connection the data never saw. A fit score of 0.72 might undersell you for a role where your unusual background is precisely what the team needs and no keyword captured it.

**Orchestration** — holding all of it toward one end: a job, landed in time, honestly.

| Give to the AI | Keep for yourself |
|---|---|
| Scaffolding and directory layout | Weight calibration |
| Schemas and data structures | Plausibility audits |
| Formula implementation | Unknown-tier interpretation |
| Boilerplate and glue code | Privacy and honesty calls |
| Documentation drafts | Final go/no-go on real decisions |
| Anything where correctness is checkable | Anything the model can verify only against itself |

*The test: can the model verify this against reality, or only against itself? If only against itself, it's yours.*

![Two columns. "Give to the AI": scaffolding, schemas, formula implementation, boilerplate, glue code, documentation drafts — anything checkable against reality. "Keep for yourself": weight calibration, plausibility audits, Unknown-tier interpretation, privacy and honesty calls, the final go/no-go — the things the model can verify only against itself.](../images/16-the-build-and-the-honest-run-fig-02.png)
*Figure 16.2 — Give to the AI vs. keep for yourself*

## The ethics gate

Before any first real run, two rules that are not optional:

**Privacy.** Your `data/ats/` files — applications, pipeline records, scan history — contain your real targets and real activity. Your environment may contain credentials. These files are private. Review for privacy and size before any commit, and never publish them. Building in public does not mean exposing your job search.[^privacy]

**Honesty.** Everything from Chapter 12 holds at the system level. Accurate framing, no fabricated credentials, no invented metrics, no misrepresented status. An engine that optimizes your search by shading the truth is the failure mode this book exists to prevent — fluency in the service of a false impression is still a false impression, and it is worse when it arrives in a polished format.

If a run would breach either gate, you don't run it. The ethics gate is the conductor's first responsibility, not an afterthought to the build.

## The first real run

Release is not a demo. It is the engine, running on your actual search:

```bash
# Stand up and verify the engine end to end
npm run ats:scan        # real postings from real companies
npm run ats:liveness    # classify them live/ghost
npm run ats:verify      # confirm pipeline data is consistent
# then: pipeline → oferta on real roles → tracker logs every decision
python scripts/ats/analyze-patterns.py   # skip rate + allocation summary
```

The output is a batch of real, logged decisions — Apply/Consider/Skip on actual roles, each factor sourced, each decision in the tracker, a skip rate you can read. Not a simulation. Not a walkthrough. The engine, applied to the search you are actually running.

When I ran the first batch, thirty roles came back with roughly 57 percent skipped. The Applies were concentrated in Proven and Likely tiers with beatable timelines. Each skip freed time that went toward the work no pipeline can do: reaching out, building the portfolio, following up on the connections the data never saw.

But before the batch ran, a plausibility audit caught something. A draft composite was treating the timeline factor as a weighted vote rather than a multiplier. A role that should have zeroed on the clock — the start date was past my OPT window — was scoring "Consider." The code ran. The number looked reasonable. It was wrong in exactly the way fluency hides: internally consistent, grounded in nothing.

Fixed. That is what plausibility auditing is for.

![Two panels for the same role past its OPT window. In the buggy panel, the timeline factor is treated as a weighted vote: strong sponsorship, fit, and liveness drag the composite up to about 0.70, scoring Consider — wrong but reasonable-looking. In the fixed panel, the timeline factor is a multiplier: the closed gate drives the composite to zero, scoring Skip. The code ran in both cases; only the audit caught the difference.](../images/16-the-build-and-the-honest-run-fig-03.png)
*Figure 16.3 — The gate-as-vote bug caught by plausibility audit*

![Horizontal bar chart of one sample batch of 30 roles broken down by outcome: Apply about 13 percent, Consider about 30 percent, Skip about 57 percent. The skip rate is the engine working, not failing — the time that doesn't go to ghost postings goes somewhere that matters.](../images/16-the-build-and-the-honest-run-fig-04.png)
*Figure 16.4 — First real run: 30 roles by outcome and tier*

<!-- → [CHART: Horizontal bar chart showing one sample batch: 30 roles broken down into Apply (approx. 13%), Consider (approx. 30%), Skip (approx. 57%). Bars color-coded by sponsorship tier (Proven, Likely, Unknown, Non-sponsor). Caption: "A first real run on 30 roles — the skip rate isn't failure, it's the engine working. The time that doesn't go to ghost postings goes somewhere that matters."] -->

## What the machine could not know

The engine knows what it measured: funding records, government filings, ATS postings, occupation demand curves, your dates. It could not know that the founder of a skipped startup is your former lab partner. It could not know that its own fit score missed the one project that makes you right for a role where no keyword in the description captured it. It could not know that you would thrive at a lower-scored job and burn out at a higher one. It could not know whether staking your search on its math is wise — that judgment was never in the data.

This is not a limitation to work around. It is the design. You built a system that handles everything it can handle — reliably, repeatably, at scale — so that your scarce human attention is available for the things it cannot. The conductor doesn't play every instrument. The conductor hears the whole.

## The return

Return to the polished artifact from Chapter 1 — the clean recommendation that arrived in three confident seconds. You know now what to do with it. Don't ask whether it is impressive. Ask what would have to be true for it to be trusted. Ask what the machine could not know. Ask what you are now responsible for once the decision leaves the screen.

That question — *what am I now responsible for?* — is the one the whole book was climbing toward. The engine answers the questions it can answer. Everything it cannot is yours: the judgment, the stakes, the account you will give for the decision.

The search is live. The clock is running. Begin.

---

## Chapter 16 Exercises: The Build and the Honest Run

**Project:** Your Own Reallocation Engine — *capstone*

**This chapter adds:** the whole thing — you conduct the phased build, run the ethics gate, execute the first honest run on your real search, and write the "what the machine could not know" account. This is where the running project becomes a working engine and a finished deliverable.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Scaffolding, schemas, glue code, and boilerplate across the build phases.** — *Why AI works here:* the AI is superhuman at execution where correctness is checkable against a test you run.
- **Drafting handoff conditions you then sharpen into testable statements.** — *Why AI works here:* it proposes; you convert "looks done" into "the scan returns real postings with provenance."
- **Generating documentation and a first draft of the monitoring protocol.** — *Why AI works here:* drafting against your real outputs, which you verify.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is: can the model verify this against reality, or only against itself? If checkable, give it to the AI.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **The four irreducibly human moves — plausibility auditing, problem formulation, interpretive judgment, orchestration.** — *Why AI fails here:* the model verifies code against itself, not against your reality; only you can ask "could this be right?" and hold the whole toward one end.
- **The ethics gate — privacy and honesty.** — *Why AI fails here:* whether a run would expose your private search or shade the truth is a values call the model cannot make and should not be trusted to enforce.
- **The final go/no-go on real decisions and on whether the weights match your binding constraint.** — *Why AI fails here:* this is the conductor's accountability — the consequence (your job, your status) is yours to bear, so the decision is yours to make.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This capstone trains **Tier 4 + Tier 6 + Tier 7 together** — metacognitive plausibility audits, executive integration of five components into one system, and the wisdom to own the stakes and the ethics gate. The conductor doesn't play the instruments; the conductor hears the whole and is accountable for the performance.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** your "what the machine could not know" account for your real search, plus a plausibility-audit checklist grounded in your actual runs — the honest description of residual uncertainty that closes the project.

**Tool:** Claude (claude.ai chat). You supply your real engine outputs; chat helps you articulate the account.

**The Prompt:**

```
Help me write two things for my job-search engine. Use ONLY what I paste about my
real runs; do not invent decisions, companies, or outcomes.

I will paste: a sample of my engine's outputs (scored roles, tiers, skip rate,
some Apply/Skip decisions).

1. "WHAT THE MACHINE COULD NOT KNOW" — an honest account for MY search:
   - What the engine actually measured (name the data sources).
   - What it structurally cannot know (private connections, fit it missed,
     present-tense sponsorship beyond the record, whether I'd thrive vs. burn out,
     whether staking the search on its math is wise).
   - What I am now responsible for that the data never touched.
   Write it specific to my outputs, not generic.

2. A PLAUSIBILITY-AUDIT CHECKLIST I run before trusting a batch: concrete "could
   this be right?" questions tied to known failure modes — e.g. a non-sponsor
   scoring Apply, a gate behaving as a vote, a stale-cache posting, an unsourced
   number in a finding-shaped output.

Do not reassure me the engine is trustworthy; help me state precisely where it
is and isn't.

--- PASTE A SAMPLE OF MY ENGINE OUTPUTS BELOW ---
[paste here]
```

**What this produces:** the project's closing artifact — a search-specific "what the machine could not know" account and a reusable plausibility-audit checklist.

**How to adapt this prompt:**
- *For your own project:* paste your real outputs. A generic account is worthless; the value is in naming what *your* engine missed.
- *For ChatGPT / Gemini:* works as-is; both drift toward reassurance — keep the "do not reassure me" instruction.
- *For a Claude Project:* store the four human moves and the ethics gate so the account stays honest.

**Connection to previous chapters:** this is Chapter 1's founding charter ("what the machine cannot know") returning as a finished, evidenced account — the book's arc closing on itself.

**Preview of next chapter:** there is no next chapter — this is the capstone. What follows is the search, run for real, on the engine you built.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** the engine itself, conducted through the six phases with stated handoff conditions, and the first honest run producing a logged batch of real Apply/Consider/Skip decisions with a readable skip rate — after the ethics gate passes.

**Tool:** Claude Code. Conducting a phased build and running the full engine end to end is the capstone agentic workflow.

**Skill level:** Advanced — integrates every prior chapter.

**Setup:**

Before running this exercise, confirm:
- [ ] All five components and their recipes exist from Chapters 6–14.
- [ ] Your eight intake answers (Chapter 10) are pinned in config.
- [ ] `data/ats/` is private and git-ignored (Chapter 15 privacy rule).

**The Task:**

```
Conduct the engine build and the first honest run. State a testable handoff
condition before advancing each phase; do not proceed on "looks done." Do not run
anything that would breach privacy or honesty.

1. PHASES 1–3 (foundation, skeleton, integration): scaffold/confirm structure,
   schemas, and wiring. HANDOFF CHECK at integration: prove liveness and timeline
   act as MULTIPLIERS (a closed gate zeros the composite) — show the test output.
2. PHASES 4–5 (feature build, hardening): verify each pipeline against its real
   dataset; confirm recipes call scripts and write audits (no finding-shaped
   output without provenance).
3. ETHICS GATE (before any real run): confirm (a) no data/ats/ file is staged for
   commit, and (b) no generated framing/résumé content misrepresents status or
   invents metrics. If either fails, STOP — do not run.
4. PLAUSIBILITY AUDIT: take 3 scored roles and check each factor's contribution
   makes sense (e.g. a ~0 sponsorship must collapse the composite). Flag and fix
   any gate-as-vote bug.
5. HONEST RUN: scan → liveness → verify → pipeline → oferta on real roles →
   tracker logs every decision → analyze-patterns.py. Report the batch
   (Apply/Consider/Skip counts) and the skip rate.
6. Append a RUN_LOG.md entry: handoff conditions met, the plausibility-audit catch
   (if any), the batch, the skip rate. Keep private names out of shareable files.
   Stop.
```

**Expected output:** a built engine with logged handoff conditions, a passed ethics gate, a plausibility-audit record, and a first honest run — a real batch of decisions with a skip rate.

**What to inspect in the output:** confirm the integration handoff actually proved the gate behavior (the chapter's named build bug is a gate acting as a vote). Confirm the ethics gate ran *before* the real run, not after. Read the batch: is the skip rate in the working range (≥50%), and does every Apply trace its factors?

**If it goes wrong:** the highest-stakes failure is the build "running" with a gate silently acting as a weighted vote — a role past your OPT window scoring Consider. Recover exactly as the chapter does: catch it in the plausibility audit, fix the multiplier, re-run. And if the ethics gate fails, do not run at all until it passes.

**CLAUDE.md / AGENTS.md note:** add the capstone standing rule — *"No phase advances without a testable handoff condition; the ethics gate (privacy + honesty) runs before every real run and a failure blocks the run; every batch gets a plausibility audit before its decisions are trusted."* This is the conductor's operating contract.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** a "completed build + first run" report that passes its own internal checks but hides a gate-as-vote bug and skipped the ethics gate — the capstone failure that looks like success.

**Validation type:** Agentic output (build + run report).

**Risk level:** High — it ships an engine that recommends legally-impossible roles and may have leaked private data.

**Setup (pre-generated artifact — option b):** This capstone's lessons are plausibility auditing and the ethics gate, so validate this pre-generated report:

> **Build complete — first run report.** All six phases done; all internal tests
> pass; code is clean and consistent. First run: 30 roles → 14 Apply, 9 Consider,
> 7 Skip (23% skip rate). Top recommendation: Role A (MegaCorp), composite 0.64,
> APPLY — strong sponsorship and fit. The build committed all project files to the
> repo for backup, including the applications tracker, so nothing is lost.
> *(Not surfaced: Role A's expected start is 5 months out; the candidate's OPT ends
> in 4 months — the timeline factor was added as a weighted term, not a multiplier,
> so the role didn't zero out. And data/ats/applications.md was committed.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — The Build and the Honest Run

□ Correctness: "All internal tests pass" — but does the engine verify against
  REALITY or only against itself? What did the tests not check?
□ Completeness: Was a plausibility audit run? Does a 0.64 Apply for a role past
  the OPT window make sense?
□ Scope: Did the build respect the ethics gate, or did it commit private
  data/ats/ files?
□ Gate check (capstone): Is the timeline acting as a multiplier (zeros an
  impossible role) or as a weighted vote (the chapter's named build bug)?
□ Ethics-gate check (capstone): Privacy — were private files committed? Honesty —
  any misrepresentation in generated materials?
□ Skip-rate check (capstone): Is 23% a healthy filter or a collapsed one
  (Chapter 15)?
□ Failure mode check: Does this output exhibit any of the following?
  - Gate-as-vote (an impossible role scoring Apply/Consider)
  - Ethics-gate skipped (private data committed)
  - Fluent but wrong (a confident "build complete" hiding two critical failures)
```

**What to do with your findings:**
- If the report passes all checks: ship it. (It will not — gate-as-vote bug, committed private data, collapsed skip rate.)
- If it fails one check: fix that failure and re-run the relevant phase before trusting the batch.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — run the plausibility audit and the ethics gate yourself; do not ship the engine until both pass.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This capstone validation trains **Tier 4 + Tier 7 together** — the plausibility audit that catches a fluent-but-ungrounded build, and the accountability to enforce the ethics gate before a real run. The engine handles execution; the conductor is responsible for whether the performance was right, and honest, and safe to run at all.

[^boondoggle]: The conductor model — Gru (human orchestration) / Minion (exact AI prompts), the Boondoggle Score, plausibility auditing, and the handoff condition — from `projects/the-reallocation-engine-boondoggle-score.md` and "Boondoggling: You Are the Conductor" (N. Bear Brown).

[^privacy]: Privacy constraint on `data/ats/applications.md`, `pipeline.md`, and scan history (review privacy and size before committing; never publish) from `DATA_CONTRACT.md` (TIKTOC Risk 1 — BLOCKER for any public build).
