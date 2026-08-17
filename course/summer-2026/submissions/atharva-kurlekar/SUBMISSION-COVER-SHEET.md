# Capstone Submission — Cover Sheet

**Student:** Atharva Kurlekar
**Contribution:** A local/metro wage-adjustment layer over BLS OEWS national numbers
**Chapter the gap comes from:** Chapter 9 — *Is the Role Any Good: BLS / O\*NET Role Quality*
**Date:** 2026-08-16

> Convert this file to PDF and upload it. It is the single file the assignment asks for;
> everything else is reachable from the links below.

---

## 1. Links

| What | Link |
|---|---|
| **Pull request (the graded PR)** | https://github.com/nikbearbrown/the-reallocation-engine/pull/43 |
| **Explainer video** | https://youtu.be/tmo4-csCJCM |
| **My fork** | https://github.com/Atharva-Kurlekar7/the-reallocation-engine |
| **Upstream repo** | https://github.com/nikbearbrown/the-reallocation-engine |
| **Branch** | `contrib/atharva-kurlekar-local-wage-adjustment` |

**PR state at submission:** OPEN · MERGEABLE · no PII in the diff.
`npm run verify` and `npm run doctor` both pass on the branch head. (File and commit
counts are on the PR itself — quoting them here only guarantees they go stale.)

---

## 2. Deliverables and where each one lives

All paths are inside the PR unless noted.

| # | Deliverable (from the assignment) | File |
|---|---|---|
| 1 | **The contribution — code** | `scripts/bls/local-wage-adjustment.py` |
| 2 | **The contribution — AI recipe** (9 sections) | `recipes/local-wage-adjustment.md` |
| 3 | **The contribution — human card** (≥4 failure modes) | `recipes/local-wage-adjustment.card.md` |
| 4 | **Verified-data attestation** (signed) | `logs/attestations/local-wage-adjustment.md` |
| 5 | **The honest run** | `reports/generated/local-wage-adjustment-20260817.md` |
| 6 | **Portfolio piece** | `assignments/submissions/atharva-kurlekar/local-wage-adjustment-portfolio.md` |
| 7 | **Explainer video** | uploaded to YouTube — link above |
| 8 | Audit / provenance + SHA-256s | `data/BLS/local-wage-adjustment-audit.md` |
| 9 | Run log entries | `logs/RUN_LOG.md` (three entries, 2026-08-15 and 2026-08-16) |
| 10 | Data extracts (committed inputs) | `data/BLS/local-wage/` |
| 11 | Machine logs | `logs/local-wage-adjustment-20260815.json`, `-20260817.json` |

**Superseded but deliberately kept:** `reports/generated/local-wage-adjustment-20260815.md`
carries a correction header rather than being overwritten — see §5.

---

## 3. What the contribution does

Takes a `(metro area, SOC occupation code)` pair and returns a cost-of-living-adjusted wage
band built from two public federal datasets — or `missing` with exactly one reason code.

- Joins **BLS OEWS metro wages** (May 2024) to **BEA Regional Price Parities** (2024)
- Matches on **exact** `AREA` = `GeoFIPS` codes — 387 matches, no fuzzy city-name guessing
- `real = nominal / (RPP / 100)`
- Four reason codes: `no-metro-match` · `no-occupation-row` · `suppressed-small-sample` · `no-crosswalk-match`
- **No interpolation, no national fallback.** A failed gate empties every wage column.

**The measurable result:** on a sample of 112 metro–occupation pairs frozen *before* the run,
**100 returned a real adjusted wage**. The other 12 are reported missing with their reason —
not filled in, not averaged as zero.

**Worked example:** New York × SOC 15-1252 (Software Developers) → nominal median `$161,970`,
RPP `112.563`, adjusted median **`$143,892.75`**.

---

## 4. The one limitation it cannot verify

**It cannot tell you what a specific employer will pay you.** OEWS is an occupation-metro
survey, not a job offer, and no amount of cost adjustment turns it into one.

Two further limits, stated rather than hidden: it feeds no decision yet (the Ch 11 composite
still carries `role_quality: 0.0`, so an adjusted wage changes no Apply/Consider/Skip outcome),
and it cannot verify that a job title maps to the correct occupation code — that stays a human call.

---

## 5. A defect I found in my own work

The first run (2026-08-15) reported all 12 missing rows as `suppressed-small-sample`. Six of
them had **no BLS row at all** — a different fact about the world than a suppressed estimate.
One code path was returning the same answer for two different events.

I split it, added `no-occupation-row`, and re-ran. Coverage stayed `100/112` and not one wage
cell changed, but six rows were reclassified. The superseded report is kept in the repository
with a correction header instead of being overwritten, so the mistake stays in the record.

---

## 6. Ethics gates, shown passing

```
$ npm run doctor
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

$ npm run verify
conformance: 138 files (79 md · 2 sh · 32 py · 23 js · 1 yaml · 1 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
```

No `data/ats/` and no `private/` file was read or written for this run. The contribution uses
public BLS/BEA extracts only.

---

## 7. Reproduce any number in this submission

```bash
git clone https://github.com/Atharva-Kurlekar7/the-reallocation-engine
cd the-reallocation-engine
git checkout contrib/atharva-kurlekar-local-wage-adjustment

# an honest miss — BLS suppressed the median
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1252

# a different miss — no BLS row exists at all
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1243

# no fuzzy matching — a typo does not silently resolve
python3 scripts/bls/local-wage-adjustment.py --metro "New Yrok" --soc 15-1252

# the worked example
python3 scripts/bls/local-wage-adjustment.py \
  --metro "New York-Newark-Jersey City, NY-NJ" --soc 15-1252

# the full frozen sample: coverage 100/112
python3 scripts/bls/local-wage-adjustment.py \
  --sample data/bls/local-wage/sample.csv --aggregate --json
```

---

## 8. Before uploading — checklist

- [ ] YouTube video uploaded, set to **Unlisted or Public** (not Private — a grader cannot open Private)
- [ ] YouTube link pasted into §1 above
- [ ] Portfolio piece exported to PDF
- [ ] This cover sheet exported to PDF
- [ ] PR #43 still OPEN
