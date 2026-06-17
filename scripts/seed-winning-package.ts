// scripts/seed-winning-package.ts
//
// Targeted, idempotent seed for the award-winning "Gabriel pack" content —
// avoids the full `seed-all` (which rewrites every CMS doc and re-uploads all
// images). It only:
//   1. upserts the post `winning-package-star-of-israel` (he + en) + its images,
//   2. links the he/en translation pair for that post,
//   3. patches the catalog's `modular` category (name, count, items) in place.
//
// Everything else in the dataset is left untouched. Reads the copy straight
// from the bundled content files so it stays in sync with the repo.
//
//   NEXT_PUBLIC_SANITY_PROJECT_ID=4qkb39ql NEXT_PUBLIC_SANITY_DATASET=production \
//   SANITY_API_WRITE_TOKEN=<editor-token> npm run seed:winning-package
import { writeClient } from "./lib/sanity-write-client";
import { uploadImage } from "./lib/upload-images";
import { blogPosts } from "../app/content/blog";
import { catalogCopy } from "../app/content/catalog";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const POST_SLUG = "winning-package-star-of-israel";
const CAT_KEY = "modular";

async function main() {
  const post = blogPosts.find((p) => p.slug === POST_SLUG);
  if (!post) throw new Error(`Post "${POST_SLUG}" not found in app/content/blog.ts`);

  // Shared images (cached across locales by the uploader).
  const heroImg = post.image ? await uploadImage(post.image, post.he.title) : undefined;
  const quoteImg = post.quoteImage ? await uploadImage(post.quoteImage, post.he.title) : undefined;

  for (const lang of LANGS) {
    const L = post[lang];

    // POST
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
      _id: `post-${POST_SLUG}-${lang}`, _type: "post", language: lang,
      slug: { _type: "slug", current: POST_SLUG },
      date: post.date, read: post.read[lang], category: post.category,
      ...(post.author ? { author: post.author[lang] } : {}),
      ...(post.credit ? { credit: post.credit[lang] } : {}),
      ...(heroImg ? { image: heroImg } : {}),
      ...(quoteImg ? { quoteImage: quoteImg } : {}),
      title: L.title, excerpt: L.excerpt, body: [...L.body],
      ...(L.quote ? { quote: { text: L.quote.text, cite: L.quote.cite } } : {}),
      ...(sections ? { sections } : {}),
    });

    // CATALOG — patch only the modular category in place.
    const cat = catalogCopy[lang].categories.find((c) => c.key === CAT_KEY);
    if (!cat) throw new Error(`Category "${CAT_KEY}" not found in app/content/catalog.ts (${lang})`);
    await writeClient
      .patch(`catalog-${lang}`)
      .set({
        [`categories[_key=="${CAT_KEY}"].name`]: cat.name,
        [`categories[_key=="${CAT_KEY}"].count`]: cat.count,
        [`categories[_key=="${CAT_KEY}"].items`]: cat.items.map((it) => ({
          _type: "catalogItem", _key: it.key, key: it.key, name: it.name,
          ...(it.series ? { series: it.series } : {}),
          description: it.description,
          ...(it.specs
            ? { specs: it.specs.map((s, i) => ({ _type: "catalogSpec", _key: `spec-${i}`, label: s.label, value: s.value })) }
            : {}),
        })),
      })
      .commit();

    console.log(`  ✓ post + catalog patched for ${lang}`);
  }

  // Link the he/en translation pair so the Studio shows them as one document.
  await writeClient.createOrReplace({
    _id: `post-${POST_SLUG}-translation`, _type: "translation.metadata", schemaTypes: ["post"],
    translations: [
      { _key: "he", _type: "internationalizedArrayReferenceValue", language: "he",
        value: { _type: "reference", _ref: `post-${POST_SLUG}-he`, _weak: true, _strengthenOnPublish: { type: "post" } } },
      { _key: "en", _type: "internationalizedArrayReferenceValue", language: "en",
        value: { _type: "reference", _ref: `post-${POST_SLUG}-en`, _weak: true, _strengthenOnPublish: { type: "post" } } },
    ],
  });

  // Read back for confirmation.
  const check = await writeClient.fetch(
    `{
      "posts": *[_type == "post" && slug.current == $slug]{ language, title },
      "modular": *[_type == "catalog"]{ language, "item": categories[key == $key][0].items[0]{ key, name } }
    }`,
    { slug: POST_SLUG, key: CAT_KEY }
  );
  console.log("Verification:", JSON.stringify(check, null, 2));
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
