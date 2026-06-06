// scripts/add-about-nav.ts
// One-off: add the /about nav link to the Sanity siteSettings docs (he + en).
// The header menu is Sanity-driven (toChrome prefers siteSettings.navLinks), so
// adding the route + bundled nav constant isn't enough — the seeded docs must
// carry it too. Idempotent. Run once: `npx tsx scripts/add-about-nav.ts`.
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

const ABOUT: NavLink & { _type: "navLink" } = {
  _type: "navLink",
  _key: "nav-about",
  he: "אודות",
  en: "About",
  href: "/about",
};

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const has = (doc.navLinks ?? []).some((l) => l.href === "/about");
    if (has) {
      console.log(`  ✓ ${doc._id}: /about navLink already present, skipped`);
      continue;
    }
    const res = await writeClient
      .patch(doc._id)
      .setIfMissing({ navLinks: [] })
      .insert("after", "navLinks[-1]", [ABOUT])
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
