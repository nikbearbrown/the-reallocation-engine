---
status: RUNNABLE-SAMPLE
todos_open: 6
last_gate: "sample-run adequacy, 2026-10-02, Shyam Gopalakrishnan, logs/runs/2026fa-contactshyam14-code-1.md#2026-10-02--shyams-review-and-sign-off"
# last_gate: Shyam re-ran the tests and the tool himself (runs/06-shyam-check), read the report,
#   spot-checked IEX Group against the CSV, and confirmed three job boards; the earlier runs were by Claude.
attestation: null
# attestation: set only at VERIFIED; this recipe has had no live gated run
recipe_version: 0.1.0
---

# em-network-targets — "network, don't apply" for an Engineering Management graduate on 12-month OPT

## Executive summary

**What it does.** Finds companies whose public visa record shows they have sponsored project-management or production-management job titles, checks whether a matching job is open at each one right now, and sorts them into four groups: *network first* (they sponsor this kind of role but nothing matching is open — ask for an informational conversation before the role exists), *apply* (a matching job is open), *check the job board first* (no usable check yet), and *skip*.

**Who it is for.** A master's graduate in engineering management whose twelve-month post-completion OPT starts on 2026-12-31 and runs to about 2027-12-30 (no STEM extension claimed), targeting project-management and industrial-production-management roles and needing an employer who will sponsor an H-1B.

**What it decides — and what it doesn't.** It decides nothing on its own. The repository's existing role scorer makes every Apply / Consider / Skip call; this recipe builds the scorer's input from checked records and sorts the scorer's verdicts into next actions. Two decisions stay with the person: which visa path the OPT window actually allows — which H-1B registration falls inside it, and what happens if it isn't selected (asked of the school's international-student office before any application is tailored), and whether a sponsorship record really belongs to the company it is attached to.

**What it found on the sample run.** 57 candidate companies; one with an open matching job, four networking targets, 52 still to check. The source table's sponsorship counts are all even numbers — probably doubled upstream — and six candidates share an identical sponsorship record with a differently named company. Both are reported, not corrected.

**Handoff condition (done when):** the run exits 0; `network-targets.json` and `network-targets.md` exist in the run folder; every company sent to the scorer carries an explicit liveness and timeline factor (none defaulted); every evidence value carries one of the labels record / your-input / model-judgment; the scorer's own `role-scores.json` exists whenever at least one company was scored; and a named human has read the report and recorded the visa-path (G4) and identity (G5) gate states in the run log. "Looks right" is not the condition.

## Required reads

1. `SNICKERDOODLE.md` — gates, provenance, labels, TODO closure.
2. `DOMAIN.md` — what is runnable today and the known gaps.
3. `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (tiers; Unknown is not Avoid), `book/chapters/08-is-the-job-real-ats-detection-and-liveness.md` (liveness as a gate), `book/chapters/11-the-bayesian-role-scorer.md` (votes and gates).
4. This recipe, its card `recipes/cases/2026fa/contactshyam14-code-em-network-targets.card.md`, and the prototype README `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/README.md`.

## Purpose

Make one hidden signal visible for this person: **which sponsors of project/production-management titles have nothing open right now** — the companies worth an informational interview before a role is posted — while refusing to present a title-keyword match, a guessed website, a stale board check, or an upstream join as more than it is.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| 80 Days company table | CSV, 30,369 rows, 20 columns (1,557 with H-1B fields) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | Spot-check a candidate row by hand; read the parity and shared-record warnings before trusting a count |
| BLS/O*NET compact | CSV, SOC titles and sample alternate titles | `data/bls/compact/soc_occupation_compact.csv` | Confirm the target SOC codes are the right occupations |
| SEC Form D samples | JSON, 4 quarters × first 50 filers = 200 filings | `data/sec/form-d/processed/sample/companies-sec-2025q2-d.sample.json` … `companies-sec-2026q1-d.sample.json` | Remember the size: absence here means nothing |
| Role scorer (existing, unmodified) | Node CLI | `scripts/score/role-scorer.mjs` | Read its trace for each scored company |
| Board scanner (existing) | Node CLI, public ATS APIs | `scripts/ats/scan.mjs --dry-run` with `REALLOCATION_ENGINE_PORTALS` | Confirm each board belongs to the company (Greenhouse names the board; Lever and Ashby do not) |
| Posting checker (existing) | Node CLI, Playwright | `scripts/ats/check-liveness.mjs <url>` | Use when a single posting URL is known |
| Prototype (this recipe's tool) | Node CLI, offline | `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs` | Read the run report; clear G4 and G5 |
| Prototype tests | node:test, fixtures only | `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs` | Run them before trusting a change |

Network hosts this recipe uses, only through the existing scanner's providers: `boards-api.greenhouse.io`, `api.lever.co`, `api.ashbyhq.com`. The prototype itself makes no network calls.

## Inputs

| Input | Type | Source | Required? | Label |
|---|---|---|---|---|
| Persona: degree, OPT end date, unemployment days used, target SOC codes, keywords, rules | JSON | `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/persona.shyam.json` | Yes | your-input |
| As-of date | `--as-of YYYY-MM-DD` (default: today, local) | the person | Yes (pass it explicitly for a reproducible run) | your-input |
| Liveness observations | JSON | `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json` (empty template: `inputs/liveness.json`) | Yes — an empty list holds every company | record if a repo script produced it and its output is saved; your-input if a person looked; model-judgment if an AI looked or the board identity is unconfirmed |
| Board list for the scanner | YAML | `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/portals.network-targets.yml` | For the liveness step | which board belongs to which company is a judgment |
| Company table, SOC file, Form D samples | as above | Source Inventory | Yes | record |

## Phase Gates

| Gate | Kind | Test | Pass | Fail |
|---|---|---|---|---|
| G1 Inputs | machine — halts the run | `node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of <date> --out-dir <dir>` exits 3 on any failure; preconditions: `test -f data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv && test -f data/bls/compact/soc_occupation_compact.csv && ls data/sec/form-d/processed/sample/*.sample.json` | exit 0, run folder written | exit 3 with `STOP (G1): …`, **nothing written**: OPT end on/before the as-of date; an OPT start not before the OPT end; no days left under the 90-day unemployment limit (counted from the OPT start); a target SOC code with no BLS row; a missing CSV column or a ragged row; a missing or unparseable persona/liveness file |
| G2 Liveness | gate (multiplier) | `node -e "const r=require('./<dir>/roles.json'); process.exit(r.every(x=>typeof x.liveness?.factor==='number'&&typeof x.timeline?.factor==='number')?0:1)"` | every scored company carries an explicit liveness factor from a dated observation no older than 7 days | company is **held** (not scored): no observation, stale, dated after the as-of date, or `unchecked` |
| G3 Visa timeline | gate (multiplier) | `node -e "const l=require('./<dir>/network-targets.json'); process.exit(l.timeline.network.factor>0.05?0:1)"` | timeline factor = min(1, days available ÷ hiring lag) above 0.05 | scorer skips the company (apply path) or it is skipped from networking (network path) |
| G4 Visa-path sign-off | human only | `grep -Eq 'G4 visa-path:[*]* *signed' logs/runs/2026fa-contactshyam14-code-1.md` | a dated line naming who confirmed a post-OPT path (DSO or immigration attorney) and which path | no application is tailored; networking may continue |
| G5 Identity check | human only | `node -e "const l=require('./<dir>/network-targets.json'); console.log(l.gates.G5_identity.companies.map(c=>c.company).join('\n'))"` lists the flagged companies | for each flagged company, a run-log line saying which company the shared record belongs to and how that was checked | the flagged company is not contacted on the strength of its sponsorship record |

**Human capacity at each human gate.** G2: judging whether a board really is the company's, and whether a "no matching role" reading is right (a model-judgment liveness value must be confirmed by a person before outreach). G4: knowing which questions to ask the international-student office — the recipe makes no visa-law claim. G5: an entity check — the company's own site, or a public LCA search, for the named company.

## Steps

1. **Confirm inputs.** Labor: AI. Script: the G1 precondition commands above. Output: pass/fail. Where: terminal.
2. **Build candidates and run data checks.** Labor: AI. Script: `network-targets.mjs`. Input: company table, SOC file, Form D samples, persona. Output: candidate list with every value labelled; parity and shared-record checks; Form D join by exact normalized name (no fuzzy matching). Where: `<out-dir>/network-targets.json`.
3. **Check liveness.** Labor: AI runs the scanner; Human confirms board identity. Script: `REALLOCATION_ENGINE_PORTALS=<portals.yml> node scripts/ats/scan.mjs --dry-run > <evidence>.txt 2>&1`. Output: matching postings per board and an error list; transcribed into a liveness JSON with `checked_on` in the **local** date (the scanner prints the UTC date). Where: `course/2026fa/submissions/contactshyam14-code/evidence/` and `inputs/liveness.<date>.json`.
4. **Score.** Labor: AI. Script: the prototype writes `roles.json` and calls `node scripts/score/role-scorer.mjs <out-dir>/roles.json --out-dir <out-dir>` (direct `node`, never `npm run score --` on PowerShell). Output: `role-scores.json/.md` from the scorer. The scorer is not called when nothing could be scored. Where: `<out-dir>/`.
5. **Sort and report.** Labor: AI. Script: `network-targets.mjs`. Output: the four groups, gate states, data warnings, verified-vs-inferred table, run record. Where: `<out-dir>/network-targets.md` and `.json`.
6. **Clear the human gates.** Labor: Human. Read the report; record G4 and G5 in the run log; confirm any model-judgment liveness before outreach.
7. **Log the run.** Labor: Human with AI draft. Where: `logs/runs/2026fa-contactshyam14-code-<n>.md` (never `logs/RUN_LOG.md`).

### Commands, verbatim (from the repository root)

```bash
node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs
REALLOCATION_ENGINE_PORTALS=scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/portals.network-targets.yml node scripts/ats/scan.mjs --dry-run
node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates
node scripts/conformance.mjs recipes/cases/2026fa scripts/contrib/2026fa/contactshyam14-code-em-network-targets
```

## What it can verify

- **That a value is in the record.** Company name, sponsored job titles, approval and denial counts, approval rate, company-wide median sponsored salary, funding date/amount/stage, and website are copied from a named CSV row (`…csv#L<line>`), not computed. An independent cross-check (Python's `csv` module) matched 30 of 30 values for the five scored companies.
- **That a sponsored title contains a target phrase.** The match is exact phrase containment against the persona's keywords and the target SOC's primary O*NET title and sample alternate titles; each match records which vocabulary produced it.
- **That a company is or is not in the shipped Form D sample** — by exact normalized name, with the accession number when it is.
- **Two properties of the source table itself, recomputed every run:** whether every approval/denial count is even (all 1,557 are), and which companies share an identical sponsorship record under different names (42 groups, 85 companies).
- **That a board check happened, when, how, and by whom** — and that the scanner reported a matching posting, no matching posting, or an error. Observations older than 7 days, dated after the as-of date, or `unchecked` are held, never treated as open or closed.
- **That the decision came from the repository scorer**, with its arithmetic trace, and that no company reached it without an explicit liveness and timeline factor.

## What it cannot verify

- **The occupation actually filed.** The table lists each company's top few sponsored *titles*, not the SOC codes on the filings. "Technical Program Manager" and "Computer Systems Analyst (Senior IT Project Manager)" both count as project management here; both may have been filed under computer-occupation codes. A company missing from the list may still sponsor these roles — the title list is truncated.
- **The size of any count.** Every count in the file is even, which real counts would not be; the numbers are probably doubled upstream. The rate is unaffected. Counts are shown as stored, and the tier thresholds are applied to them as stored.
- **That a sponsorship record belongs to the named company.** Identical records are attached to CONVEY INC and COVEY INC, LYNDRA and LYRA THERAPEUTICS, BANYAN INFRASTRUCTURE and BARKING LABS. At least one of each pair is wrong; the table cannot say which.
- **Which years the sponsorship covers**, and whether the company still sponsors — the record is a rear-view mirror.
- **Funding outside 200 sampled filings**, or that a funding row in the table belongs to the named company (old "Series D+" rows on large public companies look like mis-attributed filings). Funding has no term in the scorer; it is only used to rank within a group.
- **That a listed website is the company's careers site** — the upstream pipeline guesses domains from names.
- **That an Ashby or Lever board belongs to the company** — those APIs return no board name. A person can confirm it; Shyam confirmed the Genies and Senti boards by eye on 2026-10-02, and their liveness is labelled your-input, not record.
- **Anything about visa law.** The timeline factor is arithmetic on the person's own dates and assumptions. Which H-1B registration cycle(s) fall inside a 2026-12-31 → 2027-12-30 OPT window, what happens if a registration is not selected, and whether the degree is STEM-eligible are questions for the DSO or an attorney. (The 90-day unemployment allowance counting from the OPT start is the person's understanding, entered as input, not a rule this tool verifies.)
- **Fit** between the person and a posting — not assessed; the scorer's fit vote is left empty, not guessed.

## Facts that bite — how this recipe handles each

| Fact | Handling |
|---|---|
| Role quality carries zero weight in the scorer | Not used. No role-quality term is sent; no wage data is relied on. |
| `bls:local-wage` feeds nothing | Not used. |
| Only samples of the SEC data ship | Ran on the four shipped sample files (200 filings). 0 of 57 candidates matched; reported as "not in shipped sample", never "no funding". |
| `data/raw/`, `data/verified/`, `logs/gate-decisions/` don't exist | Not referenced. Outputs go to `course/2026fa/submissions/contactshyam14-code/`; gate records go to `logs/runs/`. |
| The `snickerdoodle` CLI is roadmap | No such commands; every command here is `node …`. |
| Every top-level recipe is DRAFT | This case recipe claims RUNNABLE-SAMPLE under the conditions in *Lifecycle claim*. |
| `npm run bls:local-wage` fails on a fresh clone | Not used. |
| `validate-h1b-join-sample.py` needs data that isn't shipped | Not used; the parity and shared-record checks run on the shipped CSV instead. |
| *Found:* the scorer treats a missing gate as 1 (open) | Companies without a usable observation are held, never sent. A characterization test pins this upstream behaviour. |
| *Found:* funding is not a scorer term | Used only outside the scorer (ranking, a "recent" flag), never folded into the composite. |
| *Found:* every H-1B count in the table is even | Flagged on every run and in the report; counts never halved or "corrected". |
| *Found:* identical sponsorship records under different names | Gate G5. |
| *Found:* the website column is a guessed domain | Never used as a careers URL; liveness requires a board check. |
| *Found:* on PowerShell, `npm run score -- … --out-dir` drops the flag and overwrites tracked example output | The scorer is called with `node` directly. |
| *Found:* the scanner and scorer print UTC dates | `checked_on` is the local date; observations dated after the as-of date are held. |
| *Found:* the scorer's profile check treats "authorized" as no sponsorship needed | No `--profile` is passed, so the scorer's default (sponsorship needed) applies. |

## Proposed additions

Each is outside this recipe's procedure — the procedure above runs without them — and each would remove a named limit.

1. **[TODO: DATA SOURCE] DOL LCA disclosure data** (employer, FEIN, job title, SOC code, case status, fiscal year) under `data/lca/`. *Why:* replaces title-keyword inference with the SOC actually filed, closing "title ≠ occupation". Closure needs the file at that path plus a one-line provenance note (origin, fiscal years, SHA-256).
2. **[TODO: DATA SOURCE] Full SEC Form D quarters** under `data/sec/form-d/processed/` (gitignored today; fetched by the existing `scripts/sec/` ingest). *Why:* the 200-filing sample matched none of 57 candidates; the funding signal is effectively absent.
3. **[TODO: DATA SOURCE] USCIS H-1B Employer Data Hub export** for the years behind the 80 Days counts. *Why:* the only way to test the all-even counts (doubling?) and to attach fiscal years to each record.
4. **[TODO: DEV] Scanner output straight into liveness observations,** plus a per-company job count in `scripts/ats/scan.mjs` output. *Why:* today a person transcribes the scan, and "board fetched, nothing matching" is inferred from a company's absence in the error list.
5. **[TODO: DEV] A standing audit beside the 80 Days data** (`data/80-days-to-stay/…-audit.md`) that runs the parity and shared-record checks. *Why:* the problems affect every recipe that reads this table, not only this one; the existing audit counts duplicate *names* (0) but not duplicate *records* (42 groups).
6. **[TODO: DEV] A missing-gate warning in `scripts/score/role-scorer.mjs`,** and "n/a" instead of a NaN skip rate on zero roles. *Why:* a missing liveness gate silently counts as open; an empty run prints `skip NaN%` and calls it unhealthy.

## Output Contract

### Agent output

File: `<out-dir>/network-targets.json` (plus `roles.json`, and the scorer's `role-scores.json` when it ran).
Fields: `_tool`, `_version`; `run` (`as_of` with label, `generated_at`, `inputs[]` with path and SHA-256); `persona`; `timeline` (OPT end, days available, apply and network factors with formulas); `gates` (G1–G5 states, G4 question, G5 flagged companies); `data_checks` (`parity`, `twins`); `formd` (files, records, matched candidates); `scorer` (ran, command, stdout, or why not); `counts` (by bucket, SOC, tier); `cannot_verify[]`; `unmatched_liveness_observations[]`; `candidates[]` — each with `role_id`, `company`, `bucket`, `evidence` (every term `{value, label, source | derived_from}`), `liveness` (status, result, label, method, evidence, board identity, notes), `scorer` (recommendation, composite, reason, arithmetic), `identity_check_required`, `shares_record_with`.

### Human report

File: `<out-dir>/network-targets.md`.
Reader: the student deciding where this week's networking and application hours go.
Decision enabled: who to ask for an informational conversation; which application to tailor (after G4); which boards to check; what to skip.
Sections: Executive summary · Gates waiting for a human · Network first · Apply · Check the job board first · Skipped · Data warnings · Verified vs. inferred · What this run cannot tell you · Run record.

## Next action per result — where it lands in the 3-3-2 day

| Result | Next action | Hours it uses |
|---|---|---|
| **network** | Ask for a 20-minute informational conversation about upcoming project/production roles and how they have handled sponsorship for them. An AI may draft the message after the record is checked (model-judgment); the person edits and sends it. | the 3 networking hours |
| **apply** | Tailor one application — only after G4 is signed. Read the posting yourself; fit was not assessed. | the 2 research-and-apply hours |
| **check-liveness** | Find the real careers page, look for a matching open role, record the result with date and method (about 5 minutes per board). | the 2 research-and-apply hours |
| **skip** | Nothing. That time goes back to networking or credibility work. | none |
| **identity flag** | Resolve which company the record belongs to before any outreach. | a few minutes of the 2 hours |

The 3 credibility hours are not produced by this recipe, but building and honestly testing it is one.

## Stop Conditions

- Stop (exit 3, nothing written) at any G1 failure — never fall back to a default date, a nearby SOC code, or a partly read table.
- Stop if asked to treat a missing, stale, future-dated, or failed board check as "open" or "closed" — that is the scorer's missing-gate default, and it is exactly what this recipe exists to avoid.
- Stop if asked to fuzzy-match company names to raise the Form D or liveness match rate — fuzzy joins are how one sponsorship record got attached to three companies.
- Stop if asked to halve, round, or "correct" the sponsorship counts — report the parity anomaly; don't rewrite the record.
- Stop if asked to put a funding term into the scorer composite inside this recipe — that is a scorer change, proposed separately.
- Stop before any application is tailored while G4 is unsigned.
- Stop (exit 2) if the output directory is outside this contribution's folders.

## Verification checks

- `node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs` — 21 offline tests, including a characterization test of the scorer's missing-gate default.
- `node scripts/conformance.mjs recipes/cases/2026fa scripts/contrib/2026fa/contactshyam14-code-em-network-targets` and `npm run verify`.
- Cross-check: `python course/2026fa/submissions/contactshyam14-code/evidence/cross-check.py data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv <out-dir>/network-targets.json` — every scored company's record values against the CSV with an independent parser.
- Break attempts: the failure cases in `course/2026fa/submissions/contactshyam14-code/evidence/failure-cases-2026-10-01.txt`; the mutation runs in `…/evidence/mutation-tests-2026-10-01.txt`.

## Logging rules

- One file per run under `logs/runs/2026fa-contactshyam14-code-<n>.md`, using the template below. Never edit `logs/RUN_LOG.md` (the course rule for student contributions).
- Record G4 and G5 decisions there: who, what, when.
- No personal contact details, no résumé content, nothing from `private/` or `data/ats/`.

```markdown
## YYYY-MM-DD — em-network-targets <short task name>

- **Recipe:** manual (recipes/cases/2026fa/contactshyam14-code-em-network-targets.md v0.1.0)
- **Inputs:** persona path, liveness file path, as-of date, data paths (with SHA-256 from the run record)
- **Outputs:** run folder; network-targets.json / .md; roles.json; role-scores.json / .md
- **Result:** counts by group; scorer summary line; data warnings
- **Open issues:** gates still open (G4, G5), held companies, anything that broke
- **G4 visa-path:** signed | not signed — by whom, when, which path
- **G5 identity:** per flagged company — which entity, how checked
```

## Lifecycle claim

**Claimed: RUNNABLE-SAMPLE.** The constitution's evidence for that stage exists:

- a full sample run (runs 01–03, plus a clean-checkout re-run that matches except the timestamp; run 05 repeats it with the corrected OPT dates);
- conformance passes;
- audits are generated (the parity and shared-record checks, and the report);
- a run-log entry exists.

**Two qualifications, stated plainly.**

- **Six TODO tags are open.** They are the proposed additions above, which the assignment requires to be tagged. The constitution says a recipe with open TODOs stays DRAFT. These six are proposals for other parts of the engine, not missing steps in this recipe, but a strict reader may hold this recipe at DRAFT. That reading is fair, and the claim should be read with it.
- **Audits "read" means read by a person.** `last_gate` names him. On 2026-10-02 Shyam Gopalakrishnan re-ran the tests and the tool himself, read the report, spot-checked one record against the CSV, and confirmed three job boards.

Not claimed: RUNNABLE-LIVE (no live run with every gate cleared by a human) or VERIFIED (no attestation bound to this version).

## Provenance

- Drafted 2026-10-01 by Claude (AI) at Shyam's request, from the repository's data and the prototype's real runs. Reviewed and signed (sample-run adequacy) by Shyam Gopalakrishnan on 2026-10-02.
- Branch `contrib/2026fa-contactshyam14-code-em-network-targets`; change brief committed before any code (`f7d5cd2`); prototype `b30d64a`; hardening `a309e8c`; cross-check `f396526`; recipe and card `a0feadb`; OPT-start correction `987f927` (2026-10-02: December 2026 is the OPT start, not the end — runs 01–04 used the wrong date; run 05 is the corrected run, with identical buckets).
- Data: the files in Source Inventory as shipped at upstream commit `015843d`; SHA-256s in each run's `network-targets.json`.
