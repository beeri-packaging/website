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
    // Careers content is CMS-driven: verify either the empty state or the
    // department filters, depending on whether roles are currently published.
    const emptyState = page.getByRole("heading", { name: noOpenRoles });
    const departmentFilters = page.locator(
      'button[aria-controls="careers-roles-list"]',
    );
    await expect
      .poll(async () => (await emptyState.count()) + (await departmentFilters.count()))
      .toBeGreaterThan(0);

    if ((await emptyState.count()) > 0) {
      await expect(emptyState).toBeVisible();
      await expect(departmentFilters).toHaveCount(0);
    } else {
      await expect(departmentFilters.first()).toBeVisible();
    }
  });
}
