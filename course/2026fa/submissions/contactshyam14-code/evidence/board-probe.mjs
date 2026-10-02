// Throwaway: which public ATS boards exist for a few candidates? (research only —
// the run's evidence comes from scripts/ats/scan.mjs, not from this file)
const guesses = [
  ['ZERO MOTORCYCLES INC', 'greenhouse', 'zeromotorcycles'], ['ZERO MOTORCYCLES INC', 'lever', 'zeromotorcycles'],
  ['SILA NANOTECHNOLOGIES INC', 'greenhouse', 'silanano'], ['SILA NANOTECHNOLOGIES INC', 'lever', 'silanano'], ['SILA NANOTECHNOLOGIES INC', 'greenhouse', 'sila'],
  ['CENTIFIC GLOBAL SOLUTIONS INC', 'greenhouse', 'centific'], ['CENTIFIC GLOBAL SOLUTIONS INC', 'lever', 'centific'],
  ['UNQORK INC', 'greenhouse', 'unqork'], ['UNQORK INC', 'lever', 'unqork'],
  ['GENIES INC', 'greenhouse', 'genies'], ['GENIES INC', 'lever', 'genies'], ['GENIES INC', 'ashby', 'genies'],
  ['INTELLIA THERAPEUTICS INC', 'greenhouse', 'intelliatherapeutics'], ['INTELLIA THERAPEUTICS INC', 'greenhouse', 'intellia'],
  ['FORM ENERGY INC', 'greenhouse', 'formenergy'], ['FORM ENERGY INC', 'lever', 'formenergy'],
  ['RONDO ENERGY INC', 'greenhouse', 'rondoenergy'], ['RONDO ENERGY INC', 'lever', 'rondoenergy'], ['RONDO ENERGY INC', 'ashby', 'rondo'],
  ['ARRIS COMPOSITES INC', 'greenhouse', 'arriscomposites'], ['ARRIS COMPOSITES INC', 'lever', 'arris'], ['ARRIS COMPOSITES INC', 'ashby', 'arris'],
  ['ZIMENO INC', 'greenhouse', 'zimeno'], ['ZIMENO INC', 'lever', 'zimeno'], ['ZIMENO INC', 'ashby', 'zimeno'],
  ['SENTI BIOSCIENCES INC', 'greenhouse', 'sentibiosciences'], ['SENTI BIOSCIENCES INC', 'lever', 'sentibio'],
  ['IEX GROUP INC', 'greenhouse', 'iex'], ['IEX GROUP INC', 'greenhouse', 'iexgroup'], ['IEX GROUP INC', 'lever', 'iex'],
  ['CABAN SYSTEMS HOLDING INC', 'greenhouse', 'cabansystems'], ['CABAN SYSTEMS HOLDING INC', 'lever', 'cabansystems'], ['CABAN SYSTEMS HOLDING INC', 'ashby', 'caban'],
];
const url = (p, s) => ({
  greenhouse: `https://boards-api.greenhouse.io/v1/boards/${s}/jobs`,
  lever: `https://api.lever.co/v0/postings/${s}?mode=json`,
  ashby: `https://api.ashbyhq.com/posting-api/job-board/${s}`,
}[p]);
const re = /project manag|program manag|production manag|plant manag|manufacturing manag|factory manag|assembly manag|project coordinat|project admin/i;
for (const [co, p, s] of guesses) {
  try {
    const r = await fetch(url(p, s), { redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!r.ok) { console.log(`${co} | ${p}/${s} | HTTP ${r.status}`); continue; }
    const j = await r.json();
    const jobs = p === 'greenhouse' ? j.jobs : p === 'lever' ? j : j.jobs;
    let name = '';
    if (p === 'greenhouse') { const b = await fetch(`https://boards-api.greenhouse.io/v1/boards/${s}`, { signal: AbortSignal.timeout(15000) }); if (b.ok) name = (await b.json()).name; }
    const titles = (jobs || []).map((x) => x.title || x.text || '');
    const hits = titles.filter((t) => re.test(t));
    console.log(`${co} | ${p}/${s} | OK board="${name}" jobs=${titles.length} matching=${hits.length}${hits.length ? ' → ' + hits.slice(0, 4).join(' ; ') : ''}`);
  } catch (e) { console.log(`${co} | ${p}/${s} | ERR ${e.name}: ${e.message}`); }
}
