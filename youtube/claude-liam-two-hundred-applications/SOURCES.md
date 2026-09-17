# SOURCES — claude-liam-two-hundred-applications

## Source

- `the-reallocation-engine` repo — `book/chapters/00-introduction.md` (working
  tree, 2026-08). Episode 2 of the playlist: the book's Introduction, whose job
  is to make the reader *feel* the allocation problem before any machinery is
  introduced. Episode 1 (`claude-liam-what-is-the-reallocation-engine`) owns the
  repo tour and the three mechanisms; this reel must not re-teach them.

## Claim ledger

| Beat | Claim on screen / in narration | Basis in the chapter |
|---|---|---|
| B01 | Mira, week six, F-1 graduate, 200 applications sent, 31 days left on a 90-day clock | ¶1, verbatim scenario ("A student — call her Mira") |
| B02 | ~a third ghost listings; more than half never filed a visa petition | ¶1 — the chapter's own scenario figures |
| B03 | "She did not have a motivation problem. She had an allocation problem." | ¶1, closing sentences — the chapter's thesis turn |
| B04 | Anthropic RCT: n=52, hand-coded 67%, AI-assisted 50%, ~17 points ≈ two letter grades, AI group *felt* they learned more | "The argument, in one breath" ¶ + `[^00-anthropic]`; primary: Shen & Tamkin, arXiv:2601.20245 (in the book's References) |
| B05 | Tier 1 (pattern-finding, retrieval, drafting, formatting) vs. auditing for plausibility, formulating the question, reasoning about cause, accountability | "What this book is" ¶4 — the chapter's own four-and-four enumeration |
| B06 | "use AI more aggressively than most career advice would, and to trust it less. Both at once." | "A note about AI" ¶1 — near-verbatim |
| B07 | The Tier 1 delegation list (cover letter, ATS-safe résumé, 10-K summary, sponsorship history from a filing, five OPT framings) | "A note about AI" ¶2 — the chapter's own list |
| B08 | An ATS screens with AI and may auto-reject with no human in the loop; a match-score vendor ranks you with a model whose bias you cannot see | "A note about AI" ¶3 — narrated as MECHANISM; see stripped list below |
| B09 | "the same weights that produce an AI's confident output are the weights that would have to audit it" → the check must come from outside the model | "A note about AI" ¶4 — near-verbatim |
| B10 | `npm run score data/examples/ch11-roles.json` → audit at `data/examples/role-scores.md`, terms labelled *record* / *model-judgment* / *your-input*; "distrust the recommendation before you distrust your confusion" | "How to read this book," step 3 — commands and labels verbatim |
| B11 | "Mira's problem was never effort. It was that nothing told her, before the clock did, where the effort was worth spending." | "Begin" ¶ — near-verbatim |
| B01/B09 | 90-day aggregate unemployment limit on post-completion OPT | `[^opt]`; primary: USCIS Policy Manual Vol. 2, Part F, Ch. 5 |

## Command verification (B10)

Checked against the repo working tree, 2026-08:

- `npm run score` → `node scripts/score/role-scorer.mjs` — present in `package.json`. ✅
- `data/examples/ch11-roles.json` — present on disk. ✅
- `data/examples/role-scores.md` — present on disk. ✅
- The four labels (*record* / *model-judgment* / *your-input*) are the scorer's
  own audit-trace vocabulary, per Ch. 11 and `DOMAIN.md`. ✅

The illustrative term values shown in the code-block comment (0.90 / 0.70 / 1.00
/ 0.85) are the **chapter 11 worked example** the scorer reproduces, not a live
run of the sample file. B10 shows them as commented trace lines, never as the
literal stdout of the command above them. If the build prefers strict fidelity,
run the command and paste the real audit rows instead — that is the better
version and should be preferred if the sample data is present at build time.

## Deliberately stripped (DOUBLE-CHECK LAW)

Every figure the source chapter itself flags `**[verify]**` is narrated as
mechanism only and appears nowhere on screen:

| Stripped | Why | What the reel says instead |
|---|---|---|
| ~56% validated-AI-skill wage premium (`[^00-premium]`) | chapter flags `[verify]`; figure will date | B07: "the market is paying for exactly this combination — your domain, plus AI" (no number) |
| ~82% of companies screen with AI; ~21% auto-reject (`[^00-screening]`) | chapter flags `[verify]` against the primary survey | B08: "may reject it with no human in the loop" — the durable mechanism, no rates |
| Eightfold AI; *Kistler v. Eightfold* (`[^00-eightfold]`) | chapter flags litigation specifics `[verify]`; naming a live suit on screen is an unforced risk | B08: "a match-score vendor ranks you with a model whose bias you cannot inspect" — no company, no case |

Also stripped:

- **Mira is framed as the book's scenario, not a statistic.** B01's Manim spec
  and B02's `slideMeta` both carry the caption "the book's opening scenario" so
  the ⅓ / ½ figures are never read as measured population rates.
- **No model version numbers, no dated counts** beyond the RCT (a published
  result, not a drifting metric).
- **The three mechanisms** (verified-data contract, gates-not-votes, skip rate)
  stay OFF this episode — Episode 1 owns them. B10 shows the *trace*, which is
  the introduction's own concrete handoff, not the contract lecture.

## Corrections applied

- The chapter's body hedges the premium as "large and growing" while its
  footnote carries the 56% figure with a `[verify]`. The reel follows the
  **body**, not the footnote — the durable half.
- The chapter's "How to read this book" lists five steps; the reel compresses to
  the one that is concrete and runnable (step 3, the traced decision). Steps 1–2
  and 4 are Episode 1 material (orientation files, `doctor`, the first-scan
  tutorial) and were dropped rather than duplicated.

## Credits

Book + repo: Nik Bear Brown (@NikBearBrown) · Humanitarians AI.
RCT: Shen, J. H. & Tamkin, A., "How AI Impacts Skill Formation," Anthropic,
2026 — arXiv:2601.20245.
