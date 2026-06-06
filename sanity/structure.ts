// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

/**
 * Client-facing desk: pages grouped and Hebrew-titled. Singletons
 * (siteSettings, blogSettings) are internationalized, so they show as
 * document-type lists (he + en) rather than single pinned docs.
 *
 * NOTE: Sanity's structure builder requires an explicit `.id()` on EVERY
 * `S.list()` and `S.listItem()` — omitting any throws
 * `'id' is required for lists` / `... for list items` at render time.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("תוכן")
    .items([
      S.listItem().id("home").title("🏠 דף הבית").child(S.documentTypeList("home").title("דף הבית")),
      S.listItem().id("careers").title("💼 קריירה").child(S.documentTypeList("careers").title("קריירה")),
      S.listItem().id("finishing").title("✨ השבחות").child(S.documentTypeList("finishing").title("השבחות")),
      S.listItem().id("catalog").title("📦 קטלוג").child(S.documentTypeList("catalog").title("קטלוג")),
      S.listItem()
        .id("blog")
        .title("📝 בלוג")
        .child(
          S.list()
            .id("blogGroup")
            .title("בלוג")
            .items([
              S.listItem().id("blogSettings").title("הגדרות בלוג").child(S.documentTypeList("blogSettings").title("הגדרות בלוג")),
              S.listItem().id("post").title("פוסטים").child(S.documentTypeList("post").title("פוסטים")),
            ])
        ),
      S.listItem().id("placeholderPage").title('🚧 עמודי "בקרוב"').child(S.documentTypeList("placeholderPage").title('עמודי "בקרוב"')),
      S.listItem().id("siteSettings").title("⚙️ הגדרות אתר").child(S.documentTypeList("siteSettings").title("הגדרות אתר")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            "home", "careers", "finishing", "catalog", "post", "placeholderPage",
            "siteSettings", "blogSettings",
          ].includes(item.getId() ?? "")
      ),
    ]);
