// One-off prod verification: review board, roles filter, newsletter send.
import { chromium } from "@playwright/test";

const B = "https://beeri-arizot-1bxc.vercel.app";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. /review board renders + a status click sticks and updates progress.
await page.goto(`${B}/review`, { waitUntil: "networkidle" });
await page.locator("article").first().getByRole("button", { name: "מאושר" }).click();
const counter = await page.locator("header span.tabular-nums").first().textContent();
console.log("review board counter after 1 approval:", counter?.trim());
await page.screenshot({ path: "/tmp/prod-review.png" });

// 2. Roles filter: "ייצור" must include #BR-312.
await page.goto(`${B}/he/blog#roles`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "ייצור", exact: true }).click();
await page.waitForTimeout(400);
const rolesText = await page.locator("#roles").textContent();
console.log("production filter shows BR-312:", rolesText?.includes("#BR-312"));
console.log("production filter shows BR-402:", rolesText?.includes("#BR-402"));

// 3. Newsletter signup end-to-end (sends a real notification email).
await page.locator('#roles ~ *, section').last().scrollIntoViewIfNeeded().catch(() => {});
const email = page.locator('input[type="email"]').last();
await email.scrollIntoViewIfNeeded();
await email.fill("ilanchelly@gmail.com");
await page.getByRole("button", { name: "הרשמה" }).last().click();
await page.waitForTimeout(5000);
const body = await page.locator("body").textContent();
if (body?.includes("נרשמתם")) console.log("newsletter: SUCCESS message shown");
else if (body?.includes("ההרשמה נכשלה")) console.log("newsletter: FAILURE message shown");
else console.log("newsletter: no confirmation detected");
await page.screenshot({ path: "/tmp/prod-newsletter.png" });

await browser.close();
console.log("done");
