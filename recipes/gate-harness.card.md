---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "verification gate — passed 2026-08-11"
attestation: "Saloni Angre · 2026-08-11"
recipe_version: 0.1.0
type: card
---

# Gate-Behavior Harness — human card

The one-page version. Read this before you run the recipe, and again before you
believe its output.

## Purpose

The Bayesian Role Scorer (Ch.11) is the thing that tells you to Apply, Consider,
or Skip. Its central safety property is that **liveness and timeline are gates**:
they multiply the composite, so a dead posting or an impossible visa timeline
drives the score to zero regardless of how good the company looks on every other
axis.

That property is load-bearing. If it silently degrades into a vote — a small
penalty instead of a veto — the scorer starts recommending ghost jobs, and it
does it fluently, with a confident number attached. Chapter 16 names this as the
build failure to watch for.

This harness exists to make that property checkable on demand instead of assumed.

## What it can verify

- A closed liveness gate (`factor <= 0.05`) zeroes the composite even when every
  other vote is maximal.
- A closed timeline gate does the same.
- The gate boundary is **inclusive**: a factor of exactly 0.05 closes; 0.06 does not.
- Two partial gates compose **multiplicatively** (0.5 × 0.5 = 0.25), not additively.
- A *gated* Skip is distinguishable from a *low-score* Skip in the emitted reason.
  Both say Skip; only one means "this job is not real."
- An override with a decision but no written reason is ignored and warned about.
- The arithmetic the scorer reports matches the composite it reports
  (`composite == vote_sum × gate_product`), checked against its own trace.
- Every term in the trace carries a source label.
- **That its own assertions can fail** — by re-running everything against a
  mutated scorer with gates-as-votes and confirming the assertions catch it.

## What it cannot verify

This is the more important list.

- **Whether the inputs are true.** The harness tests how the scorer *combines*
  sponsorship, fit, liveness, and timeline. It does not check that any of those
  numbers reflect reality. Hand it a ghost posting labelled `liveness: 1.0` by a
  broken upstream feed and it will score it as live, pass every assertion, and
  tell you nothing is wrong. Input truth is Chapter 8's job, not this harness's.
- **Whether the weights are right.** It asserts the config it was written
  against, so it catches *drift*. It has no opinion on whether 0.35 / 0.30 / 0.0
  are correct. Two of the scorer's own constants are marked `[VERIFY]`.
- **Whether the thresholds are well chosen.** 0.30, 0.20, and 0.05 are asserted
  as-configured, not as-justified.
- **Anything about real roles.** Ten synthetic fixtures are not a sample of the
  job market.
- **That the scorer is correct overall.** It tests gate semantics. The scorer
  does other things — profile-conditional weighting, soft-tier demotion — that
  are only partially covered here.

## Dependencies

| Needs | Why | If missing |
|---|---|---|
| `scripts/score/role-scorer.mjs` | the target under test | harness exits 2 |
| `scripts/score/fixtures/gate-cases.json` | the cases and their expected values | harness exits 2 |
| Node (repo already requires it) | runs the scorer as a subprocess | harness exits 2 |
| Writable `output/` | artifacts | harness exits 2 |

No network. No `data/` access. No private files. Nothing in the repository is
modified — the mutant used for the negative control is written to an OS temp
directory.

## Commands, annotated

```bash
npm run score:gates
```
Full run: ten cases against the real scorer, then the same ten against a mutated
copy. This is the one to use.

```bash
npm run score:gates -- --no-mutate
```
Skips the negative control. Faster, and **weaker** — a green result from this
variant does not establish that the assertions discriminate. Use only when you
have already seen the control pass in the same session.

```bash
npm run score:gates -- --quiet
```
Summary lines only. Suitable for CI; unsuitable for judging a failure, because
the per-assertion diagnostics are what tell you *which* gate broke.

Exit codes: `0` pass · `1` an assertion failed or the control missed · `2` could
not run.

## What it produces

- `output/gate-harness/gate-harness-[DATE].json` — machine-readable, every value
  labelled `script-output` / `fixture` / `harness-count`.
- `output/gate-harness/gate-harness-[DATE]-audit.md` — the human report: config
  table, case table, structural checks, negative-control table, and the
  cannot-verify list.

Both go to `output/`. Neither is a source of truth; both are regenerable.

## Failure modes

**1. Drift — the scorer's CONFIG moves and the expected values go stale.**
Every expected composite in the fixture file was derived by hand from specific
weights and thresholds. Change `weights.fit` from 0.30 to 0.25 and all ten
expectations are wrong — but they are wrong in a way that produces confident
FAILs pointing at the wrong culprit. *Detection:* the `config-matches-fixtures`
check compares six live CONFIG values against the fixture's declared assumptions
and stops the run. *If it fires:* re-derive the fixtures by hand against the new
config and show the working in each `why` field. Do not just accept the new numbers.

**2. Drift, second kind — the mutation patterns stop matching.**
The negative control works by string-replacing two exact lines in the scorer's
source. Refactor those lines and the replacement silently does nothing — the
"mutant" becomes identical to the original, every assertion passes against it,
and the harness would report a control that proves nothing. *Detection:* the
harness verifies both patterns matched before running the mutant and reports
`mutation-drift` if either did not. *If it fires:* the run is inconclusive, not
green. Update the patterns to the scorer's current source.

**3. Contract violation — expectation laundering.**
The cheapest way to make this harness green is to edit `gate-cases.json` so the
expected values match whatever the scorer currently outputs. That takes about
thirty seconds, produces a clean PASS, and destroys the entire value of the
harness — you would have a test that asserts the code does what the code does.
This is the failure the verified-data contract exists to prevent, aimed at a test
file instead of a data file. *Detection:* none, automatically. This one is
governed by the stop condition in the recipe and by review of the fixture diff in
the PR. *Mitigation:* every expected value carries a hand-derivation in its `why`
field; a changed expectation with an unchanged `why` is the tell to look for in
review.

**4. False assurance — a pass read as more than it is.**
"Gate harness: PASS" is easy to read as "the scorer is correct" or worse, "these
job recommendations are trustworthy." It means neither. It means the arithmetic
combining five numbers behaves as documented. If those five numbers are garbage,
the harness passes and the recommendation is still wrong. *Detection:* none —
this is a human failure, not a code one. *Mitigation:* the audit report ends with
the cannot-verify list rather than the summary, deliberately, so the last thing
read is the limitation rather than the green light.

**5. Silent weakening via `--no-mutate`.**
A CI job or a hurried operator using `--no-mutate` gets a green result with the
one check that makes the others meaningful switched off. *Detection:* the summary
line prints `negative control: skipped (--no-mutate)` and the Markdown report
says the run cannot establish discrimination. *Mitigation:* read the summary
block, not just the exit code.

## Who signs

This card and its recipe stay `DRAFT` until a named human runs the harness, reads
the audit, and records name + date in the `attestation` frontmatter field of
both files. The harness does not certify itself, and a PASS in an artifact it
generated is not an attestation.
