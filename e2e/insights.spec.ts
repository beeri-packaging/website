import { test, expect } from "@playwright/test";

// Headings track the client rename in PRO-178: the index is titled
// "בארי מספרת" / "Beeri stories" (the nav label is "בלוג" / "Blog").
for (const { locale, heading, roles, noOpenRoles } of [
  { locale: "he", heading: "בארי מספרת", roles: "משרות פתוחות", noOpenRoles: "אין כרגע משרות פתוחות" },
  { locale: "en", heading: "Beeri stories", roles: "Open roles", noOpenRoles: "No open roles right now" },
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
    // No roles are open (PRO-201) — the empty state stands in for the list and
    // the department filters are hidden until new roles land.
    await expect(page.getByRole("heading", { name: noOpenRoles })).toBeVisible();
    await expect(
      page.locator('button[aria-controls="careers-roles-list"]'),
    ).toHaveCount(0);
  });
}
