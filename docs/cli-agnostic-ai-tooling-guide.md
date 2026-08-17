# CLI-Agnostic AI Tooling for Local Project Workflows

*A practical, cited guide to running AI coding, writing, and research agents on local files — across Claude Code, Claude Cowork, Cursor, Aider, OpenAI Codex CLI, Gemini CLI, Continue, Cline, GitHub Copilot, and MCP-based custom agents.*

**Version 1.0 · June 2026.** Built from multi-source vendor documentation and primary research, with adversarial verification of every load-bearing claim. Tool-specific details (especially product status and exact thresholds) change fast — re-verify anything you'll depend on.

**License:** CC BY 4.0 — free to share and adapt with attribution. *(Change this line to whatever terms you prefer before distributing.)*

### How to use this guide

If you want the short version, read the Executive Summary (§1) and copy the templates in §4, §5, and §9. If you're standardizing a team or a large multi-project workspace, read it front to back — the order moves from *why* (the problem) through *what* (architecture, instructions, context) to *how* (patterns, safety, governance) and *reference* (tool comparison, anti-patterns, build order). Everything copy-pasteable is in a fenced block.

### Label key — every claim is tagged by source confidence

- **[OFFICIAL]** — stated in a vendor's own documentation or a published spec.
- **[CONVENTION]** — established community practice or a widely-cited practitioner write-up.
- **[INFERRED]** — best practice reasoned from the evidence, not stated verbatim anywhere.
- **[TOOL]** — behavior specific to one named tool; may not generalize.
- **[AGNOSTIC]** — a recommendation designed to hold across tools.

### Contents

1. [Executive Summary](#1-executive-summary)
2. [The Core Problem](#2-the-core-problem)
3. [Directory Architecture](#3-directory-architecture)
4. [The Manifest Pattern](#4-the-manifest-pattern)
5. [Project Rules and Instruction Precedence](#5-project-rules-and-instruction-precedence)
6. [One Folder, Many Surfaces](#6-one-folder-many-surfaces)
7. [Ignore Files and Tier-3 Enforcement](#7-ignore-files-and-tier-3-enforcement)
8. [Context and Token Optimization](#8-context-and-token-optimization)
9. [Session Hygiene and State Files](#9-session-hygiene-and-state-files)
10. [Tool-Agnostic Agent Patterns](#10-tool-agnostic-agent-patterns)
11. [File Safety and Destructive Actions](#11-file-safety-and-destructive-actions)
12. [Governance and Security](#12-governance-and-security)
13. [Templates and Reusable Skills](#13-templates-and-reusable-skills)
14. [Tool Comparison and Portability](#14-tool-comparison-and-portability)
15. [Claude/Anthropic-Specific Mechanisms](#15-claudeanthropic-specific-mechanisms)
16. [Building CLI Tools Agents Will Call](#16-building-cli-tools-agents-will-call)
17. [Anti-Patterns](#17-anti-patterns)
18. [Failure-Mode Catalog](#18-failure-mode-catalog)
19. [Does Any of This Actually Help?](#19-does-any-of-this-actually-help)
20. [Implementation: Build Order](#20-implementation-build-order)
21. [Data, Large Files, and Repo Size](#21-data-large-files-and-repo-size)
22. [Open Questions and Caveats](#22-open-questions-and-caveats)
23. [Sources](#23-sources)

---

## 1. Executive Summary

AI agents working on a local folder do not begin with your mental model of which files matter. They infer it — from folder names, file names, timestamps, and whatever instruction file the tool happens to load. When that inference is wrong, three failures recur: the agent reads the wrong (or archived) file as canonical, it reads too broadly and burns its finite "attention budget," and over a long session it accumulates stale context that quietly degrades output quality. None of these are model-stupidity problems. They are *context* problems, and they are solvable with structure.

The research converges on one principle, stated most directly by Anthropic: an agent has a finite attention budget because transformer attention is n² over tokens, so every token you load dilutes the model's ability to reason about every other token **[OFFICIAL]** ([Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Independent research ("context rot") confirms that *all* frontier models degrade as input grows — even on trivial tasks, and even faster when irrelevant or topically-similar "distractor" content is present **[OFFICIAL]** ([Chroma: Context Rot](https://www.trychroma.com/research/context-rot)).

The cross-tool answer is **curated, just-in-time context backed by a clean, self-describing directory structure**: a small canonical index loaded up front, folders that separate current from archived from generated, explicit rules about what is canonical, and session hygiene that prevents accumulation. Every major tool implements some version of this — a memory/instruction file (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursor/rules`), some form of compaction, and some checkpoint/diff safety layer — but **the precedence models, compaction commands, and safety guarantees genuinely differ between tools.** So the durable strategy is to encode your intent in plain files you control, state precedence explicitly, and treat each tool as a replaceable adapter over the filesystem rather than depending on any one vendor's defaults.

The single sentence to take away: **treat the filesystem as the durable, tool-agnostic operating system for AI work, and every CLI, desktop agent, or automation pipeline as an adapter that reads from and writes to it.**

---

## 2. The Core Problem

**Agents lack an innate sense of which files are canonical.** They use folder hierarchy, naming conventions, and timestamps as signals — a file named `test_utils.py` in `tests/` implies a different purpose than the same name in `src/core_logic/` **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). This cuts both ways: good structure helps the agent; messy structure (old drafts beside current ones) actively misleads it.

**They read too broadly, and breadth has a cost.** The finite-attention-budget framing means reading a whole folder is not free even if it "fits" **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). On the LongMemEval benchmark, every model family scored far higher on a focused ~300-token prompt than on the same question embedded in a ~113k-token context **[OFFICIAL]** ([Chroma](https://www.trychroma.com/research/context-rot)).

**They confuse current drafts with archived ones.** This is a documented failure mode — "context pollution," where the window fills with material irrelevant to the task and signal-to-noise drops **[CONVENTION]** ([Liip: Preventing context pollution](https://www.liip.ch/en/blog/preventing-context-pollution-for-ai-agents)). Staleness is named as a distinct failure requiring "recency ranking," with a recommended pattern of marking superseded facts "superseded, not deleted" so old versions don't pollute retrieval **[CONVENTION]** ([Chris Lema: AI context failures](https://chrislema.com/ai-context-failures-nine-ways-your-ai-agent-breaks)).

**Long sessions accumulate stale context and degrade quality.** "Context rot" is the empirically-measured continuous decline in reliability as tokens accumulate — not a hard cliff at the window limit, but a gradual slide **[OFFICIAL]** ([Chroma](https://www.trychroma.com/research/context-rot)). A single distractor measurably hurts; four hurt more **[OFFICIAL]** ([Chroma](https://www.trychroma.com/research/context-rot)).

**Tool outputs, logs, and connector results are hidden context costs.** MCP tool schemas are a standing per-turn cost: names, descriptions, and parameters are injected on *every* turn before the user even speaks. Reported examples run from ~30k–60k tokens (5 servers × 30 tools) to ~143k of a 200k window (72%) for ~40 tools across several servers **[OFFICIAL]** framing ([Anthropic: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)) + **[CONVENTION]** figures ([Apideck](https://www.apideck.com/blog/mcp-server-eating-context-window-cli-alternative)). The percentages vary by deployment; the robust, vendor-backed claim is qualitative — *tool schemas are an always-on fixed cost.*

**Verified vendor behavior vs. community practice.** What is verified: the attention-budget/context-rot phenomenon (Anthropic, Chroma), that CLAUDE.md loads every session (Anthropic), that MCP schemas load every turn (Anthropic), and each tool's specific compaction commands (their docs). What is community practice: the specific token figures people report for bloated config files, the exact auto-compaction thresholds practitioners reverse-engineer, and most "archive-don't-delete" file-hygiene rules — sensible and widely held, but not vendor-mandated.

---

## 3. Directory Architecture

The goal is a structure where **the agent can tell canonical from transient without being told** — because folder names *are* metadata it reads **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). A widely-cited practitioner pattern separates product knowledge, operations, and code into top-level directories so "agents reach the right context faster and hallucinate less... they don't have to guess where things are" **[CONVENTION]** ([Three directories that make your project AI-agent-friendly](https://zjor.medium.com/three-directories-that-make-your-project-ai-agent-friendly-a243933e808c)). The key move is splitting a *static* reference snapshot from a *dynamic* working area — that's what prevents archived-vs-current confusion **[CONVENTION]**.

### Recommended structure

```text
/workspace/
├── _shared/                  # cross-project, loaded rarely and deliberately
│   ├── _system/              # global agent instructions (your house style)
│   ├── _context/             # facts true for ALL projects
│   ├── templates/            # reusable output skeletons
│   └── skills/               # reusable procedures (steps + checks)
├── _PROJECT_INDEX.md         # which projects are live / paused / done (§9)
│
├── project-a/
│   ├── AGENTS.md             # canonical instruction source (see §6)
│   ├── _MANIFEST.md          # READ FIRST: human/LLM map of what to read / ignore
│   ├── PROJECT_RULES.md      # project-specific rules + precedence statement
│   ├── status.md             # current state, latest decisions, next actions
│   ├── session-handoff.md    # written at end-of-session for the next one (§9)
│   ├── .ai/                  # machine-readable layer for scripts/CI/validators
│   │   ├── manifest.yaml     #   structured twin of _MANIFEST.md (§4)
│   │   ├── workflows/        #   reusable procedure definitions
│   │   ├── schemas/          #   task-brief / output schemas
│   │   ├── sessions/         #   session notes/handoffs
│   │   └── audit/            #   logged decisions + file changes
│   ├── src/                  # canonical source the project is built FROM
│   ├── current/              # active drafts being edited right now
│   ├── research/             # inputs/evidence (split current/ vs archive/)
│   ├── templates/            # project-specific output skeletons
│   ├── staging/              # drafts awaiting validation before promotion
│   ├── build/                # generated intermediates — NOT source of truth
│   ├── outputs/              # finished deliverables — NOT working source
│   └── archive/              # superseded files — ignored unless asked
│
└── project-b/
```

### Why each folder exists — and what must *not* go there

| Folder | Exists to… | Do NOT put here |
|---|---|---|
| `_shared/` | Hold things true across every project so they live in one place | Anything specific to one project |
| `_shared/_system/` | Your global, tool-agnostic agent instructions | Long reference docs (bloats every session — see §8) |
| `_MANIFEST.md` | Tell the agent what is canonical and what to ignore | Actual content — it's an index, not a document |
| `PROJECT_RULES.md` | State project rules *and* precedence explicitly | Transient status (that's `status.md`) |
| `status.md` | Be the single place "what's the current state?" is answered | Permanent rules; archived decisions |
| `src/` | Canonical source the deliverable is built from | Generated output; old drafts |
| `current/` | The drafts actively being worked | Anything superseded (move to `archive/`) |
| `research/` | Evidence and inputs, split `current/` vs `archive/` | Final deliverables |
| `staging/` | Hold drafts until validated, then promote to `outputs/` | Anything canonical or already-approved |
| `.ai/` | Give scripts/CI/validators a structured, parseable layer | Prose meant for humans (that's the Markdown files) |
| `build/` | Regenerable intermediates | Anything you can't recreate from `src/` |
| `outputs/` | Finished, promoted deliverables | Working drafts treated as source |
| `archive/` | Preserve superseded work recoverably | Anything you want the agent to read by default |

**One folder per bounded project.** Mixing unrelated projects under one parent forces the agent to read across boundaries it cannot see. Where you genuinely need cross-project work, prefer multi-root workspaces (Cursor, VS Code) over a giant monorepo — multi-root lets one agent operate across separate folders while keeping each bounded **[CONVENTION]** ([Augment: monorepo vs multi-repo](https://www.augmentcode.com/tools/monorepo-vs-multi-repo-ai-architecture-based-ai-tool-selection)). Monorepos give one canonical instruction set but hit "a hard wall" when relevant code exceeds the context window **[CONVENTION]** ([Coding agents & the monorepo context window](https://tianpan.co/blog/2026-04-17-coding-agents-monorepo-context-window)).

**`.gitignore` the generated layers.** Keep `build/` and other machine-generated artifacts out of version control and out of the agent's default working set, so diffs stay clean and checkpoints stay meaningful **[AGNOSTIC]** / **[OFFICIAL (git)]** ([git docs](https://git-scm.com/docs/gitignore)). Nested `.gitignore` files scope exclusions per-subdirectory, paralleling per-directory rule files **[OFFICIAL]** ([Atlassian](https://www.atlassian.com/git/tutorials/saving-changes/gitignore)).

> **Caveat:** the exact folder names here are a recommendation, not a standard — assembled from Anthropic's progressive-disclosure model and practitioner directory advice. No single tool ships this tree. The *principles* (separate canonical from transient; folder names as metadata; just-in-time loading) are vendor-backed; the names are yours to choose. Adapt them, but keep the separations.

---

## 4. The Manifest Pattern

A manifest is the file that tells the agent what to read first and what to ignore. **Is it a native feature or a convention? Both, depending on the tool.**

- **Native, shipping implementations of "read this first, fetch the rest on demand":**
  - Anthropic **Skills** use `SKILL.md` as an entry point with three explicit loading levels — metadata always loaded (~100 tokens), the body loaded when triggered (<5k tokens), bundled resources loaded only on access. Anthropic's own analogy is "a well-organized manual that starts with a table of contents, then specific chapters, and finally a detailed appendix" **[OFFICIAL]** ([Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview); [blog](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills)).
  - Claude Code **auto-memory** uses `MEMORY.md` as "a concise index, loaded into every session" (first 200 lines / 25KB), with detail pushed to topic files read on demand **[OFFICIAL]** ([Claude Code memory](https://code.claude.com/docs/en/memory)).
  - **Aider's repo map** is an automated manifest: a tree-sitter-built list of files + key signatures, graph-ranked (PageRank-style) and fit to a token budget, that doubles as a navigation index the model uses to decide what to read next **[OFFICIAL]** ([Aider repo map](https://aider.chat/docs/repomap.html)).
- **Cross-vendor standard:** `AGENTS.md` — a "README for agents," now stewarded by the Agentic AI Foundation (Linux Foundation), read by 20+ tools **[OFFICIAL]** ([agents.md](https://agents.md/)).
- **Pure convention / inferred:** `llms.txt` as an LLM-facing link manifest **[CONVENTION]** ([Mastra](https://mastra.ai/blog/how-to-structure-projects-for-ai-agents-and-llms)); Cline's Memory Bank `projectbrief.md` as an index **[CONVENTION]** ([Cline memory bank](https://github.com/cline/prompts/blob/main/.clinerules/memory-bank.md)); the tiered `_MANIFEST.md` below.

**One caution from Anthropic:** static indexes can go stale. Claude Code deliberately uses a hybrid — load CLAUDE.md up front, but use glob/grep to retrieve files just-in-time, "effectively bypassing the issues of stale indexing" **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). **A manifest is high-leverage only if you maintain it.** An out-of-date manifest is worse than none, because the agent trusts it. Update it at end-of-session whenever canonical files change (§9), and keep it short — it is an index, not a document.

### Template: `_MANIFEST.md` (human-readable)

```markdown
# _MANIFEST.md — read this first

> This file maps what to read and what to ignore. If it conflicts with what
> you find on disk, trust this file and flag the discrepancy.

## Tier 1 — Canonical (always read first)
| File | Purpose |
|------|---------|
| PROJECT_RULES.md | Project-specific rules and precedence |
| status.md | Current state, latest decisions, next actions |
| outline.md | Source of truth for structure |

## Tier 2 — Task-Relevant (load only when the task needs it)
| Folder | Use when |
|--------|----------|
| current/ | Editing active source material |
| research/current/ | Checking live research/evidence |
| templates/ | Producing a repeatable output |

## Tier 3 — Archive / Generated (ignore unless explicitly requested)
| Folder | Rule |
|--------|------|
| archive/ | Ignore unless I explicitly ask |
| build/ | Generated; never a source of truth |
| outputs/ | Finished deliverables; not working source |

_Last updated: YYYY-MM-DD — update whenever Tier 1 files change._
```

### Template: `.ai/manifest.yaml` (machine-readable twin)

`_MANIFEST.md` is for humans and the LLM; a structured twin lets scripts, CI, and validators act on the same map without parsing prose. Keep both in sync (or generate one from the other). No tool standardizes this — it's a portability layer you own **[INFERRED]**.

```yaml
name: project-alpha
canonical: [PROJECT_RULES.md, status.md, outline.md]
task_relevant: [current/, research/current/, templates/]
ignore: [archive/, build/, outputs/]
entrypoints: { build: "make build", test: "make test" }
invariants:
  - "Never treat outputs/ or build/ as source."
  - "Move superseded files to archive/, never delete."
permissions:
  filesystem_scope: workspace-only
  network_allowlist: ["registry.npmjs.org"]
  forbidden: ["rm -rf", "git push --force"]
```

The `permissions` block is doubly useful: it documents intent for humans *and* can be read by a wrapper/hook that actually enforces the allowlist (§12).

---

## 5. Project Rules and Instruction Precedence

Treat these files as **"instructions as code"**: repo-stored, version-controlled, reviewed in PRs, and maintained like operational code rather than throwaway prose. That framing is the thesis behind the whole architecture — and it carries an obligation (§19): if they're code, they get *measured and pruned*, not just accumulated.

Different tools load persistent instructions from different files, and — critically — **resolve conflicts using different models.** Two dominant models, and they genuinely differ:

1. **Scoped layering** (enterprise/managed > project > user, or personal > repo > org): Cursor Team Rules, GitHub Copilot, Claude Code's managed policy.
2. **Nearest-file-wins concatenation** (deeper/closer directory overrides): AGENTS.md spec, Codex CLI, Gemini CLI, Claude Code's directory walk.

Several tools blend both **[INFERRED, synthesized across vendor docs]**.

### Where each tool's instructions live

| Tool | Instruction file(s) | Conflict / precedence rule | Source |
|---|---|---|---|
| **Claude Code** | `CLAUDE.md` (managed → user `~/.claude/` → project → `CLAUDE.local.md`); `.claude/rules/*.md` | All discovered files concatenated, root→cwd; closer-to-launch read last and effectively wins; managed policy loads first and can't be excluded | [OFFICIAL](https://code.claude.com/docs/en/memory) |
| **AGENTS.md (standard)** | `AGENTS.md`, nested | "Closest AGENTS.md to the edited file wins; explicit chat prompts override everything." No scope-layering defined | [OFFICIAL](https://agents.md/) |
| **Codex CLI** | `AGENTS.md` (+ `AGENTS.override.md`), `~/.codex/config.toml` | Concatenate git-root→cwd; closer files appear later and override; `.override.md` replaces that level; stops at `project_doc_max_bytes` (32 KiB default) | [OFFICIAL](https://developers.openai.com/codex/guides/agents-md) |
| **Cursor** | `.cursor/rules/` (`.mdc`/`.md`), `.cursorrules` (legacy), User Rules, `AGENTS.md` | **Team → Project → User**; all merged, earlier sources win on conflict | [OFFICIAL](https://cursor.com/docs/rules.md) |
| **Gemini CLI** | `GEMINI.md` (global `~/.gemini/` → workspace → just-in-time) | Concatenated; cross-tier conflict rule **underspecified** beyond load order | [OFFICIAL](https://geminicli.com/docs/cli/gemini-md/) |
| **Aider** | `CONVENTIONS.md` (via `read:`), `.aider.conf.yml` | Config searched home→repo→cwd, last loaded wins; does **not** auto-read AGENTS.md | [OFFICIAL](https://aider.chat/docs/usage/conventions.html) |
| **GitHub Copilot** | `.github/copilot-instructions.md`, `*.instructions.md`, `AGENTS.md` | **Personal → repository → organization**; nearest AGENTS.md wins for agent files | [OFFICIAL](https://docs.github.com/en/copilot) |
| **MCP servers** | `instructions` field (returned on `initialize`) | Surfaced once during capability negotiation; client decides how to inject — **not** mandated by spec | [OFFICIAL](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) |

**Key nuances worth knowing:**

- CLAUDE.md is delivered as a *user message*, treated as context, not enforced configuration — there's no guarantee of strict compliance; hard enforcement needs hooks or managed settings **[OFFICIAL/TOOL]** ([Claude Code memory](https://code.claude.com/docs/en/memory)).
- Claude Code `/init` reads and incorporates an existing `AGENTS.md`, `.cursorrules`, `.windsurfrules` **[OFFICIAL/TOOL]**.
- A documented discrepancy to verify yourself: Cursor's current docs say plain `.md` rule files are supported, while widely-cited community guidance claims `.md` is silently ignored and only `.mdc` works **[OFFICIAL vs CONVENTION conflict]** ([Cursor docs](https://cursor.com/docs/rules.md)).

**Because precedence differs, state it explicitly in your own rules file.** That is the one instruction every tool will at least *see*.

### Template: `PROJECT_RULES.md`

```markdown
# PROJECT_RULES.md

If these rules conflict with broader/global defaults, follow THIS file
unless I explicitly say otherwise in chat.

## Source of truth
- Read `_MANIFEST.md` first.
- Treat Tier 1 files as canonical.
- Do not use `archive/` files unless I explicitly request them.

## File safety
- Never permanently delete files. Move superseded files to `archive/`.
- Ask before renaming or overwriting any Tier 1 / canonical file.
- Show a diff before any multi-file or structural change.

## Output rules
- Save finished deliverables to `outputs/`.
- Save generated/intermediate artifacts to `build/` or `staging/`.
- Do not treat anything in `outputs/` or `build/` as source unless I ask.

## Task behavior
- Load only the files the current task needs; don't read whole folders.
- State a short plan and your assumptions before broad changes.
- Stop and ask if two Tier 1 files conflict.
- Record major decisions in `status.md`.
```

---

## 6. One Folder, Many Surfaces

The hardest real problem: the *same* folder hit by Claude Code, then Cursor/Codex/Copilot, then Gemini, then Aider, then a human. The verified answer is a **single source of truth plus thin shims**, not parallel duplicated files.

- **Make `AGENTS.md` the source of truth.** It's an open standard (Linux Foundation's Agentic AI Foundation) read natively by Codex, Cursor, Copilot coding agent, Gemini CLI (configurable), and ~20 others **[OFFICIAL]** ([agents.md](https://agents.md/)).
- **Bridge the tools that don't auto-read it:**
  - **Claude Code:** either symlink `ln -s AGENTS.md CLAUDE.md`, or a one-line `CLAUDE.md` containing `@AGENTS.md` (official `@path` import) **[OFFICIAL import / CONVENTION bridge]** ([Claude Code memory](https://code.claude.com/docs/en/memory); [agents.md](https://agents.md/)).
  - **Aider:** `read: AGENTS.md` in `.aider.conf.yml` **[OFFICIAL]**.
  - **Gemini CLI:** `{"context": {"fileName": "AGENTS.md"}}` in `.gemini/settings.json` **[OFFICIAL]**.
- **Put only genuinely tool-specific behavior in that tool's own file** — don't duplicate shared content.

**Pitfalls (verified):** symlinks are git-tracked and survive clone, but can break on Windows and in some zip/CI exports — the `@import` line avoids this **[CONVENTION; Windows fragility UNVERIFIED]**. No tool documents whether it *deduplicates* if it sees both `AGENTS.md` and an importing `CLAUDE.md`, so avoid having a tool load the same content twice **[UNVERIFIED]**. Nested `AGENTS.md` is supported and nearest-file-wins **[OFFICIAL]**.

### Three levels of robustness

1. **Reference** — point each tool at one file (one canonical file, the rest read it). Fine for a solo project.
2. **Bridge** — symlink or `@import` so the canonical *file* is shared. The standard recommendation.
3. **Compile** — the strongest option. Keep one *content source*, not just one file, and treat every vendor file as a build output.

**Compile the adapters, don't just bridge them.** Author instruction content as small modules (e.g., `instructions/_shared/*.md` for cross-cutting rules + a per-project module), declare which modules each vendor file gets in a `manifest.yml`, and run a build script that concatenates them into `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, etc. Each generated file opens with a `<!-- GENERATED — do not edit by hand; rebuild via scripts/build-instructions.mjs -->` header. This is the most drift-proof option: shared rules live in exactly one place, vendor files can differ *by composition* (Claude gets the Claude-only section, Gemini doesn't) without duplicating shared text, and a hand-edit to a generated file is visibly wrong and overwritten on next build **[CONVENTION / observed in production]**.

The trade-off, stated honestly: compiling adds a build step and a generated-vs-source distinction the team must respect — the `do-not-edit` header and a CI check that fails if generated files are stale are what keep it honest. Use bridging for a solo project; use compilation once multiple vendor files and shared rules would otherwise drift apart.

---

## 7. Ignore Files and Tier-3 Enforcement

The manifest *says* "ignore Tier 3"; an ignore file *makes* the tool skip it. **There is no cross-tool standard** — proposals for `.llmignore`/`.aiignore` exist but aren't adopted; each tool ships its own filename **[OFFICIAL per tool / INFERRED on "no standard"]**.

| Tool | Ignore file | Scope | Source |
|---|---|---|---|
| Aider | `.aiderignore` | context / repo-map | [OFFICIAL](https://aider.chat/docs/faq.html) |
| Cursor | `.cursorignore` (AI + index, **best-effort**) + `.cursorindexingignore` (index only) | mixed | [OFFICIAL](https://cursor.com/docs/context/ignore-files) |
| Continue | `.continueignore` (+ global `~/.continue/.continueignore`) | indexing | [OFFICIAL](https://docs.continue.dev/customize/context/codebase) |
| Cline | `.clineignore` | auto-context, listings, search | [OFFICIAL](https://docs.cline.bot/customization/clineignore) |
| Claude Code | **none** — uses `.gitignore` + `permissions.deny` in `settings.json` | varies | [OFFICIAL](https://code.claude.com/docs/en/permissions) |
| Cross-tool | no adopted standard | — | [INFERRED] |

**Two cautions:** Cursor's own docs call `.cursorignore` "best-effort" — it does **not** guarantee ignored files are never sent to the model **[OFFICIAL]**. And there are public reports (Jan 2026) that Claude Code's `.gitignore`/`deny` exclusions don't reliably stop it reading secrets like `.env` — existence of the reports is verified; current-version severity is **[UNVERIFIED]**. **Ignore files reduce context load; they are not a security boundary.** Keep secrets out of the folder, not just out of the index.

**`.gitignore` vs an LLM ignore file** serve different purposes and shouldn't be assumed identical. `.gitignore` excludes from version control (good for `build/`, `outputs/` if regenerable); an ignore file excludes from the *agent's* context. A file can warrant one, both, or neither — e.g., committed reference data you want versioned but kept out of context wants an ignore entry but not a gitignore entry **[INFERRED]**.

---

## 8. Context and Token Optimization

### How local tools consume context — five cost types

| Cost type | What it is | Loaded when | Lever |
|---|---|---|---|
| **Fixed** | System prompt, always-loaded memory files (CLAUDE.md/AGENTS.md), MCP tool schemas, skill descriptions | Every session/turn, before you speak | Keep instruction files short; prune MCP servers |
| **Per-task** | Files you read, attachments, search results for *this* task | When the task pulls them in | Read specific files, not folders; use head/tail |
| **Accumulated** | The growing conversation history | Persists every turn | Start fresh sessions; compact |
| **Tool-output** | Raw results of tool calls, logs, command output | When tools run | Clear processed results; summarize before reuse |
| **Connector/MCP** | Tool schemas (fixed) + raw connector payloads (per-call) | Schemas every turn; payloads on call | Code-execution / progressive tool loading |

**The fixed costs are the ones you most control.** CLAUDE.md is "the single most expensive file a user controls" because it loads on every session and persists every message — Anthropic's guidance is to keep it short **[OFFICIAL]** ([Claude Code costs](https://code.claude.com/docs/en/costs)). Practitioners report 20k–30k tokens loading before the first user message, and one bloated 1,207-line CLAUDE.md consuming ~42k tokens per conversation **[CONVENTION]** ([Medium: My CLAUDE.md was eating 42k tokens](https://medium.com/@cem.karaca/my-claude-md-was-eating-42-000-tokens-per-conversation-heres-how-i-fixed-it-85ffba809bd4)). Cursor draws the same line: "always" rules load every conversation, so prefer auto-attached rules scoped by glob **[OFFICIAL/TOOL]** ([Cursor best practices](https://cursor.com/blog/agent-best-practices)).

**Compaction / clearing features (per tool):**

- **Claude Code:** auto-compacts near the limit (summarizes history, keeps the 5 most-recently-accessed files); manual `/compact [focus]`, `/clear`, `/rewind` **[OFFICIAL/TOOL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents); [best practices](https://code.claude.com/docs/en/best-practices)). API-level "context editing" can clear old tool results and replace them with a placeholder **[OFFICIAL]** ([context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing)).
- **Codex CLI:** server-side compaction via `context_management` / `compact_threshold`; threshold capped at 90% of the window **[OFFICIAL]** ([OpenAI compaction](https://developers.openai.com/api/docs/guides/compaction)). Exact retained-token figures come from practitioner reverse-engineering — treat as version-dependent **[CONVENTION]**.
- **Gemini CLI:** auto-compresses (summarizes) at a configurable threshold (~0.5 of the input window by default per practitioner reports); `/compress`, `/memory show`, `/memory refresh` **[OFFICIAL]** command set ([Gemini memory mgmt](https://geminicli.com/docs/cli/tutorials/memory-management/)) + **[CONVENTION]** threshold. **Do not confuse this with Gemini "checkpointing,"** which is file-state rollback, *not* token saving **[OFFICIAL]** ([checkpointing](https://geminicli.com/docs/cli/checkpointing/)).
- **Aider:** explicit `--map-tokens` budget for the repo map (default 1k, 0 disables); `.aiderignore` can cut map tokens ~80%; `/clear`, `/tokens` **[OFFICIAL/TOOL]** ([repo map](https://aider.chat/docs/repomap.html)).

**The MCP fix:** Anthropic recommends code execution — expose tools as code APIs the agent calls programmatically, so only the tools actually used enter context (progressive/just-in-time tool loading) instead of loading all definitions upfront **[OFFICIAL/TOOL]** ([Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)).

### Token-budget checklist (AGNOSTIC)

- [ ] Keep global/system instructions short and high-signal — minimal ≠ short, but no superfluous tokens **[OFFICIAL]**.
- [ ] Keep project rules narrow and concrete; vague guidance ("write clean code") wastes tokens **[OFFICIAL]** ([Cursor](https://cursor.com/blog/agent-best-practices)).
- [ ] Use a manifest so the agent loads Tier 1 only, fetching Tier 2 on demand **[AGNOSTIC]**.
- [ ] Read specific files, not whole folders; use head/tail to inspect large data without loading it whole **[OFFICIAL]**.
- [ ] Prune MCP servers to the minimal non-overlapping set — every schema is an always-on fixed cost **[OFFICIAL]**.
- [ ] Start a new session for unrelated tasks; `/clear` between tasks **[CONVENTION]** ([claudelog](https://claudelog.com/faqs/what-is-claude-code-auto-compact/)).
- [ ] Compact or summarize long sessions ("compact early, compact often") **[CONVENTION]**.
- [ ] Keep logs/JSON out of context unless needed; clear raw tool results once processed **[OFFICIAL]**.
- [ ] Prefer distilled summaries from sub-agents over raw output — a sub-agent may burn tens of thousands of tokens but return only ~1–2k **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).
- [ ] Order instructions static-first, variable-last. Prompt caching requires a 100%-identical prefix — the cache breaks at the first differing token — so put stable rules/examples first and per-request detail last to maximize cache hits and cut cost/latency **[OFFICIAL]** ([Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)).

**Choosing the lever (Anthropic's explicit rule):** compaction for tasks needing extensive back-and-forth; note-taking (`status.md`/`NOTES.md`) for iterative work with milestones; multi-agent for parallel research **[OFFICIAL]** ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

---

## 9. Session Hygiene and State Files

Context rot means a long session degrades not only when the window is *full* but as irrelevant context *accumulates* **[OFFICIAL]** ([Chroma](https://www.trychroma.com/research/context-rot)). The countermeasures are behavioral.

- **One task per thread.** Run unrelated work in separate sessions; the writer/reviewer split works *better* across sessions because a fresh context isn't biased toward code it just wrote **[OFFICIAL/TOOL]** ([Claude Code best practices](https://code.claude.com/docs/en/best-practices)).
- **Start new vs. compact.** Start fresh for an unrelated task; compact when the *current* task needs continuity but the history is bloated.
- **Persist decisions outside the window.** Structured note-taking (a `status.md`/`NOTES.md` the agent re-reads after a reset) is Anthropic's named technique for multi-hour coherence **[OFFICIAL]**.
- **Keep tool outputs small** and summarize large files before using them, so raw payloads don't linger in history **[OFFICIAL]**.

### The session workflow (AGNOSTIC)

```text
## Start of session
1. Read _MANIFEST.md.
2. Read Tier 1 files (PROJECT_RULES.md, status.md, outline).
3. Identify the task domain.
4. Load ONLY the relevant Tier 2 files.
5. State a short plan before modifying anything.

## During session
1. Keep tool outputs small; summarize large files before use.
2. Avoid unrelated pivots — open a new session instead.
3. Record major decisions in status.md as you go.
4. Compact when history bloats but the task continues.

## End of session
1. Update status.md (state, decisions, next actions).
2. Move superseded files to archive/.
3. Save deliverables to outputs/.
4. Update _MANIFEST.md if canonical (Tier 1) files changed.
```

### Template: `status.md` (machine-parseable — YAML frontmatter + prose)

Frontmatter gives any tool a reliably-parseable head; the body stays human-readable. Prefer this over a separate JSON sidecar — one file, no drift, and frontmatter is widely parsed **[INFERRED]**.

```markdown
---
project: project-alpha
status: active        # active | paused | done
updated: 2026-06-14
canonical: [outline.md, chapters/current/]
next: ["draft ch.4", "fact-check ch.3"]
blocked_by: null
---

# Status — project-alpha
Prose for humans: where things stand, latest decisions, open questions.
```

### Template: `session-handoff.md` (the portable substitute for `/clear`-with-memory)

When a thread bloats or you switch tasks, have the agent write this, then start a fresh session that reads it back. Portable because it's just a file. Include decisions and next actions; **omit** the narrative back-and-forth, raw tool output, and dead ends (a one-line "rejected X because Y" is enough).

```markdown
# Session Handoff — <project> — YYYY-MM-DD HH:MM

## Goal (one line)
What this work is trying to achieve.

## State now
- Done: …
- In progress: …
- Blocked: … (and on what)

## Key decisions (with reasons)
- Decided X because Y. (supersedes earlier Z)

## Next 1–3 actions
1. …

## Files that matter (and ONLY these)
- canonical: …
- touch next: …

## Do NOT
- reopen <settled question>; reread <archived/large file>.
```

### Template: `_PROJECT_INDEX.md` (for many parallel projects)

One file at the workspace root so an agent can see which projects are live **without opening each project's context** — it reads one small table, then loads only the relevant project's `status.md`.

```markdown
# Projects Index — updated 2026-06-14
| Project | Status | Updated | One-line state | Path |
|---|---|---|---|---|
| project-alpha | active | 2026-06-14 | drafting ch.4 | projects/project-alpha/ |
| project-beta | paused | 2026-05-30 | awaiting review | projects/project-beta/ |
```

Maintain it from each project's frontmatter at end-of-session. **Failure mode:** if it drifts from the projects' own `status.md`, the agent trusts the stale index — so it must be the *last* thing updated, or generated from the per-project frontmatter rather than hand-kept.

---

## 10. Tool-Agnostic Agent Patterns

For each: what it is · when to use · how to say it · what it prevents.

**Builder–validator (generator–critic).** Anthropic's "evaluator-optimizer": one pass generates, another evaluates against criteria, loop. *When:* clear eval criteria and iteration adds measurable value. *Say:* "Draft X, then critique it against [criteria], then revise; repeat until it passes." *Prevents:* the generator grading its own work and shipping plausible-but-wrong output **[OFFICIAL]** ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). **Watch:** a critic told to "find gaps" over-reports — scope it to "flag only gaps affecting correctness or stated requirements" **[OFFICIAL]** ([Claude Code best practices](https://code.claude.com/docs/en/best-practices)).

**Researcher–writer–editor (prompt chaining).** A pipeline where each stage does one transformation with a focused prompt, then hands off, with optional gates between steps. *When:* the deliverable decomposes into distinct reasoning phases. *Say:* "Write an outline, check it meets [criteria], then write from the outline." *Prevents:* compounding errors from one agent doing every phase poorly **[OFFICIAL]** ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).

**Planner–executor–reviewer (plan mode).** Read-only planning before any edit — Claude Code's Explore→Plan→Implement→Commit; "plan mode" exists by name in Claude Code, Gemini CLI, and Cursor. *When:* uncertain approach, multi-file change, unfamiliar code — "if you could describe the diff in one sentence, skip the plan." *Say:* "Enter plan mode, read the relevant files, propose a plan; don't edit until I approve." *Prevents:* solving the wrong problem **[OFFICIAL/TOOL]** ([Claude Code best practices](https://code.claude.com/docs/en/best-practices); [Gemini checkpointing](https://google-gemini.github.io/gemini-cli/docs/cli/checkpointing.html)).

**Sub-agent delegation.** An orchestrator breaks a task into subtasks, delegates to workers in isolated context windows, and synthesizes their *summaries*. *When:* complex work whose subtasks aren't predictable, or exploration that would flood the main window. *Say:* "Use a sub-agent to investigate X and report only a short summary." *Prevents:* one context window overwhelmed by exploration **[OFFICIAL]** ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents); [Claude Code best practices](https://code.claude.com/docs/en/best-practices)).

**Staging-before-output.** Write to a staging/temp area, validate, then promote. Microsoft Research frames the filesystem itself as the control surface — isolate mutations in a staging area before commit. *When:* generating deliverables or risky edits. *Say:* "Write to `staging/`, validate against PROJECT_RULES.md, then move to `outputs/`." *Prevents:* half-finished or invalid output overwriting canonical files **[INFERRED/Research]** ([Microsoft: Don't let AI agents YOLO your files](https://www.microsoft.com/en-us/research/publication/dont-let-ai-agents-yolo-your-files-shifting-information-and-control-to-filesystems-for-agent-safety-and-autonomy/)).

**Human approval gates.** Three canonical designs: pre-execution approval, post-execution review, escalation triggers. *When:* consequential actions. *Say:* "Pause and ask before any irreversible action." *Prevents:* unattended mistakes on high-blast-radius operations **[INFERRED]** ([Permit.io](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo)).

**Destructive-action gates.** Gate *only* irreversible/destructive ops — gating reads creates approval fatigue ("after the tenth approval you're just clicking through"). *Test:* "Is the decision irreversible?" *Say:* "Require my approval for deletes, bulk renames, and overwriting canonical files; never gate reads." *Prevents:* both catastrophic deletes *and* rubber-stamp fatigue **[OFFICIAL + INFERRED]** ([Claude Code](https://code.claude.com/docs/en/best-practices); [Permit.io](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo)).

**Diff-first.** Show the diff before applying. *When:* any non-trivial edit. *Say:* "Show me the diff and wait before applying multi-file changes." *Prevents:* silent, hard-to-review edits. Native in Cursor, Aider (`/diff`), Gemini CLI, Codex, Cline **[TOOL]**.

**Test-before-write (TDD).** Write tests first, confirm they fail, commit them as a checkpoint, then implement to green without editing the tests. Called "the single strongest pattern for working with agentic coding tools" — but requires explicit prompting because agents default to implementation-first. *Prevents:* "looks done" being the only signal; gives the loop an objective close condition **[OFFICIAL]** ([Claude Code best practices](https://code.claude.com/docs/en/best-practices)).

**Worked example, in plain instructions:**

```text
For document generation:
1. Builder drafts into staging/.
2. Validator checks the draft against PROJECT_RULES.md.
3. If it passes, move to outputs/.
4. If it fails twice, stop and ask me.
```

---

## 11. File Safety and Destructive Actions

The most-cited rule: **never delete by default — archive instead.** Moving a file within the same filesystem costs nothing and preserves recoverability; if the agent can't confidently explain why a file should be deleted, it should move it to `archive/` **[CONVENTION]** ([bswen](https://docs.bswen.com/blog/2026-03-11-prevent-ai-agent-delete-files/)). No agent with shell access should run `rm -rf` without confirmation; block destructive commands at the policy level so the agent can't bypass them **[CONVENTION]** ([bswen](https://docs.bswen.com/blog/2026-03-11-prevent-ai-agent-delete-files/); [Towards Data Science](https://towardsdatascience.com/what-ai-agents-should-never-do-on-their-own/)).

**Irreversible + high-blast-radius = mandatory gate.** Bulk deletes, mass renames, overwriting canonical files, and production changes are the category that always demands explicit approval **[INFERRED]** ([Towards Data Science](https://towardsdatascience.com/what-ai-agents-should-never-do-on-their-own/)).

**Git is the durable checkpoint layer.** In-tool checkpoints (Claude Code `/rewind`, Cursor checkpoints, Gemini shadow-git, Cline checkpoints) are fast local rewind; **git commits are the durable, shareable, reviewable layer beneath them.** Claude Code's own docs warn `/rewind` "only tracks changes made by Claude, not external processes" and "isn't a replacement for git" **[OFFICIAL/TOOL]** ([best practices](https://code.claude.com/docs/en/best-practices)). Aider makes commits-as-checkpoints its whole model: auto-commit each edit with a Conventional Commits message, mark it "(aider)," and `/undo` to revert; it even commits *your* uncommitted work first so an AI change can't lose it **[OFFICIAL/TOOL]** ([Aider git](https://aider.chat/docs/git.html)). Where in-tool undo is weak (Codex lacks reliable native rewind), disciplined git commits are the safety net **[TOOL/CONVENTION]** ([Codex issue](https://github.com/openai/codex/issues/11626)).

### Recommended global-instruction language

```text
Never permanently delete files. Move them to archive/ instead.
Before bulk renaming, overwriting canonical files, or restructuring folders,
show the proposed changes and wait for my approval.
For code, prefer branch + diff + test before merge, and commit at meaningful
checkpoints so every state is recoverable.
Gitignore generated artifacts so diffs and checkpoints stay clean.
```

**Advisory text is the floor; enforce the rule where the tool allows it.** Instruction-file language like the above is *advisory* — the model usually complies, but nothing guarantees it (§5). For a rule you actually care about, back it with a deterministic guard. The strongest pattern observed: a `PreToolUse(Bash)` hook that inspects the command and **denies any `rm` that targets something other than a rebuildable artifact** (`.build/`, `__pycache__/`, `*.pyc`, `*.bak`), returning a `permissionDecision: "deny"` with an explanation — so "never delete, archive instead" becomes impossible to violate by accident rather than merely requested **[CONVENTION / observed; mechanism is OFFICIAL]** ([Claude Code hooks](https://code.claude.com/docs/en/hooks)). This is tool-specific (Claude Code hooks here; other tools need their own guard or a wrapper), so keep the advisory text too — it's the portable fallback for tools without hooks.

---

## 12. Governance and Security

The moment an agent has filesystem access, shell, and MCP connectors, your folder conventions are also a *security boundary* — and a weak one by default. Two documented, active threat classes matter most:

- **Prompt injection** — hidden instructions in content the agent reads (a file, a web page, an issue) hijack its behavior **[official/research]** ([NSA MCP security CSI](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf); [arXiv:2603.22489](https://arxiv.org/abs/2603.22489)).
- **Tool poisoning** — malicious instructions embedded in an MCP tool's *description/metadata* lure the agent into unsafe actions; a demonstrated WhatsApp-MCP case exfiltrated message history with nothing visible in the tool's output **[research]** ([Practical DevSecOps](https://www.practical-devsecops.com/mcp-security-vulnerabilities/); [CSA Agentic MCP best practices](https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/)).

Treat every MCP server as **third-party supply chain**, not a trusted built-in. Recommended baseline controls **[AGNOSTIC / CONVENTION]**:

- **Least privilege by default** — narrowest permission profile that still works; workspace-only filesystem scope where possible.
- **Explicit network/domain allowlists** — not "internet on." Encode them (e.g., the `.ai/manifest.yaml` permissions block) and enforce via a wrapper/hook.
- **No secrets in the folder, prompts, or logs** — ignore files reduce context, they don't secure secrets (§7); keep secrets out entirely.
- **Approval gates on destructive/irreversible actions** (§11) — and on any new outbound connector.
- **Validator passes for risky work** (§10) — a clean-context reviewer that sees only the diff and the rules.
- **Audit the decisions and file changes** — `.ai/audit/` or tool-native logging, so you can reconstruct what an agent did and why.
- **Input validation on tool metadata/content** — the defense the MCP-security literature converges on; don't let unvetted tool descriptions or fetched content drive actions unchecked.

The single portable principle: **the agent should be able to do exactly the task, and nothing with larger blast radius, without a human in the loop.**

---

## 13. Templates and Reusable Skills

The discipline is separating **reusable workflow** from **always-loaded context** so your fixed cost stays small. Anthropic's authoring ceilings make the point concrete: keep `SKILL.md` under ~500 lines (split overflow into linked reference files), keep `CLAUDE.md` under ~200 lines **[OFFICIAL]** ([skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices); [Claude Code memory](https://code.claude.com/docs/en/memory)). A procedure that's long or conditional belongs in a *skill* loaded on trigger — not in the file that loads every session.

### Decision rule — what goes where (AGNOSTIC)

```text
Global instruction → applies to every project (keep tiny).
Project rule       → applies to one project.
Template           → reusable output skeleton (structure, not procedure).
Skill              → reusable procedure with steps, checks, validation logic.
Status file        → current state, latest decisions, next actions.
Manifest           → map of what to read and what to ignore.
```

Rule of thumb: **global** if it's true everywhere and short; **project** if it's specific to this work; **template** if it's a shape you reuse; **skill** if it's a multi-step procedure with checks; **status** if it changes every session; **manifest** if it's about *what to read*, not *what to do*.

---

## 14. Tool Comparison and Portability

### Portable vs. tool-specific

Before the per-tool table, the more useful cut for deciding what to build: how well does each pattern survive being pointed at by a *different* tool?

| Pattern | Classification | What carries / what breaks |
|---|---|---|
| Folder architecture (current/archive/build/outputs split) | **Fully portable** | Just directories; every tool and a human see the same tree **[OFFICIAL]**. |
| `_MANIFEST.md` tier discipline | **Portable with adaptation** | The *file* is portable; *enforcement* isn't. No tool natively honors "Tier 3, ignore" — back it with an ignore file (§7). Honored probabilistically, not guaranteed. |
| `PROJECT_RULES.md` + precedence statement | **Portable with adaptation** | Loaded only if the tool's instruction file points at it (§6). The statement is portable; enforcement differs per tool. |
| `status.md` / `session-handoff.md` | **Fully portable** | Plain Markdown; any agent or human reads them — if told to. |
| Builder–validator / fresh-context reviewer | **Portable with adaptation** | The workflow is portable as instructions; genuine context isolation depends on the tool's sub-agent support. |
| Compaction / `/clear` / handoff | **Tool-specific** | Command names differ; the handoff-file (§9) is the portable substitute. |
| PreToolUse context-filter hooks | **Tool-specific (Claude Code)** | No portable filesystem equivalent. |
| Deferred tool loading / code-execution MCP | **Tool-specific (Anthropic API)** | Real and powerful (§15) but not a filesystem convention. |

**Bottom line:** the *filesystem layer* (folders, manifest, rules, status, handoff) is portable; the *enforcement layer* (ignore files, hooks, compaction, sub-agent isolation) is tool-specific and must be re-implemented per surface. Design the folder so it degrades gracefully: a tool that ignores your manifest should still not be actively misled, because current/archive are physically separated.

### Per-tool capability matrix

Legend: ✅ supported · ⚠️ partial/conditional · ❔ unverified in official sources · n/a not applicable.

| Tool | Global instr. file | Project rules | Local FS | Sub-agents | Compact/clear | Native diff | Git (commit/checkpoint/undo) | Best manifest approach |
|---|---|---|---|---|---|---|---|---|
| **Claude Code** | `~/.claude/CLAUDE.md` (+ managed) | ✅ `.claude/rules/`, CLAUDE.md | ✅ | ✅ `.claude/agents/` | ✅ `/compact` `/clear` + auto | ✅ | ✅ `/rewind` + git | `@import` in CLAUDE.md; `MEMORY.md` index |
| **Claude Cowork** | ❔ (per-project memory exists) | ⚠️ projects/plugins | ✅ | ❔ | ❔ | ❔ | ❔ | ❔ (likely plugin/memory doc) |
| **Cursor Agent** | User rules / `AGENTS.md` | ✅ `.cursor/rules/`, AGENTS.md | ✅ | ✅ background agents | ❔ (auto-managed) | ✅ | ✅ checkpoints + worktrees | `AGENTS.md` → manifest |
| **Aider** | `~/.aider.conf.yml` | ✅ conf + `CONVENTIONS.md` | ✅ | ⚠️ Architect/Editor only | ⚠️ `/clear` (no verified auto-compact) | ✅ `/diff` | ✅ auto-commit, `/undo` | `read:` list in `.aider.conf.yml` |
| **Codex CLI** | `~/.codex/config.toml`, `AGENTS.md` | ✅ AGENTS.md (nested) | ✅ | ✅ `[agents]`, max_depth | ✅ compaction + auto | ✅ | ⚠️ git via shell (weak native undo) | `AGENTS.md` → manifest |
| **Gemini CLI** | `~/.gemini/GEMINI.md` | ✅ GEMINI.md (hierarchical) | ✅ | ❔ | ✅ `/compress`, `/memory` | ✅ | ✅ shadow-git checkpoints | GEMINI.md hierarchy → manifest |
| **Continue** *(repositioned — see below)* | `config.yaml` | ✅ `.continue/rules/` | ✅ | ⚠️ configurable Agents | ❔ | ✅ | ❔ | rule → manifest |
| **Cline** | Custom Instructions | ✅ `.clinerules` | ✅ | ❔ | ⚠️ Memory Bank auto-condense | ✅ | ✅ checkpoints | Memory Bank `projectbrief.md` |
| **Copilot coding agent** | repo-only | ✅ AGENTS.md, `.github/copilot-instructions.md` | ⚠️ cloud branch (not local disk) | ❔ | n/a (managed) | ✅ (PR diff) | ✅ branch/PR | `AGENTS.md` → manifest |
| **MCP custom agents** | host-dependent | host-dependent | ✅ (Roots + FS server) | ✅ via Sampling | host-dependent | host-dependent | via git MCP server | Resource/Prompt manifest |

*Sources per cell: Claude Code [memory](https://code.claude.com/docs/en/memory)/[sub-agents](https://code.claude.com/docs/en/sub-agents); Cursor [CLI](https://cursor.com/docs/cli/using)/[agent](https://cursor.com/docs/agent/overview); Aider [git](https://aider.chat/docs/git.html)/[conf](https://aider.chat/docs/config/aider_conf.html); Codex [agents-md](https://developers.openai.com/codex/guides/agents-md)/[subagents](https://developers.openai.com/codex/subagents); Gemini [memory](https://geminicli.com/docs/cli/tutorials/memory-management/)/[checkpointing](https://geminicli.com/docs/cli/checkpointing/); Continue [rules](https://docs.continue.dev/customize/deep-dives/rules); Cline [memory bank](https://docs.cline.bot/features/memory-bank); Copilot [coding agent](https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent); MCP [client concepts](https://modelcontextprotocol.io/docs/learn/client-concepts).*

**Product-status notes (current as of June 2026 — verify before relying):** **Roo Code** announced it is shutting down all products (Extension, Cloud, Router) on **May 15, 2026**; it is no longer a candidate for new work and has been dropped from the table above ([sunset notice](https://docs.roocode.com/sunset)). **Continue** has repositioned from "local coding agent" toward **"Continuous AI" — source-controlled checks in `.continue/checks/` enforced as GitHub PR status checks**; Agent mode and `.continue/rules/` still exist, but treat Continue now as a CI policy/check layer that *complements* a primary agent rather than being one ([repo](https://github.com/continuedev/continue)). **Copilot CLI** (distinct from the cloud coding agent in the table) adds `/fleet` for parallel subagents, resumable session history, and auto-compaction near **~80%** context with checkpoint summaries ([Copilot CLI context mgmt](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)).

**Honest gaps:** **Claude Cowork** is the weakest-documented row — its local-FS access and per-project memory are confirmed, but global-instruction file, sub-agents, compaction, diff, and git are unverified in public docs. "Sub-agents" means different things across tools (spawnable instances in Claude Code/Codex/Cursor; Architect/Editor in Aider). Several compaction command names are inferred from "condensing/summarization" features rather than a literal `/compact`.

---

## 15. Claude/Anthropic-Specific Mechanisms

These are powerful if Claude Code/Cowork is your primary surface — but they do **not** transfer to other tools, so keep them out of the *portable* core (§20) and in this tool-adapter appendix.

**Five-layer settings precedence (CONFIRMED official):** Managed/policy > command-line args > local project (`.claude/settings.local.json`, auto-gitignored) > shared project (`.claude/settings.json`, committed) > user (`~/.claude/settings.json`). Array-valued settings concatenate/dedupe rather than fully override **[OFFICIAL]** ([settings](https://code.claude.com/docs/en/settings)).

**CLAUDE.md walk-up + lazy subdirectory load (CONFIRMED official):** parent-directory files load in full at launch (root-down order); subdirectory `CLAUDE.md` files load **on demand only when Claude reads files in those directories** — the lazy part is explicitly documented **[OFFICIAL]** ([memory](https://code.claude.com/docs/en/memory)).

**Auto-memory `MEMORY.md` (CONFIRMED official):** first 200 lines / 25KB (whichever first) load at startup; topic files load on demand. **Failure mode:** push canonical pointers past line 200 and they silently never load — keep `MEMORY.md` a true index and verify the top 200 lines hold everything load-bearing **[OFFICIAL + INFERRED failure mode]**.

**PreToolUse hooks as context filters (CONFIRMED official):** a hook can rewrite a tool's input/output before the model sees it (e.g., strip a 10k-line log to error lines), and can block actions deterministically — stronger than advisory CLAUDE.md instructions **[OFFICIAL]** ([hooks](https://code.claude.com/docs/en/hooks)).

**Token-saving API features (CONFIRMED official, with the *real* figures):**

- **Code Execution with MCP** — Anthropic states **98.7%** reduction (150k→2k tokens) by processing intermediate data in the sandbox **[OFFICIAL]** ([code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)).
- **Tool Search Tool / `defer_loading`** — official figure is **85%** token reduction (the "95%" sometimes quoted is "context preserved" in one example, not the headline) **[OFFICIAL]** ([advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)).
- **Programmatic Tool Calling** — **37%** average reduction on complex tasks **[OFFICIAL]**.
- **Tool Use Examples** — 1–5 examples per tool; accuracy 72%→90% on complex parameters **[OFFICIAL]**.

**Correction to a widely-circulated claim:** the "skill character budget = 2% of context / 16,000-char fallback / skills excluded at startup" figure is **not** what the docs say. Official: listing budget defaults to **1%** (`skillListingBudgetFraction`), per-entry cap **1,536 chars** (`maxSkillDescriptionChars`), and overflow **shortens or drops descriptions** (least-used first) rather than excluding whole skills; there is **no documented 16,000-char fallback** **[OFFICIAL correction]** ([skills](https://code.claude.com/docs/en/skills)). Treat uncited percentages from secondary write-ups as suspect.

---

## 16. Building CLI Tools Agents Will Call

A distinct concern from workflow architecture, but it connects: agents, scripts, *and* humans all consume your tools' output, so a well-behaved CLI is an agent-friendly CLI. Two rules carry most of the value.

**Keep business logic out of the CLI.** The command surface should be a thin adapter over a reusable core: `core logic → CLI adapter → terminal/shell/packaging adapters`. The core owns validation and semantics and knows nothing about flags, colors, or TTYs — which is exactly what makes it testable and callable from an SDK, a job, or another tool **[CONVENTION]** ([clig.dev](https://clig.dev/)). For language choice: Go+Cobra for ubiquitous static binaries, Rust+clap for a typed core + compiled surface, Python+Click for library-first reuse, argparse for zero-dependency internal tools.

**Make output legible to both humans and machines** **[CONVENTION]** ([clig.dev](https://clig.dev/); [cli-guidelines](https://github.com/cli-guidelines/cli-guidelines)):

- Primary/machine-readable output to **stdout**; logs, errors, progress to **stderr** (so pipes stay clean).
- **Meaningful exit codes** (0 = success, distinct non-zero per failure mode) — how scripts *and* agents detect failure.
- Support `--json` for structured output, plus `--quiet` / `--verbose` / `--debug`.
- **Detect TTY vs. pipe**; disable color when not a TTY and honor `--no-color`.
- `--dry-run` for consequential actions; **confirm destructive actions** (and skip the prompt — fail safe — in non-interactive/CI contexts).
- Example-led `--help`.

These are the same instincts as the agent-workflow rules — explicit, reversible, legible — applied one layer down.

---

## 17. Anti-Patterns

- [ ] **Pointing the agent at a giant parent folder.** Forces reading across invisible boundaries; breaks the canonical/transient distinction. *Fix:* one bounded folder per project; multi-root for cross-project work **[CONVENTION]**.
- [ ] **Mixing unrelated projects** in one tree or one session. Cross-contaminates context. *Fix:* separate folders, separate sessions.
- [ ] **Keeping old drafts beside current drafts.** The documented archived-vs-current confusion. *Fix:* `archive/`; mark superseded, don't leave in place **[CONVENTION]**.
- [ ] **Letting outputs become source material.** The agent re-ingests its own generated output as if canonical. *Fix:* `outputs/`/`build/` are never source; say so in rules.
- [ ] **Huge global memory.** A 1,200-line CLAUDE.md taxes every single message. *Fix:* keep instruction files short; push detail to skills/reference files loaded on trigger **[OFFICIAL/CONVENTION]**.
- [ ] **Many unrelated tasks in one session.** Accumulated context rots quality. *Fix:* one task per thread; `/clear` or new session **[OFFICIAL/CONVENTION]**.
- [ ] **Dumping full logs or full JSON into context.** Standing tool-output cost for data the agent rarely re-reads. *Fix:* summarize; use head/tail; clear processed results **[OFFICIAL]**.
- [ ] **Asking "what's in this folder?" instead of maintaining `status.md`.** Re-deriving state every session wastes context. *Fix:* a maintained status file **[OFFICIAL]** (note-taking).
- [ ] **Vague tasks like "clean this up."** No success criterion, unbounded scope. *Fix:* specify the target, the constraint, and "done."
- [ ] **Letting the agent delete or rename without review.** Irreversible, high-blast-radius. *Fix:* archive-not-delete; gate destructive ops **[CONVENTION]**.
- [ ] **Depending on tool-specific behavior that may not generalize.** Precedence models, compaction commands, and undo guarantees differ. *Fix:* encode intent in plain files you control; state precedence explicitly **[AGNOSTIC]**.

---

## 18. Failure-Mode Catalog

| Pattern | Failure mode | Triggers under | Mitigation |
|---|---|---|---|
| Manifest tier discipline | Agent reads Tier 3 anyway | Vague task ("clean up"), tool that doesn't honor instructions, glob/grep sweeps | Back the manifest with an ignore file (§7); physically separate archive/; scope tasks |
| Ignore files | Ignored file still sent to model | Cursor "best-effort"; reported Claude Code `.env` leaks | Don't rely on ignore files for secrets — keep secrets out of the folder |
| `AGENTS.md` + shims | Same content loaded twice; symlink breaks on Windows | Tool reads both `AGENTS.md` and an importing `CLAUDE.md`; Windows checkout | Prefer `@import` over symlink on mixed-OS teams; or compile (§6) |
| `MEMORY.md` index | Canonical pointer below line 200 never loads | Index grows past 200 lines / 25KB | Keep it a true index; verify top 200 lines hold all load-bearing pointers |
| `status.md` / index | Agent trusts stale state | Not updated at session end; index drifts from per-project files | Update status/index as the *last* end-of-session step; generate index from frontmatter |
| Handoff file | Continuity lost after `/clear` | Handoff omits a key decision or includes too much noise | Template §9: decisions + next actions in, narrative out |
| Long sessions | Quality degrades mid-window ("lost in the middle") | Accumulated history, distractors | Handoff + fresh session; one task per thread |
| Sub-agent reviewer | Over-reports gaps → over-engineering | Critic told to "find gaps" unscoped | Scope to "correctness / stated requirements only" |
| Uncited vendor figures | Designing to a number that isn't reproducible | Trusting "99.96%"-style claims as targets | Verify against official docs; the real MCP figure is 98.7%, deferred-loading 85% |

---

## 19. Does Any of This Actually Help?

This guide — and the whole instruction-file movement — rests on an assumption worth stress-testing: that writing these files *improves outcomes.* The 2026 evidence is mixed-to-skeptical, and you should treat instruction/context files as **measurable artifacts, not assumed goods.**

- An ETH Zurich evaluation of `AGENTS.md`-style repository context files found they **do not uniformly help** — in their setup, context files **reduced task success by ~3%** while raising token cost **over 20%** **[empirical study]** ([Evaluating AGENTS.md, arXiv:2602.11988](https://arxiv.org/abs/2602.11988)).
- A factorial study varying instruction-file **size, position, and architecture** found **none** of those structural variables produced a detectable effect on instruction adherence — directly undercutting "just make it longer / better-structured" folk wisdom **[empirical study]** ([arXiv:2605.10039](https://arxiv.org/abs/2605.10039)).
- A separate adoption study catalogues how teams actually write these files in the wild **[empirical study]** ([Agent READMEs, arXiv:2511.12884](https://arxiv.org/abs/2511.12884)).

**What this does and doesn't mean.** It does *not* mean skip the folder structure, manifest, or rules — those reduce the documented failure modes (wrong-file reads, archive confusion, context bloat) regardless of merge-rate studies. It *does* mean: don't assume a bigger CLAUDE.md is a better one, don't treat instruction files as free, and **measure** — if you can A/B it, check whether a given rules file actually changes acceptance or just costs tokens. Keep them lean, review them in PRs like code, and delete rules that don't earn their context cost.

**How to measure (a portable mini-benchmark).** Run the *same* small task suite — repo summary, a narrow bug fix, a multi-file feature, a test repair, a security-sensitive change — across your candidate tools/configs, and record: acceptance rate, manual edits after the agent's output, time-to-valid-diff, review burden, token/cost, validation-pass rate, and any risky behavior (out-of-scope edits, unrequested deletes). That turns "does this rules file help?" into a number instead of a vibe **[AGNOSTIC]**.

---

## 20. Implementation: Build Order

A pragmatic build order, highest-leverage first **[AGNOSTIC]**:

1. The canonical project-folder template (§3).
2. `_MANIFEST.md` + `PROJECT_RULES.md` + `status.md` + `session-handoff.md` templates (§4, §5, §9).
3. `AGENTS.md` as the single instruction source, plus thin shims for the tools you actually use (§6).
4. `.ai/manifest.yaml` schema (§4) and a tiny **structure-audit script** that checks a project conforms.
5. A validator checklist (§10) and the mini-benchmark task suite (§19).
6. Governance controls — permission profile, allowlists, audit logging (§12).

**Keep the portable core vendor-neutral.** Anything tool-specific — `/clear`, `/compact`, hook names like `PreToolUse`, skill-budget numbers, token-reduction percentages, a particular sub-agent's semantics — lives in a clearly-labeled tool-adapter appendix (§15), never in the core standard. The core is the filesystem contract; the tools are adapters.

---

## 21. Data, Large Files, and Repo Size

*Field notes from running this in practice — generalized, labeled by confidence.*

Agents work on whatever's in the folder, and data folders get heavy fast. Three problems hide under "this file is a problem," and they need **different** fixes — don't conflate them:

| The actual problem | What it needs |
|---|---|
| **Too big** — bloats the repo, slows clones | Ship a sample; gitignore the full file; fetch on demand |
| **Don't publish it** — fine for the agent to read, just not for GitHub | `.gitignore` (the agent still reads it locally) |
| **Don't even read it** — genuinely sensitive | Keep it *out of the folder entirely*; a subfolder can't reliably hide from the agent **[INFERRED]** |

### Large files: sample in, full data out

The durable pattern for heavy data **[AGNOSTIC / observed in production]**:

1. **Ship a small sample** (a few hundred KB) so the workflow runs the moment someone clones — the agent verifies the pipeline against the sample.
2. **Gitignore the full files**; they're usually public and regenerable, so there's no reason to carry hundreds of MB in history.
3. **Document the fetch** — a `DATA.md` pointing at the download/refresh scripts, with a table mapping each gitignored file to the command that retrieves it.
4. **Override deliberately** when you must commit a big file: `git add -f path` (and `git commit --no-verify` if a size hook trips).

GitHub limits: it **warns at 50 MB and hard-blocks at 100 MB per file** **[OFFICIAL]** ([GitHub: large files](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files)). But for a *lean* repo, set your own threshold lower (25 MB is a sensible default) — a cluster of 30–45 MB files sails under GitHub's warning yet still dominates your history.

### "Ignore large by default" needs two pieces

`.gitignore` matches *paths*, not *sizes* — so "ignore anything big" isn't a single setting **[OFFICIAL]**. It takes two small tools:

- **A sweep** — a script that finds files over a threshold and writes them to a managed block in `.gitignore` (optionally `git rm --cached` to untrack them, keeping them on disk). Run it whenever the data grows.
- **A guard** — a `pre-commit` hook that blocks any commit containing a file ≥ your limit. This is the real "by default," because it catches new big files automatically rather than relying on you to remember.

For very large binaries you genuinely need versioned, **Git LFS** is the standard alternative — pointers in git, blobs stored separately **[OFFICIAL]** ([Git LFS](https://git-lfs.com/)).

### Operational gotchas (the stuff that wastes an hour)

- **Gitignoring doesn't shrink history.** It stops *future* bloat and drops files from the current tree, but anything already committed stays until a history rewrite (`git filter-repo` / BFG) — which changes commit IDs and is disruptive once others have cloned **[OFFICIAL]** ([git filter-repo](https://github.com/newren/git-filter-repo)).
- **Hooks aren't shared automatically.** A tracked `.githooks/` directory does nothing until each clone runs `git config core.hooksPath .githooks`. Put that one line in your setup docs, or the guard silently isn't running for teammates **[CONVENTION]**.
- **Stale `.git/index.lock`.** A GUI git client or an interrupted command can leave a lock that blocks an agent's git writes ("Another git process seems to be running"). When no git is actually running, remove the lock and retry — but check first; don't yank it out from under a live process **[CONVENTION]**.
- **Case-insensitive filesystems.** macOS treats `data/BLS/` and `data/bls/` as the *same* folder, but git records whichever casing it first saw — a latent break if the repo ever runs on Linux/CI. Pick one casing and keep it **[CONVENTION]**.

---

## 22. Open Questions and Caveats

1. **Claude Cowork specifics are unverified.** Global-instruction file, sub-agents, compaction commands, diff, and git integration are not publicly documented as of June 2026. Confirm directly before relying on them.
2. **Compaction thresholds drift.** The exact Codex retained-token figures and Gemini's ~0.5 default are practitioner-derived and version-dependent — verify against current `config.toml`/`settings.json` before quoting.
3. **Gemini "checkpointing" ≠ compression.** Checkpointing is file-state rollback (shadow git); compression is the token-saving summarizer. Easy to conflate; they're separate features.
4. **Cursor `.md` vs `.mdc`.** Official docs say `.md` rule files are supported; community guidance says only `.mdc` is reliably read. Test empirically if it matters to you.
5. **Precedence is genuinely non-uniform.** Scoped-layering vs. nearest-file-wins differ across tools and some (Gemini cross-tier, the AGENTS.md standard's lack of scope-layering, MCP `instructions` injection) are underspecified. Don't assume your `CLAUDE.md` precedence intuition transfers to `GEMINI.md` or `AGENTS.md`.
6. **Static indexes go stale.** A manifest only helps if maintained; Anthropic deliberately pairs an up-front index with just-in-time glob/grep to avoid trusting a stale map. Budget for manifest upkeep.
7. **Instruction files are advisory, not enforced.** CLAUDE.md (and peers) are delivered as context, not configuration — there's no guarantee of compliance. Hard guarantees require hooks, managed settings, or filesystem-level controls.
8. **Two patterns here come from a single production implementation,** not multiple independent sources: compiling instruction adapters (§6) and enforcing never-delete via a PreToolUse hook (§11). They're sound and recommended, but labeled "observed" rather than "convention" until the same patterns are seen widely elsewhere.

---

## 23. Sources

**Vendor / official:** [Anthropic — Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) · [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) · [Anthropic — Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) · [Anthropic — Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) · [Claude Code memory](https://code.claude.com/docs/en/memory) · [Claude Code best practices](https://code.claude.com/docs/en/best-practices) · [Claude Code settings](https://code.claude.com/docs/en/settings) · [Claude Code hooks](https://code.claude.com/docs/en/hooks) · [Claude Code skills](https://code.claude.com/docs/en/skills) · [Claude Code permissions](https://code.claude.com/docs/en/permissions) · [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) · [agents.md standard](https://agents.md/) · [OpenAI Codex — AGENTS.md](https://developers.openai.com/codex/guides/agents-md) · [OpenAI — Compaction](https://developers.openai.com/api/docs/guides/compaction) · [Cursor — Rules](https://cursor.com/docs/rules.md) · [Cursor — Ignore files](https://cursor.com/docs/context/ignore-files) · [Cursor — Agent best practices](https://cursor.com/blog/agent-best-practices) · [Gemini CLI — GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) · [Gemini CLI — Checkpointing](https://geminicli.com/docs/cli/checkpointing/) · [Aider — Repo map](https://aider.chat/docs/repomap.html) · [Aider — Git](https://aider.chat/docs/git.html) · [Aider — FAQ (.aiderignore)](https://aider.chat/docs/faq.html) · [Continue — Codebase context](https://docs.continue.dev/customize/context/codebase) · [Cline — .clineignore](https://docs.cline.bot/customization/clineignore) · [Cline — Memory Bank](https://docs.cline.bot/features/memory-bank) · [GitHub Copilot coding agent](https://docs.github.com/copilot/concepts/agents/coding-agent/about-coding-agent) · [GitHub Copilot CLI — context management](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management) · [MCP — Lifecycle/spec](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) · [git — gitignore](https://git-scm.com/docs/gitignore) · [GitHub — about large files](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files) · [Git LFS](https://git-lfs.com/) · [git filter-repo](https://github.com/newren/git-filter-repo) · [clig.dev](https://clig.dev/)

**Research / empirical:** [Chroma — Context Rot](https://www.trychroma.com/research/context-rot) · [Microsoft Research — Don't let AI agents YOLO your files](https://www.microsoft.com/en-us/research/publication/dont-let-ai-agents-yolo-your-files-shifting-information-and-control-to-filesystems-for-agent-safety-and-autonomy/) · [Evaluating AGENTS.md (arXiv:2602.11988)](https://arxiv.org/abs/2602.11988) · [Instruction-file factorial study (arXiv:2605.10039)](https://arxiv.org/abs/2605.10039) · [Agent READMEs (arXiv:2511.12884)](https://arxiv.org/abs/2511.12884) · [MCP threat modeling (arXiv:2603.22489)](https://arxiv.org/abs/2603.22489) · [NSA — MCP Security CSI](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf) · [CSA — Agentic MCP Security Best Practices](https://labs.cloudsecurityalliance.org/agentic/agentic-mcp-security-best-practices-v1/)

**Practitioner / community:** [Three directories for AI-agent-friendly projects](https://zjor.medium.com/three-directories-that-make-your-project-ai-agent-friendly-a243933e808c) · [Liip — Preventing context pollution](https://www.liip.ch/en/blog/preventing-context-pollution-for-ai-agents) · [Chris Lema — AI context failures](https://chrislema.com/ai-context-failures-nine-ways-your-ai-agent-breaks) · [Apideck — MCP eating the context window](https://www.apideck.com/blog/mcp-server-eating-context-window-cli-alternative) · [Permit.io — Human-in-the-loop](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo) · [bswen — Prevent AI agent file deletion](https://docs.bswen.com/blog/2026-03-11-prevent-ai-agent-delete-files/) · [Practical DevSecOps — MCP vulnerabilities](https://www.practical-devsecops.com/mcp-security-vulnerabilities/) · [Mastra — structuring projects for agents](https://mastra.ai/blog/how-to-structure-projects-for-ai-agents-and-llms) · [cli-guidelines](https://github.com/cli-guidelines/cli-guidelines)

---

*End of guide. Found an error or a tool behavior that's changed? This is a living document — corrections improve it more than additions. Re-verify any tool-specific claim against current vendor docs before depending on it.*
