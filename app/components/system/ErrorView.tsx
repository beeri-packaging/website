"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { errorCopy } from "@/app/content/system";
import { useShellLang } from "@/app/components/placeholder/PlaceholderShell";
import { SystemMessage } from "./SystemMessage";

/**
 * Runtime-error body. Reads the locale from context and renders the shared
 * {@link SystemMessage} with a "try again" button (re-renders the boundary's
 * children via `retry`) plus a home link.
 */
export function ErrorView({ retry }: { retry: () => void }) {
  const { lang } = useShellLang();
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
          <Link href={`/${lang}`} className={cn(buttonVariants({ variant: "secondary", size: "md" }))}>
            {t.primary}
          </Link>
        </>
      }
    />
  );
}
