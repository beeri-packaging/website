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
      "בארי אריזות מחברת סטודיו, תכנון מבני, דפוס וייצור. כאן מתפרסמות משרות פתוחות והצצות לעשייה.",
    searchPlaceholder: "חיפוש משרה",
    searchButtonLabel: "חיפוש",
    articles: [
      {
        tag: "מקרה בוחן #023",
        meta: "מרץ 2025",
        title: ["מהצורך של הלקוח לאריזה", "שמוכנה לייצור"],
        body:
          "הצוותים שלנו עובדים יחד על כל שלב: אפיון מוצר, דייליין, חומרי גלם, דפוס, השבחות, הדבקה, בקרת איכות ואספקה.",
        image: careersImages.feature,
        theme: "feature",
      },
      {
        tag: "איכות",
        title: ["בקרת איכות"],
        body:
          "בדיקות לאורך הייצור מוודאות שכל אריזה עומדת בדרישות הלקוח והתקנים.",
        cta: "לקריאה",
        theme: "plain",
      },
      {
        tag: "ייצור",
        title: ["דיוק בדפוס", "וגימור"],
        theme: "yellow",
      },
      {
        tag: "פיתוח",
        title: ["מעבדת החומרים"],
        body:
          "בדיקות חומר, קיפול וחיזוקים עוזרות להפוך רעיון לאריזה שאפשר לייצר שוב ושוב.",
        image: careersImages.materials,
        theme: "image",
      },
      {
        tag: "מבט מבפנים",
        title: ["פרטים", "קטנים קובעים"],
        body:
          "מילימטרים, צבע וקיפול משפיעים על המוצר, על המדף ועל חוויית הלקוח.",
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
        title: "מבקר/ת איכות ייצור",
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
      "רוצים לשמוע כשנפתחות משרות חדשות? השאירו מייל ונעדכן כשיש תפקיד רלוונטי.",
    emailPlaceholder: "כתובת מייל",
    newsletterCta: "הרשמה",
  },
  en: {
    eyebrow: "Careers at Beeri",
    title: ["Join", "the work"],
    intro:
      "Beeri Packaging connects studio, structural planning, print and production. Open roles and behind-the-scenes notes live here.",
    searchPlaceholder: "Search role",
    searchButtonLabel: "Search",
    articles: [
      {
        tag: "Case study #023",
        meta: "March 2025",
        title: ["From a client need", "to production-ready packaging"],
        body:
          "Our teams work together across every step: product brief, dieline, stock, print, finishing, gluing, quality control and delivery.",
        image: careersImages.feature,
        theme: "feature",
      },
      {
        tag: "Quality",
        title: ["Quality control"],
        body:
          "Checks throughout production make sure every package meets client requirements and standards.",
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
          "Material, fold and reinforcement tests help turn an idea into packaging that can be produced again and again.",
        image: careersImages.materials,
        theme: "image",
      },
      {
        tag: "Inside view",
        title: ["Small", "details decide"],
        body:
          "Millimeters, color and folds affect the product, the shelf and the customer experience.",
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
        title: "Production quality inspector",
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
      "Want to hear when new roles open? Leave an email and we will send relevant updates.",
    emailPlaceholder: "Email address",
    newsletterCta: "Subscribe",
  },
};
