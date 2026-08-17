---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "verification gate — passed 2026-08-11"
attestation: "Saloni Angre · 2026-08-11"
recipe_version: 0.1.0
---

# Gate-Behavior Harness

## Executive Summary

Chapter 11 makes a claim about behaviour: liveness and timeline are **gates**,
not votes — multipliers, so a dead posting or an impossible start date zeroes
the composite no matter how strong the other evidence. Chapter 16 names the
failure that happens when that claim quietly stops being true: a gate that
behaves like a vote, so a ghost posting keeps enough score to survive and a
student spends an afternoon on a job that does not exist.

A claim about behaviour is testable. This recipe runs
`scripts/score/gate-harness.mjs`, which feeds ten synthetic role records
through the real scorer CLI and asserts the gate semantics hold: closed gates
zero the composite, partial gates compose multiplicatively, the gate boundary
is inclusive, and a gated Skip is distinguishable from a low-score Skip.

It then does the part most harnesses skip. It runs every case a second time
against a deliberately **mutated** copy of the scorer in which gates are
additive votes, and reports whether the assertions actually failed. A harness
that cannot fail is not evidence. If the mutation is not caught, this recipe
says so and the run does not count as a pass.

For the human reader: this tells you the scorer combines its inputs the way the
book says it does. It does **not** tell you the inputs are true. That distinction
is the whole content of the "what this cannot verify" section below, and it is
the reason this recipe cannot promote itself past DRAFT.

## Required Reads

Read these before running, in this order:

1. `recipes/_shared.md` — the shared recipe contract, verified-data rules, phase gates.
2. `DATA_CONTRACT.md` — ownership rules for source data, generated data, scripts, private files.
3. `DOMAIN.md` — specifically gap 3, which records that `weights.role_quality = 0.0` is an open authorial decision, not a settled value. This harness reports that condition; it does not resolve it.
4. `scripts/score/role-scorer.mjs` — the target. The CONFIG block at the top is what the fixtures' expected values were derived from.
5. `scripts/score/fixtures/gate-cases.json` — the ten cases, each with its hand-derivation in a `why` field.

## Phase Gates

Do not move to a later step until the earlier gate has passed. Each gate names
what happens when it fails; a gate with no failure path is decoration, not a gate.

1. **Problem gate.** The run names what is being tested: the gate semantics of
   `scripts/score/role-scorer.mjs`.
   Test: `test -f scripts/score/role-scorer.mjs`
   Failure path: stop. There is nothing to test. Do not invent a target.

2. **Stored script gate.** The harness and its fixtures exist, and `npm run score:gates` resolves.
   Test: `test -f scripts/score/gate-harness.mjs && test -f scripts/score/fixtures/gate-cases.json && npm run 2>&1 | grep -q "score:gates"`
   Failure path: stop and report which file is missing. Do not write a temporary
   replacement harness; a throwaway test that is not in `scripts/` cannot be
   re-run by the next person, which defeats the purpose.

3. **Config gate.** The scorer's live CONFIG matches the config block the
   fixtures' expected values were derived from.
   Test: the harness's `config-matches-fixtures` check reports PASS.
   Failure path: **stop and do not report the case results.** If the weights or
   thresholds moved, every expected value in the fixture file is stale and the
   PASS/FAIL column means nothing. Fix the fixtures against the new config, by
   hand, showing the derivation — then re-run.

4. **Negative-control gate.** Both mutation patterns still match the scorer's
   source, and every gate-sensitive assertion fails under mutation.
   Test: the harness reports `negative control: PASS`.
   Failure path: **stop.** Either the scorer's source changed (so the mutation
   no longer applies and the control is invalid), or the assertions do not
   discriminate. In both cases the baseline PASSes are unearned. Report the run
   as inconclusive, not green.

5. **Verification gate.** The harness exits 0 and both artifacts are on disk.
   Test: `echo $?` is `0`; `output/gate-harness/gate-harness-<DATE>.json` and
   `-audit.md` both exist.
   Failure path: paste the failing assertions verbatim into the run log. Do not
   edit the fixtures to match the observed output — see the contract-violation
   failure mode in the card.

6. **Logging gate.** The run is recorded in `logs/RUN_LOG.md`.
   Test: `grep -q "gate-harness" logs/RUN_LOG.md`
   Failure path: the run did not happen as far as the repository is concerned.
   Log it before moving on.

7. **Human attestation gate.** A named human confirms the run and signs.
   Test: this recipe's `attestation:` frontmatter field is non-null and carries a
   name and date.
   Failure path: the recipe stays DRAFT. The harness cannot sign for itself and
   must not be described as verified until a person has read the audit.

## Primary Stored Tools

| Tool | Path | What it does |
|---|---|---|
| Gate-behavior harness | `scripts/score/gate-harness.mjs` | Runs the fixture cases through the scorer CLI, asserts gate semantics, runs the negative control, writes JSON + Markdown audit. |
| Gate fixtures | `scripts/score/fixtures/gate-cases.json` | Ten synthetic test vectors with hand-derived expected values. |
| Target under test | `scripts/score/role-scorer.mjs` | The Bayesian Role Scorer (Ch.11). **Not modified by this recipe.** |

No stored script existed for gate-behaviour testing before this contribution;
`npm run score` runs the scorer but asserts nothing about it.

## Workflow

Run from the repository root.

```bash
# 1. Confirm the target and the harness are both present (phase gates 1-2)
test -f scripts/score/role-scorer.mjs && test -f scripts/score/gate-harness.mjs && echo "targets present"

# 2. Run the harness with the negative control enabled (the default)
npm run score:gates

# 3. Read the exit code — 0 = pass, 1 = an assertion failed or the control missed, 2 = could not run
echo "exit: $?"

# 4. Read the audit before believing the summary line
cat output/gate-harness/gate-harness-$(date +%F)-audit.md
```

Variants:

```bash
npm run score:gates -- --no-mutate                 # skip the negative control (see stop conditions)
npm run score:gates -- --out-dir output/gate-harness
npm run score:gates -- --quiet                     # summary lines only
```

## Output Contract

### Machine output

File: `output/gate-harness/gate-harness-[DATE].json`

Fields: `_harness`, `_target`, `_chapters`, `_fixture_provenance`, `_value_kinds`,
`generated`, `result`, `config_drift[]`, `baseline[]` (per case: `case_id`, `pass`,
`checks[]`, `observed`), `structural[]`, `paired[]`, `negative_control`
(`valid`, `applied[]`, `caught[]`, `missed[]`).

### Human report

File: `output/gate-harness/gate-harness-[DATE]-audit.md`
Reader: whoever is deciding whether the scorer's gate behaviour can be trusted
for a real run.
Decision enabled: trust the scorer's Apply/Consider/Skip output, or block it.
Sections: config table, baseline case table, structural checks, paired findings,
negative control table, and an explicit "what this harness cannot verify" list.

### Value kinds

Every number in both artifacts is one of three kinds, and the JSON labels them:

| Kind | Meaning | Examples |
|---|---|---|
| `script-output` | Read verbatim from the scorer's own emitted trace | `composite`, `vote_sum`, `gate_product`, `recommendation`, `reason` |
| `fixture` | Hand-declared in `gate-cases.json`, derivation shown in that case's `why` | expected composite, expected recommendation |
| `harness-count` | A tally this script computed | passed/failed counts, caught/missed counts |

No value in either artifact is a model judgment, and none is a claim about a
real company, posting, or person.

## Verification Checks

The harness performs these itself; the operator's job is to confirm they ran,
not to re-derive them.

1. **Config match** — six CONFIG values compared against the fixture's declared assumptions.
2. **Per-case assertions** — composite, recommendation, reason-contains, reason-excludes, override-warning presence.
3. **Arithmetic identity** — for every case, `composite == vote_sum × gate_product` within 1e-3. This is checked against the scorer's own trace, so it needs no external ground truth and independently detects a gate-as-vote regression.
4. **Trace completeness** — every vote and both gates carry a source label; both gates present.
5. **Negative control** — both mutation patterns matched, and every gate-sensitive assertion flipped from PASS to FAIL under mutation.

## Logging Rules

Append to `logs/RUN_LOG.md` after every run, passing or failing:

```markdown
## YYYY-MM-DD — Gate-behavior harness run

- **Recipe:** gate-harness
- **Inputs:** scripts/score/fixtures/gate-cases.json (10 synthetic cases); target scripts/score/role-scorer.mjs
- **Command:** npm run score:gates
- **Outputs:** output/gate-harness/gate-harness-YYYY-MM-DD.json + -audit.md
- **Result:** baseline N passed / N failed; structural N/N; negative control PASS or FAIL; exit code
- **Open issues:** any WARN (e.g. role_quality inert), any drift, anything not tested
```

Log the exit code, not a description of it. Do not log real company names, real
postings, résumé contents, or anything from `data/ats/` — this recipe touches
none of those, and a log entry should not introduce them.

## Stop Conditions

- **Stop if the config gate fails.** Stale expected values make every PASS/FAIL
  in the report meaningless. Do not report results from a drifted config.
- **Stop if a mutation pattern no longer matches.** The negative control is what
  makes the baseline PASSes worth anything. Without it the run is inconclusive
  and must be reported that way, not as a pass.
- **Stop before editing `gate-cases.json` to make a failing case pass.** If the
  scorer's behaviour changed deliberately, change the fixture *and* show the new
  derivation in the `why` field *and* say so in the run log. Silently retuning
  expectations to match output converts the harness into a rubber stamp.
- **Stop before treating a pass as a statement about real roles.** The fixtures
  are synthetic. This harness says the arithmetic is right; it says nothing about
  whether a given posting is actually live.
- **Stop before promoting this recipe past DRAFT without a named human
  attestation.** The harness cannot certify itself.
- **Stop before running any variant that writes outside `output/`.** This recipe
  reads the scorer and the fixtures and writes only to `output/gate-harness/`.
  It must never write to `data/`, `chapters/`, or `scripts/`.
