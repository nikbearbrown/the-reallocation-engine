# O*NET Job Trend Analyzer
## Week 1 Assignment — The Boondoggle Report
### Computational Skepticism for AI

---

# PART 1 — THE SOFTWARE DESIGN DOCUMENT

---

## /v0 — Problem Formulation Gate

**V0 SUMMARY**

**Ecosystem:** The Irreducibly Human site (irreduciblyhuman.xyz), built on Next.js App Router, deployed on Vercel, with Neon PostgreSQL as the database. The site serves as the companion platform for a graduate certificate program at Bear Brown & Company, with an existing D3 visualization registry, a tools directory, and an admin dashboard.

**Existing components touched:** Neon PostgreSQL (via `lib/db.ts`), the `/tools` artifact system, the existing D3 viz registry (`lib/viz/`), the site header/footer and dark/light mode system.

**Proposal:** The O*NET Job Trend Analyzer is a Next.js page at `/onet` that lets users select any occupations from the O*NET database and see three coordinated D3 charts — (1) employment index over time from BLS data (2012–2026), (2) ability score profiles with confidence interval bands showing where each occupation sits relative to the field, and (3) skill score profiles with the same CI structure — plus a popup on any occupation showing the full O*NET profile including tasks, knowledge, work activities, and related occupations.

---

## /v1 — Problem Intake

**System name:** O*NET Job Trend Analyzer

**Problem:** The public conversation about AI's impact on employment systematically misidentifies which work is at risk — because occupation labels are used as proxies for cognitive demand, and they are bad proxies. A tool that shows employment trends alongside cognitive ability and skill profiles makes the actual sorting mechanism visible in data.

**Primary user:** Graduate students in the Irreducibly Human certificate program evaluating which occupations are AI-resistant and why. Current workflow: reading BLS reports and O*NET profiles separately, with no integrated view of how employment trends correlate with cognitive demand profiles.

**What this gives the user that their current solution does not:** The combination — employment trend and cognitive profile in a single coordinated view, with CI bands showing where an occupation sits relative to the field distribution, not just its raw scores.

**Category:** Interactive data visualization tool backed by a live database.

**Deployment target:** Vercel (existing deployment pipeline). Same Neon database as the rest of the site.

**Build scale:** Solo developer (Nik), existing codebase, existing infrastructure.

**Three systems the user already relies on:**
- onet.org — full O*NET database browser, but no employment trend data and no comparison view
- BLS data tools (bls.gov/oes) — employment data, but no cognitive profile data and no visualization
- The existing Irreducibly Human site — the curriculum context, but no interactive labor market data tool

**One existing system explicitly not being replicated:** onet.org's full occupation browser. This tool does not attempt to replicate O*NET's full interface. It surfaces the cognitive dimensions most relevant to AI substitutability, not the complete O*NET data model.

**Problem Summary:**

This system is an interactive data visualization tool for graduate students and researchers, that solves the problem of opaque occupational cognitive demand profiles by integrating BLS employment trend data with O*NET cognitive ability and skill scores in a single coordinated D3 interface. It occupies the space between a static labor market infographic and a full occupational database browser, and it succeeds when a user can select any occupation, see its employment trajectory alongside its cognitive profile relative to the field distribution, and understand why the Irreducibly Human taxonomy predicts that occupation's AI resilience — without reading a 200-page BLS report.

**Biggest unresolved question at intake:** The BLS employment time-series requires SOC-code mapping to O*NET occupation codes, and SOC codes changed between the 2010 and 2018 SOC systems (effective in the 2019–2020 OEWS vintage). The bridge between historical and current BLS data for the same occupations needs to be defined before the data architecture can be locked.

---

**Personal addition (required):**

When Gru held the line on OQ1 and OQ2, I assumed the problem was simple: pull O*NET scores, show them over time, done. What the pushback forced me to see is that O*NET 30.2 is a single snapshot — there is no time axis in the ability data itself. The "over time" I wanted was entirely in the BLS employment data, which is a completely different source that needed to be joined to O*NET through SOC codes that have changed across vintages. That is not a technical detail — it is the central data architecture question, and I had not formulated it before Gru named it. The second thing the pushback revealed: the confidence intervals I thought I would need to compute were already pre-calculated in the O*NET files, stored as `Lower CI Bound` and `Upper CI Bound` on every row. I was planning to build something O*NET had already built. The formulation gap was not about scope — it was about not having read the data before designing the system.

---

## /v2 — Architecture Principles

### Principle 1: Database-First, Chart-Second
All O*NET and BLS data lives in Neon PostgreSQL. The Next.js page queries the database; it does not parse flat files at runtime. The O*NET db_30_2 text files are a one-time import source, not a runtime dependency.

*Honors:* Loading `/onet` with 500 occupations selected produces the same response time as loading it with 2.
*Violates:* Bundling O*NET CSV data into the Next.js build or reading flat files from `public/`.
*Failure state if ignored:* Cold-start latency, Vercel function size limits exceeded, stale data with no update path.

### Principle 2: Coordinated Views, Independent Scales
The three D3 charts (employment index, ability scores, skill scores) are coordinated — selecting an occupation highlights it across all three — but each chart has its own independent scale and axis. No chart's y-axis is forced to match another's.

*Honors:* Ability scores (0–7 O*NET scale) and employment index (2018=100) can both be legible simultaneously.
*Violates:* Normalizing all three charts to a common 0–1 scale "for consistency."
*Failure state if ignored:* Charts that look aligned but encode different things as equivalent — a proportional ink violation at the system level.

### Principle 3: Confidence Intervals Are First-Class Data
Every ability and skill score chart shows both the within-field CI and the cross-occupation overall CI. These are not optional overlays — they are the primary analytical signal. A single occupation's score only means something relative to the distribution it sits within.

*Honors:* Rendering CI bands before rendering the mean line. Populating CI from the actual O*NET score distributions, already pre-computed in the source data.
*Violates:* Showing mean scores without CIs "to keep the chart clean."
*Failure state if ignored:* Users conclude an occupation's ability score is high or low without knowing whether it's statistically distinguishable from the field average.

### Principle 4: The Existing Site Architecture Is Inviolable
This tool is a Next.js page at `/onet`, using the existing Neon client (`lib/db.ts`), the existing header/footer, the existing dark/light mode system, and the existing deployment pipeline. It does not introduce new deployment targets, new auth systems, or new infrastructure providers.

*Honors:* New API routes at `/api/onet/*`. New Neon tables in the existing database. New page at `app/onet/`.
*Violates:* A separate Vercel project, a separate database, or a new authentication layer.
*Failure state if ignored:* Two codebases to maintain, two deployment pipelines to monitor, credential sprawl.

**Principle Collision Test:** Principles 2 and 3 could collide if the CI bands for a very wide distribution make the chart unreadable alongside other occupations. Resolution: Principle 3 is primary — CIs are never hidden. If readability suffers, the UI adds a toggle to show/hide specific occupations rather than suppressing CI bands.

---

## /v3 — Core User Flows

### 3.1 Primary Flow — Occupation Comparison

1. User navigates to `/onet`
2. System renders page with search/select interface and empty chart panels, pre-loaded with Software Developers and Computer Programmers as the default comparison
3. User types an occupation name or SOC code into the search field
4. System queries `/api/onet/search?q=` and returns matching occupations with titles and SOC codes
5. User selects up to 5 occupations from results
6. System queries `/api/onet/employment`, `/api/onet/abilities`, `/api/onet/skills` in parallel for selected SOC codes
7. System renders three coordinated D3 charts:
   - Chart 1: Employment index over time (BLS data, 2018=100 baseline, projected 2025–2026)
   - Chart 2: Ability scores — horizontal dot plot, y-axis = ability name, x-axis = LV score 0–7, per-occupation dots with CI whiskers, overall mean band, field mean band
   - Chart 3: Skill scores — identical structure to Chart 2
8. User hovers any line or dot — tooltip shows occupation title, current value, year or score
9. User clicks any occupation line or label — modal opens with full O*NET profile
10. Modal shows: occupation title, SOC code, description, tasks, knowledge, skills, abilities, work activities, related occupations
11. User closes modal — chart state unchanged
12. User adds or removes occupations — all three charts update without page reload

**Flow Honesty Test:** If this flow were built as a command-line prototype with no UI — just API calls returning JSON — would it solve the stated problem? Yes: the data join (employment + cognitive profile) is the insight. The visualization is the delivery mechanism, not the insight itself.

### 3.2 Industry Filter Flow

1. User opens the industry dropdown (major occupation group: Computer and Mathematical, Healthcare Practitioners, etc.)
2. System loads occupations within that group
3. Charts 2 and 3 update field mean CI bands to reflect within-industry distribution rather than cross-occupation distribution
4. User selects specific occupations from the filtered set for comparison

### 3.3 Administrative Flow

1. Operator downloads new O*NET release (annual) and new OEWS files (annual)
2. Operator uploads ZIP to Vercel Blob via admin dashboard
3. System re-runs import pipeline, upserts new data into Neon
4. Operator verifies row counts and spot-checks one occupation's scores against onet.org
5. System recomputes `onet_ability_stats` and `onet_skill_stats` pre-aggregations
6. New data is live without any code deployment

**Failure states:**
- Search returns no results: "No occupations found matching '[query]'. Try a job title or SOC code."
- BLS data unavailable for a SOC code: Employment chart shows "Employment data not available" with ability/skill charts still rendering
- Database connection failure: All three charts show error state with retry button — no silent failures

---

## /v4 — User and Business Needs

**N1 — STUDENT must be able to compare cognitive demand profiles** of two or more occupations when evaluating AI resilience, without reading O*NET technical reports.
*Component:* Coordinated D3 charts + occupation modal
*Pass/fail:* Student can name the highest cognitive ability for each selected occupation after 30 seconds with the chart

**N2 — RESEARCHER must be able to see employment trend and cognitive demand simultaneously** for a given occupation, when assessing whether AI is displacing a role or rewiring it.
*Component:* Chart 1 (employment) + Charts 2/3 (abilities/skills) coordinated selection
*Pass/fail:* Selecting one occupation updates all three charts in a single interaction

**N3 — PROFESSIONAL must be able to identify where their occupation's cognitive profile sits** relative to the field distribution, when deciding whether to upskill or pivot.
*Component:* CI bands on Charts 2 and 3 (within-field and overall)
*Pass/fail:* CI bands are visible and distinguishable from the occupation's own score dot

**N4 — ALL USERS must be able to filter by industry or occupation category** when they don't know a specific SOC code.
*Component:* Industry/category filter dropdown
*Pass/fail:* Selecting "Computer and Mathematical" returns only occupations from that major group

**N5 — ALL USERS must be able to access full O*NET occupational detail** for any occupation in the chart, without leaving the page.
*Component:* Occupation detail modal
*Pass/fail:* Clicking any occupation opens a modal with tasks, abilities, skills, and knowledge within 2 seconds

**N6 — OPERATOR must be able to update O*NET data** when a new database release ships annually, without touching application code.
*Component:* Admin import route + Vercel Blob upload
*Pass/fail:* A new O*NET release can be imported by uploading one ZIP file in the admin dashboard

**N7 — BUSINESS: The tool must load in the Irreducibly Human brand** — same header, footer, color palette, dark/light mode — so it reads as a curriculum tool.
*Component:* Next.js page using existing layout, `var(--bb-*)` CSS variables
*Pass/fail:* The `/onet` page is visually indistinguishable in brand from `/courses` and `/tools`

---

## /s1 — Core Component Documentation

### Component 1: O*NET Database Import Pipeline
**Maps to:** N1, N2, N3, N4, N5, N6

**The problem it solves:** The O*NET 30.2 flat files (pipe-delimited `.txt`) need to be loaded into Neon PostgreSQL once so the application can query them at runtime.

**How it works:** A Node.js import script reads each O*NET text file from `db_30_2_text/`, parses the tab-delimited rows, and bulk-inserts into Neon in batches of 500. Runs once; re-run when a new O*NET release ships.

**Inputs:** `db_30_2_text/*.txt` files — 40+ files covering occupations, abilities, skills, knowledge, tasks, interests, work styles, work values, related occupations, alternate titles
**Outputs:** Populated Neon tables for all O*NET entities
**Error signals:** Missing file → log and skip. Parse error → log row, continue. Duplicate SOC code → upsert (ON CONFLICT DO UPDATE).
**Retry behavior:** Idempotent — safe to re-run.

**Principle alignment:** Database-First (Principle 1)
**Flow placement:** Administrative Flow — runs before any user-facing page works
**Scope boundary:** Does NOT process BLS data. Script only — no API route.

**Edge cases:**
1. `Recommend Suppress = Y` rows — import but flag; exclude from chart defaults
2. `Not Relevant = Y` rows — import but flag; render as muted dots with tooltip
3. Occupations with `.01`, `.02` sub-specialties — import all; UI groups by base code for BLS join
4. Occupation import must run BEFORE all other tables due to FK constraints — if order is wrong, every ability/skill row fails silently with zero rows inserted

---

### Component 2: BLS Employment Data Import Pipeline
**Maps to:** N2, N6

**The problem it solves:** 13 annual OEWS national XLSX files (2012–2024) need to be parsed and loaded into Neon so Chart 1 can show employment trends over time.

**How it works:** A Node.js script reads each XLSX file using SheetJS, filters to `OCC_GROUP = 'detailed'` and non-suppressed `TOT_EMP`, and upserts into `bls_employment`. A second pass computes `employment_index` using 2018 as the baseline (2018 = 100).

**Inputs:** 13 OEWS national files (`oesm12nat` through `oesm24nat`) — mix of `.xls` (2012–2013) and `.xlsx` (2014–2024)
**Outputs:** Populated `bls_employment` table; `employment_index` computed for all SOC codes with a 2018 baseline
**Error signals:** `TOT_EMP = '**'` (suppressed) → NULL, `is_suppressed = TRUE`. Missing 2018 baseline → NULL index, log warning.
**Retry behavior:** Idempotent upsert on `(soc_code, year)`.

**Principle alignment:** Database-First (Principle 1)
**Flow placement:** Administrative Flow
**Scope boundary:** National data only. Does NOT compute CIs (BLS employment has no CI — only O*NET scores do).

**Edge cases:**
1. 2019→2020 SOC code transition (2010 → 2018 SOC system) — log mismatches; insert NULL for gap years rather than fabricating continuity
2. Computer Programmers (`15-1251`) suppressed in some years — render as gap in chart line, not zero
3. New occupations added after 2018 — no baseline available; store raw employment, skip index computation, display note

---

### Component 3: Neon PostgreSQL Schema
**Maps to:** N1–N6

**Key tables:**
- `onet_occupations` — ~1,000 rows, master occupation list
- `onet_abilities` — ~104,000 rows, ability scores with pre-computed CIs per SOC code
- `onet_skills` — ~70,000 rows
- `onet_ability_stats` — ~2,600 rows, pre-computed cross-occupation means and CIs
- `onet_skill_stats` — ~1,750 rows
- `bls_employment` — ~12,450 rows, annual employment by SOC code with index
- `ai_milestones` — ~15 rows, editorial AI events for Chart 1 annotations

**Principle alignment:** Database-First (Principle 1), Existing Site Architecture (Principle 4)
**Scope boundary:** Does NOT store user sessions or saved comparisons.

**Edge cases:**
1. SOC code format mismatch — O*NET uses `15-1252.00`, BLS uses `15-1252`; `soc_code_bls` column stores the BLS format for joins
2. Both `IM` (Importance) and `LV` (Level) scales stored per ability per occupation; UI defaults to `LV`
3. `onet_ability_stats` pre-computed at import time — never computed at query time; recomputed when O*NET data refreshes

---

### Component 4: `/api/onet/search` Route
**Maps to:** N1, N2, N3, N4, N5

**How it works:** `GET /api/onet/search?q={query}&limit={n}` — full-text search against occupation titles, descriptions, and alternate titles using PostgreSQL `to_tsvector`. If query matches SOC code pattern, exact match runs first.

**Inputs:** Query string (min 2 chars), optional limit (default 10, max 20)
**Outputs:** `[{ soc_code, title, description_excerpt, job_zone, major_group_name }]`
**Error signals:** Empty query → 400. No results → 200 with empty array.

**Edge cases:**
1. Query matches SOC code pattern (e.g., "15-1252") → exact match before text search
2. Occupations with identical titles at different sub-codes → return all, disambiguate by description

---

### Component 5: `/api/onet/employment` Route
**Maps to:** N2

**How it works:** `GET /api/onet/employment?soc={code1,code2,...}` — returns annual employment index for each SOC code 2012–2026, plus AI milestone annotations.

**Inputs:** Comma-separated SOC codes (max 5)
**Outputs:** `{ series: [{ soc_code, title, data: [{ year, employment_index, is_projected }] }], milestones: [...] }`
**Error signals:** Invalid SOC code → skip. All invalid → 400.

**Edge cases:**
1. SOC code with no 2018 baseline — return raw employment, omit index, include flag
2. Suppressed years — return `null`; D3 renders as gap using `.defined()`
3. All 5 codes in single SQL query with `WHERE soc_code = ANY($1)`

---

### Component 6: `/api/onet/abilities` Route
**Maps to:** N1, N3

**How it works:** `GET /api/onet/abilities?soc={codes}&scale={LV|IM}&category={cognitive|all}` — returns per-occupation ability scores with CI bounds, plus pre-computed overall mean and field mean from `onet_ability_stats`.

**Inputs:** SOC codes, scale, category filter
**Outputs:** `{ abilities: [{ element_id, element_name, category, occupations: [...], overall: {...}, field: {...} }] }`

**Principle alignment:** CIs Are First-Class Data (Principle 3)
**Edge cases:**
1. `suppress = true` rows excluded from stats computation and from occupation scores
2. `not_relevant = true` returned with flag; UI renders as open circle with tooltip
3. Overall/field mean pre-computed at import; never computed at query time

---

### Component 7: `/api/onet/skills` Route
**Maps to:** N1, N3

Identical structure to Component 6, querying `onet_skills` and `onet_skill_stats`. 35 skills across 6 categories (basic, social, complex, technical, systems, resource).

---

### Component 8: `/api/onet/occupation/[soc]` Route
**Maps to:** N5

**How it works:** `GET /api/onet/occupation/15-1252.00` — returns full O*NET profile for one occupation. All 10 sub-queries run in `Promise.all`: occupation metadata, tasks, abilities, skills, knowledge, interests, work styles, related occupations, alternate titles, BLS employment (last 3 years).

**Error signals:** SOC code not found → 404.

**Edge cases:**
1. Sub-specialty codes (`15-1252.01`) — return that specific occupation's data
2. Large response payload — tasks + all abilities + all skills; paginate tasks if > 20

---

### Component 9: `app/onet/page.tsx` — Server Component
**Maps to:** N7

Server component. Pre-loads default comparison (Software Developers + Computer Programmers). Passes initial props to `OnetExplorer`. Sets SEO metadata. Uses existing `lib/db.ts`.

**Error signals:** DB unavailable → renders page with empty state, never crashes.

---

### Component 10: `app/onet/OnetExplorer.tsx` — Client Component
**Maps to:** N1–N5, N7

Client component (`'use client'`). Manages all interactive state: selected occupations (max 5), active chart tab, category filter, scale selector, modal state. On occupation change, fetches all three API routes in parallel via `Promise.all`.

**Edge cases:**
1. 6th occupation attempted — button disabled, tooltip "Maximum 5 occupations"
2. Rapid selection changes — 300ms debounce
3. Color assignment — fixed 5-color palette from BB color system

---

### Component 11: D3 Chart 1 — Employment Index
**Maps to:** N2

Horizontal line chart. X: year (2012–2026). Y: employment index (0–150). Solid lines for actual data, dashed for projections. Vertical dotted line at 2024/2025 boundary. AI milestone annotations along x-axis with hover tooltips. Gaps in line for suppressed years via `d3.line().defined()`.

---

### Component 12: D3 Chart 2 — Ability Profiles
**Maps to:** N1, N3

Horizontal dot plot with CI whiskers. Y: ability name (sorted by overall mean). X: LV score 0–7 (fixed scale). Per-occupation colored dots with CI whiskers. Two background bands: overall mean CI (light gray) and field mean CI (medium gray). Category section headers between cognitive/psychomotor/physical/sensory groups. `not_relevant` occupations rendered as open circles.

**Principle alignment:** CIs Are First-Class Data (Principle 3)

---

### Component 13: D3 Chart 3 — Skill Profiles
**Maps to:** N1, N3

Identical structure to Chart 2. 35 skills. Category filter: basic, social, complex, technical, systems, resource.

---

### Component 14: Occupation Detail Modal
**Maps to:** N5

shadcn/ui Dialog. Opens on occupation click. Lazy-fetches `/api/onet/occupation/[soc]`. Sections: title, SOC code, job zone badge, description, tasks (5 shown + expand), abilities top 10, skills top 10, knowledge top 10, related occupations as chips, link to onet.org.

---

### Component 15: Industry/Category Filter
**Maps to:** N4

Collapsible filter panel. Dropdown of O*NET major occupation groups (2-digit SOC). Selecting a filter scopes search results and updates the "field mean" CI band reference group in Charts 2 and 3.

---

### Component 16: Admin Import Route
**Maps to:** N6

New tab in existing admin dashboard. "Import O*NET Data" and "Import BLS Employment Data" buttons. Triggers import pipelines against files uploaded to Vercel Blob. Returns import summary. Idempotent.

---

### Component Map to User Needs

| Component | N1 | N2 | N3 | N4 | N5 | N6 | N7 |
|-----------|----|----|----|----|----|----|-----|
| 1. O*NET Import | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 2. BLS Import | | ✓ | | | | ✓ | |
| 3. Neon Schema | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| 4. Search Route | ✓ | ✓ | ✓ | ✓ | ✓ | | |
| 5. Employment Route | | ✓ | | | | | |
| 6. Abilities Route | ✓ | ✓ | ✓ | | | | |
| 7. Skills Route | ✓ | ✓ | ✓ | | | | |
| 8. Occupation Route | ✓ | | | | ✓ | | |
| 9. Page Component | | | | | | | ✓ |
| 10. OnetExplorer | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ |
| 11. Chart 1 | | ✓ | | | | | |
| 12. Chart 2 | ✓ | ✓ | ✓ | | | | |
| 13. Chart 3 | ✓ | ✓ | ✓ | | | | |
| 14. Modal | ✓ | | | | ✓ | | |
| 15. Filter | | | | ✓ | | | |
| 16. Admin Import | | | | | | ✓ | |

---

## /claude — Boondoggle Score

**System:** O*NET Job Trend Analyzer
**SDD Completion:** V0–V4, S1, S3 complete
**Score generated:** 2026-05-14
**Team Claude fluency:** Level I

---

**STEP 1 · PHASE F · HUMAN TASK**
[PF] Problem Formulation: Run the full schema SQL from S3 in Neon SQL Editor. Verify all 17 tables exist.
*Handoff condition:* All 17 tables present with RLS enabled. Zero errors.

---

**STEP 2 · PHASE F · CLAUDE TASK**
Context: DATABASE_URL, BLS folder path, S3 data flow documentation.

```
I need a Node.js import script that processes 13 years of BLS OEWS
national employment data into a Neon PostgreSQL database.

DATABASE SETUP:
- Neon PostgreSQL, connection via DATABASE_URL environment variable
- Target table: bls_employment with columns:
  soc_code TEXT, year INTEGER, employment INTEGER,
  employment_index NUMERIC(8,2), is_projected BOOLEAN,
  is_suppressed BOOLEAN, source TEXT, occ_title TEXT, occ_group TEXT
- Upsert on UNIQUE(soc_code, year)

INPUT FILES:
- oesm12nat/national_M2012_dl.xls through oesm24nat/national_M2024_dl.xlsx
- Mix of .xls and .xlsx — use SheetJS
- Filter: OCC_GROUP = 'detailed'
- TOT_EMP = '**' → NULL, is_suppressed = TRUE
- TOT_EMP may have commas → strip, parse as integer

PROCESSING:
1. Extract year from filename
2. soc_code = OCC_CODE as-is (BLS format: '15-1252')
3. After all years loaded, compute employment_index:
   (employment / 2018_baseline) * 100
   If no 2018 row → NULL. If employment NULL → NULL.
4. source = 'OEWS_' + year

OUTPUT: scripts/import-bls.mjs (ES module)
Uses: xlsx, @neondatabase/serverless, dotenv
Takes BLS_DIR as environment variable.
Logs progress per year. Idempotent. No explanation needed.
```

*Handoff condition:* `node --check scripts/import-bls.mjs` passes.

---

**STEP 3 · PHASE F · HUMAN TASK**
[PA] Plausibility Auditing: Read the BLS import script before running it against the live database. Verify: OCC_GROUP filter present, both .xls/.xlsx handled, employment_index computed after all years loaded (not per-row), upsert uses ON CONFLICT, DATABASE_URL from env not hardcoded.

*Handoff condition:* All five structural checks pass.

---

**STEP 4 · PHASE F · HUMAN TASK**
[TO] Tool Orchestration: Run the BLS import script. Verify in Neon: ~830 rows per year, 2012–2024. `employment_index` populated for majority of occupations for 2019–2024.

*Handoff condition:* `bls_employment` has 10,000–12,000 rows. Index computed for most 2019–2024 rows.

---

**STEP 5 · PHASE F · CLAUDE TASK**
Context: db_30_2_text folder path, DATABASE_URL.

```
I need a Node.js import script that loads the O*NET 30.2 database
from tab-delimited text files into Neon PostgreSQL.

[Full prompt as delivered in Minion Brief — paste from onet-minion-brief.md Step 5]

OUTPUT: scripts/import-onet.mjs
Idempotent. Process occupations FIRST (FK constraint). No explanation.
```

*Handoff condition:* `node --check` passes. Occupation import runs before all FK-dependent tables.

---

**STEP 6 · PHASE F · HUMAN TASK**
[PA] Plausibility Auditing: Read the O*NET import script. Verify: `Occupation Data.txt` imported FIRST, category derived from element_id prefix, `recommend_suppress` mapped correctly, `not_relevant` handles all three values ('Y'/'N'/'n/a'), occupation `11-1011.00` maps to major_group_code '11'.

*Handoff condition:* All five structural checks pass.

---

**STEP 7 · PHASE F · HUMAN TASK**
[TO] Tool Orchestration: Run the O*NET import. Verify row counts: occupations ~1,000, abilities ~104,000, skills ~70,000, tasks ~10,000.

*Handoff condition:* Row counts match expected ranges. No FK violation errors.

---

**STEP 8 · PHASE F · CLAUDE TASK**
Context: DATABASE_URL, confirmation Steps 4 and 7 complete.

```
I need a Node.js script that computes cross-occupation statistics
for abilities and skills and stores them in pre-computed stats tables.

[Full prompt as delivered in Minion Brief — paste from onet-minion-brief.md Step 8]

OUTPUT: scripts/compute-stats.mjs
Uses SQL AVG(), STDDEV(), COUNT() aggregations — not JavaScript loops.
Idempotent: TRUNCATE both stats tables before recomputing. No explanation.
```

*Handoff condition:* Script uses SQL aggregation, not JavaScript row-by-row. `node --check` passes.

---

**STEP 9 · PHASE F · HUMAN TASK**
[TO] Tool Orchestration: Run stats computation. Verify `onet_ability_stats` has three group_type categories. Oral Comprehension overall mean between 3.0–4.5. Seed AI milestones SQL in Neon SQL Editor (12 rows: Transformer 2017 through Claude 3.5 2025).

*Handoff condition:* Stats tables populated. 12 milestone rows present. Oral Comprehension mean plausible.

---

**STEP 10 · PHASE F · HUMAN TASK**
[IJ] Interpretive Judgment: Review the 12 seeded AI milestones. Decide which events best illustrate the programmer collapse story for the Irreducibly Human audience. Are the labels factual and appropriately framed for graduate students — not hype, not fear? The November 2022 ChatGPT annotation is the most important. Does its label text make the argument visible?

*Handoff condition:* You have reviewed and approved the milestone set. This decision cannot be delegated.

---

**STEP 11 · PHASE C · CLAUDE TASK**
Context: Paste existing `lib/db.ts`.

```
[Full prompt as delivered in Minion Brief — Step 11]
Creates: app/api/onet/search/route.ts and app/api/onet/employment/route.ts
```

*Handoff condition:* Both files compile. Search handles SOC code pattern match before text search.

---

**STEP 12 · PHASE C · CLAUDE TASK**
Context: Paste employment route from Step 11.

```
[Full prompt as delivered in Minion Brief — Step 12]
Creates: app/api/onet/abilities/route.ts and app/api/onet/skills/route.ts
```

*Handoff condition:* Both compile. Abilities route fetches major group stats for first requested SOC.

---

**STEP 13 · PHASE C · CLAUDE TASK**
Context: Paste employment route as pattern reference.

```
[Full prompt as delivered in Minion Brief — Step 13]
Creates: app/api/onet/occupation/[soc]/route.ts
10 queries in Promise.all. Returns 404 for unknown SOC codes.
```

*Handoff condition:* Uses `Promise.all`. Returns 404 for unknown codes.

---

**STEP 14 · PHASE C · HUMAN TASK**
[PA] Plausibility Auditing: Test all four API routes before any UI is built.

1. `/api/onet/search?q=software+developer` → Software Developers near top
2. `/api/onet/search?q=15-1251` → Computer Programmers as first result (exact SOC match)
3. `/api/onet/employment?soc=15-1252,15-1251` → Two series, Computer Programmers index visibly below 100 for 2019+, Software Developers visibly above 100
4. `/api/onet/abilities?soc=15-1252&scale=LV&category=cognitive` → ~14 abilities with CI bounds and overall stats
5. `/api/onet/occupation/15-1252.00` → Large object with title, tasks, abilities sorted by score

**Do not proceed to UI build until all 5 tests pass.**

*Handoff condition:* Computer Programmers employment index visibly declining. Software Developers visibly rising. Abilities route returns CI data.

---

**STEP 15 · PHASE B · CLAUDE TASK**
Context: Paste employment API response JSON. Attach reference chart image (Programmer vs Developer).

```
[Full prompt as delivered in Minion Brief — Step 15]
Creates: app/onet/charts/EmploymentChart.tsx
```

*Handoff condition:* Component handles null employment_index via .defined(). No TypeScript errors.

---

**STEP 16 · PHASE B · CLAUDE TASK**
Context: Paste box-whisker.html from D3 pantry. Paste abilities API response.

```
[Full prompt as delivered in Minion Brief — Step 16]
Creates: app/onet/charts/ProfileChart.tsx
```

*Handoff condition:* Background CI bands render before dots. `not_relevant` shows as open circles. Category headers between sections.

---

**STEP 17 · PHASE B · HUMAN TASK**
[PA] Plausibility Auditing: Build a temporary test page rendering both charts with real API data. Verify Employment chart shows diverging lines with ChatGPT annotation. Verify Profile chart shows per-occupation dots with gray CI background bands and category headers. Flag blockers: identical lines (index computation error), no annotations (milestones not seeded), all dots at same x position (scale error), missing background bands (render order error).

*Handoff condition:* Both charts render with plausible data. Programmer collapse narrative visible in Chart 1.

---

**STEP 18 · PHASE B · CLAUDE TASK**
Context: Paste existing `app/page.tsx`. Paste `components/Header/Header.tsx`. Include any fix notes from Step 17.

```
[Full prompt as delivered in Minion Brief — Step 18]
Creates: app/onet/page.tsx, app/onet/OnetExplorer.tsx, app/onet/OccupationModal.tsx
```

*Handoff condition:* Page renders at /onet. Search works. Occupation selection updates all three charts.

---

**STEP 19 · PHASE B · HUMAN TASK**
[EI] Executive Integration: Run this test sequence as the Irreducibly Human audience.

1. Select Software Developers + Computer Programmers
2. Look at Chart 1: does it tell the Irreducibly Human story — Tier 1 declining, Tier 2 growing, ChatGPT as the inflection?
3. Look at Chart 2 Cognitive filter: can a graduate student understand the cognitive difference between the two roles?
4. Open the Software Developers modal: is it sufficient for someone deciding whether to study this field?
5. Add Data Scientist as a third occupation: do all three charts update coherently?

Write down purpose failures (not polish issues). Purpose failures go back to Claude. Polish issues go into v2 backlog.

*Handoff condition:* Written list of purpose failures vs. polish issues. You own this evaluation.

---

**STEP 20 · PHASE H · CLAUDE TASK**
Context: Purpose failure list from Step 19.

```
Fix these specific issues in the O*NET Job Trend Analyzer:
[PASTE purpose failure list]
Minimal targeted changes only. Return only the changed files.
No explanation.
```

*Handoff condition:* Each purpose failure resolved. Re-run Step 19 test sequence to confirm.

---

**STEP 21 · PHASE H · CLAUDE TASK**
Context: Paste current `app/sitemap.ts` and `components/Header/Header.tsx`.

```
Add /onet to the sitemap (changeFrequency monthly, priority 0.8).
Add 'O*NET' to the nav between 'Tools' and 'About'.
Return only the two modified files. No explanation.
```

*Handoff condition:* /onet in sitemap. Nav shows O*NET link.

---

**STEP 22 · PHASE H · HUMAN TASK**
[PA] Plausibility Auditing: Run Lighthouse on /onet (target ≥ 70). Verify color contrast for 5 occupation colors against parchment background (WCAG AA). Tab through page with keyboard. Check dark mode. Run `npm run build`.

*Handoff condition:* Lighthouse ≥ 70. No WCAG AA failures. Build succeeds.

---

**STEP 23 · PHASE R · HUMAN TASK**
[IJ] Interpretive Judgment: Read the page as a prospective graduate student arriving without context. Does the default state (Software Developers vs. Computer Programmers pre-loaded) make the Irreducibly Human argument visible without configuration? Is data attribution (O*NET, BLS) clear? Does the page connect to a course, concept, or reading?

Add an introductory paragraph if needed. This is editorial — Claude cannot supply it. Push to main.

*Handoff condition:* A student landing on /onet without context understands what they are looking at and why it matters.

---

**SCORE SUMMARY**

Total steps: 23
Claude tasks: 11 (48%)
Human tasks: 12 (52%)

**Critical path:** Steps 1 → 2 → 4 → 7 → 8 → 9 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20 → 22 → 23

**Highest-risk handoffs:**

1. **Step 14 — API verification before UI build.** Risk: employment_index computation failed silently (both lines show 100.0 for all years) or abilities route returns empty due to FK constraint during import. If not caught here, charts render with wrong data invisibly.

2. **Step 7 — O*NET import FK order.** Risk: if import script processes Abilities.txt before Occupation Data.txt, every ability row fails with a foreign key violation. Log shows "0 rows inserted" for abilities with no obvious error message.

3. **Step 19 — Purpose test before hardening.** Risk: tool passes all technical tests but fails the actual use case — the employment chart doesn't tell the programmer collapse story clearly enough for a graduate student without context. Technical correctness is not communicative success.

**Supervisory capacity distribution:**
- [PA] Plausibility Auditing: 5 steps (3, 6, 14, 17, 22)
- [PF] Problem Formulation: 1 step (1)
- [TO] Tool Orchestration: 4 steps (4, 7, 9, 21)
- [IJ] Interpretive Judgment: 2 steps (10, 23)
- [EI] Executive Integration: 1 step (19)

---

*End of Part 1 — SDD*

---

# PART 2 — THE BOONDOGGLE REFLECTION

*[To be written by student — 600–900 words across four prompts]*

*Prompt A: Supervisory Capacity Distribution Analysis (150–200 words)*

*Prompt B: The Hardest Handoff (150–200 words)*

*Prompt C: Where Gru Was Right and Where You Disagreed (150–200 words)*

*Prompt D: The Solve-Verify Asymmetry Applied (150–200 words)*
