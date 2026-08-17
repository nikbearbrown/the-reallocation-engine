---
status: DRAFT
todos_open: 12
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# sector-health-dashboard -- Job Market Category Sentiment

## Purpose

Adapted from category sentiment dashboards and market sentiment analysis. Use this recipe to decide whether a job-search sector is expanding, cooling, unstable, or noisy based on public signals, job postings, funding, layoffs, and news sentiment.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/sector-health-dashboard.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Sector list | JSON/Markdown | `[TODO: DEFINE] approved sectors or SOC/role families` | Yes |
| Sector signals | JSON/CSV/RSS | `[TODO: DATA SOURCE] postings, layoffs, funding, news, BLS, or SEC/H-1B mapped data` | Yes |
| Dashboard schema | JSON/Markdown | `[TODO: DEV] define fields, date buckets, and score formulas` | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/sector-health-dashboard.md" && rg -n "\[TODO: DEFINE]" "recipes/sector-health-dashboard.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/sector-health-dashboard/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/sector-health-dashboard data/verified/sector-health-dashboard -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/sector-health-dashboard-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/sector-health-dashboard.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/sector-health-dashboard-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/sector-health-dashboard.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/sector-health-dashboard-[DATE].json && test -f reports/generated/sector-health-dashboard-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/sector-health-dashboard-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/sector-health-dashboard-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/sector-health-dashboard/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/sector-health-dashboard-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/sector-health-dashboard/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/sector-health-dashboard-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/sector-health-dashboard/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/sector-health-dashboard-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/sector-health-dashboard-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `sector-health-dashboard`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/sector-health-dashboard-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/sector-health-dashboard-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `sector-health-dashboard -- Job Market Category Sentiment` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if sector definitions are vague.
- Stop if dashboard formulas are missing.
- Stop if the report recommends sector shifts without showing evidence.
- Stop if old data is mixed with current data without date labels.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run sector-health-dashboard --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run sector-health-dashboard --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run sector-health-dashboard --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run sector-health-dashboard --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run sector-health-dashboard --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run sector-health-dashboard --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run sector-health-dashboard --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run sector-health-dashboard --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate sector-health-dashboard --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate sector-health-dashboard --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate sector-health-dashboard --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate sector-health-dashboard --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate sector-health-dashboard --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate sector-health-dashboard --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/sector-health-dashboard-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/sector-health-dashboard-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/sector-health-dashboard-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/sector-health-dashboard-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/sector-health-dashboard-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/sector-health-dashboard-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/sector-health-dashboard/` | JSON |
| Verified data | `data/verified/sector-health-dashboard/` | JSON |
| Agent log | `logs/sector-health-dashboard-[DATE].json` | JSON |
| Human report | `reports/generated/sector-health-dashboard-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `recipes/deep.md` | `test -f "recipes/deep.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/patterns.md` | `test -f "recipes/patterns.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/scan.md` | `test -f "recipes/scan.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Define sectors or role families.
2. Collect job postings and external sector signals.
3. Normalize records by sector, date, signal type, and source.
4. Aggregate into trend buckets.
5. Produce sector health classifications.
6. Human chooses which sectors to prioritize, monitor, or pause.
