import { defineQuery } from "next-sanity";
import type { Lang } from "@/app/content/home";
import type { CategoryWithProducts } from "@/app/review/catalog-example/CatalogProductConcept";
import fallback from "@/app/content/product-catalog.json";
import { client } from "./client";

export const productCatalogQuery = defineQuery(`*[_type == "catalog" && language == $locale][0].productCategories[]{
  key, number, name, intro,
  products[]{key, name, shortDescription, details, characteristics,
    examples[]{key, name, description, "image": image.asset->url}
  }
}`);

export async function getProductCatalog(locale: Lang): Promise<readonly CategoryWithProducts[]> {
  try {
    const categories = await client.fetch<CategoryWithProducts[] | null>(productCatalogQuery, { locale });
    if (categories?.length) return categories;
  } catch (error) {
    console.error("Product catalog fetch failed; using the published snapshot", error);
  }
  return fallback[locale];
}
