# Domain justification — Sponsor & Posting Reality Check

## Executive summary

This one-page note explains why the procedure exists, who it is for, and where it fits in a job
seeker's day. The user is an engineering candidate who will need visa sponsorship and is targeting
openings that start in January 2027, backend and platform roles first. That candidate cannot easily
see two things from outside a company:

- whether a posting is still really open;
- whether *this* opening, as opposed to the company in general, can sponsor.

The procedure makes both visible with labeled evidence and stops before tailoring time is spent.
Its time saving is a hypothetical estimate of about 40 minutes a week, under the student's stated assumptions; it has not been measured.

## Who uses it, in what situation

An engineering candidate who will need **future employer sponsorship**, screening openings that
start in **January 2027**, with backend and platform roles prioritized, at experienced-hire or
new-grad level, anywhere in the US. Public runs use the fictional persona Aarav Patel; no real
person's details are used.

## The information asymmetry

From outside, the candidate sees a job page and, at best, a company's aggregate sponsorship history.
They cannot easily see:

1. **Whether this opening sponsors.** A company with 1,640 recorded approvals can still post a role
   that says "without the need for visa sponsorship". The aggregate counts cover an unstated period
   and every kind of role.
2. **Whether the posting is real and open.** A page can load normally (HTTP 200) yet say the role
   is filled, and a page that says "we've filled this role" can still show an Apply link that a
   checker reads as live.

A fluent answer to "does this company sponsor?" hides both gaps. This procedure keeps company
history and vacancy wording apart, labels every value as a record, a rule-based judgment, or a stated
assumption, and says "unknown" when the evidence is missing.

## Engine layers it connects to

- **Sponsorship:** the 80 Days to Stay CSV, kept as historical context and never a score.
- **Job-Ops liveness:** the repository's maintained classifier, used as a gate.
- **The maintained role scorer:** used only on clearly labeled hypothetical scenarios.
- **Visa timeline:** a gate, fed only explicit sample assumptions and never reported as verified.

## Where it fits in the 3-3-2 day

It takes over the first step of the **two research-and-apply hours**: deciding which openings
deserve tailoring at all.

- A closed posting or an explicit refusal is skipped before any tailoring.
- A silent posting turns into one specific question (ask the recruiter, or find the sponsorship
  wording) instead of a speculative application.

It does not touch the networking or credibility hours. In v1 it deliberately suggests no outreach.

**Time saved per week: about 40 minutes. This is a hypothetical estimate by Aditya, not a measurement.**

- **His assumptions:** he screens 20 openings a week; tailoring one application takes 20 minutes;
  20% of openings turn out closed or explicitly refusing (an assumed share, not taken from the
  sample); reviewing this tool's output costs 2 minutes per opening.
- **Arithmetic:** 20 × 0.20 × 20 = 80 minutes of tailoring avoided, minus 20 × 2 = 40 minutes of
  review, gives **40 minutes per week**.
- **What it leaves out:** openings that end at "seek evidence" still need his own research, so they
  are counted as saving nothing.
- **Break-even (Claude's arithmetic):** if fewer than 10% of openings (2 ÷ 20) were closed or
  refusing, reviewing the output would cost more time than it saves.
- The designed sample's outcome fractions are **not** used for this estimate.

**What it changes (Aditya's view):** it is an initial screening step that separates openings to skip
from openings that still need research before tailoring. It is not a complete recommendation
system, and its value is that it makes the evidence gaps visible.

## Domain-specific failure modes

1. **History read as a promise.** A well-known sponsor's counts make a refused or silent opening look
   safe.
   - *Hardest to catch for:* a candidate under deadline pressure, because the company's reputation
     confirms what they hope.
   - *Guard:* refusals stop at the refusal gate, and counts never gate or score.
2. **Ambiguous work-authorization wording.** "Must be authorized to work in the United States" can
   be read as a refusal (wrongly skipping a viable role) or as an offer (wasting a tailored
   application).
   - *Hardest to catch for:* reviewers who don't know that sponsored candidates become authorized.
   - *Guard:* this wording is classified as ambiguous and routed to a person.
3. **Name-variant employers.** An `INC` and an `LLC` with the same name can carry different records;
   the CSV has 198 such collisions.
   - *Hardest to catch for:* anyone matching names by eye.
   - *Guard:* both rows are listed, never merged, until a person pins the right one.
