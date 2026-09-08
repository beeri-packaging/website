"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogMain,
  DialogTitle,
} from "@/components/ui/dialog";

import type { CatalogExample, ProductConcept } from "./content";
import { catalogExampleCopy as defaultCopy } from "./content";
import styles from "./catalog-example.module.css";

export type ProductWithExamples = ProductConcept & {
  examples: readonly CatalogExample[];
};

export type CategoryWithProducts = {
  key: string;
  number: string;
  name: string;
  intro: string;
  products: readonly ProductWithExamples[];
};

/** Keep the entire product visible while extending its backdrop to the frame edges. */
function CatalogImage({ fit, className, ...props }: ImageProps & { fit: "contain" | "cover" }) {
  return (
    <>
      <Image {...props} alt={props.alt} className={(fit === "contain" ? "z-[1] " : "") + (className ?? "")} />
      {fit === "contain" ? (
        <Image
          src={props.src}
          alt=""
          aria-hidden="true"
          fill
          sizes={props.sizes}
          loading={props.loading}
          unoptimized={props.unoptimized}
          className="pointer-events-none scale-110 object-cover opacity-70 blur-2xl"
        />
      ) : null}
    </>
  );
}

export function CatalogProductConcept({
  categories,
  unoptimizedImages = false,
  imageFit = "cover",
  emptyExamplesLabel,
  copy = defaultCopy,
}: {
  copy?: { openLabel: string; productTypeSingular: string; productTypePlural: string; examplesLabel: string; characteristicsLabel: string; examplePrefix: string; closeLabel: string };
  categories: readonly CategoryWithProducts[];
  unoptimizedImages?: boolean;
  imageFit?: "contain" | "cover";
  emptyExamplesLabel?: string;
}) {
  const [active, setActive] = useState<{
    product: ProductWithExamples;
    categoryName: string;
  } | null>(null);
  const [selectedExampleKey, setSelectedExampleKey] = useState<string | null>(null);

  const selectedExample = useMemo(() => {
    if (!active) return null;
    return (
      active.product.examples.find((example) => example.key === selectedExampleKey) ??
      active.product.examples[0] ??
      null
    );
  }, [active, selectedExampleKey]);

  const openProduct = (product: ProductWithExamples, categoryName: string) => {
    setActive({ product, categoryName });
    setSelectedExampleKey(product.examples[0]?.key ?? null);
  };

  return (
    <>
      {categories.map((category, categoryIndex) => (
        <section
          key={category.key}
          className="mx-auto mt-20 w-full max-w-[1280px] px-5 sm:mt-28 sm:px-8 md:px-12 lg:px-20"
        >
          <div className="flex items-center gap-4">
            <h2 className="shrink-0 border border-ink bg-yellow px-4 py-[5px] font-sans text-[12px] font-extrabold tracking-[0.08em] text-yellow-deep">
              {category.number} / {category.name}
            </h2>
            <span className="h-px flex-1 bg-ink/20" aria-hidden />
            <span className="shrink-0 font-sans text-[16px] font-light text-clay">
              {category.products.length} {category.products.length === 1 ? copy.productTypeSingular : copy.productTypePlural}
            </span>
          </div>

          <p className="mt-5 max-w-[55ch] font-sans text-[15px] leading-[1.7] text-clay">
            {category.intro}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product, productIndex) => {
              const cover = product.examples[0];
              return (
                <article
                  key={product.key}
                  className="group relative grid overflow-hidden border border-ink bg-bone text-start shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <button
                    type="button"
                    onClick={() => openProduct(product, category.name)}
                    className="absolute inset-0 z-10 focus-ring"
                    aria-label={product.name + " — " + copy.openLabel}
                  />
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-ink bg-sand">
                    {cover?.image ? (
                      <CatalogImage
                        fit={imageFit}
                        src={cover.image}
                        alt=""
                        fill
                        unoptimized={unoptimizedImages}
                        loading={
                          categoryIndex === 0 && productIndex === 0 ? "eager" : "lazy"
                        }
                        fetchPriority={categoryIndex === 0 && productIndex === 0 ? "high" : "auto"}
                        sizes="(min-width: 1280px) 357px, (min-width: 1024px) calc((100vw - 208px) / 3), (min-width: 640px) 50vw, 100vw"
                        className={(imageFit === "contain" ? "object-contain" : "object-cover") + " transition duration-700 ease-out "}
                      />
                    ) : emptyExamplesLabel ? (
                      <p className="grid h-full place-items-center px-8 text-center font-sans text-sm text-clay">{emptyExamplesLabel}</p>
                    ) : null}
                    <span
                      className="absolute end-4 top-4 z-[2] grid size-11 place-items-center border border-ink bg-bone font-sans text-[25px] font-light text-ink shadow-[3px_3px_0_0_var(--ink)] transition duration-300 group-hover:rotate-90 group-hover:bg-cyan"
                      aria-hidden
                    >
                      +
                    </span>
                  </div>
                  <div className="@container flex min-h-[210px] flex-col px-6 pb-6 pt-5 sm:px-7">
                    <h3 className="w-full text-balance font-display text-[min(58px,17cqi)] leading-[0.95] text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-4 max-w-[44ch] font-sans text-[15px] font-light leading-[1.65] text-clay">
                      {product.shortDescription}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {product.characteristics.slice(0, 2).map((characteristic, index) => (
                        <span
                          key={characteristic}
                          className={
                            "border border-ink px-3 py-1 font-sans text-[11px] font-bold " +
                            (index === 0 ? "bg-cyan text-cyan-deep" : "bg-bone text-ink")
                          }
                        >
                          {characteristic}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          size="split"
          closeLabel={copy.closeLabel}
          className={"max-w-[1180px] md:h-[min(760px,calc(100dvh-2rem))] " + (imageFit === "contain" ? "overflow-y-auto md:overflow-hidden" : "")}
        >
          <DialogMain className={"order-2 px-6 pb-9 pt-16 sm:px-10 md:order-1 md:px-12 " + (imageFit === "contain" ? "flex-none overflow-visible md:flex-1 md:overflow-y-auto" : "")}>
            {active ? (
              <div className="@container flex min-h-full flex-col">
                <Badge variant="cyan" className="mb-5 self-start">
                  {active.categoryName}
                </Badge>
                <DialogTitle className="w-full text-balance text-[min(68px,18cqi)] font-normal leading-[0.95]">
                  {active.product.name}
                </DialogTitle>
                <DialogDescription className="mt-5 max-w-[42ch] text-[15px] leading-[1.75] sm:text-[16px]">
                  {active.product.details}
                </DialogDescription>

                <section className="mt-8 border-t border-rule pt-5">
                  <h3 className="font-sans text-[12px] font-extrabold tracking-[0.08em] text-ink">
                    {copy.characteristicsLabel}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {active.product.characteristics.map((characteristic) => (
                      <li key={characteristic}>
                        <Badge variant="outline" className="px-4 py-2 text-[13px] normal-case tracking-normal sm:text-[13px]">
                          {characteristic}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </section>

                {selectedExample?.description ? (
                  <p className="mt-auto border-t border-rule pt-5 font-sans text-[12px] leading-relaxed text-clay-soft">
                    {selectedExample.description}
                  </p>
                ) : null}
              </div>
            ) : null}
          </DialogMain>

          <div className={"relative order-1 flex min-w-0 min-h-[330px] flex-col border-b border-ink md:order-2 md:w-[54%] md:shrink-0 md:border-b-0 md:border-s " + (imageFit === "contain" ? "flex-none shrink-0 bg-sand md:flex-1" : "flex-1 bg-ink")}>
            {selectedExample?.image ? (
              <div
                key={selectedExample.key}
                className={"relative flex-1 overflow-hidden " + (imageFit === "contain" ? "min-h-[300px] md:min-h-[220px] " : "min-h-0 ") + styles.imageSwap}
              >
                <CatalogImage
                        fit={imageFit}
                  src={selectedExample.image}
                  alt={selectedExample.name}
                  fill
                  loading="eager"
                  unoptimized={unoptimizedImages}
                  sizes="(min-width: 768px) 54vw, 100vw"
                  className={imageFit === "contain" ? "object-contain" : "object-cover"}
                />
                {imageFit === "cover" ? <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent px-5 pb-5 pt-16 text-bone sm:px-7 sm:pb-7">
                  <p className="font-sans text-[11px] font-bold tracking-[0.08em] text-cyan">
                    {copy.examplePrefix}{" "}
                    {String(
                      (active?.product.examples.indexOf(selectedExample) ?? 0) + 1,
                    ).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-display text-[34px] leading-none sm:text-[42px]">
                    {selectedExample.name}
                  </p>
                </div> : null}
              </div>
            ) : emptyExamplesLabel ? (
              <p className="grid min-h-[300px] flex-1 place-items-center px-8 text-center font-sans text-sm text-clay">{emptyExamplesLabel}</p>
            ) : null}

            {imageFit === "contain" && selectedExample ? (
              <div className="border-t border-rule bg-bone px-5 py-4 text-ink sm:px-7">
                <p className="font-sans text-[11px] font-bold tracking-[0.08em] text-teal">
                  {copy.examplePrefix} {String((active?.product.examples.indexOf(selectedExample) ?? 0) + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-[30px] leading-none sm:text-[36px]">{selectedExample.name}</p>
              </div>
            ) : null}

            <div
              className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain border-t border-rule bg-bone p-3 [scrollbar-width:thin]"
              aria-label={copy.examplesLabel}
            >
              {active?.product.examples.map((example, index) => {
                const selected = example.key === selectedExample?.key;
                return (
                  <button
                    key={example.key}
                    type="button"
                    onClick={() => setSelectedExampleKey(example.key)}
                    className={
                      "group relative aspect-[4/3] w-24 shrink-0 overflow-hidden border border-rule bg-sand focus-ring sm:w-28 " +
                      (selected
                        ? "outline outline-4 -outline-offset-4 outline-cyan"
                        : "")
                    }
                    aria-label={copy.examplePrefix + " " + (index + 1) + ": " + example.name}
                    aria-pressed={selected}
                  >
                    {example.image ? (
                      <CatalogImage
                        fit={imageFit}
                        src={example.image}
                        alt=""
                        fill
                        unoptimized={unoptimizedImages}
                        sizes="(min-width: 640px) 112px, 96px"
                        className={(imageFit === "contain" ? "object-contain" : "object-cover") + " transition duration-500 "}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
