# Liveness factor — human card

## Executive summary

This card is for a student on F-1 OPT who is already scoring roles with
`npm run score` and types the liveness number in by hand. It explains what the
tool decides for you, how far to trust each part, and what to do with each result.
The short version: whether a posting is alive is read from the page itself and is
trustworthy; **how much that should lower a role's score is my judgment, not a
record**; and a posting the checker could not reach is deliberately *not* penalised
— it is marked as unverified, and that distinction is the whole point.

**Audience:** the person deciding where to spend this week's job-search hours.
**Agent twin:** `recipes/cases/2026fa/sanjanaalapati02-liveness-factor.md`.
**Status:** DRAFT. The tests pass end-to-end; nothing calls it automatically yet.

## Purpose

Answer, for one posting: **how much should its liveness move the Apply / Consider /
Skip decision?** And say plainly when the honest answer is "we could not check."

## What it can verify (from records)

- **The posting is gone.** An HTTP 404/410, a redirect to an error URL, or page
  text saying applications are closed. Read straight from the page. → score goes
  to **0**, and the scorer says *Skip (gated)* rather than *Skip (low score)*.
- **The posting looks open.** A visible Apply control on the page. → **no penalty**.
- **The job ID vanished.** The page loaded, but the final URL no longer contains
  the job's ID — the link bounced to a careers search page whose Apply buttons
  would otherwise read as "live". → treated as **ambiguous**, not dead.

## What is my judgment, not a record

**The numbers themselves.** That an ambiguous posting should halve a role's score
— rather than zero it, or ignore it — is a choice I made. It is calibrated, not
arbitrary: 0.5 moves the textbook example from 0.4462 (Apply) to 0.2231, which
lands in the Consider band. But a different number is defensible and you should
disagree with it if your search says otherwise.

**That short pages are doubt, not death.** The classifier labels a page with under
300 characters as *expired*. I treat it as 0.5 ambiguity instead, because a nearly
empty page is often a rendering failure rather than a closed job. This is the one
place where my rule deliberately disagrees with the classifier's own verdict.

## What is NOT checked

- **Whether anyone is actually reading applications.** A live Apply button is not
  a live hiring process. This measures the door, not the room behind it.
- **Anything about sponsorship, fit, salary, or your timeline.** Those are other
  signals; this one only touches liveness.
- **Postings `scan --verify` already threw away.** If you ran the scanner with
  `--verify`, dead postings were dropped *before* scoring, so this never sees them
  and your skip-rate will understate how much was actually rejected.

## How to read each result

| You see | It means | Do this |
|---|---|---|
| `liveness 1[record]` | An Apply control was seen on the page. | Trust it. Normal decision. |
| `liveness 0[record]` | The posting is confirmed gone. | Skip. Do not spend a day on it. |
| `liveness 0.5[record]` | Page loaded, job not confirmed. | **Open the link yourself.** One minute resolves it. |
| `liveness 1[unmeasured]` | **We never reached the page.** | Treat as unverified — not as verified-live. Re-check later. |

That last row is the one to internalise. The score is unchanged *because the check
failed*, not because the job is healthy. The label is there so the audit trail
never claims an observation that did not happen.

## When it refuses

If a posting's URL is malformed, isn't http(s), or points at a private/internal
address, the tool **will not give it a number at all**. It drops that row into a
rejects file and keeps going with the rest. A malformed URL is a config mistake in
your portals file; a private address means something is wrong with the feed. Either
way, a bad URL should never quietly become "a slightly worse job."

If it ever sees a liveness code it does not recognise, it **stops the whole run**.
That is intentional: a new code appearing upstream must be looked at by a person,
not silently treated as a healthy posting.

## Honest limits

- Nothing runs this for you yet. You invoke it by hand.
- The live-checking mode needs Chromium and a network, and is not covered by tests.
- `scan --verify` still filters dead postings out before scoring, so the gate
  rarely fires in that workflow.
- Status is DRAFT with no attestation: the tests pass, but no human has signed an
  honest run against real postings.
