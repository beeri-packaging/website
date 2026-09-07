import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["he", "en"] as const) {
  test(`published catalog preserves all products, images and features (${locale})`, async ({ page }) => {
    test.setTimeout(150_000);
    await page.goto(`/${locale}/catalog`);
    const cards = page.getByRole("button", { name: locale === "he" ? /— לפתיחת המוצר$/ : /— View packaging$/ });
    await expect(cards).toHaveCount(12);
    let imageCount = 0;
    for (let i = 0; i < 12; i++) {
      await cards.nth(i).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const examples = dialog.getByRole("button", { name: locale === "he" ? /^דוגמה / : /^Example / });
      const count = await examples.count();
      imageCount += count;
      if (count === 0) await expect(dialog.getByText(locale === "he" ? "תמונות נוספות בקרוב" : "More images coming soon")).toBeVisible();
      for (let j = 0; j < count; j++) {
        await examples.nth(j).click();
        await expect.poll(() => dialog.locator("img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 20_000 }).toBe(true);
      }
      if (i === 11) {
        const result = await new AxeBuilder({ page }).analyze();
        expect(result.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
      }
      await dialog.getByRole("button", { name: locale === "he" ? "סגירת פירוט המוצר" : "Close product details" }).click();
    }
    expect(imageCount).toBe(30);
    await page.setViewportSize({ width: 390, height: 844 });
    await cards.nth(11).click();
    const features = page.getByRole("dialog").getByRole("heading", { name: locale === "he" ? "מאפיינים אפשריים" : "Available features" });
    await features.scrollIntoViewIfNeeded();
    await expect(features).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
