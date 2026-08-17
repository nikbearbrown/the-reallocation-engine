# Verified vs. Inferred — skill-demand-monitor

Every field this contribution emits, labeled per The Reallocation Engine's
"Give to AI / Keep for yourself" split. Categories: **record** (a fact pulled
directly from an input data record), **script-output** (a deterministic
computation over records — reproducible, not a judgment call), **your-input**
(a threshold or mapping a human authored and can be challenged), **missing**
(deliberately not computed). No field in this tool's output is a
**model-inference** or **external-source** value — the script makes zero LLM
calls and zero network calls.

## `skill-demand.json` (agent output)

| Field | Label | Why |
|---|---|---|
| `total_postings_ingested`, `valid_count` | script-output | Counted directly from the input array; reproducible by re-running. |
| `rejects[].job_id`, `rejects[].reason` | script-output | Deterministic: a named required field was empty/missing on that record. |
| `rejects_by_reason` | script-output | A tally of the above. |
| `gates.role_filter.matched_count`, `synonyms` | script-output / your-input | The match itself is deterministic; the synonym table it matches against (`CONFIG.role_filter_synonyms`) is human-authored and inspectable — extend it yourself, it is not a verified linguistic resource. |
| `status` | script-output | Which gate (if any) halted the run — a direct function of the counts above. |
| `candidate_count`, `zero_hit_rate` | script-output | Computed from the candidate set. |
| `low_coverage` | script-output (threshold: your-input) | `zero_hit_rate > coverage_floor`; the 40% floor is a `[DEFINE]` starting guess in the script, not a statistically derived cutoff. |
| `config.min_sample`, `config.coverage_floor` | your-input | Documented `[DEFINE]` thresholds in `skill-demand-monitor.mjs` — challenge them, they are not verified facts. |
| `taxonomy` (version string) | record | Read directly from the taxonomy file's own `_taxonomy`/`_version` metadata. |
| `skills[].id`, `.label`, `.category` | your-input | Pulled from `ai-engineering-skills.json` — a human-curated taxonomy, not a verified industry standard. |
| `skills[].posting_count` | script-output | Count of distinct candidate postings whose text matched the skill's regex patterns. |
| `skills[].evidence[].job_id`, `.source_url` | record | Copied directly from the input posting records that produced the match — this is the traceability the whole tool exists to provide. |
| `skills[].has_evidence` | script-output | Deterministic set-membership check against the `--profile` file's contents (itself your-input — either the synthetic example or a real private profile). |
| "which skill matters most to learn next" | **missing** | Deliberately not computed. Frequency and profile-gap are reported as facts about the input; ranking them by importance to a specific person is a judgment call this tool does not make (`recipes/skill-demand-monitor.card.md`, failure mode 5). |

## Input file itself

| Field | Label | Why |
|---|---|---|
| Posting fields in `data/examples/skill-demand/example-postings.json` (`title`, `company_name`, `description_text`, etc.) | **synthetic — not a record of a real posting** | Explicitly labeled in the file's own `_note` field. Built to the same unified schema real ATS-scan output uses, for demonstration and reproducible testing only. |
| Posting fields in a real postings file a user supplies | record (if genuinely scraped) or external-source (if pulled live from an ATS at run time — this tool does not do that; it only reads a file already produced elsewhere) | This tool has no scraper of its own — see `recipes/skill-demand-monitor.card.md`, "What it cannot verify": it only reports on what it's given. |
| `data/examples/skill-demand/example-profile.json` skills list | **synthetic — a fictional persona**, explicitly labeled in its own `_note` field | Never a real person's skill history. A real profile belongs in `private/skills-profile.json`, gitignored. |

## The one line that matters most

If you cannot find, for any number in a `skill-demand.md` report, which row of
this table it falls under — distrust the number before your confusion.
