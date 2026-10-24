# Replacement PR description (Assignment 2)

> Publication approved by Aditya Raj, 2026-10-21 (FRICTIONAL E30). This file is the body posted to the PR.

**Title:** `2026fa aditya-raj-sde: Experienced Java Backend Opening Triage (Early-2027 Start) — Assignment 2 mode, RUNNABLE-SAMPLE`

## Executive summary

This PR adds a working screening "mode" for an experienced Java/Spring backend candidate who will
need sponsorship and can start in early 2027. It reads each job posting's own words: stated
experience (total career kept apart from skill-specific years and co-op time), start constraints,
stack evidence, sponsorship, citizenship, and export-control wording, and whether the posting is
listed.

- **12 development postings:** 2 skipped for stated minimums above everything the test candidate
  has worked; 10 sent to a person with the quoted reason.
- **6 unseen postings, checked once with frozen rules v0.4.0:** 40/48 checks and 4/6 final steps
  agreed with **Claude-reviewed expectations** written before the run. That is agreement with the
  rules' author, not independently established accuracy. The misses (an export-control clause in a
  heading line, plus two vocabulary/precedence gaps) were then repaired in v0.4.1. The repaired rerun
  (47/48, 6/6) is **development evidence**.

This PR **replaces PR #45** (Assignment 1), whose work is included unchanged as the base of this
branch.

## What this PR adds

Component: `java-backend-early2027` (Job-Ops liveness + 80 Days context + visa-timeline gate).

Branch: `contrib/2026fa-aditya-raj-sde-java-backend-early2027` · This is my ONLY open PR: [x] yes — PR #45 (Assignment 1) is closed immediately after this PR is created, with a cross-link; its graded commit `1a618e7` and branch are preserved.

Maintained file I deliberately patch: **none**.

**Deferred, not built** (human scope decisions, recipe § Proposed additions):
- application-question capture — so the sponsorship checks see the posting body only;
- a shared `liveness-core.mjs` patch for HTTP 403 challenge pages — this mode treats them as unknown locally.

### Inherited from Assignment 1 (unchanged; graded at `1a618e7`, PR #45, 91/100)

- Everything reachable from `1a618e7`: `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.{md,card.md}`,
  `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/`, `course/2026fa/submissions/aditya-raj-sde/*`
  (except `assignment-2/`), `logs/runs/2026fa-aditya-raj-sde-1.md`.
- No Assignment 1 file is modified by the new commits (`git diff --name-only 1a618e7..HEAD` lists no
  Assignment 1 path; evidence 27).

### New in Assignment 2 (commits after `1a618e7`)

- `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.{md,card.md}` — status **RUNNABLE-SAMPLE** (reports judged adequate by Aditya Raj, 2026-10-21), recipe v0.4.1, feature scope frozen; RUNNABLE-LIVE not sought.
- `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/`:
  - `collect.mjs`, `holdout.mjs`, `triage.mjs`, `checks.mjs`, `text.mjs`, `page-probe.mjs`,
    `excerpt-check.mjs`, `break-test.mjs`;
  - 77 tests;
  - 40 synthetic fixtures and 6 `BROKEN-*` mutants.
- `search/examples/tariq-lindqvist/` (+ `test-variants/`) — new fictional persona.
- `logs/runs/2026fa-aditya-raj-sde-2.md`.
- `course/2026fa/submissions/aditya-raj-sde/assignment-2/` — worked run, domain justification,
  sample and holdout protocols, Frictional log, review packet, excerpts, runs, evidence.

### Notes for the maintainer

- **Deviations from the assignment PDF** (repository contract governs): the branch name, the
  `recipes/cases/` location, the `course/…/submissions/` location, and a run log in
  `logs/runs/`. See `assignment-2/README.md` § "Where the PDF's deliverables actually are".
- **Persona path:** `search/examples/tariq-lindqvist/` (plus `test-variants/`) does not contain my
  handle. It stays there because the current rules require it:
  - `.github/workflows/contrib-gate.yml:85–86`: the contrib-scope allowlist includes
    `search/examples/` ("allowlist: contrib dirs, cases, runs, submissions, search/examples extension").
  - `DATA_CONTRACT.md` §Zero-Conditions (lines 108–117): "Fictional personas only … If no existing
    persona exercises the case your contribution needs, extend a persona or add a new fictional one
    under `search/examples/`."
  - `scripts/pii-scan.mjs:26`: `SANCTIONED = [/^search\/examples\//, /^resumes\//, /^merge-kit\//]`.
    Profile-shaped files (`profile.yml`, `gaps.md`) are flagged anywhere else, so moving them into
    my contribution folder would itself fail the privacy check.
  - **Conflicting wording:** `course/README.md:6` says "You may only create files under your own
    handle's directory", and `CONTRIBUTING.md:17` says "your handle is in every path". I followed
    DATA_CONTRACT and CI and flag the conflict here for the maintainer. The persona name is unique,
    so it does not collide with another student's files.
- **Real postings:** only short quoted lines are committed. Raw responses stayed in `private/`.

## Checklist (each box verified by Claude on Aditya's instruction; evidence in `assignment-2/evidence/`)

- [x] `npm run doctor` clean locally — last 3 lines below (Claude, evidence 31 and re-run at posting)
- [x] No real PII anywhere in this branch's history — fictional personas only (`pii-scan --diff upstream/main`: clean; Claude, evidence 31)
- [x] Run log added as `logs/runs/2026fa-aditya-raj-sde-2.md`; `logs/RUN_LOG.md` not edited (Claude, evidence 27)
- [x] Recipe + card under `recipes/cases/2026fa/` with honest lifecycle frontmatter: RUNNABLE-SAMPLE, `attestation: null`; reports judged adequate by Aditya Raj (E30)
- [x] Harness/tests green — real output below (Claude)
- [x] Diff touches only namespaced paths (Claude, evidence 27; persona path note below)
- [x] `npm run verify` passes locally (Claude, evidence 31; PyYAML from a local venv)

## Doctor output (last 3 lines — captured 2026-10-21 16:17 EDT by Claude)

```
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
```

## Harness output (captured 2026-10-21 16:17 EDT by Claude)

```
$ node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
# tests 77
# pass 77
# fail 0
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir $TMPDIR/pr-final
✓ 12 openings (replay-of-captured-excerpts) → human-eligibility-review 4 · human-liveness-review 4 · human-requirement-review 2 · skip-application 2
  experience groups: satisfied+core 0 · unknown+core 2 · awaiting review 5 · documented mismatch 5 · passed/unknown, stack not core 0
$ node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs   (evidence 33)
ALL MUTANTS CAUGHT (6 mutants) · unmodified control 77/77
```

## Known CI status (inherited, not introduced)

- `doctor-and-pii` → the working-tree `pii-scan` flags the upstream `package-lock.json` address, the
  same as on unchanged upstream `015843d` (Assignment 1 TEST-REPORT, "Confirmed blocker 1"). The
  branch-history scan is clean.
- `harness-regression` → upstream test scripts missing (Assignment 1 TEST-REPORT, "Confirmed
  blocker 2"). Not re-verified for this PR.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
