# Site-wide anchor system + journey card rewire

**Date:** 2026-06-10
**Status:** Approved by Ilan (conversation, 2026-06-10)

## Problem

The home page's dual-journey cards promise destinations their links don't deliver:

- Yellow cards are labeled "לציר הזמן" / "The timeline" but link to `/blog` (the
  journal). The actual milestone timeline lives on the About page
  (`AboutTimeline`, the dark band) — which has no `id`, so it cannot be linked
  to at all.
- Purple cards are labeled "לתהליך העבודה" / "Our process" but link to
  `/finishing` (the השבחות capabilities page). The actual 3-step process content
  lives in the home page's own `#excellence` section, whose steps mirror the
  three purple card titles.

More broadly, anchors exist only on the home page (`#journey`, `#excellence`,
`#faq`, `#cta`); About, Journal, Finishing and Catalog have no section ids, so
no page or external link can deep-link into them.

## Design

### 1. New section ids

Each id goes on the section's outermost `<section>` element together with
`scroll-mt-[80px]` (clears the fixed 80px header — the same pattern home
sections already use). Kebab-case, stable, English.

| Page | Section (component) | id |
|---|---|---|
| About | Heritage / parent group (`AboutPageDesign` section 2) | `heritage` |
| About | Milestone timeline (`AboutTimeline`) | `timeline` |
| About | By the numbers (`AboutPageDesign` section 4) | `numbers` |
| About | Partners / clients (`AboutPageDesign` section 5) | `clients` |
| Journal `/blog` | Posts bento (`InsightsBento`) | `posts` |
| Journal `/blog` | Open roles (`CareersRoles`) | `roles` |
| Journal `/blog` | Newsletter (`InsightsNewsletter`) | `newsletter` |
| Finishing | Capabilities / metrics section (`FinishingPageDesign`) | `capabilities` |
| Catalog | Product grid (`CatalogPageDesign`) | `catalog` |

Home's existing ids (`journey`, `excellence`, `faq`, `cta`) are unchanged.

Note: `CareersRoles` already contains `id="careers-roles-list"` on its inner
list (aria wiring) — that stays; the new `roles` id goes on the outer
`<section>`.

### 2. Journey card rewire

In `app/components/home/DualJourney.tsx` (`JourneyCard`, currently
`href = accent === "yellow" ? "/blog" : "/finishing"`):

- Yellow (timeline thread) → `/about#timeline`
- Purple (customer/process thread) → `#excellence` (same-page scroll)

### 3. No content changes

Link labels stored in Sanity ("לציר הזמן", "לתהליך העבודה" and their English
counterparts) become truthful once the destinations change. No Sanity patch, no
copy edits, no visual changes.

## Out of scope

Per scope decision: no footer deep links, no timeline→catalog cross-link, no
moving hrefs into Sanity. Anchors + rewire only.

## Error handling

None needed — ids and hrefs are static. A missing anchor degrades to a normal
page navigation (browser default), but every target id is added in this change.

## Testing

- Existing gates: `npm run lint`, `tsc --noEmit`, `npm run build`,
  `npm run test`, `npm run test:e2e`.
- Browser verification, both locales (he RTL / en LTR):
  - Click a yellow journey card from `/he` → lands on `/he/about#timeline`,
    timeline visible and not covered by the fixed header.
  - Click a purple journey card → smooth-scrolls to the home `#excellence`
    section.
- Visual: design must not change (ids and hrefs only).
