#!/usr/bin/env node
// gate-harness.mjs — gate-behavior unit-test harness for the Bayesian Role
// Scorer (book Chapter 11), written against the capstone's named build failure:
// the gate-as-vote bug.
//
// WHAT THIS PROVES
//   Ch.11 states liveness and timeline are GATES — multipliers, not addends —
//   so a ghost posting or an impossible start date zeroes the composite no
//   matter how strong the votes. That is a claim about behaviour, and a claim
//   about behaviour is testable. This harness tests it.
//
// WHY IT INVOKES THE CLI RATHER THAN IMPORTING
//   role-scorer.mjs exports nothing and calls main() at module top level, so
//   importing it executes it. Testing through the CLI is therefore both the
//   only option and the better one: it exercises the contract a real operator
//   uses, and it keeps this contribution purely additive — no existing file is
//   modified.
//
// THE NEGATIVE CONTROL (the part that matters)
//   A harness that only ever passes proves nothing: it cannot distinguish "the
//   gates are correct" from "my assertions are vacuous". So this harness also
//   runs every case against a deliberately MUTATED copy of the scorer in which
//   gates are additive votes and the closed-gate branch is removed. If the
//   gate assertions do not fail against the mutant, the harness is not
//   measuring what it claims to measure, and it says so.
//
//   The mutant is written to an OS temp directory. No file in this repository
//   is modified at any point.
//
// EVERY NUMBER THIS HARNESS PRINTS is one of:
//   - script-output : read verbatim from the scorer's own emitted trace
//   - fixture       : declared by hand in fixtures/gate-cases.json, with the
//                     derivation shown in that file's `why` field
//   - harness-count : a PASS/FAIL tally this script computed
// No number here is a claim about any real company, posting, or person. The
// fixtures are synthetic test vectors.
//
// USAGE
//   node scripts/score/gate-harness.mjs
//   node scripts/score/gate-harness.mjs --no-mutate      # skip negative control
//   node scripts/score/gate-harness.mjs --out-dir output/gate-harness
//   node scripts/score/gate-harness.mjs --quiet          # summary lines only
//
// EXIT CODES
//   0 = all baseline + structural assertions passed AND the negative control
//       caught the mutation (warnings do not fail the run)
//   1 = an assertion failed, or the negative control did not catch the mutation
//   2 = harness could not run (missing scorer, missing fixtures, bad JSON)

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCORER = path.join(HERE, 'role-scorer.mjs');
const FIXTURES = path.join(HERE, 'fixtures', 'gate-cases.json');
const TOLERANCE = 1e-3; // the scorer rounds composite/vote_sum/gate_product to 4dp

// The gate-as-vote mutation. Both patterns must match verbatim; if either does
// not, the scorer has drifted from what this harness was written against and we
// report that rather than silently running a weaker test.
const MUTATIONS = [
  {
    name: 'gates-become-additive-votes',
    find: 'const composite = voteSum * gateProduct;',
    replace: 'const composite = voteSum + (liveness * 0.20) + (timeline * 0.15);',
  },
  {
    name: 'closed-gate-branch-removed',
    find: 'const closedGate = gates.find((g) => g.factor <= CONFIG.gate_zero);',
    replace: 'const closedGate = null;',
  },
];

// Cases whose assertions depend on gate semantics. The negative control is
// meaningful only for these — G6/G9 do not exercise a closed or partial gate.
const GATE_SENSITIVE = new Set([
  'G1-liveness-zero-with-maximal-votes',
  'G2-timeline-zero-with-maximal-votes',
  'G3-gate-boundary-at-threshold',
  'G4-gate-boundary-just-above-threshold',
  'G5-two-partial-gates-multiply',
]);

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const QUIET = flag('--quiet');
const DO_MUTATE = !flag('--no-mutate');
const OUT_DIR = opt('--out-dir', path.join(process.cwd(), 'output', 'gate-harness'));

const say = (s = '') => { if (!QUIET) console.log(s); };
const near = (a, b, tol = TOLERANCE) => Math.abs(Number(a) - Number(b)) <= tol;

function die(msg) { console.error(`gate-harness: ${msg}`); process.exit(2); }

// ── run the scorer as a subprocess over a set of role records ───────────────
function runScorer(scorerPath, roles, label) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-harness-'));
  const rolesFile = path.join(tmp, 'roles.json');
  fs.writeFileSync(rolesFile, JSON.stringify(roles, null, 2));
  let stdout = '';
  try {
    stdout = execFileSync(process.execPath, [scorerPath, rolesFile, '--out-dir', tmp], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    die(`scorer exited non-zero while running ${label}: ${e.stderr || e.message}`);
  }
  const outFile = path.join(tmp, 'role-scores.json');
  if (!fs.existsSync(outFile)) die(`scorer produced no role-scores.json for ${label}`);
  const parsed = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  return { scored: parsed.roles || [], config: parsed.config || null, stdout, tmp };
}

// ── assert one case's declared expectations against the scorer's output ─────
function checkCase(caseDef, got) {
  const e = caseDef.expect || {};
  const checks = [];
  const add = (name, pass, expected, actual) =>
    checks.push({ name, pass, expected: String(expected), actual: String(actual) });

  if ('composite' in e)
    add('composite', near(got.composite, e.composite), e.composite, got.composite);
  if ('recommendation' in e)
    add('recommendation', got.recommendation === e.recommendation, e.recommendation, got.recommendation);
  if ('reason_contains' in e)
    add('reason_contains', String(got.reason || '').includes(e.reason_contains),
      `reason includes "${e.reason_contains}"`, got.reason);
  if ('reason_excludes' in e)
    add('reason_excludes', !String(got.reason || '').includes(e.reason_excludes),
      `reason excludes "${e.reason_excludes}"`, got.reason);
  if ('override_warning_present' in e) {
    const present = Boolean(got.override && got.override._warning);
    add('override_warning_present', present === e.override_warning_present,
      e.override_warning_present, present);
  }
  return checks;
}

// ── structural assertions applied to every case, derived from the scorer's
//    own trace so they need no external ground truth ──────────────────────────
function structuralChecks(scored) {
  const results = [];

  const identityFails = scored.filter((s) => {
    const vs = s?.trace?.vote_sum, gp = s?.trace?.gate_product;
    if (typeof vs !== 'number' || typeof gp !== 'number') return true;
    return !near(s.composite, vs * gp);
  });
  results.push({
    name: 'arithmetic-identity',
    pass: identityFails.length === 0,
    detail: `composite == vote_sum x gate_product (tol ${TOLERANCE}) for ${scored.length - identityFails.length}/${scored.length} cases`,
    offenders: identityFails.map((s) => s.role_id),
  });

  const labelFails = scored.filter((s) => {
    const votes = s?.trace?.votes || [], gates = s?.trace?.gates || [];
    const unlabeled = [...votes, ...gates].filter((t) => !t.source);
    return unlabeled.length > 0 || gates.length !== 2;
  });
  results.push({
    name: 'trace-source-labels',
    pass: labelFails.length === 0,
    detail: `every vote and both gates carry a source label for ${scored.length - labelFails.length}/${scored.length} cases`,
    offenders: labelFails.map((s) => s.role_id),
  });

  const gateFails = scored.filter((s) => {
    const gates = s?.trace?.gates || [];
    const keys = gates.map((g) => g.factor);
    return !(keys.includes('liveness') && keys.includes('timeline'));
  });
  results.push({
    name: 'both-gates-present',
    pass: gateFails.length === 0,
    detail: `liveness and timeline both appear as gates in ${scored.length - gateFails.length}/${scored.length} cases`,
    offenders: gateFails.map((s) => s.role_id),
  });

  return results;
}

// ── config drift: the fixtures' expected values are only valid for the CONFIG
//    they were computed against ────────────────────────────────────────────────
function configDrift(assumed, observed) {
  if (!observed) return [{ key: 'config', pass: false, expected: 'present', actual: 'scorer emitted no config block' }];
  const rows = [];
  const cmp = (key, exp, act) => rows.push({ key, pass: near(exp, act, 1e-12), expected: exp, actual: act });
  cmp('weights.sponsorship', assumed.weights.sponsorship, observed.weights?.sponsorship);
  cmp('weights.fit', assumed.weights.fit, observed.weights?.fit);
  cmp('weights.role_quality', assumed.weights.role_quality, observed.weights?.role_quality);
  cmp('apply_threshold', assumed.apply_threshold, observed.apply_threshold);
  cmp('consider_floor', assumed.consider_floor, observed.consider_floor);
  cmp('gate_zero', assumed.gate_zero, observed.gate_zero);
  return rows;
}

// ── build the mutant scorer in a temp dir ───────────────────────────────────
function buildMutant() {
  const src = fs.readFileSync(SCORER, 'utf8');
  let out = src;
  const applied = [];
  for (const m of MUTATIONS) {
    if (!out.includes(m.find)) { applied.push({ ...m, matched: false }); continue; }
    out = out.replace(m.find, m.replace);
    applied.push({ ...m, matched: true });
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-mutant-'));
  const p = path.join(tmp, 'role-scorer.mutant.mjs');
  fs.writeFileSync(p, out);
  return { path: p, applied };
}

// ── main ────────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(SCORER)) die(`scorer not found at ${SCORER}`);
  if (!fs.existsSync(FIXTURES)) die(`fixtures not found at ${FIXTURES}`);

  let fx;
  try { fx = JSON.parse(fs.readFileSync(FIXTURES, 'utf8')); }
  catch (e) { die(`fixtures are not valid JSON: ${e.message}`); }
  const cases = fx.cases || [];
  if (cases.length === 0) die('fixtures contain no cases');

  say('=== Gate-Behavior Harness — Bayesian Role Scorer (Ch.11) ===');
  say(`scorer   : ${path.relative(process.cwd(), SCORER)}`);
  say(`fixtures : ${path.relative(process.cwd(), FIXTURES)} (${cases.length} cases)`);
  say(`provenance: fixtures are SYNTHETIC test vectors — no real company data`);
  say('');

  const roles = cases.map((c) => c.role);
  const base = runScorer(SCORER, roles, 'baseline');
  const byId = new Map(base.scored.map((s) => [s.role_id, s]));

  // ---- config drift ----
  const drift = configDrift(fx._config_assumed, base.config);
  const driftBad = drift.filter((d) => !d.pass);
  say('--- CONFIG ---');
  if (driftBad.length === 0) {
    say(`PASS  config-matches-fixtures        all ${drift.length} values match the config the expected values were derived from`);
  } else {
    say(`FAIL  config-matches-fixtures        ${driftBad.length} value(s) drifted — expected values below are STALE:`);
    for (const d of driftBad) say(`        ${d.key}: fixture says ${d.expected}, scorer says ${d.actual}`);
  }
  say('');

  // ---- baseline per-case ----
  say('--- BASELINE (unmodified scorer) ---');
  const baseline = [];
  for (const c of cases) {
    const got = byId.get(c.role.role_id);
    if (!got) { baseline.push({ case_id: c.case_id, pass: false, checks: [{ name: 'scored', pass: false, expected: 'present', actual: 'missing' }] }); say(`FAIL  ${c.case_id}  (scorer returned no row)`); continue; }
    const checks = checkCase(c, got);
    const pass = checks.every((x) => x.pass);
    baseline.push({ case_id: c.case_id, pass, checks, observed: { composite: got.composite, recommendation: got.recommendation, reason: got.reason, vote_sum: got.trace?.vote_sum, gate_product: got.trace?.gate_product } });
    say(`${pass ? 'PASS' : 'FAIL'}  ${c.case_id}`);
    say(`        composite ${got.composite} (vote_sum ${got.trace?.vote_sum} x gate_product ${got.trace?.gate_product}) -> ${got.recommendation}`);
    if (!pass) for (const x of checks.filter((y) => !y.pass)) say(`        ! ${x.name}: expected ${x.expected}, got ${x.actual}`);
  }
  say('');

  // ---- structural ----
  say('--- STRUCTURAL (all cases, checked against the scorer\'s own trace) ---');
  const structural = structuralChecks(base.scored);
  for (const r of structural) {
    say(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}`);
    say(`        ${r.detail}`);
    if (!r.pass && r.offenders?.length) say(`        offenders: ${r.offenders.join(', ')}`);
  }
  say('');

  // ---- paired checks ----
  const paired = [];
  if ((fx.paired_checks || []).length) {
    say('--- PAIRED (cross-case relations) ---');
    for (const p of fx.paired_checks) {
      const [aId, bId] = p.compare;
      const a = cases.find((c) => c.case_id === aId), b = cases.find((c) => c.case_id === bId);
      const ga = a && byId.get(a.role.role_id), gb = b && byId.get(b.role.role_id);
      let holds = null;
      if (ga && gb && p.relation === 'composite_equal') holds = near(ga.composite, gb.composite);
      const level = p.severity === 'warn' ? 'WARN' : (holds ? 'PASS' : 'FAIL');
      paired.push({ check_id: p.check_id, relation: p.relation, holds, severity: p.severity, a: ga?.composite, b: gb?.composite, means: p.means });
      say(`${level}  ${p.check_id}`);
      say(`        ${aId} composite ${ga?.composite} vs ${bId} composite ${gb?.composite} -> equal: ${holds}`);
      say(`        ${p.means}`);
    }
    say('');
  }

  // ---- negative control ----
  let negative = null;
  if (DO_MUTATE) {
    say('--- NEGATIVE CONTROL (mutated scorer: gates as additive votes) ---');
    const mutant = buildMutant();
    const unmatched = mutant.applied.filter((m) => !m.matched);
    if (unmatched.length) {
      say(`FAIL  mutation-drift               ${unmatched.length}/${MUTATIONS.length} mutation pattern(s) no longer match role-scorer.mjs:`);
      for (const m of unmatched) say(`        ! ${m.name}: pattern not found — the scorer has changed and this harness's negative control is no longer valid`);
      negative = { valid: false, applied: mutant.applied, caught: [], missed: [] };
    } else {
      say(`      mutation applied: ${mutant.applied.length}/${MUTATIONS.length} patterns matched (${mutant.applied.map((m) => m.name).join(', ')})`);
      const mut = runScorer(mutant.path, roles, 'mutant');
      const mById = new Map(mut.scored.map((s) => [s.role_id, s]));
      const caught = [], missed = [];
      for (const c of cases) {
        if (!GATE_SENSITIVE.has(c.case_id)) continue;
        const got = mById.get(c.role.role_id);
        const checks = got ? checkCase(c, got) : [{ name: 'scored', pass: false }];
        const failedUnderMutation = checks.some((x) => !x.pass);
        const baselinePassed = baseline.find((b) => b.case_id === c.case_id)?.pass;
        const entry = { case_id: c.case_id, baseline_passed: Boolean(baselinePassed), mutant_failed: failedUnderMutation, mutant_observed: got ? { composite: got.composite, recommendation: got.recommendation } : null };
        if (baselinePassed && failedUnderMutation) { caught.push(entry); say(`CAUGHT  ${c.case_id}  baseline PASS -> mutant FAIL (mutant composite ${got?.composite}, rec ${got?.recommendation})`); }
        else { missed.push(entry); say(`MISSED  ${c.case_id}  assertion did not discriminate (baseline pass ${Boolean(baselinePassed)}, mutant failed ${failedUnderMutation})`); }
      }
      negative = { valid: true, applied: mutant.applied, caught, missed };
      say('');
      say(`      negative control: ${caught.length}/${caught.length + missed.length} gate-sensitive assertions correctly failed under mutation`);
    }
    say('');
  }

  // ---- summary ----
  const basePassed = baseline.filter((b) => b.pass).length;
  const baseFailed = baseline.length - basePassed;
  const structPassed = structural.filter((s) => s.pass).length;
  const structFailed = structural.length - structPassed;
  const warns = paired.filter((p) => p.severity === 'warn').length;
  const negOk = !DO_MUTATE ? null : Boolean(negative?.valid && negative.missed.length === 0 && negative.caught.length > 0);
  const ok = baseFailed === 0 && structFailed === 0 && driftBad.length === 0 && (negOk !== false);

  say('=== SUMMARY ===');
  say(`config drift      : ${driftBad.length === 0 ? 'none' : `${driftBad.length} value(s) drifted`}`);
  say(`baseline cases    : ${basePassed} passed, ${baseFailed} failed  (of ${baseline.length})`);
  say(`structural checks : ${structPassed} passed, ${structFailed} failed  (of ${structural.length})`);
  say(`paired checks     : ${warns} warning(s)`);
  say(`negative control  : ${negOk === null ? 'skipped (--no-mutate)' : negOk ? `PASS — mutation caught by ${negative.caught.length} assertion(s)` : 'FAIL — mutation not caught'}`);
  say(`RESULT            : ${ok ? 'PASS' : 'FAIL'}`);

  // ---- artifacts ----
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const report = {
    _harness: 'gate-behavior-harness',
    _target: 'scripts/score/role-scorer.mjs',
    _chapters: [11, 16],
    _fixture_provenance: 'SYNTHETIC test vectors — see scripts/score/fixtures/gate-cases.json _provenance',
    _value_kinds: {
      'script-output': 'composite, vote_sum, gate_product, recommendation, reason — read verbatim from the scorer\'s emitted trace',
      fixture: 'expected values — hand-derived in gate-cases.json, derivation in each case\'s `why` field',
      'harness-count': 'pass/fail tallies computed by this script',
    },
    generated: stamp,
    result: ok ? 'PASS' : 'FAIL',
    config_drift: drift,
    baseline,
    structural,
    paired,
    negative_control: negative,
  };
  const jsonPath = path.join(OUT_DIR, `gate-harness-${stamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = [];
  md.push(`# Gate-Behavior Harness — audit (${stamp})`);
  md.push('');
  md.push(`**Target:** \`scripts/score/role-scorer.mjs\` (Bayesian Role Scorer, Ch.11) · **Result: ${ok ? 'PASS' : 'FAIL'}**`);
  md.push('');
  md.push(`Tests the Ch.11 claim that liveness and timeline are gates (multipliers), not votes (addends). Fixtures are **synthetic test vectors**, not records — no number in this report is a claim about a real company, posting, or person.`);
  md.push('');
  md.push('## Config');
  md.push('');
  md.push('| Key | Fixture expects | Scorer reports | Match |');
  md.push('|---|---|---|---|');
  for (const d of drift) md.push(`| ${d.key} | ${d.expected} | ${d.actual} | ${d.pass ? 'yes' : '**NO — expected values are stale**'} |`);
  md.push('');
  md.push('## Baseline cases');
  md.push('');
  md.push('| Case | Result | composite (script-output) | vote_sum x gate_product | Recommendation |');
  md.push('|---|---|---|---|---|');
  for (const b of baseline) md.push(`| ${b.case_id} | ${b.pass ? 'PASS' : '**FAIL**'} | ${b.observed?.composite ?? '—'} | ${b.observed?.vote_sum ?? '—'} x ${b.observed?.gate_product ?? '—'} | ${b.observed?.recommendation ?? '—'} |`);
  md.push('');
  md.push('## Structural checks');
  md.push('');
  for (const s of structural) md.push(`- **${s.pass ? 'PASS' : 'FAIL'}** \`${s.name}\` — ${s.detail}`);
  md.push('');
  if (paired.length) {
    md.push('## Paired checks (structural findings)');
    md.push('');
    for (const p of paired) md.push(`- **${p.severity === 'warn' ? 'WARN' : (p.holds ? 'PASS' : 'FAIL')}** \`${p.check_id}\` — composites ${p.a} vs ${p.b}; equal: ${p.holds}. ${p.means}`);
    md.push('');
  }
  md.push('## Negative control');
  md.push('');
  if (!DO_MUTATE) md.push('_Skipped (`--no-mutate`)._ A run without the negative control cannot show that these assertions discriminate.');
  else if (!negative?.valid) md.push('**FAIL — mutation patterns no longer match the scorer.** The negative control could not be constructed, so this run does not establish that the assertions discriminate. Treat the baseline PASSes with suspicion until the harness is updated to the scorer\'s current source.');
  else {
    md.push(`Mutant: gates made additive (\`voteSum + liveness*0.20 + timeline*0.15\`) and the closed-gate branch removed. Written to an OS temp directory; **no repository file is modified**.`);
    md.push('');
    md.push('| Case | Baseline | Under mutation | Discriminates? |');
    md.push('|---|---|---|---|');
    for (const e of [...negative.caught, ...negative.missed]) md.push(`| ${e.case_id} | ${e.baseline_passed ? 'PASS' : 'FAIL'} | ${e.mutant_failed ? 'FAIL' : 'PASS'} (composite ${e.mutant_observed?.composite ?? '—'}, ${e.mutant_observed?.recommendation ?? '—'}) | ${e.baseline_passed && e.mutant_failed ? 'yes' : '**no**'} |`);
  }
  md.push('');
  md.push('## What this harness cannot verify');
  md.push('');
  md.push('- Whether the **input** numbers are true. It tests how the scorer combines sponsorship/fit/liveness/timeline values; it does not check that any of those values reflect reality. A ghost posting with `liveness.factor: 1.0` supplied by a broken upstream feed will be scored as live and this harness will not notice.');
  md.push('- Whether the **weights** are right. It asserts the config it was written against, so it detects drift — but it has no way to judge whether 0.35/0.30/0.0 are the correct weights.');
  md.push('- Whether the **thresholds** (0.30 / 0.20 / 0.05) are well chosen. Two of the three are marked `[VERIFY]` in the scorer itself.');
  md.push('- Anything about **real roles**. The fixtures are synthetic.');
  md.push('');
  const mdPath = path.join(OUT_DIR, `gate-harness-${stamp}-audit.md`);
  fs.writeFileSync(mdPath, md.join('\n') + '\n');

  say('');
  say(`artifacts: ${path.relative(process.cwd(), jsonPath)}`);
  say(`           ${path.relative(process.cwd(), mdPath)}`);

  process.exit(ok ? 0 : 1);
}

main();
