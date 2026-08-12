import { describe, expect, it } from "vitest";
import {
  isPublicProductionHost,
  maintenanceLocale,
  requestHostname,
} from "@/lib/production-gate";

describe("production under-construction gate", () => {
  it.each(["beeripacks.co.il", "www.beeripacks.co.il"])(
    "recognizes %s as a public production host",
    (hostname) => {
      expect(isPublicProductionHost(hostname)).toBe(true);
    },
  );

  it.each(["localhost", "website-git-main-beeri2.vercel.app"])(
    "keeps %s off the public production gate",
    (hostname) => {
      expect(isPublicProductionHost(hostname)).toBe(false);
    },
  );

  it("uses English for English paths", () => {
    expect(maintenanceLocale("/en")).toBe("en");
    expect(maintenanceLocale("/en/catalog")).toBe("en");
  });

  it("defaults every other path to Hebrew", () => {
    expect(maintenanceLocale("/")).toBe("he");
    expect(maintenanceLocale("/he/catalog")).toBe("he");
  });

  it("resolves the original public hostname behind a deployment proxy", () => {
    expect(requestHostname("www.beeripacks.co.il", "localhost:3000", "localhost")).toBe(
      "www.beeripacks.co.il",
    );
    expect(requestHostname(null, "beeripacks.co.il:3010", "localhost")).toBe(
      "beeripacks.co.il",
    );
  });
});
