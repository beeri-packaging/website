// scripts/seed-insights-update.ts
// Targeted, additive update for the Insights (תובנות) rename — does NOT touch
// home/careers/catalog/finishing/footer or prune any docs.
//   1. Patches blogSettings-{he,en}: eyebrow + title + lead + body only.
//   2. Creates the two new posts (from-sketch-to-prototype, display-windows)
//      for both locales + their image uploads.
//   3. Links the translation pair for each new post.
// Run the nav label separately via scripts/rename-journal-to-insights-nav.ts.
import { writeClient } from "./lib/sanity-write-client";
import { uploadImage } from "./lib/upload-images";
import { blogIndexCopy, blogPosts } from "../app/content/blog";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const NEW_SLUGS = ["from-sketch-to-prototype", "display-windows"];

async function linkTranslations(id: string, type: string, heId: string, enId: string) {
  await writeClient.createOrReplace({
    _id: id, _type: "translation.metadata", schemaTypes: [type],
    translations: [
      { _key: "he", _type: "internationalizedArrayReferenceValue", language: "he",
        value: { _type: "reference", _ref: heId, _weak: true, _strengthenOnPublish: { type } } },
      { _key: "en", _type: "internationalizedArrayReferenceValue", language: "en",
        value: { _type: "reference", _ref: enId, _weak: true, _strengthenOnPublish: { type } } },
    ],
  });
}

async function main() {
  const newPosts = blogPosts.filter((p) => NEW_SLUGS.includes(p.slug));
  if (newPosts.length !== NEW_SLUGS.length) {
    throw new Error(`Expected ${NEW_SLUGS.length} new posts in blogPosts, found ${newPosts.length}`);
  }

  for (const lang of LANGS) {
    // 1. Blog index copy — only the renamed fields.
    const bi = blogIndexCopy[lang];
    await writeClient
      .patch(`blogSettings-${lang}`)
      .set({ eyebrow: bi.eyebrow, title: [...bi.title], lead: bi.lead, body: bi.body })
      .commit();
    console.log(`  ⟳ blogSettings-${lang}: eyebrow/title/lead/body → Insights`);

    // 2. New posts.
    for (const p of newPosts) {
      const L = p[lang];
      const heroImg = p.image ? await uploadImage(p.image, L.title) : undefined;
      const quoteImg = p.quoteImage ? await uploadImage(p.quoteImage, L.title) : undefined;
      const sections = L.sections
        ? await Promise.all(
            L.sections.map(async (s, i) => ({
              _type: "section", _key: `sec-${i}`,
              heading: s.heading, body: s.body,
              ...(s.image ? { image: await uploadImage(s.image, s.heading) } : {}),
            }))
          )
        : undefined;
      await writeClient.createOrReplace({
        _id: `post-${p.slug}-${lang}`, _type: "post", language: lang,
        slug: { _type: "slug", current: p.slug },
        date: p.date, read: p.read[lang], category: p.category,
        ...(p.author ? { author: p.author[lang] } : {}),
        ...(p.credit ? { credit: p.credit[lang] } : {}),
        ...(heroImg ? { image: heroImg } : {}),
        ...(quoteImg ? { quoteImage: quoteImg } : {}),
        title: L.title, excerpt: L.excerpt, body: [...L.body],
        ...(L.quote ? { quote: { text: L.quote.text, cite: L.quote.cite } } : {}),
        ...(sections ? { sections } : {}),
      });
      console.log(`  ✓ post-${p.slug}-${lang}`);
    }
  }

  // 3. Translation links for the new posts.
  for (const p of newPosts) {
    await linkTranslations(`post-${p.slug}-translation`, "post", `post-${p.slug}-he`, `post-${p.slug}-en`);
    console.log(`  ⟳ linked post-${p.slug}-translation`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
