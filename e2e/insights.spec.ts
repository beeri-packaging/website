import { test, expect } from "@playwright/test";

// Headings track the client rename in PRO-178: the index is titled
// "בארי מספרת" / "Beeri stories" (the nav label is "בלוג" / "Blog").
for (const { locale, heading, roles } of [
  { locale: "he", heading: "בארי מספרת", roles: "משרות פתוחות" },
  { locale: "en", heading: "Beeri stories", roles: "Open roles" },
]) {
  test(`/${locale}/blog renders the blog index`, async ({ page }) => {
    await page.goto(`/${locale}/blog`);
    // Hero title
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    // Bento cards link through to individual articles
    const cards = page.locator(`a[href*="/${locale}/blog/"]`);
    await expect(cards.first()).toBeVisible();
    // Open-roles section folded into the bottom of the page. `exact` matters:
    // the empty-state heading contains the section heading as a substring.
    await expect(page.getByRole("heading", { name: roles, exact: true })).toBeVisible();
    // Current content has open roles, also exercised by job-upload.spec.ts.
    // Verify the role content and application entry point, not a stale empty state.
    const firstRole = page.locator("#careers-roles-list article").first();
    await expect(firstRole.getByRole("heading", { level: 3 })).toBeVisible();
    await expect(firstRole.getByRole("button")).toBeVisible();
  });
}
