---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# target-company-comparison -- Employer Fit Comparison

## Purpose

Adapted from competitive positioning and comparative analysis recipes. Use this recipe to compare target employers by role fit, tech stack, hiring momentum, public reputation, sponsorship clues, location constraints, and learning value.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/target-company-comparison.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Company shortlist | Markdown/CSV | `data/ats/applications.md` or `[TODO: DATA SOURCE] approved shortlist` | Yes |
| Job posting evidence | Markdown/CSV/HTML | ATS scan outputs or saved postings | Yes |
| Fit rubric | Markdown/JSON | `[TODO: DEFINE] define scoring for skills, sponsorship, location, growth, risk, and mission fit` | Yes |
| Company research | Markdown/JSON | employer reputation, funding, product, and tech-stack outputs | No |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/target-company-comparison.md" && rg -n "\[TODO: DEFINE]" "recipes/target-company-comparison.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/target-company-comparison/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/target-company-comparison data/verified/target-company-comparison -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/target-company-comparison-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/target-company-comparison.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/target-company-comparison-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/target-company-comparison.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/target-company-comparison-[DATE].json && test -f reports/generated/target-company-comparison-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/target-company-comparison-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/target-company-comparison-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/target-company-comparison/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/target-company-comparison-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/target-company-comparison/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/target-company-comparison-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/target-company-comparison/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/target-company-comparison-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/target-company-comparison-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `target-company-comparison`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/target-company-comparison-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/target-company-comparison-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `target-company-comparison -- Employer Fit Comparison` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if the rubric is missing.
- Stop if company evidence is too thin to compare honestly.
- Stop if the output ranks companies without showing unknown fields.
- Stop if recommendations are treated as facts rather than decision support.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run target-company-comparison --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run target-company-comparison --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run target-company-comparison --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run target-company-comparison --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run target-company-comparison --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run target-company-comparison --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run target-company-comparison --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run target-company-comparison --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate target-company-comparison --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate target-company-comparison --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate target-company-comparison --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate target-company-comparison --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate target-company-comparison --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate target-company-comparison --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/target-company-comparison-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/target-company-comparison-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/target-company-comparison-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/target-company-comparison-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/target-company-comparison-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/target-company-comparison-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/target-company-comparison/` | JSON |
| Verified data | `data/verified/target-company-comparison/` | JSON |
| Agent log | `logs/target-company-comparison-[DATE].json` | JSON |
| Human report | `reports/generated/target-company-comparison-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/ats/applications.md` | `test -f "data/ats/applications.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/deep.md` | `test -f "recipes/deep.md"` | Referenced source/evidence path from prior recipe text. |
| `recipes/tracker.md` | `test -f "recipes/tracker.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Workflow

1. Load target companies and roles.
2. Pull job posting evidence from scan/tracker outputs.
3. Pull optional company research signals.
4. Score each company against the fit rubric.
5. Produce a comparison table and notes for unknown fields.
6. Human chooses which companies move to apply, outreach, deep research, or skip.
