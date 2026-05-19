"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { homeCopy } from "@/app/content/home";
import type { HomeCopy, Lang } from "@/app/content/home";
import { Header } from "@/app/components/home/Header";
import { MobileDrawer } from "@/app/components/home/MobileDrawer";
import { Footer } from "@/app/components/home/Footer";
import { StickyContact } from "@/app/components/home/StickyContact";

type ShellContext = {
  lang: Lang;
  t: HomeCopy;
};

const LangContext = createContext<ShellContext | null>(null);

/**
 * Read the current language/copy block published by the nearest
 * `PlaceholderShell`. Throws if used outside a shell so a missing
 * provider fails loud during development.
 */
export function useShellLang(): ShellContext {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useShellLang must be used inside a PlaceholderShell");
  }
  return ctx;
}

/**
 * Shared chrome for every non-home route. Owns the lang + mobile-drawer
 * state that the home page also owns, then publishes `lang` and the
 * localized `HomeCopy` block via context so child client components stay
 * thin and serializable across the server→client boundary.
 */
export function PlaceholderShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("he");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.body.dataset.scrollLock = menuOpen ? "true" : "false";
    return () => {
      document.body.dataset.scrollLock = "false";
    };
  }, [menuOpen]);

  const t = homeCopy[lang];

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="relative flex min-h-screen flex-col bg-bone text-ink overflow-x-clip">
        <Header
          lang={lang}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          t={t}
        />
        <MobileDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          lang={lang}
          setLang={setLang}
          t={t}
        />
        <main className="flex-1 flex flex-col pt-[88px] sm:pt-[104px] md:pt-[120px]">
          {children}
        </main>
        <Footer lang={lang} t={t} />
        <StickyContact lang={lang} t={t} />
      </div>
    </LangContext.Provider>
  );
}
