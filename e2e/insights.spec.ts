import { test, expect } from "@playwright/test";

for (const { locale, heading, roles } of [
  { locale: "he", heading: "יומן", roles: "משרות פתוחות" },
  { locale: "en", heading: "Journal", roles: "Open roles" },
]) {
  test(`/${locale}/blog renders the Journal index`, async ({ page }) => {
    await page.goto(`/${locale}/blog`);
    // Hero title
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    // Bento cards link through to individual articles
    const cards = page.locator(`a[href*="/${locale}/blog/"]`);
    await expect(cards.first()).toBeVisible();
    // Open-roles section folded into the bottom of the page
    await expect(page.getByRole("heading", { name: roles })).toBeVisible();
  });
}
