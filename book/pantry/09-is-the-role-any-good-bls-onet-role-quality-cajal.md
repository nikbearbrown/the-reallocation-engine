# CAJAL Figure Report — Is the Role Any Good: BLS / O\*NET Role Quality
_Density: recommend 3 figures, Mechanistic._

## Figure 1 — Title-to-Occupation Resolution Pipeline
Priority: Critical · Type: process flowchart

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a single-column horizontal process flowchart that traces a messy job-posting title through the steps that turn it into a labor-market fact. Begin with a node for the raw posting title, flowing rightward into a node where a language model proposes a candidate occupation code, then into a verification node where the proposed code's alternate-title list is checked against the posting. Show two outcomes branching from verification: a confirmed path that proceeds to a node representing the joined occupation table (one compact row uniting the occupational-information source and the wage-and-employment source), and a rejected path that loops back to re-propose a new code. End with a node where three role-quality features are read from the confirmed row. Use clean directional single-headed arrows for forward progress and one distinct return arrow for the reject loop. Keep the propose step visually distinct from the confirm step, since the chapter's whole discipline is that proposing is not confirming. Keep components to seven or fewer. Flat vector, colorblind-safe palette, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Nodes: raw posting title; model proposes occupation code; alternate-title verification check; confirmed → compact joined row (O\*NET + OEWS); rejected → re-propose loop; read three features from row. The two federal systems (O\*NET = description, OEWS = measurement) join by occupation code. `[inferred]`: exact box ordering of the loop-back.
`[O - ORGANIZATION]` Left-to-right linear flow with one decision branch at verification; → for forward progression; one return arrow for reject. Verification node centered as the gate.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Propose node secondary #E69F00; confirm/active path #009E73; reject path #D55E00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: actual SOC code numbers, company names, wage figures, screenshots of databases, the python command string, any specific occupation example.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — The Compact Row: Three Role-Quality Features
Priority: Important · Type: structural schematic

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a structural schematic of a single compact occupation row decomposed into the three features that drive a role-quality decision. Depict the row as one horizontal band at the top, then fan three labeled branches downward to three feature panels arranged side by side. The first panel represents employment trend as a small multi-period line moving across survey years. The second panel represents the wage band as a vertical distribution marked at five percentile positions. The third panel represents the job zone as a five-step ladder of preparation level. Above the band, show the alternate-title list as a small attached element feeding the confirmation, signaling that the row is only trustworthy once the title is matched. Keep the three panels visually parallel and equal in weight so no single feature dominates. Use distinct hues per panel from the colorblind-safe palette. Limit to the row plus three panels plus the alternate-title element. Flat vector, white background, single-headed connectors, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` One compact row decomposing into: employment trend (multi-year direction); wage band (distribution at five percentiles — 10th/25th/50th/75th/90th); job zone (preparation ladder, levels 1–5). Alternate-title list attached as the confirmation feed. `[inferred]`: exact percentile tick placement.
`[O - ORGANIZATION]` Top band → three parallel feature panels below via fan-out connectors (→). Alternate-title element attached at top as gate.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Trend panel #0072B2; wage panel #56B4E9; job-zone panel #E69F00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric wage values, real dollar amounts, specific occupation names, the file path, axis numbers, any title text inside panels.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — The Silent Wrong-SOC Error
Priority: Important · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a two-panel comparison illustrating how an unverified occupation match silently attaches the wrong wage distribution to a role. Left panel: an ambiguous posting title pointing to a plausible-but-wrong occupation code, whose attached wage band sits at a modest, stable level — and an alternate-title list that does NOT contain the posting's described work, marked with a clear blocking indicator. Right panel: the same posting correctly re-classified to the occupation whose alternate-title list DOES contain the work, whose wage band sits higher with a steeper preparation profile, marked with a clear confirmation indicator. Place the two wage bands on a shared zero-based vertical scale so the gap between the wrong and right occupation is visible at a glance — that gap is the cost of skipping the check. Use a blocking hue for the rejected match and an active hue for the confirmed match. Keep to two panels with their wage bands and match-indicators. Flat vector, white background, single-headed arrows, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left: ambiguous title → wrong occupation code, lower/stable wage band, alternate-title list lacks the work (blocked). Right: re-classified to correct occupation, higher wage band + steeper preparation, alternate-title match confirmed. Shared zero-based wage scale; the gap = cost of skipping verification. `[inferred]`: exact magnitude of the wage gap.
`[O - ORGANIZATION]` Two side-by-side panels, shared vertical wage axis at zero; ⊣ blocking marker left, confirmation marker right; → from title to occupation in each.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Wrong/blocked match #D55E00; confirmed match #009E73; wage bars #56B4E9. NO style suggestions.
`[E - EXCLUSIONS]` Omit: the words "Growth Analyst" or any specific title, real dollar figures, real SOC numbers, company name "Helix Bio", axis numerals.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — CANDIDATE — process with ≥3 interdependent steps and a decision loop — the propose→confirm→re-classify cycle is a sequential reveal that benefits from animated step progression.
Figure 2 — REJECTED — static structural decomposition; no temporal progression to animate.
Figure 3 — REJECTED — comparison panel; the contrast reads instantly as a static image.
Video candidates: 1. Recommended for production: Figure 1 — the resolution pipeline's loop-back on a failed alternate-title check is the chapter's core discipline and lands best as an animated correction sequence.
