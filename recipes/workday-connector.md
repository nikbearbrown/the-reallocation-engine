---
status: RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED
todos_open: 0
last_gate: "live-run, 2026-08-12, logs/RUN_LOG.md#2026-08-12"
attestation: null      # path to attestation record, set only at VERIFIED
recipe_version: 0.2.0
---

# Recipe: Workday ATS Connector

## 1. Executive summary

Scrapes public job postings from a Workday tenant's CXS API, given only that
tenant's public careers URL. Emits the unified job-posting schema
(`scripts/ats/scrapers/common/schema_validator.py`). Zero-token, zero-auth —
public HTTP only. Every company lands in exactly one of five buckets: `found`,
`empty`, `not_found`, `invalid_careers_url`, `errors`. No field is ever
invented; four optional schema fields (`location`, `department`,
`employment_type`, `date_posted`) are frequently empty because this API does
not reliably expose them — that is a property of the source, not a defect in
the connector.

## 2. Required reads (in order, before running)

1. `DATA_CONTRACT.md` — file-layer contract; `data/ats/` is Generated, private, uncommitted.
2. `scripts/ats/scrapers/common/schema_validator.py` — the unified record schema this connector must satisfy.
3. `scripts/ats/scrapers/lever/scraper.py` — the sibling connector this one is structurally modeled on.
4. `logs/RUN_LOG.md` — append an entry for every run; do not skip this.

## 3. Phase gates (each with a failure path)

| Gate | Passes when | Failure path |
|---|---|---|
| URL-pattern gate | `careers_url` matches `<tenant>.wd<N>.myworkdayjobs.com/<career-site>` | Bucket = `invalid_careers_url`. **No HTTP request is made.** Logged as a configuration fault, not a network fault. |
| Reachability gate | First-page request returns any HTTP status | Connection error / timeout on first page → bucket = `errors`, reason = `request_failed`. Retried 3x with backoff before this fires. |
| Existence gate | First-page status is not in `{404, 422}` | Status `404` or `422` on first page → bucket = `not_found`, `status_code` preserved so the two causes (unknown career-site vs. unknown tenant) stay distinguishable. |
| Schema-validation gate | At least one returned posting passes `validate_job_record()` | Zero postings pass → bucket = `errors`, reason = `validation_failed_all_records`. Raw response is still written to disk for diagnosis. |
| Mid-run degradation gate | A page fails after page 1 already succeeded | Run is not aborted or reclassified as `not_found`/`errors` — it degrades to `extraction_status: "partial"`, keeping pages already fetched. |

## 4. Primary stored tools

- `scripts/ats/scrapers/workday/scraper.py` (this connector)
- `scripts/ats/scrapers/workday/audit.py` (plausibility audit over a completed run;
  a separate tool so the attested connector stays byte-identical)
- `scripts/ats/scrapers/common/` (shared: `normalize.py`, `retry.py`, `rate_limiter.py`, `schema_validator.py`, `logger.py`, `config.py`) — reused, not reimplemented.

No stored script exists yet for per-tenant `bulletFields` decoding or
per-posting detail fetches (would recover `location`/`date_posted` on tenants
like Aurora). Not implemented — flagged, not faked.

## 5. Workflow

python -m scrapers.workday.scraper --company "<Name>" --careers-url "<url>" -o data/ats/workday/
python -m scrapers.workday.scraper --file companies.csv -o data/ats/workday/


1. Parse `careers_url` into `{host, tenant, career_site}` or fail the URL-pattern gate.
2. POST to `https://<host>/wday/cxs/<tenant>/<career_site>/jobs`, paginating by 20 until `offset >= total`.
3. Classify the response per the phase gates above.
4. Normalize surviving postings to the unified schema.
5. Write `jobs.json`, `normalized_jobs.json`, `metadata.json` per company; `summary.json` at the output root.
6. Audit the run before trusting it:
   `python -m scrapers.workday.audit <output-dir> -o <output-dir>/workday-audit.md`

## 6. Output contract

Per company, under `-o` (default `data/ats/workday/<slug>/`):
- `jobs.json` — raw CXS response, verbatim
- `normalized_jobs.json` — array of unified records
- `metadata.json` — original_name, normalized_name, tenant, host, career_site, careers_url, ats_source, job_count, total_reported, api_url, scraped_at, extraction_status, validation_error_count
- `summary.json` at root — found/empty/not_found/invalid_careers_url/errors buckets
- `workday-audit.md` at root (written by `audit.py`) — bucket counts, count
  reconciliation, required-field completeness, optional-field fill rates, and a
  summary-vs-disk check. Every figure is counted from the run's own files.

A company that lands in `invalid_careers_url` or `errors` (first-page failure) writes no per-company directory.

## 7. Verification checks

- `pytest scripts/ats/scrapers/workday/test_scraper.py` — 94/94 must pass, including the mid-run-422-stays-partial regression guard.
- `node scripts/conformance.mjs` — clean.
- Every emitted record passes `validate_batch(strict=True)`.
- Spot-check: fetch two `source_url` values live; both must return HTTP 200.
- `python -m scrapers.workday.audit <output-dir>` — read the findings section. A
  non-empty finding is not automatically a failure; it is a question for a human.
- Boundary table (`scripts/ats/scrapers/workday/VERIFIED-INFERRED.md`) still
  describes every emitted field. If a field is added, update it in the same commit.

## 8. Logging rules

- Every run appends an entry to `logs/RUN_LOG.md`: timestamp, command, bucket counts, any reclassification decisions made and why.
- A judgment call that changes classification behavior must cite the live evidence that justified it.

## 9. Stop conditions

- Stop if any bucket count in a real run doesn't match `summary.json`.
- Stop if the audit reports a summary-vs-disk mismatch and the run is being read
  by anything downstream — `summary.json` reflects only the most recent run,
  while company directories persist.
- Stop if a field would be populated from an undocumented source (e.g. `bulletFields` positional decoding) without human-reviewed per-tenant config.
- Stop if `npm run doctor` or `npm run verify` is not clean.
- Stop if `myworkdayjobs.com` is blackholed in the current environment — wildcard DNS means fake tenants also resolve, so a DNS failure indicates an environment problem, not a real absence.
