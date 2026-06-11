// Capture the excellence / faq / cta sections of the live HE home page individually.
import { chromium } from "@playwright/test";

const OUT = "/tmp/beeri-figma";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("https://beeri-arizot-1bxc.vercel.app/he", { waitUntil: "networkidle", timeout: 45000 });
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}` });

// slow scroll through whole page to trigger reveals
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y <= h; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); }
});
await page.waitForTimeout(1000);

for (const id of ["excellence", "faq", "cta"]) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await el.screenshot({ path: `${OUT}/home-${id}.png` });
  console.log(id, "ok");
}
await browser.close();
