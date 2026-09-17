# PLAN — claude-liam-engine-overview

## Central Claim
The Reallocation Engine is a filter, not a finder. Its value is in the applications it talks you out of. Skip is the success case.

## Title
"The Reallocation Engine — Five Evidence Gates, One Human Decision"

## Misconception (B01 hesitant-writer correction)
First typed: "The machine helps you find" → corrected: "The machine helps you stop"
The body dismantles: the engine reallocates effort away from wrong roles, not toward right ones. Skip > 50% = working correctly.

## Act Structure

| Act | Subject | Beats |
|---|---|---|
| Bookend open | Cold open + BLUF | B00–B01 |
| Act I | The Fluency Trap | B02–B03 |
| Act II | Five Evidence Components | B04–B09 |
| Act III | The Composite Score | B10–B12 |
| Act IV | Recipes and the Human Gate | B13–B16 |
| Bookend close | Verdict + HANDOFF + Outro | B17–B19 |

## Beat-Lane Histogram (body beats B02–B16, 15 beats)

| Lane | Count | % | Notes |
|---|---|---|---|
| VOX | 0 | 0% | WAIVED per engineloop instructions (no pantry) |
| MANIM | 0 | 0% | All data beats covered by Remotion BarChart library scene |
| REMOTION | 13 | 87% | SkillTeardownMechanism, PipelineFlow, BarChart, FormACard, ClaudeCodeBeat |
| CARD | 2 | 13% | FormACard act cards |

VOX share is 0% (waived). Lint will warn but not block (per instructions: "do not silence it, do not report it as blocked").

## Beat List with Lane

| ID | Act | Lane | Scene | Visual Intent |
|---|---|---|---|---|
| B00 | cold open | REMOTION | ClaudeComposerAsk | Liam signs in; ask answered |
| B01 | BLUF | REMOTION | BrutalistHesitantWriter | "find" → "stop" correction |
| B02 | Act I | REMOTION | SkillTeardownMechanism | The fluency trap defined |
| B03 | Act I | REMOTION | BarChart | Skip majority = success metric |
| B04 | Act II | REMOTION | PipelineFlow | 5 components, 2 gates labeled |
| B05 | Act II | REMOTION | SkillTeardownMechanism | SEC Form D |
| B06 | Act II | REMOTION | SkillTeardownMechanism | 80 Days sponsorship |
| B07 | Act II | REMOTION | PipelineFlow | ATS liveness gate |
| B08 | Act II | REMOTION | BarChart | BLS local wage coverage 100/112 |
| B09 | Act II | REMOTION | SkillTeardownMechanism | Visa timeline gate (VETO) |
| B10 | Act III | CARD | FormACard | Act card: The Composite Score |
| B11 | Act III | REMOTION | ClaudeCodeBeat | Bayesian formula from role-scorer.mjs |
| B12 | Act III | REMOTION | BarChart | Apply 0.446 vs Skip 0.178 |
| B13 | Act IV | CARD | FormACard | Act card: Recipes and the Human Gate |
| B14 | Act IV | REMOTION | PipelineFlow | Agent → gate → human → log |
| B15 | Act IV | REMOTION | ClaudeCodeBeat | npm run doctor / score / ats:scan |
| B16 | Act IV | REMOTION | SkillTeardownMechanism | Human judgment is irreducible |
| B17 | verdict | REMOTION | ClaudeVerdictArtifact | Five gates, one decision |
| B18 | HANDOFF | REMOTION | ClaudeComposerAsk | Your turn prompt |
| B19 | outro | REMOTION | ClaudeTitleOutro | Title restate, Liam signs off |

## Source Facts Used (all verified against source files)
- OPT clock: 60–90 days — README.md
- 5 evidence components + 2 gates — DOMAIN.md
- Skip > 50% healthy — DOMAIN.md
- Bayesian formula: (Σ vote·weight) × liveness × timeline, threshold 0.3 — DOMAIN.md item 3
- Worked example: 0.446 (Apply) vs 0.178 (Skip) — DOMAIN.md item 3
- BLS local wage: 100/112 coverage, 12 reason-coded misses — DOMAIN.md item 9
- role_quality: 0.0 weight (unpinned authorial decision) — DOMAIN.md item 3
- npm command surface — package.json + DOMAIN.md
- Labor separation: "Machines verify conformance; humans verify adequacy." — AGENTS.md
- github.com/nikbearbrown/the-reallocation-engine — README.md

## Estimated Runtime
~280s ≈ 4:40 (within 4:40–10 min deep-explainer band)
