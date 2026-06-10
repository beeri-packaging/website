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
    eyebrow: "יומן · מהסטודיו ומהמפעל",
    title: ["יומן", "מהסטודיו"],
    lead: "מדריכים, מחשבות והצצות מתהליך העבודה — מהתכנון המבני ועד הדפוס וההשבחה.",
    body:
      "כאן אנחנו כותבים על תכנון מבני, חומרי גלם, השבחות ומגמות בעיצוב אריזה — מבט מקרוב מהצוות שמתכנן, מדפיס ומייצר.",
    comingSoon: "הכותרים למטה הם דוגמאות — הפוסטים המלאים בעריכה.",
    readMore: "לקריאה",
    backToBlog: "חזרה לכל הפוסטים",
    publishedOn: "פורסם",
    notFoundTitle: "הפוסט עדיין לא פורסם",
    notFoundBody:
      "הכותר הזה שמור לפוסט עתידי ביומן של בארי אריזות. בקרוב כאן יהיה תוכן מלא — בינתיים אפשר לחזור לרשימה.",
  },
  en: {
    eyebrow: "Journal · from the studio & the floor",
    title: ["The", "Journal"],
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
};

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
    searchPlaceholder: "חיפוש ביומן",
    searchButtonLabel: "חיפוש",
    newsletterTitle: ["עדכוני", "יומן"],
    newsletterBody:
      "רוצים לקבל פוסט חדש כשהוא עולה? השאירו כתובת מייל ונעדכן.",
    emailPlaceholder: "כתובת מייל",
    newsletterCta: "הרשמה",
    newsletterSuccess: "נרשמתם — נעדכן כשיעלה פוסט חדש.",
    newsletterError: "ההרשמה נכשלה. ניתן לנסות שוב.",
  },
  en: {
    searchPlaceholder: "Search the journal",
    searchButtonLabel: "Search",
    newsletterTitle: ["Journal", "updates"],
    newsletterBody:
      "Want each new post as it goes live? Leave your email and we'll let you know.",
    emailPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    newsletterSuccess: "You're in — we'll email you when a new post is live.",
    newsletterError: "Signup failed. Please try again.",
  },
};

export const categoryLabels: Record<BlogCategory, { he: string; en: string }> = {
  structural: { he: "תכנון מבני", en: "Structural" },
  trends: { he: "מגמות עיצוב", en: "Design trends" },
  sustainability: { he: "קיימות", en: "Sustainability" },
  floor: { he: "מהמפעל", en: "From the floor" },
  studio: { he: "מהסטודיו", en: "From the studio" },
};

/**
 * Maps a category to a Tailwind background-color class for the eyebrow chip.
 * Kept inline with the brand palette in globals.css.
 */
export const categoryChipClass: Record<BlogCategory, string> = {
  structural: "bg-cyan text-cyan-deep",
  // magenta-deep (not plain magenta) so bone text clears WCAG AA — plain magenta
  // is decorative-only (~3.8:1 on bone); magenta-deep is the accessible token.
  trends: "bg-magenta-deep text-bone",
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
      title: "שפת ההשבחות",
      excerpt:
        "איך פויל, לכה סלקטיבית והבלטה הופכים אריזת קרטון מתקפלת פשוטה לחוויית פרימיום שמרגישים עוד לפני הפתיחה.",
      body: [
        "אריזה טובה היא לא קישוט. היא עוזרת למותג להגיד משהו ברור — יוקרה, נקיות, טבעיות או חגיגיות. באריזות קוסמטיקה, פארמה ויין ההשבחה היא חלק מהמסר, לא עיטור על הקרטון.",
        "כאן נכנסות השבחות הדפוס: פויל, לכה סלקטיבית והבלטה, שמוסיפות מגע, ברק ועומק ומעלות את הערך הנתפס של המוצר עוד לפני שפותחים אותו.",
      ],
      quote: {
        text: "האריזה היא המפגש הראשון בין המותג ללקוח — וכשההשבחה מדויקת, המוצר מרגיש נכון עוד לפני השימוש.",
        cite: "— מתוך היומן של בארי אריזות",
      },
      sections: [
        {
          heading: "מה הלקוח רואה ומרגיש",
          body: "באריזות פרימיום הלקוח לא רק מסתכל. הוא מחזיק, פותח, מעביר אצבע על הלוגו ומרגיש את החומר. רגע קטן, אבל הוא משפיע ישירות על הערך הנתפס של המוצר. לכה שמבליטה פרט, פויל שמחזיר אור או הבלטה שמוסיפה עומק — כל אחד מהם גורם לאריזה להרגיש מושקעת יותר.",
          image:
            "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
        },
        {
          heading: "לכה, פויל והבלטה",
          body: "לכה סלקטיבית מוחלת על אזורים נבחרים בלבד, להדגשת לוגו או פרט גרפי. פויל מוסיף ברק ונוכחות מטאלית כנקודת מוקד ברורה. הבלטה ודיבוס יוצרים מגע ועומק. שימוש מדוד עדיף תמיד על עומס — אזור אחד מדויק שווה יותר מהכול.",
        },
      ],
    },
    en: {
      category: "Design trends",
      title: "The language of finishing",
      excerpt:
        "How foil, spot varnish and emboss turn a plain folding carton into a premium experience you feel before you open it.",
      body: [
        "Good packaging isn't decoration. It helps a brand say something clear — luxury, cleanliness, natural, or celebration. On cosmetics, pharma and wine cartons, the finish is part of the message, not an ornament on the board.",
        "This is where print finishing comes in: foil, spot varnish and emboss add touch, shine and depth, and raise the product's perceived value before anyone opens it.",
      ],
      quote: {
        text: "The package is the first meeting between a brand and its customer — when the finish is precise, the product feels right before it's even used.",
        cite: "— From the Beeri Packaging journal",
      },
      sections: [
        {
          heading: "What the customer sees and feels",
          body: "On premium packaging the customer doesn't just look. They hold it, open it, run a finger over the logo and feel the material. A small moment, but one that directly shapes the product's perceived value. A varnish that lifts a detail, a foil that catches the light, an emboss that adds depth — each makes the package feel more considered.",
          image:
            "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
        },
        {
          heading: "Varnish, foil and emboss",
          body: "Spot varnish is applied only to chosen areas, to highlight a logo or a graphic detail. Foil adds shine and a metallic presence as a clear focal point. Emboss and deboss create touch and depth. Restraint always beats overload — one precise area is worth more than covering everything.",
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
        "מה הופך אריזת יין טובה — מהדייליין הראשון ועד הקופסה שמגיעה למדף.",
      body: [
        "אריזת יין טובה מתחילה הרבה לפני הדפוס. היא מתחילה בשאלות פשוטות: מה גובה הבקבוק, מה קוטר הצוואר, איך הלקוח יחזיק את הקופסה במדף ואיך היא תיארז על משטח.",
        "כל החלטה כזו משפיעה על המבנה, על כמות הקרטון ועל המחיר הסופי — ולכן התכנון המבני הוא הלב של אריזת יין מצליחה.",
      ],
      quote: {
        text: "אריזת יין נמדדת ברגע שמרימים אותה מהמדף — היא צריכה להרגיש יציבה, נקייה ובטוחה.",
        cite: "— מתוך היומן של בארי אריזות",
      },
      sections: [
        {
          heading: "מהבקבוק לדייליין",
          body: "מודדים את הבקבוק, מוסיפים מרווחי בטיחות ובונים דייליין ראשוני. כאן נקבעים סוג הסגירה, חוזק הדפנות והשאלה אם צריך מגירה פנימית או חוצץ שיחזיק את הבקבוק במקום. דייליין מדויק חוסך תיקונים יקרים בהמשך.",
          image:
            "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
        },
        {
          heading: "חומר, דפוס והשבחה",
          body: "אחרי שהמבנה נעול בוחרים קרטון במשקל מתאים, מתאימים את הדפוס לגוון התווית ומוסיפים השבחה נקודתית — פויל על הלוגו או לכה שמדגישה את שם היקב. השילוב הנכון בין מבנה להשבחה הוא מה שגורם לאריזה להרגיש יקרה.",
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
        "האתגר כבר אינו זמינות, אלא בחירה נכונה: איך שומרים על מראה ומגע יוקרתיים גם במעבר לחומר בר-קיימא.",
      ],
      quote: {
        text: "קיימות לא חייבת לבוא על חשבון החוויה — חומר נכון נראה ומרגיש פרימיום בדיוק כמו קרטון רגיל.",
        cite: "— מתוך היומן של בארי אריזות",
      },
      sections: [
        {
          heading: "FSC, ממוחזר ומה שביניהם",
          body: "תקן FSC מעיד על ייעור בר-קיימא, קרטון ממוחזר חוסך בסיבים חדשים, ויש גם שילובים של השניים. ההבדל מורגש במחיר, בגוון הבסיס ובמרקם — ולכן בוחרים חומר לפי הקטגוריה והמסר של המותג, לא לפי כותרת ירוקה בלבד.",
          image:
            "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
        },
        {
          heading: "לשמור על תחושת פרימיום",
          body: "גם בחומר בר-קיימא אפשר להגיע להשבחה עשירה: לכה מאט שמרגיעה את המראה, הבלטה שמוסיפה מגע או פויל מבוסס חומרים ממוחזרים. לעיתים דווקא המרקם הטבעי של הקרטון הממוחזר הופך ליתרון שיווקי, שמספר את סיפור הקיימות בלי מילה אחת.",
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
        text: "אין דפוס „טוב יותר” — יש דפוס שמתאים יותר לכמות, ללוח הזמנים ולגוונים של הפרויקט.",
        cite: "— מתוך היומן של בארי אריזות",
      },
      sections: [
        {
          heading: "דיגיטלי: מהיר וגמיש",
          body: "דפוס דיגיטלי מתאים לסדרות קצרות, לגרסאות מרובות ולפיילוטים. אין צורך בלוחות, ההכנה מהירה ואפשר לשנות גרפיקה בין יחידה ליחידה — מתאים להשקות, למהדורות מוגבלות ולבדיקות שוק לפני ייצור בכמות גדולה.",
          image:
            "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
        },
        {
          heading: "אופסט: עקבי ומשתלם בכמות",
          body: "כשהכמויות גדלות, אופסט משתלם יותר: עלות נמוכה יותר ליחידה, גוונים מדויקים וחוזרים על עצמם ותמיכה מלאה בצבעי פנטון ובהשבחות מורכבות. זו הבחירה לקווים קבועים ולמותגים עם דרישות צבע מחמירות.",
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
          body: "Digital print suits short runs, multiple versions and pilots. No plates are needed, setup is quick, and artwork can change from one unit to the next — a fit for launches, limited editions and market tests before a large production run.",
          image:
            "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
        },
        {
          heading: "Offset: consistent and cost-effective at scale",
          body: "As quantities grow, offset becomes more cost-effective: a lower cost per unit, precise and repeatable colors, and full support for Pantone inks and complex finishing. It's the choice for standing lines and brands with strict color requirements.",
        },
      ],
    },
  },
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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
