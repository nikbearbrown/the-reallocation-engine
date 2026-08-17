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
