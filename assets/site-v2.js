// Solux site — v2 interaction layer.
// Load AFTER assets/site.js. Vanilla, no dependencies, no storage.
// Modules: seam-collapse reveal · hours counter · capacity calculator ·
//          ask-the-database demo.
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onceInView(el, fn, threshold) {
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); fn(); }
      });
    }, { threshold: threshold || 0.25 });
    io.observe(el);
  }

  /* ---------- 1. seam collapse: five systems → one record ---------- */

  document.querySelectorAll(".collapse").forEach(function (el) {
    if (reduced) { el.classList.add("in"); return; }
    onceInView(el, function () { el.classList.add("in"); }, 0.2);
  });

  /* ---------- 2. coordinator-hours counter ---------- */

  document.querySelectorAll("[data-count-to]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var suffix = el.getAttribute("data-count-suffix") || "";
    if (isNaN(target)) return;
    if (reduced) { el.firstChild && (el.textContent = target + suffix); return; }

    var label = el.querySelector("small");
    function render(v) {
      el.textContent = Math.round(v) + suffix;
      if (label) el.appendChild(label);
    }
    render(0);
    onceInView(el, function () {
      var t0 = null, dur = 1400;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        render(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, 0.4);
  });

  /* ---------- 3. cycle-capacity calculator ---------- */
  // Model, stated on the page: clerical minutes per cycle that Solux removes
  // (retyping between systems, building calendars by hand, chasing consents
  // and clearance) × cycles = hours returned. Hours returned ÷ clerical hours
  // per cycle = headroom in cycles on the same payroll.

  document.querySelectorAll("[data-calc]").forEach(function (root) {
    var out = {
      hours: root.querySelector("[data-out=hours]"),
      headroom: root.querySelector("[data-out=headroom]"),
      ceiling: root.querySelector("[data-out=ceiling]"),
      revenue: root.querySelector("[data-out=revenue]")
    };
    var inputs = [].slice.call(root.querySelectorAll("input[type=range]"));

    function money(n) {
      if (n >= 1000000) return "$" + (n / 1000000).toFixed(n < 10000000 ? 2 : 1) + "M";
      if (n >= 1000) return "$" + Math.round(n / 1000) + "k";
      return "$" + Math.round(n);
    }

    function read(name) {
      var el = root.querySelector("input[name=" + name + "]");
      return el ? parseFloat(el.value) : 0;
    }

    function paint() {
      var cycles = read("cycles");
      var clerical = read("clerical");      // clerical hours per cycle today
      var price = read("price");            // revenue per cycle
      var removed = 0.55;                   // share of clerical work one record removes

      var hoursBack = cycles * clerical * removed;
      var headroom = clerical > 0 ? hoursBack / clerical : 0;
      var ceiling = cycles + headroom;

      inputs.forEach(function (i) {
        var v = root.querySelector("[data-val=" + i.name + "]");
        if (!v) return;
        v.textContent = i.name === "price" ? money(parseFloat(i.value))
          : i.name === "clerical" ? parseFloat(i.value).toFixed(1) + " h"
          : i.value;
      });

      if (out.hours) out.hours.firstChild ? setNum(out.hours, Math.round(hoursBack)) : (out.hours.textContent = Math.round(hoursBack));
      if (out.headroom) setNum(out.headroom, "+" + Math.round(headroom));
      if (out.ceiling) setNum(out.ceiling, Math.round(ceiling));
      if (out.revenue) setNum(out.revenue, money(headroom * price));
    }

    function setNum(el, value) {
      var small = el.querySelector("small");
      el.textContent = value;
      if (small) el.appendChild(small);
    }

    inputs.forEach(function (i) { i.addEventListener("input", paint); });
    paint();
  });

  /* ---------- 4. ask-the-database demo ---------- */
  // Synthetic rows. No real or realistic patient data.

  var QUERIES = [
    {
      q: "Which stimulating patients have AMH below 1.0 and no consent on file?",
      sql: "<em>SELECT</em> display_name, amh, consent_status <em>FROM</em> patients <em>JOIN</em> cycles <em>USING</em> (patient_id) <em>WHERE</em> cycle_status = 'stimulating' <em>AND</em> amh &lt; 1.0 <em>AND</em> consent_status &lt;&gt; 'complete'",
      head: ["Patient", "AMH", "Flag"],
      rows: [
        ["Okafor, A.", "0.84", "Consent missing"],
        ["Haddad, S.", "0.71", "Consent missing"],
        ["Delgado, R.", "0.93", "Consent expired"]
      ],
      meta: "3 rows · 210 ms · scoped to medical director"
    },
    {
      q: "Which leads went quiet more than seven days ago?",
      sql: "<em>SELECT</em> display_name, stage, last_contact_at <em>FROM</em> funnel_leads <em>WHERE</em> stage <em>NOT IN</em> ('cycle_started','closed') <em>AND</em> last_contact_at &lt; now() - <em>interval</em> '7 days'",
      head: ["Lead", "Stage", "Quiet for"],
      rows: [
        ["Márquez, C.", "Financial clearance", "11 days"],
        ["Bennett, J.", "Consult booked", "9 days"],
        ["Adeyemi, T.", "Records requested", "8 days"]
      ],
      meta: "3 rows · 168 ms · scoped to clinic owner"
    },
    {
      q: "Where is every euploid straw for this patient?",
      sql: "<em>SELECT</em> embryo_id, pgt_result, tank, canister, cane, position <em>FROM</em> cryo_inventory <em>WHERE</em> patient_id = $1 <em>AND</em> pgt_result = 'euploid' <em>ORDER BY</em> tank, canister",
      head: ["Embryo", "PGT", "Location"],
      rows: [
        ["E-4417", "Euploid 46,XX", "T3 · B · 04 · 7"],
        ["E-4419", "Euploid 46,XY", "T3 · B · 04 · 10"],
        ["E-4425", "Euploid 46,XX", "T3 · C · 01 · 2"]
      ],
      meta: "3 rows · 96 ms · scoped to lab director"
    },
    {
      q: "What's in AR past ninety days, by payer?",
      sql: "<em>SELECT</em> payer, <em>sum</em>(balance) <em>AS</em> owed, <em>count</em>(*) <em>AS</em> invoices <em>FROM</em> ar_aging <em>WHERE</em> days_outstanding &gt; 90 <em>GROUP BY</em> payer <em>ORDER BY</em> owed <em>DESC</em>",
      head: ["Payer", "Invoices", "Owed"],
      rows: [
        ["Self-pay", "14", "$182,400"],
        ["Payer A", "6", "$74,900"],
        ["Payer B", "3", "$21,150"]
      ],
      meta: "3 rows · 142 ms · scoped to finance"
    }
  ];

  var QUERIES_ES = [
    {
      q: "¿Qué pacientes en estimulación tienen AMH menor a 1.0 y sin consentimiento?",
      sql: QUERIES[0].sql,
      head: ["Paciente", "AMH", "Marca"],
      rows: [
        ["Okafor, A.", "0.84", "Falta consentimiento"],
        ["Haddad, S.", "0.71", "Falta consentimiento"],
        ["Delgado, R.", "0.93", "Consentimiento vencido"]
      ],
      meta: "3 filas · 210 ms · alcance: directora médica"
    },
    {
      q: "¿Qué prospectos dejaron de responder hace más de siete días?",
      sql: QUERIES[1].sql,
      head: ["Prospecto", "Etapa", "Sin contacto"],
      rows: [
        ["Márquez, C.", "Autorización financiera", "11 días"],
        ["Bennett, J.", "Consulta agendada", "9 días"],
        ["Adeyemi, T.", "Expedientes solicitados", "8 días"]
      ],
      meta: "3 filas · 168 ms · alcance: dueño de la clínica"
    },
    {
      q: "¿Dónde está cada pajilla euploide de esta paciente?",
      sql: QUERIES[2].sql,
      head: ["Embrión", "PGT", "Ubicación"],
      rows: [
        ["E-4417", "Euploide 46,XX", "T3 · B · 04 · 7"],
        ["E-4419", "Euploide 46,XY", "T3 · B · 04 · 10"],
        ["E-4425", "Euploide 46,XX", "T3 · C · 01 · 2"]
      ],
      meta: "3 filas · 96 ms · alcance: dirección de laboratorio"
    },
    {
      q: "¿Qué hay en cartera a más de noventa días, por pagador?",
      sql: QUERIES[3].sql,
      head: ["Pagador", "Facturas", "Saldo"],
      rows: [
        ["Pago directo", "14", "$182,400"],
        ["Aseguradora A", "6", "$74,900"],
        ["Aseguradora B", "3", "$21,150"]
      ],
      meta: "3 filas · 142 ms · alcance: finanzas"
    }
  ];

  var SET = (document.documentElement.lang || "en").indexOf("es") === 0 ? QUERIES_ES : QUERIES;

  document.querySelectorAll("[data-askdemo]").forEach(function (root) {
    var qWrap = root.querySelector(".askdemo__qs");
    var sqlEl = root.querySelector(".askdemo__sql");
    var rowsEl = root.querySelector(".askdemo__rows");
    var metaEl = root.querySelector("[data-ask-meta]");
    var stateEl = root.querySelector("[data-ask-state]");
    var timer = null;

    SET.forEach(function (item, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "askdemo__q";
      b.textContent = item.q;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        qWrap.querySelectorAll(".askdemo__q").forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        run(item);
      });
      qWrap.appendChild(b);
    });

    function paintRows(item) {
      rowsEl.innerHTML = "";
      var head = document.createElement("div");
      head.className = "askdemo__row is-head";
      item.head.forEach(function (h) {
        var s = document.createElement("span");
        s.textContent = h;
        head.appendChild(s);
      });
      rowsEl.appendChild(head);
      item.rows.forEach(function (r, i) {
        var row = document.createElement("div");
        row.className = "askdemo__row";
        r.forEach(function (c) {
          var s = document.createElement("span");
          s.textContent = c;
          row.appendChild(s);
        });
        row.style.opacity = reduced ? "1" : "0";
        rowsEl.appendChild(row);
        if (!reduced) {
          setTimeout(function () {
            row.style.transition = "opacity .28s ease";
            row.style.opacity = "1";
          }, 90 * (i + 1));
        }
      });
      if (metaEl) metaEl.textContent = item.meta;
      if (stateEl) stateEl.textContent = "logged";
    }

    function run(item) {
      if (timer) { clearInterval(timer); timer = null; }
      if (reduced) { sqlEl.innerHTML = item.sql; paintRows(item); return; }
      if (stateEl) stateEl.textContent = "running";
      rowsEl.innerHTML = "";
      if (metaEl) metaEl.textContent = "…";

      // type the generated SQL out, tag by tag
      var full = item.sql;
      var i = 0;
      sqlEl.innerHTML = "";
      timer = setInterval(function () {
        i += 6;
        if (i >= full.length) {
          clearInterval(timer); timer = null;
          sqlEl.innerHTML = full;
          setTimeout(function () { paintRows(item); }, 260);
          return;
        }
        // avoid cutting an HTML tag in half
        var slice = full.slice(0, i);
        var lastOpen = slice.lastIndexOf("<");
        var lastClose = slice.lastIndexOf(">");
        if (lastOpen > lastClose) slice = slice.slice(0, lastOpen);
        sqlEl.innerHTML = slice + '<span class="cursor">▌</span>';
      }, 16);
    }

    onceInView(root, function () { run(SET[0]); }, 0.3);
  });
})();
