import { describe, expect, it } from "vitest";
import { aboutCopy } from "./about";
import { catalogCopy } from "./catalog";
import products from "./product-catalog.json";
import { reviewAbout, reviewCatalog, reviewPost, reviewProducts, reviewPunctuation } from "./client-feedback";
import { toHomeCopy, type HomeDoc, type LocalizedPost } from "@/sanity/queries";

describe("Approved client feedback", () => {
  it("preserves CMS edits while keeping the fallback and typography approved", () => {
    const edited = toHomeCopy({ bento2Title: "New editor title" } as HomeDoc, "en");
    expect(edited.bento2Title).toBe("New editor title");
    expect(toHomeCopy(null, "en").bento2Title).toBe("Development lab");
    expect(reviewPunctuation("אחד — שני")).toBe("אחד - שני");
  });

  it("moves only the requested windowed carton and preserves the source catalog", () => {
    const before = JSON.stringify(products);
    const revised = reviewProducts(products.he, "he");
    const sourceExamples = products.he.flatMap(c => c.products.flatMap(p => p.examples));
    const allExamples = revised.flatMap(c => c.products.flatMap(p => p.examples));
    expect(allExamples.map(e => e.key).sort()).toEqual(sourceExamples.map(e => e.key).sort());
    const cosmetics = revised.find(c => c.key === "cosmetics-preview")!;
    expect(cosmetics.products.find(p => p.key === "cosmetics-special")!.examples.map(e => e.key)).not.toContain("sabon-three-windows");
    expect(cosmetics.products.find(p => p.key === "cosmetics-premium")!.examples.map(e => e.key)).toContain("sabon-three-windows");
    expect(allExamples.find(e => e.key === "preview-sabon-popup")!.image).toContain("6a02a304a5ba39fdd1272734254e7a4819035541");
    expect(JSON.stringify(products)).toBe(before);
  });

  it("updates both languages without changing other business facts", () => {
    for (const lang of ["he", "en"] as const) {
      const about = reviewAbout(aboutCopy[lang], lang);
      expect(about.intro).toContain("200");
      expect(about.stats.find(s => s.value === "24/6")?.labelFirst).toBe(true);
      expect(about.stats.map(s => s.value)).toEqual(aboutCopy[lang].stats.map(s => s.value));
      const catalog = reviewCatalog(catalogCopy[lang], lang);
      expect(catalog.intro).not.toMatch(/טקסטיל|טואלטיקה|textile|toiletries/);
      const inventory = (copy: typeof catalog) => copy.categories.map(category => ({
        key: category.key, items: category.items.map(item => ({ key: item.key, image: item.image })),
      }));
      expect(inventory(catalog)).toEqual(inventory(catalogCopy[lang]));
    }
  });

  it("keeps the article's engineering figures and adds the requested destinations", () => {
    const base: LocalizedPost = {slug: "aix-israel-star-winner", title: "AIX", date: "2026-01-01", read: "2", category: "studio", excerpt: "", body: [], sections: [{heading: "הנדסה", body: "לפי מסמך המוצר, המארז חוסך כ־13% חומר וכ־30% נפח."}]};
    const aix = reviewPost(base, "he");
    expect(aix.sections![0].body).not.toContain("מסמך המוצר");
    expect(aix.sections![0].body).toContain("13%");
    expect(aix.sections![0].body).toContain("30%");
    const post = reviewPost({...base, slug: "beeri-israel-star", sections: [{heading: "1", body: ""}, {heading: "2", body: ""}, {heading: "3", body: "ביומן: מארז היין של AIX ומארז שי הוותק לעובד."}]}, "he");
    expect(post.sections![2].links?.map(link => link.slug)).toEqual(["aix-israel-star-winner", "employee-tenure-gift-pack"]);
    expect(post.sections![2].body).toContain("בבלוג");
    expect(base.sections![0].body).toContain("מסמך המוצר");
  });
});
