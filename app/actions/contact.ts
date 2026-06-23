"use server";

import { sendEmail } from "@/lib/email";
import { COMPANY } from "@/app/content/company";
import {
  validateContactInquiry,
  type ContactInquiryInput,
  type ContactInquiryResult,
} from "@/lib/contact-inquiry";

const REASON_LABELS: Record<string, string> = {
  quote: "הצעת מחיר",
  meeting: 'תיאום פגישה עם מת"ל',
  other: "אחר",
};

/** Escape all five HTML-significant chars before interpolating user input. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse CR/LF so user input can't inject extra email headers (subject). */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function submitContactInquiry(
  input: ContactInquiryInput & { company_url?: string },
): Promise<ContactInquiryResult> {
  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (input.company_url && input.company_url.trim().length > 0) {
    return { ok: true };
  }

  const fieldErrors = validateContactInquiry(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "validation", fieldErrors };
  }

  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  const from = process.env.CONTACT_FROM_EMAIL || "";
  if (!process.env.RESEND_API_KEY || !from) {
    // Loud (console.error) so log/error tracking flags it — a misconfigured
    // deploy silently drops every lead and must never look like a transient blip.
    console.error(
      "[contact] MISCONFIGURED: inquiry NOT sent — set RESEND_API_KEY and CONTACT_FROM_EMAIL",
    );
    return { ok: false, error: "not_configured" };
  }

  const reasonLabel = REASON_LABELS[input.reason] ?? input.reason;
  const rows: Array<[string, string]> = [
    ["מקור", "פנייה מאתר בארי אריזות (beeripacks.co.il)"],
    ["שם מלא", input.fullName],
    ["טלפון", input.phone],
    ["אימייל", input.email || "—"],
    ["חברה", input.company || "—"],
    ["סיבת הפנייה", reasonLabel],
    ["פרטים נוספים", input.details || "—"],
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
      subject: singleLine(`פנייה חדשה מהאתר — ${reasonLabel} — ${input.fullName}`),
      html,
      text,
      replyTo: input.email.trim() || undefined,
    });
    if (!sent) return { ok: false, error: "not_configured" };
    return { ok: true };
  } catch (err) {
    console.error("[contact] send failed", err);
    return { ok: false, error: "send_failed" };
  }
}
