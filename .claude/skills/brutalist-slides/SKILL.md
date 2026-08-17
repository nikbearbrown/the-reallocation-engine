---
name: brutalist-slides
description: >
  Generate D3 + HTML lecture slide decks that follow the Brutalist slide-design
  principles (the twelve failure modes of "Brutalist: Using D3 and HTML to Make
  Slide Decks"). Use when the user types `slides`, `slide deck`, `deck`, `present`,
  `lecture slides`, `d3 slides`, or asks to turn a chapter/topic into a presentation,
  build a live deck and study artifact, or render assertion-evidence slides. NOT the
  course-outline tool — this produces the actual visual layout: a self-contained,
  navigable HTML deck with speaker notes and inline D3 figures, styled by DESIGN.md.
  Default output is a single runnable .html file. Never ships placeholder slideuments.
---

# Brutalist Slides — D3 + HTML deck generator

This skill turns a chapter, topic, or set of points into a **runnable slide deck**:
a single self-contained HTML file that navigates with the keyboard, carries speaker
notes, and renders figures as inline D3 v7 — all governed by the Brutalist
slide-design principles.

It is the *visual-layout* counterpart to a course outline. An outline says what to
cover. This skill decides what each slide claims, what one visual carries it, what
goes in the notes, and lays it out so it survives the back row.

## Design info lives in the repo's `brutalist/` folder (load before generating)

The skill reads its design authority from the **repo-root `brutalist/` folder**, not from
copies inside the skill. Load these from the repo root before generating:

- `brutalist/SLIDES.md` — the slide-decision authority. Phase 0–4 workflow, audience
  calibration, the twelve failure modes, per-slide and per-deck checklists. **Read it in full first.**
- `brutalist/DESIGN.md` — the visual authority. Six-color palette tokens, typography
  (EB Garamond / Inter / JetBrains Mono), spacing, contrast, dark mode. Colors come from here, only here.
- `brutalist/D3.md` — the D3 v7 coding constitution (pinned CDN 7.9.0, `var(--color-*)`,
  `(event,d)` handlers, ResizeObserver, accessibility). Governs every figure. (Formerly named
  `CLAUDE.md`; renamed to `D3.md` because it is the D3 stack file, not a Claude-Code config.)

This skill ships only the **runtime**:

- `deck-template.html` — the navigable deck shell you fill with slides. The layout engine SLIDES.md hands off to.

(The `SLIDES.md` / `DESIGN.md` / `D3-CODING.md` files inside this skill dir are pointer stubs
to the canonical `brutalist/` copies — do not edit them; edit `brutalist/`.)

When the constitution files conflict: DESIGN.md wins on visuals, SLIDES.md wins on
slide decisions, D3.md wins on figure code.

## When to use

Trigger on: "make slides", "slide deck", "deck", "lecture slides", "present this
chapter", "d3 slides", "live deck + study artifact", "assertion-evidence slides".

Do **not** use for: a course outline or syllabus (that is the courses tool); a one-off
single figure (use the chapter figure prompts / D3-CODING.md directly).

## Workflow

1. **Load context.** Read `SLIDES.md`, `DESIGN.md`, and `D3-CODING.md` from this skill
   directory in full. Do not work from memory of them.

2. **Phase 0 — declare intent** (SLIDES.md Phase 0). Get four answers before generating
   one slide: (Q1) chapter deck or book deck; (Q2) which chapter + deck type `live`/`study`/`both`;
   (Q3) the learning objective as one action-verb sentence — if it can't be stated with an
   action verb, stop; (Q4) the audience code (`intro`…`faculty`/`custom`). Audience binds for
   the whole session. If the user hasn't supplied these, ask once, concisely.

3. **Generate slide specs** through SLIDES.md Phases 1–3 (hook → prediction → concept build
   in dependency order → worked example → consolidation → synthesis → transfer). Honor the
   audience-adjusted density ceilings and the always-rules (assertion headline ≤12 words,
   one visual per live body, two-color discipline, no 3D, no gradients, populated notes).

4. **Assemble the deck.** Fill `deck-template.html` with the generated slides:
   - One `<section class="slide">` per slide: `<h1 class="headline">` (the assertion),
     a `.body` holding exactly one visual, and an `<aside class="notes">` with the speaker script.
   - **Prefer animated/interactive D3 for every figure.** In order of preference:
     (a) embed the chapter's existing D3 companion live — `<iframe class="fig" src="../../d3/<slug>-fig-NN.html" title="…" loading="lazy">`;
     (b) write a fresh **inline D3 v7** figure with enter transitions per D3-CODING.md;
     (c) only fall back to a static image (`<img src="../../images/<slug>-fig-NN.png">`) when no D3 figure exists and one is not worth authoring.
     Colors via the `--color-*` tokens in `:root` (from DESIGN.md). No hardcoded hex in deck CSS/JS.
   - **Path depth:** the deck lives at `slides/<deck-name>/index.html`, so the repo's figures are at
     `../../d3/…` and `../../images/…` (two levels up).
   - `live` deck: notes hidden (presenter view shows them). `study` deck: set `data-mode="study"`
     so notes render inline beneath each slide and any retrieval prompt uses the reveal block.
     `both`: emit two files, `<slug>-live.html` and `<slug>-study.html`.

5. **Phase 4 — quality gate.** Run the per-slide gate (one PASS/FAIL line per slide) and the
   five per-deck checks (D1–D5). Fix every failure before delivering. Never ship a deck with a
   known failure or an empty notes field on a sparse slide.

6. **Deliver.** Write the deck to the book's `slides/` directory as `slides/<chapter-slug>[-live|-study].html`
   (create `slides/` if absent) and present the file. Self-contained: it opens in any browser,
   needs no build step, no network except the pinned D3 CDN.

## The deck runtime (deck-template.html) — what it gives you

- 16:9 slides, projection-scaled type (assertion headline ≈ 2× body), DESIGN.md palette, dark-mode + reduced-motion.
- Keyboard nav: → / Space / PageDown advance, ← / PageUp back, `Home`/`End` jump, `f` fullscreen,
  `s` toggle speaker/presenter view (current + next + notes + timer), `o` slide overview, `?` help.
- A slide counter, a progress bar, and deep-linking via `#<n>`.
- `data-mode="study"` renders the notes inline and turns transfer prompts into click-to-reveal.
- Figures live inline per slide; each is an accessible SVG (`role="img"`, `<title>`, `<desc>`).

## Hard rules (from the book, non-negotiable)

- Headline is a full-sentence **claim**, not a topic label.
- One visual per live-deck slide body; no prose paragraph on the body.
- Run the three-failure-mode text audit (redundancy → notes; seductive detail → cut/Background; density → segment) before any text lands on a slide.
- Two colors per slide: one neutral, one accent where the claim points. No color that can't be named in one word.
- WCAG contrast ≥ 4.5:1 (target 7:1 for projection). No gradient backgrounds. No 3D charts.
- Every live slide has populated speaker notes. An empty notes field on a sparse slide is a blocking failure.
- Decks declare their mode (live / study) and honor it. A hybrid is a slideument.

*Source of authority: DESIGN.md (visuals) · SLIDES.md (slide decisions) · D3-CODING.md (figure code).*
