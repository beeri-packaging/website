import { describe, it, expect } from "vitest";
import { toChrome, toCareersCopy, toFinishingCopy, toBlogIndexCopy, toCategoryLabels, toPlaceholderCopy } from "./queries";
import { chromeContent } from "@/app/content/site";
import { careersCopy } from "@/app/content/careers";
import { finishingCopy } from "@/app/content/finishing";
import { blogIndexCopy, categoryLabels } from "@/app/content/blog";
import { placeholderContent } from "@/app/content/placeholder";

describe("toChrome", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toChrome(null, "he")).toEqual(chromeContent.he);
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
    expect(toCareersCopy(null, "he")).toEqual(careersCopy.he);
  });
});

describe("toFinishingCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toFinishingCopy(null, "en")).toEqual(finishingCopy.en);
  });
});

describe("blog mappers", () => {
  it("blog index falls back when doc is null", () => {
    expect(toBlogIndexCopy(null, "he")).toEqual(blogIndexCopy.he);
  });
  it("category labels fall back to bundled per-locale", () => {
    const labels = toCategoryLabels(null, "en");
    expect(labels.structural).toBe(categoryLabels.structural.en);
  });
  it("blog index uses the Insights name", () => {
    expect(blogIndexCopy.he.title).toEqual(["תובנות", "מהסטודיו"]);
    expect(blogIndexCopy.en.title).toEqual(["Insights", "from the studio"]);
    expect(blogIndexCopy.he.eyebrow).toContain("תובנות");
  });
});

describe("toPlaceholderCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toPlaceholderCopy(null, "catalog", "he")).toEqual(placeholderContent.catalog.he);
  });
});
