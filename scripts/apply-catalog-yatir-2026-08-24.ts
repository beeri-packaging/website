// Resolve PRO-426: turn the mislabeled beverage-finishing card into the
// Yatir Winery package, move it to the wineries category, and update both
// localized Sanity catalog documents.
//
// Run:
//   npx tsx scripts/apply-catalog-yatir-2026-08-24.ts

import { writeClient } from "./lib/sanity-write-client";

type CatalogItem = {
  _key: string;
  _type?: string;
  [field: string]: unknown;
};

type CatalogCategory = {
  _key: string;
  count?: string;
  items?: CatalogItem[];
};

type CatalogDocument = {
  categories?: CatalogCategory[];
};

const locales = ["he", "en"] as const;
const oldItemKey = "beverage-finishing";
const newItemKey = "wine-yatir";
const sourceCategoryKey = "beverages";
const targetCategoryKey = "spirits";
const filename = "beeri-catalog-beverage-finishing-ai.png";

const localized = {
  he: {
    name: "יקב יתיר",
    description:
      "מארז יתיר ייחודי לשני בקבוקי יין ושתי כוסות, הכולל השבחות והבלטות בלוגו האריה המיוחד של היקב.",
    alt: "תקריב השבחות והבלטות בלוגו האריה של יקב יתיר",
    tag: "השבחות",
    sourceCount: "2 פריטים",
    targetCount: "7 פריטים",
  },
  en: {
    name: "Yatir Winery",
    description:
      "A distinctive Yatir package for two wine bottles and two glasses, featuring premium finishes and embossing of the winery’s signature lion logo.",
    alt: "Close-up of finishes and embossing on Yatir Winery’s lion logo",
    tag: "Finishes",
    sourceCount: "2 items",
    targetCount: "7 items",
  },
} as const;

async function main() {
  const asset = await writeClient.fetch<{ _id: string; url: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{ _id, url }`,
    { filename },
  );
  if (!asset) throw new Error(`Existing catalog image not found: ${filename}`);

  for (const locale of locales) {
    const documentId = `catalog-${locale}`;
    const document = await writeClient.getDocument<CatalogDocument>(documentId);
    const categories = document?.categories;
    if (!categories) throw new Error(`${documentId}: categories not found`);

    const sourceCategory = categories.find((category) => category._key === sourceCategoryKey);
    const targetCategory = categories.find((category) => category._key === targetCategoryKey);
    if (!sourceCategory || !targetCategory) {
      throw new Error(`${documentId}: source or target category not found`);
    }

    const oldItem = sourceCategory.items?.find((item) => item._key === oldItemKey);
    const existingNewItem = targetCategory.items?.find((item) => item._key === newItemKey);
    if (!oldItem && !existingNewItem) {
      throw new Error(`${documentId}: neither ${oldItemKey} nor ${newItemKey} found`);
    }

    const copy = localized[locale];
    const yatirItem: CatalogItem = {
      ...(oldItem ?? existingNewItem),
      _key: newItemKey,
      _type: "catalogItem",
      name: copy.name,
      description: copy.description,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: copy.alt,
      },
      tags: [
        {
          _type: "catalogTag",
          _key: "tag-0",
          label: copy.tag,
          tone: "outline",
        },
      ],
    };

    const sourceItems = (sourceCategory.items ?? []).filter(
      (item) => item._key !== oldItemKey && item._key !== newItemKey,
    );
    const targetItems = [
      ...(targetCategory.items ?? []).filter(
        (item) => item._key !== oldItemKey && item._key !== newItemKey,
      ),
      yatirItem,
    ];

    await writeClient
      .patch(documentId)
      .set({
        [`categories[_key == "${sourceCategoryKey}"].items`]: sourceItems,
        [`categories[_key == "${sourceCategoryKey}"].count`]: copy.sourceCount,
        [`categories[_key == "${targetCategoryKey}"].items`]: targetItems,
        [`categories[_key == "${targetCategoryKey}"].count`]: copy.targetCount,
      })
      .commit();
  }

  const verification = await writeClient.fetch(
    `*[_id in $documentIds] | order(_id asc){
      "id": _id,
      "wineriesCount": categories[_key == $targetCategoryKey][0].count,
      "beveragesCount": categories[_key == $sourceCategoryKey][0].count,
      "yatir": categories[_key == $targetCategoryKey][0].items[_key == $newItemKey][0]{
        name,
        description,
        tags,
        "imageUrl": image.asset->url,
        "alt": image.alt
      },
      "oldItemRemaining": count(categories[].items[_key == $oldItemKey])
    }`,
    {
      documentIds: locales.map((locale) => `catalog-${locale}`),
      targetCategoryKey,
      sourceCategoryKey,
      newItemKey,
      oldItemKey,
    },
  );

  console.log(JSON.stringify(verification, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
