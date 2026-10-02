# Independent cross-check: Python's csv module (not the prototype's parser) vs the prototype's JSON log.
import csv, json, sys
csv_path, log_path = sys.argv[1], sys.argv[2]
log = json.load(open(log_path, encoding="utf-8"))
want = {c["company"]: c for c in log["candidates"] if c.get("scorer")}
cols = ["company_name", "Total Approvals", "Total Denials", "Approval_Rate", "latest_funding_date", "top_job_titles_sponsored"]
with open(csv_path, newline="", encoding="utf-8") as f:
    r = csv.DictReader(f)
    for row in r:
        name = row["company_name"]
        if name not in want: continue
        ev = want[name]["evidence"]
        line = ev["approvals"]["source"].rsplit("#L", 1)[1]
        checks = [
            ("approvals", float(row["Total Approvals"]), ev["approvals"]["value"]),
            ("denials", float(row["Total Denials"]), ev["denials"]["value"]),
            ("approval_rate", float(row["Approval_Rate"]), ev["approval_rate"]["value"]),
            ("latest_funding_date", row["latest_funding_date"], ev["latest_funding_date"]["value"]),
            ("matched title in CSV list", all(t in row["top_job_titles_sponsored"] for t in ev["matched_titles"]["value"]), True),
            ("csv line number", r.line_num, int(line)),
        ]
        print(f"{name}  (csv line {r.line_num}; titles: {row['top_job_titles_sponsored']})")
        for k, a, b in checks:
            print(f"   {'OK ' if a == b else 'MISMATCH'} {k}: csv={a!r} prototype={b!r}")
        del want[name]
print("not found in CSV:", list(want) or "none")
