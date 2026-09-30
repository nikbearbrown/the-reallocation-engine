---
status: SPECIFIED
todos_open: 0
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# ml-newgrad-sponsor-match — role-level H-1B evidence for new-grad ML/AI engineers

## Executive summary

**What it does.** It takes a list of job postings a student wants to pursue and, for each one, checks
the public work-visa sponsorship record of the company. The question is not whether the company has
ever sponsored anyone. It is whether its record includes machine-learning or AI job titles with no
seniority or level word attached, the closest the record gets to "someone like me". It also checks
that the posting is still live and that the student gave a timeline. It then hands the fully checked
roles to the engine's existing scorer and suggests how to spend the time: tailor an application,
network first, consider later, skip, or resolve a problem first.

**Who it is for.** An international master's student on an F-1 visa, graduating in December 2026, who
wants a new-grad ML/AI engineering job and will need an employer willing to sponsor an H-1B. After
graduation, OPT allows only 90 days of unemployment, so every week spent on the wrong employers costs
real time.

**What it decides, and what it does not.** It decides nothing on its own. It marks every value as
either read from a record or supplied by the person. It holds back any role whose evidence it cannot
check, and says exactly why. It stops before any application, message or tailoring, so the person
makes each decision. On the engine's own data, only 27 of 30,369 companies have a record with such a
title and at least ten approvals.

Two customers: this file is for the agent. `recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.card.md`
is for the person.

**Handoff condition (done when).** A run is complete when:
- the prototype exits 0;
- `sponsor-match-log.json` and `sponsor-match-report.md` exist in the run folder;
- every role in the queue appears in the log exactly once, either `held` with one reason code or `ready`
  with a scorer result;
- `roles.json` contains exactly the `ready` roles, each with explicit `liveness` and `timeline`
  factors and a `source` label on every term;
- the scorer's `role-scores.json` reports `profile_needs_sponsorship: true`.

"The report looks right" is not the condition. The counts and invariants are.

## Required reads

Read in this order before running:

1. `SNICKERDOODLE.md` for gates, provenance and lifecycle, then `DOMAIN.md` for the layout and known gaps.
2. `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-join-validation-audit.md`. It covers the file this
   recipe reads, 30,369 rows of which 1,557 carry H-1B fields, and notes that the join's false-positive rate
   cannot be measured locally.
3. `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (tiers; "Unknown is not Avoid"),
   `book/chapters/10-the-visa-timeline-manager.md` (the timeline gate) and
   `book/chapters/11-the-bayesian-role-scorer.md` (the scorer).
4. This recipe, its card, and the latest rules audit (Workflow step 2).

## The situation, precisely

| | This recipe | Not this recipe |
|---|---|---|
| Person | international master's student, F-1, graduating December 2026, needs H-1B sponsorship later | U.S. citizens and permanent residents (the scorer sets their sponsorship weight to 0) |
| Roles | new-grad ML/AI engineering: machine-learning engineer, AI engineer, applied ML, NLP / computer-vision / LLM engineer | senior roles; non-ML roles; product, sales or developer-relations roles with "AI" in the title |
| Clock | 90 days of allowed OPT unemployment after graduation; STEM OPT only if the school's DSO confirms eligibility | cap-exempt employers (universities, nonprofits); the recipe does not model them |
| Worked runs | the fictional persona `search/examples/priya-nair/profile.yml` (F-1, AI/ML engineer target, `needs_sponsorship: true`) | any real person's profile, résumé or dates |

## Purpose and source inventory

| Source | Path | Label | Used for |
|---|---|---|---|
| Sponsorship file (80 Days to Stay) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, SHA-256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270` | record | approvals, denials, approval rate, company median salary, top sponsored titles. The phone and executive-name columns are never read into outputs |
| Its audits | `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` (same SHA-256), `…-join-validation-audit.md`, `…-entity-resolution-readiness-audit.md` | record | coverage and join limits |
| Title and tier rules | `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json` (rules v0.2.0) | your-input | what counts as ML/AI, as senior, as a level marker; the Proven threshold; the tier-to-p mapping; allowed live hosts |
| Role queue | a JSON file the person writes (format in the prototype README); sample: `…/fixtures/sample-roles.json` | your-input | company, title, URL, fit, timeline, optional row choice or override |
| Persona | `search/examples/priya-nair/profile.yml` (fictional) | your-input | only `needs_sponsorship: true`, which must be explicit |
| Company-name rule | `scripts/sec/entity-resolution.py` → `normalize_company_name` (imported) | stored script | exact normalized-name match |
| Liveness | `scripts/ats/liveness-core.mjs` → `classifyLiveness` (saved pages), `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`, live) | stored script | the liveness gate |
| Scorer | `scripts/score/role-scorer.mjs` (`npm run score`) through its CLI | stored script | votes × gates → Apply / Consider / Skip |
| Prototype | `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py`, `node_bridge.mjs` | stored script | this recipe's steps |

Commands, verbatim, from the repo root:

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --audit-rules --out-dir output/sukethrp-ml-newgrad-sponsor-match/rules-audit
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles <queue.json> --out-dir course/2026fa/submissions/<handle>/runs/<name> --live
python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
node scripts/conformance.mjs scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/
```

## Phase gates

Run-level gates stop the whole run. Per-role gates run in the order shown, and a role stops at the first
one it fails. A failed per-role gate **holds** the role: it is reported with one reason code, never sent
to the scorer, and never given a guessed value.

| Gate | Testable condition (paths that exist) | Pass | Fail | What a person needs to clear it |
|---|---|---|---|---|
| **G1 Source** (run) | SHA-256 of the sponsorship file equals `rules.json` → `source.sha256`. A different file needs an explicit `--csv-sha256` | continue | stop, exit 2 | read the new file's audit, then pin its hash on purpose |
| **G2 Input** (run) | the queue parses. Every role has `role_id`, `company`, `title`, `url`. `fit.p` and `timeline.factor` are in [0, 1] with a reason. The persona is under `search/examples/` and says `needs_sponsorship: true`. The output folder is inside this contribution's namespaces | continue | stop, exit 2, with every problem listed | a corrected queue or persona |
| **G3 Company match** (role) | exactly one CSV row has the posting's normalized company name, or the person gave `csv_row` | tiered next | hold `no-company-match` / `ambiguous-company-match` (candidates listed) / `csv-row-not-found` | the right row number, chosen by the person (labeled your-input) |
| **G4 Sponsorship record** (role) | the row has H-1B fields, approvals > 0, a parseable title list, and a record not shared value for value with a differently named row | tier Proven or Likely | hold `no-h1b-record` / `no-approvals-on-record` / `unparseable-sponsored-titles` / `shared-h1b-record` (tier Unknown; **never** Avoid) | an external check of public H-1B/LCA records, or a recruiter's answer. For a shared record, `shared_record_checked` + reason |
| **G5 Timeline** (role) | `timeline.factor` given, with a reason | continue | hold `no-timeline-factor`. The scorer is never allowed to default it to 1.0 | the person's own factor and why |
| **G6 Liveness** (role) | the posting classified `active` or `expired` by `classifyLiveness` (saved page) or `check-liveness.mjs` (live), dated within 7 days of the run date. Live mode fetches only hosts in `rules.json`. It first makes one request with redirects off, because many Greenhouse boards forward postings to the company's own site and the engine's checker would follow them | `active` → factor 1.0; `expired` → factor 0.0 (the scorer closes the gate → Skip) | hold `liveness-uncertain` / `liveness-unchecked` / `stale-liveness` / `host-not-allowed` / `redirects-off-allowed-host` / `liveness-check-failed` / `liveness-date-after-run-date` | open the posting yourself, or re-run with `--live` |
| **G7 Scorer contract** (run) | the scorer exits 0; `role-scores.json` parses; it has exactly the roles sent; `profile_needs_sponsorship` is `true`; every term keeps the label it was sent with | continue | **run void**, exit 1: log `status: void`, report headed VOID, no next actions | fix the input or the scorer, then re-run |
| **G8 Human decision** (run) | the report's decision table has a decision, reason, name and date for every role | the person acts | the recipe stops here by design | the person's own judgment |

## Workflow

1. Confirm the toolchain: `npm install`, `npm run doctor`, `npm run verify`.
2. Audit the rules before trusting them:
   `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --audit-rules --out-dir output/sukethrp-ml-newgrad-sponsor-match/rules-audit`.
   A person reads `rules-audit.md`, especially the list of ML/AI titles with no marker (they create
   Proven) and the shared-record table. If a title is wrongly classified, change `rules.json`, raise its
   `rules_version`, and re-audit.
3. Run the sample (offline): `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py`.
   Expected on the pinned file: 11 roles → held 6, scored 5 (Apply 1, Consider 3, Skip 1).
4. Run the tests (offline): `python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v`.
5. Write a queue from real postings. Check each against the persona's situation, not a real person's.
   Run it live:
   `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles <queue.json> --out-dir course/2026fa/submissions/<handle>/runs/<name> --live`
   (needs `npx playwright install chromium` once).
6. For every held role, do the check the report names. Record the result in the queue (`csv_row`,
   `shared_record_checked`, a timeline factor) and re-run. Never edit the sponsorship file.
7. The person fills in the decision table (gate G8).
8. Log the run in `logs/runs/<term>-<handle>-<n>.md` using the template below. Never edit `logs/RUN_LOG.md`.

## What it can and cannot verify

**Read from a record (`record`).** It can verify:
- that a company with this exact normalized name is in the sponsorship file, and which row;
- that row's H-1B approvals, denials, approval rate, company-wide median salary, and its short list of
  top sponsored titles;
- that the file is byte-identical to the one its audits describe (SHA-256);
- what the engine's liveness classifier concluded about a posting, at the moment it was checked live, or
  from saved terminal output that names the URL.

**Computed from a record by your declared rules (`your-input`).** A value computed from other values
carries the weakest label among them, so these are your-input:
- which sponsored titles count as ML/AI, which carry a seniority or level marker, and so the tier;
- the tier's number for the scorer (Proven 0.9, Likely 0.6, taken from the Chapter 11 worked example);
- the scorer's composite and recommendation, because fit, timeline and the tier's number are yours.

**Cannot verify.** Items 1–7 are printed in every report's "could not verify" list. Items 8 and 9 are
limits of the recipe's inputs, stated here and in the card. They are not yet in the report (a next change):
1. **When** the sponsorship happened. The file has no filing years, so a matching title may be years old.
2. **Level.** A title with no seniority or level word is not proof of an entry-level hire.
3. **Completeness.** The title list is a short "top titles" field (867 companies list exactly one title),
   so a missing ML/AI title does not prove that none was sponsored.
4. **Identity.** An exact name match can still be a different employer. For example, "Meta" matches
   `META CO`, Portola Valley, CA. The join has no published error rate, and 69 companies carry a record
   identical to a differently named company's.
5. **Now.** Whether this company will sponsor this role this year.
6. **Fit and timeline.** These are the person's ratings, not measurements.
7. **Law.** OPT, STEM OPT and cap-gap eligibility belong to the DSO or an attorney.
8. **Evidence files.** A recorded liveness result is labeled `record` only if its saved terminal output
   names the URL. The recipe cannot tell whether that file was edited by hand.
9. **The posting's own requirements.** The recipe reads the posting's title, never its description, so
   it cannot see years-of-experience requirements, an explicit "not for new graduates", or a talent pool
   presented as an opening. Worked run 3's review of eight postings whose titles carried no seniority
   word found six asking for 2–12+ years or excluding new graduates. A person must read the posting
   before rating fit.

No model is called anywhere in this recipe, so no value is `model-judgment`. If a later version adds
one, it must be labeled.

## Output contract

**Agent log:** `<out>/sponsor-match-log.json`. It holds `workflow`, `recipe`, `recipe_version`, `run_id`,
`status` (`complete` | `void`), `mode` (`sample` | `live`), `as_of`, `generated_at`, `labels`,
`inputs` (paths and SHA-256 of queue, rules and persona), `source` (file, SHA-256, pinned?, rows, audit,
columns read), `liveness_run` (mode, snapshots classified, live URLs, command, exit code, stdout),
`scorer` (command, exit code, stdout, stderr), `roles[]`, `cannot_verify[]`, `summary`, `outputs`, and
`stop` when void. Each `roles[]` entry holds `role_id`, labeled posting fields, `company_match`,
`sponsorship` (every value `{value, source, …provenance}`), `timeline`, `liveness`, `fit`, `gates[]`,
`status`, `hold_reason`, `flags[]`, `scorer` (composite, recommendation, machine recommendation,
reason, override, full trace) and `next_action`.

**Human report:** `<out>/sponsor-match-report.md`.
- **Reader:** the student deciding where this week's application and networking hours go.
- **Decision enabled:** which roles get an application, which need a networking question first, which
  are dropped, and which need a check before anything else.
- **Sections:** Executive summary · What to do next (by action) · Evidence per posting (labels shown) ·
  What this run could not verify · Your decision (blank table: decision, reason, name, date) · Run record.

**Scorer files:** `<out>/roles.json` (input shaped like `data/examples/ch11-roles.json`) and the scorer's
unchanged `role-scores.json` and `role-scores.md`. Outputs never land on a tracked engine file. Inside
the repo, the prototype writes only to `output/`, `course/2026fa/submissions/sukethrp/` or its own folder,
and refuses to overwrite an earlier run in `course/` without `--overwrite`.

## Next action per result: where the 3-3-2 hours go

| Result | Next action | Where the time goes |
|---|---|---|
| scorer Apply (tier Proven, every gate open) | **TAILOR**: research and tailor an application; ask the recruiter about sponsorship early | the **2** (research-and-apply) hours |
| scorer Consider with tier Likely | **NETWORK-FIRST**: ask someone inside before applying. The report drafts the question from the record (e.g. "these ML/AI titles all carry a seniority marker; has the team sponsored a new grad?") | the **3** networking hours; it turns a blind application into an informational conversation |
| scorer Consider with tier Proven (soft timeline, or the Consider band) | **CONSIDER**: only after the TAILOR list is done | the leftover of the **2** |
| scorer Skip (closed gate or low composite) | **SKIP**: no time at all | returned to networking and credibility |
| held at a gate | **RESOLVE**: the one check the report names | minutes, not an application |
| a person's override with a reason | the override's action, labeled as the person's call | as above |

## Stop conditions

- G1 or G2 fails: stop, exit 2, and write nothing.
- The scorer exits non-zero or breaks the contract (G7): the run is void. Exit 1, a void log and report,
  and no next actions.
- Refuse, and do not work around it, when asked to:
  - match company names fuzzily;
  - treat an Unknown or a held role as Avoid or Skip;
  - pass free-text visa status to the scorer, which reads "work authorized" as "no sponsorship needed";
  - let a missing gate default to open;
  - read `private/`, `search/resume.json` or any real profile;
  - fetch a host that `rules.json` does not name;
  - re-implement or copy the scorer;
  - edit the sponsorship file;
  - drop held roles from the report.

## Facts that bite, and how this recipe handles each

| Fact (assignment list, then found while building) | Applies? | How it is handled |
|---|---|---|
| 1. Role quality carries zero weight | no | the recipe sends no role-quality term, so no decision pretends that wage or O\*NET data moved it |
| 2. `bls:local-wage` feeds nothing | no | not used |
| 3. Only SEC samples ship | yes, as a reason not to use them | Form D is not used. Only 15 of 200 sample filings join the sponsorship file, and one company among them has H-1B history |
| 4. Planned directories do not exist | yes | every gate tests a path that exists. Outputs go to `output/` or `course/2026fa/submissions/<handle>/` |
| 5. The `snickerdoodle` CLI is roadmap | yes | no `snickerdoodle` command appears. Every command above runs today |
| 6. Every top-level recipe is DRAFT | noted | this recipe claims only the stage its evidence supports (see Lifecycle) |
| 7. `bls:local-wage` fails on a fresh clone | no | not used |
| 8. `validate-h1b-join-sample.py` needs full data | yes | not run. The join limits come from the shipped audits instead |
| Found: the scorer exports nothing, though `CONTRIBUTING.md` says harnesses import it | yes | the scorer runs through its CLI and its `role-scores.json` is read |
| Found: missing gates score as open (1.0) | yes | G5 and G6 hold instead, and `roles.json` always carries both gates |
| Found: `applyProfile` treats "authorized" as "no sponsorship needed" | yes | no profile is sent; G7 voids a run whose scorer says otherwise (the break test reproduces it) |
| Found: identical H-1B records on differently named companies | yes | G4 holds `shared-h1b-record` and names the other companies |
| Found: `npm run ats:scan -- --dry-run` fails without `data/ats/portals.yml` | for discovery only | the worked run points the scanner at its own config with `REALLOCATION_ENGINE_PORTALS`. The prototype does not call the scanner |
| Found: Greenhouse boards often 302-redirect a posting to the company's own careers site | yes | a no-redirect first hop holds `redirects-off-allowed-host` and names the target, instead of silently contacting an unnamed host |
| Found (worked run 3): titles with no seniority word still hide 2–12+ year requirements and new-grad exclusions | yes, not automated | listed under "cannot verify" (item 9). Fit stays the person's rating after reading the posting. An automated check is a typed proposal in `PROPOSED-ADDITIONS.md` |

## Proposed additions

**Closed in this version** (DEV items; closure evidence = script exists + conformance passes + handoff condition met):

| Addition | Why it belongs in the engine | Closure evidence |
|---|---|---|
| Role-level title matcher and rules audit | Chapter 7's decision tree says "verify role type matches filing history" after a tier; no script did | `sponsor_match.py` (`classify_title`, `sponsorship_evidence`, `--audit-rules`); `TitleRules` tests; `course/2026fa/submissions/sukethrp/evidence/rules-audit-v0.1.0/` and `rules-audit-v0.2.0/` |
| Fail-closed gate builder | the scorer treats a missing gate as open | `evaluate_role`, `liveness_stage`; tests `test_gates_reach_the_scorer_explicitly`, `test_held_roles_never_reach_the_scorer` |
| Scorer-contract check | a sponsorship-needing persona can be silently scored as not needing it | `contract_problems`; test `test_authorization_text_that_zeroes_sponsorship_voids_the_run` |
| Shared-record hold | a lookalike's sponsorship history can arrive through the join | `lookalikes`; tests `test_a_record_shared_with_a_lookalike_is_held_until_a_person_checks_it`, `test_same_name_duplicates_are_not_called_lookalikes` |
| Redirect pre-check for live liveness | the engine's checker follows redirects to hosts a recipe never named | `first_hop`, `liveness_stage`; tests in `RedirectPreCheck` (network replaced by stubs) |

Conformance: `node scripts/conformance.mjs scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/` passes.
Handoff: the sample run meets the handoff condition above.

**Not in this version.** Filing-year recency, SOC-level matching, a brand-to-legal-name alias table,
computing the timeline factor from OPT dates, and checking a posting's stated requirements are proposed,
typed and justified in
`course/2026fa/submissions/sukethrp/PROPOSED-ADDITIONS.md`. They are deliberately not open items of this
recipe. None is needed for the steps above to run, and an open item here would return the recipe to
DRAFT under the lifecycle rules.

## Lifecycle

- DRAFT → SPECIFIED: zero open items; the closures and their evidence are in the table above.
- SPECIFIED → RUNNABLE-SAMPLE requires three things:
  - the full sample run completes (Workflow step 3);
  - conformance passes;
  - the audits are generated **and read by a person**, recorded in a `logs/runs/` entry.

  The status moves to RUNNABLE-SAMPLE only when that reading is recorded, and `last_gate` then names who
  read what, and when.
- This recipe does not claim RUNNABLE-LIVE or VERIFIED, and `attestation` stays null.

## Verification checks

- Conformance, as above. Tests: all pass offline, and every run sets `SPONSOR_MATCH_FORBID_NETWORK=1`.
- Sample expectations (Workflow step 3) reproduce on the pinned file.
- By hand: pick any `record` value in a report, open the named row of the sponsorship file, and compare
  the approvals and the title list.
- Break attempts, each expected to hold or stop, never to guess:
  - a free-text "work authorized" profile;
  - a posting on an unlisted host in live mode;
  - a wrong source hash;
  - a persona without `needs_sponsorship`.

## Logging rules and run-log template

Log every real run in `logs/runs/<term>-<handle>-<n>.md`. Never log `private/`, real contact details or
application notes.

```markdown
# <term>-<handle>-<n> — ml-newgrad-sponsor-match run

## Executive summary
<two or three plain sentences: what was run, on what, what it found, what a person still has to decide>

## Run record
- **Date / run id:** YYYY-MM-DD · <run_id from the log>
- **Recipe:** recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md v<recipe_version> · rules v<rules_version>
- **Mode:** sample | live · **as_of:** YYYY-MM-DD
- **Inputs:** queue <path> (sha256 <12 chars>) · persona <fictional persona path> · sponsorship file sha256 <hash> (pinned: yes/no)
- **Command:** <exact command>
- **Outputs:** <run folder>/sponsor-match-report.md, sponsor-match-log.json, roles.json, role-scores.json, role-scores.md
- **Result:** evaluated N · held H (by reason) · scored S (Apply a · Consider c · Skip s) · actions <counts>
- **Gates:** G1 <pass> · G2 <pass> · G7 <pass/void> · G8 <open / cleared by <name> on <date>>
- **Audits read:** <which audit, by whom, when>
- **Open issues:** <held roles still unresolved; anything that did not work>
```
