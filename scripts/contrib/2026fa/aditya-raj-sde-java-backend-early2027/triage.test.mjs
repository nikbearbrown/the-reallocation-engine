// triage.test.mjs — offline tests (node --test). No network: every input is a committed fixture or
// the committed excerpts of the real sample.
//   node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { REPO, run, loadCandidate, evaluateObservation, validateObservations, excerptLines } from './triage.mjs';
import { loadSponsorCsv, evaluateLiveness } from '../aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs';
import { toSentences, checkStartWindow } from './checks.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CAND = path.join(HERE, 'config/candidate.tariq-lindqvist.json');
const SYN = path.join(HERE, 'fixtures/synthetic-cases.json');
const REAL = path.join(REPO, 'course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json');
const csv = loadSponsorCsv();
const cand = loadCandidate(CAND);
const syn = JSON.parse(fs.readFileSync(SYN, 'utf8'));
const byId = Object.fromEntries(syn.observations.map((o) => [o.obs_id, o]));
const evalId = (id, patch = {}) => evaluateObservation({ ...byId[id], ...patch }, cand, csv);
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'a2-test-'));

test('candidate inputs: 54 months full-time and 6 co-op months, kept separate; never inferred from titles', () => {
  assert.equal(cand.full_time_months, 54);
  assert.equal(cand.coop_months, 6);
  assert.equal(cand.available_from, '2027-02-01');
});

for (const o of syn.observations) {
  test(`synthetic ${o.obs_id}: ${o.title} → ${o.expect.decision}`, () => {
    const r = evaluateObservation(o, cand, csv);
    const got = { decision: r.next_action, decided_by: r.decided_by, experience: r.experience.state, start: r.start_window.state, liveness: r.liveness.state, stack: r.stack.state, vacancy: r.vacancy.state, eligibility: r.vacancy.eligibility, company: r.company.state, coop_counted: r.experience.candidate.coop_counted, first_finding_kind: r.experience.findings[0]?.kind };
    for (const [k, v] of Object.entries(o.expect)) {
      if (k === 'why_includes') assert.ok(r.experience.why.includes(v), `${o.obs_id} why should mention ${v}: ${r.experience.why}`);
      else assert.equal(got[k], v, `${o.obs_id}.${k}`);
    }
  });
}

test('refusal despite a strong company record: history never overrides this posting (S01)', () => {
  const r = evalId('S01');
  assert.equal(r.company.state, 'matched-with-record');
  assert.ok(r.company.counts.approvals > 1000, 'the borrowed CSV row has a strong record');
  assert.equal(r.experience.gate, 'pass'); assert.equal(r.stack.state, 'core-stack-evidenced');
  assert.equal(r.next_action, 'skip-application'); assert.equal(r.decided_by, 'G3');
});

test('no later gate clears an earlier stop: offer wording + compatible start + core stack cannot undo an experience mismatch (S29)', () => {
  const r = evalId('S29');
  assert.equal(r.vacancy.state, 'apparent-offer');
  assert.equal(r.start_window.state, 'stated-start-compatible-by-date');
  assert.equal(r.stack.state, 'core-stack-evidenced');
  assert.equal(r.next_action, 'skip-application'); assert.equal(r.decided_by, 'G4');
  assert.ok(r.gates.find((g) => g.id === 'G7').status === 'pass', 'G7 is still evaluated and reported');
});

test('co-op months are never silently added (v0.4, Aditya E14): silent scoped boundary → review; general boundary → review with the full-time-only comparison', () => {
  const scoped = evalId('S11');
  assert.equal(scoped.experience.state, 'scoped-duration-unknown');
  const general = evalId('S31');
  assert.equal(general.experience.state, 'coop-would-change-result');
  assert.match(general.experience.why, /full-time only/);
  assert.equal(general.experience.candidate.coop_counted, false);
  assert.equal(evalId('S10').experience.gate, 'review');
});

test('title words never decide: swapping titles between a mismatch and a match changes nothing', () => {
  const a = evalId('S02', { title: 'Senior Staff Principal Backend Engineer' });
  const b = evalId('S03', { title: 'Software Engineer' });
  assert.equal(a.next_action, 'skip-application'); assert.equal(a.experience.state, 'documented-mismatch');
  assert.equal(b.experience.state, 'meets-stated-required-minimums');
});

test('preference vs requirement: the same 7+ years is a stop when required and never a stop when preferred', () => {
  const pref = evalId('S04');
  assert.notEqual(pref.next_action, 'skip-application');
  const req = evalId('S04', { content: { mode: 'full', lines: ['## Requirements', '- Experience with Java, Kafka, and distributed systems on AWS.', '- 7+ years of experience in payments.'] } });
  assert.equal(req.next_action, 'skip-application'); assert.equal(req.experience.state, 'documented-mismatch');
});

test('start window is date arithmetic only and always says what it does not establish', () => {
  for (const id of ['S03', 'S13', 'S14', 'S15', 'S16', 'S17']) {
    const r = evalId(id);
    assert.ok(r.start_window.does_not_establish.some((x) => /authorization/.test(x)), id);
  }
  const s = checkStartWindow(toSentences(['Start date: February 2027.']), '2027-02-01', '2026-10-21T00:00:00Z');
  assert.equal(s.state, 'stated-start-compatible-by-date', 'a stated month that contains the availability date is compatible');
  const asap = evalId('S16');
  assert.notEqual(asap.next_action, 'skip-application', 'ASAP is unresolved, never a conflict');
});

test('feed-vs-page disagreement goes to a person; Assignment 1\'s page-only rule alone would have skipped it (S19)', () => {
  const o = byId.S19;
  const a1 = evaluateLiveness({ snapshot: o.page.snapshot, synthetic: true });
  assert.equal(a1.state, 'expired', 'the maintained classifier reads the 403 challenge page as expired');
  const r = evalId('S19');
  assert.equal(r.liveness.state, 'feed-page-disagree'); assert.equal(r.next_action, 'human-liveness-review');
});

test('JavaScript is never Java; negated Java is not evidence', () => {
  assert.equal(evalId('S21').stack.groups.java_jvm.where, 'not-mentioned');
  const n = evalId('S22');
  assert.equal(n.stack.groups.java_jvm.where, 'not-mentioned');
  assert.ok(n.stack.groups.java_jvm.negated.length > 0);
});

test('excerpt extraction is lossless for the rules: every synthetic case decides the same on its excerpts', () => {
  for (const o of syn.observations) {
    const full = evaluateObservation(o, cand, csv);
    const ex = evaluateObservation({ ...o, content: { mode: 'excerpts', lines: excerptLines(o.content.lines) } }, cand, csv);
    for (const k of ['next_action', 'decided_by']) assert.equal(ex[k], full[k], `${o.obs_id}.${k}`);
    for (const k of ['experience', 'start_window', 'stack', 'vacancy']) assert.equal(ex[k].state, full[k].state, `${o.obs_id}.${k}`);
  }
});

test('real sample replay (committed excerpts, offline) reproduces the recorded v0.4.1 decisions', () => {
  const expected = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures/real-sample-expected-v0.4.1.json'), 'utf8')).decisions;
  const doc = JSON.parse(fs.readFileSync(REAL, 'utf8'));
  for (const o of doc.observations) assert.equal(evaluateObservation(o, cand, csv).next_action, expected[o.obs_id], o.obs_id);
});

test('JSON log and Markdown report agree, and both outputs are written', () => {
  const out = tmp();
  const log = run(['--input', SYN, '--candidate', CAND, '--out-dir', out]);
  const mdText = fs.readFileSync(path.join(out, 'triage.md'), 'utf8');
  assert.match(mdText, /^# Opening Triage/); assert.match(mdText, /## Executive summary/);
  for (const r of log.roles) {
    const row = mdText.split('\n').find((l) => l.startsWith('| ') && l.includes(`${r.employer} — ${r.title}`.replace(/\|/g, '\\|')));
    assert.ok(row, `row for ${r.obs_id}`); assert.ok(row.includes(`**${r.next_action}**`), `${r.obs_id} next action in Markdown`);
    if (r.synthetic) assert.ok(row.includes('**SYNTHETIC**'));
  }
  assert.equal(log.run.scorer, 'not called (see recipe: Why no score)');
});

test('G1: invalid input exits 2 and writes nothing', () => {
  const dir = tmp(); const bad = path.join(dir, 'bad.json');
  fs.writeFileSync(bad, JSON.stringify({ observations: [{ ...byId.S03, url: 'https://real-employer.test/jobs/1' }] }));
  assert.ok(validateObservations(JSON.parse(fs.readFileSync(bad, 'utf8'))).some((e) => /example\.com/.test(e)));
  const out = path.join(dir, 'out');
  const p = spawnSync(process.execPath, [path.join(HERE, 'triage.mjs'), 'run', '--input', bad, '--candidate', CAND, '--out-dir', out], { encoding: 'utf8' });
  assert.equal(p.status, 2); assert.equal(fs.existsSync(out), false);
});

test('G1: a candidate without explicit employment_type is rejected (no inference from titles)', () => {
  const dir = path.join(REPO, 'private', 'a2-test-tmp'); fs.mkdirSync(dir, { recursive: true });
  try {
    const r = JSON.parse(fs.readFileSync(path.join(REPO, cand.resume), 'utf8'));
    delete r.experience[0].employment_type;
    fs.writeFileSync(path.join(dir, 'resume.json'), JSON.stringify(r));
    fs.writeFileSync(path.join(dir, 'cand.json'), JSON.stringify({ resume: 'private/a2-test-tmp/resume.json', available_from: '2027-02-01', available_from_source: 'your-input' }));
    assert.throws(() => loadCandidate(path.join(dir, 'cand.json')), /employment_type/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('outputs cannot land on tracked files outside the allowed run folders', () => {
  assert.throws(() => run(['--input', SYN, '--candidate', CAND, '--out-dir', path.join(REPO, 'reports')]), /out-dir must be inside/);
});

test('no network: the mode\'s modules import only node: builtins and local files', () => {
  for (const f of ['triage.mjs', 'checks.mjs', 'text.mjs']) {
    const src = fs.readFileSync(path.join(HERE, f), 'utf8');
    for (const m of src.matchAll(/^import .* from '([^']+)';$/gm)) assert.ok(m[1].startsWith('node:') || m[1].startsWith('.'), `${f} imports ${m[1]}`);
    assert.doesNotMatch(src, /\bfetch\(|https?\.request|require\('https?'\)/, `${f} must not make requests`);
  }
});
