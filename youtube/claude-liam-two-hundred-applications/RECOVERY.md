# RECOVERY.md — narration loss, 2026-08-25

## What happened

A Claude Code session building an unrelated reel (`skepticism-ai/youtube/claude-liam-what-is-ai-compute`)
carried a stale working directory into two write commands. Both landed here instead. The second one
rewrote this reel's `beat_sheet.json`.

**No backup existed** — this reel folder is untracked in git, there are no Time Machine snapshots on
this Mac, and there was no `.bak`.

## What was damaged

| Field | Damage |
|---|---|
| `narration_text` (all 16 beats) | Overwritten with the other reel's narration |
| `estimated_duration_s` (all 16) | Recomputed from the wrong word counts |
| `B06.show[]` | Replaced |
| `B06.shot.remotion.props.script` | Spurious prop added |
| `metadata.custom_scenes_required` | Spurious key added |

## What was NOT touched

Everything else. All visual specs and Remotion/Manim props, `anim.json`, `scenes.py`, `clips/`,
`manim/`, `media/`, `_qc/`, the rendered slate cut, all `build` records, and every
`actual_duration_s`. The reel's structure, look, and pacing are intact.

## What has been restored

- **6 of 16 beats restored verbatim** — `B01`, `B02`, `BASK1`, `BVDT`, `BHTF`, `BOUT`. These had been
  printed in full into the offending session's own transcript before the overwrite, so the exact
  original text was recoverable, character for character.
- **All `estimated_duration_s` restored** from `actual_duration_s`. This reel is a pre-audio slate cut
  (GATE P was never signed, `clips/*.mp3` are silence, the cut's audio track measures −91 dB), so
  estimated and actual were identical by construction. This restore is exact, not approximate.
- `B06`'s spurious prop and the spurious metadata key removed.
- `B06.show[]` **reconstructed**, not restored — the three cues are marked `[RECONSTRUCTED]` inline.
  They follow SHOTLIST.md's description of the beat; the original cue wording is gone.

## What is still lost

`narration_text` for **B00, B03, B04, B05, B06, B07, B08, B09, B10, B11**.

Each now carries a `⚠ NARRATION LOST` sentinel (so no audio can be generated from it by accident) and a
`narration_recovery` block naming what to rewrite from. There is no audio to transcribe — the reel had
not reached the audio stage.

**These beats need to be rewritten.** The material to do it faithfully is all present:

- `SHOTLIST.md` — a per-beat row describing exactly what each visual shows, including spark lines
- `anim.json` — each beat's pattern and data
- `book/chapters/00-introduction.md` — the source chapter the narration was written from
- `FACTCHECK.md` and `SOURCES.md` — which claims this reel is allowed to make, and how they must be
  framed (several figures are MECHANISM ONLY and must never appear on screen)
- `beat_sheet.json` `metadata.note` — the episode's guardrails, intact

The register (Teardown), the channel (`claude-liam`), the greeting (`Merhaba, Liam`), and the
episode's scope boundaries against Episode 1 all survived in `metadata`.

## Status

`gates.P_narration` and `gates.audio` are both set to BLOCKED. This reel should not advance until the
ten beats are rewritten and Bear signs GATE P.


---

## RESOLVED — 2026-08-27

The sentinels backfired: a batch build (THE SOUND LAW auto-generates Kokoro for any
`narration_text`) VOICED them — the rebuilt master literally spoke "Warning: narration
lost. Rewrite required." on all 10 lost beats. A sentinel is text; the pipeline cannot
read English. Lesson encoded: `generate_audio_kokoro.py` now hard-skips any
narration_text starting with `⚠` / `[LOST]` / `[PLACEHOLDER]`.

All 10 lost beats (B00, B03–B11) were REWRITTEN from SHOTLIST.md + FACTCHECK.md +
the source chapter, honoring the mechanism-only strip list (no 56%/82%/21% figures,
no vendor names; RCT figures and OPT clock allowed). Audio regenerated (Kokoro,
free), reel recompiled. The 6 verbatim-restored beats are untouched.

**Bear: the 10 rewritten narrations are reconstructions, not the originals — review
before this reel advances to 4K/publish.**
