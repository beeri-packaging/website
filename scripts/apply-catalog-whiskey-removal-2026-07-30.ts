// scripts/apply-catalog-whiskey-removal-2026-07-30.ts
// Client content review (Michal) — PRO-171, first half.
//
// She asked to drop the whiskey pack from catalog category 02 entirely. The
// replacement she wants in its place ("בירות" — a six-pack carrier) is still
// waiting on the Tempo / Carlsberg photos, so this only removes; the beers
// item lands in a follow-up once the images arrive.
//
// Removing the item leaves the category with one card, so `count` moves to
// "פריט אחד" / "1 item" alongside it. Values come from the fallback file so
// both layers keep saying the same thing.
//
// Run: npx tsx scripts/apply-catalog-whiskey-removal-2026-07-30.ts
import { writeClient } from "./lib/sanity-write-client";
import { catalogCopy } from "../app/content/catalog";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const CATEGORY_KEY = "spirits";
const ITEM_KEY = "whiskey";

async function main() {
  for (const lang of LANGS) {
    const id = `catalog-${lang}`;
    const category = catalogCopy[lang].categories.find((c) => c.key === CATEGORY_KEY);
    if (!category) throw new Error(`No "${CATEGORY_KEY}" category in app/content/catalog.ts (${lang})`);
    if (category.items.some((i) => i.key === ITEM_KEY)) {
      throw new Error(`"${ITEM_KEY}" is still in the fallback copy (${lang}) — remove it there first`);
    }

    await writeClient
      .patch(id)
      .unset([`categories[key=="${CATEGORY_KEY}"].items[key=="${ITEM_KEY}"]`])
      .set({ [`categories[key=="${CATEGORY_KEY}"].count`]: category.count })
      .commit();

    const live = await writeClient.fetch<{ items?: { key?: string }[]; count?: string } | null>(
      `*[_id == $id][0].categories[key == $cat][0]{count, items[]{key}}`,
      { id, cat: CATEGORY_KEY },
    );
    const keys = (live?.items ?? []).map((i) => i.key).join(", ");
    console.log(`  ⟳ ${id}: count="${live?.count}" items=[${keys}]`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
