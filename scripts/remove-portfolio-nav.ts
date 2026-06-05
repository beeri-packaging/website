// One-off: remove the /portfolio nav link from the Sanity siteSettings docs.
// The header menu is Sanity-driven (toChrome prefers siteSettings.navLinks),
// so deleting the route + bundled nav constant isn't enough — the seeded docs
// still carry it. Run once: `npx tsx scripts/remove-portfolio-nav.ts`.
import { writeClient } from "./lib/sanity-write-client";

async function main() {
  for (const id of ["siteSettings-he", "siteSettings-en"]) {
    const res = await writeClient
      .patch(id)
      .unset(['navLinks[href=="/portfolio"]'])
      .commit({ autoGenerateArrayKeys: false });
    const remaining = (res.navLinks as { href: string }[] | undefined)?.map((n) => n.href) ?? [];
    console.log(`✓ ${id} → navLinks: ${remaining.join(", ")}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
