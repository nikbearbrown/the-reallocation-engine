# PLAN — claude-liam-skill-greenhouse-watch

## The One Claim

`greenhouse-watch` makes job-board watching tractable by fetching once, diffing
by ID, and applying a fully transparent, human-auditable rule-set — then
stopping. The decision stays with the person.

The misconception it corrects: people expect a recommender. What the tool
delivers is a diff engine with an audit trail. That narrow scope is the design,
not a limitation.

## Title

**greenhouse-watch — Your Board, Your Call**

## Act Structure

| Act | Beats | Idea |
|---|---|---|
| Bookend | B00, B01 | Cold open + BLUF |
| I — The noise problem | B02, B03 | 163 jobs; one command |
| II — The pipeline | B04, B05, B06 | 6 steps, one fetch, state file |
| III — The scheme | B07, B08 | Weights, justification lines |
| IV — The gate | B09, B10, B11 | Funnel, gate, design tell |
| Closing | B12, B13, B14 | Verdict, Handoff, Outro |

## Beat List with Lane

| Beat | Lane | Scene / Tool | Note |
|---|---|---|---|
| B00 | BOOKEND | ClaudeComposerAsk | cold open, Liam signs in |
| B01 | BOOKEND | BrutalistHesitantWriter | BLUF, finder→watcher correction |
| B02 | MANIM | B02_BoardCounter | 163 jobs / no new filter |
| B03 | REMOTION | ClaudeCodeBeat | the invocation command |
| B04 | REMOTION | StepStream | 6-step pipeline overview |
| B05 | REMOTION | ClaudeCodeBeat | fetch_board() + NoRedirect |
| B06 | MANIM | B06_StateCycle | baseline→diff two-run cycle |
| B07 | REMOTION | ClaudeCodeBeat | scheme.default.json weights |
| B08 | REMOTION | ClaudeCodeBeat | judge() justification lines |
| B09 | MANIM | B09_Funnel | 163→25→7 attrition |
| B10 | REMOTION | ClaudeCodeBeat | the gate line |
| B11 | MANIM | B11_DesignTell | China posting, soft location |
| B12 | BOOKEND | ClaudeVerdictArtifact | verdict recap |
| B13 | BOOKEND | ClaudeComposerAsk | Your turn |
| B14 | BOOKEND | ClaudeTitleOutro | outro |

## Beat-Mix Histogram (body beats B02–B11)

| Lane | Count | Share |
|---|---|---|
| MANIM | 4 | 40% |
| REMOTION | 6 | 60% |
| VOX | 0 | 0% — WAIVED per unattended loop rule |

VOX quota normally 20–25%; waived to zero by the loop: no pantry stills, no
shopping list, no human supply step. WARN noted, not blocked.

## Source Lines per Code Beat

| Beat | Lines cited |
|---|---|
| B03 | greenhouse_watch.py lines 243-251 (argparse CLI) |
| B05 | greenhouse_watch.py lines 46-55 (fetch_board + NoRedirect) |
| B07 | scheme.default.json weights + threshold |
| B08 | greenhouse_watch.py lines 138-202 (judge return), real output from run-second-run.json |
| B10 | greenhouse_watch.py line 307 (gate field), report header from report-second-run.md |

## Teaching Arc

- Framework beat: B04 (StepStream of 6 pipeline steps) — before examples ✓
- Worked example: B09 (real Airbnb run: 163→25→7) ✓
- Falsifiability: B11 (China posting, known weakness — scheme is the fix) ✓
- Scaffolded viewer task: B13 (Your turn handoff) ✓
- Bookends: B00, B01, B12, B13, B14 ✓
- No-source-no-verdict: every claim traces to SKILL.md, README.md, greenhouse_watch.py, scheme.default.json, or example outputs ✓
