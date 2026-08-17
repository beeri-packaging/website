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

  it("keeps the approved standards when an older Sanity document has no standards section", () => {
    const result = toFinishingCopy({ title: ["Finishing", "that adds value"] }, "en");
    expect(result.standards.map((standard) => standard.code)).toEqual([
      "ISO 9001:2015",
      "FSSC 22000",
    ]);
  });

  it("maps a Sanity certificate file to the public certificate link", () => {
    const result = toFinishingCopy(
      {
        standards: [
          {
            code: "ISO 9001:2015",
            title: "Quality management",
            body: "Certified quality-management system.",
            certificateLabel: "View certificate",
            certificateUrl: "https://cdn.sanity.io/files/project/production/iso.pdf",
          },
        ],
      },
      "en"
    );

    expect(result.standards[0].certificateUrl).toBe(
      "https://cdn.sanity.io/files/project/production/iso.pdf"
    );
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
  it("blog index uses the Blog name", () => {
    expect(blogIndexCopy.he.title).toEqual(["בארי", "מספרת"]);
    expect(blogIndexCopy.en.title).toEqual(["Beeri", "stories"]);
    expect(blogIndexCopy.he.eyebrow).toContain("בלוג");
  });
});

describe("toPlaceholderCopy", () => {
  it("returns bundled fallback when doc is null", () => {
    expect(toPlaceholderCopy(null, "catalog", "he")).toEqual(placeholderContent.catalog.he);
  });
});
