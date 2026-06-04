// sanity/schemaTypes/placeholderPage.ts
import { defineField, defineType } from "sanity";

export const placeholderPage = defineType({
  name: "placeholderPage",
  title: 'עמוד "בקרוב"',
  type: "document",
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "route",
      title: "עמוד",
      type: "string",
      options: { list: ["catalog", "portfolio"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שורה או שתיים)", type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1).max(2) }),
    defineField({ name: "lead", title: "שורת פתיחה מודגשת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקת גוף", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "preview", title: 'צ׳יפים "מה צפוי"', type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1) }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { route: "route", language: "language" },
    prepare({ route, language }) {
      return { title: route === "portfolio" ? "פורטפוליו" : "קטלוג", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
