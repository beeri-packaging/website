"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";

export function SiteHeader({ lang, chrome }: { lang: Lang; chrome: Chrome }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.scrollLock = menuOpen ? "true" : "false";
    return () => {
      document.body.dataset.scrollLock = "false";
    };
  }, [menuOpen]);

  return (
    <>
      <Header lang={lang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} chrome={chrome} />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} chrome={chrome} />
    </>
  );
}
