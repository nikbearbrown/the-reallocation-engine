# Worked run — the recipe on eight real ML/AI postings

## Executive summary

**What this is.** Three real runs of the recipe on eight real ML/AI job postings, found on 30 September
2026. They are run for a fictional student in the recipe's exact situation: F-1, graduating in December
2026, looking for a new-grad ML/AI engineering job. The file also holds the student's decisions, their own
re-run of the checks, and their signed attestation.

**Why read it.** It shows what the recipe decided, which inputs were records and which were declared or
judged, how the output was checked, and what went wrong.

**What it found.**
- **Final result.** All eight postings are held for a person, and the student decided to keep them held,
  investigating Scale AI first (decision table below).
- **How it got there.**
  - **Runs 1–2:** suggested one application (AppLovin, whose sponsorship record includes a plain "Machine
    Learning Engineer") and one networking question (Moloco, whose only sponsored ML title is "Machine
    Learning Engineer II"). Both results rested on fit and timeline numbers that Claude proposed from the
    job titles alone.
  - **The posting review (Codex, 2026-09-30):** six of the eight postings asked for 2–12+ years of
    experience or excluded new graduates, and none stated a start date.
  - **Run 3:** withdrew those numbers, and every role stopped at a gate.
    - Four had no timeline.
    - One (PathAI) has a sponsorship record that sits, value for value, on a lookalike company.
    - Three frontier-AI employers (Scale AI, Anthropic, OpenAI) are not in the engine's data at all. The
      only rows carrying their names are investment funds.
- **What held up throughout:** the sponsorship evidence. Its values were cross-checked against the source
  file by hand, by Claude and Codex, and by the student.

Runs 1–2 read `worked-run/queue-live-1.json` (sha256 `38a030669592…`), which is unchanged. Run 3 read
`worked-run/queue-live-3-reviewed.json` (sha256 `76207422f40e…`). The sections below follow the order in
which the work happened: runs 1–2, their checks, the decision, the reflection and attestation, then run 3.

---

## Inputs

| Input | Value | Label |
|---|---|---|
| Persona | `search/examples/arjun-rao/profile.yml`: fictional; F-1 master's student, graduating December 2026, OPT not started; ML/AI target. The prototype reads only `needs_sponsorship: true` | your-input (fictional) |
| Queue | `worked-run/queue-live-1.json`: eight real postings from the engine's own scanner (step 1), chosen across the recipe's tiers using the rules audit. Company, title and URL as posted. Greenhouse URLs are in the board's canonical form for the job id the scanner reported | your-input |
| Fit, timeline | fit 0.4–0.7, timeline 0.85 (0.9 for the new-grad posting). **Proposed by Claude Code from the job title only, not checked against the posting text.** Every reason in the queue says so. Withdrawn for run 3; on 2026-10-02 the student held all eight postings instead | your-input |
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

No AI model was called during the runs. Two sets of values still came from an AI model, so this split
has a model-judgment column:
- **Runs 1–2.**
  - Claude Code proposed every fit and timeline number from the job title alone.
  - The student adopted them to review later, and the prototype labeled them `your-input` because they
    were declared in the queue.
  - By the weakest-label rule they are model judgments, and so is any composite built on them. The
    prototype cannot tell who proposed a declared number (defect D9 in `PROPOSED-ADDITIONS.md`).
- **Run 3.** Codex's fit proposals sit in the queue's review metadata, labeled `model-judgment`. They were
  not given to the scorer, and the student did not accept them.

"Record" means read from the sponsorship file or seen by the live checker. "Your-input" means declared by
a person, or computed from something they declared, such as a tier from the declared title rules.

| Posting | record | your-input | model-judgment | Result |
|---|---|---|---|---|
| **AppLovin**, SWE, Machine Learning | row 1955 APPLOVIN CORP; 130 approvals, 2 denials; sponsored titles incl. "Machine Learning Engineer"; first hop 200; live check `active` (2026-09-30T01:26:58Z) | tier Proven (rule: an unmarked ML/AI title and ≥ 10 approvals); p 0.9 | fit 0.7 and timeline 0.85, Claude's proposals (the prototype labeled them your-input); so the composite 0.446 is a judgment too | **TAILOR** (runs 1–2) |
| **Moloco**, Expression of Interest: MLE | row 17152 MOLOCO INC; 200 approvals, 2 denials; only ML/AI title "Machine Learning Engineer II"; live check `active` | tier Likely (every ML/AI title marked); p 0.6 | fit 0.6 and timeline 0.85, Claude's proposals; composite 0.332 | **NETWORK-FIRST** (runs 1–2) |
| **Nextdoor**, MLE - Ads | row 18131 NEXTDOOR INC; 222 approvals; titles incl. "Machine Learning Engineer"; first hop 302 to about.nextdoor.com | tier Proven | fit 0.7 and timeline 0.85, Claude's proposals (not used: held) | **RESOLVE** (redirect) |
| **Databricks**, AI Engineer (FDE) | row 7248 DATABRICKS INC; 1,640 approvals; titles: Software Engineer, Senior Software Engineer, Solutions Architect, Specialist Solutions Architect, Senior Solutions Engineer; first hop 302 to databricks.com | tier Likely (no ML/AI title in the list) | fit and timeline, Claude's proposals (not used: held) | **RESOLVE** (redirect) |
| **PathAI**, MLE II | row 19754 PATHAI INC; 78 approvals; the identical record on row 19760 PATHRAI INC | tier Unknown (record shared with a lookalike) | fit and timeline, Claude's proposals (not used: held) | **RESOLVE** (shared record) |
| **Scale AI**, SWE New Grad · **Anthropic**, Applied AI Research Engineer · **OpenAI**, MLE Core Experimentation | no row with these normalized names. Keyword search (`worked-run/resolve-check-legal-names.txt`): "ANTHROPIC - A SERIES OF AURUM VP FUND LLC" and "OPEN AI A SERIES OF VUVP FUND LLC" are investment funds; "scale ai" matches only MINDSCALE AI and GREYSCALEAI | — | fit and timeline, Claude's proposals (not used: held) | **RESOLVE** (not in the file) |
| **Run 3, all eight** | the same rows as above. No live check ran: every role stopped at an earlier gate | tiers and p as above; no fit or timeline (withdrawn) | Codex's proposed fits, in review metadata only: AppLovin 0.2, Nextdoor 0.2, Databricks 0.0, Moloco 0.1, PathAI 0.3, Scale AI 0.6, Anthropic 0.1, OpenAI 0.2 | **RESOLVE ×8**: no timeline 4, shared record 1, no company match 3 |

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
   *The student repeated the AppLovin check on 2026-10-02 (`sed -n '1956p'` on the same file, line 1956 =
   data row 1955); see the attestation below.*
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

**Student decisions recorded 2026-10-02**, from the student's own statement in chat: “Keep all eight postings held because the available evidence does not support defensible fit and timeline numbers; investigate Scale AI first because its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed.” The last two columns apply it row by row. The current prototype result is RESOLVE for all eight roles. The advisory table below is a **Codex draft**, dated 2026-09-30 UTC, for student review. “Deprioritize” is advice based on requirements, not a machine Skip classification and not a cleared human gate. Claude Code entered the last two columns from the student's statement in chat; the name and date record the student's decision, not a signature they typed.

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

*Written by the student and placed here verbatim. This is their revised paragraph of 2026-10-02, written
after their own re-run, and it replaces their first version. The first version, and the one-line update
they added before revising it, are in the git history (commits `d1110ea` and `56e67e4`).*

What surprised me was that a relevant ML/AI title and sponsorship history could still produce an unsuitable recommendation once the posting requirements were considered. Holding all eight was the right call because assigning numbers would conceal uncertainty about qualifications and employment timing, although Scale AI’s matching graduation cohort made that decision harder. What worked was the separation of records from declared inputs and the scorer-contract gate, which stopped the deliberately broken authorization case instead of producing usable recommendations. I personally reran the tests and sample, observed the VOID result and compared AppLovin’s CSV line with the report. Before using the recipe for my own search, I would add a posting-requirements check before scoring fit and require evidence for the timeline factor.

## Attestation

- Recipe: ml-newgrad-sponsor-match v0.1.0 (title rules v0.2.0), at commit `c7eb748`
- By: — awaiting the student's signature for the fresh-clone run below

*The rows under "Tested" were run by the student on 2026-10-02 (evening, Eastern) in their own terminal.
They used a fresh clone of the branch at commit `c7eb748`, after `npm install`, and their pasted output
follows the tables. The clean-checkout suite, the live runs and the other break attempts were run by
Claude Code and are in `TEST-REPORT.md`.*

*The recipe and its scripts are unchanged since `c7eb748`, and any later edit to either voids this
attestation. The recipe's `attestation` field stays null, because the lifecycle sets it only at VERIFIED.*

*History: the student first signed on 2026-10-02 for the same four checks, run in their existing checkout
at `d1110ea` (`evidence/student-rerun-2026-10-02/terminal.txt`). Later that day the recipe and card were
corrected. The changes were editorial and no code changed, but they voided that signature. The run below
replaces it.*

### Tested
| Ran | Saw | Expected |
|---|---|---|
| a fresh clone: `git clone --branch contrib/2026fa-sukethrp-ml-newgrad-sponsor-match <repo> /tmp/ml-fresh`, then `npm install` | `c7eb748` checked out; 55 packages installed | a clean copy of the branch, with no local files |
| `python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v` | 36 tests, OK | all pass, offline |
| `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py` | 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1) | the expectation written in the recipe |
| deliberate break: `sponsor_match.py --scorer-profile …/fixtures/BROKEN-authorization-profile.json --out-dir output/break-authz; echo "exit code: $?"` | STOP at the scorer-contract gate; the run is VOID; exit code 1 | void with exit code 1, never a decision |
| `sed -n '1956p' data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | APPLOVIN CORP: 130 approvals, 2 denials, 98.48% approved, $150,000 company median, titles include "Machine Learning Engineer" | the values in the report's AppLovin row |

### Did not test
- Live mode (`--live`), Python 3.9, the rules audit and the other break attempts. These were run by
  Claude Code and Codex, not by the signer (see `TEST-REPORT.md`).
- A real posting that returns 404 or an expired page. Only a saved fixture page was tested.
- Live checks on Lever or Ashby. The one Ashby posting (OpenAI) was held before the liveness gate.
- A real role cleared with `csv_row` or `shared_record_checked`. Only fixtures were tested.
- Any posting's start date. No posting states one, so all eight stay held.
- Whether any record is still true today. The file has no dates.
- A different release of the sponsorship file. Only the pinned one was used.
- Linux or Windows. Only macOS was tested.

### Broke during testing, fixed
Found and fixed during development by Claude Code; details in `TEST-REPORT.md`:
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

### The student's terminal output, pasted

From `evidence/student-rerun-2026-10-02-fresh-clone/terminal.txt`. The 36 per-test lines and npm's
warnings are left out here; the file has them. The saved copy also removes the shell prompts, the local
path, a maintainer's email in npm's warning, and the CSV row's personal columns.

```text
$ git clone --branch contrib/2026fa-sukethrp-ml-newgrad-sponsor-match "<local path>/Assignment 3/the-reallocation-engine" /tmp/ml-fresh
Cloning into '/tmp/ml-fresh'...
done.
$ cd /tmp/ml-fresh && git log -1 --oneline && npm install --no-audit --no-fund
c7eb748 (HEAD -> contrib/2026fa-sukethrp-ml-newgrad-sponsor-match, origin/contrib/2026fa-sukethrp-ml-newgrad-sponsor-match, origin/HEAD) docs(cases/2026fa): recipe and card corrections; attestation voided pending re-sign
… npm warnings …
added 55 packages in 926ms
$ cd /tmp/ml-fresh && python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
… 36 lines, one per test, each ending in "ok" …
Ran 36 tests in 1.280s

OK
$ cd /tmp/ml-fresh && python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
✓ 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1) · actions CONSIDER 1, NETWORK-FIRST 2, RESOLVE 6, SKIP 1, TAILOR 1
  output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/sponsor-match-report.md  +  output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/sponsor-match-log.json
$ cd /tmp/ml-fresh && python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --scorer-profile scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/fixtures/BROKEN-authorization-profile.json --out-dir output/break-authz; echo "exit code: $?"
VOID 11 roles → held 6 · scored 0 (Apply 0 · Consider 0 · Skip 0) · actions
  output/break-authz/sponsor-match-report.md  +  output/break-authz/sponsor-match-log.json
STOP at the scorer-contract gate: the scorer ran as if the persona does not need sponsorship (profile_needs_sponsorship = False), so the sponsorship vote was weighted 0
exit code: 1
$ cd /tmp/ml-fresh && sed -n '1956p' data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv
APPLOVIN CORP,Other Technology,applovin.com,PALO ALTO,CA,94304-1047,[phone removed],,,[executive officers removed],[board directors removed],594499996.0,194500000.0,Series D+,2022-02-23,130.0,2.0,98.48484848484848,150000.0,"['Software Engineer II', 'Machine Learning Engineer', 'Technical Support Specialist II', 'Product Manager, Lion Studios', 'Senior Designer, Motion Graphics']"
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

See `evidence/codex-review-2026-09-30/` for tests, sample, rules audit, deliberate source-hash break, source comparison and command transcripts. Student attestation remains unsigned *(true on 2026-09-30; the student signed it on 2026-10-02, see [Attestation](#attestation))*. The older attestation’s “did not test posting requirements” describes Claude’s earlier work; Codex has since read them, which does not count as the student’s review.
