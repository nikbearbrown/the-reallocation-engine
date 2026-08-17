# Verified vs. Inferred — Workday ATS Connector

The boundary table required by the verified-data contract: every field and number
this component emits, and where it comes from. Companion to `ATTESTATION.md`.

**Labels used**

| Label | Meaning |
|---|---|
| `record` | Copied verbatim from the Workday API response |
| `script-output` | Computed deterministically by this connector from a record and/or an operator input — same inputs, same output, every time |
| `local-evidence` | Read from a file already on disk in this repository |
| `external-source` | Fetched from a third party outside the API response |
| `model-inference` | Produced by a language model |
| `your-input` | Supplied by the operator on the command line or in the CSV |
| `missing` | Not populated; left empty rather than guessed |

**The headline:** the `model-inference` column is empty. This component makes no
LLM calls of any kind. That is a property of how it is built, not a claim about
model reliability.

---

## Emitted record fields (`normalized_jobs.json`)

| Field | Label | Traces to |
|---|---|---|
| `job_id` | `record` | `jobPostings[].jobPostingId`, falling back to `jobPostings[].externalPath` when the tenant omits the ID. On the Aurora run, all 39 used the `externalPath` fallback. |
| `title` | `record` | `jobPostings[].title`, verbatim |
| `company_name` | `your-input` | The `--company` argument, verbatim. The connector never derives, corrects, or looks up an employer name. |
| `company_slug` | `script-output` | `normalize_company_name(company_name)` in `scrapers/common/normalize.py` — strips legal suffixes and punctuation, lowercases |
| `ats_source` | `script-output` | Constant `"workday"` |
| `source_url` | `script-output` | `https://{host}/en-US/{career_site}` + `jobPostings[].externalPath`. Host and career site come from parsing `--careers-url`; the path segment is a record. |
| `apply_url` | `script-output` | Same value as `source_url`. The list endpoint exposes no separate apply link, so this is a deliberate duplicate, not a second observation. |
| `location` | `record` when present, else `missing` | `jobPostings[].locationsText`. **Absent on all 39 Aurora records → emitted empty.** |
| `department` | `record` when present, else `missing` | `jobPostings[].jobFamilyGroup[0].descriptor`. **Absent on all 39 → empty.** |
| `employment_type` | `script-output` when present, else `missing` | Deterministic lookup of `jobPostings[].jobScheduleType.descriptor` against a fixed 13-entry map. Unmapped descriptors return `""`. **Absent on all 39 → empty.** |
| `date_posted` | `script-output` when parseable, else `missing` | `jobPostings[].postedOn`, converted only when it is an absolute date in one of six formats. Relative strings ("Posted Today") are **not** converted. **All 39 were relative → empty.** |
| `description_text` | `missing` | The list endpoint does not return descriptions. Retrieving them needs one request per posting; not implemented. |
| `description_html` | `missing` | As above |
| `salary_range` | `missing` | Never populated by this connector on any tenant |
| `metadata.scraped_at` | `script-output` | System clock at normalization time, UTC ISO 8601 |
| `metadata.scraper_version` | `script-output` | Constant from `scrapers/common/config.py` |
| `metadata.extraction_status` | `script-output` | Derived from the run: `success` when all pages fetched and all records validated, `partial` when a page failed mid-run or some records were dropped |

## Emitted run fields (`metadata.json`, `summary.json`)

| Field | Label | Traces to |
|---|---|---|
| `host`, `tenant`, `career_site`, `careers_url` | `script-output` | Parsed from the `--careers-url` operator input by `parse_careers_url()` |
| `api_url` | `script-output` | Assembled from the three parsed values |
| `total_reported` | `record` | The board's own `total` field, verbatim. **This is Workday's count, not ours** — the connector does not verify it. |
| `job_count` / `open_job_count` | `script-output` | `len()` of records that passed `validate_job_record()` |
| `validation_error_count` | `script-output` | `len()` of records that failed validation |
| `status_code` | `record` | The HTTP status returned by the board |
| `empty` | `script-output` | True when the board returned 200 with zero postings |
| Bucket assignment (`found` / `empty` / `not_found` / `invalid_careers_url` / `errors`) | `script-output` | Deterministic classification of the HTTP status and payload shape. The 404/422 → `not_found` rule is a **human decision** recorded in `logs/RUN_LOG.md` (2026-08-12) and in `ATTESTATION.md`; it is justified by observed status codes, not derived from the spec. |

## Numbers reported by the audit (`workday-audit.md`)

Every figure in the audit is counted from files on disk by `audit.py`. None is
estimated, sampled, or extrapolated.

| Number | Traces to |
|---|---|
| Bucket counts | `len()` of each list in `summary.json` |
| Records on disk | `len()` of each `normalized_jobs.json` |
| Required-field completeness | Per-record non-empty check against the six required fields |
| Optional-field fill rates | Count of non-empty values ÷ record count, per field |
| Summary-vs-disk reconciliation | Set comparison between `summary.json` slugs and directories present |

## Numbers that are *not* claimed

Stated explicitly, because their absence is the point:

- **No coverage rate.** The connector does not claim what fraction of Workday
  employers it can reach. One tenant has been run; that supports no rate.
- **No liveness call.** Whether a posting still accepts applications is the
  downstream liveness gate's judgment, not this component's.
- **No location on this tenant.** Location text *is* present in the raw response,
  inside `bulletFields` — an undocumented positional array. Reading position `[1]`
  as "location" would have filled the field on all 39 records. It is left
  `missing` because the array's ordering is a per-tenant display configuration,
  and a positional guess published into a field consumers read as verified is
  precisely the failure the contract exists to prevent.
- **No inferred posting date.** "Posted Today" is not converted to a calendar
  date, because the phrase does not carry one.
