# PR description (as submitted)

*Audience: the course maintainer and TAs reviewing the PR. This file is the PR body as opened;
the title is below.*

**Title:** `2026fa aditya-raj-sde: Sponsor & Posting Reality Check (sponsorship + liveness) — RUNNABLE-SAMPLE`

---

## Executive summary

This PR adds a student case recipe and a small offline prototype for one question an international
engineering candidate faces before tailoring an application: is the posting still open, and is
there sponsorship evidence for **this opening**, as opposed to the company's history?

- It reuses the repo's liveness classifier (imported) and role scorer (through its CLI) without
  copying them.
- It never converts company sponsorship counts into a score.
- It stops every refused opening at a gate no score can override (shown to catch a deliberate break).
- It reports timing as unverified.
- The recipe reached **RUNNABLE-SAMPLE** (v0.4.0, `attestation: null`). The student's attestation is
  in the worked run.

**Two CI jobs are expected to fail for reasons that pre-date this branch, and one further inherited
issue sits in a step CI never reaches. Evidence is below. This PR's own checks pass locally.**

## What this PR adds

The component is `sponsor-live-jan2027`, covering the **sponsorship** layer (80 Days to Stay CSV,
reported as context only) and the **Job-Ops liveness** layer (`classifyLiveness`, used as a gate),
with the **maintained scorer** used only on labeled hypothetical scenarios.

- **Recipe + card:** `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027{.md,.card.md}`, status `RUNNABLE-SAMPLE`, `todos_open: 0`, `attestation: null`.
- **Prototype, probe, 18 offline tests, fixtures, README:** `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/`.
- **Run log:** `logs/runs/2026fa-aditya-raj-sde-1.md`. `logs/RUN_LOG.md` is not touched.
- **Justification, worked run with attestation, test report, Frictional, sources, evidence 00–44:** `course/2026fa/submissions/aditya-raj-sde/`.

Branch: `contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027` · This is my ONLY open PR: [x] yes
Maintained file I deliberately patch: `none`

## Checklist

- [x] `npm run doctor` clean locally (last 3 lines below)
- [x] No real PII anywhere in this branch's history; fictional persona Aarav Patel only (`pii-scan --diff` output below)
- [x] Run log added as `logs/runs/2026fa-aditya-raj-sde-1.md`; `logs/RUN_LOG.md` not edited
- [x] Recipe + card under `recipes/cases/2026fa/` with honest lifecycle frontmatter (attestation is a human-signed record in the worked run; the frontmatter field is reserved for VERIFIED)
- [x] Tests green, with real output pasted below
- [x] Diff touches only my namespaced paths (no maintained-file patch)
- [x] `npm run verify` passes locally (with PyYAML from a local `.venv`, as CI installs it)

## Doctor output (last 3 lines, pasted)

```
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
[exit=0]
```

## `npm run verify` (tail)

```
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
[exit=0]
```

## `node scripts/pii-scan.mjs --diff upstream/main` (contribution-scoped; equals CI's PR step)

```
pii-scan: clean ✓
[exit=0]
```

## Scope (mirrors the `contrib-scope` job's rules)

```
changed files: 84
protected paths touched: none
outside standard namespaces: none
[exit=0]
```

## Tests (pasted, not described)

```
$ node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs
ok 1 - no network: source imports nothing that can reach the network; fetch never called
ok 2 - maintained scorer is reused through its CLI, not copied
ok 3 - G1: a timeline mislabeled as "record" fails the run with exit 2 and writes nothing
ok 4 - G1: an out-dir over tracked repository files is refused (exit 2)
ok 5 - G1: missing evidence fields are named, not defaulted
ok 6 - G1: a recorded liveness labeled "record" must point at an existing evidence file
ok 7 - F1b: every explicit refusal stops at G3 with skip-application, even with fit 1.0 and a scenario vote
ok 8 - F2(b) F2-0: open posting passes G2
ok 9 - F2(b) F2-1: recognized closure phrase → skip-application
ok 10 - F2(b) F2-2: "we've filled this role" with a body Apply link is NOT treated as live → human review
ok 11 - F2(b) F2-3: uncertain → human review, no application decision
ok 12 - F2(b) F2-4: thin page → skip-application, reason says thin content not explicit closure
ok 13 - F2(b) F2-5: "closed-loop" false positive costs a human review, never an automatic skip
ok 14 - F3: each company state is reported by its own name; blank is not zero; zero is not refusal; no merges; no p
ok 15 - F3: matching strips legal suffixes but never fuzzes
ok 16 - vacancy rule: refusal / offer / conditional / contradictory / silent / not-captured
ok 17 - T-timing: a missing timeline blocks the role and never reaches the scorer; a sample timeline is labeled unverified
ok 18 - sample run: two outputs, every value labeled, scenario scores separate from decisions
# tests 18
# pass 18
# fail 0
[exit=0]
```

## Expected CI outcome for this PR (until the actual checks run)

| Job | Expected | Why |
|---|---|---|
| conformance | pass | it passes locally (`node scripts/conformance.mjs`; manifest check with PyYAML) |
| contrib-scope | pass | protected paths: none; outside the namespaces: none |
| doctor-and-pii | **fail (inherited)** | the "PII scan (working tree)" step fails on upstream's own `package-lock.json` |
| harness-regression | **fail (inherited)** | its first step calls a script that does not exist upstream |

Workflows on PRs from forks may also wait for maintainer approval before they run.

## Pre-existing CI failures (not introduced by this branch)

**Upstream revision:** [`015843d`](https://github.com/nikbearbrown/the-reallocation-engine/commit/015843d5047dbadff05068495e4c5db5cd9945f4).
**Recorded upstream run:** [Contrib Gate run 35913366020](https://github.com/nikbearbrown/the-reallocation-engine/actions/runs/35913366020) (2026-09-23).

1. **`doctor-and-pii` → "PII scan (working tree)".**
   - [Job 107358546522](https://github.com/nikbearbrown/the-reallocation-engine/actions/runs/35913366020/job/107358546522): step 6 failed and step 7 (the diff scan) was skipped.
   - **Cause:** `package-lock.json` line 606 carries npm's deprecation text for `glob@10.5.0`, which includes a maintainer email address.
   - **Reproduced** with upstream's own scanner on an unchanged upstream checkout: [evidence 20](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/20-pii-upstream-revision.txt), [21](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/21-pii-upstream-ci-runs.txt), [44](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/44-final-checks.txt).
   - This branch's contribution-scoped scan is clean.
   - **Possible maintainer fixes:** update `glob` and regenerate the lockfile, or decide the scanner's policy for lockfile registry metadata.
2. **`harness-regression`.**
   - [Job 107358546085](https://github.com/nikbearbrown/the-reallocation-engine/actions/runs/35913366020/job/107358546085): step 5 failed.
   - **Cause:** 4 of the 6 harness scripts named in `.github/workflows/contrib-gate.yml` do not exist at `015843d`: `scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`, `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`.
   - **Reproduced** (`MODULE_NOT_FOUND`) on this branch and on unchanged upstream: [evidence 22](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/22-harness-regression-upstream.txt), [44](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/44-final-checks.txt).
3. **Further inherited observation, in steps CI never reaches.** Locally (Node 22), the two harnesses that do exist pass their own checks. But `scripts/score/gate-behavior-harness.mjs` does not end with a line containing `VALID`, and `scripts/score/gate-harness.mjs` prints no `17/17 passed`. So those CI grep steps would likely fail even after item 2 is fixed. This has not been verified on CI ([evidence 44](https://github.com/aditya-raj-sde/the-reallocation-engine/blob/contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027/course/2026fa/submissions/aditya-raj-sde/evidence/44-final-checks.txt)).

This PR changes none of those files.

## Honest limits

- Cannot establish that any opening will be sponsored.
- The CSV counts have unspecified time coverage.
- Liveness values are point-in-time.
- The wording rules miss paraphrases.
- Timing and fit are labeled sample inputs.
- 8 of the 9 sample postings are synthetic.

See the recipe's "What it cannot verify".

🤖 Generated with [Claude Code](https://claude.com/claude-code)
