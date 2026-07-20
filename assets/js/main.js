/* Prodigy Plumbing — shared behavior. No dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Mobile nav toggle ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-locked");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-locked", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980) closeNav();
    });
  }

  /* ----- Header shadow on scroll ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Fade-in on scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      // Stagger siblings inside [data-stagger] containers
      document.querySelectorAll("[data-stagger]").forEach(function (group) {
        var kids = group.querySelectorAll(":scope > .reveal");
        kids.forEach(function (el, i) {
          el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
        });
      });
      var revealIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              revealIO.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
      );
      revealEls.forEach(function (el) { revealIO.observe(el); });
    }
  }

  /* ----- Animated counters ----- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCounter = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion || !window.requestAnimationFrame) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1100;
      var start = null;
      var tick = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      var countIO = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              countIO.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) { countIO.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ----- Services sub-nav scrollspy ----- */
  var subnav = document.querySelector(".svc-subnav");
  if (subnav && "IntersectionObserver" in window) {
    var pills = subnav.querySelectorAll(".pill");
    var byId = {};
    pills.forEach(function (pill) {
      var id = (pill.getAttribute("href") || "").replace("#", "");
      if (id) byId[id] = pill;
    });
    var setActive = function (id) {
      pills.forEach(function (p) { p.classList.remove("is-active"); });
      var pill = byId[id];
      if (pill) {
        pill.classList.add("is-active");
        pill.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
      }
    };
    var spyIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    document.querySelectorAll("[data-spy]").forEach(function (sec) { spyIO.observe(sec); });
  }

  /* ----- FAQ: close other items when one opens ----- */
  var faq = document.querySelector(".faq");
  if (faq) {
    faq.querySelectorAll("details").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        faq.querySelectorAll("details[open]").forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  }

  /* ----- Consent-gated Google Maps embed (contact page) -----
     The Google iframe is the only third-party content that can set
     cookies, so it loads only if the visitor chose "Accept All" on
     the cookie banner, or taps "Load map" themselves. */
  var mapWrap = document.getElementById("map-embed");
  if (mapWrap) {
    var loadMap = function () {
      if (mapWrap.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = mapWrap.getAttribute("data-map-src");
      f.title = "Map of the Prodigy Plumbing service area around Perris, California";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      mapWrap.innerHTML = "";
      mapWrap.appendChild(f);
    };
    window.ppLoadMap = loadMap;
    if (localStorage.getItem("prodigyPlumbingCookieConsent") === "all") {
      loadMap();
    } else {
      var mapBtn = document.getElementById("load-map");
      if (mapBtn) mapBtn.addEventListener("click", loadMap);
    }
  }

})();
