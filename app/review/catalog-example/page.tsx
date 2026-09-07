import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { getCatalog, toCatalogContent } from "@/sanity/queries";

import {
  CatalogProductConcept,
  type CategoryWithProducts,
} from "./CatalogProductConcept";
import {
  catalogExampleCopy as copy,
  categoryConcepts,
  type CatalogExample,
} from "./content";
import styles from "./catalog-example.module.css";

export const metadata: Metadata = {
  title: "דוגמת קטלוג מוצרים · בארי אריזות",
  description: "דוגמה למבנה קטלוג המבוסס על סוגי מוצרים וגלריות ביצוע.",
  robots: { index: false, follow: false },
};

export default async function CatalogExamplePage() {
  const catalog = toCatalogContent(await getCatalog("he"), "he");
  const examplesByKey = new Map(
    catalog.categories
      .flatMap((category) => category.items)
      .filter(
        (item): item is CatalogExample & { image: string } => Boolean(item.image),
      )
      .map((item) => [item.key, item]),
  );

  const categories: CategoryWithProducts[] = categoryConcepts.map((category) => {
    return {
      key: category.key,
      number: category.number,
      name: category.name,
      intro: category.intro,
      products: category.products.map((product) => ({
        ...product,
        examples: (product.exampleKeys ?? [])
          .map((key) => examplesByKey.get(key))
          .filter((example) => example !== undefined),
      })),
    };
  });

  return (
    <main id="main" className="min-h-screen bg-bone pb-24 text-ink sm:pb-32">
      <header className="border-b border-ink">
        <Container className="flex items-center justify-between gap-5 py-4">
          <p className="font-display text-[28px] leading-none text-logo-dark sm:text-[34px]">
            בארי אריזות
          </p>
          <p className="font-sans text-[11px] font-bold tracking-[0.08em] text-clay sm:text-[12px]">
            דוגמת קטלוג · לאישור המבנה
          </p>
        </Container>
      </header>

      <section className="mx-auto w-full max-w-[1280px] px-5 pt-10 sm:px-8 sm:pt-14 md:px-12 lg:px-20 lg:pt-16">
        <div className={"flex flex-col items-start text-start " + styles.rise}>
          <p className="ds-eyebrow text-teal">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-[56px] leading-[0.85] text-logo-dark sm:text-[80px] md:text-[96px]">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8 grid w-full gap-x-12 gap-y-7 font-sans text-clay lg:grid-cols-12">
            <p className="text-[18px] leading-[1.6] sm:text-[20px] lg:col-span-7">
              {copy.intro}
            </p>
            <p
              className={
                "border-s-4 border-cyan ps-5 text-[15px] leading-[1.7] sm:text-[16px] lg:col-span-5 " +
                styles.riseDelay
              }
            >
              {copy.service}
            </p>
          </div>
        </div>
      </section>

      <CatalogProductConcept categories={categories} />
    </main>
  );
}
