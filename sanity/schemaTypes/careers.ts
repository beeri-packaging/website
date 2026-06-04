// sanity/schemaTypes/careers.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const careers = defineType({
  name: "careers",
  title: "קריירה",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "articles", title: "כתבות" },
    { name: "roles", title: "משרות" },
    { name: "newsletter", title: "ניוזלטר" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    // Hero
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (rule) => rule.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "searchPlaceholder", title: "טקסט בשדה חיפוש", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "searchButtonLabel", title: "כפתור חיפוש", type: "string", group: "hero", validation: (rule) => rule.required() }),

    // Articles
    defineField({ name: "articles", title: "כתבות", type: "array", of: [defineArrayMember({ type: "careersArticle" })], group: "articles" }),

    // Roles
    defineField({ name: "rolesTitle", title: "כותרת אזור המשרות", type: "string", group: "roles", validation: (rule) => rule.required() }),
    defineField({
      name: "filters",
      title: "מסנני מחלקה",
      type: "array",
      group: "roles",
      of: [defineArrayMember({
        type: "object",
        name: "careerFilter",
        fields: [
          defineField({ name: "key", title: "מפתח", type: "string", options: { list: ["all", "production", "studio"] }, validation: (rule) => rule.required() }),
          defineField({ name: "label", title: "תווית", type: "string", validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "label", subtitle: "key" } },
      })],
    }),
    defineField({ name: "apply", title: "כפתור הגשה", type: "string", group: "roles", validation: (rule) => rule.required() }),
    defineField({ name: "noRoles", title: "טקסט כשאין משרות", type: "string", group: "roles", validation: (rule) => rule.required() }),
    defineField({ name: "roles", title: "משרות פתוחות", type: "array", of: [defineArrayMember({ type: "careerRole" })], group: "roles" }),

    // Newsletter
    defineField({ name: "newsletterTitle", title: "כותרת ניוזלטר (שתי שורות)", type: "array", of: [{ type: "string" }], group: "newsletter", validation: (rule) => rule.required().length(2) }),
    defineField({ name: "newsletterBody", title: "טקסט ניוזלטר", type: "text", rows: 2, group: "newsletter", validation: (rule) => rule.required() }),
    defineField({ name: "emailPlaceholder", title: "טקסט בשדה מייל", type: "string", group: "newsletter", validation: (rule) => rule.required() }),
    defineField({ name: "newsletterCta", title: "כפתור הרשמה", type: "string", group: "newsletter", validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "קריירה", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
