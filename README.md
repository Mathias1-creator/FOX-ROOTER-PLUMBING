# Prodigy Plumbing — Website

Flat HTML/CSS/JS marketing site for Prodigy Plumbing (Perris, CA). No frameworks, no build
step, no dependencies beyond Google Fonts. Deployable as-is to GitHub Pages or any static host.

## Structure

```
index.html          Home
about.html          About (Daniel's story + Why Choose Us)
services.html       All 8 services (anchor-linked rows) + FAQ accordion
contact.html        Contact — click-to-call/text/email (no form, by design)
404.html            Not-found page (GitHub Pages picks it up automatically)
robots.txt          + sitemap reference
sitemap.xml         All 5 pages
assets/
  css/styles.css    Entire design system (palette variables at the top)
  js/main.js        Nav, fade-ins, counters, scrollspy, FAQ, lightbox
  favicon.svg       Droplet mark in brand teal
  logo.png          Client wordmark badge (640px wide, transparent PNG)
  photos/           Client-provided job photos, one per service (EXIF stripped)
```

## Launch placeholders — all done

- **Logo** — `assets/logo.png`, rendered on the dark header/footer (droplet + text
  fallback if the file ever goes missing).
- **Testimonials** — two real customer reviews on `index.html`, quoted word-for-word.
  Add more the same way: copy a review verbatim into a new `testi-card` figure.
- **Job photos** — real, client-provided photos live at `assets/photos/*.jpg`, one per
  service, shown in the services-page rows. To replace one, overwrite the file (same
  name) — they're re-encoded to strip camera metadata, so do the same for new ones.
- The separate gallery page was removed at the client's request; `gallery.html` can be
  restored from git history if it's ever wanted again.

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
