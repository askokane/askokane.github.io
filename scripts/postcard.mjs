// Generates a shareable "postcard" (SVG + rasterized PNG) per post.
// Pure function of post frontmatter — no manual design work per post.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fonts');

const W = 1080;
const H = 1350;
const MARGIN = 60;
const PAD = 56;
const SHARE_H = 104; // reserved strip at the bottom for the share affordance
const DOMAIN = 'atharvakokane.com';

const COLOR = {
  bg: '#060606',
  fg: '#e0e0e0',
  muted: '#8a8a8a',
  faint: '#555555',
  border: '#2c2c2c',
  border2: '#3a3a3a',
  bright: '#ffffff',
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function base64Font(filename) {
  return readFileSync(join(FONTS_DIR, filename)).toString('base64');
}

// embedded as data URIs so the SVG renders correctly with the site's actual
// fonts wherever it's dropped — <img src>, downloaded, shared, etc. — without
// depending on the host page's stylesheet
const FONT_FACES = `
    @font-face { font-family: 'Archivo Black'; src: url(data:font/ttf;base64,${base64Font('ArchivoBlack-Regular.ttf')}) format('truetype'); }
    @font-face { font-family: 'JetBrains Mono'; src: url(data:font/ttf;base64,${base64Font('JetBrainsMono.ttf')}) format('truetype'); }
  `;

// deterministic PRNG so each slug always produces the same "fingerprint" motif
function seedFromString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// crude but adequate width estimate — avoids needing real font-metrics just to
// decide line breaks. Archivo Black runs wider than JetBrains Mono.
function wrapText(text, maxWidth, fontSize, ratio) {
  const charW = fontSize * ratio;
  const maxChars = Math.max(1, Math.floor(maxWidth / charW));
  const lines = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) { lines.push(cur); cur = w; } else { cur = next; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// pick the largest display size at which the title fits in <= maxLines
function fitTitle(title, maxWidth, sizes, maxLines) {
  for (const fontSize of sizes) {
    const lines = wrapText(title, maxWidth, fontSize, 0.63);
    if (lines.length <= maxLines) return { fontSize, lines };
  }
  const fontSize = sizes[sizes.length - 1];
  return { fontSize, lines: wrapText(title, maxWidth, fontSize, 0.63).slice(0, maxLines) };
}

function waveform(rng, x0, x1, yBase, maxH) {
  const bars = [];
  const spacing = 13.5;
  for (let x = x0; x < x1; x += spacing) {
    const h = 4 + rng() * maxH;
    const op = 0.3 + rng() * 0.45;
    bars.push(
      `<rect x="${x.toFixed(1)}" y="${(yBase - h).toFixed(1)}" width="2.5" height="${h.toFixed(1)}" fill="${COLOR.border2}" opacity="${op.toFixed(2)}" />`
    );
  }
  return bars.join('\n      ');
}

function cornerTicks() {
  const pts = [
    [MARGIN - 18, MARGIN - 18, 1, 1],
    [W - MARGIN + 18, MARGIN - 18, -1, 1],
    [MARGIN - 18, H - MARGIN + 18, 1, -1],
    [W - MARGIN + 18, H - MARGIN + 18, -1, -1],
  ];
  return pts
    .map(([x, y, dx, dy]) => {
      const len = 15;
      return `<path d="M ${x} ${y + len * dy} L ${x} ${y} L ${x + len * dx} ${y}" stroke="${COLOR.border2}" stroke-width="1.5" fill="none" />`;
    })
    .join('\n    ');
}

export function renderPostcardSVG(post) {
  const { title, excerpt, date, readtime, slug } = post;
  const rng = mulberry32(seedFromString(slug + title));

  const x0 = MARGIN + PAD;
  const x1 = W - MARGIN - PAD;
  const contentWidth = x1 - x0;

  // ── type sizing ─────────────────────────────────────────────────────
  const { fontSize: titleSize, lines: titleLines } = fitTitle(
    title,
    contentWidth,
    [96, 88, 80, 72, 64, 56, 48],
    3
  );
  const titleLH = titleSize * 1.04;

  const exSize = 30;
  const exLH = exSize * 1.42;
  const exLines = excerpt ? wrapText(excerpt, contentWidth, exSize, 0.6).slice(0, 3) : [];

  const kickerY = MARGIN + 52;
  const topRuleY = MARGIN + 72;
  const shareTop = H - MARGIN - SHARE_H;
  const metaY = shareTop - 44;

  // ── vertically centre the [waveform · title · excerpt] block in the
  //    space between the top rule and the meta line ─────────────────────
  const waveMax = 60;
  const gapWaveTitle = 78;
  const gapTitleEx = 52;

  const titleAscent = titleSize * 0.74;
  const titleH = titleAscent + (titleLines.length - 1) * titleLH;
  const exH = exLines.length ? exSize + (exLines.length - 1) * exLH : 0;
  const blockH = waveMax + gapWaveTitle + titleH + (exH ? gapTitleEx + exH : 0);

  const regionTop = topRuleY + 40;
  const regionBottom = metaY - 56;
  const blockTop = regionTop + Math.max(0, (regionBottom - regionTop - blockH) / 2);

  const waveBaseY = blockTop + waveMax;
  const titleBase0 = waveBaseY + gapWaveTitle + titleAscent;
  const exBase0 = titleBase0 + (titleLines.length - 1) * titleLH + gapTitleEx + exSize;

  const waveBars = waveform(rng, x0, x1, waveBaseY, waveMax);

  const titleTspans = titleLines
    .map((line, i) => `<tspan x="${x0}" y="${(titleBase0 + i * titleLH).toFixed(1)}">${esc(line)}</tspan>`)
    .join('');

  const exTspans = exLines
    .map((line, i) => `<tspan x="${x0}" y="${(exBase0 + i * exLH).toFixed(1)}">${esc(line)}</tspan>`)
    .join('');
  const excerptEl = exLines.length
    ? `<text font-family="JetBrains Mono" font-size="${exSize}" fill="${COLOR.muted}" letter-spacing="0.3">${exTspans}</text>`
    : '';

  const dotDate = date.replace(/-/g, '.');

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${FONT_FACES}</style>
  </defs>

  <rect width="${W}" height="${H}" fill="${COLOR.bg}" />

  <rect x="${MARGIN}" y="${MARGIN}" width="${W - MARGIN * 2}" height="${H - MARGIN * 2}" fill="none" stroke="${COLOR.border}" stroke-width="1" />
  ${cornerTicks()}

  <text x="${x0}" y="${kickerY}" font-family="JetBrains Mono" font-size="16" letter-spacing="1.5" fill="${COLOR.muted}">// a.kokane</text>
  <text x="${x1}" y="${kickerY}" font-family="JetBrains Mono" font-size="16" letter-spacing="1.5" fill="${COLOR.muted}" text-anchor="end">[ writing ]</text>
  <line x1="${x0}" y1="${topRuleY}" x2="${x1}" y2="${topRuleY}" stroke="${COLOR.border}" stroke-width="1" />

  <g>
      ${waveBars}
  </g>

  <text font-family="Archivo Black" font-size="${titleSize}" fill="${COLOR.fg}" letter-spacing="-0.02em">${titleTspans}</text>

  ${excerptEl}

  <line x1="${x0}" y1="${metaY - 22}" x2="${x1}" y2="${metaY - 22}" stroke="${COLOR.border}" stroke-width="1" />
  <text x="${x0}" y="${metaY + 6}" font-family="JetBrains Mono" font-size="17" fill="${COLOR.muted}">${esc(dotDate)}</text>
  <text x="${x1}" y="${metaY + 6}" font-family="JetBrains Mono" font-size="17" fill="${COLOR.muted}" text-anchor="end">${esc(readtime)} min read</text>

  <line x1="${MARGIN}" y1="${shareTop}" x2="${W - MARGIN}" y2="${shareTop}" stroke="${COLOR.border}" stroke-width="1" />
  <text x="${W / 2}" y="${shareTop + SHARE_H / 2 + 7}" font-family="JetBrains Mono" font-size="20" letter-spacing="2" fill="${COLOR.fg}" text-anchor="middle">${DOMAIN} ↗</text>
</svg>
`;
}
