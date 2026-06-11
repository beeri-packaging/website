// Capture live-site references for Figma import: screenshots + copy + image inventory.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://beeri-arizot-1bxc.vercel.app";
const OUT = "/tmp/beeri-figma";
const ROUTES = [
  ["home", ""],
  ["about", "/about"],
  ["catalog", "/catalog"],
  ["finishing", "/finishing"],
  ["blog", "/blog"],
  ["post", "/blog/anatomy-of-a-wine-carton"],
  ["privacy", "/privacy"],
  ["terms", "/terms"],
];
const LOCALES = ["he", "en"];

const browser = await chromium.launch();
const summary = {};

for (const locale of LOCALES) {
  for (const [name, path] of ROUTES) {
    const url = `${BASE}/${locale}${path}`;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      // kill animations/transitions so reveals are settled
      await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}` });
      // scroll through page to trigger lazy loads / reveal-on-scroll
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 600));
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${locale}-${name}.png`, fullPage: true });

      const data = await page.evaluate(() => {
        const txt = (el) => (el ? el.innerText : "");
        const main = document.querySelector("main");
        const sections = main
          ? [...main.children].map((el, i) => ({
              i,
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              cls: (el.className || "").toString().slice(0, 120),
              h: el.getBoundingClientRect().height,
              text: el.innerText ? el.innerText.slice(0, 3000) : "",
            }))
          : [];
        const imgs = [...document.querySelectorAll("img")].map((im) => {
          const r = im.getBoundingClientRect();
          return {
            alt: im.alt || "",
            src: im.currentSrc || im.src,
            w: Math.round(r.width),
            h: Math.round(r.height),
            top: Math.round(r.top + window.scrollY),
            left: Math.round(r.left),
          };
        });
        return {
          title: document.title,
          header: txt(document.querySelector("header")),
          footer: txt(document.querySelector("footer")),
          sections,
          imgs,
          bodyHeight: document.body.scrollHeight,
        };
      });
      fs.writeFileSync(`${OUT}/${locale}-${name}.json`, JSON.stringify(data, null, 1));
      summary[`${locale}-${name}`] = { ok: true, h: data.bodyHeight, sections: data.sections.length, imgs: data.imgs.length };
    } catch (e) {
      summary[`${locale}-${name}`] = { ok: false, err: String(e).slice(0, 200) };
    }
    await page.close();
  }
}

// header + footer element shots (he + en, from home)
for (const locale of LOCALES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle" });
  const header = page.locator("header").first();
  await header.screenshot({ path: `${OUT}/${locale}-component-header.png` }).catch(() => {});
  const footer = page.locator("footer").first();
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await footer.screenshot({ path: `${OUT}/${locale}-component-footer.png` }).catch(() => {});
  await page.close();
}

await browser.close();
console.log(JSON.stringify(summary, null, 1));
