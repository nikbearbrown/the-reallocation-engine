# CHECKS-REPORT — claude-liam-skill-greenhouse-watch

## Per-beat classification

| Beat | Classification | Note |
|---|---|---|
| B00 | SHOW (ClaudeComposerAsk with answer lines) | bookend exempt |
| B01 | SHOW (BrutalistHesitantWriter, correction visible) | bookend exempt |
| B02 | SHOW (Manim counter + NO rows animate) | claim: 163 jobs, no native filter |
| B03 | SHOW (ClaudeCodeBeat: CLI invocation) | claim: one command, four flags |
| B04 | SHOW (StepStream: 6 steps) | claim: six pipeline steps |
| B05 | SHOW (ClaudeCodeBeat: fetch_board + NoRedirect) | claim: allow-list, no redirects |
| B06 | SHOW (Manim two-run diagram) | claim: baseline→diff state cycle |
| B07 | SHOW (ClaudeCodeBeat: scheme weights) | claim: threshold 3.0, weights table |
| B08 | SHOW (ClaudeCodeBeat: real justification lines) | claim: field-cited justifications |
| B09 | SHOW (Manim attrition funnel) | claim: 163→25→7 actual run numbers |
| B10 | SHOW (ClaudeCodeBeat: gate line) | claim: machine stops here |
| B11 | SHOW (Manim card: China posting) | falsifiability / design tell |
| B12 | SHOW (ClaudeVerdictArtifact) | bookend exempt |
| B13 | SHOW (ClaudeComposerAsk: handoff) | bookend exempt |
| B14 | SHOW (ClaudeTitleOutro) | bookend exempt |

**0 SHOW / 0 justified-HOLD / 0 PUNT-flagged**

## Teaching arc

| Item | Status |
|---|---|
| FRAMEWORK beat before examples | ✓ B04 (StepStream pipeline) before B08/B09 (examples) |
| WORKED EXAMPLE | ✓ B09 (real Airbnb run: 163→25→7) + B08 (real justification lines) |
| FALSIFIABILITY | ✓ B11 (China posting: known weakness named, fix in scheme file) |
| SCAFFOLDED VIEWER TASK | ✓ B13 (your-turn: clone repo, run baseline, watch the delta) |
| BOOKENDS | ✓ B00, B01, B12, B13, B14 |
| NO-SOURCE-NO-VERDICT | ✓ every factual claim in FACTCHECK.md traces to source files |

## Beat-mix histogram (body beats B02–B11)

- MANIM: 4 (40%) — within target range ✓
- REMOTION: 6 (60%) — above target (30–45%), WARN
- VOX: 0 (0%) — below target (20–25%), WARN — WAIVED per loop rule (no pantry)

VOX waiver logged: unattended loop, no human supply step, code-centric skill.
All beats are SHOW-classified with real source artifacts.
