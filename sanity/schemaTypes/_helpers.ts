// sanity/schemaTypes/_helpers.ts
import { defineField } from "sanity";

/**
 * A Sanity image field with required Hebrew alt text plus a `legacyImagePath`
 * fallback (local /images/... path used until the asset is uploaded). The
 * GROQ mappers resolve the asset URL when present and fall back to
 * `legacyImagePath` otherwise.
 */
export function imageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "טקסט חלופי (alt)",
        type: "string",
        description: "תיאור קצר של התמונה לנגישות ו-SEO.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "legacyImagePath",
        title: "נתיב תמונה מקומי (גיבוי)",
        type: "string",
        description: "נתיב /images/... — בשימוש עד שהתמונה מועלית ל-CDN.",
      }),
    ],
  });
}
