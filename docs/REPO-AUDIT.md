# Repo Audit — *The Reallocation Engine* vs. the CLI-Agnostic AI Tooling Guide

**Audited:** June 14, 2026. **Rubric:** `docs/cli-agnostic-ai-tooling-guide.md` (§ references below point to it). **Method:** structural inspection of instruction files, hooks, manifest/index, hygiene, and git state.

## Verdict

**Strong — roughly an A‑.** This repo is closer to a *reference implementation* of the guide than to a thing that needs fixing. Two mechanisms here are **better than the guide recommends**: instruction files are *compiled* from shared modules (not just symlinked/imported), and the never-delete rule is *enforced by a hook* (not just stated). The real gaps are three: no `status.md`, root-level clutter with a probable stale duplicate, and no read-exclusion for private data.

---

## What's exemplary (keep doing this)

**Single source of truth + generated adapters — exceeds §14.** `AGENTS.md` and `CLAUDE.md` both carry a `GENERATED FILE — do not edit by hand` header and are built by `scripts/build-instructions.mjs` from `instructions/_shared/*.md` modules + `instructions/reallocation-engine.md`, driven by `instructions/manifest.yml`. `CLAUDE.md` is a true thin shim (`@AGENTS.md` + `@SNICKERDOODLE.md` + two Claude-specific lines). The guide's §14 tops out at "symlink or `@import`"; this repo *compiles* the adapters from shared modules, which kills drift entirely. This is the gold-standard version of "instructions as code" (§5).

**Precedence stated explicitly — §5.** `SNICKERDOODLE.md` is declared the constitution that "governs in full"; `AGENTS.md` says any conflict with it "is a bug — log it." That's the explicit precedence declaration §5 asks for, and it's unambiguous.

**Never-delete is enforced, not advised — exceeds §9 + §16.** `.claude/hooks/archive-guard.sh` is a `PreToolUse(Bash)` hook that *denies* `rm` of anything that isn't a rebuildable (`.build`, `__pycache__`, `*.pyc`, `*.bak`). The guide (§9) only recommends archive-not-delete as instruction text and notes (§16) that hooks can enforce deterministically — this repo actually did it.

**Runnable verification gate — §8.** A `Stop` hook runs `conformance-check.sh`; `npm run verify` / `scripts/conformance.mjs` gate "done." The "machines verify conformance, humans verify adequacy" split is exactly the builder-validator + give-the-agent-a-runnable-check pattern.

**Index/manifest present — §4.** `DOMAIN.md` is a genuine project index: a layout table plus a "Runnable today (verified command surface)" section. Pairs with `SNICKERDOODLE.md` as the constitution.

**Subagent scoping, audit log, human/machine split, gitignore hygiene.** AGENTS.md explicitly scopes subagents (§8); `logs/RUN_LOG.md` is the audit trail (§20); "JSON/YAML are source of truth, render Markdown for humans" mirrors the `.ai/`-vs-prose split (§4); `.gitignore` covers `node_modules/`, build artifacts, `.env`, and large data dumps, and `node_modules` is untracked (§3). `chapters/` holds clean numbered canonical files with a "no scripts or data in here" rule.

---

## Gaps, ranked by payoff

### 1. No `status.md` — the one clear miss (§7)
There is `logs/RUN_LOG.md` (append-only *history*) and `DOMAIN.md` (static *layout*), but no single "where are we right now / what's next" file. The guide makes `status.md` central to session hygiene precisely so an agent doesn't reconstruct current state from history every session. **Fix:** add a `status.md` (YAML frontmatter + prose, per §17) updated at end-of-session. Low effort, high recurring payoff.

### 2. Root clutter + a probable stale duplicate (§2, §3, §12)
64 top-level entries (28 files, 36 dirs). Two specific risks:

- **`TIKTOK.md` (100 KB) vs `TIKTOC.md` (28 KB)** — near-identical names, *different* content ("Tik TOC Architecture" vs "Tik TOC — A Practitioner's Guide"). This is the textbook §2/§12 "current-vs-draft confusion": an agent told to "update the TOC doc" can easily grab the wrong 100 KB file. **Fix:** disambiguate names or move into a folder; if one is stale, archive it.
- **Process docs mixed with canonical at root** — `RESTRUCTURE-PLAN.md`, `CHAPTER-RESEARCH-MAP.md` sit beside canonical `book.md` / `outline.md` / `SNICKERDOODLE.md`. The guide's static-vs-dynamic split (§3) would put planning/process docs under `docs/` or a `process/` area. **Also:** `LICENSE` and `LICENSE.md` are duplicate licenses.

### 3. No read-exclusion for private data (§15, §20)
`DOMAIN.md` marks `data/ats/` "**private by default**, review before commit," and the `archive-guard` hook prevents *deleting* it — but nothing prevents an agent from *reading* it into context. The guide (§15) notes `.gitignore` ≠ AI-context exclusion, and (§20) that private data is a governance surface. **Fix:** add a read-guard (a `PreToolUse(Read/Bash)` hook that blocks reads under `data/ats/` unless explicitly approved), since this repo's own rules already treat that path as sensitive.

### 4. `DOMAIN.md` isn't tiered (§4) — minor
It's a good index but lists layout flatly rather than as a Tier‑1/2/3 read-priority map ("always read X; ignore Y unless asked"). Adding tiering would make "what do I load first" explicit for any tool, not just a human reading the table.

### 5. Documented stale pointers (§6, §19) — already flagged, worth closing
`DOMAIN.md` honestly notes that recipes reference `data/raw/`, `data/verified/`, `logs/gate-decisions/` which "do not exist yet." Transparency is good, but those recipe references are latent inconsistencies an agent may act on. **Fix:** either create the dirs or update the recipes so no instruction points at a non-existent path.

### 6. Uncommitted work = no checkpoint (§9) — housekeeping
Git shows `DOMAIN.md`, `logs/RUN_LOG.md`, `package.json` modified and `data/examples/`, `scripts/score/`, `docs/cli-agnostic-ai-tooling-guide.md` untracked. The guide treats git commits as the durable checkpoint layer; uncommitted state means no recoverable checkpoint. **Fix:** commit at a meaningful boundary.

### 7. Vestigial dirs — cosmetic
`working/` is empty and `output/` holds one file; naming diverges from the guide's `staging/`/`outputs/`. Harmless, but either adopt them or remove them so the tree stays self-describing.

---

## Scorecard

| Guide area | Status |
|---|---|
| §3 Directory architecture | ✅ good, with root clutter to trim |
| §4 Manifest/index | ✅ `DOMAIN.md` present; not tiered |
| §5 Instruction files + precedence | ✅✅ exceeds (compiled from modules) |
| §6 Token/context discipline | ✅ markdown/machine split; no `.ai/` but equivalent |
| §7 Session hygiene | ⚠️ **no `status.md`** |
| §8 Builder-validator / verification | ✅✅ Stop-hook conformance gate |
| §9 File safety / never-delete | ✅✅ enforced by hook |
| §14 One folder, many surfaces | ✅✅ generated adapters |
| §15 Ignore / private-data exclusion | ⚠️ no read-guard for `data/ats/` |
| §20 Governance / audit | ✅ RUN_LOG; private-by-default data |

## Top three actions

1. Add a `status.md` (current state + next actions).
2. Resolve `TIKTOK.md` vs `TIKTOC.md` and move process docs (`RESTRUCTURE-PLAN.md`, `CHAPTER-RESEARCH-MAP.md`) out of root; drop the duplicate `LICENSE.md`.
3. Add a read-guard hook for `data/ats/` to match the repo's own "private by default" rule.
