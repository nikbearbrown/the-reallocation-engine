# BUILD-PROMPT — claude-liam-reallocation-engine

Paste-ready Claude Code prompt. Run from `books/` (typically under
`claude --dangerously-skip-permissions` — legal here: git-tracked, regenerable
outputs, and GATE P still requires a human signature before any paid spend).

---

Build the deep-explainer reel at
`the-reallocation-engine/youtube/claude-liam-reallocation-engine/` from its
`beat_sheet.json`. This is a deep-explainer (governs: deep-explainer SKILL.md →
ai-explainer → explainer; closing block per your-turn). Channel `claude-liam`,
Kokoro `am_onyx`, free pipeline — no ElevenLabs.

Phases, in order, stopping at every gate:

1. **FACTCHECK** — verify every claim in SOURCES.md's claim ledger against the
   repo files it names (quote-check B16/B21 code beats character-for-character
   against `scripts/score/role-scorer.mjs`; re-run the five harnesses if the
   scorer has changed since the sheet was authored and update B25's output
   lines to the fresh real output). Write FACTCHECK.md (claim | verdict |
   source | fix). Mark B21's negation bug as independently reproduced or
   re-reproduce it. GATE: claims hold — human confirms.
2. **GATE P** — render the narration on an animated slate cut for review.
   Human signs off narration BEFORE audio.
3. **AUDIO** — `generate_audio.py` (Kokoro am_onyx); then the align step for
   the word clock. Audio lock: measured mp3 durations become the clock.
4. **GATE D2** — tier-0 pantry pass for the 6 VOX slots
   (`pantry_search.py "<terms>" --copy … --beat <BID>` for B03 B05 B06 B11
   B22 B26), then write SHOPPING.md from LOCKED durations, tier-tagged
   (all six are planned tier-1 generic; confirm). Hand unmatched entries to
   the human.
5. **GATE D1** — `./art run the-reallocation-engine/youtube/claude-liam-reallocation-engine`
   → full-length slate previz (VOX slots as slates, Manim/Remotion real,
   audio real), `--review` burn-in. Human watches for pacing.
6. **PANTRY FILL** — intake dropped stills (treatment: desat ~80%, contrast
   1.15, cream stage #F2F0E9, grain, warm-ink vignette, ONE terracotta
   accent); set `shot.focus`; `.source.txt` sidecars for any archive slot.
   Honor the R1 vox-run handoff (B05→B06 camera pinned at 0.5/0.42 @1.45).
7. **REVIEW CUT → VISUAL QC** — full 9-point frame-level QC pass
   (`CLAUDE-CODE-VISUAL-QC-CHECK.md`): sample ≥2fps + 15/50/85% per beat,
   READ the PNGs, `_qc/REPORT.md`, fix root causes, re-render to zero
   BLOCKER/MAJOR. FILL-THE-CANVAS applies to every Manim/C2/C3 beat.
8. **`./art final`** — master stays in the folder. NEVER publish; going
   public is a human Studio flip.

Standing laws to honor: COLD OPEN (B00 ClaudeComposerAsk, ask lands answered),
ASK→RESULT (BASK1→B10, BASK2→B25), ILLUSTRATE (UI only at bookends/asks/
verdict/handoff), SHOW-DON'T-TELL (each beat's `show` array is the spec),
SPARK-LINE (≤4-word serif lines on illustration beats), LOGO LAW (NBB bug
lower-right every beat, full-size at BOUT), one terracotta moment per beat,
IN-FOR-BEAR (Liam self-identifies at B00 and BOUT). Report at the end:
durations, QC summary, gate signatures. Do not publish.
