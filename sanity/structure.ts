import type { StructureResolver } from "sanity/structure";

/**
 * Studio desk structure: the localized `home` documents (he + en) and a
 * `siteSettings` singleton. Everything else falls through to the default list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .child(S.documentTypeList("home").title("Home Page")),
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["home", "siteSettings"].includes(item.getId() ?? "")
      ),
    ]);
