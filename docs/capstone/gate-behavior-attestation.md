# Verified-data attestation — gate-behavior harness

- **Recipe:** gate-behavior v0.1.0
- **By:** Yu-Chen Huang · 2026-08-09
- **Contribution:** Gate-behavior unit-test harness (Ch. 11 / 16)
- **Gap closed:** prove liveness and timeline zero the composite (gates, not votes)

This page is the human attestation record. It is not a machine self-certify checkbox.

## Verified-vs-inferred boundary

“Give to AI / Keep for yourself” applied to this component.

| Field / number emitted | Label | Who owns it | Notes |
|---|---|---|---|
| `sponsorship.p`, `tier` on fixture rows | record (fixture) | human (fixture author) | Public example numbers shaped like Ch.11; not a live DOL pull in this run |
| `fit.p` | model-judgment (fixture-labeled) | labeled on the row | Harness does not re-judge fit |
| `liveness.factor` | record (fixture) | human (fixture author) | Stand-in for ATS liveness output; **not** a live URL check |
| `timeline.factor` | your-input (fixture-labeled) | human | Stand-in for visa-timeline gate input |
| `composite` | script-output | harness / scoring function | From `(Σ vote·weight) × liveness × timeline` in correct mode |
| `recommendation` (Apply/Consider/Skip) | script-output | harness | Thresholds aligned with role-scorer (Apply ≥ 0.30, Consider ≥ 0.20, gate_zero 0.05) |
| PASS / FAIL per check | script-output | harness | Boolean compare against `expect` on fixture |
| `pass_count` / `fail_count` / `check_total` | script-output | harness | Counts of check objects in the JSON result |
| Verdict `PASS` / `FAIL` / `BREAK-CAUGHT` | script-output | harness | Derived from check outcomes + mode flag |
| Whether a real posting is dead today | missing / external | human + `ats:liveness` (separate tool) | **Out of scope** for this harness |
| Whether Skip is the right personal decision | your-input / judgment | human | Adequacy, not conformance |

## Every number traces

| Figure in the run | Script | Record / source |
|---|---|---|
| Ghost posting composite `0` and Skip | `scripts/score/gate-behavior-harness.mjs` | `ghost-posting-dead-liveness` in `data/examples/gate-behavior-roles.json` (`liveness.factor: 0`) |
| Impossible timeline composite `0` and Skip | same | `impossible-timeline` row (`timeline.factor: 0`) |
| Healthy control Apply (~0.446) | same | `healthy-apply` row (Ch.11-shaped votes × 0.85) |
| Weak sponsorship Skip under open gates | same | `weak-votes-open-gates` row (`sponsorship.p: 0`) |
| Break-mode Apply on dead posting | same with `--break` | buggy addend path; used only to prove detection |
| Doctor privacy line “no private/PII paths tracked” | `scripts/doctor.mjs` | `git ls-files` scan at run time |

No coverage %, live liveness rate, or calibration figure is printed by this harness.

## Ethics gate (Ch. 16)

### (a) Privacy

- Inputs used: `data/examples/gate-behavior-roles.json` only.
- Not used: `data/ats/` contents, `private/`, real résumé, real tracker.
- Command: `npm run doctor` — expect no tracked private/PII paths.

### (b) Honesty

- Correct mode reports PASS only when gate checks pass.
- `--break` does not pretend the buggy scorer is healthy; it labels mode `buggy-gate-as-vote` and expects gate checks to fail (`BREAK-CAUGHT`).
- If a future change invents a metric, the run should stop (see recipe stop conditions). Prefer “not implemented yet” over fake coverage.

**Human note:** I ran the commands listed in the honest-run doc and checked the audit tables myself. The machine output is evidence; this signature is the adequacy judgment.

## Attestation

- Recipe: gate-behavior v0.1.0
- By: Yu-Chen Huang · 2026-08-09

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `npm run score:gates` | Verdict PASS; ghost + impossible-timeline → Skip / composite 0; healthy-apply → Apply | Correct multiplicative gates |
| `npm run score:gates -- --break` | Verdict BREAK-CAUGHT; dead/impossible rows fail Skip/zero checks (often become Apply) | Harness catches gate-as-vote bug |
| `npm run doctor` | No private/PII paths tracked | Privacy gate pass |
| `npm run verify` | Conformance / manifest checks pass for the tree | Machine half of P4 |

### Did not test

- Live ATS liveness against real company URLs
- Wiring this harness into CI on every commit (not implemented yet)
- Whether `role-scorer.mjs` and the harness copy of the formula will stay forever in sync without a shared import (current risk: duplicated formula — see honest run)
- Adequacy of Skip for a specific person’s job search

### Broke during testing, fixed

- Disk was full on the build machine before first write (`No space left on device`). Cleared local package caches, then re-ran. Not a harness logic bug.
