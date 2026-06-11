# Anchor System + Journey Card Rewire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every major section across About / Journal / Finishing / Catalog a stable anchor id, and fix the home journey cards so their links match their labels (yellow "timeline" cards → `/about#timeline`, purple "process" cards → `#excellence`).

**Architecture:** Pure markup change — add `id` + `scroll-mt-[80px]` to existing `<section>` wrappers (the same pattern the home page already uses to clear the fixed 80px header), and change one `href` ternary in `DualJourney`. No new components, no content/Sanity changes, no visual changes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, next-intl `Link`, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-06-10-anchor-system-design.md`

**Branch:** `feat/anchor-system` (already created; spec committed).

---

### Task 1: Rewire journey card hrefs (TDD)

**Files:**
- Test (create): `app/components/home/DualJourney.test.tsx`
- Modify: `app/components/home/DualJourney.tsx:109-111`

- [ ] **Step 1: Write the failing test**

Create `app/components/home/DualJourney.test.tsx`. Follows the existing pattern in `app/components/blog/InsightsBento.test.tsx` (mock the i18n `Link` to a plain anchor). Additionally mock `@/lib/revealObserver` — `DualJourney`'s `useEffect` constructs an `IntersectionObserver`, which jsdom doesn't have.

```tsx
import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DualJourney } from "./DualJourney";
import type { HomeJourneyPanel } from "@/sanity/queries";
import { homeCopy } from "@/app/content/home";

// The i18n Link prepends the locale at runtime (next-intl's job). Mock it to a
// plain anchor so we can assert the raw path the component passes to it.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// jsdom has no IntersectionObserver; the reveal wiring is irrelevant here.
vi.mock("@/lib/revealObserver", () => ({
  createRevealObserver: () => ({ observe: vi.fn(), disconnect: vi.fn() }),
}));

function panel(key: string, accent: "purple" | "yellow"): HomeJourneyPanel {
  return {
    key,
    accent,
    theme: "dark",
    tagColor: accent === "yellow" ? "text-yellow" : "text-purple",
    tag: `Tag ${key}`,
    title: `Title ${key}`,
    body: `Body ${key}`,
    link: `Link ${key}`,
    src: `/images/${key}.png`,
  };
}

const panels: HomeJourneyPanel[] = [
  panel("customer", "purple"),
  panel("heritage", "yellow"),
];

describe("DualJourney", () => {
  it("sends yellow timeline cards to the About timeline anchor", () => {
    render(<DualJourney lang="en" t={homeCopy.en} panels={panels} />);
    expect(screen.getByRole("link", { name: /Title heritage/ })).toHaveAttribute(
      "href",
      "/about#timeline",
    );
  });

  it("sends purple process cards to the home process section", () => {
    render(<DualJourney lang="en" t={homeCopy.en} panels={panels} />);
    expect(screen.getByRole("link", { name: /Title customer/ })).toHaveAttribute(
      "href",
      "#excellence",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- DualJourney`
Expected: both tests FAIL — current hrefs are `/blog` (yellow) and `/finishing` (purple).

- [ ] **Step 3: Change the href ternary**

In `app/components/home/DualJourney.tsx`, replace (around line 109):

```tsx
  // Two tracks: the purple "customer path" panels lead to the process page;
  // the yellow "timeline" panels lead to the journal page.
  const href = panel.accent === "yellow" ? "/blog" : "/finishing";
```

with:

```tsx
  // Two tracks matching the link labels: yellow "timeline" panels deep-link to
  // the About page's milestone timeline; purple "customer path" panels scroll
  // to the process section further down this page.
  const href = panel.accent === "yellow" ? "/about#timeline" : "#excellence";
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- DualJourney`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full unit suite**

Run: `npm run test`
Expected: all green (no other test asserts the old hrefs, but verify).

- [ ] **Step 6: Commit**

```bash
git add app/components/home/DualJourney.tsx app/components/home/DualJourney.test.tsx
git commit -m "fix(home): journey card links match their labels (timeline → about, process → #excellence)"
```

---

### Task 2: About page anchors (`#heritage`, `#timeline`, `#numbers`, `#clients`)

**Files:**
- Modify: `app/components/about/AboutTimeline.tsx:19`
- Modify: `app/components/about/AboutPageDesign.tsx:41,121,187`

- [ ] **Step 1: Add `id="timeline"` to the timeline band**

In `app/components/about/AboutTimeline.tsx`, replace:

```tsx
    <section className="bg-blueprint text-bone">
```

with:

```tsx
    <section id="timeline" className="bg-blueprint text-bone scroll-mt-[80px]">
```

- [ ] **Step 2: Add ids to the three AboutPageDesign sections**

In `app/components/about/AboutPageDesign.tsx`:

Heritage (line ~41) — replace:

```tsx
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0">
```

with:

```tsx
      <section id="heritage" className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0 scroll-mt-[80px]">
```

By the numbers (line ~121) — replace:

```tsx
      <section className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0">
```

with:

```tsx
      <section id="numbers" className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0 scroll-mt-[80px]">
```

Partners/clients (line ~187) — replace:

```tsx
      <section className="w-full border-t border-ink bg-magenta">
```

with:

```tsx
      <section id="clients" className="w-full border-t border-ink bg-magenta scroll-mt-[80px]">
```

- [ ] **Step 3: Verify lint + types**

Run: `npm run lint && npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/about/AboutTimeline.tsx app/components/about/AboutPageDesign.tsx
git commit -m "feat(about): section anchors (heritage, timeline, numbers, clients)"
```

---

### Task 3: Journal, Finishing and Catalog anchors

**Files:**
- Modify: `app/components/blog/InsightsBento.tsx:128-131`
- Modify: `app/components/careers/CareersRoles.tsx:88`
- Modify: `app/components/blog/InsightsNewsletter.tsx:24`
- Modify: `app/components/finishing/FinishingPageDesign.tsx:103-106`
- Modify: `app/components/catalog/CatalogPageDesign.tsx:251-262`

- [ ] **Step 1: `#posts` on the journal bento**

In `app/components/blog/InsightsBento.tsx`, replace:

```tsx
    <section
      dir="ltr"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:grid-rows-[340px_340px_360px] lg:px-20"
    >
```

with:

```tsx
    <section
      id="posts"
      dir="ltr"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:grid-rows-[340px_340px_360px] lg:px-20 scroll-mt-[80px]"
    >
```

- [ ] **Step 2: `#roles` on the open-roles section**

In `app/components/careers/CareersRoles.tsx` (line ~88; note the existing `id="careers-roles-list"` deeper inside is aria wiring — leave it alone), replace:

```tsx
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
```

with:

```tsx
    <section id="roles" className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20 scroll-mt-[80px]">
```

- [ ] **Step 3: `#newsletter` on the newsletter section**

In `app/components/blog/InsightsNewsletter.tsx` (line ~24 — same class string as CareersRoles but a different file, so the replace is unambiguous), replace:

```tsx
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
```

with:

```tsx
    <section id="newsletter" className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20 scroll-mt-[80px]">
```

- [ ] **Step 4: `#capabilities` on the finishing metrics section**

In `app/components/finishing/FinishingPageDesign.tsx` (the section containing the `metricsTitle` aside, line ~103), replace:

```tsx
      <section
        className="mx-auto grid w-full max-w-[1152px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-0"
        dir="ltr"
      >
```

with:

```tsx
      <section
        id="capabilities"
        className="mx-auto grid w-full max-w-[1152px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-0 scroll-mt-[80px]"
        dir="ltr"
      >
```

- [ ] **Step 5: `#catalog` wrapping the catalog category grid**

In `app/components/catalog/CatalogPageDesign.tsx` (`CatalogPageDesign`, line ~251) the categories are sibling `<CategorySection>`s, so wrap the map in an anchored div. Replace:

```tsx
        <CatalogHero copy={copy} />
        {copy.categories.map((category) => (
          <CategorySection key={category.key} category={category} />
        ))}
```

with:

```tsx
        <CatalogHero copy={copy} />
        <div id="catalog" className="scroll-mt-[80px]">
          {copy.categories.map((category) => (
            <CategorySection key={category.key} category={category} />
          ))}
        </div>
```

- [ ] **Step 6: Verify lint + types + unit tests**

Run: `npm run lint && npx tsc --noEmit && npm run test`
Expected: 0 errors, all tests green.

- [ ] **Step 7: Commit**

```bash
git add app/components/blog/InsightsBento.tsx app/components/careers/CareersRoles.tsx app/components/blog/InsightsNewsletter.tsx app/components/finishing/FinishingPageDesign.tsx app/components/catalog/CatalogPageDesign.tsx
git commit -m "feat: section anchors on journal, finishing and catalog pages"
```

---

### Task 4: E2E coverage + full verification gates

**Files:**
- Create: `e2e/anchors.spec.ts`

- [ ] **Step 1: Write the e2e spec**

Create `e2e/anchors.spec.ts`. Selector note: the next-intl `Link` renders locale-prefixed hrefs (existing e2e specs `goto("/he")`), so match with `[href$=...]` to stay locale-agnostic. The hero also links `#excellence`, so purple-card assertions are scoped to `#journey`. The click test uses the **last** yellow card — it sits on top of the sticky deck, so later rows can't overlap it.

```ts
import { test, expect } from "@playwright/test";

test.describe("anchor system", () => {
  test("journey cards carry the rewired hrefs (he)", async ({ page }) => {
    await page.goto("/he");
    await expect(page.locator('#journey a[href$="/about#timeline"]')).toHaveCount(3);
    await expect(page.locator('#journey a[href="#excellence"]')).toHaveCount(3);
  });

  test("section anchors exist on every page (he)", async ({ page }) => {
    await page.goto("/he/about");
    for (const id of ["heritage", "timeline", "numbers", "clients"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.goto("/he/blog");
    for (const id of ["posts", "roles", "newsletter"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.goto("/he/finishing");
    await expect(page.locator("#capabilities")).toHaveCount(1);
    await page.goto("/he/catalog");
    await expect(page.locator("#catalog")).toHaveCount(1);
  });

  test("yellow journey card navigates to the About timeline (en)", async ({ page }) => {
    await page.goto("/en");
    const card = page.locator('#journey a[href$="/about#timeline"]').last();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page).toHaveURL(/\/en\/about#timeline$/);
    await expect(page.locator("#timeline")).toBeVisible();
  });
});
```

- [ ] **Step 2: Build and run the full e2e suite**

Run: `npm run build && npm run test:e2e`
Expected: build succeeds; all Playwright specs green, including the new `anchors.spec.ts`. If the click test flakes on the sticky deck, prefer fixing the selector/scroll (e.g. `card.click({ position: ... })`) over deleting the test; the two non-click tests must stay regardless.

- [ ] **Step 3: Manual browser verification (both locales)**

Using the preview/dev server:
1. `/he` → click a yellow journey card → lands on `/he/about#timeline`, the dark timeline band is visible and not covered by the fixed header.
2. `/he` → click a purple journey card → page scrolls to the process section (`#excellence`).
3. Repeat both on `/en` (LTR).
4. Visual spot-check: no layout shift on any touched section (ids and scroll-margins only).

- [ ] **Step 4: Commit**

```bash
git add e2e/anchors.spec.ts
git commit -m "test(e2e): anchor ids and journey card destinations"
```
