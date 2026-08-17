#!/usr/bin/env node

/**
 * Generate ATS-friendly PDF resumes from Markdown CV examples.
 *
 * Usage:
 *   node scripts/resumes/generate-pdf.mjs resumes/aarav-patel-cv.md
 *   node scripts/resumes/generate-pdf.mjs --all
 *   node scripts/resumes/generate-pdf.mjs --all --format=letter
 */

import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DEFAULT_OUTPUT_DIR = path.join(REPO_ROOT, 'output/resumes');
const DEFAULT_FORMAT = 'letter';

function usage() {
  console.error(`Usage:
  node scripts/resumes/generate-pdf.mjs <input.md> [output.pdf] [--format=letter|a4]
  node scripts/resumes/generate-pdf.mjs --all [--format=letter|a4]`);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

function normalizeTextForATS(text) {
  return text
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/\u2026/g, '...')
    .replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ');
}

function markdownToHtml(markdown) {
  const lines = normalizeTextForATS(markdown).split(/\r?\n/);
  const html = [];
  let inList = false;

  function closeList() {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length, 4);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  return html.join('\n');
}

function documentHtml(markdown, sourcePath) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(path.basename(sourcePath, '.md'))}</title>
  <style>
    @page { margin: 0.55in; }
    * { box-sizing: border-box; }
    body {
      color: #111;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.25pt;
      line-height: 1.28;
      margin: 0;
    }
    h1 {
      border-bottom: 1.5px solid #111;
      font-size: 20pt;
      letter-spacing: 0;
      line-height: 1.05;
      margin: 0 0 5px;
      padding-bottom: 4px;
      text-align: center;
    }
    h1 + p {
      font-size: 9.5pt;
      margin: 0 0 10px;
      text-align: center;
    }
    h2 {
      border-bottom: 1px solid #777;
      font-size: 11.5pt;
      letter-spacing: 0;
      margin: 10px 0 4px;
      padding-bottom: 2px;
      text-transform: uppercase;
    }
    h3 {
      font-size: 10.5pt;
      margin: 8px 0 2px;
    }
    p {
      margin: 2px 0 4px;
    }
    ul {
      margin: 3px 0 6px 17px;
      padding: 0;
    }
    li {
      margin: 1.5px 0;
      padding-left: 1px;
    }
    code {
      font-family: Arial, Helvetica, sans-serif;
      font-size: inherit;
    }
    strong {
      font-weight: 700;
    }
  </style>
</head>
<body>
${markdownToHtml(markdown)}
</body>
</html>`;
}

async function discoverMarkdownResumes() {
  const { readdir } = await import('fs/promises');
  const resumesDir = path.join(REPO_ROOT, 'resumes');
  const files = await readdir(resumesDir);
  return files
    .filter((file) => file.endsWith('-cv.md'))
    .sort()
    .map((file) => path.join(resumesDir, file));
}

function parseArgs(argv) {
  let all = false;
  let format = DEFAULT_FORMAT;
  const positional = [];

  for (const arg of argv) {
    if (arg === '--all') {
      all = true;
    } else if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
    } else {
      positional.push(arg);
    }
  }

  if (!['letter', 'a4'].includes(format)) {
    throw new Error(`Invalid format "${format}". Use letter or a4.`);
  }

  return { all, format, positional };
}

async function renderOne(browser, inputPath, outputPath, format) {
  const markdown = await readFile(inputPath, 'utf-8');
  const html = documentHtml(markdown, inputPath);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({
      format,
      printBackground: true,
      preferCSSPageSize: true,
    });
    await writeFile(outputPath, pdf);
    const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`${path.relative(REPO_ROOT, inputPath)} -> ${path.relative(REPO_ROOT, outputPath)} (${pageCount} page${pageCount === 1 ? '' : 's'})`);
  } finally {
    await page.close();
  }
}

async function main() {
  const { all, format, positional } = parseArgs(process.argv.slice(2));
  let jobs = [];

  if (all) {
    const inputs = await discoverMarkdownResumes();
    jobs = inputs.map((input) => [
      input,
      path.join(DEFAULT_OUTPUT_DIR, `${path.basename(input, '.md')}.pdf`),
    ]);
  } else {
    if (positional.length < 1 || positional.length > 2) {
      usage();
      process.exit(1);
    }
    const input = path.resolve(positional[0]);
    if (!existsSync(input)) {
      throw new Error(`Input file not found: ${input}`);
    }
    const output = positional[1]
      ? path.resolve(positional[1])
      : path.join(DEFAULT_OUTPUT_DIR, `${path.basename(input, '.md')}.pdf`);
    jobs = [[input, output]];
  }

  if (jobs.length === 0) {
    throw new Error('No Markdown CV files found.');
  }

  const browser = await chromium.launch({ headless: true });
  try {
    for (const [input, output] of jobs) {
      await renderOne(browser, input, output, format);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`PDF generation failed: ${error.message}`);
  process.exit(1);
});
