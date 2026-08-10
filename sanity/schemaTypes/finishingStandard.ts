import { defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

export const finishingStandard = defineType({
  name: "finishingStandard",
  title: "תקן או הסמכה",
  type: "object",
  fields: [
    defineField({ name: "code", title: "שם/קוד התקן", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "כותרת", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "הסבר קצר", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "certificateLabel", title: "טקסט כשאין עדיין תעודה", type: "string" }),
    imageField("image", "צילום התעודה"),
    defineField({
      name: "tone",
      title: "סגנון",
      type: "string",
      initialValue: "plain",
      options: {
        layout: "radio",
        list: [
          { title: "תקן", value: "plain" },
          { title: "מפעל חיוני", value: "essential" },
        ],
      },
    }),
  ],
  preview: { select: { title: "code", subtitle: "title", media: "image" } },
});
