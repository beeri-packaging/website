import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["he", "en"],
  defaultLocale: "he",
  // Hebrew-first: send `/` to the default locale (/he) deterministically
  // rather than honoring the visitor's Accept-Language header.
  localeDetection: false,
  // Canonical + hreflang URLs are emitted from Next metadata via lib/site.ts.
  // Keeping next-intl's request-host based Link header enabled creates a
  // second, conflicting hreflang set on Vercel preview URLs.
  alternateLinks: false,
});
