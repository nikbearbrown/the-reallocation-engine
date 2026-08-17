---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# employer-risk-index -- Job Stability And Trust Signals

## Purpose

Adapted from consumer trust/anxiety and brand risk recipes. Use this recipe to flag employer risks that may affect job-search decisions: public backlash, regulatory pressure, customer trust erosion, layoffs, product failures, service quality problems, or leadership instability.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/employer-risk-index.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Target employers | Markdown/CSV | Tracker, pipeline, or approved target list | Yes |
| Risk signal sources | RSS/API/local export | `[TODO: DATA SOURCE] layoffs, regulatory, customer trust, incident, or reputation sources` | Yes |
| Risk rubric | JSON/Markdown | `[TODO: DEFINE] define severity, recency, source reliability, and job-search impact` | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/employer-risk-index.md" && rg -n "\[TODO: DEFINE]" "recipes/employer-risk-index.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/employer-risk-index/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/employer-risk-index data/verified/employer-risk-index -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/employer-risk-index-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/employer-risk-index.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/employer-risk-index-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/employer-risk-index.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/employer-risk-index-[DATE].json && test -f reports/generated/employer-risk-index-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/employer-risk-index-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/employer-risk-index-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/employer-risk-index/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/employer-risk-index-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/employer-risk-index/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/employer-risk-index-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/employer-risk-index/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/employer-risk-index-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/employer-risk-index-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `employer-risk-index`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/employer-risk-index-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/employer-risk-index-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `employer-risk-index -- Job Stability And Trust Signals` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if risk rubric is missing.
- Stop if evidence URLs are missing.
- Stop if a company is marked skip automatically without human review.
- Stop if private employee/customer data appears in source records.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run employer-risk-index --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run employer-risk-index --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run employer-risk-index --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run employer-risk-index --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run employer-risk-index --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run employer-risk-index --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run employer-risk-index --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run employer-risk-index --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate employer-risk-index --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate employer-risk-index --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate employer-risk-index --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate employer-risk-index --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate employer-risk-index --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate employer-risk-index --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/employer-risk-index-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/employer-risk-index-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/employer-risk-index-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/employer-risk-index-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/employer-risk-index-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/employer-risk-index-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/employer-risk-index/` | JSON |
| Verified data | `data/verified/employer-risk-index/` | JSON |
| Agent log | `logs/employer-risk-index-[DATE].json` | JSON |
| Human report | `reports/generated/employer-risk-index-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/ats/applications.md` | `test -f "data/ats/applications.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/deep.md` | `test -f "recipes/deep.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/tracker.md` | `test -f "recipes/tracker.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Load target employers.
2. Collect risk signals from approved sources.
3. Normalize into company, risk type, date, severity, source, and evidence.
4. Score risk using the rubric.
5. Compare against current application/tracker status.
6. Recommend keep, monitor, research, pause, or skip.
