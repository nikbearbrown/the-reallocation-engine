# brutalist/ — the visual source of truth

This folder is the **single, self-contained visual system** for this repository. Clone the repo
and you have everything needed to produce on-brand visuals — no external dependency.

## Files

- **DESIGN.md** — the visual constitution: brand color tokens, typography, spacing, contrast,
  dark mode. **This is where you change brand colors and fonts.** Edit here and every figure,
  slide, and SVG inherits the new brand.
- **D3.md** — the D3 v7 coding constitution for interactive figures (pinned CDN, `var(--color-*)`,
  accessibility, ResizeObserver). *(Formerly named `CLAUDE.md` — it is the D3 stack file.)*
- **SLIDES.md** — slide-deck generation rules; decks live in `slides/<deck-name>/index.html`.
- **PROJECT.md** · **SaulBass.md** · **VIZ.md** — supporting design references.

## Rule

All visual media in this repo — slides, SVGs, D3 charts, diagrams, images, generated graphics —
**must follow `brutalist/`**. Use only the DESIGN.md palette tokens and type stack; meet its
contrast minimums. To re-skin the whole repo, edit `DESIGN.md` only.

The `brutalist-slides` skill (`.claude/skills/brutalist-slides/`) reads its design info from this
folder. An upstream backup lives at `bear-textbooks/brutalist/`; this in-repo copy is authoritative.
