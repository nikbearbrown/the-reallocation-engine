<!-- GENERATED FILE — do not edit by hand.
     Source: instructions/ (_shared/ modules + project file) · manifest: instructions/manifest.yml
     Rebuild: node scripts/build-instructions.mjs   ·   Promote: --promote
     Hand edits are overwritten on the next build. -->

# Agent Instructions

## Governance

Read `SNICKERDOODLE.md` (the constitution — principles, the verification stack, the recipe lifecycle, the logging rules) and `DOMAIN.md` (this project's index — layout and what is runnable today) before acting. If any file conflicts with `SNICKERDOODLE.md`, `SNICKERDOODLE.md` governs and the conflict is a bug — log it in `logs/RUN_LOG.md`.

The contract in brief (SNICKERDOODLE.md governs in full):

1. Verified local data before external lookup; stored scripts before ad-hoc code.
2. Never invent a count, rate, or confidence; label model judgments as judgments.
3. Gates are hard stops cleared by a named human and logged.
4. Machines verify conformance; humans verify adequacy.
5. Log meaningful runs, blockers, and artifacts in `logs/RUN_LOG.md`.

## Default to Markdown for humans

AI-native formats (JSON, YAML) are the source of truth for the machine. When showing an artifact to a person, render the Markdown view (`scripts/to-markdown.mjs` / the `review` skill) by default. Show raw JSON/YAML only when asked.

## Visual media — follow `brutalist/`

All visual output in this repository — slides, SVG figures, D3 charts, diagrams, images, and any
generated graphic — follows the guidelines in the repo-root **`brutalist/`** folder. It is the
single source of truth and ships with the repo: clone it and you have the whole visual system.

- `brutalist/DESIGN.md` — brand: color tokens, typography, spacing, contrast, dark mode.
  **Change brand colors and fonts here**; every figure, slide, and SVG inherits the change.
- `brutalist/D3.md` — the D3 v7 figure-code constitution (pinned CDN, `var(--color-*)`, accessibility).
- `brutalist/SLIDES.md` — slide-deck rules; decks live in `slides/<deck-name>/index.html`.

Use only the DESIGN.md palette tokens (no hardcoded hex outside those tokens) and its type stack,
and meet its contrast minimums. To re-skin this repo's brand, edit `brutalist/DESIGN.md` only.
(`bear-textbooks/brutalist/` is an upstream backup; the in-repo `brutalist/` is authoritative.)
## Figure QA — two passes, always after (re)generating images

Whenever a figure is generated or regenerated (`npm run svg-to-png`), run BOTH review passes
before committing. Keep them separate — a layout fix never resolves a substance flag.

1. **Layout (geometry, deterministic):** `npm run audit:layout` — flags text outside the canvas,
   overflow, text struck by a line/arrow, overlapping labels, and risky glyphs. This runs
   automatically after `npm run svg-to-png` (see the `postsvg-to-png` script). Fix geometry first.
2. **Accuracy (substance, domain expert):** follow **`ACCURACY-REVIEW.md`** — paste the chapter and
   its figures; verify domain correctness by computation/source, check notation/rendering, audit the
   chapter's stats/tables/formulas, and resolve every `**[verify]**` tag.

Order: layout first, accuracy second.

## Never delete — archive instead

Never delete source, data, recipes, logs, or any hand-made file. Move superseded or scratch files to an archive (or out of the working tree into the full-copy archive). The only safe removals are generated/rebuildable artifacts — `**/.build/`, `__pycache__/`, `*.pyc`, `*.bak` — because they regenerate from source. When in doubt, archive and ask.

## Personal data — read locally, never commit

This repo is public. Real personal data (the user's actual résumé, application
tracker, contacts, outcomes) lives in `private/` and in `data/ats/` (both gitignored
except their policy/README/example files). You may **read** these to help the user —
tailor a résumé, score a role, draft outreach — but you must never:

- copy or paraphrase personal data into a **tracked** file (a chapter, a committed
  report, a fixture, a log) — keep it inside `private/`;
- echo personal data into output that will be committed or pushed;
- move a file out of `private/`/`data/ats/` into a tracked location.

The machine half enforces this: `npm run doctor` fails if any private path is
git-tracked (scaffolding — README, `.gitignore`, `*.example.*` — is exempt). If you
generate an artifact *from* private data, write it back into `private/`, not into the
tracked tree. When in doubt, treat it as private and ask.

## Conformance before done

Run `node scripts/conformance.mjs <paths>` (or `npm run verify`) before declaring work complete. Invalid JSON / YAML / JS is not done — it is not even gradeable. This is the machine half of P4; whether the content is *adequate* is still the human gate.

## Scope subagents narrowly

Give a subagent only what its task needs — the index (`DOMAIN.md`), the one relevant subfolder, and the specific files named. Never hand a subagent the whole repository. Subagents run in their own context window and should return a summary, not raw file dumps.

## Reporting completion

Before reporting a task complete, state: files changed; scripts or data checked; tests, builds, or searches run; and any unverified assumptions or remaining risks. No silent done.

## The Reallocation Engine

An **evidence-first job-search system for international students** (F-1/OPT/STEM OPT), and the working repository for the book *The Reallocation Engine*. It reallocates scarce application effort using five evidence components — company funding (SEC Form D), sponsorship history (DOL/H-1B), posting liveness (ATS), role quality (BLS/O*NET), and visa timeline — where liveness and timeline are **gates, not votes** (a healthy run skips at least half of evaluated roles). It is a domain built on the Snickerdoodle framework. Project-specific rules:

- Read `_MANIFEST.md` for the portable read-first map — what is canonical, task-relevant, generated, or private (a thin index over `SNICKERDOODLE.md` / `DOMAIN.md`; machine-readable twin in `.ai/manifest.yaml`).
- Use lowercase `scripts/`; never create `SCRIPTS/`.
- Manuscript content lives in `chapters/` — no scripts or data there.
- `data/ats/`, rendered resumes/PDFs, and `.env*` are **private by default** — review before commit (they reveal personal job-search activity).

### `help` command

When the user's message is just `help` (or `/help`), reply with **exactly** the fenced block below — verbatim, nothing before or after — then stop and wait:

```
THE REALLOCATION ENGINE — evidence-first job search (a Snickerdoodle domain)
Reallocate scarce application effort by evidence. The rule of the house:
fluency is the first sign of trouble — the human owns the irreducible judgment.

WHAT YOU CAN DO
  recipes    Read a recipe + its run evidence (best first look):
             recipes/ (44 recipes — scan, pipeline, oferta, tracker, pdf, patterns…)
  runnable   npm run ats:scan -- --dry-run   ·   ats:liveness <url>   ·   ats:verify
             npm run resumes:pdf -- --all    ·   python3 scripts/sec/refresh-recent-sec-quarters.py
  evidence   SEC Form D (funding) · DOL/H-1B (sponsorship) · ATS (liveness, a GATE)
             BLS/O*NET (role quality) · visa timeline (a GATE)
  book       The Reallocation Engine manuscript: chapters/ (21 chapters)
  data       Two-layer target data/raw -> data/verified (planned); domain dirs run today
  scripts    conformance · to-markdown · build-instructions · svg-to-png

HOW IT WORKS
  Every finding traces report -> log -> recipe -> source. Gates are hard stops a named
  human clears. Skip is a successful outcome. Machines verify conformance; humans verify
  adequacy. (Constitution: SNICKERDOODLE.md)

TRY
  "run the ats scan dry-run and read the report"   ·   "what's runnable today?"
  "show me the scan recipe"                        ·   "list the known defects"
```
