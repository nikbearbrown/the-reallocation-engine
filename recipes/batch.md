---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# batch -- Batch Triage Draft

## Purpose

Triage many URLs only after a small gated run proves the checks work. Agents use this to process repeated inputs; humans use the summary to confirm the agent is not scaling an untested workflow.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/batch.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Run envelope | JSON | `data/raw/batch/run-envelope.json`; [TODO: DEFINE] specify exact fields for this workflow. | Yes |
| Local evidence | JSON / CSV / Markdown | Repo-local `data/`, `pantry/`, or approved source paths named in Source Inventory. | Yes |
| Human approval record | JSON | `logs/gate-decisions/`; [TODO: APPROVE] required before live network calls, external writes, publishing, email, model calls with sensitive data, or production database actions. | Yes for live mode |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/batch.md" && rg -n "\[TODO: DEFINE]" "recipes/batch.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/batch/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/batch data/verified/batch -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/batch-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/batch.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/batch-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/batch.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/batch-[DATE].json && test -f reports/generated/batch-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/batch-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/batch-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/batch/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/batch-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/batch/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/batch-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/batch/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/batch-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/batch-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `batch`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/batch-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/batch-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `batch -- Batch Triage Draft` run.
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
`snickerdoodle run batch --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run batch --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run batch --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run batch --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run batch --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run batch --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run batch --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run batch --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate batch --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate batch --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate batch --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate batch --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate batch --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate batch --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/batch-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/batch-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/batch-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/batch-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/batch-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/batch-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/batch/` | JSON |
| Verified data | `data/verified/batch/` | JSON |
| Agent log | `logs/batch-[DATE].json` | JSON |
| Human report | `reports/generated/batch-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/ats/pipeline.md` | `test -f "data/ats/pipeline.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/oferta.md` | `test -f "recipes/oferta.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/pipeline.md` | `test -f "recipes/pipeline.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/scan.md` | `test -f "recipes/scan.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Extracted Notes

Triage many URLs only after a small gated run proves the checks work. Agents use
this to process repeated inputs; humans use the summary to confirm the agent is
not scaling an untested workflow.

- `recipes/_shared.md`
- `recipes/pipeline.md`
- `recipes/scan.md`
- `data/ats/pipeline.md`, if it exists
- `logs/RUN_LOG.md`

1. **Input gate:** URLs are stored in `data/ats/pipeline.md` or a named input
   file.
2. **Stored script gate:** Use `npm run ats:verify`, `ats:liveness`,
   `ats:dedup`, and `ats:normalize` before ad hoc scripts.
3. **Small-run gate:** Run liveness on a small sample before a large batch.
4. **Verification gate:** Record counts, failures, and output paths.
5. **Logging gate:** Log the batch in `logs/RUN_LOG.md`.
