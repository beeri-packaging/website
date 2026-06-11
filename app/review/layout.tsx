import type { Metadata } from "next";
import { Karantina, Open_Sans } from "next/font/google";
import "../globals.css";

const karantina = Karantina({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Internal content-approval tool — never index it, and keep it out of sitemaps.
export const metadata: Metadata = {
  title: "אישור תוכן · בארי אריזות",
  description: "עמוד פנימי לאישור תוכן האתר על ידי הלקוח.",
  robots: { index: false, follow: false },
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${karantina.variable} ${openSans.variable} antialiased`}
    >
      <body className="bg-bone text-ink">{children}</body>
    </html>
  );
}
