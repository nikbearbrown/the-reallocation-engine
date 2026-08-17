# CLI-Agnostic AI Tooling — Repo Grade

**Repository:** `the-reallocation-engine`
**Graded against:** *CLI-Agnostic AI Tooling for Local Project Workflows* — **v1.0 (June 2026)** (the 23-section edition)
**Grade date:** 2026-06-15
**Basis:** repo inspection + the local `conformance` / `doctor` / `manifest-check` gates.

## Overall: **A (≈ 94 / 100)** — was A− before the §19 harness

This repo is in the top decile of agent-facing repositories. It does not merely *follow* the guide — it independently implements the guide's **strongest** recommendations: compile-level instruction generation (§6's level 3), the PreToolUse no-delete hook (§11's "strongest pattern observed"), the manifest + machine-readable twin (§4), and sample-in/full-out data with a size guard (§21). The constitution (`SNICKERDOODLE.md`) is more rigorous than the generic `PROJECT_RULES.md` the guide assumes.

The one material gap the earlier grade flagged — **no outcome-measurement harness (§19)** — is now closed in scaffolding: `eval/` provides the task suite, deterministic scorer, and config-comparison report. What keeps it from A+ is that the harness has only been exercised on *example* runs, not real cross-tool data, plus a few minor enforcement niceties (pre-commit secret scan, network-allowlist enforcement).

## Section scorecard

| § | Area | Grade | Evidence / gap |
|---|------|-------|----------------|
| 3 | Directory architecture | A− | Clean canonical/transient split; `archive/`, `output/`, `reports/generated/`, `data/` domain dirs; folder-as-metadata. Uses `output/` (singular) and lacks `src/current/staging/` — acceptable for a book+pipeline repo, but document the naming in `_MANIFEST.md` (done). |
| 4 | Manifest pattern | A | `_MANIFEST.md` (tiered) **and** `.ai/manifest.yaml` twin with `invariants` + `permissions`. |
| 5 | Project rules & precedence | **A+** | `SNICKERDOODLE.md` constitution with explicit precedence + `PROJECT_RULES.md` shim. Exceeds the guide. |
| 6 | One folder, many surfaces | **A+** | **Compile level** (the guide's strongest tier): `instructions/_shared/*` + `manifest.yml` + `build-instructions.mjs` generate `AGENTS.md`, `CLAUDE.md`, `.gemini/settings.json`, `.aider.conf.yml`, `.github/copilot-instructions.md`, `.cursor/*.mdc` — all with GENERATED headers + a CI drift check. |
| 7 | Ignore files / Tier-3 | B | `.gitignore` + nested `data/ats/.gitignore` ignore-all-allowlist. No per-tool ignore files (`.cursorignore`, `.aiderignore`) — low priority since the adapters are pointers, but absent. |
| 8 | Token optimization | A | `CLAUDE.md` is 10 lines (`@import`); generated files concise; instructions modular. |
| 9 | Session hygiene & state | A− | `status.md` (YAML frontmatter + prose) and `session-handoff.md` match the templates. No `_PROJECT_INDEX.md` — a workspace-level file, ~N/A for a single bounded repo. |
| 10 | Agent patterns | A | Gates (P4), `subagent-scoping.md`, conformance/adequacy split, validator discipline, plan-mode rule in `CLAUDE.md`. |
| 11 | File safety | **A+** | `no-delete.md` + `.claude/hooks/archive-guard.sh` PreToolUse hook denying `rm` of non-rebuildables — *exactly* the guide's recommended enforcement. Git as durable checkpoint. |
| 12 | Governance & security | B+ | `permissions` block (`filesystem_scope`, `forbidden`), private-path policy, `logs/RUN_LOG.md` audit. Network allowlist is documented, not enforced; no dedicated pre-commit secret scanner; no MCP servers in play. |
| 13 | Templates & skills | A− | Shared instruction modules + recipes-as-skills + size discipline (CLAUDE.md < 200 lines). No top-level `templates/` dir. |
| 14 | Tool comparison / portability | A | Portable filesystem layer + generated adapters for the matrix tools. |
| 15 | Claude-specific mechanisms | A | Hooks, `.claude/settings.json`, `@import`, lazy subdir loading respected. |
| 16 | Building CLI tools | A− | Scripts use flags, exit codes, stdout/stderr split, `--strict` / `--promote`. Not formally audited against clig.dev, but the instincts are right. |
| 17 | Anti-patterns | A | Avoids all listed: bounded project, archive separated, tiny global memory, generated≠source. |
| 18 | Failure-mode catalog | A | `manifest-check.mjs` enforces against drift, missing canonical files, stale/contradicting manifests. |
| 19 | Does it help? / measurement | **B (was D+)** | **Harness now built** (`eval/`): fixed 5-task suite, config matrix (full / manifest-only / baseline), a functional deterministic scorer (`eval:score` — out-of-scope edits, deletes, forbidden ops, diff size, validate-pass) and aggregator (`eval:report` → `results/scorecard.md`). Proven on example runs: `full` beats `baseline` on every axis. Remaining for an A: execute real cross-tool/cross-config runs and use them to prune (agent execution is necessarily manual — needs each tool + API access). |
| 20 | Build order | A | Effectively followed the recommended order. |
| 21 | Data / large files | A | `DATA.md`, sample-in/full-out, `.githooks/pre-commit` size guard (50 MB), `scripts/gitignore-large.sh` sweep, large-files block in `.gitignore`. Only nit: the hook is opt-in via `git config core.hooksPath .githooks` — which the guide itself flags as the expected gotcha. |

## What's genuinely excellent (exceeds the guide)

- **Compilation over bridging (§6).** Most repos stop at a symlink or `@import`. This one keeps a single *content source* and treats every vendor file as a build output, with a CI drift guard. That is the guide's top-tier recommendation, implemented.
- **Enforcement, not just advice (§11).** The no-delete rule is a deterministic PreToolUse hook, not a hopeful sentence in `CLAUDE.md`. Same spirit in `manifest-check` (drift fails `verify`) and the conformance gate.
- **The constitution (§5).** `SNICKERDOODLE.md`'s eight principles + verification stack + recipe lifecycle are stronger than anything the guide prescribes.

## To reach A / A+ (ranked by leverage)

1. **Add a measurement harness (§19).** The one thing standing between this repo and an A. Build the guide's portable mini-benchmark: a fixed task suite (repo summary, narrow bug fix, multi-file feature, test repair, security-sensitive change) run across configs, recording acceptance rate, manual-edit count, token cost, and risky behavior. Then *use* it to prune rules that don't earn their tokens.
2. **Enforce the privacy/governance layer (§12).** A pre-commit secret scan (beyond gitignore) and an actual network-allowlist guard, not just the documented `permissions` block.
3. **Activate the size guard by default (§21).** Document `git config core.hooksPath .githooks` in setup (or check it in `doctor`), so the pre-commit guard runs for everyone rather than opt-in.
4. **Resolve the generated-dir gitignore calls (§3/§7)** that `manifest-check` surfaces as warnings: decide `output/`, `reports/generated/`, `archive/` (likely keep `archive/` tracked for no-delete recoverability).
5. **Minor:** add per-tool ignore files if Cursor/Aider are used heavily; add a top-level `templates/` if reusable output skeletons emerge.

## Bottom line

The hard, high-leverage parts — portable compiled instructions, deterministic safety enforcement, a maintained manifest, disciplined data handling — are **done and verified**. The repo's weakness is the same one the guide spends §19 warning about: it has never *measured* whether the instruction scaffolding actually improves outcomes. Close that, and this is a reference implementation.
