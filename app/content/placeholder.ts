/**
 * Placeholder-page content layer.
 *
 * Each route under the header nav (portfolio, finishing, careers, catalog,
 * blog) renders a placeholder page until its real content lands. Copy lives
 * here for the same reason `home.ts` exists — a CMS will swap this module
 * for an async fetcher without touching the components.
 */

import type { Lang } from "@/app/content/home";

export type PlaceholderRoute =
  | "portfolio"
  | "finishing"
  | "careers"
  | "catalog"
  | "blog";

export type PlaceholderCopy = {
  /** Yellow eyebrow chip text — short, all-caps in component. */
  eyebrow: string;
  /** Display title broken into 1–2 lines. */
  title: readonly [string] | readonly [string, string];
  /** Bold lead line directly under the title. */
  lead: string;
  /** Longer body paragraph in clay/body type. */
  body: string;
  /** Short "what's coming" preview chips. */
  preview: readonly string[];
  /** Primary CTA label (links to /#cta — start a project). */
  ctaPrimary: string;
  /** Secondary CTA label (links to /). */
  ctaSecondary: string;
};

export type PlaceholderContent = Record<Lang, PlaceholderCopy>;

export const placeholderContent: Record<PlaceholderRoute, PlaceholderContent> = {
  portfolio: {
    he: {
      eyebrow: "פורטפוליו · בקרוב",
      title: ["פרויקטים נבחרים", "מקבוצת בארי"],
      lead: "אוסף עבודות הסטודיו נמצא בעריכה.",
      body:
        "אנחנו אוספים את הפרויקטים הבולטים שלנו — אריזות יין, פארמה, קוסמטיקה, מזון ומשקאות — לתצוגה ייעודית שתוצג כאן. בינתיים אפשר לראות חלק מהעבודות בעמוד הבית או לפנות אלינו ישירות.",
      preview: ["יינות וקפסולות", "פארמה ובריאות", "מזון ומשקאות", "קוסמטיקה והשבחות"],
      ctaPrimary: "התחלת תהליך",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Portfolio · Coming soon",
      title: ["Selected work", "from the studio"],
      lead: "Our case-study gallery is being curated.",
      body:
        "We're collecting standout projects — wine, pharma, cosmetics, food and beverages — into a dedicated portfolio that will live here. In the meantime you can see a slice on the home page or reach out directly.",
      preview: ["Wines & capsules", "Pharma & health", "Food & beverage", "Cosmetics & finishing"],
      ctaPrimary: "Start a project",
      ctaSecondary: "Back to home",
    },
  },
  finishing: {
    he: {
      eyebrow: "השבחות · בקרוב",
      title: ["טכניקות הדפסה", "וגימור"],
      lead: "מדריך השבחות מפורט בעבודה.",
      body:
        "פויל חם וקר, הבלטה, הטבעה, לכה סלקטיבית, ספוט יו-וי, חיתוך לייזר ושטנץ מורכב — כל אחת מהטכניקות תקבל כאן תיעוד מלא עם דוגמאות. עד אז, צוות הסטודיו זמין לייעוץ נקודתי לפרויקט שלך.",
      preview: ["פויל חם וקר", "הבלטה והטבעה", "לכה סלקטיבית וספוט UV", "חיתוך לייזר", "שטנץ מורכב"],
      ctaPrimary: "התחלת תהליך",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Finishing · Coming soon",
      title: ["Print techniques", "& finishing"],
      lead: "Our finishing guide is in production.",
      body:
        "Hot and cold foil, embossing, debossing, spot varnish, spot UV, laser cutting and complex dies — each technique will get a proper write-up with samples right here. Until then, the studio is on call for project-level guidance.",
      preview: ["Hot & cold foil", "Emboss & deboss", "Spot varnish & UV", "Laser cutting", "Complex dies"],
      ctaPrimary: "Start a project",
      ctaSecondary: "Back to home",
    },
  },
  careers: {
    he: {
      eyebrow: "קריירה · בקרוב",
      title: ["מצטרפים לבארי", "אריזות"],
      lead: "המשרות הפתוחות יתפרסמו כאן.",
      body:
        "בארי אריזות מגדלת צוות מעצבים, מפעילי דפוס, אנשי תכנון מבני, איכות ולוגיסטיקה. ברגע שייפתחו משרות נפרסם אותן כאן עם הפרטים המלאים. אפשר גם לשלוח קורות חיים יזומים ונחזור אליך.",
      preview: ["סטודיו ועיצוב", "תכנון מבני", "ייצור ודפוס", "איכות ולוגיסטיקה"],
      ctaPrimary: "שליחת קורות חיים",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Careers · Coming soon",
      title: ["Join the team", "at Beeri"],
      lead: "Open roles will be posted here.",
      body:
        "Beeri Packaging is growing a team of designers, press operators, structural engineers, QA and logistics. As roles open we'll list them here with full detail. You're welcome to send a proactive CV and we'll get back to you.",
      preview: ["Studio & design", "Structural design", "Production & press", "QA & logistics"],
      ctaPrimary: "Send your CV",
      ctaSecondary: "Back to home",
    },
  },
  catalog: {
    he: {
      eyebrow: "קטלוג · בקרוב",
      title: ["קטלוג מבנים", "וחומרי גלם"],
      lead: "מערכת הקטלוג בהקמה.",
      body:
        "אנחנו בונים קטלוג עם מבני אריזה סטנדרטיים, סוגי קרטון, גובהים, משקלים והשבחות זמינות — כדי לתת לכם נקודת התחלה לפרויקט הבא. עד שיעלה, אפשר לפנות אלינו ונשלח דוגמאות רלוונטיות.",
      preview: ["מבני קופסה", "קרטון 250–350 גרם", "כריכה ומדף", "השבחות זמינות"],
      ctaPrimary: "בקשת קטלוג",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Catalog · Coming soon",
      title: ["Structures &", "stock catalog"],
      lead: "The catalog system is being built.",
      body:
        "We're putting together a catalog of standard box geometries, board grades, heights, weights and available finishing — a starting point for your next project. Until it ships, reach out and we'll send relevant samples.",
      preview: ["Box structures", "Stock 250–350 gsm", "Shelf & display", "Available finishing"],
      ctaPrimary: "Request catalog",
      ctaSecondary: "Back to home",
    },
  },
  blog: {
    he: {
      eyebrow: "בלוג · בקרוב",
      title: ["יומן הסטודיו"],
      lead: "כאן יפורסמו טורים, מדריכים והצצות לפרויקטים.",
      body:
        "בארי אריזות מפרסמת תכנים על תכנון מבני, מגמות עיצוב באריזה, חומרים בני-קיימא ועבודה מאחורי הקלעים של המפעל. הפוסטים הראשונים בדרך — ובינתיים זמין הסקיצה למה שמתבשל.",
      preview: ["תכנון מבני", "מגמות בעיצוב", "אריזה ירוקה", "בקצרה מהמפעל"],
      ctaPrimary: "התחלת תהליך",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Blog · Coming soon",
      title: ["Studio journal"],
      lead: "Long-form writing, guides and project notes will live here.",
      body:
        "Beeri publishes on structural design, packaging trends, sustainable materials and behind-the-scenes from the floor. The first posts are on their way — for now, here's a preview of what's brewing.",
      preview: ["Structural design", "Design trends", "Sustainable packaging", "From the floor"],
      ctaPrimary: "Start a project",
      ctaSecondary: "Back to home",
    },
  },
};
