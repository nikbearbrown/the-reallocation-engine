# Role-level sponsor match — 2026-09-30 (live mode)

## Executive summary

This report checks 8 job postings from one job-search queue against the public H-1B sponsorship record. For each company, the question is whether the record includes an ML/AI job title with no seniority or level marker (the closest the record gets to 'entry level'), not merely whether the company has ever sponsored anyone. Read it before spending application or networking time on any of these roles.

**What it found.** 2 of 8 postings come from a company whose record includes an ML/AI title with no seniority or level marker. Suggested use of time: tailor an application for 0, network first at 0, consider 0, skip 0, and resolve 8 before spending any effort, because their evidence could not be checked automatically. Nothing here is a decision. You make each one in the table at the end.

## What to do next

### Resolve before anything else (held for a person) (8)

- **AppLovin — Software Engineer, Machine Learning**: held at the timeline gate (no-timeline-factor). Matched row 1955: APPLOVIN CORP (PALO ALTO, CA). First check that this is the employer on the posting. No timeline factor was given. This recipe does not compute one. State your own factor between 0 and 1, and the reason for it, in the queue.
- **Nextdoor — Machine Learning Engineer - Ads**: held at the timeline gate (no-timeline-factor). Matched row 18131: NEXTDOOR INC (SAN FRANCISCO, CA). First check that this is the employer on the posting. No timeline factor was given. This recipe does not compute one. State your own factor between 0 and 1, and the reason for it, in the queue.
- **Databricks — AI Engineer – Forward Deployed Engineering (AI FDE)**: held at the timeline gate (no-timeline-factor). Matched row 7248: DATABRICKS INC (SAN FRANCISCO, CA). First check that this is the employer on the posting. No timeline factor was given. This recipe does not compute one. State your own factor between 0 and 1, and the reason for it, in the queue.
- **Moloco — Expression of Interest: Machine Learning Engineer**: held at the timeline gate (no-timeline-factor). Matched row 17152: MOLOCO INC (Redwood City, CA). First check that this is the employer on the posting. No timeline factor was given. This recipe does not compute one. State your own factor between 0 and 1, and the reason for it, in the queue.
- **PathAI — Machine Learning Engineer II (Applied Research & Model Development)**: held at the sponsorship-record gate (shared-h1b-record). Matched row 19754: PATHAI INC (CAMBRIDGE, MA). First check that this is the employer on the posting. This company's H-1B record appears, value for value, on another company in the file under a different name. The join behind the file can copy one employer's history onto a lookalike, so this record may not be this company's. Check public H-1B / LCA records for this employer. If the record really is theirs, add `shared_record_checked` with your reason to the queue. Same record on: row 19760 PATHRAI INC (MOUNTAIN VIEW, CA).
- **Scale AI — Software Engineer - New Grad**: held at the company-match gate (no-company-match). The company name on the posting matched no company in the sponsorship file exactly. The file uses legal names (for example '… INC'). Find the legal name, then add the matching row number as `csv_row` in the queue. Otherwise, accept that the file does not cover this company.
- **Anthropic — Applied AI, Research Engineer**: held at the company-match gate (no-company-match). The company name on the posting matched no company in the sponsorship file exactly. The file uses legal names (for example '… INC'). Find the legal name, then add the matching row number as `csv_row` in the queue. Otherwise, accept that the file does not cover this company.
- **OpenAI — Machine Learning Engineer, Core Experimentation**: held at the company-match gate (no-company-match). The company name on the posting matched no company in the sponsorship file exactly. The file uses legal names (for example '… INC'). Find the legal name, then add the matching row number as `csv_row` in the queue. Otherwise, accept that the file does not cover this company.

## Evidence per posting

Labels: **[record]** read from a record · **[your-input]** declared by you (the queue, the title rules, the tier-to-number mapping, fit, timeline, fixtures). No AI model is called anywhere in this run.

| Posting | Sponsorship record | Role-level check | Gates | Scorer |
|---|---|---|---|---|
| AppLovin → APPLOVIN CORP (row 1955) [record] — Software Engineer, Machine Learning | 130 approvals, 2 denials [record]; titles: Software Engineer II; Machine Learning Engineer; Technical Support Specialist II; Product Manager, Lion Studios; Senior Designer, Motion Graphics [record] | tier **Proven** [your-input]: 1 sponsored ML/AI title(s) with no seniority or level marker, and 130 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: hold (no-timeline-factor) | not scored (held) |
| Nextdoor → NEXTDOOR INC (row 18131) [record] — Machine Learning Engineer - Ads | 222 approvals, 8 denials [record]; titles: CUSTOMER ANALYTICS & INSIGHTS MANAGER; Data Scientist; Software Engineer; Software Engineer; Lead, Software Engineering; Machine Learning Engineer [record] | tier **Proven** [your-input]: 1 sponsored ML/AI title(s) with no seniority or level marker, and 222 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: hold (no-timeline-factor) | not scored (held) |
| Databricks → DATABRICKS INC (row 7248) [record] — AI Engineer – Forward Deployed Engineering (AI FDE) | 1640 approvals, 8 denials [record]; titles: Software Engineer; Senior Software Engineer; Solutions Architect; Specialist Solutions Architect; Senior Solutions Engineer [record] | tier **Likely** [your-input]: no ML/AI title among the listed sponsored titles; p 0.6 [your-input] | company-match: pass; sponsorship-record: pass; timeline: hold (no-timeline-factor) | not scored (held) |
| Moloco → MOLOCO INC (row 17152) [record] — Expression of Interest: Machine Learning Engineer | 200 approvals, 2 denials [record]; titles: Staff Data Scientist; Data Analyst II; Sr. Growth Manager; Growth Associate; Machine Learning Engineer II [record] | tier **Likely** [your-input]: every sponsored ML/AI title carries a seniority or level marker; p 0.6 [your-input] | company-match: pass; sponsorship-record: pass; timeline: hold (no-timeline-factor) | not scored (held) |
| PathAI → PATHAI INC (row 19754) [record] — Machine Learning Engineer II (Applied Research & Model Development) | 78 approvals, 2 denials [record]; titles: Software Engineer I; Director of Engineering; Machine Learning Engineer III; Senior Machine Learning Engineer; Machine Learning Engineer II [record] | tier **Unknown** [your-input]: the H-1B record also appears on a differently named company, so it may not be this one's | company-match: pass; sponsorship-record: hold (shared-h1b-record) | not scored (held) |
| Scale AI — Software Engineer - New Grad | — | not reached | company-match: hold (no-company-match) | not scored (held) |
| Anthropic — Applied AI, Research Engineer | — | not reached | company-match: hold (no-company-match) | not scored (held) |
| OpenAI — Machine Learning Engineer, Core Experimentation | — | not reached | company-match: hold (no-company-match) | not scored (held) |

## What this run could not verify

- When the sponsorship happened. The file has no filing years, so a matching title may be years old.
- Whether a title without a seniority word was an entry-level hire. No marker is not evidence of junior level.
- Titles beyond the file's short 'top titles' list. Many companies list a single title, so a missing ML/AI title is not proof that none was sponsored.
- Whether the company in the file is the employer on the posting. The join behind the file has no published error rate (see the join-validation audit).
- Whether this company will sponsor this role now. Policies, budgets and teams change.
- Anything about fit or timeline. Those numbers are your own ratings, not measurements.
- Legal eligibility (OPT, STEM OPT, cap-gap). That is a question for the school's DSO or an attorney.

## Your decision (the human gate)

The recipe stops here. Before spending any effort, write your decision, your reason, your name and the date for each posting. A blank row means no decision has been made.

| Posting | Suggested | Your decision | Your reason | Name | Date |
|---|---|---|---|---|---|
| AppLovin — Software Engineer, Machine Learning | RESOLVE |  |  |  |  |
| Nextdoor — Machine Learning Engineer - Ads | RESOLVE |  |  |  |  |
| Databricks — AI Engineer – Forward Deployed Engineering (AI FDE) | RESOLVE |  |  |  |  |
| Moloco — Expression of Interest: Machine Learning Engineer | RESOLVE |  |  |  |  |
| PathAI — Machine Learning Engineer II (Applied Research & Model Development) | RESOLVE |  |  |  |  |
| Scale AI — Software Engineer - New Grad | RESOLVE |  |  |  |  |
| Anthropic — Applied AI, Research Engineer | RESOLVE |  |  |  |  |
| OpenAI — Machine Learning Engineer, Core Experimentation | RESOLVE |  |  |  |  |

## Run record

- Recipe: `recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md` v0.1.0 · run `2026-09-30-live-76207422` · generated 2026-09-30T02:25:15+00:00
- Queue: `course/2026fa/submissions/sukethrp/worked-run/queue-live-3-reviewed.json` (sha256 `76207422f40e…`) · persona: `search/examples/arjun-rao/profile.yml` (fictional)
- Rules: `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json` v0.2.0 (sha256 `96507d9f5a90…`)
- Sponsorship file: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · sha256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270` (matches the pin)
- Liveness: live; 0 snapshot(s) classified, 0 live check(s)
- Scorer: `not run: no role cleared every gate` → exit None
- Counts: evaluated 8 · held 8 · scored 0 (Apply 0 · Consider 0 · Skip 0) · skip rate n/a of scored, 0% of evaluated. (The book's rule of thumb is that a healthy run skips at least half of what it evaluates. Held postings are neither skipped nor decided until a person resolves them.)
- Agent log: `sponsor-match-log.json` beside this report
