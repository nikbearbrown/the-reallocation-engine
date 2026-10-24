# Opening Triage — synthetic failure fixtures (SYNTHETIC — invented postings)

## Executive summary

This report screens 40 job openings for an experienced Java/Spring backend candidate who can start on 2027-02-01 (a date the candidate supplied; nothing about work authorization is checked). For each opening it asks, in order: does the posting still look listed, does this specific posting refuse sponsorship or require citizenship, do the stated experience requirements fit, does any stated start date fit, and is the work actually Java backend work. Company sponsorship history is shown only as context and never decides anything.

**Result for this synthetic test set:** 11 × skip-application, 7 × seek-vacancy-sponsorship-evidence, 13 × human-requirement-review, 5 × human-start-window-review, 3 × human-liveness-review, 1 × review-offer-excerpt. 40 of 40 openings are SYNTHETIC test postings. Every opening still ends with a person's review; nothing was applied to.

**Experience groups (disjoint; counts, not a verdict):**

| Group | Openings | of which liveness not clear | sponsorship unresolved | start timing unresolved |
|---|---|---|---|---|
| experience explicitly satisfied + core Java-backend evidence | 20 | 4 | 19 | 18 |
| experience requirement unknown (none detected) + core evidence | 1 | 0 | 1 | 1 |
| experience awaiting human review | 10 | 0 | 10 | 10 |
| documented experience mismatch / restriction | 6 | 0 | 5 | 5 |
| experience passed/unknown but stack evidence not core | 3 | 0 | 3 | 3 |

*Scope of every "none found": All counts describe what the rules detected in the captured posting body. A missing rule hit is not proof that no relevant wording exists; application-form questions were not inspected.*

## Run record

- Kind: **synthetic** — invented postings that exercise rare failure cases; never mixed with the real sample
- Command: `node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/synthetic-v0.4.1`
- Started: 2026-10-21T15:29:00.891Z · rules v0.4.1
- Input: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json` (sha256 `c9e5ef0cbc888eaf…`) · Candidate: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json` (persona `search/examples/tariq-lindqvist/profile.yml`)
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
| **SYNTHETIC** SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting) | listed-and-page-active-at-observation | explicit-refusal | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S02 — Software Engineer | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S04 — Backend Engineer | listed-and-page-active-at-observation | silent | only-preferred-years-not-met | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S05 — Backend Engineer | listed-and-page-active-at-observation | silent | alternative-requirements | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S06 — Software Engineer II | listed-and-page-active-at-observation | silent | possible-level-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program | listed-and-page-active-at-observation | silent | explicit-eligibility-restriction | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S08 — Software Engineer (Graduate Program) | listed-and-page-active-at-observation | silent | explicit-eligibility-restriction | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S09 — Backend Engineer | listed-and-page-active-at-observation | silent | within-date-precision | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S10 — Backend Engineer | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S11 — Backend Engineer | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S13 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | conflicting-timing-statements | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S14 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | explicit-date-conflict | core-stack-evidenced | no-employer-match | **skip-application** (G5) | — |
| **SYNTHETIC** SYNTHETIC Example Co S15 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | stated-start-compatible-by-date | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | — |
| **SYNTHETIC** SYNTHETIC Example Co S16 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | asap-or-ambiguous-unresolved | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S17 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | relative-to-offer-date | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S18 — Backend Engineer (page uncertain) | page-uncertain | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked) | feed-page-disagree | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page) | gone-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G2) | — |
| **SYNTHETIC** SYNTHETIC Example Co S21 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | java-not-evidenced | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S22 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | other-language-required | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S23 — Backend Engineer | listed-and-page-active-at-observation | silent; citizenship-required | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S24 — Backend Engineer | listed-and-page-active-at-observation | asks-about-sponsorship | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S25 — Backend Engineer | listed-and-page-active-at-observation | contradictory | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S26 — Backend Engineer | listed-and-page-active-at-observation | apparent-offer | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **review-offer-excerpt** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S27 — Backend Engineer | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S28 — Backend Engineer | listed-and-page-active-at-observation | explicit-refusal | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G3) | — |
| **SYNTHETIC** SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required) | listed-and-page-active-at-observation | apparent-offer | documented-mismatch | stated-start-compatible-by-date | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | java-mentioned-outside-core | no-employer-match | **human-requirement-review** (G6) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S31 — Backend Engineer (silent on co-ops, boundary) | listed-and-page-active-at-observation | silent | coop-would-change-result | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S32 — Backend Engineer (co-ops explicitly excluded) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S33 — Backend Engineer (short even with the co-op) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | no-employer-match | **skip-application** (G4) | — |
| **SYNTHETIC** SYNTHETIC Example Co S34 — Backend Engineer (scoped years within the career bound) | listed-and-page-active-at-observation | silent | scoped-duration-unknown | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S35 — Backend Engineer (general minimum met) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| **SYNTHETIC** SYNTHETIC Example Co S40 — Backend Engineer (season only) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | season-conflict-under-assumption | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S41 — Backend Engineer (descriptive month) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | descriptive-timing-conflict | core-stack-evidenced | no-employer-match | **human-start-window-review** (G5) | opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S42 — Backend Engineer (mixed heading) | listed-and-page-active-at-observation | silent | requirement-section-ambiguous | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S43 — Backend Engineer (conditional heading) | listed-and-page-active-at-observation | silent | requirement-section-ambiguous | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S44 — Backend Engineer (unrecognized heading) | listed-and-page-active-at-observation | silent | requirement-section-unclear | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| **SYNTHETIC** SYNTHETIC Example Co S45 — Backend Engineer (blocked page, no feed observation) | page-blocked-or-thin | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | no-employer-match | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |

## Waiting for a person

- **SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S04 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S05 — Backend Engineer:** human-requirement-review — either/or or degree-conditioned years: a person decides which branch applies · other open gates: G7 stop
- **SYNTHETIC Example Co S06 — Software Engineer II:** human-requirement-review — candidate is above the top of an ordinary stated range (not an eligibility restriction) · other open gates: G7 stop
- **SYNTHETIC Example Co S09 — Backend Engineer:** human-requirement-review — "5+ years": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: accepted) — within the precision of month-only dates; a person checks exact dates · other open gates: G7 stop
- **SYNTHETIC Example Co S10 — Backend Engineer:** human-requirement-review — "5+ years" is a scoped requirement — scoped requirement (of relevant professional or academic experience with Java di): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G7 stop
- **SYNTHETIC Example Co S11 — Backend Engineer:** human-requirement-review — "5+ years" is a scoped requirement — scoped requirement (of Java experience building distributed systems on AWS.): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G7 stop
- **SYNTHETIC Example Co S13 — Backend Engineer:** human-start-window-review — the posting makes more than one timing statement that do not agree or cannot be resolved together · other open gates: G7 stop
- **SYNTHETIC Example Co S15 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S16 — Backend Engineer:** human-start-window-review — "We need someone to start ASAP." — not an exact constraint; proves neither compatibility nor conflict · other open gates: G7 stop
- **SYNTHETIC Example Co S17 — Backend Engineer:** human-start-window-review — start is tied to the offer date ("within 2 week"); the offer date is unknown, so compatibility is unresolved · other open gates: G7 stop
- **SYNTHETIC Example Co S18 — Backend Engineer (page uncertain):** human-liveness-review — page check uncertain (no_apply_control) · other open gates: G7 stop
- **SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked):** human-liveness-review — listed in the employer's board feed at 2026-10-21T04:00:00.000Z, but the page check said expired (insufficient_content) · other open gates: G7 stop
- **SYNTHETIC Example Co S21 — Backend Engineer:** human-requirement-review — no JVM-language evidence in the posting text · other open gates: G7 stop
- **SYNTHETIC Example Co S22 — Backend Engineer:** human-requirement-review — a required line names another language without Java: "Strong proficiency in Go for distributed systems on AWS." · other open gates: G7 stop
- **SYNTHETIC Example Co S24 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (asks-about-sponsorship)
- **SYNTHETIC Example Co S25 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (contradictory)
- **SYNTHETIC Example Co S26 — Backend Engineer:** review-offer-excerpt — apparent offer wording; a person reads the excerpt
- **SYNTHETIC Example Co S27 — Backend Engineer:** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred):** human-requirement-review — JVM language appears only in preferred lines · other open gates: G7 stop
- **SYNTHETIC Example Co S31 — Backend Engineer (silent on co-ops, boundary):** human-requirement-review — "5+ years": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent). The 6-month co-op is the difference and this posting is silent about co-ops, so the outcome is unresolved — a person decides · other open gates: G7 stop
- **SYNTHETIC Example Co S34 — Backend Engineer (scoped years within the career bound):** human-requirement-review — "4+ years" is a scoped requirement — scoped requirement (of experience with Kafka.): 48 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied · other open gates: G7 stop
- **SYNTHETIC Example Co S35 — Backend Engineer (general minimum met):** seek-vacancy-sponsorship-evidence — awaiting opening-level sponsorship evidence (silent)
- **SYNTHETIC Example Co S40 — Backend Engineer (season only):** human-start-window-review — "Fall 2026" (season, fixed 2026-09-01..2026-11-30) ends before 2027-02-01 only under the model assumption: fall = september–november (not employer-stated dates); a season cannot hard-reject · other open gates: G7 stop
- **SYNTHETIC Example Co S41 — Backend Engineer (descriptive month):** human-start-window-review — "January 2027" (month, fixed 2027-01-01..2027-01-31) is before 2027-02-01, but the wording is descriptive, not a stated requirement · other open gates: G7 stop
- **SYNTHETIC Example Co S42 — Backend Engineer (mixed heading):** human-requirement-review — a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording · other open gates: G7 stop
- **SYNTHETIC Example Co S43 — Backend Engineer (conditional heading):** human-requirement-review — a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording · other open gates: G7 stop
- **SYNTHETIC Example Co S44 — Backend Engineer (unrecognized heading):** human-requirement-review — a years statement the candidate does not clearly meet appears under an unrecognized or non-requirement heading · other open gates: G7 stop
- **SYNTHETIC Example Co S45 — Backend Engineer (blocked page, no feed observation):** human-liveness-review — the page check said expired only because the page was thin or blocked (insufficient_content) — that is not evidence of closure · other open gates: G7 stop

Skipped (a person may still disagree — the reason is shown):
- SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting): the posting refuses sponsorship: "We are unable to sponsor visas for this role."
- SYNTHETIC Example Co S02 — Software Engineer: stated required minimum "8+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 96 required. A documented mismatch, not a claim the employer could never make an exception
- SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program: explicit experience cap: "No more than 2 years" (full-time 50–54 months vs cap 24)
- SYNTHETIC Example Co S08 — Software Engineer (Graduate Program): graduation window 2026-05..2026-08 excludes the candidate's stated completion
- SYNTHETIC Example Co S14 — Backend Engineer: "January 2027" (month, fixed 2027-01-01..2027-01-31) is before the supplied availability 2027-02-01 (date arithmetic only)
- SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page): page shows closure evidence (http_gone) and the posting was absent from the employer feed
- SYNTHETIC Example Co S23 — Backend Engineer: the posting requires U.S. citizenship: "Must be a U.S. citizen."
- SYNTHETIC Example Co S28 — Backend Engineer: the posting refuses sponsorship: "Candidates must not now or in the future require visa sponsorship."
- SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required): stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 120 required. A documented mismatch, not a claim the employer could never make an exception
- SYNTHETIC Example Co S32 — Backend Engineer (co-ops explicitly excluded): stated required minimum "5+ years" is not met: full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: excluded) (the posting excludes co-ops). A documented mismatch, not a claim the employer could never make an exception
- SYNTHETIC Example Co S33 — Backend Engineer (short even with the co-op): stated required minimum "6+ years" is not met: full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent). A documented mismatch, not a claim the employer could never make an exception
- Every opening: final review of this report (G8).

## Evidence per opening

Quoted lines are the employer's own words (from the captured posting). Lines starting with **Rule** are this mode's interpretation.

### SYNTHETIC — SYNTHETIC posting matched to the CSV row of a high-approval employer (record only; text invented) — Backend Engineer (strong company record, refusing posting)

- Source: https://example.com/jobs/S01 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** explicit-refusal; eligibility: no citizenship/clearance wording detected by the rules
  > “We are unable to sponsor visas for this role.”
- **Company history [record, context only]:** matched-with-record — historical aggregate counts, unspecified time coverage; not evidence about this opening
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S02 — Software Engineer

- Source: https://example.com/jobs/S02 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "8+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 96 required. A documented mismatch, not a claim the employer could never make an exception
  > “8+ years of professional Java experience building distributed systems on AWS.” — *required (“Minimum qualifications”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 96 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “8+ years of professional Java experience building distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S03 — Senior Staff Principal Backend Engineer

- Source: https://example.com/jobs/S03 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S04 — Backend Engineer

- Source: https://example.com/jobs/S04 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** only-preferred-years-not-met — the only unmet or unknown years statement is a stated preference; preferences never stop an opening
  > “7+ years of experience in payments.” — *preferred (“Nice to have”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 84 required*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Experience with Java, Kafka, and distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S05 — Backend Engineer

- Source: https://example.com/jobs/S05 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** alternative-requirements — either/or or degree-conditioned years: a person decides which branch applies
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required (“Requirements”), general → alternative-requirements*
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required (“Requirements”), general → alternative-requirements*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “BS with 6+ years of experience, or MS with 4+ years of experience, in backend Java development.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S06 — Software Engineer II

- Source: https://example.com/jobs/S06 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** possible-level-mismatch — candidate is above the top of an ordinary stated range (not an eligibility restriction)
  > “1-3 years of professional software engineering experience.” — *required (“Requirements”), general → above-stated-range; full-time only: 50–54 months vs 12 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=not-mentioned · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java backend work with Kafka and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S07 — Software Engineer, Early-Career Program

- Source: https://example.com/jobs/S07 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** explicit-eligibility-restriction — explicit experience cap: "No more than 2 years" (full-time 50–54 months vs cap 24)
  > “No more than 2 years of full-time experience.” — *required (“Requirements”), general → explicit-cap-exceeded; full-time 50–54 months vs cap 24*
  > “No more than 2 years of full-time experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 24 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java, distributed systems, AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S08 — Software Engineer (Graduate Program)

- Source: https://example.com/jobs/S08 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** explicit-eligibility-restriction — graduation window 2026-05..2026-08 excludes the candidate's stated completion
  > “Graduating between May 2026 and August 2026 with a degree in Computer Science.” — *graduation-outside-stated-window*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java, microservices, AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S09 — Backend Engineer

- Source: https://example.com/jobs/S09 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** within-date-precision — "5+ years": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: accepted) — within the precision of month-only dates; a person checks exact dates
  > “5+ years of professional software engineering experience; internships and co-ops count toward this.” — *required (“Requirements”), general → within-date-precision; full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: accepted)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S10 — Backend Engineer

- Source: https://example.com/jobs/S10 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "5+ years" is a scoped requirement — scoped requirement (of relevant professional or academic experience with Java di): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “5+ years of relevant professional or academic experience with Java distributed systems.” — *required (“Requirements”), scoped → scoped-duration-unknown; scoped requirement (of relevant professional or academic experience with Java di): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “5+ years of relevant professional or academic experience with Java distributed systems.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S11 — Backend Engineer

- Source: https://example.com/jobs/S11 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "5+ years" is a scoped requirement — scoped requirement (of Java experience building distributed systems on AWS.): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “5+ years of Java experience building distributed systems on AWS.” — *required (“Requirements”), scoped → scoped-duration-unknown; scoped requirement (of Java experience building distributed systems on AWS.): 60 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “5+ years of Java experience building distributed systems on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S13 — Backend Engineer

- Source: https://example.com/jobs/S13 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** conflicting-timing-statements — the posting makes more than one timing statement that do not agree or cannot be resolved together · capture→availability: 103 days
  > “Start date: March 2027.” — *month 2027-03-01..2027-03-31*
  > “Immediate start preferred.” — *asap*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S14 — Backend Engineer

- Source: https://example.com/jobs/S14 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** explicit-date-conflict — "January 2027" (month, fixed 2027-01-01..2027-01-31) is before the supplied availability 2027-02-01 (date arithmetic only) · capture→availability: 103 days
  > “This role starts in January 2027.” — *month 2027-01-01..2027-01-31*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 stop → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G5)

### SYNTHETIC — SYNTHETIC Example Co S15 — Backend Engineer

- Source: https://example.com/jobs/S15 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** stated-start-compatible-by-date — "June 2027" (month, fixed 2027-06-01..2027-06-30) — compatible with availability 2027-02-01 by date arithmetic only · capture→availability: 103 days
  > “Start date: June 2027.” — *month 2027-06-01..2027-06-30*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7)

### SYNTHETIC — SYNTHETIC Example Co S16 — Backend Engineer

- Source: https://example.com/jobs/S16 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** asap-or-ambiguous-unresolved — "We need someone to start ASAP." — not an exact constraint; proves neither compatibility nor conflict · capture→availability: 103 days
  > “We need someone to start ASAP.” — *asap*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S17 — Backend Engineer

- Source: https://example.com/jobs/S17 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** relative-to-offer-date — start is tied to the offer date ("within 2 week"); the offer date is unknown, so compatibility is unresolved · capture→availability: 103 days
  > “Candidates must be able to start within two weeks of accepting an offer.” — *relative*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S18 — Backend Engineer (page uncertain)

- Source: https://example.com/jobs/S18 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** page-uncertain — page check uncertain (no_apply_control)
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = uncertain / no_apply_control
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S19 — Backend Engineer (feed lists it, page blocked)

- Source: https://example.com/jobs/S19 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** feed-page-disagree — listed in the employer's board feed at 2026-10-21T04:00:00.000Z, but the page check said expired (insufficient_content)
  - observation [your-input]: listed in the employer board feed at capture = true (2026-10-21T04:00:00.000Z)
  - observation [your-input]: page HTTP status (snapshot) = 403
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient_content
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S20 — Backend Engineer (gone in feed and page)

- Source: https://example.com/jobs/S20 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** gone-at-observation — page shows closure evidence (http_gone) and the posting was absent from the employer feed
  - observation [your-input]: listed in the employer board feed at capture = false (2026-10-21T04:00:00.000Z)
  - observation [your-input]: page HTTP status (snapshot) = 404
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / http_gone
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 stop → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G2)

### SYNTHETIC — SYNTHETIC Example Co S21 — Backend Engineer

- Source: https://example.com/jobs/S21 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-not-evidenced — no JVM-language evidence in the posting text
  - where: java_jvm=not-mentioned · spring=not-mentioned · distributed_systems=required (microservices) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S22 — Backend Engineer

- Source: https://example.com/jobs/S22 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** other-language-required — a required line names another language without Java: "Strong proficiency in Go for distributed systems on AWS."
  - where: java_jvm=not-mentioned · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=not-mentioned · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S23 — Backend Engineer

- Source: https://example.com/jobs/S23 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: citizenship-required
  > “Must be a U.S. citizen.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S24 — Backend Engineer

- Source: https://example.com/jobs/S24 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 application-question extension]:** asks-about-sponsorship; eligibility: no citizenship/clearance wording detected by the rules
  > “Will you now or in the future require sponsorship for employment visa status?”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S25 — Backend Engineer

- Source: https://example.com/jobs/S25 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 refusal extension]:** contradictory; eligibility: no citizenship/clearance wording detected by the rules
  > “We can sponsor visas for this role.”
  > “This role does not offer visa sponsorship.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S26 — Backend Engineer

- Source: https://example.com/jobs/S26 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** apparent-offer; eligibility: no citizenship/clearance wording detected by the rules
  > “Visa sponsorship is available for this role.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 pass → G8 review
- **Next step:** review-offer-excerpt (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S27 — Backend Engineer

- Source: https://example.com/jobs/S27 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("three (3) years of": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “Must have a Bachelor's degree in Computer Science, plus three (3) years of professional software engineering experience” — *required (“Must have a Bachelor's degree in Computer Science, plus three (3) years of professional software engineering experience”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java;” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S28 — Backend Engineer

- Source: https://example.com/jobs/S28 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-2 refusal extension]:** explicit-refusal; eligibility: no citizenship/clearance wording detected by the rules
  > “Candidates must not now or in the future require visa sponsorship.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 stop → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G3)

### SYNTHETIC — SYNTHETIC Example Co S29 — Backend Engineer (offer wording, but 10+ years required)

- Source: https://example.com/jobs/S29 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** apparent-offer; eligibility: no citizenship/clearance wording detected by the rules
  > “Visa sponsorship is available for this role.”
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op included) is below 120 required. A documented mismatch, not a claim the employer could never make an exception
  > “10+ years of experience building Java microservices with Kafka on AWS.” — *required (“Requirements”), scoped → below-even-with-all-experience; even all recorded experience (at most 60 months, co-op included) is below 120 required*
- **Rule — start window [model-judgment; date arithmetic only]:** stated-start-compatible-by-date — "June 2027" (month, fixed 2027-06-01..2027-06-30) — compatible with availability 2027-02-01 by date arithmetic only · capture→availability: 103 days
  > “Start date: June 2027.” — *month 2027-06-01..2027-06-30*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “10+ years of experience building Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass → G6 pass → G7 pass → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S30 — Backend Engineer (Java only preferred)

- Source: https://example.com/jobs/S30 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** java-mentioned-outside-core — JVM language appears only in preferred lines
  - where: java_jvm=preferred (java, kotlin) · spring=not-mentioned · distributed_systems=required (distributed systems) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Java or Kotlin is a plus.” — *preferred*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 review → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G6) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S31 — Backend Engineer (silent on co-ops, boundary)

- Source: https://example.com/jobs/S31 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** coop-would-change-result — "5+ years": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent). The 6-month co-op is the difference and this posting is silent about co-ops, so the outcome is unresolved — a person decides
  > “5+ years of professional software engineering experience.” — *required (“Requirements”), general → coop-would-change-result; full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S32 — Backend Engineer (co-ops explicitly excluded)

- Source: https://example.com/jobs/S32 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "5+ years" is not met: full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: excluded) (the posting excludes co-ops). A documented mismatch, not a claim the employer could never make an exception
  > “5+ years of professional software engineering experience (internships and co-ops do not count).” — *required (“Requirements”), general → below-stated-minimum; full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: excluded)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S33 — Backend Engineer (short even with the co-op)

- Source: https://example.com/jobs/S33 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** documented-mismatch — stated required minimum "6+ years" is not met: full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent). A documented mismatch, not a claim the employer could never make an exception
  > “6+ years of professional software engineering experience.” — *required (“Requirements”), general → below-even-with-coop; full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 stop → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** skip-application (decided by G4)

### SYNTHETIC — SYNTHETIC Example Co S34 — Backend Engineer (scoped years within the career bound)

- Source: https://example.com/jobs/S34 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** scoped-duration-unknown — "4+ years" is a scoped requirement — scoped requirement (of experience with Kafka.): 48 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “4+ years of experience with Kafka.” — *required (“Requirements”), scoped → scoped-duration-unknown; scoped requirement (of experience with Kafka.): 48 months required; total recorded experience (up to 60 months) does not establish time spent on this specific skill/area, and no scoped input was supplied*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S35 — Backend Engineer (general minimum met)

- Source: https://example.com/jobs/S35 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("4+ years": full-time only: 50–54 months vs 48 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “4+ years of professional software development experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 48 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** seek-vacancy-sponsorship-evidence (decided by G7) · also needed: confirm the start date with the employer

### SYNTHETIC — SYNTHETIC Example Co S40 — Backend Engineer (season only)

- Source: https://example.com/jobs/S40 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** season-conflict-under-assumption — "Fall 2026" (season, fixed 2026-09-01..2026-11-30) ends before 2027-02-01 only under the model assumption: fall = september–november (not employer-stated dates); a season cannot hard-reject · capture→availability: 103 days
  > “Start date: Fall 2026.” — *season 2026-09-01..2026-11-30*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S41 — Backend Engineer (descriptive month)

- Source: https://example.com/jobs/S41 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** descriptive-timing-conflict — "January 2027" (month, fixed 2027-01-01..2027-01-31) is before 2027-02-01, but the wording is descriptive, not a stated requirement · capture→availability: 103 days
  > “Our next engineering cohort begins onboarding in January 2027.” — *month 2027-01-01..2027-01-31*
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 pass → G5 review → G6 pass → G7 stop → G8 review
- **Next step:** human-start-window-review (decided by G5) · also needed: opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S42 — Backend Engineer (mixed heading)

- Source: https://example.com/jobs/S42 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** requirement-section-ambiguous — a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “6+ years of professional software engineering experience.” — *ambiguous (“Preferred requirements”), general → below-even-with-coop; full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S43 — Backend Engineer (conditional heading)

- Source: https://example.com/jobs/S43 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** requirement-section-ambiguous — a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “6+ years of professional software engineering experience.” — *ambiguous (“Requirements (for senior-level candidates)”), general → below-even-with-coop; full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S44 — Backend Engineer (unrecognized heading)

- Source: https://example.com/jobs/S44 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** listed-and-page-active-at-observation — page active at the observation times (point-in-time, not "open now")
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 200
  - observation [model-judgment]: maintained checker verdict (heuristic) = active / apply_control_visible
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** requirement-section-unclear — a years statement the candidate does not clearly meet appears under an unrecognized or non-requirement heading
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
  > “7+ years of professional software engineering experience.” — *other (“Team background”), general → below-even-with-coop; full-time only: 50–54 months vs 84 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=not-mentioned · distributed_systems=required (microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java microservices with Kafka on AWS.” — *required*
- **Gates:** G1 pass → G2 pass → G3 pass → G4 review → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-requirement-review (decided by G4) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

### SYNTHETIC — SYNTHETIC Example Co S45 — Backend Engineer (blocked page, no feed observation)

- Source: https://example.com/jobs/S45 · captured 2026-10-21T04:00:00.000Z
- **Rule — liveness [model-judgment]:** page-blocked-or-thin — the page check said expired only because the page was thin or blocked (insufficient_content) — that is not evidence of closure
  - observation [not observed]: listed in the employer board feed at capture =  (n/a)
  - observation [your-input]: page HTTP status (snapshot) = 403
  - observation [model-judgment]: maintained checker verdict (heuristic) = expired / insufficient_content
- **Rule — sponsorship wording in this posting [model-judgment; assignment-1 classifier]:** silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected); eligibility: no citizenship/clearance wording detected by the rules
- **Company history [record, context only]:** no-employer-match — no CSV row matches this name; not zero, not a refusal
- **Rule — experience [model-judgment]:** meets-stated-required-minimums — meets every stated required minimum ("3+ years": full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent))
  > “3+ years of professional software engineering experience.” — *required (“Requirements”), general → meets; full-time only: 50–54 months vs 36 required; with the co-op: 54–60 months (co-op wording in this posting: silent)*
- **Rule — start window [model-judgment; date arithmetic only]:** employer-timing-unstated — the rules found no start-timing statement in the captured text; unknown — confirm with the employer · capture→availability: 103 days
- **Rule — stack evidence [model-judgment]:** core-stack-evidenced — JVM language in required lines, plus backend-infrastructure terms
  - where: java_jvm=required (java) · spring=required (spring boot) · distributed_systems=required (distributed systems, microservices) · messaging=required (kafka) · cloud_infra=required (aws) · applied_ai_infra=not-mentioned
  > “Build Java and Spring Boot microservices with Kafka, distributed systems, and AWS.” — *required*
- **Gates:** G1 pass → G2 review → G3 pass → G4 pass → G5 pass-unknown → G6 pass → G7 stop → G8 review
- **Next step:** human-liveness-review (decided by G2) · also needed: confirm the start date with the employer; opening-level sponsorship evidence

## What this run cannot verify

- That any opening will sponsor. Company counts are aggregates with unspecified time coverage; a silent posting is unknown, not a yes. "Silent" means the rules detected no sponsorship wording in the captured posting body; application-form questions were not inspected.
- Years spent on a specific language, system type, activity, or domain. Total career months never establish a scoped requirement; without an explicit scoped input it is unknown.
- That a posting is open now. Feed and page observations are point-in-time; a blocked page is not a closed posting.
- Work authorization, EAD approval, legal eligibility to start, or how long hiring takes. The start-window check is date arithmetic against a candidate-supplied date.
- Whether an employer would make an exception to a stated requirement, or would recognize co-op months.
- Wording outside the rules' vocabularies (paraphrases are missed), section labels the rules do not recognize, or requirements stated only in images or linked pages.
- Whether the candidate is actually good at the listed technologies. Stack evidence says where a term appears in the posting, not how well anyone matches it.
