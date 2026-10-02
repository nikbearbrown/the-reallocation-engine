# Worked run — the recipe on eight real ML/AI postings

## Executive summary

**Latest review, 2026-09-30 UTC (Codex AI):** The third run holds **all eight postings** and scores none. Four stop for an unknown timeline, one for a shared sponsorship record, and three for no company match. Employer requirements also expose experience mismatches hidden by the earlier titles. See [Posting review](POSTING-REVIEW.md) and [run 3](runs/worked-run-3-reviewed/sponsor-match-report.md). The earlier TAILOR / NETWORK-FIRST results below are historical, not current recommendations.

**Historical runs 1–2 follow.** They read `worked-run/queue-live-1.json`, which is unchanged
(sha256 `38a030669592…`). Codex's reviewed inputs are a separate file,
`worked-run/queue-live-3-reviewed.json` (sha256 `76207422f40e…`), read by run 3.

**What this is.** A real run of the recipe on eight real job postings, found on 30 September 2026, for a
fictional student in the recipe's exact situation: F-1, graduating in December 2026, looking for a
new-grad ML/AI engineering job.

**Why read it.** It shows what the recipe decided, which inputs were records and which were declared,
how the output was checked, and what went wrong.

**What it found.** Of the eight postings:
- **One earned an application.** AppLovin's sponsorship record includes a "Machine Learning Engineer",
  and the posting is live.
- **One earned a networking question first.** Moloco's only sponsored ML title is "Machine Learning
  Engineer II", although the company has 200 approvals.
- **Six need a person before any effort:**
  - two postings (Nextdoor, Databricks) forward to the companies' own websites;
  - one company's record (PathAI) sits, value for value, on a lookalike company;
  - three of the AI employers new graduates target most (Scale AI, Anthropic, OpenAI) are not in the
    engine's data at all. The only rows carrying their names are investment funds.

The run was repeated after a report fix and gave the same decisions. The fit and timeline numbers were
proposed by Claude from the job titles and still need the student's review.

---

## Inputs

| Input | Value | Label |
|---|---|---|
| Persona | `search/examples/arjun-rao/profile.yml`: fictional; F-1 master's student, graduating December 2026, OPT not started; ML/AI target. The prototype reads only `needs_sponsorship: true` | your-input (fictional) |
| Queue | `worked-run/queue-live-1.json`: eight real postings from the engine's own scanner (step 1), chosen across the recipe's tiers using the rules audit. Company, title and URL as posted. Greenhouse URLs are in the board's canonical form for the job id the scanner reported | your-input |
| Fit, timeline | fit 0.4–0.7, timeline 0.85 (0.9 for the new-grad posting). **Proposed by Claude Code from the job title only, not checked against the posting text, and pending the student's review.** Every reason in the queue says so | your-input |
| Rules | `rules.json` v0.2.0 | your-input |
| Sponsorship file | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, SHA-256 `eccdee2a…6270` (pinned, matches its audit) | record |

## Commands and their real output

### 1. Discovery (the engine's scanner, not part of the prototype)

```
$ REALLOCATION_ENGINE_PORTALS=course/2026fa/submissions/sukethrp/worked-run/portals-worked-run.yml npm run ats:scan -- --dry-run
Scanning 22 companies via providers (0 local parser; 0 skipped — no provider matched)
(dry run — no files will be written)
Portal Scan — 2026-09-30
Companies scanned:     22
Total jobs found:      3359
Filtered by title:     3268 removed
Filtered by location:  56 removed
Duplicates:            1 skipped
New offers added:      34
Errors (8):
  ✗ Kensho: HTTP 404: {"status":404,"error":"Job not found"}
  ✗ Socure: HTTP 404: {"status":404,"error":"Job not found"}
  ✗ Lendbuzz: HTTP 404: {"status":404,"error":"Job not found"}
  ✗ Whoop: HTTP 404: {"status":404,"error":"Job not found"}
  ✗ Modular: HTTP 404: Not Found
  ✗ Gorgias: HTTP 404: {"ok":false,"error":"Document not found"}
  ✗ Cohere Health: HTTP 404: {"ok":false,"error":"Document not found"}
  ✗ Weights & Biases: HTTP 404: {"ok":false,"error":"Document not found"}
New offers:
  + Nextdoor | Machine Learning Engineer - Ads | US Remote
  + AppLovin | Software Engineer, Machine Learning | Palo Alto, CA
  + Databricks | AI Engineer – Forward Deployed Engineering (AI FDE) | United States
  …
  + Moloco | Expression of Interest: Machine Learning Engineer | Menlo Park, California, United States; …
  + OpenAI | Machine Learning Engineer, Core Experimentation | Seattle
  + PathAI | Machine Learning Engineer II (Applied Research & Model Development) | Boston (Onsite), New York (Onsite) Preferred, or Remote
  …
```

The scanner reached 14 of 22 boards; the other eight board names were guesses that do not exist. Across
3,359 postings it found 34 non-senior US ML/AI roles. The full output, with all 34, is in
`worked-run/terminal-discovery.txt`. The URLs came from one non-dry scan into the gitignored `data/ats/`.

### 2. Worked run 1 (live)

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles course/2026fa/submissions/sukethrp/worked-run/queue-live-1.json --out-dir course/2026fa/submissions/sukethrp/runs/worked-run-1-live --live
# run by Claude Code on the student's machine, started 2026-09-30T01:26:43Z
✓ 8 roles → held 6 · scored 2 (Apply 1 · Consider 1 · Skip 0) · actions NETWORK-FIRST 1, RESOLVE 6, TAILOR 1
  course/2026fa/submissions/sukethrp/runs/worked-run-1-live/sponsor-match-report.md  +  course/2026fa/submissions/sukethrp/runs/worked-run-1-live/sponsor-match-log.json
# exit=0
```

First hops, with redirects off (from `sponsor-match-log.json` → `liveness_run.first_hops`):

```
https://job-boards.greenhouse.io/applovin/jobs/4712559006    200
https://job-boards.greenhouse.io/nextdoor/jobs/6005888       302 → https://about.nextdoor.com/careers-list/?gh_jid=6005888
https://job-boards.greenhouse.io/databricks/jobs/8546367002  302 → https://databricks.com/company/careers/open-positions/job?gh_jid=8546367002
https://job-boards.greenhouse.io/moloco/jobs/7655058003      200
```

The engine's liveness checker, run by the prototype on the two postings that stayed on Greenhouse
(`liveness_run.stdout`):

```
$ node scripts/ats/check-liveness.mjs https://job-boards.greenhouse.io/applovin/jobs/4712559006 https://job-boards.greenhouse.io/moloco/jobs/7655058003
Checking 2 URL(s)...

✅ active     https://job-boards.greenhouse.io/applovin/jobs/4712559006
✅ active     https://job-boards.greenhouse.io/moloco/jobs/7655058003

Results: 2 active  0 expired  0 uncertain
```

The scorer's own output (`runs/worked-run-1-live/role-scores.md`):

```
| APPLOVIN CORP — Software Engineer, Machine Learning | 0.446 | **Apply** | composite 0.446 ≥ 0.3, gates healthy | sponsorship 0.9·0.35 [your-input]; fit 0.7·0.3 [your-input] × liveness 1[record]×timeline 0.85[your-input] |
| MOLOCO INC — Expression of Interest: Machine Learning Engineer | 0.332 | **Consider** | above threshold (0.332) but one soft spot: sponsorship tier "Likely" | sponsorship 0.6·0.35 [your-input]; fit 0.6·0.3 [your-input] × liveness 1[record]×timeline 0.85[your-input] |
```

### 3. Worked run 2 (live, after fixing how the report describes a shared record)

Reading run 1's report exposed a defect: PathAI was described as having "no usable H-1B record", but it
has one (78 approvals). It is held because the same record sits on PATHRAI INC. Commit `fe07d1b` fixed
the report. Run 2 uses the same queue:

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles course/2026fa/submissions/sukethrp/worked-run/queue-live-1.json --out-dir course/2026fa/submissions/sukethrp/runs/worked-run-2-live --live
# run by Claude Code on the student's machine at commit fe07d1b, started 2026-09-30T01:33:16Z
✓ 8 roles → held 6 · scored 2 (Apply 1 · Consider 1 · Skip 0) · actions NETWORK-FIRST 1, RESOLVE 6, TAILOR 1
  course/2026fa/submissions/sukethrp/runs/worked-run-2-live/sponsor-match-report.md  +  course/2026fa/submissions/sukethrp/runs/worked-run-2-live/sponsor-match-log.json
# exit=0
```

The first hops were identical (200, 302, 302, 200), and both live checks again returned `active`. The
PathAI row, before and after:

```
run 1: | PathAI → PATHAI INC (row 19754) [record] — Machine Learning Engineer II (…) | no usable H-1B record in the file | tier Unknown (held) | …
run 2: | PathAI → PATHAI INC (row 19754) [record] — Machine Learning Engineer II (…) | 78 approvals, 2 denials [record]; titles: Software Engineer I; Director of Engineering; Machine Learning Engineer III; Senior Machine Learning Engineer; Machine Learning Engineer II [record] | tier **Unknown** [your-input]: the H-1B record also appears on a differently named company, so it may not be this one's | …
```

The report's "what to do next" section (run 2, verbatim):

```
### Tailor an application (1)
- AppLovin — Software Engineer, Machine Learning: the record shows this company sponsoring an ML/AI title with no seniority or level marker, and every gate is open. Spend research-and-apply time here, and confirm sponsorship with the recruiter early.

### Network first, then decide (1)
- Moloco — Expression of Interest: Machine Learning Engineer: sponsorship evidence is soft: every sponsored ML/AI title carries a seniority or level marker. Before applying, ask someone inside the company. A question to start from: Your company's public H-1B record lists these ML/AI titles: 'Machine Learning Engineer II'. All of them carry a seniority or level marker. Has the team sponsored a new-grad ML/AI engineer, or only experienced hires?

### Resolve before anything else (held for a person) (6)
- Nextdoor — held at the liveness gate (redirects-off-allowed-host) …
- Databricks — held at the liveness gate (redirects-off-allowed-host) …
- PathAI — held at the sponsorship-record gate (shared-h1b-record) … Same record on: row 19760 PATHRAI INC (MOUNTAIN VIEW, CA).
- Scale AI / Anthropic / OpenAI — held at the company-match gate (no-company-match) …
```

## Verified vs. inferred, line by line

No AI model was called during the runs, so nothing is labeled model-judgment. "Record" means read from
the sponsorship file or seen by the live checker. "Your-input" means declared by a person, or computed
from something they declared.

| Posting | record | your-input | Result |
|---|---|---|---|
| **AppLovin**, SWE, Machine Learning | row 1955 APPLOVIN CORP; 130 approvals, 2 denials; sponsored titles incl. "Machine Learning Engineer"; first hop 200; live check `active` (2026-09-30T01:26:58Z) | tier Proven (rule: an unmarked ML/AI title and ≥ 10 approvals); p 0.9; fit 0.7; timeline 0.85; composite 0.446 | **TAILOR** |
| **Moloco**, Expression of Interest: MLE | row 17152 MOLOCO INC; 200 approvals, 2 denials; only ML/AI title "Machine Learning Engineer II"; live check `active` | tier Likely (every ML/AI title marked); p 0.6; fit 0.6; timeline 0.85; composite 0.332 | **NETWORK-FIRST** |
| **Nextdoor**, MLE - Ads | row 18131 NEXTDOOR INC; 222 approvals; titles incl. "Machine Learning Engineer"; first hop 302 to about.nextdoor.com | tier Proven; fit 0.7 and timeline 0.85 (not used: held) | **RESOLVE** (redirect) |
| **Databricks**, AI Engineer (FDE) | row 7248 DATABRICKS INC; 1,640 approvals; titles: Software Engineer, Senior Software Engineer, Solutions Architect, Specialist Solutions Architect, Senior Solutions Engineer; first hop 302 to databricks.com | tier Likely (no ML/AI title in the list) | **RESOLVE** (redirect) |
| **PathAI**, MLE II | row 19754 PATHAI INC; 78 approvals; the identical record on row 19760 PATHRAI INC | tier Unknown (record shared with a lookalike) | **RESOLVE** (shared record) |
| **Scale AI**, SWE New Grad · **Anthropic**, Applied AI Research Engineer · **OpenAI**, MLE Core Experimentation | no row with these normalized names. Keyword search (`worked-run/resolve-check-legal-names.txt`): "ANTHROPIC - A SERIES OF AURUM VP FUND LLC" and "OPEN AI A SERIES OF VUVP FUND LLC" are investment funds; "scale ai" matches only MINDSCALE AI and GREYSCALEAI | — | **RESOLVE** (not in the file) |

## Verification: how the output was checked

1. **Against the source file.** Claude read rows 1955, 17152, 19754 and 19760 straight from the CSV,
   non-personal columns only. The approvals, denials and title lists match the report exactly. Rows
   19754 (PATHAI INC, Cambridge MA) and 19760 (PATHRAI INC, Mountain View CA) are identical in all five
   H-1B fields.
   ```
   row 1955: company_name=APPLOVIN CORP | city=PALO ALTO | state=CA | Total Approvals=130.0 | Total Denials=2.0 | Approval_Rate=98.48484848484848 | top_job_titles_sponsored=['Software Engineer II', 'Machine Learning Engineer', 'Technical Support Specialist II', 'Product Manager, Lion Studios', 'Senior Designer, Motion Graphics']
   row 17152: company_name=MOLOCO INC | city=Redwood City | state=CA | Total Approvals=200.0 | Total Denials=2.0 | Approval_Rate=99.009900990099 | top_job_titles_sponsored=['Staff Data Scientist', 'Data Analyst II', 'Sr. Growth Manager', 'Growth Associate', 'Machine Learning Engineer II']
   row 19754: company_name=PATHAI INC | city=CAMBRIDGE | state=MA | Total Approvals=78.0 | Total Denials=2.0 | Approval_Rate=97.5 | top_job_titles_sponsored=['Software Engineer I', 'Director of Engineering ', 'Machine Learning Engineer III', 'Senior Machine Learning Engineer ', 'Machine Learning Engineer II']
   row 19760: company_name=PATHRAI INC | city=MOUNTAIN VIEW | state=CA | Total Approvals=78.0 | Total Denials=2.0 | Approval_Rate=97.5 | top_job_titles_sponsored=['Software Engineer I', 'Director of Engineering ', 'Machine Learning Engineer III', 'Senior Machine Learning Engineer ', 'Machine Learning Engineer II']
   ```
   *The student should repeat one of these by opening the CSV at the row number, for the presentation.*
2. **Reproducibility.** Run 2, six minutes after run 1, gave the same first hops, the same live verdicts
   and the same decisions.
3. **Tests.** 36 of 36 pass on a clean checkout, offline (`TEST-REPORT.md`).
4. **Deliberate breaks.** Four were tried: a free-text "work authorized" profile makes the run void; a
   wrong source hash stops the run; a persona path under `private/` stops the run; writing into
   `data/examples/` stops the run. Each is in `TEST-REPORT.md`, with its output.
5. **Sensitivity, from the scorer's arithmetic.** AppLovin's composite is (0.9·0.35 + 0.7·0.3) × t.
   - At t = 0.85 it is TAILOR.
   - For t in [0.381, 0.6) it becomes CONSIDER, because the scorer treats a timeline under 0.6 as a soft
     spot.
   - Below t = 0.381 it becomes SKIP (composite < 0.20).

   Moloco's composite is (0.6·0.35 + f·0.3) × 0.85. It stays in NETWORK-FIRST for fit f ≥ 0.085 and
   becomes SKIP below that. The timeline factor, not fit, is the input the student most needs to
   confirm.

## Your decision (the human gate, G8)

**Student decisions recorded 2026-10-02**, from the student's own statement in chat: “Keep all eight postings held because the available evidence does not support defensible fit and timeline numbers; investigate Scale AI first because its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed.” The last two columns apply it row by row. The current prototype result is RESOLVE for all eight roles. The advisory table below is a **Codex draft**, dated 2026-09-30 UTC, for student review. “Deprioritize” is advice based on requirements, not a machine Skip classification and not a cleared human gate. The student must enter their own final decision and reason and sign each row.

| Posting | Current machine result | AI advisory draft | AI reason | Student decision and reason | Student name and date |
|---|---|---|---|---|---|
| AppLovin — Software Engineer, Machine Learning | RESOLVE | Deprioritize this experienced role; seek a graduate opening. | Requires at least four years developing and deploying production ML systems. Python and PyTorch align with the target, but the fictional profile documents no such experience. No employment start date is specified. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| Nextdoor — Machine Learning Engineer - Ads | RESOLVE | Deprioritize unless the required industry or academic experience can be documented. | Requires at least five years of industry or academic experience applying ML at scale, plus advertising ML and production coding. The profile does not establish this experience. No employment start date is specified. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| Databricks — AI Engineer – Forward Deployed Engineering (AI FDE) | RESOLVE | Deprioritize this posting because it explicitly excludes the target applicant level. | The posting explicitly excludes internship, new-graduate and entry-level applicants. It requires production GenAI deployment experience. No employment start date is specified. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| Moloco — Expression of Interest: Machine Learning Engineer | RESOLVE | Deprioritize this pool for the immediate graduate search; locate a specific early-career opening. | This is an expression-of-interest pool rather than a dated vacancy. It seeks roughly five to twelve-plus years of production ML experience. No hiring or start commitment is offered. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| PathAI — Machine Learning Engineer II (Applied Research & Model Development) | RESOLVE | Deprioritize unless qualifying experience can be documented; the shared sponsorship record also remains unresolved. | Requires a relevant master’s plus two to four years of experience, or a PhD plus zero to two. The fictional master’s profile does not establish the required experience. No employment start date is specified. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| Scale AI — Software Engineer - New Grad | RESOLVE | Prioritize clarification: confirm degree eligibility, internship fit, location, sponsorship and an acceptable start date. | The stated graduation cohort includes fall 2026 or spring 2027. The role asks for software/product internship experience and shipped systems, which the profile does not establish. It emphasizes product engineering alongside AI. No employment start date is specified. | Hold; investigate first: its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed. | Suketh Reddy Produtoor · 2026-10-02 |
| Anthropic — Applied AI, Research Engineer | RESOLVE | Deprioritize this experienced role and search for a better level match. | Requires at least six years in a relevant technical role, substantial LLM experience and customer-facing work. The profile does not establish these qualifications. No employment start date is specified. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |
| OpenAI — Machine Learning Engineer, Core Experimentation | RESOLVE | Deprioritize pending evidence of the required leadership and willingness to work in Bellevue. | Requires evidence of leading production ML products and technical direction across teams. It specifies in-person work in Bellevue. It gives no numeric experience minimum or employment start date. The profile does not establish the leadership experience or relocation preference. | Hold: the available evidence does not support defensible fit and timeline numbers. | Suketh Reddy Produtoor · 2026-10-02 |

## Run analysis (drafted by Claude Code, for the student to check)

**What worked.**
- The role-level signal separated two companies that a company-level "sponsor" label treats alike:
  - AppLovin: 130 approvals, 98% approved, record includes an unmarked "Machine Learning Engineer".
  - Moloco: 200 approvals, 99% approved, only "Machine Learning Engineer II".
- Every number in the report traces to a row or to a declared input.
- The recipe refused to guess six times, each time naming one check a person can do.

**What the recipe or prototype got wrong or missed.**
1. **Liveness passes a talent pool.** Moloco's posting is an "Expression of Interest" pool, and the
   engine's liveness check called it active because it has an apply button. The recipe cannot tell a
   standing pool from an opening.
2. **Coverage is thin exactly where this student looks.** The three frontier-AI employers in the queue
   are absent from the data. Two Greenhouse boards forward to company sites that the recipe will not
   fetch. Six of eight roles ended in RESOLVE.
3. **The decisions rest on unread postings.** Fit and timeline were proposed from titles, not read from
   the postings, and AppLovin's TAILOR depends on the timeline being at least 0.6.
4. **The report was wrong in run 1.** It described PathAI's shared record as "no record". Fixed; run 2
   shows the record and the reason.
5. **The queue was hand-picked across tiers.** It cannot test the change brief's prediction that most
   matched roles land in Likely. Over the whole file, Likely outnumbers Proven 1,525 to 27.

**One concrete next improvement.** Add a declared `pool_title_patterns` rule ("expression of interest",
"talent pool", "general application"). Postings whose titles match would be held with reason
`not-a-specific-opening` before liveness. It needs a new fixture role, a test, and a rules version bump.

## Student's reflection

*Written by the student on 2026-10-02 and placed here verbatim.*

What surprised me was that a relevant ML/AI title and a company’s sponsorship history could still lead to a poor recommendation once the posting requirements were considered. Holding all eight was the right call because assigning numbers would hide uncertainty about qualifications and employment timing. Scale AI was the hardest case because its graduation cohort matched, but that alone did not resolve the other requirements. Before using this recipe for my own search, I would add a posting-requirements check before scoring fit and require evidence for the timeline factor. My review focused on the reasoning behind the title rules and holds; I have not personally rerun the commands or compared the reports directly against the CSV.

## Attestation

*Draft. The rows under "Tested" were run by Claude Code on 2026-09-30. The student re-runs them and signs.
The recipe's `attestation` field stays null either way.*

```markdown
## Attestation
- Recipe: ml-newgrad-sponsor-match v0.1.0 (title rules v0.2.0)
- By: — not yet signed (student: name · date, after re-running the rows below)

### Tested
| Ran | Saw | Expected |
|---|---|---|
| sample run on a clean checkout of fe07d1b | 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1) | the expectation written in the recipe |
| `python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v` | 36 tests OK, also on Python 3.9.6 | all pass, offline |
| live run on worked-run/queue-live-1.json, twice | 8 → TAILOR 1 (AppLovin), NETWORK-FIRST 1 (Moloco), RESOLVE 6; identical both times | a hold for each redirect, the shared record and the missing companies |
| rows 1955, 17152, 19754, 19760 read from the CSV | the report's values match; rows 19754 and 19760 identical | match |
| break: `--scorer-profile fixtures/BROKEN-authorization-profile.json` | STOP at scorer-contract; run VOID; exit 1 | void, never a decision |
| break: `--csv-sha256 000…` | STOP at source gate; exit 2; nothing written | stop |
| break: `--persona private/README.md` | STOP at input gate; exit 2 | stop without reading it |
| break: `--out-dir data/examples/should-not-exist` | STOP at input gate; exit 2; folder not created | stop |

### Did not test
- A real posting that returns 404 or an expired page. Only a saved fixture page was tested.
- Live checks on Lever or Ashby. The one Ashby posting (OpenAI) was held before the liveness gate.
- A real role cleared with `csv_row` or `shared_record_checked`. Only fixtures were tested.
- Any posting's start date or requirements. The timeline and fit factors are proposals.
- Whether any record is still true today. The file has no dates.
- A different release of the sponsorship file. Only the pinned one was used.
- Linux or Windows. Only macOS was tested.

### Broke during testing, fixed
- The first run crashed on a keyword collision in `hold()`. Renamed the field (before the first commit).
- The network-first question called non-senior titles senior. It now quotes only the ML/AI titles.
- Held roles hid which row was matched (Meta → META CO). The matched row and city are now shown.
- Rules v0.1.0 counted "AI DEVELOPER ADVOCATE", "Founding ML Engineer" and II/L2 titles as entry-level
  ML evidence. Fixed in rules v0.2.0.
- Identical records on lookalike companies were trusted. Added the `shared-h1b-record` hold.
- A live check would follow a 302 to an unnamed host. Added the no-redirect first hop.
- Run 1's report said PathAI had "no usable H-1B record". Fixed in `fe07d1b`.
- `pii-scan --diff` flagged a decorator line as an email. Replaced it in every commit of the unpushed branch.
- The overwrite-guard test broke on a leftover temporary folder and in a sandbox that cannot write. Hardened in `c242aa5`.
```

## Worked run 3: requirements reviewed, unsupported inputs withdrawn

Operator: Codex (AI), 2026-09-30 UTC. The title patterns and code are unchanged. All eight postings were read against the fictional profile. Because that profile lacks an experience history and no compatible employment start date was confirmed, proposed fit numbers are kept only in `review` metadata, labeled `model-judgment`; no fit or timeline values are fed to the scorer. The original values remain in `worked-run/queue-live-1.json` and the run 1–2 reports.

Input: `worked-run/queue-live-3-reviewed.json`. Codex first edited `queue-live-1.json` in place, which
broke runs 1–2's record of what they read. Claude Code then restored that file and moved the reviewed
version, unchanged, to its own name. Claude re-ran run 3 from it with network access forbidden, and
got the same result (`worked-run/terminal-live-3.txt`):

```text
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles course/2026fa/submissions/sukethrp/worked-run/queue-live-3-reviewed.json --out-dir course/2026fa/submissions/sukethrp/runs/worked-run-3-reviewed --overwrite --live
✓ 8 roles → held 8 · scored 0 (Apply 0 · Consider 0 · Skip 0) · actions RESOLVE 8
```

- AppLovin, Nextdoor, Databricks and Moloco: `no-timeline-factor`.
- PathAI: `shared-h1b-record`.
- Scale AI, Anthropic and OpenAI: `no-company-match`.

The command used `--live`, but **no prototype liveness request ran** because every role stopped at an earlier gate. The scorer was not called. This is a successful demonstration of holding unknown inputs; it is not a new eight-posting liveness verification. Separate employer-page reading is documented in `POSTING-REVIEW.md`.

The fresh source comparison confirms physical CSV line 1956 / data row 1955: AppLovin’s 130 approvals, two denials, 98.484848% approval rate, $150,000 company-wide median salary and sponsored titles match run 2. With proposed fit 0.20, timeline 0.60 would produce 0.225, not Apply; the arithmetic would need timeline 0.80 to reach 0.30. No timeline is asserted.

See `evidence/codex-review-2026-09-30/` for tests, sample, rules audit, deliberate source-hash break, source comparison and command transcripts. Student attestation remains unsigned. The older attestation’s “did not test posting requirements” describes Claude’s earlier work; Codex has since read them, which does not count as the student’s review.
