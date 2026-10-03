---
status: DRAFT
todos_open: 3
last_gate: "sample-run 2026-10-01 (human gates G2 liveness and G4 E-Verify cleared by the student), logs/runs/2026fa-Arc-211-1.md"
attestation: null
recipe_version: 0.1.0
---

# Arc-211-fin-dataeng-stemopt — finance data-engineering triage for a STEM-OPT graduate

## Executive summary

This recipe helps one kind of job seeker spend their application time where it can pay off:
an international master's student whose degree qualifies for the two-year STEM work extension,
whose program ends in December 2026, who has not yet filed for post-graduation work
authorization, and who wants data-engineering or business-intelligence jobs paying at least
$90,000, anywhere in the US or remote, preferably in finance.

For each candidate employer it checks the repository's own records — how often the company
has had visa petitions approved, which job titles it actually sponsored, what it paid, when it
last raised money — then two things a person must check by hand: whether the job posting is
really open, and whether the employer is enrolled in E-Verify (without which the STEM extension
is impossible). It ends with one of five next actions: **tailor an application**, **review
whether the role fits**, **network into the company**, **check the posting by hand**, or
**skip**. It never invents a value: a company missing from the data is reported as missing, and
a blank sponsorship record is reported as unknown, not as "never sponsors".

On its first sample run (2026-10-01) it narrowed 30,369 companies to 12 finance candidates plus
one named check, and — after a person cleared the posting and E-Verify checks — recommended
three applications, one role-fit review, and eight postings still to check by hand.

**Handoff condition (done when):** the run exits 0; `triage-log.json` and `triage-report.md`
both exist in the output folder; every value in the log carries one of the labels `record`,
`model-judgment`, or `your-input`; no role in `roles.json` lacks an explicit liveness factor;
and the person has read the report and logged a decision in the run log. "It printed a table"
is not the condition.

Two customers: this file is for the agent; `recipes/cases/2026fa/Arc-211-fin-dataeng-stemopt.card.md`
is for the person.

## Lifecycle note

The status is **DRAFT** by deliberate choice. A full sample run has completed, conformance
passes, and the human-facing report was read and acted on (it produced two design
corrections, logged in the change brief). What blocks promotion is the lifecycle rule that
SPECIFIED requires zero open typed TODOs: this recipe keeps three, all for data sources or
upstream fixes outside its scope (see *Proposed additions*). Claiming more than DRAFT would
skip that gate.

## Required reads

1. `SNICKERDOODLE.md` — gates, provenance, labels, TODO closure.
2. `DOMAIN.md` — especially *Known gaps and defects* (role-quality weight 0.0; local wage feeds nothing).
3. `DATA_CONTRACT.md` §Zero-Conditions — what may never be committed.
4. `data/80-days-to-stay/80-days-csv/README.md` — what the sponsorship CSV claims to be.
5. `scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/README.md` — the prototype's contract.
6. `course/2026fa/submissions/Arc-211/CHANGE-BRIEF.md` — predictions and every dated revision.

Local data first. The only network touches are the two human gates (G2, G4), done by a person.

## Source inventory

| Path | What it gives | Observed 2026-10-01 | Label |
|---|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | company, industry, `Total Approvals`, `Total Denials`, `Approval_Rate`, `median_salary_offered`, `top_job_titles_sponsored`, `latest_funding_date` | 30,369 rows; **1,557** have any H-1B field; 2,425 match the finance-industry filter, of which only **34** have H-1B data | record |
| `data/sec/form-d/processed/sample/companies-sec-2025q2-d.sample.json` (and the 2025q3, 2025q4, 2026q1 siblings) | Form D filings | **50 records per quarter** (of ~13–16k); 200 total; one exact-name hit against an H-1B company in the whole set | record |
| `data/bls/compact/soc_occupation_compact.csv` | OEWS 2024 national median by SOC | 15-1243.01 and 15-1243.00 $135,980; 15-2051.01 $112,590; 15-1242.00 $104,620 | record |
| `scripts/score/role-scorer.mjs` | composite = (Σ vote × weight) × liveness × timeline; Apply ≥ 0.3 | weights sponsorship 0.35, fit 0.3, role_quality 0.0 | — (run unmodified) |
| `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) | active / expired / uncertain for one posting URL | needs a Playwright browser: `npx playwright install chromium` | record (transcribed) |
| `course/2026fa/submissions/Arc-211/inputs/liveness.json` | the person's liveness results, one entry per company | 4 entries; 2 from the checker, 2 manual | record or your-input per entry |
| `course/2026fa/submissions/Arc-211/inputs/everify.json` | E-Verify lookups | 4 entries, all from the official E-Verify Employer Search | record (transcribed) |
| `scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/config.json` | dates, floor, filters, tier rule, fit values | all settings | your-input |

## Phase gates

Each candidate stops at the first gate it fails. Gates are hard stops; none is a vote.

| Gate | Testable condition | Pass | Fail |
|---|---|---|---|
| **G1 input sanity** | the CSV, BLS file, Form D directory and config exist and parse; required CSV columns present; at least one target SOC has a BLS row | continue | exit 2 (missing input, nothing written) or exit 3 (no target SOC) |
| **G2 liveness** | `course/2026fa/submissions/Arc-211/inputs/liveness.json` has an entry for the company with `result` `active` or `expired`. Checker results are `record`; `method: "manual"` (a person looked at the page) is `your-input` | role sent to the scorer with an **explicit** factor 1 or 0 | no entry, or `uncertain` → `check-posting-by-hand`; **never sent to the scorer** (it would default a missing liveness to 1.0 labeled `record`) |
| **G3 visa timeline** | factor from your-input dates: earliest offer = as-of + hiring lag; if before the assumed OPT start → 1; else 1 − (days used ÷ 90); 0 if OPT is unfiled and the filing deadline (program end + 60 days) has passed | factor passed to the scorer as a gate | factor 0 → the scorer returns a gated Skip |
| **G4 E-Verify** | `course/2026fa/submissions/Arc-211/inputs/everify.json` entry for the company; `method: "e-verify.gov"` is a transcribed government record, anything else is your-input | `confirmed` → `tailor-application` | `unknown` → `verify-everify-then-tailor`; `not-enrolled` → network only (STEM extension impossible there) |
| **G5 release** | a person reads `triage-report.md` and records a decision per scored company in `logs/runs/2026fa-Arc-211-1.md` | act | do not act on any row |

G2 and G4 are cleared by a named person, never by the script. The gate decisions are logged in
the run-log entry, since a `logs/gate-decisions/` directory does not exist in this repository.

## Primary stored tools

```bash
node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2026-10-01
node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs
npm run ats:liveness -- "<posting-url>"
node scripts/conformance.mjs scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/ recipes/cases/2026fa/
```

The prototype calls the existing scorer itself, unmodified, as
`node scripts/score/role-scorer.mjs <out-dir>/roles.json --out-dir <out-dir>`. It never writes
outside its output folder, and never touches the network. Quote every URL: an unquoted `&`
or angle brackets break the shell command.

## Workflow

1. Confirm the inputs exist:
   ```bash
   test -f data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv && test -f data/bls/compact/soc_occupation_compact.csv && test -d data/sec/form-d/processed/sample
   ```
2. Run the triage and read `course/2026fa/submissions/Arc-211/runs/triage/triage-report.md`.
3. For each company marked `check-posting-by-hand`, the person finds **one specific posting**
   (not a search or listing page) for a target role and runs `npm run ats:liveness -- "<url>"`.
   They then open the page themselves. If the checker says `expired` or `uncertain` but an Apply
   button is visible, record `method: "manual"` with a note quoting the checker's reason.
   Record the posting title as well.
4. For each company headed for an application, the person searches the official E-Verify
   Employer Search (https://www.e-verify.gov/e-verify-employer-search) by **legal name**. They
   widen *Date Enrolled* from the default "This year" to **"Last 30 years"** first; the default
   hides older enrollments. They record every matching entity, its status, and its enrollment
   date, and exclude same-brand organizations that are not the employer.
5. Re-run the triage. Read every row of *Why each row*.
6. Log the run and each gate decision in `logs/runs/2026fa-Arc-211-<n>.md`.

## Decision rules (all your-input, with reasoning)

| Rule | Value | Reasoning |
|---|---|---|
| Sponsorship tier | Proven = ≥ 20 approvals and ≥ 90% rate (p 0.9); Likely = ≥ 5 approvals (p 0.6); Weak = fewer (p 0.3) | The repository pins no thresholds (the book marks them pending). The p values match the scorer's worked example. |
| Fit | 0.8 strong / 0.5 weak title match | It is a rule-based keyword match, so it is labeled `model-judgment`, not a record. |
| Fit basis | the **posting title** when one is recorded; otherwise the company's sponsored titles, and the report says so | The first run scored SoFi's "Fraud Model Analyst" posting as a strong fit because the company once sponsored a BI manager. That was the wrong evidence. |
| No fit vote | `review-role-fit` instead of an application | A Proven sponsor alone (0.9 × 0.35 = 0.315) clears the scorer's 0.3 Apply threshold even for an off-target role. |
| Salary floor | $90,000 against `median_salary_offered`, applied **before** scoring | The scorer's role-quality weight is 0.0, so a wage vote would change nothing. |
| Funding | shown, not scored | The scorer has no funding term. Form D here is a 50-row sample. |
| Hiring lag | 60 days | The student's estimate. |
| OPT start | 2026-12-21 (assumed) | OPT is not filed yet. The earliest possible start starts the unemployment clock soonest, which is the conservative choice. |

## What it can and cannot verify

| It can verify (from a record) | It cannot verify |
|---|---|
| A company's recorded H-1B approvals, denials, and rate in the 80 Days CSV | That a company **never** sponsors: a blank row means unknown. 28,812 of 30,369 rows are blank. |
| Which titles appear in the company's top sponsored titles | Whether it sponsors **this** role: the CSV lists a handful of top titles, not every title. |
| That a company is absent from the CSV | Why it is absent. JPMorgan Chase, a major finance sponsor, is not in the file under any name variant searched. |
| The company's median offered wage across all its sponsored titles | What **this role** pays. The company median covers all titles; BLS is a national occupation median, not an offer. |
| Latest funding date in the CSV; an exact-name hit in the Form D samples | Recent funding in general. The samples are 50 rows per quarter, so "no hit" means "not in the sample". |
| A checker result for a URL, as transcribed by the person | That the checker is right. It reported a Workday search page as "expired", and a live Green Dot posting as "expired" (insufficient content). A person must look. |
| That named entities appear as Open in the E-Verify Employer Search | That the entity which would employ the student is enrolled. SoFi has four enrolled entities, one Remitly account is terminated, and "Green Dot" also matches unrelated organizations. Only an offer settles it. |
| Program end date and filing deadline arithmetic | That the student's visa rules are as stated. The person must confirm them with the school's international office. |

## Facts that bite — how each is handled

| Fact | Handling here |
|---|---|
| Role quality carries 0.0 weight in the scorer | The salary floor is applied outside the scorer. The BLS median is shown as context only. No weight is proposed. |
| `bls:local-wage` feeds nothing and fails on a fresh clone | Not used. The recipe says so instead of implying a metro wage was checked. |
| Only Form D samples ship | Stated in every report header. The Form D cross-check is labeled as sample-only. |
| Planned directories don't exist (`data/raw/`, `data/verified/`, `logs/gate-decisions/`) | Gates point at `course/2026fa/submissions/Arc-211/inputs/` and `logs/runs/`, which exist. |
| The `snickerdoodle` CLI is roadmap only | Not used anywhere. |
| `scripts/sec/validate-h1b-join-sample.py` needs unshipped data | Not used. The name join is a documented normalized exact match, and its single hit is shown. |
| **Found in this work:** the scorer defaults a missing liveness to 1.0 and labels it `record` | Liveness is never omitted. Unchecked roles are held back. Reported upstream (Proposed additions). |

## Output contract

Written to the output folder (default `course/2026fa/submissions/Arc-211/runs/triage/`):

- **`triage-log.json` (agent).** Contains `_tool`, `generated`, `as_of`, `config`, `inputs`
  (paths plus the Form D sample notes), `data_mode`, `census` (counts at each narrowing step),
  `target_socs` (`ok` with a labeled median, or `missing` with a reason), `timeline_gate` (every
  date and the factor), `scorer` (whether it ran, the exact command, and its stdout), and
  `results[]`. Each result has a `status`, a `next_action`, and labeled `{value, label, source}`
  objects for sponsorship, sponsored titles, fit, salary, funding, liveness, timeline,
  E-Verify, and the scorer's composite, recommendation, and arithmetic.
- **`triage-report.md` (person).** In order: executive summary, run record, how the list was
  narrowed, the visa-timeline gate, target occupations, a decisions table with a label on every
  column, *Why each row*, *What this run could not verify*, and the human gate.
- **`roles.json`** — exactly the roles sent to the scorer, shaped like `data/examples/ch11-roles.json`.
- **`role-scores.json` and `role-scores.md`** — the scorer's own outputs, unmodified.

## Stop conditions and next action per result

Stop, and do not invent a value, when: an input is missing (exit 2); no target SOC exists
(exit 3); a liveness entry is missing or `uncertain`; a company is absent from the CSV or its
H-1B fields are blank; or someone asks to send an unchecked posting to the scorer, record an
E-Verify status from anything other than a lookup, or lower the floor or thresholds so a
preferred company passes.

| `next_action` | Meaning | Where it goes in the 3-3-2 day |
|---|---|---|
| `tailor-application` | Proven or Likely sponsor, live on-target posting, timeline open, E-Verify confirmed | the **2** research and apply hours: tailor this one |
| `verify-everify-then-tailor` | as above, but E-Verify unknown | a 10-minute lookup, then the 2 hours |
| `review-role-fit` | the scorer says Apply, but the posting is not a target role | the **3** networking hours: ask a contact which team actually hires data engineers |
| `network-into-company` | strong sponsor, posting dead | the **3** networking hours: an informational chat before the next opening |
| `check-posting-by-hand` | no or uncertain liveness | 5 minutes of the 2 hours, then re-run |
| `research-sponsorship` / `not-in-data` | blank or absent record | don't spend apply time on it; network only if there is another reason to |
| `skip` | below floor, or a gated Skip | time returned to the day |

## Proposed additions

1. **[TODO: DATA SOURCE]** An E-Verify employer extract (legal name, status, enrollment date,
   hiring-site states) under `data/`, with a provenance note. Today, G4 is a manual lookup per
   company. A local extract would make G4 a record check, and would surface terminated accounts
   automatically.
2. **[TODO: DATA SOURCE]** Fuller sponsorship-by-title data (LCA disclosure files, with job
   title and SOC per filing) for the sponsors in the CSV. Today, "sponsors this role" rests on a
   few top titles. Per-filing SOCs would turn the fit fallback into a record.
3. **[TODO: DEV]** Upstream scorer fix, outside this namespace, to be reported in the PR and not
   patched here: in `scripts/score/role-scorer.mjs`, a missing `liveness.factor` defaults to 1.0
   with source `record`, so an unchecked posting can come out as Apply. It should either fail, or
   label the value as an assumption. The scorer also prints `skip NaN%` for an empty roles file.

## Run-log template (`logs/runs/2026fa-Arc-211-<n>.md`)

```markdown
## YYYY-MM-DD — fin-dataeng-stemopt triage (sample)

- **Recipe:** recipes/cases/2026fa/Arc-211-fin-dataeng-stemopt.md v0.1.0
- **Inputs:** config.json (as-of, dates, floor), inputs/liveness.json (n entries: checker/manual), inputs/everify.json (n entries)
- **Command:** node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of YYYY-MM-DD
- **Outputs:** runs/triage/triage-log.json, runs/triage/triage-report.md, roles.json, role-scores.{json,md}
- **Result:** counts per next_action; timeline factor
- **Gates:** G2 cleared by <name> on <date> (which postings, which manual); G4 cleared by <name> on <date> (lookup source)
- **Decision (G5):** per scored company — apply / network / skip, by <name>
- **Open issues:** what was not checked; any checker/record disagreement
```
