import { test, expect } from "@playwright/test";

for (const { locale, heading } of [
  { locale: "he", heading: "תובנות" },
  { locale: "en", heading: "Insights" },
]) {
  test(`/${locale}/blog renders the Insights index`, async ({ page }) => {
    await page.goto(`/${locale}/blog`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    // the bento cards link through to individual articles
    const cards = page.locator(`a[href*="/${locale}/blog/"]`);
    await expect(cards.first()).toBeVisible();
  });
}
