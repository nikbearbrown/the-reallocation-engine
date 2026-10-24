#!/usr/bin/env node
// collect.mjs — live collection for the real-posting sample, implementing
//   course/2026fa/submissions/aditya-raj-sde/assignment-2/SAMPLE-PROTOCOL.md
// This is the ONLY network-touching script in this contribution (SNICKERDOODLE P2: ingest only).
//
//   node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/collect.mjs \
//     --private-dir private/a2 --public-dir <tracked dir> [--max-probes 400] [--need 3] [--per-board 4]
//
// Reuses, never copies:
//   - Assignment 1 reality-check.mjs: companyKey(), loadSponsorCsv() — employer order + identity check
//   - scripts/ats/providers/_http.mjs: fetchJson() with redirect:'error' — board metadata probe
//   - .claude/skills/greenhouse-watch/scripts/greenhouse_watch.py — the board capture (full content,
//     host allow-listed, raw response saved untouched)
//
// Writes: <private-dir>/capture/<slug>/raw-*.json (by greenhouse-watch), <private-dir>/collection.json
// (selected postings WITH full text — private), and <public-dir>/probe-log.json +
// <public-dir>/selection.json (no posting text). Exit 0 = ran (even if <12 found) · 2 = usage error.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { companyKey, loadSponsorCsv } from '../aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs';
import { fetchJson } from '../../../ats/providers/_http.mjs';
import { plainText } from './text.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const WATCH = '.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py';
const PERSONA_RESUME = 'search/examples/tariq-lindqvist/resume.example.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ── cohort rule (SAMPLE-PROTOCOL.md §Cohort rule) ──────────────────────────
export const TITLE_INCLUDE = /\b(software|backend|back-end|back end|platform|infrastructure|distributed|server|api|java|systems)\b/i;
export const TITLE_EXCLUDE = /\b(intern|internship|co-?op|apprentice|new grad|graduate|university|early career|manager|director|head of|vp|vice president)\b/i;
export const JAVA = [/\bjava\b(?![\s-]*script)/i, /\bjvm\b/i, /\bspring\s+boot\b/i];
const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'];
const STATE_NAMES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
const US_WORDS = /\b(United States|USA)\b|\bU\.S\.|\bUS\b/;
const US_STATE_CODE = new RegExp(`,\\s*(${STATES.join('|')})\\b`);
const US_STATE_NAME = new RegExp(`\\b(${STATE_NAMES.join('|')})\\b`);

export function isUS(location) {
  const l = String(location || '');
  return US_WORDS.test(l) || US_STATE_CODE.test(l) || US_STATE_NAME.test(l);
}

export function cohortVerdict(job) {
  const title = String(job.title || '');
  const text = plainText(job.content || '');
  if (!/\bengineer\b/i.test(title) || !TITLE_INCLUDE.test(title)) return { ok: false, reason: 'title-not-in-scope', text };
  if (TITLE_EXCLUDE.test(title)) return { ok: false, reason: 'title-excluded', text };
  if (!isUS(job.location?.name)) return { ok: false, reason: 'not-us-location', text };
  if (!JAVA.some((re) => re.test(text))) return { ok: false, reason: 'no-java-mention', text };
  return { ok: true, reason: 'in-cohort', text };
}

export function selectFromBoard(jobs, perBoard) {
  const tally = { total: jobs.length, 'title-not-in-scope': 0, 'title-excluded': 0, 'not-us-location': 0, 'no-java-mention': 0, 'in-cohort': 0, duplicates: 0 };
  const cohort = [];
  for (const j of jobs) {
    const v = cohortVerdict(j);
    tally[v.reason]++;
    if (v.ok) cohort.push({ job: j, text: v.text });
  }
  cohort.sort((a, b) => String(b.job.first_published || '').localeCompare(String(a.job.first_published || '')) || Number(a.job.id) - Number(b.job.id));
  const seenIds = new Set(); const seenSig = new Map(); const unique = []; const duplicates = [];
  for (const c of cohort) {
    const id = String(c.job.id);
    const sig = `${c.job.title.toLowerCase().replace(/\s+/g, ' ').trim()}|${sha256(c.text.replace(/\s+/g, ' ').trim())}`;
    if (seenIds.has(id)) { duplicates.push({ id, title: c.job.title, duplicate_of: id, rule: 'same job id' }); continue; }
    if (seenSig.has(sig)) { duplicates.push({ id, title: c.job.title, location: c.job.location?.name, duplicate_of: seenSig.get(sig), rule: 'same title + same description hash' }); continue; }
    seenIds.add(id); seenSig.set(sig, id); unique.push(c);
  }
  tally.duplicates = duplicates.length;
  tally.unique_cohort = unique.length;
  return { tally, unique, duplicates, selected: unique.slice(0, perBoard), qualifies: unique.length >= perBoard };
}

// ── employer order (SAMPLE-PROTOCOL.md §Employer order) ─────────────────────
export function employerOrder(csv) {
  const rows = csv.rows.filter((r) => /^\d+(\.\d+)?$/.test(r.approvals) && Number(r.approvals) > 0)
    .sort((a, b) => Number(b.approvals) - Number(a.approvals) || a.company_name.localeCompare(b.company_name));
  const seen = new Set(); const out = [];
  for (const r of rows) {
    const key = companyKey(r.company_name);
    if (seen.has(key)) continue; seen.add(key);
    out.push({ company_name: r.company_name, approvals: Number(r.approvals), key, slug: key.replace(/\s+/g, '') });
  }
  return out;
}

function arg(args, flag, dflt) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : dflt; }

async function main() {
  const args = process.argv.slice(2);
  const privDir = arg(args, '--private-dir'); const pubDir = arg(args, '--public-dir');
  if (!privDir || !pubDir) { console.error('usage: collect.mjs --private-dir private/<x> --public-dir <dir> [--max-probes 400] [--need 3] [--per-board 4]'); process.exit(2); }
  if (!path.resolve(privDir).startsWith(path.join(REPO, 'private') + path.sep)) { console.error('--private-dir must be inside private/ (gitignored): raw postings are never committed'); process.exit(2); }
  const maxProbes = Number(arg(args, '--max-probes', 400)); const need = Number(arg(args, '--need', 3)); const perBoard = Number(arg(args, '--per-board', 4));
  fs.mkdirSync(privDir, { recursive: true }); fs.mkdirSync(pubDir, { recursive: true });

  const csv = loadSponsorCsv();
  const order = employerOrder(csv);
  const started = new Date().toISOString();
  const probes = []; const boards = []; const postings = [];
  for (let rank = 0; rank < order.length && probes.length < maxProbes && boards.filter((b) => b.qualifies).length < need; rank++) {
    const e = order[rank];
    const p = { rank: rank + 1, company_name: e.company_name, total_approvals: e.approvals, slug: e.slug, probed_at: new Date().toISOString() };
    probes.push(p);
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(e.slug)) { p.outcome = 'slug-invalid'; continue; }
    try {
      const meta = await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${e.slug}`, { redirect: 'error', timeoutMs: 15000 });
      p.http = 200; p.board_name = meta?.name ?? null;
      if (companyKey(p.board_name || '') !== e.key) { p.outcome = 'board-name-mismatch'; }
      else p.outcome = 'board-verified';
    } catch (err) {
      p.http = err.status ?? null;
      p.outcome = err.status === 404 ? 'no-board-at-guessed-slug' : 'probe-failed';
      if (p.outcome === 'probe-failed') p.error = String(err.message).slice(0, 160);
    }
    await sleep(250);
    if (p.outcome !== 'board-verified') continue;

    // capture with the maintained greenhouse-watch fetcher
    const capDir = path.join(privDir, 'capture', e.slug);
    const statePath = path.join(privDir, 'state', `${e.slug}.json`);
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    const before = new Set(fs.existsSync(capDir) ? fs.readdirSync(capDir) : []);
    const capturedAt = new Date().toISOString();
    let watchOut = '';
    try {
      watchOut = execFileSync('python3', [WATCH, '--board', e.slug, '--resume', PERSONA_RESUME, '--state', statePath, '--out', capDir], { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      boards.push({ ...p, capture: 'failed', capture_error: String(err.stderr || err.message).slice(0, 200), qualifies: false });
      continue;
    }
    const rawFile = fs.readdirSync(capDir).find((f) => f.startsWith('raw-') && !before.has(f));
    const raw = JSON.parse(fs.readFileSync(path.join(capDir, rawFile), 'utf8'));
    const sel = selectFromBoard(raw.jobs || [], perBoard);
    const b = { rank: p.rank, company_name: e.company_name, slug: e.slug, board_name: p.board_name, captured_at: capturedAt, raw_file: path.relative(REPO, path.join(capDir, rawFile)), raw_sha256: sha256(fs.readFileSync(path.join(capDir, rawFile), 'utf8')), watch_stdout_tail: watchOut.trim().split('\n').slice(-2).join(' | '), tally: sel.tally, duplicates: sel.duplicates, qualifies: sel.qualifies, outcome: sel.qualifies ? 'qualifies' : 'insufficient-cohort', selected_ids: sel.qualifies ? sel.selected.map((c) => String(c.job.id)) : [] };
    boards.push(b);
    if (sel.qualifies) {
      for (const c of sel.selected) {
        postings.push({
          employer: e.company_name, board_name: p.board_name, board_slug: e.slug, job_id: String(c.job.id), title: c.job.title,
          location: c.job.location?.name ?? null, url: c.job.absolute_url ?? null, first_published: c.job.first_published ?? null, updated_at: c.job.updated_at ?? null,
          captured_at: capturedAt, present_in_board_api: true, text_sha256: sha256(c.text), text: c.text,
        });
      }
    }
  }
  const finished = new Date().toISOString();
  const run = { protocol: 'course/2026fa/submissions/aditya-raj-sde/assignment-2/SAMPLE-PROTOCOL.md', command: `node ${path.relative(REPO, fileURLToPath(import.meta.url))} ${args.join(' ')}`, started_at: started, finished_at: finished, csv_path: csv.path, csv_sha256: csv.sha256, employers_ranked: order.length, probes: probes.length, boards_verified: boards.length, boards_qualifying: boards.filter((b) => b.qualifies).length, postings_selected: postings.length, stop_reason: boards.filter((b) => b.qualifies).length >= need ? `${need} qualifying boards` : probes.length >= maxProbes ? `max probes (${maxProbes}) reached` : 'employer list exhausted' };
  fs.writeFileSync(path.join(privDir, 'collection.json'), JSON.stringify({ run, postings }, null, 2) + '\n');
  fs.writeFileSync(path.join(pubDir, 'probe-log.json'), JSON.stringify({ run, probes }, null, 2) + '\n');
  fs.writeFileSync(path.join(pubDir, 'selection.json'), JSON.stringify({ run, boards: boards.map(({ watch_stdout_tail, ...b }) => b), selected: postings.map(({ text, ...rest }) => rest) }, null, 2) + '\n');
  console.log(`probes ${run.probes} · verified boards ${run.boards_verified} · qualifying ${run.boards_qualifying} · postings ${run.postings_selected} · stop: ${run.stop_reason}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
