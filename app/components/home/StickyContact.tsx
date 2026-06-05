"use client";

import { useState } from "react";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { useContactDialog } from "@/app/components/contact/ContactDialogProvider";

export function StickyContact({ lang, chrome }: { lang: Lang; chrome: Chrome }) {
  const [hovered, setHovered] = useState(false);
  const { open } = useContactDialog();
  return (
    <button
      type="button"
      onClick={open}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={chrome.contact}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 md:bottom-12 md:right-12 z-40 group inline-flex items-center gap-3 sm:gap-6 bg-bone-warm hover:bg-ink hover:text-bone text-clay-soft rounded-[5px] px-3.5 sm:px-8 py-3 sm:py-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:translate-y-[-2px]"
    >
      <svg
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill="none"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        <rect x="1" y="1" width="18" height="14" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M1 1l9 7 9-7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          className={`transition-all duration-500 ${hovered ? "translate-y-[1px]" : ""}`}
        />
      </svg>
      <span className="hidden sm:inline font-sans font-bold uppercase text-[12px] sm:text-[14px] tracking-[0.08em] leading-4">
        {chrome.contact}
      </span>
      <span aria-hidden className="sr-only">
        {lang === "he" ? "צור קשר" : "Contact"}
      </span>
    </button>
  );
}
