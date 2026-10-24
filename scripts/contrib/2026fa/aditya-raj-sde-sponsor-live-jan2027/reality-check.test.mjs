// reality-check.test.mjs — offline tests for the INTENDED behavior of reality-check.mjs.
//
//   node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/
//
// What the maintained components actually do (F1a, F2(a)) is recorded by hypothesis-probe.mjs;
// these tests assert what THIS prototype must do with that behavior (F1b, F2(b), F3, timing,
// labels, G1). No network: fetch is stubbed to fail, and the source is checked for network imports.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  REPO, loadSponsorCsv, evaluateRole, classifyVacancy, matchCompany, validateInput, companyKey,
} from './reality-check.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'reality-check.mjs');
const FIX = (f) => path.join(HERE, 'fixtures', f);
const read = (f) => JSON.parse(fs.readFileSync(FIX(f), 'utf8'));
const tmpOut = (tag) => path.join(fs.mkdtempSync(path.join(os.tmpdir(), `rc-${tag}-`)), 'out');
const cli = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { cwd: REPO, encoding: 'utf8' });

let fetchCalls = 0;
globalThis.fetch = async () => { fetchCalls++; throw new Error('network is not allowed in these tests'); };

const csv = loadSponsorCsv();
const NEUTRAL = read('sample-run.json').roles[1].snapshot.bodyText;

test('no network: source imports nothing that can reach the network; fetch never called', () => {
  const src = fs.readFileSync(SCRIPT, 'utf8');
  assert.doesNotMatch(src, /from\s+['"](?:node:)?(?:http|https|net|tls|dgram|dns)['"]/);
  assert.doesNotMatch(src, /playwright|check-liveness|liveness-browser|\bfetch\(/);
  assert.equal(fetchCalls, 0);
});

test('maintained scorer is reused through its CLI, not copied', () => {
  const src = fs.readFileSync(SCRIPT, 'utf8');
  assert.match(src, /scripts\/score\/role-scorer\.mjs/);
  assert.doesNotMatch(src, /apply_threshold|consider_floor|gate_zero|0\.35/);
});

// ── G1 ──────────────────────────────────────────────────────────────────────
test('G1: a timeline mislabeled as "record" fails the run with exit 2 and writes nothing', () => {
  const out = tmpOut('g1');
  const r = cli(['--input', FIX('invalid-timeline-label.json'), '--out-dir', out]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /timeline\.source must be "your-input"/);
  assert.equal(fs.existsSync(out), false);
});

test('G1: an out-dir over tracked repository files is refused (exit 2)', () => {
  const r = cli(['--input', FIX('sample-run.json'), '--out-dir', path.join(REPO, 'data/examples')]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--out-dir must be inside/);
});

test('G1: missing evidence fields are named, not defaulted', () => {
  const doc = read('sample-run.json');
  const role = structuredClone(doc.roles[1]);
  delete role.vacancy_text; delete role.synthetic; role.fit = { p: 1.4, source: 'record' };
  role.demo_sponsorship_vote = { p: 0.6, tier: 'Likely', source: 'your-input', rationale: '' };
  const errs = validateInput({ roles: [role] }).join('\n');
  for (const m of ['vacancy_text must be present', 'synthetic must be declared', 'fit.p must be in [0, 1]', 'fit.source must be "your-input"', 'rationale must be non-empty']) assert.match(errs, new RegExp(m.replace(/[[\]().]/g, '\\$&')));
});

test('G1: a recorded liveness labeled "record" must point at an existing evidence file', () => {
  const role = structuredClone(read('sample-run.json').roles[0]);
  role.recorded_liveness.evidence = 'course/2026fa/submissions/aditya-raj-sde/evidence/does-not-exist.txt';
  assert.match(validateInput({ roles: [role] }).join('\n'), /must point at an existing evidence file/);
});

// ── F1b: refusal gate is not overridable ────────────────────────────────────
test('F1b: every explicit refusal stops at G3 with skip-application, even with fit 1.0 and a scenario vote', () => {
  for (const role of read('f1-refusal-roles.json').prototype_input.roles) {
    const ev = evaluateRole(role, csv);
    assert.equal(ev.vacancy.state, 'explicit-refusal', role.role_id);
    assert.equal(ev.next_action, 'skip-application', role.role_id);
    assert.deepEqual(ev.gates.at(-1), { id: 'G3', status: 'stop', reason: ev.gates.at(-1).reason });
    assert.equal(ev.scenario, null, `${role.role_id} must never reach the scorer`);
    assert.ok(!ev.scenario_eligible, `${role.role_id} must not be scenario-eligible`);
  }
});

// ── F2(b): intended prototype behavior on the six snapshots ─────────────────
const f2role = (s) => ({
  role_id: s.id, title: s.label, company_query: 'Example F2 Co', synthetic: true,
  snapshot: { status: s.status, finalUrl: s.finalUrl, bodyText: s.bodyText, applyControls: s.applyControls },
  vacancy_text: null, fit: { p: 0.7, source: 'your-input', note: 'control' },
  timeline: { factor: 1, source: 'your-input', assumption: 'control' },
});
const snaps = Object.fromEntries(read('f2-snapshots.json').snapshots.map((s) => [s.id, s]));

test('F2(b) F2-0: open posting passes G2', () => {
  const ev = evaluateRole(f2role(snaps['F2-0']), csv);
  assert.equal(ev.liveness.state, 'active');
  assert.equal(ev.gates.find((g) => g.id === 'G2').status, 'pass');
});
test('F2(b) F2-1: recognized closure phrase → skip-application', () => {
  const ev = evaluateRole(f2role(snaps['F2-1']), csv);
  assert.equal(ev.next_action, 'skip-application');
  assert.match(ev.decision_reason, /no longer accepting applications/);
});
test('F2(b) F2-2: "we\'ve filled this role" with a body Apply link is NOT treated as live → human review', () => {
  const ev = evaluateRole(f2role(snaps['F2-2']), csv);
  assert.equal(ev.liveness.classifier.result, 'active', 'the maintained classifier says active (limitation)');
  assert.equal(ev.liveness.state, 'liveness-conflict');
  assert.equal(ev.next_action, 'human-liveness-review');
  assert.match(ev.liveness.conflict_excerpts[0], /filled this role/);
});
test('F2(b) F2-3: uncertain → human review, no application decision', () => {
  const ev = evaluateRole(f2role(snaps['F2-3']), csv);
  assert.equal(ev.next_action, 'human-liveness-review');
});
test('F2(b) F2-4: thin page → skip-application, reason says thin content not explicit closure', () => {
  const ev = evaluateRole(f2role(snaps['F2-4']), csv);
  assert.equal(ev.next_action, 'skip-application');
  assert.match(ev.decision_reason, /thin content/);
  assert.match(ev.decision_reason, /not an explicit closure/);
});
test('F2(b) F2-5: "closed-loop" false positive costs a human review, never an automatic skip', () => {
  const ev = evaluateRole(f2role(snaps['F2-5']), csv);
  assert.notEqual(ev.next_action, 'skip-application');
  assert.equal(ev.next_action, 'human-liveness-review');
});

// ── F3: company evidence states stay distinct ───────────────────────────────
test('F3: each company state is reported by its own name; blank is not zero; zero is not refusal; no merges; no p', () => {
  const f3 = read('f3-states.json');
  for (const role of f3.roles) {
    const ev = evaluateRole(role, csv);
    assert.equal(ev.company.state, f3.expected_company_states[role.role_id], role.role_id);
    assert.ok(!('p' in ev.company) && !('tier' in ev.company), 'company evidence never becomes a score');
    assert.notEqual(ev.next_action, 'skip-application', `${role.role_id}: company evidence alone never skips`);
  }
  const blank = evaluateRole(f3.roles.find((r) => r.role_id === 'f3-blank'), csv).company;
  assert.equal(blank.counts.approvals, null);
  const zero = evaluateRole(f3.roles.find((r) => r.role_id === 'f3-zero'), csv).company;
  assert.equal(zero.counts.approvals, 0);
  assert.match(zero.note, /not a refusal/);
  const amb = evaluateRole(f3.roles.find((r) => r.role_id === 'f3-ambiguous'), csv).company;
  assert.equal(amb.candidates.length, 2);
  assert.equal(amb.counts, null, 'ambiguous rows are listed, never merged into one count');
  const pinned = evaluateRole(f3.roles.find((r) => r.role_id === 'f3-ambiguous-pinned'), csv).company;
  assert.equal(pinned.pin_source, 'your-input');
});

test('F3: matching strips legal suffixes but never fuzzes', () => {
  assert.equal(companyKey('Databricks, Inc.'), companyKey('DATABRICKS INC'));
  assert.equal(matchCompany(csv, 'Databrick', undefined).state, 'no-employer-match');
});

// ── vacancy rule ────────────────────────────────────────────────────────────
test('vacancy rule: refusal / offer / conditional / contradictory / silent / not-captured', () => {
  const cases = {
    'We are unable to sponsor visas for this position.': 'explicit-refusal',
    'Candidates must be able to work in the U.S. without sponsorship.': 'explicit-refusal',
    'Visa sponsorship is available for this role.': 'apparent-offer',
    'Applicants must be authorized to work in the United States.': 'ambiguous-or-conditional',
    'We may sponsor visas for exceptional candidates.': 'ambiguous-or-conditional',
    'We do not sponsor visas, except on a case-by-case basis.': 'ambiguous-or-conditional',
    'We will sponsor visas. We cannot sponsor visas.': 'contradictory',
    'We offer a learning budget.': 'silent',
  };
  for (const [text, state] of Object.entries(cases)) assert.equal(classifyVacancy(text).state, state, text);
  assert.equal(classifyVacancy(null).state, 'not-captured');
  assert.equal(classifyVacancy('We will sponsor visas.').source, 'model-judgment');
});

// ── timing ──────────────────────────────────────────────────────────────────
test('T-timing: a missing timeline blocks the role and never reaches the scorer; a sample timeline is labeled unverified', () => {
  const out = tmpOut('timing');
  const r = cli(['--input', FIX('timing-cases.json'), '--out-dir', out]);
  assert.equal(r.status, 0, r.stderr);
  const log = JSON.parse(fs.readFileSync(path.join(out, 'reality-check.json'), 'utf8'));
  const missing = log.roles.find((x) => x.role_id === 'timing-missing');
  assert.equal(missing.next_action, 'blocked-timing-input');
  assert.equal(missing.scenario, null);
  const scorerInput = JSON.parse(fs.readFileSync(path.join(out, 'roles.json'), 'utf8'));
  assert.deepEqual(scorerInput.map((x) => x.role_id), ['timing-sample']);
  const sample = log.roles.find((x) => x.role_id === 'timing-sample');
  assert.equal(sample.timing.verified, false);
  assert.match(sample.scenario.label, /provisional: timing not verified/);
});

// ── sample run: labels, separation of scenario from decision, both outputs ──
test('sample run: two outputs, every value labeled, scenario scores separate from decisions', () => {
  const out = tmpOut('sample');
  const r = cli(['--input', FIX('sample-run.json'), '--out-dir', out]);
  assert.equal(r.status, 0, r.stderr);
  const log = JSON.parse(fs.readFileSync(path.join(out, 'reality-check.json'), 'utf8'));
  const report = fs.readFileSync(path.join(out, 'reality-check.md'), 'utf8');
  const allowed = ['record', 'model-judgment', 'your-input'];
  for (const x of log.roles) {
    assert.ok(allowed.includes(x.company.source), x.role_id);
    assert.ok(allowed.includes(x.liveness.source), x.role_id);
    assert.equal(x.vacancy.source, 'model-judgment');
    assert.ok(x.timing.source === null || x.timing.source === 'your-input');
    assert.equal(x.timing.verified, false);
    assert.ok(['skip-application', 'human-liveness-review', 'seek-vacancy-sponsorship-evidence', 'review-offer-excerpt', 'blocked-timing-input'].includes(x.next_action));
    if (x.scenario) {
      assert.equal(x.scenario.kind, 'hypothetical');
      assert.notEqual(x.next_action, x.scenario.scorer_recommendation);
    }
  }
  for (const x of log.roles.filter((r) => r.synthetic)) {
    assert.equal(x.liveness.source, 'your-input', `${x.role_id}: liveness derived from an invented snapshot must not be labeled record`);
    assert.equal(x.liveness.observation, 'synthetic-derived', x.role_id);
  }
  const real = log.roles.find((x) => x.role_id === 'databricks-web-products-8635225002');
  assert.equal(real.liveness.source, 'record');
  assert.equal(real.liveness.observation, 'recorded-observation');
  assert.doesNotMatch(report, /\*\*SYNTHETIC\*\*[^\n]*\[record; /, 'no synthetic row shows a record-labeled liveness');
  // Second refusal-gate guard (added after the step-2 break experiment, at Aditya's request):
  // the refused sample opening must be skipped, its G3 recorded as a stop, and the JSON and the
  // human report must agree.
  const refused = log.roles.find((x) => x.role_id === 'example-robotics-refusal');
  assert.equal(refused.vacancy.state, 'explicit-refusal');
  assert.equal(refused.next_action, 'skip-application');
  assert.equal(refused.gates.find((g) => g.id === 'G3')?.status, 'stop');
  assert.equal(refused.scenario, null);
  assert.match(report, /\| \*\*SYNTHETIC\*\* Example Robotics — [^\n]*\| \*\*skip-application\*\* \|/, 'report decision row agrees with the JSON');
  assert.match(report, /### SYNTHETIC — Example Robotics — [\s\S]*?- \*\*Gates:\*\* G1 pass → G2 pass → G3 stop\n/, 'report gate trail agrees with the JSON');
  const silent = log.roles.find((x) => x.role_id === 'example-analytics-silent-scenario');
  assert.equal(silent.next_action, 'seek-vacancy-sponsorship-evidence', 'approved rule: a scenario vote never overrides awaiting evidence');
  assert.ok(silent.scenario, 'the hypothetical score is still shown, separately');
  const db = log.roles.find((x) => x.role_id === 'databricks-web-products-8635225002');
  assert.equal(db.company.state, 'matched-with-record');
  assert.equal(db.next_action, 'seek-vacancy-sponsorship-evidence', 'company history is never read as sponsorship for this opening');
  assert.match(report, /^## Executive summary/m);
  // Gate legend (added after Aditya's report review): G4 pass must not read as verified timing.
  assert.match(report, /\*\*G4\*\* Timing: "pass" means only that an explicit SAMPLE timing assumption/);
  assert.match(log.gate_legend.G4, /was NOT verified/);
  assert.equal((report.match(/not a general rate/g) || []).length, 1, 'the sample qualifier appears exactly once');
  assert.match(report, /## Hypothetical scenario scores \(NOT decisions\)/);
  assert.match(report, /\*\*SYNTHETIC\*\*/);
  assert.doesNotMatch(report, /\| \*\*(Apply|Consider)\*\* \|/, 'no scorer label appears as an actionable next step');
});
