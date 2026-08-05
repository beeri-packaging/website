import { expandedCatalogImages } from "@/app/content/catalog";

/**
 * Content-approval model (Hebrew).
 *
 * A flat, serialisable summary of every page on the site — each split into
 * sections with bullet-point summaries of the real copy, plus the images that
 * appear on that page. Authored from the typed content layer in
 * `app/content/*`. The /review page renders this and lets the client approve
 * each section, choose between image options and leave free-text notes.
 *
 * This module holds NO interactive state — it is the read-only source the
 * review board renders. Keep the wording here in sync with `app/content/*`.
 */

export type ReviewImage = {
  /** Stable id used to key the client's image feedback. */
  id: string;
  /** Current image shown on the live site. */
  src: string;
  /** Short Hebrew label describing where the image is used. */
  label: string;
  /**
   * Optional alternative images the client can pick instead. The current
   * `src` is always offered as the default ("התמונה הנוכחית").
   */
  alternatives?: readonly string[];
};

export type ReviewSection = {
  /** Stable id used to key the client's text feedback for this section. */
  id: string;
  /** Hebrew section name. */
  title: string;
  /** Optional one-line description of what the section is. */
  summary?: string;
  /** Bullet-point summary of the section's actual copy. */
  bullets: readonly string[];
  /**
   * Optional literal text to locate this section in the live page when the
   * client opens the preview, so the modal can scroll to and highlight it.
   * If omitted, the board falls back to quoted snippets pulled from `bullets`
   * (the bullets quote real on-page copy). Set this only when the bullets have
   * no quote, or the quote isn't unique enough to land on the right element.
   */
  previewText?: string;
  /** Images that appear in this section. */
  images?: readonly ReviewImage[];
};

export type ReviewPage = {
  /** Stable id (also used as the in-page anchor). */
  id: string;
  /** Hebrew page name. */
  title: string;
  /** Live route on the site, for reference (e.g. "/he/about"). */
  path: string;
  /** Optional short intro describing the page. */
  intro?: string;
  /** Grouping label for the side navigation (e.g. "בלוג"). */
  group?: string;
  sections: readonly ReviewSection[];
};

// ── Shared alternative image sets (only real, on-disk assets) ─────────────

/** Vertical 2×3 product ambience shots — used by the home "journey" cards. */
const PRODUCT_VERTICALS = [
  "/images/generated/imagegen-real-products-vertical-2x3/blue-moon-imagegen-ambience-v2-vertical-2x3.webp",
  "/images/generated/imagegen-real-products-vertical-2x3/blue-moon-imagegen-ambience-v1-vertical-2x3.webp",
  "/images/generated/imagegen-real-products-vertical-2x3/barkan-wine-imagegen-ambience-vertical-2x3.webp",
  "/images/generated/imagegen-real-products-vertical-2x3/nescafe-window-pack-imagegen-ambience-vertical-2x3.webp",
  "/images/generated/imagegen-real-products-vertical-2x3/ahava-gold-imagegen-ambience-vertical-2x3.webp",
] as const;

/** MGI / foil finishing hero variants. */
const FINISHING_HEROES = [
  "/images/generated/finishing-hero/finishing-hero-v9-dalton.png",
  "/images/generated/finishing-hero/finishing-hero-v1.png",
  "/images/generated/finishing-hero/finishing-hero-v6-beer.png",
  "/images/generated/finishing-hero/finishing-hero-v7-coffee.png",
  "/images/generated/finishing-hero/finishing-hero-v8-golda.png",
  "/images/generated/finishing-hero/finishing-hero-v10-raziel.png",
  "/images/generated/finishing-hero/finishing-hero-v2.png",
  "/images/generated/finishing-hero/finishing-hero-v3.png",
  "/images/generated/finishing-hero/finishing-hero-v4.png",
  "/images/generated/finishing-hero/finishing-hero-v5.png",
] as const;

/** Editorial product/packaging photos — used as blog heroes & inline shots. */
const PACKAGING_SHOTS = [
  "/images/generated/website-content/packaging/gold-wine-insert-handle-box.png",
  "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
  "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
  "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
  "/images/generated/website-content/packaging/open-capability-presentation-box.png",
  "/images/generated/website-content/packaging/closed-textured-capability-box.png",
  "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
  "/images/generated/website-content/packaging/retail-coffee-display-window-carton.png",
  "/images/generated/website-content/packaging/coffee-cup-window-gift-cartons.png",
  "/images/generated/website-content/packaging/olive-oil-shaped-window-sleeve.png",
  "/images/generated/website-content/packaging/beer-carrier-window-carton.png",
  "/images/generated/website-content/packaging/ahava-internal-print-carton.png",
] as const;

/** New-style hero shots — used as blog heroes & section images. */
const HERO_NEW_STYLE = [
  "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
  "/images/generated/hero-new-style/hero-new-style-02-cosmetics-drawer.png",
  "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png",
  "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
  "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
] as const;

/** Helper: list of alternatives with the current src first and de-duplicated. */
function withCurrent(current: string, pool: readonly string[]): readonly string[] {
  return [current, ...pool.filter((s) => s !== current)];
}

// ── The pages ─────────────────────────────────────────────────────────────

export const reviewPages: readonly ReviewPage[] = [
  // ---------------------------------------------------- special questions
  // Two open questions we need a decision on. They reuse the section model:
  // «מאושר» = כן/רוצים, «צריך תיקון» = רוצים בשינויים, «לדיון» = בואו נדבר —
  // והפרטים נכתבים בהערה. The marking convention is explained once in `intro`,
  // so the bullets stay short and uncluttered.
  {
    id: "questions",
    title: "שתי שאלות אלינו",
    path: "/he/about",
    group: "שאלות מיוחדות",
    intro:
      "לכל שאלה סמנו «מאושר» אם אתם רוצים, או «צריך תיקון» אם בשינויים — וכתבו את הפרטים בהערה שתיפתח.",
    sections: [
      {
        id: "questions-brands",
        previewText: "שותפות מנצחת",
        title: "לוגואים של מותגים",
        summary: "האם להשאיר את החלק «מבין לקוחותינו» עם לוגואים של מותגים?",
        bullets: [
          "כיום מוצג באתר חלק עם לוגואים של מותגים (Strauss · Osem · Tnuva · Elite ועוד).",
          "רוצים להשאיר אותו? אם כן — נשמח לקבל את הלוגואים באיכות גבוהה. בהערה אפשר לציין אילו לוגואים להוסיף, להסיר או להחליף.",
        ],
      },
      {
        id: "questions-team",
        title: "תמונות צוות והנהלה",
        summary: "רוצים להוסיף לאתר חלק עם תמונות של הצוות וההנהלה?",
        bullets: [
          "מה להציג לצד כל אדם — תמונה ושם? גם תפקיד? משפט קצר? פרטי קשר?",
          "בהערה — כתבו את מי לכלול ומה להציג, והאם יש תמונות מוכנות או שצריך לצלם.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- chrome
  {
    id: "chrome",
    title: "כותרת, ניווט ופוטר",
    path: "/he",
    group: "כללי",
    intro: "רכיבים שחוזרים בכל עמודי האתר — תפריט עליון, פוטר וטופס יצירת קשר.",
    sections: [
      {
        id: "chrome-nav",
        title: "תפריט עליון",
        bullets: [
          "לוגו בארי אריזות מוביל לדף הבית.",
          "קישורי ניווט: אודות · השבחות · יומן · קטלוג.",
          'כפתור "ליצירת קשר" שפותח את טופס הפנייה.',
          "מתג מעבר בין עברית לאנגלית.",
        ],
      },
      {
        id: "chrome-footer",
        title: "פוטר (תחתית הדף)",
        bullets: [
          "וורדמרק: בארי אריזות · תיאור: אריזות קרטון בהתאמה אישית — תכנון, דפוס והשבחה תחת קורת גג אחת.",
          'תיוג מתחת ללוגו: "מבית דפוס בארי".',
          'כתובת: רחוב פארן 4, פארק טכנולוגי יבנה, מיקוד 8122503, ת.ד 13187 · מרלו"ג: רחוב שידלובסקי 1, מתחם ארגמן, יבנה.',
          "קישורי ניווט חוזרים + קישור «משרות פתוחות» (מוביל למשרות בעמוד היומן) + קישורי LinkedIn ו-Facebook.",
          "קישורים משפטיים: תנאים · פרטיות.",
          "זכויות יוצרים: © 2026 בארי אריזות. כל הזכויות שמורות.",
        ],
      },
      {
        id: "chrome-contact",
        title: "טופס יצירת קשר (חלון קופץ)",
        summary: "נפתח מכל כפתור 'ליצירת קשר' באתר.",
        bullets: [
          'כותרת: "נדבר על האריזה שלכם." · תיוג: "פנייה לפרויקט".',
          "שדות: שם מלא* · טלפון* · אימייל* · חברה (לא חובה). שדות חובה מסומנים בכוכבית.",
          "סיבת הפנייה: הצעת מחיר · תיאום פגישה עם מת״ל · נושא אחר.",
          "שדה פרטים נוספים חופשי.",
          'המייל שנשלח ל־ORDERS מסומן כ"פנייה מאתר בארי אריזות".',
          'כפתור "שליחת פנייה" + טקסט הסכמה.',
          'הודעת הצלחה: "הפנייה נשלחה — תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם."',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- home
  {
    id: "home",
    title: "דף הבית",
    path: "/he",
    group: "עמודים ראשיים",
    sections: [
      {
        id: "home-hero",
        title: "כותרת ראשית (Hero)",
        bullets: [
          'תיוג עליון: "אריזות קרטון בהתאמה אישית".',
          'כותרת: "אריזה שעובדת בשביל המוצר".',
          'כפתורים: "להשבחות וגימורים" · "בארי אריזות".',
          "בדסקטופ גדול הרקע מוצג כווידאו כאשר זמין; במובייל ובמקרה כשל מוצגת תמונת fallback.",
          'רמז גלילה: "גללו להמשך".',
        ],
        images: [
          {
            id: "home-hero-bg",
            src: "/images/figma/hero-bg.png",
            label: "רקע הכותרת הראשית",
          },
        ],
      },
      {
        id: "home-journey",
        title: "שני מסלולים (סיפור הגלילה)",
        summary: "שישה פאנלים שמשלבים את מורשת החברה עם מסלול הלקוח.",
        bullets: [
          'תיוג: "שני מסלולים" · כותרת: "מורשת תעשייתית ופתרון עכשווי".',
          "תיאור: הסיפור של בארי מתקדם לצד המסלול של הלקוח — ממורשת דפוס וייצור ועד אריזה מדויקת ומוכנה לשוק.",
          'פאנל 1 — "מבינים את האתגר": בודקים את המוצר (משקל, שבריריות, אחסון, שינוע, מדף, פתיחה) לפני שמדברים על צבעים.',
          'פאנל 2 — "1964 — שורשים": חברה רשומה משנת 1964, חלק מקבוצת דפוס בארי.',
          'פאנל 3 — "מפתחים פתרון": תרגום הצורך לפתרון מבני ועיצובי — חומר, מבנה, פתיחה, חיזוקים, דפוס והשבחות.',
          'פאנל 4 — "תהליך הגדילה": מספק ייצור לשותף שמלווה פרויקט מקצה לקצה.',
          'פאנל 5 — "מייצרים אריזה מדויקת": אריזה שנבנתה סביב המוצר — מגינה, מציגה, נפתחת ונארזת כמו שצריך.',
          'פאנל 6 — "מי אנחנו היום": ייצור אריזות לקוסמטיקה, פארמה, מזון, קפה, יין ומשקאות ממפעל ביבנה.',
        ],
        images: [
          {
            id: "home-journey-customer",
            src: "/images/generated/imagegen-real-products-vertical-2x3/blue-moon-imagegen-ambience-v2-vertical-2x3.webp",
            label: 'פאנל "מבינים את האתגר"',
            alternatives: withCurrent(
              "/images/generated/imagegen-real-products-vertical-2x3/blue-moon-imagegen-ambience-v2-vertical-2x3.webp",
              PRODUCT_VERTICALS,
            ),
          },
          {
            id: "home-journey-heritage",
            src: "/images/generated/timeline/beeri-history.png",
            label: 'פאנל "1964 — שורשים"',
          },
          {
            id: "home-journey-developing",
            src: "/images/generated/client-feedback-2026-07-08/coffee-solution-development.webp",
            label: 'פאנל "מפתחים פתרון"',
            alternatives: withCurrent(
              "/images/generated/client-feedback-2026-07-08/coffee-solution-development.webp",
              [...PRODUCT_VERTICALS, ...PACKAGING_SHOTS],
            ),
          },
          {
            id: "home-journey-growth",
            src: "/images/generated/timeline/beeri-growth.png",
            label: 'פאנל "תהליך הגדילה"',
            alternatives: withCurrent("/images/generated/timeline/beeri-growth.png", [
              "/images/generated/timeline/beeri-growth-simple.png",
            ]),
          },
          {
            id: "home-journey-precise",
            src: "/images/generated/imagegen-real-products-vertical-2x3/nescafe-window-pack-imagegen-ambience-vertical-2x3.webp",
            label: 'פאנל "מייצרים אריזה מדויקת"',
            alternatives: withCurrent(
              "/images/generated/imagegen-real-products-vertical-2x3/nescafe-window-pack-imagegen-ambience-vertical-2x3.webp",
              [...PRODUCT_VERTICALS, ...PACKAGING_SHOTS],
            ),
          },
          {
            id: "home-journey-today",
            src: "/images/generated/client-feedback-2026-07-08/full-capability-tableau.webp",
            label: 'פאנל "מי אנחנו היום"',
            alternatives: withCurrent("/images/generated/client-feedback-2026-07-08/full-capability-tableau.webp", [
              "/images/generated/timeline/beeri-growth-simple.png",
              "/images/generated/timeline/beeri-growth.png",
            ]),
          },
        ],
      },
      {
        id: "home-technical",
        title: "כשהמבנה פוגש את המותג",
        bullets: [
          'כותרת: "כשהמבנה פוגש את המותג."',
          "תיאור: בארי מחברת תכנון מבני, חומרי גלם, דפוס והשבחות לאריזה אחת — שנראית נכון, נפתחת נכון, מגינה על המוצר ומחזקת את הרושם הראשון.",
          'כרטיס "שטנץ מדויק": חיתוך צורני שבונה את מבנה הקופסה — פתחים, חלונות וקיפולים.',
          'כרטיס "מעבדת פיתוח": בדיקת חומרים, מבנים, חיזוקים וחוויית פתיחה.',
          'תגיות: "350 גרם" · "חומר ניתן למחזור".',
          "שלוש יכולות: אפיון מוצר · תכנון מבני · דפוס והשבחות.",
        ],
        images: [
          {
            id: "home-bento-service",
            src: "/images/generated/client-feedback-2026-07-08/development-lab-workbench.webp",
            label: "תמונת מעבדת הפיתוח",
            alternatives: withCurrent(
              "/images/generated/client-feedback-2026-07-08/development-lab-workbench.webp",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
      {
        id: "home-faq",
        title: "שאלות נפוצות",
        bullets: [
          'כותרת: "מה חשוב לדעת לפני שמתחילים?"',
          'שאלה 1: "האם יש יכולת לתכנן אריזה?" — כן, אפשר להתחיל מרעיון, מדוגמת מוצר או מסקיצה.',
          'שאלה 2: "האם נדרש לעצב גרפיקה מראש?" — כן, לאחר תכנון האריזה והעברת שרטוט יועבר קובץ לעימוד הגרפיקה.',
          'שאלה 3: "מה צריך לשלוח על מנת לקבל הצעת מחיר?" — מידות ו/או פריסת יחידה, כמויות, חומר, סוג דפוס והשבחות.',
          'שאלה 4: "האם אפשר לקבל דוגמה לפני הייצור?" — כן, דגם לבן בגודל אמת לבדיקת מבנה והתאמה.',
          'שאלה 5: "ממה מורכב מחיר האריזה?" — כמות, מידות, חומר גלם, עיצוב גרפי, השבחות וזמן אספקה.',
          'שאלה 6: "באילו דרכים ניתן לקבל את האריזות לאחר הייצור?" — הובלה לבית העסק או איסוף עצמי ממרלו"ג החברה.',
        ],
      },
      {
        id: "home-cta",
        previewText: "מוכנים לתכנן את",
        title: "קריאה לפעולה (סיום)",
        bullets: ['כותרת: "מוכנים לתכנן את האריזה הבאה?"'],
      },
    ],
  },

  // ---------------------------------------------------------------- about
  {
    id: "about",
    title: "אודות",
    path: "/he/about",
    group: "עמודים ראשיים",
    sections: [
      {
        id: "about-hero",
        title: "כותרת ופתיח",
        bullets: [
          'תיוג: "אודות" · כותרת: "כשמסורת של דפוס פוגשת את האריזה של ימינו".',
          "פתיח: בארי אריזות הוא בית דפוס מוביל בתחום ייצור אריזות ותוויות, עם מוניטין וניסיון מצטבר של למעלה ממאה שנה.",
          "המשך: שירות מקיף משלב הרעיון והייעוץ ועד אספקת המוצר המוגמר, בדגש על שירות יעיל וטכנולוגיה מתחדשת.",
          "שורת תעשיות מסומנת: קוסמטיקה · יקבים · פארמה · טקסטיל · מזון · משקאות · מוצרי פרסום · מוצרי קד״מ.",
        ],
      },
      {
        id: "about-heritage",
        title: "שורשים משלושה דורות, עתיד אחד",
        bullets: [
          'כותרת: "שורשים משלושה דורות, עתיד אחד".',
          "תיאור: בארי אריזות נושאת מורשת של שלושה בתי דפוס ותיקים שהתאחדו לכדי גוף אחד.",
          "דפוס בארי — הוקם בשנת 1950 בבעלות מלאה של קיבוץ בארי.",
          "גרפיקה בצלאל — החל כמכון הגרפי של בית האומנויות בצלאל והפך לבית דפוס מסחרי בשנת 1946.",
          "דפוס חרט — ראשיתו בוורשה בשנת 1910 והמשכו בישראל משנת 1936.",
          "המסורות התלכדו לבארי אריזות של היום: פתרון כולל מפיתוח הרעיון ועד אספקת המוצר המוגמר.",
          "קישור לאתר הקבוצה.",
        ],
        images: [
          {
            id: "about-heritage-founders",
            src: "/images/about/heritage/founders.jpg",
            label: "מייסדים (מורשת)",
            alternatives: withCurrent("/images/about/heritage/founders.jpg", [
              "/images/about/heritage/press-vintage.jpg",
              "/images/about/heritage/print-shop.jpg",
            ]),
          },
        ],
      },
      {
        id: "about-timeline",
        previewText: "אבני דרך",
        title: "אבני דרך — התאגדות וצמיחה",
        bullets: [
          "2019 — רכישת גרפיקה בצלאל על ידי קיבוץ בארי.",
          "2020 — גרפיקה בצלאל רוכשת את דפוס חרט.",
          "2021 — שינוי השם לבארי אריזות בע״מ.",
        ],
      },
      {
        id: "about-stats",
        previewText: "במספרים",
        title: "במספרים — המפעל ביבנה",
        bullets: [
          "מעל 100 עובדים.",
          "10,000 מ״ר של אולמות ייצור ומרלו״ג.",
          "מעל 200 שנות ניסיון מצטבר.",
          "מפעל חיוני שעובד 24/6.",
        ],
        images: [
          {
            id: "about-production-floor",
            src: "https://cdn.sanity.io/images/4qkb39ql/production/05b7ed9c36047e2f43a141d0ba4dda44711a386f-1672x941.webp",
            label: "איור מעבר בין דפוס מסורתי לדפוס מודרני",
            alternatives: withCurrent(
              "https://cdn.sanity.io/images/4qkb39ql/production/05b7ed9c36047e2f43a141d0ba4dda44711a386f-1672x941.webp",
              [
                "/images/about/production/offset-press.png",
                "/images/about/production/digital-press.png",
                "/images/about/production/die-cutting.png",
                "/images/about/production/finishing-line.jpg",
              ],
            ),
          },
        ],
      },
      {
        id: "about-partners",
        title: "מבין לקוחותינו",
        bullets: [
          'כותרת: "שותפות מנצחת".',
          "לקוחות להצגה: שטראוס קפה (עלית) · קרלסברג · CBC · תה ויסוצקי · נסטלה · יקבי כרמל · יקב רקאנטי · יקב רמת הגולן · טמפו · ליימן שליסל · אלטמן.",
        ],
      },
      {
        id: "about-cta",
        title: "קריאה לפעולה",
        bullets: [
          'כותרת: "בואו נתכנן יחד את האריזה הבאה שלכם."',
          'כפתורים: "ליצירת קשר" · "צפייה בקטלוג".',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- catalog
  {
    id: "catalog",
    title: "קטלוג",
    path: "/he/catalog",
    group: "עמודים ראשיים",
    sections: [
      {
        id: "catalog-hero",
        title: "כותרת ופתיח",
        bullets: [
          'תיוג: "קטלוג" · כותרת: "כשהמבנה פוגש מותג".',
          "פתיח: אינדקס אריזות הקרטון הממותגות מציג פתרונות מותאמים אישית לקוסמטיקה, מזון, יין, משקאות, טקסטיל, קפה, פארמה וטואלטיקה.",
          "הפתיח מפרט התאמות לתעשיות שונות, אפשרויות השבחה, תכנון מבני, בחירת חומרים, דיוק שטנץ ודפוס מתקדם.",
          "כרטיס המפרט שהיה בצד שמאל אינו מוצג יותר.",
        ],
      },
      {
        id: "catalog-cosmetics",
        previewText: "מארז אמפולות",
        title: "קטגוריה 01 — קוסמטיקה (4 פריטים)",
        bullets: [
          "קופסת סרום פרימיום: קרטון קשיח עם מגירה פנימית, חלון שטנץ ופויל. תגיות: פויל זהב · ניתן למיחזור.",
          "מארז אמפולות: מבנה עם חוצץ פנימי וסימון סדרה לדרישות הפארמה. תגיות: סימון סדרה · חוצץ פנימי.",
          "מארז צנצנת קרם: קרטון ממוחזר עם חלון ומגירה. תגיות: חלון · ממוחזר.",
          "קופסת בושם: קרטון קשיח עם הבלטה ולכה סלקטיבית. תגיות: הבלטה · לכה סלקטיבית.",
        ],
        images: [
          { id: "catalog-serum", src: "/images/figma/catalog/serum.png", label: "קופסת סרום" },
          { id: "catalog-ampoule", src: "/images/figma/catalog/ampoule.png", label: "מארז אמפולות" },
          { id: "catalog-cream", src: "/images/figma/catalog/cream.png", label: "מארז צנצנת קרם" },
          { id: "catalog-perfume", src: "/images/figma/catalog/perfume.png", label: "קופסת בושם" },
        ],
      },
      {
        id: "catalog-spirits",
        title: "קטגוריה 02 — יין ומשקאות (6 פריטים)",
        bullets: [
          "מארזי בקבוק יחיד: מוני · Barkan Altitude.",
          "מארזי בקבוק וכוסות: יקב רמת הגולן · Carmel BUZZ · יקב רקנאטי.",
          "מארז יקב תבור: מבנה קראפט לשלושה מוצרים עם חלונות אישיים.",
        ],
        images: [
          { id: "catalog-wine-mony", src: expandedCatalogImages.wineMony, label: "מוני" },
          { id: "catalog-wine-barkan", src: expandedCatalogImages.wineBarkan, label: "ברקן" },
          { id: "catalog-wine-golan", src: expandedCatalogImages.wineGolan, label: "רמת הגולן" },
          { id: "catalog-wine-carmel", src: expandedCatalogImages.wineCarmel, label: "כרמל" },
          { id: "catalog-wine-tabor", src: expandedCatalogImages.wineTabor, label: "תבור" },
          { id: "catalog-wine-recanati", src: expandedCatalogImages.wineRecanati, label: "רקנאטי" },
        ],
      },
      {
        id: "catalog-coffee",
        previewText: "קפה",
        title: "קטגוריה 03 — קפה (4 פריטים)",
        bullets: [
          "מארז קפסולות קפה עלית: אריזת קרטון ממותגת עם נוכחות מדף ברורה.",
          "דיספליי קפסולות ארומה: מארז תצוגה קמעונאי לסדרת קופסאות.",
          "סדרת מארזי קפה ג׳ו: מבנה אחיד למגוון תערובות וטעמים.",
          "מארז Nescafé Taster’s Choice: צנצנת קפה וכוס נסיעות בחלון תצוגה.",
        ],
        images: [
          {
            id: "catalog-coffee-tasters-choice",
            src: expandedCatalogImages.coffeeTastersChoice,
            label: "Nescafé Taster’s Choice",
          },
        ],
      },
      {
        id: "catalog-beer",
        previewText: "בירות",
        title: "קטגוריה 04 — בירות (4 פריטים)",
        bullets: [
          "מארז בירה מלכה: מארז מתנה לארבעה בקבוקים וכוס עם חלונות שטנץ.",
          "מארז שישיית גולדסטאר: מארז נשיאה ממותג עם ידית מובנית.",
          "מארז שישיית קרלסברג: קרטון מודפס להפצה קמעונאית.",
          "מארז שישיית טובורג: מבנה נשיאה עם שטח מיתוג רחב.",
        ],
      },
      {
        id: "catalog-beverages",
        previewText: "תה ומשקאות",
        title: "קטגוריה 05 — תה ומשקאות (3 פריטים)",
        bullets: [
          "ויסוצקי: תקריב השבחות המדגים הבלטה, פויל ועושר דפוס.",
          "SodaStream: מארז קמעונאי לשני בקבוקים עם מעטפת שקופה.",
          "גימור צורני: תקריב של חיתוך, צבע ואלמנטים מודפסים על קרטון בהיר.",
        ],
        images: [
          { id: "catalog-wissotzky", src: expandedCatalogImages.beverageWissotzky, label: "ויסוצקי" },
          { id: "catalog-sodastream", src: expandedCatalogImages.beverageSodastream, label: "SodaStream" },
          { id: "catalog-beverage-finishing", src: expandedCatalogImages.beverageFinishing, label: "גימור צורני" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- finishing
  {
    id: "finishing",
    title: "השבחות",
    path: "/he/finishing",
    group: "עמודים ראשיים",
    sections: [
      {
        id: "finishing-hero",
        title: "כותרת ופתיח",
        bullets: [
          'תיוג: "שלב 02" · כותרת: "השבחות שמוסיפות ערך".',
          "פתיח: ההשבחה היא השלב שבו האריזה מפסיקה להיות קרטון ומתחילה למכור — חלק מקו שלם מתכנון וקדם-דפוס ועד גימור, חיתוך והפצה.",
        ],
      },
      {
        id: "finishing-feature",
        title: "השבחה דיגיטלית — MGI",
        bullets: [
          'תיוג: "גימור פרימיום".',
          "מכונת MGI מאפשרת פויל והבלטת לכה תלת-ממדית במעבר דיגיטלי אחד — בלי קלישאות ובלי זמני התקנה.",
          "מתאימה לסדרות קצרות ובינוניות ולמותגים שרוצים גימור מדויק וחוזר.",
          'כפתור: "לקטלוג".',
        ],
        images: [
          {
            id: "finishing-foil",
            src: "/images/generated/finishing-hero/finishing-hero-v9-dalton.png",
            label: "תמונת ההשבחה הדיגיטלית (MGI)",
            alternatives: withCurrent(
              "/images/generated/finishing-hero/finishing-hero-v9-dalton.png",
              FINISHING_HEROES,
            ),
          },
        ],
      },
      {
        id: "finishing-metrics",
        title: "יכולות השבחה + ציטוט",
        bullets: [
          "יכולות: השבחה דיגיטלית MGI · פויל חם/קר · תקן איכות ISO 9001 · בטיחות מזון FSSC 22000.",
          'ציטוט: "האריזה היא המפגש הראשון בין המותג ללקוח. כשהגימור מדויק, המוצר מרגיש נכון עוד לפני שפותחים אותו." — בארי אריזות.',
        ],
      },
      {
        id: "finishing-deboss",
        title: "הטבעה ודיבוס",
        bullets: [
          'כותרת: "עומק שמרגישים במגע".',
          "הבלטה ודיבוס מוסיפים ממד מישושי ללוגו, לטיפוגרפיה או לדפוס — נוכחות שמורגשת ביד.",
        ],
        images: [
          {
            id: "finishing-deboss-img",
            src: "/images/generated/finishing-hero/finishing-hero-v1.png",
            label: "תמונת הטבעה/דיבוס",
            alternatives: withCurrent(
              "/images/generated/finishing-hero/finishing-hero-v1.png",
              FINISHING_HEROES,
            ),
          },
        ],
      },
      {
        id: "finishing-texture",
        previewText: "נקודת אור",
        title: "פויל והטבעה חמה",
        bullets: [
          'כותרת: "נקודת אור מדויקת".',
          "פויל חם או קר מוסיף ברק מתכתי ממוקד — לוגו, מסגרת או פרט שמושך את העין במדף.",
        ],
        images: [
          {
            id: "finishing-texture-img",
            src: "/images/generated/finishing-hero/finishing-hero-v6-beer.png",
            label: "תמונת פויל/הטבעה חמה",
            alternatives: withCurrent(
              "/images/generated/finishing-hero/finishing-hero-v6-beer.png",
              FINISHING_HEROES,
            ),
          },
        ],
      },
      {
        id: "finishing-cta",
        title: "קריאה לפעולה",
        bullets: [
          'כותרת: "איזו השבחה מתאימה למוצר שלכם?"',
          'כפתורים: "בקשת דוגמאות" · "צפייה בקטלוג".',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- blog index
  {
    id: "blog",
    title: "יומן — עמוד ראשי",
    path: "/he/blog",
    group: "בלוג",
    sections: [
      {
        id: "blog-hero",
        title: "כותרת ופתיח",
        bullets: [
          'תיוג: "בלוג · מהסטודיו ומהמפעל" · כותרת: "בארי מספרת".',
          "פתיח: מדריכים, מחשבות והצצות מתהליך העבודה — מהתכנון המבני ועד הדפוס וההשבחה.",
          "טקסט משנה: כתיבה על תכנון מבני, חומרי גלם, השבחות ומגמות בעיצוב אריזה.",
        ],
      },
      {
        id: "blog-list",
        previewText: "שפת ההשבחות",
        title: "רשימת הפוסטים",
        summary: "ששת הפוסטים שמופיעים ביומן (פירוט מלא בעמודים הבאים).",
        bullets: [
          "שפת ההשבחות (מגמות עיצוב · 20.5.2026).",
          "האנטומיה של אריזת יין (תכנון מבני · 12.5.2026).",
          "חומרי קרטון בני-מיחזור ב-2026 (קיימות · 28.4.2026).",
          "דפוס דיגיטלי או אופסט (מהמפעל · 9.4.2026).",
          "מהסקיצה לדגם (מהסטודיו · 30.3.2026).",
          "חלון התצוגה באריזה (תכנון מבני · 18.3.2026).",
        ],
      },
      {
        id: "blog-roles",
        previewText: "משרות פתוחות",
        title: "משרות פתוחות",
        summary:
          "הסעיף מוצג בסוף עמוד היומן (אין עמוד קריירה נפרד). שלוש המשרות הישנות הוסרו לבקשתכם — כרגע אין משרות פתוחות.",
        bullets: [
          'כותרת: "אין כרגע משרות פתוחות".',
          "טקסט: כרגע אין אצלנו משרות מאוישות לגיוס, אבל אנחנו תמיד שמחים להכיר. אפשר להשאיר פרטים ולצרף קורות חיים — וכשייפתח תפקיד שמתאים, נחזור אליכם.",
          'כפתור "שליחת קורות חיים" פותח את טופס המועמדות (בלי משרה מסוימת).',
          "מסנני המחלקות (הכל · ייצור · סטודיו) מוסתרים כל עוד אין משרות, ויחזרו יחד עם המשרות החדשות.",
        ],
      },
      {
        id: "blog-apply-dialog",
        title: "טופס הגשת מועמדות (חלון קופץ)",
        summary:
          'נפתח מכפתור "שליחת קורות חיים", ובעתיד גם מכפתור "להגשה" שליד כל משרה.',
        bullets: [
          'כותרת: "הגשת מועמדות" · תיוג: "קריירה · הצטרפות לצוות". כשתהיה משרה מסוימת, הכותרת תהיה שם המשרה.',
          'פאנל "על התפקיד" (תיאור המשרה ועיקרי התפקיד) מוצג רק כשנכנסים דרך משרה מסוימת.',
          "שלושה יתרונות: יציבות (חלק מקבוצת דפוס בארי) · צוות · התמקצעות.",
          "שדות: שם מלא · טלפון · דוא״ל · קורות חיים (צירוף קובץ, לא חובה).",
          'כפתור "שליחת מועמדות" · הודעת הצלחה: "המועמדות נשלחה — תודה שפניתם. צוות הגיוס יעבור על הפרטים ויחזור אליכם בהקדם."',
          'קישור משני: "יש לי שאלה — לפנייה כללית" (פותח את טופס יצירת הקשר).',
        ],
      },
      {
        id: "blog-newsletter",
        title: "מה חדש אצלנו (הרשמה)",
        bullets: [
          'כותרת: "מה חדש אצלנו" · טקסט: רוצים לקבל פוסט חדש כשהוא עולה? השאירו כתובת מייל ונעדכן.',
          "סינון לפי נושא + חיפוש בבלוג.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- blog posts
  {
    id: "blog-finishing-language",
    title: "פוסט — שפת ההשבחות",
    path: "/he/blog/finishing-language",
    group: "בלוג",
    sections: [
      {
        id: "post-finishing-language-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: מגמות עיצוב · זמן קריאה: 2 דקות · פורסם 20.5.2026.",
          "תקציר: איך פויל, לכה סלקטיבית והבלטה הופכים אריזת קרטון פשוטה לחוויית פרימיום שמרגישים עוד לפני הפתיחה.",
          "פתיח: אריזה טובה היא לא קישוט — היא עוזרת למותג להגיד משהו ברור. בקוסמטיקה, פארמה ויין ההשבחה היא חלק מהמסר.",
          'ציטוט: "האריזה היא המפגש הראשון בין המותג ללקוח — וכשההשבחה מדויקת, המוצר מרגיש נכון עוד לפני השימוש."',
        ],
        images: [
          {
            id: "post-fl-hero",
            src: "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
              HERO_NEW_STYLE,
            ),
          },
          {
            id: "post-fl-quote",
            src: "/images/generated/website-content/finishing/syrah-foil-detail-v1.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/website-content/finishing/syrah-foil-detail-v1.png",
              ["/images/generated/website-content/finishing/syrah-foil-detail-v2.png"],
            ),
          },
        ],
      },
      {
        id: "post-finishing-language-sections",
        previewText: "מה הלקוח רואה ומרגיש",
        title: "גוף הפוסט",
        bullets: [
          "01 — מה הלקוח רואה ומרגיש: בפרימיום הלקוח מחזיק, פותח ומעביר אצבע על הלוגו — וזה משפיע ישירות על הערך הנתפס.",
          "02 — לכה, פויל והבלטה: לכה סלקטיבית מדגישה פרט, פויל מוסיף ברק מטאלי, הבלטה יוצרת עומק. שימוש מדוד עדיף על עומס.",
        ],
        images: [
          {
            id: "post-fl-section",
            src: "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png",
              HERO_NEW_STYLE,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "blog-anatomy-of-a-wine-carton",
    title: "פוסט — האנטומיה של אריזת יין",
    path: "/he/blog/anatomy-of-a-wine-carton",
    group: "בלוג",
    sections: [
      {
        id: "post-wine-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: תכנון מבני · זמן קריאה: 2 דקות · פורסם 12.5.2026.",
          "תקציר: מהשרטוט ועד הקופסה שמגיעה למדף.",
          "פתיח: אריזת יין טובה מתחילה הרבה לפני הדפוס — בשאלות על גובה הבקבוק, קוטר הצוואר, אחיזה ואריזה על משטח.",
          'ציטוט: "אריזת יין נמדדת ברגע שמרימים אותה מהמדף — היא צריכה להרגיש יציבה, נקייה ובטוחה."',
        ],
        images: [
          {
            id: "post-wine-hero",
            src: "/images/generated/website-content/packaging/gold-wine-insert-handle-box.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/gold-wine-insert-handle-box.png",
              PACKAGING_SHOTS,
            ),
          },
          {
            id: "post-wine-quote",
            src: "/images/figma/catalog/wine.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent("/images/figma/catalog/wine.png", PACKAGING_SHOTS),
          },
        ],
      },
      {
        id: "post-wine-sections",
        previewText: "מהבקבוק לשרטוט",
        title: "גוף הפוסט",
        bullets: [
          "01 — מהבקבוק לשרטוט: מודדים את הבקבוק, מוסיפים מרווחי בטיחות ובונים שרטוט ראשוני. שרטוט מדויק חוסך תיקונים יקרים.",
          "02 — חומר, דפוס והשבחה: בוחרים קרטון במשקל מתאים, מתאימים דפוס לגוון התווית ומוסיפים השבחה נקודתית.",
        ],
        images: [
          {
            id: "post-wine-section",
            src: "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png",
              HERO_NEW_STYLE,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "blog-recyclable-stock-2026",
    title: "פוסט — חומרי קרטון בני-מיחזור ב-2026",
    path: "/he/blog/recyclable-stock-2026",
    group: "בלוג",
    sections: [
      {
        id: "post-recycle-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: קיימות · זמן קריאה: 2 דקות · פורסם 28.4.2026.",
          "תקציר: מה השוק מציע השנה — ואיך בוחרים חומר בלי לוותר על תחושת פרימיום.",
          "פתיח: שוק הקרטון בר-המיחזור בישראל התרחב מאוד. האתגר כבר אינו זמינות אלא בחירה נכונה.",
          'ציטוט: "קיימות לא חייבת לבוא על חשבון החוויה — חומר נכון נראה ומרגיש פרימיום בדיוק כמו קרטון רגיל."',
        ],
        images: [
          {
            id: "post-recycle-hero",
            src: "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
              PACKAGING_SHOTS,
            ),
          },
          {
            id: "post-recycle-quote",
            src: "/images/generated/website-content/packaging/open-capability-presentation-box.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/open-capability-presentation-box.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
      {
        id: "post-recycle-sections",
        previewText: "ממוחזר ומה שביניהם",
        title: "גוף הפוסט",
        bullets: [
          "01 — FSC, ממוחזר ומה שביניהם: ההבדל מורגש במחיר, בגוון הבסיס ובמרקם. בוחרים לפי הקטגוריה והמסר, לא לפי כותרת ירוקה.",
          "02 — לשמור על תחושת פרימיום: לכה מאט, הבלטה או פויל ממוחזר. לעיתים המרקם הטבעי של הקרטון הופך ליתרון שיווקי.",
        ],
        images: [
          {
            id: "post-recycle-section",
            src: "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/handled-suitcase-gift-box.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "blog-digital-vs-offset",
    title: "פוסט — דפוס דיגיטלי או אופסט",
    path: "/he/blog/digital-vs-offset",
    group: "בלוג",
    sections: [
      {
        id: "post-print-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: מהמפעל · זמן קריאה: 2 דקות · פורסם 9.4.2026.",
          "תקציר: איך בוחרים בין דפוס דיגיטלי לאופסט לפי כמות, גוונים ולוח זמנים.",
          "פתיח: דיגיטלי ואופסט הם שני עולמות שונים, וכל אחד מצטיין בסיטואציה אחרת.",
          'ציטוט: "אין דפוס „טוב יותר” — יש דפוס שמתאים יותר לכמות, ללוח הזמנים ולגוונים."',
        ],
        images: [
          {
            id: "post-print-hero",
            src: "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
              HERO_NEW_STYLE,
            ),
          },
          {
            id: "post-print-quote",
            src: "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png",
              HERO_NEW_STYLE,
            ),
          },
        ],
      },
      {
        id: "post-print-sections",
        previewText: "מהיר וגמיש",
        title: "גוף הפוסט",
        bullets: [
          "01 — דיגיטלי: מהיר וגמיש. מתאים לסדרות קצרות, גרסאות מרובות ופיילוטים, ללא לוחות וזמני הכנה.",
          "02 — אופסט: עקבי ומשתלם בכמות. עלות נמוכה ליחידה, גוונים מדויקים, תמיכה בפנטון ובהשבחות מורכבות.",
        ],
        images: [
          {
            id: "post-print-section",
            src: "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "blog-from-sketch-to-prototype",
    title: "פוסט — מהסקיצה לדגם",
    path: "/he/blog/from-sketch-to-prototype",
    group: "בלוג",
    sections: [
      {
        id: "post-sketch-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: מהסטודיו · זמן קריאה: 2 דקות · פורסם 30.3.2026.",
          "תקציר: איך רעיון הופך לדגם פיזי שאפשר להחזיק ביד — שלב שחוסך טעויות יקרות בייצור.",
          "פתיח: לפני שמדפיסים אלפי יחידות בונים דגם אחד — הדרך הזולה ביותר לגלות בעיות.",
          'ציטוט: "דגם אחד ביד שווה יותר מעשרה מסכי תלת-ממד — הוא חושף את מה שהמסך מסתיר."',
        ],
        images: [
          {
            id: "post-sketch-hero",
            src: "/images/generated/website-content/packaging/open-capability-presentation-box.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/open-capability-presentation-box.png",
              PACKAGING_SHOTS,
            ),
          },
          {
            id: "post-sketch-quote",
            src: "/images/generated/website-content/packaging/closed-textured-capability-box.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/closed-textured-capability-box.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
      {
        id: "post-sketch-sections",
        previewText: "סקיצה, דייליין ודגם",
        title: "גוף הפוסט",
        bullets: [
          "01 — סקיצה, דייליין ודגם: מסקיצה גסה לדייליין מדויק ולדגם חתוך ביד מאותו קרטון שייצא בפועל.",
          "02 — מה הדגם חושף: עובי קרטון שמשנה מידות, קיפול שמתנגד או לשונית סגירה חלשה — תיקון בשלב הזה עולה דקות.",
        ],
        images: [
          {
            id: "post-sketch-section",
            src: "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
    ],
  },
  {
    id: "blog-display-windows",
    title: "פוסט — חלון התצוגה באריזה",
    path: "/he/blog/display-windows",
    group: "בלוג",
    sections: [
      {
        id: "post-window-intro",
        title: "פתיח הפוסט",
        bullets: [
          "קטגוריה: תכנון מבני · זמן קריאה: 2 דקות · פורסם 18.3.2026.",
          "תקציר: מתי חלון במוצר עוזר למכירה ומתי הוא רק מחליש את הקופסה — והאיזון הנכון.",
          "פתיח: חלון נותן ללקוח לראות את המוצר, אבל כל חלון הוא גם חור בקרטון שמשפיע על החוזק ועל הייצור.",
          'ציטוט: "חלון טוב מראה בדיוק את מה שצריך — ולא סנטימטר יותר."',
        ],
        images: [
          {
            id: "post-window-hero",
            src: "/images/generated/website-content/packaging/closed-textured-capability-box.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/closed-textured-capability-box.png",
              PACKAGING_SHOTS,
            ),
          },
          {
            id: "post-window-quote",
            src: "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/kraft-sweets-window-box.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
      {
        id: "post-window-sections",
        previewText: "מתי חלון עובד",
        title: "גוף הפוסט",
        bullets: [
          "01 — מתי חלון עובד: כשהמוצר עצמו הוא נקודת המכירה (ממתק, מוצר טיפוח, פריט בעל צבע וצורה ייחודיים).",
          "02 — המחיר המבני: כל חלון מחליש את הדופן ודורש לעיתים סלי PVC או חיזוק. תכנון נכון שומר מרווח מהקיפולים.",
        ],
        images: [
          {
            id: "post-window-section",
            src: "/images/generated/website-content/packaging/beer-carrier-window-carton.png",
            label: "תמונת סקשן 01",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/beer-carrier-window-carton.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- legal
  {
    id: "privacy",
    title: "מדיניות פרטיות",
    path: "/he/privacy",
    group: "משפטי",
    sections: [
      {
        id: "privacy-doc",
        previewText: "מדיניות פרטיות",
        title: "מדיניות פרטיות — מסמך מלא",
        summary: "עודכן לאחרונה: יוני 2026. מבוסס על חוק הגנת הפרטיות, התשמ״א–1981.",
        bullets: [
          "פתיח: בארי אריזות מכבדת את פרטיות המבקרים ופועלת לפי חוק הגנת הפרטיות.",
          "המידע שאנו אוספים: מידע שנמסר מרצון (טפסים) + מידע טכני בסיסי.",
          "השימוש במידע: מענה לפניות, בחינת מועמדויות, תפעול ואבטחה, עמידה בדרישות חוק.",
          "מסירת מידע לצדדים שלישיים: לא מוכרים מידע; נמסר רק לספקי שירות, לפי דין ובתוך הקבוצה.",
          "עוגיות: עוגיות חיוניות בלבד; אין מעקב/פרסום ואין Analytics של צד שלישי.",
          "אבטחת מידע · שמירת המידע · זכויותיך (עיון, תיקון, מחיקה).",
          "קישורים לאתרים חיצוניים · שינויים במדיניות · נוסח עברי מחייב.",
          "סעיף יצירת קשר בנושאי פרטיות.",
        ],
      },
    ],
  },
  {
    id: "terms",
    title: "תנאי שימוש",
    path: "/he/terms",
    group: "משפטי",
    sections: [
      {
        id: "terms-doc",
        previewText: "תנאי שימוש",
        title: "תנאי שימוש — מסמך מלא",
        summary: "עודכן לאחרונה: יוני 2026.",
        bullets: [
          "פתיח: האתר מופעל על ידי בארי אריזות; השימוש מהווה הסכמה לתנאים.",
          "אופי האתר: אתר תדמית ומידע; המידע כללי ואינו הצעה מחייבת.",
          "קניין רוחני: כל הזכויות באתר ובתכניו שייכות לבארי אריזות.",
          "שימוש מותר ואסור: שימוש אישי בלבד; אסור שימוש בלתי חוקי, שיבוש, גרידה אוטומטית או התחזות.",
          "פניות והגשת מועמדויות · היעדר אחריות (AS IS).",
          "קישורים לצד שלישי · שינויים בתנאים ובאתר.",
          "דין חל וסמכות שיפוט (דין ישראלי) · נוסח עברי מחייב.",
          "סעיף יצירת קשר.",
        ],
      },
    ],
  },
] as const;
