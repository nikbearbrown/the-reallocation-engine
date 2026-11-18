---
owner: sanjanaalapati02
term: 2026fa
component: liveness-factor
status: DRAFT
promoted_to: null
---

# liveness-factor — ATS liveness verdicts → the scorer's liveness gate

The ATS liveness classifier (`scripts/ats/liveness-core.mjs`,
`scripts/ats/liveness-browser.mjs`) emits a **string** verdict:
`{ result, code, reason }`. The Bayesian Role Scorer (`scripts/score/role-scorer.mjs`,
Ch.11) consumes a **number**: `role.liveness.factor`, a 0–1 gate multiplier.

Nothing translated between them. `scan.mjs --verify` uses the verdict to route
offers into buckets and then discards the `code`, persisting only a coarse status
word to `scan-history.tsv` — `skipped_expired` collapses five distinct codes into
one. Factors in `roles.json` were written by hand.

This contribution is that translation, and nothing else. It does not classify, it
does not score, and it changes no maintained file.

## What's here

| File | Purpose |
|---|---|
| `liveness-factor.mjs` | Pure policy table: all 12 classifier codes → `{ factor, source }`, or a loud refusal. No I/O. |
| `liveness-factor.test.mjs` | 47 offline tests. Includes a drift guard that greps the real classifier sources. |
| `attach-liveness.mjs` | Attaches the mapped gate to role records. Pure core + a `--live` Playwright shell. |
| `attach-liveness.test.mjs` | 32 offline tests. Verdicts injected — no Chromium, no network. |

## The mapping

| Code | Factor | Source | Why |
|---|---:|---|---|
| `apply_control_visible` | 1.0 | `record` | A visible Apply control is the strongest open-door evidence available. |
| `http_gone` | 0.0 | `record` | Server says gone (404/410). |
| `expired_url` | 0.0 | `record` | Redirected to an error URL. |
| `expired_body` | 0.0 | `record` | Explicit "no longer accepting applications". |
| `listing_page` | 0.0 | `record` | Deep link collapsed to a search page. |
| `insufficient_content` | 0.5 | `record` | Short body may be incomplete rendering, not a dead posting. |
| `no_apply_control` | 0.5 | `record` | Page loaded and read clean, but no Apply control found. |
| `redirected_off_job` | 0.5 | `record` | Final URL lost the job ID — the page was observed, the job wasn't. |
| `navigation_error` | 1.0 | `unmeasured` | A timeout is a fact about our network, not the employer's job. |
| `invalid_url` | — | — | Not scoreable: a `portals.yml` data defect. |
| `unsupported_protocol` | — | — | Not scoreable: a `portals.yml` data defect. |
| `blocked_host` | — | — | Not scoreable: the SSRF guard fired — a security signal. |

Three classes, deliberately: **measured job-level** evidence gets a number;
**unmeasured environment-level** failure gets no penalty and an honest label;
**defective input** is refused outright.

`0.0` rather than `0.05` (the scorer's `gate_zero`, checked with `<=`) so the trace
reads `… × 0 × … = 0` and the scorer reports *Skip (gated)*, not *Skip (low score)*.

`0.5` is calibrated, not arbitrary: it takes Ch.11's worked example from
**0.4462 (Apply)** to **0.2231**, inside the Consider band `[0.20, 0.30)`. An
ambiguous posting demotes Apply → Consider by arithmetic rather than by assertion.

## Provenance labels

`role-scorer.mjs` defines `SRC = { record, model-judgment, your-input }` and passes
`source` through verbatim into the audit trace. The heuristic 0.5 verdicts use
**`record`**: they are deterministic observations of a page that was actually
fetched, and their lower confidence is carried by the factor, not by a different
provenance. `model-judgment` is reserved for the genuinely model-judged `fit` term —
no model runs here. **`unmeasured`** is the one new label, used only where `record`
would assert an observation that never happened.

## How this differs from `dmehta1310-ghost-job-radar`

That contribution also feeds a liveness factor to the scorer, and the overlap is
real — but the designs differ in the place that matters:

| | `dmehta1310-ghost-job-radar` | this contribution |
|---|---|---|
| Input | coarse `result`, supplied by hand via `--liveness-result` | the classifier's 12 `code`s, read programmatically |
| Output | binary `1.0 if "live" else 0.0` | graduated `1.0 / 0.5 / 0.0` |
| `navigation_error` | → **0.0** — a network timeout is scored as a dead job | → **1.0**, labelled `unmeasured` |
| Bad URL / blocked host | no distinct handling | isolated as **not scoreable**, never a number |
| Ambiguous cases | forced to 0 or 1 | **0.5**, demoting Apply → Consider |

A binary rule collapses exactly the distinction this module exists to preserve:
*evidence about the job* versus *evidence about our ability to observe the job*.
The two are complementary — a `build_roles_json.py` could call `livenessFactor()`
instead of its own ternary — not competing.

## Running it

No `package.json` script: per `scripts/contrib/README.md`, contribution tools earn
one at promotion time, not before.

```bash
# tests (offline, deterministic, no Chromium)
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/liveness-factor.test.mjs
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.test.mjs

# attach a mapped gate to a roles file (verdicts injected — deterministic)
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.mjs \
     roles.json --verdicts verdicts.json --out roles.enriched.json

# ...or obtain real verdicts via Playwright (sequential; needs Chromium)
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.mjs \
     roles.json --live --out roles.enriched.json
```

`--out` is mandatory and may not equal the input: the tool never writes in place,
so it cannot clobber a hand-authored fixture.

## Honest limits

- **Nothing calls this automatically.** It runs only when invoked directly. It is a
  tested capability, not a wired pipeline stage.
- **`scan.mjs --verify` still pre-filters.** Expired and no-apply-control postings
  are dropped before any scoring input exists, so in that workflow this mostly sees
  `active` and `navigation_error` → 1.0. The 0.0 and 0.5 factors earn their keep in
  a workflow that does not pre-filter. Reconciling the layers means changing
  `scan.mjs`; deliberately out of scope.
- **No `roles.json` producer exists in-repo** outside student namespaces, so the
  bridge enriches a roles file someone else must produce.
- **`--live` is untested.** Mocking Playwright would claim coverage this suite does
  not have. It converges on the same pure function every test exercises.
- **Status is DRAFT**, `attestation: null`. The tests include an end-to-end check
  against `data/examples/ch11-roles.json`, but no human has signed an honest run
  against real data, which promotion requires.
