// One-off: rename the /careers nav label to "ג׳ורנל" / "Journal" in the
// Sanity siteSettings docs (the header menu is Sanity-driven via toChrome).
// Route slug stays /careers. Run: npx tsx scripts/rename-careers-nav.ts
import { writeClient } from "./lib/sanity-write-client";

async function main() {
  for (const [id, he, en] of [
    ["siteSettings-he", "ג׳ורנל", "Journal"],
    ["siteSettings-en", "ג׳ורנל", "Journal"],
  ] as const) {
    const res = await writeClient
      .patch(id)
      .set({
        'navLinks[href=="/careers"].he': he,
        'navLinks[href=="/careers"].en': en,
      })
      .commit({ autoGenerateArrayKeys: false });
    const labels = (res.navLinks as { href: string; he: string; en: string }[] | undefined)?.map(
      (n) => `${n.href}=${n.he}/${n.en}`
    );
    console.log(`✓ ${id} → ${labels?.join(", ")}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
