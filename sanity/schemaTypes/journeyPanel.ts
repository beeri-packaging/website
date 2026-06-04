import { defineField, defineType } from "sanity";

/**
 * Single-language projection of `JourneyPanel` from app/content/home.ts.
 * The shared (locale-independent) fields `key`, `src`, `theme`, `accent`,
 * `tagColor` stay as-is; the per-locale `{ tag, title, body, link }` is
 * flattened onto the object. `image` holds the optional Sanity asset;
 * `legacyImagePath` keeps the existing /images/... path until migrated.
 */
export const journeyPanel = defineType({
  name: "journeyPanel",
  title: "Journey Panel",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "legacyImagePath",
      title: "Legacy image path",
      type: "string",
      description: "Local /images/... path, used until the asset is uploaded.",
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: { list: ["dark", "light"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accent",
      title: "Accent",
      type: "string",
      options: { list: ["purple", "yellow"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagColor",
      title: "Tag color",
      type: "string",
      options: { list: ["text-yellow", "text-purple", "text-magenta"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "key", media: "image" },
  },
});
