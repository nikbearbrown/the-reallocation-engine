# brutalist-slides

A self-contained skill that turns a chapter or topic into a **runnable D3 + HTML
slide deck** following the Brutalist slide-design principles. The visual-layout
counterpart to a course outline.

## Invoke

Say "make slides for chapter N", "build a live deck + study artifact", "present
this chapter", or just `slides`. Claude will declare intent (Phase 0), generate
slides through the SLIDES.md workflow, and assemble a navigable HTML deck.

## What you get

`slides/<chapter-slug>.html` (or `-live.html` / `-study.html`) — opens in any
browser, no build step. Keyboard: → next · ← back · `f` fullscreen · `s`
presenter view · `o` overview · `?` help. Study mode renders speaker notes
inline and turns transfer prompts into click-to-reveal.

## Files

| File | Role |
|---|---|
| `SKILL.md` | Skill definition + workflow |
| `brutalist/SLIDES.md` (repo root) | Slide-decision authority (Phase 0–4, 12 failure modes, checklists) |
| `brutalist/DESIGN.md` (repo root) | Visual authority (palette, type, contrast, dark mode) |
| `brutalist/D3.md` (repo root) | D3 v7 coding constitution for figures (formerly CLAUDE.md) |
| `deck-template.html` | The deck runtime you fill with slides (3 worked example slides included) |

Design info is read from the repo's `brutalist/` folder. Authority: brutalist/DESIGN.md (visuals) · brutalist/SLIDES.md (slide decisions) · brutalist/D3.md (figure code).
