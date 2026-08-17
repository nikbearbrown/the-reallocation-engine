# CAJAL Figure Report — Chapter 6: Where the Money Went (SEC Form D)
_Density: recommend 4 figures, [Mixed]._

This chapter introduces the funding pipeline with strong quantitative anchors and a clear processing flow. Four concepts clear triage: the Form D corpus scale (568k filers / 247k raising ≥$5M), the seven-step pipeline with its three data layers (an interdependent process), the recency × size signal versus the dollar-amount trap (the chapter's central judgment), and the 62% / 38% domain-inference split. The geography-clustering point is conceptual and folds into the targeting narrative rather than a standalone figure.

## Figure 1 — The Form D corpus and the funded subset
Priority: Important · Type: statistical / quantitative (nested proportion)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a nested-proportion figure conveying the scale of the public Form D record and the slice that clears a funding threshold. Draw a large outer container sized to represent the full population of companies that reported raising money, roughly half a million plus. Inside it, draw a smaller nested region representing the subset that raised at least five million dollars, sized at a little under half of the outer area to reflect the ratio of the two counts. Keep both regions as clean rounded rectangles, one fully enclosing the other, so the relationship reads as a subset. The visual point is twofold: the absolute scale is enormous and almost no job seeker has looked at it, and a meaningful but smaller portion meets a serious funding bar. Use a light primary fill for the full corpus and a denser dominant fill for the funded subset. Two nested regions only; the proportion between them must be honest.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Outer region: ≈568,000 companies that filed Form D. Inner nested region: ≈247,000 raising ≥$5M. Snapshot figures from "80 Days to Stay" build logs, marked `[verify]`.
`[O - ORGANIZATION]` One large outer container fully enclosing one smaller subset region; areas proportional to the two counts.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (full corpus #56B4E9 light, funded subset #0072B2 dominant), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: baked numerals, dollar signs as art, money/coin imagery, 3D, drop shadows, a third nested layer.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — The seven-step Form D pipeline across three layers
Priority: Critical · Type: process flowchart (linear, layer-banded)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a seven-step linear pipeline that turns raw filings into a usable funded-company table, organized so each step sits in one of three horizontal data-layer bands. Set three faint horizontal bands stacked top to bottom: a raw layer, an extracted layer, and a processed layer. Place the seven sequential step nodes left to right, connected by single-direction arrows: download quarters, refresh recent quarters, combine quarters, filter to real offerings above a threshold, collapse to one record per company, infer web domains, and flatten to the final table. Position each step node within the band corresponding to where its output lands, so the path visibly descends from the raw band through extracted into processed as it moves right. Beneath or beside each step, add a small audit-receipt marker to encode that every step writes an audit alongside its output. Seven steps, three bands, one descending path.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Three layers: raw / extracted / processed. Seven steps in order: download-quarters, refresh-recent, combine, filter (funding threshold), unique (one record per company), domain-inference, flatten (final table). Small audit marker per step.
`[O - ORGANIZATION]` Three horizontal layer bands; seven step nodes left-to-right; → progression descending from raw to processed; audit-receipt accents.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (steps #56B4E9, processed-layer band #0072B2, audit markers #009E73), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: script filenames rendered, python/command text, more than seven steps, 3D, drop shadows, database cylinders with shading.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 3 — Recency × size beats raise amount
Priority: Critical · Type: conceptual map (2x2 quadrant)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a two-by-two quadrant map that reframes which funded company is the best hiring lead. Set the horizontal axis as funding recency, from stale on the left to recent on the right, and the vertical axis as company size, from large at the top to small at the bottom. Place a clear marker in the bottom-right quadrant — small and recently funded — and emphasize it as the target zone, the place where one hire moves the needle and a founder reads your email. Place a contrasting marker in the top-left and top-right quadrants for large companies, rendered as lower-value leads gated by formal recruiting machinery regardless of raise size. Add two example markers: a small recent seed in the prized bottom-right and a large recent late-stage round in the top-right to show that a bigger raise does not win. The figure must make the bottom-right quadrant the visual focus. Two axes, four quadrants, one emphasized target zone.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` X-axis: funding recency (stale → recent). Y-axis: company size (large → small). Target zone = bottom-right (small + recent): founder reads your email, one hire matters. Large companies (top) = formal gates, lower value regardless of raise size. Example: small recent seed (target) vs large recent late-stage (not the best lead).
`[O - ORGANIZATION]` Two axes forming four quadrants; bottom-right emphasized as target; contrasting markers in large-company quadrants.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (target zone #009E73 active, large-company quadrants #E69F00 secondary, axes #000000), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: axis text rendered, dollar figures, company names, money imagery, 3D, drop shadows, more than four quadrants.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 4 — Domain inference: where the pipeline stops and you begin
Priority: Supplementary · Type: statistical / quantitative (single proportion split)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a simple proportion figure splitting funded companies by whether the pipeline could automatically find their website. Draw a single horizontal bar divided into two segments: a larger left segment at roughly sixty-two percent for companies whose domain was inferred successfully, and a smaller right segment at roughly thirty-eight percent for companies still requiring a human to locate the site. Anchor the bar at zero width on the left. Mark the smaller right segment as the manual-lookup queue and give it the emphasis, because the chapter's argument is that this remainder often contains the most asymmetric, least-contested leads. Use a primary color for the inferred segment and a secondary, attention-drawing color for the manual segment. The figure should not read as a failure rate but as a handoff line: this is where automation ends and human effort earns its return. One bar, two segments, the smaller one emphasized.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Single bar split: ≈62% domain inferred successfully; ≈38% require manual lookup (the manual-lookup queue, emphasized). Figures from "80 Days to Stay" build logs, marked `[verify]`.
`[O - ORGANIZATION]` One horizontal bar, two proportional segments; right (manual) segment emphasized as the handoff point.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (inferred #56B4E9 primary, manual queue #E69F00 secondary emphasis), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: baked percentages, percent signs as art, pie form, 3D, drop shadows, a third segment.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static nested proportion — scale is read at a glance.
Figure 2 — STRONG CANDIDATE — sequential pipeline descending through layers — animating the data moving step by step down from raw to processed, with audit receipts dropping out, teaches the flow and the traceability contract together.
Figure 3 — WEAK CANDIDATE — markers could populate the quadrants — but the reframing is a single comparative insight, best static.
Figure 4 — REJECTED — static proportion split — a single bar, no temporal content.
Video candidates: 1. Recommended for production: Figure 2 (seven-step pipeline) — a stepwise animation of data flowing through the three layers with audits emitted at each stage makes both the process order and the every-step-leaves-a-receipt contract vivid in a way a static strip cannot.
