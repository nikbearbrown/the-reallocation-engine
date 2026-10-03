# Domain justification — opt-countdown

## Executive summary

This page explains who opt-countdown is for and why it matters. It's for an F-1 student on
year-1 OPT who has already used part of the 90 allowed unemployment days. The deadline that
actually limits them usually isn't printed anywhere, and employers' hiring speed is hidden. The
tool makes the real deadline visible and tells the student, before they apply, which jobs the
calendar has already ruled out.

## Who, in exactly what situation

An international master's graduate in **post-completion OPT, year 1**, already **34 of 90
unemployment days** in, with a self-set 20-day safety margin, applying to roles at employers that
sponsor. Worked example: the repo's fictional persona Priya Nair (OPT 2026-02-01 → 2027-01-31).
Not for STEM OPT (150-day ceiling) or H-1B transfer cases without changing the inputs.

## The information asymmetry

The student can see one deadline: the **OPT end date** on the EAD card (for Priya, 2027-01-31,
121 days away). The deadline that actually binds is a different one that **no document shows**:
the day the **unemployment allowance runs out**, which depends on the student's own running
count (for Priya, 56 days left → **2026-11-27**, two months earlier). On the employer side, **how
long hiring takes** is invisible from a posting.

The engine has the same blind spot. Its sample roles carry a hand-typed timeline of `0.85` next
to real sponsorship records, and the scorer silently treats a missing timeline as `1`, "no
problem" (`scripts/score/role-scorer.mjs:85`). opt-countdown replaces that guess with a number
computed from the student's dates, labeled `your-input` because one of its inputs (hiring time)
is an assumption.

## Engine layers it connects to

- **The Ch.11 role scorer**: opt-countdown feeds its timeline *gate* (a multiplier, so 0 means
  Skip no matter how good the job is). The scorer is run unchanged.
- **Job-Ops liveness**: the other gate; unclear postings go to a human (G-B).
- It does **not** use the 80 Days, SEC Form D, or BLS layers.

## Where it fits the 3-3-2 day

It takes over the **date-math part of the 2 research-and-apply hours**: for each job, working out
whether today + hiring time lands before the real deadline, and by how much.

**Time saved, an estimate (mine, not measured):** a student looking at about 50 jobs a week,
spending 15–20 minutes per job on timeline checks, spends about 12–17 hours a week on them.
opt-countdown automates only the date math, not researching each company's real hiring time, so
the real saving is smaller. Probably a few hours a week, mostly by dropping ruled-out jobs before
any tailoring starts.

It also **feeds the 3 networking hours**: a strong sponsor zeroed only by the timeline isn't
dropped. It becomes a networking target with a concrete question: *"Could your process finish in
under 54 days?"* (the break-even the tool reports). The project itself is a credibility-hours
artifact.

## Failure modes specific to this domain

1. **Stale day count.** The profile says 34 days used but not *when* it was counted. If it was
   counted three weeks ago, every deadline is three weeks too late, and a job that's actually
   ruled out looks reachable. **Hardest to catch for the student**, because once the number is in
   a file it looks official, and the error only surfaces when the allowance is already gone.
2. **Reading 0 as "bad job."** A timeline of 0 means "the calendar rules this out *at an 8-week
   pace*," not "the company is bad." A stressed student skimming a list of Skips may drop a strong
   sponsor they should have networked into. **Hardest to catch for someone reading only the
   decision column**, because the scorer prints the same "Skip" for a ghost posting and a great
   employer that's merely slow.
