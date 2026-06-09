// One-off: re-add the "קריירה / Careers" nav link to /careers in every
// siteSettings doc (it was dropped when the slot was repointed to Insights).
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const links = doc.navLinks ?? [];
    if (links.some((l) => l.href === "/careers")) {
      console.log(`  ✓ ${doc._id}: already has /careers`);
      continue;
    }
    await writeClient
      .patch(doc._id)
      .append("navLinks", [{ _key: "careers", he: "קריירה", en: "Careers", href: "/careers" }])
      .commit();
    console.log(`  ⟳ ${doc._id}: appended Careers → /careers`);
  }
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
