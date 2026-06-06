import type { Lang } from "@/app/content/home";

// ---- Item types -------------------------------------------------------------

export type AboutHeritageItem = {
  year: string;
  name: string;
  body: string;
};

export type AboutMilestone = {
  year: string;
  title: string;
  body: string;
};

export type AboutStat = {
  value: string;
  label: string;
  sub?: string;
};

export type AboutCapability = {
  step: string;
  title: string;
  body: string;
  image?: string;
};

export type AboutStandard = {
  code: string;
  title: string;
  body: string;
};

export type AboutProduct = {
  src: string;
  caption: string;
  sector: string;
};

export type AboutCopy = {
  // Hero
  eyebrow: string;
  title: readonly [string, string];
  intro: string;
  // Heritage / parent group
  heritageEyebrow: string;
  heritageTitle: string;
  heritageBody: string;
  heritageItems: readonly AboutHeritageItem[];
  heritageImageCaption: string;
  groupLinkLabel: string;
  groupLinkHref: string;
  // Milestones
  timelineEyebrow: string;
  timelineTitle: string;
  milestones: readonly AboutMilestone[];
  // Stats / plant
  statsEyebrow: string;
  statsTitle: string;
  stats: readonly AboutStat[];
  // Capabilities
  capsEyebrow: string;
  capsTitle: string;
  capsBody: string;
  capabilities: readonly AboutCapability[];
  capsFinishingCta: string;
  capsCatalogCta: string;
  // Quality
  qualityEyebrow: string;
  qualityTitle: string;
  standards: readonly AboutStandard[];
  // Clients / product gallery
  clientsEyebrow: string;
  clientsTitle: string;
  clientsBody: string;
  gallery: readonly AboutProduct[];
  // CTA
  ctaTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

// ---- Shared image paths (assets sourced from the company deck) ---------------

export const aboutImages = {
  heritage: {
    founders: "/images/about/heritage/founders.jpg",
    press: "/images/about/heritage/press-vintage.jpg",
    shop: "/images/about/heritage/print-shop.jpg",
  },
  production: {
    floor: "/images/about/production/factory-floor.jpg",
    offset: "/images/about/production/offset-press.png",
    digital: "/images/about/production/digital-press.png",
    dieCut: "/images/about/production/die-cutting.png",
    finishing: "/images/about/production/finishing-line.jpg",
  },
  products: {
    osem: "/images/about/products/osem.png",
    tabor: "/images/about/products/tabor-wine.jpg",
    moroccanoil: "/images/about/products/moroccanoil.png",
    ahava: "/images/about/products/ahava.png",
    wineSet: "/images/about/products/wine-gift-set.jpg",
    chocolate: "/images/about/products/chocolate.png",
    premium: "/images/about/products/premium-spirits.png",
    cosmetics: "/images/about/products/cosmetics.png",
    food: "/images/about/products/food.png",
  },
} as const;

// ---- Bilingual copy ---------------------------------------------------------

export const aboutCopy: Record<Lang, AboutCopy> = {
  he: {
    eyebrow: "אודות",
    title: ["מורשת של דפוס,", "אריזה של היום"],
    intro:
      "בארי אריזות מתכננת ומייצרת אריזות קרטון מודפסות בהתאמה אישית — מהרעיון ועד המדף, תחת קורת גג אחת ביבנה. אנחנו חברה בקבוצת דפוס בארי, ומאחורינו מורשת דפוס של למעלה ממאה שנה.",

    heritageEyebrow: "קבוצת דפוס בארי",
    heritageTitle: "חברה בקבוצת דפוס בארי",
    heritageBody:
      "בארי אריזות היא חלק מקבוצת דפוס בארי — מבתי הדפוס המובילים בישראל, הפועל מקיבוץ בארי שבנגב משנת 1950. השורשים שלנו מגיעים רחוק יותר: דרך גרפיקה בצלאל, שהפכה לבית דפוס מסחרי ב־1946, ודפוס חרט, שראשיתו עוד ב־1910. החיבור הזה מעמיד מאחורי כל הזמנה ידע עמוק בדפוס ותשתית ייצור רחבה.",
    heritageItems: [
      {
        year: "1910",
        name: "דפוס חרט",
        body: "ראשיתו בוורשה, והמשכו בתל אביב משנת 1936.",
      },
      {
        year: "1946",
        name: "גרפיקה בצלאל",
        body: "מהמכון הגרפי של בצלאל לבית דפוס מסחרי.",
      },
      {
        year: "1950",
        name: "דפוס בארי",
        body: "בית הדפוס הראשון בנגב, בבעלות קיבוץ בארי.",
      },
    ],
    heritageImageCaption: "ממורשת הדפוס של הקבוצה",
    groupLinkLabel: "לאתר הקבוצה",
    groupLinkHref: "https://beeriprint.co.il",

    timelineEyebrow: "אבני דרך",
    timelineTitle: "התאגדות וצמיחה",
    milestones: [
      {
        year: "1964",
        title: "הקמת החברה",
        body: 'הישות המשפטית של החברה נרשמת — ח"פ 520026113.',
      },
      {
        year: "2019",
        title: "רכישת גרפיקה בצלאל",
        body: "קיבוץ בארי רוכש את גרפיקה בצלאל — הצעד הראשון באיחוד.",
      },
      {
        year: "2020",
        title: "צירוף דפוס חרט",
        body: "גרפיקה בצלאל רוכשת את דפוס חרט.",
      },
      {
        year: "2021",
        title: "השם בארי אריזות",
        body: 'החברה משנה את שמה לבארי אריזות בע"מ.',
      },
      {
        year: "2026",
        title: "בעלות מלאה של דפוס בארי",
        body: "השלמת המהלך — בארי אריזות בבעלות מלאה של הקבוצה.",
      },
    ],

    statsEyebrow: "במספרים",
    statsTitle: "המפעל שלנו ביבנה",
    stats: [
      { value: "7,900", label: 'מ"ר ייצור ומשרדים', sub: 'ועוד 3,000 מ"ר מרלו"ג' },
      { value: "כ־140", label: "עובדים", sub: "100 ייצור · 40 מטה" },
      { value: "3+2", label: "משמרות ביממה", sub: "דפוס · גימורים" },
      { value: "1964", label: "שנת הקמה" },
    ],

    capsEyebrow: "יכולות",
    capsTitle: "מקצה לקצה, תחת קורת גג אחת",
    capsBody:
      "מתכנון מבני ועד הפצה — כל שלב בייצור האריזה נמצא אצלנו בבית. כך לוחות הזמנים מתקצרים והאיכות נשמרת אחידה לכל אורך הדרך.",
    capabilities: [
      {
        step: "01",
        title: "דפוס אופסט ודיגיטלי",
        body: "מכונות היידלברג וקמורי לצד דפוס דיגיטלי HP Indigo — לסדרות קצרות ובינוניות כאחד.",
        image: aboutImages.production.offset,
      },
      {
        step: "02",
        title: "השבחות",
        body: "פויל, הבלטה, לכה ולמינציה בטכנולוגיות MGI ו־UV.",
        image: aboutImages.production.finishing,
      },
      {
        step: "03",
        title: "שטנץ והדבקה",
        body: "חמש מכונות פירוק וארבע מכונות הדבקה להרכבת האריזה.",
        image: aboutImages.production.dieCut,
      },
      {
        step: "04",
        title: "מרכז לוגיסטי",
        body: 'מרלו"ג בשטח 3,000 מ"ר לאחסון והפצה מסודרת עד הלקוח.',
        image: aboutImages.production.floor,
      },
    ],
    capsFinishingCta: "לעמוד ההשבחות",
    capsCatalogCta: "לקטלוג המוצרים",

    qualityEyebrow: "תקנים",
    qualityTitle: "איכות ובטיחות מזון",
    standards: [
      {
        code: "ISO 9001",
        title: "ניהול איכות",
        body: "תקן בינלאומי שמבטיח תהליך ייצור עקבי, שעומד בדרישות הלקוח לאורך זמן.",
      },
      {
        code: "ISO 22000",
        title: "בטיחות מזון · FSSC 22000",
        body: "ניהול בטיחות מזון לכל שרשרת האספקה — קריטי לאריזות מזון, קוסמטיקה ופארמה.",
      },
    ],

    clientsEyebrow: "לקוחות",
    clientsTitle: "מותגים שבוחרים בנו",
    clientsBody:
      "ממדפי רשתות המזון ועד מותגי הקוסמטיקה המובילים — מבחר מהאריזות שייצרנו עבור הלקוחות שלנו.",
    gallery: [
      { src: aboutImages.products.osem, caption: "אוסם", sector: "מזון" },
      { src: aboutImages.products.tabor, caption: "יקב תבור", sector: "יין" },
      { src: aboutImages.products.moroccanoil, caption: "Moroccanoil", sector: "קוסמטיקה" },
      { src: aboutImages.products.ahava, caption: "AHAVA", sector: "קוסמטיקה" },
      { src: aboutImages.products.wineSet, caption: "מארז יין", sector: "יין ומשקאות" },
      { src: aboutImages.products.chocolate, caption: "פרלינים", sector: "ממתקים" },
      { src: aboutImages.products.premium, caption: "מארז פרימיום", sector: "פרימיום" },
      { src: aboutImages.products.cosmetics, caption: "מארז קוסמטיקה", sector: "קוסמטיקה" },
      { src: aboutImages.products.food, caption: "מוצר מזון", sector: "מזון" },
    ],

    ctaTitle: "בואו נתכנן יחד את האריזה הבאה שלכם.",
    ctaPrimary: "ליצירת קשר",
    ctaSecondary: "צפייה בקטלוג",
  },

  en: {
    eyebrow: "About",
    title: ["A printing heritage,", "packaging for today"],
    intro:
      "Beeri Packaging designs and manufactures custom printed folding-carton packaging — from idea to shelf, under one roof in Yavne. We're part of the Beeri Print Group, with over a century of printing heritage behind us.",

    heritageEyebrow: "Beeri Print Group",
    heritageTitle: "A Beeri Print Group company",
    heritageBody:
      "Beeri Packaging is part of the Beeri Print Group — one of Israel's leading printing houses, operating from Kibbutz Be'eri in the Negev since 1950. Our roots run deeper still: through Graphica Bezalel, a commercial press since 1946, and Heret Printing, founded back in 1910. That lineage puts deep print know-how and broad manufacturing capacity behind every order.",
    heritageItems: [
      {
        year: "1910",
        name: "Heret Printing",
        body: "Founded in Warsaw; printing in Tel Aviv from 1936.",
      },
      {
        year: "1946",
        name: "Graphica Bezalel",
        body: "From Bezalel's graphic studio to a commercial press.",
      },
      {
        year: "1950",
        name: "Be'eri Printers",
        body: "The Negev's first printing house, owned by Kibbutz Be'eri.",
      },
    ],
    heritageImageCaption: "From the group's printing heritage",
    groupLinkLabel: "Visit the group site",
    groupLinkHref: "https://en.beeriprint.co.il",

    timelineEyebrow: "Milestones",
    timelineTitle: "Coming together, growing",
    milestones: [
      {
        year: "1964",
        title: "The company is founded",
        body: "The company's legal entity is registered — reg. no. 520026113.",
      },
      {
        year: "2019",
        title: "Graphica Bezalel acquired",
        body: "Kibbutz Be'eri acquires Graphica Bezalel — the first step in uniting the group.",
      },
      {
        year: "2020",
        title: "Heret Printing joins",
        body: "Graphica Bezalel acquires Heret Printing.",
      },
      {
        year: "2021",
        title: "The Beeri Packaging name",
        body: "The company is renamed Beeri Packaging Ltd.",
      },
      {
        year: "2026",
        title: "Full Beeri Print ownership",
        body: "The journey completes — Beeri Packaging is wholly owned by the group.",
      },
    ],

    statsEyebrow: "By the numbers",
    statsTitle: "Our Yavne plant",
    stats: [
      { value: "7,900", label: "m² production & offices", sub: "+3,000 m² logistics center" },
      { value: "~140", label: "employees", sub: "100 production · 40 staff" },
      { value: "3+2", label: "shifts a day", sub: "print · finishing" },
      { value: "1964", label: "established" },
    ],

    capsEyebrow: "Capabilities",
    capsTitle: "End to end, under one roof",
    capsBody:
      "From structural design to distribution, every step of making a carton lives in-house. That shortens lead times and keeps quality consistent the whole way through.",
    capabilities: [
      {
        step: "01",
        title: "Offset & digital print",
        body: "Heidelberg and Komori presses alongside HP Indigo digital — for short and medium runs alike.",
        image: aboutImages.production.offset,
      },
      {
        step: "02",
        title: "Finishing",
        body: "Foil, embossing, varnish and lamination with MGI and UV technology.",
        image: aboutImages.production.finishing,
      },
      {
        step: "03",
        title: "Die-cutting & gluing",
        body: "Five die-cutters and four gluing lines assemble the carton.",
        image: aboutImages.production.dieCut,
      },
      {
        step: "04",
        title: "Logistics center",
        body: "A 3,000 m² warehouse for orderly storage and delivery to the customer.",
        image: aboutImages.production.floor,
      },
    ],
    capsFinishingCta: "Explore finishing",
    capsCatalogCta: "Browse the catalog",

    qualityEyebrow: "Standards",
    qualityTitle: "Quality & food safety",
    standards: [
      {
        code: "ISO 9001",
        title: "Quality management",
        body: "The international standard for a consistent process that meets customer requirements over time.",
      },
      {
        code: "ISO 22000",
        title: "Food safety · FSSC 22000",
        body: "Food-safety management across the supply chain — critical for food, cosmetics and pharma packaging.",
      },
    ],

    clientsEyebrow: "Clients",
    clientsTitle: "Brands that choose us",
    clientsBody:
      "From supermarket shelves to leading cosmetics brands — a selection of the packaging we've produced for our clients.",
    gallery: [
      { src: aboutImages.products.osem, caption: "Osem", sector: "Food" },
      { src: aboutImages.products.tabor, caption: "Tabor Winery", sector: "Wine" },
      { src: aboutImages.products.moroccanoil, caption: "Moroccanoil", sector: "Cosmetics" },
      { src: aboutImages.products.ahava, caption: "AHAVA", sector: "Cosmetics" },
      { src: aboutImages.products.wineSet, caption: "Wine gift set", sector: "Wine & spirits" },
      { src: aboutImages.products.chocolate, caption: "Pralines", sector: "Confectionery" },
      { src: aboutImages.products.premium, caption: "Premium boxset", sector: "Premium" },
      { src: aboutImages.products.cosmetics, caption: "Cosmetics range", sector: "Cosmetics" },
      { src: aboutImages.products.food, caption: "Food product", sector: "Food" },
    ],

    ctaTitle: "Let's plan your next package together.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View catalog",
  },
};
