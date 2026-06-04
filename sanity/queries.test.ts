import { describe, it, expect } from "vitest";
import { toChrome } from "./queries";
import { chromeContent } from "@/app/content/site";

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
