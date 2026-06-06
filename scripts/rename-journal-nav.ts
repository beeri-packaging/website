// scripts/rename-journal-nav.ts
// One-off: rename the /careers nav label from "ג׳ורנל" to "יומן" (Hebrew only;
// English stays "Journal"). Patches the navLink in both siteSettings docs.
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const link = (doc.navLinks ?? []).find((l) => l.href === "/careers");
    if (!link) {
      console.log(`  – ${doc._id}: no /careers navLink, skipped`);
      continue;
    }
    if (link.he === "יומן") {
      console.log(`  ✓ ${doc._id}: already "יומן"`);
      continue;
    }
    await writeClient
      .patch(doc._id)
      .set({ [`navLinks[_key=="${link._key}"].he`]: "יומן" })
      .commit();
    console.log(`  ⟳ ${doc._id}: "${link.he}" → "יומן"`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
