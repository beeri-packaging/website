"use client";

import { useState } from "react";
import type { HomeCopy, Lang } from "@/app/content/home";

export function Faq({ t, items }: { lang: Lang; t: HomeCopy; items: readonly { n: string; q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-bone py-20 sm:py-24 md:py-28 lg:py-24 scroll-mt-[80px] flex flex-col"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 md:px-12 lg:px-20 flex flex-col gap-10 md:gap-14 lg:gap-8 xl:gap-12">
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
          <p className="font-sans text-clay text-[16px] sm:text-[18px] md:text-[20px] lg:text-[17px] xl:text-[20px] leading-[1.5] max-w-[454px] md:order-2">
            {t.faqBody}
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 text-start md:order-1">
            <span className="font-sans font-extrabold uppercase text-magenta-deep text-[11px] sm:text-[12px] tracking-[0.08em] leading-4">
              {t.faqEyebrow}
            </span>
            <h2 className="font-display text-logo-dark text-[44px] sm:text-[64px] lg:text-[80px] xl:text-[96px] leading-[1] text-balance max-w-[532px]">
              {t.faqTitle}
            </h2>
          </div>
        </div>

        <ul className="reveal flex flex-col border-t border-rule">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={item.n} className="border-b border-rule">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="group w-full flex items-center justify-between gap-4 sm:gap-8 md:gap-12 py-4 sm:py-5 md:py-6 lg:py-4 xl:py-6 text-start cursor-pointer focus-ring"
                >
                  <span className="font-display text-cyan text-[36px] sm:text-[56px] md:text-[80px] lg:text-[88px] xl:text-[96px] leading-[0.4] text-center tabular-nums w-[44px] sm:w-[80px] md:w-[110px] lg:w-[110px] xl:w-[120px] shrink-0 transition-colors duration-300 group-hover:text-ink">
                    {item.n}
                  </span>
                  <span className="flex-1 font-sans font-extrabold text-ink text-[16px] sm:text-[20px] md:text-[24px] leading-[1.3] text-start">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="relative inline-flex h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-rule text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-bone group-hover:border-ink shrink-0"
                  >
                    <span
                      className={`absolute h-px w-4 sm:w-5 bg-current transition-transform duration-500 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                    <span
                      className={`absolute h-px w-4 sm:w-5 bg-current transition-transform duration-500 ${
                        isOpen ? "rotate-180 opacity-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                    isOpen ? "grid-rows-[1fr] pb-7 sm:pb-8" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4 sm:gap-12 pl-0 sm:pl-2">
                      <span aria-hidden className="hidden sm:block" />
                      <p className="font-sans text-clay text-[14px] sm:text-[16px] md:text-[18px] leading-[1.6] max-w-[640px]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
