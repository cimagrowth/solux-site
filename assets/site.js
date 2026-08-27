// Solux site — scroll reveal + contact form
(function () {
  "use strict";

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Scroll reveal
  var targets = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach(function (t) { t.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }

})();

// --- Audit trace: one execute pass when it scrolls into view ---
(function () {
  "use strict";
  var panel = document.querySelector(".audit[data-execute]");
  if (!panel) return;

  var steps = [].slice.call(panel.querySelectorAll(".audit__row, .audit__foot"));
  var dot = panel.querySelector(".audit__bar i");
  var status = panel.querySelector("[data-audit-status]");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() {
    steps.forEach(function (s) { s.classList.add("is-on"); });
    if (dot) dot.classList.remove("is-busy");
    if (status) status.textContent = "live";
  }

  if (reduced || !("IntersectionObserver" in window)) { showAll(); return; }

  function run() {
    if (dot) dot.classList.add("is-busy");
    if (status) status.textContent = "running";
    var i = 0;
    (function tick() {
      if (i >= steps.length) {
        if (dot) dot.classList.remove("is-busy");
        if (status) status.textContent = "logged";
        return;
      }
      steps[i].classList.add("is-on");
      i += 1;
      // beat after the question, before the generated SQL lands
      setTimeout(tick, i === 2 ? 560 : 300);
    })();
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { io.disconnect(); setTimeout(run, 260); }
    });
  }, { threshold: 0.35 });
  io.observe(panel);
})();

// --- Product screenshot frames: show the "awaiting capture" state until a
//     real image is dropped in, then swap to it automatically on load. ---
(function () {
  "use strict";
  document.querySelectorAll(".frame__body img").forEach(function (img) {
    var wait = img.parentElement.querySelector(".frame__await");
    function fail() { if (wait) wait.hidden = false; img.style.display = "none"; }
    function ok() { if (wait) wait.hidden = true; img.style.display = "block"; }
    if (img.complete) { (img.naturalWidth > 0 ? ok : fail)(); }
    img.addEventListener("load", ok);
    img.addEventListener("error", fail);
  });
})();
