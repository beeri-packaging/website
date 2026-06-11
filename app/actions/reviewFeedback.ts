"use server";

import { sendEmail } from "@/lib/email";
import { COMPANY } from "@/app/content/company";

export type SendReviewResult =
  | { ok: true }
  | { ok: false; error: "not_configured" | "send_failed" };

/** Escape all five HTML-significant chars before interpolating into the email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Collapse CR/LF so input can't inject extra email headers (subject). */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Email the client's content-review report to the Beeri inbox.
 *
 * Deliberately permissive: there are no required fields — the client can send
 * at any point, with however much (or little) feedback they've recorded. The
 * board already builds the full report text; this just delivers it. Mirrors the
 * contact-form delivery path ([[lib/email]]) so configuration lives in one place.
 */
export async function sendReviewFeedback(input: {
  report: string;
  summary?: string;
}): Promise<SendReviewResult> {
  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  const from = process.env.CONTACT_FROM_EMAIL || "";

  if (!process.env.RESEND_API_KEY || !from) {
    // Loud so error tracking flags a misconfigured deploy rather than silently
    // dropping the client's feedback.
    console.error(
      "[review] MISCONFIGURED: feedback NOT sent — set RESEND_API_KEY and CONTACT_FROM_EMAIL",
    );
    return { ok: false, error: "not_configured" };
  }

  // Guard against an unbounded payload; the report is plain text already.
  const report = (input.report || "(לא נרשמו הערות.)").slice(0, 100_000);
  const summary = input.summary ? singleLine(input.summary) : "";

  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:14px;color:#1b1c1a">
    <p style="margin:0 0 12px;color:#4d4632">משוב על תוכן האתר התקבל מעמוד הסקירה.</p>
    ${summary ? `<p style="margin:0 0 12px;font-weight:bold">${escapeHtml(summary)}</p>` : ""}
    <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;background:#f5f3f0;border:1px solid #d0c6ab;border-radius:6px;padding:16px;margin:0">${escapeHtml(report)}</pre>
  </div>`;

  try {
    const sent = await sendEmail({
      to,
      from,
      subject: singleLine(
        `משוב על תוכן האתר — בארי אריזות${summary ? ` (${summary})` : ""}`,
      ),
      html,
      text: report,
    });
    if (!sent) return { ok: false, error: "not_configured" };
    return { ok: true };
  } catch (err) {
    console.error("[review] send failed", err);
    return { ok: false, error: "send_failed" };
  }
}
