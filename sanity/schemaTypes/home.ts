import { defineArrayMember, defineField, defineType } from "sanity"; // defineArrayMember kept for journeyPanels/faqItems/capabilities
import { imageField } from "./_helpers";

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

    // --- Media ---
    imageField("heroImage", "Hero image"),
    imageField("bentoServiceImage", "Bento service image"),
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
