import type { Lang } from "@/app/content/home";

export type CareersArticle = {
  tag: string;
  meta?: string;
  title: readonly string[];
  body?: string;
  image?: string;
  cta?: string;
  theme: "feature" | "plain" | "yellow" | "image" | "wide";
};

export type CareerRole = {
  code: string;
  status: string;
  title: string;
  scope: string;
  location: string;
  department: "all" | "production" | "studio";
  /** על התפקיד — 2–4 plain sentences shown in the application dialog. */
  description?: string;
  /** Up to 5 short bullet lines (what you'll do / what's needed). */
  highlights?: readonly string[];
};

export type CareersCopy = {
  eyebrow: string;
  title: readonly [string, string];
  intro: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  articles: readonly CareersArticle[];
  rolesTitle: string;
  filters: readonly { key: CareerRole["department"]; label: string }[];
  apply: string;
  /** Shown when a department filter matches none of the open roles. */
  noRoles: string;
  /** Shown instead of the list (and the filters) while there are no open roles at all. */
  noOpenRoles: {
    title: string;
    body: string;
    cta: string;
  };
  roles: readonly CareerRole[];
  newsletterTitle: readonly [string, string];
  newsletterBody: string;
  emailPlaceholder: string;
  newsletterCta: string;
  /** Inline confirmation after a successful newsletter signup. */
  newsletterSuccess: string;
  /** Inline error if the newsletter signup fails to send. */
  newsletterError: string;
};

export const careersImages = {
  feature: "/images/figma/careers/feature.png",
  materials: "/images/figma/careers/materials.png",
} as const;

export const careersCopy: Record<Lang, CareersCopy> = {
  he: {
    eyebrow: "קריירה בבארי",
    title: ["מצטרפים", "לעשייה"],
    intro:
      "בבארי אריזות הסטודיו, התכנון המבני, הדפוס והייצור עובדים תחת קורת גג אחת. כאן מתפרסמות המשרות הפתוחות, לצד הצצה אל העבודה היומיומית.",
    searchPlaceholder: "חיפוש משרה",
    searchButtonLabel: "חיפוש",
    articles: [
      {
        tag: "מקרה בוחן #023",
        meta: "מרץ 2025",
        title: ["מהצורך של הלקוח לאריזה", "שמוכנה לייצור"],
        body:
          "כל פרויקט מתחיל בשאלה אחת: מה האריזה צריכה לעשות. משם מובילים הצוותים את המוצר דרך אפיון, דייליין, בחירת חומר גלם, קדם-דפוס וייצור — עד אריזה שעוברת לפסים ועומדת על המדף.",
        image: careersImages.feature,
        theme: "feature",
      },
      {
        tag: "איכות",
        title: ["בקרת איכות"],
        body:
          "בדיקות לאורך הייצור מוודאות שכל אריזה עומדת בדרישות הלקוח ובתקני ISO 9001:2015 ו־FSSC 22000.",
        cta: "לקריאה",
        theme: "plain",
      },
      {
        tag: "ייצור",
        title: ["דיוק בדפוס", "ובגימור"],
        theme: "yellow",
      },
      {
        tag: "פיתוח",
        title: ["מעבדת החומרים"],
        body:
          "בדיקות חומר, שטנץ וקיפול הופכות רעיון לאריזה שמחזיקה בשינוע, נפתחת כמו שצריך וניתנת לייצור חוזר.",
        image: careersImages.materials,
        theme: "image",
      },
      {
        tag: "מבט מבפנים",
        title: ["פרטים", "קטנים קובעים"],
        body:
          "מילימטר בדייליין, גוון בדפוס וקו קיפול — כל אחד מהם משפיע על המוצר, על נוכחותו במדף ועל הרגע שבו הלקוח פותח את האריזה.",
        cta: "לכל התהליכים",
        theme: "wide",
      },
    ],
    rolesTitle: "משרות פתוחות",
    filters: [
      { key: "all", label: "הכל" },
      { key: "production", label: "ייצור" },
      { key: "studio", label: "סטודיו" },
    ],
    apply: "להגשה",
    noRoles: "לא נמצאו משרות שמתאימות לחיפוש.",
    noOpenRoles: {
      title: "אין כרגע משרות פתוחות",
      body: "כרגע אין אצלנו משרות מאוישות לגיוס, אבל אנחנו תמיד שמחים להכיר. אפשר להשאיר פרטים ולצרף קורות חיים — וכשייפתח תפקיד שמתאים, נחזור אליכם.",
      cta: "שליחת קורות חיים",
    },
    roles: [
      {
        code: "#BR-501",
        status: "מגייסים",
        title: "מפעיל/ת מכונת שטנץ",
        scope: "משמרות בוקר וצהריים",
        location: "יבנה",
        department: "production",
        description:
          "תפעול וכיוון של מכונת שטנץ, כולל הכנסת המבלט והוצאתו, הרצת המכונה, טעינת חומר ופיקוח שוטף על מהלך העבודה. עבודה דינמית בהתאם לתוכנית העבודה.",
        highlights: [
          "משמרת בוקר: 07:00–16:00; שעות נוספות עד 18:00 בהתאם לצורך",
          "משמרת שנייה: 16:00–23:45",
          "אפשרות לשעות נוספות במשמרת השנייה עד 05:00",
          "כיוון המכונה, טעינת חומר ובקרה על מהלך הייצור",
        ],
      },
      {
        code: "#BR-502",
        status: "מגייסים",
        title: "עוזר/ת דפס",
        scope: "משמרות בוקר ולילה",
        location: "יבנה",
        department: "production",
        description:
          "סיוע בהכנת מכונת הדפוס ובהפעלתה, טעינת חומרי גלם, צבע וחומרים נלווים, ודיווח על צריכת החומר במערכת. התפקיד כולל תחזוקה שוטפת וסיוע בזרימת החומר במחלקת הדפוס, בעבודת צוות ובמאמץ פיזי קל עד בינוני.",
        highlights: [
          "משמרת בוקר: 06:30–18:00; משמרת לילה: 17:30–05:30",
          "הכנסה והוצאה של גיליונות ממכונת הדפוס",
          "תחזוקה שוטפת של המכונה וסיוע לצוות המחלקה",
          "ניסיון קודם בתחום הדפוס — יתרון",
        ],
      },
      {
        code: "#BR-503",
        status: "מגייסים",
        title: "מלגזן/ית",
        scope: "משמרת בוקר",
        location: "יבנה",
        department: "production",
        description:
          "שינוע משטחים וחומרי גלם בין מבני החברה, טעינה ופריקה של משאיות והעברת עבודות בין המחלקות. העבודה מתבצעת בהתאם לתוכנית העבודה ודורשת אחריות, סדר וניסיון מעשי.",
        highlights: [
          "שעות העבודה: 07:00–16:00; שעות נוספות עד 18:00 בהתאם לצורך",
          "עבודה בימי שישי לסירוגין בהתאם לצורכי העבודה",
          "רישיון מלגזה בתוקף וניסיון של שנה לפחות — חובה",
          "עברית ברמת דיבור וקריאה — חובה",
        ],
      },
      {
        code: "#BR-504",
        status: "מגייסים",
        title: "עוזר/ת למכונת UV",
        scope: "משמרות בוקר ולילה",
        location: "יבנה",
        department: "production",
        description:
          "סיוע בהכנת חומרי העזר ורשתות מכונת ה־UV, לרבות שטיפה, מריחת לכה והכנת הרשתות לעבודה. התפקיד כולל ניקיון ותחזוקה של המכונה, סיוע למפעיל/ה ולמנהל המחלקה ככל שנדרש.",
        highlights: [
          "שעות משמרת הבוקר: 07:00–16:00, בימים א׳–ה׳",
          "אפשרות לשעות נוספות בהתאם לצורך",
          "נדרשת נכונות לעבודה במשמרות, לרבות משמרות לילה",
          "הכנת רשתות, תחזוקת המכונה וסיוע שוטף בהפעלתה",
        ],
      },
    ],
    newsletterTitle: ["עדכוני", "קריירה"],
    newsletterBody:
      "רוצים לדעת כשנפתחת משרה חדשה? השאירו כתובת מייל, ונעדכן כשיתפנה תפקיד שמתאים לכם.",
    emailPlaceholder: "כתובת מייל",
    newsletterCta: "הרשמה",
    newsletterSuccess: "נרשמתם — נעדכן אתכם כשיתפנה תפקיד מתאים.",
    newsletterError: "ההרשמה נכשלה. ניתן לנסות שוב.",
  },
  en: {
    eyebrow: "Careers at Beeri",
    title: ["Join", "the work"],
    intro:
      "At Beeri Packaging, studio, structural design, print and production all sit under one roof. This is where open roles are posted, alongside a look at the day-to-day work.",
    searchPlaceholder: "Search role",
    searchButtonLabel: "Search",
    articles: [
      {
        tag: "Case study #023",
        meta: "March 2025",
        title: ["From a client need", "to production-ready packaging"],
        body:
          "Every project starts with one question: what does the packaging need to do. From there our teams carry the product through brief, dieline, stock selection, prepress and production — to a carton that runs on the line and holds its own on the shelf.",
        image: careersImages.feature,
        theme: "feature",
      },
      {
        tag: "Quality",
        title: ["Quality control"],
        body:
          "Checks throughout production confirm every carton meets client requirements and our ISO 9001:2015 and FSSC 22000 standards.",
        cta: "Read",
        theme: "plain",
      },
      {
        tag: "Production",
        title: ["Precision", "in print and finish"],
        theme: "yellow",
      },
      {
        tag: "Development",
        title: ["Materials lab"],
        body:
          "Material, die-cut and fold tests turn an idea into a carton that survives shipping, opens the way it should and can be produced again and again.",
        image: careersImages.materials,
        theme: "image",
      },
      {
        tag: "Inside view",
        title: ["Small", "details decide"],
        body:
          "A millimeter on the dieline, a shade on press, a fold line — each one shapes the product, its presence on the shelf and the moment the customer opens the box.",
        cta: "All processes",
        theme: "wide",
      },
    ],
    rolesTitle: "Open roles",
    filters: [
      { key: "all", label: "All" },
      { key: "production", label: "Production" },
      { key: "studio", label: "Studio" },
    ],
    apply: "Apply",
    noRoles: "No roles match this search.",
    noOpenRoles: {
      title: "No open roles right now",
      body: "We have no positions open for hiring at the moment, but we're always glad to meet people. Leave your details with a CV attached — and when a role that fits opens up, we'll be in touch.",
      cta: "Send a CV",
    },
    roles: [
      {
        code: "#BR-501",
        status: "Hiring",
        title: "Die-cut machine operator",
        scope: "Morning and afternoon shifts",
        location: "Yavne",
        department: "production",
        description:
          "Operate and set up a die-cutting machine, including installing and removing the cutting die, running the machine, loading materials, and monitoring production. This is a hands-on, dynamic role guided by the production plan.",
        highlights: [
          "Morning shift: 07:00–16:00; overtime until 18:00 as needed",
          "Second shift: 16:00–23:45",
          "The second shift may include overtime until 05:00",
          "Machine setup, material loading, and production monitoring",
        ],
      },
      {
        code: "#BR-502",
        status: "Hiring",
        title: "Press assistant",
        scope: "Morning and night shifts",
        location: "Yavne",
        department: "production",
        description:
          "Support the setup and operation of the printing press, load stock, ink, and related materials, and report material consumption in the system. The role includes routine machine maintenance and supporting material flow within the print department, with teamwork and light-to-moderate physical effort.",
        highlights: [
          "Morning shift: 06:30–18:00; night shift: 17:30–05:30",
          "Load and remove sheets from the printing press",
          "Perform routine maintenance and support the department team",
          "Previous printing-industry experience is an advantage",
        ],
      },
      {
        code: "#BR-503",
        status: "Hiring",
        title: "Forklift operator",
        scope: "Morning shift",
        location: "Yavne",
        department: "production",
        description:
          "Move pallets and raw materials between company buildings, load and unload trucks, and transfer work between departments. Work follows the production plan and calls for responsibility, organization, and practical experience.",
        highlights: [
          "Working hours: 07:00–16:00; overtime until 18:00 as needed",
          "Alternating Fridays according to operational needs",
          "Valid forklift license and at least one year of experience required",
          "Spoken and written Hebrew required",
        ],
      },
      {
        code: "#BR-504",
        status: "Hiring",
        title: "UV machine assistant",
        scope: "Morning and night shifts",
        location: "Yavne",
        department: "production",
        description:
          "Support the preparation of materials and screens for the UV machine, including washing, coating, and preparing screens for production. The role also includes cleaning and maintaining the machine and assisting the operator and department manager as needed.",
        highlights: [
          "Morning-shift hours: 07:00–16:00, Sunday–Thursday",
          "Overtime may be required as needed",
          "Availability for shift work, including night shifts, is required",
          "Screen preparation, machine maintenance, and day-to-day operating support",
        ],
      },
    ],
    newsletterTitle: ["Career", "updates"],
    newsletterBody:
      "Want to know when a new role opens? Leave your email and we will reach out when a position fits.",
    emailPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    newsletterSuccess: "You're in — we'll reach out when a role fits.",
    newsletterError: "Signup failed. Please try again.",
  },
};
