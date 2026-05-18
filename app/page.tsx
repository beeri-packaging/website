"use client";

import { useEffect, useState } from "react";
import { homeCopy } from "@/app/content/home";
import type { Lang } from "@/app/content/home";
import { Header } from "@/app/components/home/Header";
import { MobileDrawer } from "@/app/components/home/MobileDrawer";
import { Hero } from "@/app/components/home/Hero";
import { DualJourney } from "@/app/components/home/DualJourney";
import { TechnicalExcellence } from "@/app/components/home/TechnicalExcellence";
import { Faq } from "@/app/components/home/Faq";
import { CallToAction } from "@/app/components/home/CallToAction";
import { Footer } from "@/app/components/home/Footer";
import { StickyContact } from "@/app/components/home/StickyContact";

export default function Home() {
  const [lang, setLang] = useState<Lang>("he");
  const [menuOpen, setMenuOpen] = useState(false);

  // Reflect language on the <html> element so dir + lang attributes follow.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.dataset.scrollLock = menuOpen ? "true" : "false";
    return () => {
      document.body.dataset.scrollLock = "false";
    };
  }, [menuOpen]);

  const t = homeCopy[lang];

  return (
    <div className="relative flex flex-col bg-bone text-ink overflow-x-clip">
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
      <main className="flex flex-col">
        <Hero lang={lang} t={t} />
        <DualJourney lang={lang} t={t} />
        <TechnicalExcellence lang={lang} t={t} />
        <Faq lang={lang} t={t} />
        <CallToAction lang={lang} t={t} />
      </main>
      <Footer lang={lang} t={t} />
      <StickyContact lang={lang} t={t} />
    </div>
  );
}
