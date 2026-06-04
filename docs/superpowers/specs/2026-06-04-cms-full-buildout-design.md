# Beeri Packaging — Full CMS Build-out

**Design spec** · 2026-06-04 · Status: **approved (pending spec review)**

Extend the existing Sanity foundation from "Home only, unseeded" to a **complete,
preloaded, client-editable CMS** covering every real page in both Hebrew and English —
**without changing the visual design**.

Builds on `2026-06-04-website-foundation-design.md`, which established the server-first /
i18n / Sanity / SEO baseline. That spec wired Home to Sanity; this spec finishes the job
for the rest of the site and preloads all content + images.

---

## 1. Goals

1. **Every real page is CMS-editable** — Home, Careers, Finishing, Blog (index + posts),
   plus global Site Settings (header/nav/footer/contact/social).
2. **Preloaded content** — both `he` and `en` are seeded so the client opens Studio and
   sees everything already filled, ready to edit. No empty dataset.
3. **Images in Sanity** — the 15 images actually used on the site are uploaded to the
   Sanity CDN and referenced from the CMS; the client can swap them in Studio.
4. **Organized, client-friendly Studio** — Hebrew field labels, help text, grouped desk,
   previews and validation, tuned for a non-technical Hebrew-speaking editor.
5. **Fail-soft everywhere** — every CMS read falls back to the bundled copy, so a Sanity
   outage or an empty field never breaks the site or the build.

## 2. Non-goals / constraints

- **The design does not change.** Same layout, colors, type, spacing, animation. Every
  migrated page is verified against the current render.
- **No new pages or features.** This is a content-plumbing + seeding effort, not new UI.
- `/showcase` (the 49-image demo gallery) stays on bundled assets — it is a demo gallery,
  not client-editable marketing content.
- Catalog & Portfolio stay as **editable "coming soon" placeholder pages**, not real
  product/project collections (their page designs don't exist yet).
- Stay within the **Sanity free tier** — comfortably met (15 images ≈ 16 MB; one editor).

## 3. Locked decisions (from scoping Q&A)

| Area | Decision |
|---|---|
| Scope | All real pages (Home, Careers, Finishing, Blog) + global Site Settings; Catalog/Portfolio remain editable placeholders |
| Bilingual modeling | **Document-level i18n** via `@sanity/document-internationalization` (mirrors Home; one document per locale, linked by `translation.metadata`) |
| Images | **External — Sanity CDN.** Upload the 15 referenced images; render via Sanity transform URLs (no Vercel image-optimizer usage) |
| Studio UX | **Hebrew labels + help text + organized desk.** Field *code* names stay English; only what the client sees is Hebrew |
| Editor access | Client adds a Sanity **Editor token** to `.env.local` (e.g. `SANITY_API_WRITE_TOKEN`); seed scripts use it. Current token is read-only (Access Manager) and cannot write |
| Migration strategy | **Mirror the Home pattern** (Approach A): schema mirrors `app/content/*.ts` 1:1, GROQ query + `toXCopy` mapper with fail-soft fallback, page fetches and passes content into existing client islands |
| Bundled copy | **Kept** as the typed fail-soft fallback and the source of truth for seeding — not deleted |

## 4. Current state (baseline)

- Sanity is wired: `client.ts`, `env.ts` (project `4qkb39ql` / `production`), `image.ts`,
  `live.ts` (draft preview), embedded Studio at `/studio`, `structure.ts` desk.
- Schemas exist **for Home only**: `home` (internationalized), minimal `siteSettings`
  (title/email/address stub), objects `capability`, `faqItem`, `journeyPanel`, `navLink`.
- `app/[locale]/page.tsx` reads Home via `getHome` / `toHomeCopy` with fail-soft fallback.
- **The dataset is empty** — nothing seeded; the site runs 100% on bundled copy.
- `scripts/seed-home.ts` exists but covers Home only and needs a write token.
- Careers, Finishing, Blog read bundled `app/content/*.ts` **directly inside client
  components**. Shared chrome (header/footer/drawer/sticky-contact) is rendered by
  `PlaceholderShell` (client) and the Home page, both sourcing chrome from the Home copy.
- Images: ~1.6 GB in `public/images`; only 15 files are actually referenced by content.

## 5. Schema architecture

All page documents use **document-level internationalization** (one doc per locale,
linked by `translation.metadata`), consistent with `home`.

### 5.1 Documents (internationalized he + en)

| Type | Mirrors | Notes |
|---|---|---|
| `home` *(exists)* | `app/content/home.ts` | **Chrome fields move out** to `siteSettings` (see 5.3) |
| `careers` | `app/content/careers.ts` `CareersCopy` | arrays: `careersArticle[]`, `careerRole[]`, filters, newsletter; images: feature, materials |
| `finishing` | `app/content/finishing.ts` `FinishingCopy` | `finishingItem` (feature/deboss/texture, each with image), `finishingMetric[]`, quote, CTA cards |
| `post` | `app/content/blog.ts` `BlogPost` | many docs; `slug`, `date`, `read`, `category` (enum), optional `image`, `title`/`excerpt`/`body[]` |
| `placeholderPage` | `app/content/placeholder.ts` `PlaceholderCopy` | one doc per route (`route` key: `catalog`/`portfolio`); eyebrow, title, lead, body, preview chips, CTAs |

### 5.2 Singletons (internationalized he + en)

| Type | Mirrors | Holds |
|---|---|---|
| `siteSettings` | chrome portion of `HomeCopy` + new | header labels (`menu`/`close`/`lang`/`contact`), `navLink[]`, footer (eyebrow, address, links, copyright), `socialLink[]`, contact details |
| `blogSettings` | `app/content/blog.ts` `BlogIndexCopy` + `categoryLabels` | blog-index copy (eyebrow, title, lead, body, comingSoon, readMore, backToBlog, publishedOn, notFound*) and per-locale category labels |

### 5.3 Chrome centralization

`menu`, `close`, `lang`, `contact`, `navLinks`, `footerEyebrow`, `footerAddr`,
`footerLinks`, `footerCopy` **move from `home` → `siteSettings`**. `SiteHeader`, `Footer`,
`MobileDrawer`, `StickyContact`, and `PlaceholderShell` consume a `Chrome` object sourced
from `siteSettings` (fetched on the server, passed as props). This removes the duplication
where every non-home page borrowed Home's chrome.

> This is the **only change that touches the already-working Home page**, so it is gated by
> a strict before/after pixel-match on Home in both locales.

### 5.4 New object types

`careerRole`, `careersArticle`, `finishingItem`, `finishingMetric`, `ctaCard`,
`socialLink`. Reuse existing `capability`, `faqItem`, `journeyPanel`, `navLink`. Blog
`category` is a fixed enum in the `post` schema (chip colors are code-bound in
`categoryChipClass`); the per-locale display labels live in `blogSettings`.

### 5.5 Image fields

Reuse the existing `imageField` helper pattern (Sanity asset + required `alt` +
`legacyImagePath` fallback). Hotspot enabled. All 15 referenced images are uploaded to the
CDN during seeding; `legacyImagePath` remains the fail-soft fallback if an asset is absent.

## 6. Studio organization (client-facing)

Desk grouped and Hebrew-titled with icons:

```
🏠 דף הבית            → home (he + en pair)
💼 קריירה             → careers (he + en pair)
✨ השבחות             → finishing (he + en pair)
📝 בלוג               → ▸ הגדרות בלוג (blogSettings singleton)
                         ▸ פוסטים (post list)
🚧 עמודי "בקרוב"      → catalog, portfolio (placeholderPage docs)
⚙️ הגדרות אתר         → siteSettings singleton (chrome/footer/contact/social)
──────
(default fall-through for anything else)
```

- Every field gets a Hebrew `title` + `description` (help text). Code `name`s stay English.
- Documents get meaningful `preview` (title/subtitle/media) so lists are scannable.
- Validation: required on the fields the design depends on; sensible `length()` on tuples
  (e.g. two-line titles), matching the current schema conventions.
- Singletons are pinned (fixed `documentId`) and not duplicable.

## 7. Data layer (`sanity/queries.ts`)

For each type: a `defineQuery` GROQ projection, an exported `Doc` type, an async
`getX(locale)` (try/catch → `null` on failure), and a pure `toXCopy(doc, locale)` mapper
that returns the **exact shape the components already consume**, falling back field-by-field
to the bundled copy. This is the established `getHome` / `toHomeCopy` pattern, repeated for
`careers`, `finishing`, `siteSettings` (→ `Chrome`), `blogSettings`, `post`, and
`placeholderPage`.

- Image projections resolve `asset->url` (+ LQIP `metadata.lqip`) and keep
  `legacyImagePath` as fallback, exactly as Home does today.
- `getAllPosts(locale)` for the blog index and sitemap; `getPost(slug, locale)` for a post.

## 8. Component / page refactor

Each page becomes an `async` **server component**: read `params.locale`, fetch its
document + `siteSettings`, and pass content as **props** into the existing client islands.
No island keeps a direct `app/content/*` import or `homeCopy[lang]` read.

| Page | Today | Change |
|---|---|---|
| `careers/page.tsx` | sync, `PlaceholderShell` + `CareersPageDesign` (client reads `careersCopy`) | async server: fetch `careers` + chrome; pass `copy`+`chrome` as props |
| `finishing/page.tsx` | sync, client reads `finishingCopy` | async server: fetch `finishing` + chrome; props |
| `blog/page.tsx` | sync, `BlogIndex` reads bundled | async server: fetch `blogSettings` + posts; props |
| `blog/[slug]/page.tsx` | reads `getBlogPost` bundled | async server: fetch `post` by slug+locale; `generateStaticParams`; props |
| `catalog`, `portfolio` | `placeholderContent.*` | async server: fetch `placeholderPage` by route; props |
| `PlaceholderShell` | client, reads `homeCopy[lang]` | takes `chrome` prop (from `siteSettings`); no bundled read |
| `SiteHeader`/`Footer`/`MobileDrawer`/`StickyContact` | take Home `t` | take `Chrome` sourced from `siteSettings` |

- Interactivity (careers search/filter, drawer state, sticky-contact scroll) stays in the
  client islands — only the **data source** changes (props instead of bundled import).
- Per-page `generateMetadata(locale)` pulls localized title/description from the CMS
  (with `stega: false`), replacing today's hard-coded Hebrew metadata.

## 9. Images

- Upload the 15 referenced files to the Sanity CDN during seeding (see §4 inventory:
  hero, 6 journey panels, finishing trio, careers feature/materials, bento, 2 logos).
- Render through **Sanity transform URLs** (`urlForImage(...).width(w).auto('format')`),
  not Next.js's optimizer, so neither Sanity nor Vercel paid quotas are touched.
- `cdn.sanity.io` added to `next.config` `images.remotePatterns` (covers any `next/image`
  usage that remains).
- LQIP blur-up: project `asset->metadata.lqip` and feed it as the blur placeholder.

## 10. Seeding

`scripts/seed-all.ts` — supersedes/extends `seed-home.ts`:

- **Idempotent**: deterministic `_id`s (`home-he`, `careers-en`, `post-<slug>-he`,
  `siteSettings-he`, …) + `createOrReplace`, so re-running overwrites cleanly.
- Uploads each referenced image **once** (cached by source path) and reuses the asset ref
  across documents/locales.
- Writes he + en for every type from the bundled `app/content/*.ts` modules.
- Creates a `translation.metadata` doc linking each he/en pair (per type) so Studio shows
  them paired.
- Reads the **Editor token** from `.env.local` (`SANITY_API_WRITE_TOKEN`, falling back to
  the existing var name if the client reuses it). Fails fast with a clear message if the
  token lacks write permission.
- Run: `npx tsx scripts/seed-all.ts`.

## 11. Verification gates

| Gate | Tool | Threshold |
|---|---|---|
| Types | `tsc --noEmit` | 0 errors |
| Lint | `npm run lint` | 0 errors |
| Build | `npm run build` | succeeds |
| Unit | `npm run test` (Vitest) — mappers/fallbacks | green |
| **Visual parity** | preview before/after each migrated page, both locales | design unchanged |
| i18n | both `/he` and `/en` render every page | pass |
| Seed | dataset populated; `*[]{_type}` returns all types for he+en | pass |
| Studio | `/studio` loads; desk grouped in Hebrew; client can edit a field and see it live | pass |
| Fail-soft | with CMS unreachable / empty field, page still renders bundled copy | pass |

## 12. Implementation phases (each ends at its gate)

1. **Editor token + image upload** — confirm write access; `scripts/lib/upload-images.ts`
   uploads the 15 files; verify assets exist. Gate: token writes; 15 assets present.
2. **Schemas + Studio org** — add all new schema types + objects; expand `siteSettings`;
   Hebrew labels; desk structure; register in `schemaTypes/index.ts`. Gate: Studio loads,
   types valid, `tsc`/`lint` clean.
3. **Data layer** — queries + `Doc` types + `getX`/`toXCopy` mappers with fail-soft for
   every type. Gate: unit tests on mappers green.
4. **Chrome centralization** — `siteSettings` → `Chrome`; refactor header/footer/drawer/
   sticky-contact + `PlaceholderShell`; remove chrome from `home`/`HomeCopy`. Gate: **Home
   pixel-match** both locales.
5. **Page migrations** — careers → finishing → blog index → blog post → catalog/portfolio,
   one at a time, each: page becomes async server, fetch + props, `generateMetadata`.
   Gate: per-page visual parity, both locales.
6. **Seed everything** — `scripts/seed-all.ts` for all types he+en; link translations.
   Gate: dataset fully populated; pages render from CMS (not just fallback).
7. **Image rendering** — Sanity transform URLs + LQIP + `next.config` remotePatterns.
   Gate: images load from `cdn.sanity.io`; no Vercel optimizer usage; visual parity.
8. **Full verification** — all gates in §11 across all pages and both locales.

## 13. Risks & mitigations

- **Home regression from chrome move** → strict Home pixel-match gate (phase 4) in both
  locales before proceeding.
- **Write token missing/insufficient** → seed fails fast with a clear message; blocked
  until the client adds an Editor token (the one external dependency).
- **Content drift** → bundled `app/content/*.ts` stays as both the seed source and the
  fail-soft fallback, so CMS and code can't silently diverge into a broken state.
- **Studio RTL** → Studio UI is admin-only and LTR; the public site stays RTL. Hebrew
  *labels* render fine inside the LTR admin.
- **Image quotas** → Sanity transform URLs avoid Vercel's optimizer; 16 MB of assets is
  negligible against the free tier.

## 14. Out of scope (future)

- `/showcase` gallery migration to CMS.
- Real Catalog (products) and Portfolio (projects) collections — modeled when those page
  designs exist.
- Contact-form backend / newsletter delivery.
- Blog editorial production beyond porting the existing placeholder posts.
