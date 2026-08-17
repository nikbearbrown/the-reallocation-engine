---
status: DRAFT
todos_open: 0
last_gate: null
attestation: null
recipe_version: 0.1.0
type: contract
---

# Shared Recipe Contract

These recipes are student-facing operating recipes for The Reallocation Engine.
They are not a substitute for the verified datasets and maintained scripts in
`scripts/`.

## Executive Summary

Every recipe serves two customers. Agents read the recipe to execute work:
required reads, commands, checks, outputs, stop conditions, and logging. Humans
read the recipe to understand what the agent is about to do, why it is safe, and
where human judgment still matters.

Each recipe should begin with a short human-readable summary, then provide
agent-executable instructions. If a workflow is not implemented as a tested
script, say so plainly.

## Prime Directive

Use collected data and tested scripts first. Use prompting only to explain,
summarize, draft, or make bounded judgments after the relevant data has been
checked.

Do not turn a recipe into "ask the model what it thinks" when a script, audit, or
source dataset can answer the question.

## Sources of Truth

| Source | Path | Use |
|---|---|---|
| Data contract | `DATA_CONTRACT.md` | Ownership rules for source data, generated data, scripts, and private files. |
| Repo guide | `README.md` | Current inventory, build status, and next steps. |
| Script guide | `scripts/README.md` | Maintained script subsystem map. |
| SEC scripts | `scripts/sec/` | SEC Form D refresh, entity resolution, validation. |
| ATS scripts | `scripts/ats/` | ATS detection, provider scanning, job liveness, tracker integrity. |
| BLS scripts | `scripts/bls/` | SOC/O*NET/OEWS compact extracts and role-quality features. |
| Resume scripts | `scripts/resumes/` | Markdown CV to PDF generation. |
| 80 Days data | `data/80-days-to-stay/` | Sponsorship/company source data. |
| BLS/O*NET data | `data/bls/` | Role-quality and labor-market source data. |
| SEC refresh data | `data/sec/form-d/` | Recent Form D source and processed output. |
| ATS working data | `data/ats/` | Scanner config, pipeline, tracker, and ATS outputs. |
| Project drafts | `projects/` | Research plans and paper/workstream specifications. |
| Run log | `logs/RUN_LOG.md` | Human-readable history of what was run, what worked, and what failed. |

## Verified-Data Rules

1. Prefer verified local data in `data/` over external lookup.
2. Prefer scripts in `scripts/` over ad hoc code or prompt reasoning.
3. Prefer generated `*-audit.md` reports over memory.
4. When a file already has an audit, read the audit before proposing new work.
5. Never invent counts, rates, match quality, confidence, or coverage.
6. If raw data is missing, say it is missing and log the blocker.
7. If no suitable stored script exists, say so before writing temporary code.
8. If a temporary script proves useful, recommend promoting it into `scripts/`
   after review.
9. If a result comes from an LLM judgment, label it as such.
10. Do not overwrite source/reference data in `data/80-days-to-stay/` or
   `data/bls/`.
11. Maintained automation belongs under lowercase `scripts/`.
12. Do not create or reference uppercase `SCRIPTS/`.
13. Reports go next to the data they inspect and use `-audit.md`.
14. Generated private/user-specific job-search files in `data/ats/` require
    review before commit.

## Phase Gates

Do not move to a later step until the earlier gate has passed.

1. **Problem gate:** The request names the thing being evaluated, generated, or
   changed.
2. **Local evidence gate:** Relevant local data, audits, metadata, and tracker
   files have been checked first, or the blocker is named.
3. **Stored script gate:** Relevant commands in `package.json` and scripts in
   `scripts/` have been checked first, or no suitable script exists.
4. **Small-run gate:** For batch or automated work, one small manual or
   semi-automated run passes before a larger run.
5. **Verification gate:** A test, audit, output file, diff, or reviewer check
   proves the step worked.
6. **Logging gate:** Meaningful changes, blockers, and generated artifacts are
   recorded in `logs/RUN_LOG.md`.

## Logging Rules

Update `logs/RUN_LOG.md` whenever a recipe:

- runs a script against real data;
- creates or updates an audit/report;
- changes a tracker or pipeline file;
- finds a blocker;
- makes a decision about what not to use;
- changes a generated artifact such as a PDF.

Log entries should be short and concrete:

```markdown
## YYYY-MM-DD — Short task name

- **Recipe:** scan | pipeline | oferta | pdf | tracker | research | manual
- **Inputs:** files or commands used
- **Outputs:** files created/updated
- **Result:** what worked
- **Open issues:** what did not work or what is still missing
```

Do not log secrets, personal phone numbers, real emails, or private application
notes.

## Current Script Commands

### SEC

```bash
python3 scripts/audit-sec-dol-h1b-data.py
python3 scripts/sec/download-form-d-quarters.py --quarters 2025Q2 2025Q3 2025Q4 2026Q1 --user "Name email@example.com"
python3 scripts/sec/refresh-recent-sec-quarters.py
python3 scripts/sec/validate-h1b-join-sample.py
python3 scripts/sec/entity-resolution.py --help
```

### ATS

```bash
cd scripts/ats
python3 detect-ats.py "Databricks, Inc." "Anthropic"
python3 detect-ats.py --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv --company-column company_name --output ../../data/ats/ats_detection.csv
```

```bash
npm run ats:scan -- --dry-run
npm run ats:liveness -- https://example.com/job/123
npm run ats:verify
```

### BLS/O*NET

```bash
python3 scripts/bls/extract-soc-occupation-table.py
```

### Resumes

```bash
npm run resumes:pdf -- --all
npm run resumes:pdf -- resumes/aarav-patel-cv.md
```

## Output Standards

Every recipe response should include:

- a human-readable executive summary;
- what source data or script was used;
- whether an existing stored script was preferred or why none fit;
- what file was written or inspected;
- what is verified vs. inferred;
- what gate passed or blocked the next step;
- what should be logged;
- what remains blocked.

For student work, prefer small reproducible steps over large narrative answers.

## Recipe Status

These recipes have been converted from legacy prompt recipes into verified
Reallocation Engine workflows. If a future recipe references unsupported files or
commands, treat it as a draft and update it before use.
