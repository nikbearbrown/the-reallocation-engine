#!/usr/bin/env node
// opt-countdown.mjs — computed visa-timeline gate for a year-1 OPT student.
// Recipe: recipes/cases/2026fa/revan1010-opt-countdown.md
//
// Reads a persona profile (dates + unemployment days) and a roles file shaped
// like data/examples/ch11-roles.json, replaces each role's hand-typed
// `timeline.factor` with one computed from the profile, then runs the EXISTING
// scorer (scripts/score/role-scorer.mjs) on the result. The scorer exports
// nothing and runs main() on import, so it is invoked as a CLI, never copied.
//
// Every value written is labeled record / model-judgment / your-input.
// Nothing here touches the network.
//
//   node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs \
//     --profile search/examples/priya-nair/profile.yml \
//     --roles data/examples/ch11-roles.json \
//     --as-of 2026-10-02 --lag-days 56 \
//     --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown \
//     --confirmed-by "<name>"
//
// Exit codes: 0 ok · 2 invalid input (gate G0) · 3 stopped at G-A · 4 scorer failed

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const RECIPE = 'revan1010-opt-countdown';
const RECIPE_VERSION = '0.1.0';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');
const SRC = { record: 'record', model: 'model-judgment', input: 'your-input' };
const DAY = 86400000;

export class InputError extends Error {
  constructor(code, message) { super(`[${code}] ${message}`); this.code = code; }
}

// ── dates (UTC, whole days) ────────────────────────────────────────────────
function toDate(v, field) {
  if (v instanceof Date && !isNaN(v)) return new Date(Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), v.getUTCDate()));
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(`${v}T00:00:00Z`);
    if (!isNaN(d)) return d;
  }
  throw new InputError('F-2', `${field} is not a YYYY-MM-DD date: ${JSON.stringify(v)}`);
}
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(+d + n * DAY);
const daysBetween = (a, b) => Math.round((b - a) / DAY);

// ── G0: inputs valid (F-1 missing, F-2 wrong, F-4 no time frame) ──────────
export function readInputs({ profileDoc, asOf, lagDays }) {
  const visa = profileDoc?.visa;
  if (!visa || typeof visa !== 'object') throw new InputError('F-1', 'profile has no `visa:` section');
  for (const f of ['opt_end_date', 'unemployment_days_used', 'unemployment_ceiling', 'buffer_target']) {
    if (visa[f] === undefined || visa[f] === null || visa[f] === '')
      throw new InputError('F-1', `profile is missing visa.${f}`);
  }
  if (asOf === undefined) throw new InputError('F-1', '--as-of is required (the date the run treats as today)');
  if (lagDays === undefined) throw new InputError('F-4', '--lag-days is required; refusing to default it (the scorer would treat a missing timeline as 1)');

  const lag = Number(lagDays);
  if (!Number.isInteger(lag) || lag <= 0) throw new InputError('F-4', `--lag-days must be a whole number > 0, got ${JSON.stringify(lagDays)}`);
  const asOfDate = toDate(asOf, '--as-of');
  const optEnd = toDate(visa.opt_end_date, 'visa.opt_end_date');
  const used = visa.unemployment_days_used, ceiling = visa.unemployment_ceiling, buffer = visa.buffer_target;
  for (const [k, v] of [['unemployment_days_used', used], ['unemployment_ceiling', ceiling], ['buffer_target', buffer]])
    if (!Number.isInteger(v) || v < 0) throw new InputError('F-2', `visa.${k} must be a whole number >= 0, got ${JSON.stringify(v)}`);
  if (used > ceiling) throw new InputError('F-2', `visa.unemployment_days_used (${used}) is above visa.unemployment_ceiling (${ceiling})`);
  if (optEnd <= asOfDate) throw new InputError('F-2', `visa.opt_end_date ${iso(optEnd)} is not after --as-of ${iso(asOfDate)}`);

  return {
    as_of:   { value: iso(asOfDate), source: SRC.input },
    lag_days:{ value: lag,           source: SRC.input },
    opt_end: { value: iso(optEnd),   source: SRC.record },
    used:    { value: used,          source: SRC.record },
    ceiling: { value: ceiling,       source: SRC.record },
    buffer:  { value: buffer,        source: SRC.record },
  };
}

// ── the formula (recipe §"The formula") ─────────────────────────────────────
export function computeTimeline(inputs, gateZero = 0) {
  const asOf = toDate(inputs.as_of.value, 'as_of');
  const optEnd = toDate(inputs.opt_end.value, 'opt_end');
  const expectedStart = addDays(asOf, inputs.lag_days.value);
  const daysOut = addDays(asOf, inputs.ceiling.value - inputs.used.value);
  const hard = optEnd < daysOut ? optEnd : daysOut;
  const safe = addDays(hard, -inputs.buffer.value);

  let factor;
  if (expectedStart >= hard) factor = 0;
  else if (expectedStart <= safe) factor = 1;
  else factor = daysBetween(expectedStart, hard) / daysBetween(safe, hard);

  // largest whole-day lag whose factor is still above `gateZero`
  const toHard = daysBetween(asOf, hard), span = daysBetween(safe, hard);
  const maxLagAbove = Math.ceil(toHard - gateZero * span) - 1;

  return {
    factor: Number(factor.toFixed(4)),
    source: SRC.input,
    dates: {
      expected_start: iso(expectedStart),
      days_out_date: iso(daysOut),
      hard_deadline: iso(hard),
      safe_deadline: iso(safe),
      binding: optEnd < daysOut ? 'opt_end' : 'unemployment',
    },
    break_even: {
      gate_zero: gateZero,
      max_lag_for_factor_above_gate_zero: Math.max(0, maxLagAbove),
      max_lag_for_factor_1: Math.max(0, daysBetween(asOf, safe)),
    },
  };
}

// ── scorer (existing CLI, unchanged) ───────────────────────────────────────
function runScorer(rolesPath, outDir) {
  const args = [SCORER, rolesPath, '--out-dir', outDir];
  const r = spawnSync(process.execPath, args, { cwd: REPO, encoding: 'utf8' });
  const command = `node ${path.relative(REPO, SCORER)} ${path.relative(REPO, rolesPath)} --out-dir ${path.relative(REPO, outDir)}`;
  if (r.status !== 0) throw Object.assign(new Error(`scorer exited ${r.status}: ${(r.stderr || '').trim()}`), { exitCode: 4, command });
  const scored = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8'));
  return { command, exit_code: r.status, stdout: r.stdout.trim(), scored };
}

// ── human report ───────────────────────────────────────────────────────────
function renderReport(log) {
  const { inputs: i, timeline: t, roles, gates, counts } = log;
  const o = [];
  o.push(`# opt-countdown report — ${i.as_of.value}`, '');
  o.push('## Summary', '');
  o.push(`If a job hired in **${i.lag_days.value} days** (an assumption, the same for every job), the student would start on **${t.dates.expected_start}**. ` +
    `Their real deadline is **${t.dates.hard_deadline}**, set by ${t.dates.binding === 'unemployment' ? 'running out of allowed unemployment days' : 'the OPT end date'}. ` +
    `That gives every job a timeline number of **${t.factor}**.`);
  o.push('', `Result: ${counts.total} jobs → Apply ${counts.Apply} · Consider ${counts.Consider} · Skip ${counts.Skip}. ` +
    `Before this run (hand-typed timeline) it was Apply ${counts.before.Apply} · Consider ${counts.before.Consider} · Skip ${counts.before.Skip}.`);
  o.push('', `A job would need to start within **${t.break_even.max_lag_for_factor_above_gate_zero} days** to stay above the scorer's closed-gate line (${t.break_even.gate_zero}), ` +
    `and within **${t.break_even.max_lag_for_factor_1} days** to have no timeline penalty at all.`);
  o.push('', '> **Not legal advice.** Whether the last allowed day counts, STEM extension eligibility, H-1B timing and cap-gap are questions for your DSO. This report does not answer them.');

  o.push('', '## Inputs (gate G-A)', '', '| Input | Value | Source |', '|---|---|---|');
  for (const [k, v] of Object.entries(i)) o.push(`| ${k} | ${v.value} | ${v.source} |`);
  o.push('', `Cleared by: **${gates['G-A'].cleared_by}**. Check these against the real documents before trusting anything below.`);

  o.push('', '## Dates', '', '| Date | Value |', '|---|---|');
  for (const [k, v] of Object.entries(t.dates)) o.push(`| ${k} | ${v} |`);

  o.push('', '## Jobs, before and after', '', '| Job | Timeline before | Timeline after | Decision before | Decision after | Scorer reason |', '|---|---|---|---|---|---|');
  for (const r of roles)
    o.push(`| ${r.company} — ${r.title} | ${r.timeline_before ?? '—'} (${r.timeline_before_source ?? '—'}) | ${r.timeline_after} (${r.timeline_source}) | ${r.decision_before} | **${r.decision_after}**${r.override ? ' ⟵ human override' : ''} | ${r.reason} |`);

  o.push('', '## Waiting for a human', '');
  o.push(`**G-B: liveness unclear (${gates['G-B'].pending.length})**`);
  o.push(...(gates['G-B'].pending.length ? gates['G-B'].pending.map((p) => `- ${p.role_id}: ${p.why}. Open the posting or run \`npm run ats:liveness -- <url>\`.`) : ['- none']));
  o.push('', `**G-C: timeline closed the gate (${gates['G-C'].pending.length})**: recheck the dates above before dropping any of these.`);
  o.push(...(gates['G-C'].pending.length ? gates['G-C'].pending.map((p) => `- ${p.role_id}: factor ${p.factor} (start ${p.dates.expected_start} vs deadline ${p.dates.hard_deadline})${p.note ? `. ${p.note}` : ''}`) : ['- none']));

  o.push('', '## Labels', '', '- **record**: read from a file (persona profile, roles file). The persona and the sample jobs are fictional/illustrative.',
    '- **your-input**: an assumption made for this run (as-of date, hiring time, and the timeline number computed from them).',
    '- **model-judgment**: fit scores, passed through from the roles file untouched.');
  return o.join('\n') + '\n';
}

// ── run ─────────────────────────────────────────────────────────────────────
export function run(argv) {
  let a;
  try {
    ({ values: a } = parseArgs({
      args: argv,
      options: {
        profile: { type: 'string' }, roles: { type: 'string' }, 'as-of': { type: 'string' },
        'lag-days': { type: 'string' }, 'out-dir': { type: 'string' }, 'confirmed-by': { type: 'string' },
      },
    }));
  } catch (e) {
    // e.g. `--lag-days -5` reads as a missing value; report it as an input error, exit 2
    throw new InputError('F-1', `bad arguments: ${e.message.split('\n')[0]} (pass negative numbers as --lag-days=-5)`);
  }
  for (const f of ['profile', 'roles', 'out-dir'])
    if (!a[f]) throw new InputError('F-1', `--${f} is required`);
  for (const f of ['profile', 'roles'])
    if (!fs.existsSync(a[f])) throw new InputError('F-1', `--${f} file not found: ${a[f]}`);
  const outDir = path.resolve(a['out-dir']);
  if (outDir === path.resolve(path.dirname(a.roles)))
    throw new InputError('F-1', '--out-dir must differ from the roles file folder (the scorer would overwrite tracked example output)');

  // G0
  const inputs = readInputs({ profileDoc: yaml.load(fs.readFileSync(a.profile, 'utf8')), asOf: a['as-of'], lagDays: a['lag-days'] });
  let roles;
  try { roles = JSON.parse(fs.readFileSync(a.roles, 'utf8')); } catch (e) { throw new InputError('F-1', `--roles does not parse as JSON: ${e.message}`); }
  if (!Array.isArray(roles) || roles.length === 0) throw new InputError('F-1', '--roles must be a non-empty JSON array');

  // G-A: echo, and stop unless a named human confirmed
  console.log('opt-countdown inputs (gate G-A):');
  for (const [k, v] of Object.entries(inputs)) console.log(`  ${k.padEnd(9)} ${String(v.value).padEnd(11)} [${v.source}]`);
  if (!a['confirmed-by'] || !a['confirmed-by'].trim()) {
    console.log('\nStopped at G-A: check the values above against the real documents, then rerun with --confirmed-by "<name>".');
    return 3;
  }

  // before: the roles file as-is (hand-typed timeline), scored into a subfolder
  const beforeDir = path.join(outDir, 'before');
  fs.mkdirSync(beforeDir, { recursive: true });
  const before = runScorer(path.resolve(a.roles), beforeDir);
  const gateZero = before.scored.config.gate_zero; // read from the scorer's own output

  // after: same roles, timeline computed
  const timeline = computeTimeline(inputs, gateZero);
  const rolesAfter = roles.map((r) => ({ ...r, timeline: { factor: timeline.factor, source: timeline.source, dates: timeline.dates } }));
  if (rolesAfter.some((r) => typeof r.timeline?.factor !== 'number')) throw new Error('internal: a role left without a timeline');
  const rolesOut = path.join(outDir, 'roles-with-timeline.json');
  fs.writeFileSync(rolesOut, JSON.stringify(rolesAfter, null, 2) + '\n');
  const after = runScorer(rolesOut, outDir);

  const beforeById = new Map(before.scored.roles.map((s) => [s.role_id, s]));
  const rows = roles.map((r, idx) => {
    const s = after.scored.roles[idx], b = beforeById.get(r.role_id);
    const scorerTimeline = s.trace.gates.find((g) => g.factor === 'timeline');
    return {
      role_id: r.role_id, company: r.company, title: r.title,
      timeline_before: r.timeline?.factor ?? null, timeline_before_source: r.timeline?.source ?? null,
      timeline_after: timeline.factor, timeline_source: timeline.source,
      scorer_saw_timeline: scorerTimeline?.multiplier ?? null,
      liveness: r.liveness?.factor ?? null, liveness_source: r.liveness?.source ?? null,
      decision_before: b?.recommendation ?? null, decision_after: s.recommendation,
      machine_decision_after: s.machine_recommendation, override: s.override ?? null, reason: s.reason,
    };
  });

  const gates = {
    'G-A': { cleared_by: a['confirmed-by'].trim() },
    'G-B': { pending: rows.filter((r) => r.liveness !== 0 && r.liveness !== 1).map((r) => ({ role_id: r.role_id, why: r.liveness == null ? 'no liveness value' : `liveness ${r.liveness} is neither 0 nor 1` })) },
    'G-C': { pending: rows.filter((r) => r.timeline_after <= gateZero).map((r) => ({
      role_id: r.role_id, factor: r.timeline_after, dates: timeline.dates,
      note: r.override && r.decision_after !== 'Skip' ? `the roles file carries a human override, so the scorer still says ${r.decision_after} although the timeline gate is closed` : null,
    })) },
    'G-D': { note: 'not legal advice; STEM eligibility and last-day legality are DSO questions; stem_eligible is not read' },
  };
  const tally = (list, key) => Object.fromEntries(['Apply', 'Consider', 'Skip'].map((d) => [d, list.filter((x) => x[key] === d).length]));
  const counts = { total: rows.length, ...tally(rows, 'decision_after'), before: tally(rows, 'decision_before') };

  const log = {
    recipe: RECIPE, recipe_version: RECIPE_VERSION, run_at: new Date().toISOString(),
    profile_path: path.relative(REPO, path.resolve(a.profile)), roles_path: path.relative(REPO, path.resolve(a.roles)),
    inputs, timeline, roles: rows, gates, counts,
    scorer: {
      before: { command: before.command, exit_code: before.exit_code, out: path.relative(REPO, path.join(beforeDir, 'role-scores.json')) },
      after: { command: after.command, exit_code: after.exit_code, out: path.relative(REPO, path.join(outDir, 'role-scores.json')) },
      note: 'scorer run without --profile, so it assumes the candidate needs sponsorship (matches priya-nair needs_sponsorship: true)',
    },
  };
  fs.writeFileSync(path.join(outDir, 'opt-countdown-log.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'opt-countdown-report.md'), renderReport(log));

  console.log(`\ntimeline factor ${timeline.factor} [${timeline.source}] · start ${timeline.dates.expected_start} vs deadline ${timeline.dates.hard_deadline} (${timeline.dates.binding})`);
  console.log(`before: Apply ${counts.before.Apply} · Consider ${counts.before.Consider} · Skip ${counts.before.Skip}`);
  console.log(`after:  Apply ${counts.Apply} · Consider ${counts.Consider} · Skip ${counts.Skip}`);
  console.log(`pending human review: G-B ${gates['G-B'].pending.length} · G-C ${gates['G-C'].pending.length}`);
  console.log(`wrote ${path.relative(REPO, outDir)}/{opt-countdown-log.json, opt-countdown-report.md, roles-with-timeline.json, role-scores.json, role-scores.md, before/}`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = run(process.argv.slice(2));
  } catch (e) {
    console.error(`opt-countdown: ${e.message}`);
    process.exitCode = e instanceof InputError ? 2 : (e.exitCode ?? 1);
  }
}
