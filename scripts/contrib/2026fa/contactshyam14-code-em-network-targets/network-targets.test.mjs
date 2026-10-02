// network-targets.test.mjs — offline tests (fixtures only, no network).
//   node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs
//
// Black-box: runs the CLI exactly as a person would, into a temp dir, and reads
// what it wrote. The scorer it calls is the real scripts/score/role-scorer.mjs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCRIPT = path.join(HERE, 'network-targets.mjs');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');
const FX = (f) => path.join(HERE, 'fixtures', f);
const LABELS = new Set(['record', 'your-input', 'model-judgment']);

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'nt-test-'));
function cli(extra = [], { out = path.join(tmp(), 'out') } = {}) {
  const args = ['--persona', FX('persona.fixture.json'), '--liveness', FX('liveness.fixture.json'),
    '--csv', FX('companies.fixture.csv'), '--soc-file', FX('soc.fixture.csv'), '--formd-dir', FX('formd'),
    '--as-of', '2026-10-01', '--out-dir', out, ...extra];
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { cwd: REPO, encoding: 'utf8' });
  const logFile = path.join(out, 'network-targets.json');
  return { ...r, out, log: fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : null };
}
const byName = (log) => Object.fromEntries(log.candidates.map((c) => [c.company, c]));
function withPersona(patch) {
  const p = JSON.parse(fs.readFileSync(FX('persona.fixture.json'), 'utf8'));
  patch(p);
  const f = path.join(tmp(), 'persona.json');
  fs.writeFileSync(f, JSON.stringify(p));
  return f;
}

test('happy path: buckets come from the real scorer, not from this tool', () => {
  const r = cli();
  assert.equal(r.status, 0, r.stderr);
  const c = byName(r.log);
  assert.deepEqual(
    Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v.bucket])),
    {
      'ALPHA PRODUCTION SYSTEMS INC': 'network', 'LIMA INDUSTRIES INC': 'network', 'FOXTROT LABS INC': 'network', 'CHARLIE SOFTWARE INC': 'network',
      'BRAVO PROJECTS INC': 'apply', 'GOLF HOLDINGS INC': 'skip',
      'DELTA DEVICES INC': 'check-liveness', 'FOXTROTT LABS INC': 'check-liveness', 'KILO MACHINES INC': 'check-liveness',
    },
  );
  const scores = JSON.parse(fs.readFileSync(path.join(r.out, 'role-scores.json'), 'utf8'));
  assert.equal(scores._scorer, 'bayesian-role-scorer', 'role-scores.json must be written by the repo scorer');
  assert.equal(c['BRAVO PROJECTS INC'].scorer.recommendation, 'Apply');
  assert.equal(c['GOLF HOLDINGS INC'].scorer.recommendation, 'Skip');
  assert.ok(fs.existsSync(path.join(r.out, 'network-targets.md')));
  // ranking: Proven before Likely; recent funding first within a tier
  assert.deepEqual(r.log.candidates.filter((x) => x.bucket === 'network').map((x) => x.company),
    ['ALPHA PRODUCTION SYSTEMS INC', 'LIMA INDUSTRIES INC', 'FOXTROT LABS INC', 'CHARLIE SOFTWARE INC']);
});

test('roles.json never omits a gate, and held companies are never scored', () => {
  const r = cli();
  const roles = JSON.parse(fs.readFileSync(path.join(r.out, 'roles.json'), 'utf8'));
  assert.deepEqual(roles.map((x) => x.company).sort(),
    ['ALPHA PRODUCTION SYSTEMS INC', 'BRAVO PROJECTS INC', 'CHARLIE SOFTWARE INC', 'FOXTROT LABS INC', 'GOLF HOLDINGS INC', 'LIMA INDUSTRIES INC']);
  for (const role of roles) {
    assert.equal(typeof role.liveness.factor, 'number', `${role.company}: liveness must be explicit`);
    assert.equal(typeof role.timeline.factor, 'number', `${role.company}: timeline must be explicit`);
    assert.ok(LABELS.has(role.sponsorship.source) && LABELS.has(role.liveness.source) && LABELS.has(role.timeline.source));
  }
});

test('every evidence value carries one of the three labels', () => {
  const { log } = cli();
  for (const c of log.candidates) {
    for (const [term, v] of Object.entries(c.evidence)) {
      if (term === 'title_matches') continue; // per-match detail; its vocabulary label is inline
      assert.ok(LABELS.has(v.label), `${c.company}.${term} has label ${v.label}`);
    }
    if (c.liveness.status === 'scored') assert.ok(LABELS.has(c.liveness.label), `${c.company} liveness label`);
  }
  assert.equal(log.candidates.find((c) => c.company === 'ALPHA PRODUCTION SYSTEMS INC').evidence.tier.label, 'your-input',
    'a tier is a rule applied to records — it must not be labelled record');
});

test('record values are copied from the CSV, not computed or rounded', () => {
  const c = byName(cli().log);
  const a = c['ALPHA PRODUCTION SYSTEMS INC'].evidence;
  assert.equal(a.approvals.value, 24); assert.equal(a.denials.value, 0); assert.equal(a.approval_rate.value, 100);
  assert.deepEqual(a.matched_titles.value, ['Production Manager']);
  assert.equal(a.latest_funding_date.value, '2025-03-01');
  assert.match(a.approvals.source, /companies\.fixture\.csv#L2$/);
  assert.equal(c['BRAVO PROJECTS INC'].evidence.approval_rate.value, 95.23809523809524);
  assert.equal(a.formd_sample.filings[0].accession_number, '0000000000-26-000001');
  assert.equal(c['BRAVO PROJECTS INC'].evidence.formd_sample.value, 'not in shipped sample');
});

test('a tier explanation names only the condition that actually failed', () => {
  // Run 03's first report said "approvals 4 or rate 100.0% below the Proven bar" — the rate wasn't.
  const c = byName(cli().log);
  assert.equal(c['FOXTROT LABS INC'].evidence.tier.why, 'below the Proven bar: approvals 6 < 10');
  assert.equal(c['DELTA DEVICES INC'].evidence.tier.why, 'below the Proven bar: approvals 4 < 10, rate 50.0% < 90%');
  assert.equal(c['CHARLIE SOFTWARE INC'].evidence.tier.why, 'only an ambiguous title match (capped at Likely)');
});

test('liveness label follows who observed it and whether the board is confirmed', () => {
  const c = byName(cli().log);
  assert.equal(c['ALPHA PRODUCTION SYSTEMS INC'].liveness.label, 'record');
  assert.equal(c['CHARLIE SOFTWARE INC'].liveness.label, 'your-input');
  assert.equal(c['FOXTROT LABS INC'].liveness.label, 'model-judgment');
  assert.equal(c['LIMA INDUSTRIES INC'].liveness.label, 'your-input', 'a "script" observation with no evidence file is not a record');
  const p = path.join(tmp(), 'l.json');
  fs.writeFileSync(p, JSON.stringify({ observations: [{ company: 'Alpha Production Systems', checked_on: '2026-10-01', observed_by: 'script', result: 'no-matching-open', evidence: 'x.txt', board_identity: 'unconfirmed' }] }));
  const r = cli(['--liveness', p]);
  assert.equal(byName(r.log)['ALPHA PRODUCTION SYSTEMS INC'].liveness.label, 'model-judgment');
});

test('a person confirming a board makes its liveness your-input — not record, not model-judgment', () => {
  const p = path.join(tmp(), 'l.json');
  fs.writeFileSync(p, JSON.stringify({ observations: [{ company: 'Alpha Production Systems', checked_on: '2026-10-01', observed_by: 'script', result: 'no-matching-open', evidence: 'x.txt', board_identity: 'person-confirmed: a named person opened the board' }] }));
  const live = byName(cli(['--liveness', p]).log)['ALPHA PRODUCTION SYSTEMS INC'].liveness;
  assert.equal(live.label, 'your-input');
  assert.match(live.notes.join(' '), /confirmed by a person/);
});

test('F1: OPT end already past → exit 3, nothing written', () => {
  const r = cli(['--as-of', '2027-01-15']);
  assert.equal(r.status, 3);
  assert.match(r.stderr, /OPT end date 2026-12-31 is on or before the as-of date/);
  assert.match(r.stderr, /Nothing was written/);
  assert.equal(fs.existsSync(r.out), false);
});

test('OPT not started yet: start reported, unemployment counted from the start, not from today', () => {
  // 2026-10-02 correction: December 2026 was the OPT START, not the end.
  const persona = withPersona((p) => { p.visa.opt_start_date = '2026-12-31'; p.visa.opt_end_date = '2027-12-30'; p.visa.unemployment_days_used = 0; });
  const r = cli(['--persona', persona]);
  assert.equal(r.status, 0, r.stderr);
  const t = r.log.timeline;
  assert.equal(t.opt_started.value, false);
  assert.equal(t.days_to_opt_start.value, 91);   // 2026-10-01 → 2026-12-31
  assert.equal(t.days_to_opt_end.value, 455);    // 2026-10-01 → 2027-12-30
  assert.equal(t.days_available.value, 181);     // 91 days until start + 90 unemployment days
  assert.match(t.unemployment, /counted from the OPT start 2026-12-31/);
  assert.match(fs.readFileSync(path.join(r.out, 'network-targets.md'), 'utf8'), /has not started yet, so no job can begin before 2026-12-31/);
  assert.match(r.log.gates.G4_visa_path.question, /OPT runs 2026-12-31 to 2027-12-30/);
});

test('an OPT start on or after the OPT end → exit 3, nothing written', () => {
  const persona = withPersona((p) => { p.visa.opt_start_date = '2028-01-01'; p.visa.opt_end_date = '2027-12-30'; });
  const r = cli(['--persona', persona]);
  assert.equal(r.status, 3);
  assert.match(r.stderr, /opt_start_date 2028-01-01 must be before visa\.opt_end_date 2027-12-30/);
  assert.equal(fs.existsSync(r.out), false);
});

test('F2: SOC code with no row → exit 3, names the code, nothing written', () => {
  const persona = withPersona((p) => { p.targets[0].soc = '13-1028'; });
  const r = cli(['--persona', persona]);
  assert.equal(r.status, 3);
  assert.match(r.stderr, /SOC code 13-1028 has no row/);
  assert.equal(fs.existsSync(r.out), false);
});

test('F3: liveness observations that match no candidate are reported, never invented', () => {
  const { log } = cli();
  const u = Object.fromEntries(log.unmatched_liveness_observations.map((x) => [x.company, x.why]));
  assert.equal(u['India Robotics'], 'not in the company CSV');
  assert.match(u['Hotel Ventures'], /in the CSV but not a candidate/);
  assert.ok(!log.candidates.some((c) => /INDIA|HOTEL/.test(c.company)));
});

test('F6: CSV missing a required column → exit 3, nothing written', () => {
  const csv = fs.readFileSync(FX('companies.fixture.csv'), 'utf8').replace('Approval_Rate', 'Approval_Ratio');
  const f = path.join(tmp(), 'bad.csv');
  fs.writeFileSync(f, csv);
  const r = cli(['--csv', f]);
  assert.equal(r.status, 3);
  assert.match(r.stderr, /lacks required column\(s\) "Approval_Rate"/);
  assert.equal(fs.existsSync(r.out), false);
});

test('a stale or failed liveness check holds the company instead of closing it', () => {
  const c = byName(cli().log);
  assert.equal(c['KILO MACHINES INC'].bucket, 'check-liveness');
  assert.match(c['KILO MACHINES INC'].liveness.reason, /30 days old/);
  const p = path.join(tmp(), 'l.json');
  fs.writeFileSync(p, JSON.stringify({ observations: [{ company: 'Kilo Machines', checked_on: '2026-10-01', observed_by: 'script', result: 'unchecked', evidence: 'x.txt' }] }));
  assert.equal(byName(cli(['--liveness', p]).log)['KILO MACHINES INC'].bucket, 'check-liveness');
});

test('companies sharing an identical H-1B record are flagged for an identity check', () => {
  const { log } = cli();
  const c = byName(log);
  assert.equal(c['FOXTROT LABS INC'].identity_check_required, true);
  assert.deepEqual(c['FOXTROT LABS INC'].shares_record_with, ['FOXTROTT LABS INC']);
  assert.equal(c['ALPHA PRODUCTION SYSTEMS INC'].identity_check_required, false);
  assert.equal(log.gates.G5_identity.status, 'awaiting human check');
});

test('BLS vocabulary: primary O*NET row by default; "all" pulls in QA titles', () => {
  assert.ok(!byName(cli().log)['MIKE SOFTWARE INC'], 'software QA manager must not match 11-3051 by default');
  const persona = withPersona((p) => { p.bls_title_rows = 'all'; });
  const m = byName(cli(['--persona', persona]).log)['MIKE SOFTWARE INC'];
  assert.ok(m, 'with "all", 11-3051.01 alternate titles apply');
  assert.match(m.evidence.title_matches[0].vocabulary, /11-3051\.01/);
});

test('parity check is computed from the file, not hardcoded', () => {
  const head = fs.readFileSync(FX('companies.fixture.csv'), 'utf8').split('\n')[0];
  const rows = (odd) => Array.from({ length: 25 }, (_, i) =>
    `CO${i} INC,Other,,,,,,,,,,,,,,${odd && i === 0 ? 3 : 2 * (i + 1)}.0,0.0,100.0,100000.0,"['Project Manager']"`);
  const run = (odd) => {
    const f = path.join(tmp(), 'p.csv');
    fs.writeFileSync(f, [head, ...rows(odd)].join('\n') + '\n');
    return cli(['--csv', f]).log.data_checks.parity;
  };
  assert.equal(run(false).all_even, true);
  const p = run(true);
  assert.equal(p.all_even, false);
  assert.equal(p.approvals_odd, 1);
});

test('out-dir outside this contribution is refused, nothing written', () => {
  // Unique name + cleanup: a mutation run with the guard disabled once left files in
  // data/examples/ and broke the next clean run (see evidence/mutation-tests-*.txt).
  const out = path.join(REPO, 'data', 'examples', `nt-should-not-exist-${process.pid}-${Date.now()}`);
  try {
    const r = cli([], { out });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /outside this contribution's folders/);
    assert.equal(fs.existsSync(out), false);
  } finally {
    if (path.basename(out).startsWith('nt-should-not-exist-')) fs.rmSync(out, { recursive: true, force: true });
  }
});

test('out-dir guard holds even when the repository itself sits inside the OS temp dir', () => {
  // The Canvas ZIP, unzipped under %TEMP%, once let output land in data/examples/: the old rule
  // allowed anything under tmp. Rebuild that condition with a copy of the tool and the scorer.
  const fake = path.join(tmp(), 'repo');
  const here = path.join(fake, 'scripts/contrib/2026fa/contactshyam14-code-em-network-targets');
  fs.mkdirSync(here, { recursive: true });
  fs.mkdirSync(path.join(fake, 'scripts/score'), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(here, 'network-targets.mjs'));
  fs.copyFileSync(SCORER, path.join(fake, 'scripts/score/role-scorer.mjs'));
  const run = (out) => spawnSync(process.execPath, [path.join(here, 'network-targets.mjs'),
    '--persona', FX('persona.fixture.json'), '--liveness', FX('liveness.fixture.json'), '--csv', FX('companies.fixture.csv'),
    '--soc-file', FX('soc.fixture.csv'), '--formd-dir', FX('formd'), '--as-of', '2026-10-01', '--out-dir', out], { cwd: fake, encoding: 'utf8' });
  const tracked = path.join(fake, 'data', 'examples', 'should-refuse');
  const r = run(tracked);
  assert.equal(r.status, 2, r.stderr);
  assert.equal(fs.existsSync(tracked), false);
  const ns = path.join(fake, 'course/2026fa/submissions/contactshyam14-code/runs/t');
  assert.equal(run(ns).status, 0, 'the namespace inside that repo is still allowed');
});

test('nothing checked yet → scorer is not run (no empty, NaN-rate report)', () => {
  const p = path.join(tmp(), 'empty.json');
  fs.writeFileSync(p, JSON.stringify({ observations: [] }));
  const r = cli(['--liveness', p]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.log.scorer.ran, false);
  assert.equal(fs.existsSync(path.join(r.out, 'role-scores.json')), false);
  assert.ok(r.log.candidates.every((c) => c.bucket === 'check-liveness'));
});

test('upstream characterization: the scorer treats a MISSING liveness gate as open', () => {
  // Why the tool must never omit liveness. If this starts failing, the scorer changed — re-read it.
  const dir = tmp();
  const f = path.join(dir, 'roles.json');
  fs.writeFileSync(f, JSON.stringify([{ role_id: 'x', company: 'X', title: 'no liveness given', sponsorship: { p: 0.9, tier: 'Proven', source: 'record' } }]));
  const r = spawnSync(process.execPath, [SCORER, f, '--out-dir', dir], { cwd: REPO, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const s = JSON.parse(fs.readFileSync(path.join(dir, 'role-scores.json'), 'utf8')).roles[0];
  assert.equal(s.trace.gates.find((g) => g.factor === 'liveness').multiplier, 1);
  assert.equal(s.recommendation, 'Apply');
});
