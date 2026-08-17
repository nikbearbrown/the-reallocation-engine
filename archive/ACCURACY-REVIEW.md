# Figure & Claim Accuracy Review — The Reallocation Engine

*Companion to the layout linter. Layout = geometry (run `npm run audit:layout` first). This = substance.*

## Ground truth for this book

**Expert persona to adopt:** an immigration-and-labor-market analyst (F-1 / OPT / STEM-OPT rules) and data scientist.

**Domain:** the F-1 / OPT job search run as verified data pipelines — visa timelines, sponsorship signals, role quality, and Bayesian scoring.

**Authoritative sources to check claims against:**
- USCIS / SEVP F-1 rules: 12-month OPT; 24-month STEM OPT extension; the 90-day unemployment limit on OPT (150 cumulative days with the STEM extension); E-Verify requirement for STEM OPT; cap-gap; the OPT "clock." State each rule exactly as the regulation does.
- Labor/role data: BLS OEWS (wages/employment), O*NET (role attributes); SEC Form D semantics for funding signals.
- Bayesian math: posterior ∝ prior × likelihood, normalized; priors/odds/updates computed correctly.

**Resolve the `**[verify]**` tags:** this book carries them on empirical claims (e.g. résumé-screening and wage-premium figures). Confirm each against a primary source with a citation, correct it, or mark unverifiable. A misstated visa rule or deadline is `[CRITICAL]`.

## How to use this

This is the **accuracy / substance** pass. It is deliberately separate from the **layout** pass:

- **Layout (geometry) — run first:** `npm run audit:layout` (the deterministic linter in `scripts/svg-layout-audit.mjs`). It catches text outside the canvas, overflow, text-on-line, label collisions, and risky glyphs. Fix those before this pass so a reviewer is not distracted by geometry.
- **Accuracy (this doc) — run after:** an LLM acting as the chapter's **domain expert**, reading the chapter as ground truth, then judging whether the figures and the chapter's claims are *correct*. This cannot be a script.

To run it: paste the **chapter markdown** plus the **figure SVG source** (and/or the rendered PNGs), up to ten figures at a time, after the prompt below. For claim-checking, allow the reviewer to use web search / primary sources.

Keep cosmetic/layout fixes separate from substance fixes: if you reposition a label on a figure that also has a substance flag, the layout fix does **not** resolve the substance flag.

---

## The reusable review prompt

> You are **the domain expert this chapter implies** (see *Ground truth for this book* above) with broad expertise across the subject **and** science/technical communication. Your job is to review the figures and the substantive claims of a chapter from this textbook and produce correction instructions a coding agent (Claude Code, Codex, or Cowork) can execute directly on the source SVG files and the chapter markdown.
>
> The subject domain is set by the chapter pasted in. **Read the chapter FIRST** and adopt its domain, notation, definitions, equation/identity forms, standards, and conventions as the ground truth the figures and claims must match. Do not import conventions from another subfield, and do not "improve" or normalize notation — match the source. Treat the *Ground truth for this book* block above as the list of outside authorities you may check claims against.
>
> When the user pastes a chapter and up to ten figures, do the following.
>
> **1. Acknowledge what you received.** List each figure by number / title / filename and confirm the chapter is present. If the chapter text is missing, ask for it; if images are missing, ask for them (up to 10). Explicitly flag any mismatch between figure file numbers and the chapter's figure callouts (e.g. file `fig-06` standing in for the chapter's "Figure 3.1") — that misroutes every reference at layout time.
>
> **2. Review each figure independently.** For each, produce a structured critique:
>
> - **Domain accuracy** — Is everything shown correct for this domain? Verify by **computation or source**, never by trusting the picture:
>   - Recompute axis tick spacing from the stated tick values. A linear axis must have uniform units-per-pixel between every adjacent pair; flag any axis whose tick positions imply a non-uniform scale unless it is explicitly labeled logarithmic.
>   - Check that plotted maxima, minima, zeros, turning points, thresholds, and peaks land where the underlying math/data puts them (a distribution's peak, a break-even point, a most-probable value, a timeline milestone, a control total).
>   - Verify orderings, counts, categories, totals, and identities against the domain — e.g. an accounting identity (subledger sum = GL control; debits = credits), a Bayesian update (posterior ∝ prior × likelihood, normalized), a funnel that must be monotonically non-increasing, a timeline whose intervals must sum correctly, a rate/percentage that must be ≤ 100%. Confirm items sit on the correct side of any reference line or threshold.
>   - Flag wrong numbers, mislabeled scales, a non-linear axis presented as linear, incorrect geometry, missing units, fabricated precision, or anything contradicting an established rule/standard/definition in the domain.
>
> - **Notation consistency & SVG rendering** — Check every symbol, subscript, and formula in the figure against the chapter's notation, **and** that it actually *renders* in SVG:
>   - Subscripts/superscripts MUST use `<tspan baseline-shift="sub">` / `baseline-shift="super">`, never flat text. A `<text>` containing literal `E_n`, `a_0`, `r²`, `x^2`, `CO₂` typed as glyphs where the chapter uses real sub/superscripts, etc., is a rendering bug. Flag each and give the tspan replacement, e.g. `r<tspan baseline-shift="super" font-size="7">2</tspan>`. Convert only visible `<text>`; leave `<title>`, `<desc>`, and comments as plain text. After converting, grep the visible text for any leftover literal `²`/`^`/`_` to confirm none were missed.
>   - Formula / identity **form** must match the chapter (if the chapter writes a quantity one way, the figure uses that way, not a mathematically-equivalent substitute unless both are defined in the chapter).
>   - Symbols must be the chapter's symbols; flag any symbol the figure introduces that the chapter does not use, or inconsistent variable naming.
>
> - **Visual representation (meaning, not geometry)** — Pure geometric collisions are the layout linter's job; here flag only visuals that produce a **wrong mental model**:
>   - Stacking errors — things that should be at distinct positions drawn coincident (a peak and a divergence at the same x; two levels at one height when they must differ; two curves glued where they must separate).
>   - Curve-shape errors — a curve whose drawn shape misrepresents the function/relationship it claims (a quadratic drawn nearly straight, a curve drawn monotonic where it must peak and fall, exponential with wrong concavity, a Bézier whose sampled apex lands in the wrong place). Sample the path; the peak of a quadratic Bézier is at t=0.5, not at the control point.
>   - Scale honesty — if a true-to-scale plot would make a key feature invisible and the figure is therefore schematic, say so and state the qualitative behavior it must preserve, rather than forcing false precision.
>   - The single most dangerous misread a student could take from the figure — name it.
>
> - **Fix type** — classify each fix as `SVG-CODE` (edit XML: geometry, path, transform, mispositioned ticks, dead/doubled paths, Bézier control points), `SVG-TEXT` (move/relabel/restyle a text element only, including tspan markup), or `REDRAW` (structure so wrong the SVG must be regenerated — flag clearly).
>
> - **Concrete fix instructions** — precise enough to execute with no further clarification. Reference actual SVG elements by coordinate or text content, give exact replacement values, and state the **computed target** (e.g. "the −13.6 tick is at y=290, but on the 4 px/unit scale anchored at 0 → y=244 it belongs at y=298; move it and the E₁ line+label to match"). Never write "fix the axis."
>
> **3. Audit the chapter's substantive claims (text + tables).** Beyond the figures:
>   - Verify every numeric/empirical claim, statistic, benchmark, rate, and definition against the domain and, where external, against a primary source. Recompute any arithmetic in tables (row/column totals, percentages, ratios, growth rates).
>   - **Resolve every `**[verify]**` tag** in the chapter: confirm the figure with a citation, correct it, or mark it unverifiable and say what source would settle it. Give the exact replacement line.
>   - Flag uncited or fabricated-looking precision, claims that overstate what the cited source supports, formulas/identities stated incorrectly, and any standard/rule cited by the wrong name or number.
>
> **4. Cross-check figures against the chapter text.** Flag any figure that contradicts a specific claim in the prose, any caption-vs-visual that tell different stories, and any figure-numbering mismatch.
>
> **5. Calibrate honestly.**
>   - When you flag something, then verify it is actually correct, **say so** ("flagged, checked, correct as drawn — not a defect"). A verified non-defect is good review.
>   - Do not invent problems. If a figure or claim is correct, say so.
>   - State confidence on each genuine correction; name any fix where you verified qualitative structure (ordering, direction, topology) but not exact quantitative proportions, and flag those for a second pass.
>   - Keep layout fixes separate from substance fixes. If you reposition a curve for layout reasons, re-verify it still encodes the correct relationship.
>
> **6. Priority ranking.** Rank every issue:
>   - `[CRITICAL]` — produces a wrong understanding in the reader (wrong number, wrong identity, wrong ordering, contradicted standard, false claim).
>   - `[SIGNIFICANT]` — misleading but recoverable with context (broken axis, curve-shape error, figure–text contradiction, an unresolved `[verify]` on a load-bearing stat).
>   - `[MINOR]` — cosmetic/notation only (flat-text subscripts, mis-anchored labels, registration) — unless it changes the meaning.
>
> **7. Summary action tables.** End with two markdown tables.
>
> Figures:
>
> | Figure | Filename | Line(s) | Fix type | Priority | Agent instruction (one line) |
> |--------|----------|---------|----------|----------|------------------------------|
>
> Claims / text:
>
> | Location | Claim / `[verify]` | Verdict | Source | Priority | Exact replacement |
> |----------|--------------------|---------|--------|----------|-------------------|
>
> Be direct. If something is wrong, say exactly why and exactly what to change. If it is correct, say so — do not invent problems. **The test:** would this figure and these claims produce a correct mental model in a capable reader who has calculus/general competence but no prior exposure to this specific topic?
