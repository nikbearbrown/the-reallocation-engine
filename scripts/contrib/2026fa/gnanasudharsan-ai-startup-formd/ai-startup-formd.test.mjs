// ai-startup-formd.test.mjs — node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
// Fixtures are fictional (fixtures/). The scorer is the REAL scripts/score/role-scorer.mjs,
// run as a CLI by the script under test — nothing here re-implements the composite.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  run, normalizeCompany, parseCsv, aiTitleMatch, parseLiveness, parseDate, parseFormDDate,
  addMonths, iso, timelineState, evaluateCompany, loadClearance, DECISIONS,
} from './ai-startup-formd.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(HERE, 'fixtures');
const SCRIPT = path.join(HERE, 'ai-startup-formd.mjs');
const fx = (f) => path.join(FX, f);
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ai-startup-formd-'));

function fixtureRun(extra = [], { clearance = true, asOf = '2026-10-20' } = {}) {
  const out = tmp();
  const argv = ['--as-of', asOf, '--postings', fx('postings.fixture.json'), '--liveness', fx('liveness.fixture.txt'),
    '--csv', fx('companies.fixture.csv'), '--formd-dir', fx('formd'), '--out-dir', out, ...extra];
  if (clearance) argv.push('--clearance', fx('clearance.fixture.json'));
  const res = run(argv);
  return { ...res, out, byId: new Map((res.log?.postings || []).map((p) => [p.posting_id, p])) };
}

// ── units
test('normalizeCompany strips suffixes and punctuation the same way for CSV and posting names', () => {
  assert.equal(normalizeCompany('NEURALFORGE LABS INC'), 'neuralforgelabs');
  assert.equal(normalizeCompany('NeuralForge Labs, Inc.'), 'neuralforgelabs');
  assert.equal(normalizeCompany('TWINNAME AI LLC'), normalizeCompany('TWINNAME AI INC'));
  assert.equal(normalizeCompany(''), null);
});

test('addMonths clamps the day and the runway arithmetic matches the decided anchors', () => {
  assert.equal(iso(addMonths(parseDate('2024-01-31'), 1)), '2024-02-29');
  assert.equal(iso(addMonths(parseDate('2025-09-26'), 24)), '2027-09-26');
  assert.equal(timelineState(parseDate('2025-10-01')).state, 'PASS'); // exactly reaches 2027-10-01
  assert.equal(timelineState(parseDate('2025-09-30')).state, 'CANNOT-VERIFY');
  assert.equal(timelineState(parseDate('2025-04-01')).state, 'CANNOT-VERIFY'); // exactly reaches 2027-04-01
  assert.equal(timelineState(parseDate('2025-03-31')).state, 'FAIL');
});

test('date parsers reject malformed input instead of guessing', () => {
  assert.equal(parseDate('2025-02-30'), null);
  assert.equal(parseDate(''), null);
  assert.equal(iso(parseFormDDate('31-MAR-2026')), '2026-03-31');
  assert.equal(parseFormDDate('2026-03-31'), null);
});

test('AI title family: whole words only, bare ai/ml without a role word is flagged weak', () => {
  assert.deepEqual(aiTitleMatch('Machine Learning Engineer').weak, false);
  assert.equal(aiTitleMatch('AI/DS Engineer').weak, false);
  assert.equal(aiTitleMatch('Email Marketing Lead').match, false); // "ai" inside a word does not match
  const v = aiTitleMatch('Enterprise Business Operations Manager - AI');
  assert.equal(v.match, true);
  assert.equal(v.weak, true);
  assert.equal(aiTitleMatch('Product Marketing Manager').match, false);
});

test('parseLiveness reads saved ats:liveness stdout, including the uncertain/download case', () => {
  const m = parseLiveness(fs.readFileSync(fx('liveness.fixture.txt'), 'utf8'));
  assert.equal(m.get('https://jobs.example.com/neuralforge/101'), 'active');
  assert.equal(m.get('https://jobs.example.com/vectorloom/202'), 'uncertain');
  assert.equal(m.get('https://jobs.example.com/neuralforge/105'), 'expired');
  assert.equal(parseLiveness('✅ active  https://a.example\n❌ expired  https://a.example').get('https://a.example'), 'conflict');
});

test('loadClearance refuses a clearance without who/what/when', () => {
  const dir = tmp();
  const bad = path.join(dir, 'c.json');
  fs.writeFileSync(bad, JSON.stringify({ gate: 'G-TIMELINE', by: '', date: '2026-10-20', condition: 'x', companies: ['A'] }));
  assert.throws(() => loadClearance(bad), /who\/what\/when/);
  assert.equal(loadClearance(fx('clearance.fixture.json')).by, 'Fixture Reviewer (fictional)');
});

// ── break cases at the company gate
test('break: Pooled Investment Fund, blank date, blank amount are stop conditions', () => {
  const rows = parseCsv(fs.readFileSync(fx('companies.fixture.csv'), 'utf8'));
  const ctx = { asOf: parseDate('2026-10-20'), snapshot: parseDate('2025-11-15'), formd: new Map() };
  const get = (n) => evaluateCompany(rows.find((r) => r.company_name === n), ctx);
  assert.deepEqual([get('MERIDIAN AI OPPORTUNITIES FUND LP').status, get('MERIDIAN AI OPPORTUNITIES FUND LP').reason], ['STOP', 'pooled-investment-fund']);
  assert.deepEqual([get('BLANKDATE ROBOTICS INC').status, get('BLANKDATE ROBOTICS INC').reason], ['STOP', 'funding-date-blank']);
  assert.deepEqual([get('BLANKAMOUNT VISION INC').status, get('BLANKAMOUNT VISION INC').reason], ['STOP', 'funding-amount-blank']);
});

test('break: stale funding and below-minimum funding fail; nothing is filled in', () => {
  const rows = parseCsv(fs.readFileSync(fx('companies.fixture.csv'), 'utf8'));
  const ctx = { asOf: parseDate('2026-10-20'), snapshot: parseDate('2025-11-15'), formd: new Map() };
  const get = (n) => evaluateCompany(rows.find((r) => r.company_name === n), ctx);
  assert.equal(get('OLDGROWTH AI INC').reason, 'funding-stale');
  assert.equal(get('TINYSEED ML INC').reason, 'funding-below-minimum');
  assert.equal(get('QUIETCIRCUIT INC').reason, 'runway-ends-before-filing');
});

// ── end-to-end on fixtures with the real scorer
test('end-to-end: only PASS postings and cleared+live CANNOT-VERIFY postings reach the scorer', () => {
  const r = fixtureRun();
  assert.equal(r.code, 0, r.error);
  const scored = r.log.postings.filter((p) => p.status === 'scored').map((p) => p.posting_id).sort();
  assert.deepEqual(scored, ['p01-pass', 'p02-cleared', 'p17-formd-newer']);
  const roles = JSON.parse(fs.readFileSync(path.join(r.out, 'roles.json'), 'utf8')).roles.map((x) => x.role_id).sort();
  assert.deepEqual(roles, scored);
  const scores = JSON.parse(fs.readFileSync(path.join(r.out, 'role-scores.json'), 'utf8'));
  assert.equal(scores.profile_needs_sponsorship, true);
  assert.equal(scores.roles.length, 3);
});

test('break: Approval_Rate is a percentage and is rescaled to 0–1 with its CSV line cited', () => {
  const r = fixtureRun();
  const p = r.byId.get('p01-pass');
  assert.equal(p.role.sponsorship.p, 97.5609756097561 / 100);
  assert.match(p.role.sponsorship.basis, /Approval_Rate 97\.5609756097561% \(CSV line 2\)/);
  assert.equal(p.role.sponsorship.source, 'record');
  assert.equal(r.byId.get('p16-no-sponsorship-record').reasons.includes('sponsorship-record-missing'), true);
});

test('clearance: cleared CANNOT-VERIFY posting is sample-scored but its verdict stays HOLD', () => {
  const r = fixtureRun();
  const p = r.byId.get('p02-cleared');
  assert.equal(p.verdict, 'HOLD — runway unverified');
  assert.notEqual(p.verdict, 'Apply');
  assert.equal(p.role.timeline.source, 'your-input');
  assert.ok(p.scorer.recommendation, 'scorer output is kept for the sample record');
  const q = r.byId.get('p03-cleared-but-uncertain');
  assert.equal(q.status, 'held');
  assert.ok(q.reasons.includes('liveness-uncertain'));
});

test('clearance: without a clearance file every CANNOT-VERIFY posting is held', () => {
  const r = fixtureRun([], { clearance: false });
  assert.equal(r.byId.get('p02-cleared').status, 'held');
  assert.ok(r.byId.get('p02-cleared').reasons.includes('runway-unverified'));
});

test('break: ambiguous and unmatched company names are held, never guessed', () => {
  const r = fixtureRun();
  const a = r.byId.get('p10-ambiguous');
  assert.equal(a.status, 'held');
  assert.deepEqual(a.reasons, ['company-ambiguous']);
  assert.equal(a.csv_lines.length, 2);
  assert.deepEqual(r.byId.get('p15-unmatched').reasons, ['company-unmatched']);
});

test('break: VOUCH-style keyword false positive is flagged weak and is not scored', () => {
  const r = fixtureRun();
  const p = r.byId.get('p11-weak-title');
  assert.equal(p.status, 'held');
  assert.ok(p.warnings.some((w) => w.startsWith('weak-title-match')));
  assert.ok(p.reasons.includes('runway-unverified'));
});

test('postings: no URL, missing fit, non-AI title, expired posting', () => {
  const r = fixtureRun();
  assert.ok(r.byId.get('p13-no-posting').reasons.includes('no-posting-supplied'));
  assert.ok(r.byId.get('p14-fit-missing').reasons.includes('fit-missing'));
  assert.ok(r.byId.get('p12-title-not-ai').reasons.includes('title-not-ai'));
  assert.deepEqual([r.byId.get('p18-expired').status, r.byId.get('p18-expired').reasons], ['excluded', ['liveness-expired']]);
  for (const id of ['p04-timeline-fail', 'p05-stale', 'p06-blank-date', 'p07-blank-amount', 'p08-below-min', 'p09-fund'])
    assert.equal(r.byId.get(id).status, 'excluded', id);
});

test('regression: a row with no posting reports only no-posting-supplied, never title-not-ai', () => {
  // Found in the 2026-10-20 run1 sample: AIERA/MEMBRION rows (title null, url null) were
  // reported as "title-not-ai; no-posting-supplied", blaming a title that does not exist.
  const dir = tmp();
  const postings = path.join(dir, 'postings.json');
  fs.writeFileSync(postings, JSON.stringify({ postings: [
    { posting_id: 'np-null', company: 'NeuralForge Labs Inc', title: null, url: null, fit: null },
    { posting_id: 'np-titled', company: 'NeuralForge Labs Inc', title: 'Research Engineer, ML', url: null, fit: { p: 0.1, source: 'your-input' } },
  ] }));
  const res = run(['--as-of', '2026-10-20', '--postings', postings, '--liveness', fx('liveness.fixture.txt'),
    '--csv', fx('companies.fixture.csv'), '--formd-dir', fx('formd'), '--out-dir', path.join(dir, 'out')]);
  assert.equal(res.code, 0, res.error);
  for (const p of res.log.postings) {
    assert.equal(p.status, 'held', p.posting_id);
    assert.deepEqual(p.reasons, ['no-posting-supplied'], p.posting_id);
  }
});

test('Form D: a filing after the snapshot moves the effective date; one before it does not', () => {
  const r = fixtureRun();
  const fresh = r.byId.get('p17-formd-newer').company_gate;
  assert.equal(fresh.effective_funding_date, '2026-01-10');
  assert.equal(fresh.timeline, 'PASS');
  assert.equal(fresh.formd_evidence.source, 'model-judgment');
  const quiet = r.byId.get('p04-timeline-fail').company_gate;
  assert.equal(quiet.formd.matches, 1);
  assert.equal(quiet.formd.newer_than_snapshot, 0);
  assert.equal(quiet.reason, 'runway-ends-before-filing');
});

test('report: executive summary first, snapshot caveat present, BLS context labeled and not scored', () => {
  const r = fixtureRun();
  const md = fs.readFileSync(path.join(r.out, 'ai-startup-formd-report.md'), 'utf8');
  const lines = md.split('\n');
  assert.equal(lines.find((l) => l.startsWith('## ')), '## Executive summary');
  assert.match(md, /computed from funding snapshot dated 2025-11-15; rounds after that date are not visible/);
  assert.match(md, /does not affect the score/);
  assert.ok(r.log.bls_context.rows.some((x) => x.onet_soc_code === '15-1299.00' && x.job_zone === ''), 'blank job_zone stays blank');
  for (const p of r.log.postings.filter((x) => x.status === 'scored')) assert.equal(p.role.role_quality, undefined);
});

test('break: snapshot older than the staleness window refuses the whole run (exit 5)', () => {
  const r = fixtureRun([], { asOf: '2028-06-01' });
  assert.equal(r.code, 5);
  assert.equal(r.log.run_gate.reason, 'cannot verify current runway');
  assert.equal(fs.existsSync(path.join(r.out, 'roles.json')), false);
  assert.match(fs.readFileSync(path.join(r.out, 'ai-startup-formd-report.md'), 'utf8'), /refused to judge any company/);
});

test('CLI: missing --as-of is a bad-input exit, and decisions are printed into the log', () => {
  const res = spawnSync(process.execPath, [SCRIPT, '--postings', fx('postings.fixture.json')], { encoding: 'utf8' });
  assert.equal(res.status, 2);
  assert.match(res.stderr, /--as-of is required/);
  assert.equal(fixtureRun().log.decisions.runway_months, DECISIONS.runway_months);
});
