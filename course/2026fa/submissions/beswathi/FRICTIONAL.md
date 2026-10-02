# FRICTIONAL — where this resisted

## Executive summary

**What this is.** The record of what went wrong building `dataeng-sponsor-coverage`,
kept because the failures are more informative than the finished recipe.

**The pattern.** Every serious defect had the same shape: **the tool produced a
confident output while the evidence underneath it was missing.** A 0% skip rate, a
`0 data problems` line, a 0.5 credit for zero slack, a test file whose newest test
did not run. None of these looked like errors. They all looked like success.

**The lesson I actually take.** A result that matches what I hoped for is the one to
check first. Three of the five defects below were found only because the number
looked *good*.

---

## 1. The 0% skip rate that looked like a win

**What happened.** The first end-to-end run produced `Apply 258 · Skip 0`. I read
that as the pipeline working.

**What was wrong.** I had pre-filtered to record-positive companies and then emitted
`liveness: 1.0` for all of them with a warning comment to myself. The scorer's
liveness gate therefore never closed. The scorer was not evaluating anything — it was
rubber-stamping a list I had already decided on, and returning it to me as if it had
judged it.

**How it surfaced.** The course material says a healthy run skips at least half. A
100% apply rate is not a strong result; it is a disconnected gate. The number that
should have alarmed me was the one I liked.

**The fix.** An absent liveness ledger entry now means **unscored**, not **assumed
live**. Companies without evidence go to `pending_g3` and never reach the scorer.
This cut the scored list from 258 to 8 and produced a 75% skip rate. The honest list
is 3% the size of the dishonest one.

**What it cost.** The output got much less impressive. 126 companies now sit in a
bucket that says "nothing is known about whether these postings exist." That is the
true state, and it took deliberately making the deliverable look weaker to get there.

## 2. A gate that printed a warning and exited 0

**What happened.** The G4 timeline hard stop printed
`GATE timeline=0.0 — every role scores zero` and then returned exit code 0.

**Why that is worse than it sounds.** The documented workflow is
`python3 sponsor_coverage.py … && npm run score …`. With exit 0, the `&&` proceeds.
The gate would print its warning into the scrollback and the scorer would run anyway
on a fully-zeroed role set, producing a report that looks normal. The gate was
decoration.

**The fix.** `return 2`, plus a regression test that asserts the exit code rather
than the message. Verified: `--today 2027-03-01` → exit 2; missing ledger → exit 1.

**The general version.** A gate is only a gate if something downstream is actually
prevented. Printing is not preventing.

## 3. Half credit for zero margin

**What happened.** The timeline factor was `0.5 + slack / (2 * 90)`. At zero slack
— a role that cannot possibly produce an offer before the unemployment clock expires
— this returns **0.5**, half credit.

**How it surfaced.** An offline test with a deliberately impossible date. I had
written the formula to be smooth and never checked its value at the boundary that
matters.

**The fix.** `min(1.0, slack / 90)`, with `slack <= 0` → `0.0`. No floor. A role
outside the window scores zero, which is what "outside the window" means.

## 4. `0 data problems`, and 21 data problems

**What happened.** The run reported `data problems: 0` across all 30,369 rows. I
treated that as the input being clean.

**What was actually there.** `Data Engineer 20516.3745` (Amgen), `Manager, Data
Science (20639.33)` (Glassdoor), `Software Engineer (11525.2801.9)` (Palantir) — 21
cells across three companies. My parser accepted them silently because the target
pattern still matched the leading words.

**Two mistakes, not one.**

First: I only noticed because the title appeared in a console listing I was reading
for a different reason. Nothing in the design would have surfaced it. A clean
`0 problems` line over a 30,369-row file should have read as *suspicious*, not as
reassuring — real files are not that clean.

Second, and worse: my first fix called these a "salary spill" in the code comment
and named the problem `corrupt-title-cell`. That was a guess, and it was wrong. The
leading group is constant per company (`20516` Amgen, `20639` Glassdoor, `11525`
Palantir) and the tail increments per posting — it is a **requisition id**. I had
written a confident explanation of a number I had not actually examined, inside the
tool whose entire purpose is refusing to do that.

**The fix.** The id is stripped and the row is kept — `Data Engineer 20516.3745` is
a real Data Engineer posting, and rejecting it would lose a genuine sponsor over
formatting. Every strip is reported so the edit is visible rather than silent.
Numerals that belong to a title (`Data Engineer II`, `Analyst 3`, `Engineer 2.0
Platform`) are left alone, and that is tested in both directions.

## 5. The test that did not run

**What happened.** I added `test_geography_is_reported_not_enforced`, ran the suite,
and got `49 passed, 0 failed` — the same count as before. The new test had not run.

**Why.** The `__main__` block called each test function by name from a hand-written
list. A test not added to that list is silently skipped. Under `pytest` it would have
been collected; under the file's own runner, which is what the recipe documents, it
was invisible.

**The fix.** The runner now discovers tests by name from the module namespace and
prints `N checks in M tests`, so a missing test shows up as a changed test count.

**Why this one bothers me most.** A test suite that quietly does not run its newest
test is worse than no suite, because it produces a green result that I would have
cited as evidence. I had already written "the offline test reports 27 passed" into
the recipe as a verification check — a number that was stale by then anyway.

## 6. Fixtures that went stale behind a filter — twice

**First time.** After adding the seniority filter, `FIXTURE PROVEN SPONSOR INC` held
"Senior Data Engineer" and was filtered out, breaking the end-to-end fixture test.

**Second time, and the one that mattered.** The real liveness ledger's only two
`active` captures belonged to `1LIFE HEALTHCARE INC` ("Senior Data Engineer") and
`23ANDME INC` ("Lead BI Engineer") — both removed by that same filter. So every
company that reached the scorer had an expired or uncertain posting, and the run
returned `Apply 0 · Consider 0 · Skip 5 (100%)`.

**What is instructive.** A 100% skip rate is *also* a healthy-looking number by the
course's own heuristic. It passed every automated check I had. It was only visibly
wrong because I read the scorer report and asked why nothing was recommended.

**The fix.** The captures now cover the first eight companies in the pipeline's own
reachable order — a stated selection rule, not a hand-picked set, written down
specifically so the choice can be challenged. This restored `Apply 2 · Skip 6 (75%)`.

**The honest caveat.** I changed demo data to make the demo work. That is legitimate
only because the rule is mechanical and published; if I had picked the two companies
I wanted to see in the output, the 75% would be a fiction. The rule is in the recipe
so a reader can check that I followed it.

## 7. The regex that matched "Liaison"

The target title pattern had an unanchored `a\.?i\.?` alternative, so "ai" matched
inside *Supply Chain*, *Affairs* and *Liaison*. The counts I had already written
into the card — "98 companies without ML Engineer, 143 with it" — were built on
those false matches and were simply wrong. After `\b` anchoring and req-id
stripping the real numbers are **194 and 235**.

This is in here because the wrong numbers had already been written into a document
as a finding. The fix to the code did not fix the document; I had to go back and
correct the claim, and the corrected card says so rather than quietly swapping the
figures.

## 8. The PII scan I failed by documenting it

Writing up the run, I recorded the pii-scan result honestly: one pre-existing
finding, an npm maintainer email in `package-lock.json` — and I quoted the address.
The next scan returned **two** findings. My write-up of the finding was itself a
finding.

It is a small thing and it was harmless here, because the address is a public npm
author field rather than anyone's private contact. But it is a clean illustration of
the rule this repository takes seriously: data does not become safe because the
context around it is responsible. The run log now describes the finding without
reproducing it.

## 9. The 18 MB file I nearly put in someone else's repo

The audit dump serialised all 26,337 networking targets: an **18 MB JSON**, committed,
on its way into a pull request against the instructor's repository. The repo's own
audit notes a target of keeping a clone under 30 MB; one run of my recipe would have
been more than half of that.

I caught it while listing the zip contents, not by thinking about it. The networking
list is ranked by base rate, so the tail is the part nobody reads — it is now capped
at the top 250 with a `network_targets_truncated` block recording shown and total, so
the truncation announces itself rather than quietly handing someone a partial list.
249 KB instead of 18 MB.

The general point: "write everything out so it can be audited" is a good instinct that
stops being good at a size nobody will open.

## 10. Things I did not fix

- **G3 is not cleared for anything.** Every liveness verdict comes from a saved
  capture. Clearing it for real needs `npm run ats:liveness` against live postings.
  The two `Apply` rows are a property of a fixture ledger, not evidence that two
  jobs are open today, and the attestation says so.
- **The 75-day hiring lag is invented.** It drives the G4 gate. Nothing measured it.
  It is labelled `your-input` so a reader sees the assumption, but labelling an
  invented number does not make it a better number.
- **The networking list contains entities that do not hire data engineers** —
  investment vehicles and holding companies that file Form D (`CARLYLE TACTICAL
  PRIVATE CREDIT FUND`, `ARES ACQUISITION CORP II`). Ranking by funding recency
  pushes dormant ones down but does not identify them.
- **`role_quality` is 0.0 in the scorer** and `[VERIFY]` in the chapter, so the SOC
  wage and ability data is printed for the human and never fed in. Feeding it would
  change no verdict, and pretending otherwise would be theatre.

## 11. What I would tell someone starting this

Check the results you like. Every defect above produced a number that looked
healthy: 258 applies, 0 data problems, 49 tests passing, 100% skip rate, a smooth
timeline curve. Not one announced itself as a failure. The run that finally looked
*unimpressive* — 8 scored roles out of 30,369 companies, 126 explicitly unknown —
is the only one I can defend line by line.
