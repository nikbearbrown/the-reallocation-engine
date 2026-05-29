#!/usr/bin/env python3
"""Analyze ATS/application patterns for The Reallocation Engine.

This is the Python replacement scaffold for the old Job-Ops
``analyze-patterns.mjs`` idea.

It is intentionally conservative:

- it reads the Reallocation Engine paths, not the old source repo paths;
- it produces an audit next to the ATS tracker data;
- it reports missing data instead of inventing conversion patterns;
- it includes TODO markers for analyses that need real outcome history.

Default output:
    data/ats/application-patterns-audit.md
"""

from __future__ import annotations

import argparse
import csv
import re
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


REPO_ROOT = Path(__file__).resolve().parents[2]
ATS_DIR = REPO_ROOT / "data" / "ats"
DEFAULT_APPLICATIONS = ATS_DIR / "applications.md"
DEFAULT_PIPELINE = ATS_DIR / "pipeline.md"
DEFAULT_SCAN_HISTORY = ATS_DIR / "scan-history.tsv"
DEFAULT_RUN_LOG = REPO_ROOT / "modes" / "RUN_LOG.md"
DEFAULT_REPORTS_DIR = ATS_DIR / "reports"
DEFAULT_OUTPUT = ATS_DIR / "application-patterns-audit.md"


STATUS_ALIASES = {
    "evaluada": "evaluated",
    "condicional": "evaluated",
    "hold": "evaluated",
    "evaluar": "evaluated",
    "verificar": "evaluated",
    "scanned": "scanned",
    "evaluated": "evaluated",
    "aplicado": "applied",
    "enviada": "applied",
    "aplicada": "applied",
    "applied": "applied",
    "sent": "applied",
    "respondido": "responded",
    "responded": "responded",
    "entrevista": "interview",
    "interview": "interview",
    "oferta": "offer",
    "offer": "offer",
    "rechazado": "rejected",
    "rechazada": "rejected",
    "rejected": "rejected",
    "descartado": "discarded",
    "descartada": "discarded",
    "discarded": "discarded",
    "cerrada": "discarded",
    "cancelada": "discarded",
    "withdrawn": "withdrawn",
    "stale": "stale",
    "skip": "skip",
    "no aplicar": "skip",
    "no_aplicar": "skip",
    "monitor": "skip",
    "geo blocker": "skip",
}

OUTCOME_STATUSES = {
    "applied",
    "responded",
    "interview",
    "offer",
    "rejected",
    "discarded",
    "withdrawn",
    "stale",
    "skip",
}


@dataclass
class ApplicationRow:
    date: str = ""
    company: str = ""
    role: str = ""
    url: str = ""
    status: str = ""
    sponsorship: str = ""
    liveness: str = ""
    soc: str = ""
    score: str = ""
    report: str = ""
    notes: str = ""

    @property
    def normalized_status(self) -> str:
        return normalize_status(self.status)

    @property
    def outcome_group(self) -> str:
        status = self.normalized_status
        if status in {"applied", "responded", "interview", "offer"}:
            return "positive"
        if status in {"rejected", "discarded", "withdrawn", "stale"}:
            return "negative"
        if status == "skip":
            return "self_filtered"
        return "pending"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def normalize_header(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.strip().lower()).strip("_")


def normalize_status(value: str) -> str:
    cleaned = re.sub(r"\*\*", "", value or "").strip().lower()
    cleaned = re.sub(r"\s+\d{4}-\d{2}-\d{2}.*$", "", cleaned).strip()
    return STATUS_ALIASES.get(cleaned, cleaned or "unknown")


def parse_markdown_table(path: Path) -> list[dict[str, str]]:
    """Parse simple pipe Markdown tables from a file.

    Future improvement: support escaped pipes inside cells if tracker notes
    start using them.
    """
    text = read_text(path)
    rows: list[dict[str, str]] = []
    headers: list[str] | None = None

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line.startswith("|") or not line.endswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if not cells:
            continue
        if all(re.fullmatch(r":?-{3,}:?", cell.replace(" ", "")) for cell in cells):
            continue
        if headers is None:
            headers = [normalize_header(cell) for cell in cells]
            continue
        if len(cells) < len(headers):
            cells.extend([""] * (len(headers) - len(cells)))
        rows.append(dict(zip(headers, cells)))

    return rows


def application_from_row(row: dict[str, str]) -> ApplicationRow:
    """Map either new or legacy tracker columns into one shape."""
    return ApplicationRow(
        date=row.get("date", "") or row.get("fecha", ""),
        company=row.get("company", "") or row.get("empresa", ""),
        role=row.get("role", "") or row.get("rol", ""),
        url=row.get("url", ""),
        status=row.get("status", "") or row.get("estado", ""),
        sponsorship=row.get("sponsorship", ""),
        liveness=row.get("liveness", ""),
        soc=row.get("soc", ""),
        score=row.get("score", ""),
        report=row.get("report", ""),
        notes=row.get("notes", "") or row.get("notas", ""),
    )


def parse_applications(path: Path) -> list[ApplicationRow]:
    return [application_from_row(row) for row in parse_markdown_table(path)]


def parse_scan_history(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8", errors="replace") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def parse_pipeline(path: Path) -> dict[str, int]:
    text = read_text(path)
    counts = Counter()
    section = "unknown"
    for raw_line in text.splitlines():
        heading = re.match(r"^##\s+(.+?)\s*$", raw_line.strip())
        if heading:
            section = normalize_header(heading.group(1)) or "unknown"
            continue
        if re.match(r"^-\s+\[[ xX!]\]", raw_line.strip()):
            counts[section] += 1
    return dict(counts)


def parse_run_log(path: Path) -> dict[str, int]:
    text = read_text(path)
    entries = len(re.findall(r"^##\s+\d{4}-\d{2}-\d{2}\b", text, flags=re.MULTILINE))
    worked = len(re.findall(r"^\-\s+\*\*(Worked|Result):\*\*", text, flags=re.MULTILINE))
    failed = len(re.findall(r"^\-\s+\*\*(Did not work|Open issues):\*\*", text, flags=re.MULTILINE))
    return {"entries": entries, "worked_notes": worked, "failure_or_open_issue_notes": failed}


def count_reports(path: Path) -> int:
    if not path.exists():
        return 0
    return len([item for item in path.glob("*.md") if item.is_file()])


def pct(count: int, total: int) -> str:
    return f"{(count / total) * 100:.1f}%" if total else "0.0%"


def markdown_count_table(title: str, counts: Counter | dict[str, int], total: int | None = None) -> list[str]:
    lines = [f"## {title}", "", "| Value | Count | Share |", "|---|---:|---:|"]
    denom = total if total is not None else sum(counts.values())
    for key, count in sorted(counts.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"| {key or 'missing'} | {count:,} | {pct(count, denom)} |")
    if not counts:
        lines.append("| none | 0 | 0.0% |")
    lines.append("")
    return lines


def build_audit(
    applications: list[ApplicationRow],
    scan_history: list[dict[str, str]],
    pipeline_counts: dict[str, int],
    run_log_counts: dict[str, int],
    reports_count: int,
    paths: argparse.Namespace,
) -> str:
    status_counts = Counter(row.normalized_status for row in applications)
    outcome_counts = Counter(row.outcome_group for row in applications)
    sponsorship_counts = Counter((row.sponsorship or "missing").strip().lower() for row in applications)
    liveness_counts = Counter((row.liveness or "missing").strip().lower() for row in applications)
    soc_known = sum(1 for row in applications if row.soc.strip())
    outcome_rows = [row for row in applications if row.normalized_status in OUTCOME_STATUSES]

    scan_status_counts = Counter((row.get("status") or "missing").strip().lower() for row in scan_history)
    scan_source_counts = Counter((row.get("portal") or row.get("source") or "missing").strip().lower() for row in scan_history)

    lines = [
        "# Application Patterns Audit",
        "",
        f"**Generated at:** {now_iso()}",
        f"**Applications file:** `{paths.applications}`",
        f"**Scan history file:** `{paths.scan_history}`",
        f"**Pipeline file:** `{paths.pipeline}`",
        f"**Run log file:** `{paths.run_log}`",
        "",
        "## Summary",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Application tracker rows | {len(applications):,} |",
        f"| Outcome-bearing application rows | {len(outcome_rows):,} |",
        f"| Scan-history rows | {len(scan_history):,} |",
        f"| Pipeline queued/processed/problem rows | {sum(pipeline_counts.values()):,} |",
        f"| Evaluation reports | {reports_count:,} |",
        f"| Run-log entries | {run_log_counts['entries']:,} |",
        f"| Run-log worked/result notes | {run_log_counts['worked_notes']:,} |",
        f"| Run-log failure/open-issue notes | {run_log_counts['failure_or_open_issue_notes']:,} |",
        "",
    ]

    lines.extend(markdown_count_table("Application Status Counts", status_counts, len(applications)))
    lines.extend(markdown_count_table("Application Outcome Groups", outcome_counts, len(applications)))
    lines.extend(markdown_count_table("Sponsorship Field Coverage", sponsorship_counts, len(applications)))
    lines.extend(markdown_count_table("Liveness Field Coverage", liveness_counts, len(applications)))
    lines.extend(
        [
            "## SOC Coverage",
            "",
            "| Metric | Count | Share |",
            "|---|---:|---:|",
            f"| Rows with SOC | {soc_known:,} | {pct(soc_known, len(applications))} |",
            f"| Rows without SOC | {len(applications) - soc_known:,} | {pct(len(applications) - soc_known, len(applications))} |",
            "",
        ]
    )
    lines.extend(markdown_count_table("Scan History Status Counts", scan_status_counts, len(scan_history)))
    lines.extend(markdown_count_table("Scan History Source Counts", scan_source_counts, len(scan_history)))
    lines.extend(markdown_count_table("Pipeline Section Counts", Counter(pipeline_counts), sum(pipeline_counts.values())))

    lines.extend(["## Pattern Analysis Readiness", "", "| Check | Status | Note |", "|---|---|---|"])
    if len(outcome_rows) >= paths.min_outcomes:
        lines.append(f"| Minimum outcomes | ready | {len(outcome_rows):,}/{paths.min_outcomes:,} rows have outcome-bearing statuses. |")
    else:
        lines.append(f"| Minimum outcomes | blocked | {len(outcome_rows):,}/{paths.min_outcomes:,} rows have outcome-bearing statuses. |")
    lines.append("| Tracker exists | ready | Application tracker was parsed. |" if applications else "| Tracker exists | blocked | No application tracker rows were parsed. |")
    lines.append("| Scan history | ready | Scan history was parsed. |" if scan_history else "| Scan history | missing | No scan-history rows were parsed. |")
    lines.append("| Run log | ready | Run-log entries were parsed. |" if run_log_counts["entries"] else "| Run log | missing | No dated run-log entries were found. |")

    lines.extend(
        [
            "",
            "## TODO: Future Pattern Math",
            "",
            "Implement these once there is enough real tracker history:",
            "",
            "- conversion by sponsorship tier;",
            "- conversion by liveness state;",
            "- conversion by SOC major group and SOC detailed code;",
            "- scan source quality: which providers produce live/useful roles;",
            "- stale-posting waste rate from scan history plus pipeline outcomes;",
            "- score-vs-outcome calibration once evaluation scores are standardized;",
            "- recurring blocker extraction from `data/ats/reports/*.md`;",
            "- run-log failure analysis by script/mode;",
            "- recommendations with evidence thresholds, not anecdotes.",
            "",
            "## Notes",
            "",
            "- This audit is descriptive until enough real outcomes exist.",
            "- Missing data is reported as missing rather than filled by an LLM.",
            "- Keep this audit next to the ATS tracker data.",
            "",
        ]
    )

    return "\n".join(lines)


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Analyze ATS/application pattern readiness.")
    parser.add_argument("--applications", type=Path, default=DEFAULT_APPLICATIONS)
    parser.add_argument("--pipeline", type=Path, default=DEFAULT_PIPELINE)
    parser.add_argument("--scan-history", type=Path, default=DEFAULT_SCAN_HISTORY)
    parser.add_argument("--run-log", type=Path, default=DEFAULT_RUN_LOG)
    parser.add_argument("--reports-dir", type=Path, default=DEFAULT_REPORTS_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--min-outcomes", type=int, default=5)
    parser.add_argument("--dry-run", action="store_true", help="Print audit without writing it.")
    return parser.parse_args(argv)


def main() -> None:
    args = parse_args()
    applications = parse_applications(args.applications)
    scan_history = parse_scan_history(args.scan_history)
    pipeline_counts = parse_pipeline(args.pipeline)
    run_log_counts = parse_run_log(args.run_log)
    reports_count = count_reports(args.reports_dir)
    audit = build_audit(
        applications=applications,
        scan_history=scan_history,
        pipeline_counts=pipeline_counts,
        run_log_counts=run_log_counts,
        reports_count=reports_count,
        paths=args,
    )

    if args.dry_run:
        print(audit)
        return

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(audit, encoding="utf-8")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
