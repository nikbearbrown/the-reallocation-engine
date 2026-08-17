# Local wage adjustment for The Reallocation Engine

**Atharva Kurlekar** · August 2026
Contribution to [The Reallocation Engine](https://github.com/nikbearbrown/the-reallocation-engine), an evidence-first job-search system for international students.

Pull request: [nikbearbrown/the-reallocation-engine#43](https://github.com/nikbearbrown/the-reallocation-engine/pull/43) · Walkthrough: [youtu.be/tmo4-csCJCM](https://youtu.be/tmo4-csCJCM) (4:19) · Runnable in three commands (below). Note on the video footage at the end.

---

## The problem

I am an F-1 student. When my OPT clock starts, the scarce resource is not job postings — it is my own attention. Every application I write is one I cannot write somewhere else, so the decision that matters is which roles to spend that effort on.

The engine already read role quality from BLS Occupational Employment and Wage Statistics (OEWS). But it read the *national* estimate, and the book is explicit about why that is a limit rather than an answer:

> "National OEWS estimates are national and lagging… They don't capture… what the local market pays in your city… The compact row tells you the occupation's gravity; it cannot tell you the specific role's orbit around it."
> — `chapters/09-is-the-role-any-good-bls-onet-role-quality.md`

That gap has a direction. An employer posting in a high-cost metro knows its salary band buys less there; a candidate comparing a national median against a Manhattan offer does not, unless someone does the arithmetic. Ranking roles by nominal pay alone misleads you at exactly the metros where the number flatters the offer most.

## What I built

A layer that answers one question: **for this metro and this occupation, what do BLS and BEA jointly support as a cost-adjusted wage?**

It is a sequence of gates, not a scoring function. Resolve the metro to a BLS `AREA` by exact code or exact title — no fuzzy matching, so `New Yrok` is not New York. Read `A_MEDIAN` from the OEWS row for `(AREA, SOC)`. Join that `AREA` to a BEA `GeoFIPS` on exact code equality via a static crosswalk (387 matches) and read the 2024 all-items Regional Price Parity. Then adjust: `real = nominal / (RPP / 100)`, where the U.S. average RPP is 100. Finally, flag — never rewrite — any row whose adjusted median falls outside 0.3×–3× of the national median.

Any gate that fails ends the row. The output is `missing` plus exactly one reason code, every wage column empty:

| Reason | What actually happened |
|---|---|
| `no-metro-match` | the input never resolved to a BLS area |
| `no-occupation-row` | the metro resolved, but BLS publishes no row for that occupation there |
| `suppressed-small-sample` | the row exists and BLS suppressed the median (`*`, `**`, `#`) |
| `no-crosswalk-match` | no exact BEA price index for that area code |

There is no national fallback and no interpolation from neighbouring metros. A missing row stays missing, because the alternative — quietly substituting the national figure into a metro cell — is the exact error the layer exists to prevent.

Interfaces: `scripts/bls/local-wage-adjustment.py` (CLI, single pair or batch CSV), plus a recipe for agents and a card for humans.

## The honest number

On a sample of **112 metro–occupation pairs** — 14 metros × 8 occupation codes, frozen in `data/bls/local-wage/sample.csv` *before* the run so the denominator could not be chosen afterwards:

```
coverage = 100/112 (ok=100 attempted=112
                    missing_reason={'suppressed-small-sample': 6, 'no-occupation-row': 6})
```

100 pairs returned a cost-adjusted wage traceable to a named BLS row and a named BEA row. The 12 that did not are reported with their reason and empty wage fields. I quote the count and denominator rather than a percentage, because a percentage would hide both the denominator and the fact that the 12 misses are two different events. The batch mean of adjusted medians is **$124,695.15** over the **100 ok rows** — the 12 missing excluded, not counted as zero — and the plausibility gate flagged **0** rows and rewrote none.

Worked example from the output CSV: New York-Newark-Jersey City × SOC 15-1252 (Software Developers) → nominal median **$161,970**, RPP **112.563**, adjusted median **$143,892.75**. New York's nominal premium shrinks by roughly $18,000 once its price level is applied. That is the entire point of the layer.

**The improvement I can defend is not a bigger number — coverage was 100/112 before and after. It is a class of silent error removed.** The first run reported all 12 missing rows as `suppressed-small-sample`. That was wrong, and the bug was mine: one code path returned "suppressed" both when BLS had suppressed a median and when there was no OEWS row at all. Six of the twelve had no row. I split the path, added `no-occupation-row`, and re-ran — coverage held and not one wage cell changed, but the classification of six rows did. The superseded report is kept with a correction header rather than overwritten.

## Verified versus inferred

Every field the tool emits carries a label. That boundary is the deliverable as much as the numbers are:

| Field | Label | Where it comes from |
|---|---|---|
| Metro nominal wage (mean / median) | `record` | OEWS row for `(AREA, OCC_CODE)` in `metro_oews.csv` |
| BEA 2024 all-items RPP | `record` | `bea_rpp.csv`, joined on exact `AREA` = `GeoFIPS` |
| Adjusted median and 25th–75th band | `script-output` | `real = nominal / (RPP / 100)` |
| Coverage `100/112` | `script-output` | count of `status=ok` over the 112 pre-declared rows |
| Missing reason codes | `script-output` | which gate failed |
| The 8-occupation target list | `your-input` | my own choice of roles to test — a judgment, not a finding |
| Skill-match percentage | **not emitted** | out of scope; no defensible way to compute it here |

Source files carry URLs and SHA-256 hashes in `data/BLS/local-wage-adjustment-audit.md`, and every output row names the `source_bls_file` and `source_bea_file` it came from.

## Failure modes I expect

1. **Drift.** BLS or BEA ship a new annual file with renamed columns and the parser reads a flag as a wage. *Mitigation:* suppression tokens stay text and never coerce to numbers; sources are hashed; column maps re-checked each ingest.
2. **Contract violation.** Someone later adds a skill-match score into the same CSV as the wage, blending a model judgment into a column of records. *Mitigation:* the card forbids blending; the recipe refuses rather than obliges.
3. **Crosswalk staleness.** OMB redraws metro boundaries and the static exact-code table goes wrong. *Mitigation:* unmatched codes stay `no-crosswalk-match`, no name-based guessing; the table is rebuilt from a new vintage, not patched.
4. **Suppression misread.** Treating `*` as zero — or as missing-at-random and safe to interpolate — fabricates a wage. Labelling an *absent* row "suppressed" is the same error one step earlier: it claims to know why the data is not there. *Mitigation:* separate reason codes, with Glens Falls × 15-1252 as a permanent fixture for the suppression path.

## The limitation it cannot verify

**It cannot tell you what a specific employer will pay you.** OEWS is a survey of occupations within metro areas; it is not an offer, and no amount of cost adjustment turns it into one. A company that just closed a Series A may pay at the top of the band; one burning runway may sit below the median with equity attached. What the layer establishes is a comparison at the occupation level, so two cities can be read on the same scale. Reading a personal salary quote out of it would be a misuse, which the card says plainly.

Two related limits: it cannot verify that a job title maps to the right occupation code (frontier titles stay a human call), and when BLS publishes no row it records only *that* the row is absent, never why.

## How to check any of this

```bash
# an honest failure — a real metro, a suppressed median, no invented wage
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1252

# the worked example
python3 scripts/bls/local-wage-adjustment.py \
  --metro "New York-Newark-Jersey City, NY-NJ" --soc 15-1252

# the full sample and its coverage
python3 scripts/bls/local-wage-adjustment.py \
  --sample data/bls/local-wage/sample.csv --aggregate --json
```

**On the video footage.** The terminal sequence in the [walkthrough](https://youtu.be/tmo4-csCJCM) is an animated reconstruction, not a live screen capture: the text came from a real run, but two lines are truncated with `...` to fit a slide. I flag it rather than let the footage imply otherwise — a rendered terminal that looks live is the same class of error this contribution exists to catch. A genuine 44.79s capture of both commands in a real pty exists at `youtube/national-pay-is-not-local-pay/live/take.cast`; the regression that dropped it from the cut is logged in `logs/RUN_LOG.md`. The reliable check on this page is the three commands above.

Full trail: recipe `recipes/local-wage-adjustment.md` · card `recipes/local-wage-adjustment.card.md` · report `reports/generated/local-wage-adjustment-20260817.md` · attestation `logs/attestations/local-wage-adjustment.md` · provenance `data/BLS/local-wage-adjustment-audit.md` · history `logs/RUN_LOG.md`.

**AI use.** I used Claude and Cursor to draft the script, recipe, and card, and to build the video. The judgments were mine: which occupations to test, freezing the sample before measuring coverage, refusing the national fallback. The reason-code defect was surfaced by a review pass, not caught by me on first write; I own that it was my logic and that it survived because the output was well-formed and confidently wrong. Deciding it was a real error rather than cosmetic, and keeping the superseded report in the tree, were my calls. That is the failure mode this project is about, and it caught me too.
