# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a server-first, bilingual `/about` page telling the Beeri Packaging company story (with the דפוס בארי parent group as backing), in the existing `/finishing` design language, and add it to the site menu.

**Architecture:** Mirror the existing page pattern: a typed bilingual content module (`app/content/about.ts`), an async server page (`app/[locale]/about/page.tsx`) wrapped in `PlaceholderShell`, and a `"use client"` design component (`app/components/about/AboutPageDesign.tsx`) plus two focused sub-components (timeline, logo wall). v1 renders entirely from `app/content/about.ts` (no new Sanity schema). Nav is added to the `site.ts` fallback **and** the Sanity `siteSettings` doc so it appears in dev and on live.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (brand tokens in `globals.css`), next-intl (he/en), Playwright + Vitest. Reference spec: `docs/superpowers/specs/2026-06-06-about-page-design.md`.

**Source of truth for copy & facts:** spec §4 (deck facts) and §5 (section copy). Final Hebrew copy is authored with the `hebrew-content-writer` skill; English mirrors it.

**Guardrails (spec §3):** no Oct-7 content; group heritage = 1950 (roots 1910) kept distinct from Beeri Packaging entity = 1964; no parent logo; brand tokens + `components/ui/` primitives + logical CSS only.

---

## Pre-flight

- [ ] **Create the feature branch** (carries the existing dirty working tree; we only stage About files when committing).

Run: `git checkout -b feat/about-page`
Expected: `Switched to a new branch 'feat/about-page'`

- [ ] **Confirm whether local dev reads nav from Sanity** (decides if Task 6b is needed for local visual verification).

Run: `test -f .env.local && grep -c "SANITY" .env.local || echo "no .env.local"`
Note the result; if Sanity is configured locally and a `siteSettings` doc exists, the bundled nav fallback is bypassed → Task 6b is required for the menu item to show.

---

## Task 1: Content module + types (`app/content/about.ts`)

**Files:**
- Create: `app/content/about.ts`

Defines the typed, bilingual copy for all 8 sections. Shape mirrors `app/content/finishing.ts`.

- [ ] **Step 1: Define the types and the bilingual record.**

```ts
import type { Lang } from "@/app/content/home";

export type AboutStat = { value: string; label: string; sub?: string };
export type AboutMilestone = { year: string; title: string; body: string };
export type AboutHeritageItem = { year: string; name: string; body: string };
export type AboutCapability = { step: string; title: string; body: string };
export type AboutStandard = { code: string; title: string; body: string };
export type AboutLogo = { src: string; name: string };
export type AboutLogoGroup = { title: string; logos: readonly AboutLogo[] };

export type AboutCopy = {
  eyebrow: string;                      // "אודות" / "About"
  title: readonly [string, string];     // two-line display title
  intro: string;                        // hero paragraph
  // Heritage / parent
  heritageEyebrow: string;
  heritageTitle: string;
  heritageBody: string;                 // group story (1950, roots 1910/1946)
  heritageItems: readonly AboutHeritageItem[];   // חרט 1910 · בצלאל 1946 · בארי 1950
  groupLinkLabel: string;               // "לאתר הקבוצה" / "Visit the group site"
  groupLinkHref: string;                // he/en group site URL
  // Timeline
  timelineEyebrow: string;
  timelineTitle: string;
  milestones: readonly AboutMilestone[]; // 1964, 2019, 2020, 2021, 2026
  // Stats
  statsEyebrow: string;
  statsTitle: string;
  stats: readonly AboutStat[];
  // Capabilities
  capsEyebrow: string;
  capsTitle: string;
  capsBody: string;
  capabilities: readonly AboutCapability[];
  capsFinishingCta: string;             // link label → /finishing
  capsCatalogCta: string;               // link label → /catalog
  // Quality
  qualityEyebrow: string;
  qualityTitle: string;
  standards: readonly AboutStandard[];  // ISO 9001, ISO 22000/FSSC
  // Clients
  clientsEyebrow: string;
  clientsTitle: string;
  clientsBody: string;
  clientGroups: readonly AboutLogoGroup[]; // food&bev, cosmetics&pharma
  // CTA
  ctaTitle: string;
  ctaPrimary: string;                   // contact dialog trigger label
  ctaSecondary: string;                 // → /catalog
};

export const aboutCopy: Record<Lang, AboutCopy> = {
  he: { /* authored from spec §5 + deck §4 via hebrew-content-writer */ },
  en: { /* mirrors he */ },
};
```

- [ ] **Step 2: Author full he + en content** from spec §4/§5 and the deck facts. Numerics verbatim: `7,900 מ"ר`, `3,000 מ"ר`, `~140` (100/40), `3+2` shifts, milestones `1964/2019/2020/2021/2026`, standards `ISO 9001` + `ISO 22000 / FSSC 22000`. `groupLinkHref`: `https://beeriprint.co.il` (he) / `https://en.beeriprint.co.il` (en). `clientGroups[].logos[].src` reference `/images/about/logos/<brand>.png` (filled in Task 5).

- [ ] **Step 3: Typecheck.**

Run: `npx tsc --noEmit`
Expected: 0 errors (record satisfies `Record<Lang, AboutCopy>`).

---

## Task 2: Server page + metadata (`app/[locale]/about/page.tsx`)

**Files:**
- Create: `app/[locale]/about/page.tsx`

v1 reads copy directly from `aboutCopy` (no Sanity about doc); chrome still comes from Sanity-with-fallback like every other page.

- [ ] **Step 1: Write the page.**

```tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { AboutPageDesign } from "@/app/components/about/AboutPageDesign";
import { aboutCopy } from "@/app/content/about";
import { getChrome, toChrome } from "@/sanity/queries";
import { pageSeo } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = aboutCopy[locale as Lang];
  const title = copy.title.join(" ");
  return { title, description: copy.intro, ...pageSeo(locale, "/about", title, copy.intro) };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = aboutCopy[lang];
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <AboutPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → 0 errors (will still error until Task 3 creates `AboutPageDesign`; acceptable mid-task, resolved after Task 3/4/5).

---

## Task 3: Design component shell + sections (`app/components/about/AboutPageDesign.tsx`)

**Files:**
- Create: `app/components/about/AboutPageDesign.tsx`

`"use client"`. Renders hero, heritage/parent, stats, capabilities, quality, CTA; delegates timeline → Task 4 and logo wall → Task 5. **Invoke the `frontend-design` skill before writing this** for design quality. Match `FinishingPageDesign.tsx`: `bg-bone`, `max-w-[1152px]` sections, `border-blueprint` cards, `font-display` headings in `text-blueprint`, `text-clay` body, cyan/yellow/magenta/purple accents, dark `bg-blueprint` data panels, the magenta eyebrow rule (`<span className="h-px w-24 bg-magenta" />`), logical CSS (`text-start`, `ms/me`, `ps/pe`), `dir` handling for he/en.

- [ ] **Step 1: Component signature + section scaffold.**

```tsx
"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { AboutCopy } from "@/app/content/about";
import type { Lang } from "@/app/content/home";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { AboutTimeline } from "@/app/components/about/AboutTimeline";
import { ClientLogoWall } from "@/app/components/about/ClientLogoWall";

export function AboutPageDesign({ copy, lang }: { copy: AboutCopy; lang: Lang }) {
  return (
    <div className="bg-bone">
      {/* 1 Hero, 2 Heritage/parent, 3 <AboutTimeline>, 4 Stats, 5 Capabilities,
          6 Quality, 7 <ClientLogoWall>, 8 CTA */}
    </div>
  );
}
```

- [ ] **Step 2: Build the hero** — eyebrow (magenta rule + `copy.eyebrow`), `<h1>` from `copy.title` (`font-display text-[64px] sm:text-[82px] md:text-[96px] text-blueprint`), intro `copy.intro` in `text-clay`. RTL-correct alignment.

- [ ] **Step 3: Build the heritage/parent section** — `copy.heritageEyebrow/Title/Body`, three `copy.heritageItems` cards (year as `font-display` numeral), and the outbound group link:

```tsx
<a href={copy.groupLinkHref} target="_blank" rel="noopener noreferrer"
   className="... focus-ring">{copy.groupLinkLabel}</a>
```

- [ ] **Step 4: Build stats** — `copy.stats` as big-numeral cards (one highlighted on `bg-yellow` or `bg-blueprint text-bone`), `value` in `font-display`, `label`/`sub` in uppercase `font-sans tracking-[0.08em]`.

- [ ] **Step 5: Build capabilities** — `copy.capabilities` as a numbered row/grid (`step` + `title` + `body`), with two links: `Link href="/finishing"` (`copy.capsFinishingCta`) and `Link href="/catalog"` (`copy.capsCatalogCta`).

- [ ] **Step 6: Build quality** — `copy.standards` as two `border-blueprint` cards (`code` big, `title`, `body`).

- [ ] **Step 7: Build CTA** — copy `FinishingPageDesign` CTA block: `ContactTriggerButton` (cyan, `copy.ctaPrimary`) + `Link href="/catalog"` outline (`copy.ctaSecondary`).

- [ ] **Step 8: Typecheck + lint** — `npx tsc --noEmit && npm run lint` → 0 errors.

---

## Task 4: Timeline sub-component (`app/components/about/AboutTimeline.tsx`)

**Files:**
- Create: `app/components/about/AboutTimeline.tsx`

- [ ] **Step 1: Implement.** Props `{ eyebrow, title, milestones, lang }`. Horizontal connected timeline on `md+` (flex row, hairline `bg-rule` connector, year as `font-display` numeral on a `border-blueprint` node), vertical stack on mobile. Sequence must read right→left in he, left→right in en (set `dir` on the row; default DOM order = chronological). No Oct-7 entry — render exactly `copy.milestones`.

```tsx
import type { AboutMilestone } from "@/app/content/about";
import type { Lang } from "@/app/content/home";
export function AboutTimeline({ eyebrow, title, milestones, lang }:
  { eyebrow: string; title: string; milestones: readonly AboutMilestone[]; lang: Lang }) {
  return (/* section with eyebrow rule, h2, responsive milestone track */ null);
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` → 0 errors.

---

## Task 5: Client logo wall + assets (`app/components/about/ClientLogoWall.tsx`)

**Files:**
- Create: `app/components/about/ClientLogoWall.tsx`
- Create: `public/images/about/logos/*.png` (extracted from the deck)

Logos were unpacked to `/tmp/pptx_extract/ppt/media/` — slide 8 (food & beverage) = `image26–39`, slide 9 (cosmetics & pharma) = `image40–49`.

- [ ] **Step 1: Identify each logo.** View the logo images (and the two rendered logo-wall slides for context) to map each `imageNN` → brand name. Discard any that are decorative/non-logo or too low quality to display.

- [ ] **Step 2: Copy + rename usable logos** to `public/images/about/logos/<brand>.png` (kebab-case brand names). Record the final list (src + display name) in `aboutCopy.clientGroups` (Task 1, both locales — same `src`, localized group `title`, brand `name` as-is).

```bash
mkdir -p public/images/about/logos
# per identified logo, e.g.:
cp /tmp/pptx_extract/ppt/media/image44.png public/images/about/logos/strauss.png
```

- [ ] **Step 3: Implement the wall.** Props `{ eyebrow, title, body, groups, lang }`. Each group: a label + a responsive grid of contained logo tiles (`bg-sand` or `bg-bone`, `border-rule`), `next/image` with width/height, `alt={logo.name}`, `object-contain`, lazy by default. Normalize visual weight (consistent tile size; optional grayscale→color on hover).

- [ ] **Step 4: Typecheck + lint** — `npx tsc --noEmit && npm run lint` → 0 errors.

> **Honesty note:** if some logos are low-res/white-box JPEGs that can't be cleaned acceptably, drop them from v1 and list them in the plan's follow-ups rather than shipping a broken-looking tile.

---

## Task 6: Add to the menu + sitemap

### 6a — code fallback + sitemap

**Files:**
- Modify: `app/content/site.ts:35-39` (navLinks)
- Modify: `lib/site.ts:14-21` (ROUTES)

- [ ] **Step 1: Add the nav link.** In `app/content/site.ts`, append to `navLinks`:

```ts
export const navLinks: readonly NavLink[] = [
  { he: "השבחות", en: "Finishing", href: "/finishing" },
  { he: "יומן", en: "Journal", href: "/careers" },
  { he: "קטלוג", en: "Catalog", href: "/catalog" },
  { he: "אודות", en: "About", href: "/about" },
];
```

- [ ] **Step 2: Add the sitemap route.** In `lib/site.ts`, add `"/about"` to `ROUTES` (e.g. after `"/catalog"`).

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` → 0 errors.

### 6b — Sanity nav (only if Sanity provides nav in the target env)

`toChrome` (sanity/queries.ts:226) prefers the Sanity `siteSettings.navLinks` over the bundled fallback. If the live site (or local dev) reads nav from Sanity, the menu item won't appear until the `siteSettings` doc is patched for **both** locales.

- [ ] **Step 1:** Reuse the existing writeClient/seed script pattern in `scripts/` to append `{ he: "אודות", en: "About", href: "/about" }` to `siteSettings.navLinks` for `he` and `en` (idempotent: skip if an `/about` href already present). If the Sanity write token is unavailable in this environment, **stop and report**: the route + fallback nav are done, but the live menu requires this patch (via the script or the Studio at `/studio`).

- [ ] **Step 2: Verify** the patched docs return the About link (re-run `getChrome` path or query Sanity).

---

## Task 7: Tests

**Files:**
- Create: `e2e/about.spec.ts`
- Create: `app/content/about.test.ts`

- [ ] **Step 1: Write the content-shape unit test (failing first).**

```ts
import { describe, it, expect } from "vitest";
import { aboutCopy } from "@/app/content/about";

describe("aboutCopy", () => {
  it("has he and en with identical key sets", () => {
    expect(Object.keys(aboutCopy.he).sort()).toEqual(Object.keys(aboutCopy.en).sort());
  });
  it("has 5 milestones in each locale and no Oct-7 entry", () => {
    for (const lang of ["he", "en"] as const) {
      expect(aboutCopy[lang].milestones).toHaveLength(5);
      const blob = JSON.stringify(aboutCopy[lang].milestones);
      expect(blob).not.toMatch(/7\.10\.2023|השבת השחורה|October 7/i);
    }
  });
  it("links the parent group site", () => {
    expect(aboutCopy.he.groupLinkHref).toContain("beeriprint.co.il");
    expect(aboutCopy.en.groupLinkHref).toContain("beeriprint.co.il");
  });
});
```

- [ ] **Step 2: Run it** — `npm run test -- about` → FAILS before Task 1 content is complete, PASSES after.

- [ ] **Step 3: Write the e2e test (both locales).**

```ts
import { test, expect } from "@playwright/test";

for (const { locale, h1, nav } of [
  { locale: "he", h1: /בארי אריזות/, nav: "אודות" },
  { locale: "en", h1: /Beeri Packaging|About/, nav: "About" },
]) {
  test(`about page renders (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/about`);
    await expect(page.locator("h1").first()).toBeVisible();
    // parent group outbound link opens in a new tab with rel=noopener
    const group = page.getByRole("link", { name: /beeriprint|הקבוצה|group site/i }).first();
    await expect(group).toHaveAttribute("rel", /noopener/);
    await expect(group).toHaveAttribute("href", /beeriprint\.co\.il/);
  });

  test(`about is in the menu (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.getByRole("link", { name: nav }).first()).toBeVisible();
  });
}
```

- [ ] **Step 4: Run e2e** — `npm run test:e2e -- about` → PASS in both locales. (The menu test depends on Task 6 nav resolution in the test env.)

---

## Task 8: Full verification + visual proof

- [ ] **Step 1: Gates.**

Run: `npm run lint && npx tsc --noEmit && npm run build && npm run test`
Expected: all pass, 0 errors.

- [ ] **Step 2: Visual verification** via the preview tools: start dev, load `/he/about` and `/en/about`, snapshot each, check console/network for errors, confirm all 8 sections render, the menu shows אודות/About, RTL (he) and LTR (en) are correct, and the logo wall images load. Capture screenshots as proof.

- [ ] **Step 3: Fix any issues found**, then re-verify the affected locale.

---

## Self-review (done at write time)

- **Spec coverage:** §5 sections 1–8 → Tasks 3/4/5; plumbing §6 → Tasks 1,2,6; logos §7 → Task 5; SEO/i18n §8 → Task 2 (`pageSeo`) + Task 6a (ROUTES); verification §9 → Tasks 7,8. Covered.
- **Guardrails:** Oct-7 exclusion asserted by a test (Task 7); 1950 vs 1964 separated in content (Task 1 from spec §4); no parent logo (Task 5 uses client logos only). Covered.
- **Type consistency:** `AboutCopy` field names defined in Task 1 are the ones consumed in Tasks 2–5; sub-component prop names match (`milestones`, `groups`). 
- **Known external dependency:** Task 6b needs a Sanity write token; if absent, the menu addition is code-complete but must be applied in the CMS — flagged, not silently skipped.
- **Commits:** per the user's environment ("commit only when asked") and the dirty tree, commits are deferred; the branch is created so an explicit later commit stages only About files.
