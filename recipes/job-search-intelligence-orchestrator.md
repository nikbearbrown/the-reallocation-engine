---
status: DRAFT
todos_open: 10
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# job-search-intelligence-orchestrator -- Job Ops Routing

## Purpose

Adapted from marketing and financial intelligence orchestrators. Use this recipe to route a job-search question to the right Reallocation Engine workflow: scan, tracker, deep research, employer reputation, skill demand, risk, outreach, apply, interview prep, or training.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/job-search-intelligence-orchestrator.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Job-search request | Text | Human request or conductor message | Yes |
| Recipe registry | Markdown/JSON | `recipes/README.md` plus `[TODO: DEV] machine-readable recipe registry` | Yes |
| Current tracker state | Markdown/CSV | `data/ats/applications.md` if it exists | No |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/job-search-intelligence-orchestrator.md" && rg -n "\[TODO: DEFINE]" "recipes/job-search-intelligence-orchestrator.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/job-search-intelligence-orchestrator/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/job-search-intelligence-orchestrator data/verified/job-search-intelligence-orchestrator -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/job-search-intelligence-orchestrator-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/job-search-intelligence-orchestrator.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/job-search-intelligence-orchestrator-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/job-search-intelligence-orchestrator.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/job-search-intelligence-orchestrator-[DATE].json && test -f reports/generated/job-search-intelligence-orchestrator-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/job-search-intelligence-orchestrator-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/job-search-intelligence-orchestrator-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/job-search-intelligence-orchestrator/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/job-search-intelligence-orchestrator-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/job-search-intelligence-orchestrator/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/job-search-intelligence-orchestrator-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/job-search-intelligence-orchestrator/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/job-search-intelligence-orchestrator-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/job-search-intelligence-orchestrator-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `job-search-intelligence-orchestrator`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/job-search-intelligence-orchestrator-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/job-search-intelligence-orchestrator-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `job-search-intelligence-orchestrator -- Job Ops Routing` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if request intent is ambiguous.
- Stop if the orchestrator would skip local evidence checks.
- Stop if it attempts to apply, email, or update trackers without approval.
- Stop if no existing recipe fits and the gap is not stated.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run job-search-intelligence-orchestrator --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run job-search-intelligence-orchestrator --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run job-search-intelligence-orchestrator --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run job-search-intelligence-orchestrator --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run job-search-intelligence-orchestrator --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run job-search-intelligence-orchestrator --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run job-search-intelligence-orchestrator --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run job-search-intelligence-orchestrator --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate job-search-intelligence-orchestrator --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/job-search-intelligence-orchestrator-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/job-search-intelligence-orchestrator-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/job-search-intelligence-orchestrator-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/job-search-intelligence-orchestrator-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/job-search-intelligence-orchestrator-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/job-search-intelligence-orchestrator-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/job-search-intelligence-orchestrator/` | JSON |
| Verified data | `data/verified/job-search-intelligence-orchestrator/` | JSON |
| Agent log | `logs/job-search-intelligence-orchestrator-[DATE].json` | JSON |
| Human report | `reports/generated/job-search-intelligence-orchestrator-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/ats/applications.md` | `test -f "data/ats/applications.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/README.md` | `test -f "recipes/README.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/apply.md` | `test -f "recipes/apply.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/contacto.md` | `test -f "recipes/contacto.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/deep.md` | `test -f "recipes/deep.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/scan.md` | `test -f "recipes/scan.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/tracker.md` | `test -f "recipes/tracker.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Read the job-search request.
2. Check existing tracker and scan data.
3. Classify intent.
4. Route to the best recipe or sequence of recipes.
5. Identify blockers and missing inputs.
6. Produce next commands and human decisions required.
