import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 text-[11px] sm:text-[12px] uppercase font-sans tracking-[0.08em] leading-4",
  {
    variants: {
      variant: {
        yellow: "bg-yellow text-yellow-deep",
        cyan: "bg-cyan text-cyan-deep",
      },
    },
    defaultVariants: { variant: "yellow" },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
