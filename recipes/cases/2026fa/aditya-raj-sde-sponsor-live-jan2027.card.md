# Sponsor & Posting Reality Check — human card

**Audience:** an engineering candidate who will need future visa sponsorship and is screening
openings that start in January 2027.
**Agent twin:** `recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md`
**Status:** RUNNABLE-SAMPLE. Built, tested offline, run on sample data, and its report read and judged adequate by a person (2026-10-03). Not run on live data.

## Executive summary

This card is the one-page version of the procedure, for the person who will act on its results.
Before you tailor an application, it tells you:

- whether the posting still looks open;
- what is known about sponsorship, kept apart for the company's history and for this specific
  opening.

It ends every opening at a clear next step, and it is designed to say "unknown" rather than guess.
Read the "cannot verify" list before trusting any output.

## Purpose

Most of the research time before an application goes into two questions: is the opening real, and
could they hire someone who needs sponsorship? This procedure answers the first as far as a page
snapshot allows. For the second, it separates **what the company has done before** from **what this
posting says**. Your costliest mistake would be reading the first as the second.

## What it can verify

- Whether the company name matches zero, one, or several employers in the shipped sponsorship data,
  and what that employer's approval and denial counts say.
- What the repository's own liveness checker concludes from a page snapshot.
- Whether the posting text you supply contains clear refusal or offer wording, with the exact
  sentence shown.

## What it cannot verify

- **That this opening will be sponsored.** A company's counts cover an unstated period and every
  kind of role, and may include renewals.
- That the posting is open *right now*. Every check is a point-in-time snapshot.
- Sponsorship wording it was not taught. Paraphrases slip through, and "may sponsor" stays
  unresolved.
- Whether two similar company names are the same employer. You decide that.
- Whether your start date works. Timing is a labeled assumption, never checked.

## Dependencies

- Node 20 or later, run from the repository root.
- The shipped sponsorship CSV under `data/80-days-to-stay/80-days-csv/`.
- `scripts/ats/liveness-core.mjs` and `scripts/score/role-scorer.mjs` (maintained; reused, not
  copied).
- No network for the offline tests. The optional live check needs Playwright Chromium.

## Annotated commands

Expected: a decision table in which every opening ends at a gate or a next step, plus a JSON log.

```bash
node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs \
  --input scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json \
  --out-dir course/2026fa/submissions/aditya-raj-sde/runs/sample
```

The tests: `node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs` (offline; expected: all pass).

Expected: one live observation of one public posting (network). This is a baseline, not part of the
tests.

```bash
npm run ats:liveness -- '<posting URL>'
```

## What it produces

- `reality-check.md`: for you. It holds the decision per opening, the evidence behind it with
  labels, and what is waiting for your judgment.
- `reality-check.json`: for the agent, the same content in full detail.
- For scenario openings only: the maintained scorer's own files, labeled **scenario**, never the
  decision.

## Named failure modes

1. **History read as a promise.** A strong company record is treated as sponsorship for this
   opening. *Mitigation:* company evidence never gates or scores, and an explicit refusal in the
   posting always ends at "skip this application".
2. **"Loads fine" read as "open"** (prediction F2). A page that says "we've filled this role" but
   still shows an Apply link can look active to the checker. *Mitigation:* a closure-wording check
   sends it to you instead.
3. **Missing read as zero** (prediction F3). A blank row, an unmatched name, or two similar
   employers collapse into "no sponsorship". *Mitigation:* five named company states, never merged,
   with no score for missing evidence.
4. **A score overriding a refusal** (prediction F1). The maintained scorer can rate a refused
   opening Consider or Apply when other inputs are high. *Mitigation:* refusals never reach the
   decision path's scorer. The scorer's behavior is characterized separately.
