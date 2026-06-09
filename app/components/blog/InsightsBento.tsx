import Image from "next/image";
import type { Lang } from "@/app/content/home";
import { categoryChipClass, type BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { ArrowGlyph } from "@/app/components/home/icons";
import { Link } from "@/i18n/navigation";

type Labels = Record<BlogCategory, string>;

function Chip({ category, label }: { category: BlogCategory; label: string }) {
  return (
    <span
      className={`${categoryChipClass[category]} inline-flex min-h-6 items-center px-3 py-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em]`}
    >
      {label}
    </span>
  );
}

function ReadRow({ lang, label }: { lang: Lang; label: string }) {
  return (
    <span className="mt-auto flex items-center justify-between border-t border-ink pt-5 font-sans text-[14px] font-bold tracking-[0.07em] text-ink">
      <span className="underline decoration-solid underline-offset-[3px]">{label}</span>
      <ArrowGlyph direction={lang === "he" ? "right-to-left" : "left-to-right"} />
    </span>
  );
}

/** Large feature card with hero image (top-start of the grid). */
function FeatureCard({ post, lang, labels }: CardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      dir={lang === "he" ? "rtl" : "ltr"}
      className="reveal group relative flex flex-col overflow-hidden border border-ink bg-sand focus-ring lg:col-start-1 lg:col-span-8 lg:row-start-1 lg:row-span-2"
    >
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-magenta" aria-hidden />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <Chip category={post.category} label={labels[post.category]} />
          <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-clay">
            {post.read}
          </span>
        </div>
        <h2 className="font-display text-[44px] font-bold leading-[0.92] text-ink sm:text-[64px]">
          {post.title}
        </h2>
        <p className="max-w-[480px] font-sans text-[16px] leading-[1.6] text-clay sm:text-[18px]">
          {post.excerpt}
        </p>
      </div>
      {post.image ? (
        <div className="relative mt-auto aspect-[16/9] border-t border-ink bg-bone">
          <Image src={post.image} alt={post.imageAlt ?? post.title} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover grayscale transition-[filter] group-hover:grayscale-0" />
        </div>
      ) : null}
    </Link>
  );
}

/** Solid-color text card (no image). `accent` picks the surface tint. */
function TextCard({
  post, lang, labels, readLabel, className, surface,
}: CardProps & { className: string; surface: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      dir={lang === "he" ? "rtl" : "ltr"}
      className={`reveal group flex flex-col border border-ink ${surface} p-6 focus-ring sm:p-8 ${className}`}
    >
      <Chip category={post.category} label={labels[post.category]} />
      <h3 className="mt-6 font-display text-[34px] font-bold leading-none text-ink sm:text-[40px]">
        {post.title}
      </h3>
      <p className="mt-4 font-sans text-[15px] leading-[1.6] text-clay">{post.excerpt}</p>
      <ReadRow lang={lang} label={readLabel} />
    </Link>
  );
}

/** Image-led card for the bottom row. */
function ImageCard({ post, lang, labels, readLabel, className }: CardProps & { className: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      dir={lang === "he" ? "rtl" : "ltr"}
      className={`reveal group flex flex-col overflow-hidden border border-ink bg-bone focus-ring ${className}`}
    >
      {post.image ? (
        <div className="relative aspect-[1.5] border-b border-ink bg-ink">
          <Image src={post.image} alt={post.imageAlt ?? post.title} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover grayscale transition-[filter] group-hover:grayscale-0" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <Chip category={post.category} label={labels[post.category]} />
        <h3 className="mt-4 font-display text-[30px] font-bold leading-none text-ink sm:text-[36px]">
          {post.title}
        </h3>
        <ReadRow lang={lang} label={readLabel} />
      </div>
    </Link>
  );
}

type CardProps = {
  post: LocalizedPost;
  lang: Lang;
  labels: Labels;
  readLabel: string;
};

export function InsightsBento({
  posts, lang, labels, readLabel,
}: {
  posts: readonly LocalizedPost[];
  lang: Lang;
  labels: Labels;
  readLabel: string;
}) {
  const [p0, p1, p2, p3, p4, p5] = posts.slice(0, 6);
  const common = { lang, labels, readLabel };
  return (
    <section
      dir="ltr"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:grid-rows-[340px_340px_360px] lg:px-20"
    >
      {p0 ? <FeatureCard post={p0} {...common} /> : null}
      {p1 ? <TextCard post={p1} {...common} surface="bg-mist" className="lg:col-start-9 lg:col-span-4 lg:row-start-1" /> : null}
      {p2 ? <TextCard post={p2} {...common} surface="bg-bone" className="lg:col-start-9 lg:col-span-4 lg:row-start-2" /> : null}
      {p3 ? <ImageCard post={p3} {...common} className="lg:col-start-1 lg:col-span-4 lg:row-start-3" /> : null}
      {p4 ? <TextCard post={p4} {...common} surface="bg-sand" className="lg:col-start-5 lg:col-span-4 lg:row-start-3" /> : null}
      {p5 ? <TextCard post={p5} {...common} surface="bg-bone" className="lg:col-start-9 lg:col-span-4 lg:row-start-3" /> : null}
    </section>
  );
}
