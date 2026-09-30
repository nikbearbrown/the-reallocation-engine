# ml-newgrad-sponsor-match — human card

**Audience:** an international master's student on F-1, graduating December 2026, deciding where new-grad ML/AI applications go.
**Agent twin:** `recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md`
**Chapters:** 7 (who sponsors: "verify role type matches filing history"), 10 (the timeline gate), 11 (the scorer).

## Purpose

Answer, for each posting in your queue: *has this company's public H-1B record included an ML/AI title
with no seniority or level word, or only senior hires?* Then hand the checked roles to the engine's
scorer and say where your time goes: tailor, network first, consider, skip, or resolve a problem first.
It never guesses: anything it cannot check is held, with the reason.

## What it can verify

- The company is in the sponsorship file under this exact normalized name (row number given), and the
  file is the audited one (SHA-256).
- That row's approvals, denials, approval rate and short list of sponsored titles.
- Which of those titles your declared rules call ML/AI, and which carry a seniority or level marker.
  Every rule is listed in the rules audit, so you can check it.
- Whether the posting showed an apply control or an expired page when the engine's liveness classifier
  looked at it.

## What it cannot verify

- **When** a title was sponsored (the file has no years).
- **Whether** an unmarked title was really a junior hire.
- Titles beyond the file's short top-titles list.
- **Whether** the file's company is the posting's employer. The join has no published error rate.
- **Whether** the company will sponsor this role now.
- Your fit or your timeline. Those are your numbers.
- **What the posting itself requires.** The recipe reads titles, not job descriptions. In the worked
  run, six of eight titles with no seniority word asked for 2–12+ years or excluded new graduates. Read
  the posting before you rate fit.
- Visa law. Ask your DSO.

## Dependencies

- Node 20+ with `npm install`, Python 3.9+, no Python packages.
- `npx playwright install chromium` only for `--live`.
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`. The pin and the
  audits are in `data/80-days-to-stay/data/`.
- Rules (yours to edit): `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json`, v0.2.0.

## Annotated commands

Audit the rules first. Expect 27 Proven companies, 21 unmarked ML/AI titles, and 69 companies with a
record shared by a lookalike:

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --audit-rules --out-dir output/sukethrp-ml-newgrad-sponsor-match/rules-audit
```

Sample queue, offline. Expect 11 roles → held 6, scored 5 (Apply 1, Consider 3, Skip 1):

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
```

Your own queue, with live liveness checks on Greenhouse, Lever and Ashby only:

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles <queue.json> --out-dir course/2026fa/submissions/<handle>/runs/<name> --live
```

## What it produces

A report that opens with a plain summary, then:
- **TAILOR / NETWORK-FIRST / CONSIDER / SKIP / RESOLVE** lists, each item with its reason. Every
  NETWORK-FIRST item comes with a question drafted from the record.
- An evidence table with every value labeled `[record]` or `[your-input]`.
- The list of what the run could not verify.
- A blank decision table for you to fill in.

A JSON log carries the same evidence for agents. The scorer's own files come out unchanged.

## Named failure modes

1. **"Sponsors" read as "sponsors new grads".** The shape: a company with hundreds of approvals whose
   listed ML titles are all Senior, Staff or II. Job boards and company-level lists show only "sponsor",
   so the student cannot see the gap from outside. Here, those companies land in NETWORK-FIRST with the
   titles quoted.
2. **A lookalike's record.** The shape: a clean, specific title list that belongs to a similarly named
   company (e.g. PATHAI INC, Cambridge MA / PATHRAI INC, Mountain View CA carry the same record). It is
   the hardest error to catch, because it looks like good evidence. Such roles are held until you check.
3. **Brand vs. legal name.** "Instacart" matches nothing (the file says MAPLEBEAR INC). "Meta" matches an
   unrelated META CO in Portola Valley. A miss shows as "no match", and a wrong match usually shows as
   "no H-1B record" (Unknown). Unknown is not "does not sponsor": the report shows the matched row, so
   you can tell.
4. **Stale sponsorship.** A startup that sponsored ML engineers once may have stopped. The file carries
   no years, so the report says so on every run, and TAILOR tells you to ask the recruiter early.
5. **Rule drift.** A rule edit silently moves companies between tiers. The v0.1.0 rules counted "AI
   DEVELOPER ADVOCATE" as ML, and v0.2.0 moved 11 companies. Every log carries the rules version and
   hash, and the audit shows what changed.
6. **Free-text visa status.** The engine's scorer reads "work authorized (EAD)" as "no sponsorship
   needed" and weights sponsorship 0. This recipe never sends that text. If the scorer ever reports it,
   the run is void.
7. **A posting that lives somewhere else.** Many Greenhouse boards forward a posting to the company's
   own careers site. The recipe will not follow a forward to a host it does not name. It holds the role
   and names where the posting went, and you open that posting yourself.
