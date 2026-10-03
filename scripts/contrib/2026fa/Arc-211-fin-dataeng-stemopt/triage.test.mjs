// triage.test.mjs — offline tests for triage.mjs (node --test). No network: fixtures only,
// and the REAL scorer (scripts/score/role-scorer.mjs) is what scores the roles.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const TRIAGE = path.join(HERE, 'triage.mjs');
const BASE = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures/config.fixture.json'), 'utf8'));

function run(overrides = {}, args = []) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc211-triage-'));
  const cfg = { ...structuredClone(BASE), ...overrides };
  const cfgPath = path.join(dir, 'config.json');
  fs.writeFileSync(cfgPath, JSON.stringify(cfg));
  const out = path.join(dir, 'out');
  const r = spawnSync(process.execPath, [TRIAGE, '--config', cfgPath, '--out-dir', out, ...args], { cwd: REPO, encoding: 'utf8' });
  const read = (f) => JSON.parse(fs.readFileSync(path.join(out, f), 'utf8'));
  return { ...r, out, log: r.status === 0 ? read('triage-log.json') : null, roles: r.status === 0 ? read('roles.json') : null };
}
const row = (log, name) => log.results.find((e) => e.company === name);

test('happy path: proven sponsor, live posting, E-Verify confirmed → tailor-application via the real scorer', () => {
  const r = run();
  assert.equal(r.status, 0, r.stderr);
  const e = row(r.log, 'EXAMPLE LEDGER INC');
  assert.equal(e.score.recommendation, 'Apply');
  assert.equal(e.score.composite, 0.555); // (0.9·0.35 + 0.8·0.3) × 1 × 1 — computed by role-scorer.mjs, not here
  assert.equal(e.next_action, 'tailor-application');
  assert.equal(e.funding.form_d_sample_hits.value.length, 1);
  assert.ok(r.log.scorer.ran && r.log.scorer.command.includes('scripts/score/role-scorer.mjs'));
  assert.ok(fs.existsSync(path.join(r.out, 'triage-report.md')));
  assert.match(fs.readFileSync(path.join(r.out, 'triage-report.md'), 'utf8'), /^# .*\n\n## Executive summary/);
});

test('every emitted value carries one of the three labels', () => {
  const { log } = run();
  const labels = new Set();
  JSON.stringify(log, (k, val) => { if (k === 'label') labels.add(val); return val; });
  assert.deepEqual([...labels].sort(), ['model-judgment', 'record', 'your-input']);
});

test('F3: a role with no liveness record is NOT sent to the scorer', () => {
  const r = run();
  assert.equal(row(r.log, 'EXAMPLE CREDIT INC').next_action, 'check-posting-by-hand');
  assert.ok(!r.roles.some((x) => x.company === 'EXAMPLE CREDIT INC'));
  for (const x of r.roles) assert.equal(typeof x.liveness.factor, 'number', 'liveness must never be omitted');
});

test('dead posting at a proven sponsor → gated Skip, routed to networking', () => {
  const e = row(run().log, 'EXAMPLE BANK CORP');
  assert.equal(e.score.recommendation, 'Skip');
  assert.match(e.score.reason, /gated: liveness/);
  assert.equal(e.next_action, 'network-into-company');
});

test('salary floor applied outside the scorer; below-floor never scored', () => {
  const r = run();
  assert.equal(row(r.log, 'EXAMPLE INSURE CO').status, 'below-floor');
  assert.ok(!r.roles.some((x) => x.company === 'EXAMPLE INSURE CO'));
});

test('F2 + F6 in auto mode: blank H-1B rows are counted, not scored; non-finance industry excluded', () => {
  const { log } = run();
  assert.equal(log.census.industry_rows_h1b_blank, 1);
  assert.equal(row(log, 'EXAMPLE PAYMENTS LLC'), undefined);
  assert.equal(row(log, 'EXAMPLE CLOUD INC'), undefined); // "Other Technology" — the known blind spot
});

test('F1 + F2 with named candidates: not-found and blank H-1B never get a sponsorship value', () => {
  const r = run({ candidates: ['EXAMPLE PAYMENTS LLC', 'NOT A REAL COMPANY'] });
  assert.equal(r.status, 0, r.stderr);
  const blank = row(r.log, 'EXAMPLE PAYMENTS LLC'); const missing = row(r.log, 'NOT A REAL COMPANY');
  assert.equal(blank.status, 'sponsorship-unknown'); assert.equal(blank.sponsorship, undefined);
  assert.equal(missing.status, 'not-found'); assert.equal(missing.sponsorship, undefined);
  assert.equal(r.log.scorer.ran, false);
  assert.equal(r.roles.length, 0);
});

test('F4: OPT not filed and filing window closed → timeline 0 → gated Skip', () => {
  const r = run({}, ['--as-of', '2027-03-01']);
  assert.equal(r.log.timeline_gate.factor, 0);
  const e = row(r.log, 'EXAMPLE LEDGER INC');
  assert.equal(e.score.recommendation, 'Skip');
  assert.match(e.score.reason, /gated: timeline/);
});

test('timeline: offer after OPT start consumes unemployment days linearly', () => {
  // as_of 2027-01-10 + 60 = 2027-03-11; 80 days after 2026-12-21 → 1 − 80/90
  const r = run({ visa: { ...BASE.visa, opt_filed: true } }, ['--as-of', '2027-01-10']);
  assert.equal(r.log.timeline_gate.factor, 0.111);
});

test('F5: a target SOC with no BLS row is flagged missing, never filled', () => {
  const soc = run().log.target_socs.find((s) => s.soc === '15-9999.00');
  assert.equal(soc.status, 'missing'); assert.equal(soc.median, undefined);
});

test('F5 (all missing): exits 3 with a clear message', () => {
  const r = run({ target_socs: ['15-9999.00'] });
  assert.equal(r.status, 3); assert.match(r.stderr, /none of the target SOCs/);
});

test('G1: a missing input file exits 2 and writes nothing', () => {
  const r = run({ paths: { ...BASE.paths, sponsors_csv: 'does/not/exist.csv' } });
  assert.equal(r.status, 2); assert.match(r.stderr, /G1 input missing/);
  assert.ok(!fs.existsSync(r.out));
});

test('manual liveness check is labeled your-input, not record, all the way into roles.json', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc211-live-'));
  const lv = path.join(dir, 'liveness.json');
  fs.writeFileSync(lv, JSON.stringify({ 'EXAMPLE CREDIT INC': { url: 'https://boards.example.com/credit', result: 'active',
    method: 'manual', checked_on: '2026-10-01', posting_title: 'Analytics Engineer' } }));
  const r = run({ paths: { ...BASE.paths, liveness_json: lv } });
  const e = row(r.log, 'EXAMPLE CREDIT INC');
  assert.equal(e.liveness.label, 'your-input');
  const role = r.roles.find((x) => x.company === 'EXAMPLE CREDIT INC');
  assert.equal(role.liveness.source, 'your-input');
  assert.equal(role.title, 'Analytics Engineer');
});

test('extra_candidates: a real-world name absent from the CSV is reported not-found alongside the auto list', () => {
  const r = run({ extra_candidates: ['BIG BANK NOT IN DATA'] });
  assert.equal(row(r.log, 'BIG BANK NOT IN DATA').next_action, 'not-in-data');
  assert.ok(row(r.log, 'EXAMPLE LEDGER INC'), 'auto list still present');
});

test('fit is judged on the posting title, not the company\'s past sponsored titles', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc211-fit-'));
  const lv = path.join(dir, 'liveness.json');
  // EXAMPLE LEDGER INC sponsored "Data Engineer" in the past — but this posting is not a target role
  fs.writeFileSync(lv, JSON.stringify({ 'EXAMPLE LEDGER INC': { url: 'https://boards.example.com/ledger/x', result: 'active',
    method: 'ats:liveness', checked_on: '2026-10-01', posting_title: 'Fraud Investigator' } }));
  const r = run({ paths: { ...BASE.paths, liveness_json: lv } });
  const e = row(r.log, 'EXAMPLE LEDGER INC');
  assert.equal(e.fit.value, null);
  assert.equal(e.sponsored_title_match.value, 'strong');
  assert.equal(r.roles.find((x) => x.company === 'EXAMPLE LEDGER INC').fit, undefined);
});

test('no fit vote → review-role-fit even when sponsorship alone clears the Apply threshold', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc211-nofit-'));
  const lv = path.join(dir, 'liveness.json');
  fs.writeFileSync(lv, JSON.stringify({ 'EXAMPLE LEDGER INC': { url: 'https://boards.example.com/ledger/x', result: 'active',
    method: 'ats:liveness', checked_on: '2026-10-01', posting_title: 'Fraud Investigator' } }));
  const e = row(run({ paths: { ...BASE.paths, liveness_json: lv } }).log, 'EXAMPLE LEDGER INC');
  assert.equal(e.score.recommendation, 'Apply'); // the shipped scorer's verdict: 0.9 × 0.35 = 0.315 ≥ 0.3
  assert.equal(e.next_action, 'review-role-fit'); // this recipe's rule on top of it
});

test('E-Verify: a transcribed e-verify.gov lookup is a record; a bare claim stays your-input', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc211-ev-'));
  const ev = path.join(dir, 'everify.json');
  fs.writeFileSync(ev, JSON.stringify({
    'EXAMPLE LEDGER INC': { status: 'confirmed', method: 'e-verify.gov', checked_on: '2026-10-01', search_term: 'Example Ledger', matched: ['Example Ledger, Inc. — Open'] },
    'EXAMPLE BANK CORP': { status: 'confirmed', checked_on: '2026-10-01' } }));
  const { log } = run({ paths: { ...BASE.paths, everify_json: ev } });
  assert.equal(row(log, 'EXAMPLE LEDGER INC').everify.label, 'record');
  assert.equal(row(log, 'EXAMPLE BANK CORP').everify.label, 'your-input');
});

test('closed timeline gate: unchecked postings are skipped too, not sent for a manual check', () => {
  const { log } = run({}, ['--as-of', '2027-03-01']);
  const e = row(log, 'EXAMPLE CREDIT INC'); // no liveness entry
  assert.equal(e.status, 'timeline-closed');
  assert.equal(e.next_action, 'skip');
  assert.ok(!log.results.some((x) => x.next_action === 'check-posting-by-hand'));
});
