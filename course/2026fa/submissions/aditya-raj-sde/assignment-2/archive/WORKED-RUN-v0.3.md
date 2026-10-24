> **ARCHIVED 2026-10-21 (superseded by ../WORKED-RUN.md for rules v0.4.1).** Kept unchanged below for the record; its v0.3 claims (for example "5 skips", the "hypothesis tally", and "nothing about sponsorship" without a scope qualifier) are corrected in FRICTIONAL E14–E24.

# Worked run — Experienced Java Backend Opening Triage (Early-2027 Start)

## Executive summary

This is the record of running the new screening procedure on twelve real, public job postings and
on a set of invented test postings. It shows the exact commands, their real output, which values
come from data and which are rule-based judgments, how the output was checked, and where the
procedure is weak.

- **Real postings.** The procedure skipped 5 of 12, all for stated experience minimums (5–10
  years) above the test candidate's 4.5 full-time years. It sent 6 to a person: 4 because the
  employer's feed and its careers page disagreed, 1 for clearance wording, 1 for an ambiguous
  heading. It left 1 needing sponsorship evidence.
- **Unresolved everywhere.** None of the 12 postings said anything about sponsorship or a start
  date.
- **Compared with Assignment 1.** The Assignment 1 tool gave a different next step for 11 of the
  12.
- **Break test.** Breaking two of the protective checks changed real outcomes: 5 postings and 4
  postings respectively. A third protection was never exercised by the real sample.

**The student's own checks, review, and attestation are still pending.** Nothing below claims
them.

## Run record

- **Dates:** 2026-10-21, 00:01–00:20 EDT. **Run by:** Claude (Claude Code), on Aditya's instruction.
  Aditya has not yet re-run anything.
- **Recipe:** `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md` v0.3.0 (status DRAFT),
  rules v0.3.0.
- **Branch:** `contrib/2026fa-aditya-raj-sde-java-backend-early2027` (worktree), cut from the
  Assignment 1 graded commit `1a618e7`.
- **Candidate (fictional, your-input):** `search/examples/tariq-lindqvist/`: 54 months full-time,
  6-month co-op (kept separate), availability 2027-02-01.

### Live collection vs. replay

| Step | Network | Input | What it establishes |
|---|---|---|---|
| Collection (`collect.mjs`) | yes | Greenhouse boards API, in the protocol's order | which postings exist and their full text at 00:01:51–00:01:55 EDT (kept in `private/`) |
| Page check (`npm run ats:liveness`) | yes | the 12 URLs | the maintained checker's verdict at 00:02:07–00:02:38 EDT |
| Page probe (`page-probe.mjs`) | yes | the 12 URLs | HTTP status, title, length at 00:02:55–00:03:46 EDT |
| Full-text run | no | private full text | the decisions on what was captured |
| **Replay** (the committed run) | no | `real-sample/observations.json` (excerpts) | the same decisions from committed evidence; `compare` shows 0 differences |

A replay does not observe anything new. Its liveness values are the 00:02 observations, not
today's state.

## Inputs

- Sample protocol, committed before any fetch: `SAMPLE-PROTOCOL.md` (commit `1495978`, author time
  2026-10-20 23:59:53; the collection started 00:01:47).
- Real sample: `real-sample/probe-log.json` (17 probes), `real-sample/selection.json` (3 boards,
  per-board tallies, 12 selected), `real-sample/observations.json` (excerpts: 15,938 of 60,498
  characters).
- Synthetic set: `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json`
  (29 invented postings).

## Commands and real output

### 1. Live collection (evidence 02)

```text
## started: 2026-10-21 00:01:47 EDT — LIVE collection (network), per SAMPLE-PROTOCOL.md
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/collect.mjs --private-dir private/a2 --public-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample
probes 17 · verified boards 3 · qualifying 3 · postings 12 · stop: 3 qualifying boards
[exit=0]
## finished: 2026-10-21 00:01:55 EDT
```

### 2. Page liveness, maintained checker (evidence 03)

```text
## started: 2026-10-21 00:02:07 EDT — LIVE page liveness (network + Playwright Chromium), one run over the 12 selected URLs
$ npm run ats:liveness -- https://databricks.com/company/careers/open-positions/job?gh_jid=8864368002 https://databricks.com/company/careers/open-positions/job? …[truncated in this paste; full line in 03-live-page-liveness.txt]

> the-reallocation-engine@1.0.0 ats:liveness
> node scripts/ats/check-liveness.mjs https://databricks.com/company/careers/open-positions/job?gh_jid=8864368002 https://databricks.com/company/careers/open-po …[truncated in this paste; full line in 03-live-page-liveness.txt]

Checking 12 URL(s)...

✅ active     https://databricks.com/company/careers/open-positions/job?gh_jid=8864368002
✅ active     https://databricks.com/company/careers/open-positions/job?gh_jid=8815669002
✅ active     https://databricks.com/company/careers/open-positions/job?gh_jid=8806934002
✅ active     https://databricks.com/company/careers/open-positions/job?gh_jid=8798217002
❌ expired    https://www.pinterestcareers.com/jobs/?gh_jid=8046860
           insufficient content — likely nav/footer only
❌ expired    https://www.pinterestcareers.com/jobs/?gh_jid=7683977
           insufficient content — likely nav/footer only
❌ expired    https://www.pinterestcareers.com/jobs/?gh_jid=8055266
           insufficient content — likely nav/footer only
❌ expired    https://www.pinterestcareers.com/jobs/?gh_jid=7683981
           insufficient content — likely nav/footer only
✅ active     https://stripe.com/jobs/search?gh_jid=8249901
✅ active     https://stripe.com/jobs/search?gh_jid=8142952
✅ active     https://stripe.com/jobs/search?gh_jid=8230952
✅ active     https://stripe.com/jobs/search?gh_jid=8198280

Results: 8 active  4 expired  0 uncertain
[exit=1]
## finished: 2026-10-21 00:02:38 EDT
```

### 3. Supplementary page probe (evidence 04, Claude-written, read-only; excerpt of fields)

```text
## started: 2026-10-21 00:02:55 EDT — supplementary read-only browser probe (Claude-written, ad hoc; NOT the maintained checker). Waits 4 s after DOMContentLoaded (the maintained checker's wait may di
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/page-probe.mjs course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/selection.json
 8864368002  HTTP 200  chars   7475  title-in-body true   "Senior Software Engineer — Backend (Files Team) - Databricks"
 8815669002  HTTP 200  chars   7667  title-in-body true   "Sr. Software Engineer - Ingestion Core team - Databricks"
 8806934002  HTTP 200  chars   6699  title-in-body true   "Senior Software Engineer, Compute Infrastructure - Databrick"
 8798217002  HTTP 200  chars  10468  title-in-body true   "Staff Systems Development Engineer (GovOps) - Databricks"
    8046860  HTTP 403  chars    272  title-in-body false  "Just a moment..."
    7683977  HTTP 403  chars    272  title-in-body false  "Just a moment..."
    8055266  HTTP 403  chars    272  title-in-body false  "Just a moment..."
    7683981  HTTP 403  chars    272  title-in-body false  "Just a moment..."
    8249901  HTTP 200  chars   5375  title-in-body true   "Stripe Careers | Software Engineer"
    8142952  HTTP 200  chars   8870  title-in-body true   "Stripe Careers | Staff Software Engineer, Link - Consumer Id"
    8230952  HTTP 200  chars   6129  title-in-body true   "Stripe Careers | Senior Software Engineer, Backend"
    8198280  HTTP 200  chars   5338  title-in-body true   "Stripe Careers | Software Engineer, Backend"
[exit=0]
```

### 4. Rules v0.3 on the real sample: full text, replay, compare (evidence 07)

```text
## started: 2026-10-21 00:15:11 EDT — rules v0.3 on the real sample (only change vs v0.2: "plus N years" no longer a preference cue)
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs extract --collection private/a2/collection.json --page-liveness course/2026fa/submissions/aditya-raj-sde/assignment-2/evi …[truncated in this paste; full line in 07-real-run-v0.3.txt]
✓ extracted 12 observations · committed excerpt chars 15938 of 60498 full-text chars
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input private/a2/observations-full.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/co …[truncated in this paste; full line in 07-real-run-v0.3.txt]
✓ 12 openings (live-full-text (private)) → skip-application 5 · human-requirement-review 1 · human-eligibility-review 1 · human-liveness-review 4 · seek-vacancy-sponsorship-evidence 1
  hypothesis tally: 3 experience+stack-relevant, 3 of them with unresolved sponsorship/timing
  private/a2/runs/live-full-v0.3/triage.json  +  private/a2/runs/live-full-v0.3/triage.md
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contr …[truncated in this paste; full line in 07-real-run-v0.3.txt]
✓ 12 openings (replay-of-captured-excerpts) → skip-application 5 · human-requirement-review 1 · human-eligibility-review 1 · human-liveness-review 4 · seek-vacancy-sponsorship-evidence 1
  hypothesis tally: 3 experience+stack-relevant, 3 of them with unresolved sponsorship/timing
  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.3/triage.json  +  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.3/triage.md
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare private/a2/runs/live-full-v0.3/triage.json course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay …[truncated in this paste; full line in 07-real-run-v0.3.txt]
compared 12 openings · differences 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.2/triage.json course/2026fa/submissions …[truncated in this paste; full line in 07-real-run-v0.3.txt]
compared 12 openings · differences 0
[exit=0]
```

### 5. Offline tests and synthetic run (evidence 08, summary lines)

```text
## started: 2026-10-21 00:15:20 EDT — offline tests + synthetic run, rules v0.3
$ node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs
# tests 45
# suites 0
# pass 45
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 306.086916
[exit=0]
$ node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs   (Assignment 1 suite, unchanged code)
# tests 18
# pass 18
# fail 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json --candidate script …[truncated in this paste; full line in 08-tests-v0.3.txt]
✓ 29 openings (synthetic) → skip-application 10 · seek-vacancy-sponsorship-evidence 7 · human-requirement-review 6 · human-start-window-review 3 · human-liveness-review 2 · review-offer-excerpt 1
  hypothesis tally: 18 experience+stack-relevant, 18 of them with unresolved sponsorship/timing
  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/synthetic-v0.3/triage.json  +  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/synthetic-v0.3/triage.md
[exit=0]
```

### 6. Assignment 1's tool on the same 12 postings (evidence 09)

```text
## started: 2026-10-21 00:15:33 EDT — Assignment 1 tool (unchanged) on the same 12 real observations
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs a1-input --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --out course/2026fa/ …[truncated in this paste; full line in 09-a1-vs-a2-real.txt]
✓ wrote 12 roles in Assignment 1 input shape
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs --input course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/a1-tool-on-real-sample/a1-input.json --out-dir $T …[truncated in this paste; full line in 09-a1-vs-a2-real.txt]
✓ 12 openings → seek-vacancy-sponsorship-evidence 8 · skip-application 4
  skip fraction 4/12 (sample of 12; not a general rate); timing verified for 0; scenario (hypothetical) scores: 0
  ../../../../var/folders/26/wj7ysvd95bj1zcvv43gx0j0h0000gn/T/a1-on-a2/reality-check.json  +  ../../../../var/folders/26/wj7ysvd95bj1zcvv43gx0j0h0000gn/T/a1-on-a2/reality-check.md
[exit=0]
$ per-opening comparison (Assignment 1 next_action vs Assignment 2 v0.3 next_action)
databricks-8864368002  A1: seek-vacancy-sponsorship-evidence  A2: skip-application                   CHANGED by G4
databricks-8815669002  A1: seek-vacancy-sponsorship-evidence  A2: human-requirement-review           CHANGED by G4
databricks-8806934002  A1: seek-vacancy-sponsorship-evidence  A2: skip-application                   CHANGED by G4
databricks-8798217002  A1: seek-vacancy-sponsorship-evidence  A2: human-eligibility-review           CHANGED by G3
pinterest-8046860      A1: skip-application                   A2: human-liveness-review              CHANGED by G2
pinterest-7683977      A1: skip-application                   A2: human-liveness-review              CHANGED by G2
pinterest-8055266      A1: skip-application                   A2: human-liveness-review              CHANGED by G2
pinterest-7683981      A1: skip-application                   A2: human-liveness-review              CHANGED by G2
stripe-8249901         A1: seek-vacancy-sponsorship-evidence  A2: seek-vacancy-sponsorship-evidence  same
stripe-8142952         A1: seek-vacancy-sponsorship-evidence  A2: skip-application                   CHANGED by G4
stripe-8230952         A1: seek-vacancy-sponsorship-evidence  A2: skip-application                   CHANGED by G4
stripe-8198280         A1: seek-vacancy-sponsorship-evidence  A2: skip-application                   CHANGED by G4
changed 11/12
```

### 7. Deliberate break attempts, run 2 + control (evidence 10b, summary lines)

```text
## started: 2026-10-21 00:16:57 EDT — break attempts, run 2 (worktrees moved under private/a2-break/ after the run-1 harness artifact), HEAD f3d2906
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs
=== BROKEN-feed-ignored.json — protects: the G2 feed-vs-page disagreement rule (a blocked page is not a closed posting)
suite on mutant: exit 1 · 42/45 pass · 3 failing → CAUGHT
real-sample decisions changed by the mutant: 4/12
  pinterest-8046860: human-liveness-review → skip-application
  pinterest-7683977: human-liveness-review → skip-application
  pinterest-8055266: human-liveness-review → skip-application
  pinterest-7683981: human-liveness-review → skip-application
=== BROKEN-no-preference-distinction.json — protects: the required-vs-preferred distinction in G4 (preferences never stop an opening)
suite on mutant: exit 1 · 43/45 pass · 2 failing → CAUGHT
real-sample decisions changed by the mutant: 0/12
=== BROKEN-stack-overrides-experience.json — protects: G4 documented-mismatch and eligibility stops (no score or strong match may override a hard stop)
  + const a = (g.id === 'G4' && stack.state === 'core-stack-evidenced') ? null : ACTION[g.id]?.[g.status];
suite on mutant: exit 1 · 33/45 pass · 12 failing → CAUGHT
real-sample decisions changed by the mutant: 5/12
  databricks-8864368002: skip-application → seek-vacancy-sponsorship-evidence
  databricks-8806934002: skip-application → seek-vacancy-sponsorship-evidence
  stripe-8142952: skip-application → seek-vacancy-sponsorship-evidence
  stripe-8230952: skip-application → seek-vacancy-sponsorship-evidence
  stripe-8198280: skip-application → seek-vacancy-sponsorship-evidence
ALL MUTANTS CAUGHT (3 mutants)
[exit=0]
## control: 2026-10-21 00:17:08 EDT — UNMUTATED HEAD in the same worktree location
$ (in <private/a2-break/ctl-*>) node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs
# tests 45
# pass 45
# fail 0
```

### 8. Cross-checks (evidence 12)

```text
## started: 2026-10-21 00:20:35 EDT — verification cross-checks (Claude, ad hoc, read-only)
### V1 quote fidelity: every committed excerpt line (minus heading/list markers) is a substring of the private full plain text of the same posting
excerpt lines checked 162 · not found verbatim 0
text_sha256 matches private full text: 12/12
### V2 cohort tallies add up (selection.json)
databricks total 900 sum of reasons 900 OK | in-cohort 31 - duplicates 2 = unique 29 OK
pinterest total 158 sum of reasons 158 OK | in-cohort 7 - duplicates 0 = unique 7 OK
stripe total 731 sum of reasons 731 OK | in-cohort 13 - duplicates 0 = unique 13 OK
### V3 company-history counts vs the CSV (name + count columns only)
DATABRICKS INC | Total Approvals 1640.0 | Total Denials 8.0
PINTEREST INC | Total Approvals 1364.0 | Total Denials 16.0
STRIPE INC | Total Approvals 1250.0 | Total Denials 22.0
mode reports: matched-with-record DATABRICKS INC approvals 1640 | matched-with-record PINTEREST INC approvals 1364 | matched-with-record STRIPE INC approvals 1250
```

## Decisions on the real sample (from `runs/real-replay-v0.3/triage.md`)

| Opening | G2 liveness | G3 this posting: sponsorship / eligibility | G4 experience | G5 start window | G6 stack | Company history (context only) [record] | Next step | Also needed |
|---|---|---|---|---|---|---|---|---|
| DATABRICKS INC — Senior Software Engineer — Backend (Files Team) (8864368002) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **skip-application** (G4) | — |
| DATABRICKS INC — Sr. Software Engineer - Ingestion Core team (8815669002) | listed-and-page-active-at-observation | silent | requirement-section-ambiguous | employer-timing-unstated | java-mentioned-outside-core | matched-with-record (approvals 1640) | **human-requirement-review** (G4) | confirm the start date with the employer; opening-level sponsorship evidence |
| DATABRICKS INC — Senior Software Engineer, Compute Infrastructure (8806934002) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **skip-application** (G4) | — |
| DATABRICKS INC — Staff Systems Development Engineer (GovOps) (8798217002) | listed-and-page-active-at-observation | silent; clearance-or-export-control-wording | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1640) | **human-eligibility-review** (G3) | confirm the start date with the employer; opening-level sponsorship evidence |
| PINTEREST INC — Sr. Staff Software Engineer, Product ML Infrastructure (8046860) | feed-page-disagree | silent | experience-requirement-unstated | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| PINTEREST INC — Principal Engineer, AI Platform (7683977) | feed-page-disagree | silent | experience-requirement-unstated | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; confirm the expected level/years; opening-level sponsorship evidence |
| PINTEREST INC — Staff Software Engineer, Ads & Core Serving Platform (8055266) | feed-page-disagree | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| PINTEREST INC — Principal Engineer, Big Data Platform (7683981) | feed-page-disagree | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1364) | **human-liveness-review** (G2) | confirm the start date with the employer; opening-level sponsorship evidence |
| STRIPE INC — Software Engineer (8249901) | listed-and-page-active-at-observation | silent | meets-stated-required-minimums | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **seek-vacancy-sponsorship-evidence** (G7) | confirm the start date with the employer |
| STRIPE INC — Staff Software Engineer, Link - Consumer Identity  (8142952) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **skip-application** (G4) | — |
| STRIPE INC — Senior Software Engineer, Backend (8230952) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **skip-application** (G4) | — |
| STRIPE INC — Software Engineer, Backend (8198280) | listed-and-page-active-at-observation | silent | documented-mismatch | employer-timing-unstated | core-stack-evidenced | matched-with-record (approvals 1250) | **skip-application** (G4) | — |

## Verified vs. inferred

| Claim | Kind | How established |
|---|---|---|
| The 12 postings were listed in their employers' Greenhouse feeds at 00:01:5x EDT | **verified (record)** | API responses saved untouched in `private/a2/capture/`; `selection.json` |
| Databricks, Pinterest, and Stripe are those employers' boards | **verified by rule** | board `name` matched the CSV name under `companyKey`; the protocol's identity check |
| 8 page checks "active", 4 "expired" | **verified (record)** | maintained checker output, evidence 03 |
| The 4 Pinterest "expired" pages were a bot challenge, not closed postings | **inferred (Claude)** | HTTP 403, title "Just a moment...", 272 characters (evidence 04). Consistent with a challenge page; not proven, and the posting itself was never seen |
| Company counts (1640 / 1364 / 1250 approvals) | **verified (record)** | CSV rows re-read directly, evidence 12 V3. Unspecified time coverage |
| The quoted lines are the employers' words | **verified** | 162/162 excerpt lines found verbatim in the captured text (evidence 12 V1). Quotes are of the decoded plain text, not raw HTML |
| "5+ years … required" etc. are requirements | **inferred (rule: model-judgment)** | section-heading and pattern rules v0.3; audited by Claude only |
| 5 documented mismatches | **inferred (rule) + arithmetic** | stated minimum vs. 54 months (your-input). Not a claim the employer could never make an exception |
| No posting states sponsorship or a start date | **verified within the captured text** | no rule hit. A grep over the full text for sponsor/visa/authoriz also found none (E07). Application forms were not captured |
| The co-op flips 3 postings | **arithmetic** | 54 + 6 = 60 months = 5.0 years vs. "5+" / "5" minimums |
| The replay reproduces the live decisions | **verified** | `compare` → 0 differences (evidence 07, 11) |
| Assignment 1 and this mode disagree on 11/12 | **verified (both tools' outputs)** | evidence 09. Assignment 1 was given labelled placeholder fit and timeline values, which its decisions do not use |

## Verification

- **Re-ran without the network:** the replay from committed excerpts gives identical decisions and
  states to the full-text run.
- **Parsed the JSON:** the tests check that the Markdown decision table agrees with the JSON log for
  every opening.
- **Cross-checked counts against the source:** evidence 12.
- **Deliberately tried to break it:** three one-line mutants in temporary worktrees. All were
  caught, with predictions recorded first (FRICTIONAL E10).
- **A protective check caught a problem in its own harness:** break run 1 placed worktrees in the
  temp directory, which the output guard allows. That made one test fail for every mutant for the
  wrong reason. Run 2 moved them; a control run on unmutated HEAD passed 45/45.

## Reflection

### Claude's reflection (Aditya's is separate and pending)

- **What went well:**
  - The pre-registered protocol produced 12 postings in 8 seconds with no hand-picking.
  - The real sample immediately exercised the new checks: 5 experience stops, and a page-checker
    failure mode nobody designed for.
  - The replay is exact.
- **What the mode got wrong or missed:**
  - Rules v0.1 misread every Stripe posting, because Stripe puts the requirement in a heading. It
    also misread conjunctive Databricks requirements as conflicting.
  - These were corrected (v0.2, v0.3), but **on the same 12 postings**. Accuracy on new postings
    is unknown.
  - The protection against treating preferences as requirements was never exercised by the real
    sample.
  - Sponsorship evidence is absent for every real posting. Application-form questions were not
    captured.
- **Next steps (each a typed TODO in the recipe):**
  - a held-out check on the next postings in protocol order;
  - capturing application questions;
  - a one-line maintained-checker patch, so a 403 challenge is `uncertain`;
  - Aditya's decision on co-op silence.

### Aditya's reflection

**Pending — Aditya to write.** In particular, Aditya's reading of the hypothesis tally. The
prediction in FRICTIONAL E03 was that opening-level sponsorship and start-date evidence would stay
unresolved for relevant roles. This run counted 3 openings that cleared or were unknown on
experience and showed core Java-backend evidence; all 3 have unresolved sponsorship and start
timing.

## Attestation — DRAFT, not signed

> This section becomes an attestation only when Aditya runs the rows marked "Aditya", fills in
> what was seen, and signs. Claude-run rows are labelled as such. Until then there is **no
> attestation**, and the recipe's `attestation` stays `null`.

- Recipe: java-backend-early2027 v0.3.0
- By: *pending — Aditya Raj · date*

### Tested

| Ran | By | Saw | Expected |
|---|---|---|---|
| `node --test …/triage.test.mjs` | Claude | 45/45 pass (evidence 08, 11) | all pass |
| replay on committed excerpts + `compare` with full-text run | Claude | 0 differences | 0 differences |
| `break-test.mjs`: 3 mutants (deliberate break) | Claude | all caught; real decisions changed 4, 0, 5 (evidence 10b) | all caught |
| the same test command, from a clean checkout | **Aditya — pending** | | 45/45 |
| the replay command from the card | **Aditya — pending** | | 5 skip · 4 liveness · 1 eligibility · 1 requirement · 1 seek |
| one quoted requirement checked against the live posting page | **Aditya — pending** | | the quoted line appears on the page |
| `break-test.mjs` after writing a prediction | **Aditya — pending** | | prediction recorded first |

### Did not test

- Any posting not in the 12. No held-out set.
- Lever, Ashby, or Workday boards.
- Application-form questions.
- The page checker's behaviour after a manual browser visit (whether the Pinterest pages load for a
  person).
- Spring/Kotlin-only postings, non-English postings, and requirements in images.
- The private (real-profile) configuration.

### Broke during testing, fixed

- Rules v0.1 → v0.2: the heading-borne Stripe requirements, "three (3)", "must also have",
  conjunctive minimums, "distributed ML systems", the stack message (E07–E08).
- v0.2 → v0.3: "plus N years" was read as a preference (synthetic S27; E09).
- Report: skipped openings no longer list follow-ups (evidence 11; decisions unchanged).
- Break harness: worktrees moved out of the temp directory (E11).
- An evidence file reproduced a scanner-flagged address. It was redacted, and the unpushed commit
  amended (E05).
