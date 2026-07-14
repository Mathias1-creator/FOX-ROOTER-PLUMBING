# Prodigy Plumbing — Website

Flat HTML/CSS/JS marketing site for Prodigy Plumbing (Perris, CA). No frameworks, no build
step, no dependencies beyond Google Fonts. Deployable as-is to GitHub Pages or any static host.

## Structure

```
index.html          Home
about.html          About (Daniel's story + Why Choose Us)
services.html       All 8 services (anchor-linked rows) + FAQ accordion
gallery.html        Photo gallery (placeholder cards, lightbox-ready)
contact.html        Contact — click-to-call/text/email (no form, by design)
404.html            Not-found page (GitHub Pages picks it up automatically)
robots.txt          + sitemap reference
sitemap.xml         All 5 pages
assets/
  css/styles.css    Entire design system (palette variables at the top)
  js/main.js        Nav, fade-ins, counters, scrollspy, FAQ, lightbox
  favicon.svg       Droplet mark in brand teal
  logo.png          ← NOT included: drop the real logo file here
```

## Before launch — three swaps

1. **Logo** — add the client's wordmark badge as `assets/logo.png` (easiest: on GitHub,
   open the `assets` folder → Add file → Upload files → drop the image, named exactly
   `logo.png`, → Commit). The header (top-left) and footer already have a fitted dark
   chip for it — it appears automatically once the file loads. Until then a built-in
   SVG droplet + text lockup shows instead, so nothing looks broken meanwhile.

2. **Testimonials** — the three review cards on `index.html` are clearly-marked
   placeholders (search for `testi-card`). Paste real Yelp/Google reviews word-for-word,
   update the attribution lines, and delete each card's `testi-tag` span. Do not invent
   quotes.

3. **Gallery photos** — drop images into `assets/gallery/`, then per card in
   `gallery.html`: add `data-full="assets/gallery/photo.jpg"` to the `<figure>` and an
   `<img src="…" alt="Describe the job">` as the first child of `.gallery-media`
   (remove the SVG + "coming soon" chip). The lightbox activates automatically for any
   card with `data-full`. Full instructions are in a comment at the top of the grid.

## Domain

Canonical URLs, Open Graph URLs, `sitemap.xml`, and `robots.txt` all point at
`https://prodigyplumbing.pro/` (the business's email domain). If the site launches on a
different domain — or temporarily on GitHub Pages — swap the base URL in one pass:

```
grep -rl 'prodigyplumbing.pro' *.html *.xml *.txt | xargs sed -i 's|https://prodigyplumbing.pro|https://NEW-DOMAIN|g'
```

All asset paths are relative, so the site itself works from any domain or subpath
without changes.

## Notes

- **No `<form>` anywhere** — contact is tel:/sms:/mailto: only, plus the sticky mobile
  call/text bar. That's intentional (the old site's JS-dependent form was its only
  contact path).
- **Brand palette** lives in `:root` at the top of `assets/css/styles.css`. `--teal`
  (#0F8B8D) was sampled from the brand; fine-tune it against the real logo file if needed.
- **Map embed** on the contact page shows a general Perris service-area view on purpose —
  no home address is pinned or published.
- **Schema** — `Plumber` JSON-LD sits on Home/Services/Contact (Services carries one
  `Service` entry per offering). If a Google Business Profile exists, keep the phone and
  hours here in sync with it.
- The previous contents of this repo (the Fox Rooter & Plumbing site) remain untouched on
  the `claude/fox-rooter-plumbing-site-ysbxp1` branch; this branch replaced them for the
  Prodigy build.
