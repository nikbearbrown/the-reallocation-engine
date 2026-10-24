---
status: RUNNABLE-SAMPLE # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED — RUNNABLE-LIVE not sought
todos_open: 0
last_gate: "SPECIFIED→RUNNABLE-SAMPLE, 2026-10-21: sample/real/holdout runs complete (evidence 24, 32, 33); conformance passes (31); reports read and judged adequate by Aditya Raj (FRICTIONAL E30); logs/runs/2026fa-aditya-raj-sde-2.md"
attestation: null
recipe_version: 0.4.1
---

# java-backend-early2027 — Experienced Java Backend Opening Triage for an Early-2027 Start

## Executive summary

**What it is.** A screening procedure for one specific job seeker:
- an international master's student who already has years of full-time Java/Spring backend
  experience (not a new graduate);
- who will need future visa sponsorship;
- who can start on a stated date in early 2027.

It runs before tailoring time is spent. For each opening it reads the posting's own words:
- Is it still listed?
- Does this posting refuse sponsorship, require citizenship, or carry export-control or
  clearance wording?
- Do its stated experience requirements fit, keeping total career, skill-specific years, and
  co-op time apart?
- Does a stated start date fit?
- Is it Java backend work?

**What it found.**
- **Development sample (12 real postings).** Rules were corrected on these, so this is
  development evidence: 2 skipped for stated minimums above everything the test candidate has
  worked; 10 sent to a person.
- **Six later postings** were held back until the rules were frozen, then checked. The frozen
  rules agreed with Claude-reviewed expectations written in advance on 40 of 48 checks and 4 of 6
  final steps. That is agreement with the rules' author, not independently established accuracy. They
  wrongly skipped none, but missed export-control wording on 2. That was then repaired.
- **Nowhere did the rules detect** sponsorship or start-date wording in the captured posting
  bodies. Application forms were not inspected.

**What it refuses to do.**
- It never treats company sponsorship history as a promise.
- It never counts co-op months without explicit posting wording.
- It never counts total career years as years in a specific skill.
- It never reads a title as a level, and never treats "ASAP", a season, or silence as a date.
- It never treats a blocked page as a closed posting.
- It claims nothing about work authorization, and gives no score.

**Status.** RUNNABLE-SAMPLE (2026-10-21): sample runs complete, conformance passes, and Aditya read the
reports and judged them adequate. Not RUNNABLE-LIVE: no human cleared each gate on a live run.

## Situation (who uses this, exactly)

| Field | Value |
|---|---|
| Candidate | Experienced-hire Java/Spring backend engineer (distributed systems, messaging, cloud infrastructure; applied-AI infrastructure optional). Full-time and co-op experience recorded separately with explicit `employment_type`. |
| Status | International master's student; post-completion work authorization **applied for, not approved**; future H-1B sponsorship needed |
| Start | A candidate-supplied availability date in early 2027, from configuration (public persona: 2027-02-01) |
| Geography | US roles nationwide (a stated assumption, not a check) |
| Not for | New-grad program screening, intern roles, people-management roles |
| Public persona | `search/examples/tariq-lindqvist/` — fictional. Full-time 2019-08..2021-07 and 2021-08..2024-01 = **50–54 months** at month precision; co-op 2025-06..2025-11 = **4–6 months**; no scoped-experience inputs; availability 2027-02-01 |

## Required reads

| Read | Why |
|---|---|
| `SNICKERDOODLE.md`, `DOMAIN.md` | constitution and domain map |
| `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md` | Assignment 1 recipe: company-vs-opening evidence, liveness, refusal gate — reused |
| `course/2026fa/submissions/aditya-raj-sde/assignment-2/SAMPLE-PROTOCOL.md`, `HOLDOUT-PROTOCOL.md` | how the development and unseen postings were chosen (each fixed before collection) |
| `scripts/ats/liveness-core.mjs` | maintained page classifier, reached through Assignment 1's `evaluateLiveness` |

## Source inventory (exists today)

| Path / command | Use here | Label |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | employer order for sampling; company history as context only | record |
| `.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py` | live board capture (full content, host allow-listed, raw saved to `private/`) | record |
| `scripts/ats/providers/_http.mjs` `fetchJson` | board-identity probe (redirects refused) | record |
| `npm run ats:liveness -- <url…>` | maintained page checker: its verdict is a heuristic (judgment); the underlying status/length are records | judgment over records |
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs` | `companyKey`, `loadSponsorCsv`, `matchCompany`, `classifyVacancy`, `evaluateLiveness` — imported, never copied | — |
| `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/` | this mode: `collect.mjs` and `holdout.mjs` (the only network scripts besides the probes), `triage.mjs`, `checks.mjs`, `text.mjs`, `page-probe.mjs`, `excerpt-check.mjs`, `break-test.mjs`, tests, fixtures, configs | — |
| `search/examples/tariq-lindqvist/` (+ `test-variants/`) | fictional candidate and test-only variants | your-input |

**Why no score.** The maintained combiner (`scripts/score/role-scorer.mjs`) is not called:
- no calibrated per-opening sponsorship probability exists;
- its role-quality weight is 0.0 (`DOMAIN.md` item 3);
- a missing timeline defaults to a passing 1.0;
- every check here ends in a named state.

## Phase gates (every check is evaluated and reported; the decision is the first gate that stops or asks for review)

| Gate | Testable condition | stop → | review → |
|---|---|---|---|
| G1 Input | observations and candidate validate: example.com for synthetic, https for real; recorded page results point at an existing evidence file; every experience entry has explicit `employment_type` and `YYYY-MM` dates; scoped inputs are `your-input`; `available_from` is `your-input` | exit 2, nothing written | — |
| G2 Liveness | `listed-and-page-active-at-observation` | **only** positive closure evidence (HTTP 404/410, a closed-URL redirect, closure wording) without a contrary feed listing → `skip-application` | feed vs page disagree; page uncertain; **thin or blocked page (e.g. HTTP 403 challenge), with or without a feed observation**; closure wording on an active page → `human-liveness-review` |
| G3 This posting's sponsorship / eligibility | no refusal, no citizenship requirement, no clearance/export-control wording (body **and heading lines** are read) | refusal, or "must be a U.S. citizen" → `skip-application` | clearance / export-control / "U.S. person" wording → `human-eligibility-review` |
| G4 Experience and degree | every stated **required** minimum explicitly met | a stated required minimum not met by full-time months (or above **all** recorded experience for a scoped requirement); an explicit experience cap; a graduation window that excludes the candidate → `skip-application` (documented mismatch) | co-op would change the result and the posting is silent or ambiguous; within month-date precision; scoped requirement with no scoped input; either/or branches (also across "In the alternative" sentences); above an ordinary range; mixed, conditional, or unrecognized heading; unconditional PhD → `human-requirement-review` |
| G5 Start window | a stated constraint compatible with `available_from` by date arithmetic, or no timing stated (`pass-unknown`) | a **mandatory** stated date or month ("start date:", "must start by", "starts in") that the supplied date cannot meet → `skip-application` | ASAP; offer-relative; conflicting; descriptive wording; **any season** (assumed calendar) → `human-start-window-review` |
| G6 Stack evidence | a JVM language in required/responsibility lines **and** a distributed-systems, messaging, or cloud-infrastructure term | — | Java only in preferred/other lines; another language required without Java; JVM without backend-infrastructure terms; under 400 characters → `human-requirement-review` |
| G7 Opening-level sponsorship | apparent offer wording → `review-offer-excerpt` | otherwise → `seek-vacancy-sponsorship-evidence` | — |
| G8 Final review | always | — | a person reads `triage.md` |

**Precedence (tested; break mutant 1):** no later result clears an earlier stop.

## Decision rules (defined; all are documented heuristics, labelled model-judgment)

**Experience (G4):**
- **Month precision.** Each entry spans [inclusive month count − 2, inclusive month count].
  Overlaps are counted once; adjacent entries are not merged. A comparison inside that band →
  review.
- **General vs scoped.** A requirement is *general* only in the form "N years of [professional /
  industry / relevant / related / full-time / work] [software / engineering / development]
  [or related] experience [in the industry / in software engineering / or related occupation]".
  Everything else ("N years in Java", "building distributed systems", "leading teams", "in
  fintech", "in each of the following") is *scoped*.
  - Total career months **never** meet a scoped requirement.
  - A scoped requirement is a mismatch only if it exceeds **all** recorded experience. Otherwise
    it is unknown → review, unless the candidate supplies a matching `scoped_experience` input
    (`your-input`).
- **Co-op (Aditya, E14).**
  - Explicit exclusion ("co-ops do not count", "excluding internships", "post-graduation
    experience") → the co-op never counts.
  - Explicit acceptance → counted per the wording, with the excerpt kept.
  - Silent or ambiguous **and** counting the co-op would change the result → review, showing the
    full-time-only comparison.
  - Short even with the co-op → documented mismatch.
- **Sections.** Preferred cues ("preferred", "nice to have", "bonus", "a/is a plus", "ideal");
  required cues ("minimum", "requirements", "qualifications", "what we're looking for", "what we
  look for", "must (also) have", "should have", …); responsibilities; *ambiguous* when preference
  and obligation cues mix or the heading is conditional ("(for senior-level candidates)").
  Inline "preferred / a plus" → preferred; inline "required / must have" → required. Unmet or
  unknown years outside a clearly required section → review. Titles are never read.

**Start window (G5):**
- Exact dates keep their day. Constraint by context: "by / no later than / before" = deadline;
  "no earlier than / not before / after / from" = earliest start (always compatible); "on / in /
  start date:" = fixed.
- A conflict stops only when the sentence carries a mandatory cue. Descriptive timing → review.
- Seasons are **model assumptions** (spring = Mar–May, summer = Jun–Aug, fall = Sep–Nov; winter
  unresolved). A season never stops; a compatible season is `pass-unknown`.
- Every result lists what it does not establish: work authorization or EAD approval, legal
  eligibility, hiring duration.

**Wording (G3/G7):**
- Assignment 1's `classifyVacancy`, plus extensions: "must not … require … sponsorship" and "not
  eligible for … sponsorship" → refusal; application-style questions → `asks-about-sponsorship`;
  citizenship → stop; clearance / export control / ITAR / "U.S. person" → review.
- Heading lines are read too, because eligibility statements are sometimes rendered in bold.

**Liveness (G2):** described in the gate table. The output lists each raw observation (feed
listing, HTTP status/title/length: record) separately from the checker's verdict and the
combination (judgment).

## Workflow (addressed to the agent)

1. **Collect (live).** `node …/collect.mjs --private-dir private/a2 --public-dir <tracked real-sample dir>` per `SAMPLE-PROTOCOL.md`.
2. **Observe pages (live).** `npm run ats:liveness -- <URLs>` → evidence file; optional `page-probe.mjs <selection.json>`.
3. **Extract.** `node …/triage.mjs extract --collection … --page-liveness … --page-probe … --out <tracked observations.json> --full-out private/…`
4. **Run on full text (private) and on committed excerpts (replay); `compare` must show 0 differences.**
5. **Unseen postings (after freezing a rules version).** `node …/holdout.mjs select …` per `HOLDOUT-PROTOCOL.md`; observe; extract; `holdout.mjs finalize`; write expectations; commit; only then run.
6. **Stop at every review state.** Hand `triage.md` to the person (G8). Never clear a gate for them.
7. **Log** in `logs/runs/2026fa-aditya-raj-sde-<n>.md`. Never edit `logs/RUN_LOG.md`.

## Output contract

**`<out-dir>/triage.json`** (agent log):
- `run`: command, time, `kind` (`live-full-text`, `replay-of-captured-excerpts`,
  `holdout-replay-of-captured-excerpts`, or `synthetic`), `rules_version`, input sha256, CSV
  sha256, `scorer: "not called"`.
- `candidate`: full-time and co-op month intervals, `career_upper`, scoped inputs, degrees,
  `available_from`, precision note — all `your-input`.
- `roles[]`, each with:
  - `liveness` (`state`, `gate`, `why`, `observations[]` each labelled, `source:
    model-judgment`);
  - `vacancy`, `experience` (findings with `scope`, `comparison`, and state; co-op status in the
    posting), `start_window` (statements with type, constraint, mandatory flag, assumptions),
    `stack`, `company` (counts: record; context only);
  - `gates[]` (G1–G8), `next_action`, `decided_by`, `also_needed[]`, `other_open_gates[]`.
- `summary`: counts by next step; skip fraction (this sample only); state counts; **disjoint
  experience groups** (satisfied + core stack / unknown + core stack / awaiting review /
  documented mismatch / stack not core), each with liveness-not-clear, sponsorship-unresolved, and
  timing-unresolved counts; `detection_scope` sentence.

**`<out-dir>/triage.md`** (human report), in this order:
1. executive summary with the group table;
2. run record;
3. gate legend;
4. decision table, with company history as a context-only column;
5. waiting-for-a-person list;
6. evidence per opening: quoted employer lines kept apart from **Rule** lines; raw observations
   listed with their labels;
7. what the run cannot verify.

Synthetic postings are marked **SYNTHETIC**.

**Labels:**
- **record** = a data-file value, a verbatim excerpt, or a raw observation (feed listing, HTTP
  status);
- **model-judgment** = any heuristic interpretation (the checker verdict, the liveness
  combination, section, scope, requirement, and compatibility rules);
- **your-input** = candidate-supplied values and anything derived from a synthetic posting.

## What it can verify

- What each captured posting's text says, under the defined rules, about years (general or
  scoped), degrees, graduation windows, co-ops, start timing, sponsorship, citizenship,
  clearance, export control, and stack terms. Each finding is quoted with its section heading.
- Arithmetic between stated general minimums and the candidate's month intervals; whether the
  co-op would change it; whether a scoped minimum exceeds all recorded experience.
- Date arithmetic between stated start constraints and the supplied availability date.
- Whether the employer feed listed the posting at a stated time, and what the page returned then.
- That committed excerpts reproduce the full-text decisions (`compare`: 0 differences on both
  samples). That every committed excerpt line is verbatim in the captured text (evidence 12, 30).
- That company history changes no decision.

## What it cannot verify

- **That any opening will sponsor.** "Silent" means the rules detected no sponsorship wording in
  the captured posting body. Application-form questions were not inspected (a deferred DEV item; see Proposed additions).
- **Work authorization, EAD approval, legal eligibility to start, or hiring duration.**
- Years spent on a specific skill, unless supplied as a scoped input.
- Exact employment dates finer than a month.
- That a posting is open *now*, or why a page was blocked.
- Whether an employer would make an exception, count a co-op, or how it reads "related".
- **General accuracy.** Rules were corrected on the 12 development postings. The 6 unseen postings
  (same three boards, same day) exposed three defects in the frozen rules; after repair they are
  development evidence too. Wording outside the vocabularies will be missed.

## Stop conditions (refuse rather than guess)

- G1 failure → exit 2, nothing written.
- A candidate entry without `employment_type`, or with malformed dates → refuse (never infer from
  a title).
- `--full-out` or a private input with an output outside `private/` → refuse.
- A G2/G3/G4/G5 stop → never routed onward to evidence-seeking.
- A season, "ASAP", descriptive timing, a blocked page, silence about co-ops, or a scoped
  requirement without input → never converted into a stop or a match; always a named
  unknown/review state.
- Never produce a match percentage or composite score.

## Proposed additions

| Addition | Status |
|---|---|
| `collect.mjs`, `holdout.mjs`, `triage.mjs`, `checks.mjs`, `text.mjs`, `page-probe.mjs`, `excerpt-check.mjs`, `break-test.mjs`, 2 test files (77 tests), fixtures, persona + test variants | **Built.** Tests 77/77 (evidence 25); real runs 16, 24; holdout 18–24; break 26 |
| Unseen-posting evaluation | **Built and run (closed DEV), 2026-10-21:** protocol committed after the v0.4.0 freeze; first result 40/48 checks, 4/6 final steps (evidence 22); repairs → v0.4.1 (development) |
| Application-question capture (Greenhouse `/jobs/<id>?questions=true`) as a separate labelled observation | **Deferred — NOT built.** Scope decision by Aditya Raj, 2026-10-21 (FRICTIONAL E14, approved E26). *Reason:* feature scope is frozen at v0.4.1, and the deadline leaves no time to build and validate a new data source. *Limitation it leaves:* every sponsorship and eligibility check sees only the posting body; sponsorship questions that live only in the application form are invisible ("silent" ≠ "no question asked"). |
| Patch to the shared maintained `scripts/ats/liveness-core.mjs` so an HTTP 403 challenge page is `uncertain`, not `expired` | **Deferred — NOT built.** Scope decision by Aditya Raj, 2026-10-21 (E14, approved E26). *Reason:* a patch to a shared maintained file belongs in a separate, maintainer-reviewed change. This mode already guards the case locally. *Limitation it leaves:* other tools that call the maintained checker still read a challenge page as closed; this mode's protection is its own G2 rule (test R14, mutant `thin-page-is-closure`). No challenge is bypassed. |

**Closed (DEFINE), Aditya Raj, 2026-10-21 (E14):** the co-op rule as stated in "Decision rules".
*Reasoning (Aditya):* silence alone must not skip the borderline postings. A review is needed
when the co-op would change the outcome.

## Open items (human closure required before promotion)

- **Closed (APPROVE), Aditya Raj, 2026-10-21 (FRICTIONAL E30):** reports read and judged adequate for the decisions they support. This clears only this item; no posting-level review gate is cleared.
- **Closed (DEFINE), Aditya Raj, 2026-10-21 (E26):** keep the current conservative heuristics as documented in "Decision rules": the general-vs-scoped form, heading and inline cue vocabularies, mandatory-cue list, season windows as assumptions, the 400-character threshold, the month-precision band, and the sample and holdout protocols. *Reasoning (Aditya):* each heuristic routes uncertainty to review rather than turning it into a stop or a match.

## Lifecycle evidence (SNICKERDOODLE "Recipe Lifecycle"; honest status)

| Transition | Gate test | Evidence today | Status |
|---|---|---|---|
| DRAFT → SPECIFIED | zero open typed TODO items; each closure has its required evidence | DEFINE closures recorded above (E14, E26); DEV items built (evidence 25, 32) or deferred by a recorded human scope decision (not counted as built); **1 open APPROVE** | **met** (APPROVE closed E30) |
| SPECIFIED → RUNNABLE-SAMPLE | full sample run completes; conformance checks pass; audits generated **and read** | sample/real/holdout runs complete (evidence 24, 32, 33); conformance 78 files (31); reports generated; **read and judged adequate by a human (Aditya): pending** | **met** (E30) |
| RUNNABLE-SAMPLE → RUNNABLE-LIVE | live run with a human clearing every gate | not sought for this submission (Aditya, E26). The real-posting runs are replays of captured observations with no gates cleared | not claimed |

**Mandatory vs optional human actions (checked 2026-10-21 against SNICKERDOODLE.md lines 45, 59, 92 and the assignment PDF's Attestation section):**
- *Mandatory:* a human reads and judges the audits (SNICKERDOODLE.md:59, P1 "humans verify
  adequacy"). The worked-run attestation is "the human's record of having judged the audits"
  (line 45), and the PDF's format is "By: <name> · <date>".
- *Not required:* the human re-executing the commands. The attestation rows may record runs by
  Claude when they are attributed; Assignment 1 used the same convention. The live-page cross-check
  and the personal review-block run were Claude's suggestions, so they are optional.
- *Outside this lifecycle, still required by the course:* the in-class presentation; the Canvas
  upload (Aditya's account).

Deferred enhancements are **not** unresolved requirements of this version. They are recorded scope
decisions with stated limitations, and nothing claims them as built. The only requirement that
actually blocks promotion is the human adequacy review.

## Run-log template (`logs/runs/2026fa-aditya-raj-sde-<n>.md`)

```markdown
## YYYY-MM-DD — java-backend-early2027 <live-collection | replay | holdout | synthetic> run

- **Recipe:** recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md v<recipe_version> (rules v<RULES_VERSION>, frozen at <commit> if holdout)
- **Run by:** <Claude / Aditya>
- **Inputs:** <observations file + sha256>; candidate <config>; sponsorship CSV sha256 <hash>; collection/observation window <times>
- **Outputs:** <out-dir>/triage.json, <out-dir>/triage.md
- **Result:** <counts by next step>; experience groups; full-text vs replay differences <n>; (holdout) agreement with pre-written expectations <k/n checks, k/n final steps>
- **Human gates:** <cleared by whom, when — or "none cleared">
- **Open issues:** <misclassifications, limitations, pending decisions>
```
