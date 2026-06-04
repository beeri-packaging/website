# Beeri Packaging — Website Foundation Refactor

**Design spec** · 2026-06-04 · Status: **approved (pending spec review)**

A full refactor of the Beeri Packaging marketing site onto a reusable, server-first,
CMS-driven, bilingual, accessible foundation — **without changing the visual design**.

---

## 1. Goals

1. **Reusable component baseline** — typed UI primitives (`Button`, `Card`, `Badge`, …)
   with variants, so future development has one clear, consistent way to build.
2. **Server-first** — every component that does not need interactivity renders on the
   server; client JS is pushed to small leaf "islands."
3. **CMS** — content editable by a non-technical client via **Sanity** Studio.
4. **Bilingual** — Hebrew (primary, RTL) + English (secondary, LTR) on **separate
   indexable routes** (`/he`, `/en`).
5. **SEO** — per-locale metadata, hreflang, sitemap, robots, JSON-LD structured data.
6. **Accessibility** — WCAG 2.1 AA baseline built into the primitives.
7. **Performance** — production Lighthouse Performance ≈ 100 (folds in the hero-LCP fix).
8. **A better `AGENTS.md`** — the written contract for all of the above.

## 2. Non-goals / constraints

- **The design does not change.** Same layout, colors, type, spacing, animation. Every
  migrated page is verified pixel-for-pixel against the current render.
- No new pages or features beyond what exists today.
- No unrelated refactoring outside this foundation.
- Pre-launch: no live traffic, so URLs and structure may be restructured freely.

## 3. Locked decisions

| Area | Decision |
|---|---|
| CMS | **Sanity** — embedded Studio at `/studio`, hosted dataset |
| Bilingual | **`/he` + `/en` routes** via **next-intl**, Hebrew default, `/` → `/he` |
| Component layer | **CVA** (class-variance-authority) + **selective Radix** for interactive a11y |
| Scope | **Full refactor** of all existing routes |
| Risk posture | Pre-launch — aggressive restructure allowed |
| `app/design` route | Kept as **dev-only** playground, excluded from prod (sitemap/robots/nav) |

## 4. Target architecture

```
app/
  [locale]/                    he | en (Hebrew default)
    layout.tsx                 server: <html lang dir>, fonts, NextIntlClientProvider, JSON-LD
    page.tsx                   home (SERVER)
    catalog/ portfolio/ showcase/ careers/ finishing/
    blog/page.tsx  blog/[slug]/page.tsx
  studio/[[...tool]]/page.tsx  embedded Sanity Studio (client editing UI)
  api/draft-mode/enable/route.ts
  api/draft-mode/disable/route.ts
  sitemap.ts  robots.ts        both locales + blog posts from CMS
  globals.css                  UNCHANGED brand tokens (design source of truth)
  design/                      dev-only playground (excluded from prod)
components/
  ui/                          PRIMITIVES: Button, Card, Badge, Container, Section,
                               Heading, Eyebrow, Link, Icon
  sections/                    composed page sections (Hero, DualJourney, Faq, …) — server by default
  interactive/                 client islands: MobileDrawer, LangMenu, StickyContact
lib/
  cn.ts                        clsx + tailwind-merge
  utils.ts
sanity/
  schemaTypes/                 home, faqItem, capability, post, product, siteSettings, …
  client.ts  live.ts  image.ts  env.ts  queries.ts
i18n/
  routing.ts  request.ts  navigation.ts
messages/
  he.json  en.json             UI chrome strings (nav, buttons) — page content is in Sanity
proxy.ts                       locale middleware (renamed from middleware.ts in Next 16)
sanity.config.ts
```

> Note: `components/`, `lib/`, `sanity/`, `i18n/`, `messages/` move to the repo root
> (out of `app/`), keeping `app/` route-only. `@/*` alias already supports this.

## 5. Server / client component strategy

Default to **server components**. Mark `"use client"` only at the leaf that owns state,
an effect, a ref, or a browser API. Server-fetched content is passed into client islands
as props.

### Audit of current components

| Component | Now | Target | Reason |
|---|---|---|---|
| `app/page.tsx` | client | **server** | Language → URL removes the only `useState` |
| `Hero` | server-ish | **server** | Presentational; keep `priority` on hero image only |
| `CallToAction`, `Footer`, `TechnicalExcellence` | mixed | **server** | Presentational |
| `DualJourney` | client | **client island** | Scroll-timeline ref; receives content as props. **Remove `priority` from below-fold rows** |
| `Faq` | client | **server** (native `<details>` or Radix Accordion island) | Removes JS, gains a11y |
| `Header` | mixed | **server shell + `LangMenu`/drawer trigger islands** | Static nav is server |
| `MobileDrawer` | client | **client island** (Radix Dialog) | Focus trap, ESC, ARIA for free |
| `LangPill` → `LangMenu` | client | **client island** (Radix DropdownMenu or links) | Locale switch = `<Link>` to other route |
| `StickyContact` | client | **client island** | Scroll-driven visibility |
| `careers/*`, `finishing/*` | mixed | **mostly server** | Audited file-by-file in the plan |
| `placeholder/*` | client | replaced by real CMS-driven pages | — |

## 6. Design system — CVA + selective Radix

Primitives live in `components/ui/`, built **entirely from the existing `globals.css`
tokens** — no new colors, no visual change. Variants are typed.

```ts
// components/ui/button.tsx  (illustrative)
const button = cva(
  "inline-flex items-center justify-center gap-3 rounded-[5px] font-sans font-bold " +
  "tracking-[0.08em] transition-colors duration-300 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:   "bg-ink border border-ink text-bone hover:bg-bone hover:text-ink",
        secondary: "border border-ink text-ink hover:bg-ink hover:text-bone",
        ghost:     "text-ink hover:text-cyan-deep",
      },
      size: { sm: "px-6 py-3 text-[13px]", md: "px-8 py-4 text-[14px]", lg: "px-10 py-5 text-[14px]" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)
```

This replaces the duplicated button markup in `Hero`, `CallToAction`, etc. with one typed
source. Same rules for `Card`, `Badge`/`Eyebrow`, `Container`, `Section`, `Heading`.

- `lib/cn.ts` = `clsx` + `tailwind-merge` for safe class composition.
- **Radix only where a11y is hard:** `Dialog` (mobile drawer), `Accordion` (FAQ),
  `DropdownMenu` (language). All other markup stays hand-rolled.

## 7. CMS — Sanity

- **`next-sanity`** client + **embedded Studio at `/studio`** (catch-all route). The client
  logs in there; no separate deployment.
- **Schemas** mirror the current `app/content/*.ts` shapes: `siteSettings`, `home`,
  `faqItem`, `capability`, `journeyPanel`, `post` (blog), `product` (catalog/portfolio).
  Migrating an existing `content/*.ts` module = one schema + one GROQ query returning the
  same TypeScript type the components already consume (the planned CMS seam).
- **Localization:** `@sanity/document-internationalization` (document-level he/en). Each
  `/he` and `/en` page fetches its locale's document; the two are linked for hreflang.
- **Images:** uploaded to Sanity, served from Sanity's CDN with `auto=format` (AVIF/WebP) +
  on-the-fly resize + **LQIP blur placeholder** fed into `next/image`. This retires the
  1.7 GB local `public/images` folder and removes on-the-fly `_next/image` PNG transcoding.
  `cdn.sanity.io` added to `next.config` `images.remotePatterns`.
- **Editing UX:** Draft Mode + Visual Editing (`SanityLive`, stega overlays) so the client
  previews edits live. `stega: false` in `generateMetadata` fetches.
- **Env:** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`.

## 8. i18n — next-intl

- `i18n/routing.ts` via `defineRouting({ locales: ['he','en'], defaultLocale: 'he' })`.
- `proxy.ts` (Next 16's renamed middleware) via `createMiddleware(routing)`.
- `[locale]` segment + `generateStaticParams` → both locales statically rendered.
- `messages/{he,en}.json` hold **UI chrome** strings only; editorial copy comes from Sanity.
- `app/[locale]/layout.tsx` sets `<html lang={locale} dir={locale==='he'?'rtl':'ltr'}>`.
- next-intl navigation wrappers (`Link`, `useRouter`) keep locale in the URL automatically;
  the language switcher links to the same page in the other locale.

## 9. SEO baseline

- `generateMetadata` per route — localized `title`, `description`, Open Graph — plus
  `alternates.canonical` and `alternates.languages` (**hreflang** for he/en + `x-default`→he).
- `app/sitemap.ts` — both locales × all routes + blog posts/products from Sanity.
- `app/robots.ts` — allow, point to sitemap, disallow `/studio` and `/design`.
- **JSON-LD** — `Organization` + `LocalBusiness` (Beeri Packaging, est. 1964, address,
  contact) site-wide; `Article` on blog posts; `BreadcrumbList` on deep pages.

## 10. Accessibility baseline — WCAG 2.1 AA

- Skip-to-content link; semantic landmarks (`header`/`nav`/`main`/`footer`).
- Radix manages focus trap / ESC / ARIA for drawer, accordion, menu.
- **Contrast audit** of brand-token pairs (e.g. `clay` on `bone`, `cyan-deep` on `yellow`);
  adjust token *usage*, not the palette, if any pair fails 4.5:1 (3:1 for large text).
- Visible `focus-visible` rings on all interactive primitives.
- Required `alt` field on every Sanity image; decorative images get `alt=""`.
- RTL via logical properties (already enforced); `prefers-reduced-motion` (already honored).
- Verified with the `design:accessibility-review` skill + automated axe checks.

## 11. Performance baseline → ~100

- Server components ship far less JS (the in-page language toggle is gone).
- Sanity-CDN images (pre-optimized AVIF/WebP + LQIP) replace giant local PNGs.
- **Hero is the only `priority` image**; below-fold images lazy-load (the LCP fix already
  diagnosed at `DualJourney.tsx:83`). Journey image `quality` trimmed 90 → ~75.
- Verified by a production-build Lighthouse run at the end (target: Perf ≈100, A11y 100,
  SEO 100, Best-Practices 100).

## 12. New `AGENTS.md` (outline)

Rewritten to document the **target** architecture as the contract:
stack & versions · folder map (routes vs `components/ui` vs `sections` vs `interactive`) ·
**server-first rule** & when `"use client"` is allowed · **design-system usage** (use
primitives + variants, never re-hardcode button/card classes) · **i18n rule** (content from
Sanity, chrome from `messages/`, never hard-code strings) · **Sanity workflow** (schema →
query → typed component) · SEO & a11y checklists · image rule (Sanity CDN, not `public/`) ·
**verification gates** (below) · commands.

## 13. Verification & testing strategy ("done correctly + tested")

Every phase must pass these gates before it is considered complete:

| Gate | Tool | Threshold |
|---|---|---|
| Types | `tsc --noEmit` | 0 errors |
| Lint | `next lint` | 0 errors |
| Build | `next build` | succeeds |
| **Pixel-match** | preview screenshots before/after each migrated page | visually identical |
| Unit | **Vitest** — `cn()`, GROQ query builders, locale helpers | green |
| E2E smoke | **Playwright** — `/he` & `/en` load, nav works, language switch routes correctly, drawer/FAQ keyboard-operable | green |
| Performance | **Lighthouse** (production build) | Perf ≈100 |
| Accessibility | **axe** + `design:accessibility-review` | 0 serious violations, A11y 100 |
| SEO | metadata + hreflang + sitemap present | SEO 100 |
| i18n | no missing message keys; both locales render | pass |

Test harness (Vitest + Playwright + Lighthouse assertion) is itself part of the baseline,
so future development inherits the same gates.

## 14. Implementation phases (each ends at its verification gate)

1. **`AGENTS.md` rewrite** — the contract lands first.
2. **Tooling/config** — install cva, clsx, tailwind-merge, next-intl, next-sanity,
   @sanity/*; add `lib/cn`, `i18n/routing`, `proxy.ts`, `messages/*`; set up Vitest +
   Playwright + Lighthouse scripts.
3. **Route restructure** — move pages under `app/[locale]/` with a thin locale layout;
   design untouched. Gate: both locales render identically to today.
4. **UI primitives** — build `components/ui/*` from existing styles. Gate: pixel-match +
   Vitest.
5. **Home refactor** — sections use primitives, server/client split, perf fixes folded in.
   Gate: pixel-match + Lighthouse on home.
6. **Sanity foundation** — schemas, client, `/studio`, draft mode, visual editing; migrate
   **home** content first. Gate: client can edit home; queries typed.
7. **Migrate remaining pages** — catalog, portfolio, showcase, careers, finishing, blog —
   one at a time, each behind a pixel-match gate.
8. **SEO layer** — metadata, hreflang, sitemap, robots, JSON-LD. Gate: SEO 100.
9. **A11y pass** — audit + fixes. Gate: A11y 100, axe clean.
10. **Performance verify** — full production Lighthouse. Gate: Perf ≈100; iterate if short.

## 15. Assumptions

- `app/design` stays as a dev-only playground (excluded from prod).
- English copy is provisional; the bilingual *system* is built now, EN content filled via
  Sanity later.
- A Sanity project/org will be created (free tier is sufficient to start).

## 16. Risks & mitigations

- **Visual regression** → pixel-match gate on every migrated page.
- **Scroll-timeline animations** in `DualJourney` are CSS-driven (globals.css) — preserved;
  only the React wiring is isolated as an island.
- **Content migration effort** (existing `content/*.ts` → Sanity) → migrate page-by-page,
  keeping the typed shape identical so components are untouched.
- **RTL + Sanity Studio** → Studio UI is LTR (admin only); the public site stays RTL.

## 17. Out of scope (future)

- Real English editorial copy.
- Contact-form backend / email delivery.
- Analytics, A/B testing, blog content production.
