# Full CMS Build-out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend Sanity from "Home-only, unseeded" to a complete, preloaded, client-editable CMS covering every real page (Home, Careers, Finishing, Blog) plus global Site Settings, in both Hebrew and English, without changing the visual design.

**Architecture:** Mirror the existing Home pattern for every page — a document-internationalized Sanity schema whose fields match the bundled `app/content/*.ts` shape 1:1, a GROQ query + `toXCopy` mapper that fails soft to the bundled copy, and an `async` server page that fetches and passes content as props into the existing client islands. Shared chrome (header/nav/footer/contact) is centralized into a global `siteSettings` singleton. All 15 referenced images are uploaded to the Sanity CDN; an idempotent seed script preloads he+en content.

**Tech Stack:** Next.js 16 (App Router), Sanity v5 (`next-sanity`, `@sanity/document-internationalization`), TypeScript strict, next-intl, Vitest, `@sanity/client` for seeding.

**Spec:** `docs/superpowers/specs/2026-06-04-cms-full-buildout-design.md`

---

## Conventions used throughout this plan

- **The bundled `app/content/*.ts` files are the source of truth for seeding AND the fail-soft fallback.** Never delete them.
- **Every schema field gets a Hebrew `title` + `description`.** Code `name`s stay English.
- **Mapper pattern** (copy of the existing `toHomeCopy` in `sanity/queries.ts`): each mapper takes `(doc | null, locale)` and returns the exact type the component consumes, falling back field-by-field to the bundled copy. A `null` doc returns the full bundled fallback.
- **Commit after every task** with a `feat(cms):` / `refactor(cms):` / `chore(cms):` prefix.
- **Verification per task:** unless stated otherwise, every task ends by running `npx tsc --noEmit` and `npm run lint` and expecting 0 errors before committing.

---

## Phase 0 — Branch & prerequisites

### Task 0: Create the working branch

**Files:** none (git only)

- [ ] **Step 1: Branch off main**

Run:
```bash
cd /Users/ilanchelly/Desktop/beeri-arizot
git checkout -b feat/cms-full-buildout
```
Expected: `Switched to a new branch 'feat/cms-full-buildout'`

- [ ] **Step 2: Commit the spec + this plan**

```bash
git add docs/superpowers/specs/2026-06-04-cms-full-buildout-design.md docs/superpowers/plans/2026-06-04-cms-full-buildout.md
git commit -m "docs(cms): add full CMS build-out spec and plan"
```

> **External dependency (non-blocking until Task 22):** the client must add a Sanity **Editor** token to `.env.local` as `SANITY_API_WRITE_TOKEN=...` (manage.sanity.io → project `4qkb39ql` → API → Tokens → Editor). The current `SANITY_API_READ_TOKEN` is read-only. Everything up to the seed phase can be built without it.

---

## Phase 1 — Schema foundation

### Task 1: Extract the shared `imageField` helper

The `imageField` helper currently lives privately inside `sanity/schemaTypes/home.ts`. Extract it so every schema reuses one definition.

**Files:**
- Create: `sanity/schemaTypes/_helpers.ts`
- Modify: `sanity/schemaTypes/home.ts` (import the helper instead of defining it locally)

- [ ] **Step 1: Create the helper module**

```ts
// sanity/schemaTypes/_helpers.ts
import { defineField } from "sanity";

/**
 * A Sanity image field with required Hebrew alt text plus a `legacyImagePath`
 * fallback (local /images/... path used until the asset is uploaded). The
 * GROQ mappers resolve the asset URL when present and fall back to
 * `legacyImagePath` otherwise.
 */
export function imageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "טקסט חלופי (alt)",
        type: "string",
        description: "תיאור קצר של התמונה לנגישות ו-SEO.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "legacyImagePath",
        title: "נתיב תמונה מקומי (גיבוי)",
        type: "string",
        description: "נתיב /images/... — בשימוש עד שהתמונה מועלית ל-CDN.",
      }),
    ],
  });
}
```

- [ ] **Step 2: Use it in home.ts**

In `sanity/schemaTypes/home.ts`, delete the local `function imageField(...)` definition (lines ~9-31) and add at the top:
```ts
import { imageField } from "./_helpers";
```
Leave the four `imageField("heroImage", ...)` calls unchanged.

- [ ] **Step 3: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/_helpers.ts sanity/schemaTypes/home.ts
git commit -m "refactor(cms): extract shared imageField schema helper"
```

---

### Task 2: New object types

**Files:**
- Create: `sanity/schemaTypes/careersArticle.ts`
- Create: `sanity/schemaTypes/careerRole.ts`
- Create: `sanity/schemaTypes/finishingItem.ts`
- Create: `sanity/schemaTypes/finishingMetric.ts`
- Create: `sanity/schemaTypes/socialLink.ts`

- [ ] **Step 1: careersArticle** (mirrors `CareersArticle` in `app/content/careers.ts`)

```ts
// sanity/schemaTypes/careersArticle.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const careersArticle = defineType({
  name: "careersArticle",
  title: "כתבה",
  type: "object",
  fields: [
    defineField({ name: "tag", title: "תגית", type: "string", validation: (r) => r.required() }),
    defineField({ name: "meta", title: "מטא (תאריך/מספר)", type: "string" }),
    defineField({
      name: "title",
      title: "כותרת (שורה לכל שורה)",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "body", title: "טקסט", type: "text", rows: 3 }),
    imageField("image", "תמונה"),
    defineField({ name: "cta", title: "כפתור (קריאה לפעולה)", type: "string" }),
    defineField({
      name: "theme",
      title: "סגנון משבצת",
      type: "string",
      options: { list: ["feature", "plain", "yellow", "image", "wide"], layout: "radio" },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "tag", subtitle: "theme" } },
});
```

- [ ] **Step 2: careerRole** (mirrors `CareerRole`)

```ts
// sanity/schemaTypes/careerRole.ts
import { defineField, defineType } from "sanity";

export const careerRole = defineType({
  name: "careerRole",
  title: "משרה",
  type: "object",
  fields: [
    defineField({ name: "code", title: "קוד משרה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "status", title: "סטטוס", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "שם המשרה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "scope", title: "היקף", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "מיקום", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "department",
      title: "מחלקה",
      type: "string",
      options: { list: ["all", "production", "studio"], layout: "radio" },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "code" } },
});
```

- [ ] **Step 3: finishingItem** (mirrors `FinishingGridItem`)

```ts
// sanity/schemaTypes/finishingItem.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const finishingItem = defineType({
  name: "finishingItem",
  title: "פריט השבחה",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "טקסט", type: "text", rows: 3, validation: (r) => r.required() }),
    imageField("image", "תמונה"),
    defineField({ name: "sample", title: "מספר דוגמה", type: "string" }),
    defineField({ name: "cta", title: "כפתור", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});
```

- [ ] **Step 4: finishingMetric** (mirrors `FinishingMetric`)

```ts
// sanity/schemaTypes/finishingMetric.ts
import { defineField, defineType } from "sanity";

export const finishingMetric = defineType({
  name: "finishingMetric",
  title: "נתון גימור",
  type: "object",
  fields: [
    defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", title: "ערך", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
```

- [ ] **Step 5: socialLink** (new — for footer/site settings)

```ts
// sanity/schemaTypes/socialLink.ts
import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "קישור / לינק",
  type: "object",
  fields: [
    defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "כתובת (URL)", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
```

- [ ] **Step 6: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/careersArticle.ts sanity/schemaTypes/careerRole.ts sanity/schemaTypes/finishingItem.ts sanity/schemaTypes/finishingMetric.ts sanity/schemaTypes/socialLink.ts
git commit -m "feat(cms): add careers/finishing/social object schemas"
```

---

### Task 3: `careers` document schema

**Files:**
- Create: `sanity/schemaTypes/careers.ts`

Mirrors `CareersCopy`. Note `filters` is `{ key, label }[]` where `key ∈ all|production|studio`.

- [ ] **Step 1: Create the schema**

```ts
// sanity/schemaTypes/careers.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const careers = defineType({
  name: "careers",
  title: "קריירה",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "articles", title: "כתבות" },
    { name: "roles", title: "משרות" },
    { name: "newsletter", title: "ניוזלטר" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    // Hero
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (r) => r.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (r) => r.required() }),
    defineField({ name: "searchPlaceholder", title: "טקסט בשדה חיפוש", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "searchButtonLabel", title: "כפתור חיפוש", type: "string", group: "hero", validation: (r) => r.required() }),

    // Articles
    defineField({ name: "articles", title: "כתבות", type: "array", of: [defineArrayMember({ type: "careersArticle" })], group: "articles" }),

    // Roles
    defineField({ name: "rolesTitle", title: "כותרת אזור המשרות", type: "string", group: "roles", validation: (r) => r.required() }),
    defineField({
      name: "filters",
      title: "מסנני מחלקה",
      type: "array",
      group: "roles",
      of: [defineArrayMember({
        type: "object",
        name: "careerFilter",
        fields: [
          defineField({ name: "key", title: "מפתח", type: "string", options: { list: ["all", "production", "studio"] }, validation: (r) => r.required() }),
          defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "key" } },
      })],
    }),
    defineField({ name: "apply", title: "כפתור הגשה", type: "string", group: "roles", validation: (r) => r.required() }),
    defineField({ name: "noRoles", title: "טקסט כשאין משרות", type: "string", group: "roles", validation: (r) => r.required() }),
    defineField({ name: "roles", title: "משרות פתוחות", type: "array", of: [defineArrayMember({ type: "careerRole" })], group: "roles" }),

    // Newsletter
    defineField({ name: "newsletterTitle", title: "כותרת ניוזלטר (שתי שורות)", type: "array", of: [{ type: "string" }], group: "newsletter", validation: (r) => r.required().length(2) }),
    defineField({ name: "newsletterBody", title: "טקסט ניוזלטר", type: "text", rows: 2, group: "newsletter", validation: (r) => r.required() }),
    defineField({ name: "emailPlaceholder", title: "טקסט בשדה מייל", type: "string", group: "newsletter", validation: (r) => r.required() }),
    defineField({ name: "newsletterCta", title: "כפתור הרשמה", type: "string", group: "newsletter", validation: (r) => r.required() }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "קריירה", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/careers.ts
git commit -m "feat(cms): add careers document schema"
```

---

### Task 4: `finishing` document schema

**Files:**
- Create: `sanity/schemaTypes/finishing.ts`

Mirrors `FinishingCopy`. `sampleCard` and `isoCard` are `{ value, label }` objects.

- [ ] **Step 1: Create the schema**

```ts
// sanity/schemaTypes/finishing.ts
import { defineArrayMember, defineField, defineType } from "sanity";

function valueLabel(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "value", title: "ערך", type: "string", validation: (r) => r.required() }),
      defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
    ],
  });
}

export const finishing = defineType({
  name: "finishing",
  title: "השבחות",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "feature", title: "השבחה ראשית" },
    { name: "metrics", title: "נתונים" },
    { name: "grid", title: "משבצות" },
    { name: "cta", title: "קריאה לפעולה" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    defineField({ name: "step", title: "תווית שלב", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (r) => r.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (r) => r.required() }),

    defineField({ name: "feature", title: "השבחה ראשית", type: "finishingItem", group: "feature", validation: (r) => r.required() }),

    defineField({ name: "metricsTitle", title: "כותרת אזור הנתונים", type: "string", group: "metrics", validation: (r) => r.required() }),
    defineField({ name: "metrics", title: "נתוני גימור", type: "array", of: [defineArrayMember({ type: "finishingMetric" })], group: "metrics" }),

    defineField({ name: "quote", title: "ציטוט", type: "text", rows: 3, group: "grid", validation: (r) => r.required() }),
    defineField({ name: "quoteBy", title: "מקור הציטוט", type: "string", group: "grid", validation: (r) => r.required() }),
    defineField({ name: "deboss", title: "משבצת הבלטה", type: "finishingItem", group: "grid", validation: (r) => r.required() }),
    defineField({ name: "texture", title: "משבצת מרקם", type: "finishingItem", group: "grid", validation: (r) => r.required() }),

    defineField({ name: "ctaTitle", title: "כותרת קריאה לפעולה", type: "string", group: "cta", validation: (r) => r.required() }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", group: "cta", validation: (r) => r.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", group: "cta", validation: (r) => r.required() }),
    valueLabel("sampleCard", "כרטיס דוגמה"),
    valueLabel("isoCard", "כרטיס ISO"),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "השבחות", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

> Note: `sampleCard`/`isoCard` use the local `valueLabel` group field — they have no `group` key so they fall under the CTA group visually via field order; assign `group: "cta"` is not possible inside the helper, so leave them ungrouped (they render at the end, acceptable).

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/finishing.ts
git commit -m "feat(cms): add finishing document schema"
```

---

### Task 5: `post` document schema (blog)

**Files:**
- Create: `sanity/schemaTypes/post.ts`

Mirrors `BlogPost`. `read` is `{ he, en }` in the bundled type, but with document-i18n each doc is single-locale, so `read` becomes a single string per doc. `category` is an enum; `body` is an array of paragraphs.

- [ ] **Step 1: Create the schema**

```ts
// sanity/schemaTypes/post.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const post = defineType({
  name: "post",
  title: "פוסט",
  type: "document",
  groups: [
    { name: "meta", title: "מטא-נתונים" },
    { name: "content", title: "תוכן" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "slug",
      title: "מזהה כתובת (slug)",
      type: "slug",
      group: "meta",
      description: "זהה בעברית ובאנגלית — קובע את כתובת הפוסט.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "תאריך פרסום", type: "date", group: "meta", options: { dateFormat: "YYYY-MM-DD" }, validation: (r) => r.required() }),
    defineField({ name: "read", title: "זמן קריאה", type: "string", group: "meta", description: "לדוגמה: 4 דק׳ קריאה", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "קטגוריה",
      type: "string",
      group: "meta",
      options: { list: ["structural", "trends", "sustainability", "floor", "studio"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    imageField("image", "תמונת פוסט"),

    defineField({ name: "title", title: "כותרת", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "תקציר", type: "text", rows: 2, group: "content", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקאות", type: "array", of: [{ type: "text", rows: 3 }], group: "content", validation: (r) => r.required().min(1) }),
  ],
  preview: {
    select: { title: "title", language: "language", media: "image" },
    prepare({ title, language }) {
      return { title: title || "פוסט", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/post.ts
git commit -m "feat(cms): add blog post document schema"
```

---

### Task 6: `placeholderPage` document schema

**Files:**
- Create: `sanity/schemaTypes/placeholderPage.ts`

Mirrors `PlaceholderCopy` + a `route` key (`catalog`/`portfolio`).

- [ ] **Step 1: Create the schema**

```ts
// sanity/schemaTypes/placeholderPage.ts
import { defineField, defineType } from "sanity";

export const placeholderPage = defineType({
  name: "placeholderPage",
  title: 'עמוד "בקרוב"',
  type: "document",
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "route",
      title: "עמוד",
      type: "string",
      options: { list: ["catalog", "portfolio"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שורה או שתיים)", type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1).max(2) }),
    defineField({ name: "lead", title: "שורת פתיחה מודגשת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקת גוף", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "preview", title: 'צ׳יפים "מה צפוי"', type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1) }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { route: "route", language: "language" },
    prepare({ route, language }) {
      return { title: route === "portfolio" ? "פורטפוליו" : "קטלוג", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/placeholderPage.ts
git commit -m "feat(cms): add placeholderPage document schema"
```

---

### Task 7: Expand `siteSettings` (chrome) + add `blogSettings`

**Files:**
- Modify: `sanity/schemaTypes/siteSettings.ts`
- Create: `sanity/schemaTypes/blogSettings.ts`

`siteSettings` becomes the global chrome (internationalized). It mirrors the new `Chrome` type (defined in Task 10's `app/content/site.ts`).

- [ ] **Step 1: Rewrite siteSettings.ts**

```ts
// sanity/schemaTypes/siteSettings.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

/**
 * Global chrome shared by every page: header labels, nav, footer, contact,
 * social. Internationalized (one document per locale).
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "הגדרות אתר",
  type: "document",
  groups: [
    { name: "header", title: "הדר / תפריט" },
    { name: "footer", title: "פוטר" },
    { name: "contact", title: "יצירת קשר" },
    { name: "media", title: "לוגו" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    // Header / chrome
    defineField({ name: "menu", title: "תווית 'תפריט'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "close", title: "תווית 'סגירה'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "lang", title: "תווית 'שפה'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "contact", title: "תווית 'צור קשר'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({
      name: "navLinks",
      title: "קישורי ניווט",
      type: "array",
      group: "header",
      of: [defineArrayMember({ type: "navLink" })],
    }),

    // Footer
    defineField({ name: "footerEyebrow", title: "תווית פוטר", type: "string", group: "footer", validation: (r) => r.required() }),
    defineField({ name: "footerAddr", title: "כתובת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "footer", validation: (r) => r.required().length(2) }),
    defineField({ name: "footerLinks", title: "קישורי פוטר", type: "array", of: [{ type: "string" }], group: "footer", validation: (r) => r.required() }),
    defineField({ name: "footerCopy", title: "זכויות יוצרים", type: "string", group: "footer", validation: (r) => r.required() }),

    // Contact (reserved for future use — optional)
    defineField({ name: "contactEmail", title: "אימייל", type: "string", group: "contact" }),
    defineField({ name: "social", title: "רשתות חברתיות", type: "array", of: [defineArrayMember({ type: "socialLink" })], group: "contact" }),

    // Media
    imageField("logoHe", "לוגו (עברית)"),
    imageField("logoEn", "לוגו (אנגלית)"),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "הגדרות אתר", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

- [ ] **Step 2: Create blogSettings.ts** (mirrors `BlogIndexCopy` + `categoryLabels`)

```ts
// sanity/schemaTypes/blogSettings.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogSettings = defineType({
  name: "blogSettings",
  title: "הגדרות בלוג",
  type: "document",
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שורה או שתיים)", type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1).max(2) }),
    defineField({ name: "lead", title: "שורת פתיחה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקת גוף", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "comingSoon", title: "הערת 'בקרוב'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "readMore", title: "כפתור 'לקריאה'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "backToBlog", title: "כפתור 'חזרה'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "publishedOn", title: "תווית 'פורסם'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "notFoundTitle", title: "כותרת 'לא נמצא'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "notFoundBody", title: "טקסט 'לא נמצא'", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "categoryLabels",
      title: "שמות קטגוריות",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "categoryLabel",
        fields: [
          defineField({ name: "key", title: "מפתח", type: "string", options: { list: ["structural", "trends", "sustainability", "floor", "studio"] }, validation: (r) => r.required() }),
          defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "key" } },
      })],
    }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "הגדרות בלוג", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
```

- [ ] **Step 3: Verify + commit**

```bash
npx tsc --noEmit && npm run lint
git add sanity/schemaTypes/siteSettings.ts sanity/schemaTypes/blogSettings.ts
git commit -m "feat(cms): expand siteSettings chrome + add blogSettings"
```

---

### Task 8: Register schemas + i18n config + Hebrew desk structure

**Files:**
- Modify: `sanity/schemaTypes/index.ts`
- Modify: `sanity/structure.ts`
- Modify: `sanity.config.ts` (register the new internationalized document types with the document-internationalization plugin)

- [ ] **Step 1: Register all types**

Replace `sanity/schemaTypes/index.ts` with:
```ts
import type { SchemaTypeDefinition } from "sanity";

import { blogSettings } from "./blogSettings";
import { capability } from "./capability";
import { careerRole } from "./careerRole";
import { careers } from "./careers";
import { careersArticle } from "./careersArticle";
import { faqItem } from "./faqItem";
import { finishing } from "./finishing";
import { finishingItem } from "./finishingItem";
import { finishingMetric } from "./finishingMetric";
import { home } from "./home";
import { journeyPanel } from "./journeyPanel";
import { navLink } from "./navLink";
import { placeholderPage } from "./placeholderPage";
import { post } from "./post";
import { siteSettings } from "./siteSettings";
import { socialLink } from "./socialLink";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  home,
  careers,
  finishing,
  post,
  placeholderPage,
  siteSettings,
  blogSettings,
  // Objects
  capability,
  faqItem,
  journeyPanel,
  navLink,
  careersArticle,
  careerRole,
  finishingItem,
  finishingMetric,
  socialLink,
];
```

- [ ] **Step 2: Read the current document-internationalization config**

Run:
```bash
grep -n "documentInternationalization\|schemaTypes\|languages" sanity.config.ts
```
Expected: shows the `documentInternationalization({ ... schemaTypes: [...] })` call (currently `["home"]`).

- [ ] **Step 3: Add the new internationalized types**

In `sanity.config.ts`, update the `documentInternationalization` plugin's `schemaTypes` array to:
```ts
schemaTypes: ["home", "careers", "finishing", "post", "placeholderPage", "siteSettings", "blogSettings"],
```
(Keep the existing `supportedLanguages` / `languages` config — he + en — unchanged.)

- [ ] **Step 4: Rewrite the desk structure (Hebrew, grouped)**

```ts
// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

/**
 * Client-facing desk: pages grouped and Hebrew-titled. Singletons
 * (siteSettings, blogSettings) are internationalized, so they show as
 * document-type lists (he + en) rather than single pinned docs.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("תוכן")
    .items([
      S.listItem().title("🏠 דף הבית").child(S.documentTypeList("home").title("דף הבית")),
      S.listItem().title("💼 קריירה").child(S.documentTypeList("careers").title("קריירה")),
      S.listItem().title("✨ השבחות").child(S.documentTypeList("finishing").title("השבחות")),
      S.listItem()
        .title("📝 בלוג")
        .child(
          S.list()
            .title("בלוג")
            .items([
              S.listItem().title("הגדרות בלוג").child(S.documentTypeList("blogSettings").title("הגדרות בלוג")),
              S.listItem().title("פוסטים").child(S.documentTypeList("post").title("פוסטים")),
            ])
        ),
      S.listItem().title('🚧 עמודי "בקרוב"').child(S.documentTypeList("placeholderPage").title('עמודי "בקרוב"')),
      S.listItem().title("⚙️ הגדרות אתר").child(S.documentTypeList("siteSettings").title("הגדרות אתר")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            "home", "careers", "finishing", "post", "placeholderPage",
            "siteSettings", "blogSettings",
          ].includes(item.getId() ?? "")
      ),
    ]);
```

- [ ] **Step 5: Verify Studio compiles + commit**

```bash
npx tsc --noEmit && npm run lint
```
Then start the dev server and confirm `/studio` loads with the grouped Hebrew desk and no schema errors (manual check, or via preview tooling):
```bash
npm run build
```
Expected: build succeeds (this compiles the Studio + schemas).

```bash
git add sanity/schemaTypes/index.ts sanity/structure.ts sanity.config.ts
git commit -m "feat(cms): register schemas, i18n config, Hebrew desk structure"
```

---

## Phase 2 — Data layer

### Task 9: `app/content/site.ts` — Chrome fallback + move nav/logos out of home

This creates the bundled fallback source for the centralized chrome and moves `navLinks` + logos out of `home.ts`.

**Files:**
- Create: `app/content/site.ts`
- Modify: `app/content/home.ts` (remove chrome fields from `HomeCopy` + `homeCopy`; remove `navLinks`; keep `homeImages` logos referenced from site.ts)

- [ ] **Step 1: Create `app/content/site.ts`**

```ts
// app/content/site.ts
import type { Lang, NavLink } from "@/app/content/home";

export type Chrome = {
  menu: string;
  close: string;
  lang: string;
  contact: string;
  navLinks: readonly NavLink[];
  footerEyebrow: string;
  footerAddr: readonly [string, string];
  footerLinks: readonly string[];
  footerCopy: string;
  logoHe: string;
  logoEn: string;
};

export const navLinks: readonly NavLink[] = [
  { he: "פורטפוליו", en: "Work", href: "/portfolio" },
  { he: "השבחות", en: "Finishing", href: "/finishing" },
  { he: "קריירה", en: "Careers", href: "/careers" },
  { he: "קטלוג", en: "Catalog", href: "/catalog" },
  { he: "בלוג", en: "Blog", href: "/blog" },
];

export const chromeContent: Record<Lang, Chrome> = {
  he: {
    menu: "תפריט",
    close: "סגירה",
    lang: "שפה",
    contact: "צור קשר",
    navLinks,
    footerEyebrow: "סטודיו ומפעל",
    footerAddr: ["פארן 4", "יבנה"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "תנאים", "פרטיות"],
    footerCopy: "© 2026 בארי אריזות. כל הזכויות שמורות.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
  },
  en: {
    menu: "Menu",
    close: "Close",
    lang: "Language",
    contact: "Contact",
    navLinks,
    footerEyebrow: "Studio & factory",
    footerAddr: ["4 Paran St.", "Yavne, Israel"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "Terms", "Privacy"],
    footerCopy: "© 2026 Beeri Packaging. All rights reserved.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
  },
};
```

- [ ] **Step 2: Trim `home.ts`**

In `app/content/home.ts`:
- Remove from the `HomeCopy` type: `footerEyebrow`, `footerAddr`, `footerLinks`, `footerCopy`, `menu`, `close`, `lang`. (Keep `contact` — the Hero uses `t.contact`; chrome will get its own `contact`. To avoid ambiguity, **keep `contact` in HomeCopy** for the Hero, and chrome carries its own `contact`.)
- Remove those same keys from both `homeCopy.he` and `homeCopy.en`.
- Delete the `navLinks` export (now in `site.ts`). Keep the `NavLink` **type** export (site.ts imports it).
- Keep `homeImages` (still used by Hero etc.), but the `logoHe`/`logoEn` entries can stay (harmless) or be removed; leave them to minimize churn.

- [ ] **Step 3: Verify the type compiles (expected: downstream errors appear)**

Run:
```bash
npx tsc --noEmit
```
Expected: **errors** in `Header.tsx`, `Footer.tsx`, `MobileDrawer.tsx`, `StickyContact.tsx`, `SiteHeader.tsx`, `PlaceholderShell.tsx`, `sanity/queries.ts`, `scripts/seed-home.ts` referencing the removed fields. This is expected — Tasks 10–14 fix them. Do **not** commit yet; this task is completed together with Task 10's chrome wiring. Proceed directly to Task 10.

---

### Task 10: `getChrome` / `toChrome` + chrome component refactor

**Files:**
- Modify: `sanity/queries.ts` (add Chrome query + mapper)
- Modify: `app/components/home/Header.tsx`, `Footer.tsx`, `MobileDrawer.tsx`, `StickyContact.tsx`, `SiteHeader.tsx`
- Modify: `app/components/placeholder/PlaceholderShell.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/content/home.ts` schema/query/mapper sync (`home.ts` schema + `homeQuery` + `toHomeCopy` lose the chrome fields)
- Create: `sanity/queries.test.ts` (Vitest)

- [ ] **Step 1: Add the Chrome query + mapper to `sanity/queries.ts`**

Append:
```ts
import { chromeContent, type Chrome } from "@/app/content/site";

export const chromeQuery = defineQuery(`*[_type == "siteSettings" && language == $locale][0]{
  menu, close, lang, contact,
  navLinks[]{ he, en, href },
  footerEyebrow, footerAddr, footerLinks, footerCopy,
  "logoHeUrl": logoHe.asset->url, "logoHeLegacy": logoHe.legacyImagePath,
  "logoEnUrl": logoEn.asset->url, "logoEnLegacy": logoEn.legacyImagePath
}`);

type ChromeDoc = {
  menu?: string; close?: string; lang?: string; contact?: string;
  navLinks?: { he: string; en: string; href: string }[];
  footerEyebrow?: string; footerAddr?: string[]; footerLinks?: string[]; footerCopy?: string;
  logoHeUrl?: string; logoHeLegacy?: string; logoEnUrl?: string; logoEnLegacy?: string;
};

export async function getChrome(locale: Lang): Promise<ChromeDoc | null> {
  try {
    return await client.fetch<ChromeDoc | null>(chromeQuery, { locale });
  } catch (err) {
    console.error("getChrome: Sanity fetch failed, using bundled chrome", err);
    return null;
  }
}

export function toChrome(doc: ChromeDoc | null, locale: Lang): Chrome {
  const fb = chromeContent[locale];
  if (!doc) return fb;
  return {
    menu: doc.menu ?? fb.menu,
    close: doc.close ?? fb.close,
    lang: doc.lang ?? fb.lang,
    contact: doc.contact ?? fb.contact,
    navLinks: doc.navLinks && doc.navLinks.length > 0 ? doc.navLinks : fb.navLinks,
    footerEyebrow: doc.footerEyebrow ?? fb.footerEyebrow,
    footerAddr: tuple(doc.footerAddr, fb.footerAddr),
    footerLinks: doc.footerLinks && doc.footerLinks.length > 0 ? doc.footerLinks : fb.footerLinks,
    footerCopy: doc.footerCopy ?? fb.footerCopy,
    logoHe: doc.logoHeUrl ?? doc.logoHeLegacy ?? fb.logoHe,
    logoEn: doc.logoEnUrl ?? doc.logoEnLegacy ?? fb.logoEn,
  };
}
```

Then **remove the chrome fields** from `homeQuery` (delete the `menu, close, lang` projection line and the `footerEyebrow, footerAddr, footerLinks, footerCopy` line and `navLinks[]{...}`), from the `HomeDoc` type, and from `toHomeCopy` (delete the `footer*`, `menu`, `close`, `lang` lines). Keep `contact`.

- [ ] **Step 2: Sync the `home` schema + content**

In `sanity/schemaTypes/home.ts` remove the `footer`, `chrome` groups and their fields (`footerEyebrow`, `footerAddr`, `footerLinks`, `footerCopy`, `menu`, `close`, `lang`, `navLinks`). Remove the `logoHe`/`logoEn` `imageField` calls (logos now live in siteSettings). Keep `heroImage`, `bentoServiceImage`.

- [ ] **Step 3: Write the mapper unit test**

```ts
// sanity/queries.test.ts
import { describe, it, expect } from "vitest";
import { toChrome } from "./queries";
import { chromeContent } from "@/app/content/site";

describe("toChrome", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toChrome(null, "he")).toEqual(chromeContent.he);
  });
  it("prefers the doc value and falls back per-field", () => {
    const result = toChrome({ menu: "X" }, "en");
    expect(result.menu).toBe("X");
    expect(result.close).toBe(chromeContent.en.close); // fell back
  });
  it("uses the asset URL over the legacy path for logos", () => {
    const result = toChrome({ logoHeUrl: "https://cdn/he.svg", logoHeLegacy: "/images/logo-he.svg" }, "he");
    expect(result.logoHe).toBe("https://cdn/he.svg");
  });
});
```

- [ ] **Step 4: Run the test (expect FAIL → then PASS after Step 1 is in place)**

Run:
```bash
npx vitest run sanity/queries.test.ts
```
Expected: PASS (Step 1 already implemented `toChrome`).

- [ ] **Step 5: Refactor the chrome components to take `chrome: Chrome`**

For each, swap the `t: HomeCopy` chrome usage to `chrome: Chrome` and the bundled `navLinks`/`homeImages` reads to `chrome.navLinks`/`chrome.logoHe`/`chrome.logoEn`:

- **`Header.tsx`**: change props to `{ lang, menuOpen, setMenuOpen, chrome }: { lang: Lang; menuOpen: boolean; setMenuOpen: (b: boolean) => void; chrome: Chrome }`. Replace `import { homeImages, navLinks }` with `import type { Chrome } from "@/app/content/site"`. Replace `navLinks.map` → `chrome.navLinks.map`, `homeImages.logoHe/logoEn` → `chrome.logoHe/chrome.logoEn`, `t.contact` → `chrome.contact`, `t.close/t.menu` → `chrome.close/chrome.menu`.
- **`Footer.tsx`**: props `{ lang, chrome }`. `t.footerLinks` → `chrome.footerLinks`, `t.footerCopy` → `chrome.footerCopy`, `t.footerEyebrow` → `chrome.footerEyebrow`, `t.footerAddr` → `chrome.footerAddr`, `homeImages.logo*` → `chrome.logo*`.
- **`MobileDrawer.tsx`**: props `{ open, onClose, lang, chrome }`. `navLinks` → `chrome.navLinks`, `t.menu/lang/contact/footerAddr/footerCopy` → `chrome.*`.
- **`StickyContact.tsx`**: props `{ lang, chrome }`. `t.contact` → `chrome.contact`.
- **`SiteHeader.tsx`**: props `{ lang, chrome }`; pass `chrome` down to `Header` and `MobileDrawer`.

- [ ] **Step 6: Refactor `PlaceholderShell.tsx`**

Change it to take `chrome: Chrome` as a prop (passed from each server page) instead of reading `homeCopy[lang]`. Keep `useLocale()` for `lang`. Replace the context value `{ lang, t }` with `{ lang, chrome }` and update `useShellLang` return type. Pass `chrome` to `Header`, `MobileDrawer`, `Footer`, `StickyContact`. Page-specific copy (careers/finishing/placeholder) is passed separately as props to the page body, **not** through this context.

```ts
// signature
export function PlaceholderShell({ chrome, children }: { chrome: Chrome; children: React.ReactNode }) { ... }
// useShellLang now returns { lang: Lang }
```

- [ ] **Step 7: Update the home page to fetch + pass chrome**

In `app/[locale]/page.tsx`, after `const t = toHomeCopy(doc, lang);` add:
```ts
import { getChrome, toChrome } from "@/sanity/queries";
// ...
const chrome = toChrome(await getChrome(lang), lang);
```
Change `<SiteHeader lang={lang} t={t} />` → `<SiteHeader lang={lang} chrome={chrome} />`, `<Footer lang={lang} t={t} />` → `<Footer lang={lang} chrome={chrome} />`, `<StickyContact lang={lang} t={t} />` → `<StickyContact lang={lang} chrome={chrome} />`.

- [ ] **Step 8: Verify + commit (Home gate)**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```
Expected: all pass. Then **visual parity check on Home** (both `/he` and `/en`) using preview tooling — confirm header, nav, footer, sticky-contact render identically to before.

```bash
git add -A
git commit -m "refactor(cms): centralize chrome into siteSettings with fail-soft fallback"
```

---

### Task 11: Careers query + mapper

**Files:**
- Modify: `sanity/queries.ts`
- Modify: `sanity/queries.test.ts`

- [ ] **Step 1: Add the query + mapper**

```ts
import { careersCopy } from "@/app/content/careers";
import type { CareersCopy } from "@/app/content/careers";

export const careersQuery = defineQuery(`*[_type == "careers" && language == $locale][0]{
  eyebrow, title, intro, searchPlaceholder, searchButtonLabel,
  rolesTitle, apply, noRoles,
  newsletterTitle, newsletterBody, emailPlaceholder, newsletterCta,
  articles[]{ tag, meta, title, body, cta, theme,
    "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath },
  filters[]{ key, label },
  roles[]{ code, status, title, scope, location, department }
}`);

export async function getCareers(locale: Lang) {
  try { return await client.fetch(careersQuery, { locale }); }
  catch (err) { console.error("getCareers failed, using bundled copy", err); return null; }
}

export function toCareersCopy(doc: Awaited<ReturnType<typeof getCareers>>, locale: Lang): CareersCopy {
  const fb = careersCopy[locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: tuple(doc.title, fb.title),
    intro: doc.intro ?? fb.intro,
    searchPlaceholder: doc.searchPlaceholder ?? fb.searchPlaceholder,
    searchButtonLabel: doc.searchButtonLabel ?? fb.searchButtonLabel,
    articles: doc.articles?.length
      ? doc.articles.map((a) => ({
          tag: a.tag, meta: a.meta ?? undefined,
          title: a.title ?? [], body: a.body ?? undefined,
          image: a.imageUrl ?? a.imageLegacy ?? undefined,
          cta: a.cta ?? undefined, theme: a.theme,
        }))
      : fb.articles,
    rolesTitle: doc.rolesTitle ?? fb.rolesTitle,
    filters: doc.filters?.length ? doc.filters : fb.filters,
    apply: doc.apply ?? fb.apply,
    noRoles: doc.noRoles ?? fb.noRoles,
    roles: doc.roles?.length ? doc.roles : fb.roles,
    newsletterTitle: tuple(doc.newsletterTitle, fb.newsletterTitle),
    newsletterBody: doc.newsletterBody ?? fb.newsletterBody,
    emailPlaceholder: doc.emailPlaceholder ?? fb.emailPlaceholder,
    newsletterCta: doc.newsletterCta ?? fb.newsletterCta,
  } as CareersCopy;
}
```

- [ ] **Step 2: Add a fallback test**

```ts
// append to sanity/queries.test.ts
import { toCareersCopy } from "./queries";
import { careersCopy } from "@/app/content/careers";

describe("toCareersCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toCareersCopy(null, "he")).toEqual(careersCopy.he);
  });
});
```

- [ ] **Step 3: Verify + commit**

```bash
npx vitest run sanity/queries.test.ts && npx tsc --noEmit && npm run lint
git add sanity/queries.ts sanity/queries.test.ts
git commit -m "feat(cms): careers query + fail-soft mapper"
```

---

### Task 12: Finishing query + mapper

**Files:**
- Modify: `sanity/queries.ts`, `sanity/queries.test.ts`

- [ ] **Step 1: Add the query + mapper**

```ts
import { finishingCopy } from "@/app/content/finishing";
import type { FinishingCopy, FinishingGridItem } from "@/app/content/finishing";

const ITEM = `{ eyebrow, title, body, sample, cta,
  "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath }`;

export const finishingQuery = defineQuery(`*[_type == "finishing" && language == $locale][0]{
  step, title, intro,
  feature${ITEM},
  metricsTitle, metrics[]{ label, value },
  quote, quoteBy,
  deboss${ITEM}, texture${ITEM},
  ctaTitle, ctaPrimary, ctaSecondary,
  sampleCard{ value, label }, isoCard{ value, label }
}`);

export async function getFinishing(locale: Lang) {
  try { return await client.fetch(finishingQuery, { locale }); }
  catch (err) { console.error("getFinishing failed, using bundled copy", err); return null; }
}

function mapItem(i: { eyebrow?: string; title?: string; body?: string; sample?: string; cta?: string; imageUrl?: string; imageLegacy?: string } | null, fb: FinishingGridItem): FinishingGridItem {
  if (!i) return fb;
  return {
    eyebrow: i.eyebrow ?? fb.eyebrow,
    title: i.title ?? fb.title,
    body: i.body ?? fb.body,
    image: i.imageUrl ?? i.imageLegacy ?? fb.image,
    sample: i.sample ?? fb.sample,
    cta: i.cta ?? fb.cta,
  };
}

export function toFinishingCopy(doc: Awaited<ReturnType<typeof getFinishing>>, locale: Lang): FinishingCopy {
  const fb = finishingCopy[locale];
  if (!doc) return fb;
  return {
    step: doc.step ?? fb.step,
    title: tuple(doc.title, fb.title),
    intro: doc.intro ?? fb.intro,
    feature: mapItem(doc.feature, fb.feature),
    metricsTitle: doc.metricsTitle ?? fb.metricsTitle,
    metrics: doc.metrics?.length ? doc.metrics : fb.metrics,
    quote: doc.quote ?? fb.quote,
    quoteBy: doc.quoteBy ?? fb.quoteBy,
    deboss: mapItem(doc.deboss, fb.deboss),
    texture: mapItem(doc.texture, fb.texture),
    ctaTitle: doc.ctaTitle ?? fb.ctaTitle,
    ctaPrimary: doc.ctaPrimary ?? fb.ctaPrimary,
    ctaSecondary: doc.ctaSecondary ?? fb.ctaSecondary,
    sampleCard: doc.sampleCard ?? fb.sampleCard,
    isoCard: doc.isoCard ?? fb.isoCard,
  } as FinishingCopy;
}
```

- [ ] **Step 2: Add a fallback test**

```ts
// append to sanity/queries.test.ts
import { toFinishingCopy } from "./queries";
import { finishingCopy } from "@/app/content/finishing";

describe("toFinishingCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toFinishingCopy(null, "en")).toEqual(finishingCopy.en);
  });
});
```

- [ ] **Step 3: Verify + commit**

```bash
npx vitest run sanity/queries.test.ts && npx tsc --noEmit && npm run lint
git add sanity/queries.ts sanity/queries.test.ts
git commit -m "feat(cms): finishing query + fail-soft mapper"
```

---

### Task 13: Blog queries + mappers (index, posts, settings)

**Files:**
- Modify: `sanity/queries.ts`, `sanity/queries.test.ts`

- [ ] **Step 1: Add blog settings + posts queries/mappers**

```ts
import { blogIndexCopy, blogPosts, categoryLabels } from "@/app/content/blog";
import type { BlogIndexCopy, BlogPost, BlogCategory } from "@/app/content/blog";

// --- Blog settings (index copy + category labels) ---
export const blogSettingsQuery = defineQuery(`*[_type == "blogSettings" && language == $locale][0]{
  eyebrow, title, lead, body, comingSoon, readMore, backToBlog, publishedOn,
  notFoundTitle, notFoundBody, categoryLabels[]{ key, label }
}`);

export async function getBlogSettings(locale: Lang) {
  try { return await client.fetch(blogSettingsQuery, { locale }); }
  catch (err) { console.error("getBlogSettings failed, using bundled copy", err); return null; }
}

export function toBlogIndexCopy(doc: Awaited<ReturnType<typeof getBlogSettings>>, locale: Lang): BlogIndexCopy {
  const fb = blogIndexCopy[locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: (doc.title?.length ? doc.title : fb.title) as BlogIndexCopy["title"],
    lead: doc.lead ?? fb.lead,
    body: doc.body ?? fb.body,
    comingSoon: doc.comingSoon ?? fb.comingSoon,
    readMore: doc.readMore ?? fb.readMore,
    backToBlog: doc.backToBlog ?? fb.backToBlog,
    publishedOn: doc.publishedOn ?? fb.publishedOn,
    notFoundTitle: doc.notFoundTitle ?? fb.notFoundTitle,
    notFoundBody: doc.notFoundBody ?? fb.notFoundBody,
  };
}

/** Per-locale category label map, falling back to bundled labels. */
export function toCategoryLabels(doc: Awaited<ReturnType<typeof getBlogSettings>>, locale: Lang): Record<BlogCategory, string> {
  const fb = Object.fromEntries(
    (Object.keys(categoryLabels) as BlogCategory[]).map((k) => [k, categoryLabels[k][locale]])
  ) as Record<BlogCategory, string>;
  if (!doc?.categoryLabels?.length) return fb;
  const out = { ...fb };
  for (const { key, label } of doc.categoryLabels) {
    if (key && label && key in out) out[key as BlogCategory] = label;
  }
  return out;
}

// --- Posts (single-locale projection) ---
const POST = `{
  "slug": slug.current, date, read, category,
  "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath,
  title, excerpt, body
}`;

export const allPostsQuery = defineQuery(`*[_type == "post" && language == $locale] | order(date desc) ${POST}`);
export const postQuery = defineQuery(`*[_type == "post" && language == $locale && slug.current == $slug][0] ${POST}`);

type PostDoc = {
  slug?: string; date?: string; read?: string; category?: BlogCategory;
  imageUrl?: string; imageLegacy?: string;
  title?: string; excerpt?: string; body?: string[];
};

/** A single-locale post shape consumed by the blog components. */
export type LocalizedPost = {
  slug: string; date: string; read: string; category: BlogCategory;
  image?: string; title: string; excerpt: string; body: readonly string[];
};

function fbPost(p: BlogPost, locale: Lang): LocalizedPost {
  return {
    slug: p.slug, date: p.date, read: p.read[locale], category: p.category,
    image: p.image, title: p[locale].title, excerpt: p[locale].excerpt, body: p[locale].body,
  };
}

function mapPost(d: PostDoc, locale: Lang): LocalizedPost {
  const fb = blogPosts.find((p) => p.slug === d.slug);
  return {
    slug: d.slug ?? fb?.slug ?? "",
    date: d.date ?? fb?.date ?? "",
    read: d.read ?? (fb ? fb.read[locale] : ""),
    category: d.category ?? fb?.category ?? "studio",
    image: d.imageUrl ?? d.imageLegacy ?? fb?.image,
    title: d.title ?? (fb ? fb[locale].title : ""),
    excerpt: d.excerpt ?? (fb ? fb[locale].excerpt : ""),
    body: d.body?.length ? d.body : (fb ? fb[locale].body : []),
  };
}

export async function getAllPosts(locale: Lang): Promise<LocalizedPost[]> {
  try {
    const docs = await client.fetch<PostDoc[]>(allPostsQuery, { locale });
    if (!docs?.length) return blogPosts.map((p) => fbPost(p, locale));
    return docs.map((d) => mapPost(d, locale));
  } catch (err) {
    console.error("getAllPosts failed, using bundled copy", err);
    return blogPosts.map((p) => fbPost(p, locale));
  }
}

export async function getPost(slug: string, locale: Lang): Promise<LocalizedPost | null> {
  try {
    const doc = await client.fetch<PostDoc | null>(postQuery, { locale, slug });
    if (doc) return mapPost(doc, locale);
  } catch (err) {
    console.error("getPost failed, using bundled copy", err);
  }
  const fb = blogPosts.find((p) => p.slug === slug);
  return fb ? fbPost(fb, locale) : null;
}
```

- [ ] **Step 2: Add fallback tests**

```ts
// append to sanity/queries.test.ts
import { toBlogIndexCopy, toCategoryLabels } from "./queries";
import { blogIndexCopy, categoryLabels } from "@/app/content/blog";

describe("blog mappers", () => {
  it("blog index falls back when doc is null", () => {
    expect(toBlogIndexCopy(null, "he")).toEqual(blogIndexCopy.he);
  });
  it("category labels fall back to bundled per-locale", () => {
    const labels = toCategoryLabels(null, "en");
    expect(labels.structural).toBe(categoryLabels.structural.en);
  });
});
```

- [ ] **Step 3: Verify + commit**

```bash
npx vitest run sanity/queries.test.ts && npx tsc --noEmit && npm run lint
git add sanity/queries.ts sanity/queries.test.ts
git commit -m "feat(cms): blog index/post/settings queries + fail-soft mappers"
```

---

### Task 14: Placeholder query + mapper

**Files:**
- Modify: `sanity/queries.ts`, `sanity/queries.test.ts`

- [ ] **Step 1: Add the query + mapper**

```ts
import { placeholderContent } from "@/app/content/placeholder";
import type { PlaceholderCopy, PlaceholderRoute } from "@/app/content/placeholder";

export const placeholderQuery = defineQuery(`*[_type == "placeholderPage" && language == $locale && route == $route][0]{
  eyebrow, title, lead, body, preview, ctaPrimary, ctaSecondary
}`);

export async function getPlaceholder(route: PlaceholderRoute, locale: Lang) {
  try { return await client.fetch(placeholderQuery, { locale, route }); }
  catch (err) { console.error("getPlaceholder failed, using bundled copy", err); return null; }
}

export function toPlaceholderCopy(doc: Awaited<ReturnType<typeof getPlaceholder>>, route: PlaceholderRoute, locale: Lang): PlaceholderCopy {
  const fb = placeholderContent[route][locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: (doc.title?.length ? doc.title : fb.title) as PlaceholderCopy["title"],
    lead: doc.lead ?? fb.lead,
    body: doc.body ?? fb.body,
    preview: doc.preview?.length ? doc.preview : fb.preview,
    ctaPrimary: doc.ctaPrimary ?? fb.ctaPrimary,
    ctaSecondary: doc.ctaSecondary ?? fb.ctaSecondary,
  };
}
```

- [ ] **Step 2: Add a fallback test**

```ts
// append to sanity/queries.test.ts
import { toPlaceholderCopy } from "./queries";
import { placeholderContent } from "@/app/content/placeholder";

describe("toPlaceholderCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toPlaceholderCopy(null, "catalog", "he")).toEqual(placeholderContent.catalog.he);
  });
});
```

- [ ] **Step 3: Verify + commit**

```bash
npx vitest run sanity/queries.test.ts && npx tsc --noEmit && npm run lint
git add sanity/queries.ts sanity/queries.test.ts
git commit -m "feat(cms): placeholderPage query + fail-soft mapper"
```

---

## Phase 3 — Page migrations

Each page becomes an `async` server component that fetches `chrome` + its page doc and passes them as props. Page bodies that are client islands receive content via props instead of importing bundled copy or `useShellLang().t`.

### Task 15: Careers page migration

**Files:**
- Modify: `app/[locale]/careers/page.tsx`
- Modify: `app/components/careers/CareersPageDesign.tsx` (take `copy` + `lang` as props instead of `useShellLang` + bundled import)
- Modify: `app/[locale]/careers` `generateMetadata`

- [ ] **Step 1: Make the page async server + fetch**

```tsx
// app/[locale]/careers/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { CareersPageDesign } from "@/app/components/careers/CareersPageDesign";
import { getCareers, toCareersCopy, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toCareersCopy(await getCareers(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.intro };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const [copy, chrome] = [toCareersCopy(await getCareers(lang), lang), toChrome(await getChrome(lang), lang)];
  return (
    <PlaceholderShell chrome={chrome}>
      <CareersPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 2: Refactor CareersPageDesign to take props**

In `app/components/careers/CareersPageDesign.tsx`: change signature to `export function CareersPageDesign({ copy, lang }: { copy: CareersCopy; lang: Lang })`. Remove `import { careersCopy }` and `useShellLang`; remove `const { lang } = useShellLang(); const copy = careersCopy[lang];`. Import the types: `import type { CareersCopy, CareerRole } from "@/app/content/careers"; import type { Lang } from "@/app/content/home";`. Keep all the `useState`/`useMemo` interactivity unchanged.

- [ ] **Step 3: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity check `/he/careers` and `/en/careers` against current render.
```bash
git add -A
git commit -m "feat(cms): migrate careers page to Sanity with fallback"
```

---

### Task 16: Finishing page migration

**Files:**
- Modify: `app/[locale]/finishing/page.tsx`
- Modify: `app/components/finishing/FinishingPageDesign.tsx`

- [ ] **Step 1: Read how FinishingPageDesign consumes content**

Run:
```bash
grep -n "useShellLang\|finishingCopy\|export function\|props\|FinishingCopy" app/components/finishing/FinishingPageDesign.tsx
```
Expected: shows it reads `finishingCopy[lang]` via `useShellLang` (same pattern as careers).

- [ ] **Step 2: Make the page async server + fetch** (mirror Task 15 Step 1)

```tsx
// app/[locale]/finishing/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { FinishingPageDesign } from "@/app/components/finishing/FinishingPageDesign";
import { getFinishing, toFinishingCopy, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toFinishingCopy(await getFinishing(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.intro };
}

export default async function FinishingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = toFinishingCopy(await getFinishing(lang), lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <FinishingPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 3: Refactor FinishingPageDesign to take `{ copy, lang }` props**

Apply the same transformation as careers: remove the bundled import + `useShellLang`, accept `copy: FinishingCopy` and `lang: Lang` as props, keep markup/interactivity identical. Import types from `@/app/content/finishing` and `@/app/content/home`.

- [ ] **Step 4: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity `/he/finishing` + `/en/finishing`.
```bash
git add -A
git commit -m "feat(cms): migrate finishing page to Sanity with fallback"
```

---

### Task 17: Blog index migration

**Files:**
- Modify: `app/[locale]/blog/page.tsx`
- Modify: `app/components/placeholder/BlogIndex.tsx`

- [ ] **Step 1: Inspect BlogIndex's current data reads**

Run:
```bash
grep -n "useShellLang\|blogIndexCopy\|blogPosts\|categoryLabels\|export function\|Lang" app/components/placeholder/BlogIndex.tsx
```
Expected: shows it reads `blogIndexCopy[lang]`, `blogPosts`, and `categoryLabels` (bundled).

- [ ] **Step 2: Make the page async server + fetch**

```tsx
// app/[locale]/blog/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogIndex } from "@/app/components/placeholder/BlogIndex";
import { getBlogSettings, toBlogIndexCopy, toCategoryLabels, getAllPosts, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toBlogIndexCopy(await getBlogSettings(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.lead };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const settings = await getBlogSettings(lang);
  const copy = toBlogIndexCopy(settings, lang);
  const labels = toCategoryLabels(settings, lang);
  const posts = await getAllPosts(lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <BlogIndex copy={copy} posts={posts} labels={labels} lang={lang} />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 3: Refactor BlogIndex to take props**

Change signature to `export function BlogIndex({ copy, posts, labels, lang }: { copy: BlogIndexCopy; posts: readonly LocalizedPost[]; labels: Record<BlogCategory, string>; lang: Lang })`. Remove bundled imports of `blogIndexCopy`/`blogPosts`/`categoryLabels` and `useShellLang`. Where it previously read `post.he/en.title`, use the already-localized `post.title`/`post.excerpt`. Where it read `categoryLabels[cat][lang]`, use `labels[cat]`. Keep `categoryChipClass` import (code-bound colors) and all markup. Import `LocalizedPost` from `@/sanity/queries`.

- [ ] **Step 4: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity `/he/blog` + `/en/blog`.
```bash
git add -A
git commit -m "feat(cms): migrate blog index to Sanity with fallback"
```

---

### Task 18: Blog post migration

**Files:**
- Modify: `app/[locale]/blog/[slug]/page.tsx`
- Modify: `app/components/placeholder/BlogPostHero.tsx` (and any post-body component it uses) to take a `LocalizedPost` + `copy` props

- [ ] **Step 1: Inspect the current post page + components**

Run:
```bash
cat "app/[locale]/blog/[slug]/page.tsx"; echo "---"; grep -n "getBlogPost\|useShellLang\|blogIndexCopy\|post\.\|export function\|Lang" app/components/placeholder/BlogPostHero.tsx app/components/placeholder/BlogNotFound.tsx
```
Expected: shows it calls `getBlogPost(slug)` (bundled) and renders `BlogPostHero` / `BlogNotFound`, reading `post.he/en.*` and `blogIndexCopy`.

- [ ] **Step 2: Rewrite the post page**

```tsx
// app/[locale]/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogPostHero } from "@/app/components/placeholder/BlogPostHero";
import { BlogNotFound } from "@/app/components/placeholder/BlogNotFound";
import { getPost, getAllPosts, getBlogSettings, toBlogIndexCopy, toCategoryLabels, getChrome, toChrome } from "@/sanity/queries";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale as Lang);
    for (const p of posts) params.push({ locale, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale as Lang);
  if (!post) return { title: "Beeri" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const post = await getPost(slug, lang);
  const settings = await getBlogSettings(lang);
  const copy = toBlogIndexCopy(settings, lang);
  const labels = toCategoryLabels(settings, lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      {post
        ? <BlogPostHero post={post} copy={copy} labels={labels} lang={lang} />
        : <BlogNotFound copy={copy} lang={lang} />}
    </PlaceholderShell>
  );
}
```

- [ ] **Step 3: Refactor BlogPostHero + BlogNotFound to props**

`BlogPostHero({ post, copy, labels, lang }: { post: LocalizedPost; copy: BlogIndexCopy; labels: Record<BlogCategory, string>; lang: Lang })` — read `post.title/excerpt/body/date/read/category/image` directly (already localized), `labels[post.category]` for the category label, `copy.publishedOn`/`copy.backToBlog` for chrome. `BlogNotFound({ copy, lang })` reads `copy.notFoundTitle/notFoundBody/backToBlog`. Remove bundled `getBlogPost`/`blogIndexCopy`/`useShellLang` reads. Keep `categoryChipClass` import + markup.

- [ ] **Step 4: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity a post (`/he/blog/anatomy-of-a-wine-carton`, `/en/...`) and a missing slug.
```bash
git add -A
git commit -m "feat(cms): migrate blog post page to Sanity with fallback"
```

---

### Task 19: Catalog + Portfolio migration

**Files:**
- Modify: `app/[locale]/catalog/page.tsx`, `app/[locale]/portfolio/page.tsx`
- Modify: `app/components/placeholder/PlaceholderHero.tsx` (take `content: PlaceholderCopy` directly — it already takes `content`; confirm it doesn't also read chrome via context)

- [ ] **Step 1: Confirm PlaceholderHero's props**

Run:
```bash
grep -n "export function\|content\|useShellLang\|PlaceholderCopy\|Lang" app/components/placeholder/PlaceholderHero.tsx
```
Expected: it accepts `content: PlaceholderContent` (`Record<Lang, PlaceholderCopy>`) and picks `content[lang]` via `useShellLang`. We'll switch it to take a single resolved `PlaceholderCopy` + `lang`.

- [ ] **Step 2: Rewrite catalog page**

```tsx
// app/[locale]/catalog/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { getPlaceholder, toPlaceholderCopy, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toPlaceholderCopy(await getPlaceholder("catalog", locale as Lang), "catalog", locale as Lang);
  return { title: copy.title.join(" "), description: copy.body };
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = toPlaceholderCopy(await getPlaceholder("catalog", lang), "catalog", lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <PlaceholderHero copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 3: Rewrite portfolio page** (identical but `"portfolio"`)

Same as Step 2 with every `"catalog"` replaced by `"portfolio"` and the function renamed `PortfolioPage`.

- [ ] **Step 4: Refactor PlaceholderHero to `{ copy, lang }`**

Change signature to `export function PlaceholderHero({ copy, lang }: { copy: PlaceholderCopy; lang: Lang })`. Remove `useShellLang` + the `content[lang]` indexing. Import `PlaceholderCopy` type. Keep markup.

- [ ] **Step 5: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity `/he/catalog`, `/en/catalog`, `/he/portfolio`, `/en/portfolio`.
```bash
git add -A
git commit -m "feat(cms): migrate catalog + portfolio placeholders to Sanity"
```

---

### Task 20: Fix `/showcase` chrome prop (out-of-scope page, must still compile)

`/showcase` is a client page that renders `Header` + `MobileDrawer` from bundled `homeCopy`. After the chrome refactor it must pass `chrome` instead of `t`.

**Files:**
- Modify: `app/[locale]/showcase/page.tsx`

- [ ] **Step 1: Swap its chrome wiring to bundled chrome**

At the top replace `import { homeCopy }` usage for chrome with:
```ts
import { chromeContent } from "@/app/content/site";
```
Replace `const t = homeCopy[lang];` (if present) and the `Header`/`MobileDrawer` `t={...}` props with `chrome={chromeContent[lang]}`. (Showcase stays on bundled content — it is intentionally not CMS-driven.)

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
git add app/[locale]/showcase/page.tsx
git commit -m "refactor(cms): point showcase chrome at bundled chromeContent"
```

---

## Phase 4 — Seeding + images

### Task 21: Image-upload helper

**Files:**
- Create: `scripts/lib/sanity-write-client.ts`
- Create: `scripts/lib/upload-images.ts`

- [ ] **Step 1: Shared write client** (reads `.env.local`, requires write token)

```ts
// scripts/lib/sanity-write-client.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, "..", "..");

function loadEnvLocal() {
  let raw: string;
  try { raw = readFileSync(path.join(repoRoot, ".env.local"), "utf8"); } catch { return; }
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
// Prefer a dedicated write token; fall back to the existing var if the client reused it.
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Missing Sanity env: need PROJECT_ID, DATASET, and SANITY_API_WRITE_TOKEN (Editor) in .env.local");
}

export const writeClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
```

- [ ] **Step 2: Image uploader (idempotent, dedup by path)**

```ts
// scripts/lib/upload-images.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { writeClient, repoRoot } from "./sanity-write-client";

export type ImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string };

const cache = new Map<string, string>(); // publicPath -> asset._id

/** Upload a /public image once; return an image field referencing it. */
export async function uploadImage(publicPath: string, alt: string): Promise<ImageRef> {
  let assetId = cache.get(publicPath);
  if (!assetId) {
    const filePath = path.join(repoRoot, "public", publicPath.replace(/^\//, ""));
    const buffer = readFileSync(filePath);
    const asset = await writeClient.assets.upload("image", buffer, { filename: path.basename(filePath) });
    assetId = asset._id;
    cache.set(publicPath, assetId);
    console.log(`  uploaded ${publicPath} -> ${assetId}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}
```

- [ ] **Step 3: Verify it compiles + commit**

```bash
npx tsc --noEmit
git add scripts/lib/sanity-write-client.ts scripts/lib/upload-images.ts
git commit -m "chore(cms): add seed write-client + image-upload helpers"
```

---

### Task 22: `seed-all.ts` — preload all content (he + en) + images

**Files:**
- Create: `scripts/seed-all.ts`
- Modify: `package.json` (add `"seed": "tsx scripts/seed-all.ts"`)

> **Requires the Editor token** (`SANITY_API_WRITE_TOKEN`). If absent, the script throws the clear error from Task 21 Step 1.

- [ ] **Step 1: Write the seed script**

The script imports the bundled content modules and writes `home`, `careers`, `finishing`, `post` (per blog post), `placeholderPage` (catalog + portfolio), `siteSettings`, `blogSettings` for both locales, links each pair via `translation.metadata`, and uploads the 15 images. Use deterministic `_id`s and `createOrReplace`.

```ts
// scripts/seed-all.ts
import { writeClient } from "./lib/sanity-write-client";
import { uploadImage, type ImageRef } from "./lib/upload-images";
import { capabilities, faqItems, homeCopy, homeImages, journeyPanels } from "../app/content/home";
import { chromeContent } from "../app/content/site";
import { careersCopy, careersImages } from "../app/content/careers";
import { finishingCopy, finishingImages } from "../app/content/finishing";
import { blogIndexCopy, blogPosts, categoryLabels } from "../app/content/blog";
import { placeholderContent } from "../app/content/placeholder";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const legacy = (p: string, alt: string) => ({ _type: "image" as const, alt, legacyImagePath: p });

async function linkTranslations(id: string, type: string, heId: string, enId: string) {
  await writeClient.createOrReplace({
    _id: id, _type: "translation.metadata", schemaTypes: [type],
    translations: [
      { _key: "he", value: { _type: "reference", _ref: heId } },
      { _key: "en", value: { _type: "reference", _ref: enId } },
    ],
  });
}

async function main() {
  console.log("Uploading images...");
  const heroImage = await uploadImage(homeImages.hero, "אריזות קרטון בהתאמה אישית");
  const bentoServiceImage = await uploadImage(homeImages.bentoService, "חיתוך שטנץ");
  const logoHe = await uploadImage(chromeContent.he.logoHe, "בארי אריזות");
  const logoEn = await uploadImage(chromeContent.en.logoEn, "Beeri Packaging");
  // journey panels (shared across locales) keyed by panel.key
  const journeyImg: Record<string, ImageRef> = {};
  for (const p of journeyPanels) journeyImg[p.key] = await uploadImage(p.src, p.he.title);
  // finishing items
  const finFoil = await uploadImage(finishingImages.foil, "פויל");
  const finDeboss = await uploadImage(finishingImages.deboss, "הבלטה");
  const finTexture = await uploadImage(finishingImages.texture, "מרקם");
  // careers
  const carFeature = await uploadImage(careersImages.feature, "תהליך ייצור");
  const carMaterials = await uploadImage(careersImages.materials, "מעבדת חומרים");

  for (const lang of LANGS) {
    const t = homeCopy[lang];
    // HOME
    await writeClient.createOrReplace({
      _id: `home-${lang}`, _type: "home", language: lang,
      eyebrow: t.eyebrow, h1: [...t.h1], cta1: t.cta1, cta2: t.cta2, scroll: t.scroll, contact: t.contact,
      journeyEyebrow: t.journeyEyebrow, journeyTitle: t.journeyTitle, journeyDesc: t.journeyDesc,
      techTitle: t.techTitle, techBody: t.techBody,
      bento1Title: t.bento1Title, bento1Body: t.bento1Body, bento2Title: t.bento2Title, bento2Body: t.bento2Body,
      badge1: t.badge1, badge2: t.badge2,
      faqEyebrow: t.faqEyebrow, faqTitle: t.faqTitle, faqBody: t.faqBody, ctaTitle: [...t.ctaTitle],
      capabilities: capabilities.map((c) => ({ _type: "capability", _key: c.n, n: c.n, title: c[lang].title, body: c[lang].body })),
      faqItems: faqItems.map((f) => ({ _type: "faqItem", _key: f.n, n: f.n, q: f[lang].q, a: f[lang].a })),
      journeyPanels: journeyPanels.map((p) => ({
        _type: "journeyPanel", _key: p.key, key: p.key, image: journeyImg[p.key],
        theme: p.theme, accent: p.accent, tagColor: p.tagColor,
        tag: p[lang].tag, title: p[lang].title, body: p[lang].body, link: p[lang].link,
      })),
      heroImage, bentoServiceImage,
    });

    // SITE SETTINGS (chrome)
    const c = chromeContent[lang];
    await writeClient.createOrReplace({
      _id: `siteSettings-${lang}`, _type: "siteSettings", language: lang,
      menu: c.menu, close: c.close, lang: c.lang, contact: c.contact,
      navLinks: c.navLinks.map((n, i) => ({ _type: "navLink", _key: `nav-${i}`, he: n.he, en: n.en, href: n.href })),
      footerEyebrow: c.footerEyebrow, footerAddr: [...c.footerAddr], footerLinks: [...c.footerLinks], footerCopy: c.footerCopy,
      logoHe, logoEn,
    });

    // CAREERS
    const ca = careersCopy[lang];
    const carImg: Record<string, ImageRef> = { [careersImages.feature]: carFeature, [careersImages.materials]: carMaterials };
    await writeClient.createOrReplace({
      _id: `careers-${lang}`, _type: "careers", language: lang,
      eyebrow: ca.eyebrow, title: [...ca.title], intro: ca.intro,
      searchPlaceholder: ca.searchPlaceholder, searchButtonLabel: ca.searchButtonLabel,
      articles: ca.articles.map((a, i) => ({
        _type: "careersArticle", _key: `art-${i}`, tag: a.tag, meta: a.meta, title: [...a.title],
        body: a.body, cta: a.cta, theme: a.theme, ...(a.image ? { image: carImg[a.image] } : {}),
      })),
      rolesTitle: ca.rolesTitle,
      filters: ca.filters.map((f, i) => ({ _type: "careerFilter", _key: `flt-${i}`, key: f.key, label: f.label })),
      apply: ca.apply, noRoles: ca.noRoles,
      roles: ca.roles.map((r, i) => ({ _type: "careerRole", _key: `role-${i}`, ...r })),
      newsletterTitle: [...ca.newsletterTitle], newsletterBody: ca.newsletterBody,
      emailPlaceholder: ca.emailPlaceholder, newsletterCta: ca.newsletterCta,
    });

    // FINISHING
    const fi = finishingCopy[lang];
    const finImg: Record<string, ImageRef> = { [finishingImages.foil]: finFoil, [finishingImages.deboss]: finDeboss, [finishingImages.texture]: finTexture };
    const finItem = (it: typeof fi.feature) => ({
      _type: "finishingItem", eyebrow: it.eyebrow, title: it.title, body: it.body,
      sample: it.sample, cta: it.cta, ...(it.image ? { image: finImg[it.image] } : {}),
    });
    await writeClient.createOrReplace({
      _id: `finishing-${lang}`, _type: "finishing", language: lang,
      step: fi.step, title: [...fi.title], intro: fi.intro,
      feature: finItem(fi.feature),
      metricsTitle: fi.metricsTitle,
      metrics: fi.metrics.map((m, i) => ({ _type: "finishingMetric", _key: `m-${i}`, ...m })),
      quote: fi.quote, quoteBy: fi.quoteBy,
      deboss: finItem(fi.deboss), texture: finItem(fi.texture),
      ctaTitle: fi.ctaTitle, ctaPrimary: fi.ctaPrimary, ctaSecondary: fi.ctaSecondary,
      sampleCard: fi.sampleCard, isoCard: fi.isoCard,
    });

    // BLOG SETTINGS
    const bi = blogIndexCopy[lang];
    await writeClient.createOrReplace({
      _id: `blogSettings-${lang}`, _type: "blogSettings", language: lang,
      eyebrow: bi.eyebrow, title: [...bi.title], lead: bi.lead, body: bi.body,
      comingSoon: bi.comingSoon, readMore: bi.readMore, backToBlog: bi.backToBlog,
      publishedOn: bi.publishedOn, notFoundTitle: bi.notFoundTitle, notFoundBody: bi.notFoundBody,
      categoryLabels: (Object.keys(categoryLabels) as (keyof typeof categoryLabels)[]).map((k) => ({
        _type: "categoryLabel", _key: k, key: k, label: categoryLabels[k][lang],
      })),
    });

    // POSTS
    for (const p of blogPosts) {
      await writeClient.createOrReplace({
        _id: `post-${p.slug}-${lang}`, _type: "post", language: lang,
        slug: { _type: "slug", current: p.slug },
        date: p.date, read: p.read[lang], category: p.category,
        ...(p.image ? { image: legacy(p.image, p[lang].title) } : {}),
        title: p[lang].title, excerpt: p[lang].excerpt, body: [...p[lang].body],
      });
    }

    // PLACEHOLDER PAGES (catalog + portfolio)
    for (const route of ["catalog", "portfolio"] as const) {
      const pc = placeholderContent[route][lang];
      await writeClient.createOrReplace({
        _id: `placeholder-${route}-${lang}`, _type: "placeholderPage", language: lang, route,
        eyebrow: pc.eyebrow, title: [...pc.title], lead: pc.lead, body: pc.body,
        preview: [...pc.preview], ctaPrimary: pc.ctaPrimary, ctaSecondary: pc.ctaSecondary,
      });
    }
    console.log(`  ✓ all docs for ${lang}`);
  }

  // Link translation pairs (singletons + page docs)
  await linkTranslations("home-translation", "home", "home-he", "home-en");
  await linkTranslations("careers-translation", "careers", "careers-he", "careers-en");
  await linkTranslations("finishing-translation", "finishing", "finishing-he", "finishing-en");
  await linkTranslations("siteSettings-translation", "siteSettings", "siteSettings-he", "siteSettings-en");
  await linkTranslations("blogSettings-translation", "blogSettings", "blogSettings-he", "blogSettings-en");
  for (const route of ["catalog", "portfolio"] as const)
    await linkTranslations(`placeholder-${route}-translation`, "placeholderPage", `placeholder-${route}-he`, `placeholder-${route}-en`);
  for (const p of blogPosts)
    await linkTranslations(`post-${p.slug}-translation`, "post", `post-${p.slug}-he`, `post-${p.slug}-en`);

  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Add the npm script**

In `package.json` `scripts`, add: `"seed": "tsx scripts/seed-all.ts",`

- [ ] **Step 3: Verify the script compiles (no run yet)**

```bash
npx tsc --noEmit
```
Expected: 0 errors. (Running requires the Editor token — Step 4.)

- [ ] **Step 4: Run the seed (requires Editor token)**

Confirm `.env.local` has `SANITY_API_WRITE_TOKEN`. Then:
```bash
npm run seed
```
Expected: logs "uploaded …" for 15 images, "✓ all docs for he", "✓ all docs for en", "Done." If it throws "Insufficient permissions", the token isn't an Editor token — fix and re-run (idempotent).

- [ ] **Step 5: Confirm the dataset is populated**

```bash
PID=$(grep NEXT_PUBLIC_SANITY_PROJECT_ID .env.local | cut -d= -f2)
TOK=$(grep -E 'SANITY_API_(WRITE|READ)_TOKEN' .env.local | head -1 | cut -d= -f2)
curl -s "https://${PID}.api.sanity.io/v2024-10-01/data/query/production?query=$(python3 -c "import urllib.parse;print(urllib.parse.quote('count(*[_type in [\"home\",\"careers\",\"finishing\",\"post\",\"placeholderPage\",\"siteSettings\",\"blogSettings\"]])'))")" -H "Authorization: Bearer ${TOK}"
```
Expected: a count of **22** (home×2 + careers×2 + finishing×2 + posts 4×2=8 + placeholder 2×2=4 + siteSettings×2 + blogSettings×2 = 22).

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-all.ts package.json
git commit -m "feat(cms): idempotent seed-all script (all pages, he+en, images)"
```

---

## Phase 5 — Image rendering via Sanity CDN

### Task 23: Render CMS images through Sanity transform URLs + LQIP

**Files:**
- Modify: `sanity/image.ts` (add a width/format helper + LQIP projection support)
- Modify: `next.config.ts` (add `cdn.sanity.io` to `images.remotePatterns`)
- Verify: components that render CMS images (`Hero`, `DualJourney`, finishing/careers items) use the resolved URL props already produced by the mappers

- [ ] **Step 1: Inspect current next.config + how Hero/DualJourney consume image URLs**

```bash
cat next.config.ts; echo "---"; grep -n "imageUrl\|heroImageUrl\|src=\|legacyImagePath\|next/image" app/components/home/Hero.tsx app/components/home/DualJourney.tsx
```
Expected: shows whether `cdn.sanity.io` is already in `remotePatterns`, and how the components pick `imageUrl ?? legacyImagePath`.

- [ ] **Step 2: Add `cdn.sanity.io` to remotePatterns**

In `next.config.ts`, ensure `images.remotePatterns` includes:
```ts
{ protocol: "https", hostname: "cdn.sanity.io" },
```

- [ ] **Step 3: Confirm transform usage**

CMS image URLs from the mappers are raw `asset->url`. Where a component renders a large CMS image with `next/image`, the Sanity host is now allowed, so `next/image` works. To avoid Vercel's optimizer, large CMS images may instead append Sanity transform params (`?w=1600&auto=format&q=75`) and use a plain `<img>` or `next/image` with `unoptimized`. Apply the transform-param approach only to the hero + journey panels (the heaviest). Keep all classNames/dimensions identical — **visual parity must hold**.

- [ ] **Step 4: Verify + visual parity + commit**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Visual-parity on Home + Finishing + Careers; confirm in the network panel that CMS images load from `cdn.sanity.io` and that no `/_next/image` transcoding is used for them.
```bash
git add next.config.ts sanity/image.ts app/components
git commit -m "feat(cms): render CMS images via Sanity CDN transforms"
```

---

## Phase 6 — Full verification

### Task 24: End-to-end verification across all pages + both locales

**Files:** none (verification + fixes only)

- [ ] **Step 1: Full gate suite**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```
Expected: all pass, 0 errors.

- [ ] **Step 2: Both locales render every page**

With the dev server running, load each and confirm no console/runtime errors, content comes from CMS (edit a field in `/studio`, reload, see the change):
`/he`, `/en`, `/he/careers`, `/en/careers`, `/he/finishing`, `/en/finishing`, `/he/blog`, `/en/blog`, `/he/blog/anatomy-of-a-wine-carton`, `/en/blog/foil-vs-spot-uv`, `/he/catalog`, `/en/portfolio`.

- [ ] **Step 3: Fail-soft check**

Temporarily point `NEXT_PUBLIC_SANITY_DATASET` to a non-existent dataset (or stop network), reload a page, confirm it still renders from bundled copy (no crash). Revert.

- [ ] **Step 4: E2E (if Playwright config covers these routes)**

```bash
npm run test:e2e
```
Expected: green. If routes changed, update the specs as part of this task.

- [ ] **Step 5: Final commit + finish the branch**

```bash
git add -A
git commit -m "test(cms): full-suite verification across pages and locales" --allow-empty
```
Then use the `superpowers:finishing-a-development-branch` skill to decide merge/PR.

---

## Self-review notes (coverage map)

- Spec §5 schemas → Tasks 1–8. §5.3 chrome centralization → Tasks 9–10. §6 Studio org → Task 8. §7 data layer → Tasks 9–14. §8 component/page refactor → Tasks 15–20. §9 images → Tasks 21, 23. §10 seeding → Tasks 21–22. §11 verification gates → embedded per task + Task 24. §12 phases → Phase headers.
- Out-of-scope (`/showcase`, real catalog/portfolio collections) honored: Task 20 keeps showcase on bundled chrome; catalog/portfolio stay placeholder docs (Tasks 6, 19).
- Type consistency: `Chrome` (site.ts) used identically across Tasks 9, 10, 15–20; `LocalizedPost` (queries.ts) used in Tasks 13, 17, 18; mapper signatures `to*Copy(doc, locale)` uniform across Tasks 10–14.
