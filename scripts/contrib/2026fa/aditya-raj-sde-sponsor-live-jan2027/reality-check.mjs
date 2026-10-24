#!/usr/bin/env node
// reality-check.mjs — Sponsor & Posting Reality Check (student contribution, 2026fa).
//
// Implements the evidence contract in
//   recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md
//
//   node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs \
//     --input <fixture.json> --out-dir <dir>
//
// Exit 0 = outputs written · 2 = input/CSV/out-dir validation failed (nothing written)
//
// Reuses, never copies:
//   - scripts/ats/liveness-core.mjs  classifyLiveness() — imported
//   - scripts/score/role-scorer.mjs  — run through its CLI (it executes main() on import)
// No network: this file imports only node:fs, node:path, node:crypto, node:child_process,
// node:os, node:url and the pure liveness classifier.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '../../../..');
export const CSV_PATH = 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv';
const SCORER = 'scripts/score/role-scorer.mjs';
const ALLOWED_OUT = 'course/2026fa/submissions/aditya-raj-sde/runs';
const PROHIBITED_INPUT = [/^private\//, /^search\/(?!examples\/)/, /^data\/ats\//];

const SRC = { record: 'record', judgment: 'model-judgment', input: 'your-input' };
const PROVISIONAL = 'provisional: timing not verified';
// Gate legend (added after Aditya's report review): what "pass"/"stop" means at each gate.
export const GATE_LEGEND = {
  G1: 'Input: "pass" = the input file passed validation.',
  G2: 'Liveness: "pass" = the posting looked open at the time of the snapshot or observation; "stop" = closed (skip) or uncertain/conflicting (a person checks).',
  G3: 'Vacancy refusal: "pass" = no clear refusal found in the supplied posting text (not a promise of sponsorship); "stop" = an explicit refusal (skip this application).',
  G4: 'Timing: "pass" means only that an explicit SAMPLE timing assumption was supplied and satisfied the sample rule; actual start-date compatibility (January 2027) was NOT verified for any opening. "stop" = no timing input.',
  G5: 'Sponsorship evidence for this opening: "pass" = apparent offer wording for a person to review (not a guarantee); "stop" = awaiting vacancy-level sponsorship evidence.',
  G6: 'Final review: always a person; nothing is applied to automatically.',
};
const HYPOTHETICAL = 'HYPOTHETICAL SCENARIO: uncalibrated sponsorship assumption; not a decision and not verified eligibility';

export class ContractError extends Error {
  constructor(errors) { super(errors.join('\n')); this.errors = errors; }
}

// ── company evidence (record) ───────────────────────────────────────────────
const SUFFIXES = new Set(['inc', 'llc', 'corp', 'corporation', 'co', 'ltd', 'lp', 'plc']);

export function companyKey(name) {
  const words = String(name).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  while (words.length > 1 && SUFFIXES.has(words[words.length - 1])) words.pop();
  return words.join(' ');
}

function parseCsvLine(line) {
  const out = []; let f = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') { if (line[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { out.push(f); f = ''; }
    else if (c !== '\r') f += c;
  }
  out.push(f);
  return out;
}

const COUNT_COLS = { approvals: 'Total Approvals', denials: 'Total Denials', approval_rate: 'Approval_Rate' };

export function loadSponsorCsv(csvPath = path.join(REPO, CSV_PATH)) {
  if (!fs.existsSync(csvPath)) throw new ContractError([`sponsorship CSV not found: ${path.relative(REPO, csvPath)}`]);
  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split('\n');
  const header = parseCsvLine(lines[0]);
  const need = ['company_name', ...Object.values(COUNT_COLS)];
  const missing = need.filter((c) => !header.includes(c));
  if (missing.length) throw new ContractError([`sponsorship CSV header lacks: ${missing.join(', ')}`]);
  const ix = Object.fromEntries(need.map((c) => [c, header.indexOf(c)]));
  // Only the name and the three count columns are kept; phone/executive columns are never loaded.
  const rows = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const r = parseCsvLine(line);
    rows.push({
      company_name: r[ix.company_name],
      approvals: r[ix[COUNT_COLS.approvals]].trim(),
      denials: r[ix[COUNT_COLS.denials]].trim(),
      approval_rate: r[ix[COUNT_COLS.approval_rate]].trim(),
    });
  }
  const index = new Map();
  for (const row of rows) {
    const k = companyKey(row.company_name);
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(row);
  }
  const sha256 = crypto.createHash('sha256').update(text).digest('hex');
  return { rows, index, sha256, path: path.relative(REPO, csvPath) };
}

const num = (s) => (s === '' ? null : Number(s)); // blank stays null — never coerced to 0

export function matchCompany(csv, query, pin) {
  let candidates; let pinned = false;
  if (pin) { candidates = csv.rows.filter((r) => r.company_name === pin); pinned = true; }
  else candidates = csv.index.get(companyKey(query)) || [];
  const base = { query, key: companyKey(query), pinned_row: pin || null, pin_source: pinned ? SRC.input : null, source: SRC.record };
  const list = candidates.map((r) => ({ company_name: r.company_name, approvals: num(r.approvals), denials: num(r.denials), approval_rate: num(r.approval_rate) }));
  if (candidates.length === 0) {
    return { ...base, state: 'no-employer-match', candidates: [], counts: null, note: pinned ? 'pinned row name not found in the CSV' : 'no CSV row matches this name; not zero, not a refusal' };
  }
  if (candidates.length > 1) {
    return { ...base, state: 'ambiguous-employer', candidates: list, counts: null, note: 'more than one plausible employer row; not merged — a human must pin employer_row_name' };
  }
  const only = list[0];
  const counts = { approvals: only.approvals, denials: only.denials, approval_rate: only.approval_rate, columns: COUNT_COLS };
  if (only.approvals === null) return { ...base, state: 'matched-blank-fields', candidates: list, counts, note: 'row found but sponsorship count fields are blank; not zero' };
  if (only.approvals === 0) return { ...base, state: 'matched-zero-approvals', candidates: list, counts, note: 'zero recorded approvals; this is not a refusal by the employer' };
  return { ...base, state: 'matched-with-record', candidates: list, counts, note: 'historical aggregate counts, unspecified time coverage; not evidence about this opening' };
}

// ── vacancy evidence (model-judgment: a rule over posting text) ─────────────
const REFUSAL = [
  /\b(?:will not|won['’]t|cannot|can['’]t|unable to|do not|does not|not able to)\s+(?:\w+\s+){0,2}sponsor/i,
  /\bwithout\s+(?:the\s+need\s+for\s+)?(?:\w+\s+)?sponsorship/i,
  /\bsponsorship\s+(?:is\s+)?not\s+available/i,
  /\bno\s+visa\s+sponsorship/i,
];
const OFFER = [
  /\b(?:will|can|do)\s+sponsor/i,
  /\bsponsorship\s+is\s+available/i,
  /\bsponsorship\s+available/i,
];
const CONDITIONAL = [
  /\b(?:may|might)\s+(?:\w+\s+)?sponsor/i,
  /\bcase[-\s]by[-\s]case\b/i,
  /\bexceptional\s+candidates\b/i,
];
const AUTHORIZED = /\bauthori[sz]ed\s+to\s+work\s+in\s+the\s+(?:u\.?\s?s\.?|united\s+states)/i;

const sentences = (t) => String(t).split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const excerptsFor = (t, pats) => sentences(t).filter((s) => pats.some((p) => p.test(s)));

export function classifyVacancy(text) {
  if (text === null || text === undefined) {
    return { state: 'not-captured', excerpts: [], source: SRC.judgment, note: 'no posting text was supplied about sponsorship' };
  }
  const refusal = REFUSAL.some((p) => p.test(text));
  const offer = OFFER.some((p) => p.test(text));
  const conditional = CONDITIONAL.some((p) => p.test(text)) || (AUTHORIZED.test(text) && !/sponsor/i.test(text));
  const ex = excerptsFor(text, [...REFUSAL, ...OFFER, ...CONDITIONAL, AUTHORIZED]);
  let state;
  if (refusal && offer) state = 'contradictory';
  else if (conditional) state = 'ambiguous-or-conditional'; // a hedged refusal or offer is not "clear"
  else if (refusal) state = 'explicit-refusal';
  else if (offer) state = 'apparent-offer';
  else state = 'silent';
  return { state, excerpts: ex, source: SRC.judgment };
}

function vacancyFor(role) {
  const v = classifyVacancy(role.vacancy_text);
  if (role.synthetic && role.vacancy_text !== null) v.basis = 'rule applied to INVENTED posting text; not an employer\'s statement';
  return v;
}

// ── liveness (maintained classifier + closure-wording check) ────────────────
const CLOSURE = [/\bfilled\b/i, /\bclosed\b/i, /\bno longer\b/i, /\bnot accepting\b/i];

export function closureWording(bodyText) {
  return excerptsFor(bodyText || '', CLOSURE);
}

export function evaluateLiveness(role) {
  if (role.snapshot) {
    const s = role.snapshot;
    const c = classifyLiveness({ status: s.status, finalUrl: s.finalUrl, bodyText: s.bodyText, applyControls: s.applyControls });
    // Provenance: a classifier result derived from an INVENTED snapshot is not an observation of a
    // real posting, so it is labeled your-input (derived from a stated test input), never record.
    const out = role.synthetic
      ? { classifier: { result: c.result, code: c.code, reason: c.reason }, source: SRC.input, observation: 'synthetic-derived', basis: 'derived by the maintained classifier from an INVENTED page snapshot; no real posting was observed' }
      : { classifier: { result: c.result, code: c.code, reason: c.reason }, source: SRC.record, observation: 'recorded-snapshot', basis: 'maintained classifier output on a recorded snapshot of a real page' };
    if (c.result === 'active') {
      const hits = closureWording(s.bodyText);
      if (hits.length) return { ...out, state: 'liveness-conflict', conflict_excerpts: hits, conflict_source: SRC.judgment };
    }
    return { ...out, state: c.result, conflict_excerpts: [] };
  }
  const r = role.recorded_liveness;
  return {
    state: r.result, classifier: { result: r.result, code: r.code ?? null, reason: r.code_note || null },
    source: r.source,
    observation: r.source === SRC.record ? 'recorded-observation' : 'fixture-value',
    basis: r.source === SRC.record ? `recorded observation of a real posting (${r.observed_at}); evidence: ${r.evidence}` : `fixture value supplied as input (${r.observed_at}); not an observation of any posting`,
    conflict_excerpts: [], conflict_check: 'not applicable: no page text recorded',
  };
}

// ── G1 validation ───────────────────────────────────────────────────────────
const inUnit = (x) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 1;
const nonEmpty = (x) => typeof x === 'string' && x.trim().length > 0;

export function validateInput(doc) {
  const e = [];
  if (!doc || !Array.isArray(doc.roles) || doc.roles.length === 0) return ['input.roles must be a non-empty array'];
  const ids = new Set();
  doc.roles.forEach((r, i) => {
    const at = `roles[${i}]${r && r.role_id ? ` (${r.role_id})` : ''}`;
    if (!nonEmpty(r.role_id)) e.push(`${at}.role_id must be a non-empty string`);
    else if (ids.has(r.role_id)) e.push(`${at}.role_id is duplicated`); else ids.add(r.role_id);
    if (!nonEmpty(r.title)) e.push(`${at}.title must be a non-empty string`);
    if (!nonEmpty(r.company_query)) e.push(`${at}.company_query must be a non-empty string`);
    if (typeof r.synthetic !== 'boolean') e.push(`${at}.synthetic must be declared true or false`);
    if (!('vacancy_text' in r)) e.push(`${at}.vacancy_text must be present (use null when not captured)`);
    else if (r.vacancy_text !== null && typeof r.vacancy_text !== 'string') e.push(`${at}.vacancy_text must be a string or null`);
    if (r.employer_row_name !== undefined && !nonEmpty(r.employer_row_name)) e.push(`${at}.employer_row_name must be a non-empty string when given`);
    const hasSnap = r.snapshot !== undefined; const hasRec = r.recorded_liveness !== undefined;
    if (hasSnap === hasRec) e.push(`${at} must have exactly one of snapshot / recorded_liveness`);
    if (hasSnap) {
      const s = r.snapshot;
      if (typeof s.status !== 'number') e.push(`${at}.snapshot.status must be a number`);
      if (typeof s.finalUrl !== 'string') e.push(`${at}.snapshot.finalUrl must be a string`);
      if (typeof s.bodyText !== 'string') e.push(`${at}.snapshot.bodyText must be a string`);
      if (!Array.isArray(s.applyControls) || !s.applyControls.every((x) => typeof x === 'string')) e.push(`${at}.snapshot.applyControls must be an array of strings`);
    }
    if (hasRec) {
      const l = r.recorded_liveness;
      if (!['active', 'expired', 'uncertain'].includes(l.result)) e.push(`${at}.recorded_liveness.result must be active|expired|uncertain`);
      if (![SRC.record, SRC.input].includes(l.source)) e.push(`${at}.recorded_liveness.source must be "record" or "your-input"`);
      if (!nonEmpty(l.observed_at)) e.push(`${at}.recorded_liveness.observed_at must be non-empty`);
      if (l.source === SRC.record && !(nonEmpty(l.evidence) && fs.existsSync(path.join(REPO, l.evidence)))) e.push(`${at}.recorded_liveness labeled "record" must point at an existing evidence file`);
    }
    if (!r.fit) e.push(`${at}.fit is required`);
    else {
      if (!inUnit(r.fit.p)) e.push(`${at}.fit.p must be in [0, 1]`);
      if (r.fit.source !== SRC.input) e.push(`${at}.fit.source must be "your-input" (sample value, not an assessment)`);
      if (!nonEmpty(r.fit.note)) e.push(`${at}.fit.note must explain the sample value`);
    }
    if (r.timeline !== undefined) {
      if (!inUnit(r.timeline.factor)) e.push(`${at}.timeline.factor must be in [0, 1]`);
      if (r.timeline.source !== SRC.input) e.push(`${at}.timeline.source must be "your-input" (a sample assumption is not a record)`);
      if (!nonEmpty(r.timeline.assumption)) e.push(`${at}.timeline.assumption must be non-empty`);
    }
    if (r.demo_sponsorship_vote !== undefined) {
      const v = r.demo_sponsorship_vote;
      if (!inUnit(v.p)) e.push(`${at}.demo_sponsorship_vote.p must be in [0, 1]`);
      if (!nonEmpty(v.tier)) e.push(`${at}.demo_sponsorship_vote.tier must be non-empty`);
      if (v.source !== SRC.input) e.push(`${at}.demo_sponsorship_vote.source must be "your-input"`);
      if (!nonEmpty(v.rationale)) e.push(`${at}.demo_sponsorship_vote.rationale must be non-empty`);
    }
  });
  return e;
}

// ── gates G2–G5 for one role ────────────────────────────────────────────────
export function evaluateRole(role, csv) {
  const company = matchCompany(csv, role.company_query, role.employer_row_name);
  const liveness = evaluateLiveness(role);
  const vacancy = vacancyFor(role);
  const timing = role.timeline
    ? { factor: role.timeline.factor, assumption: role.timeline.assumption, source: role.timeline.source, verified: false }
    : { factor: null, assumption: null, source: null, verified: false, note: 'no timeline input' };
  const gates = [{ id: 'G1', status: 'pass', reason: 'input validated' }];
  const done = (decision, reason) => ({ role_id: role.role_id, title: role.title, synthetic: role.synthetic, posting_url: role.posting_url ?? null, job_id: role.job_id ?? null, company, liveness, vacancy, timing, gates, decision, next_action: decision, decision_reason: reason, scenario: null });

  // G2 liveness
  if (liveness.state === 'expired') {
    const thin = liveness.classifier.code === 'insufficient_content';
    const why = thin ? 'thin content (under 300 characters of page text), not an explicit closure' : `posting closed (${liveness.classifier.code || 'recorded'}): ${liveness.classifier.reason || ''}`.trim();
    gates.push({ id: 'G2', status: 'stop', reason: why });
    return done('skip-application', why);
  }
  if (liveness.state === 'uncertain' || liveness.state === 'liveness-conflict') {
    const why = liveness.state === 'liveness-conflict'
      ? `classifier says active, but the page contains closure-like wording: "${liveness.conflict_excerpts[0]}"`
      : `classifier is uncertain (${liveness.classifier.code || 'recorded'})`;
    gates.push({ id: 'G2', status: 'stop', reason: why });
    return done('human-liveness-review', why);
  }
  gates.push({ id: 'G2', status: 'pass', reason: `active (${liveness.classifier.code || 'recorded observation'})` });

  // G3 vacancy refusal — never scored on the decision path
  if (vacancy.state === 'explicit-refusal') {
    const why = `the posting refuses sponsorship: "${vacancy.excerpts[0]}"`;
    gates.push({ id: 'G3', status: 'stop', reason: why });
    return done('skip-application', why);
  }
  gates.push({ id: 'G3', status: 'pass', reason: `no clear refusal (vacancy state: ${vacancy.state})` });

  // G4 timing — never let the scorer default a missing gate to 1.0
  if (!role.timeline) {
    gates.push({ id: 'G4', status: 'stop', reason: 'timeline input missing' });
    return done('blocked-timing-input', 'timeline input missing; not passed to the scorer');
  }
  gates.push({ id: 'G4', status: 'pass', reason: `sample timing input (${PROVISIONAL})` });

  // G5 sponsorship evidence for THIS opening
  let decision; let why;
  if (vacancy.state === 'apparent-offer') {
    gates.push({ id: 'G5', status: 'pass', reason: 'apparent offer wording; a person must read the excerpt' });
    decision = 'review-offer-excerpt'; why = `offer-like wording to review (not a guarantee): "${vacancy.excerpts[0]}"`;
  } else {
    gates.push({ id: 'G5', status: 'stop', reason: `awaiting sponsorship evidence (vacancy state: ${vacancy.state})` });
    decision = 'seek-vacancy-sponsorship-evidence'; why = `no usable vacancy-level sponsorship evidence (${vacancy.state})`;
  }
  const result = done(decision, `${why}; ${PROVISIONAL}`);
  result.scenario_eligible = Boolean(role.demo_sponsorship_vote);
  return result;
}

// ── scenario path: maintained scorer via CLI ────────────────────────────────
export function scorerRoleFor(role, evaluated) {
  return {
    role_id: role.role_id, company: role.company_query, title: role.title,
    sponsorship: { p: role.demo_sponsorship_vote.p, tier: role.demo_sponsorship_vote.tier, source: SRC.input },
    fit: { p: role.fit.p, source: role.fit.source },
    liveness: { factor: 1.0, source: evaluated.liveness.source },
    timeline: { factor: role.timeline.factor, source: role.timeline.source },
  };
}

function runScorer(scorerRoles, outDir) {
  const rolesPath = path.join(outDir, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(scorerRoles, null, 2) + '\n');
  const stdout = execFileSync(process.execPath, [path.join(REPO, SCORER), rolesPath, '--out-dir', outDir], { cwd: REPO, encoding: 'utf8' });
  const scored = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8')).roles;
  return { stdout, byId: new Map(scored.map((s) => [s.role_id, s])) };
}

// ── outputs ─────────────────────────────────────────────────────────────────
const md = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function renderReport(log) {
  const o = [];
  const n = log.roles.length;
  const c = log.summary.counts;
  o.push(`# Sponsor & Posting Reality Check — ${log.run.run_label}`);
  o.push('');
  o.push('## Executive summary');
  o.push('');
  o.push(`This report checks ${n} job openings for two things before any application time is spent: whether each posting still looks open, and what is actually known about visa sponsorship for that specific opening (kept separate from the company's past record). Every opening ends at a next step for a person, not at an automatic decision.`);
  o.push('');
  o.push(`Result for this sample of ${n}: ${Object.entries(c).map(([k, v]) => `${v} × ${k}`).join(', ')}. Skip fraction ${log.summary.skip_fraction}. Timing was **not verified** for any opening. ${log.summary.synthetic} of ${n} postings are SYNTHETIC test postings.`);
  o.push('');
  o.push('## Run record');
  o.push('');
  o.push(`- Command: \`${log.run.command}\``);
  o.push(`- Started: ${log.run.started_at}`);
  o.push(`- Input: \`${log.run.input_file}\` · Sponsorship CSV: \`${log.run.csv_path}\` (sha256 \`${log.run.csv_sha256.slice(0, 16)}…\`)`);
  o.push('- Labels: **record** = from a data file, or a recorded observation of a real posting · **model-judgment** = a rule applied to text · **your-input** = a stated sample value or assumption, or anything derived from an invented (SYNTHETIC) test input');
  o.push('');
  o.push('## Gate legend');
  o.push('');
  for (const [id, text] of Object.entries(GATE_LEGEND)) o.push(`- **${id}** ${text}`);
  o.push('');
  o.push('## Decisions (actionable)');
  o.push('');
  o.push('| Opening | Company evidence [record] | Posting liveness | Sponsorship wording in this posting [model-judgment] | Next step | Why |');
  o.push('|---|---|---|---|---|---|');
  for (const r of log.roles) {
    const comp = r.company.state + (r.company.counts && r.company.counts.approvals !== null ? ` (approvals ${r.company.counts.approvals}, denials ${r.company.counts.denials})` : '');
    o.push(`| ${r.synthetic ? '**SYNTHETIC** ' : ''}${md(r.company.query)} — ${md(r.title)} | ${md(comp)} | ${md(r.liveness.state)} [${r.liveness.source}; ${r.liveness.observation}] | ${md(r.vacancy.state)} | **${r.next_action}** | ${md(r.decision_reason)} |`);
  }
  o.push('');
  const scen = log.roles.filter((r) => r.scenario);
  o.push('## Hypothetical scenario scores (NOT decisions)');
  o.push('');
  if (!scen.length) o.push('No opening carried a demonstration sponsorship vote, so the maintained scorer was not run.');
  else {
    o.push(`These come from the repository's maintained scorer, run on an **uncalibrated demonstration sponsorship vote** supplied in the input. They show what the scorer would say *if* that assumption were true. They never replace the next step above and do not establish eligibility. Timing inside them is a sample assumption (${PROVISIONAL}).`);
    o.push('');
    o.push('| Opening | Scenario label (scorer) | Composite | Next step (unchanged) | Assumption |');
    o.push('|---|---|---|---|---|');
    for (const r of scen) o.push(`| ${r.synthetic ? '**SYNTHETIC** ' : ''}${md(r.company.query)} — ${md(r.title)} | ${r.scenario.label} | ${r.scenario.composite} | **${r.next_action}** | ${md(r.scenario.vote.rationale)} |`);
  }
  o.push('');
  o.push('## Evidence per opening');
  for (const r of log.roles) {
    o.push('');
    o.push(`### ${r.synthetic ? 'SYNTHETIC — ' : ''}${r.company.query} — ${r.title}`);
    o.push('');
    o.push(`- **Company (${r.company.source}${r.company.pinned_row ? `; row pinned by your-input: ${r.company.pinned_row}` : ''}):** ${r.company.state} — ${r.company.note}`);
    for (const cand of r.company.candidates) o.push(`  - \`${cand.company_name}\`: approvals ${cand.approvals ?? 'blank'}, denials ${cand.denials ?? 'blank'}, approval rate ${cand.approval_rate === null ? 'blank' : cand.approval_rate.toFixed(2)}`);
    o.push(`- **Liveness (${r.liveness.source}):** ${r.liveness.state} — ${r.liveness.basis}; classifier: ${r.liveness.classifier.result}${r.liveness.classifier.code ? ` / ${r.liveness.classifier.code}` : ''}`);
    for (const x of r.liveness.conflict_excerpts) o.push(`  - closure-like wording [model-judgment]: "${x}"`);
    o.push(`- **Sponsorship wording in this posting (${r.vacancy.source}):** ${r.vacancy.state}${r.vacancy.note ? ` — ${r.vacancy.note}` : ''}${r.vacancy.basis ? ` — ${r.vacancy.basis}` : ''}`);
    for (const x of r.vacancy.excerpts) o.push(`  - excerpt: "${x}"`);
    o.push(`- **Timing (${r.timing.source || 'missing'}):** ${r.timing.factor === null ? 'no input — blocked' : `factor ${r.timing.factor}, assumption: ${r.timing.assumption}`} · verified: no`);
    o.push(`- **Gates:** ${r.gates.map((g) => `${g.id} ${g.status}`).join(' → ')}`);
    o.push(`- **Next step:** ${r.next_action} — ${r.decision_reason}`);
  }
  o.push('');
  o.push('## Waiting for a person');
  o.push('');
  const pending = log.roles.filter((r) => r.next_action !== 'skip-application');
  if (!pending.length) o.push('Nothing pending.');
  for (const r of pending) o.push(`- ${r.company.query} — ${r.title}: **${r.next_action}**`);
  o.push('- Every opening: final review of this report (G6). Nothing has been applied to.');
  o.push('');
  o.push('## What this run cannot verify');
  o.push('');
  o.push('- That any opening will be sponsored. Company counts are aggregates with unspecified time coverage, no job codes and no per-year detail.');
  o.push('- That a posting is open now: every liveness value is a point-in-time snapshot or observation.');
  o.push('- Sponsorship wording outside the defined vocabulary; conditional wording stays unresolved.');
  o.push('- Whether similarly named employers are the same organization (only a human pin resolves it).');
  o.push('- January 2027 start compatibility: timing is a labeled sample assumption.');
  o.push('- Fit: a labeled sample value; no résumé matching.');
  return o.join('\n') + '\n';
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function argValue(args, flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; }

export function checkPaths(inputArg, outArg) {
  const e = [];
  if (!inputArg) e.push('--input <file> is required');
  if (!outArg) e.push('--out-dir <dir> is required');
  if (e.length) return { errors: e };
  const input = path.resolve(inputArg); const out = path.resolve(outArg);
  const relIn = path.relative(REPO, input);
  if (!relIn.startsWith('..') && PROHIBITED_INPUT.some((re) => re.test(relIn))) e.push(`input is in a private location and may not be read: ${relIn}`);
  if (!fs.existsSync(input)) e.push(`input not found: ${inputArg}`);
  const allowed = [path.join(REPO, ALLOWED_OUT), fs.realpathSync(os.tmpdir()), path.resolve(os.tmpdir())];
  const okOut = allowed.some((a) => out === a || out.startsWith(a + path.sep));
  if (!okOut) e.push(`--out-dir must be inside ${ALLOWED_OUT}/ or the system temp directory (never over tracked repository files): ${outArg}`);
  return { errors: e, input, out };
}

export function run(argv) {
  const args = argv.slice(2);
  const { errors, input, out } = checkPaths(argValue(args, '--input'), argValue(args, '--out-dir'));
  if (errors.length) throw new ContractError(errors);
  let doc;
  try { doc = JSON.parse(fs.readFileSync(input, 'utf8')); } catch (err) { throw new ContractError([`input is not valid JSON: ${err.message}`]); }
  const ve = validateInput(doc);
  if (ve.length) throw new ContractError(ve);
  const csv = loadSponsorCsv();

  const startedAt = new Date().toISOString();
  const evaluated = doc.roles.map((r) => evaluateRole(r, csv));

  fs.mkdirSync(out, { recursive: true });
  const scenarioRoles = doc.roles.filter((r, i) => evaluated[i].scenario_eligible);
  let scorerStdout = null;
  if (scenarioRoles.length) {
    const sr = runScorer(scenarioRoles.map((r) => scorerRoleFor(r, evaluated[doc.roles.indexOf(r)])), out);
    scorerStdout = sr.stdout;
    for (const r of scenarioRoles) {
      const ev = evaluated[doc.roles.indexOf(r)]; const s = sr.byId.get(r.role_id);
      ev.scenario = { kind: 'hypothetical', notice: HYPOTHETICAL, label: `${s.recommendation} (${PROVISIONAL})`, scorer_recommendation: s.recommendation, composite: s.composite, scorer_reason: s.reason, vote: r.demo_sponsorship_vote, scorer_file: path.relative(REPO, path.join(out, 'role-scores.json')) };
    }
  }
  for (const ev of evaluated) delete ev.scenario_eligible;

  const counts = {};
  for (const ev of evaluated) counts[ev.next_action] = (counts[ev.next_action] || 0) + 1;
  const n = evaluated.length;
  const log = {
    contract: 'recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md',
    run: {
      command: `node ${path.relative(REPO, fileURLToPath(import.meta.url))} --input ${path.relative(REPO, input)} --out-dir ${path.relative(REPO, out)}`,
      started_at: startedAt, run_label: doc.run_label || null, persona_ref: doc.persona_ref || null,
      input_file: path.relative(REPO, input), csv_path: csv.path, csv_sha256: csv.sha256, out_dir: path.relative(REPO, out),
      scorer: scenarioRoles.length ? { cli: `node ${SCORER} ${path.relative(REPO, path.join(out, 'roles.json'))} --out-dir ${path.relative(REPO, out)}`, stdout: scorerStdout } : null,
    },
    gate_legend: GATE_LEGEND,
    labels: { record: 'from a data file, or a recorded observation of a real posting', 'model-judgment': 'a rule applied to text', 'your-input': 'a stated sample value or assumption, or anything derived from an invented (SYNTHETIC) test input' },
    roles: evaluated,
    summary: { n, counts, skip_fraction: `${counts['skip-application'] || 0}/${n} (sample of ${n}; not a general rate)`, synthetic: evaluated.filter((e) => e.synthetic).length, timing_verified: 0 },
  };
  fs.writeFileSync(path.join(out, 'reality-check.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'reality-check.md'), renderReport(log));
  return log;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const log = run(process.argv);
    console.log(`✓ ${log.summary.n} openings → ${Object.entries(log.summary.counts).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    console.log(`  skip fraction ${log.summary.skip_fraction}; timing verified for 0; scenario (hypothetical) scores: ${log.roles.filter((r) => r.scenario).length}`);
    console.log(`  ${log.run.out_dir}/reality-check.json  +  ${log.run.out_dir}/reality-check.md`);
  } catch (err) {
    if (err instanceof ContractError) {
      console.error('✗ contract validation failed (G1) — nothing written:');
      for (const m of err.errors) console.error(`  - ${m}`);
      process.exit(2);
    }
    throw err;
  }
}
