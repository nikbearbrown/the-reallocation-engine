# BUILD-LOG — claude-liam-two-hundred-applications

## 2026-08-23 — PLAN authored (gate presented, awaiting approval)

- Family: **ai-explainer** (claude-liam · Kokoro `am_onyx` · Teardown ·
  IN-FOR-BEAR honored at B00 and BOUT). **Episode 2** of the playlist
  "The Reallocation Engine".
- Source: `book/chapters/00-introduction.md` — the book's Introduction.
- Title: **Two Hundred Applications, Thirty-One Days** — the chapter's own
  opening scenario, and a poster line that restates cleanly at BOUT.
- Greeting: **"Merhaba, Liam"** (Turkish). Rotation check: Hola taken by
  Episode 1, Namaste reserved by the parked deep episode, Annyeong by the
  git-claude-code reel.
- 16 beats, 1,011 words, est **6:01** at 2.9 w/s (durations derived from the
  word clock, not hand-guessed — audio will be the real clock).
- Spine: cold open (question = the chapter's puzzle) → the scene → the
  attrition → the diagnosis → the RCT → the division of labour → the two-sided
  rule → ASK→RESULT (Tier One pile) → the systems judging you → why it can't
  self-audit → trace one decision → Mira closed → verdict → your turn → title
  outro.

### Scope boundary against Episode 1

Episode 1 (`claude-liam-what-is-the-reallocation-engine`) is the visual README:
repo tour, quick start, and the three mechanisms (verified-data contract,
gates-not-votes, skip rate). **This episode deliberately does not re-teach any
of them.** Where the Introduction restates the mechanisms, the reel substitutes
the material Episode 1 does *not* have: Mira, the Anthropic RCT, the
Tier-1/irreducibly-human division, the use-more/trust-less rule, the
self-audit impossibility, and the traced decision. The one place they touch is
B10, which shows the *audit trace* rather than the contract that produces it.

### Open decision for the human at GATE P

**Length.** 6:01 against Episode 1's 4:38. The Introduction is a denser chapter
and no beat is padding, so the plan holds the length rather than thinning the
argument — but if series consistency matters more, **B08** (`TRUST IT LESS` —
the ATS and match-score systems judging the applicant) is the designated cut:

- it is the only beat whose supporting figures are *all* `[verify]`-flagged in
  the source (and therefore already stripped to mechanism-only);
- B09 carries the "trust it less" half of the rule on its own without it;
- cutting it lands the reel at **~5:37** and removes one of the two adjacent
  C3-illustration beats (B07/B08), which slightly improves visual variety.

Recommendation: **keep B08.** It is the only beat that shows AI pointed *at* the
viewer rather than wielded by them, and that reversal is what makes the
"trust it less" half feel earned rather than asserted. But it is a real call and
it is the human's.

### DOUBLE-CHECK pass (applied, see SOURCES.md for the full table)

Three `[verify]`-flagged claim families in the source chapter were stripped to
mechanism and kept off screen entirely:

| Stripped | Reel says instead |
|---|---|
| ~56% validated-AI-skill wage premium | "the market is paying for exactly this combination — your domain, plus AI" |
| ~82% screen with AI / ~21% auto-reject | "may reject it with no human in the loop" |
| Eightfold AI · *Kistler v. Eightfold* | "a match-score vendor … whose bias you cannot inspect" |

Kept on screen because both trace to primary sources in the book's own
reference list: the Anthropic RCT figures (n=52 · 67% · 50% · ~17 points,
arXiv:2601.20245, cited small on the B04 plate) and the 90-day OPT clock
(USCIS Policy Manual Vol. 2, Part F, Ch. 5).

Mira's ⅓ and ½ figures are the chapter's own scenario, not population rates —
B01's Manim caption and B02's `slideMeta` both read "the book's opening
scenario" so they can never be misread as measured statistics.

### ILLUSTRATE-law check

UI appears at B00, BASK1, BVDT, BHTF, BOUT only. Typing appears at B00 and BHTF
only. No two consecutive beats share a visual scheme:

`UI → Manim → C2 attrition → C2 branch → Manim → C2 divergence → C3 card →
UI micro → C3 grid → C3 flow → Manim → code-block → Manim → UI ×3 (mandated spine)`

Two adjacencies were checked and accepted: B02/B03 (both `deckPatterns`, but a
dot-funnel and a branching question read as entirely different shapes) and
B07/B08 (both structural illustrations, but a chip grid and a source→app flow
likewise). If the human cuts B08, the second adjacency disappears.

### Props authored against the installed library

Unlike Episode 1 (which left prop adaptation to build time), this beat sheet's
props are written against the real type signatures found in the runtime:

- `deckPatterns.tsx` → `AttritionData` (B02), `BranchData` (B03), `FatesData`
  (B05) — all take a single `data` object.
- `illustrations/structural.tsx` → `PredictCard{question, commit}` (B06),
  `ChipGrid{items, cols, caption}` (B07), `SourceFlow{sourceLabel, feeds,
  destApp, destTitle, arcCaption, settleLine, rackRows}` (B08).

`sparkLine` is carried on the illustration beats as an extra prop for
SPARK-LINE LAW; if the installed components don't accept it, render it as the
standard spark overlay rather than dropping the line.

### Gate status

| Gate | Status |
|---|---|
| PLAN | **presented — awaiting approval** |
| Length call (keep/cut B08) | **awaiting human** |
| anim.json (C2 table: B02/B03/B05) | **DONE — awaiting human sign-off** |
| GATE P (narration) | pending |
| audio → conform | pending |
| VISUAL QC | pending |

---

## 2026-08-23 — Phase 2: source verify + anim.json

### Phase 1 findings (source verify)

- Chapter `00-introduction.md` diff against SOURCES.md claim ledger: **all claims
  hold**. No changes to Mira's scenario numbers, the RCT figures, or "How to read
  this book" commands since SOURCES.md was written.
- B10 commands run live:
  - `npm run score data/examples/ch11-roles.json` → 5 roles scored ✅
  - `data/examples/ch11-roles.json` present ✅
  - `data/examples/role-scores.md` present ✅
  - Real audit row (Cambridge biotech): sponsorship 0.90 · fit 0.70 · liveness
    1.00 · timeline 0.85 — **exactly matches the beat sheet's illustrative
    worked-example values**. No correction needed; the "illustrative" values ARE
    the real scorer output for that role.

### Phase 2: anim.json decisions

Full table in `anim.json`. Highlights:

**B02 AttritionChain** — props match `AttritionData` type exactly. Survival
fractions: 0.67 ("about a third" ghost → 67% real) and 0.50 ("more than half"
never sponsored → 50% survive). Derived counts: 200 → 134 → 67. Safe-zone
check: 200 dots at 1280×720 → dotR ≈ 2.9px, 14×15 grid, all inside SAFE. ✅

**B03 BinaryBranch** — `Branch` type requires a `fix` field; beat sheet branches
were missing it (would have rendered `→ undefined`). **FIXED:** added
`"fix": "send more applications"` (motivation branch) and `"fix": "route effort
by evidence"` (allocation branch). Beat sheet and anim.json both updated.

**B05 DivergentFates** — props match `FatesData` type exactly. ✅

**Palette decision:** No retint needed. `deckPatterns.tsx` constants are already
the claude stage: `BG=#F2F0E9, INK=#3D3929, ACCENT=#D97757, WARN=#A44A32`. The
BUILD-PLAN note about logging a retint is resolved — the colors are already
correct.

### Gate failures caught by hook (fixed)

Two `beat_sheet.json` issues caught by `postedit-check.sh` and corrected:
- **BASK1 greeting was `""`** — SPARK-LINE LAW violation; fixed to `"Aggressive half."` (≤4-word arc cue from the beat's act label).
- **BOUT subline was `"The Reallocation Engine · Episode 2"`** — subline is opt-in per video, must be `""` unless explicitly chosen; fixed to `""`.

### C3 composition registration issues (for GATE P resolution)

Three structural illustration components in the beat sheet are NOT registered as
standalone Compositions in Root.tsx. Detail and resolution recommendations in
`anim.json` → `C3_registration_issues`.

| Beat | Pattern | Status | Recommendation |
|---|---|---|---|
| B06 | `PredictCard` | Not registered | Register `structural.tsx PredictCard` directly |
| B07 | `ChipGrid` | Registered, props mismatch | Remap beat sheet to DeepExplainerPatterns schema (`title`/`chips`) |
| B08 | `SourceFlow` | Not registered | Register `structural.tsx SourceFlow` directly |

### MISSING / machine-side

- Manim scenes: `B01_TwoCounters`, `B04_TwoLetterGrades`, `B09_SelfAudit`,
  `B11_TheReallocation` (specs in each beat's `graphic.production_viz`).
  B11 must be derived from B01 so the callback rhymes.
- Register `structural.tsx PredictCard` + `SourceFlow` as compositions, and
  remap B07 ChipGrid props — all three before GATE P renders.
- B10 code-block (Onda): verify `code-block` composition path before render.
- Thumbnail suggestion: B01 frame — `200` ink beside `31` terracotta, title
  serif beneath.
