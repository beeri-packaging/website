// sanity/schemaTypes/careerRole.ts
import { defineField, defineType } from "sanity";

export const careerRole = defineType({
  name: "careerRole",
  title: "משרה",
  type: "object",
  fields: [
    defineField({ name: "code", title: "קוד משרה", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "status", title: "סטטוס", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "שם המשרה", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "scope", title: "היקף", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "location", title: "מיקום", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "department",
      title: "מחלקה",
      type: "string",
      options: { list: ["production", "studio"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "על התפקיד",
      description: "2–4 משפטים קצרים על המשרה. מוצג בחלון הגשת המועמדות.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "highlights",
      title: "נקודות עיקריות",
      description: "עד 5 שורות קצרות — מה עושים בתפקיד ומה נדרש.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(5),
    }),
  ],
  preview: { select: { title: "title", subtitle: "code" } },
});
