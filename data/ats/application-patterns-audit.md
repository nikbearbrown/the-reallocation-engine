# Application Patterns Audit

**Generated at:** 2026-05-29T02:27:13+00:00
**Applications file:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/ats/applications.md`
**Scan history file:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/ats/scan-history.tsv`
**Pipeline file:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/ats/pipeline.md`
**Run log file:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/modes/RUN_LOG.md`

## Summary

| Metric | Count |
|---|---:|
| Application tracker rows | 0 |
| Outcome-bearing application rows | 0 |
| Scan-history rows | 0 |
| Pipeline queued/processed/problem rows | 0 |
| Evaluation reports | 0 |
| Run-log entries | 3 |
| Run-log worked/result notes | 3 |
| Run-log failure/open-issue notes | 3 |

## Application Status Counts

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Application Outcome Groups

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Sponsorship Field Coverage

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Liveness Field Coverage

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## SOC Coverage

| Metric | Count | Share |
|---|---:|---:|
| Rows with SOC | 0 | 0.0% |
| Rows without SOC | 0 | 0.0% |

## Scan History Status Counts

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Scan History Source Counts

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Pipeline Section Counts

| Value | Count | Share |
|---|---:|---:|
| none | 0 | 0.0% |

## Pattern Analysis Readiness

| Check | Status | Note |
|---|---|---|
| Minimum outcomes | blocked | 0/5 rows have outcome-bearing statuses. |
| Tracker exists | blocked | No application tracker rows were parsed. |
| Scan history | missing | No scan-history rows were parsed. |
| Run log | ready | Run-log entries were parsed. |

## TODO: Future Pattern Math

Implement these once there is enough real tracker history:

- conversion by sponsorship tier;
- conversion by liveness state;
- conversion by SOC major group and SOC detailed code;
- scan source quality: which providers produce live/useful roles;
- stale-posting waste rate from scan history plus pipeline outcomes;
- score-vs-outcome calibration once evaluation scores are standardized;
- recurring blocker extraction from `data/ats/reports/*.md`;
- run-log failure analysis by script/mode;
- recommendations with evidence thresholds, not anecdotes.

## Notes

- This audit is descriptive until enough real outcomes exist.
- Missing data is reported as missing rather than filled by an LLM.
- Keep this audit next to the ATS tracker data.
