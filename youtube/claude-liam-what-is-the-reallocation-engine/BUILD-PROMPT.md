# BUILD-PROMPT — claude-liam-what-is-the-reallocation-engine

Paste-ready Claude Code prompt. Run from `books/` (typically under
`claude --dangerously-skip-permissions` — legal here: git-tracked, regenerable
outputs, GATE P still requires a human signature before spend).

---

Build the ai-explainer reel at
`the-reallocation-engine-fresh/youtube/claude-liam-what-is-the-reallocation-engine/`
from its `beat_sheet.json`. Family: ai-explainer (claude-liam channel, Kokoro
`am_onyx`, free — no ElevenLabs). This is Episode 1 of "The Reallocation
Engine" playlist: the visual README.

Phases, stopping at every gate:

1. **Verify the source is current** — diff the claim ledger in SOURCES.md
   against the repo's live `README.md`; if the README changed (especially the
   quick-start block or the "sixty to ninety days" line), update B09/B03 to
   match verbatim and log it. The reel must never drift ahead of or behind
   the README it visualizes.
2. **anim.json** — author the C2 pattern table (B04 divergence, B06
   threshold; data only from the narration's own claims). Present the table.
   GATE: human signs.
3. **GATE P** — animated slate cut of the narration for review; human signs
   off BEFORE audio.
4. **Audio** — `generate_audio.py` (Kokoro am_onyx), then align for the word
   clock. Audio is the master clock; conform, never hand-time.
5. **Visuals** — Manim scenes B02_FluencyTrap / B03_TheClock / B07_SkipDial
   per their production_viz specs (white canvas, ink strokes, terracotta
   accent); C3 illustrations from `runtime/remotion/src/illustrations/`
   (SourceFlow ×2, PredictCard, LayerStack, ChipGrid — adapt props, not
   motion math; log prop changes in BUILD-LOG.md); Onda code-block for B09
   with the README's commands character-for-character. Each beat's `show`
   array is the SHOW-DON'T-TELL spec — reveals land on the spoken word.
6. **Compile → VISUAL QC** — `compile.py`, then the full frame-level 9-point
   QC pass (`CLAUDE-CODE-VISUAL-QC-CHECK.md`): sample ≥2fps + 15/50/85% per
   beat, READ the PNGs, `_qc/REPORT.md`, fix root causes, re-render to zero
   BLOCKER/MAJOR. FILL-THE-CANVAS on every graphic beat.
7. **`./art final`** — master stays in the folder. NEVER publish; the
   playlist upload is a human Studio action.

Laws in force: COLD OPEN (B00 ClaudeComposerAsk, ask lands answered),
ASK→RESULT (BASK1→B09), ILLUSTRATE (UI only B00/BASK1/BVDT/BHTF/BOUT),
SPARK-LINE (≤4-word serif lines on illustration beats), HANDOFF (BHTF prompt
read verbatim and discussed), OUTRO (title restate), LOGO LAW (NBB bug
lower-right, full-size at BOUT), one terracotta moment per beat,
IN-FOR-BEAR (Liam self-identifies at B00 and BOUT). Report durations, QC
summary, and gate signatures at the end. Do not publish.
