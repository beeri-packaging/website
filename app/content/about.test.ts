import { describe, it, expect } from "vitest";
import { aboutCopy } from "@/app/content/about";

describe("aboutCopy", () => {
  it("has he and en with identical key sets", () => {
    expect(Object.keys(aboutCopy.he).sort()).toEqual(Object.keys(aboutCopy.en).sort());
  });

  it("has 5 milestones per locale and excludes October 7 content", () => {
    for (const lang of ["he", "en"] as const) {
      expect(aboutCopy[lang].milestones).toHaveLength(5);
      // Guardrail: the page must not carry any Oct-7 / תקומה reference.
      const blob = JSON.stringify(aboutCopy[lang]);
      expect(blob).not.toMatch(/7\.10\.2023|השבת השחורה|October 7|תקומה/i);
    }
  });

  it("links out to the parent group site per locale", () => {
    expect(aboutCopy.he.groupLinkHref).toBe("https://beeriprint.co.il");
    expect(aboutCopy.en.groupLinkHref).toBe("https://en.beeriprint.co.il");
  });

  it("keeps the 1950 group heritage distinct from the 1964 entity", () => {
    expect(aboutCopy.he.heritageBody).toContain("1950");
    expect(aboutCopy.he.milestones.some((m) => m.year === "1964")).toBe(true);
  });
});
