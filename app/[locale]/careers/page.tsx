import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { CareersPageDesign } from "@/app/components/careers/CareersPageDesign";
import { getCareers, toCareersCopy, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toCareersCopy(await getCareers(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.intro };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const [copy, chrome] = [toCareersCopy(await getCareers(lang), lang), toChrome(await getChrome(lang), lang)];
  return (
    <PlaceholderShell chrome={chrome}>
      <CareersPageDesign copy={copy} lang={lang} />
    </PlaceholderShell>
  );
}
