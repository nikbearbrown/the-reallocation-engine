#!/usr/bin/env node
/**
 * Deterministic self-test for output-linter.mjs against the spec's 12 test
 * cases. Expectations below are adjusted for the v0.1 scope decision
 * (E001 + W001 only; E002 + W002 descoped to v0.2 — see the linter's
 * header comment and recipes/output-linter.md for the reasoning).
 *
 * Where a TC's original expected outcome depended on E002/W002, the
 * expectation here reflects only the portion this v0.1 build can
 * actually check, and is annotated accordingly.
 *
 * Layout (colocated with the script, per repo convention — no `tests/`
 * directory precedent was found in this repository):
 *   scripts/output-linter.mjs
 *   scripts/output-linter.test.mjs      (this file)
 *   scripts/output-linter.fixtures/tc-*.md
 *
 * Run with:
 *   node scripts/output-linter.test.mjs
 */
import { lint } from './output-linter.mjs';
import { readFileSync } from 'node:fs';

const FIXTURES_DIR = new URL('./output-linter.fixtures/', import.meta.url);

const cases = [
  { file: 'tc-001.md', expectCodes: [], note: 'clean sourced claim' },
  { file: 'tc-002.md', expectCodes: ['E001'], note: 'unsourced percentage' },
  { file: 'tc-003.md', expectCodes: [], note: 'sourced decimal score' },
  {
    file: 'tc-004.md',
    expectCodes: [],
    note: 'unlabeled judgment — E002 not implemented in v0.1, so no finding is CORRECT for this build, not a false negative against v0.1 scope',
  },
  { file: 'tc-005.md', expectCodes: [], note: 'labeled judgment' },
  { file: 'tc-006.md', expectCodes: ['W001'], note: 'over-warranted future claim' },
  { file: 'tc-007.md', expectCodes: [], note: 'calibrated wording' },
  { file: 'tc-008.md', expectCodes: [], note: 'operational "will" must not trigger' },
  { file: 'tc-009.md', expectCodes: ['W001'], note: 'strong guarantee claim' },
  {
    file: 'tc-010.md',
    expectCodes: ['W001'],
    note: 'missing evidence boundary — only W001 (definitely) is checkable in v0.1; W002 not implemented',
  },
  { file: 'tc-011.md', expectCodes: [], note: 'fully bounded recommendation' },
  {
    file: 'tc-012-broken.md',
    expectCodes: ['W001'],
    note: 'deliberate break attempt (verb swapped to "will be a good target"); the companion break (stripping "Model judgment:") is not checkable in v0.1 since E002 is not implemented — recorded as a known gap, not silently passed over',
  },
];

let pass = 0;
let fail = 0;

for (const tc of cases) {
  const text = readFileSync(new URL(tc.file, FIXTURES_DIR), 'utf8');
  const result = lint(text);
  const gotCodes = result.findings.map((f) => f.code);

  const expected = [...tc.expectCodes].sort();
  const got = [...gotCodes].sort();
  const ok = JSON.stringify(expected) === JSON.stringify(got);

  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${tc.file.padEnd(20)} expected=${JSON.stringify(expected)} got=${JSON.stringify(got)}  (${tc.note})`
  );

  if (ok) pass++;
  else fail++;
}

console.log('');
console.log(`${pass}/${cases.length} test cases passed`);
process.exit(fail > 0 ? 1 : 0);
