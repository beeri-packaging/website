import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Lang } from "@/app/content/home";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogArticle } from "@/app/components/blog/BlogArticle";
import { BlogNotFound } from "@/app/components/placeholder/BlogNotFound";
import { getPost, getRelatedPosts, getAllPosts, getBlogSettings, toBlogIndexCopy, toCategoryLabels, getChrome, toChrome } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/site";
import { BlogPostingJsonLd } from "@/app/components/seo/JsonLd";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale as Lang);
    for (const p of posts) params.push({ locale, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale as Lang);
  // Unknown slug renders a soft 404 — keep it out of the index.
  if (!post) return { title: "Beeri", robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternatesFor(locale, `/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.date || undefined,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = locale as Lang;
  const post = await getPost(slug, lang);
  const settings = await getBlogSettings(lang);
  const copy = toBlogIndexCopy(settings, lang);
  const labels = toCategoryLabels(settings, lang);
  const chrome = toChrome(await getChrome(lang), lang);
  const related = post ? await getRelatedPosts(slug, lang, post.category) : [];
  return (
    <PlaceholderShell lang={lang} chrome={chrome}>
      {post ? (
        <>
          <BlogPostingJsonLd post={post} locale={lang} />
          <BlogArticle post={post} related={related} copy={copy} labels={labels} lang={lang} />
        </>
      ) : (
        <BlogNotFound copy={copy} lang={lang} />
      )}
    </PlaceholderShell>
  );
}
