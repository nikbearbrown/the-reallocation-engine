# CAJAL Figure Report — The Bayesian Role Scorer
_Density: recommend 4 figures, Mechanistic._

## Figure 1 — The Composite: Votes, Gates, and Threshold
Priority: Critical · Type: systems diagram

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a systems diagram showing how four factors fuse into one composite recommendation. On the left, depict two weighted-vote inputs feeding into a summing junction: a dominant sponsorship input drawn with the heaviest connector weight and a fit input drawn with a slightly lighter connector. Show these summed value passing through two sequential gate stages drawn as inline multipliers — a liveness gate then a timeline gate — each capable of collapsing the flow toward zero when closed. After the gates, the flow reaches a threshold node that maps the result into one of three outcomes branching out: apply, consider, skip. Visually distinguish votes (proportional contributors, drawn as merging arrows of differing thickness) from gates (multiplicative chokepoints, drawn as inline valves). The whole point is that a closed gate overrides any vote magnitude. Keep to two vote inputs, two gates, one threshold node, three outcome branches. Flat vector, colorblind-safe palette, white background, single-headed arrows, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Votes: sponsorship (weight 0.35, dominant) + fit (0.30) → summing junction. Gates (multipliers): liveness, then timeline — each can drive composite → 0. Threshold (~0.3) → Apply / Consider / Skip. Connector thickness encodes weight. `[inferred]`: exact visual weight ratios.
`[O - ORGANIZATION]` Left vote inputs merge (→) → two inline gate valves in series → threshold → three branches. Gates visually distinct from votes.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes (vote connectors vary in thickness), white bg, NO baked text. Sponsorship/dominant #0072B2; fit/secondary #E69F00; gates #D55E00; apply outcome #009E73. NO style suggestions.
`[E - EXCLUSIONS]` Omit: the numeric weights as text, the formula string, company names, threshold number as text.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — Same Candidate, Same Fit: Sponsorship Decides
Priority: Critical · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a two-role comparison showing how an identical candidate gets opposite recommendations because of one term. Build two parallel vertical stacks, each composed of four stacked factor segments representing sponsorship, fit, liveness, and timeline for one role. In the left stack (a sponsoring company), the sponsorship segment is large and dominant; in the right stack (a non-sponsor), the sponsorship segment is nearly absent while fit, liveness, and timeline are identical to the left. Below each stack, show a composite result bar on a shared zero-based scale with a horizontal threshold line crossing both: the left composite clears the threshold and resolves to apply; the right composite falls below it and resolves to skip. The fit segment must be visibly identical in both stacks so the reader sees that fit did not change — only the dominant sponsorship term did. Use the dominant hue for sponsorship and a blocking treatment on the failed composite. Keep to two stacks, two composite bars, one threshold line. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left role: sponsorship high (≈0.9), fit ≈0.7, liveness ≈1, timeline ≈0.85 → composite above threshold → Apply. Right role: sponsorship ≈0, identical fit/liveness/timeline → composite below threshold → Skip. Shared zero-based composite scale + threshold line. `[inferred]`: exact segment heights.
`[O - ORGANIZATION]` Two parallel four-segment stacks; two composite bars below on shared zero axis; one horizontal threshold line spanning both.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Sponsorship #0072B2; fit #E69F00; liveness #56B4E9; timeline #CC79A7; passing composite #009E73; failing composite #D55E00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric factor values as text, "BrandCo"/"Cambridge biotech" names, the threshold number, percentage labels.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — Apply / Consider / Skip Decision Regions
Priority: Important · Type: conceptual map

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a two-axis conceptual map of the recommendation regions. Place sponsorship probability on the horizontal axis running low to high and fit score on the vertical axis running low to high. Partition the plane into three labeled regions by shading: the high-sponsorship high-fit corner is the apply region; the two adjacent mixed corners form the consider region; the low-sponsorship low-fit corner is the skip region. Critically, the apply region must be gated by horizontal position (sponsorship), not vertical position alone — show that moving up in fit cannot by itself reach apply without sufficient sponsorship. Overlay two plotted data points at the same vertical height (same fit) but different horizontal positions: one in the apply region, one stranded in the skip region, demonstrating that the sponsorship axis, not fit, moved the outcome. Use distinct region fills from the colorblind-safe palette and clear point markers. Keep to the two axes, three regions, two data points. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` X-axis: sponsorship probability low→high. Y-axis: fit low→high. Regions: top-right = Apply; top-left + bottom-right = Consider; bottom-left = Skip. Two points at equal Y (fit), different X: one Apply, one Skip. `[inferred]`: exact region boundary curves.
`[O - ORGANIZATION]` Cartesian plane, three shaded regions, two marked points at equal height; horizontal displacement is the explanatory move.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Apply region #009E73 (light fill); Consider #E69F00 (light fill); Skip #D55E00 (light fill); points #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric axis ticks, region word-labels baked in, company names, the threshold value.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 4 — Auditable vs. Opaque Scorer
Priority: Supplementary · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a two-column comparison contrasting an auditable composite scorer with an opaque, history-trained one. The left column represents this scorer: show stated weights as visible labeled contributors, each factor connected by a traceable line back to a named source icon (a record, a model-judgment marker, a user-input marker), terminating in a recommendation whose every term can be followed back. The right column represents the opaque scorer: show weights hidden inside a sealed box trained from a stack of past decisions, with no traceable lines from the recommendation back to any source — the internals are a shaded unknown. The contrast is between a flow where each term traces to its origin and a flow where the recommendation emerges from an unseen interior. Use the active hue for the traceable side and a muted blocking treatment for the opaque interior. Keep to two columns, each with its sources/box and a recommendation node. Flat vector, white background, single-headed arrows, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left (this scorer): stated weights, each term → named source (record / model judgment / input), traceable to recommendation. Right (opaque scorer): sealed weights learned from past-decision stack, no traceable lines, hidden interior. `[inferred]`: icon glyphs for source types.
`[O - ORGANIZATION]` Two columns side by side; left = traceable lines (→) to sources; right = sealed box with broken/absent provenance lines.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Traceable side #009E73; opaque interior #D55E00 muted; source markers #0072B2. NO style suggestions.
`[E - EXCLUSIONS]` Omit: "Eightfold"/litigation names, numeric weights, the case citation, legal text, real company names.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — CANDIDATE — multi-stage flow where gates collapse votes — animating a closed gate zeroing a strong composite is a powerful sequential demonstration.
Figure 2 — REJECTED — static side-by-side; the contrast reads instantly.
Figure 3 — REJECTED — conceptual map; static plane reads at a glance.
Figure 4 — REJECTED — comparison panels; no temporal mechanism.
Video candidates: 1. Recommended for production: Figure 1 — the vote-then-gate composite, with a gate visibly collapsing a high composite to zero, is the chapter's central mechanism and animates the multiplier-vs-addend distinction cleanly.
