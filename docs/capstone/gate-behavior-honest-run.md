# Honest run — gate-behavior harness

**Recipe:** gate-behavior v0.1.0  
**Date:** 2026-08-09 (local) / audit stamp 2026-08-10 UTC  
**By:** Yu-Chen Huang  
**Mode:** sample (public fixtures only; no live ATS; no private data)

This is the Capstone Step 4 write-up. Terminal output below is pasted from the real run, not rewritten from memory.

## Plausibility audit (before trusting the report)

I checked the correct-mode batch the way Ch.16 asks: does the result look fluent but wrong?

| Question | What I saw | Judgment |
|---|---|---|
| Does ~0 sponsorship collapse the composite when gates are open? | `weak-votes-open-gates` → composite **0.1785**, **Skip** | Yes. Same shape as Ch.11 non-sponsor example. Not a gate bug — vote result. |
| Does a role past the OPT window get gated (not only down-weighted)? | `impossible-timeline` with `timeline.factor: 0` → composite **0**, **Skip** | Yes. Closed timeline zeroes the score. |
| Does a dead posting still look “Apply” if sponsorship is Proven? | `ghost-posting-dead-liveness` → composite **0**, **Skip** | Yes under correct mode. Under `--break` it wrongly became **Apply 0.6825** — that is the fluency trap. |
| Control still healthy? | `healthy-apply` → **0.4462 Apply** | Matches Ch.11 worked-example arithmetic. |

The failure fluency would hide: a report that only shows strong sponsorship/fit and never shows that liveness multiplied to zero.

## Real terminal output

### Correct mode

```text
$ npm run score:gates

> the-reallocation-engine@1.0.0 score:gates
> node scripts/score/gate-behavior-harness.mjs

Gate-behavior harness — correct-multiplicative-gates
  fixture: data/examples/gate-behavior-roles.json
  checks: 22 PASS / 0 FAIL (of 22)
  verdict: PASS
  ✓ healthy-apply → Apply (0.4462)
  ✓ ghost-posting-dead-liveness → Skip (0)
  ✓ impossible-timeline → Skip (0)
  ✓ both-gates-closed → Skip (0)
  ✓ weak-votes-open-gates → Skip (0.1785)
  wrote output/gate-behavior/gate-behavior-results.json
  wrote output/gate-behavior/gate-behavior-audit.md
```

### Deliberate break attempt (`--break`)

I forced the gate-as-vote bug on purpose: liveness and timeline become soft addends (weight 0.15 each) instead of multipliers.

```text
$ npm run score:gates -- --break

> the-reallocation-engine@1.0.0 score:gates
> node scripts/score/gate-behavior-harness.mjs --break

Gate-behavior harness — buggy-gate-as-vote
  fixture: data/examples/gate-behavior-roles.json
  checks: 5 PASS / 17 FAIL (of 22)
  verdict: BREAK-CAUGHT (buggy scorer failed gate checks — harness did its job)
  ✓ healthy-apply → Apply (0.8025)
  ✗ ghost-posting-dead-liveness → Apply (0.6825)
      ! ghost-posting-dead-liveness: closed liveness must recommend Skip (got Apply)
      ! ghost-posting-dead-liveness: closed gate must zero composite (≤ 0.05), got 0.6825
      ! ghost-posting-dead-liveness: gate must beat strong votes (vote_sum≈0.555 would Apply; rec=Apply)
      ! ghost-posting-dead-liveness: expected recommendation Skip, got Apply
      ! ghost-posting-dead-liveness: composite 0.6825 > max 0.05
  ✗ impossible-timeline → Apply (0.72)
      ! impossible-timeline: closed timeline must recommend Skip (got Apply)
      ! impossible-timeline: closed gate must zero composite (≤ 0.05), got 0.72
      ! impossible-timeline: gate must beat strong votes (vote_sum≈0.570 would Apply; rec=Apply)
      ! impossible-timeline: expected recommendation Skip, got Apply
      ! impossible-timeline: composite 0.72 > max 0.05
  ✗ both-gates-closed → Apply (0.6025)
      ! ...
  ✗ weak-votes-open-gates → Apply (0.4875)
      ! ...
  wrote output/gate-behavior/gate-behavior-break.json
  wrote output/gate-behavior/gate-behavior-break-audit.md
```

**What I found:** with the bug turned on, a dead posting with Proven sponsorship becomes **Apply (0.6825)**. That is exactly the Capstone failure mode — gates behave like votes. The harness caught it (`BREAK-CAUGHT`). The break attempt taught more than the clean PASS.

### Ethics / conformance commands

```text
$ npm run doctor
...
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
RECIPES (44)
  with lifecycle frontmatter: 44   missing: 0
...
SUMMARY
  environment: ✓ runnable

$ npm run verify
conformance: ... ✓ all conform
MANIFEST CHECK ... ✓ manifest check passed (4 warnings)
```

(Warnings about `output/` / `reports/generated/` / `archive/` / `private` ignore paths were already present on this tree; not introduced by this harness.)

## Metric readout

| Metric | Value | Source |
|---|---|---|
| Correct-mode checks | 22 PASS / 0 FAIL | `gate-behavior-results.json` |
| Correct-mode verdict | PASS | script-output |
| Break-mode checks | 5 PASS / 17 FAIL | `gate-behavior-break.json` |
| Break-mode verdict | BREAK-CAUGHT | script-output |
| Ghost posting (correct) | Skip @ 0 | fixture + multiplicative gates |
| Ghost posting (break) | Apply @ 0.6825 | same fixture + buggy addends |
| Skip count in correct fixture batch | 4 / 5 roles | script-output on 5 curated rows (not a live search skip-rate) |

Honest note: the 4/5 Skip share is a **fixture design** number, not a claim about a live allocation run. I am not reporting a production skip-rate from this harness.

## What the machine could not know

- Whether any real Greenhouse/Lever URL is dead today (needs `ats:liveness`, not this harness).
- Whether my personal OPT end date makes a timeline factor truly 0 (human / counsel input).
- Whether “Skip” is the right choice for a role I personally care about (override remains a human act with a written reason).
- Whether a future edit to `role-scorer.mjs` silently diverges from the harness copy of the formula until someone re-runs the tests (shared-module extract is **not implemented yet**).

Those gaps stay with me. The harness only certifies the arithmetic contract on labeled public fixtures.
