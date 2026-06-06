# Beeri Packaging — About page (אודות / About)

**Design spec** · 2026-06-06 · Status: **approved (pending spec review)**

A new `/about` route telling the Beeri Packaging company story, doubling as the
parent-company (**דפוס בארי / Beeri Print Group**) credibility showcase. Built from the
company deck (`מצגת חברה.pptx`) and the verified facts in `app/content/company.ts`, in the
existing server-first, bilingual (he/en) design language used by `/finishing` and `/catalog`.

This supersedes the 2026-06-05 decision ("no About page"): the client now wants a real,
dedicated About page. The earlier spec's **guardrails are carried forward** (see §3).

---

## 1. Goal

Give B2B buyers (cosmetics, food, beverage, pharma brand owners and procurement) a single,
credible page that answers "who is Beeri Packaging, what can they do, and who's behind
them." Surface the parent group as a heritage/scale asset, show real capability and quality
credentials, and prove traction with a client logo wall. End with a contact CTA.

## 2. Locked decisions (from brainstorming, 2026-06-06)

| Question | Decision |
|---|---|
| Build an About page? | **Yes** — new `/about` route, added to the menu |
| October 7 / השבת השחורה milestone | **Excluded** — corporate-credibility tone only |
| Client display | **Product gallery** — the deck has no client logos (slides 8–9 are product photos), so we show real packaging captioned by brand/sector instead of a logo wall |
| Page imagery | Use the deck's own assets: B&W heritage photos (heritage section) + machinery photos (capabilities) + factory floor (stats) |
| Leadership / team section | **Omitted for now** (deck bios are template placeholder; add later with verified bios + photos) |
| Founding/heritage framing | **Keep 1964 (verified registration) + show the 2019–2026 consolidation milestones** |
| Parent emphasis | Beeri Packaging is the subject; **דפוס בארי is the backing**, not the lead |
| CMS | Ship v1 from `app/content/about.ts`; full Sanity editability is an **optional follow-up** |
| Branch | New `feat/about-page` branch (a new page is beyond the current content-polish branch) |

## 3. Guardrails (carried from 2026-06-05 parent-company spec)

- **No October 7 / תקומה content.** Tone is corporate-credibility only.
- **Two heritage anchors stay distinct:** the **group/print heritage is 1950** (roots to
  1910); **Beeri Packaging the legal entity is 1964** (ח.פ. 520026113, registered
  28/04/1964, renamed בארי אריזות בע״מ in 2021). Never merge "1950" and "1964".
- **No parent logo** until the client confirms the asset + permission; text wordmark only.
- Don't make the site about the parent — mention, showcase the backing, and link out.
- Follow `AGENTS.md`: server-first, `components/ui/` primitives, brand tokens only, logical
  CSS, both locales from one component, no hardcoded strings outside the content file.

## 4. Source facts (from the deck; use verbatim where numeric)

All figures below come from `מצגת חברה.pptx` unless marked. These are the only facts used.

- **Ownership / identity** (slide 2): בארי אריזות, owned by דפוס בארי; Yavne, Paran 4
  industrial park.
- **Facility** (slide 2): **7,900 m²** production halls + HQ/management offices, plus
  **3,000 m²** logistics center (מרלו"ג).
- **People** (slide 2): **~140 employees** — 100 production, 40 staff.
- **Operations** (slide 2): continuous — **3 print shifts/day**, **2 finishing shifts/day**
  (die-cut, gluing, packing); short-to-medium runs.
- **Quality** (slides 2, 13): **ISO 9001:2015** (quality management) and **ISO 22000 /
  FSSC 22000** (food-safety management).
- **Specialization** (slide 5): end-to-end carton — structural design → pre-press → print →
  finishing/PREMIUM → die-cut → packing → distribution; offset **and** digital.
- **Group heritage** (slide 3): דפוס בארי founded **1950** (fully owned by Kibbutz Be'eri);
  roots via **גרפיקה בצלאל** (commercial print house from **1946**, Harpak family) and
  **דפוס חרט** (Warsaw **1910**; in Israel from **1936**, founded by שמעון נוימן on Nachalat
  Binyamin St., Tel Aviv).
- **Beeri Packaging entity** (`company.ts`, verified): registered **1964**.
- **Milestones** (slide 4, Oct-7 excluded): **2019** Kibbutz Be'eri acquires Graphica
  Bezalel · **2020** Graphica Bezalel acquires Heret · **2021** renamed בארי אריזות בע״מ ·
  **2026** full ownership by דפוס בארי.
- **Production array** (slides 10–12): offset — 2× Heidelberg + 1× Komori (6-color + lacquer,
  sheet); digital — HP Indigo **HP30 + HP35** (half-sheet); finishing — MGI, UV,
  emboss/deboss, digital silk, lamination; die-cutting — 3 full + 2 partial; gluing — 4
  lines; bonding — EF.
- **Clients** (slides 7–9): food & beverage (Strauss, Osem, Tnuva, Elite, SodaStream,
  Tempo, Wissotzky, Central Bottling, Max Brenner, wineries: Teperberg, Tabor, Recanati,
  Golan Heights, Castel, Barkan, …) and cosmetics & pharma (Moroccanoil, AHAVA/Dead Sea
  Labs, Dr. Fischer, GIGI, Altman, Amorphical, …). ~24 logo assets recoverable from the deck.

> **"200 years" claim (slide 3):** the deck's "over 200 years of experience" is a soft sum
> across the three print houses, not one entity's age. **Do not** use it as a hard stat;
> express heritage as "over a century of printing heritage" / "מורשת דפוס של למעלה ממאה שנה".

## 5. Page structure — 8 sections

Visual language matches `/finishing` (`FinishingPageDesign.tsx`): `bg-bone` page,
`max-w-[1152px]` sections, `border-blueprint` cards, Karantina (`font-display`) headings in
`text-blueprint`, Open Sans body in `text-clay`, cyan/yellow/magenta/purple accents, dark
`bg-blueprint` panels with `text-cyan` data. Final Hebrew copy refined via the
**hebrew-content-writer** skill; English mirrors it. Draft copy below is indicative.

1. **Hero** — eyebrow `אודות` / `About`; title `בארי אריזות`; intro pairing the
   specialization line with ownership.
   - HE (draft): *"בארי אריזות מתכננת ומייצרת אריזות קרטון מודפסות בהתאמה אישית — מקצה לקצה,
     תחת קורת גג אחת ביבנה. חברה בקבוצת דפוס בארי."*
   - EN (draft): *"Beeri Packaging designs and manufactures custom printed folding-carton
     packaging — end to end, under one roof in Yavne. A Beeri Print Group company."*

2. **מי אנחנו — heritage & the parent group** *(the parent section the client asked for)*.
   The Beeri Print Group story: דפוס בארי since 1950 (Kibbutz Be'eri), with roots via
   גרפיקה בצלאל (1946) and דפוס חרט (1910) → "over a century of printing heritage." Outbound
   link **`לאתר הקבוצה` / `Visit the group site`** → `https://beeriprint.co.il` (he) /
   `https://en.beeriprint.co.il` (en), `target="_blank" rel="noopener noreferrer"`. Optional
   three short heritage cards (חרט 1910 · בצלאל 1946 · בארי 1950).

3. **אבני דרך — milestones timeline.** Ordered: **1964** registered (ח.פ.) → **2019**
   Kibbutz Be'eri acquires Graphica Bezalel → **2020** Graphica Bezalel acquires Heret →
   **2021** renamed בארי אריזות בע״מ → **2026** full Defus Beeri ownership. Horizontal on
   desktop, vertical stack on mobile; year as `font-display` numeral, label as body. RTL: the
   sequence reads right-to-left in he, left-to-right in en. **Oct-7 milestone omitted.**

4. **במספרים — by the numbers.** Big-numeral cards (finishing-page stat style):
   `7,900 m²` production · `3,000 m²` logistics · `~140` employees (100/40 split as
   sub-label) · `3+2` print/finishing shifts · `1964` established. 1 highlighted card on
   `bg-yellow` or `bg-blueprint`.

5. **מה אנחנו עושים — end-to-end, under one roof.** High-level capability flow: structural
   design → pre-press → offset **& digital** print → finishing (MGI/UV/emboss/lamination) →
   die-cut → gluing → packing → logistics. Kept overview-level (no machine-by-machine list)
   with links to **`/finishing`** (finishing depth) and **`/catalog`** (products) so it does
   not duplicate them.

6. **תקני איכות — quality & food safety.** Two cards: **ISO 9001** (quality management) and
   **ISO 22000 / FSSC 22000** (food-safety management), each with the one-line explanation
   from slide 13. Reinforces suitability for food & cosmetics buyers.

7. **לקוחות — trusted by (product gallery).** The deck has **no client logos** — slides 8–9
   are product photography of real packaging Beeri made. So this is a 3×3 **product gallery**
   (`ProductGallery.tsx`): nine real product shots (Osem, Tabor, Moroccanoil, AHAVA, wine &
   gift sets, confectionery, premium, cosmetics, food) on contained white tiles, each
   captioned with brand + sector. Stronger B2B proof than logos, and uses assets the client
   owns.

8. **CTA** — reuse the `/finishing` CTA pattern: short heading + `ContactTriggerButton`
   (opens the global contact dialog) + outline `Link` to `/catalog`.
   - HE (draft): *"בואו נתכנן יחד את האריזה הבאה שלכם."*

## 6. Files (create / edit)

**Create**
- `app/content/about.ts` — `type AboutCopy`, nested item types, `aboutCopy: Record<Lang,
  AboutCopy>` (mirror `app/content/finishing.ts`). v1 source of truth.
- `app/[locale]/about/page.tsx` — async server page + `generateMetadata`; reads locale via
  `setRequestLocale`; wraps content in `PlaceholderShell`; uses `pageSeo(locale, "/about",
  title, description)`.
- `app/components/about/AboutPageDesign.tsx` — `"use client"` design component rendering the
  8 sections from `copy` + `lang`.
- `app/components/about/Timeline.tsx`, `ClientLogoWall.tsx` *(optional)* — split out if
  `AboutPageDesign` grows large (keep files focused).

**Edit**
- `app/content/site.ts` — add `{ he: "אודות", en: "About", href: "/about" }` to `navLinks`
  (renders in `Header` + `MobileDrawer` automatically).
- `lib/site.ts` — add `/about` to the `ROUTES` list (sitemap + hreflang).
- *(Optional, SEO)* the locale-layout Organization JSON-LD: add `parentOrganization`
  → `{ "@type": "Organization", name: "דפוס בארי" / "Be'eri Printers",
  url: "https://beeriprint.co.il", foundingDate: "1950" }`.

**Sanity (optional follow-up, not v1):** `about` document schema + `aboutQuery` + `getAbout`
+ `toAboutCopy` mapper with `aboutCopy` fallback, mirroring the finishing wiring; then a seed
entry. Until then the page renders entirely from `app/content/about.ts`.

## 7. Assets / logos

- **17 curated images extracted from the deck**, optimized (PIL) and committed under
  `public/images/about/`: 3 B&W heritage photos (`heritage/`), 5 machinery/floor photos
  (`production/`), 9 product shots (`products/`). The deck had **no logos** to extract.
- Heritage photos are low-res originals (~300px) → displayed small (triptych), grayscale; the
  vintage grain suits the heritage theme. Product shots sit on contained white tiles.
- **Hosting decision:** `public/images/about/` (build-time optimized, no CMS lag), consistent
  with how `/finishing` references `/images/generated/...`. Migrating these to Sanity is an
  optional follow-up.
- No parent logo asset is used (guardrail §3).

## 8. SEO & i18n

- Reachable at `/he/about` and `/en/about` automatically via `app/[locale]/about/`; no
  routing config changes.
- `generateMetadata` → localized title + description; `pageSeo()` supplies canonical,
  hreflang (he/en), and OpenGraph.
- `/about` added to sitemap via `ROUTES`.
- Hebrew copy follows SEO positioning in `docs/research/beeri-google-trends-seo-research.md`
  ("אריזות קרטון בהתאמה אישית") naturally; no keyword stuffing.

## 9. Verification gates (every change)

- `npm run lint` and `tsc --noEmit` — 0 errors
- `npm run build` — succeeds
- `npm run test` (Vitest) — green
- `npm run test:e2e` (Playwright) — green; `/he/about` and `/en/about` both render, all 8
  sections present, nav shows "אודות"/"About", outbound group link has `rel="noopener"`
- A11y: WCAG 2.1 AA, no serious axe violations; logo `alt` text present; timeline readable
- Perf: production Lighthouse ≈ 100 (static page; lazy/optimized logo images)
- Visual: RTL (he) and LTR (en) both correct; reads as on-brand vs `/finishing` & `/catalog`

## 10. Out of scope (YAGNI)

- October 7 / תקומה narrative.
- Leadership/team section (until verified bios + photos provided).
- Parent logo / logo lockup.
- Full Sanity editability of About copy (optional follow-up).
- The "200 years" claim as a hard stat.
- Re-writing "since 1964" copy elsewhere on the site (kept consistent; not expanded).
- A separate parent microsite or deep multi-page company history.

## 11. Open follow-ups (post-v1)

- Sanity schema + seed for About editability.
- Higher-quality logo assets for the few low-res/white-box ones.
- Leadership section once real content is available.
- Optional facility/production photography (via Sanity) for sections 4–5.
