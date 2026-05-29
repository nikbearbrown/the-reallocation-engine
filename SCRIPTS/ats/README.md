# ATS Pipeline Scripts

Production ATS scraper subsystem for The Reallocation Engine.

These scripts were promoted from the reference code in
`data/80-days-to-stay/ats-scripts/script-for-reference/`. The reference
files remain untouched for provenance.

## Structure

- `scrapers/common/` — shared utilities copied from the original ATS workstream.
- `detect_ats.py` — unified ATS detector.
- `scan.mjs` — zero-token portal scanner using the provider layer.
- `check-liveness.mjs` — Playwright CLI for checking whether job URLs are active.
- `liveness-core.mjs` — liveness classifier shared by scanner and CLI.
- `liveness-browser.mjs` — Playwright page inspection for liveness checks.
- `analyze_patterns.py` — Python audit scaffold for application, scan,
  pipeline, and run-log pattern analysis.
- `scrapers/greenhouse/scraper.py` — production Greenhouse scraper.
- `scrapers/lever/scraper.py` — production Lever scraper.
- `providers/` — JavaScript provider modules adapted from Job-Ops.

## Step 6 Changes

- Greenhouse and Lever now use shared normalization via
  `scrapers.common.normalize.normalize_company_name`.
- Requests go through `scrapers.common.retry.retry_request`.
- Request pacing uses `scrapers.common.rate_limiter.RateLimiter`.
- Output jobs are normalized to the shared schema and checked with
  `scrapers.common.schema_validator.validate_job_record`.

## Usage

Run from `SCRIPTS/ats/` so the `scrapers` package imports cleanly:

```bash
cd SCRIPTS/ats
python3 -m scrapers.greenhouse.scraper "Databricks, Inc." -o ../../data/ats/greenhouse
python3 -m scrapers.lever.scraper "Anthropic" -o ../../data/ats/lever
```

Or pass a newline-delimited company file:

```bash
python3 -m scrapers.greenhouse.scraper -f companies.txt -o ../../data/ats/greenhouse
python3 -m scrapers.lever.scraper -f companies.txt -o ../../data/ats/lever
```

Each matched company writes:

- `jobs.json` — raw API response in reference-compatible shape.
- `normalized_jobs.json` — normalized job records.
- `metadata.json` — scrape metadata.

Each run also writes `summary.json` to the output directory.

## Step 7 Unified Detector

Detect ATS platform for one or more companies:

```bash
cd SCRIPTS/ats
python3 detect_ats.py "Databricks, Inc." "Anthropic"
```

Run against the mapped master CSV:

```bash
python3 detect_ats.py \
  --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv \
  --company-column company_name \
  --output ../../data/ats/ats_detection_sample.csv
```

Outputs:

- CSV: compact fields for merging (`ats_platform`, `ats_slug`,
  `open_job_count`, etc.).
- Optional JSON: full detection attempts with status codes.
- Markdown audit next to the CSV when `--output` is used.

Current detector priority order:

1. Greenhouse
2. Lever

## Job-Ops Provider Layer

The JavaScript provider layer in `providers/` was adapted from the former
Job-Ops reference copy because it already had compact, well-shaped providers
for:

1. Greenhouse
2. Lever
3. Ashby

These modules detect/fetch from known `careers_url` values and provide the
source-backed path for adding Ashby to the unified detector. They sit beside the
Python scraper stack for now; promote them into the main detection path when the
Step 8 dataset run is ready to use configured ATS/careers URLs.

Workable should be added after its production scraper exists.

## Portal Scanner

`scan.mjs` adapts the Job-Ops scanner architecture for this repo. It uses the
provider modules in `providers/`, deterministic provider loading, URL deduping,
company-role deduping, scan history, and optional liveness verification.

By default it reads:

- `data/ats/portals.yml`

And writes:

- `data/ats/pipeline.md`
- `data/ats/scan-history.tsv`

Override the portals config with:

```bash
REALLOCATION_ENGINE_PORTALS=/path/to/portals.yml node SCRIPTS/ats/scan.mjs
```

Dry-run from the book root:

```bash
node SCRIPTS/ats/scan.mjs --dry-run
```

Use liveness verification after Node dependencies and Chromium are installed:

```bash
node SCRIPTS/ats/scan.mjs --verify
```

## Liveness Checking

The liveness modules were added from Job-Ops so the data pipeline can
distinguish between "ATS detected" and "job posting is currently live."

Check one or more URLs:

```bash
node SCRIPTS/ats/check-liveness.mjs https://example.com/job/123
```

Or check a newline-delimited file:

```bash
node SCRIPTS/ats/check-liveness.mjs --file data/ats/job-urls.txt
```

## Pipeline Integrity

Job-Ops tracker maintenance scripts were adapted to use `data/ats/` as their
working area:

- `verify-pipeline.mjs` — check application tracker health.
- `normalize-statuses.mjs` — normalize tracker statuses.
- `dedup-tracker.mjs` — remove duplicate company/role rows.
- `merge-tracker.mjs` — merge TSV additions from `data/ats/tracker-additions/`.

Examples:

```bash
node SCRIPTS/ats/verify-pipeline.mjs
node SCRIPTS/ats/normalize-statuses.mjs --dry-run
node SCRIPTS/ats/dedup-tracker.mjs --dry-run
node SCRIPTS/ats/merge-tracker.mjs --dry-run
```

## Application Pattern Analysis

`analyze_patterns.py` is the Python replacement scaffold for the old
`analyze-patterns.mjs` idea. It reads Reallocation Engine paths:

- `data/ats/applications.md`
- `data/ats/scan-history.tsv`
- `data/ats/pipeline.md`
- `modes/RUN_LOG.md`
- `data/ats/reports/`

It writes:

- `data/ats/application-patterns-audit.md`

Run from the book root:

```bash
python3 SCRIPTS/ats/analyze_patterns.py
```

On a fresh setup the audit mostly reports missing data and readiness blockers.
Once students have real outcomes, extend the TODO sections in the script to
measure conversion by sponsorship tier, liveness, SOC group, scan source, and
recurring blockers.
