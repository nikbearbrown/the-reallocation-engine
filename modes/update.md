# Mode: update -- Repo-Local Maintenance

Use this mode to update the student-facing operating recipes when scripts,
data contracts, or audits change.

This is not an upstream package update flow. Do not fetch from an old source
repo unless the user explicitly asks.

## Required Context

Read first:

- `README.md`
- `DATA_CONTRACT.md`
- `SCRIPTS/README.md` if it exists
- `modes/README.md`
- `modes/_shared.md`
- `modes/RUN_LOG.md`

## Workflow

1. Check what changed.
   - New script under `SCRIPTS/`.
   - New audit under `data/**`.
   - New compact extract.
   - New report or project draft.

2. Update the relevant mode.
   - Add exact commands.
   - Add exact input and output paths.
   - Add what the script can and cannot verify.
   - Add logging instructions when the workflow changes data or produces a
     reusable result.

3. Check for stale references.

```bash
rg -n "cv.md|config/profile.yml|analyze-patterns|cv-sync" modes
```

Some references may be historical notes, but active workflows should point to
The Reallocation Engine paths and scripts.

4. Validate file readability.

```bash
rg -n "SCRIPTS/|data/|RUN_LOG" modes
```

5. Log the update in `modes/RUN_LOG.md`.

## Log Template

```markdown
## YYYY-MM-DD -- Mode maintenance

- **Mode:** update
- **Changed:** modes/...
- **Reason:** ...
- **Worked:** ...
- **Did not work:** ...
- **Next:** ...
```

## Rules

- Keep maintained automation under `SCRIPTS/`.
- Keep generated data reports next to the data with `-audit.md`.
- Keep student-specific private data out of source/reference data folders.
- Prefer "not implemented yet" over pretending a script exists.
