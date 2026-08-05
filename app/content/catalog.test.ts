import { describe, expect, it } from "vitest";
import { catalogCopy } from "@/app/content/catalog";

describe("catalogCopy", () => {
  it("uses the July 8 client-approved Hebrew hero copy", () => {
    expect(catalogCopy.he.eyebrow).toBe("קטלוג");
    expect(catalogCopy.he.intro.split("\n\n")).toHaveLength(5);
    expect(catalogCopy.he.intro).toContain(
      "קוסמטיקה, מזון, יין, משקאות, טקסטיל, קפה, פארמה וטואלטיקה",
    );
  });

  it("uses the client-provided coffee range for category 03 in both locales", () => {
    for (const locale of ["he", "en"] as const) {
      const category = catalogCopy[locale].categories.find((item) => item.number === "03");
      expect(category?.key).toBe("coffee");
      expect(category?.layout).toBe("grid");
      expect(category?.items.map((item) => item.key)).toEqual([
        "coffee-elite",
        "coffee-aroma",
        "coffee-joe",
        "coffee-tasters-choice",
      ]);
    }
  });

  it("uses Michal's complete wine range for category 02 in both locales", () => {
    for (const locale of ["he", "en"] as const) {
      const category = catalogCopy[locale].categories.find((item) => item.number === "02");
      expect(category?.key).toBe("spirits");
      expect(category?.layout).toBe("grid");
      expect(category?.items.map((item) => item.key)).toEqual([
        "wine-mony",
        "wine-barkan",
        "wine-golan",
        "wine-carmel",
        "wine-tabor",
        "wine-recanati",
      ]);
    }
  });

  it("uses the existing Beeri beer-carrier range for category 04 in both locales", () => {
    for (const locale of ["he", "en"] as const) {
      const category = catalogCopy[locale].categories.find((item) => item.number === "04");
      expect(category?.key).toBe("beer");
      expect(category?.layout).toBe("grid");
      expect(category?.items.map((item) => item.key)).toEqual([
        "beer-malka",
        "beer-goldstar",
        "beer-carlsberg",
        "beer-tuborg",
      ]);
    }
  });

  it("groups the additional tea and beverage work into category 05", () => {
    for (const locale of ["he", "en"] as const) {
      const category = catalogCopy[locale].categories.find((item) => item.number === "05");
      expect(category?.key).toBe("beverages");
      expect(category?.items.map((item) => item.key)).toEqual([
        "beverage-wissotzky",
        "beverage-sodastream",
        "beverage-finishing",
      ]);
    }
  });
});
