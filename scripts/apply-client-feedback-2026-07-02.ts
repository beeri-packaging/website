// Apply the client feedback captured on 2026-07-02 to the live Sanity dataset.
//
// This is intentionally a patch, not a full reseed: it preserves unrelated
// editor changes and the existing heroVideo file while syncing the fields the
// site reads from Sanity before falling back to app/content/*.
//
// Run: npx tsx scripts/apply-client-feedback-2026-07-02.ts

import { blogPosts } from "../app/content/blog";
import {
  capabilities,
  faqItems,
  homeCopy,
  homeImages,
  journeyPanels,
  type Lang,
} from "../app/content/home";
import { uploadImage, type ImageRef } from "./lib/upload-images";
import { writeClient } from "./lib/sanity-write-client";

const LANGS: readonly Lang[] = ["he", "en"];

const postImagePatches = {
  "recyclable-stock-2026": {
    quoteImage: "/images/generated/website-content/packaging/open-capability-presentation-box.png",
  },
  "display-windows": {
    image: "/images/generated/website-content/packaging/closed-textured-capability-box.png",
  },
} as const;

function homeSetsFor(
  lang: Lang,
  journeyImages: Record<string, ImageRef>,
  bentoServiceImage: ImageRef,
  heroVideo?: unknown,
) {
  const t = homeCopy[lang];

  return {
    eyebrow: t.eyebrow,
    cta1: t.cta1,
    cta2: t.cta2,
    contact: t.contact,
    faqEyebrow: t.faqEyebrow,
    faqTitle: t.faqTitle,
    faqBody: t.faqBody,
    faqItems: faqItems.map((f) => ({
      _type: "faqItem" as const,
      _key: f.n,
      n: f.n,
      q: f[lang].q,
      a: f[lang].a,
    })),
    capabilities: capabilities.map((c) => ({
      _type: "capability" as const,
      _key: c.n,
      n: c.n,
      title: c[lang].title,
      body: c[lang].body,
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
  console.log("Uploading selected homepage images...");
  const bentoServiceImage = await uploadImage(
    homeImages.bentoService,
    "מארז קוסמטיקה עם חלון",
  );

  const journeyImages: Record<string, ImageRef> = {};
  for (const panel of journeyPanels) {
    journeyImages[panel.key] = await uploadImage(panel.src, panel.he.title);
  }

  for (const lang of LANGS) {
    const publishedId = `home-${lang}`;
    const heroVideo = await writeClient.fetch<unknown>(
      `*[_id == $id][0].heroVideo`,
      { id: publishedId },
    );
    const draftExists = await writeClient.fetch<boolean>(
      `defined(*[_id == $id][0]._id)`,
      { id: `drafts.${publishedId}` },
    );
    const ids = draftExists ? [publishedId, `drafts.${publishedId}`] : [publishedId];

    for (const id of ids) {
      await writeClient
        .patch(id)
        .set(homeSetsFor(lang, journeyImages, bentoServiceImage, heroVideo))
        .commit({ autoGenerateArrayKeys: true });
      console.log(`✓ patched ${id}`);
    }
  }
}

async function patchPosts() {
  console.log("Uploading selected blog replacement images...");

  for (const [slug, patch] of Object.entries(postImagePatches)) {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) throw new Error(`Missing fallback post for slug: ${slug}`);

    for (const lang of LANGS) {
      const localized = post[lang];
      const sets: Record<string, unknown> = {};

      if ("image" in patch) {
        sets.image = await uploadImage(patch.image, localized.title);
      }
      if ("quoteImage" in patch) {
        sets.quoteImage = await uploadImage(patch.quoteImage, localized.title);
      }

      await writeClient.patch(`post-${slug}-${lang}`).set(sets).commit();
      console.log(`✓ patched post-${slug}-${lang}`);
    }
  }
}

async function verify() {
  const home = await writeClient.fetch<{
    eyebrow?: string;
    cta1?: string;
    cta2?: string;
    faqCount?: number;
    heroVideoFilename?: string;
    bentoFilename?: string;
    journeyFilenames?: Array<{ key: string; filename?: string }>;
  }>(
    `*[_type == "home" && language == "he" && !(_id in path("drafts.**"))][0]{
      eyebrow,
      cta1,
      cta2,
      "faqCount": count(faqItems),
      "heroVideoFilename": heroVideo.asset->originalFilename,
      "bentoFilename": bentoServiceImage.asset->originalFilename,
      "journeyFilenames": journeyPanels[]{ key, "filename": image.asset->originalFilename }
    }`,
  );

  const posts = await writeClient.fetch<
    Array<{ _id: string; imageFilename?: string; quoteImageFilename?: string }>
  >(
    `*[_id in [
      "post-recyclable-stock-2026-he",
      "post-recyclable-stock-2026-en",
      "post-display-windows-he",
      "post-display-windows-en"
    ]] | order(_id asc) {
      _id,
      "imageFilename": image.asset->originalFilename,
      "quoteImageFilename": quoteImage.asset->originalFilename
    }`,
  );
  const catalog = await writeClient.fetch<Array<{ _id: string; intro?: string }>>(
    `*[_id in ["catalog-he", "catalog-en"]] | order(_id asc) { _id, intro }`,
  );

  console.log("Sanity verification:");
  console.log(JSON.stringify({ home, posts, catalog }, null, 2));

  if (home?.cta1 !== homeCopy.he.cta1 || home?.cta2 !== homeCopy.he.cta2) {
    throw new Error("Sanity verification failed: home CTA labels are not patched");
  }
  if (home?.faqCount !== faqItems.length) {
    throw new Error("Sanity verification failed: home FAQ count is not patched");
  }
}

async function main() {
  await patchHome();
  await patchPosts();
  await verify();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
