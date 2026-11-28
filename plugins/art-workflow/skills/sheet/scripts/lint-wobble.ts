import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright') as typeof import('playwright');

import { existsSync } from 'node:fs';
const args = process.argv.slice(2);
const [input, output] = args.filter(a => !a.startsWith('--'));
const cfgPath = args.find(a => a.startsWith('--config='))?.split('=')[1] ?? (existsSync('wobble.config.json') ? 'wobble.config.json' : undefined);
const user = cfgPath ? JSON.parse(readFileSync(cfgPath, 'utf8')) : {};
for (const ig of user.ignore ?? []) if (!ig.reason) { console.error(`ignore entry "${ig.selector}" has no reason`); process.exit(2); }
const cfg = { window: user.window ?? 40, alt: user.alternations ?? 3, turn: user.minTurn ?? 0.06, maxTurn: user.maxTurn ?? 0.6,
  amp: user.maxAmplitude ?? 6, step: 1.5, minLen: user.minLength ?? 30, ignore: user.ignore ?? [] };

const svg = readFileSync(input, 'utf8');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
const res = await page.evaluate((cfg: any) => {
  const root = document.querySelector('svg')!;
  const skip = new Set<Element>(); const ignored: { what: string; reason: string }[] = []; const errors: string[] = [];
  for (const el of root.querySelectorAll('[data-wobble="ignore"]')) {
    const reason = el.getAttribute('data-wobble-reason');
    if (!reason) { errors.push(`<${el.tagName} id="${el.id}"> has data-wobble="ignore" without data-wobble-reason`); continue; }
    ignored.push({ what: el.id ? `#${el.id}` : `<${el.tagName}>`, reason });
    skip.add(el); el.querySelectorAll('*').forEach(c => skip.add(c));
  }
  for (const ig of cfg.ignore) { const hit = root.querySelectorAll(ig.selector); hit.forEach(el => { skip.add(el); el.querySelectorAll('*').forEach(c => skip.add(c)); }); ignored.push({ what: `${ig.selector} (${hit.length})`, reason: ig.reason }); }
  const els = ([...root.querySelectorAll('path,polygon,polyline')] as SVGGeometryElement[]).filter(e => !skip.has(e));
  const flagged: number[][][] = []; let checked = 0; let badEls = 0; let totalLen = 0; let badLen = 0;
  for (const el of els) {
    const L = el.getTotalLength(); const m = el.getScreenCTM(); if (!m || L === 0) continue;
    const scale = Math.hypot(m.a, m.b); const Ls = L * scale; if (Ls < cfg.minLen) continue;
    checked++; totalLen += Ls;
    const n = Math.floor(Ls / cfg.step); const P: number[][] = [];
    for (let i = 0; i <= n; i++) { const p = el.getPointAtLength(L * i / n).matrixTransform(m); P.push([p.x, p.y]); }
    const th: number[] = []; for (let i = 1; i < P.length; i++) th.push(Math.atan2(P[i][1] - P[i-1][1], P[i][0] - P[i-1][0]));
    const dt: number[] = []; for (let i = 1; i < th.length; i++) { let d = th[i] - th[i-1]; while (d > Math.PI) d -= 2*Math.PI; while (d < -Math.PI) d += 2*Math.PI; dt.push(d); }
    const runs: { s: number; e: number; sum: number }[] = [];
    for (let i = 0; i < dt.length; i++) {
      if (Math.abs(dt[i]) > Math.PI * 0.75) continue;
      const sg = Math.sign(dt[i]); if (sg === 0) continue;
      const r = runs[runs.length - 1];
      if (r && Math.sign(r.sum) === sg) { r.e = i; r.sum += dt[i]; } else runs.push({ s: i, e: i, sum: dt[i] });
    }
    const kept = runs.filter(r => Math.abs(r.sum) >= cfg.turn);
    const alts: { s: number; e: number }[] = [];
    for (let i = 1; i < kept.length; i++) {
      if (Math.abs(kept[i].sum) > cfg.maxTurn || Math.abs(kept[i-1].sum) > cfg.maxTurn) continue;
      if (Math.sign(kept[i].sum) !== Math.sign(kept[i-1].sum)) alts.push({ s: kept[i-1].s, e: kept[i].e });
    }
    const half = Math.max(2, Math.round(cfg.window / cfg.step / 2));
    const amp = (s: number, e: number) => { let mx = 0; for (let i = s; i <= e && i < P.length; i++) {
      let sx = 0, sy = 0, c = 0; for (let j = Math.max(0, i - half); j <= Math.min(P.length - 1, i + half); j++) { sx += P[j][0]; sy += P[j][1]; c++; }
      mx = Math.max(mx, Math.hypot(P[i][0] - sx / c, P[i][1] - sy / c)); } return mx; };
    const win = cfg.window / cfg.step; let elBad = false;
    for (let i = 0; i + cfg.alt - 1 < alts.length; i++) {
      const a = alts[i], b = alts[i + cfg.alt - 1];
      if (b.e - a.s <= win && amp(a.s, b.e + 1) <= cfg.amp) { elBad = true; flagged.push(P.slice(a.s, b.e + 2)); badLen += (b.e - a.s) * cfg.step; }
    }
    if (elBad) badEls++;
  }
  return { ignored, errors, checked, badEls, flagged, totalLen, badLen, w: root.width.baseVal.value, h: root.height.baseVal.value };
}, cfg);
const pct = (100 * res.badLen / Math.max(res.totalLen, 1));
for (const e of res.errors) console.error(e);
console.log(JSON.stringify({ ignored: res.ignored, checked: res.checked, wobblyElements: res.badEls, wobblyWindows: res.flagged.length, wobblyPercentOfLength: +pct.toFixed(2) }));
if (output) {
  const overlay = res.flagged.map(seg => `<polyline points="${seg.map(p => p.join(',')).join(' ')}" fill="none" stroke="#00ff3c" stroke-width="5" stroke-opacity="0.85" stroke-linecap="round"/>`).join('');
  await page.setContent(`<html><body style="margin:0;position:relative">${svg}<svg style="position:absolute;left:0;top:0" width="${res.w}" height="${res.h}">${overlay}</svg></body></html>`);
  await page.setViewportSize({ width: Math.ceil(res.w), height: Math.ceil(res.h) });
  await page.screenshot({ path: output });
}
await browser.close();
process.exit(res.errors.length ? 2 : res.flagged.length > 0 ? 1 : 0);
