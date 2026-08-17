# CAJAL Figure Report — The Pipeline Tracker and the Skip Rate
_Density: recommend 3 figures, Mixed._

## Figure 1 — Reading the Skip-Rate Dial
Priority: Critical · Type: statistical/quantitative

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a horizontal skip-rate gauge marked into four diagnostic bands that tell the reader whether the filter is working. Draw a single left-to-right axis from zero to one hundred percent. Partition it into four contiguous bands: a too-loose band below roughly forty percent signaling the filter is too permissive and you are back to volume; a borderline band from about forty to fifty percent; a healthy band above fifty percent signaling the filter is doing real work; and a starved band above roughly eighty-five percent signaling the funnel is over-tight or under-fed. Place a clear pointer or marker at a healthy example position above fifty. The counterintuitive message must read visually: low is bad, the comfortable middle-high zone is the target, and the extreme high is also a problem. Use the blocking hue for both failure bands at the extremes, the transitional hue for borderline, and the active hue for the healthy band. Keep to the single axis, four bands, and one pointer. Flat vector, zero-anchored axis, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Axis 0–100% skip rate. Bands: <40% too loose (volume); 40–50% borderline; >50% healthy; >~85% starved. Pointer at a healthy example. `[inferred]`: exact band boundary positions.
`[O - ORGANIZATION]` Single horizontal axis, four contiguous bands, one marker; failure at both extremes.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Too-loose + starved bands #D55E00; borderline #CC79A7; healthy #009E73; pointer #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric percentages as text, the words "healthy"/"starved" baked in, axis numerals, real data values.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — A Week of Decisions: Skips Are Data
Priority: Important · Type: statistical/quantitative

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a stacked breakdown of one week of evaluated roles, making clear that a skip is a logged decision and not an absence. Draw a single full-width bar representing all roles evaluated in the week, split into two segments: a larger skipped segment and a smaller applied segment, with the applied segment further subdivided to show the share falling in the higher sponsorship tiers. Beside or below it, place a small paired indicator contrasting per-tier response: a higher-tier response level visibly above a lower-tier response level, but with both flagged as small samples to resist over-reading. The dominant visual claim is that the skipped segment is real, recorded data — the larger part of the bar — proving the filter did work. Use the active hue for the applied-and-responding portion, a neutral hue for the skipped segment, and a small-sample caution marker on the response indicator. Keep to the one evaluated-roles bar with its segments and the paired response indicator. Flat vector, zero-based, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` One week bar: skipped segment (larger) + applied segment (smaller, sub-split by higher-tier share). Skip rate ≈57% example. Paired response indicator: higher tier > lower tier, both flagged small-sample. `[inferred]`: exact segment sizes.
`[O - ORGANIZATION]` Single stacked bar of evaluated roles; paired small response indicator alongside; caution marker on samples.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Applied/responding #009E73; skipped #56B4E9 neutral; sub-tier highlight #0072B2; caution marker #E69F00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric counts/percentages as text, company names, tier-name labels baked in, response-rate numbers.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — Two Readings: Skip Rate and Allocation
Priority: Supplementary · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw two side-by-side instrument readings that together tell whether the search is running as designed. The left reading is a skip-rate indicator showing whether the filter is working — a marker on a band that reads healthy. The right reading is an allocation split showing how the day's hours divide across three activities: applying, networking, and portfolio work, drawn as three proportional segments against a target split. Annotate the right reading with a drift indicator showing one segment (applying) creeping larger than its target share while another (networking) dips below — the drift the tracker catches before a week is lost. The pairing must convey that both readings are needed: the skip rate says the filter works, the allocation says the person is allocating their time well. Use the active hue for on-target portions and the transitional hue for the drifting segment. Keep to the two readings with their segments and the drift marker. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left: skip-rate indicator on healthy band. Right: hours split across apply/network/portfolio vs. a target (3-3-2); drift marker — apply creeping up, networking dipping. Both readings needed. `[inferred]`: exact segment proportions.
`[O - ORGANIZATION]` Two panels side by side; left = single indicator, right = three proportional segments with drift marker.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. On-target #009E73; drift segment #CC79A7; neutral segments #56B4E9. NO style suggestions.
`[E - EXCLUSIONS]` Omit: numeric hours/percentages as text, "3-3-2" baked in, activity-name labels, real data.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — REJECTED — static gauge; reads at a glance.
Figure 2 — REJECTED — static stacked breakdown; no temporal mechanism.
Figure 3 — REJECTED — paired static indicators.
Video candidates: 0. Recommended for production: none — this chapter's figures are diagnostic readouts that resolve fully as static images; no multi-step mechanism warrants animation.
