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
  noRoles: string;
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
    roles: [
      {
        code: "#BR-402",
        status: "פתוח",
        title: "רכז/ת איכות",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "production",
      },
      {
        code: "#BR-409",
        status: "פתוח",
        title: "מבקר/ת איכות בייצור",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "production",
      },
      {
        code: "#BR-312",
        status: "פתוח",
        title: "מנהל/ת פרויקטים בייצור",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "studio",
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
    roles: [
      {
        code: "#BR-402",
        status: "Open",
        title: "Quality coordinator",
        scope: "Full time",
        location: "Yavne",
        department: "production",
      },
      {
        code: "#BR-409",
        status: "Open",
        title: "Quality inspector, production",
        scope: "Full time",
        location: "Yavne",
        department: "production",
      },
      {
        code: "#BR-312",
        status: "Open",
        title: "Production project manager",
        scope: "Full time",
        location: "Yavne",
        department: "studio",
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
