#!/usr/bin/env node
// skill-demand-monitor.mjs — promotes recipes/skill-demand-monitor.md from DRAFT to
// RUNNABLE. Infers which tools/skills/frameworks are mentioned across a set of job
// postings, filtered to a role if requested, and reports a ranked, evidence-linked
// frequency signal: which skills come up, in how many DISTINCT postings, and which
// postings (by job_id + URL) back that count.
//
// THIS IS A DEMAND-MENTION SIGNAL, NOT A HIRING-REQUIREMENT SIGNAL. A high count
// means employers mention a skill often — postings routinely list more than a role
// actually needs day one (recipes/skill-demand-monitor.card.md, failure mode 3).
//
// Gates are HARD STOPS, not votes: bad input, an empty role-filter match, or too
// small a sample all halt the run WITHOUT printing a ranked list, rather than
// confidently ranking on too little / too dirty data (the "gate-as-vote" bug this
// project exists to avoid — see the verification harness for the proof).
//
//   node scripts/score/skill-demand-monitor.mjs <postings.json>
//     [--role-filter "ai engineer"] [--min-sample 20] [--profile p.json]
//     [--taxonomy path.json] [--out-dir dir] [--md report.md]
//
// Input = a JSON array of unified job records (or {postings: [...]}), the same
// schema The Reallocation Engine's ATS pipeline already produces:
//   job_id, title, company_name, source_url, description_text, ...

import fs from 'node:fs';
import path from 'node:path';

// ───────────────────────────────────────────────────────────────────────────
// CONFIG — every threshold carries its provenance. Nothing here is a verified
// statistical fact; both are DEFINE-type authorial decisions, documented so a
// human can challenge them.
// ───────────────────────────────────────────────────────────────────────────
const CONFIG = {
  min_sample: 20,      // [DEFINE] below this, a ranking is not reported at all (Gate 3).
                        //   Chosen as a round, conservative floor for a first cut — not
                        //   derived from a power calculation. Override with --min-sample.
  coverage_floor: 0.4,  // [DEFINE] if more than 40% of candidate postings match ZERO
                        //   taxonomy skills, the run still ranks but flags low_coverage —
                        //   the taxonomy is human-curated, not verified-comprehensive.
  required_fields: ['job_id', 'title', 'company_name', 'source_url', 'description_text'],
  // Role-filter synonym table: an explicit, inspectable mapping — NOT fuzzy or
  // LLM-based matching. A filter not listed here falls back to a literal
  // substring match against the title. Extend this table for your own role
  // families; it is your-input, not a verified taxonomy.
  role_filter_synonyms: {
    'ai engineer': ['ai engineer', 'genai engineer', 'llm engineer'],
  },
};

const SRC = { record: 'record', script_output: 'script-output', your_input: 'your-input' };
const DEFAULT_TAXONOMY = path.join(path.dirname(new URL(import.meta.url).pathname), 'taxonomy', 'ai-engineering-skills.json');

const norm = (s) => String(s || '').toLowerCase().trim();

// ── Gate 1: schema — reject records missing required fields, never drop silently ──
function applySchemaGate(postings) {
  const valid = [];
  const rejects = [];
  for (const p of postings) {
    const missing = CONFIG.required_fields.filter((f) => !norm(p?.[f]));
    if (missing.length) rejects.push({ job_id: p?.job_id ?? null, reason: `missing_${missing[0]}` });
    else valid.push(p);
  }
  return { valid, rejects };
}

// ── Gate 2: role filter — explicit synonym list, substring match, no fuzziness ──
function applyRoleFilterGate(postings, roleFilter) {
  if (!roleFilter) return { candidates: postings, filter_applied: false, synonyms: [] };
  const key = norm(roleFilter);
  const synonyms = CONFIG.role_filter_synonyms[key] || [key];
  const candidates = postings.filter((p) => synonyms.some((s) => norm(p.title).includes(s)));
  return { candidates, filter_applied: true, synonyms };
}

// ── skill extraction: one count per DISTINCT posting, with full evidence ──
function extractSkills(postings, taxonomy) {
  const compiled = Object.entries(taxonomy.skills).map(([id, def]) => ({
    id, label: def.label, category: def.category,
    regexes: def.patterns.map((p) => new RegExp(p, 'i')),
  }));

  const bySkill = new Map(compiled.map((s) => [s.id, { id: s.id, label: s.label, category: s.category, posting_count: 0, evidence: [] }]));
  let postingsWithNoHit = 0;

  for (const p of postings) {
    const text = `${p.title} ${p.description_text}`;
    let hitAny = false;
    for (const s of compiled) {
      if (s.regexes.some((re) => re.test(text))) {
        hitAny = true;
        const rec = bySkill.get(s.id);
        rec.posting_count += 1;
        rec.evidence.push({ job_id: p.job_id, source_url: p.source_url });
      }
    }
    if (!hitAny) postingsWithNoHit += 1;
  }

  const skills = [...bySkill.values()]
    .filter((s) => s.posting_count > 0)
    .sort((a, b) => b.posting_count - a.posting_count || a.label.localeCompare(b.label));

  const zeroHitRate = postings.length ? postingsWithNoHit / postings.length : 0;
  return { skills, zeroHitRate, postingsWithNoHit };
}

function applyProfile(skills, profile) {
  if (!profile) return skills;
  const have = new Set((profile.skills || []).map(norm));
  return skills.map((s) => ({ ...s, has_evidence: have.has(s.id) }));
}

function renderMarkdown(result, meta) {
  const o = [];
  o.push(`# Skill-Demand Monitor report — ${meta.when}`);
  o.push(`\n*Role filter: ${meta.roleFilter ? `"${meta.roleFilter}"` : 'none (all postings)'} · Taxonomy: ${meta.taxonomyVersion} (${meta.skillCount} human-curated skills).*\n`);

  // ── Plain-English headline, first, before any table ────────────────────
  if (result.status === 'role_filter_matched_nothing') {
    o.push(`## In short\n`);
    o.push(`**No postings matched "${meta.roleFilter}."** Nothing to report — try a broader or differently-worded role filter, or check that your postings actually contain that title.\n`);
  } else if (result.status === 'insufficient_sample') {
    o.push(`## In short\n`);
    o.push(`**Only ${result.candidate_count} posting(s) matched — not enough to trust a ranking** (need at least ${result.min_sample_used}). This is the tool refusing to guess rather than showing you a confident-looking answer built on too little data. Broaden your role filter or collect more postings and try again.\n`);
  } else {
    const top = result.skills[0];
    o.push(`## In short\n`);
    o.push(`**${result.candidate_count} of ${result.total_postings_ingested} postings matched${meta.roleFilter ? ` "${meta.roleFilter}"` : ''} — clears the sample-size floor (≥ ${result.min_sample_used}).** Top skill: **${top ? `${top.label} (${((top.posting_count / result.candidate_count) * 100).toFixed(0)}% of postings)` : 'none found'}**.${result.low_coverage ? ' **Caution:** many postings matched no known skill — see the coverage warning below.' : ''}${result.min_sample_overridden_below_default ? ` **Caution: the sample-size floor was manually lowered to ${result.min_sample_used} (tool default: ${CONFIG.min_sample}) — treat this ranking with much less confidence than "cleared the gate" implies.**` : ''}\n`);

    const hasProfile = result.skills.some((s) => 'has_evidence' in s);
    if (hasProfile) {
      const gaps = result.skills.filter((s) => !s.has_evidence);
      o.push(`### Skills you don't have evidence for yet\n`);
      if (gaps.length === 0) {
        o.push(`None — your profile already covers every skill found in these postings.\n`);
      } else {
        o.push(`Sorted by how often they come up (most-mentioned first). This is a **frequency list, not a priority list** — deciding which gap matters most for your situation is your call, not this tool's (see Verified vs. inferred below).\n`);
        for (const s of gaps.slice(0, 10)) {
          o.push(`- **${s.label}** — mentioned in ${s.posting_count}/${result.candidate_count} postings (${((s.posting_count / result.candidate_count) * 100).toFixed(0)}%)`);
        }
        o.push('');
      }
    }
  }

  if (result.status !== 'ranked') {
    o.push(`## Technical detail: gates\n`);
    o.push('| Gate | Result | Detail |');
    o.push('|---|---|---|');
    o.push(`| 1. Schema | ${result.rejects.length ? 'partial' : 'clean'} | ${result.total_postings_ingested} ingested, ${result.valid_count} valid, ${result.rejects.length} rejected |`);
    o.push(`| 2. Role filter | ${result.gates.role_filter.filter_applied ? (result.gates.role_filter.matched_count > 0 ? 'matched' : '**HALT — 0 matches**') : 'not applied'} | ${result.gates.role_filter.filter_applied ? `${result.gates.role_filter.matched_count} of ${result.valid_count} matched synonyms [${result.gates.role_filter.synonyms.join(', ')}]` : '—'} |`);
    if (result.status === 'role_filter_matched_nothing')
      o.push(`| 3. Sample size | not reached | gate 2 halted the run first |`);
    else
      o.push(`| 3. Sample size | **HALT — ${result.candidate_count} < ${result.min_sample_used}** | min_sample=${result.min_sample_used}${result.min_sample_overridden_below_default ? ' (overridden below default)' : ' [DEFINE]'} |`);
    o.push(`\n**Run halted at status \`${result.status}\` — no ranked list is reported.** This is a deliberate gate, not an error: printing a ranking on zero-match or too-thin a sample would be exactly the "ran, looked reasonable, was wrong" failure this project exists to avoid.\n`);
    return o.join('\n') + '\n';
  }

  if (result.low_coverage)
    o.push(`\n> **Low taxonomy coverage.** ${(result.zero_hit_rate * 100).toFixed(0)}% of the ${result.candidate_count} candidate postings matched zero taxonomy skills — the taxonomy (\`${meta.taxonomyVersion}\`, ${meta.skillCount} entries) is likely missing terms for this role/company mix. Treat the ranking below as partial coverage, not a comprehensive signal.\n`);

  o.push(`\n## Full ranked list (${result.skills.length} skills found across ${result.candidate_count} candidate postings)\n`);
  const hasProfile = result.skills.some((s) => 'has_evidence' in s);
  o.push(`| Skill | Category | Postings | % of candidates | ${hasProfile ? 'Have evidence? | ' : ''}Sample evidence |`);
  o.push(`|---|---|---|---|${hasProfile ? '---|' : ''}---|`);
  for (const s of result.skills) {
    const pct = ((s.posting_count / result.candidate_count) * 100).toFixed(0);
    const sample = s.evidence.slice(0, 3).map((e) => `[${e.job_id}](${e.source_url})`).join(', ');
    const evCol = hasProfile ? `${s.has_evidence ? 'yes' : '**no**'} | ` : '';
    o.push(`| ${s.label} | ${s.category} | ${s.posting_count} | ${pct}% | ${evCol}${sample} |`);
  }

  o.push('\n## Verified vs. inferred');
  o.push('- Posting fields (title, company, URL) — **record** (from the input file).');
  o.push('- Skill mention / posting counts and their evidence links — **script-output** (deterministic regex match against a dated taxonomy; see coverage note above for confidence).');
  o.push('- Which gap matters most to learn next — **not computed here**. Frequency and profile-evidence are reported as facts about the input; prioritizing among them is a human judgment call (`recipes/skill-demand-monitor.card.md`, failure mode 5).');

  o.push(`\n## Technical detail: gates\n`);
  o.push('| Gate | Result | Detail |');
  o.push('|---|---|---|');
  o.push(`| 1. Schema | ${result.rejects.length ? 'partial' : 'clean'} | ${result.total_postings_ingested} ingested, ${result.valid_count} valid, ${result.rejects.length} rejected |`);
  o.push(`| 2. Role filter | ${result.gates.role_filter.filter_applied ? 'matched' : 'not applied'} | ${result.gates.role_filter.filter_applied ? `${result.gates.role_filter.matched_count} of ${result.valid_count} matched synonyms [${result.gates.role_filter.synonyms.join(', ')}]` : '—'} |`);
  o.push(`| 3. Sample size | pass (${result.candidate_count} ≥ ${result.min_sample_used}) | min_sample=${result.min_sample_used}${result.min_sample_overridden_below_default ? ` (overridden below default of ${CONFIG.min_sample})` : ' [DEFINE]'} |`);
  o.push(`| 4. Taxonomy coverage | ${result.low_coverage ? `**low coverage — ${(result.zero_hit_rate * 100).toFixed(0)}% of postings matched nothing**` : 'ok'} | coverage_floor=${(CONFIG.coverage_floor * 100).toFixed(0)}% [DEFINE] |`);
  o.push('\n*Every count above traces to specific job_ids. If you cannot find a skill\'s evidence postings, distrust the count before your confusion.*');
  return o.join('\n') + '\n';
}

function main() {
  const args = process.argv.slice(2);
  const src = args.find((a) => !a.startsWith('--'));
  if (!src || !fs.existsSync(src)) {
    console.error('Usage: skill-demand-monitor.mjs <postings.json> [--role-filter "ai engineer"] [--min-sample 20] [--profile p.json] [--taxonomy path.json] [--out-dir dir] [--md report.md]');
    process.exit(2);
  }
  const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
  const roleFilter = flag('role-filter');
  const minSample = flag('min-sample') ? parseInt(flag('min-sample'), 10) : CONFIG.min_sample;
  const profilePath = flag('profile');
  const taxonomyPath = flag('taxonomy') || DEFAULT_TAXONOMY;
  const outDir = flag('out-dir') || path.dirname(src);
  const mdOut = flag('md') || path.join(outDir, 'skill-demand.md');

  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  let raw = JSON.parse(fs.readFileSync(src, 'utf8'));
  const postings = Array.isArray(raw) ? raw : (raw.postings || []);
  const profile = profilePath ? JSON.parse(fs.readFileSync(profilePath, 'utf8')) : null;

  const { valid, rejects } = applySchemaGate(postings);
  const roleGate = applyRoleFilterGate(valid, roleFilter);

  let result = {
    total_postings_ingested: postings.length,
    valid_count: valid.length,
    rejects,
    rejects_by_reason: rejects.reduce((acc, r) => ((acc[r.reason] = (acc[r.reason] || 0) + 1), acc), {}),
    // the ACTUAL threshold enforced this run — never assume it equals CONFIG.min_sample;
    // a caller can override it via --min-sample, and every report must reflect what
    // was actually checked, not the tool's own default.
    min_sample_used: minSample,
    min_sample_overridden_below_default: minSample < CONFIG.min_sample,
    gates: {
      role_filter: { filter_applied: roleGate.filter_applied, synonyms: roleGate.synonyms, matched_count: roleGate.candidates.length },
    },
  };

  if (roleGate.filter_applied && roleGate.candidates.length === 0) {
    result.status = 'role_filter_matched_nothing';
    result.candidate_count = 0;
  } else if (roleGate.candidates.length < minSample) {
    result.status = 'insufficient_sample';
    result.candidate_count = roleGate.candidates.length;
  } else {
    const { skills, zeroHitRate } = extractSkills(roleGate.candidates, taxonomy);
    result.status = 'ranked';
    result.candidate_count = roleGate.candidates.length;
    result.zero_hit_rate = Number(zeroHitRate.toFixed(4));
    result.low_coverage = zeroHitRate > CONFIG.coverage_floor;
    result.skills = applyProfile(skills, profile);
  }

  const meta = {
    when: new Date().toISOString().slice(0, 10),
    roleFilter,
    taxonomyVersion: `${taxonomy._taxonomy}@${taxonomy._version}`,
    skillCount: Object.keys(taxonomy.skills).length,
  };

  fs.mkdirSync(outDir, { recursive: true });
  const jsonOut = path.join(outDir, 'skill-demand.json');
  fs.writeFileSync(jsonOut, JSON.stringify({
    _tool: 'skill-demand-monitor', _recipe: 'recipes/skill-demand-monitor.md',
    generated: meta.when, config: { min_sample: minSample, coverage_floor: CONFIG.coverage_floor },
    role_filter: roleFilter || null, taxonomy: meta.taxonomyVersion, ...result,
  }, null, 2));
  fs.writeFileSync(mdOut, renderMarkdown(result, meta));

  console.log(`✓ skill-demand-monitor: ${result.total_postings_ingested} ingested → ${result.valid_count} valid → ${result.candidate_count} candidates → status: ${result.status}`);
  if (result.status === 'ranked') console.log(`  ${result.skills.length} skills ranked; low_coverage=${result.low_coverage}`);
  console.log(`  ${path.relative(process.cwd(), jsonOut)}  +  ${path.relative(process.cwd(), mdOut)}`);
}

main();
