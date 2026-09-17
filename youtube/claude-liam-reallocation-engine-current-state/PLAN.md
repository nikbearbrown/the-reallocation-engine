# PLAN — claude-liam-reallocation-engine-current-state

**Status: GATE 1 (plan) — awaiting approval. No audio generated. No spend.**

Persona **Liam** (`claude-liam`, Kokoro `am_onyx`, free). Register **Teardown**.
Brand **CLAUDE**. Owning book: `the-reallocation-engine-fresh`.

---

## The find that reframed the episode

I was briefed that all recipes are DRAFT and that one logged run is awaiting
attestation. **Checked against the tree, both are now wrong** — and the way they're
wrong is the episode.

| Claim (from `status.md`, dated 2026-06-14) | What the tree says |
|---|---|
| "all 42 [recipes] are still `status: DRAFT`" | **41 files: 29 DRAFT, 6 RUNNABLE-SAMPLE, 2 RUNNABLE-LIVE** |
| "the one thing that matters next: attest the honest run … see `reports/generated/oferta-2026-06-14.md`" | **that report is absent from this tree** (only `logs/oferta-2026-06-14.json` survived the fresh cut) |
| `canonical: [… chapters/]` | manuscript is at `book/chapters/` |
| — | `workday-connector` is **RUNNABLE-LIVE**, attested by a **named student, 2026-08-11** |

`status.md` predates the 2026-08-17 fresh cut by two months and was not rewritten
after the reorganisation it describes. `DOMAIN.md` also still says the core recipes
"are currently **DRAFT**."

So the film's turn is earned rather than imposed: **a project built to distrust
fluent surfaces grew a fluent surface.** The status file reads clean, is well
organised, and is the least current file in the repository. That is not hypocrisy —
it's the fluency trap operating on its own author, which is the most honest thing
this episode could be about.

The other genuine finding: the ladder finally moved, and **a student moved it.** The
first named attestation is not the author's.

---

## Act map

| Act | Beats | Turn |
|---|---|---|
| **B00** cold open | 1 | The ask: "tell me what actually runs, and don't be nice about it" |
| **I — The Book That Is a Machine** | 6 | Book and machine are one tree; the OPT clock is what makes it honest |
| **II — Gates, Not Votes** | 7 | Fluency is the enemy; gates multiply, so zero kills; skip is the product |
| **III — DRAFT Until a Human Signs** | 7 | The lifecycle; it was stuck; a **student's** signature moved it |
| **IV — What Actually Runs** | 7 | Honest RUNS / DOESN'T columns; the named CLI is roadmap; `role_quality = 0.0` |
| **V — The File That Got Fluent** | 6 | **The turn.** The status file is stale, confident, and unpoliced |
| **Closing block** | 3 | Verdict → Your turn → Title re-read |

**37 beats · 33 body · ~881 words · est. 5:06** at 2.9 w/s. Low end of the 5–10 band —
per duration-planner doctrine that's an output, not a miss. Measured audio is the only
real clock.

## Lane histogram — all lint checks pass

| Lane | n | Share | Target | |
|---|---|---|---|---|
| VOX | 7 | 21.2% | 20–25% | PASS |
| MANIM | 9 | 27.3% | 25–40% | PASS |
| REMOTION | 12 | 36.4% | 30–45% | PASS |
| CARD | 5 | 15.2% | remainder | PASS |

Max consecutive same-lane (body): **3** — at the WARN boundary, not over. It occurs
once, in Act II's three-beat Manim run (contract → equation → collapse-to-zero), where
sameness is the argument: the same surface holding still while the maths does the work.

**Vox runs** — all within contract (≤3 beats, never crossing an act), handoff blocks
authored at plan time:

- **R1** (2, Act I) — calendar detail → pull back to the whole wall
- **R2** (3, Act III) — unsigned stack → push in as signature draws on → pull back to three uneven piles
- **R3** (2, Act V) — the clean status page → terracotta strikethroughs draw across it while it stays beautiful

## Deliberate choices worth your veto

**No real name on screen.** A student's attestation is the emotional hinge of Act III,
and the narration says "a student's" — never the name. A person who signed an internal
gate did not consent to appearing in a published film. Beat A305's plate is generic and
the show-note says so explicitly.

**`role_quality = 0.0` is framed as an unmade decision, not a bug** (Act IV), because
that's what the code says — the `[VERIFY]` comment records that the chapter never pinned
the weight and the code refuses to invent one. That framing is more flattering *and* more
accurate, which is the rare case where those agree.

**Act V does not accuse.** The line is "that is not hypocrisy — it's the mechanism working
exactly as advertised, on its author." A Teardown that lands as a gotcha about the person
paying for the episode is a worse film and a less true one.

**Datable material stripped** (DOUBLE-CHECK LAW): no model names, no tool versions, no
"as of August". The counts that remain — 21 chapters, 25 commands, 41 recipes, the 2/6/29
split — are load-bearing to the argument, and Gate F re-verifies each against the tree
before audio.

---

## Gates

| Gate | State |
|---|---|
| **1 · plan** | **← you are here** |
| 2 · factcheck (`FACTCHECK.md`) | pending — every count re-verified against the tree |
| **GATE P** — narration on animated slate, **before any audio spend** | not reached |
| audio lock → align | not reached |
| D2 · `SHOPPING.md` (tier-0 library pass first, after audio lock) | not reached |
| D1 · slate previz | not reached |

Approve, or tell me what to change and I'll re-plan before anything is spoken.
