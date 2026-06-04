import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogIndex } from "@/app/components/placeholder/BlogIndex";
import { getBlogSettings, toBlogIndexCopy, toCategoryLabels, getAllPosts, getChrome, toChrome } from "@/sanity/queries";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = toBlogIndexCopy(await getBlogSettings(locale as Lang), locale as Lang);
  return { title: copy.title.join(" "), description: copy.lead };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const settings = await getBlogSettings(lang);
  const copy = toBlogIndexCopy(settings, lang);
  const labels = toCategoryLabels(settings, lang);
  const posts = await getAllPosts(lang);
  const chrome = toChrome(await getChrome(lang), lang);
  return (
    <PlaceholderShell chrome={chrome}>
      <BlogIndex copy={copy} posts={posts} labels={labels} lang={lang} />
    </PlaceholderShell>
  );
}
