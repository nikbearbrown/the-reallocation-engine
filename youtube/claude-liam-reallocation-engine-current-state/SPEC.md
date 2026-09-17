# SPEC — BrutalistDateCard

**Phase 1 artifact. GATE B1.** Component code is written and lint-clean, but
§9 verification (tsc, render, pixel-diff) has not run — see "Not yet verified".

**Source:** Brik tool `remix-of-save-the-date-countdown-ms1pimmw` (author pending —
record in `SOURCES.md` before any reel ships). The screenshots-are-spec rule
applies to code too: nothing is lifted, the component is rebuilt native.

---

## 1 · Name and visual purpose

`BrutalistDateCard` — **a clock face over massive date type.** One purpose: a beat
whose subject is a date, a deadline, or elapsed time.

Three readouts (`date` / `countdown` / `elapsed`) vary the *content* of the massive
lines. They do **not** branch the render tree — same clock, same type stack, same
labels — so this stays one component under §6's single-visual-purpose rule rather
than a `variant` that should have been a split.

## 2 · Prop table (the source's interface IS the panel)

| Prop | Type | Default | Riffable | Note |
|---|---|---|---|---|
| `targetDate` | string | `⚠ SET IN BEAT SHEET` | — | ISO `YYYY-MM-DD` only |
| `fromDate` | string | `⚠ SET IN BEAT SHEET` | — | reference for countdown/elapsed |
| `readout` | enum | `date` | yes | date · countdown · elapsed |
| `showMonth/showDay/showYear` | bool | `t/f/t` | yes | from source |
| `unitLabel` | string | `DAYS` | yes | replaces source's dayText slot |
| `label1–4` | string | `''` | yes | source's four corner labels |
| `palette` | enum | `claude-dark` | yes | claude-dark/light · brutalist-light/dark |
| `transparentBg` | bool | `false` | yes | **new** — composite over a vox still |
| `bgOverride` | zColor? | `null` | yes | source `bgColor` |
| `swapEverySec` | number | `0` | yes | see §4 |
| `showClock` | bool | `true` | yes | **new** — annotation mode |
| `clockStartHour/Minute` | number | `10/10` | yes | **replaces the wall clock** |
| `clockSpeed` | number | `238` | yes | source's literal, now a prop |
| `clockScale`, `handThickness` | number | `1.1`, `18` | yes | source constants → props |
| `ringTick` | int | `-1` | yes | **new** — terracotta ring on one tick |
| `splitRatio` | number | `50` | yes | from source |
| `align` | enum | `Right` | yes | from source |
| `primarySize`/`secondarySize`/`daySize`/`labelSize` | number | `300/276/120/40` | yes | source sizes, rescaled 1080×1350 → 1920×1080 |
| `lineSpacing` | number | `-62` | yes | source `-73`, rescaled |
| `labelRowY` | number | `0` | yes | collapses source's Y padding |
| `revealSeconds` | number | `0.9` | yes | **new** — entrance |
| `seed` | int | `1` | yes | house rule: seed is always a prop |

## 3 · The determinism translation (§1, §8)

The source is not merely un-Remotion — it is **actively non-reproducible**. Three
separate leaks, all fixed:

| Source | Why it breaks | Here |
|---|---|---|
| `accumulatedTime = Date.now()`, incremented by rAF deltas | every render starts at a different wall time; two passes never agree | `simMinutes = clockStartHour*60 + clockStartMinute + (frame/fps)*clockSpeed/60` |
| `requestAnimationFrame` loop mutating canvas | the renderer screenshots frames, it does not play a page | no loop; SVG recomputed per frame |
| color shuffle keyed to `Math.floor(accumulatedTime / 300000)` | interval index derived from the wall clock | frame-derived index, `swapEverySec` |
| mouse/touch drag mutating an `offsets` object | interactivity cannot survive a render | offsets removed; layout is props (§5) |
| `canvas width={1080} height={1350}` hardcoded | fixed aspect | `useVideoConfig()` + `SAFE`; composes 16:9, 1:1, 9:16 |
| `prefers-reduced-motion` branch | a viewer preference has no meaning in a render | dropped |

`Date.UTC(...)` **is** used, for parsing `YYYY-MM-DD` into an epoch day. That is
pure arithmetic on prop strings — no wall clock — and it is not what §1 forbids.

**Lint (§9), all zero:** `Date.now` · `new Date(` · `Math.random` · `setTimeout` ·
`setInterval` · `requestAnimationFrame` · `addEventListener` · `transition:` ·
`animation:` · `animate-` · `ResizeObserver` · `useEffect` · `useState` · `useRef`.

The component holds no React state and no refs. It is a pure function of
(frame, props) by construction, not by discipline.

## 4 · Deliberately NOT ported (decisions, not holes)

- **The six-color shuffle.** The source randomly permutes bg / text / hour hand /
  minute hand / pivot / ticks every interval. In this brand terracotta is THE one
  accent (SPARK-LINE LAW) — a rainbow that reassigns the accent every few seconds
  is a brand violation, not a feature. Replaced by `swapEverySec`, which swaps only
  the **ink/ground roles** and leaves the accent alone. Off by default.
- **Canvas dragging** (`enableCanvasDragging`, 6 offset props, mouse + touch
  handlers, hit-testing). Nobody drags a render.
- **`clockOffset` / `dateTextOffset` / `label1–4Offset`.** The source's tuned
  fractional offsets encoded one hand-arranged 1080×1350 composition. Superseded by
  `align` + `SAFE` + `splitRatio` + `labelRowY`, which survive an aspect change.
- **Separate `topLabelsFont` / `massiveDateFont` font pickers.** Fonts come from
  brand tokens (§6 forbids retyped literals). Serif + UI sans under the Claude
  palettes; JetBrains Mono under the Brutalist ones.
- **`prefers-reduced-motion`.** No viewer at render time.

## 5 · Palette

Tokens only, never literals. `claude-dark` is the default because it matches the
reel's existing ground: warm ink field `CLAUDE.INK`, cream type `CLAUDE.PAGE`,
`CLAUDE.SPARK` terracotta as the single accent.

**Brand caution:** `brutalist-light` / `brutalist-dark` bring `BRUTALIST.light.accent`
(`#ea580c`) and JetBrains Mono. That is the brutalist.art system, **not** the CLAUDE
brand — correct for brutalist.art decks, wrong inside a `claude-liam` reel. The reel
beats below all use `claude-dark`.

## 6 · Not yet verified — must run locally

- `npx tsc --noEmit` (the container has no repo checkout / no Remotion types).
- Same-frame-twice pixel-identical via `remotion still`.
- A rendered frame READ against the 9-point rubric (VISUAL QC LAW).
- Registration in `Root.tsx` under `<Folder name="Brutalist">`, then
  `build_scene_index.py` to regenerate `scenes.json`.
- Font loading (§5): EB Garamond ships in `runtime/fonts`; JetBrains Mono must be
  confirmed loaded before the brutalist palettes are used, or measurements drift.
