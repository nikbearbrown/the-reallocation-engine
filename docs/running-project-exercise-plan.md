# Running-Project Exercise Plan — *The Reallocation Engine*

*Step 1 (Chapter Map) + Step 2 (Project Options) of the five-part exercise generator. Step 3 (the per-chapter exercise blocks) is generated only after a project is selected.*

## Series tier taxonomy (from Ch.97)
Tier 4 = metacognitive / plausibility audit · Tier 5 = causal / identification · Tier 6 = collective / executive integration · Tier 7 = wisdom / values & accountability. The book's spine is **Tier 4** (every chapter ends on a "what the machine could not know" move); Tier 5 owns the data-trust chapters; Tier 7 owns the chapters where the binding constraint is the reader's own stakes.

## Chapter Map

| Ch | Title | Core concepts | New capability | Tier |
|----|-------|---------------|----------------|------|
| 1 | The Fluency Trap | execution vs judgment; comprehension debt; interrogate vs delegate | spot fluent-but-unchecked output; reason about the OPT clock | 4 |
| 2 | The Reallocation Principle | search as resource-allocation; 3-3-2 day; skip as action | defend a time allocation by expected return; override a default | 7 (+4) |
| 3 | The Verified-Data Contract | true≠fluent; one-rule contract; verify-then-cache | enforce "run the script, read the audit, then prompt"; run `ats:verify` | 4 |
| 4 | Two Customers | every recipe has two customers; write it twice; drift | author an AI recipe + a human card; write failure modes | 4 |
| 5 | Verifying the Data | real≠right-measured; 6-step interrogation; base rates + verbs | "why exactly N rows?"; calibrate; assign warranted verbs | 5 (+4) |
| 6 | Where the Money Went (SEC Form D) | funding recency as hiring signal; raw/extracted/processed; size×recency | run the SEC pipeline; resolve a failed domain inference | 4 (+5) |
| 7 | Who Sponsors (Sponsorship Scorer) | record outranks reputation; weighted tiers; Unknown≠Avoid | compute a tier; read join-coverage before trusting Unknown | 5 (+4) |
| 8 | Is the Job Real (ATS & Liveness) | a posting can lie; ghost detection ≡ spam filtering; 5 signals | detect the ATS; run zero-token scans + liveness; classify | 4 (+5) |
| 9 | Is the Role Any Good (BLS/O*NET) | title is marketing, SOC is the job; model proposes, data confirms | build the compact table; verify a SOC vs alternate titles | 4 |
| 10 | The Visa Timeline Manager | the clock is a gate not a tiebreaker; multiplier zeroes the composite | compute a timeline factor; know the DSO/lawyer line | 7 (+4) |
| 11 | The Bayesian Role Scorer | composite = votes × gates; fit is a labeled judgment; auditability | score a posting term-by-term; run the documented Override | 4 (+7) |
| 12 | The OPT Framing Generator | disclose by audience tier; strategic truth, never misrepresentation | write tier-calibrated framing; find the fraud line | 7 |
| 13 | Résumés That Survive the Filter | first reader is a parser; ATS-safety is a floor; paste test | render `resumes:pdf`; run the paste test; diagnose failures | 4 |
| 14 | Recipes — Operating the Engine | run-inspect-record; active vs draft (evidence not name); drift | operate `scan→pipeline→oferta→verify`; inspect provenance | 4 |
| 15 | Pipeline Tracker & Skip Rate | skip is a logged decision; target ≥50%; process vs outcome metric | log every decision; compute/diagnose the skip rate | 4 (+7) |
| 16 | The Build and the Honest Run | conductor/orchestra; phase gates; the four human moves; ethics gate | conduct a phased build; run a plausibility audit; honest run | 4+6+7 capstone |
| 97 | Fundamental Themes | Frictional; phase gates; the seven-tier taxonomy; AI+1 market | tag any task by tier; locate the Tier-1 / Tier-4–7 boundary | meta |

## Project Options (pick one)

**Option 1 — Your Own Reallocation Engine.** Fork the repo and, chapter by chapter, configure + run each component against your *own* target list until you have a live, logged, end-to-end engine. *Deliverable:* a batch of sourced Apply/Consider/Skip decisions with ≥50% skip rate in `RUN_LOG.md`, an ATS-safe résumé, and a "what the machine could not know" account. *Tool path:* Claude Code / Cowork runtime + Claude chat for interrogation. *Most hands-on; strongest fit to the book's own narrative; needs Claude Code.*

**Option 2 — The Company Dossier.** Pick one real target company in week one; accrete one verified layer per chapter into a single living dossier (funding → sponsorship → liveness → role quality → timeline → composite → framing → résumé). *Deliverable:* one complete, fully-sourced dossier. *Tool path:* Claude Project (dossier + audits as knowledge) + Claude Code for runs. *Lowest-friction; safest for a mixed cohort.*

**Option 3 — The Skeptic's Audit.** Build an audit artifact: run each component and document where it can be fooled — base-rate checks, a reproduced failure (name-match artifact, fresh-but-fake posting, gate-as-vote bug), and a proposed fifth check the chapter didn't supply. *Deliverable:* an "honest ceiling" report. *Tool path:* Claude Code to break the pipelines + Claude chat for the adversarial/Bayes reasoning. *Most intellectually demanding; best for a quantitative/skeptical cohort.*

**Option 4 — The Conductor's Score.** Conduct the AI to *add* one new verified component the repo doesn't fully have (a `refresh` recipe, a real `role_quality` weight, a programmatic ATS checker), using phase gates and handoff conditions. *Deliverable:* a new active recipe + script with two-customer docs, a logged run, and a Boondoggle-style Minion/Gru score. *Tool path:* Claude Code build + Claude Project holding the handoff conditions. *Most technical; best for a CS/data-heavy cohort.*

---
*Selected project: ____ (fill in, then Step 3 generates the five-part block — When to Use AI · When NOT to Use AI · LLM · CLI · AI Validation — at the bottom of every chapter file.)*
