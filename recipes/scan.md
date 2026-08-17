---
status: DRAFT
todos_open: 11
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# scan -- Verified ATS Discovery

## Purpose

Discover ATS providers and job postings using verified local inputs and the maintained scripts under `scripts/ats/`. Agents use this to collect and verify posting evidence; humans use the summary to confirm the scan is not being used as a proxy for sponsorship, role quality, or job worth.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/scan.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Run envelope | JSON | `data/raw/scan/run-envelope.json`; [TODO: DEFINE] specify exact fields for this workflow. | Yes |
| Local evidence | JSON / CSV / Markdown | Repo-local `data/`, `pantry/`, or approved source paths named in Source Inventory. | Yes |
| Human approval record | JSON | `logs/gate-decisions/`; [TODO: APPROVE] required before live network calls, external writes, publishing, email, model calls with sensitive data, or production database actions. | Yes for live mode |

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/scan.md" && rg -n "\[TODO: DEFINE]" "recipes/scan.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/scan/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/scan data/verified/scan -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/scan-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/scan.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/scan-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/scan.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/scan-[DATE].json && test -f reports/generated/scan-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/scan-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/scan-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/scan/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/scan-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/scan/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/scan-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/scan/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/scan-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/scan-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `scan`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/scan-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/scan-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `scan -- Verified ATS Discovery` run.
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
`snickerdoodle run scan --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run scan --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run scan --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run scan --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run scan --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run scan --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run scan --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run scan --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate scan --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate scan --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate scan --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate scan --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate scan --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate scan --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/scan-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/scan-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/scan-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/scan-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/scan-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/scan-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/scan/` | JSON |
| Verified data | `data/verified/scan/` | JSON |
| Agent log | `logs/scan-[DATE].json` | JSON |
| Human report | `reports/generated/scan-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### What This Recipe Can Verify

This recipe can verify:

- whether a company appears to expose Greenhouse, Lever, or Ashby jobs;
- whether a configured portal scan produced new URLs;
- whether a job URL appears in scan history;
- whether a job posting is probably live when liveness tools are run.

This recipe cannot verify:

- sponsorship likelihood by itself;
- role quality by itself;
- whether a company is a good target without checking SEC/H-1B and BLS/SOC data.

### Primary Tools

Use the maintained tools under `scripts/ats/`:

```bash
cd scripts/ats
python3 detect-ats.py "Databricks, Inc." "Anthropic" --output ../../data/ats/ats_detection_sample.csv
python3 detect-ats.py --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv --company-column company_name --output ../../data/ats/ats_detection.csv
cd ../..
npm run ats:scan
npm run ats:liveness -- --file data/ats/job-urls.txt
npm run ats:verify
```

If `data/ats/portals.yml` does not exist, copy
`data/ats/portals.example.yml` and edit the copy. Do not edit the example as a
working config.

To use a non-default config, set `REALLOCATION_ENGINE_PORTALS=/path/to/file.yml`
when running `node scripts/ats/scan.mjs`.

### Workflow

1. Confirm the scan target.
   - Company list from the SEC/H-1B mapped CSV.
   - Hand-curated `data/ats/portals.yml`.
   - A small pasted list from the student.

2. Run the smallest useful scan first.
   - Use a few explicit company names or a small newline-delimited file for a sample.
   - Use the provider scanner only after `portals.yml` is configured.
   - Keep large scans out of git unless the output is compact and intentional.

3. Inspect output files.
   - Count rows.
   - Count provider hits.
   - Note empty provider results separately from errors.
   - Record where the output was written.

4. Check liveness when the output will be used for applications or analysis.
   - "ATS detected" means the provider exists.
   - "Live posting" means the posting URL still resolves and appears active.
   - Keep these as separate fields in reports and notes.

5. Deduplicate.
   - Prefer exact URL dedupe.
   - Then company plus normalized role title.
   - Record suspected duplicates instead of deleting uncertain entries.

6. Log the run in `logs/RUN_LOG.md`.
