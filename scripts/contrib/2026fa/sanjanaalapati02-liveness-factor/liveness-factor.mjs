#!/usr/bin/env node
// liveness-factor.mjs — map a liveness CLASSIFIER CODE to the scorer's gate factor.
//
// The seam this fills: scripts/ats/liveness-{core,browser}.mjs emit a STRING
// verdict ({ result, code, reason }); scripts/score/role-scorer.mjs consumes a
// NUMBER (`role.liveness.factor`, a 0–1 gate multiplier). Nothing translated
// between them — factors were written by hand into roles.json. This module is
// that translation, and nothing else.
//
//   import { livenessFactor } from './liveness-factor.mjs';
//   role.liveness = livenessFactor(code);   // → { factor, source }
//
// WHY KEYED ON `code`, NOT `result`
// `result` has only three values and loses the distinction that matters most:
// an `uncertain` caused by a page we read but couldn't interpret is a fact about
// the JOB, while an `uncertain` caused by a timeout is a fact about OUR NETWORK.
// Mapping both to one number would encode "we failed to reach it" as "this job is
// worse" — a category error that penalises employers for slow portals and bot
// protection. `insufficient_content` likewise is classified `expired` but is
// treated here as ambiguous, not closed (see its entry below), so `result` and
// factor deliberately disagree for that one code.
//
// THREE CLASSES
//   measured, job-level     → a number (1.0 / 0.5 / 0.0)
//   unmeasured, environment → 1.0, labelled `unmeasured` (no penalty, no false claim)
//   defective input         → NOT SCOREABLE — throws (see NOT_SCOREABLE)
//
// PROVENANCE LABELS
// role-scorer.mjs defines SRC = { record, model-judgment, your-input } and passes
// `source` through verbatim into the audit trace. Those three are the established
// vocabulary (and the only values present in data/examples + fixtures). The
// heuristic 0.5 verdicts use `record`: they are deterministic observations of the
// fetched page, and their lower confidence is carried by the FACTOR, not by a
// different provenance. `model-judgment` is reserved for the genuinely
// model-judged `fit` term — no model runs here. `unmeasured` is the one new
// label, used only where `record` would be a lie because nothing was observed.
//
// SCOPE NOTE (deliberate, not an oversight)
// scan.mjs --verify DROPS every posting the classifier calls `expired` before
// scoring, which includes `insufficient_content`. So in a --verify pipeline that
// 0.5 rarely fires; it matters for pipelines that score without that drop.
// Reconciling the two layers means changing scan.mjs and is out of scope here.

/** Codes that map to a gate factor. Deep-frozen: entries are frozen too. */
export const LIVENESS_FACTORS = Object.freeze({
  // --- measured, job-level: confirmed open ---------------------------------
  // A visible Apply control is the strongest evidence available that the door is open.
  apply_control_visible: Object.freeze({ factor: 1.0, source: 'record' }),

  // --- measured, job-level: confirmed closed -------------------------------
  // 0.0 (not 0.05) so the arithmetic trace reads `… × 0 × … = 0` and the scorer
  // reports "Skip (gated)" rather than "Skip (low score)". gate_zero is 0.05 and
  // the scorer's check is `<=`, so either would gate; 0.0 is the honest one.
  http_gone:            Object.freeze({ factor: 0.0, source: 'record' }),  // HTTP 404/410
  expired_url:          Object.freeze({ factor: 0.0, source: 'record' }),  // redirected to an error URL
  expired_body:         Object.freeze({ factor: 0.0, source: 'record' }),  // "no longer accepting applications"
  listing_page:         Object.freeze({ factor: 0.0, source: 'record' }),  // deep link collapsed to a search page

  // --- measured, job-level: genuinely ambiguous ----------------------------
  // Short body text may be incomplete rendering rather than a dead posting, so
  // this is treated as doubt, not closure — even though the classifier rules it
  // `expired`. Keeping it above gate_zero leaves the gate open and lets the
  // halved composite speak.
  insufficient_content: Object.freeze({ factor: 0.5, source: 'record' }),

  // Page loaded, cleared the 300-char bar, matched no expired pattern — but no
  // Apply control was found. Real doubt about the job. 0.5 takes Ch.11's worked
  // example from 0.4462 (Apply) to 0.2231, landing in the Consider band
  // [0.20, 0.30): an ambiguous posting demotes Apply → Consider by arithmetic
  // rather than by assertion.
  no_apply_control:     Object.freeze({ factor: 0.5, source: 'record' }),

  // Added upstream 2026-10-03. A false-positive guard on `active`: the final URL
  // no longer carries the job's ID, so the request was redirected off the posting
  // (typically onto a careers search page whose apply-like controls would otherwise
  // read as live). The page WAS observed, and the classifier rules it `uncertain`
  // rather than `expired` — so this is ambiguity about the job, not confirmed
  // closure. Mapped like the other two observed-but-unconfirmed cases; overriding
  // the classifier's own confidence here would reintroduce two sources of truth.
  redirected_off_job:   Object.freeze({ factor: 0.5, source: 'record' }),

  // --- unmeasured, environment-level ---------------------------------------
  // Timeout / DNS / TLS / 5xx. A statement about our network, not the employer's
  // job, so it carries NO penalty. liveness-browser.mjs already refuses to call
  // these `expired` (doing so writes the URL to scan-history and filters it out
  // permanently); this module must not undo that at the scoring layer. The
  // `unmeasured` label keeps the audit honest: the gate is open because we never
  // looked, not because we looked and saw an open door.
  navigation_error:     Object.freeze({ factor: 1.0, source: 'unmeasured' }),
});

/**
 * Codes that are NOT liveness findings at all and must never become a number.
 * A malformed or non-http(s) URL is a portals.yml data defect; a blocked host is
 * the SSRF guard firing, i.e. a security signal. Turning either into a factor
 * would launder a config error or an attack indicator into a job recommendation.
 */
export const NOT_SCOREABLE = Object.freeze({
  invalid_url:          'malformed URL — a portals.yml data defect, not a liveness finding',
  unsupported_protocol: 'non-http(s) URL — a portals.yml data defect, not a liveness finding',
  blocked_host:         'SSRF guard fired — a security signal, not a liveness finding',
});

/**
 * Map a classifier `code` to the scorer's gate input.
 *
 * @param {string} code - `code` from classifyLiveness() / checkUrlLiveness().
 * @returns {{factor: number, source: string}} ready to assign to `role.liveness`.
 * @throws {Error} with `err.code === 'not_scoreable'` for a defective-input code,
 *   or `err.code === 'unknown_liveness_code'` for anything unrecognised.
 *
 * THROWS RATHER THAN RETURNING A SENTINEL, deliberately. A returned object with
 * no `factor` would flow into `role.liveness`, and role-scorer.mjs would then do
 * `num(undefined) ?? 1` — silently scoring a blocked host as a FULLY OPEN GATE.
 * A thrown error cannot be assigned into roles.json by accident.
 *
 * Unknown codes fail loudly for the same reason: this is a cross-domain seam, and
 * a `?? 1` default here would mean a code added in scripts/ats/ is silently
 * treated as a healthy posting by scripts/score/.
 */
export function livenessFactor(code) {
  if (Object.hasOwn(LIVENESS_FACTORS, code)) return LIVENESS_FACTORS[code];

  if (Object.hasOwn(NOT_SCOREABLE, code)) {
    const err = new Error(`liveness code '${code}' is not scoreable: ${NOT_SCOREABLE[code]}`);
    err.code = 'not_scoreable';
    err.livenessCode = code;
    throw err;
  }

  const known = [...Object.keys(LIVENESS_FACTORS), ...Object.keys(NOT_SCOREABLE)].sort();
  const err = new Error(
    `unknown liveness code ${JSON.stringify(code)}. ` +
    `Known codes: ${known.join(', ')}. ` +
    `If scripts/ats/ added a code, classify it here — do NOT let it default.`,
  );
  err.code = 'unknown_liveness_code';
  err.livenessCode = code;
  throw err;
}
