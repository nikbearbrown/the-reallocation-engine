#!/usr/bin/env node
// triage.mjs — Experienced Java Backend Opening Triage for an Early-2027 Start (2026fa student mode).
// Contract: recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md
//
//   run      node triage.mjs run --input <observations.json> --candidate <candidate.json> --out-dir <dir>
//   extract  node triage.mjs extract --collection private/a2/collection.json --page-liveness <evidence.txt>
//                 [--page-probe <evidence.txt>] --out <observations.json> --full-out private/<x>.json
//   compare  node triage.mjs compare <triage-a.json> <triage-b.json>       (decision/state equality)
//   a1-input node triage.mjs a1-input --input <observations.json> --out <a1-input.json>
//
// Exit 0 = ok · 1 = compare found differences · 2 = input/contract validation failed (nothing written).
// No network. Reuses, never copies: Assignment 1 reality-check.mjs (loadSponsorCsv, matchCompany,
// evaluateLiveness, ContractError) and, through it, scripts/ats/liveness-core.mjs classifyLiveness.
// The maintained composite scorer is deliberately NOT called (see the recipe, "Why no score").

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadSponsorCsv, matchCompany, evaluateLiveness, ContractError } from '../aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs';
import { RULES_VERSION, toSentences, checkExperience, checkStack, checkStartWindow, checkVacancy, isRelevantSentence } from './checks.mjs';
import { sentencesOf } from './text.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '../../../..');
const ALLOWED_OUT = ['course/2026fa/submissions/aditya-raj-sde/assignment-2/runs', 'private/a2'];
const SRC = { record: 'record', judgment: 'model-judgment', input: 'your-input' };
const JUDG = SRC.judgment;
const rel = (p) => path.relative(REPO, p);

export const GATE_LEGEND = {
  G1: 'Input: the observation file and candidate configuration passed validation.',
  G2: 'Liveness at the time of observation: "stop" = both the employer feed and the page say it is gone (skip); "review" = the feed and the page disagree, or the page is uncertain / shows closure wording (a person checks). Never "open now".',
  G3: 'Sponsorship and eligibility wording in THIS posting: "stop" = an explicit refusal or an explicit citizenship requirement (skip). Clearance/export-control wording goes to a person. Company history is never used here.',
  G4: 'Experience and degree: "stop" = a documented mismatch with a stated required minimum, or an explicit eligibility restriction (experience cap, graduation window). "review" = ranges exceeded, either/or branches, unclear co-op counting, unlabeled sections. "pass-unknown" = nothing stated. A mismatch is not a claim the employer could never make an exception.',
  G5: 'Start window by date arithmetic only: "stop" = an explicit employer start window that ends before the supplied availability date. "review" = ASAP, offer-relative, ambiguous, or conflicting timing. "pass-unknown" = no timing stated. Never establishes work authorization, EAD approval, or hiring duration.',
  G6: 'Stack evidence: "pass" = a JVM language in required or responsibility lines plus backend-infrastructure terms. "review" = Java only in preferred/other lines, another language required, or too little text. Evidence locations, not a score.',
  G7: 'Sponsorship evidence for this opening: "pass" = apparent offer wording for a person to read (not a guarantee); otherwise "stop" = awaiting opening-level evidence.',
  G8: 'Final review: always a person. Nothing is applied to automatically.',
};

// ── candidate ───────────────────────────────────────────────────────────────
// Month-only dates (v0.4). An entry "YYYY-MM … YYYY-MM" covers `count` calendar months (inclusive),
// but the elapsed time can be as little as count − 2 months (start late in the first month, leave early
// in the last). Upper bound = number of distinct months covered (overlaps counted once). Lower bound =
// Σ over blocks of overlapping entries of (block months − 2). Adjacent entries are NOT merged, because
// a gap of up to ~2 months between them cannot be ruled out from month-only dates.
const monthIdx = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
export function monthInterval(entries) {
  const iv = entries.map((x) => [monthIdx(x.start_date), monthIdx(x.end_date)]).sort((a, b) => a[0] - b[0]);
  const covered = new Set(); for (const [a, b] of iv) for (let i = a; i <= b; i++) covered.add(i);
  const blocks = [];
  for (const [a, b] of iv) { const last = blocks[blocks.length - 1]; if (last && a <= last[1]) last[1] = Math.max(last[1], b); else blocks.push([a, b]); }
  return { months_upper: covered.size, months_lower: blocks.reduce((t, [a, b]) => t + Math.max(0, b - a + 1 - 2), 0), covered };
}

export function loadCandidate(cfgPath) {
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const e = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cfg.available_from || '')) e.push('candidate.available_from must be YYYY-MM-DD');
  if (cfg.available_from_source !== SRC.input) e.push('candidate.available_from_source must be "your-input"');
  if (!cfg.resume || !fs.existsSync(path.join(REPO, cfg.resume))) e.push('candidate.resume must point at an existing persona résumé JSON');
  if (cfg.resume && !/^search\/examples\//.test(cfg.resume) && !/^private\//.test(cfg.resume)) e.push('candidate.resume must be a fictional persona under search/examples/ (or a private/ file for private runs)');
  if (e.length) throw new ContractError(e);
  const resume = JSON.parse(fs.readFileSync(path.join(REPO, cfg.resume), 'utf8'));
  const exp = resume.experience || [];
  const unknown = exp.filter((x) => !['full-time', 'co-op'].includes(x.employment_type));
  if (unknown.length) throw new ContractError([`every experience entry needs employment_type full-time|co-op (missing for ${unknown.length} entr${unknown.length === 1 ? 'y' : 'ies'}); the mode never infers it from a title`]);
  for (const x of exp) if (!/^\d{4}-\d{2}$/.test(x.start_date || '') || !/^\d{4}-\d{2}$/.test(x.end_date || '') || x.end_date < x.start_date) throw new ContractError([`experience dates must be YYYY-MM with end ≥ start (${x.company})`]);
  for (const x of resume.scoped_experience || []) if (!Array.isArray(x.terms) || !x.terms.length || typeof x.months !== 'number' || x.source !== SRC.input) throw new ContractError(['scoped_experience entries need terms[], numeric months, and source "your-input"']);
  const ftE = exp.filter((x) => x.employment_type === 'full-time'); const coE = exp.filter((x) => x.employment_type === 'co-op');
  const ft = monthInterval(ftE); const all = monthInterval(exp);
  const coOnly = [...monthInterval(coE).covered].filter((m) => !ft.covered.has(m)).length; // co-op months not overlapping full-time
  const coop = { months_upper: coOnly, months_lower: Math.max(0, coOnly - 2 * coE.length) };
  const degrees = (resume.education || []).map((d) => ({ level: /\bMS\b|master/i.test(d.degree) ? 'MS' : /\bPhD\b/i.test(d.degree) ? 'PhD' : 'BS', field: d.degree, end: d.end_date, status: d.status }));
  return {
    config: cfgPath, persona_ref: cfg.persona_ref, resume: cfg.resume, available_from: cfg.available_from,
    full_time: { months_lower: ft.months_lower, months_upper: ft.months_upper, entries: ftE.length },
    coop: { ...coop, entries: coE.length },
    career_upper: { with_coop: all.months_upper, ft_only: ft.months_upper },
    scoped_experience: resume.scoped_experience || [],
    full_time_months: ft.months_upper, coop_months: coop.months_upper, // kept for display
    degrees, source: SRC.input,
    precision: 'month-only dates: each entry spans between (inclusive month count − 2) and the inclusive month count; overlaps counted once',
    authorization_note: 'No work-authorization status is checked or assumed.',
  };
}

// ── validation (G1) ─────────────────────────────────────────────────────────
const nonEmpty = (x) => typeof x === 'string' && x.trim().length > 0;
export function validateObservations(doc) {
  const e = [];
  if (!doc || !Array.isArray(doc.observations) || !doc.observations.length) return ['input.observations must be a non-empty array'];
  const ids = new Set();
  doc.observations.forEach((o, i) => {
    const at = `observations[${i}]${o?.obs_id ? ` (${o.obs_id})` : ''}`;
    if (!nonEmpty(o.obs_id)) e.push(`${at}.obs_id required`); else if (ids.has(o.obs_id)) e.push(`${at}.obs_id duplicated`); else ids.add(o.obs_id);
    for (const k of ['employer', 'title', 'captured_at']) if (!nonEmpty(o[k])) e.push(`${at}.${k} required`);
    if (typeof o.synthetic !== 'boolean') e.push(`${at}.synthetic must be true or false`);
    if (!o.synthetic && !/^https:\/\//.test(o.url || '')) e.push(`${at}.url must be an https URL for a real observation`);
    if (o.synthetic && o.url && !/example\.(com|org)/.test(o.url)) e.push(`${at}: a synthetic observation must use an example.com URL`);
    if (!o.content || !Array.isArray(o.content.lines)) e.push(`${at}.content.lines must be an array`);
    if (typeof o.text_chars !== 'number') e.push(`${at}.text_chars must be a number (full text length)`);
    if (!o.page || (o.page.snapshot === undefined && o.page.result === undefined)) e.push(`${at}.page needs a snapshot or a recorded result`);
    if (o.page?.result !== undefined) {
      if (!['active', 'expired', 'uncertain'].includes(o.page.result)) e.push(`${at}.page.result must be active|expired|uncertain`);
      if (o.page.source === SRC.record && !(nonEmpty(o.page.evidence) && fs.existsSync(path.join(REPO, o.page.evidence)))) e.push(`${at}.page labeled record must point at an existing evidence file`);
    }
    if (!o.feed || ![true, false, null].includes(o.feed.present)) e.push(`${at}.feed.present must be true, false, or null`);
  });
  return e;
}

// ── liveness: Assignment 1 evaluation + the feed-vs-page rule ──────────────
// v0.4: only page evidence that positively indicates closure (HTTP 404/410, a redirect to a closed/listing
// URL, explicit closure wording) can support "gone". A thin or blocked page (e.g. an HTTP 403 challenge,
// classifier code insufficient_content) is unknown — with or without a feed observation. Challenges are
// never bypassed. Raw observations are records; the classifier's verdict and this combination are judgments.
const CLOSURE_CODES = new Set(['http_gone', 'expired_url', 'expired_body', 'listing_page']);
const CLOSURE_REASON = /\bHTTP 4(04|10)\b|redirect to|pattern matched/i;
export function combineLiveness(o) {
  const page = o.page.snapshot
    ? evaluateLiveness({ snapshot: o.page.snapshot, synthetic: o.synthetic })
    : evaluateLiveness({ recorded_liveness: { result: o.page.result, code: o.page.code ?? null, code_note: o.page.code ?? null, source: o.page.source, observed_at: o.page.observed_at, evidence: o.page.evidence } });
  const feed = o.feed.present;
  const code = page.classifier.code; const reason = `${page.classifier.reason || ''} ${o.page.code || ''}`;
  const closureEvidence = page.state === 'expired' && (CLOSURE_CODES.has(code) || CLOSURE_REASON.test(reason));
  const obsSrc = o.synthetic ? SRC.input : SRC.record;
  const observations = [
    { what: 'listed in the employer board feed at capture', value: feed, at: o.feed.observed_at, source: feed === null ? 'not observed' : obsSrc },
    ...(o.page.snapshot ? [{ what: 'page HTTP status (snapshot)', value: o.page.snapshot.status, source: obsSrc }] : []),
    ...(o.page.probe ? [{ what: 'page HTTP status / title / length (probe)', value: `${o.page.probe.status} / "${o.page.probe.document_title}" / ${o.page.probe.body_chars} chars`, at: o.page.probe.observed_at, source: obsSrc }] : []),
    { what: 'maintained checker verdict (heuristic)', value: `${page.classifier.result}${code ? ` / ${code}` : ''}${o.page.code ? ` / ${o.page.code}` : ''}`, at: o.page.observed_at, source: JUDG },
  ];
  let state; let gate; let why;
  if (page.state === 'liveness-conflict') { state = 'closure-wording-on-active-page'; gate = 'review'; why = `page classified active but shows closure-like wording: "${page.conflict_excerpts[0]}"`; }
  else if (page.state === 'uncertain') { state = 'page-uncertain'; gate = 'review'; why = `page check uncertain (${code || 'recorded'})`; }
  else if (page.state === 'expired' && feed === true) { state = 'feed-page-disagree'; gate = 'review'; why = `listed in the employer's board feed at ${o.feed.observed_at}, but the page check said expired (${code || o.page.code || 'recorded'})${o.page.probe ? `; supplementary probe: HTTP ${o.page.probe.status}, title "${o.page.probe.document_title}", ${o.page.probe.body_chars} characters` : ''}`; }
  else if (page.state === 'expired' && !closureEvidence) { state = 'page-blocked-or-thin'; gate = 'review'; why = `the page check said expired only because the page was thin or blocked (${code || o.page.code || 'recorded'}) — that is not evidence of closure`; }
  else if (page.state === 'active' && feed === false) { state = 'feed-page-disagree'; gate = 'review'; why = 'page looks active but the posting was absent from the employer feed'; }
  else if (page.state === 'expired') { state = 'gone-at-observation'; gate = 'stop'; why = `page shows closure evidence (${code || o.page.code || 'recorded'})${feed === false ? ' and the posting was absent from the employer feed' : ''}`; }
  else { state = 'listed-and-page-active-at-observation'; gate = 'pass'; why = `page active${feed === true ? ' and listed in the employer feed' : ''} at the observation times (point-in-time, not "open now")`; }
  return { state, gate, why, feed: o.feed, page, observations, source: JUDG, note: o.synthetic ? 'synthetic observation: derived from invented inputs (your-input), not a real page' : 'interpretation of point-in-time observations' };
}

// ── gates for one observation ───────────────────────────────────────────────
const SKIP = 'skip-application';
export function evaluateObservation(o, candidate, csv) {
  const sentences = toSentences(o.content.lines);
  const company = matchCompany(csv, o.company_query || o.employer, o.employer_row_name);
  const liveness = combineLiveness(o);
  // v0.4.1: wording rules also read heading lines — eligibility statements are sometimes rendered as
  // bold "headings" (holdout finding E19). Headings are read for G3 only.
  const headingSentences = o.content.lines.filter((l) => l.startsWith('## ')).map((l) => ({ section: null, kind: 'heading', text: l.slice(3) }));
  const vacancy = checkVacancy([...sentences, ...headingSentences]);
  const experience = checkExperience(sentences, candidate);
  const start = checkStartWindow(sentences, candidate.available_from, o.captured_at);
  const stack = checkStack(sentences, o.text_chars);

  const g3 = vacancy.state === 'explicit-refusal' ? { status: 'stop', reason: `the posting refuses sponsorship: "${vacancy.excerpts[0]}"` }
    : vacancy.eligibility === 'citizenship-required' ? { status: 'stop', reason: `the posting requires U.S. citizenship: "${vacancy.eligibility_excerpts[0]}"` }
      : vacancy.eligibility === 'clearance-or-export-control-wording' ? { status: 'review', reason: `clearance / export-control wording: "${vacancy.eligibility_excerpts[0]}"` }
        : { status: 'pass', reason: `no refusal or citizenship requirement found (wording state: ${vacancy.state})` };
  const g7 = vacancy.state === 'apparent-offer' ? { status: 'pass', reason: 'apparent offer wording; a person reads the excerpt' } : { status: 'stop', reason: `awaiting opening-level sponsorship evidence (${vacancy.state})` };
  const gates = [
    { id: 'G1', status: 'pass', reason: 'input validated' },
    { id: 'G2', status: liveness.gate, reason: liveness.why },
    { id: 'G3', ...g3 },
    { id: 'G4', status: experience.gate, reason: experience.why },
    { id: 'G5', status: start.gate, reason: start.why },
    { id: 'G6', status: stack.gate, reason: stack.why },
    { id: 'G7', ...g7 },
    { id: 'G8', status: 'review', reason: 'a person reads the report' },
  ];
  // decision: the first gate (in order) that stops or needs review; every check is still reported.
  const ACTION = { G2: { stop: SKIP, review: 'human-liveness-review' }, G3: { stop: SKIP, review: 'human-eligibility-review' }, G4: { stop: SKIP, review: 'human-requirement-review' }, G5: { stop: SKIP, review: 'human-start-window-review' }, G6: { review: 'human-requirement-review' } };
  let decision = null; let decidedBy = null;
  for (const g of gates.slice(1, 6)) {
    const a = ACTION[g.id]?.[g.status];
    if (a) { decision = a; decidedBy = g; break; }
  }
  if (!decision) { decision = vacancy.state === 'apparent-offer' ? 'review-offer-excerpt' : 'seek-vacancy-sponsorship-evidence'; decidedBy = gates[6]; }
  const alsoNeeded = []; // only for openings that are not skipped: a skip needs no follow-up
  if (start.state === 'employer-timing-unstated') alsoNeeded.push('confirm the start date with the employer');
  if (experience.state === 'experience-requirement-unstated') alsoNeeded.push('confirm the expected level/years');
  if (decision !== 'seek-vacancy-sponsorship-evidence' && decision !== SKIP && vacancy.state !== 'apparent-offer') alsoNeeded.push('opening-level sponsorship evidence');
  if (decision === SKIP) alsoNeeded.length = 0;
  const otherOpen = gates.slice(1, 7).filter((g) => g !== decidedBy && (g.status === 'stop' || g.status === 'review')).map((g) => `${g.id} ${g.status}`);
  return {
    obs_id: o.obs_id, synthetic: o.synthetic, employer: o.employer, title: o.title, job_id: o.job_id ?? null, url: o.url ?? null, location: o.location ?? null, captured_at: o.captured_at, text_sha256: o.text_sha256 ?? null,
    company, liveness, vacancy, experience, start_window: start, stack, gates,
    decision, next_action: decision, decided_by: decidedBy.id, decision_reason: decidedBy.reason, also_needed: alsoNeeded, other_open_gates: otherOpen,
  };
}

// ── report ──────────────────────────────────────────────────────────────────
const md = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const q = (s) => `> “${md(s)}”`;

const TIMING_UNRESOLVED = ['employer-timing-unstated', 'asap-or-ambiguous-unresolved', 'relative-to-offer-date', 'conflicting-timing-statements', 'season-compatible-under-assumption', 'season-conflict-under-assumption', 'descriptive-timing-conflict'];
export function summarize(roles) {
  const counts = {}; for (const r of roles) counts[r.next_action] = (counts[r.next_action] || 0) + 1;
  const core = (r) => r.stack.state === 'core-stack-evidenced';
  const group = (rs) => ({
    n: rs.length, obs_ids: rs.map((r) => r.obs_id),
    liveness_not_clear: rs.filter((r) => r.liveness.gate !== 'pass').length,
    sponsorship_unresolved: rs.filter((r) => r.vacancy.state !== 'apparent-offer').length,
    timing_unresolved: rs.filter((r) => TIMING_UNRESOLVED.includes(r.start_window.state)).length,
  });
  const g4 = (r) => r.gates.find((g) => g.id === 'G4').status;
  const groups = {
    definition: 'experience (G4) groups, disjoint. "satisfied" = every stated required minimum explicitly met; "unknown" = no requirement detected (not a match). Liveness, sponsorship, and timing uncertainty are counted inside each group.',
    satisfied_with_core_stack: group(roles.filter((r) => g4(r) === 'pass' && r.experience.state !== 'only-preferred-years-not-met' && core(r))),
    unknown_with_core_stack: group(roles.filter((r) => (g4(r) === 'pass-unknown' || r.experience.state === 'only-preferred-years-not-met') && core(r))),
    awaiting_review: group(roles.filter((r) => g4(r) === 'review')),
    documented_mismatch: group(roles.filter((r) => g4(r) === 'stop')),
  };
  groups.other_not_core_stack = group(roles.filter((r) => ['pass', 'pass-unknown'].includes(g4(r)) && !core(r)));
  return {
    n: roles.length, counts, synthetic: roles.filter((r) => r.synthetic).length,
    skip_fraction: `${counts[SKIP] || 0}/${roles.length} (this sample only; not a general rate)`,
    experience_groups: groups,
    start_window_states: Object.fromEntries(Object.entries(roles.reduce((a, r) => ((a[r.start_window.state] = (a[r.start_window.state] || 0) + 1), a), {}))),
    vacancy_states: Object.fromEntries(Object.entries(roles.reduce((a, r) => ((a[r.vacancy.state] = (a[r.vacancy.state] || 0) + 1), a), {}))),
    experience_states: Object.fromEntries(Object.entries(roles.reduce((a, r) => ((a[r.experience.state] = (a[r.experience.state] || 0) + 1), a), {}))),
    detection_scope: 'All counts describe what the rules detected in the captured posting body. A missing rule hit is not proof that no relevant wording exists; application-form questions were not inspected.',
  };
}

function renderReport(log) {
  const o = []; const s = log.summary; const n = s.n;
  const kind = log.run.kind;
  o.push(`# Opening Triage — ${md(log.run.run_label || 'run')}`, '');
  o.push('## Executive summary', '');
  o.push(`This report screens ${n} job opening${n === 1 ? '' : 's'} for an experienced Java/Spring backend candidate who can start on ${log.candidate.available_from} (a date the candidate supplied; nothing about work authorization is checked). For each opening it asks, in order: does the posting still look listed, does this specific posting refuse sponsorship or require citizenship, do the stated experience requirements fit, does any stated start date fit, and is the work actually Java backend work. Company sponsorship history is shown only as context and never decides anything.`, '');
  o.push(`**Result for this ${kind === 'synthetic' ? 'synthetic test set' : 'sample'}:** ${Object.entries(s.counts).map(([k, v]) => `${v} × ${k}`).join(', ')}. ${s.synthetic ? `${s.synthetic} of ${n} openings are SYNTHETIC test postings.` : 'All openings are real public postings.'} Every opening still ends with a person's review; nothing was applied to.`, '');
  const G = s.experience_groups;
  o.push('**Experience groups (disjoint; counts, not a verdict):**', '');
  o.push('| Group | Openings | of which liveness not clear | sponsorship unresolved | start timing unresolved |', '|---|---|---|---|---|');
  for (const [k, label] of [['satisfied_with_core_stack', 'experience explicitly satisfied + core Java-backend evidence'], ['unknown_with_core_stack', 'experience requirement unknown (none detected) + core evidence'], ['awaiting_review', 'experience awaiting human review'], ['documented_mismatch', 'documented experience mismatch / restriction'], ['other_not_core_stack', 'experience passed/unknown but stack evidence not core']]) o.push(`| ${label} | ${G[k].n} | ${G[k].liveness_not_clear} | ${G[k].sponsorship_unresolved} | ${G[k].timing_unresolved} |`);
  o.push('', `*Scope of every "none found": ${s.detection_scope}*`, '');
  o.push('## Run record', '');
  o.push(`- Kind: **${kind}** — ${log.run.kind_note}`);
  o.push(`- Command: \`${log.run.command}\``);
  o.push(`- Started: ${log.run.started_at} · rules v${log.run.rules_version}`);
  o.push(`- Input: \`${log.run.input_file}\` (sha256 \`${log.run.input_sha256.slice(0, 16)}…\`) · Candidate: \`${log.candidate.config}\` (persona \`${log.candidate.persona_ref}\`)`);
  o.push(`- Candidate inputs [your-input]: full-time ${log.candidate.full_time.months_lower}–${log.candidate.full_time.months_upper} months · co-op ${log.candidate.coop.months_lower}–${log.candidate.coop.months_upper} months, kept separate (counted only where a posting explicitly accepts co-ops; silence/ambiguity that would change the result → review) · scoped-experience inputs: ${log.candidate.scoped_experience.length || 'none supplied'} · available from ${log.candidate.available_from} · precision: ${log.candidate.precision}`);
  o.push(`- Sponsorship CSV: \`${log.run.csv_path}\` (sha256 \`${log.run.csv_sha256.slice(0, 16)}…\`)`);
  o.push('- Labels: **record** = a data-file value, a verbatim excerpt, or a raw observation (feed listing, HTTP status) · **model-judgment** = a heuristic interpretation (the page checker’s verdict, liveness combination, requirement/section/compatibility rules) · **your-input** = a candidate-supplied value, or anything derived from a SYNTHETIC posting', '');
  o.push('## Gate legend', '');
  for (const [id, t] of Object.entries(log.gate_legend)) o.push(`- **${id}** ${t}`);
  o.push('', '## Decisions', '');
  o.push('| Opening | G2 liveness | G3 this posting: sponsorship / eligibility | G4 experience | G5 start window | G6 stack | Company history (context only) [record] | Next step | Also needed |');
  o.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of log.roles) {
    const comp = r.company.state + (r.company.counts && r.company.counts.approvals !== null ? ` (approvals ${r.company.counts.approvals})` : '');
    o.push(`| ${r.synthetic ? '**SYNTHETIC** ' : ''}${md(r.employer)} — ${md(r.title)}${r.job_id ? ` (${r.job_id})` : ''} | ${r.liveness.state} | ${r.vacancy.state}${r.vacancy.eligibility !== 'none-stated' ? `; ${r.vacancy.eligibility}` : ''} | ${r.experience.state} | ${r.start_window.state} | ${r.stack.state} | ${md(comp)} | **${r.next_action}** (${r.decided_by}) | ${md(r.also_needed.join('; ') || '—')} |`);
  }
  o.push('', '## Waiting for a person', '');
  const pending = log.roles.filter((r) => r.next_action !== SKIP);
  for (const r of pending) o.push(`- **${md(r.employer)} — ${md(r.title)}:** ${r.next_action} — ${md(r.decision_reason)}${r.other_open_gates.length ? ` · other open gates: ${r.other_open_gates.join(', ')}` : ''}`);
  const skips = log.roles.filter((r) => r.next_action === SKIP);
  if (skips.length) { o.push('', 'Skipped (a person may still disagree — the reason is shown):'); for (const r of skips) o.push(`- ${md(r.employer)} — ${md(r.title)}: ${md(r.decision_reason)}`); }
  o.push('- Every opening: final review of this report (G8).', '');
  o.push('## Evidence per opening', '');
  o.push('Quoted lines are the employer\'s own words (from the captured posting). Lines starting with **Rule** are this mode\'s interpretation.', '');
  for (const r of log.roles) {
    o.push(`### ${r.synthetic ? 'SYNTHETIC — ' : ''}${r.employer} — ${r.title}`, '');
    if (r.url) o.push(`- Source: ${r.url}${r.job_id ? ` · job id ${r.job_id}` : ''} · captured ${r.captured_at}${r.location ? ` · ${md(r.location)}` : ''}`);
    o.push(`- **Rule — liveness [${r.liveness.source}]:** ${r.liveness.state} — ${md(r.liveness.why)}`);
    for (const ob of r.liveness.observations) o.push(`  - observation [${ob.source}]: ${md(ob.what)} = ${md(ob.value)}${ob.at ? ` (${ob.at})` : ''}`);
    o.push(`- **Rule — sponsorship wording in this posting [model-judgment; ${r.vacancy.basis}]:** ${r.vacancy.state === 'silent' ? 'silent — the rules detected no sponsorship wording in the captured posting body (application-form questions not inspected)' : r.vacancy.state}; eligibility: ${r.vacancy.eligibility === 'none-stated' ? 'no citizenship/clearance wording detected by the rules' : r.vacancy.eligibility}`);
    for (const x of [...r.vacancy.excerpts, ...r.vacancy.eligibility_excerpts].slice(0, 3)) o.push(`  ${q(x)}`);
    o.push(`- **Company history [record, context only]:** ${r.company.state} — ${md(r.company.note)}`);
    o.push(`- **Rule — experience [model-judgment]:** ${r.experience.state} — ${md(r.experience.why)}`);
    for (const f of r.experience.findings.slice(0, 5)) o.push(`  ${q(f.sentence)} — *${f.kind}${f.section ? ` (“${md(f.section)}”)` : ''}, ${f.scope ?? ''} → ${f.state}${f.comparison ? `; ${md(f.comparison)}` : ''}*`);
    for (const g of r.experience.graduation) o.push(`  ${q(g.sentence)} — *${g.state}*`);
    o.push(`- **Rule — start window [model-judgment; date arithmetic only]:** ${r.start_window.state} — ${md(r.start_window.why)} · capture→availability: ${r.start_window.arithmetic.days_from_capture_to_availability ?? '—'} days`);
    for (const st of r.start_window.statements.slice(0, 3)) o.push(`  ${q(st.sentence)} — *${st.type}${st.window ? ` ${st.window.from}..${st.window.to}` : ''}*`);
    o.push(`- **Rule — stack evidence [model-judgment]:** ${r.stack.state} — ${md(r.stack.why)}`);
    o.push(`  - where: ${Object.entries(r.stack.groups).map(([g, v]) => `${g}=${v.where}${v.terms.length ? ` (${v.terms.slice(0, 4).join(', ')})` : ''}`).join(' · ')}`);
    const jx = r.stack.groups.java_jvm.excerpts[0]; if (jx) o.push(`  ${q(jx.text)} — *${jx.kind}*`);
    o.push(`- **Gates:** ${r.gates.map((g) => `${g.id} ${g.status}`).join(' → ')}`);
    o.push(`- **Next step:** ${r.next_action} (decided by ${r.decided_by})${r.also_needed.length ? ` · also needed: ${r.also_needed.join('; ')}` : ''}`, '');
  }
  o.push('## What this run cannot verify', '');
  o.push('- That any opening will sponsor. Company counts are aggregates with unspecified time coverage; a silent posting is unknown, not a yes. "Silent" means the rules detected no sponsorship wording in the captured posting body; application-form questions were not inspected.');
  o.push('- Years spent on a specific language, system type, activity, or domain. Total career months never establish a scoped requirement; without an explicit scoped input it is unknown.');
  o.push('- That a posting is open now. Feed and page observations are point-in-time; a blocked page is not a closed posting.');
  o.push('- Work authorization, EAD approval, legal eligibility to start, or how long hiring takes. The start-window check is date arithmetic against a candidate-supplied date.');
  o.push('- Whether an employer would make an exception to a stated requirement, or would recognize co-op months.');
  o.push('- Wording outside the rules\' vocabularies (paraphrases are missed), section labels the rules do not recognize, or requirements stated only in images or linked pages.');
  o.push('- Whether the candidate is actually good at the listed technologies. Stack evidence says where a term appears in the posting, not how well anyone matches it.');
  return o.join('\n') + '\n';
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function argValue(args, flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; }
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function checkOut(outArg) {
  const out = path.resolve(outArg);
  const ok = [...ALLOWED_OUT.map((a) => path.join(REPO, a)), fs.realpathSync(os.tmpdir()), path.resolve(os.tmpdir())].some((a) => out === a || out.startsWith(a + path.sep));
  if (!ok) throw new ContractError([`--out-dir must be inside ${ALLOWED_OUT.join(' or ')} or the system temp directory: ${outArg}`]);
  return out;
}

export function run(args) {
  const inputArg = argValue(args, '--input'); const candArg = argValue(args, '--candidate'); const outArg = argValue(args, '--out-dir');
  const e = []; if (!inputArg) e.push('--input required'); if (!candArg) e.push('--candidate required'); if (!outArg) e.push('--out-dir required');
  if (e.length) throw new ContractError(e);
  const out = checkOut(outArg);
  const input = path.resolve(inputArg);
  if (!fs.existsSync(input)) throw new ContractError([`input not found: ${inputArg}`]);
  if (/^private\//.test(rel(input)) && !/^private\//.test(rel(out))) throw new ContractError(['an input under private/ may only be written to an --out-dir under private/']);
  const raw = fs.readFileSync(input, 'utf8');
  let doc; try { doc = JSON.parse(raw); } catch (err) { throw new ContractError([`input is not valid JSON: ${err.message}`]); }
  const ve = validateObservations(doc); if (ve.length) throw new ContractError(ve);
  const candidate = loadCandidate(path.resolve(candArg));
  candidate.config = rel(path.resolve(candArg));
  const csv = loadSponsorCsv();
  const startedAt = new Date().toISOString();
  const roles = doc.observations.map((o) => evaluateObservation(o, candidate, csv));
  const log = {
    contract: 'recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md',
    run: { command: `node ${rel(fileURLToPath(import.meta.url))} run --input ${rel(input)} --candidate ${candidate.config} --out-dir ${rel(out)}`, started_at: startedAt, run_label: doc.run_label || null, kind: doc.kind || 'unspecified', kind_note: doc.kind_note || '', rules_version: RULES_VERSION, input_file: rel(input), input_sha256: sha(raw), csv_path: csv.path, csv_sha256: csv.sha256, out_dir: rel(out), scorer: 'not called (see recipe: Why no score)' },
    candidate, gate_legend: GATE_LEGEND,
    labels: { record: 'a data-file value, a verbatim excerpt, or a raw observation (feed listing, HTTP status)', 'model-judgment': 'a heuristic interpretation: the page checker verdict, the liveness combination, requirement/section/compatibility rules', 'your-input': 'a candidate-supplied value, or anything derived from a SYNTHETIC posting' },
    roles, summary: summarize(roles),
  };
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'triage.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'triage.md'), renderReport(log));
  return log;
}

// extract: private collection (full text) → tracked excerpts + private full-text observations
function parseLivenessEvidence(file) {
  const lines = fs.readFileSync(path.join(REPO, file), 'utf8').split('\n');
  const started = (lines.find((l) => l.startsWith('## started:')) || '').replace('## started:', '').split('—')[0].trim();
  const map = new Map();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(?:✅|❌|⚠️|❓)\s+(active|expired|uncertain)\s+(\S+)/u);
    if (m) map.set(m[2], { result: m[1], code: (lines[i + 1] && !/^(✅|❌|⚠️|❓|Results:)/u.test(lines[i + 1].trim()) ? lines[i + 1].trim() : null) || null, observed_at: started });
  }
  return map;
}

export function excerptLines(lines) {
  const out = []; let heading = null; let emitted = null;
  for (const line of lines) {
    if (line.startsWith('## ')) { heading = line; if (isRelevantSentence(line.slice(3))) { out.push(line); emitted = line; } continue; }
    const body = line.startsWith('- ') ? line.slice(2) : line;
    const keep = sentencesOf(body).filter(isRelevantSentence);
    if (!keep.length) continue;
    if (heading && emitted !== heading) { out.push(heading); emitted = heading; }
    for (const s of keep) out.push(s);
  }
  return out;
}

function extract(args) {
  const coll = JSON.parse(fs.readFileSync(path.resolve(argValue(args, '--collection')), 'utf8'));
  const liv = parseLivenessEvidence(argValue(args, '--page-liveness'));
  const probeFile = argValue(args, '--page-probe');
  const probes = new Map();
  if (probeFile) for (const l of fs.readFileSync(path.join(REPO, probeFile), 'utf8').split('\n')) { if (l.startsWith('{')) { const j = JSON.parse(l); probes.set(j.job_id, j); } }
  const outPath = path.resolve(argValue(args, '--out')); const fullOut = path.resolve(argValue(args, '--full-out'));
  if (!/^private\//.test(rel(fullOut))) throw new ContractError(['--full-out must be under private/ (full posting text is never committed)']);
  const mk = (p, lines) => {
    const lr = liv.get(p.url);
    const pr = probes.get(p.job_id);
    return {
      obs_id: `${p.board_slug}-${p.job_id}`, synthetic: false, employer: p.employer, company_query: p.board_name, title: p.title, job_id: p.job_id, url: p.url, location: p.location,
      captured_at: p.captured_at, first_published: p.first_published, updated_at: p.updated_at, text_sha256: p.text_sha256, text_chars: p.text.length,
      feed: { present: p.present_in_board_api, observed_at: p.captured_at, source: SRC.record, evidence: 'course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/selection.json' },
      page: lr ? { result: lr.result, code: lr.code, observed_at: lr.observed_at, source: SRC.record, evidence: argValue(args, '--page-liveness'), probe: pr ? { status: pr.status, document_title: pr.document_title, body_chars: pr.body_chars, body_has_posting_title: pr.body_has_posting_title, observed_at: pr.observed_at, evidence: probeFile } : null } : { result: 'uncertain', code: 'page check missing for this URL', source: SRC.input, observed_at: 'n/a' },
      content: { mode: lines === null ? 'full' : 'excerpts', lines: lines ?? p.text.split('\n') },
    };
  };
  const meta = { run_label: 'real public postings (12), captured 2026-10-21', protocol: coll.run.protocol, collected: { started_at: coll.run.started_at, finished_at: coll.run.finished_at, command: coll.run.command } };
  const full = { ...meta, kind: 'live-full-text (private)', kind_note: 'rules run on the full captured posting text (kept in private/, never committed)', observations: coll.postings.map((p) => mk(p, null)) };
  const ex = { ...meta, kind: 'replay-of-captured-excerpts', kind_note: 'rules re-run on the committed excerpts of postings captured live on 2026-10-21; no network was used for this run', excerpt_policy: 'only sentences any rule reads, with their section headings (SAMPLE-PROTOCOL.md §What is committed)', observations: coll.postings.map((p) => mk(p, excerptLines(p.text.split('\n')))) };
  fs.mkdirSync(path.dirname(fullOut), { recursive: true }); fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(fullOut, JSON.stringify(full, null, 2) + '\n');
  fs.writeFileSync(outPath, JSON.stringify(ex, null, 2) + '\n');
  const chars = ex.observations.map((o) => o.content.lines.join('\n').length); const fullChars = full.observations.map((o) => o.text_chars);
  return { observations: ex.observations.length, excerpt_chars: chars.reduce((a, b) => a + b, 0), full_chars: fullChars.reduce((a, b) => a + b, 0) };
}

export function compare(a, b) {
  const A = JSON.parse(fs.readFileSync(a, 'utf8')).roles; const B = new Map(JSON.parse(fs.readFileSync(b, 'utf8')).roles.map((r) => [r.obs_id, r]));
  const keys = (r) => ({ decision: r.next_action, decided_by: r.decided_by, liveness: r.liveness.state, vacancy: r.vacancy.state, eligibility: r.vacancy.eligibility, experience: r.experience.state, start: r.start_window.state, stack: r.stack.state, company: r.company.state, gates: r.gates.map((g) => g.status).join(',') });
  const diffs = [];
  for (const r of A) { const o = B.get(r.obs_id); if (!o) { diffs.push({ obs_id: r.obs_id, missing: true }); continue; } const ka = keys(r); const kb = keys(o); for (const k of Object.keys(ka)) if (ka[k] !== kb[k]) diffs.push({ obs_id: r.obs_id, field: k, a: ka[k], b: kb[k] }); }
  return { compared: A.length, differences: diffs };
}

// a1-input: express the same observations as Assignment 1 input, to compare decisions honestly.
function a1Input(args) {
  const doc = JSON.parse(fs.readFileSync(path.resolve(argValue(args, '--input')), 'utf8'));
  const roles = doc.observations.map((o) => ({
    role_id: o.obs_id, title: o.title, company_query: o.company_query || o.employer, synthetic: o.synthetic, posting_url: o.url, job_id: o.job_id,
    vacancy_text: toSentences(o.content.lines).map((s) => s.text).join(' '),
    recorded_liveness: { result: o.page.result, source: o.page.source, observed_at: o.page.observed_at, evidence: o.page.evidence, code_note: o.page.code },
    fit: { p: 0.5, source: SRC.input, note: 'comparison placeholder: Assignment 1 does not use fit for its decision' },
    timeline: { factor: 1.0, source: SRC.input, assumption: 'Assignment 1 cannot check start dates; 1.0 supplied only so its gates run (comparison only)' },
  }));
  fs.writeFileSync(path.resolve(argValue(args, '--out')), JSON.stringify({ run_label: 'Assignment 1 tool on the Assignment 2 real sample (comparison)', persona_ref: 'search/examples/tariq-lindqvist/profile.yml', roles }, null, 2) + '\n');
  return roles.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [cmd, ...args] = process.argv.slice(2);
  try {
    if (cmd === 'run') {
      const log = run(args);
      console.log(`✓ ${log.summary.n} openings (${log.run.kind}) → ${Object.entries(log.summary.counts).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
      const G = log.summary.experience_groups;
      console.log(`  experience groups: satisfied+core ${G.satisfied_with_core_stack.n} · unknown+core ${G.unknown_with_core_stack.n} · awaiting review ${G.awaiting_review.n} · documented mismatch ${G.documented_mismatch.n} · passed/unknown, stack not core ${G.other_not_core_stack.n}`);
      console.log(`  ${log.run.out_dir}/triage.json  +  ${log.run.out_dir}/triage.md`);
    } else if (cmd === 'extract') {
      const r = extract(args); console.log(`✓ extracted ${r.observations} observations · committed excerpt chars ${r.excerpt_chars} of ${r.full_chars} full-text chars`);
    } else if (cmd === 'compare') {
      const r = compare(path.resolve(args[0]), path.resolve(args[1]));
      console.log(`compared ${r.compared} openings · differences ${r.differences.length}`); for (const d of r.differences) console.log(`  ${JSON.stringify(d)}`);
      process.exit(r.differences.length ? 1 : 0);
    } else if (cmd === 'a1-input') {
      console.log(`✓ wrote ${a1Input(args)} roles in Assignment 1 input shape`);
    } else { console.error('usage: triage.mjs run|extract|compare|a1-input …'); process.exit(2); }
  } catch (err) {
    if (err instanceof ContractError) { console.error('✗ contract validation failed (G1) — nothing written:'); for (const m of err.errors) console.error(`  - ${m}`); process.exit(2); }
    throw err;
  }
}
