# DOMAIN-JUSTIFICATION.md

## Executive summary

This document explains who this contribution is for and why that person
needs it. An international ML engineer on a one-year work permit has to
find an employer that will sponsor a longer-term visa, and has a few weeks,
not months, of permitted unemployment left to do it. Two things are hard for
that person to see on their own: which companies have actually sponsored
visas for this kind of work, and whether a company's hiring process can
finish before their clock runs out. The prototype answers the first
question reasonably well and the second only by assumption. In its current
state it also never tells the student to skip a company, which is the
signal a time-pressed student most needs, and the student is the person
least likely to notice that it is missing.

## Who this is for

The user is an international student who has just finished an MS in
Information Systems and has production ML and RAG engineering experience:
LLM routing agents, evaluation pipelines, retrieval systems. They are in
the first year of F-1 OPT, the post-study work permit, and need an employer
to sponsor an H-1B visa to stay longer. They are targeting AI Engineer and
ML Engineer roles, with Data Engineer as a fallback.

The situation is modelled on the repository's fictional persona Priya Nair
(`search/examples/priya-nair/`). No real student's data is used. Her numbers
are what make the problem concrete:

- **OPT window:** 2026-02-01 to 2027-01-31.
- **Unemployment allowance:** 90 days in total, 34 already used as of
  2026-09-30, the fixed date this prototype runs against.
- **Buffer:** she keeps 20 days in reserve rather than running the
  allowance to zero.
- **Usable days:** 90 − 34 − 20 = **36**.
- **Her own notes** (`gaps.md`): large-company interview loops she has
  observed take 6–10 weeks, and she has two processes open, both early.

Thirty-six days is shorter than the 42–70 days those observed loops take.
For this student, a company's hiring pace is not a preference; it decides
whether applying there can work at all.

## The information asymmetry

**Who sponsors this kind of work.** The engine's sponsorship dataset lists
30,369 companies. Only 1,557 of them have any recorded H-1B approvals or
denials, and only 183 of those have sponsored a title matching ML, AI or
data-science keywords. A student searching job boards sees postings, not
sponsorship history. Finding out whether a given company has sponsored
before means finding it in the data, reading its approval and denial counts,
and judging whether those counts mean anything.

That last step is where a raw percentage misleads. A company with 2
approvals out of 2 shows a 100% approval rate, which reads as certainty but
rests on two petitions. The prototype pulls small samples toward the average
of all sponsors. On this data the average is very high (a prior of 0.979),
so a 2-for-2 company moves only from 1.0 to 0.985. The shrinkage is honest
but does little here. The more useful signal is the tier, set from the
approval count itself: 49 of the 183 companies have fewer than 5 approvals
and are marked Likely rather than Proven, and the scorer downgrades any
Apply for a Likely-tier company to Consider.

**Whether the hiring process can finish in time.** Nothing in public data
says how long a particular company takes to hire. The student has to
estimate it, and then do date arithmetic against their own visa clock for
every company they consider. The prototype makes that arithmetic automatic
and visible: usable days divided by an assumed hiring lag, capped at 1. The
lag itself is still an assumption (21 days for early-stage companies, 56 for
Series C and later), labelled as such in every output row.

## Connection to the engine

- **80 Days to Stay** supplies the sponsorship history (approval and denial
  counts, approval rate, sponsored titles) and the funding stage and amount,
  all from one tracked CSV.
- **The Bayesian Role Scorer** (Chapter 11) makes the final Apply / Consider /
  Skip decision. It is used unmodified, through its command-line interface,
  because it exports nothing that could be imported.
- The timeline calculation corresponds to Chapter 10's visa timeline, but is
  computed in this contribution's own build script rather than by an
  existing engine component.

## Where it fits in the 3-3-2 day

The book's 3-3-2 day is 2 hours of targeted applying, 3 hours of networking
and 3 hours of portfolio work. Chapter 2 is explicit that the 2 applying
hours only work if the filtering happens first: "knowing which roles are
real, which companies have any history of sponsoring the visa type you
need." This prototype automates two pieces of that filtering, for every
ML-sponsoring company at once: the sponsorship-history lookup and the
timeline arithmetic.

**ESTIMATE, not measured:** done by hand, checking one company means
finding it in the CSV, reading and judging its approval and denial counts,
and working out whether an assumed hiring lag fits the remaining OPT days.
That is roughly 5–10 minutes per company. Across the 183 companies this
prototype scores, the same estimate gives about 15–30 hours of manual work.
Nobody has timed it, and the figure should not be quoted as a finding.

What it does not automate: whether a posting is open (liveness is not
checked without live-network approval), whether the role is a real ML job
(fit only sees a company's top recorded titles), and anything in the 3
networking or 3 portfolio hours.

## Domain-specific failure modes

Both come from the prototype's first real runs, recorded in the change
brief's first-run finding and in the card.

**1. It never says "don't bother."** On the real data the scorer skips 0 of
183 companies: 87 Apply, 96 Consider. The engine's own standard is that a
healthy run skips at least half. The causes are structural. The liveness
gate never runs without approval, so every company is treated as hiring.
And the pre-filter only admits companies that have already sponsored ML
titles, nearly all with approval rates close to 100%, so sponsorship cannot
separate them.

*Who would struggle most to catch it:* a first-time OPT student under
deadline pressure. They are exactly the person least likely to notice that
"Consider" on every single company means the tool isn't discriminating. To
someone with 36 days left, a long list of Apply and Consider looks like
opportunity, not like a filter that has stopped working. They are also the
person who can least afford to spend applications on companies that a
working filter would have ruled out.

**2. A funding-stage guess drives the ranking.** The assumed hiring lag
(21 days for early-stage companies, 56 for Series C and later) decides more
of the ordering than any recorded evidence. Early-stage companies average a
score of 0.428 and late-stage ones 0.277. Microsoft, one of the largest
sponsors in the data, ranks 176th of 183.

*Who would struggle most to catch it:* the same student, reading the ranking
as evidence. A student who doesn't already know how hiring timelines vary
across companies has no way to see that the order comes from one
assumption, unless they read the `your-input` label on every timeline term.
A student who follows the ranking would put large, reliable sponsors last
because of a guess the tool made, not anything the data showed.
