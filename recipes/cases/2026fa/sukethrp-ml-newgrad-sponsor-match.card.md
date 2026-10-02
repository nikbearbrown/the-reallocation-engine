# ml-newgrad-sponsor-match — human card

**Audience:** an international master's student on F-1, graduating December 2026, deciding where new-grad ML/AI applications go.
**Agent twin:** `recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md`
**Chapters:** 7 (who sponsors: "verify role type matches filing history"), 10 (the timeline gate), 11 (the scorer).

## Purpose

For each posting in your queue: *has this company's H-1B record included an ML/AI title with no
seniority or level word, or only senior hires?* Checked roles go to the engine's scorer, and the report
says where your time goes: tailor, network first, consider, skip, or resolve. Anything it cannot check
is held, with the reason.

## What it can verify

- The company's row in the audited sponsorship file (SHA-256), by exact normalized name.
- That row's approvals, denials, approval rate and short list of sponsored titles.
- Which titles your declared rules call ML/AI, and which carry a seniority or level marker (see the
  rules audit).
- Whether the engine's liveness classifier saw an apply control or an expired page.

## What it cannot verify

- **When** a title was sponsored (the file has no years), or whether the company still sponsors.
- **Whether** an unmarked title was a junior hire, or what lies beyond the short top-titles list.
- **Whether** the file's company is the posting's employer. The join has no published error rate.
- **What the posting requires.** It reads titles, not descriptions. In the worked run, six of eight
  unmarked titles asked for 2–12+ years or excluded new graduates. Read the posting before rating fit.
- A posting that a job board forwards to the company's own site. It is held, with where it went.
- Your fit and timeline (your numbers), and visa law (ask your DSO).

## Dependencies

- Node 20+ (`npm install`) and Python 3.9+. `npx playwright install chromium` only for `--live`.
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`. The pin and the
  audits are in `data/80-days-to-stay/data/`.
- Rules (yours to edit): `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json`, v0.2.0.

## Annotated commands

Audit the rules first. Expect 27 Proven companies, 21 unmarked ML/AI titles, and 69 companies sharing a
lookalike's record:

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

A report with a plain summary, then:
- the TAILOR, NETWORK-FIRST, CONSIDER, SKIP and RESOLVE lists, each with its reason. NETWORK-FIRST items
  carry a question drafted from the record;
- an evidence table labeling every value `[record]` or `[your-input]`;
- what the run could not verify, and a blank decision table for you.

A JSON log carries the same evidence for agents. The scorer's own files are unchanged.

## Named failure modes

1. **"Sponsors" read as "sponsors new grads".** Hundreds of approvals, but every ML title is Senior,
   Staff or II. Job boards show only "sponsor". Here such companies land in NETWORK-FIRST, titles quoted.
2. **A lookalike's record.** PATHAI INC (Cambridge, MA) and PATHRAI INC (Mountain View, CA) carry the same
   record. It looks like good evidence, so such roles are held until you check.
3. **Brand vs. legal name.** "Instacart" matches nothing (the file says MAPLEBEAR INC), and "Meta" matches
   an unrelated META CO. The report shows the matched row, so you can tell.
4. **Rule drift.** A rule edit moves companies between tiers. Rules v0.2.0 moved 6 companies from Proven
   to Likely. Every log carries the rules version and hash, and the audit shows what changed.
5. **Free-text visa status.** The engine's scorer reads "work authorized (EAD)" as "no sponsorship
   needed". This recipe never sends that text, and a run whose scorer reports it is void.
