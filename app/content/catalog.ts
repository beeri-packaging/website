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
        count: "6 פריטים",
        layout: "grid",
        items: [
          {
            key: "wine-mony",
            name: "מוני",
            description: "מארז פרימיום שחור וזהב לבקבוק יחיד, עם נוכחות מתנה אלגנטית והתאמה מדויקת למוצר.",
            image: expandedCatalogImages.wineMony,
            tags: [
              { label: "בקבוק יחיד", tone: "outline" },
              { label: "פויל זהב", tone: "magenta" },
            ],
          },
          {
            key: "wine-barkan",
            name: "Barkan Altitude",
            description: "מארז יין שחור מסדרת Altitude, המשלב הגנה לבקבוק עם גימור זהב ונראות יוקרתית.",
            image: expandedCatalogImages.wineBarkan,
            tags: [
              { label: "בקבוק יחיד", tone: "outline" },
              { label: "מארז פרימיום", tone: "purple" },
            ],
          },
          {
            key: "wine-golan",
            name: "רמת הגולן",
            description: "מארז שי לבקבוק יין ושתי כוסות, עם חלונות צורניים ומבנה שמציג ומקבע כל פריט.",
            image: expandedCatalogImages.wineGolan,
            tags: [
              { label: "בקבוק ושתי כוסות", tone: "outline" },
              { label: "חלונות שטנץ", tone: "cyan" },
            ],
          },
          {
            key: "wine-carmel",
            name: "Carmel BUZZ",
            description: "מארז נשיאה לשני בקבוקים ושתי כוסות, בגימור קורל וזהב ובחלון תצוגה רחב.",
            image: expandedCatalogImages.wineCarmel,
            tags: [
              { label: "שני בקבוקים", tone: "outline" },
              { label: "ידית נשיאה", tone: "magenta" },
            ],
          },
          {
            key: "wine-tabor",
            name: "תבור",
            description: "מארז קראפט עם ידית לשלושה מוצרים, חלונות אישיים ושפה חומרית טבעית בגוני זית.",
            image: expandedCatalogImages.wineTabor,
            tags: [
              { label: "יין ושמן זית", tone: "outline" },
              { label: "קרטון קראפט", tone: "cyan" },
            ],
          },
          {
            key: "wine-recanati",
            name: "רקנאטי",
            description: "מארז מתנה לשני בקבוקים ושתי כוסות, עם חלון רחב, ידית וגימור קראפט־זהב.",
            image: expandedCatalogImages.wineRecanati,
            tags: [
              { label: "שני בקבוקים ושתי כוסות", tone: "outline" },
              { label: "חלון תצוגה", tone: "purple" },
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
            name: "קפסולות עלית",
            description:
              "אריזת קרטון ממותגת לקפסולות קפה, המשלבת הגנה על המוצר, נוכחות מדף ברורה ומבנה נוח לשימוש.",
            image: coffeeImages.elite,
            tags: [
              { label: "קפסולות", tone: "outline" },
              { label: "קרטון מודפס", tone: "cyan" },
            ],
          },
          {
            key: "coffee-aroma",
            name: "דיספליי ארומה",
            description:
              "מארז תצוגה קמעונאי שמחזיק סדרת קופסאות קפסולות ומציג אותה כיחידה אחת מסודרת ובולטת בנקודת המכירה.",
            image: coffeeImages.aroma,
            tags: [
              { label: "דיספליי", tone: "outline" },
              { label: "מארז קד״מ", tone: "magenta" },
            ],
          },
          {
            key: "coffee-joe",
            name: "קפה ג׳ו",
            description:
              "סדרת אריזות לקפסולות במבנה אחיד ובמגוון גרסאות, המאפשרת בידול ברור בין תערובות וטעמים תוך שמירה על שפה מותגית עקבית.",
            image: coffeeImages.joe,
            tags: [
              { label: "סדרת מוצרים", tone: "outline" },
              { label: "מגוון גרסאות", tone: "purple" },
            ],
          },
          {
            key: "coffee-tasters-choice",
            name: "Taster’s Choice",
            description: "מארז קפה מוכן למתנה המשלב צנצנת קפה וכוס נסיעות בחלון תצוגה כחול ובולט.",
            image: expandedCatalogImages.coffeeTastersChoice,
            tags: [
              { label: "מארז מתנה", tone: "outline" },
              { label: "חלון תצוגה", tone: "cyan" },
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
              "מארז קרטון לארבעה בקבוקים וכוס, עם חלונות צורניים שמציגים את המוצרים ושומרים אותם כיחידת מתנה אחת.",
            image: beerImages.malka,
            tags: [
              { label: "מארז מתנה", tone: "outline" },
              { label: "חלונות שטנץ", tone: "cyan" },
            ],
          },
          {
            key: "beer-goldstar",
            name: "שישיית גולדסטאר",
            description:
              "מארז נשיאה ממותג לשישה בקבוקים, עם ידית מובנית ומבנה שמחזיק את הבקבוקים יחד מהמדף ועד הבית.",
            image: beerImages.goldstar,
            tags: [
              { label: "שישיית בקבוקים", tone: "outline" },
              { label: "ידית נשיאה", tone: "magenta" },
            ],
          },
          {
            key: "beer-carlsberg",
            name: "שישיית קרלסברג",
            description:
              "מארז קרטון מודפס לשישה בקבוקים, המתאים להפצה קמעונאית ומעניק למותג נראות ברורה מכל צד.",
            image: beerImages.carlsberg,
            tags: [
              { label: "קרטון מודפס", tone: "outline" },
              { label: "אריזה קמעונאית", tone: "purple" },
            ],
          },
          {
            key: "beer-tuborg",
            name: "שישיית טובורג",
            description:
              "מארז נשיאה צבעוני לשישה בקבוקים, המשלב מבנה חסכוני בקרטון עם שטח מיתוג רחב ונוכחות מדף גבוהה.",
            image: beerImages.tuborg,
            tags: [
              { label: "מארז נשיאה", tone: "outline" },
              { label: "נוכחות מדף", tone: "cyan" },
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
            name: "השבחות ויסוצקי",
            description: "צילום תקריב המדגים הבלטה, פויל ועושר דפוס על גבי מארז תה ממותג.",
            image: expandedCatalogImages.beverageWissotzky,
            tags: [
              { label: "הבלטה", tone: "outline" },
              { label: "פויל", tone: "magenta" },
            ],
          },
          {
            key: "beverage-sodastream",
            name: "SodaStream",
            description: "אריזה קמעונאית לשני בקבוקים, המשלבת קרטון מודפס עם מעטפת שקופה להצגת המוצר.",
            image: expandedCatalogImages.beverageSodastream,
            tags: [
              { label: "שני בקבוקים", tone: "outline" },
              { label: "חלון שקוף", tone: "cyan" },
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
        count: "6 items",
        layout: "grid",
        items: [
          {
            key: "wine-mony",
            name: "Mony",
            description: "A black-and-gold premium carton for one bottle, combining precise product fit with an elegant gift presentation.",
            image: expandedCatalogImages.wineMony,
            tags: [
              { label: "Single bottle", tone: "outline" },
              { label: "Gold foil", tone: "magenta" },
            ],
          },
          {
            key: "wine-barkan",
            name: "Barkan Altitude",
            description: "A black Altitude-series wine carton combining bottle protection, gold detailing and a premium shelf presence.",
            image: expandedCatalogImages.wineBarkan,
            tags: [
              { label: "Single bottle", tone: "outline" },
              { label: "Premium pack", tone: "purple" },
            ],
          },
          {
            key: "wine-golan",
            name: "Golan Heights",
            description: "A one-bottle and two-glass gift carton with shaped windows that present and secure each item.",
            image: expandedCatalogImages.wineGolan,
            tags: [
              { label: "Bottle + two glasses", tone: "outline" },
              { label: "Die-cut windows", tone: "cyan" },
            ],
          },
          {
            key: "wine-carmel",
            name: "Carmel BUZZ",
            description: "A handled gift carton for two bottles and two glasses, finished in coral and gold with a broad display window.",
            image: expandedCatalogImages.wineCarmel,
            tags: [
              { label: "Two bottles", tone: "outline" },
              { label: "Carry handle", tone: "magenta" },
            ],
          },
          {
            key: "wine-tabor",
            name: "Tabor Winery",
            description: "A handled kraft carrier for three products, with individual windows and a natural olive-toned material language.",
            image: expandedCatalogImages.wineTabor,
            tags: [
              { label: "Wine & olive oil", tone: "outline" },
              { label: "Kraft carton", tone: "cyan" },
            ],
          },
          {
            key: "wine-recanati",
            name: "Recanati Winery",
            description: "A two-bottle and two-glass gift pack with a broad display window, handle and kraft-and-gold finish.",
            image: expandedCatalogImages.wineRecanati,
            tags: [
              { label: "Two bottles + glasses", tone: "outline" },
              { label: "Display window", tone: "purple" },
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
            name: "Elite capsules",
            description:
              "A branded folding carton for coffee capsules, combining product protection, clear shelf presence and a practical structure for everyday use.",
            image: coffeeImages.elite,
            tags: [
              { label: "Capsules", tone: "outline" },
              { label: "Printed carton", tone: "cyan" },
            ],
          },
          {
            key: "coffee-aroma",
            name: "Aroma display",
            description:
              "A retail display pack that holds a capsule-carton range and presents it as one organized, high-visibility unit at the point of sale.",
            image: coffeeImages.aroma,
            tags: [
              { label: "Display", tone: "outline" },
              { label: "Promotional pack", tone: "magenta" },
            ],
          },
          {
            key: "coffee-joe",
            name: "Coffee Joe",
            description:
              "A consistent capsule-carton structure across multiple variants, making blends and flavors easy to distinguish while maintaining a unified brand language.",
            image: coffeeImages.joe,
            tags: [
              { label: "Product range", tone: "outline" },
              { label: "Multiple variants", tone: "purple" },
            ],
          },
          {
            key: "coffee-tasters-choice",
            name: "Taster’s Choice",
            description: "A ready-to-gift coffee pack combining a coffee jar and travel cup in a bright blue display-window carton.",
            image: expandedCatalogImages.coffeeTastersChoice,
            tags: [
              { label: "Gift pack", tone: "outline" },
              { label: "Display window", tone: "cyan" },
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
              "A carton gift carrier for four bottles and a glass, with shaped windows that present the products while holding them as one set.",
            image: beerImages.malka,
            tags: [
              { label: "Gift pack", tone: "outline" },
              { label: "Die-cut windows", tone: "cyan" },
            ],
          },
          {
            key: "beer-goldstar",
            name: "Goldstar six-pack",
            description:
              "A branded carrier for six bottles, with an integrated handle and a structure that keeps the bottles together from shelf to home.",
            image: beerImages.goldstar,
            tags: [
              { label: "Six bottles", tone: "outline" },
              { label: "Carry handle", tone: "magenta" },
            ],
          },
          {
            key: "beer-carlsberg",
            name: "Carlsberg six-pack",
            description:
              "A printed carton carrier for six bottles, built for retail distribution with clear brand visibility from every side.",
            image: beerImages.carlsberg,
            tags: [
              { label: "Printed carton", tone: "outline" },
              { label: "Retail pack", tone: "purple" },
            ],
          },
          {
            key: "beer-tuborg",
            name: "Tuborg six-pack",
            description:
              "A high-impact six-bottle carrier combining an efficient carton structure with a broad branded surface and strong shelf presence.",
            image: beerImages.tuborg,
            tags: [
              { label: "Bottle carrier", tone: "outline" },
              { label: "Shelf presence", tone: "cyan" },
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
            name: "Wissotzky finishing",
            description: "A close-up view of embossing, foil and rich print detail on a branded tea carton.",
            image: expandedCatalogImages.beverageWissotzky,
            tags: [
              { label: "Embossing", tone: "outline" },
              { label: "Foil", tone: "magenta" },
            ],
          },
          {
            key: "beverage-sodastream",
            name: "SodaStream two-pack",
            description: "A retail pack for two bottles, combining printed carton with a clear sleeve that keeps the product visible.",
            image: expandedCatalogImages.beverageSodastream,
            tags: [
              { label: "Two bottles", tone: "outline" },
              { label: "Clear window", tone: "cyan" },
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
