---
status: DRAFT
todos_open: 14
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# OPT Timeline-Fit Company Targeting

## Purpose

Ranks companies by whether sponsorship history, job liveness, role quality, and hiring-cycle timing fit the student OPT and H-1B calendar. The recipe gives the student and a human reviewer enough evidence to decide which job-search actions are worth continuing, which require manual verification, and which should stop before more OPT time is spent.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| input_1 | text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_2 | text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_3 | URL list / text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/case-opt-timeline-fit-company-targeting.md" && rg -n "\[TODO: DEFINE]" "recipes/case-opt-timeline-fit-company-targeting.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/case-opt-timeline-fit-company-targeting/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/case-opt-timeline-fit-company-targeting data/verified/case-opt-timeline-fit-company-targeting -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/case-opt-timeline-fit-company-targeting-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/case-opt-timeline-fit-company-targeting.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/case-opt-timeline-fit-company-targeting-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/case-opt-timeline-fit-company-targeting.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/case-opt-timeline-fit-company-targeting-[DATE].json && test -f reports/generated/case-opt-timeline-fit-company-targeting-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/case-opt-timeline-fit-company-targeting-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/case-opt-timeline-fit-company-targeting-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/case-opt-timeline-fit-company-targeting/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-opt-timeline-fit-company-targeting-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/case-opt-timeline-fit-company-targeting/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-opt-timeline-fit-company-targeting-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/case-opt-timeline-fit-company-targeting/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/case-opt-timeline-fit-company-targeting-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/case-opt-timeline-fit-company-targeting-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-opt-timeline-fit-company-targeting`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/case-opt-timeline-fit-company-targeting-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/case-opt-timeline-fit-company-targeting-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `OPT Timeline-Fit Company Targeting` run.
Decision enabled: approve the run for the next phase, request source/schema fixes, or block live execution.
Sections: run summary, purpose, source inventory, inputs used, phase-gate results, steps completed, records seen, rejects, duplicates, flags, typed TODOs, human approvals, verified findings, inferred findings, decision recommendation.

## Stop Conditions

- Stop if a pantry source file is missing, because the conversion would no longer be traceable to the original submission.
- Stop if the student run envelope is missing timeline, target role, company, or URL fields, because scoring would require guessing.
- Stop if local sponsorship, BLS, or ATS evidence is missing and no [TODO: DATA SOURCE] fallback is documented, because the result would overstate verification.
- Stop if a proposed script is needed for a score and the script does not exist, because that score must remain inferred or manual.
- Stop before live network calls, external writes, immigration/legal guidance, or recruiter-policy conclusions unless the approval gate is passed.

## Snickerdoodle

### Run Commands
Full dialogic run:
`snickerdoodle run case-opt-timeline-fit-company-targeting --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run case-opt-timeline-fit-company-targeting --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run case-opt-timeline-fit-company-targeting --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run case-opt-timeline-fit-company-targeting --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run case-opt-timeline-fit-company-targeting --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run case-opt-timeline-fit-company-targeting --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run case-opt-timeline-fit-company-targeting --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run case-opt-timeline-fit-company-targeting --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate case-opt-timeline-fit-company-targeting --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/case-opt-timeline-fit-company-targeting-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/case-opt-timeline-fit-company-targeting-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/case-opt-timeline-fit-company-targeting-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/case-opt-timeline-fit-company-targeting-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/case-opt-timeline-fit-company-targeting-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/case-opt-timeline-fit-company-targeting-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/case-opt-timeline-fit-company-targeting/` | JSON |
| Verified data | `data/verified/case-opt-timeline-fit-company-targeting/` | JSON |
| Agent log | `logs/case-opt-timeline-fit-company-targeting-[DATE].json` | JSON |
| Human report | `reports/generated/case-opt-timeline-fit-company-targeting-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Known Evidence From Submission

- Historical sponsorship tier from mapped SEC/DOL data.
- Posting liveness from ATS checks.
- Role quality from SOC/BLS data.
- Calendar math against H-1B filing windows.

### Cannot Verify Without More Work

- Lottery outcome.
- Year-1 vs Year-2 filing policy without recruiter/HR confirmation.
- Cap-exempt eligibility without legal or employer review.

### Original Workflow Notes

- Verify all three source files exist.
- Copy timeline fields into the run envelope.
- Check sponsorship tier and approval evidence.
- Run ATS detection and liveness for current postings.
- Map target roles to SOC and cognitive-pivot evidence.
- Calculate timeline risk: safe, compressed, cap-subject mismatch, or cap-exempt/backup required.
- Produce ranked target table and recruiter-question checklist.

### Proposed Or Missing Tools

- [TODO: DEV] No dedicated workflow script exists yet; generate scripts only after the input and output schemas below are confirmed.
