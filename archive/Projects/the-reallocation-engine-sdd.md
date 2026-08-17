# The Reallocation Engine — Software Design Document
**Version:** 0.1 (Draft for Student Review)
**Owner:** Humanitarians AI / Irreducibly Human Curriculum
**Status:** Pre-implementation — students read, critique, and boondoggle before building

---

## Document Purpose

This SDD is a reference architecture, not a prescription. Students are expected to read every decision, understand the reasoning behind it, and then make their own design choices when they build. Where this document says "we chose X over Y," that is an invitation to disagree. The boondoggle score you produce is the interpretation of this document — not a copy of it.

---

## 1. One-Page Problem Summary

International students on F-1/OPT/STEM OPT visas are spending 8 hours a day applying to the same 500 well-known companies — generating ATS rejections, tanking their Eightfold AI employer scores, and exhausting the search before it begins. They are not applying to the 5,000+ funded small labs and startups that would sponsor them, because those companies are invisible on standard job boards. They have zero time for networking or portfolio work — the two activities with the highest return on hire probability.

The damage is compounding. Every random application to a company with no sponsorship history lowers their algorithmic score across platforms. Every hour spent clicking "Easy Apply" is an hour not spent building the portfolio proof that now commands a 56% wage premium. Every application to a ghost job (28-42% of all postings) is wasted attention on a role that will never be filled.

This is not a motivation problem. It is a resource allocation problem caused by information asymmetry: students cannot see which companies sponsor, which are funded enough to afford sponsorship, and which roles have a non-zero probability of resulting in a visa-safe hire.

**The Reallocation Engine** is a CLI-resident skill system inserted between an international student's job search attention and their daily application decisions. It produces a Bayesian sponsorship score, a ranked shortlist of visa-safe targets drawn from the 80 Days dataset and public ATS portals, and a daily apply/skip recommendation — so the student spends 2 hours applying and 6 hours networking and building portfolio.

**This system succeeds when the student sends fewer applications with higher hit rates — not more applications.**

**Comparable systems:** career-ops (evaluation pipeline, no visa layer) meets 80 Days to Stay (sponsorship dataset, no application pipeline) in the context of a time-constrained, visa-aware job search.

**Success condition:** A student can execute the full 3-3-2 split because The Reallocation Engine compresses the "2" to a manageable daily decision backed by real probability estimates.

**Biggest unresolved question at problem definition:** The Eightfold AI score damage from random applications is real but not directly measurable by the student. Does The Reallocation Engine need to model this risk explicitly in its scoring, or is the sponsorship score sufficient to prevent the behavior?

---

## 2. Architecture Principles

### Principle 1: Reallocation over automation
**Commitment:** Every feature must free up student time for networking and portfolio work — not just make applying faster. If a feature makes it easier to apply to more jobs without improving targeting quality, it violates this principle.

**Honors:** Bayesian scoring that says "skip this one" as often as "apply to this one."
**Violates:** A batch-apply feature that submits 20 applications in parallel.
**Failure state in production:** Student applies to 30 companies a day instead of 5, tanks their Eightfold score faster, burns out in week 3.

### Principle 2: Visa timeline is a first-class constraint
**Commitment:** Every component — scoring, targeting, framing, scheduling — is aware of OPT expiration date, STEM OPT eligibility window, and H-1B lottery timing. A role that closes after the student's work authorization expires is not a valid target regardless of fit score.

**Honors:** Filtering out roles whose expected timeline conflicts with visa expiration.
**Violates:** Generating a perfect CV for a role the student cannot legally accept.
**Failure state in production:** Student invests 3 hours on an application that cannot result in a hire.

### Principle 3: Probability over polish
**Commitment:** The system's primary output is a probability estimate — not a document. CVs and cover letters are downstream of the apply/skip decision. The Bayesian score comes first. Document generation happens only after the human confirms apply.

**Honors:** Showing the math behind a recommendation before generating materials.
**Violates:** Auto-generating a tailored CV for every role in the shortlist "just in case."
**Failure state in production:** Student has 47 tailored CVs and no time to send them thoughtfully.

### Principle 4: The human gate is not optional
**Commitment:** The Reallocation Engine never submits an application. It never sends an email. It stops at the point of human decision. The student reviews the score, the reasoning, and the materials — then acts. This is not a safety guardrail bolted on afterward. It is the architecture of the system.

**Honors:** A clear STOP after generating materials with a checklist the student must confirm.
**Violates:** Any feature that "applies on your behalf" even with confirmation buried in settings.
**Failure state in production:** Student loses control of their own application narrative. One bad auto-submit to a company with an immigration freeze ends the relationship permanently.

---

## 3. Core User Flows

### Primary Flow: Daily Decision

```
Student opens The Reallocation Engine (CLI)
        │
        ▼
System checks visa timeline
        │ OPT days remaining, STEM OPT eligibility, H-1B window
        ▼
System queries 80 Days dataset
        │ Filters for funded companies matching target roles
        │ Applies sponsorship history score (DOL LCA + USCIS data)
        ▼
System scans ATS portals for open roles at shortlisted companies
        │ Greenhouse / Ashby / Lever APIs (zero LLM cost)
        ▼
Bayesian scoring for each open role
        │ P(sponsorship) × P(fit | CV) × P(role is real) × visa_timeline_factor
        ▼
Ranked shortlist presented to student
        │ Top 3-5 roles with scores, reasoning, and apply/skip recommendation
        ▼
[HUMAN DECISION POINT]
        │ Student selects a role or dismisses all
        ▼
If APPLY selected:
  Research brief generated (company, recent news, OPT framing notes)
  Tailored CV generated (ATS-optimized, visa-aware framing)
  Cover letter generated (OPT-aware, specific to role)
        │
        ▼
[HUMAN REVIEW GATE — MANDATORY STOP]
  Student reviews all materials
  Student confirms or requests revision
        │
        ▼
Materials saved to /output/{company-slug}/
Application logged to tracker with visa timeline metadata
Daily allocation reminder: "You have X hours for networking today."
```

### Failure Path: No valid targets today

```
System finds no roles meeting minimum Bayesian threshold (default: 0.3)
        │
        ▼
System reports: "No high-probability targets today."
Reports why: sponsorship score too low / visa timeline conflict / role likely ghost
        │
        ▼
[REALLOCATION PROMPT]
"No applications worth sending today. Suggested use of your 2 hours:
  - Update article-digest.md with your latest project metrics
  - Research 3 companies from the small-lab shortlist for informational interviews
  - Add 5 contacts to your networking queue"
```

**Flow Honesty Test:** If this pipeline were a command-line prototype with no UI, no branding, and no secondary features — would it solve the stated problem? Yes. The core value is the Bayesian score and the apply/skip recommendation. Everything else is downstream.

### Administrative Flow: Profile setup and maintenance

```
First run → onboarding sequence:
  Collect visa type, OPT expiration, STEM OPT eligibility
  Collect target roles and locations
  Ingest CV (paste or file)
  Set comp floor and deal-breakers
  Configure 80 Days dataset path or API endpoint

Ongoing maintenance:
  Student updates visa timeline as dates change
  Student adds new portfolio proof points to article-digest.md
  System learns from apply/skip decisions to improve scoring
```

---

## 4. User and Business Needs

**N1 — Visa-safe targeting**
The student must be able to see only companies with a non-zero sponsorship history when their work authorization requires sponsorship, without manually cross-referencing DOL and USCIS datasets, so they stop wasting applications on companies that will auto-reject them.

**N2 — Bayesian apply/skip decision**
The student must be able to receive a probability-backed apply/skip recommendation for each role, without doing the math themselves, so they can make a confident decision in under 5 minutes per role.

**N3 — Visa-aware framing**
The student must be able to generate application materials that correctly frame their OPT status (no sponsorship required now, FICA-exempt, 1-3 years before H-1B needed) for employer audiences who misunderstand it, without having to research the framing themselves each time.

**N4 — Timeline awareness**
The student must be able to see how many OPT days remain and which roles in their pipeline have timelines that conflict with their visa expiration, without tracking this in a separate spreadsheet, so they never invest in a role they cannot legally accept.

**N5 — Allocation enforcement**
The student must receive a daily reminder of how much time they have spent on applications vs. networking vs. portfolio, so the 3-3-2 split is visible and actionable rather than theoretical.

**N6 — Ghost job filtering**
The student must be able to see a liveness score for each role (estimated probability the role is real and currently being filled), so they stop spending time on postings that are spectral.

**N7 — Small lab visibility**
The student must be able to discover funded startups and small labs in their target geography and field that are invisible on standard job boards but appear in the 80 Days dataset, without running their own SEC/DOL data pipeline.

**Component filter check:** Every component in this SDD maps to at least one need above. Any component that maps to no need is a scope violation.

---

## 5. Core Component Documentation

### Component 1: Visa Timeline Manager
**Need served:** N2, N4, N6

**The problem it solves:** Students track visa deadlines in their head or in a spreadsheet. When a role has a 3-month hiring process and their OPT expires in 2 months, they cannot accept the role. This is not visible at application time.

**How it works:**
- Inputs: visa type, OPT start date, STEM OPT eligibility (Y/N), cap-gap eligibility
- Outputs: days remaining on current authorization, STEM OPT extension window, H-1B lottery eligibility date, per-role timeline conflict flag
- State changes: updates when student reports visa status change
- Error signals: warns when OPT expiration is within 90 days with no STEM extension filed

**Principle alignment:** Principle 2 (visa timeline is a first-class constraint)

**Edge cases:**
- Student files for STEM OPT extension — timeline updates immediately
- Student wins H-1B lottery — system shifts to H-1B cap-gap mode
- Student's employer files for H-1B and loses — emergency re-targeting mode
- Cap-gap eligibility depends on lottery timing the system cannot predict

**Scope boundary:** Does not file visa paperwork. Does not provide legal immigration advice. Outputs a date-aware flag, not a legal determination.

**Architecture decision:** We store visa dates in `config/profile.yml` (user layer, never auto-updated). Alternative considered: a separate `visa.yml` file. We rejected this because it creates two files students must keep in sync.

---

### Component 2: 80 Days Sponsorship Scorer
**Need served:** N1, N7

**The problem it solves:** Students cannot see which companies have actually sponsored visas historically. The 80 Days dataset (SEC Form D + DOL LCA + USCIS H-1B approval data) contains this information but requires a data pipeline to query.

**How it works:**
- Inputs: company name (or EIN), target role category, geographic filter
- Outputs: sponsorship_score (0.0–1.0), sponsorship_tier (Proven/Likely/Unknown/Avoid), historical LCA filing count, H-1B approval rate, funding amount and date
- State changes: none (read-only query against dataset)
- Error signals: company not found in dataset → Unknown tier, flag for manual research

**Scoring formula (Bayesian prior):**

```
P(sponsorship) = weighted combination of:
  - LCA filing rate (last 3 years): weight 0.40
  - H-1B approval rate (USCIS data): weight 0.30
  - Funding recency (SEC Form D): weight 0.20
  - Company size proxy (headcount growth): weight 0.10

Tiers:
  Proven:  P(sponsorship) >= 0.65
  Likely:  P(sponsorship) >= 0.35
  Unknown: P(sponsorship) < 0.35, no LCA history
  Avoid:   Active freeze signals OR P(denial) > P(approval)
```

**Principle alignment:** Principle 3 (probability over polish)

**Edge cases:**
- Company recently acquired — LCA history may transfer or not
- Startup with no LCA history but $10M+ funding — Unknown tier with positive funding signal
- Company on USCIS site visit list — flag as elevated risk
- Dataset lag: DOL LCA data updates quarterly, creates staleness window

**Scope boundary:** Does not predict future sponsorship decisions. Does not account for per-role sponsorship policy variation within a company. Outputs a probability, not a guarantee.

**Architecture decision:** Dataset stored locally as a CSV/JSON snapshot updated periodically from the 80 Days pipeline. Alternative considered: live API query. We rejected live API for v1 because it creates a network dependency that breaks the CLI for students without stable internet access.

---

### Component 3: Bayesian Role Scorer
**Need served:** N2, N6

**The problem it solves:** Students have no way to compare the actual probability of a successful outcome across roles. They apply based on brand recognition, not probability.

**How it works:**
- Inputs: role posting (URL or text), CV (cv.md), sponsorship score from Component 2, visa timeline from Component 1
- Outputs: composite_score (0.0–1.0), apply/skip recommendation, score breakdown by dimension, confidence level
- State changes: logs decision to tracker for future score calibration

**Scoring formula:**

```
composite_score = 
  P(sponsorship)           × 0.35   [from Component 2]
  × P(fit | CV, JD)        × 0.30   [CV-JD match via LLM]
  × P(role_is_real)        × 0.20   [liveness check]
  × visa_timeline_factor   × 0.15   [from Component 1]

Recommendation:
  APPLY:  composite_score >= 0.45
  CONSIDER: composite_score 0.25–0.44 (surface with caveats)
  SKIP:   composite_score < 0.25

Confidence levels:
  HIGH:   All four inputs are data-backed
  MEDIUM: One input estimated (e.g., liveness unverifiable)
  LOW:    Two or more inputs estimated
```

**Why these weights:** Sponsorship is weighted highest because it is the constraint unique to international students. A perfect fit score at a company that will never sponsor is a zero-value application. Students can make this call differently — the weights are explicit so they can be challenged.

**Principle alignment:** Principles 2 and 3

**Edge cases:**
- Role posting is vague — CV-JD match confidence drops, composite confidence = LOW
- Company has no LCA history but just raised Series A — Unknown tier, CONSIDER not APPLY
- Role deadline conflicts with OPT expiration — visa_timeline_factor = 0.0, SKIP regardless of other scores
- Student has a referral — override multiplier (referral increases P(fit) by documented 4-10×)

**Scope boundary:** Does not score networking opportunities, informational interview targets, or portfolio projects. Those are out of scope — this scorer is for formal job applications only.

---

### Component 4: OPT Framing Generator
**Need served:** N3

**The problem it solves:** Employers systematically misunderstand OPT. They think it requires immediate sponsorship, costs them money, and creates legal risk. None of this is true during the OPT/STEM OPT window. Students do not know how to correct this perception in application materials without sounding defensive.

**How it works:**
- Inputs: CV (cv.md), job description, visa timeline from Component 1, employer sponsorship tier from Component 2
- Outputs: OPT-aware professional summary, FICA-exemption note (where appropriate), visa timeline framing for cover letter, red-flag language to avoid
- State changes: none (generation only)

**Framing rules by sponsorship tier:**

```
Proven sponsors:    Mention OPT directly. They know the process.
Likely sponsors:    Lead with authorization ("authorized to work in the US 
                    through [date]"), surface FICA savings as a benefit.
Unknown sponsors:   Do NOT mention OPT in initial materials. Focus on fit.
                    Framing handled in interview prep, not application.
Avoid:              System recommends SKIP — framing irrelevant.
```

**Principle alignment:** Principle 2 (visa awareness), Principle 4 (human gate)

**Edge cases:**
- Student is STEM OPT eligible but hasn't filed yet — framing reflects current status only
- Employer is in a sector with known H-1B aversion (some government contractors) — flag
- Student has a gap between OPT programs — framing must not misrepresent authorization dates
- Cover letter length constraints vary by employer — framing must compress without losing key facts

**Scope boundary:** Does not provide legal immigration advice. Does not guarantee employer understanding. Generates framing copy — student reviews and approves before use.

---

### Component 5: Pipeline Tracker
**Need served:** N4, N5

**The problem it solves:** Students have no visibility into their application portfolio as a system. They do not know their response rate, their sponsorship-tier distribution, or how their daily allocation maps to outcomes.

**How it works:**
- Inputs: every apply/skip decision, application outcomes (responses, rejections, interviews), daily time logs (optional)
- Outputs: application tracker (Markdown table), allocation summary, response rate by sponsorship tier, visa timeline dashboard
- State changes: updates on every apply/skip decision

**Tracker fields:**
```
# | Date | Company | Role | Sponsorship Tier | Composite Score | 
Status | Visa Timeline Flag | Materials | Notes
```

**Allocation summary (daily):**
```
Today's allocation:
  Applications: X (target: 2 hrs)
  [Reminder: 3 hrs networking, 3 hrs portfolio remaining]
  
This week:
  Applied: N roles (avg score: X.X)
  Response rate: X% (benchmark: 25% for customized)
  Sponsorship tier distribution: Proven X%, Likely X%, Unknown X%
```

**Principle alignment:** Principle 1 (reallocation over automation)

**Edge cases:**
- Student applies outside The Reallocation Engine — tracker has gaps, response rate misleading
- Student does not log time — allocation summary shows applications only
- Multiple applications to same company for different roles — tracker must not deduplicate these
- Role status changes (filled, reposted) — tracker cannot auto-update, student must log

**Scope boundary:** Does not track networking activities or portfolio milestones. Those belong to a different tool. This tracker is for formal applications only.

---

## 6. External Integrations and Dependencies

### Integration 1: 80 Days Dataset
**Owner:** Humanitarians AI / Nik Bear Brown
**Protocol:** Local file read (CSV/JSON snapshot)
**Auth:** None (local file)
**Data:** Company name, EIN, funding amount/date, LCA filing history, H-1B approval rates
**Failure mode:** Dataset file missing or malformed → system falls back to Unknown tier for all companies, flags degraded mode
**Update cadence:** Manual refresh from 80 Days pipeline, targeting quarterly
**Dependency risk:** HIGH — this is the core differentiator. If the dataset is stale, sponsorship scores degrade.

### Integration 2: Greenhouse / Ashby / Lever APIs
**Owner:** Third-party ATS platforms
**Protocol:** HTTP GET (public endpoints, no auth required for job listings)
**Rate limits:** Varies by platform — scanner uses zero-LLM token approach (direct API, no agent)
**Failure mode:** API unavailable → cached listings used (up to 24h stale), flagged in output
**Dependency risk:** MEDIUM — platforms change API structure periodically

### Integration 3: DOL LCA Disclosure Data
**Owner:** U.S. Department of Labor (public)
**Protocol:** Bulk download (quarterly CSV release)
**Auth:** None (public data)
**Failure mode:** Download unavailable → use last snapshot, flag data date in UI
**Dependency risk:** LOW — public government data, stable release cadence

### Integration 4: USCIS H-1B Employer Data Hub
**Owner:** U.S. Citizenship and Immigration Services (public)
**Protocol:** Web scrape or bulk download
**Auth:** None (public data)
**Failure mode:** Data unavailable → sponsorship score uses LCA data only, confidence drops
**Dependency risk:** LOW — public government data

**Single point of failure:** The 80 Days dataset. If it is absent or severely stale, The Reallocation Engine degrades to a standard job evaluation pipeline with no visa-specific advantage. This must be documented prominently in onboarding.

---

## 7. Data Architecture

### User layer (never auto-updated — student's personal data)
```
cv.md                     # Canonical CV in markdown
config/profile.yml        # Identity, visa timeline, target roles, comp floor
skills/_profile.md         # Scoring weight overrides, framing preferences
article-digest.md         # Proof points and portfolio metrics
data/applications.md      # Application tracker
data/pipeline.md          # Pending URL inbox
```

### System layer (updatable — pipeline logic)
```
skills/_shared.md          # Scoring system, global rules
skills/evaluate.md         # Role evaluation instructions
skills/score.md            # Bayesian scoring prompt
skills/frame.md            # OPT framing generator
skills/track.md            # Tracker management
data/80days-snapshot.csv  # Sponsorship dataset (refreshable)
```

### State management strategy
Stateless between sessions. All persistent state lives in Markdown files in the user layer. No database. No server. This is a deliberate choice: students can read, edit, and version-control every piece of state their pipeline produces.

**Alternative considered:** SQLite database for tracker and scoring history. Rejected for v1 because it creates a dependency and prevents students from reading their own data without a query tool.

### Data sensitivity
`config/profile.yml` contains visa status and expiration dates — treat as sensitive. Never commit to a public repository. `.gitignore` must include all user-layer files by default.

---

## 8. Domain Model

### Ubiquitous Language

**Reallocation:** The act of moving student time from low-probability applications to networking and portfolio work. The system's primary goal.

**Sponsorship score:** A probability estimate (0.0–1.0) of whether a company will support a visa petition for a qualified candidate. Not a guarantee. A prior.

**Composite score:** The Bayesian combination of sponsorship score, CV-JD fit, role liveness, and visa timeline compatibility. The primary output of the Bayesian Role Scorer.

**Visa timeline factor:** A multiplier (0.0–1.0) applied to the composite score based on whether the expected hiring timeline is compatible with current work authorization. If the role cannot result in a hire before work authorization expires, this factor is 0.0.

**OPT framing:** Application language that correctly represents the student's work authorization status to employers who may misunderstand it. Not spin. Accurate information presented strategically.

**Ghost job:** A publicly listed role with low P(role_is_real) — estimated < 0.3. May be investor signaling, pipeline building, or abandoned requisition.

**Apply/skip recommendation:** The system's daily output for each role. Not a command. A probability-backed suggestion the student confirms or overrides.

**Common misuse to reject:** "Sponsorship score" does not mean the company will sponsor. It means the company has historically sponsored. Past behavior does not guarantee future behavior. Frame it always as a prior, not a prediction.

---

## 9. Component Priority List

| Component | Priority | Need served | MVS? |
|---|---|---|---|
| Visa Timeline Manager | MUST-BUILD | N2, N4 | Yes |
| 80 Days Sponsorship Scorer | MUST-BUILD | N1, N7 | Yes |
| Bayesian Role Scorer | MUST-BUILD | N2, N6 | Yes |
| OPT Framing Generator | MUST-BUILD | N3 | Yes |
| Pipeline Tracker | MUST-BUILD | N4, N5 | Yes |
| ATS Portal Scanner | IMPORTANT | N7 | No |
| Allocation Dashboard | IMPORTANT | N5 | No |
| Referral override multiplier | NICE-TO-HAVE | N2 | No |
| Interview prep generator | NICE-TO-HAVE | — | No |
| Batch scoring (multiple roles) | NICE-TO-HAVE | N2 | No |

**MVS statement:** With MUST-BUILD only, a student can configure their visa timeline, query the 80 Days dataset for a specific company, receive a Bayesian apply/skip score for a pasted job description, generate OPT-aware application materials, and log the result to a tracker. That is a complete, usable system. The ATS scanner and allocation dashboard are quality-of-life improvements, not core functionality.

**MUST-BUILD is 50% of scope.** That is above the 40% guideline. Scope reduction options: move OPT Framing Generator to IMPORTANT and require students to write framing copy manually in v1. Rejected — framing is the visa-specific differentiator. It stays MUST-BUILD.

---

## 10. Out of Scope

| Feature | Reason | Reopen condition |
|---|---|---|
| Auto-submit applications | Violates Principle 4 permanently | Never |
| LinkedIn scraping | ToS violation | Platform provides official API |
| Networking tracker | Separate tool concern | v2 if student demand exists |
| Portfolio project evaluator | Out of scope for job pipeline | Separate system |
| H-1B lottery prediction | Not statistically tractable | Never |
| Employer contact finder | Legal and ToS risk | After legal review |
| Batch auto-apply with approval | Violates reallocation principle | Never |
| Interview scheduling | Requires calendar integration | v2 |

---

## 11. Infrastructure and Deployment

**Runtime:** Any AI coding CLI (Claude Code, Gemini CLI, OpenCode, Codex) that follows the open agent skill standard. Python + Node.js for utility scripts. No cloud dependency.

**Storage:** Local filesystem only. All data in `/data/`, `/output/`, `/reports/` — gitignored by default.

**External data:** 80 Days dataset as local CSV snapshot. DOL and USCIS data as local bulk downloads. No live database queries in critical path.

**Compute:** LLM calls for CV-JD fit scoring and OPT framing generation only. All other scoring is deterministic math on local data. A student with a Claude Max subscription has sufficient compute.

**Availability:** Offline-capable for all scoring except CV-JD fit (requires LLM). If LLM is unavailable, system runs in reduced mode using sponsorship score and visa timeline factor only.

---

## 12. Risk Register

### Risk 1: 80 Days dataset staleness
**Category:** External dependency
**Likelihood:** HIGH (quarterly update cadence means data is always somewhat stale)
**Impact:** HIGH (sponsorship scores degrade silently)
**Trigger:** Dataset not refreshed in > 90 days
**Mitigation:** Display dataset age prominently. Flag scores as LOW confidence when dataset > 60 days old.
**Contingency:** Fall back to DOL LCA data only (publicly available, more current).

### Risk 2: Student ignores apply/skip recommendation
**Category:** Design risk
**Likelihood:** HIGH (students under visa pressure may override system judgment)
**Impact:** MEDIUM (single override is fine; systematic override defeats the system)
**Trigger:** Student applies to SKIP-rated roles more than 20% of the time
**Mitigation:** Tracker shows override rate. System surfaces override pattern after 2 weeks.
**Contingency:** Cannot prevent overrides. Can make the cost visible.

### Risk 3: OPT framing backfires with Unknown-tier employers
**Category:** Design risk
**Likelihood:** MEDIUM (some employers react negatively to any visa mention)
**Impact:** HIGH (disqualification from a role that might have been accessible)
**Trigger:** Student applies OPT framing to an Unknown-tier employer
**Mitigation:** Principle 2 framing rules explicitly suppress OPT mention for Unknown-tier employers.
**Contingency:** Student must review all materials before submission. Human gate is mandatory.

### Risk 4: Eightfold AI score damage from applications outside The Reallocation Engine
**Category:** External dependency
**Likelihood:** HIGH (students will continue applying outside the system)
**Impact:** MEDIUM (score damage is real but unmeasurable within The Reallocation Engine)
**Trigger:** Student applies via Easy Apply on LinkedIn in parallel with The Reallocation Engine
**Mitigation:** Onboarding explicitly addresses this. Cannot enforce.
**Contingency:** Out of scope for v1. Potential v2 feature: application hygiene tracker.

---

## 13. Open Questions Log

| Question | Stakes | Deadline | Options | Owner | Status |
|---|---|---|---|---|---|
| Should Eightfold score damage be modeled explicitly? | If yes, changes scoring formula significantly | Before v1 build | (A) Flag as risk only (B) Add negative-prior for random applications | Student design decision | Open |
| What is the minimum 80 Days dataset size for sponsorship scores to be meaningful? | Below a threshold, Unknown tier dominates and system loses differentiation | Before MVP launch | (A) Boston/SF/NYC only (B) Full national dataset | 80 Days team | Open |
| Should the system recommend networking targets from the 80 Days dataset? | Crosses from application pipeline into networking tool | v2 scoping | (A) Out of scope forever (B) Add as IMPORTANT in v2 | Student design decision | Open |
| How should the system handle cap-gap eligibility? | Affects visa timeline factor for H-1B lottery winners mid-search | Before v1 build | (A) Binary flag (B) Date-range calculation | Student design decision | Open |
| What happens when a student's STEM OPT extension is pending vs. approved? | Affects timeline factor and framing | Before v1 build | (A) Treat pending as approved (optimistic) (B) Treat pending as current auth only (conservative) | Student design decision | Open |

---

## 14. What This Document Is For

This SDD is the starting point for the student build, not the ending point. Every architecture decision recorded here is explicit so it can be challenged. The weights in the Bayesian scorer are the reference implementation — not the correct implementation. The data contract (user layer vs. system layer) is the reference design — not the only design.

When you produce your boondoggle score, you are answering: given *this* SDD (or your revised version of it), what does Claude build, what do you build, in what order, and what must be true about Claude's output before you move to the next step?

The supervisory capacities that matter most in this build:

**Plausibility auditing** — Can you hear the wrong note when Claude generates a Bayesian scoring formula? Do the weights add up? Do the tiers make sense for your actual visa situation?

**Problem formulation** — The SDD assumes OPT framing suppression for Unknown-tier employers. Is that right for your context? What if you have a referral at an Unknown-tier company?

**Interpretive judgment** — When the system says SKIP, do you override it? When should you? The system cannot answer this. You can.

**Executive integration** — The pipeline has five components with explicit dependencies. Holding all five simultaneously toward a working system is the conductor's job. That's yours.

---

*The Reallocation Engine SDD v0.1 — Humanitarians AI / Irreducibly Human Curriculum*
*Document status: Draft for student review and critique before build begins*
