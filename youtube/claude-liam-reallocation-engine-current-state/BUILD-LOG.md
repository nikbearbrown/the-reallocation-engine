# BUILD-LOG — claude-liam-reallocation-engine-current-state

---

## 2026-08-21 — GATE F (factcheck)

All 18 claims verified against the live tree via grep, ls, node, and direct reads.

**Corrections applied to beat_sheet.json:**

1. **B19 narration** — "One recipe cleared a sample run on a student's attestation" was wrong. The tree has three named student attestations: gate-behavior (Yu-Chen Huang, 2026-08-09), gate-harness (Saloni Angre, 2026-08-11), local-wage-adjustment (Atharva Kurlekar, 2026-08-16). Corrected to "Three recipes cleared sample runs on student attestations." No names appear on screen or in narration (hard rule preserved).

2. **B32 narration + viz** — "Seven of them aren't [DRAFT]" was wrong by one. Top-level recipe status: 6 RUNNABLE-SAMPLE + 2 RUNNABLE-LIVE = 8 non-DRAFT files. Consistent with B20 isotype which shows 2+6=8. Corrected to "Eight of them aren't." State_card row and note updated to "8 are not."

**All other claims: PASS.** Key confirmations:
- 41 top-level recipe .md files, 21 chapters, 25 npm scripts — exact matches
- Scorer formula (Σ vote·weight) × liveness × timeline — confirmed in role-scorer.mjs
- role_quality: 0.0 with [VERIFY] — confirmed
- reports/generated/oferta-2026-06-14.md ABSENT, logs/oferta-2026-06-14.json PRESENT — confirmed
- status.md dated 2026-06-14, canonical lists chapters/ (stale — actual: book/chapters/) — confirmed
- snickerdoodle CLI roadmap, Claude Code v0 runtime — confirmed in DOMAIN.md
- workday-connector RUNNABLE-LIVE, attestation: null — confirmed (no named student attestation for the connector)

**GATE F: COMPLETE.**

---

## 2026-08-21 — Gate waivers (human instruction)

Bear: "NO MORE GATES ... build the slate with audio."

- **GATE P** (narration review on slate before audio) — **WAIVED by human**
- **GATE D2** (SHOPPING.md after audio lock) — **WAIVED by human**
- Proceeding directly to: audio generation (Kokoro am_onyx) → `art run` slate cut.

## Gates

| Gate | State |
|---|---|
| 1 · plan | COMPLETE |
| F · factcheck | COMPLETE — 2 corrections applied |
| P · narration slate | WAIVED (human instruction 2026-08-21) |
| audio | COMPLETE — all 37 beats, Kokoro am_onyx |
| D2 · SHOPPING.md | WAIVED (human instruction 2026-08-21) |
| D1 · slate previz | COMPLETE — slate cut ready (303.2 s) |
| V · visual QC | FAIL — 14 underfill in Manim beats; see CHECKS-REPORT.md |

---

## 2026-08-21 — Slate cut complete

**Slate cut written:** `claude-liam-reallocation-engine-current-state-slate.mp4` (303.2 s, 4K)

**Scenes.py fixes applied this session:**
- Added `BearsDoodlesVideo` stub (hook compatibility — postedit-check.sh uses this class name)
- Fixed GATE W W7 violation: `_title` buff 0.5→0.65 to keep title within ±3.4 safe area
- Fixed `B26_RoleQuality`: removed word "chapter" from on-screen text (W7 CHAPTER-ON-SLIDE rule)
- Fixed `B10_ScorerFormula`: added `rule1`/`rule2` Lines so shape-state changes across 5 frames (static-scene distinctness check)

**GATE V result:** 14 STRUCTURAL underfill defects in Manim beats B03, B09, B11, B16, B24, B26, B32. All scenes have correct content but compose typographically — text tables and equations that occupy less than 55% of the 4K safe area. Fix options documented in CHECKS-REPORT.md.

**GATE B note:** `manim/B03.mp4` may be stale (rendered with buff=0.5 before the fix). Needs deletion before next render pass.

**STANDING ORDER: STOP.** Bear reviews CHECKS-REPORT.md and the slate cut.

---

## 2026-08-22 — BrutalistCommandRain + BrutalistDateCard wiring (STEPS 1–6)

### STEP 1 — Component verification (REMOTION-STANDARDS §9)

**BrutalistCommandRain** (new, unregistered at session start):
- Registered in `Root.tsx` under `<Folder name="Brutalist">` with `brutalistCommandRainDemoDefaultProps`; `scenes.json` regenerated → 753 renderable (+1)
- `npx tsc --noEmit` CLEAN for touched files
- Grep lint: ZERO hits across all 16 forbidden patterns (`Math.random`, `new Date(`, `useState`, `useEffect`, `useRef`, `setTimeout`, `setInterval`, `requestAnimationFrame`, `addEventListener`, `transition:`, `animation:`, `animate-`, `ResizeObserver`, `getContext`, `new Image`, `Date.now`). `Math.sin`/`Math.floor` in ported noise OK; `random()` from Remotion is the RNG.
- GATE-V BLOCKER (edge-bleed) found and fixed before wiring into beat sheet:
  - **Horizontal**: `colX` was `40 + r1*(width-80)` — items near canvas edges; wind pushed beyond safe. Fixed to `SAFE.x + r1 * SAFE.w` and wrapped all items in `<g clipPath="url(#safe-rain)">` with `<rect x={SAFE.x} y={SAFE.y} width={SAFE.w} height={SAFE.h} />`.
  - **Vertical**: rise formula was `interpolate(yFall, [-130, 60], [0, 1])` — items partially opaque above SAFE.y. Fixed clipPath to start at SAFE.y and rise formula to `interpolate(yFall, [SAFE.y, SAFE.y + 60], [0, 1])`.
- Same-frame-twice pixel-diff: ZERO
- Frame QC vs 9-point rubric: PASS (items within SAFE, typeface mono, terracotta accent correct, no static scenes)

**BrutalistDateCard**: verified in prior session; tsc and lint confirmed still CLEAN after Root.tsx addition.

### STEP 2 — rain_items.py fix + tree scan

**Bug fixed:** `local-wage-adjustment` was classified as `RUNNABLE-SAMPLE` instead of `ATTESTED`.

Root cause: SNICKERDOODLE lifecycle stores `attestation: null` at RUNNABLE-SAMPLE status even when a human signed a gate; the attestation evidence lives in `last_gate:` as `"...signed by a human (Atharva Kurlekar, 2026-08-16)..."`. Script only checked `attestation:` field regex and `'attestation.md' in head`.

Fix: added `last_gate_human = re.compile(r'last_gate:\s*["\'][^\'\"]*\([A-Z][a-z]+ [A-Z][a-z]+,\s*\d{4}-\d{2}-\d{2}\)')` and added `or last_gate_human.search(head)` to the ATTESTED promotion condition. Fix documented in FACTCHECK.md.

Correct path from reel folder: `python3 rain_items.py ../..` (script comment said `../../..` — wrong).

**Final counts** (match FACTCHECK.md exactly):
- 24 COMMAND + 33 recipes = 57 items → items.json
- ATTESTED: 3 (gate-behavior, gate-harness, local-wage-adjustment)
- RUNNABLE-LIVE: 1 (workday-connector)
- RUNNABLE-SAMPLE: 1 (skill-demand-monitor)
- DRAFT: 28

### STEP 3 — B17/B18/B19 wired to BrutalistCommandRain

Same 57-item items array on all three beats. One prop apart per BEATS-RAIN.md:

| Beat | retainWhen | settleAtSec | settleSeconds | seed |
|---|---|---|---|---|
| B17 | [] | 2.2 | 1.4 | 17 |
| B18 | ["ATTESTED"] | **0.6** | **1.2** | 18 |
| B19 | ["ATTESTED","RUNNABLE-LIVE","RUNNABLE-SAMPLE"] | 2.2 | 1.4 | 19 |

B18 `settleAtSec` shortened to 0.6 because actual_duration_s = 3.48 s — default 2.2 would land the attestation names after the cut.

`sparkWhen: ["ATTESTED"]` on all three — terracotta marks only what a human signed; RUNNABLE-* settles in cream.

All three beats: `shot.type → REMOTION`, `shot.remotion.pattern → BrutalistCommandRain`, `vox_run` key removed, `build.status → FILLED`.

### STEP 4 — B30/B31 BrutalistDateCard overlays

B30 overlay: `readout:"date"`, `targetDate:"2026-06-14"`, `fromDate:"2026-06-14"`, `label1:"Status file"`, `label3:"Last updated"`, `transparentBg:true`, `palette:"claude-dark"`, `align:"Right"`, Right-anchored date stamp showing the status.md update date.

B31 overlay: `readout:"elapsed"`, `targetDate:"2026-06-14"`, `fromDate:"2026-08-21"` (Gate F audit date), `unitLabel:"DAYS STALE"`, `label1:"Status file"`, `label3:"Last updated 2026-06-14"`, `transparentBg:true`. Elapsed computed as 68 days (2026-06-14 → 2026-08-21 = 68; confirmed in FACTCHECK.md B31 section). fromDate is the Gate F audit date, not today — per BEATS-DATECARD.md: "pin it to the date the tree was audited."

B18 overlay from BEATS-DATECARD.md deliberately NOT applied — B18 is now a rain beat (superseded).

Both B30/B31 remain SLATE (underlying VOX plates not yet supplied).

### STEP 5 — Lane lint

Body beats: 33. Distribution after wiring B17/B18/B19:

| Lane | Count | % | Status |
|---|---|---|---|
| REMOTION | 20 | 60.6% | advisory (over ~40% cap) |
| GRAPHIC (Manim) | 9 | 27.3% | OK |
| STILL (VOX) | 4 | 12.1% | **WARN** (< 15%) |

VOX = 4/33 = 12.1% — WARN, not FAIL. The 4 VOX beats are B04, B05, B30, B31 (all SLATE).

B27 (ClaudeCodeBeat) identified as the one non-card, non-graphic REMOTION beat that could be promoted to a VOX still (concept = role_quality weight 0.0, which is a codebase detail). Proposed to Bear — **not changed; awaiting decision**.

### STEP 6 — Art run and GATE V

Third art run completed. `art run` → Remotion re-rendered B17/B18/B19. GATE V result:

```
frames=74  BLOCKER=0  STRUCTURAL=14  COSMETIC=6
```

**BLOCKER=0 achieved.** All edge-bleed defects cleared.

STRUCTURAL: same 14 Manim underfill as first pass (B03/B09/B11/B16/B24/B26/B32 at 50% frames each). Not introduced this session — pre-existing.

COSMETIC: 6 `low-contrast` on B17_50/B17_85/B18_50/B18_85/B19_50/B19_85 (luminance separation 0.17–0.24 vs min 0.30). **Accepted as intentional design** — falling ghost items at 42% opacity on dark ground is the ephemeral/falling-away visual effect. Items that settle land in cream or terracotta at full opacity. Not fixing.

#### Per-beat visual inspection (B17/B18/B19)

**B17** (retainWhen:[], nothing lands) — mid-beat frame: all 57 items raining in ghost/GHOST at 42% opacity. No terracotta. No settled items. Motion reads as "everything drafted, nothing signed." All items within SAFE clip. Names legible during fall at 30px mono. Nothing crosses SAFE. Type above 24px floor.

**B18** (retainWhen:["ATTESTED"], settleAtSec:0.6, 3.48s beat) — frame at t+3.4s (settleP≈0.95): three terracotta items (`gate-behavior`, `gate-harness`, `local-wage-adjustment`) settled into grid with underlines drawing in. Remaining 54 items still raining in ghost. "Then a signature landed" reads as a visual event at ~0.6s. Terracotta is the only accent. Grid columns balanced. Type legible at settle size 34px. Underlines extending correctly (settleP → 1).

**B19** (retainWhen:["ATTESTED","RUNNABLE-LIVE","RUNNABLE-SAMPLE"]) — mid-beat frame: 5 items settled: 3 terracotta (ATTESTED), `workday-connector` in cream, `skill-demand-monitor` in cream. 28 DRAFT recipes and 24 COMMAND items still raining. Three-tier colour distinction (terracotta / cream / ghost) renders clearly. No name other than recipe/command names on screen (no human names from attestation fields).

**B30/B31** — SLATE placeholders present. Visual inspection of overlay not possible until plates supplied.

### Decisions logged

- `local-wage-adjustment` ATTESTED classification fix in rain_items.py — correct, not a FACTCHECK correction
- 6 COSMETIC low-contrast accepted (intentional design, falling ghost ephemeral effect)
- B27 promotion to VOX proposed but not acted on — Bear decides
- GATE V STRUCTURAL underfill (14): Bear decides fix approach per original CHECKS-REPORT options
- B04/B05/B30/B31 still SLATE — on shopping list

**STANDING ORDER: STOP.** Bear reviews slate cut and CHECKS-REPORT.md.

---

## 2026-08-22 — B04/B05 wired: BrutalistCalendarWall

**Source:** Bear-authored spec posted directly (brik/base44 `tool-mslooalq`, SOURCES.md pending). Component already installed + registered at session start (770 scenes, tsc clean per spec).

### Beat sheet changes

Both beats: `shot.type → REMOTION`, `pattern → BrutalistCalendarWall`, `vox_run` removed, `build.status → FILLED`. Props applied verbatim from spec:

- **B04** (`zoomStart:2.6, zoomEnd:2.2`) — tight on ringed day, calendar marches in over 2.4s, ring draws over 0.9s
- **B05** (`zoomStart:2.2, zoomEnd:1.0`, `marchSeconds:0, ringSeconds:0`) — same seed (104), ring already there, pulls out to the wall

Match-cut: identical `seed:104` on both beats guarantees every wobble and X is in the same place. B04 ends at zoom 2.2; B05 starts there.

### GATE V BLOCKER fix — BrutalistCalendarWall.tsx

First compile: B05 edge-bleed BLOCKER (2 frames). Root cause: at `zoomEnd:1.0`, the sheet pulls back far enough that the spiral-binding pills (`sheetY - pw*1.4 ≈ 51.4 SVG units`) land above SAFE.y=54 in screen space.

Fix: added SAFE clipPath to `BrutalistCalendarWall.tsx` (same pattern as BrutalistCommandRain):
- `import {SAFE} from '../tokens/layout'`
- `<clipPath id="safe-calwall"><rect x={SAFE.x} y={SAFE.y} width={SAFE.w} height={SAFE.h} /></clipPath>`
- Outer `<g clipPath="url(#safe-calwall)">` wrapping the zoom transform

After fix + forced re-render (deleted `media/B05.mp4`): BLOCKER=0.

### Final GATE V result

```
frames=74  BLOCKER=0  STRUCTURAL=16  COSMETIC=6
```

STRUCTURAL=16: original 14 Manim underfills + B05 underfill (46%, calendar sheet centered in dark surround). COSMETIC=6: same B17/B18/B19 ghost rain (intentional, not fixing). Bear decides underfill approach for all 16.

Beats filled: 35/37 (B30/B31 still SLATE). Duration: 303.2s.

**STANDING ORDER: STOP.** Bear reviews slate cut and CHECKS-REPORT.md.

---

## 2026-08-23 — B30/B31 filled: ClaudeCodeBeat + B31_StatusCrossout

### Instruction

Bear: "these should NOT be genai ... use Remotion or Manim to draw a diagram — Only 2 beats remain SLATE: B30, B31"

### B30 — REMOTION/ClaudeCodeBeat

`shot.type → REMOTION`, `pattern → ClaudeCodeBeat`. Props:
- `title`: "status.md"
- `code`: status.md frontmatter excerpt — `updated: 2026-06-14`, canonical field, DRAFT recipes quote
- `sparkLine`: "updated: 2026-06-14"

`vox_run`, `new_visual_element`, `handoff` removed. `build.status → FILLED`. Existing BrutalistDateCard overlay preserved (date readout, right-anchored, claude-dark). No underfill defect on B30.

### B31 — GRAPHIC/B31_StatusCrossout (new Manim scene)

New Manim scene `B31_StatusCrossout` added to `scenes.py` (before `B32_StatusContra`):
three stale claims from status.md (DRAFT status lie, canonical path, absent report path) fade in, then terracotta strikethrough Lines draw through each in sequence while text stays visible.

`shot.type → GRAPHIC`, `shot.manim.scene_class → B31_StatusCrossout`. `vox_run`, `new_visual_element` removed. `build.status → PENDING` (triggers Manim render). Existing BrutalistDateCard overlay preserved (elapsed=68 DAYS STALE).

**Two GATE fixes required before B31 passed GATE A + GATE B:**

1. **GATE A (static pre-flight):** `font_size=34` failed — static checker's width estimator `len*fs*0.012` put "reports/generated/oferta-2026-06-14.md" (39 chars × 34 × 0.012 = 15.9 units) outside HARD_X=7.12. Fixed: `font_size → 26` (39 × 26 × 0.012 = 12.1; half=6.07, Line x0=6.22 < SAFE_X=6.3 — clean).

2. **GATE B (layout audit):** `--curve-strict` flag in `run.sh` turned TEXT_ON_CURVE into ERRORs. Strikethrough Lines intentionally pass through the text. Fixed: added `strike._qc_intentional = True` on all three Line objects — the documented escape hatch for "intentional annotation (strike-through, editor's ring)."

### GATE V result

```
frames=74  BLOCKER=0  STRUCTURAL=18  COSMETIC=6
```

STRUCTURAL went from 16 → 18: B31 added 2 new underfill defects (30–31%, same text-table pattern as B09/B16/B24/B32). B30 has no underfill (ClaudeCodeBeat fills the safe area adequately).

COSMETIC=6: unchanged (B17/B18/B19 ghost rain, intentional, not fixing).

### Final state

Beats filled: **37/37**. Duration: 303.2s. VOX lane: 0 (B30/B31 converted; advisory only).
Bear decides underfill approach for all 18 STRUCTURAL defects.

**STANDING ORDER: STOP.** Bear reviews slate cut and CHECKS-REPORT.md.
