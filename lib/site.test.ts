import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "./site";

describe("SEO alternates", () => {
  it("uses a self-referencing canonical for each locale", () => {
    expect(alternatesFor("he", "")).toEqual({
      canonical: "/he",
      languages: {
        he: "/he",
        en: "/en",
        "x-default": "/he",
      },
    });

    expect(alternatesFor("en", "/catalog")).toEqual({
      canonical: "/en/catalog",
      languages: {
        he: "/he/catalog",
        en: "/en/catalog",
        "x-default": "/he/catalog",
      },
    });
  });

  it("keeps next-intl from emitting request-host hreflang headers", () => {
    expect(routing.alternateLinks).toBe(false);
  });
});
