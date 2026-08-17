# CAJAL Figure Report — The Visa Timeline Manager
_Density: recommend 4 figures, Mechanistic._

## Figure 1 — The Calendar Gate: Process Past Authorization
Priority: Critical · Type: timeline/progression

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a single horizontal timeline showing a hiring process advancing through its stages while a hard authorization cliff falls partway across it. Lay out the hiring stages left to right as sequential nodes — application submitted, phone screen, technical rounds, panel, offer — connected by single-headed forward arrows. Drop a single bold vertical line at a fixed point along the timeline marking the moment authorization ends. Position that line so it falls between the technical rounds and the offer, so that the offer node sits visibly on the unreachable side of the cliff. Render everything to the right of the cliff in a muted or blocked treatment to make visceral that it is unreachable regardless of how good the news is. The point is not subtlety: an offer arriving after the line is worthless, and the visual must make that obvious before any number is computed. Keep to the five stage nodes plus the one vertical cliff line. Flat vector, colorblind-safe palette, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Stage nodes in order: application → phone screen → technical rounds → panel → offer. One vertical "authorization ends" line falling between technical rounds and offer. Everything past the line = unreachable. `[inferred]`: exact spacing between stages.
`[O - ORGANIZATION]` Horizontal left-to-right progression (→); single vertical gate line; post-cliff region visually de-emphasized/blocked.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Reachable stages #009E73; cliff line and unreachable region #D55E00; neutral nodes #000000 outline. NO style suggestions.
`[E - EXCLUSIONS]` Omit: specific dates, month names, the word "red", any company name, numeric durations.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — Three Windows of an International Student's Runway
Priority: Critical · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw three stacked horizontal bars representing the three overlapping windows that govern a student's work runway. The top bar represents the standard post-completion practical-training window, annotated with a marker for its cumulative unemployment ceiling. The middle bar represents the extended training period available to qualifying fields, drawn longer than the first and annotated with its higher unemployment ceiling. The bottom bar represents the annual lottery cycle, drawn as a fixed-position recurring window rather than a continuous span, annotated with a registration point and a cap-subject start point. Align all three bars on a shared left-anchored time axis so the reader sees that the true runway is the combination of all three, not just the first bar. Use distinct colorblind-safe hues per window and small tick markers for the thresholds. Keep to three bars plus their threshold markers. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Bar 1: standard OPT window + 90-day unemployment ceiling marker. Bar 2: STEM extension (longer) + 150-day ceiling marker. Bar 3: H-1B lottery as fixed annual window + registration point + cap-subject start point. Shared left-anchored time axis; runway = combination. `[inferred]`: relative bar lengths.
`[O - ORGANIZATION]` Three stacked horizontal bars on a common axis; threshold ticks as annotations; no arrows needed.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Window 1 #56B4E9; window 2 #0072B2; window 3 #E69F00; threshold ticks #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric day counts as visible text, month/year labels, the literal acronyms, legal citation, any specific student's dates.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — Three Roles Against the Authorization Cliff
Priority: Important · Type: statistical/quantitative

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a horizontal bar chart comparing three roles by their expected start date plotted against a single student's authorization end. Draw three horizontal bars of differing length, each starting from a common left origin representing today and extending to that role's expected start. Place one vertical line marking the authorization end and a second dotted vertical line, set to its left, marking the buffer target. The longest bar extends past the authorization line, signaling skip-regardless. A short bar finishes well before the buffer line, signaling comfortable. A middle bar finishes between the buffer line and the authorization line, signaling kept-but-penalized. Color the past-cliff bar with the blocking hue, the comfortable bar with the active hue, and the cutting-it-close bar with the transitional hue. Anchor the bars at the shared origin so lengths compare honestly. Keep to three bars plus two vertical reference lines. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Three role bars from common origin (today) to expected start: Role A past authorization line (factor 0); Role B well short of buffer line (factor ≈1); Role C between buffer and authorization lines (factor ≈0.6). Vertical solid line = authorization end; dotted line = buffer target. `[inferred]`: exact bar lengths.
`[O - ORGANIZATION]` Bars anchored at shared left origin (zero), length = time-to-start; two vertical reference lines.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Past-cliff bar #D55E00; comfortable bar #009E73; close bar #CC79A7; reference lines #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric week/day labels, role names "MegaCorp"/specifics, factor numbers as text, company logos, dates.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 4 — Timeline-Factor Decision Tree
Priority: Important · Type: process flowchart

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a decision tree beginning from a single root node representing the computed timeline factor and branching by its value into three terminal outcomes. From the root, a left branch labeled for a factor of zero leads to a terminal node meaning skip-regardless and reallocate the freed time. A middle branch for a low-but-positive factor leads to a terminal node meaning apply only if strong on the other factors and an accelerated process is genuinely possible. A right branch for a high factor leads to a terminal node meaning no timeline objection, let the other factors decide. Attach to the relevant branches a small human-judgment check node indicating that any uncertain eligibility question is verified with a qualified advisor rather than resolved by the system. Use single-headed branch arrows. Keep the blocking hue for the skip branch, the transitional hue for the conditional middle branch, and the active hue for the clear branch. Limit to the root, three branches, three terminals, and the advisor-check node. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Root: factor computed. Branch 0 → skip-regardless / reallocate time. Branch low>0 → apply only if strong elsewhere AND acceleration possible. Branch high → no timeline objection. Human-judgment check node: verify uncertain eligibility with advisor. `[inferred]`: exact branch threshold values.
`[O - ORGANIZATION]` Top-down tree, root → three branches (→) → three terminals; advisor-check as a flagged side node.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Skip branch #D55E00; conditional #CC79A7; clear #009E73; advisor-check #0072B2. NO style suggestions.
`[E - EXCLUSIONS]` Omit: "DSO"/"attorney" as baked words, numeric thresholds as text, legal citation, specific role labels.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — CANDIDATE — temporal progression with a decisive cliff event — an offer landing past the line is a dramatic, sequential reveal ideal for animation.
Figure 2 — REJECTED — static comparison of overlapping windows; reads at a glance.
Figure 3 — REJECTED — static bar comparison; no sequential mechanism.
Figure 4 — CANDIDATE — branching decision logic could animate as a walk-through, but lower stakes than Figure 1.
Video candidates: 2. Recommended for production: Figure 1 — the authorization cliff intercepting a hiring timeline is the chapter's emotional core and animates the "worthless offer" outcome most viscerally.
