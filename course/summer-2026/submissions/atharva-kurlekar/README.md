# Capstone submission — local wage-adjustment layer (Ch 9)

**Atharva Kurlekar** · contribution to The Reallocation Engine

A layer that turns a national BLS OEWS wage into a metro one, adjusted for local price level
using BEA Regional Price Parities — or returns `missing` with a reason code. It never
interpolates and never falls back to the national figure.

- **[SUBMISSION-COVER-SHEET.md](SUBMISSION-COVER-SHEET.md)** — every link, deliverable path,
  and reproduce command, in one place. Start here.
- **[local-wage-adjustment-portfolio.md](local-wage-adjustment-portfolio.md)** — the case study,
  written for a technical hiring manager.

Pull request: [nikbearbrown/the-reallocation-engine#43](https://github.com/nikbearbrown/the-reallocation-engine/pull/43)
Run steps for the layer itself: [`scripts/bls/README.md`](../../../scripts/bls/README.md)
