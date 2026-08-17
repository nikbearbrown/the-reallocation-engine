# Bear's Doodles — The Reallocation Engine Video Ideas

*Scouted from the Reallocation Engine book. These candidates favor visible process, gates, and scoring mechanics.*

## Candidate 01 — Why Fluency Is Not Competence
- Source: `the-reallocation-engine/chapters/01-the-fluency-trap.md`
- Production mode: Doodle
- Hook: A perfect AI answer can remove the struggle that was supposed to train your judgment.
- Core idea: Fluency hides whether the user can inspect, verify, and repair the work, so the system must preserve friction at the learning-critical steps.
- Visual object: A shiny answer panel covering a missing ladder rung.
- Manim move: compare
- Short-form fit: Strong
- Prerequisites: AI-generated answer, skill learning, feedback
- Exclusions: no broad AI ethics survey, no classroom policy debate, no tool comparison
- Score: 9/10

## Candidate 02 — Why Verified Data Comes Before Clever Scoring
- Source: `the-reallocation-engine/chapters/03-the-verified-data-contract.md`
- Production mode: Doodle
- Hook: A beautiful score built on unverified data is just a faster way to be wrong.
- Core idea: The verified-data contract forces every downstream decision to depend only on fields with known source, freshness, and uncertainty.
- Visual object: A scoring machine refusing inputs without verification stamps.
- Manim move: scan
- Short-form fit: Strong
- Prerequisites: data field, score, source
- Exclusions: no schema implementation detail, no scraper code, no legal advice
- Score: 10/10

## Candidate 03 — Why the System Has Two Customers
- Source: `the-reallocation-engine/chapters/04-two-customers.md`
- Production mode: Doodle
- Hook: A recipe must satisfy the AI that executes it and the human who must trust it.
- Core idea: Machine-facing artifacts need precise steps and data contracts, while human-facing artifacts need rationale, limits, and review points.
- Visual object: One workflow splitting into an AI recipe and a human review card.
- Manim move: split
- Short-form fit: Strong
- Prerequisites: workflow, recipe, review
- Exclusions: no full recipe template, no prompt engineering catalog, no interface design
- Score: 9/10

## Candidate 04 — Why Base Rates Beat Confidence
- Source: `the-reallocation-engine/chapters/05-verifying-the-data.md`
- Production mode: Manim visualization
- Hook: A confident single example can feel convincing while the base rate quietly says the opposite.
- Core idea: Verification weighs individual evidence against population-level rates, preventing a fluent anecdote from overpowering the larger signal.
- Visual object: A single bright case shrinking beside a large base-rate bar chart.
- Manim move: compare
- Short-form fit: Strong
- Prerequisites: evidence, rate, confidence
- Exclusions: no full statistical proof, no Bayesian role scorer detail, no company-specific claims
- Score: 8/10

## Candidate 05 — Why Sponsorship Is a Funnel, Not a Label
- Source: `the-reallocation-engine/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md`
- Production mode: Manim visualization
- Hook: A company either sponsors or it does not sounds simple, but the useful answer is a narrowing funnel of evidence.
- Core idea: Sponsorship likelihood comes from layered signals: history, role type, company fit, timing, and contradiction checks.
- Visual object: Company-role pairs passing through successive sponsorship filters.
- Manim move: scan
- Short-form fit: Strong
- Prerequisites: employer sponsorship, evidence signal, filter
- Exclusions: no immigration advice, no live employer database, no H-1B legal detail
- Score: 9/10

## Candidate 06 — Why Job Liveness Is Different From Job Quality
- Source: `the-reallocation-engine/chapters/08-is-the-job-real-ats-detection-and-liveness.md`
- Production mode: Doodle
- Hook: A posting can be real but stale, alive but poor, or attractive but fake.
- Core idea: Liveness checks whether the posting is operational now, while quality checks whether the role is worth pursuing.
- Visual object: Job cards sorted on two axes: live/stale and good/bad.
- Manim move: compare
- Short-form fit: Strong
- Prerequisites: job posting, signal, classification
- Exclusions: no ATS scraper implementation, no employer reputation scoring, no application advice
- Score: 8/10

## Candidate 07 — Why Visa Timeline Is a Multiplier, Not an Add-On
- Source: `the-reallocation-engine/chapters/10-the-visa-timeline-manager.md`
- Production mode: Manim visualization
- Hook: A good role can become a bad target if its timeline misses the visa window.
- Core idea: Timeline constraints multiply the value of every other score because sponsorship, liveness, and role quality only matter if action can happen in time.
- Visual object: A role score passing through a countdown window that scales it up or down.
- Manim move: transform
- Short-form fit: Strong
- Prerequisites: deadline, score, job process
- Exclusions: no legal guidance, no date calculator implementation, no personal case advice
- Score: 9/10

## Candidate 08 — Why the Bayesian Role Scorer Should Explain Its Verdict
- Source: `the-reallocation-engine/chapters/11-the-bayesian-role-scorer.md`
- Production mode: Manim visualization
- Hook: A single role score is less useful than the evidence trail that moved it.
- Core idea: Each factor updates the prior toward apply, monitor, or skip, and the visible trail lets the user override responsibly.
- Visual object: A probability needle moving after sponsorship, liveness, quality, and timeline evidence.
- Manim move: accumulate
- Short-form fit: Strong
- Prerequisites: prior, evidence, recommendation
- Exclusions: no formula derivation, no weight tuning, no automated application submission
- Score: 9/10

## Candidate 09 — Why a Resume Must Survive Both the Filter and the Human
- Source: `the-reallocation-engine/chapters/13-resumes-that-survive-the-filter.md`
- Production mode: Doodle
- Hook: A resume optimized only for a machine can fail the person who finally reads it.
- Core idea: The resume must encode role-relevant evidence clearly enough for parsing systems while preserving a coherent story for human evaluation.
- Visual object: A resume passing through a scanner gate and then landing on a human desk.
- Manim move: scan
- Short-form fit: Strong
- Prerequisites: resume, job description, evidence
- Exclusions: no resume rewrite service, no ATS keyword stuffing, no design-template advice
- Score: 8/10

## Candidate 10 — Why Phase Gates Make Automation Safer
- Source: `the-reallocation-engine/chapters/16-the-build-and-the-honest-run.md`
- Production mode: Doodle
- Hook: The safest automation is not the one that runs fastest; it is the one that knows where to stop.
- Core idea: Phase gates separate data gathering, verification, scoring, action, and review so the system cannot silently convert uncertainty into irreversible moves.
- Visual object: An automation pipeline with locked gates before each higher-risk action.
- Manim move: accumulate
- Short-form fit: Strong
- Prerequisites: workflow, verification, approval
- Exclusions: no code implementation, no governance policy catalog, no production deployment checklist
- Score: 10/10
