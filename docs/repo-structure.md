# Repository Structure

The Reallocation Engine is both a book and an agent-running project. Its structure separates human-readable documentation, agent-readable recipes, verified data, vetted scripts, and manuscript output.

## Top-Level Structure

```text
the-reallocation-engine/
  README.md
  CLAUDE.md
  AGENTS.md
  docs/
  data/
  scripts/
  recipes/
  chapters/
  slides/        # optional, create when decks exist
  pantry/
  images/
  d3/
  resumes/
  output/
```

## Core Directories

`README.md` is the front door for humans. It explains what the system is, how the book and engine fit together, and where to start.

`CLAUDE.md` contains Claude/Cowork-specific operating rules.

`AGENTS.md` contains cross-agent rules for any agent working in the repo.

`docs/` contains human-readable system documentation: architecture, repo structure, phase gates, data contracts, recipe summaries, script standards, and maintenance guides.

`data/` contains verified local data, database exports, generated datasets, metadata, source records, and audits. Agents should check `data/` before external lookup.

`scripts/` contains tested, vetted, reusable automation. Agents should check `scripts/` before creating ad hoc scripts. The repo uses lowercase `scripts/` only.

`recipes/` contains agent-facing recipes and operating procedures. Recipes should begin with a human-readable executive summary, then provide exact required reads, commands, tests, outputs, and stop conditions for agents.

`chapters/` contains the book manuscript. It should not contain operational scripts or raw data.

`slides/` is optional. Create it only when slide decks or teaching materials exist.

`pantry/` contains research notes, source notes, raw/reference material, and pre-manuscript evidence.

`images/` and `d3/` contain visual assets and figure source material.

`resumes/` contains anonymized example resume material used by the resume pipeline.

`output/` contains generated build artifacts. Treat it as derived output, not source of truth.

## Documentation Placement

Put broad human-readable system docs in `docs/`.

Examples:

- `docs/README.md`
- `docs/repo-structure.md`
- `docs/operations.md`
- `docs/phase-gates.md`
- `docs/data-and-provenance.md`
- `docs/scripts.md`
- `docs/recipes.md`
- `docs/manuscript.md`
- `docs/contributing.md`
- `docs/Documentation.md`

Keep root-level files only when they are entry points or contracts that agents and humans must find immediately:

- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `DATA_CONTRACT.md`
- `metadata.yaml`
- `package.json`

## Script Rules

Use lowercase `scripts/`.

Do not create `SCRIPTS/`.

Before writing a new script:

1. Search `scripts/` for an existing tool.
2. Read the relevant script README.
3. Prefer package commands when available.
4. If a new script is needed, place it in the relevant `scripts/<domain>/` directory.
5. Add or update documentation and a verification command.

## Data Rules

Use verified local or database-backed data before external lookup.

Preferred sources include:

- source exports in `data/`;
- generated audits beside the data they inspect;
- metadata and source manifests;
- maintained indexes;
- documented database exports.

External lookup is a fallback for gaps, freshness checks, or questions the verified local data cannot answer.

## Agent Recipe Rules

Agent-facing recipes live in `recipes/`.

Each recipe should include:

1. human-readable executive summary;
2. when to use it;
3. required local data;
4. required scripts;
5. exact commands or steps;
6. explicit tests or handoff conditions;
7. output contract;
8. stop conditions;
9. logging requirements.
