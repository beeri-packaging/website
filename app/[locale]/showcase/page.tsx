"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { homeCopy } from "@/app/content/home";
import type { Lang } from "@/app/content/home";
import { Header } from "@/app/components/home/Header";
import { MobileDrawer } from "@/app/components/home/MobileDrawer";

type Item = {
  src: string;
  title: string;
  caption: string;
  w: number;
  h: number;
};

// 49 Figma frames → mapped to existing assets in /public/images/generated/...
// plus 8 fresh PNGs saved to /public/images/figma/showcase/.
// Order mirrors the user's submitted list of node IDs.
const ITEMS: Item[] = [
  { src: "/images/generated/website-content/alcohol-beverages/gordons-gin-gift-card.png", title: "Gordon's Gin — Gift Card", caption: "Alcohol · Gift Box", w: 1025, h: 1535 },
  { src: "/images/generated/website-content/alcohol-beverages/beer-six-pack-banner.png", title: "Beer Six-Pack Banner", caption: "Alcohol · Banner", w: 1672, h: 941 },
  { src: "/images/generated/website-content/coffee-capsules/coffee-capsules-banner.png", title: "Coffee Capsules", caption: "Coffee · Banner", w: 1535, h: 1024 },
  { src: "/images/generated/website-content/cosmetics/ahava-skincare-banner.webp", title: "Ahava — Skincare", caption: "Cosmetics · Banner", w: 1774, h: 887 },
  { src: "/images/generated/website-content/cosmetics/sabon-soap-gift-banner.webp", title: "Sabon — Soap Gift", caption: "Cosmetics · Banner", w: 1554, h: 1012 },
  { src: "/images/generated/website-content/alcohol-beverages/milk-and-honey-whisky-banner.png", title: "Milk & Honey Whisky", caption: "Alcohol · Banner", w: 1672, h: 941 },
  { src: "/images/generated/website-content/coffee-capsules/aroma-capsule-display-card.png", title: "Aroma — Display Card", caption: "Coffee · Display", w: 1254, h: 1254 },

  { src: "/images/figma/showcase/ig-203-110.png", title: "Ambience Study I", caption: "Image · Atmosphere", w: 1024, h: 1536 },
  { src: "/images/figma/showcase/ig-204-111.png", title: "Ambience Study II", caption: "Image · Atmosphere", w: 1024, h: 1536 },
  { src: "/images/figma/showcase/ig-204-110.png", title: "Ambience Study III", caption: "Image · Atmosphere", w: 1024, h: 1536 },
  { src: "/images/figma/showcase/ig-203-111.png", title: "Ambience Study IV", caption: "Image · Atmosphere", w: 1024, h: 1536 },
  { src: "/images/figma/showcase/ig-203-115.png", title: "Ambience Study V", caption: "Image · Atmosphere", w: 1024, h: 1536 },
  { src: "/images/figma/showcase/ig-203-112.png", title: "Ambience Study VI", caption: "Image · Atmosphere", w: 1024, h: 1536 },

  { src: "/images/generated/finishing-hero/finishing-hero-v3.png", title: "Finishing — Study III", caption: "Finishing · Hero", w: 1456, h: 1080 },
  { src: "/images/generated/finishing-hero/finishing-hero-v2.png", title: "Finishing — Study II", caption: "Finishing · Hero", w: 1457, h: 1080 },
  { src: "/images/generated/finishing-hero/finishing-hero-v6-beer.png", title: "Finishing — Beer", caption: "Finishing · Hero", w: 1456, h: 1080 },
  { src: "/images/generated/finishing-hero/finishing-hero-v8-golda.png", title: "Finishing — Golda", caption: "Finishing · Hero", w: 1456, h: 1080 },

  { src: "/images/generated/website-content/food/olive-oil-packaging-banner.webp", title: "Olive Oil Packaging", caption: "Food · Banner", w: 1536, h: 1024 },
  { src: "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png", title: "Coffee Display Hero", caption: "Editorial · Hero", w: 1672, h: 941 },
  { src: "/images/generated/website-content/packaging/kraft-sweets-window-box.webp", title: "Kraft Sweets — Window Box", caption: "Packaging · Structural", w: 1024, h: 1536 },
  { src: "/images/generated/website-content/packaging/tall-coffee-capsule-carton.png", title: "Tall Coffee Capsule Carton", caption: "Packaging · Structural", w: 1023, h: 1537 },
  { src: "/images/generated/website-content/packaging/handled-suitcase-gift-box.webp", title: "Handled Suitcase Gift Box", caption: "Packaging · Structural", w: 1536, h: 1024 },
  { src: "/images/generated/hero-new-style/hero-new-style-04-black-gold-bottle.png", title: "Black & Gold Bottle Hero", caption: "Editorial · Hero", w: 1672, h: 941 },
  { src: "/images/generated/website-content/packaging/retail-coffee-display-window-carton.png", title: "Retail Coffee Display Carton", caption: "Packaging · Structural", w: 1535, h: 1024 },
  { src: "/images/generated/website-content/packaging/beer-carrier-window-carton.webp", title: "Beer Carrier — Window Carton", caption: "Packaging · Structural", w: 1672, h: 941 },
  { src: "/images/generated/website-content/packaging/gold-wine-insert-handle-box.png", title: "Gold Wine Insert — Handle Box", caption: "Packaging · Structural", w: 1672, h: 941 },
  { src: "/images/generated/website-content/packaging/kraft-sweets-window-box.webp", title: "Kraft Sweets — Window Box II", caption: "Packaging · Structural", w: 1024, h: 1536 },
  { src: "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png", title: "Cosmetics Drawer Sleeve", caption: "Packaging · Structural", w: 1672, h: 941 },
  { src: "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png", title: "Die-Cut Process Hero", caption: "Editorial · Hero", w: 1672, h: 941 },

  { src: "/images/generated/website-content/pharma/altman-wellness-banner.webp", title: "Altman Wellness", caption: "Pharma · Banner", w: 1535, h: 1024 },
  { src: "/images/generated/website-content/food/golda-chocolate-card.png", title: "Golda — Chocolate Card", caption: "Food · Card", w: 1122, h: 1402 },
  { src: "/images/generated/website-content/finishing/syrah-foil-detail-v1.png", title: "Syrah — Foil Detail", caption: "Finishing · Detail", w: 1537, h: 1023 },
  { src: "/images/generated/website-content/home/wine-packaging-hero.png", title: "Wine Packaging Hero", caption: "Wine · Hero", w: 1672, h: 941 },
  { src: "/images/generated/website-content/food/wissotzky-tea-packaging-banner.png", title: "Wissotzky Tea", caption: "Food · Banner", w: 1672, h: 941 },
  { src: "/images/generated/website-content/food/honey-oats-packaging-banner.png", title: "Honey Oats Packaging", caption: "Food · Banner", w: 1536, h: 1024 },
  { src: "/images/generated/website-content/wines/clos-de-gat-syrah-banner.png", title: "Clos de Gat — Syrah", caption: "Wine · Banner", w: 1672, h: 941 },
  { src: "/images/generated/imagegen-real-products/mh-whisky-imagegen-ambience-v1.png", title: "M&H Whisky — Ambience", caption: "Alcohol · Ambience", w: 1774, h: 887 },

  { src: "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png", title: "Die-Cut Process Hero II", caption: "Editorial · Hero", w: 1672, h: 941 },
  { src: "/images/generated/hero-new-style/hero-new-style-01-wine-foil.png", title: "Wine Foil Hero", caption: "Editorial · Hero", w: 1672, h: 941 },
  { src: "/images/generated/hero-new-style/hero-new-style-03-coffee-display.png", title: "Coffee Display Hero II", caption: "Editorial · Hero", w: 1672, h: 941 },
  { src: "/images/generated/hero-new-style/hero-new-style-02-cosmetics-drawer.png", title: "Cosmetics Drawer Hero", caption: "Editorial · Hero", w: 1672, h: 941 },

  { src: "/images/generated/timeline/beeri-history.png", title: "Beeri — History", caption: "Heritage · Timeline", w: 1456, h: 1080 },
  { src: "/images/generated/timeline/beeri-today-simple.png", title: "Beeri — Today (Simple)", caption: "Heritage · Timeline", w: 1456, h: 1080 },
  { src: "/images/generated/timeline/beeri-growth.png", title: "Beeri — Growth", caption: "Heritage · Timeline", w: 1456, h: 1080 },
  { src: "/images/generated/timeline/beeri-growth-simple.png", title: "Beeri — Growth (Simple)", caption: "Heritage · Timeline", w: 1456, h: 1080 },
  { src: "/images/figma/showcase/beeri-history-simple.png", title: "Beeri — History (Simple)", caption: "Heritage · Timeline", w: 1456, h: 1080 },
  { src: "/images/figma/showcase/beeri-today.png", title: "Beeri — Today", caption: "Heritage · Timeline", w: 1456, h: 1080 },

  { src: "/images/generated/finishing-hero/finishing-hero-v10-raziel.png", title: "Finishing — Raziel", caption: "Finishing · Hero", w: 1456, h: 1080 },
  { src: "/images/generated/finishing-hero/finishing-hero-v5.png", title: "Finishing — Study V", caption: "Finishing · Hero", w: 1456, h: 1080 },
];

const pad = (n: number) => n.toString().padStart(2, "0");

export default function ShowcasePage() {
  const [active, setActive] = useState<number | null>(null);
  const lang = useLocale() as Lang;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.scrollLock = menuOpen ? "true" : "false";
    return () => {
      document.body.dataset.scrollLock = "false";
    };
  }, [menuOpen]);

  const t = homeCopy[lang];

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % ITEMS.length)),
    []
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? null : (i - 1 + ITEMS.length) % ITEMS.length
      ),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.dataset.scrollLock = "true";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.dataset.scrollLock = "false";
    };
  }, [active, close, next, prev]);

  const total = ITEMS.length;
  const activeItem = active === null ? null : ITEMS[active];

  // Split items across 4 columns by index (mod 4) for a balanced masonry feel.
  const columns = useMemo(() => {
    const cols: { item: Item; index: number }[][] = [[], [], [], []];
    ITEMS.forEach((item, index) => cols[index % 4].push({ item, index }));
    return cols;
  }, []);

  return (
    <>
      <Header
        lang={lang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        t={t}
      />
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
        t={t}
      />
      <main
        dir="ltr"
        className="bg-bone text-ink min-h-screen relative pt-[64px] sm:pt-[72px] md:pt-[80px]"
      >
        {/* Editorial header */}
        <header className="px-6 md:px-12 pt-16 md:pt-24 pb-10 md:pb-16 border-b border-rule">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-clay-soft mb-6">
              Beeri Atelier · 1964 — Present
            </p>
            <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(64px,12vw,200px)] leading-[0.82] tracking-tight text-ink">
              Forty-Nine
              <br />
              <span className="text-magenta">Frames.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-clay text-[15px] leading-relaxed">
              A curated index of packaging studies, brand atmospheres and structural
              die-cuts shaped at the Beeri atelier — rendered for client review.
            </p>
          </div>

          <div className="flex items-end gap-8 self-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.28em] text-clay-soft">
                Plates
              </span>
              <span className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-none mt-1">
                {pad(total)}
              </span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.28em] text-clay-soft">
                Format
              </span>
              <span className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-none mt-1">
                MIX
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-clay-soft">
          <span className="inline-block h-px w-12 bg-ink/40" />
          <span>Tap any plate to enlarge · ESC to close · ← → to browse</span>
        </div>
      </header>

      {/* Gallery — 4-column masonry, gradually collapsing on smaller screens */}
      <section className="px-3 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3 md:gap-4">
              {col.map(({ item, index }) => (
                <Plate
                  key={`${index}-${item.src}`}
                  item={item}
                  index={index}
                  total={total}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Footer signature */}
      <footer className="px-6 md:px-12 pb-16 pt-6 border-t border-rule">
        <div className="flex items-end justify-between gap-8 flex-wrap text-[11px] uppercase tracking-[0.28em] text-clay-soft">
          <span>End of index · {pad(total)} plates</span>
          <span>בארי אריזות · Atelier showcase</span>
        </div>
      </footer>

        {activeItem !== null && active !== null && (
          <Lightbox
            item={activeItem}
            index={active}
            total={total}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </main>
    </>
  );
}

function Plate({
  item,
  index,
  total,
  onClick,
}: {
  item: Item;
  index: number;
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full overflow-hidden bg-sand text-left focus-ring transition-shadow duration-500 hover:shadow-[0_24px_60px_-20px_rgba(27,28,26,0.35)]"
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
      aria-label={`Open plate ${index + 1} of ${total}: ${item.title}`}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        loading={index < 4 ? "eager" : "lazy"}
        fetchPriority={index < 4 ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
      />

      {/* Top-left index chip */}
      <span className="pointer-events-none absolute top-3 left-3 z-10 flex items-baseline gap-2 rounded-full bg-bone/85 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ink shadow-[0_1px_0_rgba(27,28,26,0.06)] opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <span className="font-[family-name:var(--font-display)] text-base leading-none">
          {pad(index + 1)}
        </span>
        <span className="text-clay-soft">/ {pad(total)}</span>
      </span>

      {/* Bottom caption strip */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="bg-gradient-to-t from-ink/85 via-ink/60 to-transparent px-4 pt-10 pb-4">
          <p className="font-[family-name:var(--font-display)] text-lg md:text-xl leading-tight text-bone">
            {item.title}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-bone/70">
            {item.caption}
          </p>
        </div>
      </div>
    </button>
  );
}

function Lightbox({
  item,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  item: Item;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Plate ${index + 1} of ${total}: ${item.title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/96 backdrop-blur-sm animate-fade"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 pt-6 pb-3 text-bone">
        <div className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-display)] text-3xl md:text-5xl leading-none">
            {pad(index + 1)}
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-bone/55">
            / {pad(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-bone/30 hover:border-bone/80 hover:bg-bone/10 transition-colors duration-300 px-4 py-2 text-[11px] uppercase tracking-[0.28em]"
        >
          Close · ESC
        </button>
      </div>

      {/* Image stage */}
      <div className="relative flex-1 flex items-center justify-center px-6 md:px-16 py-2 min-h-0">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous plate"
          className="hidden sm:flex absolute left-3 md:left-6 z-10 h-12 w-12 items-center justify-center rounded-full border border-bone/25 text-bone/80 hover:border-bone hover:text-bone hover:bg-bone/10 transition-colors duration-300"
        >
          <ArrowLeft />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next plate"
          className="hidden sm:flex absolute right-3 md:right-6 z-10 h-12 w-12 items-center justify-center rounded-full border border-bone/25 text-bone/80 hover:border-bone hover:text-bone hover:bg-bone/10 transition-colors duration-300"
        >
          <ArrowRight />
        </button>

        <Image
          key={item.src}
          src={item.src}
          alt={item.title}
          width={item.w}
          height={item.h}
          sizes="100vw"
          className="max-h-full max-w-full object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] animate-rise"
          style={{ animationDuration: "500ms" }}
        />
      </div>

      {/* Caption bar */}
      <div className="px-6 md:px-10 pb-8 pt-3">
        <div className="flex items-end justify-between gap-6 text-bone flex-wrap">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight">
              {item.title}
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-bone/55">
              {item.caption}
            </p>
          </div>
          <div className="flex sm:hidden gap-3">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous plate"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-bone/30 text-bone/80"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next plate"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-bone/30 text-bone/80"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
