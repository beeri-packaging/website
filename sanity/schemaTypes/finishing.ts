// sanity/schemaTypes/finishing.ts
import { defineArrayMember, defineField, defineType } from "sanity";

function valueLabel(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "value", title: "ערך", type: "string", validation: (r) => r.required() }),
      defineField({ name: "label", title: "תווית", type: "string", validation: (r) => r.required() }),
    ],
  });
}

export const finishing = defineType({
  name: "finishing",
  title: "השבחות",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "feature", title: "השבחה ראשית" },
    { name: "metrics", title: "נתונים" },
    { name: "grid", title: "משבצות" },
    { name: "cta", title: "קריאה לפעולה" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    defineField({ name: "step", title: "תווית שלב", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (r) => r.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (r) => r.required() }),

    defineField({ name: "feature", title: "השבחה ראשית", type: "finishingItem", group: "feature", validation: (r) => r.required() }),

    defineField({ name: "metricsTitle", title: "כותרת אזור הנתונים", type: "string", group: "metrics", validation: (r) => r.required() }),
    defineField({ name: "metrics", title: "נתוני גימור", type: "array", of: [defineArrayMember({ type: "finishingMetric" })], group: "metrics" }),

    defineField({ name: "quote", title: "ציטוט", type: "text", rows: 3, group: "grid", validation: (r) => r.required() }),
    defineField({ name: "quoteBy", title: "מקור הציטוט", type: "string", group: "grid", validation: (r) => r.required() }),
    defineField({ name: "deboss", title: "משבצת הבלטה", type: "finishingItem", group: "grid", validation: (r) => r.required() }),
    defineField({ name: "texture", title: "משבצת מרקם", type: "finishingItem", group: "grid", validation: (r) => r.required() }),

    defineField({ name: "ctaTitle", title: "כותרת קריאה לפעולה", type: "string", group: "cta", validation: (r) => r.required() }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", group: "cta", validation: (r) => r.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", group: "cta", validation: (r) => r.required() }),
    valueLabel("sampleCard", "כרטיס דוגמה"),
    valueLabel("isoCard", "כרטיס ISO"),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "השבחות", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
