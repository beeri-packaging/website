# Contact Inquiry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the contact dialog require name + phone + reason, send each inquiry to `orders@beeripacks.co.il` via Resend, and apply the Figma 538-110 visual refinements.

**Architecture:** A pure validator module is shared by the client form and a server action (single source of truth). The client `ContactDialog` collects fields and calls the `submitContactInquiry` server action, which re-validates and sends through a thin Resend wrapper. Email config is env-driven; missing config returns a typed `not_configured` error so the UI stays testable before Resend is provisioned.

**Tech Stack:** Next.js 16 App Router (Server Actions), React 19, TypeScript strict, Tailwind v4, Resend, Vitest.

**Spec:** `docs/superpowers/specs/2026-06-05-contact-inquiry-design.md`

---

## File Structure

- Create: `lib/contact-inquiry.ts` — types (`ContactInquiryInput`, `ContactReasonValue`, `ContactFieldErrors`, `ContactInquiryResult`) + pure `validateContactInquiry()`. No React, no "use server" — importable from both client and server.
- Create: `lib/contact-inquiry.test.ts` — Vitest unit tests for the validator.
- Create: `lib/email.ts` — thin Resend wrapper (`sendEmail`), isolates the provider.
- Create: `app/actions/contact.ts` — `"use server"` action `submitContactInquiry`.
- Modify: `app/content/contact.ts` — copy: phone/email fields, 3 reasons + placeholder, new errors, new title.
- Modify: `app/components/contact/ContactDialog.tsx` — fields, async submit, errors, honeypot, visual deltas.
- Modify: `.env.example` (create if missing) — document the new env vars.

---

## Task 1: Shared validator (TDD)

**Files:**
- Create: `lib/contact-inquiry.ts`
- Test: `lib/contact-inquiry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/contact-inquiry.test.ts
import { describe, expect, it } from "vitest";
import { validateContactInquiry } from "./contact-inquiry";

const valid = {
  fullName: "דנה כהן",
  phone: "050-1234567",
  email: "",
  company: "",
  reason: "quote" as const,
  details: "",
};

describe("validateContactInquiry", () => {
  it("passes a minimal valid inquiry (name + phone + reason)", () => {
    expect(validateContactInquiry(valid)).toEqual({});
  });

  it("requires a full name", () => {
    expect(validateContactInquiry({ ...valid, fullName: "  " }).fullName).toBeTruthy();
  });

  it("requires a phone with at least 7 digits", () => {
    expect(validateContactInquiry({ ...valid, phone: "" }).phone).toBeTruthy();
    expect(validateContactInquiry({ ...valid, phone: "12345" }).phone).toBeTruthy();
    expect(validateContactInquiry({ ...valid, phone: "+972 50 123 4567" }).phone).toBeUndefined();
  });

  it("requires reason to be one of the three known values", () => {
    expect(validateContactInquiry({ ...valid, reason: "" as never }).reason).toBeTruthy();
    expect(validateContactInquiry({ ...valid, reason: "bogus" as never }).reason).toBeTruthy();
    for (const r of ["quote", "meeting", "other"] as const) {
      expect(validateContactInquiry({ ...valid, reason: r }).reason).toBeUndefined();
    }
  });

  it("allows empty email but rejects a malformed one", () => {
    expect(validateContactInquiry({ ...valid, email: "" }).email).toBeUndefined();
    expect(validateContactInquiry({ ...valid, email: "nope" }).email).toBeTruthy();
    expect(validateContactInquiry({ ...valid, email: "a@b.co" }).email).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/contact-inquiry.test.ts`
Expected: FAIL — cannot resolve `./contact-inquiry`.

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/contact-inquiry.ts
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
  | { ok: false; error: "validation" | "not_configured" | "send_failed"; fieldErrors?: ContactFieldErrors };

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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/contact-inquiry.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/contact-inquiry.ts lib/contact-inquiry.test.ts
git commit -m "feat(contact): shared inquiry validator with unit tests"
```

---

## Task 2: Content copy (he + en)

**Files:**
- Modify: `app/content/contact.ts`

- [ ] **Step 1: Update the `ContactCopy` type** so the `form` block has `phone` and `email`, `reason.options` is the placeholder + three values, and `errors` covers the new fields. Replace the existing `ContactCopy` type and `form`/`errors` shapes:

```ts
import type { Lang } from "@/app/content/home";
import type { ContactReasonValue } from "@/lib/contact-inquiry";

export type ContactReasonOption = { value: ContactReasonValue | ""; label: string };

export type ContactCopy = {
  closeLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  form: {
    fullName: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    reason: { label: string; options: readonly ContactReasonOption[] };
    details: { label: string; placeholder: string };
    submit: string;
    sending: string;
    consent: string;
  };
  errors: {
    fullName: string;
    phone: string;
    reason: string;
    email: string;
    submitFailed: string;
  };
  success: { title: string; body: string; close: string };
};
```

- [ ] **Step 2: Replace the `he` entry** with:

```ts
  he: {
    closeLabel: "סגירה",
    eyebrow: "פנייה לפרויקט",
    title: "בואו נפתח את האריזה.",
    description: "טופס יצירת קשר — השאירו פרטים ונחזור אליכם בהקדם.",
    form: {
      fullName: { label: "שם מלא", placeholder: "דנה כהן" },
      phone: { label: "טלפון", placeholder: "050-1234567" },
      email: { label: "אימייל (לא חובה)", placeholder: "dana@studio.co.il" },
      company: { label: "חברה (לא חובה)", placeholder: "סטודיו לוקס" },
      reason: {
        label: "סיבת הפנייה",
        options: [
          { value: "", label: "בחרו סיבה…" },
          { value: "quote", label: "הצעת מחיר" },
          { value: "meeting", label: 'תיאום פגישה עם מת"ל' },
          { value: "other", label: "אחר" },
        ],
      },
      details: { label: "פרטים נוספים (לא חובה)", placeholder: "ספרו לנו על הפרויקט..." },
      submit: "שליחת פנייה",
      sending: "שולח…",
      consent: "בשליחת הטופס אתם מאשרים את תנאי שיתוף הפעולה והדיוק הטכני שלנו.",
    },
    errors: {
      fullName: "יש להזין שם מלא.",
      phone: "יש להזין מספר טלפון תקין.",
      reason: "יש לבחור סיבת פנייה.",
      email: "כתובת אימייל לא תקינה.",
      submitFailed: "שליחת הפנייה נכשלה. נסו שוב או התקשרו אלינו.",
    },
    success: {
      title: "הפנייה נשלחה",
      body: "תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.",
      close: "סגירה",
    },
  },
```

- [ ] **Step 3: Replace the `en` entry** with:

```ts
  en: {
    closeLabel: "Close",
    eyebrow: "Project inquiry",
    title: "Let's open the box.",
    description: "Contact form — leave your details and we'll get back to you soon.",
    form: {
      fullName: { label: "Full name", placeholder: "Dana Cohen" },
      phone: { label: "Phone", placeholder: "+972 50-123-4567" },
      email: { label: "Email (optional)", placeholder: "dana@studio.co.il" },
      company: { label: "Company (optional)", placeholder: "Studio Lux" },
      reason: {
        label: "Reason for inquiry",
        options: [
          { value: "", label: "Select a reason…" },
          { value: "quote", label: "Price quote" },
          { value: "meeting", label: "Schedule a meeting with an account manager (מת״ל)" },
          { value: "other", label: "Something else" },
        ],
      },
      details: { label: "Further details (optional)", placeholder: "Tell us about the project..." },
      submit: "Send inquiry",
      sending: "Sending…",
      consent: "By submitting, you agree to our collaboration terms and technical accuracy.",
    },
    errors: {
      fullName: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      reason: "Please choose a reason for your inquiry.",
      email: "That email address looks invalid.",
      submitFailed: "Sending failed. Please try again or call us.",
    },
    success: {
      title: "Inquiry sent",
      body: "Thanks! We've got your details and will get back to you shortly.",
      close: "Close",
    },
  },
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: errors only in `ContactDialog.tsx` (it still references the old `contactInfo` field — fixed in Task 4). No errors in `contact.ts`.

- [ ] **Step 5: Commit**

```bash
git add app/content/contact.ts
git commit -m "feat(contact): copy for phone/email fields + 3 reasons + new title"
```

---

## Task 3: Email wrapper + server action

**Files:**
- Create: `lib/email.ts`
- Create: `app/actions/contact.ts`
- Modify: `package.json` (add `resend`)

- [ ] **Step 1: Add the Resend dependency**

Run: `npm install resend`
Expected: `resend` appears under `dependencies`.

- [ ] **Step 2: Create the email wrapper**

```ts
// lib/email.ts
import { Resend } from "resend";

export type SendEmailArgs = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Returns true on success. Throws are caught by the caller. */
export async function sendEmail(args: SendEmailArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false; // signal "not configured" to the caller
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    to: args.to,
    from: args.from,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
  });
  if (error) throw new Error(error.message);
  return true;
}
```

- [ ] **Step 3: Create the server action**

```ts
// app/actions/contact.ts
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
    console.warn("[contact] email not configured (RESEND_API_KEY / CONTACT_FROM_EMAIL)");
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
    .map(([k, v]) => `<tr><td style="padding:4px 12px;color:#4d4632"><b>${k}</b></td><td style="padding:4px 12px">${v.replace(/</g, "&lt;")}</td></tr>`)
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
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no new errors in `lib/email.ts` or `app/actions/contact.ts`.

- [ ] **Step 5: Commit**

```bash
git add lib/email.ts app/actions/contact.ts package.json package-lock.json
git commit -m "feat(contact): Resend email wrapper + submitContactInquiry server action"
```

---

## Task 4: Wire the form (fields, async submit, errors, honeypot)

**Files:**
- Modify: `app/components/contact/ContactDialog.tsx`

- [ ] **Step 1: Replace the imports + component state.** At the top, add the action + validator imports and switch state to track field errors, a submit error, and pending status:

```tsx
"use client";

import { useId, useState, useTransition } from "react";
import type { Lang } from "@/app/content/home";
import { contactCopy } from "@/app/content/contact";
import {
  validateContactInquiry,
  type ContactFieldErrors,
  type ContactInquiryInput,
  type ContactReasonValue,
} from "@/lib/contact-inquiry";
import { submitContactInquiry } from "@/app/actions/contact";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogMain,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowGlyph } from "@/app/components/home/icons";
```

- [ ] **Step 2: Replace the component body state + handlers** (`useState`/`handleOpenChange`/`handleSubmit`) with:

```tsx
  const copy = contactCopy[lang];
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setSubmitted(false);
      setErrors({});
      setSubmitError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: ContactInquiryInput & { company_url: string } = {
      fullName: String(data.get("fullName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      reason: String(data.get("reason") ?? "") as ContactReasonValue | "",
      details: String(data.get("details") ?? "").trim(),
      company_url: String(data.get("company_url") ?? ""),
    };

    const nextErrors = validateContactInquiry(input);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);

    startTransition(async () => {
      const result = await submitContactInquiry(input);
      if (result.ok) {
        setSubmitted(true);
      } else if (result.error === "validation" && result.fieldErrors) {
        setErrors(result.fieldErrors);
      } else {
        setSubmitError(copy.errors.submitFailed);
      }
    });
  }
```

- [ ] **Step 3: Replace the `<form>` body.** Map error keys → localized messages, render the new field set, the honeypot, the reason placeholder, and the submit row with pending state. Replace the whole `<form ...>...</form>`:

```tsx
              <form
                className="grid w-full grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2"
                onSubmit={handleSubmit}
                noValidate
              >
                <Field
                  id={`${formId}-fullName`}
                  name="fullName"
                  label={copy.form.fullName.label}
                  placeholder={copy.form.fullName.placeholder}
                  autoComplete="name"
                  error={errors.fullName ? copy.errors.fullName : undefined}
                />
                <Field
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  dir="ltr"
                  label={copy.form.phone.label}
                  placeholder={copy.form.phone.placeholder}
                  autoComplete="tel"
                  error={errors.phone ? copy.errors.phone : undefined}
                />
                <Field
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  dir="ltr"
                  label={copy.form.email.label}
                  placeholder={copy.form.email.placeholder}
                  autoComplete="email"
                  error={errors.email ? copy.errors.email : undefined}
                />
                <Field
                  id={`${formId}-company`}
                  name="company"
                  label={copy.form.company.label}
                  placeholder={copy.form.company.placeholder}
                  autoComplete="organization"
                />

                {/* Reason — required native select styled as an underline field. */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor={`${formId}-reason`} className={LABEL_CLASS}>
                    {copy.form.reason.label}
                  </label>
                  <div className="relative">
                    <select
                      id={`${formId}-reason`}
                      name="reason"
                      defaultValue=""
                      aria-invalid={errors.reason ? true : undefined}
                      aria-describedby={errors.reason ? `${formId}-reason-error` : undefined}
                      className={`${FIELD_CLASS} cursor-pointer appearance-none pe-10`}
                    >
                      {copy.form.reason.options.map((option) => (
                        <option key={option.value || "placeholder"} value={option.value} disabled={option.value === ""}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronGlyph className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-ink" />
                  </div>
                  {errors.reason ? (
                    <span id={`${formId}-reason-error`} className="font-sans text-[12px] text-magenta">
                      {copy.errors.reason}
                    </span>
                  ) : null}
                </div>

                {/* Further details — full width textarea. */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor={`${formId}-details`} className={LABEL_CLASS}>
                    {copy.form.details.label}
                  </label>
                  <textarea
                    id={`${formId}-details`}
                    name="details"
                    rows={3}
                    placeholder={copy.form.details.placeholder}
                    className={`${FIELD_CLASS} resize-none pb-4`}
                  />
                </div>

                {/* Honeypot — hidden from humans; bots fill it and we drop the send. */}
                <div aria-hidden className="sr-only">
                  <label htmlFor={`${formId}-company_url`}>Leave this field empty</label>
                  <input
                    id={`${formId}-company_url`}
                    name="company_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="mt-2 flex flex-col-reverse items-stretch justify-between gap-6 sm:col-span-2 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-2">
                    <p className="max-w-[320px] font-sans text-[10px] uppercase leading-[1.6] tracking-[0.04em] text-clay text-start">
                      {copy.form.consent}
                    </p>
                    {submitError ? (
                      <p role="alert" className="font-sans text-[12px] text-magenta text-start">
                        {submitError}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className="group inline-flex shrink-0 items-center justify-center gap-3 border border-ink bg-cyan px-12 py-5 font-sans text-[14px] font-bold tracking-[0.08em] text-yellow-deep shadow-[8px_8px_0_var(--yellow)] transition-transform duration-300 hover:-translate-y-0.5 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? copy.form.sending : copy.form.submit}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                    >
                      <ArrowGlyph
                        direction={lang === "he" ? "right-to-left" : "left-to-right"}
                      />
                    </span>
                  </button>
                </div>
              </form>
```

- [ ] **Step 4: Verify lint + types**

Run: `npx tsc --noEmit && npm run lint`
Expected: 0 errors (no remaining reference to `contactInfo`).

- [ ] **Step 5: Commit**

```bash
git add app/components/contact/ContactDialog.tsx
git commit -m "feat(contact): required name/phone/reason, async send, honeypot, cyan button"
```

---

## Task 5: Figma 538-110 header accent + labels

**Files:**
- Modify: `app/components/contact/ContactDialog.tsx`

- [ ] **Step 1: Switch the header accent rule to magenta.** In the `<header>` element, change `border-s-4 border-yellow` to `border-s-4 border-magenta`. (The `SuccessPanel` keeps its yellow rule.)

- [ ] **Step 2: Match the Figma label style.** Replace `LABEL_CLASS` so labels are Open Sans light 16px in clay, right/start aligned (per `Style/Body/Small`):

```tsx
const LABEL_CLASS =
  "font-sans text-[16px] font-light leading-[25px] text-clay text-start";
```

- [ ] **Step 3: Verify lint + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: build succeeds, 0 errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/contact/ContactDialog.tsx
git commit -m "style(contact): magenta header rule + light labels per Figma 538-110"
```

---

## Task 6: Env docs + full verification

**Files:**
- Create/Modify: `.env.example`

- [ ] **Step 1: Document the new env vars.** Append to `.env.example` (create it if absent):

```
# Contact form delivery (Resend — https://resend.com)
RESEND_API_KEY=
CONTACT_TO_EMAIL=orders@beeripacks.co.il
CONTACT_FROM_EMAIL=inquiries@beeripacks.co.il
```

- [ ] **Step 2: Run the full gate**

Run: `npm run test && npx tsc --noEmit && npm run lint && npm run build`
Expected: all green.

- [ ] **Step 3: Visual + behavior check (preview).** Start the dev server, open the contact dialog on `/he` and `/en`:
  - Submit empty → inline errors on name, phone, reason; no send.
  - Fill name + phone + reason → without Resend config, the consent area shows `submitFailed`; with config, the success panel renders.
  - Bad email → email error; empty email → allowed.
  - Header rule is magenta; submit button is cyan with the yellow offset shadow; headline reads "בואו נפתח את האריזה.".

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "docs(contact): document Resend env vars"
```

---

## Self-Review

- **Spec coverage:** required name/phone/reason (Task 1 validator + Task 4 form); 3 reason options (Task 2); email→orders@beeripacks.co.il via Resend (Task 3); optional email field (Tasks 2+4); Figma deltas — title (Task 2), magenta rule + cyan button + labels (Tasks 4+5). All covered.
- **Type consistency:** `ContactInquiryInput`, `ContactReasonValue`, `ContactFieldErrors`, `ContactInquiryResult`, `validateContactInquiry`, `submitContactInquiry`, `sendEmail` are defined once (Tasks 1+3) and reused with identical signatures in Tasks 2+4.
- **Placeholders:** none — every code step is complete.
