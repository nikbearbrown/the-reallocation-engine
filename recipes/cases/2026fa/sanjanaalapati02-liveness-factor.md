---
status: DRAFT
todos_open: 3
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# Liveness Factor — turn an ATS liveness verdict into the scorer's gate

## Purpose

Translate the ATS liveness classifier's verdict **code** into the Bayesian Role
Scorer's 0–1 liveness gate, so that a posting's liveness can lower (or close) a
role's composite *visibly and auditably* instead of being discarded upstream.

Today the two halves do not meet. `checkUrlLiveness()` returns
`{ result, code, reason }`; `role-scorer.mjs` reads `role.liveness.factor`, a
number. `scan.mjs --verify` uses the verdict to route offers and then drops the
code, writing only a coarse status to `scan-history.tsv`. Factors in `roles.json`
are written by hand. This recipe supplies the missing translation.

## Who this is for

An international student on F-1 OPT who is scoring roles with
`npm run score` and wants the liveness of each posting to affect the
recommendation on the record, rather than trusting a hand-typed `1.0`.

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Liveness classifier | code (read-only) | `scripts/ats/liveness-core.mjs` | Codes are pinned by a drift guard in the test suite |
| Liveness browser guard | code (read-only) | `scripts/ats/liveness-browser.mjs` | Emits the 3 not-scoreable guard codes + `redirected_off_job` |
| Scorer gate contract | code (read-only) | `scripts/score/role-scorer.mjs` | `gate_zero 0.05`, `apply_threshold 0.30`, `consider_floor 0.20` |
| Worked example | fixture | `data/examples/ch11-roles.json` | Ch.11; reproduced end-to-end at 0.4462 → Apply |

No new data source is introduced. Nothing is fetched. The recipe is a pure
translation between two existing in-repo contracts.

## The rule

Three classes, because one scale would conflate two different kinds of evidence.

**Measured, job-level** — a number:
`apply_control_visible` → 1.0 · `http_gone` / `expired_url` / `expired_body` /
`listing_page` → 0.0 · `insufficient_content` / `no_apply_control` /
`redirected_off_job` → 0.5.

**Unmeasured, environment-level** — no penalty, labelled honestly:
`navigation_error` → 1.0, `source: unmeasured`. A timeout, DNS failure or TLS
error is a statement about our network, not the employer's job. Penalising it
would systematically punish roles behind slow portals and bot protection — a bias
that correlates with employer infrastructure, not with job quality.
`liveness-browser.mjs` already refuses to call these `expired`; this recipe must
not undo that at the scoring layer.

**Defective input** — refused:
`invalid_url` / `unsupported_protocol` / `blocked_host` are not liveness findings.
A malformed URL is a `portals.yml` defect; a blocked host is the SSRF guard firing.
Turning either into a number launders a config error or a security signal into a
job recommendation.

Unknown codes **abort the run**. A `?? 1` default at this seam would mean a code
added in `scripts/ats/` is silently treated as a healthy posting by
`scripts/score/`. The asymmetry is deliberate: a not-scoreable code is a per-row
data defect (isolate it, keep going); an unknown code is systemic drift (stop).

## Run

```bash
# 1 — tests (offline, deterministic, no Chromium)
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/liveness-factor.test.mjs
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.test.mjs

# 2 — attach the mapped gate to a roles file
node scripts/contrib/2026fa/sanjanaalapati02-liveness-factor/attach-liveness.mjs \
     roles.json --verdicts verdicts.json --out roles.enriched.json

# 3 — score as usual; role-scorer.mjs is unchanged
node scripts/score/role-scorer.mjs roles.enriched.json --out-dir out/
```

**GATE (human):** read the audit trace before acting on any recommendation. A
`liveness 1[unmeasured]` row means the posting was never reached — the gate is
open because nothing was observed, not because an open door was seen. Treat it as
unverified, not as verified-live.

## Evidence

79 tests pass (47 + 32), offline and deterministic. Includes:

- every one of the 12 classifier codes, asserted individually;
- a **drift guard** that greps `code:` literals out of the real classifier sources
  and fails in both directions — it is how the 12th code (`redirected_off_job`,
  added upstream 2026-10-03) was caught before this recipe shipped;
- isolation: one `blocked_host` in a batch of five leaves four roles processed;
- end-to-end through the real scorer CLI: `apply_control_visible` → **0.4462 /
  Apply**, `no_apply_control` → **0.2231 / Consider**, `http_gone` → **0 / Skip
  (gated)**.

Run log: `logs/runs/2026fa-sanjanaalapati02-1.md`.

## Where it fails / what is NOT verified

1. **Nothing calls this automatically.** No production path invokes it.
2. **`scan.mjs --verify` still pre-filters** expired and no-apply-control postings
   before scoring, so in that workflow the 0.0 and 0.5 factors rarely fire. Those
   skips remain invisible to the scorer's skip-rate.
3. **`--live` is untested.** It needs Chromium and a network; the suite is offline
   by design.
4. **No in-repo `roles.json` producer** outside student namespaces.
5. **`insufficient_content` deliberately disagrees with its own `result`.** The
   classifier calls it `expired`; this recipe treats it as 0.5 ambiguity, because
   a short body is often incomplete rendering. That is a judgment, not a fact.

## TODOs

- [TODO] Decide whether `scan.mjs` should stop dropping so liveness skips become
  visible to the scorer's skip-rate (requires a maintained-file change).
- [TODO] Coordinate with `dmehta1310-ghost-job-radar`, whose `build_roles_json.py`
  maps liveness to a binary factor; it could call `livenessFactor()` instead.
- [TODO] Obtain a human attestation on an honest run against real postings before
  requesting promotion out of `scripts/contrib/`.
