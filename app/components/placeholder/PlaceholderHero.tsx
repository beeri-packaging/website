import Link from "next/link";
import type { PlaceholderCopy } from "@/app/content/placeholder";
import type { Lang } from "@/app/content/home";
import { ArrowGlyph } from "@/app/components/home/icons";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";

/**
 * Editorial "chapter-cover" hero used by every placeholder route. The huge
 * stenciled "SOON" / "בקרוב" mark on one side keeps the layout calm without
 * leaning on a stock image. Preview chips below hint at what the page will
 * eventually cover.
 */
export function PlaceholderHero({ copy, lang }: { copy: PlaceholderCopy; lang: Lang }) {
  const soonMark = lang === "he" ? "בקרוב" : "Soon";

  return (
    <section className="relative overflow-clip">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="grid grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-7 sm:gap-9">
            <div className="bg-yellow inline-flex items-start self-start px-3 py-1 animate-rise">
              <span className="font-sans text-cyan-deep text-[10.5px] sm:text-[12px] tracking-[0.08em] leading-4 uppercase">
                {copy.eyebrow}
              </span>
            </div>

            <h1
              className="font-display font-bold text-ink leading-[0.86] sm:leading-[0.78] animate-rise"
              style={{
                animationDelay: "120ms",
                fontSize: "clamp(56px, 11vw, 152px)",
              }}
            >
              {copy.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="font-display text-ink text-[28px] sm:text-[34px] md:text-[40px] leading-[1.05] max-w-[640px] animate-rise"
              style={{ animationDelay: "240ms" }}
            >
              {copy.lead}
            </p>

            <p
              className="font-sans text-clay text-[16px] sm:text-[17px] leading-[1.7] max-w-[560px] animate-rise"
              style={{ animationDelay: "320ms" }}
            >
              {copy.body}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 animate-rise"
              style={{ animationDelay: "400ms" }}
            >
              <ContactTriggerButton
                className="group inline-flex items-center justify-center gap-3 bg-ink border border-ink text-bone rounded-[5px] px-8 sm:px-10 py-4 sm:py-5 text-[13px] sm:text-[14px] font-sans font-bold tracking-[0.08em] hover:bg-bone hover:text-ink transition-colors duration-300 focus-ring"
              >
                {copy.ctaPrimary}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                >
                  <ArrowGlyph
                    direction={lang === "he" ? "right-to-left" : "left-to-right"}
                  />
                </span>
              </ContactTriggerButton>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-ink text-ink rounded-[5px] px-8 sm:px-10 py-4 sm:py-5 text-[13px] sm:text-[14px] font-sans font-bold tracking-[0.08em] hover:bg-ink hover:text-bone transition-colors duration-300 focus-ring"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>

          <div
            className="col-span-12 lg:col-span-4 relative hidden lg:flex items-center justify-end animate-rise"
            style={{ animationDelay: "200ms" }}
            aria-hidden
          >
            <span
              className="font-display font-bold text-ink leading-none select-none"
              style={{
                fontSize: "clamp(140px, 18vw, 260px)",
                WebkitTextStroke: "1.5px var(--ink)",
                color: "transparent",
              }}
            >
              {soonMark}
            </span>
          </div>
        </div>

        <div
          className="mt-16 sm:mt-20 md:mt-24 pt-10 border-t border-rule animate-rise"
          style={{ animationDelay: "480ms" }}
        >
          <span className="font-sans uppercase text-clay text-[11px] tracking-[0.08em] leading-4">
            {lang === "he" ? "מה צפוי כאן" : "What's coming"}
          </span>
          <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            {copy.preview.map((item) => (
              <li
                key={item}
                className="inline-flex items-center rounded-full border border-rule bg-sand/70 px-4 py-2 font-sans text-[12px] sm:text-[13px] text-clay tracking-[0.02em]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
