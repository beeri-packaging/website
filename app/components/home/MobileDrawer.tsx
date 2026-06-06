"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { LangPill } from "./LangPill";

export function MobileDrawer({
  open,
  onClose,
  lang,
  chrome,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  chrome: Chrome;
}) {
  const panelRef = useRef<HTMLElement>(null);

  // Real-dialog behavior: move focus in on open, trap Tab inside, close on
  // Escape, and restore focus to the trigger on close. (role="dialog" +
  // aria-modal promise this; without it keyboard/SR users stay stranded behind
  // the backdrop.)
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden animate-drawer-bg"
      />
      <aside
        ref={panelRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={chrome.menu}
        className="fixed inset-x-0 top-[64px] sm:top-[72px] z-40 lg:hidden bg-bone border-y border-bone-line shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] animate-drawer-in"
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 py-8 sm:py-10 flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans uppercase text-clay text-[11px] tracking-[0.08em] leading-4">
              {chrome.lang}
            </span>
            <LangPill lang={lang} />
          </div>

          <ul className="flex flex-col gap-1 border-t border-rule pt-6">
            {chrome.navLinks.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 py-4 border-b border-rule/60 transition-colors hover:bg-sand/60 focus-ring"
                >
                  <span className="font-sans font-bold uppercase text-clay text-[11px] tracking-[0.08em] tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-display text-ink text-[44px] sm:text-[52px] leading-[0.95] text-start">
                    {lang === "he" ? l.he : l.en}
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 items-center justify-center text-ink transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                  >
                    <svg
                      width="22"
                      height="14"
                      viewBox="0 0 22 14"
                      fill="none"
                      className="ltr:-scale-x-100"
                    >
                      <path
                        d="M21 7H1M7 1L1 7l6 6"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4">
            <ContactTriggerButton
              onClick={onClose}
              className="inline-flex items-center justify-center bg-ink text-bone rounded-none px-8 py-4 text-[14px] font-sans font-bold tracking-[0.08em] hover:bg-clay transition-colors duration-300"
            >
              {chrome.contact}
            </ContactTriggerButton>
            <div className="flex items-center justify-between text-clay/80 text-[12px] uppercase tracking-[0.08em]">
              <span>
                {chrome.footerAddr[0]} · {chrome.footerAddr[1]}
              </span>
              <span>{chrome.footerCopy.split("©")[1]?.split(".")[0] ?? ""}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
