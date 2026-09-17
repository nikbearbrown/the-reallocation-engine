# BUILD-PROMPT — claude-liam-reallocation-engine-current-state

Paste the block below into a **local Claude Code session started in
`~/Documents/CoWork/bear-textbooks/books/`** (the toolkit and every book are children
of that cwd). It is standalone: it assumes no memory of the planning conversation.

---

Build the deep-explainer reel at
`the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state/`.
Run from `books/`. The `deep-explainer` skill governs; `ai-explainer` and `explainer`
are its parents and their laws all bind.

STATE: the plan gate is complete. `beat_sheet.json` (37 beats, 33 body) and `PLAN.md`
are in the reel folder. Read both before doing anything. No audio has been generated
and nothing has been spent.

PERSONA: Liam — channel `claude-liam`, engine Kokoro, voice `am_onyx`, free.
Do NOT use ElevenLabs or the `nbb` clone. Register: Teardown. Brand: CLAUDE.

PROCEED IN THIS ORDER AND STOP AT EVERY GATE. Do not run ahead.

STEP 1 — GATE F (factcheck). Write `FACTCHECK.md` in the reel folder, one row per
claim: claim | verdict | source | fix. This episode is ABOUT a project whose own
status file drifted, so inheriting any number from a doc is the exact failure mode.
Verify every one of these against the actual tree, not against `status.md` or
`DOMAIN.md`:

  - recipe lifecycle split — count frontmatter in `the-reallocation-engine-fresh/recipes/*.md`:
      grep -h "^status:" recipes/*.md | sort | uniq -c
    The sheet claims 2 RUNNABLE-LIVE / 6 RUNNABLE-SAMPLE / 29 DRAFT across 41 files.
  - `workday-connector` is RUNNABLE-LIVE with a named student attestation dated 2026-08-11.
  - 21 chapter files in `book/chapters/`.
  - 25 npm script entry points in `package.json`.
  - `role_quality: 0.0` with a `[VERIFY]` comment in `scripts/score/role-scorer.mjs`.
  - the scorer formula is (Σ vote·weight) × liveness × timeline, gates multiplicative.
  - `reports/generated/oferta-2026-06-14.md` is ABSENT from this tree while
    `logs/oferta-2026-06-14.json` is present.
  - `status.md` frontmatter is dated 2026-06-14 and its `canonical:` list names `chapters/`.
  - the snickerdoodle CLI is roadmap, not runtime; Claude Code is the v0 runtime.

If a count has moved since the plan was written, FIX THE BEAT SHEET rather than the
fact. Then STOP and report what changed.

STEP 2 — GATE P. Present the full narration for review on an animated slate BEFORE
any audio is generated. This is a hard spend gate. STOP.

STEP 3 — audio. Kokoro `am_onyx` only. Generate, measure, and let the real durations
become the master clock. Never hand-tune timings — regenerate and recompile. Then run
align to get the word clock so reveals land on the spoken word.

STEP 4 — GATE D2. Tier-0 library pass FIRST: for every VOX beat run
  python3 runtime/scripts/pantry_search.py "<terms>" --copy <reel> --beat <BID>
against the toolkit's still stock and LOOK at the candidates before accepting one.
Then write `SHOPPING.md` from the LOCKED durations — never from estimates. Entries
ask for more duration than needed so conform trims rather than stretches. Tag tiers.
STOP and hand the list over.

STEP 5 — GATE D1. `./brutalist-art/art run the-reallocation-engine-fresh/youtube/claude-liam-reallocation-engine-current-state`
Full-length watchable previz: vox slots render as slates, Manim and Remotion render
for real, audio is real. Present it as a PREVIZ, never as a cut. STOP.

STEP 6 — pantry fill, then review cut, then VISUAL QC LAW pass, then
`./brutalist-art/art final <reel>`.

HARD RULES FOR THIS REEL:

  1. NO REAL NAME ON SCREEN OR IN NARRATION. Beat A305 turns on a student's
     attestation signature. The narration says "a student's" and never the name; the
     plate is generic. Someone who signed an internal gate did not consent to a
     published film. If a pantry still or a code screenshot would expose the name,
     crop or redact it.
  2. Render Remotion ONLY via `runtime/scripts/remotion_scenes.py <reel>`, foreground,
     `--concurrency=1`. Never hand-roll `npx remotion render`, never background it.
     Match props to each component's zod schema.
  3. Verify every render by LOOKING at a frame and at `qc-sheet.png`. A render that
     exited 0 is not a render you have checked.
  4. Strip datable material — no model names, no tool versions, no "as of <month>".
     The counts that remain are load-bearing and were verified at Gate F.
  5. NEVER PUBLISH. The master stays in the reel folder. YouTube upload happens only
     from `books/youtube/TOPOST/` via the `post` skill, and only when a human runs it.
  6. Log decisions, `MISSING:` lines, and gate signatures in `BUILD-LOG.md` as you go.

If anything is missing or a step cannot complete, write a `MISSING:` line in
`BUILD-LOG.md`, stop that thread, and tell me. Do not substitute or invent.
