#!/usr/bin/env python3
"""Resolve SEC companies against raw DOL/LCA employer records.

Join priority:
1. FEIN exact match.
2. Normalized company-name exact match.
3. Fuzzy normalized-name match above a configurable threshold.
4. Leave unmatched as ``Unknown``.
"""

from __future__ import annotations

import argparse
import csv
import difflib
import re
from collections import defaultdict
from pathlib import Path

try:
    from rapidfuzz import fuzz, process
except ImportError:  # pragma: no cover - exercised only without optional dep
    fuzz = None
    process = None

NULLS = {"", "null", "NULL", "None", "none", "NaN", "nan", "N/A", "n/a"}
SEC_NAME_COLUMNS = ["company_name", "Company_Name", "ENTITYNAME", "name"]
SEC_FEIN_COLUMNS = ["fein", "FEIN", "issuer_fein", "ISSUERFEIN", "EIN"]
LCA_NAME_COLUMNS = [
    "EMPLOYER_NAME",
    "employer_name",
    "Employer Name",
    "company_name",
    "COMPANY_NAME",
]
LCA_FEIN_COLUMNS = [
    "EMPLOYER_FEIN",
    "employer_fein",
    "FEIN",
    "EIN",
    "EMPLOYER_IDENTIFICATION_NUMBER",
]

COMPANY_SUFFIXES = [
    r"\s+inc\.?$",
    r"\s+incorporated$",
    r"\s+llc\.?$",
    r"\s+l\.?l\.?c\.?$",
    r"\s+ltd\.?$",
    r"\s+limited$",
    r"\s+corp\.?$",
    r"\s+corporation$",
    r"\s+co\.?$",
    r"\s+company$",
    r"\s+l\.?p\.?$",
    r"\s+lp$",
    r"\s+plc\.?$",
]


def present(value: object) -> bool:
    return value is not None and str(value).strip() not in NULLS


def first_present(row: dict[str, str], columns: list[str]) -> str:
    for column in columns:
        value = row.get(column)
        if present(value):
            return str(value).strip()
    return ""


def normalize_fein(value: str) -> str:
    return re.sub(r"\D", "", value or "")


def normalize_company_name(name: str) -> str:
    if not present(name):
        return ""

    cleaned = str(name).strip()
    changed = True
    while changed:
        changed = False
        for suffix in COMPANY_SUFFIXES:
            result = re.sub(suffix, "", cleaned, flags=re.IGNORECASE)
            if result != cleaned:
                cleaned = result.strip()
                changed = True

    cleaned = re.sub(r"[,.\s\-&']", "", cleaned)
    return cleaned.lower()


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys()) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def aggregate_lca_records(lca_rows: list[dict[str, str]]) -> list[dict[str, object]]:
    grouped: dict[tuple[str, str], dict[str, object]] = {}

    for row in lca_rows:
        employer_name = first_present(row, LCA_NAME_COLUMNS)
        employer_fein = normalize_fein(first_present(row, LCA_FEIN_COLUMNS))
        normalized_name = normalize_company_name(employer_name)

        if not normalized_name and not employer_fein:
            continue

        key = (employer_fein, normalized_name)
        if key not in grouped:
            grouped[key] = {
                "lca_employer_name": employer_name,
                "lca_employer_fein": employer_fein,
                "lca_company_name_normalized": normalized_name,
                "lca_record_count": 0,
            }
        grouped[key]["lca_record_count"] = int(grouped[key]["lca_record_count"]) + 1

    return list(grouped.values())


def build_indexes(lca_entities: list[dict[str, object]]):
    by_fein: dict[str, list[dict[str, object]]] = defaultdict(list)
    by_name: dict[str, list[dict[str, object]]] = defaultdict(list)
    for entity in lca_entities:
        fein_value = str(entity.get("lca_employer_fein", ""))
        name_value = str(entity.get("lca_company_name_normalized", ""))
        if fein_value:
            by_fein[fein_value].append(entity)
        if name_value:
            by_name[name_value].append(entity)
    return by_fein, by_name


def fuzzy_extract_one(query: str, choices: list[str]) -> tuple[str, float] | None:
    if not query or not choices:
        return None

    if process is not None and fuzz is not None:
        result = process.extractOne(query, choices, scorer=fuzz.token_set_ratio)
        if result is None:
            return None
        choice, score, _ = result
        return str(choice), float(score) / 100.0

    matches = difflib.get_close_matches(query, choices, n=1, cutoff=0)
    if not matches:
        return None
    match = matches[0]
    return match, difflib.SequenceMatcher(None, query, match).ratio()


def resolve_company(
    sec_row: dict[str, str],
    by_fein: dict[str, list[dict[str, object]]],
    by_name: dict[str, list[dict[str, object]]],
    threshold: float,
) -> dict[str, object]:
    sec_name = first_present(sec_row, SEC_NAME_COLUMNS)
    sec_fein = normalize_fein(first_present(sec_row, SEC_FEIN_COLUMNS))
    sec_normalized = first_present(sec_row, ["company_name_normalized", "Company_Name_Normalized"])
    if not sec_normalized:
        sec_normalized = normalize_company_name(sec_name)

    base = {
        **sec_row,
        "sec_company_name_normalized": sec_normalized,
        "sec_fein_normalized": sec_fein,
        "match_status": "unmatched",
        "match_method": "unknown",
        "match_score": 0.0,
        "lca_employer_name": "",
        "lca_employer_fein": "",
        "lca_record_count": 0,
    }

    if sec_fein and sec_fein in by_fein:
        match = max(by_fein[sec_fein], key=lambda item: int(item["lca_record_count"]))
        return {
            **base,
            "match_status": "matched",
            "match_method": "fein_exact",
            "match_score": 1.0,
            "lca_employer_name": match["lca_employer_name"],
            "lca_employer_fein": match["lca_employer_fein"],
            "lca_record_count": match["lca_record_count"],
        }

    if sec_normalized and sec_normalized in by_name:
        match = max(by_name[sec_normalized], key=lambda item: int(item["lca_record_count"]))
        return {
            **base,
            "match_status": "matched",
            "match_method": "name_exact",
            "match_score": 1.0,
            "lca_employer_name": match["lca_employer_name"],
            "lca_employer_fein": match["lca_employer_fein"],
            "lca_record_count": match["lca_record_count"],
        }

    choices = list(by_name.keys())
    fuzzy_match = fuzzy_extract_one(sec_normalized, choices)
    if fuzzy_match is not None:
        matched_name, score = fuzzy_match
        if score >= threshold:
            match = max(by_name[matched_name], key=lambda item: int(item["lca_record_count"]))
            return {
                **base,
                "match_status": "matched",
                "match_method": "name_fuzzy",
                "match_score": round(score, 4),
                "lca_employer_name": match["lca_employer_name"],
                "lca_employer_fein": match["lca_employer_fein"],
                "lca_record_count": match["lca_record_count"],
            }

    return base


def write_audit(path: Path, rows: list[dict[str, object]], threshold: float) -> None:
    total = len(rows)
    methods = defaultdict(int)
    for row in rows:
        methods[str(row["match_method"])] += 1

    def percentage(count: int) -> str:
        return f"{(count / total) * 100:.1f}%" if total else "0.0%"

    lines = [
        "# Entity Resolution Audit",
        "",
        f"**Fuzzy threshold:** `{threshold}`",
        f"**Resolved SEC rows:** `{total:,}`",
        "",
        "| Match method | Rows | Share |",
        "|---|---:|---:|",
    ]
    for method, count in sorted(methods.items(), key=lambda item: item[0]):
        lines.append(f"| `{method}` | {count:,} | {percentage(count)} |")

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- `fein_exact` is highest confidence.",
            "- `name_exact` is useful but should be sampled manually.",
            "- `name_fuzzy` should be treated as review-required unless later validation proves the threshold is reliable.",
            "- `unknown` rows remain unmatched and should not be scored as proven sponsors.",
            "",
        ]
    )
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Resolve SEC companies to raw LCA employer records.")
    parser.add_argument("--sec", required=True, type=Path, help="SEC company CSV.")
    parser.add_argument("--lca", required=True, type=Path, help="Raw DOL/LCA CSV.")
    parser.add_argument("--output", required=True, type=Path, help="Output resolved CSV.")
    parser.add_argument("--threshold", type=float, default=0.88, help="Fuzzy match threshold from 0 to 1.")
    args = parser.parse_args()

    sec_rows = read_csv(args.sec)
    lca_rows = read_csv(args.lca)
    lca_entities = aggregate_lca_records(lca_rows)
    by_fein, by_name = build_indexes(lca_entities)

    resolved = [
        resolve_company(row, by_fein, by_name, args.threshold)
        for row in sec_rows
    ]

    write_csv(args.output, resolved)
    audit_path = args.output.with_name(f"{args.output.stem}-audit.md")
    write_audit(audit_path, resolved, args.threshold)
    print(args.output)
    print(audit_path)


if __name__ == "__main__":
    main()
