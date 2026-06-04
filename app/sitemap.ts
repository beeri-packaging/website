import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}/he${route}`,
    lastModified: new Date("2026-06-04"),
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`])
      ),
    },
  }));
}
