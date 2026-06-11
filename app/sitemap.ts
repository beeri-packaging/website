import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, ROUTES } from "@/lib/site";
import { getAllPosts } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const langs = (route: string) => ({
    ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`])),
    // Hebrew is the default locale, so it's also the x-default target.
    "x-default": `${SITE_URL}/he${route}`,
  });

  // Every locale version is its own <url> entry (Google's hreflang-in-sitemap
  // guidance expects each language version enumerated for discovery).
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date("2026-06-04"),
      alternates: { languages: langs(route) },
    })),
  );

  // Blog posts — one entry per slug per locale (slugs are shared across locales).
  const posts = await getAllPosts("he");
  const postEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    posts.map((p) => ({
      url: `${SITE_URL}/${locale}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : undefined,
      alternates: { languages: langs(`/blog/${p.slug}`) },
    })),
  );

  return [...staticEntries, ...postEntries];
}
