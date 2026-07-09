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
    heritageToModern:
      "https://cdn.sanity.io/images/4qkb39ql/production/05b7ed9c36047e2f43a141d0ba4dda44711a386f-1672x941.webp",
    heritageToModernSquare: "/images/about/production/heritage-to-modern-square-generated.png",
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

    heritageEyebrow: "מחזון לעשייה",
    heritageTitle: "שורשים משלושה דורות, עתיד אחד",
    heritageBody:
      "בארי אריזות היא חברה משפחתית הנושאת עמה מורשת עשירה של שלושה בתי דפוס ותיקים שהתאחדו לכדי גוף אחד. שורשיה נטועים בדפוס בארי, שהוקם בשנת 1950 בבעלות מלאה של קיבוץ בארי, בדפוס גרפיקה בצלאל, שראשיתו כמכון הגרפי של בית האומנויות בצלאל והפך לבית דפוס מסחרי בשנת 1946 בידי משפחת חרפק, ובדפוס חרט, שראשיתו בוורשה בשנת 1910 והמשכו בישראל משנת 1936, עת עלה שמעון נוימן ארצה והקים בית דפוס ברחוב נחלת בנימין בתל אביב.\n\nשלוש המסורות הללו, כל אחת עם ניסיונה וידיעתה, התלכדו לכדי בארי אריזות של היום, המשלבת עומק היסטורי של למעלה ממאתיים שנות פעילות עם פתרון כולל תחת קורת גג אחת, מפיתוח הרעיון ועד לאספקת המוצר המוגמר, לתעשיות הקוסמטיקה, הפארמה, המזון, המשקאות והטקסטיל.\n\nהשילוב בין המסורת רבת הדורות לבין הטכנולוגיה המתקדמת ביותר הוא שמייחד את בארי אריזות וממשיך להוביל אותה קדימה, דור אחר דור.",
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
        year: "2019",
        title: "רכישת גרפיקה בצלאל",
        body: "רכישת גרפיקה בצלאל על ידי קיבוץ בארי.",
      },
      {
        year: "2020",
        title: "גרפיקה בצלאל רוכשת את דפוס חרט",
        body: "גרפיקה בצלאל רוכשת את דפוס חרט.",
      },
      {
        year: "2021",
        title: "שינוי השם לבארי אריזות",
        body: 'החברה משנה את שמה לבארי אריזות בע"מ.',
      },
    ],

    statsEyebrow: "במספרים",
    statsTitle: "המפעל שלנו ביבנה",
    stats: [
      { value: "מעל 100", label: "עובדים" },
      {
        value: "10,000",
        label: 'מ"ר של אולמות ייצור ומרלו"ג',
        tone: "magenta",
      },
      { value: "מעל 200", label: "שנות ניסיון מצטבר", tone: "yellow" },
      { value: "24/6", label: "מפעל חיוני עובד" },
    ],

    partnersEyebrow: "מבין לקוחותינו",
    partnersTitle: "שותפות מנצחת",
    // Names sourced from the company deck (slides 7–9).
    clients: [
      { name: "שטראוס קפה בי. וי (קפה עלית)", logo: "/images/clients/elite.png" },
      { name: "קרלסברג", logo: "/images/clients/carlsberg.png" },
      { name: "CBC", logo: "/images/clients/cbc.svg" },
      { name: "תה ויסוצקי בע\"מ", logo: "/images/clients/wissotzky.svg" },
      { name: "נסטלה", logo: "/images/clients/nestle.svg" },
      {
        name: 'אגודת הכורמים הקואופרטיבית של יקבי ראשל"צ וזכרון',
        logo: "/images/clients/carmel-winery.svg",
      },
      { name: "יקב רקאנטי", logo: "/images/clients/recanati.png" },
      { name: "יקב רמת הגולן", logo: "/images/clients/golan-heights-winery.svg" },
      { name: "טמפו", logo: "/images/clients/tempo.png" },
      { name: "ליימן שליסל בע\"מ", logo: "/images/clients/leiman-schlussel.png" },
      { name: "אלטמן", logo: "/images/clients/altman.png" },
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

    heritageEyebrow: "From vision to action",
    heritageTitle: "Three generations of roots, one future",
    heritageBody:
      "Beeri Packaging is a family company carrying the heritage of three long-standing printing houses that came together as one. Its roots are planted in Beeri Print, founded in 1950 and fully owned by Kibbutz Be'eri; in Graphica Bezalel, which began as the graphic institute of the Bezalel School of Arts and became a commercial printing house in 1946 under the Harpak family; and in Heret Printing, whose story began in Warsaw in 1910 and continued in Israel from 1936, when Shimon Neumann immigrated and founded a printing house on Nahalat Binyamin Street in Tel Aviv.\n\nThese three traditions, each with its own experience and know-how, have joined into today's Beeri Packaging: a company that combines more than two hundred years of accumulated activity with an end-to-end solution under one roof, from concept development to finished product delivery, for the cosmetics, pharma, food, beverage and textile industries.\n\nThe combination of generations of tradition with advanced technology is what sets Beeri Packaging apart and continues to move it forward.",
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
        year: "2019",
        title: "Graphica Bezalel acquired",
        body: "Kibbutz Be'eri acquires Graphica Bezalel.",
      },
      {
        year: "2020",
        title: "Graphica Bezalel acquires Heret Printing",
        body: "Graphica Bezalel acquires Heret Printing.",
      },
      {
        year: "2021",
        title: "Renamed Beeri Packaging",
        body: "The company is renamed Beeri Packaging Ltd.",
      },
    ],

    statsEyebrow: "By the numbers",
    statsTitle: "Our Yavne plant",
    stats: [
      { value: "100+", label: "employees" },
      {
        value: "10,000",
        label: "m² production halls & logistics center",
        tone: "magenta",
      },
      { value: "200+", label: "years of accumulated experience", tone: "yellow" },
      { value: "24/6", label: "essential plant in operation" },
    ],

    partnersEyebrow: "Among our clients",
    partnersTitle: "Winning partnerships",
    // Names sourced from the company deck (slides 7–9).
    clients: [
      { name: "Strauss Coffee B.V. (Elite Coffee)", logo: "/images/clients/elite.png" },
      { name: "Carlsberg", logo: "/images/clients/carlsberg.png" },
      { name: "CBC", logo: "/images/clients/cbc.svg" },
      { name: "Wissotzky Tea", logo: "/images/clients/wissotzky.svg" },
      { name: "Nestle", logo: "/images/clients/nestle.svg" },
      { name: "Winegrowers Cooperative / Carmel Wineries", logo: "/images/clients/carmel-winery.svg" },
      { name: "Recanati Winery", logo: "/images/clients/recanati.png" },
      { name: "Golan Heights Winery", logo: "/images/clients/golan-heights-winery.svg" },
      { name: "Tempo", logo: "/images/clients/tempo.png" },
      { name: "Leiman Schlussel", logo: "/images/clients/leiman-schlussel.png" },
      { name: "Altman", logo: "/images/clients/altman.png" },
    ],

    ctaTitle: "Let's plan your next package together.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View catalog",
  },
};
