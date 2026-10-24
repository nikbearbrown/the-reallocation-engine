---
status: RUNNABLE-SAMPLE # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE (capped at RUNNABLE-SAMPLE for this assignment)
todos_open: 0
last_gate: "SPECIFIED→RUNNABLE-SAMPLE, 2026-10-03: sample run complete (submission evidence 31c, 40; Aditya's own clean-checkout run, 39); conformance passes (32, 38, 40); outputs read and judged adequate by Aditya Raj (step-4 review, with the G4 legend he requested added in v0.4.0); logs/runs/2026fa-aditya-raj-sde-1.md"
attestation: null
recipe_version: 0.4.0
---

# sponsor-live-jan2027 — Sponsor & Posting Reality Check for January 2027 engineering roles

## Executive summary

**What it is.** A procedure for an engineering candidate who will need future visa sponsorship and
is looking at roles that start in January 2027, with backend and platform roles first. Before the
candidate spends time tailoring an application, it checks two things about each opening:

- whether the posting is still open;
- what the evidence actually says about sponsorship, kept separate for the **company** (its
  historical record) and for **this opening** (what the posting itself says).

**What it decides.** It decides nothing on the candidate's behalf. Each opening ends in one of five
plain next steps:

- skip this application (posting closed, or the opening explicitly refuses sponsorship);
- have a person check whether the posting is really open;
- look for sponsorship evidence about this specific opening;
- review an apparent sponsorship offer;
- stop because timing information is missing.

**What it refuses to do.**

- It never turns a company's past sponsorship counts into a promise for a specific opening.
- It never invents a sponsorship score.
- It never lets a high score override an opening that refuses sponsorship.
- It never claims the January 2027 start date was checked.

**Status.** Runnable on sample data (the highest stage this assignment allows). The program, its offline tests, and its sample run pass, and a person has read and judged the sample report. It has not been run on live data.

## Required reads

| Read | Why |
|---|---|
| `SNICKERDOODLE.md`, `DOMAIN.md` | constitution and domain map |
| `course/2026fa/submissions/aditya-raj-sde/CHANGE-BRIEF.md` | predictions F1–F3 and L1 plus the accepted decisions this recipe implements |
| `data/80-days-to-stay/README.md`, `data/80-days-to-stay/data/README.md` | provenance and column meanings of the sponsorship data; neither states a time period |
| `scripts/ats/liveness-core.mjs` | the maintained liveness classifier (`classifyLiveness`) this recipe reuses without copying |
| `scripts/score/role-scorer.mjs` | the maintained combiner, used only on the scenario path and in the F1 characterization |

## Phase gates

Each role stops at its first failed hard gate. Everything evaluated up to that point is still
reported. **Gates never clear themselves:** every stop names what a human must look at.

| Gate | Test | Pass | Fail / stop |
|---|---|---|---|
| G1 Input | The input JSON validates:<br>• every `fit`, `timeline`, and `demo_sponsorship_vote` has `source: "your-input"`;<br>• `p` and `factor` are in [0, 1];<br>• `rationale` and `assumption` are non-empty;<br>• exactly one of `snapshot` / `recorded_liveness`;<br>• `synthetic` is declared;<br>• a `recorded_liveness` labeled `record` points at an existing evidence file. | evaluate roles | **run fails, exit 2**, named error, no outputs |
| G2 Liveness | `classifyLiveness(snapshot)` (or the recorded result) is `active`, **and** the closure-wording check finds nothing | continue | `expired` → `skip-application` (posting closed; reason code shown). `uncertain` or `liveness-conflict` → `human-liveness-review` (excerpt shown). |
| G3 Vacancy refusal | the vacancy-statement rule finds no refusal in `vacancy_text` | continue | `explicit-refusal` → `skip-application` (refuses sponsorship; excerpt shown). **Not sent to the scorer. No score can override this.** |
| G4 Timing | a valid `timeline` input is present | continue; every later label carries **"provisional: timing not verified"** | missing → `blocked-timing-input`. The role is never passed to the scorer, whose default would be a silent 1.0. |
| G5 Sponsorship evidence | the vacancy state is `apparent-offer` | `review-offer-excerpt` (a person reads the excerpt; it is not a guarantee) | `silent`, `not-captured`, `ambiguous-or-conditional`, or `contradictory` → `seek-vacancy-sponsorship-evidence` (state: awaiting sponsorship evidence) |
| G6 Final review | always | — | a person reads `reality-check.md`. Nothing is applied to automatically. |

**Gate legend in the report (added in v0.4.0 after Aditya's review):** both outputs explain each gate's "pass" and "stop". In particular, **G4 "pass" means only that an explicit sample timing assumption satisfied the sample rule; actual start-date compatibility is never verified.**

**Company evidence is context, not a gate.** It is computed and reported for every role, and never
converted to a tier or score.

## Evidence states

**Company level** (from the sponsorship CSV; label `record`, or `your-input` when a person pinned
the row):

| State | Rule | Must never be read as |
|---|---|---|
| `no-employer-match` | 0 candidate rows | zero, or a refusal |
| `ambiguous-employer` | more than 1 candidate row. All candidates are listed; resolved only by a human-pinned `employer_row_name`. | a merged employer |
| `matched-blank-fields` | 1 row; `Total Approvals`, `Total Denials`, and `Approval_Rate` are blank | zero |
| `matched-zero-approvals` | 1 row; `Total Approvals` = 0 | a refusal by the employer |
| `matched-with-record` | 1 row; approvals > 0. The counts are shown with their column names. | evidence about this opening |

**Matching rule (defined).**

1. Casefold the name, replace non-alphanumerics with spaces, and drop trailing legal suffixes
   (`inc`, `llc`, `corp`, `corporation`, `co`, `ltd`, `lp`, `plc`).
2. Compare the result for exact equality.
3. Never use fuzzy matching.

*Reasoning:* the CSV has 198 suffix-only collisions (for example an `INC` and an `LLC` row for the
same stem), so stripping suffixes surfaces them as ambiguous instead of hiding them. The suffix list
mirrors `scripts/sec/entity-resolution.py:44-58` (consulted, not imported).

**Vacancy level** (from `vacancy_text`; label `model-judgment`, because it is a rule applied to
text). The supporting excerpt is always kept.

| State | Rule (case-insensitive starter vocabulary, defined) |
|---|---|
| `explicit-refusal` | will not / won't / cannot / can't / unable to / do not / does not / not able to + sponsor; "without (the need for) (visa) sponsorship"; "sponsorship (is) not available"; "no visa sponsorship"; "does not offer (visa) sponsorship" |
| `apparent-offer` | "(we) will / can / do sponsor"; "(visa) sponsorship is available"; "sponsorship available" |
| `ambiguous-or-conditional` | "may / might sponsor"; "case-by-case"; "for exceptional candidates"; "authorized to work in the U.S./United States" with no sponsorship term |
| `contradictory` | both refusal and offer matched |
| `silent` | text present, nothing matched |
| `not-captured` | `vacancy_text` is `null` |

**Precedence (defined at implementation, 2026-10-03):**

1. Refusal and offer both matched → `contradictory`.
2. Otherwise, any conditional match → `ambiguous-or-conditional`. A hedged refusal is not a *clear*
   refusal, and a hedged offer is not an offer.
3. Otherwise → `explicit-refusal`, then `apparent-offer`, then `silent`.

*Reasoning:* no repository code detects this wording. The vocabulary is a starting point whose
misses are expected, per F3/L1 in the change brief. It is never treated as a record.

**Closure-wording check (defined).**

- Runs only when the classifier says `active`.
- Patterns: `\bfilled\b`, `\bclosed\b`, `no longer`, `not accepting`.
- A match → `liveness-conflict` (label `model-judgment`), excerpt shown, routed to a human.
- It never expires a posting automatically.

*Reasoning:* this is CHANGE-BRIEF U1.3, the intended behavior for F2-2. False positives (for example
"closed-loop") cost a human review, never an automatic skip.

## Stored tools (exist today)

| Path / command | Use here |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | company sponsorship columns (read-only; the `phone` and executive columns are never copied into outputs) |
| `scripts/ats/liveness-core.mjs` → `classifyLiveness` | offline liveness on recorded or fixture snapshots |
| `npm run ats:liveness -- <url>` (`scripts/ats/check-liveness.mjs`) | optional live check, network plus Playwright, **outside** the test suite. The baseline is in the submission's evidence 19. |
| `npm run score -- <roles.json> --out-dir <dir>` (`scripts/score/role-scorer.mjs`) | the maintained combiner: the scenario path and the F1 characterization only. **Never copied, never run without `--out-dir`.** |
| `search/examples/aarav-patel/profile.yml` | fictional persona for public runs |
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/` | the sample input and the test fixtures (F1, F2, F3, timing, invalid label) |

## Proposed additions

| Addition | Status |
|---|---|
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs`: validates the input, applies the gates and states above, writes `roles.json` for scenario roles only, runs the maintained scorer, and writes both outputs | **Built, 2026-10-03.** Exists; conformance passes (submission evidence 32); offline tests 18/18 (evidence 30, 30b); sample run exit 0 (evidence 31, 31b). |
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/hypothesis-probe.mjs`: records the F1a (maintained scorer) and F2(a) (maintained classifier) observations next to the predictions; always exits 0 | **Built, 2026-10-03.** Exists; first execution recorded in evidence 29 (all 9 predictions matched). |
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs` (`node --test`, offline): asserts the **intended** behavior (F1b, F2(b), F3, timing, labels, G1 exit 2, no network) | **Built, 2026-10-03.** Exists; 18 tests pass (evidence 30, 30b, 40); shown to fail on a deliberate break of the refusal gate (evidence 36: test 7; after the second guard, evidence 37: tests 7 and 18). |
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/README.md` with owner frontmatter and the one documented command | **Built, 2026-10-03.** Exists; its run command produced the sample run (evidence 31b). |
| Networking suggestions. | **Closed (DEFINE), Aditya Raj, 2026-10-03:** v1 emits **no** networking suggestion. *Reasoning:* no evidence rule yet separates a justified outreach target from a rejection, and an automatic suggestion would imply that a refusal or a company count justifies outreach. Value chosen by Aditya in the plan questions; this reasoning sentence comes from the option text Claude drafted and he selected. |
| Precedence when a scenario vote is present but the posting is silent or not captured: the actionable result stays `seek-vacancy-sponsorship-evidence`. The demonstration score may appear separately as a clearly labeled hypothetical scenario. It must not override that result or imply verified eligibility. | **Closed (APPROVE), Aditya Raj, 2026-10-03.** Explicit approval in the session chat, recorded verbatim in the submission's CHANGE-BRIEF Update 3 and FRICTIONAL. |

**Closed as a documented scope decision (Aditya, 2026-10-03):** company counts are **not** mapped
to a tier or `p`. No repository source defines such a mapping. The archived design document's
cut-offs apply to a composite built from inputs this CSV lacks, and the book's chapter 7 says the
tiers are unreconciled. The scenario path instead requires an explicit `demo_sponsorship_vote`
(`your-input` plus rationale), described as an **uncalibrated scenario input**, not an estimate that
the employer will sponsor.

## Workflow (addressed to the agent)

1. **Check inputs (G1).**
   - Confirm the input file is a fixture under the namespace, or another fictional/public file a
     human has cleared.
   - Prohibited, never read (these private locations may not exist on a clean clone): `private/`,
     `search/resume.json`, `data/ats/`.
2. **Run the one documented command** (from the contribution README):
   `node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs --input <fixture.json> --out-dir <dir>`.
   - `<dir>` must be inside `course/2026fa/submissions/aditya-raj-sde/runs/` or a temporary
     directory.
3. **For each role:** company state → liveness (G2) → vacancy state (G3) → timing (G4) → sponsorship
   evidence (G5). Record every gate's status and reason.
4. **Scenario path.**
   - Applies only to roles that passed G2–G4 and carry a valid `demo_sponsorship_vote`.
   - Write `roles.json` in the scorer's input shape (`data/examples/ch11-roles.json`), then run
     `npm run score -- <out>/roles.json --out-dir <out>`.
   - Report the scorer's label as a **scenario label** beside the gate decision, never in place of it.
5. **Stop** at the first hard gate per role. Hand the Markdown report to the human (G6).
6. **Log** the run in `logs/runs/2026fa-aditya-raj-sde-<n>.md` using the template below. Never edit
   `logs/RUN_LOG.md`.

## Output contract

Two files serve two customers; one file cannot serve both.

**`<out-dir>/reality-check.json`** (the agent log):

- `run`: `command`, `started_at`, `input_file`, `csv_path`, `csv_sha256`, `out_dir`.
- `roles[]`, each with:
  - `inputs` (echoed, labeled);
  - `company {state, candidates[], counts{approvals, denials, approval_rate}, source}`;
  - `liveness {result, code, reason, conflict_excerpt, source}`;
  - `vacancy {state, excerpts[], source}`;
  - `timing {factor, assumption, source, verified: false}`;
  - `gates[] {id, status, reason}`;
  - `decision`, `next_action`;
  - `scenario {label, composite, scorer_file} | null`.
- `summary`: counts by decision; `skip_fraction` with its sample size `n` and the word "sample".

**`<out-dir>/reality-check.md`** (the human report):

1. an executive summary;
2. a decision table;
3. per-role evidence with every value's label;
4. the decisions waiting for a human, gate by gate;
5. what this run cannot verify.

Every synthetic posting is marked **SYNTHETIC**.

**Scenario-path extras:** `<out-dir>/roles.json`, plus the scorer's own `role-scores.json` and
`role-scores.md`.

**Labels:**

- `record`: CSV fields; a recorded liveness observation of a real posting with an evidence file; the classifier's output on a recorded snapshot of a real page.
- `model-judgment`: the vacancy-statement rule, the closure-wording check.
- `your-input`: fit, timeline, scenario vote, pinned employer row, fixture liveness values, and **anything derived from an invented (synthetic) snapshot**, including the classifier's result on it (marked `synthetic-derived`). An invented posting never yields a `record`. *(Corrected in v0.3.0: v0.2.0 labeled classifier output on synthetic snapshots `record`.)*

## What it can verify

- Whether a company name in the input matches 0, 1, or several rows of the shipped sponsorship CSV
  under the matching rule above, and what that row's count columns say.
- What the maintained classifier returns for a given snapshot (status, final URL, text, body apply
  controls).
- Whether a posting's supplied text contains wording from the defined vocabularies, with the excerpt.
- That every gate stop and every label in the outputs follows this contract (the offline tests).

## What it cannot verify

- **That any opening will actually be sponsored.** Company counts are aggregates with **unspecified
  time coverage**. The data README names its government sources but no period, and mentions
  "initial vs. continuing employment", so the counts may include continuing employment
  (unverified). There are no job codes and no per-year detail.
- That a posting is open *now*. A snapshot or recorded observation is point-in-time; the classifier
  is a heuristic over wording and buttons.
- Sponsorship wording outside the vocabulary. Paraphrases will be missed, and conditional wording
  stays unresolved.
- Whether two similarly named employers are the same organization. Only a human pin resolves this.
- January 2027 start compatibility. Timing is a labeled sample assumption, never checked.
- Fit. It is a labeled sample value; no résumé matching exists.
- How often postings are silent about sponsorship. Any measured fraction applies only to its sample.

## Stop conditions

Stop, and do not invent a value, when:

- the input fails validation (G1). Exit 2 with no partial outputs, because a half-written log looks
  like evidence;
- a posting refuses sponsorship (G3). Do not score it on the decision path, because a score could
  appear to override the refusal;
- a timeline is missing (G4). Do not pass the role to the scorer, because its default silently
  passes the gate;
- a company is ambiguous. Do not pick a row, because merging employers misattributes records;
- the sponsorship CSV is missing or its header lacks the four sponsorship columns. Exit 2, because
  there is no company evidence to report.

## Next action per result (closed vocabulary)

| Result | Next action | Where it fits in the day |
|---|---|---|
| posting closed | `skip-application` | frees application time |
| liveness uncertain or conflicting | `human-liveness-review` | a two-minute check before any tailoring |
| opening refuses sponsorship | `skip-application` | frees application time; no automatic outreach |
| apparent offer | `review-offer-excerpt` | read the excerpt, then decide whether to tailor |
| silent / not captured / ambiguous / contradictory | `seek-vacancy-sponsorship-evidence` | ask the recruiter or check the posting text before tailoring |
| timing input missing | `blocked-timing-input` | supply timing, or drop the role |

## Run-log template (`logs/runs/2026fa-aditya-raj-sde-<n>.md`; fields from `recipes/_shared.md`)

```markdown
## YYYY-MM-DD — sponsor-live-jan2027 <sample|fixture> run

- **Recipe:** recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md v<recipe_version>
- **Run by:** <Claude / Aditya>
- **Inputs:** <fixture path>; sponsorship CSV sha256 <hash>
- **Outputs:** <out-dir>/reality-check.json, <out-dir>/reality-check.md, <scenario files if any>
- **Result:** <counts by decision; skip fraction with n>; gates that stopped roles
- **Open issues:** <human decisions pending, misclassifications seen, limitations hit>
```

## Known open rules

- Networking suggestions are not produced in v1 (closed DEFINE, Proposed additions).
- The scenario-vote precedence rule was approved by Aditya on 2026-10-03 (see Proposed additions).
- The vacancy and closure vocabularies are starter lists; any change is a recipe version change.
