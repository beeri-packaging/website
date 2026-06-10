// scripts/set-journal-featured-image.ts
//
// One-off: set the journal's featured post (finishing-language) hero image to
// the advent-calendar artwork from the Figma journal design (node 388:271).
// The PNG is read from a local path (exported from Figma, not kept in the repo).
//
// Run: npx tsx scripts/set-journal-featured-image.ts /path/to/image.png

import { readFileSync } from "node:fs";
import { writeClient } from "./lib/sanity-write-client";

const SLUG = "finishing-language";
const ALT = {
  he: "אריזת קרטון ממותגת בהדפס פרחוני כהה עם ספרות זהב מוטבעות",
  en: "Branded carton box in a dark floral print with gold-foil numerals",
} as const;

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npx tsx scripts/set-journal-featured-image.ts <image.png>");

  const buffer = readFileSync(file);
  const asset = await writeClient.assets.upload("image", buffer, {
    filename: "journal-featured-advent-calendar.png",
  });
  console.log(`uploaded asset ${asset._id}`);

  for (const lang of ["he", "en"] as const) {
    const id = `post-${SLUG}-${lang}`;
    await writeClient
      .patch(id)
      .set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: ALT[lang],
        },
      })
      .commit();
    console.log(`✓ patched ${id}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
