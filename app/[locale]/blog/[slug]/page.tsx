import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogPostHero } from "@/app/components/placeholder/BlogPostHero";
import { BlogNotFound } from "@/app/components/placeholder/BlogNotFound";
import { blogPosts, getBlogPost } from "@/app/content/blog";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: "פוסט · בארי אריזות",
      description: "הפוסט עדיין לא פורסם — בקרוב.",
    };
  }
  return {
    title: `${post.he.title} · בארי אריזות`,
    description: post.he.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return (
    <PlaceholderShell>
      {post ? <BlogPostHero post={post} /> : <BlogNotFound />}
    </PlaceholderShell>
  );
}
