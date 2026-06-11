// Capture the live hero background (text hidden) for the Figma frame.
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("https://beeri-arizot-1bxc.vercel.app/he", { waitUntil: "networkidle", timeout: 45000 });
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const hero = document.querySelector("main > section");
  // hide text-bearing elements + sticky header/contact
  hero.querySelectorAll("h1,h2,p,a,button,span").forEach(el => { el.style.visibility = "hidden"; });
  document.querySelector("header").style.visibility = "hidden";
  document.querySelectorAll("[class*='sticky'],[class*='fixed']").forEach(el => { el.style.visibility = "hidden"; });
  const r = hero.getBoundingClientRect();
  return { w: r.width, h: r.height, top: r.top };
});
// fixed-position elements: hide any remaining floating buttons
await page.addStyleTag({ content: `header, [data-sticky], .fixed { visibility: hidden !important }` });
await page.evaluate(() => {
  document.querySelectorAll("body > div, body > a").forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") el.style.visibility = "hidden";
  });
});
const hero = page.locator("main > section").first();
await hero.screenshot({ path: "/tmp/beeri-figma/img-hero-bg.png" });
console.log(JSON.stringify(info));
await browser.close();
