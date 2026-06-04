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
  ],
  preview: { select: { title: "title", subtitle: "code" } },
});
