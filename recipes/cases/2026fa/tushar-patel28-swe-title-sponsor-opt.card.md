# Sponsored-title and OPT-timeline check — human card

## Executive summary

**What this is.** The one-page guide for the person who decides what to do with each job opening on their list. A tool reads two public data sets and the person's own definitions. For each opening it tells you whether the company's visa-sponsorship history includes a job title in your field, and whether the start date fits your work-permit window. It then suggests one next step: tailor an application, network into the company, skip, or apply.

**Why read it.** Four decisions are yours, and the tool deliberately stops short of each:
- whether a matched company really is the company you mean;
- whether a posting is still open;
- whether public labor-filing records back an application;
- whether the tool's own definitions are right.

This card says where each decision sits and what to look at.

**What it decides and what it doesn't.** It never says a company "does not sponsor": no match, no data and two possible matches are all reported as unknown, and the suggested step is to talk to the company. Nothing is marked "Apply" unless you have checked the public labor-filing records and the live posting yourself and written down what you found; the sample list has no such entries, so nothing in it is Apply. A labor-filing record shows an employer intended to file, not that a visa was approved. The date arithmetic is for planning and is not immigration advice.

**Audience:** the student (and a reviewer) deciding where to spend application hours.
**Agent twin:** `recipes/cases/2026fa/tushar-patel28-swe-title-sponsor-opt.md`
**Chapters:** 7 (sponsorship tiers; Unknown is not Avoid), 10 (timeline as a gate), 11 (the scorer that combines them).

## Purpose

Answer two questions for each opening, with every value labelled by where it came from:

1. Does a title in my family (Software, then AI, then Cloud) appear in this company's top sponsored titles?
2. Where does the start date fall relative to the persona's EAD start?

Then let *me*, not the tool, decide what earns an application.

## What it can verify

- Whether your company name, normalized the way the repository normalizes names, matches zero, one, or several rows in the sponsorship data, and whether the matched row has any sponsorship trace.
- Whether one of the company's top sponsored titles matches *your* keyword list for the family.
- How many days the role starts before or after your EAD start, and which band that falls in.
- Whether your Apply evidence entry is complete, dated no later than today, and allowed for that role.
- That the project's real scorer used exactly the gates and overrides the tool sent, and that the sponsorship vote kept its weight.

## What it cannot verify

- **Sponsorship for your occupation, from the data.** There is no occupation code, only a short list of top titles per company with no counts per title. Lists hold 1 to 14 titles, and 867 of the 1,557 companies with sponsorship data list just one. The only way an occupation code enters is your evidence entry.
- **Whether your evidence entry is true.** The tool checks its shape, not the filing record.
- **A visa outcome.** A labor-filing record (LCA) shows an intent to file, not an approved visa.
- **How much, or how recently, a company sponsors, from the data.** There are no filing years, and the counts look double-counted.
- **Your immigration position.** Confirm dates and the 90-day allowance with the school's international office.

## Your definitions (closed 2026-10-01; rationale drafted by tushar-patel28, 2026-10-01)

| Definition | Value | Why |
|---|---|---|
| Sponsorship: Likely | 0.6 | A positive record in my family, but no filing year, no SOC, and possibly doubled counts. This is past practice, not current intent, so it stays below Proven. |
| Sponsorship: Possible | 0.4 | The company sponsors, but my family isn't visible in a short top-titles list. Above zero because a sponsorship setup exists; below 0.5 because nothing ties it to my role. |
| Sponsorship: Unknown | no vote | Unknown is not no. |
| (all three) | ordering | These numbers mostly set an order (Likely > Possible > Unknown), not a measured probability. |
| Fit | SWE 0.8 / AI 0.7 / Cloud 0.6 | A ranking, so equal steps are the least-assumption encoding. Below 1.0 because fit is my own statement, not a verified skills match. Floor 0.6 because I'd accept all three. A 0.1 step moves the score by 0.03: it breaks ties and can't outweigh sponsorship evidence. |
| Timeline | >30 days early: 0 · 1–30 days early: 0.5 · 0–60 after: 1.0 · 61–90 after: 0.5 · >90 after: 0 | 1–30 days early: the start date must be negotiated to on or after the EAD start. 0–60: a 30-day buffer for slips. 61–90: legal, no buffer. >90: past the 90-day unemployment allowance (assumption; confirm with the school's international office). 0.5 sits below the scorer's 0.6 "weak" threshold, so both risk bands are flagged. |
| Next action | Likely → tailor · Possible → network · Unknown → network · gated → skip · accepted evidence → apply · two "blocked" outcomes | Possible: a conversation can confirm whether the company sponsors this role family. Unknown: a conversation resolves sponsorship policy and an application can't; unknown is not no. |
| Title keywords per family | precise lists, plus exclusions (see the recipe for every keyword) | Precision over recall: a title counts only when it clearly belongs to the family. Ambiguous titles (Data Engineer, Solutions Architect, a bare "Engineer") count for no family and read as "not in top titles (unknown)". Managers, directors, sales, QA/test and analyst titles are excluded. A match is a title match only; it says nothing about the visa's job category. Known limitation: AI work filed as "Software Engineer" is invisible to the AI check. |

**Still open** (both are proposed additions, not yet built):
- a way to record liveness checks for roles without an Apply entry;
- a company alias table for names that match two rows.

**Why the recipe stays a draft.** The sample run completes and passes every check, but the project's rules don't allow promotion yet:
- a recipe can't advance while any proposed addition is still marked as a to-do, and the course requires proposals to stay marked that way;
- the next stage needs an entry in the main run log, which students are not allowed to edit.

The recipe quotes both rules.

## The Apply gate (G4): what you fill in

Apply happens only through `sample/overrides.json` in the tool's folder. It ships **empty**, because no real check has been done, and evidence typed without one would be an invented record. For each role you want to apply to, after you check it yourself, add one entry:

| Field | What to write |
|---|---|
| `role_id` | the role's id from the candidate list |
| `lca_evidence_source` | where you looked, e.g. "DOL OFLC LCA disclosure data, FY2026 Q3 file" |
| `fiscal_year` | the fiscal year of the LCA you saw (a number) |
| `soc_code` | the SOC code on that LCA, e.g. 15-1252 |
| `posting_says_no_sponsorship` | `true` if the posting rules out sponsorship, else `false` |
| `liveness_checked_on` | the date you ran `npm run ats:liveness -- <posting_url>` |
| `checked_on` | the date you checked the LCA record |
| `reason` | what you saw and why it justifies applying |

The tool **refuses**, with a message naming the role and the reason, any entry that:
- is missing a field;
- says the posting rules out sponsorship;
- targets a role whose start date is outside the window (timeline 0);
- targets a company that matched two rows or none;
- names an unknown or unscored role;
- appears twice;
- carries a future date.

## Annotated commands

```bash
# Run the check on the sample list (fictional persona, real company names, fictional postings).
python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py
#   → prints roles in / scored / not scored, the scorer's counts before and after your Apply entries,
#     accepted/refused entries, and the next-action counts; then the report and log paths.

# Prove the checks catch what they claim to catch (offline).
python3 -m unittest discover -s scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/tests -v

# Check a posting yourself before you record it (network call).
npm run ats:liveness -- <posting_url>
```

## What it produces

- **A report for you.** It contains:
  - a plain-language summary;
  - a decision table showing, per opening, the company match, the family check, start vs EAD, the timeline factor, liveness, your Apply evidence (if any), the votes, the score, the scorer's recommendation before and after your entry, the decision shown to you, and the next step, each labelled;
  - the arithmetic behind every score;
  - your accepted and refused Apply entries;
  - the rows to confirm;
  - median wages per family as context.
- **A log for agents.** It contains every input with a fingerprint per file, every gate result, and the scorer's own output, unchanged.

## Named failure modes

| # | What goes wrong | What you see | What to do |
|---|---|---|---|
| F1 | Company not in the data (e.g. "Google") | `not-found`, Unknown, no vote | Network: ask about sponsorship. Not evidence against it. |
| F2 | In the data, no sponsorship trace | `no-h1b-trace`, Unknown | Same as F1 |
| F3 | Start more than 30 days before the EAD start, or more than 90 days after | timeline 0, gated Skip | Skip, or renegotiate the date and re-run. (1–30 days early is now kept at 0.5, with a "negotiate the start date" note.) |
| F4 | Start date missing or invalid (e.g. "TBD") | error naming the role; not scored | Get a real date; the tool will not guess one |
| F5 | Title list unreadable | `titles-unreadable`; no family claim | Treat as unknown for your family |
| — | Your family is missing from the company's top titles, or only ambiguous titles are listed | "not in top titles (unknown)" | Network: ask whether they sponsor your role family. AI work is often filed as "Software Engineer". |
| F6 | The scorer's "work authorized" bug would zero sponsorship for an F-1 profile | the run stops if it ever happens | Nothing to do; the tool never passes a profile and checks the weight every run |
| — | Two rows match one name (e.g. "Salesforce.com, Inc.") | `ambiguous`; "pick the right company row" | Choose the row |
| — | Namesake (e.g. "Cohere" vs "Cohere Health") | exact match only, so `not-found` | Use the full legal name if you mean the one in the data |
| — | Your Apply entry is refused | the refusal message in the report | Fix the entry, or accept the refusal |

## Next action per result

- **Apply:** only from your accepted evidence entry; the reason you wrote travels with it.
- **Tailor an application:** sponsorship looks likely in your family. Still confirm the company row, and run the liveness check before sending.
- **Network into the company:** sponsorship for your family is only possible (ask whether they sponsor this role family) or unknown (ask about their sponsorship policy; unknown is not no).
- **Skip:** the start date is outside your window.
- **Blocked:** fix the input (a date) or pick the company row, then re-run.
