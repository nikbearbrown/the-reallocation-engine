# The Reallocation Engine — Restructure Plan

*Response to: "it reads poorly… skills should be skills… two customers… a verification chapter… computational-skepticism-for-ai as a source."*

---

## Diagnosis — why it "reads poorly"

It isn't the sentences. Chapters 3 and 12 are well-written — strong voice, concrete. What reads poorly is **conceptual scaffolding that is half-built**, in three specific ways:

1. **The core mechanism is missing.** Chapter 3 ("The Verified-Data Contract") sells the *rule* — never invent a count; scripts are the source of truth — but never explains the behavior that makes the rule cheap to keep: **the tool downloads and verifies data once, caches it locally, and only goes to the network when local verified data is absent or stale.** That cache-first/fetch-if-missing loop is the thing a reader needs to picture, and it isn't there.

2. **The word now fits the ecosystem.** The book calls its agentic recipes **skills**: named operations that declare what scripts they call, what data they read, and what they log. That is the term most people have settled on for an agentic recipe, and the repository now follows it.

3. **The "what is a skill" foundation is absent.** A skill has **two customers** — the AI that executes it and the human who maintains it — and the book never says so. Nor does it separate "the data is *real*" (the contract) from "the data is *trustworthy and rightly measured*" (verification). Those are two different jobs and right now they're smeared across one chapter and a closing aside.

The fix is structural, not cosmetic.

---

## Proposed structure — two parts, 16 chapters

Split the spine so the **method** is fully built before the **tools** begin.

### PART ONE — Principles & Method (Ch 1–5)
| # | Chapter | Change |
|---|---------|--------|
| 1 | The Fluency Trap | unchanged |
| 2 | The Reallocation Principle | unchanged |
| 3 | The Verified-Data Contract | **EDIT** — add the cache-first / fetch-if-missing / verify-on-download mechanism; update forward-refs |
| 4 | **Two Customers: Writing a Skill for the AI and the Human** | **NEW** |
| 5 | **Verifying the Data** | **NEW** — sourced from *computational-skepticism-for-ai* |

### PART TWO — The Engine (Ch 6–16)
| new # | old # | Chapter |
|------|------|---------|
| 6 | 4 | Where the Money Went — SEC Form D |
| 7 | 5 | Who Sponsors — the 80-Days Sponsorship Scorer |
| 8 | 6 | Is the Job Real — ATS Detection and Liveness |
| 9 | 7 | Is the Role Any Good — BLS/O*NET Role Quality |
| 10 | 8 | The Visa Timeline Manager |
| 11 | 9 | The Bayesian Role Scorer |
| 12 | 10 | The OPT Framing Generator |
| 13 | 11 | Résumés That Survive the Filter |
| 14 | 12 | **Skills: Operating the Engine** |
| 15 | 13 | The Pipeline Tracker and the Skip Rate |
| 16 | 14 | The Build and the Honest Run |
| 97 | 97 | Fundamental Themes (unchanged number) |
| 99 | 99 | Back Matter |

This reframes Chapters 1–5 as *principles and method* and 6–16 as *tools and operation* — which is the structural answer to "reads poorly." It also means every Part Two tool chapter is, explicitly, "a skill with two customers," because Ch 4 taught that first.

---

## The four changes, specified

### 1. Edit Chapter 3 — add the missing mechanism
Insert a section (after "What the system actually measures") that explains the data lifecycle the contract actually runs on:

> A verification tool checks for **local verified data** first. If it is present and fresh, the tool reads it and does **not** touch the network — the audit notes "served from cache." Only when local verified data is **absent or stale** does the tool go fetch, **verify on arrival** (schema, counts, source provenance), write it to the local store, and log the fetch. The network is the fallback, not the default.

Why it matters: it makes the contract *operational* (not just a prohibition), it explains why runs are fast and reproducible, and it sets up "served from cache vs. fetched" as something the audit reports. Then fix the forward-references at the chapter's end (currently "Chapter 4/5/6 builds…" → must become "Chapter 6/7/8 builds…").

### 2. Skills are the agentic recipes
The repository now uses `skills/` for the agentic recipes (`_shared.md`, `pipeline.md`, `oferta.md`, `scan.md`, …). The clean convention is:
- prose: use "skill" wherever the meaning is an agentic recipe (never inside "failure mode");
- chapter file: use `14-skills-operating-the-engine.md`;
- directory references: use `skills/` in prose, scripts, and project specs.
- one sentence of disambiguation in Ch 14 (new): a *project skill* here is a repo recipe; not to be confused with an installable Cowork/Claude Skill — same idea, different scope.

### 3. New Chapter 4 — Two Customers
The load-bearing new idea: a skill is written **twice, for two readers**.
- **The AI artifact** — the executable recipe: what scripts to call, what data to read, what to log, the contract it loads, its stop conditions. Terse, imperative, machine-actionable.
- **The human artifact** — a readable doc: *what it does, its dependencies, how to run it, what it produces, and how it fails.* This is the maintenance surface.
- They must stay in sync; drift between them is its own failure mode. Worked example: the `scan` skill shown both ways — the recipe the AI runs and the human-readable card a maintainer reads six months later.

### 4. New Chapter 5 — Verifying the Data
Distinct from Ch 3 on purpose. Ch 3 guarantees a number is **real** (it came from a record). Ch 5 asks whether it is **trustworthy and rightly measured**: coverage, name-matching failures, freshness, the epistemic frame behind the dataset, and calibrating a claim to its evidence. This is where *computational-skepticism-for-ai* does the most work (its Ch 5, "Data validation: reconstructing the epistemic frame behind a dataset," is almost a direct prerequisite).

---

## computational-skepticism-for-ai → per-chapter source map

That book is a strong, directly-relevant source. The highest-value lifts:

| Reallocation chapter | Skepticism source chapter(s) |
|---|---|
| 3 Verified-Data Contract | 12 Communicating uncertainty; 14 Limits of AI |
| **5 Verifying the Data (NEW)** | **5 Data validation (epistemic frame); 2 Probability & the confidence illusion** |
| 4 Two Customers (NEW) / 14 Skills | 9 Validating agentic AI; 10 Delegation, trust, supervisory role |
| 7 Sponsorship Scorer · 9 Role Quality | 3 Bias: where it enters; 7 Fairness metrics |
| 8 ATS Detection & Liveness | 8 Robustness (a pixel can break the model) → name-match/edge fragility |
| 11 Bayesian Role Scorer | 2 Probability & uncertainty; 6 Explanation vs. appearance of explanation |
| 16 The Build and the Honest Run | 13 Accountability; 4 The frictional method (evidence of learning) |
| infographics/diagrams throughout | 11 Visualization under validation |

I can do a full `/bookmap`-style mine of that book for line-level suggestions per chapter as a follow-up — this table is the fast version.

---

## Cross-references to fix on renumber (don't let them drift)
- Ch 3 closing: "Chapter 4/5/6 builds…" → 6/7/8.
- Every "Chapter N" reference in the Part Two tool chapters (Bayesian scorer cites the four factors; tracker cites the scorer; build cites everything) — each shifts +2.
- `TIKTOC.md`, `CHAPTER-RESEARCH-MAP.md`, `outline.md`, and the `skills/` files' chapter citations.
- The exercises and bridge questions that name the next chapter by number.

This is mechanical but extensive; I'd script the renames and then grep-verify every "Chapter \d+" reference resolves.

---

## Open decisions (yours)
1. **Two new chapters, or fold:** keep Two Customers (Ch 4) and Verifying the Data (Ch 5) as separate chapters, or fold Two Customers into the Skills chapter and add only Verifying as new (less renumber churn)?
2. **Skepticism depth:** the source-map table above, or a full `/bookmap` deep-mine of computational-skepticism-for-ai first?
