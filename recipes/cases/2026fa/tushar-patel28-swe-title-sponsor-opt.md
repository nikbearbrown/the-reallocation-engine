---
status: DRAFT          # kept DRAFT: the sample run completes and passes conformance, but the rules as written do not permit promotion — 2 DEV proposals stay open by assignment rule, and RUNNABLE-SAMPLE needs a RUN_LOG entry students may not write. See "Lifecycle status".
todos_open: 2
last_gate: null
attestation: null
recipe_version: 0.3.0
---

# tushar-patel28-swe-title-sponsor-opt — sponsored-title check with an OPT-start timeline gate

## Executive summary

For each job opening on an international student's list, this recipe answers two questions:

1. Does the company's H-1B record list a sponsored job title in the student's role family? The families, in priority order, are Software, then AI, then Cloud/Infrastructure.
2. Does the role's start date fit the student's OPT window?

It labels every value by where it came from and runs the repository's existing scorer unchanged. It never says a company "does not sponsor": missing data is unknown, and the next step there is a conversation.

The only path to **Apply** is a human gate (G4). A person checks public labor-filing (LCA) records and the live posting, then writes that evidence into an overrides file. The tool refuses an incomplete or disallowed entry. **An LCA is evidence of an intent to file, not an approved visa.** The sample ships with no G4 entries because no real check has been done, so nothing in the sample is Apply. The timeline arithmetic is planning arithmetic, not immigration advice.

Chapters claimed: **Ch 7** (sponsorship tier, Unknown ≠ Avoid) and **Ch 10** (visa timeline as a gate), combined by the **Ch 11** scorer. BLS wages (Ch 9) appear as context only, because the scorer's `role_quality` weight is 0.

Two customers: this file is for the agent; `recipes/cases/2026fa/tushar-patel28-swe-title-sponsor-opt.card.md` is for the human. The spec is `course/2026fa/submissions/tushar-patel28/CHANGE-BRIEF.md`. Its original sections are never edited; changes are appended under *Revisions*.

**Handoff condition (done when):** a sample run is complete when all of the following hold. "Looks right" is not the condition.
- Stdout prints `roles · scored · not scored`, with counts summing to the input, plus the G4 accepted and refused counts.
- `roles.json` holds exactly the roles that passed input validation.
- The real scorer CLI wrote `role-scores.json` in the same run.
- All three guards pass:
  - sponsorship weight > 0 on every sponsorship term;
  - gate echo, with every timeline = 0 role a gated Skip;
  - the scorer applied exactly the G4 overrides sent.
- The agent log has zero unlabelled values.
- The report opens with an executive summary. Every Apply comes from an accepted G4 entry, and every "tailor" action is shown blocked at G3.

## Required reads

Read in this order before running:

1. `SNICKERDOODLE.md` — gates, provenance, TODO closure, lifecycle (lines 48–83).
2. `DOMAIN.md` — layout; known gaps #3 (role_quality weight 0) and #9.
3. `course/2026fa/submissions/tushar-patel28/CHANGE-BRIEF.md` — the spec and its *Revisions*.
4. `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` — the tier definitions and the rule that Unknown is not Avoid.
5. `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-entity-resolution-readiness-audit.md` — why there is no SOC field.
6. `scripts/score/role-scorer.mjs` — input shape, tier names, `override`, gates, and the `applyProfile` "authorized" bug.
7. This recipe and its card.

Prefer those local files over external lookup. Do not read `private/` or `search/resume.json`.

## Source inventory

| Source | Exact path | Label | Used for |
|---|---|---|---|
| 80 Days sponsorship CSV (30,369 rows; 1,557 with H-1B fields) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | record | G1 entity match; `top_job_titles_sponsored` |
| BLS / O*NET compact table | `data/bls/compact/soc_occupation_compact.csv` | record | median wage per family (context only) |
| Company-name normalizer | `scripts/sec/sec-all-quarters.py` :: `normalize_company_name`, `COMPANY_SUFFIXES` | record (maintained code) | G1 key, executed via `ast` because the module imports pandas |
| H-1B presence check | `scripts/sec/validate-h1b-join-sample.py` :: `present`, `h1b_present`, `H1B_COLUMNS` | record (maintained code) | matched-h1b vs no-h1b-trace |
| Scorer | `scripts/score/role-scorer.mjs` via `npm run score -- <roles.json> --out-dir <dir>` | record (its output) | composite, recommendation, override, audit trace |
| Liveness check (human, at G3/G4) | `npm run ats:liveness -- <posting_url>` | record (when run) | the human records the date in a G4 entry; **not run by this recipe** |
| DOL OFLC LCA disclosure data (human, at G4) | external; consulted by the human, never fetched here | your-input (as entered) | `lca_evidence_source`, `fiscal_year`, `soc_code` in a G4 entry |
| Title → family crosswalk | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/crosswalk.json` | your-input | family check |
| Mappings (tier/p, fit p, timeline bands, liveness assumption, G4 contract, next action) | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/mappings.json` | your-input | votes, G2, G4, decisions |
| G4 overrides (ships empty) | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/overrides.json` | your-input | the only path to Apply |
| Persona (fictional) | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/persona.json` | your-input | EAD start date |
| Candidate roles | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/candidate-roles.json` | your-input | company, title, family, start date, posting URL |

**Deliberately not used:**
- **Form D funding.** On the shipped samples a name join matched 15 of 200, with only one sponsoring company.
- **H-1B approval counts.** Every value is even, which suggests double counting. Sponsorship is read as present or absent, never as a size.
- **`--profile`.** The scorer's authorization regex zeroes the sponsorship weight for "work authorized" F-1 text (F6).

## Phase gates

Each role stops at the first failed gate. There is no fallback and no default.

| Gate | Test | Pass | Fail |
|---|---|---|---|
| Input | `company`, `title`, `role_family` ∈ {SWE, AI, Cloud}, `posting_url` present; `role_id` unique | role proceeds | error naming the role; **not sent to the scorer** |
| G1 entity | `normalize_company_name(company)` equals the key of **exactly one** CSV row | `matched-h1b` if any H-1B column is present, else `no-h1b-trace` (unknown). A human must still confirm the row's name, city and state (namesake check). | `not-found` (0 rows) → tier Unknown, no sponsorship vote; `ambiguous` (2+ rows) → tier Unknown, no vote, next action "pick the right company row" |
| Family check (matched-h1b only) | `ast.literal_eval(top_job_titles_sponsored)` gives a non-empty list of strings; any title matches a crosswalk pattern for the role's family | `in-top-titles`: "a title in this family appears in the company's top sponsored titles" | `not-in-top-titles` → "not in top titles (unknown)"; parse failure → `titles-unreadable`, no family claim |
| G2 timeline | `start_date` is `YYYY-MM-DD` and valid; `days = start − EAD start` falls in exactly one band (table below) | factor 1.0, or 0.5 for the two risk bands (flagged) | factor 0 → the scorer returns a gated Skip; missing or invalid date → error naming the role, not scored |
| G3 liveness (human) | `npm run ats:liveness -- <posting_url>` has been run by a human, with the date recorded | the role may be acted on | **fails offline** unless a G4 entry records `liveness_checked_on`. Otherwise liveness is sent as `{factor: 1.0, source: "your-input", assumed: true, checked: false}`, and every "tailor" action is shown "blocked at G3 until npm run ats:liveness is run by a human". |
| **G4 human evidence (the only path to Apply)** | the overrides file holds one complete entry for the role (all 8 fields, correct types, no future dates); `posting_says_no_sponsorship` is `false`; timeline factor > 0; G1 is not `ambiguous` or `not-found`; the role was scored | sent to the scorer as `override: {decision: "Apply", reason}`; `reason` carries the human's reason plus every evidence field and the sentence "an LCA is evidence of an intent to file, not an approved visa" | the entry is **refused** with a message naming the role and the reason. Nothing reaches the scorer, and the role keeps its machine recommendation. |
| Scorer guards | every sponsorship term has weight > 0; the scorer echoes exactly the gates sent; every timeline = 0 role is `Skip` with `gated: timeline`; the scorer applied exactly the G4 overrides sent and no others | report is written | exit 3; no report |

### G4 entry fields (all required)

| Field | Type | Meaning |
|---|---|---|
| `role_id` | text | the role in the candidate-roles file |
| `lca_evidence_source` | text | where the human looked, e.g. "DOL OFLC LCA disclosure data, FY2026 Q3 file" |
| `fiscal_year` | 4-digit integer | fiscal year of the LCA record seen |
| `soc_code` | `NN-NNNN` or `NN-NNNN.NN` | SOC code on that LCA |
| `posting_says_no_sponsorship` | true/false | whether the posting itself rules out sponsorship (true is refused) |
| `liveness_checked_on` | `YYYY-MM-DD`, not in the future | the day the human ran `npm run ats:liveness` on the posting |
| `checked_on` | `YYYY-MM-DD`, not in the future | the day the human checked the LCA record |
| `reason` | text | what the human saw and why it justifies applying |

**An LCA is evidence of an intent to file, not an approved visa.** A certified Labor Condition Application shows that an employer filed for a position in that SOC code; it says nothing about whether a petition was approved, or whether this employer will sponsor this hire now.

## Definitions (closed)

Each closure gives the value and one or more sentences of reasoning, in the recipe, as SNICKERDOODLE's TODO-closure table requires for a DEFINE (line 80).

- **Sponsorship evidence → tier and p** (rationale drafted by tushar-patel28, 2026-10-01). Tier names are the scorer's own (`soft_sponsorship_tiers: likely / possible / unknown`).
  - **Likely = 0.6** (matched-h1b + in-top-titles): a positive record in my family, but no filing year, no SOC, and possibly doubled counts. This is past practice, not current intent, so it stays below Proven.
  - **Possible = 0.4** (matched-h1b + not-in-top-titles, or titles-unreadable): the company sponsors, but my family isn't visible in a short top-titles list. Existing sponsorship setup puts it above zero; nothing ties it to my role, so it stays below 0.5.
  - **Unknown = no vote** (no-h1b-trace, not-found, ambiguous): sending p = 0 would assert non-sponsorship; unknown is not no.
  - These values mostly set an **ordering** (Likely > Possible > Unknown), **not a measured probability**.
- **Fit p: SWE 0.8 / AI 0.7 / Cloud 0.6** (rationale drafted by tushar-patel28, 2026-10-01). My priority list is a ranking, so equal steps are the least-assumption encoding. The top is below 1.0 because fit is my own statement, not a verified skills match. The floor is 0.6 because I'd accept all three families. Fit weighs 0.30, so a 0.1 step moves the score by 0.03: it breaks ties and can't outweigh sponsorship evidence.
- **Timeline bands** (rationale drafted by tushar-patel28, 2026-10-01). `days = role start − EAD start`; day 0 is the EAD start itself.

  | Days | Band | Factor | Reasoning |
  |---|---|---|---|
  | ≤ −31 | more than 30 days before | 0 | too early to negotiate onto the EAD start |
  | −30 … −1 | 1–30 days before | **0.5** | the start date must be negotiated to on or after the EAD start |
  | 0 … 60 | 0–60 days after | 1.0 | 30-day buffer for slips |
  | 61 … 90 | 61–90 days after | **0.5** | legal, no buffer |
  | ≥ 91 | more than 90 days after | 0 | past the 90-day unemployment allowance (assumption; confirm with the school's international office) |

  0.5 is deliberately below the scorer's 0.6 "weak" threshold (`softTimeline = timeline < 0.6`), so both risk bands get flagged. Planning arithmetic, not immigration advice.
- **Next action** (rationale drafted by tushar-patel28, 2026-10-01). Rules are applied in order:
  1. input error → "blocked: fix the input and re-run";
  2. G1 ambiguous → "blocked: pick the right company row, then re-run";
  3. gated (timeline 0) → **skip**;
  4. accepted G4 entry → **apply**;
  5. Likely → **tailor an application**;
  6. Possible → **network into the company**: a conversation can confirm whether the company sponsors this role family;
  7. Unknown → **network into the company**: a conversation resolves sponsorship policy and an application can't, and unknown is not no.

  A role in the 1–30-days-early band also carries the note "negotiate the start date to on or after the EAD start".
- **Crosswalk: title → role family** (rationale drafted by tushar-patel28, 2026-10-01; file `crosswalk.json`).
  - *Precision over recall.* A keyword only maps a title to a family when the title clearly belongs there.
  - *Ambiguous titles map to no family*, for example Data Engineer, Solutions Architect, and bare "Engineer". These count as "not in top titles (unknown)".
  - *A match is a title match only.* It verifies nothing about the visa's job category (SOC).
  - *Known limitation:* AI roles filed as "Software Engineer" are invisible to the AI family (prediction P1).

  Rule: a title belongs to a family when it matches **no** exclusion and **at least one** of the family's patterns (Python `re.search`, case-insensitive). A title can belong to two families.

  **Exclusions** (any hit → no family):
  - `\b(manager|director|head of|vp|avp|vice president|chief|president|officer)\b`
  - `\b(sales|presales|pre-sales|account|marketing|recruit\w*|success|support)\b`
  - `\b(product|program|project)\b`
  - `\b(qa|quality|test|tester|testing|sdet)\b`
  - `\banalyst\b`
  - `\b(design|designer)\b`
  - `\bteam lead\b`
  - `\bdata engineer\b`
  - `\bsolutions? (architect|engineer)\b`

  **SWE** patterns:
  - `\bsoftware (development )?engineer\b`
  - `\bsoftware developer\b`
  - `\bback[- ]?end( \w+)? (engineer|developer)\b`
  - `\bfront[- ]?end( \w+)? (engineer|developer)\b`
  - `\bfull[- ]?stack( \w+)? (engineer|developer)\b`
  - `\bmobile( \w+)? (engineer|developer)\b`
  - `\b(engineer|developer)\b[ ,/(–-]+(back[- ]?end|front[- ]?end|full[- ]?stack)\b`
  - `\bapplications? developer\b`
  - `\bsde\b`

  **AI** patterns:
  - `\bmachine learning( \w+)? (engineer|scientist|researcher)\b`
  - `\bml( \w+)? (engineer|scientist|researcher)\b`
  - `\bai( \w+)? (engineer|scientist|researcher)\b`
  - `\bai/(ml|ds) (engineer|scientist)\b`
  - `\bdeep learning( \w+)? (engineer|scientist|researcher)\b`
  - `\bcomputer vision( \w+)? (engineer|scientist|researcher)\b`
  - `\bnlp( \w+)? (engineer|scientist|researcher)\b`
  - `\bengineer\b.{0,25}?\b(machine learning|ml|ai)\b`

  **Cloud** patterns:
  - `\bcloud( \w+)? (engineer|architect|developer)\b`
  - `\bdevops( \w+)? (engineer|architect)\b`
  - `\b(site|systems|database) reliability engineer\b`
  - `\bsre\b`
  - `\binfrastructure (software )?engineer\b`
  - `\bengineer\b.{0,25}?\b(cloud|infrastructure|devops)\b`
  - `\bplatform engineer\b`
  - `\bnetwork engineer\b`
  - `\bsystems administrator\b`
  - `\bkubernetes (engineer|administrator)\b`

  Keywords changed when the rationale was applied (2026-10-01), checked against all 1,988 distinct sponsored titles:
  - **Removed:** `member of technical staff` (SWE: MTS covers research, ML and hardware roles); `applied scientist`, `research scientist`, `data scientist` (AI: wet-lab, analytics and actuarial roles share these titles); bare `reliability engineer` (Cloud: hardware and manufacturing reliability).
  - **Tightened to require a role noun** (engineer, developer, scientist, researcher, architect or administrator): `back-end`, `front-end`, `full-stack`, `mobile`, `machine learning`, `ml`, `ai`, `deep learning`, `nlp`, `computer vision`, `cloud`, `devops`, `infrastructure`, `site reliability`, `kubernetes`. `software engineer` now ends at a word boundary, so "Software Engineering Manager" no longer matches.
  - **Added:** the exclusion list; `ai/ml|ai/ds engineer`; `<engineer> … machine learning|ml|ai` and `<engineer> … cloud|infrastructure|devops` (within 25 characters, e.g. "Software Engineer, Machine Learning", "Senior Software Engineer, Cloud"); `<engineer|developer> – back-end|front-end|full-stack`; `systems|database reliability engineer`; `applications? developer`.
  - **Effect on companies with sponsorship data** (1,557): a family title appears at SWE 511 (was 539), AI 86 (was 193), Cloud 68 (was 88); no family 967 (was 851). The AI drop is mostly data-scientist and research-scientist titles.
  - 15-2051 (Data Scientists) stays in the AI *wage context* only, as the AI-adjacent code named in the brief.
    - [model-judgment] BLS has no AI-engineer occupation; 15-2051 is listed because some employers file AI roles under it, not because the crosswalk maps data-scientist titles to AI.

## Open items and proposed additions

- **Crosswalk:** closed 2026-10-01; see *Definitions (closed)*.
- **Record human liveness checks.** *Partly closed 2026-10-01:* a G4 entry's `liveness_checked_on` records the human's liveness check for that role, and the tool marks G3 checked for accepted entries. *Still open:* a liveness record for roles **without** a G4 entry, so a "tailor" action can be unblocked before any LCA check. Also, the result of the check (live, closed, unknown), not only its date, plus who ran it. [TODO: DEV]
- **Company alias table.** A human-maintained file mapping a posting's company name to a chosen CSV row, or to "not in this dataset". It would resolve `ambiguous` cases such as `SALESFORCE COM INC` vs `SALESFORCECOM INC`, and record that "Google" has no row. Each alias is your-input; the code is DEV. [TODO: DEV]
- **Timeline factor from dates:** closed 2026-10-01. `g2_timeline()` exists, conformance passes, tests cover every band edge (−31/−30, −1/0, 60/61, 90/91) and bad dates, and the handoff condition was met.

## Primary stored tools

```bash
# the run (from the repo root)
python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py
# tests (offline; each end-to-end test calls the real scorer CLI into a temp dir)
python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v
# conformance
node scripts/conformance.mjs scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/ recipes/cases/2026fa/
# G3/G4, by a human, per role they want to act on (network call — not run by this recipe)
npm run ats:liveness -- <posting_url>
```

## Workflow

1. Check the inputs: persona `ead_start_date`, crosswalk patterns compile, every evidence state and the G4 block are mapped, the CSV has the required columns, and the overrides file is a list. Any failure stops the run (exit 2).
2. For each role, run the input gate, G1, the family check and G2, and record each result with its label.
3. G4: validate each overrides entry against the role's G1 status and timeline factor. Accept it (scorer override, liveness marked checked on the recorded date) or refuse it with a message.
4. Write `roles.json` with only the roles that passed. Sponsorship carries tier and p (`p: null` for Unknown), fit carries p, timeline carries the computed factor, liveness is assumed unless G4 recorded it, and accepted G4 entries carry `override`.
5. Run `npm run score -- <roles.json> --out-dir <runs dir>`, never with `--profile`. Read `role-scores.json`.
6. Run the guards (sponsorship weight, gate echo, override echo). If one fails, exit 3.
7. Write the agent log and the human report.
8. The human confirms G1 rows, reads the report, does any G4 checks, and logs the run.

## Output contract

All outputs are written to `course/2026fa/submissions/tushar-patel28/runs/`:

- **`roles.json`:** an array shaped like `data/examples/ch11-roles.json`, plus `override` for accepted G4 entries. Every term carries a `source` from {record, model-judgment, your-input}.
- **`role-scores.json`, `role-scores.md`:** written by the scorer, unchanged. `role-scores.md` is the scorer's own format, with no executive summary; that's a scorer-side gap, not changed here.
- **`swe-title-sponsor-opt-<date>.json` (agents):**
  - top-level blocks `run`, `inputs` (SHA-256 per file, including the overrides file), `dataset_context`, `bls_context`, `roles[]`, `g4_overrides` (each entry with accepted/refused and its message), `scorer_run`, `summary`;
  - every scalar sits inside an object `{value, source}`.
- **`swe-title-sponsor-opt-<date>.md` (human):**
  - an executive summary first;
  - a label legend;
  - a decision table: role, family, G1, family check, start vs EAD, timeline factor, liveness, G4 result, votes, composite, scorer (machine → final), shown decision, next action (with the early-start note);
  - the per-role arithmetic;
  - the G4 entries and refusals;
  - the G1 rows to confirm;
  - the titles behind each family check;
  - roles not scored;
  - BLS wage context, labelled record and kept out of the score;
  - dataset family coverage;
  - limits;
  - the run record.
- **Labelling rule:** a value read from a data file, or the scorer's output, is `record`. A value that depends on a definition or entry the human wrote (crosswalk match, tier, p, timeline factor, G4 entry and result, next action) is `your-input`. `model-judgment` is not used.
- **Not emitted:** approval counts as magnitudes; "does not sponsor"; any Apply that doesn't come from an accepted G4 entry; any fabricated G4 evidence in the sample.

## What it can verify

- Whether a company name, normalized by the repository's own normalizer, matches zero, one, or several rows, and whether that row carries an H-1B trace.
- Whether a title matching the crosswalk for a family appears in the company's top sponsored titles.
- Where a start date falls relative to the EAD start, under the stated bands.
- Whether a G4 entry is complete, well-typed, dated no later than today, and allowed for that role.
- That the real scorer used exactly the gates and overrides sent, and that sponsorship kept a non-zero weight.

## What it cannot verify

- Sponsorship for an occupation (SOC) from the data. Only a G4 entry, typed by a human from an LCA record, brings a SOC code in.
- Whether a G4 entry is **true**. The tool checks its shape and its consistency with the gates, not the LCA record itself. A human entry is your-input, never a record.
- Visa outcomes: an LCA shows an intent to file, not an approved visa.
- How much or how recently a company sponsors, from the CSV (no filing year; suspect counts).
- Whether a posting is live, except as a date a human recorded; whether a matched row is the same company (G1 human check).
- Immigration eligibility. The timeline is planning arithmetic, not advice; confirm with the school's international office.

## Verification checks

- Conformance: `node scripts/conformance.mjs scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/ recipes/cases/2026fa/`.
- F1 not-found, F2 no-h1b-trace → Unknown, no vote.
- F3 days −31 and 91 → factor 0 → real scorer `Skip`, reason `gated: timeline`.
- F4 missing, `2027-02-30` and `next spring` → error naming the role, not scored.
- F5 truncated titles → `titles-unreadable`.
- F6 the weight guard; `BROKEN-sponsorship-weight-zero` is rejected.
- G1 break: `Databricks Labs` and `Cohere` → `not-found`; Salesforce → `ambiguous`.
- G2: band edges −31/−30, −1/0, 60/61, 90/91 give 0/0.5, 0.5/1.0, 1.0/0.5, 0.5/0. Both 0.5 bands are scored and not gated. `BROKEN-timeline-ignored` and `BROKEN-gate-zero-off` are rejected.
- G3 break: a role file claiming `liveness_checked: true` is ignored.
- G4: a valid fictional fixture entry turns the real scorer's Consider into Apply, with every evidence field in `override.reason`. Refusals are each tested separately:
  - missing field;
  - `posting_says_no_sponsorship: true`;
  - timeline 0;
  - ambiguous;
  - not-found;
  - wrong type;
  - unknown role;
  - duplicate entry;
  - future date;
  - unscored role;
  - malformed SOC code.
- The sample overrides file is empty, and the sample has no Apply.
- PII: `node scripts/pii-scan.mjs` adds no finding.

## Stop conditions — and the next action per result

| Result | Stop? | Next action |
|---|---|---|
| Persona EAD start missing or invalid; crosswalk, mappings or overrides malformed; CSV missing a column | stop, exit 2 | fix the definition or input; an upstream schema change is logged as a blocker |
| Scorer exits non-zero, or a guard trips | stop, exit 3, no report | do not use any decision; check for `--profile`, a scorer change, or a stale mutant; log it |
| Role input error | that role only | "blocked: fix the input and re-run". Never default a date. |
| G1 `ambiguous` | role scored, no sponsorship vote | "blocked: pick the right company row, then re-run" |
| G1 `not-found` / `no-h1b-trace`, or Possible | role scored, no vote or Possible | "network into the company": ask about sponsorship for this role family. Never record "does not sponsor". |
| G2 factor 0 | gated Skip | "skip". If the start date can move into a band, renegotiate it, then re-run. |
| G2 1–30 days before the EAD start | scored at 0.5, flagged | the next action, plus "negotiate the start date to on or after the EAD start" |
| Likely, no G4 entry | scored | "tailor an application — blocked at G3 until npm run ats:liveness is run by a human" |
| G4 entry refused | role keeps its machine result | fix the entry, or accept the refusal (e.g. the posting rules out sponsorship) |
| G4 entry accepted | scorer Apply | "apply". The human evidence is in the override reason. |
| Asked to pass `--profile`, use approval counts as magnitudes, fuzzy-match names, default a date, or put G4 evidence in the sample without a real check | refuse | each would put a number or record in the output that nothing produced |

## Logging rules

- Do **not** edit `logs/RUN_LOG.md`. Add `logs/runs/2026fa-tushar-patel28-<n>.md` for every sample or break-test run.
- Machine log and human report: `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-<date>.{json,md}`.
- Never log `private/`, `search/resume.json`, real contact details, or the real student's dates. Use the fictional persona only.

### Run-log template (`logs/runs/2026fa-tushar-patel28-<n>.md`)

```markdown
## YYYY-MM-DD — swe-title-sponsor-opt sample run

- **Recipe:** recipes/cases/2026fa/tushar-patel28-swe-title-sponsor-opt.md v0.3.0
- **Inputs:** sample/persona.json, sample/candidate-roles.json, sample/overrides.json, crosswalk.json, mappings.json (sha256 from the run log), 80 Days v3 CSV, BLS compact
- **Command:** python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py
- **Outputs:** course/2026fa/submissions/tushar-patel28/runs/ (roles.json, role-scores.{json,md}, swe-title-sponsor-opt-<date>.{json,md})
- **Result:** <roles in / scored / not scored; scorer machine and final counts; G4 accepted/refused; next actions; guards passed>
- **Gates:** G1 rows confirmed by <name> (<n> of <m>); G4 entries checked by <name> against <LCA source>; liveness dates — or "not cleared"
- **Predictions:** P1–P4 confirmed / contradicted, one line each
- **Open issues:** <open TODOs, defects found, constitution conflicts>
```

## Lifecycle status

**Status: DRAFT, kept on purpose.** The sample run completes and passes conformance, but the rules as written don't permit promotion. Two rules conflict with the student contribution rules. Under SNICKERDOODLE's precedence clause, each conflict is a bug to be logged; for a student that means `logs/runs/`, not `logs/RUN_LOG.md`.

**(a) SPECIFIED needs zero TODOs, but the assignment requires proposals to stay marked as TODOs.**

> `SNICKERDOODLE.md` line 58 — "| DRAFT → SPECIFIED | zero open &#91;`TODO`] items; each closure has its required evidence (table below) | the closures themselves, in the recipe |"
>
> `SNICKERDOODLE.md` line 75 — "A &#91;`TODO`] without evidence of closure is still open, whatever the text says."
>
> `course/summer-2026/reallocation-engine-mode-build.md` line 71 — "- **Proposed additions** — any new data sources or commands, each with a justification for why it belongs, marked with a typed &#91;`TODO`]."
>
> Fall 2026 Canvas assignment, "The Reallocation Engine — Recipe Design Assignment", §2 *Build It* — "Proposed additions, each justified and marked &#91;TODO: DEV] or &#91;TODO: DATA SOURCE]"

The Summer 2026 brief is the only assignment text in the repository. The governing Fall 2026 assignment is on Canvas and says the same in §2: proposals stay marked as typed TODOs. Both open items in this recipe are proposed additions marked &#91;`TODO: DEV`]: the liveness record for roles without a G4 entry, and the company alias table. The assignment requires them to stay marked until built, and line 75 counts them as open, so line 58 can't be met. `todos_open: 2`.

**(b) RUNNABLE-SAMPLE needs a RUN_LOG entry, but students must never edit `logs/RUN_LOG.md`.**

> `SNICKERDOODLE.md` line 59 — "| SPECIFIED → RUNNABLE-SAMPLE | full sample run completes; conformance checks pass; audits generated and read | RUN_LOG entry + audit files |"
>
> `SNICKERDOODLE.md` line 111 — "Record in `logs/RUN_LOG.md`: every script run against real data, every audit created, every gate decision, every TODO closure batch, every blocker, every artifact change. …"
>
> `CONTRIBUTING.md` line 13 — "| Run-log entries | `logs/runs/<term>-<handle>-<n>.md` — **never** edit `logs/RUN_LOG.md` |"
>
> `logs/RUN_LOG.md` line 3 — "**Students: do NOT edit this file.** Add your run entries as `logs/runs/<term>-<github-handle>-<n>.md` … CI rejects PRs that modify this file."

`.github/workflows/contrib-gate.yml` line 82 fails any student PR that touches `logs/RUN_LOG.md`. A student's `logs/runs/` entry is the only run-log a student can write; whether it counts as the "RUN_LOG entry" in line 59 is a maintainer decision, made when the index is rebuilt at integration. Until then, line 59 can't be satisfied by a student as written. Line 59 also needs audits "generated and read"; the human reading is not yet recorded.

**What holds today:**
- the sample run completes with exit 0;
- conformance passes on every file in the folder;
- 40 offline tests pass against the real scorer.

None of that is promotion evidence under the rules as written, so the status stays DRAFT. Under P6 (line 28), a DRAFT is "a hypothesis".

**Why the quotes use `&#91;`.** `npm run doctor` counts every occurrence of the text "&#91;TODO" in a recipe body (`scripts/doctor.mjs` line 102) and flags any recipe whose count differs from `todos_open` (line 108). Quoting the rules verbatim would add markers that aren't open items. So the opening bracket of each *quoted or mentioned* marker is written as the HTML entity `&#91;`. It renders as "[" and the quotes read exactly as the source, while the body keeps exactly 2 real markers, matching `todos_open: 2`. (The source sets `TODO` in code font; the entity sits just outside the code span because entities don't render inside one.)

## Prior art

These Summer 2026 case recipes are DRAFT templates with no implementation; this recipe neither replaces nor duplicates them:
- `recipes/cases/2026su/case-fullstack-swe-sponsor-triage.md` and `case-backend-swe-opt-triage.md`: SWE sponsor triage before OPT, aimed at the same reader.
- `case-ml-sponsorship-triage.md`, `case-nlp-ml-sponsorship-triage.md` and `case-data-ml-h1b-triage.md`: AI/ML-family triage. The ML case names the SOC gap ("ML-specific SOC sponsorship until LCA-by-SOC tooling exists") that G4 bridges by human entry.
- `case-opt-timeline-fit-company-targeting.md`: timeline fit as a targeting signal. Here it becomes a computed gate.

None matches sponsored titles against a role-family crosswalk, computes `timeline.factor` from dates, gates Apply on human LCA evidence, or runs the scorer.
