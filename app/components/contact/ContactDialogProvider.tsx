"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Lang } from "@/app/content/home";
import { ContactDialog } from "./ContactDialog";

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
  const open = useCallback(() => setIsOpen(true), []);

  return (
    <ContactDialogContext.Provider value={{ open }}>
      {children}
      <ContactDialog lang={lang} open={isOpen} onOpenChange={setIsOpen} />
    </ContactDialogContext.Provider>
  );
}
