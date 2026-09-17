# SAVE-STATE — 2026-08-23 (compaction confirmed by Bear)

**Primary Request and Intent:**
Build the deep-explainer reel at `the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state/`. GATE F (factcheck) PASS with 2 corrections applied; facts signed off by Bear. User said "NO MORE GATES … build the slate with audio" — skipped GATE P. Bear reviewed slate, said "Looks great", and issued the publish instruction: art final → art post → upload to @NikBearBrown "Claude" playlist (16:9, unlisted, no 9:16), GATE T required.

Hard rules: NO REAL NAME ON SCREEN OR IN NARRATION; Remotion ONLY via `remotion_scenes.py`; log in BUILD-LOG.md.

**Work Completed:**
1. Audio generation: All 37 beats via `generate_audio_kokoro.py`, am_onyx voice, $0.00 cost. Files in `mp3/`.
2. scenes.py: 9 Manim scene classes (B03/B09/B10/B11/B16/B20/B24/B26/B32 + B31_StatusCrossout). buff=0.65 in `_title()` (GATE B fix). B10/B26 Rectangle→Line fixes for GATE A.
3. SHOTLIST.md and PROMPTS.md written (required by GATE F).
4. All 9 Manim clips rendered into `manim/`.
5. All Remotion clips rendered into `media/`.
6. B30 filled → `media/B30.mp4` (ClaudeCodeBeat, Aug 23 00:29).
7. B31 filled → `manim/B31.mp4` (B31_StatusCrossout, Aug 23 00:28).
8. Full cut compiled → `claude-liam-reallocation-engine-current-state.mp4` (28M, Aug 23 00:31), 37/37 filled, 303.2s.

**Gate states:**
- GATE F: PASS (signed 2026-08-21, facts signed off by Bear)
- GATE L: PASS (11 card-over-runtime advisories, non-blocking)
- GATE BANNED-CARD: PASS
- GATE SWEEP-WARN: PASS
- GATE A: PASS
- GATE B: PASS
- GATE G: PASS
- GATE V: FAIL — BLOCKER=0, STRUCTURAL=18 (Manim underfill, accepted for first pass), COSMETIC=6 (B17/B18/B19 ghost rain, intentional)
- GATE T/SHARPNESS/BOOKEND/AUDIO/MASTER/LOUDNESS/RECEIPTS: NOT YET RUN (art final pending)

**Known advisories (non-blocking):**
- B03 stale cached render — `manim/B03.mp4` rendered with old buff=0.5; must `rm manim/B03.mp4` before art final so it re-renders with buff=0.65
- 18 STRUCTURAL underfill (Manim text-table scenes)
- 11 FormACard beats over 8s with no `motion_claim`
- REMOTION at 72.9% lane share (advisory)
- FC-4: B04/B05 speak figures with no FACTCHECK row (non-blocking)

**Reel folder:** `the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state/`

**Pending:** art final (GATE T must pass) → art post → verify staged.json → publish to @NikBearBrown "Claude" playlist (unlisted, 16:9 only).
