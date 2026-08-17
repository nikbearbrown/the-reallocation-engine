# Operations

This document describes how to work in The Reallocation Engine without erasing
the distinction between automation and judgment.

## Required Reads

Before structural, data, script, or recipe work, read:

1. `README.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `DATA_CONTRACT.md`
5. `docs/repo-structure.md`
6. the relevant domain doc or script README

For recipe execution, also read `recipes/_shared.md` and the specific recipe file.

## Grounding Order

Use this order when making claims or changing files:

1. Verified local data in `data/`, including audits and source exports.
2. Maintained scripts in `scripts/` and documented `npm` commands.
3. Agent recipes in `recipes/`.
4. Human-facing docs in `docs/`.
5. Manuscript and planning files.
6. External lookup only when local evidence is missing, stale, or insufficient.

If external evidence conflicts with local records, document the conflict before
changing a claim or workflow.

## Standard Workflow

1. State the task and success condition.
2. Identify the local data, scripts, and recipe involved.
3. Run the smallest useful command or sample.
4. Inspect generated output and provenance.
5. Decide whether human review is required.
6. Update docs, recipes, scripts, data, or manuscript files.
7. Log meaningful runs in `logs/RUN_LOG.md`.

## Command Surface

Run commands from the repository root.

```bash
npm run ats:scan
npm run ats:liveness -- https://example.com/job/123
npm run ats:verify
npm run ats:merge
npm run ats:dedup
npm run ats:normalize
npm run resumes:pdf -- --all
npm run svg-to-png
```

Python workflows include:

```bash
python3 scripts/audit-sec-dol-h1b-data.py
python3 scripts/sec/download-form-d-quarters.py --quarters 2025Q2 2025Q3 2025Q4 2026Q1 --user "Name email@example.com"
python3 scripts/sec/refresh-recent-sec-quarters.py
python3 scripts/sec/validate-h1b-join-sample.py
python3 scripts/bls/extract-soc-occupation-table.py
python3 scripts/ats/analyze-patterns.py
```

Prefer these maintained commands over ad hoc scripts.

## Human Judgment Points

Preserve human review when work involves:

- Apply / Consider / Skip decisions;
- sponsorship or visa-timeline interpretation;
- role quality or fit judgments;
- generated resumes or outreach;
- publication, commit, deletion, or batch automation;
- private ATS/job-search data;
- any claim that could be read as personalized legal, immigration, or financial
  advice.

## Completion Report

When work is complete, report:

- files changed;
- data or audits checked;
- scripts or package commands run;
- verification performed;
- remaining risks or unverified assumptions.

If no command was run, say so directly.
