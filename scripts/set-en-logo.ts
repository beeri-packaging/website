/**
 * Replace the English logo (Figma node 1080:1180 — "Beeri Packaging", vivid
 * brand palette, no tagline) on both siteSettings documents.
 *
 * The live EN header + footer read `logoEn` from Sanity, so updating
 * public/images/logo-en.svg (the code fallback) alone does not change the live
 * site. This uploads the new SVG and repoints `logoEn` on siteSettings-en and
 * siteSettings-he at the fresh asset.
 *
 *   npx tsx scripts/set-en-logo.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { writeClient, repoRoot } from "./lib/sanity-write-client";

async function main() {
  const svgPath = path.join(repoRoot, "public", "images", "logo-en.svg");
  const svg = readFileSync(svgPath);

  console.log("Uploading new EN logo to Sanity…");
  const asset = await writeClient.assets.upload("image", svg, {
    filename: "logo-en.svg",
    contentType: "image/svg+xml",
  });
  console.log(`  asset: ${asset._id}`);

  const logoEn = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };

  for (const id of ["siteSettings-en", "siteSettings-he"]) {
    await writeClient.patch(id).set({ logoEn }).commit();
    console.log(`  patched ${id}.logoEn`);
  }

  console.log("Done. Live in ~30–60s (ISR revalidate + Sanity CDN).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
