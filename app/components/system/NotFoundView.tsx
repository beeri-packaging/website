"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { notFoundCopy } from "@/app/content/system";
import { useShellLang } from "@/app/components/placeholder/PlaceholderShell";
import { SystemMessage } from "./SystemMessage";

/**
 * 404 body. Reads the locale from context (Next's `not-found.tsx` gets no
 * `params`) and renders the shared {@link SystemMessage} with a home link plus
 * a contact-dialog trigger.
 */
export function NotFoundView() {
  const { lang } = useShellLang();
  const t = notFoundCopy[lang];

  return (
    <SystemMessage
      eyebrow={t.eyebrow}
      code={t.code}
      title={t.title}
      description={t.description}
      actions={
        <>
          <Link href={`/${lang}`} className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
            {t.primary}
          </Link>
          <ContactTriggerButton className={cn(buttonVariants({ variant: "secondary", size: "md" }))}>
            {t.secondary}
          </ContactTriggerButton>
        </>
      }
    />
  );
}
