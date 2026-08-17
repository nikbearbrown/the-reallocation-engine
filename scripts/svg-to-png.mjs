// svg-to-png.mjs — render every SVG under a target directory to PNG (300 dpi).
//
//   node scripts/svg-to-png.mjs             # default target: book/images
//   node scripts/svg-to-png.mjs <dir>       # e.g. book/d3
//
// Fall 2026: book content moved under book/, so the target is now an argument
// (the old hardcoded `images/` glob — and the CI call to `SCRIPTS/` — were the
// build.yml case-bug pair fixed in the fresh cut).

import sharp from 'sharp';
import { glob } from 'glob';
import { statSync } from 'fs';

const TARGET = process.argv[2] || 'book/images';
const files = await glob(`${TARGET}/**/*.svg`);

if (files.length === 0) console.log(`svg-to-png: no SVGs under ${TARGET}/`);

for (const file of files) {
  const out = file.replace('.svg', '.png');

  // Skip if PNG is newer than SVG
  try {
    const svgMtime = statSync(file).mtimeMs;
    const pngMtime = statSync(out).mtimeMs;
    if (pngMtime > svgMtime) {
      console.log(`skipped (up to date): ${out}`);
      continue;
    }
  } catch {
    // PNG doesn't exist yet — proceed
  }

  await sharp(file, { density: 300 }).png().toFile(out);
  console.log(`${file} → ${out}`);
}
