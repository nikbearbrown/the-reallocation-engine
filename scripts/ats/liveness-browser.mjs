/**
 * liveness-browser.mjs — Playwright-driven liveness check for a single URL.
 *
 * Shared by check-liveness.mjs (CLI tool) and scan.mjs (--verify flag).
 * Returns the same shape as classifyLiveness: { result, reason }.
 */

import { classifyLiveness } from './liveness-core.mjs';

const NAVIGATE_TIMEOUT_MS = 15_000;
const HYDRATION_WAIT_MS = 2_000;

// Defensive guards: URLs come from ATS feeds (mostly trusted) but a misconfigured
// portals.yml entry or a hijacked feed shouldn't be able to point Playwright at
// internal infrastructure. Only allow http(s) and reject loopback/private/link-local.
const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fe80:/i,
];

// Returns null when the URL is safe to fetch, otherwise a structured guard
// result with a stable `code` (used for routing in scan.mjs) plus a human
// `reason`. Stable codes — not regex on reason strings — drive downstream
// dispatch so the wording can change freely without breaking callers.
function rejectPrivateOrInvalid(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { code: 'invalid_url', reason: 'invalid URL' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { code: 'unsupported_protocol', reason: `unsupported protocol ${parsed.protocol}` };
  }
  if (PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname))) {
    return { code: 'blocked_host', reason: `blocked host ${parsed.hostname}` };
  }
  return null;
}

// Runs inside the page (and inside ATS embed frames): visible clickable
// elements outside nav/header/footer, reduced to their text labels.
const collectApplyControls = () => {
  const candidates = Array.from(
    document.querySelectorAll('a, button, input[type="submit"], input[type="button"], [role="button"]')
  );

  return candidates
    .filter((element) => {
      if (element.closest('nav, header, footer')) return false;
      if (element.closest('[aria-hidden="true"]')) return false;

      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (!element.getClientRects().length) return false;

      return Array.from(element.getClientRects()).some((rect) => rect.width > 0 && rect.height > 0);
    })
    .map((element) => {
      const label = [
        element.innerText,
        element.value,
        element.getAttribute('aria-label'),
        element.getAttribute('title'),
      ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      return label;
    })
    .filter(Boolean);
};

// Career sites often embed the ATS application form in an iframe (e.g.
// careers.everquote.com embeds job-boards.greenhouse.io/embed/job_app), so the
// "Submit application" control is invisible to the top document. Only frames
// served by a known ATS host are read; a chat or ad widget's "Apply" must not
// make a posting look live.
const ATS_EMBED_HOSTS = [
  /(^|\.)greenhouse\.io$/i,
  /(^|\.)lever\.co$/i,
  /(^|\.)ashbyhq\.com$/i,
  /(^|\.)myworkdayjobs\.com$/i,
  /(^|\.)smartrecruiters\.com$/i,
  /(^|\.)icims\.com$/i,
];

function isAtsEmbedFrame(frameUrl) {
  try {
    const { hostname } = new URL(frameUrl);
    return ATS_EMBED_HOSTS.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}

export async function checkUrlLiveness(page, url) {
  const guardError = rejectPrivateOrInvalid(url);
  if (guardError) {
    return { result: 'uncertain', code: guardError.code, reason: guardError.reason };
  }
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAVIGATE_TIMEOUT_MS });
    const status = response?.status() ?? 0;

    // Give SPAs (Ashby, Lever, Workday) time to hydrate
    await page.waitForTimeout(HYDRATION_WAIT_MS);

    const finalUrl = page.url();
    const bodyText = await page.evaluate(() => document.body?.innerText ?? '');
    const applyControls = await page.evaluate(collectApplyControls);
    for (const frame of page.frames()) {
      if (frame === page.mainFrame() || !isAtsEmbedFrame(frame.url())) continue;
      const frameControls = await frame.evaluate(collectApplyControls).catch(() => []);
      applyControls.push(...frameControls);
    }

    return classifyLiveness({ status, finalUrl, bodyText, applyControls });
  } catch (err) {
    // Transient failures (timeout, DNS, TLS, 5xx) shouldn't be treated as expired —
    // doing so would cause scan --verify to drop the URL and write it to scan-history,
    // permanently filtering it out on subsequent scans.
    return {
      result: 'uncertain',
      code: 'navigation_error',
      reason: `navigation error: ${err.message.split('\n')[0]}`,
    };
  }
}
