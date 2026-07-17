# Prodigy Plumbing — Website

Flat HTML/CSS/JS marketing site for Prodigy Plumbing (Perris, CA). No frameworks, no build
step, no dependencies beyond Google Fonts. Deployable as-is to GitHub Pages or any static host.

## Structure

```
index.html          Home (hero, featured services, reviews, service area)
about.html          About (Daniel's story + Why Choose Us)
services.html       All 8 services (anchor-linked rows) + FAQ accordion
contact.html        Contact — click-to-call/text/email (no form, by design)
404.html            Not-found page (GitHub Pages picks it up automatically)
cookie-consent.js   Cookie banner (localStorage only, no tracking installed)
robots.txt          + sitemap reference
sitemap.xml         All 4 pages
assets/
  css/styles.css    Entire design system (palette variables at the top)
  js/main.js        Nav, fade-ins, counters, scrollspy, FAQ accordion
  favicon.svg       Droplet mark in brand teal
  logo.png          Client wordmark (640px wide, transparent PNG)
  bca.png           Business Consumer Alliance logo (footer badge)
  photos/           Client-provided photos (EXIF/GPS stripped): homepage hero,
                    about-page photo, and one job photo per service
```

## Deploying

Upload everything above to the web root (e.g. `public_html`), keeping the folder
structure. That's the entire deployment — no server-side code, database, PHP, or
Node.js. All internal paths are relative, so the site works from a domain root or a
subfolder.

- **GitHub Pages** — push to a branch, enable Pages; `404.html` and `.nojekyll` are
  already handled.
- **Apache shared hosting** — optionally add `ErrorDocument 404 /404.html` to
  `.htaccess` so the custom 404 page shows.
- **HTTPS** — recommended; every mainstream host provides it free.

## Domain

Canonical URLs, Open Graph URLs, `sitemap.xml`, and `robots.txt` all point at
`https://prodigyplumbing.pro/` (the business's email domain). If the site launches on a
different domain, swap the base URL in one pass:

```
grep -rl 'prodigyplumbing.pro' *.html *.xml *.txt | xargs sed -i 's|https://prodigyplumbing.pro|https://NEW-DOMAIN|g'
```

## Content notes

- **Reviews** — six real customer reviews on `index.html` (two Yelp, four Google),
  quoted word-for-word, each tagged with its source. Buttons below them link to the
  Google listing (leave/read reviews) and Yelp. Add more the same way: copy a review
  verbatim into a new `testi-card` figure.
- **Photos** — real, client-provided; to replace one, overwrite the file (same name).
  New photos should be re-encoded (any image tool) so camera EXIF/GPS data is stripped.
- **No `<form>` anywhere** — contact is tel:/sms:/mailto: only, plus the sticky mobile
  call/text bar. That's intentional.
- **Brand palette** lives in `:root` at the top of `assets/css/styles.css`; the teal
  (`#3e8f98` and friends) was sampled from the actual logo artwork.
- **Cookie banner** — stores the visitor's choice in localStorage. No analytics is
  installed; `cookie-consent.js` has a marked hook for loading analytics later only
  when "Accept All" was chosen.
- **Map embed** on the contact page shows a general Perris service-area view on
  purpose — no home address is pinned or published.
- **Schema** — `Plumber` JSON-LD on Home/Services/Contact (slogan, award, services,
  hours). The visible site intentionally names no individual cities in the service
  area (per the owner); the schema/meta keep the city list for local search. If a
  Google Business Profile exists, keep phone and hours in sync with it.
