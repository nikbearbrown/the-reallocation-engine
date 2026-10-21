#!/usr/bin/env node
// analyst_check.mjs — Data-Analyst Sponsor Check (riyask29, 2026fa).
//
// For an F-1 OPT student targeting Data / BI Analyst roles: for each candidate
// posting, did this company sponsor a *data-analyst* title (not just "Cyber
// Analyst"), is the posting live, and can hiring finish before the OPT clock
// runs out? Writes a roles.json, scores it with the EXISTING scorer
// (scripts/score/role-scorer.mjs — not a copy), then writes:
//   analyst-check-log.json   — for the agent (every value + its source label)
//   analyst-check-report.md  — for the person (summary, next actions, gates)
//
//   node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
//     [--persona p.json] [--candidates c.json] [--liveness-file l.json] \
//     [--out-dir dir] [--today YYYY-MM-DD] [--sponsors csv] [--bls csv] [--formd-dir dir]
//
// Network: only when --liveness-file is NOT given, and only to the posting
// URLs listed in the candidates file (via scripts/ats/liveness-browser.mjs).
// Exit codes: 0 ran; 2 bad input / scorer disagreement (nothing written as if valid).

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  SRC, readCsv, findCompany, parseTitleList, classifyTitle, sponsorshipTier,
  timelineFactor, wageCheck, formDLookup, formDComplete, lcaLookup, nextAction,
} from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const rel = (p) => path.relative(ROOT, p);

function die(msg) { console.error(`✗ ${msg}`); process.exit(2); }

function args() {
  const a = process.argv.slice(2);
  const get = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const abs = (p) => (p ? path.resolve(process.cwd(), p) : p);
  return {
    persona: abs(get('--persona', path.join(HERE, 'inputs/persona.example.json'))),
    candidates: abs(get('--candidates', path.join(HERE, 'inputs/candidates.json'))),
    families: abs(get('--families', path.join(HERE, 'config/title-families.json'))),
    sponsors: abs(get('--sponsors', path.join(ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv'))),
    bls: abs(get('--bls', path.join(ROOT, 'data/bls/compact/soc_occupation_compact.csv'))),
    formdDir: abs(get('--formd-dir', path.join(ROOT, 'data/sec/form-d/processed/sample'))),
    lca: abs(get('--lca', null)),
    livenessFile: abs(get('--liveness-file', null)),
    outDir: abs(get('--out-dir', path.join(HERE, 'out'))),
    today: get('--today', new Date().toISOString().slice(0, 10)),
  };
}

function readJson(p, what) {
  if (!fs.existsSync(p)) die(`${what} not found: ${p}`);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { die(`${what} is not valid JSON: ${p} (${e.message})`); }
}

function validatePersona(p) {
  const v = p?.visa || {};
  const need = ['opt_end_date', 'unemployment_days_used', 'unemployment_ceiling', 'buffer_target_days', 'current_status'];
  const missing = need.filter((k) => v[k] === undefined || v[k] === null || v[k] === '');
  if (missing.length) die(`persona.visa is missing ${missing.join(', ')} — refusing to guess a timeline`);
  if (typeof p.needs_sponsorship !== 'boolean') die('persona.needs_sponsorship must be true or false — refusing to guess');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.opt_end_date)) die(`persona.visa.opt_end_date must be YYYY-MM-DD, got "${v.opt_end_date}"`);
  if (!Array.isArray(p.target_soc) || !p.target_soc.length) die('persona.target_soc must list at least one SOC code');
}

async function checkLiveness(urls) {
  if (!urls.length) return {};
  const { chromium } = await import('playwright');
  const { checkUrlLiveness } = await import(path.join(ROOT, 'scripts/ats/liveness-browser.mjs'));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const out = {};
  try {
    for (const u of urls) {
      // One retry, only for a navigation error (timeout, DNS, TLS). On
      // 2026-10-02 Abacus read `active`, then timed out 25 minutes later.
      // A page that loaded and showed no apply control is not retried.
      let r = await checkUrlLiveness(page, u);
      let attempts = 1;
      if (r.result === 'uncertain' && r.code === 'navigation_error') { r = await checkUrlLiveness(page, u); attempts = 2; }
      out[u] = { result: r.result, reason: r.reason, code: r.code, attempts, checked_at: new Date().toISOString() };
      console.log(`  liveness ${r.result.padEnd(9)} ${u}`);
    }
  } finally { await browser.close(); }
  return out;
}

function evaluate(c, ctx) {
  const e = {
    role_id: c.role_id, company_query: c.company, title: c.title, url: c.url ?? null,
    fit: Number.isFinite(c.fit_self_rating) ? { p: c.fit_self_rating, source: SRC.input } : null,
    stopped_at: null,
  };

  // G1 — company identity
  const m = findCompany(ctx.sponsors, c.company);
  e.company_match = { status: m.status, matched_name: m.row?.company_name ?? null, near_matches: m.near, source: SRC.record };
  if (m.row) {
    e.funding = formDLookup(ctx.formD, m.row.company_name);
    e.wage_check = wageCheck(ctx.bls, ctx.persona.target_soc, m.status === 'found' ? m.row : null);
  }
  if (ctx.lca) e.lca = lcaLookup(ctx.lca, m.row?.company_name ?? c.company, ctx.lcaFile);
  if (m.status !== 'found') {
    e.sponsorship = null; // never p = 0: "not in this list" is not "never sponsored"
    e.stopped_at = 'G1';
    return e;
  }

  const r = m.row;
  const titles = parseTitleList(r.top_job_titles_sponsored).map((t) => classifyTitle(t, ctx.families));
  const tier = sponsorshipTier(titles, ctx.families);
  e.sponsorship = {
    total_approvals: Number(r['Total Approvals']), total_denials: Number(r['Total Denials']),
    approval_rate: Number(r.Approval_Rate), counts_source: SRC.record,
    sponsored_titles: titles, titles_source: SRC.record, classification_source: SRC.input,
    tier: tier.tier, p: tier.p, p_source: tier.p_source,
    caveat: 'top_job_titles_sponsored is a truncated "top" list; absence of a title is not evidence it was never sponsored',
  };
  e.g4_review = titles.filter((t) => t.family === 'data-analyst-family' || t.family === 'ambiguous-analyst');

  // G3 — timeline (computed for every found company so the human sees the dates)
  e.timeline = timelineFactor(ctx.persona, c.hiring_lag_weeks, ctx.today);
  if (e.timeline.factor === null) { e.stopped_at = 'G3'; return e; }

  // G2 — liveness
  if (!c.url) { e.liveness = { result: 'no-posting', source: SRC.input }; e.stopped_at = 'no-posting'; return e; }
  const l = ctx.liveness[c.url];
  if (!l) { e.liveness = { result: 'not-checked', source: SRC.record }; e.stopped_at = 'G2'; return e; }
  // A liveness file may carry a person's G2 check (source: your-input); a
  // Playwright result is a record. Anything else is not trusted as either.
  e.liveness = { ...l, source: l.source === SRC.input ? SRC.input : SRC.record };
  if (l.result !== 'active' && l.result !== 'expired') e.stopped_at = 'G2';
  return e;
}

function toScorerRole(e) {
  return {
    role_id: e.role_id, company: e.company_match.matched_name, title: e.title,
    sponsorship: { p: e.sponsorship.p, tier: e.sponsorship.tier, source: SRC.input },
    ...(e.fit ? { fit: { p: e.fit.p, source: SRC.input } } : {}),
    liveness: { factor: e.liveness.result === 'active' ? 1 : 0, source: e.liveness.source },
    timeline: { factor: e.timeline.factor, source: SRC.input },
  };
}

function runScorer(rolesPath, profilePath, outDir, needsSponsorship) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/score/role-scorer.mjs'), rolesPath,
    '--profile', profilePath, '--out-dir', outDir], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) die(`scorer exited ${r.status}: ${r.stderr || r.stdout}`);
  const scored = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8'));
  // Guard against the scorer's free-text authorization regex (it reads
  // "work authorized" as "no sponsorship needed" and zeroes the weight).
  if (scored.profile_needs_sponsorship !== needsSponsorship)
    die(`scorer read the profile as needs_sponsorship=${scored.profile_needs_sponsorship}, persona says ${needsSponsorship}. ` +
        `Its regex misread visa.current_status — scores would be wrong, so nothing is reported.`);
  return { stdout: r.stdout.trim(), scored };
}

const fmtMoney = (n) => (n == null ? '—' : `$${Math.round(n).toLocaleString('en-US')}`);
const ACTION_LABEL = {
  'tailor-application': 'Tailor and apply', 'review-then-tailor': 'Review titles, then tailor',
  network: 'Network first (informational chat)', skip: 'Skip', 'resolve-company': 'Human: confirm the company',
  'check-posting-by-hand': 'Human: open the posting', 'fix-input': 'Human: fix missing input',
};

function renderReport(log) {
  const o = [];
  const n = (a) => log.roles.filter((e) => e.next_action.action === a).length;
  const apply = n('tailor-application') + n('review-then-tailor');
  o.push(`# Data-Analyst Sponsor Check — ${log.run.today}`, '');
  o.push('## Executive summary', '');
  o.push(`This report checks ${log.roles.length} job leads for a fictional international student on F-1 OPT ` +
    `who is looking for data analyst work in the Boston area. For each lead it asks three questions: has this ` +
    `company sponsored work visas for *data-analyst* jobs specifically, is the job posting still open, and can ` +
    `hiring finish before the student's work permission or allowed unemployment days run out?`, '');
  o.push(`**Result:** ${apply} lead(s) worth tailoring an application for, ${n('network')} to network into instead, ` +
    `${n('skip')} to skip, and ${n('resolve-company') + n('check-posting-by-hand') + n('fix-input')} that need a person to look before ` +
    `anything else happens. The deadline that binds first is the **${log.persona.binding_clock === 'unemployment-days' ? '90-day unemployment limit' : 'OPT end date'}**: ` +
    `${log.persona.runway_days} days of runway left on ${log.run.today}.`, '');
  o.push('Nothing here is legal advice. Questions about OPT or STEM-extension eligibility go to the DSO.', '');

  o.push('## Run record', '');
  o.push(`- Prototype: \`${log.run.prototype}\``);
  o.push(`- Data: sponsors \`${log.run.inputs.sponsors}\` · wages \`${log.run.inputs.bls}\` · Form D \`${log.run.inputs.formd_dir}\` (${log.run.form_d_complete ? 'full quarters, fetched locally' : 'samples only'})`);
  o.push(`- Liveness: ${log.run.liveness_mode}`);
  o.push(`- Scorer: \`scripts/score/role-scorer.mjs\` → ${log.scorer_stdout.split('\n')[0]}`, '');

  o.push('## Leads and next actions', '');
  o.push('| Lead | Analyst-sponsor tier | Posting | Timeline | Scorer | Next action |');
  o.push('|---|---|---|---|---|---|');
  for (const e of log.roles) {
    const tier = e.sponsorship ? `${e.sponsorship.tier} (p ${e.sponsorship.p})` : `— (${e.company_match.status})`;
    const live = e.liveness ? e.liveness.result : '—';
    const tl = e.timeline ? `${e.timeline.factor ?? '—'} (${e.timeline.status})` : '—';
    const sc = e.scorer ? `${e.scorer.recommendation} ${e.scorer.composite.toFixed(3)}` : 'not scored';
    o.push(`| ${e.company_query} — ${e.title} | ${tier} | ${live} | ${tl} | ${sc} | **${ACTION_LABEL[e.next_action.action]}** — ${e.next_action.why} |`);
  }
  o.push('');

  o.push('## Evidence per lead (every value labeled)', '');
  for (const e of log.roles) {
    o.push(`### ${e.company_query} — ${e.title}`, '');
    o.push(`- Company match [record]: **${e.company_match.status}**${e.company_match.matched_name ? ` → ${e.company_match.matched_name}` : ''}` +
      (e.company_match.near_matches.length ? `; near matches for a human: ${e.company_match.near_matches.join('; ')}` : ''));
    if (e.sponsorship) {
      const s = e.sponsorship;
      o.push(`- H-1B approvals / denials [record]: ${s.total_approvals} / ${s.total_denials}`);
      o.push(`- Sponsored titles [record] → my classification [your-input]: ` +
        s.sponsored_titles.map((t) => `"${t.title}" → ${t.family}${t.matched ? ` (\`${t.matched}\`)` : ''}`).join('; '));
      o.push(`- Tier [your-input rule on record]: **${s.tier}** · p = ${s.p} [your-input mapping]`);
    }
    for (const w of e.wage_check || [])
      o.push(w.status === 'ok'
        ? `- Wage check ${w.soc} ${w.title} [record]: BLS median ${fmtMoney(w.bls_annual_median)} (OEWS ${w.oews_year}) vs company median offered ${fmtMoney(w.company_median_salary_offered)} → ratio ${w.ratio_company_to_bls ?? '—'} — ${w.caveat}. *Not a scorer input.*`
        : `- Wage check ${w.soc} [record]: **${w.status}**, no value substituted`);
    if (e.funding) o.push(`- Form D [record]: ${e.funding.status} — ${e.funding.meaning} (${e.funding.coverage})`);
    if (e.lca) o.push(`- DOL LCA [record]: ${e.lca.status} — core ${e.lca.core_lcas}, adjacent ${e.lca.adjacent_lcas} — ${e.lca.meaning}`);
    if (e.timeline) o.push(`- Timeline [your-input]: factor ${e.timeline.factor ?? '—'} (${e.timeline.status}); ${e.timeline.arithmetic || `hiring lag ${e.timeline.hiring_lag_days} days`}`);
    if (e.liveness) o.push(`- Posting [${e.liveness.source}]: ${e.liveness.result}${e.liveness.reason ? ` — ${e.liveness.reason}` : ''}${e.liveness.checked_at ? ` (checked ${e.liveness.checked_at})` : ''}`);
    if (e.fit) o.push(`- Fit [your-input]: ${e.fit.p} (self-rated; no model was asked)`);
    if (e.scorer) o.push(`- Scorer: **${e.scorer.recommendation}** — ${e.scorer.reason}; \`${e.scorer.arithmetic}\``);
    o.push('');
  }

  o.push('## Gates a person must clear', '');
  o.push('- **G1 Company identity.** For every lead marked *not-in-dataset*, *no-h1b-record*, *ambiguous* or *near matches*: confirm the right company or accept "unknown". Missing from this dataset does not mean the company never sponsors.');
  o.push('- **G2 Posting.** Open every *active* posting yourself before tailoring. Open any *uncertain* one before it is scored.');
  o.push('- **G3 Timeline.** Check the dates in each timeline line. If you are unsure about STEM-extension eligibility, ask your DSO, not this tool.');
  o.push('- **G4 Title review.** For each Proven or Likely lead, read the matched titles below and confirm they are work you would do:');
  for (const e of log.roles) for (const t of e.g4_review || []) o.push(`  - ${e.company_query}: "${t.title}" matched \`${t.matched}\` → ${t.family}`);
  if (log.run.inputs.lca) {
    o.push('', '  The same check by occupation code (DOL LCA records, certified H-1B, Massachusetts worksites):');
    for (const e of log.roles) for (const s of e.lca?.by_soc || []) o.push(`  - ${e.company_query}: ${s.certified_lcas} × ${s.soc_code} ${s.soc_title} (${s.family}) — e.g. ${s.top_job_titles}`);
    for (const e of log.roles) if (e.lca && e.lca.status !== 'found') o.push(`  - ${e.company_query}: no certified analyst-family LCA under this name in the file`);
  }
  o.push('');
  o.push('## What this run could not verify', '');
  for (const x of log.cannot_verify) o.push(`- ${x}`);
  return o.join('\n') + '\n';
}

async function main() {
  const a = args();
  const persona = readJson(a.persona, 'persona');
  validatePersona(persona);
  const cand = readJson(a.candidates, 'candidates').candidates;
  if (!Array.isArray(cand) || !cand.length) die('candidates file has no "candidates" list');
  const families = readJson(a.families, 'title-families config');
  for (const p of [a.sponsors, a.bls, a.formdDir]) if (!fs.existsSync(p)) die(`data path missing: ${p}`);

  const formD = fs.readdirSync(a.formdDir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => readJson(path.join(a.formdDir, f), `Form D sample ${f}`));
  if (a.lca && !fs.existsSync(a.lca)) die(`data path missing: ${a.lca}`);
  const ctx = { persona, families, today: a.today, sponsors: readCsv(a.sponsors), bls: readCsv(a.bls), formD,
    lca: a.lca ? readCsv(a.lca) : null, lcaFile: a.lca ? path.basename(a.lca) : '' };

  // pass 1 — everything except liveness, to know which URLs are worth checking
  const pre = cand.map((c) => evaluate(c, { ...ctx, liveness: {} }));
  const urls = pre.filter((e) => e.stopped_at === 'G2' && e.liveness?.result === 'not-checked').map((e) => e.url);
  let liveness, livenessMode;
  if (a.livenessFile) { liveness = readJson(a.livenessFile, 'liveness file'); livenessMode = `recorded results from \`${rel(a.livenessFile)}\``; }
  else { console.log(`Checking ${urls.length} posting URL(s) with Playwright…`); liveness = await checkLiveness(urls); livenessMode = 'live Playwright check this run (scripts/ats/liveness-browser.mjs)'; }

  const roles = cand.map((c) => evaluate(c, { ...ctx, liveness }));
  const scorable = roles.filter((e) => e.stopped_at === null);

  fs.mkdirSync(a.outDir, { recursive: true });
  if (!a.livenessFile) fs.writeFileSync(path.join(a.outDir, 'liveness.json'), JSON.stringify(liveness, null, 2) + '\n');
  const rolesPath = path.join(a.outDir, 'roles.json');
  const profilePath = path.join(a.outDir, 'scorer-profile.json');
  fs.writeFileSync(rolesPath, JSON.stringify(scorable.map(toScorerRole), null, 2) + '\n');
  fs.writeFileSync(profilePath, JSON.stringify({ authorization: persona.visa.current_status }, null, 2) + '\n');

  let scorerStdout = 'no role reached the scorer';
  if (scorable.length) {
    const { stdout, scored } = runScorer(rolesPath, profilePath, a.outDir, persona.needs_sponsorship);
    scorerStdout = stdout;
    for (const s of scored.roles) {
      const e = roles.find((x) => x.role_id === s.role_id);
      e.scorer = { recommendation: s.recommendation, composite: s.composite, reason: s.reason, arithmetic: s.trace.arithmetic, source: 'scripts/score/role-scorer.mjs' };
    }
  }
  for (const e of roles) e.next_action = nextAction(e);

  const tl = timelineFactor(persona, 1, a.today);
  const log = {
    _prototype: 'riyask29-data-analyst-sponsor-boston', _version: '0.1.0',
    run: {
      today: a.today, prototype: rel(path.join(HERE, 'analyst_check.mjs')), liveness_mode: livenessMode, form_d_complete: formDComplete(formD),
      inputs: { persona: rel(a.persona), candidates: rel(a.candidates), families: rel(a.families), sponsors: rel(a.sponsors), bls: rel(a.bls), formd_dir: rel(a.formdDir), lca: a.lca ? rel(a.lca) : null },
      outputs: ['roles.json', 'scorer-profile.json', 'role-scores.json', 'role-scores.md', 'analyst-check-log.json', 'analyst-check-report.md'],
    },
    persona: { name: persona.candidate?.name, fictional: true, binding_clock: tl.binding_clock, runway_days: tl.runway_days, source: SRC.input },
    counts: {
      candidates: roles.length, scored: scorable.length,
      stopped: Object.fromEntries(['G1', 'G2', 'G3', 'no-posting'].map((g) => [g, roles.filter((e) => e.stopped_at === g).length])),
      form_d_in_sample: roles.filter((e) => ['in-sample', 'filed'].includes(e.funding?.status)).length,
    },
    scorer_stdout: scorerStdout,
    roles,
    cannot_verify: [
      ctx.lca
        ? 'Sponsorship by SOC code (DOL LCA, one fiscal-year file, Massachusetts worksites, exact employer name): an LCA is filed before the H-1B petition, so it is not an approval, one LCA can cover several workers, and a company filing under another legal name, or outside Massachusetts, reads as "none".'
        : 'Whether a company sponsored data analysts specifically: the sponsor CSV lists job titles, not SOC codes, and only a truncated "top" list of them.',
      'Whether the title keyword rules are right: they are the student\'s rules, and every match is shown for human review (G4).',
      formDComplete(formD)
        ? 'Funding: full Form D quarters were used, but only exact-name matches count, Form D covers private raises only, and the newest quarter available lags months behind.'
        : 'Funding: the shipped Form D files are 50-company samples per quarter, so "not-in-sample" means nothing either way.',
      'What a specific employer pays an analyst: the company median covers all its sponsored roles, and BLS OEWS is an occupation survey, not an offer.',
      'Hiring lag and fit: both are the student\'s own estimates.',
      'Visa law: the timeline factor is planning arithmetic. STEM-extension eligibility needs a DSO.',
    ],
  };
  fs.writeFileSync(path.join(a.outDir, 'analyst-check-log.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(a.outDir, 'analyst-check-report.md'), renderReport(log));

  console.log(`✓ ${roles.length} leads · scored ${scorable.length} · stopped G1 ${log.counts.stopped.G1} · G2 ${log.counts.stopped.G2} · G3 ${log.counts.stopped.G3} · no-posting ${log.counts.stopped['no-posting']}`);
  console.log(`  scorer: ${scorerStdout.split('\n')[0]}`);
  for (const e of roles) console.log(`  ${e.role_id.padEnd(24)} ${e.next_action.action.padEnd(20)} ${e.next_action.why}`);
  console.log(`  → ${rel(path.join(a.outDir, 'analyst-check-log.json'))}  +  ${rel(path.join(a.outDir, 'analyst-check-report.md'))}`);
}

main().catch((err) => die(err.stack || String(err)));
