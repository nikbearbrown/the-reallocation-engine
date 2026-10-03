# Domain justification — swe-title-sponsor-opt

## Executive summary

This tool helps an international student spend scarce application hours on employers whose public record shows they have sponsored work visas for jobs in the student's field, and whose start dates fit the student's work-permit window. It exists because the public record is thin in exactly the places this student needs it. It never treats missing data as "no", and it leaves four decisions to a person: the right company, a live posting, the labor-filing evidence, and the definitions themselves.

## Who uses it

An international MS software-engineering student, F-1, whose OPT starts in January after a December graduation. The student is targeting full-time roles that sponsor H-1B, in priority order: Software Engineer/Developer, AI Engineer, Cloud/Infrastructure.

Generic advice ("check if they sponsor, apply early") fails this student in two ways:
- **They apply before the unemployment clock starts.** So the timeline question is whether a start date lands inside the window that opens at the EAD start, not how many days have already been used.
- **The three role families mostly collapse into one visa job category in practice.** *(Judgment, unverified here: the repo has no LCA filings, and O\*NET itself lists "AI Engineer" under 15-1221 and "Cloud Engineer" under 15-1299.08.)* If employers file all three as software developers, a family-level check can't tell them apart (prediction P1).

## The information asymmetry

- **No visa job category.** The sponsorship data has no SOC field. So "does this company sponsor my kind of role?" can't be answered from the records; the repo's entity-resolution audit says the merged data has no SOC codes.
- **Titles don't reveal filings.** A company's top sponsored titles are a short list (867 of 1,557 sponsoring companies list just one), with no counts per title and no filing year. An AI role filed as "Software Engineer" is invisible to the AI check.
- **Big employers are largely absent.** The dataset is built from startup funding filings. "Google" returns not-found because no row starts with "GOOGLE"; "ALPHABET INC" exists, with no sponsorship trace. Absence here is a coverage gap, not evidence.

## Engine layers

- **80 Days to Stay** drives the decisions: the company match and the top sponsored titles.
- **The Cognitive Pivot** supplies only wage context (the BLS median per family). The scorer's role-quality weight is 0, so wages never move a decision.
- **Job-Ops** appears only at the G3 human gate, as the liveness check a person runs before acting.

## Where it fits the 3-3-2 day

Chapter 2 splits the day into two hours of targeted applying, three of networking and three of portfolio.
- **It replaces the first pass of sponsorship and timeline research** inside the two applying hours. That is the filtering Chapter 2 says "is where most of the signal lives".
- **Time saved — an estimate, not measured.** Manual research takes roughly 10–15 minutes per company; for 15–20 companies a week, that's about 2.5–5 hours a week. The tool triages in seconds, but each shortlisted role still needs about 5 minutes of human checks for G1, G3 and G4.
- **Its "network into the company" output feeds the three networking hours.**
- **Building the project counts toward the three portfolio (credibility) hours.**

## Domain-specific failure modes, and who would struggle to catch them

1. **AI roles filed as "Software Engineer" appear as an unknown AI family.** A student targeting AI roles may read "not in top titles" as "doesn't sponsor".
2. **Big-company absence.** "Google" comes back not-found. A newcomer who doesn't know the dataset comes from startup funding filings would read that as "Google doesn't sponsor".
3. **The 90-days-from-EAD arithmetic is an assumption.** A student who trusts the timeline factor without confirming with their international office could misjudge the window.
