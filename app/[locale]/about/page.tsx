import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { AboutPageDesign } from "@/app/components/about/AboutPageDesign";
import { aboutCopy } from "@/app/content/about";
import { getChrome, toChrome } from "@/sanity/queries";
import { pageSeo } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = aboutCopy[locale as Lang];
  const title = copy.title.join(" ");
  return { title, description: copy.intro, ...pageSeo(locale, "/about", title, copy.intro) };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const copy = aboutCopy[lang];
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <AboutPageDesign copy={copy} />
    </PlaceholderShell>
  );
}
