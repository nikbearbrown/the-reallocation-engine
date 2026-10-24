# Opening Triage — synthetic failure fixtures (SYNTHETIC — invented postings)

## Executive summary

This report screens 29 job openings for an experienced Java/Spring backend candidate who can start on 2027-02-01 (a date the candidate supplied; nothing about work authorization is checked). For each opening it asks, in order: does the posting still look listed, does this specific posting refuse sponsorship or require citizenship, do the stated experience requirements fit, does any stated start date fit, and is the work actually Java backend work. Company sponsorship history is shown only as context and never decides anything.

**Result for this synthetic test set:** 10 × skip-application, 7 × seek-vacancy-sponsorship-evidence, 6 × human-requirement-review, 3 × human-start-window-review, 2 × human-liveness-review, 1 × review-offer-excerpt. 29 of 29 openings are SYNTHETIC test postings. Every opening still ends with a person's review; nothing was applied to.

**Hypothesis tally (a count, not a verdict):** 18 opening(s) cleared or were unknown on experience and showed core Java-backend evidence; of those, 18 still had unresolved opening-level sponsorship or start timing.

## Run record

- Kind: **synthetic** — invented postings that exercise rare failure cases; never mixed with the real sample
- Command: `node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/synthetic-v0.3`
- Started: 2026-10-21T04:17:57.447Z · rules v0.3.0
- Input: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json` (sha256 `2d15ce6d75b8f899…`) · Candidate: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json` (persona `search/examples/tariq-lindqvist/profile.yml`)
- Candidate inputs [your-input]: 54 months full-time (4.5 years) · co-op 6 months, recorded separately and **not** counted unless a posting says so · available from 2027-02-01
- Sponsorship CSV: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2addf472b1…`)
- Labels: **record** = from a data file or an observation of a real page/feed · **model-judgment** = a rule applied to posting text · **your-input** = a candidate-supplied value, or anything derived from a SYNTHETIC posting

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
| **SYNTHETIC** SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting) | listed-and-page-active-at-observation | explicit-refusal | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S02 — Software Engineer | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S04 — Backend Engineer | listed-and-page-active-at-observation | silent | only-preferred-years-not-met | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S05 — Backend Engineer | listed-and-page-active-at-observation | silent | alternative-requirements | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S06 — Software Engineer II | listed-and-page-active-at-observation | silent | possible-level-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program | listed-and-page-active-at-observation | silent | explicit-eligibility-restriction | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S08 — Software Engineer (Graduate Program) | listed-and-page-active-at-observation | silent | explicit-eligibility-restriction | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S09 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S10 — Backend Engineer | listed-and-page-active-at-observation | silent | coop-counting-unclear | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S11 — Backend Engineer | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S13 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | conflicting-timing-statements | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S14 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | explicit-date-conflict | core-stack-evidenced | no-employer-match | **skip-application** (G5) | — |
| **SYNTHETIC** SYNTHETIC Example Co S15 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | stated-window-compatible-by-date | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | — |
| **SYNTHETIC** SYNTHETIC Example Co S16 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | asap-or-ambiguous-unresolved | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S17 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | relative-to-offer-date | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S18 — Backend Engineer (page uncertain) | page-uncertain | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked) | feed-page-disagree | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page) | gone-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G2) | — |
| **SYNTHETIC** SYNTHETIC Example Co S21 — Backend Engineer | listed-and-page-active-at-observation | silent | experience-requirement-unstated | employer-timing-unstated | java-not-evidenced | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S22 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | other-language-required | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S23 — Backend Engineer | listed-and-page-active-at-observation | silent; citizenship-required | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S24 — Backend Engineer | listed-and-page-active-at-observation | asks-about-sponsorship | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S25 — Backend Engineer | listed-and-page-active-at-observation | contradictory | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S26 — Backend Engineer | listed-and-page-active-at-observation | apparent-offer | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **review-offer-excerpt** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S27 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S28 — Backend Engineer | listed-and-page-active-at-observation | explicit-refusal | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required) | listed-and-page-active-at-observation | apparent-offer | documented-mismatch | stated-window-compatible-by-date | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | java-mentioned-outside-core | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; opening-level sponsorship evidence |

## Waiting for a person

- **SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S04 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S05 — Backend Engineer:** human-requirement-review — either/or or degree-conditioned years: a person decides which branch applies · other open gates: G7 stop
- **SYNTHETIC Example Co S06 — Software Engineer II:** human-requirement-review — candidate is above the top of an ordinary stated range (not an eligibility restriction) · other open gates: G7 stop
- **SYNTHETIC Example Co S09 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S10 — Backend Engineer:** human-requirement-review — counting the co-op would change the result and the wording does not say whether it counts · other open gates: G7 stop
- **SYNTHETIC Example Co S13 — Backend Engineer:** human-start-window-review — the posting makes more than one timing statement that do not agree · other open gates: G7 stop
- **SYNTHETIC Example Co S15 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S16 — Backend Engineer:** human-start-window-review — "We need someone to start ASAP." — not an exact date; proves neither compatibility nor conflict · other open gates: G7 stop
- **SYNTHETIC Example Co S17 — Backend Engineer:** human-start-window-review — start is tied to the offer date ("within 2 week"); the offer date is unknown, so compatibility is unresolved · other open gates: G7 stop
- **SYNTHETIC Example Co S18 — Backend Engineer (page uncertain):** human-liveness-review — page check uncertain (no_apply_control) · other open gates: G7 stop
- **SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked):** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:00:00.000Z, but the page check said expired (insufficient_content) · other open gates: G7 stop
- **SYNTHETIC Example Co S21 — Backend Engineer:** human-requirement-review — no JVM-language evidence in the posting text · other open gates: G7 stop
- **SYNTHETIC Example Co S22 — Backend Engineer:** human-requirement-review — a required line names another language without Java: "3+ years of experience and strong proficiency in Go for distributed systems on AWS." · other open gates: G7 stop
- **SYNTHETIC Example Co S24 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (asks-about-sponsorship)
- **SYNTHETIC Example Co S25 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (contradictory)
- **SYNTHETIC Example Co S26 — Backend Engineer:** review-offer-excerpt — apparent offer wording; a person reads the excerpt
- **SYNTHETIC Example Co S27 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred):** human-requirement-review — JVM language appears only in preferred lines · other open gates: G7 stop

Skipped (a person may still disagree — the reason is shown):
- SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting): the posting refuses sponsorship: "We are unable to sponsor visas for this role."
- SYNTHETIC Example Co S02 — Software Engineer: stated required minimum "8+ years" is above the candidate's 4.5 years full-time. A documented mismatch, not a claim the employer could never make an exception
- SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program: explicit experience cap: "No more than 2 years" (candidate: 4.5 years full-time)
- SYNTHETIC Example Co S08 — Software Engineer (Graduate Program): graduation window 2026-05..2026-08 excludes the candidate's stated completion
- SYNTHETIC Example Co S11 — Backend Engineer: stated required minimum "5+ years" is above the candidate's 4.5 years full-time (with the 6-month co-op it would be 5; the posting does not say co-ops count, so it is excluded by default). A documented mismatch, not a claim the employer could never make an exception
- SYNTHETIC Example Co S14 — Backend Engineer: stated start "January 2027" ends 2027-01-31, before the supplied availability 2027-02-01
- SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page): page check expired (http_gone) and absent from the employer feed
- SYNTHETIC Example Co S23 — Backend Engineer: the posting requires U.S. citizenship: "Must be a U.S. citizen."
- SYNTHETIC Example Co S28 — Backend Engineer: the posting refuses sponsorship: "Candidates must not now or in the future require visa sponsorship."
- SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required): stated required minimum "10+ years" is above the candidate's 4.5 years full-time. A documented mismatch, not a claim the employer could never make an exception
- Every opening: final review of this report (G8).

## Evidence per opening

Quoted lines are the employer's own words (from the captured posting). Lines starting with **Rule** are this mode's interpretation.

### SYNTHETIC — SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting)

- Source: https://example.com/jobs/S01 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** explicit-refusal; eligibility: none-stated
  > “We are unable to sponsor visas for this role.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S02 — Software Engineer

- Source: https://example.com/jobs/S02 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "8+ years" is above the candidate's 4.5 years full-time. A documented mismatch, not a claim the employer could never make an exception
  > “8+ years of professional Java experience building distributed systems on AWS.” — *required (“Minimum qualifications”) → below-stated-minimum*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “8+ years of professional Java experience building distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer

- Source: https://example.com/jobs/S03 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S04 — Backend Engineer

- Source: https://example.com/jobs/S04 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** only-preferred-years-not-met — the only unmet years statement is a stated preference; preferences never stop an opening
  > “7+ years of experience in payments.” — *preferred (“Nice to have”) → below-stated-minimum*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Experience with Java, Kafka, and distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S05 — Backend Engineer

- Source: https://example.com/jobs/S05 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** alternative-requirements — either/or or degree-conditioned years: a person decides which branch applies
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required (“Requirements”) → alternative-requirements*
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required (“Requirements”) → alternative-requirements*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S06 — Software Engineer II

- Source: https://example.com/jobs/S06 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** possible-level-mismatch — candidate is above the top of an ordinary stated range (not an eligibility restriction)
  > “1-3 years of Java backend experience with Kafka and AWS.” — *required (“Requirements”) → above-stated-range*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=not-mentioned · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “1-3 years of Java backend experience with Kafka and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program

- Source: https://example.com/jobs/S07 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** explicit-eligibility-restriction — explicit experience cap: "No more than 2 years" (candidate: 4.5 years full-time)
  > “No more than 2 years of full-time experience.” — *required (“Requirements”) → explicit-cap-exceeded*
  > “No more than 2 years of full-time experience.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java, distributed systems, AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S08 — Software Engineer (Graduate Program)

- Source: https://example.com/jobs/S08 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** explicit-eligibility-restriction — graduation window 2026-05..2026-08 excludes the candidate's stated completion
  > “Graduating between May 2026 and August 2026 with a degree in Computer Science.” — *graduation-outside-stated-window*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java, microservices, AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S09 — Backend Engineer

- Source: https://example.com/jobs/S09 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (5+ years) on full-time experience
  > “5+ years of Java backend experience; internships and co-ops count toward this.” — *required (“Requirements”) → meets-with-coop-explicitly-accepted*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=not-mentioned · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “5+ years of Java backend experience; internships and co-ops count toward this.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S10 — Backend Engineer

- Source: https://example.com/jobs/S10 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** coop-counting-unclear — counting the co-op would change the result and the wording does not say whether it counts
  > “5+ years of relevant professional or academic experience with Java distributed systems.” — *required (“Requirements”) → coop-would-change-result-unclear-wording*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “5+ years of relevant professional or academic experience with Java distributed systems.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S11 — Backend Engineer

- Source: https://example.com/jobs/S11 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "5+ years" is above the candidate's 4.5 years full-time (with the 6-month co-op it would be 5; the posting does not say co-ops count, so it is excluded by default). A documented mismatch, not a claim the employer could never make an exception
  > “5+ years of Java experience building distributed systems on AWS.” — *required (“Requirements”) → below-stated-minimum-coop-excluded*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “5+ years of Java experience building distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S13 — Backend Engineer

- Source: https://example.com/jobs/S13 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** conflicting-timing-statements — the posting makes more than one timing statement that do not agree · capture→availability: 103 days
  > “Start date: March 2027.” — *dated 2027-03-01..2027-03-31*
  > “Immediate start preferred.” — *asap*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S14 — Backend Engineer

- Source: https://example.com/jobs/S14 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** explicit-date-conflict — stated start "January 2027" ends 2027-01-31, before the supplied availability 2027-02-01 · capture→availability: 103 days
  > “This role starts in January 2027.” — *dated 2027-01-01..2027-01-31*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G5)

### SYNTHETIC — SYNTHETIC Example Co S15 — Backend Engineer

- Source: https://example.com/jobs/S15 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** stated-window-compatible-by-date — stated start "June 2027" (window ends 2027-06-30) is on or after availability 2027-02-01 by date arithmetic only · capture→availability: 103 days
  > “Start date: June 2027.” — *dated 2027-06-01..2027-06-30*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7)

### SYNTHETIC — SYNTHETIC Example Co S16 — Backend Engineer

- Source: https://example.com/jobs/S16 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** asap-or-ambiguous-unresolved — "We need someone to start ASAP." — not an exact date; proves neither compatibility nor conflict · capture→availability: 103 days
  > “We need someone to start ASAP.” — *asap*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S17 — Backend Engineer

- Source: https://example.com/jobs/S17 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** relative-to-offer-date — start is tied to the offer date ("within 2 week"); the offer date is unknown, so compatibility is unresolved · capture→availability: 103 days
  > “Candidates must be able to start within two weeks of accepting an offer.” — *relative*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S18 — Backend Engineer (page uncertain)

- Source: https://example.com/jobs/S18 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** page-uncertain — page check uncertain (no_apply_control)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked)

- Source: https://example.com/jobs/S19 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:00:00.000Z, but the page check said expired (insufficient_content)
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page)

- Source: https://example.com/jobs/S20 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** gone-at-observation — page check expired (http_gone) and absent from the employer feed
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 stop → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G2)

### SYNTHETIC — SYNTHETIC Example Co S21 — Backend Engineer

- Source: https://example.com/jobs/S21 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** experience-requirement-unstated — no required years stated in a recognizable form; unknown, not a match
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-not-evidenced — no JVM-language evidence in the posting text
  - where: java_jvm=not-mentioned · spring=not-mentioned · distributed_systems=required (microservices) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass-unknown → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S22 — Backend Engineer

- Source: https://example.com/jobs/S22 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of experience and strong proficiency in Go for distributed systems on AWS.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** other-language-required — a required line names another language without Java: "3+ years of experience and strong proficiency in Go for distributed systems on AWS."
  - where: java_jvm=not-mentioned · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S23 — Backend Engineer

- Source: https://example.com/jobs/S23 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: citizenship-required
  > “Must be a U.S. citizen.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S24 — Backend Engineer

- Source: https://example.com/jobs/S24 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 application-question extension]:** asks-about-sponsorship; eligibility: none-stated
  > “Will you now or in the future require sponsorship for employment visa status?”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S25 — Backend Engineer

- Source: https://example.com/jobs/S25 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 refusal extension]:** contradictory; eligibility: none-stated
  > “We can sponsor visas for this role.”
  > “This role does not offer visa sponsorship.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S26 — Backend Engineer

- Source: https://example.com/jobs/S26 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** apparent-offer; eligibility: none-stated
  > “Visa sponsorship is available for this role.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 pass → G8 review
- **Next step:** review-offer-excerpt (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S27 — Backend Engineer

- Source: https://example.com/jobs/S27 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (three (3) years of) on full-time experience
  > “Must have a Bachelor's degree in Computer Science, plus three (3) years of experience in each of the following” — *required (“Must have a Bachelor's degree in Computer Science, plus three (3) years of experience in each of the following”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java;” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S28 — Backend Engineer

- Source: https://example.com/jobs/S28 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 refusal extension]:** explicit-refusal; eligibility: none-stated
  > “Candidates must not now or in the future require visa sponsorship.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (microservices, distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “3+ years of professional experience building Java and Spring Boot microservices.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required)

- Source: https://example.com/jobs/S29 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** apparent-offer; eligibility: none-stated
  > “Visa sponsorship is available for this role.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "10+ years" is above the candidate's 4.5 years full-time. A documented mismatch, not a claim the employer could never make an exception
  > “10+ years of experience building Java microservices with Kafka on AWS.” — *required (“Requirements”) → below-stated-minimum*
- **Rule — start window [model-judgment; date arithmetic only]:** stated-window-compatible-by-date — stated start "June 2027" (window ends 2027-06-30) is on or after availability 2027-02-01 by date arithmetic only · capture→availability: 103 days
  > “Start date: June 2027.” — *dated 2027-06-01..2027-06-30*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “10+ years of experience building Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass → G6 pass → G7 pass → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred)

- Source: https://example.com/jobs/S30 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [record]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent; eligibility: none-stated
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum (3+ years) on full-time experience
  > “3+ years of experience with distributed systems and Kafka on AWS.” — *required (“Requirements”) → meets*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the posting states no start timing; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-mentioned-outside-core — JVM language appears only in preferred lines
  - where: java_jvm=preferred (java, kotlin) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java or Kotlin is a plus.” — *preferred*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

## What this run cannot verify

- That any opening will sponsor. Company counts are aggregates with unspecified time coverage; a silent posting is unknown, not a yes.
- That a posting is open now. Feed and page observations are point-in-time; a blocked page is not a closed posting.
- Work authorization, EAD approval, legal eligibility to start, or how long hiring takes. The start-window check is date arithmetic against a candidate-supplied date.
- Whether an employer would make an exception to a stated requirement, or would recognize co-op months.
- Wording outside the rules' vocabularies (paraphrases are missed), section labels the rules do not recognize, or requirements stated only in images or linked pages.
- Whether the candidate is actually good at the listed technologies. Stack evidence says where a term appears in the posting, not how well anyone matches it.
