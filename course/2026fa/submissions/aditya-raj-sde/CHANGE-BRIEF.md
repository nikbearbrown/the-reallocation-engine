# CHANGE-BRIEF — Sponsor & Posting Reality Check for January 2027 Engineering Roles

## Executive summary

This is the "predict before you build" record for a small procedure that checks two things about a
job opening before an engineering candidate who will need visa sponsorship spends time on it:

1. **Is the posting still open?**
2. **What does the evidence actually say about sponsorship, for this company and for this specific
   opening?**

It records, before any code exists:

- the student's own answers to three test situations;
- the scope decisions he made;
- three failure hypotheses and one limitation, all suggested by the AI agent and accepted by the
  student as things to test, not as findings;
- how each will be checked.

The central decision: a company's past sponsorship record must never be read as a promise for a
particular opening. When an opening clearly refuses sponsorship, no other positive score may
override that. When the evidence about an opening is missing, the procedure says it is waiting for
evidence instead of guessing.

## How to read this record

- **Aditya** = the student. **Claude** = the AI agent (Claude Code, `claude-opus-5-5`).
- Sections 2 and 3 are Aditya's own words and decisions. Sections 9 and 10 are Claude's
  suggestions; each says what Aditya accepted.
- **Source-based reasoning** means Claude read the code or documentation and worked out what should
  happen; **nothing in this brief has been executed**. Observed results will be added under
  *Revisions* and in `TEST-REPORT.md`, without editing the predictions above them.
- Private career and immigration details are deliberately absent. Public runs use a fictional
  persona.
- All entries are dated 2026-10-03.

## 1. Career situation (public wording, accepted by Aditya)

**Intended user:** an engineering candidate seeking opportunities that start in January 2027 who
will need **future employer sponsorship**, with **backend/platform roles prioritized**. Their
bottleneck is telling which openings are both still open and realistically compatible with
sponsorship.

- **Public demonstration persona:** the fictional **Aarav Patel**
  (`search/examples/aarav-patel/profile.yml`; backend and platform roles). Aarav's dates are fixture
  values for the demonstration only. They do not represent the student's situation, and they are
  not used as evidence of anyone's authorization or start date.
- **Not claimed:** this recipe does **not** verify January 2027 compatibility unless timing is
  actually checked (see the timing decision in section 3 and gate G4 in section 7).

## 2. Original answers (Aditya, verbatim, before any prototype)

Collected one situation at a time, before Claude explained or challenged anything.

| Situation | Aditya's answer (exact words) |
|---|---|
| **A.** The company has historical sponsorship records, but the vacancy explicitly refuses sponsorship. | "I think we can skip this opening because it explicitly says that the role will not sponsor." |
| **B.** The job URL returns HTTP 200, but the page says the role is closed. | "such opening should be skipped because the page explicitly says that the position is no longer accepting applications." |
| **C.** The sponsorship fields are blank, while the posting appears active. | "in such a case, I think I should apply for this job." *(No reason stated. Recorded unchanged; the refinement is in section 3.)* |
| **Which mistaken conclusion would waste the most time?** | "I believe treating the company's sponsorship data as this vacancy's sponsorship is a bad assumption." |
| **What will a first prototype miss?** | "I'm not sure what the first prototype will get wrong." |

## 3. Accepted decisions (Aditya, after discussing the situations)

1. **Persona and wording:** Aarav is the public persona, using the wording in section 1. No private
   immigration details are copied, and Aarav's dates are not assumed to be the student's.
2. **F1, F2 and F3 are kept as testable hypotheses**, attributed to Claude, with source-based
   reasoning kept separate from observed execution.
3. **Refinement of answer C, for the prototype:** when the required vacancy-level sponsorship
   evidence is unknown, the role goes to an **"awaiting sponsorship evidence"** state. No sponsorship
   score is manufactured, and missing evidence is never turned into a refusal. The original answer
   ("apply") stays unchanged in section 2.
4. **L1 is kept, with narrower wording** (section 10).
5. **Fit is kept, without a matching system:**
   - The maintained scorer's fit term is used only as an explicitly labeled **sample input**.
   - There is no résumé matching and no invented calibrated fit probabilities.
   - Controlled fixture values are used for the F1 stress test, and are labeled as fixture values,
     not real assessments.
   - The maintained scorer's weights and thresholds are kept unchanged.
6. **Timing stays explicit:**
   - The timeline gate is never silently omitted or defaulted to a pass.
   - The public sample uses clearly fictional timing inputs, with the rule and its assumptions
     documented.
   - Where timing information is insufficient, the limitation is reported or the decision is
     blocked.
   - A sample assumption is not evidence of anyone's actual authorization or start-date
     compatibility.
7. **Next actions are evidence-based:**
   - A refused vacancy means **skip that application**.
   - Suggesting networking with the company is a **separate, justified** suggestion. It is never an
     automatic consequence of a rejection.

## 4. Engine layers

| Layer | Used for | Role in the decision |
|---|---|---|
| Sponsorship (80 Days to Stay data, built from DOL/USCIS employer data per its README) | company-level H-1B record | a **vote** in the maintained scorer; reported, never treated as vacancy-level |
| Job-Ops liveness (ATS) | is the posting open | a **gate** |
| Visa timeline | sample timing input only | a **gate**; explicit, never defaulted; January compatibility is not verified |
| Scorer | combines the votes and gates | maintained `scripts/score/role-scorer.mjs`, unmodified |

**Not used:** SEC Form D funding, BLS/O*NET role quality and wages, dashboards, broad scraping.

## 5. Existing data and scripts reused (paths verified to exist, 2026-10-03)

| Path | Use |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | company sponsorship columns: `Total Approvals`, `Total Denials`, `Approval_Rate`, `top_job_titles_sponsored` |
| `data/80-days-to-stay/README.md`, `data/80-days-to-stay/data/README.md` | provenance and column descriptions. Whether the column table describes exactly this v3 file is unverified. |
| `scripts/ats/liveness-core.mjs` → exported `classifyLiveness({status, finalUrl, bodyText, applyControls})` | offline liveness from recorded page snapshots (no network) |
| `scripts/ats/liveness-browser.mjs`, `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) | optional live check, Playwright; never used in tests |
| `scripts/score/role-scorer.mjs` (`npm run score -- <roles.json> --out-dir <dir>`) | the maintained combiner; never re-implemented, always run with `--out-dir` |
| `data/examples/ch11-roles.json` | the input shape the prototype's `roles.json` follows |
| `search/examples/aarav-patel/profile.yml` | fictional persona for public runs |
| `recipes/scan.md`, `recipes/local-wage-adjustment.md`, `recipes/local-wage-adjustment.card.md`, `recipes/_shared.md` | style models for the recipe, card, and run-log template |

## 6. Proposed additions (all inside the student namespace)

| Addition | Typed TODO | Why it belongs |
|---|---|---|
| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/` script with one documented command | `[TODO: DEV]` | joins company sponsorship records and vacancy evidence, applies the gates below, writes a labeled `roles.json`, runs the maintained scorer, and writes a JSON log and a Markdown report |
| Offline test (`node --test`) + `fixtures/` (recorded page snapshots, posting text excerpts, persona-based roles) | `[TODO: DEV]`, `[TODO: DATA SOURCE]` | the assignment requires an offline test; fixtures must be fictional or public, never private |
| `README.md` with owner frontmatter | `[TODO: DEV]` | contrib rules |
| Rule mapping company counts to the scorer's sponsorship `p`/tier, cited to the book or labeled `your-input` | `[TODO: DEFINE]` | no source pins this yet; it must not be invented |
| Vacancy-statement rule (refusal / apparent offer / silent / ambiguous), keeping the supporting excerpt | `[TODO: DEFINE]` | detection is a judgment over text, not a record |
| Timing rule for the sample, and when a decision is blocked for missing timing | `[TODO: DEFINE]` | decision 6 |
| Rule for when a networking suggestion is justified | `[TODO: DEFINE]` | decision 7 |

## 7. Human gates (hard stops)

| Gate | Stops when | What the human must see to clear it |
|---|---|---|
| **G1 Input** | before any run | the fixture list: persona, companies, URLs, all fictional or public; no private data |
| **G2 Liveness** (gate) | `expired` → skip this application; `uncertain` → stop | the classifier's code and reason, plus the recorded or observed snapshot (status, final URL, matched phrase) |
| **G3 Vacancy refusal** (prototype's protective gate) | a clear, applicable refusal is found | the exact excerpt. The decision is to skip the application, and **no positive score may override it**. The scorer's own output is still shown, for audit. |
| **G4 Timing** | the timing input is a sample assumption or insufficient | the rule and assumption used; any decision depending on it is reported as not timing-verified, or blocked |
| **G5 Awaiting sponsorship evidence** | vacancy-level evidence is unknown, ambiguous, conditional, or contradictory | the company record (or why there is none) and the posting excerpts; the human decides what evidence to seek |
| **G6 Final review** | always | the Markdown report. Nothing is applied to automatically. |

## 8. Sponsorship evidence states the prototype must keep distinct (from F3 and decision 3)

**Company level.** These are records about the employer, never about the vacancy.

| State | Meaning | Must not be treated as |
|---|---|---|
| `no-employer-match` | no row matches the company | zero, or a refusal |
| `ambiguous-employer` | more than one plausible row (e.g., name variants) | a merged employer; similar names are never merged silently |
| `matched-blank-fields` | a row matches, but the sponsorship columns are empty | zero |
| `matched-zero-approvals` | a row matches with 0 recorded approvals | proof that the employer refuses sponsorship |
| `matched-with-record` | a row matches with counts | evidence about this vacancy |

**Vacancy level.** These are about this posting's text.

| State | Meaning |
|---|---|
| `explicit-refusal` | a clear, applicable refusal excerpt → G3 |
| `apparent-offer` | an offer-like phrase. The excerpt is surfaced for review; it is not a guarantee. |
| `silent` / `ambiguous-or-conditional` / `contradictory` | unresolved → **awaiting sponsorship evidence** (G5) |

## 9. Failure hypotheses (suggested by Claude; accepted by Aditya as hypotheses to test)

### F1. A vacancy refusal entered as "sponsorship = 0" is not reliably a Skip in the maintained scorer

- **Source-based reasoning (Claude, from `role-scorer.mjs` CONFIG; not executed):** sponsorship is a
  vote (weight 0.35), fit is a vote (0.30), Apply needs composite ≥ 0.30, and Consider spans
  [0.20, 0.30). With sponsorship `p = 0`, tier `None`, and both gates at 1.0, the predicted
  composites are:

  | Fit value (fixture only) | Predicted composite | Predicted label |
  |---|---|---|
  | 0.7 | 0.21 | Consider |
  | 0.9 | 0.27 | Consider |
  | 1.0 | 0.30 | Apply |

  Tier `None` is not in the scorer's soft-sponsorship list, so nothing demotes the Apply.
- **Test F1a (the maintained scorer, separately):** run `npm run score -- <F1 fixture> --out-dir …`
  on the three controlled fit values and record the labels exactly as produced. *Falsified if* all
  three come out Skip.
- **Test F1b (the prototype's protective gate):** the same fixtures, with a refusal excerpt, run
  through the prototype. *Expected:* every one ends at G3 with "skip this application", whatever the
  scorer's label. *Fails if* any refused vacancy is reported as Apply or Consider without the G3
  stop.

### F2. The liveness classifier recognizes "closed" only for wording on its fixed phrase list

- **Proposed wording (Claude, earlier in the discussion):** "We've filled this role" is not on the
  list, so a page with a site-wide Apply button would be classified **active**.
- **Refinement from reading the source, before execution (Claude):**
  - `liveness-browser.mjs` drops apply-like controls inside `nav`, `header`, or `footer`. So a
    strictly site-wide Apply button would not count in the live path.
  - In `liveness-core.mjs`, the paraphrase matches no closed-phrase pattern.
- **Predictions for the pure classifier:**

  | Case | Predicted result |
  |---|---|
  | Recognized phrase ("no longer accepting applications") | `expired` (`expired_body`) |
  | Paraphrase + an apply-labelled control in the page body | `active` |
  | Paraphrase, no apply control, ≥ 300 characters of text | `uncertain` |
  | Paraphrase, no apply control, < 300 characters | `expired` (`insufficient_content`) |
- **Test:** call the exported `classifyLiveness` on fixture snapshots for each case (offline) and
  record the actual outputs. **The paraphrase is not a confirmed defect until execution shows it.**
  If the hypothesis is wrong, that result is kept.

### F3. Without explicit states, "no employer row" or "blank fields" collapses into zero

- **Hypothesis (Claude):** a naive join gives a missing employer, an ambiguous employer, or blank
  fields the same value as zero approvals, and the role then comes out Skip.
- **Test:** one fixture per state in section 8, including a name variant such as
  `"<Company>, Inc."` vs `"<Company>"`. *Expected:*
  - each state is reported by its own name;
  - no sponsorship `p` is produced for `no-employer-match`, `ambiguous-employer`, or
    `matched-blank-fields`;
  - `matched-zero-approvals` is never labeled a refusal;
  - no two employers are merged.

## 10. First-pass limitation prediction (L1)

*Suggested by Claude because Aditya was unsure; accepted by Aditya with narrower wording.*

- **The prototype cannot establish that a vacancy will actually be sponsored.**
- The CSV's sponsorship values are **aggregate counts with unspecified time coverage**. The
  repository READMEs name the source datasets but no covered period. The data README also mentions
  "initial vs. continuing employment", so the counts may include continuing employment; that is
  unverified. They are not called "all-time" totals.
- **Untested expectation, not a finding:** many postings will say nothing about sponsorship and stay
  "awaiting sponsorship evidence". Any measured fraction must state its sample, and it does not
  generalize automatically.
- An apparent offer phrase surfaces its excerpt for review and guarantees nothing. Ambiguous,
  contradictory, or conditional wording stays unresolved.

## 11. Test plan summary

| ID | Kind | Runs | Offline? | Pass condition |
|---|---|---|---|---|
| F1a | hypothesis | maintained scorer on refusal fixtures (fit 0.7 / 0.9 / 1.0) | yes | labels recorded as produced; compared with the prediction |
| F1b | protective gate | prototype on the same fixtures | yes | every refused vacancy stops at G3, "skip this application" |
| F2 | hypothesis | `classifyLiveness` on 4 snapshot fixtures | yes | outputs recorded; the paraphrase is a defect only if observed |
| F3 | hypothesis + contract | prototype on one fixture per evidence state | yes | states stay distinct; no manufactured `p`; no merges |
| T-timing | contract | prototype on a fixture with insufficient timing | yes | reported as not timing-verified, or blocked; never a silent pass |
| T-labels | contract | every output value | yes | labeled `record`, `model-judgment`, or `your-input` (sample) |
| Baseline | demonstration | `npm run ats:liveness` on one public posting | **no** (network) | already run in setup (gh_jid 8635225002, 2026-10-03 17:48 EDT); not part of the test suite |

## 12. Observed evidence limitation (recorded before predictions)

Observed by Claude on 2026-10-03 from the column header of
`data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`:

- The file has **no SOC codes** and **no year-by-year sponsorship detail**.
- Sponsorship is aggregated per company (`Total Approvals`, `Total Denials`, `Approval_Rate`), plus
  a free-text `top_job_titles_sponsored`.
- Free-text sponsored titles do not establish that a company sponsors a specific current vacancy.

## Revisions

- **2026-10-03 (Claude):** this file replaces the setup skeleton committed in `c002f78`, whose
  prediction rows were all "pending". No prediction content existed to preserve.
- **2026-10-03 (Claude):** the F2 refinement above was made from reading the source **before any
  execution**. The original proposed wording is kept beside it.
- **2026-10-03 (Aditya), after reviewing commit `bc9cc4a`:** accepted the revised F2 **as a
  hypothesis to test, not as a verified result**. The original wording and Claude's source-based
  correction stay together in §9; nothing above is rewritten. The F1 assumptions, the F2 test
  design, and his later reason for answer C are added in Update 1 below.

## Update 1 — after Aditya's review (2026-10-03)

*Added after commit `bc9cc4a`. Sections 1–12 above are unchanged.*

### U1.1 Aditya's reason for answer C (supplied later, recorded verbatim)

> "I had initially chosen to apply for situation C because, if it doesn't say anywhere that the
> company does not sponsor, my instinct would be to apply for the job."

This reason was given **after** the discussion, not with the original answer. The original answer
in §2 ("apply", no reason) stays unchanged. The prototype behavior for this case is decision 3
(awaiting sponsorship evidence).

### U1.2 F1: explicit assumptions behind the predicted labels (Claude, source-based; not executed)

The F1 predictions (0.21 Consider / 0.27 Consider / 0.30 Apply) hold **only** under all of these
conditions:

| Assumption | Value used | Why it matters |
|---|---|---|
| Scorer CONFIG | unchanged: sponsorship 0.35, fit 0.30, role_quality 0.0; Apply ≥ 0.30; Consider floor 0.20; gate_zero 0.05; soft tiers `likely`, `possible`, `unknown` | any change moves the bands |
| `--profile` | **not passed** → the scorer sets `needsSponsor = true` | a profile changes `needsSponsor`, which controls the soft-tier demotion |
| `sponsorship` | `{ p: 0, tier: "None", source: "record" }` | `p = 0` contributes nothing. Tier `None` is **not** a soft tier, so an above-threshold composite is **not** demoted. Tier `unknown`/`likely`/`possible` would demote Apply → Consider at fit 1.0. An empty tier would also not demote. |
| `fit` | `p` = 0.7, 0.9, 1.0, labeled `your-input` (controlled fixture values, **not assessments**) | the only positive vote in this test |
| `role_quality` | absent | no vote (weight 0 anyway) |
| `liveness.factor` | 1.0 (fixture control) | a gate ≤ 0.05 forces Skip; other values scale the composite |
| `timeline.factor` | 1.0 (fixture control, **not** a timing claim) | at 0.85 (the book's example value) the same fits give 0.1785 Skip / 0.2295 Consider / 0.255 Consider; below 0.6 the scorer demotes Apply → Consider |
| `override` | absent | the maintained scorer accepts a human `override` with a documented reason; F1a tests the scorer **without** it |
| Boundary | at fit 1.0 the composite is exactly the 0.30 threshold | the predicted Apply depends on an exact `≥` comparison; the observed run decides |

The timeline sensitivity figures above come from plain arithmetic on the scorer's formula, not from a
scorer run.

### U1.3 F2: predicted classifier behavior vs. intended prototype behavior

A predicted `active` on a page that says the role is filled would **expose a limitation of the
maintained classifier**. It is **not** the desired application decision. The tests therefore check
two things separately:

- **(a)** what the maintained `classifyLiveness` actually returns (hypothesis, recorded as observed);
- **(b)** what the prototype does with that result (the intended behavior, which must pass).

**Fixture conditions.** Every fixture is an offline snapshot with these fields:

- `status` = HTTP status;
- `finalUrl` = a fixture posting URL that carries the job id;
- `bodyText`, with stated length and content;
- `applyControls` = labels of apply-like controls **in the page body**. These are the labels the
  browser layer would pass after it drops `nav`/`header`/`footer` controls.

None of the closure sentences below contains any phrase on the classifier's closed-phrase list,
except F2-1, which uses one on purpose.

| ID | status | bodyText | applyControls | (a) Predicted maintained classifier | (b) Intended prototype behavior |
|---|---|---|---|---|---|
| F2-0 control | 200 | ≥ 300 chars of job description; no closure words | `["Apply for this job"]` | `active` / `apply_control_visible` | liveness gate open → continue to the sponsorship states |
| F2-1 recognized | 200 | ≥ 300 chars including "This position is no longer accepting applications." | `[]` | `expired` / `expired_body` | G2 closed → **skip this application**; show the matched phrase |
| F2-2 paraphrase + body apply control | 200 | ≥ 300 chars including "We've filled this role. Thank you for your interest." | `["Apply"]` (e.g., an in-body link to other roles) | `active` / `apply_control_visible` (**predicted limitation**) | **must not** proceed as live: the prototype flags a `liveness-conflict` (closure-like wording in the body vs. `active`), shows the excerpt, and **stops at G2 for a human**. No application recommendation. |
| F2-3 paraphrase, no control | 200 | ≥ 300 chars including the same paraphrase | `[]` | `uncertain` / `no_apply_control` | G2 stop for a human; no application decision |
| F2-4 paraphrase, thin page | 200 | < 300 chars including the same paraphrase | `[]` | `expired` / `insufficient_content` | G2 closed → skip this application, with the reason shown as "thin content", **not** as an explicit closure |
| F2-5 false-positive probe | 200 | ≥ 300 chars of an open posting mentioning e.g. "closed-loop control" | `["Apply for this job"]` | `active` | the conflict check may flag this. If it does, the cost is a human review, never an automatic skip; the observed behavior is recorded. |

**New proposed addition (Claude; Aditya to confirm in the evidence-contract stage):** a
closure-wording check that runs **only** when the maintained classifier says `active`. Its
vocabulary (e.g., "filled", "closed", "no longer", "not accepting") is `[TODO: DEFINE]`. It is a
rule-based **judgment**, not a record:

- it never converts a posting to `expired` on its own;
- it only routes the posting to a human, with the excerpt;
- the maintained classifier is never modified or copied.

**Observed results replace nothing above.** If (a) differs from the prediction, the observation is
recorded beside it and the hypothesis is marked wrong.

## Update 2 — evidence-contract stage (2026-10-03)

*Added after commit `5092c49`. Earlier sections are unchanged.*

- **Decisions (Aditya, via plan questions):**
  - Company approval counts are **never** converted to a tier or score; they are sourced historical
    context.
  - The scenario scoring path requires an explicit `demo_sponsorship_vote` (`your-input` +
    rationale), described as an uncalibrated scenario input.
  - Refusal → G3 skip. Unknown → awaiting evidence. Apparent offer → excerpt for human review, with
    no automatic score.
  - Refusals reach the maintained scorer only in the isolated F1 characterization.
  - Closure-wording check: included.
  - Networking suggestions: none in v1.
  - Timing: reported as unverified; a missing timeline input is blocked.
- **Adopted at plan approval, not separately confirmed by Aditya:** when a scenario vote is present
  but the posting is silent or not captured, the decision stays
  `seek-vacancy-sponsorship-evidence`, with the scenario label shown beside it. It is tracked as an
  APPROVE item in the recipe.
- **Fixture label correction (Claude):** U1.2 listed the F1 sponsorship input as
  `source: "record"`. The F1 fixture labels its controlled values `your-input`, because they are
  fixture controls, not records. Source labels do not enter the scorer's arithmetic, so the F1
  prediction is unaffected.

## Update 3 — approval of the scenario-precedence rule (Aditya, 2026-10-03)

Aditya's approval, verbatim:

> "I approve the remaining rule: when a posting is silent about sponsorship, the actionable result
> remains “seek sponsorship evidence.” A demonstration score may appear separately as a clearly
> labeled hypothetical scenario, but it must not override that result or imply verified
> eligibility."

This closes the recipe's APPROVE item, which had been adopted as a default at plan approval.

## Update 4 — observed results (2026-10-03; the predictions above are unchanged)

| Hypothesis | Observed | Evidence |
|---|---|---|
| F1a (maintained scorer, refusal entered as p 0, gates 1.0) | Consider 0.21 / Consider 0.27 / **Apply 0.30**: matched the prediction | 29 |
| F1b (prototype refusal gate) | all refused roles skip at G3 and are never scored. A deliberate break of the gate was caught (test 7; tests 7 and 18 after the second guard). | 30–30c, 36, 37 |
| F2(a) (maintained classifier) | all 6 fixtures matched the prediction. F2-2 ("We've filled this role" + body Apply) → `active`: **limitation observed** | 29 |
| F2(b) (prototype) | F2-2 → `liveness-conflict` → human review; F2-5 false positive → human review, never skip | 30–30c |
| F3 (company evidence states) | all 7 states distinct as expected; blank stays null; zero is not a refusal; no merges | 27, 30–30c |
| L1 (limitation) | holds: the one real posting ends at "seek evidence" because its sponsorship text was not captured; no vacancy-level sponsorship was established | 31c, 39, 43 |

All predictions were source-derived, so matches mainly confirm the source reading. Nothing above
measures how well the rules handle real postings.
