<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Beeri Packaging — Project Guide

Marketing site for **בארי אריזות** (Beeri Packaging), a custom carton-packaging manufacturer (est. 1964).

## Stack

- **Next.js 16.2.6** (App Router, no `src/`, no API routes yet)
- **React 19.2** — note the home page is currently one big `"use client"` component
- **Tailwind v4** via `@tailwindcss/postcss` — config lives in `app/globals.css` under `@theme inline`, not in a JS config
- **TypeScript 5** strict, `@/*` path alias maps to repo root
- Fonts: `Karantina` (display) + `Open Sans` (sans) — both loaded via `next/font/google` with `hebrew` and `latin` subsets

## Commands

```bash
npm run dev      # Next dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (eslint-config-next)
```

## Locale & direction

- **Primary: Hebrew (he, RTL).** `<html lang="he" dir="rtl">` is set in [app/layout.tsx](app/layout.tsx).
- **Secondary: English (en, LTR).** The home page already carries an EN scaffold (`type Lang = "he" | "en"`) — copy lives inline as `{ he, en }` pairs. EN copy is provisional.
- When adding UI, ship both `he` and `en` strings in the same shape. Don't hard-code Hebrew in JSX.
- Tailwind logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`) over physical (`pl-*`, `pr-*`) so RTL/LTR both work.

## File layout

```
app/
  layout.tsx              Root layout — RTL, fonts, metadata
  page.tsx                Home page — thin "use client" orchestrator
  design/page.tsx         /design route (Figma / design-system scratch)
  globals.css             Tailwind v4 + brand tokens + animation keyframes
  content/
    home.ts               Typed content for the home page (copy + image paths)
  components/
    home/                 Home-page section components
      Header.tsx, MobileDrawer.tsx, LangPill.tsx,
      Hero.tsx, DualJourney.tsx, TechnicalExcellence.tsx,
      Faq.tsx, CallToAction.tsx, Footer.tsx, StickyContact.tsx,
      icons.tsx           Inline SVG icons shared across the page
public/
  images/
    categories/    wines, food, alcohol-beverages, cosmetics, finishing,
                   pharma, coffee-capsules, shared, other
    figma/         Figma exports (in-flight)
    generated/     AI-generated batches (ambience, hero, timeline, etc.)
    home/          home-page-specific photography
    uncategorized/ legacy photos pending a sorting pass
    logo-he.svg, logo-en.svg
docs/              SEO research, strategy, briefs, blog drafts, decks
.claude/skills/    Repo-local skills (hebrew-content-writer)
```

See [docs/README.md](docs/README.md) for the full Hebrew→slug image mapping and content-source overview.

## Brand tokens

Defined as CSS variables in [app/globals.css](app/globals.css) and exposed to Tailwind through `@theme inline`. Use the Tailwind class form (`bg-bone`, `text-ink`, `bg-cyan`, etc.), not raw hex values.

Core palette: `bone` (page surface), `ink` (text/buttons), `cyan` / `yellow` / `magenta` / `purple` (accents), `gold` (CTA bg), `sand` (cards), `clay` (body copy), `rule` (hairlines).

Fonts: `font-display` (Karantina) for headlines, `font-sans` (Open Sans) for body. Both are wired via `--font-display` / `--font-sans` CSS variables on `<html>`.

## Content layer (CMS-ready)

**All visible text and image paths live in `app/content/`** — currently `home.ts`, with one module planned per page. Components import typed constants (`homeCopy`, `homeImages`, `navLinks`, `capabilities`, `faqItems`) and never hard-code strings or image paths.

This is the seam where a CMS plugs in later. The plan:

1. A CMS (TBD — likely Sanity, Payload, or a headless Strapi) will own the same shape exposed by `app/content/home.ts` (types: `HomeCopy`, `NavLink`, `Capability`, `FaqItem`, plus the `homeImages` record).
2. `content/*.ts` modules will be swapped for async fetchers (e.g. `lib/cms.ts`) that return the same types. Components stay untouched.
3. Images served from the CMS become absolute URLs — `next.config.ts` will need `images.remotePatterns` updated.

**Rules until the CMS lands:**
- Any new copy goes into the relevant `content/*.ts` module — never inline in a component.
- New images get a key in `homeImages` (or the page's equivalent) — components reference the key, never a raw `/images/...` path.
- Types in `content/*.ts` are the contract. Update the type first, then the data, then the component.

## Conventions

- **Edit existing files** rather than creating new ones. New section components go under `app/components/<page>/` only when extracting from a route that already exists.
- **Hebrew filenames** in `public/images/` are kept as-is for now. A rename-to-slug pass is a planned follow-up, not blocking.
- **Image size variants:** most product photos have a full-size `<name>.jpg` plus a smaller `<name>28.jpg` (or `<name>-28.jpg`). Use the `28` variant where bandwidth matters; full-size for hero/zoom.
- **Animations** (`animate-rise`, `animate-fade`, `animate-scroll-hint`, `animate-drawer-in`) live in `globals.css`. All respect `prefers-reduced-motion`.
- **Comments:** code is intentionally light on comments. Don't add narrative comments to JSX; the editorial copy is the documentation.

## Heavy assets

`public/images/` is ~1.5 GB. Before any push to a remote that doesn't already track it, confirm strategy with the user — Git LFS, an external bucket/CDN, or compression. Do not blindly `git add public/images/`.

## Content & SEO source of truth

Keyword strategy and positioning come from [docs/research/beeri-google-trends-seo-research.md](docs/research/beeri-google-trends-seo-research.md). If positioning shifts, update that file first, then propagate to UI copy and blog drafts in [docs/blogs/drafts/](docs/blogs/drafts/).

For Hebrew copy work (marketing, UX strings, blog editing), use the `hebrew-content-writer` skill — it covers register, grammar, gendered language, and Hebrew SEO conventions.
