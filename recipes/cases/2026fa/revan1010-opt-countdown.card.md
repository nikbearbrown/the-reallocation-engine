# opt-countdown — human card

**Audience:** a student on year-1 OPT (and whoever helps them) deciding which jobs are still worth
applying to before the unemployment clock runs out.
**Agent twin:** `recipes/cases/2026fa/revan1010-opt-countdown.md`
**Chapter:** 10 (the clock is a gate, not a tiebreaker), feeding the Ch.11 scorer.

## Purpose

Answer: *if I apply to this job today, will it start before I run out of allowed unemployment days
or OPT?* If not, the job is skipped however good it looks, and the time goes to jobs (or people)
that can still work.

## What it can verify

- Your profile has the four dates/numbers it needs, and they make sense together (OPT not already
  over; days used not above the limit).
- The timeline number follows from those inputs by a written formula. The report prints the dates
  so you can redo it on a calendar.
- The engine's scorer actually used that number (it shows up in the scorer's own audit trail).

## What it cannot verify

- **How long a real company takes to hire.** It uses one assumption (8 weeks) for every job.
- **Whether your "days used" count is up to date.** Your profile doesn't say when it was counted.
- **Anything legal.** Whether your last allowed day still counts, STEM extension eligibility, H-1B
  lottery timing, or cap-gap. **Ask your DSO.** This is not legal advice.
- Whether the sample jobs are real or still open (they are the book's illustrative examples).

## Dependencies

- Persona profile: `search/examples/priya-nair/profile.yml` (fictional; used unchanged)
- Sample jobs: `data/examples/ch11-roles.json`
- Engine scorer: `scripts/score/role-scorer.mjs` (run as-is)
- Optional manual check: `npm run ats:liveness -- <url>` (needs `npx playwright install chromium`)

## Annotated commands

Before: score the sample jobs with their hand-typed timeline (expected: 2 Apply, 1 Consider, 2 Skip):

```bash
npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/revan1010/runs/baseline
```

After: the same jobs with Priya's computed timeline (expected on the 2026-10-02 sample: 1 Apply
by human override, 0 Consider, 4 Skip):

```bash
node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs --profile search/examples/priya-nair/profile.yml --roles data/examples/ch11-roles.json --as-of 2026-10-02 --lag-days 56 --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown --confirmed-by "<name>"
```

## What it produces

- A **report for you**: your inputs echoed back, the date table, each job's before/after decision,
  the jobs waiting for your check, and the longest hiring time that would still work.
- A **log for the agent**: the same facts as labeled JSON.
- The scorer's own output, unchanged.

## Where you must decide (gates)

| When | What you check |
|---|---|
| Before it runs | Your printed dates match your EAD card / I-20 / your own day count |
| A job link is unclear | Open it; is the job real and open? |
| A good job got timeline 0 | Recheck the dates; then decide: drop it, or ask someone there if they can move faster |
| Anything about visa rules | Your DSO, not this tool |

## Named failure modes

1. **Stale day count.** The profile says 34 days used, but it was counted weeks ago. Every
   deadline is then too late and a doomed job looks reachable. Hardest to catch for the student
   themselves, because the number looks official once it's in a file.
2. **One-size hiring time.** 8 weeks for every job hides that a startup might take 4 and a big
   company 16. The tool can't rank jobs by speed; it only tells you whether 8 weeks fits.
3. **Reading 0 as "bad job".** A 0 means "the calendar rules it out," not "the job is bad." The
   right move for a strong job at 0 is often networking, not dropping the company.
