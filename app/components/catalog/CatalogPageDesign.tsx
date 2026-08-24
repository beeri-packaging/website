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

function CatalogHero({ copy }: { copy: CatalogCopy }) {
  // The client-approved intro is five paragraphs that each do a different job:
  // what the catalog is · two of per-industry detail · the end-to-end service
  // claim · the invitation to browse. Flowed as five equal columns they read as
  // one wall, so each is given its own weight instead. Every word is kept.
  const [what, industriesA, industriesB, service, browse] = copy.intro.split("\n\n");
  const detail = [industriesA, industriesB].filter(Boolean);

  return (
    <section className={`${SECTION} pt-10 sm:pt-14 lg:pt-16`}>
      <div className="flex flex-col items-start text-start">
        <p className="ds-eyebrow text-teal">{copy.eyebrow}</p>
        <h1 className="mt-4 font-display text-[56px] leading-[0.85] text-logo-dark sm:text-[80px] md:text-[96px]">
          {copy.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* Tier 1 — what this is, at lead size, with the service claim beside it. */}
        <div className="mt-8 grid w-full gap-x-12 gap-y-7 font-sans text-clay lg:grid-cols-12">
          <p className="text-[18px] leading-[1.6] sm:text-[20px] lg:col-span-7">{what}</p>
          {service ? (
            <p className="border-s-4 border-cyan ps-5 text-[15px] leading-[1.7] sm:text-[16px] lg:col-span-5">
              {service}
            </p>
          ) : null}
        </div>

        {/* Tier 2 — the per-industry detail, demoted below a hairline. */}
        {detail.length ? (
          <div className="mt-10 grid w-full gap-x-12 gap-y-5 border-t border-rule pt-6 font-sans text-[15px] leading-[1.7] text-clay md:mt-12 md:grid-cols-2">
            {detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {/* Tier 3 — the invitation to browse, bridging into the category grid. */}
        {browse ? (
          <p className="mt-8 max-w-[62ch] border-s-4 border-yellow ps-5 font-sans text-[16px] leading-[1.6] text-ink sm:text-[17px]">
            {browse}
          </p>
        ) : null}
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
  sizes,
  paired = false,
}: {
  item: CatalogItem;
  categoryName: string;
  /** Matches the category's column count so the CDN serves the right width. */
  sizes: string;
  /** Paired (two-across) cards use a shorter photo so they don't tower. */
  paired?: boolean;
}) {
  return (
    // The card is a subgrid over four of the parent's row tracks — photo, name,
    // description, tags. Each track is sized by the tallest card in the row, so
    // a two-line product name no longer pushes its own description below its
    // neighbours': every band starts on the same baseline across the row.
    <article className="group relative row-span-4 grid grid-rows-subgrid overflow-hidden border border-ink bg-bone text-start shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-300 hover:-translate-y-0.5">
      <ProductOpenButton item={item} categoryName={categoryName} />
      <div
        className={`relative border-b border-ink bg-sand ${
          paired ? "aspect-square lg:aspect-[4/3]" : "aspect-square"
        }`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : null}
      </div>
      <h3
        className={`px-6 font-display leading-[0.92] text-ink ${
          paired
            ? "text-[40px] sm:text-[48px] lg:text-[52px]"
            : "text-[44px] sm:text-[56px] lg:text-[64px]"
        }`}
      >
        {item.name}
      </h3>
      <p className="px-6 font-sans text-[16px] font-light leading-[25px] text-clay">
        {item.description}
      </p>
      {/* Always rendered, even with no tags — an absent cell would shift every
          later row of this card off the shared tracks. */}
      <div
        dir="ltr"
        className="flex flex-wrap items-end justify-end gap-2 px-6 pb-6 pt-2"
      >
        {item.tags?.map((tag) => <Tag key={tag.label} tag={tag} />)}
      </div>
    </article>
  );
}

// ── Feature card (wine & spirits) — tall split photo / spec column ────────────
function FeatureCard({
  item,
  categoryName,
  full = false,
}: {
  item: CatalogItem;
  categoryName: string;
  /** True when this is the only card in its category and spans the full row. */
  full?: boolean;
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
            sizes={
              full ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"
            }
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
  // Three across for 3- and 6-item categories, two for the rest. A four-across
  // row leaves each name a quarter of the width, which wraps long ones such as
  // "החברה המרכזית / קרלסברג" over three lines; pairing them doubles the room.
  const triple = category.items.length === 3 || category.items.length === 6;
  const gridSizes = triple
    ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    : "(min-width: 640px) 50vw, 100vw";

  return (
    <section className={`${SECTION} mt-20 sm:mt-28`}>
      <CategoryHeader category={category} />
      {category.layout === "grid" ? (
        <div
          className={`reveal mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 ${
            triple ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          {category.items.map((item) => (
            <GridCard
              key={item.key}
              item={item}
              categoryName={category.name}
              sizes={gridSizes}
              paired={!triple}
            />
          ))}
        </div>
      ) : null}
      {category.layout === "feature" ? (
        // A single feature item takes the full row — pairing it with an empty
        // column would leave half the section blank.
        <div
          className={`reveal mt-12 grid grid-cols-1 gap-6 ${
            category.items.length > 1 ? "lg:grid-cols-2" : ""
          }`}
        >
          {category.items.map((item) => (
            <FeatureCard
              key={item.key}
              item={item}
              categoryName={category.name}
              full={category.items.length === 1}
            />
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
