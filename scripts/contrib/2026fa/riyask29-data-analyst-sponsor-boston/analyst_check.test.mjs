// analyst_check.test.mjs — offline tests (node --test). No network: liveness
// comes from fixtures/liveness.fixture.json, data from fixtures/*.slice.*
// (rows cut verbatim from the real repo files). The scorer is the REAL
// scripts/score/role-scorer.mjs, run by the prototype — not a copy.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readCsv, findCompany, classifyTitle, timelineFactor, wageCheck, formDLookup, lcaLookup, seniorityCheck, nextAction } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(HERE, 'fixtures');
const TODAY = '2026-10-02';
const families = JSON.parse(fs.readFileSync(path.join(HERE, 'config/title-families.json'), 'utf8'));
const persona = JSON.parse(fs.readFileSync(path.join(HERE, 'inputs/persona.example.json'), 'utf8'));
const sponsors = readCsv(path.join(FX, 'sponsors.slice.csv'));

function run(extra = [], personaFile = path.join(HERE, 'inputs/persona.example.json')) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'riyask29-analyst-'));
  const r = spawnSync(process.execPath, [path.join(HERE, 'analyst_check.mjs'),
    '--persona', personaFile,
    '--candidates', path.join(FX, 'candidates.fixture.json'),
    '--liveness-file', path.join(FX, 'liveness.fixture.json'),
    '--sponsors', path.join(FX, 'sponsors.slice.csv'),
    '--bls', path.join(FX, 'bls.slice.csv'),
    '--formd-dir', path.join(FX, 'formd'),
    '--today', TODAY, '--out-dir', out, ...extra], { encoding: 'utf8' });
  const logPath = path.join(out, 'analyst-check-log.json');
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : null;
  return { ...r, out, log, role: (id) => log.roles.find((e) => e.role_id === id) };
}

test('title classifier separates data-analyst titles from other "analyst" titles', () => {
  const fam = (t) => classifyTitle(t, families).family;
  assert.equal(fam('Data Analyst'), 'data-analyst-family');
  assert.equal(fam('Business Intelligence Analyst'), 'data-analyst-family');
  assert.equal(fam('Cyber Analyst I'), 'other-analyst');
  assert.equal(fam('Senior Quality Control Analyst'), 'other-analyst');
  assert.equal(fam('Business Analyst Manager - Data Distribution Team'), 'ambiguous-analyst');
  assert.equal(fam('Business Intelligence Engineer'), 'non-analyst');
  // riyask29's G4 decision (2026-10-02): quant analyst is not data-analyst evidence
  assert.equal(fam('Senior Quantitative Analyst'), 'other-analyst');
});

test('company lookup never guesses (F1, F2)', () => {
  assert.equal(findCompany(sponsors, 'HubSpot').status, 'not-in-dataset');
  assert.equal(findCompany(sponsors, 'Writer').status, 'no-h1b-record');
  assert.equal(findCompany(sponsors, 'Benefits Science').status, 'found'); // suffix normalised
  const amb = findCompany(sponsors, 'Abacus');
  assert.equal(amb.status, 'not-exact-near-matches');
  assert.equal(amb.row, null);
  assert.equal(amb.near.length, 3);
});

test('timeline factor: unemployment days bind before the OPT date (F4)', () => {
  assert.equal(timelineFactor(persona, 4, TODAY).factor, 1);      // 49 − 28 = 21 ≥ 20
  assert.equal(timelineFactor(persona, 5, TODAY).factor, 0.7);    // 49 − 35 = 14 → 14/20
  assert.equal(timelineFactor(persona, 10, TODAY).factor, 0);     // 70 > 49
  assert.equal(timelineFactor(persona, 4, TODAY).binding_clock, 'unemployment-days');
  const ended = { ...persona, visa: { ...persona.visa, opt_end_date: '2026-09-01' } };
  assert.deepEqual([timelineFactor(ended, 1, TODAY).factor, timelineFactor(ended, 1, TODAY).status], [0, 'opt-already-ended']);
  assert.equal(timelineFactor(persona, null, TODAY).factor, null);
});

test('wage check reports a missing SOC row instead of a number (F5)', () => {
  const bls = readCsv(path.join(FX, 'bls.slice.csv'));
  const [w] = wageCheck(bls, ['99-9999.00'], sponsors[0]);
  assert.equal(w.status, 'no-occupation-row');
  assert.equal(w.bls_annual_median, undefined);
});

test('end to end on fixtures: gates hold, failures are not scored, real scorer runs', () => {
  const r = run();
  assert.equal(r.status, 0, r.stderr);
  for (const f of ['roles.json', 'role-scores.json', 'role-scores.md', 'analyst-check-log.json', 'analyst-check-report.md'])
    assert.ok(fs.existsSync(path.join(r.out, f)), `missing ${f}`);

  const scores = JSON.parse(fs.readFileSync(path.join(r.out, 'role-scores.json'), 'utf8'));
  assert.equal(scores._scorer, 'bayesian-role-scorer');           // the repo's scorer, not a copy
  const sent = JSON.parse(fs.readFileSync(path.join(r.out, 'roles.json'), 'utf8')).map((x) => x.role_id).sort();
  assert.deepEqual(sent, ['t-cyber-only', 't-human-confirmed', 't-proven-dead', 't-proven-live', 't-slow-hire']);
  // a person's G2 check keeps its your-input label all the way into the scorer input
  const hc = JSON.parse(fs.readFileSync(path.join(r.out, 'roles.json'), 'utf8')).find((x) => x.role_id === 't-human-confirmed');
  assert.equal(hc.liveness.source, 'your-input');
  assert.equal(JSON.parse(fs.readFileSync(path.join(r.out, 'roles.json'), 'utf8')).find((x) => x.role_id === 't-proven-live').liveness.source, 'record');

  // F1/F2: stopped at G1 with NO sponsorship value invented
  for (const id of ['t-not-in-csv', 't-no-h1b-record', 't-ambiguous']) {
    assert.equal(r.role(id).stopped_at, 'G1');
    assert.equal(r.role(id).sponsorship, null);
    assert.equal(r.role(id).scorer, undefined);
  }
  // F6: dead posting → gate closes → Skip, and a Proven sponsor becomes a networking lead
  assert.equal(r.role('t-proven-dead').scorer.recommendation, 'Skip');
  assert.match(r.role('t-proven-dead').scorer.reason, /liveness/);
  assert.equal(r.role('t-proven-dead').next_action.action, 'network');
  // uncertain liveness stops for a human; missing hiring lag stops at G3
  assert.equal(r.role('t-uncertain').stopped_at, 'G2');
  assert.equal(r.role('t-no-lag').stopped_at, 'G3');
  // timeline gate zeroes a strong-fit role
  assert.match(r.role('t-slow-hire').scorer.reason, /timeline/);
  // "Cyber Analyst I" is not data-analyst evidence
  assert.equal(r.role('t-cyber-only').sponsorship.tier, 'Possible');
  // F3: Form D join is reported, sample coverage stated
  assert.equal(r.role('t-formd-hit').funding.status, 'in-sample');
  assert.equal(r.role('t-proven-live').funding.status, 'not-in-sample');

  // every emitted value carries a label
  for (const e of r.log.roles) {
    assert.ok(e.company_match.source);
    if (e.sponsorship) for (const k of ['counts_source', 'titles_source', 'classification_source', 'p_source']) assert.ok(e.sponsorship[k], `${e.role_id}.${k}`);
    if (e.timeline) assert.equal(e.timeline.source, 'your-input');
    if (e.liveness) assert.ok(e.liveness.source);
  }
});

test('OPT already past → every scored role is gated to Skip (F4)', () => {
  const r = run([], path.join(FX, 'persona.opt-ended.json'));
  assert.equal(r.status, 0, r.stderr);
  for (const e of r.log.roles.filter((x) => x.scorer)) assert.equal(e.scorer.recommendation, 'Skip');
});

test('break attempt: "work authorized" persona — prototype refuses instead of reporting zero-weight scores', () => {
  const r = run([], path.join(FX, 'persona.authorized-trap.json'));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /misread/);
  assert.equal(r.log, null);
});

test('missing OPT end date → refuses to guess a timeline', () => {
  const r = run([], path.join(FX, 'persona.missing-date.json'));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /opt_end_date/);
  assert.equal(r.log, null);
});

test('Form D: absent from a SAMPLE says nothing; absent from FULL quarters is "not filed under this name", never "no funding"', () => {
  const co = (name) => ({ company: { name }, filing: { quarter: '2026q1-d', date_filed: '2026-02-03' }, funding: { total_amount_sold: 5e6 } });
  const sample = [{ metadata: { quarter: '2026q1-d', total_companies: 15981 }, companies: [co('Acme Data Inc')] }];
  const full = [{ metadata: { quarter: '2026q1-d', total_companies: 2 }, companies: [co('Acme Data Inc'), co('Other LLC')] }];
  assert.equal(formDLookup(sample, 'Missing Co').status, 'not-in-sample');
  assert.match(formDLookup(sample, 'Missing Co').meaning, /says nothing/);
  assert.equal(formDLookup(full, 'ACME DATA, INC.').status, 'filed');          // name normalisation still applies
  const miss = formDLookup(full, 'Missing Co');
  assert.equal(miss.status, 'not-filed-under-this-name');
  assert.doesNotMatch(miss.meaning, /no funding|did not raise/i);
  assert.match(miss.coverage, /all 2 companies in 1 full quarter file/);
});

test('DOL LCA: SOC-level counts by exact employer name; absence is never "does not sponsor"', () => {
  const rows = [
    { employer_name: 'Example Analytics, Inc.', soc_code: '15-2051.01', soc_title: 'Business Intelligence Analysts', family: 'core', certified_lcas: '4', top_job_titles: 'Data Analyst' },
    { employer_name: 'Example Analytics, Inc.', soc_code: '15-1211.00', soc_title: 'Computer Systems Analysts', family: 'adjacent', certified_lcas: '2', top_job_titles: 'Systems Analyst' },
    { employer_name: 'Adjacent Only LLC', soc_code: '13-1111.00', soc_title: 'Management Analysts', family: 'adjacent', certified_lcas: '3', top_job_titles: 'Consultant' },
  ];
  const hit = lcaLookup(rows, 'EXAMPLE ANALYTICS INC', 'f.csv');
  assert.equal(hit.status, 'found');
  assert.equal(hit.core_lcas, 4);
  assert.equal(hit.adjacent_lcas, 2);
  assert.equal(hit.by_soc.length, 2);
  assert.match(lcaLookup(rows, 'Adjacent Only', 'f.csv').meaning, /only in adjacent/);
  const miss = lcaLookup(rows, 'Example', 'f.csv');                 // partial name is not a match
  assert.equal(miss.status, 'none-under-this-name');
  assert.match(miss.meaning, /^no certified analyst-family LCA/);
  assert.doesNotMatch(miss.meaning, /does not sponsor/i);
  assert.match(miss.meaning, /not evidence/);
});

test('G0 seniority: whole-word title match only, and a senior lead is skipped with the reason', () => {
  const words = JSON.parse(fs.readFileSync(path.join(HERE, 'config/title-families.json'), 'utf8')).seniority_words;
  assert.equal(seniorityCheck('Senior Analyst, SEM', words).matched, 'senior');
  assert.equal(seniorityCheck('Growth Analytics Manager, Payment Integrity', words).matched, 'manager');
  assert.equal(seniorityCheck('Sr. Data Analyst', words).matched, 'sr');
  assert.equal(seniorityCheck('Data Analyst', words).status, 'ok');
  assert.equal(seniorityCheck('Analytics Engineer', words).status, 'ok');
  assert.equal(seniorityCheck('Data Analyst II', words).status, 'ok');           // II is not on the list
  assert.equal(seniorityCheck('Leadership Data Analyst', words).status, 'ok');   // "lead" must be a whole word
  const e = { stopped_at: 'G0', seniority: { matched: 'senior', max_years: 3 } };
  assert.equal(nextAction(e).action, 'skip');
  assert.match(nextAction(e).why, /senior.*3 years/);
});
