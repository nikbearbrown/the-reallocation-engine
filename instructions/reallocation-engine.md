## The Reallocation Engine

An **evidence-first job-search system for international students** (F-1/OPT/STEM OPT), and the working repository for the book *The Reallocation Engine*. It reallocates scarce application effort using five evidence components — company funding (SEC Form D), sponsorship history (DOL/H-1B), posting liveness (ATS), role quality (BLS/O*NET), and visa timeline — where liveness and timeline are **gates, not votes** (a healthy run skips at least half of evaluated roles). It is a domain built on the Snickerdoodle framework. Project-specific rules:

- Read `_MANIFEST.md` for the portable read-first map — what is canonical, task-relevant, generated, or private (a thin index over `SNICKERDOODLE.md` / `DOMAIN.md`; machine-readable twin in `.ai/manifest.yaml`).
- Use lowercase `scripts/`; never create `SCRIPTS/`.
- Manuscript content lives in `chapters/` — no scripts or data there.
- `data/ats/`, rendered resumes/PDFs, and `.env*` are **private by default** — review before commit (they reveal personal job-search activity).

### `help` command

When the user's message is just `help` (or `/help`), reply with **exactly** the fenced block below — verbatim, nothing before or after — then stop and wait:

```
THE REALLOCATION ENGINE — evidence-first job search (a Snickerdoodle domain)
Reallocate scarce application effort by evidence. The rule of the house:
fluency is the first sign of trouble — the human owns the irreducible judgment.

WHAT YOU CAN DO
  recipes    Read a recipe + its run evidence (best first look):
             recipes/ (44 recipes — scan, pipeline, oferta, tracker, pdf, patterns…)
  runnable   npm run ats:scan -- --dry-run   ·   ats:liveness <url>   ·   ats:verify
             npm run resumes:pdf -- --all    ·   python3 scripts/sec/refresh-recent-sec-quarters.py
  evidence   SEC Form D (funding) · DOL/H-1B (sponsorship) · ATS (liveness, a GATE)
             BLS/O*NET (role quality) · visa timeline (a GATE)
  book       The Reallocation Engine manuscript: chapters/ (21 chapters)
  data       Two-layer target data/raw -> data/verified (planned); domain dirs run today
  scripts    conformance · to-markdown · build-instructions · svg-to-png

HOW IT WORKS
  Every finding traces report -> log -> recipe -> source. Gates are hard stops a named
  human clears. Skip is a successful outcome. Machines verify conformance; humans verify
  adequacy. (Constitution: SNICKERDOODLE.md)

TRY
  "run the ats scan dry-run and read the report"   ·   "what's runnable today?"
  "show me the scan recipe"                        ·   "list the known defects"
```
