# CAJAL Figure Report — Appendix: Best Practices for Running the Reallocation Engine
_Density: recommend 1 figure, Foundational._

This is an operating-guide appendix. Most of it is rule lists and repository conventions that do not benefit from figuration. One concept — the phase-gate sequence before automation — is a genuine multi-step process with failure paths and is worth a single figure.

## Figure 1 — The Phase-Gate Sequence Before Automation
Priority: Important · Type: process flowchart

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a vertical gated sequence showing that automation is earned one gate at a time, never granted because each step seems individually plausible. Stack seven sequential gates top to bottom: a problem gate where the thing being evaluated is named; a local-evidence gate where local data, audits, and tracker files are checked; a stored-script gate where existing scripts and commands are checked; a small-run gate where one narrow run succeeds; a verification gate where a test, audit, or reviewer proves the step worked; a review gate where a human checks high-risk outputs; and a logging gate where meaningful runs and decisions are recorded. Draw a single forward arrow advancing only when a gate passes, and from each gate draw a distinct failure path branching off, since a gate with no failure path is decoration, not a gate. Render passing progression in the active hue and the failure branches in the blocking hue, with each gate clearly marked as a checkpoint. Keep to the seven gates plus their failure branches. Flat vector, white background, single-headed arrows, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Seven gates top→bottom: problem gate; local-evidence gate; stored-script gate; small-run gate; verification gate; review gate; logging gate. Forward advance only on pass; each gate has a distinct failure path. "A gate with no failure path is decoration." `[inferred]`: gate-checkpoint glyphs.
`[O - ORGANIZATION]` Vertical sequence, pass arrow advancing downward (→), failure branch from each gate (⊣).
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Passing progression #009E73; failure branches #D55E00; gate checkpoints #0072B2. NO style suggestions.
`[E - EXCLUSIONS]` Omit: gate names baked in, file paths, command strings, repository directory names, code.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — CANDIDATE — a stepwise gated sequence with per-gate failure branches animates as an earn-it-gate-by-gate progression, reinforcing that automation is not granted wholesale.
Video candidates: 1. Recommended for production: Figure 1 — the only figure in the appendix and a clean staged process; the failure-path branching is the load-bearing idea and animates well.
