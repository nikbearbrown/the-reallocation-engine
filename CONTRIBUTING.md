# Contributing — Fall 2026 and beyond

This is the course's standing default project. Every semester, students either
contribute here or build their own project to the same standard. This document
is the contribution contract; CI enforces it (`.github/workflows/contrib-gate.yml`).

## Where your work goes (and nowhere else)

| What | Where |
|---|---|
| Code + tests + fixtures | `scripts/contrib/<term>/<your-github-handle>-<component>/` |
| Recipe + card pair | `recipes/cases/<term>/<handle>-<slug>.md` + `.card.md` |
| Run-log entries | `logs/runs/<term>-<handle>-<n>.md` — **never** edit `logs/RUN_LOG.md` |
| Justification / worked run / reports | `course/<term>/submissions/<handle>/` |
| A deliberate patch to ONE maintained file | allowed, declared in your PR body |

Path collisions are impossible by construction: your handle is in every path.

## Branch and PR discipline

- Branch: `contrib/<term>-<handle>-<component>` (e.g. `contrib/2026fa-skini-gate-harness`).
- **One open PR per student.** Superseding work updates the same branch; if you
  must open a new PR, close the old one in the same action with a link.
- The PR template checklist is not decoration — CI re-checks every box.
- Keep the diff scoped: a PR touching another student's namespace, shared logs,
  `chapters/`… fails the contrib gate.

## The privacy contract (zero-condition)

Read `DATA_CONTRACT.md §Zero-Conditions` before your first commit. Short form:
no real resume, email, phone, or contact info anywhere in your branch's
HISTORY — deleting a file later does not remove it from history; the only fix
is re-cutting the branch. Demos and fixtures use the fictional personas in
`search/examples/` and `resumes/` only. Your real data lives untracked in
`private/` and `search/`. CI scans the full branch diff, not just the tree.

## Before you push (all local, all fast)

    npm run verify        # conformance + generated-adapter sync
    npm run doctor        # environment + tracked-PII hard fail
    node scripts/pii-scan.mjs             # what CI will run against your branch
    <your harness/tests>  # paste the real output into the PR

## The engine API

Harnesses import `scripts/score/role-scorer.mjs`'s exports (`CONFIG`, `SRC`,
`applyProfile`, `scoreRole`) or run the CLI and read `role-scores.json`. Do
NOT re-implement the composite to test it — a harness that tests its own
re-implementation tests nothing (a documented Summer 2026 failure mode).
Mutant scorers for break attempts live in your `fixtures/` as `BROKEN-*`.

## Promotion

A contribution a maintainer adopts moves into `scripts/<domain>/` in a
maintainer commit, earns its package.json script then, and its recipe is
promoted out of `recipes/cases/`. That judgment step is the pedagogy: humans
decide release (SNICKERDOODLE P1).
