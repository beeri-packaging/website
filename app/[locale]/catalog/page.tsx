import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { CatalogPageDesign } from "@/app/components/catalog/CatalogPageDesign";
import { getCatalog, toCatalogContent, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toCatalogContent(await getCatalog(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.intro };
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const [copy, chrome] = [
    toCatalogContent(await getCatalog(lang), lang),
    toChrome(await getChrome(lang), lang),
  ];
  return (
    <PlaceholderShell chrome={chrome}>
      <CatalogPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
