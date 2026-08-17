---
status: DRAFT
todos_open: 12
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# rd-hiring-signal -- Patent And Innovation Signals For Job Search

## Purpose

Adapted from innovation positioning and patent velocity tracking. Use this recipe to identify companies investing in AI, cloud, robotics, cybersecurity, biotech, semiconductors, or other R&D-heavy areas that may imply future hiring needs.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/rd-hiring-signal.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Company or sector watchlist | JSON/Markdown | `[TODO: DATA SOURCE] approved company or technology-area list` | Yes |
| Patent or innovation records | JSON/API/local export | `[TODO: DATA SOURCE] USPTO, Google Patents, Lens, company R&D news, or local export` | Yes |
| Hiring relevance rubric | JSON/Markdown | `[TODO: DEFINE] define why an innovation signal matters for target roles` | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/rd-hiring-signal.md" && rg -n "\[TODO: DEFINE]" "recipes/rd-hiring-signal.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/rd-hiring-signal/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/rd-hiring-signal data/verified/rd-hiring-signal -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/rd-hiring-signal-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/rd-hiring-signal.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/rd-hiring-signal-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/rd-hiring-signal.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/rd-hiring-signal-[DATE].json && test -f reports/generated/rd-hiring-signal-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/rd-hiring-signal-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/rd-hiring-signal-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/rd-hiring-signal/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/rd-hiring-signal-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/rd-hiring-signal/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/rd-hiring-signal-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/rd-hiring-signal/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/rd-hiring-signal-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/rd-hiring-signal-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `rd-hiring-signal`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/rd-hiring-signal-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/rd-hiring-signal-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `rd-hiring-signal -- Patent And Innovation Signals For Job Search` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if assignee/company mapping is uncertain.
- Stop if patent activity is treated as proof of immediate hiring.
- Stop if target-role relevance rubric is missing.
- Stop if source URLs are missing.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run rd-hiring-signal --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run rd-hiring-signal --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run rd-hiring-signal --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run rd-hiring-signal --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run rd-hiring-signal --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run rd-hiring-signal --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run rd-hiring-signal --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run rd-hiring-signal --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate rd-hiring-signal --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate rd-hiring-signal --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate rd-hiring-signal --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate rd-hiring-signal --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate rd-hiring-signal --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate rd-hiring-signal --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/rd-hiring-signal-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/rd-hiring-signal-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/rd-hiring-signal-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/rd-hiring-signal-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/rd-hiring-signal-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/rd-hiring-signal-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/rd-hiring-signal/` | JSON |
| Verified data | `data/verified/rd-hiring-signal/` | JSON |
| Agent log | `logs/rd-hiring-signal-[DATE].json` | JSON |
| Human report | `reports/generated/rd-hiring-signal-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `recipes/deep.md` | `test -f "recipes/deep.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/scan.md` | `test -f "recipes/scan.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/tracker.md` | `test -f "recipes/tracker.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Load company or sector watchlist.
2. Collect patent and innovation records.
3. Normalize into company, technology area, date, title, source, and assignee.
4. Score relevance to target roles.
5. Cross-check whether the company has relevant open roles.
6. Recommend scan/deep/tracker next steps.
