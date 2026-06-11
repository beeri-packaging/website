import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { LegalDocument } from "@/app/components/legal/LegalDocument";
import { termsDoc } from "@/app/content/legal";
import { getChrome, toChrome } from "@/sanity/queries";
import { pageSeo } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const doc = termsDoc[locale as Lang];
  return { title: doc.title, description: doc.intro[0], ...pageSeo(locale, "/terms", doc.title, doc.intro[0]) };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell lang={lang} chrome={chrome}>
      <LegalDocument doc={termsDoc[lang]} lang={lang} />
    </PlaceholderShell>
  );
}
