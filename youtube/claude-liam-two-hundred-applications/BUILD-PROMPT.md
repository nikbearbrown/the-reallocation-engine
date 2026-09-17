# BUILD-PROMPT — claude-liam-two-hundred-applications

Paste-ready Claude Code prompt. Run from `books/` (typically under
`claude --dangerously-skip-permissions` — legal here: git-tracked, regenerable
outputs, GATE P still requires a human signature before spend).

---

Build the ai-explainer reel at
`the-reallocation-engine-fresh/youtube/claude-liam-two-hundred-applications/`
from its `beat_sheet.json`. Family: ai-explainer (claude-liam channel, Kokoro
`am_onyx`, free — no ElevenLabs). This is Episode 2 of "The Reallocation
Engine" playlist: the book's Introduction — the felt problem.

Phases, stopping at every gate:

1. **Verify the source is current** — diff the claim ledger in `SOURCES.md`
   against `book/chapters/00-introduction.md` in the working tree. If Mira's
   scenario numbers, the RCT figures, or the "How to read this book" commands
   changed, update B01/B02/B04/B10 to match and log it. Re-confirm B10's
   commands against `package.json` and `data/examples/` — `npm run score`,
   `ch11-roles.json`, `role-scores.md` must all still exist. If the sample data
   is present, prefer running the scorer and pasting the REAL audit rows into
   B10's code-block over the illustrative worked-example values (see SOURCES.md
   → Command verification).
2. **anim.json** — author the C2 pattern table for B02 (AttritionChain), B03
   (BinaryBranch) and B05 (DivergentFates). Data comes only from the
   narration's own claims: B02's survival fractions are the chapter's "about a
   third" (0.67) and "more than half" (0.5) — do not invent a third stage.
   Present the table. GATE: human signs.
3. **GATE P** — animated slate cut of the narration for review; human signs off
   BEFORE audio. Flag at this gate: the reel runs ~6:01, longer than Episode 1
   (4:38). If the human wants it tighter, B08 (`TRUST IT LESS` — the systems
   judging you) is the designated cut: it is the only beat whose supporting
   figures are all `[verify]`-flagged and already stripped, and B09 carries the
   "trust it less" argument on its own. Cutting it lands the reel at ~5:37.
4. **Audio** — `generate_audio.py` (Kokoro `am_onyx`), then align for the word
   clock. Audio is the master clock; conform, never hand-time. Note B04, B09
   and BHTF carry mid-sentence reveals — use `sub_beats` word-level timing so
   the sting label, the external-check arrow, and the prompt lines land ON the
   spoken word.
5. **Visuals** —
   - Manim: `B01_TwoCounters`, `B04_TwoLetterGrades`, `B09_SelfAudit`,
     `B11_TheReallocation` per their `production_viz` specs (cream canvas, ink
     strokes, single terracotta accent). **B11 is a deliberate visual rhyme with
     B01** — same numerals, same positions, different outcome. Build B01 first
     and derive B11 from it; if they don't rhyme, the callback fails.
   - C2 patterns from `runtime/remotion/src/deckPatterns.tsx`: `AttritionChain`
     (B02), `BinaryBranch` (B03), `DivergentFates` (B05). Props are authored
     against the installed type signatures (`AttritionData`, `BranchData`,
     `FatesData`) — retint the pattern constants to the claude stage (cream
     `#F2F0E9`, ink `#3D3929`, accent `#D97757`, warn `#A44A32`) and log the
     retint as a decision in BUILD-LOG.md.
   - C3 illustrations from `runtime/remotion/src/illustrations/structural.tsx`:
     `PredictCard` (B06), `ChipGrid` (B07), `SourceFlow` (B08). Adapt props,
     not motion math; log prop changes.
   - Onda `code-block` for B10 — commands character-for-character.
   Each beat's `show` array is the SHOW-DON'T-TELL spec.
6. **Compile → VISUAL QC** — `compile.py`, then the full frame-level 9-point QC
   pass (`CLAUDE-CODE-VISUAL-QC-CHECK.md`): sample ≥2fps plus 15/50/85% per
   beat, READ the PNGs, write `_qc/REPORT.md`, fix root causes, re-render to
   zero BLOCKER/MAJOR. Watch two specific risks: B02's 200-dot grid must stay
   inside `SAFE` at full count, and B10's code-block must not shrink below the
   legibility floor to fit its comment lines — FILL-THE-CANVAS on every graphic
   beat.
7. **`./art final`** — master stays in the folder. NEVER publish; the playlist
   upload is a human Studio action.

Laws in force: COLD OPEN (B00 `ClaudeComposerAsk`, ask lands answered),
ASK→RESULT (BASK1→B07), ILLUSTRATE (UI only at B00/BASK1/BVDT/BHTF/BOUT),
SPARK-LINE (≤4-word serif lines on illustration beats), HANDOFF (BHTF prompt
read verbatim then discussed — the discussion is mandatory, not the typing),
OUTRO (title restate), LOGO LAW (NBB bug lower-right, full-size at BOUT), one
terracotta moment per beat, IN-FOR-BEAR (Liam self-identifies at B00 and
signs off at BOUT), DOUBLE-CHECK (the stripped-figures table in SOURCES.md is
binding — no percentage from `[^00-premium]` / `[^00-screening]` and no named
vendor or case from `[^00-eightfold]` may reach the screen).

Report durations, QC summary, and gate signatures at the end. Do not publish.
