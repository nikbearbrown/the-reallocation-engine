# Posting and rules review

## Executive summary

The earlier recommendations relied on job titles rather than requirements. Reading all eight employer postings reveals substantial experience mismatches and no confirmed employment start dates. The revised queue (`worked-run/queue-live-3-reviewed.json`) therefore removes unsupported scoring inputs. The original runs remain available as historical evidence. This review was performed by Codex, an AI assistant, and does not clear the student’s judgment or attestation gates.

## Review record

Reviewed on 2026-09-30 UTC (2026-09-29 Eastern). Evaluated against the fictional Arjun Rao profile, not Suketh’s résumé. The profile has no work-history evidence and no issued EAD start date. Unknown experience is not proof of no experience.

Codex read the entire saved sample report and v0.2.0 rules audit. The sample separates 11 illustrative postings into six holds and five scored roles. The audit covers 30,369 companies: 27 Proven, 1,525 Likely and 28,817 held. A machine reading does not establish that Suketh read either document.

## Title rules: keep the current v0.2.0 configuration

- **Keep II and L2 as marked titles.** They should not establish the strict unmarked-title signal. Employer leveling differs, so this is a conservative screening convention, not a universal statement that every L2 role is senior.
- **Keep the exclusions** for advocate, success, product manager, business and information systems, along with sales, marketing and recruiting. These prevent the audited non-engineering titles from creating engineering evidence. The broad words “business” and “success” could remove valid future titles, so a new dataset needs a fresh audit.
- **Keep Founding as marked.** It does not by itself establish a graduate-level opening. It also does not prove a minimum number of years.
- **Keep the meaning of Proven narrow.** It means the declared historical-record rule passed. It does not establish current sponsorship, junior eligibility or an open position.

No rule patterns or thresholds were changed. The saved v0.1.0-to-v0.2.0 comparison shows six Proven-to-Likely changes across the combined rule revision and eleven tier/gap changes overall. PathAI also has an independent shared-record hold, so changing a level rule alone would not clear it.

This is Codex’s recommendation to retain the current rules. Student acceptance remains unrecorded.

## Eight-posting review

The numbers below are **AI proposals**, not measured probabilities or approved student ratings. A simple discussion scale is used: 0.00 for an explicit graduate exclusion; 0.10–0.30 for a substantial documented experience mismatch; 0.60 for a matching graduate cohort with important qualifications still unverified. No real résumé was assessed. These proposals are stored in review metadata, not supplied to the scorer.

| Posting | Original fit | Proposed fit | Timeline | Evidence and recommendation |
|---|---:|---:|---|---|
| [AppLovin](https://job-boards.greenhouse.io/applovin/jobs/4712559006) | 0.70 | 0.20 | Unknown; omit | Requires at least four years developing and deploying production ML systems. Python and PyTorch align with the target, but the fictional profile documents no such experience. No employment start date is specified. Deprioritize this experienced role; seek a graduate opening. |
| [Nextdoor](https://job-boards.greenhouse.io/nextdoor/jobs/6005888) | 0.70 | 0.20 | Unknown; omit | Requires at least five years of industry or academic experience applying ML at scale, plus advertising ML and production coding. The profile does not establish this experience. No employment start date is specified. Deprioritize unless the required industry or academic experience can be documented. |
| [Databricks](https://job-boards.greenhouse.io/databricks/jobs/8546367002) | 0.60 | 0.00 | Unknown; omit | The posting explicitly excludes internship, new-graduate and entry-level applicants. It requires production GenAI deployment experience. No employment start date is specified. Deprioritize this posting because it explicitly excludes the target applicant level. |
| [Moloco](https://job-boards.greenhouse.io/moloco/jobs/7655058003) | 0.60 | 0.10 | Unknown; omit | This is an expression-of-interest pool rather than a dated vacancy. It seeks roughly five to twelve-plus years of production ML experience. No hiring or start commitment is offered. Deprioritize this pool for the immediate graduate search; locate a specific early-career opening. |
| [PathAI](https://job-boards.greenhouse.io/pathai/jobs/8696752002) | 0.40 | 0.30 | Unknown; omit | Requires a relevant master’s plus two to four years of experience, or a PhD plus zero to two. The fictional master’s profile does not establish the required experience. No employment start date is specified. Deprioritize unless qualifying experience can be documented; the shared sponsorship record also remains unresolved. |
| [Scale AI](https://job-boards.greenhouse.io/scaleai/jobs/4730836005) | 0.60 | 0.60 | Unknown; omit | The stated graduation cohort includes fall 2026 or spring 2027. The role asks for software/product internship experience and shipped systems, which the profile does not establish. It emphasizes product engineering alongside AI. No employment start date is specified. Prioritize clarification: confirm degree eligibility, internship fit, location, sponsorship and an acceptable start date. |
| [Anthropic](https://job-boards.greenhouse.io/anthropic/jobs/5390811008) | 0.50 | 0.10 | Unknown; omit | Requires at least six years in a relevant technical role, substantial LLM experience and customer-facing work. The profile does not establish these qualifications. No employment start date is specified. Deprioritize this experienced role and search for a better level match. |
| [OpenAI](https://jobs.ashbyhq.com/openai/9d4d2727-27f3-4a63-857c-a96466130645) | 0.60 | 0.20 | Unknown; omit | Requires evidence of leading production ML products and technical direction across teams. It specifies in-person work in Bellevue. It gives no numeric experience minimum or employment start date. The profile does not establish the leadership experience or relocation preference. Deprioritize pending evidence of the required leadership and willingness to work in Bellevue. |

All eight original timeline factors were removed. No posting provided a confirmed employment start date compatible with the persona’s unissued EAD. Scale’s cohort is encouraging, but graduation eligibility does not establish a January start. Unknown is represented by omission, not 0 (known closed), 0.5 (invented partial confidence), or 1 (open).

## Source access and limits

All original posting links were opened. The web reader could not expose some dynamic pages, so Codex read the same job IDs through each employer’s public Greenhouse board API. OpenAI’s page was read through its embedded public JobPosting structured data after the public Ashby board API returned 403. The review evidence records original URLs, retrieval URLs, timestamps, text hashes, short excerpts and summaries. Full copyrighted postings and employer contact details are excluded from the submission evidence.

These are external checks by the assistant, separate from the prototype’s G6 liveness classifier. Reading redirected employer content does not silently expand the prototype’s allowed hosts or clear G6.

## AppLovin arithmetic and source check

Physical CSV line **1956** is data row **1955**, because line 1 is the header. Codex compared the source to the second live run: **130 approvals, 2 denials, 98.48484848484848% approval rate, company-wide median salary $150,000**, and the full sponsored-title list match. The salary is a historical company-wide record, not this posting’s offer.

The old calculation is `(0.9 × 0.35 + 0.7 × 0.30) × 0.85 = 0.44625`. At the old fit, 0.60 is sufficient to clear the timeline soft-spot rule and the 0.30 Apply threshold. With the proposed fit of 0.20, the pre-gate sum is 0.375: a timeline of 0.60 produces only **0.225**, in Consider. Reaching 0.30 would require a timeline of at least **0.80**. No such timeline was confirmed, and the requirements mismatch still needs a human decision. The earlier “0.60 is enough” statement depends on keeping fit at 0.70.

## Human review still required

The student must personally read the audits, decide whether to accept the rules and ratings, make the eight decisions, supply an honest account of personal work, run the demo and sign only after doing the stated checks. The recipe remains SPECIFIED and its attestation remains null.
