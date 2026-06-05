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

/** A pull-quote with its citation, rendered beside an image in the article. */
export type BlogQuote = { text: string; cite: string };

/** A numbered article section — heading + body, with an optional inline image. */
export type BlogSection = {
  heading: string;
  body: string;
  /** Optional inline image path, rendered full-width under the section. */
  image?: string;
};

export type BlogLocalized = {
  category: string;
  title: string;
  /** Hero subtitle + card description. */
  excerpt: string;
  /** Lead paragraphs — rendered above the numbered sections. */
  body: readonly string[];
  /** Optional pull-quote shown beside the quote image. */
  quote?: BlogQuote;
  /** Numbered sections (auto-numbered 01, 02 …) that make up the article. */
  sections?: readonly BlogSection[];
};

export type BlogPost = {
  slug: string;
  /** ISO date string. Used in the article header + sort. */
  date: string;
  /** Estimated read time, localized. */
  read: { he: string; en: string };
  /** Category key — drives the eyebrow color. */
  category: BlogCategory;
  /** Optional hero image path. If omitted, a tinted brand-color block is used. */
  image?: string;
  /** Author label ("written by") — shared across locales unless overridden. */
  author?: { he: string; en: string };
  /** Photo / production credit — shared across locales. */
  credit?: { he: string; en: string };
  /** Image rendered beside the pull-quote. */
  quoteImage?: string;
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

/** Shared author/credit labels — most posts come from the studio + floor. */
const STUDIO = { he: "סטודיו בארי", en: "Beeri Studio" };
const FLOOR = { he: "מחלקת ייצור", en: "Production floor" };

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "finishing-language",
    date: "2026-05-20",
    read: { he: "6 דקות", en: "6 min read" },
    category: "trends",
    image: "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
    author: STUDIO,
    credit: FLOOR,
    quoteImage:
      "/images/generated/website-content/finishing/syrah-foil-detail-v1.png",
    he: {
      category: "מגמות עיצוב",
      title: "שפת הגימור",
      excerpt:
        "איך פויל, לכה והבלטה הופכים אריזת קרטון פשוטה לחוויית פרימיום שמרגישים עוד לפני השימוש.",
      body: [
        "אריזה טובה היא לא קישוט. היא עוזרת למותג להגיד משהו ברור — יוקרה, ניקיון, טבעיות או חגיגיות. במארזי קוסמטיקה, פארמה ויין הגימור הוא חלק מהמסר, ולא רק עיטור על הקרטון.",
        "כאן נכנסות השבחות הדפוס: פויל, לכה סלקטיבית והבלטה שמוסיפים מגע, ברק ועומק — ומעלים את הערך הנתפס של המוצר עוד לפני שפותחים אותו.",
      ],
      quote: {
        text: "האריזה היא המפגש הראשון בין המותג ללקוח — וכשהגימור מדויק, המוצר מרגיש נכון עוד לפני השימוש.",
        cite: "— מתוך הבלוג של בארי אריזות",
      },
      sections: [
        {
          heading: "מה הלקוח רואה ומרגיש",
          body: "באריזות פרימיום הלקוח לא רק מסתכל. הוא מחזיק, פותח ומעביר אצבע על הלוגו ומרגיש את החומר. זה רגע קטן, אבל הוא משפיע ישירות על הערך הנתפס של המוצר. לכה שמבליטה פרט, פויל שמחזיר אור או הבלטה שמוסיפה עומק — כל אחד מהם גורם לאריזה להרגיש מושקעת יותר.",
          image:
            "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
        },
        {
          heading: "לכה, פויל והבלטה",
          body: "לכה סלקטיבית מוחלת על אזורים מסוימים בלבד, להדגשת לוגו או פרט גרפי. פויל מוסיף ברק ונוכחות מטאלית כנקודת מוקד ברורה. הבלטה ודיבוס יוצרים תחושת מגע ועומק. שימוש מדוד תמיד עדיף על עומס — אזור אחד מדויק שווה יותר מהכול.",
        },
      ],
    },
    en: {
      category: "Trends",
      title: "The language of finishing",
      excerpt:
        "How foil, lacquer and emboss turn a plain carton into a premium experience you feel before you even open it.",
      body: [
        "Good packaging isn't decoration. It helps a brand say something clear — luxury, cleanliness, natural, or celebration. On cosmetics, pharma and wine cartons, the finish is part of the message, not just an ornament on the board.",
        "This is where print finishing comes in: foil, spot lacquer and emboss add touch, shine and depth — raising the product's perceived value before anyone even opens it.",
      ],
      quote: {
        text: "The package is the first meeting between a brand and its customer — when the finish is precise, the product feels right before it's even used.",
        cite: "— From the Beeri Packaging journal",
      },
      sections: [
        {
          heading: "What the customer sees and feels",
          body: "On premium packaging the customer doesn't just look. They hold it, open it, run a finger over the logo and feel the material. It's a small moment, but it directly shapes the product's perceived value. A lacquer that lifts a detail, a foil that catches the light, or an emboss that adds depth — each one makes the package feel more considered.",
          image:
            "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
        },
        {
          heading: "Lacquer, foil and emboss",
          body: "Spot lacquer is applied only to chosen areas, to highlight a logo or a graphic detail. Foil adds shine and a metallic presence as a clear focal point. Emboss and deboss create touch and depth. Restraint always beats overload — one precise area is worth more than covering everything.",
        },
      ],
    },
  },
  {
    slug: "anatomy-of-a-wine-carton",
    date: "2026-05-12",
    read: { he: "5 דקות", en: "5 min read" },
    category: "structural",
    image:
      "/images/generated/website-content/packaging/gold-wine-insert-handle-box.png",
    author: STUDIO,
    credit: FLOOR,
    quoteImage: "/images/figma/catalog/wine.png",
    he: {
      category: "תכנון מבני",
      title: "האנטומיה של אריזת יין",
      excerpt:
        "מה הופך אריזת יין טובה — מהדייליין הראשון ועד הקופסה שמגיעה למדף?",
      body: [
        "אריזת יין טובה מתחילה הרבה לפני הדפוס. היא מתחילה בשאלות פשוטות: מה גובה הבקבוק, מה קוטר הצוואר, איך הלקוח יחזיק את הקופסה במדף ואיך היא תיארז על משטח.",
        "כל החלטה כזו משפיעה על המבנה, על כמות הקרטון ועל המחיר הסופי — ולכן התכנון המבני הוא הלב של אריזת יין מצליחה.",
      ],
      quote: {
        text: "אריזה של יין נמדדת ברגע שמרימים אותה מהמדף — היא צריכה להרגיש יציבה, נקייה ובטוחה.",
        cite: "— מתוך הבלוג של בארי אריזות",
      },
      sections: [
        {
          heading: "מהבקבוק לדייליין",
          body: "מודדים את הבקבוק, מוסיפים מרווחי בטיחות ובונים דייליין ראשוני. כאן נקבעים סוג הסגירה, חוזק הדפנות והאם צריך מגירה פנימית או חוצץ שיחזיק את הבקבוק במקום. דייליין מדויק חוסך תיקונים יקרים בהמשך.",
          image:
            "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
        },
        {
          heading: "חומר, דפוס והשבחה",
          body: "אחרי שהמבנה נעול בוחרים קרטון במשקל מתאים, מתאימים את הדפוס לגוון התווית ומוסיפים השבחה נקודתית — פויל על הלוגו או לכה שמדגישה את שם היקב. השילוב הנכון בין מבנה לגימור הוא מה שגורם לאריזה להרגיש יקרה.",
        },
      ],
    },
    en: {
      category: "Structural",
      title: "Anatomy of a wine carton",
      excerpt:
        "What makes a wine carton work — from the first dieline to the box on the shelf.",
      body: [
        "A good wine carton starts long before the press. It starts with simple questions: bottle height, neck diameter, how the customer holds the box on the shelf, and how it palletizes for shipping.",
        "Every one of those decisions shapes the structure, the amount of board used and the final price — which is why structural design is the heart of a successful wine carton.",
      ],
      quote: {
        text: "A wine package is judged the moment it's lifted off the shelf — it has to feel stable, clean and secure.",
        cite: "— From the Beeri Packaging journal",
      },
      sections: [
        {
          heading: "From bottle to dieline",
          body: "We measure the bottle, add safety clearances and build a first dieline. This is where the closure type, wall strength and whether an inner drawer or insert is needed get decided. A precise dieline saves expensive corrections down the line.",
          image:
            "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
        },
        {
          heading: "Stock, print and finish",
          body: "Once the structure is locked we pick board at the right weight, tune the print to the label's palette and add a focused finish — foil on the logo or a lacquer that lifts the winery name. The right balance of structure and finish is what makes a carton feel expensive.",
        },
      ],
    },
  },
  {
    slug: "recyclable-stock-2026",
    date: "2026-04-28",
    read: { he: "5 דקות", en: "5 min read" },
    category: "sustainability",
    image:
      "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
    author: STUDIO,
    credit: FLOOR,
    quoteImage:
      "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
    he: {
      category: "קיימות",
      title: "חומרי קרטון בני-מיחזור ב-2026",
      excerpt:
        "מה השוק מציע השנה — ואיך בוחרים חומר בלי לוותר על תחושת פרימיום.",
      body: [
        "השוק הישראלי של קרטון בר-מיחזור התרחב מאוד בשנים האחרונות. אפשר היום למצוא קרטוני FSC במגוון משקלים, גימורים ומקורות סיבים שלא היו זמינים בעבר.",
        "האתגר כבר אינו זמינות, אלא בחירה נכונה: איך שומרים על מראה ומגע יוקרתיים גם כשעוברים לחומר ירוק.",
      ],
      quote: {
        text: "קיימות לא חייבת לבוא על חשבון החוויה — חומר נכון נראה ומרגיש פרימיום בדיוק כמו קרטון רגיל.",
        cite: "— מתוך הבלוג של בארי אריזות",
      },
      sections: [
        {
          heading: "FSC, ממוחזר ומה שביניהם",
          body: "תקן FSC מעיד על ייעור בר-קיימא, קרטון ממוחזר חוסך בסיבים חדשים, ויש גם שילובים של השניים. ההבדל מורגש במחיר, בגוון הבסיס ובטקסטורה — ולכן בוחרים חומר לפי הקטגוריה והמסר של המותג, לא לפי כותרת ירוקה בלבד.",
          image:
            "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
        },
        {
          heading: "לשמור על תחושת פרימיום",
          body: "גם בחומר ירוק אפשר להגיע לגימור עשיר: לכה מאט שמרגיעה את המראה, הבלטה שמוסיפה מגע או פויל מבוסס חומרים ממוחזרים. לפעמים דווקא המרקם הטבעי של הקרטון הממוחזר הופך ליתרון שיווקי שמספר את סיפור הקיימות בלי מילה אחת.",
        },
      ],
    },
    en: {
      category: "Sustainability",
      title: "Recyclable stock in 2026",
      excerpt:
        "What the market offers this year — and how to pick a stock without losing the premium feel.",
      body: [
        "The Israeli market for recyclable board has grown a lot in recent years. FSC stocks across a wide range of weights, finishes and fiber sources are now reachable in ways they weren't before.",
        "The challenge is no longer availability, but choosing well: how to keep a luxurious look and feel even when moving to a greener material.",
      ],
      quote: {
        text: "Sustainability doesn't have to come at the cost of experience — the right stock looks and feels just as premium as conventional board.",
        cite: "— From the Beeri Packaging journal",
      },
      sections: [
        {
          heading: "FSC, recycled and the space between",
          body: "FSC certifies responsible forestry, recycled board saves virgin fiber, and there are blends of the two. The difference shows up in price, base shade and texture — so we pick stock by the brand's category and message, not by a green label alone.",
          image:
            "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
        },
        {
          heading: "Keeping the premium feel",
          body: "Even on a green stock you can reach a rich finish: a matte lacquer that calms the look, an emboss that adds touch, or recycled-content foil. Sometimes the natural texture of recycled board becomes the marketing advantage itself — telling the sustainability story without a single word.",
        },
      ],
    },
  },
  {
    slug: "digital-vs-offset",
    date: "2026-04-09",
    read: { he: "5 דקות", en: "5 min read" },
    category: "floor",
    image:
      "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
    author: STUDIO,
    credit: { he: "צוות הדפוס", en: "Press team" },
    quoteImage:
      "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png",
    he: {
      category: "מהמפעל",
      title: "דפוס דיגיטלי או אופסט",
      excerpt:
        "איך בוחרים בין דפוס דיגיטלי לאופסט לפי כמות, גוונים ולוח זמנים.",
      body: [
        "אחת השאלות הראשונות בכל פרויקט אריזה היא איך מדפיסים אותו. דיגיטלי ואופסט הם שני עולמות שונים, וכל אחד מצטיין בסיטואציה אחרת.",
        "הבחירה הנכונה חוסכת זמן וכסף — ולכן כדאי להבין את ההבדלים עוד לפני שמתחילים בעיצוב.",
      ],
      quote: {
        text: "אין דפוס ״טוב יותר״ — יש דפוס שמתאים יותר לכמות, ללוח הזמנים ולגוונים של הפרויקט.",
        cite: "— מתוך הבלוג של בארי אריזות",
      },
      sections: [
        {
          heading: "דיגיטלי: מהיר וגמיש",
          body: "דפוס דיגיטלי מתאים לסדרות קצרות, לגרסאות מרובות ולפיילוטים. אין צורך בלוחות, ההכנה מהירה ואפשר לשנות גרפיקה בין יחידה ליחידה — מושלם להשקות, למהדורות מוגבלות ולבדיקות שוק לפני ייצור גדול.",
          image:
            "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
        },
        {
          heading: "אופסט: עקבי ומשתלם בכמות",
          body: "כשהכמויות גדלות, אופסט מנצח: עלות נמוכה יותר ליחידה, גוונים מדויקים וחוזרים על עצמם, ותמיכה מלאה בצבעי פנטון ובהשבחות מורכבות. זו הבחירה לקווים קבועים ולמותגים עם דרישות צבע מחמירות.",
        },
      ],
    },
    en: {
      category: "From the floor",
      title: "Digital or offset",
      excerpt:
        "How to choose between digital and offset by quantity, color and timeline.",
      body: [
        "One of the first questions on any packaging project is how to print it. Digital and offset are two different worlds, and each shines in a different situation.",
        "The right choice saves time and money — so it's worth understanding the differences before design even begins.",
      ],
      quote: {
        text: "There's no “better” press — there's one that fits the run length, the timeline and the colors of the project.",
        cite: "— From the Beeri Packaging journal",
      },
      sections: [
        {
          heading: "Digital: fast and flexible",
          body: "Digital print suits short runs, many variants and pilots. No plates are needed, setup is quick, and artwork can change from one unit to the next — ideal for launches, limited editions and market tests before a large production run.",
          image:
            "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
        },
        {
          heading: "Offset: consistent and cost-effective at scale",
          body: "As quantities grow, offset wins: a lower cost per unit, precise and repeatable colors, and full support for Pantone inks and complex finishing. It's the choice for standing lines and brands with strict color requirements.",
        },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
