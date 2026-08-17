# CAJAL Figure Report — Chapter 4: Two Customers
_Density: recommend 3 figures, [Mechanistic]._

This chapter is almost entirely conceptual and procedural: it argues that each recipe must be written twice and shows one recipe both ways. Three concepts clear triage — the two-customers split with the shared contract, the structural section-by-section difference between the two artifacts, and the drift failure mode (an interdependent process where map and territory diverge). The "scan recipe shown both ways" worked example is text/code and does not need a figure beyond the structural comparison already covered. No quantitative content here.

## Figure 1 — Two customers, one contract
Priority: Critical · Type: systems diagram (mirrored panels with shared base)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a diagram showing one recipe serving two different customers who share a single governing contract. Place two distinct boxes side by side at the top: a left box for the AI artifact and a right box for the human artifact. Inside the left box, stack a short list of attributes representing terseness — read-first order, verbatim commands, stop conditions — rendered as tight, compact rows. Inside the right box, stack a list representing comprehension — a purpose statement, dependencies, how-to-run, what-it-produces, failure modes — rendered as fuller rows. Beneath both boxes, draw a single wide foundation bar representing the shared verified-data contract, and draw an arrow rising from that foundation into each of the two boxes, so both rest on the same base. The visual thesis is divergence above, convergence below: two optimized documents, one shared constraint. Keep each box to a handful of attribute rows and the foundation as a single unifying element.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Left box "AI artifact": terse, imperative, read-first order, verbatim commands, stop conditions. Right box "human artifact": purpose, dependencies, how-to-run, what-it-produces, failure modes. Shared foundation bar: verified-data contract (_shared.md), with an arrow into each box.
`[O - ORGANIZATION]` Two top boxes side by side; one foundation bar below; ↑ arrows from foundation into both boxes; divergent contents, common base.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (AI box #56B4E9, human box #E69F00, contract foundation #0072B2), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: actual command strings, code, file names rendered, robot/person icons for the two customers, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — Same content, inverted context: section-by-section
Priority: Important · Type: comparison panels (three-column matrix)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a three-column comparison matrix mapping the five structural sections of a recipe across its two artifacts. Set a left label column listing the five sections — opening, core content, evidence, logging, failure — then two parallel columns, one for the AI artifact and one for the human artifact. For each section row, fill the AI cell and the human cell with a small chip whose visual weight reflects the section's treatment: the opening row shows a read-first list versus a purpose statement; core content shows bare imperative commands versus annotated commands; evidence shows stop conditions versus full success description; logging shows a template versus a rationale; and the failure row shows an empty or absent chip in the AI column but a prominent filled chip in the human column. That last row is the point — make the AI failure cell visibly empty and the human failure cell the heaviest chip in the matrix. Three columns, five rows, with the failure asymmetry emphasized.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Five sections × two artifacts. Opening: read-first list / purpose statement. Core: imperative commands / annotated commands. Evidence: stop conditions + checks / full success description. Logging: log template / what the log should contain + why. Failure: absent in AI / named failure modes in human (emphasized asymmetry).
`[O - ORGANIZATION]` Left label column + two artifact columns; five rows; failure row shows empty AI chip vs heavy human chip.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (AI column #56B4E9, human column #E69F00, emphasized failure chip #D55E00), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: section text rendered, actual commands, more than five rows, 3D, table gridline overload, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 3 — Drift: when the map leaves the territory
Priority: Important · Type: process flowchart (divergence over time)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a process diagram showing how a recipe and its human card drift apart over time when only one is maintained. Begin at the left with two aligned nodes, a recipe node and a card node, joined by a short connector marking them as initially in sync. Move right along a time axis to a change event where the recipe node is updated — show it shifting to a new state — while the card node stays unchanged, and let the connector between them break or stretch to signal divergence. Continue right to a consequence node where a reader consults the now-stale card and is sent down a wrong path, rendered as a branch peeling away from the recipe's actual behavior. The figure must communicate that drift is structural: a single edit to one artifact, left unmatched, silently separates documentation from reality. Use one color for the recipe track, another for the card track, and a blocking accent on the broken connector and the wrong-path branch. Keep to two parallel tracks across three time positions.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Two parallel tracks (recipe, card) across three time positions: (1) in sync; (2) recipe updated, card unchanged, connector breaks; (3) reader follows stale card down a wrong path diverging from actual recipe behavior.
`[O - ORGANIZATION]` Left-to-right time axis; two tracks; → progression; broken connector at the change event; wrong-path branch at the consequence.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (recipe track #0072B2, card track #E69F00, broken connector + wrong path #D55E00 blocking), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: command text, file names rendered, calendar/clock imagery, more than three time positions, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static structural relationship — divergence-above-convergence-below reads at a glance.
Figure 2 — REJECTED — static matrix — section-by-section comparison is scanned, not timed.
Figure 3 — STRONG CANDIDATE — explicitly temporal — drift happens over time; animating the recipe edit, the breaking connector, and the wrong path appearing dramatizes the failure mode the chapter calls "structural, not inconvenience."
Video candidates: 1. Recommended for production: Figure 3 (drift over time) — it is the only inherently temporal concept in the chapter, and watching the card fall out of sync as the recipe changes is more persuasive in motion than as a static three-stage strip.
