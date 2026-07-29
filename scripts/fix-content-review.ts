// scripts/fix-content-review.ts
//
// One-off: push the 2026-06-11 content-review fixes into the live Sanity
// dataset (the site reads Sanity first; app/content/* are only fallbacks).
// Patches, per locale:
//   catalog  — intro (no phantom pharma category), spec card (ISO instead of
//              the invented BR-2026 id), honest tolerances (±0.1 mm), real
//              facts instead of invented 24h/72h commitments, and the CTA
//              relabel ("request" instead of "download PDF").
//   posts    — honest read times (2 min), unified quote attribution, and two
//              distinct section images where the quote image was duplicated.
//   careers  — #BR-312 files under production (its title says production).
//
// Values are imported from the corrected fallback files so both layers stay
// in sync. Run: npx tsx scripts/fix-content-review.ts

import { readFileSync } from "node:fs";
import path from "node:path";
import { writeClient, repoRoot } from "./lib/sanity-write-client";
import { catalogCopy } from "../app/content/catalog";
import { blogPosts } from "../app/content/blog";
import { careersCopy } from "../app/content/careers";

const LANGS = ["he", "en"] as const;

async function patchCatalog() {
  for (const lang of LANGS) {
    const copy = catalogCopy[lang];
    const sets: Record<string, unknown> = {
      intro: copy.intro,
    };
    for (const cat of copy.categories) {
      for (const item of cat.items) {
        const base = `categories[key=="${cat.key}"].items[key=="${item.key}"]`;
        if (item.specs) sets[`${base}.specs`] = item.specs.map((s) => ({ ...s }));
        if (item.overlaySpecs) sets[`${base}.overlaySpecs`] = [...item.overlaySpecs];
        if (item.cta) sets[`${base}.cta`] = item.cta;
      }
    }
    await writeClient.patch(`catalog-${lang}`).set(sets).commit({ autoGenerateArrayKeys: true });
    console.log(`✓ catalog-${lang}: intro, item specs/cta`);
  }
}

async function patchPosts() {
  // Upload the two replacement section images once, reuse across locales.
  const uploads: Record<string, string> = {};
  const needed: Record<string, string> = {
    "from-sketch-to-prototype":
      "/images/generated/hero-new-style/hero-new-style-05-diecut-process.png",
    "display-windows":
      "/images/generated/website-content/packaging/beer-carrier-window-carton.png",
  };
  for (const [slug, rel] of Object.entries(needed)) {
    const buffer = readFileSync(path.join(repoRoot, "public", rel));
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: path.basename(rel),
    });
    uploads[slug] = asset._id;
    console.log(`✓ uploaded ${path.basename(rel)} → ${asset._id}`);
  }

  for (const post of blogPosts) {
    for (const lang of LANGS) {
      const id = `post-${post.slug}-${lang}`;
      const sets: Record<string, unknown> = { read: post.read[lang] };
      const cite = post[lang].quote?.cite;
      if (cite) sets["quote.cite"] = cite;
      if (uploads[post.slug]) {
        sets["sections[0].image"] = {
          _type: "image",
          asset: { _type: "reference", _ref: uploads[post.slug] },
        };
      }
      await writeClient.patch(id).set(sets).commit();
      console.log(`✓ ${id}: read="${post.read[lang]}"${uploads[post.slug] ? " + section image" : ""}`);
    }
  }
}

async function patchCareers() {
  for (const lang of LANGS) {
    const role = careersCopy[lang].roles.find((r) => r.code === "#BR-312");
    if (!role) continue;
    await writeClient
      .patch(`careers-${lang}`)
      .set({ 'roles[code=="#BR-312"].department': role.department })
      .commit();
    console.log(`✓ careers-${lang}: #BR-312 department="${role.department}"`);
  }
}

async function main() {
  await patchCatalog();
  await patchPosts();
  await patchCareers();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
