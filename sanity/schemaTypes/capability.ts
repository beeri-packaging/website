import { defineField, defineType } from "sanity";

/**
 * Single-language projection of `Capability` from app/content/home.ts:
 * `{ n, he: { title, body }, en: { title, body } }` → `{ n, title, body }`.
 */
export const capability = defineType({
  name: "capability",
  title: "Capability",
  type: "object",
  fields: [
    defineField({
      name: "n",
      title: "Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "n" },
  },
});
