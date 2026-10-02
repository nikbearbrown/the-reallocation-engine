# Domain justification — role-level sponsor match

## Executive summary

A new-grad ML/AI engineer on an F-1 visa can easily find out *whether* a company has sponsored work
visas. They cannot easily find out whether it has sponsored *anyone like them*. This recipe answers the
second question from the engine's own records, and flags every place where the answer cannot be trusted.

*Drafted by Claude Code. The student chose the situation and the recipe direction (see `SOURCES.md`).*

**Who.** An international master's student on F-1, graduating December 2026, targeting new-grad ML/AI
engineering roles. Post-completion OPT allows 90 days of unemployment, and the student needs an employer
willing to file an H-1B.

**The information asymmetry.** Job boards, H-1B lookup sites and the engine's own company tier answer
"does this company sponsor?". The student's question is "has it sponsored an ML/AI engineer at my level?".
- Only 1,557 of the file's 30,369 companies carry any H-1B record, and the record lists sponsored titles.
- Only **27** have an ML/AI title with no seniority or level marker and at least ten approvals.
- Another 47 sponsor only marked ML/AI titles.

From outside, Moloco (200 approvals; its only ML title is "Machine Learning Engineer II") looks identical
to AppLovin, whose record includes a plain "Machine Learning Engineer". The record shows the difference.
The posting does not: AppLovin's actual opening asked for four years of experience.

**Engine layers.**
- **80 Days to Stay** (the sponsorship file and its audits) supplies the evidence.
- **Job-Ops** (the liveness classifier and checker) gates the posting.
- **The Chapter 11 scorer**, called through its CLI, combines them.

Role quality (BLS/O\*NET) is unused, because the scorer weights it at zero.

**Where it fits the 3-3-2 day.** It takes over part of the **2** research-and-apply hours: the per-company
sponsorship check and the per-posting liveness check.

*An estimate by Claude Code, not timed:*
- **By hand:** 10–15 minutes per company for its H-1B history and titles, plus 2 minutes to confirm the
  posting is live. For 20 postings a week that is **about 4–6 hours**.
- **With the recipe:** the run takes seconds. A person still does the one named check for each held role,
  perhaps 5–15 minutes each. At the 55–75% hold rate of the sample and runs 1–2, that is about 1–4 hours.
  The saving is **roughly 2–3 hours a week** mid-range: almost nothing at one end of the range, about 5
  hours at the other.
- **In an all-held run** like run 3, the saving shrinks; the value is naming what is left to check.

It also feeds the other hours:
- **Networking 3:** each NETWORK-FIRST result carries a question built from the record ("your record lists
  only Machine Learning Engineer II; has the team sponsored a new grad?").
- **Credibility 3:** the project itself shows judgment.

**Failure modes specific to this domain.**
1. **Senior-only sponsorship read as "they sponsor new grads".** It looks like a large, clean sponsor with
   a high approval rate and only Senior, Staff or II titles. The student is least able to catch it:
   every surface they see reports sponsorship at company level. The recipe sends these companies
   to NETWORK-FIRST and quotes the titles.
2. **The wrong entity's record.** The engine's join attached identical H-1B records to 69 differently
   named companies, for example PATHAI INC (Cambridge, MA) and PATHRAI INC (Mountain View, CA). The only
   rows named after two frontier-AI employers are investment funds. An AI agent doing fuzzy matching, or a
   student doing a keyword search, is least able to catch this: the wrong record looks plausible. The
   recipe matches names exactly and holds any record shared with a lookalike.
