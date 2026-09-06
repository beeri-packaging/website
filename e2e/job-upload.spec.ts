import { test, expect } from "@playwright/test";
import { MAX_CV_BYTES } from "../lib/cv-upload";

for (const locale of ["he", "en"] as const) {
  test(`/${locale}: a 10 MB selection does not put the file in the Server Action request`, async ({ page }) => {
    await page.goto(`/${locale}/blog`);
    await page.locator("#roles article button").first().click();
    const dialog = page.getByRole("dialog");
    await dialog.locator('input[name="name"]').fill("Automated Upload Check");
    await dialog.locator('input[name="phone"]').fill("0501234567");
    await dialog.locator('input[name="email"]').fill("upload-check@example.com");
    // This honeypot test verifies form submission without sending email.
    // Direct private upload and attachment bytes have separate integration/unit checks.
    await dialog.locator('input[name="company_url"]').fill("automated-check", { force: true });
    await dialog.locator('input[name="cv"]').setInputFiles({
      name: "too-large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(MAX_CV_BYTES + 1, 65),
    });
    await expect(dialog.getByRole("alert")).toContainText("10MB");
    await dialog.locator('input[name="cv"]').setInputFiles({
      name: "synthetic-cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.alloc(MAX_CV_BYTES, 65),
    });
    const response = page.waitForResponse((res) => res.request().method() === "POST" && res.url().includes(`/${locale}/blog`));
    await dialog.locator('button[type="submit"]').click();
    expect((await response).status()).toBe(200);
    await expect(dialog.getByRole("heading", {
      name: locale === "he" ? "המועמדות נשלחה" : "Application sent",
    })).toBeVisible();
  });
}
