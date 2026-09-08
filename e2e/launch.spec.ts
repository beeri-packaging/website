import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("video-only presentation counts 30 to 1 with real audio and canvas confetti", async ({ page }) => {
  test.setTimeout(80000);
  await page.addInitScript(() => {
    const state = { starts: 0, duration: 0, offset: 0, closed: false, elapsed: () => 0 };
    Object.assign(window, { launchAudioTest: state });
    const create = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function () {
      const source = create.call(this);
      const start = source.start.bind(source);
      source.start = (when?: number, offset?: number) => { state.starts++; state.duration = source.buffer?.duration ?? 0; state.offset = offset ?? 0; const started = this.currentTime - state.offset; state.elapsed = () => this.currentTime - started; start(when, offset); };
      return source;
    };
    const close = AudioContext.prototype.close;
    AudioContext.prototype.close = function () { state.closed = true; return close.call(this); };
  });
  await page.goto("/he?launch=presentation");
  const start = page.getByRole("button", { name: "מתחילים בשיגור" });
  await expect(start).toBeFocused();
  await expect(page.locator(".launch-video")).toBeVisible();
  await expect.poll(() => page.locator(".launch-video").evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  await expect(page.locator(".hero-video video")).toHaveCount(0);
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "ישר לאתר" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(start).toBeFocused();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  await start.click();
  await expect(page.getByRole("button", { name: "השתקת צליל" })).toBeVisible();
  for (const count of Array.from({ length: 30 }, (_, index) => 30 - index)) {
    await expect(page.locator(".launch-number")).toHaveText(String(count));
    if (count === 1) {
      await expect(page.getByRole("dialog")).toHaveAttribute("data-breath", "true");
      await expect(page.locator(".launch-footage")).toHaveCSS("opacity", "0");
    }
    if (count === 15) {
      await page.getByRole("button", { name: "השתקת צליל" }).click();
      await page.getByRole("button", { name: "הפעלת צליל" }).click();
    }
  }
  await expect(page.locator("#launch-reveal")).toHaveAttribute("data-phase", "opening");
  const revealedAt = Date.now();
  const revealTime = await page.evaluate(() => (window as unknown as { launchAudioTest: { elapsed: () => number } }).launchAudioTest.elapsed());
  expect(revealTime).toBeGreaterThanOrEqual(30);
  expect(revealTime).toBeLessThan(30.5);
  await expect(page.locator("html")).not.toHaveAttribute("data-launch");
  await expect(page.locator("html")).toHaveAttribute("data-launch-reveal", "entering");
  const initialScale = await page.locator("#launch-website").evaluate(element => element.getBoundingClientRect().width / window.innerWidth);
  expect(initialScale).toBeLessThan(.96);
  await expect(page.locator(".hero-video video")).toHaveCount(0);
  await expect.poll(() => page.locator(".launch-confetti").evaluate((canvas: HTMLCanvasElement) => {
    if (!canvas.width || !canvas.height) return false;
    return canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data.some((v, i) => i % 4 === 3 && v > 0);
  })).toBe(true);
  await expect(page.locator("html")).not.toHaveAttribute("data-launch-reveal", { timeout: 4000 });
  await expect(page.locator("#launch-website")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-video video")).toBeVisible();
  // The website is already usable while the music continues through its outro.
  await expect.poll(() => page.evaluate(() => (window as unknown as { launchAudioTest: { elapsed: () => number } }).launchAudioTest.elapsed()), { timeout: 8000 }).toBeGreaterThan(36);
  expect(await page.evaluate(() => (window as unknown as { launchAudioTest: { closed: boolean } }).launchAudioTest.closed)).toBe(false);

  await expect(page.locator(".launch-fireworks canvas")).toBeVisible();
  // Fireworks and music continue together; the overlay allows normal scrolling.
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(Math.max(0, 30500 - (Date.now() - revealedAt)));
  await expect(page.locator(".launch-fireworks canvas")).toBeVisible();
  await expect.poll(() => page.locator(".launch-fireworks canvas").evaluate((canvas: HTMLCanvasElement) => canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data.some((v, i) => i % 4 === 3 && v > 0))).toBe(true);
  expect(await page.evaluate(() => (window as unknown as { launchAudioTest: { closed: boolean } }).launchAudioTest.closed)).toBe(false);
  await expect(page.locator("#launch-reveal")).not.toBeVisible({ timeout: 6000 });
  await expect(page.getByRole("button", { name: "סיום החגיגה" })).toHaveCount(0);
  const audio = await page.evaluate(() => (window as unknown as { launchAudioTest: { starts: number; duration: number; offset: number; closed: boolean } }).launchAudioTest);
  expect(audio.starts).toBe(1); // The actual decoded music plays once, without restarting for ticks.
  expect(audio.duration).toBeCloseTo(62, 0);
  expect(audio.offset).toBeLessThan(3);
  expect(audio.closed).toBe(true);
  await expect(page.locator("#main")).toBeFocused();
  await expect(page.locator("html")).not.toHaveAttribute("data-launch");
  await expect(page.locator(".hero-video video")).toBeVisible();
  await page.reload();
  await expect(start).toBeVisible();
});

test("automatic preview remains skippable and does not require audio permission", async ({ page }) => {
  await page.goto("/en?launch=preview");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-launch");
});

test("mobile reduced motion preserves the thirty-count without moving video or confetti", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  test.setTimeout(45000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en?launch=presentation");
  await expect(page.getByRole("dialog")).toHaveAttribute("data-reduced", "true");
  await expect(page.locator(".launch-video, .hero-video video, .launch-confetti, .launch-fireworks")).toHaveCount(0);
  await page.getByRole("button", { name: "Launch the website" }).click();
  await expect(page.locator(".launch-number")).toHaveText("30");
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 35000 });
  await expect(page.locator("html")).not.toHaveAttribute("data-launch-reveal");
  await expect(page.locator("#launch-website")).toHaveCSS("transform", "none");
});

test("mobile plays the standalone hero clip and offers sound and pause controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en?launch=presentation");
  const video = page.locator(".launch-video");
  await expect(video).toBeVisible();
  await page.getByRole("button", { name: "Pause video" }).click();
  await expect.poll(() => video.evaluate((clip: HTMLVideoElement) => clip.paused)).toBe(true);
  await page.getByRole("button", { name: "Play video" }).click();
  await expect.poll(() => video.evaluate((clip: HTMLVideoElement) => clip.paused)).toBe(false);
  await page.getByRole("button", { name: "Launch the website" }).click();
  await expect(page.getByRole("button", { name: "Mute sound" })).toBeVisible();
  await page.getByRole("button", { name: "Mute sound" }).click();
  await expect(page.getByRole("button", { name: "Enable sound" })).toBeVisible();
  await page.getByRole("button", { name: "Skip to website" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});


test("music download failure still reveals the site and remains skippable", async ({ page }) => {
  await page.route("**/api/launch-music*", route => route.abort());
  await page.goto("/en?launch=presentation");
  await page.clock.install();
  await page.getByRole("button", { name: "Launch the website" }).click();
  await expect(page.locator(".launch-number")).toHaveText("30");
  await page.clock.fastForward(31000);
  await expect(page.locator("html")).not.toHaveAttribute("data-launch");
  await expect(page.locator("#main")).toBeVisible();
});


test("mobile reveal frames the site and restores normal geometry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en?launch=preview");
  await page.clock.install();
  await page.clock.fastForward(28000);
  await expect(page.getByRole("dialog")).toHaveAttribute("data-breath", "true");
  await page.clock.fastForward(2100);
  await expect(page.locator("html")).toHaveAttribute("data-launch-reveal", "entering");
  const scale = await page.locator("#launch-website").evaluate(element => element.getBoundingClientRect().width / window.innerWidth);
  expect(scale).toBeGreaterThan(.87);
  expect(scale).toBeLessThan(.98);
  await page.clock.fastForward(2500);
  await expect(page.locator("html")).not.toHaveAttribute("data-launch-reveal");
  await expect(page.locator("#launch-website")).toHaveCSS("transform", "none");
  expect(await page.locator("#launch-website").evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(844);
});


test("celebration can be ended early without blocking the site", async ({ page }) => {
  await page.goto("/en?launch=preview");
  await page.clock.install();
  await page.clock.fastForward(31000);
  await expect(page.locator(".launch-fireworks canvas")).toBeVisible();
  await page.getByRole("button", { name: "End celebration" }).click();
  await expect(page.locator("#launch-reveal, .launch-fireworks canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-launch-reveal");
  await expect(page.locator("#main")).toBeFocused();
});
