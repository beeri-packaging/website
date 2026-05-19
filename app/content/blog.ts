/**
 * Blog content layer (placeholder).
 *
 * Each post is intentionally minimal — a slug, a date, a category tag, an
 * excerpt and a few placeholder paragraphs. When a CMS lands these will be
 * fetched async; the post-page component already reads through this module.
 */

import type { Lang } from "@/app/content/home";

export type BlogCategory =
  | "structural"
  | "trends"
  | "sustainability"
  | "floor"
  | "studio";

export type BlogLocalized = {
  category: string;
  title: string;
  excerpt: string;
  /** Body paragraphs — keep short, the page renders one <p> per entry. */
  body: readonly string[];
};

export type BlogPost = {
  slug: string;
  /** ISO date string. Used in the article header + sort. */
  date: string;
  /** Estimated read time, localized. */
  read: { he: string; en: string };
  /** Category key — drives the eyebrow color. */
  category: BlogCategory;
  /** Optional image path. If omitted, a tinted brand-color block is used. */
  image?: string;
  he: BlogLocalized;
  en: BlogLocalized;
};

export type BlogIndexCopy = {
  eyebrow: string;
  title: readonly [string] | readonly [string, string];
  lead: string;
  body: string;
  comingSoon: string;
  readMore: string;
  backToBlog: string;
  publishedOn: string;
  notFoundTitle: string;
  notFoundBody: string;
};

export const blogIndexCopy: Record<Lang, BlogIndexCopy> = {
  he: {
    eyebrow: "יומן הסטודיו · בקרוב",
    title: ["יומן בארי", "אריזות"],
    lead: "מחשבות, מדריכים והצצות מהסטודיו ומהמפעל.",
    body:
      "כאן נפרסם בקביעות פוסטים על תכנון מבני, חומרי גלם, השבחות, פרויקטים שעובדים עליהם ומגמות בעיצוב אריזה. הפוסטים למטה הם הצצה לקראת ההשקה.",
    comingSoon: "הכותרים למטה הם פלייסהולדרים — הפוסטים האמיתיים בעריכה.",
    readMore: "לקריאה",
    backToBlog: "חזרה לכל הפוסטים",
    publishedOn: "פורסם",
    notFoundTitle: "הפוסט עדיין לא פורסם",
    notFoundBody:
      "הכותר הזה שמור לפוסט עתידי בבלוג של בארי אריזות. בקרוב כאן יהיה תוכן מלא — בינתיים אפשר לחזור לאינדקס.",
  },
  en: {
    eyebrow: "Studio journal · Coming soon",
    title: ["The Beeri", "journal"],
    lead: "Notes, guides and glimpses from the studio and the floor.",
    body:
      "We'll publish regularly on structural design, materials, finishing, in-flight projects and packaging design trends. The posts below are a preview ahead of launch.",
    comingSoon: "The titles below are placeholders — the real posts are in edit.",
    readMore: "Read",
    backToBlog: "Back to all posts",
    publishedOn: "Published",
    notFoundTitle: "Post not yet published",
    notFoundBody:
      "This slot is reserved for a future Beeri Packaging post. Real content is on its way — for now, head back to the index.",
  },
};

export const categoryLabels: Record<BlogCategory, { he: string; en: string }> = {
  structural: { he: "תכנון מבני", en: "Structural" },
  trends: { he: "מגמות עיצוב", en: "Trends" },
  sustainability: { he: "קיימות", en: "Sustainability" },
  floor: { he: "מהמפעל", en: "From the floor" },
  studio: { he: "מהסטודיו", en: "Studio" },
};

/**
 * Maps a category to a Tailwind background-color class for the eyebrow chip.
 * Kept inline with the brand palette in globals.css.
 */
export const categoryChipClass: Record<BlogCategory, string> = {
  structural: "bg-cyan text-cyan-deep",
  trends: "bg-magenta text-bone",
  sustainability: "bg-yellow text-cyan-deep",
  floor: "bg-purple text-bone",
  studio: "bg-gold text-gold-deep",
};

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "anatomy-of-a-wine-carton",
    date: "2026-05-12",
    read: { he: "4 דק׳ קריאה", en: "4 min read" },
    category: "structural",
    he: {
      category: "תכנון מבני",
      title: "האנטומיה של אריזת יין",
      excerpt:
        "מה הופך אריזת יין טובה — מהדייליין הראשון ועד הקופסה שמגיעה לחנות?",
      body: [
        "אריזת יין טובה מתחילה הרבה לפני הדפוס. היא מתחילה בשאלות פשוטות: מה גובה הבקבוק, מה הקוטר, איך הצרכן יחזיק אותה בחנות, ואיך היא תיארז על משטח.",
        "במאמר הזה נפרק את שלבי התכנון של אריזת יין מקרטון 350 גרם — מהאפיון הראשוני, דרך הדייליין הראשון, הדוגמה הדיגיטלית, הדפוס וההשבחות, ועד הרון הסופי.",
        "הפוסט המלא בעריכה — בינתיים זה השלד. נחזור עם תיעוד נרחב, כולל קבצי דייליין, צילומים מהמפעל ולומדה קצרה על מה משפיע על המחיר.",
      ],
    },
    en: {
      category: "Structural",
      title: "Anatomy of a wine carton",
      excerpt:
        "What makes a wine carton work — from the first dieline to the box on the shelf.",
      body: [
        "A good wine carton starts long before the press. It starts with simple questions: bottle height, neck diameter, how the customer holds it on the shelf, and how the carton palletizes for shipping.",
        "In this post we'll unpack the design stages of a 350gsm wine carton — from the brief, through the first dieline, the digital prototype, print and finishing, all the way to the final run.",
        "The full piece is in edit — this is the skeleton. We'll come back with deep documentation, dieline files, factory photos and a short primer on what drives price.",
      ],
    },
  },
  {
    slug: "foil-vs-spot-uv",
    date: "2026-04-28",
    read: { he: "3 דק׳ קריאה", en: "3 min read" },
    category: "trends",
    he: {
      category: "מגמות עיצוב",
      title: "פויל מול ספוט יו-וי — מתי מה?",
      excerpt:
        "שתי השבחות שמשנות מותג. הבדל אחד גדול שכדאי להכיר.",
      body: [
        "פויל וספוט UV נראים לפעמים כמו אלטרנטיבות, אבל הם עושים שני דברים שונים לחלוטין. אחד מוסיף מתכת לדפוס, השני מוסיף הברקה ועומק.",
        "בפוסט נדבר על מתי כל טכניקה מצדיקה את עצמה — לפי קטגוריית מוצר, תקציב, ולוח זמנים — ועל שילובים נפוצים שעובדים יותר טוב מכל אחד מהם בנפרד.",
        "השלמת הפוסט כוללת דוגמאות צילום, מחירון משוואתי וטיפים לתכנון קובץ אומנות שתומך בשני העולמות.",
      ],
    },
    en: {
      category: "Trends",
      title: "Foil vs. spot UV — when to use which",
      excerpt:
        "Two finishes that move a brand. One big difference worth knowing.",
      body: [
        "Foil and spot UV are sometimes treated as alternatives, but they do very different things. One adds metal to the print, the other adds gloss and depth.",
        "In this post we'll cover when each technique earns its keep — by product category, budget and timeline — and the common combinations that beat either one on its own.",
        "The final piece will include photographic samples, a comparative price sheet and tips for prepping artwork that supports both.",
      ],
    },
  },
  {
    slug: "recyclable-stock-2026",
    date: "2026-04-09",
    read: { he: "5 דק׳ קריאה", en: "5 min read" },
    category: "sustainability",
    he: {
      category: "קיימות",
      title: "חומרי קרטון בני-מיחזור ב-2026",
      excerpt:
        "מה השוק מציע השנה — וכיצד מותג בוחר חומר בלי לאבד חוויה.",
      body: [
        "השוק הישראלי של קרטון בר-מיחזור התרחב משמעותית בשנים האחרונות. אפשר היום למצוא קרטוני FSC במגוון משקלים, גימורים ומקורות סיבים שלא היו זמינים בעבר.",
        "בפוסט נמפה את האפשרויות, נתאר מה ההבדל בין FSC, PEFC ו-recycled, ונראה איך מותגים אצלנו בוחרים חומר בלי לוותר על הרגשה פרימיום.",
        "הפוסט המלא יכלול טבלת השוואה, המלצות נקודתיות לפי קטגוריות מוצר, ודיון על תקנים ירוקים שצפויים להיכנס לתוקף.",
      ],
    },
    en: {
      category: "Sustainability",
      title: "Recyclable stock in 2026",
      excerpt:
        "What the market offers this year — and how to pick a stock without losing the feel.",
      body: [
        "The Israeli market for recyclable board has grown meaningfully in the last few years. FSC stocks across a wide range of weights, finishes and fiber sources are now reachable in ways they weren't before.",
        "In this post we'll map the options, explain the difference between FSC, PEFC and recycled, and walk through how our clients pick stock without sacrificing a premium feel.",
        "The final piece will include a comparison table, category-specific recommendations and a discussion of upcoming green standards.",
      ],
    },
  },
  {
    slug: "press-floor-notebook",
    date: "2026-03-22",
    read: { he: "3 דק׳ קריאה", en: "3 min read" },
    category: "floor",
    he: {
      category: "מהמפעל",
      title: "פנקס מהמפעל — מרץ 2026",
      excerpt:
        "הצצה לעבודה השוטפת ביבנה: שלוש הזמנות, ארבעה דרכי דפוס, חמש דוגמאות.",
      body: [
        "כל חודש אנחנו אוספים פנקס קצר מהמפעל — מה רץ, איזה לקוחות במחזור, אילו בעיות עלו ומה למדנו.",
        "במהדורת מרץ נראה הזמנת קפסולות קפה שדרשה השבחת פויל קר על שטח גדול, אריזת בושם עם שטנץ מורכב, ועדכון חומר על קו פארמה ותיק.",
        "הפוסט עוד לא נכתב במלואו — אנחנו ממתינים לאישור צילום מהקווים.",
      ],
    },
    en: {
      category: "From the floor",
      title: "Press-floor notebook — March 2026",
      excerpt:
        "A snapshot from Yavne: three jobs, four print paths, five samples.",
      body: [
        "Every month we collect a short notebook from the factory — what's running, who's in rotation, what came up and what we learned.",
        "In the March edition we'll cover a coffee-capsule run that called for cold foil across large flood areas, a fragrance carton with a complex die, and a stock change on a long-running pharma line.",
        "Full write-up is pending — we're waiting on photo clearance from the lines.",
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
