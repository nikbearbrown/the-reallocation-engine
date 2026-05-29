#!/usr/bin/env python3
"""Extract a compact SOC/O*NET/OEWS occupation table for role-quality scoring."""

from __future__ import annotations

import argparse
import csv
import hashlib
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_BLS_DIR = REPO_ROOT / "data" / "bls"
DEFAULT_OUTPUT = DEFAULT_BLS_DIR / "compact" / "soc_occupation_compact.csv"

ABILITY_ELEMENTS = [
    "Originality",
    "Problem Sensitivity",
    "Deductive Reasoning",
    "Inductive Reasoning",
    "Selective Attention",
    "Oral Comprehension",
]

SKILL_ELEMENTS = [
    "Programming",
    "Critical Thinking",
    "Judgment and Decision Making",
    "Complex Problem Solving",
    "Systems Analysis",
    "Systems Evaluation",
    "Social Perceptiveness",
    "Active Listening",
    "Persuasion",
    "Instructing",
    "Service Orientation",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256(path: Path, chunk_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_tsv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def clean_soc_for_bls(onet_soc: str) -> str:
    return onet_soc.split(".")[0]


def numeric(value: object) -> float | None:
    if value is None:
        return None
    text = str(value).strip().replace(",", "")
    if not text or text in {"*", "#", "**", "nan"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def read_oews_latest(bls_dir: Path) -> tuple[pd.DataFrame, int | None, Path | None]:
    candidates = sorted(bls_dir.glob("oesm*nat/national_M*_dl.xlsx"))
    if not candidates:
        return pd.DataFrame(), None, None

    def year_from_path(path: Path) -> int:
        digits = "".join(ch for ch in path.stem if ch.isdigit())
        return int(digits[-4:])

    latest = max(candidates, key=year_from_path)
    year = year_from_path(latest)
    df = pd.read_excel(latest, dtype=str)
    df = df[df["O_GROUP"].eq("detailed")].copy()
    keep = [
        "OCC_CODE",
        "OCC_TITLE",
        "TOT_EMP",
        "A_MEAN",
        "A_MEDIAN",
        "H_MEAN",
        "H_MEDIAN",
        "EMP_PRSE",
    ]
    df = df[keep]
    for col in ["TOT_EMP", "A_MEAN", "A_MEDIAN", "H_MEAN", "H_MEDIAN", "EMP_PRSE"]:
        df[col] = df[col].map(numeric)
    return df, year, latest


def pivot_level_scores(rows: Iterable[dict[str, str]], elements: list[str]) -> dict[str, dict[str, float]]:
    wanted = set(elements)
    scores: dict[str, dict[str, float]] = defaultdict(dict)
    for row in rows:
        if row.get("Scale ID") != "LV":
            continue
        if row.get("Recommend Suppress") == "Y":
            continue
        element = row.get("Element Name", "")
        if element not in wanted:
            continue
        value = numeric(row.get("Data Value"))
        if value is not None:
            scores[row["O*NET-SOC Code"]][element] = value
    return scores


def slug(element: str) -> str:
    return element.lower().replace(" and ", "_").replace(" ", "_").replace("/", "_")


def cognitive_pivot_score(row: dict[str, object]) -> float | None:
    fields = [
        "ability_originality_lv",
        "ability_problem_sensitivity_lv",
        "ability_deductive_reasoning_lv",
        "ability_inductive_reasoning_lv",
        "skill_critical_thinking_lv",
        "skill_judgment_decision_making_lv",
        "skill_complex_problem_solving_lv",
        "skill_systems_analysis_lv",
        "skill_systems_evaluation_lv",
    ]
    values = [row.get(field) for field in fields if isinstance(row.get(field), (int, float))]
    if not values:
        return None
    return round(sum(values) / len(values), 3)


def build_compact_table(bls_dir: Path) -> tuple[list[dict[str, object]], dict[str, object]]:
    text_dir = bls_dir / "db-30-2-text"
    occupations_path = text_dir / "Occupation Data.txt"
    abilities_path = text_dir / "Abilities.txt"
    skills_path = text_dir / "Skills.txt"
    alternate_titles_path = text_dir / "Alternate Titles.txt"
    job_zones_path = text_dir / "Job Zones.txt"

    occupations = read_tsv(occupations_path)
    abilities = pivot_level_scores(read_tsv(abilities_path), ABILITY_ELEMENTS)
    skills = pivot_level_scores(read_tsv(skills_path), SKILL_ELEMENTS)

    job_zones = {
        row["O*NET-SOC Code"]: row.get("Job Zone", "")
        for row in read_tsv(job_zones_path)
    }

    alternate_titles: dict[str, list[str]] = defaultdict(list)
    for row in read_tsv(alternate_titles_path):
        title = row.get("Alternate Title", "").strip()
        if title and title != "n/a":
            alternate_titles[row["O*NET-SOC Code"]].append(title)

    oews, oews_year, oews_path = read_oews_latest(bls_dir)
    oews_by_soc = {
        row["OCC_CODE"]: row
        for row in oews.to_dict(orient="records")
    }

    rows: list[dict[str, object]] = []
    for occ in occupations:
        onet_soc = occ["O*NET-SOC Code"]
        bls_soc = clean_soc_for_bls(onet_soc)
        row: dict[str, object] = {
            "onet_soc_code": onet_soc,
            "bls_soc_code": bls_soc,
            "title": occ.get("Title", ""),
            "description": occ.get("Description", ""),
            "job_zone": job_zones.get(onet_soc, ""),
            "alternate_title_count": len(alternate_titles.get(onet_soc, [])),
            "alternate_titles_sample": "; ".join(alternate_titles.get(onet_soc, [])[:8]),
        }

        latest = oews_by_soc.get(bls_soc)
        row.update({
            "oews_year": oews_year or "",
            "employment": latest.get("TOT_EMP") if latest else None,
            "annual_mean_wage": latest.get("A_MEAN") if latest else None,
            "annual_median_wage": latest.get("A_MEDIAN") if latest else None,
            "hourly_mean_wage": latest.get("H_MEAN") if latest else None,
            "hourly_median_wage": latest.get("H_MEDIAN") if latest else None,
            "employment_prse": latest.get("EMP_PRSE") if latest else None,
        })

        for element in ABILITY_ELEMENTS:
            row[f"ability_{slug(element)}_lv"] = abilities.get(onet_soc, {}).get(element)
        for element in SKILL_ELEMENTS:
            row[f"skill_{slug(element)}_lv"] = skills.get(onet_soc, {}).get(element)

        row["cognitive_pivot_score"] = cognitive_pivot_score(row)
        rows.append(row)

    metadata = {
        "occupation_count": len(rows),
        "oews_year": oews_year,
        "oews_path": str(oews_path) if oews_path else "",
        "oews_matched_count": sum(1 for row in rows if row.get("employment") is not None),
        "source_files": [
            occupations_path,
            abilities_path,
            skills_path,
            alternate_titles_path,
            job_zones_path,
        ],
    }
    if oews_path:
        metadata["source_files"].append(oews_path)
    return rows, metadata


def write_csv(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys()) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def audit_lines(bls_dir: Path, output: Path, rows: list[dict[str, object]], metadata: dict[str, object]) -> list[str]:
    files = list(bls_dir.rglob("*"))
    data_files = [path for path in files if path.is_file()]
    large_files = [path for path in data_files if path.stat().st_size > 50 * 1024 * 1024]

    def size_mb(path: Path) -> str:
        return f"{path.stat().st_size / (1024 * 1024):.1f} MB"

    matched = int(metadata.get("oews_matched_count", 0))
    total = int(metadata.get("occupation_count", 0))
    matched_pct = (matched / total) * 100 if total else 0

    lines = [
        "# BLS/O*NET Source Audit",
        "",
        f"**Generated at:** {now_iso()}",
        f"**Source directory:** `{bls_dir}`",
        "",
        "## Role in The Reallocation Engine",
        "",
        "Treat `data/bls` as source/reference data for the role-quality and labor-market-direction side of the engine.",
        "It supports SOC/O*NET occupation mapping, cognitive demand features, wage/employment context, and the broader Cognitive Pivot argument.",
        "",
        "## Inventory",
        "",
        f"- Files: {len(data_files):,}",
        f"- Directories: {sum(1 for path in files if path.is_dir()):,}",
        f"- O*NET text tables: {len(list((bls_dir / 'db-30-2-text').glob('*.txt'))):,}",
        f"- Latest OEWS national workbook used: `{metadata.get('oews_path', '')}`",
        f"- Latest OEWS year: {metadata.get('oews_year', '')}",
        "",
        "## Compact Extract",
        "",
        f"- Output: `{output}`",
        f"- SHA-256: `{sha256(output) if output.exists() else ''}`",
        f"- Occupations: {total:,}",
        f"- Occupations matched to latest OEWS detailed SOC rows: {matched:,} ({matched_pct:.1f}%)",
        "",
        "## Compact Columns",
        "",
        "- Occupation identity: O*NET-SOC code, BLS SOC code, title, description.",
        "- Job preparation: O*NET job zone.",
        "- Search support: alternate title count and sample alternate titles.",
        "- Labor market context: latest OEWS employment, mean/median wage, hourly wage, PRSE.",
        "- Cognitive demand features: selected O*NET ability and skill Level scores.",
        "- `cognitive_pivot_score`: average of selected reasoning, judgment, and systems scores.",
        "",
        "## Large Files",
        "",
    ]

    if large_files:
        lines.extend(["| File | Size |", "|---|---:|"])
        for path in sorted(large_files):
            lines.append(f"| `{path.relative_to(bls_dir)}` | {size_mb(path)} |")
    else:
        lines.append("No files above 50 MB found.")

    lines.extend([
        "",
        "## Source Files Used",
        "",
        "| File | SHA-256 |",
        "|---|---|",
    ])
    for path in metadata.get("source_files", []):
        source = Path(path)
        lines.append(f"| `{source.relative_to(bls_dir)}` | `{sha256(source)}` |")

    lines.extend([
        "",
        "## Notes",
        "",
        "- The MySQL and MSSQL O*NET SQL exports duplicate most of the text/Excel source data and include two ~91 MB `20_work_context.sql` files.",
        "- The compact table is the preferred working asset for downstream scoring; keep the full BLS/O*NET archive as provenance.",
        "- The current extract does not estimate employment trend slopes yet. That should be a separate step using the 2012-2024 OEWS national files.",
        "",
    ])
    return lines


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract compact BLS/O*NET SOC occupation table.")
    parser.add_argument("--bls-dir", type=Path, default=DEFAULT_BLS_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--audit", type=Path, default=DEFAULT_BLS_DIR / "bls-audit.md")
    args = parser.parse_args()

    rows, metadata = build_compact_table(args.bls_dir)
    write_csv(args.output, rows)
    args.audit.write_text("\n".join(audit_lines(args.bls_dir, args.output, rows, metadata)), encoding="utf-8")
    print(f"Wrote {len(rows):,} occupations to {args.output}")
    print(f"Wrote audit to {args.audit}")


if __name__ == "__main__":
    main()
