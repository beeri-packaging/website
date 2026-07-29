// scripts/apply-catalog-intro-2026-07-29.ts
// PRO-170 — align the catalog intro to the client's exact wording.
// Four small deviations from her text had crept in: a stray comma after
// "בתחום הפארמה", "מירבי" for "מרבי", a hyphen where she used an em dash,
// and "וליצרני" for "ליצרני". The eyebrow already matches ("קטלוג", no year),
// and the spec card she asked to remove is already gone from the page — this
// commit drops its leftover field from the schema and content types.
import { writeClient } from "./lib/sanity-write-client";
import { catalogCopy } from "../app/content/catalog";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];

async function main() {
  for (const lang of LANGS) {
    await writeClient
      .patch(`catalog-${lang}`)
      .set({ intro: catalogCopy[lang].intro })
      .unset(["specCard"])
      .commit();
    console.log(`  ⟳ catalog-${lang}: intro aligned, specCard unset`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
