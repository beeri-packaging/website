"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import type { HomeCopy, Lang } from "@/app/content/home";

export function SiteHeader({ lang, t }: { lang: Lang; t: HomeCopy }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.scrollLock = menuOpen ? "true" : "false";
    return () => {
      document.body.dataset.scrollLock = "false";
    };
  }, [menuOpen]);

  return (
    <>
      <Header lang={lang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} t={t} />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} t={t} />
    </>
  );
}
