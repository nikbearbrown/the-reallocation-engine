#!/usr/bin/env node
// role-scorer.mjs — the Bayesian Role Scorer (book Chapter 11).
// The decision core: combine the upstream evidence numbers into one auditable
// recommendation per role — Apply / Consider / Skip.
//
//   Composite = ( Σ vote_i · weight_i ) × liveness × timeline
//
// Votes are graduated (sponsorship, fit, role-quality). Liveness and timeline
// are GATES — multipliers, not addends — so a ghost posting or an impossible
// start date zeroes the composite no matter how strong the votes (Ch.11 §"Why
// liveness and timeline are multipliers"). Threshold ≈ 0.3.
//
// THE WHOLE POINT IS AUDITABILITY (Ch.11 §"The cautionary mirror"): every term
// is emitted with its value AND its source type — record / model-judgment /
// your-input — and the arithmetic is shown. A recommendation you cannot trace
// to its sources is one to distrust.
//
//   node scripts/score/role-scorer.mjs <roles.json> [--profile p.json] [--out-dir dir] [--md report.md]
//
// This script COMBINES; it does not compute the components (those are the
// upstream feeds: Ch.7 sponsorship, Ch.8 liveness, Ch.9 role quality, Ch.10
// timeline, and the model-judged fit). Input = a list of role-evidence records.

import fs from 'node:fs';
import path from 'node:path';

// ───────────────────────────────────────────────────────────────────────────
// CONFIG — every weight/threshold carries its provenance. Defaults reproduce
// Ch.11's worked example exactly. Items marked [VERIFY] are NOT pinned by the
// chapter (its footnote flags them against the system design document); do not
// treat them as settled — confirm before publication.
// ───────────────────────────────────────────────────────────────────────────
const CONFIG = {
  weights: {
    sponsorship: 0.35,   // [Ch.11] stated. Profile-conditional (see applyProfile).
    fit: 0.30,           // [Ch.11] stated. Model judgment.
    role_quality: 0.0,   // [VERIFY] "other weighted factors" (Ch.11) — UNPINNED: neither
                         //   Ch.11 nor docs/search-profile-design.md gives this a number
                         //   (verified 2026-06-14). Default 0 reproduces Ch.11's worked
                         //   example — but it also means the Ch.9 role-quality signal
                         //   contributes NOTHING to the composite. Whether role quality
                         //   should carry weight is an open authorial decision.
  },
  apply_threshold: 0.30, // [Ch.11] decision threshold "near 0.3".
  consider_floor: 0.20,  // [VERIFY] lower edge of the Consider band — not pinned by Ch.11 or the SDD (verified 2026-06-14); placeholder.
  gate_zero: 0.05,       // a gate at/below this is treated as closed → Skip (gated).
  // a vote whose tier is a "soft spot" (e.g. Likely not Proven) demotes Apply→Consider:
  soft_sponsorship_tiers: ['likely', 'possible', 'unknown'],
};

const SRC = { record: 'record', model: 'model-judgment', input: 'your-input' };

// ── profile-conditional weighting (design doc: weights are a function of the
//    profile, not constants). If the candidate doesn't need sponsorship, the
//    sponsorship term stops being a binding constraint and its weight → 0. ──
function applyProfile(weights, profile) {
  const w = { ...weights };
  const auth = (profile?.authorization || '').toLowerCase();
  const needsSponsor = profile == null ? true
    : !/citizen|permanent|green|gc|pr\b|no.?sponsor|authorized/.test(auth);
  if (!needsSponsor) w.sponsorship = 0; // a perfect-fit non-sponsor is no longer a skip
  return { w, needsSponsor };
}

const num = (x) => (typeof x === 'number' && isFinite(x) ? x : null);
const fmt = (x) => (x == null ? '—' : Number(x).toFixed(3));

function scoreRole(role, weights, needsSponsor) {
  // collect votes present on the record, each with value + source
  const votes = [];
  const push = (key, obj, defSrc) => {
    const p = num(obj?.p);
    if (p == null) return;
    votes.push({ key, p, weight: weights[key] ?? 0, source: obj.source || defSrc });
  };
  push('sponsorship', role.sponsorship, SRC.record);
  push('fit', role.fit, SRC.model);
  push('role_quality', role.role_quality, SRC.record);

  const voteSum = votes.reduce((s, v) => s + v.p * v.weight, 0);

  // gates (multipliers)
  const liveness = num(role.liveness?.factor) ?? 1;
  const timeline = num(role.timeline?.factor) ?? 1;
  const gates = [
    { key: 'liveness', factor: liveness, source: role.liveness?.source || SRC.record },
    { key: 'timeline', factor: timeline, source: role.timeline?.source || SRC.input },
  ];
  const gateProduct = gates.reduce((s, g) => s * g.factor, 1);
  const composite = voteSum * gateProduct;

  // classification
  const closedGate = gates.find((g) => g.factor <= CONFIG.gate_zero);
  let rec, reason;
  if (closedGate) {
    rec = 'Skip';
    reason = `gated: ${closedGate.key} ≈ ${fmt(closedGate.factor)} (a closed gate zeroes the composite regardless of votes)`;
  } else if (composite >= CONFIG.apply_threshold) {
    const tier = (role.sponsorship?.tier || '').toLowerCase();
    const softSponsor = needsSponsor && tier && CONFIG.soft_sponsorship_tiers.includes(tier);
    const softTimeline = timeline < 0.6;
    if (softSponsor || softTimeline) {
      rec = 'Consider';
      reason = `above threshold (${fmt(composite)}) but one soft spot: ${softSponsor ? `sponsorship tier "${role.sponsorship.tier}"` : `timeline ${fmt(timeline)}`}`;
    } else { rec = 'Apply'; reason = `composite ${fmt(composite)} ≥ ${CONFIG.apply_threshold}, gates healthy`; }
  } else if (composite >= CONFIG.consider_floor) {
    rec = 'Consider';
    reason = `composite ${fmt(composite)} in the Consider band [${CONFIG.consider_floor}, ${CONFIG.apply_threshold})`;
  } else {
    rec = 'Skip';
    reason = `composite ${fmt(composite)} < ${CONFIG.consider_floor} — time is better spent elsewhere`;
  }

  // human override (Ch.11 §"override with a documented reason")
  let overridden = null;
  if (role.override && role.override.decision) {
    if (!role.override.reason || !String(role.override.reason).trim())
      overridden = { ...role.override, _warning: 'override WITHOUT a documented reason — ignored (Ch.11: that is just ignoring the math)' };
    else { overridden = role.override; }
  }

  return {
    role_id: role.role_id ?? null,
    company: role.company ?? null,
    title: role.title ?? null,
    composite: Number(composite.toFixed(4)),
    recommendation: overridden && overridden.reason ? overridden.decision : rec,
    machine_recommendation: rec,
    reason,
    override: overridden,
    trace: {
      votes: votes.map((v) => ({ factor: v.key, value: v.p, weight: v.weight, contribution: Number((v.p * v.weight).toFixed(4)), source: v.source })),
      vote_sum: Number(voteSum.toFixed(4)),
      gates: gates.map((g) => ({ factor: g.key, multiplier: g.factor, source: g.source })),
      gate_product: Number(gateProduct.toFixed(4)),
      arithmetic: `(${votes.map((v) => `${v.p}·${v.weight}`).join(' + ') || '0'}) × ${gates.map((g) => g.factor).join(' × ')} = ${fmt(composite)}`,
    },
  };
}

function renderMarkdown(scored, meta) {
  const o = [];
  o.push(`# Role Scorer report — ${meta.when}`);
  o.push(`\n*Bayesian Role Scorer (Ch.11). Weights: sponsorship ${meta.w.sponsorship}, fit ${meta.w.fit}, role_quality ${meta.w.role_quality} [role_quality weight is **[VERIFY]** — not pinned by the chapter]. Threshold ${CONFIG.apply_threshold}. ${meta.needsSponsor ? 'Profile requires sponsorship.' : 'Profile does NOT require sponsorship → sponsorship weight 0.'}*\n`);
  const by = (r) => scored.filter((s) => s.recommendation === r);
  o.push(`**Summary:** ${scored.length} roles → Apply ${by('Apply').length} · Consider ${by('Consider').length} · Skip ${by('Skip').length}. **Skip rate ${(by('Skip').length / scored.length * 100).toFixed(0)}%** ${by('Skip').length / scored.length >= 0.5 ? '(healthy — a good run skips at least half)' : '(below the ~50% a healthy run skips; check the inputs)'}.`);
  o.push('\n| Role | Composite | Rec | Why | Audit (term · value · weight · source) |');
  o.push('|---|---|---|---|---|');
  for (const s of scored.sort((a, b) => b.composite - a.composite)) {
    const audit = s.trace.votes.map((v) => `${v.factor} ${v.value}·${v.weight} [${v.source}]`).join('; ') +
      ` × ` + s.trace.gates.map((g) => `${g.factor} ${g.multiplier}[${g.source}]`).join('×');
    const recCell = s.override && s.override.reason ? `${s.recommendation} ⟵ override` : s.recommendation;
    o.push(`| ${s.company || ''} — ${s.title || s.role_id || ''} | ${fmt(s.composite)} | **${recCell}** | ${s.reason} | ${audit} |`);
  }
  o.push('\n*Every term traces to its source. If you cannot explain a row term-by-term, distrust the recommendation before your confusion (Ch.11).*');
  return o.join('\n') + '\n';
}

function main() {
  const args = process.argv.slice(2);
  const src = args.find((a) => !a.startsWith('--'));
  if (!src || !fs.existsSync(src)) { console.error('Usage: role-scorer.mjs <roles.json> [--profile p.json] [--out-dir dir] [--md report.md]'); process.exit(2); }
  const pi = args.indexOf('--profile'); const profile = pi >= 0 ? JSON.parse(fs.readFileSync(args[pi + 1], 'utf8')) : null;
  const oi = args.indexOf('--out-dir'); const outDir = oi >= 0 ? args[oi + 1] : path.dirname(src);
  const mi = args.indexOf('--md'); const mdOut = mi >= 0 ? args[mi + 1] : path.join(outDir, 'role-scores.md');

  let roles = JSON.parse(fs.readFileSync(src, 'utf8'));
  if (!Array.isArray(roles)) roles = roles.roles || [];

  const { w, needsSponsor } = applyProfile(CONFIG.weights, profile);
  const scored = roles.map((r) => scoreRole(r, w, needsSponsor));

  const meta = { when: new Date().toISOString().slice(0, 10), w, needsSponsor };
  fs.mkdirSync(outDir, { recursive: true });
  const jsonOut = path.join(outDir, 'role-scores.json');
  fs.writeFileSync(jsonOut, JSON.stringify({ _scorer: 'bayesian-role-scorer', _chapter: 11, generated: meta.when, config: CONFIG, profile_needs_sponsorship: needsSponsor, roles: scored }, null, 2));
  fs.writeFileSync(mdOut, renderMarkdown(scored, meta));

  const by = (r) => scored.filter((s) => s.recommendation === r).length;
  console.log(`✓ scored ${scored.length} roles → Apply ${by('Apply')} · Consider ${by('Consider')} · Skip ${by('Skip')} (skip ${(by('Skip') / scored.length * 100).toFixed(0)}%)`);
  console.log(`  ${path.relative(process.cwd(), jsonOut)}  +  ${path.relative(process.cwd(), mdOut)}`);
  for (const s of scored) if (s.override?._warning) console.warn(`  ! ${s.company}: ${s.override._warning}`);
}

main();
