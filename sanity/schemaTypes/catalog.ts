// sanity/schemaTypes/catalog.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const catalog = defineType({
  name: "catalog",
  title: "קטלוג",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "categories", title: "קטגוריות" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    // Hero
    defineField({ name: "eyebrow", title: "תווית עליונה (למשל קטלוג)", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (rule) => rule.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "specCard", title: "כרטיס מפרט (שלוש שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (rule) => rule.required().length(3) }),

    // Categories
    defineField({ name: "categories", title: "קטגוריות", type: "array", of: [defineArrayMember({ type: "catalogCategory" })], group: "categories", validation: (rule) => rule.required().min(1) }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "קטלוג", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
