---
status: DRAFT  # two typed TODOs are open — see "Where this sits in the lifecycle"
todos_open: 2
last_gate: null
attestation: null  # SNICKERDOODLE lifecycle: set only at VERIFIED
recipe_version: 0.1.0
---

# game-dev-h1b-soc-15-1252 — sponsorship triage for funded private game studios

## Executive summary

Take a shortlist of job postings at companies you believe are game studios and
return, for each one, a sourced **Apply / Consider / Skip** — or a refusal to
score it at all, with the reason. It is for an international master's student
in computer science specialising in game programming, on F-1 OPT, who needs an
employer that will eventually file an H-1B for **SOC 15-1252, Software
Developers**.

It answers one question the student cannot answer by looking at a careers page:
**has this studio ever sponsored, and was it for work like mine?** It refuses to
answer two others: whether a company is really a game studio, and whether a
company that has no record is a non-sponsor.

Two customers: this file is for the agent;
`recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.card.md` is for
the human.

### Where this sits in the lifecycle, and why

**`status: DRAFT`.** Not because nothing runs — the sample run completes end to
end, `npm run verify` and `node scripts/conformance.mjs` both pass, 16 offline
tests are green, and the run is logged at
`logs/runs/2026fa-WeitingWang0704-1.md`. By the SNICKERDOODLE transition table
that is the evidence `SPECIFIED → RUNNABLE-SAMPLE` asks for.

It is `DRAFT` because the transition *before* that one has not been made.
`DRAFT → SPECIFIED` requires **zero open typed-TODO items**, and this recipe
carries two, both typed and both genuinely open: no curated games-studio list
exists, and the `role-scorer.mjs` exports that `CONTRIBUTING.md` documents are
not mine to add. Closing them on paper to reach a higher status would be the
violation SNICKERDOODLE names: "editing the status field without the evidence is
a violation, not a promotion."

So the honest reading of this frontmatter is: a recipe whose sample-run evidence
is in hand, held at `DRAFT` by two open TODOs it cannot close from a contrib
namespace.

**Handoff condition (done when):** the run has written `triage.json` and
`triage-report.md` into the operator's own `--out-dir`; every scored row names
its sponsorship status as one of `IN_RECORD` / `NO_SPONSORSHIP_RECORD`; every
unscored row appears under `blocked_at_gate` with the action that would unblock
it; and the timeline arithmetic line is printed in full. "The table looks
plausible" is not the condition.

## Required reads

In this order, before running:

1. `SNICKERDOODLE.md` — the prime directive, gates, TODO closure.
2. `DOMAIN.md` — layout, and §Known gaps (facts 1, 2 and 3 all bite here).
3. `DATA_CONTRACT.md` §Zero-Conditions — nothing personal enters the branch.
4. `recipes/_shared.md` — verified-data rules, phase gates, run-log entry template.
5. This recipe, then its card.

## Purpose and source inventory

### Reads — all verified present at commit `015843d`

| Path | Supplies | Label applied |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | H-1B approvals, denials, approval rate, sponsored job titles, funding date/stage/amount | `record` |
| `data/bls/compact/soc_occupation_compact.csv` | the SOC 15-1252 row: median wage, employment, cognitive-pivot score | `record` |
| `scripts/score/role-scorer.mjs` | the composite — Apply / Consider / Skip | — |
| `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) | posting liveness, run by the human before the triage | `record` |
| operator's `--opt-end` and `--hiring-lag-days` | the timeline gate | `your-input` |
| company name and website strings | the games-sector claim | `model-judgment` |

### Commands

Triage (one command, from the repository root):

```bash
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/postings.sample.json \
  --liveness scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/liveness.sample.json \
  --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
```

Offline tests (no host is contacted):

```bash
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
```

Liveness, run by the human before the triage, once per posting:

```bash
npm run ats:liveness -- <job-url>
```

There is deliberately no `npm run` entry for the triage. `package.json` is a
protected path in `.github/workflows/contrib-gate.yml`; a student PR that edits
it fails the contrib gate.

### Does not re-implement the scorer

`CONTRIBUTING.md` sanctions two routes into the engine: import `role-scorer.mjs`'s
exports (`CONFIG`, `SRC`, `applyProfile`, `scoreRole`), or run the CLI and read
`role-scores.json` back. **The first route does not exist** — `role-scorer.mjs`
carries no `export` statements at commit `015843d`. This recipe uses the second
route and records the discrepancy rather than working around it silently.

[TODO: DEV] Upstream could add the four exports `CONTRIBUTING.md` already
promises. Out of scope for a contrib folder; a maintainer decides.

### Proposed additions

- `scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/` — the
  prototype, its fixtures and its offline tests. Justified because no existing
  script turns a games shortlist into scorer input, and because the
  sector-inference step is the one that most needs to be visible and
  challengeable rather than buried in a prompt.

[TODO: DATA SOURCE] The CSV has no games industry label (24 labels, none of
them games), so sector membership has no record to appeal to. A curated
studio list — keyed to the CSV's own `company_name` values so it joins exactly
— would turn Gate 1 from a keyword guess into a lookup. Not built here; a
keyword match that a human confirms is the honest interim.

## Phase gates

Each posting stops at the first failed gate. Nothing falls through to a default.

| Gate | Test | Pass | Fail |
|---|---|---|---|
| **G1 sector** | A games keyword matches the company name or website. | row proceeds, carrying the matched keyword as `model-judgment` | row proceeds **flagged** — `gate1_flag` tells the human to confirm or reject the company by hand. Never silently dropped: a studio whose legal name has no games word would vanish. |
| **G2 liveness** | The posting id has an entry in the liveness file, written by a human who ran `npm run ats:liveness`. | `liveness.factor` enters the composite as a `record` | `blocked_at_gate: GATE_2_LIVENESS`. **Not scored.** An unchecked posting is never defaulted to alive. |
| **G3 coverage** | The company resolves to a row in the 80 Days CSV by normalised name. | sponsorship evaluated | `blocked_at_gate: NOT_IN_RECORD`. **No sponsorship number is emitted at all** — not a zero, not a prior. |
| **G4 timeline** | `--opt-end` is in the future. | factor `clamp((runway − lag) / lag, 0, 1)` enters the composite as `your-input` | `E_OPT_DATE_PAST`, exit 3, **no output files written**. |
| **G5 SOC** | `--soc` has a row in `soc_occupation_compact.csv`. | wage and ability context read | `E_SOC_NOT_FOUND`, exit 3. No wage is invented. |

Liveness and timeline are **gates, not votes** — they multiply the composite, so
a dead posting or a closed window zeroes a role no matter how strong its
sponsorship record. G2 goes further than the scorer does: rather than passing a
guessed liveness of 1.0 for an unchecked posting, it declines to score the row.

**What a human must see to clear each gate.** G1: the matched keyword and the
company's real business. G2: the URL, the timestamp, and the observed status.
G4: both numbers written out — the OPT end date and the assumed hiring lag —
because this gate can close a role on an assumption alone.

## What it can verify

- That a company has an H-1B approvals row in the 80 Days CSV, and what that
  row says: approvals, denials, approval rate, median salary offered, and the
  job titles it sponsored for.
- That those sponsored titles do or do not include any engineering title — the
  difference between "this studio sponsors" and "this studio sponsors people
  who do my job".
- That a company has a recorded funding date and stage, and how long ago.
- That SOC 15-1252 exists in the BLS compact file and what its 2024 median wage
  and cognitive-pivot score are.
- That a posting was checked for liveness, by whom and when, because a human
  wrote it down.
- The arithmetic of every composite, term by term, including which term is a
  record and which is not.

## What it cannot verify

- **That a company is a game studio.** The CSV's `industry` column has 24
  values and none of them is games. The sector claim is a keyword match,
  labelled `model-judgment`. It over-matches — `Peloton Interactive Inc` passes
  the filter and sells exercise bikes — and it under-matches on any studio whose
  legal name contains no games word. This is the weakest link in the recipe.
- **Anything about a studio the CSV does not contain, which is most of the ones
  you have heard of.** Measured on 2026-10-03: of 14 well-known game employers,
  **1** is genuinely present (Roblox). `ELECTRONIC ARTS`, `ACTIVISION`,
  `RIOT GAMES`, `EPIC GAMES`, `BLIZZARD`, `ZYNGA`, `UBISOFT`, `BUNGIE`,
  `NAUGHTY DOG`, `RESPAWN`, `INSOMNIAC` and `CAT DADDY` are all absent; the
  seven `VALVE` matches are heart-valve and industrial-valve companies and the
  one `TAKE TWO` match is an unrelated 2021 California company. The dataset is
  built from SEC startup filings, which a studio owned by a public parent does
  not make. **So this recipe triages the funded-private-studio slice of the
  games sector, not the sector.** For a student targeting the large publishers
  it returns `NOT_IN_RECORD` and nothing more — correctly, but uselessly.
- **That a company does not sponsor.** Only 1,557 of 30,369 rows (5.1%) carry
  an approvals value. For the other 94.9% the recipe applies a stated prior of
  0.35 labelled `model-judgment`. An absent record is an absence of evidence.
  For an international student under time pressure this is the most dangerous
  possible confusion, because it silently deletes most of the market.
- **That a posting is live.** That needs the network; the prototype makes no
  network calls. Liveness becomes a record only when a person runs
  `npm run ats:liveness` and writes down what they saw. In the sample run two
  postings were checked for real (both `expired`) and seven were not; provenance
  is tracked per entry, so a checked row reads `liveness [record]` with a
  timestamp and an unchecked row reads `[model-judgment]`. Both checked rows
  belong to companies outside the CSV and blocked before scoring, so **none of
  the scored rows carries a checked liveness value**. The report says so at the
  top of every run.
- **That the role is any good.** `role-scorer.mjs` sets the `role_quality`
  weight to `0.0` and tags it `[VERIFY]` (DOMAIN.md known gap 1). A
  role-quality vote would look like evidence and contribute nothing, so the BLS
  numbers are shown in the human report and **never sent to the scorer**.
  Proposing a weight is an authorial decision about the book's model.
- **A live Form D join.** A fresh clone ships 4 quarters × 50 sample companies
  (DOMAIN.md known gap 3). Funding recency comes from the CSV's own
  `latest_funding_date` column, which is Form D-derived upstream. The sample
  files are not large enough to join against a games shortlist and this recipe
  does not pretend they are.
- **A local wage band.** `npm run bls:local-wage` fails on a fresh clone
  (missing `.venv`, unshipped `requirements.txt`) and no decision reads its
  output anyway (DOMAIN.md known gap 2). This recipe does not call it.

## Output contract

Two files, because one file cannot serve two readers.

**For the agent — `<out-dir>/triage.json`**

```
{ _recipe, _version, generated,
  inputs:            { postings, liveness, opt_end, hiring_lag_days, soc },
  assumptions:       { p_proven, p_likely, p_none, p_unknown,
                       default_hiring_lag_days, game_keywords,
                       engineering_title_fragments },
  source_labels:     { record, model-judgment, your-input },
  timeline_gate:     { factor, source, days_of_runway,
                       assumed_hiring_lag_days, arithmetic, note },
  role_quality_context: { ... , scorer_weight_note },
  scored:            [ { posting_id, company, title, url,
                         sector     { is_game_employer, matched_keywords, source, note },
                         sponsorship{ status, tier, p, source, evidence,
                                      role_title_match, note },
                         funding    { status, source, months_since_funding, ... },
                         fit, liveness, timeline } ],
  blocked_at_gate:   [ { ..., blocked_at, what_the_human_must_do } ],
  scorer_output:     <role-scores.json verbatim, with its per-term trace> }
```

Every value in `scored` carries a `source` of `record`, `model-judgment` or
`your-input`. A value with no source is a defect, not a default.

**For the person — `<out-dir>/triage-report.md`**

In this order: what is a record here and what is not; the timeline gate with
its arithmetic spelled out; the decision table with sponsorship evidence and a
next action per row; the rows blocked at a gate and what would unblock each;
the role-quality context with the note that it was not scored; the stop
condition.

The repository's scorer additionally writes `roles.json`, `role-scores.json`
and `role-scores.md` into the same directory. Those are its outputs, not this
recipe's. **`--out-dir` is mandatory** — without it the scorer overwrites the
tracked example output and that change appears in the PR.

## Stop conditions and next action

The recipe stops at the report. It does not apply, contact anyone, rank the
operator against other candidates, or write to `data/ats/`.

| Result | Next action | Which of the 3-3-2 hours |
|---|---|---|
| **Apply** | Tailor and apply. | the 2 research-and-apply hours |
| **Consider** | Do not apply cold. Find one person and ask. | the 3 networking hours |
| **Skip** (gated) | Drop it. A dead posting is not a near miss. | frees the hour for the credibility 3 |
| **Skip** (tier `none`) | Drop it. A recorded non-sponsor is the clearest Skip the dataset gives. | frees the hour for the credibility 3 |
| **`NOT_IN_RECORD`** | Research by hand or drop. Do not assume either way. | the 2 hours, deliberately |
| **`NO_SPONSORSHIP_RECORD`** | Treat as unknown, not as no. Worth one networking conversation before any application effort. | the 3 networking hours |

A healthy run skips at least half of what it evaluates. **The sample run in
`WORKED-RUN.md` skips 17%** — recorded as a finding, not hidden: the stated
prior of 0.35 for unknown sponsorship is generous enough that most rows land in
`Consider`, which is a way of deciding nothing.

## Run-log template

Copy to `logs/runs/2026fa-<handle>-<n>.md`. Never edit `logs/RUN_LOG.md`.

```markdown
### <date> — game-dev-h1b-soc-15-1252 — <one-line what this run was for>

**Commands run** (verbatim, with their real output pasted)

**Inputs** — postings file, liveness file, `--opt-end`, `--hiring-lag-days`, `--soc`

**Result** — n scored (Apply/Consider/Skip), n blocked, skip rate

**Verified vs inferred** — which values were `record`, which `model-judgment`,
which `your-input`

**Break attempt** — what was deliberately broken, what the tool did

**What was wrong** — anything the run surfaced about the recipe or the data

**Gate status** — which gates a human cleared, which are still open
```

## Open TODOs

Two, both typed and declared in the frontmatter (`todos_open: 2`). They are
raised once each, at the point in this document where they belong; this section
indexes them rather than restating the markers, so that the marker count in the
body matches the declared count.

1. **Data source** — §Proposed additions: a curated games-studio list keyed to
   the CSV's `company_name`, to replace the Gate 1 keyword match.
2. **Dev** — §Does not re-implement the scorer: the `role-scorer.mjs` exports
   that `CONTRIBUTING.md` documents but the file does not provide.
