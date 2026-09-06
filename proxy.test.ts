import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import proxy from "./proxy";

vi.mock("next-intl/middleware", () => ({
  default: () => () => new Response(null, { headers: { "x-test-intl": "1" } }),
}));

afterEach(() => vi.unstubAllEnvs());

describe("public site testing mode", () => {
  it.each([undefined, "false"])(
    "opens both locales when maintenance mode is %s",
    (mode) => {
      vi.stubEnv("PUBLIC_MAINTENANCE_MODE", mode);
      for (const host of ["beeripacks.co.il", "www.beeripacks.co.il"]) {
        for (const locale of ["he", "en"]) {
          const response = proxy(new NextRequest(`https://${host}/${locale}`));
          expect(response.headers.get("x-test-intl")).toBe("1");
          expect(response.headers.get("x-middleware-rewrite")).toBeNull();
        }
      }
    },
  );

  it.each(["he", "en"])("can restore the %s holding page", (locale) => {
    vi.stubEnv("PUBLIC_MAINTENANCE_MODE", "true");
    const response = proxy(new NextRequest(`https://www.beeripacks.co.il/${locale}`));
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://www.beeripacks.co.il/under-construction",
    );
    expect(response.headers.get("x-middleware-request-x-maintenance-locale")).toBe(locale);
  });

  it("keeps preview URLs open when maintenance is enabled", () => {
    vi.stubEnv("PUBLIC_MAINTENANCE_MODE", "true");
    const response = proxy(new NextRequest("https://website-git-main-beeri2.vercel.app/he"));
    expect(response.headers.get("x-test-intl")).toBe("1");
  });

  it("keeps search engines blocked during public testing", async () => {
    vi.stubEnv("PUBLIC_MAINTENANCE_MODE", "false");
    const response = proxy(new NextRequest("https://www.beeripacks.co.il/robots.txt"));
    expect(await response.text()).toBe("User-agent: *\nDisallow: /\n");
  });
});
