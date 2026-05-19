/**
 * Home-page content layer.
 *
 * Single source of truth for every string and image rendered on the home
 * page. Components import these constants/types directly, so swapping this
 * module for a CMS-backed fetcher later requires no changes to component
 * code — only that the returned shape matches the exported types.
 */

export type Lang = "he" | "en";

export type NavLink = {
  he: string;
  en: string;
  href: string;
};

export type Capability = {
  n: string;
  he: { title: string; body: string };
  en: { title: string; body: string };
};

export type FaqItem = {
  n: string;
  he: { q: string; a: string };
  en: { q: string; a: string };
};

/**
 * One stop in the "dual journey" scroll story. Rows alternate the
 * heritage thread (dark, yellow accent) against the customer thread
 * (light or dark, purple accent). Each image gets a CSS-driven
 * parallax sweep as it passes through the viewport.
 */
export type JourneyPanel = {
  key: string;
  src: string;
  theme: "dark" | "light";
  accent: "purple" | "yellow";
  tagColor: "text-yellow" | "text-purple" | "text-magenta";
  he: { tag: string; title: string; body: string; link: string };
  en: { tag: string; title: string; body: string; link: string };
};

export type HomeCopy = {
  eyebrow: string;
  h1: readonly [string, string];
  cta1: string;
  cta2: string;
  scroll: string;
  contact: string;
  journeyEyebrow: string;
  journeyTitle: string;
  journeyDesc: string;
  techTitle: string;
  techBody: string;
  bento1Title: string;
  bento1Body: string;
  bento2Title: string;
  bento2Body: string;
  badge1: string;
  badge2: string;
  faqEyebrow: string;
  faqTitle: string;
  faqBody: string;
  ctaTitle: readonly [string, string];
  footerEyebrow: string;
  footerAddr: readonly [string, string];
  footerLinks: readonly string[];
  footerCopy: string;
  menu: string;
  close: string;
  lang: string;
};

// Anchors are root-relative (`/#section`) so the same nav works from any
// route — on the home page Next routes to `/` and the hash scrolls in place,
// on other pages it navigates home and scrolls there.
export const navLinks: readonly NavLink[] = [
  { he: "פורטפוליו", en: "Work", href: "/#journey" },
  { he: "השבחות", en: "Finishing", href: "/#excellence" },
  { he: "קריירה", en: "Careers", href: "/#cta" },
  { he: "קטלוג", en: "Catalog", href: "/#faq" },
];

export const capabilities: readonly Capability[] = [
  {
    n: "01",
    he: { title: "אפיון מוצר", body: "מידות, משקל, שינוע, מדף וחוויית פתיחה." },
    en: { title: "Product brief", body: "Dimensions, weight, shipping, shelf and unboxing." },
  },
  {
    n: "02",
    he: { title: "תכנון מבני", body: "דייליין, חומר, פתיחה, חיזוקים והתאמה לייצור." },
    en: { title: "Structural design", body: "Dieline, stock, closure, reinforcements, MFG." },
  },
  {
    n: "03",
    he: { title: "דפוס והשבחות", body: "דיגיטלי או אופסט, לכה, פויל, הבלטה וגימור." },
    en: { title: "Print & finishing", body: "Digital or offset, varnish, foil, emboss, finish." },
  },
];

export const faqItems: readonly FaqItem[] = [
  {
    n: "01",
    he: {
      q: "האם צריך להגיע עם עיצוב מוכן?",
      a: "לא חייב. אפשר להתחיל מרעיון, מוד בורד או ספריט. הסטודיו יכול לבנות עיצוב מאפס או לקבל קובץ הדפסה מוכן ולהמשיך מתכנון מבני, חומרים והשבחות.",
    },
    en: {
      q: "Do I need finished artwork?",
      a: "No. We can begin from a brief, a moodboard or a sprite. The studio can design from scratch or take a print-ready file and continue with structural design, materials and finishing.",
    },
  },
  {
    n: "02",
    he: {
      q: "מה צריך לשלוח כדי לקבל הצעת מחיר?",
      a: "מידות פנים של המוצר, כמויות, חומר רצוי, סוג הדפסה, גימורים והשבחות, ולוח זמנים. אם יש קובץ אומנות או דייליין — מצורף.",
    },
    en: {
      q: "What's needed for a quote?",
      a: "Inner dimensions, run sizes, preferred stock, print type, finishing and timeline. Attach artwork or dieline if you have one.",
    },
  },
  {
    n: "03",
    he: {
      q: "מה זה דייליין?",
      a: "דייליין הוא קובץ הקיפול והחיתוך של האריזה — מפת השטנץ. הוא מגדיר את הפנים, הגב, הלשוניות וכל קו קיפול, ועליו מורכב העיצוב לפני שליחה לדפוס.",
    },
    en: {
      q: "What is a dieline?",
      a: "The cut-and-fold map of the package. It defines front, back, tabs and every fold line — the canvas your artwork sits on before going to press.",
    },
  },
  {
    n: "04",
    he: {
      q: "האם אפשר לקבל דוגמה לפני ייצור?",
      a: "כן. אנחנו מייצרים פרוטוטייפ דיגיטלי בגודל אמת כדי לבדוק מבנה, פתיחה, פיט עם המוצר וקריאות גרפית. רק לאחר אישור עוברים לרון ייצור.",
    },
    en: {
      q: "Can I see a sample first?",
      a: "Yes. We produce a 1:1 digital prototype to validate structure, closure, fit with the product and graphic legibility before any production run.",
    },
  },
  {
    n: "05",
    he: {
      q: "מה משפיע על מחיר אריזה ממותגת?",
      a: "כמות, גודל, סוג קרטון, מספר צבעי דפוס, השבחות (פויל, הבלטה, לכה סלקטיבית), מורכבות שטנץ וזמן הזמנה. נתחיל באפיון קצר כדי להבין מה משפיע באמת.",
    },
    en: {
      q: "What drives the price?",
      a: "Run size, dimensions, board grade, ink count, finishing (foil, emboss, spot UV), die complexity and lead time. We start with a short brief to pinpoint what matters.",
    },
  },
];

export const homeCopy: Record<Lang, HomeCopy> = {
  he: {
    eyebrow: "משנת 1964 — אריזות קרטון בהתאמה אישית",
    h1: ["אריזה שעובדת", "בשביל המוצר"],
    cta1: "התחלת תהליך",
    cta2: "למה בארי",
    scroll: "גללו להמשך",
    contact: "צור קשר",
    journeyEyebrow: "שני מסלולים",
    journeyTitle: "מורשת תעשייתית ופתרון עכשווי",
    journeyDesc:
      "הסיפור של בארי מתקדם לצד המסלול של הלקוח: מהיסטוריה של דפוס וייצור ועד אריזה מדויקת שמוכנה לשוק.",
    techTitle: "כשהמבנה פוגש את המותג.",
    techBody:
      "בארי אריזות מחברת תכנון מבני, חומרי גלם, דפוס והשבחות כדי ליצור אריזה שנראית נכון, נפתחת נכון, שומרת על המוצר ומחזקת את הרושם מהרגע הראשון.",
    bento1Title: "שטנץ מדויק",
    bento1Body: "חיתוך צורני שמייצר את מבנה הקופסה, הפתחים, החלונות והקיפולים בדיוק הנדרש.",
    bento2Title: "מעבדת פיתוח",
    bento2Body: "בדיקה של חומרים, מבנים, חיזוקים וחוויית פתיחה כדי להפוך רעיון לאריזה שאפשר לייצר.",
    badge1: "350 גרם",
    badge2: "חומר ניתן למחזור",
    faqEyebrow: "שאלות נפוצות",
    faqTitle: "מה חשוב לדעת לפני שמתחילים?",
    faqBody:
      "כמה תשובות קצרות לשאלות שעולות כמעט בכל פרויקט אריזה: עיצוב, דייליין, חומרים, דוגמה ותמחור.",
    ctaTitle: ["מוכנים לתכנן את", "האריזה הבאה?"],
    footerEyebrow: "סטודיו ומפעל",
    footerAddr: ["פארן 4", "יבנה"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "תנאים", "פרטיות"],
    footerCopy: "© 2026 בארי אריזות. כל הזכויות שמורות.",
    menu: "תפריט",
    close: "סגירה",
    lang: "שפה",
  },
  en: {
    eyebrow: "Since 1964 — Custom corrugated packaging",
    h1: ["Packaging that works", "for the product"],
    cta1: "Start a project",
    cta2: "Why Beeri",
    scroll: "Scroll",
    contact: "Contact",
    journeyEyebrow: "Two paths",
    journeyTitle: "Industrial heritage, modern solution",
    journeyDesc:
      "Beeri's story runs alongside our client's path — from a legacy of print and manufacturing to a precise package ready for market.",
    techTitle: "Where structure meets brand.",
    techBody:
      "Beeri Packaging connects structural design, raw materials, print and finishing to create a package that looks right, opens right, protects the product and lands the first impression.",
    bento1Title: "Precise dies",
    bento1Body: "A cut that builds the box itself — openings, windows and folds exactly where they should be.",
    bento2Title: "Material lab",
    bento2Body: "Testing stock, structures, reinforcements and unboxing — turning an idea into a manufacturable package.",
    badge1: "350 gsm",
    badge2: "Recyclable stock",
    faqEyebrow: "FAQ",
    faqTitle: "What to know before you start",
    faqBody:
      "Short answers to the questions that come up in nearly every packaging brief: design, dieline, stock, sampling and pricing.",
    ctaTitle: ["Ready to design", "your next package?"],
    footerEyebrow: "Studio & factory",
    footerAddr: ["4 Paran St.", "Yavne, Israel"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "Terms", "Privacy"],
    footerCopy: "© 2026 Beeri Packaging. All rights reserved.",
    menu: "Menu",
    close: "Close",
    lang: "Language",
  },
};

/**
 * Image paths used by the home page. Kept centralized so a CMS layer can
 * replace them with hosted URLs without touching component code.
 */
export const homeImages = {
  hero: "/images/figma/hero-bg.png",
  // The journey panels fill near-full-viewport on desktop, so they need
  // high-resolution sources. The /generated/timeline/ shots (1456×1080)
  // cover the heritage thread; vertical-2x3 product crops (1024×1536)
  // cover the customer thread and match the cards' tall aspect ratio.
  journeyHeritage: "/images/generated/timeline/beeri-history.png",
  journeyCustomer:
    "/images/generated/imagegen-real-products-vertical-2x3/blue-moon-imagegen-ambience-v2-vertical-2x3.webp",
  journeyGrowth: "/images/generated/timeline/beeri-growth.png",
  journeyDeveloping:
    "/images/generated/imagegen-real-products-vertical-2x3/barkan-wine-imagegen-ambience-vertical-2x3.webp",
  journeyToday: "/images/generated/timeline/beeri-today-simple.png",
  journeyPrecise:
    "/images/generated/imagegen-real-products-vertical-2x3/mh-whisky-imagegen-ambience-v2-vertical-2x3.webp",
  bentoService: "/images/figma/service-1.png",
  logoHe: "/images/logo-he.svg",
  logoEn: "/images/logo-en.svg",
} as const;

/**
 * Six-panel scrolling journey. The two threads (heritage + customer)
 * alternate row-by-row. In Hebrew RTL the first panel in each pair
 * renders visually on the right and the second on the left — matching
 * the Figma layout (heritage on the left, customer on the right).
 */
export const journeyPanels: readonly JourneyPanel[] = [
  {
    key: "customer",
    src: homeImages.journeyCustomer,
    theme: "light",
    accent: "purple",
    tagColor: "text-purple",
    he: {
      tag: "מהצורך של הלקוח לאריזה המושלמת",
      title: "מבינים את האתגר",
      body: "לפני שמדברים על צבעים או גימורים, בודקים את המוצר: משקל, שבריריות, אחסון, שינוע, מדף וחוויית פתיחה. משם מתכננים פתרון שמתאים לפרויקט ולייצור.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the perfect package",
      title: "Understand the brief",
      body: "Before we talk colors or finishes, we look at the product: weight, fragility, storage, shipping, shelf and unboxing. From there we plan a solution that fits both the project and the line.",
      link: "Our process",
    },
  },
  {
    key: "heritage",
    src: homeImages.journeyHeritage,
    theme: "dark",
    accent: "yellow",
    tagColor: "text-yellow",
    he: {
      tag: "אריזות בארי על ציר הזמן",
      title: "1964 — שורשים",
      body: "בארי אריזות פועלת כחברה רשומה משנת 1964 וכיום היא חלק מקבוצת דפוס בארי. הניסיון המצטבר הזה מחבר בין ידע עמוק בדפוס, ייצור, שירות ופתרונות למותגים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "1964 — Roots",
      body: "Beeri Packaging has operated as a registered company since 1964 and is part of the Beeri Print group. The accumulated experience bridges deep print know-how, manufacturing, service and brand solutions.",
      link: "The timeline",
    },
  },
  {
    key: "developing",
    src: homeImages.journeyDeveloping,
    theme: "light",
    accent: "purple",
    tagColor: "text-purple",
    he: {
      tag: "מהצורך של הלקוח לאריזה המושלמת",
      title: "מפתחים פתרון",
      body: "הצוות המקצועי מתרגם את הצורך לפתרון מבני ועיצובי: חומר מתאים, מבנה קופסה, אופן פתיחה, חיזוקים פנימיים, דפוס והשבחות שמשרתים את המותג והמוצר בפועל בפרויקט ובייצור.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the perfect package",
      title: "Develop the solution",
      body: "Our team translates the brief into a structural and visual answer: the right stock, box geometry, closure, internal reinforcements, print and finishing — all in service of the brand and the product on the line.",
      link: "Our process",
    },
  },
  {
    key: "growth",
    src: homeImages.journeyGrowth,
    theme: "dark",
    accent: "yellow",
    tagColor: "text-yellow",
    he: {
      tag: "אריזות בארי על ציר הזמן",
      title: "תהליך הגדילה",
      body: "עם השנים התפתחה בארי אריזות מספק ייצור לחברה שמלווה פרויקטים שלמים: אפיון, תכנון מבני, דפוס דיגיטלי ואופסט, שטנץ, הדבקה, השבחות, לוגיסטיקה, אספקה ושירות ללקוחות עסקיים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "Growing the practice",
      body: "Over the years Beeri evolved from a manufacturer into a partner that runs whole projects: briefing, structural design, digital and offset print, die-cutting, gluing, finishing, logistics, supply and service for B2B clients.",
      link: "The timeline",
    },
  },
  {
    key: "precise",
    src: homeImages.journeyPrecise,
    theme: "dark",
    accent: "purple",
    tagColor: "text-purple",
    he: {
      tag: "מהצורך של הלקוח לאריזה המושלמת",
      title: "מייצרים אריזה מדוייקת",
      body: "בסוף התהליך מתקבלת אריזה שנבנתה סביב המוצר ולא להפך. היא מגינה, מציגה, מתקפלת, נפתחת ונארזת נכון — ומחזקת את חוויית הלקוח בכל מפגש מחדש עם המותג.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the perfect package",
      title: "Produce the precise package",
      body: "What comes off the line is a package built around the product, not the other way around. It protects, presents, folds, opens and packs correctly — and reinforces the brand every time a customer meets it again.",
      link: "Our process",
    },
  },
  {
    key: "today",
    src: homeImages.journeyToday,
    theme: "dark",
    accent: "yellow",
    tagColor: "text-yellow",
    he: {
      tag: "אריזות בארי על ציר הזמן",
      title: "מי אנחנו היום",
      body: "היום בארי אריזות מייצרת פתרונות אריזה מקרטון לתעשיות הפארמה, המזון, הקוסמטיקה, היין והמשקאות, עם מפעל ביבנה וצוות שמחבר ניסיון תעשייתי, עיצוב וחשיבה מדויקת למותגים מובילים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "Who we are today",
      body: "Today Beeri produces carton packaging for pharma, food, cosmetics, wine and beverages — from a factory in Yavne, with a team that pairs industrial know-how, design and precision thinking for leading brands.",
      link: "The timeline",
    },
  },
];
