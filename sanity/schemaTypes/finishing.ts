// sanity/schemaTypes/finishing.ts
import { defineField, defineType } from "sanity";

export const finishing = defineType({
  name: "finishing",
  title: "השבחות",
  type: "document",
  groups: [
    { name: "hero", title: "כותרת ראשית" },
    { name: "feature", title: "השבחה ראשית" },
    { name: "grid", title: "משבצות" },
    { name: "standards", title: "תקנים והסמכות" },
    { name: "cta", title: "קריאה לפעולה" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    defineField({ name: "step", title: "תווית שלב", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "כותרת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "hero", validation: (rule) => rule.required().length(2) }),
    defineField({ name: "intro", title: "פסקת פתיחה", type: "text", rows: 3, group: "hero", validation: (rule) => rule.required() }),

    defineField({ name: "feature", title: "השבחה ראשית", type: "finishingItem", group: "feature", validation: (rule) => rule.required() }),

    defineField({ name: "deboss", title: "משבצת הבלטה", type: "finishingItem", group: "grid", validation: (rule) => rule.required() }),
    defineField({ name: "texture", title: "משבצת מרקם", type: "finishingItem", group: "grid", validation: (rule) => rule.required() }),

    defineField({ name: "standardsEyebrow", title: "תווית עליונה", type: "string", group: "standards" }),
    defineField({ name: "standardsTitle", title: "כותרת", type: "string", group: "standards" }),
    defineField({ name: "standardsBody", title: "טקסט פתיחה", type: "text", rows: 4, group: "standards" }),
    defineField({ name: "standards", title: "תקנים ותעודות", type: "array", of: [{ type: "finishingStandard" }], group: "standards" }),

    defineField({ name: "ctaTitle", title: "כותרת קריאה לפעולה", type: "string", group: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaPrimary", title: "כפתור ראשי", type: "string", group: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaSecondary", title: "כפתור משני", type: "string", group: "cta", validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "השבחות", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
