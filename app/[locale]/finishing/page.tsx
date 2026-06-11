import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { FinishingPageDesign } from "@/app/components/finishing/FinishingPageDesign";
import { getFinishing, toFinishingCopy, getChrome, toChrome } from "@/sanity/queries";
import { pageSeo } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toFinishingCopy(await getFinishing(locale as Lang), locale as Lang);
  const title = copy.title.join(" ");
  return { title, description: copy.intro, ...pageSeo(locale, "/finishing", title, copy.intro) };
}

export default async function FinishingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = toFinishingCopy(await getFinishing(lang), lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell lang={lang} chrome={chrome}>
      <FinishingPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
