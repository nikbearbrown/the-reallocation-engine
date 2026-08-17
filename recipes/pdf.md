---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# pdf -- Generate ATS-Friendly CV PDFs

## Purpose

Generate ATS-friendly PDFs from approved Markdown CVs using the maintained resume script. Agents use this to run the formatting pipeline; humans use the summary to confirm no resume content is invented or silently altered.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/pdf.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Run envelope | JSON | `data/raw/pdf/run-envelope.json`; [TODO: DEFINE] specify exact fields for this workflow. | Yes |
| Local evidence | JSON / CSV / Markdown | Repo-local `data/`, `pantry/`, or approved source paths named in Source Inventory. | Yes |
| Human approval record | JSON | `logs/gate-decisions/`; [TODO: APPROVE] required before live network calls, external writes, publishing, email, model calls with sensitive data, or production database actions. | Yes for live mode |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/pdf.md" && rg -n "\[TODO: DEFINE]" "recipes/pdf.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/pdf/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/pdf data/verified/pdf -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/pdf-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/pdf.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/pdf-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/pdf.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/pdf-[DATE].json && test -f reports/generated/pdf-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/pdf-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/pdf-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/pdf/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/pdf-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/pdf/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/pdf-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/pdf/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/pdf-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/pdf-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pdf`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/pdf-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/pdf-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `pdf -- Generate ATS-Friendly CV PDFs` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if a required source path is missing or cannot be verified, because provenance is broken and the run would not be auditable.
- Stop if the run envelope lacks required fields, because script generation or scoring would require guessing.
- Stop if any live network call, external write, email, dashboard update, model call with sensitive data, or database action lacks explicit approval, because live action must remain human-gated.
- Stop if raw or verified outputs fail JSON/CSV parsing, because downstream GIGO, reports, and Snickerdoodle gates depend on shaped data.
- Stop if the human report cannot name its reader, decision enabled, and sections, because the output would not support a human boss decision.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run pdf --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run pdf --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run pdf --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run pdf --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run pdf --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run pdf --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run pdf --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run pdf --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate pdf --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate pdf --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate pdf --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate pdf --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate pdf --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate pdf --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/pdf-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/pdf-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/pdf-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/pdf-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/pdf-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/pdf-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/pdf/` | JSON |
| Verified data | `data/verified/pdf/` | JSON |
| Agent log | `logs/pdf-[DATE].json` | JSON |
| Human report | `reports/generated/pdf-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Choose the Markdown CV.
   - Use only anonymized examples or student-approved Markdown.
   - Do not use deleted original PDFs.

2. Inspect the Markdown.
   - Confirm the name, email, phone number, and links are fake or approved.
   - Confirm the content is plain text and ATS-friendly.

3. Generate the PDF.
   - If no output path is given, the script writes into `output/resumes/`.
   - If Playwright or Chromium is missing, record the failure and the needed
     dependency.

4. Verify the result.
   - Confirm the PDF file exists.
   - If possible, check page count and file size.

5. Log the run in `logs/RUN_LOG.md`.
