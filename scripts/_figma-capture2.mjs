// Retry missing EN captures with lenient waits.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const BASE = "https://beeri-arizot-1bxc.vercel.app";
const OUT = "/tmp/beeri-figma";
const TODO = [
  ["en", "finishing", "/finishing"],
  ["en", "blog", "/blog"],
  ["en", "post", "/blog/anatomy-of-a-wine-carton"],
  ["en", "privacy", "/privacy"],
  ["en", "terms", "/terms"],
];

const browser = await chromium.launch();
const summary = {};

for (const [locale, name, path] of TODO) {
  const url = `${BASE}/${locale}${path}`;
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}` });
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 600));
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/${locale}-${name}.png`, fullPage: true });
    const data = await page.evaluate(() => {
      const txt = (el) => (el ? el.innerText : "");
      const main = document.querySelector("main");
      const sections = main ? [...main.children].map((el, i) => ({ i, tag: el.tagName.toLowerCase(), id: el.id || null, h: el.getBoundingClientRect().height, text: el.innerText ? el.innerText.slice(0, 3000) : "" })) : [];
      const imgs = [...document.querySelectorAll("img")].map((im) => { const r = im.getBoundingClientRect(); return { alt: im.alt || "", src: im.currentSrc || im.src, w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + window.scrollY), left: Math.round(r.left) }; });
      return { title: document.title, header: txt(document.querySelector("header")), footer: txt(document.querySelector("footer")), sections, imgs, bodyHeight: document.body.scrollHeight };
    });
    fs.writeFileSync(`${OUT}/${locale}-${name}.json`, JSON.stringify(data, null, 1));
    summary[`${locale}-${name}`] = { ok: true, h: data.bodyHeight, sections: data.sections.length, imgs: data.imgs.length };
  } catch (e) {
    summary[`${locale}-${name}`] = { ok: false, err: String(e).slice(0, 150) };
  }
  await page.close();
}

// EN header + footer
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(2500);
await page.locator("header").first().screenshot({ path: `${OUT}/en-component-header.png` }).catch((e) => { summary["en-header"] = String(e).slice(0, 100); });
const footer = page.locator("footer").first();
await footer.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await footer.screenshot({ path: `${OUT}/en-component-footer.png` }).catch((e) => { summary["en-footer"] = String(e).slice(0, 100); });
await page.close();
await browser.close();
console.log(JSON.stringify(summary, null, 1));
