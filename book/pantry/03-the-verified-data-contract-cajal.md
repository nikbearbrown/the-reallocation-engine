# CAJAL Figure Report — Chapter 3: The Verified-Data Contract
_Density: recommend 4 figures, [Mechanistic]._

This chapter is mechanism-heavy and largely qualitative: it defines a rule, a pipeline architecture, a one-question test, and a guarantee/limit boundary. Four concepts clear triage — the fluent-vs-verified contrast, the three-pipeline-to-audit architecture, the one-question test decision logic, and the guarantee/cannot-guarantee table. The cache-vs-fetch "prefers what it already trusts" mechanism is a strong fifth candidate but overlaps the pipeline diagram; it is folded as an annotation path there rather than split out, keeping the chapter at four to honor the ≤6-8-component rule per figure.

## Figure 1 — Same question, two kinds of answer
Priority: Critical · Type: comparison panels (two-column conceptual)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a two-column side-by-side comparison contrasting a model's fluent answer with a verified answer to the same question about whether a company sponsors visas. In the left column, represent the model's answer as a single soft block of flowing prose with no anchor beneath it — visually unmoored, floating, with no connecting line to any source. In the right column, represent the verified answer as a compact data cluster: a filing count, an approval rate, and a year, each tied by a thin solid connector line down to two labeled source anchors representing the Department of Labor and USCIS records. The contrast the figure must carry is groundedness: the left answer hangs in space, the right answer is bolted to records. Use a transitional, uncertain color for the left block and a primary, solid color for the right cluster and its connectors. Two columns, one floating block on the left, one anchored cluster with two source nodes on the right.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Left: "model's answer" — fluent prose block, no source anchor. Right: "verified answer" — LCA filing count, H-1B approval rate, year, connected to two source nodes (DOL, USCIS).
`[O - ORGANIZATION]` Two columns; left block unanchored; right cluster with solid connector lines descending to two labeled record sources.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (model block #CC79A7 transitional, verified cluster + connectors #0072B2 primary, source nodes #56B4E9), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: the actual prose sentence rendered, specific numerals baked in, agency logos, scales-of-justice imagery, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — Three pipelines, three audits, one log
Priority: Critical · Type: systems diagram

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a systems diagram showing how three data pipelines each produce an auditable output that flows into a single run log. Place three source-pipeline nodes in a vertical stack on the left: a funding pipeline, a postings-and-liveness pipeline, and a role-quality pipeline. From each source, draw a single solid arrow to a matching audit-output node in a middle column, so there are three source-to-audit pairs. Then draw an arrow from each of the three audit nodes converging into one shared run-log node on the right. The diagram must communicate that every number has a traceable path: source produces audit, audits feed the log, and the whole graph can be read backward. Add a small recurring marker on each source node indicating a local-cache-first behavior — a short loop arrow returning to the same node — to encode that pipelines check verified local data before reaching the network. Keep to three sources, three audits, one log, with the cache loops as minor accents.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Three sources: funding (scripts/sec), postings/liveness (scripts/ats), role quality (scripts/bls). Each → its own audit output (*-audit.md). All three audits → one run-log node. Small self-loop on each source = local-verified-data-first / cache check `[inferred from "prefers what it already trusts" section]`.
`[O - ORGANIZATION]` Left column: three sources stacked; middle: three audits; right: one converging run-log; → solid arrows source-to-audit, audits converge to log; minor cache self-loops.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (sources #56B4E9, audits #009E73, run-log #0072B2 dominant, cache loops #000000 thin), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: file path strings rendered, code, network/server icons, more than three pipelines, database cylinders with realistic shading, 3D.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 3 — The one-question test for every sentence
Priority: Important · Type: process flowchart (decision tree)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a decision tree that classifies any sentence in a mixed system output. Begin at a single decision diamond posing the question of whether the sentence could have been produced by counting records. The yes-branch flows down to a node representing a data claim, which then flows to a requirement node: it must trace to a script output or audit. The no-branch flows to a node representing model judgment, which flows to a requirement node: it is allowed but must be labeled. Crucially, route both requirement nodes downward into a single shared final decision diamond asking whether the label is visible in the output, so the two paths reconverge. Lay it out top-to-bottom with single-direction arrows, diamonds for the two decisions and rounded rectangles for the claim/judgment outcomes. The figure should read as two branches that diverge on the nature of the sentence and reconverge on the visibility requirement. Two diamonds, two outcome nodes, two requirement nodes, one shared endpoint.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Entry diamond: "could this have been produced by counting records?" Yes → data claim → must trace to script output/audit. No → model judgment → allowed but must be labeled. Both → shared diamond: "is the label visible in the output?"
`[O - ORGANIZATION]` Top-to-bottom; one entry diamond splitting two branches; each branch a claim/judgment node plus a requirement node; both reconverge at a final visibility diamond. → single-direction arrows.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (data-claim path #0072B2, model-judgment path #E69F00, diamonds #000000 outline), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: the question text rendered, example sentences, more than two diamonds, 3D, decorative borders, looping arrows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 4 — The floor and the ceiling: guarantees vs. limits
Priority: Supplementary · Type: comparison panels (two-column matrix)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a two-column comparison matrix contrasting what the verified-data contract guarantees against what it cannot guarantee. Set two parallel vertical columns, the left for guarantees and the right for limits, sharing four horizontal rows. Each row pairs a guarantee with its matching limit: counts are real versus the right thing was measured; gaps are labeled not hidden versus coverage is complete; decisions trace to records versus the records captured the full picture; model judgments are labeled versus those judgments are correct. Represent each cell as a small rounded chip with a polarity marker — a solid affirming mark on the left chips and a hollow cautionary mark on the right chips — so the eye reads a wall of solid assurances facing a wall of honest caveats. Use the active color for the guarantee column and a secondary cautionary color for the limit column. The structure must convey a paired floor-and-ceiling relationship, row by row. Two columns, four rows, eight chips.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Four paired rows. Guarantees: counts/rates are real; gaps labeled not hidden; decisions trace to auditable records; model judgments labeled. Limits: that the right things were measured; that coverage is complete; that records captured the full picture; that those judgments are correct.
`[O - ORGANIZATION]` Two columns (guarantee | limit), four rows; each cell a chip with an affirming vs cautionary polarity mark; paired left-right reading.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (guarantees #009E73 active, limits #E69F00 secondary, polarity marks #000000), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: row text rendered, check/cross glyphs that imply red-green, more than four rows, 3D, drop shadows, table gridline overload.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static conceptual contrast — grounded vs floating is a single comparative frame.
Figure 2 — WEAK CANDIDATE — flow could animate source→audit→log — the cache-first loop is mildly motion-friendly but the static graph is clearer.
Figure 3 — STRONG CANDIDATE — a sentence walked through the test — animating a sample sentence dropping through the diamonds to its correct bin teaches the one-question test as a procedure, the chapter's core reflex.
Figure 4 — REJECTED — static paired matrix — read by scanning, not over time.
Video candidates: 1. Recommended for production: Figure 3 (one-question test) — a short animation routing a sentence through the decision diamonds turns an abstract rule into a repeatable motion, matching the chapter's emphasis on policing the data-claim / judgment seam.
