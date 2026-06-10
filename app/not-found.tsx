import Link from "next/link";
import { Karantina, Open_Sans } from "next/font/google";
import { notFoundCopy } from "@/app/content/system";
import "./globals.css";

// Root-level 404 fallback. The root layout is a pass-through (no <html>/<body>),
// so this owns its own document shell and fonts. It renders for paths that never
// reach the `[locale]` segment (e.g. an unknown locale prefix), so we default to
// Hebrew/RTL — the site's primary locale.
const karantina = Karantina({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export default function NotFound() {
  const t = notFoundCopy.he;
  return (
    <html lang="he" dir="rtl" className={`${karantina.variable} ${openSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-bone px-6 text-ink">
        <div className="bg-yellow inline-flex items-start px-3 py-1">
          <span className="font-sans text-[10.5px] uppercase leading-4 tracking-[0.08em] text-cyan-deep sm:text-[12px]">
            {t.eyebrow}
          </span>
        </div>
        <p className="mt-6 font-display text-[120px] font-bold leading-[0.8] text-magenta sm:text-[160px]">
          {t.code}
        </p>
        <h1 className="mt-2 font-display text-[40px] font-bold leading-[0.95] text-ink sm:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-4 max-w-[420px] text-center font-sans text-[16px] leading-[1.7] text-clay">
          {t.description}
        </p>
        <Link
          href="/he"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-none border border-ink bg-ink px-8 py-4 font-sans text-[14px] font-bold tracking-[0.08em] text-bone transition-colors duration-300 hover:bg-bone hover:text-ink"
        >
          {t.primary}
        </Link>
      </body>
    </html>
  );
}
