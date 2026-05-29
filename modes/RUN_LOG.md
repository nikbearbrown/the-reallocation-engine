# Mode Run Log

Human-readable history for mode-driven work.

Use this file to record what was run, what worked, what failed, and what should
be tested next. Keep entries short. Do not include secrets, real phone numbers,
private emails, or sensitive application notes.

## 2026-05-28 — Mode folder converted to verified-data workflows

- **Mode:** manual
- **Inputs:** `modes/`, `SCRIPTS/`, `README.md`, `DATA_CONTRACT.md`
- **Outputs:** `modes/_shared.md`, `modes/README.md`, active modes, and draft/helper mode files
- **Result:** Modes now point students toward repo scripts, audits, and logs instead of prompt-only recipes.
- **Open issues:** Some workflows remain intentionally marked as draft until supporting scripts exist.

## 2026-05-28 — Removed copied Job-Ops source tree

- **Mode:** manual
- **Inputs:** `data/career-ops-main/`, `SCRIPTS/ats/`, `modes/`, `resumes/`
- **Outputs:** `.gitignore`, `README.md`, `DATA_CONTRACT.md`, provider docs
- **Result:** Removed the copied reference directory after useful pieces had been adapted into maintained repo paths.
- **Open issues:** Provenance now lives in docs and adapted files, not in a local source copy.

## 2026-05-28 — Normalized data directory names

- **Mode:** manual
- **Inputs:** old mixed-case 80 Days and BLS data directories, `data/sec/form-d/`
- **Outputs:** `data/80-days-to-stay/`, `data/bls/`, lower-kebab SEC extracted folders, updated docs/scripts
- **Result:** Source/reference data directories now use lower-case kebab-case names. `SCRIPTS/` remains uppercase by repo convention.
- **Open issues:** Some source data filenames and JSON field values still preserve upstream naming.
