// Rasterize client-logo SVGs to 2x PNGs for Figma upload.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SRC = "/Users/ilanchelly/Desktop/beeri-arizot/public/images/clients";
const OUT = "/tmp/beeri-figma";
const files = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 600 }, deviceScaleFactor: 2 });
for (const name of files) {
  const svg = fs.readFileSync(path.join(SRC, `${name}.svg`), "utf8");
  await page.setContent(`<body style="margin:0;background:transparent"><div id="w" style="display:inline-block;width:430px">${svg.replace("<svg ", '<svg style="width:100%;height:auto;display:block" ')}</div></body>`);
  await page.waitForTimeout(150);
  const el = page.locator("#w svg");
  await el.screenshot({ path: `${OUT}/logo-${name}.png`, omitBackground: true });
  console.log(name, "done");
}
await browser.close();
