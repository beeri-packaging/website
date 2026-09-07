import { test, expect } from "@playwright/test";

for (const locale of ["he", "en"] as const) {
  test(`client logos loop in one monochrome row and support pausing (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/about#clients`);
    const section = page.locator("#clients");
    const region = section.getByRole("region");
    await region.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const list = section.getByRole("list");
    await expect(list.getByRole("listitem")).toHaveCount(19);
    await expect(list.getByRole("img").first()).toHaveAttribute("alt", /מורוקנאויל|Moroccanoil/);
    await expect.poll(() => section.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    const geometry = await region.evaluate((viewport) => {
      const track = viewport.firstElementChild!;
      const groups = [...track.children];
      return { track: track.getBoundingClientRect().width, widths: groups.map((group) => group.getBoundingClientRect().width), rows: new Set([...groups[0].children].map((item) => Math.round(item.getBoundingClientRect().top))).size };
    });
    expect(geometry.rows).toBe(1);
    expect(geometry.widths[0]).toBeCloseTo(geometry.widths[1], 1);
    expect(geometry.track).toBeCloseTo(geometry.widths[0] * 2, 1);
    await expect(list.locator("img").first()).toHaveCSS("filter", "grayscale(1)");
    const track = region.locator(":scope > div");
    const initial = await track.evaluate((element) => getComputedStyle(element).transform);
    await expect.poll(() => track.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initial);
    await expect(section.getByRole("button")).toHaveCount(0);
    await region.focus();
    await expect(track).toHaveCSS("animation-play-state", "paused");
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(track).toHaveCSS("animation-name", "none");
    await expect(region).toHaveCSS("overflow-x", "auto");
    await expect(region.locator('[aria-hidden="true"]')).toBeHidden();
    expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  });
}
