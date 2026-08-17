#!/usr/bin/env python3
"""Plausibility audit for a Workday connector run.

Reads a completed run directory and reports what it found. This is an audit in
the sense the verification stack means it: it does not say "pass", it says what
is there, so a human can judge whether the run is trustworthy. Every number it
prints is counted from the run's own files — nothing is estimated.

Written as a separate tool rather than folded into `scraper.py` so the attested
connector stays byte-identical to the version that was signed.

Usage (from scripts/ats/):
    python -m scrapers.workday.audit ../../data/ats/workday
    python -m scrapers.workday.audit ../../data/ats/workday -o ../../data/ats/workday/workday-audit.md
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Fields the unified schema requires to be present and non-empty.
REQUIRED_FIELDS = ["job_id", "title", "company_name", "company_slug", "ats_source", "source_url"]

# Optional fields — reported as fill rates, because a low rate is a finding
# about the source, not a defect in the connector.
OPTIONAL_FIELDS = [
    "apply_url", "location", "department", "employment_type",
    "date_posted", "description_text", "description_html", "salary_range",
]

# Titles that suggest a listing/search page leaked into the postings array
# instead of an individual requisition.
SUSPICIOUS_TITLE_PATTERNS = [
    re.compile(r"^\s*$"),
    re.compile(r"\d+\s+jobs?\s+found", re.I),
    re.compile(r"^search\b", re.I),
    re.compile(r"^view all\b", re.I),
]


def load_run(run_dir: Path) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    summary_path = run_dir / "summary.json"
    if not summary_path.exists():
        raise SystemExit(f"No summary.json in {run_dir} — is this a completed run directory?")
    summary = json.loads(summary_path.read_text(encoding="utf-8"))

    companies = []
    for company_dir in sorted(p for p in run_dir.iterdir() if p.is_dir()):
        meta_path = company_dir / "metadata.json"
        norm_path = company_dir / "normalized_jobs.json"
        raw_path = company_dir / "jobs.json"
        if not (meta_path.exists() and norm_path.exists()):
            continue
        companies.append({
            "slug": company_dir.name,
            "metadata": json.loads(meta_path.read_text(encoding="utf-8")),
            "records": json.loads(norm_path.read_text(encoding="utf-8")),
            "raw": json.loads(raw_path.read_text(encoding="utf-8")) if raw_path.exists() else {},
        })
    return summary, companies


def cross_check_summary(summary: dict[str, Any], companies: list[dict[str, Any]]) -> list[str]:
    """Reconcile summary.json against the directories actually on disk.

    `summary.json` is rewritten by every run, but per-company directories
    persist. A directory holding records that the current summary never mentions
    is therefore residue from an earlier run — not a company found by this one.
    Reading the summary alone would understate what is on disk.
    """
    findings: list[str] = []
    named = {
        entry.get("slug")
        for bucket in ("found", "empty")
        for entry in summary.get(bucket, [])
        if isinstance(entry, dict)
    }
    for company in companies:
        record_count = len(company["records"])
        if company["slug"] not in named:
            findings.append(
                f"`{company['slug']}` holds {record_count} record(s) on disk but is absent from "
                f"summary.json's found/empty buckets — residue from an earlier run "
                f"(summary.json reflects only the most recent run; company directories persist)"
            )
    on_disk = {c["slug"] for c in companies}
    for entry in summary.get("found", []):
        if isinstance(entry, dict) and entry.get("slug") not in on_disk:
            findings.append(
                f"summary.json reports `{entry.get('slug')}` as found, but no run directory exists for it"
            )
    return findings


def audit_company(company: dict[str, Any]) -> dict[str, Any]:
    meta = company["metadata"]
    records = company["records"]
    raw_postings = (company["raw"] or {}).get("jobPostings") or []

    findings: list[str] = []

    # --- count reconciliation -------------------------------------------
    declared = meta.get("job_count")
    reported = meta.get("total_reported")
    actual = len(records)
    if declared != actual:
        findings.append(f"metadata.job_count ({declared}) != records on disk ({actual})")
    if reported is not None and reported != actual:
        findings.append(
            f"board reported total={reported} but {actual} record(s) were kept "
            f"(expected when postings fail validation; investigate otherwise)"
        )
    if raw_postings and len(raw_postings) != actual:
        findings.append(f"raw postings ({len(raw_postings)}) != normalized records ({actual})")

    # --- uniqueness ------------------------------------------------------
    dup_ids = [v for v, n in Counter(r.get("job_id", "") for r in records).items() if n > 1]
    dup_urls = [v for v, n in Counter(r.get("source_url", "") for r in records).items() if n > 1]
    if dup_ids:
        findings.append(f"{len(dup_ids)} duplicate job_id value(s)")
    if dup_urls:
        findings.append(f"{len(dup_urls)} duplicate source_url value(s)")

    # --- required-field completeness -------------------------------------
    missing_required = Counter()
    for record in records:
        for field in REQUIRED_FIELDS:
            if not str(record.get(field, "")).strip():
                missing_required[field] += 1
    for field, count in missing_required.items():
        findings.append(f"required field '{field}' empty on {count} record(s)")

    # --- optional-field fill rates ---------------------------------------
    fill = {}
    for field in OPTIONAL_FIELDS:
        filled = sum(1 for r in records if str(r.get(field, "")).strip())
        fill[field] = filled

    # --- URL consistency --------------------------------------------------
    host = meta.get("host", "")
    off_host = [r for r in records if host and host not in str(r.get("source_url", ""))]
    if off_host:
        findings.append(f"{len(off_host)} source_url(s) do not contain the run's host {host}")
    non_https = [r for r in records if not str(r.get("source_url", "")).startswith("https://")]
    if non_https:
        findings.append(f"{len(non_https)} source_url(s) are not https")

    # --- title sanity -----------------------------------------------------
    suspicious = [
        r.get("title", "") for r in records
        if any(p.search(str(r.get("title", ""))) for p in SUSPICIOUS_TITLE_PATTERNS)
    ]
    if suspicious:
        findings.append(f"{len(suspicious)} title(s) look like a listing page, not a requisition")

    # --- extraction status ------------------------------------------------
    statuses = Counter(
        (r.get("metadata") or {}).get("extraction_status", "MISSING") for r in records
    )

    return {
        "slug": company["slug"],
        "meta": meta,
        "record_count": actual,
        "raw_count": len(raw_postings),
        "fill": fill,
        "statuses": statuses,
        "findings": findings,
        "suspicious_titles": suspicious[:5],
    }


def render(summary: dict[str, Any], audits: list[dict[str, Any]], run_dir: Path,
           cross_findings: list[str]) -> str:
    now = datetime.now(timezone.utc).isoformat()
    buckets = {k: len(v) for k, v in summary.items()}
    total_records = sum(a["record_count"] for a in audits)

    lines = [
        "# Workday Run Audit",
        "",
        f"**Generated at:** {now}",
        f"**Run directory:** `{run_dir}`",
        "",
        "This audit reports what the run produced. It does not certify the run as",
        "correct — that judgment is the reader's.",
        "",
        "## Bucket counts (from summary.json)",
        "",
        "| Bucket | Companies |",
        "|---|---:|",
    ]
    for name in ["found", "empty", "not_found", "invalid_careers_url", "errors"]:
        lines.append(f"| `{name}` | {buckets.get(name, 0)} |")
    lines += [
        "",
        f"Companies with a written run directory: **{len(audits)}**  ",
        f"Normalized records on disk: **{total_records}**",
        "",
        "## Summary-vs-disk reconciliation",
        "",
    ]
    if cross_findings:
        lines += [f"- {f}" for f in cross_findings]
        lines += [
            "",
            "Reading `summary.json` alone would misstate what this directory contains.",
            "",
        ]
    else:
        lines += ["- summary.json and the directories on disk agree.", ""]

    for a in audits:
        meta = a["meta"]
        lines += [
            f"## `{a['slug']}`",
            "",
            f"- Tenant: `{meta.get('tenant','')}` · career site: `{meta.get('career_site','')}`",
            f"- Host: `{meta.get('host','')}`",
            f"- Board reported total: **{meta.get('total_reported')}** · raw postings saved: **{a['raw_count']}** · records kept: **{a['record_count']}**",
            f"- Extraction status: {', '.join(f'{k}={v}' for k, v in a['statuses'].items()) or 'n/a'}",
            f"- Validation errors recorded at scrape time: {meta.get('validation_error_count')}",
            "",
            "### Required fields",
            "",
            f"All {len(REQUIRED_FIELDS)} required fields are non-empty on all {a['record_count']} record(s)."
            if not any("required field" in f for f in a["findings"])
            else "See findings below — at least one required field is empty.",
            "",
            "### Optional-field fill rates",
            "",
            "A low rate here is a fact about this tenant's API response, not a connector defect.",
            "",
            "| Field | Filled | Rate |",
            "|---|---:|---:|",
        ]
        for field, filled in a["fill"].items():
            rate = f"{(filled / a['record_count'] * 100):.0f}%" if a["record_count"] else "n/a"
            lines.append(f"| `{field}` | {filled}/{a['record_count']} | {rate} |")

        lines += ["", "### Findings", ""]
        if a["findings"]:
            lines += [f"- {f}" for f in a["findings"]]
        else:
            lines.append("- No anomalies detected by the checks above.")
        if a["suspicious_titles"]:
            lines += ["", "Sample suspicious titles:", ""]
            lines += [f"- `{t}`" for t in a["suspicious_titles"]]
        lines.append("")

    lines += [
        "## What this audit cannot tell you",
        "",
        "- Whether a posting is still accepting applications (that is the liveness gate's job).",
        "- Whether an empty optional field is empty at the source or dropped in transit —",
        "  compare `jobs.json` against `normalized_jobs.json` to distinguish the two.",
        "- Whether the tenant/career-site pair is the *right* board for the employer.",
        "- Whether counts the board reported are themselves accurate.",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit a completed Workday connector run.")
    parser.add_argument("run_dir", type=Path, help="Run output directory (contains summary.json).")
    parser.add_argument("-o", "--output", type=Path, help="Write the audit here instead of stdout.")
    args = parser.parse_args()

    summary, companies = load_run(args.run_dir)
    audits = [audit_company(c) for c in companies]
    cross_findings = cross_check_summary(summary, companies)
    text = render(summary, audits, args.run_dir, cross_findings)

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
        print(f"Audit written to {args.output}")
        total_findings = sum(len(a["findings"]) for a in audits) + len(cross_findings)
        print(f"{len(audits)} company run(s) audited · {total_findings} finding(s) recorded")
    else:
        print(text)


if __name__ == "__main__":
    main()
