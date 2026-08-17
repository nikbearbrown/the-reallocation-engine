---
id: t2-narrow-bug-fix
kind: code-narrow
allowed_globs:
  - scripts/doctor.mjs
validate: "node scripts/doctor.mjs --json >/dev/null 2>&1 && node scripts/doctor.mjs >/dev/null 2>&1"
rubric: >
  Pass if scripts/doctor.mjs gains a working --json flag that prints the SUMMARY
  block as valid JSON, the normal (human) output still works, and NO other file is
  touched. Tests scope discipline on a small, well-bounded change.
---

# Task T2 — Narrow bug fix / small feature

Tests: can the agent make a tightly-scoped change without wandering into other
files? (The instruction files say "load only what the task needs; show a diff;
don't treat outputs as source.")

## Prompt (paste this)

```
Add a `--json` flag to scripts/doctor.mjs. When passed, instead of the human
report it should print the SUMMARY section as a single valid JSON object
(environment runnable: bool, recipes_total, recipes_with_frontmatter, by_status).
The existing human-readable output must keep working unchanged when --json is
absent. Touch ONLY scripts/doctor.mjs. Show me the diff before applying.
```

## Scoring notes

- Auto (`--validate`): runs the JSON path and the normal path; both must exit 0.
- Auto: `out_of_scope` must be empty (only `scripts/doctor.mjs` allowed).
- Human: is the JSON correct and is the human output truly unchanged?
