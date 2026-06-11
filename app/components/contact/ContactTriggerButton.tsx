"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Lang } from "@/app/content/home";

const ContactDialog = dynamic(
  () => import("./ContactDialog").then((m) => m.ContactDialog),
  { ssr: false },
);

type ContactTriggerButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "type"
>;

function documentLang(): Lang {
  return document.documentElement.lang === "en" ? "en" : "he";
}

/**
 * Drop-in contact trigger. The Radix dialog runtime is lazy-loaded only after
 * the first click, so static pages do not pay for it during first paint.
 */
export function ContactTriggerButton({
  onClick,
  children,
  ...props
}: ContactTriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>("he");

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          setLang(documentLang());
          setMounted(true);
          setOpen(true);
        }}
        {...props}
      >
        {children}
      </button>
      {mounted ? (
        <ContactDialog lang={lang} open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
