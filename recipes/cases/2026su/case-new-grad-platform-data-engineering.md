---
status: DRAFT
todos_open: 14
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# Yu-Chen Huang / New-Grad Platform Data Engineering Sponsor Filter

## Purpose

Prioritizes platform and infrastructure data engineering employers for new grads by sponsorship volume, funding recency, salary evidence, SOC 15-1243 role quality, and current job availability. The recipe gives the student and a human reviewer enough evidence to decide which job-search actions are worth continuing, which require manual verification, and which should stop before more OPT time is spent.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |
| Pantry source | file | `pantry/[anonymized source — re-attach an anonymized copy]` | Confirm the source exists, is complete, and is allowed to be used before converting claims into implementation requirements. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| input_1 | CSV / text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_2 | URL list / text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |
| input_3 | text | Student run envelope or pantry evidence. [TODO: DEFINE] Specify exact field name and accepted format. | Yes |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/case-new-grad-platform-data-engineering.md" && rg -n "\[TODO: DEFINE]" "recipes/case-new-grad-platform-data-engineering.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/case-new-grad-platform-data-engineering/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/case-new-grad-platform-data-engineering data/verified/case-new-grad-platform-data-engineering -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/case-new-grad-platform-data-engineering-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/case-new-grad-platform-data-engineering.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/case-new-grad-platform-data-engineering-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/case-new-grad-platform-data-engineering.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/case-new-grad-platform-data-engineering-[DATE].json && test -f reports/generated/case-new-grad-platform-data-engineering-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/case-new-grad-platform-data-engineering-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/case-new-grad-platform-data-engineering-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/case-new-grad-platform-data-engineering/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-new-grad-platform-data-engineering-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/case-new-grad-platform-data-engineering/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/case-new-grad-platform-data-engineering-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/case-new-grad-platform-data-engineering/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/case-new-grad-platform-data-engineering-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/case-new-grad-platform-data-engineering-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `case-new-grad-platform-data-engineering`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/case-new-grad-platform-data-engineering-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/case-new-grad-platform-data-engineering-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `Yu-Chen Huang / New-Grad Platform Data Engineering Sponsor Filter` run.
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
`snickerdoodle run case-new-grad-platform-data-engineering --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run case-new-grad-platform-data-engineering --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run case-new-grad-platform-data-engineering --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run case-new-grad-platform-data-engineering --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run case-new-grad-platform-data-engineering --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run case-new-grad-platform-data-engineering --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run case-new-grad-platform-data-engineering --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run case-new-grad-platform-data-engineering --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate case-new-grad-platform-data-engineering --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/case-new-grad-platform-data-engineering-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/case-new-grad-platform-data-engineering-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/case-new-grad-platform-data-engineering-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/case-new-grad-platform-data-engineering-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/case-new-grad-platform-data-engineering-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/case-new-grad-platform-data-engineering-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/case-new-grad-platform-data-engineering/` | JSON |
| Verified data | `data/verified/case-new-grad-platform-data-engineering/` | JSON |
| Agent log | `logs/case-new-grad-platform-data-engineering-[DATE].json` | JSON |
| Human report | `reports/generated/case-new-grad-platform-data-engineering-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |
| `pantry/[anonymized source — re-attach an anonymized copy]` | `test -f "pantry/[anonymized source — re-attach an anonymized copy]` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Known Evidence From Submission

- H-1B approval volume/rate and median salary from mapped data.
- Funding recency from SEC Form D fields.
- SOC 15-1243 role-quality data.
- ATS/liveness when configured.

### Cannot Verify Without More Work

- Entry-level friendliness from historical H-1B data alone.
- Current hiring status without ATS/liveness.
- Company culture or new-grad support.

### Original Workflow Notes

- Verify both pantry files.
- Filter for high-volume data-infrastructure sponsors.
- Check funding recency but do not penalize large post-IPO companies solely for old Form D dates.
- Verify SOC 15-1243 role quality from BLS compact data.
- Run ATS scan/liveness for current openings.
- Rank employers using approval volume, role fit, funding/current scale, and new-grad evidence.
- Log verified vs inferred fields.

### Proposed Or Missing Tools

- [TODO: DEV] No dedicated workflow script exists yet; generate scripts only after the input and output schemas below are confirmed.
