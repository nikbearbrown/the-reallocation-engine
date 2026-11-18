#!/usr/bin/env node
// attach-liveness.test.mjs — verification harness for attach-liveness.mjs.
//
// Verdicts are INJECTED throughout: no Chromium, no network, fully deterministic.
// The --live path is not mocked. It converges on the same attachLiveness() call
// that every test here exercises, and claiming coverage by mocking Playwright
// would assert more than this suite actually proves.
//
// The two behaviours that matter most, and why:
//   · a not-scoreable role is ISOLATED (batch continues) — it is a per-row defect
//   · an unknown code ABORTS the run — it is systemic drift between ats/ and score/
//
// Plain node:assert (built-in, no framework), matching this codebase's existing
// idiom (liveness-factor.test.mjs / skill-demand-monitor.test.mjs / conformance.mjs):
// manual counters, process.exit(1) on any failure.
//
//   node scripts/score/attach-liveness.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { attachLiveness } from './attach-liveness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(HERE, 'attach-liveness.mjs');
const SCORER = path.resolve(HERE, '..', '..', '..', 'score', 'role-scorer.mjs');
const REPO = path.resolve(HERE, '..', '..', '..', '..');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.error(`  ✗ ${name}\n      ${err.message}`); failed++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'attach-liveness-test-'));
const role = (id, extra = {}) => ({
  role_id: id,
  company: `Co ${id}`,
  url: `https://example.test/${id}`,
  sponsorship: { p: 0.9, tier: 'Proven', source: 'record' },
  fit: { p: 0.7, source: 'model-judgment' },
  timeline: { factor: 0.85, source: 'your-input' },
  ...extra,
});

// Guard for test 16 — capture BEFORE anything runs.
const WATCHED = ['data/examples/role-scores.json', 'data/examples/role-scores.md',
                 'data/examples/ch11-roles.json'].map((p) => path.join(REPO, p));
const mtimesBefore = WATCHED.map((p) => fs.statSync(p).mtimeMs);

console.log('attach-liveness verification harness\n');

// ── 1. All 8 scoreable codes attach correctly ───────────────────────────────
console.log('1. scoreable codes attach the mapped gate');
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
for (const [code, expected] of Object.entries(EXPECTED)) {
  test(`${code} → liveness ${expected.factor} [${expected.source}]`, () => {
    const r = role(code);
    const { roles, stats } = attachLiveness([r], { [r.url]: code });
    assert.deepEqual(roles[0].liveness, expected);
    assert.equal(stats.attached, 1);
  });
}

// ── 2–3. not_scoreable is isolated; the batch keeps going ───────────────────
console.log('\n2. not-scoreable roles are isolated, not fatal');
test('one blocked_host in a batch of 5 → 4 out, 1 rejected, no throw', () => {
  const rs = [role('a'), role('b'), role('bad'), role('c'), role('d')];
  const verdicts = Object.fromEntries(rs.map((r) => [r.url, 'apply_control_visible']));
  verdicts[rs[2].url] = 'blocked_host';
  const { roles, rejected, stats } = attachLiveness(rs, verdicts);
  assert.equal(roles.length, 4, 'the rejected role must be excluded from the output');
  assert.equal(roles.find((r) => r.role_id === 'bad'), undefined);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].role_id, 'bad');
  assert.equal(rejected[0].code, 'blocked_host');
  assert.match(rejected[0].reason, /SSRF guard/);
  assert.equal(stats.attached, 4, 'every other role in the batch was still processed');
  assert.equal(stats.rejected, 1);
});
for (const code of ['invalid_url', 'unsupported_protocol', 'blocked_host']) {
  test(`${code} is excluded and recorded`, () => {
    const r = role(code);
    const { roles, rejected } = attachLiveness([r], { [r.url]: code });
    assert.equal(roles.length, 0);
    assert.equal(rejected[0].code, code);
  });
}

// ── 4–5. unknown / unexpected errors abort the run ──────────────────────────
console.log('\n3. unknown codes abort the whole run');
test('an unknown code throws unknown_liveness_code', () => {
  const r = role('x');
  assert.throws(() => attachLiveness([r], { [r.url]: 'brand_new_code' }), (err) => {
    assert.equal(err.code, 'unknown_liveness_code');
    return true;
  });
});
test('the abort happens even when earlier roles mapped fine (no partial result)', () => {
  const ok = role('ok'), bad = role('bad');
  let result;
  try {
    result = attachLiveness([ok, bad], {
      [ok.url]: 'apply_control_visible',
      [bad.url]: 'not_a_real_code',
    });
  } catch { /* expected */ }
  assert.equal(result, undefined, 'must not return a half-processed batch');
});
test('a non-liveness error is not swallowed', () => {
  assert.throws(() => attachLiveness('not-an-array', {}), TypeError);
  assert.throws(() => attachLiveness([], null), TypeError);
});

// ── 6–7. existing liveness is protected ─────────────────────────────────────
console.log('\n4. existing role.liveness is protected');
const HAND = { factor: 1.0, source: 'record' };
test('an existing liveness is preserved by default', () => {
  const r = role('h', { liveness: { ...HAND } });
  const { roles, stats } = attachLiveness([r], { [r.url]: 'http_gone' });
  assert.deepEqual(roles[0].liveness, HAND, 'hand-authored value must survive');
  assert.equal(stats.preserved, 1);
  assert.equal(stats.attached, 0);
});
test('overwrite: true replaces it — and only then', () => {
  const r = role('h', { liveness: { ...HAND } });
  const { roles, stats } = attachLiveness([r], { [r.url]: 'http_gone' }, { overwrite: true });
  assert.deepEqual(roles[0].liveness, { factor: 0.0, source: 'record' });
  assert.equal(stats.attached, 1);
});

// ── 8–9. roles we cannot or should not touch ────────────────────────────────
console.log('\n5. roles without a url or without a verdict are left alone');
test('a role with no url passes through byte-identical', () => {
  const r = role('nourl'); delete r.url;
  const before = structuredClone(r);
  const { roles, rejected, stats } = attachLiveness([r], {});
  assert.deepEqual(roles[0], before, 'untouched');
  assert.equal(roles[0].liveness, undefined, 'no factor invented');
  assert.equal(rejected.length, 0, 'absence of a url is not a rejection');
  assert.equal(stats.no_url, 1);
});
test('a role with a url but no verdict passes through untouched', () => {
  const r = role('nov');
  const { roles, stats } = attachLiveness([r], {});
  assert.equal(roles[0].liveness, undefined);
  assert.equal(stats.no_verdict, 1);
});

// ── 10–12. purity, idempotence, accounting ──────────────────────────────────
console.log('\n6. purity, idempotence, accounting');
test('the input array and its objects are never mutated', () => {
  const rs = [role('p1'), role('p2')];
  const snapshot = structuredClone(rs);
  attachLiveness(rs, { [rs[0].url]: 'http_gone', [rs[1].url]: 'blocked_host' });
  assert.deepEqual(rs, snapshot, 'caller data must be untouched');
});
test('running twice over the output is idempotent', () => {
  const rs = [role('i1'), role('i2')];
  const v = { [rs[0].url]: 'no_apply_control', [rs[1].url]: 'apply_control_visible' };
  const first = attachLiveness(rs, v).roles;
  const second = attachLiveness(first, v).roles;
  assert.deepEqual(second, first);
});
test('stats account for every input role', () => {
  const rs = [role('s1'), role('s2', { liveness: { ...HAND } }), role('s3'), role('s4')];
  delete rs[3].url;
  const v = { [rs[0].url]: 'http_gone', [rs[1].url]: 'http_gone', [rs[2].url]: 'blocked_host' };
  const { stats } = attachLiveness(rs, v);
  const total = stats.attached + stats.preserved + stats.no_url + stats.no_verdict + stats.rejected;
  assert.equal(total, rs.length, `counters (${JSON.stringify(stats)}) must sum to ${rs.length}`);
});

// ── 13. end-to-end through the real scorer ──────────────────────────────────
// Float note: 0.9*0.35 is 0.31499999999999995, so 0.44625.toFixed(4) → "0.4462".
console.log('\n7. end-to-end through role-scorer.mjs');
function scoreVia(code) {
  const r = role('biotech-data');
  const { roles } = attachLiveness([r], { [r.url]: code });
  const dir = fs.mkdtempSync(path.join(tmp, 'run-'));
  const rolesPath = path.join(dir, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(roles, null, 2));
  execFileSync(process.execPath, [SCORER, rolesPath, '--out-dir', dir], { stdio: 'pipe' });
  return JSON.parse(fs.readFileSync(path.join(dir, 'role-scores.json'), 'utf8')).roles[0];
}
test('apply_control_visible → composite 0.4462, Apply', () => {
  const s = scoreVia('apply_control_visible');
  assert.equal(s.composite, 0.4462);
  assert.equal(s.recommendation, 'Apply');
});
test('no_apply_control → composite 0.2231, Consider', () => {
  const s = scoreVia('no_apply_control');
  assert.equal(s.composite, 0.2231);
  assert.equal(s.recommendation, 'Consider');
});
test('http_gone → gated Skip, and the trace says gated', () => {
  const s = scoreVia('http_gone');
  assert.equal(s.composite, 0);
  assert.equal(s.recommendation, 'Skip');
  assert.match(s.reason, /gated/);
});
test('navigation_error scores as unverified and is labelled unmeasured', () => {
  const s = scoreVia('navigation_error');
  assert.equal(s.composite, 0.4462, 'a network failure must not change the score');
  assert.equal(s.trace.gates.find((g) => g.factor === 'liveness').source, 'unmeasured');
});

// ── 14–15. CLI refuses to clobber ───────────────────────────────────────────
console.log('\n8. the CLI refuses to write in place');
function runCli(args) {
  try {
    execFileSync(process.execPath, [CLI, ...args], { stdio: 'pipe' });
    return { code: 0 };
  } catch (err) { return { code: err.status, stderr: String(err.stderr) }; }
}
const fixture = path.join(tmp, 'in.json');
fs.writeFileSync(fixture, JSON.stringify([role('cli')], null, 2));
const vfile = path.join(tmp, 'v.json');
fs.writeFileSync(vfile, JSON.stringify({ [role('cli').url]: 'apply_control_visible' }));

test('--out equal to the input is refused, and the input is unchanged', () => {
  const before = fs.readFileSync(fixture, 'utf8');
  const r = runCli([fixture, '--out', fixture, '--verdicts', vfile]);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /must differ from the input/);
  assert.equal(fs.readFileSync(fixture, 'utf8'), before, 'input must be untouched');
});
test('a missing --out is refused (never writes in place)', () => {
  const r = runCli([fixture, '--verdicts', vfile]);
  assert.notEqual(r.code, 0);
  assert.match(r.stderr, /--out <path> is required/);
});
test('a valid run writes the enriched file and exits 0', () => {
  const out = path.join(tmp, 'out.json');
  const r = runCli([fixture, '--out', out, '--verdicts', vfile]);
  assert.equal(r.code, 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(out, 'utf8'))[0].liveness,
    { factor: 1.0, source: 'record' });
});
test('rejects are written to a sidecar file and the run still exits 0', () => {
  const out = path.join(tmp, 'out2.json');
  const bad = path.join(tmp, 'v-bad.json');
  fs.writeFileSync(bad, JSON.stringify({ [role('cli').url]: 'blocked_host' }));
  const r = runCli([fixture, '--out', out, '--verdicts', bad]);
  assert.equal(r.code, 0, 'a per-row defect must not fail the batch');
  assert.deepEqual(JSON.parse(fs.readFileSync(out, 'utf8')), [], 'rejected role excluded');
  assert.equal(JSON.parse(fs.readFileSync(`${out}.rejects.json`, 'utf8'))[0].code, 'blocked_host');
});

// ── 16. no repo writes ──────────────────────────────────────────────────────
console.log('\n9. the suite writes nothing into the repository');
test('data/examples mtimes are unchanged by this suite', () => {
  WATCHED.forEach((p, i) => {
    assert.equal(fs.statSync(p).mtimeMs, mtimesBefore[i], `${path.basename(p)} must not be rewritten`);
  });
});

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
