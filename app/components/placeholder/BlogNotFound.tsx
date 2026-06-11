import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { BlogIndexCopy } from "@/app/content/blog";
import { ArrowGlyph } from "@/app/components/home/icons";

export function BlogNotFound({ copy, lang }: { copy: BlogIndexCopy; lang: Lang }) {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8 py-20 sm:py-28 md:py-36 flex flex-col gap-8 items-start">
        <span className="bg-yellow inline-flex items-start px-3 py-1">
          <span className="font-sans text-cyan-deep text-[11px] tracking-[0.08em] leading-4 uppercase">
            404 · placeholder
          </span>
        </span>
        <h1
          className="font-display font-bold text-ink leading-[0.92]"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
        >
          {copy.notFoundTitle}
        </h1>
        <p className="font-sans text-clay text-[17px] leading-[1.7] max-w-[560px]">
          {copy.notFoundBody}
        </p>
        <Link
          href={`/${lang}/blog`}
          className="group inline-flex items-center gap-3 bg-ink text-bone rounded-[5px] px-8 py-4 text-[13px] font-sans font-bold tracking-[0.08em] hover:bg-clay transition-colors duration-300 focus-ring"
        >
          {copy.backToBlog}
          <span aria-hidden>
            <ArrowGlyph
              direction={lang === "he" ? "right-to-left" : "left-to-right"}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
