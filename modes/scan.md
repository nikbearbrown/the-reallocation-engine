# Mode: scan -- Verified ATS Discovery

Use this mode when a student wants to find or refresh job postings for known
companies. This is a data collection workflow, not a prompting workflow.

## Required Context

Read first:

- `modes/_shared.md`
- `SCRIPTS/ats/README.md`
- `data/ats/portals.example.yml`
- `data/ats/portals.yml` if it exists
- `data/ats/scan-history.tsv` if it exists
- `modes/RUN_LOG.md`

## What This Mode Can Verify

This mode can verify:

- whether a company appears to expose Greenhouse, Lever, or Ashby jobs;
- whether a configured portal scan produced new URLs;
- whether a job URL appears in scan history;
- whether a job posting is probably live when liveness tools are run.

This mode cannot verify:

- sponsorship likelihood by itself;
- role quality by itself;
- whether a company is a good target without checking SEC/H-1B and BLS/SOC data.

## Primary Tools

Use the maintained tools under `SCRIPTS/ats/`:

```bash
cd SCRIPTS/ats
python3 detect_ats.py "Databricks, Inc." "Anthropic" --output ../../data/ats/ats_detection_sample.csv
python3 detect_ats.py --csv ../../data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv --company-column company_name --output ../../data/ats/ats_detection.csv
cd ../..
npm run ats:scan
npm run ats:liveness -- --file data/ats/job-urls.txt
npm run ats:verify
```

If `data/ats/portals.yml` does not exist, copy
`data/ats/portals.example.yml` and edit the copy. Do not edit the example as a
working config.

To use a non-default config, set `REALLOCATION_ENGINE_PORTALS=/path/to/file.yml`
when running `node SCRIPTS/ats/scan.mjs`.

## Workflow

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

6. Log the run in `modes/RUN_LOG.md`.

## Output

For a scan, report:

- command run;
- input file or config;
- output file;
- total companies scanned;
- provider hits by platform;
- live URLs checked, if applicable;
- failures and likely causes;
- next test.

## Log Template

```markdown
## YYYY-MM-DD -- ATS scan

- **Mode:** scan
- **Input:** data/...
- **Command:** `...`
- **Output:** data/...
- **Worked:** ...
- **Did not work:** ...
- **Evidence:** row counts, provider counts, sample URLs
- **Next:** ...
```

## Prompting Rule

Only use LLM judgment after script output has been inspected. The LLM may
summarize patterns, explain likely failure causes, or propose the next test.
It must not invent ATS hits, live jobs, counts, or sponsorship claims.
