// Production base URL. MUST be set via NEXT_PUBLIC_SITE_URL in the deploy
// environment (Vercel → Project → Environment Variables) — it feeds the
// sitemap, robots, every per-page canonical/hreflang, and the Organization
// JSON-LD. The fallback below is only a placeholder for local/dev; do NOT
// rely on it in production.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.beeripacks.co.il";

export const LOCALES = ["he", "en"] as const;

// Public, indexable routes (relative to a locale). Excludes /design (dev-only)
// and dynamic /blog/[slug] (the journal lists from /careers; no standalone
// /blog index). Blog post URLs are added to the sitemap separately.
export const ROUTES = [
  "",
  "/finishing",
  "/careers",
  "/catalog",
  "/about",
  "/terms",
  "/privacy",
] as const;

/**
 * Per-page canonical + hreflang alternates. Each page MUST set its own
 * `alternates` in generateMetadata, because Next.js merges metadata shallowly:
 * a nested `alternates` object defined in the layout is inherited verbatim by
 * any child that doesn't redefine it — which would otherwise point every
 * sub-page's canonical at the locale homepage. `route` is the locale-relative
 * path ("" for home, "/catalog", `/blog/${slug}`, …).
 */
export function alternatesFor(locale: string, route: string) {
  return {
    canonical: `/${locale}${route}`,
    languages: {
      he: `/he${route}`,
      en: `/en${route}`,
      "x-default": `/he${route}`,
    },
  };
}

/**
 * Per-page SEO block: self-referential canonical + hreflang and a page-specific
 * Open Graph title/description/url (so sub-pages don't inherit the homepage's
 * OG). Spread into a page's generateMetadata return.
 */
export function pageSeo(
  locale: string,
  route: string,
  title: string,
  description: string,
) {
  return {
    alternates: alternatesFor(locale, route),
    openGraph: {
      title,
      description,
      url: `/${locale}${route}`,
      type: "website" as const,
    },
  };
}
