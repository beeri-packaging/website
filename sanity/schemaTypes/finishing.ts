// sanity/schemaTypes/finishing.ts
import { defineArrayMember, defineField, defineType } from "sanity";

function valueLabel(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "value", title: "ערך", type: "string", validation: (rule) => rule.required() }),
      defineField({ name: "label", title: "תווית", type: "string", validation: (rule) => rule.required() }),
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

    defineField({ name: "step", title: "תווית שלב", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (rule) => rule.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (rule) => rule.required() }),

    defineField({ name: "feature", title: "השבחה ראשית", type: "finishingItem", group: "feature", validation: (rule) => rule.required() }),

    defineField({ name: "metricsTitle", title: "כותרת אזור הנתונים", type: "string", group: "metrics", validation: (rule) => rule.required() }),
    defineField({ name: "metrics", title: "נתוני גימור", type: "array", of: [defineArrayMember({ type: "finishingMetric" })], group: "metrics" }),

    defineField({ name: "quote", title: "ציטוט", type: "text", rows: 3, group: "grid", validation: (rule) => rule.required() }),
    defineField({ name: "quoteBy", title: "מקור הציטוט", type: "string", group: "grid", validation: (rule) => rule.required() }),
    defineField({ name: "deboss", title: "משבצת הבלטה", type: "finishingItem", group: "grid", validation: (rule) => rule.required() }),
    defineField({ name: "texture", title: "משבצת מרקם", type: "finishingItem", group: "grid", validation: (rule) => rule.required() }),

    defineField({ name: "ctaTitle", title: "כותרת קריאה לפעולה", type: "string", group: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", group: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", group: "cta", validation: (rule) => rule.required() }),
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
