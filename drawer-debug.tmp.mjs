import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("PAGE ERROR:", m.text().slice(0, 300));
});
page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 300)));

await page.goto("http://localhost:3000/he", { waitUntil: "networkidle" });
await page.locator('button[aria-controls="mobile-drawer"]').click();
await page.waitForTimeout(600);

const info = await page.evaluate(() => {
  const drawer = document.getElementById("mobile-drawer");
  const link = drawer?.querySelector('a[href="/en"]');
  const lr = link?.getBoundingClientRect();
  const cx = lr ? lr.left + lr.width / 2 : 0;
  const cy = lr ? lr.top + lr.height / 2 : 0;
  const hit = lr ? document.elementsFromPoint(cx, cy).map((el) => (el.id || el.className?.toString() || el.tagName).slice(0, 60)).slice(0, 6) : [];
  const dz = drawer ? getComputedStyle(drawer).zIndex : null;
  const dpos = drawer ? getComputedStyle(drawer).position : null;
  return { linkRect: lr ? { x: Math.round(cx), y: Math.round(cy), w: Math.round(lr.width), h: Math.round(lr.height) } : null, hit, drawerZ: dz, drawerPos: dpos };
});
console.log(JSON.stringify(info, null, 1));

await page.locator('#mobile-drawer a[href="/en"]').first().click();
await page.waitForTimeout(1500);
console.log("URL after click:", page.url());
await browser.close();
