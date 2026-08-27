# Product screenshot guide

The marketing site has slots for **real, de-identified** product screenshots, framed
in browser chrome on the dark background. This file tells you exactly what to capture,
how to strip PHI, and where to put each file.

## The hard rule: no real patient data, ever

The live instance holds real PHI (116 patients with real names, phone numbers, ages,
BMI, AMH). **None of that may appear on the public site.** Before any capture that
includes a patient:

- Replace names with synthetic ones (see the seed set below).
- Remove or overwrite chart numbers — anything like `SLX-00031`. The site must never
  show a real or real-looking chart number.
- Remove phone numbers and emails.
- Ages / BMI / AMH: fine to show *as values* only if the row is otherwise synthetic;
  otherwise blur.

Easiest path: seed ~6 fake patients (below), then capture only screens filtered to them.

## How the slots work

Each slot is a `<figure class="frame">` with an `<img src="assets/shots/NAME.png">`.
Until the file exists, the frame shows a styled "awaiting capture" state. Drop a PNG
(or WebP — then change the `src` extension) at the path and it appears automatically.
No code change needed for the two wired slots.

Capture at ~2560px wide where you can; the frame scales it down. The product UI is
light — that's expected, the dark frame is the container.

---

## Wired slots (live on the site now)

### 1. `assets/shots/ai-query.png` — AI section, both EN + ES homepages
- **Screen:** Dashboard → **AI Tools** tab → "Ask AI About Patient Data".
- **PHI:** none, if you ask an **aggregate** question. Type e.g.
  *"How many patients are in the monitoring phase?"* and capture the question + the
  count answer. Do **not** capture a question that returns a list of names.
- **Crop:** the query box + the answer card.

### 2. `assets/shots/go-live.png` — "Time to value" section, both EN + ES homepages
- **Screen:** the go-live / onboarding **readiness checklist** (the 37–40 item list
  with blocker / important / optional states). If this lives in an admin/onboarding
  area, capture it there.
- **PHI:** none — it's configuration items, not patients.
- **Note:** confirm the item count. The site currently says **40**; your one-pager
  says **37**. Tell me which is right and I'll align the copy.

---

## Optional slots (swap in if you want real shots instead of the designed views)

The homepage currently ships **designed, synthetic-data** views for the Command Center
cohort and the cryo drill-down (dark, on-brand, zero PHI). You can keep those, or
replace them with framed real captures below. The five "what it is" tiles also carry
small screenshot labels you can upgrade to frames — say the word and I'll wire them.

| Suggested file | Screen | De-ID needed |
|---|---|---|
| `command-center.png` | Overview → Pre-Appointment Readiness (the scored list) | **Yes** — names + `SLX-#####` |
| `cycle-calendar.png` | A patient's generated IVF cycle calendar, Day 1→34 | **Yes** — name/header |
| `embryo-record.png` | Per-embryo record: grading, PGT, viability | **Yes** — any linked patient id |
| `cryo.png` | Cryo inventory drill-down: tank → canister → cane → straw | Light — remove patient links |
| `ar-aging.png` | Billing → AR aging / ledger | **Yes** — names |
| `chart.png` | A patient chart with trended labs + timeline | **Yes** — full de-ID |
| `kpi.png` | Overview → the KPI cards (Total Patients / In Treatment / Qualified) | **None** — aggregates only |

`kpi.png` is the other zero-effort, PHI-free capture worth grabbing.

---

## Synthetic patient seed set

Create these in a scratch/test view (or a staging instance) so patient-bearing screens
can be captured cleanly. All fake, all US-format, no relation to real patients.

| Name | Age | BMI | AMH | Stage | Language |
|---|---|---|---|---|---|
| Maria Rivera | 34 | 23.1 | 1.9 | Stimulating | EN |
| Ana Okafor | 38 | 24.6 | 0.8 | Stimulating | EN |
| Lucia Santos | 31 | 21.4 | 2.6 | Stimulating | ES |
| Rosa Delgado | 40 | 22.0 | 1.1 | Monitoring | ES |
| Emi Nakamura | 29 | 20.1 | 3.0 | Stimulating | EN |
| Sara Haddad | 36 | 25.2 | 1.4 | Qualified | EN |

Use invented chart numbers only (e.g. `DEMO-001`), never the real `SLX-` series.

---

## Handing shots to me

Either drop the finished PNG/WebP files into `assets/shots/` at the names above, or
attach them in chat and I'll place, crop-check, and wire them (including upgrading the
tile labels to frames if you want the full set).
