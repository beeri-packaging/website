import Link from "next/link";
import type { HomeCopy, Lang } from "@/app/content/home";
import { ArrowGlyph } from "./icons";

export function CallToAction({ lang, t }: { lang: Lang; t: HomeCopy }) {
  return (
    <section id="cta" className="bg-gold py-16 sm:py-20 md:py-24 scroll-mt-[100px]">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 md:px-12 lg:px-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
        <h2 className="font-display text-gold-deep text-[36px] sm:text-[44px] md:text-[50px] leading-[1.04] max-w-[420px] text-start md:order-1">
          <span className="block">{t.ctaTitle[0]}</span>
          <span className="block">{t.ctaTitle[1]}</span>
        </h2>
        <Link
          href="mailto:hello@beeri.co.il"
          className="group inline-flex items-center justify-center gap-3 bg-ink border border-ink text-bone rounded-[5px] px-10 sm:px-14 md:px-16 py-5 sm:py-7 md:py-8 text-[13px] sm:text-[14px] font-sans font-bold tracking-[0.08em] hover:bg-clay transition-colors duration-300 self-start md:self-auto md:order-2"
        >
          {t.cta1}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
          >
            <ArrowGlyph
              direction={lang === "he" ? "right-to-left" : "left-to-right"}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
