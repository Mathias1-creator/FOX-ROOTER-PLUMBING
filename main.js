/* ============================================================
   FOX ROOTER & PLUMBING — main.js
   Vanilla JavaScript. No libraries, no tracking, no cookies.
   ------------------------------------------------------------
   01 Active nav link
   02 Sticky header shrink
   03 Mobile menu (focus trap, Esc, outside click)
   04 Scroll reveal (IntersectionObserver)
   05 Flow line draw ("How it works")
   06 Count-up stats
   07 FAQ accordion
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function prefersReduced() { return reduceQuery.matches; }

  /* ---------- 01 Active nav link ---------- */
  /* The header markup is byte-identical on every page, so the current
     page is marked here instead of in the HTML. */
  (function markActiveNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (file === '') { file = 'index.html'; }
    var links = document.querySelectorAll('a[data-nav]');
    for (var i = 0; i < links.length; i++) {
      var target = (links[i].getAttribute('href') || '').split('#')[0].toLowerCase();
      if (target === file) {
        links[i].classList.add('is-active');
        links[i].setAttribute('aria-current', 'page');
      }
    }
  })();

  /* ---------- 02 Sticky header shrink ---------- */
  (function headerShrink() {
    var header = document.getElementById('siteHeader');
    if (!header) { return; }
    var ticking = false;
    function update() {
      header.classList.toggle('is-condensed', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  })();

  /* ---------- 03 Mobile menu ---------- */
  (function mobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('mobileMenu');
    var backdrop = document.getElementById('menuBackdrop');
    if (!toggle || !menu || !backdrop) { return; }

    var closeBtn = menu.querySelector('.mobile-menu-close');
    var isOpen = false;
    var lastFocused = null;

    function focusables() {
      return menu.querySelectorAll('a[href], button:not([disabled])');
    }

    function openMenu() {
      if (isOpen) { return; }
      isOpen = true;
      lastFocused = document.activeElement;
      menu.hidden = false;
      backdrop.hidden = false;
      /* Next frame, so the slide/fade transitions run. */
      window.requestAnimationFrame(function () {
        menu.classList.add('open');
        backdrop.classList.add('open');
      });
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
      if (closeBtn) { closeBtn.focus(); }
    }

    function closeMenu() {
      if (!isOpen) { return; }
      isOpen = false;
      menu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      window.setTimeout(function () {
        if (!isOpen) {
          menu.hidden = true;
          backdrop.hidden = true;
        }
      }, prefersReduced() ? 0 : 340);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
    if (closeBtn) { closeBtn.addEventListener('click', closeMenu); }
    backdrop.addEventListener('click', closeMenu);

    /* Close after choosing a link (it navigates anyway; this covers
       same-page and anchor cases). */
    menu.addEventListener('click', function (event) {
      var link = event.target.closest ? event.target.closest('a[href]') : null;
      if (link) { closeMenu(); }
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen) { return; }
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') { return; }
      /* Focus trap */
      var items = focusables();
      if (!items.length) { return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (isOpen && window.innerWidth > 920) { closeMenu(); }
    });
  })();

  /* ---------- 04 Scroll reveal ---------- */
  (function scrollReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) { return; }

    function showAll() {
      items.forEach(function (el) {
        el.classList.remove('reveal-ready');
        el.classList.add('in');
      });
    }

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    /* Light stagger inside any [data-stagger] group. */
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var children = group.querySelectorAll('.reveal');
      children.forEach(function (el, i) {
        el.style.setProperty('--rd', Math.min(i, 5) * 80 + 'ms');
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) {
      /* Only hide elements still below the viewport — nothing on screen
         flickers, and a no-JS visit shows everything. */
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('in');
      } else {
        el.classList.add('reveal-ready');
        observer.observe(el);
      }
    });

    reduceQuery.addEventListener('change', function () {
      if (prefersReduced()) { showAll(); }
    });
  })();

  /* ---------- 05 Flow line draw ---------- */
  (function flowLine() {
    var flow = document.querySelector('.flow');
    if (!flow) { return; }
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      flow.classList.add('flow-drawn');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          flow.classList.add('flow-drawn');
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(flow);
  })();

  /* ---------- 06 Count-up stats ---------- */
  (function countUp() {
    var nums = Array.prototype.slice.call(document.querySelectorAll('.stat-num[data-count]'));
    if (!nums.length) { return; }

    function finalText(el) {
      return el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    }

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      nums.forEach(function (el) { el.textContent = finalText(el); });
      return;
    }

    /* Start from zero; the real values animate in when the band scrolls
       into view. Markup ships with the final values for no-JS visits. */
    nums.forEach(function (el) {
      el.textContent = '0' + (el.getAttribute('data-suffix') || '');
    });

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) {
        el.textContent = finalText(el);
        return;
      }
      var duration = 1300;
      var start = null;
      function step(now) {
        if (start === null) { start = now; }
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3); /* ease-out cubic */
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) { window.requestAnimationFrame(step); }
      }
      window.requestAnimationFrame(step);
    }

    var done = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !done) {
          done = true;
          nums.forEach(animate);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    var band = document.querySelector('.stats') || nums[0];
    observer.observe(band);
  })();

  /* ---------- 07 FAQ accordion ---------- */
  (function faq() {
    var buttons = document.querySelectorAll('.faq-q');
    if (!buttons.length) { return; }
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (item) { item.classList.toggle('open', !expanded); }
      });
    });
  })();
})();
