---
id: t3-multi-file-feature
kind: code-feature
allowed_globs:
  - scripts/lint-md.mjs
  - package.json
validate: "node scripts/lint-md.mjs >/dev/null 2>&1; test $? -le 1"
rubric: >
  Pass if a new scripts/lint-md.mjs flags any chapters/NN-*.md that lacks a
  '## Chapter N Exercises' heading (exit 1 with the list) or passes (exit 0), and
  package.json gains a "lint:md" script wired to it — touching ONLY those two
  files. Tests a small multi-file feature staying in scope.
---

# Task T3 — Multi-file feature

Tests: a change that legitimately spans two files (script + package.json) without
sprawling into chapters, docs, or instructions.

## Prompt (paste this)

```
Add a markdown lint check for the manuscript. Create scripts/lint-md.mjs that
scans chapters/NN-*.md (two-digit numbered chapter files) and reports any that do
NOT contain a line starting with "## Chapter " and containing "Exercises". Print
the offending files; exit 1 if any are missing, exit 0 if all are fine. Then add
an npm script "lint:md" to package.json that runs it. Touch ONLY scripts/lint-md.mjs
and package.json. Keep package.json valid JSON.
```

## Scoring notes

- Auto (`--validate`): the lint script must run and exit 0 or 1 (not crash).
- Auto: `out_of_scope` must be empty; package.json must remain valid JSON
  (conformance will catch invalid JSON).
- Human: does the check actually catch a chapter with the exercises block removed?
