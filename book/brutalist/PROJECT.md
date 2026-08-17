# PROJECT.md — Brutalist D3 × Claude
*Phase Gate: both layers populated before Generate begins. Load alongside CLAUDE.md every session.*
*Generated: May 2026 · Stack: D3 v7 + single-file HTML/SVG*

---

## Layer 1 — Intent

**What this project is.**
A textbook teaching data visualization graphicacy through D3 v7 and Claude Code. Every chart in the pantry is a working, audited, publication-ready HTML file. The reader can paste one prompt into Claude Code and have a working chart of any type in seconds — then replace the data with their own.

**What a reader should understand after using it.**
That the design layer — which channel, which form, which baseline rule — is the hard layer. Claude Code handles syntax. The reader handles judgment. The specification is the work.

**The question this project answers.**
Given a dataset and a communication goal, what is the correct chart and how do I specify it precisely enough that Claude Code produces it right on the first attempt?

**The question it refuses to answer.**
Which chart looks most impressive. Aesthetics are a consequence of correct encoding, not a goal.

**Tone.** Editorial. Skeptical. Unsparing. Every mark earns its presence by serving the communication question.

---

## Layer 2 — The Decision Pipeline

*Distilled from the book. Apply in sequence. Do not skip steps.*

### Before writing any prompt

1. **Name the reader's question** (not the analyst's). One sentence.
2. **"Compared with what?"** Name the explicit comparison. If you can't, the chart isn't ready.
3. **Identify the chart family** using the FT Visual Vocabulary: comparison / change over time / distribution / relationship / part-to-whole / hierarchy / flow / spatial.
4. **Decompose the channels**: marks, then channel-to-attribute for each. Magnitude channels (position, length, area, luminance) for quantitative. Identity channels (hue, shape) for categorical.

### Writing the prompt (four moves, always)

| Move | Content |
|---|---|
| **Show** | Data shape: rows, columns, types, a 3-row sample |
| **Say** | Chart type named explicitly. D3 v7. Single HTML file, inline CDN. |
| **Constrain** | Every channel-to-attribute mapping. Sort order. Zero baseline if bars. Scale function if bubbles. Projection if geographic. Margins. Dark mode. |
| **Verify** | "Restate the channel decomposition. Comment each line. List unspecified decisions." |

### Hard encoding rules

- **Bar / area charts:** zero baseline. Non-negotiable. `domain([0, max])`.
- **Bubble / symbol radius:** `d3.scaleSqrt()`. Never `d3.scaleLinear()`.
- **Choropleth projection:** `d3.geoEqualEarth()` (world) or `d3.geoAlbersUsa()` (US). Never Mercator.
- **Heatmap color scale:** sequential (unipolar data) or diverging (meaningful midpoint). Never rainbow.
- **Stacked area:** most stable series at bottom. Zero baseline on the bottom layer.
- **Line chart:** y-axis range is a design choice, not a proportional-ink obligation. Point position is the channel, not area.
- **Pie chart:** five slices maximum. Past five, sort descending and aggregate remainder as "Other" — or switch to a horizontal bar chart.
- **Box plot whiskers:** Tukey's 1.5×IQR rule. Not min/max.

### The three D3 v7 failure modes

| Failure | Symptom | Fix |
|---|---|---|
| API hallucination | Runtime error on a d3.* call | Specify version; check CDN reference; run before accepting |
| Chart-type mismatch | Technically valid, wrong question | Name the chart type in Move 2 |
| Channel mismatch | Hue on quantitative, luminance on categorical | Specify every mapping in Move 3 |

### Audit before publishing (Evergreen/Emery — five categories)

- **Text:** title names the finding, not the occasion. Axes labeled with units. Comparison named explicitly.
- **Arrangement:** sorted by value. Space efficient. Reading order matches visual flow.
- **Color:** purposeful — encodes a specific attribute. Palette type matches data type. Color-blind safe. Dark mode specified.
- **Lines:** light gridlines at ticks only. No 3D effects. No perspective. Consistent stroke widths.
- **Overall:** every element passes Few's test ("does this support the message?"). Proportional ink maintained. ARIA role + aria-labelledby + `<title>` + `<desc>` on every SVG.

### Cairo's purpose test (run last)

After the audit passes: *can a reader from the target audience answer the question the chart was supposed to answer in five seconds?* If no, the chart has failed regardless of the audit score.

---

## Output inventory

| ID | File | Status | Notes |
|---|---|---|---|
| P01–P61 | `pantry/*.html` | in-progress | 61 chart types; see pantry directory |

---

*The code is generated against the schema. The schema is built by the human. The human decides what ships.*


---

## Graph-Making Guidelines

### Before you write any prompt

**Name the reader's question.** One sentence. Not "show the data" — a specific question a specific person needs answered.

**Name the comparison.** "Compared with what?" If you cannot name the explicit reference, the chart isn't ready.

**Identify the chart family** (FT Visual Vocabulary): comparison / change over time / distribution / relationship / part-to-whole / hierarchy / flow / spatial.

**Decompose the channels**: what are the marks? What data attribute does each channel carry? Magnitude channels (position, length, area, luminance) for quantitative. Identity channels (hue, shape) for categorical.

---

### Channel accuracy hierarchy (Cleveland & McGill 1984)

Use the highest-ranked appropriate channel for the most important attribute.

| Rank | Channel | Best for |
|------|---------|----------|
| 1 | Position along a common scale | Quantitative |
| 2 | Position along non-aligned scales | Quantitative |
| 3 | Length | Quantitative |
| 4 | Angle / slope | Quantitative |
| 5 | Area | Quantitative |
| 6 | Color luminance | Quantitative (ordered) |
| 7 | Color hue | Categorical only |
| 8 | Shape / texture | Categorical only |

**Expressiveness principle:** The channel must be capable of expressing the attribute type. Quantitative on magnitude channels; categorical on identity channels.

**Effectiveness principle:** The most important attribute gets the highest-ranked appropriate channel.

---

### Hard rules by chart type

**All bar / area charts**
- Zero baseline. Non-negotiable. `domain([0, max])`.
- Bars sorted by value (descending) unless a natural order exists.
- Horizontal bars when labels exceed ~12 characters.

**Bubble / symbol charts**
- `d3.scaleSqrt()` for radius. Never `d3.scaleLinear()`.
- Area must be proportional to value, not radius.

**Line charts**
- Zero baseline is a *design choice*, not an obligation — channel is point position, not bar length.
- Use `d3.curveLinear` by default. `d3.curveMonotoneX` for slight smoothing only.
- Mark gaps in data explicitly; do not compress the axis across them.

**Area charts**
- Zero baseline required — channel is area; proportional ink applies.

**Choropleths**
- `d3.geoEqualEarth()` (world) or `d3.geoAlbersUsa()` (US). Never Mercator.
- Encode rates, not absolute counts. Absolute counts mostly show population density.
- Sequential scale (unipolar) or diverging (meaningful midpoint).

**Heatmaps**
- Sequential palette for unipolar data; diverging for bipolar.
- Never rainbow / categorical hue for a quantitative channel.
- Sort rows and columns by value, not alphabetically.

**Pie / donut charts**
- Five slices maximum. Past five: sort descending, aggregate remainder as "Other" — or switch to a sorted horizontal bar chart.

**Treemaps**
- `d3.treemapSquarify`. Not slice-and-dice.
- Three levels maximum for static display.

**Stacked area**
- Most stable series at the bottom. Zero baseline on the bottom layer.

**Box plots**
- Tukey's 1.5×IQR rule for whiskers. Not min/max.

**Scatter / bubble with a trend line**
- Always annotate: "Correlation does not imply causation."
- For overplotting (n > ~500): add alpha transparency (0.1–0.3), jitter, or hexbin.

---

### The four-move prompt (write this before any Claude Code session)

| Move | What it contains |
|------|-----------------|
| **Show** | Data shape: rows, columns, types, 3-row sample |
| **Say** | Chart type named explicitly. D3 v7. Single HTML file, inline CDN. |
| **Constrain** | Every channel-to-attribute mapping. Sort order. Zero baseline if bars. Scale function. Margins. Dark mode. |
| **Verify** | "Restate the channel decomposition. Comment each line. List unspecified decisions." |

---

### Audit before publishing (Evergreen / Emery — five categories)

**Text:** Title names the finding, not the occasion. Axes labeled with units. Comparison named explicitly in the subtitle.

**Arrangement:** Sorted by value. Space efficient. Reading order matches visual flow.

**Color:** Purposeful — encodes a specific attribute. Palette type matches data type. Color-blind safe (test in deuteranopia simulation). Dark mode specified.

**Lines:** Light gridlines at ticks only (`#c8c4c0`, 0.75px). No 3D effects. No perspective. Consistent stroke widths.

**Overall:** Every element passes Few's test ("does this support the message?"). Proportional ink maintained. ARIA `role="img"` + `aria-labelledby` + `<title>` + `<desc>` on every SVG.

---

### Cairo's purpose test (run last)

After the audit passes: *can a reader from the target audience answer the question the chart was supposed to answer in five seconds?*

If no, the chart has failed regardless of the audit score.


