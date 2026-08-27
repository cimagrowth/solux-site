# Solux — marketing site

Ten pages — five bilingual pairs — zero build step. Static HTML/CSS/vanilla JS. The demo form is a
GrowthOS embed, so there is no serverless function and nothing to configure.

```
index.html            Home (EN) — capacity-led offer page
es.html               Home (ES) — full Spanish translation, /es
capacity.html         The capacity case + the cycle-capacity calculator
capacidad.html        Spanish capacity case
lab.html              For your lab — embryology, cryo, chain of custody
laboratorio.html      Spanish lab page
features.html         All twelve modules, the AI layer, implementation
funciones.html        Spanish features page
contact.html          Book a demo (GrowthOS embedded form)
contacto.html         Spanish demo request (same GrowthOS form)
assets/styles.css     Base styling. Brand tokens live at the top in :root
assets/styles-v2.css  v2 additions — link AFTER styles.css
assets/site.js        Scroll reveal · audit-trace execute pass · screenshot fallback
assets/site-v2.js     Seam collapse · hours counter · calculator · ask-the-database
assets/shots/         Product screenshots (see SCREENSHOT-GUIDE.md)
vercel.json           Clean URLs, cache headers, security headers
HANDOFF.md            What changed in v2, the calculator model, open items
BUILD-PROMPT.md       The prompt to hand Claude Code with this folder
SCREENSHOT-GUIDE.md   What to capture, how to de-identify, where each file goes
```

## Positioning (do not drift)

Solux is **the fertility platform built inside a working clinic** — lead capture
to live birth, with the clinic, the laboratory and the patient in a single
record. The v2 headline promise is the gap, not the category:
**run 120 cycles a month with the team that runs 60.**

- The **constraint is coordinator hours, not demand.** Growth normally costs
  headcount; one database returns the clerical hours that cap volume.
- The **laboratory is the proof**, not the lead — it is what makes the capacity
  claim survive an audit. It keeps its own page (`lab.html`).
- **Not** "for self-pay clinics." Self-pay is a billing capability (self-pay
  **and** insurance), never the market identity.
- **No named clinic, no invented logos/quotes/usage metrics, no PHI.** Product
  views use synthetic data. Documentation-burden and lab-risk figures are
  external, attributed inline, and labelled as not-ours.
- **No pricing.** Every CTA drives to the 45-minute call.

## Homepage architecture

Split hero (claim + cycle track, both above the fold) → trust strip → the seams
+ **five-systems collapse** → the hours (documentation-burden counter) →
**capacity calculator** → five systems / one record tiles → **AI** (audit trace,
constraint chips, **ask-the-database demo**, four surfaces, Command Center
cohort) → lab as proof (cryo drill-down) → roles → stack ("canceling contracts")
→ proof → 60-day + comparison → offer → arithmetic → close.

## Brand tokens (top of `styles.css`)

```css
--ink   #0A0E1F   text and dark bands
--paper #F4F5FA   page ground
--brand #6366F1   indigo — the brand
--sol   #F5A623   amber — CTAs and the trigger/retrieval markers only
```

The cycle track in the hero is a 34-column CSS grid; each phase is a `.seg` with
`grid-column: start / span n`. Change the spans and the day numbers together.

## The capacity calculator

`[data-calc]` in `site-v2.js`. Three inputs (cycles/month, clerical hours per
cycle, revenue per cycle), four derived outputs. The removal share — `0.55` —
is an estimate from the seven tasks on `capacity.html`, printed under the
results in both languages. Change the constant and the copy together.

## Bilingual

`index.html` (EN) and `es.html` (ES) are kept in sync. Every page has a nav
language toggle and `hreflang` alternates; `sitemap.xml` lists every page with
alternates. All five pairs are complete: index/es, capacity/capacidad,
lab/laboratorio, features/funciones, contact/contacto. `vercel.json` rewrites
`/es/capacidad`, `/es/laboratorio`, `/es/funciones` and `/es/contacto`.

## Product screenshots

Real, **de-identified** screenshots drop into `assets/shots/` framed in browser
chrome. Two slots are wired (`ai-query.png`, `go-live.png`); until a file exists
the frame shows an "awaiting capture" state and swaps in the image automatically
once added.

## Deploy

Static site on Vercel: framework preset **Other**, no build command, output
directory `.`. `vercel.json` handles clean URLs (`/features`, `/es`), cache and
security headers, and rewrites the four `/es/*` paths the Spanish canonicals
assume. `cleanUrls` handles the English pages. No environment variables — the GrowthOS form posts straight to the CRM.

## Local preview

```bash
npx serve .
```
