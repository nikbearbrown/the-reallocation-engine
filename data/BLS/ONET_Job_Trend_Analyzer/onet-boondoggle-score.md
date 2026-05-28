# BOONDOGGLE SCORE
**System:** O*NET Job Trend Analyzer (irreduciblyhuman.xyz/onet)
**SDD Completion:** V0–V4, S1, S3 complete / S2, S4, D1–D3, P1–P5 pending
**Score generated:** 2026-05-14
**Team Claude fluency:** Level I (copy-paste individual prompts)

---

## PHASE LEGEND
F = Foundation
C = Core System Skeleton
I = Integration Layer
B = Full Feature Build
H = Hardening
R = Release

---

## STEP 1 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PF] — Problem Formulation: You are setting up the project before Claude sees any of it. The decisions made here govern every subsequent step.

**ACTION:**
1. Open Neon SQL Editor (console.neon.tech → your project → SQL Editor)
2. Copy the full SQL block from `onet-s3-data-architecture.md` Section 3
3. Paste and run it
4. Verify by running: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`
5. Confirm you see all 17 tables: `ai_milestones`, `bls_employment`, `onet_abilities`, `onet_ability_stats`, `onet_alternate_titles`, `onet_interests`, `onet_knowledge`, `onet_occupations`, `onet_related_occupations`, `onet_skill_stats`, `onet_skills`, `onet_tasks`, `onet_technology_skills`, `onet_work_activities`, `onet_work_context`, `onet_work_styles`, `onet_work_values`

**HANDOFF CONDITION:** All 17 tables exist in Neon with RLS enabled. Zero errors in SQL execution log.

**DEPENDENCY:** None.

---

## STEP 2 · PHASE F · CLAUDE TASK

**LABOR:** Claude (via Cowork)

**CONTEXT REQUIRED:**
- Your BLS folder path (e.g. `/Users/bear/BLS`)
- The `onet-s3-data-architecture.md` file — specifically Section 4 Flow B
- Your `DATABASE_URL` from Neon (available in Vercel env vars or Neon dashboard)

**PROMPT:**
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
```

**EXPECTED OUTPUT:** A complete, runnable `scripts/import-bls.mjs` file. Should be 100–150 lines. Should handle both `.xls` and `.xlsx` without separate code paths.

**HANDOFF CONDITION:** Script exists, has no syntax errors (`node --check scripts/import-bls.mjs` passes), imports are correct (`xlsx`, `@neondatabase/serverless`, `dotenv`).

**DEPENDENCY:** Step 1 complete (tables exist).

---

## STEP 3 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing: Reading the generated script before running it against your live database.

**ACTION:**
1. Open `scripts/import-bls.mjs`
2. Verify: Does it filter `OCC_GROUP === 'detailed'`? (If missing, it will insert 10x too many rows)
3. Verify: Does it handle both `.xls` and `.xlsx` extensions? (Check that it uses `xlsx.readFile()` not `fs.readFileSync`)
4. Verify: Does the employment_index computation happen AFTER all years are loaded, not per-row? (It needs the 2018 baseline to exist first)
5. Verify: Is the upsert using `ON CONFLICT (soc_code, year) DO UPDATE`?
6. Check that `DATABASE_URL` is read from env, not hardcoded
7. If anything is wrong, paste the specific failing section back to Claude with: "Fix this section: [paste]. The problem is [describe]."

**HANDOFF CONDITION:** You have read the script, verified the five checks above, and are confident it will not corrupt the database.

**DEPENDENCY:** Step 2 complete.

---

## STEP 4 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [TO] — Tool Orchestration: Running the import script via Cowork against your live data.

**ACTION:**
1. In your project root, create `.env.local` if it doesn't exist and confirm `DATABASE_URL` is set
2. Run: `cd /your/irreducibly-human/project && node scripts/import-bls.mjs`
   with `BLS_DIR=/Users/bear/BLS` set as an environment variable
3. Watch the progress log — it should print one line per year: "Processing 2018... 832 rows inserted"
4. After completion, verify in Neon SQL Editor:
   ```sql
   SELECT year, COUNT(*) as occupations,
          COUNT(employment_index) as with_index
   FROM bls_employment
   GROUP BY year ORDER BY year;
   ```
5. Confirm: ~830 rows per year, 2012–2024. `with_index` should be close to `occupations` for 2019–2024 (most SOC codes existed in 2018). For 2012–2017, `with_index` may be lower due to SOC code changes.

**HANDOFF CONDITION:** `bls_employment` has 13 rows per SOC code (one per year), `employment_index` is populated for the majority of detailed occupations for years 2019–2024. Total row count between 10,000–12,000.

**DEPENDENCY:** Step 3 complete.

---

## STEP 5 · PHASE F · CLAUDE TASK

**LABOR:** Claude (via Cowork)

**CONTEXT REQUIRED:**
- Your `db_30_2_text/` folder path
- The full list of O*NET text files from Step 0 (the `find` command output)
- DATABASE_URL

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** `scripts/import-onet.mjs`, approximately 300–400 lines. Each file gets its own parsing function. Occupations inserted first (FK dependency).

**HANDOFF CONDITION:** `node --check scripts/import-onet.mjs` passes. File parses all 11 source files listed. Occupation import function runs before all others.

**DEPENDENCY:** Step 1 complete (tables exist).

---

## STEP 6 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing: Spot-checking the O*NET import script before running it.

**ACTION:**
1. Open `scripts/import-onet.mjs`
2. Verify: Is `Occupation Data.txt` imported FIRST before any other table? (FK constraint — if abilities run before occupations, every row will fail)
3. Verify: Does the abilities parser derive `category` from `element_id`? (Without this, all abilities land with NULL category, breaking Chart 2 filters)
4. Verify: Does `recommend_suppress` map `'Y'` → `true`, anything else → `false`?
5. Verify: Does `not_relevant` handle all three values: `'Y'` → `true`, `'N'` → `false`, `'n/a'` → `null`?
6. Spot-check one occupation: find `11-1011.00` in `Occupation Data.txt`, confirm it will map to `major_group_code = '11'` and `major_group_name = 'Management'`
7. If errors found, return specific section to Claude with correction instruction.

**HANDOFF CONDITION:** All 5 structural checks pass. You are confident occupation import precedes all FK-dependent tables.

**DEPENDENCY:** Step 5 complete.

---

## STEP 7 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [TO] — Tool Orchestration: Running the O*NET import.

**ACTION:**
1. Run: `ONET_DIR=/Users/bear/BLS/db_30_2_text DATABASE_URL=your_url node scripts/import-onet.mjs`
2. Watch logs — should see one line per file: "Importing Abilities.txt... 104000 rows"
3. Total runtime: expect 2–5 minutes for ~730,000 rows
4. After completion, verify in Neon SQL Editor:
   ```sql
   SELECT
     (SELECT COUNT(*) FROM onet_occupations) as occupations,
     (SELECT COUNT(*) FROM onet_abilities) as abilities,
     (SELECT COUNT(*) FROM onet_skills) as skills,
     (SELECT COUNT(*) FROM onet_tasks) as tasks;
   ```
5. Expected: occupations ~1000, abilities ~104000, skills ~70000, tasks ~10000

**HANDOFF CONDITION:** Row counts match expected ranges. No FK violation errors in log.

**DEPENDENCY:** Step 6 complete.

---

## STEP 8 · PHASE F · CLAUDE TASK

**LABOR:** Claude (via Cowork)

**CONTEXT REQUIRED:** DATABASE_URL, confirmation that Steps 4 and 7 are complete.

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** `scripts/compute-stats.mjs`, ~80–100 lines. Uses SQL aggregation, not JavaScript loops. Fast — should complete in under 30 seconds.

**HANDOFF CONDITION:** Script uses SQL `AVG()`, `STDDEV()`, `COUNT()` aggregations — NOT JavaScript row-by-row computation. `node --check` passes.

**DEPENDENCY:** Steps 4 and 7 complete (both source tables populated).

---

## STEP 9 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [TO] — Tool Orchestration: Running stats computation and seeding milestones.

**ACTION:**
1. Run: `DATABASE_URL=your_url node scripts/compute-stats.mjs`
2. Verify:
   ```sql
   SELECT group_type, COUNT(*) FROM onet_ability_stats
   GROUP BY group_type;
   ```
   Expected: overall ~104 rows, major_group ~1,800–2,000, job_zone ~400–500
3. Spot-check one value:
   ```sql
   SELECT * FROM onet_ability_stats
   WHERE element_id = '1.A.1.a.1'
   AND scale_id = 'LV' AND group_type = 'overall';
   ```
   `mean_value` should be between 3.0 and 4.5 (Oral Comprehension is universally important)
4. Seed AI milestones — run this SQL in Neon SQL Editor:
   ```sql
   INSERT INTO ai_milestones (year, month, label, description, sort_order)
   VALUES
   (2017, 6,  'Transformer architecture', '"Attention Is All You Need" — Vaswani et al.', 1),
   (2018, 10, 'BERT released', 'Google — bidirectional language model', 2),
   (2019, 2,  'GPT-2 released', 'OpenAI — 1.5B parameters', 3),
   (2020, 6,  'GPT-3 released', 'OpenAI — 175B parameters', 4),
   (2021, 6,  'GitHub Copilot beta', 'First mass AI code generation tool', 5),
   (2022, 11, 'ChatGPT launched', 'OpenAI — 100M users in 60 days', 6),
   (2023, 3,  'GPT-4 released', 'OpenAI — multimodal', 7),
   (2023, 7,  'Llama 2 open source', 'Meta — open weights model', 8),
   (2024, 3,  'Claude 3 released', 'Anthropic — Opus/Sonnet/Haiku', 9),
   (2024, 5,  'GPT-4o released', 'OpenAI — omni model', 10),
   (2025, 1,  'o3 released', 'OpenAI — advanced reasoning', 11),
   (2025, 2,  'Claude 3.5 Sonnet', 'Anthropic — coding benchmark leader', 12)
   ON CONFLICT DO NOTHING;
   ```

**HANDOFF CONDITION:** `onet_ability_stats` has 3 group_type categories with plausible row counts. `ai_milestones` has 12 rows. Oral Comprehension overall mean is between 3.0–4.5.

**DEPENDENCY:** Steps 7 and 8 complete.

---

## STEP 10 · PHASE F · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [IJ] — Interpretive Judgment: Deciding which AI milestones belong on the chart and whether the descriptions are right for the Irreducibly Human audience.

**ACTION:**
Review the 12 seeded milestones. Ask:
1. Are these the events that best illustrate the programmer collapse story visible in the BLS data?
2. Is the framing appropriate for graduate students studying AI's impact on work — not hype, not fear, factual?
3. Add, remove, or edit milestones directly in Neon SQL Editor. The chart annotation text is editorial — it should serve the course argument, not just list AI releases.
4. Consider: the chart's most important annotation is probably November 2022 (ChatGPT). Does the label text make that argument visible?

**HANDOFF CONDITION:** You have reviewed and approved the milestone set. You own this editorial decision — Claude cannot make it for you.

**DEPENDENCY:** Step 9 complete.

---

## STEP 11 · PHASE C · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- The existing `lib/db.ts` from the Irreducibly Human codebase (paste it)
- The Neon schema from S3 (paste the table definitions for `onet_occupations`, `bls_employment`, `ai_milestones`)

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** Two TypeScript API route files. Each ~60–80 lines. Uses the existing `sql` tagged template from `lib/db.ts`.

**HANDOFF CONDITION:** Both files compile (`tsc --noEmit` passes). No hardcoded credentials. Both use the existing `lib/db.ts` import pattern. Search route handles the SOC code pattern match before falling back to full-text.

**DEPENDENCY:** Steps 1, 7, 9 complete (tables populated).

---

## STEP 12 · PHASE C · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- Paste the output of Step 11 (both route files)
- The schema for `onet_abilities`, `onet_ability_stats`, `onet_skills`, `onet_skill_stats`

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** Two more route files, each ~80–100 lines. Response shape matches exactly what the D3 charts will consume.

**HANDOFF CONDITION:** Both files compile. `abilities` route correctly fetches stats for the major group of the first requested SOC code (not hardcoded). `skills` route is structurally identical to abilities.

**DEPENDENCY:** Step 11 complete.

---

## STEP 13 · PHASE C · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- Paste `app/api/onet/employment/route.ts` as pattern reference
- Schema for all O*NET tables

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** One dynamic route file, ~120 lines. All 10 queries run in `Promise.all`. Returns 404 for unknown SOC codes.

**HANDOFF CONDITION:** File compiles. Uses `Promise.all` (not sequential awaits). Returns 404 when occupation query returns no rows.

**DEPENDENCY:** Steps 11, 12 complete.

---

## STEP 14 · PHASE C · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing: Testing all four API routes before any UI is built.

**ACTION:**
Start the dev server (`npm run dev`) and test each route in the browser or with curl:

1. **Search:** `http://localhost:3000/api/onet/search?q=software+developer`
   Expected: array with Software Developers (`15-1252`) near the top

2. **Search by SOC:** `http://localhost:3000/api/onet/search?q=15-1251`
   Expected: Computer Programmers as first result (exact SOC match)

3. **Employment:** `http://localhost:3000/api/onet/employment?soc=15-1252,15-1251`
   Expected: two series, years 2012–2024, `employment_index` values around 100 for 2018, ~126 for Software Developers in 2024, ~48 for Computer Programmers in 2024. Plus 12 milestones.

4. **Abilities:** `http://localhost:3000/api/onet/abilities?soc=15-1252&scale=LV&category=cognitive`
   Expected: ~14 cognitive abilities, each with `data_value` between 0–7, `lower_ci` and `upper_ci` populated, `overall` stats present.

5. **Occupation modal:** `http://localhost:3000/api/onet/occupation/15-1252.00`
   Expected: large object with title "Software Developers", tasks array, abilities array sorted by data_value desc, related occupations.

**Flag any of these failures immediately — do not proceed to UI build until all 5 tests pass:**
- Employment series shows identical index values for both occupations (index computation failed)
- Abilities route returns empty array (import or FK issue)
- Search returns no results (tsvector index not created)
- Occupation route returns 404 for a known SOC code (normalization bug)

**HANDOFF CONDITION:** All 5 manual API tests return plausible data. Computer Programmers employment index is visibly declining (below 100 for 2019+). Software Developers index is visibly rising (above 100 for 2019+).

**DEPENDENCY:** Steps 11, 12, 13 complete.

---

## STEP 15 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- Paste the response from Step 14 test #3 (the employment API response JSON)
- The reference chart image (Programmer vs Developer Employment Index)
- The existing CLAUDE.md and DESIGN.md from the Brutalist D3 system

**PROMPT:**
```
Build a D3 v7 line chart React component for a Next.js App Router
application (TypeScript, Tailwind CSS).

FILE: app/onet/charts/EmploymentChart.tsx

This chart replicates the style of the attached reference image
(Programmer vs Developer Employment Index).

DATA SHAPE (from /api/onet/employment, sample pasted below):
[PASTE the JSON from Step 14 test #3]

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
  (matches existing BB palette from DESIGN.md)
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
```

**EXPECTED OUTPUT:** `app/onet/charts/EmploymentChart.tsx`, ~200–250 lines. Self-contained D3 component. Handles gaps in data, projected vs actual line style, milestone annotations.

**HANDOFF CONDITION:** Component renders without TypeScript errors. Accepts the data shape from the API. Handles `null` employment_index values without crashing (`.defined()` in D3 line generator).

**DEPENDENCY:** Step 14 complete (API verified).

---

## STEP 16 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- Paste the box-whisker chart code from your D3 pantry (`box-whisker.html`)
- Paste a sample response from the abilities API (Step 14 test #4)

**PROMPT:**
```
Build a D3 v7 React component for an ability/skill profile chart.
This is a horizontal dot plot with CI whiskers — NOT a box plot.

FILE: app/onet/charts/ProfileChart.tsx

The pantry box-whisker chart (pasted below) uses the same
CI whisker pattern I need. Adapt the whisker rendering approach
but change the chart type to a dot plot.

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
  occupationColors: Record<string, string>  // soc_code → hex color
  title: string  // 'Abilities' or 'Skills'
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
```

**EXPECTED OUTPUT:** `app/onet/charts/ProfileChart.tsx`, ~250–300 lines. Shared component used for both abilities and skills. Background bands render before dots.

**HANDOFF CONDITION:** Component accepts the abilities API response shape. Background bands (overall CI, field CI) render as rectangles behind the dots. `not_relevant` occupations render as open circles. Category section headers appear between cognitive/psychomotor/physical/sensory groups.

**DEPENDENCY:** Steps 14, 15 complete.

---

## STEP 17 · PHASE B · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing: Visual inspection of both D3 charts before assembling the full page.

**ACTION:**
Build a temporary test page at `app/onet/test/page.tsx` that:
1. Fetches from `/api/onet/employment?soc=15-1252,15-1251` server-side
2. Fetches from `/api/onet/abilities?soc=15-1252,15-1251&scale=LV&category=cognitive` server-side
3. Renders `<EmploymentChart>` and `<ProfileChart>` side by side

Navigate to `localhost:3000/onet/test` and check:

**Employment chart:**
- Computer Programmers line is visibly declining, Software Developers visibly rising
- The 2022 ChatGPT milestone annotation appears on the x-axis
- Dashed line appears after 2024
- Hovering a line shows the tooltip with year + index value

**Profile chart (abilities):**
- Each cognitive ability has a row
- Two colored dots per row (one per occupation)
- Gray background bands are visible (overall CI and field CI)
- Category header "COGNITIVE ABILITIES" appears at top
- Hovering a dot shows the tooltip

**Flag these as blockers:**
- Both lines trend upward (index computation error)
- No milestone annotations visible (AI milestones not seeded or not fetched)
- Profile chart shows all dots at the same X position (scale issue)
- Background CI bands missing (render order issue)

**HANDOFF CONDITION:** Both charts render with visually plausible data. The programmer collapse narrative is visible in Chart 1. The cognitive ability comparison is legible in Chart 2.

**DEPENDENCY:** Steps 15, 16 complete.

---

## STEP 18 · PHASE B · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:**
- Paste existing `app/page.tsx` as layout reference
- Paste existing `components/Header/Header.tsx`
- Screenshots or description of any issues found in Step 17

**PROMPT:**
```
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
```

**EXPECTED OUTPUT:** Three files: `page.tsx` (server), `OnetExplorer.tsx` (client, ~200 lines), `OccupationModal.tsx` (~100 lines).

**HANDOFF CONDITION:** Page renders at `/onet`. Search returns results. Selecting an occupation triggers chart update. Tab switching works. Modal opens on chip click.

**DEPENDENCY:** Step 17 complete.

---

## STEP 19 · PHASE B · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [EI] — Executive Integration: Evaluating the assembled tool as a unified experience against the original purpose.

**ACTION:**
Navigate to `localhost:3000/onet`. Run this specific test sequence:

1. Search for "software developer" → select Software Developers
2. Search for "computer programmer" → select Computer Programmers
3. Look at Chart 1 (Employment). Ask: **Does this chart tell the Irreducibly Human story?** The argument is that Tier 1 programmers (implementing specs) are being displaced while Tier 2 developers (design, judgment, architecture) are growing. Is that visible? Is the ChatGPT annotation at the right inflection point?
4. Click the Abilities tab. Select "Cognitive" filter. Ask: **Can a graduate student use this to understand the cognitive difference between the two roles?** Are the CI bands meaningful — do they help the student see where the occupation sits relative to the field?
5. Click on "Software Developers" chip → open modal. Ask: **Does the modal give a complete enough picture for someone deciding whether to study this field?**
6. Try adding a third occupation (e.g., "Data Scientist") and check that all three charts update coherently.

Write down specifically what is not working for the intended use case — not UI polish issues, but purpose failures: places where the tool does not answer the question it was supposed to answer.

**HANDOFF CONDITION:** You have a written list of purpose failures (if any) versus polish issues. Purpose failures go back to Claude as targeted fixes. Polish issues go into the Open Questions Log for v2.

**DEPENDENCY:** Step 18 complete.

---

## STEP 20 · PHASE H · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The purpose failure list from Step 19 + specific screenshots or descriptions.

**PROMPT:**
```
Fix these specific issues in the O*NET Job Trend Analyzer:
[PASTE purpose failure list from Step 19]

For each issue, make the minimal targeted change.
Do not refactor other parts of the code.
Return only the changed files with the specific sections modified.
```

**EXPECTED OUTPUT:** Targeted fixes only. No refactoring, no scope expansion.

**HANDOFF CONDITION:** Each purpose failure from Step 19 is resolved. Re-run the Step 19 test sequence and confirm.

**DEPENDENCY:** Step 19 complete.

---

## STEP 21 · PHASE H · CLAUDE TASK

**LABOR:** Claude

**CONTEXT REQUIRED:** The complete `app/onet/` directory structure.

**PROMPT:**
```
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
```

**HANDOFF CONDITION:** `/onet` appears in sitemap.xml when deployed. Nav shows O*NET link.

**DEPENDENCY:** Step 18 complete.

---

## STEP 22 · PHASE H · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [PA] — Plausibility Auditing: Performance and accessibility check before deploy.

**ACTION:**
1. Run Lighthouse on `localhost:3000/onet` → check Performance score
   If < 70: the D3 charts are likely blocking — check that they render client-side only (`'use client'` + `useEffect`)
2. Run color contrast check on the occupation colors against the page background:
   `#8B0000` (blood red) on `#E8E0D0` (parchment) — should pass WCAG AA
3. Tab through the page with keyboard. Can you reach the search bar, select an occupation, and switch tabs without a mouse?
4. Check dark mode: toggle system dark mode and reload. Do the charts recolor correctly?
5. Run `npm run build` — confirm no TypeScript errors and no missing env vars

**HANDOFF CONDITION:** Lighthouse performance ≥ 70. No WCAG AA contrast failures for the 5 occupation colors. `npm run build` succeeds with zero errors.

**DEPENDENCY:** Steps 20, 21 complete.

---

## STEP 23 · PHASE R · HUMAN TASK

**LABOR:** Human
**SUPERVISORY CAPACITY:** [IJ] — Interpretive Judgment: Final editorial review before the tool is public.

**ACTION:**
Read the page as a prospective graduate student encountering it for the first time. Ask:
1. Does the default state (Software Developers vs Computer Programmers pre-loaded) make the Irreducibly Human argument visible without the student having to configure anything?
2. Is the page title and subtitle clear about what the tool does and why it matters for the curriculum?
3. Does the data attribution (O*NET, BLS) appear clearly so the student trusts the source?
4. Would a student know what to do next after seeing the chart — does it connect to a course, a concept, a reading?

Add a brief introductory paragraph to the page if needed. This is editorial judgment — Claude cannot supply it. The argument the page makes is yours.

**HANDOFF CONDITION:** You are satisfied that a student landing on `/onet` without context would understand what they are looking at and why it matters. Push to main.

**DEPENDENCY:** Step 22 complete.

---

## SCORE SUMMARY

**Total steps:** 23
**Claude tasks:** 11 (48% of steps)
**Human tasks:** 12 (52% of steps)

---

## CRITICAL PATH
Step 1 → Step 2 → Step 4 → Step 7 → Step 8 → Step 9 → Step 11 → Step 12 → Step 13 → Step 14 → Step 15 → Step 16 → Step 17 → Step 18 → Step 19 → Step 20 → Step 22 → Step 23

(18 steps on the critical path — Steps 3, 5, 6, 10, 21 are parallel or supporting)

---

## HIGHEST-RISK HANDOFFS

**1. Step 14 — API verification before any UI is built**
Risk: Employment index computation failed silently (both lines show 100.0 for all years) or abilities route returns empty due to FK constraint during import. If this isn't caught here, the charts will render with wrong data and the error will be invisible.
Watch for: identical index values across occupations, empty abilities arrays.

**2. Step 7 — O*NET import FK order**
Risk: If the import script processes `Abilities.txt` before `Occupation Data.txt`, every ability row fails with a foreign key violation. The script logs show "0 rows inserted" for abilities with no obvious error message.
Watch for: `onet_abilities` count = 0 after import despite no error in the log.

**3. Step 19 — Purpose test before hardening**
Risk: The tool passes all technical tests but fails the actual use case — the employment chart doesn't tell the programmer collapse story clearly, or the ability comparison is too noisy to be meaningful for a graduate student. Technical correctness is not the same as communicative success.
Watch for: inability to see a clear difference between the two occupation trajectories; CI bands so wide they obscure rather than inform.

---

## SUPERVISORY CAPACITY DISTRIBUTION
- [PA] Plausibility Auditing: 5 steps (Steps 3, 6, 14, 17, 22)
- [PF] Problem Formulation: 1 step (Step 1)
- [TO] Tool Orchestration: 4 steps (Steps 4, 7, 9, 21)
- [IJ] Interpretive Judgment: 2 steps (Steps 10, 23)
- [EI] Executive Integration: 1 step (Step 19)

---

## WHAT IS MISSING FROM THIS SCORE

When the following SDD sections are completed, these steps can be added:

**When /s2 (External Integrations) is complete:**
Steps covering O*NET Creative Commons attribution requirements and BLS data citation standards can be added to the Release phase.

**When /p1 (Features with MoSCoW tagging) is complete:**
Steps 15–18 may expand if IMPORTANT features (industry filter, admin import UI) are promoted to MUST-BUILD.

**When /p3 (Infrastructure) is complete:**
A Vercel deployment verification step can be added to Phase R covering environment variable confirmation and cold-start performance on serverless.
