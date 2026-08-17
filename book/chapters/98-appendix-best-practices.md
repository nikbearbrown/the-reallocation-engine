# Appendix: Best Practices for Running the Reallocation Engine

*A compact operating guide for humans and agents.*

The Reallocation Engine is both a book and a working agentic system. That means
its practices have to serve two readers at once. Agents need precise
instructions they can execute. Humans need to understand what the agents are
doing, what has been verified, where judgment enters, and when the system should
stop.

This appendix collects the rules that keep those two needs aligned.

## The Two Customers

Every operating artifact has two customers:

1. **Agents** that read recipes, scripts, data contracts, and gate definitions in
   order to execute work.
2. **Humans** who must understand what those agents do, why the workflow is
   safe, and when to intervene.

Recipes should be written primarily for agents, but each should begin
with a human-readable executive summary. The summary should explain what the recipe does, what evidence it uses, what risk remains, and what outcome to
expect.

The overall system should also be compiled into human-readable documentation:
`README.md`, `docs/repo-structure.md`, `docs/recipes.md`, `DATA_CONTRACT.md`, and
related guides. A human should not have to read every low-level recipe to
understand the engine.

## Repository Structure

Use structure by function:

- `README.md` — human-facing overview and architecture map.
- `CLAUDE.md` — Claude/Cowork operating rules.
- `AGENTS.md` — cross-agent operating rules.
- `docs/` — human-readable system documentation.
- `data/` — verified local data, exports, metadata, generated datasets, and
  audits.
- `scripts/` — tested, vetted, reusable automation.
- `recipes/` — agent-readable operating recipes with human-readable summaries.
- `chapters/` — manuscript content.
- `slides/` — optional teaching decks.
- `pantry/` — research notes, source notes, and reference material.
- `output/` — generated artifacts, not source of truth.

Use lowercase `scripts/`. Do not create or reference uppercase `SCRIPTS/`.

## Verified Data First

Before asking a model to infer facts or searching externally, check verified
local or database-backed evidence:

- source exports in `data/`;
- generated `*-audit.md` files;
- metadata and source manifests;
- maintained indexes;
- tracker files;
- stored reports;
- documented database exports.

External lookup is a fallback. Use it only when local verified data is missing,
stale, incomplete, or explicitly insufficient.

Never invent counts, rates, confidence, sponsorship status, role quality,
liveness, fit, coverage, or conversion rates. If the data is missing, say it is
missing.

## Vetted Scripts First

Treat scripts the same way the engine treats data. Preferred scripts should be
tested, vetted, stored, documented, and reused.

Before writing new code:

1. Search `scripts/`.
2. Read the relevant script README.
3. Check `package.json` for an existing npm command.
4. Use the stored script if it fits.
5. Create temporary code only when no stored script fits.
6. Promote reusable temporary code into `scripts/` after review.

One-off scripts are not forbidden. They are a fallback, not the first move.

## Phase Gates Before Automation

Automation is earned gate by gate. Do not run a fully automated pipeline just
because each individual step seems plausible.

The standard gate sequence is:

1. **Problem gate:** The thing being evaluated, generated, or changed is named.
2. **Local evidence gate:** Relevant local data, audits, and tracker files have
   been checked.
3. **Stored script gate:** Existing scripts and package commands have been
   checked.
4. **Small-run gate:** One narrow manual or semi-automated run succeeds.
5. **Verification gate:** A test, audit, output file, diff, or reviewer check
   proves the step worked.
6. **Review gate:** A human or independent reviewer checks high-risk outputs.
7. **Logging gate:** Meaningful runs, blockers, outputs, and changes are
   recorded.

If a gate has no failure path, it is not a gate. It is decoration.

![The standard gate sequence shown as seven sequential checkpoints before automation is earned — problem, local evidence, stored script, small run, verification, review, logging. Each gate has an explicit failure path branching off; a gate without one is decoration, not a gate.](../images/98-appendix-best-practices-fig-01.png)
*Figure 98.1 — The phase-gate sequence before automation*

## Recipe Rules

Every recipe should include:

1. executive summary;
2. required reads;
3. phase gates;
4. primary stored tools, or a statement that no stored script exists;
5. workflow;
6. output contract;
7. verification checks;
8. logging rules;
9. stop conditions.

A recipe should not say "automated" unless a maintained script or tested command
exists. Prefer "not implemented yet" over pretending the system can do more than
it can verify.

## Logging Rules

Use `logs/RUN_LOG.md` when a recipe:

- runs a script against real data;
- creates or updates an audit or report;
- changes tracker or pipeline state;
- finds a blocker;
- makes a decision about what not to use;
- creates a reusable generated artifact.

Log what happened, not private details. Do not log secrets, personal phone
numbers, private emails, or sensitive application notes.

## Output Rules

Every agent output should distinguish:

- verified facts;
- script outputs;
- local evidence;
- external sources;
- model inferences;
- missing data;
- human judgment.

The engine's most important sentence is still:

> Run the script and read the audit before you prompt.

The second sentence is now:

> If the script does not exist, say so before inventing one.

## Human Judgment

The Reallocation Engine can help students stop wasting effort. It cannot decide
what matters in a student's life. Human judgment remains responsible for:

- whether a role is worth a student's time;
- whether an evidence gap is acceptable;
- whether an output is honest;
- whether a recommendation serves the student's actual constraint;
- whether automation should stop.

The point of the engine is not to remove judgment. It is to move judgment to the
right place: after evidence, before action.
