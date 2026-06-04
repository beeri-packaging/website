// sanity/schemaTypes/careersArticle.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const careersArticle = defineType({
  name: "careersArticle",
  title: "כתבה",
  type: "object",
  fields: [
    defineField({ name: "tag", title: "תגית", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "meta", title: "מטא (תאריך/מספר)", type: "string" }),
    defineField({
      name: "title",
      title: "כותרת (שורה לכל שורה)",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "body", title: "טקסט", type: "text", rows: 3 }),
    imageField("image", "תמונה"),
    defineField({ name: "cta", title: "כפתור (קריאה לפעולה)", type: "string" }),
    defineField({
      name: "theme",
      title: "סגנון משבצת",
      type: "string",
      options: { list: ["feature", "plain", "yellow", "image", "wide"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "tag", subtitle: "theme" } },
});
