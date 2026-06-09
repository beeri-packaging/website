import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightsBento } from "./InsightsBento";
import type { LocalizedPost } from "@/sanity/queries";

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

describe("InsightsBento", () => {
  it("renders one card per post, each linking to its article", () => {
    render(<InsightsBento posts={posts} lang="en" labels={{
      structural: "Structural", trends: "Trends", sustainability: "Sustainability",
      floor: "Floor", studio: "Studio",
    }} readLabel="Read" />);
    for (const p of posts) {
      const link = screen.getByRole("link", { name: new RegExp(`Title ${p.slug}`) });
      expect(link).toHaveAttribute("href", `/en/blog/${p.slug}`);
    }
  });

  it("caps at six cards even if more posts are passed", () => {
    const many = [...posts, post("g", "trends")];
    render(<InsightsBento posts={many} lang="he" labels={{
      structural: "מבני", trends: "מגמות", sustainability: "קיימות",
      floor: "מהמפעל", studio: "סטודיו",
    }} readLabel="לקריאה" />);
    expect(screen.queryByRole("link", { name: /Title g/ })).toBeNull();
  });
});
