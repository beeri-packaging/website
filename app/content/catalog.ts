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
 *   - "modular" — a single full-width editorial card with centered spec row
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
  /** Teal hero eyebrow, e.g. "קטלוג". */
  eyebrow: string;
  /** Display title broken into two lines. */
  title: readonly [string, string];
  /** Hero body paragraph. */
  intro: string;
  /** The 3 mono lines in the hero spec card. */
  categories: readonly CatalogCategory[];
};

/** Public-path images (uploaded to Sanity by the seed script, keyed by path). */
export const catalogImages = {
  serum: "/images/figma/catalog/serum.png",
  ampoule: "/images/figma/catalog/ampoule.png",
  cream: "/images/figma/catalog/cream.png",
  perfume: "/images/figma/catalog/perfume.png",
  wine: "/images/figma/catalog/wine.png",
} as const;

/** Client-approved coffee product shots, stored on the Sanity CDN. */
export const coffeeImages = {
  elite:
    "https://cdn.sanity.io/images/4qkb39ql/production/43f263ed307fa20e5940a596f38ed2d13549e06d-1254x1254.png",
  aroma:
    "https://cdn.sanity.io/images/4qkb39ql/production/b76503fe78173a5e8b45738053f9384adbec98b4-1254x1254.png",
  joe:
    "https://cdn.sanity.io/images/4qkb39ql/production/2044098be5999ae7b93eb223844f0e1225fbd60a-1254x1254.png",
} as const;

/** Existing Beeri beer-carrier photography, uploaded to Sanity by the catalog update script. */
export const beerImages = {
  malka:
    "https://cdn.sanity.io/images/4qkb39ql/production/42340ef6c8218f90b3d0672a114714d25bbbe5a6-1254x1254.png",
  goldstar:
    "https://cdn.sanity.io/images/4qkb39ql/production/c5f66742400d211331e4b36ae4ee47349b93f5e7-1254x1254.png",
  carlsberg:
    "https://cdn.sanity.io/images/4qkb39ql/production/cb80dbd33482e67aa5570333d176b3fa5582c27f-1254x1254.png",
  tuborg:
    "https://cdn.sanity.io/images/4qkb39ql/production/4d1fcda1d9208c63a82f052fc4a08c6dfefa658f-1254x1254.png",
} as const;

/** Client-supplied wine and beverage work, AI-restaged for a consistent catalog. */
export const expandedCatalogImages = {
  wineMony:
    "https://cdn.sanity.io/images/4qkb39ql/production/dea836e6d240a0a7127697a48bbcdafa51e7964a-1254x1254.png",
  wineBarkan:
    "https://cdn.sanity.io/images/4qkb39ql/production/3ee90823d0a4a1cc6def0d316a485fc90b362b62-1254x1254.png",
  wineGolan:
    "https://cdn.sanity.io/images/4qkb39ql/production/7375aaa498d2b33e274a54f88de949699852c7dd-1254x1254.png",
  wineCarmel:
    "https://cdn.sanity.io/images/4qkb39ql/production/7b52dd90ec570a96ced6a440b37f46e26032a5e5-1254x1254.png",
  wineTabor:
    "https://cdn.sanity.io/images/4qkb39ql/production/04c75762d6674599e12f28d0dfc42f1184de3707-1254x1254.png",
  wineRecanati:
    "https://cdn.sanity.io/images/4qkb39ql/production/a474f3063ab86f1230adeaed49244ee3433f90d1-1254x1254.png",
  coffeeTastersChoice:
    "https://cdn.sanity.io/images/4qkb39ql/production/dd9f9e5a5e122390230acaf7f8125b13424d16c9-1254x1254.png",
  beverageWissotzky:
    "https://cdn.sanity.io/images/4qkb39ql/production/586f4fd969ef1f5557283c7d7f8bf8e6e4a4f4e4-1254x1254.png",
  beverageSodastream:
    "https://cdn.sanity.io/images/4qkb39ql/production/701900c1a22b60074f4eb99ab827f8a1907f2495-1254x1254.png",
  beverageFinishing:
    "https://cdn.sanity.io/images/4qkb39ql/production/9287e39ad972889b20ed68e0d1118a5043ea4c36-1254x1254.png",
} as const;

export const catalogCopy: Record<Lang, CatalogCopy> = {
  he: {
    eyebrow: "קטלוג",
    title: ["כשהמבנה", "פוגש מותג"],
    intro:
      "אינדקס אריזות הקרטון הממותגות שלנו מציע מגוון פתרונות מתקדמים ומותאמים אישית למספר רחב של תעשיות, ביניהן קוסמטיקה, מזון, יין, משקאות, טקסטיל, קפה, פארמה וטואלטיקה.\n\nלתעשיות הקוסמטיקה והטואלטיקה נספק אריזות מרהיבות ומדויקות עם מבחר רחב של אפשרויות השבחה שיסייעו למוצרים לבלוט על המדף. עבור חברות המזון והקפה נתאים אריזות המשלבות הגנה מקסימלית על איכות המוצר לצד עיצוב מזמין וידידותי למשתמש.\n\nבתחום הפארמה נפתח אריזות העומדות בתקנים המחמירים ביותר תוך הקפדה על נוחות השימוש עבור הצרכן. לעולם היין והמשקאות נציע מנעד רחב של אריזות ממותגות, הן לבקבוקים בודדים והן למארזי יוקרה רב-תכליתיים. ליצרני הטקסטיל נפתח פתרונות אריזה מותאמים.\n\nמתכנון מבנה, בחירת חומרים ודיוק מרבי בשטנץ ועד לשילוב מורכב של טכנולוגיות דפוס והשבחה חדשניות — אנו מציעים ללקוחותינו שירות מקיף לפיתוח האריזה האולטימטיבית עבור כל סוג של מוצר.\n\nגלו כאן את השפע והגיוון של פתרונות אריזות הקרטון שלנו, ובחרו את האריזה שתניע את המוצר שלכם להצלחה בכל תעשייה.",
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
            name: "מארז פרימיום",
            description:
              "קיט מוצרי קוסמטיקה יוקרתי. מיוצר מחומר גלם מתכתי. מודפס בפנטון זהב מטאלי כולל למינציה.",
            image: catalogImages.serum,
            tags: [
              { label: "למינציה", tone: "outline" },
              { label: "נייר מתכתי", tone: "cyan" },
            ],
            overlayLabel: "תצוגת שטנץ",
            overlaySpecs: ['סטייה: ±0.1 מ"מ', "חומר: קרטון קשיח"],
          },
          {
            key: "ampoule",
            name: "מארז שלישיית צנצנות",
            description:
              "העיצוב מאפשר זיהוי ברור של המוצרים ממבט ראשון מבלי לפתוח את האריזה.",
            image: catalogImages.ampoule,
            tags: [
              { label: "קיט מוצר", tone: "outline" },
            ],
            overlayLabel: "קו קיפול",
          },
          {
            key: "cream",
            name: "מארז צנצנות קוסמטיקה",
            description:
              "אריזת קרטון מיועדת לצנצנת קרם עם מבנה המעניק למוצר נראות יוקרתית. ניתן לשלב בהדפסה השבחות כגון פויל זהב או כסף והבלטות.",
            image: catalogImages.cream,
            tags: [
              { label: "השבחות", tone: "outline" },
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
        count: "6 פריטים",
        layout: "grid",
        items: [
          {
            key: "wine-mony",
            name: "יקב מוני",
            description:
              "מארז יין בודד יוקרתי מכסה ותחתית כולל השבחות מותאם למוצר.",
            image: expandedCatalogImages.wineMony,
            tags: [
              { label: "בקבוק יחיד", tone: "outline" },
              { label: "פויל זהב", tone: "magenta" },
            ],
          },
          {
            key: "wine-barkan",
            name: "יקב ברקן",
            description:
              "מארז יין שחור מסדרת Altitude בודד יוקרתי מכסה ותחתית כולל השבחות מותאם למוצר.",
            image: expandedCatalogImages.wineBarkan,
            tags: [
              { label: "בקבוק יחיד", tone: "outline" },
              { label: "מארז פרימיום", tone: "purple" },
            ],
          },
          {
            key: "wine-golan",
            name: "יקב רמת הגולן",
            description:
              "מארז שי לבקבוק יין ושתי כוסות, עם חלונות צורניים ומבנה שמציג ומקבע כל פריט. המארז מודפס על קראפט חום.",
            image: expandedCatalogImages.wineGolan,
            tags: [
              { label: "בקבוק ושתי כוסות", tone: "outline" },
              { label: "קראפט", tone: "cyan" },
            ],
          },
          {
            key: "wine-carmel",
            name: "יקב כרמל",
            description:
              "מארז גנארי מיוחד שמותאם למוצרים שונים עם ידית נשיאה פטנט יחודי שלנו.",
            image: expandedCatalogImages.wineCarmel,
            tags: [
              { label: "פטנט ידית נשיאה", tone: "outline" },
              { label: "מארז גנארי", tone: "magenta" },
            ],
          },
          {
            key: "wine-tabor",
            name: "יקב תבור",
            description:
              "מארז חגיגי למתנה מותאם לכמה מוצרים שונים. זכה בתחרות עיצוב “כוכב ישראל”. מודפס על קראפט חום.",
            image: expandedCatalogImages.wineTabor,
            tags: [
              { label: "מארז גנארי", tone: "outline" },
              { label: "קראפט", tone: "cyan" },
            ],
          },
          {
            key: "wine-recanati",
            name: "יקב רקנאטי",
            description:
              "מארז מיוחד לשני בקבוקים ושתי כוסות עם חלון תצוגה פתוחה של המוצרים בחיתוך מיוחד.",
            image: expandedCatalogImages.wineRecanati,
            tags: [
              { label: "שני בקבוקים ושתי כוסות", tone: "outline" },
              { label: "קראפט חום", tone: "purple" },
            ],
          },
        ],
      },
      {
        key: "coffee",
        number: "03",
        name: "קפה",
        count: "4 פריטים",
        layout: "grid",
        items: [
          {
            key: "coffee-elite",
            name: "קפה עלית שטראוס",
            description:
              "אריזת קרטון ממותגת לקפסולות קפה, כוללת השבחות עם פתיחה מיוחדת וקלה לצרכן בעלת נוכחות מדף.",
            image: coffeeImages.elite,
            tags: [
              { label: "קפה", tone: "outline" },
              { label: "קפסולות", tone: "cyan" },
            ],
          },
          {
            key: "coffee-aroma",
            name: "קפה ארומה",
            description:
              "סט מארז לקפסולות כולל דיספליי עם בולטות בנקודת המכירה.",
            image: coffeeImages.aroma,
            tags: [
              { label: "קפה", tone: "outline" },
              { label: "דיספליי", tone: "magenta" },
            ],
          },
          {
            key: "coffee-joe",
            name: "קפה ג׳ו",
            description:
              "סדרת אריזות לקפסולות קפה כולל השבחות של לכה סלקטיבית והטבעה עם בידול גרפי מותאם ללקוח, בסוגים שונים של טעמי קפה.",
            image: coffeeImages.joe,
            tags: [
              { label: "קפה", tone: "outline" },
              { label: "השבחות", tone: "purple" },
            ],
          },
          {
            key: "coffee-tasters-choice",
            name: "נסטלה / אסם",
            description:
              "מארז Taster’s Choice וכוס מתנה.",
            image: expandedCatalogImages.coffeeTastersChoice,
            tags: [
              { label: "מארז קפה", tone: "outline" },
              { label: "מארז מתנה", tone: "cyan" },
            ],
          },
        ],
      },
      {
        key: "beer",
        number: "04",
        name: "בירות",
        count: "4 פריטים",
        layout: "grid",
        items: [
          {
            key: "beer-malka",
            name: "בירה מלכה",
            description:
              "מארז לארבעה בקבוקי בירה וכוס, עם חלונות שמציגים את המוצרים.",
            image: beerImages.malka,
            tags: [
              { label: "מארזי בירה", tone: "outline" },
            ],
          },
          {
            key: "beer-goldstar",
            name: "טמפו",
            description:
              "מאגדת שישיות בירה גולדסטאר.",
            image: beerImages.goldstar,
            tags: [
              { label: "מארזי בירה", tone: "outline" },
            ],
          },
          {
            key: "beer-carlsberg",
            name: "החברה המרכזית / קרלסברג",
            description:
              "מאגדת שישיות קרלסברג כולל השבחות. המאגדת חובקת שישה בקבוקי בירה.",
            image: beerImages.carlsberg,
            tags: [
              { label: "מאגדות בירה", tone: "outline" },
            ],
          },
          {
            key: "beer-tuborg",
            name: "החברה המרכזית / קרלסברג",
            description:
              "מאגדת שישיות טובורג כולל השבחות. המאגדת חובקת שישה בקבוקי בירה.",
            image: beerImages.tuborg,
            tags: [
              { label: "מאגדות בירה", tone: "outline" },
            ],
          },
        ],
      },
      {
        key: "beverages",
        number: "05",
        name: "תה ומשקאות",
        count: "3 פריטים",
        layout: "grid",
        items: [
          {
            key: "beverage-wissotzky",
            name: "תה ויסוצקי",
            description:
              "אריזת תה מיוחדת ליצוא הכוללת השבחות מיוחדות המבליטות את האריזה.",
            image: expandedCatalogImages.beverageWissotzky,
            tags: [
              { label: "השבחות", tone: "outline" },
            ],
          },
          {
            key: "beverage-sodastream",
            name: "SodaStream",
            description: "אריזה קמעונאית לשני בקבוקים, המשלבת קרטון מודפס עם מעטפת שקופה להצגת המוצר.",
            image: expandedCatalogImages.beverageSodastream,
            tags: [
              { label: "חבק לבקבוקים", tone: "outline" },
            ],
          },
          {
            key: "beverage-finishing",
            name: "גימור צורני",
            description: "תקריב חומר המדגים חיתוך צורני, צבע מדויק ושילוב אלמנטים מודפסים על קרטון בהיר.",
            image: expandedCatalogImages.beverageFinishing,
            tags: [
              { label: "חיתוך צורני", tone: "outline" },
              { label: "גימור מדויק", tone: "purple" },
            ],
          },
        ],
      },
    ],
  },
  en: {
    eyebrow: "Catalog",
    title: ["When structure", "meets brand"],
    intro:
      "Our branded folding-carton catalog offers advanced, custom-fit solutions for a wide range of industries, including cosmetics, food, wine, beverages, textiles, coffee, pharma and toiletries.\n\nFor cosmetics and toiletries, we provide precise, striking packaging with a broad range of finishing options that help products stand out on the shelf. For food and coffee companies, we tailor packaging that combines maximum product protection with inviting, user-friendly design.\n\nFor pharma, we develop packaging that meets strict standards while keeping the consumer experience clear and convenient. For wine and beverage brands, we offer a wide range of branded packaging, from single-bottle cartons to premium multi-purpose gift packs. For textile manufacturers, we develop tailored packaging solutions.\n\nFrom structural planning, material selection and precise die-cutting to complex combinations of advanced print and finishing technologies, we offer clients a complete service for developing the ideal package for every product type.\n\nExplore the variety of our carton packaging solutions and choose the package that will help your product succeed in every industry.",
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
            name: "Premium pack",
            description:
              "A luxury cosmetics product kit. Made from metallised board, printed in metallic gold Pantone with lamination.",
            image: catalogImages.serum,
            tags: [
              { label: "Lamination", tone: "outline" },
              { label: "Metallised paper", tone: "cyan" },
            ],
            overlayLabel: "Die view",
            overlaySpecs: ["Tolerance: ±0.1 mm", "Material: rigid board"],
          },
          {
            key: "ampoule",
            name: "Three-jar pack",
            description:
              "The design makes the products clearly identifiable at a glance, without opening the pack.",
            image: catalogImages.ampoule,
            tags: [
              { label: "Product kit", tone: "outline" },
            ],
            overlayLabel: "Fold line",
          },
          {
            key: "cream",
            name: "Cosmetics jar pack",
            description:
              "A carton pack built for a cream jar, with a structure that gives the product a premium presence. Print finishes such as gold or silver foil and embossing can be combined.",
            image: catalogImages.cream,
            tags: [
              { label: "Finishes", tone: "outline" },
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
        count: "6 items",
        layout: "grid",
        items: [
          {
            key: "wine-mony",
            name: "Mony Winery",
            description:
              "A premium single-bottle wine pack with lid and base, including finishes fitted to the product.",
            image: expandedCatalogImages.wineMony,
            tags: [
              { label: "Single bottle", tone: "outline" },
              { label: "Gold foil", tone: "magenta" },
            ],
          },
          {
            key: "wine-barkan",
            name: "Barkan Winery",
            description:
              "A premium single-bottle black wine pack from the Altitude series, with lid and base, including finishes fitted to the product.",
            image: expandedCatalogImages.wineBarkan,
            tags: [
              { label: "Single bottle", tone: "outline" },
              { label: "Premium pack", tone: "purple" },
            ],
          },
          {
            key: "wine-golan",
            name: "Golan Heights Winery",
            description:
              "A gift pack for a wine bottle and two glasses, with shaped windows and a structure that presents and secures each item. Printed on brown kraft.",
            image: expandedCatalogImages.wineGolan,
            tags: [
              { label: "Bottle + two glasses", tone: "outline" },
              { label: "Kraft", tone: "cyan" },
            ],
          },
          {
            key: "wine-carmel",
            name: "Carmel Winery",
            description:
              "A special generic pack adapted to different products, with a carry handle of our own unique patent.",
            image: expandedCatalogImages.wineCarmel,
            tags: [
              { label: "Patented carry handle", tone: "outline" },
              { label: "Generic pack", tone: "magenta" },
            ],
          },
          {
            key: "wine-tabor",
            name: "Tabor Winery",
            description:
              "A festive gift pack fitted to several different products. Winner of the “Star of Israel” design award. Printed on brown kraft.",
            image: expandedCatalogImages.wineTabor,
            tags: [
              { label: "Generic pack", tone: "outline" },
              { label: "Kraft", tone: "cyan" },
            ],
          },
          {
            key: "wine-recanati",
            name: "Recanati Winery",
            description:
              "A special pack for two bottles and two glasses, with an open display window revealing the products through a special die-cut.",
            image: expandedCatalogImages.wineRecanati,
            tags: [
              { label: "Two bottles + glasses", tone: "outline" },
              { label: "Brown kraft", tone: "purple" },
            ],
          },
        ],
      },
      {
        key: "coffee",
        number: "03",
        name: "Coffee",
        count: "4 items",
        layout: "grid",
        items: [
          {
            key: "coffee-elite",
            name: "Elite Strauss coffee",
            description:
              "A branded carton pack for coffee capsules, with finishes and a special consumer-friendly opening, and strong shelf presence.",
            image: coffeeImages.elite,
            tags: [
              { label: "Coffee", tone: "outline" },
              { label: "Capsules", tone: "cyan" },
            ],
          },
          {
            key: "coffee-aroma",
            name: "Aroma coffee",
            description:
              "A capsule pack set including a display that stands out at the point of sale.",
            image: coffeeImages.aroma,
            tags: [
              { label: "Coffee", tone: "outline" },
              { label: "Display", tone: "magenta" },
            ],
          },
          {
            key: "coffee-joe",
            name: "Coffee Joe",
            description:
              "A series of coffee-capsule packs with spot-varnish and embossing finishes and client-tailored graphic differentiation, across different coffee flavours.",
            image: coffeeImages.joe,
            tags: [
              { label: "Coffee", tone: "outline" },
              { label: "Finishes", tone: "purple" },
            ],
          },
          {
            key: "coffee-tasters-choice",
            name: "Nestlé / Osem",
            description:
              "A Taster’s Choice pack with a gift mug.",
            image: expandedCatalogImages.coffeeTastersChoice,
            tags: [
              { label: "Coffee pack", tone: "outline" },
              { label: "Gift pack", tone: "cyan" },
            ],
          },
        ],
      },
      {
        key: "beer",
        number: "04",
        name: "Beer",
        count: "4 items",
        layout: "grid",
        items: [
          {
            key: "beer-malka",
            name: "Malka beer",
            description:
              "A pack for four beer bottles and a glass, with windows that display the products.",
            image: beerImages.malka,
            tags: [
              { label: "Beer packs", tone: "outline" },
            ],
          },
          {
            key: "beer-goldstar",
            name: "Tempo",
            description:
              "A six-pack wrap for Goldstar beer.",
            image: beerImages.goldstar,
            tags: [
              { label: "Beer packs", tone: "outline" },
            ],
          },
          {
            key: "beer-carlsberg",
            name: "Central Bottling Company / Carlsberg",
            description:
              "A Carlsberg six-pack wrap including finishes. The wrap holds six beer bottles.",
            image: beerImages.carlsberg,
            tags: [
              { label: "Beer wraps", tone: "outline" },
            ],
          },
          {
            key: "beer-tuborg",
            name: "Central Bottling Company / Carlsberg",
            description:
              "A Tuborg six-pack wrap including finishes. The wrap holds six beer bottles.",
            image: beerImages.tuborg,
            tags: [
              { label: "Beer wraps", tone: "outline" },
            ],
          },
        ],
      },
      {
        key: "beverages",
        number: "05",
        name: "Tea & beverages",
        count: "3 items",
        layout: "grid",
        items: [
          {
            key: "beverage-wissotzky",
            name: "Wissotzky tea",
            description:
              "A special export tea pack with distinctive finishes that make the packaging stand out.",
            image: expandedCatalogImages.beverageWissotzky,
            tags: [
              { label: "Finishes", tone: "outline" },
            ],
          },
          {
            key: "beverage-sodastream",
            name: "SodaStream two-pack",
            description: "A retail pack for two bottles, combining printed carton with a clear sleeve that keeps the product visible.",
            image: expandedCatalogImages.beverageSodastream,
            tags: [
              { label: "Bottle wrap", tone: "outline" },
            ],
          },
          {
            key: "beverage-finishing",
            name: "Shaped finishing",
            description: "A material close-up demonstrating shaped cutting, precise color and layered print details on pale carton.",
            image: expandedCatalogImages.beverageFinishing,
            tags: [
              { label: "Shaped cut", tone: "outline" },
              { label: "Precision finish", tone: "purple" },
            ],
          },
        ],
      },
    ],
  },
};
