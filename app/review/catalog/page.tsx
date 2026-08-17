import type { Metadata } from "next";
import { getCatalog, toCatalogContent } from "@/sanity/queries";
import { CatalogAudit } from "./CatalogAudit";

// Internal tool — never index it, and keep it out of sitemaps.
export const metadata: Metadata = {
  title: "ביקורת קטלוג · בארי אריזות",
  description: "עמוד פנימי לביקורת פריטי הקטלוג על ידי הלקוח.",
  robots: { index: false, follow: false },
};

/**
 * Catalog audit — the same content the live catalog renders, item by item.
 *
 * Reads through the identical Sanity query + mapper as `/he/catalog`, so what
 * the client audits here is exactly what ships. Hebrew only: this is an internal
 * approval surface, not a localised page.
 */
export default async function CatalogAuditPage() {
  const copy = toCatalogContent(await getCatalog("he"), "he");
  return <CatalogAudit categories={copy.categories} />;
}
