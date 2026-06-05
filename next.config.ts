import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires non-default quality values to be opted into here.
    // The journey panels render large, so 90 keeps them sharp after the
    // parallax scale; 75 stays for everything else (the default).
    qualities: [75, 90],
    // Sanity-hosted assets are served from the image CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
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
