"use server";

import { sendEmail, type EmailAttachment } from "@/lib/email";
import { COMPANY } from "@/app/content/company";

export type JobApplicationResult =
  | { ok: true }
  | { ok: false; error: "validation" | "not_configured" | "file_too_large" | "send_failed" };

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

/** Escape all five HTML-significant chars before interpolating user input. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse CR/LF so user input can't inject extra email headers. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Deliver a careers application (with the optional CV attached) to the company
 * inbox via Resend. Mirrors submitContactInquiry: honeypot, server-side
 * re-validation, HTML escaping, and a loud console.error on misconfiguration.
 */
export async function submitJobApplication(
  formData: FormData,
): Promise<JobApplicationResult> {
  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (String(formData.get("company_url") ?? "").trim().length > 0) {
    return { ok: true };
  }

  const name = singleLine(String(formData.get("name") ?? ""));
  const phone = singleLine(String(formData.get("phone") ?? ""));
  const email = singleLine(String(formData.get("email") ?? ""));
  const message = String(formData.get("message") ?? "").trim();
  const roleCode = singleLine(String(formData.get("roleCode") ?? ""));
  const roleTitle = singleLine(String(formData.get("roleTitle") ?? ""));

  const phoneOk = phone.replace(/\D/g, "").length >= 7;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !phoneOk || !emailOk) return { ok: false, error: "validation" };

  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  const from = process.env.CONTACT_FROM_EMAIL || "";
  if (!process.env.RESEND_API_KEY || !from) {
    console.error(
      "[job-application] MISCONFIGURED: application NOT sent — set RESEND_API_KEY and CONTACT_FROM_EMAIL",
    );
    return { ok: false, error: "not_configured" };
  }

  // Optional CV attachment.
  let attachments: EmailAttachment[] | undefined;
  const cv = formData.get("cv");
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX_CV_BYTES) return { ok: false, error: "file_too_large" };
    const content = Buffer.from(await cv.arrayBuffer());
    attachments = [{ filename: cv.name || "cv", content }];
  }

  const rows: Array<[string, string]> = [
    ["משרה", roleTitle || "—"],
    ["קוד משרה", roleCode || "—"],
    ["שם מלא", name],
    ["טלפון", phone],
    ["אימייל", email],
    ["הודעה", message || "—"],
    ['קו"ח', attachments ? `מצורף (${attachments[0].filename})` : "לא צורף"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px;color:#4d4632"><b>${escapeHtml(
          k,
        )}</b></td><td style="padding:4px 12px">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const sent = await sendEmail({
      to,
      from,
      subject: singleLine(`מועמדות חדשה — ${roleTitle || "פנייה כללית"} — ${name}`),
      html,
      text,
      replyTo: email || undefined,
      attachments,
    });
    if (!sent) return { ok: false, error: "not_configured" };
    return { ok: true };
  } catch (err) {
    console.error("[job-application] send failed", err);
    return { ok: false, error: "send_failed" };
  }
}
