# Mode: tracker -- Application And Scan History

Use this mode to inspect or update the human-readable application tracker and
scan history.

The tracker should preserve what happened over time. Avoid overwriting history
when a status change should be a new event.

## Required Context

Read first:

- `modes/_shared.md`
- `data/ats/applications.md` if it exists
- `data/ats/scan-history.tsv` if it exists
- `data/ats/pipeline.md` if it exists
- `modes/RUN_LOG.md`

## Primary Tools

```bash
npm run ats:verify
npm run ats:normalize
npm run ats:dedup
npm run ats:merge
```

## Recommended Tracker Format

Use `data/ats/applications.md`:

```markdown
| Date | Company | Role | URL | Status | Sponsorship | Liveness | SOC | Notes |
|---|---|---|---|---|---|---|---|---|
| 2026-05-28 | Example Co | Software Engineer | https://... | Evaluated | Unknown | Live | 15-1252 | Needs manual review |
```

Recommended statuses:

- `Scanned`
- `Evaluated`
- `Applied`
- `Responded`
- `Interview`
- `Offer`
- `Rejected`
- `Withdrawn`
- `Stale`
- `Skip`

## Workflow

1. Read the existing tracker and pipeline.
2. Run verification scripts before editing.
3. Normalize statuses only with the maintained script.
4. Deduplicate by URL first, then company plus role title.
5. For status updates, preserve the prior status in notes when useful.
6. Add a `modes/RUN_LOG.md` entry if the update changes more than one row or
   reflects a meaningful pipeline event.

## Summary Output

When asked for tracker status, report:

- total tracked items;
- count by status;
- live vs stale when known;
- sponsorship tiers when known;
- SOC coverage when known;
- rows needing manual review.

Use `unknown` for fields that are not supported by current data.
