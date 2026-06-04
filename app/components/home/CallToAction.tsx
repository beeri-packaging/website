import Link from "next/link";
import type { HomeCopy, Lang } from "@/app/content/home";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
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
          className={cn(buttonVariants({ variant: "solid", size: "lg" }), "group self-start md:self-auto md:order-2")}
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
