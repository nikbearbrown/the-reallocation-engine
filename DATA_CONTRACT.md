# Data Contract

This document defines which files are source material, maintained system code,
generated outputs, book content, and private/user-specific work for The
Reallocation Engine.

## Maintained System Layer

These files are part of the repo's maintained data-processing system.

| Path | Purpose |
|---|---|
| `SCRIPTS/` | Canonical scripts for SEC, ATS, audit, and enrichment workflows. |
| `SCRIPTS/sec/` | Maintained SEC Form D pipeline. |
| `SCRIPTS/ats/` | Maintained ATS detection, provider, scanner, and liveness pipeline. |
| `package.json` | Node runtime dependencies for book/script utilities. |

Rule: prefer adding new automation here, not as loose one-off scripts in `data/`.

## Source Data Layer

These files are source or upstream reference data. Treat them as provenance.

| Path | Purpose |
|---|---|
| `data/80-Days-to-Stay-main/` | Upstream 80 Days to Stay data and scripts. |
| `data/career-ops-main/` | Upstream Career-Ops reference system. |
| `data/BLS/` | BLS source/reference data. |
| `data/sec/form-d/raw/` | Downloaded SEC quarter ZIP files. |
| `data/sec/form-d/extracted/` | Extracted SEC quarter TSV files. |

Rule: do not casually rewrite upstream source data. Copy/adapt useful code into
`SCRIPTS/` and document the provenance.

## Generated Data Layer

These files are produced by maintained scripts and can be regenerated.

| Path | Purpose |
|---|---|
| `data/sec/form-d/processed/` | Processed SEC quarterly JSON and audits. |
| `data/ats/` | ATS scanner inputs/outputs, scan history, and job pipeline files. |
| `*-audit.md` | Markdown audit reports written next to the data they inspect. |

Rule: large generated files should be split, compressed, moved out of git, or
kept under GitHub size limits before committing.

## Book Content Layer

These files are editorial material for the book/repo.

| Path | Purpose |
|---|---|
| `book.md` | Main manuscript entry point. |
| `chapters/` | Chapter files. |
| `outline.md`, `vision.md`, `risks.md`, `architecture.md` | Planning and architecture notes. |
| `images/`, `d3/`, `styles/` | Book visuals and presentation assets. |
| `pantry/` | Research pantry for curated material before it becomes manuscript text. |

Rule: scripts should support the book, but generated data should not be mixed
into manuscript folders.

## Private/User-Specific Layer

These files should not be assumed safe to publish.

| Path | Purpose |
|---|---|
| `.env*` | API keys, credentials, deployment config. |
| `data/ats/applications.md` | Personal application tracker if created. |
| `data/ats/pipeline.md` | Job pipeline output that may contain user-specific targets. |
| `data/ats/scan-history.tsv` | Scan history that may reveal target companies or job search activity. |

Rule: check privacy and size before committing generated ATS/job-search files.

## Operating Rules

- Put maintained automation in `SCRIPTS/`.
- Put audit reports next to the data they audit, using `-audit.md`.
- Keep upstream source folders intact for provenance.
- Do not rebuild source datasets from scratch when a mapped or processed asset
  already exists.
- Avoid committing files over GitHub's practical size limits; split or move
  large files before publishing.
