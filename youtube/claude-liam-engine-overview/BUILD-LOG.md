# BUILD-LOG — claude-liam-engine-overview

**Skill:** deep-explainer  
**Kind:** engine  
**Channel:** claude-liam (Liam persona, Kokoro am_onyx)  
**Source repo:** the-reallocation-engine-fresh (read-only outside youtube/claude-liam-engine-overview)  
**Date:** 2026-09-16 (engineloop unattended run)

---

## Decisions

### VOX quota waived to zero
Engineloop instructions explicitly waive the deep-explainer VOX quota (normally 20–25% pantry stills) to zero. No SHOPPING.md entries, no Tier 2/3 requests, no human stops. All evidence beats drawn via Remotion library scenes (BarChart, PipelineFlow, SkillTeardownMechanism, ClaudeCodeBeat, FormACard). Logged in SHOPPING.md.

### Central claim
"The Reallocation Engine is a filter, not a finder. Its value is in the applications it talks you out of. Skip is the success case." — B01 BrutalistHesitantWriter correction: "find" → "stop". Sourced from DOMAIN.md verbatim: "a healthy run skips at least half of evaluated roles."

### Beat count
20 beats (B00–B16, BVDT, BHTF, BOUT). Spine: cold open → BLUF → four body acts (17 beats) → verdict → handoff → outro. Total audio: ~301.7s ≈ 5:02.

### Act structure
- Act I (B02–B03): The Fluency Trap — why OPT-clock pressure meets AI fluency as a problem
- Act II (B04–B09): Five Evidence Components — SEC Form D, 80 Days, ATS Liveness (gate), BLS Role Quality, Visa Timeline (gate)
- Act III (B10–B12): The Composite Score — Bayesian formula, worked example 0.446 vs 0.178
- Act IV (B13–B16): Recipes and the Human Gate — recipe lifecycle, Claude Code execution, command surface, human/machine separation

### Scenes used
ClaudeComposerAsk (×2), BrutalistHesitantWriter (×1), SkillTeardownMechanism (×4), BarChart (×3), PipelineFlow (×3), FormACard (×2), ClaudeCodeBeat (×2), ClaudeVerdictArtifact (×1), ClaudeTitleOutro (×1).

### B10, B13 FormACard advisory
GATE L flagged B10 and B13 (FormACard act-cards, each >8s) as advisory for missing `motion_claim`. Gate stance is `gate_s=warn` (not blocking). Both are deliberate act-transition dwells — the viewer is meant to read the staged lines. No fix applied; advisory accepted.

---

## Errors fixed during build

### Error 1: beat_sheet.json — `remotion` field in wrong location
**Symptom:** `[lane-check] FAIL BXX: [PIPELINE-SLATE-IN-CUT]` for all 20 beats; pipeline saw all beats as slates.  
**Root cause:** Initial beat_sheet had `remotion` as a sibling of `shot` (at beat top level). Pipeline expects `shot.remotion.pattern`.  
**Fix:** Rewrote entire beat_sheet with `remotion` nested inside `shot`.

### Error 2: FACTCHECK.md format
**Symptom:** `[FC-1] no claims table found. FACTCHECK.md needs a markdown table with a Beat column and a Verdict column`  
**Root cause:** Table missing `Beat` column; used 4-column format instead of required 6-column format.  
**Fix:** Rewrote FACTCHECK.md with `| # | Beat | Claim (as spoken / shown) | Verdict | Source / derivation | Fix |` table, 21 rows.

### Error 3: Missing scenes.py
**Symptom:** `[run] REFUSED: .../claude-liam-engine-overview has no scenes.py`  
**Root cause:** scenes.py file not created. Required even when no Manim beats exist.  
**Fix:** Created minimal scenes.py (imports from manim, palette constants, no scene classes).

### Error 4: B01 BrutalistHesitantWriter seed type mismatch
**Symptom:** `ZodError: Invalid input: expected string, received number` for `seed` prop  
**Root cause:** `"seed": 7` (integer) — BrutalistHesitantWriter Zod schema expects `seed` as string.  
**Fix:** Changed to `"seed": "7"` (string).

### Error 5: B15 ClaudeCodeBeat SWEEP-WARN
**Symptom:** `[GATE-SWEEP-WARN] §8.12 prose-in-code-card` and `§8.12b doubled-title`  
**Root cause:** Title "Verified Command Surface" has no file extension (becomes language badge in ClaudeCodeBeat). Code had comment-only lines interleaved with npm commands, flagged as no code tokens.  
**Fix:** Title → `"package.json"`. Code → JSON scripts excerpt showing actual script implementations (code tokens: `"`, `:`, `{`, `}` etc.).

---

## Quality grade
**Previz / review cut.** All gates passed or advisory-only at compile time. Not a verified-execution film — narration verified against DOMAIN.md + README.md + package.json, not against a live run of the scripts. FACTCHECK.md covers all 21 claim rows.

---

## Sourcing
- `the-reallocation-engine-fresh/README.md` — OPT clock window, fluency quote, public URL
- `the-reallocation-engine-fresh/DOMAIN.md` — five components, gate logic, Bayesian formula, worked example (0.446/0.178), BLS 100/112, recipe lifecycle
- `the-reallocation-engine-fresh/AGENTS.md` — "Machines verify conformance; humans verify adequacy."
- `the-reallocation-engine-fresh/package.json` — verified npm script names

---

## Files created
```
beat_sheet.json          — 20-beat master (v3 after B01/B15 fixes)
FACTCHECK.md             — 21-row claim table, GATE F PASS
SHOPPING.md              — empty (VOX=0 waived)
PLAN.md                  — build plan + act structure
CHECKS-REPORT.md         — teaching-arc verification
SOURCES.md               — source list with paths
scenes.py                — minimal stub (no Manim scenes, satisfies gate)
BUILD-LOG.md             — this file
BUILD-PROMPT.md          — paste-ready end-to-end build prompt (TODO: write after final)
```
