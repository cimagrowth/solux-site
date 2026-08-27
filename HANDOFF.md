# Solux site — v2 handoff

Everything in this folder is production HTML/CSS/JS for `cimagrowth/solux-site`.
No build step, no framework, no bundler — same deploy as today (Vercel, preset
Other, no build command, output `.`).

## What changed and why

The old site led with a category claim ("the fertility EHR with the lab, the
funnel and the ledger inside it"). Correct, but it named no gap. v2 leads with
the gap and the offer that closes it: **cycle volume is capped by coordinator
hours, and one database gives those hours back** — so growth stops costing
headcount. The lab stays, moved from "the moat" to "the proof that the capacity
claim survives an audit."

Design changes are structural, not cosmetic: the header lost its whitespace, the
page gained three interactive proof pieces, and the copy is rewritten around the
capacity thesis. Tokens, type and the hairline register are untouched.

## File map

| File | Status | Notes |
|---|---|---|
| `index.html` | rewritten | Capacity-led home. New: split hero, seam-collapse diagram, hours counter, capacity calculator, ask-the-database demo. |
| `capacity.html` | **new** | The full capacity case: where the hours go, the calculator, hiring vs. removing handoffs, and the honest limits. |
| `lab.html` | **new** | Lab-director page: risk band, cryo drill-down, chain of custody, holding at double volume. |
| `funciones.html` | **new** | Spanish `features.html`, in full — all twelve modules, the AI layer, integrations, implementation. |
| `contacto.html` | **new** | Spanish `contact.html`. Same GrowthOS form id and the same origin-checked resize listener. |
| `features.html` | edited | Nav + sub-nav, capacity framing on the calendar module, footer links, v2 assets. |
| `contact.html` | edited | Nav + sub-nav, ninth discovery question (coordinators / cost of the next twenty cycles), capacity link in step 03. GrowthOS iframe and its `postMessage` listener untouched. |
| `es.html` | rewritten | Full Spanish mirror of the new home. Section anchors are Spanish (`#capacidad`, `#laboratorio`, `#ia`, `#oferta`). Nav and footer link to the Spanish sub-pages. |
| `capacidad.html` | **new** | Spanish `capacity.html`, in full — including the six honest limits and the model note. |
| `laboratorio.html` | **new** | Spanish `lab.html`, in full. |
| `assets/styles.css` | unchanged | Byte-identical to `main`. Do not edit. |
| `assets/styles-v2.css` | **new** | All v2 CSS, including the SOFTEN block. Link after `styles.css`, or paste at the end of it and drop the extra `<link>`. |
| `assets/site.js` | unchanged | Byte-identical to `main`. |
| `assets/site-v2.js` | **new** | Seam-collapse reveal, hours counter, calculator, ask-demo. Loads after `site.js`. |
| `sitemap.xml` | edited | Adds `/capacity` and `/lab`. |
| `vercel.json`, `robots.txt`, `package.json` | unchanged | |
| `assets/brand/*` | unchanged | |

`assets/shots/` is not in this export. The two wired screenshot slots
(`ai-query.png`, `go-live.png`) still fall back to the "awaiting capture" state,
exactly as on `main`.

## The four new interactive pieces

All four are vanilla, dependency-free, keyboard-safe, no storage, and collapse to
a static complete state under `prefers-reduced-motion`.

1. **Seam collapse** (`.collapse`, `index.html` + `es.html`) — the five systems a
   clinic buys, with "retyped here" between them, resolving into one record.
   Reveals once on scroll via IntersectionObserver.
2. **Hours counter** (`.hours`, `[data-count-to]`) — counts to 40%, the
   documentation-burden baseline. Sourced and labelled as an external figure.
3. **Capacity calculator** (`.calc`, `[data-calc]`) — three range inputs, four
   derived outputs. The model is printed under the results.
4. **Ask the database** (`.askdemo`, `[data-askdemo]`) — four canned questions;
   each types out generated SQL and lands synthetic rows, footed with the audit
   line. Spanish question set auto-selects on `<html lang="es">`.

### The calculator model — read this before you ship it

```
hoursBack = cycles × clericalHoursPerCycle × 0.55
headroom  = hoursBack ÷ clericalHoursPerCycle      (cycles/month)
ceiling   = cycles + headroom
revenue   = headroom × revenuePerCycle
```

`0.55` (the share of per-cycle clerical work one record removes) lives in
`site-v2.js` as `removed`. It is our estimate from the seven tasks listed on
`capacity.html`, not a measured result, and the page says so in both languages.
If sales wants a different number, change it in one place — but change the copy
under the results too.

Defaults are 60 cycles, 6.0 clerical hours/cycle, $18,000/cycle.

## Positioning guardrails, still in force

Unchanged from `DESIGN-BRIEF.md`, and the new pages honour them:

- No named clinic, no invented testimonial, no logo wall, no Solux usage metric.
- No PHI. Every patient name in the new demo rows is invented; the ask-demo
  panel is labelled "synthetic instance."
- No pricing. Every CTA drives to the 45-minute call.
- External statistics are attributed inline and marked as external, not ours.
- Self-pay stays a billing capability, never the market identity.

Two concessions were added deliberately and should not be edited out: the
"Where this doesn't apply" section on `capacity.html` (six named limits) and the
"it is a model, not a measurement" line under the calculator.

## The softened visual layer

The bottom block of `styles-v2.css` (`SOFTEN`) is a deliberate departure from
`DESIGN-BRIEF.md` §4, which specifies a 2px maximum radius and no shadows. It
is token-driven, so the whole site re-hardens by editing four values:

```css
--r-sm: 8px;   /* chips, slots, cycle segments, inputs */
--r-md: 12px;  /* cards, tiles, list rows */
--r-lg: 18px;  /* panels: track, audit, cryo, cohort, calculator */
--r-btn: 10px; /* buttons */
```

Two consequences worth knowing before you edit anything:

1. **The hairline grid changed shape.** The original device — a container
   painted rule-colour with `gap: 1px` showing through — cannot survive rounded
   children. Grid containers (`.grid`, `.tiles`, `.stack`, `.steps`, `.trust`,
   `.guarantee`, `.calc`, `.riskband`, `.vs`, `.cap`) now use a real gap and each
   child carries its own 1px hairline plus a soft shadow. The `.cryo` panel keeps
   the original 1px internal seam, because it reads as instrumentation.
2. **Motion is smoother and staggered.** One easing curve (`--ease`) drives
   everything; reveals run 0.6–0.8s, and children of revealed grids come in on a
   60ms stagger via `nth-child` delays (up to 12 children — add more rules if a
   grid grows). Hover is a 2px lift plus depth. `prefers-reduced-motion` still
   flattens all of it to a static complete state.

`DESIGN-BRIEF.md` §4 and the acceptance checklist should be updated to match, or
this block will read as drift to the next person who opens the repo.

## Open items for you

1. **Clean URLs.** `vercel.json` already rewrites `/features` and `/es`; add
   `/capacity`, `/lab`, `/es/capacidad` and `/es/laboratorio` the same way. The
   Spanish canonicals in the new pages already assume `/es/capacidad` and
   `/es/laboratorio`, so those rewrites are needed for the canonicals to be true.
2. **Bilingual parity is complete** — five pairs, ten pages. `vercel.json` now
   carries the four `/es/*` rewrites the Spanish canonicals assume.
3. **`BUILD-PROMPT.md`** is the prompt to hand Claude Code along with this folder.
3. **Screenshots.** Dropping `assets/shots/ai-query.png` and `go-live.png` in
   place needs no code change.
4. **Nav crowding.** Capacity and For-your-lab hide below 980px via `.hide-md`.
   If you want them in a mobile menu, that markup does not exist yet.
