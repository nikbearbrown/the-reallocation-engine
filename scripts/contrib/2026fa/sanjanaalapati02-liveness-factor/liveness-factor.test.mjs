#!/usr/bin/env node
// liveness-factor.test.mjs — verification harness for liveness-factor.mjs.
//
// The module's whole value is that it REFUSES to guess: unknown codes throw
// instead of defaulting, and defective-input codes never become a number. Those
// two properties are what these tests exist to hold down — a silent `?? 1` at
// this seam would score a blocked host as a healthy posting.
//
// Test 4 is the drift guard: it greps the real classifier sources for their
// `code:` literals and fails if either side gains a code the other doesn't know.
// That is a deliberate test-only dependency from scripts/score/ on scripts/ats/.
//
// Plain node:assert (built-in, no framework), matching this codebase's existing
// idiom (skill-demand-monitor.test.mjs / conformance.mjs / verify-pipeline.mjs):
// manual counters, process.exit(1) on any failure.
//
//   node scripts/score/liveness-factor.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { livenessFactor, LIVENESS_FACTORS, NOT_SCOREABLE } from './liveness-factor.mjs';

// fileURLToPath (not new URL().pathname) so the paths resolve on Windows too,
// where pathname yields a leading-slash drive path like /C:/…
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ATS_DIR = path.resolve(HERE, '..', '..', '..', 'ats');
const SCORER = path.resolve(HERE, '..', '..', '..', 'score', 'role-scorer.mjs');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.error(`  ✗ ${name}\n      ${err.message}`); failed++; }
}

console.log('liveness-factor verification harness\n');

// ── 1. Exhaustive table — every scoreable code, exact factor and source ──────
const EXPECTED = {
  apply_control_visible: { factor: 1.0, source: 'record' },
  http_gone:             { factor: 0.0, source: 'record' },
  expired_url:           { factor: 0.0, source: 'record' },
  expired_body:          { factor: 0.0, source: 'record' },
  listing_page:          { factor: 0.0, source: 'record' },
  insufficient_content:  { factor: 0.5, source: 'record' },
  no_apply_control:      { factor: 0.5, source: 'record' },
  redirected_off_job:    { factor: 0.5, source: 'record' },
  navigation_error:      { factor: 1.0, source: 'unmeasured' },
};

console.log('1. exhaustive code → factor table');
for (const [code, expected] of Object.entries(EXPECTED)) {
  test(`${code} → ${expected.factor} [${expected.source}]`, () => {
    assert.deepEqual(livenessFactor(code), expected);
  });
}
test('the table covers exactly these 9 scoreable codes — no more, no fewer', () => {
  assert.deepEqual(Object.keys(LIVENESS_FACTORS).sort(), Object.keys(EXPECTED).sort());
});

// ── 2. Defective input is not scoreable ──────────────────────────────────────
console.log('\n2. defective-input codes refuse to produce a number');
for (const code of ['invalid_url', 'unsupported_protocol', 'blocked_host']) {
  test(`${code} throws not_scoreable`, () => {
    assert.throws(() => livenessFactor(code), (err) => {
      assert.equal(err.code, 'not_scoreable', 'err.code must be not_scoreable');
      assert.equal(err.livenessCode, code);
      return true;
    });
  });
}
test('a blocked host cannot silently become an open gate', () => {
  // The footgun this module exists to prevent: a sentinel return would flow into
  // role.liveness, and role-scorer.mjs would do `num(undefined) ?? 1` → 1.0.
  let returned;
  try { returned = livenessFactor('blocked_host'); } catch { /* expected */ }
  assert.equal(returned, undefined, 'blocked_host must throw, never return a value');
});

// ── 3. Unknown codes fail loudly ─────────────────────────────────────────────
console.log('\n3. unknown codes fail loudly (never default)');
for (const bad of ['definitely_not_a_code', '', 'ACTIVE', 'active', 'expired', 'uncertain']) {
  test(`${JSON.stringify(bad)} throws unknown_liveness_code`, () => {
    assert.throws(() => livenessFactor(bad), (err) => {
      assert.equal(err.code, 'unknown_liveness_code');
      return true;
    });
  });
}
for (const bad of [undefined, null, 42, {}]) {
  test(`${String(bad)} (non-string) throws unknown_liveness_code`, () => {
    assert.throws(() => livenessFactor(bad), (err) => {
      assert.equal(err.code, 'unknown_liveness_code');
      return true;
    });
  });
}
test('the error names the known codes, so the fix is obvious', () => {
  assert.throws(() => livenessFactor('nope'), /Known codes:.*apply_control_visible/s);
});

// ── 4. Drift guard — classifier codes and this table must stay in sync ───────
console.log('\n4. drift guard against scripts/ats/');
const classifierCodes = (() => {
  const found = new Set();
  for (const file of ['liveness-core.mjs', 'liveness-browser.mjs']) {
    const src = fs.readFileSync(path.join(ATS_DIR, file), 'utf-8');
    // Literal `code: 'foo'` only. `code: guardError.code` is a reference, not a
    // literal, and is correctly skipped.
    for (const m of src.matchAll(/\bcode:\s*'([a-z_]+)'/g)) found.add(m[1]);
  }
  return [...found].sort();
})();

test('found all 12 codes in the real classifier sources', () => {
  assert.equal(classifierCodes.length, 12,
    `expected 12 literal codes, found ${classifierCodes.length}: ${classifierCodes.join(', ')}`);
});
test('every classifier code is classified here (ats/ gained nothing we ignore)', () => {
  const handled = new Set([...Object.keys(LIVENESS_FACTORS), ...Object.keys(NOT_SCOREABLE)]);
  const unhandled = classifierCodes.filter((c) => !handled.has(c));
  assert.deepEqual(unhandled, [],
    `unhandled classifier codes: ${unhandled.join(', ')} — add them to liveness-factor.mjs`);
});
test('this module declares no code the classifier cannot emit', () => {
  const emitted = new Set(classifierCodes);
  const phantom = [...Object.keys(LIVENESS_FACTORS), ...Object.keys(NOT_SCOREABLE)]
    .filter((c) => !emitted.has(c));
  assert.deepEqual(phantom, [],
    `codes declared here but never emitted: ${phantom.join(', ')} — stale entries`);
});

// ── 5. Gate-boundary semantics (gate_zero = 0.05 in role-scorer.mjs) ─────────
console.log('\n5. gate boundaries');
const GATE_ZERO = 0.05;
test('role-scorer.mjs still uses gate_zero 0.05 (this test is calibrated to it)', () => {
  const src = fs.readFileSync(SCORER, 'utf-8');
  assert.match(src, /gate_zero:\s*0\.05/, 'gate_zero changed — revisit the factor table');
});
for (const code of ['http_gone', 'expired_url', 'expired_body', 'listing_page']) {
  test(`${code} closes the gate (<= ${GATE_ZERO})`, () => {
    assert.ok(livenessFactor(code).factor <= GATE_ZERO);
  });
}
test('apply_control_visible leaves the gate fully open (1.0)', () => {
  assert.equal(livenessFactor('apply_control_visible').factor, 1.0);
});
for (const code of ['insufficient_content', 'no_apply_control', 'redirected_off_job']) {
  test(`${code} is ambiguous — strictly between ${GATE_ZERO} and 1.0`, () => {
    const { factor } = livenessFactor(code);
    assert.ok(factor > GATE_ZERO, `${factor} must not close the gate`);
    assert.ok(factor < 1.0, `${factor} must carry a penalty`);
  });
}

// ── 6. Provenance ────────────────────────────────────────────────────────────
console.log('\n6. provenance labels');
test('navigation_error is labelled unmeasured, never record', () => {
  const { source, factor } = livenessFactor('navigation_error');
  assert.equal(source, 'unmeasured', 'claiming `record` would assert we observed a page we never reached');
  assert.equal(factor, 1.0, 'a network failure must not penalise the employer');
});
test('the heuristic 0.5s use the established `record` label, not `model-judgment`', () => {
  // model-judgment is reserved for the genuinely model-judged `fit` term;
  // these verdicts are deterministic observations of the fetched page.
  assert.equal(livenessFactor('insufficient_content').source, 'record');
  assert.equal(livenessFactor('no_apply_control').source, 'record');
});
test('only `record` and `unmeasured` are used — no invented vocabulary', () => {
  const sources = new Set(Object.values(LIVENESS_FACTORS).map((v) => v.source));
  assert.deepEqual([...sources].sort(), ['record', 'unmeasured']);
});

// ── 7. End-to-end through the real scorer ────────────────────────────────────
// scoreRole is not exported and main() autoruns, so drive the CLI like a user.
console.log('\n7. end-to-end through role-scorer.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liveness-factor-test-'));

// Expected composites are the scorer's FLOAT results, not exact decimal:
// 0.9*0.35 is 0.31499999999999995, so 0.44625.toFixed(4) rounds to "0.4462",
// not "0.4463". DOMAIN.md quotes this example to 3dp as 0.446, which matches.
function scoreWithLiveness(code) {
  // Ch.11's worked example (data/examples/ch11-roles.json, "biotech-data"),
  // copied here so the test never writes to repo data.
  const role = {
    role_id: 'biotech-data',
    company: 'Cambridge biotech (Ch.7)',
    title: 'Data role (Proven tier)',
    sponsorship: { p: 0.9, tier: 'Proven', source: 'record' },
    fit: { p: 0.7, source: 'model-judgment' },
    liveness: livenessFactor(code),
    timeline: { factor: 0.85, source: 'your-input' },
  };
  const dir = fs.mkdtempSync(path.join(tmp, 'run-'));
  const rolesPath = path.join(dir, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify([role], null, 2));
  execFileSync(process.execPath, [SCORER, rolesPath, '--out-dir', dir], { stdio: 'pipe' });
  return JSON.parse(fs.readFileSync(path.join(dir, 'role-scores.json'), 'utf-8')).roles[0];
}

test('apply_control_visible reproduces Ch.11: composite 0.4462 → Apply', () => {
  const r = scoreWithLiveness('apply_control_visible');
  assert.equal(r.composite, 0.4462, 'the book-verified worked example must not move');
  assert.equal(r.recommendation, 'Apply');
});
test('no_apply_control demotes the same role to Consider (0.2231)', () => {
  const r = scoreWithLiveness('no_apply_control');
  assert.equal(r.composite, 0.2231);
  assert.equal(r.recommendation, 'Consider', 'an ambiguous posting should demote Apply → Consider');
});
test('http_gone gates the same role to Skip, with a gated reason', () => {
  const r = scoreWithLiveness('http_gone');
  assert.equal(r.composite, 0);
  assert.equal(r.recommendation, 'Skip');
  assert.match(r.reason, /gated/, 'must read as gated, not merely low-score');
});
test('navigation_error leaves the role scoring as if unverified, labelled unmeasured', () => {
  const r = scoreWithLiveness('navigation_error');
  assert.equal(r.composite, 0.4462, 'a network failure must not change the score');
  const gate = r.trace.gates.find((g) => g.factor === 'liveness');
  assert.equal(gate.source, 'unmeasured', 'the audit trace must not claim `record`');
});

fs.rmSync(tmp, { recursive: true, force: true });

// ── 8. Immutability ──────────────────────────────────────────────────────────
console.log('\n8. immutability');
test('the tables are frozen at the top level', () => {
  assert.ok(Object.isFrozen(LIVENESS_FACTORS));
  assert.ok(Object.isFrozen(NOT_SCOREABLE));
});
test('nested entries are frozen too (Object.freeze is shallow)', () => {
  for (const [code, entry] of Object.entries(LIVENESS_FACTORS)) {
    assert.ok(Object.isFrozen(entry), `${code} entry must be frozen`);
  }
});
test('a mutation attempt does not take', () => {
  assert.throws(() => { 'use strict'; LIVENESS_FACTORS.http_gone.factor = 1.0; });
  assert.equal(livenessFactor('http_gone').factor, 0.0);
});

// ── summary ──────────────────────────────────────────────────────────────────
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
