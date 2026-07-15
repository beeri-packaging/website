import Link from "next/link";
import type { Lang } from "@/app/content/home";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { PresentationControls } from "./PresentationControls";

type PresentationLabels = {
  previous: string;
  next: string;
  chapter: string;
  exit: string;
  openPage: string;
  pages: {
    home: string;
    about: string;
    catalog: string;
    finishing: string;
    journal: string;
  };
};

const SLIDES = [
  { id: "home", path: "" },
  { id: "about", path: "/about" },
  { id: "catalog", path: "/catalog" },
  { id: "finishing", path: "/finishing" },
  { id: "journal", path: "/blog" },
] as const;

const SLIDE_IDS = SLIDES.map((slide) => slide.id);

const STAGE_TONES = [
  "bg-ink text-bone",
  "bg-bone text-ink",
  "bg-blueprint text-bone",
  "bg-yellow text-ink",
  "bg-magenta-deep text-bone",
] as const;

function BrowserPreview({
  href,
  title,
  loading,
}: {
  href: string;
  title: string;
  loading: "eager" | "lazy";
}) {
  return (
    <div
      data-presentation-reveal
      className="presentation-browser flex min-h-0 flex-1 flex-col overflow-hidden border border-ink bg-bone shadow-[7px_7px_0_0_var(--ink)] sm:shadow-[12px_12px_0_0_var(--ink)]"
    >
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-ink bg-bone px-3 text-ink sm:h-12 sm:px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full border border-ink bg-magenta sm:size-3" />
          <span className="size-2.5 rounded-full border border-ink bg-yellow sm:size-3" />
          <span className="size-2.5 rounded-full border border-ink bg-cyan sm:size-3" />
        </div>
        <div className="min-w-0 flex-1 truncate border border-ink/25 bg-white px-3 py-1 font-sans text-[10px] font-semibold text-clay sm:text-[12px]">
          beeripacks.co.il{href}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-white">
        <iframe
          src={href}
          title={title}
          loading={loading}
          className="absolute inset-0 size-full border-0 bg-white"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" aria-hidden />
      </div>
    </div>
  );
}

export function PresentationDeck({
  lang,
  labels,
}: {
  lang: Lang;
  labels: PresentationLabels;
}) {
  const direction = lang === "he" ? "rtl" : "ltr";

  return (
    <main
      id="main"
      data-presentation-deck
      className="h-svh snap-y snap-mandatory overflow-y-auto overflow-x-hidden bg-bone text-ink"
    >
      {SLIDES.map((slide, index) => {
        const href = `/${lang}${slide.path}`;
        const title = labels.pages[slide.id];

        return (
          <section
            key={slide.id}
            id={slide.id}
            data-presentation-slide
            data-active={index === 0 ? "true" : undefined}
            className={cn(
              "presentation-slide h-svh snap-start snap-always overflow-hidden px-4 pb-24 pt-5 sm:px-8 sm:pb-28 sm:pt-7 lg:px-12",
              STAGE_TONES[index],
            )}
          >
            <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col">
              <header data-presentation-reveal className="mb-3 flex shrink-0 items-end justify-between gap-4 sm:mb-5">
                <div className="flex min-w-0 items-end gap-3 sm:gap-5">
                  <span className="font-sans text-[11px] font-extrabold tracking-[0.16em] sm:text-[12px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index === 0 ? (
                    <h1 className="truncate font-display text-[42px] leading-none sm:text-[64px] lg:text-[76px]">
                      {title}
                    </h1>
                  ) : (
                    <h2 className="truncate font-display text-[42px] leading-none sm:text-[64px] lg:text-[76px]">
                      {title}
                    </h2>
                  )}
                </div>

                <Link
                  href={href}
                  className={cn(
                    buttonVariants({ variant: index === 1 || index === 3 ? "primary" : "cyan", size: "sm" }),
                    "hidden shrink-0 sm:inline-flex",
                  )}
                >
                  {labels.openPage}
                  <span aria-hidden>{direction === "rtl" ? "↗" : "↗"}</span>
                </Link>
              </header>

              <BrowserPreview href={href} title={title} loading={index === 0 ? "eager" : "lazy"} />
            </div>
          </section>
        );
      })}

      <PresentationControls
        slideIds={SLIDE_IDS}
        labels={{ previous: labels.previous, next: labels.next, chapter: labels.chapter, exit: labels.exit }}
        exitHref={`/${lang}`}
        direction={direction}
      />
    </main>
  );
}
