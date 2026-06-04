import { test, expect } from "@playwright/test";

test("home page renders with the brand title and a heading", async ({ page }) => {
  await page.goto("/he");
  await expect(page).toHaveTitle(/בארי אריזות/);
  await expect(page.locator("h1").first()).toBeVisible();
});
