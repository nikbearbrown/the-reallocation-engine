# _MANIFEST.md — read this first

> Portable read-first map for any agent, CLI, or human. It is a thin **index over
> the existing system**, not a second source of truth. If it conflicts with what
> you find on disk, trust the canonical file and flag the discrepancy in
> `logs/RUN_LOG.md`.
>
> **Governance:** `SNICKERDOODLE.md` is the constitution and governs all conflicts.
> `DOMAIN.md` is this repository's domain map. `AGENTS.md` (generated) is the
> cross-agent operating contract. This manifest just tells you *what to read and
> what to ignore*.

## Tier 1 — Canonical (read first)

| File | Purpose |
|------|---------|
| `SNICKERDOODLE.md` | Constitution: principles, verification stack, recipe lifecycle, gates, logging. Governs all conflicts. |
| `DOMAIN.md` | This repo's domain map — layout, what is runnable today, known gaps, privacy notes. |
| `AGENTS.md` | Generated cross-agent instructions (built from `instructions/`). |
| `PROJECT_RULES.md` | Thin precedence/compatibility pointer to the files above. |
| `DATA_CONTRACT.md` | What data exists, where it lives, what is private. |
| `status.md` | Current state, latest decisions, next actions (where we are *now*). |
| `logs/RUN_LOG.md` | Ground-truth run history (what actually happened). |

## Tier 2 — Task-relevant (load only when the task needs it)

| Path | Use when |
|------|----------|
| `recipes/` | Operating the engine — agent-facing recipes (scan, pipeline, oferta, tracker, pdf, patterns…). |
| `scripts/` | Maintained automation (sec, bls, ats, resumes, score, conformance, build-instructions). |
| `book/` | Manuscript work — the book *The Reallocation Engine*. |
| `data/` | Local verified/source data. Follow privacy rules; `data/ats/` is private (see Tier 3). |
| `docs/` | System documentation. Design reference (not governing): `docs/cli-agnostic-ai-tooling-guide.md` and its repo audit `docs/cli-agnostic-ai-tooling-audit.md`. |
| `instructions/` | Source for the generated `AGENTS.md` / `CLAUDE.md` — edit here, then rebuild. |
| `eval/` | §19 measurement harness — task suite + scorer that tests whether the instruction scaffolding actually helps (`npm run eval:score` / `eval:report`). |
| `session-handoff.md` | Resume point when continuing a prior session. |

## Tier 3 — Generated / private (ignore unless explicitly requested)

| Path | Rule |
|------|------|
| `output/` | Generated deliverables; **not** a source of truth. |
| `reports/generated/` | Generated run reports; cite via `logs/RUN_LOG.md`, don't treat as source. |
| `node_modules/` | Dependencies; never read broadly. |
| `**/__pycache__/`, `*.pyc`, `.build/`, `*.bak` | Rebuildable cache; the only safe `rm` targets (see `instructions/_shared/no-delete.md`). |
| `data/ats/`, rendered resumes/PDFs, `.env*` | **Private by default** — reveal personal job-search activity. Read only when the task requires it; never commit without review. |
| `archive/` | Superseded files, preserved not deleted. Ignore unless asked. (Nothing is ever deleted — it is archived.) |

## Maintenance

- Machine-readable twin: `.ai/manifest.yaml` (keep in sync with this file).
- Update this manifest when Tier 1 files or top-level structure change.
- `_Last updated: 2026-06-14._`
