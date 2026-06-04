import { defineField, defineType } from "sanity";

/**
 * Single-language projection of `FaqItem` from app/content/home.ts:
 * `{ n, he: { q, a }, en: { q, a } }` → `{ n, q, a }`.
 */
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    defineField({
      name: "n",
      title: "Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "q",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "a",
      title: "Answer",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "q", subtitle: "n" },
  },
});
