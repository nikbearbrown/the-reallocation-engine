# Chapter Enrichment Log — the-reallocation-engine

**Date:** 2026-06-15
**Pass:** Tables & Figures enrichment (in place, `chapters/`)
**Design authority:** `brutalist/CLAUDE.md` (D3 v7) + `brutalist/DESIGN.md` (visual constitution)

## Totals

| Metric | Count |
|---|---|
| TABLE comments rendered → markdown tables | 17 |
| TABLE comments remaining | 0 |
| FIGURE comments bound + preserved | 34 |
| Figure image references in chapters | 66 |
| Static SVGs (`images/`) | 68 |
| PNGs (300 DPI, `images/`) | 68 |
| Interactive D3 v7 files (`d3/`) | 48 |
| Chapters with a `## Prompts` section | 18 |

## What changed

- **Pass 1 — Tables:** every `<!-- [TABLE: …] -->` comment replaced with a GitHub-flavored markdown table inferred from surrounding prose, with an italic `*Table N — caption*` line. No headings added above tables.
- **Pass 2 — Figures:** each `[IMAGE/FIGURE/DIAGRAM/INFOGRAPHIC/CHART]` comment was **preserved** (never removed); an `![alt](images/{slug}-fig-NN.png)` + `*Figure N.N — title*` was inserted directly above it. Each bound figure got a brutalist static SVG (hardcoded palette, viewBox `0 0 700 420`, role/title/desc) and a self-contained D3 v7 HTML companion (pinned cdnjs 7.9.0, `var(--color-*)` theming, dark mode, reduced motion, ResizeObserver, `(event,d)` handlers, zero-baseline bars, inline FALLBACK_DATA, ARIA).
- **Pass 3 — CAJAL reconciliation:** figure comments were bound to the existing CAJAL figure number that depicts them by content; remaining unreferenced CAJAL figures inserted at semantic spots. Two new figures were minted where a comment had no CAJAL match (ch7 fig-05, ch8 fig-05).
- **Pass 4 — PNG:** `node scripts/svg-to-png.mjs` regenerated PNGs from updated SVGs. SVG/PNG parity = 68/68.
- **Pass 5 — Prompts:** every enriched chapter carries a `## Prompts` section, one entry per figure.

## Path normalization

- An agent initially wrote 19 references as `../images/…`; all chapter image references were normalized to the `../images/…` form (relative to `chapters/`, matching both sibling books). All 66 references resolve.

## Invariants honored

- No prose, headings, or exercises altered outside comment regions and the appended `## Prompts` sections.
- No FIGURE comments removed. Palette: zero off-palette colors remain in `images/*.svg` (one stray `#D55E00` stroke remapped to `--color-red`).
