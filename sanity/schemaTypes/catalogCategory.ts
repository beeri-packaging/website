// sanity/schemaTypes/catalogCategory.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const catalogCategory = defineType({
  name: "catalogCategory",
  title: "קטגוריית קטלוג",
  type: "object",
  fields: [
    defineField({ name: "key", title: "מזהה (key)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "number", title: "מספר (לתגית, למשל 01)", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "name", title: "שם הקטגוריה", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "count", title: "תווית כמות (למשל 4 פריטים)", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "layout",
      title: "פריסה",
      type: "string",
      options: {
        list: [
          { title: "רשת כרטיסים (4)", value: "grid" },
          { title: "כרטיסים מורחבים (2)", value: "feature" },
          { title: "מערכת מודולרית (כרטיס יחיד)", value: "modular" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "items", title: "פריטים", type: "array", of: [defineArrayMember({ type: "catalogItem" })], validation: (rule) => rule.required().min(1) }),
  ],
  preview: {
    select: { number: "number", name: "name", layout: "layout" },
    prepare({ number, name, layout }) {
      return { title: `${number ?? ""} / ${name ?? ""}`, subtitle: layout };
    },
  },
});
