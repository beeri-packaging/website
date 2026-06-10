// One-off: finalize the "יומן / Journal" rename in Sanity.
//   1. siteSettings nav: drop the /careers link, rename the /blog link to
//      he="יומן", en="Journal".
//   2. blogSettings: patch eyebrow/title/lead/body to the Journal copy.
import { writeClient } from "./lib/sanity-write-client";
import { blogIndexCopy } from "../app/content/blog";
import type { Lang } from "../app/content/home";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const sites = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of sites) {
    const links = doc.navLinks ?? [];
    const careers = links.find((l) => l.href === "/careers");
    const blog = links.find((l) => l.href === "/blog");
    const patch = writeClient.patch(doc._id);
    if (careers) patch.unset([`navLinks[_key=="${careers._key}"]`]);
    if (blog) {
      patch.set({
        [`navLinks[_key=="${blog._key}"].he`]: "יומן",
        [`navLinks[_key=="${blog._key}"].en`]: "Journal",
      });
    }
    await patch.commit();
    console.log(`  ⟳ ${doc._id}: careers ${careers ? "removed" : "absent"}, /blog → יומן/Journal`);
  }

  for (const lang of ["he", "en"] as Lang[]) {
    const bi = blogIndexCopy[lang];
    await writeClient
      .patch(`blogSettings-${lang}`)
      .set({ eyebrow: bi.eyebrow, title: [...bi.title], lead: bi.lead, body: bi.body })
      .commit();
    console.log(`  ⟳ blogSettings-${lang}: copy → Journal`);
  }
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
