---
name: verify
description: Verify this static site end-to-end — serve it, drive it in headless Chromium, screenshot every page at mobile + desktop widths.
---

# Verify this static site

Flat HTML/CSS/JS, no build step. Verification = serve the repo root and drive pages in a real browser.

## Setup (once per session)

```bash
cd <scratchpad> && npm init -y && npm install playwright-core --no-audit --no-fund
```

Chromium is pre-installed: launch with `executablePath: "/opt/pw-browsers/chromium"`.
Do NOT run `playwright install`.

## Serve

Any static server on the repo root works. In a Playwright script, an inline `http.createServer`
that streams files with correct `content-type` (html/css/js/svg) avoids process juggling.

## Gotchas learned the hard way

- **Google Fonts hangs in the sandbox** (proxy resets the connection after ~15s). Block it or
  `waitUntil: "domcontentloaded"`, else every `load` wait eats 15s:
  `await ctx.route("**fonts.g**", r => r.abort())`
- `assets/logo.png` 404s until the client logo lands — filter that from console-error checks.
- The Google Maps iframe on contact.html stays blank in the sandbox. Environment, not a bug.
- Use `reducedMotion: "reduce"` contexts for full-page screenshots (reveal-on-scroll elements
  render visible immediately); use a normal context to test counters/reveals actually animate.

## What to drive (minimum)

1. All 6 pages (5 + 404.html) load with 0 unexpected console errors and 0 `<form>` elements.
2. Internal `href="page#id"` anchors all resolve (parse hrefs, grep `id="…"` in target file).
3. Mobile 390px: sticky call/text bar visible with `tel:`/`sms:` hrefs; hamburger opens a
   full-height white drawer (a past bug: `backdrop-filter` on the header collapsed it), Escape closes.
4. services.html: pill click scrolls the section BELOW the sticky header + pill bar
   (`scroll-margin-top` on `.svc-row`); FAQ `<details>` opens and closes siblings.
5. Horizontal overflow sweep: `scrollWidth - clientWidth` must be 0 on every page at
   320 / 360 / 375 / 390 / 768 px.
6. Gallery lightbox: inject `data-full` + `<img>` per the README recipe, click card → `<dialog>` opens.
7. No-JS context: nav links reachable, content visible (html.no-js fallbacks).

## Copy lint

`grep -rniE "trusted|dependable|peace of mind|we understand|look no further|when it comes to" *.html`
must return nothing — these are banned by the client brief.
