import type { Lang } from "./home";

/**
 * Bilingual copy for the system pages (404 + runtime error). Kept here next to
 * the other `app/content/*` sources rather than in `messages/*.json` (which only
 * carries Metadata) so the not-found / error views can read it by `lang` —
 * Next's `not-found.tsx` receives no `params`, so we resolve the locale from
 * the client context instead.
 */
export type SystemCopy = {
  /** Small label on the yellow chip. */
  eyebrow: string;
  /** Oversized display glyph (e.g. the status code). Omitted on the error view. */
  code?: string;
  title: string;
  description: string;
  /** Primary CTA — back to home. */
  primary: string;
  /** Secondary CTA — contact (404) or retry (error). */
  secondary: string;
};

export const notFoundCopy: Record<Lang, SystemCopy> = {
  he: {
    eyebrow: "שגיאה 404",
    code: "404",
    title: "הדף לא נמצא",
    description:
      "נראה שהקופסה הזו ריקה. ייתכן שהדף הוסר, ששמו שונה, או שמעולם לא היה כאן. בואו נחזיר אתכם למסלול.",
    primary: "חזרה לדף הבית",
    secondary: "דברו איתנו",
  },
  en: {
    eyebrow: "Error 404",
    code: "404",
    title: "Page not found",
    description:
      "Looks like this box came up empty. The page may have been moved, renamed, or never existed. Let’s get you back on track.",
    primary: "Back to home",
    secondary: "Talk to us",
  },
};

export const errorCopy: Record<Lang, SystemCopy> = {
  he: {
    eyebrow: "שגיאה",
    title: "משהו השתבש",
    description:
      "אירעה תקלה בלתי צפויה מצדנו. אפשר לנסות שוב, ואם זה חוזר על עצמו — נשמח אם תיצרו איתנו קשר.",
    primary: "חזרה לדף הבית",
    secondary: "נסו שוב",
  },
  en: {
    eyebrow: "Error",
    title: "Something went wrong",
    description:
      "An unexpected error occurred on our end. You can try again, and if it keeps happening we’d love to hear from you.",
    primary: "Back to home",
    secondary: "Try again",
  },
};
