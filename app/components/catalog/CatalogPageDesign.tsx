import Image from "next/image";
import Link from "next/link";
import type {
  CatalogCategory,
  CatalogCopy,
  CatalogItem,
  CatalogTag,
} from "@/app/content/catalog";
import type { Lang } from "@/app/content/home";

const SECTION = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12 lg:px-20";

// ── Hero spec card — sand panel, hard ink shadow, 4 palette dots ──────────────
function SpecCard({ lines }: { lines: CatalogCopy["specCard"] }) {
  const dots = ["bg-purple", "bg-cyan", "bg-yellow", "bg-magenta"];
  return (
    <div className="self-start border border-ink bg-sand p-6 shadow-[4px_4px_0_0_var(--ink)] md:self-end">
      <div className="flex justify-end gap-4">
        {dots.map((bg) => (
          <span key={bg} className={`${bg} size-3 border border-ink`} aria-hidden />
        ))}
      </div>
      <div className="mt-6 flex flex-col items-end gap-1 text-right">
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
        <div className="flex max-w-[672px] flex-col items-end text-right">
          <p className="ds-eyebrow text-teal">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-[56px] leading-[0.85] text-blueprint sm:text-[80px] md:text-[96px]">
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

// ── Category header — count · hairline · numbered yellow tag ──────────────────
function CategoryHeader({ category }: { category: CatalogCategory }) {
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 font-sans text-[16px] font-light text-clay">
        {category.count}
      </span>
      <span className="h-px flex-1 bg-ink/20" aria-hidden />
      <span className="shrink-0 border border-ink bg-yellow px-4 py-[5px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-yellow-deep">
        {category.number} / {category.name}
      </span>
    </div>
  );
}

function Tag({ tag }: { tag: CatalogTag }) {
  const tone = {
    outline: "border-ink text-ink",
    cyan: "border-ink bg-cyan text-ink",
    purple: "border-ink bg-purple text-bone",
    magenta: "border-ink bg-magenta text-bone",
  }[tag.tone];
  return (
    <span
      className={`${tone} inline-flex items-center border px-[9px] py-[5px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]`}
    >
      {tag.label}
    </span>
  );
}

// ── Grid card (cosmetics) — square photo + hover technical overlay + tags ─────
function GridCard({ item }: { item: CatalogItem }) {
  return (
    <article className="group flex flex-col overflow-hidden border border-ink bg-bone shadow-[4px_4px_0_0_var(--ink)]">
      <div className="relative aspect-square border-b border-ink bg-sand">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover grayscale"
          />
        ) : null}
        {/* Technical overlay — revealed on hover */}
        <div className="pointer-events-none absolute inset-4 border border-cyan/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="absolute left-0 top-0 h-px w-8 bg-cyan" aria-hidden />
          <span className="absolute left-0 top-0 h-8 w-px bg-cyan" aria-hidden />
          {item.overlayLabel ? (
            <span className="absolute left-2 top-2 bg-cyan/20 px-1 font-sans text-[8px] font-semibold leading-[12px] text-teal">
              {item.overlayLabel}
            </span>
          ) : null}
          {item.overlaySpecs?.length ? (
            <div className="absolute bottom-4 right-4 flex flex-col items-end">
              {item.overlaySpecs.map((spec) => (
                <span
                  key={spec}
                  className="font-sans text-[10px] font-semibold leading-[15px] text-teal"
                >
                  {spec}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-end gap-6 p-6 text-right">
        <h3 className="font-display text-[40px] leading-[0.92] text-ink sm:text-[44px]">
          {item.name}
        </h3>
        <p className="font-sans text-[16px] font-light leading-[25px] text-clay">
          {item.description}
        </p>
        {item.tags?.length ? (
          <div className="mt-auto flex flex-wrap justify-end gap-2 pt-2">
            {item.tags.map((tag) => (
              <Tag key={tag.label} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

// ── Feature card (wine & spirits) — split photo / spec column ─────────────────
function FeatureCard({ item }: { item: CatalogItem }) {
  return (
    <article className="grid overflow-hidden border border-ink bg-bone shadow-[4px_4px_0_0_var(--ink)] md:grid-cols-2">
      <div className="flex flex-col items-end gap-7 p-8 text-right sm:p-12">
        {item.series ? <p className="ds-eyebrow text-purple">{item.series}</p> : null}
        <h3 className="font-display text-[64px] leading-[0.82] text-blueprint sm:text-[80px] lg:text-[88px]">
          {item.name}
        </h3>
        <p className="max-w-[280px] font-sans text-[16px] font-light leading-[25px] text-clay">
          {item.description}
        </p>
        {item.specs?.length ? (
          <div className="grid w-full grid-cols-2 gap-4">
            {item.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex flex-col items-center border-s-2 ps-3 ${
                  i === 0 ? "border-cyan" : "border-magenta"
                }`}
              >
                <span className="font-sans text-[16px] font-light text-clay">
                  {spec.label}
                </span>
                <span className="font-display text-[24px] font-bold tracking-[0.05em] text-ink">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {item.cta ? (
          <Link
            href="/#cta"
            className="inline-flex items-center justify-center border border-ink bg-purple px-5 py-4 font-sans text-[12px] font-semibold text-bone shadow-[4px_4px_0_0_var(--ink)] transition-colors hover:bg-ink focus-ring"
          >
            {item.cta}
          </Link>
        ) : null}
      </div>
      {item.image ? (
        <div className="relative min-h-[320px] border-t border-ink md:min-h-0 md:border-s md:border-t-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 25vw, 100vw"
            className="object-cover grayscale"
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
      <h3 className="font-display text-[48px] leading-[0.9] text-blueprint sm:text-[72px] md:text-[88px]">
        {item.name}
      </h3>
      <p className="max-w-[576px] font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
        {item.description}
      </p>
      {item.specs?.length ? (
        <div className="mt-2 flex flex-wrap justify-center gap-8 sm:gap-12">
          {item.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col items-center">
              <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-magenta">
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
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {category.items.map((item) => (
            <GridCard key={item.key} item={item} />
          ))}
        </div>
      ) : null}
      {category.layout === "feature" ? (
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {category.items.map((item) => (
            <FeatureCard key={item.key} item={item} />
          ))}
        </div>
      ) : null}
      {category.layout === "modular" ? (
        <div className="mt-12">
          {category.items.map((item) => (
            <ModularCard key={item.key} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function CatalogPageDesign({ copy }: { copy: CatalogCopy; lang: Lang }) {
  return (
    <div className="bg-bone pb-24 sm:pb-32">
      <CatalogHero copy={copy} />
      {copy.categories.map((category) => (
        <CategorySection key={category.key} category={category} />
      ))}
    </div>
  );
}
