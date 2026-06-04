import { defineField, defineType } from "sanity";

/**
 * Mirrors `NavLink` from app/content/home.ts: `{ he, en, href }`.
 * Nav labels are inherently bilingual (a single entry carries both labels),
 * so this object keeps both `he` and `en` rather than projecting per-locale.
 */
export const navLink = defineType({
  name: "navLink",
  title: "Nav Link",
  type: "object",
  fields: [
    defineField({
      name: "he",
      title: "Hebrew label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "he", subtitle: "href" },
  },
});
