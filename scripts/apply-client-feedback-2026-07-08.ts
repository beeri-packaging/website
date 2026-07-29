// Apply the July 8 client feedback to the live Sanity dataset.
//
// This patches only the CMS documents that currently override the bundled
// fallback content. It preserves the existing heroVideo field while replacing
// the selected home images and catalog hero copy.
//
// Run: npx tsx scripts/apply-client-feedback-2026-07-08.ts

import { catalogCopy } from "../app/content/catalog";
import {
  capabilities,
  faqItems,
  homeCopy,
  journeyPanels,
  type Lang,
} from "../app/content/home";
import { uploadImage, type ImageRef } from "./lib/upload-images";
import { writeClient } from "./lib/sanity-write-client";

const LANGS: readonly Lang[] = ["he", "en"];

async function targetIds(baseId: string) {
  const draftId = `drafts.${baseId}`;
  const draftExists = await writeClient.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    { id: draftId },
  );
  return draftExists ? [baseId, draftId] : [baseId];
}

function homeSetsFor(
  lang: Lang,
  journeyImages: Record<string, ImageRef>,
  bentoServiceImage: ImageRef,
  heroVideo?: unknown,
) {
  const t = homeCopy[lang];

  return {
    eyebrow: t.eyebrow,
    h1: [...t.h1],
    cta1: t.cta1,
    cta2: t.cta2,
    scroll: t.scroll,
    contact: t.contact,
    journeyEyebrow: t.journeyEyebrow,
    journeyTitle: t.journeyTitle,
    journeyDesc: t.journeyDesc,
    techTitle: t.techTitle,
    techBody: t.techBody,
    bento1Title: t.bento1Title,
    bento1Body: t.bento1Body,
    bento2Title: t.bento2Title,
    bento2Body: t.bento2Body,
    badge1: t.badge1,
    badge2: t.badge2,
    faqEyebrow: t.faqEyebrow,
    faqTitle: t.faqTitle,
    faqBody: t.faqBody,
    ctaTitle: [...t.ctaTitle],
    capabilities: capabilities.map((c) => ({
      _type: "capability" as const,
      _key: c.n,
      n: c.n,
      title: c[lang].title,
      body: c[lang].body,
    })),
    faqItems: faqItems.map((f) => ({
      _type: "faqItem" as const,
      _key: f.n,
      n: f.n,
      q: f[lang].q,
      a: f[lang].a,
    })),
    journeyPanels: journeyPanels.map((p) => ({
      _type: "journeyPanel" as const,
      _key: p.key,
      key: p.key,
      image: journeyImages[p.key],
      theme: p.theme,
      accent: p.accent,
      tagColor: p.tagColor,
      tag: p[lang].tag,
      title: p[lang].title,
      body: p[lang].body,
      link: p[lang].link,
    })),
    bentoServiceImage,
    ...(heroVideo ? { heroVideo } : {}),
  };
}

async function patchHome() {
  console.log("Uploading July 8 home images...");
  const journeyImages: Record<string, ImageRef> = {};

  for (const panel of journeyPanels) {
    journeyImages[panel.key] = await uploadImage(panel.src, panel.he.title);
  }

  const bentoServiceImage = await uploadImage(
    "/images/generated/client-feedback-2026-07-08/development-lab-workbench.webp",
    "מעבדת פיתוח אריזה",
  );

  for (const lang of LANGS) {
    const publishedId = `home-${lang}`;
    const heroVideo = await writeClient.fetch<unknown>(
      `*[_id == $id][0].heroVideo`,
      { id: publishedId },
    );

    for (const id of await targetIds(publishedId)) {
      await writeClient
        .patch(id)
        .set(homeSetsFor(lang, journeyImages, bentoServiceImage, heroVideo))
        .commit({ autoGenerateArrayKeys: true });
      console.log(`✓ patched ${id}`);
    }
  }
}

async function patchCatalog() {
  for (const lang of LANGS) {
    const copy = catalogCopy[lang];
    const sets = {
      eyebrow: copy.eyebrow,
      title: [...copy.title],
      intro: copy.intro,
    };

    for (const id of await targetIds(`catalog-${lang}`)) {
      await writeClient.patch(id).set(sets).commit();
      console.log(`✓ patched ${id}`);
    }
  }
}

async function verify() {
  const home = await writeClient.fetch<{
    heroVideoFilename?: string;
    bentoFilename?: string;
    journeyFilenames?: Array<{ key: string; filename?: string }>;
  }>(
    `*[_id == "home-he"][0]{
      "heroVideoFilename": heroVideo.asset->originalFilename,
      "bentoFilename": bentoServiceImage.asset->originalFilename,
      "journeyFilenames": journeyPanels[]{ key, "filename": image.asset->originalFilename }
    }`,
  );
  const catalog = await writeClient.fetch<{
    eyebrow?: string;
    intro?: string;
  }>(`*[_id == "catalog-he"][0]{ eyebrow, intro }`);

  console.log("Sanity verification:");
  console.log(JSON.stringify({ home, catalog }, null, 2));

  if (catalog?.eyebrow !== catalogCopy.he.eyebrow) {
    throw new Error("Sanity verification failed: catalog eyebrow not patched");
  }
  if (!catalog?.intro?.includes("אינדקס אריזות הקרטון הממותגות שלנו מציע")) {
    throw new Error("Sanity verification failed: catalog intro not patched");
  }
  if (home?.bentoFilename !== "development-lab-workbench.webp") {
    throw new Error("Sanity verification failed: home bento image not patched");
  }
  if (!home?.heroVideoFilename) {
    throw new Error("Sanity verification failed: heroVideo was not preserved");
  }
}

async function main() {
  await patchHome();
  await patchCatalog();
  await verify();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
