"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Branded modal built on Radix Dialog — focus-trap, ESC, scroll-lock and
 * ARIA come from the primitive; the look (hard `ink` border, bone surface,
 * deep drop shadow, corner close button) is the reusable "spec-sheet" shell
 * from the Figma product card. Compose with `DialogMain` (scroll region) and,
 * for the two-panel template, `DialogAside` (the branded side panel).
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *   <DialogContent size="split" closeLabel="Close">
 *     <DialogMain>
 *       <DialogTitle>…</DialogTitle>
 *       <DialogDescription>…</DialogDescription>
 *     </DialogMain>
 *     <DialogAside>…</DialogAside>
 *   </DialogContent>
 * </Dialog>
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-display font-bold uppercase leading-[1.05] text-ink",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("font-sans text-clay", className)}
      {...props}
    />
  );
}

export const dialogContentVariants = cva(
  // Dead-centered fixed panel. `left-1/2 -translate-x-1/2` centers regardless
  // of text direction; the inner content flips via the inherited `dir`.
  "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border-2 border-ink bg-bone shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] outline-none animate-dialog-content",
  {
    variants: {
      size: {
        md: "max-w-lg",
        lg: "max-w-2xl",
        split: "max-w-[1080px] md:h-[640px] md:flex-row",
      },
    },
    defaultVariants: { size: "md" },
  }
);

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> &
  VariantProps<typeof dialogContentVariants> & {
    /** Accessible label for the icon-only close button. Required. */
    closeLabel: string;
    /** Hide the built-in corner close button (default: shown). */
    showClose?: boolean;
    /** Extra classes for the backdrop overlay. */
    overlayClassName?: string;
  };

export function DialogContent({
  className,
  overlayClassName,
  size,
  closeLabel,
  showClose = true,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-ink/60 animate-dialog-overlay",
          overlayClassName
        )}
      />
      <DialogPrimitive.Content
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute start-4 top-4 z-10 inline-flex size-10 items-center justify-center border border-ink bg-bone text-ink transition-colors duration-300 hover:bg-ink hover:text-bone focus-ring"
          >
            <CloseIcon />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/**
 * Scroll region for dialog body content. Use as the single child of a simple
 * `DialogContent`, or as the form/content panel in the two-panel `split`
 * layout. Owns its own overflow so the panel scrolls while the shell, close
 * button and aside stay pinned.
 */
export function DialogMain({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  );
}

/**
 * The branded side panel of the two-panel template (cinematic render / pitch).
 * Hidden below `md`, where the main panel takes the full width. The hairline
 * divider sits on the inline-start edge so it lands between the two panels in
 * both RTL and LTR.
 */
export function DialogAside({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative hidden shrink-0 overflow-hidden md:flex md:w-[44%] md:flex-col md:border-s md:border-ink",
        className
      )}
      {...props}
    />
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}
