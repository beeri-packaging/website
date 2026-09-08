import { describe, it, expect } from "vitest";
import { toChrome, toCareersCopy, toFinishingCopy, toBlogIndexCopy, toCategoryLabels, toPlaceholderCopy } from "./queries";
import { chromeContent } from "@/app/content/site";
import { careersCopy } from "@/app/content/careers";
import { finishingCopy } from "@/app/content/finishing";
import { blogIndexCopy, categoryLabels } from "@/app/content/blog";
import { placeholderContent } from "@/app/content/placeholder";

describe("toChrome", () => {
  it("returns bundled fallback when doc is null", () => {
    const result = toChrome(null, "he");
    expect(result.logoHe).toBe(chromeContent.he.logoHe);
    expect(result.menu).toBe(chromeContent.he.menu);
    expect(result.footerTagline).toContain(" - ");
  });
  it("prefers the doc value and falls back per-field", () => {
    const result = toChrome({ menu: "X" }, "en");
    expect(result.menu).toBe("X");
    expect(result.close).toBe(chromeContent.en.close); // fell back
  });
  it("uses the asset URL over the legacy path for logos", () => {
    const result = toChrome(
      { logoHeUrl: "https://cdn/he.svg", logoHeLegacy: "/images/logo-he.svg" },
      "he"
    );
    expect(result.logoHe).toBe("https://cdn/he.svg");
  });
});

describe("toCareersCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    const result = toCareersCopy(null, "he");
    expect(result.title).toEqual(careersCopy.he.title);
    expect(result.articles).toHaveLength(careersCopy.he.articles.length);
    expect(JSON.stringify(result)).not.toMatch(/[—–]/);
  });
});

describe("toFinishingCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    const result = toFinishingCopy(null, "en");
    expect(result.title).toEqual(finishingCopy.en.title);
    expect(result.standards.map(s => s.code)).toEqual(["ISO 9001:2015", "FSSC 22000", "ESSENTIAL", "VITAL"]);
    expect(result.standards.slice(-2).every(s => s.certificateUrl?.startsWith("https://cdn.sanity.io/files/"))).toBe(true);
  });

  it("keeps the approved standards when an older Sanity document has no standards section", () => {
    const result = toFinishingCopy({ title: ["Finishing", "that adds value"] }, "en");
    expect(result.standards.map((standard) => standard.code)).toEqual([
      "ISO 9001:2015",
      "FSSC 22000",
      "ESSENTIAL",
      "VITAL",
    ]);
  });
});

describe("blog mappers", () => {
  it("blog index falls back when doc is null", () => {
    const result = toBlogIndexCopy(null, "he");
    expect(result.title).toEqual(blogIndexCopy.he.title);
    expect(result.body).toContain(" - ");
  });
  it("category labels fall back to bundled per-locale", () => {
    const labels = toCategoryLabels(null, "en");
    expect(labels.structural).toBe(categoryLabels.structural.en);
  });
  it("blog index uses the Blog name", () => {
    expect(blogIndexCopy.he.title).toEqual(["בארי", "מספרת"]);
    expect(blogIndexCopy.en.title).toEqual(["Beeri", "stories"]);
    expect(blogIndexCopy.he.eyebrow).toContain("בלוג");
  });
});

describe("toPlaceholderCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    const result = toPlaceholderCopy(null, "catalog", "he");
    expect(result.title).toEqual(placeholderContent.catalog.he.title);
    expect(result.preview).toContain("קרטון 250-350 גרם");
  });
});
