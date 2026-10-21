#!/usr/bin/env python3
"""Offline tests for lca_slice.py (no network, synthetic workbook; every name is made up).

    python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py
"""
import csv
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook

HERE = Path(__file__).resolve().parent
COLS = ["CASE_NUMBER", "CASE_STATUS", "VISA_CLASS", "JOB_TITLE", "SOC_CODE", "SOC_TITLE", "EMPLOYER_NAME",
        "EMPLOYER_POC_LAST_NAME", "EMPLOYER_POC_EMAIL", "AGENT_ATTORNEY_LAST_NAME", "WORKSITE_CITY", "WORKSITE_STATE",
        "WAGE_RATE_OF_PAY_FROM", "WAGE_UNIT_OF_PAY", "DECISION_DATE"]


def row(status="Certified", visa="H-1B", title="Data Analyst", soc="15-2051.01", emp="Example Analytics Inc",
        state="MA", rate=90000, unit="Year", case="I-200-00000-000001"):
    return [case, status, visa, title, soc, "Business Intelligence Analysts", emp, "Fakename", "poc@example.com",
            "Fakelawyer", "Boston", state, rate, unit, datetime(2026, 3, 2)]


def run(rows, cols=COLS):
    d = Path(tempfile.mkdtemp())
    wb = Workbook(); ws = wb.active; ws.append(cols)
    for r in rows:
        ws.append(r)
    wb.save(d / "lca.xlsx")
    p = subprocess.run([sys.executable, str(HERE / "lca_slice.py"), "--xlsx", str(d / "lca.xlsx"), "--state", "MA",
                        "--out", str(d / "out.csv"), "--audit", str(d / "audit.md")], capture_output=True, text=True)
    out = None
    if (d / "out.csv").exists():
        with (d / "out.csv").open() as f:
            out = list(csv.DictReader(f))
    audit = (d / "audit.md").read_text() if (d / "audit.md").exists() else ""
    return p, out, audit, d


class T(unittest.TestCase):
    def test_filters_and_counts(self):
        p, out, audit, _ = run([row(), row(), row(rate=95000),                    # 3 kept, same employer+SOC
                                row(rate=45, unit="Hour", emp="Hourly Co"),       # hourly -> 45 * 2080
                                row(state="CA"),                                  # other state
                                row(status="Withdrawn"),                          # not certified
                                row(visa="E-3 Australian"),                       # not H-1B
                                row(soc="15-1252.00", title="Software Developer"),  # not analyst family
                                row(soc="13-1161", emp="Other Research LLC")])    # 7-char SOC normalised to .00
        self.assertEqual(p.returncode, 0, p.stderr)
        by = {(r["employer_name"], r["soc_code"]): r for r in out}
        self.assertEqual(by[("Example Analytics Inc", "15-2051.01")]["certified_lcas"], "3")
        self.assertEqual(by[("Example Analytics Inc", "15-2051.01")]["median_annual_wage_offered"], "90000")
        self.assertEqual(by[("Hourly Co", "15-2051.01")]["median_annual_wage_offered"], "93600")
        self.assertEqual(by[("Other Research LLC", "13-1161.00")]["family"], "core")
        self.assertEqual(len(out), 3)
        self.assertIn("| read | 9 |", audit)
        self.assertIn("| **kept** | **5** |", audit)

    def test_blank_sheet_rows_are_not_counted_as_filings(self):
        p, out, audit, _ = run([row(), [None] * len(COLS), [None] * len(COLS)])
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertIn("| blank sheet rows skipped (not filings) | 2 |", audit)
        self.assertIn("| read | 1 |", audit)

    def test_never_writes_people_or_case_numbers(self):
        p, out, audit, d = run([row()])
        text = (d / "out.csv").read_text() + audit
        for bad in ("Fakename", "poc@example.com", "Fakelawyer", "I-200-00000"):
            self.assertNotIn(bad, text)

    def test_break_missing_column_halts(self):
        cols = [c for c in COLS if c != "SOC_CODE"]
        p, out, _, _ = run([[v for c, v in zip(COLS, row()) if c != "SOC_CODE"]], cols)
        self.assertEqual(p.returncode, 2)
        self.assertIn("SOC_CODE", p.stderr)
        self.assertIsNone(out)

    def test_break_empty_file_halts(self):
        p, out, _, _ = run([])
        self.assertEqual(p.returncode, 2)
        self.assertIsNone(out)


if __name__ == "__main__":
    unittest.main(verbosity=2)
