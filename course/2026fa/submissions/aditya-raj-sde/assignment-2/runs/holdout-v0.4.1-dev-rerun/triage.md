# Opening Triage — UNSEEN postings (holdout), rules v0.4.0 frozen

## Executive summary

This report screens 6 job openings for an experienced Java/Spring backend candidate who can start on 2027-02-01 (a date the candidate supplied; nothing about work authorization is checked). For each opening it asks, in order: does the posting still look listed, does this specific posting refuse sponsorship or require citizenship, do the stated experience requirements fit, does any stated start date fit, and is the work actually Java backend work. Company sponsorship history is shown only as context and never decides anything.

**Result for this sample:** 2 × human-eligibility-review, 2 × human-liveness-review, 2 × human-requirement-review. All openings are real public postings. Every opening still ends with a person's review; nothing was applied to.

**Experience groups (disjoint; counts, not a verdict):**

| Group | Openings | of which liveness not clear | sponsorship unresolved | start timing unresolved |
|---|---|---|---|---|
| experience explicitly satisfied + core Java-backend evidence | 0 | 0 | 0 | 0 |
| experience requirement unknown (none detected) + core evidence | 2 | 1 | 2 | 2 |
| experience awaiting human review | 3 | 0 | 3 | 3 |
| documented experience mismatch / restriction | 1 | 1 | 1 | 1 |
| experience passed/unknown but stack evidence not core | 0 | 0 | 0 | 0 |

*Scope of every "none found": All counts describe what the rules detected in the captured posting body. A missing rule hit is not proof that no relevant wording exists; application-form questions were not inspected.*

## Run record

- Kind: **holdout-replay-of-captured-excerpts** — rules re-run on the committed excerpts of postings captured live on 2026-10-21; no network was used for this run
- Command: `node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout/observations.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/holdout-v0.4.1-dev-rerun`
- Started: 2026-10-21T15:29:00.725Z · rules v0.4.1
- Input: `course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout/observations.json` (sha256 `5694ba77be850f06…`) · Candidate: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json` (persona `search/examples/tariq-lindqvist/profile.yml`)
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
| DATABRICKS INC — Staff Software Engineer, Lakeflow Pipelines DR (8798198002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | only-preferred-years-not-met | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| DATABRICKS INC — Staff Software Engineer - AI Research Infrastructure (8552484002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | coop-would-change-result | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| PINTEREST INC — Staff Software Engineer, Capacity Engineering (7494668) | feed-page-disagree | silent | experience-requirement-unstated | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| PINTEREST INC — Sr. Systems Engineer, Sales & Marketing (8011573) | feed-page-disagree | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Software Engineer, Payins Card Networks (8198207) | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | java-without-backend-infrastructure-terms | matched-with-record (approvals 1250) | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Software Engineer, High Availability and Disaster Recovery (8197135) | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |

## Waiting for a person

- **DATABRICKS INC — Staff Software Engineer, Lakeflow Pipelines DR:** human-eligibility-review — clearance / export-control wording: "If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone." · other open gates: G7 stop
- **DATABRICKS INC — Staff Software Engineer - AI Research Infrastructure:** human-eligibility-review — clearance / export-control wording: "If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone." · other open gates: G4 review, G7 stop
- **PINTEREST INC — Staff Software Engineer, Capacity Engineering:** human-liveness-review — listed in the employer's board feed at 2026-10-21T15:25:19.157Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G7 stop
- **PINTEREST INC — Sr. Systems Engineer, Sales & Marketing:** human-liveness-review — listed in the employer's board feed at 2026-10-21T15:25:19.157Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters · other open gates: G4 stop, G7 stop
- **STRIPE INC — Software Engineer, Payins Card Networks:** human-requirement-review — "two (2) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 24 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G6 review, G7 stop
- **STRIPE INC — Software Engineer, High Availability and Disaster Recovery:** human-requirement-review — "three (3) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G7 stop
- Every opening: final review of this report (G8).

## Evidence per opening

Quoted lines are the employer's own words (from the captured posting). Lines starting with **Rule** are this mode's interpretation.

### DATABRICKS INC — Staff Software Engineer, Lakeflow Pipelines DR

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8798198002 · job id 8798198002 · captured 2026-10-21T04:01:51.664Z · Mountain View, California; San Francisco, California
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:18.087Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Staff Software Engineer, Lakeflow Pipelines DR - Databricks" / 7516 chars (2026-10-21T15:25:45.080Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** only-preferred-years-not-met — the only unmet or unknown years statement is a stated preference; preferences never stop an opening
  > “8+ years of experience working on related systems preferred” — *preferred (“What we look for”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 96 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Strong software engineering skills in Java, Scala, C++, Go, Python, or a similar production language” — *required*
- **Gates:** G1 pass → G2 pass → G3 review → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### DATABRICKS INC — Staff Software Engineer - AI Research Infrastructure

- Source: https://databricks.com/company/careers/open-positions/job?gh_jid=8552484002 · job id 8552484002 · captured 2026-10-21T04:01:51.664Z · New York City, New York; San Francisco, California
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:18.087Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Staff Software Engineer - AI Research Infrastructure - Databricks" / 8595 chars (2026-10-21T15:25:49.657Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: clearance-or-export-control-wording
  > “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** coop-would-change-result — "5+ years": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: unclear). The 6-month co-op is the difference and this posting is unclear about co-ops, so the outcome is unresolved — a person decides
  > “5+ years of software engineering experience, including substantial time working on large‑scale distributed systems or infrastructure.” — *required (“What We Look for”), general → coop-would-change-result; full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: unclear)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (kubernetes) · applied_ai_infra=required (inference, llms)
  > “Are proficient in one or more systems programming languages (e.g., C++, Rust, Go, Java, Scala) and can design, implement, and debug complex services.” — *required*
- **Gates:** G1 pass → G2 pass → G3 review → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-eligibility-review (decided by G3) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### PINTEREST INC — Staff Software Engineer, Capacity Engineering

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=7494668 · job id 7494668 · captured 2026-10-21T04:01:53.537Z · San Francisco, CA, US; Remote, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T15:25:19.157Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:19.157Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T15:25:54.253Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** experience-requirement-unstated — no required years stated in a recognizable form; unknown, not a match
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (highly available, distributed systems) · messaging=not-mentioned · cloud_infra=required (kubernetes, aws) · applied_ai_infra=not-mentioned
  > “Proficiency in software development languages such as Java, Python and C++” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass-unknown → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence

### PINTEREST INC — Sr. Systems Engineer, Sales & Marketing

- Source: https://www.pinterestcareers.com/jobs/?gh_jid=8011573 · job id 8011573 · captured 2026-10-21T04:01:53.537Z · San Francisco, CA, US; Remote, US
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T15:25:19.157Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:19.157Z)
  - observation [record]: page HTTP status / title / length (probe) = 403 / "Just a moment..." / 272 chars (2026-10-21T15:25:58.508Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 120 required. A documented mismatch, not a claim the employer could never make an exception
  > “10+ years of software engineering experience building and operating production systems, including full‑stack applications and/or backend services on a modern cloud platform (such as AWS or similar).” — *required (“What we’re looking for”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 120 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=required (llm, agentic)
  > “Strong proficiency in Python and experience with at least one of: Java, Node.js, and/or Javascript, with a track record of delivering reliable, maintainable code in collaborative engineering teams.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### STRIPE INC — Software Engineer, Payins Card Networks

- Source: https://stripe.com/jobs/search?gh_jid=8198207 · job id 8198207 · captured 2026-10-21T04:01:54.614Z · Seattle, WA
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:19.590Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Software Engineer, Payins Card Networks" / 5917 chars (2026-10-21T15:26:02.733Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "two (2) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 24 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “Must have a Bachelor's Degree or foreign equivalent degree in Computer Science, or a related field, plus two (2) years of experience in Software Development.” — *required (“Minimum requirements”), general → meets; full-time only: 50–54 months vs 24 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “Must also have two (2) years of experience in each of the following” — *required (“Must also have two (2) years of experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience in each of the following): 24 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
  > “Must also have one (1) year of experience in each of the following” — *required (“Must also have one (1) year of experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience in each of the following): 12 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-without-backend-infrastructure-terms — JVM language in required lines, but no distributed-systems, messaging, or cloud-infrastructure terms
  - where: java_jvm=required (java, scala) · spring=not-mentioned · distributed_systems=not-mentioned · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Java, Ruby, Scala, or Python; and” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### STRIPE INC — Software Engineer, High Availability and Disaster Recovery

- Source: https://stripe.com/jobs/search?gh_jid=8197135 · job id 8197135 · captured 2026-10-21T04:01:54.614Z · Seattle, WA
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active and listed in the employer feed at the observation times (point-in-time, not "open now")
  - observation [record]: listed in the employer board feed at capture = true (2026-10-21T15:25:19.590Z)
  - observation [record]: page HTTP status / title / length (probe) = 200 / "Stripe Careers \| Software Engineer, High Availability and Disaster Recovery" / 5670 chars (2026-10-21T15:26:07.804Z)
  - observation [model-judgment]: maintained checker verdict (heuristic) = active (2026-10-21 11:25:28 EDT)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "three (3) years of" is a scoped requirement — scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “Must have a Bachelor’s degree or foreign equivalent in Computer Science, or a related field, plus five (5) years of post-bachelor’s progressive software development work experience.” — *required (“Minimum requirements”), scoped → alternative-requirements*
  > “In the alternative, the employer is willing to accept a Master’s Degree or foreign equivalent degree in Computer Science, or a related field, plus three (3) years of software development work experience.” — *required (“Minimum requirements”), general → alternative-requirements*
  > “Must also have three (3) years of experience in each of the following” — *required (“Must also have three (3) years of experience in each of the following”), scoped → scoped-duration-unknown; scoped requirement (of experience in each of the following): 36 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (scalable, fault-tolerant, highly available, distributed production systems) · messaging=not-mentioned · cloud_infra=not-mentioned · applied_ai_infra=not-mentioned
  > “Write code, scope, design, implement, and deploy solutions using multiple technologies, including: Ruby, Java, Mongo, Postgres, and other necessary tools as required.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

## What this run cannot verify

- That any opening will sponsor. Company counts are aggregates with unspecified time coverage; a silent posting is unknown, not a yes. "Silent" means the rules detected no sponsorship wording in the captured posting body; application-form questions were not inspected.
- Years spent on a specific language, system type, activity, or domain. Total career months never establish a scoped requirement; without an explicit scoped input it is unknown.
- That a posting is open now. Feed and page observations are point-in-time; a blocked page is not a closed posting.
- Work authorization, EAD approval, legal eligibility to start, or how long hiring takes. The start-window check is date arithmetic against a candidate-supplied date.
- Whether an employer would make an exception to a stated requirement, or would recognize co-op months.
- Wording outside the rules' vocabularies (paraphrases are missed), section labels the rules do not recognize, or requirements stated only in images or linked pages.
- Whether the candidate is actually good at the listed technologies. Stack evidence says where a term appears in the posting, not how well anyone matches it.
