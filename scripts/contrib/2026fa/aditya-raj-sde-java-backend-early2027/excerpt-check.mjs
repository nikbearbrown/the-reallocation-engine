import { chromium } from 'playwright';
const [url, ...needles] = process.argv.slice(2);
const b = await chromium.launch({ headless: true }); const p = await b.newPage();
const at = new Date().toISOString();
const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForTimeout(4000);
const body = await p.evaluate(() => document.body ? document.body.innerText : '');
console.log(JSON.stringify({ observed_at: at, status: r?.status(), final_url: p.url(), title: await p.title(), body_chars: body.length, found: Object.fromEntries(needles.map((n) => [n, body.includes(n)])) }, null, 1));
await b.close();
