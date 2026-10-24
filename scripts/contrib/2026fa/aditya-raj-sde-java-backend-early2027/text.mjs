// text.mjs — posting HTML → plain text with section headings kept, shared by collect.mjs and
// triage.mjs. Greenhouse's `content` field is entity-escaped HTML ("&lt;p&gt;…").
// No network, no dependencies.

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…', bull: '•' };

export function decodeEntities(s) {
  return String(s ?? '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

// Returns lines. A heading line is prefixed "## " — from <h1-6>, or a block whose whole text is
// bold (<strong>/<b>), or a short block ending in ":". List items are prefixed "- ".
export function htmlToLines(content) {
  let html = decodeEntities(content); // first pass: Greenhouse escaping → real HTML
  html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ');
  html = html.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, t) => `\n@@H@@${t}\n`);
  html = html.replace(/<(p|div)[^>]*>\s*<(strong|b)[^>]*>([\s\S]*?)<\/\2>\s*(?:<br\s*\/?>\s*)?<\/\1>/gi, (_, _p, _b, t) => `\n@@H@@${t}\n`);
  html = html.replace(/<li[^>]*>/gi, '\n@@LI@@').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|ul|ol|tr|section|h[1-6])>/gi, '\n');
  const text = decodeEntities(html.replace(/<[^>]+>/g, ' '));
  const out = [];
  for (let raw of text.split('\n')) {
    let line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    let heading = false;
    if (line.startsWith('@@H@@')) { heading = true; line = line.slice(5).trim(); }
    let li = false;
    if (line.startsWith('@@LI@@')) { li = true; line = line.slice(6).trim(); }
    if (!line) continue;
    if (!heading && !li && line.length <= 80 && /:$/.test(line)) heading = true;
    out.push(heading ? `## ${line.replace(/:$/, '')}` : li ? `- ${line}` : line);
  }
  return out;
}

export const plainText = (content) => htmlToLines(content).join('\n');

// Sentence split inside one line (keeps list items whole unless they contain several sentences).
export const sentencesOf = (line) => String(line).split(/(?<=[.!?])\s+(?=[A-Z(“"])/).map((s) => s.trim()).filter(Boolean);
