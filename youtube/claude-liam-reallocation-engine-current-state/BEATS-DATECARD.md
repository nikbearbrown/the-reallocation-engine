# Applying BrutalistDateCard to the date/time slates

Reel: `the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state`
Previz slate ids map to plan ids: **B04→A104 · B05→A105 · B17→A304 · B18→A305 · B30→A503 · B31→A504**

## The lane-mix constraint (read this before applying)

Body beats: **33.** Converting a VOX beat to REMOTION moves it out of the quota.

| Scenario | VOX | Share | Lint |
|---|---|---|---|
| now | 7 | 21.2% | PASS |
| convert R1 only (B04+B05) | 5 | 15.2% | **PASS** (at the 15% boundary) |
| convert R1 + R3 (B04,B05,B30,B31) | 3 | 9.1% | **FAIL** (<10%) |
| convert all five shown | 2 | 6.1% | **FAIL** |

So "apply it to every card dealing with time and dates" cannot mean "replace every
one of them" — that guts the genre quota the skill exists to enforce. Two different
applications, chosen per beat:

**REPLACE** where a date *is* the content → the card becomes the beat.
**OVERLAY** where the plate carries the drama and the date is a caption →
`transparentBg: true`, `showClock: false`, composited over the vox still. The beat
stays VOX, the quota holds, and the component still does the work.

---

## B04 + B05 — REPLACE (vox run R1 retired)

The OPT clock. A real countdown beats a stock calendar photo, and it removes two
pantry stills from the shopping list.

```jsonc
// B04 — lane: REMOTION (was VOX/R1)
{ "scene": "BrutalistDateCard", "props": {
  "readout": "countdown", "fromDate": "2026-01-01", "targetDate": "2026-04-01",
  "unitLabel": "DAYS", "label1": "OPT clock", "label3": "F-1 status",
  "palette": "claude-dark", "align": "Right", "ringTick": 9,
  "clockStartHour": 10, "clockStartMinute": 10, "clockSpeed": 238,
  "revealSeconds": 0.9, "seed": 104 }}

// B05 — same component, the "pull back": clock accelerates, ring persists
{ "scene": "BrutalistDateCard", "props": {
  "readout": "countdown", "fromDate": "2026-01-01", "targetDate": "2026-04-01",
  "unitLabel": "DAYS", "label1": "OPT clock", "label3": "F-1 status",
  "palette": "claude-dark", "align": "Right", "ringTick": 9,
  "clockStartHour": 10, "clockStartMinute": 10, "clockSpeed": 620,
  "splitRatio": 58, "primarySize": 260, "revealSeconds": 0.4, "seed": 105 }}
```

`2026-01-01 → 2026-04-01` is exactly **90 days** — the top of the range the
narration names ("sixty to ninety days"). Illustrative, not a claim about a person.

## B18 — OVERLAY (stays VOX, run R2 intact)

The attestation date. The signature plate still carries the beat; the card stamps
the date over it.

```jsonc
// B18 — lane: VOX (unchanged). Add an overlay layer:
{ "overlay": { "scene": "BrutalistDateCard", "props": {
  "readout": "date", "targetDate": "2026-08-09", "fromDate": "2026-08-09",
  "showMonth": true, "showDay": true, "showYear": true,
  "label1": "Gate cleared", "label3": "Sample run · attested",
  "transparentBg": true, "showClock": false,
  "palette": "claude-dark", "align": "Left",
  "primarySize": 150, "daySize": 150, "secondarySize": 150,
  "lineSpacing": -28, "labelSize": 34, "revealSeconds": 1.1, "seed": 118 }}}
```

**No name.** The date only. Rule 1 of the build prompt still binds.

**Two corrections against FACTCHECK.md (GATE F, 2026-08-21) — this doc was wrong:**

1. The label said `Runnable-live`. FALSE. The 2026-08-11 attestation
   (`recipes/gate-harness.md`) sits on a **RUNNABLE-SAMPLE** recipe. The only
   RUNNABLE-LIVE recipe is `workday-connector`, whose `attestation` is **null**.
   Label corrected to `Sample run · attested`.
2. The date said `2026-08-11`. B18's narration is *"then a signature landed"* — the
   FIRST one. FACTCHECK row 8 names the first student-signed gate chronologically as
   `gate-behavior`, **2026-08-09**. Corrected. Re-confirm at Gate F before render.

## B30 + B31 — OVERLAY (stays VOX, run R3 intact)

The stale status file. B30 stamps the file's own date; B31 turns it into the
elapsed count as the strikethroughs land.

```jsonc
// B30 — overlay on the clean-page plate
{ "overlay": { "scene": "BrutalistDateCard", "props": {
  "readout": "date", "targetDate": "2026-06-14", "fromDate": "2026-06-14",
  "showMonth": true, "showDay": false, "showYear": true,
  "label1": "Status file", "label3": "Last updated",
  "transparentBg": true, "showClock": false,
  "palette": "claude-dark", "align": "Right",
  "primarySize": 190, "secondarySize": 170, "lineSpacing": -34,
  "revealSeconds": 1.2, "seed": 130 }}}

// B31 — same card, elapsed readout, as the strikethroughs draw
{ "overlay": { "scene": "BrutalistDateCard", "props": {
  "readout": "elapsed", "targetDate": "2026-06-14", "fromDate": "«GATE F»",
  "unitLabel": "DAYS STALE",
  "label1": "Status file", "label3": "Last updated 2026-06-14",
  "transparentBg": true, "showClock": false,
  "palette": "claude-dark", "align": "Right",
  "primarySize": 240, "secondarySize": 150, "lineSpacing": -30,
  "revealSeconds": 0.7, "seed": 131 }}}
```

### `fromDate` on B31 is a GATE F item, deliberately left unset

An elapsed count is a number that goes stale — in an episode *about* a number that
went stale. Pin `fromDate` to the date the tree was actually audited, and record
that date in `FACTCHECK.md` beside the count. If the reel is re-cut later, the
figure is re-derived, not inherited.

From `2026-06-14` to `2026-08-20` is **67 days**. Verify the audit date at Gate F
before this renders — do not take 67 from this document.

## B17 — no card

An unsigned stack of paper. No date in the content. Adding a date stamp would be
decoration, and the empty-beat rule says decoration is not a reason to render.

---

## Net effect on the shopping list

- **B04, B05 leave it entirely** — two fewer stills to source.
- **B17, B18, B30, B31 stay on it** — they still need plates; the overlays caption
  those plates rather than replace them.
