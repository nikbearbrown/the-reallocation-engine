#!/usr/bin/env python3
"""Process the recent SEC Form D quarters used by the Step 3 refresh."""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path

DEFAULT_QUARTERS = ["2025Q2_d", "2025Q3_d", "2025Q4_d", "2026Q1_d"]
REQUIRED_FILES = {
    "FORMDSUBMISSION.tsv",
    "ISSUERS.tsv",
    "OFFERING.tsv",
    "RELATEDPERSONS.tsv",
}


def default_form_d_root() -> Path:
    return Path(__file__).resolve().parents[2] / "data" / "sec" / "form-d"


def load_sec_all_quarters():
    script_path = Path(__file__).with_name("sec_all_quarters.py")
    spec = importlib.util.spec_from_file_location("sec_all_quarters", script_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load {script_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def resolve_quarter_dir(extracted_dir: Path, quarter: str) -> Path | None:
    """Find a quarter folder whether SEC extracted files flat or nested."""
    candidates = [
        extracted_dir / quarter,
        extracted_dir / quarter / quarter,
    ]

    for candidate in candidates:
        if candidate.exists() and REQUIRED_FILES <= {path.name for path in candidate.iterdir()}:
            return candidate

    return None


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Process downloaded recent SEC Form D quarter folders."
    )
    parser.add_argument(
        "--form-d-root",
        type=Path,
        default=default_form_d_root(),
        help="Root containing extracted/ and processed/ directories.",
    )
    parser.add_argument(
        "--quarters",
        nargs="+",
        default=DEFAULT_QUARTERS,
        help="Extracted quarter folders to process.",
    )
    args = parser.parse_args()

    extracted_dir = args.form_d_root / "extracted"
    processed_dir = args.form_d_root / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)

    sec_all_quarters = load_sec_all_quarters()
    processed = []
    missing = []

    for quarter in args.quarters:
        quarter_dir = resolve_quarter_dir(extracted_dir, quarter)
        if quarter_dir is None:
            expected = extracted_dir / quarter
            missing.append(str(expected))
            print(f"Missing: {expected}")
            continue

        result = sec_all_quarters.process_single_quarter(
            str(quarter_dir),
            str(processed_dir),
        )
        if result:
            processed.append(quarter)

    print("\nSummary")
    print(f"Processed: {len(processed)}")
    print(f"Missing: {len(missing)}")
    if missing:
        raise SystemExit("Missing extracted quarter folders. Run download_form_d_quarters.py first.")


if __name__ == "__main__":
    main()
