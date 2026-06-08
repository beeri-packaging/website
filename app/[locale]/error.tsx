"use client";

import { useEffect } from "react";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { ErrorView } from "@/app/components/system/ErrorView";

/**
 * Localized runtime-error boundary for everything under `[locale]`. Error
 * boundaries must be Client Components. It sits inside `[locale]/layout`, so the
 * i18n + contact-dialog providers are available; `PlaceholderShell` uses the
 * bundled chrome fallback so the shell renders even if the failure came from
 * the page's own data fetch. `unstable_retry` re-renders the boundary's
 * children to attempt recovery.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PlaceholderShell>
      <ErrorView retry={unstable_retry} />
    </PlaceholderShell>
  );
}
