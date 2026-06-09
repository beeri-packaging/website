// scripts/rename-journal-to-insights-nav.ts
// One-off: repoint the journal/careers nav link to the Insights index.
// Sets he="תובנות", en="Insights", href="/blog" on the matching navLink in
// every siteSettings doc. Matches the old link by its current href.
import { writeClient } from "./lib/sanity-write-client";

type NavLink = { _key: string; he: string; en: string; href: string };

async function main() {
  const docs = await writeClient.fetch<{ _id: string; navLinks?: NavLink[] }[]>(
    `*[_type == "siteSettings"]{_id, navLinks}`,
  );
  for (const doc of docs) {
    const link = (doc.navLinks ?? []).find(
      (l) => l.href === "/careers" || l.href === "/blog",
    );
    if (!link) {
      console.log(`  – ${doc._id}: no journal/careers navLink, skipped`);
      continue;
    }
    await writeClient
      .patch(doc._id)
      .set({
        [`navLinks[_key=="${link._key}"].he`]: "תובנות",
        [`navLinks[_key=="${link._key}"].en`]: "Insights",
        [`navLinks[_key=="${link._key}"].href`]: "/blog",
      })
      .commit();
    console.log(`  ⟳ ${doc._id}: "${link.he}" → "תובנות" (/blog)`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
