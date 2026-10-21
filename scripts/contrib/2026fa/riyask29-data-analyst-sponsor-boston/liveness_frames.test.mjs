// Offline test for the ATS-iframe fix in scripts/ats/liveness-browser.mjs.
// Every request is answered by page.route, so no network is touched. The
// hostnames below are never contacted.
//
//   node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/liveness_frames.test.mjs

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const { checkUrlLiveness } = await import(path.join(ROOT, 'scripts/ats/liveness-browser.mjs'));

// Enough job text to pass the 300-character content floor, and no apply
// control in the top document: the shape of careers.everquote.com on 2026-10-19.
const JOB_TEXT = '<h1>Senior Analyst, SEM</h1><p>' + 'Own paid search reporting and analysis. '.repeat(12) + '</p>';
const careerPage = (iframeSrc) =>
  `<!doctype html><html><body><main>${JOB_TEXT}<iframe src="${iframeSrc}" width="600" height="400"></iframe></main></body></html>`;
const formFrame = (label) =>
  `<!doctype html><html><body><form><input type="file"><button type="submit">${label}</button></form></body></html>`;

const PAGES = {
  'https://careers.example-co.test/job/ats': careerPage('https://job-boards.greenhouse.io/embed/job_app?for=example'),
  'https://careers.example-co.test/job/widget': careerPage('https://chat.widget-vendor.test/frame'),
  'https://careers.example-co.test/job/none': `<!doctype html><html><body><main>${JOB_TEXT}</main></body></html>`,
  'https://job-boards.greenhouse.io/embed/job_app?for=example': formFrame('Submit application'),
  'https://chat.widget-vendor.test/frame': formFrame('Apply now'),
};

let browser, page;
before(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
  await page.route('**/*', (route) => {
    const body = PAGES[route.request().url()];
    return body
      ? route.fulfill({ status: 200, contentType: 'text/html', body })
      : route.fulfill({ status: 404, body: 'not found' });
  });
});
after(async () => { await browser?.close(); });

test('apply form inside a Greenhouse embed iframe → active', async () => {
  const r = await checkUrlLiveness(page, 'https://careers.example-co.test/job/ats');
  assert.equal(r.result, 'active', JSON.stringify(r));
});

test('break attempt: "Apply now" inside a non-ATS widget iframe is NOT read → uncertain', async () => {
  const r = await checkUrlLiveness(page, 'https://careers.example-co.test/job/widget');
  assert.equal(r.result, 'uncertain', JSON.stringify(r));
  assert.equal(r.code, 'no_apply_control');
});

test('job text with no apply control anywhere → still uncertain (no regression)', async () => {
  const r = await checkUrlLiveness(page, 'https://careers.example-co.test/job/none');
  assert.equal(r.result, 'uncertain', JSON.stringify(r));
});
