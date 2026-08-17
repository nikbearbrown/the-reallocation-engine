#!/usr/bin/env node
// svg-layout-audit.mjs — PURELY GEOMETRIC layout audit for figure SVGs.
//
// Checks LAYOUT ONLY (no facts, no notation, no spelling):
//   OOB           text extends outside the viewBox (clipping)
//   OVERFLOW      text spills outside the rect/polygon it sits in
//   TEXT/LINE     text sits on top of a connector or arrow <line>
//   TEXT/PATH     text sits on top of a connector/arrow <path> (incl. curves)
//   TEXT/SHAPE    text sits on a node <circle>/<ellipse> it does not belong to
//   TEXT/TEXT     two text labels overlap each other
//   TEXT/CONTRAST text fill is too close in luminance to the fill behind it (warn)
//   GLYPH         text uses a non-ASCII glyph that may render as a missing box (warn)
//
// Deterministic. No network, no API, Node builtins only. Shapes (rect/line/
// polygon) use exact coordinates; <path> curves are flattened to polylines;
// only text WIDTH is estimated (conservatively), so edge calls are tunable.
//
// Usage:
//   node scripts/svg-layout-audit.mjs                # audit ./images
//   node scripts/svg-layout-audit.mjs path|dir       # audit a file or dir
//   node scripts/svg-layout-audit.mjs --json         # machine-readable
//   TOL=2 node scripts/svg-layout-audit.mjs          # px tolerance (default 1.5)
//   CONTRAST=2.5 node scripts/svg-layout-audit.mjs   # min WCAG ratio (default 2.5)
//   --strict                                         # GLYPH/CONTRAST warnings also fail
// Exit: 0 = clean, 1 = layout errors found.

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const STRICT = ARGS.includes('--strict');
const TARGET = ARGS.find(a => !a.startsWith('--')) || 'images';
const TOL = Number(process.env.TOL ?? 1.5);
const CONTRAST_MIN = Number(process.env.CONTRAST ?? 2.5);

// ── text width model (em fractions), tuned for the librsvg/DejaVu fallback ──
const NARROW = new Set("iIl.,:;'|!ftrj()[]{}- /");
const WIDE   = new Set("mwMW@—–");
const UPPER  = new Set("ABCDEFGHJKLNOPQRSTUVXYZ");
const charEm = c => NARROW.has(c) ? 0.30 : WIDE.has(c) ? 0.92 : UPPER.has(c) ? 0.68 : /[0-9]/.test(c) ? 0.56 : 0.52;
const textW = (s, fs, ls = 0) => [...s].reduce((a, c) => a + charEm(c) * fs, 0) + Math.max(0, [...s].length - 1) * ls;

const decode = s => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const num = (v, d = 0) => { const n = parseFloat(String(v ?? '').replace(/[a-z%]+$/i, '')); return Number.isFinite(n) ? n : d; };
const attr = (s, n) => { const m = s.match(new RegExp(n + '\\s*=\\s*"([^"]*)"')); return m ? m[1] : null; };

// ── color → contrast (WCAG relative luminance) ──
const NAMED = { white: '#ffffff', black: '#000000', red: '#ff0000', none: null, transparent: null, currentcolor: null };
function toRGB(c) {
  if (!c) return null;
  c = c.trim().toLowerCase();
  if (c in NAMED) c = NAMED[c];
  if (!c) return null;
  let m = c.match(/^#([0-9a-f]{3})$/i);
  if (m) { const h = m[1]; return [h[0] + h[0], h[1] + h[1], h[2] + h[2]].map(x => parseInt(x, 16)); }
  m = c.match(/^#([0-9a-f]{6})$/i);
  if (m) { return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)); }
  m = c.match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);
  if (m) { return [+m[1], +m[2], +m[3]]; }
  return null;
}
const relLum = rgb => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
const contrast = (a, b) => { const la = relLum(a), lb = relLum(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };

// glyphs known to render in the fallback fonts; anything else non-ASCII is flagged
const SAFE_EXTRA = new Set([...'—–·•…→←↑↓×÷✓✗“”‘’°≤≥±≈≠→éèêëàâäçñüûùöôïî§'.normalize('NFC')]);
const glyphRisk = s => {
  const bad = new Set();
  for (const ch of s) { const cp = ch.codePointAt(0); if (cp < 0x7f || SAFE_EXTRA.has(ch)) continue; bad.add(ch); }
  return [...bad];
};

const rot = (x, y, a, cx, cy) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), dx = x - cx, dy = y - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
const pointInPoly = (x, y, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
};
const segSeg = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3); if (d === 0) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d, u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};
const boxOverlap = (A, B, t = 0) => A.l < B.r - t && A.r > B.l + t && A.t < B.b - t && A.b > B.t + t;

// ── flatten a path `d` into line segments (M/L/H/V/C/S/Q/T/A/Z, abs+rel) ──
function flattenPath(d) {
  const segs = [];
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  if (!toks) return segs;
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = '', prev = null;
  const rd = () => parseFloat(toks[i++]);
  const line = (x, y) => { if (prev) segs.push({ x1: prev[0], y1: prev[1], x2: x, y2: y }); prev = [x, y]; };
  const bez = (p0, c1, c2, p1) => { const N = 16; for (let s = 1; s <= N; s++) { const u = s / N, v = 1 - u; const X = v * v * v * p0[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * p1[0]; const Y = v * v * v * p0[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * p1[1]; line(X, Y); } };
  const quad = (p0, c, p1) => { const N = 16; for (let s = 1; s <= N; s++) { const u = s / N, v = 1 - u; const X = v * v * p0[0] + 2 * v * u * c[0] + u * u * p1[0]; const Y = v * v * p0[1] + 2 * v * u * c[1] + u * u * p1[1]; line(X, Y); } };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) { cmd = toks[i++]; }
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    const ax = v => rel ? cx + v : v, ay = v => rel ? cy + v : v;
    if (C === 'M') { const x = ax(rd()), y = ay(rd()); cx = sx = x; cy = sy = y; prev = [x, y]; cmd = rel ? 'l' : 'L'; }
    else if (C === 'L') { const x = ax(rd()), y = ay(rd()); line(x, y); cx = x; cy = y; }
    else if (C === 'H') { const x = ax(rd()); line(x, cy); cx = x; }
    else if (C === 'V') { const y = ay(rd()); line(cx, y); cy = y; }
    else if (C === 'C') { const c1 = [ax(rd()), ay(rd())], c2 = [ax(rd()), ay(rd())], p = [ax(rd()), ay(rd())]; bez([cx, cy], c1, c2, p); cx = p[0]; cy = p[1]; }
    else if (C === 'S') { const c2 = [ax(rd()), ay(rd())], p = [ax(rd()), ay(rd())]; bez([cx, cy], [cx, cy], c2, p); cx = p[0]; cy = p[1]; }
    else if (C === 'Q') { const c = [ax(rd()), ay(rd())], p = [ax(rd()), ay(rd())]; quad([cx, cy], c, p); cx = p[0]; cy = p[1]; }
    else if (C === 'T') { const p = [ax(rd()), ay(rd())]; quad([cx, cy], [cx, cy], p); cx = p[0]; cy = p[1]; }
    else if (C === 'A') { rd(); rd(); rd(); rd(); rd(); const x = ax(rd()), y = ay(rd()); line(x, y); cx = x; cy = y; }
    else if (C === 'Z') { line(sx, sy); cx = sx; cy = sy; }
    else { i++; }
  }
  return segs;
}

// circle/ellipse → polygon (so node shapes plug into the container + strike machinery)
const ellipsePoly = (cx, cy, rx, ry, N = 24) => { const pts = []; for (let i = 0; i < N; i++) { const a = 2 * Math.PI * i / N; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return pts; };

// ── transform list → 2x3 matrix [a,b,c,d,e,f] (translate/rotate/scale/matrix, SVG order) ──
const IDENT = [1, 0, 0, 1, 0, 0];
const matMul = (m, n) => [ m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1], m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3], m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5] ];
const applyM = (M, x, y) => [M[0]*x + M[2]*y + M[4], M[1]*x + M[3]*y + M[5]];
function transformMatrix(tr) {
  if (!tr) return IDENT;
  let M = IDENT;
  const re = /(translate|rotate|scale|matrix)\s*\(([^)]*)\)/g;
  let mm, found = false;
  while ((mm = re.exec(tr))) {
    found = true;
    const v = mm[2].trim().split(/[\s,]+/).map(Number);
    let p;
    if (mm[1] === 'translate') p = [1, 0, 0, 1, v[0] || 0, v[1] || 0];
    else if (mm[1] === 'scale') p = [v[0] || 1, 0, 0, (v[1] != null ? v[1] : v[0]) || 1, 0, 0];
    else if (mm[1] === 'rotate') { const a = (v[0] || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      p = v.length >= 3 ? [c, s, -s, c, v[1] - v[1]*c + v[2]*s, v[2] - v[1]*s - v[2]*c] : [c, s, -s, c, 0, 0]; }
    else if (mm[1] === 'matrix') p = [v[0], v[1], v[2], v[3], v[4], v[5]];
    else p = IDENT;
    M = matMul(M, p);
  }
  return found ? M : IDENT;
}
const bboxOf = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return { l: Math.min(...xs), t: Math.min(...ys), r: Math.max(...xs), b: Math.max(...ys) }; };

// ── tspan-aware text measurement: max LINE width + vertical span (not summed) ──
// A tspan with a `dy` starts a new visual line; tspans/text without `dy` stay on the line.
function measureLines(inner, fs, ls, tl, textW, decode, attr, num) {
  const re = /<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g;
  const clean = s => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  let pieces = [], last = 0, mm;
  while ((mm = re.exec(inner))) {
    const pre = clean(inner.slice(last, mm.index)); if (pre) pieces.push({ dy: null, text: pre });
    const dyA = attr(mm[1], 'dy');
    pieces.push({ dy: dyA != null ? num(dyA) : null, text: clean(mm[2]) });
    last = re.lastIndex;
  }
  const tail = clean(inner.slice(last)); if (tail) pieces.push({ dy: null, text: tail });
  if (!pieces.length) { const t = clean(inner); pieces = [{ dy: null, text: t }]; }
  let lines = [], curW = 0, curY = 0, lineY = 0, started = false;
  for (const p of pieces) {
    if (p.dy != null) { curY += p.dy; if (started) { lines.push({ w: curW, y: lineY }); curW = 0; } lineY = curY; }
    curW += textW(p.text, fs, ls); started = true;
  }
  lines.push({ w: curW, y: lineY });
  if (tl > 0 && lines.length === 1) lines[0].w = tl;
  const wmax = Math.max(0, ...lines.map(l => l.w));
  return { wmax, top: (lines[0].y) - 0.80 * fs, bot: (lines[lines.length - 1].y) + 0.22 * fs };
}

function parse(svg) {
  const vb = svg.match(/viewBox\s*=\s*"([\d.\s-]+)"/);
  let W = 700, H = 420;
  if (vb) { const p = vb[1].trim().split(/\s+/).map(Number); W = p[2] || W; H = p[3] || H; }
  const texts = [], rects = [], lines = [], polys = [], pathSegs = [], nodes = [];
  const re = /<(\/?)(svg|g)\b([^>]*?)(\/?)>|<text\b([^>]*?)>([\s\S]*?)<\/text>|<rect\b([^>]*?)\/?>|<line\b([^>]*?)\/?>|<polygon\b([^>]*?)\/?>|<path\b([^>]*?)\/?>|<circle\b([^>]*?)\/?>|<ellipse\b([^>]*?)\/?>/g;
  const stack = [{ fs: 16, anchor: 'start', fill: '#000000', mat: IDENT }];
  let m;
  while ((m = re.exec(svg))) {
    if (m[2] === 'svg' || m[2] === 'g') {
      if (m[1] === '/') { if (stack.length > 1) stack.pop(); }
      else { const a = m[3] || '', top = stack[stack.length - 1], fs = attr(a, 'font-size'), an = attr(a, 'text-anchor'), fl = attr(a, 'fill');
        if (m[4] !== '/') stack.push({ fs: fs != null ? num(fs, top.fs) : top.fs, anchor: an || top.anchor, fill: fl || top.fill, mat: matMul(top.mat, transformMatrix(attr(a, 'transform'))) }); }
      continue;
    }
    const top = stack[stack.length - 1];
    if (m[5] != null) {
      const a = m[5], inner = m[6] || '';
      const content = decode(inner.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      if (!content) continue;
      const fs = attr(a, 'font-size') != null ? num(attr(a, 'font-size'), top.fs) : top.fs;
      const anchor = attr(a, 'text-anchor') || top.anchor;
      const fill = attr(a, 'fill') || top.fill;
      const ls = num(attr(a, 'letter-spacing'), 0);
      const tl = num(attr(a, 'textLength'), 0);
      const x = num(attr(a, 'x')), y = num(attr(a, 'y'));
      const { wmax: w, top: ltop, bot: lbot } = measureLines(inner, fs, ls, tl, textW, decode, attr, num);
      const l = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
      const M = matMul(top.mat, transformMatrix(attr(a, 'transform')));
      const corners = [[l, y + ltop], [l + w, y + ltop], [l + w, y + lbot], [l, y + lbot]].map(([px, py]) => applyM(M, px, py));
      texts.push({ content, fill, bbox: bboxOf(corners) });
    } else if (m[7] != null) {
      const a = m[7], x = num(attr(a, 'x')), y = num(attr(a, 'y')), w = num(attr(a, 'width')), h = num(attr(a, 'height'));
      const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map(([px, py]) => applyM(top.mat, px, py));
      rects.push({ ...bboxOf(pts), area: w * h, fill: attr(a, 'fill'), pts });
    } else if (m[8] != null) {
      const a = m[8]; const [x1, y1] = applyM(top.mat, num(attr(a, 'x1')), num(attr(a, 'y1'))), [x2, y2] = applyM(top.mat, num(attr(a, 'x2')), num(attr(a, 'y2')));
      lines.push({ x1, y1, x2, y2 });
    } else if (m[9] != null) {
      const a = m[9], pts = (attr(a, 'points') || '').trim().split(/\s+/).map(p => p.split(',').map(Number)).filter(p => p.length === 2).map(([px, py]) => applyM(top.mat, px, py));
      if (pts.length >= 3) { const bb = bboxOf(pts); polys.push({ ...bb, area: (bb.r - bb.l) * (bb.b - bb.t), fill: attr(a, 'fill'), pts }); }
    } else if (m[10] != null) {
      const a = m[10], d = attr(a, 'd'); if (!d) continue;
      const fill = (attr(a, 'fill') || 'none').toLowerCase(), stroke = attr(a, 'stroke');
      // connector/arrow paths only: stroked and not a filled shape (markers, curves)
      if (stroke && stroke.toLowerCase() !== 'none' && (fill === 'none' || fill === 'transparent')) {
        for (const s of flattenPath(d)) { const [x1, y1] = applyM(top.mat, s.x1, s.y1), [x2, y2] = applyM(top.mat, s.x2, s.y2); pathSegs.push({ x1, y1, x2, y2 }); }
      }
    } else if (m[11] != null) {
      const a = m[11], cx = num(attr(a, 'cx')), cy = num(attr(a, 'cy')), r = num(attr(a, 'r'));
      if (r > 0) { const pts = ellipsePoly(cx, cy, r, r).map(([px, py]) => applyM(top.mat, px, py)); nodes.push({ ...bboxOf(pts), area: Math.PI * r * r, fill: attr(a, 'fill'), pts }); }
    } else if (m[12] != null) {
      const a = m[12], cx = num(attr(a, 'cx')), cy = num(attr(a, 'cy')), rx = num(attr(a, 'rx')), ry = num(attr(a, 'ry'));
      if (rx > 0 && ry > 0) { const pts = ellipsePoly(cx, cy, rx, ry).map(([px, py]) => applyM(top.mat, px, py)); nodes.push({ ...bboxOf(pts), area: Math.PI * rx * ry, fill: attr(a, 'fill'), pts }); }
    }
  }
  return { W, H, texts, rects, lines, polys, pathSegs, nodes };
}

function audit(file) {
  const { W, H, texts, rects, lines, polys, pathSegs, nodes } = parse(file.svg);
  const issues = [];
  const canvas = W * H;
  // background fill = the largest near-canvas rect's fill (default white)
  const bg = rects.filter(r => r.area >= 0.85 * canvas).sort((a, b) => b.area - a.area)[0];
  const bgFill = (bg && bg.fill) || '#FFFFFF';
  // containers = rects + polygons big enough to hold text but not the full canvas
  const containers = [...rects, ...polys, ...nodes].filter(s => s.area >= 200 && s.area < 0.85 * canvas);
  for (const tx of texts) {
    const b = tx.bbox, lab = tx.content.length > 34 ? tx.content.slice(0, 34) + '…' : tx.content;
    if (b.l < -TOL || b.t < -TOL || b.r > W + TOL || b.b > H + TOL)
      issues.push({ code: 'OOB', msg: `"${lab}" outside viewBox (r=${b.r.toFixed(0)} b=${b.b.toFixed(0)} vs ${W}x${H})` });
    const cx = (b.l + b.r) / 2, cy = (b.t + b.b) / 2;
    const owners = containers.filter(s => pointInPoly(cx, cy, s.pts)).sort((p, q) => p.area - q.area);
    if (owners.length) {
      const o = owners[0];
      const probes = [[b.l + 1, cy], [b.r - 1, cy], [cx, b.t + 1], [cx, b.b - 1]];
      const out = probes.filter(([px, py]) => !pointInPoly(px, py, o.pts));
      if (out.length) {
        const dl = Math.max(0, o.l - b.l), dr = Math.max(0, b.r - o.r), dtp = Math.max(0, o.t - b.t), db = Math.max(0, b.b - o.b);
        if (dl > TOL || dr > TOL || dtp > TOL || db > TOL || out.length)
          issues.push({ code: 'OVERFLOW', msg: `"${lab}" spills its box (${dl.toFixed(0)}L ${dr.toFixed(0)}R ${dtp.toFixed(0)}T ${db.toFixed(0)}B px)` });
      }
    }
    // TEXT/LINE + TEXT/PATH: flag a real strike-through — a connector crossing the
    // text's horizontal or vertical centerline (ignores connectors that clip a corner).
    const px = Math.min(3, (b.r - b.l) / 4), py = Math.min(3, (b.b - b.t) / 4);
    const crosses = segs => segs.some(ln =>
      segSeg(ln.x1, ln.y1, ln.x2, ln.y2, b.l + px, cy, b.r - px, cy) ||
      segSeg(ln.x1, ln.y1, ln.x2, ln.y2, cx, b.t + py, cx, b.b - py));
    // a label inside a small opaque node/box occludes any connector routed behind it,
    // so a geometric line/path "strike" there is hidden in the render — don't flag it.
    const opaque = f => f && !['none', 'transparent'].includes(String(f).toLowerCase());
    const inFilledNode = owners.some(o => o.area < 0.25 * canvas && opaque(o.fill));
    if (!inFilledNode && crosses(lines)) issues.push({ code: 'TEXT/LINE', msg: `"${lab}" sits on an arrow/line` });
    if (!inFilledNode && crosses(pathSegs)) issues.push({ code: 'TEXT/PATH', msg: `"${lab}" sits on a curve/path` });
    // TEXT/SHAPE: a node circle/ellipse that is NOT this text's own container crossing
    // its centerline — a label or annotation printed over a node it doesn't belong to.
    const ownerSet = new Set(owners);
    const shapeStrike = nodes.some(nd => !ownerSet.has(nd) && nd.pts.some((p, i) => {
      const q = nd.pts[(i + 1) % nd.pts.length];
      return segSeg(p[0], p[1], q[0], q[1], b.l + px, cy, b.r - px, cy) ||
             segSeg(p[0], p[1], q[0], q[1], cx, b.t + py, cx, b.b - py);
    }));
    if (shapeStrike) issues.push({ code: 'TEXT/SHAPE', msg: `"${lab}" overlaps a node circle/shape` });
    // TEXT/CONTRAST: text fill vs the fill behind it (its container, else the canvas)
    const tRGB = toRGB(tx.fill);
    const behind = owners.length ? (toRGB(owners[0].fill) || toRGB(bgFill)) : toRGB(bgFill);
    if (tRGB && behind) {
      const cr = contrast(tRGB, behind);
      if (cr < CONTRAST_MIN)
        issues.push({ code: 'TEXT/CONTRAST', warn: true, msg: `"${lab}" ${tx.fill} on ${owners.length ? (owners[0].fill || bgFill) : bgFill} — ${cr.toFixed(1)}:1 (min ${CONTRAST_MIN})` });
    }
    const bad = glyphRisk(tx.content);
    if (bad.length) issues.push({ code: 'GLYPH', warn: true, msg: `"${lab}" → glyph ${bad.map(c => JSON.stringify(c)).join(',')} may not render` });
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++)
    if (boxOverlap(texts[i].bbox, texts[j].bbox, 2))
      issues.push({ code: 'TEXT/TEXT', msg: `"${texts[i].content.slice(0, 22)}" overlaps "${texts[j].content.slice(0, 22)}"` });
  return issues;
}

function walk(p) {
  const st = statSync(p);
  if (st.isFile()) return p.toLowerCase().endsWith('.svg') ? [p] : [];
  return readdirSync(p).flatMap(e => walk(join(p, e)));
}

let files = [];
try { files = walk(TARGET).sort(); } catch { console.error(`Path not found: ${TARGET}`); process.exit(0); }
const report = [];
let nErr = 0, nWarn = 0, nBad = 0;
for (const f of files) {
  const issues = audit({ svg: readFileSync(f, 'utf8') });
  if (!issues.length) continue;
  nBad++;
  const errs = issues.filter(i => !i.warn).length, warns = issues.filter(i => i.warn).length;
  nErr += errs; nWarn += warns;
  report.push({ file: f, issues });
}
if (JSON_OUT) { console.log(JSON.stringify({ files: files.length, flagged: nBad, errors: nErr, warnings: nWarn, report }, null, 2)); }
else {
  for (const r of report) {
    console.log(`\n### ${r.file}`);
    for (const i of r.issues) console.log(`  [${i.code}]${i.warn ? ' (warn)' : ''} ${i.msg}`);
  }
  console.log(`\n==== ${nBad}/${files.length} SVGs flagged | ${nErr} layout errors | ${nWarn} warnings ====`);
  console.log('Codes: OOB=outside-canvas  OVERFLOW=spills-box  TEXT/LINE=on-arrow  TEXT/PATH=on-curve  TEXT/SHAPE=on-node-circle  TEXT/TEXT=labels-overlap  TEXT/CONTRAST=low-contrast(warn)  GLYPH=may-not-render(warn)');
}
process.exit((nErr > 0 || (STRICT && nWarn > 0)) ? 1 : 0);
