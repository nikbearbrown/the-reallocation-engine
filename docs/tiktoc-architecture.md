# The Reallocation Engine
## Tik TOC Architecture

**Working title:** The Reallocation Engine: Verified Data, Agentic Recipes, and the Job Search Judgment Layer  
**Repository:** `books/the-reallocation-engine`  
**Source adaptation:** Existing manuscript chapters in `chapters/` plus the generic Claude agentic coding/supervision book in `pantry/claude-agentic-ai.md`  
**Document:** Tik TOC silent intake and chapter architecture  
**Status:** Architecture draft for manuscript alignment, chapter repair, and production planning  

---

## 1. Book Concept and Thesis

### Concept Summary

The Reallocation Engine is a book and working repository for a verified,
AI-assisted job-search system. It teaches a reader, especially an international
student working against an OPT/STEM OPT clock, how to stop treating job search
as an application-volume problem and start treating it as a resource-allocation
problem.

The engine automates the parts of the job search that can be grounded in
records, scripts, and audits: sponsorship evidence, funding evidence, ATS
liveness, role quality, visa timeline, resume generation, tracker maintenance,
and outcome-pattern analysis. It preserves the human decisions that cannot be
delegated: whether the role is worth a day, whether the evidence warrants the
claim, whether the output is honest, and whether the system is serving the
student's real constraint.

### One-Sentence Logline

AI makes applying cheaper, but the scarce recipe is deciding where not to apply.

### Central Thesis

This book argues that the highest-leverage job-search decision is not how to
generate more applications, but how to reallocate scarce time toward roles,
companies, channels, and artifacts where evidence says effort can matter. For
an international student, a perfect-fit role at a company that does not sponsor
is not a strong opportunity. A fluent AI answer without verified sponsorship,
liveness, role-quality, and timeline evidence is not intelligence. The engine
exists to make Apply / Consider / Skip decisions inspectable.

### Adaptation From Claude Agentic AI

The generic Claude agentic AI book contributes the operating discipline:

- agentic work is supervised delegation, not autonomous replacement;
- every workflow needs scope, approval, and verification;
- tools and permissions expand both capability and risk;
- plans are proposals, not proof;
- humans remain accountable for judgment and public-facing outputs.

The Reallocation Engine adapts that discipline to the job search:

- **Scope** becomes target roles, sponsorship constraints, source datasets,
  pipeline files, resume inputs, and permitted automation.
- **Approval** becomes human review before applying, messaging, submitting,
  rewriting credentials, committing private tracker data, or scaling a batch.
- **Verification** becomes script output, audits, liveness checks, source
  provenance, tracker normalization, resume extraction checks, and run logs.

The result is a book about agentic career operations: not "let AI apply for
you," but "build a verified system that helps you spend effort where evidence
supports effort."

---

## 2. Learner Profile

### Primary Reader

A graduate international student on F-1 OPT or STEM OPT, usually in a STEM or
technical-adjacent field, who is spending hours applying to poorly filtered
roles while a work-authorization clock runs down.

This reader is not failing because they lack talent. They are failing because
they are solving the wrong problem: increasing output volume instead of
improving target selection.

### Prior Knowledge Assumed

- Basic file literacy: can read Markdown, CSV, JSON, and folder structures.
- Basic command-line comfort: can run `npm run ...` or `python3 script.py` when
  given exact commands.
- Familiarity with their own visa status, timeline, target roles, and resume.
- Basic comfort using AI assistants.

### Prior Knowledge Not Assumed

- Python or JavaScript authorship.
- Immigration law expertise.
- SEC Form D or DOL/H-1B data expertise.
- BLS/O*NET/SOC classification.
- ATS provider internals.
- Bayesian statistics.
- Agentic AI architecture.

### Misconceptions the Book Must Correct

1. "More applications means more chances." More applications to the wrong
   employers waste the only resource that cannot be replenished: time.
2. "A famous company is safer." Brand recognition is not sponsorship evidence.
3. "If the posting exists, the job is real." A job URL is not proof of liveness.
4. "The AI's confident answer is the answer." Fluency is not correctness.
5. "Mentioning OPT always hurts." Framing depends on role, employer, timing,
   and what can be honestly claimed.
6. "A resume PDF is done if it looks good." Parser survival is the test.
7. "Skip is failure." Skip is a successful action when evidence says effort
   should be reallocated.

---

## 3. Book Type and Deployment

### Primary Book Type

Practitioner handbook with course-textbook utility.

### Primary Deployment Context

A single reader at a terminal, using the repository as a working engine while
conducting a real job search. The chapters teach the method; `scripts/` and
`recipes/` run the engine; `data/` and audits preserve evidence; the tracker
turns outcomes into learning.

### Secondary Deployment Context

Graduate courses, applied AI labs, career-services intensives, and workshops on
international-student career strategy, verified data systems, or agentic AI for
personal operations.

### Terminal Capability

By the end of the book, the reader can:

- inspect local source data and audits;
- run maintained scripts instead of inventing prompt-only answers;
- use recipes as operating recipes;
- evaluate a role through sponsorship, funding, liveness, role quality, resume
  fit, and timeline constraints;
- produce honest OPT framing;
- generate ATS-safe resume artifacts;
- maintain an application tracker;
- analyze skip rate and outcome patterns;
- complete an honest run with a clear audit trail.

---

## 4. Repository-Specific Grounding

This Tik TOC is grounded in the active repository.

### Book Layer

- `chapters/00-introduction.md`: frames execution vs. judgment.
- `chapters/01-the-fluency-trap.md`: polished output is not proof.
- `chapters/02-the-reallocation-principle.md`: job search as expected-return
  allocation.
- `chapters/03-the-verified-data-contract.md`: records and audits before
  prompts.
- `chapters/04-two-customers.md`: recipes serve agents and humans.
- `chapters/05-verifying-the-data.md`: coverage, base rates, calibration, and
  warranted verbs.
- `chapters/06-where-the-money-went-sec-form-d.md`: funding evidence.
- `chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md`: sponsorship
  evidence.
- `chapters/08-is-the-job-real-ats-detection-and-liveness.md`: ATS and liveness.
- `chapters/09-is-the-role-any-good-bls-onet-role-quality.md`: BLS/O*NET role
  quality.
- `chapters/10-the-visa-timeline-manager.md`: OPT/STEM/H-1B timing gates.
- `chapters/11-the-bayesian-role-scorer.md`: composite role scoring.
- `chapters/12-the-opt-framing-generator.md`: honest OPT framing.
- `chapters/13-resumes-that-survive-the-filter.md`: ATS-safe resumes.
- `chapters/14-recipes-operating-the-engine.md`: recipe runtime.
- `chapters/15-the-pipeline-tracker-and-the-skip-rate.md`: tracker and skip
  rate.
- `chapters/16-the-build-and-the-honest-run.md`: integrated run.
- `chapters/97-fundamental-themes.md`: synthesis.
- `chapters/98-appendix-best-practices.md`: operational appendix.

### Data Layer

- `DATA_CONTRACT.md`: source, generated, book, and private data boundaries.
- `data/80-days-to-stay/`: sponsorship and company material.
- `data/sec/form-d/`: SEC Form D raw, extracted, and processed data.
- `data/bls/`: BLS/O*NET/OEWS role-quality data.
- `data/ats/`: ATS scans, pipeline files, tracker files, scan history, and
  generated pattern reports.

### Script Layer

- `scripts/sec/`: SEC Form D pipeline.
- `scripts/ats/`: ATS scanning, liveness, tracker, and pattern analysis.
- `scripts/bls/`: SOC/O*NET/OEWS extraction.
- `scripts/resumes/`: Markdown CV to ATS-safe PDF.
- `scripts/audit-sec-dol-h1b-data.py`: sponsorship/funding audit.

### Recipe Layer

Active operating recipes:

- `recipes/_shared.md`
- `recipes/scan.md`
- `recipes/pipeline.md`
- `recipes/oferta.md`
- `recipes/tracker.md`
- `recipes/pdf.md`
- `recipes/patterns.md`
- `recipes/update.md`

Draft/helper recipes include `apply.md`, `auto-pipeline.md`, `batch.md`,
`contacto.md`, `deep.md`, `followup.md`, `interview-prep.md`, `latex.md`,
`ofertas.md`, `project.md`, and `training.md`.

### Operating Rule

The engine's short rule is load-bearing:

**Run the script and read the audit before you prompt; never invent a count,
rate, match quality, confidence, or coverage number.**

---

## 5. Field Positioning

### Comparable Categories

**General job-search books** teach networking, targeting, interviewing, and
mindset, but usually assume a domestic reader and manual prioritization.

**International-student career guides** explain visa categories and job-search
constraints, but rarely provide a verified-data engine for role triage.

**AI career tools** produce resumes, cover letters, and applications, but often
accelerate execution without improving judgment.

**Agentic AI books** explain tools, permissions, planning, approval, and
verification, but usually work through coding or knowledge-work examples rather
than a real job-search operating system.

### Positioning Statement

The Reallocation Engine is a verified-data career operations handbook for
readers whose job-search constraint is too serious to leave to fluent output,
brand-name intuition, or application volume.

---

## 6. Three-Act Learning Arc

### Act One - Judgment Before Automation

The reader learns why fluency is dangerous, why effort must be reallocated, why
data claims need contracts, and why recipes serve both agents and humans.

**Chapters:** 1-5  
**Capability at end of act:** The reader can distinguish model judgment from
verified data, read a recipe card, and state what the engine can and cannot
decide.

### Act Two - Build the Evidence Components

The reader builds the domain components: funding evidence, sponsorship scoring,
ATS liveness, role quality, visa timing, composite scoring, OPT framing, and
resume survivability.

**Chapters:** 6-13  
**Capability at end of act:** The reader can evaluate a real role through the
engine's evidence components and produce an honest Apply / Consider / Skip
recommendation for human review.

### Act Three - Operate the Engine

The reader runs recipes, maintains the pipeline tracker, monitors skip rate,
learns from outcomes, and performs the first honest run.

**Chapters:** 14-16 plus Chapter 97  
**Capability at end of act:** The reader can operate the system without
confusing automation with accountability.

### Arc Statement

This book takes the reader from spray-and-pray job search to verified career
operations by first exposing the fluency trap, then building data-grounded
decision components, then operating the full engine with logs, audits, and
human judgment.

---

## 7. Sequencing Model

**Primary model:** Problem -> Contract -> Evidence Components -> Scoring ->
Operation  
**Secondary model:** Concrete -> abstract with spiral returns

The sequence is pedagogically strong because the learner encounters the failure
mode before the fix. The book does not begin with scripts. It begins with the
reason scripts are needed: fluent output can be wrong, and wrong effort
allocation has high cost.

Spiral returns:

- **Fluency vs. correctness** returns in data verification, ATS liveness, resume
  extraction, and the honest run.
- **Scope** returns as data scope, script scope, recipe scope, role scope,
  timeline scope, and batch-automation scope.
- **Approval** returns as human review before Apply / Consider / Skip,
  outreach, resume submission, tracker commit, and batch scaling.
- **Verification** returns as audits, row counts, liveness checks, parser
  checks, tracker normalization, and pattern analysis.
- **Reallocation** returns as skip, portfolio work, networking, project
  building, and post-run learning.

---

## 8. Chapter-by-Chapter TOC

## Introduction - The Work AI Did Not Make Cheap

**Capability built:** Understand the book's problem, reader, and operating
method.

The introduction frames the difference between execution and judgment. It
explains why an AI-assisted job search can get worse if it only makes applying
faster.

**Whole task:** Write the reader's current job-search allocation and identify
which parts are execution and which are judgment.  
**Assessment:** Baseline allocation note.

## Chapter 1 - The Fluency Trap

**Capability built:** Detect the gap between polished output and trustworthy
output.

The chapter teaches that AI-generated resumes, role summaries, sponsorship
claims, and fit explanations can sound finished while hiding unsupported
claims.

**Whole task:** Audit a fluent AI-generated job-search artifact.  
**Assessment:** Claim table labeled verified, model judgment, missing, or
unsafe.

## Chapter 2 - The Reallocation Principle

**Capability built:** Reframe job search as expected-return allocation.

The reader learns that the engine's purpose is not more applications. It is
better allocation of effort across applying, networking, portfolio, research,
and recipe repair.

**Whole task:** Build a first allocation model for one week of job-search time.  
**Assessment:** Time budget with reallocation hypothesis.

## Chapter 3 - The Verified-Data Contract

**Capability built:** State what counts as evidence in this repository.

The chapter introduces source data, generated data, audits, private tracker
data, and the rule against invented counts, rates, match quality, confidence,
or coverage.

**Whole task:** Trace one claim to a dataset, script, or audit.  
**Assessment:** Provenance note.

## Chapter 4 - Two Customers

**Capability built:** Understand recipes as both agent recipes and human
maintenance cards.

The reader learns why a recipe must be executable by an agent and auditable by a
human. This adapts the Claude supervision model directly: plans are proposals,
not proof.

**Whole task:** Read one recipe and identify what an agent does and what a human
must review.  
**Assessment:** Two-customer recipe note.

## Chapter 5 - Verifying the Data

**Capability built:** Interrogate coverage, base rates, calibration, and
warranted verbs.

The reader learns that verified records still need epistemic discipline. A
dataset can be real and still incomplete, stale, biased, or misapplied.

**Whole task:** Review an audit and name what it can and cannot support.  
**Assessment:** Warranted-verb list.

## Chapter 6 - Where the Money Went: SEC Form D

**Capability built:** Use SEC Form D funding evidence without overreading it.

The chapter builds the funding pathway: download, extract, process, collapse to
company-level records, and audit.

**Whole task:** Inspect the SEC funding evidence path for a company or sample.  
**Assessment:** Funding-evidence note with recency and caveats.

## Chapter 7 - Who Sponsors: The 80 Days Sponsorship Scorer

**Capability built:** Treat sponsorship history as a primary constraint.

The reader learns that sponsorship can dominate fit. Public DOL/H-1B and 80
Days evidence become a scoring component, not a vibe check.

**Whole task:** Classify one employer's sponsorship evidence.  
**Assessment:** Sponsorship tier with source path and uncertainty.

## Chapter 8 - Is the Job Real? ATS Detection and Liveness

**Capability built:** Verify that a posting is live and reachable.

The chapter treats job URLs as liveness objects: provider, redirect, stale
state, missing apply path, and provider-specific signals.

**Whole task:** Run or specify an ATS liveness check for one posting.  
**Assessment:** Liveness note with provider, status, and failure path.

## Chapter 9 - Is the Role Any Good? BLS/O*NET Role Quality

**Capability built:** Use labor-market and occupational evidence to evaluate
role quality.

The chapter maps roles to SOC/O*NET/BLS features so the reader can distinguish
"I can apply" from "this role is worth targeting."

**Whole task:** Map one role to an occupational family and quality indicators.  
**Assessment:** Role-quality note with source caveats.

## Chapter 10 - The Visa Timeline Manager

**Capability built:** Convert OPT/STEM/H-1B timing into gates.

The reader learns that timeline is not an ordinary score component. A role that
cannot work inside the student's authorization window should not be rescued by
fit.

**Whole task:** Build a timeline gate for one role.  
**Assessment:** Timeline pass/fail note and human-review trigger.

## Chapter 11 - The Bayesian Role Scorer

**Capability built:** Combine sponsorship, fit, liveness, and timeline without
hiding gates inside averages.

The chapter teaches composite scoring while preserving hard gates. Liveness and
timeline can zero out an otherwise attractive role.

**Whole task:** Score one role as Apply / Consider / Skip.  
**Assessment:** Scoring sheet with factor evidence and gate status.

## Chapter 12 - The OPT Framing Generator

**Capability built:** Produce honest, tier-calibrated OPT framing.

The reader learns how to communicate work authorization without inventing,
hiding, or overexplaining. Framing is generated from evidence and reviewed by a
human.

**Whole task:** Draft OPT framing for one role/employer context.  
**Assessment:** Framing note labeled honest, unsupported, or review-needed.

## Chapter 13 - Resumes That Survive the Filter

**Capability built:** Generate ATS-safe resumes and validate extraction.

The chapter separates visual polish from parser survival. The right test is
whether the system can extract the content correctly.

**Whole task:** Generate or inspect an ATS-safe resume artifact.  
**Assessment:** Parser-survival checklist.

## Chapter 14 - Recipes: Operating the Engine

**Capability built:** Run recipes through the run-inspect-record loop.

The reader learns the runtime method: run a recipe against a real target,
inspect output and provenance, and record meaningful runs in `logs/RUN_LOG.md`.

**Whole task:** Run or dry-run one active recipe.  
**Assessment:** Recipe run note with required reads, outputs, checks, and log
status.

## Chapter 15 - The Pipeline Tracker and the Skip Rate

**Capability built:** Maintain the tracker and interpret skip as a success
metric.

The chapter teaches how the tracker turns applications into learning. A high
skip rate indicates the filter is doing its job.

**Whole task:** Add or inspect tracker entries and compute the current decision
mix.  
**Assessment:** Tracker audit and skip-rate interpretation.

## Chapter 16 - The Build and the Honest Run

**Capability built:** Integrate the full system through a phase-gated honest
run.

The reader performs a bounded run from role input to Apply / Consider / Skip,
including scripts, audits, recipe output, human review, and logging.

**Whole task:** Complete one honest engine run.  
**Assessment:** Run log entry and audit note.

## Chapter 97 - Fundamental Themes

**Capability built:** Synthesize the book's load-bearing principles.

The chapter names what repeats: fluency is not correctness, judgment cannot be
delegated, skip is useful, audits matter, and honesty is the safety mechanism.

**Whole task:** Write the reader's own operating principles for future runs.  
**Assessment:** Personal engine doctrine.

## Chapter 98 - Appendix: Best Practices

**Capability built:** Maintain a book-plus-agent repository.

The appendix documents repo structure, docs, scripts, recipes, data contracts,
phase gates, logging, and generated artifacts.

**Whole task:** Audit the repo or a workflow using the appendix checklist.  
**Assessment:** Maintenance note.

---

## 9. Dependency Map

| Chapter | Depends On | Feeds |
|---|---|---|
| Introduction | None | Baseline allocation |
| 1 | Introduction | Claim skepticism |
| 2 | 1 | Reallocation method |
| 3 | 1-2 | Data contract |
| 4 | 3 | Recipe architecture |
| 5 | 3-4 | Evidence interrogation |
| 6 | 5 | Funding evidence |
| 7 | 5-6 | Sponsorship scoring |
| 8 | 4-5 | ATS liveness |
| 9 | 5 | Role quality |
| 10 | 7-9 | Timeline gates |
| 11 | 6-10 | Composite scoring |
| 12 | 7, 10-11 | OPT framing |
| 13 | 11-12 | Resume artifacts |
| 14 | 3-13 | Recipe runtime |
| 15 | 11, 14 | Tracker and skip rate |
| 16 | 14-15 | Honest run |
| 97 | 1-16 | Synthesis |
| 98 | Whole repo | Maintenance |

**Load-bearing chapters:** 1, 2, 3, 4, 5, 11, 14, 16.  
**Most fragile transition:** Chapter 5 to Chapter 6, because the reader moves
from epistemic discipline into concrete public datasets.  
**Highest adoption-risk chapter:** Chapter 11, if scoring hides hard gates or
implies false precision.

---

## 10. Running Project Spine

Every chapter should advance one running project:

**Default track:** Build and operate a verified job-search engine for one
student profile and target role family.

### Running Deliverables

1. Baseline allocation note.
2. Fluency claim audit.
3. Weekly reallocation hypothesis.
4. Data-provenance note.
5. Two-customer recipe note.
6. Warranted-verb list.
7. Funding-evidence note.
8. Sponsorship tier.
9. Liveness note.
10. Role-quality note.
11. Timeline gate.
12. Apply / Consider / Skip scoring sheet.
13. OPT framing note.
14. Parser-survival checklist.
15. Recipe run note.
16. Tracker audit.
17. Honest-run audit note.

---

## 11. Chapter Anatomy Template

Each chapter should include:

1. Concrete failure, decision, or role scenario.
2. Capability statement.
3. Why this capability matters for the reader's constraint.
4. Source data or script path.
5. Agentic supervision lens: scope, approval, verification.
6. Running project task.
7. Verification checklist.
8. Human-only judgment boundary.
9. Output contract.
10. Bridge to the next chapter.

Do not open chapters with abstract AI capability. Open with the reader's
resource constraint and the decision the chapter helps them make.

---

## 12. Assessment Architecture

### Formative Assessments

- Claim audits.
- Data provenance notes.
- Recipe-readiness notes.
- Audit interpretations.
- Sponsorship classifications.
- ATS liveness notes.
- Role-quality maps.
- Timeline gates.
- Scoring sheets.
- Resume parser checks.
- Tracker audits.

### Summative Assessment

The final assessment is one honest run:

- real or realistic role input;
- named source data;
- maintained scripts or documented dry-run;
- active recipe or workflow card;
- Apply / Consider / Skip decision;
- human-review note;
- privacy check;
- run log entry;
- audit note.

### Final Exam Style Question

Given a polished AI-generated recommendation to apply to a role, identify every
unsupported claim, name the data and script checks required, apply the
sponsorship, liveness, role-quality, and timeline gates, and rewrite the
conclusion as an honest Apply / Consider / Skip decision with uncertainty
preserved.

---

## 13. Case and Worked-Example Strategy

Cases should show what changes when verified data interrupts fluency.

### Case Types

- Famous-company trap: brand recognition hides sponsorship weakness.
- Ghost-job trap: the posting exists but the role is not live.
- Fit trap: resume match looks high but timeline or sponsorship kills the
  opportunity.
- Credential trap: the generated resume looks good but fails parser extraction.
- Batch trap: automation scales before small-run verification.
- Tracker trap: applications happen but no outcome learning is recorded.

### Repo-Grounded Cases

- SEC Form D pathway through `scripts/sec/` and `data/sec/form-d/`.
- Sponsorship pathway through `data/80-days-to-stay/`.
- ATS pathway through `scripts/ats/` and `data/ats/`.
- Role-quality pathway through `scripts/bls/` and `data/bls/`.
- Resume pathway through `scripts/resumes/`.
- Recipe runtime through `recipes/oferta.md`, `recipes/pipeline.md`,
  `recipes/tracker.md`, and `recipes/pdf.md`.

---

## 14. Adoption Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---:|---:|---|
| Book becomes a generic job-search guide | Medium | High | Keep every chapter tied to verified data, scripts, or recipes. |
| Book becomes an AI automation celebration | Medium | High | Repeat execution vs. judgment and scope/approval/verification. |
| Visa material reads as legal advice | High | High | Use operational framing, limitation language, and human/legal escalation. |
| Scoring implies false precision | High | High | Preserve gates, uncertainty, warranted verbs, and audits. |
| Reader cannot run scripts | Medium | Medium | Provide exact commands, dry-run paths, and inspection tasks. |
| Private ATS data is committed or shared | Medium | High | Repeat privacy checks before commit and publication. |
| Chapters 6-13 feel like isolated components | Medium | Medium | Use one running role/profile through the component sequence. |
| Skip rate feels demoralizing | Medium | Medium | Teach skip as reallocation success, not rejection. |

---

## 15. Production Notes

### Primary Production Target

Use the existing files in `chapters/` as the canonical chapter sequence. The
Tik TOC should refine learning outcomes, running tasks, assessments, and
chapter bridges rather than invent a new book.

### Repo Docs to Keep in Sync

- `README.md`
- `DATA_CONTRACT.md`
- `docs/README.md`
- `docs/operations.md`
- `docs/data-and-provenance.md`
- `docs/scripts.md`
- `docs/recipes.md`
- `recipes/README.md`

### Current Command Surface

```bash
npm run ats:scan
npm run ats:liveness -- https://example.com/job/123
npm run ats:verify
npm run ats:merge
npm run ats:dedup
npm run ats:normalize
npm run resumes:pdf -- --all
npm run svg-to-png
python3 scripts/audit-sec-dol-h1b-data.py
python3 scripts/sec/refresh-recent-sec-quarters.py
python3 scripts/sec/validate-h1b-join-sample.py
python3 scripts/bls/extract-soc-occupation-table.py
python3 scripts/ats/analyze-patterns.py
```

---

## 16. Open Questions

These are not blockers for silent intake, but they should be resolved before a
proposal package:

- Is the primary reader specifically F-1 OPT/STEM OPT, or a broader
  sponsorship-constrained job seeker?
- Should the final project require real private tracker data, or allow a
  synthetic privacy-safe dataset?
- Which single student profile should run through examples?
- Which scripts should be considered fully maintained versus illustrative?
- Should Chapter 97 remain a synthesis chapter or move into back matter?

---

## 17. Compact TOC

1. The Fluency Trap
2. The Reallocation Principle
3. The Verified-Data Contract
4. Two Customers
5. Verifying the Data
6. Where the Money Went: SEC Form D
7. Who Sponsors: The 80 Days Sponsorship Scorer
8. Is the Job Real? ATS Detection and Liveness
9. Is the Role Any Good? BLS/O*NET Role Quality
10. The Visa Timeline Manager
11. The Bayesian Role Scorer
12. The OPT Framing Generator
13. Resumes That Survive the Filter
14. Recipes: Operating the Engine
15. The Pipeline Tracker and the Skip Rate
16. The Build and the Honest Run
17. Fundamental Themes

Appendix: Best Practices
