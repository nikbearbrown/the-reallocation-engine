#!/usr/bin/env python3
"""Unified ATS detector for company lists."""

from __future__ import annotations

import argparse
import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable

from scrapers.common.normalize import normalize_company_name, read_companies_from_file
from scrapers.common.rate_limiter import RateLimiter
from scrapers.greenhouse.scraper import fetch_jobs as fetch_greenhouse_jobs
from scrapers.lever.scraper import fetch_jobs as fetch_lever_jobs

Detector = Callable[[str], dict]

PLATFORMS: list[tuple[str, Detector]] = [
    ("greenhouse", fetch_greenhouse_jobs),
    ("lever", fetch_lever_jobs),
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def detect_ats(company_name: str, platforms: list[str] | None = None) -> dict:
    """Try ATS platforms in priority order and return the first hit."""
    requested = set(platforms or [name for name, _ in PLATFORMS])
    company_slug = normalize_company_name(company_name)
    attempts = []

    for platform, detector in PLATFORMS:
        if platform not in requested:
            continue

        result = detector(company_name)
        attempts.append({
            "platform": platform,
            "status_code": result.get("status_code"),
            "url": result.get("url", ""),
            "error": result.get("error", ""),
            "found": bool(result.get("found")),
            "open_job_count": result.get("open_job_count", 0),
        })

        if result.get("found"):
            return {
                "company_name": company_name,
                "ats_platform": platform,
                "ats_slug": result.get("company_slug", company_slug),
                "ats_url": result.get("public_url", result.get("url", "")),
                "ats_api_url": result.get("url", ""),
                "open_job_count": result.get("open_job_count", 0),
                "detection_status": "found",
                "detected_at": now_iso(),
                "attempts": attempts,
            }

    return {
        "company_name": company_name,
        "ats_platform": "",
        "ats_slug": company_slug,
        "ats_url": "",
        "ats_api_url": "",
        "open_job_count": 0,
        "detection_status": "not_found",
        "detected_at": now_iso(),
        "attempts": attempts,
    }


def read_companies_from_csv(path: Path, column: str) -> list[str]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            return []
        if column not in reader.fieldnames:
            raise SystemExit(
                f"Column {column!r} not found in {path}. Available: {', '.join(reader.fieldnames)}"
            )
        return [row[column].strip() for row in reader if row.get(column, "").strip()]


def flatten_result(result: dict) -> dict[str, object]:
    return {
        "company_name": result["company_name"],
        "ats_platform": result["ats_platform"],
        "ats_slug": result["ats_slug"],
        "ats_url": result["ats_url"],
        "ats_api_url": result["ats_api_url"],
        "open_job_count": result["open_job_count"],
        "detection_status": result["detection_status"],
        "detected_at": result["detected_at"],
        "attempt_count": len(result["attempts"]),
    }


def write_csv(path: Path, results: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rows = [flatten_result(result) for result in results]
    fieldnames = list(rows[0].keys()) if rows else [
        "company_name",
        "ats_platform",
        "ats_slug",
        "ats_url",
        "ats_api_url",
        "open_job_count",
        "detection_status",
        "detected_at",
        "attempt_count",
    ]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, results: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")


def write_audit(path: Path, results: list[dict], platforms: list[str]) -> None:
    total = len(results)
    found = [result for result in results if result["detection_status"] == "found"]
    by_platform: dict[str, int] = {}
    for result in found:
        by_platform[result["ats_platform"]] = by_platform.get(result["ats_platform"], 0) + 1

    def pct(count: int) -> str:
        return f"{(count / total) * 100:.1f}%" if total else "0.0%"

    lines = [
        "# ATS Detection Audit",
        "",
        f"**Generated at:** {now_iso()}",
        f"**Companies checked:** {total:,}",
        f"**Platforms:** {', '.join(platforms)}",
        "",
        "| Metric | Count | Share |",
        "|---|---:|---:|",
        f"| Found ATS | {len(found):,} | {pct(len(found))} |",
        f"| Not found | {total - len(found):,} | {pct(total - len(found))} |",
    ]

    if by_platform:
        lines.extend(["", "## By Platform", "", "| Platform | Count | Share |", "|---|---:|---:|"])
        for platform, count in sorted(by_platform.items(), key=lambda item: item[0]):
            lines.append(f"| {platform} | {count:,} | {pct(count)} |")

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- Detection returns the first platform hit in configured priority order.",
            "- Current priority order is Greenhouse, then Lever.",
            "- Workable and Ashby are intentionally not included until their production scrapers exist.",
            "",
        ]
    )

    path.write_text("\n".join(lines), encoding="utf-8")


def parse_platforms(value: str) -> list[str]:
    platforms = [item.strip().lower() for item in value.split(",") if item.strip()]
    valid = {name for name, _ in PLATFORMS}
    invalid = [item for item in platforms if item not in valid]
    if invalid:
        raise argparse.ArgumentTypeError(
            f"Unknown platform(s): {', '.join(invalid)}. Valid: {', '.join(sorted(valid))}"
        )
    return platforms


def main() -> None:
    parser = argparse.ArgumentParser(description="Detect ATS platform for companies.")
    parser.add_argument("companies", nargs="*", help="Company names to check.")
    parser.add_argument("--file", help="Newline-delimited company names file.")
    parser.add_argument("--csv", type=Path, help="CSV input file.")
    parser.add_argument("--company-column", default="company_name", help="Company name column for --csv.")
    parser.add_argument(
        "--platforms",
        type=parse_platforms,
        default=[name for name, _ in PLATFORMS],
        help="Comma-separated platforms. Default: greenhouse,lever.",
    )
    parser.add_argument("--output", type=Path, help="Output CSV path.")
    parser.add_argument("--json-output", type=Path, help="Optional full JSON output path.")
    parser.add_argument("--delay", type=float, default=0.5, help="Delay between companies.")
    args = parser.parse_args()

    companies: list[str] = []
    if args.file:
        companies.extend(read_companies_from_file(args.file))
    if args.csv:
        companies.extend(read_companies_from_csv(args.csv, args.company_column))
    companies.extend(args.companies)

    if not companies:
        parser.print_help()
        sys.exit(1)

    limiter = RateLimiter(min_delay=args.delay)
    results = []
    for index, company in enumerate(companies, start=1):
        limiter.wait()
        result = detect_ats(company, args.platforms)
        results.append(result)
        platform = result["ats_platform"] or "none"
        print(f"[{index}/{len(companies)}] {company} -> {platform} ({result['open_job_count']} jobs)")

    if args.output:
        write_csv(args.output, results)
        write_audit(args.output.with_name(f"{args.output.stem}-audit.md"), results, args.platforms)
    if args.json_output:
        write_json(args.json_output, results)

    if not args.output and not args.json_output:
        print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
