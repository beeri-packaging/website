import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio = admin, /api = endpoints, /*/design = dev-only style guide,
      // /*/presentation = private, unlisted board presentation.
      disallow: [
        "/studio",
        "/api/",
        "/he/design",
        "/en/design",
        "/he/presentation",
        "/en/presentation",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
