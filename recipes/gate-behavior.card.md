---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "sample-run, 2026-08-09, logs/RUN_LOG.md"
attestation: docs/capstone/gate-behavior-attestation.md
recipe_version: 0.1.0
type: card
---

# Gate-behavior harness — human card

**Recipe:** `recipes/gate-behavior.md`  
**Script:** `scripts/score/gate-behavior-harness.mjs`  
**Chapters:** 11 (role scorer), 16 (honest run / build failures)

## Purpose

I built this so we can prove a simple but important rule: if a job is dead, or the visa timeline is impossible, the scorer should say **Skip** and the score should go near zero. Sponsorship and fit should not “save” that role.

This is the Capstone gap about gates behaving like votes. The harness is small on purpose.

## What it can verify

- On the fixture roles, closed **liveness** forces Skip and composite ≤ 0.05.
- Closed **timeline** does the same.
- Strong sponsorship + fit alone are not enough when a gate is closed.
- A deliberate buggy mode (`--break`) treats gates as soft votes, and the harness catches that mistake.

## What it cannot verify

- It does **not** check whether a real job URL is live on the internet.
- It does **not** decide if your OPT end date is correct (that is your input / attorney judgment).
- It does **not** say a Skip is the right life decision — only that the math followed the gate rule.
- It does **not** prove `role-scorer.mjs` will never regress after a future edit unless someone re-runs this harness (or wires it into CI later — not implemented yet).

## Dependencies

- Node.js
- Fixture: `data/examples/gate-behavior-roles.json` (public example data)
- npm scripts: `score:gates`, `doctor`, `verify`
- No network call in the happy path
- No `data/ats/` / private résumé data

## Annotated commands

```bash
# 1) Environment / privacy check
npm run doctor

# 2) Correct gate behavior (must PASS)
npm run score:gates

# 3) Deliberate break: pretend gates are votes (must be BREAK-CAUGHT)
npm run score:gates -- --break

# 4) Repo conformance before PR
npm run verify
```

Optional: score the older Ch.11 example set with the main scorer (related, not required for this harness):

```bash
npm run score -- data/examples/ch11-roles.json
```

## What it produces

| Path | Reader use |
|---|---|
| `output/gate-behavior/gate-behavior-audit.md` | Human table of PASS/FAIL per role |
| `output/gate-behavior/gate-behavior-results.json` | Machine log of checks |
| `output/gate-behavior/gate-behavior-break-audit.md` | Proof the harness fails on the target bug |
| `logs/RUN_LOG.md` entry | Provenance that the sample run happened |

## Failure modes (≥4)

1. **Gate-as-vote regression** — someone changes scoring so liveness/timeline are addends; dead jobs get Apply. *Detect:* correct-mode FAIL, or `--break` no longer needed because prod already matches the bug.
2. **Drift** — fixture expectations drift from Ch.11 thresholds (`gate_zero`, Apply 0.30) while the scorer config changes and nobody updates the harness. *Detect:* unexpected FAIL on control cases after a scorer edit.
3. **Contract-violation** — a report prints a “liveness rate” or coverage number that did not come from a record/script-output. *Detect:* audit “Numbers → records” table cannot name a source; treat as a hard stop.
4. **Fixture cheating** — gate cases use weak votes so Skip happens for the wrong reason. *Detect:* harness requires vote sum ≥ 0.30 on closed-gate rows; sanity check fails if someone weakens the fixture.
5. **False confidence from fluency** — reading a Markdown report that “looks fine” without checking exit codes / FAIL rows. *Detect:* recipe stop conditions require exit 0 and explicit verdict strings.
6. **Privacy leak** — someone points the harness at real `data/ats/` export. *Detect:* recipe forbids it; `npm run doctor` fails if private paths are tracked.

## One-line handoff

If `npm run score:gates` is PASS and `npm run score:gates -- --break` is BREAK-CAUGHT, the gate contract held on the public fixture for this recipe version.
