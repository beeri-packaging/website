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

export function BlogIndex({
  copy,
  posts,
  labels,
  lang,
}: {
  copy: BlogIndexCopy;
  posts: readonly LocalizedPost[];
  labels: Record<BlogCategory, string>;
  lang: Lang;
}) {
  return (
    <section className="relative overflow-clip">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-24 md:py-32 lg:py-36">
        <div className="grid grid-cols-12 gap-8 md:gap-12 items-end">
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
              className="font-display text-ink text-[26px] sm:text-[32px] md:text-[38px] leading-[1.05] max-w-[640px] animate-rise"
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
          </div>

          <div
            className="col-span-12 lg:col-span-4 hidden lg:block animate-rise"
            style={{ animationDelay: "200ms" }}
            aria-hidden
          >
            <span
              className="block font-display font-bold leading-none select-none text-end"
              style={{
                fontSize: "clamp(140px, 16vw, 240px)",
                WebkitTextStroke: "1.5px var(--ink)",
                color: "transparent",
              }}
            >
              01
            </span>
          </div>
        </div>

        <p
          className="mt-12 font-sans uppercase text-clay text-[11px] tracking-[0.08em] leading-4 border-t border-rule pt-6 animate-rise"
          style={{ animationDelay: "400ms" }}
        >
          {copy.comingSoon}
        </p>

        <ul className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {posts.map((post, i) => {
            return (
              <li key={post.slug} className="flex">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex w-full flex-col gap-5 rounded-[6px] border border-rule bg-sand/40 p-6 sm:p-7 md:p-8 transition-colors duration-300 hover:bg-sand focus-ring"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] ${categoryChipClass[post.category]}`}
                    >
                      {labels[post.category]}
                    </span>
                    <span className="font-sans tabular-nums uppercase text-clay text-[11px] tracking-[0.06em]">
                      0{i + 1}
                    </span>
                  </div>

                  <h2 className="font-display text-ink text-[34px] sm:text-[40px] md:text-[46px] leading-[0.98]">
                    {post.title}
                  </h2>

                  <p className="font-sans text-clay text-[15px] sm:text-[16px] leading-[1.65]">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-rule/70">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans uppercase text-clay text-[11px] tracking-[0.08em]">
                        {formatDate(post.date, lang)}
                      </span>
                      <span className="font-sans text-clay/80 text-[12px]">
                        {post.read}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 font-sans font-bold uppercase text-ink text-[12px] tracking-[0.08em] transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1">
                      {copy.readMore}
                      <ArrowGlyph
                        direction={lang === "he" ? "right-to-left" : "left-to-right"}
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
