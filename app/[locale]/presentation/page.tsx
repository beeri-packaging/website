import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { aboutCopy } from "@/app/content/about";
import { PresentationDeck } from "@/app/components/presentation/PresentationDeck";
import {
  getCatalog,
  getChrome,
  getFinishing,
  getHome,
  toCatalogContent,
  toChrome,
  toFinishingCopy,
  toHomeContent,
} from "@/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Presentation" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const t = await getTranslations({ locale, namespace: "Presentation" });

  const [homeDoc, finishingDoc, catalogDoc, chromeDoc] = await Promise.all([
    getHome(lang),
    getFinishing(lang),
    getCatalog(lang),
    getChrome(lang),
  ]);

  return (
    <PresentationDeck
      lang={lang}
      home={toHomeContent(homeDoc, lang)}
      about={aboutCopy[lang]}
      finishing={toFinishingCopy(finishingDoc, lang)}
      catalog={toCatalogContent(catalogDoc, lang)}
      chrome={toChrome(chromeDoc, lang)}
      labels={{
        label: t("label"),
        start: t("start"),
        previous: t("previous"),
        next: t("next"),
        chapter: t.raw("chapter"),
        exit: t("exit"),
        liveExperience: t("liveExperience"),
        viewCatalog: t("viewCatalog"),
        viewFinishing: t("viewFinishing"),
        switchLanguage: t("switchLanguage"),
      }}
    />
  );
}
