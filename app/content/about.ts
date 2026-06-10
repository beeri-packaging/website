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
  /** Tile fill: plain (bone + blueprint border), magenta, or yellow. */
  tone?: "plain" | "magenta" | "yellow";
};

export type AboutClient = {
  /** Company name — rendered as a wordmark, and used as the logo's alt text. */
  name: string;
  /** Optional logo file under /public (e.g. "/images/clients/company.svg"). Falls back to a text wordmark. */
  logo?: string;
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
  // Partners / clients
  partnersEyebrow: string;
  partnersTitle: string;
  clients: readonly AboutClient[];
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
      { value: "כ־140", label: "עובדים", sub: "100 ייצור · 40 מטה" },
      {
        value: "7,900",
        label: 'מ"ר ייצור ומשרדים',
        sub: 'ועוד 3,000 מ"ר מרלו"ג',
        tone: "magenta",
      },
      { value: "1964", label: "שנת הקמה", tone: "yellow" },
      { value: "3+2", label: "משמרות ביממה", sub: "דפוס · גימורים" },
    ],

    partnersEyebrow: "מבין לקוחותינו",
    partnersTitle: "שותפות מנצחת",
    // Names sourced from the company deck (slides 7–9). Rendered as wordmarks until logo
    // files are dropped into /public/images/clients/ and referenced via the `logo` field.
    clients: [
      { name: "Strauss" },
      { name: "Osem" },
      { name: "Tnuva" },
      { name: "Elite" },
      { name: "SodaStream" },
      { name: "Moroccanoil" },
      { name: "AHAVA" },
      { name: "Dr. Fischer" },
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
      { value: "~140", label: "employees", sub: "100 production · 40 staff" },
      {
        value: "7,900",
        label: "m² production & offices",
        sub: "+3,000 m² logistics center",
        tone: "magenta",
      },
      { value: "1964", label: "established", tone: "yellow" },
      { value: "3+2", label: "shifts a day", sub: "print · finishing" },
    ],

    partnersEyebrow: "Among our clients",
    partnersTitle: "Winning partnerships",
    // Names sourced from the company deck (slides 7–9). Rendered as wordmarks until logo
    // files are dropped into /public/images/clients/ and referenced via the `logo` field.
    clients: [
      { name: "Strauss" },
      { name: "Osem" },
      { name: "Tnuva" },
      { name: "Elite" },
      { name: "SodaStream" },
      { name: "Moroccanoil" },
      { name: "AHAVA" },
      { name: "Dr. Fischer" },
    ],

    ctaTitle: "Let's plan your next package together.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View catalog",
  },
};
