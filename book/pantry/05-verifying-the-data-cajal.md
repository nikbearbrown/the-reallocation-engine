# CAJAL Figure Report — Chapter 5: Verifying the Data
_Density: recommend 4 figures, [Mechanistic]._

This chapter layers an epistemic method on top of the Chapter 3 floor. Four concepts clear triage: the three-tier trust stack, the name-matching fragmentation mechanism, the six-step interrogation procedure (an interdependent process), and the base-rate / verb-taxonomy reasoning. The four base-rate diagnostic questions and the verb ladder cluster; they are split so the procedure stays a clean process figure and the calibration reasoning becomes a quantitative Bayes-update figure, avoiding overloaded panels. The guarantees/limits table echoes Chapter 3's and is omitted here to avoid duplication.

## Figure 1 — The three-tier trust stack
Priority: Important · Type: hierarchy / layered schematic

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a three-tier vertical stack representing how data trust is built up in layers. Place a wide foundation tier at the bottom representing the Chapter 3 guarantee that numbers trace to real records. Stack a middle tier on it representing this chapter's question, whether the right things are being measured. Cap it with a narrower top tier representing trustworthy inference. Draw a vertical arrow on the left side spanning the gap between the bottom and middle tiers and mark that gap as the danger zone where coverage gaps, name-matching failures, and base-rate mismatch live. The stack should read bottom-up as a build: each tier rests on the one below and the top tier is only reachable once the middle tier's interrogation is done. Make the foundation tier the widest and most solid, the middle tier the active working layer, and the top tier the smallest and most provisional. Three tiers, one gap annotation, one ascent arrow.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Bottom tier: numbers trace to real records (Ch.3 floor). Middle tier: are the right things measured? (this chapter). Top tier: trustworthy inference. Left-side gap annotation between tiers 1–2: coverage gaps, name-matching failures, base-rate mismatch.
`[O - ORGANIZATION]` Vertical stack, widest at base; ↑ ascent arrow; gap callout between the bottom two tiers.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (foundation #0072B2, middle active #009E73, top #56B4E9, gap accent #E69F00), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: tier text rendered, brick/wall textures, 3D isometric stacking, drop shadows, more than three tiers.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — Name-matching fragmentation
Priority: Critical · Type: mechanism schematic (convergence diagram)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a schematic showing how one legal filer fragments into several apparent companies in filing data. On the left, place three separate employer-name buckets, each a small container holding a modest filing count, representing three name variants of the same firm. Enclose all three buckets inside a dotted boundary marking them as a single legal filer. From that dotted boundary, draw a single arrow to the right pointing at one consolidated node representing the true aggregated count, visibly larger than any individual bucket. The figure must make the failure legible: the rows are real and present in all three buckets, but a naive grouping by name treats them as three small unrelated companies rather than one substantial sponsor. Keep the three buckets clearly distinct yet visually grouped by the dotted enclosure, and make the consolidated true-count node the visual payoff on the right. Three buckets, one dotted group, one true-count node.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Three employer-name buckets (variants of one firm, e.g. "Google LLC / Google Inc. / Alphabet"), each small count; dotted enclosure = "same legal filer"; → arrow to one consolidated true-count node (larger). Rows real, grouping wrong.
`[O - ORGANIZATION]` Left: three small buckets inside a dotted boundary; → single arrow; right: one larger consolidated node.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (fragment buckets #E69F00, dotted enclosure #000000, consolidated true count #0072B2), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: actual company names rendered, real counts baked in, database icons, 3D, drop shadows, more than three buckets.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 3 — The six-step interrogation procedure
Priority: Important · Type: process flowchart (linear with prediction-lock loop)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a six-step linear process flowchart for interrogating a dataset before relying on it. Lay out six sequential nodes connected left to right by single-direction arrows: read metadata and lock a prediction; run exploratory analysis; test metadata against the actual data; ask what is not in the data; trace one row end to end; write the epistemic frame and compare to the locked prediction. Make the first node visually paired with the last by drawing a thin return reference line from the final compare-step back to the prediction locked in step one, so the reader sees that the procedure closes a loop between expectation and finding. Keep the main spine strictly linear so the order is unambiguous, with the prediction-comparison link as a secondary dashed connector arcing over the top. Six nodes, one spine, one closing reference arc.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Six steps: (1) read metadata + lock prediction; (2) exploratory analysis; (3) test metadata vs data; (4) ask what is NOT in the data; (5) trace one row end to end; (6) write epistemic frame + compare to prediction. Dashed reference arc from step 6 back to step 1.
`[O - ORGANIZATION]` Horizontal linear spine of six nodes; → progression; dashed arc connecting final compare-step to the locked prediction.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (steps #56B4E9, prediction-lock node #0072B2 emphasized, closing arc #000000 dashed), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: step text rendered, more than six nodes, code, 3D, decorative borders, looping process arrows beyond the single dashed arc.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 4 — Base rate pulls the posterior down
Priority: Critical · Type: statistical / quantitative (before/after probability bars)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a quantitative figure showing how a low base rate pulls a raw signal score down to a much smaller posterior probability. Draw a horizontal probability axis running from zero to one. Plot three markers along it: a low base-rate prior near eight percent at the far left, the raw scorer output at sixty-eight percent toward the right, and the corrected posterior landing somewhere in the high-thirties to mid-forties, between the two. Draw a clear directional arrow from the raw sixty-eight-percent mark leftward to the posterior mark to show the correction, and a faint anchor line from the base-rate prior to indicate it is the gravity pulling the score down. The figure's lesson is that the headline 0.68 overstates the real probability once the prior is applied. Use a secondary color for the raw signal, an active color for the corrected posterior, and a neutral marker for the prior. One axis, three markers, one correction arrow.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Probability axis 0–1. Markers: base-rate prior ≈0.08; raw scorer output ≈0.68; corrected posterior ≈0.38–0.45. Correction arrow from raw → posterior; prior shown as downward pull. Worked example: pharma SIC, 12 filings, 80% approval.
`[O - ORGANIZATION]` Single horizontal probability axis; three labeled markers; ← correction arrow from raw to posterior; faint anchor from prior.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (raw signal #E69F00, posterior #009E73 active, prior #000000 neutral), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: baked numerals (0.08/0.68/0.45), Bayes formula rendered, false-precision posterior, 3D, gridline clutter, percent signs as art.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static layered stack — read top-to-bottom at a glance.
Figure 2 — WEAK CANDIDATE — buckets could merge into the true count — a merge animation is apt but the static convergence already lands.
Figure 3 — STRONG CANDIDATE — sequential procedure with a closing loop — walking the six steps and then snapping the closing arc back to the locked prediction teaches the method as an enacted loop.
Figure 4 — WEAK CANDIDATE — the correction arrow could sweep from 0.68 to the posterior — a single animated pull is pleasant but adds little over the static arrow.
Video candidates: 2. Recommended for production: Figure 3 (six-step interrogation) — animating the spine step by step and then closing the prediction-comparison arc dramatizes that the procedure is a loop between expectation and finding, which static art under-conveys.
