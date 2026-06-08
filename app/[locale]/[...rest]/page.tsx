import { notFound } from "next/navigation";

/**
 * Catch-all under `[locale]` so any unmatched nested path (e.g. `/he/nope`)
 * deterministically renders the localized `not-found.tsx` instead of falling
 * through to the root fallback. Recommended pattern for next-intl + App Router.
 */
export default function CatchAllPage() {
  notFound();
}
