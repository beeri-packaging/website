import Link from "next/link";
import type { Lang } from "@/app/content/home";
import {
  categoryChipClass,
  type BlogIndexCopy,
  type BlogCategory,
} from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { ArrowGlyph } from "@/app/components/home/icons";

function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  return date.toLocaleDateString(lang === "he" ? "he-IL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPostHero({
  post,
  copy,
  labels,
  lang,
}: {
  post: LocalizedPost;
  copy: BlogIndexCopy;
  labels: Record<BlogCategory, string>;
  lang: Lang;
}) {
  return (
    <article className="relative">
      <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 md:px-10 py-12 sm:py-20 md:py-28">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-sans uppercase text-clay text-[12px] tracking-[0.08em] hover:text-ink transition-colors duration-300 focus-ring"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:translate-x-1 ltr:group-hover:-translate-x-1"
          >
            <ArrowGlyph
              direction={lang === "he" ? "left-to-right" : "right-to-left"}
            />
          </span>
          {copy.backToBlog}
        </Link>

        <header className="mt-10 sm:mt-14 flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] ${categoryChipClass[post.category]}`}
            >
              {labels[post.category]}
            </span>
            <span className="font-sans uppercase text-clay text-[11px] tracking-[0.08em]">
              {copy.publishedOn} · {formatDate(post.date, lang)}
            </span>
            <span className="font-sans text-clay/80 text-[12px]">
              · {post.read}
            </span>
          </div>

          <h1
            className="font-display font-bold text-ink leading-[0.92] animate-rise"
            style={{
              fontSize: "clamp(40px, 7vw, 88px)",
            }}
          >
            {post.title}
          </h1>

          <p
            className="font-display text-ink/80 text-[22px] sm:text-[26px] leading-[1.2] max-w-[680px] animate-rise"
            style={{ animationDelay: "120ms" }}
          >
            {post.excerpt}
          </p>
        </header>

        <div className="mt-10 sm:mt-14 h-px bg-rule" />

        <div className="mt-10 sm:mt-14 flex flex-col gap-6 sm:gap-7">
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className="font-sans text-ink/90 text-[17px] sm:text-[18px] leading-[1.75]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14 sm:mt-20 pt-10 border-t border-rule flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans font-bold uppercase text-ink text-[12px] tracking-[0.08em] hover:text-clay transition-colors duration-300 focus-ring"
          >
            <span aria-hidden>
              <ArrowGlyph
                direction={lang === "he" ? "left-to-right" : "right-to-left"}
              />
            </span>
            {copy.backToBlog}
          </Link>
          <Link
            href="/#cta"
            className="group inline-flex items-center justify-center gap-3 bg-ink border border-ink text-bone rounded-[5px] px-8 py-4 text-[13px] font-sans font-bold tracking-[0.08em] hover:bg-clay transition-colors duration-300 focus-ring"
          >
            {lang === "he" ? "התחלת תהליך" : "Start a project"}
            <span aria-hidden>
              <ArrowGlyph
                direction={lang === "he" ? "right-to-left" : "left-to-right"}
              />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
