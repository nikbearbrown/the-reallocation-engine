# scripts/contrib/ — student contribution namespace

Every student contribution lives in its own directory:

    scripts/contrib/<term>/<github-handle>-<component>/
    e.g. scripts/contrib/2026fa/skini-gate-harness/

Inside: your scripts, your tests (`*.test.mjs` for `node --test`, or a
self-running harness that exits 0/1), your fixtures (including any
`BROKEN-*` mutant scorers — never place those beside production code), and a
`README.md` with owner frontmatter (`owner`, `term`, `component`, `status`,
`promoted_to: null`).

Rules (CI-enforced): you may only create files under your own directory,
your own `recipes/cases/<term>/` recipe+card, your own `logs/runs/` entries,
and `course/<term>/submissions/<handle>/` — plus at most ONE maintained file
you are deliberately patching, declared in your PR body. Contribution tools
do not get package.json scripts; a maintainer adds one at promotion time.
Promotion into `scripts/<domain>/` is a maintainer decision requiring
lifecycle status ≥ RUNNABLE-SAMPLE with RUN_LOG evidence.
