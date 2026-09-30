# Domain justification — role-level sponsor match

## Executive summary

A new-grad ML/AI engineer on an F-1 visa can easily find out *whether* a company has sponsored work
visas. They cannot easily find out whether it has sponsored *anyone like them*. This recipe answers the
second question from the engine's own records, and flags every place where the answer cannot be trusted.

**Who.** An international master's student on F-1, graduating December 2026, targeting new-grad ML/AI
engineering roles (machine-learning, AI, applied-ML, NLP, computer-vision or LLM engineer). After
graduation, post-completion OPT allows 90 days of unemployment; a STEM OPT extension is possible only if
the school's DSO confirms it. The student will need an employer willing to file an H-1B.

**The information asymmetry.** H-1B lookup sites, job boards and the engine's own company tier all
answer "does this company sponsor?". The student's real question is "has it sponsored an ML/AI engineer
at my level?".

In the engine's sponsorship file, only 1,557 of 30,369 companies carry any H-1B record, and the record
lists the job titles sponsored. Under the recipe's rules, only **27 companies** have an ML/AI title with
no seniority or level marker and at least ten approvals. Another 47 sponsor ML/AI titles that are all
marked (Senior, Staff, II…). Moloco is an example: 200 approvals, 99% approved, and its only ML title is
"Machine Learning Engineer II".

From outside, that company looks identical to AppLovin, whose record includes a plain "Machine Learning
Engineer". The record makes the difference visible. So does the difference between "no record" and
"record copied from a lookalike company".

**Engine layers.**
- **80 Days to Stay** (the sponsorship file and its audits): the evidence.
- **Job-Ops** (the liveness classifier and checker): the posting gate.
- **The Chapter 11 scorer**, used through its CLI: combines the evidence into a decision.

Role quality (BLS/O\*NET) is not used, because the scorer weights it at zero.

**Where it fits the 3-3-2 day.** It takes over part of the **2** hours of research and applying: the
per-company sponsorship check and the per-posting liveness check.

The saving is an *estimate, not a measurement* (Claude's assumption; the student should time three
companies by hand to replace it):
- **By hand:** about 10–15 minutes per company to look up its H-1B history and judge the titles and
  levels, plus about 2 minutes to confirm the posting is live. For 20 postings a week, that is
  **roughly 4–6 hours a week**.
- **With the recipe:** the run takes seconds, plus about 5 minutes per held role. At the worked run's
  hold rate that is about 1 hour, so it saves **roughly 3–5 hours a week**.

It also feeds the other hours:
- **Networking 3:** every NETWORK-FIRST result comes with a question built from the record (for example,
  "your record lists only Machine Learning Engineer II; has the team sponsored a new grad?"). That turns
  soft evidence into an informational conversation instead of a blind application.
- **Credibility 3:** the recipe and prototype are themselves a judgment-showing project.

**Failure modes specific to this domain.**
1. **Senior-only sponsorship read as "they sponsor new grads".** The error looks like a large, clean
   sponsor with high approval rates and only Senior, Staff or II titles in its record. The student is
   the one least able to catch it, because every surface they see (job boards, lookup sites, company
   tiers) reports sponsorship at company level. The recipe routes these companies to NETWORK-FIRST and
   quotes the titles.
2. **The wrong entity's record.** The engine's join attached identical H-1B records to differently named
   companies (69 of them; for example PATHAI INC, Cambridge MA, and PATHRAI INC, Mountain View CA). The
   only rows named after two frontier-AI employers are investment funds ("ANTHROPIC - A SERIES OF AURUM VP
   FUND LLC", "OPEN AI A SERIES OF VUVP FUND LLC"). Such an error is hardest to catch for an AI agent
   doing fuzzy matching, and for a student doing a keyword search, because the wrong record looks
   specific and plausible. The recipe matches names exactly and holds any record shared with a
   lookalike.
