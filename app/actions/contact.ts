"use server";

import { sendEmail } from "@/lib/email";
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

  const to = process.env.CONTACT_TO_EMAIL || "orders@beeripacks.co.il";
  const from = process.env.CONTACT_FROM_EMAIL || "";
  if (!process.env.RESEND_API_KEY || !from) {
    console.warn(
      "[contact] email not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL)",
    );
    return { ok: false, error: "not_configured" };
  }

  const reasonLabel = REASON_LABELS[input.reason] ?? input.reason;
  const rows: Array<[string, string]> = [
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
        `<tr><td style="padding:4px 12px;color:#4d4632"><b>${k}</b></td><td style="padding:4px 12px">${v.replace(
          /</g,
          "&lt;",
        )}</td></tr>`,
    )
    .join("")}</table>`;

  try {
    const sent = await sendEmail({
      to,
      from,
      subject: `פנייה חדשה מהאתר — ${reasonLabel} — ${input.fullName}`,
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
