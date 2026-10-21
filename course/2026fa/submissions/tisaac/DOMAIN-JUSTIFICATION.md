# Domain Justification — SWE STEM-OPT Runway

## Executive summary

This page explains who the job-search recipe is for, what it lets that person see that they otherwise couldn't, and how much of their week it is meant to save. The person is an international student in Information Systems about to start a three-year work permit, applying for software engineering jobs. The hidden fact the recipe surfaces is whether a company has a record of sponsoring work visas or of recently raising money. The time it saves is small — under an hour a week, by the student's own estimate — because for this student sponsorship is a bonus, not a requirement. The bigger value is that it refuses to guess: a company it cannot find is marked "not found," not "doesn't sponsor."

## Who

An F-1 student in a STEM-designated Information Systems program, before OPT starts, eligible for the 24-month STEM extension (about 3 years of work authorization in total). Targets software engineering, software development, DevOps, and test/QA roles; deliberately excludes Data / ML-specialist roles. Because the runway is long, an employer does not have to sponsor an H-1B in the first year — so sponsorship history is a **bonus vote**, never a reason to drop a role. A fictional persona with this profile is used for every run; no real résumé or tracker is read.

## What information asymmetry it addresses

From a job posting, the student cannot see:

- whether the company has **ever** had H-1B petitions approved, or how many;
- whether the company recently filed a **Form D** (raised money), a weak sign it is hiring.

A chatbot will answer "does this company sponsor?" fluently whether or not any record backs it. This recipe answers only from the repository's local file, labels the answer `record`, and labels everything it did *not* look up — fit, posting liveness, timeline — as the student's own input.

## Engine layers

- **80 Days to Stay** — `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (`Total Approvals`, `total_funding`) → the sponsorship vote.
- **Job-Ops** — `npm run ats:liveness` is the liveness **gate**, run by the person before applying (not yet called by the prototype).
- **Scorer** — `scripts/score/role-scorer.mjs`, reused unchanged.

## Where it fits the 3-3-2 day

- **Takes over:** the per-company sponsorship lookup inside the **2** research-and-apply hours.
- **Time saved (estimate, the student's own, not measured):** about 10 minutes per company × about 5 companies a week ≈ **50 minutes a week**. Low, because this student does not prioritize sponsorship and so looks up few companies. The human gates (opening the posting, reading the JD) are not removed and were not timed.
- **Feeds the networking 3:** a **Consider** result, or a `no-matched` company, points to finding a person at the company before applying.

## Failure modes specific to this domain

1. **Legal name ≠ brand name.** The posting says "Acme"; the file holds "ACME CORP". The company is marked `no-matched` with sponsorship 0 — which, in the score, looks the same as a company that truly never sponsored. The student is the person least able to catch this, because the report still gives a confident Apply or Skip. Mitigation: every `no-matched` name is printed and must be checked by hand.
2. **A self-reported number carries the decision.** In the sample run an invented company reached **Apply** at exactly the threshold (0.30) with sponsorship 0, entirely on the student's own `fit = 1.0`. An optimistic student inflates fit and gets Applies that no record supports. Mitigation: the report shows each term's label; an Apply resting only on `your-input` terms is a lead, not evidence.
