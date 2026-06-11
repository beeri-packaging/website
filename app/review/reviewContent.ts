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
  "/images/generated/imagegen-real-products-vertical-2x3/mh-whisky-imagegen-ambience-v2-vertical-2x3.webp",
  "/images/generated/imagegen-real-products-vertical-2x3/mh-whisky-imagegen-ambience-v1-vertical-2x3.webp",
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
          'כותרת: "סטודיו ומפעל".',
          "וורדמרק: בארי אריזות · תיאור: אריזות קרטון בהתאמה אישית — תכנון, דפוס והשבחה תחת קורת גג אחת.",
          'תיוג מורשת: "משנת 1964".',
          "כתובת: פארן 4, יבנה · אימייל: orders@beeripacks.co.il · קישור ל-Google Maps.",
          "קישורי ניווט חוזרים + קישור «משרות פתוחות» (מוביל למשרות בעמוד היומן) + קישור LinkedIn.",
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
          "שדות: שם מלא · טלפון · אימייל (לא חובה) · חברה (לא חובה).",
          "סיבת הפנייה: הצעת מחיר · תיאום פגישה עם מת״ל · נושא אחר.",
          "שדה פרטים נוספים חופשי.",
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
          'תיוג עליון: "משנת 1964 — אריזות קרטון בהתאמה אישית".',
          'כותרת: "אריזה שעובדת בשביל המוצר".',
          'כפתורים: "התחלת תהליך" · "למה בארי".',
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
            src: "/images/generated/imagegen-real-products-vertical-2x3/barkan-wine-imagegen-ambience-vertical-2x3.webp",
            label: 'פאנל "מפתחים פתרון"',
            alternatives: withCurrent(
              "/images/generated/imagegen-real-products-vertical-2x3/barkan-wine-imagegen-ambience-vertical-2x3.webp",
              PRODUCT_VERTICALS,
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
            src: "/images/generated/imagegen-real-products-vertical-2x3/mh-whisky-imagegen-ambience-v2-vertical-2x3.webp",
            label: 'פאנל "מייצרים אריזה מדויקת"',
            alternatives: withCurrent(
              "/images/generated/imagegen-real-products-vertical-2x3/mh-whisky-imagegen-ambience-v2-vertical-2x3.webp",
              PRODUCT_VERTICALS,
            ),
          },
          {
            id: "home-journey-today",
            src: "/images/generated/timeline/beeri-today-simple.png",
            label: 'פאנל "מי אנחנו היום"',
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
            src: "/images/figma/service-1.png",
            label: "תמונת מעבדת הפיתוח",
            alternatives: withCurrent("/images/figma/service-1.png", PACKAGING_SHOTS),
          },
        ],
      },
      {
        id: "home-faq",
        title: "שאלות נפוצות",
        bullets: [
          'כותרת: "מה חשוב לדעת לפני שמתחילים?"',
          'שאלה 1: "האם צריך להגיע עם עיצוב מוכן?" — אפשר להתחיל מרעיון, מוד בורד או סקיצה.',
          'שאלה 2: "מה צריך לשלוח כדי לקבל הצעת מחיר?" — מידות, כמויות, חומר, סוג דפוס, השבחות ולוח זמנים.',
          'שאלה 3: "מה זה דייליין?" — קובץ החיתוך והקיפול של האריזה (מפת השטנץ).',
          'שאלה 4: "האם אפשר לקבל דוגמה לפני ייצור?" — כן, דוגמה דיגיטלית בגודל אמת.',
          'שאלה 5: "מה משפיע על מחיר אריזה ממותגת?" — כמות, מידות, קרטון, צבעי דפוס, השבחות, מורכבות שטנץ וזמן אספקה.',
        ],
      },
      {
        id: "home-cta",
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
          'תיוג: "אודות" · כותרת: "מורשת של דפוס, אריזה של היום".',
          "פתיח: בארי אריזות מתכננת ומייצרת אריזות קרטון מודפסות בהתאמה אישית — מהרעיון ועד המדף, תחת קורת גג אחת ביבנה. חברה בקבוצת דפוס בארי עם מורשת דפוס של מעל מאה שנה.",
        ],
      },
      {
        id: "about-heritage",
        title: "קבוצת דפוס בארי",
        bullets: [
          'כותרת: "חברה בקבוצת דפוס בארי".',
          "תיאור: חלק מקבוצת דפוס בארי — מבתי הדפוס המובילים בישראל, פועל מקיבוץ בארי משנת 1950.",
          "1910 — דפוס חרט: ראשיתו בוורשה, המשכו בתל אביב משנת 1936.",
          "1946 — גרפיקה בצלאל: מהמכון הגרפי של בצלאל לבית דפוס מסחרי.",
          "1950 — דפוס בארי: בית הדפוס הראשון בנגב, בבעלות קיבוץ בארי.",
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
        title: "אבני דרך — התאגדות וצמיחה",
        bullets: [
          "1964 — הקמת החברה: רישום הישות המשפטית (ח״פ 520026113).",
          "2019 — רכישת גרפיקה בצלאל על ידי קיבוץ בארי.",
          "2020 — צירוף דפוס חרט.",
          "2021 — שינוי השם לבארי אריזות בע״מ.",
          "2026 — בעלות מלאה של דפוס בארי.",
        ],
      },
      {
        id: "about-stats",
        title: "במספרים — המפעל ביבנה",
        bullets: [
          "כ־140 עובדים (100 ייצור · 40 מטה).",
          "7,900 מ״ר ייצור ומשרדים + 3,000 מ״ר מרלו״ג.",
          "שנת הקמה: 1964.",
          "3+2 משמרות ביממה (דפוס · גימורים).",
        ],
        images: [
          {
            id: "about-production-floor",
            src: "/images/about/production/factory-floor.jpg",
            label: "רצפת הייצור",
            alternatives: withCurrent("/images/about/production/factory-floor.jpg", [
              "/images/about/production/offset-press.png",
              "/images/about/production/digital-press.png",
              "/images/about/production/die-cutting.png",
              "/images/about/production/finishing-line.jpg",
            ]),
          },
        ],
      },
      {
        id: "about-partners",
        title: "מבין לקוחותינו",
        bullets: [
          'כותרת: "שותפות מנצחת".',
          "לוגואים של לקוחות: Strauss · Osem · Tnuva · Elite · SodaStream · Moroccanoil · AHAVA · Dr. Fischer.",
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
          'תיוג: "קטלוג / 2026" · כותרת: "כשהמבנה פוגש מותג".',
          "פתיח: אינדקס אריזות הקרטון הממותגות: קוסמטיקה, יין ומשקאות ומערכות מודולריות. מתכנון מבני ודיוק שטנץ ועד חומר, דפוס והשבחות.",
          "כרטיס מפרט: מפעל יבנה · פעיל משנת 1964 · תקן ISO 9001:2015.",
        ],
      },
      {
        id: "catalog-cosmetics",
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
        title: "קטגוריה 02 — יין ומשקאות (2 פריטים)",
        bullets: [
          "מארז שי ליין: קרטון קשיח לבקבוק יין עם תמיכה פנימית, שטנץ צורני והשבחות פויל ולכה. משקל 350 גרם · דוגמה לפני ייצור.",
          "מארז וויסקי פרימיום: חלון, פויל ולכה סלקטיבית עם תמיכה פנימית. השבחת פויל ולכה · תקן ISO 9001:2015.",
          'לכל פריט כפתור "לבקשת מפרט" שפותח את טופס הפנייה.',
        ],
        images: [
          { id: "catalog-wine", src: "/images/figma/catalog/wine.png", label: "מארז שי ליין" },
          { id: "catalog-whiskey", src: "/images/figma/catalog/whiskey.png", label: "מארז וויסקי" },
        ],
      },
      {
        id: "catalog-modular",
        title: "קטגוריה 03 — מערכת מודולרית (פריט אחד)",
        bullets: [
          "מערכת מארזים מודולרית: חוצצים ומגירות לסדרות מוצרים.",
          "מפרט: סטייה ±0.1 מ״מ · שטנץ צורני · מבנה גרסה 02.",
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
          'תיוג: "יומן · מהסטודיו ומהמפעל" · כותרת: "יומן מהסטודיו".',
          "פתיח: מדריכים, מחשבות והצצות מתהליך העבודה — מהתכנון המבני ועד הדפוס וההשבחה.",
          "טקסט משנה: כתיבה על תכנון מבני, חומרי גלם, השבחות ומגמות בעיצוב אריזה.",
        ],
      },
      {
        id: "blog-list",
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
        title: "משרות פתוחות",
        summary:
          "המשרות מוצגות בסוף עמוד היומן (אין עמוד קריירה נפרד). לחיצה על «להגשה» פותחת טופס מועמדות.",
        bullets: [
          "סינון לפי מחלקה: הכל · ייצור · סטודיו.",
          "#BR-402 — רכז/ת איכות · משרה מלאה · יבנה: ניהול מערך האיכות של המפעל, שמירה על תקני ISO 9001:2015 ו־FSSC 22000.",
          "#BR-409 — מבקר/ת איכות בייצור · משרה מלאה · יבנה: בקרת איכות שוטפת על רצפת הייצור — גיליונות, צבע, חיתוך והדבקה.",
          "#BR-312 — מנהל/ת פרויקטים בייצור · משרה מלאה · יבנה: הובלת פרויקטים מהאפיון הראשון ועד האספקה.",
          'לכל משרה תיאור "על התפקיד" + עד 4 נקודות עיקרי תפקיד בתוך חלון ההגשה.',
        ],
      },
      {
        id: "blog-apply-dialog",
        title: "טופס הגשת מועמדות (חלון קופץ)",
        summary: 'נפתח מכפתור "להגשה" שליד כל משרה.',
        bullets: [
          'כותרת: שם המשרה · תיוג: "קריירה · הצטרפות לצוות".',
          'פאנל "על התפקיד": תיאור המשרה ועיקרי התפקיד.',
          "שלושה יתרונות: יציבות (חלק מקבוצת דפוס בארי) · צוות · התמקצעות.",
          "שדות: שם מלא · טלפון · דוא״ל · קורות חיים (צירוף קובץ, לא חובה).",
          'כפתור "שליחת מועמדות" · הודעת הצלחה: "המועמדות נשלחה — תודה שפניתם. צוות הגיוס יעבור על הפרטים ויחזור אליכם בהקדם."',
          'קישור משני: "יש לי שאלה — לפנייה כללית" (פותח את טופס יצירת הקשר).',
        ],
      },
      {
        id: "blog-newsletter",
        title: "עדכוני יומן (הרשמה)",
        bullets: [
          'כותרת: "עדכוני יומן" · טקסט: רוצים לקבל פוסט חדש כשהוא עולה? השאירו כתובת מייל ונעדכן.',
          "סינון לפי נושא + חיפוש ביומן.",
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
          "תקציר: מה הופך אריזת יין טובה — מהדייליין הראשון ועד הקופסה שמגיעה למדף.",
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
        title: "גוף הפוסט",
        bullets: [
          "01 — מהבקבוק לדייליין: מודדים את הבקבוק, מוסיפים מרווחי בטיחות ובונים דייליין ראשוני. דייליין מדויק חוסך תיקונים יקרים.",
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
            src: "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
            label: "תמונה ליד הציטוט",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
              PACKAGING_SHOTS,
            ),
          },
        ],
      },
      {
        id: "post-recycle-sections",
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
            src: "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
            label: "תמונת כותרת",
            alternatives: withCurrent(
              "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
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
