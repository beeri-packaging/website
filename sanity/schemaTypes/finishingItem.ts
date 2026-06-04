// sanity/schemaTypes/finishingItem.ts
import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const finishingItem = defineType({
  name: "finishingItem",
  title: "פריט השבחה",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "תווית עליונה", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "טקסט", type: "text", rows: 3, validation: (r) => r.required() }),
    imageField("image", "תמונה"),
    defineField({ name: "sample", title: "מספר דוגמה", type: "string" }),
    defineField({ name: "cta", title: "כפתור", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});
