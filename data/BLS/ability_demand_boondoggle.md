# Ability Demand Index — SDD Delta + Boondoggle Score
**Against:** ability_demand_index_SDD.md v1.0  
**Source:** CLAUDE.md (irreducibly.xyz codebase)  
**Date:** May 2026

---

## SDD DELTA — What changes now that we have CLAUDE.md

### OQ-04 RESOLVED — Stack confirmed
Next.js App Router, Vercel, Neon (`@neondatabase/serverless`), D3, TypeScript, Tailwind. No architecture changes. Implementation details below.

### Route placement
Create `/app/tools/ability-demand-index/page.tsx` as a **static route**.  
Static routes take priority over `/tools/[slug]` — same pattern as courses.  
The tool appears on `/tools` automatically once registered. Add as a link tool via admin dashboard pointing to `/tools/ability-demand-index` OR drop a card entry in the tools DB.

### Database client — use existing
Do not create a new Neon client. Use `lib/db.ts`:
```typescript
import { sql } from '@/lib/db'
const rows = await sql`SELECT * FROM ability_demand_index WHERE element_id = ${id}`
```

### Schema — UUID not SERIAL
Replace `SERIAL PRIMARY KEY` with `UUID PRIMARY KEY DEFAULT gen_random_uuid()` to match existing tables. Everything else in the schema section of the SDD stands.

### D3 integration — two valid paths
**Path A (blog viz pattern):** Add to `lib/viz/registry.ts`, export `default (el: HTMLElement) => void`. Works for embedding in blog posts. Limited for the full interactive tool.  
**Path B (React component, recommended):** Create `components/AbilityDemandChart/AbilityDemandChart.tsx` as a `'use client'` component with dynamic import and `ssr: false`. This is the right pattern for a full-page tool with search, export, and interaction.

Use Path B. Follow the `'use client'` + `dynamic import` pattern for all D3 work.

### Color palette — use BB variables
```css
--bb1: #0D0D0D   /* soot black — axis labels, text */
--bb3: #8B0000   /* dried-ink red — superhuman tier */
--bb4: #8B7536   /* cold brass — partial tier */
--bb2: #4A4A4A   /* iron grey — human tier */
--bb5: #2F2F2F   /* charcoal — absent tier */
--bb8: #E8E0D0   /* parchment — chart background */
```
Replace the hex tier colors in the Python pipeline's `AI_TIER_COLORS` with these values for visual consistency between the pipeline output and the web tool.

### API routes — follow existing pattern
Add under `/app/api/tools/ability-demand/`:
- `search/route.ts` — GET with `?q=` param
- `[element_id]/trend/route.ts` — GET trend data
- `tiers/[tier]/route.ts` — GET top abilities per tier
- `occupations/search/route.ts` — GET occupation search
- `occupations/[soc]/abilities/route.ts` — GET occupation ability profile

All routes: check nothing — this is public read-only data, same as blog public routes.

### OQ-05 DESIGN DECISION NEEDED
The tool will visibly demonstrate that O*NET has no descriptors for Tiers 4, 6, 7.  
Recommended: Add a panel below the Tier Browse Index called **"What O*NET can't see"** — three rows, one per missing tier, explaining what the tier is and why no occupational ability rating exists for it. Static content. Links to the relevant course. This is the series argument made explicit in the tool itself.

---

## BOONDOGGLE SCORE

**System:** Ability Demand Index  
**SDD Completion:** Core + Data + API + Components + Infrastructure documented  
**Score generated:** May 2026  
**Team Claude fluency:** Level II (manage a conversation thread as persistent context)

---

### PHASE LEGEND
F = Foundation  
C = Core System Skeleton  
I = Integration Layer  
B = Full Feature Build  
H = Hardening  
R = Release

---

### STEP 1 · PHASE F · HUMAN TASK

**SUPERVISORY CAPACITY:** [PF] — Verify the AI tier map before any data touches the database. The `AI_TIER_MAP` in the pipeline was written from memory. One mismatched ability name produces a silent null in every query downstream. This cannot be delegated because the verification requires reading the downloaded O*NET file and making judgment calls on borderline classifications.

**ACTION:** Open `Abilities.xlsx` from the O*NET 30.2 download. Open `ability_demand_pipeline.py`. For every key in `AI_TIER_MAP`, confirm the string matches the `Element Name` column exactly (case, spacing, punctuation). For any ability where your tier rating feels contestable (e.g., "Originality" as 'partial'), write a one-sentence rationale. These rationales become the tooltip text in the UI.

**HANDOFF CONDITION:** Every key in `AI_TIER_MAP` has been verified against the downloaded file. A separate `tier_rationales.json` exists with one sentence per ability explaining the rating.

**DEPENDENCY:** None. First step.

---

### STEP 2 · PHASE F · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** The verified `AI_TIER_MAP` from Step 1. The schema section of the SDD. The CLAUDE.md db.ts pattern.

**PROMPT:**
```
You are building the database schema for the Ability Demand Index tool on irreducibly.xyz.

The codebase uses Neon PostgreSQL via `@neondatabase/serverless`. All existing tables use
`UUID PRIMARY KEY DEFAULT gen_random_uuid()`. Follow that pattern.

Create a SQL migration file that creates these three tables:

1. `ability_demand_index` — stores employment-weighted ability demand by year
   Fields: id (UUID PK), year (SMALLINT NOT NULL), element_id (VARCHAR(20) NOT NULL),
   element_name (VARCHAR(100) NOT NULL), ai_tier (VARCHAR(20) NOT NULL, CHECK IN
   ('superhuman','partial','human','absent','unclassified')), weighted_mean (NUMERIC(6,4) NOT NULL),
   ci_lower (NUMERIC(6,4) NOT NULL), ci_upper (NUMERIC(6,4) NOT NULL),
   n_occupations (SMALLINT NOT NULL), UNIQUE(year, element_id)

2. `occupation_abilities` — O*NET ability profiles per occupation
   Fields: id (UUID PK), soc_code (VARCHAR(10) NOT NULL), occupation_title (VARCHAR(150) NOT NULL),
   element_id (VARCHAR(20) NOT NULL), element_name (VARCHAR(100) NOT NULL),
   ai_tier (VARCHAR(20) NOT NULL), importance_score (NUMERIC(4,2)), level_score (NUMERIC(4,2))

3. `dataset_versions` — tracks data loads
   Fields: id (UUID PK), version_label (VARCHAR(50) NOT NULL), onet_version (VARCHAR(20)),
   bls_year_range (VARCHAR(20)), loaded_at (TIMESTAMPTZ DEFAULT NOW()), is_current (BOOLEAN DEFAULT TRUE)

Add indexes:
- ability_demand_index: on element_id, on ai_tier, full-text on element_name
- occupation_abilities: on soc_code, full-text on occupation_title
- Full-text indexes use PostgreSQL `gin(to_tsvector('english', column_name))` syntax

Enable RLS on all three tables.
Add public read policies (same pattern as existing tables).
Add service role full-access policies.

Output: a single SQL file, no explanations, no markdown fences — just valid PostgreSQL.
```

**EXPECTED OUTPUT:** A `.sql` file that runs cleanly in Neon SQL Editor with no errors.

**HANDOFF CONDITION:** Run the SQL in Neon. All three tables exist. All indexes created. RLS enabled. Zero errors.

**DEPENDENCY:** Step 1 (tier map verified before schema locks element names).

---

### STEP 3 · PHASE F · HUMAN TASK

**SUPERVISORY CAPACITY:** [TO] — Run the Python pipeline and load data into Neon. This is a tool orchestration decision: which scale to use (Importance vs Level), which year range, and whether the output looks right before it goes into production.

**ACTION:**  
1. Run `ability_demand_pipeline.py` with `ONET_SCALE = 'IM'` (Importance). Inspect `ability_demand_index.csv` — does the weighted mean range make sense? (Should be roughly 2.5–4.0 for most abilities.)  
2. Spot-check: find "Memorization" — is its weighted mean trending down? Find "Originality" — is it stable or up? These are the predictions the argument makes. If the data contradicts them, that's a finding, not a bug — but you need to know before launch.  
3. Load CSVs into Neon: `psql $DATABASE_URL -c "\COPY ability_demand_index FROM 'output/ability_demand_index.csv' CSV HEADER"` and same for occupation_abilities.  
4. Insert a version record into `dataset_versions`.

**HANDOFF CONDITION:** `SELECT COUNT(*) FROM ability_demand_index` returns > 0. The spot-check on Memorization and Originality has been reviewed and the results noted.

**DEPENDENCY:** Step 2 (schema exists before data load).

---

### STEP 4 · PHASE C · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** CLAUDE.md API route patterns. The five API routes from the SDD. The `lib/db.ts` import pattern.

**PROMPT:**
```
You are adding API routes to an existing Next.js App Router codebase (irreducibly.xyz).
The database client is imported as: `import { sql } from '@/lib/db'`
All routes are public read-only — no auth check needed.
TypeScript. No comments. No explanations in the output.

Create these five route files:

1. `/app/api/tools/ability-demand/search/route.ts`
   GET with query param `q` (string). Full-text search on `ability_demand_index.element_name`.
   SQL: `SELECT DISTINCT element_id, element_name, ai_tier FROM ability_demand_index
         WHERE to_tsvector('english', element_name) @@ plainto_tsquery('english', ${q})
         LIMIT 10`
   Returns: `NextResponse.json({ results: rows })`
   If q is missing or < 3 chars: return `{ results: [] }`

2. `/app/api/tools/ability-demand/[element_id]/trend/route.ts`
   GET. Params: element_id.
   SQL: `SELECT year, weighted_mean, ci_lower, ci_upper, n_occupations
         FROM ability_demand_index WHERE element_id = ${element_id}
         ORDER BY year ASC`
   Also fetch: `SELECT element_name, ai_tier FROM ability_demand_index
                WHERE element_id = ${element_id} LIMIT 1`
   Returns: `{ element_id, element_name, ai_tier, data: rows }`
   If no rows: 404.

3. `/app/api/tools/ability-demand/tiers/[tier]/route.ts`
   GET. Params: tier (superhuman|partial|human|absent).
   Returns top 5 abilities by latest year weighted_mean for that tier.
   SQL: `SELECT element_id, element_name, weighted_mean FROM ability_demand_index
         WHERE ai_tier = ${tier} AND year = (SELECT MAX(year) FROM ability_demand_index)
         ORDER BY weighted_mean DESC LIMIT 5`

4. `/app/api/tools/ability-demand/occupations/search/route.ts`
   GET with query param `q`. Full-text search on occupation_abilities.occupation_title.
   Returns top 10 distinct soc_code + occupation_title matches.

5. `/app/api/tools/ability-demand/occupations/[soc_code]/abilities/route.ts`
   GET. Returns all abilities for occupation, ordered by importance_score DESC.
   Include element_id, element_name, ai_tier, importance_score.

Output: five separate code blocks, each labeled with its file path.
```

**EXPECTED OUTPUT:** Five TypeScript route files, each compiling without errors when dropped into the project.

**HANDOFF CONDITION:** Each route returns valid JSON when called via `curl` or browser. The trend route for a known element_id returns an array with 10–15 year data points. The search route returns results for "Memorization" and "Inductive Reasoning".

**DEPENDENCY:** Step 3 (data in Neon before routes are testable).

---

### STEP 5 · PHASE C · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** CLAUDE.md D3 pattern (Path B — React component with `'use client'` and dynamic import). BB palette variables. The trend data shape from Step 4.

**PROMPT:**
```
Create a React D3 trend chart component for the Ability Demand Index tool on irreducibly.xyz.

File: `components/AbilityDemandChart/AbilityDemandChart.tsx`
Mark as 'use client'. TypeScript. Tailwind for layout only — D3 handles all SVG rendering.

Props interface:
```typescript
interface TrendDataPoint {
  year: number
  weighted_mean: number
  ci_lower: number
  ci_upper: number
  n_occupations: number
}

interface AbilityDemandChartProps {
  elementName: string
  aiTier: 'superhuman' | 'partial' | 'human' | 'absent' | 'unclassified'
  data: TrendDataPoint[]
  onExportReady?: (svgElement: SVGSVGElement) => void
}
```

Tier color map (use these exact hex values):
- superhuman: #8B0000
- partial: #8B7536
- human: #4A4A4A
- absent: #2F2F2F
- unclassified: #9C9680

Chart spec:
- SVG rendered by D3 inside a useEffect. Ref attached to a div.
- viewBox: "0 0 700 380". Responsive via ResizeObserver on the container div.
- X axis: year (2010–2024). Y axis: weighted importance (1.0–5.0, fixed scale).
- CI band: area path with opacity 0.15, fill = tier color.
- Trend line: line path, strokeWidth 2.5, stroke = tier color.
- Data points: circle r=4 on each year, fill = tier color.
- Tooltip on hover: year + weighted_mean (2 decimal places) + n_occupations.
- If data has fewer than 3 points: render line + note text "Limited data — interpret with caution" in muted color below chart.
- Axes: clean, minimal. No gridlines. Year labels rotated 45deg if crowded.
- Call onExportReady(svgRef.current) after first successful render.

Do not use any charting library. D3 only.
Do not add any buttons or controls — the parent component handles those.
Export as default.
```

**EXPECTED OUTPUT:** A single `.tsx` file that renders a D3 chart without errors. No placeholder data — uses the props passed in.

**HANDOFF CONDITION:** Component renders correctly in browser with real trend data from the API. CI band visible. Hover tooltip works. `onExportReady` fires with a valid SVG element.

**DEPENDENCY:** Step 4 (API routes working so real data can be passed to the component during development).

---

### STEP 6 · PHASE B · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** CLAUDE.md site structure, tools page pattern, BB palette, the five API routes, the AbilityDemandChart component, the tier label content, the SDD component tree.

**PROMPT:**
```
Build the main page for the Ability Demand Index tool on irreducibly.xyz.

File: `app/tools/ability-demand-index/page.tsx`
This is a Next.js App Router page. Use server component at the top level for metadata.
The interactive search and chart are client-side — use a child client component.

Create two files:

FILE 1: `app/tools/ability-demand-index/page.tsx` (server component)
- Export metadata: title "Ability Demand Index | Irreducibly Human", description "Employment-weighted O*NET ability demand trends tagged by AI capability tier."
- Renders the AbilityDemandIndexClient component
- Fetches initial tier browse data (top 3 abilities per tier) server-side from Neon using sql from lib/db, passes as props

FILE 2: `app/tools/ability-demand-index/AbilityDemandIndexClient.tsx` (client component)
Sections in order:

SECTION 1 — Hero argument (static)
Heading: "The Curriculum Is Misaligned"
Subtext (2 sentences): "AI is superhuman at pattern recognition, verbal processing, and memorization — exactly what curriculum optimizes for. The labor market is repricing in real time."
Four tier badges (Superhuman / Partial / Human / Absent) colored with tier hex values, showing brief description of each.

SECTION 2 — Tier Browse Index (from server-fetched props)
Four columns, one per tier. Each column: tier name (colored), top 3 abilities as clickable chips.
Clicking a chip loads that ability's trend chart (sets selected ability in state, fetches trend data).

SECTION 3 — Search Panel
Input: placeholder "Search an ability or occupation..."
On input change (debounce 300ms, min 3 chars): fetch /api/tools/ability-demand/search?q=
Display results as a dropdown list. Clicking a result sets selected ability and fetches trend.
Toggle button: "Abilities" / "Occupations" — switches between the two search endpoints.

SECTION 4 — Chart Panel (conditional, shown when ability selected)
AbilityDemandChart component (dynamic import, ssr: false)
Tier label: tier name, one-sentence definition (static map in this file), link to relevant course
Export panel: three buttons:
  - "Download PNG" — serialize SVG to canvas, trigger download as `[ability-name]-demand-index.png`
  - "Copy embed code" — copies <iframe src="/tools/ability-demand-index/[element-slug]" ...> to clipboard
  - "Copy citation" — copies formatted citation string to clipboard
    Format: "Ability Demand Index: [Element Name]. Employment-weighted O*NET importance scores,
    BLS OES [year range]. O*NET 30.2. irreducibly.xyz/tools/ability-demand-index. Accessed [today's date]."

SECTION 5 — "What O*NET Can't See" (static)
Heading: "What O*NET Can't See"
Three rows: Tier 4 (Metacognitive & Supervisory), Tier 6 (Collective & Distributed), Tier 7 (Existential & Wisdom)
Each row: tier name, one sentence why no O*NET ability rating exists for it, link to relevant course.
Closing line: "These are the tiers where curriculum needs to rebuild from scratch."

SECTION 6 — Methodology note (static, small text)
One paragraph: data sources (O*NET 30.2, BLS OES), methodology summary (employment-weighted importance scores), AI tier classification note ("These are argued classifications, not mechanical scores — see the tier rationale documentation"), version label from dataset_versions table.

Styling: use BB palette CSS variables throughout. Tailwind for layout. Clean, editorial. Consistent with irreducibly.xyz design direction.
TypeScript. No comments.
```

**EXPECTED OUTPUT:** Two files. The page renders all six sections. Search works. Chart loads on ability selection. Export panel functional.

**HANDOFF CONDITION:** Full user flow completes: land on page → see hero → click a tier chip → chart renders → download PNG → PNG contains chart with tier color and citation watermark. Occupation search returns results and bar chart renders.

**DEPENDENCY:** Steps 4 and 5 (API routes and chart component exist before the page is built).

---

### STEP 7 · PHASE B · HUMAN TASK

**SUPERVISORY CAPACITY:** [PA] — Plausibility audit of the full rendered tool against the argument.

**ACTION:** Load the page. Find "Memorization" — does the trend line go down? Find "Inductive Reasoning" — is it labeled 'partial'? Find "Manual Dexterity" — is it labeled 'human'? Open the "What O*NET Can't See" section — does it name Tiers 4, 6, 7 correctly? Download a PNG — does the exported image carry the argument (tier color visible, citation present) or just a generic chart? If the chart looks like a data viz tool rather than an argument, the design needs adjustment before launch.

**HANDOFF CONDITION:** The tool makes the argument visually. A person with no prior knowledge of the series could land on the page, search "Memorization," see a declining red line labeled "Superhuman," and understand the point without reading a word of explanation.

**DEPENDENCY:** Step 6 (full page built).

---

### STEP 8 · PHASE H · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** The working page from Step 6. The PNG export flow from Step 6.

**PROMPT:**
```
Review the PNG export implementation in AbilityDemandIndexClient.tsx.

The current approach serializes the D3 SVG to canvas and downloads as PNG.
Identify and fix these four known failure modes:

1. CSS variables (`var(--bb-3)` etc.) do not resolve when SVG is serialized out of DOM context.
   Fix: before serialization, replace all CSS variable references in the SVG with their computed hex values.
   The BB palette hex values are: bb1=#0D0D0D, bb2=#4A4A4A, bb3=#8B0000, bb4=#8B7536, bb5=#2F2F2F, bb6=#6B6B5E, bb7=#9C9680, bb8=#E8E0D0.

2. Web fonts (Inter) may not render in canvas export.
   Fix: use system font stack in the SVG text elements used for export: `font-family: Georgia, serif` for labels.

3. The citation watermark must appear in the exported PNG even if the citation block is below the fold.
   Fix: append a text element to the SVG before export: bottom of chart, small text, muted color:
   "irreducibly.xyz/tools/ability-demand-index · O*NET 30.2 · BLS OES"

4. Canvas taint from external images (if any).
   Fix: ensure no external image src is referenced in the SVG serialization path.

Output: the corrected export function only — not the full file. Label it clearly.
```

**EXPECTED OUTPUT:** A corrected `handleDownloadPNG` function that produces clean PNGs across Chrome, Firefox, and Safari.

**HANDOFF CONDITION:** Export tested in three browsers. PNG opens in macOS Preview / Windows Photos with correct tier color, visible trend line, and citation watermark.

**DEPENDENCY:** Step 6 (export function exists to be corrected).

---

### STEP 9 · PHASE H · HUMAN TASK

**SUPERVISORY CAPACITY:** [IJ] — Interpretive judgment on the "What O*NET Can't See" section and tier rationale tooltips.

**ACTION:** Read the static content in Section 5 ("What O*NET Can't See") and all tier rationale tooltip text. These are not UI copy — they are the series argument. Ask: does each sentence say something true that a skeptical educator or researcher could verify? Does any sentence overclaim? The Tier 4 description is particularly high-stakes (it's the gap you added to Gardner). If you wouldn't stand behind a sentence in a conference presentation, rewrite it now.

**HANDOFF CONDITION:** Every sentence in Section 5 and every tier rationale tooltip has been reviewed and represents a claim you're prepared to defend publicly.

**DEPENDENCY:** Step 7 (full page reviewed before argument copy is finalized).

---

### STEP 10 · PHASE R · CLAUDE TASK

**LABOR:** Claude  
**CONTEXT REQUIRED:** CLAUDE.md sitemap.ts pattern. The new route path.

**PROMPT:**
```
The irreducibly.xyz sitemap is generated in `app/sitemap.ts`.
Add the Ability Demand Index tool to the sitemap.

Add one static entry:
{ url: `${baseUrl}/tools/ability-demand-index`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 }

Also add the tool to the tools card grid on `/tools` by inserting a DB record via the admin dashboard.
Provide the exact values to enter in the admin UI:
- Name: Ability Demand Index
- Slug: ability-demand-index
- Description: Employment-weighted O*NET ability demand trends. Every ability rated by AI capability tier. Search any ability or occupation and export a citable chart.
- Tool type: link
- URL: /tools/ability-demand-index
- Tags: data, onet, bls, abilities, curriculum

Output: the sitemap addition as a code diff, plus the admin UI field values as a table.
```

**EXPECTED OUTPUT:** A two-line sitemap diff and a table of admin field values.

**HANDOFF CONDITION:** Tool appears on `/tools` card grid. `/sitemap.xml` includes the new route.

**DEPENDENCY:** Step 9 (content finalized before public launch).

---

### STEP 11 · PHASE R · HUMAN TASK

**SUPERVISORY CAPACITY:** [EI] — Executive integration. Does the tool serve the series argument, or has it drifted into a general-purpose data browser?

**ACTION:** Three tests:
1. **Argument test:** Show the page to someone who hasn't seen the series. Can they explain the curriculum misalignment argument after 2 minutes with the tool, without you explaining it?
2. **Citation test:** Download a PNG, drop it into a Google Doc, and write a one-sentence caption. Does the chart support the caption? Is the citation sufficient for academic use?
3. **Course link test:** From the tool, can a user navigate to the relevant Irreducibly Human course for Tier 4 (Conducting AI) in two clicks or fewer?

If any test fails, identify the specific UI element responsible and fix it before announcing the tool publicly.

**HANDOFF CONDITION:** All three tests pass.

**DEPENDENCY:** Step 10 (tool live and indexed).

---

## SCORE SUMMARY

**Total steps:** 11  
**Claude tasks:** 6 (55%)  
**Human tasks:** 5 (45%)

**CRITICAL PATH:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 9 → 11

**HIGHEST-RISK HANDOFFS:**

1. **Step 1 → Step 2** (tier map verification → schema): If a mismatched ability name gets into the schema before verification, all downstream queries silently return nulls. One unverified string poisons the dataset.

2. **Step 6 → Step 7** (full page built → plausibility audit): The chart renders correctly but doesn't make the argument. This is the gap between a working data viz tool and a working rhetorical instrument. Claude cannot audit this — it requires domain judgment about whether the visual makes the case.

3. **Step 8 → Step 9** (export fix → argument copy review): The PNG ships with the citation watermark but the argument copy in Section 5 hasn't been reviewed. A citable chart carrying a weak claim is worse than no chart.

**SUPERVISORY CAPACITY DISTRIBUTION:**
- [PA] Plausibility Auditing: 2 steps (Steps 7, 11)
- [PF] Problem Formulation: 1 step (Step 1)
- [TO] Tool Orchestration: 1 step (Step 3)
- [IJ] Interpretive Judgment: 2 steps (Steps 9, 11)
- [EI] Executive Integration: 1 step (Step 11)

**WHAT IS MISSING FROM THIS SCORE:**
- Permalink route (`/tools/ability-demand-index/[element-slug]`) for embed iframe target — add after Step 6 if embed feature is priority
- Occupation bar chart component — not scored here; same pattern as ability trend chart, add as Step 6b if needed before launch
- Mobile layout review — the D3 chart at 700px viewBox needs responsive testing on mobile; add as a hardening step if mobile traffic is expected
