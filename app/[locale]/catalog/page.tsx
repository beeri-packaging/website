import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { CatalogHero } from "@/app/components/catalog/CatalogPageDesign";
import { getCatalog, toCatalogContent, getChrome, toChrome } from "@/sanity/queries";
import { CatalogProductConcept } from "@/app/review/catalog-example/CatalogProductConcept";
import { getProductCatalog } from "@/sanity/product-catalog";
import { pageSeo } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toCatalogContent(await getCatalog(locale as Lang), locale as Lang);
  const title = copy.title.join(" ");
  return { title, description: copy.intro, ...pageSeo(locale, "/catalog", title, copy.intro) };
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const [catalog, settings, categories, t] = await Promise.all([getCatalog(lang), getChrome(lang), getProductCatalog(lang), getTranslations({ locale, namespace: "productCatalog" })]);
  const copy = toCatalogContent(catalog, lang);
  const chrome = toChrome(settings, lang);
  return (
    <PlaceholderShell lang={lang} chrome={chrome}>
      <div className="bg-bone pb-24 sm:pb-32">
        <CatalogHero copy={copy} />
        <div id="catalog" className="scroll-mt-[80px]">
          <CatalogProductConcept categories={categories} imageFit="contain" emptyExamplesLabel={t("emptyExamplesLabel")} copy={{ openLabel: t("openLabel"), productTypeSingular: t("productTypeSingular"), productTypePlural: t("productTypePlural"), examplesLabel: t("examplesLabel"), characteristicsLabel: t("characteristicsLabel"), examplePrefix: t("examplePrefix"), closeLabel: t("closeLabel") }} />
        </div>
      </div>
    </PlaceholderShell>
  );
}
