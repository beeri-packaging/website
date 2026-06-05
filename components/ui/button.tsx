import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 rounded-none font-sans font-bold tracking-[0.08em] transition-colors duration-300 focus-ring",
  {
    variants: {
      variant: {
        primary: "bg-ink border border-ink text-bone hover:bg-bone hover:text-ink",
        secondary: "border border-ink text-ink hover:bg-ink hover:text-bone",
        solid: "bg-ink border border-ink text-bone hover:bg-clay",
        cyan: "bg-cyan border border-ink text-ink hover:bg-ink hover:text-bone",
      },
      size: {
        sm: "px-6 py-3 text-[13px] lg:text-[14px]",
        md: "px-8 sm:px-10 py-4 sm:py-5 text-[13px] sm:text-[14px]",
        lg: "px-10 sm:px-14 md:px-16 py-5 sm:py-7 md:py-8 text-[13px] sm:text-[14px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
