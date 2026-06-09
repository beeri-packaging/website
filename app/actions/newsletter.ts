"use server";

import { sendEmail } from "@/lib/email";
import { COMPANY } from "@/app/content/company";

export type NewsletterResult = { ok: boolean };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Capture a careers-newsletter signup by emailing it to the company inbox via
 * Resend (no ESP/list is wired yet, so this ensures signups are never lost).
 * Honeypot + server-side email validation, mirroring the other form actions.
 */
export async function submitNewsletterSignup(
  formData: FormData,
): Promise<NewsletterResult> {
  if (String(formData.get("company_url") ?? "").trim().length > 0) {
    return { ok: true }; // honeypot
  }

  const email = singleLine(String(formData.get("email") ?? ""));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false };

  const source = singleLine(String(formData.get("source") ?? "careers"));
  const isInsights = source === "insights";
  const subjectHe = isInsights ? "הרשמה לעדכוני תובנות" : "הרשמה לעדכוני קריירה";
  const bodyHe = isInsights ? "נרשם/ה חדש/ה לעדכוני תובנות" : "נרשם/ה חדש/ה לעדכוני קריירה";

  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  const from = process.env.CONTACT_FROM_EMAIL || "";
  if (!process.env.RESEND_API_KEY || !from) {
    console.error(
      "[newsletter] MISCONFIGURED: signup NOT captured — set RESEND_API_KEY and CONTACT_FROM_EMAIL",
    );
    return { ok: false };
  }

  try {
    const sent = await sendEmail({
      to,
      from,
      subject: singleLine(`${subjectHe} — ${email}`),
      text: `${bodyHe}: ${email}`,
      html: `<p dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">${escapeHtml(bodyHe)}:<br><b>${escapeHtml(email)}</b></p>`,
      replyTo: email,
    });
    return { ok: sent };
  } catch (err) {
    console.error("[newsletter] send failed", err);
    return { ok: false };
  }
}
