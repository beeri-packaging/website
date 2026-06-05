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
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", title: "תאריך פרסום", type: "date", group: "meta", options: { dateFormat: "YYYY-MM-DD" }, validation: (rule) => rule.required() }),
    defineField({ name: "read", title: "זמן קריאה", type: "string", group: "meta", description: "לדוגמה: 6 דקות", validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      title: "קטגוריה",
      type: "string",
      group: "meta",
      options: { list: ["structural", "trends", "sustainability", "floor", "studio"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "author", title: "נכתב על ידי", type: "string", group: "meta", description: "לדוגמה: סטודיו בארי" }),
    defineField({ name: "credit", title: "צילום / קרדיט", type: "string", group: "meta", description: "לדוגמה: מחלקת ייצור" }),
    imageField("image", "תמונת פוסט (גיבור)"),

    defineField({ name: "title", title: "כותרת", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "תקציר / כותרת משנה", type: "text", rows: 2, group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "פסקאות פתיחה", type: "array", of: [{ type: "text", rows: 3 }], group: "content", validation: (rule) => rule.required().min(1) }),

    defineField({
      name: "quote",
      title: "ציטוט מודגש",
      type: "object",
      group: "content",
      description: "ציטוט שמופיע לצד תמונה בגוף הכתבה.",
      fields: [
        defineField({ name: "text", title: "טקסט הציטוט", type: "text", rows: 3 }),
        defineField({ name: "cite", title: "מקור / חתימה", type: "string" }),
      ],
    }),
    imageField("quoteImage", "תמונה לצד הציטוט"),

    defineField({
      name: "sections",
      title: "פרקים ממוספרים",
      type: "array",
      group: "content",
      description: "כל פרק מקבל מספר רץ (01, 02 …) אוטומטית.",
      of: [
        defineField({
          name: "section",
          title: "פרק",
          type: "object",
          fields: [
            defineField({ name: "heading", title: "כותרת הפרק", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", title: "תוכן הפרק", type: "text", rows: 4, validation: (rule) => rule.required() }),
            imageField("image", "תמונת פרק (אופציונלי)"),
          ],
          preview: { select: { title: "heading", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", language: "language", media: "image" },
    prepare({ title, language }) {
      return { title: title || "פוסט", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
