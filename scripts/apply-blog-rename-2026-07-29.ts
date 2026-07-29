// scripts/apply-blog-rename-2026-07-29.ts
// Client content review (Michal) — the blog batch: PRO-178, 179, 180, 181.
// Targeted and additive: touches only the fields those four issues name.
//
//   PRO-178  blogSettings-{he,en}: eyebrow + title → "בלוג" / "בארי מספרת"
//   PRO-178  siteSettings navLinks: the /blog link → "בלוג" / "Blog"
//   PRO-179  post-anatomy-of-a-wine-carton-{he,en}: excerpt + section 01 heading
//   PRO-181  post-anatomy-of-a-wine-carton-he: section 01 body, "דייליין" → "שרטוט"
//
// PRO-180 (newsletter heading) and the search placeholder are static UI chrome
// in app/content/blog.ts (insightsChrome) — not stored in Sanity, nothing to patch.
import { writeClient } from "./lib/sanity-write-client";
import { blogIndexCopy, getBlogPost } from "../app/content/blog";
import { navLinks } from "../app/content/site";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const WINE_SLUG = "anatomy-of-a-wine-carton";

type Section = { _key: string; heading?: string; body?: string };

async function main() {
  // 1. Blog index eyebrow + title (PRO-178).
  for (const lang of LANGS) {
    const bi = blogIndexCopy[lang];
    await writeClient
      .patch(`blogSettings-${lang}`)
      .set({ eyebrow: bi.eyebrow, title: [...bi.title] })
      .commit();
    console.log(`  ⟳ blogSettings-${lang}: eyebrow="${bi.eyebrow}" title=${JSON.stringify(bi.title)}`);
  }

  // 2. Nav label (PRO-178).
  const blogNav = navLinks.find((l) => l.href === "/blog");
  if (!blogNav) throw new Error("No /blog entry in app/content/site.ts navLinks");
  const siteDocs = await writeClient.fetch<
    { _id: string; navLinks?: { _key: string; he: string; href: string }[] }[]
  >(`*[_type == "siteSettings"]{_id, navLinks}`);
  for (const doc of siteDocs) {
    const link = (doc.navLinks ?? []).find((l) => l.href === "/blog");
    if (!link) {
      console.log(`  – ${doc._id}: no /blog navLink, skipped`);
      continue;
    }
    await writeClient
      .patch(doc._id)
      .set({
        [`navLinks[_key=="${link._key}"].he`]: blogNav.he,
        [`navLinks[_key=="${link._key}"].en`]: blogNav.en,
      })
      .commit();
    console.log(`  ⟳ ${doc._id}: nav "${link.he}" → "${blogNav.he}"`);
  }

  // 3. Wine post excerpt + section 01 (PRO-179, PRO-181).
  const post = getBlogPost(WINE_SLUG);
  if (!post) throw new Error(`Post "${WINE_SLUG}" not found in blogPosts`);

  for (const lang of LANGS) {
    const L = post[lang];
    const section = L.sections?.[0];
    if (!section) throw new Error(`Post "${WINE_SLUG}" (${lang}) has no section 01`);

    const id = `post-${WINE_SLUG}-${lang}`;
    const live = await writeClient.fetch<{ sections?: Section[] } | null>(
      `*[_id == $id][0]{sections[]{_key, heading, body}}`,
      { id },
    );
    const liveKey = live?.sections?.[0]?._key;
    if (!liveKey) throw new Error(`${id}: no sections[0] in Sanity — re-seed the post first`);

    await writeClient
      .patch(id)
      .set({
        excerpt: L.excerpt,
        [`sections[_key=="${liveKey}"].heading`]: section.heading,
        [`sections[_key=="${liveKey}"].body`]: section.body,
      })
      .commit();
    console.log(`  ⟳ ${id}: excerpt + section "${section.heading}"`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
