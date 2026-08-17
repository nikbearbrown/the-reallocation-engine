# Figure-generation prompts — 09-is-the-role-any-good-bls-onet-role-quality.md
<!-- Build metadata. NOT part of the published book. Regeneration recipes for figures. -->

## Prompts

### Figure 9.1 — Title-to-occupation resolution pipeline
**Files:** ../images/09-is-the-role-any-good-bls-onet-role-quality-fig-01.svg · ../d3/09-is-the-role-any-good-bls-onet-role-quality-fig-01.html
**Prompt:** Brutalist horizontal process flowchart: raw posting title → model proposes a code → alternate-title verification gate → confirmed path to the joined O\*NET/OEWS row → rejected path looping back to re-propose → read three features. Keep propose visually distinct from confirm; ochre for propose, red/active for the confirmed path, single-direction arrows with one return loop.

### Figure 9.2 — The silent wrong-SOC error
**Files:** ../images/09-is-the-role-any-good-bls-onet-role-quality-fig-03.svg · ../d3/09-is-the-role-any-good-bls-onet-role-quality-fig-03.html
**Prompt:** Brutalist two-panel comparison on a shared zero-based wage scale: left panel an ambiguous title mapped to a wrong occupation (lower band, alternate-title list lacks the work, blocking marker); right panel the corrected occupation (higher band, match confirmed). The visible gap between the bands is the cost of skipping the check. Ochre/blocked left, red/confirmed right.

### Figure 9.3 — The compact row: three role-quality features
**Files:** ../images/09-is-the-role-any-good-bls-onet-role-quality-fig-02.svg · ../d3/09-is-the-role-any-good-bls-onet-role-quality-fig-02.html
**Prompt:** Brutalist structural schematic: one compact occupation row fanning into three parallel feature panels — an employment-trend line across survey years, a wage band at five percentiles, and a five-step job-zone ladder — with the alternate-title list attached above as the confirmation feed. Equal visual weight per panel, one accent color, hairline connectors.

## Key terms

- **SOC code:** the Standard Occupational Classification identifier for the real occupation underneath a job title; the hinge of the whole chapter.
- **O\*NET:** the occupational database of alternate titles, job zones, and ability/skill ratings — what is this work?
- **BLS OEWS:** national employment and wage estimates per occupation — how many exist and what do they pay?
- **Compact table:** the joined O\*NET + OEWS row per occupation produced by `extract-soc-occupation-table.py`.

## Run-log prompt

Record each target's confirmed SOC code, the employment trend and wage band you read, and any title you had to re-classify against the alternate-title list.

[^soc]: SOC classification (and its measurable misclassification rate) is the subject of `projects/soc_classification_draft.md` + `_methods.md` in this repository — a parallel research track. Its quantitative results contain `[TO DO]` placeholders and must not be cited as final numbers. **[verify]**
