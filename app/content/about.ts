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

export type AboutTeamMember = {
  name: string;
  role: string;
  /** Optional portrait URL. A designed silhouette is shown until supplied. */
  image?: string;
};

export type AboutStandard = {
  /** Standard identifier shown above the title, e.g. "ISO 9001:2015". */
  code: string;
  title: string;
  body: string;
  /** Link text for the certificate PDF. */
  certificateLabel: string;
  /** Certificate PDF on the Sanity CDN. Omit while a certificate is pending. */
  certificateUrl?: string;
  /** Scan of the certificate. A designed placeholder sheet stands in without it. */
  image?: string;
  /** "essential" tints the sheet yellow — used for the essential-plant notice. */
  tone?: "essential";
};

export type AboutCopy = {
  // Hero
  eyebrow: string;
  title: readonly [string, string];
  intro: string;
  /** Tracked label introducing the industry chips under the hero intro. */
  industriesLabel: string;
  /** Sectors served — rendered as chips instead of a run-on sentence. */
  industries: readonly string[];
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
  // Team
  teamEyebrow: string;
  teamTitle: string;
  teamMembers: readonly AboutTeamMember[];
  // Partners / clients
  partnersEyebrow: string;
  partnersTitle: string;
  clients: readonly AboutClient[];
  // Standards & certifications
  standardsEyebrow: string;
  standardsTitle: string;
  standardsBody: string;
  standards: readonly AboutStandard[];
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
      "/images/about/production/heritage-to-modern-packaging-v3.webp",
    pastToFutureGlossy:
      "/images/about/production/past-to-future-packaging-v3.webp",
    offset: "/images/about/production/offset-press.png",
    digital: "/images/about/production/digital-press.png",
    dieCut: "/images/about/production/die-cutting.png",
    finishing: "/images/about/production/finishing-line.jpg",
  },
} as const;

// Team portraits are web-sized derivatives of the approved source photography,
// hosted on the Sanity CDN in the same order as the management roster.
const teamImages = {
  amirYunik:
    "https://cdn.sanity.io/images/4qkb39ql/production/07cd7da0aaa86214c03f3dc6e29364732f10aa1f-1800x1800.jpg",
  andreyPlatonov:
    "https://cdn.sanity.io/images/4qkb39ql/production/76a3a48800ea697927b65594916ea8298312762d-1439x1800.jpg",
  michalGeva:
    "https://cdn.sanity.io/images/4qkb39ql/production/dce6fe007c7e182ea337c48934d29c160f791839-1200x1800.jpg",
  meniRapfeld:
    "https://cdn.sanity.io/images/4qkb39ql/production/53da314458eaf2023a5a67f6be22d094b8335545-1200x1800.jpg",
  doronHarpak:
    "https://cdn.sanity.io/images/4qkb39ql/production/2f86d922f967edea58a970efd716bf6613acb9eb-1200x1800.jpg",
  hamutalDahan:
    "https://cdn.sanity.io/images/4qkb39ql/production/dc3c5310f552ceb24b5812e425960e91f1c63b2e-1200x1800.jpg",
  lynnBenChetrit:
    "https://cdn.sanity.io/images/4qkb39ql/production/48a4a116ea05729a51f8a0a0dd9287be2360824f-1200x1800.jpg",
} as const;

// ---- Bilingual copy ---------------------------------------------------------

export const aboutCopy: Record<Lang, AboutCopy> = {
  he: {
    eyebrow: "אודות",
    title: ["כשמסורת של דפוס פוגשת", "את האריזה של ימינו"],
    intro:
      "בארי אריזות הוא בית הדפוס המוביל בישראל בתחום ייצור אריזות ותוויות, עם מוניטין וניסיון מצטבר של למעלה ממאה שנה. אנו מתמחים בתכנון, עיצוב וייצור אריזות פרימיום ממותגות עבור חברות, מפעלים ומותגים מובילים בארץ ובעולם.\n\nאנו מעניקים ללקוחותינו שירות מקיף המלווה אותם משלב הרעיון והייעוץ ועד לאספקת המוצר המוגמר, תוך הקפדה על איכות ללא פשרות ויחס אישי לכל לקוח.\n\nלצד קשת רחבה של מוצרים ופתרונות אריזה, החברה שמה דגש על שירות לקוחות יעיל ומקצועי, ונמצאת בחזית הטכנולוגיה תוך התחדשות מתמדת.",
    industriesLabel: "תעשיות שאנו משרתים",
    industries: [
      "קוסמטיקה",
      "יקבים",
      "פארמה",
      "טקסטיל",
      "מזון",
      "משקאות",
      "מוצרי פרסום",
      'מוצרי קד"מ',
    ],

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

    teamEyebrow: "האנשים שמאחורי האריזה",
    teamTitle: "הצוות שלנו",
    teamMembers: [
      { name: "עמיר יוניק", role: 'מנכ"ל', image: teamImages.amirYunik },
      {
        name: "אנדריי פלטונוב",
        role: 'סמנכ"ל כספים',
        image: teamImages.andreyPlatonov,
      },
      {
        name: "מיכל גבע",
        role: 'סמנכ"לית משאבי אנוש',
        image: teamImages.michalGeva,
      },
      {
        name: "מני רפלד",
        role: 'סמנכ"ל מכירות',
        image: teamImages.meniRapfeld,
      },
      {
        name: "דורון חרפק",
        role: 'סמנכ"ל מחקר ופיתוח',
        image: teamImages.doronHarpak,
      },
      { name: "חמוטל דהן", role: 'מנהלת משל"ט', image: teamImages.hamutalDahan },
      {
        name: "לין בן שטרית",
        role: 'סמנכ"לית תפעול',
        image: teamImages.lynnBenChetrit,
      },
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

    standardsEyebrow: "איכות מוכחת",
    standardsTitle: "איכות ללא פשרות.",
    standardsBody:
      "בבארי אריזות, איכות היא הרבה מעבר לעמידה בדרישות — היא תפיסת עולם שמלווה כל מוצר, כל תהליך וכל החלטה.\n\nמערכת האיכות שלנו משלבת בקרה וניטור לאורך כל שלבי הייצור: מבחירת חומרי הגלם, דרך ההדפסה, ההשבחה, החיתוך וההדבקה ועד לבדיקת המוצר המוגמר. כך אנחנו מבטיחים איכות גבוהה, מדויקת ועקבית ופועלים לשיפור מתמיד.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "ניהול איכות",
        body: "מערכת ניהול איכות שמגדירה בקרה, עקביות ושיפור מתמשך בתהליכי הייצור והשירות.",
        certificateLabel: "לצפייה בתעודת ISO 9001",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/3260a30a73dec6e4df4eb292c0e0a21e9e945d67.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/409ecdaec9f4750291ef04fd4121ff4e3b9fa700-1241x1755.png",
      },
      {
        code: "FSSC 22000",
        title: "בטיחות מזון",
        body: "מערכת לניהול בטיחות מזון התומכת בייצור אריזות עבור תעשיות המזון והמשקאות.",
        certificateLabel: "לצפייה בתעודת FSSC 22000",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/7a056360827f98a329a0e9847124a43910e6db54.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/faeec416a67ca925a40af2d9289e849ce24c87d3-1241x1754.png",
      },
    ],

    ctaTitle: "בואו נתכנן יחד את האריזה הבאה שלכם.",
    ctaPrimary: "ליצירת קשר",
    ctaSecondary: "צפייה בקטלוג",
  },

  en: {
    eyebrow: "About",
    title: ["Where printing tradition", "meets modern packaging"],
    intro:
      "Beeri Packaging is one of Israel's leading printing houses for packaging and labels, with a reputation and accumulated experience of more than a century. We specialize in planning, designing and producing premium branded packaging for companies, manufacturers and leading brands in Israel and worldwide.\n\nWe provide a full service that accompanies clients from the idea and consultation stage through delivery of the finished product, with uncompromising quality and personal attention to every client.\n\nAlongside a wide range of packaging products and solutions, the company emphasizes efficient, professional customer service and stays at the front of technology through constant renewal.",
    industriesLabel: "Industries we serve",
    industries: [
      "Cosmetics",
      "Wineries",
      "Pharma",
      "Textiles",
      "Food",
      "Beverages",
      "Promotional products",
      "Point-of-sale",
    ],

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

    teamEyebrow: "The people behind the packaging",
    teamTitle: "Our team",
    teamMembers: [
      { name: "Amir Yunik", role: "CEO", image: teamImages.amirYunik },
      { name: "Andrey Platonov", role: "CFO", image: teamImages.andreyPlatonov },
      {
        name: "Michal Geva",
        role: "VP Human Resources",
        image: teamImages.michalGeva,
      },
      { name: "Meni Rapfeld", role: "VP Sales", image: teamImages.meniRapfeld },
      {
        name: "Doron Harpak",
        role: "VP Research & Development",
        image: teamImages.doronHarpak,
      },
      {
        name: "Hamutal Dahan",
        role: "Control Center Manager",
        image: teamImages.hamutalDahan,
      },
      {
        name: "Lynn Ben-Chetrit",
        role: "VP Operations",
        image: teamImages.lynnBenChetrit,
      },
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

    standardsEyebrow: "Proven quality",
    standardsTitle: "Quality without compromise.",
    standardsBody:
      "At Beeri Packaging, quality is more than meeting requirements — it guides every product, process and decision.\n\nOur quality system combines control and monitoring throughout production: from raw-material selection through printing, finishing, cutting and gluing to final-product inspection. This is how we deliver consistent, precise quality and keep improving.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "Quality management",
        body: "A quality-management system built around control, consistency and continuous improvement in production and service.",
        certificateLabel: "View the ISO 9001 certificate",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/3260a30a73dec6e4df4eb292c0e0a21e9e945d67.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/409ecdaec9f4750291ef04fd4121ff4e3b9fa700-1241x1755.png",
      },
      {
        code: "FSSC 22000",
        title: "Food safety",
        body: "A food-safety management system supporting packaging production for the food and beverage industries.",
        certificateLabel: "View the FSSC 22000 certificate",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/7a056360827f98a329a0e9847124a43910e6db54.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/faeec416a67ca925a40af2d9289e849ce24c87d3-1241x1754.png",
      },
    ],

    ctaTitle: "Let's plan your next package together.",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View catalog",
  },
};
