#!/usr/bin/env node
// break-test.mjs — deliberate break attempts. For each fixtures/BROKEN-*.json mutation: make a
// temporary git worktree of HEAD, apply the one-line mutation (must match exactly once), run the
// offline suite and the real-sample replay inside it, report, and remove the worktree. Production
// files in your checkout are never modified.
//   node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs [BROKEN-name ...]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const NS = path.relative(REPO, HERE);
const want = process.argv.slice(2);
const specs = fs.readdirSync(path.join(HERE, 'fixtures')).filter((f) => /^BROKEN-.*\.json$/.test(f) && (!want.length || want.some((w) => f.includes(w))));
let allCaught = true;
for (const f of specs) {
  const spec = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures', f), 'utf8'));
  // Worktrees go under gitignored private/ — NOT the system temp dir, which the mode's output guard
  // allows (a worktree there made the output-guard test fail for every mutant: run 1, evidence 10).
  const base = path.join(REPO, 'private', 'a2-break'); fs.mkdirSync(base, { recursive: true });
  const wt = fs.mkdtempSync(path.join(base, 'wt-'));
  execFileSync('git', ['worktree', 'add', '--detach', '-q', wt, 'HEAD'], { cwd: REPO });
  const head = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: wt, encoding: 'utf8' }).trim();
  try {
    fs.symlinkSync(path.join(REPO, 'node_modules'), path.join(wt, 'node_modules'));
    const target = path.join(wt, spec.file); const src = fs.readFileSync(target, 'utf8');
    const hits = src.split(spec.find).length - 1;
    if (hits !== 1) throw new Error(`${f}: mutation anchor found ${hits} times (must be exactly 1)`);
    fs.writeFileSync(target, src.replace(spec.find, spec.replace));
    const t = spawnSync(process.execPath, ['--test', path.join(NS, 'triage.test.mjs'), path.join(NS, 'regression-v04.test.mjs')], { cwd: wt, encoding: 'utf8' });
    const failing = [...t.stdout.matchAll(/^not ok \d+ - (.*)$/gm)].map((m) => m[1]);
    const tot = t.stdout.match(/^# tests (\d+)/m)?.[1]; const pass = t.stdout.match(/^# pass (\d+)/m)?.[1];
    const out = path.join(os.tmpdir(), `a2-break-out-${path.basename(wt)}`);
    spawnSync(process.execPath, [path.join(NS, 'triage.mjs'), 'run', '--input', 'course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json', '--candidate', path.join(NS, 'config/candidate.tariq-lindqvist.json'), '--out-dir', out], { cwd: wt, encoding: 'utf8' });
    const expected = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures/real-sample-expected-v0.4.1.json'), 'utf8')).decisions;
    const got = JSON.parse(fs.readFileSync(path.join(out, 'triage.json'), 'utf8')).roles;
    const changed = got.filter((r) => r.next_action !== expected[r.obs_id]).map((r) => `${r.obs_id}: ${expected[r.obs_id]} → ${r.next_action}`);
    const caught = t.status !== 0;
    allCaught &&= caught;
    console.log(`\n=== ${f} (HEAD ${head}) — protects: ${spec.protects}`);
    console.log(`mutation: ${spec.file}\n  - ${spec.find.trim()}\n  + ${spec.replace.trim()}`);
    console.log(`suite on mutant: exit ${t.status} · ${pass}/${tot} pass · ${failing.length} failing → ${caught ? 'CAUGHT' : 'NOT CAUGHT'}`);
    for (const n of failing) console.log(`  not ok: ${n}`);
    console.log(`real-sample decisions changed by the mutant: ${changed.length}/${got.length}`);
    for (const c of changed) console.log(`  ${c}`);
    fs.rmSync(out, { recursive: true, force: true });
  } finally {
    execFileSync('git', ['worktree', 'remove', '--force', wt], { cwd: REPO });
  }
}
console.log(`\n${allCaught ? 'ALL MUTANTS CAUGHT' : 'AT LEAST ONE MUTANT SURVIVED'} (${specs.length} mutant${specs.length === 1 ? '' : 's'})`);
process.exit(allCaught ? 0 : 1);
