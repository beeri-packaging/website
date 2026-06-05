# Beeri Packaging — Parent Company ("דפוס בארי") Mention

**Design spec** · 2026-06-05 · Status: **approved (pending spec review)**

Add a tasteful, accurate mention of the parent company **דפוס בארי / Beeri Print Group**
to the Beeri Packaging marketing site as **one focused homepage section** — a "Part of the
Beeri Print Group" credibility band. The goal is to put a genuine B2B trust asset to work,
simply, in a single clear treatment — without making the site about the parent and without
touching sensitive territory.

---

## 1. Goal

The client (בארי אריזות) is a subsidiary of דפוס בארי and wants the relationship
mentioned. The parent is a real credibility asset for a packaging buyer: a 70+-year-old
national printing institution. We surface that backing in one compact, professional
homepage section.

## 2. Non-goals / constraints (handle with care)

- **No October 7 / תקומה content.** Tone is **corporate-credibility only**. The resilience
  story is powerful but tragic and is explicitly out of scope for this work.
- **Two founding years stay distinct.** The **group is "since 1950"**; **Beeri Packaging is
  "since 1964."** Never blur or merge them.
- **No parent logo** until the client confirms they hold the asset and have permission to
  use it. Until then, a text wordmark only.
- **Not a parent microsite, no About page.** We mention and link out; we do not build a
  dedicated company/About page or retell the full parent story.
- Follow `AGENTS.md`: server-first, `components/ui/` primitives, logical CSS, both locales
  from one component, no hardcoded strings outside the content files.

## 3. Locked decisions (from brainstorming)

| Question | Decision |
|---|---|
| How much weight | **Moderate** — one dedicated credibility section, not a one-liner, not a full page |
| Tone | **Corporate credibility only** — heritage, scale, capability, certifications; no Oct 7 |
| Placement | **One homepage section**, after the capabilities block, before the FAQ |
| About page / nav | **None** — simplified away; no new route, no nav item |
| Outbound link | Yes — to `beeriprint.co.il` (he) / `en.beeriprint.co.il` (en), new tab |
| Footer credit | **Optional** one-liner; client's call (see §5) |
| Logo | Text wordmark for now; logo lockup only if client provides asset + permission |

## 4. Verified research (basis for all copy)

Confirmed facts about the parent, used in the proof points below:

- **דפוס בארי / Be'eri Printers** — printing house at **Kibbutz Be'eri**, Negev, founded
  **1950**; the **first printing house in the Negev**, now one of Israel's leading printing
  houses (~70 years / "seven decades"). The kibbutz's main source of income; revenues
  estimated in the hundreds of millions of shekels/year.
- **Since 1992** it is **exclusively responsible for printing every Israeli driver's
  license**, plus secure/anti-counterfeit documents (checkbooks, certificates, credit/ID
  cards).
- Certified **ISO 9001** (since 1995) and **ISO/IEC 27001** (since 2017).
- **Relationship confirmed:** English Wikipedia lists Be'eri Printers' two subsidiaries as
  *Messer* (bulk mail) and **Be'eri Packaging** — so the existing site claim "part of
  קבוצת דפוס בארי" is accurate. (Hebrew sources also describe packaging arms *גרפיקה בצלאל*
  / *חרט תעשיות* under the group — brand-portfolio nuance, but the parent→subsidiary
  framing is sound.)

Sources: [Be'eri Printers — English Wikipedia](https://en.wikipedia.org/wiki/Be'eri_Printers) ·
[דפוס בארי — Hebrew Wikipedia](https://he.wikipedia.org/wiki/%D7%93%D7%A4%D7%95%D7%A1_%D7%91%D7%90%D7%A8%D7%99) ·
[Official "About" — beeriprint.co.il](https://beeriprint.co.il/about_us/) ·
[National Library of Israel](https://blog.nli.org.il/en/hoi_beeri-printers/)

## 5. Placement & integration

- **One new homepage section component** (e.g. `app/components/home/GroupBacking.tsx`),
  rendered in `app/[locale]/page.tsx` **after `TechnicalExcellence` (capabilities), before
  `Faq`.** Rationale: show what we do → show the backing behind it → answer questions → CTA.
- **No new route, no nav item, no mobile-drawer change, no sitemap change.**
- **Existing homepage `DualJourney`** heritage panel keeps its current "part of the Beeri
  Print group" sentence unchanged (now reinforced by the new section, not duplicated).
- **Footer credit — optional, client's call:** a single line in the footer brand column,
  **חברה בקבוצת דפוס בארי** / *A Beeri Print Group company*. If included, it links to the
  homepage section anchor (`/#group`). Default: include it; trivial to drop.

## 6. Section content (corporate-credibility tone)

- **HE** — eyebrow `קבוצת דפוס בארי`, title `חברה בקבוצת דפוס בארי`
  > בארי אריזות היא חברה בקבוצת דפוס בארי — מבתי הדפוס המובילים בישראל, הפועל מקיבוץ בארי
  > שבנגב משנת 1950. החיבור הזה מעמיד מאחורי כל הזמנה ידע עמוק בדפוס, תשתית ייצור רחבה
  > ותקני איכות ואבטחה מהמחמירים בתעשייה.
- **EN** — eyebrow `Beeri Print Group`, title `A Beeri Print Group company`
  > Beeri Packaging is part of the Beeri Print Group — one of Israel's leading printing
  > houses, operating from Kibbutz Be'eri in the Negev since 1950. That backing puts deep
  > print know-how, broad manufacturing capacity, and some of the industry's most rigorous
  > quality and security standards behind every order.

**Three proof points** (group/parent credentials — correct attribution):

| HE | EN |
|---|---|
| מעל 70 שנות מומחיות בדפוס | 70+ years of print expertise |
| מדפיסה את רישיונות הנהיגה בישראל מאז 1992 | Sole printer of Israel's driver's licenses since 1992 |
| מוסמכת ISO 9001 ו‑ISO 27001 | ISO 9001 & ISO 27001 certified |

**Outbound link:** `לאתר הקבוצה` / `Visit the group site` →
`https://beeriprint.co.il` (he) / `https://en.beeriprint.co.il` (en),
`target="_blank" rel="noopener noreferrer"`.

## 7. Content plumbing (matches existing patterns)

- **Extend `app/content/home.ts`** — add a `groupBacking` block (eyebrow, title, body, three
  proof points, link label) in the same `Record<Lang, …>` shape the home copy already uses.
  Keeps the new section consistent with how the rest of the homepage is authored, and ready
  for the same Sanity fallback the home content already supports.
- **Extend `app/content/company.ts`** — reuse existing `groupHe` / `groupEn`; add:
  - `groupFoundingYear: 1950`
  - `groupSiteUrlHe: "https://beeriprint.co.il"`, `groupSiteUrlEn: "https://en.beeriprint.co.il"`
- **`app/content/site.ts`** — only if the optional footer credit is included: add a
  `footerGroupCredit` he/en pair.
- *Optional follow-up (not first pass):* surface the `groupBacking` copy in Sanity with
  bundled fallback, mirroring how `home` content already works.

## 8. SEO

- Extend the Organization JSON-LD (in the locale layout / `JsonLd` component) with
  **`parentOrganization`** → `{ "@type": "Organization", name: "Be'eri Printers" / "דפוס בארי",
  url: "https://beeriprint.co.il", foundingDate: "1950" }`. Schema.org-correct way to declare
  the relationship; reinforces it for search engines. (Site-level — independent of the section.)
- No new route ⇒ no sitemap or per-page metadata changes.

## 9. Components / build discipline

- New section is a **server component** (static content + links; no client JS).
- Reuse `components/ui/` primitives: `Section`, `Container`, `Heading`, `Eyebrow`, `Card`
  (for proof points), `Link`. No re-hardcoded buttons/cards.
- Logical CSS (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start/end`) so RTL (he) and LTR (en) both
  render correctly.
- Proof points as a simple responsive row of cards; stacks on mobile.
- Section visual language matches the surrounding homepage bands (brand tokens only).

## 10. Verification gates

- `npm run lint` and `tsc --noEmit` — 0 errors
- `npm run build` — succeeds
- `npm run test` (Vitest) — green
- `npm run test:e2e` (Playwright) — green; the **group section renders on both `/he` and
  `/en`** homepages, in the right order (after capabilities, before FAQ); outbound link has
  `rel="noopener"`; optional footer credit (if present) links to `/#group`
- A11y: WCAG 2.1 AA; no serious axe violations on the homepage
- Perf: production Lighthouse ≈ 100 on the homepage (section is static, no regression)
- Visual: section reads as professional and on-brand; RTL/LTR both correct

## 11. Out of scope (YAGNI)

- October 7 / תקומה narrative
- Dedicated About page / route / nav item (simplified away)
- Parent logo / logo lockup (until asset + permission confirmed)
- Deep multi-section company/history page
- Sanity-editability of the section copy (optional follow-up only)
- Any change to the parent's own properties or a separate microsite
