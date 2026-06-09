# Insights (תובנות) — journal index page

**Date:** 2026-06-09
**Status:** Design — awaiting review
**Figma reference:** `rG47DaHUNqAnPtHiUATXDG`, node `388:238` ("RTL Hebrew v2 — קריירה / original style" — the careers bento, reused as the visual template)

## Summary

Stand up a real journal/blog **index page** at `/blog`, reusing the careers page's
bento-grid visual language but driven by blog posts. The page is renamed from the
current "יומן / Journal" to **"תובנות / Insights"**, and the main nav link (which today
mis-points to `/careers`) is repointed to it. The bento becomes a fuller, balanced grid
of ~6 post cards; the photos come from each post's own image, not the Figma placeholders.

## Goals

- A browsable journal index at `/blog` (today only `/blog/[slug]` detail pages exist).
- Reuse the careers bento look ("the same design"), adapted so the content makes sense
  for a journal rather than job listings.
- Rename the surface to **תובנות / Insights** across nav + index copy.
- A balanced, symmetric bento grid of ~6 cards (range 6–8, whichever reads best).
- Each card uses its post's real image and links to `/blog/[slug]`.

## Non-goals

- No changes to the article detail page (`/blog/[slug]`, `BlogArticle`).
- No changes to the careers page itself — its components stay untouched; we clone the
  visual language into new Insights components.
- No new CMS schema (posts + blogSettings already exist in Sanity).

## Naming & routing

- **Name:** `תובנות` (he) / `Insights` (en).
- **Route:** index at `/blog`; articles remain at `/blog/[slug]`.
- **Nav:** `app/content/site.ts` — change `{ he: "יומן", en: "Journal", href: "/careers" }`
  to `{ he: "תובנות", en: "Insights", href: "/blog" }`. Order unchanged
  (About · Finishing · Insights · Catalog).
- **Careers:** no longer surfaced in nav. The `/careers` route and its components are
  left in place (untouched) but unlinked.

## Page structure (`/blog`)

Mirrors the careers layout, minus the redundant list section:

1. **Hero** (`InsightsHero`) — eyebrow "תובנות", two-line display title, lead paragraph,
   and the search input. Search filters the bento posts client-side (by title/excerpt).
2. **Bento** (`InsightsBento`) — balanced grid of ~6 post cards (see layout below). Each
   card links to `/blog/[slug]`.
3. **Newsletter** (`InsightsNewsletter`) — "subscribe for new posts", reusing the existing
   Resend newsletter server action, with journal-appropriate copy.

The careers "Open Roles" list + filters + apply-dialog section is **dropped**: with all
posts shown in the bento it would be redundant. (Revisit if the journal grows enough to
warrant a paginated archive.)

## Bento layout (symmetric, 6 cards)

A balanced 12-column grid with clear hierarchy and no empty gaps:

- **Top band:** large **feature** card (image, cols 1–8, full height) + two stacked
  cards on the side (cols 9–12): a text card and a graphic/accent card.
- **Bottom band:** a row of **three equal** cards (cols 1–4 / 5–8 / 9–12), one of them
  image-led, the others text + "לקריאה".

Card visual treatments reuse the careers vocabulary (feature / plain / yellow-graphic /
image / accent), with the category chip colored via the existing `categoryChipClass`
map. The exact arrangement is finalized by **visual verification in the browser preview**
during implementation; 8 cards is acceptable if it tiles better, in which case 2 more
posts are added.

### Post → card mapping (newest first)

| Card | Post | Category → chip |
|---|---|---|
| feature (image) | שפת ההשבחות | trends → magenta |
| text (cyan) | האנטומיה של אריזת יין | structural → cyan |
| graphic (yellow) | חומרי קרטון בני-מיחזור | sustainability → yellow |
| image | דפוס דיגיטלי או אופסט | floor → purple |
| text/accent | *new post #5* | studio → gold |
| text/accent | *new post #6* | structural/trends |

## Content: new posts

We have 4 posts; the grid wants ~6. Add **2 new full bilingual posts** (he + en) to reach
6. Each new post needs the full `BlogPost` shape (slug, date, category, image, excerpt,
body, sections, quote) so its detail page is complete.

- **Copy:** written with the `hebrew-content-writer` skill for Hebrew; matching English.
- **Topics (proposed, packaging domain):** e.g. "מהסקיצה לדגם" (studio — from sketch to
  prototype) and "שטנץ ודייקאט" / die-cutting (floor or structural). Final topics chosen
  to balance category colors across the grid.
- **Images:** reuse existing assets from `public/images/generated/**` (no new asset
  generation); each post's `image` drives its card photo.
- **Seeding:** add to the static fallback in `app/content/blog.ts` **and** seed into
  Sanity via a `writeClient` script (token in `.env.local`). Required because
  `getAllPosts()` prefers Sanity docs when present and ignores the static list otherwise.

## Data flow & components

- `app/[locale]/blog/page.tsx` (**new**, server) — `setRequestLocale`, fetch
  `getAllPosts(lang)`, `getBlogSettings`/`toBlogIndexCopy`, `toCategoryLabels`,
  `getChrome`/`toChrome`; render inside `PlaceholderShell`; export `generateMetadata`
  (title/description from index copy) + `generateStaticParams` per locale; add JSON-LD if
  appropriate.
- `app/components/blog/InsightsPageDesign.tsx` (**new**, client) — holds search state,
  computes visible posts, composes the sub-components. Mirrors `CareersPageDesign`.
- `app/components/blog/InsightsHero.tsx` (**new**) — header + search input.
- `app/components/blog/InsightsBento.tsx` (**new**) — the balanced grid + card variants,
  each linking to `/blog/[slug]`, image from `post.image`, chip from `categoryChipClass`.
- `app/components/blog/InsightsNewsletter.tsx` (**new**) — wraps the existing newsletter
  action with insights copy. (Reuse the careers newsletter action/handler; do not fork
  the delivery logic.)

Posts are consumed as the existing `LocalizedPost` shape from `sanity/queries.ts`
(`slug, date, read, category, image, title, excerpt`).

## Copy changes

- `app/content/blog.ts` — `blogIndexCopy`: update eyebrow/title/lead from "יומן/Journal"
  to "תובנות/Insights"; add any new strings the index needs (e.g. read CTA already exists
  as `readMore`; newsletter strings; an editorial line if a non-post card is used).
- New newsletter copy (he + en): heading, body, email placeholder, CTA, success/error —
  modeled on the careers newsletter strings but about new posts.
- Optionally extend `toBlogIndexCopy` / `blogSettings` Sanity projection for new fields;
  acceptable to keep new strings static for v1.

## Photos

Every bento card image is `post.image` (real repo/CDN asset). No Figma placeholder paths
enter the code. Image-less card variants (text/graphic) render no photo, matching the
design.

## SEO

- Add `/blog` to `app/sitemap.ts` for both locales.
- `generateMetadata` on the index: localized title (תובנות / Insights) + lead as
  description; canonical + `he`/`en` alternates via the existing `pageSeo`/`alternatesFor`
  helpers.

## Verification gates

- `npm run lint` + `tsc --noEmit` — 0 errors
- `npm run build` — succeeds
- `npm run test` (Vitest) — green (extend `sanity/queries.test.ts` if mappers change)
- `npm run test:e2e` — `/he/blog` and `/en/blog` render; nav link resolves
- **Visual:** bento grid is balanced/symmetric at the target card count; verified in the
  browser preview for both locales (RTL + LTR)
- A11y: search input labeled; cards are real links; no serious axe violations
- Perf: production Lighthouse ≈ 100

## Open questions / risks

- **Card count 6 vs 8** — resolved visually during implementation.
- **List section dropped** — flagged; reinstated only if the user wants the archive.
- **Sanity seeding** — new posts must be seeded to Sanity, not just the static fallback,
  or they won't appear where Sanity has data. CDN cache means a 30–60s edit lag.
