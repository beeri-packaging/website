# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ
from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before
writing any code. Heed deprecation notices.

# Beeri Packaging — Project Guide

Marketing site for **בארי אריזות** (Beeri Packaging), a custom carton-packaging
manufacturer (est. 1964).

> **Status:** Migrating to a server-first, CMS-driven, bilingual foundation.
> Source of truth for the architecture: `docs/superpowers/specs/2026-06-04-website-foundation-design.md`.
> Plans: `docs/superpowers/plans/`. Some target paths below land progressively — follow the plans.

## Stack

- **Next.js 16.2.6** (App Router, no `src/`)
- **React 19.2**
- **Tailwind v4** via `@tailwindcss/postcss` — tokens live in `app/globals.css` under
  `@theme inline`, not a JS config
- **TypeScript 5** strict, `@/*` → repo root
- **next-intl** — `/he` + `/en` routing, Hebrew default
- **Sanity** — CMS, Studio embedded at `/studio`
- **class-variance-authority** + **clsx** + **tailwind-merge** — typed component variants
- **Radix** primitives — only for interactive a11y (dialog, accordion, menu)
- Fonts: `Karantina` (display) + `Open Sans` (sans) via `next/font/google` (hebrew + latin)

## Commands

```bash
npm run dev         # dev server at http://localhost:3000
npm run build       # production build
npm run start       # serve production build
npm run lint        # eslint
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright end-to-end tests
npm run lighthouse  # Lighthouse against a running production build
```

## Folder layout

```
app/
  [locale]/            he | en — Hebrew default, RTL
    layout.tsx         <html lang dir>, fonts, NextIntlClientProvider, JSON-LD
    page.tsx           home (server)
    <route>/page.tsx   catalog, portfolio, showcase, careers, finishing, blog
  studio/[[...tool]]/  embedded Sanity Studio (admin)
  sitemap.ts robots.ts
  globals.css          brand tokens (design source of truth) — DO NOT change the palette
  design/              dev-only playground — excluded from prod
components/
  ui/          PRIMITIVES — Button, Card, Badge, Container, Section, Heading, Eyebrow, Link
  sections/    composed page sections (server by default)
  interactive/ client islands only (MobileDrawer, LangMenu, StickyContact)
lib/    cn.ts (clsx + tailwind-merge), utils
sanity/ schemaTypes, client, queries (GROQ), image url builder, live/preview
i18n/   routing.ts, request.ts, navigation.ts
messages/ he.json, en.json — UI chrome strings only
proxy.ts  locale middleware (renamed from middleware.ts in Next 16)
```

## Core rules

1. **Server-first.** Components render on the server by default. Add `"use client"` only at
   the leaf that owns state, an effect, a ref, or a browser API. Pass server data into
   client islands as props. A whole page must never be `"use client"`.
2. **Use the primitives.** Never re-hardcode a button/card/badge with raw Tailwind. Import
   from `components/ui/` and use variants (`<Button variant="primary" size="lg">`). New
   variants are added to the primitive, not forked inline.
3. **No hard-coded strings or image paths in components.** UI chrome strings come from
   `messages/{he,en}.json`; editorial content comes from **Sanity** via typed GROQ queries.
   Images come from the Sanity CDN, never from `public/images/`.
4. **Bilingual in the same shape.** Hebrew (he, RTL) is primary; English (en, LTR) is
   secondary. Both locales render from the same components and content shape.
5. **Logical CSS properties** (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) over
   physical, so RTL/LTR both work.

## Brand tokens

CSS variables in `app/globals.css`, exposed via `@theme inline`. Use the Tailwind class form
(`bg-bone`, `text-ink`, `bg-cyan`…), never raw hex. Core palette: `bone` (surface), `ink`
(text/buttons), `cyan`/`yellow`/`magenta`/`purple` (accents), `gold` (CTA), `sand` (cards),
`clay` (body), `rule` (hairlines). `font-display` = Karantina (headlines), `font-sans` =
Open Sans (body).

## Verification gates (every change)

- `npm run lint` and `tsc --noEmit` — 0 errors
- `npm run build` — succeeds
- `npm run test` (Vitest) — green
- `npm run test:e2e` (Playwright) — green; both `/he` and `/en` render
- **Visual:** the design must not change — verify migrated pages against the current render
- A11y: WCAG 2.1 AA; no serious axe violations
- Perf: production Lighthouse Performance ≈ 100

## Content & SEO source of truth

Keyword strategy/positioning: `docs/research/beeri-google-trends-seo-research.md`. For
Hebrew copy work use the `hebrew-content-writer` skill.

## Heavy assets

Legacy photos in `public/images/` (~1.7 GB) are being migrated to the Sanity CDN. Do not
`git add public/images/` blindly. New images go to Sanity, not the repo.
