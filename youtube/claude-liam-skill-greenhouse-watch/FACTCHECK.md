# FACTCHECK — claude-liam-skill-greenhouse-watch

| Beat | Claim | Source | Verdict |
|---|---|---|---|
| B00 | "163 jobs on one Greenhouse board" | example/airbnb-aarav-2026-09-16/README.md: "Real API response (163 jobs, fictional résumé)" | VERIFIED |
| B00 | "Twenty-five weren't there yesterday" | run-second-run.json: jobs_new=25 | VERIFIED |
| B00 | "Seven match the résumé" | run-second-run.json: jobs_relevant=7 | VERIFIED |
| B02 | "100 to 200 active postings" | README.md: "Real API response (163 jobs)"; SKILL.md context | VERIFIED (163 is within range) |
| B02 | No native new-since filter on Greenhouse boards | SKILL.md: "Watch ONE company's Greenhouse job board and report only the jobs that are NEW since the last check" (implies this is a problem the tool solves) | VERIFIED (the tool exists because the board lacks this) |
| B03 | Four CLI flags: --board, --resume, --state, --out | greenhouse_watch.py lines 244-249 | VERIFIED |
| B03 | "Markdown report and a JSON run record" | SKILL.md: "Write two outputs (P5, two readers): run-<time>.json for the agent and report-<time>.md for the human" | VERIFIED |
| B04 | Six pipeline steps | greenhouse_watch.py main(): validate inputs → fetch → diff → match → write_outputs → update state | VERIFIED |
| B04 | "If the fetch fails, the state file is untouched" | greenhouse_watch.py line 266-268: "exits 3 and leaves the state file alone" (also SKILL.md: "A failed fetch exits 3 and leaves the state file alone") | VERIFIED |
| B05 | "Exactly four Greenhouse hostnames" | greenhouse_watch.py ALLOWED_HOSTS: {"boards-api.greenhouse.io", "boards.greenhouse.io", "job-boards.greenhouse.io", "job-boards.eu.greenhouse.io"} — 4 entries | VERIFIED |
| B05 | "Refuses redirects" | greenhouse_watch.py lines 50-52: NoRedirect class with comment "a redirect could leave the allow-list" | VERIFIED |
| B05 | "Raw response is saved to disk" | greenhouse_watch.py lines 280-285: raw_path written before any processing | VERIFIED |
| B06 | "First run is always a baseline" | SKILL.md: "No state file means BASELINE: every id is recorded, none reported" | VERIFIED |
| B07 | Threshold 3.0 | scheme.default.json: "threshold": 3.0 | VERIFIED |
| B07 | title:3.0, skill:1.0, degree:0.5, location:1.0, location_miss:-1.0 | scheme.default.json weights object | VERIFIED |
| B07 | Capped at max_skill_hits | scheme.default.json: "max_skill_hits": 8; greenhouse_watch.py: cap = scheme.get("max_skill_hits", 8) | VERIFIED |
| B08 | Real justification lines for Senior Staff ML Engineer | run-second-run.json relevant[3]: id 7747259, score 6.0, 6 justification lines | VERIFIED |
| B09 | 163 seen, 25 new, 7 relevant, 18 skipped | run-second-run.json: jobs_seen=163, jobs_new=25, jobs_relevant=7, jobs_skipped=18 | VERIFIED |
| B10 | Gate line text "Reader: the candidate..." | report-second-run.md line 3; greenhouse_watch.py line 221 | VERIFIED |
| B10 | Gate field in run record | greenhouse_watch.py line 307: "gate": "human: decide which relevant job, if any, is worth applying to" | VERIFIED |
| B11 | China posting (Staff Software Engineer) clears at 4.5 | run-second-run.json relevant[6]: id 6448191, title "Staff Software Engineer, Community Support Engineering", location "China", score 4.5 | VERIFIED |
| B11 | Known soft spot named in README | example README: "The China-located Staff Software Engineer clearing the bar at 4.5 is the default scheme's known soft-location weakness, left in on purpose." | VERIFIED |
| B11 | Fix is in scheme file, not code | SKILL.md: "If the user disagrees with a verdict, the fix is to the scheme file, not to the code and not to the résumé." | VERIFIED |
