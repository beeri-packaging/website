/**
 * Placeholder-page content layer.
 *
 * Each route under the header nav (finishing, careers, catalog, blog)
 * renders a placeholder page until its real content lands. Copy lives
 * here for the same reason `home.ts` exists — a CMS will swap this module
 * for an async fetcher without touching the components.
 */

import type { Lang } from "@/app/content/home";

export type PlaceholderRoute =
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
  finishing: {
    he: {
      eyebrow: "השבחות · בקרוב",
      title: ["טכניקות דפוס", "וגימור"],
      lead: "מדריך ההשבחות המלא בהכנה.",
      body:
        "פויל חם וקר, הבלטה ודיבוס, לכה סלקטיבית, ספוט UV, חיתוך לייזר ושטנץ מורכב — לכל טכניקה יהיה כאן תיעוד מלא עם דוגמאות, ומתי כדאי להשתמש בה. עד אז, אפשר לפנות אלינו לייעוץ ממוקד לפרויקט שלכם.",
      preview: ["פויל חם וקר", "הבלטה ודיבוס", "לכה סלקטיבית וספוט UV", "חיתוך לייזר", "שטנץ מורכב"],
      ctaPrimary: "התחלת תהליך",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Finishing · Coming soon",
      title: ["Print techniques", "& finishing"],
      lead: "The full finishing guide is in the works.",
      body:
        "Hot and cold foil, emboss and deboss, spot varnish, spot UV, laser cutting and complex dies — each technique will get a full write-up here, with samples and when to use it. Until then, reach out for focused guidance on your project.",
      preview: ["Hot & cold foil", "Emboss & deboss", "Spot varnish & UV", "Laser cutting", "Complex dies"],
      ctaPrimary: "Start a project",
      ctaSecondary: "Back to home",
    },
  },
  careers: {
    he: {
      eyebrow: "קריירה · בקרוב",
      title: ["מצטרפים לצוות", "בארי אריזות"],
      lead: "המשרות הפתוחות יתפרסמו כאן.",
      body:
        "בארי אריזות מגדלת צוות בעיצוב, בהפעלת דפוס, בתכנון מבני, באיכות ובלוגיסטיקה. כשייפתחו משרות, נפרסם אותן כאן עם כל הפרטים. אפשר גם לשלוח קורות חיים יזומים, ונחזור אליכם.",
      preview: ["סטודיו ועיצוב", "תכנון מבני", "ייצור ודפוס", "איכות ולוגיסטיקה"],
      ctaPrimary: "שליחת קורות חיים",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Careers · Coming soon",
      title: ["Join the team", "at Beeri"],
      lead: "Open roles will be posted here.",
      body:
        "Beeri Packaging is growing its team across design, press operation, structural design, QA and logistics. As roles open, we'll post them here with full detail. You're also welcome to send a CV ahead of time, and we'll be in touch.",
      preview: ["Studio & design", "Structural design", "Production & press", "QA & logistics"],
      ctaPrimary: "Send your CV",
      ctaSecondary: "Back to home",
    },
  },
  catalog: {
    he: {
      eyebrow: "קטלוג · בקרוב",
      title: ["קטלוג מבנים", "וחומרי גלם"],
      lead: "הקטלוג בהקמה.",
      body:
        "אנחנו בונים קטלוג של מבני אריזה נפוצים, סוגי קרטון, גבהים, משקלים והשבחות זמינות — נקודת פתיחה מסודרת לפרויקט הבא שלכם. עד שיעלה, אפשר לפנות אלינו ונשלח דוגמאות רלוונטיות.",
      preview: ["מבני קופסה", "קרטון 250–350 גרם", "מדף ותצוגה", "השבחות זמינות"],
      ctaPrimary: "בקשת קטלוג",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Catalog · Coming soon",
      title: ["Structures &", "stock catalog"],
      lead: "The catalog is being built.",
      body:
        "We're building a catalog of common box structures, board grades, heights, weights and available finishing — a clear starting point for your next project. Until it ships, reach out and we'll send relevant samples.",
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
        "בארי אריזות מפרסמת תכנים על תכנון מבני, מגמות בעיצוב אריזה, חומרים בני-קיימא ומבט מאחורי הקלעים של המפעל. הפוסטים הראשונים בדרך — ובינתיים אפשר לראות כאן הצצה למה שמתבשל.",
      preview: ["תכנון מבני", "מגמות בעיצוב", "אריזה ירוקה", "בקצרה מהמפעל"],
      ctaPrimary: "התחלת תהליך",
      ctaSecondary: "חזרה לעמוד הבית",
    },
    en: {
      eyebrow: "Blog · Coming soon",
      title: ["Studio journal"],
      lead: "Long-form writing, guides and project notes will live here.",
      body:
        "Beeri publishes on structural design, packaging design trends, sustainable materials and a look behind the scenes on the floor. The first posts are on their way — for now, here's a preview of what's brewing.",
      preview: ["Structural design", "Design trends", "Sustainable packaging", "From the floor"],
      ctaPrimary: "Start a project",
      ctaSecondary: "Back to home",
    },
  },
};
