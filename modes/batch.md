# Mode: batch -- Batch Triage Draft

Current status: draft workflow.

Use this when many URLs need the same verified checks. Do not launch a large
batch until the small-sample run works.

## Verified Sequence

1. Put URLs in `data/ats/pipeline.md`.
2. Run `npm run ats:verify`.
3. Run liveness checks on a small sample.
4. Deduplicate with `npm run ats:dedup` when appropriate.
5. Evaluate selected live roles with `modes/oferta.md`.
6. Log the batch in `modes/RUN_LOG.md`.

## Batch Log

```markdown
## YYYY-MM-DD -- Batch triage

- **Mode:** batch
- **Inputs:** data/ats/pipeline.md
- **Commands:** `npm run ats:verify`, `npm run ats:liveness ...`
- **Worked:** ...
- **Did not work:** ...
- **Next:** ...
```

Large batches should record counts, not long pasted job descriptions.
