# The Reallocation Engine — Chapter Research Map

**Purpose:** For each of the 14 chapters in `TIKTOC.md`, this maps the source
material that already exists in the repository, how draft-ready it is, and what
gaps remain. Most of Act Two and Act Three are already written — as the
`80-days-day-*` build logs, the SDD's five component specs (with exact
formulas), and the 1,135-line build score. Act One has the thesis prose but
needs composing into pedagogy.

**Compiled:** 2026-06-02 from `chapters/`, `projects/`, `skills/`, `scripts/`,
`data/`, `README.md`, `DATA_CONTRACT.md`.

---

## Readiness at a glance

| Ch | Title | Primary existing source | Readiness |
|---|---|---|---|
| 1 | The Fluency Trap | `chapters/00-introduction.md`, SDD Principles 3–4 | **Partial** — thesis prose exists, pedagogy + setup needed |
| 2 | The Reallocation Principle | plain-summary, SDD §1 + Principle 1 | **Strong** — 3-3-2 fully articulated; stats need citing |
| 3 | The Verified-Data Contract | `skills/_shared.md`, `skills/README.md`, `DATA_CONTRACT.md` | **Strong** — contract fully written |
| 4 | Where the Money Went: SEC Form D | `80-days-day-01..05`, `scripts/sec/` | **Strong** — near-publishable narrative + numbers |
| 5 | Who Sponsors: 80 Days Scorer | `80-days-day-07..08`, SDD Component 2, data audits | **Strong** — formula + data + entity resolution |
| 6 | Is the Job Real: ATS & Liveness | `80-days-day-06`, `scripts/ats/` | **Strong** — ATS subsystem + the "triple win" narrative |
| 7 | Is the Role Any Good: BLS/O\*NET | `scripts/bls/`, `soc_classification_*`, `bls-audit.md` | **Strong (mechanics)** — academic papers need de-jargoning |
| 8 | The Visa Timeline Manager | SDD Component 1 + Principle 2, build-score Step 1 | **Strong** — spec + 8 intake questions; verify rules |
| 9 | The Bayesian Role Scorer | SDD Component 3, plain-summary feature 3 | **Strong** — composite formula fully specified |
| 10 | The OPT Framing Generator | SDD Component 4 + Risk 3, plain-summary feature 4 | **Strong** — tier rules written; needs ethics review |
| 11 | Resumes That Survive the Filter | `scripts/resumes/`, `80-days-day-06` Win #2 | **Partial** — tooling documented; parser-failure example needed |
| 12 | Skills: Operating the Engine | `skills/` (all recipes), SDD §3 flows | **Strong** — skills fully documented |
| 13 | Pipeline Tracker & Skip Rate | SDD Component 5, plain-summary feature 5, patterns audit | **Strong** — schema + metric defined |
| 14 | The Build and the Honest Run | `boondoggle-score` (1,135 lines), SDD §9–14 | **Strong** — build score is the chapter spine |

**Bottom line:** 11 of 14 chapters have Strong existing source. The book is much
closer to a first draft than the empty phase files suggest. The work is
*composition and pedagogy* (turning build logs and specs into teaching), not
*discovery*. The three biggest writing jobs are Chapter 1 (compose the
pedagogy), Chapter 11 (thin), and de-jargoning the academic papers for Chapter 7.

---

## Cross-cutting research assets

Three things in the repo serve multiple chapters and the book's credibility:

- **Three research-paper drafts** in `projects/` — `soc_classification_draft.md`
  (+ `_methods.md`), `h1b_misclassification_draft.md`,
  `cognitive_tier_startup_hiring_draft.md`. These are publishable-grade studies
  built on the same SEC×DOL×O\*NET data spine. They carry `[TO DO]` placeholders
  where real numbers must be run. They feed Chapter 7 (SOC classification),
  Chapter 12's contested-claims material, and give the book research authority.
  **They are a parallel track: rich, but numerically incomplete.**
- **`persona_spec_and_research_prompts.md`** — feeds the learner profile and any
  Medhavy/Medhavi adaptive-persona layer; not a chapter itself.
- **`writing-tools/`** (`chapter-writer.md`, `research-pass.md`,
  `domain-research.md`, `factcheck.md`, `enrichment.md`, `finishing-figures.md`,
  `cajal.md`, `tiktoc.md`) — the book's own authoring workflow. Meta-layer for
  drafting, not content.

**Sourcing debt (applies to every chapter):** the headline statistics —
54% of hires via connections, 4–10× referral conversion, 56% AI-skill wage
premium, 28–42% ghost jobs, ~7.65% FICA — appear across `plain-summary` and the
SDD without citations. These must be source-cited or labeled illustrative before
publication (TOC Risk 7).

---

# ACT ONE — ESTABLISH

## Chapter 1 — The Fluency Trap

**Existing source:**
- `chapters/00-introduction.md` — the entire thesis is already drafted here:
  "The first sign of trouble is usually not failure. It is fluency." The
  execution/judgment boundary, "avoidance is not a strategy — the strategy is
  disciplined use," and the closing return ("ask what would have to be true for
  it to be trusted") are written in final voice.
- `README.md` — condensed version of the same.
- SDD **Principle 3 (Probability over polish)** and **Principle 4 (The human
  gate is not optional)** — the architectural expression of the thesis.

**Readiness:** Partial. The *prose* is publishable; the *pedagogy* is not yet
there. The introduction states the thesis; the chapter must teach it.

**Gaps to write:**
- The opening worked example: one polished, ungrounded application
  recommendation the reader is asked to act on, then dismantled.
- Claude Code setup walkthrough and the directory tour against `DATA_CONTRACT.md`.
- Exercises (audit an ungrounded artifact; stand up the workbench).

---

## Chapter 2 — The Reallocation Principle

**Existing source:**
- `projects/the-reallocation-engine-plain-summary.md` — "The reallocation
  target" section is fully written: the **3-3-2 day** (2h apply / 3h network /
  3h portfolio), referrals 4–10× more likely, **54%** of hires via connections,
  **56%** AI-skill wage premium, and the core line "a tool that makes applying
  faster without improving targeting has missed the point."
- SDD **§1 (One-Page Problem Summary)** and **Principle 1 (Reallocation over
  automation)** — the eight-hour applicant, the compounding Eightfold-score
  damage, ghost jobs at **28–42%** of postings, the "skip as often as apply"
  commitment, and the week-3 burnout failure state.

**Readiness:** Strong. This chapter is essentially assembled; it needs voice and
a worked example.

**Gaps to write:**
- Source citations for 54% / 4–10× / 56% / 28–42% (sourcing debt).
- The week-of-spray-and-pray vs. week-of-reallocation worked example with
  explicit expected-value reasoning.

---

## Chapter 3 — The Verified-Data Contract

**Existing source:**
- `skills/_shared.md` — the **prime directive** ("use collected data and tested
  scripts first"), the **sources-of-truth table**, the **ten verified-data
  rules**, and the **logging rules** are written verbatim and ready.
- `skills/README.md` — the run-inspect-record loop, good vs. bad skill behavior.
- `DATA_CONTRACT.md` — the five-layer ownership model (source / maintained /
  generated / book / private).

**Readiness:** Strong. The contract is fully authored.

**Gaps to write:**
- The "two ways to estimate sponsorship" worked example (ask the model vs. query
  the records) that makes the discrepancy visible.
- A beginner-friendly first skill run with a `RUN_LOG.md` entry as the artifact.

---

# ACT TWO — BUILD

## Chapter 4 — Where the Money Went: SEC Form D

**Existing source (this is the richest chapter in the repo):**
- `data/80-days-to-stay/80-days-day-01/README.md` — "Understanding the Data":
  what Form D is (15-day filing, Reg D exemption), why it is "gold for visa
  sponsorship," and the full field inventory. Near-final teaching voice.
- `…/80-days-day-02/README.md` — key findings: **568,707** companies filed Form
  D, **246,572 (43.4%)** raised $5M+, geographic distribution (NY/CA/TX top;
  MA/CA/NY combined = 103,008 high-value companies).
- `…/80-days-day-03/README.md` — filtering 568K → ~10K targets (funding,
  geography, industry exclusions), domain inference, the verification platform
  sprint.
- `…/80-days-day-04/README.md` — scraping: **25,748** companies, **425,233**
  pages, 62% verification, HTML→markdown for LLM analysis.
- `…/80-days-day-05/README.md` — "separate the willing from the wealthy";
  scraping stats; **$0 budget**.
- `scripts/sec/README.md` — the maintained pipeline (`download → refresh →
  combine → filter → unique → domain inference → flatten`).
- `data/sec/form-d/processed/recent-sec-quarters-audit.md` — current refresh audit.
- `projects/soc_classification_methods.md` §1.3 — EDGAR full-text search API.

**Readiness:** Strong. The day logs are near-publishable; the main job is
converting day-log voice (emoji, "we built today") into chapter voice.

**Gaps to write:**
- The pipeline run as a guided exercise (real quarter → ranked company list).
- One "surprising small firm next to the obvious names" worked example.

---

## Chapter 5 — Who Sponsors: The 80 Days Sponsorship Scorer

**Existing source:**
- `…/80-days-day-07/README.md` — the government data sources: **DOL LCA
  Disclosure Data** (6M+ records, quarterly) and **USCIS H-1B Employer Data Hub**
  (approval/denial by employer), with download URLs.
- `…/80-days-day-08/README.md` — "Mapping the Treasure Map": SEC × DOL join
  logic, name normalization, **RapidFuzz** fuzzy matching (≥0.88), the resulting
  schema (filings, approval rate, top titles, median salary), and the **LLM
  Recruiting Expert** prompt strategy.
- SDD **Component 2 (80 Days Sponsorship Scorer)** — the exact formula:
  **LCA filing rate 0.40, H-1B approval rate 0.30, funding recency 0.20, size
  0.10**; tiers **Proven ≥ 0.65, Likely ≥ 0.35, Unknown < 0.35** (no LCA
  history); the "$10M funding but no LCA → Unknown with positive signal" edge.
- `scripts/sec/entity-resolution.py` + README — the join order (FEIN exact →
  normalized name → fuzzy 0.88 → unknown).
- `data/80-days-to-stay/data/` audits — `SEC_DOL_H1b_data_mapped-audit.md`,
  `-join-validation-audit.md`, `-entity-resolution-readiness-audit.md`.
- `projects/soc_classification_methods.md` §1.1 — the LCA corpus as ground truth.

**Readiness:** Strong. Formula, data, and entity resolution are all documented.

**Gaps to write:**
- The backwards-ranking worked example (0%-sponsorship household name vs.
  15-LCA Cambridge biotech) — narrated in plain-summary, needs real data behind it.
- Tier-assignment exercise on ten target companies.
- Note: the four tiers in plain-summary include **Avoid**; the SDD lists
  Proven/Likely/Unknown. Reconcile the tier set before drafting.

---

## Chapter 6 — Is the Job Real: ATS Detection and Liveness

**Existing source:**
- `…/80-days-day-06/README.md` — "The ATS Revelation": the **triple win** —
  Win #1 live job postings (Greenhouse `boards-api` example), Win #2 resume
  strategy intelligence (feeds Ch 11), Win #3 company-sophistication signal.
- `scripts/ats/README.md` — the full subsystem: `detect-ats.py` (unified
  detector), `scan.mjs` (zero-token provider scan), `check-liveness.mjs` +
  `liveness-core.mjs` + `liveness-browser.mjs` (Playwright liveness), Greenhouse
  and Lever production scrapers, `providers/` (Greenhouse/Lever/Ashby),
  `analyze-patterns.py`.
- SDD **N-need on liveness** ("estimated probability the role is real and
  currently being filled") and **ghost jobs at 28–42%** of postings.
- `data/ats/` working data and reports.

**Readiness:** Strong. Subsystem + the day-06 narrative carry it.

**Gaps to write:**
- The liveness *scoring* detail — which signals (posting age, update recency,
  ATS pattern) and how they combine. Described qualitatively; needs specifics.
- The live/ghost classification exercise on three real postings.

---

## Chapter 7 — Is the Role Any Good: BLS / O\*NET Role Quality

**Existing source:**
- `scripts/bls/README.md` + `data/bls/bls-audit.md` — the compact SOC occupation
  table (O\*NET identity, alternate titles, job zones, ability/skill levels, BLS
  OEWS national employment + wage). `data/bls/` holds OEWS years 2012–2024 and an
  `onet-job-trend-analyzer`.
- `projects/soc_classification_draft.md` + `soc_classification_methods.md` — a
  full validation study: LLM full-text SOC classification vs. LCA ground truth,
  STEM major groups **15-xxxx / 17-xxxx / 19-xxxx**, ~1,800-record stratified
  validation set, prompt templates.
- `projects/cognitive_tier_startup_hiring_draft.md` — the seven-tier Irreducibly
  Human taxonomy (T1 Pattern … T7 Existential) mapped to SOC groups (advanced /
  optional sidebar material).

**Readiness:** Strong for the role-quality mechanics; the SOC papers are
research-grade and carry `[TO DO]` numeric placeholders.

**Gaps to write:**
- De-jargon the academic SOC paper into practitioner instruction (map a posting
  → SOC → wage/employment read).
- The two-postings-same-title-different-future worked example.
- Decide how much of the cognitive-tier framework belongs here vs. an appendix.

---

## Chapter 8 — The Visa Timeline Manager

**Existing source:**
- SDD **Component 1 (Visa Timeline Manager)** and **Principle 2 (Visa timeline is
  a first-class constraint)** — every component is OPT/STEM/H-1B-aware; a role
  closing after authorization expires is invalid regardless of fit.
- `projects/the-reallocation-engine-plain-summary.md` feature 1 — the timeline
  factor (0–1), factor = 0 ⇒ skip regardless, buffer-based scaling.
- `projects/the-reallocation-engine-boondoggle-score.md` **Step 1** — the **eight
  intake questions** (visa status, exact OPT expiration, STEM eligibility/filing,
  target roles, geography, comp floor, three deal-breakers, strongest proof
  point) that found the factor.

**Readiness:** Strong — component spec + intake questions.

**Gaps to write:**
- Exact OPT / STEM OPT / H-1B-lottery date rules must be verified against primary
  USCIS/DHS sources at use time (TOC Risk 2 — these age and this is not legal
  advice).
- The three-roles worked example (one zeroed by timeline, two buffer-scaled).

---

## Chapter 9 — The Bayesian Role Scorer

**Existing source:**
- SDD **Component 3 (Bayesian Role Scorer)** — the composite formula:
  `composite = P(sponsorship) × 0.35 [Component 2] × P(fit|CV,JD) × 0.30 [LLM
  CV–JD match] × [liveness] × [timeline]`; default minimum threshold **0.3**;
  outputs composite score, **apply/skip recommendation**, breakdown, confidence;
  logs each decision to the tracker for calibration.
- SDD **§3 Primary Flow (Daily Decision)** — the end-to-end pipeline and the
  "Flow Honesty Test."
- `plain-summary` feature 3 — sponsorship weighted **35%, the highest single
  factor**; "a perfect-fit application to a non-sponsor is worth exactly zero";
  ghost-job liveness folded in.

**Readiness:** Strong — formula fully specified. This is the hardest *conceptual*
chapter (inverts fit-first instinct), not the hardest to source.

**Gaps to write:**
- Confirm the exact liveness and timeline weights/coefficients (the composite
  shows 0.35 and 0.30 explicitly; the remaining terms need their final form).
- The score-one-posting-fully worked example tracing each factor to its source.

---

## Chapter 10 — The OPT Framing Generator

**Existing source:**
- SDD **Component 4 (OPT Framing Generator)** and **Risk 3 (OPT framing backfires
  with Unknown-tier employers)**.
- `plain-summary` feature 4 — the full tier-calibrated framing rules: **Proven**
  (state authorization directly), **Likely** (lead with work authorization +
  **FICA ~7.65%** saving, avoid the acronym), **Unknown** (no visa mention in
  initial written materials), **Avoid** (no materials); and the hard rule —
  framing is accurate information presented strategically, **never** fabricated
  credentials or misrepresented status.
- `…/80-days-day-08` — the LLM inquiry-agent prompts (e.g., the STEM-OPT
  zero-cost question) that surface the same FICA/authorization facts.

**Readiness:** Strong — tier rules fully written.

**Gaps to write:**
- Legal/ethics review of the disclosure-by-tier rules (TOC Risk 3) before
  drafting tactics.
- The same-candidate-three-framings worked example.

---

## Chapter 11 — Resumes That Survive the Filter

**Existing source:**
- `scripts/resumes/README.md` — the Markdown-CV → ATS-safe PDF pipeline
  (`generate-pdf.mjs`, Playwright/Chromium, `npm run resumes:pdf`), anonymized
  example CVs in `resumes/`.
- `…/80-days-day-06` Win #2 — "Resume Strategy Intelligence": using the detected
  ATS to decide resume format.

**Readiness:** Partial. The tooling is documented; the *teaching* content (what
breaks parsers, why) is thin relative to other chapters.

**Gaps to write:**
- The parser's-eye-view failure case (a designed resume read as garbled text).
- The specific ATS-safe structural rules.
- Render-your-own-CV exercise + a "designed vs. safe" diff.

---

# ACT THREE — APPLY

## Chapter 12 — Skills: Operating the Engine

**Existing source:**
- `skills/README.md` — the full skill taxonomy: active (`scan`, `pipeline`,
  `oferta`, `tracker`, `pdf`) vs. draft/helper (`apply`, `auto-pipeline`,
  `batch`, `contacto`, `deep`, `followup`, `interview-prep`, `latex`, `ofertas`,
  `project`, `training`), plus the "check whether a draft skill calls real scripts
  and logs" rule.
- Each individual `skills/*.md` recipe.
- `skills/RUN_LOG.md` — the logging discipline.
- SDD **§3 Core User Flows** — primary daily decision, the no-valid-targets
  failure path, the profile-setup administrative flow.

**Readiness:** Strong — skills are fully documented.

**Gaps to write:**
- A single end-to-end narrative: one role taken from URL → `scan` → `pipeline`
  scoring → `oferta` evaluation, every step logged.

---

## Chapter 13 — The Pipeline Tracker and the Skip Rate

**Existing source:**
- SDD **Component 5 (Pipeline Tracker)** — the tracker table schema (Date,
  Company, Role, Sponsorship Tier, Composite Score, …).
- `plain-summary` feature 5 — log every decision **including skips**; the
  counterintuitive target **skip rate ≥ 50%**; the daily allocation summary that
  reminds the reader how much network/portfolio time remains.
- `data/ats/application-patterns-audit.md` + `scripts/ats/analyze-patterns.py` —
  the pattern-analysis scaffold.
- `skills/tracker.md` and `skills/patterns.md`.

**Readiness:** Strong — schema and metric defined.

**Gaps to write:**
- A week-of-tracker-data worked example. Real tracker data is private
  (`data/ats/applications.md` is in the private layer), so this likely needs a
  labeled illustrative dataset.

---

## Chapter 14 — The Build and the Honest Run

**Existing source (the chapter's spine already exists):**
- `projects/the-reallocation-engine-boondoggle-score.md` (1,135 lines) — the full
  **Gru/Minion** build plan in dependency order: the **Minion part** (exact
  Claude prompts for scaffolding, schemas, scoring formulas, boilerplate) and the
  **Gru part** (the irreducibly human decisions). Phase legend **F / C / I / B /
  H / R** (Foundation, Core Skeleton, Integration, Full Feature Build, Hardening,
  Release). Step 1 = the eight intake questions.
- SDD **§9 Component Priority List**, **§11 Infrastructure and Deployment**,
  **§12 Risk Register**, **§13 Open Questions**, **§14 What This Document Is For**.
- `chapters/00-introduction.md` — the closing return ("ask what would have to be
  true for it to be trusted; what the machine could not know; what you are now
  responsible for") is the natural chapter ending and closes the loop opened in
  Chapter 1.

**Readiness:** Strong — the build score is the chapter.

**Gaps to write:**
- Compose the honest-run narrative + the ethics section (privacy review of
  `data/ats/` files before any commit — TOC Risk 1).
- The first-real-run exercise (build the engine, make ten logged decisions, audit
  one score for a hidden error, write the "what the machine could not know"
  account).

---

## Suggested drafting order

1. **Chapters 4, 5, 6** — richest existing source; drafting these first builds
   momentum and proves the day-log → chapter conversion pattern.
2. **Chapters 3, 12, 13** — the contract and the runtime; mostly assembly.
3. **Chapters 8, 9, 10** — the scoring core; specs exist, need worked examples
   and (for 8 and 10) verification/ethics review.
4. **Chapters 2, 14** — bookend the method; strong source, need composition.
5. **Chapters 1, 7, 11** — the real writing: compose Ch 1 pedagogy, de-jargon the
   Ch 7 SOC research, build out thin Ch 11.

**Before drafting any chapter:** resolve the sourcing debt (cite or label the
headline statistics) and the tier-set discrepancy (Proven/Likely/Unknown/Avoid
vs. Proven/Likely/Unknown). Both recur across chapters.

---

# Source Layer 2 — Published Essays (uploaded 2026-06-02)

Nineteen HTML essays were uploaded. **Eight are direct chapter source**, one is
on-theme context, and **ten belong to a different publication** (the
skepticism.ai / protest-essay register — civil rights, Iran, markets, Baldwin)
and are *not* source for this book.

**Why this matters:** these are the *published, prose-finished* versions of the
book's thesis material, and they carry the headline statistics previously flagged
as uncited. The "sourcing debt" is now largely a citation-tracing job, not a
fact-finding one — the numbers have a published home, and the prose voice is
already on the page. The thinnest chapter in Layer 1 (Ch 11, Resumes) gets the
single richest new source.

## Book-relevant essays → chapters

| Essay (upload) | Chapter | Citable material it supplies |
|---|---|---|
| `job-apocalypse-not-yet-thinking-has` | **1** Fluency Trap | 75–80% of graded work is procedural / 20–25% is judgment — concretizes the execution-vs-judgment boundary as a grading rubric |
| `the-inversion-why-software-engineers` | **1** Fluency Trap | "90% musician → 90% judgment" inversion; 72% of S&P 500 disclose AI as material risk (up from 12% in 2023); AI-trust fell 43%→33%; wage growth by domain (cybersecurity 40%, AI systems 35%) |
| `the-3-3-2-split` | **2** Reallocation / **13** Skip Rate | 54% hired via connections; 30.89% offer rate at 21–80 apps vs 20.36% beyond 80; referrals convert ~40% vs 0.2% cold — the empirical spine of the 3-3-2 model |
| `what-is-computational-skepticism` | **3** Verified-Data Contract | Point-in-time / lookahead-bias framing; the verification-over-fluency ethos as method — the philosophical root of the prime directive |
| `80-days-to-stay-connecting-recent` | **4 / 5** Act Two build | The H-1B data spine in narrative; 62% domain-inference success, ~38% still unverified; name-normalization problem ("Google LLC" vs "Inc") |
| `what-is-a-ghost-job` | **6** Liveness | Ghost rate steady 28–38% over 5yr; city breakdowns (LA 30.5%, NYC 26.7%, Seattle 16.6%); 62% post to make staff "feel replaceable"; **the green-card legal-mandate ghost job** — ads *legally required to fail* |
| `can-ai-help-detect-ghost-jobs` | **6** Liveness | Ghost-jobs-as-spam framework; Hiring Likelihood Score 0–100; survival analysis; 81% of recruiters admit posting them; 39.3% of seekers call them the #1 obstacle |
| `the-collapse-of-traditional-resume` | **11** Resumes *(thinnest chapter)* | 82% screen with AI, 21% auto-reject, only 21% reach a human; 56% wage premium for validated AI skills; 96% skills-based hiring; the layered-proof model (Kaggle, Codeforces, deployed projects) |

**Context (not direct source):** `re-engineering-higher-education-for` (6,671w) —
the "supertanker" argument that education can't turn fast enough to teach
judgment. Useful framing for the Ch 1 / preface stakes; not a chapter spine.

## The green-card ghost job — a connection worth foregrounding

`what-is-a-ghost-job` surfaces a point the repo's own material understates: some
ghost jobs are **legally mandated to fail** — PERM labor-certification ads a
sponsor must run to prove no qualified American applied. That ties the ghost-job
detector (Ch 6) directly to the visa thesis (Ch 5/8): the same posting can be a
mirage *and* a sponsorship signal. Worth making explicit when drafting Ch 6.

## Off-topic uploads (different publication — exclude)

`socratic-prompting-the-midwifery`, `beyond-a-reasonable-doubt`,
`when-options-markets-whisper`, `learning-to-see-the-invisible`,
`the-medics-voice`, `the-strategic-vulnerability-of-poetic`,
`when-the-cloud-runs-dry`, `1961-freedom-rides`, `trumps-america-the-spectacle`,
`i-was-today-years-old`, `my-childish-protest-song` (108w fragment). These are
skepticism.ai / civic-essay pieces — strong work, wrong book.

> **Caveat on the statistics:** these essays *state* the numbers in finished
> prose but most do not show their own primary sources inline. They convert the
> sourcing problem from "find a number" to "trace this number to its origin
> (LinkedIn/Greenhouse report, BLS series, the cited survey)." Before a stat goes
> in a chapter as fact, trace it; otherwise label it as reported.

## Later-batch additions (uploaded 2026-06-02, batches 2–3)

Two further upload batches were mostly *other books* — the causal-inference title
*The Human Half: What AI Can't Do*, an education / learning-science cluster
(Bloom 2-sigma, RAND, Khanmigo, Frictional/GLP), product walkthroughs (Marley,
Medhavy), and civic essays (Palantir/`the-debt-that-was-never-owed`,
`the-twelve-wild-ducks`, `glimmer`). Four pieces, however, are real source here:

| Essay (upload) | Chapter | What it adds |
|---|---|---|
| `the-ladder-that-isnt-there` | **1** Fluency Trap / **7** Role Quality | The entry-level-collapse thesis with hard 2026 facts: IBM tripling junior hiring (Feb 2026, Nickle LaMoreaux); Anthropic Jan-2026 study — juniors who delegated to AI scored 24–39% on comprehension vs 65–86% who interrogated it; "AI boost vs AI drag" (Russinovich/Hanselman). The strongest empirical backing for the book's core premise. |
| `the-eightfold-ai-match-score` | **9** Bayesian Scorer / contested claims | The counter-case the repo lacks: Eightfold's scorer learned manager bias ("thought Michael Scott was the signal"); *Kistler v. Eightfold* FCRA suit demands disclose-the-score / allow-disputes / fix-the-audit — exactly what the verified-data contract claims to do. The dark mirror of the book's own scoring. |
| `boondoggling-you-are-the-conductor` | **14** The Build / **3** Verified-Data Contract | Published version of `boondoggle-score.md`: Gru/Minion conductor model, the Boondoggle Score, "plausibility auditing is the judgment that happens before verification," the handoff condition. Direct source. |
| `the-limits-of-ai-what-the-tools-cannot` | **3** Verified-Data Contract | Method-grade: a 94%-accurate clinical system that still harmed three patients; skepticism-as-safety-mechanism; "the option to say no"; engineers calibrated 50–70% while stating 90% confidence. Medical-framed but on-point for the contract's ethos. |

**Integration context (not chapter source):** `medhavy-hub-walkthrough`,
`stop-hunting-for-answers` — the Medhavy platform the book ships into.
