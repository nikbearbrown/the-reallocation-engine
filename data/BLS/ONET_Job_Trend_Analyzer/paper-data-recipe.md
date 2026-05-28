# Data Pull Recipe
## For: O*NET Job Trend Analyzer — Paper Support Queries
## Purpose: Generate the empirical data for "Has AI Really Transformed the Job Market?"
## Schema source: Boondoggle Score (bls_employment + onet_abilities + onet_occupations)

---

## WHAT THE PAPER NEEDS

The paper argues that AI-driven employment disruption correlates with the
**cognitive tier composition** of an occupation — not its industry, technology
adjacency, or occupation label.

Three tiers are in play:

- **Tier 1 — Pattern & Association** (AI is superhuman here): expect employment decline
- **Tier 3 — Social & Personal** (AI simulates, doesn't feel): expect stable or growth
- **Tier 4/5 — Metacognitive/Causal** (AI is poor to absent): expect growth + wage premium

The data pull has three parts. Each part is a SQL query against the Neon database.
Results feed directly into the paper. No interpretation required from the team —
just clean output in the format specified.

---

## PART 1 — EMPLOYMENT INDEX TABLE

**What it produces:** A table showing employment index (2018 = 100) for
12 anchor occupations across three tiers, for years 2018, 2020, 2022, 2024.

**Why these years:** 2018 is baseline (index = 100 by definition). 2020 captures
pre-ChatGPT AI impact. 2022 is the ChatGPT inflection point. 2024 is the most
recent measured data.

**Query:**

```sql
SELECT
  o.title,
  o.major_group_name,
  b.year,
  b.employment,
  b.employment_index,
  b.is_suppressed
FROM bls_employment b
JOIN onet_occupations o ON o.soc_code_bls = b.soc_code
WHERE b.soc_code IN (
  -- TIER 1: Pattern & Association (expect decline)
  '15-1251',  -- Computer Programmers
  '43-9021',  -- Data Entry Keyers
  '43-9081',  -- Proofreaders and Copy Markers
  '23-2093',  -- Legal Secretaries and Administrative Assistants

  -- TIER 3: Social & Personal (expect stable or growth)
  '41-4012',  -- Sales Representatives, Wholesale and Manufacturing
  '21-1029',  -- Social Workers, All Other
  '29-1141',  -- Registered Nurses
  '25-2021',  -- Elementary School Teachers

  -- TIER 4/5: Metacognitive & Causal (expect growth)
  '15-1252',  -- Software Developers
  '13-1111',  -- Management Analysts
  '11-9111',  -- Medical and Health Services Managers
  '11-9041'   -- Architectural and Engineering Managers
)
AND b.year IN (2018, 2020, 2022, 2024)
AND b.is_suppressed = FALSE
ORDER BY b.soc_code, b.year;
```

**Expected output format** (paste into paper scaffold below):

| Occupation | Tier | 2018 | 2020 | 2022 | 2024 | Direction |
|------------|------|------|------|------|------|-----------|
| Computer Programmers | 1 | 100 | [?] | [?] | [?] | ↓ |
| Data Entry Keyers | 1 | 100 | [?] | [?] | [?] | ? |
| Proofreaders & Copy Markers | 1 | 100 | [?] | [?] | [?] | ? |
| Legal Secretaries | 1 | 100 | [?] | [?] | [?] | ? |
| Sales Representatives | 3 | 100 | [?] | [?] | [?] | ? |
| Social Workers | 3 | 100 | [?] | [?] | [?] | ? |
| Registered Nurses | 3 | 100 | [?] | [?] | [?] | ? |
| Elementary School Teachers | 3 | 100 | [?] | [?] | [?] | ? |
| Software Developers | 4/5 | 100 | [?] | [?] | [?] | ↑ |
| Management Analysts | 4/5 | 100 | [?] | [?] | [?] | ? |
| Medical & Health Services Mgrs | 4/5 | 100 | [?] | [?] | [?] | ? |
| Architectural & Eng. Managers | 4/5 | 100 | [?] | [?] | [?] | ? |

**Verification check:** Computer Programmers 2024 should be ~48.
Software Developers 2024 should be ~126. If not, the index
computation has an error — flag before delivering.

---

## PART 2 — COGNITIVE ABILITY PROFILES

**What it produces:** For each of the 12 occupations, the mean Level score
on the five O*NET cognitive abilities most relevant to the Tier 1 vs Tier 4/5
distinction. These are the abilities where the taxonomy predicts the sharpest
contrast between declining and growing occupations.

**The five target abilities and why:**

| Element ID | Ability Name | Tier relevance |
|------------|-------------|----------------|
| 1.A.1.b.2 | Originality | Tier 4/5 — generating novel solutions; AI is weak |
| 1.A.1.b.3 | Problem Sensitivity | Tier 4/5 — noticing something is wrong; AI misses this |
| 1.A.1.b.4 | Deductive Reasoning | Tier 1/4 — boundary case; present in both |
| 1.A.1.b.5 | Inductive Reasoning | Tier 4/5 — forming rules from cases; AI pattern-matches, doesn't reason |
| 1.A.1.e.1 | Selective Attention | Tier 1 — sustained focus on pattern; AI is strong |

**Note to team:** If element IDs don't match exactly in your database,
query by element_name instead. The O*NET 30.2 element names are stable.

**Query:**

```sql
SELECT
  o.title,
  o.major_group_name,
  a.element_id,
  a.element_name,
  a.data_value AS level_score,
  a.lower_ci,
  a.upper_ci,
  a.n
FROM onet_abilities a
JOIN onet_occupations o ON o.soc_code = a.soc_code
WHERE o.soc_code_bls IN (
  '15-1251', '43-9021', '43-9081', '23-2093',
  '41-4012', '21-1029', '29-1141', '25-2021',
  '15-1252', '13-1111', '11-9111', '11-9041'
)
AND a.scale_id = 'LV'
AND a.element_name IN (
  'Originality',
  'Problem Sensitivity',
  'Deductive Reasoning',
  'Inductive Reasoning',
  'Selective Attention'
)
AND a.recommend_suppress = FALSE
ORDER BY o.title, a.element_name;
```

**Expected output format:**

One row per occupation per ability. The paper needs this as a pivot:
occupations as rows, abilities as columns, Level score as values.
If your query tool can pivot, do it. If not, deliver flat and note it.

**Verification check:** Software Developers should score higher than
Computer Programmers on Originality and Problem Sensitivity.
If scores are identical or reversed, flag it — this is the paper's
central empirical claim.

---

## PART 3 — SOCIAL ABILITY PROFILES (TIER 3 VALIDATION)

**What it produces:** For the four Tier 3 occupations, scores on the
O*NET social and interpersonal abilities. This validates the prediction
that Tier 3 occupations score high on dimensions AI cannot replicate.

**Target abilities:**

| Element ID | Ability Name | Tier relevance |
|------------|-------------|----------------|
| 1.A.4.a.1 | Oral Comprehension | Communication baseline |
| 1.A.4.a.4 | Speech Clarity | Human interaction quality |
| 1.A.1.g.1 | Perceptual Speed | Reading a room, reading a client |

**And from Skills (onet_skills table):**

| Element name | Relevance |
|-------------|-----------|
| Social Perceptiveness | Core Tier 3 — noticing others' reactions |
| Active Listening | Core Tier 3 — present, not pattern-matching |
| Persuasion | Sales, negotiation — why salespeople exist |
| Instructing | Teaching — why teachers exist |
| Service Orientation | Nursing, social work |

**Query:**

```sql
SELECT
  o.title,
  s.element_name,
  s.data_value AS level_score,
  s.lower_ci,
  s.upper_ci
FROM onet_skills s
JOIN onet_occupations o ON o.soc_code = s.soc_code
WHERE o.soc_code_bls IN (
  '41-4012',  -- Sales Representatives
  '21-1029',  -- Social Workers
  '29-1141',  -- Registered Nurses
  '25-2021'   -- Elementary School Teachers
)
AND s.scale_id = 'LV'
AND s.element_name IN (
  'Social Perceptiveness',
  'Active Listening',
  'Persuasion',
  'Instructing',
  'Service Orientation'
)
AND s.recommend_suppress = FALSE
ORDER BY o.title, s.element_name;
```

**Verification check:** Sales Representatives should score high on
Persuasion. Registered Nurses should score high on Social Perceptiveness
and Service Orientation. If these are below 3.5 on the 0–7 scale,
something is wrong with the import — flag it.

---

## PART 4 — OVERALL FIELD AVERAGES (CONTEXT BANDS)

**What it produces:** The overall mean Level score for each of the
target abilities across all ~1,000 occupations. This is the baseline
that lets the paper say "Occupation X scores above the workforce
average on Problem Sensitivity."

**Query:**

```sql
SELECT
  element_name,
  mean_value AS overall_mean,
  ci_lower,
  ci_upper,
  occupation_count
FROM onet_ability_stats
WHERE group_type = 'overall'
AND element_name IN (
  'Originality',
  'Problem Sensitivity',
  'Deductive Reasoning',
  'Inductive Reasoning',
  'Selective Attention'
)
ORDER BY element_name;
```

**And for skills:**

```sql
SELECT
  element_name,
  mean_value AS overall_mean,
  ci_lower,
  ci_upper,
  occupation_count
FROM onet_skill_stats
WHERE group_type = 'overall'
AND element_name IN (
  'Social Perceptiveness',
  'Active Listening',
  'Persuasion',
  'Instructing',
  'Service Orientation'
)
ORDER BY element_name;
```

---

## DELIVERY FORMAT

Please deliver all four query results as:

1. A single CSV file with a `query_part` column identifying which
   part each row comes from (Part1, Part2, Part3, Part4)
2. The pivot table for Part 2 if your tooling supports it
3. Any suppressed values flagged explicitly — do not silently drop them
4. Any SOC codes that returned no rows — list them so we can find
   the correct codes

**Do not interpret the results.** Deliver the numbers.
The paper will be built from what the data actually shows —
including if it contradicts the hypothesis.

---

## IF SOC CODES DON'T MATCH

BLS SOC codes changed between vintages. If a code returns no rows, try:

- Data Entry Keyers: try `43-9021` and `43-9020`
- Legal Secretaries: try `23-2093` and `43-6012`
- Proofreaders: try `43-9081` — this occupation may be suppressed
  in recent years (small workforce). Flag if suppressed post-2020.

If an occupation is suppressed for 2+ consecutive years, note it —
suppression itself may be evidence of employment collapse too small
to report, which strengthens the Tier 1 argument.

---

*Recipe version 1.0 — generated May 2026*
*Feed results to CRITIQ paper scaffold when available*
