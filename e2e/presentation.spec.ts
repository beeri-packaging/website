import { expect, test } from "@playwright/test";

for (const locale of ["he", "en"] as const) {
  test(`/${locale}/presentation renders the guided website reveal`, async ({ page }) => {
    await page.goto(`/${locale}/presentation`);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-presentation-slide]")).toHaveCount(5);
    await expect(page.locator("iframe")).toHaveCount(5);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button[aria-current="step"]')).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "he" ? "rtl" : "ltr",
    );
  });
}
