import { test, expect } from "@playwright/test";

test("home page renders with the brand title and a heading", async ({ page }) => {
  await page.goto("/he");
  await expect(page).toHaveTitle(/בארי אריזות/);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("hero video is desktop-only and leaves the still image as mobile fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/he");
  await expect(page.locator("section").first().locator("img").first()).toBeVisible();
  await expect(page.locator(".hero-video video source")).toHaveCount(0);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/he");
  await expect(page.locator("section").first().locator("img").first()).toBeVisible();

  const desktopVideoSource = page.locator(".hero-video video source");
  if ((await desktopVideoSource.count()) === 0) {
    test.info().annotations.push({
      type: "cms",
      description: "No hero video was available for this run; fallback image verified.",
    });
    return;
  }

  await expect(desktopVideoSource.first()).toHaveAttribute("src", /\.mp4/);
});
