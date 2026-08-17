---
status: DRAFT
todos_open: 10
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# pipeline -- Verified URL Inbox

## Purpose

Move collected job URLs through explicit evidence checks before role evaluation or application. Agents use this as the URL triage recipe; humans use the summary to confirm the pipeline is not applying to everything or scaling unverified inputs.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Recipe specification | Markdown recipe | `recipes/pipeline.md` | Confirm this specification is current and approved before script generation. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Run envelope | JSON | `data/raw/pipeline/run-envelope.json` — schema in **Run-envelope schema** below; worked sample at `data/examples/run-envelope.json`. | Yes |
| Local evidence | JSON / CSV / Markdown | Repo-local `data/`, `pantry/`, or approved source paths named in Source Inventory. | Yes |
| Human approval record | JSON | `logs/gate-decisions/`; [TODO: APPROVE] required before live network calls, external writes, publishing, email, model calls with sensitive data, or production database actions. | Yes for live mode |

### Run-envelope schema

The run envelope declares one run *before* any ingest. Live runs read it from
`data/raw/pipeline/run-envelope.json`; a worked sample lives at
`data/examples/run-envelope.json`.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `workflow` | string | yes | recipe name (`"pipeline"`) |
| `run_id` | string | yes | unique id, e.g. `pipeline-YYYY-MM-DD-NNN` |
| `mode` | `"sample"` \| `"live"` | yes | declared at the Scope gate before ingest |
| `created_at` | ISO-8601 string | yes | when the envelope was written |
| `requested_by` | string | yes | the human accountable for the run |
| `sources` | array of `{name, path, type}` | yes | declared local-evidence inputs (see Source Inventory) |
| `approvals` | array of paths to `logs/gate-decisions/*.json` | yes for `live` | satisfies the Approval gate |
| `limits` | `{max_records: int, no_write: bool}` | optional | run caps; `no_write` maps to the step-5 `no_write_mode` |
| `notes` | string | optional | free text |

**Mode rules.** `mode: "live"` requires at least one `approvals[]` record and `no_write: false`.
`mode: "sample"` runs with `no_write: true` and needs no approval. The Scope gate parses this
file; the Approval gate checks `approvals[]` before any live network call, external write, or
model call with sensitive data.

## Phase Gates

1. Source gate: All required source paths are present or explicitly marked with a typed TODO. Test: `test -f "recipes/pipeline.md" && rg -n "\[TODO: DEFINE]" "recipes/pipeline.md" || true`. Human capacity: [TO].
2. Scope gate: The run declares `sample` mode or an approved live mode before ingest begins. Test: `python3 -m json.tool data/raw/pipeline/run-envelope.json`. Human capacity: [PF].
3. Data-shape gate: Every raw and verified JSON output parses before downstream scripts run. Test: `find data/raw/pipeline data/verified/pipeline -name "*.json" -print -exec python3 -m json.tool {} \;`. Human capacity: [PA].
4. Script-readiness gate: Every step script exists or is represented by a typed development TODO. Test: `test -f scripts/ingest/pipeline-ingest-inputs.py || rg --fixed-strings "[TODO: DEV]" "recipes/pipeline.md"`. Human capacity: [IJ].
5. Approval gate: Live network calls, external writes, credentials, production databases, emails, dashboards, publishing, or model calls with sensitive data require an approval record. Test: `test -f logs/gate-decisions/pipeline-approval.json || rg --fixed-strings "[TODO: APPROVE]" "recipes/pipeline.md"`. Human capacity: [EI].
6. Report gate: Agent log and human report are written with the required fields and sections. Test: `test -f logs/pipeline-[DATE].json && test -f reports/generated/pipeline-[DATE].md`. Human capacity: [TO].

## Steps

1. Step name: Verify provenance. Labor: AI with Human gate.
   Script called: `scripts/tools/pipeline-verify-provenance.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: workflow, source_paths, exists, parsed_ok, approval_state, checked_at.
   Where output goes: `logs/`
2. Step name: Ingest declared inputs. Labor: AI with Human gate.
   Script called: `scripts/ingest/pipeline-ingest-inputs.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: records, source_name, source_type, fetched_at, sample_mode, rejects.
   Where output goes: `data/raw/pipeline/`
3. Step name: Validate data shape. Labor: AI with Human gate.
   Script called: `scripts/gigo/pipeline-validate-data-shape.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: record_count, required_fields_present, missing_fields, parse_errors, schema_version.
   Where output goes: `data/verified/pipeline/`
4. Step name: Transform and quality check. Labor: AI with Human gate.
   Script called: `scripts/gigo/pipeline-transform-quality-check.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: verified_records, record_count, duplicates, rejects, flags, quality_notes.
   Where output goes: `data/verified/pipeline/`
5. Step name: Run approved tools. Labor: AI with Human gate.
   Script called: `scripts/tools/pipeline-run-approved-tools.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: tool_name, input_path, output_path, action_taken, approval_id, no_write_mode.
   Where output goes: `logs/`
6. Step name: Produce human report. Labor: AI with Human gate.
   Script called: `scripts/tools/pipeline-produce-human-report.py` [TODO: DEV] Define input schema, output schema, transformation logic, and error handling for this script before implementation.
   Input: declared recipe inputs, prior step outputs, and gate decisions for `pipeline`.
   Output: summary, sources_checked, gate_results, findings, typed_todos, next_decision.
   Where output goes: `reports/generated/`

## Output Contract

### Agent output
File: `logs/pipeline-[DATE].json`
Fields: workflow, run_id, mode, steps_completed, records_seen, rejects, duplicates, flags, stop_conditions, todo_items, source_files, gate_decisions, generated_at, raw_output_paths, verified_output_paths, report_path.

### Human report
File: `reports/generated/pipeline-[DATE].md`
Reader: domain lead or human boss responsible for accepting the `pipeline -- Verified URL Inbox` run.
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
`snickerdoodle run pipeline --mode dialogic`

Sample mode (no live network calls, no writes):
`snickerdoodle run pipeline --mode dialogic --sample`

### Step Commands

| Step | CLI Command | Flags |
|---|---|---|
| Verify provenance | `snickerdoodle run pipeline --step verify-provenance` | `--sample` `--no-write` |
| Ingest declared inputs | `snickerdoodle run pipeline --step ingest-inputs` | `--sample` |
| Validate data shape | `snickerdoodle run pipeline --step validate-data-shape` | `--sample` |
| Transform and quality check | `snickerdoodle run pipeline --step transform-quality-check` | `--sample` |
| Run approved tools | `snickerdoodle run pipeline --step run-approved-tools` | `--sample` `--no-write` |
| Produce human report | `snickerdoodle run pipeline --step produce-human-report` | `--sample` `--no-write` |

### Gate Commands

| Gate | CLI Command |
|---|---|
| Gate 1 - Source gate | `snickerdoodle gate pipeline --gate 1 --decision approve --note "Sources checked"` |
| Gate 2 - Scope gate | `snickerdoodle gate pipeline --gate 2 --decision approve --note "Scope and mode approved"` |
| Gate 3 - Data-shape gate | `snickerdoodle gate pipeline --gate 3 --decision approve --note "Outputs parse"` |
| Gate 4 - Script-readiness gate | `snickerdoodle gate pipeline --gate 4 --decision approve --note "Scripts ready or TODO DEV accepted"` |
| Gate 5 - Approval gate | `snickerdoodle gate pipeline --gate 5 --decision approve --note "Live or sensitive actions approved"` |
| Gate 6 - Report gate | `snickerdoodle gate pipeline --gate 6 --decision approve --note "Report and log complete"` |

### Script Locations

| Step | Script Path | Layer |
|---|---|---|
| Verify provenance | `scripts/tools/pipeline-verify-provenance.py` | tools |
| Ingest declared inputs | `scripts/ingest/pipeline-ingest-inputs.py` | ingest |
| Validate data shape | `scripts/gigo/pipeline-validate-data-shape.py` | gigo |
| Transform and quality check | `scripts/gigo/pipeline-transform-quality-check.py` | gigo |
| Run approved tools | `scripts/tools/pipeline-run-approved-tools.py` | tools |
| Produce human report | `scripts/tools/pipeline-produce-human-report.py` | tools |

### Output Locations

| Output | Path | Format |
|---|---|---|
| Raw ingest | `data/raw/pipeline/` | JSON |
| Verified data | `data/verified/pipeline/` | JSON |
| Agent log | `logs/pipeline-[DATE].json` | JSON |
| Human report | `reports/generated/pipeline-[DATE].md` | Markdown |
| Gate decisions | `logs/gate-decisions/` | JSON |

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` | `test -f "data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md"` | Referenced source/evidence path from prior recipe text. |
| `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv` | `test -f "data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv"` | Referenced source/evidence path from prior recipe text. |
| `data/ats/pipeline.md` | `test -f "data/ats/pipeline.md"` | Referenced source/evidence path from prior recipe text. |
| `data/bls/bls-audit.md` | `test -f "data/bls/bls-audit.md"` | Referenced source/evidence path from prior recipe text. |
| `data/bls/compact/soc_occupation_compact.csv` | `test -f "data/bls/compact/soc_occupation_compact.csv"` | Referenced source/evidence path from prior recipe text. |
| `recipes/_shared.md` | `test -f "recipes/_shared.md"` | Referenced source/evidence path from prior recipe text. |

## Existing Recipe Notes Preserved For Implementation

### Primary Tools

```bash
npm run ats:verify
npm run ats:liveness -- --file data/ats/job-urls.txt
npm run ats:dedup
npm run ats:normalize
```

Use `scripts/ats/check-liveness.mjs` and related liveness scripts to separate
currently live postings from old URLs.

### Workflow

1. Read pending URLs.
   - Keep raw URLs intact.
   - Do not rewrite a company or role name unless the page or provider output
     confirms it.

2. Verify pipeline structure.
   - Run `npm run ats:verify`.
   - Fix malformed rows before evaluating the roles.

3. Check liveness.
   - Mark live, stale, redirected, login-required, or unknown.
   - A login-required URL is not automatically fake; it is just not verifiable
     with the current tool.

4. Attach company evidence.
   - Look up the company in
     `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv` when needed.
   - Use the existing audit to understand what columns are reliable.
   - Record "not found" instead of guessing.

5. Attach role-market evidence when SOC is known.
   - Use `data/bls/compact/soc_occupation_compact.csv`.
   - If SOC is unknown, mark it as "SOC not classified yet."
   - Do not invent SOC mappings; add a future task for a classifier.

6. Move each item.
   - Live and useful: `Processed`.
   - Broken or inaccessible: `Problems`.
   - Needs human judgment: leave in `Pending` with a short note.

7. Log the run in `logs/RUN_LOG.md`.
