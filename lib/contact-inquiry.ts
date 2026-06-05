export const CONTACT_REASONS = ["quote", "meeting", "other"] as const;
export type ContactReasonValue = (typeof CONTACT_REASONS)[number];

export type ContactInquiryInput = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  reason: ContactReasonValue | "";
  details: string;
};

export type ContactFieldErrors = Partial<
  Record<"fullName" | "phone" | "email" | "reason", string>
>;

export type ContactInquiryResult =
  | { ok: true }
  | {
      ok: false;
      error: "validation" | "not_configured" | "send_failed";
      fieldErrors?: ContactFieldErrors;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Pure, side-effect-free. Empty object means "valid". Shared by client + server. */
export function validateContactInquiry(input: ContactInquiryInput): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (input.fullName.trim().length < 2) errors.fullName = "required";

  const digits = input.phone.replace(/[^\d]/g, "");
  if (digits.length < 7) errors.phone = "required";

  if (!CONTACT_REASONS.includes(input.reason as ContactReasonValue)) errors.reason = "required";

  const email = input.email.trim();
  if (email.length > 0 && !EMAIL_RE.test(email)) errors.email = "invalid";

  return errors;
}
