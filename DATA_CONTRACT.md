# Data Contract

This document defines which files are source material, maintained system code,
generated outputs, book content, and private/user-specific work for The
Reallocation Engine.

## Maintained System Layer

These files are part of the repo's maintained data-processing system.

| Path | Purpose |
|---|---|
| `scripts/` | Canonical scripts for SEC, ATS, audit, and enrichment workflows. |
| `scripts/sec/` | Maintained SEC Form D pipeline. |
| `scripts/ats/` | Maintained ATS detection, provider, scanner, and liveness pipeline. |
| `package.json` | Node runtime dependencies for book/script utilities. |

Rule: prefer adding new automation here, not as loose one-off scripts in `data/`.

## Source Data Layer

These files are source or upstream reference data. Treat them as provenance.

| Path | Purpose |
|---|---|
| `data/80-days-to-stay/` | Upstream 80 Days to Stay data and scripts. |
| `data/bls/` | BLS source/reference data. |
| `data/sec/form-d/raw/` | Downloaded SEC quarter ZIP files. |
| `data/sec/form-d/extracted/` | Extracted SEC quarter TSV files. |

Rule: do not casually rewrite upstream source data. Copy/adapt useful code into
`scripts/` and document the provenance.

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

- Put maintained automation in `scripts/`.
- Put audit reports next to the data they audit, using `-audit.md`.
- Keep upstream source folders intact for provenance.
- Do not rebuild source datasets from scratch when a mapped or processed asset
  already exists.
- Avoid committing files over GitHub's practical size limits; split or move
  large files before publishing.


## Zero-Conditions: Real Personal Data (added 2026-08, Fall 2026 term)

This repository is public and permanent. Git history is part of the repository.

**Committing real personally identifying information is a zero-condition
offense.** "Real PII" means: an actual person's resume or CV in any format, a
real email address (anything not `@example.com`/`@example.org` or a GitHub
noreply address), a real phone number (anything outside the reserved 555
exchange), real contact or immigration details, application trackers or
outcomes tied to a real person, letters of reference or support, and any file
derived from these — including a renamed or lightly-edited copy, which can
still identify its owner through its job history.

"Committing" includes any commit reachable from your branch or PR, even if a
later commit deletes the file. Removing a file from the tree does not remove
it from history; the only fix for a PII commit is re-cutting the branch and,
where a PR already exposed it, telling the maintainer immediately so the PR
copy can be purged. Self-reporting a slip before review is handled as a
process note; discovery during review or after merge is handled under the
course's academic-integrity policy, and the PR is closed unmerged regardless
of its technical quality.

**Fictional personas only.** Every resume-shaped or profile-shaped file that
appears anywhere tracked — demos, fixtures, worked runs, reports, screenshots,
recordings — must use the fictional personas in `search/examples/` (search-
layer packs: `profile.yml`, `resume.example.json`, `gaps.md`) and `resumes/` (the
persona CVs: Aarav Patel, Priya Nair, Maya Sehgal, Rohan Desai). These are
the ONLY resume-shaped files git will accept (`.gitignore` blocks the rest;
`npm run doctor` and CI enforce it). If no existing persona exercises the
case your contribution needs, extend a persona or add a new fictional one
under `search/examples/` — never adapt real data, yours or anyone else's.
Your real resume, tracker, and search files live untracked in `private/` and
`search/`; weakening `.gitignore` to track them is itself a zero-condition
offense.
