# Contributing

Contributions can be manuscript edits, documentation updates, data curation,
script improvements, recipe revisions, or generated artifacts. The standard is
the same: make the work inspectable.

## Before You Start

Read:

1. `README.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `DATA_CONTRACT.md`
5. `docs/README.md`
6. the relevant domain doc or script README

## Contribution Types

## Documentation

- Put human-facing system docs in `docs/`.
- Update `docs/README.md` when adding durable docs.
- Keep docs operational and tied to source files.

## Manuscript

- Put reader-facing prose in `chapters/`.
- Keep raw data and automation out of manuscript folders.
- Tie factual claims to local evidence where possible.

## Data

- Preserve provenance.
- Keep source and generated data distinct.
- Protect private ATS/job-search activity.
- Write audits next to the data they inspect.

## Scripts

- Use lowercase `scripts/`.
- Document inputs, outputs, side effects, and verification.
- Run a small sample before scaling.
- Update recipes if a script becomes part of an operating recipe.

## Recipes

- Keep recipes executable by agents and auditable by humans.
- Include required reads, scripts, commands, output contract, stop conditions,
  and logging rules.
- Log meaningful runs in `logs/RUN_LOG.md`.

## Review Checklist

Before considering work complete:

- The file belongs in its directory.
- Related indexes or READMEs are updated.
- Local data and audits were checked when relevant.
- Maintained scripts were preferred over ad hoc commands.
- Phase gates were considered.
- Privacy and high-impact judgment boundaries were respected.
- Verification was run or the absence of verification is stated.
- Remaining risks are explicit.
