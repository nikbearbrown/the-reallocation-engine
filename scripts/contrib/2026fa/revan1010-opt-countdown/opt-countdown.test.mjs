// opt-countdown.test.mjs — offline tests (no network). Run from the repo root:
//   node --test scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.test.mjs
//
// Profiles for the failure cases are derived at test time from the real
// fictional persona (search/examples/priya-nair/profile.yml) with one field
// changed, so every fixture stays tied to the persona the recipe names.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { readInputs, computeTimeline, InputError } from './opt-countdown.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCRIPT = path.join(HERE, 'opt-countdown.mjs');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');
const PRIYA = path.join(REPO, 'search/examples/priya-nair/profile.yml');
const CH11 = path.join(REPO, 'data/examples/ch11-roles.json');
const priya = () => yaml.load(fs.readFileSync(PRIYA, 'utf8'));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'opt-countdown-'));

function cli(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: REPO, encoding: 'utf8' });
}
function profileWith(mutate) {
  const doc = priya(); mutate(doc);
  const p = path.join(tmp(), 'profile.yml');
  fs.writeFileSync(p, yaml.dump(doc));
  return p;
}
const base = (overrides = {}) => {
  const o = { profile: PRIYA, roles: CH11, 'as-of': '2026-10-02', 'lag-days': '56', 'out-dir': tmp(), 'confirmed-by': 'test', ...overrides };
  return Object.entries(o).filter(([, v]) => v !== null).flatMap(([k, v]) => [`--${k}`, v]);
};
const inputs = (lag, asOf = '2026-10-02', mutate = () => {}) => {
  const doc = priya(); mutate(doc);
  return readInputs({ profileDoc: doc, asOf, lagDays: String(lag) });
};

// ── the formula, against the hand-worked numbers in the recipe ─────────────
test('Priya, 56-day lag: start lands on the hard deadline → factor 0', () => {
  const t = computeTimeline(inputs(56), 0.05);
  assert.equal(t.factor, 0);
  assert.deepEqual(t.dates, {
    expected_start: '2026-11-27', days_out_date: '2026-11-27',
    hard_deadline: '2026-11-27', safe_deadline: '2026-11-07', binding: 'unemployment',
  });
  assert.equal(t.source, 'your-input');
});

test('sliding band: 36 days → 1, 46 days → 0.5, 54 days → 0.1, 55 days → 0.05', () => {
  assert.equal(computeTimeline(inputs(36)).factor, 1);
  assert.equal(computeTimeline(inputs(46)).factor, 0.5);
  assert.equal(computeTimeline(inputs(54)).factor, 0.1);
  assert.equal(computeTimeline(inputs(55)).factor, 0.05);
});

test('break-even lags respect the scorer gate_zero (0.05 is closed, so 54 not 55)', () => {
  const t = computeTimeline(inputs(56), 0.05);
  assert.equal(t.break_even.max_lag_for_factor_above_gate_zero, 54);
  assert.equal(t.break_even.max_lag_for_factor_1, 36);
  assert.ok(computeTimeline(inputs(54)).factor > 0.05);
  assert.ok(computeTimeline(inputs(55)).factor <= 0.05);
});

test('OPT end binds when it comes before the unemployment days run out', () => {
  const t = computeTimeline(inputs(10, '2027-01-01'));
  assert.equal(t.dates.binding, 'opt_end');
  assert.equal(t.dates.hard_deadline, '2027-01-31');
});

test('zero buffer does not divide by zero', () => {
  const i = inputs(56, '2026-10-02', (d) => { d.visa.buffer_target = 0; });
  assert.equal(computeTimeline(i).factor, 0);
  assert.equal(computeTimeline(inputs(55, '2026-10-02', (d) => { d.visa.buffer_target = 0; })).factor, 1);
});

// ── named failure cases: fail clearly, invent nothing ──────────────────────
test('F-1 missing data: profile without opt_end_date → exit 2, names the field, writes nothing', () => {
  const out = tmp();
  const r = cli(base({ profile: profileWith((d) => { delete d.visa.opt_end_date; }), 'out-dir': out }));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /\[F-1\].*visa\.opt_end_date/);
  assert.deepEqual(fs.readdirSync(out), []);
});

test('F-2 wrong dates: OPT already over → exit 2', () => {
  const r = cli(base({ profile: profileWith((d) => { d.visa.opt_end_date = '2026-09-01'; }) }));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /\[F-2\].*opt_end_date 2026-09-01 is not after/);
});

test('F-2 wrong dates: days used above the ceiling → exit 2', () => {
  const r = cli(base({ profile: profileWith((d) => { d.visa.unemployment_days_used = 95; }) }));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /\[F-2\].*\(95\) is above.*\(90\)/);
});

test('F-4 no time frame: missing --lag-days → exit 2, never defaults', () => {
  const r = cli(base({ 'lag-days': null }));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /\[F-4\]/);
  assert.throws(() => readInputs({ profileDoc: priya(), asOf: '2026-10-02', lagDays: undefined }), InputError);
});

test('bad values: negative lag → F-4, non-date as-of → F-2, malformed args → exit 2 (not a crash)', () => {
  const neg = cli(base({ 'lag-days': '=-5' }).map((x) => (x === '--lag-days' ? '--lag-days=-5' : x)).filter((x) => x !== '=-5'));
  assert.equal(neg.status, 2);
  assert.match(neg.stderr, /\[F-4\].*whole number > 0/);
  const notDate = cli(base({ 'as-of': 'Oct 2' }));
  assert.equal(notDate.status, 2);
  assert.match(notDate.stderr, /\[F-2\].*--as-of is not a YYYY-MM-DD date/);
  const malformed = cli([...base({ 'lag-days': null }), '--lag-days', '-5']);
  assert.equal(malformed.status, 2);
  assert.match(malformed.stderr, /\[F-1\] bad arguments/);
});

test('G-A: without --confirmed-by it prints inputs, exits 3, writes nothing', () => {
  const out = tmp();
  const r = cli(base({ 'confirmed-by': null, 'out-dir': out }));
  assert.equal(r.status, 3);
  assert.match(r.stdout, /opt_end\s+2027-01-31\s+\[record\]/);
  assert.deepEqual(fs.readdirSync(out), []);
});

test('refuses to write into the roles file folder (scorer overwrite trap)', () => {
  const r = cli(base({ 'out-dir': path.dirname(CH11) }));
  assert.equal(r.status, 2);
});

// ── end to end through the REAL scorer ──────────────────────────────────────
test('full run: both outputs written, scorer saw the computed timeline, labels present', () => {
  const out = tmp();
  const r = cli(base({ 'out-dir': out }));
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['opt-countdown-log.json', 'opt-countdown-report.md', 'roles-with-timeline.json', 'role-scores.json', 'role-scores.md', 'before/role-scores.json'])
    assert.ok(fs.existsSync(path.join(out, f)), `missing ${f}`);

  const log = JSON.parse(fs.readFileSync(path.join(out, 'opt-countdown-log.json'), 'utf8'));
  for (const v of Object.values(log.inputs)) assert.ok(['record', 'your-input'].includes(v.source));
  for (const row of log.roles) {
    assert.equal(row.timeline_after, 0);
    assert.equal(row.scorer_saw_timeline, row.timeline_after, 'scorer audit trace must show the computed factor');
    assert.equal(row.timeline_source, 'your-input');
  }
  assert.equal(log.gates['G-A'].cleared_by, 'test');
  assert.equal(log.gates['G-C'].pending.length, 5);

  // F-3 dead link: the ghost posting is gated by liveness, not only by timeline
  const ghost = log.roles.find((x) => x.role_id === 'ghost-posting');
  assert.equal(ghost.decision_after, 'Skip');
  assert.match(ghost.reason, /liveness/);

  // the human override survives a closed timeline gate, and G-C says so
  const ov = log.gates['G-C'].pending.find((p) => p.role_id === 'override-demo');
  assert.match(ov.note, /human override/);

  assert.match(fs.readFileSync(path.join(out, 'opt-countdown-report.md'), 'utf8'), /^# opt-countdown report[\s\S]*## Summary[\s\S]*Not legal advice/);
});

test('G-B: a liveness value that is neither 0 nor 1 is listed for a human', () => {
  const out = tmp();
  const r = cli(base({ roles: path.join(HERE, 'fixtures/roles-uncertain-liveness.json'), 'out-dir': out }));
  assert.equal(r.status, 0, r.stderr);
  const log = JSON.parse(fs.readFileSync(path.join(out, 'opt-countdown-log.json'), 'utf8'));
  assert.deepEqual(log.gates['G-B'].pending.map((p) => p.role_id), ['uncertain-posting', 'no-liveness']);
});

// ── why F-4 matters: what the real scorer does with a missing timeline ──────
test('BROKEN fixture: the real scorer treats a missing timeline as 1 (the trap this script refuses)', () => {
  const out = tmp();
  const r = spawnSync(process.execPath, [SCORER, path.join(HERE, 'fixtures/BROKEN-roles-missing-timeline.json'), '--out-dir', out], { cwd: REPO, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const scored = JSON.parse(fs.readFileSync(path.join(out, 'role-scores.json'), 'utf8'));
  const tl = scored.roles[0].trace.gates.find((g) => g.factor === 'timeline');
  assert.equal(tl.multiplier, 1);
  assert.equal(scored.roles[0].recommendation, 'Apply');
});
