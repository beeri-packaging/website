"use client";

import { createContext, useCallback, useContext, useState } from "react";
import dynamic from "next/dynamic";
import type { Lang } from "@/app/content/home";

// The contact dialog pulls in the Radix Dialog runtime (~100 KB). It's only
// needed once a visitor actually opens it, so its chunk is loaded on first
// open (client-only) rather than shipped in every route's initial bundle.
const ContactDialog = dynamic(
  () => import("./ContactDialog").then((m) => m.ContactDialog),
  { ssr: false },
);

type ContactDialogContextValue = {
  /** Open the global contact dialog. */
  open: () => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null);

/**
 * Access the global contact dialog. Any "contact us" trigger calls `open()`.
 * Throws outside the provider so a missing mount fails loud in development.
 */
export function useContactDialog(): ContactDialogContextValue {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) {
    throw new Error("useContactDialog must be used inside a ContactDialogProvider");
  }
  return ctx;
}

/**
 * Mounts a single, app-wide contact dialog and exposes `useContactDialog()` to
 * every descendant. Mounted once in the locale layout so any trigger on any
 * page opens the same modal.
 */
export function ContactDialogProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Defer mounting the dialog (and loading its chunk) until the first open.
  const [mounted, setMounted] = useState(false);
  const open = useCallback(() => {
    setMounted(true);
    setIsOpen(true);
  }, []);

  return (
    <ContactDialogContext.Provider value={{ open }}>
      {children}
      {mounted ? (
        <ContactDialog lang={lang} open={isOpen} onOpenChange={setIsOpen} />
      ) : null}
    </ContactDialogContext.Provider>
  );
}
