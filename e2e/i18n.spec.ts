import { test, expect } from "@playwright/test";

test("/ redirects to the default locale /he", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/he$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("/en renders English LTR", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("language switch from /he navigates to /en", async ({ page }) => {
  // The language switcher (LangPill) lives inside the mobile drawer, whose
  // trigger is hidden above the lg breakpoint. Use a mobile viewport so the
  // menu button is visible, open the drawer, then click the EN link — it
  // points at the same path under /en.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/he");
  await page.locator('button[aria-controls="mobile-drawer"]').click();
  await page.locator('#mobile-drawer a[href="/en"]').first().click();
  await expect(page).toHaveURL(/\/en$/);
});
