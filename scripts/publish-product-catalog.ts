/** Publish only the approved product categories, preserving all existing catalog fields. */
import { writeFileSync } from "node:fs";
import { writeClient } from "./lib/sanity-write-client";
import content from "../app/content/product-catalog.json";

function imageRef(url: string) {
  const basename = new URL(url).pathname.split("/").pop()!;
  const match = basename.match(/^([a-f0-9]+)-(\d+x\d+)\.(\w+)$/);
  if (!match) throw new Error(`Expected a Sanity image URL: ${url}`);
  return { _type: "image", asset: { _type: "reference", _ref: `image-${match[1]}-${match[2]}-${match[3]}` } };
}

async function main() {
  const ids = ["catalog-he", "catalog-en"];
  const before = await writeClient.getDocuments(ids);
  if (before.some((doc) => !doc)) throw new Error("Both published catalogs must exist");
  writeFileSync("/tmp/beeri-catalog-before-product-release.json", JSON.stringify(before, null, 2));
  let transaction = writeClient.transaction();
  for (const [index, locale] of (["he", "en"] as const).entries()) {
    const doc = before[index]!;
    const productCategories = content[locale].map((category) => ({
      ...category, _key: category.key, _type: "productCatalogCategory",
      products: category.products.map((product) => ({
        ...product, _key: product.key, _type: "packagingType",
        examples: product.examples.map((example) => ({
          ...example, _key: example.key, _type: "packagingExample", image: imageRef(example.image),
        })),
      })),
    }));
    transaction = transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({ productCategories }));
  }
  await transaction.commit();
  console.log("Published Hebrew and English product categories; existing content preserved.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
