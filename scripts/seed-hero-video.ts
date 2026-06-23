// scripts/seed-hero-video.ts
// Upload the web-optimized hero background video to Sanity and attach it to
// both home documents (he + en). Re-run after re-encoding the file.
// Run: npx tsx scripts/seed-hero-video.ts [path-to-mp4]
import { readFileSync } from "node:fs";
import { writeClient } from "./lib/sanity-write-client";
import type { Lang } from "../app/content/home";

const VIDEO_PATH = process.argv[2] ?? "/tmp/beeri-hero-final.mp4";
const LANGS: Lang[] = ["he", "en"];

async function main() {
  console.log(`Uploading hero video (${VIDEO_PATH}) to Sanity…`);
  const buffer = readFileSync(VIDEO_PATH);
  const asset = await writeClient.assets.upload("file", buffer, {
    filename: "beeri-hero.mp4",
    contentType: "video/mp4",
  });
  console.log("Uploaded asset:", asset._id);
  console.log("URL:", asset.url);

  for (const lang of LANGS) {
    await writeClient
      .patch(`home-${lang}`)
      .set({
        heroVideo: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        },
      })
      .commit();
    console.log(`Patched home-${lang}.heroVideo`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
