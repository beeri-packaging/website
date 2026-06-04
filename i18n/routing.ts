import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["he", "en"],
  defaultLocale: "he",
  // Hebrew-first: send `/` to the default locale (/he) deterministically
  // rather than honoring the visitor's Accept-Language header.
  localeDetection: false,
});
