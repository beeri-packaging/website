"use client";

import { useContactDialog } from "@/app/components/contact/ContactDialogProvider";

type ContactLinkProps = Omit<React.ComponentPropsWithoutRef<"button">, "type">;

/**
 * Primary "contact us" call to action. Opens the global contact dialog instead
 * of a `mailto:` link so visitors complete the form without leaving the page.
 * Relies on <ContactDialogProvider> (mounted in the locale layout).
 */
export function ContactLink({ children, onClick, ...props }: ContactLinkProps) {
  const { open } = useContactDialog();
  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        open();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
