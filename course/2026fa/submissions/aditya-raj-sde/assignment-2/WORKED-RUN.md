# Worked run — Experienced Java Backend Opening Triage (Early-2027 Start), rules v0.4.1

## Executive summary

This is the record of running the screening procedure on real public job postings and on
invented test postings. It shows the commands, their real output, which values come from data and
which are rule-based judgments, how the output was checked, and where the procedure is weak.

- **Development sample (12 real postings).** The rules were corrected on these, so this is
  development evidence, not a test.
  - 2 openings skipped: stated minimums of 10+ years of backend work, and a Master's plus 6 years,
    both above everything the test candidate has worked.
  - 10 sent to a person: 4 for export-control or clearance wording, 4 because the careers page
    was blocked while the employer's feed still listed the job, 2 for experience questions
    total-career years cannot answer.
- **Unseen sample (6 later postings, checked once with frozen rules).** The rules agreed with
  Claude-reviewed expectations written in advance on 40 of 48 checks and 4 of 6 final steps. That
  is agreement with the rules' author, not independently established accuracy. They skipped
  none wrongly, but missed an export-control clause on 2. That was repaired afterwards, and the
  repaired result is labelled development evidence.
- **Absence claims.** The rules detected no sponsorship or start-date wording in any of the 18
  captured posting bodies. Application forms were not inspected.

**Who did what.** Claude executed and checked every command below. Aditya supplied the decisions,
the predictions, and the interpretation, and did not personally re-run the commands; reruns are
optional under the assignment and lifecycle rules. Aditya's report-adequacy judgment and
attestation signature are the one pending step.

## Run record

- **Dates:** 2026-10-21. Development collection 00:01–00:03 EDT; corrections and the unseen check
  11:14–11:44 EDT. **Run by:** Claude (Claude Code), on Aditya's instruction. Aditya has not yet
  re-run anything.
- **Recipe:** `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md` v0.4.1 (status RUNNABLE-SAMPLE since 2026-10-21 — DRAFT during these runs), rules v0.4.1. Rules v0.4.0 were frozen at `4910036` before the unseen postings were
  chosen.
- **Branch:** `contrib/2026fa-aditya-raj-sde-java-backend-early2027`, cut from the Assignment 1
  graded commit `1a618e7`.
- **Candidate (fictional, your-input):** full-time **50–54 months** (two entries at month
  precision), co-op **4–6 months** (kept separate), **no** skill-specific inputs, availability
  2027-02-01.

### Live collection vs. replay

| Step | Network | What it establishes |
|---|---|---|
| `collect.mjs` (00:01:47–00:01:55) / `holdout.mjs select` (11:25) | yes | which postings were in the employer feeds, with full text (kept in `private/`) |
| `npm run ats:liveness`, `page-probe.mjs` | yes | the page checker's verdict and the HTTP status/title/length at those times |
| full-text runs | no | decisions on the captured text (private) |
| **replays** (the committed runs) | no | the same decisions from committed excerpts; `compare` → 0 differences |

A replay observes nothing new. Its liveness values are those recorded observations, not the state
today.

## The co-op clarification and what changed (v0.3 → v0.4.1)

Aditya clarified the co-op rule (FRICTIONAL E14). Claude's earlier reading had kept silent postings
as skips; that reading was Claude's, never Aditya's approval. The regression tests below were
written first and run on the unchanged v0.3 code:

```text
## started: 2026-10-21 11:17:49 EDT — NEW regression tests + extended fixtures run against UNCHANGED rules v0.3 code (checks.mjs/triage.mjs as committed in 3f5dc03), to record observed failures before correctin …[truncated here; full line in 15-regressions-on-v0.3-before-fix.txt]
$ node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
not ok 1 - co-op: explicit acceptance counts the co-op per the wording (12-month co-op variant, clear of month precision)
not ok 2 - co-op: explicit exclusion — the co-op never counts; FT-only shortfall is a documented mismatch
not ok 3 - co-op: silence at the boundary goes to review and shows the full-time-only comparison
ok 4 - co-op: a shortfall that remains even with the co-op is a documented mismatch
not ok 5 - scoped: "N years of Java" is not established by total career years → review, never "meets"
ok 6 - scoped: a requirement above everything the candidate has ever worked is still a documented mismatch
not ok 7 - scoped: an explicitly supplied scoped input is used (test-only variant), and only for matching terms
not ok 8 - overlapping employment is not double-counted
not ok 9 - exact date: a required start date earlier in the SAME month than availability is a conflict (not a month window)
not ok 10 - "no earlier than" is an earliest-start constraint, never a deadline
not ok 11 - "by" is a deadline: compatible when available before it, a conflict when after
not ok 12 - seasons are assumptions: a season can never produce a hard stop
not ok 13 - descriptive timing language does not create a mandatory window
not ok 14 - mixed, conditional, and unrecognized headings stay uncertain
not ok 15 - a challenge/thin page alone never establishes closure, with or without a feed observation
not ok 16 - provenance: liveness interpretation is a judgment; the raw observations are records
not ok 17 - tally separates satisfied, unknown, review, and mismatch groups (disjoint) and keeps liveness/sponsorship visible
# tests 17
# pass 2
# fail 15
[exit=1]
$ node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs   (existing suite on the extended 40-case fixture file)
not ok 10 - synthetic S09: Backend Engineer → human-requirement-review
not ok 12 - synthetic S11: Backend Engineer → human-requirement-review
not ok 31 - synthetic S31: Backend Engineer (silent on co-ops, boundary) → human-requirement-review
not ok 32 - synthetic S32: Backend Engineer (co-ops explicitly excluded) → skip-application
not ok 34 - synthetic S34: Backend Engineer (scoped years within the career bound) → human-requirement-review
not ok 36 - synthetic S40: Backend Engineer (season only) → human-start-window-review
not ok 37 - synthetic S41: Backend Engineer (descriptive month) → human-start-window-review
not ok 38 - synthetic S42: Backend Engineer (mixed heading) → human-requirement-review
not ok 39 - synthetic S43: Backend Engineer (conditional heading) → human-requirement-review
not ok 40 - synthetic S44: Backend Engineer (unrecognized heading) → human-requirement-review
not ok 41 - synthetic S45: Backend Engineer (blocked page, no feed observation) → human-liveness-review
# tests 56
# pass 45
# fail 11
[exit=1]

## actual v0.3 outputs for the behavioural failures (same unchanged code)
explicit exclusion (co-ops do not count)     → human-requirement-review | exp meets-stated-required-minimums | start employer-timing-unstated | live listed-and-page-active-at-observation
silence at boundary (5+ general)             → skip-application | exp documented-mismatch | start employer-timing-unstated | live listed-and-page-active-at-observation
scoped 4+ Java (career 4.5)                  → seek-vacancy-sponsorship-evidence | exp meets-stated-required-minimums | start employer-timing-unstated | live listed-and-page-active-at-observation
exact Feb 3 vs available Feb 10              → seek-vacancy-sponsorship-evidence | exp meets-stated-required-minimums | start stated-window-compatible-by-date | live listed-and-page-active-at-observation
no earlier than Mar 1 vs available Apr 10    → skip-application | exp meets-stated-required-minimums | start explicit-date-conflict | live listed-and-page-active-at-observation
by Mar 15 vs available Mar 20                → seek-vacancy-sponsorship-evidence | exp meets-stated-required-minimums | start stated-window-compatible-by-date | live listed-and-page-active-at-observation
season Fall 2026                             → skip-application | exp meets-stated-required-minimums | start explicit-date-conflict | live listed-and-page-active-at-observation
descriptive onboarding Jan 2027              → skip-application | exp meets-stated-required-minimums | start explicit-date-conflict | live listed-and-page-active-at-observation
conditional heading 6+                       → skip-application | exp documented-mismatch | start employer-timing-unstated | live listed-and-page-active-at-observation
unrecognized heading 7+                      → seek-vacancy-sponsorship-evidence | exp meets-stated-required-minimums | start employer-timing-unstated | live listed-and-page-active-at-observation
403 challenge, no feed                       → skip-application | exp documented-mismatch | start employer-timing-unstated | live listed-and-page-active-at-observation
overlap variant full_time_months (v0.3): 36 (2019-01..2021-06 union is 30)

## CORRECTION (Claude, 11:18:19 EDT): the "403 challenge, no feed" line above is INVALID — the capture script passed the page object in the candidate argument position, so it evaluated a default active page wit …[truncated here; full line in 15-regressions-on-v0.3-before-fix.txt]
403 challenge, no feed (corrected)           → skip-application | exp meets-stated-required-minimums | live gone-at-observation | page code insufficient_content
```

## Commands and real output

### 1. Development sample at v0.4.0 and v0.4.1 (evidence 16, 24)

```text
## started: 2026-10-21 11:22:21 EDT — rules v0.4 on the real sample (development evidence: same 12 postings); v0.3 outputs kept
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs extract --collection private/a2/collection.json --page-liveness course/2026fa/submissions/aditya-raj-sde/assignment-2/evidence/03-l …[truncated here; full line in 16-real-run-v0.4.txt]
✓ extracted 12 observations · committed excerpt chars 15938 of 60498 full-text chars
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input private/a2/observations-full.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candi …[truncated here; full line in 16-real-run-v0.4.txt]
✓ 12 openings (live-full-text (private)) → human-requirement-review 5 · human-eligibility-review 1 · human-liveness-review 4 · skip-application 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 5 · documented mismatch 5 · passed/unknown, stack not core 0
  private/a2/runs/live-full-v0.4/triage.json  +  private/a2/runs/live-full-v0.4/triage.md
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contrib/2026fa/ …[truncated here; full line in 16-real-run-v0.4.txt]
✓ 12 openings (replay-of-captured-excerpts) → human-requirement-review 5 · human-eligibility-review 1 · human-liveness-review 4 · skip-application 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 5 · documented mismatch 5 · passed/unknown, stack not core 0
  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4/triage.json  +  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4/triage.md
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare private/a2/runs/live-full-v0.4/triage.json course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4/tria …[truncated here; full line in 16-real-run-v0.4.txt]
compared 12 openings · differences 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.3/triage.json course/2026fa/submissions/aditya-ra …[truncated here; full line in 16-real-run-v0.4.txt]
compared 12 openings · differences 13
[exit=1]
$ cmp <v0.3 observations.json> <v0.4 observations.json>   (did the excerpt extraction change?)
identical
[exit=0]
```

```text
## started: 2026-10-21 11:29:00 EDT — rules v0.4.1 (DEVELOPMENT evidence on both the original 12 and the 6 holdout postings; the holdout's first result stays runs/holdout-v0.4-first)
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input private/a2/observations-full.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candi …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
✓ 12 openings (live-full-text (private)) → human-eligibility-review 4 · human-liveness-review 4 · human-requirement-review 2 · skip-application 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 5 · documented mismatch 5 · passed/unknown, stack not core 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contrib/2026fa/ …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
✓ 12 openings (replay-of-captured-excerpts) → human-eligibility-review 4 · human-liveness-review 4 · human-requirement-review 2 · skip-application 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 5 · documented mismatch 5 · passed/unknown, stack not core 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare private/a2/runs/live-full-v0.4.1/triage.json course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4.1/ …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
compared 12 openings · differences 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4/triage.json course/2026fa/submissions/aditya-ra …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
compared 12 openings · differences 12
[exit=1]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input private/a2/holdout/observations-full.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/conf …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
✓ 6 openings (live-full-text (private)) → human-eligibility-review 2 · human-liveness-review 2 · human-requirement-review 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 3 · documented mismatch 1 · passed/unknown, stack not core 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout/observations.json --candidate scripts/contrib/2026fa/adit …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
✓ 6 openings (holdout-replay-of-captured-excerpts) → human-eligibility-review 2 · human-liveness-review 2 · human-requirement-review 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 3 · documented mismatch 1 · passed/unknown, stack not core 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare private/a2/runs/holdout-full-v0.4.1/triage.json course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/holdout-v0.4.1-d …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
compared 6 openings · differences 0
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/fixtures/synthetic-cases.json --candidate scripts/contrib/ …[truncated here; full line in 24-v0.4.1-dev-runs.txt]
✓ 40 openings (synthetic) → skip-application 11 · seek-vacancy-sponsorship-evidence 7 · human-requirement-review 13 · human-start-window-review 5 · human-liveness-review 3 · review-offer-excerpt 1
  experience groups: satisfied+core 20 · unknown+core 1 · awaiting review 10 · documented mismatch 6 · passed/unknown, stack not core 3
[exit=0]
$ holdout dev rerun vs Claude-reviewed expectations (DEVELOPMENT, not holdout performance)
  still differs stripe-8197135 G4_state: expected alternative-requirements | program scoped-duration-unknown
dev rerun agreement 47/48; final steps 6/6
```

### 2. Unseen postings: selection, then the FIRST run of frozen v0.4.0 (evidence 18, 22)

```text
## started: 2026-10-21 11:25:17 EDT — HOLDOUT selection (fresh feed fetch = network), rules frozen at 4910036
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/holdout.mjs select --private-dir private/a2/holdout --public-dir course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout
holdout: 6 postings selected (databricks 2 · pinterest 2 · stripe 2)
[exit=0]
```

```text
## started: 2026-10-21 11:27:44 EDT — FIRST HOLDOUT RUN of frozen rules v0.4.0 (this result is the holdout result and is never overwritten)
$ git diff --stat 4910036 -- scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/checks.mjs scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs scripts/contrib/2026fa/aditya-raj-sde …[truncated here; full line in 22-holdout-first-run.txt]
(end of diff)
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input private/a2/holdout/observations-full.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/conf …[truncated here; full line in 22-holdout-first-run.txt]
✓ 6 openings (live-full-text (private)) → human-requirement-review 4 · human-liveness-review 2
  experience groups: satisfied+core 0 · unknown+core 1 · awaiting review 3 · documented mismatch 1 · passed/unknown, stack not core 1
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout/observations.json --candidate scripts/contrib/2026fa/adit …[truncated here; full line in 22-holdout-first-run.txt]
✓ 6 openings (holdout-replay-of-captured-excerpts) → human-requirement-review 4 · human-liveness-review 2
  experience groups: satisfied+core 0 · unknown+core 1 · awaiting review 3 · documented mismatch 1 · passed/unknown, stack not core 1
[exit=0]
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare private/a2/runs/holdout-full-v0.4/triage.json course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/holdout-v0.4-first …[truncated here; full line in 22-holdout-first-run.txt]
compared 6 openings · differences 0
[exit=0]
$ per-check comparison: program output vs holdout/expected-claude-reviewed.json
agreement 40/48 check-level fields across 6 postings
final next step agrees: 4/6
  DISAGREE databricks-8798198002 G3_eligibility: expected clearance-or-export-control-wording | program none-stated
  DISAGREE databricks-8798198002 G6: expected core-stack-evidenced | program java-mentioned-outside-core
  DISAGREE databricks-8798198002 decision: expected human-eligibility-review | program human-requirement-review
  DISAGREE databricks-8552484002 G3_eligibility: expected clearance-or-export-control-wording | program none-stated
  DISAGREE databricks-8552484002 G4_state: expected coop-would-change-result | program requirement-section-unclear
  DISAGREE databricks-8552484002 G6: expected core-stack-evidenced | program java-mentioned-outside-core
  DISAGREE databricks-8552484002 decision: expected human-eligibility-review | program human-requirement-review
  DISAGREE stripe-8197135 G4_state: expected alternative-requirements | program scoped-duration-unknown
```

### 3. Tests (evidence 25)

```text
## started: 2026-10-21 11:29:23 EDT — all suites at rules v0.4.1
$ node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
# tests 77
# pass 77
# fail 0
[exit=0]
$ node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs   (Assignment 1, unchanged)
# tests 18
# pass 18
# fail 0
[exit=0]
```

### 4. Deliberate break attempts at v0.4.1, plus unmodified control (evidence 26, summary lines)

```text
## started: 2026-10-21 11:29:52 EDT — break attempts at rules v0.4.1 (6 mutants) + unmodified control
=== BROKEN-coop-silence-counts.json (HEAD 3df0b08) — protects: G4 co-op rule (Aditya, E14): silence at the boundary goes to a person; co-op months are never silently added
suite on mutant: exit 1 · 74/77 pass · 3 failing → CAUGHT
real-sample decisions changed by the mutant: 0/12
=== BROKEN-feed-ignored.json (HEAD 3df0b08) — protects: the G2 feed-vs-page disagreement rule (a blocked page is not a closed posting)
suite on mutant: exit 1 · 74/77 pass · 3 failing → CAUGHT
real-sample decisions changed by the mutant: 0/12
=== BROKEN-no-preference-distinction.json (HEAD 3df0b08) — protects: the required-vs-preferred distinction in G4 (preferences never stop an opening)
suite on mutant: exit 1 · 75/77 pass · 2 failing → CAUGHT
real-sample decisions changed by the mutant: 0/12
=== BROKEN-scoped-as-general.json (HEAD 3df0b08) — protects: G4 general-vs-scoped distinction: total career years never establish a skill-specific duration
suite on mutant: exit 1 · 71/77 pass · 6 failing → CAUGHT
real-sample decisions changed by the mutant: 1/12
  stripe-8249901: human-requirement-review → seek-vacancy-sponsorship-evidence
=== BROKEN-stack-overrides-experience.json (HEAD 3df0b08) — protects: G4 documented-mismatch and eligibility stops (no score or strong match may override a hard stop)
suite on mutant: exit 1 · 55/77 pass · 22 failing → CAUGHT
real-sample decisions changed by the mutant: 4/12
  stripe-8249901: human-requirement-review → seek-vacancy-sponsorship-evidence
  stripe-8142952: skip-application → seek-vacancy-sponsorship-evidence
  stripe-8230952: human-requirement-review → seek-vacancy-sponsorship-evidence
  stripe-8198280: skip-application → seek-vacancy-sponsorship-evidence
=== BROKEN-thin-page-is-closure.json (HEAD 3df0b08) — protects: G2: a challenge or thin page alone never establishes closure (with or without a feed observation)
suite on mutant: exit 1 · 75/77 pass · 2 failing → CAUGHT
real-sample decisions changed by the mutant: 0/12
ALL MUTANTS CAUGHT (6 mutants)
[exit=0]
## control: 2026-10-21 11:29:57 EDT — UNMUTATED HEAD 3df0b08 in the same worktree location
# tests 77
# pass 77
# fail 0
worktrees listed during control:        3
```

### 5. Assignment 1 tool vs this mode on the same 12 postings (evidence 28)

These are **behavioural differences, not evidence of better accuracy.** The basis column says which
differences follow from quoted source text and arithmetic, and which are policy judgments.

```text
## started: 2026-10-21 11:41:02 EDT — Assignment 1 tool output (runs/a1-tool-on-real-sample, unchanged code) vs this mode at v0.4.1 — BEHAVIOURAL differences, not accuracy
databricks-8864368002  A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-eligibility-review           differs (G3) — SOURCE + JUDGMENT: the quoted export-control / clearance sentence is a record; routing it to a person is policy
databricks-8815669002  A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-eligibility-review           differs (G3) — SOURCE + JUDGMENT: the quoted export-control / clearance sentence is a record; routing it to a person is policy
databricks-8806934002  A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-eligibility-review           differs (G3) — SOURCE + JUDGMENT: the quoted export-control / clearance sentence is a record; routing it to a person is policy
databricks-8798217002  A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-eligibility-review           differs (G3) — SOURCE + JUDGMENT: the quoted export-control / clearance sentence is a record; routing it to a person is policy
pinterest-8046860      A1 skip-application                   v0.4.1 human-liveness-review              differs (G2) — JUDGMENT (policy): same raw observations (feed listed; page 403 / 272 chars); A1 reads the checker verdict as closure, this mode treats a bloc …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
pinterest-7683977      A1 skip-application                   v0.4.1 human-liveness-review              differs (G2) — JUDGMENT (policy): same raw observations (feed listed; page 403 / 272 chars); A1 reads the checker verdict as closure, this mode treats a bloc …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
pinterest-8055266      A1 skip-application                   v0.4.1 human-liveness-review              differs (G2) — JUDGMENT (policy): same raw observations (feed listed; page 403 / 272 chars); A1 reads the checker verdict as closure, this mode treats a bloc …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
pinterest-7683981      A1 skip-application                   v0.4.1 human-liveness-review              differs (G2) — JUDGMENT (policy): same raw observations (feed listed; page 403 / 272 chars); A1 reads the checker verdict as closure, this mode treats a bloc …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
stripe-8249901         A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-requirement-review           differs (G4) — SOURCE + ARITHMETIC: the quoted required minimum vs candidate months (a skip) — or SOURCE + JUDGMENT for a review (scoped / co-op / heading in …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
stripe-8142952         A1 seek-vacancy-sponsorship-evidence  v0.4.1 skip-application                   differs (G4) — SOURCE + ARITHMETIC: stated required minimum "10+ years" is not met: even all recorded experience (at most 60 months, co-op include
stripe-8230952         A1 seek-vacancy-sponsorship-evidence  v0.4.1 human-requirement-review           differs (G4) — SOURCE + ARITHMETIC: the quoted required minimum vs candidate months (a skip) — or SOURCE + JUDGMENT for a review (scoped / co-op / heading in …[truncated here; full line in 28-a1-vs-v0.4.1.txt]
stripe-8198280         A1 seek-vacancy-sponsorship-evidence  v0.4.1 skip-application                   differs (G4) — SOURCE + ARITHMETIC: stated required minimum "six (6) years of" is not met: full-time only: 50–54 months vs 72 required; with the c
differs 12/12
```

### 6. Cross-checks (evidence 30, 31; development-sample checks in evidence 12)

```text
## started: 2026-10-21 11:42:43 EDT — holdout verification cross-checks (Claude, read-only)
holdout excerpt lines checked 83 · not found verbatim 0
text_sha256 matches private full text: 6/6
overlap with the original 12: 0
```

```text
## started: 2026-10-21 11:44:01 EDT — conformance + doctor + privacy/history (rules v0.4.1; all files staged)
$ PATH=<main-checkout>/.venv/bin:$PATH npm run verify
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
[exit=0]
$ PATH=<venv>:$PATH node scripts/conformance.mjs <all Assignment 2 paths>
conformance: 78 files (26 md · 11 js · 40 json · 1 yaml)
✓ all conform (machine half of P4). Adequacy is still the human gate.
[exit=0]
$ npm run doctor
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
[exit=0]
$ grep -c "[TODO" <recipe>  (frontmatter todos_open: 4; doctor does not scan recipes/cases/)
4
$ node scripts/pii-scan.mjs   (working tree)
  [email] package-lock.json — [EMAIL REDACTED: pre-existing package-lock.json address]
[exit=1]  (inherited: same finding on unchanged upstream 015843d, A1 Confirmed blocker 1)
$ node scripts/pii-scan.mjs --diff upstream/main   (CI history scan)
pii-scan: clean ✓
[exit=0]
$ git diff --cached --name-only upstream/main | outside-allowlist / protected grep
protected: none
outside allowlist: none
```

## Decisions on the development sample (from `runs/real-replay-v0.4.1/triage.md`)

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

## Verified vs. inferred

| Claim | Kind | How established |
|---|---|---|
| Postings were listed in their employers' Greenhouse feeds at the stated times | **record** | raw API responses in `private/a2/`; `selection.json` files |
| HTTP 403 / "Just a moment..." / 272 characters on 6 Pinterest pages | **record** | probe output (evidence 04, 20) |
| "expired" from the maintained page checker | **judgment (maintained heuristic)** | evidence 03, 19 |
| Those Pinterest pages are blocked, not closed | **judgment (Claude)** | consistent with a challenge page; the posting itself was never seen through the page |
| Quoted lines are the employers' words | **record** | verbatim in captured text: 162 lines (evidence 12) + 83 lines (evidence 30) |
| Company approval counts (1640 / 1364 / 1250) | **record** | CSV rows re-read (evidence 12 V3); unspecified time coverage |
| A line is a general vs skill-specific requirement; a heading is required, preferred, or ambiguous | **judgment (rule)** | documented heuristics, rules v0.4.1 |
| 2 documented mismatches | **source + arithmetic** | quoted minimum vs 50–54 / 54–60 months (your-input) |
| The co-op decides Stripe 8230952 | **arithmetic + judgment** | 50–54 < 60 ≤ 54–60; posting silent on co-ops (rule) |
| No sponsorship or start wording in 18 posting bodies | **scoped absence** | the rules detected none in the captured body; application forms not inspected |
| Replay = full text | **verified** | `compare` → 0 differences (both samples) |
| Unseen-posting agreement 40/48, 4/6 | **Claude-reviewed** | expectations written by Claude before the run, and committed; not human-validated; the same author wrote the rules |

## Verification

- **Re-ran offline:** both replays match the full-text runs exactly.
- **Wrote tests before fixes:** v0.4 regressions failed 15/17 on v0.3. The three holdout-derived
  regressions failed on frozen v0.4.0. Both are preserved as evidence 15 and 23.
- **Froze, then tested on unseen postings:** the protocol was committed after the freeze, and the
  expectations before the run. The first result is kept in `runs/holdout-v0.4-first/`.
- **Cross-checked:** excerpts are verbatim, hashes match, there is no overlap with the original 12,
  and the CSV counts match.
- **Broke it deliberately:** 6 mutants, all caught. Predictions were recorded first (E21) and all
  held. The control passed 77/77.
- **Checked the live page now:** the cross-check excerpts were still present on Stripe 8230952 at
  11:41 EDT (evidence 29).
- **Mistakes in my own process, corrected:**
  - an argument-order error in an ad hoc capture (evidence 15, marked INVALID);
  - a regex that could not match after "start date:";
  - an over-broad claim about co-op wording in the domain justification (7 of 18 postings use
    ambiguous wording).

## Reflection

### Claude's reflection (Aditya's is separate and pending)

- **Went well:**
  - Pre-registration made the unseen check meaningful.
  - The frozen rules failed in a way that matters (an export-control clause) without wrongly
    skipping anything.
  - Each correction is traceable to a failing test.
- **Got wrong or missed:**
  - v0.3 counted an explicitly excluded co-op as accepted.
  - v0.3 met skill-specific requirements with career length.
  - v0.3 hard-stopped on seasons and descriptive months.
  - v0.3 skipped blocked pages when no feed observation existed.
  - v0.1–v0.4.0 never read the export-control clause.
  - After repair there is **no untouched test of v0.4.1**. Six same-board postings were never
    enough to measure accuracy.
- **Next steps:**
  - application-form capture (deferred);
  - a fresh unseen sample from other employers, under a new protocol, before claiming any
    accuracy;
  - Aditya's decision on the remaining heuristics.

### Aditya's reflection (verbatim, FRICTIONAL E28)

> "The main distinction is that total employment duration does not establish years of experience
> in a particular technology, just as company sponsorship history does not establish sponsorship
> for an individual opening."
>
> "The missed export-control wording illustrates a separate limitation: reproducible output and
> passing tests do not prove correct interpretation. The first unseen-posting evaluation exposed a
> gap, and the corrected rerun is development evidence rather than an independent accuracy
> measurement."
>
> "The next improvement would be an independently reviewed evaluation across additional employers
> and page formats. That is future work, not something to implement before submission."

**Aditya's prediction vs observed:**
- E03 prediction: "Opening-specific sponsorship and start-date evidence will remain unresolved for
  some apparently relevant Java backend roles…". In the v0.4.1 development sample, both
  unknown-experience + core-stack openings, and all 5 awaiting experience review, have unresolved
  sponsorship and timing. The rules detected no such wording in any of the 18 captured posting
  bodies.
- E26 replication prediction: "the existing tests should catch all six documented mutants, while the
  unmodified control should pass". In Claude's runs (evidence 26, 32, 33), all 6 were caught and
  the control passed. The decision-change counts were not predicted by Aditya; observed 0/0/0/1/4/0.

## Attestation

- Recipe: java-backend-early2027 v0.4.1 (rules v0.4.1)
- By: **Aditya Raj · 2026-10-21** (judged the reports and this record; did not personally re-run the commands, which Claude executed)

### Tested — every row executed and checked by Claude (Claude Code, `claude-opus-5-5`), not re-run by Aditya

| Ran | Saw | Expected |
|---|---|---|
| `node --test …/triage.test.mjs …/regression-v04.test.mjs` (worktree, fresh clone, review block) | 77/77 each time (evidence 25, 32, 33) | all pass |
| `node --test …/reality-check.test.mjs` (Assignment 1, unchanged) | 18/18 (25, 32) | all pass |
| `triage.mjs run` on committed excerpts, then `compare` with the full-text run (development 12 and holdout 6) | 0 differences (24, 32) | 0 |
| first run of **frozen** v0.4.0 on 6 unseen postings vs expectations Claude wrote and committed beforehand | 40/48 checks, 4/6 final steps; misses kept (22) | disagreements recorded, not hidden |
| **deliberate break:** `break-test.mjs`, 6 one-line mutants in temporary worktrees, plus an unmodified control | all 6 caught; real-sample changes 0/0/0/1/4/0; control 77/77 (26, 32, 33) | all caught; control passes |
| regression tests written before each fix (v0.3 → v0.4; v0.4.0 → v0.4.1) | failed first: 15/17 and 3/3 failing (15, 23); passed after the fix (25) | fail, then pass |
| excerpt fidelity and hashes | 162 + 83 lines verbatim; hashes match (12, 30) | all verbatim |
| conformance, doctor, privacy, scope | 78 files conform; doctor OK; history PII scan clean; no protected or out-of-scope path (27, 31) | clean |
| live-page cross-check, Stripe 8230952 | both excerpts present at 15:41 and 17:32 UTC; page length changed 6,129 → 6,376 characters (29, 34) | present, or the change recorded |

### Reviewed by Claude, not human-validated

- The v0.1–v0.4 audits of the development postings against the full captured text.
- The expectations for the 6 unseen postings. The same author wrote the rules, so agreement is
  not independent accuracy.

### Decisions and interpretations supplied by Aditya

- The situation and scope; persona parameters; the co-op rule (E03, clarified E14); range, ASAP,
  date, and season handling; sample and holdout requirements (E03, E14).
- The conservative heuristics and both deferrals, approved (E26, E28).
- The predictions (E03, E26).
- The interpretation quoted under "Aditya's reflection" (E28).
- **Report adequacy:** judged adequate by Aditya Raj, 2026-10-21 (E30).

### Did not test

- Employers or ATSs beyond three Greenhouse boards; any unseen sample for v0.4.1.
- Application-form questions (deferred); the shared checker patch (deferred).
- Whether blocked Pinterest pages load for a person.
- Non-English postings, requirements in images, the private real-profile configuration.
- Aditya's personal re-runs of the commands above (optional; not performed).

### Broke during testing, fixed

- v0.1 → v0.3: heading-borne requirements; "three (3)"; conjunctive minimums; "plus N years".
- v0.3 → v0.4:
  - co-op exclusion read as acceptance;
  - silence at the boundary skipped;
  - scoped years met by career length;
  - overlap double-counted;
  - exact dates flattened to months;
  - "no earlier than" read as a deadline;
  - seasons, descriptive months, and conditional headings hard-stopped;
  - a blocked page without a feed observation skipped;
  - provenance labels;
  - the tally merged unknown with met.
- v0.4.0 → v0.4.1: the export-control clause in a heading line; "what we look for"; cross-sentence
  alternatives.
- Harness: worktrees moved out of the temp directory; both suites run in each mutant.

## Appendix — complete commands behind abbreviated evidence headers

Some evidence files abbreviate long commands in their `$` lines: `<main-checkout>`, `<all
Assignment 2 paths>`, or `…`. The exact commands Claude ran are below. All are run from
`/Users/adityaraj/Desktop/the-reallocation-engine-a2`. Evidence files themselves are not edited.

```bash
# evidence 13 / 31 — verify and conformance (system python3 lacks PyYAML; the main checkout's venv has it)
PATH=/Users/adityaraj/Desktop/the-reallocation-engine/.venv/bin:$PATH npm run verify
PATH=/Users/adityaraj/Desktop/the-reallocation-engine/.venv/bin:$PATH node scripts/conformance.mjs \
  scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027 \
  recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md \
  recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.card.md \
  search/examples/tariq-lindqvist course/2026fa/submissions/aditya-raj-sde/assignment-2 \
  logs/runs/2026fa-aditya-raj-sde-2.md

# evidence 32 — "triage.mjs run --input … && compare" in a fresh clone, exactly:
D=scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027; A=course/2026fa/submissions/aditya-raj-sde/assignment-2
node $D/triage.mjs run --input $A/real-sample/observations.json --candidate $D/config/candidate.tariq-lindqvist.json --out-dir "$TMPDIR/clean-real-replay-v0.4.1"
node $D/triage.mjs compare $A/runs/real-replay-v0.4.1/triage.json "$TMPDIR/clean-real-replay-v0.4.1/triage.json"
node $D/triage.mjs run --input $A/holdout/observations.json --candidate $D/config/candidate.tariq-lindqvist.json --out-dir "$TMPDIR/clean-holdout-v0.4.1-dev-rerun"
node $D/triage.mjs compare $A/runs/holdout-v0.4.1-dev-rerun/triage.json "$TMPDIR/clean-holdout-v0.4.1-dev-rerun/triage.json"
```

The comparison of the first holdout run against the pre-written expectations (evidence 22) used
this ad hoc, read-only script, verbatim:

```bash
node -e '
const fs=require("fs"); const exp=JSON.parse(fs.readFileSync("course/2026fa/submissions/aditya-raj-sde/assignment-2/holdout/expected-claude-reviewed.json","utf8")).expected; const roles=JSON.parse(fs.readFileSync("course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/holdout-v0.4-first/triage.json","utf8")).roles;
let agree=0,total=0; const rows=[];
for(const r of roles){const e=exp[r.obs_id]; const got={G2:r.liveness.state,G3_vacancy:r.vacancy.state,G3_eligibility:r.vacancy.eligibility,G4_state:r.experience.state,G4_gate:r.experience.gate,G5:r.start_window.state,G6:r.stack.state,decision:r.next_action};
 const want={G2:e.G2,G3_vacancy:e.G3_vacancy,G3_eligibility:e.G3_eligibility,G4_state:e.G4.state,G4_gate:e.G4.gate,G5:e.G5,G6:e.G6,decision:e.decision};
 for(const k of Object.keys(want)){total++; const ok=got[k]===want[k]; if(ok)agree++; else rows.push(`DISAGREE ${r.obs_id} ${k}: expected ${want[k]} | program ${got[k]}`);}}
console.log(`agreement ${agree}/${total} check-level fields across ${roles.length} postings`); const dec=roles.filter(r=>r.next_action===exp[r.obs_id].decision).length; console.log(`final next step agrees: ${dec}/${roles.length}`); rows.forEach(x=>console.log("  "+x));'
```

Historical results stay labelled by version in `runs/real-replay-v0.1` … `-v0.4.1`,
`runs/synthetic-v0.3` … `-v0.4.1`, and `archive/WORKED-RUN-v0.3.md`.
