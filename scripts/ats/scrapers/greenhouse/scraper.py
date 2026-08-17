#!/usr/bin/env python3
"""Production Greenhouse ATS scraper."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from scrapers.common.config import REQUEST_TIMEOUT, SCRAPER_VERSION
from scrapers.common.normalize import normalize_company_name, read_companies_from_file
from scrapers.common.rate_limiter import RateLimiter
from scrapers.common.retry import retry_request
from scrapers.common.schema_validator import validate_job_record

ATS_SOURCE = "greenhouse"


def board_api_url(company_slug: str) -> str:
    return f"https://boards-api.greenhouse.io/v1/boards/{company_slug}/jobs"


def board_url(company_slug: str) -> str:
    return f"https://boards.greenhouse.io/{company_slug}"


def scraped_at() -> str:
    return datetime.now(timezone.utc).isoformat()


def job_location(job: dict[str, Any]) -> str:
    location = job.get("location") or {}
    if isinstance(location, dict):
        return str(location.get("name") or "")
    return str(location or "")


def normalize_job(job: dict[str, Any], company_name: str, company_slug: str) -> dict[str, Any]:
    job_id = str(job.get("id") or job.get("absolute_url") or "")
    source_url = str(job.get("absolute_url") or board_url(company_slug))
    record = {
        "job_id": job_id,
        "title": str(job.get("title") or ""),
        "company_name": company_name,
        "company_slug": company_slug,
        "ats_source": ATS_SOURCE,
        "source_url": source_url,
        "apply_url": source_url,
        "location": job_location(job),
        "department": "",
        "employment_type": "",
        "date_posted": "",
        "description_text": "",
        "description_html": "",
        "salary_range": "",
        "metadata": {
            "scraped_at": scraped_at(),
            "scraper_version": SCRAPER_VERSION,
            "extraction_status": "success",
        },
    }

    departments = job.get("departments") or []
    if departments and isinstance(departments, list):
        names = [str(item.get("name", "")) for item in departments if isinstance(item, dict)]
        record["department"] = "; ".join(name for name in names if name)

    return record


def fetch_jobs(company_name: str, timeout: int = REQUEST_TIMEOUT) -> dict[str, Any]:
    company_slug = normalize_company_name(company_name)
    url = board_api_url(company_slug)
    response = retry_request(url, timeout=timeout)

    if response is None:
        return {
            "found": False,
            "status_code": None,
            "company_name": company_name,
            "company_slug": company_slug,
            "url": url,
            "jobs": [],
            "raw": {},
            "error": "request_failed",
        }

    if response.status_code == 404:
        return {
            "found": False,
            "status_code": response.status_code,
            "company_name": company_name,
            "company_slug": company_slug,
            "url": url,
            "jobs": [],
            "raw": {},
            "error": "",
        }

    if response.status_code != 200:
        return {
            "found": False,
            "status_code": response.status_code,
            "company_name": company_name,
            "company_slug": company_slug,
            "url": url,
            "jobs": [],
            "raw": {},
            "error": f"unexpected_status_{response.status_code}",
        }

    raw = response.json()
    raw_jobs = raw.get("jobs", []) if isinstance(raw, dict) else []
    jobs = [normalize_job(job, company_name, company_slug) for job in raw_jobs]

    valid_jobs = []
    errors = []
    for job in jobs:
        valid, job_errors = validate_job_record(job)
        if valid:
            valid_jobs.append(job)
        else:
            errors.append({"job_id": job.get("job_id"), "errors": job_errors})

    return {
        "found": True,
        "status_code": response.status_code,
        "company_name": company_name,
        "company_slug": company_slug,
        "url": url,
        "public_url": board_url(company_slug),
        "open_job_count": len(valid_jobs),
        "jobs": valid_jobs,
        "raw": raw,
        "validation_errors": errors,
        "error": "",
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
        "ats_source": ATS_SOURCE,
        "job_count": result.get("open_job_count", 0),
        "url": result.get("public_url", result["url"]),
        "api_url": result["url"],
        "scraped_at": scraped_at(),
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


def process_companies(companies: list[str], output_dir: Path, delay: float) -> dict[str, Any]:
    limiter = RateLimiter(min_delay=delay)
    summary = {"found": [], "not_found": [], "errors": []}

    for index, company in enumerate(companies, start=1):
        limiter.wait()
        result = fetch_jobs(company)
        label = f"[{index}/{len(companies)}] {company} -> {result['company_slug']}"

        if result["found"]:
            save_result(result, output_dir)
            summary["found"].append({
                "company": company,
                "slug": result["company_slug"],
                "open_job_count": result["open_job_count"],
            })
            print(f"{label}: found {result['open_job_count']} jobs")
        elif result["error"]:
            summary["errors"].append({
                "company": company,
                "slug": result["company_slug"],
                "error": result["error"],
            })
            print(f"{label}: error {result['error']}")
        else:
            summary["not_found"].append(company)
            print(f"{label}: not found")

    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape Greenhouse job boards.")
    parser.add_argument("companies", nargs="*", help="Company names to check.")
    parser.add_argument("-f", "--file", help="Company names file, one per line.")
    parser.add_argument("-o", "--output", type=Path, default=Path("data/ats/greenhouse"))
    parser.add_argument("-d", "--delay", type=float, default=0.5)
    args = parser.parse_args()

    companies: list[str] = []
    if args.file:
        companies.extend(read_companies_from_file(args.file))
    companies.extend(args.companies)

    if not companies:
        parser.print_help()
        sys.exit(1)

    process_companies(companies, args.output, args.delay)


if __name__ == "__main__":
    main()
