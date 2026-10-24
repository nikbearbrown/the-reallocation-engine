// checks.mjs — the three checks this mode adds to Assignment 1's sponsorship + liveness workflow,
// plus the Assignment 2 extension of the vacancy-wording rule. Pure functions, no I/O, no network.
// Contract: recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md (rule version RULES_VERSION).
//
// Every result carries `source: "model-judgment"` (a rule applied to posting text) and the excerpts
// it read. Candidate values are `your-input`. Nothing here is a probability or a match percentage.

import { classifyVacancy } from '../aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs';
import { sentencesOf } from './text.mjs';

export const RULES_VERSION = '0.4.1'; // v0.4.1: repairs from the first holdout result (E19) — headings read for eligibility wording, "what we look for", cross-sentence alternatives; // v0.2: v0.1 real-sample audit (FRICTIONAL E08); v0.3: "plus N years" (E09); v0.4: co-op clarification, general vs scoped years, month-precision intervals, exact-date constraints, season assumptions, conditional/unrecognized headings (E16)
const JUDGMENT = 'model-judgment';

// ── sections ─────────────────────────────────────────────────────────────────
const SEC_PREFERRED = /\b(preferred|nice[- ]to[- ]haves?|bonus|pluses|(?:is |a )plus|desired|ideal(ly)?|good to have|even better|extra credit)\b/i;
const SEC_REQUIRED = /\b(minimum|basic|required|requirements?|must[- ]haves?|must (?:also )?have|should have|what you['’]ll need|what we['’]re looking for|what we look for|what we are looking for|we['’]re looking for|you (should|will|must)? ?have|qualifications|who you are|about you|what you bring|you bring|you might be a fit)\b/i;
const SEC_RESP = /\b(responsibilit\w*|what you['’]ll do|what you will do|the role|you will|in this role|day[- ]to[- ]day|what you['’]ll be doing|the impact you|your impact|what you['’]ll work on|the work)\b/i;

const SEC_OBLIGATION = /\b(should|must|need|needs|required|requirements?)\b/i;
const SEC_CONDITIONAL = /\(\s*(?:for|if|when|where|depending)\b|\bif applicable\b|\bdepending on\b|\bfor (?:senior|staff|principal|lead)[- ]level\b/i;

export function sectionKind(heading) {
  if (heading === null || heading === undefined) return 'unclassified';
  // v0.2: a heading with both a preference cue and an obligation cue ("Ideal Engineer should have") is ambiguous
  if (SEC_PREFERRED.test(heading) && SEC_OBLIGATION.test(heading)) return 'ambiguous';
  // v0.4: conditional headings ("Requirements (for senior-level candidates)") are ambiguous too
  if (SEC_CONDITIONAL.test(heading)) return 'ambiguous';
  if (SEC_PREFERRED.test(heading)) return 'preferred';
  if (SEC_REQUIRED.test(heading)) return 'required';
  if (SEC_RESP.test(heading)) return 'responsibilities';
  return 'other';
}

const INLINE_PREF = /\b(preferred|nice to have|is a plus|a plus|bonus|ideally|desirable)\b/i;
const INLINE_REQ = /\b(required|must have|must be|minimum of|at minimum)\b/i;

// Lines (from text.mjs) → [{ section, kind, text }] at sentence granularity.
export function toSentences(lines) {
  const out = []; let heading = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      heading = line.slice(3).trim();
      if (yearMentions(heading).length || DEGREE.test(heading)) out.push({ section: heading, kind: sectionKind(heading) === 'other' ? 'unclassified' : sectionKind(heading), text: heading, from_heading: true });
      continue;
    }
    const body = line.startsWith('- ') ? line.slice(2) : line;
    for (const s of sentencesOf(body)) {
      let kind = sectionKind(heading);
      if (INLINE_PREF.test(s)) kind = 'preferred';
      else if (INLINE_REQ.test(s) && kind !== 'preferred') kind = 'required';
      out.push({ section: heading, kind, text: s });
    }
  }
  return out;
}

// ── 1. experience + degree + graduation window ─────────────────────────────
const NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15 };
const N = '(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen)(?:\\s*\\(\\d{1,2}\\))?';
const toNum = (s) => (/^\d+$/.test(s) ? Number(s) : NUM_WORDS[s.toLowerCase()]);
const YRS = '(?:years?|yrs?)';
const RE_RANGE = new RegExp(`\\b${N}\\s*(?:-|–|—|to)\\s*${N}\\s*\\+?\\s*${YRS}`, 'i');
const RE_CAP = new RegExp(`\\b(?:no more than|not more than|less than|fewer than|at most|maximum of|a maximum of)\\s+${N}\\s*${YRS}`, 'i');
const RE_MIN = [
  new RegExp(`\\b(?:at least|minimum(?: of)?|min\\.?)\\s+${N}\\s*\\+?\\s*${YRS}`, 'i'),
  new RegExp(`\\b${N}\\s*\\+\\s*${YRS}`, 'i'),
  new RegExp(`\\b${N}\\s*(?:or more|plus)\\s*${YRS}`, 'i'),
  new RegExp(`\\b${N}\\s*${YRS}\\s+(?:of|in|with|working|building|developing|professional|industry|relevant|hands-on|experience)`, 'i'),
];
const EXPERIENCE_CONTEXT = /\b(experience|experienced|working|professional|industry|building|developing|engineering|software)\b/i;
const DEGREE = /\b(bachelor['’]?s|BS|B\.S\.|BA|B\.A\.|master['’]?s|MS|M\.S\.|PhD|Ph\.D\.|doctorate|degree)\b/;
const COOP_ACCEPT = /\b(including|includes|include|counts?|count toward|considered|such as)\b[^.]{0,40}\b(internships?|co-?ops?)\b|\b(internships?|co-?ops?)\b[^.]{0,40}\b(count|counts|considered|included|qualify|acceptable)\b/i;
const COOP_UNCLEAR = /\b(academic|research|professional or academic|industry or academic|equivalent (practical |hands-on )?experience|relevant experience of any kind)\b/i;
const GRAD_WINDOW = /\b(graduat\w*|class of|recent graduates?|new grads?|degree completion)\b/i;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MON_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const SEASON_RE = '(spring|summer|fall|autumn|winter)';
const monthIndex = (m) => MONTHS.findIndex((x) => x.startsWith(m.toLowerCase().slice(0, 3)));

export function yearMentions(text) {
  const out = [];
  const r = text.match(RE_RANGE);
  if (r) out.push({ kind: 'range', min: toNum(r[1]), max: toNum(r[2]), phrase: r[0] });
  const c = text.match(RE_CAP);
  if (c) out.push({ kind: 'cap', max: toNum(c[1]), phrase: c[0] });
  if (!r) {
    for (const re of RE_MIN) {
      for (const m of text.matchAll(new RegExp(re.source, 'gi'))) {
        if (c && m.index !== undefined && c[0].includes(m[0])) continue;
        out.push({ kind: 'min', min: toNum(m[1]), phrase: m[0] });
      }
    }
  }
  // de-duplicate identical numbers from overlapping patterns
  const seen = new Set();
  return out.filter((x) => { const k = `${x.kind}|${x.min}|${x.max}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

// candidate (v0.4): { full_time: {months_lower, months_upper}, coop: {months_lower, months_upper},
//   career_upper: {with_coop, ft_only}, scoped_experience: [{terms, months, source}], degrees, available_from, precision }
// Month-only dates: an entry "YYYY-MM … YYYY-MM" spans between (count − 2) and count months, so every
// comparison uses an interval [lower, upper] (see loadCandidate in triage.mjs).
const COOP_EXCLUDE = /\b(internships?|co-?ops?)\b[^.]{0,40}\b(do not|don['’]t|does not|doesn['’]t|will not|won['’]t|are not|aren['’]t|not)\s+(count|counted|considered|included|qualify)\b|\b(excluding|not including|exclusive of|other than)\s+(internships?|co-?ops?)\b|\bpost[- ]graduat\w*\s+(work\s+)?experience\b/i;
const GENERAL_SCOPE = /^(?:of\s+)?(?:(?:professional|industry|relevant|related|full[- ]time|paid|post[- ]graduat\w*|total|overall|hands[- ]on|work|working|practical|commercial)\s+)*(?:(?:software|engineering|development|programming|technical|tech)\s+)*(?:or\s+(?:a\s+)?related\s+)?(?:work\s+)?experience\b(.*)$/i; // v0.4 pre-freeze: "software engineering or related experience" is general
const GENERAL_TAIL = /^\s*(?:[,;.:]|$)|^\s+(?:in|as)\s+(?:a\s+|the\s+)?(?:software\s+|tech\s+|technology\s+)?(?:industry|engineering|development|engineer(?:ing)?|developer|role|field|occupation)(?:\s+or\s+(?:a\s+)?related\s+(?:occupation|field|role|discipline))?\b|^\s+with\s+a\s+(?:proven\s+)?track\s+record\b|^\s*\([^)]*\b(?:internships?|co-?ops?|full[- ]time)\b[^)]*\)/i;

// "general" = total professional experience; "scoped" = years in a specific language, system type,
// activity, or domain. Documented heuristic: anything not matching the general form is scoped.
export function requirementScope(sentence, phrase) {
  const i = sentence.indexOf(phrase);
  const tok = phrase.match(/\b(?:years?|yrs?)\b/i);
  const after = sentence.slice(i + (tok ? tok.index + tok[0].length : phrase.length)).trim();
  const m = after.match(GENERAL_SCOPE);
  if (m && GENERAL_TAIL.test(m[1])) return { scope: 'general', scope_text: after };
  return { scope: 'scoped', scope_text: after };
}

const yrs = (m) => (m / 12).toFixed(2).replace(/\.?0+$/, '');
const span = (lo, hi) => (lo === hi ? `${lo}` : `${lo}–${hi}`);

export function checkExperience(sentences, candidate) {
  const FT = candidate.full_time; const CO = candidate.coop;
  const coopExcluded = sentences.filter((s) => COOP_EXCLUDE.test(s.text));
  const coopAcceptance = sentences.filter((s) => COOP_ACCEPT.test(s.text) && !COOP_EXCLUDE.test(s.text));
  const coopUnclear = sentences.filter((s) => COOP_UNCLEAR.test(s.text) && EXPERIENCE_CONTEXT.test(s.text));
  const coopStatus = coopExcluded.length ? 'excluded' : coopAcceptance.length ? 'accepted' : coopUnclear.length ? 'unclear' : 'silent';
  const careerUpper = coopStatus === 'excluded' ? candidate.career_upper.ft_only : candidate.career_upper.with_coop;
  const findings = [];
  // v0.4.1: "In the alternative, … / Alternatively, …" in the next sentence of the same section makes
  // both sentences alternative branches (holdout finding E19).
  const ALT_START = /^(in the alternative|alternatively)\b/i;
  const altPartner = (i) => (ALT_START.test(sentences[i].text)) || (sentences[i + 1] && sentences[i + 1].section === sentences[i].section && ALT_START.test(sentences[i + 1].text));
  for (const [si, s] of sentences.entries()) {
    if (!EXPERIENCE_CONTEXT.test(s.text)) continue;
    const ms = yearMentions(s.text);
    if (!ms.length) continue;
    const alternatives = altPartner(si) || ms.filter((m) => m.kind !== 'cap').length > 1 || (DEGREE.test(s.text) && /\bor\b/i.test(s.text) && ms.length >= 1 && /\b(with|and)\b/i.test(s.text));
    for (const m of ms) {
      const sc = requirementScope(s.text, m.phrase);
      const f = { sentence: s.text, section: s.section, kind: s.kind, requirement: m, alternatives, ...sc };
      const R = (m.kind === 'cap' ? m.max : m.min) * 12;
      if (m.kind === 'cap') {
        f.state = FT.months_lower > R ? 'explicit-cap-exceeded' : FT.months_upper <= R ? 'within-cap' : 'within-date-precision';
        f.comparison = `full-time ${span(FT.months_lower, FT.months_upper)} months vs cap ${R}`;
      } else if (alternatives) {
        f.state = 'alternative-requirements';
      } else if (sc.scope === 'scoped') {
        const input = (candidate.scoped_experience || []).find((x) => x.terms.some((t) => new RegExp(`\\b${t}\\b${t.toLowerCase() === 'java' ? '(?![\\s-]*script)' : ''}`, 'i').test(s.text)));
        if (input) { f.state = input.months >= R ? 'meets' : 'below-stated-minimum'; f.comparison = `supplied scoped input ${input.months} months (${input.terms.join('/')}, your-input) vs ${R} required`; f.scoped_input = input; }
        else if (careerUpper < R) { f.state = 'below-even-with-all-experience'; f.comparison = `even all recorded experience (at most ${careerUpper} months${coopStatus === 'excluded' ? ', co-op excluded by the posting' : ', co-op included'}) is below ${R} required`; }
        else { f.state = 'scoped-duration-unknown'; f.comparison = `scoped requirement (${sc.scope_text.slice(0, 60)}): ${R} months required; total recorded experience (up to ${careerUpper} months) does not establish time spent on this specific skill/area, and no scoped input was supplied`; }
      } else {
        const ftOnly = `full-time only: ${span(FT.months_lower, FT.months_upper)} months vs ${R} required`;
        const lo = FT.months_lower + CO.months_lower; const hi = FT.months_upper + CO.months_upper;
        if (FT.months_lower >= R) f.state = m.kind === 'range' && FT.months_lower > m.max * 12 ? 'above-stated-range' : 'meets';
        else if (FT.months_upper < R) {
          if (coopStatus === 'excluded' || CO.months_upper === 0) f.state = 'below-stated-minimum';
          else if (hi < R) f.state = 'below-even-with-coop';
          else if (coopStatus === 'accepted') f.state = lo >= R ? 'meets-with-explicitly-accepted-coop' : 'within-date-precision';
          else f.state = 'coop-would-change-result';
        } else f.state = 'within-date-precision';
        f.comparison = `${ftOnly}${CO.months_upper ? `; with the co-op: ${span(lo, hi)} months (co-op wording in this posting: ${coopStatus})` : ''}`;
      }
      findings.push(f);
    }
  }
  // graduation-window restrictions
  const grad = [];
  for (const s of sentences) {
    if (!GRAD_WINDOW.test(s.text)) continue;
    const between = s.text.match(new RegExp(`\\b${MON_RE}\\s+(20\\d\\d)\\b[^.]{0,30}?\\b(?:and|to|through|-|–)\\s+${MON_RE}\\s+(20\\d\\d)\\b`, 'i'));
    const g = { sentence: s.text, section: s.section, kind: s.kind };
    const end = candidate.degrees.find((d) => d.level === 'MS')?.end; // 'YYYY-MM'
    if (between && end) {
      const lo = `${between[2]}-${String(monthIndex(between[1]) + 1).padStart(2, '0')}`;
      const hi = `${between[4]}-${String(monthIndex(between[3]) + 1).padStart(2, '0')}`;
      g.window = { from: lo, to: hi };
      g.state = end >= lo && end <= hi ? 'graduation-inside-stated-window' : 'graduation-outside-stated-window';
    } else g.state = 'graduation-wording-without-window';
    grad.push(g);
  }
  const degree = sentences.filter((s) => DEGREE.test(s.text) && /\b(degree|bachelor|master|phd|doctorate|BS|MS)\b/i.test(s.text)).map((s) => ({
    sentence: s.text, section: s.section, kind: s.kind,
    state: /\b(PhD|Ph\.D\.|doctorate)\b/.test(s.text) && !/\bor\b/i.test(s.text) && s.kind === 'required' ? 'phd-required-review' : /\brelated\b|\bequivalent\b/i.test(s.text) ? 'field-or-equivalence-wording' : 'degree-mentioned',
  }));

  // decision for this check — order: explicit restrictions → definite mismatches → reviews → pass
  const MET = ['meets', 'meets-with-explicitly-accepted-coop', 'within-cap'];
  const BELOW = ['below-stated-minimum', 'below-even-with-coop', 'below-even-with-all-experience'];
  const REVIEW_STATES = ['coop-would-change-result', 'within-date-precision', 'scoped-duration-unknown'];
  const req = findings.filter((f) => f.kind === 'required');
  const reqMins = req.filter((f) => f.requirement.kind !== 'cap' && f.state !== 'alternative-requirements');
  const notRequiredSection = (f) => ['unclassified', 'other', 'responsibilities', 'ambiguous'].includes(f.kind);
  const first = (st) => req.find((f) => f.state === st);
  let state; let gate; let why;
  const cap = findings.find((f) => f.state === 'explicit-cap-exceeded' && f.kind !== 'preferred');
  const gradOut = grad.find((g) => g.state === 'graduation-outside-stated-window' && g.kind === 'required');
  const below = reqMins.filter((f) => BELOW.includes(f.state)).sort((a, b) => b.requirement.min - a.requirement.min);
  const met = reqMins.filter((f) => MET.includes(f.state));
  if (cap) { state = 'explicit-eligibility-restriction'; gate = 'stop'; why = `explicit experience cap: "${cap.requirement.phrase}" (${cap.comparison})`; }
  else if (gradOut) { state = 'explicit-eligibility-restriction'; gate = 'stop'; why = `graduation window ${gradOut.window.from}..${gradOut.window.to} excludes the candidate's stated completion`; }
  else if (below.length) {
    const f = below[0];
    state = 'documented-mismatch'; gate = 'stop';
    why = `stated required minimum "${f.requirement.phrase}" is not met: ${f.comparison}${f.state === 'below-stated-minimum' && coopStatus === 'excluded' ? ' (the posting excludes co-ops)' : ''}${met.length ? `; ${met.length} other stated requirement(s) met` : ''}. A documented mismatch, not a claim the employer could never make an exception`;
  }
  else if (first('coop-would-change-result')) { const f = first('coop-would-change-result'); state = 'coop-would-change-result'; gate = 'review'; why = `"${f.requirement.phrase}": ${f.comparison}. The ${CO.months_upper}-month co-op is the difference and this posting is ${coopStatus} about co-ops, so the outcome is unresolved — a person decides`; }
  else if (first('within-date-precision')) { const f = first('within-date-precision'); state = 'within-date-precision'; gate = 'review'; why = `"${f.requirement.phrase}": ${f.comparison} — within the precision of month-only dates; a person checks exact dates`; }
  else if (first('scoped-duration-unknown')) { const f = first('scoped-duration-unknown'); state = 'scoped-duration-unknown'; gate = 'review'; why = `"${f.requirement.phrase}" is a scoped requirement — ${f.comparison}`; }
  else if (findings.some((f) => f.state === 'alternative-requirements' && f.kind !== 'preferred')) { state = 'alternative-requirements'; gate = 'review'; why = 'either/or or degree-conditioned years: a person decides which branch applies'; }
  else if (reqMins.some((f) => f.state === 'above-stated-range')) { state = 'possible-level-mismatch'; gate = 'review'; why = 'candidate is above the top of an ordinary stated range (not an eligibility restriction)'; }
  else if (findings.some((f) => f.kind === 'ambiguous' && !MET.includes(f.state))) { state = 'requirement-section-ambiguous'; gate = 'review'; why = 'a years statement the candidate does not clearly meet sits under a heading with mixed or conditional wording'; }
  else if (findings.some((f) => notRequiredSection(f) && !MET.includes(f.state) && f.state !== 'alternative-requirements')) { state = 'requirement-section-unclear'; gate = 'review'; why = 'a years statement the candidate does not clearly meet appears under an unrecognized or non-requirement heading'; }
  else if (degree.some((d) => d.state === 'phd-required-review')) { state = 'degree-requirement-review'; gate = 'review'; why = 'an unconditional PhD requirement is stated'; }
  else if (met.length) {
    const coopUsed = met.some((f) => f.state === 'meets-with-explicitly-accepted-coop');
    state = coopUsed ? 'meets-with-explicitly-accepted-coop' : 'meets-stated-required-minimums'; gate = 'pass';
    why = `meets every stated required minimum (${met.map((f) => `"${f.requirement.phrase}": ${f.comparison}`).join('; ')})${coopUsed ? '; the co-op is counted only because the posting explicitly accepts co-ops' : ''}`;
  }
  else if (findings.some((f) => f.kind === 'preferred' && !MET.includes(f.state))) { state = 'only-preferred-years-not-met'; gate = 'pass'; why = 'the only unmet or unknown years statement is a stated preference; preferences never stop an opening'; }
  else { state = 'experience-requirement-unstated'; gate = 'pass-unknown'; why = 'no required years stated in a recognizable form; unknown, not a match'; }
  return {
    state, gate, why, source: JUDGMENT,
    candidate: { full_time_months: [FT.months_lower, FT.months_upper], coop_months: [CO.months_lower, CO.months_upper], coop_status_in_posting: coopStatus, coop_counted: state === 'meets-with-explicitly-accepted-coop', precision: candidate.precision, source: 'your-input' },
    findings, graduation: grad, degree, coop_acceptance_excerpts: coopAcceptance.map((s) => s.text), coop_exclusion_excerpts: coopExcluded.map((s) => s.text),
    note: 'Title words (senior/staff/principal) are never used by this check. General vs scoped classification and section kinds are documented heuristics.',
  };
}

// ── 2. stack evidence ───────────────────────────────────────────────────────
export const STACK_GROUPS = {
  java_jvm: [/\bjava\b(?![\s-]*script)/i, /\bjvm\b/i, /\bkotlin\b/i, /\bscala\b/i],
  spring: [/\bspring\s+(boot|framework|cloud|mvc|data|batch)\b/i],
  distributed_systems: [/\bdistributed\s+(?:\w+\s+)?(systems?|computing|services)\b/i, /\bmicro-?services?\b/i, /\bfault[- ]toleran\w*/i, /\bhigh(ly)?[- ]availab\w*/i, /\bconcurren\w*/i, /\bscalab\w*/i, /\bconsensus\b/i],
  messaging: [/\bkafka\b/i, /\brabbitmq\b/i, /\b(sqs|sns|kinesis|pulsar|nats)\b/i, /\bpub\/?sub\b/i, /\bmessage\s+(queue|broker|bus)s?\b/i, /\bevent[- ]driven\b/i],
  cloud_infra: [/\baws\b/i, /\bamazon web services\b/i, /\bgcp\b|\bgoogle cloud\b/i, /\bazure\b/i, /\bkubernetes\b|\bk8s\b/i, /\bdocker\b/i, /\bterraform\b/i, /\b(eks|gke|aks)\b/i],
  applied_ai_infra: [/\bllms?\b/i, /\blarge language models?\b/i, /\brag\b/i, /\bretrieval[- ]augmented\b/i, /\bvector (database|search|store)s?\b/i, /\bembeddings?\b/i, /\b(model|ml) (serving|inference|infrastructure|platform)\b/i, /\binference\b/i, /\bagentic\b|\bai agents?\b/i, /\bmachine learning\b/i],
};
const OTHER_LANG = /\b(go|golang|c\+\+|rust|python|ruby|c#|\.net|typescript|node\.js|php|elixir|haskell)\b/i;
const LANG_DEMAND = /\b(proficien\w*|expert\w*|expertise|strong|fluency|fluent|deep|extensive|professional)\b[^.]{0,60}\b(in|with)\b/i;
const NEGATED_JAVA = /\b(no|not|without)\b[^.]{0,30}\bjava\b(?![\s-]*script)|\bjava\b(?![\s-]*script)[^.]{0,25}\b(not required|not necessary|not needed)\b/i;
const RANK = { required: 4, responsibilities: 3, ambiguous: 2, preferred: 2, other: 1, unclassified: 1 };

export function checkStack(sentences, textChars) {
  const groups = {};
  for (const [g, pats] of Object.entries(STACK_GROUPS)) {
    const hits = [];
    for (const s of sentences) {
      if (g === 'java_jvm' && NEGATED_JAVA.test(s.text)) { hits.push({ ...s, negated: true }); continue; }
      const terms = pats.map((p) => s.text.match(p)?.[0]).filter(Boolean);
      if (terms.length) hits.push({ ...s, terms: [...new Set(terms.map((t) => t.toLowerCase()))] });
    }
    const real = hits.filter((h) => !h.negated);
    const best = real.sort((a, b) => RANK[b.kind] - RANK[a.kind])[0];
    groups[g] = { where: best ? best.kind : 'not-mentioned', terms: [...new Set(real.flatMap((h) => h.terms))], excerpts: real.slice(0, 3).map((h) => ({ section: h.section, kind: h.kind, text: h.text })), negated: hits.filter((h) => h.negated).map((h) => h.text) };
  }
  const otherLangRequired = sentences.filter((s) => s.kind === 'required' && OTHER_LANG.test(s.text) && LANG_DEMAND.test(s.text) && !STACK_GROUPS.java_jvm.some((p) => p.test(s.text)));
  const javaCore = ['required', 'responsibilities'].includes(groups.java_jvm.where);
  const backendCore = ['distributed_systems', 'messaging', 'cloud_infra'].some((g) => groups[g].where !== 'not-mentioned');
  let state; let gate; let why;
  if (textChars < 400) { state = 'insufficient-text'; gate = 'review'; why = `only ${textChars} characters of posting text`; }
  else if (otherLangRequired.length && !javaCore) { state = 'other-language-required'; gate = 'review'; why = `a required line names another language without Java: "${otherLangRequired[0].text}"`; }
  else if (javaCore && backendCore) { state = 'core-stack-evidenced'; gate = 'pass'; why = `JVM language in ${groups.java_jvm.where} lines, plus backend-infrastructure terms`; }
  else if (javaCore) { state = 'java-without-backend-infrastructure-terms'; gate = 'review'; why = `JVM language in ${groups.java_jvm.where} lines, but no distributed-systems, messaging, or cloud-infrastructure terms`; }
  else if (groups.java_jvm.where !== 'not-mentioned') { state = 'java-mentioned-outside-core'; gate = 'review'; why = `JVM language appears only in ${groups.java_jvm.where} lines`; }
  else { state = 'java-not-evidenced'; gate = 'review'; why = 'no JVM-language evidence in the posting text'; }
  return { state, gate, why, source: JUDGMENT, groups, other_language_required: otherLangRequired.map((s) => s.text), note: 'Evidence locations, not a match score. Applied-AI infrastructure is optional and never required for a pass.' };
}

// ── 3. start window (v0.4) ──────────────────────────────────────────────────
// Exact dates keep their day; context decides the constraint: "by / no later than / before" = deadline,
// "no earlier than / not before / after / from" = earliest start, "on / start date:" = fixed date.
// Seasons are MODEL ASSUMPTIONS (spring = Mar–May, summer = Jun–Aug, fall = Sep–Nov; winter → unresolved)
// and can never produce a hard stop. A conflict stops only when the sentence carries a mandatory cue.
const SEASONS = { spring: [3, 5], summer: [6, 8], fall: [9, 11], autumn: [9, 11] };
const START_WORD = /\b(start(?:ing|s)?|start date|begin(?:ning|s)?|commence\w*|join(?:ing)?|onboard\w*|available|availability)\b/i;
const RE_EXACT = new RegExp(`\\b${MON_RE}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(20\\d\\d)\\b|\\b(20\\d\\d)-(\\d{2})-(\\d{2})\\b`, 'gi');
const RE_DATED = new RegExp(`\\b${MON_RE}\\.?\\s+(20\\d\\d)\\b`, 'gi');
const RE_SEASON = new RegExp(`\\b${SEASON_RE}\\s+(?:of\\s+)?(20\\d\\d)\\b`, 'gi');
const RE_ASAP = /\b(asap|as soon as possible|immediate(?:ly)?\s+(?:start|availability|joiner)|start\s+immediately|available\s+immediately|immediate\s+start)\b/i;
const RE_WITHIN = /\bwithin\s+(\d+|one|two|three|four|six|eight)\s+(days?|weeks?|months?)\b/i;
const MANDATORY = /\b(?:must|required|requires|need(?:s)? to|starts?\s+(?:on|in|by)|will start|is expected to start|expected start date|required start)\b|\bstart date\s*:/i; // "start date:" has no word boundary after the colon
const lastDay = (y, m) => new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); // m is 1-based
const pad = (n) => String(n).padStart(2, '0');

function constraintBefore(text, index) {
  const pre = text.slice(Math.max(0, index - 32), index).toLowerCase();
  if (/\b(no earlier than|not earlier than|not before|after|from|starting from|beginning from)\s*$/.test(pre)) return 'earliest';
  if (/\b(by|no later than|not later than|before|on or before)\s*$/.test(pre)) return 'deadline';
  if (/\b(on|in|start date\s*:?|starting|starts|begins|beginning|will start|start)\s*$/.test(pre)) return 'fixed';
  return 'mentioned';
}

export function checkStartWindow(sentences, availableFrom, capturedAt) {
  const statements = [];
  for (const s of sentences) {
    const t = s.text;
    if (!START_WORD.test(t) && !RE_ASAP.test(t)) continue;
    if (RE_ASAP.test(t) && (START_WORD.test(t) || /\basap\b/i.test(t))) statements.push({ type: 'asap', sentence: t, section: s.section });
    const w = t.match(RE_WITHIN);
    if (w && START_WORD.test(t) && /\b(offer|accept\w*)\b/i.test(t)) statements.push({ type: 'relative', amount: toNum(w[1]), unit: w[2].toLowerCase().replace(/s$/, ''), sentence: t, section: s.section });
    if (!START_WORD.test(t)) continue;
    const mandatory = MANDATORY.test(t);
    const taken = [];
    for (const m of t.matchAll(RE_EXACT)) {
      const date = m[1] ? `${m[3]}-${pad(monthIndex(m[1]) + 1)}-${pad(Number(m[2]))}` : `${m[4]}-${m[5]}-${m[6]}`;
      taken.push([m.index, m.index + m[0].length]);
      statements.push({ type: 'exact-date', date, constraint: constraintBefore(t, m.index), mandatory, phrase: m[0], sentence: t, section: s.section });
    }
    for (const m of t.matchAll(RE_DATED)) {
      if (taken.some(([a, b]) => m.index >= a && m.index < b)) continue;
      const y = Number(m[2]); const mo = monthIndex(m[1]) + 1;
      statements.push({ type: 'month', window: { from: `${y}-${pad(mo)}-01`, to: lastDay(y, mo) }, constraint: constraintBefore(t, m.index), mandatory, phrase: m[0], sentence: t, section: s.section });
    }
    for (const m of t.matchAll(RE_SEASON)) {
      const season = m[1].toLowerCase(); const y = Number(m[2]);
      if (season === 'winter') { statements.push({ type: 'season-ambiguous', assumption: 'winter spans a year boundary; no window assumed', phrase: m[0], sentence: t, section: s.section }); continue; }
      const [a, b] = SEASONS[season];
      statements.push({ type: 'season', window: { from: `${y}-${pad(a)}-01`, to: lastDay(y, b) }, assumption: `model assumption: ${season} = ${MONTHS[a - 1]}–${MONTHS[b - 1]} (not employer-stated dates)`, constraint: constraintBefore(t, m.index), mandatory, phrase: m[0], sentence: t, section: s.section });
    }
  }
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
  const arithmetic = { available_from: availableFrom, captured_at: capturedAt, days_from_capture_to_availability: capturedAt ? days(capturedAt.slice(0, 10), availableFrom) : null };
  for (const x of statements) {
    if (x.type === 'exact-date') x.compatible_by_date = x.constraint === 'earliest' ? true : x.constraint === 'mentioned' ? null : availableFrom <= x.date;
    if (x.type === 'month' || x.type === 'season') x.compatible_by_date = x.constraint === 'earliest' ? true : x.constraint === 'mentioned' ? null : availableFrom <= x.window.to;
  }
  const dated = statements.filter((x) => 'compatible_by_date' in x);
  const decided = dated.filter((x) => x.compatible_by_date !== null);
  const conflicts = decided.filter((x) => x.compatible_by_date === false); const fits = decided.filter((x) => x.compatible_by_date === true);
  const unresolved = statements.filter((x) => ['asap', 'relative', 'season-ambiguous'].includes(x.type) || x.compatible_by_date === null);
  let state; let gate; let why;
  const describe = (x) => `"${x.phrase}" (${x.type}${x.constraint ? `, ${x.constraint}` : ''}${x.date ? ` ${x.date}` : x.window ? ` ${x.window.from}..${x.window.to}` : ''})`;
  if (!statements.length) { state = 'employer-timing-unstated'; gate = 'pass-unknown'; why = 'the rules found no start-timing statement in the captured text; unknown — confirm with the employer'; }
  else if ((conflicts.length && fits.length) || (decided.length && unresolved.length)) { state = 'conflicting-timing-statements'; gate = 'review'; why = 'the posting makes more than one timing statement that do not agree or cannot be resolved together'; }
  else if (conflicts.length) {
    const c = conflicts[0];
    if (c.type === 'season') { state = 'season-conflict-under-assumption'; gate = 'review'; why = `${describe(c)} ends before ${availableFrom} only under the ${c.assumption}; a season cannot hard-reject`; }
    else if (!c.mandatory) { state = 'descriptive-timing-conflict'; gate = 'review'; why = `${describe(c)} is before ${availableFrom}, but the wording is descriptive, not a stated requirement`; }
    else { state = 'explicit-date-conflict'; gate = 'stop'; why = `${describe(c)} is before the supplied availability ${availableFrom} (date arithmetic only)`; }
  }
  else if (unresolved.some((x) => x.type === 'relative')) { const r = unresolved.find((x) => x.type === 'relative'); state = 'relative-to-offer-date'; gate = 'review'; why = `start is tied to the offer date ("within ${r.amount} ${r.unit}"); the offer date is unknown, so compatibility is unresolved`; }
  else if (unresolved.length) { state = 'asap-or-ambiguous-unresolved'; gate = 'review'; why = `"${unresolved[0].sentence}" — not an exact constraint; proves neither compatibility nor conflict`; }
  else if (fits.every((x) => x.type === 'season')) { state = 'season-compatible-under-assumption'; gate = 'pass-unknown'; why = `${describe(fits[0])} is compatible only under the ${fits[0].assumption}`; }
  else { state = 'stated-start-compatible-by-date'; gate = 'pass'; why = `${fits.filter((x) => x.type !== 'season').map(describe).join('; ')} — compatible with availability ${availableFrom} by date arithmetic only`; }
  return { state, gate, why, source: JUDGMENT, statements, arithmetic, does_not_establish: ['work authorization or EAD approval', 'legal eligibility to start', 'how long hiring will take'] };
}

// ── 4. vacancy wording: Assignment 1 classifier + Assignment 2 extensions ──
const A2_REFUSAL = [
  /\bmust\s+not\s+(?:now\s+or\s+in\s+the\s+future\s+)?require\s+(?:\w+\s+){0,2}sponsorship/i,
  /\bnot\s+(?:be\s+)?eligible\s+for\s+(?:\w+\s+){0,2}sponsorship/i,
  /\b(?:does|do|will)\s+not\s+(?:provide|offer)\s+(?:\w+\s+){0,2}sponsorship/i,
];
const A2_QUESTION = /\b(will you|do you|are you going to|would you)\b[^?.]{0,80}\b(require|need)\b[^?.]{0,40}\bsponsor\w*/i;
const CITIZEN_REQUIRED = /\b(u\.?s\.?|united states)\s+citizen(ship)?\b[^.]{0,40}\b(required|is required|must|only)\b|\bmust\s+be\s+(?:a\s+)?(?:u\.?s\.?|united states)\s+(citizen|person)\b|\b(only|exclusively)\s+(?:open\s+to\s+)?(?:u\.?s\.?|united states)\s+citizens\b/i;
const CLEARANCE = /\b(security\s+clearance|clearance\s+(?:is\s+)?required|ability\s+to\s+obtain\s+(?:and\s+maintain\s+)?(?:a\s+)?(?:\w+\s+)?clearance|active\s+(?:secret|top secret|ts\/sci)|ts\/sci|itar|export[- ]control\w*|u\.?s\.?\s+persons?)\b/i;

export function checkVacancy(sentences) {
  const text = sentences.map((s) => s.text).join(' ');
  const a1 = classifyVacancy(text);
  const a2Refusal = sentences.filter((s) => A2_REFUSAL.some((p) => p.test(s.text))).map((s) => s.text);
  const question = sentences.filter((s) => A2_QUESTION.test(s.text)).map((s) => s.text);
  const citizen = sentences.filter((s) => CITIZEN_REQUIRED.test(s.text)).map((s) => s.text);
  const clearance = sentences.filter((s) => CLEARANCE.test(s.text)).map((s) => s.text);
  let state = a1.state; let basis = 'assignment-1 classifier';
  if (a2Refusal.length && state !== 'explicit-refusal') {
    state = state === 'apparent-offer' || state === 'contradictory' ? 'contradictory' : 'explicit-refusal'; basis = 'assignment-2 refusal extension';
  }
  if (state === 'silent' && question.length) { state = 'asks-about-sponsorship'; basis = 'assignment-2 application-question extension'; }
  let eligibility = 'none-stated';
  if (citizen.length) eligibility = 'citizenship-required';
  else if (clearance.length) eligibility = 'clearance-or-export-control-wording';
  return { state, basis, excerpts: [...new Set([...a1.excerpts, ...a2Refusal, ...question])], eligibility, eligibility_excerpts: [...citizen, ...clearance], source: JUDGMENT };
}

// The union of every pattern above — used by the excerpt extractor so that the committed excerpts
// contain every sentence any rule reads (equivalence with the full text is then CHECKED, not assumed).
export function isRelevantSentence(text) {
  const t = String(text);
  return yearMentions(t).length > 0 || DEGREE.test(t) || GRAD_WINDOW.test(t) || COOP_ACCEPT.test(t) || COOP_EXCLUDE.test(t) || COOP_UNCLEAR.test(t)
    || START_WORD.test(t) || RE_ASAP.test(t) || RE_WITHIN.test(t)
    || /\b(sponsor\w*|visa|immigration|authori[sz]\w*|citizen\w*|clearance|itar|export|u\.?s\.? persons?|work permit|right to work)\b/i.test(t)
    || Object.values(STACK_GROUPS).flat().some((p) => p.test(t)) || (OTHER_LANG.test(t) && LANG_DEMAND.test(t)) || NEGATED_JAVA.test(t)
    || INLINE_PREF.test(t) || INLINE_REQ.test(t);
}
