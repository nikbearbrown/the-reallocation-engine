# PR description

## Executive summary

This is the draft pull-request text for the AI-startup triage mode. Opened as required by the Mode Build assignment ('Submit both'). CONTRIBUTING.md allows one open PR per student and my PR #10 is still open; I have asked the instructor to confirm, and will close or merge either PR as directed. The mode makes a startup's funding runway and the H-1B timeline hard gates before any score. It ships with a recipe, a human card, a tested pre-filter script, and a real sample run. It is honest DRAFT status with five open items. The last section lists where it departs from the assignment spec and why.

---

**Title:** contrib(2026fa): gnanasudharsan-ai-startup-formd — AI-startup triage with funding + visa-timeline gates — DRAFT (sample run)

## What this PR adds

`ai-startup-formd` is a pre-filter in front of the engine's scorer, at the evidence-gating layer. For a student who will need H-1B and targets AI Engineer roles at funded startups (demonstrated with the fictional persona Ananya Rao, `search/examples/ananya-rao/`), it checks three things before scoring:
- funding health: latest round ≥ $5M, within 24 months;
- a three-state visa-timeline gate: last round + 24 months against 2027-04-01 and 2027-10-01;
- posting liveness.

Postings that fail are held or excluded with reason codes. The rest go to the **unchanged** `scripts/score/role-scorer.mjs`. A human report carries the snapshot caveat on every funding conclusion.

Branch: `contrib/2026fa-gnanasudharsan-ai-startup-formd` · This is my ONLY open PR: [ ] yes — **no**: [nikbearbrown/the-reallocation-engine#10](https://github.com/nikbearbrown/the-reallocation-engine/pull/10) (de-mlops-h1b) is open. Opened as required by the Mode Build assignment ('Submit both'). CONTRIBUTING.md allows one open PR per student and my PR #10 is still open; I have asked the instructor to confirm, and will close or merge either PR as directed.
Maintained file I deliberately patch (or "none"): `search/examples/README.md` (one persona-table row for Ananya Rao)

## Files

- `recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md` + `.card.md`
- `scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/`: `ai-startup-formd.mjs`, `ai-startup-formd.test.mjs`, and `fixtures/` (fictional)
- `search/examples/ananya-rao/`: `profile.yml`, `gaps.md`, `resume.example.json` (fictional persona) + one row in `search/examples/README.md`
- `course/2026fa/submissions/gnanasudharsan/mode-build/`:
  - `domain-justification.md`, `worked-run.md`, `RUN_LOG-entry.md`, `presentation-notes.md`, this file
  - `runs/2026-10-20-run3a-prefix/` (pre-fix checks, reconstructed — bug evidence) and `runs/2026-10-20-run3b/`
- `logs/runs/2026fa-gnanasudharsan-2.md`

## Checklist (CI re-checks every box; an unchecked box is an auto-request-changes)

- [x] `npm run doctor` clean locally — paste the last 3 lines below
- [x] **No real PII anywhere in this branch's history** — fictional personas from `search/examples/` only (DATA_CONTRACT §Zero-Conditions). If I ever committed real data, I re-cut the branch; deleting the file later is NOT enough.
- [x] Run log added as `logs/runs/<term>-<handle>-<n>.md`; I did NOT edit `logs/RUN_LOG.md`
- [x] Recipe + card pair under `recipes/cases/<term>/` with honest lifecycle frontmatter (status matches evidence; attestation only if a human signed)
- [x] My harness/tests are green — real output pasted below, not described
- [x] Diff touches only my namespaced paths (+ the one declared maintained file)
- [x] `npm run verify` passes locally

## Doctor output (last 3 lines, pasted)

```
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
```

## Harness output (pasted, not described)

```
$ node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 512.119333
```

## Deviations from the assignment spec

| Assignment spec (`course/summer-2026/reallocation-engine-mode-build.md`) | This PR | Why |
|---|---|---|
| Branch `mode/<yourname>-<domain>` (:157) | `contrib/2026fa-gnanasudharsan-ai-startup-formd` | `CONTRIBUTING.md` (Fall 2026) requires `contrib/<term>-<handle>-<component>`, and CI checks paths against it. |
| Mode file under `recipes/` (:158) | `recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md` + `.card.md` | `CONTRIBUTING.md` and `recipes/cases/README.md`: student recipes are born in `recipes/cases/<term>/` and reach top-level `recipes/` only by maintainer promotion. |
| Justification and worked run under `assignments/submissions/<yourname>/` (:158) | `course/2026fa/submissions/gnanasudharsan/mode-build/` | `assignments/` does not exist in the repository; `CONTRIBUTING.md` names `course/<term>/submissions/<handle>/`. The `mode-build/` subfolder separates this from the earlier de-mlops submission. |
| A log entry for `logs/RUN_LOG.md` | `logs/runs/2026fa-gnanasudharsan-2.md`, plus a copy as `RUN_LOG-entry.md` in the submission folder | `logs/RUN_LOG.md` says students must not edit it and CI rejects PRs that do; the assignment allows the entry to be included in the submission. |
| (implicit) one PR | a second open PR | Opened as required by the Mode Build assignment ('Submit both'). CONTRIBUTING.md allows one open PR per student and my PR #10 is still open; I have asked the instructor to confirm, and will close or merge either PR as directed. |

The conflict between the summer spec and `CONTRIBUTING.md` is logged as a defect in `logs/runs/2026fa-gnanasudharsan-2.md`.

## Lifecycle

`status: DRAFT`, `todos_open: 5`, `attestation: null`.
- `last_gate` records the G-TIMELINE clearance for sample scoring only.
- The sample run is evidence for the next transition, not a promotion.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
