# TYPECHECK.md — GATE T

Reel: `claude-liam-reallocation-engine-current-state`  |  Checked: 2026-08-23T14:56  |  Overall: PASS  |  Beats checked: 37  |  FAILs: 0

Spec: `skills/make/kerning/reference/type-spec.md` §8.  Floor: 1.9% frame-height.  Contrast: 4.5:1 WCAG.  Kern threshold: 3.5× expected advance.  Wordy budget: 2 elements.

> **§8.10 REDUNDANCY (advisory — does not block cut):**
> Narration should DISCUSS on-screen text, not recite it.
> Exception: LITERAL beats (viewer types/copies/runs the text) are exempt.

> - §8.10 [B02] narration recites the card (0.80) — discuss it, don't read it
> - §8.10 [B12] narration recites the card (0.86) — discuss it, don't read it

| beat | lane | polarity | worst finding | status | fix |
|------|------|----------|---------------|--------|-----|
| B00 | ? | light | min-size §8.1: hand-drawn pattern (ClaudeComposerAsk) — §8.1 hachure/crossbar fragments ar… | PASS | — |
| B01 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B02 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B03 | ? | light | min-size §8.1: min text-run height 66px >= floor 41px | PASS | — |
| B04 | ? | dark | no-wordy-card §8.5: no prose payload found | PASS | — |
| B05 | ? | dark | no-wordy-card §8.5: no prose payload found | PASS | — |
| B06 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B07 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B08 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B09 | ? | light | min-size §8.1: min text-run height 49px >= floor 41px | PASS | — |
| B10 | ? | light | min-size §8.1: min text-run height 46px >= floor 41px | PASS | — |
| B11 | ? | light | min-size §8.1: min text-run height 43px >= floor 41px | PASS | — |
| B12 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B13 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B14 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B15 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B16 | ? | light | min-size §8.1: min text-run height 57px >= floor 41px | PASS | — |
| B17 | ? | dark | no-wordy-card §8.5: no prose payload found | PASS | — |
| B18 | ? | dark | no-wordy-card §8.5: no prose payload found | PASS | — |
| B19 | ? | dark | no-wordy-card §8.5: no prose payload found | PASS | — |
| B20 | ? | light | min-size §8.1: min text-run height 64px >= floor 41px | PASS | — |
| B21 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B22 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B23 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B24 | ? | light | min-size §8.1: min text-run height 57px >= floor 41px | PASS | — |
| B25 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B26 | ? | light | min-size §8.1: min text-run height 49px >= floor 41px | PASS | — |
| B27 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B28 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B29 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B30 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| B31 | ? | light | min-size §8.1: min text-run height 48px >= floor 41px | PASS | — |
| B32 | ? | light | min-size §8.1: min text-run height 54px >= floor 41px | PASS | — |
| B33 | ? | light | no-wordy-card §8.5: no prose payload found | PASS | — |
| BVDT | ? | light | min-size §8.1: min text-run height 46px >= floor 41px (individual-char fallback at 2×) | PASS | — |
| BHTF | ? | light | min-size §8.1: hand-drawn pattern (ClaudeComposerAsk) — §8.1 hachure/crossbar fragments ar… | PASS | — |
| BOUT | ? | dark | min-size §8.1: min text-run height 102px >= floor 41px | PASS | — |

---

## Failures requiring action before cut

*None — GATE T PASS.*
---

## Check summary

| Check | Beats checked | FAILs |
|-------|---------------|-------|
| no-wordy-card §8.5 | 23 | 0 |
| min-size §8.1 | 37 | 0 |
| overflow §8.2 | 37 | 0 |
| contrast §8.3 | 37 | 0 |
| contrast-local §8.3b | 37 | 0 |
| bbox-overlap §8.6b | 37 | 0 |
| card-clip §8.13 | 37 | 0 |
| kerning §8.4 | 10 | 0 |
| redundancy §8.10 (advisory) | 10 | 2 (advisory — no exit effect) |

---

*GATE T: any FAIL blocks `./art run` and `./art final`. Fix the flagged beats and re-run `scripts/type_check.py` until green.*
