"use client";

import { useContactDialog } from "./ContactDialogProvider";

type ContactTriggerButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "type"
>;

/**
 * Drop-in replacement for a "contact us" link/button. Renders a `<button>` that
 * opens the global contact dialog, while forwarding `className`/`children` so
 * each call site keeps its own styling. Safe inside Server Components.
 */
export function ContactTriggerButton({
  onClick,
  children,
  ...props
}: ContactTriggerButtonProps) {
  const { open } = useContactDialog();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        open();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
