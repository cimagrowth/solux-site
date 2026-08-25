# Solux — marketing site

Three pages, zero build step. Static HTML/CSS/JS plus one Vercel serverless function for the demo form.

```
index.html          Home — the full Hormozi offer page
features.html       All twelve modules, integrations, implementation
contact.html        Book a demo (qualifying form)
assets/styles.css   All styling. Brand tokens live at the top in :root
assets/site.js      Scroll reveal + form submit
vercel.json         Clean URLs, cache headers, security headers
```

## Deploy

```bash
cd solux-site
git init && git add -A && git commit -m "Solux site"
gh repo create cimagrowth/solux-site --private --source=. --push
```

Then in Vercel: **Add New → Project → import `cimagrowth/solux-site`**. Framework preset **Other**, no build command, output directory `.`. Deploy.

## Environment variables (Vercel → Settings → Environment Variables)

**None.** The demo form is a GrowthOS embed on `contact.html`, so leads land straight in the CRM. There is no serverless function and no mail provider to configure.

## Before you point a domain at it

1. **Domain.** Every canonical URL, the OG tags and `sitemap.xml` currently say `solux.health`. Find-and-replace if the domain is different.
2. **`LEAD_FROM` must be verified in Resend** or every submission 502s.
3. **OG image.** Add `/og/og-home.png` (1200×630) and uncomment nothing — just add `<meta property="og:image" content="https://…/og/og-home.png">` to each page head. Without it, link previews are bare.
4. **Analytics.** No GTM on here yet. Add the Cima GTM container if you want the same attribution.

## Editing copy

Everything is plain HTML — no components, no framework. The brand palette is six hex values at the top of `styles.css`:

```css
--ink   #0C1A21   text and dark bands
--paper #F3F6F5   page ground
--teal  #1B4D5C   clinic teal, shared with Cima
--sol   #E0A038   the "sol" in Solux — CTAs and the trigger marker only
```

The cycle track in the hero is a 34-column CSS grid; each phase is a `.seg` with a `grid-column: start / span n`. Change the spans and the day numbers together if you ever want a different protocol on the page.

## Local preview

```bash
npx serve .
```

Everything runs under `serve` — there is no serverless function.
