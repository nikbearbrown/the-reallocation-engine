# Documentation Index

This directory is the human-facing documentation hub for The Reallocation
Engine. The root `README.md` explains the project; these files explain how to
operate and maintain it.

The repository is both a book and a verified-data job-search engine. Its docs
must help two audiences:

- humans who audit evidence, preserve judgment, and decide when work is safe;
- agents that need precise local context before running scripts or changing
  files.

## Start Here

- `repo-structure.md`: where files belong.
- `operations.md`: normal operating workflow and stop conditions.
- `data-and-provenance.md`: source data, generated data, privacy, and audit
  rules.
- `scripts.md`: maintained automation, command surface, and script promotion
  rules.
- `recipes.md`: agent-facing recipes and review checklist.
- `phase-gates.md`: gates for expanding automation safely.
- `manuscript.md`: how manuscript files relate to data, scripts, and recipes.
- `contributing.md`: checklist for repo changes.
- `Documentation.md`: standard for writing future docs.

## Operating Chain

Use this sequence for meaningful work:

1. Read the relevant local docs.
2. Check verified local data and audits.
3. Check maintained scripts.
4. Run the smallest useful test.
5. Verify outputs against source evidence.
6. Preserve human review for high-impact judgment.
7. Log meaningful runs in `logs/RUN_LOG.md`.

The engine's short rule still governs everything: run the script and read the
audit before you prompt.

## Durable Records

Do not rely on chat history as the only record for decisions, data changes, or
workflow runs. Durable records belong in:

- `logs/RUN_LOG.md`;
- generated `*-audit.md` files next to inspected data;
- documentation under `docs/`;
- manuscript planning files such as `CHAPTER-RESEARCH-MAP.md`, `architecture.md`,
  and `RESTRUCTURE-PLAN.md` when the decision affects the book.
