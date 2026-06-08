// scripts/reorder-about-nav-first.ts
// One-off: move the /about nav link to the FIRST position in the Sanity
// siteSettings docs (he + en). The header menu is Sanity-driven
// (toChrome prefers siteSettings.navLinks), so reordering the bundled nav
// constant isn't enough — the seeded docs must be reordered too.
// Idempotent. Run once: `npx tsx scripts/reorder-about-nav-first.ts`.
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const links = doc.navLinks ?? [];
    const idx = links.findIndex((l) => l.href === "/about");
    if (idx === -1) {
      console.log(`  - ${doc._id}: no /about navLink, skipped`);
      continue;
    }
    if (idx === 0) {
      console.log(`  ✓ ${doc._id}: /about already first, skipped`);
      continue;
    }
    const about = links[idx];
    const reordered = [about, ...links.filter((_, i) => i !== idx)];
    const res = await writeClient
      .patch(doc._id)
      .set({ navLinks: reordered })
      .commit({ autoGenerateArrayKeys: false });
    const hrefs = (res.navLinks as NavLink[] | undefined)?.map((n) => n.href) ?? [];
    console.log(`  ⟳ ${doc._id}: navLinks → ${hrefs.join(", ")}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
