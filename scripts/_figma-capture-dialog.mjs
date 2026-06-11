// Capture the contact dialog (he+en) for Figma reference.
import { chromium } from "@playwright/test";

const BASE = "https://beeri-arizot-1bxc.vercel.app";
const OUT = "/tmp/beeri-figma";

const browser = await chromium.launch();
for (const locale of ["he", "en"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/${locale}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(2000);
  // header CTA opens the dialog
  await page.locator("header button").filter({ hasText: locale === "he" ? "ליצירת קשר" : "Contact" }).first().click();
  await page.waitForTimeout(900);
  const dialog = page.locator('[role="dialog"]').first();
  await dialog.screenshot({ path: `${OUT}/${locale}-component-dialog.png` }).catch(async (e) => {
    console.log(locale, "dialog locator failed:", String(e).slice(0, 120));
    await page.screenshot({ path: `${OUT}/${locale}-component-dialog-full.png` });
  });
  const txt = await dialog.innerText().catch(() => "");
  console.log(`=== ${locale} dialog text ===\n${txt}`);
  await page.close();
}
await browser.close();
