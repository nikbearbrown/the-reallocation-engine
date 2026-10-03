#!/usr/bin/env node
// triage.test.mjs — offline tests for the games-sector triage prototype.
//
// Offline means offline: these tests read only files that ship in this
// repository and spawn only the repository's own scorer as a local process.
// No host is contacted. Run from the repo root:
//
//   node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/
//
// The tests assert BEHAVIOUR AT THE BOUNDARIES, not the verdicts I happen to
// like. Nothing here hardcodes "That's No Moon must be an Apply" — that would
// be testing my preferences. What is asserted is: a record is labelled a
// record, an absence is not, a closed gate wins over strong votes, and a
// failure fails loudly.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SRC, ASSUMPTIONS, TriageError,
  normalizeName, classifySector, lookupSponsorship, parseCsv,
  timelineFactor, loadSocRow, triage, runRepoScorer, nextAction,
} from './triage.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const FX = path.join(HERE, 'fixtures');
const TODAY = new Date('2026-10-03T00:00:00Z');

const readFx = (f) => JSON.parse(fs.readFileSync(path.join(FX, f), 'utf8'));

function csvIndex() {
  const rows = parseCsv(fs.readFileSync(
    path.join(REPO, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv'), 'utf8'));
  const idx = new Map();
  for (const r of rows) { const k = normalizeName(r.company_name); if (k && !idx.has(k)) idx.set(k, r); }
  return idx;
}

// ── name matching ──────────────────────────────────────────────────────────
test('normalizeName matches the same company across legal-suffix spellings', () => {
  assert.equal(normalizeName("Manticore Games, Inc."), normalizeName('MANTICORE GAMES INC'));
  assert.equal(normalizeName("That's No Moon Entertainment Inc"), normalizeName("THAT'S NO MOON ENTERTAINMENT INC"));
  assert.notEqual(normalizeName('Azra Games Inc'), normalizeName('Roboto Games Inc'));
});

// ── the sector classifier is a judgment, and a fallible one ────────────────
test('classifySector is model-judgment, and over-matches on "interactive"', () => {
  const peloton = classifySector({ company: 'Peloton Interactive Inc', website: 'onepeloton.com' });
  assert.equal(peloton.source, SRC.model);
  // This is NOT a bug being enshrined — it is the documented weakness of the
  // keyword approach, asserted so it cannot silently change into a claim of
  // precision the method does not have.
  assert.equal(peloton.is_game_employer, true, 'keyword matching cannot tell a bike company from a studio');
});

test('classifySector flags a company no keyword reaches', () => {
  const r = classifySector({ company: 'Bungie Inc', website: 'bungie.net' });
  assert.equal(r.is_game_employer, false);
  assert.match(r.note, /human must confirm/);
});

// ── the sponsorship boundary: record vs absence ────────────────────────────
test('a company absent from the CSV emits NO sponsorship number at all', () => {
  const r = lookupSponsorship(csvIndex(), { company: 'Lanternfish Studios Inc' });
  assert.equal(r.status, 'NOT_IN_RECORD');
  assert.equal(r.p, null);
  assert.equal(r.tier, null);
  assert.equal(r.source, null);
});

test('an empty H-1B record is labelled model-judgment, never record', () => {
  const r = lookupSponsorship(csvIndex(), { company: 'Azra Games Inc' });
  assert.equal(r.status, 'NO_SPONSORSHIP_RECORD');
  assert.equal(r.source, SRC.model, 'a prior is not a filing');
  assert.notEqual(r.source, SRC.record);
  assert.equal(r.p, ASSUMPTIONS.p_unknown);
  assert.match(r.note, /NOT evidence/);
});

test('a real H-1B record is labelled record and carries its own numbers', () => {
  const r = lookupSponsorship(csvIndex(), { company: "That's No Moon Entertainment Inc" });
  assert.equal(r.status, 'IN_RECORD');
  assert.equal(r.source, SRC.record);
  assert.ok(r.evidence.total_approvals > 0);
});

test('sponsoring for non-engineering titles is surfaced, not hidden', () => {
  const r = lookupSponsorship(csvIndex(), { company: 'Roboto Games Inc' });
  assert.equal(r.status, 'IN_RECORD');
  assert.equal(r.role_title_match.engineering_titles_present, false,
    'Roboto Games has approvals, but its recorded sponsored title is a Director of Product Management');
  assert.match(r.role_title_match.note, /NO engineering title/);
});

// ── the timeline gate ──────────────────────────────────────────────────────
test('timelineFactor refuses a date that has already passed', () => {
  assert.throws(
    () => timelineFactor(new Date('2026-01-01T00:00:00Z'), TODAY, 75),
    (e) => e instanceof TriageError && e.code === 'E_OPT_DATE_PAST');
});

test('timelineFactor closes the gate below one hiring cycle of runway', () => {
  const t = timelineFactor(new Date('2026-11-15T00:00:00Z'), TODAY, 75); // 43 days
  assert.equal(t.factor, 0, 'less runway than one hiring cycle must close the gate');
  assert.equal(t.source, SRC.input);
});

test('timelineFactor is arithmetic a human can redo by hand', () => {
  const t = timelineFactor(new Date('2027-01-31T00:00:00Z'), TODAY, 75);
  assert.equal(t.days_of_runway, 120);
  assert.equal(t.factor, 0.6); // (120 - 75) / 75 = 0.6
});

// ── the BLS lookup ─────────────────────────────────────────────────────────
test('an unknown SOC code fails instead of inventing a wage', () => {
  assert.throws(
    () => loadSocRow(REPO, '99-9999'),
    (e) => e instanceof TriageError && e.code === 'E_SOC_NOT_FOUND');
});

test('SOC 15-1252 is read straight out of the BLS CSV', () => {
  const r = loadSocRow(REPO, '15-1252');
  assert.equal(r.source, SRC.record);
  assert.equal(r.title, 'Software Developers');
  assert.ok(Number(r.annual_median_wage) > 0);
});

// ── end to end, through the repository's own scorer ────────────────────────
test('end to end: unchecked liveness blocks, absent company blocks', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-test-'));
  const r = triage({
    repoRoot: REPO,
    postings: readFx('postings.sample.json'),
    liveness: readFx('liveness.sample.json'),
    optEnd: new Date('2027-01-31T00:00:00Z'), today: TODAY, lagDays: 75, soc: '15-1252',
  });
  const blockedIds = r.blocked.map((b) => b.posting_id);
  assert.ok(blockedIds.includes('azra-tools-006'), 'a posting with no liveness entry must not be scored');
  assert.ok(blockedIds.includes('lanternfish-engine-008'), 'a company outside the dataset must not be scored');
  assert.equal(r.roles.find((x) => x.role_id === 'azra-tools-006'), undefined);
  fs.rmSync(out, { recursive: true, force: true });
});

test('BREAK ATTEMPT: a dead posting with perfect votes still comes back Skip', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-break-'));
  const r = triage({
    repoRoot: REPO,
    postings: readFx('BROKEN-ghost-posting.json'),
    liveness: readFx('BROKEN-ghost-liveness.json'),
    optEnd: new Date('2027-01-31T00:00:00Z'), today: TODAY, lagDays: 75, soc: '15-1252',
  });
  const rolesPath = path.join(out, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(r.roles, null, 2));
  const { scores } = runRepoScorer(REPO, rolesPath, out);
  const only = scores.roles[0];
  assert.equal(only.recommendation, 'Skip');
  assert.match(only.reason, /gated: liveness/);
  assert.equal(only.composite, 0);
  fs.rmSync(out, { recursive: true, force: true });
});

// ── liveness provenance is per entry, and drives the label ─────────────────
test('an unchecked liveness entry is labelled model-judgment, a checked one record', () => {
  const postings = [
    { posting_id: 'checked', company: 'Manticore Games, Inc.', title: 'A', fit_p: 0.5 },
    { posting_id: 'unchecked', company: 'Manticore Games, Inc.', title: 'B', fit_p: 0.5 },
  ];
  const liveness = {
    _synthetic: true,
    checked:   { factor: 1.0, synthetic: false, observed: 'ACTIVE', checked_at: '2026-10-03T00:00:00Z' },
    unchecked: { factor: 1.0 }, // inherits the file default: synthetic
  };
  const r = triage({ repoRoot: REPO, postings, liveness,
    optEnd: new Date('2027-01-31T00:00:00Z'), today: TODAY, lagDays: 75, soc: '15-1252' });

  const byId = Object.fromEntries(r.scored.map((x) => [x.posting_id, x]));
  assert.equal(byId.checked.liveness.source, SRC.record);
  assert.equal(byId.checked.liveness.verified, true);
  assert.equal(byId.unchecked.liveness.source, SRC.model, 'an unobserved value is not a record');
  assert.equal(byId.unchecked.liveness.verified, false);

  // and the label the SCORER receives must match, not just the human report
  const roles = Object.fromEntries(r.roles.map((x) => [x.role_id, x]));
  assert.equal(roles.checked.liveness.source, SRC.record);
  assert.equal(roles.unchecked.liveness.source, SRC.model);

  assert.equal(r.livenessProvenance.verified, 1);
  assert.equal(r.livenessProvenance.synthetic, 1);
  assert.equal(r.livenessProvenance.with_liveness, 2);
});

test('nextAction routes a Consider to the networking hours, not the apply hours', () => {
  assert.equal(nextAction({}, 'Consider').bucket, 'network');
  assert.equal(nextAction({}, 'Apply').bucket, 'apply');
  assert.equal(nextAction({ sponsorship: { tier: 'none' } }, 'Skip').bucket, 'skip');
});
