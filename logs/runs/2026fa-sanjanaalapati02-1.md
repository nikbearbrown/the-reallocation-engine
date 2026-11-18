# Run 1 — 2026fa-sanjanaalapati02 — liveness-factor

**Date:** 2026-10-27
**Component:** `scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/`
**Recipe:** `recipes/cases/2026fa/sanjanaalapati02-liveness-factor.md`
**Status after this run:** DRAFT (no human attestation)
**Mode:** offline, deterministic. No network, no Chromium, no live postings.

## What was run

```
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/liveness-factor.test.mjs
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.test.mjs
```

## Result

```
liveness-factor.test.mjs .... 47 passed, 0 failed
attach-liveness.test.mjs .... 32 passed, 0 failed
                              ──────────────────
                              79 passed, 0 failed
```

Both suites inject their verdicts, so the result is reproducible on any machine
with Node and no further setup.

## What the run establishes

- All **12** liveness codes emitted by `scripts/ats/liveness-core.mjs` and
  `scripts/ats/liveness-browser.mjs` are classified: 9 map to a `{ factor, source }`,
  3 are refused as not scoreable.
- An unknown code aborts the run rather than defaulting to an open gate.
- A not-scoreable code is isolated per row: one `blocked_host` in a batch of five
  leaves the other four fully processed.
- End-to-end against the real scorer CLI on the Ch.11 worked example
  (`data/examples/ch11-roles.json`, role `biotech-data`):

  | liveness code | composite | recommendation |
  |---|---:|---|
  | `apply_control_visible` | 0.4462 | Apply |
  | `no_apply_control` | 0.2231 | Consider |
  | `http_gone` | 0 | Skip (gated) |
  | `navigation_error` | 0.4462 | Apply, gate labelled `unmeasured` |

  The 0.4462 figure reproduces the book's worked example unchanged, which is the
  control: adding this mapping does not move the reference result.

## Drift caught during this run

The test suite's drift guard greps `code:` literals out of the live classifier
sources. It failed on first contact with upstream `main`, correctly: upstream added
a **12th** code, `redirected_off_job`, on 2026-10-03 (a false-positive guard on
`active` — the final URL no longer carries the job's ID). The mapping was extended
to cover it at `0.5 / record` before this run, on the reasoning that the classifier
rules it `uncertain` and the page *was* observed, so it is job-level ambiguity
rather than confirmed expiry.

This is the guard working as designed: drift between `scripts/ats/` and
`scripts/score/` surfaced as a test failure rather than as a silent wrong score.

## Repository checks at the same commit

| Check | Exit | Note |
|---|---|---|
| `node scripts/conformance.mjs` | 0 | clean |
| `node scripts/doctor.mjs` | 0 | environment ✓ runnable |
| `node scripts/manifest-check.mjs` | 1 | **pre-existing** — 6 `E3` generated-adapter sync errors |
| `node scripts/pii-scan.mjs` | 1 | **pre-existing** — 4 findings, none in this namespace |

Both failures were verified against pristine `upstream/main` with this namespace
removed: identical output. Neither is caused by this contribution, and neither can
be fixed from a student namespace — `AGENTS.md`, `CLAUDE.md`, `.github/` and
`package-lock.json` are all protected paths.

`npm ci` was used (lockfile present) and modified no tracked file.

## NOT established by this run

- No live posting was checked. `--live` requires Chromium and is untested.
- No real `roles.json` was produced or scored; the end-to-end test builds its
  fixture in a temp directory and writes nothing into the repository.
- No automatic path calls this code. It is a tested capability, not a pipeline stage.
- No human has reviewed an honest run against real postings, which is why status
  stays DRAFT with `attestation: null`.
