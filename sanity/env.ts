// Public Sanity identifiers — these are NOT secrets (NEXT_PUBLIC_* values ship
// to the browser regardless). Env vars override the defaults (e.g. a different
// dataset in preview). Falling back to the real project keeps the build from
// throwing when env vars aren't configured; reads degrade gracefully because
// `getHome` fails soft to the bundled copy. The write token stays in env only.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4qkb39ql";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
