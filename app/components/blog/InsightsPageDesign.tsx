"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/app/content/home";
import type { BlogIndexCopy, InsightsChrome, BlogCategory } from "@/app/content/blog";
import type { LocalizedPost } from "@/sanity/queries";
import { InsightsHero } from "@/app/components/blog/InsightsHero";
import { InsightsBento } from "@/app/components/blog/InsightsBento";
import { InsightsNewsletter } from "@/app/components/blog/InsightsNewsletter";

export function InsightsPageDesign({
  posts, copy, chrome, labels, lang,
}: {
  posts: readonly LocalizedPost[];
  copy: BlogIndexCopy;
  chrome: InsightsChrome;
  labels: Record<BlogCategory, string>;
  lang: Lang;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.excerpt, labels[p.category]].join(" ").toLocaleLowerCase().includes(q),
    );
  }, [posts, labels, query]);

  return (
    <div className="bg-bone">
      <InsightsHero copy={copy} chrome={chrome} query={query} onQueryChange={setQuery} />
      <InsightsBento posts={visible} lang={lang} labels={labels} readLabel={copy.readMore} />
      <InsightsNewsletter chrome={chrome} />
    </div>
  );
}
