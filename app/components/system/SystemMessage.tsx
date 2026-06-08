import type { ReactNode } from "react";

/**
 * Presentational shell for the system pages (404 + runtime error). Pure — no
 * hooks, no client state — so it renders unchanged inside a Server Component
 * (`not-found`) or a Client error boundary (`error`). Uses only logical CSS and
 * brand tokens so it reads correctly in both RTL (he) and LTR (en).
 */
export function SystemMessage({
  eyebrow,
  code,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  code?: string;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <section className="relative isolate flex flex-1 flex-col justify-center overflow-hidden bg-bone">
      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-20">
        <div className="flex max-w-[640px] flex-col items-start">
          <div className="bg-yellow inline-flex items-start px-3 py-1">
            <span className="font-sans text-[10.5px] uppercase leading-4 tracking-[0.08em] text-cyan-deep sm:text-[12px]">
              {eyebrow}
            </span>
          </div>

          {code ? (
            <p className="mt-7 font-display text-[96px] font-normal leading-[0.78] text-ink sm:text-[140px] md:text-[168px]">
              {code}
            </p>
          ) : null}

          <h1 className="mt-5 font-display text-[40px] font-bold leading-[0.95] text-ink sm:text-[56px] md:text-[68px]">
            {title}
          </h1>

          <p className="mt-5 max-w-[480px] font-sans text-[16px] leading-[1.7] text-clay sm:text-[18px]">
            {description}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {actions}
          </div>
        </div>
      </div>
    </section>
  );
}
