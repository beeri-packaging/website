// scripts/update-career-roles.ts
//
// One-off: write the role-specific description + highlights for the three
// open roles into careers-he / careers-en, matching items by code — without
// re-running the full seed, so client edits elsewhere are untouched.
//
// Run: npx tsx scripts/update-career-roles.ts

import { writeClient } from "./lib/sanity-write-client";
import { careersCopy } from "../app/content/careers";

async function main() {
  for (const lang of ["he", "en"] as const) {
    const id = `careers-${lang}`;
    const sets: Record<string, unknown> = {};
    for (const role of careersCopy[lang].roles) {
      if (!role.description) continue;
      sets[`roles[code=="${role.code}"].description`] = role.description;
      sets[`roles[code=="${role.code}"].highlights`] = [...(role.highlights ?? [])];
    }
    const res = await writeClient.patch(id).set(sets).commit({ autoGenerateArrayKeys: false });
    const withDetails = (res.roles as { code: string; description?: string }[]).filter(
      (r) => r.description
    );
    console.log(`✓ ${id}: ${withDetails.length}/3 roles have details`, withDetails.map((r) => r.code));
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
