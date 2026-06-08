"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { notFoundCopy } from "@/app/content/system";
import type { Lang } from "@/app/content/home";
import { SystemMessage } from "./SystemMessage";

/**
 * 404 body. Reads the locale from context (Next's `not-found.tsx` gets no
 * `params`) and renders the shared {@link SystemMessage} with a home link plus
 * a contact-dialog trigger.
 */
export function NotFoundView() {
  const lang = useLocale() as Lang;
  const t = notFoundCopy[lang];

  return (
    <SystemMessage
      eyebrow={t.eyebrow}
      code={t.code}
      title={t.title}
      description={t.description}
      actions={
        <>
          <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
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
