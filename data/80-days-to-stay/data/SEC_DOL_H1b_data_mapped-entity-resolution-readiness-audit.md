# Entity Resolution Readiness Audit

**Audit date:** 2026-05-28
**Step:** Phase 2, Step 5 — Re-run entity resolution with FEIN if needed

## Status

Step 5 cannot be fully executed against the current repository contents because
the raw DOL/LCA or USCIS source tables are not present locally.

A local search found only the already-merged mapped files:

- `Data/SEC_DOL_H1b_data_mapped.csv`
- `80-days-csv/mapped_student_employment_targets_v3.csv`
- `80-days-day-08/urls-agent/data_websites.csv`

Those three files are copies of the same 30,369-row mapped dataset. They do not
contain raw employer names, FEIN/EIN values, match scores, match method, or SOC
codes from the source H-1B/LCA records.

## What Was Added

`SCRIPTS/sec/entity_resolution.py` now provides a rerunnable entity-resolution
pipeline for when the raw LCA table is available.

Join priority:

1. FEIN exact match.
2. Normalized company-name exact match.
3. Fuzzy normalized-name match with default threshold `0.88`.
4. Leave unmatched rows as `unknown`.

The script writes both a resolved CSV and a Markdown `-audit.md` report.

Example:

```bash
python3 SCRIPTS/sec/entity_resolution.py \
  --sec data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv \
  --lca data/lca/raw/LCA_Disclosure_Data.csv \
  --output data/lca/resolved/sec_lca_entity_resolution.csv \
  --threshold 0.88
```

## Dependency Note

`rapidfuzz` is now declared in `SCRIPTS/sec/requirements.txt`. If it is not
installed, the script falls back to Python's standard-library `difflib`, which
is slower and less faithful to token-set matching.

## FEIN Constraint

The refreshed SEC Form D quarters were processed with `company.fein` support,
but the SEC Form D `ISSUERS.tsv` files for `2025Q2`, `2025Q3`, `2025Q4`, and
`2026Q1` do not include FEIN/EIN columns. FEIN matching will only work if an
external SEC-side FEIN source is added or if older/source files contain FEIN.

## Decision

Do not replace the existing `SEC_DOL_H1b_data_mapped.csv` yet.

The current safe next move is to locate or download the raw DOL LCA disclosure
files and USCIS H-1B Employer Data Hub source used for the original merge, then
rerun `entity_resolution.py` into a new output file. The existing mapped CSV
should remain the base dataset until the replacement join has an audit report
and manual validation sample.
