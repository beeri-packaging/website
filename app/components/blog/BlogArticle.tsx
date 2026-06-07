import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Lang } from "@/app/content/home";
import {
  categoryChipClass,
  type BlogIndexCopy,
  type BlogCategory,
} from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { ArrowGlyph } from "@/app/components/home/icons";

// Small bilingual UI labels that aren't part of the editorial content.
const UI = {
  he: {
    writtenBy: "נכתב על ידי",
    photography: "צילום",
    readingTime: "זמן קריאה",
    moreFromBlog: "עוד מהבלוג",
    allPosts: "לכל הכתבות",
    studio: "סטודיו בארי",
  },
  en: {
    writtenBy: "Written by",
    photography: "Photography",
    readingTime: "Reading time",
    moreFromBlog: "More from the journal",
    allPosts: "All posts",
    studio: "Beeri Studio",
  },
} as const;

function year(iso: string): string {
  const y = new Date(iso).getFullYear();
  return Number.isNaN(y) ? "" : String(y);
}

// ── Metadata sidebar — author / credit / read time ───────────────────────────
function MetaSidebar({
  post,
  lang,
}: {
  post: LocalizedPost;
  lang: Lang;
}) {
  const t = UI[lang];
  const rows: { label: string; value: string }[] = [
    { label: t.writtenBy, value: post.author ?? t.studio },
    ...(post.credit ? [{ label: t.photography, value: post.credit }] : []),
    { label: t.readingTime, value: post.read },
  ];
  return (
    <aside className="flex flex-col gap-8 border-t border-ink pt-8 lg:sticky lg:top-28">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-clay">
            {row.label}
          </span>
          <span className="font-display text-kicker font-bold tracking-[0.04em] text-ink">
            {row.value}
          </span>
        </div>
      ))}
    </aside>
  );
}

// ── Pull-quote + image row ───────────────────────────────────────────────────
function QuoteBlock({ post }: { post: LocalizedPost }) {
  if (!post.quote) return null;
  return (
    <div className="flex flex-col items-stretch gap-8 pt-6 sm:flex-row-reverse sm:items-center">
      {post.quoteImage ? (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden border border-ink bg-sand sm:w-[44%]">
          <Image
            src={post.quoteImage}
            alt={post.quoteImageAlt ?? post.title}
            fill
            sizes="(min-width: 640px) 44vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <blockquote className="flex flex-1 flex-col gap-4 border-s-4 border-yellow ps-6 text-start sm:ps-9">
        <p className="font-sans text-[24px] font-extrabold leading-[25px] text-ink">
          {post.quote.text}
        </p>
        {post.quote.cite ? (
          <cite className="font-sans text-[20px] not-italic text-magenta">
            {post.quote.cite}
          </cite>
        ) : null}
      </blockquote>
    </div>
  );
}

// ── Numbered article section ─────────────────────────────────────────────────
function Section({
  section,
  index,
}: {
  section: NonNullable<LocalizedPost["sections"]>[number];
  index: number;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-h2 text-ink">
        <span className="text-cyan">{`0${index + 1}.`}</span>{" "}
        {section.heading}
      </h2>
      <p className="font-sans text-[16px] font-light leading-[1.6] text-ink/90">
        {section.body}
      </p>
      {section.image ? (
        <div className="relative mt-2 aspect-[16/9] w-full overflow-hidden border border-ink bg-sand">
          <Image
            src={section.image}
            alt={section.imageAlt ?? section.heading}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

// ── Related-post card ────────────────────────────────────────────────────────
function RelatedCard({
  post,
  index,
  label,
  dark,
}: {
  post: LocalizedPost;
  index: number;
  label: string;
  dark: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-4 overflow-hidden rounded-bl-[10px] rounded-br-[40px] rounded-tl-[40px] rounded-tr-[10px] border border-ink p-6 transition-colors duration-300 focus-ring sm:p-8 ${
        dark ? "bg-purple text-bone hover:bg-purple/90" : "bg-bone text-ink hover:bg-sand"
      }`}
    >
      <span
        className={`font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] ${
          dark ? "text-bone/80" : "text-magenta"
        }`}
      >
        {label} / 0{index + 1}
      </span>
      <h3
        className={`font-display text-h2 text-balance leading-[0.95] ${
          dark ? "text-bone" : "text-ink"
        }`}
      >
        {post.title}
      </h3>
      <p
        className={`font-sans text-[15px] font-light leading-[1.55] ${
          dark ? "text-bone/90" : "text-ink/70"
        }`}
      >
        {post.excerpt}
      </p>
      {post.image ? (
        <div
          className={`relative mt-auto aspect-[16/10] w-full overflow-hidden border ${
            dark ? "border-bone" : "border-ink"
          }`}
        >
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
    </Link>
  );
}

export function BlogArticle({
  post,
  related,
  labels,
  lang,
}: {
  post: LocalizedPost;
  related: readonly LocalizedPost[];
  copy: BlogIndexCopy;
  labels: Record<BlogCategory, string>;
  lang: Lang;
}) {
  const t = UI[lang];
  const badge = `${labels[post.category]}${
    year(post.date) ? ` / ${year(post.date)}` : ""
  }`;

  return (
    <article className="relative overflow-clip">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16 lg:py-28">
        {/* ── Hero: asymmetric editorial ──────────────────────────────── */}
        <header className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 text-start">
            <span
              className={`inline-flex w-fit items-center px-3 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] ${categoryChipClass[post.category]}`}
            >
              {badge}
            </span>
            <h1 className="font-display text-h1 text-balance text-logo-dark">{post.title}</h1>
            <p className="max-w-[640px] font-sans text-[20px] font-extrabold leading-[1.08] text-clay sm:text-[24px]">
              {post.excerpt}
            </p>
          </div>

          {post.image ? (
            <div className="relative w-full sm:w-[46%] sm:self-end">
              {/* Floating brand accent — yellow square layered over magenta (Figma 531:532). */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -start-6 z-0 block h-20 w-20 sm:h-24 sm:w-24"
              >
                <span className="absolute inset-0 -translate-x-1.5 translate-y-1.5 bg-magenta" />
                <span className="absolute inset-0 bg-yellow" />
              </span>
              <div className="relative z-10 aspect-[3/2] w-full overflow-hidden border border-ink bg-sand">
                <Image
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  fill
                  priority
                  sizes="(min-width: 640px) 46vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </header>

        {/* ── Body: content canvas (reading-start) + metadata sidebar ───
             Figma 473:471 — in RTL the article reads on the start (right)
             edge and the metadata sits at the end (left). Explicit column
             placement mirrors with `dir` and keeps both on row 1. */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <MetaSidebar post={post} lang={lang} />
          </div>

          <div className="flex flex-col gap-10 lg:col-span-7 lg:col-start-2 lg:row-start-1">
            <div className="flex flex-col gap-5">
              {post.body.map((p, i) => (
                <p
                  key={i}
                  className="font-sans text-[16px] font-light leading-[1.6] text-ink"
                >
                  {p}
                </p>
              ))}
            </div>

            <QuoteBlock post={post} />

            {post.sections?.map((s, i) => (
              <Section key={i} section={s} index={i} />
            ))}
          </div>
        </div>

        {/* ── More to explore: related posts ──────────────────────────── */}
        {related.length > 0 ? (
          <div className="mt-20 flex flex-col gap-10 sm:mt-28">
            <div className="flex items-end justify-between gap-6 border-b border-ink pb-4">
              <h2 className="font-display text-h1 text-ink">
                {t.moreFromBlog}
              </h2>
              <Link
                href="/careers"
                className="group inline-flex items-center gap-2 pb-2 font-sans text-[14px] font-bold uppercase tracking-[0.08em] text-magenta underline decoration-from-font underline-offset-2 transition-colors duration-300 hover:text-ink focus-ring"
              >
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                >
                  <ArrowGlyph
                    direction={lang === "he" ? "right-to-left" : "left-to-right"}
                  />
                </span>
                {t.allPosts}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((rp, i) => (
                <RelatedCard
                  key={rp.slug}
                  post={rp}
                  index={i}
                  label={labels[rp.category]}
                  dark={i === 1}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
