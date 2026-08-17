#!/usr/bin/env python3
"""Create a reproducible validation audit for H-1B-mapped company rows."""

from __future__ import annotations

import argparse
import ast
import collections
import csv
import random
from pathlib import Path
from statistics import median

NULLS = {"", "null", "NULL", "None", "none", "NaN", "nan", "N/A", "n/a"}
H1B_COLUMNS = [
    "Total Approvals",
    "Total Denials",
    "Approval_Rate",
    "median_salary_offered",
    "top_job_titles_sponsored",
]


def present(value: object) -> bool:
    return value is not None and str(value).strip() not in NULLS


def pct(part: int, whole: int) -> str:
    if whole == 0:
        return "0.0%"
    return f"{(part / whole) * 100:.1f}%"


def parse_float(value: str) -> float | None:
    if not present(value):
        return None
    try:
        return float(str(value).replace(",", ""))
    except ValueError:
        return None


def parse_titles(value: str) -> list[str]:
    if not present(value):
        return []
    try:
        parsed = ast.literal_eval(value)
        if isinstance(parsed, list):
            return [str(item) for item in parsed]
    except (ValueError, SyntaxError):
        pass
    return [value]


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def h1b_present(row: dict[str, str]) -> bool:
    return any(present(row.get(column)) for column in H1B_COLUMNS)


def deterministic_sample(rows: list[dict[str, str]], size: int, seed: int) -> list[dict[str, str]]:
    rng = random.Random(seed)
    if len(rows) <= size:
        return list(rows)
    indexes = sorted(rng.sample(range(len(rows)), size))
    return [rows[index] for index in indexes]


def table(headers: list[str], rows: list[list[object]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "|" + "|".join(["---"] * len(headers)) + "|",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell).replace("\n", " ") for cell in row) + " |")
    return "\n".join(lines)


def row_label(row: dict[str, str]) -> str:
    location = ", ".join(part for part in [row.get("city", ""), row.get("state", "")] if part)
    return f"{row.get('company_name', '')} ({location})"


def build_review_rows(sample: list[dict[str, str]], review_count: int) -> list[list[object]]:
    rows = []
    for index, row in enumerate(sample[:review_count], start=1):
        titles = parse_titles(row.get("top_job_titles_sponsored", ""))
        title_preview = "; ".join(titles[:3])
        if len(titles) > 3:
            title_preview += f"; +{len(titles) - 3} more"
        rows.append([
            index,
            row.get("company_name", ""),
            row.get("website", "") or "(missing)",
            row.get("city", ""),
            row.get("state", ""),
            row.get("Total Approvals", ""),
            row.get("Approval_Rate", ""),
            title_preview,
            "Unverified",
            "",
        ])
    return rows


def default_csv_path() -> Path:
    return (
        Path(__file__).resolve().parents[2]
        / "data"
        / "80-days-to-stay"
        / "data"
        / "SEC_DOL_H1b_data_mapped.csv"
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build a Markdown audit packet for validating H-1B entity-resolution joins."
    )
    parser.add_argument("csv_path", nargs="?", type=Path, default=default_csv_path())
    parser.add_argument("--sample-size", type=int, default=200)
    parser.add_argument("--review-count", type=int, default=30)
    parser.add_argument("--seed", type=int, default=80)
    args = parser.parse_args()

    csv_path = args.csv_path.resolve()
    rows = read_rows(csv_path)
    h1b_rows = [row for row in rows if h1b_present(row)]
    sample = deterministic_sample(h1b_rows, args.sample_size, args.seed)

    sample_numbers = [h1b_rows.index(row) + 1 for row in sample]
    websites = sum(1 for row in h1b_rows if present(row.get("website")))
    sample_websites = sum(1 for row in sample if present(row.get("website")))
    approvals = [parse_float(row.get("Total Approvals", "")) for row in h1b_rows]
    approvals = [value for value in approvals if value is not None]
    approval_rates = [parse_float(row.get("Approval_Rate", "")) for row in h1b_rows]
    approval_rates = [value for value in approval_rates if value is not None]
    states = collections.Counter(row.get("state", "") or "(blank)" for row in h1b_rows)
    industries = collections.Counter(row.get("industry", "") or "(blank)" for row in h1b_rows)

    report = [
        "# H-1B Join Validation Audit",
        "",
        "**Purpose:** Prepare Step 4 validation for the existing `SEC_DOL_H1b_data_mapped.csv` entity-resolution join.",
        f"**Source file:** `{csv_path.name}`",
        f"**Deterministic sample seed:** `{args.seed}`",
        f"**H-1B sample size:** `{len(sample)}`",
        "",
        "## Local Finding",
        "",
        "The repository does not contain raw DOL/LCA records, USCIS source records, original H-1B employer names, match scores, or match-method metadata. Because of that, this audit cannot estimate the true false-positive rate locally. It can only prepare the review sample and flag what must be checked manually or against external/source data.",
        "",
        "## H-1B-Mapped Row Shape",
        "",
        table(
            ["Metric", "Value"],
            [
                ["Total companies in mapped CSV", f"{len(rows):,}"],
                ["Rows with H-1B fields populated", f"{len(h1b_rows):,} ({pct(len(h1b_rows), len(rows))})"],
                ["Rows with H-1B fields null", f"{len(rows) - len(h1b_rows):,} ({pct(len(rows) - len(h1b_rows), len(rows))})"],
                ["H-1B rows with website", f"{websites:,} ({pct(websites, len(h1b_rows))})"],
                ["Sample rows with website", f"{sample_websites:,} ({pct(sample_websites, len(sample))})"],
                ["Median approvals among H-1B rows", f"{median(approvals):.1f}" if approvals else ""],
                ["Median approval rate among H-1B rows", f"{median(approval_rates):.1f}%" if approval_rates else ""],
            ],
        ),
        "",
        "## Top H-1B-Mapped States",
        "",
        table(["State", "Rows"], [[state, f"{count:,}"] for state, count in states.most_common(12)]),
        "",
        "## Top H-1B-Mapped Industries",
        "",
        table(["Industry", "Rows"], [[industry, f"{count:,}"] for industry, count in industries.most_common(12)]),
        "",
        "## Deterministic Sample",
        "",
        f"The full validation sample contains {len(sample)} rows selected from the {len(h1b_rows):,} H-1B-mapped rows using seed `{args.seed}`. Sample positions within the H-1B subset are:",
        "",
        ", ".join(str(number) for number in sample_numbers),
        "",
        "## Manual Review Subset",
        "",
        "Review at least the first 20-30 rows below. For each row, compare the company website, public company identity, and sponsored job titles against the original LCA/DOL employer identity if available. Fill `Verdict` with `same`, `different`, or `uncertain`.",
        "",
        table(
            [
                "#",
                "Company",
                "Website",
                "City",
                "State",
                "Approvals",
                "Approval rate",
                "Sponsored title signals",
                "Verdict",
                "Notes",
            ],
            build_review_rows(sample, args.review_count),
        ),
        "",
        "## Validation Rule",
        "",
        "- If the manually reviewed false-positive rate is above 10%, rerun entity resolution with stronger evidence.",
        "- If false positives are below 5%, keep the existing join and move on.",
        "- Between 5% and 10%, preserve the existing join but add a confidence tier and avoid using low-confidence rows for `Proven` sponsorship scoring.",
        "",
        "## Required Evidence Not Present Locally",
        "",
        "- Raw LCA employer names.",
        "- FEIN/EIN values for the SEC side.",
        "- Match method, match score, and candidate alternatives used during the original join.",
        "- SOC codes or raw job classification fields.",
        "",
        "## Recommended Next Step",
        "",
        "Before Step 5, locate or recreate the raw DOL/LCA source table used for the merge. Without raw employer names or match metadata, manual validation can only check plausibility, not the actual correctness of the join.",
        "",
    ]

    report_path = csv_path.with_name(f"{csv_path.stem}-join-validation-audit.md")
    report_path.write_text("\n".join(report), encoding="utf-8")
    print(report_path)


if __name__ == "__main__":
    main()
