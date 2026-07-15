import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PresentationDeck } from "@/app/components/presentation/PresentationDeck";

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

  return (
    <PresentationDeck
      lang={lang}
      labels={{
        previous: t("previous"),
        next: t("next"),
        chapter: t.raw("chapter"),
        exit: t("exit"),
        openPage: t("openPage"),
        pages: {
          home: t("pages.home"),
          about: t("pages.about"),
          catalog: t("pages.catalog"),
          finishing: t("pages.finishing"),
          journal: t("pages.journal"),
        },
        tour: {
          label: t("tour.label"),
          play: t("tour.play"),
          pause: t("tour.pause"),
          resume: t("tour.resume"),
          restart: t("tour.restart"),
          close: t("tour.close"),
          step: t.raw("tour.step"),
          steps: t.raw("tour.steps"),
        },
      }}
    />
  );
}
