# SEC Pipeline Scripts

Canonical working copies for the 80 Days to Stay SEC Form D pipeline.

These scripts were copied from `data/80-days-to-stay/scripts/` so the
book repo can evolve them as a maintained system. The source data directory is
left intact for provenance.

## Current Flow

1. `sec-all-quarters.py` processes raw quarterly SEC Form D TSV folders into
   per-quarter JSON files.
2. `sec-combine-quarters.py` combines and deduplicates quarter JSON files.
3. `sec-filter.py` filters the master company JSON.
4. `sec-unique.py` removes duplicate companies by exact name, phone, and
   address.
5. `sec-domain-inference.py` infers likely company domains.
6. `sec-flatten.py` exports SEC JSON to CSV for downstream joining.
7. `webpage-processor-clean.py` and `webpage-processor-raw.py` process scraped
   company HTML pages when the `WWW/` corpus is available.
8. `entity-resolution.py` resolves SEC company rows against raw DOL/LCA employer
   records when source LCA data is available.

## Step 3 Refresh

Download and extract the current refresh quarters:

```bash
python3 scripts/sec/download-form-d-quarters.py \
  --quarters 2025Q2 2025Q3 2025Q4 2026Q1 \
  --user "Your Name your.email@example.com"
```

Process the extracted quarter folders into JSON:

```bash
python3 scripts/sec/refresh-recent-sec-quarters.py
```

By default, refresh artifacts are written under `data/sec/form-d/`:

- `raw/` for downloaded SEC ZIP files.
- `extracted/` for extracted quarterly TSV folders.
- `processed/` for generated `companies-sec-*.json` files.

## Step 2 Changes

- `sec-all-quarters.py` now stores `company.fein` from the first available SEC
  FEIN-like column: `ISSUERFEIN`, `ISSUER_FEIN`, `FEIN`, or `EIN`.
- `sec-all-quarters.py` now stores `company.company_name_normalized` at ingest
  time.
- `sec-flatten.py` now preserves `Company_Name_Normalized` and `FEIN` in CSV
  exports.

## Step 5 Entity Resolution

`entity-resolution.py` implements the planned join order:

1. FEIN exact match.
2. Normalized company-name exact match.
3. Fuzzy normalized-name match with threshold `0.88`.
4. Unmatched rows remain `unknown`.

Example:

```bash
python3 scripts/sec/entity-resolution.py \
  --sec data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv \
  --lca data/lca/raw/LCA_Disclosure_Data.csv \
  --output data/lca/resolved/sec_lca_entity_resolution.csv
```

## Intentional Omissions

- `flatten_sec_data_script.py` was not copied. It overlaps with
  `sec-flatten.py` and should be reviewed before deletion from the source
  inventory.
