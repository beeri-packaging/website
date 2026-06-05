// One-off: fix the yellow bento card title line-break in Sanity (he).
// Figma breaks "דיוק בדפוס" / "וגימור"; seed had "דיוק" / "בדפוס וגימור".
import { writeClient } from "./lib/sanity-write-client";

async function main() {
  const res = await writeClient
    .patch("careers-he")
    .set({ 'articles[theme=="yellow"].title': ["דיוק בדפוס", "וגימור"] })
    .commit({ autoGenerateArrayKeys: false });
  const yellow = (res.articles as { theme: string; title: string[] }[]).find((a) => a.theme === "yellow");
  console.log("✓ careers-he yellow title:", JSON.stringify(yellow?.title));
}

main().catch((err) => { console.error(err); process.exit(1); });
