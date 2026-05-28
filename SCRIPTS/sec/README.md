# SEC Pipeline Scripts

Canonical working copies for the 80 Days to Stay SEC Form D pipeline.

These scripts were copied from `data/80-Days-to-Stay-main/Scripts/` so the
book repo can evolve them as a maintained system. The source data directory is
left intact for provenance.

## Current Flow

1. `sec_all_quarters.py` processes raw quarterly SEC Form D TSV folders into
   per-quarter JSON files.
2. `sec_combine_quarters.py` combines and deduplicates quarter JSON files.
3. `sec_filter.py` filters the master company JSON.
4. `sec_unique.py` removes duplicate companies by exact name, phone, and
   address.
5. `sec_domain_inference.py` infers likely company domains.
6. `sec_flatten.py` exports SEC JSON to CSV for downstream joining.
7. `webpage_processor_clean.py` and `webpage_processor_raw.py` process scraped
   company HTML pages when the `WWW/` corpus is available.
8. `entity_resolution.py` resolves SEC company rows against raw DOL/LCA employer
   records when source LCA data is available.

## Step 3 Refresh

Download and extract the current refresh quarters:

```bash
python3 SCRIPTS/sec/download_form_d_quarters.py \
  --quarters 2025Q2 2025Q3 2025Q4 2026Q1 \
  --user "Your Name your.email@example.com"
```

Process the extracted quarter folders into JSON:

```bash
python3 SCRIPTS/sec/refresh_recent_sec_quarters.py
```

By default, refresh artifacts are written under `data/sec/form-d/`:

- `raw/` for downloaded SEC ZIP files.
- `extracted/` for extracted quarterly TSV folders.
- `processed/` for generated `companies_sec_*.json` files.

## Step 2 Changes

- `sec_all_quarters.py` now stores `company.fein` from the first available SEC
  FEIN-like column: `ISSUERFEIN`, `ISSUER_FEIN`, `FEIN`, or `EIN`.
- `sec_all_quarters.py` now stores `company.company_name_normalized` at ingest
  time.
- `sec_flatten.py` now preserves `Company_Name_Normalized` and `FEIN` in CSV
  exports.

## Step 5 Entity Resolution

`entity_resolution.py` implements the planned join order:

1. FEIN exact match.
2. Normalized company-name exact match.
3. Fuzzy normalized-name match with threshold `0.88`.
4. Unmatched rows remain `unknown`.

Example:

```bash
python3 SCRIPTS/sec/entity_resolution.py \
  --sec data/80-Days-to-Stay-main/Data/SEC_DOL_H1b_data_mapped.csv \
  --lca data/lca/raw/LCA_Disclosure_Data.csv \
  --output data/lca/resolved/sec_lca_entity_resolution.csv
```

## Intentional Omissions

- `flatten_sec_data_script.py` was not copied. It overlaps with
  `sec_flatten.py` and should be reviewed before deletion from the source
  inventory.
