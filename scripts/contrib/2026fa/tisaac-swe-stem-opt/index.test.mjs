#!/usr/bin/env node
// index.test.mjs — offline test for the SWE STEM-OPT prototype (index.js).
//
// Runs from fixture.json only, with no network calls: the prototype reads the
// local 80-days CSV and calls the local role-scorer.mjs. Black-box: invokes the
// real CLI exactly as a user would, writes into a temp --out-dir (never over a
// tracked file), then inspects the real JSON output.
//
// Plain node:assert, matching scripts/score/skill-demand-monitor.test.mjs:
// manual counters, process.exit(1) on any failure.
//
//   node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'index.js');
const FIXTURE = path.join(HERE, 'fixture.json');
const REPO_ROOT = path.resolve(HERE, '../../../../');
const CSV = path.join(REPO_ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv');
const LABELS = ['record', 'model-judgment', 'your-input'];
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tisaac-swe-stem-opt-test-'));

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${e.message.split('\n').join('\n      ')}`); }
}

function run(fixturePath) {
  const outDir = fs.mkdtempSync(path.join(tmpRoot, 'run-'));
  execFileSync('node', [SCRIPT, '--fixture', fixturePath, '--out-dir', outDir], { cwd: REPO_ROOT, stdio: 'pipe' });
  return {
    roles: JSON.parse(fs.readFileSync(path.join(outDir, 'my-roles.json'), 'utf8')),
    scored: JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8')).roles,
    outDir,
  };
}
const byId = (list, id) => list.find((r) => r.role_id === id);

console.log('SWE STEM-OPT prototype — offline test');
const { roles, scored, outDir } = run(FIXTURE);

test('writes both outputs (JSON log + Markdown report) into --out-dir', () => {
  assert.ok(fs.existsSync(path.join(outDir, 'role-scores.json')), 'role-scores.json missing');
  assert.ok(fs.existsSync(path.join(outDir, 'role-scores.md')), 'role-scores.md missing');
});

test('every evidence term carries one of the three allowed source labels', () => {
  for (const r of roles) {
    for (const term of ['sponsorship', 'fit', 'liveness', 'timeline']) {
      assert.ok(LABELS.includes(r[term].source), `${r.role_id}.${term}.source = "${r[term].source}"`);
    }
  }
});

test('real company: sponsorship is a record, and the CSV row really has H-1B approvals', () => {
  const r = byId(roles, 'job-1-real');
  assert.equal(r.sponsorship.source, 'record');
  assert.equal(r.sponsorship.tier, 'h1b-history');
  const row = fs.readFileSync(CSV, 'utf8').split('\n').find((l) => l.startsWith('1LIFE HEALTHCARE INC,'));
  assert.ok(row, 'company row not found in the CSV');
  const header = fs.readFileSync(CSV, 'utf8').split('\n')[0].split(',');
  const approvals = parseFloat(row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)[header.indexOf('Total Approvals')]);
  assert.ok(approvals > 0, `Total Approvals = ${approvals}`);
});

test('failure case 1 — company missing from the CSV: p 0, tier no-matched, never labeled record', () => {
  const r = byId(roles, 'job-2-fake');
  assert.equal(r.sponsorship.p, 0);
  assert.equal(r.sponsorship.tier, 'no-matched');
  assert.equal(r.sponsorship.source, 'your-input');
});

test('failure case 2 — non-ATS URL: liveness -1, scorer Skips it as gated', () => {
  assert.equal(byId(roles, 'job-3-bad-url').liveness.factor, -1);
  const s = byId(scored, 'job-3-bad-url');
  assert.equal(s.recommendation, 'Skip');
  assert.match(s.reason, /gated: liveness/);
});

test('offline liveness is never presented as a record', () => {
  for (const r of roles) assert.equal(r.liveness.source, 'your-input', r.role_id);
});

test('fit and timeline come from the fixture, not from numbers in the code', () => {
  const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  for (const job of fixture) {
    const r = byId(roles, job.id);
    assert.equal(r.fit.p, job.fit, `${job.id} fit`);
    assert.equal(r.timeline.factor, job.timeline, `${job.id} timeline`);
  }
});

test('fails clearly, without inventing a value, when a job is missing fit', () => {
  const broken = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  delete broken[0].fit;
  const brokenPath = path.join(tmpRoot, 'missing-fit.json');
  fs.writeFileSync(brokenPath, JSON.stringify(broken));
  const out = fs.mkdtempSync(path.join(tmpRoot, 'broken-'));
  const res = spawnSync('node', [SCRIPT, '--fixture', brokenPath, '--out-dir', out], { cwd: REPO_ROOT, encoding: 'utf8' });
  assert.notEqual(res.status, 0, 'expected a non-zero exit');
  assert.match(res.stderr, /missing "fit"/);
  assert.ok(!fs.existsSync(path.join(out, 'my-roles.json')), 'a partial output was written');
});

test('prototype source makes no network calls', () => {
  const src = fs.readFileSync(SCRIPT, 'utf8');
  assert.doesNotMatch(src, /\bfetch\s*\(|from ['"](node:)?https?['"]|require\(['"]https?['"]\)/);
});

fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
