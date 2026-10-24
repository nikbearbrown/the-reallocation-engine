// regression-v04.test.mjs — focused regressions requested in FRICTIONAL E14 (written BEFORE the v0.4
// corrections; their first run against v0.3 is evidence 15). Offline.
//   node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCandidate, evaluateObservation, summarize } from './triage.mjs';
import { loadSponsorCsv } from '../aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const csv = loadSponsorCsv();
const cand = (n) => loadCandidate(path.join(HERE, n === 'persona' ? 'config/candidate.tariq-lindqvist.json' : `fixtures/candidates/${n}.json`));
const persona = cand('persona');
const obs = (id, lines, over = {}) => ({ obs_id: id, synthetic: true, employer: `SYNTHETIC ${id}`, company_query: `Example Synthetic ${id}`, title: 'Backend Engineer', url: `https://example.com/jobs/${id}`, captured_at: '2026-10-21T04:00:00.000Z', feed: { present: null, observed_at: 'n/a', source: 'your-input' }, page: { snapshot: { status: 200, finalUrl: 'https://example.com/x', bodyText: 'Backend engineering role description. '.repeat(12), applyControls: ['Apply'] } }, text_chars: 1200, content: { mode: 'full', lines }, ...over });
const REQ = (...l) => ['## Requirements', '- 3+ years of professional software engineering experience.', '- Build Java microservices with Kafka on AWS.', ...l];
const ev = (o, c = persona) => evaluateObservation(o, c, csv);

// ── co-op rule (Aditya, E14) ────────────────────────────────────────────────
test('co-op: explicit acceptance counts the co-op per the wording (12-month co-op variant, clear of month precision)', () => {
  const r = ev(obs('R1', ['## Requirements', '- 5+ years of professional software engineering experience; internships and co-ops count toward this.', '- Build Java microservices with Kafka on AWS.']), cand('coop12'));
  assert.equal(r.experience.state, 'meets-with-explicitly-accepted-coop');
  assert.ok(r.experience.coop_acceptance_excerpts.length > 0);
});
test('co-op: explicit exclusion — the co-op never counts; FT-only shortfall is a documented mismatch', () => {
  const r = ev(obs('R2', ['## Requirements', '- 5+ years of professional software engineering experience (internships and co-ops do not count).', '- Build Java microservices with Kafka on AWS.']));
  assert.equal(r.experience.state, 'documented-mismatch');
  assert.equal(r.next_action, 'skip-application');
});
test('co-op: silence at the boundary goes to review and shows the full-time-only comparison', () => {
  const r = ev(obs('R3', ['## Requirements', '- 5+ years of professional software engineering experience.', '- Build Java microservices with Kafka on AWS.']));
  assert.equal(r.experience.state, 'coop-would-change-result');
  assert.equal(r.next_action, 'human-requirement-review');
  assert.match(r.experience.why, /full-time only/);
});
test('co-op: a shortfall that remains even with the co-op is a documented mismatch', () => {
  const r = ev(obs('R4', ['## Requirements', '- 6+ years of professional software engineering experience.', '- Build Java microservices with Kafka on AWS.']));
  assert.equal(r.experience.state, 'documented-mismatch');
});

// ── general vs scoped years ─────────────────────────────────────────────────
test('scoped: "N years of Java" is not established by total career years → review, never "meets"', () => {
  const r = ev(obs('R5', REQ('- 4+ years of experience programming in Java.')));
  assert.equal(r.experience.state, 'scoped-duration-unknown');
  assert.equal(r.experience.findings.find((f) => /Java/.test(f.sentence)).scope, 'scoped');
});
test('scoped: a requirement above everything the candidate has ever worked is still a documented mismatch', () => {
  const r = ev(obs('R6', REQ('- 10+ years of experience building distributed systems.')));
  assert.equal(r.experience.state, 'documented-mismatch');
});
test('general: "N years of software engineering or related experience" is general (pre-freeze audit finding, E16)', () => {
  const r = ev(obs('R6b', ['## Minimum requirements', "- Must have a Bachelor's degree in a related field, plus three (3) years of software engineering or related experience.", '- Build Java microservices with Kafka on AWS.']));
  assert.equal(r.experience.findings[0].scope, 'general');
  assert.equal(r.experience.state, 'meets-stated-required-minimums');
});
test('scoped: an explicitly supplied scoped input is used (test-only variant), and only for matching terms', () => {
  const c = cand('scoped');
  assert.equal(ev(obs('R7a', REQ('- 5+ years of experience programming in Java.')), c).experience.state, 'meets-stated-required-minimums');
  assert.equal(ev(obs('R7b', REQ('- 4+ years of experience with Kafka.')), c).experience.state, 'scoped-duration-unknown');
});
test('overlapping employment is not double-counted', () => {
  const c = cand('overlap');
  assert.equal(c.full_time.months_upper, 30, '2019-01..2021-06 is 30 months, not 24 + 12 = 36');
  assert.ok(c.full_time.months_lower <= c.full_time.months_upper);
  assert.match(c.precision, /month/);
});

// ── dates ───────────────────────────────────────────────────────────────────
test('exact date: a required start date earlier in the SAME month than availability is a conflict (not a month window)', () => {
  const r = ev(obs('R8', REQ('Start date: February 3, 2027.')), cand('late-feb'));
  assert.equal(r.start_window.state, 'explicit-date-conflict');
  assert.equal(r.start_window.statements[0].date, '2027-02-03');
});
test('"no earlier than" is an earliest-start constraint, never a deadline', () => {
  const r = ev(obs('R9', REQ('Start no earlier than March 1, 2027.')), cand('april10'));
  assert.notEqual(r.start_window.gate, 'stop');
  assert.equal(r.start_window.statements[0].constraint, 'earliest');
});
test('"by" is a deadline: compatible when available before it, a conflict when after', () => {
  assert.equal(ev(obs('R10a', REQ('Must be able to start by March 15, 2027.'))).start_window.state, 'stated-start-compatible-by-date');
  assert.equal(ev(obs('R10b', REQ('Must be able to start by March 15, 2027.')), cand('march20')).start_window.state, 'explicit-date-conflict');
});
test('seasons are assumptions: a season can never produce a hard stop', () => {
  for (const t of ['Start date: Fall 2026.', 'Start date: Summer 2026.', 'This role starts in Spring 2026.']) {
    const r = ev(obs('R11', REQ(t)));
    assert.notEqual(r.start_window.gate, 'stop', t);
    assert.ok(r.start_window.statements.some((s) => s.assumption), t);
  }
});
test('descriptive timing language does not create a mandatory window', () => {
  const r = ev(obs('R12', REQ('Our next engineering cohort begins onboarding in January 2027.')));
  assert.notEqual(r.start_window.gate, 'stop');
});

// ── headings ────────────────────────────────────────────────────────────────
test('mixed, conditional, and unrecognized headings stay uncertain', () => {
  for (const h of ['## Preferred requirements', '## Requirements (for senior-level candidates)', '## Team background']) {
    const r = ev(obs('R13', REQ(h, '- 7+ years of professional software engineering experience.')));
    assert.equal(r.experience.gate, 'review', h);
  }
});

// ── liveness and provenance ─────────────────────────────────────────────────
test('a challenge/thin page alone never establishes closure, with or without a feed observation', () => {
  const blocked = { snapshot: { status: 403, finalUrl: 'https://example.com/x', bodyText: 'Just a moment... checking your browser.', applyControls: [] } };
  for (const present of [null, true]) {
    const r = ev(obs('R14', REQ(), { page: blocked, feed: { present, observed_at: 'n/a', source: 'your-input' } }));
    assert.equal(r.next_action, 'human-liveness-review', `feed ${present}`);
  }
  const gone = ev(obs('R14b', REQ(), { page: { snapshot: { status: 404, finalUrl: 'https://example.com/x', bodyText: 'Not found', applyControls: [] } }, feed: { present: false, observed_at: 'n/a', source: 'your-input' } }));
  assert.equal(gone.next_action, 'skip-application', 'explicit HTTP 404 + absent from feed is still closure evidence');
});
test('provenance: liveness interpretation is a judgment; the raw observations are records', () => {
  const real = JSON.parse(fs.readFileSync(path.join(HERE, '../../../../course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json'), 'utf8')).observations[4];
  const r = ev(real);
  assert.equal(r.liveness.source, 'model-judgment');
  assert.ok(r.liveness.observations.some((o) => o.source === 'record' && /feed/.test(o.what)));
  assert.ok(r.liveness.observations.some((o) => o.source === 'model-judgment' && /checker verdict/.test(o.what)));
});

// ── report claims ───────────────────────────────────────────────────────────
test('tally separates satisfied, unknown, review, and mismatch groups (disjoint) and keeps liveness/sponsorship visible', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures/synthetic-cases.json'), 'utf8'));
  const roles = doc.observations.map((o) => ev(o));
  const t = summarize(roles).experience_groups;
  const ids = ['satisfied_with_core_stack', 'unknown_with_core_stack', 'awaiting_review', 'documented_mismatch'].flatMap((k) => t[k].obs_ids);
  assert.equal(new Set(ids).size, ids.length, 'groups are disjoint');
  for (const k of ['satisfied_with_core_stack', 'unknown_with_core_stack']) assert.ok('liveness_not_clear' in t[k] && 'sponsorship_unresolved' in t[k] && 'timing_unresolved' in t[k]);
});

// ── v0.4.1 regressions from the FIRST holdout result (FRICTIONAL E19); paraphrased, not copied ──
test('eligibility wording rendered as a heading line is still read (export control → a person)', () => {
  const r = ev(obs('R15', [...REQ(), '## Compliance', '## Where a role needs export-controlled technology, the employer may decline to proceed with an applicant who would need a government license.']));
  assert.equal(r.vacancy.eligibility, 'clearance-or-export-control-wording');
  assert.equal(r.next_action, 'human-eligibility-review');
});
test('"What we look for" is a requirements heading', () => {
  const r = ev(obs('R16', ['## What we look for', '- 3+ years of professional software engineering experience.', '- Strong skills in Java building distributed systems on AWS.']));
  assert.equal(r.experience.findings[0].kind, 'required');
  assert.equal(r.stack.state, 'core-stack-evidenced');
});
test('an "In the alternative" branch in the next sentence makes both statements alternatives', () => {
  const r = ev(obs('R17', ['## Minimum requirements', "Must have a Bachelor's degree, plus five (5) years of software development work experience. In the alternative, the employer will accept a Master's degree plus three (3) years of software development work experience.", '- Build Java microservices with Kafka on AWS.']));
  assert.equal(r.experience.state, 'alternative-requirements');
});
