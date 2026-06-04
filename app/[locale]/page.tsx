import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { getHome, toHomeCopy, getChrome, toChrome } from "@/sanity/queries";
import { SiteHeader } from "@/app/components/home/SiteHeader";
import { Hero } from "@/app/components/home/Hero";
import { DualJourney } from "@/app/components/home/DualJourney";
import { TechnicalExcellence } from "@/app/components/home/TechnicalExcellence";
import { Faq } from "@/app/components/home/Faq";
import { CallToAction } from "@/app/components/home/CallToAction";
import { Footer } from "@/app/components/home/Footer";
import { StickyContact } from "@/app/components/home/StickyContact";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const doc = await getHome(lang);
  const t = toHomeCopy(doc, lang);
  const chrome = toChrome(await getChrome(lang), lang);

  return (
    <div className="relative flex flex-col bg-bone text-ink overflow-x-clip">
      <SiteHeader lang={lang} chrome={chrome} />
      <main id="main" className="flex flex-col">
        <Hero lang={lang} t={t} />
        <DualJourney lang={lang} t={t} />
        <TechnicalExcellence lang={lang} t={t} />
        <Faq lang={lang} t={t} />
        <CallToAction lang={lang} t={t} />
      </main>
      <Footer lang={lang} chrome={chrome} />
      <StickyContact lang={lang} chrome={chrome} />
    </div>
  );
}
