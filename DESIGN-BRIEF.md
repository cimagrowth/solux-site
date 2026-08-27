# Design brief — Solux marketing site

This reflects the current direction after the teardown rewrite. It supersedes the
original "craft, not rewriting / do not reorder" brief — the site was reordered,
rewritten, translated, and repositioned on purpose.

---

## 1. What this is

Solux is **the fertility platform built inside a working clinic** — lead capture to live
birth, with the clinic, the laboratory and the patient held in **one database**, on a
private per-clinic instance. It is the productised form of a system already running a
real fertility practice (real patients, real cycles, real embryology).

**Headline promise (v2, capacity-led):** *cycle volume is capped by coordinator hours,
not demand, and one database gives those hours back — so growth stops costing headcount.*
Headline on the page: *"Run 120 cycles a month with the team that runs 60."* The
embryology lab moved from lead differentiator to the proof that the capacity claim
survives an audit.

**Audience:** owners, medical directors (REIs), lab directors and finance leads at
fertility clinics. Latin America first (hence the full Spanish site), US insurance
markets next. Sophisticated, skeptical, expensive-software buyers who have been burned
before. They read the whole page. The page's single job: **book a 45-minute demo.**

**The core thesis the design must dramatise:** everyone in this market shipped a chatbot;
Solux built AI *into the data model* — permission-scoped, read-only, fully audited. And
the **laboratory is the moat** — most systems stop at the chart.

---

## 2. Positioning guardrails (do not drift)

- **The constraint is coordinator hours, not demand.** The capacity thesis is the spine of
  v2: clinics are capped by the clerical hours per cycle their coordinators can absorb, and
  one record gives those hours back. Do not soften this back into a generic "efficiency"
  claim.
- **Do not remove a concession to make a claim stronger.** Two are load-bearing and stay:
  the six-item "Where this doesn't apply" section on `capacity.html` / `capacidad.html`, and
  the "it is a model, not a measurement" line under the calculator. The offer name is fixed:
  *The 60-Day Cycle Capacity Install*.
- **Not "for self-pay clinics."** Self-pay is a billing capability (self-pay **and**
  insurance), not the market identity. Do not reintroduce it as positioning.
- **The laboratory is the emphasized differentiator.** Give it its own section and the
  "why the laboratory is where the risk lives" stat band.
- **No named clinic.** Do not name the live practice, its city, or any brand
  (no Pozitivf, Altura, "San Antonio Clinic", etc.).
- **No invented proof.** No fake logos, testimonials, or Solux usage metrics. Persona
  outcomes are written as scenarios, not attributed quotes. Leave room above the offer
  box for a named quote once the first clinic signs.
- **No PHI, ever.** Product views on the site use synthetic data. Real screenshots must
  be de-identified before use (see `SCREENSHOT-GUIDE.md`).
- **No pricing.** The page drives to a call.

The two brand hex values are fixed: indigo `#6366F1`, amber `#F5A623`. Everything else in
`:root` is tunable as long as it stays coherent.

---

## 3. Brand assets

The **Corona** mark is final — do not redesign it. On this site the nav/footer pair the
*mark* with "Solux" set in **Archivo** (the site's display face), not the DM Sans lockup.
`assets/brand/` holds the mark variants, favicons and apple-touch/PWA icons.
`assets/brand/og/` holds a **per-page Open Graph image set** (1200×630, one per page,
each with the page's own eyebrow + headline over the dark ground, the Corona mark, and the
cycle-track strip). Each page wires its own image via `og:image` / `twitter:image` with an
`og:image:alt`, and declares `og:locale` (`en_US` / `es_ES`) with the counterpart as
`og:locale:alternate`. `assets/brand/og-image.png` remains as a legacy default (a copy of
the home image) for any external cache still pointing at the old path. To regenerate the
set, re-run the generator that renders the template with Archivo + IBM Plex Mono.

---

## 4. Design system

- **Display:** Archivo variable, width axis ~112, semibold, tight tracking — equipment
  signage.
- **Body:** Source Serif 4 — a serif body under a grotesk display, deliberate, reads like
  a well-set journal for a doctor-facing sale.
- **Data/labels:** IBM Plex Mono — eyebrows, day numbers, stat labels, the audit ledger.
- **Structure (v2 — the SOFTEN block in `assets/styles-v2.css`).** The original 2px-radius
  / no-shadow rule no longer describes the site. Radius is now token-driven — re-harden the
  whole site by editing four values:
  - `--r-sm: 8px` — chips, slots, cycle segments, inputs
  - `--r-md: 12px` — cards, tiles, list rows
  - `--r-lg: 18px` — panels (track, audit, cryo, cohort, calculator)
  - `--r-btn: 10px` — buttons

  A soft shadow scale accompanies the radii; hover is a 2px lift plus depth. **The hairline
  grid changed shape:** a rule-coloured container with `gap: 1px` cannot survive rounded
  children, so grid containers (`.grid`, `.tiles`, `.stack`, `.steps`, `.trust`,
  `.guarantee`, `.calc`, `.riskband`, `.vs`, `.cap`) now use a real gap and each child
  carries its own 1px hairline plus a soft shadow. The `.cryo` panel keeps its original 1px
  internal seam because it reads as instrumentation.
- **Register:** clinical instrumentation. Dark ground (`#0A0E1F`) is the differentiator —
  competitors are all light/pastel femtech. Keep it dark.
- **Motion:** scroll-reveal (`.rv` → `.in`), the cycle-track draw-in, and the audit trace
  executing one pass. v2 adds one easing curve (`--ease`) driving everything; reveals run
  0.6–0.8s and children of revealed grids stagger in on a 60ms `nth-child` delay. Respect
  `prefers-reduced-motion` throughout — it flattens all of it to a static complete state.

---

## 5. Signature + designed elements (protect these)

- **The IVF cycle track** (hero) — a 34-column CSS grid rendering a real protocol,
  generated from one date. Caption: *"The AI wrote this cycle. A nurse used to."*
- **The AI audit trace** (`.audit`) — a rendered `ai_query_audit` row that executes on
  scroll: question, generated SQL, permission scope, guardrails, rows, duration, log
  line. No competitor can show this. Clinical instrument, not sci-fi terminal.
- **Command Center cohort** (`.cohort`) — sixty stimulating patients scored on five
  readiness dimensions, four flagged. Synthetic data.
- **Cryo drill-down** (`.cryo`) — tank → canister → cane → straw, one straw selected with
  a synthetic embryo record.
- **Lab-risk stat band** (`.riskband`) — the sourced industry figures (38% of paid claims
  begin in the lab, etc.) that make the lab focus land.

**v2 interactive additions** (all vanilla, dependency-free, keyboard-safe, no storage, and
collapse to a static complete state under `prefers-reduced-motion`):

- **Seam collapse** (`.collapse`, `index.html` + `es.html`) — the five systems a clinic
  buys, with "retyped here" between them, resolving into one record on scroll.
- **Hours counter** (`.hours`, `[data-count-to]`) — counts to the ~40% documentation-burden
  baseline, sourced and labelled as an external figure.
- **Capacity calculator** (`.calc`, `[data-calc]`) — three range inputs, four derived
  outputs. Model: `hoursBack = cycles × clericalHoursPerCycle × 0.55`; `headroom =
  hoursBack ÷ clericalHoursPerCycle`; `ceiling = cycles + headroom`; `revenue = headroom ×
  revenuePerCycle`. `0.55` is an estimate (the `removed` constant in `site-v2.js`), not a
  measurement — if it changes, the copy under the results changes with it in both languages.
- **Ask the database** (`.askdemo`, `[data-askdemo]`) — canned questions that type out
  generated SQL and land synthetic rows, footed with the audit line and labelled "synthetic
  instance." Spanish question set auto-selects on `<html lang="es">`.

---

## 6. Product screenshots

Real screenshots go in `assets/shots/`, framed in browser chrome (`.frame`) on the dark
ground. Light product UI inside a dark frame is the intended look. Two slots are wired
(`ai-query.png`, `go-live.png`) with an auto-fallback "awaiting capture" state. Nothing
may contain real or realistic PHI — invent patient names, never real chart numbers. See
`SCREENSHOT-GUIDE.md` for the capture list, de-identification rules, and seed patients.

---

## 7. Hard constraints

- **Static HTML, CSS, vanilla JS. No build step, no framework, no bundler.** Deploys to
  Vercel with no build command.
- **No `localStorage`/`sessionStorage`.**
- Relative asset paths (`assets/styles.css`, not `/assets/...`).
- Google Fonts only, `display=swap`.
- The contact form is a **GrowthOS iframe embed** posting to `os.cimagrowth.com`; the
  origin-checked auto-resize `postMessage` listener at the bottom of `contact.html` and
  `contacto.html` must survive untouched (origin `https://os.cimagrowth.com`, form id
  `e979fa79-9fe6-4899-8f48-cdfcadd6b2d4`).
- Bilingual: five page pairs (`index`/`es`, `capacity`/`capacidad`, `lab`/`laboratorio`,
  `features`/`funciones`, `contact`/`contacto`) kept in sync; maintain the nav toggle,
  reciprocal `hreflang` tags, and sitemap alternates. `vercel.json` rewrites the four
  `/es/*` canonical paths.
- US spelling (inquiry, fertilized, authorization, labeling, personalization).
- Quality floor: responsive to 360px, visible keyboard focus, `prefers-reduced-motion`
  respected, semantic landmarks, AA contrast.

---

## 8. Acceptance checklist

- [ ] Uses `#6366F1` and `#F5A623` as the brand; dark clinical-instrument register kept
- [ ] Cycle track, audit trace, cohort and cryo all present and PHI-free
- [ ] v2 pieces present and reduced-motion-safe: seam collapse, hours counter, capacity
      calculator, ask-the-database demo
- [ ] Positioning: capacity-led (coordinator hours, not demand), lab as proof, not
      self-pay-specific; the two load-bearing concessions are intact
- [ ] No named clinic, no invented proof, no PHI
- [ ] Bilingual parity across all five page pairs: `index`/`es`, `capacity`/`capacidad`,
      `lab`/`laboratorio`, `features`/`funciones`, `contact`/`contacto` — each with a
      working language toggle, reciprocal `hreflang`, and sitemap alternates
- [ ] Canonicals/OG point at `www.soluxehr.com`
- [ ] Still deploys with no build step; GrowthOS form intact
- [ ] Passes at 360px, keyboard-navigable, reduced-motion respected
