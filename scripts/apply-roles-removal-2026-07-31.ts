// scripts/apply-roles-removal-2026-07-31.ts
// Client content review (Michal) — PRO-201.
//
// "כל המשרות כבר לא רלוונטיות אני אשלח לך משרות רלוונטיות חדשות לווטסאפ."
// Clears the three stale roles (#BR-402, #BR-409, #BR-312) off careers-{he,en}.
//
// Both layers have to be emptied, not just this one: toCareersCopy falls back to
// the bundled copy whenever the Sanity array is empty
// (`roles: doc.roles?.length ? doc.roles : fb.roles`), so clearing Sanity alone
// would silently restore the three roles from app/content/careers.ts. The guard
// below refuses to run until that file is emptied first.
//
// The section itself stays (footer links to /blog#roles, e2e asserts the anchor);
// with zero roles the UI hides the department filters and renders the
// `noOpenRoles` empty state with a role-less "send a CV" dialog.
//
// Run: npx tsx scripts/apply-roles-removal-2026-07-31.ts
import { writeClient } from "./lib/sanity-write-client";
import { careersCopy } from "../app/content/careers";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];

async function main() {
  for (const lang of LANGS) {
    if (careersCopy[lang].roles.length > 0) {
      throw new Error(
        `app/content/careers.ts (${lang}) still lists ${careersCopy[lang].roles.length} role(s) — ` +
          `empty the fallback first or toCareersCopy will fall back to them.`,
      );
    }
  }

  for (const lang of LANGS) {
    const id = `careers-${lang}`;
    const live = await writeClient.fetch<{ roles?: { code: string }[] } | null>(
      `*[_id == $id][0]{roles[]{code}}`,
      { id },
    );
    if (!live) throw new Error(`${id} not found in Sanity — re-seed the careers doc first`);

    const had = live.roles ?? [];
    if (had.length === 0) {
      console.log(`  – ${id}: already has no roles, skipped`);
      continue;
    }

    await writeClient.patch(id).set({ roles: [] }).commit();
    console.log(`  ⟳ ${id}: removed ${had.length} role(s) — ${had.map((r) => r.code).join(", ")}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
