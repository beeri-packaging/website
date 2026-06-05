# Contact inquiry — required fields, email delivery, and Figma 538-110 polish

**Date:** 2026-06-05
**Status:** Approved (design), pending implementation
**Figma:** `rG47DaHUNqAnPtHiUATXDG` node `538-110` — "כרטיס פנייה — RTL (Hebrew)"

## Problem

The global contact dialog (`app/components/contact/ContactDialog.tsx`) is visually
close to the brand but functionally incomplete:

- It only validates **full name** and a generic **contact info** field.
- It offers **5** reason options; the business wants **3**.
- On submit it does nothing real — it `console.info`s the payload and shows a
  success panel. **No email is ever sent.**

The business requirement (from the owner, Hebrew):

> שדות חובה: שם, טלפון, סיבת פנייה (בחירה: הצעת מחיר, תיאום פגישה עם מת"ל, אחר).
> בלי זה לא ניתן לשלוח. הפנייה אמורה להגיע למייל של המשל"ט: **orders@beeripacks.co.il**

Additionally, the latest Figma (538-110) refines the visual: new headline, a
magenta accent rule, and a cyan submit button.

## Goals

1. **Required fields:** name, phone, and reason-for-inquiry. Submission is blocked
   (client + server) until all three are valid.
2. **Reason options — exactly three:** הצעת מחיר · תיאום פגישה עם מת"ל · אחר.
3. **Real delivery:** the inquiry is emailed to `orders@beeripacks.co.il` (the
   משל"ט / dispatch inbox) via Resend.
4. **Apply Figma 538-110 visual deltas** without regressing the rest of the design.

## Non-goals

- CRM / Sanity persistence of inquiries (email only for now).
- Spam protection beyond basic honeypot (can follow up later).
- Changing how the dialog is opened (`ContactTriggerButton` / provider stay as-is).

## Decisions (from brainstorming)

- **Delivery mechanism:** Resend (Vercel-native, good deliverability).
- **Contact fields:** phone is **required**; email is an **optional** extra field
  so the team can reply by either channel.
- **English label for מת"ל:** "Schedule a meeting with an account manager (מת״ל)".

## Design

### 1. Content (`app/content/contact.ts`)

Extend `ContactCopy` so the field set is: `fullName` (req), `phone` (req),
`email` (opt), `company` (opt), `reason` (req), `details` (opt).

- Add `phone` and `email` field copy (label + placeholder) for `he` and `en`.
- Replace the 5 reason options with **3**, plus a non-selectable placeholder
  option used as the empty default:
  - placeholder: `{ value: "", label: "בחרו סיבה…" / "Select a reason…" }`
  - `{ value: "quote", label: "הצעת מחיר" / "Price quote" }`
  - `{ value: "meeting", label: "תיאום פגישה עם מת\"ל" / "Schedule a meeting with an account manager (מת״ל)" }`
  - `{ value: "other", label: "אחר" / "Something else" }`
- Extend `errors` to include `phone` and `reason` (and an optional `email` format
  message). Add a top-level `errors.submitFailed` string for server failures.
- Update the headline `title` to **"בואו נפתח את האריזה."** (en: "Let's open the box.").

### 2. Form component (`app/components/contact/ContactDialog.tsx`)

- **Fields & grid** (2-col, preserving the Figma rhythm):
  - Row 1: name (req) | phone (req, `type=tel`, `dir=ltr`)
  - Row 2: email (opt, `type=email`, `dir=ltr`) | company (opt)
  - Row 3: reason (req `select`, placeholder default)
  - Row 4: details (opt textarea, full width)
  - Row 5: submit row (button + consent)
- **Validation** (`validate(payload)` pure helper, shared shape with the server):
  - name: non-empty
  - phone: non-empty, passes a loose phone regex (digits, spaces, `+`, `-`, `()`)
  - reason: must be one of the three non-empty values
  - email: if provided, must look like an email; empty is allowed
  - Errors render inline under each field; first invalid field is focused.
- **Submit flow:** `async` handler calls the `submitContactInquiry` Server Action.
  - While pending: button shows a sending label and is `disabled` (`aria-busy`).
  - On `{ ok: true }`: show existing `SuccessPanel`.
  - On `{ ok: false }`: show a non-blocking error message near the submit row
    (`copy.errors.submitFailed`), keep the form filled so the user can retry.
- **Honeypot:** a visually-hidden `company_url` field; if filled, the action
  silently returns success without sending.

### 3. Server Action (`app/actions/contact.ts`, `"use server"`)

```
submitContactInquiry(input: ContactInquiryInput): Promise<ContactInquiryResult>
```

- Re-validates with the same rules (authoritative; never trust the client).
- Reads config from env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
  - If `RESEND_API_KEY` is missing → return `{ ok: false, error: "not_configured" }`
    and `console.warn` (so the UI is testable before Resend is set up).
- Sends via Resend:
  - `to`: `CONTACT_TO_EMAIL` (default `orders@beeripacks.co.il`)
  - `from`: `CONTACT_FROM_EMAIL` (verified-domain sender)
  - `replyTo`: submitter email if present, else omitted
  - `subject`: `פנייה חדשה מהאתר — <reason label> — <name>`
  - body: a small HTML + text block listing every field (Hebrew labels).
- Returns `{ ok: true }` or `{ ok: false, error }`. Errors are logged server-side;
  the client only ever sees a generic failure message.

### 4. Email transport (`lib/email.ts` — thin wrapper, optional)

Keep the Resend client creation in one place so swapping providers later touches
one file. The Server Action imports `sendEmail(...)` from here.

### 5. Figma 538-110 visual deltas

- Headline copy → "בואו נפתח את האריזה." (done in content).
- Header accent rule: `border-s-4 border-yellow` → `border-s-4 border-magenta`.
- Submit button: `bg-yellow … text-yellow-deep` → `bg-cyan border border-ink
  text-yellow-deep shadow-[8px_8px_0_var(--yellow)]` (cyan fill, yellow offset
  shadow, ink border — per Figma `#0ff` + `#ffd400` shadow).
- Labels: match Figma `Style/Body/Small` (Open Sans Light 16px, right-aligned,
  `text-clay`) instead of the current 11px uppercase. Eyebrow stays uppercase.

## Environment / ops (owner action required)

Add to `.env.local` (and Vercel project env):

```
RESEND_API_KEY=...                      # from resend.com
CONTACT_TO_EMAIL=orders@beeripacks.co.il
CONTACT_FROM_EMAIL=inquiries@beeripacks.co.il   # must be on a Resend-verified domain
```

Resend domain `beeripacks.co.il` must be verified (DNS: SPF/DKIM) before real
sends succeed. Until then the action returns `not_configured` and the UI shows the
failure message — everything else is fully testable.

## Verification

- `npm run lint` + `tsc --noEmit` + `npm run build` — 0 errors.
- Preview `/he` and `/en`: open dialog, submit empty → 3 required errors block
  send; fill name+phone+reason → success path; invalid email → email error.
- Visual: headline, magenta rule, cyan button match Figma 538-110.
- A11y: each field has a label + `aria-invalid`/`aria-describedby`; no serious axe
  violations; dialog focus management unchanged.
