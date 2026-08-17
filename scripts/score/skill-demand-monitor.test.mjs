#!/usr/bin/env node
// skill-demand-monitor.test.mjs — verification harness for skill-demand-monitor.mjs.
//
// This is the "honest run" break-attempt made repeatable: it proves the gates are
// HARD STOPS (they refuse to rank rather than confidently voting on bad/thin data —
// the "gate-as-vote" bug the book calls out), not just documentation. Black-box:
// invokes the real CLI exactly as a user would, then inspects the real JSON output —
// no internal functions are imported, so this also catches interface regressions.
//
// Plain node:assert (built-in, no framework), matching this codebase's existing
// idiom (conformance.mjs / verify-pipeline.mjs): manual counters, process.exit(1)
// on any failure.
//
//   node scripts/score/skill-demand-monitor.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPT = path.join(path.dirname(new URL(import.meta.url).pathname), 'skill-demand-monitor.mjs');
const EXAMPLE_POSTINGS = path.resolve('data/examples/skill-demand/example-postings.json');
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-demand-test-'));

let passed = 0, failed = 0;

function run(postingsPath, extraArgs = []) {
  return runFull(postingsPath, extraArgs).json;
}

function runFull(postingsPath, extraArgs = []) {
  const outDir = fs.mkdtempSync(path.join(tmpRoot, 'run-'));
  const mdPath = path.join(outDir, 'report.md');
  execFileSync('node', [SCRIPT, postingsPath, '--out-dir', outDir, '--md', mdPath, ...extraArgs], { stdio: 'pipe' });
  return {
    json: JSON.parse(fs.readFileSync(path.join(outDir, 'skill-demand.json'), 'utf8')),
    md: fs.readFileSync(mdPath, 'utf8'),
  };
}

function writeFixture(name, postings) {
  const p = path.join(tmpRoot, name);
  fs.writeFileSync(p, JSON.stringify({ postings }));
  return p;
}

function basePosting(overrides = {}) {
  return {
    job_id: 'test-0', title: 'AI Engineer', company_name: 'Test Co',
    source_url: 'https://example.invalid/test-0', description_text: 'Python required.',
    ...overrides,
  };
}

function testCase(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}\n      ${e.message}`); failed++; }
}

console.log('skill-demand-monitor verification harness\n');

// ── Case 1: too small a sample must HALT, not confidently rank ──────────────
testCase('sample-size gate halts on 3 postings and emits no ranked list', () => {
  const postings = [0, 1, 2].map((i) => basePosting({ job_id: `tiny-${i}`, source_url: `https://example.invalid/tiny-${i}` }));
  const fx = writeFixture('tiny.json', postings);
  const result = run(fx, ['--role-filter', 'ai engineer']);
  assert.equal(result.status, 'insufficient_sample', 'status must be insufficient_sample, not a confident ranking');
  assert.equal('skills' in result, false, 'no `skills` key should be emitted when the sample gate is closed');
  assert.equal(result.candidate_count, 3);
});

// ── Case 2: full committed example fixture — hand-verified count must match ──
testCase('known skill count matches a hand-count of the committed fixture (python: 22/22)', () => {
  const result = run(EXAMPLE_POSTINGS, ['--role-filter', 'ai engineer']);
  assert.equal(result.status, 'ranked');
  assert.equal(result.candidate_count, 22, 'the AI Engineer role filter must match exactly 22 of the 28 example postings');
  const python = result.skills.find((s) => s.id === 'python');
  assert.ok(python, 'python must appear in the ranked list');
  assert.equal(python.posting_count, 22, 'every one of the 22 candidate postings mentions Python by design of the fixture');
  assert.equal(python.evidence.length, 22, 'evidence array must carry one entry per contributing posting — every count traces to a record');
});

// ── Case 3: a record missing a required field must be rejected, not dropped or crashed ──
testCase('a posting missing description_text is rejected with a named reason, not silently dropped', () => {
  const postings = [
    ...Array.from({ length: 20 }, (_, i) => basePosting({ job_id: `ok-${i}`, source_url: `https://example.invalid/ok-${i}` })),
    basePosting({ job_id: 'broken-1', source_url: 'https://example.invalid/broken-1', description_text: '' }),
  ];
  const fx = writeFixture('missing-field.json', postings);
  const result = run(fx, ['--role-filter', 'ai engineer']);
  assert.equal(result.total_postings_ingested, 21);
  assert.equal(result.valid_count, 20, 'the broken record must not count as valid');
  assert.equal(result.rejects.length, 1);
  assert.equal(result.rejects[0].job_id, 'broken-1');
  assert.equal(result.rejects[0].reason, 'missing_description_text');
  assert.equal(result.rejects_by_reason.missing_description_text, 1);
});

// ── Case 4: postings using zero taxonomy-recognized terms must flag low_coverage ──
testCase('postings with no recognized skills set low_coverage=true rather than a silently-thin ranking', () => {
  const filler = 'We need someone comfortable with SAP ERP, Excel macros, Salesforce administration, and Six Sigma process improvement in a supply-chain back office.';
  const postings = Array.from({ length: 25 }, (_, i) => basePosting({
    job_id: `nohit-${i}`, source_url: `https://example.invalid/nohit-${i}`, description_text: filler,
  }));
  const fx = writeFixture('no-taxonomy-hits.json', postings);
  const result = run(fx, ['--role-filter', 'ai engineer']);
  assert.equal(result.status, 'ranked', 'the run still ranks (possibly an empty list) rather than halting outright');
  assert.equal(result.low_coverage, true, 'zero-hit rate of 100% must exceed the 40% coverage floor');
  assert.equal(result.zero_hit_rate, 1, 'every posting in this fixture uses only out-of-taxonomy terms by construction');
  assert.deepEqual(result.skills, [], 'no taxonomy skill should match this filler text');
});

// ── Case 5: overriding --min-sample below the default must never be reported as
// unconditional confidence -- this is the exact bug the 2026-08-14 real run found:
// an early version's headline said "enough data to trust this ranking" and the gates
// table printed the tool's hardcoded default instead of the threshold actually used,
// whenever the gate mechanically passed. This reproduces that exact scenario against
// the fixed code and would fail if the honesty fix were ever reverted. ──
testCase('a --min-sample override below the default is threaded through and flagged, never reported as unconditional confidence', () => {
  const { json: result, md } = runFull(EXAMPLE_POSTINGS, ['--role-filter', 'ai engineer', '--min-sample', '2']);
  assert.equal(result.status, 'ranked');
  assert.equal(result.min_sample_used, 2, 'the report must reflect the threshold actually enforced, not the tool default');
  assert.equal(result.min_sample_overridden_below_default, true, 'an override below the default (20) must be flagged as such');
  assert.match(md, /sample-size floor was manually lowered to 2/, 'the report must loudly caution that the floor was manually weakened');
  assert.match(md, /overridden below default of 20/, 'the gates table must show the real threshold and that it was overridden, not the default dressed up as the value checked');
  assert.doesNotMatch(md, /enough data to trust this ranking/i, 'clearing a manually-lowered gate must never be reported as unconditional confidence -- the exact bug this test guards against');
});

console.log(`\n${passed} passed, ${failed} failed`);
fs.rmSync(tmpRoot, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
