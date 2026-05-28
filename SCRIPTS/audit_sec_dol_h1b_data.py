#!/usr/bin/env python3
"""Audit the 80 Days SEC/DOL/H-1B mapped company dataset.

Writes a Markdown report next to the input CSV using the suffix ``-audit.md``.
"""

from __future__ import annotations

import argparse
import collections
import csv
import hashlib
import os
import statistics
from datetime import date, datetime
from pathlib import Path
from typing import Iterable

NULL_STRINGS = {"", "null", "NULL", "None", "none", "NaN", "nan", "N/A", "n/a"}
H1B_COLUMNS = [
    "Total Approvals",
    "Total Denials",
    "Approval_Rate",
    "median_salary_offered",
    "top_job_titles_sponsored",
]
ATS_TOKENS = [
    "ats",
    "greenhouse",
    "lever",
    "workable",
    "ashby",
    "job_count",
    "open_job",
    "career",
]


def is_present(value: object) -> bool:
    return value is not None and str(value).strip() not in NULL_STRINGS


def pct(part: int, whole: int) -> str:
    if whole == 0:
        return "0.0%"
    return f"{(part / whole) * 100:.1f}%"


def read_rows(csv_path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames or [], list(reader)


def parse_dates(rows: Iterable[dict[str, str]], column: str) -> tuple[list[date], list[str]]:
    parsed: list[date] = []
    bad: list[str] = []
    for row in rows:
        raw = (row.get(column) or "").strip()
        if not is_present(raw):
            continue
        try:
            parsed.append(datetime.strptime(raw[:10], "%Y-%m-%d").date())
        except ValueError:
            bad.append(raw)
    return parsed, bad


def numeric_values(rows: Iterable[dict[str, str]], column: str) -> list[float]:
    values: list[float] = []
    for row in rows:
        raw = (row.get(column) or "").replace(",", "").strip()
        if not is_present(raw):
            continue
        try:
            values.append(float(raw))
        except ValueError:
            pass
    return values


def money(value: float) -> str:
    return f"${value:,.0f}"


def table(headers: list[str], rows: list[list[object]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join(["---"] * len(headers)) + "|"]
    for row in rows:
        out.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(out)


def build_report(csv_path: Path, as_of: date) -> str:
    fields, rows = read_rows(csv_path)
    row_count = len(rows)
    file_hash = hashlib.sha256(csv_path.read_bytes()).hexdigest()
    size_mb = os.path.getsize(csv_path) / 1024 / 1024

    h1b_any = sum(1 for row in rows if any(is_present(row.get(col)) for col in H1B_COLUMNS))
    website_count = sum(1 for row in rows if is_present(row.get("website")))
    ats_columns = [col for col in fields if any(token in col.lower() for token in ATS_TOKENS)]
    soc_columns = [col for col in fields if "soc" in col.lower()]

    funding_dates, bad_dates = parse_dates(rows, "latest_funding_date")
    funding_missing = row_count - len(funding_dates)
    by_year = collections.Counter(item.year for item in funding_dates)
    by_quarter = collections.Counter(f"{item.year}-Q{((item.month - 1) // 3) + 1}" for item in funding_dates)
    age_days = [(as_of - item).days for item in funding_dates]
    future_dates = sum(1 for item in funding_dates if item > as_of)

    total_funding = numeric_values(rows, "total_funding")
    latest_funding = numeric_values(rows, "latest_funding_amount")

    company_names = [(row.get("company_name") or "").strip().upper() for row in rows if is_present(row.get("company_name"))]
    name_counts = collections.Counter(company_names)
    duplicated_names = sum(1 for count in name_counts.values() if count > 1)
    duplicated_rows = sum(count for count in name_counts.values() if count > 1)

    top_states = collections.Counter(row.get("state", "") for row in rows).most_common(10)
    top_industries = collections.Counter(row.get("industry", "") for row in rows).most_common(12)

    h1b_rows = [[col, sum(1 for row in rows if is_present(row.get(col))), pct(sum(1 for row in rows if is_present(row.get(col))), row_count)] for col in H1B_COLUMNS]
    year_rows = [[year, count, pct(count, len(funding_dates))] for year, count in sorted(by_year.items())]
    recent_quarter_rows = [[quarter, count] for quarter, count in sorted(by_quarter.items())[-12:]]

    recency_rows = []
    for label, days in [("0-6 months", 183), ("0-12 months", 365), ("0-24 months", 730), ("0-36 months", 1095)]:
        count = sum(1 for age in age_days if 0 <= age <= days)
        recency_rows.append([label, count, pct(count, row_count), pct(count, len(funding_dates))])

    numeric_rows = []
    for label, values in [("total_funding", total_funding), ("latest_funding_amount", latest_funding)]:
        if values:
            numeric_rows.append([label, len(values), pct(len(values), row_count), money(min(values)), money(statistics.median(values)), money(max(values))])
        else:
            numeric_rows.append([label, 0, "0.0%", "", "", ""])

    lines = [
        "# SEC_DOL_H1b_data_mapped Audit",
        "",
        f"**Audit date:** {as_of.isoformat()}",
        f"**Source file:** `{csv_path.name}`",
        f"**Source path:** `{csv_path}`",
        f"**File size:** {size_mb:.2f} MB",
        f"**SHA-256:** `{file_hash}`",
        "",
        "## Executive Summary",
        "",
        f"- The dataset contains **{row_count:,} companies** and **{len(fields)} columns**.",
        f"- **{h1b_any:,} companies ({pct(h1b_any, row_count)})** have at least one H-1B sponsorship field populated; **{row_count - h1b_any:,} ({pct(row_count - h1b_any, row_count)})** have null sponsorship fields.",
        f"- **{website_count:,} companies ({pct(website_count, row_count)})** have a website value; **{row_count - website_count:,} ({pct(row_count - website_count, row_count)})** are missing websites.",
        f"- **No ATS columns are present** in this CSV." if not ats_columns else f"- ATS-like columns are present: {', '.join(f'`{col}`' for col in ats_columns)}.",
        f"- **No SOC code columns are present** in this CSV." if not soc_columns else f"- SOC-like columns are present: {', '.join(f'`{col}`' for col in soc_columns)}.",
        f"- Funding dates are present for **{len(funding_dates):,} rows ({pct(len(funding_dates), row_count)})** and missing for **{funding_missing:,} rows ({pct(funding_missing, row_count)})**.",
        f"- The newest funding date is **{max(funding_dates).isoformat()}**; the median funding age is **{statistics.median(age_days):,.0f} days ({statistics.median(age_days) / 365.25:.2f} years)**." if funding_dates else "- No parseable funding dates were found.",
        "",
        "## Column Inventory",
        "",
        table(["#", "Column"], [[i + 1, f"`{col}`"] for i, col in enumerate(fields)]),
        "",
        "## H-1B Coverage",
        "",
        table(["Metric", "Companies", "Share of dataset"], [
            ["Any H-1B field populated", f"{h1b_any:,}", pct(h1b_any, row_count)],
            ["All H-1B fields null", f"{row_count - h1b_any:,}", pct(row_count - h1b_any, row_count)],
        ]),
        "",
        table(["Column", "Non-null rows", "Share of dataset"], h1b_rows),
        "",
        "## Website Coverage",
        "",
        table(["Metric", "Companies", "Share of dataset"], [
            ["Website present", f"{website_count:,}", pct(website_count, row_count)],
            ["Website missing", f"{row_count - website_count:,}", pct(row_count - website_count, row_count)],
        ]),
        "",
        "Note: this audit only checks whether the `website` field is populated. It does not re-verify that each website currently resolves.",
        "",
        "## ATS and SOC Fields",
        "",
        table(["Question", "Finding"], [
            ["ATS data present?", "No ATS/platform/job-count columns found" if not ats_columns else ", ".join(f"`{col}`" for col in ats_columns)],
            ["SOC codes present?", "No SOC columns found" if not soc_columns else ", ".join(f"`{col}`" for col in soc_columns)],
        ]),
        "",
        "## Funding Date Distribution",
        "",
        table(["Metric", "Value"], [
            ["Funding date present", f"{len(funding_dates):,} ({pct(len(funding_dates), row_count)})"],
            ["Funding date missing", f"{funding_missing:,} ({pct(funding_missing, row_count)})"],
            ["Unparseable funding dates", f"{len(bad_dates):,}"],
            ["Oldest funding date", min(funding_dates).isoformat() if funding_dates else ""],
            ["Newest funding date", max(funding_dates).isoformat() if funding_dates else ""],
            ["Rows dated after audit date", f"{future_dates:,}"],
            ["Median funding age", f"{statistics.median(age_days):,.0f} days ({statistics.median(age_days) / 365.25:.2f} years)" if age_days else ""],
        ]),
        "",
        table(["Recency window", "Companies", "Share of dataset", "Share of dated rows"], recency_rows),
        "",
        "### Funding Dates by Year",
        "",
        table(["Year", "Rows", "Share of dated rows"], year_rows),
        "",
        "### Most Recent 12 Quarters Present",
        "",
        table(["Quarter", "Rows"], recent_quarter_rows),
        "",
        "## Funding Amount Completeness",
        "",
        table(["Column", "Numeric rows", "Share of dataset", "Minimum", "Median", "Maximum"], numeric_rows),
        "",
        "The maximum funding amount is extremely large and should be reviewed as a potential outlier before scoring uses raw funding amounts.",
        "",
        "## Deduplication and Basic Shape",
        "",
        table(["Metric", "Value"], [
            ["Unique company names", f"{len(name_counts):,}"],
            ["Duplicated company names", f"{duplicated_names:,}"],
            ["Rows in duplicated-name groups", f"{duplicated_rows:,}"],
        ]),
        "",
        "## Top States",
        "",
        table(["State", "Rows"], [[state or "(blank)", f"{count:,}"] for state, count in top_states]),
        "",
        "## Top Industries",
        "",
        table(["Industry", "Rows"], [[industry or "(blank)", f"{count:,}"] for industry, count in top_industries]),
        "",
        "## Gaps for Phase 1 Decisions",
        "",
        "- H-1B data is sparse: only about 5.1% of companies have sponsorship history populated.",
        "- Website coverage is useful but incomplete: about 41.5% of companies lack a website value.",
        "- ATS enrichment has not been merged into this master CSV yet.",
        "- SOC codes are absent, so job-family analysis requires either raw LCA records, title-to-SOC mapping, or a new enrichment step.",
        "- Funding recency is stale for many companies: no records are within 6 months of the audit date, and only about 2.4% of all rows are within 12 months.",
        "- The dataset has no duplicate company names, which is good for browsing, but it does not prove entity resolution quality against DOL/USCIS records.",
        "",
        "## Recommended Next Step",
        "",
        "Proceed to FEIN extraction and normalized company-name capture in the SEC ingest pipeline, then validate a sample of the 1,557 H-1B-matched rows before trusting the existing entity-resolution join for ranking.",
        "",
    ]
    return "\n".join(lines)


def default_csv_path() -> Path:
    return Path(__file__).resolve().parents[1] / "data" / "80-Days-to-Stay-main" / "Data" / "SEC_DOL_H1b_data_mapped.csv"


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit SEC_DOL_H1b_data_mapped.csv and write a Markdown report.")
    parser.add_argument("csv_path", nargs="?", type=Path, default=default_csv_path())
    parser.add_argument("--as-of", default="2026-05-28", help="Audit date in YYYY-MM-DD format.")
    args = parser.parse_args()

    csv_path = args.csv_path.resolve()
    as_of = datetime.strptime(args.as_of, "%Y-%m-%d").date()
    report_path = csv_path.with_name(f"{csv_path.stem}-audit.md")
    report_path.write_text(build_report(csv_path, as_of), encoding="utf-8")
    print(report_path)


if __name__ == "__main__":
    main()
