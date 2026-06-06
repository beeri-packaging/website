import { test, expect } from "@playwright/test";

const cases = [
  { locale: "he", nav: "אודות" },
  { locale: "en", nav: "About" },
] as const;

for (const { locale, nav } of cases) {
  test(`about page renders, is in the menu, and links the parent group (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/about`);

    // Hero heading is present.
    await expect(page.locator("h1").first()).toBeVisible();

    // "About" appears in the site menu (desktop header nav).
    await expect(page.getByRole("link", { name: nav, exact: true }).first()).toBeVisible();

    // The parent-group link opens in a new tab with a safe rel and the right URL.
    const group = page
      .getByRole("link", { name: /beeriprint|הקבוצה|group site/i })
      .first();
    await expect(group).toHaveAttribute("rel", /noopener/);
    await expect(group).toHaveAttribute("href", /beeriprint\.co\.il/);
    await expect(group).toHaveAttribute("target", "_blank");
  });
}
