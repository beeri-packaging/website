import { test, expect } from "@playwright/test";
import { contactCopy } from "../app/content/contact";

for (const locale of ["he", "en"] as const) {
  for (const entry of ["header", "floating"] as const) {
    test(`${locale}: ${entry} contact form preserves all reason choices and footer destination`, async ({ page }) => {
      // This regression must never target a real deployment or send a real inquiry.
      const baseURL = test.info().project.use.baseURL;
      if (!baseURL || !["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname)) {
        throw new Error("Contact regression is restricted to local servers");
      }
      await page.goto(`/${locale}`);
      await expect(page.locator("footer").getByRole("link", { name: "office@beeripacks.co.il" }))
        .toHaveAttribute("href", "mailto:office@beeripacks.co.il");
      const trigger = entry === "header"
        ? page.locator("header button.hidden.md\\:inline-flex")
        : page.locator("button.fixed");
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      for (const option of contactCopy[locale].form.reason.options.filter(o => o.value)) {
        await dialog.getByRole("combobox").click();
        await dialog.getByRole("option", { name: option.label, exact: true }).click();
        await expect(dialog.locator('input[name="reason"]')).toHaveValue(option.value);
      }
      await dialog.locator('input[name="fullName"]').fill("Local Regression");
      await dialog.locator('input[name="phone"]').fill("0501234567");
      await dialog.locator('input[name="email"]').fill("test@example.com");
      // The action exits at the honeypot before consulting any email service.
      await dialog.locator('input[name="company_url"]').fill("regression-no-mail", { force: true });
      await dialog.locator('button[type="submit"]').click();
      await expect(dialog.getByRole("heading", { name: contactCopy[locale].success.title })).toBeVisible();
    });
  }
}
