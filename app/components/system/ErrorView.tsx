"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { errorCopy } from "@/app/content/system";
import type { Lang } from "@/app/content/home";
import { SystemMessage } from "./SystemMessage";

/**
 * Runtime-error body. Reads the locale from context and renders the shared
 * {@link SystemMessage} with a "try again" button (re-renders the boundary's
 * children via `retry`) plus a home link.
 */
export function ErrorView({ retry }: { retry: () => void }) {
  const lang = useLocale() as Lang;
  const t = errorCopy[lang];

  return (
    <SystemMessage
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      actions={
        <>
          <button
            type="button"
            onClick={retry}
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            {t.secondary}
          </button>
          <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "md" }))}>
            {t.primary}
          </Link>
        </>
      }
    />
  );
}
