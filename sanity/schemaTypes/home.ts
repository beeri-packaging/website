import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * An `image` field that mirrors the home page's image needs: a Sanity asset
 * with required alt text, plus a `legacyImagePath` for images not yet
 * uploaded to the CDN. The mapper resolves the asset URL when present and
 * falls back to `legacyImagePath` otherwise — both render the same picture.
 */
function imageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "legacyImagePath",
        title: "Legacy image path",
        type: "string",
        description:
          "Local /images/... path, used until the asset is uploaded.",
      }),
    ],
  });
}

/**
 * The home document. Each document represents ONE locale (he or en); the
 * `language` field is managed by @sanity/document-internationalization.
 * Every field name matches `HomeCopy` (and the embedded object types match
 * the single-language projection of Capability/FaqItem/JourneyPanel/NavLink)
 * so the `toHomeCopy` mapper in sanity/queries.ts is 1:1.
 */
export const home = defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "journey", title: "Journey" },
    { name: "tech", title: "Technical Excellence" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "Call to Action" },
    { name: "footer", title: "Footer" },
    { name: "chrome", title: "Header / Chrome" },
    { name: "media", title: "Media" },
  ],
  fields: [
    // Managed by document-internationalization.
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),

    // --- Hero ---
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "h1",
      title: "H1 (two lines)",
      type: "array",
      of: [{ type: "string" }],
      group: "hero",
      validation: (rule) => rule.required().length(2),
    }),
    defineField({
      name: "cta1",
      title: "CTA 1",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta2",
      title: "CTA 2",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "scroll",
      title: "Scroll hint",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    // --- Journey ---
    defineField({
      name: "journeyEyebrow",
      title: "Journey eyebrow",
      type: "string",
      group: "journey",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "journeyTitle",
      title: "Journey title",
      type: "string",
      group: "journey",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "journeyDesc",
      title: "Journey description",
      type: "text",
      rows: 3,
      group: "journey",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "journeyPanels",
      title: "Journey panels",
      type: "array",
      of: [defineArrayMember({ type: "journeyPanel" })],
      group: "journey",
    }),

    // --- Technical Excellence ---
    defineField({
      name: "techTitle",
      title: "Tech title",
      type: "string",
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "techBody",
      title: "Tech body",
      type: "text",
      rows: 3,
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bento1Title",
      title: "Bento 1 title",
      type: "string",
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bento1Body",
      title: "Bento 1 body",
      type: "text",
      rows: 2,
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bento2Title",
      title: "Bento 2 title",
      type: "string",
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bento2Body",
      title: "Bento 2 body",
      type: "text",
      rows: 2,
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge1",
      title: "Badge 1",
      type: "string",
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge2",
      title: "Badge 2",
      type: "string",
      group: "tech",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [defineArrayMember({ type: "capability" })],
      group: "tech",
    }),

    // --- FAQ ---
    defineField({
      name: "faqEyebrow",
      title: "FAQ eyebrow",
      type: "string",
      group: "faq",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqTitle",
      title: "FAQ title",
      type: "string",
      group: "faq",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqBody",
      title: "FAQ body",
      type: "text",
      rows: 3,
      group: "faq",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqItems",
      title: "FAQ items",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      group: "faq",
    }),

    // --- Call to Action ---
    defineField({
      name: "ctaTitle",
      title: "CTA title (two lines)",
      type: "array",
      of: [{ type: "string" }],
      group: "cta",
      validation: (rule) => rule.required().length(2),
    }),

    // --- Footer ---
    defineField({
      name: "footerEyebrow",
      title: "Footer eyebrow",
      type: "string",
      group: "footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerAddr",
      title: "Footer address (two lines)",
      type: "array",
      of: [{ type: "string" }],
      group: "footer",
      validation: (rule) => rule.required().length(2),
    }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      of: [{ type: "string" }],
      group: "footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerCopy",
      title: "Footer copyright",
      type: "string",
      group: "footer",
      validation: (rule) => rule.required(),
    }),

    // --- Header / chrome ---
    defineField({
      name: "menu",
      title: "Menu label",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "close",
      title: "Close label",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lang",
      title: "Language label",
      type: "string",
      group: "chrome",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navLinks",
      title: "Nav links",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      group: "chrome",
    }),

    // --- Media ---
    imageField("heroImage", "Hero image"),
    imageField("bentoServiceImage", "Bento service image"),
    imageField("logoHe", "Logo (Hebrew)"),
    imageField("logoEn", "Logo (English)"),
  ],
  preview: {
    select: { language: "language" },
    prepare({ language }) {
      return {
        title: "Home Page",
        subtitle: language ? language.toUpperCase() : undefined,
      };
    },
  },
});
