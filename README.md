# Laus Latina — website base

A plain HTML/CSS/JS starting point for the Laus Latina site, built from the
brand manual (manifesto, colors, typography, logo lockups). Three separate
files, no build step, no framework — open `index.html` in a browser and it
works.

```
laus-latina/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── logo-mark-navy.png       ← flourish symbol, navy — light backgrounds
    ├── logo-mark-cream.png      ← flourish symbol, cream — dark backgrounds
    ├── logo-wordmark-navy.png   ← full "LAUS LATINA" wordmark, navy
    └── logo-wordmark-cream.png  ← full "LAUS LATINA" wordmark, cream
```

## What's already in place

- **Logo** — the real, uploaded artwork: the flourish symbol in the
  header/footer/nav, the full wordmark in the hero. Both come in a navy
  version (for light backgrounds: header, footer, Caelum tiles) and a
  cream version (for dark Indigum backgrounds: the hero, the dark tile in
  the identity showcase) — see "Logo variants" below before adding new
  placements.
- **Colors** — Indigum (#2F475F), Caelum (#D3E6E5) and Candor (#F2ECDE) as
  the core palette, with Achiote used sparingly as the accent (per the
  manual's own contrast rules for large text/buttons).
- **Copy** — the manifesto, founding concept, and ecosystem pitch, pulled
  and lightly adapted from the brand manual.
- **Sections** — header/nav, hero, manifesto, concept, ecosystem (3 value
  cards), identity/logo showcase, join form, footer.
- **Behavior** — mobile menu, scroll-reveal on section entry, sticky header
  shadow, a front-end-only "join" form with validation feedback.

## 1. Logo variants — which file goes where

The uploaded artwork is a single navy color (`#2F475F`) on a transparent
background, so it disappears on a navy section unless the cream copy is
used instead. Both `-navy` and `-cream` PNGs were generated from your
original files (same shape, recolored, alpha preserved) — no new artwork
needed, just:

| Placement | File in use | Why |
|---|---|---|
| Header / nav | `logo-mark-navy.png` | header background is light (Candor) |
| Footer | `logo-mark-navy.png` | footer background is light (Candor) |
| Hero (`#top` statement) | `logo-wordmark-cream.png` | hero background is dark (Indigum) |
| Identity tile — Candor bg | `logo-mark-navy.png` + `logo-wordmark-navy.png` | light tile |
| Identity tile — Indigum bg | `logo-mark-cream.png` + `logo-wordmark-cream.png` | dark tile |
| Identity tile — Caelum bg | `logo-mark-navy.png` + `logo-wordmark-navy.png` | light tile |

If you get a proper multi-color or white-specific export later, swap the
`-cream` files for those — everything else (sizing, layout) stays the same.

## 2. Swap in the real typefaces

The manual specifies **Cabinet Grotesk** (logo/headlines) and **Vesper
Devanagari** / **Juana** (subtitles/editorial accents). Those are paid
fonts, so this base uses close, free Google Fonts stand-ins:

- `Space Grotesk` for `--font-display` (headlines, nav, buttons, labels)
- `Fraunces` for `--font-serif` (body copy, manifesto, quotes)

To use the real files once you have them:

1. Add your font files under `assets/fonts/`.
2. In `styles.css`, uncomment the `@font-face` block near the top and point
   it at your files.
3. Update the `--font-display` / `--font-serif` variables in `:root` to put
   your real font family names first, e.g.:
   ```css
   --font-display: "Cabinet Grotesk", "Space Grotesk", system-ui, sans-serif;
   --font-serif:   "Vesper Devanagari", "Fraunces", Georgia, serif;
   ```
4. You can drop the Google Fonts `<link>` tags in `index.html`'s `<head>`
   once you no longer need the fallback.

## 3. Colors

All brand colors live as CSS custom properties at the top of `styles.css`
(`:root { ... }`). Change a value there and it updates everywhere. The
manual's contrast table was followed for the current combinations (e.g.
Achiote is only used for buttons/large text, never small body copy) — keep
that in mind if you introduce new color pairings.

## 4. Content

All copy lives directly in `index.html` — manifesto text, section copy,
nav labels, footer links and the social icon placeholders (`href="#"`,
swap for real profile URLs). The join form in `#unete` is front-end only;
`script.js` has a `TODO` marking exactly where to wire it to a real
newsletter/API endpoint.

## Browser support note

The stylesheet uses `color-mix()` for tinting/opacity, which needs a
reasonably modern browser (Chrome 111+, Safari 16.4+, Firefox 113+). If you
need to support older browsers, replace those `color-mix(...)` calls with
fixed hex/rgba values.
