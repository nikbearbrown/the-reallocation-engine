# Shared Mode Contract

These modes are student-facing operating recipes for The Reallocation Engine.
They are not a substitute for the verified datasets and maintained scripts in
`SCRIPTS/`.

## Prime Directive

Use collected data and tested scripts first. Use prompting only to explain,
summarize, draft, or make bounded judgments after the relevant data has been
checked.

Do not turn a mode into "ask the model what it thinks" when a script, audit, or
source dataset can answer the question.

## Sources of Truth

| Source | Path | Use |
|---|---|---|
| Data contract | `DATA_CONTRACT.md` | Ownership rules for source data, generated data, scripts, and private files. |
| Repo guide | `README.md` | Current inventory, build status, and next steps. |
| Script guide | `SCRIPTS/README.md` | Maintained script subsystem map. |
| SEC scripts | `SCRIPTS/sec/` | SEC Form D refresh, entity resolution, validation. |
| ATS scripts | `SCRIPTS/ats/` | ATS detection, provider scanning, job liveness, tracker integrity. |
| BLS scripts | `SCRIPTS/bls/` | SOC/O*NET/OEWS compact extracts and role-quality features. |
| Resume scripts | `SCRIPTS/resumes/` | Markdown CV to PDF generation. |
| 80 Days data | `data/80-days-to-stay/` | Sponsorship/company source data. |
| BLS/O*NET data | `data/bls/` | Role-quality and labor-market source data. |
| SEC refresh data | `data/sec/form-d/` | Recent Form D source and processed output. |
| ATS working data | `data/ats/` | Scanner config, pipeline, tracker, and ATS outputs. |
| Project drafts | `projects/` | Research plans and paper/workstream specifications. |
| Run log | `modes/RUN_LOG.md` | Human-readable history of what was run, what worked, and what failed. |

## Verified-Data Rules

1. Prefer scripts in `SCRIPTS/` over ad hoc prompt reasoning.
2. Prefer generated `*-audit.md` reports over memory.
3. When a file already has an audit, read the audit before proposing new work.
4. Never invent counts, rates, match quality, confidence, or coverage.
5. If raw data is missing, say it is missing and log the blocker.
6. If a result comes from an LLM judgment, label it as such.
7. Do not overwrite source/reference data in `data/80-days-to-stay/` or
   `data/bls/`.
8. Maintained automation belongs under `SCRIPTS/`.
9. Reports go next to the data they inspect and use `-audit.md`.
10. Generated private/user-specific job-search files in `data/ats/` require
    review before commit.

## Logging Rules

Update `modes/RUN_LOG.md` whenever a mode:

- runs a script against real data;
- creates or updates an audit/report;
- changes a tracker or pipeline file;
- finds a blocker;
- makes a decision about what not to use;
- changes a generated artifact such as a PDF.

Log entries should be short and concrete:

```markdown
## YYYY-MM-DD — Short task name

- **Mode:** scan | pipeline | oferta | pdf | tracker | research | manual
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
python3 SCRIPTS/audit_sec_dol_h1b_data.py
python3 SCRIPTS/sec/download_form_d_quarters.py --quarters 2025Q2 2025Q3 2025Q4 2026Q1 --user "Name email@example.com"
python3 SCRIPTS/sec/refresh_recent_sec_quarters.py
python3 SCRIPTS/sec/validate_h1b_join_sample.py
python3 SCRIPTS/sec/entity_resolution.py --help
```

### ATS

```bash
cd SCRIPTS/ats
python3 detect_ats.py "Databricks, Inc." "Anthropic"
python3 detect_ats.py --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv --company-column company_name --output ../../data/ats/ats_detection.csv
```

```bash
npm run ats:scan -- --dry-run
npm run ats:liveness -- https://example.com/job/123
npm run ats:verify
```

### BLS/O*NET

```bash
python3 SCRIPTS/bls/extract_soc_occupation_table.py
```

### Resumes

```bash
npm run resumes:pdf -- --all
npm run resumes:pdf -- resumes/aarav-patel-cv.md
```

## Output Standards

Every mode response should include:

- what source data or script was used;
- what file was written or inspected;
- what is verified vs. inferred;
- what should be logged;
- what remains blocked.

For student work, prefer small reproducible steps over large narrative answers.

## Mode Status

These modes have been converted from legacy prompt recipes into verified
Reallocation Engine workflows. If a future mode references unsupported files or
commands, treat it as a draft and update it before use.
