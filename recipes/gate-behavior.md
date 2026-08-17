---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "sample-run, 2026-08-09, logs/RUN_LOG.md"
attestation: docs/capstone/gate-behavior-attestation.md
recipe_version: 0.1.0
---

# gate-behavior — Gate Behavior Unit-Test Harness

## Executive Summary

This recipe checks one hard rule from Chapters 11 and 16: **liveness and visa timeline are gates, not votes.**

If a posting is dead (`liveness ≈ 0`) or the start date is impossible (`timeline ≈ 0`), the composite score must go to ~0 and the recommendation must be **Skip** — even when sponsorship and fit look excellent.

Agents run the stored harness against public fixture roles. Humans read the audit and decide if the gate contract still holds. The harness is also built to **fail on purpose** when gates are wrongly treated as soft votes (`--break` mode). That failure is the point: it proves the test can catch the bug the Capstone names.

## Required Reads

Read these before running (in this order):

1. `SNICKERDOODLE.md` — gates are hard stops; machines check conformance, humans check adequacy.
2. `DOMAIN.md` — role scorer status and the “gates, not votes” rule.
3. `DATA_CONTRACT.md` — what may be committed; keep `data/ats/` and `private/` out.
4. `scripts/score/role-scorer.mjs` — the combiner formula: `(Σ vote·weight) × liveness × timeline`.
5. `data/examples/gate-behavior-roles.json` — fixture roles used by this harness (public example data only).
6. `recipes/_shared.md` — shared recipe contract.

Do **not** invent liveness or timeline numbers. This recipe only scores labeled fixture inputs.

## Phase Gates

Each gate has a failure path. If a gate fails, stop.

| # | Gate | Handoff condition (testable) | Failure path |
|---|---|---|---|
| 1 | **Source gate** | Fixture + harness + recipe files exist. `test -f data/examples/gate-behavior-roles.json && test -f scripts/score/gate-behavior-harness.mjs && test -f recipes/gate-behavior.md` | Stop. Restore missing files from the branch; do not invent fixture rows. |
| 2 | **Privacy / ethics gate** | No private ATS data is used. Inputs are only under `data/examples/`. `npm run doctor` shows no tracked PII leaks. | Stop the run. Do not stage `data/ats/` or `private/`. |
| 3 | **Shape gate** | Fixture JSON parses. `node -e "JSON.parse(require('fs').readFileSync('data/examples/gate-behavior-roles.json','utf8'))"` | Stop. Fix JSON syntax before scoring. |
| 4 | **Correct-mode gate** | `npm run score:gates` exits 0 and audit verdict is PASS. | Stop. Treat as a real gate-behavior regression. Do not “explain away” a FAIL. |
| 5 | **Break-attempt gate** | `npm run score:gates -- --break` exits 0 with verdict `BREAK-CAUGHT` (buggy scorer fails the gate checks). | Stop. If break mode still PASSes gate checks, the harness is too weak — fix the harness, not the story. |
| 6 | **Logging gate** | A RUN_LOG entry exists for this sample run, and audit/JSON outputs were written under `output/gate-behavior/`. | Stop before claiming the sample run is done. Append `logs/RUN_LOG.md`. |

## Primary Stored Tools

Stored scripts exist:

| Tool | Path | Command |
|---|---|---|
| Gate-behavior harness | `scripts/score/gate-behavior-harness.mjs` | `npm run score:gates` |
| Deliberate break mode | same script | `npm run score:gates -- --break` |
| Role scorer (related combiner) | `scripts/score/role-scorer.mjs` | `npm run score -- data/examples/ch11-roles.json` |
| Doctor (privacy / env) | `scripts/doctor.mjs` | `npm run doctor` |
| Conformance | `scripts/conformance.mjs` | `npm run verify` |

No temporary one-off script is required for the happy path.

## Workflow

Run in dialogic order. Do not skip gates.

1. **Confirm sources (Gate 1).** Check that the fixture, harness, recipe, and card are present.
2. **Ethics check (Gate 2).** Confirm the run uses only `data/examples/`. Run `npm run doctor`.
3. **Parse fixture (Gate 3).** Confirm the fixture JSON is valid.
4. **Correct-mode run (Gate 4).**
   ```bash
   npm run score:gates
   ```
   Read `output/gate-behavior/gate-behavior-audit.md` and `output/gate-behavior/gate-behavior-results.json`.
5. **Break attempt (Gate 5).**
   ```bash
   npm run score:gates -- --break
   ```
   Read `output/gate-behavior/gate-behavior-break-audit.md`. Confirm verdict is `BREAK-CAUGHT`.
6. **Plausibility skim.** On the correct-mode audit: dead liveness → Skip / ~0; impossible timeline → Skip / ~0; healthy control still Apply; weak sponsorship with open gates can Skip without being a gate bug.
7. **Log (Gate 6).** Append a short entry to `logs/RUN_LOG.md` with date, commands, verdicts, and output paths.
8. **Human adequacy.** A named human signs the attestation. The machine does not self-certify honesty.

## Output Contract

### Agent / machine outputs

| File | What it contains |
|---|---|
| `output/gate-behavior/gate-behavior-results.json` | Per-role composite, recommendation, check PASS/FAIL, mode label |
| `output/gate-behavior/gate-behavior-audit.md` | Human-readable audit table + numbers→records map |
| `output/gate-behavior/gate-behavior-break.json` | Same shape for `--break` mode |
| `output/gate-behavior/gate-behavior-break-audit.md` | Break-attempt audit |

Every emitted PASS/FAIL count and composite is **script-output** from labeled fixture fields. The harness does not fetch live ATS pages and does not invent sponsorship rates.

### Human card

`recipes/gate-behavior.card.md` — purpose, limits, commands, failure modes.

## Verification Checks

Before calling the sample run done:

- [ ] Correct mode exit code is 0 and verdict is `PASS`.
- [ ] Ghost posting (`liveness: 0`) is Skip with composite ≤ 0.05.
- [ ] Impossible timeline (`timeline: 0`) is Skip with composite ≤ 0.05.
- [ ] Healthy control role remains Apply (or meets `expect.recommendation`).
- [ ] `--break` mode verdict is `BREAK-CAUGHT` (exit 0 for the harness wrapper, meaning the bug was detected).
- [ ] `npm run verify` and `npm run doctor` are clean for the contribution files / privacy.
- [ ] No `data/ats/` or `private/` files staged.

## Logging Rules

Update `logs/RUN_LOG.md` when you:

- run `npm run score:gates` or `--break`;
- change the harness, fixture, recipe, or card;
- hit a FAIL that blocks the sample run;
- write or refresh attestation / honest-run docs.

Keep entries short. No secrets, no real personal job-search notes, no private emails.

### Log template

```
## YYYY-MM-DD — gate-behavior sample run
- Recipe: gate-behavior v0.1.0
- Inputs: data/examples/gate-behavior-roles.json
- Commands: npm run score:gates ; npm run score:gates -- --break
- Outputs: output/gate-behavior/gate-behavior-*.{json,md}
- Result: correct=PASS ; break=BREAK-CAUGHT
- Open issues: <none or named>
```

## Stop Conditions

- Stop if the fixture or harness file is missing.
- Stop if any private path (`data/ats/`, `private/`) is required or staged for the run.
- Stop if correct-mode harness exits nonzero / verdict FAIL.
- Stop if `--break` does **not** catch the gate-as-vote bug (verdict `BREAK-MISSED`).
- Stop if a number in a report cannot be traced to the fixture or to script-output — prefer “not verified” over inventing coverage.
- Stop if someone asks the model to “just say the gates work” without running the script.
