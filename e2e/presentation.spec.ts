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
    await expect(page.locator("iframe").first()).not.toHaveAttribute("inert", "");
    await expect(page.locator("iframe").first()).not.toHaveClass(/pointer-events-none/);

    const homePreview = page
      .frames()
      .find((frame) => new URL(frame.url()).pathname === `/${locale}`);
    expect(homePreview).toBeTruthy();
    await page.locator("iframe").first().hover();
    await page.mouse.wheel(0, 700);
    await expect.poll(() => homePreview?.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await homePreview?.evaluate(() => window.scrollTo(0, 0));
    const playLabel = locale === "he" ? "הפעלת סיור מודרך" : "Play guided tour";
    const pauseLabel = locale === "he" ? "השהיית הסיור" : "Pause tour";
    await page.getByRole("button", { name: playLabel }).click();
    await expect(page.locator("[data-tour-popup]")).toBeVisible();
    await expect(page.locator("[data-tour-popup]")).toHaveAttribute("data-tour-playing", "true");

    if (locale === "he") {
      await expect
        .poll(() => homePreview?.evaluate(() => window.scrollY), { timeout: 6_000 })
        .toBeGreaterThan(0);
    }

    await page.getByRole("button", { name: pauseLabel }).click();
    await expect(page.locator("[data-tour-popup]")).toHaveAttribute("data-tour-playing", "false");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button[aria-current="step"]')).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "he" ? "rtl" : "ltr",
    );
  });
}
