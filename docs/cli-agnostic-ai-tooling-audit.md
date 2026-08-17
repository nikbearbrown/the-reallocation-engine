# CLI-Agnostic AI Tooling Audit

**Repository:** `the-reallocation-engine`  
**Audit date:** 2026-06-14  
**Audit basis:** attached `CLI-Agnostic AI Tooling for Local Project Workflows` guide, repo inspection, and local verification commands.

## Executive Summary

The Reallocation Engine is already well ahead of a typical agent-facing repository. It has generated `AGENTS.md` / `CLAUDE.md` instructions, a domain constitution (`SNICKERDOODLE.md`), a current domain map (`DOMAIN.md`), maintained script families, runnable npm commands, conformance checks, Claude hooks, recipe lifecycle frontmatter, and explicit no-delete / provenance / verification rules.

The main gap is not instruction quality. The main gap is **portable context architecture**: the repo has strong Claude/Codex-readable instructions, but it does not yet expose the guide's recommended cross-tool layer as first-class files: `_MANIFEST.md`, `PROJECT_RULES.md`, `status.md`, `session-handoff.md`, and `.ai/manifest.yaml`. Some of those roles are partially covered by `SNICKERDOODLE.md`, `DOMAIN.md`, `logs/RUN_LOG.md`, and `instructions/manifest.yml`, but the names and semantics are not obvious to every tool or future agent.

Recommended near-term move: do not replace the existing Snickerdoodle system. Add a thin compatibility layer that maps the existing system into the portable conventions.

## Resolution Status — 2026-06-15

The thin compatibility layer has been added and the build/verify pipeline now enforces it. Findings below are annotated `RESOLVED` / `PARTIAL` / `ADVISORY`.

**Done:**

- **Portable files (Phase 1):** `_MANIFEST.md`, `.ai/manifest.yaml`, `PROJECT_RULES.md`, `session-handoff.md` added as thin indexes over the existing system. `status.md` already existed and is now referenced from the manifest. `_MANIFEST.md` is wired into the generated `AGENTS.md` via `instructions/reallocation-engine.md`.
- **CLI-agnostic adapters (Phase 2):** `scripts/build-instructions.mjs` now generates, from the single `instructions/` source, thin shims that all point at the canonical `AGENTS.md`: `.gemini/settings.json`, `.aider.conf.yml`, `.github/copilot-instructions.md`, `.cursor/rules/reallocation-engine.mdc` (plus the existing `AGENTS.md`/`CLAUDE.md`). Tools are listed in `instructions/manifest.yml` `targets:`. No rule content is duplicated; rebuild is idempotent.
- **Enforcement (Phase 4):** `scripts/manifest-check.mjs` checks that canonical files exist, that every generated adapter matches a fresh build (catches hand-edits / un-rebuilt drift), and warns on gitignore/privacy/contradiction gaps. It is wired into `npm run verify` (`conformance && manifest-check`) and exposed as `npm run manifest-check`. Verified: a hand-edit to `AGENTS.md` makes `verify` exit 1.
- **Hook naming drift:** the `.claude/hooks/*` "Madison" strings are now "Snickerdoodle"; behavior unchanged.
- **`.gitignore`:** `.build/` (generated instruction staging) added.
- **`data/ats/` privacy:** `data/ats/.gitignore` added with an ignore-all + allowlist policy — everything private by default; only `portals.example.yml` (and the policy file) allowlisted. `applications.md`/`pipeline.md`/`scan-history.tsv`/`application-patterns-audit.md` are now ignored. `manifest-check` recognizes the nested ignore-all, so the privacy warning clears.
- **CI:** `.github/workflows/verify.yml` now runs `conformance` + `manifest-check` on every push/PR (the manifest check subsumes the old AGENTS/CLAUDE-only drift diff and covers all six generated adapters + canonical existence).

**Open / deferred (human decisions, surfaced as `manifest-check` warnings):**

- Whether `output/`, `reports/generated/`, and `archive/` should be gitignored. `archive/` is likely *intentionally* tracked (no-delete recoverability); `reports/generated/` holds the honest-run report under review. Left to the maintainer.
- `data/ats/application-patterns-audit.md` is **already tracked** from before the new `.gitignore` (gitignore does not untrack). It is currently empty (zero rows) but is generated from private data — run `git rm --cached data/ats/application-patterns-audit.md` to stop tracking it if desired.
- A dedicated pre-commit secret scanner (beyond the gitignore policy) is still not in place.
- Physical removal of `scripts/**/__pycache__/` (already gitignored).

## What Is Already Strong

| Area | Current repo evidence | Assessment |
|---|---|---|
| Canonical agent instructions | `AGENTS.md` is generated from `instructions/`; `CLAUDE.md` imports `AGENTS.md` and adds Claude-specific rules | Strong. This matches the guide's "canonical source + thin adapter" recommendation. |
| Instruction source pipeline | `instructions/manifest.yml`, `instructions/_shared/*.md`, `scripts/build-instructions.mjs` | Strong. Better than hand-maintained duplicated instruction files. |
| Project constitution | `SNICKERDOODLE.md` defines precedence, verification stack, recipe lifecycle, logging, and gates | Strong. This is more rigorous than a generic `PROJECT_RULES.md`. |
| Project/domain map | `DOMAIN.md` describes layout, runnable commands, known gaps, privacy notes, and first win | Strong, though it doubles as both manifest and status file. |
| Runnable command surface | `package.json` exposes `verify`, `doctor`, ATS, resume, scoring, and rendering commands | Strong. Easy for agents and humans to discover. |
| Local verification | `npm run verify` and `npm run doctor` both pass | Strong. Machine conformance is actually executable. |
| Script placement | Maintained automation lives in lowercase `scripts/` with domain subfolders | Strong. Matches repo rules and guide guidance. |
| Safety hooks | `.claude/hooks/archive-guard.sh`, `.claude/hooks/conformance-check.sh` | Good for Claude Code. Needs portable equivalents or documentation for other tools. |
| Recipe lifecycle | 42/42 recipes carry lifecycle frontmatter; doctor reports 518 declared/body TODOs | Strong. Clear current state for recipes. |

Verification run during this audit:

```text
npm run verify
conformance: 108 files (57 md · 30 py · 19 js · 1 yaml · 1 json)
all conform

npm run doctor
environment runnable
42/42 recipes carry lifecycle frontmatter
all recipes are DRAFT
next: promote a recipe past DRAFT with a logged run
```

## Findings

### P1 - Missing Portable Manifest Layer — RESOLVED (2026-06-15)

The guide recommends `_MANIFEST.md` as the first file an agent should read. This repo has `DOMAIN.md`, which performs part of that job, and `instructions/manifest.yml`, which builds instruction files. But there is no root `_MANIFEST.md`, and no `.ai/manifest.yaml` structured twin.

Why it matters: tools that do not know the Mycroft convention will not immediately know which files are canonical, task-relevant, generated, private, or archived. The repo depends on agents reading `AGENTS.md` and then following the instruction to read `SNICKERDOODLE.md` and `DOMAIN.md`.

Recommendation:

- Add `_MANIFEST.md` at the repo root.
- Add `.ai/manifest.yaml` as a machine-readable map.
- Keep both thin and point them to the existing authoritative files instead of duplicating content.

Suggested mapping:

```text
Tier 1: SNICKERDOODLE.md, DOMAIN.md, AGENTS.md, DATA_CONTRACT.md, logs/RUN_LOG.md
Tier 2: docs/, recipes/, scripts/, data/* domain folders, chapters/
Tier 3: output/, node_modules/, __pycache__/, generated reports, private ATS outputs
```

### P1 - No Dedicated `status.md` — RESOLVED (status.md exists; now referenced from _MANIFEST.md)

`DOMAIN.md` contains current gaps and defects, while `logs/RUN_LOG.md` is the ground-truth run history. That works for this repo, but it overloads `DOMAIN.md` with both durable domain definition and current-state tracking.

Why it matters: the guide's session-hygiene pattern depends on a short current-state file that can be read quickly at session start. `DOMAIN.md` is useful, but it is not named as the portable current-state convention and will keep growing if it absorbs every status update.

Recommendation:

- Add root `status.md` as a short current-state index.
- Let it point to `DOMAIN.md` for domain layout and `logs/RUN_LOG.md` for full run history.
- Keep current blockers, latest meaningful changes, active work, and next actions there.

### P1 - No Dedicated `session-handoff.md` — RESOLVED (2026-06-15)

The guide recommends a portable handoff file to replace tool-specific compaction or `/clear` behavior. This repo does not currently have a root `session-handoff.md` or `.ai/sessions/`.

Why it matters: long AI sessions are likely in this repo because it mixes manuscript, data, scripts, recipes, and audits. A handoff file gives the next agent a small, stable resume point without requiring the full conversation history.

Recommendation:

- Add `session-handoff.md` at root for the active session.
- Add `.ai/sessions/` for dated handoff archives if this becomes frequent.
- Include current task, files changed, decisions, verification, and "do not reload" notes.

### P1 - Generated / Transient Boundaries Are Partially Inconsistent — PARTIAL (documented in manifest; .build/ gitignored; output/archive gitignore left to maintainer)

The guide recommends explicit `build/`, `outputs/`, `staging/`, and `archive/` boundaries. This repo currently has `output/`, `logs/`, generated reports beside data, `node_modules/`, and Python `__pycache__/` folders inside `scripts/`.

Observed issues:

- `docs/repo-structure.md` lists `output/`, but the guide's convention is `outputs/`.
- Root `.gitignore` ignores `__pycache__/` and `*.pyc`, but tracked or working-tree cache files are present under `scripts/**/__pycache__/`.
- `node_modules/` exists in the working tree and is ignored by `.gitignore`, but its presence makes broad file exploration noisy for agents.
- There is no root `archive/` convention, even though the instructions say "archive instead of delete."

Recommendation:

- Keep `output/` if that is the established local name, but document it in `_MANIFEST.md` as generated/non-canonical.
- Add root `archive/` or document the "full-copy archive" location referenced by the hooks.
- Remove rebuildable cache files from the working tree when safe.
- Add `.ai/`, `build/`, `staging/`, and `outputs/` to `.gitignore` if those folders are introduced and are intended to be generated/transient.

### P2 - `PROJECT_RULES.md` Role Is Covered But Not Portable By Name — RESOLVED (2026-06-15)

`SNICKERDOODLE.md` plus `DOMAIN.md` are stronger than a generic `PROJECT_RULES.md`. However, tools and future maintainers expecting the guide's convention will not find `PROJECT_RULES.md`.

Recommendation:

- Add a thin `PROJECT_RULES.md` compatibility file that states:
  - `SNICKERDOODLE.md` governs.
  - `DOMAIN.md` contains repo-specific layout and runnable surface.
  - `AGENTS.md` is the generated cross-agent instruction file.
  - `logs/RUN_LOG.md` is the run-history ground truth.

This avoids duplicating rules while preserving cross-tool discoverability.

### P2 - Tool Adapter Coverage Is Incomplete — RESOLVED (Gemini, Aider, Copilot, Cursor generated from instructions/)

The repo has:

- `AGENTS.md`
- `CLAUDE.md`
- `.claude/settings.json`
- Claude hooks

It does not have visible adapters for:

- `GEMINI.md`
- `.cursor/rules/`
- `.github/copilot-instructions.md`
- `.aider.conf.yml`
- `.continue/rules/`
- `.ai/` workflows/schemas

Recommendation:

- Add adapters only for tools actually used.
- Prefer generated adapters from `instructions/` rather than hand-written copies.
- First useful additions: `GEMINI.md` and `.github/copilot-instructions.md` as thin pointers to `AGENTS.md`, plus `.aider.conf.yml` if Aider is used.

### P2 - Claude Hooks Contain Copy/Paste Naming Drift — RESOLVED (2026-06-15)

Both `.claude/hooks/archive-guard.sh` and `.claude/hooks/conformance-check.sh` describe failures as "Madison" conformance/no-delete rules. This is small but misleading in this repo.

Recommendation:

- Rename those user-facing messages to "Snickerdoodle" or "The Reallocation Engine."
- Keep the behavior unchanged.

### P2 - Privacy Boundary Needs Enforcement Beyond Prose — PARTIAL (.ai/manifest.yaml private: block added; data/ats/.gitignore allowlist added; CI verify enforced; pre-commit secret scan pending)

`DOMAIN.md` and `AGENTS.md` correctly warn that `data/ats/`, rendered resumes/PDFs, and `.env*` are private by default. But this appears to be a prose rule rather than a cross-tool guard.

Recommendation:

- Add a machine-readable privacy section to `.ai/manifest.yaml`.
- Add pre-commit or verification checks for sensitive paths if this repo will be shared broadly.
- Consider a `data/ats/.gitignore` policy for generated/private scan outputs, with explicit allowlist exceptions for safe fixtures.

### P3 - Existing CLI-Agnostic Guide Is Present But Not Integrated — RESOLVED (referenced in _MANIFEST.md Tier 2 as design reference, not governing)

`docs/cli-agnostic-ai-tooling-guide.md` exists in the working tree, but current `AGENTS.md`, `DOMAIN.md`, and `docs/repo-structure.md` do not yet point to it as a design reference.

Recommendation:

- If the guide is intended to be canonical, add it to `_MANIFEST.md` Tier 2 and reference it from `docs/README.md`.
- If it is research/background only, mark it that way so agents do not treat it as governing instructions.

### P3 - Dirty Working Tree Should Be Resolved Before Structural Changes — ADVISORY (review/commit before broad restructuring)

At audit time, `git status --short` reported existing modified/untracked files:

```text
 M DOMAIN.md
 M logs/RUN_LOG.md
 M package.json
?? data/examples/
?? docs/cli-agnostic-ai-tooling-guide.md
?? scripts/score/
```

Recommendation:

- Do not perform broad restructuring until these changes are reviewed or committed.
- Treat this report as advisory until the working tree is stabilized.

## Recommended Implementation Plan

### Phase 1 - Add Portable Compatibility Files

Create thin files that point to the existing source of truth:

```text
_MANIFEST.md
PROJECT_RULES.md
status.md
session-handoff.md
.ai/manifest.yaml
```

Do not move existing content yet. The goal is discoverability, not churn.

### Phase 2 - Generate Tool Adapters

Extend `instructions/manifest.yml` and `scripts/build-instructions.mjs` to support optional targets:

```text
GEMINI.md
.github/copilot-instructions.md
.cursor/rules/reallocation-engine.mdc
.aider.conf.yml
```

Only generate adapters for tools the project actually uses.

### Phase 3 - Tighten Generated/Private Boundaries

- Decide whether the canonical generated-output folder is `output/` or `outputs/`.
- Add or document `archive/`.
- Clean rebuildable `__pycache__/` files.
- Add privacy checks for `data/ats/`, rendered resumes/PDFs, and `.env*`.

### Phase 4 - Make The Manifest Enforceable

Once `.ai/manifest.yaml` exists, teach `scripts/doctor.mjs` or a new audit script to check:

- Tier 1 files exist.
- ignored/generated folders are documented in `.gitignore`.
- private folders have clear commit rules.
- adapter files match generated instruction source.
- `DOMAIN.md`, `_MANIFEST.md`, and `.ai/manifest.yaml` do not contradict each other.

## Proposed File Semantics

| File | Purpose in this repo |
|---|---|
| `SNICKERDOODLE.md` | Constitution and precedence root. |
| `DOMAIN.md` | Repo-specific domain map and runnable surface. |
| `AGENTS.md` | Generated cross-agent operational instructions. |
| `CLAUDE.md` | Claude-specific adapter. |
| `_MANIFEST.md` | Portable read-first context map. |
| `PROJECT_RULES.md` | Thin compatibility pointer to `SNICKERDOODLE.md` / `DOMAIN.md`. |
| `status.md` | Short current-state dashboard. |
| `session-handoff.md` | Current session continuation file. |
| `.ai/manifest.yaml` | Machine-readable project map and policy hints. |
| `logs/RUN_LOG.md` | Ground-truth run history. |

## Suggested `_MANIFEST.md` Skeleton

```markdown
# _MANIFEST.md - read this first

## Tier 1 - Canonical
| File | Purpose |
|---|---|
| SNICKERDOODLE.md | Constitution and precedence root |
| DOMAIN.md | Current repo layout, runnable commands, known gaps |
| AGENTS.md | Generated cross-agent instructions |
| DATA_CONTRACT.md | Data contract |
| status.md | Current state dashboard |
| logs/RUN_LOG.md | Ground-truth run history |

## Tier 2 - Task Relevant
| Path | Use when |
|---|---|
| docs/ | System documentation |
| recipes/ | Agent-facing operating recipes |
| scripts/ | Maintained automation |
| data/ | Local verified/source data; follow privacy rules |
| chapters/ | Manuscript work |

## Tier 3 - Ignore Unless Requested
| Path | Rule |
|---|---|
| output/ | Generated deliverables; not source |
| node_modules/ | Dependency install; never read broadly |
| **/__pycache__/ | Rebuildable cache |
| data/ats/ | Private by default; read only when task requires it |
```

## Bottom Line

The repo's Snickerdoodle architecture is good. The missing piece is a small compatibility layer that lets any CLI, agent, or human immediately see the same map without knowing the Mycroft vocabulary first.

Best next action: add `_MANIFEST.md`, `PROJECT_RULES.md`, `status.md`, `session-handoff.md`, and `.ai/manifest.yaml` as thin indexes over the existing system, then wire `doctor` to check them.
