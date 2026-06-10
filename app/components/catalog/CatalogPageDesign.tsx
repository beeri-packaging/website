import Image from "next/image";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import type {
  CatalogCategory,
  CatalogCopy,
  CatalogItem,
} from "@/app/content/catalog";
import type { Lang } from "@/app/content/home";
import { Tag } from "./Tag";
import { CatalogModalProvider, ProductOpenButton } from "./CatalogModalProvider";

const SECTION = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12 lg:px-20";

// ── Hero spec card — sand panel, hard ink shadow, 4 palette dots ──────────────
function SpecCard({ lines }: { lines: CatalogCopy["specCard"] }) {
  const dots = ["bg-purple", "bg-cyan", "bg-yellow", "bg-magenta"];
  return (
    <div className="flex flex-col gap-4 self-start border border-ink bg-sand p-[25px] shadow-[4px_4px_0_0_var(--ink)] md:self-end">
      <div dir="ltr" className="flex gap-4 pe-[106px]">
        {dots.map((bg) => (
          <span key={bg} className={`${bg} size-3 border border-ink`} aria-hidden />
        ))}
      </div>
      <div className="flex flex-col items-start gap-1 text-start">
        {lines.map((line) => (
          <p
            key={line}
            className="font-sans text-[10px] font-semibold leading-[15px] text-ink"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function CatalogHero({ copy }: { copy: CatalogCopy }) {
  return (
    <section className={`${SECTION} pt-10 sm:pt-14 lg:pt-16`}>
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[672px] flex-col items-start text-start">
          <p className="ds-eyebrow text-teal">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-[56px] leading-[0.85] text-logo-dark sm:text-[80px] md:text-[96px]">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
            {copy.intro}
          </p>
        </div>
        <SpecCard lines={copy.specCard} />
      </div>
    </section>
  );
}

// ── Category header — numbered yellow tag (start) · hairline · count (end) ────
function CategoryHeader({ category }: { category: CatalogCategory }) {
  return (
    <div className="reveal flex items-center gap-4">
      <h2 className="shrink-0 border border-ink bg-yellow px-4 py-[5px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-yellow-deep">
        {category.number} / {category.name}
      </h2>
      <span className="h-px flex-1 bg-ink/20" aria-hidden />
      <span className="shrink-0 font-sans text-[16px] font-light text-clay">
        {category.count}
      </span>
    </div>
  );
}

// ── Grid card (cosmetics) — square photo + tags, opens product detail ─────────
function GridCard({
  item,
  categoryName,
}: {
  item: CatalogItem;
  categoryName: string;
}) {
  return (
    <article className="group relative flex min-h-[480px] flex-col overflow-hidden border border-ink bg-bone shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-300 hover:-translate-y-0.5 lg:min-h-[556px]">
      <ProductOpenButton item={item} categoryName={categoryName} />
      <div className="relative aspect-square border-b border-ink bg-sand">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col items-start gap-6 p-6 text-start">
        <h3 className="font-display text-[44px] leading-[0.92] text-ink sm:text-[56px] lg:text-[64px]">
          {item.name}
        </h3>
        <p className="font-sans text-[16px] font-light leading-[25px] text-clay">
          {item.description}
        </p>
        {item.tags?.length ? (
          <div dir="ltr" className="mt-auto flex flex-wrap justify-end gap-2 pt-2">
            {item.tags.map((tag) => (
              <Tag key={tag.label} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

// ── Feature card (wine & spirits) — tall split photo / spec column ────────────
function FeatureCard({
  item,
  categoryName,
}: {
  item: CatalogItem;
  categoryName: string;
}) {
  return (
    <article className="group relative grid overflow-hidden border border-ink bg-bone shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-300 hover:-translate-y-0.5 md:grid-cols-2 lg:min-h-[700px]">
      <ProductOpenButton item={item} categoryName={categoryName} />
      <div className="flex flex-col items-start justify-center gap-7 p-8 text-start sm:p-12">
        {item.series ? <p className="ds-eyebrow text-purple">{item.series}</p> : null}
        <h3 className="font-display text-[64px] leading-[0.82] text-logo-dark sm:text-[80px] lg:text-[96px]">
          {item.name}
        </h3>
        <p className="max-w-[280px] font-sans text-[16px] font-light leading-[25px] text-clay">
          {item.description}
        </p>
        {item.specs?.length ? (
          <div dir="ltr" className="grid w-full grid-cols-2 gap-4">
            {item.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex flex-col items-center border-s-2 ps-3 ${
                  i === 0 ? "border-cyan" : "border-magenta"
                }`}
              >
                <span dir="auto" className="font-sans text-[16px] font-light text-clay">
                  {spec.label}
                </span>
                <span dir="auto" className="font-display text-[24px] font-bold tracking-[0.05em] text-ink">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {item.cta ? (
          <ContactTriggerButton
            className="relative z-20 inline-flex items-center justify-center self-start border border-ink bg-purple px-5 py-4 font-sans text-[12px] font-semibold text-bone shadow-[4px_4px_0_0_var(--ink)] transition-colors hover:bg-ink focus-ring"
          >
            {item.cta}
          </ContactTriggerButton>
        ) : null}
      </div>
      {item.image ? (
        <div className="relative h-full min-h-[320px] border-t border-ink md:min-h-0 md:border-s md:border-t-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </article>
  );
}

function ModularIcon() {
  return (
    <svg viewBox="0 0 30 30" className="size-[30px]" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="11" height="11" />
        <rect x="17" y="2" width="11" height="11" />
        <rect x="2" y="17" width="11" height="11" />
        <rect x="17" y="17" width="11" height="11" />
      </g>
    </svg>
  );
}

// ── Modular system — single full-width card, centered spec row ────────────────
function ModularCard({ item }: { item: CatalogItem }) {
  return (
    <div className="flex flex-col items-center gap-6 border border-ink bg-sand p-10 text-center sm:p-16">
      <div className="grid size-24 place-items-center border border-ink bg-yellow text-ink">
        <ModularIcon />
      </div>
      <h3 className="font-display text-[48px] leading-[0.9] text-logo-dark sm:text-[72px] md:text-[88px]">
        {item.name}
      </h3>
      <p className="max-w-[576px] font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
        {item.description}
      </p>
      {item.specs?.length ? (
        <div dir="ltr" className="mt-2 flex flex-wrap justify-center gap-8 sm:gap-12">
          {item.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col items-center">
              <span dir="auto" className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-magenta-deep">
                {spec.label}
              </span>
              <span className="font-display text-[24px] font-bold tracking-[0.05em] text-ink">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CategorySection({ category }: { category: CatalogCategory }) {
  return (
    <section className={`${SECTION} mt-20 sm:mt-28`}>
      <CategoryHeader category={category} />
      {category.layout === "grid" ? (
        <div className="reveal mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {category.items.map((item) => (
            <GridCard key={item.key} item={item} categoryName={category.name} />
          ))}
        </div>
      ) : null}
      {category.layout === "feature" ? (
        <div className="reveal mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.items.map((item) => (
            <FeatureCard key={item.key} item={item} categoryName={category.name} />
          ))}
        </div>
      ) : null}
      {category.layout === "modular" ? (
        <div className="reveal mt-12">
          {category.items.map((item) => (
            <ModularCard key={item.key} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function CatalogPageDesign({ copy, lang }: { copy: CatalogCopy; lang: Lang }) {
  return (
    <CatalogModalProvider lang={lang}>
      <div className="bg-bone pb-24 sm:pb-32">
        <CatalogHero copy={copy} />
        <div id="catalog" className="scroll-mt-[80px]">
          {copy.categories.map((category) => (
            <CategorySection key={category.key} category={category} />
          ))}
        </div>
      </div>
    </CatalogModalProvider>
  );
}
