# Sponsor & Posting Reality Check — Assignment 1 tool on the Assignment 2 real sample (comparison)

## Executive summary

This report checks 12 job openings for two things before any application time is spent: whether each posting still looks open, and what is actually known about visa sponsorship for that specific opening (kept separate from the company's past record). Every opening ends at a next step for a person, not at an automatic decision.

Result for this sample of 12: 8 × seek-vacancy-sponsorship-evidence, 4 × skip-application. Skip fraction 4/12 (sample of 12; not a general rate). Timing was **not verified** for any opening. 0 of 12 postings are SYNTHETIC test postings.

## Run record

- Command: `node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs --input course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/a1-tool-on-real-sample/a1-input.json --out-dir ../../../../var/folders/26/wj7ysvd95bj1zcvv43gx0j0h0000gn/T/a1-on-a2`
- Started: 2026-10-21T04:15:33.736Z
- Input: `course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/a1-tool-on-real-sample/a1-input.json` · Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2addf472b1…`)
- Labels: **record** = from a data file, or a recorded observation of a real posting · **model-judgment** = a rule applied to text · **your-input** = a stated sample value or assumption, or anything derived from an invented (SYNTHETIC) test input

## Gate legend

- **G1** Input: "pass" = the input file passed validation.
- **G2** Liveness: "pass" = the posting looked open at the time of the snapshot or observation; "stop" = closed (skip) or uncertain/conflicting (a person checks).
- **G3** Vacancy refusal: "pass" = no clear refusal found in the supplied posting text (not a promise of sponsorship); "stop" = an explicit refusal (skip this application).
- **G4** Timing: "pass" means only that an explicit SAMPLE timing assumption was supplied and satisfied the sample rule; actual start-date compatibility (January 2027) was NOT verified for any opening. "stop" = no timing input.
- **G5** Sponsorship evidence for this opening: "pass" = apparent offer wording for a person to review (not a guarantee); "stop" = awaiting vacancy-level sponsorship evidence.
- **G6** Final review: always a person; nothing is applied to automatically.

## Decisions (actionable)

| Opening | Company evidence [record] | Posting liveness | Sponsorship wording in this posting [model-judgment] | Next step | Why |
|---|---|---|---|---|---|
| Databricks — Senior Software Engineer — Backend (Files Team) | matched-with-record (approvals 1640, denials 8) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Databricks — Sr. Software Engineer - Ingestion Core team | matched-with-record (approvals 1640, denials 8) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Databricks — Senior Software Engineer, Compute Infrastructure | matched-with-record (approvals 1640, denials 8) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Databricks — Staff Systems Development Engineer (GovOps) | matched-with-record (approvals 1640, denials 8) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Pinterest — Sr. Staff Software Engineer, Product ML Infrastructure | matched-with-record (approvals 1364, denials 16) | expired [record; recorded-observation] | silent | **skip-application** | posting closed (recorded): insufficient content — likely nav/footer only |
| Pinterest — Principal Engineer, AI Platform | matched-with-record (approvals 1364, denials 16) | expired [record; recorded-observation] | silent | **skip-application** | posting closed (recorded): insufficient content — likely nav/footer only |
| Pinterest — Staff Software Engineer, Ads & Core Serving Platform | matched-with-record (approvals 1364, denials 16) | expired [record; recorded-observation] | silent | **skip-application** | posting closed (recorded): insufficient content — likely nav/footer only |
| Pinterest — Principal Engineer, Big Data Platform | matched-with-record (approvals 1364, denials 16) | expired [record; recorded-observation] | silent | **skip-application** | posting closed (recorded): insufficient content — likely nav/footer only |
| Stripe — Software Engineer | matched-with-record (approvals 1250, denials 22) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Stripe — Staff Software Engineer, Link - Consumer Identity  | matched-with-record (approvals 1250, denials 22) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Stripe — Senior Software Engineer, Backend | matched-with-record (approvals 1250, denials 22) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| Stripe — Software Engineer, Backend | matched-with-record (approvals 1250, denials 22) | active [record; recorded-observation] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |

## Hypothetical scenario scores (NOT decisions)

No opening carried a demonstration sponsorship vote, so the maintained scorer was not run.

## Evidence per opening

### Databricks — Senior Software Engineer — Backend (Files Team)

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `DATABRICKS INC`: approvals 1640, denials 8, approval rate 99.51
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Databricks — Sr. Software Engineer - Ingestion Core team

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `DATABRICKS INC`: approvals 1640, denials 8, approval rate 99.51
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Databricks — Senior Software Engineer, Compute Infrastructure

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `DATABRICKS INC`: approvals 1640, denials 8, approval rate 99.51
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Databricks — Staff Systems Development Engineer (GovOps)

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `DATABRICKS INC`: approvals 1640, denials 8, approval rate 99.51
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Pinterest — Sr. Staff Software Engineer, Product ML Infrastructure

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `PINTEREST INC`: approvals 1364, denials 16, approval rate 98.84
- **Liveness (record):** expired — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: expired
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 stop
- **Next step:** skip-application — posting closed (recorded): insufficient content — likely nav/footer only

### Pinterest — Principal Engineer, AI Platform

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `PINTEREST INC`: approvals 1364, denials 16, approval rate 98.84
- **Liveness (record):** expired — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: expired
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 stop
- **Next step:** skip-application — posting closed (recorded): insufficient content — likely nav/footer only

### Pinterest — Staff Software Engineer, Ads & Core Serving Platform

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `PINTEREST INC`: approvals 1364, denials 16, approval rate 98.84
- **Liveness (record):** expired — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: expired
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 stop
- **Next step:** skip-application — posting closed (recorded): insufficient content — likely nav/footer only

### Pinterest — Principal Engineer, Big Data Platform

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `PINTEREST INC`: approvals 1364, denials 16, approval rate 98.84
- **Liveness (record):** expired — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: expired
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 stop
- **Next step:** skip-application — posting closed (recorded): insufficient content — likely nav/footer only

### Stripe — Software Engineer

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `STRIPE INC`: approvals 1250, denials 22, approval rate 98.27
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Stripe — Staff Software Engineer, Link - Consumer Identity 

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `STRIPE INC`: approvals 1250, denials 22, approval rate 98.27
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Stripe — Senior Software Engineer, Backend

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `STRIPE INC`: approvals 1250, denials 22, approval rate 98.27
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### Stripe — Software Engineer, Backend

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `STRIPE INC`: approvals 1250, denials 22, approval rate 98.27
- **Liveness (record):** active — recorded observation of a real posting (2026-10-21 00:02:07 EDT); evidence: course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-live-page-liveness.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** silent
- **Timing (your-input):** factor 1, assumption: Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only) · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

## Waiting for a person

- Databricks — Senior Software Engineer — Backend (Files Team): **seek-vacancy-sponsorship-evidence**
- Databricks — Sr. Software Engineer - Ingestion Core team: **seek-vacancy-sponsorship-evidence**
- Databricks — Senior Software Engineer, Compute Infrastructure: **seek-vacancy-sponsorship-evidence**
- Databricks — Staff Systems Development Engineer (GovOps): **seek-vacancy-sponsorship-evidence**
- Stripe — Software Engineer: **seek-vacancy-sponsorship-evidence**
- Stripe — Staff Software Engineer, Link - Consumer Identity : **seek-vacancy-sponsorship-evidence**
- Stripe — Senior Software Engineer, Backend: **seek-vacancy-sponsorship-evidence**
- Stripe — Software Engineer, Backend: **seek-vacancy-sponsorship-evidence**
- Every opening: final review of this report (G6). Nothing has been applied to.

## What this run cannot verify

- That any opening will be sponsored. Company counts are aggregates with unspecified time coverage, no job codes and no per-year detail.
- That a posting is open now: every liveness value is a point-in-time snapshot or observation.
- Sponsorship wording outside the defined vocabulary; conditional wording stays unresolved.
- Whether similarly named employers are the same organization (only a human pin resolves it).
- January 2027 start compatibility: timing is a labeled sample assumption.
- Fit: a labeled sample value; no résumé matching.
