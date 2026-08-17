# CAJAL Figure Report — Chapter 8: Is the Job Real (ATS Detection and Liveness)
_Density: recommend 4 figures, [Mixed]._

This chapter pairs a quantitative anchor (ghost-job prevalence) with a detection mechanism, a five-signal classifier, and a worked two-posting contrast. Four concepts clear triage: the ghost-job prevalence band over time, the three-fingerprint spam-filter analogy, the five-signal liveness classifier producing a three-way call (an interdependent process), and the same-employer two-posting comparison. The ATS-detection-unlocks-schema diagram is supporting and folds into the five-signal pipeline framing. The catches-vs-misses table echoes earlier guarantee/limit tables and is omitted to avoid repetition.

## Figure 1 — Ghost-job prevalence holds across years
Priority: Important · Type: statistical / quantitative (scatter with band)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a quantitative chart showing that ghost-job prevalence has stayed within a stable band across several years. Set a time x-axis spanning roughly 2019 through 2024 and a y-axis for prevalence from zero to fifty percent. Draw a horizontal shaded band spanning the twenty-eight to forty-two percent range across the full width to mark the structural prevalence range. Scatter several individual data points at various years and values to represent different studies and cities, including a couple of visible outliers below the band to show measurement spread. The chart must communicate that this is not a cyclical blip but a persistent structural feature: the band holds steady left to right, with points clustering in or near it. Anchor the y-axis at zero. Use a neutral fill for the band, a primary color for the data points, and a distinct secondary color for the outlier points. One band, several scatter points, two highlighted outliers, no trend line implying a slope the data does not support.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` X-axis 2019–2024; y-axis 0–50% prevalence. Shaded band at 28–42% (structural range). Scatter points for multiple studies/cities, including labeled outliers (e.g. LA ≈30.5%, Seattle ≈16.6%). One survey: 81% of recruiters admit posting jobs not being hired for (cite in text, not as a plotted point).
`[O - ORGANIZATION]` Time on x, prevalence on y at zero; horizontal 28–42% band; scattered study points; outliers distinguished.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (band #F0E442 neutral fill, points #0072B2, outliers #E69F00), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: baked numerals, city names rendered, a fitted trend line, percent signs as art, 3D, gridline overload.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — The spam-filter analogy: three behavioral fingerprints
Priority: Important · Type: conceptual map (three-column parallel)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a three-column conceptual map drawing the parallel between spam detection and ghost-job detection. Create three labeled columns, one for each behavioral fingerprint: temporal anomalies, interaction voids, and textual homogeneity. Within each column, stack two paired chips — an upper chip for the email-spam example and a lower chip for the job-posting example — so each column shows the same fingerprint expressed in both domains. For temporal anomalies, pair a bulk-send-at-3am chip with an unchanged-for-weeks posting chip; for interaction voids, pair a no-replies chip with a no-portal-activity chip; for textual homogeneity, pair a reused-message chip with a description-copied-across-listings chip. The figure must communicate that ghost detection is mechanically the same move as spam filtering: score behavioral patterns, not content. Keep three columns, two paired chips each, with the email and posting rows aligned horizontally across all three columns.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Three fingerprints: temporal anomalies (spam: 3am bulk send / posting: unchanged 8+ weeks); interaction voids (spam: no replies-clicks / posting: no portal activity, no closing date); textual homogeneity (spam: reused message / posting: description reused across listings). Thesis: score behavior, not content.
`[O - ORGANIZATION]` Three columns (one per fingerprint); two aligned rows (email domain, posting domain); paired chips per column.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (email row #56B4E9, posting row #E69F00, column headers #0072B2), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: chip text rendered, envelope/inbox icons, realistic UI, more than three columns, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 3 — Five signals to one classification
Priority: Critical · Type: systems diagram (five inputs, three-way output)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a classifier diagram where five posting signals feed a single liveness decision that emits one of three calls. Stack five input nodes on the left, in the chapter's reading order: posting age, last-updated date, sibling-listing activity, description specificity, and active-search context. Draw a single arrow from each into a central classification node. From that node, fan out three output branches on the right to three distinct terminal calls: live, ghost, and investigate. Give the investigate branch a transitional color to mark it as the honest mixed-signal response, the live branch an active color, and the ghost branch a blocking color. Emphasize the sibling-listing-activity input slightly, since the chapter calls it the most diagnostic signal. The figure must read as a many-to-one-to-three funnel: five behavioral observations resolve into one of three actions. Five inputs, one classifier, three outputs.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Five signals in order: posting age, last-updated, sibling-listing activity (most diagnostic, emphasized), description specificity, active-search context. → classifier → three calls: live, ghost, investigate (investigate = honest mixed-signal response). Run via ats:liveness.
`[O - ORGANIZATION]` Five input nodes left → one classifier node → three output branches right; sibling-activity input emphasized; investigate branch distinguished.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (inputs #56B4E9, classifier #0072B2, live #009E73 active, ghost #D55E00 blocking, investigate #CC79A7 transitional), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: signal text rendered, command syntax, more than five inputs, more than three outputs, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 4 — Same employer, two doors
Priority: Critical · Type: comparison panels (two-posting signal grid)

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Build a side-by-side comparison of two postings from the same employer, scored across the five liveness signals, so the reader sees that liveness is a property of the listing rather than the firm. Create two parallel columns, one for posting A and one for posting B, sharing five horizontal signal rows: posting age, last-updated, description specificity, company hiring activity, and portal movement. For each row, render a small status chip in each column — an affirming chip when the signal points live and a cautionary chip when it points ghost. Design posting A so all five chips are affirming and posting B so all five are cautionary, since both postings have the same title and the same sponsorship tier. Add a final summary row showing the resulting classification: live for A, ghost for B. The visual thesis is that identical employer and title still split on the signals. Two columns, five signal rows, one classification row; avoid any red-green pairing for the chip states.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Two postings, same employer + title + sponsorship tier. Five signal rows: posting age (A: 9 days / B: 11 weeks), last-updated (A: recent / B: never), description specificity (A: named project / B: duplicated 18-mo-old text), company hiring activity (A: churn / B: frozen), portal movement (A: yes / B: none). Classification row: A = live, B = ghost.
`[O - ORGANIZATION]` Two columns (A, B); five shared signal rows + one classification row; affirming vs cautionary chip per cell.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (posting A / live chips #0072B2, posting B / ghost chips #D55E00, classification row accents reuse same), 1pt strokes, white bg, NO baked text, NO style suggestions. Explicitly avoid red-green chip coding.
`[E - EXCLUSIONS]` Omit: signal values baked as numerals, job-board UI, the title rendered, green-check/red-x glyphs, 3D, drop shadows.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static scatter-with-band — stability is read at a glance; animating years adds noise.
Figure 2 — REJECTED — static parallel map — the analogy is absorbed by simultaneous comparison.
Figure 3 — STRONG CANDIDATE — five signals resolving to one of three calls — animating the five inputs lighting up and the classifier selecting a branch teaches the funnel as a live decision.
Figure 4 — WEAK CANDIDATE — chips could reveal row by row — apt for suspense, but the contrast lands best as one frame.
Video candidates: 1. Recommended for production: Figure 3 (five-signal classifier) — animating signal inputs feeding the classifier and the three-way call resolving makes the live/ghost/investigate logic legible as a process, which is exactly how the chapter wants the classification understood.
