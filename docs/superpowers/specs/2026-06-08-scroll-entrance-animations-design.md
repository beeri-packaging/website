# Subtle scroll-entrance animations

**Date:** 2026-06-08
**Branch:** feat/about-page

## Goal

Add subtle entrance animations to section-level elements across all marketing
pages, extending the existing CSS-first animation system (no new dependency, no
new client island).

## Mechanism

A reusable `.reveal` utility in `app/globals.css` whose hidden state is plain
CSS (applies on first paint, no flash) and is revealed by a single global
IntersectionObserver island (`app/components/system/RevealOnScroll.tsx`) that
adds `.is-visible` once each element scrolls into view.

```css
.reveal {
  opacity: 0;
  transform: translateY(calc(20px + var(--reveal-i, 0) * 6px));
  transition: opacity 600ms cubic-bezier(0.2,0.7,0.2,1),
              transform 600ms cubic-bezier(0.2,0.7,0.2,1);
}
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

### Why not a CSS `view()` scroll timeline

The first attempt used `animation-timeline: view()` (pure CSS, no JS). It is
unreliable: anonymous `view()` timelines **freeze or mis-resolve under
`position: sticky` / `overflow: clip` ancestors** — on Safari they resolved to
the end state, so nothing animated. This is the exact problem the codebase
already documents in `DualJourney.tsx`, which is why the journey observes its
cards with IntersectionObserver. `.reveal` now follows that proven pattern.

### Properties

- **Subtle:** 20px rise + fade over 600ms once the element enters the viewport.
- **One island, not per-element:** server components only add the `reveal`
  class; a single client island (mounted in the locale layout) observes them and
  re-scans on client navigation via `usePathname` (from `next/navigation`).
  Pages stay server-first.
- **Catches dynamically-mounted nodes:** the island also runs a `MutationObserver`
  so `.reveal` nodes that mount after the initial pass without a route change
  (e.g. the client-filtered roles list on /careers) are still observed and
  revealed — otherwise they'd be stranded at opacity:0.
- **No first-paint flash:** the hidden state is plain CSS, so content starts
  hidden; the observer reveals it.
- **Above-the-fold is excluded:** hero/intro lead blocks do NOT carry `.reveal`,
  so the LCP element paints immediately instead of waiting for hydration.
- **Reduced motion:** handled solely by a CSS `prefers-reduced-motion` rule that
  shows every `.reveal` at rest (JS-independent, covers late-mounted nodes); the
  island early-returns and does no work.
- **JS-disabled safety:** a `<noscript>` style in the layout forces `.reveal`
  visible, so content is never stranded hidden.
- **No persistent `will-change`:** a one-shot 600ms fade doesn't need it, so it's
  omitted to avoid holding compositor layers for the life of the page.
- **Hover-transition cards:** elements with their own `transition-*` utility
  (e.g. blog related cards) get `.reveal` on their grid *container*, not the card
  — an unlayered `.reveal { transition }` would otherwise override the utility.

## Application

Add the `reveal` class to meaningful section-level blocks (headings, cards,
feature/image-text rows) — not every element — across:

- About (`about/AboutPageDesign.tsx`)
- Catalog (`catalog/CatalogPageDesign.tsx`)
- Finishing (`finishing/FinishingPageDesign.tsx`)
- Careers (`careers/CareersBento.tsx`)
- Blog (`blog/BlogArticle.tsx` + listing)
- Legal (`legal/LegalDocument.tsx`)
- Contact (`contact/ContactDialog.tsx` — section content, not the modal entrance)
- Home sections not already animated (`home/Faq.tsx`, `home/TechnicalExcellence.tsx`, etc.)

The home Hero and DualJourney keep their existing bespoke animations.

## Out of scope

- No framer-motion or other animation library.
- No changes to the existing dialog / drawer / journey animations.
- No new client components.

## Verification

- `npm run lint`, `tsc --noEmit`, `npm run build` clean.
- Visual: reveals are subtle; `/he` (RTL) and `/en` both render; reduced-motion
  shows content instantly.
