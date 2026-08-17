# CAJAL Figure Report — Introduction
_Density: recommend 2 figures, [Foundational]._

The introduction is conceptual orientation, not data exposition, so it sustains few figures. Two concepts cross the triage threshold: the repository's folder-and-orientation structure (a hierarchy/systems claim the reader must navigate, unverifiable from prose alone) and the four-step "try it now" onboarding sequence (an interdependent procedure). The five operating principles are a list, not a process, and read better as text. No quantitative content here warrants a chart.

## Figure 1 — Repository orientation map
Priority: Important · Type: systems diagram / hierarchy

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a flat systems map of a single code repository so a newcomer can see, at a glance, what each part is for and which files to read first. Place a central labeled container representing the repository root. Inside it, arrange the named parts as a small set of grouped nodes: the chapters manuscript folder, the read-first orientation map, the constitution file, the domain index, the scripts folder, the recipes folder, the data folder, and the run-log. Use one distinguished color and a heavier outline for the read-first map node to mark it as the entry point, then draw thin directional arrows from that entry node to the constitution, the domain index, and the run-log to show the recommended reading order. Group the scripts, recipes, and data nodes loosely together as the runnable machinery, set slightly apart from the orientation files. Keep every node a clean rounded rectangle of equal weight except the emphasized entry node. The composition should make obvious that one file is the door and the rest branch from it. Hold the whole figure to roughly eight nodes; do not crowd it.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito palette, white background.
`[C - CONTENT]` Repository root container; nodes for: chapters/ (manuscript), the read-first orientation map (entry, emphasized), the constitution file, the domain index, scripts/, recipes/, data/, run-log. Reading-order arrows from the entry node to constitution, domain index, and run-log. Scripts/recipes/data grouped as "runnable machinery."
`[O - ORGANIZATION]` Central container; entry node visually dominant; → arrows for reading order; spatial grouping separating orientation files from machinery folders. Single direction of flow outward from the entry node.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (entry/primary #0072B2, machinery group #56B4E9, orientation files #E69F00), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: actual file contents, terminal screenshots, command syntax, byte sizes, icons of folders, drop shadows, any node count beyond eight, decorative chrome.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Figure 2 — Four-step onboarding sequence
Priority: Supplementary · Type: process flowchart

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a linear four-step process flowchart showing the recommended ten-minute onboarding for a reader new to this repository. Lay out four sequential nodes connected left to right by single-direction arrows. The first node represents reading the orientation files; the second represents checking the environment with a doctor command; the third, the largest and most emphasized, represents running the decision core and tracing one of its outputs term by term; the fourth represents reading the first chapter. Under the third node, branch a small cluster of four labeled sub-tags representing the four traced terms a reader inspects in one output row — sponsorship, fit, liveness, timeline — each shown as a small chip, to convey that the third step is where verification actually happens. Keep the spine strictly linear and the sub-cluster clearly subordinate. Use a single accent color for the emphasized third node and a neutral color for the others. The figure should read as a short path with one deep stop in the middle.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` Default textbook: single-column 89mm, ≥300 DPI, vector, Okabe-Ito, white bg.
`[C - CONTENT]` Four sequential steps: (1) read orientation files; (2) check environment / doctor; (3) run the decision core and trace one output [emphasized]; (4) read Chapter 1. Sub-cluster under step 3: four traced terms — sponsorship, fit, liveness, timeline — each labeled record / model-judgment / your-input `[inferred grouping from text]`.
`[O - ORGANIZATION]` Horizontal linear spine, → progression arrows; step 3 enlarged; four subordinate chips branching downward from step 3.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex (step 3 active #009E73, other steps #56B4E9, chips #E69F00), 1pt strokes, white bg, NO baked text, NO style suggestions.
`[E - EXCLUSIONS]` Omit: actual command strings, npm syntax, clocks/timers, the word "ten minutes" rendered, screenshots, more than four steps, more than four chips, decorative borders.

BLOCK 3 — NEGATIVE PROMPT:
text labels, words, gibberish letters, titles, captions, decorative borders, realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion

## Video Candidate Pass
Figure 1 — REJECTED — static structural map, no temporal change — a repository layout is spatial, not animated.
Figure 2 — WEAK CANDIDATE — sequential reveal possible — the four steps could animate in order, but the payload is small and better served static.
Video candidates: 1. Recommended for production: none for this chapter — the onboarding sequence is too lightweight to justify motion over a clean static flowchart.
