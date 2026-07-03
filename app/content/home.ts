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
  /** Accessible name for the image-only bento card that links to the catalog. */
  bentoCatalogLabel: string;
  badge1: string;
  badge2: string;
  faqEyebrow: string;
  faqTitle: string;
  faqBody: string;
  ctaTitle: readonly [string, string];
};


export const capabilities: readonly Capability[] = [
  {
    n: "01",
    he: { title: "אפיון מוצר", body: "מידות, משקל, שינוע, נוכחות במדף וחוויית פתיחה." },
    en: { title: "Product brief", body: "Dimensions, weight, shipping, shelf presence and opening." },
  },
  {
    n: "02",
    he: { title: "תכנון מבני", body: "דייליין, חומר, פתיחה, חיזוקים והתאמה לייצור." },
    en: { title: "Structural design", body: "Dieline, stock, closure, reinforcements, production fit." },
  },
  {
    n: "03",
    he: { title: "דפוס והשבחות", body: "דיגיטלי או אופסט, לכה, פויל, הבלטה וגימור." },
    en: { title: "Print & finishing", body: "Digital or offset, varnish, foil, emboss, lamination." },
  },
];

export const faqItems: readonly FaqItem[] = [
  {
    n: "01",
    he: {
      q: "האם יש יכולת לתכנן אריזה?",
      a: "כן, אפשר להתחיל מרעיון, מדוגמת מוצר או מסקיצה. הסטודיו יכול לתכנן אריזה מאפס, או לקבל קובץ מוכן ולהמשיך לתכנון מבני וחומרים.",
    },
    en: {
      q: "Can you plan the package structure?",
      a: "Yes. We can start from an idea, a product sample or a sketch. The studio can plan a package from scratch, or receive an existing file and continue with structural planning and materials.",
    },
  },
  {
    n: "02",
    he: {
      q: "האם נדרש לעצב גרפיקה מראש?",
      a: "כן, לאחר תכנון האריזה והעברת שרטוט, יועבר קובץ לטובת עימוד הגרפיקה.",
    },
    en: {
      q: "Do I need to design the artwork in advance?",
      a: "Yes. After the package is planned and the dieline is shared, a file is provided for placing the graphic design.",
    },
  },
  {
    n: "03",
    he: {
      q: "מה צריך לשלוח על מנת לקבל הצעת מחיר?",
      a: "נדרש לשלוח מידות ו/או פריסת יחידה, כמויות, חומר רצוי, סוג דפוס והשבחות.",
    },
    en: {
      q: "What should I send to receive a quote?",
      a: "Send dimensions and/or a unit layout, quantities, preferred material, print type and finishing requirements.",
    },
  },
  {
    n: "04",
    he: {
      q: "האם אפשר לקבל דוגמה לפני הייצור?",
      a: "כן. ניתן לייצר דגם לבן בגודל אמת לבדיקת מבנה והתאמה למוצר.",
    },
    en: {
      q: "Can I receive a sample before production?",
      a: "Yes. A full-size white mockup can be produced to check the structure and product fit.",
    },
  },
  {
    n: "05",
    he: {
      q: "ממה מורכב מחיר האריזה?",
      a: "המחיר נקבע לפי כמות מוזמנת, מידות, סוג חומר הגלם, עיצוב גרפי, השבחות כגון למינציה, פויל, הטבעה, הבלטה ולכה סלקטיבית, וזמן האספקה.",
    },
    en: {
      q: "What is the package price based on?",
      a: "Price is based on order quantity, dimensions, material type, graphic design, finishing such as lamination, foil, stamping, embossing and spot varnish, and delivery time.",
    },
  },
  {
    n: "06",
    he: {
      q: "באילו דרכים ניתן לקבל את האריזות לאחר הייצור?",
      a: 'ניתן לקבל את האריזות באמצעות הובלה עד לבית העסק או באיסוף עצמי ממרלו"ג החברה.',
    },
    en: {
      q: "How can I receive the packages after production?",
      a: "Packages can be delivered to your business or collected directly from the company's logistics center.",
    },
  },
];

export const homeCopy: Record<Lang, HomeCopy> = {
  he: {
    eyebrow: "אריזות קרטון בהתאמה אישית",
    h1: ["אריזה שעובדת", "בשביל המוצר"],
    cta1: "להשבחות וגימורים",
    cta2: "בארי אריזות",
    scroll: "גללו להמשך",
    contact: "צור קשר",
    journeyEyebrow: "שני מסלולים",
    journeyTitle: "מורשת תעשייתית ופתרון עכשווי",
    journeyDesc:
      "הסיפור של בארי מתקדם לצד המסלול של הלקוח: ממורשת של דפוס וייצור ועד אריזה מדויקת, מוכנה לשוק.",
    techTitle: "כשהמבנה פוגש את המותג.",
    techBody:
      "בארי אריזות מחברת תכנון מבני, חומרי גלם, דפוס והשבחות לאריזה אחת: כזו שנראית נכון, נפתחת נכון, מגינה על המוצר ומחזקת את הרושם כבר מהמגע הראשון.",
    bento1Title: "שטנץ מדויק",
    bento1Body: "חיתוך צורני שבונה את מבנה הקופסה — הפתחים, החלונות והקיפולים — בדיוק שהמוצר דורש.",
    bento2Title: "מעבדת פיתוח",
    bento2Body: "בודקים חומרים, מבנים, חיזוקים וחוויית פתיחה, והופכים רעיון לאריזה שאפשר לייצר בקנה מידה.",
    bentoCatalogLabel: "לקטלוג האריזות",
    badge1: "350 גרם",
    badge2: "חומר ניתן למחזור",
    faqEyebrow: "שאלות נפוצות",
    faqTitle: "מה חשוב לדעת לפני שמתחילים?",
    faqBody:
      "תשובות קצרות לשאלות שחוזרות כמעט בכל פרויקט אריזה: עיצוב, דייליין, חומרים, דוגמה ותמחור.",
    ctaTitle: ["מוכנים לתכנן את", "האריזה הבאה?"],
  },
  en: {
    eyebrow: "Custom folding-carton packaging",
    h1: ["Packaging that works", "for the product"],
    cta1: "Finishing options",
    cta2: "Beeri Packaging",
    scroll: "Scroll",
    contact: "Contact",
    journeyEyebrow: "Two paths",
    journeyTitle: "Industrial heritage, modern solution",
    journeyDesc:
      "Beeri's story runs alongside the client's path — from a heritage of print and manufacturing to a precise, market-ready package.",
    techTitle: "Where structure meets brand.",
    techBody:
      "Beeri Packaging brings structural design, raw materials, print and finishing into one package: one that looks right, opens right, protects the product and earns the first impression on contact.",
    bento1Title: "Precise dies",
    bento1Body: "A profile cut that builds the box itself — openings, windows and folds exactly where the product needs them.",
    bento2Title: "Material lab",
    bento2Body: "We test stock, structures, reinforcements and the opening experience, turning an idea into a package you can produce at scale.",
    bentoCatalogLabel: "Browse the packaging catalog",
    badge1: "350 gsm",
    badge2: "Recyclable stock",
    faqEyebrow: "FAQ",
    faqTitle: "What to know before you start",
    faqBody:
      "Short answers to the questions that recur in nearly every packaging brief: design, dieline, stock, sampling and pricing.",
    ctaTitle: ["Ready to design", "your next package?"],
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
    "/images/generated/website-content/packaging/retail-coffee-display-window-carton.png",
  journeyToday: "/images/generated/timeline/beeri-today-simple.png",
  journeyPrecise: "/images/generated/website-content/packaging/olive-oil-shaped-window-sleeve.png",
  bentoService: "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
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
      tag: "מהצורך של הלקוח לאריזה המתאימה",
      title: "מבינים את האתגר",
      body: "לפני שמדברים על צבעים או גימורים, בודקים את המוצר: משקל, שבריריות, אחסון, שינוע, נוכחות על המדף וחוויית הפתיחה. משם מתכננים פתרון שמתאים גם לפרויקט וגם לייצור.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the right package",
      title: "Understand the brief",
      body: "Before we talk colors or finishes, we study the product: weight, fragility, storage, shipping, shelf presence and the opening experience. From there we plan a solution that fits both the project and the line.",
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
      tag: "בארי אריזות על ציר הזמן",
      title: "1964 — שורשים",
      body: "בארי אריזות פועלת כחברה רשומה משנת 1964, וכיום היא חלק מקבוצת דפוס בארי. הוותק הזה מחבר ידע עמוק בדפוס וייצור עם שירות ופתרונות אריזה למותגים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "1964 — Roots",
      body: "Beeri Packaging has operated as a registered company since 1964 and is part of the Beeri Print group. That tenure pairs deep print and manufacturing know-how with service and packaging solutions for brands.",
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
      tag: "מהצורך של הלקוח לאריזה המתאימה",
      title: "מפתחים פתרון",
      body: "הצוות מתרגם את הצורך לפתרון מבני ועיצובי: חומר מתאים, מבנה קופסה, אופן פתיחה, חיזוקים פנימיים, דפוס והשבחות. כל החלטה נמדדת מול המוצר, המותג ושורת הייצור.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the right package",
      title: "Develop the solution",
      body: "The team translates the brief into a structural and visual answer: the right stock, box geometry, closure, internal reinforcements, print and finishing. Every choice is weighed against the product, the brand and the production line.",
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
      tag: "בארי אריזות על ציר הזמן",
      title: "תהליך הגדילה",
      body: "עם השנים הפכה בארי אריזות מספק ייצור לשותף שמלווה פרויקט מקצה לקצה: אפיון, תכנון מבני, דפוס דיגיטלי ואופסט, שטנץ, הדבקה, השבחות, אירוז, לוגיסטיקה ושירות ללקוחות עסקיים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "Growing the practice",
      body: "Over the years Beeri grew from a manufacturer into a partner that runs a project end to end: briefing, structural design, digital and offset print, die-cutting, gluing, finishing, packing, logistics and service for B2B clients.",
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
      tag: "מהצורך של הלקוח לאריזה המתאימה",
      title: "מייצרים אריזה מדויקת",
      body: "בסוף התהליך מתקבלת אריזה שנבנתה סביב המוצר, ולא להפך. היא מגינה, מציגה, מתקפלת, נפתחת ונארזת כמו שצריך — ומחזקת את הקשר עם המותג בכל מפגש מחדש.",
      link: "לתהליך העבודה",
    },
    en: {
      tag: "From client need to the right package",
      title: "Produce the precise package",
      body: "What comes off the line is a package built around the product, not the other way around. It protects, presents, folds, opens and packs as it should — reinforcing the brand every time a customer meets it again.",
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
      tag: "בארי אריזות על ציר הזמן",
      title: "מי אנחנו היום",
      body: "היום בארי אריזות מייצרת אריזות קרטון לתעשיות הקוסמטיקה, הפארמה, המזון, הקפה, היין והמשקאות, ממפעל ביבנה ובצוות שמחבר ניסיון תעשייתי, עיצוב וחשיבה מדויקת עבור מותגים מובילים.",
      link: "לציר הזמן",
    },
    en: {
      tag: "Beeri on the timeline",
      title: "Who we are today",
      body: "Today Beeri produces carton packaging for cosmetics, pharma, food, coffee, wine and beverages — from a factory in Yavne, with a team that pairs industrial know-how, design and precision thinking for leading brands.",
      link: "The timeline",
    },
  },
];
