# CHECKS-REPORT — claude-liam-reallocation-engine-current-state

**Date:** 2026-08-23 (updated; original 2026-08-21)
**Build type:** slate cut (art run)
**Standing order:** stop here. Bear reviews and decides next steps.

---

## Slate cut

| Item | Value |
|---|---|
| File | `claude-liam-reallocation-engine-current-state-slate.mp4` |
| Duration | 303.2 s (5:03) |
| Canvas | 3840 × 2160 (4K) |
| Beats filled | **37 / 37** |
| Beats as SLATE | **0 — all beats filled** |
| Audio | per-beat Kokoro am_onyx narration |

**Change from prior report (2026-08-22):** B30/B31 converted from SLATE to REMOTION/GRAPHIC.
- B30 → REMOTION/ClaudeCodeBeat: status.md frontmatter displayed in code terminal skin
- B31 → GRAPHIC/B31_StatusCrossout: three stale claims with terracotta strikethroughs drawing through each

Beats filled: 35/37 → **37/37**.

---

## Gate roster

| Gate | Result |
|---|---|
| GATE-F (factcheck) | **PASS** (1 advisory — see below) |
| GATE-L (beat-mix lint) | **PASS** warnings only (gate_s=warn) |
| GATE-BANNED-CARD | **PASS** |
| GATE-SWEEP-WARN | **PASS** |
| GATE-A (static pre-flight) | **PASS** — B31_StatusCrossout clean |
| GATE-B (layout audit) | **PASS** — B31_StatusCrossout clean (strikethrough lines marked `_qc_intentional=True`) |
| GATE-G (diagram) | **PASS** — no diagram beats |
| GATE-V (visual QC) | **FAIL** — 18 structural underfill (BLOCKER=0) |
| GATE-T | NOT RUN |
| GATE-SHARPNESS | NOT RUN |
| GATE-BOOKEND | NOT RUN |
| GATE-AUDIO | **PASS** — mean_volume −23.9 dB |
| GATE-MASTER | NOT RUN |
| GATE-LOUDNESS | NOT RUN |
| GATE-RECEIPTS | NOT RUN |

---

## GATE V — current result

```
frames=74  BLOCKER=0  STRUCTURAL=18  COSMETIC=6
```

**BLOCKER=0.** All edge-bleed BLOCKERs cleared (prior sessions).

### Structural underfill — 18 defects

All 18 defects are `underfill` in Manim GRAPHIC beats. The scenes use minimal typographic
compositions (text tables, equations, isotype grids) that don't fill 55% of the 4K safe area.

| Beat | Fill % | Min | Scene type |
|---|---|---|---|
| B03 | 45% | 55% | isotype grid — 21 ch / 25 cmd / 41 recipes |
| B05 | 44% | 55% | BrutalistCalendarWall — sheet centered in dark surround |
| B09 | 26% | 55% | 3-row text table — claim/rate/confidence → source |
| B11 | 54% | 55% | formula collapse + score=0 text |
| B16 | 30% | 55% | 3-row text table — attestation requirement |
| B24 | 34% | 55% | 3-row text table — audit trace |
| B26 | 48% | 55% | equation + [VERIFY] box + 2 lines |
| B31 | 30–31% | 55% | 3-row claims with strikethroughs — status.md stale claims |
| B32 | 37% | 55% | 3-row text table — status.md vs tree |

B31 matches the text-table pattern of the other underfill scenes (B09/B16/B24/B32).
Font-size reduced to 26 from 34 to pass GATE A static checker (static estimator over-predicts Pango text width for long strings).

**Fix options for Bear to decide:**
- Scale up font sizes (font_size ×1.4) and isotype square sizes to fill more of the frame, OR
- Accept underfill with ART_STRICT=0 (downgrades STRUCTURAL to warnings) for this first pass, OR
- Restructure some beats — e.g., give B09/B16/B24/B31 more rows or a visual separator

### Cosmetic low-contrast — 6 flags (B17/B18/B19, accepted as intentional)

| Frame | Luminance sep. | Min |
|---|---|---|
| B17_50, B17_85 | 0.17 | 0.30 |
| B18_50, B18_85 | 0.18–0.19 | 0.30 |
| B19_50, B19_85 | 0.23–0.24 | 0.30 |

Falling ghost items at 42% opacity on dark ground — intentional design. Items that settle
(B18/B19) land in cream or terracotta at full opacity. The low-contrast is the ephemeral/
falling-away visual effect; items that survive land bright. Not fixing.

---

## B03 GATE B title position — cached render may be stale

The first art run rendered B03 with `buff=0.5` in `_title()` (title top at y=3.5,
outside the ±3.4 safe area). The current `scenes.py` has `buff=0.65` (fixed), but
the cached `manim/B03.mp4` was NOT replaced because GATE B blocked the slot.

**Action needed:** delete `manim/B03.mp4` and re-run to get a fresh render that
passes GATE B, before any final cut.

```bash
rm the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state/manim/B03.mp4
```

---

## B30 visual — ClaudeCodeBeat / status.md frontmatter

B30 shows status.md as a clean, authoritative code terminal beat using ClaudeCodeBeat.
Content: `updated: 2026-06-14` + canonical field + DRAFT recipes quote.
BrutalistDateCard overlay composites date readout (June 2026) right-anchored in claude-dark.
No underfill detected on B30 — code terminal fills the safe area adequately.

---

## B31 visual — B31_StatusCrossout / terracotta strikethroughs

B31 uses the new `B31_StatusCrossout` Manim scene: three stale claims from status.md fade in,
then terracotta strikethroughs draw through each while the text stays visible.
`strike._qc_intentional = True` set on all three Line objects to exempt them from GATE B
TEXT_ON_CURVE check (intentional annotation, not an accidental label-on-graph).
BrutalistDateCard overlay composites elapsed=68 DAYS STALE right-anchored in claude-dark.

---

## Per-beat visual report — B17/B18/B19 (prior session)

**B17** (`retainWhen:[]` — nothing settles): All 57 items raining in ghost at 42% opacity.
No terracotta. No settled items. Motion reads as "everything drafted, nothing signed."
All items within SAFE clip. Names legible during fall at 30px mono. Nothing crosses SAFE.
Type above 24px floor. ✓

**B18** (`retainWhen:["ATTESTED"]`, settleAtSec:0.6, 3.48s beat): At t+3.4s (settleP≈0.95),
three terracotta items settled into grid with underlines extending. Remaining 54 items
raining in ghost. "Then a signature landed" reads as a visual event at ~0.6s into the beat.
Terracotta is the only accent. Grid columns balanced. Type legible at settle size 34px.
Underlines drawing in correctly. No human names on screen — only recipe file stems. ✓

**B19** (`retainWhen:["ATTESTED","RUNNABLE-LIVE","RUNNABLE-SAMPLE"]`): Mid-beat frame: 5 items
settled — 3 terracotta (ATTESTED), `workday-connector` cream, `skill-demand-monitor` cream.
28 DRAFT recipes + 24 COMMAND items raining in ghost. Three-tier colour distinction
(terracotta / cream / ghost) renders clearly. No human names on screen. ✓

---

## Lane distribution (body beats)

| Lane | Count | % | Status |
|---|---|---|---|
| REMOTION | 27 | 72.9% | advisory — over ~40% cap |
| GRAPHIC (Manim) | 10 | 27.0% | OK |
| STILL (VOX) | 0 | 0% | — (was WARN; B30/B31 converted to REMOTION/GRAPHIC) |

B30/B31 conversions eliminated the VOX lane entirely. REMOTION rose from 60.6% to 72.9%.
Both are advisory only (MOTION.md guidance). Bear decides if lane rebalancing is warranted.

---

## Non-blocking advisories

1. **FC-4**: B04 and B05 speak a figure or quantity with no FACTCHECK row. Either add rows or confirm the numbers are not claims.
2. **beat-lint**: 11 card beats have long narration (6 over 8 s) with no `motion_claim`. These compile as still cards with spring animation. Add `motion_claim` fields or shorten narration if intentional staging is needed.
3. **Remotion cap**: REMOTION carries 27/37 beats (72.9%), over the ~40% pantry cap. MOTION.md has guidance on converting excess beats to another language.

---

## Standing order

**STOP here.** Bear reviews the slate cut and this report.
No `art final`, no `art post`, no 4K, no TOPOST, no publish.
