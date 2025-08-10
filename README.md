# neo-brutalics
by Thomas Konig @ intelfy
thomas@intelfy.dk

Latest update:
August 10, 2025

a neo-brutalist, work-in-progress theme for Ghost, designed for the intelfy.dk blog but shared with you for free.

![screenshot](assets/images/screenshot-desktop.png)

I can't be bothered to write an entire readme for this, so check out the full write-up here: https://blog.intelfy.dk/dev-block-made-theme/ (contains a download .zip, but you could also just clone this repository locally and zip and install)

## Demo:
[Front Page](https://blog.intelfy.dk) | [Post Page](https://blog.intelfy.dk/dev-block-made-theme/)

## Downloads:
Download the latest semi-stable release here: https://github.com/TomKonig/neo-brutalics/releases

Or find the newest dev version - hotfixes and all - here: https://blog.intelfy.dk/dev-block-made-theme/

## v0.8.0 changelog:
- **Fonts now load correctly** - Massively changed the structure to allow fonts to load correctly. Does not support custom themes until I set up an admin panel option.
- **Blockquote card works in dark** – Blockquotes now use tokenized surfaces (--paper/--surface) and are targeted in .gh-content (not legacy .kg-post), so they render correctly in dark mode. (screen.css)
- **Bookmark card fixed** – Implemented full .kg-bookmark-card + .kg-bookmark-container styles and responsive stacking. (screen.css) 
- **Font spacing on heroes** – Tightened tracking & line-height and enforced weight (800) to prevent faux bold. (screen.css)
- Inconsistent wrappers solved – .wrap and .gh-content.gh-canvas now share the same gutter tokens so nav/hero/content align to one grid. (screen.css) 
- **All editor cards styled, neo-brutalist** – Added/normalized styles for Callout, Toggle, Gallery, Header, File, Signup, Bookmark, Audio, Video, Product with shared --nb-* tokens. (screen.css)
- **Post hero now wraps on mobile, columns dropped** – mobile media query stacks text above image using CSS order. (screen.css)
- **Footer padded away from bottom** – Added spacing + border-top. (screen.css)
- **Sections fill viewport** – .home-template .latest + .featured get min-height: calc(100svh - var(--nav-h)). (screen.css)
- **Overrides merged; file removed** – Merged assets/css/overrides.css into screen.css, deleted the file, and ensured no template references to it remain. (screen.css, file removed)
- **Template bug in default.hbs fixed** – Cleaned malformed class attribute on <body>. (default.hbs) 
- **Custom dark mode toggle compatible** – Added body.dark { … } variable overrides so your toggle wins; left prefers-color-scheme as fallback. (screen.css)
- **Heading weight/spacing better** – See (3); tightened tracking and disabled font-synthesis-weight to avoid fake bold. (screen.css)
- **Proper font families declared and implemented** – Proper @font-face for Manrope & Sora, preferring woff2-variations and falling back to your TTFs. (screen.css)
- **Tracking tightened** – Adjusted .h1 letter-spacing to ~-0.02em and post-hero line-height to 1.08. (screen.css)
- **Blockquote targets .gh-content** – Selectors updated so editor/front-end behave consistently. (screen.css) 
- **Dark mode variables** – Implemented both OS (@media (prefers-color-scheme: dark)) and body.dark token sets. (screen.css)
- **Wrapper & canvas aligned** – Shared tokens across .wrap & .gh-content.gh-canvas for uniform padding and max widths. (screen.css) 
- **Template syntax sorted** – Cleaned stray/truncated markup, normalized sections in post.hbs. (default.hbs, post.hbs)
- nav.hbs truncated button repaired – Replaced the cut button with valid accessible markup (aria-expanded, inner bars). (partials/nav.hbs)
- **Copy button on code blocks** – Added branded copy pill to .gh-content pre and .kg-code-card pre with robust clipboard fallback. (screen.css, assets/js/site.js)