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

  /* ----- Gallery lightbox (activates for cards with data-full) ----- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector("figcaption");
    var openCard = function (card) {
      var full = card.getAttribute("data-full");
      if (!full) return;
      var caption = card.querySelector("figcaption");
      var thumb = card.querySelector("img");
      lbImg.src = full;
      lbImg.alt = thumb ? thumb.alt : (caption ? caption.textContent.trim() : "Project photo");
      lbCap.textContent = caption ? caption.textContent.trim() : "";
      lightbox.showModal();
    };
    document.querySelectorAll(".gallery-card[data-full]").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("click", function () { openCard(card); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCard(card);
        }
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    var closeBtn = lightbox.querySelector(".lb-close");
    if (closeBtn) closeBtn.addEventListener("click", function () { lightbox.close(); });
    lightbox.addEventListener("close", function () { lbImg.src = ""; });
  }
})();
