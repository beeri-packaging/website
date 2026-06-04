// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

/**
 * Client-facing desk: pages grouped and Hebrew-titled. Singletons
 * (siteSettings, blogSettings) are internationalized, so they show as
 * document-type lists (he + en) rather than single pinned docs.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("תוכן")
    .items([
      S.listItem().title("🏠 דף הבית").child(S.documentTypeList("home").title("דף הבית")),
      S.listItem().title("💼 קריירה").child(S.documentTypeList("careers").title("קריירה")),
      S.listItem().title("✨ השבחות").child(S.documentTypeList("finishing").title("השבחות")),
      S.listItem()
        .title("📝 בלוג")
        .child(
          S.list()
            .title("בלוג")
            .items([
              S.listItem().title("הגדרות בלוג").child(S.documentTypeList("blogSettings").title("הגדרות בלוג")),
              S.listItem().title("פוסטים").child(S.documentTypeList("post").title("פוסטים")),
            ])
        ),
      S.listItem().title('🚧 עמודי "בקרוב"').child(S.documentTypeList("placeholderPage").title('עמודי "בקרוב"')),
      S.listItem().title("⚙️ הגדרות אתר").child(S.documentTypeList("siteSettings").title("הגדרות אתר")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            "home", "careers", "finishing", "post", "placeholderPage",
            "siteSettings", "blogSettings",
          ].includes(item.getId() ?? "")
      ),
    ]);
