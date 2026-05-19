import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires non-default quality values to be opted into here.
    // The journey panels render large, so 90 keeps them sharp after the
    // parallax scale; 75 stays for everything else (the default).
    qualities: [75, 90],
  },
};

export default nextConfig;
