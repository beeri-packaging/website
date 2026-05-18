import type { Metadata } from "next";
import { Karantina, Open_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "בארי אריזות — אריזה שעובדת בשביל המוצר",
  description:
    "משנת 1964 — בארי אריזות מתכננת ומייצרת אריזות קרטון בהתאמה אישית. תכנון מבני, חומרי גלם, דפוס והשבחות שעובדים יחד.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${karantina.variable} ${openSans.variable} antialiased`}
    >
      <body className="flex flex-col bg-bone text-ink">{children}</body>
    </html>
  );
}
