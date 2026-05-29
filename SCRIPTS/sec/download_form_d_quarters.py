#!/usr/bin/env python3
"""Download and extract specific SEC Form D quarterly data sets.

SEC automated access requires a descriptive User-Agent with contact
information. Pass it with ``--user`` or set ``SEC_USER_AGENT``.
"""

from __future__ import annotations

import argparse
import os
import re
import time
import zipfile
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE_URL = "https://www.sec.gov/files/structureddata/data/form-d-data-sets"
REQUIRED_FILES = {
    "FORMDSUBMISSION.tsv",
    "ISSUERS.tsv",
    "OFFERING.tsv",
    "RELATEDPERSONS.tsv",
}
QUARTER_RE = re.compile(r"^(20\d{2})[Qq]([1-4])$")


def parse_quarter(value: str) -> tuple[int, int, str]:
    """Return year, quarter, and canonical quarter label."""
    match = QUARTER_RE.match(value.strip())
    if not match:
        raise argparse.ArgumentTypeError(
            f"{value!r} is not a quarter like 2025Q4"
        )
    year = int(match.group(1))
    quarter = int(match.group(2))
    return year, quarter, f"{year}Q{quarter}"


def zip_name(year: int, quarter: int) -> str:
    return f"{year}q{quarter}_d.zip"


def extract_dir_name(year: int, quarter: int) -> str:
    return f"{year}q{quarter}-d"


def download_file(url: str, output_path: Path, user_agent: str, overwrite: bool) -> str:
    if output_path.exists() and not overwrite:
        return "skipped"

    request = Request(
        url,
        headers={
            "User-Agent": user_agent,
            "Accept-Encoding": "gzip, deflate",
            "Host": "www.sec.gov",
        },
    )

    with urlopen(request, timeout=60) as response:
        output_path.write_bytes(response.read())
    return "downloaded"


def extract_zip(zip_path: Path, output_dir: Path, overwrite: bool) -> str:
    if output_dir.exists() and not overwrite:
        missing = REQUIRED_FILES - {path.name for path in output_dir.iterdir()}
        if not missing:
            return "skipped"

    output_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as archive:
        archive.extractall(output_dir)

    extracted_files = {path.name for path in output_dir.rglob("*") if path.is_file()}
    missing = REQUIRED_FILES - extracted_files
    if missing:
        raise RuntimeError(
            f"{output_dir} is missing expected files: {', '.join(sorted(missing))}"
        )
    return "extracted"


def default_output_root() -> Path:
    return Path(__file__).resolve().parents[2] / "data" / "sec" / "form-d"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download specific SEC Form D quarterly ZIPs and extract them."
    )
    parser.add_argument(
        "--quarters",
        nargs="+",
        type=parse_quarter,
        required=True,
        help="Quarters to download, for example: 2025Q2 2025Q3 2025Q4 2026Q1",
    )
    parser.add_argument(
        "--user",
        default=os.environ.get("SEC_USER_AGENT"),
        help="SEC User-Agent string with name and email. Defaults to SEC_USER_AGENT.",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=default_output_root(),
        help="Root output directory. Defaults to data/sec/form-d.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing ZIPs and extracted quarter folders.",
    )
    parser.add_argument(
        "--download-delay",
        type=float,
        default=0.2,
        help="Seconds to wait between SEC requests.",
    )
    args = parser.parse_args()

    if not args.user:
        raise SystemExit(
            "SEC User-Agent required. Pass --user 'Name email@example.com' "
            "or set SEC_USER_AGENT."
        )

    raw_dir = args.output_root / "raw"
    extracted_dir = args.output_root / "extracted"
    raw_dir.mkdir(parents=True, exist_ok=True)
    extracted_dir.mkdir(parents=True, exist_ok=True)

    print("SEC Form D quarter refresh")
    print(f"Output root: {args.output_root}")
    print(f"Quarters: {', '.join(label for _, _, label in args.quarters)}")

    downloaded = []
    skipped = []
    failed = []

    for year, quarter, label in args.quarters:
        name = zip_name(year, quarter)
        url = f"{BASE_URL}/{name}"
        zip_path = raw_dir / name
        quarter_dir = extracted_dir / extract_dir_name(year, quarter)

        try:
            status = download_file(url, zip_path, args.user, args.overwrite)
            if status == "downloaded":
                downloaded.append(name)
            else:
                skipped.append(name)

            extract_status = extract_zip(zip_path, quarter_dir, args.overwrite)
            print(f"{label}: {status}, {extract_status} -> {quarter_dir}")
        except HTTPError as exc:
            failed.append(f"{label}: HTTP {exc.code}")
            print(f"{label}: failed HTTP {exc.code}")
        except (URLError, TimeoutError, RuntimeError, zipfile.BadZipFile) as exc:
            failed.append(f"{label}: {exc}")
            print(f"{label}: failed {exc}")

        time.sleep(args.download_delay)

    print("\nSummary")
    print(f"Downloaded: {len(downloaded)}")
    print(f"Skipped: {len(skipped)}")
    print(f"Failed: {len(failed)}")
    if failed:
        raise SystemExit("; ".join(failed))


if __name__ == "__main__":
    main()
