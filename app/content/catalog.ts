/**
 * Catalog page content layer — "כשהמבנה פוגש מותג".
 *
 * Mirrors the pattern of `home.ts` / `careers.ts`: typed, bilingual copy that
 * the GROQ mapper swaps for Sanity-backed content when the CMS is seeded, and
 * falls back to here otherwise so the page (and the build) never break.
 *
 * Three category layouts share one `CatalogItem` shape (only the relevant
 * fields are populated per layout):
 *   - "grid"    — square photo cards with hover technical overlay + tags
 *   - "feature" — large split cards (photo + spec column + spec download)
 *   - "modular" — a single full-width system card with centered spec row
 */

import type { Lang } from "./home";

export type CatalogTagTone = "outline" | "cyan" | "purple" | "magenta";
export type CatalogTag = { label: string; tone: CatalogTagTone };
export type CatalogSpec = { label: string; value: string };

export type CatalogItem = {
  /** Stable key, shared across locales — used for image lookup + React keys. */
  key: string;
  name: string;
  /** Small eyebrow above the name on feature cards (e.g. "סדרת יין"). */
  series?: string;
  description: string;
  /** Resolved image src (public path as fallback, Sanity CDN once seeded). */
  image?: string;
  /** Grid cards: up to two accent tags. */
  tags?: readonly CatalogTag[];
  /** Feature + modular cards: labelled spec values. */
  specs?: readonly CatalogSpec[];
  /** Grid cards: label revealed on the hover technical overlay. */
  overlayLabel?: string;
  /** Grid cards: spec lines revealed on the hover technical overlay. */
  overlaySpecs?: readonly string[];
  /** Feature cards: spec-download button label. */
  cta?: string;
};

export type CatalogLayout = "grid" | "feature" | "modular";

export type CatalogCategory = {
  key: string;
  /** Two-digit index shown in the yellow tag (e.g. "01"). */
  number: string;
  /** Category name shown in the yellow tag (e.g. "קוסמטיקה"). */
  name: string;
  /** Item-count label shown opposite the tag (e.g. "4 פריטים"). */
  count: string;
  layout: CatalogLayout;
  items: readonly CatalogItem[];
};

export type CatalogCopy = {
  /** Teal hero eyebrow, e.g. "קטלוג / 2026". */
  eyebrow: string;
  /** Display title broken into two lines. */
  title: readonly [string, string];
  /** Hero body paragraph. */
  intro: string;
  /** The 3 mono lines in the hero spec card. */
  specCard: readonly [string, string, string];
  categories: readonly CatalogCategory[];
};

/** Public-path images (uploaded to Sanity by the seed script, keyed by path). */
export const catalogImages = {
  serum: "/images/figma/catalog/serum.png",
  ampoule: "/images/figma/catalog/ampoule.png",
  cream: "/images/figma/catalog/cream.png",
  perfume: "/images/figma/catalog/perfume.png",
  wine: "/images/figma/catalog/wine.png",
  whiskey: "/images/figma/catalog/whiskey.png",
} as const;

export const catalogCopy: Record<Lang, CatalogCopy> = {
  he: {
    eyebrow: "קטלוג / 2026",
    title: ["כשהמבנה", "פוגש מותג"],
    intro:
      "אינדקס אריזות הקרטון הממותגות שלנו: קוסמטיקה, יין ומשקאות ומערכות מודולריות. מתכנון מבני ודיוק השטנץ ועד הבחירה בחומר, בדפוס ובהשבחות — הכול תחת קורת גג אחת.",
    specCard: ["מפעל: יבנה, ישראל", "סטטוס: פעיל", "תקן: ISO 9001:2015"],
    categories: [
      {
        key: "cosmetics",
        number: "01",
        name: "קוסמטיקה",
        count: "4 פריטים",
        layout: "grid",
        items: [
          {
            key: "serum",
            name: "קופסת סרום פרימיום",
            description: "קופסת קרטון קשיח עם מגירה פנימית, חלון שטנץ ופויל — מציגה את מוצר הטיפוח ומגינה עליו על המדף.",
            image: catalogImages.serum,
            tags: [
              { label: "פויל זהב", tone: "outline" },
              { label: "ניתן למיחזור", tone: "cyan" },
            ],
            overlayLabel: "תצוגת שטנץ",
            overlaySpecs: ['סטייה: ±0.1 מ"מ', "חומר: קרטון קשיח"],
          },
          {
            key: "ampoule",
            name: "מארז אמפולות",
            description: "מבנה עם חוצץ פנימי וסימון סדרה — שומר על האמפולות במקומן ומתאים לדרישות הפארמה.",
            image: catalogImages.ampoule,
            tags: [
              { label: "סימון סדרה", tone: "outline" },
              { label: "חוצץ פנימי", tone: "purple" },
            ],
            overlayLabel: "קו קיפול",
          },
          {
            key: "cream",
            name: "מארז צנצנת קרם",
            description: "אריזת קרטון ממוחזר עם חלון ומגירה — מציגה את צנצנת הקרם ומחזיקה אותה יציב.",
            image: catalogImages.cream,
            tags: [
              { label: "חלון", tone: "outline" },
              { label: "ממוחזר", tone: "cyan" },
            ],
          },
          {
            key: "perfume",
            name: "קופסת בושם",
            description: "מבנה קרטון קשיח עם הבלטה ולכה סלקטיבית — נותן לבקבוק הבושם נוכחות מדף ותחושת יוקרה במגע.",
            image: catalogImages.perfume,
            tags: [
              { label: "הבלטה", tone: "outline" },
              { label: "לכה סלקטיבית", tone: "magenta" },
            ],
          },
        ],
      },
      {
        key: "spirits",
        number: "02",
        name: "יין ומשקאות",
        count: "2 פריטים",
        layout: "feature",
        items: [
          {
            key: "wine",
            series: "סדרת יין",
            name: "מארז שי ליין",
            description:
              "מארז קרטון קשיח לבקבוק יין, עם תמיכה פנימית, שטנץ צורני והשבחות פויל ולכה. מגן על הבקבוק במשלוח ומעמיד אותו כמתנה. מתאים למארזי שי ולסדרות עונתיות.",
            image: catalogImages.wine,
            specs: [
              { label: "משקל", value: "350 גרם" },
              { label: "דוגמה", value: "לפני ייצור" },
            ],
            cta: "לבקשת מפרט",
          },
          {
            key: "whiskey",
            series: "סדרת פרימיום",
            name: "מארז וויסקי פרימיום",
            description:
              "מארז פרימיום לבקבוק וויסקי, עם חלון, פויל ולכה סלקטיבית. תמיכה פנימית שמגינה על הבקבוק ומקלה על הנשיאה.",
            image: catalogImages.whiskey,
            specs: [
              { label: "השבחה", value: "פויל ולכה" },
              { label: "תקן", value: "ISO 9001:2015" },
            ],
            cta: "לבקשת מפרט",
          },
        ],
      },
      {
        key: "modular",
        number: "03",
        name: "מארז מנצח",
        count: "זוכה · 2025",
        layout: "modular",
        items: [
          {
            key: "winning-package",
            name: "מארז גבריאל",
            description:
              "המארז שזכה במקום השלישי בתחרות כוכב ישראל 2025 — שער הכניסה לתחרות הבינלאומית WorldStar. תכנון מבני חדשני, דיוק שטנץ והשבחה, לצד עמידה בסטנדרטים בינלאומיים של איכות, קיימות ומצוינות.",
            specs: [
              { label: "תחרות", value: "כוכב ישראל" },
              { label: "דירוג", value: "מקום שלישי" },
              { label: "ארגון", value: "WPO · WorldStar" },
            ],
          },
        ],
      },
    ],
  },
  en: {
    eyebrow: "Catalog / 2026",
    title: ["When structure", "meets brand"],
    intro:
      "An index of our branded folding-carton packaging: cosmetics, wine & spirits, and modular systems. From structural design and die-cut precision to material, print and finishing — all under one roof.",
    specCard: ["Plant: Yavne, Israel", "Status: Active", "Standard: ISO 9001:2015"],
    categories: [
      {
        key: "cosmetics",
        number: "01",
        name: "Cosmetics",
        count: "4 items",
        layout: "grid",
        items: [
          {
            key: "serum",
            name: "Premium serum box",
            description: "Rigid carton box with an inner drawer, die-cut window and foil — presents the skincare product and protects it on the shelf.",
            image: catalogImages.serum,
            tags: [
              { label: "Gold foil", tone: "outline" },
              { label: "Recyclable", tone: "cyan" },
            ],
            overlayLabel: "Die view",
            overlaySpecs: ["Tolerance: ±0.1 mm", "Material: rigid board"],
          },
          {
            key: "ampoule",
            name: "Ampoule pack",
            description: "Structure with an inner divider and series marking — holds the ampoules in place and meets pharma requirements.",
            image: catalogImages.ampoule,
            tags: [
              { label: "Series marking", tone: "outline" },
              { label: "Inner divider", tone: "purple" },
            ],
            overlayLabel: "Fold line",
          },
          {
            key: "cream",
            name: "Cream jar pack",
            description: "Recycled carton pack with a window and drawer — presents the cream jar and holds it steady.",
            image: catalogImages.cream,
            tags: [
              { label: "Window", tone: "outline" },
              { label: "Recycled", tone: "cyan" },
            ],
          },
          {
            key: "perfume",
            name: "Perfume box",
            description: "Rigid carton structure with deboss and spot varnish — gives the perfume bottle shelf presence and a premium feel in hand.",
            image: catalogImages.perfume,
            tags: [
              { label: "Deboss", tone: "outline" },
              { label: "Spot varnish", tone: "magenta" },
            ],
          },
        ],
      },
      {
        key: "spirits",
        number: "02",
        name: "Wine & spirits",
        count: "2 items",
        layout: "feature",
        items: [
          {
            key: "wine",
            series: "Wine series",
            name: "Wine gift box",
            description:
              "A rigid carton case for a wine bottle, with inner support, shaped die-cut and foil & varnish finishing. Protects the bottle in transit and presents it as a gift. Suited to gift sets and seasonal series.",
            image: catalogImages.wine,
            specs: [
              { label: "Weight", value: "350 g" },
              { label: "Sample", value: "Pre-production" },
            ],
            cta: "Request the spec",
          },
          {
            key: "whiskey",
            series: "Premium series",
            name: "Premium whiskey case",
            description:
              "A premium case for a whiskey bottle, with a window, foil and spot varnish. Inner support that protects the bottle and makes it easy to carry.",
            image: catalogImages.whiskey,
            specs: [
              { label: "Finishing", value: "Foil & varnish" },
              { label: "Standard", value: "ISO 9001:2015" },
            ],
            cta: "Request the spec",
          },
        ],
      },
      {
        key: "modular",
        number: "03",
        name: "Winning package",
        count: "Award · 2025",
        layout: "modular",
        items: [
          {
            key: "winning-package",
            name: "The Gabriel pack",
            description:
              "The package that took third place at the 2025 Star of Israel awards — the gateway to the international WorldStar competition. Innovative structural design, die-cut precision and finishing, meeting international standards of quality, sustainability and excellence.",
            specs: [
              { label: "Competition", value: "Star of Israel" },
              { label: "Ranking", value: "Third place" },
              { label: "Organization", value: "WPO · WorldStar" },
            ],
          },
        ],
      },
    ],
  },
};
