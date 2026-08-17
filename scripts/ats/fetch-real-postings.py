#!/usr/bin/env python3
"""Fetch real postings from Greenhouse/Lever and combine them into one file
ready for skill-demand-monitor.mjs.

Wraps this repo's own scrapers.greenhouse.scraper and scrapers.lever.scraper
(see README.md in this directory) so a real-postings pull for
skill-demand-monitor is one command instead of running each scraper
separately and combining their output by hand. Does not add any scraping
logic of its own; it only calls the existing, tested fetch_jobs() functions.

    cd scripts/ats
    python3 fetch-real-postings.py \\
      --greenhouse "Anthropic" "Databricks" \\
      --lever "Palantir" \\
      -o ../../private/real-postings/my-run.json

Real network calls. Real company data. Output lands in private/ by default —
never commit real scraped postings (see private/README.md).
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from scrapers.greenhouse.scraper import fetch_jobs as fetch_greenhouse_jobs
from scrapers.lever.scraper import fetch_jobs as fetch_lever_jobs


def fetch_all(greenhouse_companies: list[str], lever_companies: list[str]) -> dict[str, Any]:
    postings: list[dict[str, Any]] = []
    found: list[dict[str, str]] = []
    not_found: list[dict[str, str]] = []

    for company in greenhouse_companies:
        result = fetch_greenhouse_jobs(company)
        _record_result("greenhouse", company, result, postings, found, not_found)

    for company in lever_companies:
        result = fetch_lever_jobs(company)
        _record_result("lever", company, result, postings, found, not_found)

    with_description = sum(1 for p in postings if p.get("description_text", "").strip())

    return {
        "postings": postings,
        "summary": {
            "companies_requested": len(greenhouse_companies) + len(lever_companies),
            "companies_found": found,
            "companies_not_found": not_found,
            "total_postings": len(postings),
            "postings_with_description_text": with_description,
            "postings_missing_description_text": len(postings) - with_description,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        },
    }


def _record_result(source: str, company: str, result: dict[str, Any], postings: list, found: list, not_found: list) -> None:
    if result.get("found"):
        postings.extend(result["jobs"])
        found.append({"source": source, "company": company, "count": len(result["jobs"])})
        print(f"[{source}] {company}: found {len(result['jobs'])} jobs")
    else:
        not_found.append({"source": source, "company": company, "error": result.get("error", "")})
        print(f"[{source}] {company}: not found{' — ' + result['error'] if result.get('error') else ''}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--greenhouse", nargs="*", default=[], help="Company names to fetch via Greenhouse.")
    parser.add_argument("--lever", nargs="*", default=[], help="Company names to fetch via Lever.")
    parser.add_argument("-o", "--output", type=Path, required=True, help="Where to write the combined postings JSON.")
    args = parser.parse_args()

    if not args.greenhouse and not args.lever:
        parser.error("pass at least one company via --greenhouse or --lever")

    result = fetch_all(args.greenhouse, args.lever)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({"postings": result["postings"]}, indent=2, ensure_ascii=False), encoding="utf-8")

    s = result["summary"]
    print()
    print(f"{s['total_postings']} real postings combined from {len(s['companies_found'])}/{s['companies_requested']} companies found")
    print(f"  {s['postings_with_description_text']} have description_text, {s['postings_missing_description_text']} do not (schema gate will reject those)")
    print(f"  wrote {args.output}")
    if s["companies_not_found"]:
        print(f"  not found: {[c['company'] for c in s['companies_not_found']]}")


if __name__ == "__main__":
    main()
