import Image from "next/image";
import Link from "next/link";
import type { AboutCopy } from "@/app/content/about";
import type { CatalogCopy, CatalogItem } from "@/app/content/catalog";
import type { FinishingCopy } from "@/app/content/finishing";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import type { HomeContent } from "@/sanity/queries";
import { aboutImages } from "@/app/content/about";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { PresentationControls } from "./PresentationControls";

type PresentationLabels = {
  label: string;
  start: string;
  previous: string;
  next: string;
  chapter: string;
  exit: string;
  liveExperience: string;
  viewCatalog: string;
  viewFinishing: string;
  switchLanguage: string;
};

const SLIDE_IDS = ["opening", "story", "heritage", "capability", "work", "live"] as const;

function Media({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!src) return <div className={cn("bg-sand", className)} aria-hidden />;
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

function SlideNumber({ number }: { number: string }) {
  return (
    <span className="font-sans text-[11px] font-extrabold tracking-[0.16em] text-current">
      {number}
    </span>
  );
}

function chooseCatalogItems(copy: CatalogCopy): CatalogItem[] {
  const items = copy.categories.flatMap((category) => category.items).filter((item) => item.image);
  const preferredKeys = ["serum", "wine", "whiskey"];
  const preferred = preferredKeys
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is CatalogItem => Boolean(item));
  return preferred.length >= 3 ? preferred : items.slice(0, 3);
}

export function PresentationDeck({
  lang,
  home,
  about,
  finishing,
  catalog,
  chrome,
  labels,
}: {
  lang: Lang;
  home: HomeContent;
  about: AboutCopy;
  finishing: FinishingCopy;
  catalog: CatalogCopy;
  chrome: Chrome;
  labels: PresentationLabels;
}) {
  const direction = lang === "he" ? "rtl" : "ltr";
  const logo = lang === "he" ? chrome.logoHe : chrome.logoEn;
  const storyPanels = home.journeyPanels.slice(0, 2);
  const catalogItems = chooseCatalogItems(catalog);
  const award = catalog.categories.find((category) => category.layout === "modular")?.items[0];
  const otherLang = lang === "he" ? "en" : "he";

  return (
    <main
      id="main"
      data-presentation-deck
      className="h-svh snap-y snap-mandatory overflow-y-auto overflow-x-hidden bg-bone text-ink"
    >
      <section
        id="opening"
        data-presentation-slide
        data-active="true"
        className="presentation-slide relative grid min-h-svh snap-start snap-always place-items-center overflow-hidden px-5 pb-28 pt-16 sm:px-10"
      >
        <Media
          src={home.heroImage}
          alt=""
          sizes="100vw"
          priority
          className="absolute inset-0 presentation-media"
        />
        <div className="absolute inset-0 bg-bone/72" aria-hidden />
        <div className="absolute inset-y-0 start-0 hidden w-2 bg-cyan sm:block" aria-hidden />
        <div className="absolute inset-y-0 end-0 hidden w-2 bg-magenta sm:block" aria-hidden />

        <div data-presentation-reveal className="relative z-10 flex w-full max-w-[1120px] flex-col items-center text-center">
          <Image src={logo} alt={chrome.wordmark} width={250} height={90} className="h-auto w-[180px] sm:w-[240px]" priority />
          <p className="mt-7 bg-yellow px-4 py-2 font-sans text-[11px] font-extrabold uppercase tracking-[0.12em] text-yellow-deep sm:text-[12px]">
            {labels.label}
          </p>
          <h1 className="mt-7 max-w-[980px] font-display text-[clamp(64px,11vw,150px)] leading-[0.72] text-ink">
            {home.copy.h1.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h1>
          <p className="mt-7 max-w-[560px] font-sans text-[16px] leading-7 text-clay sm:text-[19px]">
            {home.copy.eyebrow}
          </p>
          <Link href="#story" className={cn(buttonVariants({ variant: "primary", size: "md" }), "mt-8")}> 
            {labels.start}
            <span aria-hidden>{direction === "rtl" ? "←" : "→"}</span>
          </Link>
        </div>
      </section>

      <section
        id="story"
        data-presentation-slide
        className="presentation-slide min-h-svh snap-start snap-always bg-ink px-4 pb-28 pt-10 text-bone sm:px-8 sm:pt-14"
      >
        <div className="mx-auto flex min-h-[calc(100svh-9.5rem)] w-full max-w-[1320px] flex-col">
          <header data-presentation-reveal className="mb-6 grid items-end gap-4 sm:mb-8 lg:grid-cols-[1fr_0.72fr]">
            <div>
              <div className="flex items-center gap-4 text-yellow">
                <SlideNumber number="02" />
                <span className="h-px w-16 bg-current" aria-hidden />
                <span className="ds-eyebrow">{home.copy.journeyEyebrow}</span>
              </div>
              <h2 className="mt-4 max-w-[760px] font-display text-[clamp(48px,7vw,96px)] leading-[0.82]">
                {home.copy.journeyTitle}
              </h2>
            </div>
            <p className="max-w-[520px] font-sans text-[15px] leading-7 text-bone/70 sm:text-[18px]">
              {home.copy.journeyDesc}
            </p>
          </header>

          <div className="grid flex-1 gap-3 md:grid-cols-2 md:gap-5">
            {storyPanels.map((panel, index) => (
              <article
                key={panel.key}
                data-presentation-reveal
                className="group relative min-h-[260px] overflow-hidden border border-bone/25 md:min-h-0"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <Media src={panel.src} alt={panel.title} sizes="(min-width: 768px) 50vw, 100vw" className="absolute inset-0 presentation-media" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-start sm:p-8">
                  <p className={cn("ds-eyebrow", index === 0 ? "text-purple" : "text-yellow")}>{panel.tag}</p>
                  <h3 className="mt-2 font-display text-[44px] leading-[0.85] sm:text-[60px]">{panel.title}</h3>
                  <p className="mt-3 line-clamp-3 max-w-[520px] font-sans text-[14px] leading-6 text-bone/80 sm:text-[16px]">{panel.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="heritage"
        data-presentation-slide
        className="presentation-slide min-h-svh snap-start snap-always bg-bone px-5 pb-28 pt-10 sm:px-8 sm:pt-14 lg:px-14"
      >
        <div className="mx-auto grid min-h-[calc(100svh-9.5rem)] w-full max-w-[1280px] items-stretch gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div data-presentation-reveal className="relative min-h-[200px] overflow-hidden border border-blueprint sm:min-h-[260px] lg:min-h-0">
            <Media
              src={aboutImages.production.heritageToModern}
              alt={about.heritageImageCaption}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="absolute inset-0 presentation-media"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blueprint/90 via-transparent to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-3 border-t border-bone/30 bg-blueprint/80 text-bone backdrop-blur-sm">
              {about.heritageItems.map((item) => (
                <div key={item.year} className="border-e border-bone/25 p-3 text-start last:border-e-0 sm:p-5">
                  <p className="font-display text-[28px] leading-none text-cyan sm:text-[40px]">{item.year}</p>
                  <p className="mt-1 font-sans text-[10px] font-bold sm:text-[12px]">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-presentation-reveal className="flex flex-col justify-center text-start">
            <div className="flex items-center gap-4 text-magenta-deep">
              <SlideNumber number="03" />
              <span className="h-px w-16 bg-current" aria-hidden />
              <span className="ds-eyebrow">{about.heritageEyebrow}</span>
            </div>
            <h2 className="mt-4 max-w-[720px] font-display text-[clamp(46px,7vw,100px)] leading-[0.8] text-blueprint">
              {about.heritageTitle}
            </h2>
            <p className="mt-5 hidden max-w-[720px] font-sans text-[15px] leading-7 text-clay sm:line-clamp-4 sm:block sm:text-[17px]">
              {about.heritageBody.split("\n\n")[1] ?? about.heritageBody}
            </p>
            <dl className="mt-7 grid grid-cols-2 border-s border-t border-blueprint sm:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.value} className={cn(
                  "min-h-[84px] border-e border-b border-blueprint p-3 sm:min-h-[112px] sm:p-4",
                  stat.tone === "magenta" && "bg-magenta-deep text-bone",
                  stat.tone === "yellow" && "bg-yellow text-yellow-deep",
                )}>
                  <dt className="font-display text-[32px] leading-none sm:text-[40px]">{stat.value}</dt>
                  <dd className="mt-2 font-sans text-[10px] font-bold leading-4 sm:text-[11px]">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section
        id="capability"
        data-presentation-slide
        className="presentation-slide min-h-svh snap-start snap-always bg-blueprint px-5 pb-28 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14"
      >
        <div className="mx-auto grid min-h-[calc(100svh-9.5rem)] w-full max-w-[1320px] grid-rows-[250px_auto] gap-5 sm:grid-rows-[320px_auto] sm:gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:grid-rows-1 lg:gap-10">
          <div data-presentation-reveal className="relative min-h-0 overflow-hidden border border-bone/30">
            <Media src={finishing.feature.image} alt={finishing.feature.title} sizes="(min-width: 1024px) 62vw, 100vw" className="absolute inset-0 presentation-media" />
            <span className="absolute start-0 top-0 z-10 bg-yellow px-4 py-2 font-sans text-[11px] font-extrabold uppercase tracking-[0.1em] text-yellow-deep">
              {finishing.feature.sample}
            </span>
          </div>

          <div data-presentation-reveal className="flex flex-col justify-center text-start">
            <div className="flex items-center gap-4 text-cyan">
              <SlideNumber number="04" />
              <span className="h-px w-16 bg-current" aria-hidden />
              <span className="ds-eyebrow">{finishing.feature.eyebrow}</span>
            </div>
            <h2 className="mt-4 font-display text-[clamp(52px,6.5vw,96px)] leading-[0.8]">{finishing.feature.title}</h2>
            <p className="mt-4 line-clamp-3 font-sans text-[14px] leading-6 text-bone/75 sm:mt-5 sm:text-[17px] sm:leading-7 lg:line-clamp-none">{finishing.feature.body}</p>
            <dl className="mt-7 border-t border-bone/30">
              {finishing.metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-4 border-b border-bone/30 py-2 sm:py-3">
                  <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-bone/55">{metric.label}</dt>
                  <dd className="font-display text-[24px] leading-none text-cyan">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <blockquote className="mt-6 hidden border-s-4 border-magenta ps-5 font-sans text-[14px] leading-6 text-bone/80 sm:block">
              {finishing.quote}
            </blockquote>
          </div>
        </div>
      </section>

      <section
        id="work"
        data-presentation-slide
        className="presentation-slide min-h-svh snap-start snap-always bg-bone px-5 pb-28 pt-10 sm:px-8 sm:pt-14 lg:px-14"
      >
        <div className="mx-auto flex min-h-[calc(100svh-9.5rem)] w-full max-w-[1320px] flex-col">
          <header data-presentation-reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-4 text-teal">
                <SlideNumber number="05" />
                <span className="h-px w-16 bg-current" aria-hidden />
                <span className="ds-eyebrow">{catalog.eyebrow}</span>
              </div>
              <h2 className="mt-3 font-display text-[clamp(52px,7vw,96px)] leading-[0.78] text-blueprint">
                {catalog.title.map((line) => <span key={line} className="block">{line}</span>)}
              </h2>
            </div>
            <Link href={`/${lang}/catalog`} className={buttonVariants({ variant: "secondary", size: "sm" })}>{labels.viewCatalog}</Link>
          </header>

          <div className="mt-6 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {catalogItems.map((item, index) => (
              <article
                key={item.key}
                data-presentation-reveal
                className={cn("group relative min-h-[280px] overflow-hidden border border-ink", index === 2 && "hidden sm:block")}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <Media src={item.image} alt={item.name} sizes="(min-width: 640px) 33vw, 50vw" className="absolute inset-0 presentation-media" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-start text-bone sm:p-6">
                  <h3 className="font-display text-[34px] leading-[0.85] sm:text-[50px]">{item.name}</h3>
                  <p className="mt-2 hidden font-sans text-[13px] leading-5 text-bone/75 lg:line-clamp-2">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          {award ? (
            <div data-presentation-reveal className="mt-4 grid items-center gap-3 border border-ink bg-yellow p-4 text-start sm:grid-cols-[1fr_auto] sm:p-5">
              <div>
                <p className="ds-eyebrow text-ink">{award.specs?.[0]?.value}</p>
                <h3 className="mt-1 font-display text-[34px] leading-none text-yellow-deep sm:text-[46px]">{award.name}</h3>
              </div>
              <div className="flex flex-wrap gap-5">
                {award.specs?.slice(1).map((spec) => (
                  <div key={spec.label}>
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-ink">{spec.label}</p>
                    <p className="font-display text-[22px] leading-none text-yellow-deep">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section
        id="live"
        data-presentation-slide
        className="presentation-slide relative grid min-h-svh snap-start snap-always place-items-center overflow-hidden bg-yellow px-5 pb-28 pt-16 sm:px-10"
      >
        <div className="absolute start-0 top-0 h-3 w-1/4 bg-cyan" aria-hidden />
        <div className="absolute start-1/4 top-0 h-3 w-1/4 bg-purple" aria-hidden />
        <div className="absolute start-2/4 top-0 h-3 w-1/4 bg-magenta" aria-hidden />
        <div className="absolute start-3/4 top-0 h-3 w-1/4 bg-blueprint" aria-hidden />

        <div data-presentation-reveal className="mx-auto flex w-full max-w-[1080px] flex-col items-center text-center">
          <div className="flex items-center gap-4 text-ink">
            <SlideNumber number="06" />
            <span className="h-px w-16 bg-current" aria-hidden />
            <span className="ds-eyebrow">{labels.liveExperience}</span>
          </div>
          <h2 className="mt-7 max-w-[980px] font-display text-[clamp(64px,10vw,140px)] leading-[0.72] text-yellow-deep">
            {home.copy.ctaTitle.map((line) => <span key={line} className="block">{line}</span>)}
          </h2>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href={`/${lang}`} className={buttonVariants({ variant: "primary", size: "md" })}>{labels.exit}</Link>
            <Link href={`/${lang}/catalog`} className={buttonVariants({ variant: "secondary", size: "md" })}>{labels.viewCatalog}</Link>
            <Link href={`/${lang}/finishing`} className={buttonVariants({ variant: "secondary", size: "md" })}>{labels.viewFinishing}</Link>
          </div>

          <Link href={`/${otherLang}/presentation`} className="mt-7 font-sans text-[12px] font-extrabold tracking-[0.08em] text-yellow-deep underline underline-offset-4 focus-ring">
            {labels.switchLanguage}
          </Link>

          <nav aria-label={chrome.footerNavHeading} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-yellow-deep/25 pt-5">
            {chrome.navLinks.map((link) => (
              <Link key={link.href} href={`/${lang}${link.href}`} className="font-sans text-[12px] font-bold text-yellow-deep/70 hover:text-yellow-deep focus-ring">
                {link[lang]}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <PresentationControls
        slideIds={SLIDE_IDS}
        labels={{ previous: labels.previous, next: labels.next, chapter: labels.chapter, exit: labels.exit }}
        exitHref={`/${lang}`}
        direction={direction}
      />
    </main>
  );
}
