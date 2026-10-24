# Domain justification — Experienced Java Backend Opening Triage (Early-2027 Start)

## Executive summary

This one-page note explains who the screening procedure is for, what that person cannot easily
see, and which mistakes it is built to catch. The user is an international master's student who
already has years of full-time Java backend experience and will start in early 2027. Real
postings state their bar in ways that are easy to misread at exactly this experience level: total
career versus years in a specific skill, co-op months, and month-level dates. Their sponsorship
stance and timing were not detected in any captured posting body. Of 12 real postings, the
procedure skipped 2 for stated minimums above everything the test candidate has worked, and sent
10 to a person with the quoted reason.

## Who uses it, and when

- **Who:** an international master's student (on F-1 status) graduating around the turn of 2027.
  They have years of full-time Java/Spring backend experience (distributed systems, messaging,
  cloud infrastructure; applied-AI infrastructure as an optional second strength) plus a
  separately recorded co-op.
- **Status:** post-completion work authorization is applied for, not approved. They can start on
  a stated early-2027 date and will need H-1B sponsorship later.
- **Search:** US-wide.
- **When:** choosing which openings deserve a tailored application.
- **Public runs** use the fictional persona Tariq Lindqvist: full-time 50–54 months at month
  precision, a 4–6-month co-op, availability 2027-02-01.

## The information asymmetry

1. **Where the candidate sits against the stated bar.**
   - Postings mix total-career minimums ("six (6) years of software development experience")
     with skill-specific ones ("5 years of experience programming in Java, Scala, or Python").
     Some put requirements in headings ("Must have three (3) years of experience in each of the
     following").
   - At about 4.5 years, the difference between "5+" and "meets" is the co-op. None of the 18
     captured postings explicitly accepted or excluded co-ops; 7 used wording the rules treat as
     ambiguous (for example "equivalent experience").
   - A résumé shows total years, not years per skill, so a reader easily treats one as the other.
2. **Whether this opening, not the company, could work.**
   - All three employers have more than 1,250 recorded sponsorship approvals.
   - The rules detected no sponsorship or start-date wording in any of the 18 captured posting
     bodies (application forms not inspected).
   - The Databricks postings carry an export-control clause ("Employer may decline to proceed
     with an applicant on this basis alone") that matters for a foreign national. It was easy to
     miss: the frozen rules missed it until the unseen-posting check exposed it.
3. **Whether the posting is really listed.** For 6 Pinterest postings, the employer's own feed
   listed the job while the page returned a bot challenge to the checker, which reported
   "expired".

## Engine layers

- **Job-Ops:** board capture (greenhouse-watch) and page liveness (`ats:liveness`), combined as a
  conservative gate.
- **80 Days to Stay:** the sponsorship CSV orders the sample and is shown as context only.
- **Visa timeline:** a start-window gate on the candidate's supplied date. It is explicitly not an
  authorization check.

## Domain-specific failure modes

1. **Career length read as skill-specific experience.** "4.5 years of Java backend work" feels
   like "meets 4+ years of distributed systems".
   - *Hardest to catch for:* this candidate, whose stack match is real and whose résumé lists only
     total years.
   - *Guard:* total career never meets a scoped requirement. It is unknown unless the candidate
     supplies that duration, and a mismatch only if above everything they have worked.
2. **The co-op decides the outcome silently.** Counting it turns 50–54 into 54–60 months. Ignoring
   it skips a "5+" posting the employer might accept.
   - *Hardest to catch for:* a reviewer reading a résumé that mixes co-op and full-time entries.
   - *Guard:* the co-op counts only with explicit wording; silence at the boundary goes to a
     person, with the full-time-only figure shown.
