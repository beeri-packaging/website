// sanity/schemaTypes/post.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const post = defineType({
  name: "post",
  title: "פוסט",
  type: "document",
  groups: [
    { name: "meta", title: "מטא-נתונים" },
    { name: "content", title: "תוכן" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "slug",
      title: "מזהה כתובת (slug)",
      type: "slug",
      group: "meta",
      description: "זהה בעברית ובאנגלית — קובע את כתובת הפוסט.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "תאריך פרסום", type: "date", group: "meta", options: { dateFormat: "YYYY-MM-DD" }, validation: (r) => r.required() }),
    defineField({ name: "read", title: "זמן קריאה", type: "string", group: "meta", description: "לדוגמה: 4 דק׳ קריאה", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "קטגוריה",
      type: "string",
      group: "meta",
      options: { list: ["structural", "trends", "sustainability", "floor", "studio"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    imageField("image", "תמונת פוסט"),

    defineField({ name: "title", title: "כותרת", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "תקציר", type: "text", rows: 2, group: "content", validation: (r) => r.required() }),
    defineField({ name: "body", title: "פסקאות", type: "array", of: [{ type: "text", rows: 3 }], group: "content", validation: (r) => r.required().min(1) }),
  ],
  preview: {
    select: { title: "title", language: "language", media: "image" },
    prepare({ title, language }) {
      return { title: title || "פוסט", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
