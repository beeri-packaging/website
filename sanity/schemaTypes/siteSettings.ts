// sanity/schemaTypes/siteSettings.ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField } from "./_helpers";

/**
 * Global chrome shared by every page: header labels, nav, footer, contact,
 * social. Internationalized (one document per locale).
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "הגדרות אתר",
  type: "document",
  groups: [
    { name: "header", title: "הדר / תפריט" },
    { name: "footer", title: "פוטר" },
    { name: "contact", title: "יצירת קשר" },
    { name: "media", title: "לוגו" },
  ],
  fields: [
    defineField({ name: "language", type: "string", readOnly: true, hidden: true }),

    // Header / chrome
    defineField({ name: "menu", title: "תווית 'תפריט'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "close", title: "תווית 'סגירה'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "lang", title: "תווית 'שפה'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({ name: "contact", title: "תווית 'צור קשר'", type: "string", group: "header", validation: (r) => r.required() }),
    defineField({
      name: "navLinks",
      title: "קישורי ניווט",
      type: "array",
      group: "header",
      of: [defineArrayMember({ type: "navLink" })],
    }),

    // Footer
    defineField({ name: "footerEyebrow", title: "תווית פוטר", type: "string", group: "footer", validation: (r) => r.required() }),
    defineField({ name: "footerAddr", title: "כתובת (שתי שורות)", type: "array", of: [{ type: "string" }], group: "footer", validation: (r) => r.required().length(2) }),
    defineField({ name: "footerLinks", title: "קישורי פוטר", type: "array", of: [{ type: "string" }], group: "footer", validation: (r) => r.required() }),
    defineField({ name: "footerCopy", title: "זכויות יוצרים", type: "string", group: "footer", validation: (r) => r.required() }),

    // Contact (reserved for future use — optional)
    defineField({ name: "contactEmail", title: "אימייל", type: "string", group: "contact" }),
    defineField({ name: "social", title: "רשתות חברתיות", type: "array", of: [defineArrayMember({ type: "socialLink" })], group: "contact" }),

    // Media
    imageField("logoHe", "לוגו (עברית)"),
    imageField("logoEn", "לוגו (אנגלית)"),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return { title: "הגדרות אתר", subtitle: language ? String(language).toUpperCase() : undefined };
    },
  },
});
