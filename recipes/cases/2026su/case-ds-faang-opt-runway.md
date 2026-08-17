---
status: DRAFT
todos_open: 13
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# Data Science OPT Runway for FAANG-Tier Companies

## Purpose

Checks whether FAANG-tier Data Science or ML roles provide a realistic OPT-to-H-1B path using sponsor history, SOC/cognitive score, filing lag, salary floor, and posting liveness. The recipe gives the student and a human reviewer enough evidence to decide which job-search actions are worth continuing, which require manual verification, and which should stop before more OPT time is spent.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| input_1 | URL list / text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_2 | text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_3 | text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/case-ds-faang-opt-runway.md" && rg -n "\[TODO: DEFINE]" "recipes/case-ds-faang-opt-runway.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/case-ds-faang-opt-runway/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/case-ds-faang-opt-runway data/verified/case-ds-faang-opt-runway -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/case-ds-faang-opt-runway-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/case-ds-faang-opt-runway.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/case-ds-faang-opt-runway-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/case-ds-faang-opt-runway.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/case-ds-faang-opt-runway-[DATE].json && test -f reports/generated/case-ds-faang-opt-runway-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/case-ds-faang-opt-runway-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/case-ds-faang-opt-runway-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/case-ds-faang-opt-runway/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-ds-faang-opt-runway-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/case-ds-faang-opt-runway/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-ds-faang-opt-runway-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/case-ds-faang-opt-runway/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/case-ds-faang-opt-runway-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/case-ds-faang-opt-runway-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-ds-faang-opt-runway`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/case-ds-faang-opt-runway-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/case-ds-faang-opt-runway-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `Data Science OPT Runway for FAANG-Tier Companies` run.
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
`snickerdoodle run case-ds-faang-opt-runway --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run case-ds-faang-opt-runway --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run case-ds-faang-opt-runway --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run case-ds-faang-opt-runway --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run case-ds-faang-opt-runway --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run case-ds-faang-opt-runway --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run case-ds-faang-opt-runway --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run case-ds-faang-opt-runway --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate case-ds-faang-opt-runway --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/case-ds-faang-opt-runway-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/case-ds-faang-opt-runway-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/case-ds-faang-opt-runway-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/case-ds-faang-opt-runway-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/case-ds-faang-opt-runway-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/case-ds-faang-opt-runway-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/case-ds-faang-opt-runway/` | JSON |
| Verified data | `data/verified/case-ds-faang-opt-runway/` | JSON |
| Agent log | `logs/case-ds-faang-opt-runway-[DATE].json` | JSON |
| Human report | `reports/generated/case-ds-faang-opt-runway-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Known Evidence From Submission

- Sponsor history and salary evidence from local sponsorship data.
- SOC/cognitive score from BLS data.
- Posting liveness from Job-Ops.

### Cannot Verify Without More Work

- Year-1 filing lag until DOL LCA timing script exists.
- Internal team policy or headcount approval.
- Exact SOC mapping for ambiguous Data Analyst vs Data Scientist titles.

### Original Workflow Notes

- Verify DOCX and PPTX source files exist.
- Record OPT clock and filing deadline in run envelope.
- Check H-1B history for employer/role family.
- Map SOC and pull cognitive/role-quality data.
- Check salary-floor evidence where available.
- Run liveness for job URL.
- Label filing-lag fields as proposed unless implemented.
- Rank green, amber, or red with reason.

### Proposed Or Missing Tools

- `scripts/h1b/lca-filing-lag.py`
- `scripts/jobops/salary-floor.py`
