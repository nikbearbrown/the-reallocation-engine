---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# hiring-momentum-monitor -- Market And Funding Signals For Job Search

## Purpose

Adapted from market momentum and funding intelligence. Use this recipe to find companies and sectors that may be hiring because of funding, product launches, new offices, partnerships, government contracts, or rapid category growth.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/hiring-momentum-monitor.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Sector or role lane | Text/JSON | `[TODO: DEFINE] target sector, SOC, or role family` | Yes |
| Momentum sources | RSS/API/local export | `[TODO: DATA SOURCE] funding, partnership, product-launch, office-expansion, or contract sources` | Yes |
| Job posting verification | ATS scan output | `data/ats/` scan outputs | No |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/hiring-momentum-monitor.md" && rg -n "\[TODO: DEFINE]" "recipes/hiring-momentum-monitor.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/hiring-momentum-monitor/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/hiring-momentum-monitor data/verified/hiring-momentum-monitor -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/hiring-momentum-monitor-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/hiring-momentum-monitor.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/hiring-momentum-monitor-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/hiring-momentum-monitor.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/hiring-momentum-monitor-[DATE].json && test -f reports/generated/hiring-momentum-monitor-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/hiring-momentum-monitor-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/hiring-momentum-monitor-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/hiring-momentum-monitor/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/hiring-momentum-monitor-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/hiring-momentum-monitor/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/hiring-momentum-monitor-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/hiring-momentum-monitor/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/hiring-momentum-monitor-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/hiring-momentum-monitor-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `hiring-momentum-monitor`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/hiring-momentum-monitor-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/hiring-momentum-monitor-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `hiring-momentum-monitor -- Market And Funding Signals For Job Search` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if role lane is undefined.
- Stop if funding or product news is presented as verified hiring.
- Stop if source URLs are missing.
- Stop if new targets would be added to tracker without human approval.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run hiring-momentum-monitor --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run hiring-momentum-monitor --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run hiring-momentum-monitor --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run hiring-momentum-monitor --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run hiring-momentum-monitor --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run hiring-momentum-monitor --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run hiring-momentum-monitor --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run hiring-momentum-monitor --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate hiring-momentum-monitor --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate hiring-momentum-monitor --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate hiring-momentum-monitor --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate hiring-momentum-monitor --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate hiring-momentum-monitor --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate hiring-momentum-monitor --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/hiring-momentum-monitor-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/hiring-momentum-monitor-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/hiring-momentum-monitor-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/hiring-momentum-monitor-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/hiring-momentum-monitor-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/hiring-momentum-monitor-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/hiring-momentum-monitor/` | JSON |
| Verified data | `data/verified/hiring-momentum-monitor/` | JSON |
| Agent log | `logs/hiring-momentum-monitor-[DATE].json` | JSON |
| Human report | `reports/generated/hiring-momentum-monitor-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `recipes/patterns.md` | `test -f "recipes/patterns.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/scan.md` | `test -f "recipes/scan.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/tracker.md` | `test -f "recipes/tracker.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Define sector or role lane.
2. Collect momentum signals.
3. Normalize records into company, signal type, date, source, and relevance.
4. Match companies against existing tracker or scan history.
5. Mark companies as new targets, already tracked, or not relevant.
6. Human chooses which companies enter `scan`, `deep`, or `contacto`.
