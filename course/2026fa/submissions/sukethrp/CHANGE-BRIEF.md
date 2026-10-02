# CHANGE-BRIEF — role-level sponsor match for new-grad ML/AI engineers on F-1

## Executive summary

This is the plan and set of predictions for a new recipe, written before any prototype code
existed. Read it next to the test report and the worked run: the gap between what was predicted
here and what actually happened is the point of the exercise.

The recipe answers one question a new graduate cannot easily answer from outside a company:
*"This company has sponsored work visas, but has it ever sponsored someone in my kind of role, at
my level?"* The shipped sponsorship data lists the job titles each company sponsored. Most of those
titles are senior. The recipe checks the titles against the student's role family and level, keeps
every number traceable to its source, and hands anything it cannot verify back to a person instead
of guessing.

**Authorship.** Drafted by Claude Code (AI assistant) on 2026-09-29, from Claude's reading of the
repository and a first-pass profile of its data, before the prototype existed. The situation and
the recipe direction were chosen by the student. Student review of these predictions: ~~*pending*~~
written 2026-10-02, at the end of Revisions.
The original predictions below are not to be edited. Later revisions go in *Revisions* at the end,
dated.

---

## 1. The situation this is built for

An international master's student on F-1 status, graduating December 2026, looking for
**new-grad ML/AI engineer roles** (machine-learning engineer, AI engineer, applied ML, LLM /
generative-AI engineer). Post-completion OPT starts after graduation, with a 90-day unemployment
allowance. A STEM OPT extension may come later, which is the school's DSO's call and not this
recipe's. The student needs an employer that will sponsor an H-1B, so sponsorship evidence is a
binding constraint, not a nice-to-have.

What this student cannot easily see: a company-level "sponsors H-1Bs" label says nothing about
*which roles* were sponsored. In the engine's own sponsorship file, 622 of the 1,557 companies with
any H-1B record (40%) list **only senior-marked titles**. *These counts are Claude's first pass with
a draft regex. The prototype's declared rules produce the authoritative numbers.* A new grad who
reads "sponsor" as "sponsors new grads like me" can spend a week of applications on employers whose
record never included anyone at their level.

**Engine layers used**

| Layer | Used for | Paths |
|---|---|---|
| 80 Days to Stay | the sponsorship evidence (the recipe's one signal) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (SHA-256 `eccdee2a…6270`, identical to the file the audits in `data/80-days-to-stay/data/` describe) |
| Job-Ops | the liveness gate | `scripts/ats/liveness-core.mjs` (`classifyLiveness`), `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) |
| Scorer (Ch. 11) | combining votes and gates into Apply / Consider / Skip | `scripts/score/role-scorer.mjs` via its CLI (`npm run score -- <roles.json> --out-dir <dir>`) |

Not used, on purpose. **SEC Form D samples:** only 15 of the 200 shipped sample filings join to the
sponsorship file by normalized name. Only one company among them has any H-1B history, and it
appears in two of those filings. So funding cannot carry weight here. **BLS / O\*NET role quality:** the scorer weights it at 0.0, so this recipe
leaves the term out rather than pretending it moves a decision.

## 2. What is reused, and what is proposed

**Reused as-is (exact paths)**

- `scripts/sec/entity-resolution.py` → `normalize_company_name` (imported, not copied) for the
  company-name match.
- `scripts/ats/liveness-core.mjs` → `classifyLiveness` for saved posting snapshots. In live mode,
  `scripts/ats/check-liveness.mjs` does the check.
- `scripts/score/role-scorer.mjs` through its CLI. The file exports nothing and runs on import,
  although `CONTRIBUTING.md` says harnesses can import `scoreRole`. So the prototype writes a
  `roles.json` shaped like `data/examples/ch11-roles.json` and reads the scorer's `role-scores.json`.
- `search/examples/priya-nair/profile.yml`, the fictional persona closest to this situation (F-1,
  AI/ML engineer target, explicit `needs_sponsorship: true`). No real personal data is used anywhere.
- `js-yaml` (already a dependency) to read the persona.

**Proposed. None of this is in the repo today.**

1. **A role-level sponsorship match.** It classifies each company's sponsored titles by role family
   (ML/AI) and level (senior-marked or not), and maps the result to the tiers the book already uses
   (Proven / Likely / Unknown). It belongs because Chapter 7's decision tree says *"verify role type
   matches filing history"* after a tier is assigned, and no script does that step.
2. **A fail-closed input builder for the scorer.** The scorer treats a missing liveness or timeline
   gate as 1.0 (fully open). The prototype holds any role whose gate it cannot fill, and never sends
   it to the scorer with a gate left out. It belongs because a missing gate currently scores as a
   healthy one.
3. **A scorer-contract check.** After scoring, the run stops if the scorer reports
   `profile_needs_sponsorship: false` for a persona that explicitly needs sponsorship. It belongs
   because `applyProfile` reads only a free-text `authorization` field whose regex includes
   `authorized`, so "F-1 STEM OPT — work authorized (EAD)" zeroes the sponsorship weight.
   `search/examples/README.md` says a PR #37 fixed this, but the scorer on `main` does not read
   `needs_sponsorship`. *Not yet reproduced by running it; the prototype's break test will do that.*

**Named as typed TODOs, not built:** filing-year recency (the CSV has no dates), SOC-level matching
(the CSV has no SOC column), a brand-to-legal-name alias table (for "Meta" vs. "Meta Platforms"), and
computing the timeline factor from OPT dates (the Chapter 10 feed).

## 3. Gates: where the recipe stops, and what a person needs to see

| Gate | Stops when | What a human needs to see to clear it |
|---|---|---|
| Source | the sponsorship file's SHA-256 is not the audited one | the new file's audit, re-read; then an explicit acceptance of the new hash |
| Input | the role list or persona is missing a required field, or the persona does not state `needs_sponsorship` explicitly | a corrected input file |
| Company match (per role) | the posting's company does not resolve to exactly one row by exact normalized name | the exact spelling of the company as it appears in the file, supplied by the person (no fuzzy guess) |
| Sponsorship record (per role) | the matched row has no H-1B record | nothing the data can give. *Unknown is not Avoid*: the person checks public H-1B/LCA records or asks the recruiter, then decides |
| Liveness (per role) | the posting is not confirmed `active` (uncertain or unchecked). `expired` goes to the scorer as a closed gate | a same-week liveness check, or the person opening the posting |
| Timeline (per role) | no timeline factor was supplied | the person's own factor and the reason for it (this recipe does not compute it) |
| Scorer contract | the scorer's output does not parse, is missing a role, or reports that the persona does not need sponsorship | a fixed input or a fixed scorer. The run is void until then |
| Human decision | always. The recipe never applies, messages or tailors anything | the person writes a decision, a reason, their name and a date for each role before spending effort |

## 4. Predicted failure cases, and how each will be checked

1. **A company missing from the file.** The posting uses a brand name ("Meta") but the file holds
   the legal name ("META PLATFORMS INC"), or the company is outside the six states the file covers.
   *Prediction:* the prototype holds it at the company-match gate and assigns no tier.
   *Check:* a fixture role for a fictional company absent from the fixture file, plus at least one
   real name variant in the worked run.
2. **A company in the file with no H-1B record** (94.9% of rows). *Prediction:* the tier is
   Unknown, the role is held, and it is never scored as a non-sponsor. *Check:* a fixture row with
   empty H-1B fields.
3. **Two rows that normalize to the same name** (212 such names in the file, by Claude's first-pass
   count). *Prediction:* the role is held as ambiguous and no row is picked. *Check:* a fixture with
   two rows sharing a normalized name.
4. **A posting that 404s.** *Prediction:* liveness is `expired`, the scorer receives a closed gate,
   and the result is Skip regardless of sponsorship. *Check:* a saved snapshot with HTTP 404, run
   through the real `classifyLiveness`.
5. **The authorization-text trap.** *Prediction:* passing the scorer a profile whose text contains
   "work authorized" makes it drop sponsorship to weight 0, and the prototype's contract gate stops
   the run. *Check:* a `BROKEN-` fixture profile, used only in the break test.

## 5. Predictions about the first pass

1. **The title rules will over-count "entry-level" matches.** A title without a seniority marker
   (for example "Machine Learning Engineer") is not evidence of a junior role. The first pass will
   also count at least one non-engineering title as ML/AI because it contains "AI" (for example an
   "AI Sales Engineer").
2. **At least one third of real postings in the worked run will stop at the company-match gate,**
   because job boards use brand names and the file uses legal names, and this recipe refuses fuzzy
   matching.
3. **Most matched roles will land in Likely, not Proven** (Consider rather than Apply), because ML/AI
   titles are rare in the sponsored-title lists and senior titles dominate. The recipe's most common
   next action will therefore be "network first", not "apply".
4. **The first draft will report the skip rate only over scored roles.** That hides held roles, which
   are neither skipped nor decided.

## Revisions

*Add dated entries here; do not edit the sections above.*

### 2026-09-30 — outcomes against the predictions (written by Claude Code after the runs; student review pending)

| Prediction | What happened | Verdict |
|---|---|---|
| §4.1 company missing from the file | Sample: "Instacart" matched nothing (the file's name is MAPLEBEAR INC). Live: Scale AI, Anthropic and OpenAI matched nothing. A variant not predicted: "Meta" matched an **unrelated** META CO (Portola Valley, CA) exactly | confirmed, plus a worse variant (a wrong-entity exact match) |
| §4.2 in the file, no H-1B record → Unknown | Hugging Face, and Meta → META CO, held `no-h1b-record` | confirmed |
| §4.3 two rows, one normalized name | Peloton INC / LLC held with both candidates | confirmed. Not predicted: 42 records copied onto **differently named** lookalikes (PathAI / PathrAI), which led to a new gate |
| §4.4 a posting that 404s | Only on a saved fixture page; no real posting in the live queue was expired | confirmed on the fixture only |
| §4.5 the "work authorized" trap | reproduced: sponsorship weight 0, and the run is void (exit 1) | confirmed |
| §5.1 over-counting entry level; an "AI" non-engineering title | The v0.1.0 audit counted "AI DEVELOPER ADVOCATE", "Founding ML Engineer" and II/L2 titles as entry-level ML evidence. Rules v0.2.0 fixed them (Proven 33 → 27) | confirmed |
| §5.2 at least a third of real postings stop at the company match | 3 of 8 did (Scale AI, Anthropic, OpenAI). The cause was not brand vs. legal name, though: these employers are absent, and the only rows with their names are investment funds | confirmed in count; wrong about the cause |
| §5.3 most matched roles land in Likely | Live queue: 2 Proven, 2 Likely, 1 held. Hand-picking across tiers makes this an unfair test. Across the whole file, Likely outnumbers Proven 1,525 to 27 | not tested fairly by the worked run |
| §5.4 the first draft reports the skip rate only over scored roles | Did not happen. Writing it in this brief led the first draft to report both rates | refuted, because the prediction itself changed the build |
| *(not predicted)* | Greenhouse boards redirect postings to company sites, which led to a new hold. The report mis-described a shared record. A test decorator tripped the history privacy scan | see `TEST-REPORT.md` → "Broke during testing, fixed" |

### 2026-09-30 UTC — Codex review after reading the postings; student acceptance pending

The original predictions remain above unchanged. Codex disagrees with treating the earlier AppLovin TAILOR result as ready for action: the posting requires four-plus years of production ML work and gives no confirmed start date. Moloco seeks roughly five to twelve-plus years through a talent pool. Databricks explicitly excludes new graduates. These requirements expose an additional failure mode: a successful historical title match does not establish present applicant eligibility.

After withdrawing unsupported fit and timeline scorer inputs, worked run 3 produces eight RESOLVE results and zero scored roles. This does not refute the historical title-tier counts. It shows that the original input assumptions made the queue look more actionable than the evidence supports. The prediction that networking would be the most common next action is not supported by this reviewed queue; resolving missing evidence dominates.

Proposed next change: a requirements review and talent-pool flag before scoring. No new code or threshold was added in this follow-up. This note is Codex’s analysis, not a statement of student disagreement or a retroactive pre-build prediction.

### 2026-10-02 — the student's review of the predictions

*Written by the student and placed here verbatim. It answers the "student review pending" notes on the two
revisions above.*

The predictions held up partly: title-rule overcounting and missing-company holds occurred, but the reviewed queue required more evidence resolution than the predicted networking activity, and the first report avoided the predicted skip-rate problem by reporting both denominators.
