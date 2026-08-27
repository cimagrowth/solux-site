# Solux — marketing site

Four pages, zero build step. Static HTML/CSS/vanilla JS. The demo form is a GrowthOS
embed, so there is no serverless function and nothing to configure.

```
index.html            Home (EN) — the full offer page, new architecture
es.html               Home (ES) — full Spanish translation, /es
features.html         All twelve modules, the AI layer, implementation
contact.html          Book a demo (GrowthOS embedded form)
assets/styles.css     All styling. Brand tokens live at the top in :root
assets/site.js        Scroll reveal · audit-trace execute pass · screenshot-frame fallback
assets/shots/         Product screenshots (see SCREENSHOT-GUIDE.md) — mostly empty until captured
vercel.json           Clean URLs, cache headers, security headers
SCREENSHOT-GUIDE.md   What to capture, how to de-identify, where each file goes
```

## Positioning (do not drift)

Solux is **the fertility platform built inside a working clinic** — lead capture to live
birth, with the clinic, the laboratory and the patient in a single record. The headline
promise is *"the fertility EHR with the lab, the funnel and the ledger already inside it."*

- **Not** "for self-pay clinics." Self-pay is a billing capability (self-pay **and**
  insurance), never the market identity.
- The **laboratory is the emphasized differentiator** — most systems stop at the chart.
- **No named clinic, no invented logos/quotes/usage metrics, no PHI.** Product views on
  the site use synthetic data. The "why the laboratory is where the risk lives" figures
  are external, sourced industry stats (from the one-pager), not Solux metrics.

## Homepage architecture

Hero → trust strip → "five systems, one record" tiles → the seams → **AI** (audit trace
+ constraint chips + framed assistant shot + four surfaces + Command Center cohort) →
**For your lab** (lab-risk stat band + cryo drill-down) → roles → stack ("canceling
contracts") → proof → 60-day + go-live frame → offer → arithmetic → close.

Two signature designed views ship with **synthetic data**: the Command Center readiness
cohort (`.cohort`) and the cryo inventory drill-down (`.cryo`). The audit trace
(`.audit`) executes one pass on scroll.

## Bilingual

`index.html` (EN) and `es.html` (ES) are kept in sync. Every page has a nav language
toggle and `hreflang` alternates; `sitemap.xml` lists both with alternates.

## Product screenshots

Real, **de-identified** screenshots drop into `assets/shots/` framed in browser chrome.
Two slots are wired (`ai-query.png`, `go-live.png`); until a file exists the frame shows
an "awaiting capture" state and swaps in the image automatically once added. Full
instructions and a synthetic patient seed set are in `SCREENSHOT-GUIDE.md`.

## Brand tokens (top of `styles.css`)

```css
--ink   #0A0E1F   text and dark bands
--paper #F4F5FA   page ground
--brand #6366F1   indigo — the brand
--sol   #F5A623   amber — CTAs and the trigger/retrieval markers only
```

The cycle track in the hero is a 34-column CSS grid; each phase is a `.seg` with
`grid-column: start / span n`. Change the spans and the day numbers together.

## Deploy

Static site on Vercel: framework preset **Other**, no build command, output directory `.`.
`vercel.json` handles clean URLs (`/features`, `/es`), cache and security headers.
No environment variables — the GrowthOS form posts straight to the CRM.

## Local preview

```bash
npx serve .
```
