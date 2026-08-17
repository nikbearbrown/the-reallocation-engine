# Scripts

`scripts/` is the maintained automation layer. Durable automation belongs here,
not as loose one-off code in `data/`, `chapters/`, or chat history.

## Script Families

- `scripts/sec/`: SEC Form D download, refresh, extraction, filtering, domain
  inference, entity resolution, and validation.
- `scripts/ats/`: ATS detection, provider scanning, liveness checks, pipeline
  verification, tracker merge/dedup/normalization, and pattern analysis.
- `scripts/bls/`: SOC/O*NET/OEWS compact extraction and role-quality source
  preparation.
- `scripts/resumes/`: Markdown CV to ATS-safe PDF generation.
- `scripts/svg-to-png.mjs`: SVG figure rendering utility.
- `scripts/cowork-agentic-repo.py`: scaffold for future book-plus-agent repos.

## Package Commands

Run from the repository root:

```bash
npm run ats:scan
npm run ats:liveness -- https://example.com/job/123
npm run ats:verify
npm run ats:merge
npm run ats:dedup
npm run ats:normalize
npm run resumes:pdf -- --all
npm run svg-to-png
```

## Python Commands

Common Python entry points:

```bash
python3 scripts/audit-sec-dol-h1b-data.py
python3 scripts/sec/download-form-d-quarters.py --quarters 2025Q2 2025Q3 2025Q4 2026Q1 --user "Name email@example.com"
python3 scripts/sec/refresh-recent-sec-quarters.py
python3 scripts/sec/validate-h1b-join-sample.py
python3 scripts/bls/extract-soc-occupation-table.py
python3 scripts/ats/analyze-patterns.py
```

Check the relevant script README before running:

- `scripts/README.md`
- `scripts/sec/README.md`
- `scripts/ats/README.md`
- `scripts/bls/README.md`
- `scripts/resumes/README.md`

## Promotion Rule

Before creating a new script:

1. Search `scripts/` for an existing tool.
2. Check package commands in `package.json`.
3. Identify the domain folder.
4. Document inputs, outputs, side effects, and verification.
5. Run a small sample before broad execution.
6. Update docs and recipes if the command becomes part of a workflow.

Reusable ad hoc code should be promoted into `scripts/` after review.

## Verification Rule

Every maintained script should have a way to answer:

- What data did it read?
- What did it write?
- Can it be rerun safely?
- What audit or check proves the output is usable?
- What should stop execution?
