import { describe, expect, it } from "vitest";
import content from "./product-catalog.json";

describe("published product catalog", () => {
  it("keeps the approved product and example order identical in both languages", () => {
    const keys = (locale: "he" | "en") => content[locale].map((c) => ({ key: c.key, products: c.products.map((p) => ({ key: p.key, examples: p.examples.map((e) => e.key) })) }));
    expect(keys("he")).toEqual(keys("en"));
    for (const locale of ["he", "en"] as const) {
      const products = content[locale].flatMap((c) => c.products);
      expect(products).toHaveLength(12);
      expect(products.flatMap((p) => p.examples)).toHaveLength(32);
      expect(products.find((p) => p.key === "single-bottle")?.examples.map((e) => e.key)).toEqual(["wine-dalton"]);
      expect(products.flatMap((p) => p.examples).every((e) => e.image.startsWith("https://cdn.sanity.io/"))).toBe(true);
    }
  });
  it("does not leak Hebrew editorial content into the English catalog", () => {
    expect(JSON.stringify(content.en)).not.toMatch(/[\u0590-\u05ff]/);
  });
});
