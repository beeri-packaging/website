import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { NotFoundView } from "@/app/components/system/NotFoundView";

/**
 * Localized 404. Rendered inside `[locale]/layout` (so it inherits the
 * `PlaceholderShell` supplies
 * the shared header/footer with the bundled chrome fallback — no data fetch, so
 * a missing route never cascades into a second failure.
 */
export default function NotFound() {
  return (
    <PlaceholderShell lang="he">
      <NotFoundView />
    </PlaceholderShell>
  );
}
