"use client";

import { createContext, useContext, useState } from "react";
import type { CatalogItem } from "@/app/content/catalog";
import type { Lang } from "@/app/content/home";
import { CatalogProductDialog } from "./CatalogProductDialog";

type CatalogModalContextValue = {
  /** Open the product spec-sheet modal for an item. */
  open: (item: CatalogItem, categoryName: string) => void;
};

const CatalogModalContext = createContext<CatalogModalContextValue | null>(null);

export function useCatalogModal(): CatalogModalContextValue {
  const ctx = useContext(CatalogModalContext);
  if (!ctx) {
    throw new Error("useCatalogModal must be used inside a CatalogModalProvider");
  }
  return ctx;
}

/**
 * Thin client island that owns the product-modal open/close state and mounts a
 * single CatalogProductDialog. Lets the catalog page itself stay a server
 * component — only this provider, the per-card open button, and the dialog ship
 * as client JS (server-first; AGENTS.md "a whole page must never be use client").
 */
export function CatalogModalProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<{ item: CatalogItem; categoryName: string } | null>(null);

  return (
    <CatalogModalContext.Provider
      value={{ open: (item, categoryName) => setActive({ item, categoryName }) }}
    >
      {children}
      <CatalogProductDialog
        lang={lang}
        item={active?.item ?? null}
        categoryName={active?.categoryName ?? ""}
        open={active !== null}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
      />
    </CatalogModalContext.Provider>
  );
}

/** Full-card overlay button that opens the product modal (client leaf). */
export function ProductOpenButton({
  item,
  categoryName,
}: {
  item: CatalogItem;
  categoryName: string;
}) {
  const { open } = useCatalogModal();
  return (
    <button
      type="button"
      aria-label={item.name}
      onClick={() => open(item, categoryName)}
      className="absolute inset-0 z-10 cursor-pointer focus-ring"
    />
  );
}
