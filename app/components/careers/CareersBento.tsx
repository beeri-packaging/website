import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CareersArticle } from "@/app/content/careers";
import type { Lang } from "@/app/content/home";
import { ArrowGlyph, PrintRulerGlyph } from "@/app/components/home/icons";

/** Small vertical flag/ribbon marker hung from a card's top-start edge. */
function RibbonFlag({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className={`absolute top-0 start-6 z-10 h-7 w-[15px] ${color} [clip-path:polygon(0_0,100%_0,100%_100%,50%_70%,0_100%)]`}
    />
  );
}

function ArticleTag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "cyan" | "dark" | "magenta" | "outline";
}) {
  const className = {
    cyan: "bg-cyan text-cyan-deep",
    dark: "bg-blueprint text-bone",
    magenta: "bg-magenta text-bone",
    outline: "border border-purple bg-bone text-purple",
  }[tone];

  return (
    <span
      className={`${className} inline-flex min-h-6 items-center px-3 py-1 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em]`}
    >
      {children}
    </span>
  );
}

function FeatureArticle({ article, lang }: { article: CareersArticle; lang: Lang }) {
  return (
    <article
      dir={lang === "he" ? "rtl" : "ltr"}
      className="relative overflow-hidden border border-ink bg-sand lg:col-start-1 lg:col-span-8 lg:row-start-1 lg:row-span-2 lg:h-full"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-magenta" aria-hidden />
      <RibbonFlag color="bg-magenta" />
      <div className="flex min-h-[640px] flex-col justify-between p-6 sm:p-8 lg:h-full lg:min-h-0">
        <div>
          <div className="flex items-center justify-between gap-4">
            <ArticleTag tone="magenta">{article.tag}</ArticleTag>
            {article.meta ? (
              <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-clay">
                {article.meta}
              </span>
            ) : null}
          </div>

          <h2 className="mt-16 max-w-[620px] font-display text-[58px] font-bold leading-[0.9] text-ink sm:text-[78px] lg:text-[92px]">
            {article.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {article.body ? (
            <p className="mt-9 max-w-[430px] font-sans text-[16px] leading-[1.65] text-clay sm:text-[18px]">
              {article.body}
            </p>
          ) : null}
        </div>

        {article.image ? (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden border border-ink bg-bone">
            <Image
              src={article.image}
              alt={article.title.join(" ")}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function PlainArticle({ article, lang }: { article: CareersArticle; lang: Lang }) {
  return (
    <article
      dir={lang === "he" ? "rtl" : "ltr"}
      className="relative border border-ink bg-mist p-6 sm:p-8 lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:h-full"
    >
      <RibbonFlag color="bg-cyan" />
      <ArticleTag tone="cyan">{article.tag}</ArticleTag>
      <h2 className="mt-12 font-display text-[52px] font-bold leading-none text-ink sm:text-[64px]">
        {article.title.join(" ")}
      </h2>
      {article.body ? (
        <p className="mt-6 max-w-[300px] font-sans text-[15px] leading-[1.65] text-clay">
          {article.body}
        </p>
      ) : null}
      {article.cta ? (
        <Link
          href="/blog/finishing-language"
          className="mt-9 flex items-center justify-between border-t border-ink pt-5 font-sans text-[14px] font-bold tracking-[0.07em] text-ink focus-ring"
        >
          <span className="underline decoration-solid underline-offset-[3px]">
            {article.cta}
          </span>
          <ArrowGlyph direction={lang === "he" ? "right-to-left" : "left-to-right"} />
        </Link>
      ) : null}
    </article>
  );
}

function YellowArticle({ article, lang }: { article: CareersArticle; lang: Lang }) {
  return (
    <article
      dir={lang === "he" ? "rtl" : "ltr"}
      className="relative overflow-hidden border border-ink bg-yellow p-6 sm:p-8 lg:col-start-9 lg:col-span-4 lg:row-start-2 lg:h-full"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,var(--clay)_2px,transparent_2px)] [background-size:96px_96px]"
      />
      <RibbonFlag color="bg-logo-dark" />
      <div className="relative flex min-h-[330px] flex-col justify-between lg:h-full">
        <div>
          <ArticleTag tone="dark">{article.tag}</ArticleTag>
          <h2 className="mt-12 font-display text-[54px] font-bold leading-[0.9] text-ink sm:text-[64px]">
            {article.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <div className="mt-6 text-ink">
          <PrintRulerGlyph />
        </div>
      </div>
    </article>
  );
}

function ImageArticle({ article, lang }: { article: CareersArticle; lang: Lang }) {
  return (
    <article
      dir={lang === "he" ? "rtl" : "ltr"}
      className="overflow-hidden border border-ink bg-bone lg:col-start-1 lg:col-span-4 lg:row-start-3 lg:row-span-2 lg:flex lg:h-full lg:flex-col"
    >
      {article.image ? (
        <div className="relative aspect-[1.08] bg-ink lg:aspect-auto lg:flex-1">
          <Image
            src={article.image}
            alt={article.title.join(" ")}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        <ArticleTag tone="outline">{article.tag}</ArticleTag>
        <h2 className="mt-5 font-display text-[48px] font-bold leading-none text-ink sm:text-[56px]">
          {article.title.join(" ")}
        </h2>
        {article.body ? (
          <p className="mt-5 max-w-[280px] font-sans text-[15px] leading-[1.65] text-clay">
            {article.body}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function WideArticle({ article, lang }: { article: CareersArticle; lang: Lang }) {
  return (
    <article
      dir={lang === "he" ? "rtl" : "ltr"}
      className="grid gap-8 border border-ink bg-bone p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center lg:col-start-5 lg:col-span-8 lg:row-start-3 lg:h-full"
    >
      <div>
        <p className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-magenta">
          {article.tag}
        </p>
        <h2 className="mt-3 font-display text-[48px] font-bold leading-[0.92] text-ink sm:text-[64px]">
          {article.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        {article.body ? (
          <p className="mt-5 max-w-[430px] font-sans text-[15px] leading-[1.65] text-clay">
            {article.body}
          </p>
        ) : null}
      </div>
      {article.cta ? (
        <Link
          href="/finishing"
          className="inline-flex items-center justify-center gap-3 border border-ink bg-magenta px-8 py-4 font-sans text-[14px] font-bold tracking-[0.07em] text-bone transition-colors hover:bg-ink focus-ring"
        >
          <ArrowGlyph direction={lang === "he" ? "right-to-left" : "left-to-right"} />
          {article.cta}
        </Link>
      ) : null}
    </article>
  );
}

function BentoArticle({
  article,
  lang,
}: {
  article: CareersArticle;
  lang: Lang;
}) {
  if (article.theme === "feature") {
    return <FeatureArticle article={article} lang={lang} />;
  }

  if (article.theme === "plain") {
    return <PlainArticle article={article} lang={lang} />;
  }

  if (article.theme === "yellow") {
    return <YellowArticle article={article} lang={lang} />;
  }

  if (article.theme === "image") {
    return <ImageArticle article={article} lang={lang} />;
  }

  return <WideArticle article={article} lang={lang} />;
}

export function CareersBento({
  articles,
  lang,
}: {
  articles: readonly CareersArticle[];
  lang: Lang;
}) {
  return (
    <section
      dir="ltr"
      className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 pb-24 sm:px-8 md:px-12 lg:grid-cols-12 lg:grid-rows-[482px_456px_300px_300px] lg:px-20"
    >
      {articles.map((article) => (
        <BentoArticle
          key={`${article.theme}-${article.title.join("-")}`}
          article={article}
          lang={lang}
        />
      ))}
    </section>
  );
}
