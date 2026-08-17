# CAJAL Figure Report — The Build and the Honest Run
_Density: recommend 4 figures, Mixed._

## Figure 1 — Six Phases, Two Rows: AI Executes, You Verify
Priority: Critical · Type: process flowchart

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a left-to-right sequence of six build phases, each split into two rows. The top row across all six represents what the AI executes; the bottom row represents what the human verifies. Place the six phases in order — foundation, core skeleton, integration, full feature build, hardening, release — as paired top/bottom cells advancing rightward. Between each adjacent phase, draw a handoff condition marker on the connecting arrow, signaling that a precisely stated, testable condition must be true before the next phase begins. Make the handoff markers visually prominent, since a handoff you cannot state precisely is a phase not actually finished. Use single-headed forward arrows for phase progression. Render the AI-execution row in one hue and the human-verify row in a distinct hue, with the handoff markers in a third, attention-drawing hue. Keep to six phase pairs plus the inter-phase handoff markers. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Six phases: foundation, skeleton, integration, feature build, hardening, release. Two rows: AI executes (top) / human verifies (bottom). Handoff condition marker between each phase — testable, stated precisely. `[inferred]`: cell glyphs.
`[O - ORGANIZATION]` Six paired columns left-to-right (→); two horizontal rows; handoff markers on connecting arrows.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. AI-execute row #56B4E9; human-verify row #009E73; handoff markers #E69F00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: phase names baked in, command strings, code, file paths, the conductor metaphor imagery.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — Give to the AI vs. Keep for Yourself
Priority: Critical · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a two-column division of labor for the build. The left column collects what is given to the AI — scaffolding, schemas, formula implementation, boilerplate, documentation drafts, glue code — unified by the property that correctness is checkable against a test. The right column collects what the human keeps — weight calibration, plausibility audits, interpretation of coverage-gap signals, privacy and honesty calls, and the final go/no-go on real decisions — unified by the property that they can only be verified against reality, not against the system itself. Anchor the contrast with a single deciding test running between the columns: can the model verify this against reality, or only against itself; if only against itself, it is the human's. Render the AI column in one hue and the human column in a distinct, weightier hue. Keep to roughly six items per column plus the deciding-test annotation. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left (AI): scaffolding, schemas, formula implementation, boilerplate, documentation drafts, glue code — correctness checkable. Right (human): weight calibration, plausibility audits, coverage-gap interpretation, privacy/honesty calls, final go/no-go — verifiable only against reality. Deciding test: model verify against reality or only itself? `[inferred]`: item glyphs.
`[O - ORGANIZATION]` Two columns; deciding-test annotation running between them as the partition rule.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. AI column #56B4E9; human column #0072B2 (weightier); test annotation #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: item names as long baked text, code, the conductor/orchestra imagery, file paths.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — The Gate-as-Vote Bug Caught by Plausibility Audit
Priority: Important · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a two-state comparison of a timeline factor behaving wrongly as a weighted vote versus correctly as a multiplier, caught by a plausibility audit. In the buggy state on the left, show a role whose timeline constraint should be fatal but whose timeline term is added in as just another weighted contributor, leaving the composite landing in a misleadingly acceptable position above threshold — internally consistent, grounded in nothing. In the corrected state on the right, show the same role with the timeline term acting as a multiplier that collapses the composite toward zero, dropping it below threshold where an impossible role belongs. Between the two states, place a plausibility-audit marker representing the human catch — the question could this be right that stops the wrong number propagating. Use the blocking hue for the buggy composite and the active hue for the corrected one, on a shared zero-based scale with a threshold line. Keep to two composite states plus the audit marker. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left (bug): timeline added as weighted vote → composite above threshold (wrong, looks fine). Right (fixed): timeline as multiplier → composite collapses below threshold. Plausibility-audit marker between = human catch. Shared zero-based scale + threshold line. `[inferred]`: exact composite heights.
`[O - ORGANIZATION]` Two composite-bar states on shared axis with threshold line; audit marker bridging them.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Buggy composite #D55E00; corrected composite #009E73; audit marker #0072B2; threshold line #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric composite/threshold values as text, company name "MegaCorp", dates, code, the OPT acronym.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 4 — First Real Run: 30 Roles by Outcome and Tier
Priority: Supplementary · Type: statistical/quantitative

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a horizontal bar chart of a single first-run batch broken down by outcome and color-coded by sponsorship tier. Draw three stacked or grouped horizontal bars representing the three outcomes — apply, consider, skip — sized so that skip is the largest, consider is mid-sized, and apply is the smallest, reflecting a healthy filter where roughly the majority of roles are skipped. Within each outcome bar, segment by sponsorship tier so the reader sees that the applies concentrate in the higher tiers while skips spread across lower and non-sponsoring tiers. Anchor all bars at a common zero origin so the proportions compare honestly. The message is that a high skip share is the engine working, not failing — the freed time goes to work no pipeline can do. Use distinct colorblind-safe hues per tier and keep the outcome ordering consistent. Keep to three outcome bars segmented by four tiers. Flat vector, zero-based, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` 30-role batch: Apply (~13%), Consider (~30%), Skip (~57%). Each outcome bar segmented by tier (Proven, Likely, Unknown, Non-sponsor); applies concentrate in higher tiers. High skip = engine working. `[inferred]`: exact tier splits within outcomes.
`[O - ORGANIZATION]` Three horizontal outcome bars anchored at zero; tier segments within each; consistent ordering.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Tiers: Proven #0072B2; Likely #56B4E9; Unknown #E69F00; Non-sponsor #D55E00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric counts/percentages as text, tier names baked in, company names, axis numerals.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — CANDIDATE — six phases with handoff gates is a natural staged progression with a verify-before-advance beat.
Figure 2 — REJECTED — static two-column division; reads at a glance.
Figure 3 — CANDIDATE — the bug-to-fix transition with an audit catch animates the collapse of the composite well.
Figure 4 — REJECTED — static bar breakdown; no temporal mechanism.
Video candidates: 2. Recommended for production: Figure 1 — the six-phase build with explicit handoff conditions captures the capstone's conducting discipline and animates as a gated, advance-only sequence.
