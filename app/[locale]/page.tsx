import { launchMusic } from "@/app/content/launch";
import { LaunchReveal } from "@/app/components/home/LaunchReveal";
import { launchConfig } from "@/lib/launch";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { getHome, toHomeContent, getChrome, toChrome } from "@/sanity/queries";
import { SiteHeader } from "@/app/components/home/SiteHeader";
import { Hero } from "@/app/components/home/Hero";
import { DualJourney } from "@/app/components/home/DualJourney";
import { TechnicalExcellence } from "@/app/components/home/TechnicalExcellence";
import { Faq } from "@/app/components/home/Faq";
import { CallToAction } from "@/app/components/home/CallToAction";
import { Footer } from "@/app/components/home/Footer";
import { StickyContact } from "@/app/components/home/StickyContact";
import { FaqJsonLd } from "@/app/components/seo/JsonLd";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const doc = await getHome(lang);
  const home = toHomeContent(doc, lang);
  const chrome = toChrome(await getChrome(lang), lang);

  const launch = await getTranslations({ locale: lang, namespace: "Launch" });

  return (
    <>
      <LaunchReveal
        video={home.heroVideo}
        music={launchMusic}
        poster={home.heroImage}
        logo={lang === "he" ? chrome.logoHe : chrome.logoEn}
        config={launchConfig(process.env.LAUNCH_START_AT, process.env.LAUNCH_END_AT)}
        copy={{
          title: launch("title"), subtitle: launch("subtitle"), start: launch("start"),
          skip: launch("skip"), countdown: launch.raw("countdown"), welcome: launch("welcome"), brand: launch("brand"),
          stopCelebration: launch("stopCelebration"), soundOn: launch("soundOn"), soundOff: launch("soundOff"), pauseVideo: launch("pauseVideo"), playVideo: launch("playVideo"),
        }}
      />
      <div id="launch-website" className="relative flex flex-col bg-bone text-ink overflow-x-clip">
      <SiteHeader lang={lang} chrome={chrome} />
      <main id="main" className="flex flex-col">
        <Hero lang={lang} t={home.copy} heroImage={home.heroImage} heroVideo={home.heroVideo} />
        <DualJourney lang={lang} t={home.copy} panels={home.journeyPanels} />
        <TechnicalExcellence lang={lang} t={home.copy} capabilities={home.capabilities} bentoServiceImage={home.bentoServiceImage} />
        <FaqJsonLd items={home.faqItems} locale={lang} />
        <Faq lang={lang} t={home.copy} items={home.faqItems} />
        <CallToAction lang={lang} t={home.copy} />
      </main>
      <Footer lang={lang} chrome={chrome} />
      <StickyContact lang={lang} chrome={chrome} />
      </div>
    </>
  );
}
