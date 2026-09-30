# Role-level sponsor match — 2026-09-30 (sample mode)

## Executive summary

**This run is VOID.** The engine's scorer did not keep its side of the contract, so no
decision below can be trusted. What went wrong: the scorer ran as if the persona does not need sponsorship (profile_needs_sponsorship = False), so the sponsorship vote was weighted 0.

This report checks 11 job postings from one job-search queue against the public H-1B sponsorship record. For each company, the question is whether the record includes an ML/AI job title with no seniority or level marker (the closest the record gets to 'entry level'), not merely whether the company has ever sponsored anyone. Read it before spending application or networking time on any of these roles.

*Sample mode: the postings and page snapshots in this queue are illustrative fixtures. The sponsorship evidence is read from the real sponsorship file.*

## What to do next

## Evidence per posting

Labels: **[record]** read from a record · **[your-input]** declared by you (the queue, the title rules, the tier-to-number mapping, fit, timeline, fixtures). No AI model is called anywhere in this run.

| Posting | Sponsorship record | Role-level check | Gates | Scorer |
|---|---|---|---|---|
| Discord → DISCORD INC (row 7770) [record] — Machine Learning Engineer, New Grad | 122 approvals, 0 denials [record]; titles: Senior Software Engineer; Software Engineer; Software Engineer, Machine Learning; Product Manager; Engineering Manager [record] | tier **Proven** [your-input]: 1 sponsored ML/AI title(s) with no seniority or level marker, and 122 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: pass; liveness active [your-input]; timeline 0.85 [your-input] | not scored (held) |
| Etsy → ETSY INC (row 9093) [record] — Machine Learning Engineer I, Search | 222 approvals, 2 denials [record]; titles: Senior Software Engineer I, Machine Learning; Senior Software Engineer II; Senior Product Manager, Search Matching; Engineering Manager, Machine Learning Systems; Software Engineer, Knowledge Base Platform [record] | tier **Likely** [your-input]: every sponsored ML/AI title carries a seniority or level marker; p 0.6 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: pass; liveness active [your-input]; timeline 0.85 [your-input] | not scored (held) |
| Airbnb → AIRBNB INC (row 1013) [record] — Machine Learning Engineer, Early Career | 1000 approvals, 10 denials [record]; titles: Software Engineer; Senior Software Engineer; Data Scientist; Senior Data Scientist; Engineering Manager [record] | tier **Likely** [your-input]: no ML/AI title among the listed sponsored titles; p 0.6 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: pass; liveness active [your-input]; timeline 0.85 [your-input] | not scored (held) |
| Hugging Face → HUGGING FACE INC (row 12614) [record] — Machine Learning Engineer, Open Source | no usable H-1B record in the file | tier Unknown (held) | company-match: pass; sponsorship-record: hold (no-h1b-record) | not scored (held) |
| Instacart — Machine Learning Engineer, New Grad | — | not reached | company-match: hold (no-company-match) | not scored (held) |
| Meta → META CO (row 16612) [record] — AI Research Engineer, University Grad | no usable H-1B record in the file | tier Unknown (held) | company-match: pass; sponsorship-record: hold (no-h1b-record) | not scored (held) |
| Celestial AI → CELESTIAL AI INC (row 5181) [record] — Machine Learning Engineer | 56 approvals, 0 denials [record]; titles: RTL Design Engineer; Machine Learning Engineer; Machine Learning Engineer; Photonics Engineer [record] | tier **Proven** [your-input]: 2 sponsored ML/AI title(s) with no seniority or level marker, and 56 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: closed; liveness expired [your-input]; timeline 0.85 [your-input] | not scored (held) |
| Peloton Interactive — Machine Learning Engineer | — | not reached | company-match: hold (ambiguous-company-match) | not scored (held) |
| AppLovin → APPLOVIN CORP (row 1955) [record] — Machine Learning Engineer, New Grad | 130 approvals, 2 denials [record]; titles: Software Engineer II; Machine Learning Engineer; Technical Support Specialist II; Product Manager, Lion Studios; Senior Designer, Motion Graphics [record] | tier **Proven** [your-input]: 1 sponsored ML/AI title(s) with no seniority or level marker, and 130 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: hold (liveness-uncertain); liveness uncertain [your-input]; timeline 0.85 [your-input] | not scored (held) |
| Databricks → DATABRICKS INC (row 7248) [record] — AI Engineer, New Grad | 1640 approvals, 8 denials [record]; titles: Software Engineer; Senior Software Engineer; Solutions Architect; Specialist Solutions Architect; Senior Solutions Engineer [record] | tier **Likely** [your-input]: no ML/AI title among the listed sponsored titles; p 0.6 [your-input] | company-match: pass; sponsorship-record: pass; timeline: hold (no-timeline-factor) | not scored (held) |
| Kensho → KENSHO TECHNOLOGIES INC (row 14287) [your-input] — Machine Learning Engineer | 40 approvals, 0 denials [your-input]; titles: Machine Learning Engineer [your-input] | tier **Proven** [your-input]: 1 sponsored ML/AI title(s) with no seniority or level marker, and 40 approvals (at least 10); p 0.9 [your-input] | company-match: pass; sponsorship-record: pass; timeline: pass; liveness: pass; liveness active [your-input]; timeline 0.5 [your-input] | not scored (held) |

## What this run could not verify

- When the sponsorship happened. The file has no filing years, so a matching title may be years old.
- Whether a title without a seniority word was an entry-level hire. No marker is not evidence of junior level.
- Titles beyond the file's short 'top titles' list. Many companies list a single title, so a missing ML/AI title is not proof that none was sponsored.
- Whether the company in the file is the employer on the posting. The join behind the file has no published error rate (see the join-validation audit).
- Whether this company will sponsor this role now. Policies, budgets and teams change.
- Anything about fit or timeline. Those numbers are your own ratings, not measurements.
- Legal eligibility (OPT, STEM OPT, cap-gap). That is a question for the school's DSO or an attorney.
- The postings themselves (sample mode). The roles and page snapshots are illustrative fixtures.

## Your decision (the human gate)

The recipe stops here. Before spending any effort, write your decision, your reason, your name and the date for each posting. A blank row means no decision has been made.

| Posting | Suggested | Your decision | Your reason | Name | Date |
|---|---|---|---|---|---|
| Discord — Machine Learning Engineer, New Grad | — |  |  |  |  |
| Etsy — Machine Learning Engineer I, Search | — |  |  |  |  |
| Airbnb — Machine Learning Engineer, Early Career | — |  |  |  |  |
| Hugging Face — Machine Learning Engineer, Open Source | — |  |  |  |  |
| Instacart — Machine Learning Engineer, New Grad | — |  |  |  |  |
| Meta — AI Research Engineer, University Grad | — |  |  |  |  |
| Celestial AI — Machine Learning Engineer | — |  |  |  |  |
| Peloton Interactive — Machine Learning Engineer | — |  |  |  |  |
| AppLovin — Machine Learning Engineer, New Grad | — |  |  |  |  |
| Databricks — AI Engineer, New Grad | — |  |  |  |  |
| Kensho — Machine Learning Engineer | — |  |  |  |  |

## Run record

- Recipe: `recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md` v0.1.0 · run `2026-09-30-sample-66a96129` · generated 2026-09-30T01:34:41+00:00
- Queue: `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/fixtures/sample-roles.json` (sha256 `66a96129e011…`) · persona: `search/examples/priya-nair/profile.yml` (fictional)
- Rules: `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json` v0.2.0 (sha256 `96507d9f5a90…`)
- Sponsorship file: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · sha256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270` (matches the pin)
- Liveness: offline; 6 snapshot(s) classified, 0 live check(s)
- Scorer: `node scripts/score/role-scorer.mjs output/break-authz/roles.json --out-dir output/break-authz --profile scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/fixtures/BROKEN-authorization-profile.json` → exit 0
- Counts: evaluated 11 · held 6 · scored 0 (Apply 0 · Consider 0 · Skip 0) · skip rate n/a of scored, 0% of evaluated. (The book's rule of thumb is that a healthy run skips at least half of what it evaluates. Held postings are neither skipped nor decided until a person resolves them.)
- Agent log: `sponsor-match-log.json` beside this report
