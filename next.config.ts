import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Nothing is gained by advertising the framework in a response header.
  poweredByHeader: false,
  images: {
    // Next 16 requires non-default quality values to be opted into here.
    // Everything now ships at the q75 default (the journey panels dropped
    // their q90 override — it doubled the bytes competing with the hero LCP);
    // 90 stays allowed so q=90 URLs in already-cached prerendered HTML keep
    // resolving instead of 400ing.
    qualities: [75, 90],
    // Keep optimized variants cached for a year. The cache is keyed by the
    // source + transform params, so a changed source still yields a fresh
    // entry — this only lifts repeat-view delivery.
    minimumCacheTTL: 31536000,
    // Sanity-hosted assets are served from the image CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        // Cache the static image assets (raw source files + SVG logos) hard
        // for repeat-view performance, but NOT `immutable`: these paths are
        // not content-hashed/fingerprinted (legacy photos under stable names,
        // still mid-migration to the Sanity CDN), so an in-place replacement
        // must be able to propagate. `stale-while-revalidate` serves the cached
        // copy instantly while revalidating in the background.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  // The /portfolio placeholder route was removed; 301 any old (possibly
  // indexed / linked) locale URLs to the catalog so they don't hard-404.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/catalog", permanent: true },
      { source: "/:locale(he|en)/portfolio", destination: "/:locale/catalog", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
