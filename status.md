---
project: the-reallocation-engine
status: active
updated: 2026-06-14
canonical: [SNICKERDOODLE.md, DOMAIN.md, AGENTS.md, outline.md, book.md, chapters/]
next:
  - "Attest adequacy of the honest run (review reports/generated/oferta-2026-06-14.md) to promote `oferta` past DRAFT (gap #4)"
  - "Confirm the scorer [VERIFY] defaults (role_quality weight, Consider-band floor) vs docs/search-profile-design.md"
blocked_by: null
---

# Status — The Reallocation Engine

_Read this first for current state._ `DOMAIN.md` = what the repo **is**; `logs/RUN_LOG.md` = the full **history**; this file = **where we are now and what's next**.

## Where things stand
- **Manuscript:** 21 chapter files drafted (`chapters/00`–`99`), introduction through back matter.
- **Pipeline (runnable today):** SEC Form D, BLS/O*NET extracts, ATS scan/liveness, resumes → PDF, the Ch.11 Bayesian role scorer (`npm run score`), plus `npm run doctor` and `npm run verify`.
- **Context architecture:** root `AGENTS.md`/`CLAUDE.md` compile from `instructions/` modules; `.claude/` hooks (archive-guard + conformance) and a CI drift-guard are in place.
- **Data:** full SEC/BLS datasets are gitignored; small samples are shipped — see `DATA.md`.
- **Recipes:** all 42 carry lifecycle frontmatter; all are still `status: DRAFT`.

## The one thing that matters next
**Attest the honest run (gap #4).** The first gated, logged run is done — `oferta` (Ch.11 scorer) ran clean in sample mode and reproduces the book (see `reports/generated/oferta-2026-06-14.md`). The only thing left is *your* adequacy attestation, which promotes `oferta` past `DRAFT`.

## Open questions / decisions pending
- **Run-envelope schema** — defined in `recipes/pipeline.md` (worked sample: `data/examples/run-envelope.json`). The remaining step is wiring the Ch.7–10 feeds to *emit* it, tied to the honest run.
- **Scorer `[VERIFY]` defaults — checked:** neither Ch.11 nor the SDD pins them (confirmed unpinned). Open *authorial* call: `role_quality: 0.0` drops the Ch.9 role-quality signal from the composite — decide whether it should carry weight (and renormalise) before real decisions.

## Recently done (2026-06-14)
- Decluttered the root; dual-licensed (MIT code / CC BY 4.0 book); set up large-file handling (samples + gitignore + a pre-commit size guard, documented in `DATA.md`); added the CLI-agnostic AI tooling guide and a repo audit under `docs/`; reconciled agentic "skill" → "recipe" across the manuscript (gap #7); defined the pipeline run-envelope schema; verified the scorer [VERIFY] weights — confirmed unpinned by Ch.11 and the SDD (#3); executed the first gated, logged honest run (#4, sample mode — awaiting your adequacy attestation).

_Update this file at the end of each working session: state, decisions, next actions. Keep it short — it's the current-state file, not a log._
