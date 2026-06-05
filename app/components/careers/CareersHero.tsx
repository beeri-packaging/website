"use client";

import type { FormEvent } from "react";
import type { CareersCopy } from "@/app/content/careers";

function FilterIcon() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-[18px]" aria-hidden>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <line x1="0" y1="1" x2="18" y2="1" />
        <line x1="3" y1="6" x2="15" y2="6" />
        <line x1="6" y1="11" x2="12" y2="11" />
      </g>
    </svg>
  );
}

export function CareersHero({
  copy,
  onQueryChange,
  query,
}: {
  copy: CareersCopy;
  onQueryChange: (value: string) => void;
  query: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pt-8 sm:px-8 sm:pt-12 md:px-12 md:pt-16 lg:px-20">
      <div className="flex flex-col gap-8 border-b border-ink pb-8 md:gap-12 md:flex-row md:items-end md:justify-between md:pb-10">
        {/* Start column — eyebrow, oversized headline, intro */}
        <div className="flex min-w-0 flex-col">
          <p className="ds-eyebrow text-purple">{copy.eyebrow}</p>
          <h1 className="mt-5 font-display text-[44px] font-bold leading-[0.9] text-ink sm:text-[64px] md:text-[80px] lg:text-[96px]">
            {copy.title.join(" ")}
          </h1>
          <p className="mt-7 max-w-[600px] font-sans text-[16px] leading-[1.6] text-clay sm:text-[18px]">
            {copy.intro}
          </p>
        </div>

        {/* End column — filter button + search field, bottom-aligned */}
        <form
          action="/careers"
          className="flex w-full shrink-0 gap-3 md:w-auto"
          onSubmit={handleSubmit}
          role="search"
        >
          <button
            type="submit"
            aria-label={copy.searchButtonLabel}
            className="grid h-[50px] w-[52px] shrink-0 place-items-center border border-ink bg-bone text-ink transition-colors hover:bg-ink hover:text-bone focus-ring"
          >
            <FilterIcon />
          </button>
          <input
            name="q"
            aria-label={copy.searchPlaceholder}
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-[50px] w-full min-w-0 border border-ink bg-bone px-4 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ink outline-none placeholder:text-purple/60 focus:border-purple md:w-[256px]"
          />
        </form>
      </div>
    </section>
  );
}
