# The Reallocation Engine — Boondoggle Score
**System:** The Reallocation Engine
**SDD Completion:** All phases (v0.1 draft)
**Score generated:** 2026-05-28
**Team Claude fluency:** Level II (persistent conversation thread)
**Runtime:** Claude Code (NEU-provisioned)

---

## What This Score Is

This is the conductor's score. The SDD is the music. This score tells you who plays what, in what order, and when to listen for the wrong note.

Two simultaneous parts:
- **The Minion Part:** Exact prompts for Claude, in dependency order
- **The Gru Part:** Precise human actions, in the same dependency order

Claude builds what it is superhuman at: file scaffolding, schema drafting, prompt templates, scoring formulas, boilerplate configuration. You do what is irreducibly human: decide what your actual visa situation requires, audit whether Claude's probability math makes sense, supply the domain knowledge Claude cannot have, and integrate all five components into a system you will stake your job search on.

---

## Phase Legend

```
F = Foundation         (workspace, config, data contract)
C = Core Skeleton      (scoring logic, domain model)
I = Integration Layer  (80 Days dataset, ATS connectors)
B = Full Feature Build (all five components operational)
H = Hardening          (edge cases, failure states, framing rules)
R = Release            (onboarding, documentation, first real run)
```

---

## THE SCORE

---

### STEP 1 · PHASE F · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [PF] — Problem Formulation — You are deciding what the system needs to know about you before Claude sees anything. This is not data entry. This is the decision about which facts are first-class constraints in your reallocation engine.

**ACTION:** Before opening Claude Code, answer these questions in writing (a scratch document is fine):

1. What is your current visa status? (F-1 OPT / F-1 STEM OPT / H-1B / other)
2. What is your exact OPT expiration date?
3. Are you STEM OPT eligible? Have you filed? What is your STEM OPT expiration if filed?
4. What are your target roles? (Be specific: "Robotics Engineer" not "engineering")
5. What is your target geography? (City, not just country)
6. What is your absolute comp floor — below which you would not accept an offer?
7. What are your three deal-breakers? (e.g., no full on-site, no defense contractors)
8. What is your single strongest proof point — the one achievement you would lead with in any interview?

**Do not proceed to Step 2 until you have written answers to all eight.** Claude will use these answers as the foundation of your `config/profile.yml`. If any answer is vague, the visa timeline factor in your scoring formula will be wrong.

**DEPENDENCY:** None.

---

### STEP 2 · PHASE F · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** Your written answers from Step 1. Nothing else yet.

**PROMPT:**
```
You are helping me set up The Reallocation Engine, a personal CLI-based job search 
reallocation engine for international students on F-1/OPT/STEM OPT visas.

I am going to give you my personal data. Your job is to generate two files:

1. config/profile.yml — my identity, visa timeline, target roles, comp floor, 
   and deal-breakers
2. config/profile.example.yml — a sanitized version with placeholder values 
   that could be shared publicly without revealing my personal data

Here is my data:
[PASTE YOUR STEP 1 ANSWERS HERE]

For config/profile.yml, use this exact structure:

candidate:
  name: ""
  email: ""
  location: ""
  linkedin: ""

visa:
  type: ""              # F-1 OPT / F-1 STEM OPT / H-1B / other
  opt_expiration: ""    # YYYY-MM-DD
  stem_opt_eligible: false
  stem_opt_filed: false
  stem_opt_expiration: ""   # YYYY-MM-DD if filed, else null
  cap_gap_eligible: false

targets:
  roles:
    - ""
  locations:
    - ""
  comp_floor: 0         # Annual USD, below which do not apply
  deal_breakers:
    - ""

proof_points:
  lead_achievement: ""  # One sentence, quantified

Generate both files. For profile.example.yml, replace all personal data 
with clearly labeled placeholders like "YOUR_NAME", "YYYY-MM-DD", etc.

Output each file in a clearly labeled code block.
Do not add fields I have not asked for.
Do not invent data I have not provided.
```

**EXPECTED OUTPUT:** Two YAML files in labeled code blocks. `profile.yml` contains your actual data. `profile.example.yml` contains sanitized placeholders. No extra fields. No invented data.

**HANDOFF CONDITION:** Every field in `profile.yml` maps directly to a specific answer from Step 1. No field is left empty that you provided an answer for. The `visa.opt_expiration` date is correct to the day — verify this against your actual I-20 before proceeding. The `comp_floor` is a number, not a range.

**DEPENDENCY:** Step 1 complete.

---

### STEP 3 · PHASE F · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing — You are verifying that Claude's YAML output is grounded in your actual visa situation before it becomes the foundation of your scoring system. An error here propagates into every Bayesian score the system produces.

**ACTION:** Read `profile.yml` line by line against your I-20 and visa documents. Verify:

1. `opt_expiration` matches your I-20 exactly (not approximately — to the day)
2. `stem_opt_eligible` is correct — check your degree against the STEM OPT designated degree program list if unsure
3. `stem_opt_filed` and `stem_opt_expiration` are accurate if applicable
4. `comp_floor` is a number you would actually hold firm on in a negotiation
5. `deal_breakers` are real constraints, not aspirational preferences

Fix any errors directly in the file. Do not ask Claude to fix them — you are the authority on your own visa status. Claude is not.

**DEPENDENCY:** Step 2 complete.

---

### STEP 4 · PHASE F · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The verified `config/profile.yml` from Step 3. The SDD data contract (user layer vs. system layer). The SDD's ubiquitous language section.

**PROMPT:**
```
I am building The Reallocation Engine, a CLI-based job search reallocation engine for 
international students. I need you to generate the project scaffold — 
the directory structure and empty placeholder files.

Here is the data contract. User-layer files (never auto-updated, 
contain my personal data):
  cv.md, config/profile.yml, config/profile.example.yml,
  skills/_profile.md, article-digest.md, data/applications.md,
  data/pipeline.md

System-layer files (pipeline logic, updatable):
  skills/_shared.md, skills/evaluate.md, skills/score.md,
  skills/frame.md, skills/track.md, skills/onboard.md,
  data/80days-snapshot.csv (placeholder), CLAUDE.md, 
  .gitignore, README.md

Generate:
1. A complete directory tree showing all files and folders
2. A .gitignore that excludes ALL user-layer files plus 
   output/, reports/, jds/ directories
3. A README.md skeleton with these sections only (no content yet, 
   just headers): What Is This, Quick Start, The Reallocation Engine, 
   Adapting To Your Situation, Data Sources, Ethical Use
4. An empty CLAUDE.md with a single comment: 
   "# The Reallocation Engine Agent Instructions — to be completed in Step 6"

Output each file in a labeled code block.
Do not write the content of the skills/ files yet.
Do not invent features not listed here.
```

**EXPECTED OUTPUT:** Four labeled code blocks — directory tree, `.gitignore`, `README.md` skeleton, `CLAUDE.md` stub. The `.gitignore` must include `config/profile.yml` (not `profile.example.yml`), `cv.md`, `article-digest.md`, `data/`, `output/`, `reports/`, `jds/`. The README has headers only — no content prose yet.

**HANDOFF CONDITION:** The `.gitignore` excludes every user-layer file listed in the data contract. Verify by checking each file against the list. If `config/profile.yml` is not gitignored, stop — this is a visa data exposure risk.

**DEPENDENCY:** Step 3 complete.

---

### STEP 5 · PHASE F · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [IJ] — Interpretive Judgment — You are deciding what the CLAUDE.md must say about your specific visa situation and constraints before Claude can be trusted to act as your agent. This is not a template task. No one else's CLAUDE.md will correctly represent your search.

**ACTION:** Before Claude writes the CLAUDE.md (Step 6), write a one-page brief in plain language covering:

1. **Who you are** — your background, degree, target roles, and the one thing that makes you a strong candidate that is not obvious from your CV
2. **Your visa constraints in plain English** — not YAML, not dates — the human version: "I have X months before I need either STEM OPT extension or H-1B. This means I need to target companies with a hiring process shorter than X months, and I need to prioritize companies with proven sponsorship history."
3. **Your reallocation goal** — how many applications per week is sustainable for you, and what you plan to do with the freed-up time (be specific: which networking targets, which portfolio projects)
4. **Rules Claude must never break** — minimum three, written as hard constraints: "Never generate application materials for a company in the Avoid sponsorship tier." "Never recommend applying to a role whose expected start date is after my OPT expiration." "Never fabricate metrics."

This brief becomes the human layer of your CLAUDE.md. Claude will formalize it in Step 6.

**DEPENDENCY:** Step 4 complete.

---

### STEP 6 · PHASE F · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** Your Step 5 brief. The verified `config/profile.yml`. The SDD architecture principles (all four). The SDD ethical use section.

**PROMPT:**
```
I am building The Reallocation Engine, a personal CLI reallocation engine for my 
international student job search. I need you to write the CLAUDE.md 
that will govern your behavior as my agent throughout this project.

Here is my personal brief:
[PASTE YOUR STEP 5 BRIEF HERE]

Here is my profile.yml:
[PASTE VERIFIED profile.yml HERE]

The CLAUDE.md must include these sections in this order:

1. Who I Am (my background and what makes me a strong candidate)
2. My Visa Situation (plain English, with key dates)
3. My Reallocation Goal (weekly application target, what freed time goes to)
4. The Four Architecture Principles (copy from the SDD verbatim — 
   do not paraphrase them)
5. Hard Rules (the three rules from my brief, plus these mandatory ones:
   - Never submit or send anything on my behalf
   - Never generate materials for Avoid-tier companies
   - Never recommend applying to a role whose expected timeline 
     conflicts with my visa expiration
   - Never fabricate metrics, skills, or experience
   - Always stop before the human gate and wait for explicit confirmation)
6. Skills (a table — to be filled in as skills are built in later steps)
7. Data Contract (copy the user-layer and system-layer file lists from 
   the SDD verbatim)

Write this as a proper markdown document. 
Do not add sections I have not asked for.
Do not soften the hard rules.
```

**EXPECTED OUTPUT:** A complete `CLAUDE.md` with all seven sections. Hard Rules section contains at least eight rules — your three plus the five mandatory ones. The Four Architecture Principles match the SDD verbatim — if Claude has paraphrased or softened any principle, that is a failure.

**HANDOFF CONDITION:** Read the Hard Rules section aloud. Every rule is a constraint you would enforce in a job search where your visa status is at stake. If any rule sounds aspirational rather than binding, rewrite it before proceeding. The CLAUDE.md is not aspirational — it is operational.

**DEPENDENCY:** Steps 5 complete.

---

### STEP 7 · PHASE C · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [PF] — Problem Formulation — You are deciding the Bayesian weight structure for your specific situation before Claude writes a single line of scoring logic. The SDD proposes weights. Your visa timeline and risk tolerance may require different weights. This decision cannot be delegated.

**ACTION:** Review the SDD Bayesian scoring formula:

```
composite_score = 
  P(sponsorship)         × 0.35
  × P(fit | CV, JD)      × 0.30
  × P(role_is_real)      × 0.20
  × visa_timeline_factor × 0.15
```

Answer these questions in writing:

1. **Does 0.35 for sponsorship feel right for your situation?** If you have less than 6 months of OPT remaining, sponsorship is existential — should it be 0.50?
2. **Does 0.15 for visa timeline feel right?** If timeline conflicts are your single biggest risk, should it be a hard gate (0.0 = SKIP, no composite calculation) rather than a weighted factor?
3. **What is your minimum composite score threshold for APPLY?** The SDD says 0.45. Is that right for you, or do you want to be more conservative (0.55) given the cost of a bad application to your Eightfold score?
4. **Should the referral override be additive or multiplicative?** If a contact at a company refers you, does that change P(fit) by +0.20 (additive) or multiply it by 1.5 (multiplicative)?

Write your revised weight structure. You will hand this to Claude in Step 8.

**DEPENDENCY:** Step 6 complete.

---

### STEP 8 · PHASE C · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** Your Step 7 weight decisions. The SDD Component 3 (Bayesian Role Scorer) documentation in full. The SDD Component 1 (Visa Timeline Manager) documentation in full. The SDD ubiquitous language section.

**PROMPT:**
```
I am building the scoring core of The Reallocation Engine, a reallocation engine for 
international student job searches. I need you to write two skill files:

FILE 1: skills/score.md
This file contains the Bayesian scoring logic for evaluating a job posting.

It must include:
- The composite score formula using these exact weights: 
  [PASTE YOUR STEP 7 WEIGHT DECISIONS HERE]
- The sponsorship tier definitions (Proven/Likely/Unknown/Avoid) 
  with their P(sponsorship) thresholds from the SDD
- The APPLY/CONSIDER/SKIP recommendation thresholds
- The confidence level rules (HIGH/MEDIUM/LOW)
- The visa timeline factor calculation rules:
  [If the student has chosen hard gate: "If expected role start date 
  is after visa expiration, composite_score = 0.0, recommendation = SKIP, 
  do not calculate further"]
  [If the student has chosen weighted factor: use the weight they specified]
- The referral override rule: [PASTE YOUR STEP 7 REFERRAL DECISION]
- Output format: a structured score report with each dimension shown 
  separately before the composite, so the student can audit the math

FILE 2: skills/evaluate.md  
This file contains the role evaluation workflow — what the agent does 
when the student pastes a job URL or description.

It must include:
1. Read config/profile.yml to load visa timeline and deal-breakers
2. Check visa_timeline_factor first — if 0.0, output SKIP immediately 
   with reason, do not proceed
3. Query 80 Days dataset for company sponsorship score
4. Run CV-JD fit assessment (read cv.md, compare to JD)
5. Assess role liveness signals
6. Calculate composite score using skills/score.md
7. Output: score report in the format specified in skills/score.md
8. If recommendation is APPLY or CONSIDER: ask student to confirm 
   before generating any materials
9. STOP — wait for student confirmation before proceeding to framing

Rules for both files:
- Write in second-person imperative ("Read the profile. Check the date.")
- No marketing language
- No hedging — rules are rules, not suggestions
- Each step is numbered and testable

Output each file in a labeled code block.
```

**EXPECTED OUTPUT:** Two skill files in labeled code blocks. `skills/score.md` contains a complete, executable scoring formula with your weights, not the SDD's placeholder weights. `skills/evaluate.md` contains a numbered workflow where Step 2 is a hard gate check — if you chose hard gate in Step 7, SKIP fires before any other calculation.

**HANDOFF CONDITION:** Read the composite score formula in `skills/score.md`. Plug in a hypothetical: P(sponsorship) = 0.7, P(fit) = 0.6, P(real) = 0.8, visa_timeline_factor = 1.0. Calculate the composite by hand. Does the number match what the formula would produce? If not, the formula has an error. Fix it before proceeding.

**DEPENDENCY:** Step 7 complete.

---

### STEP 9 · PHASE C · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing — You are stress-testing the scoring formula against real cases before it governs your actual job search decisions.

**ACTION:** Run three test cases through the formula manually (not through Claude — with a calculator):

**Test Case A — Strong target:**
A Series B biotech in Boston with 12 LCA filings in 3 years, 85% H-1B approval rate, posted 2 weeks ago, role requires your exact degree, expected start in 4 months, your OPT expires in 8 months.

**Test Case B — The trap:**
A well-known tech company (FAANG-tier), zero LCA filings, posted 6 weeks ago with no updates, role is a strong CV match, expected start in 3 months, your OPT expires in 8 months.

**Test Case C — The edge:**
A seed-stage startup with $3M funding, no LCA history but founded 8 months ago (pre-LCA eligibility), role is a moderate CV match, expected start in 6 months, your OPT expires in 7 months.

For each: calculate the composite score, determine the recommendation, and ask yourself: **does this feel right?** If Test Case B produces APPLY, your sponsorship weight is too low. If Test Case C produces SKIP, check whether your visa_timeline_factor is being calculated correctly for near-miss timeline cases.

Write down what you would change and why. If you change the weights, return to Step 7 and update — then regenerate Step 8 before proceeding.

**DEPENDENCY:** Step 8 complete.

---

### STEP 10 · PHASE I · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The SDD Component 2 (80 Days Sponsorship Scorer) documentation. The SDD data contract. The verified `skills/score.md` from Step 8.

**PROMPT:**
```
I am building the 80 Days Sponsorship Scorer for The Reallocation Engine. This component 
reads a local CSV snapshot of the 80 Days to Stay dataset and returns a 
sponsorship score for a named company.

The 80 Days dataset contains these fields (at minimum):
  company_name, ein, funding_amount_usd, funding_date, 
  lca_filing_count_3yr, h1b_approval_rate, h1b_denial_rate,
  geography, industry_sector

I need you to write two things:

FILE 1: skills/score-sponsorship.md
A skill file containing:
- The sponsorship scoring formula using these exact weights from the SDD:
  LCA filing rate (3yr): 0.40
  H-1B approval rate: 0.30
  Funding recency: 0.20
  Company size proxy: 0.10
- The tier assignment rules:
  Proven:  P(sponsorship) >= 0.65
  Likely:  P(sponsorship) >= 0.35
  Unknown: P(sponsorship) < 0.35, no LCA history
  Avoid:   Active freeze signals OR P(denial) > P(approval)
- Handling rules for missing data:
  Company not in dataset → Unknown tier, flag for manual research
  LCA data present but USCIS data absent → use LCA only, 
    set confidence = MEDIUM
  Funding date > 24 months ago → apply recency decay (reduce 
    funding weight by 50%)
- Output format: tier, P(sponsorship) score, data completeness 
  flag, confidence level, raw data fields used

FILE 2: scripts/query-sponsorship.mjs
A Node.js script that:
1. Reads data/80days-snapshot.csv
2. Accepts a company name as a command-line argument
3. Fuzzy-matches the company name against the dataset 
   (handle case, punctuation, "Inc."/"Corp." variants)
4. Runs the scoring formula from skills/score-sponsorship.md
5. Outputs a JSON result with: 
   tier, score, confidence, lca_count, h1b_approval_rate, 
   funding_amount, funding_date, match_type (exact/fuzzy/not_found)
6. If not found: outputs tier="Unknown", score=null, 
   match_type="not_found"

Error handling requirements:
- If 80days-snapshot.csv does not exist: exit with clear error message 
  and instructions to download the dataset
- If company name is empty: exit with usage message
- No silent failures

Output each in a labeled code block.
Use only Node.js standard library plus csv-parse (npm package). 
No other dependencies.
```

**EXPECTED OUTPUT:** Two labeled code blocks. `skills/score-sponsorship.md` has complete scoring logic including all four missing-data handling rules. `scripts/query-sponsorship.mjs` handles exact match, fuzzy match, and not-found cases with explicit JSON output for each. Error handling covers missing CSV file and empty input.

**HANDOFF CONDITION:** Read the fuzzy matching logic in the script. Test mentally: does "Genentech Inc." match "Genentech"? Does "Boston Scientific Corporation" match "Boston Scientific"? Does "MIT" match "MIT Lincoln Laboratory"? The last case should NOT match — specificity matters. If the fuzzy logic is too aggressive, it will return sponsorship scores for the wrong company.

**DEPENDENCY:** Steps 8 and 9 complete.

---

### STEP 11 · PHASE I · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [TO] — Tool Orchestration — You are deciding whether the 80 Days dataset you have access to is sufficient to run the sponsorship scorer, and what to do if it is not. This is a go/no-go decision on the integration layer.

**ACTION:**

1. Locate the 80 Days to Stay dataset. If you have access to the CSV from the Humanitarians AI pipeline, place it at `data/80days-snapshot.csv`. If you do not have it yet, use the sample data from the 80 Days GitHub repository.

2. Open the CSV and verify it contains at minimum: `company_name`, `lca_filing_count_3yr` (or equivalent), `h1b_approval_rate`, `funding_amount_usd`, `funding_date`. If fields are named differently, you must decide: update the script to match the actual field names, or request a field-name standardization from the 80 Days team.

3. Run the script manually against three companies you know: one you believe is a Proven sponsor, one you believe is Unknown, one you believe is Avoid. Do the tiers match your expectation? If not, the formula needs adjustment before Step 12.

4. Check the dataset's coverage of your target geography. If you are targeting Boston biotech, how many Boston biotech companies are in the dataset? If the answer is fewer than 50, the sponsorship scorer will return Unknown for most of your targets and the system loses its core differentiator. Flag this as a risk before proceeding.

Write down: dataset field names (for Step 12), coverage assessment, any tier mismatches observed.

**DEPENDENCY:** Step 10 complete.

---

### STEP 12 · PHASE I · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** Your Step 11 findings (field names, coverage assessment, tier mismatches). The `scripts/query-sponsorship.mjs` from Step 10. The actual first three rows of your `80days-snapshot.csv` (paste them in — Claude needs to see the real field names).

**PROMPT:**
```
I have tested the sponsorship query script against my actual 80 Days 
dataset and found the following issues:

[PASTE YOUR STEP 11 FINDINGS HERE]

Here are the first three rows of my actual CSV to show the real 
field names:
[PASTE FIRST 3 ROWS OF CSV HERE]

Please make the following targeted fixes to scripts/query-sponsorship.mjs:
1. Update all field name references to match the actual CSV fields
2. [Any tier mismatch fixes you identified in Step 11]
3. Add a coverage check: if fewer than 10 companies match the 
   student's target geography (read from config/profile.yml), 
   output a warning: "Limited dataset coverage for your target 
   geography. Sponsorship scores may be unreliable. Consider 
   expanding your geographic target or using Unknown-tier defaults."

Do not change the scoring formula or tier thresholds.
Do not add features not listed here.
Output the complete updated script in a labeled code block.
Show a diff summary at the end: what changed and why.
```

**EXPECTED OUTPUT:** Complete updated script in a labeled code block. Diff summary lists every change with the reason. No new features introduced. The coverage warning fires when fewer than 10 geography matches exist.

**HANDOFF CONDITION:** The script runs without error against your actual CSV. Test: `node scripts/query-sponsorship.mjs "Moderna"` produces a JSON output. If it throws, the integration is not done.

**DEPENDENCY:** Step 11 complete.

---

### STEP 13 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The verified `skills/score.md` and `skills/evaluate.md` from Step 8. The `skills/score-sponsorship.md` from Step 10. The SDD Component 4 (OPT Framing Generator) in full. The verified `config/profile.yml`.

**PROMPT:**
```
I am building the OPT Framing Generator for The Reallocation Engine. This component 
generates visa-aware application materials after the student has 
confirmed they want to apply to a role.

I need you to write skills/frame.md — the framing skill file.

It must contain:

SECTION 1: Framing rules by sponsorship tier
(Copy these exactly — do not soften or generalize)

  Proven sponsors (tier = Proven):
    Mention OPT directly. These employers know the process.
    State authorization clearly: "Authorized to work in the US 
    through [opt_expiration or stem_opt_expiration]."
    Surface FICA savings if relevant to the role level.
    
  Likely sponsors (tier = Likely):
    Lead with authorization, not visa type.
    Frame: "Authorized to work in the US through [date] with 
    eligibility for extension."
    Surface FICA exemption as a concrete employer benefit.
    Do not use the word "OPT" unless the employer asks.
    
  Unknown sponsors (tier = Unknown):
    Do NOT mention OPT, visa status, or work authorization 
    in initial application materials.
    Focus entirely on fit and proof.
    Framing handled in interview prep only, not in written materials.
    
  Avoid (tier = Avoid):
    Do not generate materials. System should have already 
    returned SKIP. If reached here, output error and stop.

SECTION 2: Professional summary generation rules
  - Read cv.md for experience and proof points
  - Read article-digest.md for quantified achievements
  - Never fabricate metrics — only use numbers that appear in 
    these files
  - Maximum 4 sentences
  - Must include: strongest proof point, target role alignment, 
    one forward-looking statement
  - Must NOT include: visa status (unless Proven-tier rules apply), 
    generic claims without proof, passive voice

SECTION 3: Cover letter framing rules
  - Maximum 3 paragraphs
  - Paragraph 1: specific connection to this company and role
  - Paragraph 2: strongest relevant proof point, quantified
  - Paragraph 3: forward-looking + authorization statement 
    (tier-dependent per Section 1)
  - Must NOT include: "I am a quick learner", "I am passionate about",
    "I believe I would be a great fit", any claim not backed by cv.md

SECTION 4: Red-flag language to avoid in all materials
  List at minimum 10 phrases that trigger ATS rejection or 
  employer visa aversion, with the preferred alternative for each.

SECTION 5: The human gate
  After generating all materials, output exactly this:
  
  "--- REVIEW REQUIRED ---
  Materials generated for: [company] — [role]
  Sponsorship tier: [tier]
  Visa timeline: [X] days remaining on current authorization
  
  Before submitting, verify:
  [ ] Professional summary accurately represents your experience
  [ ] All metrics appear in your cv.md or article-digest.md
  [ ] Cover letter paragraph 1 references something specific 
      about this company (not generic)
  [ ] Authorization framing matches your actual visa status
  [ ] You have read the full job description, not just the title
  
  Type CONFIRM to save materials to output/ and log to tracker.
  Type REVISE [section] to request changes.
  Do not submit without completing this checklist."

Output skills/frame.md in a labeled code block.
```

**EXPECTED OUTPUT:** `skills/frame.md` with all five sections. Section 1 framing rules are verbatim from the prompt — not paraphrased. Section 5 human gate checklist has exactly five items. The AVOID tier rule outputs an error and stops — it does not generate anything.

**HANDOFF CONDITION:** Read Section 1 aloud for the Unknown-tier rule. It must say clearly: do not mention OPT, visa status, or work authorization in initial materials. If Claude has softened this to "consider not mentioning" or "you may want to omit," that is a failure. Rewrite before proceeding.

**DEPENDENCY:** Steps 8 and 9 complete.

---

### STEP 14 · PHASE B · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [IJ] — Interpretive Judgment — You are deciding whether the OPT framing rules are correct for your specific situation and market. The SDD's rules are a reference. Your judgment about your target employers is the ground truth.

**ACTION:** Before Step 15, test the framing rules against your actual target companies:

1. Take three companies from your target list — one Proven, one Likely, one Unknown tier.
2. For each: read the framing rule Claude generated and ask — if a recruiter at this specific company received a cover letter written under this rule, would it help or hurt?
3. For Unknown-tier companies: is there ever a case where you would voluntarily disclose OPT status in initial materials — for example, if the job description explicitly asks about work authorization? If yes, add this as an exception to Section 1 of `skills/frame.md` directly.
4. Check the red-flag language list in Section 4. Add any phrases you have used in past applications that got no response. These are empirical data points about your specific application history.

Make any edits directly to `skills/frame.md`. This is a user-layer judgment call — Claude does not make it for you.

**DEPENDENCY:** Step 13 complete.

---

### STEP 15 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The SDD Component 5 (Pipeline Tracker) documentation. The verified `config/profile.yml`. The `skills/evaluate.md` output format from Step 8. The SDD canonical status definitions.

**PROMPT:**
```
I am building the Pipeline Tracker for The Reallocation Engine. This component logs 
every application decision and produces a daily allocation summary.

I need you to write two things:

FILE 1: skills/track.md
The tracking skill. It must contain:

SECTION 1: Tracker schema
The applications.md tracker uses this exact table structure:
# | Date | Company | Role | Sponsorship Tier | Composite Score | 
Status | Visa Timeline Flag | Materials | Notes

Canonical statuses (use exactly these, no variations):
  Evaluated    — score generated, decision pending
  Applied      — materials submitted by student
  Responded    — company has contacted student
  Interview    — active interview process
  Offer        — offer received
  Rejected     — rejected by company
  Skipped      — student chose not to apply after scoring
  Expired      — role closed or visa timeline conflict emerged

Visa Timeline Flag values:
  OK           — role timeline compatible with current authorization
  WATCH        — role timeline within 30 days of authorization end
  CONFLICT     — role timeline extends beyond authorization end

SECTION 2: Log entry rules
  - One entry per role evaluated (including SKIPs — log the score 
    and reason)
  - Never create duplicate entries for the same company+role
  - Update existing entries when status changes — do not add new rows
  - Materials field: link to output/{company-slug}/ if generated, 
    else "none"

SECTION 3: Daily allocation summary format
Output this summary at the end of each session:

  === DAILY SUMMARY ===
  Applications submitted today: N
  Roles evaluated today: N
  SKIP rate today: N% (target: >= 50% — if below 50%, 
    your threshold may be too low)
  
  This week:
  Applied: N | Responded: N | Interview: N
  Avg composite score of applications: X.X
  Sponsorship tier distribution: Proven X%, Likely X%, Unknown X%
  
  TIME ALLOCATION REMINDER:
  You have submitted N applications this week.
  Suggested remaining time budget: 
    [2hrs - time spent] on applications
    3hrs on networking
    3hrs on portfolio
  === END SUMMARY ===

SECTION 4: Response rate tracking
  After 2 weeks of data, calculate:
  Response rate = (Responded + Interview + Offer) / Applied
  Benchmark: 25% for customized applications
  If response rate < 10%: flag "Response rate below threshold. 
    Review your composite score minimum — you may be applying 
    to CONSIDER-rated roles too frequently."

FILE 2: data/applications.md
An empty tracker file with just the header row and one example 
entry (clearly marked as EXAMPLE — DELETE THIS ROW) showing 
the correct format.

Output each in a labeled code block.
```

**EXPECTED OUTPUT:** `skills/track.md` with all four sections. Daily allocation summary includes the SKIP rate target (≥50%) and the 3-3-2 time allocation reminder. `data/applications.md` has the header row plus one clearly labeled example entry showing every field populated correctly.

**HANDOFF CONDITION:** Read the SKIP rate target. It says ≥50%. This is the reallocation principle made concrete: if you are applying to more than half the roles you evaluate, the system is not filtering aggressively enough. If this target makes you uncomfortable, that discomfort is worth examining before your job search begins.

**DEPENDENCY:** Steps 13 and 14 complete.

---

### STEP 16 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The complete `CLAUDE.md` from Step 6. All five skill files (`skills/evaluate.md`, `skills/score.md`, `skills/score-sponsorship.md`, `skills/frame.md`, `skills/track.md`). The SDD onboarding sequence.

**PROMPT:**
```
I need you to write the onboarding skill for The Reallocation Engine — the first-run 
experience for a new student configuring the system.

FILE: skills/onboard.md

The onboarding skill runs when any of these files are missing:
  cv.md, config/profile.yml, skills/_profile.md

It must guide the student through these steps in order, 
stopping at each until the student provides the required input:

STEP 1: CV collection
If cv.md is missing, ask:
"I need your CV to calculate fit scores. You can:
  1. Paste your CV text here — I will convert it to clean markdown
  2. Tell me your experience and I will draft a CV for you
  Which do you prefer?"
Create cv.md from their input. Standard sections: 
Summary, Experience, Projects, Education, Skills, Certifications.
One rule: never add metrics that the student has not provided.

STEP 2: Visa timeline collection  
If config/profile.yml is missing or visa fields are empty, ask:
"I need your visa timeline to filter roles correctly. 
What is your current visa status and OPT expiration date?"
Populate the visa section of profile.yml.
Display back: "Your work authorization ends in X days. 
STEM OPT extension [is/is not] available to you."
Require student to confirm this is correct before proceeding.

STEP 3: Target role collection
Ask: "What roles and locations are you targeting? 
What is your minimum acceptable salary?"
Populate targets section of profile.yml.

STEP 4: Proof points
Ask: "What is your strongest professional achievement — 
the one you would lead with in any interview? 
Give me the specific metric."
Populate proof_points.lead_achievement in profile.yml.
Add to article-digest.md as first entry.

STEP 5: The honest system briefing
After setup is complete, output this exactly — do not paraphrase:

"The Reallocation Engine is ready. Before your first evaluation, understand what 
this system does and does not do:

WHAT IT DOES:
- Scores roles by probability of visa-safe hire, not by brand name
- Tells you to SKIP more often than APPLY — that is correct behavior
- Generates application materials only after you confirm apply
- Stops before submission — you control every send

WHAT IT DOES NOT DO:
- Submit applications for you
- Guarantee visa sponsorship
- Replace networking and portfolio work
- Know what changed at a company last week

YOUR REALLOCATION TARGET:
2 hours/day on applications (this system)
3 hours/day networking
3 hours/day portfolio

If you find yourself spending more than 2 hours/day in The Reallocation Engine, 
the system is failing its core purpose.

Type READY when you understand this."

STEP 6: First evaluation prompt
After student types READY:
"Paste a job URL or description to run your first evaluation."

Write skills/onboard.md in a labeled code block.
```

**EXPECTED OUTPUT:** `skills/onboard.md` with all six steps. Step 2 requires explicit student confirmation of the visa timeline display before proceeding — not just input, but confirmation. Step 5 honest briefing is verbatim — not paraphrased, not softened. The reallocation target (2+3+3) appears in the briefing exactly.

**HANDOFF CONDITION:** Read Step 5 aloud. The sentence "If you find yourself spending more than 2 hours/day in The Reallocation Engine, the system is failing its core purpose" must appear verbatim. If Claude has removed this sentence or softened it, the onboarding skill has lost its purpose.

**DEPENDENCY:** Steps 15 complete.

---

### STEP 17 · PHASE H · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [EI] — Executive Integration — You are running the complete system end-to-end for the first time with a real job posting. This is the integration test. You are holding all five components simultaneously and watching for the wrong note anywhere in the chain.

**ACTION:** Choose one real job posting — ideally one you were considering applying to before building The Reallocation Engine. Run it through the complete pipeline:

1. Start Claude Code in your project directory
2. Paste the job URL or description
3. Watch the evaluation execute through `skills/evaluate.md`
4. Observe the sponsorship query hit your 80 Days dataset
5. Read the composite score and score breakdown
6. If APPLY: proceed through framing and review the generated materials
7. Read the human gate checklist in Section 5 of `skills/frame.md`

**After the run, audit these specific things:**

- Did the visa timeline factor calculate correctly for your actual dates?
- Did the sponsorship tier match your prior expectation of this company?
- Did the composite score feel right — would you make the same apply/skip decision without the system?
- Did the OPT framing rule apply correctly for this company's tier?
- Did the human gate appear before anything was saved or logged?

Write down every discrepancy. These become your hardening list for Step 18.

**DEPENDENCY:** All Phase B steps complete (Steps 13–16).

---

### STEP 18 · PHASE H · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** Your Step 17 hardening list. The specific skill file where each discrepancy originated. The original SDD edge cases for the relevant components.

**PROMPT:**
```
I have run The Reallocation Engine end-to-end against a real job posting and found 
the following discrepancies:

[PASTE YOUR STEP 17 HARDENING LIST HERE]

For each discrepancy, I need a targeted fix to the relevant skill file.
Do not rewrite entire files — make surgical changes only.

For each fix:
1. Name the file being changed
2. Quote the exact text being replaced
3. Provide the replacement text
4. Explain in one sentence why this fix is correct

Do not introduce new features.
Do not change the scoring weights or tier thresholds unless the 
discrepancy is specifically about a calculation error.
Output all fixes as a numbered list of targeted edits.
```

**EXPECTED OUTPUT:** A numbered list of targeted edits, each with file name, original text, replacement text, and one-sentence justification. No full file rewrites. No new features.

**HANDOFF CONDITION:** Every item on your Step 17 hardening list has a corresponding fix. If any discrepancy does not have a fix, it must be logged in the Open Questions section of the SDD — not silently dropped.

**DEPENDENCY:** Step 17 complete.

---

### STEP 19 · PHASE R · HUMAN TASK

**LABOR:** Human

**SUPERVISORY CAPACITY:** [IJ] — Interpretive Judgment — You are deciding whether The Reallocation Engine is ready to govern your actual job search. This is the most important judgment in the build. The system can be technically complete and still be wrong for your situation.

**ACTION:** Before using The Reallocation Engine for your real job search, answer these questions honestly:

1. Do you trust the Bayesian weights you chose in Step 7, now that you have seen the system run? If not, adjust them — this is the right moment, not after 20 applications.
2. Did the 80 Days dataset have adequate coverage of your actual target companies? If fewer than 30% of your real targets are in the dataset, the system's core differentiator is not active yet.
3. Is your cv.md current and accurately quantified? If your proof points are vague, the fit score will be artificially low and you will under-apply to roles you should pursue.
4. Have you told one person — a career advisor, a peer, anyone — about the reallocation target (2+3+3)? The system enforces the allocation through reminders. You enforce it through commitment.

Write your answers. If any answer reveals a gap, fix the gap before the first real application.

**DEPENDENCY:** Step 18 complete.

---

### STEP 20 · PHASE R · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The complete `README.md` skeleton from Step 4. All skill files. The `config/profile.example.yml` from Step 2. The SDD ethical use section.

**PROMPT:**
```
I need you to complete the README.md for The Reallocation Engine using the skeleton 
generated in the project setup step.

Fill in these sections:

WHAT IS THIS (2 paragraphs):
  Paragraph 1: What The Reallocation Engine does in plain English — lead with 
    "reallocation engine," explain the 3-3-2 split and how The Reallocation Engine 
    compresses the "2"
  Paragraph 2: What it does NOT do — auto-submit, predict visa 
    outcomes, replace networking and portfolio work

QUICK START (numbered steps):
  1. Clone the repo
  2. npm install (for query-sponsorship.mjs dependencies)
  3. Copy config/profile.example.yml to config/profile.yml and fill in
  4. Add your CV: create cv.md in root with your CV in markdown
  5. Download 80 Days dataset to data/80days-snapshot.csv 
     [link: https://github.com/nikbearbrown/80-Days-to-Stay]
  6. Open Claude Code in this directory
  7. Type: /visaops to begin

THE REALLOCATION ENGINE (1 paragraph):
  Explain the Bayesian scoring model — that it combines sponsorship 
  history, CV fit, role liveness, and visa timeline into a single 
  apply/skip recommendation. Name each factor. State that weights 
  are configurable in skills/_profile.md.

ADAPTING TO YOUR SITUATION (1 paragraph):
  Explain that the weights, framing rules, and tier thresholds 
  are designed to be changed. Point to skills/_profile.md as 
  the customization layer. Give two concrete examples: 
  "If you have < 6 months of OPT remaining, increase the 
  visa_timeline_factor weight. If you have a strong referral network,
  add a referral override multiplier."

DATA SOURCES (bulleted list):
  - 80 Days to Stay dataset (SEC Form D + DOL LCA + USCIS H-1B)
  - DOL LCA Disclosure Data (public, quarterly)
  - USCIS H-1B Employer Data Hub (public)
  - ATS portals: Greenhouse, Ashby, Lever (public endpoints)

ETHICAL USE (3 bullet points):
  Pull these verbatim from the SDD ethical use framing:
  - Never submit without review
  - Quality over quantity — SKIP rate >= 50% is the target
  - Framing must be accurate, not misleading

Do not add sections not listed here.
Do not add installation troubleshooting, FAQ, or licensing sections 
  in this version.
Output the complete README.md in a labeled code block.
```

**EXPECTED OUTPUT:** Complete `README.md` with all six sections populated. "Reallocation engine" appears in the first sentence of What Is This. The SKIP rate target (≥50%) appears in Ethical Use. The Adapting section names `skills/_profile.md` specifically as the customization layer.

**HANDOFF CONDITION:** Read the Ethical Use section. All three bullets are present and accurate. If the README has softened "SKIP rate >= 50% is the target" to a suggestion, rewrite it.

**DEPENDENCY:** Step 19 complete.

---

## SCORE SUMMARY

**Total steps:** 20
**Claude tasks:** 10 (50% of steps)
**Human tasks:** 10 (50% of steps)

---

**CRITICAL PATH:**
Step 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20

Every step depends on the one before it. There is no parallelization in this build. This is intentional: the visa timeline layer must be correct before anything else runs, and the scoring weights must be human-decided before Claude writes a single scoring formula.

---

**HIGHEST-RISK HANDOFFS:**

**Risk 1 — Step 3 (visa date verification):** The student must verify their OPT expiration date against their actual I-20 before proceeding. An error here propagates into every composite score the system produces. Students under visa pressure may rush this step. They must not.

**Risk 2 — Step 9 (scoring formula stress test):** Students who skip the manual calculation step will not know if their formula has an error until the system gives them a recommendation they know is wrong — at which point they may have already acted on several incorrect recommendations. This step cannot be shortened.

**Risk 3 — Step 17 (end-to-end integration test):** The integration test uses a real posting the student was considering. Students may be tempted to use a "safe" test case. The test is only meaningful if it runs against a real decision. A discrepancy found in Step 17 is valuable. A discrepancy found in week 3 of the job search is damaging.

---

**SUPERVISORY CAPACITY DISTRIBUTION:**
- [PA] Plausibility Auditing: 3 steps (Steps 3, 9, 11)
- [PF] Problem Formulation: 3 steps (Steps 1, 5, 7)
- [TO] Tool Orchestration: 1 step (Step 11)
- [IJ] Interpretive Judgment: 4 steps (Steps 14, 15, 17, 19) — note Step 15 handles both tracking and the SKIP rate commitment
- [EI] Executive Integration: 1 step (Step 17)

**No capacity appears at zero. All five are exercised.**

Note: [EI] appears only once (Step 17) — this is correct. Executive Integration is the hardest capacity to exercise early in a build. Step 17 is the moment the student holds all five components simultaneously for the first time. That moment should come once, clearly, with full weight.

---

**WHAT IS MISSING FROM THIS SCORE:**

When the following SDD sections are built out, these additional steps can be added:

- **ATS Portal Scanner** (IMPORTANT priority) — when built, adds Steps 10a and 10b between the current Steps 10 and 11: Claude generates the scanner script, human verifies against live Greenhouse/Ashby/Lever endpoints for their target companies.

- **Allocation Dashboard** (IMPORTANT priority) — when built, adds a Phase H step after Step 16: visualization of the weekly 3-3-2 split against actual logged time.

- **Referral override multiplier** (NICE-TO-HAVE) — when built, adds a half-step at Step 7: student decides referral override formula before Claude writes the scoring logic.

---

## MINION BRIEF

*Stripped version — Claude prompts and handoff conditions only, in dependency order, for execution without re-reading the full score.*

---

**STEP 2 · PHASE F · CLAUDE TASK**
Context: Student's personal data from Step 1 (visa timeline, target roles, proof points).
---
[Full prompt as above — paste Step 1 answers where indicated]
---
Handoff condition: Every field in profile.yml maps to a Step 1 answer. opt_expiration is correct to the day.
Depends on: Step 1 (human)

---

**STEP 4 · PHASE F · CLAUDE TASK**
Context: Verified profile.yml. SDD data contract.
---
[Full prompt as above]
---
Handoff condition: .gitignore excludes every user-layer file. config/profile.yml is gitignored.
Depends on: Step 3 (human)

---

**STEP 6 · PHASE F · CLAUDE TASK**
Context: Step 5 brief. Verified profile.yml. SDD architecture principles verbatim.
---
[Full prompt as above — paste Step 5 brief and profile.yml where indicated]
---
Handoff condition: Hard Rules section has ≥ 8 rules. Architecture Principles match SDD verbatim.
Depends on: Step 5 (human)

---

**STEP 8 · PHASE C · CLAUDE TASK**
Context: Step 7 weight decisions. SDD Components 1 and 3.
---
[Full prompt as above — paste weight decisions where indicated]
---
Handoff condition: Manual test case produces correct composite score. Hard gate fires correctly if chosen.
Depends on: Step 7 (human)

---

**STEP 10 · PHASE I · CLAUDE TASK**
Context: SDD Component 2. Data contract. Verified skills/score.md.
---
[Full prompt as above]
---
Handoff condition: Fuzzy match handles "Inc."/"Corp." variants but does not over-match. Script runs without error.
Depends on: Steps 8, 9 (human)

---

**STEP 12 · PHASE I · CLAUDE TASK**
Context: Step 11 findings. First 3 rows of actual CSV. query-sponsorship.mjs from Step 10.
---
[Full prompt as above — paste findings and CSV rows where indicated]
---
Handoff condition: Script runs against actual CSV. node scripts/query-sponsorship.mjs "Moderna" produces JSON.
Depends on: Step 11 (human)

---

**STEP 13 · PHASE B · CLAUDE TASK**
Context: skills/score.md, skills/evaluate.md, skills/score-sponsorship.md. SDD Component 4. profile.yml.
---
[Full prompt as above]
---
Handoff condition: Unknown-tier rule says do not mention OPT — not "consider omitting." Human gate checklist has exactly 5 items.
Depends on: Steps 8, 9 (human)

---

**STEP 15 · PHASE B · CLAUDE TASK**
Context: SDD Component 5. profile.yml. evaluate.md output format. SDD canonical statuses.
---
[Full prompt as above]
---
Handoff condition: SKIP rate target (≥50%) appears in daily summary. 3-3-2 time allocation reminder appears verbatim.
Depends on: Steps 13, 14 (human)

---

**STEP 16 · PHASE B · CLAUDE TASK**
Context: Complete CLAUDE.md. All five skill files. SDD onboarding sequence.
---
[Full prompt as above]
---
Handoff condition: "If you find yourself spending more than 2 hours/day in The Reallocation Engine, the system is failing its core purpose" appears verbatim in Step 5 of onboarding.
Depends on: Step 15

---

**STEP 18 · PHASE H · CLAUDE TASK**
Context: Step 17 hardening list. Relevant skill files. SDD edge cases.
---
[Full prompt as above — paste hardening list where indicated]
---
Handoff condition: Every item on hardening list has a corresponding fix or is logged as an open question.
Depends on: Step 17 (human)

---

**STEP 20 · PHASE R · CLAUDE TASK**
Context: README skeleton. All skill files. profile.example.yml. SDD ethical use section.
---
[Full prompt as above]
---
Handoff condition: "Reallocation engine" in first sentence. SKIP rate ≥50% in Ethical Use. skills/_profile.md named in Adapting section.
Depends on: Step 19 (human)

---

*The Reallocation Engine — Boondoggle Score v0.1 — Humanitarians AI / Irreducibly Human Curriculum*
*The SDD is the music. This score tells you who plays what, in what order, and when to listen for the wrong note.*
