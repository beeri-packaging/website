"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Karantina, Open_Sans } from "next/font/google";
import { errorCopy } from "@/app/content/system";
import "./globals.css";

// Last-resort boundary: catches errors thrown in the root layout itself, which
// is above every locale provider. It replaces the whole document, so it owns its
// own <html>/<body> + fonts and can't use next-intl. Defaults to Hebrew/RTL.
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

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = errorCopy.he;
  return (
    <html lang="he" dir="rtl" className={`${karantina.variable} ${openSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-bone px-6 text-ink">
        <div className="bg-yellow inline-flex items-start px-3 py-1">
          <span className="font-sans text-[10.5px] uppercase leading-4 tracking-[0.08em] text-cyan-deep sm:text-[12px]">
            {t.eyebrow}
          </span>
        </div>
        <h1 className="mt-6 font-display text-[44px] font-bold leading-[0.95] text-ink sm:text-[60px]">
          {t.title}
        </h1>
        <p className="mt-4 max-w-[420px] text-center font-sans text-[16px] leading-[1.7] text-clay">
          {t.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-3 rounded-none border border-ink bg-ink px-8 py-4 font-sans text-[14px] font-bold tracking-[0.08em] text-bone transition-colors duration-300 hover:bg-bone hover:text-ink"
          >
            {t.secondary}
          </button>
          <Link
            href="/he"
            className="inline-flex items-center justify-center gap-3 rounded-none border border-ink px-8 py-4 font-sans text-[14px] font-bold tracking-[0.08em] text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
          >
            {t.primary}
          </Link>
        </div>
      </body>
    </html>
  );
}
