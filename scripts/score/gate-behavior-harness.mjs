#!/usr/bin/env node
// gate-behavior-harness.mjs — prove Ch.11 gates are multipliers, not votes.
// Capstone gap (Ch 11 / 16): catch the "gate-as-vote" bug where a dead posting
// or impossible timeline is merely down-weighted instead of zeroing the score.
//
//   node scripts/score/gate-behavior-harness.mjs
//   npm run score:gates
//   npm run score:gates -- --break   # deliberate gate-as-vote mode (must FAIL checks)
//
// Pass = closed liveness / timeline force Skip and composite ≈ 0 even when
// sponsorship + fit votes are strong. Fail = those gates behave like soft votes.
// Uses public fixture data only (data/examples/). No network. No private data.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const FIXTURE = path.join(ROOT, 'data/examples/gate-behavior-roles.json');
const DEFAULT_OUT_DIR = path.join(ROOT, 'output/gate-behavior');
const GATE_ZERO = 0.05; // must stay aligned with role-scorer.mjs CONFIG.gate_zero

const SRC = { record: 'record', model: 'model-judgment', input: 'your-input' };

// Correct Ch.11 combiner: votes summed, gates multiplied.
function scoreCorrect(role, weights) {
  const votes = [];
  const push = (key, obj, defSrc) => {
    const p = typeof obj?.p === 'number' && isFinite(obj.p) ? obj.p : null;
    if (p == null) return;
    votes.push({ key, p, weight: weights[key] ?? 0, source: obj.source || defSrc });
  };
  push('sponsorship', role.sponsorship, SRC.record);
  push('fit', role.fit, SRC.model);
  push('role_quality', role.role_quality, SRC.record);

  const voteSum = votes.reduce((s, v) => s + v.p * v.weight, 0);
  const liveness = typeof role.liveness?.factor === 'number' ? role.liveness.factor : 1;
  const timeline = typeof role.timeline?.factor === 'number' ? role.timeline.factor : 1;
  const gates = [
    { key: 'liveness', factor: liveness },
    { key: 'timeline', factor: timeline },
  ];
  const gateProduct = gates.reduce((s, g) => s * g.factor, 1);
  const composite = voteSum * gateProduct;
  const closedGate = gates.find((g) => g.factor <= GATE_ZERO);
  let recommendation;
  if (closedGate) recommendation = 'Skip';
  else if (composite >= 0.30) recommendation = 'Apply';
  else if (composite >= 0.20) recommendation = 'Consider';
  else recommendation = 'Skip';

  return {
    role_id: role.role_id,
    composite: Number(composite.toFixed(4)),
    recommendation,
    vote_sum: Number(voteSum.toFixed(4)),
    gate_product: Number(gateProduct.toFixed(4)),
    closed_gate: closedGate ? closedGate.key : null,
    mode: 'correct-multiplicative-gates',
  };
}

// BUG MODE (gate-as-vote): treat liveness/timeline as extra addends, not multipliers.
// This is the failure Ch.16 warns about — strong sponsorship can "outvote" a dead job.
function scoreBuggyGateAsVote(role, weights) {
  const votes = [];
  const push = (key, obj) => {
    const p = typeof obj?.p === 'number' && isFinite(obj.p) ? obj.p : null;
    if (p == null) return;
    votes.push({ key, p, weight: weights[key] ?? 0 });
  };
  push('sponsorship', role.sponsorship);
  push('fit', role.fit);
  push('role_quality', role.role_quality);

  const liveness = typeof role.liveness?.factor === 'number' ? role.liveness.factor : 1;
  const timeline = typeof role.timeline?.factor === 'number' ? role.timeline.factor : 1;
  // Wrong: fold gates into the weighted sum as soft votes (weight 0.15 each).
  votes.push({ key: 'liveness', p: liveness, weight: 0.15 });
  votes.push({ key: 'timeline', p: timeline, weight: 0.15 });

  const composite = votes.reduce((s, v) => s + v.p * v.weight, 0);
  let recommendation;
  if (composite >= 0.30) recommendation = 'Apply';
  else if (composite >= 0.20) recommendation = 'Consider';
  else recommendation = 'Skip';

  return {
    role_id: role.role_id,
    composite: Number(composite.toFixed(4)),
    recommendation,
    vote_sum: Number(composite.toFixed(4)),
    gate_product: null,
    closed_gate: null,
    mode: 'buggy-gate-as-vote',
  };
}

const WEIGHTS = { sponsorship: 0.35, fit: 0.30, role_quality: 0.0 };

function loadRoles(fixturePath) {
  const raw = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  return Array.isArray(raw) ? raw : (raw.roles || []);
}

function expect(cond, msg) {
  return cond ? { ok: true, msg } : { ok: false, msg };
}

function runCase(role, scoreFn) {
  const scored = scoreFn(role, WEIGHTS);
  const checks = [];

  if (role.expect?.closed_gate) {
    checks.push(expect(
      scored.recommendation === 'Skip',
      `${role.role_id}: closed ${role.expect.closed_gate} must recommend Skip (got ${scored.recommendation})`,
    ));
    checks.push(expect(
      scored.composite <= GATE_ZERO,
      `${role.role_id}: closed gate must zero composite (≤ ${GATE_ZERO}), got ${scored.composite}`,
    ));
    // Strong votes alone would clear Apply threshold — prove they cannot rescue a closed gate.
    const voteOnly = (role.sponsorship?.p ?? 0) * WEIGHTS.sponsorship
      + (role.fit?.p ?? 0) * WEIGHTS.fit;
    checks.push(expect(
      voteOnly >= 0.30,
      `${role.role_id}: fixture sanity — vote sum ${voteOnly.toFixed(3)} should be Apply-strong (≥0.30) so the Skip proves the gate, not weak votes`,
    ));
    checks.push(expect(
      scored.recommendation === 'Skip' && voteOnly >= 0.30,
      `${role.role_id}: gate must beat strong votes (vote_sum≈${voteOnly.toFixed(3)} would Apply; rec=${scored.recommendation})`,
    ));
  }

  if (role.expect?.recommendation) {
    checks.push(expect(
      scored.recommendation === role.expect.recommendation,
      `${role.role_id}: expected recommendation ${role.expect.recommendation}, got ${scored.recommendation}`,
    ));
  }

  if (typeof role.expect?.composite_min === 'number') {
    checks.push(expect(
      scored.composite >= role.expect.composite_min,
      `${role.role_id}: composite ${scored.composite} < min ${role.expect.composite_min}`,
    ));
  }

  if (typeof role.expect?.composite_max === 'number') {
    checks.push(expect(
      scored.composite <= role.expect.composite_max,
      `${role.role_id}: composite ${scored.composite} > max ${role.expect.composite_max}`,
    ));
  }

  return { scored, checks };
}

function renderAudit(meta, results) {
  const lines = [];
  lines.push(`# Gate-behavior harness audit — ${meta.when}`);
  lines.push('');
  lines.push('*Ch.11 / Ch.16 contract: liveness and timeline are gates (multipliers), not votes.*');
  lines.push('');
  lines.push(`- **Mode:** \`${meta.mode}\`${meta.breakAttempt ? ' (deliberate break — expect FAIL)' : ''}`);
  lines.push(`- **Fixture:** \`${meta.fixture}\``);
  lines.push('- **Script:** `scripts/score/gate-behavior-harness.mjs`');
  lines.push(`- **Cases:** ${results.length}`);
  lines.push(`- **PASS:** ${meta.passCount} · **FAIL:** ${meta.failCount}`);
  lines.push(`- **Verdict:** **${meta.verdict}**`);
  lines.push('');
  lines.push('| Role | Composite | Rec | Closed gate | Checks |');
  lines.push('|---|---|---|---|---|');
  for (const r of results) {
    const failed = r.checks.filter((c) => !c.ok);
    const status = failed.length ? `FAIL (${failed.map((f) => f.msg).join('; ')})` : 'PASS';
    lines.push(`| ${r.scored.role_id} | ${r.scored.composite} | ${r.scored.recommendation} | ${r.scored.closed_gate ?? '—'} | ${status} |`);
  }
  lines.push('');
  lines.push('## Numbers → records');
  lines.push('');
  lines.push('| Emitted number | Kind | Comes from |');
  lines.push('|---|---|---|');
  lines.push('| case PASS/FAIL counts | script-output | this harness run against fixture rows |');
  lines.push('| composite / recommendation | script-output | scoring function applied to fixture fields |');
  lines.push('| sponsorship.p, fit.p, liveness.factor, timeline.factor | record (fixture) | `data/examples/gate-behavior-roles.json` |');
  lines.push('| gate_zero threshold (0.05) | your-input (aligned with scorer config) | `role-scorer.mjs` CONFIG.gate_zero |');
  lines.push('');
  lines.push('*This harness does not call live ATS or invent liveness. It only checks arithmetic on labeled fixture inputs.*');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const breakAttempt = args.includes('--break') || args.includes('--simulate-bug');
  const oi = args.indexOf('--out-dir');
  const outDir = oi >= 0 ? args[oi + 1] : DEFAULT_OUT_DIR;
  const fi = args.indexOf('--fixture');
  const fixture = fi >= 0 ? path.resolve(args[fi + 1]) : FIXTURE;

  if (!fs.existsSync(fixture)) {
    console.error(`Missing fixture: ${fixture}`);
    process.exit(2);
  }

  const roles = loadRoles(fixture);
  const scoreFn = breakAttempt ? scoreBuggyGateAsVote : scoreCorrect;
  const mode = breakAttempt ? 'buggy-gate-as-vote' : 'correct-multiplicative-gates';

  const results = roles.map((role) => {
    const { scored, checks } = runCase(role, scoreFn);
    return { role_id: role.role_id, title: role.title, scored, checks };
  });

  const allChecks = results.flatMap((r) => r.checks);
  const passCount = allChecks.filter((c) => c.ok).length;
  const failCount = allChecks.filter((c) => !c.ok).length;
  // In correct mode, any failed check → harness FAIL (exit 1).
  // In --break mode, we EXPECT gate cases to fail checks — that proves the harness catches the bug.
  let verdict;
  let exitCode;
  if (!breakAttempt) {
    verdict = failCount === 0 ? 'PASS' : 'FAIL';
    exitCode = failCount === 0 ? 0 : 1;
  } else {
    const gateRoles = results.filter((r) => roles.find((x) => x.role_id === r.role_id)?.expect?.closed_gate);
    const gateFailedAsExpected = gateRoles.every((r) => r.checks.some((c) => !c.ok));
    verdict = gateFailedAsExpected
      ? 'BREAK-CAUGHT (buggy scorer failed gate checks — harness did its job)'
      : 'BREAK-MISSED (buggy scorer still passed gate checks — harness too weak)';
    exitCode = gateFailedAsExpected ? 0 : 1;
  }

  const when = new Date().toISOString().slice(0, 10);
  const meta = {
    when,
    mode,
    breakAttempt,
    fixture: path.relative(ROOT, fixture),
    passCount,
    failCount,
    verdict,
    check_total: allChecks.length,
  };

  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, breakAttempt ? 'gate-behavior-break.json' : 'gate-behavior-results.json');
  const mdPath = path.join(outDir, breakAttempt ? 'gate-behavior-break-audit.md' : 'gate-behavior-audit.md');

  const payload = {
    _harness: 'gate-behavior',
    _chapters: [11, 16],
    generated: when,
    mode,
    break_attempt: breakAttempt,
    fixture: meta.fixture,
    gate_zero: GATE_ZERO,
    weights: WEIGHTS,
    verdict,
    pass_count: passCount,
    fail_count: failCount,
    check_total: allChecks.length,
    results: results.map((r) => ({
      role_id: r.role_id,
      scored: r.scored,
      checks: r.checks,
    })),
  };

  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
  fs.writeFileSync(mdPath, renderAudit(meta, results));

  console.log(`Gate-behavior harness — ${mode}`);
  console.log(`  fixture: ${meta.fixture}`);
  console.log(`  checks: ${passCount} PASS / ${failCount} FAIL (of ${allChecks.length})`);
  console.log(`  verdict: ${verdict}`);
  for (const r of results) {
    const bad = r.checks.filter((c) => !c.ok);
    const mark = bad.length ? '✗' : '✓';
    console.log(`  ${mark} ${r.scored.role_id} → ${r.scored.recommendation} (${r.scored.composite})`);
    for (const b of bad) console.log(`      ! ${b.msg}`);
  }
  console.log(`  wrote ${path.relative(ROOT, jsonPath)}`);
  console.log(`  wrote ${path.relative(ROOT, mdPath)}`);

  process.exit(exitCode);
}

main();
