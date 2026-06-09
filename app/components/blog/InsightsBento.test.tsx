import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { InsightsBento } from "./InsightsBento";
import type { LocalizedPost } from "@/sanity/queries";
import type { Lang } from "@/app/content/home";

function post(slug: string, category: LocalizedPost["category"]): LocalizedPost {
  return {
    slug,
    date: "2026-05-20",
    read: "5 min",
    category,
    image: `/images/${slug}.png`,
    title: `Title ${slug}`,
    excerpt: `Excerpt ${slug}`,
    body: ["b"],
  };
}

const posts: LocalizedPost[] = [
  post("a", "trends"),
  post("b", "structural"),
  post("c", "sustainability"),
  post("d", "floor"),
  post("e", "studio"),
  post("f", "structural"),
];

function renderBento(posts: readonly LocalizedPost[], lang: Lang, labels: Record<LocalizedPost["category"], string>, readLabel: string) {
  return render(
    <NextIntlClientProvider locale={lang} messages={{}}>
      <InsightsBento posts={posts} lang={lang} labels={labels} readLabel={readLabel} />
    </NextIntlClientProvider>,
  );
}

describe("InsightsBento", () => {
  it("renders one card per post, each linking to its article", () => {
    renderBento(posts, "en", {
      structural: "Structural", trends: "Trends", sustainability: "Sustainability",
      floor: "Floor", studio: "Studio",
    }, "Read");
    for (const p of posts) {
      const link = screen.getByRole("link", { name: new RegExp(`Title ${p.slug}`) });
      expect(link).toHaveAttribute("href", `/en/blog/${p.slug}`);
    }
  });

  it("caps at six cards even if more posts are passed", () => {
    const many = [...posts, post("g", "trends")];
    renderBento(many, "he", {
      structural: "מבני", trends: "מגמות", sustainability: "קיימות",
      floor: "מהמפעל", studio: "סטודיו",
    }, "לקריאה");
    expect(screen.queryByRole("link", { name: /Title g/ })).toBeNull();
  });
});
