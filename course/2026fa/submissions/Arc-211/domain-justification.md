# Domain justification — finance data-engineering triage for a STEM-OPT graduate

> Drafted with an AI assistant on 2026-10-01 from this session's work. Reviewed and approved
> by the student (Arc-211) on 2026-10-02.

## Executive summary

This recipe is for one person in one situation. They are an international master's student
whose degree code is on the STEM list. Their program ends in December 2026 and they have not
yet filed for work authorization. They want a data-engineering or business-intelligence job
paying at least $90,000, preferably in finance. They can't easily see three things from the
outside: which finance employers actually sponsor data roles, whether a posting is really open,
and whether the employer can support the two extra years of STEM work time. The recipe turns
those three questions into checked evidence, so the student's two daily hours of research and
applying go to a short list worth tailoring for.

## Who, exactly

An F-1 master's student. The I-20 lists CIP 14.0903 (Computer Software Engineering), which is in
the STEM-eligible 14.09 family. The program ends 2026-12-20, so the OPT filing window runs from
about 2026-09-21 to 2027-02-18. Their background is SQL, ETL, Databricks,
Snowflake, Azure, and Tableau or Power BI. Target occupations: SOC 15-1243.01 Data Warehousing
Specialists, 15-1243.00 Database Architects, 15-2051.01 BI Analysts, and 15-1242.00 Database
Administrators. Anywhere in the US or remote; finance preferred; a floor of $90,000. A generic
"international student in tech" would not need the E-Verify gate, the finance filter, or the
data-role title rule. This person needs all three.

## The information asymmetry

1. **Which finance employers sponsor *data* roles.** H-1B history is public but scattered, and
   sponsorship is reported by company, not by role. In the repository's own file, only 34 of
   2,425 finance-labeled companies have any H-1B data, and only 12 show a data or BI-type title.
   Without the recipe, the student guesses from brand names. Large brands can be absent from the
   data entirely: JPMorgan Chase is.
2. **Whether the posting is real.** Ghost and closed postings look live. Even the repository's
   checker called a live Workday posting "expired". The student needs a check plus their own eyes.
3. **Whether the employer can keep them past year one.** The STEM extension requires an E-Verify
   employer. Sponsorship history says nothing about that. A chatbot asked about it in this
   project answered "Verified Enrolled" for four companies, based on visa history, which is not
   evidence.

## Engine layers used

- **80 Days to Stay:** sponsorship counts, sponsored titles, median offered wage, and latest
  funding. Form D samples as a cross-check.
- **The Cognitive Pivot:** the BLS national median for each target SOC, used as context. It is
  not scored, because the role-quality weight is 0.
- **Job-Ops:** `ats:liveness`, used as the evidence for the liveness gate.
- **The existing scorer:** run unmodified, so the composite score is the engine's own.

## Where it fits in the 3-3-2 day

It takes over the **research half of the 2 apply hours**: shortlisting sponsors, the first
sponsorship check per company, and the timeline arithmetic. It leaves the student a 5-minute
liveness check and a 10-minute E-Verify check per finalist.

**Estimated time saved (an estimate, not a measurement):** about **5–7 hours a week**. The
assumptions are 30 candidate companies a week. By hand, each takes roughly 25 minutes: finding
H-1B records, judging whether the titles fit, checking the posting, and finding the E-Verify
status. With the recipe, the 30,369-row shortlist costs nothing and each finalist takes about
15 minutes. The real number depends on how many companies reach the manual gates; on the sample
run, 4 of 13 did.

It also **feeds the networking 3 hours**. `network-into-company` (strong sponsor, dead posting) and
`review-role-fit` (strong sponsor, off-target posting, such as SoFi's Fraud Model Analyst) are
both "talk to someone first" results. And it feeds the **credibility 3 hours**: the prototype and
its honest limits are a portfolio project in exactly the field the student is applying to.

## Domain-specific failure modes, and who would miss them

1. **Checker false negative on a live posting.** A Workday page renders slowly; the checker
   reports "expired"; a Proven sponsor with an on-target, open job gets routed to networking
   instead of applying. *Hardest to catch for* a student in the last weeks of their unemployment
   window, who has every reason to trust a tool that saves time. This happened here (Green Dot)
   and was caught only by opening the page.
2. **Missing data read as "doesn't sponsor".** A blank row (28,812 of 30,369) or an absent company
   (JPMorgan) looks like a non-sponsor. The student quietly drops one of the largest finance
   employers. *Hardest to catch for* a new arrival who doesn't yet know which banks sponsor, which
   is exactly the person relying on the data.
3. **Entity mismatch on E-Verify.** "Green Dot" also matches a school network; SoFi has four
   enrolled entities; one Remitly account is terminated. A student could record the wrong entity
   as their employer's enrollment. *Hardest to catch for* anyone who reads the first search hit.
   Only the offer letter's employer name and the I-983 settle it.
