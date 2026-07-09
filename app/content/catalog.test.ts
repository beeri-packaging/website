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
});
