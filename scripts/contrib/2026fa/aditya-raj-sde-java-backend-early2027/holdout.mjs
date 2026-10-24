#!/usr/bin/env node
// holdout.mjs — unseen-posting selection per course/2026fa/submissions/aditya-raj-sde/assignment-2/HOLDOUT-PROTOCOL.md.
//   select    node holdout.mjs select --private-dir private/a2/holdout --public-dir <tracked dir>   (network: fresh feed check)
//   finalize  node holdout.mjs finalize --observations <tracked observations.json> --selection <tracked holdout selection.json>
// Reuses collect.mjs selectFromBoard (the original protocol's cohort rule and order) and the
// maintained greenhouse-watch fetcher. Raw responses stay in private/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { selectFromBoard } from './collect.mjs';
import { plainText } from './text.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SUB = 'course/2026fa/submissions/aditya-raj-sde/assignment-2';
const WATCH = '.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py';
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const arg = (a, f) => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : undefined; };
const norm = (t) => String(t).toLowerCase().replace(/\s+/g, ' ').trim();

export function seenIds() {
  // every job id present in any development artifact (excluding raw captures / watch state)
  const files = [];
  const walk = (d) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!/\/(capture|state|holdout)$/.test(p)) walk(p); } else files.push(p); } };
  walk(path.join(REPO, SUB)); walk(path.join(REPO, 'private/a2'));
  return files.filter((f) => !/HOLDOUT|holdout/.test(f)).map((f) => fs.readFileSync(f, 'utf8'));
}

function select(args) {
  const privDir = path.resolve(arg(args, '--private-dir')); const pubDir = path.resolve(arg(args, '--public-dir'));
  if (!privDir.startsWith(path.join(REPO, 'private') + path.sep)) throw new Error('--private-dir must be under private/');
  const sel = JSON.parse(fs.readFileSync(path.join(REPO, SUB, 'real-sample/selection.json'), 'utf8'));
  const orig = new Set(sel.selected.map((s) => s.job_id));
  const origTitles = new Set(sel.selected.map((s) => `${s.board_slug}|${norm(s.title)}`));
  const hay = seenIds();
  const boards = []; const postings = [];
  for (const b of sel.boards) {
    const rawText = fs.readFileSync(path.join(REPO, b.raw_file), 'utf8');
    if (sha256(rawText) !== b.raw_sha256) throw new Error(`raw capture changed: ${b.raw_file}`);
    const raw = JSON.parse(rawText);
    const s = selectFromBoard(raw.jobs || [], 10_000);
    const walked = []; const picked = [];
    for (const [pos, c] of s.unique.entries()) {
      const id = String(c.job.id);
      if (orig.has(id)) { walked.push({ position: pos + 1, id, outcome: 'original-12' }); continue; }
      if (picked.length >= 2) break;
      if (hay.some((t) => t.includes(id))) { walked.push({ position: pos + 1, id, title: c.job.title, outcome: 'excluded: id appears in a development artifact' }); continue; }
      if (origTitles.has(`${b.slug}|${norm(c.job.title)}`)) { walked.push({ position: pos + 1, id, title: c.job.title, outcome: 'excluded: same title as an original posting (possible duplicate role)' }); continue; }
      walked.push({ position: pos + 1, id, title: c.job.title, outcome: 'selected' });
      picked.push({ c, position: pos + 1 });
    }
    // fresh feed observation (network) with the maintained fetcher
    const capDir = path.join(privDir, 'capture', b.slug); const statePath = path.join(privDir, 'state', `${b.slug}.json`);
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    const before = new Set(fs.existsSync(capDir) ? fs.readdirSync(capDir) : []);
    const observedAt = new Date().toISOString();
    let fresh = null; let fetchError = null;
    try {
      execFileSync('python3', [WATCH, '--board', b.slug, '--resume', 'search/examples/tariq-lindqvist/resume.example.json', '--state', statePath, '--out', capDir], { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      const f = fs.readdirSync(capDir).find((x) => x.startsWith('raw-') && !before.has(x));
      fresh = JSON.parse(fs.readFileSync(path.join(capDir, f), 'utf8'));
    } catch (e) { fetchError = String(e.stderr || e.message).slice(0, 200); }
    const freshById = new Map((fresh?.jobs || []).map((j) => [String(j.id), j]));
    boards.push({ slug: b.slug, employer: b.company_name, unique_cohort: s.unique.length, walked, fresh_feed_observed_at: observedAt, fresh_feed_error: fetchError, selected: picked.length });
    for (const { c, position } of picked) {
      const fj = freshById.get(String(c.job.id));
      postings.push({
        employer: b.company_name, board_name: b.board_name, board_slug: b.slug, job_id: String(c.job.id), title: c.job.title, location: c.job.location?.name ?? null, url: c.job.absolute_url ?? null,
        first_published: c.job.first_published ?? null, updated_at: c.job.updated_at ?? null, captured_at: b.captured_at, protocol_position: position,
        present_in_board_api: fetchError ? null : Boolean(fj), feed_observed_at: observedAt,
        fresh_content_changed: fj ? sha256(plainText(fj.content || '')) !== sha256(c.text) : null,
        text_sha256: sha256(c.text), text: c.text,
      });
    }
  }
  const run = { protocol: `${SUB}/HOLDOUT-PROTOCOL.md`, rules_frozen_at: '49100364213f4f07ab2a602906fdd3e01dad12bf', command: `node ${path.relative(REPO, fileURLToPath(import.meta.url))} select ${args.join(' ')}`, started_at: new Date().toISOString(), postings_selected: postings.length };
  fs.mkdirSync(privDir, { recursive: true }); fs.mkdirSync(pubDir, { recursive: true });
  fs.writeFileSync(path.join(privDir, 'collection.json'), JSON.stringify({ run, postings }, null, 2) + '\n');
  fs.writeFileSync(path.join(pubDir, 'selection.json'), JSON.stringify({ run, boards, selected: postings.map(({ text, ...r }) => r) }, null, 2) + '\n');
  console.log(`holdout: ${postings.length} postings selected (${boards.map((b) => `${b.slug} ${b.selected}`).join(' · ')})`);
}

// The original extract labels the feed observation with the capture time; for the holdout the feed
// presence comes from the FRESH fetch, so its time and evidence are corrected here (no rule code touched).
function finalize(args) {
  const obsPath = path.resolve(arg(args, '--observations')); const selPath = path.resolve(arg(args, '--selection'));
  const doc = JSON.parse(fs.readFileSync(obsPath, 'utf8')); const sel = JSON.parse(fs.readFileSync(selPath, 'utf8'));
  const byId = new Map(sel.selected.map((s) => [s.job_id, s]));
  for (const o of doc.observations) {
    const s = byId.get(o.job_id);
    o.feed = { present: s.present_in_board_api, observed_at: s.feed_observed_at, source: 'record', evidence: path.relative(REPO, selPath), note: 'fresh board fetch at evaluation time; posting text is from the 2026-10-21 00:01 capture' };
    o.fresh_content_changed = s.fresh_content_changed; o.protocol_position = s.protocol_position;
  }
  doc.run_label = 'UNSEEN postings (holdout), rules v0.4.0 frozen';
  doc.kind = doc.kind.replace('replay-of-captured-excerpts', 'holdout-replay-of-captured-excerpts');
  fs.writeFileSync(obsPath, JSON.stringify(doc, null, 2) + '\n');
  console.log(`finalized ${doc.observations.length} holdout observations`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === 'select') select(args); else if (cmd === 'finalize') finalize(args); else { console.error('usage: holdout.mjs select|finalize …'); process.exit(2); }
}
