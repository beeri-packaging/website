import { test, expect } from "@playwright/test";

test.describe("anchor system", () => {
  test("journey cards carry the rewired hrefs (he)", async ({ page }) => {
    await page.goto("/he");
    await expect(page.locator('#journey a[href$="/about#timeline"]')).toHaveCount(3);
    await expect(page.locator('#journey a[href="#excellence"]')).toHaveCount(3);
  });

  test("section anchors exist on every page (he)", async ({ page }) => {
    await page.goto("/he/about");
    for (const id of ["heritage", "timeline", "numbers", "clients"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.goto("/he/blog");
    for (const id of ["posts", "roles", "newsletter"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await page.goto("/he/finishing");
    await expect(page.locator("#capabilities")).toHaveCount(1);
    await page.goto("/he/catalog");
    await expect(page.locator("#catalog")).toHaveCount(1);
  });

  test("yellow journey card navigates to the About timeline (en)", async ({ page }) => {
    await page.goto("/en");
    const card = page.locator('#journey a[href$="/about#timeline"]').last();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page).toHaveURL(/\/en\/about#timeline$/);
    await expect(page.locator("#timeline")).toBeVisible();
  });
});
