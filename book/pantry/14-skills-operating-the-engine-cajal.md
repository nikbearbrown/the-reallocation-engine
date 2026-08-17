# CAJAL Figure Report — Recipes: Operating the Engine
_Density: recommend 3 figures, Mechanistic._

## Figure 1 — Active vs. Draft Recipes
Priority: Important · Type: comparison panels

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a two-column taxonomy contrasting active recipes with draft and helper recipes by what they actually do, not by their names. The left column groups the active recipes — each represented as a node that visibly connects to a called-script icon and an audit-file icon, signaling that its output is a finding. The right column groups the draft and helper recipes — each represented as a node with no confirmed script or audit connection, carrying a verify-before-trusting marker. The visual must convey that the split is about evidence, not hierarchy: a verified draft node can migrate to the active side, so leave a faint migration path between the columns. Render the active, finding-grade nodes in the active hue and the unverified draft nodes in the transitional hue. Keep to roughly five nodes per column plus the migration path. Flat vector, white background, single-headed connectors, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Left (active): nodes each linked to script icon + audit icon → finding. Right (draft/helper): nodes with no confirmed script/audit + verify-before-trusting marker. Faint migration path: verified draft → active. Split is evidence-based, not permanent. `[inferred]`: count of nodes per column.
`[O - ORGANIZATION]` Two columns; active nodes connect (→) to script/audit icons; draft nodes lack connections; dashed migration path between.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Active/finding nodes #009E73; draft nodes #CC79A7; icons #0072B2. NO style suggestions.
`[E - EXCLUSIONS]` Omit: recipe names ("oferta", "scan" etc.) as baked text, file paths, command strings, code.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 2 — The Run-Inspect-Record Loop with Provenance Checkpoints
Priority: Critical · Type: cycle diagram

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Render a cycle diagram of the engine's operating loop with an emphasized provenance checkpoint. Arrange three primary stages in a closed loop: a run stage where an active recipe executes against a real target, an inspect stage where output and its provenance are examined, and a record stage where the run is logged. Draw the loop arrows single-headed and circular so the boredom-as-safety of repetition reads visually. At the inspect stage, attach a prominent checkpoint asking three things — did it call the script, is there an audit, can the number be traced to a record — drawn as a gate that the run must pass to be trusted. Show a branch from the inspect checkpoint: pass continues to record, fail diverts to a re-run-with-inspection node. The inspect stage must be visually the heaviest, since skipping it reopens the fluency trap. Keep to three loop stages plus the inspect checkpoint and its fail branch. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Loop: run (active recipe on real target) → inspect (output + provenance) → record (run log) → back to run. Inspect checkpoint: script called? audit present? number traceable? Pass → record; fail → re-run with inspection. Inspect is the heaviest stage. `[inferred]`: checkpoint glyphs.
`[O - ORGANIZATION]` Closed three-stage cycle (→ circular); inspect stage carries a gate with pass/fail branch.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Run #56B4E9; inspect gate #0072B2 (emphasized); record #009E73; fail branch #D55E00. NO style suggestions.
`[E - EXCLUSIONS]` Omit: "RUN_LOG.md" or recipe names baked in, command strings, file paths, the three questions as full sentences.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Figure 3 — End-to-End Chain: Scan → Pipeline → Oferta → Verify
Priority: Important · Type: systems diagram

BLOCK 1 — ILLUSTRAE PASTE BLOCK:
Draw a four-link horizontal chain representing one role operated from scan to evaluation, with a provenance checkpoint annotated under each link. The first link is a scan stage, annotated that an ATS was detected and postings pulled. The second is a pipeline stage, annotated with four scored factors each carrying a source label. The third is an evaluation stage, annotated that the composite traces each term to its origin. The fourth is a verification stage, annotated that underlying data consistency is confirmed. Connect the four links with single-headed forward arrows, and at the chain's end draw an arrow into a run-log node. Below the chain, run a continuous emphasis conveying that the chain is only as trustworthy as its weakest provenance link. Render each link uniformly with its checkpoint badge, using the primary hue for the links and a distinct hue for the verification stage. Keep to four links plus the run-log node. Flat vector, white background, no baked text.

BLOCK 2 — FULL SCOPE:
`[S - SPECIFICATION]` textbook default: single-column 89mm, ≥300 DPI, vector, Okabe-Ito.
`[C - CONTENT]` Link 1 scan: ATS detected, postings pulled. Link 2 pipeline: four factors with source labels. Link 3 oferta: composite with traced terms. Link 4 verify: consistency audit. → run-log node. Weakest-provenance-link caveat. `[inferred]`: checkpoint badge glyphs.
`[O - ORGANIZATION]` Four links left-to-right (→); provenance badge under each; terminal arrow to run-log.
`[P - PRESENTATION]` Flat vector, Okabe-Ito hex, 1pt strokes, white bg, NO baked text. Links #56B4E9; verify stage #0072B2; run-log node #009E73; badges #000000. NO style suggestions.
`[E - EXCLUSIONS]` Omit: command strings ("npm run ats:scan"), recipe names baked in, company name, factor numbers, file paths.

BLOCK 3 — NEGATIVE PROMPT:
realistic textures, drop shadows, gradient backgrounds, photographic elements, dual-headed arrows, hand-drawn styles, human figures, visual clutter, watermarks, red-green color combinations, rainbow color scales, 3D perspective distortion, text labels, words, gibberish letters, titles, captions, decorative borders.

## Video Candidate Pass
Figure 1 — REJECTED — static taxonomy comparison; reads at a glance.
Figure 2 — CANDIDATE — a repeating loop with a pass/fail provenance gate animates naturally, reinforcing inspect-every-run discipline.
Figure 3 — CANDIDATE — a sequential chain with per-link provenance reveal could animate, but lower priority than the loop.
Video candidates: 2. Recommended for production: Figure 2 — the run-inspect-record cycle with its inspect gate diverting failed runs back is the chapter's load-bearing habit and animates as a clear repeating discipline loop.
