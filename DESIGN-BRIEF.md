# Design brief — Solux marketing site

Attached: `index.html`, `features.html`, `contact.html`, `assets/styles.css`, `assets/site.js`, `api/contact.js`, `vercel.json`.

Take this from "good" to "the best-looking product site in fertility tech." The content and positioning are settled and validated — **your job is craft, not rewriting.** Treat the copy as fixed unless a line is actively hurting the design.

---

## 1. What this is

Solux is a fertility clinic operating system — patient funnel, clinical chart, embryology lab and billing ledger held in **one database**, on a private per-clinic instance. It is the productised version of a system already running a live fertility clinic.

**Audience:** owners, medical directors (REIs), lab directors and finance leads at self-pay fertility clinics. Latin America first, US insurance markets next. These are sophisticated, skeptical, expensive-software-buying people who have all been burned by a previous system. Average deal is a five-figure-plus annual commitment plus an implementation. **They will read the whole page.** This is not a consumer landing page and it should not be designed like one.

**The page's single job:** book a 45-minute demo. Every design decision serves that.

**The core thesis, which the design must dramatise:** everyone in this market shipped a chatbot; Solux built AI *into the data model* — permission-scoped, read-only, fully audited. That difference is invisible in a feature list, so the design has to make it *feel* structural and rigorous.

---

## 2. Brand truth (do not invent alternatives)

These come from the live product's `clinic_branding` record and are not negotiable:

| Token | Value | Role |
|---|---|---|
| Primary | `#6366F1` | Indigo. The brand. |
| Accent | `#F5A623` | Amber. CTAs and the trigger/retrieval markers only. |

Everything else in `:root` at the top of `styles.css` (ink, paper, rules, washes) is mine and **is open for you to retune** as long as it stays coherent with those two.

**The logo exists and is final. Do not redesign it.** It's called **Corona** and ships in `assets/brand/`:

- `solux-mark.svg` — the mark, indigo→gold gradient (primary use)
- `solux-mark-mono-indigo.svg`, `solux-mark-white.svg` — single-colour versions
- `solux-lockup.svg` / `-dark` / `-mono-indigo` / `-white` — mark plus a **DM Sans** wordmark, for use *outside* this site (the app, decks, documents)
- `icon-16/32/180/192/512.png` — favicon, Apple touch, PWA
- `og-image.png` — 1200×630, already wired into all three pages

It's real vector geometry: a variable-weight ring where the stroke thickens where light falls and thins into shadow, running deep indigo → indigo → warm gold, with a small core. *Sol* + *lux* — light rimming a sphere. It reads as a cell and as a sunrise, and it holds at 20px.

**One deliberate decision to preserve:** on this site the nav and footer use the *mark* paired with "Solux" set in **Archivo**, the site's own display face — not the DM Sans lockup. The lockup's wordmark clashes with the site typography. Keep the mark + Archivo pairing here; the DM Sans lockup remains correct everywhere else.

The OG image is functional but plain — it's the one brand asset genuinely open to you to improve.

---

## 3. The two signature elements — protect and elevate these

These are the reason the site isn't generic. Do not delete them. Make them better.

**A. The IVF cycle track** (hero, `index.html`). A 34-column CSS grid rendering a real IVF protocol: birth control → stim + monitoring → trigger → retrieval → culture → transfer, with day numbers. The caption is the sales point: *"The AI wrote this cycle. A nurse used to."*

Ideas worth exploring: a page-load draw-in that reads as the calendar being *generated* rather than merely fading in; monitoring-visit pins inside the stim segment; a hover state per phase; a "today" marker. Currently it collapses to colour bars plus a legend under 700px — that's functional but it's the weakest thing on mobile and deserves a proper small-screen design (a vertical timeline is one option).

**B. The AI audit trace** (mid-page, `index.html`, `.audit`). A rendered `ai_query_audit` row: who asked, the plain-language question, the generated SQL, the permission scope, the guardrails, rows returned, duration, where it was logged. This is the single most persuasive object on the site because no competitor can show it.

It currently looks like a static terminal panel. It would be stronger as something that *executes* — question types in, query resolves, row count and duration land, log line writes. Restrained, one pass, no looping. It must respect `prefers-reduced-motion` and it must not look like a fake hacker terminal; the register is **clinical instrumentation and audit ledger**, not sci-fi.

---

## 4. Current design system

- **Display:** Archivo variable, using the width axis (`font-variation-settings: "wdth"`) — headlines sit at ~112 width, semibold, tight tracking. Reads like equipment signage.
- **Body:** Source Serif 4. A serif body under a grotesk display, deliberately inverting the usual pairing — the prose should read like a well-set journal because this is a doctor-facing sale.
- **Data/labels:** IBM Plex Mono for eyebrows, day numbers, stat labels, the audit ledger.
- **Structure:** hairline `1px` grids built by giving the container a rule-coloured background and letting `gap: 1px` show through. Near-zero border radius (`2px` max). No drop shadows anywhere.
- **Motion:** scroll-reveal (`.rv` → `.in` via IntersectionObserver in `site.js`) plus the track's staggered draw-in. That's all.

You may change any of this — including the typefaces — if you can justify something better. If you keep the type pairing, push the type scale and the vertical rhythm harder; that's where the most craft is still on the table.

---

## 5. Priorities, in order

1. **Make the AI section the visual centrepiece.** It's currently the strongest *writing* and only the second-strongest *design*. The thesis band, the versus panel and the audit trace should be the part someone screenshots.
2. **Show the product.** There are zero product visuals on the site. The most valuable additions would be a Command Center cohort view (a director seeing 60 stimulating patients scored on readiness, not 60 charts) and a cryo-inventory drill-down to tank / canister / cane / straw. These can be designed UI, not screenshots. Nothing may contain real or realistic PHI — invent patient names and never use anything resembling a real chart number.
3. **Typographic craft.** Section rhythm, scale contrast, optical alignment, the balance of the display face against the serif body.
4. **Mobile.** Currently correct but plain. The hero, the track and the audit trace all deserve considered small-screen designs, not just reflowed desktop.
5. **A better OG image.** The current one is functional and plain.
6. **The nine-surface capability grid** (`.cap`) is nine equal cards — honest but flat. It could carry more hierarchy or a better structural device.

---

## 6. Hard constraints

- **Static HTML, CSS and vanilla JS. No build step, no framework, no bundler.** This deploys to Vercel with no build command. If you need a third file of CSS that's fine; do not introduce React, Tailwind, or anything requiring `npm run build`.
- **No `localStorage` or `sessionStorage`.**
- Google Fonts are fine; keep the total request weight sane and keep `display=swap`.
- Relative asset paths (`assets/styles.css`, not `/assets/styles.css`).
- `api/contact.js` is a working Vercel serverless function that posts to Resend. **Don't break the form contract** — the `<form id="demo-form">` field names (`name`, `role`, `clinic`, `email`, `phone`, `cycles`, `country`, `systems`, `message`, plus the `company` honeypot) must survive, and so must the `#form-status` element.
- Quality floor, non-negotiable: responsive to 360px, visible keyboard focus, `prefers-reduced-motion` respected throughout, real semantic landmarks, AA contrast.

---

## 7. Do not change

- **The copy**, except for genuine improvements you can defend. It's built on a validated Hormozi offer structure and the section order is deliberate: dream outcome → AI thesis → proof of the thesis → the problem → role outcomes → the stack → time-to-value → risk reversal → the named offer → the arithmetic → close.
- **The offer name:** "The 60-Day Cycle Capacity Install."
- **No pricing anywhere.** The page drives to a call. That's intentional.
- **No testimonials, customer logos, or usage statistics.** There are none yet and inventing them is off the table. Leave room above the offer box where a named quote will go once the first clinic signs.
- The two brand hex values in §2.

---

## 8. Aesthetic guardrails

Do **not** drift toward any of these, all of which are what an AI designer produces by default:

- Cream background + high-contrast serif display + terracotta accent
- Near-black background + one acid-green or vermilion accent
- Generic B2B SaaS: purple-to-blue gradient hero, floating glassmorphic cards, soft shadows, 16px radii, an abstract 3D blob
- Broadsheet pastiche: hairline rules, zero radius, dense newspaper columns

The register to hit is **clinical instrumentation**: precise, dense where density is earned, generous where it isn't, and confident enough to leave things quiet. Spend the boldness on the two signature elements and keep everything around them disciplined.

---

## 9. Acceptance checklist

- [ ] Uses `#6366F1` and `#F5A623` as the brand
- [ ] Cycle track and audit trace both present and materially better than the versions supplied
- [ ] At least one designed product view added (Command Center strongly preferred)
- [ ] Still deploys with no build step; form field names intact
- [ ] Passes at 360px, keyboard-navigable, reduced-motion respected
- [ ] Nothing on the page looks like the four defaults in §8
