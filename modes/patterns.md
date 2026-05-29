# Mode: patterns -- Outcome Pattern Analysis

This is a cautious analysis mode. It should not be used as a confident advisor
until the tracker contains enough real outcomes.

## Current Status

Partially implemented as a Python audit scaffold:

```bash
python3 SCRIPTS/ats/analyze_patterns.py
```

It writes:

```text
data/ats/application-patterns-audit.md
```

The script currently measures readiness and descriptive counts across the
tracker, scan history, pipeline, reports, and run log. Deeper conversion
analysis still requires real application outcomes.

## Minimum Data Requirement

Before analysis, require at least 5 tracked opportunities with an outcome beyond
`Evaluated`, such as:

- `Applied`
- `Responded`
- `Interview`
- `Offer`
- `Rejected`
- `Withdrawn`
- `Skip`

If fewer than 5 exist, stop and log:

```markdown
## YYYY-MM-DD -- Pattern analysis blocked

- **Mode:** patterns
- **Worked:** Tracker inspected.
- **Did not work:** Not enough outcomes for pattern analysis.
- **Evidence:** N/5 outcome-bearing rows.
- **Next:** Continue collecting outcomes, then extend `SCRIPTS/ats/analyze_patterns.py`.
```

## Future Analysis Contract

The script should eventually produce:

- total entries;
- date range;
- counts by status;
- live vs stale posting outcomes;
- sponsorship evidence vs outcomes;
- SOC group vs outcomes;
- company size or funding recency vs outcomes when available;
- recommendations with evidence.

## Allowed Current Use

Until enough tracker history exists, this mode may only:

- summarize tracker counts;
- identify missing fields;
- recommend data cleanup;
- create a task to build the script.

It must not infer "what works" from a tiny or unverified sample.
