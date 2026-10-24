import { chromium } from 'playwright';
import fs from 'node:fs';
const sel = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).selected;
const b = await chromium.launch({ headless: true });
for (const s of sel) {
  const p = await b.newPage();
  const at = new Date().toISOString();
  try {
    const r = await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await p.waitForTimeout(4000);
    const body = await p.evaluate(() => document.body ? document.body.innerText : '');
    const t = s.title.trim().toLowerCase();
    console.log(JSON.stringify({ job_id: s.job_id, observed_at: at, status: r ? r.status() : null, final_url: p.url(), document_title: (await p.title()).slice(0, 120), body_chars: body.length, body_has_posting_title: body.toLowerCase().includes(t), body_has_job_id: body.includes(s.job_id) }));
  } catch (e) { console.log(JSON.stringify({ job_id: s.job_id, observed_at: at, error: String(e.message).slice(0, 160) })); }
  await p.close();
}
await b.close();
