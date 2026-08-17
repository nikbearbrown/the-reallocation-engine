# Session Handoff — The Reallocation Engine

> Portable resume point for the next session/agent. Read this + `status.md` to
> continue without replaying the full conversation. Keep it short: decisions and
> next actions in; narrative back-and-forth and raw tool output out.
> Full history lives in `logs/RUN_LOG.md`; current state in `status.md`.

## Goal (one line)
Maintain the manuscript and the working engine; promote `oferta` past DRAFT via an attested honest run.

## State now — 2026-06-14
- **Done:** All 16 concept chapters (`chapters/01`–`16`) carry the five-part running-project exercise block (When to Use AI / When NOT to Use AI / LLM / CLI / AI Validation); old per-chapter exercises replaced. Project: "Your Own Reallocation Engine."
- **Done:** Portable compatibility layer added per `docs/cli-agnostic-ai-tooling-audit.md` — `_MANIFEST.md`, `.ai/manifest.yaml`, `PROJECT_RULES.md`, this handoff file; Claude hook "Madison" naming drift fixed.
- **In progress:** Wiring `_MANIFEST.md` into generated instructions and rebuilding `AGENTS.md`/`CLAUDE.md`.
- **Blocked:** `oferta` promotion awaits the human's adequacy attestation of `reports/generated/oferta-2026-06-14.md` (gap #4).

## Key decisions
- Constitution is `SNICKERDOODLE.md` (forked/renamed from Mycroft); governs all conflicts.
- Compatibility layer is a thin index over the existing system — no content moved, no churn (audit Phase 1).
- Tool adapters (GEMINI.md, Copilot, Cursor, Aider) and `doctor` manifest-enforcement (audit Phases 2 & 4) are deferred pending a decision on which tools are actually used.

## Next 1–3 actions
1. Attest adequacy of the honest run to promote `oferta` past DRAFT (gap #4).
2. Decide the scorer `[VERIFY]` defaults (`role_quality` weight, Consider-band floor) vs `docs/search-profile-design.md`.
3. Decide which tool adapters to generate (audit Phase 2), then wire `doctor` to check the manifest (audit Phase 4).

## Files that matter (and only these)
- canonical: `SNICKERDOODLE.md`, `DOMAIN.md`, `AGENTS.md`, `status.md`, `logs/RUN_LOG.md`
- touch next: `instructions/reallocation-engine.md` (then rebuild), `reports/generated/oferta-2026-06-14.md` (review)

## Do NOT
- Edit `AGENTS.md` / `CLAUDE.md` by hand (generated — edit `instructions/`, then rebuild).
- Treat `output/` or `reports/generated/` as source.
- Commit `data/ats/`, rendered resumes/PDFs, or `.env*` without review.
