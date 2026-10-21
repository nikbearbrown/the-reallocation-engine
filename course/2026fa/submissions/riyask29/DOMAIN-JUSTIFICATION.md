# Domain justification — Data-Analyst Sponsor Check

## Executive summary

International students on OPT who want data analyst jobs are told to "target
companies that sponsor." The available lists only say whether a company ever
sponsored *anyone*, and most of those approvals are for engineers. This page
explains who the tool is for, what they cannot see without it, how it plugs into
the engine, and how much of a job-search week it gives back. It also names the
two mistakes it is most likely to make.

## Who, in exactly what situation

An international **MS Information Systems graduate in the Boston area on F-1
post-completion OPT, year 1**, targeting **Data Analyst / Business Intelligence
Analyst** roles (O*NET 15-2051.01; 13-1161 as a fallback). The student needs H-1B
sponsorship and has burned 41 of 90 unemployment days, so the 49 remaining
days, not the April 2027 OPT end date, is the clock that binds first. The persona
is fictional; the situation is the author's own field.

## The information asymmetry

From the outside, this student cannot easily see **whether a "sponsor" has
sponsored their kind of job.** Three things hide it:

1. **"Analyst" is one word for many occupations.** Of 1,557 companies with H-1B
   records in the engine's CSV, 166 list an "analyst" title among their top
   sponsored jobs. Those include *Cyber Analyst I*, *Senior Quality Control
   Analyst* and *Senior Credit Risk Analyst*: different occupations from data
   analysis. A sponsor list cannot tell them apart; a keyword search counts them all.
2. **"Data Analyst" has no SOC code of its own.** BLS files it under 15-2051 (Data
   Scientists), whose Business Intelligence Analyst row shows the same $112,590
   median as Data Scientists. That figure is too high to anchor an entry-level
   analyst's expectations on.
3. **Big local employers are simply absent.** HubSpot and Wayfair are not in the
   CSV at all. A student reading "not found" as "doesn't sponsor" crosses off
   real options.

## Engine layers

- **80 Days to Stay** (sponsorship): title-level classification of
  `top_job_titles_sponsored`, giving a tier for *this role family*.
- **Job-Ops** (liveness): the repo's own `liveness-browser.mjs`, used as a gate.
- **The Cognitive Pivot** (BLS OEWS wage): a report-only wage check, because
  `role_quality` carries weight 0 in the scorer.
- **The scorer** (`role-scorer.mjs`) combines the evidence. It is called, not copied.

## Where it fits the 3-3-2 day

It takes over the **research half of the 2 apply hours**: for each lead,
looking the company up in a sponsor sheet, reading which titles it sponsored,
deciding whether those are analyst jobs, checking the posting is still open, and
doing the OPT date arithmetic.

**Time saved (an estimate, not measured):** done by hand I would expect that
research to take roughly **15–25 minutes per lead**. With the tool, reading
its report row and clearing G4 should take roughly **3–5 minutes**. At about
20 leads a week, that is roughly **4–7 hours a week** back. To measure it
properly I would time ten leads each way. I have not done that.

**It also feeds the networking 3.** A company that sponsored a real data-analyst
title but has no open posting (Benefits Science in the worked run) is routed to
**network**: an informational chat before the next opening, not an application.

## Failure modes specific to this domain

1. **A "Likely" tier read as "sponsors analysts like me."** "Business Analyst"
   is filed as *ambiguous*, which gives a Likely tier, but it can be process
   work (SOC 13-1111). The first version also filed "Quantitative Analyst" there.
   At the G4 review I moved it out, because a Quantitative Analyst at an insurance
   marketplace does statistics or finance work, and that dropped EverQuote from
   Likely to Possible. The same mistake was in my own first rules. *Hardest to
   catch for:* a student skimming the summary table who never opens the G4 title
   list, and especially one who is anxious and wants a yes.
2. **A company-wide salary mistaken for an analyst salary.** The CSV's
   `median_salary_offered` covers *all* a company's sponsored roles. For
   EverQuote it is $117,640, which is 1.53× the Market Research Analyst median.
   That looks like "analysts are paid well here", but it mostly reflects
   engineering hires. *Hardest to catch for:* a student using the number to set
   a salary ask, or to judge whether an offer meets the H-1B prevailing wage.
