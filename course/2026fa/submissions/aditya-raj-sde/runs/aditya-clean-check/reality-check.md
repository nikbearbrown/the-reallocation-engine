# Sponsor & Posting Reality Check — Public sample for the fictional persona Aarav Patel (backend/platform roles). Not anyone's real search.

## Executive summary

This report checks 9 job openings for two things before any application time is spent: whether each posting still looks open, and what is actually known about visa sponsorship for that specific opening (kept separate from the company's past record). Every opening ends at a next step for a person, not at an automatic decision.

Result for this sample of 9: 6 × seek-vacancy-sponsorship-evidence, 2 × skip-application, 1 × review-offer-excerpt. Skip fraction 2/9 (sample of 9; not a general rate). Timing was **not verified** for any opening. 8 of 9 postings are SYNTHETIC test postings.

## Run record

- Command: `node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs --input scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json --out-dir course/2026fa/submissions/aditya-raj-sde/runs/aditya-clean-check`
- Started: 2026-10-04T00:53:45.579Z
- Input: `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json` · Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2addf472b1…`)
- Labels: **record** = from a data file, or a recorded observation of a real posting · **model-judgment** = a rule applied to text · **your-input** = a stated sample value or assumption, or anything derived from an invented (SYNTHETIC) test input

## Decisions (actionable)

| Opening | Company evidence [record] | Posting liveness | Sponsorship wording in this posting [model-judgment] | Next step | Why |
|---|---|---|---|---|---|
| Databricks — Software Engineer, Web Products | matched-with-record (approvals 1640, denials 8) | active [record; recorded-observation] | not-captured | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified |
| **SYNTHETIC** Axia Technologies — Backend Engineer (synthetic posting) | ambiguous-employer | active [your-input; synthetic-derived] | not-captured | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified |
| **SYNTHETIC** Uplift Labs — Platform Engineer (synthetic posting) | matched-zero-approvals (approvals 0, denials 4) | active [your-input; synthetic-derived] | not-captured | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified |
| **SYNTHETIC** Snowflake Computing — Distributed Systems Engineer (synthetic posting) | matched-blank-fields | active [your-input; synthetic-derived] | not-captured | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified |
| **SYNTHETIC** Example Platform Labs — Backend Engineer (fictional employer) | no-employer-match | active [your-input; synthetic-derived] | ambiguous-or-conditional | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (ambiguous-or-conditional); provisional: timing not verified |
| **SYNTHETIC** Example Robotics — Platform Engineer (fictional employer) | no-employer-match | active [your-input; synthetic-derived] | explicit-refusal | **skip-application** | the posting refuses sponsorship: "Applicants must be able to work in the United States without the need for visa sponsorship now or in the future." |
| **SYNTHETIC** Example Data Systems — Backend Engineer (fictional employer) | no-employer-match | active [your-input; synthetic-derived] | apparent-offer | **review-offer-excerpt** | offer-like wording to review (not a guarantee): "Visa sponsorship is available for this role."; provisional: timing not verified |
| **SYNTHETIC** Example Analytics — Platform Engineer (fictional employer) | no-employer-match | active [your-input; synthetic-derived] | silent | **seek-vacancy-sponsorship-evidence** | no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified |
| **SYNTHETIC** Example Cloud — Backend Engineer (fictional employer) | no-employer-match | expired [your-input; synthetic-derived] | not-captured | **skip-application** | posting closed (expired_body): pattern matched: no longer accepting applications |

## Hypothetical scenario scores (NOT decisions)

These come from the repository's maintained scorer, run on an **uncalibrated demonstration sponsorship vote** supplied in the input. They show what the scorer would say *if* that assumption were true. They never replace the next step above and do not establish eligibility. Timing inside them is a sample assumption (provisional: timing not verified).

| Opening | Scenario label (scorer) | Composite | Next step (unchanged) | Assumption |
|---|---|---|---|---|
| **SYNTHETIC** Example Data Systems — Backend Engineer (fictional employer) | Consider (provisional: timing not verified) | 0.42 | **review-offer-excerpt** | SCENARIO ONLY, uncalibrated: shows the maintained scorer's output if a human had recorded vacancy-level sponsorship evidence for this fictional posting. Not an estimate that any employer will sponsor. |
| **SYNTHETIC** Example Analytics — Platform Engineer (fictional employer) | Consider (provisional: timing not verified) | 0.42 | **seek-vacancy-sponsorship-evidence** | SCENARIO ONLY, uncalibrated: exercises the adopted rule that a scenario vote never clears awaiting-sponsorship-evidence when the posting is silent. Not an estimate that any employer will sponsor. |

## Evidence per opening

### Databricks — Software Engineer, Web Products

- **Company (record):** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
  - `DATABRICKS INC`: approvals 1640, denials 8, approval rate 99.51
- **Liveness (record):** active — recorded observation of a real posting (2026-10-03T17:48:07-04:00); evidence: course/2026fa/submissions/aditya-raj-sde/evidence/19-liveness-baseline-8635225002.txt; classifier: active
- **Sponsorship wording in this posting (model-judgment):** not-captured — no posting text was supplied about sponsorship
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified

### SYNTHETIC — Axia Technologies — Backend Engineer (synthetic posting)

- **Company (record):** ambiguous-employer — more than one plausible employer row; not merged — a human must pin employer_row_name
  - `AXIA TECHNOLOGIES INC`: approvals blank, denials blank, approval rate blank
  - `AXIA TECHNOLOGIES LLC`: approvals 2, denials 0, approval rate 100.00
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** not-captured — no posting text was supplied about sponsorship
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified

### SYNTHETIC — Uplift Labs — Platform Engineer (synthetic posting)

- **Company (record):** matched-zero-approvals — zero recorded approvals; this is not a refusal by the employer
  - `UPLIFT LABS INC`: approvals 0, denials 4, approval rate 0.00
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** not-captured — no posting text was supplied about sponsorship
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified

### SYNTHETIC — Snowflake Computing — Distributed Systems Engineer (synthetic posting)

- **Company (record):** matched-blank-fields — row found but sponsorship count fields are blank; not zero
  - `SNOWFLAKE COMPUTING INC`: approvals blank, denials blank, approval rate blank
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** not-captured — no posting text was supplied about sponsorship
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (not-captured); provisional: timing not verified

### SYNTHETIC — Example Platform Labs — Backend Engineer (fictional employer)

- **Company (record):** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** ambiguous-or-conditional — rule applied to INVENTED posting text; not an employer's statement
  - excerpt: "Applicants must be authorized to work in the United States."
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (ambiguous-or-conditional); provisional: timing not verified

### SYNTHETIC — Example Robotics — Platform Engineer (fictional employer)

- **Company (record):** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** explicit-refusal — rule applied to INVENTED posting text; not an employer's statement
  - excerpt: "Applicants must be able to work in the United States without the need for visa sponsorship now or in the future."
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 stop
- **Next step:** skip-application — the posting refuses sponsorship: "Applicants must be able to work in the United States without the need for visa sponsorship now or in the future."

### SYNTHETIC — Example Data Systems — Backend Engineer (fictional employer)

- **Company (record):** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** apparent-offer — rule applied to INVENTED posting text; not an employer's statement
  - excerpt: "Visa sponsorship is available for this role."
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass
- **Next step:** review-offer-excerpt — offer-like wording to review (not a guarantee): "Visa sponsorship is available for this role."; provisional: timing not verified

### SYNTHETIC — Example Analytics — Platform Engineer (fictional employer)

- **Company (record):** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Liveness (your-input):** active — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: active / apply_control_visible
- **Sponsorship wording in this posting (model-judgment):** silent — rule applied to INVENTED posting text; not an employer's statement
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop
- **Next step:** seek-vacancy-sponsorship-evidence — no usable vacancy-level sponsorship evidence (silent); provisional: timing not verified

### SYNTHETIC — Example Cloud — Backend Engineer (fictional employer)

- **Company (record):** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Liveness (your-input):** expired — derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed; classifier: expired / expired_body
- **Sponsorship wording in this posting (model-judgment):** not-captured — no posting text was supplied about sponsorship
- **Timing (your-input):** factor 1, assumption: SAMPLE ONLY: the fictional persona is assumed able to start in January 2027; the posting states no start date. Not verified for any real person. · verified: no
- **Gates:** G1 pass → G2 stop
- **Next step:** skip-application — posting closed (expired_body): pattern matched: no longer accepting applications

## Waiting for a person

- Databricks — Software Engineer, Web Products: **seek-vacancy-sponsorship-evidence**
- Axia Technologies — Backend Engineer (synthetic posting): **seek-vacancy-sponsorship-evidence**
- Uplift Labs — Platform Engineer (synthetic posting): **seek-vacancy-sponsorship-evidence**
- Snowflake Computing — Distributed Systems Engineer (synthetic posting): **seek-vacancy-sponsorship-evidence**
- Example Platform Labs — Backend Engineer (fictional employer): **seek-vacancy-sponsorship-evidence**
- Example Data Systems — Backend Engineer (fictional employer): **review-offer-excerpt**
- Example Analytics — Platform Engineer (fictional employer): **seek-vacancy-sponsorship-evidence**
- Every opening: final review of this report (G6). Nothing has been applied to.

## What this run cannot verify

- That any opening will be sponsored. Company counts are aggregates with unspecified time coverage, no job codes and no per-year detail.
- That a posting is open now: every liveness value is a point-in-time snapshot or observation.
- Sponsorship wording outside the defined vocabulary; conditional wording stays unresolved.
- Whether similarly named employers are the same organization (only a human pin resolves it).
- January 2027 start compatibility: timing is a labeled sample assumption.
- Fit: a labeled sample value; no résumé matching.
