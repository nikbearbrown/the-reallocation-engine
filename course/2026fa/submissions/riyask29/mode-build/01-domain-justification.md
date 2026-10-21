# Domain justification: the Data-Analyst Sponsor Check

## Executive summary

**What this is.** The one-page case for a Reallocation Engine mode built for one situation: an
international data-analyst job-seeker in Boston on OPT who needs H-1B sponsorship. **Why read it.**
It says what that person cannot see without the mode, which engine layers the mode uses, and the
two mistakes most likely to mislead them. **What it found.** "Does this company sponsor?" is the
wrong question for an analyst. The right one is "has it filed for *analyst work*, recently, here?",
and the public record of that is the Department of Labor's H-1B filings by occupation code. The
real run found a "Proven" sponsor with no analyst filings this year, and a company missing from
the sponsor list that did file one.

## Who uses it, and when

A Master's graduate in the Boston area on **F-1 post-completion OPT, year 1**, targeting **Data
Analyst / Business Intelligence Analyst** roles, who has used 41 of the 90 allowed unemployment
days. So 49 days, not the April 2027 OPT end date, is the clock that binds first. They use the mode
in the hour before tailoring applications. It takes a list of leads and returns, per lead: tailor,
network first, skip, or "a person must check this". (The persona is fictional. The situation is
the author's own field.)

## The information asymmetry

1. **"Data Analyst" has no occupation code of its own.** It is filed under Business Intelligence
   Analysts (15-2051.01) or Market Research Analysts (13-1161), next to Data Scientists, Statisticians
   and Management Analysts. A sponsor list says a company sponsored *someone*. It does not say for which job.
2. **Titles mislead.** In the engine's sponsor CSV, 166 companies list an "analyst" title, including
   *Cyber Analyst I* and *Senior Credit Risk Analyst*: other occupations that share the word.
3. **The record exists, but it is hard to use.** DOL publishes every H-1B Labor Condition Application
   with its occupation code: 437,496 filings in the FY2026 Q3 file alone, in a 252 MB workbook the site
   will not serve to a script. Cut to certified analyst-family filings at Massachusetts worksites, it is
   1,842 filings from 855 employers.

## Engine layers it uses

- **80 Days to Stay:** sponsorship history (tier from titles), plus full SEC Form D quarters for funding.
  The mode adds DOL LCA records by occupation code as a new source.
- **Job-Ops:** posting liveness, a gate. This run fixed the checker so it can read ATS forms that career
  sites embed.
- **The Cognitive Pivot:** the BLS OEWS wage for the target occupation codes, reported beside the score, not in it.

## Failure modes specific to this domain

1. **"Proven" read as "sponsors analysts now".** Benefits Science is *Proven* in the sponsor CSV (it
   sponsored a "Data Analyst" title), but it has **no certified analyst-family LCA in Massachusetts in
   FY2026**. The tier rests on past approvals. *Hardest to catch for* an anxious student with weeks left,
   who wants a yes and stops reading at the tier column.
2. **A name that matches the wrong company, or misses the right one.** Searching Form D for "Abacus"
   returns 12 filings, all unrelated investment funds (one raised $94M), none of them Abacus Insights.
   The other way round, Fidelity files LCAs under at least four legal names, so a single-name lookup
   undercounts it, and HubSpot is absent from the sponsor CSV but present in the LCA file. *Hardest to
   catch for* anyone who does not know that filings use legal entity names. That is most students, and
   especially those new to US company structures. So the mode matches exact names only, shows near
   matches, and never turns "not found" into "does not sponsor".
