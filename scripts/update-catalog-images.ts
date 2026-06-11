// scripts/update-catalog-images.ts
//
// One-off: re-upload the catalog item images (now hi-res, exported from the
// updated Figma catalog design, node 473-111) and point the existing
// catalog-he / catalog-en item image fields at the new assets in place —
// without re-running the full seed, so client edits elsewhere are untouched.
//
// Run: npx tsx scripts/update-catalog-images.ts

import { writeClient } from "./lib/sanity-write-client";
import { uploadImage } from "./lib/upload-images";
import { catalogImages } from "../app/content/catalog";

type ItemPatch = { _key: string; image?: { asset?: { _ref?: string }; alt?: string } };
type CategoryPatch = { _key: string; items?: ItemPatch[] };

async function main() {
  // Upload each hi-res file once; key -> asset ref.
  const refs: Record<string, string> = {};
  for (const [key, publicPath] of Object.entries(catalogImages)) {
    const img = await uploadImage(publicPath, key);
    refs[key] = img.asset._ref;
  }

  for (const lang of ["he", "en"] as const) {
    const id = `catalog-${lang}`;
    const doc = await writeClient.getDocument<{ categories?: CategoryPatch[] }>(id);
    if (!doc?.categories) throw new Error(`${id} has no categories`);

    const sets: Record<string, string> = {};
    for (const cat of doc.categories) {
      for (const item of cat.items ?? []) {
        const ref = refs[item._key];
        if (ref && item.image?.asset) {
          sets[
            `categories[_key=="${cat._key}"].items[_key=="${item._key}"].image.asset._ref`
          ] = ref;
        }
      }
    }
    if (!Object.keys(sets).length) throw new Error(`${id}: no matching items`);
    await writeClient.patch(id).set(sets).commit();
    console.log(`✓ patched ${id} (${Object.keys(sets).length} images)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
