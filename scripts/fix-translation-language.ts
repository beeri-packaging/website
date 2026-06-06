// scripts/fix-translation-language.ts
//
// One-off migration: older seeds wrote translation.metadata items with only a
// `_key` and no `language` field. @sanity/document-internationalization v6
// renders the translations preview via `item.language.toUpperCase()`, so a
// missing `language` crashes the Studio. This backfills `language` (and the
// correct item `_type` + weak reference shape) on every translation.metadata.
// Idempotent: items that already have a `language` are left as-is.
import { writeClient } from "./lib/sanity-write-client";

type TItem = {
  _key: string;
  _type?: string;
  language?: string;
  value?: { _ref?: string; _type?: string };
};
type TMeta = { _id: string; schemaTypes?: string[]; translations?: TItem[] };

async function main() {
  const docs = await writeClient.fetch<TMeta[]>(
    `*[_type == "translation.metadata"]{_id, schemaTypes, translations}`,
  );
  console.log(`Found ${docs.length} translation.metadata docs`);

  let patched = 0;
  for (const doc of docs) {
    const type = doc.schemaTypes?.[0];
    const items = doc.translations ?? [];
    const needsFix = items.some((t) => !t.language);
    if (!needsFix) {
      console.log(`  ✓ ${doc._id} already valid`);
      continue;
    }
    const translations = items.map((t) => ({
      _key: t._key,
      _type: "internationalizedArrayReferenceValue",
      language: t.language ?? t._key, // seed used _key = "he"/"en"
      value: {
        _type: "reference",
        _ref: t.value?._ref,
        _weak: true,
        ...(type ? { _strengthenOnPublish: { type } } : {}),
      },
    }));
    await writeClient.patch(doc._id).set({ translations }).commit();
    patched++;
    console.log(`  ⟳ patched ${doc._id} (langs: ${translations.map((x) => x.language).join(", ")})`);
  }
  console.log(`\nDone. Patched ${patched}, left ${docs.length - patched} untouched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
