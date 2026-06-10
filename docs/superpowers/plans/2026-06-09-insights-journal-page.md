# Insights (תובנות) journal page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a journal index page at `/blog` ("תובנות / Insights") that shows the blog posts in a balanced 6-card bento reusing the careers visual language, repoint the nav to it, and add 2 new posts so the grid fills symmetrically.

**Architecture:** A server route (`app/[locale]/blog/page.tsx`) fetches posts via the existing `getAllPosts()` and index copy via `getBlogSettings`, then renders a client shell (`InsightsPageDesign`) that holds search state and composes `InsightsHero` / `InsightsBento` / `InsightsNewsletter`. Posts use the existing `LocalizedPost` shape; each card links to `/blog/[slug]` and uses `post.image`. Careers components are untouched — the bento visuals are re-implemented for the post data shape.

**Tech Stack:** Next.js 16 App Router (server-first), React 19, Tailwind v4 (brand tokens), next-intl (`/he` + `/en`, RTL default), Sanity (posts + blogSettings, static fallback in `app/content/blog.ts`), Vitest, Playwright.

---

## File structure

- **Create** `app/[locale]/blog/page.tsx` — index route (server): fetch, metadata, static params, render shell.
- **Create** `app/components/blog/InsightsPageDesign.tsx` — client shell, search state, composition.
- **Create** `app/components/blog/InsightsHero.tsx` — eyebrow + title + lead + search input.
- **Create** `app/components/blog/InsightsBento.tsx` — balanced 6-card grid + card variants.
- **Create** `app/components/blog/InsightsNewsletter.tsx` — newsletter, reuses the server action.
- **Create** `app/components/blog/InsightsBento.test.tsx` — unit test for the grid.
- **Create** `scripts/rename-journal-to-insights-nav.ts` — one-off Sanity nav patch.
- **Modify** `app/content/blog.ts` — index copy → Insights, add `insightsChrome` strings, add 2 posts.
- **Modify** `app/content/site.ts:35-40` — nav link `/careers` → Insights `/blog`.
- **Modify** `app/actions/newsletter.ts` — subject line keyed by a `source` field.
- **Modify** `lib/site.ts:14-22` — add `/blog` to `ROUTES`.
- **Modify** `sanity/queries.test.ts` — update blog-index fallback expectation.
- **Modify** `tests/` (e2e) — add `/blog` render check (locate existing e2e dir during Task 10).

---

## Task 1: Rename index copy to Insights + add chrome strings

**Files:**
- Modify: `app/content/blog.ts` (the `blogIndexCopy` object, ~lines 75-104; add a new `insightsChrome` export + types)
- Modify: `sanity/queries.test.ts` (blog mapper expectation, ~line 40)

- [ ] **Step 1: Update the failing test first**

In `sanity/queries.test.ts`, the existing test `blog index falls back when doc is null` asserts `toBlogIndexCopy(null, "he")` equals `blogIndexCopy.he`. It will still pass after we edit the object (it compares to the same object), so add an explicit assertion on the new title. Find the `blog mappers` describe block and add:

```ts
  it("blog index uses the Insights name", () => {
    expect(blogIndexCopy.he.title).toEqual(["תובנות", "מהסטודיו"]);
    expect(blogIndexCopy.en.title).toEqual(["Insights", "from the studio"]);
    expect(blogIndexCopy.he.eyebrow).toContain("תובנות");
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test -- queries.test.ts`
Expected: FAIL — current title is `["יומן בארי", "אריזות"]`.

- [ ] **Step 3: Edit `blogIndexCopy` in `app/content/blog.ts`**

Replace the `he` and `en` `eyebrow`/`title`/`lead`/`body` values (keep the other keys — `comingSoon`, `readMore`, `backToBlog`, `publishedOn`, `notFoundTitle`, `notFoundBody` — unchanged):

```ts
  he: {
    eyebrow: "תובנות · מהסטודיו ומהמפעל",
    title: ["תובנות", "מהסטודיו"],
    lead: "מדריכים, מחשבות והצצות מתהליך העבודה — מהתכנון המבני ועד הדפוס וההשבחה.",
    body:
      "כאן אנחנו כותבים על תכנון מבני, חומרי גלם, השבחות ומגמות בעיצוב אריזה. תובנות קצרות מהצוות שמתכנן, מדפיס ומייצר.",
    comingSoon: "הכותרים למטה הם דוגמאות — הפוסטים המלאים בעריכה.",
    readMore: "לקריאה",
    backToBlog: "חזרה לכל הפוסטים",
    publishedOn: "פורסם",
    notFoundTitle: "הפוסט עדיין לא פורסם",
    notFoundBody:
      "הכותר הזה שמור לפוסט עתידי בתובנות של בארי אריזות. בקרוב כאן יהיה תוכן מלא — בינתיים אפשר לחזור לרשימה.",
  },
  en: {
    eyebrow: "Insights · from the studio & the floor",
    title: ["Insights", "from the studio"],
    lead: "Guides, notes and glimpses from the work — from structural design to print and finishing.",
    body:
      "We write here about structural design, materials, finishing and packaging-design trends. Short notes from the team that designs, prints and produces.",
    comingSoon: "The titles below are samples — the full posts are in edit.",
    readMore: "Read",
    backToBlog: "Back to all posts",
    publishedOn: "Published",
    notFoundTitle: "Post not yet published",
    notFoundBody:
      "This slot is reserved for a future Beeri Packaging post. Full content is on its way — for now, head back to the index.",
  },
```

- [ ] **Step 4: Add the `insightsChrome` strings + type at the end of `app/content/blog.ts`** (after `blogIndexCopy`, before `categoryLabels`)

```ts
/** Static UI chrome for the Insights index (search + newsletter). */
export type InsightsChrome = {
  searchPlaceholder: string;
  searchButtonLabel: string;
  newsletterTitle: readonly [string, string];
  newsletterBody: string;
  emailPlaceholder: string;
  newsletterCta: string;
  newsletterSuccess: string;
  newsletterError: string;
};

export const insightsChrome: Record<Lang, InsightsChrome> = {
  he: {
    searchPlaceholder: "חיפוש תובנה",
    searchButtonLabel: "חיפוש",
    newsletterTitle: ["עדכוני", "תובנות"],
    newsletterBody:
      "רוצים לקבל פוסט חדש כשהוא עולה? השאירו כתובת מייל ונעדכן.",
    emailPlaceholder: "כתובת מייל",
    newsletterCta: "הרשמה",
    newsletterSuccess: "נרשמתם — נעדכן כשיעלה פוסט חדש.",
    newsletterError: "ההרשמה נכשלה. ניתן לנסות שוב.",
  },
  en: {
    searchPlaceholder: "Search insights",
    searchButtonLabel: "Search",
    newsletterTitle: ["Insights", "updates"],
    newsletterBody:
      "Want each new post as it goes live? Leave your email and we'll let you know.",
    emailPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    newsletterSuccess: "You're in — we'll email you when a new post is live.",
    newsletterError: "Signup failed. Please try again.",
  },
};
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test -- queries.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/content/blog.ts sanity/queries.test.ts
git commit -m "feat(insights): rename blog index copy to Insights + add chrome strings"
```

---

## Task 2: Repoint the nav link to Insights → /blog

**Files:**
- Modify: `app/content/site.ts:38`
- Create: `scripts/rename-journal-to-insights-nav.ts`

> Nav is served from Sanity `siteSettings` (with `site.ts` as the static fallback). We update the fallback here; the live Sanity nav is patched by the one-off script in this task and stays in sync via `npm run seed` in Task 10.

- [ ] **Step 1: Edit the nav link in `app/content/site.ts`**

Change line 38 from:

```ts
  { he: "יומן", en: "Journal", href: "/careers" },
```

to:

```ts
  { he: "תובנות", en: "Insights", href: "/blog" },
```

- [ ] **Step 2: Create the one-off Sanity patch script** `scripts/rename-journal-to-insights-nav.ts`

```ts
// scripts/rename-journal-to-insights-nav.ts
// One-off: repoint the journal/careers nav link to the Insights index.
// Sets he="תובנות", en="Insights", href="/blog" on the matching navLink in
// every siteSettings doc. Matches the old link by its current href.
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const link = (doc.navLinks ?? []).find(
      (l) => l.href === "/careers" || l.href === "/blog",
    );
    if (!link) {
      console.log(`  – ${doc._id}: no journal/careers navLink, skipped`);
      continue;
    }
    await writeClient
      .patch(doc._id)
      .set({
        [`navLinks[_key=="${link._key}"].he`]: "תובנות",
        [`navLinks[_key=="${link._key}"].en`]: "Insights",
        [`navLinks[_key=="${link._key}"].href`]: "/blog",
      })
      .commit();
    console.log(`  ⟳ ${doc._id}: "${link.he}" → "תובנות" (/blog)`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit** (the live Sanity patch runs in Task 10 alongside the seed)

```bash
git add app/content/site.ts scripts/rename-journal-to-insights-nav.ts
git commit -m "feat(insights): repoint nav link to Insights /blog"
```

---

## Task 3: Add 2 new posts so the grid fills to 6

**Files:**
- Modify: `app/content/blog.ts` (the `blogPosts` array — append two entries before the closing `];`)

> Images are existing repo assets. The two posts add a `studio` (gold) and a second `structural` (cyan) card, balancing the grid colors. Prose below is a complete first draft modeled on the existing posts; refine with the `hebrew-content-writer` skill if desired, keeping the same `BlogPost` shape.

- [ ] **Step 1: Append two `BlogPost` entries** to `blogPosts` in `app/content/blog.ts` (insert before the final `];`)

```ts
  {
    slug: "from-sketch-to-prototype",
    date: "2026-03-30",
    read: { he: "5 דקות", en: "5 min read" },
    category: "studio",
    image:
      "/images/generated/website-content/packaging/open-capability-presentation-box.png",
    author: STUDIO,
    credit: STUDIO,
    quoteImage:
      "/images/generated/website-content/packaging/closed-textured-capability-box.png",
    he: {
      category: "מהסטודיו",
      title: "מהסקיצה לדגם",
      excerpt:
        "איך רעיון הופך לדגם פיזי שאפשר להחזיק ביד — שלב הביניים שחוסך טעויות יקרות בייצור.",
      body: [
        "לפני שמדפיסים אלפי יחידות, בונים דגם אחד. הדגם הפיזי הוא הדרך הזולה ביותר לגלות בעיות — קיפול שלא נסגר, מידה שלא מדויקת או חולשה במבנה.",
        "בסטודיו אנחנו עוברים מסקיצה לדייליין ולדגם חתוך ביד, ורק כשהדגם עובד ממשיכים לייצור.",
      ],
      quote: {
        text: "דגם אחד ביד שווה יותר מעשרה מסכי תלת-ממד — הוא חושף את מה שהמסך מסתיר.",
        cite: "— מתוך התובנות של בארי אריזות",
      },
      sections: [
        {
          heading: "סקיצה, דייליין ודגם",
          body: "מתחילים בסקיצה גסה שמגדירה גודל ופתיחה, ממשיכים לדייליין מדויק שמתרגם את הרעיון לקווי חיתוך וקיפול, ומסיימים בדגם חתוך ביד מאותו קרטון שיֵצא בפועל. כך בודקים שהאריזה נסגרת, יציבה ונוחה לפתיחה לפני שמתחייבים לייצור.",
          image:
            "/images/generated/website-content/packaging/closed-textured-capability-box.png",
        },
        {
          heading: "מה הדגם חושף",
          body: "דגם פיזי מגלה את מה שקשה לראות במסך: עובי הקרטון שמשנה מידות, קיפול שמתנגד, או לשונית סגירה חלשה. תיקון בשלב הזה עולה דקות — אותו תיקון אחרי שהוקם שטנץ עולה הרבה יותר.",
        },
      ],
    },
    en: {
      category: "From the studio",
      title: "From sketch to prototype",
      excerpt:
        "How an idea becomes a physical model you can hold — the in-between step that saves expensive production mistakes.",
      body: [
        "Before printing thousands of units, we build one model. The physical prototype is the cheapest way to catch problems — a fold that won't close, a measurement that's off, a weak point in the structure.",
        "In the studio we go from sketch to dieline to a hand-cut prototype, and only move to production once the model works.",
      ],
      quote: {
        text: "One prototype in hand beats ten 3D renders — it reveals what the screen hides.",
        cite: "— From the Beeri Packaging insights",
      },
      sections: [
        {
          heading: "Sketch, dieline and model",
          body: "We start with a rough sketch that sets size and opening, move to a precise dieline that translates the idea into cut and fold lines, and finish with a model hand-cut from the same board the job will run on. That confirms the package closes, stands and opens well before we commit to production.",
          image:
            "/images/generated/website-content/packaging/closed-textured-capability-box.png",
        },
        {
          heading: "What the model reveals",
          body: "A physical model surfaces what's hard to see on screen: board thickness that shifts measurements, a fold that resists, a weak closing tab. Fixing it here costs minutes — the same fix after a cutting die is built costs far more.",
        },
      ],
    },
  },
  {
    slug: "display-windows",
    date: "2026-03-18",
    read: { he: "4 דקות", en: "4 min read" },
    category: "structural",
    image:
      "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
    author: STUDIO,
    credit: FLOOR,
    quoteImage:
      "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
    he: {
      category: "תכנון מבני",
      title: "חלון התצוגה באריזה",
      excerpt:
        "מתי חלון במוצר עוזר למכירה ומתי הוא רק מחליש את הקופסה — והאיזון הנכון ביניהם.",
      body: [
        "חלון באריזה נותן ללקוח לראות את המוצר עצמו, וזה יתרון מכירתי ברור. אבל כל חלון הוא גם חור בקרטון — והוא משפיע על החוזק ועל הייצור.",
        "השאלה היא לא אם להוסיף חלון, אלא איפה ובאיזה גודל, כדי לשמור על מבנה יציב ועל מראה נקי.",
      ],
      quote: {
        text: "חלון טוב מראה בדיוק את מה שצריך — ולא סנטימטר יותר.",
        cite: "— מתוך התובנות של בארי אריזות",
      },
      sections: [
        {
          heading: "מתי חלון עובד",
          body: "חלון משתלם כשהמוצר עצמו הוא נקודת המכירה: ממתק, מוצר טיפוח או פריט בעל צבע וצורה ייחודיים. במקרים האלה החלון מקצר את ההחלטה של הלקוח במדף. כדאי למקם אותו במקום שמראה את החלק היפה של המוצר ולא את האריזה הפנימית.",
          image:
            "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
        },
        {
          heading: "המחיר המבני",
          body: "כל חלון מחליש את הדופן ודורש לעיתים סלי PVC או חיזוק נוסף. חלון גדול מדי או קרוב מדי לקו קיפול עלול לגרום לאריזה להתעוות בשינוע. תכנון נכון שומר על מרווח מהקיפולים ומאזן בין חשיפת המוצר ליציבות הקופסה.",
        },
      ],
    },
    en: {
      category: "Structural",
      title: "The display window",
      excerpt:
        "When a window helps the sale and when it just weakens the box — and the right balance between them.",
      body: [
        "A window lets the customer see the product itself, a clear selling advantage. But every window is also a hole in the board — and it affects strength and production.",
        "The question isn't whether to add a window, but where and how large, to keep a stable structure and a clean look.",
      ],
      quote: {
        text: "A good window shows exactly what it needs to — and not a centimeter more.",
        cite: "— From the Beeri Packaging insights",
      },
      sections: [
        {
          heading: "When a window works",
          body: "A window pays off when the product is the selling point: a sweet, a beauty product, an item with distinctive color or shape. There the window shortens the customer's decision at the shelf. Place it to show the product's best part, not the inner packaging.",
          image:
            "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
        },
        {
          heading: "The structural cost",
          body: "Every window weakens the wall and sometimes needs a PVC pane or extra reinforcement. A window that's too large or too close to a fold line can warp the box in transit. Good design keeps clearance from the folds and balances product visibility against box stability.",
        },
      ],
    },
  },
```

- [ ] **Step 2: Verify the images exist**

Run: `ls public/images/generated/website-content/packaging/open-capability-presentation-box.png public/images/generated/website-content/packaging/closed-textured-capability-box.png public/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png public/images/generated/website-content/packaging/kraft-sweets-window-box.png`
Expected: all four paths listed (no "No such file").

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors (entries conform to `BlogPost`).

- [ ] **Step 4: Commit**

```bash
git add app/content/blog.ts
git commit -m "feat(insights): add 'from-sketch-to-prototype' and 'display-windows' posts"
```

---

## Task 4: InsightsBento — balanced 6-card grid

**Files:**
- Create: `app/components/blog/InsightsBento.tsx`
- Create: `app/components/blog/InsightsBento.test.tsx`

The grid: large feature (cols 1-8, rows 1-2, image) + two stacked cards on the side (cols 9-12, rows 1 and 2), then a bottom row of three equal cards (cols 1-4 / 5-8 / 9-12). Each card is a `Link` to `/blog/[slug]`. Cards 1 and 4 carry the post image; the rest are text/graphic.

- [ ] **Step 1: Write the failing test** `app/components/blog/InsightsBento.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightsBento } from "./InsightsBento";
import type { LocalizedPost } from "@/sanity/queries";

function post(slug: string, category: LocalizedPost["category"]): LocalizedPost {
  return {
    slug,
    date: "2026-05-20",
    read: "5 min",
    category,
    image: `/images/${slug}.png`,
    title: `Title ${slug}`,
    excerpt: `Excerpt ${slug}`,
    body: ["b"],
  };
}

const posts: LocalizedPost[] = [
  post("a", "trends"),
  post("b", "structural"),
  post("c", "sustainability"),
  post("d", "floor"),
  post("e", "studio"),
  post("f", "structural"),
];

describe("InsightsBento", () => {
  it("renders one card per post, each linking to its article", () => {
    render(<InsightsBento posts={posts} lang="en" labels={{
      structural: "Structural", trends: "Trends", sustainability: "Sustainability",
      floor: "Floor", studio: "Studio",
    }} readLabel="Read" />);
    for (const p of posts) {
      const link = screen.getByRole("link", { name: new RegExp(`Title ${p.slug}`) });
      expect(link).toHaveAttribute("href", `/en/blog/${p.slug}`);
    }
  });

  it("caps at six cards even if more posts are passed", () => {
    const many = [...posts, post("g", "trends")];
    render(<InsightsBento posts={many} lang="he" labels={{
      structural: "מבני", trends: "מגמות", sustainability: "קיימות",
      floor: "מהמפעל", studio: "סטודיו",
    }} readLabel="לקריאה" />);
    expect(screen.queryByRole("link", { name: /Title g/ })).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test -- InsightsBento.test.tsx`
Expected: FAIL — module `./InsightsBento` does not exist.

- [ ] **Step 3: Implement** `app/components/blog/InsightsBento.tsx`

```tsx
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Lang } from "@/app/content/home";
import { categoryChipClass, type BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { ArrowGlyph } from "@/app/components/home/icons";

type Labels = Record<BlogCategory, string>;

function Chip({ category, label }: { category: BlogCategory; label: string }) {
  return (
    <span
      className={`${categoryChipClass[category]} inline-flex min-h-6 items-center px-3 py-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em]`}
    >
      {label}
    </span>
  );
}

function ReadRow({ lang, label }: { lang: Lang; label: string }) {
  return (
    <span className="mt-auto flex items-center justify-between border-t border-ink pt-5 font-sans text-[14px] font-bold tracking-[0.07em] text-ink">
      <span className="underline decoration-solid underline-offset-[3px]">{label}</span>
      <ArrowGlyph direction={lang === "he" ? "right-to-left" : "left-to-right"} />
    </span>
  );
}

/** Large feature card with hero image (top-start of the grid). */
function FeatureCard({ post, lang, labels, readLabel }: CardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      dir={lang === "he" ? "rtl" : "ltr"}
      className="reveal group relative flex flex-col overflow-hidden border border-ink bg-sand focus-ring lg:col-start-1 lg:col-span-8 lg:row-start-1 lg:row-span-2"
    >
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-magenta" aria-hidden />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <Chip category={post.category} label={labels[post.category]} />
          <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-clay">
            {post.read}
          </span>
        </div>
        <h2 className="font-display text-[44px] font-bold leading-[0.92] text-ink sm:text-[64px]">
          {post.title}
        </h2>
        <p className="max-w-[480px] font-sans text-[16px] leading-[1.6] text-clay sm:text-[18px]">
          {post.excerpt}
        </p>
      </div>
      {post.image ? (
        <div className="relative mt-auto aspect-[16/9] border-t border-ink bg-bone">
          <Image src={post.image} alt={post.imageAlt ?? post.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover grayscale transition-[filter] group-hover:grayscale-0" />
        </div>
      ) : null}
    </Link>
  );
}

/** Solid-color text card (no image). `accent` picks the surface tint. */
function TextCard({
  post, lang, labels, readLabel, className, surface,
}: CardProps & { className: string; surface: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      dir={lang === "he" ? "rtl" : "ltr"}
      className={`reveal group flex flex-col border border-ink ${surface} p-6 focus-ring sm:p-8 ${className}`}
    >
      <Chip category={post.category} label={labels[post.category]} />
      <h3 className="mt-6 font-display text-[34px] font-bold leading-none text-ink sm:text-[40px]">
        {post.title}
      </h3>
      <p className="mt-4 font-sans text-[15px] leading-[1.6] text-clay">{post.excerpt}</p>
      <ReadRow lang={lang} label={readLabel} />
    </Link>
  );
}

/** Image-led card for the bottom row. */
function ImageCard({ post, lang, labels, readLabel, className }: CardProps & { className: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      dir={lang === "he" ? "rtl" : "ltr"}
      className={`reveal group flex flex-col overflow-hidden border border-ink bg-bone focus-ring ${className}`}
    >
      {post.image ? (
        <div className="relative aspect-[1.5] border-b border-ink bg-ink">
          <Image src={post.image} alt={post.imageAlt ?? post.title} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover grayscale transition-[filter] group-hover:grayscale-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <Chip category={post.category} label={labels[post.category]} />
        <h3 className="mt-4 font-display text-[30px] font-bold leading-none text-ink sm:text-[36px]">
          {post.title}
        </h3>
        <ReadRow lang={lang} label={readLabel} />
      </div>
    </Link>
  );
}

type CardProps = {
  post: LocalizedPost;
  lang: Lang;
  labels: Labels;
  readLabel: string;
};

export function InsightsBento({
  posts, lang, labels, readLabel,
}: {
  posts: readonly LocalizedPost[];
  lang: Lang;
  labels: Labels;
  readLabel: string;
}) {
  const [p0, p1, p2, p3, p4, p5] = posts.slice(0, 6);
  const common = { lang, labels, readLabel };
  return (
    <section
      dir="ltr"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:grid-rows-[340px_340px_360px] lg:px-20"
    >
      {p0 ? <FeatureCard post={p0} {...common} /> : null}
      {p1 ? <TextCard post={p1} {...common} surface="bg-mist" className="lg:col-start-9 lg:col-span-4 lg:row-start-1" /> : null}
      {p2 ? <TextCard post={p2} {...common} surface="bg-bone" className="lg:col-start-9 lg:col-span-4 lg:row-start-2" /> : null}
      {p3 ? <ImageCard post={p3} {...common} className="lg:col-start-1 lg:col-span-4 lg:row-start-3" /> : null}
      {p4 ? <TextCard post={p4} {...common} surface="bg-sand" className="lg:col-start-5 lg:col-span-4 lg:row-start-3" /> : null}
      {p5 ? <TextCard post={p5} {...common} surface="bg-bone" className="lg:col-start-9 lg:col-span-4 lg:row-start-3" /> : null}
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- InsightsBento.test.tsx`
Expected: PASS (both cases). If `@/i18n/navigation` `Link` renders `/en/blog/...` differently in test, confirm the href assertion matches the rendered locale-prefixed path; the existing blog tests show the same `Link` prefixes the locale.

- [ ] **Step 5: Commit**

```bash
git add app/components/blog/InsightsBento.tsx app/components/blog/InsightsBento.test.tsx
git commit -m "feat(insights): add balanced 6-card InsightsBento"
```

---

## Task 5: InsightsHero — header + search

**Files:**
- Create: `app/components/blog/InsightsHero.tsx`

Adapts `CareersHero`: eyebrow/title/lead from `BlogIndexCopy`, search strings from `InsightsChrome`. No form `action` attribute (search is purely client-side filtering).

- [ ] **Step 1: Implement** `app/components/blog/InsightsHero.tsx`

```tsx
"use client";

import type { FormEvent } from "react";
import type { BlogIndexCopy, InsightsChrome } from "@/app/content/blog";

function FilterIcon() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-[18px]" aria-hidden>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <line x1="0" y1="1" x2="18" y2="1" />
        <line x1="3" y1="6" x2="15" y2="6" />
        <line x1="6" y1="11" x2="12" y2="11" />
      </g>
    </svg>
  );
}

export function InsightsHero({
  copy, chrome, query, onQueryChange,
}: {
  copy: BlogIndexCopy;
  chrome: InsightsChrome;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pt-8 sm:px-8 sm:pt-12 md:px-12 md:pt-16 lg:px-20">
      <div className="flex flex-col gap-8 border-b border-ink pb-8 md:gap-12 md:flex-row md:items-end md:justify-between md:pb-10">
        <div className="flex min-w-0 flex-col">
          <p className="ds-eyebrow text-purple">{copy.eyebrow}</p>
          <h1 className="mt-5 font-display text-[44px] font-bold leading-[0.9] text-ink sm:text-[64px] md:text-[80px] lg:text-[96px]">
            {copy.title.join(" ")}
          </h1>
          <p className="mt-7 max-w-[600px] font-sans text-[16px] leading-[1.6] text-clay sm:text-[18px]">
            {copy.lead}
          </p>
        </div>
        <form className="flex w-full shrink-0 gap-3 md:w-auto" onSubmit={handleSubmit} role="search">
          <button
            type="submit"
            aria-label={chrome.searchButtonLabel}
            className="grid h-[50px] w-[52px] shrink-0 place-items-center border border-ink bg-bone text-ink transition-colors hover:bg-ink hover:text-bone focus-ring"
          >
            <FilterIcon />
          </button>
          <input
            name="q"
            aria-label={chrome.searchPlaceholder}
            placeholder={chrome.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-[50px] w-full min-w-0 border border-ink bg-bone px-4 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ink outline-none placeholder:text-purple/60 focus:border-purple md:w-[256px]"
          />
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/blog/InsightsHero.tsx
git commit -m "feat(insights): add InsightsHero header + search"
```

---

## Task 6: InsightsNewsletter + source-keyed subject

**Files:**
- Modify: `app/actions/newsletter.ts:26-54`
- Create: `app/components/blog/InsightsNewsletter.tsx`

- [ ] **Step 1: Make the action subject depend on a `source` field** in `app/actions/newsletter.ts`

Inside `submitNewsletterSignup`, after the email validation (`if (!/^.../.test(email)) return { ok: false };`), add:

```ts
  const source = singleLine(String(formData.get("source") ?? "careers"));
  const isInsights = source === "insights";
  const subjectHe = isInsights ? "הרשמה לעדכוני תובנות" : "הרשמה לעדכוני קריירה";
  const bodyHe = isInsights ? "נרשם/ה חדש/ה לעדכוני תובנות" : "נרשם/ה חדש/ה לעדכוני קריירה";
```

Then change the `sendEmail` call's `subject`/`text`/`html` to use them:

```ts
      subject: singleLine(`${subjectHe} — ${email}`),
      text: `${bodyHe}: ${email}`,
      html: `<p dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">${escapeHtml(bodyHe)}:<br><b>${escapeHtml(email)}</b></p>`,
```

(The careers form sends no `source`, so it defaults to `"careers"` — unchanged behavior.)

- [ ] **Step 2: Implement** `app/components/blog/InsightsNewsletter.tsx` (adapts `CareersNewsletter`, adds a hidden `source=insights` field)

```tsx
"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { InsightsChrome } from "@/app/content/blog";
import { submitNewsletterSignup } from "@/app/actions/newsletter";

export function InsightsNewsletter({ chrome }: { chrome: InsightsChrome }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await submitNewsletterSignup(data);
      if (res.ok) setSubmitted(true);
      else setError(chrome.newsletterError);
    });
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
      <div className="reveal grid gap-8 border-t-2 border-ink pt-12 md:grid-cols-[minmax(260px,460px)_1fr] md:items-center">
        <div>
          <h2 className="font-display text-[56px] font-bold leading-none text-ink sm:text-[80px] lg:text-[96px]">
            {chrome.newsletterTitle.join(" ")}
          </h2>
          <p className="mt-5 max-w-[460px] font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
            {chrome.newsletterBody}
          </p>
        </div>
        <div>
          <form className="grid gap-3 sm:grid-cols-[1fr_144px]" onSubmit={handleSubmit} noValidate>
            <input type="hidden" name="source" value="insights" />
            <input
              type="text" name="company_url" tabIndex={-1} autoComplete="off" aria-hidden
              className="absolute h-0 w-0 overflow-hidden opacity-0" style={{ insetInlineStart: "-9999px" }}
            />
            <input
              name="email" type="email" required disabled={submitted || isPending}
              aria-label={chrome.emailPlaceholder} placeholder={chrome.emailPlaceholder}
              className="h-[50px] min-w-0 border border-ink bg-bone px-4 font-sans text-[16px] font-light text-ink outline-none placeholder:text-clay/60 focus:border-purple disabled:opacity-60"
            />
            <button
              type="submit" disabled={submitted || isPending} aria-busy={isPending}
              className="h-[50px] bg-purple px-8 font-sans text-[14px] font-bold tracking-[0.08em] text-bone transition-colors hover:bg-purple/90 focus-ring disabled:bg-ink disabled:opacity-90"
            >
              {submitted ? "✓" : isPending ? "…" : chrome.newsletterCta}
            </button>
          </form>
          <p aria-live="polite" className={`mt-3 min-h-[1.25rem] font-sans text-[14px] ${error ? "text-magenta-deep" : "text-clay"}`}>
            {submitted ? chrome.newsletterSuccess : error ?? ""}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck + run the full unit suite**

Run: `npx tsc --noEmit && npm run test`
Expected: 0 type errors; all tests green.

- [ ] **Step 4: Commit**

```bash
git add app/actions/newsletter.ts app/components/blog/InsightsNewsletter.tsx
git commit -m "feat(insights): add InsightsNewsletter + source-keyed signup subject"
```

---

## Task 7: InsightsPageDesign — client shell

**Files:**
- Create: `app/components/blog/InsightsPageDesign.tsx`

Holds the search query, filters posts by title/excerpt/category-label, composes the sections. Mirrors `CareersPageDesign`.

- [ ] **Step 1: Implement** `app/components/blog/InsightsPageDesign.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/app/content/home";
import type { BlogIndexCopy, InsightsChrome, BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { InsightsHero } from "@/app/components/blog/InsightsHero";
import { InsightsBento } from "@/app/components/blog/InsightsBento";
import { InsightsNewsletter } from "@/app/components/blog/InsightsNewsletter";

export function InsightsPageDesign({
  posts, copy, chrome, labels, lang,
}: {
  posts: readonly LocalizedPost[];
  copy: BlogIndexCopy;
  chrome: InsightsChrome;
  labels: Record<BlogCategory, string>;
  lang: Lang;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.excerpt, labels[p.category]].join(" ").toLocaleLowerCase().includes(q),
    );
  }, [posts, labels, query]);

  return (
    <div className="bg-bone">
      <InsightsHero copy={copy} chrome={chrome} query={query} onQueryChange={setQuery} />
      <InsightsBento posts={visible} lang={lang} labels={labels} readLabel={copy.readMore} />
      <InsightsNewsletter chrome={chrome} />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/blog/InsightsPageDesign.tsx
git commit -m "feat(insights): add InsightsPageDesign client shell"
```

---

## Task 8: /blog index route

**Files:**
- Create: `app/[locale]/blog/page.tsx`

Server component: fetch posts + copy + labels + chrome (Sanity with fallback), render the shell inside `PlaceholderShell`, export metadata + static params. Pattern mirrors `app/[locale]/careers/page.tsx` and the existing `[slug]/page.tsx`.

- [ ] **Step 1: Implement** `app/[locale]/blog/page.tsx`

```tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { InsightsPageDesign } from "@/app/components/blog/InsightsPageDesign";
import { insightsChrome } from "@/app/content/blog";
import {
  getAllPosts, getBlogSettings, toBlogIndexCopy, toCategoryLabels, getChrome, toChrome,
} from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { pageSeo } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toBlogIndexCopy(await getBlogSettings(locale as Lang), locale as Lang);
  const title = copy.title.join(" ");
  return { title, description: copy.lead, ...pageSeo(locale, "/blog", title, copy.lead) };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const settings = await getBlogSettings(lang);
  const [posts, copy, labels, chrome] = [
    await getAllPosts(lang),
    toBlogIndexCopy(settings, lang),
    toCategoryLabels(settings, lang),
    toChrome(await getChrome(lang), lang),
  ];
  return (
    <PlaceholderShell chrome={chrome}>
      <InsightsPageDesign
        posts={posts}
        copy={copy}
        chrome={insightsChrome[lang]}
        labels={labels}
        lang={lang}
      />
    </PlaceholderShell>
  );
}
```

- [ ] **Step 2: Verify `pageSeo` signature**

Run: `sed -n '48,72p' lib/site.ts`
Expected: confirm `pageSeo(locale, route, title, description)` — adjust the call if the signature differs (it returns `{ title, alternates, openGraph }` merged via spread; if `title`/`description` aren't params, drop them from the call and keep `pageSeo(locale, "/blog")`).

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: 0 type errors; build succeeds; `/he/blog` and `/en/blog` appear in the route output.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/blog/page.tsx
git commit -m "feat(insights): add /blog index route"
```

---

## Task 9: Add /blog to sitemap

**Files:**
- Modify: `lib/site.ts:14-22` (`ROUTES`)

- [ ] **Step 1: Add `/blog` to `ROUTES`** in `lib/site.ts`

Insert `"/blog",` into the array (after `"/catalog",`):

```ts
export const ROUTES = [
  "",
  "/finishing",
  "/careers",
  "/catalog",
  "/blog",
  "/about",
  "/terms",
  "/privacy",
] as const;
```

- [ ] **Step 2: Build to confirm the sitemap generates**

Run: `npm run build`
Expected: build succeeds; no errors from `app/sitemap.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/site.ts
git commit -m "feat(insights): add /blog to sitemap routes"
```

---

## Task 10: Seed Sanity, e2e, and full verification

**Files:**
- Modify: existing Playwright e2e spec dir (locate with `ls tests || ls e2e || find . -name '*.spec.ts' -not -path '*/node_modules/*'`)

- [ ] **Step 1: Patch the live Sanity nav**

Run: `npx tsx scripts/rename-journal-to-insights-nav.ts`
Expected: logs `⟳ ... → "תובנות" (/blog)` for each siteSettings doc. (Requires `SANITY_API_WRITE_TOKEN` in `.env.local`.)

- [ ] **Step 2: Seed posts + copy to Sanity**

Run: `npm run seed`
Expected: completes without error; the two new posts (`post-from-sketch-to-prototype-{he,en}`, `post-display-windows-{he,en}`) are created and their images uploaded. `seed-all.ts` iterates `blogPosts`, so the new entries seed automatically.

- [ ] **Step 3: Add an e2e check** for the index in the located spec dir (e.g. `tests/insights.spec.ts`)

```ts
import { test, expect } from "@playwright/test";

for (const { locale, heading } of [
  { locale: "he", heading: "תובנות" },
  { locale: "en", heading: "Insights" },
]) {
  test(`/${locale}/blog renders the Insights index`, async ({ page }) => {
    await page.goto(`/${locale}/blog`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    // at least the 6 bento cards link to articles
    const cards = page.locator(`a[href*="/${locale}/blog/"]`);
    await expect(cards.first()).toBeVisible();
  });
}
```

- [ ] **Step 4: Run the full verification gates**

Run each; all must pass:
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test
npm run test:e2e
```
Expected: lint clean, 0 type errors, build succeeds, Vitest green, Playwright green (`/he/blog` + `/en/blog`).

- [ ] **Step 5: Visual verification in the browser preview**

Start the dev server and inspect both locales:
- `/he/blog` (RTL): hero, 6-card bento balanced with no empty grid gaps, newsletter; category chips colored; images load (no Figma placeholders).
- `/en/blog` (LTR): same, mirrored.
- Nav shows "תובנות / Insights" and links to `/blog`.
- Click a card → lands on `/blog/[slug]`.

If the grid looks uneven, adjust the `lg:grid-rows-[...]` heights / card spans in `InsightsBento.tsx`; if 8 cards reads better than 6, add 2 more posts (Task 3 pattern) and extend the grid with a second bottom row. Re-verify.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "test(insights): seed posts + e2e for /blog index"
```

---

## Self-review notes (for the implementer)

- **Spec coverage:** name rename (T1/T2), route `/blog` (T8), nav repoint (T2), bento (T4), hero+search (T5/T7), newsletter (T6), 2 new posts + Sanity seed (T3/T10), photos via `post.image` (T4), sitemap (T9), list-section dropped (not built — intentional per spec).
- **Type consistency:** `LocalizedPost` (from `sanity/queries.ts`), `BlogIndexCopy` + `InsightsChrome` + `BlogCategory` (from `app/content/blog.ts`), `categoryChipClass` keyed by `BlogCategory`. `readLabel` = `copy.readMore`. `labels` = `Record<BlogCategory, string>` from `toCategoryLabels`.
- **Careers untouched:** all new files under `app/components/blog/`; only shared edit is `newsletter.ts` (backward-compatible default `source="careers"`).
- **Risk:** `getAllPosts()` prefers Sanity — Step 2/T10 (`npm run seed`) is required for the new posts to show wherever Sanity has data; CDN cache means ~30-60s lag after seeding.
