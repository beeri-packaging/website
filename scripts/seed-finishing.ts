// scripts/seed-finishing.ts
// Re-seed only the /finishing (השבחות) Sanity docs from the bundled finishingCopy.
// Run: npx tsx scripts/seed-finishing.ts
import { writeClient } from "./lib/sanity-write-client";
import { uploadImage, type ImageRef } from "./lib/upload-images";
import { finishingCopy, finishingImages } from "../app/content/finishing";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];

async function main() {
  console.log("Uploading finishing images...");
  const finFoil = await uploadImage(finishingImages.foil, "פויל והשבחה דיגיטלית");
  const finDeboss = await uploadImage(finishingImages.deboss, "הטבעה ודיבוס");
  const finTexture = await uploadImage(finishingImages.texture, "פויל");
  const finImg: Record<string, ImageRef> = {
    [finishingImages.foil]: finFoil,
    [finishingImages.deboss]: finDeboss,
    [finishingImages.texture]: finTexture,
  };

  for (const lang of LANGS) {
    const fi = finishingCopy[lang];
    const finItem = (it: typeof fi.feature) => ({
      _type: "finishingItem", eyebrow: it.eyebrow, title: it.title, body: it.body,
      sample: it.sample, cta: it.cta, ...(it.image ? { image: finImg[it.image] } : {}),
    });
    await writeClient.createOrReplace({
      _id: `finishing-${lang}`, _type: "finishing", language: lang,
      step: fi.step, title: [...fi.title], intro: fi.intro,
      feature: finItem(fi.feature),
      metricsTitle: fi.metricsTitle,
      metrics: fi.metrics.map((m, i) => ({ _type: "finishingMetric", _key: `m-${i}`, ...m })),
      quote: fi.quote, quoteBy: fi.quoteBy,
      deboss: finItem(fi.deboss), texture: finItem(fi.texture),
      ctaTitle: fi.ctaTitle, ctaPrimary: fi.ctaPrimary, ctaSecondary: fi.ctaSecondary,
      sampleCard: fi.sampleCard, isoCard: fi.isoCard,
    });
    console.log(`  ✓ finishing-${lang}`);
  }
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
