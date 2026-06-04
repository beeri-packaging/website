// sanity/schemaTypes/blogSettings.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogSettings = defineType({
  name: "blogSettings",
  title: "הגדרות בלוג",
  type: "document",
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שורה או שתיים)", type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1).max(2) }),
    defineField({ name: "lead", title: "שורת פתיחה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקת גוף", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "comingSoon", title: "הערת 'בקרוב'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "readMore", title: "כפתור 'לקריאה'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "backToBlog", title: "כפתור 'חזרה'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "publishedOn", title: "תווית 'פורסם'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "notFoundTitle", title: "כותרת 'לא נמצא'", type: "string", validation: (r) => r.required() }),
    defineField({ name: "notFoundBody", title: "טקסט 'לא נמצא'", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({
      name: "categoryLabels",
      title: "שמות קטגוריות",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "categoryLabel",
        fields: [
          defineField({ name: "key", title: "מפתח", type: "string", options: { list: ["structural", "trends", "sustainability", "floor", "studio"] }, validation: (r) => r.required() }),
          defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
        ],
        preview: { select: { title: "label", subtitle: "key" } },
      })],
    }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "הגדרות בלוג", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
