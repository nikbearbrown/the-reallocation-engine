# FRICTIONAL — game-dev-h1b-soc-15-1252

Weiting Wang · GitHub `WeitingWang0704` · 2026-10-03

**How to read this file.** *Record* and *Traceability* are the factual log of
what was attempted and what happened; every claim there points at a file or a
command that can be re-run. The four sections after them are the judgment
calls — what I checked, what I still do not know, what I accepted or rejected,
and what I would do differently. Where a correction was made by the assistant
rather than by me, the log says so.

---

## Record — what was attempted, and what happened

### Starting position

I began this assignment not knowing what a GitHub handle was, what a fork was,
or how to clone a repository. That is the honest starting line and it shaped
every decision below, including the decision to lean heavily on an AI assistant
for the construction work while keeping every command run on my own machine.

Setup worked first try: fork → clone → `npm install` → `npm run doctor` returned
`environment: ✓ runnable`, Node v24.15.0, Python 3.14.2, 24 of 24 script targets
present.

### Reading the repository before writing anything

Before any code, the CI configuration was read directly rather than assumed.
Two things came out of `.github/workflows/contrib-gate.yml`:

- `package.json` is on the protected-path list, so the prototype could not
  register an npm script and is documented as a plain `node scripts/contrib/...`
  command instead.
- The `harness-regression` job runs six scripts; four of them
  (`scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`,
  `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`)
  do not exist on `main`.

At the time, the second point was explicitly recorded as an **inference, not an
observation** — the configuration was read, no PR had been run. That distinction
was kept until CI actually ran.

Then the data was measured rather than assumed:
`mapped_student_employment_targets_v3.csv` has 30,369 rows and 24 industry
labels, **none of which is games**, and only 1,557 rows (5.1%) carry an H-1B
approvals value. Those two numbers decided the entire design — they are why the
sector claim is `model-judgment` and why an empty H-1B record is named
`NO_SPONSORSHIP_RECORD` rather than scored as a negative.

### Predictions, written before building

`CHANGE-BRIEF.md` recorded three predictions. Two came true in the first run.

1. *The keyword classifier will over-match on "Interactive".* It did:
   `Peloton Interactive Inc` entered the shortlist with 310 approvals and a
   97.5% approval rate and finished tied for second at `0.279`, level with a
   real AAA studio.
2. *The run will produce too few Skips.* It did: 17%, against the engine's own
   "at least half", and the scorer printed its own complaint.
3. *The Form D join will not be verifiable at the scale the recipe describes.*
   It was not; funding comes from the CSV's own column instead.

The predictions were left as written. Nothing was edited to make them look
better.

### Things that broke, and what changed in response

**Date rounding.** The timeline factor used the current clock rather than UTC
midnight, so the same run on the same day could report 119 days of runway or
120. Normalised to UTC midnight. Not cosmetic: the factor moved `0.587` → `0.600`
and `Manticore Games` moved `Consider` → `Apply`. One assumed day flipped a
decision, which is now the headline example of the timeline gate's fragility in
both the card and the domain justification.

**A fixture that claimed a provenance it did not have.** The liveness fixture's
header read *"recorded by hand with `npm run ats:liveness`"*. Nobody had run it;
the URLs were invented. **The AI assistant found this itself**, while tracing
where each value came from in order to write the worked run — it was not caught
in review. The fix went past the wording: the fixture now carries
`synthetic: true`, the code reads that flag, unchecked rows are labelled
`model-judgment` instead of `record`, and the counts print on stderr, at the top
of `triage-report.md`, and in `liveness_provenance` in `triage.json`. The
reasoning recorded at the time: a caveat that lives only in a comment is a caveat
that gets lost.

**An unverified number inside a section about honesty.** The worked run's "next
improvement" claimed that demoting a tier for title mismatch would move
`Roboto Games` to "roughly 0.167, below the Consider floor". Computed properly it
is `(0.35·0.35 + 0.75·0.30) × 0.6 = 0.209` — still inside the `Consider` band,
and the skip rate does not move at all. The figure had been estimated, not
calculated. Corrected in place, with the error itself written into the document.

**Quoting the PII scanner made my own report fail the PII scan.** Pasting
`pii-scan`'s output into `TEST-REPORT.md`, in order to prove the single finding
was pre-existing, copied the email address into three submission files and took
the scan from 1 finding to 4. Redacted with one inserted character plus a visible
note in each file, rather than by dropping the evidence. The scanner was right
both times.

**The lifecycle status was wrong, and asking a safety question is what found
it.** The recipe claimed `status: RUNNABLE-SAMPLE` with `todos_open: 2`. Late on,
I asked whether marking it `DRAFT` would simply be safer, since every merged
student recipe from the previous term is `DRAFT`. Checking the lifecycle table in
`SNICKERDOODLE.md` to answer that turned up something stronger than a
preference: `DRAFT → SPECIFIED` requires **zero** open `[TODO]` items, and
`RUNNABLE-SAMPLE` sits after `SPECIFIED`. Two adjacent lines of the same
frontmatter contradicted each other, and the document says plainly that "editing
the status field without the evidence is a violation, not a promotion." Changed
to `DRAFT`, with a section in the recipe stating what evidence *is* in hand and
which transition is actually blocking. Closing the two TODOs on paper to keep the
higher status was considered and rejected: both are genuinely open.

**`todos_open` did not match the body.** The frontmatter declared 2; the body
carried 4 `[TODO` markers because the summary section restated them. The
repository's convention is that the two numbers are equal (the 2026su case
recipe declares 14 and carries 14). The summary was reworded to index the TODOs
without re-using the marker.

### Three repository findings, each from running the documented steps

**`npm run ats:scan -- --dry-run` fails on a fresh clone** with
`Error: portals.yml not found. Run onboarding first.` Not in `DOMAIN.md`
§Known gaps.

**`npm run doctor` reports a false green for Playwright.** It prints
`✓ playwright installed` while `npm run ats:liveness` dies with
`browserType.launch: Executable doesn't exist`. `has()` in `scripts/doctor.mjs`
resolves the npm package only; the browser binaries are a separate download and
no setup document in the repository mentions `npx playwright install`. This is
the finding worth reporting upstream, because it is a green tick in the tool
whose job is to say whether the environment is ready.

**`role-scorer.mjs` exports nothing**, although `CONTRIBUTING.md` documents four
exports. The prototype therefore uses the other sanctioned route — run the CLI,
read `role-scores.json` back — and records the discrepancy rather than working
around it silently.

### Gate 2 was a gate that had never run, so it was run

After `npx playwright install chromium`, `npm run ats:liveness` was run against
two real game-studio Greenhouse postings:

```
Results: 0 active  2 expired  0 uncertain
```

Two real ghost postings on the first attempt. Those two observations are the
only values in this submission that a person actually saw, and they are marked
`synthetic: false`. They are deliberately **not** reported as a ghost-posting
rate: both URLs came from a web search index, which lags job boards, so the
sample selects for staleness.

Then both rows blocked at `NOT_IN_RECORD` — neither studio is in the CSV. That
prompted a wider check: of 14 well-known game employers, **one** is genuinely
present (Roblox; the `VALVE` matches are heart-valve and industrial companies,
`TAKE TWO CO` is an unrelated 2021 California company).

### A control, because the obvious objection deserved an answer

The objection raised was: is this domain simply too narrow, or badly served? The
same coverage test was run on two other domains. Life sciences: `PFIZER` ✗
`MERCK` ✗ `GENENTECH` ✗ `ELI LILLY` ✗ `NOVARTIS` ✗ (`MODERNA` ✓ `AMGEN` ✓); the
374 `JOHNSON` matches contain zero companies whose name includes it. Large
technology: `GOOGLE` ✗ `AMAZON` ✗ `META PLATFORMS` ✗ `NVIDIA` ✗ `APPLE` ✗
(`MICROSOFT` ✓); the `APPLE` matches are `APPLE BEACH COUNTY`,
`APPLEPIE CAPITAL` and similar.

The limit belongs to the data source, not to the choice of domain. In response
the recipe was **renamed** from "games-sector sponsorship triage" to
"sponsorship triage for funded private game studios", and the card now states
the scope in its second line. The scale of the slice is stated plainly: 380
keyword candidates, 74 funded since 2023, 11 carrying an H-1B record.

### Verification performed

By hand against the source CSV (`grep` on `MANTICORE GAMES INC`, compared term
by term with the report). Against a source outside the repository (the CSV's
`42718597.0` for Azra Games versus public reporting of a $42.7M raise). By hand
on the thing the engine cannot verify (all five companies checked against public
sources — four right, one wrong; `SECTOR-VERIFICATION.md`). And by trying to
break it (strongest record + perfect fit + dead posting →
`(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000` → `Skip`).

---

## Traceability

| Claim | Where to check it |
|---|---|
| Every command and its real output | `TEST-REPORT.md`, raw capture in `local-run.txt` |
| Predictions as first written | `CHANGE-BRIEF.md` §5 |
| Verified vs inferred, line by line | `WORKED-RUN.md` |
| The hand check of the sector claim | `SECTOR-VERIFICATION.md` |
| The run as logged | `logs/runs/2026fa-WeitingWang0704-1.md` |
| Provenance of every value in a run | `runs/triage.json` — `source`, `verified`, `liveness_provenance`, `assumptions` |
| `package.json` protected | `.github/workflows/contrib-gate.yml`, `contrib-scope` job |
| `doctor`'s Playwright check | `scripts/doctor.mjs` line 36 and the `has()` definition |
| Tests, including the break attempt | `scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs` |

---

## What I checked, changed, or learned in response

When the first run came back with four of six rows as `Consider`, I wanted to
lower the `0.35` prior. The output did not look useful — almost nothing was
being decided, and a smaller number would have pushed rows down into `Skip` and
made the table look like it was doing its job.

I did not do it, and working out why took longer than the change would have. I
had no evidence that `0.25` is a better estimate than `0.35` for a company whose
H-1B columns are empty. The only thing that would have changed is how decisive
the report looks. That is choosing a number for the shape of the output, which
is the same mistake the recipe warns a student against when it tells them not to
read an empty record as a "no".

What I did not understand at the start is that a label is a claim, and the claim
can be false while the number under it is fine. The liveness values were always
going to be invented — the assignment expects sample data. What was wrong was
the word `record` sitting next to them.

It did change how I read anything I did not write myself. I now look first at
what a file says about where its values came from, and only then at the values.
Before this assignment I would have read it the other way round, and the fixture
that claimed a provenance it did not have would have gone straight past me.

---

## Unresolved questions

I do not know where the `0.35` prior should come from. The worked run calls it
the number most worth arguing with and I agree, but I cannot say what would make
`0.3` or `0.45` better. The dataset cannot settle it either: the companies with
no record are precisely the ones there is no data about.

I also do not know whether the tier boundary — ten approvals and an 80% approval
rate to count as `proven` — has any basis. I asserted it, and it decides which
companies get an `Apply`.

And the question I keep returning to: if this returns `NOT_IN_RECORD` for most
of the employers a games student would actually name, is it worth running? **I
am not sure.** The honest case for it is that it is right about the companies it
does cover and refuses to answer about the rest, which is better than a chatbot
that would answer confidently about all of them. The honest case against it is
that a tool whose limitations you have to recall every time before you can trust
it is not much of a tool. I have not resolved this, and it is the part of the
submission I would most want a second opinion on.

---

## Human and AI contributions — what I accepted, modified, or rejected

The factual split is in `SOURCES.md`. This section is the judgments.

**Rejected.** The assistant was about to describe my CSYE 7270 Unity project as
completed evidence of credibility. It is a final project, due at the end of
term, and it does not exist yet. I said so, and it was rewritten as work in
progress with this submission itself as the credibility artefact. Had I not said
anything, the submission would have contained a claim about me that was not
true.

**Modified.** I asked three times where the data actually came from. The second
of those produced the thing I am most glad about: while answering me, the
assistant noticed that it had written a fixture whose header claimed the
liveness values were "recorded by hand with `npm run ats:liveness`" when nothing
had been run. It found that itself — I did not catch it in review — but the
question is what made it look.

I was not suspicious of the fixture specifically — I did not know it existed. I
asked because an AI will sometimes invent a value rather than read it out of the
data it has been given, and I wanted to know which of the numbers in front of me
were which. The question was general; what it turned up was specific.

I also pushed back on the scope, which produced the cross-domain control in
`SECTOR-VERIFICATION.md` and the renaming of the recipe from "games-sector
sponsorship triage" to "sponsorship triage for funded private game studios".

**Accepted.** I accepted the timeline formula `(runway - lag) / lag` and the
`≥10 approvals and ≥80%` tier boundary as written, because they are the two
choices that most change a decision. Before submitting I worked through both:
the timeline numerator is the slack beyond one hiring cycle and the denominator
normalises it into cycles, so the gate closes at one cycle of runway and opens
fully at two; the tier boundary requires volume *and* rate so that a single
successful filing does not read as a programme. The `10` and the `80%` have no
basis in the repository — I can defend the shape of both rules and not those two
numbers.

---

## What I would do differently

I would have run `npm run ats:liveness` on the first day instead of the last.
Gate 2 was the gate I wrote the most words about and the last one I actually
ran, and running it is what renamed the recipe and produced the coverage
finding.

I also treated "16 tests pass" as "the code is right". The tests were written by
the same assistant that wrote the code, so sixteen passing tests prove the two
agree with each other, not that either is correct. That matters here because the
reason I gave for accepting the timeline formula and the tier boundary was that
the tests passed. The things that actually caught errors in this submission were
running the real commands and recomputing one number by hand.
