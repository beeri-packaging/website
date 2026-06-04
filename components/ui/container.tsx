import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-6 sm:px-8 md:px-12 lg:px-20", className)}>
      {children}
    </div>
  );
}
