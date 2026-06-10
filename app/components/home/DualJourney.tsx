"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { HomeCopy, Lang } from "@/app/content/home";
import type { HomeJourneyPanel } from "@/sanity/queries";
import { createRevealObserver } from "@/lib/revealObserver";
import { ArrowRtl } from "./icons";

export function DualJourney({ lang, t, panels }: { lang: Lang; t: HomeCopy; panels: readonly HomeJourneyPanel[] }) {
  const stackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Add `is-visible` to each card once it intersects the viewport.
    // We do this with IntersectionObserver instead of CSS scroll-driven
    // animations because view() timelines freeze when their element gets
    // pinned by position: sticky, leaving cards stuck at opacity 0.
    const stack = stackRef.current;
    if (!stack) return;
    const cards = stack.querySelectorAll<HTMLElement>(".journey-card-reveal");
    // Wider threshold/margin than the generic .reveal — these cards are large
    // and we want them committed before they're fully on screen.
    const observer = createRevealObserver({
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const rows: HomeJourneyPanel[][] = [];
  for (let i = 0; i < panels.length; i += 2) {
    rows.push(panels.slice(i, i + 2));
  }

  return (
    <section
      id="journey"
      className="bg-bone scroll-mt-[80px] flex flex-col pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-2 px-6 sm:px-8 md:px-2 items-end pb-8 sm:pb-10 md:pb-12">
        <div className="flex flex-col gap-3 md:px-6 lg:px-[72px]">
          <span className="font-sans font-extrabold uppercase text-magenta-deep text-[11px] sm:text-[12px] tracking-[0.08em] leading-4">
            {t.journeyEyebrow}
          </span>
          <h2 className="font-display text-logo-dark text-[40px] sm:text-[52px] md:text-[60px] lg:text-[64px] leading-[1.02] text-balance max-w-[535px]">
            {t.journeyTitle}
          </h2>
        </div>
        <p className="max-w-[535px] font-sans text-clay text-[16px] sm:text-[18px] md:text-[19px] lg:text-[18px] xl:text-[20px] leading-[1.5] md:px-6 lg:px-[72px]">
          {t.journeyDesc}
        </p>
      </div>

      {/*
       * Deck stacking: the stack is one tall containing block and each row
       * is a sticky child pinned below the fixed header. A row stays pinned
       * — with the next row sliding up over it — until the whole stack has
       * scrolled past, so the page background can never show through
       * between rows. On mobile the row/grid wrappers collapse to
       * `display: contents` and the six cards themselves become the sticky
       * children, stacking one by one. Image drift and the covered-row
       * dim/zoom are scrubbed by a single view-timeline hosted on the
       * non-sticky stack (a pinned sticky element freezes its own view()
       * timeline). See globals.css for the timeline wiring.
       */}
      <div ref={stackRef} className="journey-stack relative">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`journey-row journey-row--${rowIndex + 1} max-md:contents md:sticky md:top-[80px] md:h-[calc(100svh-80px)] md:px-2 md:overflow-hidden`}
            style={{ zIndex: rowIndex + 1 }}
          >
            <div className="journey-row-zoom max-md:contents md:grid md:grid-cols-2 md:gap-2 md:h-full">
              {row.map((panel, j) => (
                <JourneyCard
                  key={panel.key}
                  panel={panel}
                  lang={lang}
                  priority={false}
                  pairIndex={j}
                  stackIndex={rowIndex * 2 + j}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JourneyCard({
  panel,
  lang,
  priority,
  pairIndex,
  stackIndex,
}: {
  panel: HomeJourneyPanel;
  lang: Lang;
  priority: boolean;
  pairIndex: number;
  stackIndex: number;
}) {
  const isDark = panel.theme === "dark";
  const accentBg = panel.accent === "purple" ? "bg-purple" : "bg-yellow";
  // Two tracks: the purple "customer path" panels lead to the process page;
  // the yellow "timeline" panels lead to the journal page.
  const href = panel.accent === "yellow" ? "/blog" : "/finishing";
  return (
    <Link
      href={href}
      data-pair={pairIndex}
      // z-index orders the mobile card deck (later cards slide over earlier
      // ones); on desktop it's inert inside each row's stacking context.
      style={{ zIndex: stackIndex + 1 }}
      className="journey-card-reveal group relative max-md:sticky max-md:top-16 max-md:mx-2 block h-[480px] sm:h-[600px] md:h-full overflow-hidden cursor-pointer focus-ring"
    >
      <div className="parallax-img absolute inset-0">
        {panel.src ? (
          <Image
            src={panel.src}
            alt={panel.title}
            fill
            // Overrequest ~20% beyond the card width so the parallax
            // scale(1.22) inside .parallax-img doesn't upscale a tighter
            // crop. 60vw on desktop, 70vw on tablet, full width on mobile.
            // Default q75 (same as the hero, which renders even larger):
            // sharpness under the parallax scale is covered by the width
            // overrequest above, and q90 doubled the bytes these six panels
            // pull in during initial load, competing with the hero LCP.
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 70vw, 100vw"
            className="object-cover"
            preload={priority}
          />
        ) : (
          // No image (e.g. an editor added a panel without one) — fall back to a
          // solid accent panel instead of crashing next/image on an empty src.
          <div className={`h-full w-full ${accentBg}`} aria-hidden />
        )}
      </div>
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-ink/10" : "bg-[rgba(8,28,107,0.10)]"
        } transition-colors duration-700 group-hover:bg-transparent`}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-12 lg:px-[72px] pb-12 sm:pb-16 md:pb-[80px] lg:pb-[100px] ${
          isDark
            ? "bg-gradient-to-t from-ink via-ink/55 to-transparent"
            : "bg-gradient-to-t from-bone via-bone/65 to-transparent"
        }`}
      >
        <div className="flex max-w-[456px] flex-col gap-2 text-start">
          <span
            className={`inline-flex items-center gap-2 font-sans font-extrabold uppercase text-[11px] sm:text-[12px] tracking-[0.08em] leading-4 ${panel.tagColor}`}
          >
            <span
              aria-hidden
              className={`inline-block h-2 w-2 rounded-full ${accentBg} transition-transform duration-500 group-hover:scale-150`}
            />
            {panel.tag}
          </span>
          <h3
            className={`font-display text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] pt-2 ${
              isDark ? "text-bone" : "text-ink"
            }`}
          >
            {panel.title}
          </h3>
          <p
            className={`font-sans text-[16px] sm:text-[17px] md:text-[18px] leading-[1.6] tracking-[-0.16px] pt-3 sm:pt-4 ${
              isDark ? "text-bone/90" : "text-clay"
            }`}
          >
            {panel.body}
          </p>
          <div className="pt-4 sm:pt-5 flex items-center gap-4">
            <span
              className={`relative font-sans font-bold uppercase text-[13px] sm:text-[14px] tracking-[0.08em] ${
                isDark ? "text-bone" : "text-ink"
              }`}
            >
              {panel.link}
              <span
                aria-hidden
                className={`absolute start-0 end-0 -bottom-1 h-px transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ltr:origin-left rtl:origin-right ${
                  isDark ? "bg-bone" : "bg-ink"
                }`}
              />
            </span>
            <ArrowRtl color={isDark ? "bone" : "ink"} lang={lang} />
          </div>
        </div>
      </div>
    </Link>
  );
}
