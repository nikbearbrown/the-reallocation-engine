# MINION BRIEF
**System:** O*NET Job Trend Analyzer (irreduciblyhuman.xyz/onet)
**Claude fluency:** Level I — copy-paste one prompt at a time

---

## STEP 2 · PHASE F · BLS Import Script

Context: Run this after Step 1 (schema created in Neon) and after Step 4 (tables verified).

---
I need a Node.js import script that processes 13 years of BLS OEWS
national employment data into a Neon PostgreSQL database.

DATABASE SETUP:
- Neon PostgreSQL, connection via DATABASE_URL environment variable
- Target table: bls_employment with columns:
  soc_code TEXT, year INTEGER, employment INTEGER,
  employment_index NUMERIC(8,2), is_projected BOOLEAN,
  is_suppressed BOOLEAN, source TEXT, occ_title TEXT, occ_group TEXT
- Upsert on UNIQUE(soc_code, year)

INPUT FILES (all in the same BLS directory):
- oesm12nat/national_M2012_dl.xls  through
  oesm24nat/national_M2024_dl.xlsx
  (mix of .xls and .xlsx formats — use SheetJS to handle both)
- Each file has columns including: OCC_CODE, OCC_TITLE, OCC_GROUP, TOT_EMP
- Filter to rows where OCC_GROUP = 'detailed'
- TOT_EMP = '**' means suppressed → store NULL, set is_suppressed = TRUE
- TOT_EMP may have commas (e.g. '1,365,500') → strip commas, parse as integer

PROCESSING RULES:
1. Extract year from filename (e.g. 'national_M2018_dl.xlsx' → 2018)
2. For each row: soc_code = OCC_CODE as-is (BLS format e.g. '15-1252')
3. After all years loaded, compute employment_index:
   For each soc_code, find its 2018 employment as baseline.
   employment_index = (employment / baseline_2018) * 100
   If no 2018 row exists for that soc_code, leave employment_index NULL.
   If employment is NULL (suppressed), leave employment_index NULL.
4. source = 'OEWS_' + year (e.g. 'OEWS_2024')

OUTPUT:
- A single script file: scripts/import-bls.mjs (ES module)
- Uses: xlsx (SheetJS), @neondatabase/serverless, dotenv
- Takes BLS_DIR as environment variable pointing to the folder
- Logs progress: "Processing 2018... 832 rows inserted"
- Logs warnings for suppressed rows and missing 2018 baselines
- Idempotent: safe to re-run (upsert throughout)
- At the end: prints summary of rows per year and count of
  soc_codes with no 2018 baseline

Do not add the 2025-2026 projections — that is a separate script.
Write the complete script. No explanation needed.
---

Handoff condition: `node --check scripts/import-bls.mjs` passes.
Depends on: Step 1 (tables exist).

---

## STEP 5 · PHASE F · O*NET Import Script

Context: Run this after Step 1 (schema created). Can run in parallel with Step 2.

---
I need a Node.js import script that loads the O*NET 30.2 database
from pipe-delimited text files into Neon PostgreSQL.

DATABASE TABLES (all already exist — use upsert throughout):
- onet_occupations (soc_code PK, soc_code_bls, title, description,
  job_zone, major_group_code, major_group_name)
- onet_abilities (soc_code FK, element_id, element_name, category,
  subcategory, scale_id, data_value, n, standard_error, lower_ci,
  upper_ci, recommend_suppress, not_relevant, date_updated, domain_source)
  UNIQUE(soc_code, element_id, scale_id)
- onet_skills (same structure as onet_abilities)
  UNIQUE(soc_code, element_id, scale_id)
- onet_knowledge (same structure)
  UNIQUE(soc_code, element_id, scale_id)
- onet_work_activities (same structure)
  UNIQUE(soc_code, element_id, scale_id)
- onet_tasks (soc_code FK, task_id, task_text, task_type,
  incumbents_responding, date_updated, domain_source)
  UNIQUE(soc_code, task_id)
- onet_interests (soc_code FK, element_id, element_name,
  scale_id, data_value, date_updated, domain_source)
  UNIQUE(soc_code, element_id, scale_id)
- onet_work_styles (soc_code FK, element_id, element_name,
  scale_id, data_value, date_updated, domain_source)
  UNIQUE(soc_code, element_id, scale_id)
- onet_work_values (same structure as work_styles)
  UNIQUE(soc_code, element_id, scale_id)
- onet_related_occupations (soc_code FK, related_soc_code,
  relatedness_tier, rank_index)
  UNIQUE(soc_code, related_soc_code)
- onet_alternate_titles (soc_code FK, alternate_title, short_title)
  UNIQUE(soc_code, alternate_title)

SOURCE FILES (all tab-delimited, in ONET_DIR environment variable):
- "Occupation Data.txt" → onet_occupations
  Columns: O*NET-SOC Code, Title, Description
  Derive: soc_code_bls = strip '.XX' suffix
  Derive: major_group_code = first 2 chars of soc_code
  Derive: major_group_name from this lookup:
    '11'→'Management', '13'→'Business and Financial Operations',
    '15'→'Computer and Mathematical', '17'→'Architecture and Engineering',
    '19'→'Life Physical and Social Science', '21'→'Community and Social Service',
    '23'→'Legal', '25'→'Educational Instruction and Library',
    '27'→'Arts Design Entertainment Sports and Media',
    '29'→'Healthcare Practitioners and Technical',
    '31'→'Healthcare Support', '33'→'Protective Service',
    '35'→'Food Preparation and Serving',
    '37'→'Building and Grounds Cleaning and Maintenance',
    '39'→'Personal Care and Service', '41'→'Sales and Related',
    '43'→'Office and Administrative Support',
    '45'→'Farming Fishing and Forestry',
    '47'→'Construction and Extraction',
    '49'→'Installation Maintenance and Repair',
    '51'→'Production', '53'→'Transportation and Material Moving'

- "Abilities.txt" → onet_abilities
  Columns: O*NET-SOC Code, Element ID, Element Name, Scale ID,
    Data Value, N, Standard Error, Lower CI Bound, Upper CI Bound,
    Recommend Suppress, Not Relevant, Date, Domain Source
  Derive category from element_id prefix:
    '1.A.1' → 'cognitive'
    '1.A.2' → 'psychomotor'
    '1.A.3' → 'physical'
    '1.A.4' → 'sensory'
  Derive subcategory from element_id second level:
    '1.A.1.a' → 'verbal', '1.A.1.b' → 'idea_generation',
    '1.A.1.c' → 'quantitative', '1.A.1.d' → 'memory',
    '1.A.1.e' → 'perceptual', '1.A.1.f' → 'spatial',
    '1.A.1.g' → 'attentiveness'
  recommend_suppress: 'Y' → TRUE, else FALSE
  not_relevant: 'Y' → TRUE, 'N' → FALSE, 'n/a' → NULL

- "Skills.txt" → onet_skills (same column structure as Abilities.txt)
  Derive category from element_id:
    '2.A.1' → 'basic', '2.B.1' → 'social',
    '2.B.2' → 'complex', '2.B.3' → 'technical',
    '2.B.4' → 'systems', '2.B.5' → 'resource'

- "Knowledge.txt" → onet_knowledge (same structure)
- "Work Activities.txt" → onet_work_activities (same structure)

- "Task Statements.txt" → onet_tasks
  Columns: O*NET-SOC Code, Task ID, Task, Task Type,
    Incumbents Responding, Date, Domain Source

- "Interests.txt" → onet_interests
  Columns: O*NET-SOC Code, Element ID, Element Name,
    Scale ID, Data Value, Date, Domain Source

- "Work Styles.txt" → onet_work_styles (same as Interests)
- "Work Values.txt" → onet_work_values (same as Interests)

- "Related Occupations.txt" → onet_related_occupations
  Columns: O*NET-SOC Code, Related O*NET-SOC Code,
    Relatedness Tier, Index

- "Alternate Titles.txt" → onet_alternate_titles
  Columns: O*NET-SOC Code, Alternate Title, Short Title, Source(s)
  (ignore Sources column)

JOB ZONES: Read from "Job Zones.txt" (columns: O*NET-SOC Code, Job Zone)
and use to populate job_zone on onet_occupations.

PROCESSING RULES:
- All files are tab-delimited with a header row
- Skip rows where O*NET-SOC Code is empty or starts with '#'
- All upserts: ON CONFLICT DO UPDATE SET all non-key columns
- Process in this order: occupations first, then everything else
  (FK constraint on soc_code)
- Batch inserts in chunks of 500 rows for performance
- Log: "Importing Abilities.txt... 104000 rows"

OUTPUT: scripts/import-onet.mjs
Uses: @neondatabase/serverless, dotenv, fs/promises, path
Takes ONET_DIR as environment variable.
Idempotent. No explanation needed. Write the complete script.
---

Handoff condition: `node --check scripts/import-onet.mjs` passes. Occupation import runs before all FK-dependent tables.
Depends on: Step 1 (tables exist).

---

## STEP 8 · PHASE F · Stats Computation Script

Context: Run after Steps 4 and 7 (both bls_employment and onet_abilities populated).

---
I need a Node.js script that computes cross-occupation statistics
for abilities and skills in a Neon PostgreSQL database and stores
them in pre-computed stats tables.

SOURCE TABLES (already populated):
- onet_abilities: soc_code, element_id, element_name, scale_id,
  data_value, recommend_suppress, category
- onet_skills: same structure
- onet_occupations: soc_code, major_group_code, job_zone

TARGET TABLES (already exist, truncate and repopulate):
- onet_ability_stats: element_id, element_name, scale_id,
  group_type TEXT, group_code TEXT, mean_value NUMERIC(6,3),
  ci_lower NUMERIC(6,3), ci_upper NUMERIC(6,3),
  occupation_count INTEGER
  UNIQUE(element_id, scale_id, group_type, group_code)

- onet_skill_stats: identical structure

COMPUTATION:
For each unique (element_id, scale_id) combination:
  Exclude rows where recommend_suppress = TRUE or data_value IS NULL.

  1. group_type='overall', group_code='all':
     mean = AVG(data_value)
     ci_lower = mean - 1.96 * STDDEV(data_value) / SQRT(COUNT(*))
     ci_upper = mean + 1.96 * STDDEV(data_value) / SQRT(COUNT(*))
     occupation_count = COUNT(*)

  2. group_type='major_group', group_code=major_group_code:
     Same computation, grouped by onet_occupations.major_group_code.
     JOIN onet_abilities → onet_occupations ON soc_code.
     Only compute if occupation_count >= 5 (suppress small groups).

  3. group_type='job_zone', group_code=CAST(job_zone AS TEXT):
     Same computation grouped by job_zone (1-5).
     Only compute if occupation_count >= 5.

Run same computation for onet_skill_stats from onet_skills.

Use a single SQL query per group_type (not row-by-row in JavaScript).
Log: "Computing ability stats (overall)... 104 rows"
Log: "Computing ability stats (major_group)... 1820 rows"

OUTPUT: scripts/compute-stats.mjs
Idempotent: TRUNCATE both stats tables before recomputing.
No explanation needed. Write the complete script.
---

Handoff condition: Script uses SQL `AVG()`, `STDDEV()`, `COUNT()` — not JavaScript loops. `node --check` passes.
Depends on: Steps 4 and 7 complete.

---

## STEP 11 · PHASE C · Search + Employment API Routes

Context: Paste your existing `lib/db.ts` where indicated. Run after Steps 1, 7, 9.

---
I am building a Next.js App Router page at /onet for the
Irreducibly Human site (irreduciblyhuman.xyz). The site uses:
- Next.js App Router
- Neon PostgreSQL via @neondatabase/serverless
- Existing db client at lib/db.ts (pasted below): [PASTE lib/db.ts]
- TypeScript
- Tailwind CSS

Create two files:

FILE 1: app/api/onet/search/route.ts
GET /api/onet/search?q={query}&limit={n}

Query the onet_occupations table. The table has:
soc_code TEXT PK, title TEXT, description TEXT,
job_zone INTEGER, major_group_code TEXT, major_group_name TEXT

Logic:
- If q is empty or < 2 chars: return 400
- If q matches SOC code pattern (/^\d{2}-\d{4}/): exact match on soc_code first
- Otherwise: full-text search using to_tsvector against title + description
  Also search onet_alternate_titles.alternate_title (JOIN)
  Return distinct occupations
- limit: default 10, max 20
- Return: [{ soc_code, title, description_excerpt (first 120 chars), job_zone, major_group_name }]

FILE 2: app/api/onet/employment/route.ts
GET /api/onet/employment?soc={code1,code2,...}

Query bls_employment and ai_milestones. Tables:
bls_employment: soc_code, year, employment, employment_index,
  is_projected, is_suppressed
onet_occupations: soc_code, soc_code_bls, title
ai_milestones: year, month, label, description, display_on_chart

Logic:
- Parse soc param as comma-separated list, max 5
- For BLS, soc codes may be in BLS format ('15-1252') or O*NET format ('15-1252.00')
  Normalize: strip '.XX' suffix if present before querying bls_employment
- Query: SELECT b.soc_code, b.year, b.employment, b.employment_index,
         b.is_projected, b.is_suppressed, o.title
  FROM bls_employment b
  JOIN onet_occupations o ON o.soc_code_bls = b.soc_code
  WHERE b.soc_code = ANY($1)
  ORDER BY b.soc_code, b.year
- Also query all milestones WHERE display_on_chart = TRUE ORDER BY year
- Return:
  {
    series: [{
      soc_code: string,
      title: string,
      data: [{ year, employment, employment_index, is_projected, is_suppressed }]
    }],
    milestones: [{ year, month, label, description }]
  }
- If a soc_code has no BLS data: omit from series (do not error)

Both routes use the existing lib/db.ts sql client.
Both routes handle DB errors: catch → return 500 with { error: 'Database error' }.
TypeScript throughout. No explanation needed.
---

Handoff condition: Both files compile (`tsc --noEmit`). No hardcoded credentials.
Depends on: Steps 1, 7, 9 complete.

---

## STEP 12 · PHASE C · Abilities + Skills API Routes

Context: Paste the employment route from Step 11 as the pattern reference. Run after Step 11.

---
Add two more API routes to my Next.js App Router O*NET application.

EXISTING PATTERN: [paste the employment route from Step 11 as reference]

FILE 1: app/api/onet/abilities/route.ts
GET /api/onet/abilities?soc={codes}&scale={LV|IM}&category={cognitive|psychomotor|physical|sensory|all}

Tables:
- onet_abilities: soc_code, element_id, element_name, category,
  subcategory, scale_id, data_value, lower_ci, upper_ci, n,
  recommend_suppress, not_relevant
- onet_ability_stats: element_id, element_name, scale_id,
  group_type, group_code, mean_value, ci_lower, ci_upper, occupation_count
- onet_occupations: soc_code, major_group_code

Logic:
- Parse soc as comma-separated, max 5. Normalize to O*NET format (add '.00' if missing)
- scale defaults to 'LV'
- category filter: if not 'all', add WHERE category = $category
- Query 1: per-occupation scores
  SELECT a.soc_code, a.element_id, a.element_name, a.category,
         a.subcategory, a.data_value, a.lower_ci, a.upper_ci, a.n,
         a.recommend_suppress, a.not_relevant
  FROM onet_abilities a
  WHERE a.soc_code = ANY($soc_codes) AND a.scale_id = $scale
  [AND a.category = $category if not 'all']
  ORDER BY a.element_id

- Query 2: stats for relevant elements
  Get major_group_codes for the requested soc_codes first.
  SELECT s.element_id, s.group_type, s.group_code,
         s.mean_value, s.ci_lower, s.ci_upper, s.occupation_count
  FROM onet_ability_stats s
  WHERE s.element_id IN (list from Query 1)
    AND s.scale_id = $scale
    AND (
      (s.group_type = 'overall' AND s.group_code = 'all')
      OR (s.group_type = 'major_group' AND s.group_code = ANY($major_groups))
    )

- Shape response:
  {
    abilities: [{
      element_id, element_name, category, subcategory,
      occupations: [{ soc_code, data_value, lower_ci, upper_ci, n,
                      recommend_suppress, not_relevant }],
      overall: { mean_value, ci_lower, ci_upper, occupation_count },
      field: { mean_value, ci_lower, ci_upper, occupation_count } | null
    }]
  }
  (field is the major_group stat for the first requested occupation's group)

FILE 2: app/api/onet/skills/route.ts
Identical pattern to abilities route but queries onet_skills and onet_skill_stats.
Category values: 'basic'|'social'|'complex'|'technical'|'systems'|'resource'|'all'

No explanation. Complete TypeScript files only.
---

Handoff condition: Both compile. Abilities route fetches stats for the major group of the first requested SOC code. Skills route is structurally identical.
Depends on: Step 11 complete.

---

## STEP 13 · PHASE C · Occupation Modal API Route

Context: Paste the employment route from Step 11 as pattern reference.

---
Add one more API route: app/api/onet/occupation/[soc]/route.ts

GET /api/onet/occupation/15-1252.00
(dynamic route — soc param from URL)

Normalize the soc param: if it doesn't contain '.', append '.00'

Run these queries in parallel (Promise.all):
1. Occupation: SELECT * FROM onet_occupations WHERE soc_code = $1
2. Tasks: SELECT task_id, task_text, task_type, incumbents_responding
   FROM onet_tasks WHERE soc_code = $1
   ORDER BY task_type DESC, incumbents_responding DESC NULLS LAST
3. Abilities (LV scale only, exclude recommend_suppress=true):
   SELECT element_id, element_name, category, data_value, lower_ci, upper_ci
   FROM onet_abilities WHERE soc_code = $1 AND scale_id = 'LV'
   AND recommend_suppress = FALSE ORDER BY data_value DESC
4. Skills (LV scale, same filter):
   SELECT element_id, element_name, category, data_value, lower_ci, upper_ci
   FROM onet_skills WHERE soc_code = $1 AND scale_id = 'LV'
   AND recommend_suppress = FALSE ORDER BY data_value DESC
5. Knowledge (IM scale):
   SELECT element_id, element_name, data_value
   FROM onet_knowledge WHERE soc_code = $1 AND scale_id = 'IM'
   ORDER BY data_value DESC LIMIT 15
6. Interests (OI scale only):
   SELECT element_id, element_name, data_value
   FROM onet_interests WHERE soc_code = $1 AND scale_id = 'OI'
7. Work styles (WI scale):
   SELECT element_id, element_name, data_value
   FROM onet_work_styles WHERE soc_code = $1 AND scale_id = 'WI'
   ORDER BY data_value DESC LIMIT 10
8. Related occupations:
   SELECT r.related_soc_code, o.title, r.relatedness_tier, r.rank_index
   FROM onet_related_occupations r
   JOIN onet_occupations o ON o.soc_code = r.related_soc_code
   WHERE r.soc_code = $1 AND r.relatedness_tier IN ('Primary-Short','Primary-Long')
   ORDER BY r.rank_index LIMIT 10
9. Alternate titles:
   SELECT alternate_title FROM onet_alternate_titles
   WHERE soc_code = $1 LIMIT 10
10. BLS employment (last 3 years, for context):
    SELECT year, employment, employment_index
    FROM bls_employment
    WHERE soc_code = (SELECT soc_code_bls FROM onet_occupations WHERE soc_code = $1)
    ORDER BY year DESC LIMIT 3

If occupation not found: return 404.

Return the full object. No truncation in the API — let the UI decide what to show.
TypeScript. Use existing lib/db.ts pattern. No explanation.
---

Handoff condition: Uses `Promise.all`. Returns 404 for unknown SOC codes.
Depends on: Steps 11, 12 complete.

---

## STEP 15 · PHASE B · Employment Index D3 Chart

Context: Paste the JSON response from your API test at `/api/onet/employment?soc=15-1252,15-1251`. Attach the reference chart image (Programmer vs Developer). Run after Step 14 (all APIs verified).

---
Build a D3 v7 line chart React component for a Next.js App Router
application (TypeScript, Tailwind CSS).

FILE: app/onet/charts/EmploymentChart.tsx

This chart replicates the style of the attached reference image
(Programmer vs Developer Employment Index).

DATA SHAPE (from /api/onet/employment, sample pasted below):
[PASTE the JSON from your API test]

COMPONENT PROPS:
interface EmploymentChartProps {
  data: {
    series: Array<{
      soc_code: string
      title: string
      data: Array<{
        year: number
        employment: number | null
        employment_index: number | null
        is_projected: boolean
        is_suppressed: boolean
      }>
    }>
    milestones: Array<{
      year: number
      month: number | null
      label: string
      description: string
    }>
  }
  width?: number
  height?: number
}

CHART SPECIFICATIONS:
- SVG rendered via useEffect + useRef pattern
- Responsive: use ResizeObserver, redraw on width change
- X axis: years 2012–2026, linear scale, ticks at every year
- Y axis: employment index 0–150 (fixed range), left side
- Zero baseline: NOT required (index chart, not bar chart)
- Each occupation: one line, colored from this palette:
  ['#8B0000', '#4A4A4A', '#8B7536', '#2F2F2F', '#6B6B5E']
- Actual data (is_projected=false): solid line, strokeWidth 2
- Projected data (is_projected=true): dashed line (strokeDasharray '4,4'), same color
- Suppressed years (is_suppressed=true): gap in line using d3.line().defined()
- Vertical dotted line at x=2024.5 separating actual from projected,
  labeled 'PROJECTED' above in small caps
- Baseline reference line at y=100 (2018=100), light gray, dashed
- Annotation callouts for milestones:
  Small vertical tick at the milestone year on the x-axis
  Short label rotated -45° below the x-axis
  On hover: tooltip showing full description
- Line labels: occupation title at the rightmost data point,
  right-aligned, same color as line
- Hover behavior: vertical crosshair, tooltip showing year +
  index value + employment count for all occupations
- Dark mode support: respect prefers-color-scheme
- ARIA: role='img' aria-label='Employment index chart'

Style matches the reference image:
- BLS DATA label top left in small caps monospace
- PROJECTED label top right of the divider line
- Annotation callouts right-aligned with bold header text
- Clean academic editorial aesthetic — no rounded corners,
  no gradients, no drop shadows

TypeScript. Self-contained component (D3 loaded from npm, not CDN).
No explanation. Complete file only.
---

Handoff condition: Component renders without TypeScript errors. Handles `null` employment_index with `.defined()`.
Depends on: Step 14 complete.

---

## STEP 16 · PHASE B · Ability/Skill Profile D3 Chart

Context: Paste the box-whisker chart from your pantry (`box-whisker.html`). Paste the JSON from your API test at `/api/onet/abilities?soc=15-1252,15-1251&scale=LV&category=cognitive`. Run after Step 15.

---
Build a D3 v7 React component for an ability/skill profile chart.
This is a horizontal dot plot with CI whiskers — NOT a box plot.

FILE: app/onet/charts/ProfileChart.tsx

The pantry box-whisker chart (pasted below) uses the same
CI whisker pattern I need. Adapt the whisker rendering approach
but change the chart type to a dot plot.

[PASTE box-whisker.html here]

DATA SHAPE (sample from /api/onet/abilities, pasted below):
[PASTE abilities API response]

COMPONENT PROPS:
interface ProfileChartProps {
  data: {
    abilities: Array<{
      element_id: string
      element_name: string
      category: string
      subcategory: string
      occupations: Array<{
        soc_code: string
        data_value: number | null
        lower_ci: number | null
        upper_ci: number | null
        n: number
        recommend_suppress: boolean
        not_relevant: boolean
      }>
      overall: { mean_value: number; ci_lower: number; ci_upper: number; occupation_count: number }
      field: { mean_value: number; ci_lower: number; ci_upper: number; occupation_count: number } | null
    }>
  }
  occupationColors: Record<string, string>
  title: string
}

CHART SPECIFICATIONS:
- SVG via useEffect + useRef, responsive
- Y axis: ability/skill names, one row per element
  Default sort: by overall.mean_value descending
  Row height: 28px
  Chart height: dynamic (rows × 28 + margins)
- X axis: score 0–7 (fixed, O*NET LV scale)
  Ticks at 0, 1, 2, 3, 4, 5, 6, 7
  Label at right: 'Level (0–7)'
- Background CI bands (render first, behind dots):
  Overall mean CI: very light gray fill (#F0EFED),
    from overall.ci_lower to overall.ci_upper, full row height
  Field mean CI: slightly darker gray (#E0DEDB),
    from field.ci_lower to field.ci_upper, full row height
  Overall mean center line: dashed gray vertical line
- Per-occupation dots and whiskers (render on top):
  For each occupation per ability row:
    Dot: circle r=5, filled with occupationColors[soc_code]
    Whisker: horizontal line from lower_ci to upper_ci,
      same color, strokeWidth 1.5, opacity 0.7
    If not_relevant=true: dot rendered as open circle (fill=none,
      stroke=color), opacity 0.4
    If recommend_suppress=true: skip entirely
  Multiple occupations on same row: jitter vertically ±3px per
    occupation index to prevent overlap
- Hover: tooltip showing element_name, occupation title,
  value ± CI, n
- Row labels: element_name left of chart, right-aligned,
  12px, truncate at 22 chars with ellipsis
- Category section headers: when category changes between rows,
  insert a light gray divider with category label
  (e.g. 'COGNITIVE ABILITIES' in small caps)
- Dark mode support
- ARIA: role='img'

TypeScript. No explanation. Complete file.
---

Handoff condition: Background bands render before dots. `not_relevant` shows as open circles. Category headers appear between sections.
Depends on: Steps 14, 15 complete.

---

## STEP 18 · PHASE B · Full Page Assembly

Context: Paste your existing `app/page.tsx` as layout reference. Paste `components/Header/Header.tsx`. Include any fix notes from Step 17 visual review. Run after Step 17.

---
Build the main O*NET explorer page for the Irreducibly Human site.

FILE 1: app/onet/page.tsx (server component)
- Fetches initial data: occupation count, featured pair
  (15-1252 Software Developers + 15-1251 Computer Programmers)
- Fetches initial employment + abilities data for the featured pair
- Passes to OnetExplorer client component
- Sets page metadata: title 'O*NET Job Trend Analyzer — Irreducibly Human'
- Uses existing site layout (Header + Footer already in root layout)
- Matches editorial style of existing pages (see app/page.tsx pasted above)

FILE 2: app/onet/OnetExplorer.tsx (client component, 'use client')
State managed:
  - selectedOccupations: Array<{ soc_code, title, color }> (max 5)
  - activeTab: 'employment' | 'abilities' | 'skills'
  - abilityCategory: 'cognitive' | 'psychomotor' | 'physical' | 'sensory' | 'all'
  - scale: 'LV' | 'IM'
  - employmentData, abilitiesData, skillsData (from API)
  - loading: boolean
  - modalOccupation: string | null

On selectedOccupations change: fetch all three APIs in parallel,
update all three data states.

Layout (use Tailwind, match existing site aesthetic):
  - Page header: "O*NET Job Trend Analyzer" h1, subtitle
  - Search bar: input + results dropdown (calls /api/onet/search)
  - Selected occupation chips: one per occupation, colored dot +
    title + remove button. "Max 5 occupations" when at limit.
  - Tab bar: Employment | Abilities | Skills
  - For Abilities/Skills tab: category filter pills
    (Cognitive | Psychomotor | Physical | Sensory | All)
    and scale toggle (Level | Importance)
  - Chart panel: renders appropriate chart component
  - Loading state: skeleton placeholder while fetching
  - Error state: "Unable to load data" with retry button

The occupation chips use the same colors as the chart lines:
  ['#8B0000', '#4A4A4A', '#8B7536', '#2F2F2F', '#6B6B5E']

When user clicks a chart line or occupation chip: set
  modalOccupation to that soc_code.

FILE 3: app/onet/OccupationModal.tsx
Uses existing shadcn/ui Dialog component.
Opens when modalOccupation is set.
Fetches /api/onet/occupation/[soc] on open.
Displays: title, SOC code, job zone badge, description,
  tasks (core first, 5 shown + expand), abilities top 10,
  skills top 10, knowledge top 10, related occupations as chips,
  link to onet.org.
Loading skeleton while fetching.

No explanation. Complete TypeScript files.
---

Handoff condition: Page renders at `/onet`. Search returns results. Selecting an occupation triggers chart update. Modal opens on chip click.
Depends on: Step 17 complete.

---

## STEP 20 · PHASE H · Targeted Fixes

Context: Paste your specific purpose failure list from Step 19.

---
Fix these specific issues in the O*NET Job Trend Analyzer:
[PASTE purpose failure list from Step 19]

For each issue, make the minimal targeted change.
Do not refactor other parts of the code.
Return only the changed files with the specific sections modified.
---

Handoff condition: Each purpose failure from Step 19 resolved.
Depends on: Step 19 complete.

---

## STEP 21 · PHASE H · Sitemap + Nav Update

Context: Paste current `app/sitemap.ts` and `components/Header/Header.tsx`.

---
Add the /onet route to the existing Irreducibly Human sitemap.

FILE: app/sitemap.ts (existing file — paste current contents)

Add /onet as a static route with:
  url: process.env.NEXT_PUBLIC_SITE_URL + '/onet'
  lastModified: new Date()
  changeFrequency: 'monthly'
  priority: 0.8

Also add /onet to the public nav. In components/Header/Header.tsx
(paste current contents), add 'O*NET' as a nav item linking to /onet,
between 'Tools' and 'About'.

Return only the two modified files. No explanation.
---

Handoff condition: `/onet` in sitemap. Nav shows O*NET link.
Depends on: Step 18 complete.
