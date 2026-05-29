# The Reallocation Engine

The Reallocation Engine is a book, dataset, and script system for helping
international students and early-career technical workers reallocate job-search
time away from low-probability mass applications and toward higher-probability
targets, networking, and portfolio work.

The core claim is simple: the problem is not motivation. It is information
asymmetry. Students cannot easily see which companies have sponsorship history,
which companies are newly funded, which roles are live, and which occupations
are becoming more or less valuable in the generative AI era. This repo is being
organized into the system that makes those signals visible.

## Project Idea

The project combines three threads:

1. **80 Days to Stay**
   Sponsorship intelligence from SEC Form D funding data, DOL/USCIS H-1B
   signals, company websites, and ATS discovery.

2. **Job-Ops**
   A job-search operations layer: ATS provider scanning, job liveness checks,
   application tracking, deduping, and pipeline integrity.

3. **The Cognitive Pivot**
   A labor-market and role-quality layer based on BLS OEWS and O*NET. The
   working thesis is that engineering labor is shifting from implementation
   volume toward verification, system judgment, causal debugging, and
   architecture. "Passable code" is no longer enough; the market premium is
   moving toward cognitive work that AI cannot reliably perform.

The eventual engine should rank opportunities using signals like:

- historical sponsorship behavior;
- funding recency and company viability;
- live ATS job availability;
- role fit and visa timeline compatibility;
- role resilience and cognitive-demand trajectory;
- ghost-job/liveness risk.

The system succeeds when a student sends fewer applications with better odds,
then uses the reclaimed time for networking and portfolio proof.

## System Flow

The repo is organized around a data-first loop: collect verified signals, audit
what is known, evaluate opportunities, and record what actually happened.

```text
                         THE REALLOCATION ENGINE

  SOURCE / REFERENCE DATA                 MAINTAINED SCRIPTS
  -----------------------                 ------------------

  data/80-days-to-stay/              SCRIPTS/sec/
    SEC + H-1B mapped companies  ----->     refresh Form D quarters
    sponsorship history                     validate joins
                                             entity-resolution scaffolds

  data/sec/form-d/                       SCRIPTS/ats/
    recent Form D refresh        ----->     detect ATS providers
                                             scan configured portals
                                             check job liveness
                                             verify/dedup trackers
                                             analyze patterns

  data/bls/                              SCRIPTS/bls/
    O*NET + OEWS source data     ----->     compact SOC occupation table
                                             role-quality features

  resumes/                              SCRIPTS/resumes/
    anonymized Markdown CVs      ----->     PDF generation

                              |
                              v

  GENERATED WORKING DATA AND AUDITS
  ---------------------------------

  data/**/**-audit.md
  data/bls/compact/soc_occupation_compact.csv
  data/ats/pipeline.md
  data/ats/scan-history.tsv
  data/ats/applications.md
  data/ats/application-patterns-audit.md

                              |
                              v

  STUDENT OPERATING MODES
  -----------------------

  modes/scan.md       -> find ATS/provider/job signals
  modes/pipeline.md   -> triage URLs and liveness
  modes/oferta.md     -> evaluate one role with evidence
  modes/pdf.md        -> generate an ATS-friendly CV PDF
  modes/tracker.md    -> maintain application history
  modes/patterns.md   -> analyze outcomes after enough history exists

                              |
                              v

  HISTORY AND LEARNING LOOP
  -------------------------

  modes/RUN_LOG.md records:
    what was run,
    what worked,
    what failed,
    what should be tested next.

  The long-term output is companies_master_v2.csv plus book chapters,
  dashboards, and student-facing workflows built from verified evidence.
```

## Repository Layout

| Path | Purpose |
|---|---|
| `book.md`, `chapters/`, `outline.md`, `vision.md`, `architecture.md`, `risks.md` | Book manuscript and planning material. |
| `SCRIPTS/` | Canonical maintained automation. New scripts should live here. |
| `modes/` | Student-facing operating recipes that point to verified data, tested scripts, and a run log. |
| `resumes/` | Anonymized Markdown CV examples for student resume templates. |
| `data/` | Source/reference data and generated working extracts. |
| `data/80-days-to-stay/` | Upstream 80 Days source repo and data snapshot. |
| `data/bls/` | BLS/O*NET source/reference data for role-quality and labor-market direction. |
| `data/sec/form-d/` | Refreshed SEC Form D raw, extracted, and processed quarterly data. |
| `data/ats/` | ATS scanner configuration and generated ATS working files. |
| `pantry/` | Research pantry before material graduates into the manuscript. |
| `projects/` | Draft project notes, research prompts, and side analyses. |
| `working/` | Local scratch space for in-progress analysis; not a source-data layer. |
| `images/`, `d3/`, `styles/`, `output/` | Book visuals, generated assets, and presentation/output support. |
| `DATA_CONTRACT.md` | Rules for source data, generated data, scripts, book content, and private/user-specific files. |

## Naming Conventions

- Data and source/reference directories use lower-case kebab-case.
- `data/80-days-to-stay/` replaces the former mixed-case upstream copy name.
- `data/bls/` replaces the former uppercase BLS directory.
- SEC raw ZIP filenames preserve upstream SEC names such as `2025q2_d.zip`;
  extracted folders and processed outputs use lower-kebab names such as
  `2025q2-d` and `companies-sec-2025q2-d.json`.
- `SCRIPTS/` intentionally remains uppercase. It is the canonical maintained
  automation directory for this repo.

## Current Data Inventory

### 80 Days to Stay Data

Path: `data/80-days-to-stay/`

This is the main sponsorship-intelligence source. The most valuable file is:

- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv`

That file already contains about 30K companies with SEC and H-1B enrichment to
some degree. It is the base dataset for sponsorship scoring and should not be
rebuilt from scratch without a clear reason.

Important audit reports already generated:

- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md`
- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-join-validation-audit.md`
- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-entity-resolution-readiness-audit.md`

Key findings from the first audit:

- 30,369 companies.
- 1,557 rows with H-1B data present.
- 17,752 rows with websites present.
- no ATS columns yet.
- no SOC columns yet.
- newest funding date observed: 2025-09-26.

### SEC Form D Refresh Data

Path: `data/sec/form-d/`

This is the refreshed SEC Form D working area created by the maintained SEC
scripts.

Raw SEC ZIP filenames preserve the upstream SEC underscore style. Extracted
directories and processed JSON files use the repo's lower-kebab convention.

Current files:

- `data/sec/form-d/raw/2025q2_d.zip`
- `data/sec/form-d/raw/2025q3_d.zip`
- `data/sec/form-d/raw/2025q4_d.zip`
- `data/sec/form-d/raw/2026q1_d.zip`
- `data/sec/form-d/processed/companies-sec-2025q2-d.json`
- `data/sec/form-d/processed/companies-sec-2025q3-d.json`
- `data/sec/form-d/processed/companies-sec-2025q4-d.json`
- `data/sec/form-d/processed/companies-sec-2026q1-d.json`
- `data/sec/form-d/processed/recent-sec-quarters-audit.md`

Important finding: the refreshed SEC issuer files did not expose FEIN/EIN
columns in these quarters. The pipeline now has FEIN support, but these source
quarters did not provide the value.

### Job-Ops Reference

The former `data/career-ops-main/` source copy has been removed from this repo.
Useful pieces were already copied or adapted into maintained locations:

- ATS provider modules under `SCRIPTS/ats/providers/`.
- scanner/liveness/tracker ideas under `SCRIPTS/ats/`.
- student operating recipes under `modes/`.
- resume PDF generation under `SCRIPTS/resumes/`.

Treat `SCRIPTS/` and `modes/` as the current system of record. The deleted
source copy is ignored by `.gitignore` so it does not get accidentally
re-added.

### BLS/O*NET Source

Path: `data/bls/`

This is the source/reference layer for role quality and labor-market direction.
It contains:

- O*NET 30.2, February 2026, in text and Excel forms.
- BLS OEWS national employment/wage data, including extracted annual files for
  2012-2024 and older ZIP/XLS archives.
- O*NET Job Trend Analyzer notes and paper scaffolding.
- a compact extracted working table.

Generated working extract:

- `data/bls/compact/soc_occupation_compact.csv`

Audit:

- `data/bls/bls-audit.md`

Current compact extract:

- 1,016 O*NET occupations.
- 962 matched to 2024 OEWS detailed SOC rows.
- latest national employment and wage context.
- O*NET job zones.
- alternate title counts/samples.
- selected ability and skill Level scores.
- first-pass `cognitive_pivot_score`.

Large source note:

- The duplicated O*NET SQL export directories, `data/bls/db-30-2-mysql/` and
  `data/bls/db-30-2-mssql/`, are intentionally ignored/omitted from Git.
- Each contained a ~91 MB `20_work_context.sql` file and duplicated data already
  available in `data/bls/db-30-2-text/`, `data/bls/db-30-2-excel/`, and
  `data/bls/zip/`.
- The maintained BLS extractor uses the text tables, not the SQL exports.

### ATS Working Data

Path: `data/ats/`

Current files:

- `data/ats/portals.example.yml`
- `data/ats/reports/`
- `data/ats/application-patterns-audit.md`

## Student Modes And Logs

Path: `modes/`

The mode folder is now a lightweight student operating layer. Modes should not
ask students to rely on prompting alone when the repo has a script, audit, or
source dataset that can answer the question.

Important files:

- `modes/_shared.md` -- shared verified-data contract for all modes.
- `modes/README.md` -- mode inventory and active/draft status.
- `modes/RUN_LOG.md` -- human-readable history of what was run, what worked,
  what failed, and what should be tested next.
- `modes/scan.md` -- ATS discovery using `SCRIPTS/ats/`.
- `modes/pipeline.md` -- URL triage and liveness checks.
- `modes/oferta.md` -- evidence-based role evaluation.
- `modes/pdf.md` -- Markdown CV to PDF workflow using `SCRIPTS/resumes/`.
- `modes/tracker.md` -- application and scan history maintenance.
- `modes/patterns.md` -- pattern-analysis workflow around
  `SCRIPTS/ats/analyze_patterns.py`.

Draft/helper modes are kept explicit. If a workflow does not yet have a tested
script, the mode says so rather than pretending the automation exists.

`data/ats/portals.yml`, `data/ats/pipeline.md`, `data/ats/scan-history.tsv`,
and `data/ats/applications.md` are expected working files once scanner/tracker
runs begin. Some may be private/user-specific and should be reviewed before
commit.

## Maintained Scripts

All maintained automation should live under `SCRIPTS/`.

### Top-Level Scripts

#### `SCRIPTS/audit_sec_dol_h1b_data.py`

Audits `SEC_DOL_H1b_data_mapped.csv`.

It reports:

- row and column counts;
- H-1B data presence/null rates;
- funding date distribution;
- website coverage;
- ATS and SOC column presence;
- useful quality notes.

Output convention: Markdown audit next to the data, using `-audit.md`.

#### `SCRIPTS/svg-to-png.mjs`

Converts SVG images under `images/` into high-resolution PNGs for book output.

Run:

```bash
npm run svg-to-png
```

### SEC Scripts

Path: `SCRIPTS/sec/`

These are canonical working copies of the 80 Days SEC pipeline. The originals
remain under `data/80-days-to-stay/scripts/` for provenance.

#### `download_form_d_quarters.py`

Downloads SEC Form D quarterly ZIP files and extracts them into
`data/sec/form-d/`.

Example:

```bash
python3 SCRIPTS/sec/download_form_d_quarters.py \
  --quarters 2025Q2 2025Q3 2025Q4 2026Q1 \
  --user "Your Name your.email@example.com"
```

#### `refresh_recent_sec_quarters.py`

Processes the downloaded SEC quarter folders into per-quarter JSON files under
`data/sec/form-d/processed/`.

Run:

```bash
python3 SCRIPTS/sec/refresh_recent_sec_quarters.py
```

#### `sec_all_quarters.py`

Processes raw quarterly SEC Form D TSV folders into company JSON records.

Current refactor additions:

- stores `company.company_name_normalized`;
- attempts to store `company.fein` from FEIN-like issuer columns when present.

#### `sec_combine_quarters.py`

Combines quarterly SEC JSON files and deduplicates company records.

#### `sec_filter.py`

Filters SEC company records. This works but still needs more configuration
rather than hardcoded thresholds.

#### `sec_unique.py`

Deduplicates companies by name, phone, and address. This is considered clean and
should be kept as-is unless a concrete bug appears.

#### `sec_domain_inference.py`

Infers likely company domains from company names. This works but should be
expanded with modern domain patterns such as `.ai`, `.bio`, `.health`, and
biotech-specific suffixes.

#### `sec_flatten.py`

Flattens SEC JSON into CSV. It now preserves normalized company name and FEIN
fields.

#### `sec_form_d.py`

Original single-quarter Form D processor. Useful as a reference but should be
made configurable before becoming a primary entry point.

#### `entity_resolution.py`

Implements the planned SEC-to-LCA matching order:

1. FEIN exact match.
2. normalized company-name exact match.
3. fuzzy normalized-name match with threshold 0.88.
4. unmatched rows remain unknown.

This script is ready for use once raw LCA/DOL employer records are available.

#### `validate_h1b_join_sample.py`

Creates a deterministic sample from rows with H-1B data and writes a Markdown
join-validation audit. Current limitation: the repo does not contain raw LCA
employer records or match metadata, so false-positive rate cannot be estimated
locally yet.

#### `webpage_processor_clean.py`

Processes scraped company HTML into cleaner Markdown/text for downstream
annotation. This is intended for the large website corpus when present.

#### `webpage_processor_raw.py`

Processes/saves raw website content for archival comparison.

### ATS Scripts

Path: `SCRIPTS/ats/`

This subsystem combines promoted 80 Days ATS scrapers with selected Job-Ops
scanner/liveness/tracker ideas.

#### `detect_ats.py`

Unified Python ATS detector.

Current priority:

1. Greenhouse
2. Lever

It can check individual company names, newline-delimited files, or CSVs. It can
write a compact CSV plus a Markdown audit.

Example:

```bash
cd SCRIPTS/ats
python3 detect_ats.py "Databricks, Inc." "Anthropic"
```

Against the mapped company file:

```bash
python3 detect_ats.py \
  --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv \
  --company-column company_name \
  --output ../../data/ats/ats_detection_sample.csv
```

#### `scrapers/common/`

Shared Python utilities copied from the original ATS workstream:

- normalization;
- retry handling;
- rate limiting;
- logging;
- schema validation;
- config helpers.

#### `scrapers/greenhouse/scraper.py`

Production Greenhouse scraper. It uses the shared utilities and writes raw jobs,
normalized jobs, metadata, and summary files.

#### `scrapers/lever/scraper.py`

Production Lever scraper. It uses the shared utilities and writes raw jobs,
normalized jobs, metadata, and summary files.

#### `providers/`

JavaScript provider layer adapted from Job-Ops:

- `providers/_http.mjs` - shared fetch helpers.
- `providers/greenhouse.mjs` - Greenhouse board API provider.
- `providers/lever.mjs` - Lever postings API provider.
- `providers/ashby.mjs` - Ashby posting API provider.

These are especially useful for adding Ashby support and for scanner workflows
that start from known `careers_url` values.

#### `scan.mjs`

Zero-token portal scanner using the provider layer.

Default input:

- `data/ats/portals.yml`

Default outputs:

- `data/ats/pipeline.md`
- `data/ats/scan-history.tsv`

Example:

```bash
node SCRIPTS/ats/scan.mjs --dry-run
```

The scanner supports deterministic provider loading, URL deduping,
company-role deduping, scan history, title/location filters, and optional
liveness verification.

#### `check-liveness.mjs`

Playwright CLI for checking whether job URLs are live, expired, or uncertain.

Example:

```bash
node SCRIPTS/ats/check-liveness.mjs https://example.com/job/123
```

#### `liveness-core.mjs`

Shared liveness classifier. It detects:

- HTTP gone/not found;
- expired body text;
- expired URL patterns;
- visible apply controls;
- likely listing pages;
- insufficient-content pages.

#### `liveness-browser.mjs`

Playwright page inspection used by `check-liveness.mjs` and `scan.mjs --verify`.
It includes URL guards against private/loopback hosts.

#### `verify-pipeline.mjs`

Checks `data/ats/applications.md` for tracker health:

- canonical statuses;
- duplicate company/role entries;
- report-link validity;
- score format;
- row format;
- pending TSV additions.

#### `normalize-statuses.mjs`

Normalizes tracker statuses in `data/ats/applications.md`.

#### `dedup-tracker.mjs`

Deduplicates tracker rows by normalized company and fuzzy role match.

#### `merge-tracker.mjs`

Merges TSV additions from `data/ats/tracker-additions/` into
`data/ats/applications.md`.

#### `analyze_patterns.py`

Python scaffold for outcome-pattern analysis. It reads the ATS tracker,
scan-history TSV, pipeline inbox, run log, and saved ATS reports.

Default output:

- `data/ats/application-patterns-audit.md`

At the current stage it reports descriptive counts and readiness blockers. Once
students have real outcomes, extend it to measure conversion by sponsorship
tier, liveness state, SOC group, scan source, recurring blockers, and run-log
failures.

### BLS Scripts

Path: `SCRIPTS/bls/`

This subsystem turns the bulky BLS/O*NET archive into compact working features
for role-quality and labor-market-direction scoring.

#### `extract_soc_occupation_table.py`

Builds the compact SOC/O*NET/OEWS occupation table.

Run:

```bash
python3 SCRIPTS/bls/extract_soc_occupation_table.py
```

Outputs:

- `data/bls/compact/soc_occupation_compact.csv`
- `data/bls/bls-audit.md`

The compact table includes:

- O*NET-SOC code;
- BLS SOC code;
- title and description;
- job zone;
- alternate title sample;
- latest OEWS employment and wage fields;
- selected ability Level scores;
- selected skill Level scores;
- `cognitive_pivot_score`.

### Resume Scripts

Path: `SCRIPTS/resumes/`

#### `generate-pdf.mjs`

Generates ATS-friendly PDF resumes from the anonymized Markdown CV examples in
`resumes/`.

Run all examples:

```bash
npm run resumes:pdf -- --all
```

Run one example:

```bash
npm run resumes:pdf -- resumes/aarav-patel-cv.md
```

Default output:

- `output/resumes/{first-last-cv}.pdf`

## Node Scripts

The root `package.json` currently defines:

```bash
npm run svg-to-png
npm run ats:scan
npm run ats:liveness
npm run ats:verify
npm run ats:merge
npm run ats:dedup
npm run ats:normalize
npm run resumes:pdf -- --all
```

Node dependencies currently include:

- `glob`
- `sharp`
- `js-yaml`
- `playwright`

Playwright browser installation is required before live liveness checks:

```bash
npx playwright install chromium
```

## Python Script Examples

Run from the book root unless noted:

```bash
python3 SCRIPTS/audit_sec_dol_h1b_data.py
python3 SCRIPTS/sec/refresh_recent_sec_quarters.py
python3 SCRIPTS/bls/extract_soc_occupation_table.py
python3 SCRIPTS/ats/analyze_patterns.py
```

Run the unified ATS detector from `SCRIPTS/ats/` so package imports resolve:

```bash
cd SCRIPTS/ats
python3 detect_ats.py "Databricks, Inc." "Anthropic"
python3 detect_ats.py --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv --company-column company_name --output ../../data/ats/ats_detection_sample.csv
```

## Current Build Status

Completed so far:

- Audited `SEC_DOL_H1b_data_mapped.csv`.
- Copied/refactored SEC scripts into `SCRIPTS/sec/`.
- Added normalized company names and FEIN-field support to SEC processing.
- Refreshed SEC Form D data for 2025 Q2-Q4 and 2026 Q1.
- Validated that local raw LCA match metadata is missing.
- Added entity-resolution script for future raw LCA joins.
- Promoted Greenhouse and Lever scrapers into `SCRIPTS/ats/`.
- Added unified Python ATS detector.
- Added Job-Ops JavaScript provider layer for Greenhouse, Lever, and Ashby.
- Added portal scanner architecture.
- Added job liveness checking.
- Added tracker integrity scripts.
- Added Python application-pattern audit scaffold:
  `SCRIPTS/ats/analyze_patterns.py`.
- Added `DATA_CONTRACT.md`.
- Added verified-data student modes and `modes/RUN_LOG.md`.
- Audited BLS/O*NET source data.
- Generated compact SOC occupation table.
- Added anonymized Markdown CV examples and PDF generation script.
- Removed the copied Job-Ops source tree after adapting useful pieces.
- Normalized source/reference data directories to lower-case kebab-case.
- Regenerated SEC, BLS, and ATS pattern audits after path normalization.

Not done yet:

- Run ATS detection across all mapped companies.
- Build Workable scraper.
- Promote Ashby into the main Python detector or fully adopt the JS provider
  scanner path for configured careers URLs.
- Process the large website corpus, if available.
- Add LLM company annotation cache.
- Compute BLS/OEWS employment trend slopes from 2012-2024.
- Build the SOC classification validation pipeline described in
  `projects/soc_classification_draft.md` and
  `projects/soc_classification_methods.md`: create an LCA-derived validation
  set, run title-only vs. full-text classification, measure top-1 accuracy,
  major-group accuracy, STEM recall/precision, and confidence calibration.
- Build the H-1B misclassification study pipeline described in
  `projects/h1b_misclassification_draft.md`: match job listings to certified
  LCA records, independently classify SOC and wage level from listing text,
  compute mismatch rates, and test whether employer-level mismatch predicts
  USCIS denial rates.
- Build the cognitive-tier startup hiring analysis described in
  `projects/cognitive_tier_startup_hiring_draft.md` and
  `projects/critiq_prompt_startup_eda.md`: match Form D companies to LCA
  filings, assign SOC codes to Irreducibly Human cognitive tiers, compare
  pre-/post-ChatGPT tier composition, and split results by biotech vs.
  software.
- Define or import the Irreducibly Human SOC-to-cognitive-tier taxonomy,
  including coverage for SOC major groups 11, 13, 15, 17, and a policy for
  out-of-coverage groups such as SOC 19.
- Generate the tables/figures requested by the project drafts: LCA match-rate
  tables, SOC distribution charts, O*NET skill/ability heatmaps, cognitive-tier
  time series, wage-level distributions, classifier calibration curves, and
  mismatch heatmaps.
- Run the literature/research prompts in
  `projects/persona_spec_and_research_prompts.md` if the book keeps the
  learner-persona/tutor-adaptation thread; otherwise move that file out of this
  repo's active roadmap.
- Merge sponsorship, ATS, BLS role-quality, and annotation features into a
  `companies_master_v2.csv`.
- Build database/API/frontend layers.

## Recommended Next Steps

1. Create a real `data/ats/portals.yml` from a curated sample of companies with
   known careers URLs.
2. Run the pattern audit after tracker activity starts:

   ```bash
   python3 SCRIPTS/ats/analyze_patterns.py
   ```

3. Install Node dependencies and Chromium, then smoke-test:

   ```bash
   npm install
   npx playwright install chromium
   npm run ats:scan -- --dry-run
   ```

4. Add Ashby to the main ATS detection path.
5. Add `SCRIPTS/bls/extract_employment_trends.py` to compute 2012-2024 SOC
   employment slopes and index values.
6. Add `SCRIPTS/bls/build_cognitive_tier_taxonomy.py` or equivalent to produce
   a versioned SOC-to-tier table for the Irreducibly Human taxonomy.
7. Add `SCRIPTS/lca/` or `SCRIPTS/h1b/` for raw OFLC LCA ingestion, certified
   record filtering, FEIN/name normalization, and employer-level aggregates.
8. Add `SCRIPTS/soc/` for LLM-based SOC classification experiments and
   validation reports against LCA-derived ground truth.
9. Add `SCRIPTS/h1b/measure_misclassification.py` once listing-to-LCA matching
   exists, producing mismatch audits next to the matched data.
10. Merge compact BLS role features into the sponsorship/company dataset by SOC
   once SOC codes are available.
11. Keep all new maintained automation under `SCRIPTS/`.

## Data and Commit Hygiene

- Treat `data/80-days-to-stay/` and `data/bls/` as source/reference
  layers.
- Keep data/source directories lower-case kebab-case.
- Put maintained scripts in `SCRIPTS/`; this is the one intentional uppercase
  project-system directory.
- Put generated audit reports next to the data they inspect using `-audit.md`.
- Review `data/ats/` before committing; it may contain user-specific job-search
  activity.
- Keep `data/career-ops-main/` deleted and ignored unless the project
  explicitly needs to re-import that source copy.
- The duplicated O*NET SQL export directories are ignored because the text,
  Excel, ZIP, and compact BLS files are sufficient for the current pipeline.

## More Detail

- `DATA_CONTRACT.md` explains source, generated, script, book, and private data
  ownership.
- `SCRIPTS/README.md` summarizes maintained script subsystems.
- `SCRIPTS/sec/README.md`, `SCRIPTS/ats/README.md`, and
  `SCRIPTS/bls/README.md` describe each script family in more detail.
