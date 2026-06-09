import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { InsightsPageDesign } from "@/app/components/blog/InsightsPageDesign";
import { insightsChrome } from "@/app/content/blog";
import {
  getAllPosts,
  getBlogSettings,
  toBlogIndexCopy,
  toCategoryLabels,
  getChrome,
  toChrome,
  getCareers,
  toCareersCopy,
} from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { pageSeo } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = toBlogIndexCopy(
    await getBlogSettings(locale as Lang),
    locale as Lang,
  );
  const title = copy.title.join(" ");
  return {
    title,
    description: copy.lead,
    ...pageSeo(locale, "/blog", title, copy.lead),
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const settings = await getBlogSettings(lang);
  const [posts, copy, labels, chrome, careers] = [
    await getAllPosts(lang),
    toBlogIndexCopy(settings, lang),
    toCategoryLabels(settings, lang),
    toChrome(await getChrome(lang), lang),
    toCareersCopy(await getCareers(lang), lang),
  ];
  return (
    <PlaceholderShell chrome={chrome}>
      <InsightsPageDesign
        posts={posts}
        copy={copy}
        chrome={insightsChrome[lang]}
        labels={labels}
        lang={lang}
        roles={careers.roles}
        roleFilters={careers.filters}
        rolesTitle={careers.rolesTitle}
        apply={careers.apply}
        noRoles={careers.noRoles}
      />
    </PlaceholderShell>
  );
}
