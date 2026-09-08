import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["he", "en"] as const) {
  test(`/${locale}/privacy publishes the revised policy and approved retention`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/privacy`);
    const policy = page.locator("main article");
    await expect(policy.getByRole("heading", { level: 1 })).toHaveText(locale === "he" ? "מדיניות פרטיות" : "Privacy Policy");
    await expect(policy).toContainText(locale === "he" ? "ספטמבר 2026" : "September 2026");
    const retention = policy.locator("section").filter({ has: page.getByRole("heading", { name: locale === "he" ? "שמירת המידע" : "Data retention" }) });
    await retention.scrollIntoViewIfNeeded();
    await expect(retention).toContainText(locale === "he" ? "פניות וקורות חיים נשמרים למשך עד שישה חודשים" : "Inquiries and CVs are retained for up to six months");
    await expect(retention).toContainText(locale === "he" ? "למשרות עתידיות" : "future positions");
    for (const provider of ["Vercel", "Resend", "Microsoft 365", "Sanity", "Google Maps"]) {
      await expect(policy).toContainText(provider);
    }
    await expect(policy).toContainText("jobs@beeripacks.co.il");
    await expect(policy).toContainText(locale === "he" ? "במסגרת קבוצת דפוס בארי" : "within the Beeri Print Group");
    await expect(policy).not.toContainText(/\[|יש לאשר|יש לקבוע|להשלמה/);
    const contact = policy.getByRole("button", { name: "office@beeripacks.co.il" });
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const a11y = await new AxeBuilder({ page }).include("main article").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(a11y.violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  });
}
