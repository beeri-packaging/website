// sanity/schemaTypes/finishingMetric.ts
import { defineField, defineType } from "sanity";

export const finishingMetric = defineType({
  name: "finishingMetric",
  title: "נתון גימור",
  type: "object",
  fields: [
    defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", title: "ערך", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});
