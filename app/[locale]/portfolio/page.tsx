import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { getPlaceholder, toPlaceholderCopy, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toPlaceholderCopy(await getPlaceholder("portfolio", locale as Lang), "portfolio", locale as Lang);
  return { title: copy.title.join(" "), description: copy.body };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = toPlaceholderCopy(await getPlaceholder("portfolio", lang), "portfolio", lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <PlaceholderHero copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
