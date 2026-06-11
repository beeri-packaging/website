import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

// Must match the base the locale layout uses for canonicals/hreflang —
// otherwise the file-convention og/twitter images resolve against a
// different origin than the rest of the metadata.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
