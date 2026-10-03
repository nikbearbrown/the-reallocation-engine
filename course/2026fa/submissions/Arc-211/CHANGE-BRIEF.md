# CHANGE-BRIEF — Finance data-engineering triage for a STEM-OPT master's graduate

> **Draft status:** first version drafted with an AI assistant on 2026-10-01 from the
> student's stated situation and a read of the repo's data. **Reviewed by Arc-211 on 2026-10-02,
> who agreed with the predictions in §4–§5 and adopts them as their own.** Later revisions are
> appended under "Revisions"; the original predictions are never rewritten.

## Executive summary

This is the plan, written before any code, for a job-search recipe built for one
specific person: an international master's student whose degree qualifies for the
STEM work extension, who graduates in December 2026, has not yet applied for
post-graduation work authorization, and wants data-engineering or business-intelligence
jobs anywhere in the US, preferably in finance, paying at least $90,000.

The recipe checks each candidate employer against the repository's real data — past
visa sponsorship, the job titles that were sponsored, recent funding, and national wage
levels for the occupation — and sorts it into "tailor an application", "network first",
or "skip". It also adds a check the engine does not have today: whether the employer can
support the two-year STEM extension at all (it must use the federal E-Verify system).

A first look at the data already changed the plan: the sponsorship file has visa
history for only about 1 in 20 of its companies, only 8 finance companies show a
sponsored data or analytics title, and the funding samples barely overlap with the
sponsorship file. The recipe has to say so, not paper over it.

## 1. The situation

| Field | Value | Label |
|---|---|---|
| Visa status | F-1, master's, post-completion OPT not yet filed | your-input |
| Degree CIP code | 14.0903 Computer Software Engineering (on the DHS STEM list family 14.09 — **confirm with the school's international office**) | your-input (from I-20) |
| Program end date | 2026-12-20 | your-input (from I-20) |
| OPT filing window | ~2026-09-21 → ~2027-02-18 (90 days before → 60 days after program end) | your-input (rule as understood; confirm with school) |
| Unemployment allowance | 90 days on initial OPT; +60 on STEM extension (150 total) | your-input (rule as understood) |
| Target roles | Data engineer (primary), BI / data analyst (secondary) | your-input |
| Target SOC codes | 15-1243.01 Data Warehousing Specialists, 15-1243.00 Database Architects, 15-2051.01 Business Intelligence Analysts, 15-1242.00 Database Administrators | your-input (choice); rows exist in BLS compact — record |
| Location | Anywhere in the US or remote | your-input |
| Industry | Any; finance preferred | your-input |
| Salary floor | $90,000 | your-input |

**Engine layers used:** 80 Days to Stay (sponsorship + funding), The Cognitive Pivot
(BLS/O*NET wages for the target SOCs), Job-Ops (liveness — gate only).

## 2. What I reuse (exact paths) and what I propose

**Reuse — all exist on a fresh clone (checked 2026-10-01):**

| Path | What it gives | Observed fact |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | company, industry, `Total Approvals`, `Approval_Rate`, `median_salary_offered`, `top_job_titles_sponsored`, `latest_funding_date` | 30,369 rows; **only 1,557 have any H-1B fields filled** (28,812 blank) |
| `data/sec/form-d/processed/sample/companies-sec-202{5q2,5q3,5q4,6q1}-d.sample.json` | Form D filings (first 50 of ~13–16k per quarter) | 200 records total; name-joins to only 1 H-1B company (Databricks, 2025Q4), 0 finance |
| `data/bls/compact/soc_occupation_compact.csv` | OEWS 2024 national median wage + O*NET levels per SOC | 15-1243.01 → $135,980; 15-2051.01 → $112,590; 15-1242.00 → $104,620 |
| `scripts/score/role-scorer.mjs` (`npm run score -- <roles.json> --out-dir <dir>`) | composite = (Σ vote·weight) × liveness × timeline → Apply/Consider/Skip | weights: sponsorship 0.35, fit 0.3, role_quality 0.0 |
| `scripts/ats/check-liveness.mjs` (`npm run ats:liveness -- <url>`) | live/dead check of one posting URL | needs network; not used in the offline test |

**Proposed additions (none touch shared files):**

1. `scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/` — a prototype that filters the
   CSV, labels every value, computes the timeline factor, writes a `roles.json` shaped like
   `data/examples/ch11-roles.json`, and calls the **existing** scorer.
2. **E-Verify gate** — `[TODO: DATA SOURCE]` no E-Verify employer data exists in the repo.
   It belongs because the STEM extension (years 2–3 of work time, and two of the ~three
   H-1B lottery attempts) is impossible at a non-E-Verify employer, and nothing in the
   engine checks it. Until a source exists, the prototype marks it `unknown` and the gate
   is a human check.
3. **Salary floor applied outside the scorer** — because `role_quality` weight is 0.0
   (Fact 1), a wage signal fed to the scorer changes nothing. The floor is a pre-filter
   with its own label, not a scorer vote.

## 3. Gates and what a human must see to clear each

| Gate | Testable condition | Human needs to see |
|---|---|---|
| G1 Input sanity | CSV and BLS files exist and parse; required columns present | file paths + row counts in the JSON log |
| G2 Liveness | each role sent to the scorer carries an explicit `liveness.factor`; **never omitted** | the posting URL and the `ats:liveness` output (or "not checked") |
| G3 Visa timeline | timeline factor computed from program end date + stated hiring-lag; factor 0 if the window has already closed | the dates and the hiring-lag assumption, labeled your-input |
| G4 E-Verify | `everify` field is `confirmed` / `not-enrolled` / `unknown` | the student's own lookup result; `unknown` cannot become Apply without a human note |
| G5 Release | the Markdown report is read and the student decides | the report; decision logged in `logs/runs/2026fa-Arc-211-1.md` |

Gates are logged in my own run-log entry, since `logs/gate-decisions/` does not exist (Fact 4).

## 4. Predicted failure cases and how I will check each

| # | Failure case | Prediction | How I'll check |
|---|---|---|---|
| F1 | Company not in the CSV | prototype exits that company with `status: not-found`, no score | test with a fixture company name that isn't in the CSV |
| F2 | Company in the CSV but **blank H-1B fields** (28,812 of 30,369 rows) | must be labeled `unknown`, **not** sponsorship 0 — blank ≠ "never sponsored" | fixture row with blank fields; assert no `sponsorship.p` is emitted |
| F3 | Missing liveness | **the scorer silently defaults a missing liveness to 1.0 and labels it `record`** (`role-scorer.mjs`, `num(role.liveness?.factor) ?? 1`). A missing value would pass the gate as if verified. Prototype must always write an explicit factor | run the scorer on a role with no liveness field and record what it outputs |
| F4 | OPT window already closed / date in the past | timeline factor 0 → Skip, with the reason | fixture with a program end date that makes the window closed |
| F5 | SOC code with no BLS row | wage = `missing`, salary floor not applied, flagged | fixture SOC like `15-9999.00` |
| F6 | Fintech labeled by industry as "Other Technology" | finance filter misses it (only 34 finance-industry companies have H-1B data) | hand-check a known fintech's `industry` value in the CSV |

## 5. What I predict the prototype will get wrong on the first pass

The title-matching step will be the weakest link. `top_job_titles_sponsored` holds only
a handful of titles per company, so (a) companies that sponsor data engineers but whose
top titles are other roles will be missed, and (b) a broad regex will match the wrong
things (e.g. "Senior Director, Marketing Analytics" counting as a BI role). I expect at
least one false positive in the 8 finance matches when I read them by hand.

I also expect the `median_salary_offered` comparison to the $90k floor to be misleading:
it is the median across **all** sponsored titles at that company, not the data role.

## Revisions

*(append dated entries here; do not edit the sections above)*

- **2026-10-01 — F3 confirmed before building.** Ran the shipped scorer on a one-role file
  with sponsorship and fit but **no liveness and no timeline** field
  (`node scripts/score/role-scorer.mjs <file> --out-dir <scratch>`). Result: `Apply`,
  composite 0.525, audit trace `liveness 1[record] × timeline 1[your-input]`. The scorer
  turned an absent check into a passing "record". Consequence for the design: the prototype
  must always emit explicit gate factors, and an unchecked liveness must not be sent to the
  scorer as 1.0. This is an upstream defect to report in the PR, not to fix in
  `scripts/score/` (outside my namespace).

- **2026-10-01 — first prototype run (sample data, as-of 2026-10-01).** Auto mode found
  **12** finance candidates, not the 8 predicted in §2/§5: the weak title rule
  (`analytics|business analyst|data`) also admits "Technical Business Analyst",
  "Senior Business Analyst, HCG", and "Data Scientist". All 12 went to
  `check-posting-by-hand` because no liveness has been recorded yet — the scorer was
  correctly **not** called. Timeline factor 1.0 (earliest offer 2026-11-30 lands before the
  assumed OPT start 2026-12-21). Prediction §5(b) — the regex over-matches — held; the
  weak-match rows need human reading before any of them is treated as a data role.
- **2026-10-01 — F5 design changed.** Instead of only flagging, a run where **every**
  target SOC is missing now exits 3; a single missing SOC is flagged `missing` and no value
  is used. Both behaviours are tested.
- **2026-10-01 — decisions recorded:** unchecked liveness → leave out of the scorer
  (option a); hiring lag = 60 days (your-input).
- **2026-10-01 — small upstream observations:** the scorer prints `skip NaN%` on an empty
  roles file (the prototype avoids calling it with zero roles); `node --test <dir>` fails
  on Node 23, so the documented test command names the test file directly;
  `node scripts/pii-scan.mjs` reports one finding on `main` (an npm maintainer email inside
  `package-lock.json`), unrelated to this branch.
- **2026-10-01 — human-gate inputs and the first scored run.** Liveness checked with
  `npm run ats:liveness` (needed `npx playwright install chromium` first — not in the setup
  steps). Raw output: `runs/liveness-2026-10-01{,b,c}.txt`. Findings: (1) a Workday *search*
  page was reported `expired` ("search for jobs page is loaded") — the checker's verdict is
  only as good as the URL; (2) the specific Green Dot posting was also reported `expired`
  ("insufficient content") — possibly a false negative on a JS-rendered page, pending a human
  look; (3) Remitly came back `uncertain` and the student confirmed an Apply button by eye, so
  it is recorded `method: manual` and labeled your-input, not record; (4) Upstart's live
  posting was IT Support Analyst — out of scope, not recorded; (5) **JPMorgan Chase is absent
  from the 30,369-row CSV** under every name variant searched — F1 on a real company.
- **2026-10-01 — design correction: fit was judged on the wrong thing.** The first scored run
  gave SoFi fit 0.8 because the company once sponsored a "Business Intelligence Manager",
  while the posting checked was "Fraud Model Analyst". Fit now uses the posting title when
  one is recorded and falls back to sponsored titles only when it is not (and says so).
  New test added. Result after the fix: SoFi has no fit vote, composite 0.315.
- **2026-10-01 — open question found:** a Proven sponsor alone (0.9 × 0.35 = 0.315) clears the
  scorer's 0.3 Apply threshold with **no fit vote at all** — so SoFi's off-target posting is
  still "Apply". This is the shipped scorer's threshold, not changed here.
- **2026-10-01 — Green Dot was a checker false negative.** The student opened the posting
  and saw an Apply button; `ats:liveness` had said `expired` ("insufficient content"). Now
  recorded `method: manual`, labeled your-input. Had the checker been trusted, a Proven
  sponsor with a live, on-target posting would have been routed to "network" instead of
  "apply". SoFi's Apply button was also confirmed by eye (agrees with the checker).
- **2026-10-01 — rule added (student decision):** when the scorer says Apply/Consider but the
  posting has **no fit vote**, the next action is `review-role-fit`, not an application.
  The shipped scorer is unchanged; the rule lives in the prototype. Tested.
- **2026-10-01 — E-Verify gate.** A first answer arrived as a chatbot-style table marking all
  four employers "Verified Enrolled" on the strength of H-1B/PERM history and vague "profiles".
  **Rejected:** visa sponsorship is not E-Verify enrollment, and no cited source was checkable.
  The real lookup was then done in the official E-Verify Employer Search (Date Enrolled widened
  from the default "This year" to "Last 30 years" — the default would have hidden every older
  enrollment). All four found Open; details and caveats in `inputs/everify.json`: SoFi has four
  enrolled entities; one older Remitly account is terminated; "Green Dot" also matches unrelated
  organizations (Green Dot Public Schools, a DBA of Escobar & Rascon). Labeled `record`
  (government database, transcribed) — distinct from a bare claim, which stays your-input.
- **2026-10-01 — final sample run:** 13 evaluated → tailor-application 3 (Gemini, Green Dot,
  Remitly), review-role-fit 1 (SoFi), check-posting-by-hand 8, not-in-data 1 (JPMorgan).
- **2026-10-01 — recipe written; status decision.** Recipe and card added under
  `recipes/cases/2026fa/`. Status set to **DRAFT** by the student's choice: a sample run
  completed, but the three proposed additions remain typed TODOs, and the lifecycle requires
  zero open TODOs before SPECIFIED. Run-log entry `logs/runs/2026fa-Arc-211-1.md` added, with
  G4 reviewer confirmation and the G5 decision marked pending.
- **2026-10-01 — G5 and break tests.** Student decided: apply to all four scored companies,
  overriding `review-role-fit` for SoFi (reason recorded in the run log). Deliberate breaks:
  after-deadline date, missing input, SOC typo, company typo — saved in `runs/breaks/`. The
  after-deadline break exposed a bug: unchecked companies were still sent to
  `check-posting-by-hand` when the timeline gate was closed. Fixed and tested. Error messages
  also printed an absolute local path; now repo-relative. A misspelled company name is
  indistinguishable from a truly absent one — left as a documented limitation.
