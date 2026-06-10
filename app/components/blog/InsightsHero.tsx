"use client";

import type { FormEvent } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { BlogIndexCopy, InsightsChrome, BlogCategory } from "@/app/content/blog";

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

export type CategoryFilter = BlogCategory | "all";

const menuItem =
  "flex cursor-pointer select-none items-center gap-2.5 px-4 py-2.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ink outline-none data-[highlighted]:bg-ink data-[highlighted]:text-bone";

export function InsightsHero({
  copy, chrome, labels, query, onQueryChange, category, onCategoryChange,
}: {
  copy: BlogIndexCopy;
  chrome: InsightsChrome;
  labels: Record<BlogCategory, string>;
  query: string;
  onQueryChange: (value: string) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }
  const filtered = category !== "all";
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pt-8 sm:px-8 sm:pt-12 md:px-12 md:pt-16 lg:px-20">
      <div className="flex flex-col gap-8 border-b border-ink pb-8 md:gap-12 md:flex-row md:items-end md:justify-between md:pb-10">
        <div className="flex min-w-0 flex-col">
          <p className="ds-eyebrow text-purple">{copy.eyebrow}</p>
          <h1 className="mt-5 font-display text-[44px] font-bold leading-[0.9] text-ink sm:text-[64px] md:text-[80px] lg:text-[96px]">
            {copy.title.join(" ")}
          </h1>
          <p className="mt-7 max-w-[600px] font-sans text-[16px] leading-[1.6] text-clay sm:text-[18px]">
            {copy.lead}
          </p>
        </div>
        <form className="flex w-full shrink-0 gap-3 md:w-auto" onSubmit={handleSubmit} role="search">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label={chrome.filterLabel}
                className={`grid h-[50px] w-[52px] shrink-0 place-items-center border border-ink transition-colors focus-ring data-[state=open]:bg-ink data-[state=open]:text-bone ${
                  filtered ? "bg-yellow text-ink" : "bg-bone text-ink hover:bg-ink hover:text-bone"
                }`}
              >
                <FilterIcon />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={6}
                className="z-50 min-w-[200px] border border-ink bg-bone py-1.5 shadow-[4px_4px_0_0_var(--ink)]"
              >
                <DropdownMenu.RadioGroup
                  value={category}
                  onValueChange={(value) => onCategoryChange(value as CategoryFilter)}
                >
                  <DropdownMenu.RadioItem value="all" className={menuItem}>
                    <Marker active={category === "all"} />
                    {chrome.filterAll}
                  </DropdownMenu.RadioItem>
                  {(Object.keys(labels) as BlogCategory[]).map((key) => (
                    <DropdownMenu.RadioItem key={key} value={key} className={menuItem}>
                      <Marker active={category === key} />
                      {labels[key]}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <input
            name="q"
            aria-label={chrome.searchPlaceholder}
            placeholder={chrome.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-[50px] w-full min-w-0 border border-ink bg-bone px-4 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-ink outline-none placeholder:text-purple/60 focus:border-purple md:w-[256px]"
          />
        </form>
      </div>
    </section>
  );
}

/* Square swatch marker — filled yellow when the row is the active filter. */
function Marker({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`h-2.5 w-2.5 shrink-0 border border-current ${active ? "bg-yellow" : "bg-transparent"}`}
    />
  );
}
