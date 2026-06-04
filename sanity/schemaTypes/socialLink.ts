// sanity/schemaTypes/socialLink.ts
import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "קישור / לינק",
  type: "object",
  fields: [
    defineField({ name: "label", title: "תווית", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "href", title: "כתובת (URL)", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
