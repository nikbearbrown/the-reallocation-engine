# Mode: pipeline -- Verified URL Inbox

Use this mode when a student has collected job URLs and wants to move them
through the Reallocation Engine evidence checks.

The pipeline is not "apply to everything." It is a triage layer that separates
live, useful, evidence-backed opportunities from stale or unsupported ones.

## Required Context

Read first:

- `modes/_shared.md`
- `data/ats/pipeline.md` if it exists
- `data/ats/scan-history.tsv` if it exists
- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md`
- `data/bls/bls-audit.md`
- `modes/RUN_LOG.md`

## Primary Tools

```bash
npm run ats:verify
npm run ats:liveness -- --file data/ats/job-urls.txt
npm run ats:dedup
npm run ats:normalize
```

Use `SCRIPTS/ats/check-liveness.mjs` and related liveness scripts to separate
currently live postings from old URLs.

## Pipeline Item Format

Use `data/ats/pipeline.md` for queued URLs:

```markdown
## Pending
- [ ] https://boards.greenhouse.io/example/jobs/123 | Example Co | Software Engineer

## Processed
- [x] 2026-05-28 | https://boards.greenhouse.io/example/jobs/123 | Example Co | Software Engineer | live | evaluated

## Problems
- [!] 2026-05-28 | https://example.com/job/old | redirected to generic careers page
```

## Workflow

1. Read pending URLs.
   - Keep raw URLs intact.
   - Do not rewrite a company or role name unless the page or provider output
     confirms it.

2. Verify pipeline structure.
   - Run `npm run ats:verify`.
   - Fix malformed rows before evaluating the roles.

3. Check liveness.
   - Mark live, stale, redirected, login-required, or unknown.
   - A login-required URL is not automatically fake; it is just not verifiable
     with the current tool.

4. Attach company evidence.
   - Look up the company in
     `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped.csv` when needed.
   - Use the existing audit to understand what columns are reliable.
   - Record "not found" instead of guessing.

5. Attach role-market evidence when SOC is known.
   - Use `data/bls/compact/soc_occupation_compact.csv`.
   - If SOC is unknown, mark it as "SOC not classified yet."
   - Do not invent SOC mappings; add a future task for a classifier.

6. Move each item.
   - Live and useful: `Processed`.
   - Broken or inaccessible: `Problems`.
   - Needs human judgment: leave in `Pending` with a short note.

7. Log the run in `modes/RUN_LOG.md`.

## Output

Return a compact table:

| URL | Company | Role | Liveness | Sponsorship evidence | SOC/BLS evidence | Next |
|---|---|---|---|---|---|---|

Each cell should be evidence-based. Use `unknown` when the relevant script or
dataset does not yet support the answer.
