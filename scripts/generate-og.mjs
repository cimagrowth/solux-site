// Regenerates the per-page Open Graph image set in assets/brand/og/ (1200x630).
// Dev-only tool — NOT part of the deploy (Vercel output is `.`, no build step).
// Requires Chromium via Playwright. Usage:  node scripts/generate-og.mjs

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTDIR = `${REPO}/assets/brand/og`;
// Inline the Corona mark markup so it renders under setContent (no file:// origin).
const MARK_SVG = readFileSync(`${REPO}/assets/brand/solux-mark.svg`, 'utf8');

// Per-page OG content. key -> {eyebrow, lines[], foot, file}
const PAGES = [
  { file: 'og-home.png', eyebrow: 'THE FERTILITY CLINIC OPERATING SYSTEM',
    lines: ['Run 120 cycles a month', 'with the team', 'that runs 60.'],
    foot: 'FUNNEL · CHART · EMBRYOLOGY LAB · LEDGER — ONE DATABASE' },
  { file: 'og-home-es.png', eyebrow: 'EL SISTEMA OPERATIVO DE LA CLÍNICA DE FERTILIDAD',
    lines: ['120 ciclos al mes', 'con el equipo', 'que hoy hace 60.'],
    foot: 'EMBUDO · HISTORIA · LABORATORIO · LIBRO MAYOR — UNA BASE' },
  { file: 'og-capacity.png', eyebrow: 'CYCLE CAPACITY — THE ARITHMETIC',
    lines: ['More cycles', 'without adding', 'headcount.'],
    foot: 'WHERE THE COORDINATOR HOURS GO · RUN YOUR NUMBERS' },
  { file: 'og-capacidad.png', eyebrow: 'CAPACIDAD DE CICLOS — LA ARITMÉTICA',
    lines: ['Más ciclos', 'sin sumar', 'personal.'],
    foot: 'A DÓNDE SE VAN LAS HORAS · CALCULE SUS CIFRAS' },
  { file: 'og-lab.png', eyebrow: 'FOR YOUR LAB',
    lines: ['The embryology record', 'built like the', 'risk is real.'],
    foot: 'GRADING · PGT · CRYO TO THE STRAW · WITNESSING · RECALL' },
  { file: 'og-laboratorio.png', eyebrow: 'PARA SU LABORATORIO',
    lines: ['El registro construido', 'como si el riesgo', 'fuera real.'],
    foot: 'CLASIFICACIÓN · PGT · CRIOGENIA · TESTIGO · TRAZABILIDAD' },
  { file: 'og-features.png', eyebrow: 'TWELVE MODULES · ONE RECORD',
    lines: ['Everything Solux does,', 'on one', 'database.'],
    foot: 'EHR · LAB · CRYO · CRM · BILLING · PORTAL · AI' },
  { file: 'og-funciones.png', eyebrow: 'DOCE MÓDULOS · UN REGISTRO',
    lines: ['Todo lo que hace Solux,', 'en una', 'base de datos.'],
    foot: 'EHR · LAB · CRIOGENIA · CRM · FACTURACIÓN · PORTAL · IA' },
  { file: 'og-contact.png', eyebrow: 'BOOK A DEMO',
    lines: ['Forty-five minutes.', 'Your numbers', 'first.'],
    foot: 'A 45-MINUTE WALKTHROUGH · IN ENGLISH OR SPANISH' },
  { file: 'og-contacto.png', eyebrow: 'SOLICITAR DEMO',
    lines: ['Cuarenta y cinco minutos.', 'Sus números', 'primero.'],
    foot: 'UN RECORRIDO DE 45 MINUTOS · EN ESPAÑOL O INGLÉS' },
];

// Deterministic cycle-track strip: array of [widthFraction, colorClass]
// mostly dark, some indigo, one amber — mirrors the IVF cycle motif.
const TRACK = [
  [3,'d'],[2,'i'],[1,'d'],[2,'d'],[1,'i'],[3,'d'],[2,'d'],[1,'d'],[2,'i'],[1,'d'],
  [3,'d'],[1,'d'],[2,'d'],[3,'i'],[1,'d'],[2,'d'],[1,'a'],[2,'d'],[1,'i'],[3,'d'],
  [1,'d'],[2,'d'],[1,'i'],[2,'d'],[3,'d'],[1,'d'],[2,'i'],[1,'d'],[2,'d'],[1,'d'],
];

function trackHTML() {
  const total = TRACK.reduce((s,[w])=>s+w,0);
  return TRACK.map(([w,c])=>`<span class="seg ${c}" style="flex:${w}"></span>`).join('');
}

function pageHTML(p) {
  const headline = p.lines.map(l=>`<span>${l}</span>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body {
    background:#0A0E1F; color:#fff; position:relative; overflow:hidden;
    font-family:'Archivo',sans-serif;
  }
  /* subtle vignette / depth */
  .glow { position:absolute; inset:0;
    background:radial-gradient(1100px 520px at 78% 6%, rgba(99,102,241,.16), transparent 60%),
              radial-gradient(700px 420px at 6% 100%, rgba(63,63,168,.14), transparent 55%);
  }
  .brand { position:absolute; top:70px; left:0; right:0; display:flex; align-items:center;
    justify-content:center; gap:16px; }
  .brand svg { width:46px; height:46px; display:block; }
  .brand .wm { font-weight:700; font-size:34px; letter-spacing:-.01em; color:#fff; }
  .content { position:absolute; left:80px; right:80px; top:196px; }
  .eyebrow { font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:20px;
    letter-spacing:.12em; color:#F5A623; text-transform:uppercase;
    display:flex; align-items:center; gap:16px; margin-bottom:26px; }
  .eyebrow::before { content:""; width:34px; height:2px; background:#F5A623; display:block; }
  .headline { font-weight:800; font-size:74px; line-height:1.02; letter-spacing:-.02em;
    color:#fff; display:flex; flex-direction:column; }
  .headline span { display:block; }
  .foot { position:absolute; left:80px; right:80px; bottom:52px;
    display:flex; align-items:baseline; justify-content:space-between;
    font-family:'IBM Plex Mono',monospace; font-weight:500; font-size:18px;
    letter-spacing:.04em; color:#6B7391; }
  .foot .dom { color:#8B8DF7; letter-spacing:.08em; }
  .track { position:absolute; left:0; right:0; bottom:0; height:18px; display:flex; gap:2px;
    padding:0 0 0 0; }
  .seg { display:block; height:100%; border-radius:2px 2px 0 0; }
  .seg.d { background:#161B33; }
  .seg.i { background:#6366F1; }
  .seg.a { background:#F5A623; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="brand">${MARK_SVG}<span class="wm">Solux</span></div>
  <div class="content">
    <div class="eyebrow">${p.eyebrow}</div>
    <div class="headline">${headline}</div>
  </div>
  <div class="foot"><span>${p.foot}</span><span class="dom">SOLUXEHR.COM</span></div>
  <div class="track">${trackHTML()}</div>
</body></html>`;
}

const b = await chromium.launch({ args:['--allow-file-access-from-files'] });
const page = await b.newPage({ viewport:{ width:1200, height:630 }, deviceScaleFactor:1 });
for (const p of PAGES) {
  await page.setContent(pageHTML(p), { waitUntil:'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(250);
  await page.screenshot({ path:`${OUTDIR}/${p.file}`, clip:{ x:0, y:0, width:1200, height:630 } });
  console.log('rendered', p.file);
}
await b.close();
console.log('DONE');
