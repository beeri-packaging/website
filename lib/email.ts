import { Resend } from "resend";

export type EmailAttachment = {
  filename: string;
  /** Raw file bytes; Resend accepts a Buffer here. */
  content: Buffer;
};

export type SendEmailArgs = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

/**
 * Thin Resend wrapper — the single place the email provider is referenced, so
 * swapping providers later touches only this file. Returns `false` when no API
 * key is configured (the caller treats that as "not configured"); throws on a
 * provider-reported send error.
 */
export async function sendEmail(args: SendEmailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    to: args.to,
    from: args.from,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
    attachments: args.attachments,
  });
  if (error) throw new Error(error.message);
  return true;
}
