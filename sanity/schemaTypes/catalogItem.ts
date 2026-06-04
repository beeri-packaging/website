// sanity/schemaTypes/catalogItem.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const catalogItem = defineType({
  name: "catalogItem",
  title: "פריט קטלוג",
  type: "object",
  fields: [
    defineField({ name: "key", title: "מזהה (key)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "name", title: "שם הפריט", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "series", title: "סדרה (תווית עליונה — לכרטיס מורחב)", type: "string" }),
    defineField({ name: "description", title: "תיאור", type: "text", rows: 3, validation: (rule) => rule.required() }),
    imageField("image", "תמונה"),

    // Grid cards
    defineField({
      name: "tags",
      title: "תגיות (כרטיס רשת)",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "catalogTag",
        fields: [
          defineField({ name: "label", title: "טקסט", type: "string", validation: (rule) => rule.required() }),
          defineField({
            name: "tone",
            title: "גוון",
            type: "string",
            options: { list: ["outline", "cyan", "purple", "magenta"], layout: "radio" },
            initialValue: "outline",
            validation: (rule) => rule.required(),
          }),
        ],
        preview: { select: { title: "label", subtitle: "tone" } },
      })],
      validation: (rule) => rule.max(2),
    }),
    defineField({ name: "overlayLabel", title: "תווית שכבה טכנית (כרטיס רשת)", type: "string" }),
    defineField({ name: "overlaySpecs", title: "שורות שכבה טכנית (כרטיס רשת)", type: "array", of: [{ type: "string" }] }),

    // Feature + modular cards
    defineField({
      name: "specs",
      title: "מפרט (כרטיס מורחב / מודולרי)",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        name: "catalogSpec",
        fields: [
          defineField({ name: "label", title: "תווית", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "value", title: "ערך", type: "string", validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      })],
    }),
    defineField({ name: "cta", title: "כפתור (כרטיס מורחב)", type: "string" }),
  ],
  preview: { select: { title: "name", subtitle: "series" } },
});
