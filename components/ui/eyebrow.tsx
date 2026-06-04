import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-yellow inline-flex items-start justify-center px-3 py-1 max-w-full", className)}>
      <span className="font-sans text-cyan-deep text-[10.5px] sm:text-[12px] tracking-[0.08em] leading-4 uppercase text-balance">
        {children}
      </span>
    </div>
  );
}
