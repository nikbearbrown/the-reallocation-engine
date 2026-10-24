# Opening Triage — real public postings (12), captured 2026-10-21

## Executive summary

This report screens 12 job openings for an experienced Java/Spring backend candidate who can start on 2027-02-01 (a date the candidate supplied; nothing about work authorization is checked). For each opening it asks, in order: does the posting still look listed, does this specific posting refuse sponsorship or require citizenship, do the stated experience requirements fit, does any stated start date fit, and is the work actually Java backend work. Company sponsorship history is shown only as context and never decides anything.

**Result for this sample:** 4 × human-eligibility-review, 4 × human-liveness-review, 2 × human-requirement-review, 2 × skip-application. All openings are real public postings. Every opening still ends with a person's review; nothing was applied to.

**Experience groups (disjoint; counts, not a verdict):**

| Group | Openings | of which liveness not clear | sponsorship unresolved | start timing unresolved |
|---|---|---|---|---|
| experience explicitly satisfied + core Java-backend evidence | 0 | 0 | 0 | 0 |
| experience requirement unknown (none detected) + core evidence | 2 | 2 | 2 | 2 |
| experience awaiting human review | 5 | 0 | 5 | 5 |
| documented experience mismatch / restriction | 5 | 2 | 5 | 5 |
| experience passed/unknown but stack evidence not core | 0 | 0 | 0 | 0 |

*Scope of every "none found": All counts describe what the rules detected in the captured posting body. A missing rule hit is not proof that no relevant wording exists; application-form questions were not inspected.*

## Run record

- Kind: **replay-of-captured-excerpts** — rules re-run on the committed excerpts of postings captured live on 2026-10-21; no network was used for this run
- Command: `node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4.1`
- Started: 2026-10-21T15:29:00.385Z · rules v0.4.1
- Input: `course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json` (sha256 `5c44f2a3cdbf1cc1…`) · Candidate: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json` (persona `search/examples/tariq-lindqvist/profile.yml`)
- Candidate inputs [your-input]: full-time 50–54 months · co-op 4–6 months, kept separate (counted only where a posting explicitly accepts co-ops; silence/ambiguity that would change the result → review) · scoped-experience inputs: none supplied · available from 2027-02-01 · precision: month-only dates: each entry spans between (inclusive month count − 2) and the inclusive month count; overlaps counted once
- Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2addf472b1…`)
- Labels: **record** = a data-file value, a verbatim excerpt, or a raw observation (feed listing, HTTP status) · **model-judgment** = a heuristic interpretation (the page checker’s verdict, liveness combination, requirement/section/compatibility rules) · **your-input** = a candidate-supplied value, or anything derived from a SYNTHETIC posting

## Gate legend

- **G1** Input: the observation file and candidate configuration passed validation.
- **G2** Liveness at the time of observation: "stop" = both the employer feed and the page say it is gone (skip); "review" = the feed and the page disagree, or the page is uncertain / shows closure wording (a person checks). Never "open now".
- **G3** Sponsorship and eligibility wording in THIS posting: "stop" = an explicit refusal or an explicit citizenship requirement (skip). Clearance/export-control wording goes to a person. Company history is never used here.
- **G4** Experience and degree: "stop" = a documented mismatch with a stated required minimum, or an explicit eligibility restriction (experience cap, graduation window). "review" = ranges exceeded, either/or branches, unclear co-op counting, unlabeled sections. "pass-unknown" = nothing stated. A mismatch is not a claim the employer could never make an exception.
- **G5** Start window by date arithmetic only: "stop" = an explicit employer start window that ends before the supplied availability date. "review" = ASAP, offer-relative, ambiguous, or conflicting timing. "pass-unknown" = no timing stated. Never establishes work authorization, EAD approval, or hiring duration.
- **G6** Stack evidence: "pass" = a JVM language in required or responsibility lines plus backend-infrastructure terms. "review" = Java only in preferred/other lines, another language required, or too little text. Evidence locations, not a score.
- **G7** Sponsorship evidence for this opening: "pass" = apparent offer wording for a person to read (not a guarantee); otherwise "stop" = awaiting opening-level evidence.
- **G8** Final review: always a person. Nothing is applied to automatically.

## Decisions

| Opening | G2 liveness | G3 this posting: sponsorship / eligibility | G4 experience | G5 start window | G6 stack | Company history (context only) [record] | Next step | Also needed |
|---|---|---|---|---|---|---|---|---|
| DATABRICKS INC — Senior Software Engineer — Backend (Files Team) (8864368002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| DATABRICKS INC — Sr. Software Engineer - Ingestion Core team (8815669002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | requirement-section-ambiguous | employer-timing-unstated | java-mentioned-outside-core | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| DATABRICKS INC — Senior Software Engineer, Compute Infrastructure (8806934002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| DATABRICKS INC — Staff Systems Development Engineer (GovOps) (8798217002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| PINTEREST INC — Sr. Staff Software Engineer, Product ML Infrastructure (8046860) | feed-page-disagree | silent | experience-requirement-unstated | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| PINTEREST INC — Principal Engineer, AI Platform (7683977) | feed-page-disagree | silent | experience-requirement-unstated | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| PINTEREST INC — Staff Software Engineer, Ads & Core Serving Platform (8055266) | feed-page-disagree | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| PINTEREST INC — Principal Engineer, Big Data Platform (7683981) | feed-page-disagree | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Software Engineer (8249901) | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Staff Software Engineer, Link - Consumer Identity  (8142952) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **skip-application** (G4) | — |
| STRIPE INC — Senior Software Engineer, Backend (8230952) | listed-and-page-active-at-observation | silent | coop-would-change-result | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Software Engineer, Backend (8198280) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **skip-application** (G4) | — |

## Waiting for a person

- **DATABRICKS INC — Senior Software Engineer — Backend (Files Team):** human-eligibility-review — clearance / export-control wording: "If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone." · other open gates: G4 review, G7 stop
- **DATABRICKS INC — Sr. Software Engineer - Ingestion Core team:** human-eligibility-review — clearance / export-control wording: "If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone." · other open gates: G4 review, G6 review, G7 stop
- **DATABRICKS INC — Senior Software Engineer, Compute Infrastructure:** human-eligibility-review — clearance / export-control wording: "If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone." · other open gates: G4 review, G7 stop
- **DATABRICKS INC — Staff Systems Development Engineer (GovOps):** human-eligibility-review — clearance / export-control wording: "Uphold & Evolve Compliance Guardrails: Navigate and refine operational frameworks inside secure facilities (SCIF), ensuring platform interactions and deployment pipelines strictly align with FedRAMP High, ITAR/IL5, and federal security benchmarks." · other open gates: G4 stop, G7 stop
- **PINTEREST INC — Sr. Staff Software Engineer, Product ML Infrastructure:** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G7 stop
- **PINTEREST INC — Principal Engineer, AI Platform:** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G7 stop
- **PINTEREST INC — Staff Software Engineer, Ads & Core Serving Platform:** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G4 stop, G7 stop
- **PINTEREST INC — Principal Engineer, Big Data Platform:** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G4 stop, G7 stop
- **STRIPE INC — Software Engineer:** human-requirement-review — "three (3) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G7 stop
- **STRIPE INC — Senior Software Engineer, Backend:** human-requirement-review — "five (5) years of": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent). The 6-month co-op is the difference and this posting is silent about co-ops, so the outcome is unresolved — a person decides · other open gates: G7 stop

Skipped (a person may still disagree — the reason is shown):
- STRIPE INC — Staff Software Engineer, Link - Consumer Identity : stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 120 required. A documented mismatch, not a claim the employer could never make an exception
- STRIPE INC — Software Engineer, Backend: stated required minimum "six (6) years of" is not met: full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent). A documented mismatch, not a claim the employer could never make an exception
- Every opening: final review of this report (G8).

## Evidence per opening

Quoted lines are the employer's own words (from the captured posting). Lines starting with **Rule** are this mode's interpretation.

### DATABRICKS INC — Senior Software Engineer — Backend (Files Team)

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8864368002 · job id 8864368002 · captured 2026-10-21T04:01:51.664Z · San Francisco, California
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:51.664Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Senior Software Engineer — Backend (Files Team) - Databricks" / 7475 chars (2026-10-21T04:02:56.086Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "5+ years" is a scoped requirement — scoped requirement (of production-level experience in Java, Scala, C++, Go, Rust): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “5+ years of production-level experience in Java, Scala, C++, Go, Rust, or a similar language” — *required (“What We’re Looking For”), scoped → scoped-duration-unknown; scoped requirement (of production-level experience in Java, Scala, C++, Go, Rust): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “3+ years of experience developing large-scale distributed systems” — *required (“What We’re Looking For”), scoped → scoped-duration-unknown; scoped requirement (of experience developing large-scale distributed systems): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (distributed systems, microservices) · messaging=not-mentioned · cloud_infra=required (aws, gcp, azure, kubernetes) · applied_ai_infra=responsibilities (agentic, ai agents)
  > “5+ years of production-level experience in Java, Scala, C++, Go, Rust, or a similar language” — *required*
- **Gates:** G1 pass → G2 pass → G3 review → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### DATABRICKS INC — Sr. Software Engineer - Ingestion Core team

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8815669002 · job id 8815669002 · captured 2026-10-21T04:01:51.664Z · San Francisco, California
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:51.664Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Sr. Software Engineer - Ingestion Core team - Databricks" / 7667 chars (2026-10-21T04:03:00.738Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** requirement-section-ambiguous — a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording
  > “5+ years of experience writing production code in one of: Java, Scala, Go, C++, or Python.” — *ambiguous (“Ideal Engineer should have”), scoped → scoped-duration-unknown; scoped requirement (of experience writing production code in one of: Java, Scala): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-mentioned-outside-core — JVM language appears only in ambiguous lines
  - where: java_jvm=ambiguous (java, scala) · spring=not-mentioned · distributed_systems=ambiguous (distributed systems, distributed platform systems) · messaging=unclassified (sqs) · cloud_infra=not-mentioned · applied_ai_infra=responsibilities (rag, ai agents, agentic, machine learning)
  > “5+ years of experience writing production code in one of: Java, Scala, Go, C++, or Python.” — *ambiguous*
- **Gates:** G1 pass → G2 pass → G3 review → G4 review → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### DATABRICKS INC — Senior Software Engineer, Compute Infrastructure

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8806934002 · job id 8806934002 · captured 2026-10-21T04:01:51.664Z · Mountain View, California
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:51.664Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Senior Software Engineer, Compute Infrastructure - Databricks" / 6699 chars (2026-10-21T04:03:05.320Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "5+ years" is a scoped requirement — scoped requirement (of production-level experience in one of: Python, Java, Scal): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “5+ years of production-level experience in one of: Python, Java, Scala, C++, or a similar language” — *required (“What We’re Looking For”), scoped → scoped-duration-unknown; scoped requirement (of production-level experience in one of: Python, Java, Scal): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “4+ years of experience developing large-scale distributed systems from scratch” — *required (“What We’re Looking For”), scoped → scoped-duration-unknown; scoped requirement (of experience developing large-scale distributed systems fro): 48 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (distributed systems, high availability) · messaging=not-mentioned · cloud_infra=required (aws, gcp, azure, kubernetes) · applied_ai_infra=not-mentioned
  > “5+ years of production-level experience in one of: Python, Java, Scala, C++, or a similar language” — *required*
- **Gates:** G1 pass → G2 pass → G3 review → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### DATABRICKS INC — Staff Systems Development Engineer (GovOps)

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8798217002 · job id 8798217002 · captured 2026-10-21T04:01:51.664Z · McLean, Virginia
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:51.664Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Staff Systems Development Engineer (GovOps) - Databricks" / 10468 chars (2026-10-21T04:03:09.860Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “Uphold & Evolve Compliance Guardrails: Navigate and refine operational frameworks inside secure facilities (SCIF), ensuring platform interactions and deployment pipelines strictly align with FedRAMP High, ITAR/IL5, and federal security benchmarks.”
  > “Required: Candidates have active Top Secret / Sensitive Compartmented Information (TS/SCI) security clearance.”
  > “Prior experience supporting AWS Worldwide Public Sector (WWPS), isolated defense integration networks, or FedRAMP High / ITAR environments.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "7+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 84 required. A documented mismatch, not a claim the employer could never make an exception
  > “7+ years of experience in Systems Engineering, Cloud Infrastructure, Senior Support Engineering, DevSecOps, or a related technical operations role.” — *required (“What We're Looking For”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 84 required*
  > “3+ years of experience writing clear, succinct written and verbal technical communications, including technical status reports, incident summaries, or cross-team escalations.” — *required (“What We're Looking For”), scoped → scoped-duration-unknown; scoped requirement (of experience writing clear, succinct written and verbal tec): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws, gcp, azure, kubernetes) · applied_ai_infra=not-mentioned
  > “Hands-on proficiency in Python, Bash, Go, or Java with the ability to read source code, debug software defects, and write custom diagnostic scripts.” — *required*
- **Gates:** G1 pass → G2 pass → G3 review → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### PINTEREST INC — Sr. Staff Software Engineer, Product ML Infrastructure

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=8046860 · job id 8046860 · captured 2026-10-21T04:01:53.537Z · Palo Alto, CA, US; San Francisco, CA, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:53.537Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T04:03:14.375Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** experience-requirement-unstated — no required years stated in a recognizable form; unknown, not a match
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed ml systems) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=required (inference, ml infrastructure)
  > “Strong systems programming and design skills in C++, Java, or Python.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass-unknown → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence

### PINTEREST INC — Principal Engineer, AI Platform

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=7683977 · job id 7683977 · captured 2026-10-21T04:01:53.537Z · San Francisco, CA, US; Remote, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:53.537Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T04:03:18.617Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** experience-requirement-unstated — no required years stated in a recognizable form; unknown, not a match
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems, highly available) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=required (ml infrastructure, inference)
  > “Deep expertise in AI/ML infrastructure and distributed systems: Hands-on experience designing, building, and operating highly available, production-grade systems at large scale; strong technical judgment; and proficiency in at least one of C++, Java, or Rust.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass-unknown → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence

### PINTEREST INC — Staff Software Engineer, Ads & Core Serving Platform

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=8055266 · job id 8055266 · captured 2026-10-21T04:01:53.537Z · Palo Alto, CA, US; San Francisco, CA, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:53.537Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T04:03:22.865Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "8+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 96 required. A documented mismatch, not a claim the employer could never make an exception
  > “8+ years of software engineering experience building and operating production backend or distributed systems.” — *required (“What we’re looking for”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 96 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems, scalability, highly available, scalable) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Proficiency in one or more programming languages such as Java, C++, Go, or Python.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### PINTEREST INC — Principal Engineer, Big Data Platform

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=7683981 · job id 7683981 · captured 2026-10-21T04:01:53.537Z · San Francisco, CA, US; Remote, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:53.537Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T04:03:27.098Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "12+ years" is not met: full-time only: 50–54 months vs 144 required; with the co-op: 54–60 months (co-op wording in this posting: unclear). A documented mismatch, not a claim the employer could never make an exception
  > “12+ years of industry experience with a proven track record of technical excellence” — *required (“What we’re looking for”), general → below-even-with-coop; full-time only: 50–54 months vs 144 required; with the co-op: 54–60 months (co-op wording in this posting: unclear)*
  > “8+ years of experience of building and support large scalable Kubernetes or big data platform” — *required (“What we’re looking for”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 96 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (scalable) · messaging=not-mentioned · cloud_infra=required (kubernetes, aws) · applied_ai_infra=not-mentioned
  > “Proficiency in one or more programming languages (Java, Go, Scala, Python)” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### STRIPE INC — Software Engineer

- Source: https://stripe.com/jobs/search?gh_jid=8249901 · job id 8249901 · captured 2026-10-21T04:01:54.614Z · Seattle, WA
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:54.614Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Software Engineer" / 5375 chars (2026-10-21T04:03:31.329Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "three (3) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “Must have a Bachelor's degree or foreign equivalent in Computer Science or a related field, plus three (3) years of software engineering or related experience.” — *required (“Must have a Bachelor's degree or foreign equivalent in Computer Science or a related field, plus three (3) years of software engineering or related experience.”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “Must have three (3) years of experience in each of the following” — *required (“Must have three (3) years of experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems, scalable) · messaging=not-mentioned · cloud_infra=required (aws, azure) · applied_ai_infra=not-mentioned
  > “Go, Python or Java;” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### STRIPE INC — Staff Software Engineer, Link - Consumer Identity 

- Source: https://stripe.com/jobs/search?gh_jid=8142952 · job id 8142952 · captured 2026-10-21T04:01:54.614Z · San Francisco, Seattle, New York
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:54.614Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Staff Software Engineer, Link - Consumer Identity" / 8870 chars (2026-10-21T04:03:36.413Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 120 required. A documented mismatch, not a claim the employer could never make an exception
  > “10+ years of backend and/or full-stack software development experience, with a track record of owning large, ambiguous systems end-to-end.” — *required (“Minimum requirements”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 120 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in responsibilities lines, plus backend-infrastructure terms
  - where: java_jvm=responsibilities (java) · spring=not-mentioned · distributed_systems=responsibilities (scalable) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Build robust, scalable backend services and high-quality consumer-facing experiences across Java, Ruby, and TypeScript.” — *responsibilities*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### STRIPE INC — Senior Software Engineer, Backend

- Source: https://stripe.com/jobs/search?gh_jid=8230952 · job id 8230952 · captured 2026-10-21T04:01:54.614Z · Seattle, WA
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:54.614Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Senior Software Engineer, Backend" / 6129 chars (2026-10-21T04:03:41.428Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** coop-would-change-result — "five (5) years of": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent). The 6-month co-op is the difference and this posting is silent about co-ops, so the outcome is unresolved — a person decides
  > “Must have a Bachelor's Degree or foreign equivalent degree in Computer Science, Information Systems Security, or a related field, plus five (5) years of related work experience in Software Engineering.” — *required (“Minimum requirements”), general → coop-would-change-result; full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “5 years of experience programming in Java, Scala, or Python;” — *required (“Must also have experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience programming in Java, Scala, or Python;): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “5 years of experience designing, building, and maintaining scalable distributed systems;” — *required (“Must also have experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience designing, building, and maintaining scalable ): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “5 years of experience debugging production issues across services and multiple levels of the stack;” — *required (“Must also have experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience debugging production issues across services an): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “5 years of experience with different testing tools and frameworks including JUnit, Mockito, and TestNG;” — *required (“Must also have experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience with different testing tools and frameworks in): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (distributed systems, scalable) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “5 years of experience programming in Java, Scala, or Python;” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### STRIPE INC — Software Engineer, Backend

- Source: https://stripe.com/jobs/search?gh_jid=8198280 · job id 8198280 · captured 2026-10-21T04:01:54.614Z · Seattle, WA
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T04:01:54.614Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Software Engineer, Backend" / 5338 chars (2026-10-21T04:03:46.245Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 00:02:07 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "six (6) years of" is not met: full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent). A documented mismatch, not a claim the employer could never make an exception
  > “Must have a Master's degree or foreign equivalent in Computer Science, Software Engineering, or a related field, plus six (6) years of software development experience.” — *required (“Minimum requirements”), general → below-even-with-coop; full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “Must also have four (4) years of experience in each of the following” — *required (“Must also have four (4) years of experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience in each of the following): 48 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (scalable, distributed systems, microservices, scalability) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Building software solutions in Java, C++, Python, or Ruby;” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

## What this run cannot verify

- That any opening will sponsor. Company counts are aggregates with unspecified time coverage; a silent posting is unknown, not a yes. "Silent" means the rules detected no sponsorship wording in the captured posting body; application-form questions were not inspected.
- Years spent on a specific language, system type, activity, or domain. Total career months never establish a scoped requirement; without an explicit scoped input it is unknown.
- That a posting is open now. Feed and page observations are point-in-time; a blocked page is not a closed posting.
- Work authorization, EAD approval, legal eligibility to start, or how long hiring takes. The start-window check is date arithmetic against a candidate-supplied date.
- Whether an employer would make an exception to a stated requirement, or would recognize co-op months.
- Wording outside the rules' vocabularies (paraphrases are missed), section labels the rules do not recognize, or requirements stated only in images or linked pages.
- Whether the candidate is actually good at the listed technologies. Stack evidence says where a term appears in the posting, not how well anyone matches it.
