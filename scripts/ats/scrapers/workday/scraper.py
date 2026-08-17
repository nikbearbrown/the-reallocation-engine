#!/usr/bin/env python3
"""Production Workday ATS scraper.

Workday boards are addressed by three values that cannot be derived from a
company name — the pod host, the tenant, and the career-site name. All three
are recoverable from the public careers URL, so that URL is the only input:

    https://auroragov.wd1.myworkdayjobs.com/Careers
            └── tenant ┘ └ pod ┘              └ career site ┘

    -> POST https://auroragov.wd1.myworkdayjobs.com/wday/cxs/auroragov/Careers/jobs

Every company lands in exactly one summary bucket:

- ``found``               — HTTP 200, at least one posting survived validation.
- ``empty``               — HTTP 200 and the board reports zero postings. A
                            successful extraction of a real fact, not a failure.
- ``not_found``           — no board exists at this tenant/career-site pair.
                            Workday signals this two ways, both permanent and
                            both recorded with their status code: **404** for an
                            unknown career site on a real tenant, and **422**
                            for an unknown tenant. (``*.wdN.myworkdayjobs.com``
                            is wildcard DNS, so a fake tenant still resolves and
                            reaches Workday — the status code is the only
                            existence check available.)
- ``invalid_careers_url`` — the URL never matched the Workday pattern, so no
                            request was attempted. A configuration fault, not a
                            network one.
- ``errors``              — non-2xx, timeout/connection failure, JSON parse
                            failure, or postings that all failed validation.

EMPTY and ERROR are never conflated: an empty board keeps
``extraction_status="success"`` with ``job_count=0``, while an error records a
machine-readable reason and never claims a job count.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from scrapers.common.config import FILE_ENCODINGS, MAX_PAGES, REQUEST_TIMEOUT, SCRAPER_VERSION
from scrapers.common.logger import get_logger
from scrapers.common.normalize import normalize_company_name
from scrapers.common.rate_limiter import RateLimiter
from scrapers.common.retry import retry_request
from scrapers.common.schema_validator import validate_job_record

ATS_SOURCE = "workday"

# Workday's CXS search endpoint caps a page at 20 regardless of what `limit`
# asks for, so pagination steps by 20.
PAGE_LIMIT = 20

REQUEST_HEADERS = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

logger = get_logger("workday", file=False)

# Permanent "no such board" signals from the CXS endpoint, verified live against
# a known-good request body: 404 = real tenant but unknown career site;
# 422 = unknown tenant. Both are configuration faults, not transient failures,
# so they belong in `not_found` rather than beside timeouts and 5xx in `errors`.
# Only honored on the first page — mid-run they degrade the run to `partial`.
NOT_FOUND_STATUS_CODES = (404, 422)

# <tenant>.wd<N>.myworkdayjobs.com — the bare `wdN.myworkdayjobs.com` and apex
# names resolve to 127.0.0.1 by design, so the tenant subdomain is mandatory.
WORKDAY_HOST_RE = re.compile(
    r"^(?P<tenant>[a-z0-9][a-z0-9-]*)\.(?P<pod>wd\d+)\.myworkdayjobs\.com$",
    re.IGNORECASE,
)

# A leading locale segment ("/en-US/Careers") is optional and not part of the
# career-site name.
LOCALE_RE = re.compile(r"^[a-z]{2}-[a-z]{2}$", re.IGNORECASE)

# Career-site names are single path segments; anything else is rejected rather
# than escaped, so a malformed config can't smuggle a path into the API URL.
CAREER_SITE_RE = re.compile(r"^[A-Za-z0-9._~-]+$")


def parse_careers_url(careers_url: str) -> dict[str, str] | None:
    """Recover ``host`` / ``tenant`` / ``career_site`` from a public careers URL.

    Returns None when the URL is not a recognizable Workday board — the caller
    turns that into the ``invalid_careers_url`` bucket rather than attempting a
    request against a guessed host.
    """
    text = (careers_url or "").strip()
    if not text:
        return None
    if "//" not in text:
        # Tolerate a bare "tenant.wd1.myworkdayjobs.com/Careers" paste.
        text = f"https://{text}"

    parts = urlsplit(text)
    if parts.scheme not in ("http", "https"):
        return None

    match = WORKDAY_HOST_RE.match(parts.hostname or "")
    if not match:
        return None

    segments = [segment for segment in parts.path.split("/") if segment]
    if segments and LOCALE_RE.match(segments[0]):
        segments = segments[1:]
    if not segments:
        return None

    career_site = segments[0]
    if not CAREER_SITE_RE.match(career_site):
        return None

    host = f"{match.group('tenant')}.{match.group('pod')}.myworkdayjobs.com".lower()
    return {
        "host": host,
        "tenant": match.group("tenant").lower(),
        "career_site": career_site,
        "careers_url": f"https://{host}/{career_site}",
    }


def jobs_api_url(host: str, tenant: str, career_site: str) -> str:
    return f"https://{host}/wday/cxs/{tenant}/{career_site}/jobs"


def public_url(host: str, career_site: str) -> str:
    return f"https://{host}/{career_site}"


def search_body(offset: int) -> dict[str, Any]:
    return {"appliedFacets": {}, "limit": PAGE_LIMIT, "offset": offset, "searchText": ""}


def scraped_at() -> str:
    return datetime.now(timezone.utc).isoformat()


def job_source_url(host: str, career_site: str, external_path: str) -> str:
    """Build the public posting URL from Workday's ``externalPath``.

    ``externalPath`` arrives as ``/job/<Location>/<Title>_<Req>``, so the public
    form is ``https://<host>/en-US/<career_site>/job/...``. The leading slash and
    a redundant ``job/`` segment are normalized away — a malformed URL would fail
    the liveness gate downstream for reasons that have nothing to do with the job.
    """
    path = str(external_path or "").strip().lstrip("/")
    if path.startswith("job/"):
        path = path[len("job/"):]
    if not path:
        return public_url(host, career_site)
    return f"https://{host}/en-US/{career_site}/job/{path}"


def job_location(job: dict[str, Any]) -> str:
    """Workday returns ``locationsText`` as a string, or a list on multi-site reqs."""
    locations = job.get("locationsText")
    if isinstance(locations, list):
        return "; ".join(str(item) for item in locations if item)
    return str(locations or "")


def job_department(job: dict[str, Any]) -> str:
    """First ``jobFamilyGroup`` descriptor, tolerating dict/list/absent shapes."""
    group = job.get("jobFamilyGroup")
    if isinstance(group, list):
        for item in group:
            if isinstance(item, dict) and item.get("descriptor"):
                return str(item["descriptor"])
        return ""
    if isinstance(group, dict):
        return str(group.get("descriptor") or "")
    return ""


# Workday schedule descriptors → the closed enum in schema_validator.
# Anything unrecognized falls back to "" rather than guessing: "" is a valid
# schema value, an invented category is not.
EMPLOYMENT_TYPE_MAP = {
    "full time": "Full-time",
    "full-time": "Full-time",
    "fulltime": "Full-time",
    "part time": "Part-time",
    "part-time": "Part-time",
    "parttime": "Part-time",
    "contract": "Contract",
    "contractor": "Contract",
    "contingent": "Contract",
    "fixed term": "Contract",
    "temporary": "Contract",
    "intern": "Intern",
    "internship": "Intern",
}


def normalize_employment_type(job: dict[str, Any]) -> str:
    schedule = job.get("jobScheduleType")
    if isinstance(schedule, dict):
        descriptor = str(schedule.get("descriptor") or "")
    else:
        descriptor = str(schedule or "")

    key = descriptor.strip().lower()
    # Workday often decorates the descriptor: "Fixed Term (Fixed Term)".
    if "(" in key:
        key = key.split("(", 1)[0].strip()
    if not key:
        return ""

    mapped = EMPLOYMENT_TYPE_MAP.get(key)
    if mapped:
        return mapped

    logger.debug("Unmapped jobScheduleType descriptor %r — leaving employment_type empty", descriptor)
    return ""


# Absolute date formats seen in Workday `postedOn` / `startDate` fields.
_POSTED_ON_FORMATS = ("%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%b %d, %Y", "%B %d, %Y", "%d %b %Y")


def normalize_posted_on(value: Any) -> str:
    """Convert ``postedOn`` to an ISO 8601 date, or "" when it isn't a date.

    Workday usually sends a display string ("Posted 30+ Days Ago"), not a
    timestamp. Relative phrases are deliberately *not* converted to a date:
    deriving "2026-07-12" from "30+ Days Ago" would manufacture a precision the
    source never provided. Only genuine dates convert; everything else is "",
    which the unified schema accepts.
    """
    if not value:
        return ""
    text = str(value).strip()
    if not text:
        return ""

    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).date().isoformat()
    except ValueError:
        pass

    for fmt in _POSTED_ON_FORMATS:
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue

    logger.debug("postedOn %r is not an absolute date — leaving date_posted empty", text)
    return ""


def normalize_job(
    job: dict[str, Any],
    company_name: str,
    company_slug: str,
    host: str,
    career_site: str,
    extraction_status: str = "success",
) -> dict[str, Any]:
    external_path = str(job.get("externalPath") or "")
    job_id = str(job.get("jobPostingId") or external_path or "")
    source_url = job_source_url(host, career_site, external_path)

    return {
        "job_id": job_id,
        "title": str(job.get("title") or ""),
        "company_name": company_name,
        "company_slug": company_slug,
        "ats_source": ATS_SOURCE,
        "source_url": source_url,
        "apply_url": source_url,
        "location": job_location(job),
        "department": job_department(job),
        "employment_type": normalize_employment_type(job),
        "date_posted": normalize_posted_on(job.get("postedOn")),
        "description_text": "",
        "description_html": "",
        "salary_range": "",
        "metadata": {
            "scraped_at": scraped_at(),
            "scraper_version": SCRAPER_VERSION,
            "extraction_status": extraction_status,
        },
    }


def _failure(
    company_name: str,
    company_slug: str,
    board: dict[str, str],
    url: str,
    status_code: int | None,
    error: str,
) -> dict[str, Any]:
    """A hard failure — no job count is claimed, because none was observed."""
    return {
        "found": False,
        "empty": False,
        "invalid_url": False,
        "status_code": status_code,
        "company_name": company_name,
        "company_slug": company_slug,
        "careers_url": board.get("careers_url", ""),
        "host": board.get("host", ""),
        "tenant": board.get("tenant", ""),
        "career_site": board.get("career_site", ""),
        "url": url,
        "jobs": [],
        "raw": {"jobPostings": [], "total": None},
        "extraction_status": "error",
        "error": error,
    }


def fetch_jobs(
    company_name: str,
    careers_url: str,
    timeout: int = REQUEST_TIMEOUT,
    limiter: RateLimiter | None = None,
) -> dict[str, Any]:
    """Fetch every posting for the Workday board behind ``careers_url``."""
    company_slug = normalize_company_name(company_name)

    board = parse_careers_url(careers_url)
    if board is None:
        # No request is attempted: a bad URL is a configuration fault, and
        # guessing a host would turn it into a misleading network error.
        logger.error(
            "INVALID_CAREERS_URL %s: %r does not match "
            "https://<tenant>.wd<N>.myworkdayjobs.com/<career-site>",
            company_name, careers_url,
        )
        return {
            "found": False,
            "empty": False,
            "invalid_url": True,
            "status_code": None,
            "company_name": company_name,
            "company_slug": company_slug,
            "careers_url": careers_url,
            "host": "",
            "tenant": "",
            "career_site": "",
            "url": "",
            "jobs": [],
            "raw": {"jobPostings": [], "total": None},
            "extraction_status": "error",
            "error": "invalid_careers_url",
        }

    host, tenant, career_site = board["host"], board["tenant"], board["career_site"]
    url = jobs_api_url(host, tenant, career_site)

    raw_postings: list[dict[str, Any]] = []
    total: int | None = None
    page_errors: list[str] = []
    offset = 0
    pages = 0
    status_code: int | None = None

    while True:
        if limiter is not None:
            limiter.wait()

        response = retry_request(
            url,
            method="POST",
            timeout=timeout,
            headers=dict(REQUEST_HEADERS),
            json=search_body(offset),
        )
        first_page = pages == 0

        # --- transport-level outcomes ---
        if response is None:
            reason = f"request_failed_at_offset_{offset}"
            if first_page:
                logger.error("ERROR %s (%s): request failed — timeout or connection error", company_name, tenant)
                return _failure(company_name, company_slug, board, url, None, "request_failed")
            page_errors.append(reason)
            logger.warning("PARTIAL %s (%s): %s — keeping %d posting(s) fetched so far",
                           company_name, tenant, reason, len(raw_postings))
            break

        status_code = response.status_code

        if response.status_code in NOT_FOUND_STATUS_CODES and first_page:
            # Distinct from EMPTY: no board exists at this tenant/career-site pair.
            # Distinct from ERROR: permanent, so retrying will never help — 404 is
            # an unknown career site, 422 an unknown tenant. `status_code` keeps
            # the two separable downstream.
            return {
                "found": False,
                "empty": False,
                "invalid_url": False,
                "status_code": response.status_code,
                "company_name": company_name,
                "company_slug": company_slug,
                "careers_url": board["careers_url"],
                "host": host,
                "tenant": tenant,
                "career_site": career_site,
                "url": url,
                "jobs": [],
                "raw": {"jobPostings": [], "total": None},
                "extraction_status": "error",
                "error": "",
            }

        if response.status_code != 200:
            reason = f"unexpected_status_{response.status_code}_at_offset_{offset}"
            if first_page:
                logger.error("ERROR %s (%s): HTTP %d", company_name, tenant, response.status_code)
                return _failure(
                    company_name, company_slug, board, url,
                    response.status_code, f"unexpected_status_{response.status_code}",
                )
            page_errors.append(reason)
            logger.warning("PARTIAL %s (%s): %s", company_name, tenant, reason)
            break

        # --- payload-level outcomes ---
        try:
            payload = response.json()
        except ValueError as exc:
            reason = f"json_parse_failed_at_offset_{offset}"
            if first_page:
                logger.error("ERROR %s (%s): JSON parse failure — %s", company_name, tenant, exc)
                return _failure(
                    company_name, company_slug, board, url,
                    response.status_code, "json_parse_failed",
                )
            page_errors.append(reason)
            logger.warning("PARTIAL %s (%s): %s", company_name, tenant, reason)
            break

        if not isinstance(payload, dict):
            reason = f"unexpected_payload_type_{type(payload).__name__}_at_offset_{offset}"
            if first_page:
                logger.error("ERROR %s (%s): %s", company_name, tenant, reason)
                return _failure(
                    company_name, company_slug, board, url,
                    response.status_code, "unexpected_payload_type",
                )
            page_errors.append(reason)
            break

        if total is None:
            raw_total = payload.get("total")
            if isinstance(raw_total, bool) or not isinstance(raw_total, (int, float)):
                # Missing/garbled `total` is not an error on its own — fall back
                # to "stop on a short page" and say so, rather than inventing a count.
                logger.warning(
                    "%s (%s): response has no numeric 'total' (%r) — paginating until a short page",
                    company_name, tenant, raw_total,
                )
            else:
                total = int(raw_total)

        postings = payload.get("jobPostings")
        if postings is None:
            postings = []
        if not isinstance(postings, list):
            reason = f"unexpected_jobPostings_type_{type(postings).__name__}_at_offset_{offset}"
            if first_page:
                logger.error("ERROR %s (%s): %s", company_name, tenant, reason)
                return _failure(
                    company_name, company_slug, board, url,
                    response.status_code, "unexpected_jobPostings_type",
                )
            page_errors.append(reason)
            break

        raw_postings.extend(item for item in postings if isinstance(item, dict))
        pages += 1
        offset += PAGE_LIMIT

        # --- stop conditions ---
        if total is not None and offset >= total:
            break
        if len(postings) < PAGE_LIMIT:
            break
        if pages >= MAX_PAGES:
            page_errors.append(f"page_limit_reached_{MAX_PAGES}")
            logger.warning(
                "PARTIAL %s (%s): hit the %d-page safety limit at offset %d (total reported: %s)",
                company_name, tenant, MAX_PAGES, offset, total,
            )
            break

    # --- EMPTY: a successful extraction that found nothing ---
    if not raw_postings and not page_errors:
        logger.info("EMPTY %s (%s): board returned 0 postings (total=%s)", company_name, tenant, total)
        return {
            "found": True,
            "empty": True,
            "invalid_url": False,
            "status_code": status_code,
            "company_name": company_name,
            "company_slug": company_slug,
            "careers_url": board["careers_url"],
            "host": host,
            "tenant": tenant,
            "career_site": career_site,
            "url": url,
            "public_url": public_url(host, career_site),
            "open_job_count": 0,
            "total_reported": total if total is not None else 0,
            "jobs": [],
            "raw": {"jobPostings": [], "total": total if total is not None else 0},
            "validation_errors": [],
            "extraction_status": "success",
            "error": "",
        }

    page_status = "partial" if page_errors else "success"
    jobs = [
        normalize_job(job, company_name, company_slug, host, career_site, page_status)
        for job in raw_postings
    ]

    valid_jobs = []
    validation_errors = []
    for job in jobs:
        valid, job_errors = validate_job_record(job)
        if valid:
            valid_jobs.append(job)
        else:
            validation_errors.append({"job_id": job.get("job_id"), "errors": job_errors})

    # Records dropped for missing/invalid required fields degrade the run, but
    # both "success" and "partial" are valid enum values so re-stamping the
    # survivors cannot invalidate an already-validated record.
    extraction_status = "partial" if (page_errors or validation_errors) else "success"
    if extraction_status != page_status:
        for job in valid_jobs:
            job["metadata"]["extraction_status"] = extraction_status

    if raw_postings and not valid_jobs:
        # Postings came back but none was usable — an extraction error, never EMPTY.
        logger.error(
            "ERROR %s (%s): all %d posting(s) failed schema validation",
            company_name, tenant, len(raw_postings),
        )
        return {
            "found": False,
            "empty": False,
            "invalid_url": False,
            "status_code": status_code,
            "company_name": company_name,
            "company_slug": company_slug,
            "careers_url": board["careers_url"],
            "host": host,
            "tenant": tenant,
            "career_site": career_site,
            "url": url,
            "public_url": public_url(host, career_site),
            "open_job_count": 0,
            "total_reported": total,
            "jobs": [],
            "raw": {"jobPostings": raw_postings, "total": total},
            "validation_errors": validation_errors,
            "extraction_status": "error",
            "error": "validation_failed_all_records",
        }

    if validation_errors:
        logger.warning(
            "%s (%s): %d of %d posting(s) failed schema validation",
            company_name, tenant, len(validation_errors), len(raw_postings),
        )

    return {
        "found": True,
        "empty": False,
        "invalid_url": False,
        "status_code": status_code,
        "company_name": company_name,
        "company_slug": company_slug,
        "careers_url": board["careers_url"],
        "host": host,
        "tenant": tenant,
        "career_site": career_site,
        "url": url,
        "public_url": public_url(host, career_site),
        "open_job_count": len(valid_jobs),
        "total_reported": total,
        "jobs": valid_jobs,
        "raw": {"jobPostings": raw_postings, "total": total},
        "validation_errors": validation_errors,
        "extraction_status": extraction_status,
        "error": "; ".join(page_errors),
    }


def save_result(result: dict[str, Any], output_dir: Path) -> None:
    company_dir = output_dir / result["company_slug"]
    company_dir.mkdir(parents=True, exist_ok=True)
    (company_dir / "jobs.json").write_text(
        json.dumps(result["raw"], indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    metadata = {
        "original_name": result["company_name"],
        "normalized_name": result["company_slug"],
        "tenant": result["tenant"],
        "host": result["host"],
        "career_site": result["career_site"],
        "careers_url": result["careers_url"],
        "ats_source": ATS_SOURCE,
        "job_count": result.get("open_job_count", 0),
        "total_reported": result.get("total_reported"),
        "url": result.get("public_url", result["url"]),
        "api_url": result["url"],
        "scraped_at": scraped_at(),
        "extraction_status": result.get("extraction_status", "success"),
        "empty": result.get("empty", False),
        "validation_error_count": len(result.get("validation_errors", [])),
    }
    (company_dir / "metadata.json").write_text(
        json.dumps(metadata, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (company_dir / "normalized_jobs.json").write_text(
        json.dumps(result["jobs"], indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def process_companies(
    companies: list[tuple[str, str]],
    output_dir: Path,
    delay: float,
) -> dict[str, Any]:
    limiter = RateLimiter(min_delay=delay)
    summary: dict[str, Any] = {
        "found": [],
        "empty": [],
        "not_found": [],
        "invalid_careers_url": [],
        "errors": [],
    }

    for index, (company, careers_url) in enumerate(companies, start=1):
        result = fetch_jobs(company, careers_url, limiter=limiter)
        label = f"[{index}/{len(companies)}] {company} -> {result['tenant'] or careers_url}"

        if result["invalid_url"]:
            # No request was made, so nothing was observed and nothing is written.
            summary["invalid_careers_url"].append({
                "company": company,
                "slug": result["company_slug"],
                "careers_url": careers_url,
                "error": result["error"],
            })
            print(f"{label}: invalid careers URL")
        elif result["found"] and result["empty"]:
            # Zero open postings is a verified observation — save it as one.
            save_result(result, output_dir)
            summary["empty"].append({
                "company": company,
                "slug": result["company_slug"],
                "tenant": result["tenant"],
                "career_site": result["career_site"],
                "open_job_count": 0,
            })
            print(f"{label}: empty (0 jobs, board reachable)")
        elif result["found"]:
            save_result(result, output_dir)
            summary["found"].append({
                "company": company,
                "slug": result["company_slug"],
                "tenant": result["tenant"],
                "career_site": result["career_site"],
                "open_job_count": result["open_job_count"],
                "extraction_status": result["extraction_status"],
            })
            note = "" if result["extraction_status"] == "success" else f" ({result['extraction_status']})"
            print(f"{label}: found {result['open_job_count']} jobs{note}")
        elif result["error"]:
            # Raw postings are preserved for diagnosis when we got as far as parsing them.
            if result["raw"].get("jobPostings"):
                save_result(result, output_dir)
            summary["errors"].append({
                "company": company,
                "slug": result["company_slug"],
                "tenant": result["tenant"],
                "error": result["error"],
                "status_code": result.get("status_code"),
            })
            print(f"{label}: error {result['error']}")
        else:
            # 404 and 422 share this bucket but not this record: the status code
            # says which half of the pair was wrong (404 = career site, 422 = tenant).
            summary["not_found"].append({
                "company": company,
                "slug": result["company_slug"],
                "tenant": result["tenant"],
                "career_site": result["career_site"],
                "status_code": result.get("status_code"),
            })
            reason = {404: "unknown career site", 422: "unknown tenant"}.get(result.get("status_code"), "")
            print(f"{label}: not found (HTTP {result.get('status_code')}{f' — {reason}' if reason else ''})")

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(
        f"\n{len(summary['found'])} found · {len(summary['empty'])} empty · "
        f"{len(summary['not_found'])} not found · "
        f"{len(summary['invalid_careers_url'])} invalid URL · {len(summary['errors'])} errors"
    )
    return summary


def read_companies_from_csv(filepath: str) -> list[tuple[str, str]]:
    """Read ``company,careers_url`` pairs from a CSV, trying the shared encodings.

    Rows missing either value are skipped with a warning — a Workday lookup
    without a careers URL cannot be performed, and guessing one would turn a
    configuration gap into a fake "not found".
    """
    for encoding in FILE_ENCODINGS:
        try:
            with open(filepath, "r", newline="", encoding=encoding) as handle:
                reader = csv.DictReader(handle)
                if not reader.fieldnames:
                    logger.warning("File %s has no header row", filepath)
                    return []
                fields = {
                    name.strip().lower().replace("-", "_"): name
                    for name in reader.fieldnames if name
                }
                if "company" not in fields or "careers_url" not in fields:
                    raise SystemExit(
                        f"{filepath}: expected 'company' and 'careers_url' columns, "
                        f"found: {', '.join(reader.fieldnames)}"
                    )

                pairs: list[tuple[str, str]] = []
                for row_number, row in enumerate(reader, start=2):
                    company = (row.get(fields["company"]) or "").strip()
                    careers_url = (row.get(fields["careers_url"]) or "").strip()
                    if not company or not careers_url:
                        logger.warning(
                            "%s line %d: skipping row with missing company or careers_url (%r, %r)",
                            filepath, row_number, company, careers_url,
                        )
                        continue
                    pairs.append((company, careers_url))

                logger.info("Read %d company/careers-url pairs from %s (encoding: %s)",
                            len(pairs), filepath, encoding)
                return pairs
        except (UnicodeDecodeError, UnicodeError):
            continue
        except FileNotFoundError:
            logger.error("File not found: %s", filepath)
            raise

    logger.error("Could not decode file %s with any supported encoding", filepath)
    raise ValueError(f"Could not decode file {filepath} with any supported encoding")


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape Workday job boards.")
    parser.add_argument("--company", help="Company name to check (requires --careers-url).")
    parser.add_argument(
        "--careers-url",
        help="Public Workday careers URL, e.g. https://auroragov.wd1.myworkdayjobs.com/Careers",
    )
    parser.add_argument("-f", "--file", help="CSV file with 'company' and 'careers_url' columns.")
    parser.add_argument("-o", "--output", type=Path, default=Path("data/ats/workday"))
    parser.add_argument("-d", "--delay", type=float, default=0.5)
    args = parser.parse_args()

    companies: list[tuple[str, str]] = []
    if args.file:
        companies.extend(read_companies_from_csv(args.file))
    if args.company or args.careers_url:
        if not (args.company and args.careers_url):
            parser.error("--company and --careers-url must be given together.")
        companies.append((args.company, args.careers_url))

    if not companies:
        parser.print_help()
        sys.exit(1)

    process_companies(companies, args.output, args.delay)


if __name__ == "__main__":
    main()
