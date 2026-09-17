
## 2026-09-17 01:06 — finish by hand after the engineloop watchdog (9000s) fired

The unattended worker authored the sheet, generated 15 Kokoro beats, rendered 4 Manim + 11
Remotion beats, and compiled a 4K master, but was still cycling on GATE T when the 2.5h
watchdog killed it. Remaining failure: B06 (state-cycle diagram).

- §8.3 contrast: terracotta box borders/arrows on cream read as accent text → RUN 2 arrows
  set to INK, boxes to INK. Re-rendered.
- §8.6b bbox-overlap: an INK box border enclosing its INK label read as two overlapping
  text runs → RUN 2 boxes given GREY borders (same style as the "0 new" box, which passed);
  labels stay INK, arrows stay INK so the diff row still reads as the emphasized row.
- `manim -qh --fps 24 -r 3840,2160 scenes.py B06_StateCycle` → `manim/B06.mp4`;
  `./art run` then `./art final`. GATE G/V/T PASS, GATE AUDIO PASS (-23.8 dB),
  narration_lint clean. Master 188.9 s, 3840×2160, 15/15 slots filled.

Previz-grade label: this is the loop's review deliverable, not a human-reviewed final.
Length note: 3 min 09 s is under the deep-explainer 5–10 min target; the sheet was
authored short by the worker and not lengthened here.

## 2026-09-17 14:17 — rebuilt and re-staged from brutalist.art (brutalist-art retired)

Bear: brutalist.art (dot) is the toolkit; brutalist-art (hyphen) is retired. Ported into the
dot tree: type_check (GATE T on `art final`), post/stage_publish/srt/master/loudness checks,
the qc extras, skills post/kerning/cc-explainer/youtube-publisher, `art post` dispatch.

The dot tree's stricter Gate V then caught a REAL defect the hyphen gate had passed:
- **B04 was blank for its full 12.7 s** — the worker authored `StepStream`, which is not a
  registered composition in brutalist.art (and drew nothing). Re-authored as `ClaudeCodeBeat`
  (`largeText`, `language: text`, filename title `greenhouse_watch.py — one run, six steps`,
  the six steps as a numbered listing). Verified by frame.
- B01 (BrutalistHesitantWriter typing bookend) flagged `underfill` — sparse by design; declared
  `qc.sparse_by_design` + `sparse_reason` in the sheet (new per-beat declaration added to the
  dot Gate V, mirroring its `full_bleed` style; only underfill/clustered are waived).
- GATE T §8.13 card-clip on B04: the dot ClaudeCodeBeat placed the spark line flush on the card
  edge; component inset 12 px (backup `.bak-20260917`). §8.12b: title must be a filename.
- Dot compile writes finals to `renders/` by default; ported post.py now passes `--out <reel>`.

Result: GATE V 0/0, GATE T PASS, MASTER/LOUDNESS/SRT PASS, staged.json 14:17 (3840x2160,
all_beats_4k, markers_clean, gate_t pass, topaz.ran false). Master 188.1 s. Sheet backup:
`beat_sheet.json.bak-20260917-b04-stepstream`.
