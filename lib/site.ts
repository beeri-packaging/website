export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beeri-arizot-1bxc.vercel.app";

export const LOCALES = ["he", "en"] as const;

// Public, indexable routes (relative to a locale). Excludes /design (dev-only)
// and dynamic /blog/[slug] (the journal lists from /careers; no standalone
// /blog index).
export const ROUTES = [
  "",
  "/portfolio",
  "/finishing",
  "/careers",
  "/catalog",
  "/terms",
  "/privacy",
] as const;
