import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

// GROQ projections expose raw `asset->url` strings, which point at the
// untransformed originals (multi-MB scans straight from upload). next/image
// has to download that source before it can resize, and on big PNGs the
// fetch can blow past the optimizer's upstream timeout — the page then 500s
// on `/_next/image`. Asking the Sanity CDN for a bounded, format-negotiated
// rendition keeps the upstream payload small; the rendered size is untouched
// because next/image still does the final per-device resize.
const SANITY_IMAGE_URL =
  /^https:\/\/cdn\.sanity\.io\/images\/[^\s?]+\.(?:png|jpe?g|webp|tiff?)$/i;
const CDN_PARAMS = "auto=format&fit=max&w=1920&q=80";

export function withCdnParams<T>(value: T): T {
  if (typeof value === "string") {
    return (SANITY_IMAGE_URL.test(value) ? `${value}?${CDN_PARAMS}` : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => withCdnParams(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, withCdnParams(val)]),
    ) as T;
  }
  return value;
}
