"use client";

import { createContext, useContext } from "react";
import { chromeContent } from "@/app/content/site";
import type { Chrome } from "@/app/content/site";
import type { Lang } from "@/app/content/home";
import { SiteHeader } from "@/app/components/home/SiteHeader";
import { Footer } from "@/app/components/home/Footer";
import { StickyContact } from "@/app/components/home/StickyContact";

type ShellContext = {
  lang: Lang;
};

const LangContext = createContext<ShellContext | null>(null);

/**
 * Read the current language published by the nearest `PlaceholderShell`.
 * Throws if used outside a shell so a missing provider fails loud during development.
 */
export function useShellLang(): ShellContext {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useShellLang must be used inside a PlaceholderShell");
  }
  return ctx;
}

/**
 * Shared chrome for every non-home route. Accepts an optional `chrome` prop
 * from the server page (CMS-driven); falls back to the bundled chromeContent
 * for pages not yet migrated to CMS. Owns the lang + mobile-drawer state.
 */
export function PlaceholderShell({
  lang,
  chrome,
  children,
}: {
  lang: Lang;
  chrome?: Chrome;
  children: React.ReactNode;
}) {
  const resolved = chrome ?? chromeContent[lang];

  return (
    <LangContext.Provider value={{ lang }}>
      <div className="relative flex min-h-screen flex-col bg-bone text-ink overflow-x-clip">
        <SiteHeader lang={lang} chrome={resolved} />
        <main id="main" className="flex-1 flex flex-col pt-[88px] sm:pt-[104px] md:pt-[120px]">
          {children}
        </main>
        <Footer lang={lang} chrome={resolved} />
        <StickyContact lang={lang} chrome={resolved} />
      </div>
    </LangContext.Provider>
  );
}
