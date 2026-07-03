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
    title: ["כשמסורת של דפוס פוגשת", "את האריזה של ימינו"],
    intro:
      "בארי אריזות הוא בית הדפוס המוביל בישראל בתחום ייצור אריזות ותוויות, עם מוניטין וניסיון מצטבר של למעלה ממאה שנה. אנו מתמחים בתכנון, עיצוב וייצור אריזות פרימיום ממותגות עבור חברות, מפעלים ומותגים מובילים בארץ ובעולם.\n\nאנו מעניקים ללקוחותינו שירות מקיף המלווה אותם משלב הרעיון והייעוץ ועד לאספקת המוצר המוגמר, תוך הקפדה על איכות ללא פשרות ויחס אישי לכל לקוח.\n\nאנו נותנים שירות למגוון חברות מתחומים שונים ובהם קוסמטיקה, יקבים, פארמה, טקסטיל, מזון, משקאות, מוצרי פרסום ומוצרי קד\"מ. לצד קשת רחבה של מוצרים ופתרונות אריזה, החברה שמה דגש על שירות לקוחות יעיל ומקצועי, ונמצאת בחזית הטכנולוגיה תוך התחדשות מתמדת.",

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
        title: "רישום החברה",
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
      { value: "1964", label: "רישום החברה", tone: "yellow" },
      { value: "3+2", label: "משמרות ביממה", sub: "דפוס · גימורים" },
    ],

    partnersEyebrow: "מבין לקוחותינו",
    partnersTitle: "שותפות מנצחת",
    // Names sourced from the company deck (slides 7–9).
    clients: [
      { name: "Strauss", logo: "/images/clients/strauss.svg" },
      { name: "Osem", logo: "/images/clients/osem.svg" },
      { name: "Tnuva", logo: "/images/clients/tnuva.svg" },
      { name: "Elite", logo: "/images/clients/elite.png" },
      { name: "SodaStream", logo: "/images/clients/sodastream.svg" },
      { name: "Moroccanoil", logo: "/images/clients/moroccanoil.png" },
      { name: "AHAVA", logo: "/images/clients/ahava.svg" },
      { name: "Dr. Fischer", logo: "/images/clients/dr-fischer.png" },
    ],

    ctaTitle: "בואו נתכנן יחד את האריזה הבאה שלכם.",
    ctaPrimary: "ליצירת קשר",
    ctaSecondary: "צפייה בקטלוג",
  },

  en: {
    eyebrow: "About",
    title: ["Where printing tradition", "meets modern packaging"],
    intro:
      "Beeri Packaging is one of Israel's leading printing houses for packaging and labels, with a reputation and accumulated experience of more than a century. We specialize in planning, designing and producing premium branded packaging for companies, manufacturers and leading brands in Israel and worldwide.\n\nWe provide a full service that accompanies clients from the idea and consultation stage through delivery of the finished product, with uncompromising quality and personal attention to every client.\n\nWe serve companies across cosmetics, wineries, pharma, textiles, food, beverages, promotional products and point-of-sale products. Alongside a wide range of packaging products and solutions, the company emphasizes efficient, professional customer service and stays at the front of technology through constant renewal.",

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
        name: "Beeri Print",
        body: "The Negev's first printing house, owned by Kibbutz Be'eri.",
      },
    ],
    heritageImageCaption: "From the group's printing heritage",
    groupLinkLabel: "Visit the group site",
    // The group site exists only in Hebrew — en.beeriprint.co.il is a dead
    // parking domain with an expired certificate.
    groupLinkHref: "https://beeriprint.co.il",

    timelineEyebrow: "Milestones",
    timelineTitle: "Coming together, growing",
    milestones: [
      {
        year: "1964",
        title: "Company registration",
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
      { value: "1964", label: "company registration", tone: "yellow" },
      { value: "3+2", label: "shifts a day", sub: "print · finishing" },
    ],

    partnersEyebrow: "Among our clients",
    partnersTitle: "Winning partnerships",
    // Names sourced from the company deck (slides 7–9).
    clients: [
      { name: "Strauss", logo: "/images/clients/strauss.svg" },
      { name: "Osem", logo: "/images/clients/osem.svg" },
      { name: "Tnuva", logo: "/images/clients/tnuva.svg" },
      { name: "Elite", logo: "/images/clients/elite.png" },
      { name: "SodaStream", logo: "/images/clients/sodastream.svg" },
      { name: "Moroccanoil", logo: "/images/clients/moroccanoil.png" },
      { name: "AHAVA", logo: "/images/clients/ahava.svg" },
      { name: "Dr. Fischer", logo: "/images/clients/dr-fischer.png" },
    ],

    ctaTitle: "Let's plan your next package together.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View catalog",
  },
};
